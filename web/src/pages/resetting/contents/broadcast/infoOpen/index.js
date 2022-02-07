import React, {useState, useEffect} from 'react'


// global components
import Header from 'components/ui/header/Header'
import SwitchList from '../../../components/switchList'

import './infoOpen.scss'

const InfoOpen = () => {
  const [checkState, setCheckState] = useState(false);

  const switchAction = (e) => {
    const checking = e.target.checked;
    if(checking){
      setCheckState(true)
    } else {
      setCheckState(false)
      let radioEle = document.getElementsByName("broadcastLocation");
      for(let i = 0; i < radioEle.length; i++) {
        if(radioEle[i].getAttribute('type') === "radio") {
          radioEle[i].checked = false;
        }
      }
    }
  }
    
  // 페이지 시작
  return (
    <div id="infoOpen">
      <Header position={'sticky'} title={'방송 청취 정보 공개'} type={'back'}/>
      <div className='subContent'>
          <SwitchList title={"방송 청취 정보 공개"} mark={false} action={switchAction}/>
          <div className={`locationState ${checkState ? "active" : ""}`}>
            <div className='title'>방송 위치 상태</div>
            <div className='radioWrap'>
              <label className='radioLabel'>
                <input type="radio" name="broadcastLocation" className='blind'/>
                <span className='radioBtn'></span>
                <span className='radioCategoty'>공개</span>
              </label>
              <label className='radioLabel'>
                <input type="radio" name="broadcastLocation" className='blind'/>
                <span className='radioBtn'></span>
                <span className='radioCategoty'>비공개</span>
              </label>
            </div>
          </div>
      </div>
    </div>
  )
}

export default InfoOpen
