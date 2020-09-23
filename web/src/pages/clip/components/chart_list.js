import React, {useEffect, useRef, useState, useContext} from 'react'
//modules
import Api from 'context/api'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'
import {Hybrid} from 'context/hybrid'
import Utility, {printNumber, addComma} from 'components/lib/utility'
import {clipJoin} from 'pages/common/clipPlayer/clip_func'
//svg
import playIcon from '../static/visit_g_s.svg'
import heartIcon from '../static/like_g_s.svg'
import starIcon from '../static/cashstar_g_s.svg'
import EntryImg from '../static/person_w_s.svg'
import SimplePlayIcon from '../static/simple_play.svg'
import SimpleLikeIcon from '../static/simple_like.svg'
import noBgAudioIcon from '../static/audio_s.svg'
// components
import NoResult from 'components/ui/noResult'
//flag
let currentPage = 1
let timer
let moreState = false
export default (props) => {
  //ctx
  const context = useContext(Context)
  let history = useHistory()
  const {chartListType, clipTypeActive, clipType, clipCategoryFixed} = props
  //state
  const [list, setList] = useState([])
  const [nextList, setNextList] = useState([])
  //api
  //   if (res.data.paging && res.data.paging.totalPage === 1) {
  const fetchDataList = async (next) => {
    if (!next) currentPage = 1
    currentPage = next ? ++currentPage : currentPage
    const res = await Api.getClipList({
      slctType: context.clipMainSort,
      subjectType: clipTypeActive,
      djType: 0,
      gender: '',
      page: currentPage,
      records: 8
    })
    if (res.result === 'success' && res.data.hasOwnProperty('list')) {
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
        clipNo
      } = detailsItem
      return (
        <li className="chartListDetailItem" key={idx + 'list'} onClick={() => fetchDataPlay(clipNo)}>
          <div className="chartListDetailItem__thumb">
            {isSpecial && <span className="newSpecialIcon">스페셜DJ</span>}
            <img src={bgImg[`thumb190x190`]} alt={title} />
            <span className="chartListDetailItem__thumb__playTime">{filePlayTime}</span>
          </div>
          <div className="textBox">
            <p className="textBox__subject">
              <em className="textBox__iconBox--type">
                {clipType.map((ClipTypeItem, index) => {
                  if (ClipTypeItem.value === subjectType) {
                    return <React.Fragment key={idx + 'typeList'}>{ClipTypeItem.cdNm}</React.Fragment>
                  }
                })}
              </em>

              <i className="line"></i>
              <span>{title}</span>
            </p>
            <p className="textBox__nickName">
              {gender !== '' ? <span className={gender === 'm' ? 'maleIcon' : 'femaleIcon'} /> : <></>}
              {nickName}
            </p>

            <div className="textBox__detail">
              <span className="textBox__detail--item">
                <img src={playIcon} width={16} />
                {playCnt > 999 ? Utility.printNumber(playCnt) : Utility.addComma(playCnt)}
              </span>
              <span className="textBox__detail--item">
                <img src={heartIcon} width={16} />
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
    fetchDataList()
  }, [context.clipMainSort, context.clipRefresh, clipTypeActive])
  //----------------------------------------------------------------
  useEffect(() => {
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [nextList])
  //-------------------------------------------------------------render
  if (chartListType === 'detail') {
    return (
      <div className="chartListDetail">
        <ul className={`chartListDetailBox ${clipCategoryFixed ? 'fixedOn' : ''}`}>
          {list.length === 0 ? <NoResult text="등록 된 클립이" /> : makeList()}
        </ul>
      </div>
    )
  } else {
    const windowHalfWidth = (window.innerWidth - 32) / 2
    return (
      <div className="chartListSimple">
        <ul className={`chartListSimpleBox ${clipCategoryFixed ? 'fixedOn' : ''}`}>
          {list.length === 0 && <NoResult text="등록 된 클립이" />}
          {list.map((SimpleListItem, idx) => {
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
              clipNo
            } = SimpleListItem
            return (
              <li
                className="chartListSimpleItem"
                style={{backgroundImage: `url('${bgImg[`thumb336x336`]}')`, height: `${windowHalfWidth}px`, cursor: 'pointer'}}
                key={`simpleList` + idx}
                onClick={() => fetchDataPlay(clipNo)}>
                <div className="topWrap">
                  <div className="topWrap__status">
                    <span className={entryType === 3 ? 'twentyIcon' : entryType === 1 ? 'fanIcon' : 'allIcon'} />
                    {isSpecial && <span className="specialIcon">S</span>}
                    {/* <span className="categoryIcon">
                      {clipType.map((v, index) => {
                        if (v.value === subjectType) {
                          return <React.Fragment key={index + 'typeList'}>{v.cdNm}</React.Fragment>
                        }
                      })}
                    </span> */}
                    {gender !== '' ? <span className={gender === 'm' ? 'maleIcon' : 'femaleIcon'} /> : <></>}
                  </div>
                  <div className="topWrap__count">
                    <img className="topWrap__count--icon" src={SimplePlayIcon} />
                    <span className="topWrap__count--num">
                      {playCnt > 999 ? Utility.printNumber(playCnt) : Utility.addComma(playCnt)}
                    </span>
                    <img className="topWrap__count--icon" src={SimpleLikeIcon} />
                    <span className="topWrap__count--num">
                      {goodCnt > 999 ? Utility.printNumber(goodCnt) : Utility.addComma(goodCnt)}
                    </span>
                  </div>
                </div>
                <div className="bottomWrap">
                  {/* <i className="bottomWrap__typeIcon">
                    <img src={noBgAudioIcon} alt="icon" />
                  </i> */}
                  <p className="bottomWrap__nick">{nickName}</p>
                  <p className="bottomWrap__title">{title}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}
