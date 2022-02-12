import React, {useState, useEffect} from 'react'

import Api from 'context/api'
import Swiper from 'react-id-swiper'
// global components
import ListRow from 'components/ui/listRow/ListRow'
import DataCnt from 'components/ui/dataCnt/DataCnt'
// components

import './style.scss'
import {useDispatch} from "react-redux";
import {setProfileData} from "redux/actions/profile";
import Utility from "components/lib/utility";

const title = {
  myProfile: ['팬 관리','스타 관리'],
  notMyProfile: ['팬','스타']
}
// fan sortType - 0: 등록 순, 1: 방송 들은 순, 2: 선물 받은 순, 3: 최근 청취 순
const fanSubTabMenu = [
  {name: '선물 받은 순', value: '2'},
  {name: '방송 들은 순', value: '1'},
  {name: '최근 청취 순', value: '3'},
  {name: '등록순', value: '0'},
]

// star sortType - 0: 등록 순, 1: 방송 들은 순, 2. 선물 보낸 순, 3: 최근 청취 순
const starSubTabMenu = [
  {name: '선물 보낸 순', value: '2'},
  {name: '방송 들은 순', value: '1'},
  {name: '최근 청취 순', value: '3'},
  {name: '등록순', value: '0'},
]

const FanStarPopup = (props) => {
  const {type, isMyProfile, fanToggle, profileData, goProfile, setPopFanStar, myMemNo} = props
  const dispatch = useDispatch();
  const [showList, setShowList] = useState([]);
  const [fanStarLikeState, setFanStarLikeState] = useState({type: '', title: '', subTab: []});
  const [subTypeInfo, setSubTypeInfo] = useState(type === 'fan' ? fanSubTabMenu[0] : starSubTabMenu[0]);

  // 팬 조회
  const fetchInfoDataType = (type, fanStarSortType) => {
    if (type === 'fan') {
      Api.getNewFanList({
        memNo: profileData.memNo,
        sortType: isMyProfile ? fanStarSortType : 0,
        page: 1,
        records: 9999
      }).then((res) => {
        if (res.result === 'success') {
          const data = res.data
          if(data.length > 0) {
            dispatch(setProfileData({...profileData, fanCnt: data.paging.total}));
          }
          setShowList(data.list)
        }
      })
    }else if (type === 'star') {
      Api.getNewStarList({
        memNo: profileData.memNo,
        sortType: isMyProfile ? fanStarSortType : 0,
        page: 1,
        records: 9999
      }).then((res) => {
        if (res.result === 'success') {
          const data = res.data;
          if(data.length > 0) {
            dispatch(setProfileData({...profileData, starCnt: data.paging.total}));
          }
          setShowList(data.list)
        }
      })
    }
  }

  const fetchFanStarLikeInfo = (type) => {
    if (type === 'fan') {
      setFanStarLikeState({type: 'fan', title: isMyProfile ? title.myProfile[0] : title.notMyProfile[0], subTab: isMyProfile ? fanSubTabMenu : []})
    }else if(type === 'star') {
      setFanStarLikeState({type: 'star', title: isMyProfile ? title.myProfile[1] : title.notMyProfile[1], subTab: isMyProfile ? starSubTabMenu : []})
    }
  }

  // 스와이퍼
  const swiperProps = {
    slidesPerView: 'auto',
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

  /* subTab 클릭 */
  const subTypeClick = (index) => {
    if(type === 'fan') {
      setSubTypeInfo(fanSubTabMenu[index]);
      fetchInfoDataType(type, fanSubTabMenu[index].value);
    }else {
      setSubTypeInfo(starSubTabMenu[index]);
      fetchInfoDataType(type, starSubTabMenu[index].value);
    }
  }

  useEffect(() => {
    fetchInfoDataType(type, subTypeInfo.value);
    fetchFanStarLikeInfo(type)
  },[])

  return (
    <section className="FanStarLike">
      <h2>{fanStarLikeState.title}</h2>
      <div className="listContainer">
        {isMyProfile &&
          <ul className="tabmenu">
            <Swiper {...swiperProps}>
              {fanStarLikeState.subTab.map((data,index) => {
                return (
                  <div key={index}>
                    <li className={subTypeInfo.name === data.name ? 'active' : ''}
                        onClick={() => subTypeClick(index)}
                    >{data.name}
                    </li>
                  </div>
                )
              })}
            </Swiper>
          </ul>
        }
        <div className="listWrap">
          {showList.map((list,index) => {
            return (
              <ListRow photo={list.profImg.thumb62x62} key={index} photoClick={() => {
                goProfile(list.memNo)
                setPopFanStar(false);
              }}>
                {isMyProfile ?
                  <>
                    {index < 3 && <div className="rank">{index + 1}</div>}
                    <div className="listContent">
                      <div className="nick">{list.nickNm}</div>
                      {/*{list.listenTime}분*/}
                      <div className="date">등록일 {Utility.dateFormatterKor(list.regDt, "")}</div>
                      {/*{Utility.printNumber(list.giftedByeol)}*/}
                      <div className="listItem">
                        <DataCnt value={list.listenTime} type={'listenTime'} />
                        <DataCnt value={list.giftedByeol} type={'giftedByeol'} />
                        {list.lastListenTs === 0 ? <DataCnt value={'-'} type={'lastListenTs'} /> : <DataCnt value={Utility.settingAlarmTime(list.lastListenTs)} type={'lastListenTs'} />}
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

export default FanStarPopup
