export type LocalBooking = {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  createdAt: string;
};

const KEY = "luka.bookings.v1";

export function getLocalBookings(): LocalBooking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as LocalBooking[]) : [];
  } catch {
    return [];
  }
}

export function addLocalBooking(b: Omit<LocalBooking, "id" | "createdAt">): LocalBooking {
  const entry: LocalBooking = {
    ...b,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const all = [entry, ...getLocalBookings()];
  window.localStorage.setItem(KEY, JSON.stringify(all));
  window.dispatchEvent(new CustomEvent("luka:bookings-updated"));
  return entry;
}

export function clearLocalBookings() {
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent("luka:bookings-updated"));
}

export function useBookingsTrigger(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener("luka:bookings-updated", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("luka:bookings-updated", handler);
    window.removeEventListener("storage", handler);
  };
}
