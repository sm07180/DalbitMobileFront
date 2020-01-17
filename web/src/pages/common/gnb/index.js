/**
 * @file header/index.js
 * @brief PC,Mobile 상단에 적용되는 Header영역
 * @todo 반응형으로 처리되어야함
 */
import React, {useContext} from 'react'
import {NavLink} from 'react-router-dom'
import styled from 'styled-components'
//context
import {Context} from 'Context'
//components
import {DEVICE_MOBILE} from 'Context/config'

//
export default () => {
  //---------------------------------------------------------------------
  //context
  const context = new useContext(Context)

  // GNB menu list
  const commonMenu = [
    {title: '라이브', url: '/live'},
    {title: '캐스트', url: '/'},
    {title: '랭킹', url: '/'},
    {title: '스타일가이드', url: '/guide'},
    {title: 'APP', url: '/app'}
  ]

  const tipMenu = [
    {title: 'TIP', url: '/'},
    {title: '방송가이드', url: '/'},
    {title: '추천 DJ 선정', url: '/'},
    {title: '선물방법', url: '/'}
  ]

  const myPage = [
    {title: '마이페이지', url: '/mypage'},
    {title: '내 프로필', url: '/mypage'},
    {title: '팬보드', url: '/'},
    {title: '내 지갑', url: '/'},
    {title: '리포트', url: '/'},
    {title: '팬스타', url: '/'},
    {title: '설정', url: '/'},
    {title: '방송국 관리', url: '/'}
  ]

  const customerCenter = [
    {title: '고객센터', url: '/'},
    {title: '공지사항', url: '/'},
    {title: 'FAQ', url: '/'},
    {title: '1:1 문의', url: '/'}
  ]

  const allMenuList = [tipMenu, myPage, customerCenter]

  // make GNB nav menu
  const makeNavi = () => {
    return allMenuList.map((list, idx) => {
      const allMenu = () => {
        return list.map((list, idx) => {
          const {title, url} = list
          return (
            <NavLink
              title={title}
              key={idx}
              to={url}
              exact
              activeClassName="on"
              onClick={() => {
                context.action.updateGnbVisible(false)
              }}>
              <span>{title}</span>
            </NavLink>
          )
        })
      }
      return <div key={idx}>{allMenu()}</div>
    })
  }

  // Gnb 상단 nav menu, 화면확정되면 수정/삭제 할 것
  const makeNavigation = menuList => {
    return menuList.map((list, idx) => {
      const {title, url} = list
      return (
        <NavLink
          title={title}
          key={idx}
          to={url}
          exact
          activeClassName="on"
          onClick={() => {
            context.action.updateGnbVisible(false)
          }}>
          <span>{title}</span>
        </NavLink>
      )
    })
  }
  //---------------------------------------------------------------------
  return (
    <Gnb className={context.gnb_visible ? 'on' : 'off'}>
      <Header>
        <Logo>달빛라디오</Logo>
        <Close
          onClick={() => {
            context.action.updateGnbVisible(false)
          }}>
          닫기
        </Close>
      </Header>

      <Wrap>
        {/* 네비게이션 동적으로생성 */}
        <TopMenu>
          <div>{makeNavigation(commonMenu)}</div>

          <span>
            <button
              onClick={() => {
                context.action.updatePopup('LOGIN')
              }}>
              로그인
            </button>
            <NavLink
              title="회원가입"
              to="/user"
              onClick={() => {
                context.action.updateGnbVisible(false)
              }}>
              회원가입
            </NavLink>
          </span>
        </TopMenu>
        <Search>
          <input type="text" placeholder="인기 DJ, 꿀보이스, 나긋한 목소리 등 검색어를 입력해 보세요" />
          <button>검색</button>
        </Search>
        <MenuList>{makeNavi()}</MenuList>
        <LiveButton>방송하기</LiveButton>
      </Wrap>
    </Gnb>
  )
}
//---------------------------------------------------------------------
const Gnb = styled.nav`
  /* pc media query */
  overflow: hidden;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  padding: 0;
  height: 0;
  border-right: 1px solid #ccc;
  background: #8555f6;
  transition: height 0.5s ease-in-out;
  z-index: 11;

  &.on {
    height: 750px;
  }

  a {
    display: block;
  }
`

const Header = styled.header`
  display: flex;
  position: relative;
  height: 80px;
  padding: 20px;
  align-items: center;
  justify-content: space-between;

  * {
    color: #fff;
  }
`

const Logo = styled.div``

const Close = styled.button``

const Wrap = styled.div`
  position: relative;
  width: 800px;
  margin: 40px auto;
  * {
    color: #fff;
  }

  @media (max-width: ${DEVICE_MOBILE}) {
    width: 95%;
  }
`

const TopMenu = styled.div`
  display: flex;
  justify-content: space-between;
  div {
    a {
      display: inline-block;
      padding: 0;
      margin: 0 20px;
    }
  }
  span {
    button {
      margin-right: 10px;
      font-size: 16px;
    }
    a {
      display: inline-block;
    }
  }
  @media (max-width: ${DEVICE_MOBILE}) {
    div a {
      margin: 0 16px;
    }
  }
`

const Search = styled.div`
  position: relative;
  margin: 40px 0;
  input {
    width: 100%;
    border: 1px solid #fff;
    padding-right: 80px;
    background: none;
    color: #fff;
    line-height: 60px;
    text-indent: 18px;
  }
  input::placeholder {
    color: #fff;
  }
  button {
    position: absolute;
    top: 19px;
    right: 24px;
    font-size: 16px;
  }
`

const MenuList = styled.div`
  div {
    display: inline-block;
    vertical-align: top;

    a {
      line-height: 30px;
    }

    a:first-child {
      margin-bottom: 10px;
      font-weight: bold;
    }
  }

  div + div {
    margin-left: 60px;
  }

  @media (max-width: ${DEVICE_MOBILE}) {
    div + div {
      margin-left: 20px;
    }
  }
`

const LiveButton = styled.button`
  position: absolute;
  right: 0;
  bottom: 28%;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #fff;
  color: #8555f6;
  font-weight: bold;
  @media (max-width: ${DEVICE_MOBILE}) {
    right: 10px;
    bottom: -33%;
  }
`
