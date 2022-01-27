import React from "react";
import styled from "styled-components";
import { IMG_SERVER } from "constant/define";

type StateType = {
  isOpen: boolean;
  boxList: Array<{
    value: number;
    text: string;
  }>;
  selectIdx: number;
};

type Selectprops = {
  /** StateType */
  state: {
    isOpen: boolean;
    boxList: Array<{
      value: any;
      text: string;
    }>;
    selectIdx: number;
  };

  /** any */
  dispatch: any;
  /** css관련 속성 객체<br/><br/>
    iconColor?: 화살표 색<br/>
    selectBordercolor?: 셀렉트 보더 색상<br/>
    radius?: 셀렉트 라디우스 처리<br/>
    selectFontColor?: 셀렉트 첫번째 폰트 컬러<br/>
    hoverFontcolor?: 마우스 오버시 옵션 폰트색 변경<br/>
    lineColor?: 옵션 하단 라인 적용<br/>
    optionCoutNumber?: 옵션 지정 갯수 이후로 스크롤 적용<br/>
    <br/> 
   */

  firstVisible?: boolean;

  icon?: boolean;

  styling?: {
    iconColor?: string;
    selectBordercolor?: string;
    borderRadius?: string;
    hoverFontcolor?: string;
    lineColor?: string;
    selectFontColor?: string;
    optionCoutNumber?: string;
    optionHeight?: string;
    fontSize?: string;
  };
};

export function SelectBoxComponent(props: Selectprops) {
  const { state, dispatch, styling, firstVisible, icon } = props;

  const handleClick = (idx: number) => {
    dispatch({ type: "select", idx: idx });
  };

  // useEffect(() => {
  //   const globalEv = (e) => {
  //     e.stopPropagation();
  //     console.log("this");
  //     console.log(e);
  //     dispatch({ type: "open", val: false });
  //   };
  //   window.addEventListener("click", globalEv);

  //   return function cleanup() {
  //     window.removeEventListener("click", globalEv);
  //   };
  // }, []);

  return (
    <SelectBox
      // iconColor={styling && styling.iconColor}
      // selectBordercolor={styling && styling.selectBordercolor}
      // borderRadius={styling && styling.borderRadius}
      // hoverFontcolor={styling && styling.hoverFontcolor}
      // selectFontColor={styling && styling.selectFontColor}
      // optionCoutNumber={styling && styling.optionCoutNumber}
      // lineColor={styling && styling.lineColor}
      {...styling}
    >
      <div
        className="selectModule"
        tabIndex={-1}
        onBlur={() => {
          dispatch({ type: "open", val: false });
        }}
      >
        <div
          className={`select ${state.isOpen ? "open" : "close"}`}
          onClick={(e) => {
            dispatch({ type: "open", val: !state.isOpen });
          }}
        >
          {state.boxList[state.selectIdx].text}
        </div>
        <div className={`optionBox ${state.isOpen ? "open" : "close"}`}>
          {state.boxList.map((item: any, index: number) => {
            return (
              <React.Fragment key={index}>
                {firstVisible === false && index === 0 ? (
                  <></>
                ) : (
                  <div
                    className="option"
                    key={index}
                    onClick={(e) => {
                      dispatch({ type: "select", idx: index });
                    }}
                  >
                    {icon === true && <img src={`${IMG_SERVER}/images/exchange/bank/${item.value}.png`} />}
                    {item.text ? item.text : item.cdNm ? item.cdNm : ""}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </SelectBox>
  );
}

const SelectBox = styled.div`
  width: 100%;
  height: 100%;
  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  .selectModule {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    z-index: 1;
    font-size: ${(props) => (props.fontSize ? props.fontSize : "16px")};
    .select {
      display: flex;
      align-items: center;
      border: 1px solid ${(props: any) => (props.selectBordercolor ? props.selectBordercolor : "#632beb")};
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      /* padding: 0px 12px; */
      position: relative;
      color: ${(props: any) => (props.selectFontColor ? props.selectFontColor : "#632beb")};
      font-weight: 500;
      border-radius: ${(props: any) => (props.borderRadius ? props.borderRadius : "0px")};

      &:after {
        display: block;
        position: absolute;
        right: 10px;
        top: 40%;
        width: 12px;
        height: 12px;
        transform: translate(-50%, -40%) rotate(-135deg);
        border-left: 2px solid ${(props: any) => (props.iconColor ? props.iconColor : "#632beb")};
        border-top: 2px solid ${(props: any) => (props.iconColor ? props.iconColor : "#632beb")};
        content: "";
      }
      cursor: pointer;
      &.open {
        width: 100%;
        height: 100%;

        &:after {
          display: block;
          position: absolute;
          right: 10px;
          width: 12px;
          height: 12px;
          top: 60%;
          transform: translate(-50%, -60%) rotate(45deg);
          border-left: 2px solid ${(props: any) => (props.iconColor ? props.iconColor : "#632beb")};
          border-top: 2px solid ${(props: any) => (props.iconColor ? props.iconColor : "#632beb")};
          content: "";
        }
      }
    }

    .optionBox {
      overflow-y: auto;
      top: 100%;
      width: 100%;

      height: ${(props: any) => (props.optionCoutNumber ? props.optionCoutNumber : "300")}%;

      display: flex;
      position: absolute;
      background: #fff;
      margin-top: -1px;
      display: none;
      border: 1px solid ${(props: any) => (props.lineColor ? props.lineColor : "#8555f6")};
      box-sizing: border-box;

      &.open {
        display: block;
      }

      &::-webkit-scrollbar {
        width: 5px;
      }

      &::-webkit-scrollbar-track {
        background: #e5e5e5;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 3px;
        background-color: #acacac;
      }
    }
    .option {
      display: flex;
      align-items: center;
      width: 100%;
      height: ${(props) => (props.optionHeight ? props.optionHeight : "40px")};
      padding: 0px 20px;
      font-size: 16px;
      box-sizing: border-box;
      color: #757575;
      cursor: pointer;

      &:hover {
        background: #f8f8f8;
        color: ${(props: any) => (props.hoverFontcolor ? props.hoverFontcolor : "#632beb")};
      }

      &:active {
        background: #eee;
        color: #757575;
      }

      &.on {
        display: block;
      }

      &:last-child {
        border-bottom: none;
      }

      img {
        width: 16px;
        height: 16px;
        margin-right: 4px;
      }
    }
  }

  .selBox {
    display: flex;

    & > div {
      margin-right: 30px;
    }
  }
`;

export default SelectBoxComponent;
