import React, {useEffect, useState, useContext} from 'react'

import {PAGE_TYPE} from '../../constant'

import BenefitDj from './benefit_dj'
import BenefitFan from './benefit_fan'
import BenefitLike from './benefit_like'
import {useSelector} from "react-redux";

export default (props) => {
  const rankState = useSelector(({rankCtx}) => rankCtx);
  const {formState} = rankState
  const [tab, setTab] = useState(formState[PAGE_TYPE.RANKING].rankType)

  useEffect(() => {
    if (formState[PAGE_TYPE.RANKING].rankType === 1) {
      setTab('dj')
    } else if (formState[PAGE_TYPE.RANKING].rankType === 2) {
      setTab('fan')
    } else {
      setTab('like')
    }
  }, [formState[PAGE_TYPE.RANKING].rankType])

  return (
    <div className="rankGuideWrap">
      <div className="rankGuideTab">
        <button onClick={() => setTab('dj')} className={`rankGuideTab__btn ${tab === 'dj' && 'active'}`}>
          DJ
        </button>
        <button onClick={() => setTab('fan')} className={`rankGuideTab__btn ${tab === 'fan' && 'active'}`}>
          팬
        </button>
        <button onClick={() => setTab('like')} className={`rankGuideTab__btn ${tab === 'like' && 'active'}`}>
          좋아요
        </button>
      </div>

      {tab === 'dj' && <BenefitDj />}
      {tab === 'fan' && <BenefitFan />}
      {tab === 'like' && <BenefitLike />}
    </div>
  )
}
