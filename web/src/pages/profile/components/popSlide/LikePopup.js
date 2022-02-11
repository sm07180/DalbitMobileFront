import React, {useState, useEffect} from 'react'

import Api from 'context/api'
import moment from 'moment'
// global components
import ListRow from 'components/ui/listRow/ListRow'
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

const LikePopup = (props) => {
  const {isMyProfile, fanToggle, profileData, goProfile, setPopLike, myMemNo} = props
  const dispatch = useDispatch();
  const [showList, setShowList] = useState([]); // 리스트

  // 팝업 제목 (탭 or 텍스트)
  const [titleTabInfoList, setTitleTabInfoList] = useState([]);
  const [currentTitleTabInfo, setCurrentTitleTabInfo] = useState(isMyProfile ? myProfileTabInfos.titleTab[1] : notMyProfileTabInfos.titleTab[0]);

  // 서브 탭
  const [currentSubTabInfo, setCurrentSubTabInfo] = useState({}); // 현재 선택된 서브탭
  const [fanRankSubTabInfo, setFanRankSubTabInfo] = useState(myProfileTabInfos.subTab.fanRank[0]); // 팬랭킹 탭에서의 서브탭
  const [totalRankSubTabInfo, setTotalRankSubTabInfo] = useState(myProfileTabInfos.subTab.totalRank[1]); // 전체랭킹 탭에서의 서브탭
  // const [rankSubTabInfo, setRankSubTabInfo] = useState({}); // 타회원 프로필 서브탭

  /* 내프로필 -> 전체랭킹 - 좋아요 */
  const totalRankLikeApi = () => {
    const apiParams = {
      memNo: profileData.memNo,
      page: 1,
      records: 9999
    }
    Api.mypage_good_ranking({params: apiParams}).then((res) => {
      if (res.result === 'success') {
        const data = res.data;
        setShowList(data.list)
      }
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
      page: 1,
      records: 100,
      rankType,
      rankSlct,
    }
    Api.mypage_fan_ranking({params: apiParams}).then(res => {
      setShowList(res.data.list);
    })
  }

  /* 타이틀, 서브탭 default set */
  const fetchFanStarLikeInfo = () => {
    let titleInfoList;
    let currentSubTab;
    if(isMyProfile) {
      currentSubTab = myProfileTabInfos.subTab.totalRank[1];
      titleInfoList = myProfileTabInfos.titleTab;
    }else {
      currentSubTab = notMyProfileTabInfos.subTab.rank[2];
      titleInfoList = notMyProfileTabInfos.titleTab;
    }

    setTitleTabInfoList(titleInfoList); // setTitleTab
    setCurrentSubTabInfo(currentSubTab); // setsubTab
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

  /* 제목 탭 클릭 (작업 기준 마이프로필에서 팬랭킹, 전체랭킹만 있음) */
  const titleTabClick = (data) => {
    setCurrentTitleTabInfo(data);
    if(data.key === 'fanRank') {
      setCurrentSubTabInfo(fanRankSubTabInfo);
    }else if(data.key === 'totalRank') {
      setCurrentSubTabInfo(totalRankSubTabInfo);
    }
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
  }

  useEffect(() => {
    if(currentSubTabInfo.key) {
      if(currentSubTabInfo.key === 'totalRankLike' || currentSubTabInfo.key === 'like') {
        totalRankLikeApi();
      }else {
        fanRankApi(currentSubTabInfo.rankType, currentSubTabInfo.rankSlct);
      }
    }
  }, [currentSubTabInfo]);

  useEffect(() => {
    fetchFanStarLikeInfo()
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
      <div className="listContainer">
        {isMyProfile ?
          <ul className="tabmenu">
            {myProfileTabInfos.subTab[currentTitleTabInfo.key].map((data,index) => {
              return (
                <div className="swiper-slide" key={index}>
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
                <div className="swiper-slide" key={index}>
                  <li className={currentSubTabInfo.key === data.key ? 'active' : ''}
                      onClick={() => subTabClick(data)}
                  >{data.value}</li>
                </div>
              )
            })}
            <button>?</button>
          </ul>
        }
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
      </div>
    </section>
  )
}

export default LikePopup
