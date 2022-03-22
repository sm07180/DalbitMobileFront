import React, {useContext, useEffect, useState} from "react";
import GenderItems from "components/ui/genderItems/GenderItems";
import DataCnt from "components/ui/dataCnt/DataCnt";
import clip from '../static/clip.svg';
import {NewClipPlayerJoin} from "common/audio/clip_func";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

const ClipDetailCore = (props) => {
  const { item,subjectType,slctType } = props;
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory();

  const handleImgError = (e) => {
    e.currentTarget.src = clip;
  };

  const playClip = (e) => {
    const { clipNo } = e.currentTarget.dataset;
    const playListInfoData = {
      dateType: 0,
      page: 1,
      records: 100,
      slctType: slctType.index,
      subjectType:subjectType
    }
    localStorage.setItem(
      "clipPlayListInfo",
      JSON.stringify(playListInfoData)
    );
    if (clipNo !== undefined) {
      const clipParam = { clipNo: clipNo, globalState, dispatch, history };

      NewClipPlayerJoin(clipParam);
    }
  };

  return (
    <div className="listRow" data-clip-no={item.clipNo} onClick={playClip}>
      <div className="photo">
        <img src={item.bgImg.thumb292x292} alt={`${item.nickName}`} onError={handleImgError}/>
      </div>
      <div className="listInfo">
        <div className="listItem">
          <span className="subject">{item.subjectType}</span>
          <span className="title">{item.title}</span>
        </div>
        <div className="listItem">
          <GenderItems data={item.gender} />
          <span className="nickNm">{item.nickName}</span>
        </div>
        <div className="listItem">
          <DataCnt type={"replyCnt"} value={item.replyCnt}/>
          <DataCnt type={"goodCnt"} value={item.goodCnt}/>
        </div>
      </div>
    </div>
  );
};

export default ClipDetailCore;
