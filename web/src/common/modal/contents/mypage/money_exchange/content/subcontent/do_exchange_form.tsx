import React, { useEffect, useReducer, useContext } from "react";
import { GlobalContext } from "context";

import { postImage } from "common/api";
import DalbitCheckbox from "common/ui/dalbit_checkbox";
import SelectBox from "common/ui/dalbit_selectbox";

type StateType = {
  isOpen: boolean;
  boxList: Array<{
    value: number;
    text: string;
  }>;
  selectIdx: number;
};

type ActionType = {
  type: string;
  idx?: number;
  val?: any;
};

const selectReducer = (state: StateType, action: ActionType) => {
  switch (action.type) {
    case "open":
      return {
        ...state,
        isOpen: action.val,
      };
    case "select":
      return {
        ...state,
        selectIdx: action.idx || 0,
        isOpen: false,
      };

    default:
      throw new Error();
  }
};

export default function MakeFormWrap({ state, dispatch, inspection }) {
  const [selectState, selectDispatch] = useReducer(selectReducer, initVal);
  const { globalAction } = useContext(GlobalContext);
  const searchAddr = (e) => {
    const element_layer: HTMLElement | null = document.getElementById("layer");

    new window["daum"].Postcode({
      oncomplete: (data) => {
        dispatch({ type: "fAddress", val: data.address });
        dispatch({ type: "zoneCode", val: data.zonecode });
        element_layer?.setAttribute("style", "display: none;");
      },
      width: "100%",
      height: "100%",
      maxSuggestItems: 5,
    }).embed(element_layer);

    initLayerPosition();
  };

  const initLayerPosition = () => {
    var width = 300; //우편번호서비스가 들어갈 element의 width
    var height = 500; //우편번호서비스가 들어갈 element의 height
    var borderWidth = 2; //샘플에서 사용하는 border의 두께
    const element_layer: HTMLElement | null = document.getElementById("layer");
    const closeBtn: HTMLElement | null = document.getElementById("layer__close");
    // 위에서 선언한 값들을 실제 element에 넣는다.
    element_layer?.setAttribute(
      "style",
      `
      display: block;
      height: ${height}px; border: ${borderWidth}px solid; left: ${((window.innerWidth || document.documentElement.clientWidth) -
        width) /
        2 -
        borderWidth}px; top: ${((window.innerHeight || document.documentElement.clientHeight) - height) / 2 - borderWidth}px`
    );

    closeBtn?.setAttribute(
      "style",
      `right: ${((window.innerWidth || document.documentElement.clientWidth) - width) / 2 -
        borderWidth -
        20}px; top: ${((window.innerHeight || document.documentElement.clientHeight) - height) / 2 - borderWidth}px;`
    );
  };

  const uploadSingleFile = (e, idx) => {
    const target = e.currentTarget;
    if (target.files.length === 0) return;
    let reader = new FileReader();
    const file = target.files[0];

    const fileName = file.name;

    const fileSplited = fileName.split(".");
    const fileExtension = fileSplited.pop().toLowerCase();
    //
    const extValidator = (ext) => {
      const list = ["jpg", "jpeg", "png", "PNG"];
      return list.includes(ext);
    };
    if (!extValidator(fileExtension)) {
      globalAction.setAlertStatus &&
        globalAction.setAlertStatus({
          status: true,
          content: "jpg, png 이미지만 사용 가능합니다.",
        });
      return;
    }
    reader.readAsDataURL(target.files[0]);
    reader.onload = async () => {
      if (reader.result) {
        const res = await postImage({
          dataURL: reader.result,
          uploadType: "exchange",
        });
        if (res.result === "success") {
          const arr = state.files.map((v, i) => {
            if (i === idx) {
              return { path: res.data.path, name: fileName };
            } else {
              return v;
            }
          });

          dispatch({ type: "file", val: arr });
        } else {
          globalAction.setAlertStatus &&
            globalAction.setAlertStatus({
              status: true,
              content: "사진 업로드에 실패하였습니다.\n다시 시도해주세요.",
            });
        }
      }
    };
  };

  useEffect(() => {
    dispatch({ type: "bank", val: bankList[selectState.selectIdx].value });
  }, [selectState.selectIdx]);

  useEffect(() => {
    if (state.fSocialNo.length === 6) {
      document.getElementById("bsocialNo")?.focus();
    }
  }, [state.fSocialNo]);
  const styling = {
    iconColor: "#828282",
    selectBordercolor: "#828282",
    selectFontColor: "#828282",
    optionCoutNumber: "680",
  };
  const validateName = (e, obj: any) => {
    if (e.target.value.length > 20) {
      return false;
    } else {
      dispatch(obj);
    }
  };
  return (
    <>
      <div id="layer">
        <button id="layer__close">X</button>
      </div>
      <div className="formData">
        <div className="formData__list">
          <div className="formData__title">예금주</div>
          <div className="formData__input">
            <input
              type="text"
              value={state.name}
              className="formData__input--text"
              onChange={(e) => validateName(e, { type: "name", val: e.target.value })}
            />
          </div>
        </div>

        <div className="formData__list">
          <div className="formData__title">은행</div>

          <div className={`${selectState.isOpen && "on"} formData__input formData__input--select`}>
            <div className="searchBox__select" style={{ height: "40px" }}>
              <SelectBox state={selectState} dispatch={selectDispatch} styling={styling} />
            </div>
          </div>
        </div>

        <div className="formData__list">
          <div className="formData__title">계좌번호</div>
          <div className="formData__input">
            <input
              type="tel"
              value={state.account}
              className="formData__input--text"
              onChange={(e) => dispatch({ type: "account", val: e.target.value })}
              placeholder="계좌번호를 입력해주세요 (숫자)"
            />
          </div>
        </div>
        <div className="formData__list">
          <div className="formData__title">주민등록번호</div>
          <div className="formData__input--nomber">
            <input
              type="tel"
              value={state.fSocialNo}
              className="formData__input--text"
              onChange={(e) => dispatch({ type: "fSocial", val: e.target.value })}
              placeholder="숫자만 입력"
            />
            <span className="formData__input--line">-</span>
            <input
              type="password"
              value={state.bSocialNo}
              id="bsocialNo"
              className="formData__input--text"
              onChange={(e) => dispatch({ type: "bSocial", val: e.target.value })}
              placeholder="숫자만 입력"
            />
          </div>
        </div>
        <div className="formData__list">
          <div className="formData__title">전화번호</div>
          <div className="formData__input">
            <input
              type="tel"
              value={state.phone}
              className="formData__input--text"
              onChange={(e) => dispatch({ type: "phone", val: e.target.value })}
              placeholder="-없이 숫자만 입력해주세요"
            />
          </div>
        </div>
        <div className="formData__list">
          <div className="formData__title">주소</div>
          <div className="formData__input">
            <div className="formData__address--list" onClick={(e) => searchAddr(e)}>
              <input type="text" className="formData__input--text adressBg" disabled={true} value={state.zoneCode} />
              <button className="formData__input--button" onClick={(e) => searchAddr(e)}>
                주소검색
              </button>
            </div>
            <div className="formData__address--list" onClick={(e) => searchAddr(e)}>
              <input
                type="text"
                value={state.fAddress}
                className="formData__input--text adressBg"
                disabled={true}
                placeholder="주소검색을 해주세요"
              />
            </div>
            <div className="formData__address--list">
              <input
                type="text"
                className="formData__input--text"
                placeholder="상세주소를 입력해주세요"
                onChange={(e) => {
                  dispatch({ type: "bAddress", val: e.target.value });
                }}
              />
            </div>
          </div>
        </div>
        <input type="file" onChange={(e) => uploadSingleFile(e, 0)} />
        <div className="formData__list">
          <div className="formData__title">신분증사본</div>
          <div className="formData__input--file">
            <label htmlFor="id-upload-text" className="formData__input--label">
              {state.files[0] !== false ? state.files[0].name : "신분증사본을 첨부해주세요"}
            </label>
            <input
              type="file"
              name="idcard"
              id="id-upload-text"
              className="formData__input--text"
              placeholder="신분증사본을 첨부해주세요"
              onChange={(e) => uploadSingleFile(e, 0)}
            />
            <label htmlFor="id-upload" className="formData__input--button">
              찾아보기
            </label>
            <input id="id-upload" name="idcard" type="file" onChange={(e) => uploadSingleFile(e, 0)} />
          </div>
        </div>
        <div className="formData__list">
          <div className="formData__title">통장사본</div>
          <div className="formData__input--file">
            <label htmlFor="bankbook-upload-text" className="formData__input--label">
              {state.files[1] !== false ? state.files[1].name : "통장사본을 첨부해주세요"}
            </label>

            <input
              type="file"
              name="bankbook"
              id="bankbook-upload-text"
              className="formData__input--text"
              placeholder="통장사본을 첨부해주세요"
              onChange={(e) => uploadSingleFile(e, 1)}
            />
            <label htmlFor="bankbook-upload" className="formData__input--button">
              찾아보기
            </label>
            <input id="bankbook-upload" name="bankbook" type="file" onChange={(e) => uploadSingleFile(e, 1)} />
          </div>
        </div>
        {state.consent && (
          <div className="formData__list formData__list__consent">
            <div className="formData__list__consent--file">
              <div className="formData__title">부모동의 사본</div>
              <div className="formData__input--file">
                <label htmlFor="consent-upload-text" className="formData__input--label">
                  {state.files[2] !== false ? state.files[2].name : "부모동의사본을 첨부해주세요"}
                </label>

                <input
                  type="file"
                  name="consent"
                  id="consent-upload-text"
                  className="formData__input--text"
                  placeholder="부모동의사본을 첨부해주세요"
                  onChange={(e) => uploadSingleFile(e, 2)}
                />
                <label htmlFor="consent-upload" className="formData__input--button">
                  찾아보기
                </label>
                <input id="consent-upload" name="consent" type="file" onChange={(e) => uploadSingleFile(e, 2)} />
              </div>
            </div>
            <div className="formData__list__consent--caption">
              <span>가족관계 증명서 또는 주민등록 등본 사본을 등록해주세요.</span>
              <span>*부모님의 주민번호 앞 6자리가 명확히 확인되어야 합니다.</span>
            </div>
          </div>
        )}
        <div className="privacy">
          <div className="privacy__title">
            <DalbitCheckbox status={state.check} callback={() => dispatch({ type: "check", val: !state.check })} />
            {/* <img src={state.check ? checkOn : checkOff} onClick={() => setCheck(!check)} className="privacy__checkBox" /> */}
            <span style={{ marginLeft: "10px" }}>개인정보 수집 및 이용에 동의합니다.</span>
          </div>
          <div className="privacy__text">
            회사는 환전의 목적으로 회원 동의 하에 관계 법령에서 정하는 바에 따라 개인정보를 수집할 수 있습니다. (수집된 개인정보는
            확인 후 폐기 처리합니다.)
          </div>
        </div>

        <button className="doChargeButton" onClick={() => inspection(0)}>
          환전 신청하기
        </button>
      </div>
    </>
  );
}

const bankList = [
  { text: "은행명", value: 0 },
  { text: "경남은행", value: 39 },
  { text: "광주은행", value: 34 },
  { text: "국민은행", value: 4 },
  { text: "기업은행", value: 3 },
  { text: "농협", value: 11 },
  { text: "대구은행", value: 31 },
  { text: "도이치은행", value: 55 },
  { text: "부산은행", value: 32 },
  { text: "비엔피파리바은행", value: 61 },
  { text: "산림조합중앙회", value: 64 },
  { text: "산업은행", value: 2 },
  { text: "저축은행", value: 50 },
  { text: "새마을금고중앙회", value: 45 },
  { text: "수출입은행", value: 8 },
  { text: "수협은행", value: 7 },
  { text: "신한은행", value: 88 },
  { text: "신협", value: 48 },
  { text: "우리은행", value: 20 },
  { text: "우체국", value: 71 },
  { text: "전북은행", value: 37 },
  { text: "제주은행", value: 35 },
  { text: "중국건설은행", value: 67 },
  { text: "중국공상은행", value: 62 },
  { text: "카카오뱅크", value: 90 },
  { text: "케이뱅크", value: 89 },
  { text: "펀드온라인코리아", value: 294 },
  { text: "한국씨티은행", value: 27 },
  { text: "BOA은행", value: 60 },
  { text: "HSBC은행", value: 54 },
  { text: "제이피모간체이스은행", value: 57 },
  { text: "하나은행", value: 81 },
  { text: "SC제일은행", value: 23 },
  { text: "NH투자증권", value: 247 },
  { text: "교보증권", value: 261 },
  { text: "대신증권", value: 267 },
  { text: "메리츠종합금융증권", value: 287 },
  { text: "미래에셋대우", value: 238 },
  { text: "부국증권", value: 290 },
  { text: "삼성증권", value: 240 },
  { text: "신영증권", value: 291 },
  { text: "신한금융투자", value: 278 },
  { text: "유안타증권", value: 209 },
  { text: "유진투자증권", value: 280 },
  { text: "이베스트투자증권", value: 265 },
  { text: "케이프투자증권", value: 292 },
  { text: "키움증권", value: 264 },
  { text: "하나금융투자", value: 270 },
  { text: "하이투자증권", value: 262 },
  { text: "한국투자증권", value: 243 },
  { text: "한화투자증권", value: 269 },
  { text: "현대차증권", value: 263 },
  { text: "DB금융투자", value: 279 },
  { text: "KB증권", value: 218 },
  { text: "KTB투자증권", value: 227 },
  { text: "SK증권", value: 266 },
];

const initVal = {
  isOpen: false,
  boxList: bankList,
  selectIdx: 0,
};
