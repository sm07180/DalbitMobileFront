import React, {useCallback, useEffect} from 'react';

import Api from 'context/api';
import '../../style.scss';
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
  setProfileData
} from "redux/actions/profile";
import {goMail} from "common/mailbox/mail_func";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const MorePopup = (props) => {
  const {profileData, openSlidePop, closePopupAction} = props;
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory();

  /* 메시지 이동 */
  const goMailAction = () => {
    const goMailParams = {
      dispatch,
      globalState,
      targetMemNo: profileData.memNo,
      history,
      targetMemLevel: profileData.level
    }
    goMail(goMailParams);
    closePopupAction();
  }

  /* 방송시작 알림 설정 api */
  const editAlarms = useCallback((title, msg, isReceive) => {
    const editAlarmParams = {
      memNo: profileData.memNo,
      isReceive
    }
    Api.editPushMembers(editAlarmParams).then(res => {
      if (res.result === 'success') {
        dispatch(setProfileData({
          ...profileData,
          isReceive
        }))
        dispatch(setGlobalCtxMessage({type:'alert',title, msg, callback:undefined}))
      } else {
        dispatch(setGlobalCtxMessage({type:'alert',msg: res.message, callback:undefined}))
      }
    });
  }, [profileData.memNo, profileData.isReceive])

  /* 방송시작 알림 설정 */
  const editAlarm = useCallback(() => {
    const isReceive = profileData.isReceive;
    closePopupAction();
    if(isReceive) {
      dispatch(setGlobalCtxMessage({type:'confirm',
        msg: `선택한 회원의 방송 알림 설정을<br/>해제 하시겠습니까?`,
        callback: () => {
          editAlarms('', '설정해제가 완료되었습니다.', !isReceive)
        }
      }))
    }else {
      dispatch(setGlobalCtxMessage({type:'confirm',
        title: '알림받기 설정',
        msg: `팬으로 등록하지 않아도 🔔알림받기를 설정하면 방송시작에 대한 알림 메시지를 받을 수 있습니다.`,
        buttonText: {right: '설정하기'},
        callback: () => {
          editAlarms(
            '방송 알림 설정을 완료하였습니다',
            `마이페이지 > 서비스 설정 ><br/> [알림설정 관리]에서 설정한 회원을<br/> 확인하고 삭제 할 수 있습니다.`,
            !isReceive
          )
        }
      }))
    }
  },[profileData.memNo, profileData.isReceive])

  return (
    <section className="profileMore">
      <div className="moreList" onClick={goMailAction}>메세지</div>
      {!profileData.isFan && <div className="moreList" onClick={editAlarm}>방송 알림 {profileData.isReceive ? 'OFF' : 'ON'}</div>}
      <div className="moreList" data-target-type="block"
           onClick={openSlidePop}>차단/신고</div>
    </section>
  )
}

export default MorePopup;
