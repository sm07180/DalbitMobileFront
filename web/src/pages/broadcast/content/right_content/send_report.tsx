import React, { useState, useEffect, useContext } from "react";
// ctx
import { useHistory, useParams } from "react-router-dom";
// constant
import { tabType } from "../../constant";
// Api
import {postReportUser, MypageBlackListAdd, BroadBlackListAddKickOut} from "common/api";
import Caution from "../../static/caution.png";
import { DECLARATION_TAB } from "./constant";
import {useDispatch, useSelector} from "react-redux";
import {setBroadcastCtxRightTabType} from "../../../../redux/actions/broadcastCtx";
import {setGlobalCtxAlertStatus} from "../../../../redux/actions/globalCtx";
export default function Report(props: { roomNo: string; profile: any }) {
  const { roomNo, profile } = props;
  // ctx
  const dispatch = useDispatch();
  const broadcastState = useSelector(({broadcastCtx})=> broadcastCtx);
  const { userMemNo, userNickNm, roomInfo } = broadcastState;
  // state
  const [pageType, setPageType] = useState(1);
  const [select, setSelect] = useState<number>(0);
  const [active, setActive] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const history = useHistory();

  const BTNInfo = [
    {
      title: "프로필 사진",
      id: 1,
    },
    {
      title: "음란성",
      id: 2,
    },
    {
      title: "광고 및 상업성",
      id: 3,
    },
    {
      title: "욕설 및 비방성",
      id: 4,
    },
    {
      title: "기타",
      id: 5,
    },
  ];

  async function fetchDataBlock() {
    const { message, result, code } = await BroadBlackListAddKickOut({
      blockNo: userMemNo,
      roomNo: roomInfo?.roomNo || ''
    });
    if (result === "success") {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        type: "alert",
        content: message,
        callback: () => dispatch(setBroadcastCtxRightTabType(tabType.LISTENER)),
      }));
    } else if (code === "-3") {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        type: "alert",
        content: message,
      }));
    } else if (code === "C006") {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        content: "이미 차단회원으로 등록된\n회원입니다.",
      }));
    }
  }

  const handleSelectChange = (event) => {
    const value = event.target.value;

    if (value === "프로필 사진") {
      setSelect(1);
    } else if (value === "음란성") {
      setSelect(2);
    } else if (value === "광고 및 상업성") {
      setSelect(3);
    } else if (value === "욕설 및 비방성") {
      setSelect(4);
    } else if (value === "기타") {
      setSelect(5);
    }
  };
  const Reportmap = BTNInfo.map((live, index) => {
    const { title, id } = live;
    return (
      <button
        value={title}
        onClick={(event) => handleSelectChange(event)}
        className={select === id ? "reportList reportList--on" : "reportList"}
        key={index}
      >
        {title}
      </button>
    );
  });

  const tabChange = () => {
    if (pageType === DECLARATION_TAB.BLACK) {
      setPageType(DECLARATION_TAB.DECLARATION);
    } else {
      setPageType(DECLARATION_TAB.BLACK);
    }
  };

  async function reportUser() {
    const { result, data, message } = await postReportUser({
      memNo: userMemNo,
      reason: select,
      cont: reportReason,
    });
    if (result === "success") {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        type: "alert",
        content: `${userNickNm} 님을 신고하였습니다.`,
        callback: () => dispatch(setBroadcastCtxRightTabType(tabType.LISTENER)),
      }));
    } else {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        type: "alert",
        content: message,
        callback: () => dispatch(setBroadcastCtxRightTabType(tabType.LISTENER)),
      }));
    }
  }
  useEffect(() => {
    if (select !== 0 && select < 6) {
      setActive(true);
    }
  }, [select]);
  //
  const reportChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (value.length > 100) return;
    setReportReason(value);
  };
  const validateReport = () => {
    if (select === 0) {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        type: "alert",
        content: `신고 사유를 선택해주세요.`,
      }));
    }
    if (select !== 0 && reportReason.length < 10) {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        type: "alert",
        content: `신고 사유를 10자 이상 입력해주세요.`,
      }));
    }
  };

  return (
    <>
      <div className="reportWrap noPadding">
        <div className="blockButton">
          <button onClick={tabChange} className={pageType === DECLARATION_TAB.BLACK ? "on" : ""}>
            <i></i>차단하기
          </button>
          <button onClick={tabChange} className={pageType === DECLARATION_TAB.DECLARATION ? "on" : ""}>
            <i></i>신고하기
          </button>
        </div>
        {pageType === DECLARATION_TAB.DECLARATION ? (
          <div className="declarationWrap">
            {Reportmap}
            <div className="reportWrap__textareaWrap">
              <textarea
                value={reportReason}
                onChange={reportChange}
                className="reportWrap__textarea"
                placeholder="상세한 신고 내용을 기재해주세요.허위 신고는 제제 대상이 될 수 있습니다. (최하 10글자 이상)"
              />
            </div>
            <span className="reportWrap__textareaCount">
                <b>{reportReason.length}</b> / 100
              </span>
            <div className="btnWrap">
              {active === true && reportReason.length > 9 ? (
                <button
                  className="btn"
                  onClick={() =>
                    dispatch(setGlobalCtxAlertStatus({
                      status: true,
                      type: "confirm",
                      content: `정말 신고하시겠습니까?`,
                      callback: () => reportUser(),
                    }))
                  }
                >
                  확인
                </button>
              ) : (
                <button className="btn isDisable" onClick={validateReport}>
                  확인
                </button>
              )}
            </div>
          </div>
        ) : (
          pageType === DECLARATION_TAB.BLACK && (
            <div className="blackWrap">
              <div className="alertText">
                <h2>{userNickNm}</h2>
                <b>차단하시겠습니까?</b>

                <img src={Caution} />

                <span>
                  차단한 회원은 나의 방송이 보이지 않으며,
                  <br />
                  방송에 입장할 수 없습니다.
                </span>

                <p>
                  *차단한 회원은 마이페이지 &gt; 방송설정 &gt; 차단회원
                  <br /> 관리 페이지에서 확인할 수 있습니다.
                </p>

                <div className="btnWrap">
                  <button className="btn btn_cancel" onClick={() => dispatch(setBroadcastCtxRightTabType(tabType.LISTENER))}>
                    취소
                  </button>
                  <button className="btn btn_ok" onClick={fetchDataBlock}>
                    확인
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
}
