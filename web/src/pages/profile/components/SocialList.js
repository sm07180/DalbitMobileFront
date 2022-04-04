import React, {useContext, useEffect, useState} from 'react'

// global components
import DataCnt from 'components/ui/dataCnt/DataCnt'
// css
import './socialList.scss'
import ListRowComponent from "./ListRowComponent";
import Swiper from "react-id-swiper";
import {useHistory} from "react-router-dom";
import {goProfileDetailPage} from "pages/profile/contents/profileDetail/profileDetail";
import {Context} from "context";
import Utility from "components/lib/utility";
import {useDispatch, useSelector} from "react-redux";

const SocialList = (props) => {
  const {socialList, openShowSlide, isMyProfile, type, openBlockReportPop, deleteContents, profileData, fetchHandleLike} = props
  const history = useHistory();
  const context = useContext(Context);
  const {profile} = context;
  const dispatch = useDispatch();
  const profileTab = useSelector(state => state.profileTab);
  const [contentsHeight, setContentsHeight] = useState([]);

  const photoClickEvent = (memNo) => {
    if (type === 'fanBoard') {history.push(`/profile/${memNo}`)}
  }

  useEffect(() => {
    setContentsHeight(document.getElementsByClassName("socialText"));
  }, [contentsHeight]);

  return (
    <div className="socialListWrap">
      {socialList.map((item, index) => {
        if (type === 'fanBoard' && (item?.viewOn === 0 && !isMyProfile && item.mem_no !== context.profile.memNo)) {
          return <React.Fragment key={item.replyIdx}/>
        }

        const memNo = type === 'feed' ? profileData.memNo : item?.writerMemNo; //글 작성자
        const detailPageParam = {history, action: 'detail', type, index: item.reg_no ? item.reg_no : item.replyIdx, memNo: profileData.memNo, dispatch, profileTab};
        const modifyParam = {history, action: 'modify', type, index: item.reg_no ? item.reg_no : item.replyIdx, memNo: profileData.memNo, dispatch, profileTab};
        return (
          <div className='socialList' key={item.reg_no ? item.reg_no : item.replyIdx}>
            <ListRowComponent item={item} isMyProfile={isMyProfile} index={index} type={type}
                              openBlockReportPop={openBlockReportPop}
                              modifyEvent={() => {
                                memNo === profile.memNo && goProfileDetailPage(modifyParam)
                              }}
                              deleteEvent={() => deleteContents(type, item.reg_no ? item.reg_no : item.replyIdx, profileData.memNo)}
                              photoClick={() => {
                                photoClickEvent(item.mem_no)
                              }}
            />
            <div className="socialContent">
              <div className={type === "feed" && contentsHeight[index]?.offsetHeight >= 64 ? "socialText lineCut-4" : "socialText"}
                   onClick={() => goProfileDetailPage(detailPageParam)}
                   dangerouslySetInnerHTML={{__html: Utility.nl2br(item.feed_conts ? item.feed_conts : item.contents)}}
              />
              {type === 'feed' && item.photoInfoList.length > 0 &&
              <div className="swiperPhoto" onClick={() => goProfileDetailPage(detailPageParam)}>
                {item.photoInfoList.length <= 2 ?
                  <div className="photo grid-2">
                    {item.photoInfoList.map((v, idx) => {return (<img key={idx} src={v.imgObj.thumb500x500} alt="" />)})}
                  </div>
                  : item.photoInfoList.length === 3 ?
                    <div className="photo grid-3">
                      {item.photoInfoList.map((v, idx) => {return (<div key={idx}><img src={v.imgObj.thumb500x500} alt="" /></div>)})}
                    </div>
                    : item.photoInfoList.length === 4 ?
                      <div className="photo grid-2">
                        {item.photoInfoList.map((v, idx) => {return (<div key={idx}><img src={v.imgObj.thumb500x500} alt="" /></div>)})}
                      </div>
                      : item.photoInfoList.length >= 5 &&
                      <>
                        <div className="photo grid-2">
                          {item.photoInfoList.map((v, idx) => {return (<div key={idx}>{idx <= 1 && <img src={v.imgObj.thumb500x500} alt=""/>}</div>)})}
                        </div>
                        <div className="photo grid-3">
                          <img src={item?.photoInfoList[2]?.imgObj?.thumb500x500} alt="" />
                          <img src={item?.photoInfoList[3]?.imgObj?.thumb500x500} alt="" />
                          <img src={item?.photoInfoList[4]?.imgObj?.thumb500x500} alt="" />
                          <div className="photoMore">
                            <div className="none"/>
                            <div className="none"/>
                            {item.photoInfoList.length - 5 > 0 ?
                              <div className="count">+{item.photoInfoList.length - 5}</div>
                              : <div className="none"/>
                            }
                          </div>
                        </div>
                      </>
                }
              </div>
              }

              <div className="info">
                {type === "feed" && item.like_yn === "n" ?
                  <i className="likeOff" onClick={() => fetchHandleLike(item.reg_no, item.mem_no, item.like_yn)}>{item.rcv_like_cnt ? Utility.printNumber(item.rcv_like_cnt) : 0}</i>
                  : type === "feed" && item.like_yn === "y" &&
                  <i className="likeOn" onClick={() => fetchHandleLike(item.reg_no, item.mem_no, item.like_yn)}>{item.rcv_like_cnt ? Utility.printNumber(item.rcv_like_cnt) : 0}</i>
                }

                {type === "feed" ?
                  <i className="cmt" onClick={() => goProfileDetailPage(detailPageParam)}>{item.tail_cnt}</i>
                  :
                  <i className="cmt" onClick={() => goProfileDetailPage(detailPageParam)}>{item.replyCnt}</i>
                }
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SocialList;
