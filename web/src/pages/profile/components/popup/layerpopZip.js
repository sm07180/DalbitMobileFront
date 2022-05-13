import React, {useState} from 'react';
// global components
import LayerPopup from "../../../../components/ui/layerPopup/LayerPopup2";
// components
import MorePopup from "./MorePopup";
import BlockReport from "./BlockReport";
import FanStarPopup from "./FanStarPopup";
import LikePopup from "./LikePopup";
import Present from "./Present";

import {useDispatch} from "react-redux";

const LayerpopZip = (props) => {
  const {slideData, goProfile, openSlidePop, isMyProfile} = props;
  const dispatch = useDispatch();
  
  const closeSlidePop = () => {
    closePopup(dispatch);
  }

  switch (slideData.type) {
    case "header":
      return (
        <LayerPopup title="랭킹 기준">
          <ProfileNoticePop />
        </LayerPopup>
      )
    case "block":
      return (
        <LayerPopup>
          <BlockReport
            profileData={slideData.data}
            openSlidePop={openSlidePop}
            closePopupAction={closeSlidePop} />
        </LayerPopup>
      )    
    default :
      return <></>
  }
}

export default LayerpopZip;
