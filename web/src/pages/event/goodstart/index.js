import React, {useEffect, useState, useRef, useContext, useLayoutEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {IMG_SERVER, PHOTO_SERVER} from 'context/config'
import {Context} from 'context'
import Utility, {isHitBottom, addComma} from 'components/lib/utility'
import styled, {css} from 'styled-components'
import moment from 'moment'

import Api from 'context/api'

import Header from 'components/ui/new_header'
import NoResult from 'components/ui/new_noResult'
import Tabmenu from '../components/tabmenu/Tabmenu'
import TabmenuBtn from '../components/tabmenu/TabmenuBtn'
import EventRankList from '../components/rankList/RankList'
import PopupNotice from './content/PopupNotice'

import './style.scss'

const tabmenu1 = 'dj'
const tabmenu2 = 'fan'
const tabmenu3 = 'all'
const tabmenu4 = 'new'

const GoodStart = () => {
  const history = useHistory()
  const context = useContext(Context)
  const [rankMyList, setRankMyList] = useState([])
  const [rankList, setRankList] = useState([])
  const [djRankInfo, setDjRankInfo] = useState([])
  const [tabContent, setTabContent] = useState({name: tabmenu1}) // dj, fan
  const [ranktabCnt, setRankTabCnt] = useState({name: tabmenu3}) // all, new
  const [currentPage, setCurrentPage] = useState(0);

  const [noticePopInfo, setNoticePopInfo] = useState({open: false})

  let totalPage = 1;
  let pagePerCnt = 50;
  // 조회 API
  const fetchGoodStartDjInfo = () => {
    const param = {
      pageNo: currentPage,
      pagePerCnt: pagePerCnt
    }
    Api.getGoodStartDjInfo(param).then((res) => {
      if (res.code === '00000') {
        setDjRankInfo(res.data.eventNoInfo)
        totalPage = Math.ceil(res.data.djRank.rankDjListCnt / pagePerCnt);
        if (currentPage > 1) {
          setRankList(rankList.concat(res.data.djRank.rankDjList))
        } else {
          setRankMyList(res.data.djRank.rankDjMyInfo)
          setRankList(res.data.djRank.rankDjList)
        }
      } else {
        console.log(res.message);
      }
    })
  }
  const fetchGoodStartDjRank = () => {
    const param = {
      pageNo: currentPage,
      pagePerCnt: pagePerCnt
    }
    Api.getGoodStartDjRank(param).then((res) => {
      if (res.code === '00000') {
        totalPage = Math.ceil(res.data.rankDjListCnt / pagePerCnt);
        if (currentPage > 1) {
          setRankList(rankList.concat(res.data.rankDjList))
        } else {
          setRankMyList(res.data.rankDjMyInfo)
          setRankList(res.data.rankDjList)
        }
      } else {
        console.log(res.message);
      }
    })
  }
  const fetchGoodStartNewDjRank = () => {
    const param = {
      pageNo: currentPage,
      pagePerCnt: pagePerCnt
    }
    Api.getGoodStartNewDjRank(param).then((res) => {
      if (res.code === '00000') {
        totalPage = Math.ceil(res.data.rankNewDjListCnt / pagePerCnt);
        if (currentPage > 1) {
          setRankList(rankList.concat(res.data.rankNewDjList))
        } else {
          setRankMyList(res.data.rankNewDjMyInfo)
          setRankList(res.data.rankNewDjList)
        }
      } else {
        console.log(res.message);
      }
    })
  }
  const fetchGoodStartFanInfo = () => {
    const param = {
      pageNo: currentPage,
      pagePerCnt: pagePerCnt
    }
    Api.getGoodStartFanInfo(param).then((res) => {
      if (res.code === '00000') {
        totalPage = Math.ceil(res.data.rankDjListCnt / pagePerCnt);
        if (currentPage > 1) {
          setRankList(rankList.concat(res.data.fanRank))
        } else {
          setRankMyList(res.data.fanRank)
          setRankList(res.data.fanRank)
        }
      } else {
        console.log(res.message);
      }
    })
  }

  // 랜덤으로 랭킹 보이기
  const randomRankShow = () => {
    const num = Math.round(Math.random()*10);
    if (num > 5) {
      setRankTabCnt({...ranktabCnt, name: tabmenu3})
    } else {
      setRankTabCnt({...ranktabCnt, name: tabmenu4})
    }
  }

  // 팝업 열기 닫기 이벤트
  const popupOpen = () => {
    setNoticePopInfo({...noticePopInfo, open: true})
  }

  const popupClose = () => {
    setNoticePopInfo({...noticePopInfo, open: false})
  }

  // 페이지 셋팅
  useEffect(() => {
    if (!context.token.isLogin) {
      history.push('/login')
    } else {
      randomRankShow()
    }
  }, [])
  
  useEffect(() => {
    if (tabContent.name === tabmenu1) {
      setCurrentPage(0)
      if (currentPage === 0) {
        fetchGoodStartDjInfo()
        randomRankShow()
      }
    } else if (tabContent.name ===  tabmenu2) {
      setCurrentPage(0)
      if (currentPage === 0) {
        fetchGoodStartFanInfo()
      }
    }
  }, [tabContent.name])
  
  useEffect(() => {
    if (ranktabCnt.name === tabmenu3) {
      setCurrentPage(0)
      if (currentPage === 0) {
        fetchGoodStartDjRank()
      }
    } else if (ranktabCnt.name ===  tabmenu4) {
      setCurrentPage(0)
      if (currentPage === 0) {
        fetchGoodStartNewDjRank()
      }
    }
  }, [ranktabCnt.name])

  const scrollEvtHdr = () => {
    if (totalPage > currentPage && Utility.isHitBottom()) {
      setCurrentPage(currentPage + 1);
    }
  };

  useLayoutEffect(() => {
    if (currentPage === 0) setCurrentPage(1);
    window.addEventListener("scroll", scrollEvtHdr);
    return () => {
      window.removeEventListener("scroll", scrollEvtHdr);
    };
  }, [currentPage]);

  useEffect(() => {
    if (tabContent.name === tabmenu1 && ranktabCnt.name === tabmenu3) {
      if (currentPage > 0) fetchGoodStartDjRank();
    }
    
    if (tabContent.name === tabmenu1 && ranktabCnt.name === tabmenu4) {
      if (currentPage > 0) fetchGoodStartNewDjRank();
    }
    
    if (tabContent.name === tabmenu2) {
      if (currentPage > 0) fetchGoodStartFanInfo();
    }
  }, [currentPage]);
  
  // 추가 컴포넌트
  /* 랭킹 리스트 */
  const ListContent = (props) => {
    const {type, data} = props
    return (
      <>
        {type === 'my' ? (
          <>
            {ranktabCnt.name === tabmenu3 ? (
              <>
                <div className="listBox">
                  <div className="listItem">
                    <span className="userNick">{data && data.mem_nick}</span>
                  </div>
                  {tabContent.name === tabmenu1 &&
                    <div className="listItem">
                      <div className="value">
                        <i className="icon"></i>
                        <span className='count'>{Utility.addComma(data && data.mem_dal_score)}</span>
                      </div>
                      <div className="value">
                        <i className="icon"></i>
                        <span className='count'>{Utility.addComma(data && data.mem_tot_like_score)}</span>
                      </div>
                      <div className="value">
                        <i className="icon"></i>
                        <span className='count'>{Utility.addComma(data && data.mem_booster_score)}</span>
                      </div>
                    </div>
                  }
                </div>
                <div className="listBack">
                  {Utility.addComma(data && data.tot_mem_score)}
                </div>
              </>
            ) : (
              <>
                <div className="listBox">
                  <div className="listItem">
                    <span className="userNick">{data && data.mem_nick}</span>
                  </div>
                </div>
                <div className="listBack">
                  {Utility.addComma(data && data.tot_mem_score)}
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="listBox">
              <div className="listItem">
                <LevelBox levelColor={data && data.levelColor}>Lv{data && data.mem_level}</LevelBox>
                <em className={`icon_wrap ${data && data.mem_sex === 'm' ? 'icon_male' : 'icon_female'}`}>
                  <span className="blind">성별</span>
                </em>
              </div>
              <div className="listItem">
                <span className="userNick">{data && data.mem_nick}</span>
              </div>
            </div>
            <div className="listBack">
              {Utility.addComma(data && data.tot_mem_score)}
            </div>
          </>
        )}
      </>
    )
  }

  // 페이지 시작
  return (
    <div id="goodStart">
      <Header title="이벤트" />
      {djRankInfo.map((data, index) => {
        const {start_date, end_date, good_no} = data
        const eventStart = Number(moment(start_date).format('YYMMDD')) <= Number(moment().format('YYMMDD'))
        const eventEnd = Number(moment(end_date).format('YYMMDD')) < Number(moment().format('YYMMDD'))
        return (
          <React.Fragment key={index}>
            {eventStart === true && eventEnd !== true &&
              <img src={`${IMG_SERVER}/event/goodstart/topImg-${good_no}.png`} className="bgImg" />
            }
          </React.Fragment>
        )
      })}
      <Tabmenu tab={tabContent.name}>
        <TabmenuBtn tabBtn1={tabmenu1} tabBtn2={tabmenu2} tab={tabContent.name} setTab={setTabContent} style={{border:'1px solid red'}} />
      </Tabmenu>
      <section className="bodyContainer">
        <img src={`${IMG_SERVER}/event/goodstart/bodybg-${tabContent.name === tabmenu1 ? 'dj' : 'fan'}.png`} className="bgImg" />
        <div className="notice">
          <button onClick={popupOpen}>
            <img src={`${IMG_SERVER}/event/goodstart/noticeBtn.png`} alt="유의사항" />
          </button>
        </div>
      </section>
      <section className={`rankContainer ${tabContent.name === tabmenu1 ? 'dj' : 'fan'}`}>
        {tabContent.name === tabmenu1 ? (
          <div className="rankTabmenu">
            <TabmenuBtn tabBtn1={tabmenu3} tabBtn2={tabmenu4}  tab={ranktabCnt.name}  setTab={setRankTabCnt} onOff={true} imgNam={'rankTabBtn'} />
          </div>
        ) : (
          <h1 className="rankTitle">
            <img src={`${IMG_SERVER}/event/goodstart/rankTitle.png`} />
          </h1>
        )}
        <div className={`rankUl ${ranktabCnt.name === 'new' ? 'new' : ''}`}>
          {tabContent.name === tabmenu2 ? <p className='fanSubTitle'>특별점수는 종료 후 반영되니 참고해주세요!</p> : ''}
          <EventRankList type={'my'} rankList={rankMyList} photoSize={60}>
            <ListContent type={'my'} data={rankMyList} />
          </EventRankList>
          {rankList && rankList.length > 0 ? 
            <>
              {rankList.map((data, index) => {
                return (
                  <EventRankList rankList={data} photoSize={60} key={index}>
                    <ListContent data={data} />
                  </EventRankList>
                )
              })}
            </>
            :
            <NoResult type={'default'} text={'랭킹이 없습니다.'} />
          }
        </div>
      </section>
      {noticePopInfo.open === true && <PopupNotice onClose={popupClose} tab={tabContent.name} />}
    </div>
  )
}

export default GoodStart

const LevelBox = styled.div`
  ${(props) => {
    if (props.levelColor && props.levelColor.length === 3) {
      return css`
        background-image: linear-gradient(to right, ${props.levelColor[0]}, ${props.levelColor[1]} 51%, ${props.levelColor[2]});
      `
    } else {
      return css`
        background-color: ${props.levelColor && props.levelColor[0]};
      `
    }
  }};
  width: 44px;
  height: 16px;
  line-height: 16px;
  border-radius: 14px;
  font-weight: bold;
  font-size: 12px;
  color: #fff;
  text-align: center;
  letter-spacing: -0.3px;
`
