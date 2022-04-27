import React, {useEffect, useRef, useState, useContext, useCallback} from 'react'
//modules
import Api from 'context/api'
import {useHistory} from 'react-router-dom'
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
import {ClipPlayerJoin} from "common/audio/clip_func";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage, setGlobalCtxUpdatePopup} from "redux/actions/globalCtx";
//flag
let currentPage = 1
let timer
let moreState = false
export default (props) => {
  //ctx
  let history = useHistory()
  const {chartListType, clipTypeActive, clipType, clipCategoryFixed, selectType, reloadInit} = props
  //state
  const [list, setList] = useState([])
  const [nextList, setNextList] = useState([])
  const customHeader = JSON.parse(Api.customHeader)
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  //api
  //   if (res.data.paging && res.data.paging.totalPage === 1) {
  const fetchDataList = async (next) => {
    if (!next) currentPage = 1
    currentPage = next ? ++currentPage : currentPage
    const res = await Api.getClipList({
      // slctType: context.clipMainSort,
      slctType: globalState.clipMainSort,
      dateType: globalState.clipMainDate,
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
      dispatch(setGlobalCtxMessage({type:"alert", msg:res.message, visible:true}));
    }
  }

  const getPageFormIdx = useCallback((idx) => {
    if (idx < 100) return 1
    idx = String(idx)
    return Number(idx.substring(0, idx.length - 2)) + 1
  }, [])

  // 플레이가공
  const fetchDataPlay = async (clipNum, idx) => {
    const {result, data, message, code} = await Api.postClipPlay({
      clipNo: clipNum
    })
    if (result === 'success') {
      const nowPage = getPageFormIdx(idx)
      const playListInfoData = {
        slctType: globalState.clipMainSort,
        dateType: globalState.clipMainDate,
        subjectType: clipTypeActive,
        page: nowPage,
        records: 100
      }

      localStorage.setItem('clipPlayListInfo', JSON.stringify(playListInfoData))
      clipJoin(data, dispatch, globalState);
    } else {
      if (code === '-99') {
        dispatch(setGlobalCtxMessage({
          type: "alert", msg: message, visible: true, callback: () => {
            history.push('/login')
          }
        }));
      } else {
        dispatch(setGlobalCtxMessage({
          type: "alert", msg: message, visible: true
        }));
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
        isConDj,
        clipNo,
        replyCnt,
        badgeSpecial
      } = detailsItem
      return (
        <li
          className="chartListDetailItem"
          key={idx + 'list'}
          onClick={() => {
            // fetchDataPlay(clipNo, idx)
            if (customHeader['os'] === OS_TYPE['Desktop']) {
              if (globalState.token.isLogin === false) {
                dispatch(setGlobalCtxMessage({
                  type: "alert", msg: '해당 서비스를 위해<br/>로그인을 해주세요.', visible: true, callback: () => {
                    history.push('/login')
                  }
                }));
              } else {
                const nowPage = getPageFormIdx(idx);
                const playListInfoData = {
                  slctType: globalState.clipMainSort,
                  dateType: globalState.clipMainDate,
                  subjectType: clipTypeActive,
                  page: nowPage,
                  records: 100
                };
                localStorage.setItem(
                    "clipPlayListInfo",
                    JSON.stringify(playListInfoData)
                );
                ClipPlayerJoin(clipNo,globalState,dispatch,history);
              }
            } else {
              fetchDataPlay(clipNo, idx)
            }
          }}>
          <div className="chartListDetailItem__thumb">
            {badgeSpecial > 0 && badgeSpecial === 2 ? (
              <em className="icon_wrap icon_bestdj_half">베스트DJ</em>
            ) : isConDj === true ? (
              <em className="icon_wrap icon_contentsdj_half">콘텐츠DJ</em>
            ) : badgeSpecial === 1 ? (
              <em className="icon_wrap icon_specialdj_half">스페셜DJ</em>
            ) : (
              <></>
            )}
            <img src={bgImg[`thumb120x120`]} alt={title} />
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
              {gender !== '' && (
                <em className={`icon_wrap ${gender === 'm' ? 'icon_male' : 'icon_female'}`}>
                  <span className="blind">성별</span>
                </em>
              )}
              <span className="nickname">{nickName}</span>
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
  }, [globalState.clipMainSort, globalState.clipRefresh, clipTypeActive, globalState.clipMainDate])

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
          {list.length > 0 ? makeList() : <NoResult height={600} text="등록 된 클립이 없습니다." />}
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
                badgeSpecial,
                isConDj,
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
                      if (globalState.token.isLogin === false) {
                        dispatch(setGlobalCtxMessage({
                          type: "alert", msg: '해당 서비스를 위해<br/>로그인을 해주세요.', visible: true, callback: () => {
                            history.push('/login')
                          }
                        }));
                      } else {
                        dispatch(setGlobalCtxUpdatePopup({popup:['APPDOWN', 'appDownAlrt', 4]}));
                      }
                    } else {
                      fetchDataPlay(clipNo, idx)
                    }
                  }}>
                  <div className="itemBox">
                    <div className="itemBox__status">
                      {badgeSpecial > 0 && badgeSpecial === 2 ? (
                        <em className="icon_wrap icon_bestdj">베스트DJ</em>
                      ) : isConDj === true ? (
                        <em className="icon_wrap icon_contentsdj">콘텐츠DJ</em>
                      ) : badgeSpecial === 1 ? (
                        <em className="icon_wrap icon_specialdj">스페셜DJ</em>
                      ) : (
                        <></>
                      )}
                    </div>

                    <div className="itemBox__score">
                      <span className="message">
                        {playCnt > 999 ? Utility.printNumber(replyCnt) : Utility.addComma(replyCnt)}
                      </span>
                      <span className="heart">{goodCnt > 999 ? Utility.printNumber(goodCnt) : Utility.addComma(goodCnt)}</span>
                    </div>
                  </div>
                  <div className="textBox">
                    <p className="textBox__title">{title}</p>
                    <div className="textBox__nickNameBox">
                      {gender !== '' && <em className={`icon_wrap ${gender === 'm' ? 'icon_male' : 'icon_female'}`}>성별</em>}
                      <span className="nickName">{nickName}</span>
                    </div>
                  </div>
                </li>
              )
            })
          ) : (
            <NoResult height={600} text="등록 된 클립이 없습니다." />
          )}
        </ul>
      </div>
    )
  }
}
