import React, {useState} from 'react'

//global components
import Header from 'components/ui/header/Header'
import ListRow from 'components/ui/listRow/ListRow'
import DataCnt from 'components/ui/dataCnt/DataCnt'
import GenderItems from 'components/ui/genderItems/GenderItems'
import TabBtn from 'components/ui/tabBtn/TabBtn'
import Swiper from 'react-id-swiper'

//components
import Tabmenu from '../../components/tabmenu'

import './clip.scss'
import MyClipUpload from './myClipUpload'
import MyClipListen from './myClipListen'

const tabmenu = ['업로드', '청취내역']

const Clip = () =>{
  const [tabType, setTabType] = useState(tabmenu[0])

  return(
    <div id="mypageClip">
      <Header position={'sticky'} title={'클립'} type={'back'}>
        {tabType === tabmenu[0] &&
          <button className="headerBtn">등록</button>
        }
      </Header>
      <Tabmenu data={tabmenu} tab={tabType} setTab={setTabType} />
      <div className="contentWrap">
        {tabType === tabmenu[0] ?
          <MyClipUpload />
        :
          <MyClipListen />
        }
      </div>
    </div>
  )
}

export default Clip