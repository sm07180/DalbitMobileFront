import React, {useState, useEffect, useMemo} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import Api from 'context/api'
import Swiper from 'react-id-swiper'

import {convertDateFormat, calcDateFormat} from 'components/lib/dalbit_moment'
//components
import Layout from 'pages/common/layout'
import ListRow from './listRow'
import Header from './header'
//static
import '../style.scss'

export default (props) => {
  const params = useParams()
  const rankingListType = params.type

  const [rankSlct, setRankSlct] = useState(1);
  const [rankType, setRankType] = useState(1);
  const [historySetting, setHistorySetting] = useState(1);

  const [tabList, setTabList] = useState([]);
  const [TabName, setTabName] = useState({name: tabList[0]})

  const [rankList, setRankList] = useState([])
  const [topRankList, setTopRankList] = useState([])
  const [historyList, setHistoryList] = useState([]);

  
  let historyArray = [];

  // 스와이퍼
  const swiperParams = {
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 15,
    loop: false,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    }
  }

  const fetchRankData = async (rankSlct, rankType, rankingDate) => {
    const {result, data} = await Api.get_ranking({
      param: {
        rankSlct: rankSlct,
        rankType: rankType,
        rankingDate: rankingDate,
        page: 1,
        records: 100,
      }
    });
    if (result === "success") {
      if(historySetting === 1) {
        setRankList(data.list.slice(3));
        setTopRankList(data.list.slice(0, 3));
        historyArray.push(data.list.slice(0, 3));
        setHistorySetting(historySetting - 1);
      } else {
        historyList.push(...historyList, data.list.slice(0, 3));
      }
    }
  };

  const subTitle = useMemo(() => {
    if (rankingListType === 'dj') {
        return 'DJ'
    } else if (rankingListType === 'fan') {
        return 'FAN'
    } else if (rankingListType === 'lover') {
        return 'LOVER'
    }
  })

  const TabBtn = (props) => {
    const {param} = props
    const tabClick = (e) => {
      const {tabTarget} = e.currentTarget.dataset
      if (tabTarget === param.item) {
        param.setTab({name: tabTarget})
        setRankType(param.index + 1);
      }
    }
    return (
      <li className={param.tab === param.item ? 'active' : ''} type={param.type} data-tab-target={param.item} onClick={tabClick}>{param.item}</li>
    )
  }
  useEffect(() => {
    if (rankingListType === 'dj') {
      setTabList(['타임','오늘','이번주', '이번달', '올해']);
      setTabName({name: '타임'})
      setRankSlct(1);
      fetchRankData(rankSlct, rankType, convertDateFormat(new Date(), 'YYYY-MM-DD'));
    } else if (rankingListType === 'fan') {
      setTabList(['오늘','이번주', '이번달']);
      setTabName({name: '오늘'})     
      setRankSlct(2); 
      fetchRankData(rankSlct, rankType, convertDateFormat(new Date(), 'YYYY-MM-DD'));
    } else if (rankingListType === 'lover') {
      setTabList(['오늘','이번주']);
      setTabName({name: '오늘'})
      setRankSlct(3);
      fetchRankData(rankSlct, rankType, convertDateFormat(new Date(), 'YYYY-MM-DD'));
    }
  }, [])

  useEffect(() => {
    fetchRankData(rankSlct, rankType, convertDateFormat(new Date(), 'YYYY-MM-DD'));
  }, [rankSlct, rankType])

  useEffect(() => {
    console.log(historySetting);
    fetchRankData(rankSlct, rankType, calcDateFormat(new Date(),  -Number(historySetting)));
    console.log(calcDateFormat(new Date(),  -Number(historySetting)));

  }, [historySetting])

  return (
    <Layout {...props} status="no_gnb">
      <div id="rankingList">
        <Header title={subTitle} leftCtn="backBtn" dropdown={true}>
          <div className='rightCtn'>
            <button className='benefits'>혜택</button>
          </div>
        </Header>
        <div className="rankingContent">
          <ul className="tabmenu">
            {tabList.map((data,index) => {
              const param = {
                item: data,
                tab: TabName.name,
                setTab: setTabName,
                index: index,
              }
              return (
                <TabBtn param={param} key={index} />
              )
            })}
          </ul>
          {historyList && historyList.length > 0 &&    
            <Swiper {...swiperParams}>
                {historyList.map((list, index) => {
                  return (
                    <div className='rankingTop3' key={index}>
                      <div className='topHeader'>오늘 TOP3
                        <span className='questionMark'></span>
                      </div>
                      <div className='topContent'>
                        {
                          list &&
                          <>
                            {
                              list[1] &&
                                <div className='ranker ranker2'>
                                  <div className='rankerinfo'>
                                    <div className='rankerThumb'>                          
                                      <div className='rankerphoto'>
                                        <img src={list[1] && list[1].profImg && list[1].profImg.thumb190x190} alt={list[1].nickNm} />
                                        <span className='rankerRank'>{list[1].rank}</span>
                                      </div>
                                    </div>
                                    <div className='rankerNick'>
                                      {list[1].nickNm}
                                    </div>
                                  </div>
                                  {
                                    rankingListType === "lover" ?
                                    <div className='cupidWrap'>
                                      <div className='cupidHeader'>CUPID</div>
                                      <div className='cupidContent'>
                                        <div className='cupidThumb'>
                                          <img src={list[1] && list[1].djProfImg && list[1].djProfImg.thumb190x190} alt={list[1].nickNm} />
                                        </div>
                                        <div className='cupidNick'>{list[1].djNickNm}</div>
                                      </div>
                                    </div>
                                    :
                                    <>
                                      {list[1].roomNo && <div className='liveTag'>LIVE</div>}
                                    </>
                                  }                 
                                </div>
                            }
                            {
                              list[0] &&
                                <div className='ranker ranker1'>
                                  <div className='rankerinfo'>
                                    <div className='rankerThumb'>
                                      <div className='rankerphoto'>
                                        <img src={list[0] && list[0].profImg && list[0].profImg.thumb190x190} alt={list[0].nickNm} />
                                        <span className='rankerRank'>{list[0].rank}</span>
                                      </div>                          
                                    </div>
                                    <div className='rankerNick'>
                                      {list[0].nickNm}
                                    </div>
                                  </div>
                                  {
                                    rankingListType === "lover" ?
                                    <div className='cupidWrap'>
                                      <div className='cupidHeader'>CUPID</div>
                                      <div className='cupidContent'>
                                        <div className='cupidThumb'>
                                          <img src={list[0] && list[0].djProfImg && list[0].djProfImg.thumb190x190} alt={list[0].nickNm} />
                                        </div>
                                        <div className='cupidNick'>{list[0].djNickNm}</div>
                                      </div>
                                    </div>
                                    :
                                    <>
                                      {list[0].roomNo && <div className='liveTag'>LIVE</div>}
                                    </>
                                  }    
                                </div>
                            }
                            {
                              list[2] &&
                                <div className='ranker ranker3'>
                                  <div className='rankerinfo'>
                                    <div className='rankerThumb'>
                                      <div className='rankerphoto'>
                                        <img src={list[2] && list[2].profImg && list[2].profImg.thumb190x190} alt={list[2].nickNm} />
                                        <span className='rankerRank'>{list[2].rank}</span>
                                      </div>
                                    </div>
                                    <div className='rankerNick'>
                                      {list[2].nickNm}
                                    </div>
                                  </div>
                                  {
                                    rankingListType === "lover" ?
                                    <div className='cupidWrap'>
                                      <div className='cupidHeader'>CUPID</div>
                                      <div className='cupidContent'>
                                        <div className='cupidThumb'>
                                          <img src={list[2] && list[2].djProfImg && list[2].djProfImg.thumb190x190} alt={list[2].nickNm} />
                                        </div>
                                        <div className='cupidNick'>{list[2].djNickNm}</div>
                                      </div>
                                    </div>
                                    :
                                    <>
                                      {list[2].roomNo && <div className='liveTag'>LIVE</div>}
                                    </>
                                  }    
                                </div>
                            }
                          </>
                        }
                      </div>
                                  
                    </div>
                  )
                })}
            </Swiper>
          }          

          <div className='listWrap'>
            {              
              rankList.map((list, index) => {
                return (
                  <ListRow list={list} key={index} rank={true} nick={true} gender={true} data={"fanPoint giftPoint"}>
                    {list.roomNo && <div className='liveTag'>LIVE</div>}                    
                  </ListRow>
                )
              })
            }
          </div>
        </div>
      </div>
    </Layout>
  )
}
