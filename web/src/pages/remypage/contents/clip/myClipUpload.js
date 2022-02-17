import React, {useCallback, useContext, useEffect, useState} from 'react'

import ListRow from 'components/ui/listRow/ListRow'
import GenderItems from 'components/ui/genderItems/GenderItems'
import DataCnt from 'components/ui/dataCnt/DataCnt'
import TabBtn from 'components/ui/tabBtn/TabBtn'
import Swiper from 'react-id-swiper'
import {useHistory} from "react-router-dom";
import _ from 'lodash';
import Api from "context/api";
import Utility from "components/lib/utility";
import {useSelector} from "react-redux";
import {Hybrid, isHybrid} from 'context/hybrid';
import {NewClipPlayerJoin} from "common/audio/clip_func";
import {Context} from "context";

const uploadTab = ['마이 클립','청취 회원','좋아요 회원','선물한 회원'];

const MyClipUpload =()=>{
  const context = useContext(Context);
  const history = useHistory();
  const [uploadType, setUploadType] = useState(uploadTab[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [myClipInfo, setMyClipInfo] = useState({total: 0, totalPage: 1, list: []});
  const [morePop, setMorePop] = useState(-1);

  // 스와이퍼 params
  const swiperParams = {
    slidesPerView: 'auto',
  }

  const playClip = (clipNo, index) => {
    if (!clipNo) return;
    const clipParam = { clipNo: clipNo, gtx: context, history };
    NewClipPlayerJoin(clipParam);
  };

  // 내클립업로드 목록
  const fetchMyClipUploadList = () => {
    // 1: 마이 클립, 2: 청취 회원, 3: 좋아요 회원, 4: 선물한 회원
    let myClipType = uploadTab.indexOf(uploadType) + 1;
    Api.getMyClipDetail({
      myClipType: myClipType,
      page: currentPage,
      records: 10
    }).then((res) => {
      const result = res.result;
      const data = res.data;
      const list = data.list;
      const paging = data.paging;

      if ( result === "success") {
        let items = paging.page > 1 ? myClipInfo.list.concat(list) : list;
        setMyClipInfo({total: paging.total, totalPage: paging.totalPage, list: items});
      } else {
        setMyClipInfo({total: 0, totalPage: 1, list: []});
        context.action.alert({msg: res.message});
      }
    }).catch((e) => console.log(e));
  };

  // 스크롤이벤트
  const scrollEvent = _.throttle(async () => {
    if (myClipInfo.totalPage > currentPage && Utility.isHitBottom()) {
      setCurrentPage(currentPage + 1);
    }
  }, 90);

  const openMorePop = (index) => {
    setMorePop(index);
  };

  const TotalWrap = () => {
    switch(uploadType){
      case '마이 클립':
       return(
        <div className='total'>
          <div className="title">내가 등록한 클립:</div>
          <span className="count">{myClipInfo.total}건</span>
        </div>
       )
      case '청취 회원':
        return(
          <div className='total'>
            <img src="https://image.dalbitlive.com/mypage/dalla/clip/ico_listener.png" className="icon" />
            <div className="title">최근 <span>3개월</span> 내 클립 청취 회원:</div>
            <span className="count">{myClipInfo.total}명</span>
          </div>
        )
      case '좋아요 회원':
        return(
          <div className='total'>
            <img src="https://image.dalbitlive.com/mypage/dalla/clip/ico_heart.png" className="icon" />
            <div className="title">최근 <span>3개월</span> 내 클립 좋아요한 회원:</div>
            <span className="count">{myClipInfo.total}명</span>
          </div>
        )
      case '선물한 회원':
        return(
          <div className='total'>
            <img src="https://image.dalbitlive.com/mypage/dalla/clip/ico_present.png" className="icon" />
            <div className="title">최근 <span>3개월</span> 내 클립 선물한 회원:</div>
            <span className="count">{myClipInfo.total}명</span>
          </div>
        )
      default:
        return(
          <div className='total'>
            <div className="title">내가 등록한 클립:</div>
            <span className="count">{myClipInfo.total}건</span>
          </div>
        )
    }
  };

  useEffect(async () => {
    setCurrentPage(1);
    setMyClipInfo({total: 0, totalPage: 1, list: []});
  }, [uploadType]);

  useEffect(async () => {
    await fetchMyClipUploadList();
  }, [currentPage, uploadType]);

  useEffect(() => {
    document.addEventListener('scroll', scrollEvent)
    return () => document.removeEventListener('scroll', scrollEvent)
  }, [myClipInfo])

  useEffect(() => {
    document.addEventListener('click', (e) => {
      if (e.target.className !== 'moreBtn' && e.target.className !== 'moreBtnType') {
        setMorePop(-1);
      }
    });
    return () => document.removeEventListener('click', {});
  },[]);

  return(
    <>
      <ul className="tabmenu">
        {uploadTab.length > 0 && 
          <Swiper {...swiperParams}>
            {uploadTab.map((data, index)=>{
              const param ={
                item: data,
                tab: uploadType,
                setTab: setUploadType,
              }
              return(
                <div key={index}>
                  <TabBtn param={param} />
                </div>
              )
            })}
          </Swiper>
        }
      </ul>
      <section className="totalWrap">
        <div className='total'>
          <TotalWrap />
        </div>
      </section>
      <section className="listWrap">
        {myClipInfo.list.map((item, index) => {
          return (<ListRow photo={item.bgImg.thumb80x80} key={index} photoClick={() => { playClip(item.clipNo, index) }}>
            <div className="listInfo">
              <div className="listItem">
                <span className="title">{item.title}</span>
              </div>
              <div className="listItem">
                <GenderItems data={item.gender} />
                <span className="nickNm">{item.nickName}</span>
              </div>
              <div className="listItem">
                <DataCnt type={"listenerCnt"} value={item.countPlay}/>
                <DataCnt type={"presentCnt"} value={item.countByeol}/>
                <DataCnt type={"goodCnt"} value={item.countGood}/>
                <DataCnt type={"replyCnt"} value={item.countReply}/>
              </div>
            </div>
            {uploadType === uploadTab[0] && 
              <div className="moreBtn" onClick={() => { openMorePop(index)} }>
                { morePop === index && <div className="moreBtnType" onClick={() => {
                }}>비공개</div>}
              </div>
            }
          </ListRow>
          )
        })}
        { !myClipInfo.list.length === 0 &&
          <>
            <div className="empty">
              <p>등록된 클립이 없어요<br/>클립을 업로드 해보세요!</p>
              <button onClick={() => history.push('/clip_upload')}>클립 업로드</button>
            </div>
          </>
        }
        </section>
    </>
  )
}

export default MyClipUpload