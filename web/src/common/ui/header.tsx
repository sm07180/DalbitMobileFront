import React from "react";
import { useHistory } from "react-router-dom";

export default (props, type) => {
  const history = useHistory();

  let { goBack } = props;
  if (goBack === undefined) {
    goBack = () => {
      return history.goBack();
    };
  }

  return (
    <div className="header-wrap">
      {props.title ? (
        <h2 className={`header-title${props.title.length > 18 ? " isLong" : ""}`}>{props.title}</h2>
      ) : (
        props.children
      )}
      {props.type !== "noBack" && (
        <button className="btnClose" onClick={goBack}>
          뒤로가기
        </button>
      )}
    </div>
  );
};
