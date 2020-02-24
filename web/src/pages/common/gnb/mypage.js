/**
 *
 */
import React, {useState, useEffect, useContext, useMemo} from 'react'
import {IMG_SERVER, PHOTO_SERVER, WIDTH_MOBILE_S, WIDTH_TABLET_S} from 'context/config'
import styled from 'styled-components'
import {Context} from 'context'
//component
import Gnb from './gnb-layout'
import {Link, NavLink} from 'react-router-dom'
import Api from 'context/api'
import Utility from 'components/lib/utility'

export default props => {
  //---------------------------------------------------------------------
  //useContext
  const context = useContext(Context)
  const {isLogin} = context.token
  const {mypage} = context
  //useState
  //useMemo

  //useState
  const [fetch, setFetch] = useState({profImg: {url: 'https://devimage.dalbitcast.com/images/api/profileGnb.png'}, nickNm: ''})
  const [login, setLogin] = useState(props.LoginInfo)
  //const
  //console.log('전역에 잘 담겼는지 확인할거에요', mypage)

  //data
  const info = [
    {title: '내 정보 관리', url: '/mypage'},
    {title: '공지사항', url: '/mypage'},
    {title: '팬보드', url: '/store?캐스트'},
    {title: '내지갑', url: '/store'},
    {title: '리포트', url: '/event'}
  ]
  //---------------------------------------------------------------------
  //fetch
  async function fetchData(obj) {
    const res = await Api.mypage()
    if (res.result === 'success') {
      setFetch(res.data)
      context.action.updateMypage(res.data)
    }
  }
  //makeProfile
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
  //---------------------------------------------------------------------
  //useEffect
  useEffect(() => {
    if (isLogin) fetchData()
  }, [context.token.isLogin])
  //---------------------------------------------------------------------
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
              <PIMG bg={fetch.profImg.url}></PIMG>
              <Ptitle>
                {context.token.isLogin ? (
                  <NoLoginTitle>
                    <h4>{fetch.nickNm}</h4>
                    <ID>{fetch.memId}</ID>
                  </NoLoginTitle>
                ) : (
                  <NoLoginTitle>
                    <span>
                      <em
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
                      </em>
                      이 필요합니다
                    </span>
                  </NoLoginTitle>
                )}
              </Ptitle>
              {context.token.isLogin && mypage !== null ? (
                <MyInfo>
                  <p className="total cast">
                    <span>총 방송 시간</span>
                    <b>124시간 23분</b>
                    {/*mypage res.data에 값 따로 내려오지않음 */}
                  </p>
                  <p className="total listen">
                    <span>총 청취 시간</span>
                    <b>35시간 5분</b>
                    {/*mypage res.data에 값 따로 내려오지않음 */}
                  </p>
                  <ul>
                    <li className="count like">
                      <span>좋아요</span>
                      <b>34,111</b>
                      {/*mypage res.data에 값 따로 내려오지않음 */}
                    </li>
                    <li className="count star">
                      <span>보유별</span>
                      <b>{fetch.goldCnt}</b>
                    </li>
                    <li className="count moon">
                      <span>보유달</span>
                      <b>{fetch.rubyCnt}</b>
                    </li>
                  </ul>
                </MyInfo>
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

          <NavWrap>
            {context.token.isLogin && mypage !== null && makeNavi()}
            {context.token.isLogin && mypage !== null && (
              <LoginChoiceOut
                onClick={() => {
                  if (context.token.isLogin) {
                    const result = confirm('로그아웃 하시겠습니까?')
                    if (result) {
                      //fetch
                      async function fetchData(obj) {
                        const res = await Api.member_logout({data: context.token.authToken})
                        context.action.updateToken(res.data)
                        localStorage.removeItem('com.naver.nid.access_token')
                        localStorage.removeItem('com.naver.nid.oauth.state_token')
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
            )}
          </NavWrap>
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
  height: 56px;
  padding: 10px;

  &:after {
    display: block;
    clear: both;
    content: '';
  }
`
const ICON = styled.div`
  float: left;
  width: 36px;
  height: 36px;
  margin-right: 10px;
  background: url('https://devimage.dalbitcast.com/images/api/ic_user_normal.png') no-repeat center center / cover;
`
const Title = styled.h2`
  float: left;
  color: #fff;
  font-size: 20px;
  line-height: 36px;
  letter-spacing: -0.5px;
  text-align: left;
`
const CONTENT = styled.div`
  width: 100%;
  height: calc(100vh -80px);
  padding: 15px 20px 0 20px;

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
      cursor: pointer;
    }
  }
  & h4 {
    color: #ffffff;
    font-size: 20px;
    font-weight: 400;
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
  margin-top: 30px;
  border: solid 1px #e0e0e0;
  color: #757575;
  font-size: 14px;
  line-height: 40px;
  letter-spacing: -0.35px;
  cursor: pointer;
  transform: skew(-0.03deg);
`
const NavWrap = styled.div`
  height: calc(100% - 320px);
  padding: 20px 20px 0 20px;
  background-color: white;

  & > a:first-child > div {
    border-top: 0;
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    height: calc(100% - 340px);
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    height: calc(100% - 348px);
  }
`

const MyInfo = styled.div`
  p {
    overflow: hidden;
    padding: 7px 15px 7px 40px;
    border-radius: 20px;
    * {
      display: inline-block;
      color: #fff;
      transform: skew(0.03deg);
    }

    &.cast {
      background: rgba(255, 255, 255, 0.05) url(${IMG_SERVER}/images/api/ic_gnb_time.png) no-repeat 10px center;
      background-size: 24px;
    }

    &.listen {
      background: rgba(255, 255, 255, 0.05) url(${IMG_SERVER}/images/api/ic_gnb_headphone.png) no-repeat 10px center;
      background-size: 24px;
    }

    b {
      float: right;
      font-weight: 400;
    }
  }
  p + p {
    margin-top: 5px;
  }
  span {
    color: rgba(255, 255, 255, 0.5);
    transform: skew(0.03deg);
  }

  ul {
    display: flex;
    margin-top: 20px;
    li {
      flex: 1 0 auto;
      padding: 10px;
      border-radius: 10px;
      * {
        display: block;
        text-align: center;
      }

      &.like {
        background: rgba(255, 255, 255, 0.05) url(${IMG_SERVER}/images/api/ic_gnb_like.png) no-repeat center center;
        background-size: 24px;
      }
      &.star {
        background: rgba(255, 255, 255, 0.05) url(${IMG_SERVER}/images/api/ic_gnb_star.png) no-repeat center center;
        background-size: 24px;
      }
      &.moon {
        background: rgba(255, 255, 255, 0.05) url(${IMG_SERVER}/images/api/ic_gnb_moon.png) no-repeat center center;
        background-size: 24px;
      }
    }

    li + li {
      margin-left: 5px;
    }
    b {
      padding-top: 36px;
      color: #fff;
      font-weight: 400;
      transform: skew(0.03deg);
    }
  }
`

const LinkLi = styled.div`
  position: relative;
  width: 100%;
  height: 40px;
  border-top: 1px solid #eeeeee;
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
