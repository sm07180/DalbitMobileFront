import React, {useState, useEffect, useContext, useMemo, useRef} from 'react'
import {Context} from 'context'
import {useHistory} from 'react-router-dom'
import {calcDate, convertMonday} from 'pages/common/rank/rank_fn'
import {convertDateFormat} from 'components/lib/dalbit_moment'
import {OS_TYPE} from 'context/config'
import {clipJoin} from 'pages/common/clipPlayer/clip_func'
import Api from 'context/api'
import Utility from 'components/lib/utility'
import {Hybrid, isHybrid} from 'context/hybrid'

import Header from 'components/ui/new_header.js'
import Layout from 'pages/common/layout/new_layout'
import RankPopup from './clip_recommend_rank_list'
import NoResult from 'components/ui/new_noResult'
import '../clip.scss'
import set from '@babel/runtime/helpers/esm/set'

export default function clipRecommend() {
  const context = useContext(Context)
  const customHeader = JSON.parse(Api.customHeader)
  const history = useHistory()

  const [textView, setTextView] = useState(false)
  const [marketingClipObj, setMarketingClipObj] = useState([])
  const [marketingClipList, setMarketingClipList] = useState([])
  // const [popupState, setPopupState] = useState(false)
  const [clip, setClip] = useState('')
  const contentText = useRef(null)
  const [buttonToggle, setButtonToggle] = useState(false)

  const isLast = useMemo(() => {
    const currentDate = convertDateFormat(convertMonday(), 'YYYY-MM-DD')
    if (context.dateState >= currentDate) {
      return true
    } else {
      return false
    }
  }, [context.dateState])

  const isLastPrev = useMemo(() => {
    const currentDate = convertDateFormat(new Date('2020-10-26'), 'YYYY-MM-DD')

    if (context.dateState <= currentDate) {
      return true
    } else {
      return false
    }
  }, [context.dateState])

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
      recDate: context.dateState,
      isLogin: context.token.isLogin,
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
      setMarketingClipList(data.list)
      setClip(data.recommendInfo.clipNo)
    } else {
      context.action.alert({msg: message})
    }
  }

  const fetchDataPlay = async (clipNum, type) => {
    const {result, data, message, code} = await Api.postClipPlay({
      clipNo: clipNum
    })
    if (result === 'success') {
      if (type === 'dal') {
        localStorage.removeItem('clipPlayListInfo')
      }
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

  const goUrl = (url) => {
    if (isHybrid()) {
      url += '?webview=new'
      Hybrid('openUrl', url)
    } else {
      window.open(url, '_blank')
    }
  }

  useEffect(() => {
    fetchMarketingClipList()
  }, [context.dateState])

  useEffect(() => {
    if (context.token.isLogin === false) {
      history.push('/')
    }
  }, [context.token.isLogin])

  return (
    <Layout status="no_gnb">
      <Header title="주간 클립테이블" />
      <div id="clipRecommend">
        <div className="subContent gray">
          {marketingClipObj && (
            <>
              <div className="topBox">
                <button
                  className={`prev ${isLastPrev === true ? ' noHover' : 'on'}`}
                  disabled={isLastPrev === true}
                  onClick={() => {
                    const date = calcDate(new Date(context.dateState), -7)
                    context.action.updateDateState(convertDateFormat(date, 'YYYY-MM-DD'))
                  }}>
                  이전
                </button>
                <h3 className="day">{marketingClipObj.time}</h3>
                <button
                  className={`next ${isLast === true ? ' noHover' : 'on'}`}
                  disabled={isLast === true}
                  onClick={() => {
                    const date = calcDate(new Date(context.dateState), 7)
                    context.action.updateDateState(convertDateFormat(date, 'YYYY-MM-DD'))
                  }}>
                  다음
                </button>
              </div>
              <div className="play">
                <div className="titleMsgBox">{marketingClipObj.titleMsg}</div>
                <div
                  className="video"
                  onClick={() => {
                    if (customHeader['os'] === OS_TYPE['Desktop']) {
                      if (context.token.isLogin === false) {
                        context.action.alert({
                          msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
                          callback: () => {
                            history.push('/login')
                          }
                        })
                      } else {
                        context.action.updatePopup('APPDOWN', 'appDownAlrt', 4)
                      }
                    } else {
                      fetchDataPlay(marketingClipObj.clipNo, 'dal')
                    }
                    context.action.updateDateState(marketingClipObj.recDate)
                  }}>
                  {marketingClipObj.bannerUrl ? (
                    <img src={marketingClipObj.bannerUrl} alt="클립썸네일이미지" width="360" height="208" />
                  ) : (
                    <></>
                  )}
                </div>

                <div className="videoItem">
                  <ul
                    className="scoreBox"
                    onClick={() => {
                      if (customHeader['os'] === OS_TYPE['Desktop']) {
                        if (context.token.isLogin === false) {
                          context.action.alert({
                            msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
                            callback: () => {
                              history.push('/login')
                            }
                          })
                        } else {
                          context.action.updatePopup('APPDOWN', 'appDownAlrt', 4)
                        }
                      } else {
                        fetchDataPlay(marketingClipObj.clipNo, 'dal')
                      }
                      context.action.updateDateState(marketingClipObj.recDate)
                    }}>
                    <li className="scoreList">
                      <button className="scoreButton">
                        <img src="https://image.dalbitlive.com/svg/ic_gift.svg" alt="별" />
                      </button>
                      <span className="scoreNumber">{Utility.addComma(marketingClipObj.byeolCnt)}</span>
                    </li>
                    <li className="scoreList">
                      <button className="scoreButton">
                        <img src="https://image.dalbitlive.com/svg/ic_heart_g.svg" alt="좋아요" />
                      </button>
                      <span className="scoreNumber">{Utility.addComma(marketingClipObj.goodCnt)}</span>
                    </li>
                    <li className="scoreList">
                      <button className="scoreButton">
                        <img src="https://image.dalbitlive.com/svg/ic_message_g.svg" alt="조회수" />
                      </button>
                      <span className="scoreNumber">{Utility.addComma(marketingClipObj.replyCnt)}</span>
                    </li>
                  </ul>
                  <div className="snsBox">
                    <h4 className="snsTitle">바로가기</h4>
                    <ul className="snsList">
                      <li>
                        <button
                          onClick={() => {
                            goUrl(marketingClipObj.fbookUrl)
                          }}>
                          <img src="https://image.dalbitlive.com/svg/ic_facebook.svg" alt="페이스북 바로가기" />
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            goUrl(marketingClipObj.instaUrl)
                          }}>
                          <img src="https://image.dalbitlive.com/svg/ic_instagram.svg" alt="인스타 그램 바로가기" />
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            goUrl(marketingClipObj.ytubeUrl)
                          }}>
                          <img src="https://image.dalbitlive.com/svg/ic_youtube.svg" alt="유튜브 바로가기" />
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="titleBox">
                  <h4
                    className="playName"
                    onClick={() => {
                      if (customHeader['os'] === OS_TYPE['Desktop']) {
                        if (context.token.isLogin === false) {
                          context.action.alert({
                            msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
                            callback: () => {
                              history.push('/login')
                            }
                          })
                        } else {
                          context.action.updatePopup('APPDOWN', 'appDownAlrt', 4)
                        }
                      } else {
                        fetchDataPlay(marketingClipObj.clipNo, 'dal')
                      }
                      context.action.updateDateState(marketingClipObj.recDate)
                    }}>
                    {marketingClipObj.title}
                  </h4>

                  <div className="userItem">
                    {/* <span className="category">{marketingClipObj.subjectName}</span> */}
                    <p
                      className="nickName"
                      onClick={() => {
                        history.push(`/mypage/${marketingClipObj.clipMemNo}`)
                        context.action.updateDateState(marketingClipObj.recDate)
                      }}>
                      {marketingClipObj.nickNm}
                    </p>
                    <button
                      className="fileNumber"
                      onClick={() => {
                        history.push(`/mypage/${marketingClipObj.clipMemNo}?tab=2`)
                        context.action.updateDateState(marketingClipObj.recDate)
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
                        <span>더보기</span>
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
                  함께 듣기 좋은 클립
                  <span className="subText">클립 듣고 좋아요 &#38; 댓글 남겨주시는 센스 😊</span>
                </h3>
                {/*<button className="allPlay" onClick={() => {}}>전체듣기</button>*/}
              </div>

              <ul className="playBox">
                {marketingClipList.map((v, i) => {
                  return (
                    <li className="playBox__list" key={`list-${i}`}>
                      <div
                        className="thumbnail"
                        onClick={() => {
                          if (customHeader['os'] === OS_TYPE['Desktop']) {
                            if (context.token.isLogin === false) {
                              context.action.alert({
                                msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
                                callback: () => {
                                  history.push('/login')
                                }
                              })
                            } else {
                              context.action.updatePopup('APPDOWN', 'appDownAlrt', 4)
                            }
                          } else {
                            fetchDataPlay(v.clipNo, 'dal')
                          }
                          context.action.updateDateState(marketingClipObj.recDate)
                        }}>
                        <img src={v.bgImg.thumb62x62} alt="썸네일" className="thumbnail__img" />

                        {/*<span className="thumbnail__specialDj">스페셜Dj</span>*/}
                        <span className="thumbnail__playTime">{v.filePlay}</span>
                      </div>
                      <div
                        className="textItem"
                        onClick={() => {
                          if (customHeader['os'] === OS_TYPE['Desktop']) {
                            if (context.token.isLogin === false) {
                              context.action.alert({
                                msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
                                callback: () => {
                                  history.push('/login')
                                }
                              })
                            } else {
                              context.action.updatePopup('APPDOWN', 'appDownAlrt', 4)
                            }
                          } else {
                            fetchDataPlay(v.clipNo, 'dal')
                          }
                          context.action.updateDateState(marketingClipObj.recDate)
                        }}>
                        <div className="textItem__titleBox">
                          <div className="textItem__category">{v.subjectName}</div>
                          <h4 className="textItem__title">{v.title}</h4>
                        </div>
                        <div className="textItem__nickName">
                          {v.gender === 'f' && (
                            <img src="https://image.dalbitlive.com/svg/gender_w_w.svg" className="femaleIcon" alt="남성" />
                          )}
                          {v.gender === 'm' && (
                            <img src="https://image.dalbitlive.com/svg/gender_m_w.svg" className="maleIcon" alt="여성" />
                          )}
                          {v.nickNm}
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
                              if (customHeader['os'] === OS_TYPE['Desktop']) {
                                if (context.token.isLogin === false) {
                                  context.action.alert({
                                    msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
                                    callback: () => {
                                      history.push('/login')
                                    }
                                  })
                                } else {
                                  context.action.updatePopup('APPDOWN', 'appDownAlrt', 4)
                                }
                              } else {
                                fetchDataPlay(v.clipNo, 'dal')
                              }
                              context.action.updateDateState(marketingClipObj.recDate)
                            }}>
                            플레이 아이콘
                          </span>
                        </button>
                        <button className="textItem__moreButton">
                          <span
                            className="textItem__moreButton--people"
                            onClick={() => {
                              history.push(`/mypage/${v.memNo}`)
                              context.action.updateDateState(marketingClipObj.recDate)
                            }}>
                            사람 아이콘
                          </span>
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </>
          ) : (
            <NoResult type="default" text="등록된 클립이 없습니다." />
          )}
        </div>
      </div>
      {/*{popupState && <RankPopup setPopupState={setPopupState} clip={clip} />}*/}
    </Layout>
  )
}
