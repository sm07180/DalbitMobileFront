import React, {useEffect, useMemo, useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {calcDate, convertMonday} from 'pages/common/rank/rank_fn'
import {convertDateFormat} from 'components/lib/dalbit_moment'
import Utility from 'components/lib/utility'

import {OS_TYPE} from 'context/config'
import Api from 'context/api'
import {Hybrid, isHybrid} from 'context/hybrid'

import Header from 'components/ui/new_header.js'
import Layout from 'pages/common/layout/new_layout'
import NoResult from 'components/ui/new_noResult'
import {ClipPlayFn} from 'pages/clip/components/clip_play_fn'

import '../scss/clip.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxDateState, setGlobalCtxMessage} from "redux/actions/globalCtx";

export default function ClipRecommend() {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const customHeader = JSON.parse(Api.customHeader)
  const history = useHistory()

  const [textView, setTextView] = useState(false)
  const [marketingClipObj, setMarketingClipObj] = useState([])
  const [marketingClipList, setMarketingClipList] = useState([])
  // const [popupState, setPopupState] = useState(false)
  const [clip, setClip] = useState('')
  const contentText = useRef(null)
  const [buttonToggle, setButtonToggle] = useState(false)
  const [loading, setLoading] = useState(false)
  const [empty, setEmpty] = useState(false)

  const isLast = useMemo(() => {
    const currentDate = convertDateFormat(convertMonday(), 'YYYY-MM-DD')
    if (globalState.dateState >= currentDate) {
      return true
    } else {
      return false
    }
  }, [globalState.dateState])

  const isLastPrev = useMemo(() => {
    const currentDate = convertDateFormat(new Date('2020-10-26'), 'YYYY-MM-DD')

    if (globalState.dateState <= currentDate) {
      return true
    } else {
      return false
    }
  }, [globalState.dateState])

  const viewToggle = () => {
    if (textView === false) {
      setTextView(true)
      contentText.current.style.height = 'auto'
    } else {
      setTextView(false)
      contentText.current.style.height = '58px'
    }
  }
  const fetchMarketingClipList = async () => {
    const {result, data, message} = await Api.getMarketingClipList({
      recDate: globalState.dateState,
      isLogin: globalState.token.isLogin,
      isClick: true
    })
    if (result === 'success') {
      let length = data.recommendInfo.descMsg.split('\n').length
      if (length > 2) {
        setButtonToggle(true)
      } else {
        setButtonToggle(false)
      }

      setMarketingClipObj(data.recommendInfo)
      setClip(data.recommendInfo.clipNo)
      setLoading(false)
      if (data.list.length > 0) {
        setMarketingClipList(data.list)
        setEmpty(false)
      } else {
        setMarketingClipList([])
        setEmpty(true)
      }
    } else {
      setLoading(true)
      dispatch(setGlobalCtxMessage({type: "alert",msg: message}))
    }
  }

  const goUrl = (url) => {
    if (isHybrid()) {
      url += '?webview=new'
      Hybrid('openUrl', url)
    } else {
      window.open(url, '_blank')
    }
  }

  const createListenAllBtn = () => {
    if (
      globalState.customHeader['os'] === OS_TYPE['Desktop'] ||
      (globalState.customHeader['os'] === OS_TYPE['IOS'] && globalState.customHeader['appBuild'] >= 284) ||
      (globalState.customHeader['os'] === OS_TYPE['Android'] && globalState.customHeader['appBuild'] >= 52)
    ) {
      return (
        <button
          className="allPlay"
          onClick={() => {
            ClipPlayFn(marketingClipList[0].clipNo, 'all', globalState, dispatch, history)
            dispatch(setGlobalCtxDateState(marketingClipObj.recDate))
          }}>
          ????????????
        </button>
      )
    }
  }

  useEffect(() => {
    fetchMarketingClipList()
  }, [globalState.dateState])

  return (
    <Layout status="no_gnb">
      {!loading && (
        <div id="clipRecommend">
          <Header title="?????? ???????????????" />
          <div className="subContent gray">
            {marketingClipObj && (
              <>
                <div className="topBox">
                  <button
                    className={`prev ${isLastPrev === true ? ' noHover' : 'on'}`}
                    disabled={isLastPrev === true}
                    onClick={() => {
                      const date = calcDate(new Date(globalState.dateState), -7)
                      dispatch(setGlobalCtxDateState(convertDateFormat(date, 'YYYY-MM-DD')))
                    }}>
                    ??????
                  </button>
                  <h3 className="day">{marketingClipObj.time}</h3>
                  <button
                    className={`next ${isLast === true ? ' noHover' : 'on'}`}
                    disabled={isLast === true}
                    onClick={() => {
                      const date = calcDate(new Date(globalState.dateState), 7)
                      dispatch(setGlobalCtxDateState(convertDateFormat(date, 'YYYY-MM-DD')))
                    }}>
                    ??????
                  </button>
                </div>
                <div className="play">
                  <div className="titleMsgBox">{marketingClipObj.titleMsg}</div>
                  <div
                    className="video"
                    onClick={() => {
                      ClipPlayFn(marketingClipObj.clipNo, 'dal', globalState, dispatch, history)
                      dispatch(setGlobalCtxDateState(marketingClipObj.recDate))
                    }}>
                    {marketingClipObj.bannerUrl ? (
                      <img src={marketingClipObj.bannerUrl} alt="????????????????????????" width="360" height="208" />
                    ) : (
                      <></>
                    )}
                  </div>

                  <div className="videoItem">
                    <ul
                      className="scoreBox"
                      onClick={() => {
                        ClipPlayFn(marketingClipObj.clipNo, 'dal', globalState, dispatch, history)
                        dispatch(setGlobalCtxDateState(marketingClipObj.recDate))
                      }}>
                      <li className="scoreList">
                        <button className="scoreButton">
                          <img src="https://image.dalbitlive.com/svg/ic_gift.svg" alt="???" />
                        </button>
                        <span className="scoreNumber">{Utility.addComma(marketingClipObj.byeolCnt)}</span>
                      </li>
                      <li className="scoreList">
                        <button className="scoreButton">
                          <img src="https://image.dalbitlive.com/svg/ic_heart_g.svg" alt="?????????" />
                        </button>
                        <span className="scoreNumber">{Utility.addComma(marketingClipObj.goodCnt)}</span>
                      </li>
                      <li className="scoreList">
                        <button className="scoreButton">
                          <img src="https://image.dalbitlive.com/svg/ic_message_g.svg" alt="?????????" />
                        </button>
                        <span className="scoreNumber">{Utility.addComma(marketingClipObj.replyCnt)}</span>
                      </li>
                    </ul>
                    <div className="snsBox">
                      <h4 className="snsTitle">????????????</h4>
                      <ul className="snsList">
                        <li>
                          <button
                            onClick={() => {
                              goUrl(marketingClipObj.fbookUrl)
                            }}>
                            <img src="https://image.dalbitlive.com/svg/ic_facebook.svg" alt="???????????? ????????????" />
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              goUrl(marketingClipObj.instaUrl)
                            }}>
                            <img src="https://image.dalbitlive.com/svg/ic_instagram.svg" alt="????????? ?????? ????????????" />
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              goUrl(marketingClipObj.ytubeUrl)
                            }}>
                            <img src="https://image.dalbitlive.com/svg/ic_youtube.svg" alt="????????? ????????????" />
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="titleBox">
                    <h4
                      className="playName"
                      onClick={() => {
                        ClipPlayFn(marketingClipObj.clipNo, 'dal', globalState, dispatch, history)
                        dispatch(setGlobalCtxDateState(marketingClipObj.recDate))
                      }}>
                      {marketingClipObj.title}
                    </h4>

                    <div className="userItem">
                      {/* <span className="category">{marketingClipObj.subjectName}</span> */}
                      <p
                        className="nickName"
                        onClick={() => {
                          history.push(`/profile/${marketingClipObj.clipMemNo}`)
                          dispatch(setGlobalCtxDateState(marketingClipObj.recDate))
                        }}>
                        {marketingClipObj.nickNm}
                      </p>
                      <button
                        className="fileNumber"
                        onClick={() => {
                          history.push(`/profile/${marketingClipObj.clipMemNo}?tab=2`)
                          dispatch(setGlobalCtxDateState(marketingClipObj.recDate))
                        }}>
                        {Utility.addComma(marketingClipObj.regCnt)}
                      </button>
                    </div>
                  </div>

                  <div className="text">
                    <div className={`playInfo ${textView ? `isActive` : ``}`}>
                      <div
                        className="playText"
                        ref={contentText}
                        dangerouslySetInnerHTML={{__html: marketingClipObj.descMsg}}></div>
                      {buttonToggle && (
                        <button className={`more ${textView && 'on'}`} onClick={() => viewToggle()}>
                          <span>?????????</span>
                        </button>
                      )}
                      {buttonToggle}
                    </div>
                  </div>
                </div>
              </>
            )}

            {marketingClipList.length > 0 ? (
              <>
                <div className="listTitleBox">
                  <h3 className="listTitle">
                    ?????? ?????? ?????? ??????
                    <span className="subText">?????? ?????? ????????? &#38; ?????? ??????????????? ?????? ????</span>
                  </h3>

                  {createListenAllBtn()}
                </div>

                <ul className="playBox">
                  {marketingClipList.map((v, i) => {
                    return (
                      <li className="playBox__list" key={`list-${i}`}>
                        <div
                          className="thumbnail"
                          onClick={() => {
                            ClipPlayFn(v.clipNo, 'dal', globalState, dispatch, history)
                            dispatch(setGlobalCtxDateState(marketingClipObj.recDate))
                          }}>
                          <img src={v.bgImg.thumb292x292} alt="?????????" className="thumbnail__img" />

                          {/*<span className="thumbnail__specialDj">?????????Dj</span>*/}
                          <span className="thumbnail__playTime">{v.filePlayTime}</span>
                        </div>
                        <div
                          className="textItem"
                          onClick={() => {
                            ClipPlayFn(v.clipNo, 'dal', globalState, dispatch, history)
                            dispatch(setGlobalCtxDateState(marketingClipObj.recDate))
                          }}>
                          <div className="textItem__titleBox">
                            <div className="textItem__category">{v.subjectName}</div>
                            <h4 className="textItem__title">{v.title}</h4>
                          </div>
                          <div className="textItem__nickName">
                            {v.gender !== '' && (
                              <em className={`icon_wrap ${v.gender === 'm' ? 'icon_male' : 'icon_female'}`}>
                                <span className="blind">??????</span>
                              </em>
                            )}
                            <em className="nickName">{v.nickName}</em>
                          </div>
                          <ul className="textItem__scoreBox">
                            <li className="textItem__scoreList">
                              <span className="textItem__scoreList--message">{Utility.addComma(v.replyCnt)}</span>
                            </li>
                            <li className="textItem__scoreList">
                              <span className="textItem__scoreList--like">{Utility.addComma(v.goodCnt)}</span>
                            </li>
                          </ul>
                        </div>
                        <div className="textItem__buttonBox">
                          <button className="textItem__moreButton">
                            <span
                              className="textItem__moreButton--play"
                              onClick={() => {
                                ClipPlayFn(v.clipNo, 'dal', globalState, dispatch, history)
                                dispatch(setGlobalCtxDateState(marketingClipObj.recDate))
                              }}>
                              ????????? ?????????
                            </span>
                          </button>
                          <button className="textItem__moreButton">
                            <span
                              className="textItem__moreButton--people"
                              onClick={() => {
                                history.push(`/profile/${v.memNo}`)
                                dispatch(setGlobalCtxDateState(marketingClipObj.recDate))
                              }}>
                              ?????? ?????????
                            </span>
                          </button>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </>
            ) : (
              empty && marketingClipList.length === 0 && <NoResult type="default" text="????????? ????????? ????????????." />
            )}
          </div>
        </div>
      )}
      {/*{popupState && <RankPopup setPopupState={setPopupState} clip={clip} />}*/}
    </Layout>
  )
}
