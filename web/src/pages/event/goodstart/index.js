import React, {useEffect, useState, useRef, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {IMG_SERVER, PHOTO_SERVER} from 'context/config'
import Utility, {isHitBottom, addComma} from 'components/lib/utility'
import {Context} from 'context'

import Api from 'context/api'

import Header from 'components/ui/new_header'
import NoResult from 'components/ui/new_noResult'
import EventRankList from '../components/rankList'
import PopupNotice from './content/PopupNotice'

import './style.scss'

const GoodStart = () => {
  const history = useHistory()
  const context = useContext(Context)
  const tabMenuRef = useRef()
  const tabBtnRef = useRef()
  const [tabFixed, setTabFixed] = useState(false)
  const [rankList, setRankList] = useState([])
  const [tabContent, setTabContent] = useState({name: 'dj'}) // dj, fan
  const [ranktabCnt, setRankTabCnt] = useState({name: 'all'}) // all, new

  const [noticePopInfo, setNoticePopInfo] = useState({open: false})

  // 조회 API
  const fetchRankList = () => {
    const param = {
      rankSlct: 1,
      rankType: 1,
      page: 1,
      records: 50,
      rankingDate: '2022-01-05',
      type: 'page',
    }
    Api.getRankList(param).then((res) => {
      if (res.result === 'success') {
        setRankList(res.data.list)
      } else {
        console.log(res.message);
      }
    })
  }

  console.log(rankList);

  // 팝업 열기 닫기 이벤트
  const popupOpen = () => {
    setNoticePopInfo({...noticePopInfo, open: true})
  }

  const popupClose = () => {
    setNoticePopInfo({...noticePopInfo, open: false})
  }

  // 탭메뉴 이벤트
  const tabClick = (e) => {
    const {tab} = e.currentTarget.dataset

    if (tab === 'dj' || tab === 'fan') {
      setTabContent({name: tab})
    }

    if (tab === 'all' || tab === 'new') {
      setRankTabCnt({name: tab})
    }
  }

  const tabScrollEvent = () => {
    const tabMenuNode = tabMenuRef.current
    const tabBtnNode = tabBtnRef.current
    if (tabMenuNode && tabBtnNode) {
      const tabMenuTop = tabMenuNode.offsetTop - tabBtnRef.current.clientHeight

      if (window.scrollY >= tabMenuTop) {
        setTabFixed(true)
      } else {
        setTabFixed(false)
      }
    }
  }

  useEffect(() => {
    if (!context.token.isLogin) {
      history.push('/login')
    } else {
      fetchRankList()
    }

    window.addEventListener('scroll', tabScrollEvent)
    return () => window.removeEventListener('scroll', tabScrollEvent)
  }, [])

  useEffect(() => {
    if (tabContent.name === 'dj') {
      console.log(1)
    } else if (tabContent.name === 'fan') {
      console.log(2)
    }
    if (tabFixed) {
      window.scrollTo(0, tabMenuRef.current.offsetTop - tabBtnRef.current.clientHeight)
    }
  }, [tabContent.name])
  
  // 추가 컴포넌트
  const ListContent = (props) => {
    const {type, data} = props
    return (
      <>
        {type === 'my' ? (
          <>
            <div className="listBox">
              <div className="listItem">
                <span className="userNick">{data.nickNm}</span>
              </div>
              <div className="listItem">
                <div className="value">
                  <i className="icon"></i>
                  <span className='count'>{Utility.addComma(1000)}</span>
                </div>
                <div className="value">
                  <i className="icon"></i>
                  <span className='count'>{Utility.addComma(1000)}</span>
                </div>
                <div className="value">
                  <i className="icon"></i>
                  <span className='count'>{Utility.addComma(1000)}</span>
                </div>
              </div>
            </div>
            <div className="listBack">
              {Utility.addComma(100000)}
            </div>
          </>
        ) : (
          <>
            <div className="listBox">
              <div className="listItem">
                <em className="icon_wrap icon_male">
                  <span className="blind">성별</span>
                </em>
                <span className="userNick">{data.nickNm}</span>
              </div>
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
      <img src={`${IMG_SERVER}/event/goodstart/topImg.png`} className="bgImg" />
      <div className="tabContainer" ref={tabMenuRef}>
        <div className={`tabWrapper ${tabFixed === true ? 'fixed' : ''}`} ref={tabBtnRef}>
          <div className="tabmenu">
            <button className={tabContent.name === 'dj' ? 'active' : ''} data-tab="dj" onClick={tabClick}>
              <img src={`${IMG_SERVER}/event/goodstart/tabBtn-1.png`} alt="DJ" />
            </button>
            <button className={tabContent.name === 'fan' ? 'active' : ''} data-tab="fan" onClick={tabClick}>
              <img src={`${IMG_SERVER}/event/goodstart/tabBtn-2.png`} alt="FAN" />
            </button>
          </div>
        </div>
      </div>
      <section className="bodyContainer">
        <img src={`${IMG_SERVER}/event/goodstart/bodybg-${tabContent.name === 'dj' ? 'dj' : 'fan'}.png`} className="bgImg" />
        <div className="notice">
          <p>* 순위는 6시간 단위로 집계 됩니다.</p>
          <button onClick={popupOpen}>
            <img src={`${IMG_SERVER}/event/goodstart/noticeBtn.png`} alt="유의사항" />
          </button>
        </div>
      </section>
      <section className={`rankContainer ${tabContent.name === 'dj' ? 'dj' : 'fan'}`}>
        {tabContent.name === 'dj' ? (
          <div className="rankTabmenu">
            <button className={`${ranktabCnt.name === 'all' ? 'active' : ''}`} data-tab="all" onClick={tabClick}>
              <img
                src={`${IMG_SERVER}/event/goodstart/rankTabBtn-1-${ranktabCnt.name === 'all' ? 'on' : 'off'}.png`}
                alt="종합랭킹"
              />
            </button>
            <button className={`${ranktabCnt.name === 'new' ? 'active' : ''}`} data-tab="new" onClick={tabClick}>
              <img
                src={`${IMG_SERVER}/event/goodstart/rankTabBtn-2-${ranktabCnt.name === 'new' ? 'on' : 'off'}.png`}
                alt="신인랭킹"
              />
            </button>
          </div>
        ) : (
          <h1 className="rankTitle">
            <img src={`${IMG_SERVER}/event/goodstart/rankTitle.png`} />
          </h1>
        )}
        <div className="rankUl">
          {tabContent.name === 'fan' ? <p className='fanSubTitle'>특별점수는 종료 후 반영되니 참고해주세요!</p> : ''}
          <EventRankList type={'my'} rankList={context.profile} photoSize={60}>
            <ListContent type={'my'} data={context.profile} />
          </EventRankList>
          {rankList.length > 0 ? 
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
