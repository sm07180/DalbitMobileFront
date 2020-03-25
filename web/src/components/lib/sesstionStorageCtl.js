export const setSesstionStorage = (key, obj) => {
  if (key === null || obj === null) return ''
  if (key === 'socketClusterInfo') {
    sessionStorage.setItem(key, obj)
  } else {
    sessionStorage.setItem(key, JSON.stringify(obj))
  }
}
export const getSesstionStorage = key => {
  if (sessionStorage.getItem(key) != null) {
    return JSON.parse(sessionStorage.getItem(key))
  }
  return ''
}
