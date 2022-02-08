import React, {useState} from 'react'

//global components
import Header from 'components/ui/header/Header'

//components
import Tabmenu from '../../components/tabmenu'
import BroadcastWrap from './broadcastWrap'
import ListenWrap from './listenWrap'

import './report.scss'

const tabmenu = ['방송', '청취']

const Report = () =>{
  const [tabType, setTabType] = useState(tabmenu[0])

  return(
    <div id="report">
      <Header position={'sticky'} title={'리포트'} type={'back'} />
      <Tabmenu data={tabmenu} tab={tabType} setTab={setTabType} />
      {tabType === tabmenu[0] ? 
        <BroadcastWrap />
      : 
        <ListenWrap />
      }
    </div>
  )
}

export default Report