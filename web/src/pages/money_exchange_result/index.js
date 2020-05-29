import React from 'react';
//import BackBtn from './static/ic_back.svg'
import CloseBtn from './static/ic_close.svg';
import './index.scss'
import SignalingHandler from 'components/lib/copysh';
export default (props) => {
  console.log(props);
  const {history, location} = props;

  const { beyol, realCash, bankCode, accountNo, accountName } = location.state

  const handleClick = () => {
    history.push("/");
  }
  return (<>

    <div className="header">
    <h1 className="header__title">환전하기</h1>
    <img src={CloseBtn} className="header__button--close" onClick={handleClick} />
    </div>

    <div className="content">
    <h2 className="charge__title">환전신청 완료</h2>
      <div className="exchangeList">
      환전 신청 별  <div className="exchangeList__text">{beyol}</div>
      </div>
      <div className="exchangeList">
      환전 실수령액  <div className="exchangeList__text">
      <div className="exchangeList__text exchangeList__text--purple">{Number(realCash).toLocaleString()}</div>
        원</div>
      </div>
      <div className="exchangeList">
      예금주  <div className="exchangeList__text">{accountName}</div>
      </div>
      <div className="exchangeList">
      입금 예정 은행 <div className="exchangeList__text">{bankCode}</div>
      </div>
      <div className="exchangeList">
      계좌번호  <div className="exchangeList__text">{accountNo}</div>
      </div> 

      <div className="exchangeList__notice">
      위의 내용으로 환전 신청이 완료되었습니다.<br/><br/>
      환전 신청이 완료되었습니다.<br/>
실제 입금까지는 최대 2~3일 소요될 예정입니다.<br/>
관련 문의는 고객센터로 부탁드립니다.<br/>
      </div>      

      <button className="chargeButton chargeButton--active" onClick={handleClick}>확인</button>                 
    </div>


  </>);
};