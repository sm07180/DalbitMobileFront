import React, {useState, useContext, useEffect, useReducer, useMemo} from 'react'
import {useHistory} from 'react-router-dom'

import Header from 'components/ui/header/Header'
import TabBtn from 'components/ui/tabBtn/TabBtn'

import ExchangeReceipt from './subcontent/do_exchange_calc'
import ExchangeForm from './subcontent/do_exchange_form'
import ExchangeRepply from './subcontent/do_exchange_repply'
import ExchangeMyAccount from './subcontent/do_exchange_myAccount'

const depositOption =['신규 정보','최근 계좌','내 계좌']

const DoExchange = () => {
  const history = useHistory()
  const [depositType, setDepositType] = useState(depositOption[0])

  const TabPage=()=>{
    if(depositType === depositOption[0]){
      return(<ExchangeForm/>)
    } else if(depositType === depositOption[1]){
      return(<ExchangeRepply/>)
    } else{
      return(<ExchangeMyAccount/>)
    }
  }

  return(
    <div className="doExchange">
      <Header type={'back'} title={'내 지갑'}>
        <div className="currentValue" onClick={() => {history.push('/store')}}>
          <i className="iconDal"></i>
          1,234
        </div>
      </Header>
      <section className="tabWrap">
        <div className="tabBox">
          <button onClick={() => {
              history.push('/wallet')
            }}>
            달 내역
          </button>
          <button>
            별 내역
          </button>
          <button className="active">
            환전
          </button>
        </div>
      </section>
      <section className="exchangeWrap">
        <button className='noticeBtn'>
          <span>환전안내</span>
        </button>
        <div className="amountBox">
          <i className="iconStar"></i>
          <p>보유 별</p>
          <div className='counter disabled'>
            <span className="num">5,000</span>
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
        <div className="amountBox active">
          <i className="iconStar"></i>
          <p>환전 신청 별</p>
          <div className='counter'>
            <input className='num' placeholder='0'/>
            <span className='unit'>개</span>
          </div>
        </div>
        <div className="btnBox">
          <button>
            환전 계산하기
          </button>
          <button className='exchange'
            onClick={() => {
              history.push('/exchange')
            }}>
            달 교환
          </button>
        </div>
      </section>
      <section className="receiptWrap">
        <ExchangeReceipt />
      </section>
      <section className="formWrap">
        <div className="title">
          입금 정보
        </div>
        <div className="tabmenu">
          {depositOption && depositOption.length > 0 &&
              depositOption.map((data, index)=>{
                const param ={
                  item: data,
                  tab: depositType,
                  setTab: setDepositType
                }
                return(
                  <ul key={index}>
                    <TabBtn param={param} />
                  </ul>
                )
              })
          }
        </div>
        <TabPage/>
      </section>
    </div>
  )
}

export default DoExchange