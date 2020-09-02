import React, {useEffect, useRef, useState, useContext} from 'react'

import playIcon from '../static/play_g_s.svg'
import heartIcon from '../static/like_g_s.svg'
import starIcon from '../static/cashstar_g_s.svg'
import EntryImg from '../static/person_w_s.svg'
import SimplePlayIcon from '../static/simple_play.svg'
import SimpleLikeIcon from '../static/simple_like.svg'
import noBgAudioIcon from '../static/audio_s.svg'
import Api from 'context/api'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'
import {Hybrid} from 'context/hybrid'
import Utility, {printNumber, addComma} from 'components/lib/utility'
//flag
let currentPage = 1
let timer
let moreState = false
export default (props) => {
  const context = useContext(Context)
  let history = useHistory()
  const {chartListType, clipTypeActive, clipType} = props
  const [list, setList] = useState([])
  const [nextList, setNextList] = useState([])
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
    }
  }
  // 플레이가공
  const fetchDataPlay = async (clipNum) => {
    const {result, data} = await Api.postClipPlay({
      clipNo: clipNum
    })
    if (result === 'success') {
      console.log(data)
      Hybrid('ClipPlayerJoin', data)
      context.action.updateClipState(true)
      context.action.updateClipPlayerState('playing')
      context.action.updateClipPlayerInfo({
        bgImg: data.bgImg.url,
        title: data.title,
        nickname: data.nickName
      })
    } else {
    }
  }
  const makeList = () => {
    return list.map((item, idx) => {
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
      } = item

      return (
        <li className="chartListDetailItem" key={idx + 'list'} onClick={() => fetchDataPlay(clipNo)} style={{cursor: 'pointer'}}>
          <div className="chartListDetailItem__thumb">
            <img src={bgImg[`thumb190x190`]} alt={title} />
          </div>
          <div className="textBox">
            <div className="textBox__iconBox">
              <span className={entryType === 3 ? 'twentyIcon' : entryType === 1 ? 'fanIcon' : 'allIcon'} />
              {isSpecial && <span className="specialIcon">S</span>}
              <span className="textBox__iconBox--type">
                {clipType.map((v, index) => {
                  if (v.value === subjectType) {
                    return <React.Fragment key={idx + 'typeList'}>{v.cdNm}</React.Fragment>
                  }
                })}
              </span>
              {gender !== '' && <span className={gender === 'm' ? 'maleIcon' : 'femaleIcon'} />}
            </div>
            <p className="textBox__subject">{title} </p>
            <p className="textBox__nickName">{nickName}</p>
            <div className="textBox__detail">
              <span className="textBox__detail--item">
                <img src={playIcon} width={16} />
                {playCnt}
              </span>
              <span className="textBox__detail--item">
                <img src={heartIcon} width={16} />
                {goodCnt}
              </span>
              <span className="textBox__detail--item">
                <img src={starIcon} width={16} />
                {byeolCnt > 999 ? Utility.printNumber(byeolCnt) : Utility.addComma(byeolCnt)}
              </span>
            </div>
          </div>
        </li>
      )
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [nextList])
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
  }, [context.clipMainSort, context.clipMainGender, context.clipMainRefresh, clipTypeActive])

  if (chartListType === 'detail') {
    return (
      <div className="chartListDetail">
        <ul className="chartListDetailBox">{makeList()}</ul>
      </div>
    )
  } else {
    const windowHalfWidth = (window.innerWidth - 32) / 2
    return (
      <div className="chartListSimple">
        <ul className="chartListSimpleBox">
          {list.map((item, idx) => {
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
            } = item

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
                    {gender !== '' && <span className={gender === 'm' ? 'maleIcon' : 'femaleIcon'} />}
                  </div>

                  <div className="topWrap__count">
                    <img className="topWrap__count--icon" src={SimplePlayIcon} />
                    <span className="topWrap__count--num">{playCnt}</span>
                    <img className="topWrap__count--icon" src={SimpleLikeIcon} />
                    <span className="topWrap__count--num">{goodCnt}</span>
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
