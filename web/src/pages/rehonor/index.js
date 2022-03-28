import React from 'react'
// global components
import Header from 'components/ui/header/Header'
// components
import Tabmenu from './components/Tabmenu'
// contents
import SpecialDj from "./contents/SpecialDj";
import WeeklyPick from './contents/WeeklyPick'
import PartnerDj from './contents/PartnerDj'
import {useDispatch, useSelector} from "react-redux";

import './style.scss'
import {setHonorTab} from "redux/actions/honor";

const honorTabmenu = ["스페셜DJ", "파트너DJ"]

const Honor = () => {
  const {tab} = useSelector((state) => state.honor);

  const dispatch = useDispatch();



  // 페이지 시작
  return (
   <div id='honor'>
      <Header title="명예의 전당" type="back"/>
      <Tabmenu data={honorTabmenu} tab={tab} setTab={(val) => dispatch(setHonorTab(val))} />
      {tab === honorTabmenu[0] ?
        <SpecialDj />
        :
        <PartnerDj />
      }
   </div>
  )
}

export default Honor
