import React, {useState, useEffect, useContext, useReducer} from 'react'
import {useHistory} from 'react-router-dom'
import {Hybrid} from 'context/hybrid'
//context
import Api from 'context/api'
import Utility from 'components/lib/utility'
import Header from 'components/ui/header/Header'

import Checkbox from '../../components/Checkbox'
//static
import WarnIcon from '../../static/warn.svg'

import './secession.scss'
import {
  setGlobalCtxGnbVisible,
  setGlobalCtxMessage,
  setGlobalCtxUpdateProfile,
  setGlobalCtxUpdateToken
} from "redux/actions/globalCtx";
import {useDispatch, useSelector} from "react-redux";
//
const Secession = (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory()

  const reducer = (state, action) => ({...state, ...action})
  const [state, setState] = useReducer(reducer, initialState)
  const [all, setAll] = useState(false)
  const [myMemId, setMyMemId] = useState('')
  const [registMemId, setRegistMemId] = useState('')

  const FethData = async () => {
    const res = await Api.info_secsseion({
      data: {uid: registMemId}
    })
    if (res.result === 'success') {
      fetchSecData();
    } else {
      if (registMemId !== myMemId) {
        dispatch(setGlobalCtxMessage({
          type:"alert",
          msg: `UID가 일치하지않습니다.`,
        }))
      } else {
        dispatch(setGlobalCtxMessage({
          type:"alert",
          msg: res.message,
        }))
      }
    }
  }

  const fetchSecData = async () => {
    const res = await Api.member_logout({data: globalState.token.authToken});
    if(res.result === "success") {
      Utility.setCookie("custom-header", "", -1);
      Hybrid("GetLogoutToken", res.data);
      dispatch(setGlobalCtxUpdateToken(res.data))
      dispatch(setGlobalCtxGnbVisible(false));
      dispatch(setGlobalCtxUpdateProfile(null));
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: '회원 탈퇴가 완료 되었습니다.',
        callback: () => {
          location.reload();
        }
      }))
    }
  }

  const Validate = () => {
    dispatch(setGlobalCtxMessage({
      type: "confirm",
      msg: '정말 회원탈퇴 하시겠습니까 ?',
      callback: () => {
        if (state.click1 === true) {
          FethData()
        }
      }
    }))

  }

  //----------------
  useEffect(() => {
    if (globalState.profile.memId) {
      setMyMemId(globalState.profile.memId)
    }
    if(!(globalState.token.isLogin)) {history.push("/login")}
  }, [])

  const RegistMem = (e) => {
    const {value} = e.target
    if (value.length > 8) return
    setRegistMemId(value)
  }
  const NoneValidate = (e) => {
    if (state.click1 === false) {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: '내용확인 버튼을 클릭해주세요.'
      }))
    } else if (registMemId.length === 0) {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: 'UID를 입력해주세요.'
      }))
    }
  }

  //---------------
  return (
    <div id="secession">
      <Header position={'sticky'} title={'회원탈퇴'} type={'back'}/>
      <div className="subContent">
        <div className="exitWarn">
          <img src={WarnIcon} />
          <h2>회원 탈퇴 전에 꼭 확인해주세요!</h2>
        </div>
        <ul className="infoList dot">
          <li>회원 탈퇴 후 개인 정보 및 서비스 이용 내역은 모두 삭제됩니다.
            <ul className="infoList star">
              <li>회원 탈퇴와 동시에 회원가입 시에 기재한 모든 개인정보 및 서비스 이용 내역은 삭제되며, 복구는 불가합니다.</li>
              <li>단, 타 법령에 의해 수집 및 이용한 회원정보는 법령 준수기간 동안 보관됩니다.</li>
            </ul>
          </li>
          <li>탈퇴 후 회원이 기존에 보유한 아이템은 모두 소멸되며 복구되지 않습니다.</li>
          <li>약관에 의해 제재 중인 계정의 경우 즉시 탈퇴가 불가능 합니다. 별도로 문의 해주시기 바랍니다.
            <ul className="infoList star">
              <li>탈퇴 회원은 부정행위 방지를 위해 7일간 재가입이 불가합니다.</li>
              <li>탈퇴 후 7일이 지나 동일 로그인 ID로 재가입한 경우 이벤트성으로 제공되는 ' 달 ', ' 별 '은 지급되지 않습니다.</li>
            </ul>
          </li>
        </ul>

        <Checkbox
          title="위의 내용을 확인하였으며, 탈퇴에 동의합니다."
          fnChange={(v) => setState({click1: v})}
          checked={state.click1}
        />
        <div className="inputBox">
          <input placeholder="아이디 입력" onChange={RegistMem} />
          <p>회원님의 정보 보호를 위해<br/>UID를 재확인합니다.</p>
        </div>
        <ul className="infoList star">
          <li>UID는 ' 마이페이지 &gt; 프로필 설정 ' 페이지에서 확인 가능합니다.</li>
        </ul>
        <div className="btnBox">
          <button className='prevBtn' onClick={() => history.goBack()}>이전</button>
          {state.click1 === true && registMemId.length > 0 ? (
            <button className="submitBtn active" onClick={Validate}>
              회원탈퇴
            </button>
          ) : (
            <button className="submitBtn" onClick={NoneValidate}>
              회원탈퇴
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
export default Secession
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
