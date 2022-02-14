import React, {useState} from 'react'

// global components
import InputItems from 'components/ui/inputItems/InputItems'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
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
  const [openSelect, setOpenSelect] = useState(false)
  const [selectedInfo, setSelectedInfo] = useState({key: '문의 유형을 선택해주세요.', value: ''})
  const [defaultValue, setDefaultValue] = useState("")
  
  const openPopSelect = () => {
    setOpenSelect(!openSelect)
  }

  const onFocusPlaceholer = () => {
    setDefaultValue(placeholder)
  }

  return (
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
        <button className='policyBtn'>자세히</button>
      </CheckList>
      <SubmitBtn text={'등록하기'} />
    </div>
  )
}

export default InquireWrite
