import React, {useState, useEffect,useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'

// global components
import InputItems from 'components/ui/inputItems/InputItems'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
import PopSlide from 'components/ui/popSlide/PopSlide'
// components

const MyAccount = (props) => {
  const history = useHistory()
  //context
  const context = useContext(Context)
  const {profile} = context

  const [accountInfo, setAccountInfo] = useState(true)
  const [slidePop, setSlidePop] = useState(true)
  const [modifySlidePop, setModifySlidePop] = useState(true)

  // 계좌 추가/수정
  const onClickAddAcount = () => {
    setSlidePop(!slidePop)
    setModifySlidePop(false)
  }

  const onClickModifyAcount = () => {
    setSlidePop(!slidePop)
    setModifySlidePop(true)
  }

  // 환전 신청
  const onClickExchange = () => {
    history.push('/wallet/result')
  }
  
  return (
    <>
      {accountInfo === false ?
      <div className="formBox empty">
        <p>등록된 내 계좌가 없어요.</p>
        <button className='addAccountBtn' onClick={onClickAddAcount}>+ 계좌추가</button>
      </div>
      :
      <div className="formBox">
        <div className={`accountList ${true && 'active'}`}>
          <div className="content">
            <div className="name">강금옥</div>
            <div className="account">광주은행 567-8463-538729</div>
          </div>
          <span className="iconEdit" onClick={onClickModifyAcount}></span>
        </div>
        <div className={`accountList ${false && 'active'}`}>
          <div className="content">
            <div className="name">강금옥</div>
            <div className="account">광주은행 567-8463-538729</div>
          </div>
          <span className="iconEdit" onClick={onClickModifyAcount}></span>
        </div>
        <button className='addAccountBtn haveList' onClick={onClickAddAcount}>+ 계좌추가</button>
        <SubmitBtn text="환전 신청하기" state="disabled" onClick={onClickExchange} />
      </div>
      }
      {slidePop &&
        <PopSlide setPopSlide={setSlidePop}>
          <section className="addAcount">
            {modifySlidePop === true ?
            <>
              <h3>계좌 수정</h3>
              <div className="formBox">
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
                    <div className="text">222222-33-4444444</div>
                  </InputItems>
                </div>
              </div>
              <div className="buttonGroup">
                <button className="cancel">삭제</button>
                <button className="apply">수정</button>
              </div>
            </>
            :
            <>
              <h3>계좌 추가</h3>
              <div className="formBox">
                <div className="listRow">
                  <InputItems title="예금주">
                    <input type="text" placeholder=""/>
                  </InputItems>
                </div>
                <div className="listRow">
                  <InputItems title="은행">
                    <div className="select">은행선택</div>
                  </InputItems>
                </div>
                <div className="listRow">
                  <InputItems title="계좌번호">
                    <input type="number" placeholder=""/>
                  </InputItems>
                </div>
              </div>
              <div className="buttonGroup">
                <button className="cancel">취소</button>
                <button className="apply">적용</button>
              </div>
            </>
            }
          </section>
        </PopSlide>
      }
    </>
  )
}

export default MyAccount