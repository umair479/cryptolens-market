export function formatUsd(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "—";
  if (value < 0.01 && value > 0) return `$${value.toPrecision(3)}`;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: value < 10 ? Math.min(digits, 4) : 2,
    maximumFractionDigits: value < 10 ? Math.max(digits, 4) : digits,
  }).format(value);
}

export function formatCompactUsd(value: number) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCompactNumber(value: number) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(value);
}

export function formatPercent(value: number) {
  if (!Number.isFinite(value)) return "—";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function formatUpdated(value?: string) {
  if (!value) return "Waiting for provider";
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
