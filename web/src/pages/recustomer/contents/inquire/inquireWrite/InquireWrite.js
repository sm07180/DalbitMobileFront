import React, {useState, useEffect, useContext} from 'react'

// global components
import ImageUpload from 'components/ui/imageUpload/ImageUpload'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
import LayerPopup from 'components/ui/layerPopup/LayerPopup'

import InquireInput from '../../../components/InquireInput'
// components
import './inquireWrite.scss'

const InquireWrite = () => { 
  const [popup, setPopup] = useState(false)
  const inquireContent = `아래 내용을 함께 보내주시면 더욱 빠른 처리가 가능합니다.

OS (ex-Window 버전10) : 
브라우저 : 
문제발생 일시 :  
문의내용 : 
`
  const popupOpen = () => {
    setPopup(true);
  }

  return (
    <>    
      <div id='inquireWrite'>
        <InquireInput title="문의 제목" type="text" required={true} placeholder="문의 제목을 입력해주세요."/>
        <InquireInput title="문의 유형" type="select" required={true} placeholder="문의 유형을 선택해주세요."/>
        <InquireInput title="문의 내용" type="textArea" required={true} placeholder={inquireContent}/>
        <ImageUpload title="사진 첨부" subTitle="(최대 10MB)"/>
        <label className="inputLabel">
          <input type="checkbox" className="blind" name="checkList"/>
          <span className="checkIcon"></span>
          <p className="checkinfo">개인정보 수집 동의<span>[필수]</span></p>
          <button className='policyBtn' onClick={popupOpen}>자세히</button>
        </label>
        <SubmitBtn text={'등록하기'} />
      </div>
      {
        popup &&
        <LayerPopup setPopup={setPopup}>
          <div className='popTitle'>개인정보 수집 및 이용에 동의</div>
          <div className='popContent'>
            <ul className='dashList'>
              <li>수집 및 이용 항목 : 닉네임, 이메일, 휴대전화번호</li>
              <li>수집 및 이용 목적 : 문의에 대한 답변 관련 업무</li>
              <li>보유 및 이용 기간 : 6개월</li>
              <li>회사는 문의에 대한 답변을 위한 목적으로 관계 법령에 따라 정보 수집 및 이용에 동의를 얻어 수집 합니다.</li>
            </ul>
          </div>
        </LayerPopup>
      }
    </>
  )
}

export default InquireWrite
