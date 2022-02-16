import React, {useState, useEffect} from 'react'
import Utility ,{addComma} from 'components/lib/utility'

// global components
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
// components
import Tabmenu from '../../components/tabmenu'
// contents
import DepositInfo from './DepositInfo'
import NewlyAccount from './NewlyAccount'
import MyAccount from './MyAccount'
import {useHistory} from "react-router-dom";

const depositTabmenu =['신규 정보','최근 계좌','내 계좌']

const Exchange = (props) => {
  const [depositType,setDepositType] = useState(depositTabmenu[2]);
  const history = useHistory();

  return (
    <>
    <section className="doExchange">
      <button className='noticeBtn'>
        <span className="noticeIcon">?</span>환전이 궁금하시다면?
      </button>
      <div className="amountBox">
        <i className="iconStar"></i>
        <p>보유 별</p>
        <div className='counter active'>
          <input className="num" value={Utility.addComma(33000)} disabled/>
          <span className="unit">개</span>
        </div>
      </div>
      <div className="infoBox">
          {/* {badgeSpecial > 0 && (
            <>
              <p className="special">DJ님은 스페셜 DJ 입니다.</p>
              <p className="special">환전 실수령액이 5% 추가 됩니다.</p>
            </>
          )} */}
          <p>별은 570개 이상이어야 환전 신청이 가능합니다</p>
          <p>별 1개당 KRW 60으로 환전됩니다.</p>
      </div>
      <div className="amountBox apply">
        <i className="iconStar"></i>
        <p>환전 신청 별</p>
        <div className='counter active'>
          <input className='num' placeholder={Utility.addComma(33000)}/>
          <span className='unit'>개</span>
        </div>
      </div>
      <div className="buttonGroup">
        <button>
          환전 계산하기
        </button>
        <button className='exchange' onClick={()=>history.push('/wallet/exchange')}>
          달 교환
        </button>
      </div>
    </section>
    <section className="receiptBoard">
      <div className="receiptList">
        <span>환전 신청 금액</span>
        <p>KRW {Utility.addComma(33000)}</p>
      </div>
      <div className="receiptList">
        <span>원천징수세액</span>
        <p>-{Utility.addComma(5940)}</p>
      </div>
      <div className="receiptList">
        <span>이체 수수료</span>
        <p>-{Utility.addComma(500)}</p>
      </div>
      <div className="receiptList">
        <span>환전 예상 금액</span>
        <p className="point">KRW {Utility.addComma(173560)}</p>
      </div>
    </section>
    <section className="depositInfo">
      <h2>입금 정보</h2>
      <Tabmenu data={depositTabmenu} tab={depositType} setTab={setDepositType} />
      {depositType === depositTabmenu[0] ?
        <DepositInfo />
        : depositType === depositTabmenu[1] ?
        <NewlyAccount />
        :
        <MyAccount />
      }
    </section>
    </>
  )
}

export default Exchange