import React, {useState, useEffect, useContext} from 'react'

// global components
import Header from 'components/ui/header/Header'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
import InputItems from 'components/ui/inputItems/InputItems'

import '../../style.scss'
<<<<<<< HEAD
// import InputItems from 'pages/remypage/components/InputItems'
=======
>>>>>>> origin/mainPage

const SettingForbid = () => {

  return (
    <>
      <Header position={'sticky'} title={'금지어 관리'} type={'back'}/>
      <div className='subContent'>
        <section className="">
<<<<<<< HEAD
          {/* <InputItems type={'text'} button={'저장'}>
=======
          <InputItems type={'text'} button={'삭제'}>
            <input type="text" />
          </InputItems>
          <InputItems type={'text'} button={'저장'}>
>>>>>>> origin/mainPage
            <input type="text" />
          </InputItems> */}
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
