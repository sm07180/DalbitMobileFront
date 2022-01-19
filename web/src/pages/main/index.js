import React, {useEffect, useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'

import Api from 'context/api'
import Header from 'components/ui/header/Header'
import CntTitle from 'components/ui/CntTitle'
import ListRow from 'components/ui/ListRow'

//components
import Tabmenu from './components/Tabmenu'
import MainSlide from './components/MainSlide'
import BannerSlide from './components/BannerSlide'
import SwiperList from './components/SwiperList'

import './style.scss'

const topTabmenu = ['DJ','FAN','LOVER']
const liveTabmenu = ['전체','VIDEO','RADIO','신입DJ']

const MainPage = () => {
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

  const fetchBannerInfo = (value) => {
    Api.getBanner({params: {position: value}}).then((res) => {
      if (res.result === 'success') {
        setBannerList(res.data)
      }
    })
  }

  const fetchLiveInfo = () => {
    const params = {
      page: 1,
      mediaType: liveListType.name === 'VIDEO' ? 'v' : liveListType.name === 'RADIO' ? 'a' : '',
      records: 20,
      roomType: '',
      searchType: 1,
      gender: '',
      djType: ''
    }
    Api.broad_list({params}).then((res) => {
      if (res.result === 'success') {
        setLiveList(res.data.list)
      }
    })
  }

  // 페이지 셋팅
  useEffect(() => {
    fetchMainInfo()
    fetchBannerInfo('9')
  }, [])

  useEffect(() => {
    fetchLiveInfo()
  }, [liveListType.name])

  // 컴포넌트
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
      <Header title={'라이브'} type={'noBack'} />
      <section className='topSwiper'>
        <MainSlide data={recommendList} />
      </section>
      <section className='favorites'>
        <SwiperList data={djRank} />
      </section>
      <section className='top10'>
        <CntTitle title={'일간 TOP10'} more={'rank'}>
          <Tabmenu data={topTabmenu} tab={topRankType.name} setTab={setTopRankType} />
        </CntTitle>
        {topTabmenu.map((tabmenu, index) => {
          const param = {
            initData: topRankType.name === topTabmenu[0] ? djRank : topRankType.name === topTabmenu[1] ? fanRank : topRankType.name === topTabmenu[2] ? djRank : ''
          }
          return (
            <React.Fragment key={index}>
              {tabmenu === topRankType.name && 
                <SwiperList data={param.initData} />
              }
            </React.Fragment>
          )
        })}
      </section>
      <section className='daldungs'>
        <CntTitle title={'방금 착륙한 NEW 달둥스'} more={'clip'} />
        <SwiperList data={fanRank} />
      </section>
      <section className='bannerWrap'>
        <BannerSlide data={bannerList} />
        <button className="bannerMore"></button>
      </section>
      <section className='liveView'>
        <CntTitle title={'🚀 지금 라이브 중!'} />
        <Tabmenu data={liveTabmenu} tab={liveListType.name} setTab={setLiveListType} />
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
 
export default MainPage
 