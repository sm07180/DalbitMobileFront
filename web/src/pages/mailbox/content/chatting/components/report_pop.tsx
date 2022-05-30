/**
 * @brief : mailbox/chatting/report_pop.tsx
 * @role : 메시지채팅 신고하기 및 차단 기능 팝업
 */
import React, { useContext, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
// api
import { postReportUser, MypageBlackListAdd } from "common/api";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxAlertStatus, setGlobalCtxSetToastStatus} from "../../../../../redux/actions/globalCtx";
//tab
let PROFILE_REPORT_TAB = {
  BLACK: 0,
  DECLARATION: 1,
};
export default (props) => {
  const history = useHistory();
  const { setReportPop, setPageType, pageType } = props;
  const dispatch = useDispatch();
  const mailboxState = useSelector(({mailBoxCtx}) => mailBoxCtx);
  const { mailNo } = useParams<{ mailNo: string }>();
  //state
  const [select, setSelect] = useState<number>(0);
  const [active, setActive] = useState(false);
  const [reportReason, setReportReason] = useState("");
  //-----------------------------------------------------
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
  //셀렉트function-----------------------------------
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
  //-------------------------------------------------------
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
    if (pageType === PROFILE_REPORT_TAB.BLACK) {
      setPageType(PROFILE_REPORT_TAB.DECLARATION);
    } else {
      setPageType(PROFILE_REPORT_TAB.BLACK);
    }
  };
  async function fetchData() {
    const { result } = await postReportUser({
      memNo: mailboxState.mailboxInfo?.memNo,
      reason: select,
      cont: reportReason,
    });
    if (result === "success") {
      dispatch(setGlobalCtxSetToastStatus({
        status: true,
        message: `${mailboxState.mailboxInfo?.title}님을 신고하였습니다.`,
      }));
      closePopup();
    } else {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        type: "alert",
        content: `이미 신고한 회원 입니다.`,
        callback: () => closePopup(),
      }));
    }
  }
  const SubmitClick = () => {
    fetchData();
  };
  const reportChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (value.length > 100) return;
    setReportReason(value);
  };
  async function fetchDataBlock() {
    const { message, result, code } = await MypageBlackListAdd({
      memNo: mailboxState.mailboxInfo?.memNo!,
      chatNo: mailNo,
    });
    if (result === "success") {
      dispatch(setGlobalCtxSetToastStatus({
        status: true,
        message: message,
      }));
      history.goBack();
    } else if (code === "-3") {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        type: "alert",
        content: message,
        callback: () => closePopup(),
      }));
    } else if (code === "C006") {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        content: "이미 차단회원으로 등록된\n회원입니다.",
        callback: () => closePopup(),
      }));
    }
  }
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
  const closePopup = () => {
    setReportPop(false);
  };
  const closePopupDim = (e) => {
    const target = e.target;
    if (target.id === "layerPopup") {
      closePopup();
    }
  };
  useEffect(() => {
    if (select !== 0 && select < 6) {
      setActive(true);
    }
  }, [select]);
  return (
    <div id="layerPopup" onClick={closePopupDim}>
      <div className="layerContainer noPadding">
        <div className="layerContent">
          <div className="userReportWrap">
            <div className="blockButton">
              <button onClick={tabChange} className={pageType === PROFILE_REPORT_TAB.BLACK ? "on" : ""}>
                <i></i>차단하기
              </button>
              <button onClick={tabChange} className={pageType === PROFILE_REPORT_TAB.DECLARATION ? "on" : ""}>
                <i></i>신고하기
              </button>
            </div>
            {pageType === PROFILE_REPORT_TAB.DECLARATION ? (
              <div className="declarationWrap">
                {Reportmap}
                <div className="userReportWrap__textareaWrap">
                  <textarea
                    value={reportReason}
                    onChange={reportChange}
                    className="userReportWrap__textarea"
                    placeholder="상세한 신고 내용을 기재해주세요.허위 신고는 제제 대상이 될 수 있습니다. (최하 10글자 이상)"
                  />
                </div>
                <span className="userReportWrap__textareaCount">
                  <b>{reportReason.length}</b> / 100
                </span>

                <div className="buttonWrap">
                  <button className="SubmitReport SubmitReport__cancel" onClick={closePopup}>
                    취소
                  </button>
                  {active === true && reportReason.length > 9 ? (
                    <button className="SubmitReport SubmitReport--on" onClick={() => SubmitClick()}>
                      확인
                    </button>
                  ) : (
                    <button className="SubmitReport" onClick={validateReport}>
                      확인
                    </button>
                  )}
                </div>
              </div>
            ) : (
              pageType === PROFILE_REPORT_TAB.BLACK && (
                <div className="blackWrap">
                  <div className="alertText">
                    <h2>{mailboxState.mailboxInfo?.targetNickNm}</h2>
                    <b>차단하시겠습니까?</b>

                    <img src={"https://image.dallalive.com/svg/ico_caution.svg"} />

                    <span>
                      차단한 회원은 나의 방송이 보이지 않으며,
                      <br />
                      방송에 입장할 수 없습니다.
                    </span>

                    <p>
                      *차단한 회원은 마이페이지 &gt; 방송설정 &gt; 차단회원
                      <br /> 관리 페이지에서 확인할 수 있습니다.
                    </p>

                    <div className="buttonWrap">
                      <button onClick={closePopup}>취소</button>
                      <button onClick={fetchDataBlock}>확인</button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
          <button className="btnClose" onClick={closePopup}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
