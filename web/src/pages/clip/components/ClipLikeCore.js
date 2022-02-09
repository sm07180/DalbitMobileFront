import React, { useEffect, useState } from "react";
import GenderItems from "components/ui/genderItems/GenderItems";
import DataCnt from "components/ui/dataCnt/DataCnt";

const ClipLikeCore = (props) => {

  const [itemInfo, setItemInfo] = useState(props.item);


  return (
    <div className="listRow" onClick={() => {}}>
      <div className="photo">
        <img src={itemInfo.photo} alt="" />
      </div>
      <div className="listInfo">
        <div className="listItem">
          <span className="title">{itemInfo.title}</span>
        </div>
        <div className="listItem">
          <GenderItems data={itemInfo.gender} />
          <span className="nickNm">{itemInfo.nickName}</span>
        </div>
        <div className="listItem">
          <DataCnt type={"replyCnt"} value={itemInfo.replyCnt ? itemInfo.replyCnt : "123"}/>
          <DataCnt type={"goodCnt"} value={itemInfo.goodCnt ? itemInfo.replyCnt : "123"}/>
        </div>
      </div>
    </div>
  );
};

export default ClipLikeCore;