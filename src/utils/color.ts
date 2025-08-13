/**
 * A visually distinct and pleasing color palette for grouping results.
 */
const COLOR_SEQUENCE = [
  'hsl(195, 80%, 55%)', // Sky Blue
  'hsl(145, 70%, 50%)', // Sea Green
  'hsl(25, 85%, 60%)',  // Bright Orange
  'hsl(265, 75%, 65%)', // Lavender
  'hsl(350, 80%, 65%)', // Pink
  'hsl(50, 90%, 60%)',   // Gold
];

/**
 * A simple hashing function to convert a string ID into a number.
 * This provides a consistent, pseudo-random index for any given string.
 * @param str The string to hash.
 * @returns A positive integer hash code.
 */
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

/**
 * Assigns a color based on the result's source video ID.
 * All results sharing the same `sourceVideoId` will receive the same color.
 * @param sourceVideoId The unique identifier for the source video.
 * @returns A string containing an HSL color value for use in CSS.
 */
export const getRankColor = (sourceVideoId?: string): string => {
  // If an item has no source, its border will be transparent.
  if (!sourceVideoId) {
    return 'transparent';
  }
  
  // Hash the source ID to get a consistent index.
  const hash = simpleHash(sourceVideoId);
  
  // Use the hash to pick a color from the sequence, ensuring the same ID always gets the same color.
  const colorIndex = hash % COLOR_SEQUENCE.length;
  
  return COLOR_SEQUENCE[colorIndex];
};