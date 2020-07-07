/**
 * @file useResize.js
 * @brief 윈도우 리사이즈 HOOK 
 * @code
   import useResize from 'components/hooks/useResize'

   useEffect(() => {
    }, [useResize()])

    스크롤 값 제외한 현재 window 사이즈 가져오기 
    useResize().width
    useResize().height
 
 */

import {useState, useEffect} from 'react'

const useResize = () => {
  const isClient = typeof window === 'object'

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined
    }
  }

  const [windowSize, setWindowSize] = useState(getSize)

  useEffect(() => {
    if (!isClient) {
      return false
    }

    function handleResize() {
      setWindowSize(getSize())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

export default useResize
