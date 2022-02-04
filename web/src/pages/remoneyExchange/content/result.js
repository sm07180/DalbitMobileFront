import React from 'react'
import {useHistory} from 'react-router-dom'

import Header from 'components/ui/header/Header'

import ExchangeReceipt from './subcontent/do_exchange_calc'

const exchangeResult =() => {
  return (
    <div className="exchangeResult">
      <Header type={'back'} title={'환전하기'}></Header>
      <section className="titleWrap">
        <div className="title">
          <span>환전 신청 완료</span> 되었습니다!
        </div>
        <div className="subTit">
          실제 입금까지는 최대 2-3일 소요될 예정입니다.
          <br/>
          관련 문의는 고객센터로 부탁드립니다.
        </div>
      </section>
      <section className="receiptWrap">
        <ExchangeReceipt type={'result'}/>
      </section>
      <section className="bottomWrap">
        <button>확인</button>
      </section>
    </div>
  )
}

export default exchangeResult

const bankList = [
  {text: '은행명', value: '0'},
  {text: '경남은행', value: '39'},
  {text: '광주은행', value: '34'},
  {text: '국민은행', value: '4'},
  {text: '기업은행', value: '3'},
  {text: '농협', value: '11'},
  {text: '대구은행', value: '31'},
  {text: '도이치은행', value: '55'},
  {text: '부산은행', value: '32'},
  {text: '비엔피파리바은행', value: '61'},
  {text: '산림조합중앙회', value: '64'},
  {text: '산업은행', value: '2'},
  {text: '저축은행', value: '50'},
  {text: '새마을금고중앙회', value: '45'},
  {text: '수출입은행', value: '8'},
  {text: '수협은행', value: '7'},
  {text: '신한은행', value: '88'},
  {text: '신협', value: '48'},
  {text: '우리은행', value: '20'},
  {text: '우체국', value: '71'},
  {text: '전북은행', value: '37'},
  {text: '제주은행', value: '35'},
  {text: '중국건설은행', value: '67'},
  {text: '중국공상은행', value: '62'},
  {text: '카카오뱅크', value: '90'},
  {text: '케이뱅크', value: '89'},
  {text: '펀드온라인코리아', value: '294'},
  {text: '한국씨티은행', value: '27'},
  {text: 'BOA은행', value: '60'},
  {text: 'HSBC은행', value: '54'},
  {text: '제이피모간체이스은행', value: '57'},
  {text: '하나은행', value: '81'},
  {text: 'SC제일은행', value: '23'},
  {text: 'NH투자증권', value: '247'},
  {text: '교보증권', value: '261'},
  {text: '대신증권', value: '267'},
  {text: '메리츠종합금융증권', value: '287'},
  {text: '미래에셋대우', value: '238'},
  {text: '부국증권', value: '290'},
  {text: '삼성증권', value: '240'},
  {text: '신영증권', value: '291'},
  {text: '신한금융투자', value: '278'},
  {text: '유안타증권', value: '209'},
  {text: '유진투자증권', value: '280'},
  {text: '이베스트투자증권', value: '265'},
  {text: '케이프투자증권', value: '292'},
  {text: '키움증권', value: '264'},
  {text: '하나금융투자', value: '270'},
  {text: '하이투자증권', value: '262'},
  {text: '한국투자증권', value: '243'},
  {text: '한화투자증권', value: '269'},
  {text: '현대차증권', value: '263'},
  {text: 'DB금융투자', value: '279'},
  {text: 'KB증권', value: '218'},
  {text: 'KTB투자증권', value: '227'},
  {text: 'SK증권', value: '266'}
]
