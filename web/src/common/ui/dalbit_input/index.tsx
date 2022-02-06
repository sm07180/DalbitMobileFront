// React
import React, { useEffect, useState } from "react";
import styled from "styled-components";

export interface TextFieldProps {
  value: string;

  onChange(event: any): void;

  customValidation?(
    value: any
  ): Promise<{
    status: boolean;
    msg: string;
  }>;

  type: "text" | "phone" | "email" | "password";

  name?: string;

  maxLength?: number;

  label?: {
    text: string;
    position: "LEFT" | "RIGHT" | "TOP" | "BOTTOM";
  };

  placeHolder?: string;

  wrapStyle?: any;
  inputStyle?: any;
  labelStyle?: any;

  errorTextVisible?: boolean;
  setError?(error: any): void;
}

const numberValidationCheck = (value: any) => {
  if (!isNaN(Number(value))) {
    if (value === "") {
      return "";
    } else {
      return Number(value).toString();
    }
  } else {
    return false;
  }
};

export default function DalbitInput(props: TextFieldProps) {
  const {
    value,
    onChange,
    customValidation,
    label,
    type,
    maxLength,
    name,
    placeHolder,
    wrapStyle,
    inputStyle,
    labelStyle,

    errorTextVisible,
    setError,
  } = props;

  const [errorState, setErrorState] = useState({
    status: false,
    msg: "",
  });

  const validation = (e: any) => {
    const { value } = e.target;
    switch (name) {
      case "number":
        const result = numberValidationCheck(value);
        if (result !== false) {
          onChange(result);
        }
        break;
      default:
        onChange(value);
    }
  };

  const onBlurHandler = () => {
    let regExp;
    switch (name) {
      case "password":
        const num = value.search(/[0-9]/g);
        const eng = value.search(/[a-zA-Z]/gi);
        const spe = value.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
        if (value.length < 8 || value.length > 20) {
          setErrorState({ status: true, msg: "비밀번호는 8~20자 이내로 입력해주세요." });
          if (setError) {
            setError(true);
          }
        } else {
          if ((num < 0 && eng < 0) || (eng < 0 && spe < 0) || (spe < 0 && num < 0)) {
            setErrorState({
              status: true,
              msg: "비밀번호는 영문/숫자/특수문자 중 2가지 이상 조합으로 입력해주세요.",
            });

            if (setError) {
              setError(true);
            }
          } else {
            setErrorState({
              status: false,
              msg: "",
            });

            if (setError) {
              setError(false);
            }
          }
        }

        break;
      case "email":
        regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
        if (regExp.test(value)) {
          setErrorState({
            status: false,
            msg: "",
          });

          if (setError) {
            setError(false);
          }
        } else {
          setErrorState({
            status: true,
            msg: "정확한 Email을 입력해주세요.",
          });
        }

        break;

      case "phone":
        regExp = /(01[0123456789])(\d{4}|\d{3})\d{4}$/g;
        if (regExp.test(value)) {
          setErrorState({
            status: false,
            msg: "",
          });

          if (setError) {
            setError(false);
          }
        } else {
          setErrorState({
            status: true,
            msg: "올바른 휴대폰 번호가 아닙니다.",
          });

          if (setError) {
            setError(true);
          }
        }
        break;
    }
  };

  return (
    <TextFieldWrap className={`dalbit_input ${label && label.position}`} style={{ ...wrapStyle }}>
      {label && (label.position === "TOP" || label.position === "LEFT") && <label style={{ ...labelStyle }}>{label.text}</label>}
      <input
        style={{ ...inputStyle }}
        type={type}
        value={value}
        maxLength={maxLength}
        onChange={(e) => {
          validation(e);
        }}
        onBlur={() => {
          if (customValidation) {
            customValidation(value).then((resolve) => {
              setErrorState({
                ...resolve,
              });

              if (setError) {
                setError({
                  ...resolve,
                });
              }
            });
          } else {
            onBlurHandler();
          }
        }}
        name={name}
        placeholder={placeHolder}
      />
      {label && (label.position === "BOTTOM" || label.position === "RIGHT") && (
        <label style={{ ...labelStyle }}>{label.text}</label>
      )}
      {errorState.status && errorTextVisible && <p>{errorState.msg}</p>}
    </TextFieldWrap>
  );
}

DalbitInput.defaultProps = {
  type: "text",
};

const TextFieldWrap = styled.div`
  display: flex;
  align-items: center;

  &.top,
  &.bottom {
    flex-direction: column;
  }
`;
