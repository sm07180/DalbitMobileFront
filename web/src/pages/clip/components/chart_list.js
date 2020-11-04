import React, {useEffect, useRef, useState, useContext} from 'react'
//modules
import Api from 'context/api'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'
import {Hybrid} from 'context/hybrid'
import Utility, {printNumber, addComma} from 'components/lib/utility'
import {OS_TYPE} from 'context/config.js'
import {clipJoin} from 'pages/common/clipPlayer/clip_func'
//svg
import playIcon from '../static/visit_g_s.svg'
import heartIcon from '../static/like_g_s.svg'
import starIcon from '../static/cashstar_g_s.svg'
import EntryImg from '../static/person_w_s.svg'
import SimplePlayIcon from '../static/simple_play.svg'
import SimpleLikeIcon from '../static/simple_like.svg'
import noBgAudioIcon from '../static/audio_s.svg'
import SimpleMessageIcon from '../static/message.svg'
import SimpleMessageIconW from '../static/message_w.svg'
// components
import NoResult from 'components/ui/new_noResult'
//flag
let currentPage = 1
let timer
let moreState = false
export default (props) => {
  //ctx
  const context = useContext(Context)
  let history = useHistory()
  const {chartListType, clipTypeActive, clipType, clipCategoryFixed, selectType, reloadInit} = props
  //state
  const [list, setList] = useState([])
  const [nextList, setNextList] = useState([])
  const customHeader = JSON.parse(Api.customHeader)
  const globalCtx = useContext(Context)
  //api
  //   if (res.data.paging && res.data.paging.totalPage === 1) {
  const fetchDataList = async (next) => {
    if (!next) currentPage = 1
    currentPage = next ? ++currentPage : currentPage
    const res = await Api.getClipList({
      // slctType: context.clipMainSort,
      slctType: context.clipMainSort,
      dateType: context.clipMainDate,
      subjectType: clipTypeActive,
      djType: 0,
      gender: '',
      page: currentPage,
      records: 50
    })
    if (res.result === 'success' && res.data.hasOwnProperty('list')) {
      // setList(res.data.list)
      if (res.data.list.length === 0) {
        if (!next) {
          setList([])
        }
        moreState = false
      } else {
        if (next) {
          moreState = true
          setNextList(res.data.list)
        } else {
          setList(res.data.list)
          fetchDataList('next')
        }
      }
    } else {
      context.action.alert({
        msg: res.message
      })
    }
  }
  // 플레이가공
  const fetchDataPlay = async (clipNum) => {
    const {result, data, message, code} = await Api.postClipPlay({
      clipNo: clipNum
    })
    if (result === 'success') {
      clipJoin(data, context)
    } else {
      if (code === '-99') {
        context.action.alert({
          msg: message,
          callback: () => {
            history.push('/login')
          }
        })
      } else {
        context.action.alert({
          msg: message
        })
      }
    }
  }
  // make contents
  const makeList = () => {
    return list.map((detailsItem, idx) => {
      const {
        bgImg,
        gender,
        filePlayTime,
        nickName,
        playCnt,
        title,
        subjectType,
        byeolCnt,
        goodCnt,
        entryType,
        isSpecial,
        clipNo,
        replyCnt
      } = detailsItem
      return (
        <li
          className="chartListDetailItem"
          key={idx + 'list'}
          onClick={() => {
            if (customHeader['os'] === OS_TYPE['Desktop']) {
              if (globalCtx.token.isLogin === false) {
                context.action.alert({
                  msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
                  callback: () => {
                    history.push('/login')
                  }
                })
              } else {
                globalCtx.action.updatePopup('APPDOWN', 'appDownAlrt', 4)
              }
            } else {
              fetchDataPlay(clipNo)
            }
          }}>
          <div className="chartListDetailItem__thumb">
            {isSpecial && <span className="newSpecialIcon">스페셜DJ</span>}
            <img src={bgImg[`thumb190x190`]} alt={title} />
            <span className="chartListDetailItem__thumb__playTime">{filePlayTime}</span>
          </div>
          <div className="textBox">
            <p className="textBox__subject">
              <span className="subject">
                {clipType.map((ClipTypeItem, index) => {
                  if (ClipTypeItem.value === subjectType) {
                    return <React.Fragment key={idx + 'typeList'}>{ClipTypeItem.cdNm}</React.Fragment>
                  }
                })}
              </span>

              <i className="line"></i>
              <span className="title">{title}</span>
            </p>
            <p className="textBox__nickName">
              {gender !== '' ? <span className={gender === 'm' ? 'maleIcon' : 'femaleIcon'} /> : <></>}
              {nickName}
            </p>

            <div className="textBox__detail">
              <span className="textBox__detail--item">
                <i className="icon icon--message">회색 메세지 아이콘</i>
                {playCnt > 999 ? Utility.printNumber(replyCnt) : Utility.addComma(replyCnt)}
              </span>
              <span className="textBox__detail--item">
                <i className="icon icon--like">회색 하트 아이콘</i>
                {goodCnt > 999 ? Utility.printNumber(goodCnt) : Utility.addComma(goodCnt)}
              </span>
              {/* <span className="textBox__detail--item">
                <img src={starIcon} width={16} />
                {byeolCnt > 999 ? Utility.printNumber(byeolCnt) : Utility.addComma(byeolCnt)}
              </span> */}
            </div>
          </div>
        </li>
      )
    })
  }
  //scroll
  const showMoreList = () => {
    setList(list.concat(nextList))
    fetchDataList('next')
  }
  const scrollEvtHdr = (event) => {
    if (timer) window.clearTimeout(timer)
    timer = window.setTimeout(function () {
      //스크롤
      const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
      const body = document.body
      const html = document.documentElement
      const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
      const windowBottom = windowHeight + window.pageYOffset
      if (moreState && windowBottom >= docHeight - 300) {
        showMoreList()
      } else {
      }
    }, 10)
  }
  useEffect(() => {
    setList([])
    fetchDataList()
  }, [context.clipMainSort, context.clipRefresh, clipTypeActive, context.clipMainDate])

  //----------------------------------------------------------------
  useEffect(() => {
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [nextList, clipTypeActive])
  //-------------------------------------------------------------render
  if (chartListType === 'detail') {
    return (
      <div className="chartListDetail">
        <ul className={`chartListDetailBox ${clipCategoryFixed ? 'fixedOn' : ''}`}>
          {list.length > 0 ? makeList() : <NoResult height={600} text="등록된 실시간 클립이 없습니다." />}
        </ul>
      </div>
    )
  } else {
    const windowHalfWidth = (window.innerWidth - 32) / 2
    return (
      <div className="chartListSimple">
        <ul className={`chartListSimpleBox ${clipCategoryFixed ? 'fixedOn' : ''}`}>
          {list.length > 0 ? (
            list.map((SimpleListItem, idx) => {
              const {
                bgImg,
                gender,
                filePlayTime,
                nickName,
                playCnt,
                title,
                subjectType,
                byeolCnt,
                goodCnt,
                isSpecial,
                entryType,
                clipNo,
                replyCnt
              } = SimpleListItem
              return (
                <li
                  className="chartListSimpleItem"
                  style={{backgroundImage: `url('${bgImg[`thumb336x336`]}')`, height: `${windowHalfWidth}px`, cursor: 'pointer'}}
                  key={`simpleList` + idx}
                  onClick={() => {
                    if (customHeader['os'] === OS_TYPE['Desktop']) {
                      if (globalCtx.token.isLogin === false) {
                        context.action.alert({
                          msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
                          callback: () => {
                            history.push('/login')
                          }
                        })
                      } else {
                        globalCtx.action.updatePopup('APPDOWN', 'appDownAlrt', 4)
                      }
                    } else {
                      fetchDataPlay(clipNo)
                    }
                  }}>
                  <div className="topWrap">
                    <div className="topWrap__status">
                      {/* <span className={entryType === 3 ? 'twentyIcon' : entryType === 1 ? 'fanIcon' : 'allIcon'} /> */}
                      {isSpecial && <span className="specialIcon">S</span>}
                      {/* <span className="categoryIcon">
            {clipType.map((v, index) => {
              if (v.value === subjectType) {
                return <React.Fragment key={index + 'typeList'}>{v.cdNm}</React.Fragment>
              }
            })}
          </span> */}
                    </div>
                    <div className="topWrap__count">
                      <i className="icon icon--lineMessage">흰색 라인 메세지 아이콘</i>
                      <span className="topWrap__count--num">
                        {playCnt > 999 ? Utility.printNumber(replyCnt) : Utility.addComma(replyCnt)}
                      </span>
                      <i className="icon icon--lineHeart">흰색 라인 하트 아이콘</i>
                      <span className="topWrap__count--num">
                        {goodCnt > 999 ? Utility.printNumber(goodCnt) : Utility.addComma(goodCnt)}
                      </span>
                    </div>
                  </div>
                  <div className="bottomWrap">
                    <p className="bottomWrap__title">{title}</p>
                    <div className="bottomWrap__nick">
                      {gender !== '' ? <span className={gender === 'm' ? 'maleIcon' : 'femaleIcon'} /> : <></>}
                      {nickName}
                    </div>
                  </div>
                  <div className="dim"></div>
                </li>
              )
            })
          ) : (
            <NoResult height={600} text="등록된 실시간 클립이 없습니다." />
          )}
        </ul>
      </div>
    )
  }
}
