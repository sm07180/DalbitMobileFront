import React from "react";
import styled from "styled-components";

export interface CheckboxProps {
  /**
   * Is Checked State
   */
  status: boolean;
  /**
   * onChange handler
   */
  callback?: () => void;
  /**
   * Checkbox width and height
   */
  size?: number;
  /**
   * Checkbox On Checked Background Color
   */
  bgColor?: string;

  /**
   * Checkbox Label type Obejct
   * text: Label Text
   * id: Label HtmlFor
   * position: Label position
   */
  label?: {
    text: string;
    id: string;
    position: "right" | "left";
  };
}

export default function DalbitCheckbox(props: CheckboxProps) {
  const { status, callback, size, bgColor, label } = props;

  return (
    <CheckboxWrap>
      <Chechbox
        id={label && label.id}
        status={status}
        type="checkbox"
        className={`${status === true && "on"}`}
        onChange={callback}
        size={size}
        bgColor={bgColor}
      />
      {label && (
        <label htmlFor={label.id} className={`${label.position}`}>
          {label.text}
        </label>
      )}
    </CheckboxWrap>
  );
}

DalbitCheckbox.defaultProps = {
  status: false,
  size: 24,
  backgroundColor: "#632beb",
};

const CheckboxWrap = styled.div`
  display: inline-block;
  align-items: center;
  width: fit-content;

  & > label {
    cursor: pointer;

    &.left {
      float: left;
      margin-right: 8px;
    }

    &.right {
      float: right;
      margin-left: 8px;
    }
  }
`;

const Chechbox = styled.input`
  width: ${(props: CheckboxProps) => (props.size ? `${props.size}px` : "24px")};
  height: ${(props: CheckboxProps) => (props.size ? `${props.size}px` : "24px")};
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  appearance: none;
  border: none;
  outline: none;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  background-color: #ffffff;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  &::before {
    content: "";
    position: absolute;
    width: 13%;
    height: 50%;
    top: 25%;
    left: 56%;
    background-color: #9e9e9e;
    -ms-transform: rotate(45deg); /* IE 9 */
    -webkit-transform: rotate(45deg); /* Chrome, Safari, Opera */
    transform: rotate(45deg);
    border-radius: 10px;
  }

  &::after {
    content: "";
    position: absolute;
    width: 40%;
    height: 13%;
    background-color: #9e9e9e;
    top: 50%;
    left: 17%;
    -ms-transform: rotate(45deg); /* IE 9 */
    -webkit-transform: rotate(45deg); /* Chrome, Safari, Opera */
    transform: rotate(45deg);
    border-radius: 10px;
  }

  &.on {
    border-color: ${(props: CheckboxProps) => (props.bgColor ? `${props.bgColor}` : "#632beb")};
    background-color: ${(props: CheckboxProps) => (props.bgColor ? `${props.bgColor}` : "#632beb")};
    transition: 0.2s all ease 0s;

    &::before,
    &::after {
      background-color: #fff;
    }
  }
`;
