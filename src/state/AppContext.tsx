import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { initialState } from "../data/constants";
import { setupNotifications } from "../services/notifications";
import { loadState, saveState } from "../services/storage";
import { Achievement, AppState, DailyLog, MealKey, Recipe, Reminder, RoutineItem, StockItem, UserProfile } from "../types";
import { createId, isoToday } from "../utils/date";
import { isDailyComplete } from "../utils/progress";

type AppContextValue = {
  state: AppState;
  todayLog: DailyLog;
  isReady: boolean;
  toggleChecklist: (key: MealKey | "water" | "workout", hasWorkout: boolean) => void;
  addWater: (amount: number, hasWorkout: boolean) => void;
  addWeight: (weight: number, note: string) => void;
  updateProfile: (profile: UserProfile) => void;
  updateMotivations: (motivations: string[]) => void;
  updateCompletionMessage: (message: string) => void;
  saveRoutineItem: (day: keyof AppState["routine"], item: RoutineItem) => void;
  deleteRoutineItem: (day: keyof AppState["routine"], id: string) => void;
  saveStockItem: (item: StockItem) => void;
  deleteStockItem: (id: string) => void;
  saveReminder: (reminder: Reminder) => void;
  deleteReminder: (id: string) => void;
  saveAchievement: (achievement: Achievement) => void;
  deleteAchievement: (id: string) => void;
  saveRecipe: (recipe: Recipe) => void;
  deleteRecipe: (id: string) => void;
  duplicateRecipe: (id: string) => void;
  toggleFavorite: (id: string) => void;
  consumeRecipe: (id: string, hasWorkout: boolean) => void;
  toggleMarketItem: (id: string) => void;
  completeMarket: () => void;
  scheduleNotifications: () => Promise<boolean>;
};

const AppContext = createContext<AppContextValue | null>(null);

const emptyChecklist: DailyLog["checklist"] = {
  breakfast: false,
  lunch: false,
  snack: false,
  dinner: false,
  water: false,
  workout: false
};

function ensureToday(state: AppState) {
  const today = isoToday();
  return (
    state.dailyLogs[today] ?? {
      date: today,
      checklist: { ...emptyChecklist },
      waterMl: 0,
      consumedRecipeIds: []
    }
  );
}

function applyStreak(state: AppState, log: DailyLog, hasWorkout: boolean): AppState {
  const complete = isDailyComplete(log, hasWorkout, state.waterGoalMl);
  const nextStreak = complete ? Math.max(1, state.streak || 0) : state.streak;
  return { ...state, streak: nextStreak, bestStreak: Math.max(state.bestStreak, nextStreak) };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    loadState()
      .then(setState)
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (isReady) {
      saveState(state).catch(() => undefined);
    }
  }, [state, isReady]);

  const todayLog = ensureToday(state);

  function mutate(updater: (draft: AppState, log: DailyLog) => AppState, hasWorkout = true) {
    setState((current) => {
      const log = ensureToday(current);
      const withToday = {
        ...current,
        dailyLogs: { ...current.dailyLogs, [log.date]: log }
      };
      const next = updater(withToday, log);
      const finalLog = ensureToday(next);
      return applyStreak(next, finalLog, hasWorkout);
    });
  }

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      todayLog,
      isReady,
      toggleChecklist: (key, hasWorkout) =>
        mutate((draft, log) => {
          const nextLog = {
            ...log,
            checklist: { ...log.checklist, [key]: !log.checklist[key] }
          };
          if (key === "water" && !nextLog.checklist.water && nextLog.waterMl >= draft.waterGoalMl) {
            nextLog.waterMl = Math.max(0, draft.waterGoalMl - 250);
          }
          return { ...draft, dailyLogs: { ...draft.dailyLogs, [log.date]: nextLog } };
        }, hasWorkout),
      addWater: (amount, hasWorkout) =>
        mutate((draft, log) => {
          const waterMl = Math.min(draft.waterGoalMl, log.waterMl + amount);
          const nextLog = {
            ...log,
            waterMl,
            checklist: { ...log.checklist, water: waterMl >= draft.waterGoalMl }
          };
          return { ...draft, dailyLogs: { ...draft.dailyLogs, [log.date]: nextLog } };
        }, hasWorkout),
      addWeight: (weight, note) =>
        setState((current) => ({
          ...current,
          currentWeight: weight,
          profile: { ...current.profile, currentWeight: weight },
          weights: [{ id: createId("peso"), date: new Date().toISOString(), weight, note }, ...current.weights]
        })),
      updateProfile: (profile) =>
        setState((current) => ({
          ...current,
          profile,
          currentWeight: profile.currentWeight,
          goalWeight: profile.goalWeight,
          height: profile.height,
          waterGoalMl: profile.waterGoalMl
        })),
      updateMotivations: (motivationList) =>
        setState((current) => ({
          ...current,
          motivations: motivationList.filter((item) => item.trim().length > 0)
        })),
      updateCompletionMessage: (message) =>
        setState((current) => ({
          ...current,
          completionMessage: message
        })),
      saveRoutineItem: (day, item) =>
        setState((current) => {
          const list = current.routine[day] ?? [];
          const exists = list.some((entry) => entry.id === item.id);
          return {
            ...current,
            routine: {
              ...current.routine,
              [day]: exists ? list.map((entry) => (entry.id === item.id ? item : entry)) : [...list, item].sort((a, b) => a.time.localeCompare(b.time))
            }
          };
        }),
      deleteRoutineItem: (day, id) =>
        setState((current) => ({
          ...current,
          routine: { ...current.routine, [day]: current.routine[day].filter((item) => item.id !== id) }
        })),
      saveStockItem: (item) =>
        setState((current) => {
          const exists = current.stock.some((entry) => entry.id === item.id);
          return {
            ...current,
            stock: exists ? current.stock.map((entry) => (entry.id === item.id ? item : entry)) : [item, ...current.stock]
          };
        }),
      deleteStockItem: (id) =>
        setState((current) => ({
          ...current,
          stock: current.stock.filter((item) => item.id !== id),
          marketChecked: Object.fromEntries(Object.entries(current.marketChecked).filter(([key]) => key !== id))
        })),
      saveReminder: (reminder) =>
        setState((current) => {
          const exists = current.reminders.some((entry) => entry.id === reminder.id);
          return {
            ...current,
            notificationsScheduled: false,
            reminders: exists ? current.reminders.map((entry) => (entry.id === reminder.id ? reminder : entry)) : [reminder, ...current.reminders]
          };
        }),
      deleteReminder: (id) =>
        setState((current) => ({
          ...current,
          notificationsScheduled: false,
          reminders: current.reminders.filter((item) => item.id !== id)
        })),
      saveAchievement: (achievement) =>
        setState((current) => {
          const exists = current.achievements.some((entry) => entry.id === achievement.id);
          return {
            ...current,
            achievements: exists
              ? current.achievements.map((entry) => (entry.id === achievement.id ? achievement : entry))
              : [...current.achievements, achievement].sort((a, b) => a.days - b.days)
          };
        }),
      deleteAchievement: (id) =>
        setState((current) => ({
          ...current,
          achievements: current.achievements.filter((item) => item.id !== id)
        })),
      saveRecipe: (recipe) =>
        setState((current) => {
          const exists = current.recipes.some((item) => item.id === recipe.id);
          return {
            ...current,
            recipes: exists
              ? current.recipes.map((item) => (item.id === recipe.id ? recipe : item))
              : [recipe, ...current.recipes]
          };
        }),
      deleteRecipe: (id) =>
        setState((current) => ({
          ...current,
          recipes: current.recipes.filter((recipe) => recipe.id !== id)
        })),
      duplicateRecipe: (id) =>
        setState((current) => {
          const recipe = current.recipes.find((item) => item.id === id);
          if (!recipe) return current;
          return {
            ...current,
            recipes: [{ ...recipe, id: createId("receita"), name: `${recipe.name} cópia`, favorite: false }, ...current.recipes]
          };
        }),
      toggleFavorite: (id) =>
        setState((current) => ({
          ...current,
          recipes: current.recipes.map((recipe) => (recipe.id === id ? { ...recipe, favorite: !recipe.favorite } : recipe))
        })),
      consumeRecipe: (id, hasWorkout) =>
        mutate((draft, log) => {
          const recipe = draft.recipes.find((item) => item.id === id);
          if (!recipe) return draft;
          const stock = draft.stock.map((item) => {
            const ingredient = recipe.ingredients.find((entry) => entry.stockId === item.id);
            if (!ingredient) return item;
            return { ...item, quantity: Math.max(0, Number((item.quantity - ingredient.amount).toFixed(2))) };
          });
          const nextLog = { ...log, consumedRecipeIds: [...log.consumedRecipeIds, id] };
          return {
            ...draft,
            stock,
            recipes: draft.recipes.map((item) => (item.id === id ? { ...item, consumedCount: item.consumedCount + 1 } : item)),
            dailyLogs: { ...draft.dailyLogs, [log.date]: nextLog }
          };
        }, hasWorkout),
      toggleMarketItem: (id) =>
        setState((current) => ({
          ...current,
          marketChecked: { ...current.marketChecked, [id]: !current.marketChecked[id] }
        })),
      completeMarket: () =>
        setState((current) => ({
          ...current,
          stock: current.stock.map((item) =>
            current.marketChecked[item.id]
              ? { ...item, quantity: Math.max(item.quantity, item.marketDefault), initialQuantity: Math.max(item.initialQuantity, item.marketDefault) }
              : item
          ),
          marketChecked: {}
        })),
      scheduleNotifications: async () => {
        const ok = await setupNotifications(state.reminders);
        if (ok) {
          setState((current) => ({ ...current, notificationsScheduled: true }));
        }
        return ok;
      }
    }),
    [state, todayLog, isReady]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
}
