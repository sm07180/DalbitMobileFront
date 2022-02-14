import React, {useContext, useEffect, useState} from 'react'

//global components
import Header from 'components/ui/header/Header'

//components
import Tabmenu from '../../components/tabmenu'
import BroadcastWrap from './broadCastWrap'
import ListenWrap from './listenWrap'

import './report.scss'
import {Context} from "context";
import {useHistory} from "react-router-dom";

const Report = () => {
  const submenu = ['방송', '청취']
  const [tabType, setTabType] = useState(submenu[0])
  const context = useContext(Context);
  const history = useHistory();

  useEffect(() => {
    if(!(context.token.isLogin)) {
      history.push("/login");
    }
  }, []);


  return(
    <div id="report">
      <Header position={'sticky'} title={'리포트'} type={'back'} />
      <Tabmenu data={submenu} tab={tabType} setTab={setTabType} />
      {tabType === submenu[0] ?
        <BroadcastWrap />
        :
        <ListenWrap />
      }
    </div>
  )
}

export default Report