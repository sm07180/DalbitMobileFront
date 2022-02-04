import React,{useState} from 'react'

import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'

const exchangeMyAccount = () =>{
  const [accountInfo, setAccountInfo] = useState(true)
  
  return(
    <>
      {accountInfo === false ?
      <div className="formBox empty">
        <p>등록된 내 계좌가 없어요.</p>
        <button className='addAccountBtn'>+ 계좌추가</button>
      </div>
      :
      <div className="formBox">
        <div className="accountList active">
          <div className="content">
            <div className="name">강금옥</div>
            <div className="account">광주은행 567-8463-538729</div>
          </div>
          <span className="iconEdit"></span>
        </div>
        <div className="accountList">
          <div className="content">
            <div className="name">강금옥</div>
            <div className="account">광주은행 567-8463-538729</div>
          </div>
          <span className="iconEdit"></span>
        </div>
        <button className='addAccountBtn haveList'>+ 계좌추가</button>
        <SubmitBtn text={'환전 신청하기'} />
      </div>
      }
    </>
  )
}

export default exchangeMyAccount