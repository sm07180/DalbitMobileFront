import React, {useContext, useState, useEffect} from 'react'
import styled from 'styled-components'
import Api from 'context/api'
import {useHistory, useLocation} from 'react-router-dom'
import qs from 'query-string'
import {Hybrid} from 'context/hybrid'

//context
import {Context} from 'context'
import {COLOR_MAIN} from 'context/color'

//layout
import Layout from 'pages/common/layout'
import Header from 'components/ui/new_header'
import {IMG_SERVER} from 'context/config'

//
export default (props) => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  const history = useHistory()
  const location = useLocation()

  // const {result, code, message, returntype} = _.hasIn(props, 'location.state.result') ? props.location.state : ''
  const {result, code, message, returntype, url} = qs.parse(location.search)

  /**
   * authState
   * 1 : 성인 - 자기 자신 본인인증 완료 후 // adultYn === 'y'
   * 2 : 미성년자 - 자기 자신 본인인증 완료 후 (법정대리인 인증 필요 상태) // adultYn === 'n' && parentsAgreeYn == 'n'
   * 3 : 법정대리인 본인인증 완료 후 // adultYn === 'n' && parentsAgreeYn == 'y'
   * 4 : 프로필에서 본인인증 완료 후
   */
  const [authState, setAuthState] = useState(0)

  const checkAuth = () => {
    async function fetchSelfAuth() {
      const res = await Api.self_auth_check({})
      if (res.result === 'success') {
        const {parentsAgreeYn, adultYn} = res.data
        if (adultYn === 'y') return setAuthState(1)
        if (parentsAgreeYn === 'n' && adultYn === 'n') return setAuthState(2)
        if (parentsAgreeYn === 'y' && adultYn === 'n') return setAuthState(3)
      } else {
        context.action.alert({
          msg: res.message,
          callback: () => {
            window.location.href = '/'
          }
        })
      }
    }
    fetchSelfAuth()
  }

  useEffect(() => {
    if (result === 'fail' || code === 'C007' || code === 'C008') {
      return context.action.alert({
        msg: message,
        callback: () => {
          // props.history.push(`/mypage/${context.profile.memNo}/wallet`)
          // context.action.updateWalletIdx(1)
          window.location.href = '/'
        }
      })
    } else if (returntype === 'profile') {
      setAuthState(4)
    } else if (returntype === 'create') {
      setAuthState(5)
    } else if (returntype === 'join') {
      setAuthState(6)
    } else if (returntype === 'event') {
      let changeUrl = url.split('DAL').join('/')
      changeUrl = changeUrl.split('BIT').join('_')
      return history.push(changeUrl)
    } else if(returntype === '') {
      setAuthState(11)
    } else {
      checkAuth()
    }

    context.action.updateSetBack(true)
    context.action.updateBackFunction({name: 'selfauth'})
    return () => {
      context.action.updateSetBack(null)
    }
  }, [])

  const goWallet = () => {
    props.history.push(`/mypage/${context.profile.memNo}/wallet`)
    context.action.updateWalletIdx(1)
  }

  const goBack = () => {
    window.location.href = '/'
  }

  const goLegalAuth = async () => {
    let myBirth
    const baseYear = new Date().getFullYear() - 11
    const myInfoRes = await Api.mypage()
    if (myInfoRes.result === 'success') {
      myBirth = myInfoRes.data.birth.slice(0, 4)
    }

    if (myBirth > baseYear) {
      return context.action.alert({
        msg: `만 14세 미만 미성년자 회원은\n서비스 이용을 제한합니다.`
      })
    }

    history.push(`/legalauth`)
  }

  const createResult = () => {
    switch (authState) {
      case 0: //초기상태
        return <></>
      case 1: //환전 -> 성인이 자기자신 본인인증 완료 하였을 때
        return (
          <div className="auth-wrap">
            <h5>
              본인 인증이 완료되었습니다. <br />
              <span>환전 신청정보</span>를 작성해 주세요.
              <br />
            </h5>
            <div className="btn-wrap">
              <button
                onClick={() => {
                  history.push('/money_exchange')
                }}>
                확인
              </button>
            </div>
          </div>
        )
      case 2: //환전 -> 미성년자가 자기자신 본인인증 완료 후 법정대리인 인증 필요 상태
        return (
          <div className="auth-wrap">
            <h4>
              <strong>본인인증이 완료되었습니다.</strong>
            </h4>
            <h5>
              만 19세 미만 회원의 환전 신청 시 <br />
              <span>법정대리인(보호자) 동의가 필요합니다.</span>
            </h5>
            <p>
              ※ 법정대리인(보호자) 동의 시 제공되는 정보는 <br />
              해당 인증기관에서 직접 수집하여, 인증 이외의 용도로 이용 또는 <br />
              저장되지 않습니다.
            </p>
            <div className="btn-wrap">
              <button
                className="cancel"
                onClick={() => {
                  window.location.href = '/'
                }}>
                취소
              </button>
              <button onClick={goLegalAuth}>동의 받기</button>
            </div>
          </div>
        )
      case 3: //법정대리인 본인인증 완료 후
        return (
          <div className="auth-wrap">
            <h4>
              만 19세 미만 미성년자 이용에 대한
              <br />
              <span>법정대리인(보호자) 동의가 완료</span>되었습니다.
            </h4>
            <p>
              ※ 동의 철회를 원하시는 경우, <br />
              달빛라디오 고객센터에서 철회 신청을 해주시기 바랍니다.
            </p>
            <div className="btn-wrap">
              <button
                onClick={() => {
                  history.push('/money_exchange')
                }}>
                확인
              </button>
            </div>
          </div>
        )
      case 4: //프로필 -> 자기자신 본인인증 완료 하였을 때
        return (
          <div className="auth-wrap">
            <h5>
              <span>본인 인증이 완료되었습니다.</span>
              <br />
              확인을 누르시면 프로필 설정으로 돌아갑니다.
            </h5>
            <div className="btn-wrap">
              <button
                onClick={() => {
                  history.push('/private')
                }}>
                확인
              </button>
            </div>
          </div>
        )
      case 5: //20세 이상 방송방 만들기
      case 6: //20세 이상 방송방 참여
        return (
          <div className="auth-wrap">
            <h5>
              본인 인증이 완료되었습니다.
              <br />
              이제 <span>20세 이상 방송 및 청취</span>가 자유롭게 가능합니다.
            </h5>
            <div className="btn-wrap">
              <button
                onClick={() => {
                  if (authState === 5) {
                    Hybrid('CloseLayerPopup')
                  } else if (authState === 6) {
                    window.location.href = '/'
                  }
                }}>
                확인
              </button>
            </div>
          </div>
        )
      case 11:
        return (
          <div className="auth-wrap">
            <h5>
              <span>본인 인증이 완료되었습니다.</span>
            </h5>
            <div className="btn-wrap">
              <button
                onClick={() => window.location.replace('/')}>
                확인
              </button>
            </div>
          </div>
        )
      default:
        return <></>
    }
  }

  //---------------------------------------------------------------------
  return (
    <Layout {...props} status="no_gnb">
      {authState === 0 ? (
        <></>
      ) : (
        <Header title={authState === 3 ? '법정대리인(보호자) 동의 완료' : '본인 인증 완료'} goBack={goBack} />
      )}
      {authState !== 0 && (
        <Content>
          <div className="img_wrap">
            <img src={`${IMG_SERVER}/images/api/rabbit_02.svg`} />
          </div>
          <h2>본인 인증 완료</h2>
          {createResult()}
        </Content>
      )}
    </Layout>
  )
}
//---------------------------------------------------------------------

const Content = styled.div`
  padding: 30px 16px;
  .img_wrap {
    text-align: center;
  }
  h2 {
    padding: 30px 0 22px 0;
    color: #000;
    font-size: 24px;
    line-height: 24px;
    text-align: center;
  }
  .auth-wrap {
    h4 {
      text-align: center;
      color: #000;
      font-size: 16px;
      font-weight: 400;
      line-height: 20px;
      strong {
        font-weight: 600;
      }
      span {
        color: ${COLOR_MAIN};
      }
    }
    h5 {
      text-align: center;
      font-size: 14px;
      line-height: 20px;
      font-weight: 400;
      span {
        color: ${COLOR_MAIN};
      }
    }
    h4 + h5 {
      padding-top: 10px;
    }
    p {
      padding-top: 35px;
      color: #757575;
      font-size: 12px;
      line-height: 18px;
    }
    .btn-wrap {
      display: flex;
      padding-top: 30px;
      button {
        flex: 1;
        height: 44px;
        border-radius: 12px;
        color: #fff;
        font-weight: 600;
        background: ${COLOR_MAIN};
        border: 1px solid ${COLOR_MAIN};
        line-height: 44px;
        &.cancel {
          color: ${COLOR_MAIN};
          background: #fff;
        }
      }
      button + button {
        margin-left: 8px;
      }
    }
  }
`
