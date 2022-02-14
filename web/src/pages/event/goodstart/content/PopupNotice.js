import React, {useEffect} from 'react'
import moment from 'moment'

import './popup.scss'

const PopupNotice = (props) => {
  const {onClose, tab, data} = props

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div id="popup">
      <div className="wrapper">
        <div className="title">이벤트 유의사항</div>
        {tab === 'dj' && <ul>
          <li><strong>DJ, 팬 2가지 동시 입상시 큰 상품만 당첨되며 중복 당첨되지 않습니다. </strong></li>
          <li>DJ 이벤트에 동일 회원(계정)이 참여해서 종합랭킹과 신인랭킹 2가지 모두 입상할 경우, 높은 상품 1가지만 인정합니다.</li>
          <li>당첨자는 목요일 오후 1시 이후에 발표합니다. </li>
          <li>부정한 방법으로 참여한 경우 이벤트 당첨이 취소될 수 있습니다.</li>
          <li>점수가 동일할 경우 레벨(경험치)이 높은 사람이 우선입니다.</li>
          <li>당첨된 달과 경품은 당첨자 발표 후에 순차적으로 지급될 예정입니다.</li>
          <li>DJ 부분 종합/신인은 중복 수상 안됩니다. (높은 상품(달/현금 구분없음) 순위 인정, 선택 불가). </li>
          <li>결과는 공지사항을 통해 발표하며, 당첨자 관련 서류는 문자를 통해 별도 안내드립니다.</li>
          <li>달을 제외한 경품의 제세공과금(22%)은 본인 부담입니다.</li>
          {data.map((data, index) => {
            const {start_date, end_date, good_no} = data
            const eventStart = Number(moment(start_date).format('YYMMDD')) <= Number(moment().format('YYMMDD'))
            const eventEnd = Number(moment(end_date).format('YYMMDD')) < Number(moment().format('YYMMDD'))
            return (
              <React.Fragment key={index}>
                {eventStart === true && eventEnd !== true &&
                  <>
                    {good_no === '2' && 
                    <li>경품 공지가격 안내<br/>
                      1&#41; 아이패드 프로 12.9형 : 150만원<br/>
                      2&#41; 나이키X사카이 베이퍼와플 : 80만원<br/>
                      2&#41; 삼성 비스포크 무선청소기 : 60만원<br/>
                      4&#41; 노스페이스 에코 눕시 자켓 패딩 : 30만원
                    </li>
                    }
                    {good_no === '3' && 
                    <li>경품 공지가격 안내<br/>
                      1&#41; 삼성전자 4K UHD QLED TV : 155만원<br/>
                      2&#41; 스웨터 멀티 컬러 울 스웨터 : 99만원<br/>
                      3&#41; 애플워치 나이키+ 7 : 50만원<br/>
                      4&#41; 나이키 에어 줌 알파플라이 넥스트% 플라이니트 : 34만원
                    </li>
                    }
                    {good_no === '4' && 
                    <li>경품 공지가격 안내<br/>
                      1&#41; Apple 2020 맥북 에어 13 : 150만원<br/>
                      2&#41; LG 스탠바이미 : 110만원<br/>
                      3&#41; 캐논 EOS M200 : 51만원<br/>
                      4&#41; 소니 WH-1000M4 : 36만원
                    </li>
                    }
                    {good_no === '5' && 
                    <li>경품 공지가격 안내<br/>
                      1&#41; 톰브라운 21FW MKA326A Y3001 415 스티치 니트 : 145만원<br/>
                      2&#41; Apple 아이폰 13 mini : 95만원<br/>
                    </li>
                    }
                  </>
                }
              </React.Fragment>
            )
          })}
          <li>
            경품 대신 현금 지급이 가능하며, 현금 지급을 원할 시 메일(help@dalbitlive.com)로 당첨자 서류와 함께 [현금 입금 희망]
            내용을 남겨주시면 이벤트 서류 확인 후 제세공과금(22%)을 제외한 금액이 입금됩니다.
          </li>
          <li>경품 대신 달로 받는 경우 제세공과금이 발생하지 않습니다. 달로 받고 싶은 분은 1:1문의에 남겨주세요. </li>
        </ul>}
        {tab === 'fan' && <ul>
          <li><strong>DJ, 팬 2가지 동시 입상시 큰 상품만 당첨되며 중복 당첨되지 않습니다. </strong></li>
          <li>당첨자는 목요일 오후 1시 이후에 발표합니다.</li>
          {data.map((data, index) => {
            const {start_date, end_date, good_no} = data
            const eventStart = Number(moment(start_date).format('YYMMDD')) <= Number(moment().format('YYMMDD'))
            const eventEnd = Number(moment(end_date).format('YYMMDD')) < Number(moment().format('YYMMDD'))
            return (
              <React.Fragment key={index}>
                {eventStart === true && eventEnd !== true &&
                  <>
                    {good_no === '5' && 
                    <li>경품 공지가격 안내<br/>
                      1&#41; 휴테크 안마의자 컴마 : 107만원<br/>
                      2&#41; 핸슨 로디 리클라이너 쇼파 : 70만원<br/>
                    </li>
                    }
                  </>
                }
              </React.Fragment>
            )
          })}
          <li>특별점수는 이벤트가 종료된 이후에 집계됩니다.<br/>
          만약 내가 1만개씩 선물한 A와 B가 나란히 1,2등에 입상했다면, 이벤트 종료 후 집계시 특별점수 2000점 + 2000점 = 4000점 추가 반영</li>
          <li>부정한 방법으로 참여한 경우 이벤트 당첨이 취소될 수 있습니다.</li>
          <li>점수가 동일할 경우 레벨(총 경험치)이  높은 사람이 우선입니다.</li>
          <li>당첨된 달은 당첨자 발표 후에 순차적으로 지급될 예정입니다.</li>
        </ul>}
        <button className="closeBtn" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  )
}

export default PopupNotice
