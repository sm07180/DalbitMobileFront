import React, {useState} from 'react'

import Header from 'components/ui/header/Header'
import Tabmenu from '../components/Tabmenu'
import BenefitDj from '../components/BenefitDj'
import BenefitFan from '../components/BenefitFan'
import BenefitLover from '../components/BenefitLover'

// components
//static
import './rankingBenefit.scss'
import {useLocation} from "react-router-dom";

const RankingBenefit = () => {
  let location = useLocation();

  //탭 목록
  const [tabList, setTabList] = useState(["DJ", "FAN", "CUPID"]);
  //현재 선택된 탭 이름
  const [tabName, setTabName] = useState(location.state === "FAN" ? "FAN" : location.state === "CUPID" ? "CUPID" : "DJ");

  return (
    <div id="rankingBenefit">      
      <Header position={'sticky'} title="랭킹 혜택" type={'back'}/>
      <Tabmenu data={tabList} tab={tabName} setTab={setTabName} />
      <div className='subContent'>
        {
          tabName === "DJ" &&
            <BenefitDj/>
        }
        {
          tabName === "FAN" &&
            <BenefitFan/>
        }
        {
          tabName === "CUPID" &&
            <BenefitLover/>
        }
      </div>
    </div>
  )
}

export default RankingBenefit