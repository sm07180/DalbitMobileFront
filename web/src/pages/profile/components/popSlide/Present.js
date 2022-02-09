import React, {useState, useEffect, useRef} from 'react'
import Utility, {printNumber, addComma} from 'components/lib/utility'

import Api from 'context/api'
// global components
import InputItems from 'components/ui/inputItems/InputItems'
// components
import Tabmenu from '../Tabmenu'

import './style.scss'

const blockReportTabmenu = ['차단하기','신고하기']

const Present = (props) => {
  const {type} = props
  const [openSelect, setOpenSelect] = useState(false)
  const [tabType, setTabType] = useState(blockReportTabmenu[1])
  
  // 셀렉트 오픈
  const openPopSelect = () => {
    setOpenSelect(!openSelect)
  }

  return (
    <section className="present">
      <h2>선물하기</h2>
      <div className="message">
        <strong>DBS1🌜달빛시대🌜</strong>님을<br/>
        신고하시겠습니까?
      </div>
      <div className="payBox">
        <div className="possess">
          <span>내가 보유한 달</span>
          <div className="count">{Utility.addComma(2310)}</div>
        </div>
        <button>충전하기</button>
      </div>
      <div className="payCount">
        <button className='active'>{Utility.addComma(50)}</button>
        <button>{Utility.addComma(100)}</button>
        <button>{Utility.addComma(500)}</button>
        <button>{Utility.addComma(1000)}</button>
        <button>{Utility.addComma(2000)}</button>
        <button>{Utility.addComma(3000)}</button>
        <button>{Utility.addComma(5000)}</button>
        <button>{Utility.addComma(10000)}</button>
      </div>
      <InputItems>
        <input type="number" placeholder='직접입력' />
      </InputItems>
      <span className='log'>달은 10개 이상부터 선물이 가능합니다.</span>
      <div className="buttonGroup">
        <button className='cancel'>취소</button>
        <button className={false ? 'active' : 'disabled'}>선물하기</button>
      </div>
    </section>
  )
}

export default Present
