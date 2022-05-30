import React from "react";
import GenderItems from "components/ui/genderItems/GenderItems";
import DataCnt from "components/ui/dataCnt/DataCnt";

const ClipLikeCore = (props) => {
  const { item, playClipHandler } = props;

  return (
    <div className="listRow" data-clip-no={item.clipNo} onClick={playClipHandler}>
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
        <img src="https://image.dallalive.com/clip/dalla/heartOn.png" />
      </button>
    </div>
  );
};

export default ClipLikeCore;