import { DayKey } from "../types";

export function isoToday() {
  return new Date().toISOString().slice(0, 10);
}

export function weekdayKey(date = new Date()): DayKey {
  const day = date.getDay();
  return (["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as DayKey[])[day];
}

export function humanDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(new Date(iso));
}

export function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
