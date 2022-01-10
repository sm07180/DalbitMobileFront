import React, {useEffect, useState, useRef, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {IMG_SERVER, PHOTO_SERVER} from 'context/config'
import Utility, {isHitBottom, addComma} from 'components/lib/utility'
import {Context} from 'context'

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
  const [rankList, setRankList] = useState([])
  const [tabContent, setTabContent] = useState({name: tabmenu1}) // dj, fan
  const [ranktabCnt, setRankTabCnt] = useState({name: tabmenu3}) // all, new

  const [noticePopInfo, setNoticePopInfo] = useState({open: false})

  // 조회 API
  const fetchGoodStartDjInfo = () => {
    const param = {
      pageNo: 1,
      PagePerCnt: 50,
    }
    Api.getGoodStartDjInfo(param).then((res) => {
      if (res.code === '00000') {
        setRankList(res.data.list)
      } else {
        console.log(res.message);
      }
    })
  }
  const fetchGoodStartDjRank = () => {
    const param = {
      pageNo: 1,
      PagePerCnt: 50,
    }
    Api.getGoodStartDjRank(param).then((res) => {
      if (res.code === '00000') {
        setRankList(res.data.list)
      } else {
        console.log(res.message);
      }
    })
  }

  // 랜덤으로 랭킹 보이기
  const randomRankShow = () => {
    const num = Math.floor(Math.random()*10);
    console.log(num);
    if (num > 5) {
      setRankTabCnt({name: tabmenu3})
    } else {
      setRankTabCnt({name: tabmenu4})
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
    if (ranktabCnt.name === tabmenu3) {
      fetchGoodStartDjInfo()
      fetchGoodStartDjRank()
    } else if (ranktabCnt.name ===  tabmenu4) {
      fetchGoodStartDjInfo()
    }
  }, [ranktabCnt.name])
  
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
                    <span className="userNick">{data.nickNm}</span>
                  </div>
                </div>
                <div className="listBack">
                  {Utility.addComma(100000)}
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="listBox">
              <div className="listItem">
                <em className="icon_wrap icon_male">
                  <span className="blind">성별</span>
                </em>
                <em className="icon_wrap icon_female">
                  <span className="blind">성별</span>
                </em>
              </div>
              <div className="listItem">
                <span className="userNick">{data.nickNm}</span>
              </div>
            </div>
            <div className="listBack">
              {Utility.addComma(100000)}
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
      <Tabmenu tabmenu1={tabmenu1}  tabmenu2={tabmenu2} tab={tabContent.name}>
        <TabmenuBtn tabBtn1={tabmenu1} tabBtn2={tabmenu2} tab={tabContent.name} setTab={setTabContent} />
      </Tabmenu>
      <section className="bodyContainer">
        <img src={`${IMG_SERVER}/event/goodstart/bodybg-${tabContent.name === tabmenu1 ? 'dj' : 'fan'}.png`} className="bgImg" />
        <div className="notice">
          <p>* 순위는 6시간 단위로 집계 됩니다.</p>
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
        <div className="rankUl">
          {tabContent.name === tabmenu2 ? <p className='fanSubTitle'>특별점수는 종료 후 반영되니 참고해주세요!</p> : ''}
          <EventRankList type={'my'} rankList={context.profile} photoSize={60}>
            <ListContent type={'my'} data={context.profile} />
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
