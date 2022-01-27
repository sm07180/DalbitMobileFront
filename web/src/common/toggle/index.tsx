import React from "react";
import styled from "styled-components";

export default function(props: { active?: boolean; activeCallback?: (active?: boolean) => void }) {
  return (
    <ToggleStyled
      className={`${props.active ? "active" : ""}`}
      onClick={(e: any) => {
        e.stopPropagation();
        if (props.activeCallback && typeof props.activeCallback === "function") {
          props.activeCallback(!props.active);
        }
      }}
    >
      <div className={`circle ${props.active ? "active" : ""}`} />
    </ToggleStyled>
  );
}

const ToggleStyled = styled.div`
  width: 51px;
  height: 31px;
  background-color: rgba(120, 120, 128, 0.16);
  border-radius: 20px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.1s linear;

  &.active {
    background-color: #632beb;
  }

  .circle {
    position: absolute;
    width: 27px;
    height: 27px;
    background-color: #fff;
    border-radius: 50%;
    top: 2px;
    left: 2px;

    transition: left 0.2s linear, background-color 0.2s linear;

    &.active {
      left: 22px;
    }
  }
`;
