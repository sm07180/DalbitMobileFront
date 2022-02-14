import React, {useState, useEffect, useContext} from 'react'

// global components
import Header from 'components/ui/header/Header'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
import InputItems from 'components/ui/inputItems/inputItems'

import '../../style.scss'
import './forbid.scss'

const SettingForbid = () => {

  return (
    <div id="forbid">
      <Header position={'sticky'} title={'금지어 관리'} type={'back'}/>
      <div className="subContent">
        <section className="inputWrap">
          <InputItems type={'text'} button={'삭제'}>
            <input type="text" />
          </InputItems>
          <InputItems type={'text'} button={'저장'}>
            <input type="text" />
          </InputItems>
          <SubmitBtn text={'금지어 추가 +'}/>
        </section>
        <section className="noticeInfo">
          <h3>유의사항</h3>
          <p>금지어는 한 단어당 최대 12자 이내</p>
          <p>최대 100개까지 설정 가능</p>
        </section>
      </div>
    </div>
  )
}

export default SettingForbid
