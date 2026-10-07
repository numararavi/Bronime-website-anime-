const API_BASE_URL = "https://jikan.lucashdo.com/v1"
const CACHE_PREFIX = "bronime-api-cache:"
const CACHE_TTL = 5 * 60 * 1000
const MAX_RETRIES = 2

function normalizeAnime(item) {
  if (!item || typeof item !== "object") return item

  const imageUrl = item.imageUrl || item.images?.medium || item.images?.large
  const images = item.images
    ? {
        ...item.images,
        jpg: item.images.jpg || {
          image_url: imageUrl,
          large_image_url: item.images.large || imageUrl,
        },
      }
    : imageUrl
      ? { jpg: { image_url: imageUrl, large_image_url: imageUrl } }
      : item.images

  return {
    ...item,
    mal_id: item.mal_id ?? item.malId,
    image_url: item.image_url ?? item.imageUrl,
    images,
    genres: item.genres?.map(normalizeAnime),
    trailer: item.trailer
      ? {
          ...item.trailer,
          embed_url: item.trailer.embed_url ?? item.trailer.embedUrl,
        }
      : item.trailer,
  }
}

function readCache(key) {
  try {
    const cached = JSON.parse(localStorage.getItem(key))
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) return cached.data
  } catch {
    localStorage.removeItem(key)
  }
  return null
}

function writeCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }))
  } catch {
    // Cache failure should never block the API request.
  }
}

function canRetry(error) {
  return error.name === "TypeError" || error.name === "AbortError" || error.status >= 500 || error.status === 429
}

export async function fetchApi(path, options = {}) {
  const cacheKey = `${CACHE_PREFIX}${path}`
  const useCache = (options.method || "GET").toUpperCase() === "GET"
  const cached = useCache ? readCache(cacheKey) : null
  if (cached) return cached

  let lastError

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        signal: controller.signal,
      })

      if (!response.ok) {
        const error = new Error(`Jikan API error: ${response.status}`)
        error.status = response.status
        throw error
      }

      const result = await response.json()
      const normalized = {
        ...result,
        data: Array.isArray(result.data)
          ? result.data.map(normalizeAnime)
          : normalizeAnime(result.data),
      }
      if (useCache) writeCache(cacheKey, normalized)
      return normalized
    } catch (error) {
      lastError = error.name === "AbortError"
        ? new Error("Request API timeout")
        : error
      if (!canRetry(error) || attempt === MAX_RETRIES) throw lastError
      await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)))
    } finally {
      clearTimeout(timeoutId)
    }
  }

  throw lastError
}
