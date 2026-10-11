/**
 * Pre-calculated durations for audio files 1-25
 * These are hardcoded to show immediately without loading audio files
 * Update these values if you change the audio files
 */

// Duration in milliseconds for each audio file (parts 1-25)
const AUDIO_DURATIONS: Record<number, number> = {
  1: 2700000, // 45:00 (placeholder - update with actual duration)
  2: 2700000, // 45:00 (placeholder)
  3: 2700000, // 45:00 (placeholder)
  4: 2700000, // 45:00 (placeholder)
  5: 2700000, // 45:00 (placeholder)
  6: 2700000, // 45:00 (placeholder)
  7: 2700000, // 45:00 (placeholder)
  8: 2700000, // 45:00 (placeholder)
  9: 2700000, // 45:00 (placeholder)
  10: 2700000, // 45:00 (placeholder)
  11: 2700000, // 45:00 (placeholder)
  12: 2700000, // 45:00 (placeholder)
  13: 2700000, // 45:00 (placeholder)
  14: 2700000, // 45:00 (placeholder)
  15: 2700000, // 45:00 (placeholder)
  16: 2700000, // 45:00 (placeholder)
  17: 2700000, // 45:00 (placeholder)
  18: 2700000, // 45:00 (placeholder)
  19: 2700000, // 45:00 (placeholder)
  20: 2700000, // 45:00 (placeholder)
  21: 2700000, // 45:00 (placeholder)
  22: 2700000, // 45:00 (placeholder)
  23: 2700000, // 45:00 (placeholder)
  24: 2700000, // 45:00 (placeholder)
  25: 2700000, // 45:00 (placeholder)
};

/**
 * Get the pre-calculated duration for an audio file by part number
 * Returns duration in milliseconds, or 0 if not found
 */
export function getAudioDuration(partNumber: number): number {
  return AUDIO_DURATIONS[partNumber] || 0;
}

/**
 * Format milliseconds to MM:SS format
 */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
