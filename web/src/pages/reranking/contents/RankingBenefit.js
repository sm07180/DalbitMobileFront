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
    const { slctTab } = e.currentTarget.dataset;
    history.replace(`/rank/benefit/${slctTab}`)
  }

  return (
    <div id="rankingBenefit">      
      <Header position={'sticky'} title="랭킹 혜택" type={'back'}/>
      <ul className="tabmenu">
        <li className={`tabList ${params.slct === "dj"    ? 'tabActive' : ''}`} data-slct-tab="dj"     onClick={benefitLink}>DJ</li>
        <li className={`tabList ${params.slct === "fan"   ? 'tabActive' : ''}`} data-slct-tab="fan"    onClick={benefitLink}>FAN</li>
        <li className={`tabList ${params.slct === "cupid" ? 'tabActive' : ''}`} data-slct-tab="cupid"  onClick={benefitLink}>CUPID</li>
        <li className={`tabList ${params.slct === "team"  ? 'tabActive' : ''}`} data-slct-tab="team"   onClick={benefitLink}>TEAM</li>
        <div className={`underline`}/>
      </ul>
      <div className='subContent'>
        {(params.slct === "dj"   ) && <BenefitDj/>}
        {(params.slct === "fan"  ) && <BenefitFan/>}
        {(params.slct === "cupid") && <BenefitCupid/>}
        {(params.slct === "team" ) && <BenefitTeam/>}
      </div>
    </div>
  )
}

export default RankingBenefit