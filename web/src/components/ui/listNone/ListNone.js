import React, {useEffect, useState} from 'react'

import './listNone.scss'

const ListNone = (props) => {
  const {height, text} = props

  return (
    <div className='listNone' style={{height: height}}>
      <img src={"https://image.dalbitlive.com/common/listNone/listNone01.png"} className='listNoneImg'/>
      <p className='listNoneText'>
        {text.split('\n').map((line, index) => {
          if (text.match('\n')) {
            return (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            )
          } else {
            return <React.Fragment key={index}>{text}</React.Fragment>
          }
        })}
      </p>
    </div>
  )
}

ListNone.defaultProps = {
  height: "300px",
}

export default ListNone
