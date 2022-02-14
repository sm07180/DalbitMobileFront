// tab navigation
import React, { useContext, useState, useEffect } from "react";
import { ModalContext } from "context/modal_ctx";
import { GlobalContext } from "context";
import { useHistory, useParams } from "react-router-dom";
// api
import { postReportUser, MypageBlackListAdd } from "common/api";
import { PROFILE_REPORT_TAB } from "./constant";
import Caution from "../../static/caution.png";
import "./mypage_modal.scss";
import { profile } from "console";

export default (props) => {
  const { modalState, modalAction } = useContext(ModalContext);
  const { globalState, globalAction } = useContext(GlobalContext);
  //state
  const [select, setSelect] = useState<number>(0);
  const [pageType, setPageType] = useState(1);
  const [active, setActive] = useState(false);
  const [reportInfo, setReportInfo] = useState<any>([]);
  const [reportReason, setReportReason] = useState("");
  const history = useHistory();

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
  const ClearReport = () => {
    history.goBack();
  };

  const tabChange = () => {
    if (pageType === PROFILE_REPORT_TAB.BLACK) {
      setPageType(PROFILE_REPORT_TAB.DECLARATION);
    } else {
      setPageType(PROFILE_REPORT_TAB.BLACK);
    }
  };

  async function fetchData() {
    const { result, data } = await postReportUser({
      memNo: modalState.mypageYourMem,
      reason: select,
      cont: reportReason,
    });
    if (result === "success") {
      globalAction.setAlertStatus;
      globalAction.setAlertStatus &&
        globalAction.setAlertStatus({
          status: true,
          type: "alert",
          content: `${reportInfo.nickNm}님을 신고하였습니다.`,
          callback: () => history.goBack(),
        });
    } else {
      globalAction.setAlertStatus;
      globalAction.setAlertStatus &&
        globalAction.setAlertStatus({
          status: true,
          type: "alert",
          content: `이미 신고한 회원 입니다.`,
          // callback: () => history.goBack(),
          callback: () => history.goBack(),
        });
    }
  }
  const SubmitClick = () => {
    fetchData();
  };
  //
  const reportChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (value.length > 100) return;
    setReportReason(value);
  };

  async function fetchDataBlock() {
    const { message, result, code } = await MypageBlackListAdd({
      memNo: reportInfo.memNo,
    });
    if (result === "success") {
      globalAction.setAlertStatus!({
        status: true,
        type: "alert",
        content: message,
        callback: () => history.goBack(),
      });
    } else if (code === "-3") {
      globalAction.setAlertStatus &&
        globalAction.setAlertStatus({
          status: true,
          type: "alert",
          content: message,
          callback: () => history.goBack(),
        });
    } else if (code === "C006") {
      globalAction.setAlertStatus &&
        globalAction.setAlertStatus({
          status: true,
          content: "이미 차단회원으로 등록된\n회원입니다.",
          callback: () => history.goBack(),
        });
    }
  }

  //
  const validateReport = () => {
    if (select === 0) {
      globalAction.setAlertStatus!({
        status: true,
        type: "alert",
        content: `신고 사유를 선택해주세요.`,
      });
    }
    if (select !== 0 && reportReason.length < 10) {
      globalAction.setAlertStatus!({
        status: true,
        type: "alert",
        content: `신고 사유를 10자 이상 입력해주세요.`,
      });
    }
  };

  useEffect(() => {
    if (select !== 0 && select < 6) {
      setActive(true);
    }
  }, [select]);
  useEffect(() => {
    setReportInfo(modalState.mypageInfo);
  }, []);

  return (
    <div className="fanlist-modal" onClick={(e) => e.stopPropagation()}>
      <button className="closeBtn" onClick={() => history.goBack()}>
        팝업창 닫기
      </button>
      <div className="myModalWrap black">
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
              <button className="SubmitReport SubmitReport__cancel" onClick={ClearReport}>
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
                <h2>{reportInfo.nickNm}</h2>
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

                <div className="buttonWrap">
                  <button onClick={() => history.goBack()}>취소</button>
                  <button onClick={fetchDataBlock}>확인</button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
