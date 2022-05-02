import React from 'react';
// global components
import PopSlide, {closePopup} from "../../../../components/ui/popSlide/PopSlide";
// components
import MorePopup from "./MorePopup";
import FanStarPopup from "./FanStarPopup";
import LikePopup from "./LikePopup";

import {useDispatch} from "react-redux";
import {useHistory} from 'react-router-dom'

const SlidepopZip = (props) => {
  const {slideData} = props;
  const dispatch = useDispatch();
  const history = useHistory();

  // 프로필 페이지로 이동
  const goProfile = (memNo) => history.push(`/profile/${memNo}`);

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
            closePopupAction={closeSlidePop} />
        </PopSlide>
      )
    case "block":
      return (
        <PopSlide>
          <BlockReport
            blockReportInfo={blockReportInfo}
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
    case "like":
      return (
        <PopSlide>
          <LikePopup 
            isMyProfile={true}
            profileData={slideData.data}
            goProfile={goProfile}
            myMemNo={slideData.memNo}
            likePopTabState={slideData.likeType}
            closePopupAction={closeSlidePop} />
        </PopSlide>
      )
    default :
      return <></>
  }
}

export default SlidepopZip;
