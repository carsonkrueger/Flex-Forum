export function toFixedIfNecessary(value: number, precesion: number): number {
  return parseFloat(value.toFixed(1));
}
