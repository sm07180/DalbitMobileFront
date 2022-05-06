import React, { useEffect, useState, useReducer, useContext } from "react";
// import DatePicker from "./datepicker";
import { postEditProfile } from "common/api";

// Calendar
import moment from "moment";
import Calendar from "react-calendar";
// css
//import "react-calendar/dist/Calendar.css";
import "../../../asset/scss/module/calendar.scss";

import IcoFemale from "../static/ico_female.svg";
import IcoMale from "../static/ico_male.svg";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxSetToastStatus, setGlobalCtxUserProfile} from "../../../redux/actions/globalCtx";

const formInit = {
  birth: "20200101",
  gender: "n",
};

const FormDataReducer = (state, action) => {
  switch (action.type) {
    case "birth":
      return {
        ...state,
        birth: action.value,
      };
    case "gender":
      return {
        ...state,
        gender: action.value,
      };
    default:
      break;
  }
};

export default (props) => {
  const { setInputPopup } = props;

  //context
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const [formData, formDispatch] = useReducer(FormDataReducer, formInit);
  const [showCalendar, setShowCalendar] = useState(false);

  const [validate, setValidate] = useState(false);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const closePopupDim = (e) => {
    const target = e.target;
    if (target.id === "layerPopup") {
      closePopup();
    }
  };

  const closePopup = () => {
    setInputPopup(false);
  };
  const handleSaveBtn = () => {
    let myBirth = formData.birth.slice(0, 4);
    const baseYear = new Date().getFullYear() - 11;

    if (formData.birth === "20200101" || myBirth > baseYear) {
      return dispatch(setGlobalCtxSetToastStatus({
        status: true,
        message: "생년월일을 정확하게 입력해주세요",
      }));
    }

    if (formData.gender === "n")
      return dispatch(setGlobalCtxSetToastStatus({
        status: true,
        message: "성별을 선택해주세요",
      }));

    const saveProfile = async () => {
      const res = await postEditProfile({
        gender: formData.gender,
        birth: formData.birth,
        nickNm: globalState.userProfile && globalState.userProfile.nickNm,
        profMsg: globalState.userProfile && globalState.userProfile.profMsg,
        profImg: globalState.userProfile && globalState.userProfile.profImg.path,
      });
      if (res.result === "success") {
        dispatch(setGlobalCtxUserProfile(res.data));
        dispatch(setGlobalCtxSetToastStatus({
          status: true,
          message: "회원정보가 변경되었습니다.",
        }));
        closePopup();
      } else {
        dispatch(setGlobalCtxSetToastStatus({
          status: true,
          message: res.message,
        }));
      }
    };
    saveProfile();
  };

  const genderChange = (gender) => {
    formDispatch({ type: "gender", value: gender });
  };

  const onChangeBirth = (date) => {
    date = moment(date).format("YYYYMMDD");
    formDispatch({ type: "birth", value: date });
  };

  useEffect(() => {
    console.log("formData", formData);
    let myBirth = formData.birth.slice(0, 4);
    const baseYear = new Date().getFullYear() - 11;
    if (myBirth <= baseYear && formData.gender !== "n") {
      setValidate(true);
    }
  }, [formData]);

  return (
    <div id="layerPopup" onClick={closePopupDim}>
      <div className="layerContainer isGray">
        <h3>추가정보 등록</h3>
        <div className="layerContent">
          <p className="input__text">
            정상적인 서비스 이용을 위해 <br />
            생년월일과 성별을 입력해주세요.
          </p>
          <p className="input__guide-text">
            입력 후 변경은 불가능하니 <br />
            신중하게 입력 부탁드립니다.
          </p>

          <div className="input__birth">
            <label htmlFor="birth">생년월일</label>
            {/* <DatePicker id="birth" name="birth" change={birthChange} /> */}
            <div className="dateInputWrap">
              {showCalendar && (
                <div className="pickerBox">
                  <Calendar onChange={onChangeBirth} selctRange={false} maxDate={new Date()} />
                  <button
                    className="btnDatePicker"
                    onClick={() => {
                      setShowCalendar(false);
                    }}
                  >
                    확인
                  </button>
                </div>
              )}
              <div
                className={`dateInput`}
                onClick={() => {
                  setShowCalendar(true);
                }}
              >
                {moment(formData.birth).format("YYYY.MM.DD")}
              </div>
            </div>
            <Calendar />
          </div>

          <div className="input__gender">
            <button
              className={`male ${formData.gender === "n" ? "first" : formData.gender === "m" ? "on" : "off"}`}
              value="m"
              onClick={(e) => {
                genderChange(e.currentTarget.value);
              }}
            >
              남자
              <img
                src={IcoMale}
                onClick={(e) => {
                  e.stopPropagation();
                  genderChange(e.currentTarget.parentNode![0].value);
                }}
              />
            </button>
            <button
              className={`female ${formData.gender === "n" ? "first" : formData.gender === "f" ? "on" : "off"}`}
              value="f"
              onClick={(e) => {
                genderChange(e.currentTarget.value);
              }}
            >
              여자
              <img
                src={IcoFemale}
                onClick={(e) => {
                  e.stopPropagation();
                  genderChange(e.currentTarget.parentNode![0].value);
                }}
              />
            </button>
          </div>
          <div className="btnWrap">
            <button
              className={`btn-ok ${validate ? "on" : "off"}`}
              onClick={() => {
                handleSaveBtn();
              }}
            >
              저장하기
            </button>
          </div>
        </div>

        <button className="btnClose" onClick={closePopup}>
          닫기
        </button>
      </div>
    </div>
  );
};
