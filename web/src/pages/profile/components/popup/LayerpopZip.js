import React, {useState} from 'react';
// global components
import LayerPopup, {closePopup} from "../../../../components/ui/layerPopup/LayerPopup2";
// components
import ProfileNoticePop from "pages/profile/components/popup/ProfileNoticePop";
import SpecialHistoryPop from "pages/remypage/components/popup/SpecialHistoryPop";

import {useDispatch} from "react-redux";

const SlidepopZip = (props) => {
  const {layerPopInfo} = props;
  const dispatch = useDispatch();
  
  const closeSlidePop = () => {
    closePopup(dispatch);
  }

  switch (layerPopInfo.type) {
    case "rank":
      return (
        <LayerPopup title="랭킹 기준">
          <ProfileNoticePop />
        </LayerPopup>
      )
    case "history":
      return (        
        <LayerPopup>
          <SpecialHistoryPop
            memNo={layerPopInfo.memNo}/>
        </LayerPopup>
      )    
    default :
      return <></>
  }
}

export default SlidepopZip;
