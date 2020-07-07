import React from 'react';
import BackBtn from '../static/ic_back.svg'
import '../content/sample.scss'
const sample = (props) => {

  return (<>

    <div className="header">
    <img src={BackBtn} className="header__button--back" />
    <h1 className="header__title">환전하기</h1>
    </div>

    <div className="content">
    <h2 class="charge__title">환전신청 완료</h2>
      <div class="exchangeList">
      환전 신청 별  <div className="exchangeList__text">600</div>
      </div>
      <div class="exchangeList">
      환전 실수령액  <div className="exchangeList__text">
      <div className="exchangeList__text exchangeList__text--purple">38,110</div>
        원</div>
      </div>
      <div class="exchangeList">
      예금주  <div className="exchangeList__text">달나라</div>
      </div>
      <div class="exchangeList">
      입금 예정 은행 <div className="exchangeList__text">신한은행</div>
      </div>
      <div class="exchangeList">
      계좌번호  <div className="exchangeList__text">12001123458961</div>
      </div> 

      <div className="exchangeList__notice">
      위의 내용으로 환전 신청이 완료되었습니다.<br/><br/>
      환전 신청이 완료되었습니다.<br/>
실제 입금까지는 최대 2~3일 소요될 예정입니다.<br/>
관련 문의는 고객센터로 부탁드립니다.<br/>
      </div>      

      <button className="chargeButton chargeButton--active">확인</button>                 
    </div>


  </>);
};

export default sample;