import React, { useState, useContext, useEffect, useReducer } from "react";
import { useHistory } from "react-router-dom";
import UtilityCommon from "common/utility/utilityCommon";

import {
  selfAuthCheck,
  getExchangeHistory,
  getExchangeCalc,
  exchangeApply,
  exchangeReApply,
  getExchangeSearchAccount,
  postExchangeAddAccount,
  postExchangeEditAccount,
  postExchangeDeleteAccount,
  getDalAutoExchange,
} from "common/api";

import { calcAge } from "lib/common_fn";

import ic_close from "../static/ic_close_round_g.svg";

import { Inspection } from "./subcontent/do_exchange_fn";

import MakeCalcContents from "./subcontent/do_exchange_calc";
import MakeRadioWrap from "./subcontent/do_exchange_radio_wrap";
import MakeFormWrap from "./subcontent/do_exchange_form";
import MakeRepplyWrap from "./subcontent/do_exchange_repply";
import MakeAddWrap from "./subcontent/do_exchange_add";
import AddPop from "./subcontent/do_exchange_add_pop";
import SettingPop from "./subcontent/do_exchange_setting_pop";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxAlertStatus} from "../../../../../../redux/actions/globalCtx";
type FormType = {
  byeolCnt: number;
  name: string;
  selectBank: number;
  account: string;
  fSocialNo: string;
  bSocialNo: string;
  phone: string;
  fAddress: string;
  bAddress: string;
  zoneCode: string;
  files: Array<any>;
  check: boolean;
  noUsage: boolean;
  consent: boolean;
};

type FormActionType = {
  type: string;
  val: any;
};

const FormDataReducer = (state: FormType, action: FormActionType) => {
  switch (action.type) {
    case "byeol":
      if (isNaN(action.val)) {
        return state;
      } else {
        return {
          ...state,
          byeolCnt: action.val,
        };
      }

    case "name":
      return {
        ...state,
        name: action.val,
      };
    case "bank":
      return {
        ...state,
        selectBank: action.val,
      };
    case "account":
      if (action.val.toString().length <= 20 && !isNaN(action.val)) {
        return {
          ...state,
          account: action.val,
        };
      } else {
        return state;
      }
    case "fSocial":
      if (action.val.length > 6 || isNaN(action.val)) {
        return state;
      } else {
        if (action.val.length === 6) {
          let currentDt;
          if (action.val[0] === "0" || action.val[0] === "1") {
            currentDt = "20" + action.val;
          } else {
            currentDt = "19" + action.val;
          }
          const age = calcAge(currentDt);
          if (age <= 15) {
            return {
              ...state,
              fSocialNo: action.val,
              noUsage: true,
            };
          } else {
            return {
              ...state,
              fSocialNo: action.val,
              noUsage: false,
            };
          }
        } else {
          return {
            ...state,
            fSocialNo: action.val,
          };
        }
      }
    case "bSocial":
      if (isNaN(action.val) || action.val.length > 7) {
        return state;
      } else {
        return {
          ...state,
          bSocialNo: action.val,
        };
      }
    case "phone":
      if (isNaN(action.val) || action.val.length > 15) {
        return state;
      } else {
        return {
          ...state,
          phone: action.val,
        };
      }
    case "fAddress":
      return {
        ...state,
        fAddress: action.val,
      };
    case "bAddress":
      return {
        ...state,
        bAddress: action.val,
      };
    case "zoneCode":
      return {
        ...state,
        zoneCode: action.val,
      };
    case "check":
      return {
        ...state,
        check: action.val,
      };
    case "file":
      return {
        ...state,
        files: action.val,
      };
    case "consent":
      return {
        ...state,
        consent: action.val,
      };
    default:
      throw new Error();
  }
};

const formInit = {
  byeolCnt: 0,
  name: "",
  selectBank: 0,
  account: "",
  fSocialNo: "",
  bSocialNo: "",
  phone: "",
  fAddress: "",
  bAddress: "",
  zoneCode: "",
  files: [false, false, false],
  check: false,
  noUsage: false,
  consent: false,
};

export default function DoExchange({ state, exchangeDispatch }) {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory();
  const [badgeSpecial, setBadgeSpecial] = useState<number>(0);
  const [currentByeol, setCurrentByeol] = useState<number>(0);
  const [exchangeCalc, setExchangeCalc] = useState({
    basicCash: 0, // ??????????????????
    benefitCash: 0, // ??????DJ??????
    taxCash: 0, // ??????????????????
    feeCash: 0, // ???????????????
    realCash: 0, // ??????????????????
  });
  const [exchangeHistory, setExchangeHistory] = useState({
    exist: false,
    value: {},
  });

  const [radioCheck, setRadioCheck] = useState<number>(0);
  const [formData, formDispatch] = useReducer(FormDataReducer, formInit);
  //???????????? ?????????  state
  const [addList, setAddList] = useState([]); // ???????????????????????????
  const [AddPopup, setAddPopup] = useState<boolean>(false); // ???????????? ??????(??????)
  const [SettingPopup, setSettingPopup] = useState(false);
  const [modifyInfo, setModifyInfo] = useState<any>(""); //???????????? ?????? fetch???
  const [addInfo, setAddInfo] = useState<any>(""); //????????? ?????? ?????? fetch???
  const [addBool, setAddBool] = useState<boolean>(false); //?????? ?????? ?????? ??????
  const [modiInfo, setModiInfo] = useState<any>(""); //????????????????????? ?????? ???????????? props ??????
  const [modiBool, setModiBool] = useState<boolean>(false); //?????? ?????? ?????? ??????
  const [recent, setRecent] = useState(""); //??????
  const [recentCheck, setRecentCheck] = useState<boolean>(false);
  const [recentInfo, setRecentInfo] = useState<any>("");
  const [deleteState, setDeleteState] = useState<any>("");
  const [popState, setPopState] = useState(1);

  const userProfile = (globalState.userProfile && globalState.userProfile) || {};
  const exchangeSubmit = async () => {
    const paramData = {
      byeol: formData.byeolCnt,
      accountName: formData.name,
      bankCode: formData.selectBank,
      accountNo: formData.account,
      socialNo: formData.fSocialNo + formData.bSocialNo,
      phoneNo: formData.phone,
      address1: formData.fAddress,
      address2: formData.bAddress,
      addFile1: formData.files[0].path,
      addFile2: formData.files[1].path,
      addFile3: formData.files[2] !== false ? formData.files[2].path : "",
      termsAgree: 1,
    };

    const res = await exchangeApply({ ...paramData });

    if (res.result === "success") {
      exchangeDispatch({ type: "result", value: { ...res.data } });
    } else {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        content: res.message,
      }));
    }
  };

  const repplySubmit = async () => {
    let paramData = {};
    if (recentInfo !== "") {
      paramData = {
        byeol: formData.byeolCnt,
        exchangeIdx: exchangeHistory.value["exchangeIdx"],
        accountName: recentInfo.accountName,
        accountNo: recentInfo.accountNo,
        bankCode: recentInfo.bankCode,
      };
    } else {
      paramData = {
        byeol: formData.byeolCnt,
        exchangeIdx: exchangeHistory.value["exchangeIdx"],
      };
    }

    const res = await exchangeReApply({ ...paramData });

    if (res.result === "success") {
      exchangeDispatch({ type: "result", value: { ...res.data } });
    } else {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        content: res.message,
      }));
    }
  };

  const checkInspection = (type: number) => {
    const result = Inspection({ state: formData, type: type, currentByeol: currentByeol });
    if (result["status"]) {
      if (type === 0) {
        exchangeSubmit();
      } else {
        repplySubmit();
      }
    } else {
      if (result.skip !== undefined && result.skip === true) {
      } else {
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          content: result["content"],
        }));
      }
    }
  };

  const fnExchangeCalc = async () => {
    if (formData.byeolCnt < 570) {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        content: "?????? ????????????\n570??? ??????????????? ?????????.",
      }));
    } else {
      const res = await getExchangeCalc({
        byeol: formData.byeolCnt,
      });

      if (res.result === "success") {
        setExchangeCalc({ ...res.data });
      }
    }
  };

  const handleChange = (e: string) => {
    const num = e.split(",").join("");
    if (!isNaN(parseInt(num))) {
      if (currentByeol < parseInt(num)) {
        formDispatch({ type: "byeol", val: currentByeol });
      } else {
        formDispatch({ type: "byeol", val: num });
      }
    } else {
      if (num === "") {
        formDispatch({ type: "byeol", val: 0 });
      }
    }
  };
  //???????????? ?????????
  async function fetchSearchAccount() {
    const res = await getExchangeSearchAccount({});
    const { result, data, message } = res;
    if (result === "success") {
      setAddList(data.list);
    } else {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        content: message,
      }));
    }
  }
  async function fetchAddAccount() {
    const res = await postExchangeAddAccount({
      accountName: addInfo.name,
      accountNo: addInfo.accountNumber,
      bankCode: addInfo.bank,
      bankName: addInfo.accountName,
    });
    const { result, data, message } = res;
    setAddBool(false);
    if (result === "success") {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        content: message,
      }));
    } else {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        content: message,
      }));
    }
  }
  async function fetchModiAccount() {
    const res = await postExchangeEditAccount({
      accountName: modiInfo.name,
      accountNo: modiInfo.accountNumber,
      bankCode: modiInfo.bank,
      bankName: modiInfo.accountName,
      beforeAccountNo: modiInfo.beforeAccount,
      idx: modiInfo.idx,
    });
    const { result, data, message } = res;
    setDeleteState("");
    setModiInfo("");
    setModiBool(false);
    if (result === "success") {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        content: message,
      }));
    } else {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        content: message,
      }));
    }
  }
  async function fetchDeleteAccount() {
    const res = await postExchangeDeleteAccount({
      idx: deleteState.modifyIdx,
      beforeAccountNo: deleteState.beforeAccount,
    });
    const { result, data, message } = res;
    setDeleteState("");
    setModiInfo("");
    setModiBool(false);
    if (result === "success") {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        content: message,
        callback: () => {
          setDeleteState("");
        },
      }));
    } else {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        content: message,
      }));
    }
  }
  useEffect(() => {
    if (!userProfile.hasOwnProperty("byeolCnt")) {
      history.goBack();
      return;
    }

    if (userProfile.byeolCnt > 0) {
      setCurrentByeol(userProfile.byeolCnt);
      formDispatch({ type: "byeol", val: userProfile.byeolCnt });
    }

    if (userProfile.badgeSpecial > 0) {
      setBadgeSpecial(userProfile.badgeSpecial);
    }

    async function fetchData() {
      const authCheck = await selfAuthCheck();

      if (authCheck.result === "success") {
        if (authCheck.data.parentsAgreeYn === "y") {
          formDispatch({ type: "consent", val: true });
        }
      }

      const res = await getExchangeHistory();
      if (res.result === "success") {
        setExchangeHistory({
          ...exchangeHistory,
          exist: true,
          value: { ...res.data },
        });

        setRadioCheck(1);
      }
    }
    fetchData();
    if (radioCheck === 2) {
      fetchSearchAccount();
    }

    const checkAutoState = async () => {
      const { result, data } = await getDalAutoExchange();
      if (result === "success") {
        setPopState(data.autoChange);
      }
    };
    checkAutoState();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (popState === 0) {
        setPopState(1);
      }
    }, 8000);
  }, [popState]);

  useEffect(() => {
    if (modiBool && modiInfo === "" && deleteState.state === true) {
      fetchDeleteAccount();
    } else if (modiBool && modiInfo !== "" && deleteState === "") {
      fetchModiAccount();
    } else if (addBool && !modiBool) {
      fetchAddAccount();
    } else if (radioCheck === 2) {
      fetchSearchAccount();
    }
  }, [radioCheck, addBool, modiBool]);
  useEffect(() => {
    if (recent !== "") {
      setRadioCheck(1);
      setRecentInfo(recent);
    }
  }, [recent]);
  return (
    <div
      className="doExchangeWrap"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="doExchangeWrap__header">
        <h1>????????????</h1>
      </div>
      <div className="doExchangeWrap__contents">
        <div>
          <div className="doExchangeWrap__contentsHeader">
            <div>?????? ??????</div>
            <div
              className="doExchangeWrap__contentsHeader--info"
              onClick={(e) => {
                exchangeDispatch({ type: "status", value: 1 });
              }}
            >
              <span>????????????</span>
              <span className="doExchangeWrap__contentsHeader--icon" />
            </div>
          </div>
          {badgeSpecial > 0 && (
            <div className="doExchangeWrap__special">
              <p className="doExchangeWrap__special--title">DJ?????? {UtilityCommon.eventDateCheck("20220501") ? "?????? DJ" : "????????? DJ"} ?????????.</p>
              <p className="doExchangeWrap__special--point">{UtilityCommon.eventDateCheck("20220501") ? "?????? DJ" : "????????? DJ"}??? ?????? ?????? ??????????????? 5% ?????? ?????????.</p>
            </div>
          )}
          <p className="doExchangeWrap__contentsHeader--notice">
            * ?????? 570??? ??????????????? ?????? ????????? ????????????, ??? 1?????? KRW 60?????? ???????????????.
          </p>
        </div>
        <div className="doExchangeWrap__star">
          <div className="doExchangeWrap__star--box">
            <div className="doExchangeWrap__star--icon" />
            <div>?????? ??? {Number(currentByeol).toLocaleString()}</div>
          </div>
          <div className="doExchangeWrap__star--input">
            <input value={Number(formData.byeolCnt).toLocaleString()} onChange={(e) => handleChange(e.target.value)} />
          </div>
        </div>
        {/* <button
          className={`doExchangeWrap__star--button ${exchangeCalc.basicCash <= 0 && "active"}`}
          onClick={() => {
            fnExchangeCalc();
          }}
        >
          ?????? ??????
        </button> */}
        <div className="btn__wrap">
          <button
            className={`doExchangeWrap__star--button ${exchangeCalc.basicCash <= 0 && "active"}`}
            onClick={() => {
              fnExchangeCalc();
            }}
          >
            ?????? ??????
          </button>
          <button
            className={`doExchangeWrap__star--button active`}
            onClick={() => {
              history.push("/modal/dalExchange");
            }}
          >
            ?????????
          </button>
          {/* <div className={`auto-exchange-pop ${popState === 0 ? "on" : "off"}`}>
            <p>
              ???????????? ???????????? ???????????????<br></br> ???????????? ????????? ??? ????????????.
            </p>
            <button
              className="close"
              onClick={() => {
                setPopState(1);
              }}
            >
              <img src={ic_close} alt="??????" />
            </button>
          </div> */}
        </div>

        {exchangeCalc.basicCash > 0 && <MakeCalcContents exchangeCalc={exchangeCalc} />}
        {exchangeHistory.exist === true && (
          <MakeRadioWrap
            radioCheck={radioCheck}
            handleEv={(prop) => {
              setRadioCheck(prop);
              setRecentCheck(false);
              setRecentInfo("");
            }}
          />
        )}
        <div className="doExchangeWrap__contentsHeader">
          {radioCheck === 1 ? "?????? ?????? ??????" : radioCheck === 2 ? "??? ?????? ??????" : "?????? ?????? ??????"}
          {radioCheck === 2 && (
            <button className="plusBtn" onClick={() => setAddPopup(true)}>
              ????????????
            </button>
          )}
        </div>
        {radioCheck === 0 && <MakeFormWrap state={formData} formDispatch={formDispatch} inspection={checkInspection} />}
        {radioCheck === 1 && (
          <MakeRepplyWrap
            state={exchangeHistory.value}
            inspection={checkInspection}
            recentCheck={recentCheck}
            recentInfo={recentInfo}
          />
        )}
        {radioCheck === 2 && (
          <MakeAddWrap
            addList={addList}
            setSettingPopup={setSettingPopup}
            setModifyInfo={setModifyInfo}
            setRecent={setRecent}
            setRecentCheck={setRecentCheck}
          />
        )}
        {AddPopup && <AddPop setAddPopup={setAddPopup} setAddInfo={setAddInfo} setAddBool={setAddBool} />}
        {SettingPopup && (
          <SettingPop
            setSettingPopup={setSettingPopup}
            modifyInfo={modifyInfo}
            setModiInfo={setModiInfo}
            setModiBool={setModiBool}
            setDeleteState={setDeleteState}
          />
        )}
      </div>
    </div>
  );
}
