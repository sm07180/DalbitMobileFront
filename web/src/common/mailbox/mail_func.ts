import { mailChatEnter, checkIsMailboxNew, getMailboxChatList } from "common/api";
import {useDispatch} from "react-redux";
import {setMailBoxInfo, setMailBoxUserCount} from "../../redux/actions/mailBox";

export function mailBoxJoin(memNo: string, dispatch: any, globalAction: any, history: any, prevMemNo?: any) {
  const mailBoxEnter = async () => {
    const { result, data, message, code } = await mailChatEnter({
      memNo: memNo,
    });
    if (result === "success") {
      if (prevMemNo === memNo) {
        return false;
      } else {
        dispatch(setMailBoxInfo({ memNo: memNo, ...data }))
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
          content: "<p style='letter-spacing:-0.8px;'>우체통은 1레벨부터 이용 가능합니다. <br /> 레벨업 후 이용해주세요.</p>",
        });
      } else if (code === "-6") {
        globalAction.setAlertStatus!({
          status: true,
          type: "alert",
          content: "<p style='letter-spacing:-0.8px;'>0레벨 회원에게는 우체통 메시지를<br /> 보낼 수 없습니다.</p>",
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
        content: "<p style='letter-spacing:-0.8px;'>우체통은 1레벨부터 이용 가능합니다. <br /> 레벨업 후 이용해주세요.</p>",
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
