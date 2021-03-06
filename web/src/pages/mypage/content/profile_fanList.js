import React, {useEffect, useState, useContext, useRef} from 'react'
import qs from 'query-string'
//styled
import styled from 'styled-components'
//context
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import {COLOR_MAIN} from 'context/color'
import Api from 'context/api'
import {useHistory} from 'react-router-dom'
//scroll
import {Scrollbars} from 'react-custom-scrollbars'

import CloseBtn from '../static/close_w_l.svg'
import {useDispatch, useSelector} from "react-redux";
import {
  setGlobalCtxClose,
  setGlobalCtxCloseFanCnt, setGlobalCtxCloseGoodCnt, setGlobalCtxCloseSpecial,
  setGlobalCtxCloseStarCnt,
  setGlobalCtxMessage
} from "redux/actions/globalCtx";

export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  let {webview} = qs.parse(location.search)
  if (sessionStorage.getItem('webview') === 'new') {
    webview = 'new'
  }
  const {name} = props
  let history = useHistory()
  //pathname
  const urlrStr = props.location.pathname.split('/')[2]
  const {profile} = props
  const myProfileNo = globalState.profile.memNo
  const MyMemNo = globalState.profile && globalState.profile.memNo
  //state
  const [rankInfo, setRankInfo] = useState('')
  const [starInfo, setStarInfo] = useState('')
  const [fanInfo, setFanInfo] = useState('')
  const [goodInfo, setGoodInfo] = useState('')
  const [specialInfo, setSpecialInfo] = useState('')
  const [select, setSelect] = useState('')
  const [allFalse, setAllFalse] = useState(false)
  //scroll
  const scrollbars = useRef(null)
  const area = useRef()
  //img
  const SpecialBadgeOff = 'https://image.dalbitlive.com/svg/specialdj_off_s.svg'
  const SpecialBadgeOn = 'https://image.dalbitlive.com/svg/specialdj_on_s.svg'
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
        memNo: urlrStr,
        page: 1,
        records: 100,
        sortType: 0
      }
    })
    if (res.result === 'success') {
      console.log(res.data.list)
      setStarInfo(res.data.list)
    } else {
      //console.log(res)
    }
    return
  }

  const fetchDataHoleFan = async () => {
    const res = await Api.mypage_fan_list({
      params: {
        memNo: urlrStr,
        sortType: 0
      }
    })
    if (res.result === 'success') {
      setFanInfo(res.data.list)
    } else {
      dispatch(setGlobalCtxMessage({type: "alert",
        callback: () => {},
        msg: res.message
      }))
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
      dispatch(setGlobalCtxMessage({type: "alert",
        callback: () => {},
        msg: res.message
      }))
    }
    return
  }
  const fetchDataSpecialList = async () => {
    const res = await Api.specialHistory({
      params: {
        memNo: profile.memNo
      }
    })
    if (res.result === 'success') {
      setSpecialInfo(res.data)
    } else {
      dispatch(setGlobalCtxMessage({type: "alert",
        callback: () => {},
        msg: res.message
      }))
    }
    return
  }

  //scroll function
  const scrollOnUpdate = () => {
    const thisHeight = document.querySelector('.scrollWrap').offsetHeight + 18
    document.querySelector('.scroll-box').children[0].style.maxHeight = `calc(${400}px)`
  }
  //??????,??????
  const Regist = (memNo, nickNm) => {
    async function fetchDataFanRegist(memNo) {
      const res = await Api.fan_change({
        data: {
          memNo: memNo
        }
      })
      if (res.result === 'success') {
        dispatch(setGlobalCtxMessage({type: "toast",
          msg: `${nickNm}?????? ?????? ???????????????`
        }))
        setSelect(memNo)
      } else if (res.result === 'fail') {
        dispatch(setGlobalCtxMessage({type: "alert",
          callback: () => {},
          msg: res.message
        }))
      }
    }
    fetchDataFanRegist(memNo)
  }

  const Cancel = (memNo, isFan, nickNm) => {
    dispatch(setGlobalCtxMessage({type: "confirm",
      msg: `${nickNm} ?????? ?????? ?????? ???????????????????`,
      callback: () => {
        async function fetchDataFanCancel(memNo, isFan) {
          const res = await Api.mypage_fan_cancel({
            data: {
              memNo: memNo
            }
          })
          if (res.result === 'success') {
            dispatch(setGlobalCtxMessage({type: "toast",
              msg: res.message
            }))
            setSelect(memNo + 1)
          } else if (res.result === 'fail') {
            dispatch(setGlobalCtxMessage({type: "alert",
              callback: () => {},
              msg: res.message
            }))
          }
        }
        fetchDataFanCancel(memNo)
      }
    }))
  }
  const closePopup = () => {
    if (name === '??? ??????') {
      dispatch(setGlobalCtxClose(false));
    } else if (name === '???') {
      dispatch(setGlobalCtxCloseFanCnt(false));
    } else if (name === '??????') {
      dispatch(setGlobalCtxCloseStarCnt(false));
    } else if (name === '?????????') {
      dispatch(setGlobalCtxCloseGoodCnt(false));
    } else if (name === '??????') {
      dispatch(setGlobalCtxCloseSpecial(false));
    }
  }

  //------------------------------------------------------------
  useEffect(() => {
    if (name === '??????') {
      fetchDataStar()
    } else if (name === '??? ??????') {
      fetchData()
    } else if (name === '???') {
      fetchDataHoleFan()
    } else if (name === '?????????') {
      fetchDataGoodRank()
    } else if (name === '??????') {
      fetchDataSpecialList()
    }
  }, [select])

  useEffect(() => {
    window.onpopstate = (e) => {
      if (name === '??? ??????') {
        dispatch(setGlobalCtxClose(false));
      } else if (name === '???') {
        dispatch(setGlobalCtxCloseFanCnt(false));
      } else if (name === '??????') {
        dispatch(setGlobalCtxCloseStarCnt(false));
      } else if (name === '?????????') {
        dispatch(setGlobalCtxCloseGoodCnt(false));
      } else if (name === '??????') {
        dispatch(setGlobalCtxCloseSpecial(false));
      }
    }
  }, [])

  useEffect(() => {
    if (rankInfo === null) {
      return <div style={{minHeight: '300px'}}></div>
    }
  }, [])

  const ClickUrl = (link) => {
    dispatch(setGlobalCtxClose(false));
    dispatch(setGlobalCtxCloseFanCnt(false));
    dispatch(setGlobalCtxCloseStarCnt(false));
    dispatch(setGlobalCtxCloseGoodCnt(false));
    dispatch(setGlobalCtxCloseSpecial(false));
    history.push(link, {
      hash: window.location.hash
    })
  }

  useEffect(() => {
    /* popup????????? scroll ?????? ?????? */
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
                <div className={`popup__title ${name === '??????' ? 'noBorder' : ''}`}>
                  {name !== '??????' && <h3 className="h3-tit">{name}</h3>}
                  <button className="close-btn" onClick={() => closePopup()}>
                    <img src={CloseBtn} alt="??????" />
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
                          name === '??? ??????' &&
                          rankInfo.map((item, index) => {
                            const {title, id, profImg, nickNm, isFan, memNo} = item
                            let link = `/profile/${memNo}?webview=${webview}`;
                            return (
                              <div key={index} className={`fan-list ${urlrStr === memNo ? 'none' : ''}`}>
                                <div onClick={() => ClickUrl(link)}>
                                  <span
                                    className="thumb"
                                    style={{backgroundImage: `url(${profImg.thumb62x62})`}}
                                    bg={profImg.thumb62x62}></span>
                                  <span className="nickNm">{nickNm}</span>
                                </div>
                                {isFan === false && memNo !== globalState.token.memNo && (
                                  <button onClick={() => Regist(memNo, nickNm)} className="plusFan">
                                    +?????????
                                  </button>
                                )}
                                {isFan === true && memNo !== globalState.token.memNo && (
                                  <button onClick={() => Cancel(memNo, isFan, nickNm)}>???</button>
                                )}
                              </div>
                            )
                          })}
                        {starInfo !== '' &&
                          name === '??????' &&
                          starInfo.map((item, index) => {
                            const {title, id, profImg, nickNm, isFan, memNo} = item
                            let link = `/profile/${memNo}?webview=${webview}`;
                            return (
                              <div key={index} className={`fan-list ${urlrStr === memNo ? 'none' : ''}`}>
                                <div onClick={() => ClickUrl(link)}>
                                  <span
                                    className="thumb"
                                    style={{backgroundImage: `url(${profImg.thumb62x62})`}}
                                    bg={profImg.thumb62x62}></span>
                                  <span className="nickNm">{nickNm}</span>
                                </div>
                                {isFan === false && memNo !== globalState.token.memNo && (
                                  <button onClick={() => Regist(memNo, nickNm)} className="plusFan">
                                    +?????????
                                  </button>
                                )}
                                {isFan === true && memNo !== globalState.token.memNo && (
                                  <button onClick={() => Cancel(memNo, isFan, nickNm)}>???</button>
                                )}
                              </div>
                            )
                          })}
                        {fanInfo !== '' &&
                          name === '???' &&
                          fanInfo.map((item, index) => {
                            const {title, id, profImg, nickNm, isFan, memNo} = item
                            let link = `/profile/${memNo}?webview=${webview}`;
                            return (
                              <div key={index} className={`fan-list ${urlrStr === memNo ? 'none' : ''}`}>
                                <div onClick={() => ClickUrl(link)}>
                                  <span
                                    className="thumb"
                                    style={{backgroundImage: `url(${profImg.thumb62x62})`}}
                                    bg={profImg.thumb62x62}></span>
                                  <span className="nickNm">{nickNm}</span>
                                </div>
                                {isFan === false && memNo !== globalState.token.memNo && (
                                  <button onClick={() => Regist(memNo, nickNm)} className="plusFan">
                                    +?????????
                                  </button>
                                )}
                                {isFan === true && memNo !== globalState.token.memNo && (
                                  <button onClick={() => Cancel(memNo, isFan, nickNm)}>???</button>
                                )}
                              </div>
                            )
                          })}
                        {goodInfo !== '' &&
                          name === '?????????' &&
                          goodInfo.map((item, index) => {
                            const {title, id, profImg, nickNm, isFan, memNo} = item
                            let link = `/profile/${memNo}?webview=${webview}`;
                            return (
                              <div key={index} className={`fan-list ${urlrStr === memNo ? 'none' : ''}`}>
                                <div onClick={() => ClickUrl(link)}>
                                  <span
                                    className="thumb"
                                    style={{backgroundImage: `url(${profImg.thumb62x62})`}}
                                    bg={profImg.thumb62x62}></span>
                                  <span className="nickNm">{nickNm}</span>
                                </div>
                                {isFan === false && memNo !== globalState.token.memNo && (
                                  <button onClick={() => Regist(memNo, nickNm)} className="plusFan">
                                    +?????????
                                  </button>
                                )}
                                {isFan === true && memNo !== globalState.token.memNo && (
                                  <button onClick={() => Cancel(memNo, isFan, nickNm)}>???</button>
                                )}
                              </div>
                            )
                          })}
                        {specialInfo !== '' && name === '??????' && (
                          <div className="historyWrap">
                            <div className={`historyWrap__header ${profile.badgeSpecial > 0 ? 'isSpecial' : ''}`}>
                              {profile.badgeSpecial > 0 ? (
                                <img src={SpecialBadgeOn} className="historyWrap__badge" />
                              ) : (
                                <img src={SpecialBadgeOff} className="historyWrap__badge" />
                              )}
                              <div className="historyWrap__info">
                                <span className="historyWrap__info__nick">{specialInfo.nickNm}</span> ?????? <br />
                                {profile.badgeSpecial > 0 ? '?????? ????????? DJ?????????.' : '????????? DJ ???????????????.'} <br />???
                                {profile.specialDjCnt}??? ?????????????????????.
                              </div>
                            </div>
                            <h2 className="historyWrap__tableTitle">????????? DJ ??????</h2>
                            <div className="historyWrap__tableWrap">
                              <table>
                                <colgroup>
                                  <col width="50%" />
                                  <col width="50%" />
                                </colgroup>
                                <thead>
                                  <tr>
                                    <th>?????? ??????</th>
                                    <th>?????? ??????</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {specialInfo.list.map((item, index) => {
                                    const {roundNo, selectionDate} = item
                                    return (
                                      <React.Fragment key={`idx` + index}>
                                        <tr>
                                          <td>{selectionDate}</td>
                                          <td>{roundNo}</td>
                                        </tr>
                                      </React.Fragment>
                                    )
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
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
