const WATCHLIST_KEY = "watchlist"

export const WATCH_STATUSES = [
  { value: "watching", label: "Watching" },
  { value: "completed", label: "Completed" },
  { value: "on_hold", label: "On Hold" },
  { value: "dropped", label: "Dropped" },
  { value: "plan", label: "Plan to Watch" },
]

export function getWatchlist() {
  try {
    return JSON.parse(localStorage.getItem(WATCHLIST_KEY)) || {}
  } catch {
    return {}
  }
}

export function getWatchStatus(id) {
  return getWatchlist()[id] || "plan"
}

export function setWatchStatus(id, status) {
  const watchlist = getWatchlist()
  watchlist[id] = status
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist))
}

export function removeWatchStatus(id) {
  const watchlist = getWatchlist()
  delete watchlist[id]
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist))
}
