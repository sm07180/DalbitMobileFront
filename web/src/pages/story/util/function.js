export const isScrolledToBtm = (diff = 10) => {
  const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
  const fullScrollHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight
  )
  const scrollFromTop = window.pageYOffset

  return scrollFromTop + windowHeight >= fullScrollHeight - diff
}

export const debounce = (func, delay) => {
  let timer
  return function () {
    const context = this
    const args = arguments
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => func.call(context, ...args), delay)
  }
}
