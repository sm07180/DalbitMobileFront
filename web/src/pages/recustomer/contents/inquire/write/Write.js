import React, {useState, useEffect, useContext} from 'react'

// global components
import ImageUpload from 'components/ui/imageUpload/ImageUpload'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'

import InquireInput from '../../../components/inquireInput'
// components
import '../inquire.scss'

const Write = (props) => { 
  const inquireContent = `아래 내용을 함께 보내주시면 더욱 빠른 처리가 가능합니다.

OS (ex-Window 버전10) : 
브라우저 : 
문제발생 일시 :  
문의내용 : 
`

  return (
    <div id='write'>
      <InquireInput title="문의 제목" type="text" required={true} placeholder="문의 제목을 입력해주세요."/>
      <InquireInput title="문의 유형" type="select" required={true} placeholder="문의 유형을 선택해주세요."/>
      <InquireInput title="문의 내용" type="textArea" required={true} placeholder={inquireContent}/>
      <ImageUpload title="사진 첨부" subTitle="(최대 10MB)"/>
      <label className="inputLabel">
        <input type="checkbox" className="blind" name="checkList"/>
        <span className="checkIcon"></span>
        <p className="checkinfo">개인정보 수집 동의<span>[필수]</span></p>
        <button className='policyBtn'>자세히</button>
      </label>
      <SubmitBtn text={'등록하기'} />
    </div>
  )
}

export default Write
