import React, {useState} from 'react';
import GenderItems from "components/ui/genderItems/GenderItems";
import DataCnt from "components/ui/dataCnt/DataCnt";

const ClipListenCore = (props) => {
  const [itemInfo, setItemInfo] = useState(props.item);

  return (
    <div className="listRow" onClick={() => {}}>
      <div className="photo">
        <img src={itemInfo.bgImg.url} alt={`${itemInfo.nickName}`} />
      </div>
      <div className="listInfo">
        <div className="listItem">
          <span className="title">{itemInfo.title}</span>
        </div>
        <div className="listItem">
          <GenderItems data={itemInfo.gender} />
          <span className="nickNm">{itemInfo.nickName}</span>
        </div>
      </div>
      {/*<button className="trash">
        <img src="https://image.dalbitlive.com/clip/dalla/icoTrash.png" />
      </button>*/}
    </div>
  );
};

export default ClipListenCore;