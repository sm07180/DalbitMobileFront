// Api
import React, {useCallback, useContext, useEffect, useState} from 'react'
// context
import Api from 'context/api'
import {Context} from 'context'
import Utility, {printNumber, addComma} from 'components/lib/utility'
import {OS_TYPE} from 'context/config.js'
// router
import {useParams, useHistory} from 'react-router-dom'
import {Hybrid} from 'context/hybrid'
import qs from 'query-string'
import {clipJoin} from 'pages/common/clipPlayer/clip_func'
// scss

// ----------------------------------------------------------------------
export default function ClipHistory() {
  let history = useHistory()
  const context = useContext(Context)
  const {webview} = qs.parse(location.search)
  // state
  const [currentPage, setCurrentPage] = useState(1)
  const [historyList, setHistoryList] = useState([])
  const [totalPage, setTotalPage] = useState(0)
  const [historyLoding, setHistoryLoading] = useState('')
  const [historyTab, setHistoryTab] = useState(0)
  const customHeader = JSON.parse(Api.customHeader)
  // fetch data
  const fetchDataList = async () => {
    const {result, data, message} = await Api.getHistoryList({
      memNo: context.profile.memNo,
      records: 100,
      slctType: historyTab
    })
    if (result === 'success') {
      setHistoryLoading(true)
      setHistoryList(data.list)
      if (data.paging) {
        setTotalPage(data.paging.totalPage)
      }
    } else {
      setHistoryLoading(false)
      context.action.alert({
        msg: message
      })
    }
  }
  // 플레이가공
  const fetchDataPlay = async (clipNum) => {
    const {result, data, message, code} = await Api.postClipPlay({
      clipNo: clipNum
    })
    if (result === 'success') {
      sessionStorage.removeItem('clipPlayListInfo')
      const oneClipPlayList = {
        clipNo: data.clipNo,
        bgImg: data.bgImg,
        title: data.title,
        nickName: data.nickName,
        subjectType: data.subjectType,
        isNew: data.isNew,
        filePlayTime: data.filePlayTime,
        isSpecial: data.isSpecial,
        gender: data.gender,
        replyCnt: data.replyCnt,
        goodCnt: data.goodCnt,
        playCnt: data.playCnt
      }
      localStorage.setItem('oneClipPlayList', JSON.stringify(oneClipPlayList))
      clipJoin(data, context, webview)
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
                if (context.token.isLogin === false) {
                  context.action.alert({
                    msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
                    callback: () => {
                      history.push('/login')
                    }
                  })
                } else {
                  context.action.updatePopup('APPDOWN', 'appDownAlrt', 2)
                }
              } else {
                //2020-10-15 웹뷰가 뉴 이고 방송방 청취 중일때만 금지, 클립 청취 중에는 가는것이 맞음
                if (webview === 'new') {
                  if (Utility.getCookie('listen_room_no') === undefined || Utility.getCookie('listen_room_no') === 'null') {
                    history.push(`/clip`)
                  } else {
                    return context.action.alert({msg: '방송 종료 후 청취 가능합니다. \n다시 시도해주세요.'})
                  }
                } else {
                  history.push(`/clip`)
                }
              }
            }}>
            청취 하러가기
          </button>
        </div>
      )
    } else {
      return (
        <div className="uploadList">
          {historyList.map((item, idx) => {
            const {bgImg, byeolCnt, clipNo, goodCnt, memNo, nickName, replyCnt, subjectType, title, gender} = item

            return (
              <React.Fragment key={`uploadList-${idx}`}>
                <div
                  className="uploadList__container"
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
                      fetchDataPlay(clipNo)
                    }
                  }}>
                  <img src={bgImg['thumb120x120']} className="uploadList__profImg" />
                  <div className="uploadList__details">
                    <div className="uploadList__topWrap">
                      {context.clipType.map((v, index) => {
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
    fetchDataList()
  }, [currentPage, historyTab])
  return (
    <div className="uploadWrap">
      {historyLoding && (
        <React.Fragment>
          <div className="historyBtnWrap">
            <button
              onClick={() => setHistoryTab(0)}
              className={historyTab === 0 ? 'historyBtn historyBtn--active' : 'historyBtn'}>
              최근
            </button>
            <button
              onClick={() => setHistoryTab(1)}
              className={historyTab === 1 ? 'historyBtn historyBtn--active' : 'historyBtn'}>
              좋아요
            </button>
            <button
              onClick={() => setHistoryTab(2)}
              className={historyTab === 2 ? 'historyBtn historyBtn--active' : 'historyBtn'}>
              선물
            </button>
          </div>
          {createContents()}
        </React.Fragment>
      )}
      {/* {historyList.length !== 0 && <button className="uploadBtn">업로드</button>} */}
    </div>
  )
}
