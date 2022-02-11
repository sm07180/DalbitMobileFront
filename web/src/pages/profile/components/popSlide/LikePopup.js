import React, {useState, useEffect} from 'react'

import Api from 'context/api'
import moment from 'moment'
// global components
import TabBtn from 'components/ui/tabBtn/TabBtn'
import ListRow from 'components/ui/listRow/ListRow'
// components
import Tabmenu from '../Tabmenu'

import './style.scss'
import {useDispatch} from "react-redux";
import {setProfileData} from "redux/actions/profile";

const notMyProfileTitle = '랭킹'
const likeTabmenu = ['팬 랭킹','전체 랭킹']
const likeSubTabmenu = {
  myProfileFanTab: ['최근','누적'],
  myProfileRankTab: ['선물', '좋아요'],
  notMyProfile: ['최근팬','누적팬','좋아요'],
}

const LikePopup = (props) => {
  const {isMyProfile, fanToggle, profileData, goProfile, setPopLike} = props
  const dispatch = useDispatch();
  const [showList, setShowList] = useState([]);
  const [likeState, setLikeState] = useState({title: '', tab: [], subTab: []});
  const [likeType, setLikeType] = useState(likeTabmenu[1]);
  const [likeSubType, setLikeSubType] = useState(isMyProfile ? likeSubTabmenu.myProfileRankTab[1] : likeSubTabmenu.notMyProfile[2]);

  // 팬 조회
  const fetchInfoDataType = () => {
    totalRankPresentApi()


  }

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

  /* 내프로필 -> 1.전체랭킹-선물, 2.팬랭킹-최근, 3.팬랭킹-누적 */
  const totalRankPresentApi = () => {
    const apiParams = {
      memNo: profileData.memNo,
      page: 1,
      records: 100,
      rankSlct: 2, // 2면 전체 랭킹 - 선물, 없으면 팬 랭킹 - 최근,누적
      rankType: 1, // 2면 팬랭킹 - 누적, 없으면 팬랭킹 - 최근, 선물
    }
    Api.mypage_fan_ranking({params: apiParams}).then(res => {
      setShowList(res.data.list);
    })
  }



  const fetchFanStarLikeInfo = () => {
    setLikeState({
      title: isMyProfile ? '' : notMyProfileTitle[0],
      tab: isMyProfile ? likeTabmenu : [],
      subTab: isMyProfile ? likeSubTabmenu.myProfileRankTab : likeSubTabmenu.notMyProfile
    })
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

  useEffect(() => {
    fetchInfoDataType()
    fetchFanStarLikeInfo()
  },[])

  return (
    <section className="FanStarLike">
      {isMyProfile ?
        <Tabmenu data={likeState.tab} tab={likeType} setTab={setLikeType} />
        : <h2>{likeState.title}</h2>
      }
      <div className="listContainer">
        {isMyProfile ?
          <ul className="tabmenu">
            {likeState.subTab.map((data,index) => {
              const param = {
                item: data,
                tab: likeSubType,
                setTab: setLikeSubType,
              }
              return (
                <div className="swiper-slide" key={index}>
                  <TabBtn param={param} />
                </div>
              )
            })}
          </ul>
          :
          <ul className="tabmenu">
            {likeState.subTab.map((data,index) => {
              const param = {
                item: data,
                tab: likeSubType,
                setTab: setLikeSubType,
              }
              return (
                <div className="swiper-slide" key={index}>
                  <TabBtn param={param} />
                </div>
              )
            })}
            <button>?</button>
          </ul>
        }
        <div className="listWrap">
          {showList.map((list,index) => {
            return (
              <ListRow photo={list.profImg.thumb62x62} key={index} onClick={() => {
                goProfile(list.memNo)
                setPopLike(false);
              }}>
                {index < 3 &&
                  <div className="rank">{index + 1}</div>
                }
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
              </ListRow>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default LikePopup
