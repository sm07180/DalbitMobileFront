import React, {useState, useEffect, useContext, useReducer} from 'react'
import styled from 'styled-components'
//context
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import Api from 'context/api'
import {Context} from 'context'
import Checkbox from './checkbox'
import {useHistory} from 'react-router-dom'
import {Hybrid} from 'context/hybrid'
import Utility from 'components/lib/utility'

//
const Exit = props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  const history = useHistory()
  //---------------------------------------------------------------------
  const reducer = (state, action) => ({...state, ...action})
  const [state, setState] = useReducer(reducer, initialState)
  const [all, setAll] = useState(false)
  //---------------------------------------------------------------------
  const FethData = async () => {
    const res = await Api.info_secsseion({
      data: {}
    })

    if (res.result === 'success') {
      //console.log(res)
      async function secfun(obj) {
        const res = await Api.member_logout({data: context.token.authToken})
        if (res.result === 'success') {
          //로그아웃성공
          //쿠키삭제
          Utility.setCookie('custom-header', '', -1)
          Hybrid('GetLogoutToken', res.data)
          context.action.updateToken(res.data)
          context.action.updateGnbVisible(false)
          context.action.updateProfile(null)
          context.action.alert({
            msg: '회원 탈퇴가 완료 되었습니다.',
            callback: () => {
              history.push(`/`)
            }
          })
        }
      }
      secfun()
    } else {
      console.log(res)
      context.action.alert({
        msg: res.message
      })
    }
  }
  const Validate = () => {
    context.action.confirm({
      msg: '정말 회원탈퇴 하시겠습니까 ?',
      callback: () => {
        if (all === true) {
          FethData()
        }
      }
    })
  }

  const clearFilter = () => {
    // setState(agree)
    // if (
    //   state.click1 === true &&
    //   state.click2 === true &&
    //   state.click3 === true &&
    //   state.click4 === true &&
    //   state.click5 === true &&
    //   state.click6 === true
    // ) {
    //   setState(initialState)
    // }
    if (all === false) {
      setAll(true)
    } else if (all === true) {
      setAll(false)
    }
  }

  useEffect(() => {
    // if (all) {
    //   setState({click1: true, click2: true, click6: true})
    // } else {
    //   //setState({click1: false, click2: false, click6: false})
    // }
  }, [all])

  // useEffect(() => {
  //   if (state.click1 === true && state.click2 === true && state.click6 === true) {
  //     setAll(true)
  //   }
  //   if (state.click1 === false || state.click2 === false || state.click6 === false) {
  //     setAll(false)
  //   }
  // }, [state])
  return (
    <Wrap>
      <Checkbox
        title="회원 탈퇴 시 개인 정보 및 이용 정보는 즉시 삭제 됩니다."
        fnChange={v => setState({click1: v})}
        checked={state.click1}
      />
      <div>
        <p>* 회원 탈퇴와 동시에 회원가입 시에 기재한 모든 개인정보 및 서비스 이용 내역은 삭제되며, 복구는 불가합니다.</p>
        <p>* 단, 타 법령에 의해 수집 및 이용한 회원정보는 법령 준수기간 동안 보관됩니다.</p>
      </div>
      <Checkbox
        title="탈퇴 후 회원이 기존에 보유한 달빛라이브 아이템은 모두 삭제됩니다."
        fnChange={v => setState({click2: v})}
        checked={state.click2}
      />
      {/* <Checkbox
        title="탈퇴 후 기존 보유한 팬 정보는 모두 삭제됩니다."
        fnChange={v => setState({click3: v})}
        checked={state.click3}
      />
      <Checkbox
        title="탈퇴 후 삭제한 계정에 대한 정보 복구는 불가합니다."
        fnChange={v => setState({click4: v})}
        checked={state.click4}
      />
      <Checkbox title="탈퇴 후 7일간 서비스 재가입은 불가합니다." fnChange={v => setState({click5: v})} checked={state.click5} /> */}
        <Checkbox
            title="약관에 의해 제재중인 계정의 경우 즉시 탈퇴가 불가합니다.
         별도로 문의해주시기 바랍니다."
            fnChange={v => setState({click6: v})}
            checked={state.click6}
        />
        <Checkbox
            title="탈퇴 회원은 부정행위 방지를 위해 7일간 재가입이 불가합니다."
            fnChange={v => setState({click7: v})}
            checked={state.click7}
        />
        <Checkbox
            title="탈퇴 후 7일이 지나 동일 로그인ID로 재가입한 경우 이벤트성으로 제공되는 “달”, ”별”은\n지급되지 않습니다."
            fnChange={v => setState({click8: v})}
            checked={state.click8}
        />
      <div className="allagree">
        위의 내용을 모두 확인하였습니다.
        <button onClick={() => clearFilter()} className={all === true ? 'on' : ''}></button>
      </div>
      <button
        className={
          all === true && state.click1 === true && state.click2 === true && state.click6 === true && state.click7 === true && state.click8 === true ? 'submiton' : 'submit'
        }
        onClick={Validate}
        disabled={all ? false : true}>
        회원탈퇴
      </button>
    </Wrap>
  )
}
export default Exit
//---------------------------------------------------------------------
const Wrap = styled.div`
  margin: 0 auto;
  padding-top: 10px;
  > div {
    padding: 10px 9px;
    margin-bottom: 10px;
    @media (max-width: ${WIDTH_MOBILE}) {
      padding: 10px 0;
    }
    @media (max-width: ${WIDTH_MOBILE_S}) {
      padding: 10px 0;
      margin-bottom: 10px;
    }
    & p {
      font-size: 14px;
      color: #ec455f;
      letter-spacing: -0.35px;
      transform: skew(-0.03deg);
      :last-child {
        margin-top: 16px;
      }
      @media (max-width: ${WIDTH_MOBILE}) {
        font-size: 13px;
        max-width: 89.44%;
      }
      @media (max-width: ${WIDTH_MOBILE_S}) {
        max-width: 100%;
        line-height: 18px;
      }
    }
  }
  & .allagree {
    position: relative;
    padding: 23px 10px;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: -0.45px;
    transform: skew(-0.03deg);
    @media (max-width: ${WIDTH_MOBILE}) {
      font-size: 16px;
      padding: 23px 0;
    }
    > button {
      display: block;
      position: absolute;
      top: 50%;
      right: 0;
      width: 24px;
      height: 24px;
      background: url(${IMG_SERVER}/images/api/ico-checkbox-off.svg) no-repeat center center/ cover;
      transform: translateY(-50%);
      @media (max-width: ${WIDTH_MOBILE}) {
        /* right: 16px; */
      }
      &.on {
        background: url(${IMG_SERVER}/images/api/ico-checkbox-on.svg) no-repeat center center/ cover;
      }
    }
  }
  & .submit {
    display: block;
    margin: 20px auto 186px auto;
    padding: 16px 135px;
    width: 100%;
    background-color: #bdbdbd;
    color: #fff;
    border-radius: 10px;
    @media (max-width: ${WIDTH_MOBILE}) {
      padding: 16px 0;
      margin: 10px auto;
    }
  }
  & .submiton {
    display: block;
    width: 100%;
    margin: 20px auto 186px auto;
    padding: 16px 135px;
    background-color: #632beb;
    color: #fff;
    border-radius: 10px;
    @media (max-width: ${WIDTH_MOBILE}) {
      padding: 16px 0;
      margin: 20px auto 116px auto;
    }
  }
`
/**
 * @title 스토어객체
 */
export const Store = () => {
  return Index.store
}
//---------------------------------------------------------------------
const initialState = {
  click1: false,
  click2: false,
  click3: false,
  click4: false,
  click5: false,
  click6: false
}
const agree = {
  click1: true,
  click2: true,
  click3: true,
  click4: true,
  click5: true,
  click6: true
}
