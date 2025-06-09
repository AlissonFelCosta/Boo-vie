export const stripHtmlTags = (html: string): string => {
  if (!html) return '';
  
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  let text = tempDiv.textContent || tempDiv.innerText || '';
  
  text = text.replace(/\s+/g, ' ').trim();
  
  return text;
};

export const truncateText = (text: string, maxLength: number = 500): string => {
  if (!text || text.length <= maxLength) return text;
  
  const truncated = text.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  return truncated + '...';
};
