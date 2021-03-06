import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

export default props => {
  const { boxList, onChangeEvent, inlineStyling, className, type, controllState } = props;
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [opened, setOpened] = useState(null);

  if (boxList === undefined) {
    throw new Error("Need a box list in select box -> exam: ([{value: '', text: ''}....])");
  } else if (onChangeEvent === undefined) {
    throw new Error("Need a on change event function");
  }

  const selectBoxList = (value, idx) => {
    onChangeEvent(value);
    setSelectedIdx(idx);
    setTimeout(() => {
      setOpened(false);
    }, 200);
  };

  const selectBlurEvent = () => {
    setOpened(false);
  };

  const selectedClassName = opened ? "open" : "";
  const selectListClassName = opened !== null ? (opened ? "open" : "close") : "init";

  useEffect(() => {
    return () => {};
  }, []);

  useEffect(() => {
    selectBoxList(boxList[0].value, 0);
  }, [controllState]);

  return (
    <SelectBoxWrap style={inlineStyling ? inlineStyling : {}} className={className ? `wrapper ${className}` : "wrapper"}>
      <Selected
        className={`options ${selectedClassName}`}
        tabIndex={0}
        onClick={() => setOpened(opened ? false : true)}
        onBlur={selectBlurEvent}
      >
        {boxList[selectedIdx].text}
      </Selected>
      <SelectListWrap className={selectListClassName}>
        {boxList.map((instance, index) => {
          if (type === "remove-init-data" && index === 0) {
            return;
          }
          return (
            <div
              className="box-list"
              key={index}
              onMouseDown={() => selectBoxList(instance.value, index)}
              onTouchStart={() => selectBoxList(instance.value, index)}
            >
              {instance.text}
            </div>
          );
        })}
      </SelectListWrap>
    </SelectBoxWrap>
  );
};

const SelectListWrap = styled.div`
  border: 1px solid #FF3C7B;
  border-top: none;

  &.open {
    margin-top: -1px;
    opacity: 1;
    transform: translateY(0);
  }

  &.close {
    opacity: 0;
    height: 0;
    transform: translateY(-10px);
    transform: scale(0);
  }

  &.init {
    display: none;
  }

  .box-list {
    padding: 11px 10px;
    color: #424242;
    font-size: 16px;
    background-color: #fff;
    box-sizing: border-box;
    transform: skew(-0.03deg);
    letter-spacing: -0.5px;
    &:hover {
      color: #FF3C7B;
      background-color: #f8f8f8;
    }
  }
`;

const Selected = styled.div`
  position: relative;
  width: 136px;

  box-sizing: border-box;
  border: 1px solid #FF3C7B;
  font-size: 16px;
  color: #FF3C7B;
  outline: none;
  letter-spacing: -0.5px;
  line-height: 36px;
  height: 36px;
  padding-left: 10px;
  &.open {
    &::before {
      transform: rotate(135deg);
    }
    &::after {
      transform: rotate(-135deg);
    }
  }

  &::before {
    position: absolute;
    content: "";
    width: 12px;
    height: 2px;
    top: 16px;
    right: 20px;
    background-color: #FF3C7B;
    transform: rotate(45deg);
    transition-property: transform;
  }

  &::after {
    position: absolute;
    content: "";
    width: 12px;
    height: 2px;
    top: 16px;
    right: 12px;
    background-color: #FF3C7B;
    transform: rotate(-45deg);
    transition-property: transform;
  }
`;

const SelectBoxWrap = styled.div`
  position: absolute;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
`;
