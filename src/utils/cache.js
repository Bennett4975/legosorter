export const getCachedParts = (category) => {
  return JSON.parse(localStorage.getItem(`legoParts:${category}`)) || null;
};

export const setCachedParts = (category, parts) => {
  localStorage.setItem(`legoParts:${category}`, JSON.stringify(parts));
};