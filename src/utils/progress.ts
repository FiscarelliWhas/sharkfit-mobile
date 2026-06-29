import { DailyLog, ShoppingItem, StockItem } from "../types";

export function percent(value: number, max: number) {
  if (max <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((value / max) * 100)));
}

export function dayCompletion(log: DailyLog, hasWorkout: boolean) {
  const keys = hasWorkout
    ? ["breakfast", "lunch", "snack", "dinner", "water", "workout"]
    : ["breakfast", "lunch", "snack", "dinner", "water"];
  const done = keys.filter((key) => log.checklist[key as keyof DailyLog["checklist"]]).length;
  return percent(done, keys.length);
}

export function isDailyComplete(log: DailyLog, hasWorkout: boolean, waterGoalMl: number) {
  return dayCompletion(log, hasWorkout) === 100 && log.waterMl >= waterGoalMl;
}

export function shoppingItems(stock: StockItem[]): ShoppingItem[] {
  return stock.map((item) => {
    const itemPercent = percent(item.quantity, item.initialQuantity);
    return { ...item, percent: itemPercent, low: itemPercent < 30 };
  });
}
