import Utility from 'components/lib/utility'

export const saveUrlAndRedirect = link => {
  Utility.setCookie('prevUrl', window.location.href, 1)
  window.location.href = link
}

export const getUrlAndRedirect = () => {
  const prevUrl = Utility.getCookie('prevUrl')
  Utility.setCookie('prevUrl', '', -1)

  if (prevUrl) {
    window.location.href = prevUrl
  } else {
    window.history.back()
  }
}
