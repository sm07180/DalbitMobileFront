import { mailChatEnter } from "common/api";
import {CHAT_CONFIG} from "../../constant/define";
import {isDesktop} from "../../lib/agent";
import {Hybrid, isHybrid} from "../../context/hybrid";

/* 메시지 */
export const goMail = ({context, mailboxAction, targetMemNo, targetMemLevel, history, isChatListPage=false}) => {
  const { globalState, globalAction } = context;

  if(isDesktop()) {
    const socketUser = {
      authToken: globalState.baseData.authToken,
      memNo: globalState.baseData.memNo,
      locale: CHAT_CONFIG.locale.ko_KR,
      roomNo: null,
    };

    if(isChatListPage) {
      openMailboxBanAlert({ userProfile: globalState.userProfile, globalAction, history });
    }else {
      globalState.mailChatInfo?.setUserInfo(socketUser);
      globalState.mailChatInfo?.privateChannelDisconnect();
      mailBoxJoin(targetMemNo, mailboxAction, globalAction, history);
    }
  }else if (isHybrid()) {
    if(context.token.isLogin) {
      const myLevel = context.profile.level;
      if(myLevel === 0) {
        return context.action.alert({
          msg: '메시지은 1레벨부터 이용 가능합니다. \n 레벨업 후 이용해주세요.'
        })
      }

      if(isChatListPage) {
        Hybrid('OpenMailBoxList', ''); // 메일 리스트 페이지
      }else {
        if(targetMemLevel > 0) {
          Hybrid('JoinMailBox', targetMemNo); // 채팅 페이지
        }else {
          return context.action.alert({
            msg: '0레벨 회원에게는 메시지를<br /> 보낼 수 없습니다.'
          })
        }
      }
    }else {
      history.push('/login');
    }
  } else {
    context.action.updatePopup('APPDOWN', 'appDownAlrt', 5)
  }
}

export function mailBoxJoin(memNo: string, mailboxAction: any, globalAction: any, history: any, prevMemNo?: any) {
  const mailBoxEnter = async () => {
    const { result, data, message, code } = await mailChatEnter({
      memNo: memNo,
    });
    if (result === "success") {
      if (prevMemNo === memNo) {
        return false;
      } else {
        mailboxAction.setMailboxInfo({ memNo: memNo, ...data });
      }
      sessionStorage.setItem("chattingInfo", JSON.stringify({ memNo: memNo, chatNo: data.chatNo }));
      if (window.location.pathname.indexOf("chatting") !== 9) {
        history.push(`/mailbox/chatting/${data.chatNo}`);
      }
    } else {
      if (code === "-5") {
        globalAction.setAlertStatus!({
          status: true,
          type: "alert",
          content: "<p style='letter-spacing:-0.8px;'>메시지은 1레벨부터 이용 가능합니다. <br /> 레벨업 후 이용해주세요.</p>",
        });
      } else if (code === "-6") {
        globalAction.setAlertStatus!({
          status: true,
          type: "alert",
          content: "<p style='letter-spacing:-0.8px;'>0레벨 회원에게는 메시지를<br /> 보낼 수 없습니다.</p>",
        });
      } else {
        globalAction.setAlertStatus!({
          status: true,
          type: "alert",
          content: message,
          callback: () => {
            history.goBack();
          },
        });
      }
    }
  };
  mailBoxEnter();
}

export function openMailboxBanAlert(helper: any) {
  const { userProfile, globalAction, history } = helper;
  if (userProfile === null) {
    history.push("/login");
    return;
  }
  if (userProfile && !userProfile.level) {
    return (
      globalAction.setAlertStatus &&
      globalAction.setAlertStatus({
        status: true,
        type: "alert",
        content: "<p style='letter-spacing:-0.8px;'>메시지는 1레벨부터 이용 가능합니다. <br /> 레벨업 후 이용해주세요.</p>",
      })
    );
  } else {
    history.push("/mailbox");
  }
}

// export function updateMailboxList(mailboxAction: any, globalAction: any) {
//   const getMailboxList = async () => {
//     const { result, data, message } = await getMailboxChatList({
//       page: 1,
//       records: 20,
//     });
//     if (result === "success") {
//       if (location.pathname === "/mailbox") {
//         mailboxAction.dispathChatList!({ type: "init", data: data.list });
//       }
//     } else {
//       globalAction.setAlertStatus &&
//         globalAction.setAlertStatus({
//           status: true,
//           type: "alert",
//           content: message,
//         });
//     }
//   };
//   getMailboxList();
// }
