export const saveUrlAndRedirect = targetLink => {
  window.sessionStorage.setItem(targetLink, window.location.href)
  window.location.href = targetLink
}

export const getUrlAndRedirect = () => {
  const prevUrl = window.sessionStorage.getItem(location.pathname)
  window.sessionStorage.removeItem(location.pathname)

  if (prevUrl) {
    window.location.href = prevUrl
  } else {
    window.history.back()
  }
}
