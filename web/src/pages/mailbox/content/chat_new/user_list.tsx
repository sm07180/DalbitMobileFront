import React from "react";
import {useHistory} from "react-router-dom";

//Common
import {printNumber, settingAlarmTime} from "lib/common_fn";
import {mailBoxJoin} from "common/mailbox/mail_func";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxSetToastStatus} from "../../../../redux/actions/globalCtx";

export default function userList() {
  const history = useHistory();
  const dispatch = useDispatch();
  const mailboxState = useSelector(({mailBoxCtx}) => mailBoxCtx);
  const { chatTargetData } = mailboxState;

  return (
    <ul>
      {chatTargetData?.list.map((item, index) => {
        const { memNo, nickNm, profImg, giftedByeol, listenTime, lastListenTs, isMailboxOn } = item;
        return (
          <li
            className="userListItem"
            key={index}
            onClick={() => {
              if (isMailboxOn) {
                mailBoxJoin(memNo, dispatch, history);
              } else {
                dispatch(setGlobalCtxSetToastStatus({
                  status: true,
                  message: "상대방이 메시지 기능을 사용하지 않는 상태이므로 대화가 불가능합니다.",
                }));
              }
            }}
          >
            <div className="thumb">
              <img src={profImg.thumb62x62} alt={nickNm} />
            </div>
            <div className="info">
              <p className="info__nick">
                <img src="https://image.dallalive.com/mailbox/ico_female.svg" alt="female" />
                {nickNm}
              </p>
              <div className="info__state">
                <span>
                  <img src="https://image.dallalive.com/mailbox/ico_follow_yellow_m.svg" alt="star" />
                  {printNumber(giftedByeol)}
                </span>

                <span>
                  <img src="https://image.dallalive.com/mailbox/ico_time_g_s.svg" alt="time" />
                  {printNumber(listenTime)}
                </span>

                <span>
                  <img src="https://image.dallalive.com/mailbox/ico_visit_g_s.svg" alt="visit" />
                  {settingAlarmTime(lastListenTs)}
                </span>
              </div>
            </div>
            <button className="addBtn">
              {isMailboxOn ? (
                <img src="https://image.dallalive.com/mailbox/ico_notice_yellow.svg" alt="chat" />
              ) : (
                <img src="https://image.dallalive.com/svg/ico_notice_yellow_off.svg" alt="chat" />
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
