import React, {useState, useCallback} from 'react';
// global components
import ShowSwiper from "../../../components/ui/showSwiper/ShowSwiper";
import NoResult from '../../../components/ui/noResult/NoResult';
// components
import SocialList from './SocialList';
import FloatBtn from './FloatBtn';
// redux
import {useSelector} from "react-redux";

const FeedSection = (props) => {
  const {feedData, isMyProfile, deleteContents} = props;
  //context
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const [feedShowSlide, setFeedShowSlide] = useState({visible: false, imgList: [], initialSlide: 0});

  {/* 피드 사진(여러장) 확대 */}
  const showImagePopUp = (data = null, type='', initialSlide = 0)=> {
    if(!data) return;
    let resultMap = [];
    if (type === 'feedList') { // 피드 이미지 리스트
      data.map((v, idx) => {
        if (v?.imgObj) {
          resultMap.push({photo_no: v.photo_no, ...v.imgObj});
        }
      });
    }
    setFeedShowSlide({visible:true, imgList: resultMap, initialSlide });
  };

  {/* 피드 사진 닫기 */}
  const showSlideClear = useCallback(() => {
    setFeedShowSlide({visible: false, imgList: [], initialSlide: 0});
  }, []);

  return (
    <>
    <div className="feedSection">
      {feedData.feedList.length > 0 ?
        <SocialList
          socialList={feedData.feedList}
          isMyProfile={isMyProfile}
          showImagePopUp={showImagePopUp}
          deleteContents={deleteContents}
          type="feed" />
        :
        <NoResult />
      }
    </div>

    {/* 피드 사진 확대 */}
    {feedShowSlide?.visible &&
      <ShowSwiper
        swiperParam={{initialSlide: feedShowSlide?.initialSlide}}
        imageList={feedShowSlide?.imgList || []}
        popClose={showSlideClear} />
    }
    
    {/* 글쓰기 플로팅 버튼 */}
    {isMyProfile &&
      <FloatBtn profileData={globalState.profile} />
    }
    </>
  )
}

export default FeedSection;
