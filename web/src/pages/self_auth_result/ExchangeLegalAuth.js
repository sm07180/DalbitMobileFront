import React, {useContext, useEffect, useState} from 'react';
import Api from "context/api";
import {isDesktop} from "lib/agent";
import {IMG_SERVER} from "context/config";
import Header from "components/ui/header/Header";
import {useHistory} from 'react-router-dom';
import {Context} from "context";

import './selfAuthResult.scss'

// 법정대리인 동의 필요 안내페이지
const ExchangeLegalAuth = () => {
  const history = useHistory();
  const context = useContext(Context)

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
        if (parentsAgreeYn === 'n' && adultYn === 'n') return setAuthState(2)

      } else {
        context.action.alert({
          msg: res.message,
          callback: () => {
            goWalletExchange();
          }
        })
      }
    }
    fetchSelfAuth()
  }

  useEffect(() => {
    checkAuth();
    context.action.updateSetBack(true);
    context.action.updateBackFunction({name: 'selfauth'});
    return () => {
      context.action.updateSetBack(null);
    }
  }, []);

  /* 법정대리인 동의 페이지로 이동 */
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
  const goWalletExchange = ()=>{
    history.goBack();
  }

  const createResult = () => {
    switch (authState) {
      case 2: //환전 -> 미성년자가 자기자신 본인인증 완료 후 법정대리인 인증 필요 상태
        return (
          <div className="auth-wrap">
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
                  goWalletExchange();
                }}>
                취소
              </button>
              <button onClick={goLegalAuth}>동의 받기</button>
            </div>
          </div>
        )
      default:
        return <></>
    }
  }

  //---------------------------------------------------------------------
  return (
    <div id="selfAuthResult">
      {authState === 2 ?
          <Header title={'법정대리인(보호자) 동의'} type='back' backEvent={goWalletExchange}/> : <></>
      }
      <section className="resultWrap">
        {authState === 2 && (
          <>
            <div className="img_wrap">
              <img src={`${IMG_SERVER}/images/api/rabbit_02.svg`} />
            </div>
            {createResult()}
          </>
        )}
      </section>
    </div>
  )
};

export default ExchangeLegalAuth;