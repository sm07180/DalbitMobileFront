/**
 * @files login/login_form.tsx
 * @brief 로그인 폼
 */
import { SOCIAL_URL } from "constant/define";
import React, { useCallback, useContext, useState } from "react";
import appleLogo from "../static/apple_logo.svg";
import facebookLogo from "../static/facebook_logo.svg";
import googleLogo from "../static/google_logo.svg";
import kakaoLogo from "../static/kakao_logo.svg";
import naverLogo from "../static/naver_logo.svg";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxAlertStatus} from "../../../redux/actions/globalCtx";

//props type
type FormProps = {
  onSubmit: (form: { id: string; password: string }) => void;
};
export default function login_form({ onSubmit }: FormProps) {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx})=> globalCtx);
  const { baseData } = globalState;

  const [check, setCheck] = useState<boolean>(false);

  const changeCheckStatus = useCallback(() => {
    const checked = check === true ? false : true;
    setCheck(checked);
  }, [check]);
  //initialState
  const [form, setForm] = useState({
    id: "",
    password: "",
  });
  const { id, password } = form;
  //onChangeFunction
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    //id에 숫자만 입력가능한 정규식 및 로직
    const numberRestrict = /^[0-9\b]+$/;
    //띄어쓰기 입력불가
    const blank_pattern = /\s/gi;
    if (name === "id" && (e.target.value == "" || numberRestrict.test(e.target.value))) {
      setForm({
        ...form,
        [name]: value,
      });
    } else if (name === "password" && (e.target.value == "" || e.target.value.replace(blank_pattern, ""))) {
      setForm({
        ...form,
        [name]: value.toLowerCase(),
      });
    }
  };
  //onSubmitFunction
  const LoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!globalState.alertStatus.status) {
      if ((form.id === "" || form.id.length === 0) && (form.password === "" || form.password.length === 0)) {
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          content: "아이디(전화번호)와 비밀번호를 입력하고 다시 로그인해주세요.",
        }));
      } else if (form.id === "" || form.id.length === 0) {
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          content: "아이디(전화번호)를 입력하고 다시 로그인해주세요.",
        }));
      } else if (form.password === "" || form.password.length === 0) {
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          content: "비밀번호를 입력하고 다시 로그인해주세요.",
        }));
      } else {
        onSubmit(form);
        setForm({
          id: "",
          password: "",
        });
      }
    }
  };
  //fetch Login

  //social login
  const fetchSocialData = async (vendor: string) => {
    const res = await fetch(`${SOCIAL_URL}/${vendor}`, {
      method: "get",
      headers: {
        authToken: baseData.authToken || "",
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
      },
    });

    if (res.status === 200) {
      const redirectUrl = await res.text();
      return (window.location.href = `${redirectUrl}`);
    }
  };

  return (
    <>
      <div className="modal_login">
        <div className="loginForm" onClick={(e) => e.stopPropagation()}>
          <div className="loginForm__logo">
            <img src="https://image.dalbitlive.com/images/api/logo_p_l.png"></img>
          </div>
          <form onSubmit={LoginSubmit}>
            <input
              type="text"
              name="id"
              value={id}
              onChange={onChange}
              autoComplete="off"
              maxLength={11}
              placeholder="-를 제외한 전화번호를 입력하세요."
              className="loginForm__input"
            />

            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              autoComplete="off"
              maxLength={20}
              placeholder="비밀번호를 입력하세요."
              className="loginForm__input"
            />
            <button type="submit" className="loginForm__button">
              로그인
            </button>
          </form>

          <div className="loginToolBox">
            {/* <div className="loginAuto">
              <label>
                <Checkbox status={check} callback={changeCheckStatus} />
                <span>로그인 유지</span>
              </label>
            </div> */}

            <div className="loginLink">
              {baseData.isLogin === true && (
                <a href={`/password`} className="loginLink__item">
                  비밀번호 변경
                </a>
              )}
              <a href={`/signup`} className="loginLink__item">
                회원가입
              </a>
              <a href={`/customer/personal`} className="loginLink__item">
                고객센터
              </a>
            </div>
          </div>

          <div className="line-wrap">
            <button className="new-design-social-btn social-apple-btn" onClick={() => fetchSocialData("apple")}>
              <img className="icon" src={appleLogo} />
            </button>
            <button className="new-design-social-btn social-facebook-btn" onClick={() => fetchSocialData("facebook")}>
              <img className="icon" src={facebookLogo} />
            </button>
            <button className="new-design-social-btn social-naver-btn" onClick={() => fetchSocialData("naver")}>
              <img className="icon" src={naverLogo} />
            </button>
            <button className="new-design-social-btn social-kakao-btn" onClick={() => fetchSocialData("kakao")}>
              <img className="icon" src={kakaoLogo} />
            </button>
            <button className="new-design-social-btn social-google-btn" onClick={() => fetchSocialData("google")}>
              <img className="icon" src={googleLogo} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
