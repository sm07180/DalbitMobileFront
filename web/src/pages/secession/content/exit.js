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
//static
import WarnIcon from './static/warn.svg'
//
const Exit = (props) => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  const history = useHistory()

  //---------------------------------------------------------------------
  const reducer = (state, action) => ({...state, ...action})
  const [state, setState] = useReducer(reducer, initialState)
  const [all, setAll] = useState(false)
  const [myMemId, setMyMemId] = useState('')
  const [registMemId, setRegistMemId] = useState('')
  //---------------------------------------------------------------------
  const FethData = async () => {
    const res = await Api.info_secsseion({
      data: {
        uid: registMemId
      }
    })

    if (res.result === 'success') {
      async function secfun(obj) {
        const res = await Api.member_logout({data: context.token.authToken})
        if (res.result === 'success') {
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
      if (registMemId !== myMemId) {
        context.action.alert({
          msg: 'UID가 일치하지않습니다.'
        })
      } else {
        context.action.alert({
          msg: res.message
        })
      }
    }
  }
  const Validate = () => {
    context.action.confirm({
      msg: '정말 회원탈퇴 하시겠습니까 ?',
      callback: () => {
        if (state.click1 === true) {
          FethData()
        }
      }
    })
  }

  //----------------
  useEffect(() => {
    if (context.profile.memId) {
      setMyMemId(context.profile.memId)
    }
  }, [])

  const RegistMem = (e) => {
    const {value} = e.target
    if (value.length > 8) return
    setRegistMemId(value)
  }
  const NoneValidate = (e) => {
    if (state.click1 === false) {
      context.action.alert({
        msg: '내용확인 버튼을 클릭해주세요.'
      })
    } else if (registMemId.length === 0) {
      context.action.alert({
        msg: 'UID를 입력해주세요.'
      })
    }
  }

  //---------------
  return (
    <Wrap>
      <div className="exitWarn">
        <img src={WarnIcon} />
        <h2>회원 탈퇴 전에 꼭 확인해주세요!</h2>
      </div>
      <ul className="exitMsg">
        <li>회원 탈퇴 후 개인 정보 및 서비스 이용 내역은 모두 삭제됩니다.</li>
        <li className="boldRed">
          * 회원 탈퇴와 동시에 회원가입 시에 기재한 모든 개인정보 및 서비스 이용 내역은 삭제되며, 복구는 불가합니다.
        </li>
        <li className="boldRed">* 단, 타 법령에 의해 수집 및 이용한 회원정보는 법령 준수기간 동안 보관됩니다.</li>
        <li>탈퇴 후 회원이 기존에 보유한 아이템은 모두 소멸되며 복구되지 않습니다.</li>
        <li>약관에 의해 제재 중인 계정의 경우 즉시 탈퇴가 불가능 합니다. 별도로 문의 해주시기 바랍니다.</li>
        <li className="boldRed">* 탈퇴 회원은 부정행위 방지를 위해 7일간 재가입이 불가합니다.</li>
        <li className="boldRed">
          * 탈퇴 후 7일이 지나 동일 로그인 ID로 재가입한 경우 이벤트성으로 제공되는 ' 달 ', ' 별 '은 지급되지 않습니다.
        </li>
      </ul>

      <Checkbox
        title="위의 내용을 확인하였으며, 탈퇴에 동의합니다."
        fnChange={(v) => setState({click1: v})}
        checked={state.click1}
      />
      <div className="inputBox">
        <input placeholder="아이디 입력" onChange={RegistMem} />
        <p>회원님의 정보 보호를 위해 UID를 재확인합니다.</p>
      </div>
      <p className="boldRedPtag">* UID는 ' 마이페이지 &gt; 프로필 설정 ' 페이지에서 확인 가능합니다.</p>
      <div className="btnBox">
        <button onClick={() => history.goBack()}>이전</button>
        {state.click1 === true && registMemId.length > 0 ? (
          <button className="submitOn" onClick={Validate}>
            회원탈퇴
          </button>
        ) : (
          <button className="submit" onClick={NoneValidate}>
            회원탈퇴
          </button>
        )}
      </div>
    </Wrap>
  )
}
export default Exit
//---------------------------------------------------------------------
const Wrap = styled.div`
  margin: 0 auto;
  padding: 10px 16px;
  .exitWarn {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    > img {
      display: block;
      width: 70.1px;
      height: 60px;
    }
    > h2 {
      margin-top: 12px;
      font-size: 18px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: -0.45px;
      text-align: left;
      color: #000000;
    }
  }
  .boldRedPtag {
    padding: 0 16px;
    box-sizing: border-box;
    margin-top: 8px;
    margin-bottom: 32px;
    list-style: none;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: -0.3px;
    text-align: left;
    color: #ec455f;
  }
  .exitMsg {
    padding: 0 16px;
    box-sizing: border-box;
    margin-top: 28px;
    > li {
      margin-bottom: 16px;
      list-style: disc;
      line-height: 1.43;
      font-size: 14px;
      letter-spacing: -0.4px;
      text-align: left;
      color: #000000;
    }
    .boldRed {
      margin-bottom: 8px;
      list-style: none;
      font-size: 12px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: -0.3px;
      text-align: left;
      color: #ec455f;
    }
  }
  .inputBox {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    > input {
      max-width: 180px;
      padding: 12px 0px 12px 12px;
      margin-right: 10px;
      box-sizing: border-box;
      height: 44px;
      border-radius: 12px;
      border: solid 1px #e0e0e0;
      &::placeholder {
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.43;
        letter-spacing: normal;
        text-align: left;
        color: #9e9e9e;
      }
    }
    > p {
      font-size: 12px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: -0.3px;
      text-align: left;
      color: #000000;
    }
  }
  .btnBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    button {
      width: calc(50% - 2px);
      height: 44px;
      border-radius: 12px;
      background-color: #757575;
      font-size: 16px;
      font-weight: 600;
      text-align: center;
      letter-spacing: -0.4px;
      color: #fff;
    }
    .submit {
      background-color: #bdbdbd;
    }
    .submitOn {
      background-color: #FF3C7B;
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
