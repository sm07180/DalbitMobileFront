import React, {useState, useEffect, useContext, useRef} from 'react'

//context
import {IMG_SERVER} from 'context/config'
import NoResultIcon from '../ic_noResult.svg'
// css
import './noResult.scss'

const NoResult = (props) => {
  const {msg, ment} = props
  const [text, setText] = useState('조회 된 결과가')
  const [brText, setBrText] = useState('없습니다.')

  
  const nl2br = (text) => {
    if (text && text !== '') {
      return text.replace(/(?:\r\n|\r|\n)/g, '<br />')
    }
  }

  return (
    <article id="noResult">
      {msg ? (
        msg
      ) : (
        <>
          <img src={NoResultIcon} alt="" />
           {
             ment ? 
              ment.split('\n').map((line, index) => {
                  if (ment.match('\n')) {
                    return (
                      <span key={index}>
                        {line}
                        <br />
                      </span>
                    )
                  } else {
                    return <span key={index}>{ment}</span>
                  }
                })
              :
             <>
              <span>{text}</span>
              <span className="line">{brText}</span>
             </>
           }
        </>
      )}
    </article>
  )
}

export default NoResult