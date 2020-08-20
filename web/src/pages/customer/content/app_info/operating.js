import React from 'react'

export default function Operating() {
  return (
    <div className="termsWrap operating">
      <h2>운영정책</h2>

      <h3>운영정책의 목적</h3>
      <p>
        본 운영 정책은 ㈜인포렉스(이하 회사라 함)가 제공하는 실시간 라이브 방송 서비스에 적용되며, 이용자와 회사가 준수하여야 할
        기본적인 사항을 규정하여 원활한 서비스를 제공하는 것을 목적으로 합니다.
      </p>

      <h3>운영정책의 적용</h3>
      <p>
        본 운영정책은 회사가 제공하는 각 서비스 별 별도 정책이나 특별한 규정이 있는 경우를 제외하고는 본 정책이 우선 적용됩니다.
        또한 운영정책에 언급되지 않은 사항은 「서비스 이용 약관」, 「개인정보처리방침 및 청소년 보호 정책」 및 대한민국 법률에
        의거하여 처리됩니다.
        <br />
        이용자는 본 운영정책을 준수해야 하며, 위반 시에는 각 규정에 의거하여 계정에 불이익이 발생할 수 있습니다.
      </p>

      <h3>콘텐츠 규제</h3>
      <p>
        달빛라이브에서는 쾌적한 서비스 운영을 위해 서비스 운영정책을 기준으로 콘텐츠를 규제하고 있습니다. Live 방송의 이미지,
        문자, 음성과 계정 관련한 정보 닉네임, 고유아이디 등 모두 포함됩니다.
      </p>

      <ol className="depth1">
        <li>
          <span>1.</span>항목 : 음란물/폭력/위법행위/청소년 유해/저작권 침해/미풍양속 위배/명예훼손/기타/자체 기준위반
          <ol className="depth2">
            <li>
              <span>가)</span>음란물
              <ol className="depth3">
                <li>
                  <span>①</span> 성행위 및 유사 성행위를 묘사하는 이미지, 기타 행위(신음소리 등)
                </li>
                <li>
                  <span>②</span>성적인 사진, 신체(유두, 성기, 음모 등) 이미지, 도구(예: 자위도구)를 화면에 노출
                </li>
                <li>
                  <span>③</span>음란 방송을 진행하는 조건으로 금품, 유료 아이템, 추천 등을 요구하는 내용
                </li>
                <li>
                  <span>④</span>방송에서 음란성 대화(성적 이야기, 성적 질문, 성적 만남 유도, 신체관련 질문 등)를 하는 내용
                </li>
                <li>
                  <span>⑤</span>조건 만남 또는 성매매 등의 조건(금액/장소)을 홍보하는 내용
                </li>
                <li>
                  <span>⑥</span>위 항목 외 음란 행위가 포함된 내용
                </li>
              </ol>
            </li>
            <li>
              <span>나)</span>부계정
              <ol className="depth3">
                <li>
                  <span>①</span>방송 및 랭킹을 조작하는 내용
                </li>
                <li>
                  <span>②</span>다수의 계정을 통해 특정 계정으로 달/별을 수집하는 내용
                </li>
              </ol>
            </li>
            <li>
              <span>다)</span>위법사항
              <ol className="depth3">
                <li>
                  <span>①</span>불법 사설 온라인 스포츠 배팅, 도박 영업, 게임 머니 환전을 홍보하는 내용
                </li>
                <li>
                  <span>②</span>음란성 사업장 및 퇴폐업소 공유 및 홍보하는 내용
                </li>
                <li>
                  <span>③</span>불법 약물(마약)을 하는 행위나 마약 도구를 노출하는 내용이 포함된 방송
                </li>
                <li>
                  <span>④</span>운전 중 방송 (도로교통법 위반)
                </li>
                <li>
                  <span>⑤</span>해킹, 주민등록생성기 등 불법프로그램 사용/유도/정보 공유
                </li>
                <li>
                  <span>⑥</span>위 항목 외 법령에 위반되는 행위를 저지르거나 조장하여 법질서를 해할 우려가 있는 내용
                </li>
                <li>
                  <span>⑦</span>위 항목 외 불법 도박 및 불법 약물(마약)의 복용을 조장하는 경우
                </li>
              </ol>
            </li>
            <li>
              <span>라)</span>청소년 유해
              <ol className="depth3">
                <li>
                  <span>①</span>청소년의 건전한 정서에 저해가 된다고 판단되는 방송 (술, 담배, 전자담배 외 선정적인 요소)
                </li>
                <li>
                  <span>②</span>청소년 유해 약물이나 물건의 정보를 상세하게 전달하여 사용을 조장하거나 연결하는 내용
                </li>
                <li>
                  <span>③</span>미성년자에게 불건전한 교제를 조장하거나 성매매, 성적 노출 유도 및 성적 대상화
                </li>
                <li>
                  <span>④</span>청소년 비행 미화, 유도, 동조 (가출, 폭력서클, 흡연, 음주 등)
                </li>
                <li>
                  <span>⑤</span>청소년 접근 제한 서비스 (유해곡, 청소년 출입금지업소, 유해사이트 등) 이용 방송
                </li>
                <li>
                  <span>⑥</span>위 항목 외 청소년 유해 정보가 포함된 경우
                </li>
              </ol>
            </li>
            <li>
              <span>마)</span>저작권 침해
              <ol className="depth3">
                <li>
                  <span>①</span>저작권자로부터 권리침해 신고가 접수된 저작물 침해 행위 (저작물 편집 또는 훼손 등)
                </li>
                <li>
                  <span>②</span>판권이 없는 스포츠, 영화, 애니메이션, TV채널 등의 저작권 침해 행위
                </li>
                <li>
                  <span>③</span>저작권 보고 기간이 만료되지 않은 저작물 침해 행위
                </li>
                <li>
                  <span>④</span>저작권법의 보호를 받는 산업재산권 무단 사용
                </li>
                <li>
                  <span>⑤</span>위 항목 외 저작권 위반 방송으로 판단되는 경우
                </li>
              </ol>
            </li>
            <li>
              <span>바)</span>미풍양속 위배
              <ol className="depth3">
                <li>
                  <span>①</span>지나치게 과도한 욕설과 부적절한 언어, 혐오, 잔혹, 폭력성 내용이 포함된 부적절한 방송
                </li>
                <li>
                  <span>②</span>동물 학대 또는 생명을 앗아가는 내용이 포함된 부적절한 방송
                </li>
                <li>
                  <span>③</span>고의적이고 지속적으로 선정적 요소가 포함된 방송
                </li>
                <li>
                  <span>④</span>심각한 기물 파손 혹은 훼손 방송
                </li>
                <li>
                  <span>⑤</span>자해/자살 암시 및 타인에 대한 상해 흉기를 사용하여 신체를 손상하는 잔혹한 방송
                </li>
                <li>
                  <span>⑥</span>위 항목 외 미풍양속 위배 행위가 포함된 경우
                </li>
              </ol>
            </li>
            <li>
              <span>사)</span>명예훼손
              <ol className="depth3">
                <li>
                  <span>①</span>타인비하
                  <ol className="depth4">
                    <li>
                      <span>-</span>공공연히 타인을 모욕하거나 타인의 명예를 훼손하는 경우
                    </li>
                    <li>
                      <span>-</span>특정인 또는 특정 집단 부적절한 욕설, 비난, 비하, 성적 발언
                    </li>
                    <li>
                      <span>-</span>과도한 욕설과 불건전한 언어, 혐오, 잔혹, 폭력적 발언
                    </li>
                    <li>
                      <span>-</span>방송 또는 게시물에 타인의 사생활(개인정보포함)이나 검증/확인되지 않은 내용, 거짓의 내용을
                      공개적으로 밝히거나 유포하는 행위(이름, 신분, 사회적 지위, 인격 등)
                    </li>
                    <li>
                      <span>-</span>위 항목 외 명예훼손 내용이 포함되는 경우
                    </li>
                  </ol>
                </li>
                <li>
                  <span>②</span>장애인 비하
                  <ol className="depth4">
                    <li>
                      <span>-</span>신체적, 정신적 장애를 가지고 있는 장애인 또는 장애인 관련자에게 모욕감을 주거나 비하, 멸시,
                      모욕, 학대, 착취, 유기, 따돌림, 감금, 폭행, 욕설 등 이와 유사한 모든 행위를 포함하는 방송
                    </li>
                    <li>
                      <span>-</span>장애인의 특정 신체나 행위를 비판 또는 비하하는 발언이나 성적 수치심을 자극하는 언어 표현,
                      희롱하는 발언을 하는 내용
                    </li>
                    <li>
                      <span>-</span>불특정 다수인을 가리켜 장애인이라고 지칭하는 발언의 방송을 하는 내용
                    </li>
                  </ol>
                </li>
                <li>
                  <span>③</span>지역/종교/인종차별 및 정치적 선동
                  <ol className="depth4">
                    <li>
                      <span>-</span>합리적 이유 없이 특정 지역, 종교, 인종 등을 차별하거나 이에 대한 편견을 조장하는 내용
                    </li>
                    <li>
                      <span>-</span>인종, 지역, 종교 파별 용어를 직접적으로 언급하거나 비하하는 내용
                    </li>
                    <li>
                      <span>-</span>성별의 차이를 두어 남녀 간의 분쟁을 조장하는 내용
                    </li>
                    <li>
                      <span>-</span>집단적 행위를 선동하는 발언
                    </li>
                  </ol>
                </li>
              </ol>
            </li>
            <li>
              <span>아)</span>자체 기준 위반
              <ol className="depth3">
                <li>
                  <span>①</span>고의적으로 서비스 운영을 방해하거나, 무단으로 플랫폼 또는 관리자를 사칭하는 등 서비스 제공에
                  악영향을 끼치는 내용
                </li>
                <li>
                  <span>②</span>회사와 협의되지 않은 라이브 스트리밍 서비스 홍보 및 사이트 가입 및 이용 등을 유도하는 내용
                  (국내/외 플랫폼 포함)
                </li>
                <li>
                  <span>③</span>회사와 협의되지 않은 영업 활동 기업 및 단체, 개인과 그에 소속되어 당사 플랫폼에서 방송 송출을 하는
                  경우
                </li>
                <li>
                  <span>④</span>당사 플랫폼 내에서 타 플랫폼의 영입을 위한 고의적인 방해
                </li>
                <li>
                  <span>⑤</span>위 항목 외 자체 기준 위반으로 판단되는 경우
                </li>
              </ol>
            </li>
          </ol>
        </li>
      </ol>
      <p className="desc">
        *회원이 기업체와 계약을 맺지 않고, 방송 내에서 당 서비스를 홍보하는 행위는 회원의 자발적 행위로 판단하여 당 회사는 일체의
        책임을 지지 않습니다.
        <br />
        또한 관련 분쟁에 대하여 일체의 관여도 하지 않습니다. 다만, 회사는 회원에게 홍보 횟수나 방송 내 일정 시간 등에 대한 제한을
        할 수 있습니다.
      </p>
      <ol className="depth1">
        <li>
          <span>2.</span>조치 : 아래와 같은 방법으로 관리/규제
          <ol className="depth2">
            <li>
              <span>가)</span>조치단계
              <ol className="depth3">
                <li>
                  <span>①</span>접수 : 이용자 신고 접수 및 실시간 모니터링
                </li>
                <li>
                  <span>②</span>확인 : 계정 확인 및 활동 위반 내용 확인
                </li>
                <li>
                  <span>③</span>검토 : 운영정책 등 위반사항 확인
                </li>
                <li>
                  <span>④</span>조치 : 경고, 블라인드, 정지, 강제탈퇴 등 조치
                  <br />
                </li>
              </ol>
            </li>
            <li>
              <strong>*유저는 제재 조치에 대해 이의가 있을 경우 이의 신청을 할 수 있습니다.</strong>
            </li>
            <li>
              <span>나)</span>12세 미만 회원 규제항목: 임시정지
              <ol className="dpeth3">
                <li>
                  <span>-</span>연령제한으로 인한 한시적 제재조치
                </li>
              </ol>
            </li>
            <li>
              <span>다)</span>규제 항목(심각) : A급-위반할 경우 영구정지
              <ol className="depth3">
                <li>
                  <span>①</span>대량의 부계정을 이용한 방송순위, 각 랭킹 및 달, 별을 조작/수집하는 등의 위반사항 <br />
                  (※대량의 기준은 이용 로그나 정도의 심각성에 따라 운영진이 판단)
                </li>
                <li>
                  <span>②</span>반정부적/반사회적/반서비스적/비이성적 제목 및 발언 또는
                  국가/정부/특정집단/당사/당서비스/회원전체/특정 개인을 모욕/비방/왜곡선동/성적비하/심한 욕설 등을 지속하는 경우
                </li>
                <li>
                  <span>③</span>운영진의 경고/계도 조치에 따르지 않고 지속적으로 서비스 운영을 방해하는 행위
                </li>
                <li>
                  <span>④</span>생명과 건강을 위협하는 경우, 성행위, 음란 활동 혹은 권리 침해, 정치와 관련된 생방송, 녹화방송 또는
                  매음 광고 등
                </li>
                <li>
                  <span>⑤</span>각종 경로를 통해서 신체 민감한 부위를 보여주는 경우 <br />
                  (예: 민감한 부위를 만지는 행위, 여성의 가슴, 남녀 둔부, 허벅지 안쪽, 성기를 보여주는 행위, 시스루 복장 등)
                </li>
                <li>
                  <span>⑥</span>도박(예: 도박 라이브 혹은 도박을 선동하는 행위), 마약(예: 마약 전시, 투약 및 주사 방법, 제약
                  과정에 대한 설명 등)
                </li>
                <li>
                  <span>⑦</span>타인의 프라이버시/신변안전/공공이익 침해 또는 동물 학대
                </li>
                <li>
                  <span>⑧</span>다른 음란(예: 신음소리)/정치/도박/마약과 관련된 불법 행위
                </li>
                <li>
                  <span>⑨</span>경쟁품 홍보, 부당 스카우트, 불법 달/별 판매, 사기 등
                </li>
                <li>
                  <span>⑩</span>테러리즘, 극단주의, 전쟁 주장, 종교 선동 등 언론과 내용
                </li>
                <li>
                  <span>⑪</span>각종 경로를 통해서 성인용품, 성 보건품, 알바 사기 등 홍보하는 내용
                </li>
              </ol>
              *플랫폼의 이익을 침해하는 모든 행위를 엄격히 금지합니다.
            </li>
            <li>
              <span>라)</span>규제 항목(일반) : 정지- 위반할 경우 단계별 패널티 적용
              <ol className="depth3">
                <li>
                  <span>①</span>복장: 노출이 많은 옷차림 금지
                </li>
                <li>
                  <span>②</span>행동: 주정을 부리고 푹 자는 취태/흡연, 음주/다른 저속한 공연, 성행위 암시, 신음 소리 등
                </li>
                <li>
                  <span>③</span>발언: 타인을 비방 혹은 모욕하는 내용/타인을 희롱하는 내용/음란, 저속한 내용 전파 혹은 저속한
                  분위기를 만드는 행위/불법 광고나 서비스 규정을 어기는 광고(예: 성인용품, 총기류, 활과 화살, AV, 보건 제품, 담배,
                  불법 의약품, 성병 치료 등 광고 내용)
                </li>
                <li>
                  <span>④</span>방송 환경
                  <ol className="dpeth4">
                    <li>
                      <span>-</span>풍속영업 장소 (예: 목욕장 업소 등)
                    </li>
                    <li>
                      <span>-</span>에로/성행위를 연상시키는 음악/노래
                    </li>
                    <li>
                      <span>-</span>DJ가 규정을 준수한 동시에 청취자도 규정을 준수해야 함. (게스트 참여 시)
                    </li>
                    <li>
                      <span>-</span>저작 판권을 받지 않은 경우 플랫폼을 통해서 라이브 공연, 영화, TV 프로그램 등 중계 방송
                    </li>
                  </ol>
                </li>
              </ol>
            </li>
          </ol>
        </li>
      </ol>

      <p className="desc">
        <strong>*영구 정지의 경우 유저의 계정이 영구적으로 제재 받게 됩니다.</strong>
        <strong>*임시 정지의 경우 유저의 계정이 11세까지 제재를 받게 되고 12세가 되는 해 자동 해제됩니다.</strong>
        <strong>*경고와 정지의 경우 3차 적발 후 30일 이내 재 적발 시 3차와 동일한 제재가 적용됩니다.</strong>
        <strong>*회사의 판단에 따라 예외적으로 조정될 수 있습니다.</strong>
      </p>

      <table className="content">
        <caption>구분(A등급, 정지, 경고), 제재 조치에 따른 내용을 나타낸 표</caption>
        <colgroup>
          <col style={{width: '20%'}} />
          <col style={{width: '20%'}} />
          <col style={{width: '20%'}} />
          <col style={{width: '20%'}} />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">구분</th>
            <th scope="col" colSpan={3}>
              제재 조치
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="bold">영구정지</td>
            <td colSpan={3}>모든 서비스 이용 불가</td>
          </tr>
          <tr>
            <td className="bold">임시정지</td>
            <td colSpan={3}>(11세까지의 회원) 모든 서비스 이용 불가</td>
          </tr>
          <tr>
            <td className="bold" rowSpan={2}>
              정지
            </td>
            <td>1차</td>
            <td>2차</td>
            <td>3차</td>
          </tr>
          <tr>
            <td>1일 정지</td>
            <td>3일 정지</td>
            <td>7일 정지</td>
          </tr>
          <tr>
            <td className="bold" rowSpan={2}>
              경고
            </td>
            <td>1차</td>
            <td>2차</td>
            <td>3차</td>
          </tr>
          <tr>
            <td>경고 안내</td>
            <td>경고 안내</td>
            <td>1일 정지</td>
          </tr>
        </tbody>
      </table>
      <br />
      <br />

      <p>
        <strong>*제재조치는 수위 및 사안에 따라 결정 됩니다.</strong>
      </p>

      <table className="content">
        <caption>
          항목(음란물, 위법행위, 청소년 유해, 저작권 침해, 미풍양속 위배, 명예훼손, 광고, 자체 기준 위반), 제재 조치에 따른 내용을
          나타낸 표
        </caption>
        <colgroup>
          <col style={{width: '25%'}} />
          <col style={{width: '25%'}} />
          <col style={{width: '25%'}} />
          <col style={{width: '25%'}} />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">항목</th>
            <th scope="col" colSpan={3}>
              제재 조치
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>음란물</td>
            <td>정지</td>
            <td colSpan={2}>A급</td>
          </tr>
          <tr>
            <td>위법행위</td>
            <td>정지</td>
            <td colSpan={2}>A급</td>
          </tr>
          <tr>
            <td>청소년 유해</td>
            <td>경고</td>
            <td>정지</td>
            <td>A급</td>
          </tr>
          <tr>
            <td>저작권 침해</td>
            <td>경고</td>
            <td>경고 및 정지</td>
            <td>A급</td>
          </tr>
          <tr>
            <td>미풍양속 위배</td>
            <td>경고</td>
            <td>정지</td>
            <td>A급</td>
          </tr>
          <tr>
            <td>명예훼손</td>
            <td>정지</td>
            <td colSpan={2}>A급</td>
          </tr>
          <tr>
            <td>광고</td>
            <td>경고</td>
            <td colSpan={2}>정지</td>
          </tr>
          <tr>
            <td>자체 기준 위반</td>
            <td>경고</td>
            <td>정지</td>
            <td>A급</td>
          </tr>
          <tr>
            <td>임시정지</td>
            <td colSpan={3}>12세 미만 회원 임시 정지 (12세가 되는 1월 1일 00시 자동 해제)</td>
          </tr>
        </tbody>
      </table>
      <br />
      <p>
        부칙
        <br />
        5. 본 운영정책 Ver 1.4는 2020년 08월20일부터 적용됩니다.
        <br />
        4. 본 운영정책 Ver 1.3은 2020년 06월16일부터 적용됩니다.
        <br />
        3. 본 운영정책 Ver 1.2은 2020년 06월12일부터 적용됩니다.
        <br />
        2. 본 운영정책 Ver 1.1은 2020년 06월04일부터 적용됩니다.
        <br />
        1. 본 운영정책 Ver 1.0은 2020년 03월20일부터 적용됩니다.
      </p>
    </div>
  )
}
