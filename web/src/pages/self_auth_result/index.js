import React, {useContext, useState, useEffect} from 'react'
import Api from 'context/api'
import {useHistory, useLocation} from 'react-router-dom'
import qs from 'query-string'
import {Hybrid} from 'context/hybrid'

//context
import {Context} from 'context'

//layout
import Header from 'components/ui/header/Header'
import {IMG_SERVER} from 'context/config'

//
import './selfAuthResult.scss'
import {isDesktop} from "lib/agent";
import {postSleepMemUpd} from "common/api";

//
export default (props) => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  const history = useHistory()
  const location = useLocation()

  // const {result, code, message, returntype} = _.hasIn(props, 'location.state.result') ? props.location.state : ''
  const {result, code, message, returntype, url, pushLink, phoneNum, memNo} = qs.parse(location.search)

  /**
   * authState
   * 1 : 성인 - 자기 자신 본인인증 완료 후 // adultYn === 'y'
   * 2 : 미성년자 - 자기 자신 본인인증 완료 후 (법정대리인 인증 필요 상태) // adultYn === 'n' && parentsAgreeYn == 'n'
   * 3 : 법정대리인 본인인증 완료 후 // adultYn === 'n' && parentsAgreeYn == 'y'
   * 4 : 프로필에서 본인인증 완료 후
   */
  const [authState, setAuthState] = useState(0)
  const [dupCheck, setDupCheck] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [windowClose, setWindowClose] = useState(false);

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
    } else if (returntype === 'sleep') {
      setAuthState(7)
    } else if (returntype === 'event') {
      let changeUrl = url.split('DAL').join('/')
      changeUrl = changeUrl.split('BIT').join('_')
      return history.push(changeUrl)
    } else if (returntype === 'ageAuth') {
      setAuthState(9)
    } else if(returntype === '' && url === '11') {
      setAuthState(11)
    } else if(returntype === 'default') {
      setAuthState(12)
    } else if(returntype === 'parents') {
      setAuthState(13)
    }  else {
      checkAuth()
    }

    context.action.updateSetBack(true)
    context.action.updateBackFunction({name: 'selfauth'})
    return () => {
      context.action.updateSetBack(null)
    }
  }, [])

  const goWallet = () => {
    props.history.push(`/wallet`)
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

  const phoneAuthAction = () => {
    if(isDesktop()) {
      window.close();
    }else {
      history.replace('/');
    }
  }

  /* 법정대리 동의 완료 후 뒤로가기 처리 */
  const legalAuthBackEvent = () => {
    if(isDesktop()) {
      window.opener.location.replace('/wallet?exchange');
      window.close();
    } else {
      history.replace('/');
    }
  }

  const createHeader = () => {
    switch (authState) {
      case 0:
        return <></>;
      case 3:
        return <Header title={'법정대리인(보호자) 동의 완료'} type='back' backEvent={legalAuthBackEvent} />
      case 4:
      case 12:
        return <Header title={'본인 인증 완료'} type='back' backEvent={phoneAuthAction} />
      case 13:
        return <Header title={'법정대리인(보호자) 동의'} type='back' backEvent={null} />
      default:
        return <Header title={'본인 인증 완료'} type='back' backEvent={null} />
    }
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
                  if(isDesktop()) {
                    window.close()
                  }else {
                    history.push('/wallet?exchange');
                  }
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
                  if(isDesktop()) {
                    window.close()
                  }else {
                    history.push('/')
                  }
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
              달라 고객센터에서 철회 신청을 해주시기 바랍니다.
            </p>
            <div className="btn-wrap">
              <button
                onClick={legalAuthBackEvent}>
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
                  if(isDesktop()) {
                    window.close()
                  }else {
                    history.push('/myProfile/edit')
                  }
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
      case 7:
        if(!dupCheck) {
          setDupCheck(true);
          // code0: null, message: "본인인증 성공하였습니다.", result: "success", returntype: "sleep", state: "auth"
        }
        return (
          <div id="selfAuthResult">
            <section className="resultWrap">
              <div className="img_wrap">
                <img src={`${IMG_SERVER}/images/api/rabbit_02.svg`} />
              </div>
              <div className="auth-wrap">
                <div className="btn-wrap">
                  <button
                    onClick={() => {
                      if(isDesktop()) {
                        window.close()
                      }else {
                        history.push('/login');
                      }
                    }}
                  >확인
                  </button>
                </div>
              </div>
            </section>
          </div>
        )
      case 9:
        return (
          <div className="auth-wrap">
            <h5>
              본인 인증이 완료되었습니다.
            </h5>
            <div className="btn-wrap">
              <button
                onClick={() => {
                  if(isDesktop()) {
                    window.close()
                  }else {
                    window.location.href = '/'
                  }
                }}
              >확인
              </button>
            </div>
          </div>
        )
        case 11:
          return (
            <div className="auth-wrap">
              <h5>
                본인 인증이 완료되었습니다.
              </h5>
              <div className="btn-wrap">
                <button
                  onClick={() => history.push('/event/welcome')}
                >확인
                </button>
              </div>
            </div>
          )
      case 12:
        return (
          <div className="auth-wrap">
            <h5>
              본인 인증이 완료되었습니다.
            </h5>
            <div className="btn-wrap">
              <button
                onClick={() => {
                  if(isDesktop()) {
                    window.close()
                  }else {
                    const decodeLink = decodeURIComponent(pushLink);
                    history.push(decodeLink)
                  }
                }}
              >확인
              </button>
            </div>
          </div>
        )
      case 13:
        if(!windowClose) {
          setWindowClose(true);
        }
        const authFail = () => {
          return (
            <div className="auth-wrap">
              <h4>
                <span>법정대리인(보호자) 동의를 </span>실패했습니다.
              </h4>
              <div className="btn-wrap">
                <button
                  onClick={() => {
                    if(isDesktop()) {
                      window.close()
                    }else {
                      const decodeLink = decodeURIComponent(pushLink);
                      history.push(decodeLink)
                    }
                  }}>
                  확인
                </button>
              </div>
            </div>
          )
        }

        if(resultData?.result === 'success') {
          if(resultData?.data?.parentAuth?.data === 1) {
            return (
              <div className="auth-wrap">
                <h4>
                  만 19세 미만 미성년자 이용에 대한
                  <br />
                  <span>법정대리인(보호자) 동의가 완료</span>되었습니다.
                </h4>
                <p>
                  ※ 동의 철회를 원하시는 경우, <br />
                  달라 고객센터에서 철회 신청을 해주시기 바랍니다.
                </p>
                <div className="btn-wrap">
                  <button
                    onClick={() => {
                      if(isDesktop()) {
                        window.close()
                      }else {
                        const decodeLink = decodeURIComponent(pushLink);
                        history.push(decodeLink)
                      }
                    }}>
                    확인
                  </button>
                </div>
              </div>
            )
          }else {
            return authFail();
          }
        }else {
          return authFail();
        }
      default:
        return <></>
    }
  }

  useEffect(() => {
    if(windowClose) {
      if(isDesktop()) {
        console.log(pushLink);
        window.opener.location.href = pushLink ? pushLink : '/store';
      }
    }
  }, [windowClose]);

  /* 휴면 해제 처리 */
  useEffect(() => {
    if(dupCheck) {
      if(isDesktop()) {
        window.opener.location.href = '/login';
      }
      /* 휴면 해제 체크 */
      postSleepMemUpd({memNo, memPhone: phoneNum}).then(res => {
        const resultCode = res.code;
        if(resultCode === '0') {
          context.action.alert({
            title: '휴면상태가 해제되었습니다.',
            msg: `해제된 계정으로 다시 로그인하시면 달라의\n모든 서비스를 이용할 수 있습니다.`,
            callback: () => {
              if(isDesktop()) {
                window.close();
              }else {
                history.push('/login');
              }
            }
          })
        }else if(resultCode === '-1') {
          context.action.alert({
            title: '기존 정보와 일치하지 않습니다.',
            msg: `이용에 어려움이 발생한 경우 고객센터(1522-0251 혹은 help@dallalive.com)로 문의주시기 바랍니다.`,
            callback: () => {
              if(isDesktop()) {
                window.close();
              }else {
                history.push('/login');
              }
            }
          })
        }else {
          context.action.alert({
            title: '기존 정보와 일치하지 않습니다.',
            msg: res.message,
            callback: () => {
              if(isDesktop()) {
                window.close();
              }else {
                history.push('/login');
              }
            }
          })
        }
      })
    }
  }, [dupCheck])

  /* 미성년자 법정대리인 동의 메일 */
  useEffect(() => {
    const certResult = sessionStorage.getItem('certItem');
    if(certResult) {
      setResultData(JSON.parse(certResult));
      sessionStorage.removeItem('certItem')
    }
  }, []);

  //---------------------------------------------------------------------
  return (
    <>
      {authState === 7 ? createResult() :
        <div id="selfAuthResult">
          {createHeader()}
          <section className="resultWrap">
            {authState !== 0 && (
              <>
                <div className="img_wrap">
                  <img src={`${IMG_SERVER}/images/api/rabbit_02.svg`} />
                </div>
                {/* 3: 법정 대리인 동의 완료 */}
                {(authState !== 3 || authState !== 13) && <h2>본인 인증 완료</h2>}
                {createResult()}
              </>
            )}
          </section>
        </div>
      }
    </>
  )
}