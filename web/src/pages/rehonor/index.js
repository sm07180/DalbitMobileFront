import React from 'react'
// global components
import Header from 'components/ui/header/Header'
// components
import Tabmenu from './components/Tabmenu'
// contents
import SpecialDj from "./contents/SpecialDj";
import WeeklyPick from './contents/WeeklyPick'
import StarDj from './contents/StarDj'
import {useDispatch, useSelector} from "react-redux";

import './style.scss'
import {setHonorTab} from "redux/actions/honor";
import UtilityCommon from "common/utility/utilityCommon";

const honorTabmenu = UtilityCommon.eventDateCheck("20220501") ? ["스타DJ", "위클리 픽"] : ["스페셜DJ", "위클리 픽"];

const Honor = () => {
  const {tab} = useSelector((state) => state.honor);

  const dispatch = useDispatch();

  // 페이지 시작
  return (
   <div id='honor'>
      <Header title="명예의 전당" type="back"/>
      <Tabmenu data={honorTabmenu} tab={tab} setTab={(val) => dispatch(setHonorTab(val))} />
      {tab === honorTabmenu[0] ?
        !UtilityCommon.eventDateCheck("20220501") ? <StarDj /> : <SpecialDj/>
        :
        <WeeklyPick />
      }
   </div>
  )
}

export default Honor
