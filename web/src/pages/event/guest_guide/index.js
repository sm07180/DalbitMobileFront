import React from 'react'
import styled from 'styled-components'
import Header from 'components/ui/new_header.js'

export default () => {
  return (
    <Content>
      <div id="guestGuide">
        <Header title="게스트 가이드" />
        <div className="event-content">
          <img src="https://image.dalbitlive.com/event/guest/20201022/guideimg01.jpg" alt="게스트 안내 페이지" />
          <img src="https://image.dalbitlive.com/event/guest/20201022/guideimg02.jpg" alt="게스트 안내 페이지" />
          <img src="https://image.dalbitlive.com/event/guest/20201022/guideimg03.jpg" alt="게스트 안내 페이지" />
          <img src="https://image.dalbitlive.com/event/guest/20201022/guideimg04.jpg" alt="게스트 안내 페이지" />
        </div>
      </div>
    </Content>
  )
}

const Content = styled.div`
  max-width: 460px;
  margin: auto;
  #guestGuide {
    .event-content {
      img {
        width: 100%;
        display: block;
      }
    }
  }
`
