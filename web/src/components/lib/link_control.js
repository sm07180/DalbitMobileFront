import Utility from 'components/lib/utility'

export const saveUrlAndRedirect = targetLink => {
  Utility.setCookie(targetLink, window.location.href, 1)
  window.location.href = targetLink
}

export const getUrlAndRedirect = () => {
  const prevUrl = Utility.getCookie(location.pathname)
  Utility.setCookie(location.pathname, '', -1)

  if (prevUrl) {
    window.location.href = prevUrl
  } else {
    window.history.back()
  }
}
