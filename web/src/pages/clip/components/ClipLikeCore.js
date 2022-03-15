import React from "react";
import GenderItems from "components/ui/genderItems/GenderItems";
import DataCnt from "components/ui/dataCnt/DataCnt";
import {NewClipPlayerJoin} from "common/audio/clip_func";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

const ClipLikeCore = (props) => {
  const {item} = props;
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory();

  const playClip = (e) => {
    const {clipNo} = e.currentTarget.dataset;

    if (clipNo !== undefined) {
      const clipParam = {clipNo: clipNo, globalState, dispatch, history};

      NewClipPlayerJoin(clipParam);
    }
  };

  return (
    <div className="listRow" data-clip-no={item.clipNo} onClick={playClip}>
      <div className="photo">
        <img src={item.bgImg.thumb292x292} alt={`${item.nickName}`} />
      </div>
      <div className="listInfo">
        <div className="listItem">
          <span className="title">{item.title}</span>
        </div>
        <div className="listItem">
          <GenderItems data={item.gender} />
          <span className="nickNm">{item.nickName}</span>
        </div>
        <div className="listItem">
          <DataCnt type={"replyCnt"} value={item.replyCnt ? item.replyCnt : 0}/>
          <DataCnt type={"goodCnt"} value={item.goodCnt ? item.replyCnt : 0}/>
        </div>
      </div>
      <button className="heart">
        <img src="https://image.dalbitlive.com/clip/dalla/heartOn.png" />
      </button>
    </div>
  );
};

export default ClipLikeCore;
