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
  // const info = [
  //   {title: '홈', url: '/'},
  //   {title: '스타일가이드', url: '/guide'},
  //   {title: '로그인', url: '/login'},
  //   {title: '회원가입', url: '/user'},
  //   {title: '라이브방송', url: '/live'},
  //   {title: '마이페이지', url: '/mypage'},
  //   {title: '* APP', url: '/app'}
  // ]

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

  //makeMenu
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
          {makeNavigation(commonMenu)}
          <div>
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
          </div>
        </TopMenu>
        <Search>
          <input type="text" placeholder="인기 DJ, 꿀보이스, 나긋한 목소리 등 검색어를 입력해 보세요" />
          <button>검색</button>
        </Search>
        <MenuList>
          <ListWrap>{makeNavigation(tipMenu)}</ListWrap>
          <ListWrap>{makeNavigation(myPage)}</ListWrap>
          <ListWrap>{makeNavigation(customerCenter)}</ListWrap>
        </MenuList>
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
  /* mobile media query */
  @media (max-width: ${DEVICE_MOBILE}) {
    display: none;
  }
`

const Header = styled.header`
  display: flex;
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
  width: 800px;
  margin: 40px auto;
  * {
    color: #fff;
  }
`

const TopMenu = styled.div``

const Search = styled.div``

const MenuList = styled.div``

const ListWrap = styled.div`
  display: inline-block;
`
