import React, {useState, useEffect, useRef, useCallback} from 'react';

import Api from 'context/api';
import moment from 'moment';
// global components
import ListRow from '../../../../components/ui/listRow/ListRow';
import NoResult from '../../../../components/ui/noResult/NoResult';
import DataCnt from '../../../../components/ui/dataCnt/DataCnt';
import FanBtn from '../../../../components/ui/fanBtn/FanBtn';
// scss
import './style.scss';
import {useDispatch, useSelector} from "react-redux";
import {setProfileData} from "redux/actions/profile";
import {setCommonPopupOpenData, setSlidePopupOpen} from "redux/actions/common";

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
  const {isMyProfile, profileData, goProfile, myMemNo, likePopTabState, closePopupAction} = props
  const dispatch = useDispatch();
  const likeContainerRef = useRef();
  const popup = useSelector(state => state.popup);

  const [showList, setShowList] = useState([]); // 리스트


  // 팝업 제목 (탭 or 텍스트)
  const [titleTabInfoList, setTitleTabInfoList] = useState(
    isMyProfile ? myProfileTabInfos.titleTab : notMyProfileTabInfos.titleTab
  );
  const [currentTitleTabInfo, setCurrentTitleTabInfo] = useState({});

  // 서브 탭
  const [currentSubTabInfo, setCurrentSubTabInfo] = useState(
    {key: '', value:'', rankType: 0, rankSlct: 0}
  ); // 현재 선택된 서브탭
  const [fanRankSubTabInfo, setFanRankSubTabInfo] = useState(myProfileTabInfos.subTab.fanRank[0]); // 팬랭킹 탭에서의 서브탭
  const [totalRankSubTabInfo, setTotalRankSubTabInfo] = useState(myProfileTabInfos.subTab.totalRank[1]); // 전체랭킹 탭에서의 서브탭
  // const [rankSubTabInfo, setRankSubTabInfo] = useState({}); // 타회원 프로필 서브탭

  // 스크롤 페이징
  const [pageNo, setPageNo] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);

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
    goProfile(targetMemNo);
    closePopupAction();
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

    /* 탭 상태 변경 */
    setCurrentSubTabInfo(data);

    /* 스크롤 맨위로 */
    if(likeContainerRef.current) {
      likeContainerRef.current.scrollTo(0, 0);
    }

    /* 페이징 데이터 초기화 */
    pagingReset();
  }

  /* 스크롤 이벤트 */
  const scrollEvent = useCallback(() => {
    const scrollTarget = likeContainerRef.current;
    const popHeight = scrollTarget.scrollHeight;
    const targetHeight = scrollTarget.clientHeight;
    const scrollTop = scrollTarget.scrollTop;
    if(popHeight - 1 < targetHeight + scrollTop) {
      setPageNo(pageNo => pageNo +1)
    }
  }, []);

  const addScrollEvent = () => {
    const target = likeContainerRef.current;
    if(target) {
      target.addEventListener('scroll', scrollEvent);
    }
  }

  const removeScrollEvent = useCallback(() => {
    const scrollTarget = likeContainerRef.current;
    if(scrollTarget) {
      scrollTarget.removeEventListener('scroll', scrollEvent);
    }
  }, []);

  const tabSetting = () => {
    if(likePopTabState) { // 열고싶은 탭
      /* 제목 */
      setCurrentTitleTabInfo(isMyProfile ? myProfileTabInfos.titleTab[likePopTabState.titleTab]
        : notMyProfileTabInfos.titleTab[0])

      /* 서브 탭 */
      setCurrentSubTabInfo(
        isMyProfile ? myProfileTabInfos.subTab[likePopTabState.subTabType][likePopTabState.subTab]
          : notMyProfileTabInfos.subTab.rank[likePopTabState.subTab]
      );
    }else { // 디폴트 탭
      setCurrentTitleTabInfo(isMyProfile ? myProfileTabInfos.titleTab[1] : notMyProfileTabInfos.titleTab[0])
      setCurrentSubTabInfo(isMyProfile ? myProfileTabInfos.subTab.totalRank[1] : notMyProfileTabInfos.subTab.rank[2]);
    }
  }

  const openNoticePop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(setCommonPopupOpenData({...popup, commonPopup: true}));
  }

  useEffect(() => {
    if(!isLastPage && showList.length > 0) {
      removeScrollEvent();
      addScrollEvent();
    }
  }, [showList])

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
    tabSetting()
    return () => {
      removeScrollEvent();
    }
  },[])

  return (
    <section className="fanStarLike">
      {isMyProfile ?
        <ul className="tabmenu">
          {titleTabInfoList.map((data,index) => {
            return (
              <li key={index}
                  className={currentTitleTabInfo?.key === data.key ? 'active' : ''}
                  onClick={() => titleTabClick(data)}
              >{data.value}</li>
            )
          })}
        </ul>
        : <h2>{titleTabInfoList.length > 0 && titleTabInfoList[0].value}</h2>
      }
      <div className="listContainer">
        {isMyProfile ?
          <ul className="tabmenu">
            {currentTitleTabInfo?.key && myProfileTabInfos.subTab[currentTitleTabInfo.key]?.map((data,index) => {
              return (
                <div className="likeTab" key={index}>
                  <li className={currentSubTabInfo?.key === data.key ? 'active' : ''}
                      onClick={() => subTabClick(data)}
                  >{data.value}</li>
                </div>
              )
            })}
          </ul>
          :
          <ul className="tabmenu">
            {currentTitleTabInfo?.key && notMyProfileTabInfos.subTab[currentTitleTabInfo.key]?.map((data,index) => {
              return (
                <div className="likeTab" key={index}>
                  <li className={currentSubTabInfo?.key === data.key ? 'active' : ''}
                      onClick={() => subTabClick(data)}
                  >{data.value}</li>
                </div>
              )
            })}
            <button onClick={openNoticePop}>?</button>
          </ul>
        }
        {showList.length > 0 ?
        <div className="listWrap" ref={likeContainerRef}>
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
                        {list.good && <DataCnt type={"goodCnt"} value={list.good}/>}
                        {list.giftDal && <DataCnt type={"giftDal"} value={list.giftDal}/>}                        
                      </div>
                    </div>
                    <div className="back">
                      <FanBtn data={list} isMyProfile={isMyProfile} profileData={profileData} />
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
                        <FanBtn data={list} isMyProfile={isMyProfile} profileData={profileData} />
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
      <button className="popClose" onClick={closePopupAction} />
    </section>
  )
}

export default LikePopup
