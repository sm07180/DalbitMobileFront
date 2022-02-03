import React, {useEffect, useState, useContext} from 'react'
import {Context} from "context";

import Api from 'context/api'
import Utility from 'components/lib/utility'

// global components
import Header from 'components/ui/header/Header'
import InputItems from 'components/ui/inputItems/InputItems'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
// components
import Tabmenu from '../../components/Tabmenu'
// contents
import BankResult from './bankResult'
// css
import './bankTransfer.scss'

const receiptTabmenu = ['신청안함','소득공제용','지출증빙용']

const BankTransfer = () => {
  const context = useContext(Context);
  const [receiptTabType, setReceiptTabType] = useState(receiptTabmenu[0]);

  const [bankResult, setBankResult] = useState(true);

  return (
    <div id="bankTransfer">
      <Header title="무통장(계좌이체)" position="sticky" type="back" />
      {bankResult === false ?
      <>
      <section className="infoInput">
        <InputItems title="입금정보">
          <p>{Utility.addComma(33000)} 원<span>(부가세포함)</span></p>
        </InputItems>
        <InputItems title="입금은행">
          <p>국민은행</p>
        </InputItems>
        <InputItems title="입금자명">
          <input type="text" maxLength="15" placeholder="입금자명을 입력해주세요." />
        </InputItems>
        <InputItems title="입금자명">
          <input type="tel" maxLength="15" placeholder="숫자만 입력해주세요." />
        </InputItems>
        <div className="tabmenuWrap">
          <div className="title">현금영수증</div>
          <ul className="tabmenu">
            <Tabmenu data={receiptTabmenu} tab={receiptTabType} setTab={setReceiptTabType} />
          </ul>
        </div>
        <InputItems>
          <input type="number" maxLength="20" placeholder="주민번호 또는 휴대폰 번호를 입력해주세요." />
        </InputItems>
        <SubmitBtn text="입금계좌 받기" state="disabled" />
      </section>
      <section className="noticeInfo">
        <h3>무통장 입금 안내</h3>
        <p>심야시간 무통장 입금이 지연될 경우
          <strong onClick={() => history.push('/pay/bank_info')}>은행별 점검시간을 확인</strong>하세요.</p>
        <p>매월 말에서 1일 자정시간은 거래량이 급증하여 이체처리가 지연 될 수 있습니다.</p>
        <p>시스템 점검시간으로 이체가 지연되는 경우 다른 결제 수단을 이용 하시면 보다 신속하게 달 충전을 완료 할 수 있습니다.</p>
        <p>정기점검 일정은 당행 사정에 따라 변경될 수 있습니다.</p>
      </section>
      <section className="bottomInfo">
        <button className='inspectionTime' onClick={() => history.push('/pay/bank_info')}>은행별 점검시간 확인</button>
      </section>
      </>
      :
      <BankResult />
      }
    </div>
  )
}

export default BankTransfer