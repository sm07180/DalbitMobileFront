import React, {useState, useEffect, useContext, useRef} from 'react'

//context
import {IMG_SERVER} from 'context/config'
import NoResultIcon from '../ic_noResult.svg'
// css
import './noResult.scss'

const NoResult = (props) => {
  const {msg} = props
  const [text, setText] = useState('조회 된 결과가')
  const [brText, setBrText] = useState('없습니다.')

  return (
    <article id="noResult">
      {msg ? (
        msg
      ) : (
        <>
          <img src={NoResultIcon} alt="" />
          <span>{text}</span>
          <span className="line">{brText}</span>
        </>
      )}
    </article>
  )
}

export default NoResult