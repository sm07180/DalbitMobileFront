import React, {useState} from 'react'

//global components
import Header from 'components/ui/header/Header'

//components
import Tabmenu from '../../components/tabmenu'

import './clip.scss'
import MyClipUpload from './myClipUpload'
import MyClipListen from './myClipListen'
import {useHistory} from "react-router-dom";

const tabmenu = ['업로드', '청취내역']

const Clip = () =>{
  const history = useHistory();
  const [tabType, setTabType] = useState(tabmenu[0])

  const uploadClick = (e) => {
    history.push('/clip_upload');
  };

  return(
    <div id="mypageClip">
      <Header position={'sticky'} title={'클립'} type={'back'} />
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