import React, {useEffect, useState, useContext} from 'react'
import {Context} from "context";

import Api from 'context/api'
import Utility from 'components/lib/utility'

// global components
import Header from 'components/ui/header/Header'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
// components
// contents
// css
import './exchangeResult.scss'
import {useHistory, useLocation, useParams} from "react-router-dom";

const ExchangeResult = () => {
  const context = useContext(Context);
  const history = useHistory();
  const location = useLocation();

  const {reqByeolCnt, accountName, bankName, accountNo} = location.state;

  const [realCash, setRealCash] = useState(location.state?.realCash || 0);

  useEffect(() => {
    
    //환전 계산 하지 않고 환전 신청한 경우에 별갯수로 환전금액 계산하기
    if(!realCash){

      Api.exchangeCalc({
        data: {byeol: reqByeolCnt}
      }).then((res) => {
        if (res.result === 'success') {
          const {realCash} = res.data;
          setRealCash(realCash || 0);
        }
      });
    }
  },[]);

  return (
    <div id="resultPage">
      <Header title="환전하기" type="back"
              backEvent={() => {
                history.push('/mypage');
              }}
      />
      <section className="bankResult">
        <div className="resultText">
          <div className="title">
            <span>환전 신청 완료</span> 되었습니다!
          </div>
          <div className="subTitle">
          실제 입금까지는 최대 2-3일 소요될 예정입니다.<br/>
          관련 문의는 고객센터로 부탁드립니다.
          </div>
        </div>
        <div className="receiptBoard">
          <div className="receiptList">
            <span>환전 신청 별</span>
            <p>{Utility.addComma(reqByeolCnt)}</p>
          </div>
          <div className="receiptList">
            <span>환전 실수령액</span>
            <p><span className="point">{Utility.addComma(realCash)}</span>원</p>
          </div>
          <div className="receiptList">
            <span>예금주</span>
            <p>{accountName}</p>
          </div>
          <div className="receiptList">
            <span>입금 예정 은행</span>
            <p>{bankName}</p>
          </div>
          <div className="receiptList">
            <span>계좌번호</span>
            <p>{`${accountNo?.concat([]).slice(0, 3)}-${accountNo?.concat([]).slice(4, 6)}-${accountNo?.concat([]).slice(6, accountNo.length)}`}</p>
          </div>
        </div>

        <SubmitBtn text="확인"
                   onClick={() => {
                     history.push('/mypage');
                   }}
        />
      </section>
    </div>
  )
}

export default ExchangeResult