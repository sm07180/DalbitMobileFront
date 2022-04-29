import React, {useContext, useEffect, useState, useRef} from 'react'

// global components
import DataCnt from 'components/ui/dataCnt/DataCnt'
// css
import './socialList.scss'
import ListRowComponent from "./ListRowComponent";
import Swiper from "react-id-swiper";
import {useHistory, useParams} from "react-router-dom";
import {goProfileDetailPage} from "pages/profile/contents/profileDetail/profileDetail";
import Utility from "components/lib/utility";
import {useDispatch, useSelector} from "react-redux";
import FeedLike from "pages/profile/components/FeedLike";
import * as Util from "util";

const SocialList = (props) => {
  const {socialList, openShowSlide, isMyProfile, type, openBlockReportPop, deleteContents, profileData, fetchHandleLike, showImagePopUp} = props
  const history = useHistory();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const profileTab = useSelector(state => state.profileTab);
  const socialRef = useRef([]);
  const params = useParams();

  const photoClickEvent = (memNo) => {
    if (type === 'fanBoard') {history.push(`/profile/${memNo}`)}
  }

  return (
    <div className="socialListWrap">
      {socialList.map((item, index) => {
        if (type === 'fanBoard' && (item?.viewOn === 0 && !isMyProfile && item.mem_no !== globalState.profile.memNo)) {
          return <React.Fragment key={item.replyIdx}/>
        }

        const memNo = type === 'feed' ? profileData.memNo : item?.writerMemNo; //글 작성자
        const detailPageParam = {history, action: 'detail', type, index: item.reg_no ? item.reg_no : item.replyIdx, memNo: profileData.memNo
          , fromMemNo: params?.memNo ? params.memNo : globalState.profile.memNo};
        const modifyParam = {history, action: 'modify', type, index: item.reg_no ? item.reg_no : item.replyIdx, memNo: profileData.memNo, };
        return (
          <div className='socialList' key={item.reg_no ? item.reg_no : item.replyIdx}>
            <ListRowComponent item={item} isMyProfile={isMyProfile} index={index} type={type}
                              openBlockReportPop={openBlockReportPop}
                              modifyEvent={() => {
                                memNo === globalState.profile.memNo && goProfileDetailPage(modifyParam)
                              }}
                              deleteEvent={() => deleteContents(type, item.reg_no ? item.reg_no : item.replyIdx, profileData.memNo)}
                              photoClick={() => {
                                photoClickEvent(item.mem_no)
                              }}
            />
            <div className="socialContent">
              <div className={type === "feed" && socialRef.current[index]?.offsetHeight >= 64 ? "socialText lineCut-4" : "socialText"}
                   onClick={() => goProfileDetailPage(detailPageParam)}
                   ref={el => socialRef.current[index] = el}
                   dangerouslySetInnerHTML={{__html: Utility.nl2br(item.feed_conts ? item.feed_conts : item.contents)}}
              />

              {type === 'feed' && item.photoInfoList.length > 0 &&
              <div className="swiperPhoto">
                {item.photoInfoList.length <= 2 ?
                  <div className="photo grid-2">
                    {item.photoInfoList.map((v, idx) => {return (<img key={idx} src={v.imgObj.thumb500x500} alt="" onClick={() => showImagePopUp(item?.photoInfoList, 'feedList', idx)} />)})}
                  </div>
                  : item.photoInfoList.length === 3 ?
                    <div className="photo grid-3">
                      {item.photoInfoList.map((v, idx) => {return (<div key={idx}><img src={v.imgObj.thumb500x500} alt="" onClick={() => showImagePopUp(item?.photoInfoList, 'feedList', idx)} /></div>)})}
                    </div>
                    : item.photoInfoList.length === 4 ?
                      <div className="photo grid-2">
                        {item.photoInfoList.map((v, idx) => {return (<div key={idx}><img src={v.imgObj.thumb500x500} alt="" onClick={() => showImagePopUp(item?.photoInfoList, 'feedList', idx)}/></div>)})}
                      </div>
                      : item.photoInfoList.length >= 5 &&
                      <>
                        <div className="photo grid-2">
                          {item.photoInfoList.map((v, idx) => {return (<div key={idx}>{idx <= 1 && <img src={v.imgObj.thumb500x500} alt="" onClick={() => showImagePopUp(item?.photoInfoList, 'feedList', idx)}/>}</div>)})}
                        </div>
                        <div className="photo grid-3">
                          <img src={item?.photoInfoList[2]?.imgObj?.thumb500x500} alt=""/>
                          <img src={item?.photoInfoList[3]?.imgObj?.thumb500x500} alt=""/>
                          <img src={item?.photoInfoList[4]?.imgObj?.thumb500x500} alt=""/>
                          <div className="photoMore">
                            <div className="none" onClick={() => showImagePopUp(item?.photoInfoList, 'feedList', 2)}/>
                            <div className="none" onClick={() => showImagePopUp(item?.photoInfoList, 'feedList', 3)}/>
                            {item.photoInfoList.length - 5 > 0 ?
                              <div className="count" onClick={() => showImagePopUp(item?.photoInfoList, 'feedList', 4)}>+{item.photoInfoList.length - 5}</div>
                              : <div className="none" onClick={() => showImagePopUp(item?.photoInfoList, 'feedList', 4)}/>
                            }
                          </div>
                        </div>
                      </>
                }
              </div>
              }

              <FeedLike data={item} fetchHandleLike={fetchHandleLike} type={"feed"} detailPageParam={detailPageParam} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SocialList;
