
// List of offensive words to filter
// This is a simple implementation - in production, you might want to use a more comprehensive list
// or integrate with a third-party API for more sophisticated filtering
const offensiveWords = [
  "palavrão1", "palavrão2", "ofensivo1", "ofensivo2", 
  // Add more offensive words here
  // These are placeholders - replace with actual words you want to filter
];

/**
 * Replace offensive words in the given text with asterisks
 * @param text The text to filter
 * @returns The filtered text with offensive words replaced by asterisks
 */
export const filterProfanity = (text: string): string => {
  if (!text) return text;
  
  let filteredText = text.toLowerCase();
  
  // Check for each offensive word and replace it with asterisks
  offensiveWords.forEach(word => {
    // Create a regular expression that matches the word with word boundaries
    // 'i' flag for case-insensitive matching
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    
    // Replace the word with asterisks of the same length
    filteredText = filteredText.replace(regex, '*'.repeat(word.length));
  });
  
  return filteredText;
};

/**
 * Check if text contains profanity
 * @param text The text to check
 * @returns Boolean indicating if the text contains profanity
 */
export const containsProfanity = (text: string): boolean => {
  if (!text) return false;
  
  const lowerText = text.toLowerCase();
  return offensiveWords.some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(lowerText);
  });
};
