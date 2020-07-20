import React, {useContext, useState, useEffect} from 'react'
import styled from 'styled-components'
import Api from 'context/api'
import {useHistory} from 'react-router-dom'
import _, {uniqueId} from 'lodash'

//context
import {Context} from 'context'
import {COLOR_MAIN} from 'context/color'

//layout
import Layout from 'pages/common/layout'
import Header from 'components/ui/new_header'

//
export default (props) => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  const history = useHistory()

  const [popup, setPopup] = useState(false)

  const {result, code, message} = _.hasIn(props, 'location.state.result') ? props.location.state : ''

  /**
   * authState
   * 1 : 성인 - 자기 자신 본인인증 완료 후 // adultYn === 'y'
   * 2 : 미성년자 - 자기 자신 본인인증 완료 후 (법정대리인 인증 필요 상태) // adultYn === 'n' && parentsAgreeYn == 'n'
   * 3 : 법정대리인 본인인증 완료 후 // adultYn === 'n' && parentsAgreeYn == 'y'
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
          callback: goWallet
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
          props.history.push(`/mypage/${context.profile.memNo}/wallet`)
          context.action.updateWalletIdx(1)
          // window.location.href = '/'
        }
      })
    } else {
      checkAuth()
    }
  }, [])

  const goWallet = () => {
    props.history.push(`/mypage/${context.profile.memNo}/wallet`)
    context.action.updateWalletIdx(1)
  }

  const goBack = () => {
    window.history.back()
  }

  //---------------------------------------------------------------------
  return (
    <Layout {...props} status="no_gnb">
      {authState === 0 ? (
        <></>
      ) : (
        <Header
          title={authState === 3 ? '법정대리인(보호자) 동의 완료' : '본인 인증 완료'}
          goBack={authState === 2 ? goBack : goWallet}
        />
      )}

      <Content>
        {authState === 2 ? (
          <div className="auth-wrap">
            <h4>
              <strong>본인인증이 완료되었습니다.</strong>
            </h4>
            <h5>
              20세 미만 회원의 환전 신청 시 <br />
              <span>법정대리인(보호자) 동의가 필요합니다.</span>
            </h5>
            <p>
              ※ 법정대리인(보호자) 동의 시 제공되는 정보는 <br />
              해당 인증기관에서 직접 수집하여, 인증 이외의 용도로 이용 또는 <br />
              저장되지 않습니다.
            </p>
            <div className="btn-wrap">
              <button className="cancel" onClick={goBack}>
                취소
              </button>
              <button
                onClick={() => {
                  history.push('/legalauth')
                }}>
                동의 받기
              </button>
            </div>
          </div>
        ) : authState === 3 ? (
          <div className="auth-wrap">
            <h4>
              20세 미만 미성년자 이용에 대한
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
        ) : authState === 1 ? (
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
        ) : (
          <></>
        )}
      </Content>
    </Layout>
  )
}
//---------------------------------------------------------------------

const Content = styled.div`
  padding: 30px 16px;
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
