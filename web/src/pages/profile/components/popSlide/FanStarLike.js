import React, {useState, useEffect, useRef} from 'react'

import Api from 'context/api'
import Swiper from 'react-id-swiper'
import moment from 'moment'
// global components
import TabBtn from 'components/ui/tabBtn/TabBtn'
import ListRow from 'components/ui/listRow/ListRow'
// components
import Tabmenu from '../Tabmenu'

import './fanStarLike.scss'

const title = {
  myProfile: ['팬 관리','스타 관리'],
  notMyProfile: ['팬','스타','랭킹']
}
const subTabmenu = ['선물 받은 순','방송 들은 순','최근 청취 순','등록순']
const likeTabmenu = ['팬 랭킹','전체 랭킹']
const likeSubTabmenu = {
  myProfile: ['최근','누적'],
  notMyProfile: ['최근팬','누적팬','좋아요'],
}

const PopRelation = (props) => {
  const {type, isMyProfile} = props
  const tabMenuRef = useRef();
  const [showList, setShowList] = useState([]);
  const [fanStarLikeState, setFanStarLikeState] = useState({type: '', title: '', tab: [], subTab: []});
  const [subType, setSubType] = useState(subTabmenu[0]);
  const [likeType, setLikeType] = useState(likeTabmenu[0]);
  const [likeSubType, setLikeSubType] = useState(isMyProfile ? likeSubTabmenu.myProfile[0] : likeSubTabmenu.notMyProfile[0]);
  
  // 팬 조회
  const fetchInfoDataType = (type) => {
    if (type === 'fan') {
      Api.getNewFanList({
        memNo: '11584609206286',
        sortType: 2,
        page: 1,
        records: 20
      }).then((res) => {
        if (res.result === 'success') {
          setShowList(res.data.list)
        }
      })
    }
    if (type === 'star') {
      Api.getNewStarList({
        memNo: '11584609206286',
        sortType: 2,
        page: 1,
        records: 20
      }).then((res) => {
        if (res.result === 'success') {
          setShowList(res.data.list)
        }
      })
    }
    if (type === 'like') {
      Api.mypage_good_ranking({
        params: {
          memNo: '11584609206286'
        }
      }).then((res) => {
        if (res.result === 'success') {
          setShowList(res.data.list)
        }
      })
    }
  }

  const fetchFanStarLikeInfo = (type) => {
    if (type === 'fan') {
      setFanStarLikeState({...fanStarLikeState,type: 'fan', title: isMyProfile ? title.myProfile[0] : title.notMyProfile[0], subTab: isMyProfile ? subTabmenu : []})
    }
    if (type === 'star') {
      setFanStarLikeState({...fanStarLikeState,type: 'star', title: isMyProfile ? title.myProfile[1] : title.notMyProfile[1], subTab: isMyProfile ? subTabmenu : []})
    }
    if (type === 'like') {
      setFanStarLikeState({...fanStarLikeState,type: 'like', title: isMyProfile ? '' : title.notMyProfile[2], tab: isMyProfile ? likeTabmenu : [], subTab: isMyProfile ? likeSubTabmenu.myProfile : likeSubTabmenu.notMyProfile})
    }
  }

  // 스와이퍼
  const swiperProps = {
    slidesPerView: 'auto',
  }

  useEffect(() => {
    fetchInfoDataType(type)
    fetchFanStarLikeInfo(type)
  },[])

  return (
    <section className="relationList">
      {isMyProfile === true ?
        <>
        {fanStarLikeState.type === 'fan' || fanStarLikeState.type === 'star' ?
          <h2>{fanStarLikeState.title}</h2>
          :
          <Tabmenu data={fanStarLikeState.tab} tab={likeType} setTab={setLikeType} />
        }
        </>
        :
        <h2>{fanStarLikeState.title}</h2>
      }
      <div className="listContainer">
        {isMyProfile === true ?
          <>
          {fanStarLikeState.type === 'fan' || fanStarLikeState.type === 'star' ?
            <ul className="tabmenu" ref={tabMenuRef}>
              <Swiper {...swiperProps}>
                {fanStarLikeState.subTab.map((data,index) => {
                  const param = {
                    item: data,
                    tab: subType,
                    setTab: setSubType,
                  }
                  return (
                    <div key={index}>
                      <TabBtn param={param} />
                    </div>
                  )
                })}
              </Swiper>
            </ul>
            :
            <ul className="tabmenu" ref={tabMenuRef}>
              {fanStarLikeState.subTab.map((data,index) => {
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
          }
          </>
          :
          <>
          {fanStarLikeState.type === 'like' && 
            <ul className="tabmenu" ref={tabMenuRef}>
              {fanStarLikeState.subTab.map((data,index) => {
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
          }
          </>
        }
        <div className="listWrap">
          {showList.map((list,index) => {
            return (
              <ListRow photo={list.profImg.thumb62x62} key={index}>
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
                  {list.isFan ?
                    <button className='isFan'>팬</button>
                    :
                    <button>+ 팬등록</button>
                  }
                </div>
              </ListRow>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default PopRelation
