import React from 'react'
import styled from 'styled-components'
import {Link} from 'react-router-dom'

//layout
import {WIDTH_PC, WIDTH_TABLET} from 'context/config'

export default props => {
  const category = true
    ? [
        {txt: '공지사항', route: 'notice'},
        {txt: '팬 보드', route: 'fanboard'},
        {txt: '캐스트', route: 'cast'},
        {txt: '내 지갑', route: 'wallet'},
        {txt: '리포트', route: 'report'},
        {txt: '알림', route: 'alert'},
        {txt: '방송 설정', route: 'config'}
      ]
    : [{}]

  return (
    <Navigation>
      {category.map((bundle, index) => {
        return (
          <Link to={`/mypage/${bundle.route}`} key={index}>
            <TabText>{bundle.txt}</TabText>
          </Link>
        )
      })}
    </Navigation>
  )
}

const TabText = styled.div`
  color: #8556f6;
  cursor: pointer;

  &.active {
  }
`

const Navigation = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid #e0e0e0;

  a {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 14.285%;
    height: 48px;
  }

  @media (max-width: ${WIDTH_PC}) {
    width: 90%;
    margin: 0 auto;
  }
`
