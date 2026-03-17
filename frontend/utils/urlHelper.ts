/**
 * Sanitizes image URLs to ensure they are direct links that can be rendered in an <img> tag.
 * Specifically handles Google Drive "view" links by converting them to "uc" (unlimited content) links.
 */
export const sanitizeImageUrl = (url: string | undefined | null): string => {
  if (!url) return '';

  // Google Drive "view" or "file" links
  // Pattern: https://drive.google.com/file/d/ID/view... or https://drive.google.com/open?id=ID
  if (url.includes('drive.google.com')) {
    let fileId: string | null = null;
    
    // Handle /file/d/ID/view
    const match = url.match(/\/file\/d\/([^/]+)/);
    if (match && match[1]) {
      fileId = match[1];
    } else {
      // Handle ?id=ID
      const urlObj = new URL(url);
      fileId = urlObj.searchParams.get('id');
    }

    if (fileId) {
      // Use the more reliable googleusercontent endpoint for direct display
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
  }

  // Add more sanitizers here if needed (e.g. Dropbox, etc.)
  
  return url;
};
