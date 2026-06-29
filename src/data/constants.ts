import { AppState, DayKey, Recipe, Reminder, RoutineItem } from "../types";

export const waterGoalMl = 3000;
export const initialWeight = 82;
export const goalWeight = 75;
export const height = 1.63;

export const dayNames: Record<DayKey, string> = {
  monday: "Segunda",
  tuesday: "Terca",
  wednesday: "Quarta",
  thursday: "Quinta",
  friday: "Sexta",
  saturday: "Sabado",
  sunday: "Domingo"
};

export const dayOrder: DayKey[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export const motivations = [
  "Continue nadando.",
  "Um dia de cada vez.",
  "Consistencia vence motivacao.",
  "Seu objetivo esta mais perto do que ontem.",
  "Pequenas vitorias constroem grandes resultados."
];

export const routine: Record<DayKey, RoutineItem[]> = {
  monday: [
    { id: "mon-0630", time: "06:30", title: "Omelete + fruta", detail: "Cafe da manha leve e consistente.", type: "meal" },
    { id: "mon-1200", time: "12:00", title: "Arroz, feijao, salada e proteina", detail: "Priorize frango, ovos ou proteina magra.", type: "meal" },
    { id: "mon-1630", time: "16:30", title: "Barrinha, maca ou 2 ovos", detail: "Escolha uma opcao pratica.", type: "meal" },
    { id: "mon-2015", time: "20:15", title: "Kung Fu", detail: "Hora de afiar os dentes.", type: "workout" },
    { id: "mon-2130", time: "21:30", title: "Rap10 + frango + salada", detail: "Jantar pos-treino.", type: "meal" }
  ],
  tuesday: [
    { id: "tue-0630", time: "06:30", title: "Omelete + fruta", detail: "Sem banana. Maca ou pera.", type: "meal" },
    { id: "tue-1200", time: "12:00", title: "Almoco saudavel", detail: "Monte um prato simples e colorido.", type: "meal" },
    { id: "tue-1630", time: "16:30", title: "Barrinha ou fruta", detail: "Evite improvisar com fome.", type: "meal" },
    { id: "tue-1830", time: "18:30", title: "Academia", detail: "Treino das 18:30 as 19:30.", type: "workout" },
    { id: "tue-2000", time: "20:00", title: "Rap10 + frango + salada", detail: "Jantar rapido.", type: "meal" }
  ],
  wednesday: [
    { id: "wed-0630", time: "06:30", title: "Omelete + fruta", detail: "Cafe da manha leve e consistente.", type: "meal" },
    { id: "wed-1200", time: "12:00", title: "Arroz, feijao, salada e proteina", detail: "Priorize frango, ovos ou proteina magra.", type: "meal" },
    { id: "wed-1630", time: "16:30", title: "Barrinha, maca ou 2 ovos", detail: "Escolha uma opcao pratica.", type: "meal" },
    { id: "wed-2015", time: "20:15", title: "Kung Fu", detail: "Hora de afiar os dentes.", type: "workout" },
    { id: "wed-2130", time: "21:30", title: "Rap10 + frango + salada", detail: "Jantar pos-treino.", type: "meal" }
  ],
  thursday: [
    { id: "thu-0630", time: "06:30", title: "Omelete + fruta", detail: "Sem banana. Maca ou pera.", type: "meal" },
    { id: "thu-1200", time: "12:00", title: "Almoco saudavel", detail: "Monte um prato simples e colorido.", type: "meal" },
    { id: "thu-1630", time: "16:30", title: "Barrinha ou fruta", detail: "Evite improvisar com fome.", type: "meal" },
    { id: "thu-1830", time: "18:30", title: "Academia", detail: "Treino das 18:30 as 19:30.", type: "workout" },
    { id: "thu-2000", time: "20:00", title: "Rap10 + frango + salada", detail: "Jantar rapido.", type: "meal" }
  ],
  friday: [
    { id: "fri-0630", time: "06:30", title: "Omelete + fruta", detail: "Cafe da manha leve e consistente.", type: "meal" },
    { id: "fri-1200", time: "12:00", title: "Arroz, feijao, salada e proteina", detail: "Priorize frango, ovos ou proteina magra.", type: "meal" },
    { id: "fri-1630", time: "16:30", title: "Barrinha, maca ou 2 ovos", detail: "Escolha uma opcao pratica.", type: "meal" },
    { id: "fri-2015", time: "20:15", title: "Kung Fu", detail: "Hora de afiar os dentes.", type: "workout" },
    { id: "fri-2130", time: "21:30", title: "Rap10 + frango + salada", detail: "Jantar pos-treino.", type: "meal" }
  ],
  saturday: [{ id: "sat-free", time: "08:00", title: "Alimentacao saudavel", detail: "Sem treino obrigatorio.", type: "free" }],
  sunday: [{ id: "sun-free", time: "08:00", title: "Alimentacao saudavel", detail: "Sem treino obrigatorio.", type: "free" }]
};

export const achievements = [
  { id: "3", days: 3, icon: "🥉", label: "3 dias" },
  { id: "7", days: 7, icon: "🥈", label: "7 dias" },
  { id: "15", days: 15, icon: "🥇", label: "15 dias" },
  { id: "30", days: 30, icon: "🏆", label: "30 dias" },
  { id: "60", days: 60, icon: "👑", label: "60 dias" },
  { id: "90", days: 90, icon: "🔥", label: "90 dias" }
];

export const defaultReminders: Reminder[] = [
  { id: "breakfast", enabled: true, frequency: "daily", hour: 6, minute: 30, title: "🍳 Hora do cafe da manha", body: "Comece o dia com uma escolha simples." },
  { id: "lunch", enabled: true, frequency: "daily", hour: 12, minute: 0, title: "🥗 Hora do almoco", body: "Monte seu prato saudavel, sem contar calorias." },
  { id: "snack", enabled: true, frequency: "daily", hour: 16, minute: 30, title: "🍎 Hora do lanche", body: "Tenha uma opcao pratica por perto." },
  { id: "dinner", enabled: true, frequency: "daily", hour: 20, minute: 0, title: "🌯 Hora do jantar", body: "Feche o dia com uma refeicao leve." },
  { id: "water-8", enabled: true, frequency: "daily", hour: 8, minute: 0, title: "💧 Hidratacao", body: "Beba agua e siga em frente." },
  { id: "water-10", enabled: true, frequency: "daily", hour: 10, minute: 0, title: "💧 Hidratacao", body: "Beba agua e siga em frente." },
  { id: "water-14", enabled: true, frequency: "daily", hour: 14, minute: 0, title: "💧 Hidratacao", body: "Beba agua e siga em frente." },
  { id: "weigh", enabled: true, frequency: "weekly", day: "monday", hour: 7, minute: 0, title: "⚖️ Pesagem semanal", body: "Registre peso, data e observacao." },
  { id: "shopping", enabled: true, frequency: "weekly", day: "saturday", hour: 9, minute: 0, title: "📋 Revisar compras", body: "Confira estoque e planeje a semana." }
];

export const defaultRecipes: Recipe[] = [
  {
    id: "rap10-frango-salada",
    name: "Rap10 Tubarao com Frango",
    category: "Jantar",
    ingredients: [
      { stockId: "rap10", label: "Rap10 Integral", amount: 1 },
      { stockId: "frango", label: "Frango desfiado", amount: 0.15 },
      { stockId: "alface", label: "Alface", amount: 0.12 },
      { stockId: "tomate", label: "Tomate", amount: 1 },
      { stockId: "cebola", label: "Cebola", amount: 0.25 }
    ],
    ingredientText: "Rap10 Integral, frango desfiado, alface, tomate e cebola.",
    instructions: "Aqueça o Rap10, recheie com frango e salada, dobre e finalize na Air Fryer por 3 minutos.",
    prepTime: "12 min",
    notes: "Otimo para jantar ou pos-treino.",
    favorite: true,
    consumedCount: 0
  },
  {
    id: "omelete-oceano",
    name: "Omelete Oceano",
    category: "Cafe da manha",
    ingredients: [
      { stockId: "ovos", label: "Ovos", amount: 2 },
      { stockId: "tomate", label: "Tomate", amount: 0.5 },
      { stockId: "cebola", label: "Cebola", amount: 0.2 },
      { stockId: "cenoura", label: "Cenoura ralada", amount: 0.25 }
    ],
    ingredientText: "2 ovos, tomate, cebola e cenoura ralada.",
    instructions: "Bata os ovos, misture os vegetais picados e prepare em frigideira antiaderente.",
    prepTime: "10 min",
    notes: "Combine com maca ou pera.",
    favorite: true,
    consumedCount: 0
  }
];

export const initialState: AppState = {
  profile: {
    name: "Usuario",
    appTitle: "SharkFit 75",
    slogan: "Continue nadando em direcao a sua meta.",
    currentWeight: initialWeight,
    goalWeight,
    startWeight: initialWeight,
    height,
    waterGoalMl,
    preferences: "Nao gosta de banana, peixe e carne vermelha. Possui Air Fryer."
  },
  currentWeight: initialWeight,
  goalWeight,
  height,
  waterGoalMl,
  motivations,
  routine,
  reminders: defaultReminders,
  achievements,
  completionMessage: "🦈 Mais um dia vencido. Continue nadando.",
  streak: 0,
  bestStreak: 0,
  stock: [
    { id: "ovos", name: "Ovos", quantity: 30, initialQuantity: 30, unit: "un", group: "Proteinas", marketDefault: 30 },
    { id: "frango", name: "Peito de frango", quantity: 2, initialQuantity: 2, unit: "kg", group: "Proteinas", marketDefault: 2 },
    { id: "barrinhas", name: "Barrinhas de proteina", quantity: 12, initialQuantity: 12, unit: "un", group: "Proteinas", marketDefault: 12 },
    { id: "macas", name: "Macas", quantity: 7, initialQuantity: 7, unit: "un", group: "Frutas", marketDefault: 7 },
    { id: "peras", name: "Peras", quantity: 7, initialQuantity: 7, unit: "un", group: "Frutas", marketDefault: 7 },
    { id: "alface", name: "Alface", quantity: 2, initialQuantity: 2, unit: "pes", group: "Verduras e legumes", marketDefault: 2 },
    { id: "tomate", name: "Tomates", quantity: 8, initialQuantity: 8, unit: "un", group: "Verduras e legumes", marketDefault: 8 },
    { id: "cebola", name: "Cebolas", quantity: 4, initialQuantity: 4, unit: "un", group: "Verduras e legumes", marketDefault: 4 },
    { id: "cenoura", name: "Cenouras", quantity: 5, initialQuantity: 5, unit: "un", group: "Verduras e legumes", marketDefault: 5 },
    { id: "rap10", name: "Rap10 Integral", quantity: 2, initialQuantity: 2, unit: "pct", group: "Outros", marketDefault: 2 }
  ],
  recipes: defaultRecipes,
  weights: [{ id: "initial", date: new Date().toISOString(), weight: initialWeight, note: "Peso inicial" }],
  dailyLogs: {},
  marketChecked: {},
  notificationsScheduled: false
};
