import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import Api from 'context/api'
import Utility from 'components/lib/utility'
import NoResult from 'components/ui/new_noResult'

let timer
let totalPage = 1
export default () => {
  const {roomNo} = useParams()
  const [storyList, setStoryList] = useState([])

  const [currentPage, setCurrentPage] = useState(1)
  const [totalCnt, setTotalCnt] = useState(0)

  const fetchStory = async () => {
    const {result, data} = await Api.getStory({roomNo, page: currentPage, records: 10})
    if (result === 'success') {
      const {list, paging} = data
      if (currentPage > 1) {
        setStoryList(storyList.concat(list))
      } else {
        setStoryList(list)
      }

      if (paging) {
        totalPage = paging.totalPage
        setTotalCnt(paging.total)
      }
    }
  }

  useEffect(() => {
    fetchStory()
  }, [currentPage])

  useEffect(() => {
    let fetching = false
    const scrollEvtHdr = () => {
      if (timer) window.clearTimeout(timer)
      timer = window.setTimeout(function () {
        //스크롤
        const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
        const body = document.body
        const html = document.documentElement
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
        const windowBottom = windowHeight + window.pageYOffset
        const diff = 400
        if (totalPage > currentPage && windowBottom >= docHeight - diff) {
          if (!fetching) {
            setCurrentPage(currentPage + 1)
          }
        }
      }, 50)
    }

    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
      fetching = true
    }
  }, [currentPage])

  return (
    <div className="detail-wrap">
      <div className="main-txt">
        <span className="label">사연</span>
        <span className="number">{totalCnt}</span>
      </div>

      {storyList && storyList.length > 0 ? (
        storyList.map((story, idx) => {
          const {storyIdx, nickNm, profImg, contents, writeDt} = story

          return (
            <div key={`story-${idx}`} className="story-wrap">
              <div className="user-info">
                <div className="photo-name-wrap">
                  <div className="photo">
                    <img src={profImg['thumb336x336']} alt={storyIdx} />
                  </div>
                  <div className="name-date">
                    <div className="name">{nickNm}</div>
                    <div className="date">{Utility.timeFormat(writeDt)}</div>
                  </div>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => {
                    Api.deleteStory({roomNo, storyIdx}).then((res) => {
                      const {result} = res
                      if (result === 'success') {
                        const filtered = storyList.filter((story) => story.storyIdx !== storyIdx)
                        setStoryList(filtered)
                      }
                    })
                  }}>
                  삭제
                </button>
              </div>
              <div className="story-content">{contents}</div>
            </div>
          )
        })
      ) : (
        <NoResult type="default" text="사연이 없습니다" />
      )}
    </div>
  )
}
