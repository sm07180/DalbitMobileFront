import React, {useState, useEffect, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import Utility from 'components/lib/utility'
import {isScrolledToBtm, debounce} from '../util/function'
import NoResult from 'components/ui/new_noResult'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

let totalPage = 1
const Detail = () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory()
  const [storyList, setStoryList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCnt, setTotalCnt] = useState(0)
  const [empty, setEmpty] = useState(false)

  function fetchStory() {
    Api.getSentStoryList({page: currentPage, records: 10}).then((res) => {
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
        dispatch(setGlobalCtxMessage({type:"alert",title: 'Error', msg: message}))
      }
    })
  }

  function deleteComment(roomNo, storyIdx) {
    Api.deleteStory({roomNo, storyIdx}).then((res) => {
      const {result, message} = res
      if (result === 'success') {
        const filtered = storyList.filter((story) => story.storyIdx !== storyIdx)
        setStoryList(filtered)
        setTotalCnt(totalCnt - 1)
      } else {
        dispatch(setGlobalCtxMessage({type:"alert",title: 'Error', msg: message}))
      }
    })
  }

  const onDeleteClick = (roomNo, storyIdx) => {
    dispatch(setGlobalCtxMessage({type:"confirm",
      msg: `삭제된 사연은<br/> 복구가 불가능합니다.<br/><div class="deleteConfWrap_emph">정말 삭제하시겠습니까?</div>`,
      callback: () => deleteComment(roomNo, storyIdx)
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
    <div className="detailWrap detailWrap-sm">
      {storyList && storyList.length > 0 ? (
        <>
          <div className="title">
            <div className="mainTxt">
              <span className="label">사연</span>
              <span className="number">{totalCnt}</span>
            </div>
          </div>

          {storyList.map((story, idx) => {
            const {storyIdx, title, djNickNm, djProfImg, contents, writeDt, roomNo, djMemNo} = story

            return (
              <div key={`story-${idx}`} className="storyWrap">
                <div className="userInfo">
                  <div className="photoWrap" onClick={() => history.push(`/mypage/${djMemNo}`)}>
                    <div className="photoWrap__img photoWrap__img--lg">
                      <img src={djProfImg['thumb50x50']} alt={storyIdx} />
                    </div>
                    <div className="listTitle">
                      <div className="listTitle__title">{title}</div>
                      <div className="listTitle__nameWrap">
                        <div className="listTitle__nameWrap__icon">
                          <span>DJ</span>
                        </div>
                        <div className="listTitle__nameWrap__name">{djNickNm}</div>
                      </div>
                    </div>
                  </div>
                  <button className="deleteBtn" onClick={() => onDeleteClick(roomNo, storyIdx)}>
                    삭제
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
        <NoResult type="default" text="보낸 사연이 없습니다.<br/> 좋아하는 DJ의 방송에서 사연을 보내세요." />
      )}
    </div>
  )
}

export default Detail
