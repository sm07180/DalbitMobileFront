import React from 'react'

import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'

export default function ExchangeForm() {

  return (
    <>
      <div className="formBox">
        <div className="listRow">
          <div className="title">예금주</div>
          <div className="inputBox">
            <input type="text" placeholder='이름을 입력해주세요'></input>
          </div>
        </div>
        <div className="listRow">
          <div className="title">은행</div>
          <div className="inputBox select">
            <div>
              은행 선택
            </div>
          </div>
        </div>
        <div className="listRow">
          <div className="title">계좌번호</div>
          <div className="inputBox">
            <input type="num" placeholder='계좌번호를 입력해주세요 (숫자)'/>
          </div>
        </div>
        <div className="listRow">
          <div className="title">주민등록번호</div>
          <div className="inputBox">
            <input type="num" maxLength={6} placeholder='앞 6자리'></input>
            <span className="line">-</span>
            <input type="password" maxLength={7} placeholder='뒤 7자리'></input>
          </div>
        </div>
        <div className="listRow">
          <div className="title">휴대폰 번호</div>
          <div className="inputBox">
            <input type="tel" placeholder='숫자만 입력해주세요'/>
          </div>
        </div>
        <div className="listRow">
          <div className="title">우편번호</div>
          <div className="inputBox">
            <div>
              주소검색 해주세요
            </div>
            <button>주소검색</button>
          </div>
        </div>
        <div className="listRow">
          <div className="title">주소</div>
          <div className="inputBox select">
            <div>
              자동으로 입력됩니다
            </div>
          </div>
        </div>
        <div className="listRow">
          <div className="title">상세주소</div>
          <div className="inputBox">
            <input type="text" placeholder='상세주소를 입력해주세요'></input>
          </div>
        </div>
        <div className="listRow">
          <div className="title">신분증사본</div>
          <div className="inputBox">
            <div>
              등록해주세요
            </div>
            <button>찾아보기</button>
          </div>
        </div>
        <div className="listRow">
          <div className="title">통장사본</div>
          <div className="inputBox">
            <div>
            등록해주세요
            </div>
            <button>찾아보기</button>
          </div>
        </div>
      </div>
      <div className="privacyBox">
        <div className="privacyTit">
          <label className="checkboxLabel">
            <input type="checkbox"/>
            <span className="checkboxBtn"></span>
          </label>
          개인정보 수집 동의
          <span className="highlight">[필수]</span>
        </div>
        <p>
          회사는 환전의 목적으로 회원 동의 하에 관계 법령에서 정하는 바에 따라 개인정보를 수집할 수 있습니다. (수집된 개인정보는 확인 후 폐기 처리 합니다.)
        </p>
      </div>
      <SubmitBtn text={'환전 신청하기'} />
    </>
  )
}

const bankList = [
  {text: '은행선택', value: 0},
  {text: '경남은행', value: 39},
  {text: '광주은행', value: 34},
  {text: '국민은행', value: 4},
  {text: '기업은행', value: 3},
  {text: '농협', value: 11},
  {text: '대구은행', value: 31},
  {text: '도이치은행', value: 55},
  {text: '부산은행', value: 32},
  {text: '비엔피파리바은행', value: 61},
  {text: '산림조합중앙회', value: 64},
  {text: '산업은행', value: 2},
  {text: '저축은행', value: 50},
  {text: '새마을금고중앙회', value: 45},
  {text: '수출입은행', value: 8},
  {text: '수협은행', value: 7},
  {text: '신한은행', value: 88},
  {text: '신협', value: 48},
  {text: '우리은행', value: 20},
  {text: '우체국', value: 71},
  {text: '전북은행', value: 37},
  {text: '제주은행', value: 35},
  {text: '중국건설은행', value: 67},
  {text: '중국공상은행', value: 62},
  {text: '카카오뱅크', value: 90},
  {text: '케이뱅크', value: 89},
  {text: '펀드온라인코리아', value: 294},
  {text: '한국씨티은행', value: 27},
  {text: 'BOA은행', value: 60},
  {text: 'HSBC은행', value: 54},
  {text: '제이피모간체이스은행', value: 57},
  {text: '하나은행', value: 81},
  {text: 'SC제일은행', value: 23},
  {text: 'NH투자증권', value: 247},
  {text: '교보증권', value: 261},
  {text: '대신증권', value: 267},
  {text: '메리츠종합금융증권', value: 287},
  {text: '미래에셋대우', value: 238},
  {text: '부국증권', value: 290},
  {text: '삼성증권', value: 240},
  {text: '신영증권', value: 291},
  {text: '신한금융투자', value: 278},
  {text: '유안타증권', value: 209},
  {text: '유진투자증권', value: 280},
  {text: '이베스트투자증권', value: 265},
  {text: '케이프투자증권', value: 292},
  {text: '키움증권', value: 264},
  {text: '하나금융투자', value: 270},
  {text: '하이투자증권', value: 262},
  {text: '한국투자증권', value: 243},
  {text: '한화투자증권', value: 269},
  {text: '현대차증권', value: 263},
  {text: 'DB금융투자', value: 279},
  {text: 'KB증권', value: 218},
  {text: 'KTB투자증권', value: 227},
  {text: 'SK증권', value: 266}
]