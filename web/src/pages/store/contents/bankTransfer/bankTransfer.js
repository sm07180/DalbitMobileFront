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
import {useHistory, useLocation} from "react-router-dom";


const BankTransfer = () => {
  const location = useLocation()
  const history = useHistory()
  const {prdtNm, prdtPrice, itemNo, itemAmt, webview} = location.state

  const context = useContext(Context)
  const [userInfo, setUserInfo] = useState({
    name: "김현진",
    phone: "01083490706",
    receiptCode: "n",
    receiptPhone: "",
    receiptSocial: "",
    receiptBiz: "",
  })

  const clickDeposit = () => {
    const rgEx = /(01[0123456789])(\d{4}|\d{3})\d{4}$/g
    if (userInfo.name.length < 2) {
      return context.action.alert({
        msg: `입금자명을 입력해주세요.`
      })
    }
    if (!userInfo.phone) {
      return context.action.alert({
        msg: `핸드폰번호를 입력해주세요.`
      })
    }
    if (!rgEx.test(userInfo.phone)) {
      return context.action.alert({
        msg: `올바른 핸드폰번호가 아닙니다.`
      })
    }
    if (userInfo.receiptCode === 'i' && !userInfo.receiptPhone) {
      return context.action.alert({
        msg: `현금영수증 발급을 위하여 \n 주민번호 또는 핸드폰번호를 입력해주세요.`
      })
    }
    if (userInfo.receiptCode === 'b' && !userInfo.receiptBiz) {
      return context.action.alert({
        msg: `현금영수증 발급을 위하여 \n 사업자번호를 입력해주세요.`
      })
    }

    getDepositInfo()
  }

  const getDepositInfo = async () => {
    const {result, data, message} = await Api.pay_coocon({
      data: {
        Prdtnm: prdtNm,
        Prdtprice: prdtPrice,
        itemNo: itemNo,
        itemAmt: itemAmt,
        rcptNm: userInfo.name,
        phoneNo: userInfo.phone,
        receiptCode: userInfo.receiptCode,
        receiptPhone: userInfo.receiptPhone,  //핸드폰번호
        receiptSocial: userInfo.receiptPhone, //주민등록번호
        receiptBiz: userInfo.receiptBiz
      }
    })
    if (result === 'success') {
      history.push({
        pathname: '/pay/bankInfo',
        state: {
          itemPrice: data.Prdtprice,
          name: data.rcptNm,
          bankNo: data.accountNo,
          phone: data.phoneNo,
          webview: webview,
        }
      })
    } else {
      context.action.alert({
        msg: message
      })
    }
  }

  const onChange = (e) => {
    const {value, name} = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value
    });
  };

  const tabClick = (e) => {
    const {tabTarget} = e.currentTarget.dataset
    console.log(tabTarget);
    setUserInfo({
      ...userInfo,
      receiptCode: tabTarget
    })
  }

    return (
    <div id="bankTransfer">
      <Header title="무통장(계좌이체)" position="sticky" type="back" />
      <section className="infoInput">
        <InputItems title="입금정보">
          <p>{Utility.addComma(prdtPrice)} 원<span>(부가세포함)</span></p>
        </InputItems>
        <InputItems title="입금은행">
          <p>국민은행</p>
        </InputItems>
        <InputItems title="입금자명">
          <input type="text" id="name" name="name" value={userInfo.name} onChange={onChange} placeholder="입금자명을 입력해주세요." />
        </InputItems>
        <InputItems title="핸드폰 번호">
          <input type="tel" id="phone" name="phone" value={userInfo.phone} onChange={onChange} placeholder="핸드폰 번호를 입력해주세요."/>
        </InputItems>
        <div className="tabmenuWrap">
          <div className="title">현금영수증</div>
          <ul className="tabmenu">
            <li onClick={tabClick} className={userInfo.receiptCode === "n" ? "active" : ""} data-tab-target="n">신청안함</li>
            <li onClick={tabClick} className={userInfo.receiptCode === "i"  ? "active" : ""} data-tab-target="i">소득공제용</li>
            <li onClick={tabClick} className={userInfo.receiptCode === "b"  ? "active": ""} data-tab-target="b">지출증빙용</li>
          </ul>
        </div>
        {userInfo.receiptCode === "i" && <InputItems><input type="number" name="receiptPhone" onChange={onChange} maxLength="20" placeholder="주민번호 또는 핸대폰번호를 입력해주세요."/></InputItems>}
        {userInfo.receiptCode === "b" && <InputItems><input type="number" name="receiptBiz" onChange={onChange} maxLength="20" placeholder="사업자번호를 입력해주세요."/></InputItems>}
        <SubmitBtn text="입금계좌 받기" onClick={()=>clickDeposit()} />
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
    </div>
  )
}

export default BankTransfer