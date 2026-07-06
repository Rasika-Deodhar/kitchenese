const cache = new Map();

export function cacheKey(concept, cuisine, mode) {
  return `${concept.trim().toLowerCase()}|${cuisine}|${mode}`;
}

export function getCached(concept, cuisine, mode) {
  return cache.get(cacheKey(concept, cuisine, mode));
}

export function setCached(concept, cuisine, mode, value) {
  cache.set(cacheKey(concept, cuisine, mode), value);
}
