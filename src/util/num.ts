export function toFixedIfNecessary(value: number, precesion: number): number {
  return parseFloat(value.toFixed(1));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
