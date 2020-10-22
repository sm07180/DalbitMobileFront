import React from 'react'
import styled from 'styled-components'
import Header from 'components/ui/new_header.js'

export default () => {
  return (
    <Content>
      <div id="guestGuide">
        <Header title="게스트 가이드" />
        <div className="event-content">
          <img src="https://image.dalbitlive.com/event/guest/img_guest.png" alt="게스트 안내 페이지" />
        </div>
      </div>
    </Content>
  )
}

const Content = styled.div`
  #guestGuide {
    .event-content {
      img {
        width: 100%;
      }
    }
  }
`
