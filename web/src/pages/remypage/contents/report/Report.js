import React, {useContext, useEffect, useState} from 'react'

//global components
import Header from 'components/ui/header/Header'

//components
import BroadcastWrap from 'pages/remypage/contents/report/BroadCastWrap'
import ListenWrap from 'pages/remypage/contents/report/ListenWrap'

import './report.scss'
import {Context} from "context";
import {useHistory} from "react-router-dom";
import Tabmenu from "pages/remypage/components/tabmenu";

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