import React, { useReducer } from "react";
import SelectBox from "./index";
export default {
  title: "SelectBox",
  component: SelectBox,
};

const initialValue = {
  isOpen: false,
  boxList: [
    { value: 0, text: "a" },
    { value: 1, text: "b" },
    { value: 2, text: "c" },
    { value: 1, text: "b" },
    { value: 2, text: "c" },
    { value: 1, text: "b" },
    { value: 2, text: "c" },
    { value: 1, text: "b" },
    { value: 2, text: "c" },
    { value: 1, text: "b" },
    { value: 2, text: "c" },
  ],
  selectIdx: 0,
};

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
};

const selectReducer = (state: StateType, action: ActionType) => {
  switch (action.type) {
    case "open":
      return {
        ...state,
        isOpen: !state.isOpen,
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

export const Default = () => {
  const [state, dispatch] = useReducer(selectReducer, initialValue);

  const styling = {
    // iconColor:"#000", // 아이콘 색상 변경
    // selectBordercolor:"blue", // 셀렉트 선색상
    // borderRadius: "10px", // 셀렉트 보더 라운딩
    // hoverFontcolor: "#eee", // 옵션에 마우스 오버시 폰트색 변경
    // lineColor: "#333", // 옵션 하단 선 색깔
    // selectFontColor: "#333",
    // optionCoutNumber: "450",
  };
  return (
    <div style={{ width: "200px", height: "40px" }}>
      {/* 셀렉트를 감싸는 div에 width height 값이 셀렉트 크기를 지정 */}
      <SelectBox state={state} dispatch={dispatch} styling={styling} />
    </div>
  );
};
