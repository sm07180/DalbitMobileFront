import React from 'react'

import Header from 'components/ui/header/Header'
import BenefitDj from '../components/benefits/BenefitDj'
import BenefitFan from '../components/benefits/BenefitFan'
import BenefitCupid from '../components/benefits/BenefitCupid'
import BenefitTeam from '../components/benefits/BenefitTeam'

import '../scss/RankingBenefit.scss'
import {useHistory, useParams} from "react-router-dom";

const RankingBenefit = () => {
  const history = useHistory();
  const params = useParams();

  const benefitLink = (e) =>{
    const { typeTab } = e.currentTarget.dataset;
    history.replace(`/rank/benefit/${typeTab}`)
  }

  return (
    <div id="rankingBenefit">      
      <Header position={'sticky'} title="랭킹 혜택" type={'back'}/>
      <ul className="tabmenu">
        <li className={`tabList ${params.type === "dj"    ? 'tabActive' : ''}`} data-type-tab="dj"     onClick={benefitLink}>DJ</li>
        <li className={`tabList ${params.type === "fan"   ? 'tabActive' : ''}`} data-type-tab="fan"    onClick={benefitLink}>FAN</li>
        <li className={`tabList ${params.type === "cupid" ? 'tabActive' : ''}`} data-type-tab="cupid"  onClick={benefitLink}>CUPID</li>
        <li className={`tabList ${params.type === "team"  ? 'tabActive' : ''}`} data-type-tab="team"   onClick={benefitLink}>TEAM</li>
        <div className={`underline`}/>
      </ul>
      <div className='subContent'>
        {(params.type === "dj"   ) && <BenefitDj/>}
        {(params.type === "fan"  ) && <BenefitFan/>}
        {(params.type === "cupid") && <BenefitCupid/>}
        {(params.type === "team" ) && <BenefitTeam/>}
      </div>
    </div>
  )
}

export default RankingBenefit