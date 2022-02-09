import React, {useState} from 'react'

//global components
import Header from 'components/ui/header/Header'

//components
import Tabmenu from '../../components/tabmenu'

import './clip.scss'

const tabmenu = ['업로드', '청취내역']
const uploadTab = ['마이 클립','청취 회원','좋아요 회원','선물한 회원']

const Clip = () =>{
  const [tabType, setTabType] = useState(tabmenu[0])

  return(
    <div id="mypageClip">
      <Header position={'sticky'} title={'클립'} type={'back'} />
      <Tabmenu data={tabmenu} tab={tabType} setTab={setTabType} />
      {tabType === tabmenu[0] ? 
        <div className="uploadWrap">
          <Tabmenu data={uploadTab} tab={tabType} setTab={setTabType} />
        </div>
      : 
        <div className="listenWrap">
          2
        </div>
      }
    </div>
  )
}

export default Clip