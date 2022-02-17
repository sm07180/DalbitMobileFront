// Api
import React, {useCallback, useEffect, useState} from 'react'
// context
import Api from 'context/api'
import Utility from 'components/lib/utility'
import {OS_TYPE} from 'context/config.js'
import {HISTORY_SUBTAB_TYPE} from 'pages/mypage/content/constant'
// router
import {useHistory} from 'react-router-dom'
import qs from 'query-string'
import {clipJoin} from 'pages/common/clipPlayer/clip_func'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxClipType, setGlobalCtxMessage, setGlobalCtxUpdatePopup} from "redux/actions/globalCtx";
// scss

// ----------------------------------------------------------------------
export default function ClipHistory() {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  let history = useHistory()
  const {webview, subTab} = qs.parse(location.search)
  // state
  const [historyList, setHistoryList] = useState([])

  const [historyLoding, setHistoryLoading] = useState(false)
  const [historyTab, setHistoryTab] = useState(HISTORY_SUBTAB_TYPE.LATEST)
  const customHeader = JSON.parse(Api.customHeader)

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
      if (historyTab === HISTORY_SUBTAB_TYPE.LATEST) {
        localStorage.removeItem('clipPlayListInfo')
        const oneClipPlayList = {
          clipNo: data.clipNo,
          bgImg: data.bgImg,
          title: data.title,
          nickName: data.nickName,
          subjectType: data.subjectType,
          isNew: data.isNew,
          filePlayTime: data.filePlay,
          isSpecial: data.isSpecial,
          badgeSpecial: data.badgeSpecial,
          gender: data.gender,
          replyCnt: data.replyCnt,
          goodCnt: data.goodCnt,
          playCnt: data.playCnt
        }
        localStorage.setItem('oneClipPlayList', JSON.stringify(oneClipPlayList))
      } else {
        const nowPage = getPageFormIdx(idx)
        const playListInfoData = {
          memNo: globalState.profile.memNo,
          page: nowPage,
          records: 100,
          slctType: historyTab
        }
        localStorage.setItem('clipPlayListInfo', JSON.stringify(playListInfoData))
      }

      clipJoin(data, dispatch, globalState, webview)
    } else {
      if (code === '-99') {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: message,
          callback: () => {
            history.push('/login')
          }
        }))
      } else {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: message
        }))
      }
    }
  }
  // make contents
  const createContents = () => {
    if (historyList.length === 0) {
      return (
        <div className="noResult">
          <span className="noResult__guideTxt">
            청취내역이 없습니다.
            <br /> 지금바로 청취해 보세요.
          </span>
          <button
            className="noResult__uploadBtn"
            onClick={() => {
              if (customHeader['os'] === OS_TYPE['Desktop']) {
                dispatch(setGlobalCtxUpdatePopup({popup: ['APPDOWN', 'appDownAlrt', 2]}));
              } else {
                if (webview === 'new' && Utility.getCookie('native-player-info') !== undefined) {
                  dispatch(setGlobalCtxMessage({type: "alert", msg: '선택한 클립 재생은 청취중인 방송을\n 종료 한 후 가능합니다.'}))
                  return
                }
                history.push(`/clip`)
              }
            }}>
            청취 하러가기
          </button>
        </div>
      )
    } else {
      return (
        <div className="uploadList history_list">
          {historyList.map((item, idx) => {
            const {bgImg, byeolCnt, clipNo, goodCnt, memNo, nickName, replyCnt, subjectType, title, gender} = item

            return (
              <React.Fragment key={`uploadList-${idx}`}>
                <div
                  className="uploadList__container"
                  onClick={() => {
                    if (customHeader['os'] === OS_TYPE['Desktop']) {
                      dispatch(setGlobalCtxUpdatePopup({popup: ['APPDOWN', 'appDownAlrt', 4]}));
                    } else {
                      if (webview === 'new' && Utility.getCookie('native-player-info') !== undefined) {
                        dispatch(setGlobalCtxMessage({type: "alert", msg: '선택한 클립 재생은 청취중인 방송을\n 종료 한 후 가능합니다.'}))
                        return
                      }
                      fetchDataPlay(clipNo, idx)
                    }
                  }}>
                  <img src={bgImg['thumb120x120']} className="uploadList__profImg" />
                  <div className="uploadList__details">
                    <div className="uploadList__topWrap">
                      {globalState.clipType.map((v, index) => {
                        if (v.value === subjectType) {
                          return (
                            <div key={index} className="uploadList__categoryWrap">
                              <span className="uploadList__category">{v.cdNm}</span>
                              {/* {gender !== '' && <span className={gender === 'm' ? 'maleIcon' : 'femaleIcon'} />} */}
                            </div>
                          )
                        }
                      })}

                      <i className="uploadList__line"></i>

                      {/* {globalState.clipType
                      .filter((v) => {
                        if (v.value === subjectType) return v;
                      })
                      .map((v1, index) => {
                        return <span key={index}>{v1.cdNm}</span>;
                      })} */}
                      <strong className="uploadList__title">{title}</strong>
                    </div>

                    <em className="uploadList__nickName">{nickName}</em>

                    <div className="uploadList__cnt">
                      <em className="uploadList__cnt message">{replyCnt}</em>
                      <em className="uploadList__cnt like">
                        {goodCnt > 999 ? Utility.printNumber(goodCnt) : Utility.addComma(goodCnt)}
                      </em>
                      {/* <em className="uploadList__cnt star">
                        {byeolCnt > 999 ? Utility.printNumber(byeolCnt) : Utility.addComma(byeolCnt)}
                      </em> */}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )
          })}
        </div>
      )
    }
  }

  useEffect(() => {
    const fetchDataClipType = async () => {
      const {result, data} = await Api.getClipType({})
      if (result === 'success') {
        dispatch(setGlobalCtxClipType(data));
      } else {
      }
    }
    fetchDataClipType()
    // return () => {
    //   context.action.updateClipTab(HISTORY_TAB_TYPE.UPLOAD)
    // }
  }, [])

  useEffect(() => {
    const fetchDataList = async () => {
      const {result, data, message} = await Api.getHistoryList({
        memNo: globalState.profile.memNo,
        records: 100,
        slctType: historyTab
      })
      if (result === 'success') {
        setHistoryLoading(true)
        setHistoryList(data.list)
      } else {
        setHistoryLoading(false)
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: message
        }))
      }
    }

    fetchDataList()
  }, [historyTab])

  return (
    <div className="historyWrap">
      {historyLoding && (
        <>
          <div className="historyBtnWrap">
            <button
              onClick={() => setHistoryTab(HISTORY_SUBTAB_TYPE.LATEST)}
              className={historyTab === HISTORY_SUBTAB_TYPE.LATEST ? 'historyBtn historyBtn--active' : 'historyBtn'}>
              최근
            </button>
            <button
              onClick={() => setHistoryTab(HISTORY_SUBTAB_TYPE.GOOD)}
              className={historyTab === HISTORY_SUBTAB_TYPE.GOOD ? 'historyBtn historyBtn--active' : 'historyBtn'}>
              좋아요
            </button>
            <button
              onClick={() => setHistoryTab(HISTORY_SUBTAB_TYPE.GIFT)}
              className={historyTab === HISTORY_SUBTAB_TYPE.GIFT ? 'historyBtn historyBtn--active' : 'historyBtn'}>
              선물
            </button>
          </div>
          {createContents()}
        </>
      )}
      {/* {historyList.length !== 0 && <button className="uploadBtn">업로드</button>} */}
    </div>
  )
}
