import React from 'react'
import styled from 'styled-components'
import Header from 'components/ui/new_header'

export default function postGuide() {
  return (
    <>
      <Header title="메시지 가이드" />
      <Content id="postGuideWrap">
        <div className="postGuideNotice">
          <div className="text">
            메시지를 이용한 분들 중 무작위로 20명을 추첨하여 50달을 드립니다. 당첨자는 1월 26일 공지사항에서 발표합니다. ※ 메시지
            관련하여 1:1문의로 좋은 의견을 남겨주시면 당첨 확률이 높아집니다😎
          </div>
          <img src="https://image.dalbitlive.com/event/post_guide/210119/postguide_01.png" alt="메시지 우수회원 이벤트" />
          <div className="text">
            메인화면 우측 상단, PC의 경우 좌측 메뉴 하단의 메시지 아이콘, 마이페이지에서 프로필 설정 하단의 메시지 메뉴를 클릭하면
            대화 리스트 화면으로 이동합니다.
          </div>
        </div>

        <div className="postGuideSearch">
          <img src="https://image.dalbitlive.com/event/post_guide/210115/postguide_02.png" alt="대화상대 찾기" />
          <div className="text">
            메시지 상단의 아이콘을 클릭하거나 버튼을 클릭하여 대화할 팬/스타를 클릭하면 해당 회원과 대화가 시작됩니다. 추후
            팬/스타 정렬 조건 및 회원검색 기능을 추가하여 대화를 원하는 회원을 더욱 쉽고 빠르게 찾을 수 있도록 개선할 예정입니다.
          </div>
        </div>

        <div className="postGuideCommunity">
          <img src="https://image.dalbitlive.com/event/post_guide/210115/postguide_03.png" alt="직접 대화하기" />
          <div className="text">
            대화하고 싶은 회원의 미니프로필이나 프로필 페이지 우측 상단의 메시지 아이콘을 클릭하면 바로 해당 회원과 1:1 대화가
            가능합니다
          </div>
        </div>
        <div className="postGuidePoint">
          <img src="https://image.dalbitlive.com/event/post_guide/210115/postguide_04.png" alt="1:1대화 주요기능" />
          <ol className="text">
            <li> 대화창에서도 방송과 동일하게 선물을 보낼 수 있습니다. 1:1대화에서도 선물을 보내보세요.</li>
            <li> 채팅 내용을 입력해서 대화를 나눌 수 있습니다.</li>
            <li> 카메라 및 저장된 사진을 전송하여 사진을 함께 볼 수 있습니다.</li>
          </ol>
        </div>
        <div className="postGuideThumbnail">
          <img src="https://image.dalbitlive.com/event/post_guide/210115/postguide_05.png" alt="이미지 확인하기" />
          <div className="text">1:1 대화창에서 이미지를 클릭하면 이미지를 확대해서 볼 수 있어요.</div>
        </div>
        <div className="postGuideOption">
          <img src="https://image.dalbitlive.com/event/post_guide/210115/postguide_06.png" alt="신고/차단/나가기" />
          <div className="text">
            대화창 우측 상단의 더 보기( )를 클릭하면 신고 및 차단하거나 대화를 종료할 수 있습니다.
            <ol>
              <li>
                현재 대화 중인 회원을 신고합니다. 신고 시 운영자가 대화 내역을 검색하여 운영정책 위반한 회원을 경고/정지 등 제재할
                수 있습니다.
              </li>
              <li>
                대화 중인 회원을 차단합니다. 차단 시 대화 리스트에서 삭제되며, 팬/스타 해제 및 서로의 방송이 보이지 않습니다.
              </li>
              <li> 대화를 종료합니다. 종료 시 대화 리스트에서 사라지지만 상대방과 다시 대화는 가능합니다.</li>
            </ol>
            <p>
              앞으로 더 나은 메시지 서비스를 제공하기 위해 지속적인 기능 개발 및 개선이 이루어질 예정입니다. 1:1 문의를 통해
              메시지 서비스에 대한 의견 주시면 적극 반영하겠습니다. 달라 메시지 많이 사랑해주세요😉❣
            </p>
          </div>
        </div>
      </Content>
    </>
  )
}

const Content = styled.div`
  position: relative;
  padding-bottom: 50px;
  img {
    width: 100%;
  }
  .text {
    text-indent: -9999px;
    position: absolute;
    left: -9999px;
    top: -9999px;
  }
`
