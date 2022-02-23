import React, { useEffect, useState, useContext } from 'react'
import { Context } from "context";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { NewClipPlayerJoin } from "common/audio/clip_func";
import { IMG_SERVER } from "context/config";
import { setIsRefresh } from "redux/actions/common";
import Api from 'context/api';
import moment from 'moment';
import Swiper from 'react-id-swiper';

// global components
import Header from 'components/ui/header/Header';
import CntTitle from 'components/ui/cntTitle/CntTitle';
import BannerSlide from 'components/ui/bannerSlide/BannerSlide';

// components
import ClipSubTitle from './components/ClipSubTitle';
import SwiperList from './components/SwiperList';
import HotClip from "pages/clip/components/HotClip";
import NowClip from "pages/clip/components/NowClip";

import './scss/clipPage.scss';

const ClipPage = () => {
  const context = useContext(Context);
  const history = useHistory();
  const dispatch = useDispatch();
  const common = useSelector(state => state.common);
  const subjectType = useSelector((state)=> state.clip.subjectType); // 검색 조건

  const bgColor = ['#DEE7F7', '#EFE9FA', '#FDE0EE', '#FAE7DA', '#FFEED6', '#EBF2DF', '#E0F2EE', '#E2F1F7', '#FAE1E1']; // 떠오른 클립 배경 색상, IMG 오류 나면 뿌려질 색상값.

  const [popularClipInfo, setPopularClipInfo] = useState([]); // 방금 떠오른 클립
  const [hotClipInfo, setHotClipInfo] = useState({list: [], cnt: 0}); // 핫 클립
  const [likeClipInfo, setLikeClipInfo] = useState({ list: [], paging: {} }); // 좋아요한 클립
  const [listenClipInfo, setListenClipInfo] = useState({ list: [], paging: {} }); // 최근 들은 클립
  const [subClipInfo, setSubClipInfo] = useState({ list: [], paging: {} }); // 아래 카테고리별 리스트

  const [subSearchInfo, setSubSearchInfo] = useState(subjectType[1]); // 아래 카테고리별 검색 조건

  // 조회 Api
  /* 핫 클립 */
  const getHotClipInfo = () => {
    Api.getClipRankingList({ rankType: 1, rankingDate: moment().format('YYYY-MM-DD'), page: 1, records: 9 }).then(res => {
      if (res.code === 'C001') {
        let tempHotClipList = [];
        let temp = [];
        let maxCnt = res.data.paging.total < 9 ? res.data.paging.total : 9;
        for (let i = 0; i < maxCnt; i++) {
          if (res.data.list.length > i) {
            temp.push(res.data.list[i]);
          } else {
            temp.push([]);
          }

          if (i % 3 === 2 || (i + 1) == res.data.paging.total) {
            tempHotClipList.push(temp);
            temp = [];
          }
        }
        setHotClipInfo({ list: tempHotClipList, cnt: res.data.paging.total});
      } else {
        if (hotClipInfo.list.length > 0) setHotClipInfo({ list: [], cnt: 0});
      }
    });
  };

  // 좋아요 누른 클립 리스트 가져오기
  const getClipLikeList = () => {
    if (context.token.memNo === undefined) return;

    Api.getHistoryList({ memNo: context.token.memNo, slctType: 1, page: 1, records: 100, }).then(res => {
      if (res.code === 'C001') {
        setLikeClipInfo(res.data);
      }
    });
  };


  // 최근들은 클립 리스트 가져오기
  const getClipListenList = () => {
    if (context.token.memNo === undefined) return;

    Api.getHistoryList({ memNo: context.token.memNo, slctType: 0, page: 1, records: 100, }).then(res => {
      if (res.code === 'C001') {
        setListenClipInfo(res.data);
      }
    });
  };

  // 방금 떠오른 클립 리스트 가져오기
  const getClipLastList = () => {
    Api.getClipList({ search: '', slctType: 1, dateType: 0, page: 1, records: 9 }).then(res => {
      if (res.code === 'C001') {
        let tempHotClipList = [];
        let temp = [];
        let randomColor = bgColor.sort(() => Math.random() - 0.5)

        for (let i = 0; i < res.data.paging.records; i++) {


          if (res.data.paging.records > i) {
            temp.push({ ...res.data.list[i], randomBg: randomColor[i]});
          } else {
            temp.push({});
          }

          if (i % 3 === 2) {
            tempHotClipList.push(temp);
            temp = [];
          }
        }

        setPopularClipInfo(tempHotClipList);
      }
    });
  };

  const getClipList = () => {
    Api.getClipList({ gender: '', djType: 0, slctType: 1, dateType: 0, page: 1, records: 5, subjectType: subSearchInfo.value }).then(res => {
      if (res.code === 'C001') {
        setSubClipInfo({ list: res.data.list, paging: {...res.data.paging}});
      }
    });
  };

  const handleSubjectClick = (e) => {
    const { value } = e.currentTarget.dataset;

    if (value !== undefined && value !== '') {
      history.push(`/clip/detail/${value}`);
    } else {
      history.push(`/clip/detail/00`);
    }
  };

  const changeList = () => {
    const target = subjectType.findIndex(value => value.value === subSearchInfo.value);

    if (target === (subjectType.length - 1)) {
      setSubSearchInfo(subjectType[1]);
    } else {
      setSubSearchInfo(subjectType[target + 1]);
    }
  };

  const playClip = (e) => {
    const { clipNo } = e.currentTarget.dataset;

    if (clipNo !== undefined) {
      const clipParam = { clipNo: clipNo, gtx: context, history };

      NewClipPlayerJoin(clipParam);
    }
  };

  // 스와이퍼 params
  const swiperParams = {
    slidesPerView: 'auto',
  };
  const nowSwiperParams ={
    slidesPerView: 'auto',
    spaceBetween: 16,
  }

  // 링크 다시 눌렀을때, 액션
  const refreshActions = () => {
    window.scrollTo(0, 0);

    getHotClipInfo();
    getClipLastList();
    getClipLikeList();
    getClipListenList();

    setSubSearchInfo(subjectType[1]);

    dispatch(setIsRefresh(false));
  };

  useEffect(() => {
    getHotClipInfo();
    getClipLastList();
    getClipLikeList();
    getClipListenList();
  }, []);

  useEffect(() => {
    getClipList();
  }, [subSearchInfo]);

  useEffect(() => {
    if(common.isRefresh) {
      refreshActions();
    }
  }, [common.isRefresh]);

  return (
    <>
      <div id="clipPage" >
        <Header title={'클립'} />
        <section className='hotClipWrap'>
          <CntTitle title={'지금, 핫한 클립을 한눈에!'} more={'/clip_rank'} />
          {hotClipInfo.list.length > 0 ?
            <Swiper {...swiperParams}>
              {hotClipInfo.list.map((row, index) => {
                return (<div key={index}>
                  {row.map((coreRow, coreIndex) => {
                    if (Object.keys(coreRow).length > 0) {
                      return (<HotClip key={coreIndex} info={coreRow} playAction={playClip}/>);
                    }
                  })}
                </div>);
              })}
            </Swiper>
            :
            <div className="empty">데이터가 없습니다.</div>
          }
        </section>
        <section className='bannerWrap'>
          <BannerSlide type={10}/>
        </section>
        <section className='likeSubWrap'>
          <CntTitle title={'좋아하는 주제를 골라볼까요?'} more={'/clip/detail/00'} />
          <Swiper {...swiperParams}>
            {subjectType.map((list, index)=>{
              return (
                <div className="likeSubWrap" key={index} data-value={list.value} onClick={handleSubjectClick}>
                  <div className="likeSub">
                    <img src={`${IMG_SERVER}/clip/dalla/${list.icon}`} alt={list.cdNm}/>
                    <p>{list.cdNm}</p>
                  </div>
                </div>
              );
            })}
          </Swiper>
        </section>
        <section className="clipDrawer">
          {(listenClipInfo.list.length > 0 || likeClipInfo.list.length > 0 ) &&
          <div className="cntTitle">
            <h2><span className="nickName">{context.profile.nickNm}</span>님의 클립서랍</h2>
          </div>
          }
          {listenClipInfo.list.length > 0 &&
          <>
            <ClipSubTitle title={'최근 들은 클립'} more={'clip/listen/list'}/>
            <SwiperList data={listenClipInfo.list} playAction={playClip} />
          </>
          }
          {likeClipInfo.list.length > 0 &&
          <div className="mgt24">
            <ClipSubTitle title={'좋아요한 클립'} more={'clip/like/list'}/>
            <SwiperList data={likeClipInfo.list} playAction={playClip} />
          </div>
          }
        </section>
        <section className="nowClipWrap">
          <CntTitle title={'방금 떠오른 클립'} more={'/clip/detail/00'} />
          {popularClipInfo.length > 0 ?
            <Swiper {...nowSwiperParams}>
              {popularClipInfo.map((row, index) => {
                return (
                  <div key={index}>
                    <div>
                      {row.map((coreRow, coreIndex) => {
                        if (Object.keys(coreRow).length > 0) {
                          return (<NowClip key={coreIndex} info={coreRow} playAction={playClip} />)
                        } else {
                          return <></>;
                        }
                      })}
                    </div>
                  </div>
                );
              })}
            </Swiper>
            :
            <div className="empty">데이터가 없습니다.</div>
          }
        </section>
        <section className="clipList">
          <div className="cntTitle">
            <h2><img src={`${IMG_SERVER}/clip/dalla/${subSearchInfo.icon}`} alt={subSearchInfo.cdNm}/>{`${subSearchInfo.cdNm}은(는) 어떠세요?`}</h2>
            <button onClick={changeList}>새로고침</button>
          </div>
          <SwiperList data={subClipInfo.list} playAction={playClip}/>
        </section>
      </div>
    </>
  );
};

export default ClipPage;