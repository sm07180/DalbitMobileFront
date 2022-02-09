import React, {useState, useEffect, useRef} from 'react'

import Api from 'context/api'
// global components
import InputItems from 'components/ui/inputItems/InputItems'
// components
import Tabmenu from '../Tabmenu'

import './style.scss'

const blockReportTabmenu = ['차단하기','신고하기']

const BlockReport = (props) => {
  const {type} = props
  const [openSelect, setOpenSelect] = useState(false)
  const [tabType, setTabType] = useState(blockReportTabmenu[1])
  
  // 셀렉트 오픈
  const openPopSelect = () => {
    setOpenSelect(!openSelect)
  }

  return (
    <section className="blockReport">
      <Tabmenu data={blockReportTabmenu} tab={tabType} setTab={setTabType} />
      {tabType === blockReportTabmenu[0] &&
        <div className="cntSection">
          <div className="message">
            <strong>DBS1🌜달빛시대🌜</strong>님을<br/>
            차단하시겠습니까?
          </div>
          <div className='text'>
            <i className='icoWarning'></i>
            차단한 회원은 나의 방송이 보이지 않으며,<br/>
            방송에 입장할 수 없습니다.
          </div>
          <div className="subText">
            ※ 차단한 회원은 마이페이지 &gt; 방송설정<br/>
            &gt; 차단회원관리페이지에서 확인할 수 있습니다.
          </div>
          <div className="buttonGroup">
            <button className='cancel'>취소</button>
            <button className='active'>차단</button>
          </div>
        </div>
      }
      {tabType === blockReportTabmenu[1] &&
        <div className="cntSection">
          <div className="message">
            <strong>DBS1🌜달빛시대🌜</strong>님을<br/>
            신고하시겠습니까?
          </div>
          <InputItems title={`신고 유형`}>
            <button onClick={openPopSelect}>신고 유형을 선택해주세요.</button>
            {openSelect &&
              <div className="selectWrap">
                <div className="option">프로필 사진</div>
                <div className="option">프로필 사진</div>
                <div className="option">프로필 사진</div>
                <div className="option">프로필 사진</div>
                <div className="option">프로필 사진</div>
                <div className="option">프로필 사진</div>
                <div className="option">프로필 사진</div>
              </div>
            }
          </InputItems>
          <InputItems title={`신고 내용`} type="textarea">
            <textarea maxLength={100} rows="4"></textarea>
            <div className='count'>0/100</div>
          </InputItems>
          <div className="buttonGroup">
            <button className='cancel'>취소</button>
            <button className={false ? 'active' : 'disabled'}>신고</button>
          </div>
        </div>
      }
    </section>
  )
}

export default BlockReport
