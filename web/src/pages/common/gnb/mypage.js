import React, {useState, useEffect, useContext} from 'react'
import {PHOTO_SERVER, WIDTH_MOBILE_S, WIDTH_TABLET_S} from 'context/config'
import styled from 'styled-components'
import {Context} from 'context'
//component
import Gnb from './gnb-layout'
import {Link, NavLink} from 'react-router-dom'
import Api from 'context/api'
import Utility from 'components/lib/utility'

export default props => {
  //---------------------------------------------------------------------
  const [login, setLogin] = useState(props.LoginInfo)

  const context = useContext(Context)
  //console.log('전역에 잘 담겼는지 확인할거에요', context.state)

  useEffect(() => {
    if (context.token.isLogin) {
      //로그인되어있으면 정보 가져오기
      //fetchData()
      //임시방편으로 회원가입 후 바로 내 프로필, 닉네임 볼수있게 설정. 나중에는 회원조회 api로 로그인 해서도 볼 수 있게 수정하기. 현재 회원조회 안됨
      if (context.state.profImg) {
        setLogin({
          ...login,
          title: context.state.nickNm,
          url: PHOTO_SERVER.concat(context.state.profImg)
        })
      }
    }
  }, [context.token.isLogin])

  //fetch
  async function fetchData() {
    const res = await Api.profile({
      data: {
        memNo: context.state.memNo
      }
    })
    console.log(res)
  }

  //data
  const info = [
    {title: '내프로필', url: '/live'},
    {title: '팬보드', url: '/store?캐스트'},
    {title: '내지갑', url: '/store'},
    {title: '리포트', url: '/event'},
    {title: '팬스타', url: '/store?랭킹'},
    {title: '설정', url: '/store?고객센터'},
    {title: '방송국관리', url: '/store?설정'}
  ]
  const makeNavi = () => {
    return info.map((list, idx) => {
      const _title = info[idx].title
      const _url = info[idx].url
      return (
        <NavLink title={_title} key={idx} to={_url} exact activeClassName="on">
          <LinkLi
            onClick={() => {
              context.action.updateGnbVisible(false)
            }}>
            <span>{_title}</span>
          </LinkLi>
        </NavLink>
      )
    })
  }
  return (
    <>
      <Gnb>
        <MyWrap>
          <Nheader>
            <ICON></ICON>
            <Title>마이 페이지</Title>
          </Nheader>

          <CONTENT>
            <ProfileWrap>
              <PIMG bg={context.token.isLogin ? login.url : 'https://devimage.dalbitcast.com/images/api/profileGnb.png'}></PIMG>
              <Ptitle>
                {context.token.isLogin ? (
                  <NoLoginTitle>
                    <h4>{login.title}</h4>
                    {/* <ID>{login.name}</ID> */}
                  </NoLoginTitle>
                ) : (
                  <NoLoginTitle>
                    <span>
                      <em>로그인</em>이 필요합니다
                    </span>
                  </NoLoginTitle>
                )}
              </Ptitle>
              {context.token.isLogin ? (
                <LoginChoiceOut
                  onClick={() => {
                    if (context.token.isLogin) {
                      const result = confirm('로그아웃 하시겠습니까?')
                      if (result) {
                        //fetch
                        async function fetchData(obj) {
                          const res = await Api.member_logout({data: context.token.authToken})
                          context.action.updateToken(res.data)
                          props.history.push('/')
                          context.action.updateGnbVisible(false)
                          console.log(props)
                          console.log(res)
                          return
                          alert('정상적으로 로그아웃 되었습니다.')
                          context.action.updateToken('')
                          context.action.updateCustomHeader('')
                          window.location.href = '/'
                        }
                        fetchData()
                      }
                    }
                  }}>
                  로그아웃
                </LoginChoiceOut>
              ) : (
                <LoginChoice
                  onClick={() => {
                    if (!context.token.isLogin) {
                      context.action.updatePopup('LOGIN')
                    } else {
                      const result = confirm('로그아웃 하시겠습니까?')
                      if (result) {
                        // const res = await Api.member_logout({
                        //   data: {
                        //     authToken: context.,
                        //     custom-Header: context.customHeader,
                        //   }
                        // })

                        alert('정상적으로 로그아웃 되었습니다.')
                        context.action.updateLogin(false)
                      }
                    }
                  }}>
                  로그인
                </LoginChoice>
              )}
            </ProfileWrap>
          </CONTENT>
          <NavWrap>{makeNavi()}</NavWrap>
        </MyWrap>
      </Gnb>
    </>
  )
}

//---------------------------------------------------------------------
//styled
const BTN = styled.button`
  position: absolute;
  top: 20%;
  right: 20%;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 10px;
  text-align: center;
  color: white;
  background-color: red;
`
const MyWrap = styled.div`
  width: 100%;
  height: 100%;
`
const Nheader = styled.div`
  width: 100%;
  height: 80px;
  padding: 16px 20px 16px 20px;
  box-sizing: border-box;
  &:after {
    display: block;
    clear: both;
    content: '';
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    height: 64px;
  }
  @media (max-width: ${WIDTH_MOBILE_S}) {
    height: 56px;
    padding: 10px 10px 16px 10px;
  }
`
const ICON = styled.div`
  float: left;
  width: 48px;
  height: 48px;
  margin-right: 10px;
  background: url('https://devimage.dalbitcast.com/images/api/ic_user_normal.png') no-repeat center center / cover;
  @media (max-width: ${WIDTH_MOBILE_S}) {
    width: 36px;
    height: 36px;
  }
`
const Title = styled.h2`
  float: left;
  color: #fff;
  font-size: 20px;
  line-height: 48px;
  letter-spacing: -0.5px;
  text-align: left;
  @media (max-width: ${WIDTH_MOBILE_S}) {
    line-height: 36px;
  }
`
const CONTENT = styled.div`
  width: 100%;
  height: calc(100vh -80px);
  padding: 10px 20px 0 20px;
  box-sizing: border-box;
  /* background-color: white; */
`
const ProfileWrap = styled.div`
  width: 100%;
  margin-bottom: 30px;
`
const PIMG = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto;
  border-radius: 50%;
  background: url(${props => props.bg}) no-repeat center center/ cover;
`
const Ptitle = styled.div`
  width: 100%;
`
const NoLoginTitle = styled.div`
  width: 100%;
  margin-top: 18px;
  text-align: center;
  & span {
    color: #a887f7;
    font-size: 20px;
    line-height: 1.15;
    letter-spacing: -0.5px;
    text-align: left;
    & em {
      display: inline-block;
      margin-bottom: 43px;
      border-bottom: 1px solid #ffffff;
      color: #ffffff;
      font-style: normal;
      line-height: 1.15;
      font-weight: 600;
    }
  }
  & h4 {
    padding-bottom: 20px;
    color: #ffffff;
    font-size: 20px;
    line-height: 1.15;
    letter-spacing: -0.5px;
    text-align: center;
  }
`

const ID = styled.strong`
  display: inline-block;
  padding: 10px 0 0 0;
  margin-bottom: 20px;
  color: #ffffff;
  font-size: 14px;
  font-weight: normal;
  letter-spacing: -0.35px;
  transform: skew(-0.03deg);
`

const LoginChoice = styled.button`
  display: block;
  width: 100%;
  background-color: #fff;
  color: #8556f6;
  font-size: 14px;
  line-height: 42px;
  letter-spacing: -0.35px;
  cursor: pointer;
  transform: skew(-0.03deg);
`
const LoginChoiceOut = styled.button`
  display: block;
  width: 100%;
  height: 40px;
  border: solid 1px #936af5;
  box-sizing: border-box;
  background-color: #8556f6;
  color: #fff;
  font-size: 14px;
  line-height: 40px;
  letter-spacing: -0.35px;
  cursor: pointer;
  transform: skew(-0.03deg);
`
const NavWrap = styled.div`
  height: calc(100% - 364px);
  padding: 20px 20px 0 20px;
  box-sizing: border-box;
  background-color: white;
  @media (max-width: ${WIDTH_TABLET_S}) {
    height: calc(100% - 340px);
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    height: calc(100% - 348px);
  }
`

const LinkLi = styled.div`
  position: relative;
  width: 100%;
  height: 40px;
  border-bottom: 1px solid #eeeeee;
  & span {
    display: block;
    color: #757575;
    font-size: 16px;
    line-height: 40px;
    letter-spacing: -0.4px;
    transform: skew(-0.03deg);
  }
  &:after {
    display: block;
    position: absolute;
    top: 50%;
    right: 0;
    width: 24px;
    height: 24px;
    background: url('https://devimage.dalbitcast.com/images/api/ic_arrow_right_color_s.png') no-repeat center center / cover;
    transform: translateY(-50%);
    content: '';
  }
`
