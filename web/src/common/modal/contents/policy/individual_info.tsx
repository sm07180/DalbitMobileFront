// tab navigation
import { DalbitScroll } from "common/ui/dalbit_scroll";
import React from "react";
import { useHistory } from "react-router-dom";
// api

export default (props) => {
  const history = useHistory();

  return (
    <div className="fanlist-modal" onClick={(e) => e.stopPropagation()}>
      <div className="termsWrap privacy">
        <h2>개인정보 취급방침<button className="closeBtn" onClick={() => history.goBack()}>&times;</button></h2>
        <div className="termsScroll">
          <p style={{marginTop:"12px"}}>
            (주)여보야(이하 “회사”라 함)는 개인 정보 보호법, 정보통신망 이용
            촉진 및 정보보호 등에 관한 법률 등 정보통신서비스 제공자가
            준수하여야 할 관련 법령상의 개인 정보보호 규정을 준수하며, 관련
            법령에 의거한 개인 정보취급방침을 정하여 회원 권익 보호에 최선을
            다하고 있습니다. 회사의 개인 정보취급방침은 다음과 같은 내용을 담고
            있습니다.
          </p>
          <ol className="depth1 no-space">
            <li>수집하는 회원의 개인 정보</li>
            <li>개인 정보의 수집 및 이용목적</li>
            <li>개인 정보를 수집하는 방법 </li>
            <li>개인 정보의 취급 위탁</li>
            <li>개인 정보의 보유 및 이용 기간</li>
            <li>개인 정보 파기절차 및 방법</li>
            <li>회원 개인 정보 정확성을 위한 내용</li>
            <li>
              회원의 개인 정보 안전을 위해 취해질 수 있는 서비스 일시 중단 조치
            </li>
            <li>제3 자와의 정보 공유 및 제공 관련 내용</li>
            <li>회원의 개인 정보 비밀유지를 위한 내용</li>
            <li>개인 정보 취급자의 제한에 관한 내용</li>
            <li>회원 및 법정대리인의 권리와 그 행사방법</li>
            <li>개인 정보 자동 수집 장치의 설치/운영 및 거부에 관한 사항</li>
            <li>개인 정보관리 책임자 및 담당자의 연락처</li>
          </ol>

          <ol className="depth1">
            <li>
              수집하고 있는 회원의 개인 정보
              <ol className="depth2">
                <li>
                  수집 항목은 다음과 같습니다.
                  <br />
                  아이디(연락처 계정), 비밀번호, 닉네임, 프로필이미지(Google,
                  Facebook, Naver, Kakao), 생년월일, 성별, 지역정보, 주소,
                  고유식별정보, 이메일 정보, 서비스 접속정보 등의 정보주체가 그
                  수집에 동의하는 경우 수집됩니다. 또한, 아래의 항목들에
                  대해서도 안정된 서비스 제공을 위해 합법적인 절차와 회원의
                  동의를 거쳐 추가로 수집할 수 있습니다.
                  <ol className="depth3 no-space">
                    <li>
                      1) IP Address, 쿠키, 방문 일시, 서비스 이용 기록, 불량
                      이용 기록
                    </li>
                    <li>
                      2) 성인인증 시: 휴대전화번호, 통신사, 인증승인번호
                      내/외국인 여부 CI, DI 등의 정보
                    </li>
                    <li>
                      3) 20세 미만 회원의 법정대리인(보호자) 동의 시:
                      법정대리인(보호자)의 이름, 성별, 생년월일, 휴대전화번호,
                      통신사, 인증승인번호, 내/외국인 여부 CI, DI 등의 정보
                    </li>
                    <li>4) 사용 이동통신사, 계좌번호 등</li>
                    <li>5) 신용카드 결제 시: 카드사명, 카드번호 등</li>
                    <li>
                      6) 휴대전화 결제 시: 휴대전화번호, 통신사, 결제승인번호 등
                    </li>
                    <li>7) 계좌이체로 결제 시: 은행명, 계좌번호 등</li>
                    <li>
                      8) 환전신청 시: 신분을 증명할 수 있는 서류, 20세 미만
                      회원의 경우 가족관계를 증명할 수 있는 서류
                    </li>
                  </ol>
                </li>
                <li>
                  회사는 다음과 같은 방법으로 개인 정보를 수집하고 있습니다.
                  <ol className="no-space">
                    <li>
                      1) 홈페이지, 서면 양식, 팩스, 전화, 상담 게시판, 이메일,
                      이벤트 응모
                    </li>
                    <li>
                      2) 협력회사로부터 공동 제휴 및 협력을 통한 정보 수집{" "}
                    </li>
                    <li>3) 생성 정보 수집 툴을 통한 정보 수집</li>
                  </ol>
                </li>
                <li>
                  회사는 만 14세 미만 연령 아동의 서비스 이용을 허락하지
                  아니하며, 서비스 이용이 허용되지 않는 연령의 아동의 개인정보를
                  수집하지 않습니다.
                  <br />
                  만일 서비스 이용이 허용되지 않는 연령의 아동으로부터
                  개인정보를 제공받게 되는 경우에는 그 확인 즉시 삭제할
                  것입니다.
                  <br />
                  회사가 만 14세 미만의 아동으로부터 정보를 수집하였다고
                  생각되는 경우 help@dalbitlive.com으로 연락 주시기 바랍니다.
                </li>
              </ol>
            </li>
            <li>
              개인 정보의 수집 및 이용 목적
              <ol className="depth2">
                <li>
                  서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금 정산에
                  활용합니다.
                  <ol className="depth3">
                    <li>- 컨텐츠 제공, 구매 및 요금 결제, 요금추심</li>
                  </ol>
                </li>
                <li>
                  회원관리를 위해 일부 회원 정보를 활용합니다.
                  <ol className="depth3 no-space">
                    <li>
                      - 회원제 서비스 이용 및 인증 서비스에 따른 본인확인,
                      개인식별, 불량 회원 (달라 이용약관 제10조 회원의
                      의무 각항을 위반하거나 성실히 수행하지 않은 회원)의 부정
                      이용 방지와 비인가 사용 방지, 가입 의사 확인, 가입 및 가입
                      횟수 제한, 분쟁 조정을 위한 기록 보존, 불만 처리 등
                      민원처리, 고지사항 전달
                    </li>
                  </ol>
                </li>
                <li>
                  신규 서비스 개발 및 마케팅, 광고에 활용합니다.
                  <ol className="depth3 no-space">
                    <li>
                      - 신규 서비스 개발 및 인증 서비스, 맞춤 서비스 제공,
                      통계학적 특성에 따른 서비스 제공 및 광고 게재, 이벤트 및
                      광고성 정보 제공 및 참여 기회 제공, 접속 빈도 파악, 회원의
                      서비스 이용에 대한 통계, 서비스의 유효성 확인
                    </li>
                  </ol>
                </li>
              </ol>
            </li>
            <li>
              개인 정보를 수집하는 방법
              <br />
              <ol className="depth2">
                <li>
                  모든 회원이 회사로부터 서비스를 제공받기 위해서는 회원의 개인
                  정보가 필요하며 개인 정보는 회원가입 시 회원가입양식에
                  가입신청자의 동의를 통해 수집됩니다.
                </li>
                <li>
                  개인 정보 수집정보는 개인 정보 취급방침의 동의를 통해
                  수집됩니다.
                </li>
                <li>
                  20세 미만 회원 결제 및 환전 신청을 위한 법정대리인(보호자) 정보의
                  수집정보는 법정대리인(보호자)의 개인 정보 취급방침의 동의를
                  통해 수집됩니다.
                </li>
              </ol>
              <span className="lineBox">
                <b>[본인인증 안내]</b>
                <p>
                  1) 달라는 방송 개설, 클립 등록, 환전 신청 시 반드시
                  본인인증을 완료해야 합니다.
                </p>
                <p>2) 달라는 단계별로 필요한 정보를 수집합니다.</p>

                <p>
                  3) 20세 미만 회원은 환전 신청 시 반드시 보호자(부모님) 동의를
                  위한 절차를 완료해야 합니다.
                  <br />※ 보호자(부모님) 동의는 세금신고를 위한 동의가
                  필요합니다.
                </p>

                <p>
                  4) 달라에서 이용된 본인인증 정보를 포함한 개인 정보는
                  1년 후 탈퇴 또는 휴면 전환이 됩니다.
                </p>
              </span>
            </li>

            <li>
              개인 정보의 취급위탁
              <ol className="depth2">
                <li>
                  개인 정보의 취급 위탁 회사는 동의 없이 귀하의 개인 정보를
                  외부에 위탁을 처리하지 않습니다.
                </li>
                <li>
                  다만, 회사는 이용자에게 보다 나은 서비스를 제공하기 위해
                  반드시 필요한 경우 개인 정보 처리 업무 일부를 외부에 위탁할
                  수도 있습니다.
                </li>
                <li>
                  개인 정보의 처리를 위탁하는 경우에는 위탁계약 등을 통하여
                  서비스 제공자의 개인 정보보호 관련 지시 엄수, 개인 정보에 관한
                  비밀유지, 제3자 제공의 금지 및 사고 시의 책임 부담 등을 명확히
                  규정하고 당해 계약 내용을 서면 또는 전자적으로 반영하여
                  보관합니다.
                </li>
                <li>
                  회사는 수탁자에게 개인 정보의 안전한 처리, 개인 정보 접근 또는
                  접속 기록, 목적 외 이용 금지, 위탁업무의 재위탁 제한, 암호화
                  등 이용자의 개인 정보를 안전하게 처리하기 위한 기술적 관리적
                  보호 조치를 수탁사에게 요구하고 있으며, 수탁 업체가 개인
                  정보를 안전하게 관리하고 있는지 정기적으로 관리 감독을 합니다.
                </li>
                <li>
                  개인 정보의 처리를 위탁하는 경우에는 미리 그 사실을 귀하에게
                  고지합니다.
                </li>
                <li>
                  회사가 개인 정보를 처리 위탁하는 업체 및 업무 내용은 아래와
                  같습니다.
                </li>
              </ol>
              <ol className="depth3 no-space">
                <li>
                  1) 본인인증 및 법정대리인(부모) 동의
                  <p>- KMC 한국모바일 인증(주)</p>
                </li>
                <li>
                  2) 결제 대행 및 처리
                  <p>
                    - KG모빌리언스: 휴대폰, 신용카드, 문화상품권,
                    게임문화상품권, 도서문화상품권, 해피머니 상품권
                  </p>
                  <p>- 쿠콘(주): 가상 계좌</p>
                  <p>- 페이레터(주): 티머니, 캐시비, 페이코, 카카오페이</p>
                </li>
              </ol>
            </li>
            <li>
              개인 정보의 보유 및 이용 기간
              <br />
              <p>
                개인 정보의 보유 및 이용 기간 회원의 개인 정보는 회원가입 후
                서비스 이용 기간이 종료되거나 회원이 계약 해지, 탈퇴 등의 사유로
                이메일이나 서면을 통해 개인 정보 삭제를 요구하는 경우에는
                제3자의 열람과 이용이 불가능한 상태로 처리되며, ‘전자상거래
                등에서의 소비자보호에 관한 법률’ 제6조(거래 기록의 보존 등)에
                의하여 아래의 명시 기간 동안 보관 관리합니다.
              </p>
              <ol className="depth2">
                <li>
                  계약, 청약철회, 회원서비스 제공 등의 거래에 관한 기록: 5년
                </li>
                <li>대금 결제 및 재화 등의 공급에 관한 기록: 5년</li>
                <li>소비자 불만 또는 분쟁처리에 관한 기록: 3년</li>
              </ol>
            </li>
            <li>
              휴면 회원 전환 정책 및 개인 정보 파기절차와 방법
              <br />
              <p>
                회사는 개인 정보 보유기간의 경과 혹은 개인 정보의 수집 및
                이용목적의 달성 등 개인 정보가 불필요하게 되었을 때에는 해당
                개인 정보를 지체 없이 파기합니다. 회사의 개인 정보 파기절차 및
                방법은 다음과 같습니다.
              </p>
              <ol className="depth2">
                <li>
                  파휴면 회원 전환
                  <ol className="depth3 no-space">
                    <li>
                      1) 회사는 1년 동안 서비스 이용 기록이 없는 회원에 대해서
                      보유 달과 별이 없는 회원은 탈퇴 처리, 보유 달과 별이 있는
                      회원은 휴면 전환 처리를 진행합니다.
                    </li>
                    <li>
                      2) 서비스 미 이용 회원의 탈퇴 및 휴면 전환은 적용 시점을
                      기준으로 30일 이전에 이용자에게 휴면 전환에 대한 안내를
                      진행합니다.
                    </li>
                    <li>
                      3) 휴면 회원으로 전환된 회원의 경우 총 5년이 지난 후에도
                      이용 기록이 확인되지 않으면 탈퇴 처리되어 개인 정보를
                      삭제하고, 달과 별은 소멸됩니다.
                    </li>
                    <li>
                      4) 휴면 회원으로 전환된 회원의 경우 탈퇴 처리 이전 서비스
                      이용을 요청한 경우 서비스 이용을 재개할 수 있고, 개인 정보
                      및 달과 별을 복구할 수 있습니다.
                    </li>
                  </ol>
                </li>
                <li>
                  파기절차
                  <ol className="depth3 no-space">
                    <li>
                      1) 회원이 회원가입 등을 위해 입력한 정보는 목적이 달성된
                      후 별도의 DB로 옮겨져(종이의 경우 별도의 잠금장치가 있는
                      서류 보관함) 내부 방침 및 기타 관련 법령에 의한 정보보호
                      사유에 따라(보유 및 이용 기간 참조) 일정 기간 저장된 후
                      파기됩니다.
                    </li>
                    <li>
                      2) 개인 정보는 법률에 의한 경우가 아닌 이상 보유되는
                      이외의 다른 목적으로 이용되지 않습니다.
                    </li>
                  </ol>
                </li>

                <li>
                  파기방법
                  <ol className="depth3 no-space">
                    <li>
                      1) 종이에 출력된 개인 정보는 분쇄기로 분쇄하거나 소각을
                      통하여 파기합니다.
                    </li>
                    <li>
                      2) 전자적 파일 형태로 저장된 개인 정보는 기록을 재생할 수
                      없는 기술적 방법을 사용하여 삭제합니다.
                    </li>
                  </ol>
                </li>
              </ol>
            </li>
            <li>
              회원 개인 정보 정확성을 위한 내용 <br />
              <p className="block">
                회원 개인 정보 정확성을 위한 내용 회사는 회원이 개인 정보를
                최신의 상태로 유지하도록 정기적으로 갱신을 유도합니다. 일부
                정보에 대해서는 정기적으로 확인 작업이 이루어집니다. 회원의
                부정확한 개인 정보로 인하여 사용상의 불편을 줄 수 있으므로 개인
                정보 관리자가 판단하기에 확연히 부정확한 개인 정보를 기입한
                경우에는 정확하지 않은 개인 정보를 파기할 수 있습니다.
              </p>
            </li>
            <li>
              회원의 개인 정보 안전을 위해 취해질 수 있는 서비스 일시 중단 조치{" "}
              <br />
              <p className="block">
                회원의 개인 정보 안전을 위해 취해질 수 있는 서비스 일시 중단
                조치 회사는 회원의 안전한 서비스 이용을 위해서 최선을 다하고
                있습니다. 그러나 원하지 않는 방법에 의하여 회사의 서비스가
                훼손을 당하는 경우에는 회원들의 개인 정보 보호를 위하여, 문제가
                완전하게 해결될 때까지 회원의 개인 정보를 이용한 서비스를 일시
                중단할 수도 있습니다.
              </p>
            </li>

            <li>
              제3 자와의 정보 공유 및 제공 관련 내용 <br />
              <p className="block">
                제3 자와의 정보 공유 및 제공 관련 회사는 정보통신망 이용 촉진 및
                정보보호 등에 관한 법률 제24조의 2(개인 정보의 제공 동의 등)에
                따라 회원의 동의가 있거나 법률에 특별한 규정이 있는 경우를
                제외하고 개인 정보를 고지 또는 명시한 범위를 초과하여 이용하거나
                제3자에게 제공하지 않습니다. 또한 개인 정보보호법
                제59조(금지행위)에 따라 회사의 서비스 제공을 위하여 개인 정보를
                취급하거나 취급하였던 자는 다음 각호의 행위를 하지 않습니다.
              </p>
              <ol className="depth2">
                <li>
                  거짓이나 그 밖의 부정한 수단이나 방법으로 개인 정보를
                  취득하거나 처리에 관한 동의를 받는 행위{" "}
                </li>
                <li>
                  업무상 알게 된 개인 정보를 누설하거나 권한 없이 다른 사람이
                  이용하도록 제공하는 행위{" "}
                </li>
                <li>
                  정당한 권한 없이 또는 허용된 권한을 초과하여 다른 사람의 개인
                  정보를 훼손, 멸실, 변경, 위조 또는 유출하는 행위{" "}
                </li>
              </ol>
            </li>

            <li>
              회원의 개인 정보 비밀유지를 위한 내용
              <ol className="depth2">
                <li>
                  회원의 개인 정보 비밀유지를 위해 회사는 회원의 개인 정보의
                  비밀을 유지하기 위하여 제3자에게는 회원의 동의 없이 개인
                  정보를 유출하지 않습니다.
                </li>
                <li>
                  회원이 동의를 하였다 하더라도, 제3자를 통하여 재유출이 될
                  확률이 있는 자에게는 회원의 개인 정보를 유출하지 않습니다.
                </li>
                <li>
                  회사는 각종 정부기관의 회원 개인 정보의 일방적 제공 요구에
                  대하여는 회원의 개인 정보를 제공하지 않습니다.
                </li>
                <li>
                  법령에 따른 정부기관이 법령에 따른 공식 절차를 완벽하게 거쳐
                  자료를 요구하는 경우에 한하여 회원의 개인 정보를 제공합니다.
                </li>
                <li>
                  회사는 회원의 개인 정보를 회사가 정한 기본 서비스 및 기타의
                  서비스 활동 이외에는 이용하지 않습니다.
                </li>
                <li>
                  위의 활동에 따라 회원의 정보가 필요할 시에는 별도의 양식을
                  통한 수집 및 동의 절차를 거쳐 회원의 개인 정보를 이용합니다.
                </li>
              </ol>
            </li>

            <li>
              개인 정보 취급자의 제한에 관한 내용 <br />
              <p className="block">
                개인 정보 취급자의 제한에 관한 내용 회사는 제한된 소수의
                직원에게만 회원의 개인 정보를 취급할 권한을 부여하고, 취급
                권한을 가진 직원들에게는 개인 아이디(ID)와 비밀번호(Password)를
                부여하며, 이를 수시로 변경하여 회원의 개인 정보를 보호하는 데
                최선을 다합니다.
              </p>
            </li>

            <li>
              회원 및 법정대리인의 권리와 그 행사방법
              <ol className="depth2">
                <li>
                  회원 및 법정 대리인은 언제든지 등록되어 있는 자신의 개인
                  정보를 조회하거나 수정할 수 있으며 가입해지를 요청할 수
                  있습니다.
                </li>
                <li>
                  회원의 개인 정보 조회, 수정을 위해서는 '개인 정보 변경’(또는
                  '회원정보 수정' 등)을, 가입 해지(동의 철회)를 위해서는
                  ‘탈퇴하기’를 통하여 계약 해지 및 탈퇴가 가능합니다.
                </li>
                <li>
                  혹은 고객센터나 개인 정보 책임자에게 서면, 전화 또는 이메일로
                  연락하시면 지체 없이 조치하겠습니다.
                </li>
                <li>
                  회원이 개인 정보의 오류에 대한 정정을 요청하신 경우에는 정정을
                  완료하기 전까지 해당 개인 정보를 이용 또는 제공하지 않습니다.
                  또한 잘못된 개인 정보를 제3자에게 이미 제공한 경우에는 정정
                  처리결과를 제3자에게 지체 없이 통지하여 정정이 이루어지도록
                  합니다.
                </li>
                <li>
                  회사는 회원 혹은 법정 대리인의 요청에 의해 해지 또는 삭제된
                  개인 정보를 개인 정보취급방침 ‘5. 개인 정보의 보유 및 이용
                  기간’에 명시된 바에 따라 처리하고, 그 외의 용도로 열람 또는
                  이용할 수 없도록 처리하고 있습니다.
                </li>
                <li>
                  단, 탈퇴 후 재가입 시 “회사”는 코드화 된 회원정보를 보유할 수
                  있고, 재가입 시 동일 코드로 확인된 가입 회원은 이벤트성으로
                  지급되는 달 또는 별을 받을 수 없습니다.
                </li>
              </ol>
            </li>

            <li>
              개인 정보 자동 수집 장치의 설치/운영 및 거부에 관한 사항
              <br />
              <p className="block">
                개인 정보 자동 수집 장치의 설치/운영 및 거부에 관한 사항 회사는
                회원들에게 특화된 맞춤 서비스를 제공하기 위해서 회원들의 정보를
                저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다. 쿠키는
                웹사이트를 운영하는데 이용되는 서버(HTTP)가 회원의 컴퓨터
                브라우저에게 보내는 소량의 정보이며 회원들의 PC 컴퓨터 내의
                하드디스크에 저장되기도 합니다.
              </p>
              <ol className="depth2">
                <li>
                  쿠키의 사용 목적 회원들의 로그인 및 최근 접속기록을 토대로
                  달라 회원 상호 간 커뮤니케이션 시의 편리한 기능을
                  제공하기 위하여 활용됩니다.
                </li>
                <li>
                  쿠키의 설치/운영 및 거부
                  <ol className="depth3 no-space">
                    <li>
                      1) 회원은 쿠키 설치에 대한 선택권을 가지고 있습니다.
                      따라서, 회원은 웹브라우저에서 옵션을 설정함으로써 모든
                      쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나,
                      아니면 모든 쿠키의 저장을 거부할 수도 있습니다.
                    </li>
                    <li>
                      2) 쿠키 설정을 거부하는 방법으로는 회원이 사용하는 웹
                      브라우저의 옵션을 선택함으로써 모든 쿠키를 허용하거나
                      쿠키를 저장할 때마다 확인을 거치거나, 모든 쿠키의 저장을
                      거부할 수 있습니다.
                      <p>
                        - 설정 방법 예(인터넷 익스플로어의 경우): 웹 브라우저
                        상단의 도구 &gt; 인터넷 옵션 &gt; 개인 정보
                      </p>
                      <p>
                        - 다만, 쿠키의 저장을 거부할 경우에는 이용에 어려움이
                        있을 수 있습니다.{" "}
                      </p>
                    </li>
                  </ol>
                </li>
              </ol>
            </li>

            <li>
              개인 정보관리 책임자 및 담당자의 연락처 <br />
              <p className="block">
                귀하께서는 회사의 서비스를 이용하시며 발생하는 모든 개인
                정보보호 관련 민원을 개인 정보보호 책임자 혹은 담당 부서로
                신고하실 수 있습니다.
                <br />
                회사는 이용자들의 신고사항에 대해 신속하게 충분한 답변을 드릴
                것입니다.
              </p>
            </li>
          </ol>

          <div className="depth-info">
            <b>※ 개인 정보 보호 책임자 </b>

            <li>이름 : 이정호</li>
            <li>소속 : 미디어사업부 본부장</li>
            <li>연락처: 1522-0251</li>
            <li>E-mail : help@dalbitlive.com</li>
            <p>
              ※ 기타 개인 정보 침해에 대한 신고나 상담이 필요하신 경우에는 아래
              기관에 문의하시기 바랍니다.
            </p>

            <ol className="depth2-line">
              <li>
                개인 정보 분쟁 조정위원회 (www.kopico.go.kr, 전화 1833-6972)
              </li>
              <li>
                개인 정보 침해신고센터 (privacy.kisa.or.kr / 국번 없이 118)
              </li>
              <li>대검찰청 사이버범죄수사단 (www.spo.go.kr / 02-3480-3571)</li>
              <li>
                경찰청 사이버안전국 (cyberbureau.police.go.kr / 국번 없이 182)
              </li>
              <li>
                청소년 정보이용 안전망 그린 i-Net (www.greeninet.or.kr /
                02-523-3566)
              </li>
            </ol>

            <p>
              본 개인 정보처리 방침은 법령 정책 또는 보안 기술의 변경에 따라
              내용의 추가, 삭제 및 수정이 있을 시에는 변경이 되는 개인 정보 처리
              방침을 시행하기 최소 7일 전에 홈페이지의 '공지사항'을 통해 고지할
              것입니다.
            </p>

            <b>부칙</b>

            <ol className="depth2-number">
              <li>
                5. 본 개인 정보취급방침은 2021년 10월 25일부터 적용됩니다.
              </li>
              <li>
                4. 본 개인 정보취급방침은 2021년 08월 03일부터 적용됩니다.
              </li>
              <li>
                3. 본 개인 정보취급방침은 2020년 10월 09일부터 적용됩니다.
              </li>
              <li>2. 본 개인 정보취급방침은 2020년 7월 02일부터 적용됩니다.</li>
              <li>1. 본 개인 정보취급방침은 2020년 5월 25일부터 적용됩니다.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
