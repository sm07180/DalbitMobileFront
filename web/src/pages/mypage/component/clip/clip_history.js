// Api
import React, {useCallback, useContext, useEffect, useState} from 'react'
// context
import Api from 'context/api'
import {Context} from 'context'
import Utility, {printNumber, addComma} from 'components/lib/utility'
// router
import {useParams, useHistory} from 'react-router-dom'
import {Hybrid} from 'context/hybrid'
import {clipJoin} from 'pages/common/clipPlayer/clip_func'
// scss

// ----------------------------------------------------------------------
export default function ClipHistory() {
  let history = useHistory()
  const context = useContext(Context)
  // state
  const [currentPage, setCurrentPage] = useState(1)
  const [historyList, setHistoryList] = useState([])
  const [totalPage, setTotalPage] = useState(0)
  const [historyLoding, setHistoryLoading] = useState('')
  const [historyTab, setHistoryTab] = useState(0)
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
  const createContents = () => {
    if (historyList.length === 0) {
      return (
        <div className="noResult">
          <span className="noResult__guideTxt">
            청취내역이 없습니다.
            <br /> 지금바로 청취해 보세요.
          </span>
          <button className="noResult__uploadBtn" onClick={() => history.push(`/clip`)}>
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
                <div className="uploadList__container" onClick={() => fetchDataPlay(clipNo)}>
                  <img src={bgImg['thumb120x120']} className="uploadList__profImg" />
                  <div className="uploadList__details">
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

                    {/* {globalState.clipType
                      .filter((v) => {
                        if (v.value === subjectType) return v;
                      })
                      .map((v1, index) => {
                        return <span key={index}>{v1.cdNm}</span>;
                      })} */}
                    <strong className="uploadList__title">{title}</strong>
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
