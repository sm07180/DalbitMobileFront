import React, {useState, useEffect, useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import Api from 'context/api'
// global components
import Header from 'components/ui/header/Header'
// components
import './terms.scss'
import {Hybrid} from "context/hybrid";

const Terms = (props) => {
  const history = useHistory();
  const backEvent = ()=>{
    if(props.type === 'termsT'){
      history.goBack();
    }else if(props.type === 'terms'){
      Hybrid('CloseLayerPopup')
    }
  }


  return (
    <div id="terms">
      <Header position={'sticky'} title={'서비스 이용약관'} type={'back'} backEvent={backEvent}/>
      <div className="subContent">
        <div className='wrap'>
          <h3>제 1 조 (목적)</h3>
          <p>본 약관은 주식회사 여보야(이하 “회사”라고 함)가 제공하는 달라 서비스의 이용과 관련하여 “회사”와 “회원” 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
        </div>
        <div className='wrap'>
          <h3>제 2 조 (용어 정의)</h3>
          <p>이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
          <ul className="list alphabet">
            <li>“달라 서비스”(이하 “서비스”라 함)는 “달라 방송자”로 정의된 이용자들이 PC를 통하여 Live 방송을 하고, 그 외 이용자들이 Live 방송을 하면서 댓글이나 채팅 창 대화 등을 통하여 참여할 수 있는 라이브 방송 플랫폼 서비스를 말합니다.</li>
            <li>“회원”이라 함은 본 약관에 동의하고, “서비스”에 접속하여 본 약관에 따라 “회사”와 이용계약을 체결하고 “회사”가 제공하는 “서비스”에 대한 이용 자격을 부여받은 자를 말합니다.</li>
            <li>“닉네임”이라 함은 “회원”이 “서비스”를 이용함에 있어 “서비스” 내 다른 “회원”과 자신의 구별을 위하여 “회원”이 정하고 “회사”가 승인하는 문자와 숫자의 조합을 말합니다.</li>
            <li>“방송자”라 함은 “서비스” 내에서 Live 방송을 진행하거나 “클립”을 녹음하여 게시하는 “회원”을 말합니다.</li>
            <li>“달”이라 함은 “회원”이 “회원”에게 “선물”을 하기 위해 결제하는 인터넷상 결제 수단을 말합니다.</li>
            <li>“별”이라 함은 “방송자”가 Live 방송 중 “후원” 받은 선물입니다.</li>
            <li>“아이템”이라 함은 서비스 내에서 주고받는 행위를 할 수 있도록 달라에서 제공하는 상품입니다.</li>
            <li>“충전”이라 함은 “회원”이 아이템을 “결제” 또는 “선물”하기위해 “회사”가 정한 결제 수단을 선택하여 현금을 “달”로 전환하는 행위를 말합니다.</li>
            <li>“선물”이라 함은 “회원”과 “회원”간에 “아이템”을 전달하는 행위 또는, Live 방송 중 “방송자”를 지지하기 위하여 “방송자”에게 “달” 또는 “아이템”을 선물하는 행위를 말합니다.</li>
            <li>“환전”이라 함은 “회원” 또는 “방송자”가 받은 “별”을 현금으로 전환하는 행위를 말합니다.</li>
            <li>“환불”이라 함은 “회원”이 충전한 “달”을 환불 수수료를 제한 후 현금으로 되돌려 받는 것을 말합니다.</li>
          </ul>
        </div>
        <div className='wrap'>
          <h3>제 3 조 (약관의 명시, 효력 및 개정)</h3>
          <ul className="list alphabet">
            <li>“회사”는 본 약관의 내용을 “회원”이 쉽게 알 수 있도록 “서비스” 화면에 게시합니다.</li>
            <li>“회사”는 약관의 규제에 관한 법률, 전자상거래 등에서의 소비자보호에 관한 법률(이하 “전자상거래법”), 소비자기본법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 관련 법을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.</li>
            <li>“회사”가 본 약관을 개정할 경우에는 개정된 내용, 개정약관의 적용일자 및 개정사유를 명시하여 현행 약관과 함께 개정 약관의 적용일자 15일 전부터 적용일 전일까지 “서비스” 화면에 공지하고, 개정 내용이 “회원”에게 불리할 경우에는 개정약관 적용일자 30일 전부터 “서비스” 화면에 공지하겠습니다.</li>
            <li>“회사”가 전항에 따라 “회원”에게 공지 또는 통지하면서 개정약관 적용 일까지 거부의사를 표시하지 아니할 경우 변경된 약관 내용에 동의한 것으로 본다는 뜻을 명확하게 공지 또는 통지하였음에도 “회원”이 명시적으로 거부의사를 표시하지 아니한 경우 “회사”는 “회원”이 개정약관에 동의한 것으로 간주됩니다.</li>
            <li>“회원”이 개정약관의 적용에 동의하지 않는 경우 “회사”는 해당 “회원”에 대해 개정약관의 내용을 적용할 수 없으며, 이 경우 “회원”은 “서비스” 이용계약을 해지할 수 있습니다. 다만, 기존 약관을 적용할 수 없는 특별한 사정이 있는 경우 “회사”는 해당 “회원”과의 “서비스” 이용계약을 해지할 수 있습니다.</li>
          </ul>
        </div>
        <div className='wrap'>
          <h3>제 4 조 (이용 계약의 성립)</h3>
          <ul className="list alphabet">
            <li>“회원”으로 가입하고자 하는 자가 “회사”가 정한 절차에 따라 본 약관과 개인정보 수집 제공에 동의하고, “서비스”를 이용함으로써 성립됩니다.</li>
            <li>“회사”는 “서비스”의 세부 내용에 따라 “청소년보호법” 등에 따른 등급 및 연령 준수를 위해 일부 “서비스”에 대하여 연령 제한 및 서비스 이용제한을 할 수 있습니다.
              <ul className="list roundNumber">
                <li>“달라”는 만 14세 이상부터 서비스 이용이 가능합니다.</li>
                <li>만 14세 이상부터 만 19세 미만 회원은 법정대리인(보호자)동의가 필요한 경우 요청할 수 있습니다.</li>
                <li>만 14세 미만 회원은 서비스 이용을 제한할 수 있습니다.</li>
              </ul>
            </li>
          </ul>
        </div>
        <div className='wrap'>
          <h3>제 5 조 (서비스 이용)</h3>
          <ul className="list alphabet">
            <li>“회원”은 “회사”가 제공하는 방식을 통해 “서비스”에 가입할 수 있습니다.</li>
            <li>“회사”는 “회원”이 가입 신청 시에 기입한 ‘닉네임”과 고유 아이디가 포함된 계정을 제공합니다. “회원”의 “닉네임”이 제9조 제1항 각 호에서 정하는 사유에 해당함이 향후에 확인되는 경우 해당 “회원”에 대하여 “닉네임”을 변경할 것을 권고 및 초기화할 수 있습니다.</li>
            <li>“회사”는 계정 정보를 통해 미성년자 여부 확인 등의 “회원” 관리업무를 수행합니다.</li>
            <li>“서비스” 이용시간은 “회사”의 업무상 또는 기술상 불가능한 경우를 제외하고는 연중무휴 1일 24시간(00:00-24:00)으로 함을 원칙으로 합니다.<br />다만, “서비스” 설비의 정기점검 등의 사유로 회사가 “서비스”를 특정 범위로 분할하여 별도로 “서비스” 이용의 날짜와 시간을 정할 수 있습니다.
            </li>
          </ul>
        </div>
        <div className='wrap'>
          <h3>제 6 조 (공개 게시물 등의 관리)</h3>
          <ul className="list alphabet">
            <li>“회사”는 건전한 통신 문화 정착과 효율적인 서비스 운영을 위하여 다음 각호의 1에 해당하는 공개 게시물/자료 삭제, 이동, 등록 거부 하는 등의 필요조치를 취할 수 있습니다.
              <ul className="list roundNumber">
                <li>다른 회원 또는 제3자에게 심한 모욕을 주거나 명예를 손상시키는 내용인 경우</li>
                <li>공공질서 및 미풍양속에 위반되는 내용을 유포하거나 링크시키는 경우</li>
                <li>불법복제 또는 해킹을 조장하는 내용인 경우</li>
                <li>영리를 목적으로 하는 광고일 경우</li>
                <li>범죄와 결부된다고 객관적으로 인정되는 내용일 경우</li>
                <li>다른 이용고객 또는 제3자의 저작권 등 기타 권리를 침해하는 내용인 경우</li>
                <li>회사에서 규정한 게시물 원칙에 어긋나거나, 게시판 성격에 부합하지 않는 경우</li>
                <li>타인의 법률상 이익을 침해하는 행위와 관련된 것으로 추정되는 게시물과 자료로 해당 당사자의 삭제 등의 요청이 있거나, 회사가 피소/고발될 수 있는 사유를 제공하는 경우</li>
                <li>서비스에 위험을 가할 소지가 있는 바이러스 등이 포함된 경우</li>
                <li>게재 기한을 초과한 경우</li>
                <li>전기통신 관계법령 및 형사 관계법령에 따른 국가기관 등의 삭제 등 요구가 있는 경우</li>
                <li>기타 관계법령에 위배된다고 판단되는 경우</li>
              </ul>
            </li>
            <li>“회사”는 게시물 등에 대하여 제3자로부터 명예훼손, 지적재산권 등의 권리 침해를 이유로 게시중단 요청을 받은 경우 이를 임시로 게시중단(전송 중단)할 수 있으며, 게시중단 요청자와 게시물 등록자 간에 소송, 합의 기타 이에 준하는 관련기관의 결정등이 이루어져 “회사”에 접수된 경우 이에 따릅니다.</li>
            <li>해당 게시물 등에 대해 임시 게시중단이 된 경우, 게시물을 등록한 이용고객은 재게 시(전송 재개)를 “회사”에 요청할 수 있으며, 게시 중단일로부터 30일 이내에 재 게시를 요청하지 아니한 경우 “회사”는 이를 삭제할 수 있습니다.</li>
          </ul>
        </div>
        <div className='wrap'>
          <h3>제 7 조 (서비스와 게시물에 대한 권리 및 지적재산권)</h3>
          <ul className="list alphabet">
            <li>“회원”은 “서비스”에 제공한 “회원”의 콘텐츠(영상파일, 라이브캠 촬영, 녹화영상, 음성녹음, 방송방이나 게시판 등에 게시한 글, 방송 중 채팅자료 등 “회원”이 서비스에 제공하거나 “서비스”를 이용하면서 업로드한 자료 일체)와 관련하여 저작권, 인격권 등 제3자와의 분쟁 발생 시 그 법적 대응 및 결과에 대한 책임을 지며 “회사”는 해당 콘텐츠와 관련된 일체의 책임을 지지 않습니다.</li>
            <li>“회사”는 “서비스”를 통한 저작권 침해 행위나 지적재산권 침해를 허용하지 아니하며 “회원”의 콘텐츠가 타인 지적재산권을 침해한다는 사실을 적절하게 고지 받거나 인지하게 되는 경우 저작권법 기타 관련 법령에서 정한 절차에 따라 그 콘텐츠 일체의 서비스를 중지하거나 제거할 수 있습니다. 또한 “회사”는 “회원”의 콘텐츠가 “서비스” 운영상의 문제가 있다고 판단하는 경우 사전통지 없이 삭제하거나 이동 또는 등록을 거부할 수 있는 권리를 보유합니다.</li>
            <li>“회원”의 콘텐츠에 대한 저작권은 원래의 저작자가 보유하되 본 약관이 정하는 바에 따라 “회사” 혹은 “회사가 지정한 자”에게 콘텐츠에 대한 사용 권한을 부여합니다. “회사”가 “회원”의 콘텐츠를 사용하는 용도와 방법은 아래와 같습니다.
              <ul className="list roundNumber">
                <li>“회원”이 “서비스”에 제공한 콘텐츠를 타 회원 기타 이용자가 시청하도록 함</li>
                <li>“회원”이 “서비스”에 제공한 콘텐츠를 “회사”나 타 회원 기타 이용자가 녹화/편집/변경하여 새로운 콘텐츠로 제작한 다음 이를 “서비스”의 타 회원 기타 이용자들이 시청하게 하거나 “회사”의 제휴사에 제공하여 그 이용자들이 이를 시청할 수 있도록 함</li>
                <li>“회원”이 “서비스”에 제공한 콘텐츠를 “회사”의 광고, 마케팅 용도로 사용할 수 있도록 함</li>
              </ul>
            </li>
            <li>본 조 제3항에 규정한 “회사”, “타 회원 기타 이용자” 및 “회사의 제휴사”가 “회원”의 콘텐츠를 이용할 수 있는 조건은 아래와 같습니다.
              <ul className="list roundNumber">
                <li>콘텐츠 이용 매체∙플랫폼 : 현재 알려져 있거나 앞으로 개발된 모든 형태의 매체, 장비, 기술을 포함함</li>
                <li>콘텐츠 이용 용도 : 상업적 또는 비상업적 이용을 구분하지 않음</li>
                <li>콘텐츠 이용 범위 : 국내 및 국외에서의 복제, 수정, 각색, 공연, 전시 방송, 배포, 대여, 공중송신, 2차적 저작물 작성, 기타 이용</li>
                <li>콘텐츠 이용 조건 : 비독점적, 지속적인 무상의 권리로서 양도 가능하며 취소 불가하고 서브 라이센스가 가능함</li>
              </ul>
            </li>
            <li>본 조 제3항의 “회원”의 사용 허락은 “회사”가 공지, 이용안내에서 정한 바에 따라 장래에 대하여 철회할 수 있습니다.</li>
          </ul>
        </div>
        <div className='wrap'>
          <h3>제 8 조 (서비스 이용의 제한 등)</h3>
          <ul className="list alphabet">
            <li>“회사”는 아래 각 호의 1에 해당하는 사유가 발생한 경우에는 “회원”에 대한 “서비스”의 일부 또는 전부를 제한하거나 중지시킬 수 있습니다.
              <ul className="list roundNumber">
                <li>“회원”이 “서비스”의 정상적인 운영을 방해하는 경우</li>
                <li>“회원”이 제9조 또는 제10조의 의무를 위반한 경우</li>
                <li>“서비스” 설비 점검, 보수 또는 공사로 인하여 부득이한 경우</li>
                <li>국가비상사태, “서비스” 설비의 장애 또는 서비스 이용의 폭주 등으로 “서비스” 이용에 지장이 있을 경우</li>
                <li>기타 중대한 사유로 인하여 “회사”가 “서비스” 제공을 지속하는 것이 부적당하다고 인정하는 경우</li>
              </ul>
            </li>
            <li>전항 제1호와 제2호에 의하여 “회사”가 “회원”의 “서비스” 이용을 제한하는 경우, “회사”는 경고, 한시적 이용정지, 영구이용정지 등으로 “서비스” 이용을 단계적으로 제한할 수 있고, 관련 법령을 위반하는 등의 “회원”의 중대한 위반행위에 대하여는 즉시 영구이용정지를 할 수 있습니다. 제한의 종류 및 기간과 제한의 방법 등에 관한 구체적인 기준은 달라 운영정책에서 정하는 바에 따릅니다.</li>
            <li>본 조 제1항 및 제2항에 따른 “서비스” 이용 제한조치 중 영구이용정지의 경우 동일인 식별 여부 절차를 통하여 확인된 “회원”의 모든 계정에 대하여 적용될 수 있으며, 이 경우 해당 “회원”은 어떠한 계정으로도 “서비스”를 이용할 수 없고, “회사”는 해당 “회원”에 대하여 “서비스” 이용계약을 해지할 수 있습니다.</li>
            <li>“회사”가 본 조항에서 정한 바에 따라 “회원”에 대하여 “서비스” 이용을 제한하는 경우 “회원”에게 그 사유, 제한의 내용 및 제한기간 등을 알려야 합니다. 이용 제한 조치를 받은 “회원”이 이용 제한 기간 중에 “회원” 탈퇴하여 “서비스”에 재 가입하는 경우 일부 “서비스”에 대한 제한이 따를 수 있습니다.</li>
            <li>“회사”가 본 조에 따라 “회원”과의 “서비스” 이용계약을 해지하기로 결정한 경우 “회사”는 해당 내용을 “회원”에게 통지하고, “회원”은 “회사”의 통지를 받은 날로부터 30일 이내에 이에 대한 항변의 기회를 가집니다.</li>
          </ul>
        </div>
        <div className='wrap'>
          <h3>제 9 조 (회원의 의무)</h3>
          <ul className="list alphabet">
            <li>“회원”은 아래 각 호에 해당하는 행위를 해서는 안됩니다.
              <ul className="list roundNumber">
                <li>“회원” 가입 신청 또는 변경 시 허위내용을 등록하는 행위</li>
                <li>“서비스”에 게시된 정보를 변경하거나 “서비스”를 이용하여 얻은 정보를 “회사”의 사전 승낙 없이 영리 또는 비영리의 목적으로 복제, 출판, 방송 등에 사용하거나 제3자에게 제공하는 행위</li>
                <li>“회사” 기타 제3자에 대한 허위의 사실을 “서비스” 내에 게재하거나 저작권 등의 지적재산권을 침해하는 등 “회사”나 제3자의 권리를 침해하는 행위</li>
                <li>다른 “회원”의 계정, 닉네임, 임의 제공된 아이디, 비밀번호 등의 개인정보를 부당하게 수집 또는 저장하는 행위</li>
                <li>타인의 허락 없이 계좌번호 및 신용카드번호 등으로 결제정보를 이용 행위</li>
                <li>이용자의 아이디 등 사이버 자산을 타인과 매매하는 행위</li>
                <li>결제기관을 속여 부정한 방법으로 결제하거나 지불거절을 악용하여 정당한 이유 없이 유료서비스를 구매하거나 환불하는 경우</li>
                <li>정당한 후원의 목적 외에 자금을 제공 또는 융통하기 위해 휴대폰이나 상품권 등을 통해 유료서비스를 이용, 결제, 구매, 환전, 환불하는 행위. 이를 돕거나 권유, 알선, 중개 기타 광고하는 행위</li>
                <li>사기성, 음란성, 사행성, 혐오성 등의 메시지 혹은 음성이 담긴 콘텐츠를 방송하거나 게시하는 행위</li>
                <li>정보통신망법 등 관련 법령에 의하여 그 전송 또는 게시가 금지되는 불법정보(컴퓨터 프로그램 등)를 전송하거나 게시하는 행위</li>
                <li>청소년보호법에서 규정하는 청소년유해매체물을 게시하는 행위</li>
                <li>공공질서 또는 미풍양속에 위배되는 내용의 정보, 문장, 도형, 음성, 영상 등을 유포하는 행위</li>
                <li>“회사”의 직원이나 “서비스”의 관리자를 가장하거나 사칭하는 행위</li>
                <li>타인의 명예를 훼손하거나 모욕하는 글을 게시하거나 방송하는 행위</li>
                <li>컴퓨터 소프트웨어, 하드웨어, 전기통신 장비의 정상적인 가동을 방해, 파괴할 목적으로 고안된 소프트웨어 바이러스, 기타 다른 컴퓨터 코드, 파일, 프로그램을 포함하고 있는 자료를 게시하거나 적용 및 유포하는 행위</li>
                <li>타인의 개인정보를 동의 없이 수집, 저장, 공개, 양도, 유포하는 행위</li>
                <li>“회사”가 제공하는 소프트웨어 등을 개작하거나 리버스 엔지니어링, 디컴파일, 디스어셈블 하는 행위</li>
                <li>해킹이나 버그 등을 이용한 비정상적인 방법으로 서비스에 피해를 주는 행위</li>
                <li>현행법령, 서비스 이용약관, 운영정책 및 기타 “서비스” 이용에 관한 ‘회사”의 공지사항 등을 준수하지 않는 행위</li>
                <li>방송통신위원회로부터 이용제한 심의, 의결을 받은 경우</li>
              </ul>
            </li>
            <li>“회사”는 이용자가 본 조 제1항에 정한 서비스 이용 제한 기준을 위반하여 회사의 서비스에 지장을 초래한 경우, 사전 통보 없이 기간을 정하여 “서비스” 이용을 제한할 수 있습니다.</li>
            <li>“서비스”중 관련 법령 등의 규정에 의하여 본인인증이 필요한 경우 “회원”은 해당 서비스를 이용하기 위하여 “회사”가 제공하는 방법에 따라 지불거절 등 진실된 정보를 “회사”에 제공하여야 합니다.</li>
            <li>“회원”은 “회사”에게 허위정보를 제공하였을 경우 발생하는 불이익에 대해서는 보호받지 못합니다.</li>
            <li>“회사”는 “회원”의 이용 제한이 정당한 경우 이로 인하여 “회원”이 입은 손해에 대해 배상하지 않습니다.</li>
          </ul>
        </div>
        <div className='wrap'>
          <h3>제 10 조 (양도금지)</h3>
          <ul className="list alphabet">
            <li>“회원”은 “서비스”의 결제정책에 맞는 결제를 진행합니다.</li>
            <li>“회원”은 “서비스”를 본인의 계정으로만 이용할 수 있으며, 타인에게 양도, 매매, 증여하거나 질권의 목적으로 사용할 수 없습니다.</li>
          </ul>
        </div>
        <div className='wrap'>
          <h3>제 11 조 (정보의 제공 및 광고의 게재)</h3>
          <ul className="list alphabet">
            <li>“회사”는 “회원”에게 각종 정보와 배너를 포함한 광고를 게재하거나 전자우편(e-mail), 휴대폰 메시지(SMS), 전화, 우편 등의 방법으로 이용고객에게 제공(또는 전송)할 수 있습니다.</li>
            <li>이용고객은 이를 원하지 않을 경우 회사가 제공하는 방법에 따라 수신을 거부할 수 있습니다.</li>
            <li>전항에 따른, 수신거부 이용고객의 경우에도 이용약관, 개인정보보호정책, 기타 이용고객의 이익에 영향을 미칠 수 있거나 “회원”이 반드시 인지해야 하는 사항은 제공할 수 있습니다.</li>
            <li>“회사”는 “회원”간 또는 “회원”과 제3자간에 서비스를 매개로 하여 거래 등을 한 행위에 대해 “회원”이 참여하거나, 거래의 결과로써 발생하는 손실 또는 손해에 대해서는 책임을 지지 않습니다.</li>
          </ul>
        </div>
        <div className='wrap'>
          <h3>제 12 조 (일반 탈퇴)</h3>
          <ul className="list alphabet">
            <li>“회원”이 “서비스” 탈퇴를 원하는 경우 언제든지 회원정보 관리에서 “회사”가 정한 절차에 따라 직접 탈퇴 또는 운영자에 의해 “회원”의 “닉네임”을 삭제, 탈퇴처리를 할 수 있습니다.</li>
            <li>“회원” 탈퇴 시 개인정보 및 보유 “아이템”과 “달”, ”별”은 즉시 삭제되어 복구가 불가합니다.</li>
            <li>단, 탈퇴가 되어 이용계약이 해지되더라도 “회원”이 일부 “서비스” 내 작성한 “게시물 등”은 모두 삭제되지 않고, 게시유지 및 저장할 수 있습니다.</li>
            <li>또한 제3자에 의하여 스크랩 또는 다른 공유 기능으로 인하여 재 게시되는 등 다른 이용자의 정상적인 “서비스” 이용을 위하여 필요한 범위 내에서는 삭제되지 않고 남아 있을 수 있습니다.</li>
            <li>“서비스” 이용계약이 해지되어 탈퇴한 “회원”에게 환불할 금액이 있는 경우 “회사”는 제18조에 따라 환불합니다.</li>
            <li>탈퇴가 완료된 “회원”은 부정행위 방지를 위해 7일간 재가입이 불가합니다.</li>
            <li>탈퇴가 완료된 “회원”이 7일 이 후 동일 로그인ID로 재 가입한 경우 이벤트성으로 제공되는 “달”, ”별”은 지급되지 않습니다.</li>
          </ul>
        </div>
        <div className='wrap'>
          <h3>제 13 조 (장기 미 접속 회원의 휴면 전환과 자동탈퇴)</h3>
          <ul className="list alphabet">
            <li>“회사”는 달라에 장기간 사용 이력이 없는 “회원”(이하 “장기 미접속 회원”이라 함)의 개인 정보 보호를 강화하고, 관련 법령을 준수하기 위하여 “회원” 정보를 “휴면 전환” 또는 “자동탈퇴” 처리합니다.</li>
            <li>“장기 미접속 회원”은 결제 이력 및 “회원” 간의 선물 “별”의 보유 사항을 고려한 기준 정책에 따라 변경 및 처리됩니다.</li>
            <li>“회원” 간의 선물 “별”은 타회원이 보유한 “달”로 아이템 선물로 받아 전환된 “별”을 칭하므로 운영자가 지급한 “별”은 보유 사항 기준에 준하지 않습니다.</li>
            <li>“휴면 전환 회원”은 달라 서비스를 1년 동안 접속하지 않은 “회원”을 말합니다.</li>
            <li>“자동탈퇴 회원”은 달라 서비스에서 “달”에 대한 결제 이력이 없고, “회원” 간의 선물 “별”이 확인되지 않으며 3개월 동안 접속하지 않은 “회원”을 말합니다. 또한, “회원” 간의 선물 “별”이 확인되지만, 1년 동안 접속 이력이 확인되지 않는 “회원”을 말합니다.
              <ul className='list reference'>
                <li>“회원”의 “달”에 대한 보유 여부는 “장기 미접속 회원”의 기준 정책에 포함되지 않습니다.</li>
              </ul>
            </li>
            <li>“장기 미접속 회원” 정보는 “휴면 전환” 및 “자동탈퇴” 처리일 이전 대상자에게 문자와 푸시 메시지를 보내는 방법으로 사전고지를 안내합니다.
              <ul className='list reference'>
                <li>사전 고지는 처리일을 기준으로 30일 이전 본인인증이 완료된 연락처를 통해 안내됩니다.</li>
              </ul>
            </li>
            <li>사전 고지 후에도, “장기 미접속 회원”이 재 접속하지 않은 경우에는 계속 이용할 의사가 없는 것으로 판단하여, “휴면 전환” 또는 “자동탈퇴” 처리됩니다.</li>
            <li>“휴면 전환” 및 “자동탈퇴” 예정 “회원”이 달라 홈페이지에서 로그인을 통해 서비스 재사용 의사가 확인될 경우 서비스를 재개할 수 있습니다.</li>
            <li>“휴면 전환” 처리가 된 “회원”이 사전 고지 일 이 후 서비스 재사용 의사를 밝힐 경우 “휴면 전환” 페이지를 통해 본인인증 및 서비스 이용에 대한 동의를 통해 서비스를 재개할 수 있습니다.</li>
            <li>“장기 미접속 회원”으로 “자동탈퇴” 처리가 된 “회원”은 처리일 다음날 달라 홈페이지에서 신규 회원가입을 통해 서비스를 이용할 수 있습니다.</li>
            <li>“회사”는 사전 고지를 하였음에도 “회사”의 요구에 응하지 아니하여 발생된 “자동탈퇴” 및 정보 삭제에 대한 손실, 손해에 대해 배상의 의무가 없습니다.</li>
          </ul>
        </div>
        <div className='wrap'>
          <h3>제 14 조 (달의 결제)</h3>
          <ul className="list alphabet">
            <li>“달”을 결제하기 위해서는 달라 서비스에 “회원”의 계정이 있어야 합니다.</li>
            <li>“회원”은 “회사”가 정한 방법(계좌이체, 신용카드, 휴대폰, 기타 회사가 정하는 지불수단 등)으로 결제 금액을 “회사”에 납부하거나, “회사”의 인터넷 서비스 내에서의 활동으로 적립 받아 “달”을 결제할 수 있습니다.</li>
            <li>만 19세 미만 미성년자의 “달” 구매한도는 일 100만원으로 제한합니다.</li>
            <li>“회사”는 결제의 이행을 위하여 반드시 “회원”의 개인정보를 추가적으로 요청할 수 있으며, “회원”은 “회사”가 요청하는 개인정보를 정확하게 제공하여야 합니다.</li>
            <li>“회사”는 “회원”이 허위로 또는 부정확하게 제공한 개인정보로 인하여 “회원”에게 발생하는 손해에 대하여 “회사”의 고의∙과실이 없는 한 “회원”의 손해를 배상할 책임이 없습니다.</li>
          </ul>
        </div>
        <div className='wrap'>
          <h3>제 15 조 (달과 별의 유효기간)</h3>
          <ul className="list alphabet">
            <li>“달” 또는 “별”의 유효기간은 “회원”이 “달”을 충전한 날 또는 “별”을 교환한 날로부터 5년이며, 해당 기간이 경과한 후에는 “달”과 “별”에 대한 사용권을 상실합니다.</li>
            <li>“달”에서 “아이템”으로 결제하여 선물한 “별”은 최종 선물 받은 날로부터 12개월 이내 미 환전 시 사용권을 상실합니다.</li>
            <li>탈퇴를 한 회원 또는 장기 미접속 “회원”에 대한 자동탈퇴를 고지한 후 자동탈퇴 처리일까지 접속 이력이 확인되지 않은 경우 “달”과 “별”에 대한 사용권을 즉시 상실합니다.</li>
          </ul>
        </div>
        <div className='wrap'>
          <h3>제 16 조 (결제 승인에 대한 제한)</h3>
          <ul className="list alphabet">
            <li>“회사”는 다음의 각 항에 해당하는 이용 신청에 대해서는 승인을 하지 않거나, 추후 해당 승인을 취소할 수 있습니다.
              <ul className="list roundNumber">
                <li>만 19세 미만의 미성년자가 신청한 경우</li>
                <li>이용 신청자의 귀책 사유로 승인이 불가능하다고 판단되는 경우</li>
                <li>기타 이용 신청을 승인하는 것이 관계 법령에 위반되거나 사회질서 및 미풍양속, 회사의 관련 약관 등 회사의 업무 방침에 위반된다고 판단되는 경우</li>
              </ul>
            </li>
            <li>“회사”는 다음의 각 항에 해당하는 경우에는 이용신청에 대한 승인 제한 사유가 해소될 때까지 승인을 제한할 수 있습니다.
              <ul className="list roundNumber">
                <li>서비스 설비가 부족하여 만족스러운 서비스를 제공할 수 없다고 판단되는 경우</li>
                <li>서비스 상의 장애가 발생한 경우</li>
              </ul>
            </li>
          </ul>
        </div>
        <div className='wrap'>
        <h3>제 17 조 (청약철회 및 해제/해지)</h3>
          <ul className="list alphabet">
            <li>“회원”이 “충전”하는 “달”에 대하여 관련 법령에 따라 청약의 철회 또는 계약의 해제(이하 “청약 철회 등”이라 함)가 가능한 경우 “청약 철회 등”이 제한되는 경우 구분되며, “청약 철회 등”이 제한되는 경우 “회사”는 “회원”이 “달”을 “충전”하는 시점에 그 내용을 고지합니다.</li>
            <li>“회원”은 “청약 철회 등”이 가능한 경우 “달”의 “충전”일로부터 7일 이내에 “청약 철회 등”을 하여야 합니다. “청약 철회 등”은 “회원”이 1:1문의 및 전자우편(e-mail), 휴대폰 메시지(SMS), 전화, 우편 등의 방법으로 “회사”에 그 의사를 표시한 때에 효력이 발생합니다.</li>
            <li>“회사”는 “청약 철회 등”의 의사표시는 수령한 날로부터 3영업일 이내에 “회원”이 “달”을 “충전”할 때 선택한 결제방법과 동일한 방법으로 이를 환급됩니다</li>
            <li>동일한 방법으로 환불이 불가능할 때에는 이를 사전에 고지합니다.</li>
            <li>이 경우 “회사”가 환급을 지연한 때에는 그 지연기간에 대하여 전자상거래법에서 정하는 비율에 의한 금원을 지연이자로 지급합니다.</li>
            <li>“회원”은 다음 각 호의 사유가 있을 때 이용계약을 해지 또는 해제할 수 있습니다.
              <ul className="list roundNumber">
                <li>“회원”과 “회사”가 본 약관상 합의한 해제∙해지 사유가 발생한 경우</li>
                <li>관련 법령에서 규정하는 해제∙해지 사유가 발생한 경우</li>
                <li>“회원”이 본 약관 변경에 동의하지 않아 “회원” 탈퇴하는 경우</li>
              </ul>
            </li>
            <li>“회사”는 “회원”의 “청약 철회 등”의 의사표시를 수신한 후 지체 없이 그 처리 내용에 대하여 “회원”에게 회신합니다.</li>
            <li>기타 본 약관에서 정하지 않는 부분은 전자상거래법 등 관련 법령에서 정하는 바에 의합니다.</li>
          </ul>
        </div>
        <div className='wrap'>
          <h3>제 18 조 (환불)</h3>
          <ul className="list alphabet">
            <li>“회원”이 착오로 납입한 금액에 대하여 “회사”는 초과금액을 “환불”하여야 합니다.</li>
            <li>“환불”에 관한 상세 사항은 아래 각 호의 내용이 적용됩니다.
              <ul className="list roundNumber">
                <li>“회원”이 서비스의 타 “회원” 또는 “방송자”에게 이미 선물한 “달”은 “환불”이 불가능 합니다.</li>
                <li>“달”을 “충전”한지 7일이 지났거나, “충전”한 “달”의 일부를 사용한 경우 남은 “달”에 대한 환불 수수료를 제외한 금액을 “회사”가 정하는 별도의 방법으로 “환불” 합니다.</li>
                <li>“회사”가 무료로 지급하거나 타인으로부터 선물 받은 “달”은 “환불”이 불가능합니다.</li>
              </ul>
            </li>
            <li>본 조의 규정에 의한 “환불”은 “환불” 의무가 발생한 날로부터 3영업일 이내에 하는 것으로 하며 “환불”이 지연되는 경우 지연이자율은 전자상거래법에서 정하는 바에 따릅니다. 다만, “회원”의 귀책사유로 인한 경우 나 결제사의 정책에 따라 환불이 지연되는 경우 지연이자를 지급하지 않습니다.</li>
            <li>“회사”는 서비스 종료 시 “회원”의 결제 취소 신청 여부와 관계없이 “회원”이 보유한 “달”전액을 “환불”합니다. 다만, 사용기간이 경과한 “달”은 “환불”하지 않습니다.</li>
          </ul>
        </div>
        <div className='wrap'>
          <h3>제 19 조 (환전)</h3>
          <ul className="list alphabet">
            <li>“방송자”가 후원 받은 “별”을 “환전”하기 위해서는 “회사”에 대하여 “환전”을 신청해야 하고, “회사”는 원칙적인 검토 후 이를 승인합니다.
              <ul className="list roundNumber">
                <li>“회사”가 정한 금액 이상의 “환전” 신청일 경우</li>
                <li>“회사”에 제공한 “회원”의 정보와 “회원”이 환전요청 시 제출한 서류. 즉, 신분증 사본과 통장사본 정보가 일치한 경우</li>
              </ul>
            </li>
            <li>“환전”에 대한 처리는 회사가 정한 정책에 따라 신청절차를 거쳐 승인이 처리됩니다.</li>
            <li>다음 각 호에 해당하는 “환전” 신청에 대해서는 승인하지 않거나 추 후 해당 승인을 취소할 수 있습니다.
              <ul className="list roundNumber">
                <li>회원이 제4조의 규정에 의거하여 서비스의 이용이 제한되는 경우</li>
                <li>회원이 제8조의 규정에 의거하여 서비스의 이용이 제한되거나 중지된 경우</li>
                <li>회원이 제9조의 규정에 의거하여 회원의 의무를 다하지 않은 경우</li>
                <li>회원이 선물 받은 “별”의 사용기간이 만료되어 “별”의 효력이 소멸된 경우</li>
              </ul>
            </li>
            <li>“환전” 절차 및 승인에 대한 구체적인 내용은 “회사”에서 정한 별도의 기준에 따릅니다.</li>
            <li>“환전” 시 원천징수세액, 계좌이체 수수료, 기타 수수료 등이 공제됩니다.</li>
          </ul>
        </div>
        <div className='wrap'>
          <h3>제 20 조 (책임제한)</h3>
          <ul className="list alphabet">
            <li>“회사”가 천재지변 또는 DDos 등 이에 준하는 불가항력으로 인하여 “서비스”를 제공할 수 없는 경우에는 “서비스”제공에 관한 책임이 면제됩니다.</li>
            <li>“회사”는 “회원”의 귀책사유로 인한 “서비스” 이용의 장애에 대하여는 책임을 지지 않습니다.</li>
            <li>“회사”는 “회원”이 “서비스”와 관련하여 게재한 정보, 자료, 사실의 신뢰도, 정확성 등의 내용에 관하여는 책임을 지지 않습니다.</li>
            <li>“회사”는 “회원”간 또는 “회원”과 제3자 상호간에 “서비스”를 매개로 발생한 분쟁에 개입할 의무가 없으며 손해배상을 할 책임이 없습니다.</li>
            <li>“회사”가 제공하는 “서비스”내에서 “회원”간의 이용 및 분쟁에 관련하여 이용약관 및 정책과 관련 법률에 대한 특별 규정이 없는 한 책임을 지지 않습니다.</li>
          </ul>
        </div>
        <div className='wrap'>
          <h3>제 21 조 (손해배상)</h3>
          <ul className="list alphabet">
            <li>“회원”이 본 약관에서 정한 사항을 위반함으로써 “회사” 또는 제3자에게 손해를 입힌 경우 “회원”은 “회사” 또는 제3자에게 그 손해를 배상하여야 합니다.</li>
            <li>“회사”의 귀책사유로 “회원”에게 손해가 발생한 경우, “회원”에게 발생한 손해를 배상합니다.</li>
          </ul>
        </div>
        <div className='wrap'>
          <h3>제 22 조 (약관 외 준칙)</h3>
          <ul className="list alphabet">
            <li>본 약관에서 정하지 아니한 사항과 본 약관의 해석에 관여하는 「전자상거래법」, 「약관 규제법」, 「정보통신만법」,「콘텐츠산업진흥법」 등 관계 법령에 따릅니다.</li>
            <li>“회사”는 본 약관 외에 운영정책, 개인정보처리방침 등 개별 약관을 둘 수 있습니다.</li>
          </ul>
        </div>
        <div className='wrap'>
          <h3>제 23 조 (면책)</h3>
          <ul className="list alphabet">
            <li>“회사”는 다음 각 호의 1에 해당하는 사유로 인하여 “회원” 또는 제3자에게 발생한 손해에 대하여는 그 책임을 지지 아니합니다.
              <ul className="list roundNumber">
                <li>천재지변 또는 이에 준하는 불가항력으로 인해 서비스를 제공할 수 없는 경우</li>
                <li>“회원” 본인이 관리하는 닉네임, 임의 제공된 아이디, 휴대폰번호, 비밀번호 등의 관리 등을 소홀히 하여 타인의 부정사용을 방치한 경우</li>
                <li>“회원”이 제3자의 이용 닉네임, 임의 제공된 아이디, 휴대폰번호, 비밀번호, 계좌번호, 신용카드번호 등 개인정보를 도용하여 제3자에게 손해를 발생시킨 경우</li>
                <li>“회사”의 관리영역이 아닌 공중통신선로의 장애로 서비스 이용이 불가능한 경우</li>
                <li>“회사”는 “회원” 상호간 또는 “회원”과 제3자간에 “달”, “별” 및 유료서비스를 매개로 하여 발생한 분쟁 등에 관한 경우</li>
                <li>기타 “회사”의 귀책사유가 없는 통신서비스 등의 장애로 인한 경우</li>
                <li>“회원”이 서비스 이용 시 한국음악저작권협회에 등록되어 있지 않은 음악을 저작권자의 허락없이 저작물을 사용하여 저작권 침해에 해당되는 경우 음악저작물에 관한 자세한 사항은 한국음악저작권협회를 통해 조회 가능합니다.(https://www.komca.or.kr/CTLJSP)</li>
              </ul>
            </li>
            <li>“회사”는 “회원”이 유료 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않습니다.</li>
            <li>“회사”는 “회원” 상호간 또는 “회원”과 제3자 상호간에 유료 서비스와 관련하여 발생한 분쟁에 대하여 개입할 의무가 없으며, “회사”에 귀책사유가 없는 한 이로 인하여 발생한 손해를 배상할 책임이 없습니다.</li>
          </ul>
        </div>
        <div className='wrap'>
          <h3>제 24 조 (분쟁의 해결)</h3>
          <p>본 약관은 대한민국 법에 의하여 해석되고 이행되며 “서비스” 이용과 관련하여 “회사”와 “회원”간에 발생한 분쟁에 대해서는 민사소송법상의 주소지를 관할하는 법원을 합의관할로 합니다.</p>
        </div>
        <div className='wrap'>
          <h3>제 25 조 (규정의 준용)</h3>
          <p>본 약관에 명시되지 않은 사항에 대해서는 관련 법령에 의하고, 법에 명시되지 않은 부분에 대하여는 관습에 의합니다.</p>
        </div>
        <div className='wrap'>
          <h3>부칙</h3>
          <ul className='list reverseNumber'>
            <li>본 약관은 2020. 06. 29일부터 시행됩니다.</li>
            <li>본 약관은 2020. 07. 09일부터 시행됩니다.</li>
            <li>본 약관은 2020. 08. 20일부터 시행됩니다.</li>
            <li>본 약관은 2020. 12. 23일부터 시행됩니다.</li>
            <li>본 약관은 2021. 02. 08일부터 시행됩니다.</li>
            <li>본 약관은 2021. 08. 03일부터 시행됩니다.</li>
            <li>본 약관은 2021. 10. 25일부터 시행됩니다.</li>
            <li>본 약관은 2022. 02. 21일부터 시행됩니다.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Terms
