import { mailChatEnter } from "common/api";
import {CHAT_CONFIG} from "../../constant/define";
import {isDesktop} from "../../lib/agent";
import {Hybrid, isHybrid} from "../../context/hybrid";
import {setGlobalCtxAlertStatus, setGlobalCtxMessage, setGlobalCtxUpdatePopup} from "../../redux/actions/globalCtx";
import {setMailBoxInfo} from "../../redux/actions/mailBox";

/* 우체통 */
export const goMail = ({dispatch, globalState, targetMemNo, targetMemLevel, history, isChatListPage=false}
:{dispatch?:any, globalState?:any, targetMemNo?:any, targetMemLevel?:any, history?:any, isChatListPage?:boolean}) => {

  if(isDesktop()) {
    const socketUser = {
      authToken: globalState.baseData.authToken,
      memNo: globalState.baseData.memNo,
      locale: CHAT_CONFIG.locale.ko_KR,
      roomNo: null,
    };

    if(isChatListPage) {
      openMailboxBanAlert({ userProfile: globalState.userProfile, dispatch, history });
    }else {
      globalState.mailChatInfo?.setUserInfo(socketUser);
      globalState.mailChatInfo?.privateChannelDisconnect();
      mailBoxJoin(targetMemNo, dispatch, history);
    }
  }else if (isHybrid()) {
    if(globalState.token.isLogin) {
      const myLevel = globalState.profile.level;
      if(myLevel === 0) {
        return dispatch(setGlobalCtxMessage({type:"alert",
          msg: '우체통은 1레벨부터 이용 가능합니다. \n 레벨업 후 이용해주세요.'
        }))
      }

      if(isChatListPage) {
        Hybrid('OpenMailBoxList', ''); // 메일 리스트 페이지
      }else {
        if(targetMemLevel > 0) {
          Hybrid('JoinMailBox', targetMemNo); // 채팅 페이지
        }else {
          return dispatch(setGlobalCtxMessage({type:"alert",
            msg: '0레벨 회원에게는 메시지를<br /> 보낼 수 없습니다.'
          }))
        }
      }
    }else {
      history.push('/login');
    }
  } else {
    dispatch(setGlobalCtxUpdatePopup({popup:['APPDOWN', 'appDownAlrt', 5]}));
  }
}

export function mailBoxJoin(memNo: string, dispatch: any, history: any, prevMemNo?: any) {
  const mailBoxEnter = async () => {
    const { result, data, message, code } = await mailChatEnter({
      memNo: memNo,
    });
    if (result === "success") {
      if (prevMemNo === memNo) {
        return false;
      } else {
        dispatch(setMailBoxInfo({ memNo: memNo, ...data }));
      }
      sessionStorage.setItem("chattingInfo", JSON.stringify({ memNo: memNo, chatNo: data.chatNo }));
      if (window.location.pathname.indexOf("chatting") !== 9) {
        history.push(`/mailbox/chatting/${data.chatNo}`);
      }
    } else {
      if (code === "-5") {
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          type: "alert",
          content: "<p style='letter-spacing:-0.8px;'>메시지는 1레벨부터 이용 가능합니다. <br /> 레벨업 후 이용해주세요.</p>",
        }));
      } else if (code === "-6") {
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          type: "alert",
          content: "<p style='letter-spacing:-0.8px;'>0레벨 회원에게는 메시지를<br /> 보낼 수 없습니다.</p>",
        }));
      } else {
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          type: "alert",
          content: message,
          callback: () => {
            history.goBack();
          },
        }));
      }
    }
  };
  mailBoxEnter();
}

export function openMailboxBanAlert(helper: any) {
  const { userProfile, dispatch, history } = helper;
  if (userProfile === null) {
    history.push("/login");
    return;
  }
  if (userProfile && !userProfile.level) {
    return (
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        type: "alert",
        content: "<p style='letter-spacing:-0.8px;'>메시지는 1레벨부터 이용 가능합니다. <br /> 레벨업 후 이용해주세요.</p>",
      }))
    );
  } else {
    history.push("/mailbox");
  }
}
