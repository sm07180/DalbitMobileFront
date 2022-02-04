import React, {useState, useEffect, useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'

// global components
import Header from 'components/ui/header/Header'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'

import SwitchList from '../../components/switchList'

import '../../style.scss'
import InputItems from 'pages/remypage/components/InputItems'

const SettingForbid = () => {

  return (
    <>
      <Header position={'sticky'} title={'금지어 관리'} type={'back'}/>
      <div className='subContent'>
        <section className="">
          <InputItems type={'text'} button={'저장'}>
            <input type="text" />
          </InputItems>
        </section>
        <SubmitBtn text={'금지어 추가 +'}/>
        <section className="noticeInfo">
          <h3>유의사항</h3>
          <p>금지어는 한 단어당 최대 12자 이내</p>
          <p>최대 100개까지 설정 가능</p>
        </section>
      </div>
    </>
  )
}

export default SettingForbid
