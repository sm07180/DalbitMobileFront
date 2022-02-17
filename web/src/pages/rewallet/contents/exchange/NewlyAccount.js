import React from 'react'

// global components
import InputItems from 'components/ui/inputItems/InputItems'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
// components

const NewlyAccount = (props) => {

  return (
    <>
      <form className="formBox">
        <div className="listRow">
          <InputItems title="예금주">
            <div className="text">홍길동</div>
          </InputItems>
        </div>
        <div className="listRow">
          <InputItems title="은행">
            <div className="text">광주은행</div>
          </InputItems>
        </div>
        <div className="listRow">
          <InputItems title="계좌번호">
            <div className="text">계좌번호-계좌-계좌번호다</div>
          </InputItems>
        </div>
        <div className="listRow">
          <div className="title">주민등록번호</div>
          <div className="inputGroup">
            <InputItems>
              <div className="text">147521</div>
            </InputItems>
            <span className='line'>-</span>
            <InputItems>
              <div className="text">2●●●●●●</div>
            </InputItems>
          </div>
        </div>
        <div className="listRow">
          <InputItems title="휴대폰 번호">
            <div className="text">010-0101-0101</div>
          </InputItems>
        </div>
        <div className="listRow address">
          <InputItems title="주소">
            <div className="text">광주광역시 서구 치평동 1326 4층 여보야</div>
          </InputItems>
        </div>
        <SubmitBtn text="환전 신청하기" state="disabled" />
      </form>
    </>
  )
}

export default NewlyAccount
