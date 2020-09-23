import React, {useEffect, useState, useContext, useRef} from 'react'
import qs from 'query-string'
//styled
import styled from 'styled-components'
//context
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import {COLOR_MAIN} from 'context/color'
import Api from 'context/api'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'
//scroll
import {Scrollbars} from 'react-custom-scrollbars'

import CloseBtn from '../static/close_w_l.svg'

export default (props) => {
  const {webview} = qs.parse(location.search)
  const {name} = props
  //context------------------------------------------
  const context = useContext(Context)
  const ctx = useContext(Context)
  let history = useHistory()
  //pathname
  const urlrStr = props.location.pathname.split('/')[2]
  const {profile} = props
  const myProfileNo = ctx.profile.memNo
  const MyMemNo = context.profile && context.profile.memNo
  //state
  const [rankInfo, setRankInfo] = useState('')
  const [starInfo, setStarInfo] = useState('')
  const [fanInfo, setFanInfo] = useState('')
  const [goodInfo, setGoodInfo] = useState('')
  const [select, setSelect] = useState('')
  const [allFalse, setAllFalse] = useState(false)
  //scroll
  const scrollbars = useRef(null)
  const area = useRef()
  //api
  const fetchData = async () => {
    const res = await Api.mypage_fan_ranking({
      params: {
        memNo: profile.memNo,
        page: 1,
        records: 100
      }
    })
    if (res.result === 'success') {
      setRankInfo(res.data.list)
    } else {
      console.log(res)
    }
    return
  }

  const fetchDataStar = async () => {
    const res = await Api.mypage_star_list({
      params: {
        memNo: urlrStr
      }
    })
    if (res.result === 'success') {
      setStarInfo(res.data)
    } else {
      //console.log(res)
    }
    return
  }

  const fetchDataHoleFan = async () => {
    const res = await Api.mypage_fan_list({
      params: {
        memNo: urlrStr
      }
    })
    if (res.result === 'success') {
      setFanInfo(res.data.list)
    } else {
      context.action.alert({
        callback: () => {},
        msg: res.message
      })
    }
    return
  }

  const fetchDataGoodRank = async () => {
    const res = await Api.mypage_good_ranking({
      params: {
        memNo: profile.memNo
      }
    })
    if (res.result === 'success') {
      setGoodInfo(res.data.list)
    } else {
      context.action.alert({
        callback: () => {},
        msg: res.message
      })
    }
    return
  }

  //scroll function
  const scrollOnUpdate = () => {
    const thisHeight = document.querySelector('.scrollWrap').offsetHeight + 18
    document.querySelector('.scroll-box').children[0].style.maxHeight = `calc(${400}px)`
  }
  //등록,해제
  const Regist = (memNo) => {
    async function fetchDataFanRegist(memNo) {
      const res = await Api.fan_change({
        data: {
          memNo: memNo
        }
      })
      if (res.result === 'success') {
        context.action.alert({
          callback: () => {
            setSelect(memNo)
          },
          msg: '팬등록에 성공하였습니다.'
        })
      } else if (res.result === 'fail') {
        context.action.alert({
          callback: () => {},
          msg: res.message
        })
      }
    }
    fetchDataFanRegist(memNo)
  }

  const Cancel = (memNo, isFan) => {
    async function fetchDataFanCancel(memNo, isFan) {
      const res = await Api.mypage_fan_cancel({
        data: {
          memNo: memNo
        }
      })
      if (res.result === 'success') {
        context.action.alert({
          callback: () => {
            setSelect(memNo + 1)
          },
          msg: '팬등록을 해제하였습니다.'
        })
      } else if (res.result === 'fail') {
        context.action.alert({
          callback: () => {},
          msg: res.message
        })
      }
    }
    fetchDataFanCancel(memNo)
  }
  const closePopup = () => {
    if (name === '팬 랭킹') {
      context.action.updateClose(false)
    } else if (name === '팬') {
      context.action.updateCloseFanCnt(false)
    } else if (name === '스타') {
      context.action.updateCloseStarCnt(false)
    } else if (name === '좋아요') {
      context.action.updateCloseGoodCnt(false)
    }
  }

  //------------------------------------------------------------
  useEffect(() => {
    if (name === '스타') {
      fetchDataStar()
    } else if (name === '팬 랭킹') {
      fetchData()
    } else if (name === '팬') {
      fetchDataHoleFan()
    } else if (name === '좋아요') {
      fetchDataGoodRank()
    }
  }, [select])

  useEffect(() => {
    window.onpopstate = (e) => {
      if (name === '팬 랭킹') {
        context.action.updateClose(false)
      } else if (name === '팬') {
        context.action.updateCloseFanCnt(false)
      } else if (name === '스타') {
        context.action.updateCloseStarCnt(false)
      } else if (name === '좋아요') {
        context.action.updateCloseGoodCnt(false)
      }
    }
  }, [])

  useEffect(() => {
    if (rankInfo === null) {
      return <div style={{minHeight: '300px'}}></div>
    }
  }, [])

  const ClickUrl = (link) => {
    context.action.updateClose(false)
    context.action.updateCloseFanCnt(false)
    context.action.updateCloseStarCnt(false)
    context.action.updateCloseGoodCnt(false)

    history.push(link, {
      hash: window.location.hash
    })
  }

  useEffect(() => {
    /* popup떳을시 scroll 막는 코드 */
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])
  return (
    <div id="mainLayerPopup" onClick={closePopup}>
      <div className="popup popup-fanlist">
        <div className="popup__wrap">
          <div className="popbox active">
            <div className="popup__box popup__text">
              <div className="popup__inner" onClick={(e) => e.stopPropagation()}>
                <div className="popup__title">
                  <h3 className="h3-tit">{name}</h3>
                  <button className="close-btn" onClick={() => closePopup()}>
                    <img src={CloseBtn} alt="닫기" />
                  </button>
                </div>
                <div className="inner">
                  <div className="scrollWrap">
                    <div className="scrollWrap-inner">
                      <Scrollbars
                        className="scroll-box"
                        ref={scrollbars}
                        autoHeight
                        autoHeightMax={'100%'}
                        onUpdate={scrollOnUpdate}
                        autoHide>
                        {/* <div className="reportTitle"></div> */}
                        {rankInfo !== '' &&
                          name === '팬 랭킹' &&
                          rankInfo.map((item, index) => {
                            const {title, id, profImg, nickNm, isFan, memNo} = item
                            let link = ''
                            if (webview) {
                              link = ctx.token.memNo !== memNo ? `/mypage/${memNo}?webview=${webview}` : `/menu/profile`
                            } else {
                              link = ctx.token.memNo !== memNo ? `/mypage/${memNo}` : `/menu/profile`
                            }
                            return (
                              <div key={index} className={`fan-list ${urlrStr === memNo ? 'none' : ''}`}>
                                <div onClick={() => ClickUrl(link)}>
                                  <span
                                    className="thumb"
                                    style={{backgroundImage: `url(${profImg.thumb62x62})`}}
                                    bg={profImg.thumb62x62}></span>
                                  <span className="nickNm">{nickNm}</span>
                                </div>
                                {isFan === false && memNo !== ctx.token.memNo && (
                                  <button onClick={() => Regist(memNo)} className="plusFan">
                                    +팬등록
                                  </button>
                                )}
                                {isFan === true && memNo !== ctx.token.memNo && (
                                  <button onClick={() => Cancel(memNo, isFan)}>팬</button>
                                )}
                              </div>
                            )
                          })}
                        {starInfo !== '' &&
                          name === '스타' &&
                          starInfo.map((item, index) => {
                            const {title, id, profImg, nickNm, isFan, memNo} = item
                            let link = ''
                            if (webview) {
                              link = ctx.token.memNo !== memNo ? `/mypage/${memNo}?webview=${webview}` : `/menu/profile`
                            } else {
                              link = ctx.token.memNo !== memNo ? `/mypage/${memNo}` : `/menu/profile`
                            }
                            return (
                              <div key={index} className={`fan-list ${urlrStr === memNo ? 'none' : ''}`}>
                                <div onClick={() => ClickUrl(link)}>
                                  <span
                                    className="thumb"
                                    style={{backgroundImage: `url(${profImg.thumb62x62})`}}
                                    bg={profImg.thumb62x62}></span>
                                  <span className="nickNm">{nickNm}</span>
                                </div>
                                {isFan === false && memNo !== ctx.token.memNo && (
                                  <button onClick={() => Regist(memNo)} className="plusFan">
                                    +팬등록
                                  </button>
                                )}
                                {isFan === true && memNo !== ctx.token.memNo && (
                                  <button onClick={() => Cancel(memNo, isFan)}>팬</button>
                                )}
                              </div>
                            )
                          })}
                        {fanInfo !== '' &&
                          name === '팬' &&
                          fanInfo.map((item, index) => {
                            const {title, id, profImg, nickNm, isFan, memNo} = item
                            let link = ''
                            if (webview) {
                              link = ctx.token.memNo !== memNo ? `/mypage/${memNo}?webview=${webview}` : `/menu/profile`
                            } else {
                              link = ctx.token.memNo !== memNo ? `/mypage/${memNo}` : `/menu/profile`
                            }
                            return (
                              <div key={index} className={`fan-list ${urlrStr === memNo ? 'none' : ''}`}>
                                <div onClick={() => ClickUrl(link)}>
                                  <span
                                    className="thumb"
                                    style={{backgroundImage: `url(${profImg.thumb62x62})`}}
                                    bg={profImg.thumb62x62}></span>
                                  <span className="nickNm">{nickNm}</span>
                                </div>
                                {isFan === false && memNo !== ctx.token.memNo && (
                                  <button onClick={() => Regist(memNo)} className="plusFan">
                                    +팬등록
                                  </button>
                                )}
                                {isFan === true && memNo !== ctx.token.memNo && (
                                  <button onClick={() => Cancel(memNo, isFan)}>팬</button>
                                )}
                              </div>
                            )
                          })}

                        {goodInfo !== '' &&
                          name === '좋아요' &&
                          goodInfo.map((item, index) => {
                            const {title, id, profImg, nickNm, isFan, memNo} = item
                            let link = ''
                            if (webview) {
                              link = ctx.token.memNo !== memNo ? `/mypage/${memNo}?webview=${webview}` : `/menu/profile`
                            } else {
                              link = ctx.token.memNo !== memNo ? `/mypage/${memNo}` : `/menu/profile`
                            }
                            return (
                              <div key={index} className={`fan-list ${urlrStr === memNo ? 'none' : ''}`}>
                                <div onClick={() => ClickUrl(link)}>
                                  <span
                                    className="thumb"
                                    style={{backgroundImage: `url(${profImg.thumb62x62})`}}
                                    bg={profImg.thumb62x62}></span>
                                  <span className="nickNm">{nickNm}</span>
                                </div>
                                {isFan === false && memNo !== ctx.token.memNo && (
                                  <button onClick={() => Regist(memNo)} className="plusFan">
                                    +팬등록
                                  </button>
                                )}
                                {isFan === true && memNo !== ctx.token.memNo && (
                                  <button onClick={() => Cancel(memNo, isFan)}>팬</button>
                                )}
                              </div>
                            )
                          })}
                      </Scrollbars>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
