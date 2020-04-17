export const saveUrlAndRedirect = targetLink => {
  sessionStorage.setItem(targetLink, window.location.href)
  window.location.href = targetLink
}

export const getUrlAndRedirect = () => {
  const prevUrl = sessionStorage.getItem(location.pathname)
  sessionStorage.removeItem(location.pathname)

  if (prevUrl) {
    window.location.href = prevUrl
  } else {
    window.history.back()
  }
}
