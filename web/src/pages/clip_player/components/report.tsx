import React, { useState, useEffect, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
// constant
import { tabType } from "../constant";
// Api
import { postClipReport, MypageBlackListAdd } from "common/api";
import { DECLARATION_TAB } from "../constant";

import Caution from "../static/caution.png";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxAlertStatus, setGlobalCtxSetToastStatus} from "../../../redux/actions/globalCtx";
import {setClipCtxRightTabType} from "../../../redux/actions/clipCtx";

export default function Report() {

  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const clipState = useSelector(({clipCtx}) => clipCtx);
  const { clipInfo } = globalState;

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
    const { message, result, code } = await MypageBlackListAdd({
      memNo: globalState.clipInfo!.clipMemNo,
    });
    if (result === "success") {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        type: "alert",
        content: message,
        callback: () => {
          dispatch(setClipCtxRightTabType(tabType.PROFILE))
        },
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
    const { result, data, message } = await postClipReport({
      memNo: globalState.clipInfo?.clipMemNo,
      clipNo: globalState.clipInfo?.clipNo,
      reason: select,
      cont: reportReason,
    });
    if (result === "success") {
      dispatch(setGlobalCtxSetToastStatus({
        status: true,
        message: message,
      }));
      setTimeout(() => {
        dispatch(setClipCtxRightTabType(tabType.PROFILE))
      }, 500);
    } else {
      dispatch(setGlobalCtxSetToastStatus({
        status: true,
        message: message,
      }));
      setTimeout(() => {
        dispatch(setClipCtxRightTabType(tabType.PROFILE))
      }, 500);
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
      <div className="tabGiftGive">
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
                <span className="reportWrap__textareaCount">
                  <b>{reportReason.length}</b> / 100
                </span>
              </div>

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
              <div className="blackWrap noPadding">
                <div className="alertText">
                  <h2>{clipInfo?.nickName}</h2>
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
                    <button
                      className="btn btn_cancel"
                      onClick={() => {
                        dispatch(setClipCtxRightTabType(tabType.PROFILE))
                      }}
                    >
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
      </div>
    </>
  );
}
