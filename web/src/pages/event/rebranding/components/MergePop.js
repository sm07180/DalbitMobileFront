import React, {useEffect} from 'react'
import {IMG_SERVER} from 'context/config'

const MergePop = (props) => {
  const {result} = props
  
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div id="webp-ani">
      <img src={`${IMG_SERVER}/event/rebranding/merge_${result}.webp?timestamp=${Math.random()}`} alt="" />
    </div>
  )
}

export default MergePop
