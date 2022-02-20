import React, {useEffect, useState} from 'react'

import Header from 'components/ui/header/Header'
import Tabmenu from '../components/Tabmenu'
import BenefitDj from '../components/BenefitDj'
import BenefitFan from '../components/BenefitFan'
import BenefitLover from '../components/BenefitLover'

// components
//static
import './rankingBenefit.scss'

const RankingBenefit = () => {
  //탭 목록
  const [tabList, setTabList] = useState(["DJ", "FAN", "CUPID"]);
  //현재 선택된 탭 이름
  const [tabName, setTabName] = useState(tabList[0]);

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