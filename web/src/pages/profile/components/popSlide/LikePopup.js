import React, {useState, useEffect, useRef, useCallback} from 'react'

import Api from 'context/api'
import moment from 'moment'
// global components
import ListRow from 'components/ui/listRow/ListRow'
import NoResult from 'components/ui/noResult/NoResult'
import LayerPopup from 'components/ui/layerPopup/LayerPopup'
// components

import './style.scss'
import {useDispatch} from "react-redux";
import {setProfileData} from "redux/actions/profile";

const myProfileTabInfos = {
  titleTab: [
    {key: 'fanRank', value: '팬 랭킹'},
    {key: 'totalRank', value: '전체 랭킹'},
  ],
  subTab: {
    fanRank: [{key: 'recent', value: '최근', rankType: 1, rankSlct: 1}, {key: 'accumulation', value: '누적', rankType: 2, rankSlct: 1}],
    totalRank: [{key: 'present', value:'선물', rankType: 1, rankSlct: 2}, {key: 'totalRankLike', value:'좋아요'}],
  }
}

const notMyProfileTabInfos = {
  titleTab: [{key: 'rank', value: '랭킹'}],
  subTab: {
    rank: [
      {key: 'recentFan', value: '최근팬', rankType: 1, rankSlct: 1},
      {key: 'accumulationFan', value: '누적팬', rankType: 2, rankSlct: 1},
      {key: 'like', value: '좋아요'}
    ]
  }
}

const pagePerCnt = 20;

const LikePopup = (props) => {
  const {isMyProfile, fanToggle, profileData, goProfile, setPopLike, myMemNo, scrollEvent} = props
  const dispatch = useDispatch();
  const likeContainerRef = useRef();

  const [showList, setShowList] = useState([]); // 리스트

  // 팝업 제목 (탭 or 텍스트)
  const [titleTabInfoList, setTitleTabInfoList] = useState(
    isMyProfile ? myProfileTabInfos.titleTab : notMyProfileTabInfos.titleTab
  );
  const [currentTitleTabInfo, setCurrentTitleTabInfo] = useState(isMyProfile ? myProfileTabInfos.titleTab[1] : notMyProfileTabInfos.titleTab[0]);

  // 서브 탭
  const [currentSubTabInfo, setCurrentSubTabInfo] = useState(
    isMyProfile ? myProfileTabInfos.subTab.totalRank[1] : notMyProfileTabInfos.subTab.rank[2]
  ); // 현재 선택된 서브탭
  const [fanRankSubTabInfo, setFanRankSubTabInfo] = useState(myProfileTabInfos.subTab.fanRank[0]); // 팬랭킹 탭에서의 서브탭
  const [totalRankSubTabInfo, setTotalRankSubTabInfo] = useState(myProfileTabInfos.subTab.totalRank[1]); // 전체랭킹 탭에서의 서브탭
  // const [rankSubTabInfo, setRankSubTabInfo] = useState({}); // 타회원 프로필 서브탭

  // 스크롤 페이징
  const [pageNo, setPageNo] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);

  // 좋아요 랭킹기준 안내팝업
  const [noticePop, setNoticePop] = useState(false);

  /* 내프로필 -> 전체랭킹 - 좋아요 */
  const totalRankLikeApi = () => {
    const apiParams = {
      memNo: profileData.memNo,
      page: pageNo,
      records: pagePerCnt
    }
    Api.mypage_good_ranking({params: apiParams}).then((res) => {
      apiSuccessAction(res);
    })
  }

  /* 전체랭킹-선물, 2.팬랭킹-최근, 3.팬랭킹-누적 */
  // 프로시져에서 rankType, rankSlct가 null || 1 이면 xx 조회 else xx 조회 (기존에 2를 줘서 똑같이 따라하긴 함)
  // 1. 전체랭킹 - 선물 : rankType: 1, rankSlct: 2
  // 2. 팬랭킹 - 최근   : rankType: 1, rankSlct: 1
  // 3. 팬랭킹 - 누적   : rankType: 2, rankSlct: 1
  const fanRankApi = (rankType, rankSlct) => {
    const apiParams = {
      memNo: profileData.memNo,
      page: pageNo,
      records: pagePerCnt,
      rankType,
      rankSlct,
    }
    Api.mypage_fan_ranking({params: apiParams}).then(res => {
      apiSuccessAction(res);
    })
  }

  const apiSuccessAction = (res) => {
    if (res.result === 'success') {
      const data = res.data;
      const isLastPage = data.list.length > 0 ? data.paging.totalPage === pageNo : true;

      if(pageNo > 1) {
        const concatData = [...showList].concat(data.list);
        setShowList(concatData);
      }else {
        setShowList(data.list)
      }
      setIsLastPage(isLastPage);
    }
  }

  /* 팬 등록/해제시 값 변경 */
  const fanToggleCallback = (idx, isFan) => {
    const assignList = [...showList];
    assignList[idx].isFan = !isFan;

    /* api에서 조회하지 않고 스크립트로만 스타수 +- 시킴 (팬,스타,좋아요 리스트 api 조회시에는 각각 갱신함) */
    if(isMyProfile) {
      if(isFan) { // 팬 해제 후
        dispatch(setProfileData({...profileData, starCnt: profileData.starCnt -1}));
      }else { // 팬 등록 후
        dispatch(setProfileData({...profileData, starCnt: profileData.starCnt +1}));
      }
    }
    setShowList(assignList);
  }

  /* 프로필 이동 */
  const goProfileAction = (targetMemNo) => {
    goProfile(targetMemNo)
    setPopLike(false);
  }

  const pagingReset = () => {
    if(!isLastPage) removeScrollEvent();
    setPageNo(1);
    setIsLastPage(false);
    addScrollEvent();
  }

  /* 제목 탭 클릭 (작업 기준 마이프로필에서 팬랭킹, 전체랭킹만 있음) */
  const titleTabClick = (data) => {
    setCurrentTitleTabInfo(data);
    if(data.key === 'fanRank') {
      setCurrentSubTabInfo(fanRankSubTabInfo);
    }else if(data.key === 'totalRank') {
      setCurrentSubTabInfo(totalRankSubTabInfo);
    }

    pagingReset();
  }

  const subTabClick = (data) => {
    /* 타이틀 탭 변경시 이전탭 기억하기 위해.. */
    if(currentTitleTabInfo.key === 'fanRank') {
      setFanRankSubTabInfo(data);
    }else if(currentTitleTabInfo.key === 'totalRank') {
      setTotalRankSubTabInfo(data);
    }/*else if(currentTitleTabInfo.key === 'rank') { // 타회원 프로필에서는 타이틀 탭이 없어서 기억할 필요 없어서 주석
      setRankSubTabInfo(data);
    }*/
    setCurrentSubTabInfo(data);

    pagingReset();
  }

  /* 스크롤 페이징 이벤트 */
  const popScrollEvent = () => {
    scrollEvent(likeContainerRef.current, () => setPageNo(pageNo => pageNo +1));
  }

  const addScrollEvent = () => {
    likeContainerRef.current.addEventListener('scroll', popScrollEvent);
  }

  const removeScrollEvent = useCallback(() => {
    const scrollTarget = likeContainerRef.current;
    if(scrollTarget) {
      scrollTarget.removeEventListener('scroll', popScrollEvent);
    }
  }, []);

  useEffect(() => {
    if(!isLastPage && currentSubTabInfo.key) {
      if(currentSubTabInfo.key === 'totalRankLike' || currentSubTabInfo.key === 'like') {
        totalRankLikeApi();
      }else {
        fanRankApi(currentSubTabInfo.rankType, currentSubTabInfo.rankSlct);
      }
    }
  }, [pageNo, currentSubTabInfo]);

  useEffect(() => {
    if(isLastPage){
      removeScrollEvent();
    }
  }, [isLastPage])

  useEffect(() => {
    addScrollEvent()
    return () => removeScrollEvent();
  },[])

  return (
    <section className="FanStarLike">
      {isMyProfile ?
        <ul className="tabmenu">
          {titleTabInfoList.map((data,index) => {
            return (
              <li key={index}
                  className={currentTitleTabInfo.key === data.key ? 'active' : ''}
                  onClick={() => titleTabClick(data)}
              >{data.value}</li>
            )
          })}
        </ul>
        : <h2>{titleTabInfoList.length > 0 && titleTabInfoList[0].value}</h2>
      }
      <div className="listContainer" ref={likeContainerRef}>
        {isMyProfile ?
          <ul className="tabmenu">
            {myProfileTabInfos.subTab[currentTitleTabInfo.key].map((data,index) => {
              return (
                <div className="likeTab" key={index}>
                  <li className={currentSubTabInfo.key === data.key ? 'active' : ''}
                      onClick={() => subTabClick(data)}
                  >{data.value}</li>
                </div>
              )
            })}
          </ul>
          :
          <ul className="tabmenu">
            {notMyProfileTabInfos.subTab[currentTitleTabInfo.key].map((data,index) => {
              return (
                <div className="likeTab" key={index}>
                  <li className={currentSubTabInfo.key === data.key ? 'active' : ''}
                      onClick={() => subTabClick(data)}
                  >{data.value}</li>
                </div>
              )
            })}
            <button onClick={() => setNoticePop(true)}>?</button>
          </ul>
        }
        {showList.length > 0 ?
        <div className="listWrap">
          {showList.map((list,index) => {
            return (
              <ListRow photo={list.profImg.thumb62x62} key={index} photoClick={() => goProfileAction(list.memNo)}>
                {isMyProfile ?
                  <>
                    { index < 3 && <div className="rank">{index + 1}</div> }
                    <div className="listContent">
                      <div className="nick">{list.nickNm}</div>
                      {list.regDt && <div className="date">등록일{moment(list.regDt).format('YYMMDD')}</div>}
                      <div className="listItem">
                        <div className="like">{list.listenTime}</div>
                      </div>
                    </div>
                    <div className="back">
                      <button className={`${list.isFan ? 'isFan' : ''}`} onClick={() => {
                        const isFan = list.isFan;
                        fanToggle(list.memNo, list.nickNm, list.isFan, () => fanToggleCallback(index, isFan))
                      }}>{list.isFan ? '팬' : '+ 팬등록'}</button>
                    </div>
                  </>
                  :
                  <>
                    { index < 3 && <div className="rank">{index + 1}</div> }
                    <div className="listContent">
                      <div className="nick">{list.nickNm}</div>
                    </div>
                    {list.memNo !== myMemNo &&
                      <div className="back">
                        <button className={`${list.isFan ? 'isFan' : ''}`} onClick={() => {
                          const isFan = list.isFan;
                          fanToggle(list.memNo, list.nickNm, list.isFan, () => fanToggleCallback(index, isFan))
                        }}>{list.isFan ? '팬' : '+ 팬등록'}</button>
                      </div>
                    }
                  </>
                }
              </ListRow>
            )
          })}
        </div>
        :
        <NoResult />
        }
      </div>
      <button className="popClose"></button>
      {noticePop &&
        <LayerPopup title="랭킹 기준" setPopup={setNoticePop}>
          <section className="profileRankNotice">
            <div className="title">최근 팬 랭킹</div>
            <div className="text">최근 3개월 간 내 방송에서 선물을 많이<br/>
            보낸 팬 순위입니다.</div>
            <div className="title">누적 팬 랭킹</div>
            <div className="text">전체 기간 동안 해당 회원의 방송에서<br/>
            선물을 많이 보낸 팬 순위입니다.</div>
            <div className="title">좋아요 전체 랭킹</div>
            <div className="text">팬 여부와 관계없이 해당 회원의<br/>
            방송에서 좋아요(부스터 포함)를 보낸<br/>
            전체 회원 순위입니다.</div>
          </section>
        </LayerPopup>
      }
    </section>
  )
}

export default LikePopup
