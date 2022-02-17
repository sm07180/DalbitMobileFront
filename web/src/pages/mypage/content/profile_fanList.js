import React, {useEffect, useRef, useState} from 'react'
import qs from 'query-string'
//styled
//context
import Api from 'context/api'
import {useHistory} from 'react-router-dom'
//scroll
import {Scrollbars} from 'react-custom-scrollbars'

import CloseBtn from '../static/close_w_l.svg'
import {useDispatch, useSelector} from "react-redux";
import {
  setGlobalCtxClose,
  setGlobalCtxCloseFanCnt,
  setGlobalCtxCloseGoodCnt,
  setGlobalCtxCloseSpecial,
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
      dispatch(setGlobalCtxMessage({
        type: "alert",
        callback: () => {
        },
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
      dispatch(setGlobalCtxMessage({
        type: "alert",
        callback: () => {
        },
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
      dispatch(setGlobalCtxMessage({
        type: "alert",
        callback: () => {
        },
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
  //등록,해제
  const Regist = (memNo, nickNm) => {
    async function fetchDataFanRegist(memNo) {
      const res = await Api.fan_change({
        data: {
          memNo: memNo
        }
      })
      if (res.result === 'success') {
        dispatch(setGlobalCtxMessage({
          type: "toast",
          msg: `${nickNm}님의 팬이 되었습니다`
        }))
        setSelect(memNo)
      } else if (res.result === 'fail') {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          callback: () => {
          },
          msg: res.message
        }))
      }
    }
    fetchDataFanRegist(memNo)
  }

  const Cancel = (memNo, isFan, nickNm) => {
    dispatch(setGlobalCtxMessage({
      type: "confirm",
      msg: `${nickNm} 님의 팬을 취소 하시겠습니까?`,
      callback: () => {
        async function fetchDataFanCancel(memNo, isFan) {
          const res = await Api.mypage_fan_cancel({
            data: {
              memNo: memNo
            }
          })
          if (res.result === 'success') {
            dispatch(setGlobalCtxMessage({
              type: "toast",
              msg: res.message
            }))
            setSelect(memNo + 1)
          } else if (res.result === 'fail') {
            dispatch(setGlobalCtxMessage({
              type: "alert",
              callback: () => {
              },
              msg: res.message
            }))
          }
        }
        fetchDataFanCancel(memNo)
      }
    }))
  }
  const closePopup = () => {
    if (name === '팬 랭킹') {
      dispatch(setGlobalCtxClose(false));
    } else if (name === '팬') {
      dispatch(setGlobalCtxCloseFanCnt(false));
    } else if (name === '스타') {
      dispatch(setGlobalCtxCloseStarCnt(false));
    } else if (name === '좋아요') {
      dispatch(setGlobalCtxCloseGoodCnt(false));
    } else if (name === '스디') {
      dispatch(setGlobalCtxCloseSpecial(false));
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
    } else if (name === '스디') {
      fetchDataSpecialList()
    }
  }, [select])

  useEffect(() => {
    window.onpopstate = (e) => {
      if (name === '팬 랭킹') {
        dispatch(setGlobalCtxClose(false));
      } else if (name === '팬') {
        dispatch(setGlobalCtxCloseFanCnt(false));
      } else if (name === '스타') {
        dispatch(setGlobalCtxCloseStarCnt(false));
      } else if (name === '좋아요') {
        dispatch(setGlobalCtxCloseGoodCnt(false));
      } else if (name === '스디') {
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
                <div className={`popup__title ${name === '스디' ? 'noBorder' : ''}`}>
                  {name !== '스디' && <h3 className="h3-tit">{name}</h3>}
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
                              link = globalState.token.memNo !== memNo ? `/mypage/${memNo}?webview=${webview}` : `/menu/profile`
                            } else {
                              link = globalState.token.memNo !== memNo ? `/mypage/${memNo}` : `/menu/profile`
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
                                {isFan === false && memNo !== globalState.token.memNo && (
                                  <button onClick={() => Regist(memNo, nickNm)} className="plusFan">
                                    +팬등록
                                  </button>
                                )}
                                {isFan === true && memNo !== globalState.token.memNo && (
                                  <button onClick={() => Cancel(memNo, isFan, nickNm)}>팬</button>
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
                              link = globalState.token.memNo !== memNo ? `/mypage/${memNo}?webview=${webview}` : `/menu/profile`
                            } else {
                              link = globalState.token.memNo !== memNo ? `/mypage/${memNo}` : `/menu/profile`
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
                                {isFan === false && memNo !== globalState.token.memNo && (
                                  <button onClick={() => Regist(memNo, nickNm)} className="plusFan">
                                    +팬등록
                                  </button>
                                )}
                                {isFan === true && memNo !== globalState.token.memNo && (
                                  <button onClick={() => Cancel(memNo, isFan, nickNm)}>팬</button>
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
                              link = globalState.token.memNo !== memNo ? `/mypage/${memNo}?webview=${webview}` : `/menu/profile`
                            } else {
                              link = globalState.token.memNo !== memNo ? `/mypage/${memNo}` : `/menu/profile`
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
                                {isFan === false && memNo !== globalState.token.memNo && (
                                  <button onClick={() => Regist(memNo, nickNm)} className="plusFan">
                                    +팬등록
                                  </button>
                                )}
                                {isFan === true && memNo !== globalState.token.memNo && (
                                  <button onClick={() => Cancel(memNo, isFan, nickNm)}>팬</button>
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
                              link = globalState.token.memNo !== memNo ? `/mypage/${memNo}?webview=${webview}` : `/menu/profile`
                            } else {
                              link = globalState.token.memNo !== memNo ? `/mypage/${memNo}` : `/menu/profile`
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
                                {isFan === false && memNo !== globalState.token.memNo && (
                                  <button onClick={() => Regist(memNo, nickNm)} className="plusFan">
                                    +팬등록
                                  </button>
                                )}
                                {isFan === true && memNo !== globalState.token.memNo && (
                                  <button onClick={() => Cancel(memNo, isFan, nickNm)}>팬</button>
                                )}
                              </div>
                            )
                          })}
                        {specialInfo !== '' && name === '스디' && (
                          <div className="historyWrap">
                            <div className={`historyWrap__header ${profile.badgeSpecial > 0 ? 'isSpecial' : ''}`}>
                              {profile.badgeSpecial > 0 ? (
                                <img src={SpecialBadgeOn} className="historyWrap__badge" />
                              ) : (
                                <img src={SpecialBadgeOff} className="historyWrap__badge" />
                              )}
                              <div className="historyWrap__info">
                                <span className="historyWrap__info__nick">{specialInfo.nickNm}</span> 님은 <br />
                                {profile.badgeSpecial > 0 ? '현재 스페셜 DJ입니다.' : '스페셜 DJ 출신입니다.'} <br />총
                                {profile.specialDjCnt}회 선정되셨습니다.
                              </div>
                            </div>
                            <h2 className="historyWrap__tableTitle">스페셜 DJ 약력</h2>
                            <div className="historyWrap__tableWrap">
                              <table>
                                <colgroup>
                                  <col width="50%" />
                                  <col width="50%" />
                                </colgroup>
                                <thead>
                                  <tr>
                                    <th>선정 일자</th>
                                    <th>선정 기수</th>
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
