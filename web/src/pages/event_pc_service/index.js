import React from 'react'
import {useHistory} from 'react-router-dom'
import Layout from 'pages/common/layout'
import './static/pcservice.scss'

export default () => {
  const history = useHistory()
  return (
    <Layout status="no_gnb">
      <div id="pcService">
        <h2 className="title">
          PC 이용시 좋은 점
          <button
            onClick={() => {
              history.goBack()
            }}>
            닫기
          </button>
        </h2>
        <img
          src="https://image.dallalive.com/event/pc_service/mobile/m_service01.jpg"
          alt="블루스택 녹스 등 애뮬레이터 없이 손쉽게 방송 가능!"
        />
        <img
          src="https://image.dallalive.com/event/pc_service/mobile/m_service02.jpg"
          alt="장점 확인하기, 고품격 스테레오 음질의 방송 가능, 블루스택, 녹스 필요 엊ㅄ다! 다이렉트 방송 & 청취 가능!"
        />
        <img
          src="https://image.dallalive.com/event/pc_service/mobile/m_service03.jpg"
          alt="채팅방과 방송방 내 모든 정보를 동시에 확인 가능!, 간편한 외부 콘텐츠 활용!, 큰 화면으로 소통 가능!"
        />
        <img
          src="https://image.dallalive.com/event/pc_service/mobile/m_service04.jpg"
          alt="빠른 타이핑 속도, 빠른 청취자들을 위한 해결책!"
        />
      </div>
    </Layout>
  )
}
