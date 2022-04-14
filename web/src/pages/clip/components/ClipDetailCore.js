import React from "react";
import GenderItems from "components/ui/genderItems/GenderItems";
import DataCnt from "components/ui/dataCnt/DataCnt";
import clip from '../static/clip.svg';

const ClipDetailCore = (props) => {
  const { item,subjectType,slctType, playClipHandler } = props;

  const handleImgError = (e) => {
    e.currentTarget.src = clip;
  };

  const clipClick = (e) => {
    playClipHandler(e, subjectType, slctType);
  }

  return (
    <div className="listRow" data-clip-no={item.clipNo} onClick={clipClick}>
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