import React, {useEffect, useState, useContext} from 'react'
import {Context} from "context";

import Api from 'context/api'
import {convertDateFormat} from 'components/lib/dalbit_moment'
import moment from 'moment';

// global components
import Swiper from 'react-id-swiper'
import Header from 'components/ui/header/Header'
import CntTitle from 'components/ui/cntTItle/CntTitle'
// components
import ClipSubTitle from '../components/ClipSubTitle'
import HotClipList from '../components/HotClipList'
import SwiperList from '../components/SwiperList'
import NowClipList from '../components/NowClipList'
// contents
import ClipDetail from '../components/ClipDetail'


import '../scss/clipPage.scss'
import HotClip from "pages/clip/components/HotClip";
import NowClip from "pages/clip/components/NowClip";
import API from "context/api";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import errorImg from "pages/broadcast/static/img_originalbox.svg";
import {ClipPlayerJoin} from "common/audio/clip_func";

const ClipPage = () => {
  const context = useContext(Context);

  const history = useHistory();
  const subjectType = useSelector((state)=> state.clip.subjectType); //
  const [popularClipInfo, setPopularClipInfo] = useState([]); // 방금 떠오른 클립
  const [newClipInfo, setNewClipInfo] = useState([]); // 새로 등록한 클립
  const [hotClipInfo, setHotClipInfo] = useState([]); // 핫 클립
  const [likeClipInfo, setLikeClipInfo] = useState({}); // 좋아요한 클립
  const [listenClipInfo, setListenClipInfo] = useState({}); // 최근 들은 클립

  const [detail, setDetail] = useState(false)

  // 조회 Api
  /* 핫 클립 */
  const fetchHotClipInfo = () => {
    Api.getClipRankingList({ rankType: 1, rankingDate: '2022-01-24', page: 1, records: 9 }).then(res => {
      if (res.result === 'success') {
        let tempHotClipList = [];
        let temp = [];
        for (let i = 0; i < 9; i++) {

          if (res.data.list.length > i) {
            temp.push(res.data.list[i]);
          } else {
            temp.push([]);
          }

          if (i % 3 === 2) {
            tempHotClipList.push(temp);
            temp = [];
          }
        }
        setHotClipInfo(tempHotClipList);
      } else {

      }
    });
  }

  // 최신 클립
  const fetchNewClipInfo = () => {
    Api.getLatestList({listCnt: 10}).then((res) => {
      if (res.result === 'success') {
        setNewClipInfo(res.data.list)
      }
    })
  }

  // 좋아요 누른 클립 리스트 가져오기
  const getClipLikeList = () => {
    if (context.token.memNo === undefined) return;

    Api.getHistoryList({
      memNo: context.token.memNo, slctType: 1, page: 1, records: 100, }).then(res => {
      if (res.code === 'C001') {
        setLikeClipInfo(res.data);
      }
    })
  }


  // 최근들은 클립 리스트 가져오기
  const getClipListenList = () => {
    if (context.token.memNo === undefined) return;

    Api.getHistoryList({
      memNo: context.token.memNo, slctType: 0, page: 1, records: 100, }).then(res => {
      if (res.code === 'C001') {
        setListenClipInfo(res.data);
      }
    })
  };

  // 방금 떠오른 클립 리스트 가져오기
  const getClipLastList = () => {
    API.getClipList({ search: '', slctType: 1, dateType: 0, page: 1, records: 9 }).then(res => {
      if (res.code === 'C001') {
        let tempHotClipList = [];
        let temp = [];
        for (let i = 0; i < res.data.paging.records; i++) {

          if (res.data.paging.records > i) {
            temp.push(res.data.list[i]);
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
    })
  };

  const handleSubjectClick = (e) => {
    const { value } = e.currentTarget.dataset;

    if (value !== undefined) {
      history.push(`/clip/detail/${value}`);
    }
  };

  const playClip = (e) => {
    const { clipNo } = e.currentTarget.datset;

    if (clipNo !== undefined) {
      /*ClipPlayerJoin(e);
      ClipPlayerJoin(clipNo, globalCtx, history);*/
      history.push(`/clip/${clipNo}`);
    }
  };

  // 스와이퍼 params
  const swiperParams = {
    slidesPerView: 'auto',
  };

  useEffect(() => {
    fetchHotClipInfo();
    fetchNewClipInfo();

    getClipLastList();
    getClipLikeList();
    getClipListenList();
  },[])

  return (
    <>
      {detail === false &&
      <div id="clipPage" style={{width: '780px', margin: 'auto'}}>
        <Header title={'클립'} />
        {/*{hotClipInfo && hotClipInfo.length > 0 &&
        <section className='hotClipWrap'>
          <CntTitle title={'지금, 핫한 클립을 한눈에!'} more={'/'} />
          <HotClipList data={hotClipInfo} />
        </section>
        }*/}
        <section className='hotClipWrap'>
          <CntTitle title={'지금, 핫한 클립을 한눈에!'} more={'/clip_rank'} />
          {hotClipInfo.length > 0 &&
            <Swiper {...swiperParams}>
              {hotClipInfo.map((row, index) => {
                return (<div key={index}>
                  {row.map((coreRow, coreIndex) => {
                      return (<HotClip key={coreIndex} info={coreRow}/>)
                    })}
                </div>);
              })}
            </Swiper>}
        </section>
        <section className='bannerWrap'>
          <Swiper {...swiperParams}>
            <div className="bannerBox">
              <div className="bannerItem"/>
            </div>
            <div className="bannerBox">
              <div className="bannerItem"/>
            </div>
          </Swiper>
        </section>
        <section className="clipDrawer">
          {(listenClipInfo.list > 0 || likeClipInfo.list >0 ) &&
            <div className="cntTitle">
              <h2><span className="nickName">{context.profile.nickNm}</span>님의 클립서랍</h2>
            </div>
          }
          {listenClipInfo.list &&
            <>
              <ClipSubTitle title={'최근 들은 클립'} more={'clip/listen/list'}/>
              <SwiperList data={listenClipInfo.list} />
            </>
          }
          {likeClipInfo.list &&
            <>
              <ClipSubTitle title={'좋아요 한 클립'} more={'clip/like/list'}/>
              <SwiperList data={likeClipInfo.list} />
            </>
          }
        </section>
        <section className="nowClipWrap">
          {popularClipInfo.length > 0 &&
          <>
            <CntTitle title={'방금 떠오른 클립'} more={'/'} />
            <Swiper {...swiperParams}>
              {popularClipInfo.map((row, index) => {
                console.log(row);
                return (<div key={index}>
                  {row.map((coreRow, coreIndex) => {
                    if (Object.keys(coreRow).length > 0) {
                      return (<NowClip key={coreIndex} info={coreRow}/>)
                    } else {
                      return <></>;
                    }
                  })}
                </div>);
              })}
            </Swiper>
          </>
          }
        </section>
        <section className='likeSubWrap'>
          <CntTitle title={'좋아하는 주제를 골라볼까요?'} more={'/clip/detail/00'} />
          <Swiper {...swiperParams}>
            {subjectType.map((list, index)=>{
              return (
                <div className="likeSubWrap" key={index} data-value={list.value} onClick={handleSubjectClick}>
                  <div className="likeSub">
                    <p>{list.icon}</p>
                    <p>{list.cdNm}</p>
                  </div>
                </div>
              );
            })}
          </Swiper>
        </section>
        <section className="clipList">
          <CntTitle title={'고민 / 사연 은 어떠세요?'}>
            <button>새로고침</button>
          </CntTitle>
          <SwiperList data={newClipInfo} />
        </section>
      </div>
      }
      {/*{detail === true &&
      <ClipDetail data={popularClipInfo} />
      }*/}
    </>
  );
};

export default ClipPage;