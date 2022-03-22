import React, {useState, useEffect, useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import Api from 'context/api'
// global components
import Header from 'components/ui/header/Header'
// components
import './policy.scss'

const Policy = (props) => { 
  

  return (
    <div id="policy">
      <Header position={'sticky'} title={'운영정책'} type={'back'}/>
      <div className="subContent">
        <div className='wrap'>
          <p>
            달라는 사람들이 자신을 표현하고, 나의 가치를 스스로 발견하고 즐거움을 공유할 수 있도록 하여 더 나은 세상을 만들기 위해 최선을 다하고 있습니다. 이러한 목표 달성을 위해 모든 구성원들이 커뮤니티에서 재미있고 기분 좋은 경험을 할 수 있도록 커뮤니티 가이드라인을 제정했습니다. 달라 커뮤니티 가이드라인이 모든 구성원에게 명확하게 이해되고 전달되기를 바랍니다.
          </p>
        </div>
        <div className='wrap'>
          <h3>모니터링 대상</h3>
          <div className='monitoring'>
            <span>방송 제목</span>
            <span>방송 콘텐츠</span>
            <span>채팅 및 공지</span>
            <span>클립</span>
            <span>프로필</span>
            <span>팬보드</span>
            <span>닉네임</span>
            <span>사용 연령</span>
          </div>
          <ul className='list reference'>
            <li>위 기준은 우선 모니터링 기준이며, 이 외에도 달라 서비스 전반적으로 24시간 모니터링이 이루어집니다.</li>
          </ul>
        </div>
        <div className='wrap'>
          <h3>규제항목</h3>
          <ul className='list number'>
            <li>
              <h3>음란물 및 노출</h3>
              <p>노출, 음란물, 성행위 또는 성행위를 묘사하는 콘텐츠 및 활동을 금지합니다.</p>
              <ul className='list roundNumber'>
                <li>
                  각종 경로를 통해서 신체 민감한 부위를 보여주는 경우<br/>
                  (예: 민감한 부위를 만지는 행위, 여성의 가슴, 남녀 둔부, 허벅지 안쪽, 성기를 보여주는 행위, 시스루 복장 등)
                </li>                  
                <li>성행위 및 유사 성행위를 묘사하는 이미지, 기타 행위(신음소리 등)</li>
                <li>성적인 사진, 신체(유두, 성기, 음모 등) 이미지, 도구(예: 자위도구)를 화면에 노출</li>
                <li>음란 방송을 진행하는 조건으로 금품, 유료 아이템, 추천 등을 요구하는 내용</li>
                <li>방송에서 음란성 대화(성적 이야기, 성적 질문, 성적 만남 유도, 신체관련 질문 등)를 하는 내용</li>
                <li>조건 만남 또는 성매매 등의 조건(금액/장소)을 홍보하는 내용</li>
                <li>라이브 방 제목, 유저 닉네임, 공지사항 등에 성적인 단어, 음란한 내용을 암시하는 문구를 사용하는 행위</li>
                <li>위 항목 외 음란 행위가 포함된 내용</li>
              </ul>
              <ul className='list reference'>
                <h5>상황에 따른 예외</h5>
                <p>수영, 해변, 콘서트, 축제</p>
                <li>성기를 모두 가리는 수영복은 허용되며, 여성의 경우 유두가 겉으로 보이지 않아야 합니다.</li>
              </ul>
            </li>
            <li>
              <h3>명예훼손</h3>
              <p>공공연히 타인을 모욕하거나 타인의 명예를 훼손시키는 모든 행동을 금지합니다.</p>
              <ul className='list alphabet'>
                <li>
                  타인 비하
                  <ul className='list roundNumber'>
                    <li>공공연히 타인을 모욕하거나 타인의 명예를 훼손하는 경우</li>     
                    <li>특정인 또는 특정 집단 부적절한 욕설, 비난, 비하, 성적 발언</li>     
                    <li>과도한 욕설과 불건전한 언어, 혐오, 잔혹, 폭력적 발언</li>     
                    <li>방송 또는 게시물에 타인의 사생활(개인정보포함)이나 검증/확인되지 않은 내용, 거짓의 내용을 공개적으로 밝히거나 유포하는 행위(이름, 신분, 사회적 지위, 인격 등)</li>     
                    <li>위 항목 외 명예훼손 내용이 포함되는 경우</li>   
                  </ul>
                </li>
                <li>
                  장애인 비하
                  <ul className='list roundNumber'>
                    <li>신체적, 정신적 장애를 가지고 있는 장애인 또는 장애인 관련자에게 모욕감을 주거나 비하, 멸시, 모욕, 학대, 착취, 유기, 따돌림, 감금, 폭행, 욕설 등 이와 유사한 모든 행위를 포함하는 내용</li>     
                    <li>신체적, 정신적 장애를 가지고 있는 장애인 또는 장애인 관련자를 집단 따돌림을 가하거나 유발하는 내용</li>     
                    <li>장애를 가지고 있는 장애인 또는 장애인 관련자를 괴롭히거나 금전적인 착취, 유기, 학대를 하거나 유발하는 내용</li>     
                    <li>장애인의 특정 신체나 행위를 비판 또는 비하하는 발언이나 성적 수치심을 자극하는 언어 표현, 희롱하는 발언을 하는 내용</li>     
                    <li>불특정 다수인을 가리켜 장애인이라고 지칭하는 발언의 방송을 하는 내용</li>   
                    <li>위 항목 외 장애인 비하 행위에 포함되는 내용</li>   
                  </ul>
                </li>
                <li>
                  지역/종교/인종차별 및 정치적 선동
                  <ul className='list roundNumber'>
                    <li>합리적 이유 없이 특정 지역, 종교, 인종 등을 차별하거나 이에 대한 편견을 조장하는 내용</li>     
                    <li>특정인종, 지역, 종교에 대한 차별 용어를 직접적으로 언급하거나 비하하는 내용</li>     
                    <li>성별의 차이를 두어 남녀 간의 분쟁을 조장하는 내용</li>     
                    <li>집단적 행위를 선동하는 발언</li>  
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              <h3>폭력 및 욕설</h3>
              <p>지나치게 폭력적인 행동과 욕설,혐오,잔혹성의 내용이 포함된 방송 및 언어 사용을 금지합니다.</p>
              <ul className='list roundNumber'>
                <li>지나치게 과도한 욕설과 부적절한 언어, 혐오, 잔혹, 폭력성 내용이 포함된 부적절한 방송 또는 채팅</li>     
                <li>동물 학대 또는 생명을 앗아가는 내용이 포함된 부적절한 방송 또는 채팅</li>     
                <li>타 회원에게 위협을 가하는 행위(현피, 구타 위협 등)</li>     
                <li>심각한 기물 파손 혹은 훼손 방송 또는 채팅</li>     
                <li>자해/자살 암시 및 타인에 대한 상해 흉기를 사용하여 신체를 손상하는 잔혹한 방송 또는 파일</li>   
                <li>위법으로 보기는 어려우나 보편적인 사회 질서를 해치거나 도의적으로 허용되지 않는 방송 또는 채팅</li>   
                <li>금품, 아이템, 추천 등의 대가로 선정적인 연출을 하는 방송 또는 채팅</li>   
                <li>위 항목 외 미풍양속 위배 행위가 포함된 방송 또는 채팅</li>   
              </ul>
            </li>
            <li>
              <h3>청소년 유해</h3>
              <p>청소년의 건전한 정서에 저해가 된다고 판단되는 행위를 금지합니다.</p>
              <ul className='list roundNumber'>
                <li>영상 방송 내 술, 담배, 전자담배를 포함한 유해 요소 노출 행위</li>     
                <li>청소년 유해 약물이나 물건의 정보를 상세하게 전달하여 사용을 조장하거나 연결하는 내용</li>     
                <li>미성년자에게 불건전한 교제를 조장하거나 성매매, 성적 노출 유도 및 성적 대상화</li>     
                <li>청소년 비행 미화, 유도, 동조 (가출, 폭력서클, 흡연, 음주 등)</li>     
                <li>청소년 접근 제한 서비스 (유해곡, 유해영상, 청소년 출입금지업소, 유해사이트 등) 이용 방송</li>   
                <li>위 항목 외 청소년 유해 정보가 포함된 경우</li>
              </ul>
            </li>
            <li>
              <h3>위법 행위</h3>
              <p>모든 불법적 행위 및 불법적 행동을 유도하는 행위를 금지합니다</p>
              <ul className='list alphabet'>
                <li>
                  법률 위반
                  <ul className='list roundNumber'>
                    <li>불법 사설 온라인 스포츠 배팅, 도박 영업, 게임 머니 환전을 홍보하는 행위</li>     
                    <li>음란성 사업장 및 퇴폐업소 공유 및 홍보하는 행위</li>     
                    <li>불법 약물(마약)을 하는 행위나 마약 도구를 노출하는 내용이 포함된 방송</li>     
                    <li>운전 중 방송.(도로교통법 위반)</li>     
                    <li>해킹, 주민등록생성기 등 불법프로그램 사용/유도/정보 공유</li>   
                    <li>위 항목 외 법령에 위반되는 행위를 저지르거나 조장하여 법질서를 해할 우려가 있는 행위</li>   
                    <li>위 항목 외 불법 도박 및 불법 약물(마약)의 복용을 조장하는 경우</li>
                  </ul>
                </li>
                <li>
                  저작권 위반
                  <ul className='list roundNumber'>
                    <li>저작권자로부터 권리침해 신고가 접수된 저작물 침해 행위(저작물 편집 또는 훼손 등)</li>
                    <li>판권이 없는 스포츠, 영화, 애니메이션, TV채널 등의 저작권 침해 행위</li>
                    <li>저작권 보고 기간이 만료되지 않은 저작물 침해 행위</li>
                    <li>저작권법의 보호를 받는 산업재산권 무단 사용</li>
                    <li>위 항목 외 저작권 위반 방송으로 판단되는 경우</li>
                  </ul>
                </li>
                <li>
                  서비스 내 불법 행위
                  <ul className='list roundNumber'>
                    <li>방송 및 랭킹을 조작하는 내용</li>
                    <li>다수의 계정을 통해 특정 계정으로 달/별을 수집하는 내용</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              <h3>서비스 운영 방해</h3>
              <p>서비스 운영에 방해되는 악의적인 행위를 금지합니다.</p>
              <ul className='list roundNumber'>
                <li>동일한 내용을 반복적으로 등록(도배)</li>
                <li>고의적으로 서비스 운영을 방해하거나, 무단으로 플랫폼 또는 관리자를 사칭하는 등 서비스 제공에 악영향을 끼치는 행위</li>
                <li>이외의 고의적인 서비스 운영 방해</li>
              </ul>
            </li>
            <li>
              <h3>자체 기준 위반</h3>
              <p>플랫폼에 악영향을 끼치는 행위를 금지합니다.</p>
              <ul className='list roundNumber'>
                <li>다른 유저 프로필 사진 및 개인정보를 도용하여 사칭을 하는 행위</li>
                <li>회사와 협의되지 않은 라이브 스트리밍 서비스 홍보 및 사이트 가입 및 이용 등을 유도하는 행위(국내/외 플랫폼 포함) 및 영입을 위한 고의적 방해</li>
                <li>타 플랫폼의 영입을 위해 당사 플랫폼 내에서 회사와 협의 되지 않은 영업 활동을 하는 기업 및 단체, 개인과 그에 소속되어 당사 플랫폼에서 방송 송출을 하는 행위</li>
                <li>회사에서 콘텐츠 제작 지원을 목적으로 제공한 아이템을 판매하여 금전적 이득을 취하는 행위</li>
                <li>다른 DJ의 콘텐츠를 허락없이 임의로 송출하는 행위 (도방)</li>
                <li>타인이 대리하여 콘텐츠를 진행하는 행위 (대리방송)</li>
                <li>위 항목 외 자체 기준 위반으로 판단되는 경우</li>
              </ul>
            </li>
            <li>
              <h3>업무 방해  행위</h3>
              <p>폭언과 같은 업무 방해 행위를 금지합니다.</p>
              <ul className='list roundNumber'>
                <li>폭언(욕설,협박,모욕) :욕설, 협박, 모욕적인 발언을 하는 경우</li>
                <li>공포심,불안감 유발 : 공포심이나 불안감을 유발하는 언어, 문구의 사용</li>
                <li>성희롱 : 성적 수치심이나 혐오감을 유발하는 발언을 하는 경우</li>
                <li>허위 불만 제기 등 업무방해</li>
              </ul>
              <ul className='list reference'>
                <li>산업안전보건법 제41조에 의거하여 고객응대근로자 보호 조치를 시행하고 있사오니 고객센터, 1:1 문의를 통하여 위와 같은 행위가 확인 될 경우 즉시 안내가 종료됨을 알려드립니다.</li>
              </ul>
            </li>
          </ul>
        </div>
        <div className='wrap'>
          <h3>제재 조치 적용 안내</h3>          
          <ul className='list dash'>
            <li>
              <strong>경고 :</strong> 경고는 일부 위반에 대한 예의입니다. 위반과 관련된 콘텐츠를 삭제할 수도 있습니다. 이미 경고를 받은 위반 사항을 반복하거나 유사한 위반 사항을 범하는 경우 정지 혹은 영구정지 조치됩니다.
            </li> 
            <li>
              <strong>정지 :</strong> 해당 기간 동안 서비스 이용이 중단됩니다.
            </li> 
            <li>
              <strong>임시정지 :</strong> 유저의 계정이 만 14세가 되는 날부터 본인인증을 통해 해제 가능합니다.
            </li> 
          </ul>
          <table className="tableCel">
            <caption>제재조치에 따른 제재내용</caption>
            <colgroup>
              <col style={{width: '16%'}} />
              <col style={{width: '28%'}} />
              <col style={{width: '28%'}} />
              <col style={{width: '28%'}} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">제재조치</th>
                <th scope="col">경고 및 방송 종료</th>
                <th scope="col">정지</th>
                <th scope="col">영구정지</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="bold">제재내용</td>
                <td>처벌 관련<br/>팝업 문구 알림</td>
                <td>1일,3일,7일의<br/>기간 정지</td>
                <td>영구정지</td>
              </tr>
            </tbody>
          </table>

          <table className="tableCel">
            <caption>위반 횟수에 따른 제재 조치</caption>
            <colgroup>
              <col style={{width: '20%'}} />
              <col style={{width: '16%'}} />
              <col style={{width: '16%'}} />
              <col style={{width: '16%'}} />
              <col style={{width: '16%'}} />
              <col style={{width: '16%'}} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">위반횟수</th>
                <th scope="col">1~2회</th>
                <th scope="col">3회</th>
                <th scope="col">4회</th>
                <th scope="col">5회</th>
                <th scope="col">6회</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="bold">제재조치</td>
                <td>경고</td>
                <td>1일정지</td>
                <td>3일정지</td>
                <td>7일정지</td>
                <td>영구정지</td>
              </tr>
            </tbody>
          </table>
          <table className="tableCel">
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
                <th scope="col" colSpan={3}>제재 조치</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>음란물 및 노출</td>
                <td>정지</td>
                <td colSpan={2}>영구정지</td>
              </tr>
              <tr>
                <td>위법행위</td>
                <td>정지</td>
                <td colSpan={2}>영구정지</td>
              </tr>
              <tr>
                <td>명예 훼손</td>
                <td>정지</td>
                <td colSpan={2}>영구정지</td>
              </tr>
              <tr>
                <td>저작권 침해</td>
                <td>경고</td>
                <td>정지</td>
                <td>영구정지</td>
              </tr>
              <tr>
                <td>청소년 유해</td>
                <td>경고</td>
                <td>정지</td>
                <td>영구정지</td>
              </tr>
              <tr>
                <td>폭력 및 욕설</td>
                <td>경고</td>
                <td>정지</td>
                <td>영구정지</td>
              </tr>
              <tr>
                <td>서비스 운영 방해</td>
                <td>경고</td>
                <td>정지</td>
                <td>영구정지</td>
              </tr>
              <tr>
                <td>자체 기준 위반</td>
                <td>경고</td>
                <td>정지</td>
                <td>영구정지</td>
              </tr>
            </tbody>
          </table>
          <ul className='list reference'>
            <li>영구 정지의 경우 유저의 계정과 IP, 소유하신 모바일 디바이스 아이디를 차단하여 영구적으로 제재 받게 됩니다.</li>
            <li>경고와 정지의 경우 3차 적발 후 30일 이내 재 적발 시 3차와 동일한 제재가 적용됩니다.</li>
            <li>회사의 판단에 따라 예외적으로 조정될 수 있습니다.</li>
          </ul>    
        </div>
        

        <div className='wrap'>
          <h3>부칙</h3>
          <ul className='list reverseNumber'>
            <li>본 운영정책 Ver 1.0은 2020. 03. 20일부터 적용됩니다.</li>
            <li>본 운영정책 Ver 1.1은 2020. 06. 04일부터 적용됩니다.</li>
            <li>본 운영정책 Ver 1.2은 2020. 06. 12일부터 적용됩니다.</li>
            <li>본 운영정책 Ver 1.3은 2020. 06. 16일부터 적용됩니다.</li>
            <li>본 운영정책 Ver 1.4는 2020. 08. 20일부터 적용됩니다.</li>
            <li>본 운영정책 Ver 1.5는 2020. 09. 16일부터 적용됩니다.</li>
            <li>본 운영정책 Ver 1.6는 2021. 02. 08일부터 적용됩니다.</li>
            <li>본 운영정책 Ver 1.7는 2021. 08. 03일부터 적용됩니다.</li>
            <li>본 운영정책 Ver 1.8는 2021. 10. 25일부터 적용됩니다.</li>
            <li>본 운영정책 Ver 1.9는 2022. 02. 21일부터 적용됩니다.</li>
          </ul>
        </div>        
      </div>
    </div>
  )
}

export default Policy
