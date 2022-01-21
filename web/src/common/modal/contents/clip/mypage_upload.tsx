// tab navigation
// api
import { getProfile, postGiftDal } from "common/api";
import { GlobalContext } from "context";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./modal_clip.scss";
export default (props) => {
  const { globalState, globalAction } = useContext(GlobalContext);
  const history = useHistory();
  //clip Link
  const clipLink = (type: string) => {
    if (type === "record") {
      history.push("/clip_recoding");
    } else if (type === "upload") {
      history.push("/clip_upload");
    }
  };
  return (
    <div className="fanlist-modal" onClick={(e) => e.stopPropagation()}>
      {/* <button className="closeBtn" onClick={() => history.goBack()}></button> */}
      <div id="modal_clipUpload">
        <div className="clipBtn">
          <button className="clipBtn__record" onClick={() => clipLink("record")} />
          <span>클립 녹음</span>
        </div>
        <div className="clipBtn">
          <button className="clipBtn__upload upload" onClick={() => clipLink("upload")} />
          <span>파일 업로드</span>
        </div>
      </div>
    </div>
  );
};
