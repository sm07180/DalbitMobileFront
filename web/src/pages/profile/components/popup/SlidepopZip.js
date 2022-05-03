import React, {useState} from 'react';
// global components
import PopSlide, {closePopup} from "../../../../components/ui/popSlide/PopSlide";
// components
import MorePopup from "./MorePopup";
import BlockReport from "./BlockReport";
import FanStarPopup from "./FanStarPopup";
import LikePopup from "./LikePopup";
import Present from "./Present";

import {useDispatch} from "react-redux";

const SlidepopZip = (props) => {
  const {slideData, goProfile, openSlidePop, isMyProfile} = props;
  const dispatch = useDispatch();
  
  const closeSlidePop = () => {
    closePopup(dispatch);
  }

  switch (slideData.type) {
    case "header":
      return (
        <PopSlide>
          <MorePopup
            profileData={slideData.data}
            myMemNo={slideData.memNo}
            openSlidePop={openSlidePop}
            closePopupAction={closeSlidePop} />
        </PopSlide>
      )
    case "block":
      return (
        <PopSlide>
          <BlockReport
            profileData={slideData.data}
            openSlidePop={openSlidePop}
            closePopupAction={closeSlidePop} />
        </PopSlide>
      )
    case "fanStar":
      return (
        <PopSlide>
          <FanStarPopup
            type={slideData.fanStarType}
            isMyProfile={true}
            profileData={slideData.data}
            goProfile={goProfile}
            myMemNo={slideData.memNo}
            closePopupAction={closeSlidePop} />
        </PopSlide>
      )
    case "like" || "cupid":
      return (
        <PopSlide>
          <LikePopup 
            isMyProfile={isMyProfile}
            profileData={slideData.data}
            goProfile={goProfile}
            myMemNo={slideData.memNo}
            likePopTabState={slideData.likeType}
            closePopupAction={closeSlidePop} />
        </PopSlide>
      )
    case "present":
      return (
        <PopSlide>
          <Present
            profileData={slideData.data}
            closePopupAction={closeSlidePop} />
        </PopSlide>
      )
    default :
      return <></>
  }
}

export default SlidepopZip;
