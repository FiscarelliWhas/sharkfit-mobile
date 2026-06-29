import AsyncStorage from "@react-native-async-storage/async-storage";
import { initialState } from "../data/constants";
import { AppState } from "../types";

const key = "@sharkfit75/state";

export async function loadState(): Promise<AppState> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return initialState;
  const parsed = JSON.parse(raw) as AppState;
  return {
    ...initialState,
    ...parsed,
    profile: { ...initialState.profile, ...(parsed.profile ?? {}) },
    currentWeight: parsed.currentWeight ?? parsed.profile?.currentWeight ?? initialState.currentWeight,
    goalWeight: parsed.goalWeight ?? parsed.profile?.goalWeight ?? initialState.goalWeight,
    height: parsed.height ?? parsed.profile?.height ?? initialState.height,
    waterGoalMl: parsed.waterGoalMl ?? parsed.profile?.waterGoalMl ?? initialState.waterGoalMl,
    motivations: parsed.motivations ?? initialState.motivations,
    routine: parsed.routine ?? initialState.routine,
    reminders: parsed.reminders ?? initialState.reminders,
    achievements: parsed.achievements ?? initialState.achievements,
    completionMessage: parsed.completionMessage ?? initialState.completionMessage,
    stock: parsed.stock ?? initialState.stock,
    recipes: parsed.recipes ?? initialState.recipes,
    weights: parsed.weights ?? initialState.weights,
    dailyLogs: parsed.dailyLogs ?? {},
    marketChecked: parsed.marketChecked ?? {}
  };
}

export async function saveState(state: AppState) {
  await AsyncStorage.setItem(key, JSON.stringify(state));
}
