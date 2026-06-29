export type MealKey = "breakfast" | "lunch" | "snack" | "dinner";
export type DayKey = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
export type RecipeCategory = "Cafe da manha" | "Almoco" | "Lanche" | "Jantar" | "Livre";
export type RoutineType = "meal" | "workout" | "free";
export type ReminderFrequency = "daily" | "weekly";

export type UserProfile = {
  name: string;
  appTitle: string;
  slogan: string;
  currentWeight: number;
  goalWeight: number;
  startWeight: number;
  height: number;
  waterGoalMl: number;
  preferences: string;
};

export type RoutineItem = {
  id: string;
  time: string;
  title: string;
  detail: string;
  type: RoutineType;
};

export type Reminder = {
  id: string;
  enabled: boolean;
  frequency: ReminderFrequency;
  day?: DayKey;
  hour: number;
  minute: number;
  title: string;
  body: string;
};

export type Achievement = {
  id: string;
  days: number;
  icon: string;
  label: string;
};

export type StockItem = {
  id: string;
  name: string;
  quantity: number;
  initialQuantity: number;
  unit: string;
  group: string;
  marketDefault: number;
};

export type RecipeIngredient = {
  stockId: string;
  label: string;
  amount: number;
};

export type Recipe = {
  id: string;
  name: string;
  category: RecipeCategory;
  ingredients: RecipeIngredient[];
  ingredientText: string;
  instructions: string;
  prepTime: string;
  notes: string;
  photoUri?: string;
  favorite: boolean;
  consumedCount: number;
};

export type WeightEntry = {
  id: string;
  date: string;
  weight: number;
  note: string;
};

export type DailyLog = {
  date: string;
  checklist: Record<MealKey | "water" | "workout", boolean>;
  waterMl: number;
  consumedRecipeIds: string[];
};

export type AppState = {
  profile: UserProfile;
  currentWeight: number;
  goalWeight: number;
  height: number;
  waterGoalMl: number;
  motivations: string[];
  routine: Record<DayKey, RoutineItem[]>;
  reminders: Reminder[];
  achievements: Achievement[];
  completionMessage: string;
  streak: number;
  bestStreak: number;
  stock: StockItem[];
  recipes: Recipe[];
  weights: WeightEntry[];
  dailyLogs: Record<string, DailyLog>;
  marketChecked: Record<string, boolean>;
  notificationsScheduled: boolean;
};

export type ShoppingItem = StockItem & {
  low: boolean;
  percent: number;
};
