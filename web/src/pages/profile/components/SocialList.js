import React, {useState, useRef} from 'react';
// global components
import ListRowComponent from "./ListRowComponent";
// components
import FeedLike from "./FeedLike";

import Utility from "components/lib/utility";
import {useSelector} from "react-redux";
import {useHistory, useParams} from "react-router-dom";
import {goProfileDetailPage} from "pages/profile/contents/profileDetail/profileDetail";

const SocialList = (props) => {
  const {socialList, isMyProfile, openSlidePop, showImagePopUp, deleteContents, type} = props;
  const history = useHistory();
  const params = useParams();
  const socialRef = useRef([]);
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const profileData = useSelector(state => state.profile);
  const limitHeight = 64;

  console.log(socialList);

  const [isClicked, setIsClicked] = useState(Array(socialList.length).fill(false));

  const photoClickEvent = (memNo) => {
    if (type === "fanBoard" && globalState.profile.memNo !== memNo) {history.push(`/profile/${memNo}`)}
  };

  const toggleEllipsis = (idx, limit) => {
    return {isShowMore: (socialRef.current[idx]?.clientHeight ? socialRef.current[idx].clientHeight : 0) > limit}
  };

  {/* 더보기, 간략히 전환 */}
  const onClick = (index, isBoolean) => {
    if(isBoolean === "false") {
      if(index === parseInt(socialRef.current[index].dataset.num)) {
        let temp = isClicked.concat([]);
        temp[index] = true;
        setIsClicked(temp);
      }
    } else if(isBoolean === "true") {
      if(index === parseInt(socialRef.current[index].dataset.num)) {
        let temp = isClicked.concat([]);
        temp[index] = false;
        setIsClicked(temp);
      }
    }
  };

  {/* 내부 컴포넌트 */}
  const FeedPhoto = (props) => {
    const {photoInfoList, length} = props;
    const photoLength = photoInfoList.length;
    const photoShowMax = 5; // 보여줄 사진 최대 값

    if (photoLength < photoShowMax) {
      return (
        <div className={`photo ${length === 2 ? 'grid-2' : length === 3 && 'grid-3'}`}>
          {photoInfoList.map((v, idx) => {return (<img key={idx} src={v.imgObj.thumb500x500} onClick={() => showImagePopUp(photoInfoList, 'feedList', idx)} />)})}
        </div>
      )
    } else {
      return (
        <>
          <div className="photo grid-2">
            {photoInfoList.map((v, index) => {return (<React.Fragment key={index}>{index <= 1 && <div><img src={v.imgObj.thumb500x500} onClick={() => showImagePopUp(photoInfoList, 'feedList', index)}/></div>}</React.Fragment>)})}
          </div>
          <div className="photo grid-3">
            {photoInfoList.map((v, idx) => {return (<React.Fragment key={idx}>{idx > 1 && idx < 5 && <div><img src={v.imgObj.thumb500x500} onClick={() => showImagePopUp(photoInfoList, 'feedList', idx)}/></div>}</React.Fragment>)})}
            {photoLength >= photoShowMax &&
            <div className="photoMore">
              <div onClick={() => showImagePopUp(photoInfoList, 'feedList', 2)}/>
              <div onClick={() => showImagePopUp(photoInfoList, 'feedList', 3)}/>
              {photoLength - photoShowMax > 0 ?
                <div className="count" onClick={() => showImagePopUp(photoInfoList, 'feedList', 4)}>+{photoLength - photoShowMax}</div>
                : 
                <div onClick={() => showImagePopUp(photoInfoList, 'feedList', 4)}/>
              }
            </div>
            }
          </div>
        </>
      )
    }
  };

  return (
    <div className="socialListWrap">
      {socialList.map((item, index) => {
        if (type === "fanBoard" && (item?.viewOn === 0 && !isMyProfile && item.mem_no !== globalState.profile.memNo)) {
          return <React.Fragment key={item.replyIdx}/>
        }
        const memNo = type === "feed" ? profileData.memNo : item?.writerMemNo; //글 작성자
        const detailPageParam = {history, action: "detail", type, index: item.reg_no ? item.reg_no : item.replyIdx, memNo: profileData.memNo, fromMemNo: params?.memNo ? params.memNo : globalState.profile.memNo};
        const modifyParam = {history, action: "modify", type, index: item.reg_no ? item.reg_no : item.replyIdx, memNo: globalState.profile.memNo};
        return (
          <div className="socialList" key={item.reg_no ? item.reg_no : item.replyIdx}>
            <ListRowComponent
              item={item} index={index} type={type}
              isMyProfile={isMyProfile}
              openSlidePop={openSlidePop}
              modifyEvent={() => {memNo === globalState.profile.memNo && goProfileDetailPage(modifyParam)}}
              deleteEvent={() => deleteContents(type, item.reg_no ? item.reg_no : item.replyIdx, globalState.profile.memNo)}
              photoClick={() => photoClickEvent(item.mem_no)} />

            <div className="socialContent" onClick={() => goProfileDetailPage(detailPageParam)}>
              <div className={`socialTextWrap ${isClicked[index] || type !== "feed" ? 'isMore' : ''}`}>
                <div className="socialText" data-num={index}
                     ref={el => socialRef.current[index] = el}
                     dangerouslySetInnerHTML={{__html: Utility.nl2br(item.feed_conts ? item.feed_conts : item.contents)}} />
                {type === "feed" &&
                  <>
                  {!isClicked[index] && toggleEllipsis(index, limitHeight).isShowMore ?
                    <div className="socialButton" onClick={() => onClick(index, "false")}>··· 더보기</div>
                  : isClicked[index] &&
                    <div className="socialButton" onClick={() => onClick(index, "true")}>간략히</div>
                  }
                  </>
                }
              </div>

              {type === 'feed' && item.photoInfoList.length > 0 && 
                <div className="swiperPhoto">
                  {item.photoInfoList.length <= 2 ?
                  <FeedPhoto photoInfoList={item.photoInfoList} length={2} />
                  : item.photoInfoList.length === 3 ?
                  <FeedPhoto photoInfoList={item.photoInfoList} length={3} />
                  : item.photoInfoList.length === 4 ?
                  <FeedPhoto photoInfoList={item.photoInfoList} length={2} />
                  : item.photoInfoList.length >= 5 &&
                  <FeedPhoto photoInfoList={item.photoInfoList} />
                  }
                </div>
              }

              <FeedLike data={item} type={type} detailPageParam={detailPageParam} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SocialList;
