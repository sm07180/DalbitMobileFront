import React, {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'

import qs from 'query-string'
import {Hybrid} from 'context/hybrid'
// static
import closeBtn from '../img/ic_back.svg'
import closeBtnWhite from '../img/ic_back_white.png'

export default (props) => {
  let {goBack, type, leftContent, rightContent} = props
  const history = useHistory()
  const {webview} = qs.parse(location.search)
  const [rightEle,setRightEle] = useState([]);
  const [leftEle,setLeftEle] = useState([]);
  const path = [
    {className : "benefits", path: "benefits"},
    {className : "sample", path: "sample"},
  ]

  if (goBack === undefined) {
    goBack = () => {
      if (webview === 'new') {
        return Hybrid('CloseLayerPopup')
      } else {
        return history.goBack()
      }
    }
  }

  const imgClose = () => {
    if (type === 'blackBg') {
      return closeBtnWhite
    } else {
      return closeBtn
    }
  }

  useEffect(() => {
    setRightEle(rightContent.split(" "));
    setLeftEle(leftContent.split(" "));
    console.log(rightEle);
  }, [])

  return (
    <div className={`new header-wrap ${type !== undefined ? type : ''}`}>
      {props.leftContent &&
        <div className='lefttWrap'>
          {
            leftEle.length > 0 &&
              leftEle.map((item, index) => {  
                  return (
                    item === "backBtn" ? 
                    <button className="close-btn" onClick={goBack} key={index}>
                      <img src={imgClose()} alt="뒤로가기" />
                    </button>
                    :
                    <span className={`${item}`} key={index} onClick={() => {history.push(`${item}`)}}></span>
                    
                  );
              })
          } 
        </div>
      }
      {props.title ? (
        <h2 className={`header-title${props.title.length > 18 ? ' isLong' : ''}`}>{props.title}</h2>
      ) : (
        props.children
      )}
      {props.rightContent &&
        <div className='rightWrap'>
          {
            rightEle.length > 0 &&
              rightEle.map((item, index) => { 
                let pathName = "";
                path.map((ele, index) => {
                  if(ele.className === item) {
                    pathName = ele.path;
                  }
                })
                return (
                  <span className={`${item}`} key={index} onClick={() => {history.push(`${pathName}`)}}></span>
                );
              })
          } 
        </div>
      }
    </div>
  )
}
