import React, {useContext, useEffect, useReducer, useState} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import Api from 'context/api'
import {Context} from 'context'
import {Hybrid} from 'context/hybrid'
import Utility, {printNumber, addComma} from 'components/lib/utility'
import {clipJoin} from 'pages/common/clipPlayer/clip_func'
//flag
let currentPage = 1
let timer
let moreState = false

//svg
import PlayIcon from '../clip_play.svg'
import LikeIcon from '../clip_like.svg'
function ClipUpload() {
  let history = useHistory()
  let {memNo, category} = useParams()

  const context = useContext(Context)

  const [uploadList, setUploadList] = useState([])
  const [nextList, setNextList] = useState([])
  // 토탈페이지

  const [uploadListLoding, setUpLoadLoading] = useState('')

  const uploadModal = () => {
    Hybrid('ClipUploadJoin')
  }
  const fetchDataList = async (next) => {
    if (!next) currentPage = 1
    currentPage = next ? ++currentPage : currentPage
    const res = await Api.getUploadList({
      memNo: context.urlStr,
      page: currentPage,
      records: 10
    })
    if (res.result === 'success' && res.data.hasOwnProperty('list')) {
      setUpLoadLoading(true)
      if (res.data.list.length === 0) {
        if (!next) {
          setUploadList([])
        }
        moreState = false
      } else {
        setUpLoadLoading(true)
        if (next) {
          moreState = true
          setNextList(res.data.list)
        } else {
          setUploadList(res.data.list)
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
      clipJoin(data, context)
    } else {
    }
  }
  useEffect(() => {
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [nextList])
  const showMoreList = () => {
    setUploadList(uploadList.concat(nextList))
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
  }, [])

  const createContents = () => {
    if (uploadList.length === 0) {
      return (
        <div className="noResult">
          <span className="noResult__guideTxt">
            등록된 클립이 없습니다.
            <br /> {context.urlStr === context.profile.memNo && '클립을 업로드해 보세요.'}
          </span>
          {context.urlStr === context.profile.memNo ? (
            <button className="noResult__uploadBtn" onClick={() => uploadModal()}>
              클립 업로드
            </button>
          ) : (
            <button className="noResult__uploadBtn" onClick={() => history.push('/clip')}>
              청취 하러가기
            </button>
          )}
        </div>
      )
    } else if (context.urlStr === context.profile.memNo) {
      return (
        <div className="uploadList">
          {uploadList.map((item, idx) => {
            const {bgImg, byeolCnt, clipNo, goodCnt, memNo, nickName, playCnt, subjectType, title} = item

            return (
              <React.Fragment key={`uploadList-${idx}`}>
                <div className="uploadList__container" onClick={() => fetchDataPlay(clipNo)}>
                  <img src={bgImg['thumb120x120']} className="uploadList__profImg" />
                  <div className="uploadList__details">
                    {context.clipType.map((v, index) => {
                      if (v.value === subjectType) {
                        return (
                          <span key={index} className="uploadList__category">
                            {v.cdNm}
                          </span>
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
                      <em className="uploadList__cnt play">{playCnt}</em>
                      <em className="uploadList__cnt like">{goodCnt}</em>
                      <em className="uploadList__cnt star">
                        {byeolCnt > 999 ? Utility.printNumber(byeolCnt) : Utility.addComma(byeolCnt)}
                      </em>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )
          })}
          {/* {uploadList.length !== 0 && <button className="uploadBtn">업로드</button>} */}
        </div>
      )
    } else if (context.urlStr !== context.profile.memNo) {
      const windowHalfWidth = (window.innerWidth - 32) / 2
      return (
        <div className="listSimple">
          <ul className="listSimpleBox">
            {uploadList.map((item, idx) => {
              const {bgImg, byeolCnt, clipNo, goodCnt, memNo, nickName, playCnt, subjectType, title} = item
              return (
                <React.Fragment key={`uploadList-${idx}`}>
                  <li
                    className="listSimpleItem"
                    onClick={() => fetchDataPlay(clipNo)}
                    style={{
                      backgroundImage: `url('${bgImg[`thumb336x336`]}')`,
                      height: `${windowHalfWidth}px`,
                      cursor: 'pointer'
                    }}>
                    <div className="topWrap">
                      {/* {context.clipType.map((v, index) => {
                        if (v.value === subjectType) {
                          return (
                            <span key={index} className="uploadList__category">
                              {v.cdNm}
                            </span>
                          )
                        }
                      })} */}
                      <div className="topWrap__count">
                        <img className="topWrap__count--icon" src={PlayIcon} />
                        <span className="topWrap__count--num">{playCnt}</span>
                        <img className="topWrap__count--icon" src={LikeIcon} />
                        <span className="topWrap__count--num">{goodCnt}</span>
                      </div>
                    </div>

                    <div className="bottomWrap">
                      <p className="bottomWrap__nick">{nickName}</p>
                      <p className="bottomWrap__title">{title}</p>
                    </div>
                  </li>
                </React.Fragment>
              )
            })}
            {/* {uploadList.length !== 0 && <button className="uploadBtn">업로드</button>} */}
          </ul>
        </div>
      )
    }
  }
  return (
    <div
      className="uploadWrap"
      style={{
        padding: context.profile.memNo !== context.urlStr && '0',
        height: context.profile.memNo !== context.urlStr && 'calc(100vh - 50px)',
        backgroundColor: context.profile.memNo !== context.urlStr && '#eeeeee'
      }}>
      {uploadListLoding && createContents()}
    </div>
  )
}

export default ClipUpload