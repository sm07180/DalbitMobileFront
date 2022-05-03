import React, {useState, useEffect, useRef, useCallback} from 'react';

import Api from 'context/api';
import Swiper from 'react-id-swiper';
// global components
import ListRow from '../../../../components/ui/listRow/ListRow';
import DataCnt from '../../../../components/ui/dataCnt/DataCnt';
import NoResult from '../../../../components/ui/noResult/NoResult';
import FanBtn from '../../../../components/ui/fanBtn/FanBtn';
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

const pagePerCnt = 20;

const FanStarPopup = (props) => {
  const {type, isMyProfile, profileData, goProfile, myMemNo, closePopupAction} = props;
  const dispatch = useDispatch();
  const fanStarContainerRef = useRef();

  const [showList, setShowList] = useState([]);
  const [fanStarLikeState, setFanStarLikeState] = useState({type: '', title: '', subTab: []});
  const [subTypeInfo, setSubTypeInfo] = useState(type === 'fan' ? fanSubTabMenu[0] : starSubTabMenu[0]);

  // 스크롤 페이징
  const [pageNo, setPageNo] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);

  // 팬 조회
  const fetchInfoDataType = (type, fanStarSortType) => {
    if (type === 'fan') {
      Api.getNewFanList({
        memNo: profileData.memNo,
        sortType: isMyProfile ? fanStarSortType : 0,
        page: pageNo,
        records: pagePerCnt,
      }).then((res) => {
        apiSuccessAction(res);
      })
    }else if (type === 'star') {
      Api.getNewStarList({
        memNo: profileData.memNo,
        sortType: isMyProfile ? fanStarSortType : 0,
        page: pageNo,
        records: pagePerCnt,
      }).then((res) => {
        apiSuccessAction(res);
      })
    }
  }

  /* fan / star 처리가 같아서 따로 뺐는데 달라지면 따로 처리하기 */
  const apiSuccessAction = (res) => {
    if (res.result === 'success') {
      const data = res.data;
      let isLastPage;
      if(data.list.length > 0) {
        if(type === 'fan') {
          dispatch(setProfileData({...profileData, fanCnt: data.paging.total}));
        }else {
          dispatch(setProfileData({...profileData, starCnt: data.paging.total}));
        }
        isLastPage = data.paging.totalPage === pageNo;
      }else {
        isLastPage = true;
      }
      if(pageNo > 1) {
        const concatData = [...showList].concat(data.list);
        setShowList(concatData);
      }else {
        setShowList(data.list)
      }
      setIsLastPage(isLastPage);
    }
  }

  const fetchFanStarInfo = (type) => {
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

  /* subTab 클릭 */
  const subTypeClick = (index) => {
    if(type === 'fan') {
      setSubTypeInfo(fanSubTabMenu[index]);
    }else {
      setSubTypeInfo(starSubTabMenu[index]);
    }

    if(!isLastPage) removeScrollEvent();
    addScrollEvent();
    setPageNo(1);
    setIsLastPage(false);
  }

  /* 스크롤 이벤트 */
  const scrollEvent = useCallback(() => {
    const scrollTarget = fanStarContainerRef.current;
    const popHeight = scrollTarget.scrollHeight;
    const targetHeight = scrollTarget.clientHeight;
    const scrollTop = scrollTarget.scrollTop;
    if(popHeight - 1 < targetHeight + scrollTop) {
      setPageNo(pageNo => pageNo+1)
    }
  }, []);

  const addScrollEvent = () => {
    const target = fanStarContainerRef.current;
    if(target) {
      target.addEventListener('scroll', scrollEvent);
    }
  }

  const removeScrollEvent = useCallback(() => {
    const scrollTarget = fanStarContainerRef.current;
    if(scrollTarget) {
      scrollTarget.removeEventListener('scroll', scrollEvent);
    }
  }, []);

  useEffect(() => {
    if(!isLastPage) {
      fetchInfoDataType(type, subTypeInfo.value);
    }
  }, [pageNo, subTypeInfo]);

  useEffect(() => {
    if(isLastPage){
      removeScrollEvent();
    }
  }, [isLastPage])

  useEffect(() => {
    if(!isLastPage && showList.length > 0) {
      removeScrollEvent();
      addScrollEvent();
    }
  }, [showList])

  useEffect(() => {
    fetchFanStarInfo(type)
    return () => {
      removeScrollEvent();
    }
  },[])

  return (
    <section className="fanStarLike">
      <h2>{fanStarLikeState.title}</h2>
      <div className="listContainer">
        {isMyProfile && fanStarLikeState.subTab.length > 0 &&
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
        {showList.length > 0 ?
          <div className="listWrap" ref={fanStarContainerRef}>
            {showList.map((list,index) => {
              return (
                <ListRow photo={list.profImg.thumb120x120} key={index} photoClick={() => {
                  goProfile(list.memNo)
                  closePopupAction();
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
                        <FanBtn data={list} isMyProfile={isMyProfile} profileData={profileData} />
                      </div>
                    </>
                    :
                    <>
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

export default FanStarPopup;