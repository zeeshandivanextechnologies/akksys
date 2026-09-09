export const validateUrl = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export const extractYouTubeId = (url) => {
  if (!url) return null;
  if (url.includes('youtu.be/')) return url.split('youtu.be/')[1]?.split('?')[0];
  if (url.includes('youtube.com/embed/')) return url.split('embed/')[1]?.split('?')[0];
  if (url.includes('youtube.com/watch')) {
    const params = new URL(url).searchParams;
    return params.get('v');
  }
  return null;
};

export const extractVimeoId = (url) => {
  if (!url) return null;
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
};
