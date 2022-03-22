import React, {useCallback, useContext, useEffect, useState} from 'react'

import ListRow from 'components/ui/listRow/ListRow'
import GenderItems from 'components/ui/genderItems/GenderItems'
import DataCnt from 'components/ui/dataCnt/DataCnt'
import TabBtn from 'components/ui/tabBtn/TabBtn'
import Swiper from 'react-id-swiper'
import {useHistory} from "react-router-dom";
import _ from 'lodash';
import Utility from "components/lib/utility";
import {NewClipPlayerJoin} from "common/audio/clip_func";
import Api from "common/api";
import API from "context/api";
import {rtcSessionClear, UserType} from "common/realtime/rtc_socket";
import TabButton from "components/ui/tabBtn/TabButton";
import errorImg from "pages/broadcast/static/img_originalbox.svg";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";


const MyClipUpload = (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const history = useHistory();
  const uploadTab = ['마이 클립', '청취 회원', '좋아요 회원', '선물한 회원'];
  const [myClipInfo, setMyClipInfo] = useState({total: 0, totalPage: 1, list: []});
  const [morePop, setMorePop] = useState(-1);
  const [searchInfo, setSearchInfo] = useState({myClipType: 0, page: 1, records: 10});

  // 스와이퍼 params
  const swiperParams = {
    slidesPerView: 'auto',
  }

  const playClip = (clipNo, memNo) => {
    if (searchInfo.myClipType === 0) {
      if (!clipNo) return;
      const playListInfoData = {
        memNo: globalState.baseData.memNo,
        page: 1,
        records: 100
      }

      localStorage.setItem(
        "clipPlayListInfo",
        JSON.stringify(playListInfoData)
      );
      const clipParam = {clipNo: clipNo, globalState, dispatch, history};
      NewClipPlayerJoin(clipParam);
    } else {
      if (!memNo) return;
      history.push(`/profile/${memNo}`);
    }

  };

  // 내클립업로드 목록
  const fetchMyClipUploadList = () => {
    // 1: 마이 클립, 2: 청취 회원, 3: 좋아요 회원, 4: 선물한 회원
    API.getMyClipDetail({...searchInfo, myClipType: searchInfo.myClipType + 1}).then((res) => {
      const data = res.data;
      const list = data.list;
      const paging = data.paging;

      if (res.code === 'C001') {
        if (searchInfo.page !== 1) {
          let temp =  [];
          list.forEach(value => {
            if (myClipInfo.list.findIndex(target => target.clipNo === value.clipNo) === -1) {
              temp.push(value);
            }
          })
          setMyClipInfo({...res.data, total: paging.total, totalPage: paging.totalPage, list: myClipInfo.list.concat(temp)});
        } else {
          setMyClipInfo({...res.data, total: paging.total, totalPage: paging.totalPage, list: res.data.list});
        }
      } else {
        setMyClipInfo({total: 0, totalPage: 1, list: []});
        dispatch(setGlobalCtxMessage({type: "alert",msg: res.message}));
      }
    }).catch((e) => console.log(e));
  };

  // 스크롤이벤트
  /*const scrollEvent = _.throttle(async () => {
    if (myClipInfo.totalPage > currentPage && Utility.isHitBottom()) {
      setCurrentPage(currentPage + 1);
    }
  }, 90);*/

  // 스크롤이벤트
  const scrollEvent = () => {
    if (myClipInfo.totalPage > searchInfo.page && Utility.isHitBottom()) {
      setSearchInfo({...searchInfo, page: searchInfo.page + 1});
      window.removeEventListener('scroll', scrollEvent);
    } else if (myClipInfo.totalPage === searchInfo.page) {
      window.removeEventListener('scroll', scrollEvent);
    }
  };

  const openMorePop = (index) => {
    setMorePop(index);
  };

  const TotalWrap = () => {
    switch (uploadTab[searchInfo.myClipType]) {
      case '마이 클립':
        return (
          <div className='total'>
            <div className="title">내가 등록한 클립:</div>
            <span className="count">{myClipInfo.total}건</span>
          </div>
        )
      case '청취 회원':
        return (
          <div className='total'>
            <img src="https://image.dalbitlive.com/mypage/dalla/clip/ico_listener.png" className="icon"/>
            <div className="title">최근 <span>3개월</span> 내 클립 청취 회원:</div>
            <span className="count">{myClipInfo.total}명</span>
          </div>
        )
      case '좋아요 회원':
        return (
          <div className='total'>
            <img src="https://image.dalbitlive.com/mypage/dalla/clip/ico_heart.png" className="icon"/>
            <div className="title">최근 <span>3개월</span> 내 클립 좋아요한 회원:</div>
            <span className="count">{myClipInfo.total}명</span>
          </div>
        )
      case '선물한 회원':
        return (
          <div className='total'>
            <img src="https://image.dalbitlive.com/mypage/dalla/clip/ico_present.png" className="icon"/>
            <div className="title">최근 <span>3개월</span> 내 클립 선물한 회원:</div>
            <span className="count">{myClipInfo.total}명</span>
          </div>
        )
      default:
        return (
          <div className='total'>
            <div className="title">내가 등록한 클립:</div>
            <span className="count">{myClipInfo.total}건</span>
          </div>
        )
    }
  };

  const handleTabClick = (value) => {
    const target = uploadTab.findIndex(row => row === value);

    if (target !== searchInfo.myClipType) {
      setSearchInfo({...searchInfo, page: 1, myClipType: target});
    }

  };

  const closeMoreButton = (e) => {
    setMorePop(-1);
  }

  const updUloadClip = (e) => {
    const { clipNo } = e.currentTarget.dataset;

    let tempList = myClipInfo.list
    const target = tempList.findIndex(value => value.clipNo == clipNo);

    if (target === -1) return;

    API.editMyClipDetail({ clipNo, openType: (tempList[target].openType ? 0 : 1) }).then(res => {
      if (res.code === '0') {
        tempList[target].openType = (tempList[target].openType ? 0 : 1);
        setMyClipInfo({...myClipInfo, list: tempList});
        setMorePop(-1);

        dispatch(setGlobalCtxMessage({type: "alert",msg: `클립을 ${tempList[target].openType ? '공개' : '비공개'}하였습니다.`}));
      }
    })
  };

  const handleImgError = (e) => {
    e.currentTarget.src = errorImg;
  };

  useEffect(() => {
    window.addEventListener('scroll', scrollEvent);
    return () => {
      window.removeEventListener('scroll', scrollEvent);
    }
  }, [myClipInfo]);

  useEffect(async () => {
    fetchMyClipUploadList();
  }, [searchInfo]);


  return (
    <>
      <ul className="tabmenu">
        {uploadTab.length > 0 &&
        <Swiper {...swiperParams}>
          {uploadTab.map((data, index) => {
            const target = uploadTab[searchInfo.myClipType];
            return (<div key={index}><TabButton target={target} item={data} tabChangeAction={handleTabClick}/></div>);
          })}
        </Swiper>
        }
      </ul>
      <section className="totalCountWrap">
        <div className='total'>
          <TotalWrap/>
        </div>
      </section>
      <section className="listWrap">
        {myClipInfo.list.map((item, index) => {
          return (
            <div className="listRow" key={index}>
              <div className="photo" onClick={() => { playClip(item.clipNo, item.memNo) }}>
                {(searchInfo.myClipType === 0 && item.openType === 0) && <div className="photoLock"/>}
                <img src={searchInfo.myClipType === 0 ? item.bgImg.thumb292x292 : item.profImg.url} alt="" onError={handleImgError}/>
              </div>
              <div className="listInfo">
                <div className="listItem">
                  <span className="title">{item.title}</span>
                </div>
                <div className="listItem">
                  {searchInfo.myClipType === 0 ?
                    <>
                      <GenderItems data={item.gender}/>
                      <span className="nickNm">{item.nickName}</span>
                    </>
                  :
                    <>
                      <span className="nickNm">{item.nickName}</span>
                      <GenderItems data={item.gender}/>
                    </>
                  }
                </div>
                <div className="listItem">
                  {(searchInfo.myClipType === 0 || searchInfo.myClipType === 1) && <DataCnt type={"listenerCnt"} value={item.countPlay}/>}
                  {(searchInfo.myClipType === 0 || searchInfo.myClipType === 3) && <DataCnt type={"presentCnt"} value={item.countByeol}/>}
                  {(searchInfo.myClipType === 0 || searchInfo.myClipType === 2) && <DataCnt type={"goodCnt"} value={item.countGood}/>}
                  {searchInfo.myClipType === 0 && <DataCnt type={"replyCnt"} value={item.countReply}/>}
                </div>
              </div>
              {searchInfo.myClipType === 0 &&
              <div className="moreBtn" onClick={() => { openMorePop(index) }}>
                {morePop === index && <div className="moreBtnType" data-clip-no={item.clipNo} onClick={updUloadClip}>{item.openType === 1 ? '비공개' : '공개'}</div>}{/* 1이면 공개를 해야함, 0이면 비공개를 해야함. 즉, 반대로 해야함*/}
              </div>
              }
            </div>
          )
        })}
        {myClipInfo.list.length === 0 &&
        <>
          <div className="empty">
            <p>등록된 클립이 없어요<br/>클립을 업로드 해보세요!</p>
          </div>
        </>
        }
        {morePop !== -1 && <div className="closeArea" onClick={closeMoreButton}/>}
      </section>
    </>
  )
};

export default MyClipUpload;
