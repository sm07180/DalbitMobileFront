import React, {useState, useRef} from 'react'
import {useHistory} from 'react-router-dom'
import {Hybrid} from 'context/hybrid'
import qs from 'query-string'

import styled from 'styled-components'
import Header from 'components/ui/new_header.js'
const btnClose = 'https://image.dalbitlive.com/svg/ic_close_black.svg'

export default () => {
  let history = useHistory()

  const noticeList = useRef()
  const {webview} = qs.parse(location.search)

  const [noticeView, setNoticeView] = useState(false)

  const buttonToogle = () => {
    if (noticeView === false) {
      setNoticeView(true)
      setTimeout(() => {
        const noticeListNode = noticeList.current
        const noticeListHeight = noticeListNode.offsetTop
        window.scrollTo(0, noticeListHeight)
      }, 100)
    } else {
      setNoticeView(false)
    }
  }

  return (
    <Content>
      <div id="imageGuide">
        <Header type="noBack">
          <h2 className="header-title">사진 권한 설정 방법</h2>
          <button
            className="btnClose"
            onClick={() => {
              if (webview === 'new') {
                Hybrid('CloseLayerPopup')
              } else {
                history.goBack()
              }
            }}>
            <img src={btnClose} alt="닫기" />
          </button>
        </Header>
        <div className="event-content">
          <img
            src="https://image.dalbitlive.com/event/image_guide/20201028/img01.jpg"
            alt="사진 선택을 클릭했을 때 보이는 팝업에서 사진선택,,또는 모든사진에 대한 접근 허용을 선택하세요"
          />
          <img
            src="https://image.dalbitlive.com/event/image_guide/20201028/img02.jpg"
            alt="사진 선택을 선택한 경우 휴대폰에 저장된 사진 중에서 방송방 배경 및 클립 배경으로 사용할 후보사진을 선택하세요."
          />
          <img
            src="https://image.dalbitlive.com/event/image_guide/20201028/img03.jpg"
            alt="모든 사진에 대한 접근 허용을 선탵ㄱ한 경우 휴대폰에 저장된 사진 중에서 현재 방송방 배경 또는 클립배경으로 사용할 사진을 선택 후 완료를 클릭하세요"
          />
          <img
            src="https://image.dalbitlive.com/event/image_guide/20201028/img04.jpg"
            alt="권한 변경을 하려는 경우 IOS 앱 '설정'클릭 후 페이지 하단의 달라를 클릭하세요"
          />
          <img src="https://image.dalbitlive.com/event/image_guide/20201028/img05.jpg" alt="사진을 클릭하세요" />
          <img
            src="https://image.dalbitlive.com/event/image_guide/20201028/img06.jpg"
            alt="선택한 사진 또는 모든 사진을 선택하세요"
          />
        </div>
      </div>
    </Content>
  )
}

const Content = styled.div`
  max-width: 460px;
  margin: auto;
  padding-bottom: 60px;
  #imageGuide {
    .event-content {
      img {
        width: 100%;
        display: block;
      }
    }
    .btnClose {
      position: absolute;
      right: 4px;
    }
  }
`
