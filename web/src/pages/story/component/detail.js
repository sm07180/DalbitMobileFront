import React, {useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import Api from 'context/api'
import Utility from 'components/lib/utility'
import {debounce, isScrolledToBtm} from '../util/function'
import NoResult from 'components/ui/new_noResult'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

let totalPage = 1
const Detail = () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const history = useHistory()
  const {roomNo} = useParams()
  const [storyList, setStoryList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCnt, setTotalCnt] = useState(0)
  const [empty, setEmpty] = useState(false);

  function fetchStory() {
    Api.getStory({roomNo, page: currentPage, records: 10}).then((res) => {
      const {result, data, message} = res
      if (result === 'success') {
        const {list, paging} = data
        if(list.length > 0) {
          setEmpty(false)
          if (currentPage > 1) {
            setStoryList(storyList.concat(list))
          } else {
            setStoryList(list)
          }

          if (paging) {
            const {total} = paging
            setTotalCnt(total)
            totalPage = paging.totalPage
          }
        } else {
          setEmpty(true)
        }
      } else {
        dispatch(setGlobalCtxMessage({type: "alert", title: 'Error', msg: message}))
      }
    })
  }

  function deleteComment(storyIdx) {
    Api.deleteStory({roomNo, storyIdx}).then((res) => {
      const {result, message} = res
      if (result === 'success') {
        const filtered = storyList.filter((story) => story.storyIdx !== storyIdx)
        setStoryList(filtered)
        setTotalCnt(totalCnt - 1)
      } else {
        dispatch(setGlobalCtxMessage({type: "alert", title: 'Error', msg: message}))
      }
    })
  }

  const onDeleteClick = (storyIdx) => {
    dispatch(setGlobalCtxMessage({
      type: "confirm",
      msg: `????????? ?????????<br/> ????????? ??????????????????.<br/><div class="deleteConfWrap_emph">?????? ?????????????????????????</div>`,
      callback: () => deleteComment(storyIdx)
    }))
  }

  const scrollEvtHdr = debounce(() => {
    if (totalPage > currentPage && isScrolledToBtm()) {
      setCurrentPage(currentPage + 1)
    }
  }, 50)

  useEffect(() => {
    fetchStory()
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [currentPage])

  return (
    <div className="detailWrap">
      {storyList && storyList.length > 0 ? (
        <>
          <div className="title">
            <div className="mainTxt">
              <span className="label">??????</span>
              <span className="number">{totalCnt}</span>
            </div>
          </div>

          {storyList.map((story, idx) => {
            const {storyIdx, nickNm, profImg, contents, writeDt, writerNo} = story
            return (
              <div key={`story-${idx}`} className="storyWrap">
                <div className="userInfo">
                  <div className="photoWrap" onClick={() => history.push(`/mypage/${writerNo}`)}>
                    <div className="photoWrap__img">
                      <img src={profImg['thumb50x50']} alt={storyIdx} />
                    </div>
                    <div className="listTitle">
                      <div className="listTitle__name">{nickNm}</div>
                    </div>
                  </div>
                  <button className="deleteBtn" onClick={() => onDeleteClick(storyIdx)}>
                    ??????
                  </button>
                </div>
                <div className="storyContent">
                  <div className="storyContent__detail">{contents}</div>
                  <div className="storyContent__time">{Utility.timeFormat(writeDt)}</div>
                </div>
              </div>
            )
          })}
        </>
      ) : empty && (
        <NoResult type="default" text="?????? ????????? ????????????.<br/>" />
      )}
    </div>
  )
}

export default Detail
