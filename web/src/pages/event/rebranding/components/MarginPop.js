import React, {useEffect} from 'react'
import {IMG_SERVER} from 'context/config'

const MarginPop = (props) => {
  
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div id="webp-ani">
      <img src={`${IMG_SERVER}/event/rebranding/merge_a.webp?timestamp=${Math.random()}`} alt="" />
    </div>
  )
}

export default MarginPop
