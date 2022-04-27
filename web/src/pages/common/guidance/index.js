import React from 'react'

import './index.scss'
import {useDispatch} from "react-redux";
import {setGlobalCtxVisible} from "redux/actions/globalCtx";

export default function Guidance() {
  const dispatch = useDispatch();
  return (
    <div onClick={(e) => e.stopPropagation()} id="guidanceWrap">
      <div className="guidanceWrap__header">
        <h1 className="guidanceWrap__header--title">환전 유의사항</h1>
        <span
          className="guidanceWrap__header--button"
          onClick={() => {
            dispatch(setGlobalCtxVisible(false));
          }}
        />
      </div>

      <div>
        <div className="guidance">
          <div className="guidance__content">
            <div className="guidance__list">
              <div className="guidance__list--title">◈ 환전은?</div>
              <div className="guidance__list--gray">
                방송 중 DJ가 타회원에게 받은 "별"선물을 현금으로 전환하는 것입니다.
                <br />
                방송에서 보유한 "별"은 1개당 60KRW으로 환전 됩니다.
                <br />
                또한, 보유한 "별"은 570별 이상부터 환전 신청이 가능합니다.
                <br />
                (원천징수세액 3.3%, 이체수수료 500원 제외)
                <br />★ 보유한 “별”은 최종 선물을 받은 일을 기준으로 12개월이 지나면 소멸됩니다.
              </div>
            </div>
            <div className="guidance__list">
              <div className="guidance__list--title">◈ 환전방법</div>
              <div className="guidance__list--gray">
                1. 환전신청을 위한 본인인증 절차를 완료합니다.
                <br />
                2. 본인인증 과정 중 미성년자(만 14세 이상~만 19세 미만)의 정보가 확인되는 경우 미성년자 법정대리인(보호자)에 의한
                추가 동의 절차를 완료합니다.
                <br />
                3. 본인인증 및 미성년자 법정대리인(보호자)동의가 완료된 회원은 환전 승인을 위한 추가 정보를 입력합니다.
                <br />
                4. 환전등록 시 입금 받을 통장사본을 첨부합니다.
                <br />
                5. 개인정보 수집 및 이용을 확인하신 후 동의를 위한 체크를 완료합니다.
                <br />
                6. [환전 신청하기] 버튼을 클릭 후 신청완료 됩니다.
                <br />※ 환전신청은 매일 1회 신청이 가능합니다.
                <br />※ 만약 법정대리인(보호자) 동의 완료정보와 다른 가족의 은행계좌로 입금 받을 경우 가족관계 여부 확인을 위한
                주민등록 등본 또는 가족관계증명서를 추가 첨부합니다.
              </div>
            </div>
            <div className="guidance__list">
              <div className="guidance__list--title">◈ 환전신청 후 입금일정</div>
              <div className="guidance__list--gray">
                <div className="guidance__list--flex">
                  <div className="guidance__list--spacing">-</div> <div>환전 신청 마감 : 매 일 23시59분 (주5회)</div>
                </div>
                <div className="guidance__list--flex">
                  <div className="guidance__list--spacing">-</div>
                  <div>서류확인 및 입금 : 다음날 오전 11시부터 순차적으로 처리됩니다.</div>
                </div>
                <div className="guidance__list--flex">
                  <div className="guidance__list--spacing">-</div>
                  <div>단, 토요일/일요일/공휴일인 경우 다음날 환전이 됩니다.</div>
                </div>
                ※ 운영자 검토 후 입력된 통장으로 현금이 입금되고, 입금 후에는 달라 알림을 통해 확인이 가능합니다.
                <br />
              </div>
            </div>
            <div className="guidance__list">
              <div className="guidance__list--title">◈ 유의사항</div>
              <div className="guidance__list--gray">
                1. 입금정보는 개인소득신고용으로 사용되는 필수 입력 정보입니다.
                <br />
                2. 회원가입자와 신청자가 일치하지 않을 경우 환전 승인이 거부됩니다.
                <br />
                3. 입력하신 입금정보가 증빙서류와 일치하지 않은 경우 환전 승인이 거부됩니다.
                <br />
                4. 환전 신청 시 입력한 정보는 재입력의 불편함이 없도록 입금정보가 암호화되어 저장됩니다.
                <br />
                <span className="guidance__list--red">
                  5. 부정적인 행위로 수집된 “달”, “별”에 대한 정황이 포착될 경우 환전 승인이 거부됩니다.
                </span>
                <br />
                <span className="guidance__list--red">6. 운영정책을 위반하여 정지 상태 회원은 환전 승인이 거부됩니다.</span>
                <br />
                7. 만 14세 미만의 사용자는 환전 신청 및 승인을 받을 수 없습니다.
                <br />
                8. 서비스 이용 회원 중 미성년자(만 14세 이상~만 19세 미만) 환전 신청 시 법정대리인의 동의 또는 가족관계 증명서를
                추가 요청할 수 있습니다.
                <br />
                9. 만 19세 이상 회원 중 본인인증 절차가 정상적으로 완료된 회원에 한해 승인처리가 완료됩니다.
                <br />
                10 대한민국 신분을 증명할 수 없는 외국인인 경우 해외 환전신청 페이지를 이용하여 신청 및 승인이 가능합니다..
              </div>
            </div>
            <div className="guidance__list">
              <div className="guidance__list--title guidance__list--red">◈ 종합소득세 안내</div>
              <div className="guidance__list--gray">
                1. 연간 환전 받은 총 금액에 대해서 <span className="guidance__list--bold guidance__list--red">매년 5월</span> 종합
                소득세 신고를 해야 합니다.
                <br />
                2. 연간 환전 받은 총 금액이 <span className="guidance__list--bold guidance__list--red">1,500만 원 이상</span>의
                경우, 건강보험 피부양자 자격이 박탈될 수 있습니다.
              </div>
            </div>
            <div className="guidance__list">
              <div className="guidance__list--title">◈ 환전 불가 서류</div>
              <div className="guidance__list--gray">
                - (X) 정보 확인이 불분명한 서류
                <br />- (X) 학생증
                <br />- (X) 건강보험증
                <br />- (X) 기타 민간 자격증
                <br />- (X) 수기 작성한 서류
                <br />- (X) 기타 기준에 부합하지 않은 모든 서류
              </div>
            </div>
            <div className="guidance__list">
              <div>
                ※ 해당 환전 정책은 서비스 진행 중이더라도 변경될 수 있고, 정책 변경 시 회원에 대한 고지 후 변경정책에 따른
                서비스를 진행할 수 있습니다.
              </div>
            </div>
            <div className="guidance__list">
              <div>※ 아이템 선물을 원하는 회원께서는 “별”을 "달"로 교환하여 이용이 가능합니다.</div>
            </div>
            <div className="guidance__list">
              <div>
                - 별을 달로 교환하는 방법 : “마이페이지&gt;내지갑&gt;별”에서 [달교환] 버튼을 클릭하시면 즉시 처리되어 아이템선물이
                가능합니다. (수수료 없음)
              </div>
            </div>
          </div>
          <div className="guidance__list">
            <div className="guidance__list--title">■ 부칙</div>
            <div className="guidance__list--gray">
              4. 본 환전정책 Ver4.0은 2020년 9월 21일부터 적용됩니다.
              <br />
              3. 본 환전정책 Ver3.0은 2020년 8월 20일부터 적용됩니다.
              <br />
              2. 본 환전정책 Ver2.0은 2020년 7월 6일부터 적용됩니다.
              <br />
              1. 본 환전정책 Ver1.0은 2020년 6월 1일부터 적용됩니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
