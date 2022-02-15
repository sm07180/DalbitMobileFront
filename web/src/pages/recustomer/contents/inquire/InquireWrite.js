import React, {useState} from 'react'

// global components
import InputItems from 'components/ui/inputItems/inputItems'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
import LayerPopup from 'components/ui/layerPopup/LayerPopup'
// components
import CheckList from '../../components/CheckList'
import ImageUpload from '../../components/ImageUpload'
// css
import './inquireWrite.scss'

const inquireTypes = [
  {key: '회원정보', value: '1'},
  {key: '방송', value: '2'},
  {key: '청취', value: '3'},
  {key: '결제', value: '4'},
  {key: '장애/버그', value: '5'},
];
const placeholder = `아래 내용을 함께 보내주시면 더욱 빠른 처리가 가능합니다.

OS (ex-Window 버전10) : 
브라우저 : 
문제발생 일시 :  
문의내용 : `

const InquireWrite = (props) => {
  const [popup, setPopup] = useState(false)
  const [openSelect, setOpenSelect] = useState(false)
  const [selectedInfo, setSelectedInfo] = useState({key: '문의 유형을 선택해주세요.', value: ''})
  const [defaultValue, setDefaultValue] = useState("")
  
  const openPopSelect = () => {
    setOpenSelect(!openSelect)
  }

  const onFocusPlaceholer = () => {
    setDefaultValue(placeholder)
  }

  const popupOpen = () => {
    setPopup(true);
  }

  return (
    <>
      <div id='inquireWrite'>
        <InputItems title="문의 제목">
          <input type="text" placeholder="문의 제목을 입력해주세요." />
        </InputItems>
        <InputItems title="문의 유형">
          <button onClick={openPopSelect}>{selectedInfo.key}</button>
          {openSelect &&
          <div className="selectWrap">
            {inquireTypes.map((item, index) => {
              return (
                <div key={index} className="option" onClick={() => selectReportType(item)}>{item.key}</div>
              )
            })}
          </div>
          }
        </InputItems>
        <InputItems title="문의 내용" type="textarea">
          <textarea rows="10" onFocus={onFocusPlaceholer} defaultValue={defaultValue} placeholder={placeholder}></textarea>
        </InputItems>
        <ImageUpload title="사진 첨부" subTitle="(최대 10MB)"/>
        <CheckList text="개인정보 수집 동의">
          <button className='policyBtn' onClick={popupOpen}>자세히</button>
        </CheckList>
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
