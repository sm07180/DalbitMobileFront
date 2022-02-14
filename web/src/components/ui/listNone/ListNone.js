import React, {useEffect, useState} from 'react'

import './listNone.scss'

const ListNone = (props) => {
  const {height, text, imgType} = props
  //imgType

  return (
    <div className='listNone' style={{height: height}}>
      {
        imgType === "event01" &&
          <img src={"https://image.dalbitlive.com/common/listNone/listNone-event01.png"} className='listNoneImg'/>
      }
      {
        imgType === "event02" &&
          <img src={"https://image.dalbitlive.com/common/listNone/listNone-event02.png"} className='listNoneImg'/>
      }
      {
        imgType === "ui01" &&
          <img src={"https://image.dalbitlive.com/common/listNone/listNone-ui01.png"} className='listNoneImg'/>
      }
      {
        imgType === "ui02" &&
          <img src={"https://image.dalbitlive.com/common/listNone/listNone-ui02.png"} className='listNoneImg'/>
      }
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
  text: "해당 내역이 없습니다.",
  imgType: "ui01",
}

export default ListNone
