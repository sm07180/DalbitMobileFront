import React, {useEffect, useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'

import Api from 'context/api'
import Swiper from 'react-id-swiper'
import Reheader from 'components/ui/header/Reheader'
import CntTitle from 'components/ui/CntTitle'
import ListColumn from 'components/ui/ListColumn'
import ListRow from 'components/ui/ListRow'

import './style.scss'

const topTabmenu = ['DJ','FAN','LOVER']
const liveTabmenu = ['전체','VIDEO','RADIO','신입DJ']

const Remain = () => {
  const history = useHistory()
  const [myStar, setMyStar] = useState([])
  const [djRank, setDjRank] = useState([])
  const [fanRank, setFanRank] = useState([])
  const [recommendList, setRecommendList] = useState([])
  const [bannerList, setBannerList] = useState([])
  const [liveList, setLiveList] = useState([])
  const [topRankType, setTopRankType] = useState({name: topTabmenu[0]})
  const [liveListType, setLiveListType] = useState({name: liveTabmenu[0]})

  // 조회 API
  const fetchMainInfo = () => {
    Api.main_init_data().then((res) => {
      if (res.result === 'success') {
        setMyStar(res.data.myStar)
        setDjRank(res.data.djRank)
        setFanRank(res.data.fanRank)
        setRecommendList(res.data.recommend)
      }
    })
  }

  const fetchBannerInfo = () => {
    const param = {
      position: 9
    }
    Api.getBanner(param).then((res) => {
      if (res.result === 'success') {
        setBannerList(res.data)
      }
    })
  }

  const fetchLiveInfo = () => {
    const param = {
      page: 1,
      mediaType: liveListType.name === 'VIDEO' ? 'v' : liveListType.name === 'RADIO' ? 'a' : '',
      records: 20,
      roomType: '',
      searchType: 1,
      gender: '',
      djType: ''
    }
    Api.broad_list(param).then((res) => {
      console.log(liveListType.name);
      if (res.result === 'success') {
        setLiveList(res.data.list)
      }
    })
  }

  // 페이지 셋팅
  useEffect(() => {
    fetchMainInfo()
    fetchBannerInfo()
  }, [])

  useEffect(() => {
    fetchLiveInfo()
  }, [liveListType.name])

  // 스와이퍼 params
  const swiperParams = {
    slidesPerView: 'auto',
  }
  const swiperRecommend = {
    loop: true,
    autoplay: {
      delay: 9500,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction'
    }
  }

  // 컴포넌트
  const TabBtn = (props) => {
    const {param} = props

    const tabClick = (e) => {
      const {tabTarget} = e.currentTarget.dataset
      if (tabTarget === param.item) {
        param.setTab({name: tabTarget})
      }
    }

    return (
      <li className={param.tab === param.item ? 'active' : ''} data-tab-target={param.item} onClick={tabClick}>{param.item}</li>
    )
  }

  const Badge = (props) => {
    const {content} = props
    
    return (
      <React.Fragment>
        <span className='badge'>special</span>
      </React.Fragment>
    )
  }

  // 페이지 시작
  return (
    <div id="remain">
      <Reheader title={'라이브'} type={'noBack'} />
      <section className='topSwiper'>
        {recommendList && recommendList.length > 0 &&
          <Swiper {...swiperRecommend}>
            {recommendList.map((list, index) => {
              return (
                <div key={index}>
                  <ListColumn list={list}>
                    {list.nickNm !== 'banner' &&
                      <div className='info'>
                        <Badge content={list} />
                        <span className="title">{list.title}</span>
                        <span className="nick">{list.nickNm}</span>
                      </div>
                    }
                  </ListColumn>
                </div>
              )
            })}
          </Swiper>
        }
      </section>
      <section className='favorites'>
        {djRank && djRank.length > 0 &&
          <Swiper {...swiperParams}>
            {djRank.map((list, index) => {
              return (
                <div key={index}>
                  <ListColumn list={list} />
                </div>
              )
            })}
          </Swiper>
        }
      </section>
      <section className='top10'>
        <CntTitle title={'일간 TOP10'} more={'rank'}>
          <ul className="tabmenu">
            {topTabmenu.map((data,index) => {
              const param = {
                item: data,
                tab: topRankType.name,
                setTab: setTopRankType
              }
              return (
                <TabBtn param={param} key={index} />
              )
            })}
          </ul>
        </CntTitle>
        {topTabmenu.map((tabmenu, index) => {
          const param = {
            initData: topRankType.name === topTabmenu[0] ? djRank : topRankType.name === topTabmenu[1] ? fanRank : topRankType.name === topTabmenu[2] ? djRank : ''
          }
          return (
            <React.Fragment key={index}>
              {tabmenu === topRankType.name && 
                <>
                  {param.initData && param.initData.length > 0 && 
                    <Swiper {...swiperParams}>
                      {param.initData.map((list, index) => {
                        return (
                          <div key={index}>
                            <ListColumn list={list} />
                          </div>
                        )
                      })}
                    </Swiper>
                  }
                </>
              }
            </React.Fragment>
          )
        })}
      </section>
      <section className='daldungs'>
        <CntTitle title={'방금 착륙한 NEW 달둥스'} more={'clip'} />
        {fanRank && fanRank.length > 0 &&
          <Swiper {...swiperParams}>
            {fanRank.map((list,index) => {
              return (
                <div key={index}>
                  <ListColumn list={list} key={index} />
                </div>
              )
            })}
          </Swiper>
        }
      </section>
      <section className='banner'>
        <ul className='bannerWrap'>
          <li>
            <img src="" />
          </li>
          <li>
            <img src="" />
          </li>
        </ul>
      </section>
      <section className='liveView'>
        <CntTitle title={'🚀 지금 라이브 중!'} />
        <ul className="tabmenu">
          {liveTabmenu.map((data,index) => {
            const param = {
              item: data,
              tab: liveListType.name,
              setTab: setLiveListType
            }
            return (
              <TabBtn param={param} key={index} />
            )
          })}
        </ul>
        <div className="liveListWrap">
          {liveList.map((list,index) => {
            return (
              <ListRow list={list} key={index}>
                <div className='info'>
                  <div className="listItem">
                    <Badge content={list} />
                  </div>
                  <div className="listItem">
                    <span className='title'>{list.title}</span>
                  </div>
                  <div className="listItem">
                    <span className='gender'>{list.bjGender}</span>
                    <span className="nickNm">{list.bjNickNm}</span>
                  </div>
                  <div className="listItem">
                    <span className="state">
                      {list.totalCnt}
                      {list.entryCnt}
                      {list.likeCnt}
                    </span>
                  </div>
                </div>
              </ListRow>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default Remain
