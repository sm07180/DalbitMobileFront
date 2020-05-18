import React, {component} from 'react'
import './seo.scss'
import BackBtn from './static/ic_back.svg'
import IconMoney from './static/ic_money.svg'
import IconNotice from './static/ic_notice.svg'
import check from './static/ico-checkbox-off.svg'

import SelectBoxWrap from './component/select'

export default () => {
  return (
    <>
      <div className="header">
        <img src={BackBtn} className="header__button--back" />
        <h1 className="header__title">달 충전 결제 대기중</h1>
      </div>
      <div className="content">
        <div className="payHold">
          <h2 className="payHold__title">
            <img src={IconMoney} className="payHold__object" />
            결제대기중
            <i className="payHold__dot"></i>
            <i className="payHold__dot"></i>
            <i className="payHold__dot"></i>
          </h2>

          <div className="payHold__sub">
            <span className="payHold__sub--text">24시간 내 해당계좌로 입금</span>하시면
            <br />달 충전이 완료 됩니다.
          </div>
        </div>

        <div className="phone">
          <div className="phone__title">010-6648-0948</div>
          <div className="phone__text">해당 번호로 가상계좌 정보가 발송되었습니다.</div>
        </div>

        <div className="deposit">
          <div className="deposit__list">
            <div className="deposit__label">입금하실 금액</div>
            <div className="deposit__value">55,000원(부가세 포함)</div>
          </div>
          <div className="deposit__list">
            <div className="list__label">예금주</div>
            <div className="deposit__value">(주)인포렉스</div>
          </div>
          <div className="deposit__list">
            <div className="list__label">입금은행</div>
            <div className="deposit__value">KB 국민은행</div>
          </div>
          <div className="deposit__list">
            <div className="list__label">입금은행</div>
            <div className="deposit__value">197790-71-606640</div>
          </div>
          <div className="deposit__list">
            <div className="list__label">입금자명</div>
            <div className="deposit__value">홍길동</div>
          </div>
        </div>
        <div className="inquiry">
          <span className="inquriy__title">결제 문의</span>
          <span className="inquiry__number">1522-0251</span>
        </div>

        <button className="chargeButton">확인</button>
      </div>

      <div className="hm">{/* 환전하기 나누기 여백 */}</div>

      <div className="header">
        <img src={BackBtn} className="header__button--back" />
        <h1 className="header__title">환전하기</h1>
      </div>

      <div className="content">
        <div className="myStar">
          <div className="charge__title">
            <div className="mystar__title">환전 정보</div>
            <div className="charge__title--point">
              유의사항
              <img src={IconNotice} className="charge__title--object" />
            </div>
          </div>

          <p className="myStar__notice">* 별은 500개 이상이어야 환전 신청이 가능하며, 별 1개당 KRW 60으로 환전됩니다.</p>

          <div className="point">
            <div className="point__list point__list--left">
              <div className="point__label">보유 별</div>
              <div className="point__value">500</div>
            </div>
            <div className="point__list">
              <div className="point__label">환전 신청 별</div>
              <input type="text" className="point__value  point__value--input" value="90" />
            </div>
          </div>

          <a href="#" className="point__button">
            환전 계산
          </a>

          <div className="pay">
            <div className="pay__list pay__list--margin">
              <div className="pay__label pay__label--title">환전 예상 금액</div>
              <div className="pay__value">KRW 30,000</div>
            </div>
            <div className="pay__list">
              <div className="pay__list--small">원천징수세액</div>
              <div className="pay__list--small">-990</div>
            </div>
            <div className="pay__list">
              <div className="pay__list--small">이체수수료</div>
              <div className="pay__list--small">-500</div>
            </div>
            <div className="pay__list pay__list--line">
              <div className="pay__label pay__label--title">환전 실수령액</div>
              <div className="pay__value">
                <div className="pay__value--text">KRW</div> <div className="pay__value--purple">28,510</div>
              </div>
            </div>
          </div>
        </div>

        <div className="charge__title">입금 정보</div>

        <div className="PayView">
          <div className="PayView__list">
            <div className="PayView__title">예금주</div>
            <div className="PayView__input">
              <input type="text" value="달나라" className="PayView__input--text" />
            </div>
          </div>

          <div className="PayView__list">
            <div className="PayView__title">은행</div>
            <div className="PayView__input">
              <SelectBoxWrap boxList={[{value: 0, text: '주민번호'}]} onChangeEvent={() => console.log('hi')} />
            </div>
          </div>

          <div className="PayView__list">
            <div className="PayView__title">계좌번호</div>
            <div className="PayView__input">
              <input type="text" value="059402-04194521" className="PayView__input--text" />
            </div>
          </div>

          <div className="PayView__list">
            <div className="PayView__title">주민등록번호</div>
            <div className="PayView__input--nomber">
              <input type="text" value="901231" className="PayView__input--text" />
              <span className="PayView__input--line">-</span>
              <input type="text" value="1234567" className="PayView__input--text" />
            </div>
          </div>

          <div className="PayView__list">
            <div className="PayView__title">전화번호</div>
            <div className="PayView__input">
              <input type="text" value="01098765432" className="PayView__input--text" />
            </div>
          </div>
          <div className="PayView__list">
            <div className="PayView__title">주소</div>
            <div className="PayView__input">
              <div className="PayView__address--list">
                <input type="text" value="54789" className="PayView__input--text adressBg" />
                <button className="PayView__input--button">주소검색</button>
              </div>
              <div className="PayView__address--list">
                <input type="text" value="서울시 강남구 삼성1동 56-2" className="PayView__input--text adressBg" />
              </div>
              <div className="PayView__address--list">
                <input type="text" value="매직킹덤빌딩 801호" className="PayView__input--text" />
              </div>
            </div>
          </div>

          <div className="PayView__list">
            <div className="PayView__title">신분증사본</div>
            <div className="PayView__input--file">
              <input type="text" value="주민등록등본.pdf" className="PayView__input--text" />
              <button className="PayView__input--button">찾아보기</button>
            </div>
          </div>

          <div className="PayView__list">
            <div className="PayView__title">통장사본</div>
            <div className="PayView__input--file">
              <input type="text" value="통장사본.jpg" className="PayView__input--text" />
              <button className="PayView__input--button">찾아보기</button>
            </div>
          </div>
        </div>

        <div className="privacy">
          <div className="privacy__title">
            <img src={check} className="privacy__checkBox" />
            개인정보 수집 및 이용에 동의합니다.
          </div>
          <div className="privacy__text">
            회사는 환전의 목적으로 회원 동의 하에 관계 법령에서 정하는 바에 따라 개인정보를 수집할 수 있습니다. (수집된 개인정보는
            확인 후 폐기 처리합니다.)
          </div>
        </div>

        <button className="privacyButton">환전 신청하기</button>
      </div>

      <div className="hm">{/* 환전 유의 사항 나누기 여백 */}</div>
    </>
  )
}
