import React from 'react'
import {useHistory} from 'react-router-dom'
import styled from 'styled-components'

export default () => {
  const history = useHistory()

  return (
    <Content>
      <div id="Package">
        <img src="https://image.dalbitlive.com/event/package/20210127/visual.jpg" alt="보이는 라디오 웹캠 지원 이벤트" />
        <img src="https://image.dalbitlive.com/event/package/20210127/content.jpg" alt="보이는 라디오 웹캠 지원 이벤트" />
        <button onClick={() => history.push('/customer/personal')}>
          <img src="https://image.dalbitlive.com/event/package/20210127/button_on.jpg" alt="지원신청" />
        </button>
      </div>
    </Content>
  )
}

const Content = styled.div`
  max-width: 460px;
  margin: auto;
  img {
    width: 100%;
  }
`
