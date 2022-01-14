import React, {useEffect, useState, useContext} from 'react'

import Api from 'context/api'
import Swiper from 'react-id-swiper'

import './style.scss'

const topTabmenu = ['DJ','FAN','LOVER']

const Remain = () => {
  const [myStar, setMyStar] = useState([])
  const [djRank, setDjRank] = useState([])
  const [fanRank, setFanRank] = useState([])
  const [topRankType, setTopRankType] = useState({name: topTabmenu[0]})

  // 조회 API
  const fetchMainInfo = () => {
    Api.main_init_data().then((res) => {
      if (res.result === 'success') {
        setMyStar(res.data.myStar)
        setDjRank(res.data.djRank)
        setFanRank(res.data.fanRank)
      } else {
        console.log(res.message);
      }
    })
  }

  const fetchBannerInfo = () => {
    const param = {
      position: 1
    }
    Api.getBanner(param).then((res) => {
      if (res.result === 'success') {
        setMyStar(res.data.myStar)
      } else {
        console.log(res.message);
      }
    })
  }

  // 페이지 셋팅
  useEffect(() => {
    fetchMainInfo()
    fetchBannerInfo()
  }, [])

  useEffect(() => {
    if (topRankType.name === 'DJ') {
      // setTopRankType({...topRankType, data: djRank})
    }
  }, [topRankType.name])

  // 스와이퍼 params
  const swiperParams = {
    slidesPerView: 'auto',
  }

  // 컴포넌트
  const CntTitle = (props) => {
    const {title,children} = props
    return (
      <div className="cntTitle">
        <h2>{title}</h2>
        {children}
        <button>더보기</button>
      </div>
    )
  }

  const TabBtn = (props) => {
    const {param} = props

    const tabClick = (e) => {
      const {tabTarget} = e.currentTarget.dataset
      if (tabTarget === param.item) {
        param.setTab({name: tabTarget})
      }
    }

    return (
      <li className={param.tabname === param.item ? 'active' : ''} data-tab-target={param.item} onClick={tabClick}>{param.item}</li>
    )
  }

  const ListRow = (props) => {
    const {list} = props
    return (
      <>
        {list && list.map((item, index) => {
          return(
            <div className="listRow" key={index}>
              <div className="photo" style={{backgroundImage:`url('${item.profImg.thumb62x62}')`}}>
                <img src={item.profImg.thumb62x62} alt={item.nickNm} />
              </div>
              {children}
            </div>
          )
        })}
      </>
    )
  }

  const ListColumn = (props) => {
    const {list,type,children} = props
    return (
      <React.Fragment>
        {type === 'swiper' ?
          <>
            <Swiper {...swiperParams}>
              {list && list.map((item, index) => {
                return(
                  <div className="listColumn" key={index}>
                    <div className="photo" style={{backgroundImage:`url('${item.profImg.thumb62x62}')`}}>
                      <img src={item.profImg.thumb62x62} alt={item.nickNm} />
                    </div>
                    <p>{item.nickNm}</p>
                    {children}
                  </div>
                )
              })}
            </Swiper>
          </>
          :
          <>
            {list && list.map((list, index) => {
              return(
                <div className="listColumn" key={index}>
                  <div className="photo" style={{backgroundImage:`url('${list && list.profImg && list.profImg.thumb62x62}')`}}>
                    <img src={list && list.profImg && list.profImg.thumb62x62} alt={list && list.nickNm} />
                  </div>
                  <p>{list && list.nickNm}</p>
                </div>
              )
            })}
          </>
        }
      </React.Fragment>
    )
  }
  ListColumn.defaultProps = {
    list: [],
    type: ''
  }
  
  // 페이지 시작
  return (
    <div id="remain">
      <section className='topSwiper'>
        <img src={djRank && djRank.profImg && djRank.profImg.thumb62x62} />
      </section>
      <section className='favorites'>
        <ListColumn list={djRank} type={'swiper'} />
      </section>
      <section className='top10'>
        <CntTitle title={'일간 TOP10'}>
          <ul className="tabmenu">
            {topTabmenu.map((data,index) => {
              const param = {
                item: data,
                tabname: topRankType.name,
                setTab: setTopRankType
              }
              return (
                <TabBtn param={param} key={index} />
              )
            })}
          </ul>
        </CntTitle>
        {topTabmenu.map((data,index) => {
          const param = {
            initData: topRankType.name === topTabmenu[0] ? djRank : topRankType.name === topTabmenu[1] ? fanRank : topRankType.name === topTabmenu[2] ? djRank : ''
          }
          return (
            <React.Fragment key={index}>
              {data === topRankType.name &&
                <ListColumn list={param.initData} type={'swiper'} />
              }
            </React.Fragment>
          )
        })}
      </section>
      <section className='daldungs'>
        <CntTitle title={'방금 착륙한 NEW 달둥스'} />
        <ListColumn list={fanRank} type={'swiper'} />
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
        
      </section>
    </div>
  )
}

export default Remain
