const API_BASE_URL = "https://jikan.lucashdo.com/v1"

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

export async function fetchApi(path, options = {}) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`Jikan API error: ${response.status}`)
    }

    const result = await response.json()
    return {
      ...result,
      data: Array.isArray(result.data)
        ? result.data.map(normalizeAnime)
        : normalizeAnime(result.data),
    }
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request API timeout")
    }
    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}
