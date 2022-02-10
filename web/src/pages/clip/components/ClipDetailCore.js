import React, { useEffect, useState } from "react";
import GenderItems from "components/ui/genderItems/GenderItems";
import DataCnt from "components/ui/dataCnt/DataCnt";
import clip from '../static/clip.svg';

const ClipDetailCore = (props) => {
  //const [itemInfo, setItemInfo] = useState(props.item);
  const itemInfo = props.item;

  const handleImgError = (e) => {
    e.currentTarget.src = clip;
  };

  return (
    <div className="listRow" onClick={() => {}}>
      <div className="photo">
        <img src={itemInfo.bgImg.url} alt={`${itemInfo.nickName}`} onError={handleImgError}/>
      </div>
      <div className="listInfo">
        <div className="listItem">
          <span className="title">{itemInfo.title}</span>
        </div>
        <div className="listItem">
          <GenderItems data={itemInfo.gender} />
          <span className="nickNm">{itemInfo.nickName}</span>
          <div>{itemInfo.subjectType}</div>
        </div>
        <div className="listItem">
          <DataCnt type={"replyCnt"} value={itemInfo.playCnt}/>
          <DataCnt type={"goodCnt"} value={itemInfo.goodCnt}/>
        </div>
      </div>
    </div>
  );
};

export default ClipDetailCore;