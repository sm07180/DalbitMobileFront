import React, {useState, useCallback} from 'react';

import Api from 'context/api';
// global components
import ShowSwiper from "components/ui/showSwiper/ShowSwiper";
import NoResult from 'components/ui/noResult/NoResult';
// components
import SocialList from '../../components/SocialList';
// redux
import {useDispatch, useSelector} from "react-redux";
import {setProfileFeedNewData} from "redux/actions/profile";

const FeedSection = (props) => {
  const { profileData, isMyProfile, deleteContents} = props;
  //context
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const feedData = useSelector(state => state.feed);
  const { feedList } = feedData;

  const [feedShowSlide, setFeedShowSlide] = useState({visible: false, imgList: [], initialSlide: 0});

  /* 피드 좋아요 */
  const fetchFeedHandleLike = async (feedNo, mMemNo, like, likeType, index) => {
    const params = {
      feedNo: feedNo,
      mMemNo: mMemNo,
      vMemNo: globalState.profile.memNo
    };
    if(like === "n") {
      await Api.myPageFeedLike(params).then((res) => {
        if(res.result === "success") {
          let tempIndex = feedData.feedList.findIndex(value => value.reg_no === parseInt(index));
          let temp = feedData.feedList.concat([]);
          temp[tempIndex].like_yn = "y";
          temp[tempIndex].rcv_like_cnt++;
          dispatch(setProfileFeedNewData({...feedData, feedList: temp}))
        }
      }).catch((e) => console.log(e));
    } else if(like === "y") {
      await Api.myPageFeedLikeCancel(params).then((res) => {
        if(res.result === "success") {
          let tempIndex = feedData.feedList.findIndex(value => value.reg_no === parseInt(index));
          let temp = feedData.feedList.concat([]);
          temp[tempIndex].like_yn = "n";
          temp[tempIndex].rcv_like_cnt--;
          dispatch(setProfileFeedNewData({...feedData, feedList: temp}))
        }
      }).catch((e) => console.log(e));
    }
  };

  /* 피드 사진(여러장) 확대 */
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

  /* 피드 사진 닫기 */
  const showSlideClear = useCallback(() => {
    setFeedShowSlide({visible: false, imgList: [], initialSlide: 0});
  }, []);

  return (
    <>
    <div className="feedSection">
      {feedList.length > 0 ?
        <SocialList
          profileData={profileData}
          isMyProfile={isMyProfile}
          socialList={feedList}
          fetchHandleLike={fetchFeedHandleLike}
          showImagePopUp={showImagePopUp}
          deleteContents={deleteContents}
          type="feed"
        />
        :
        <NoResult />
      }
    </div>
      
    {/* 피드 사진 확대 */}
    {feedShowSlide?.visible &&
      <ShowSwiper imageList={feedShowSlide?.imgList || []} popClose={showSlideClear} swiperParam={{initialSlide: feedShowSlide?.initialSlide}}/>
    }
    </>
  )
}

export default FeedSection;
