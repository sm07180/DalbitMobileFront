import React, {useState, useEffect, useReducer} from 'react'
import {useParams} from 'react-router-dom'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'

import List from './content/list'
import Detail from './content/detail'
import './index.scss'

let timer

export default () => {
  const history = useHistory()
  const [currentPage, setCurrentPage] = useState(1)
  const [storyList, setStoryList] = useState([])
  const [totalPage, setTotalPage] = useState(1)

  const {roomNo} = useParams()

  const fetchStoryList = async () => {
    const {result, data} = await Api.getStoryList({page: currentPage, records: 20})
    if (result === 'success') {
      if (currentPage > 1) {
        setStoryList(storyList.concat(data.data))
      } else {
        setStoryList(data.data)
      }

      if (data.paging) {
        setTotalPage(data.paging.totalPage)
      } else {
        setTotalPage(1)
      }
    }
  }

  useEffect(() => {
    let fetching = false

    const scrollEvtHdr = (event) => {
      if (timer) window.clearTimeout(timer)
      timer = window.setTimeout(function () {
        //스크롤
        const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
        const body = document.body
        const html = document.documentElement
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
        const windowBottom = windowHeight + window.pageYOffset
        const diff = docHeight / 3
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
  }, [totalPage, currentPage])

  useEffect(() => {
    fetchStoryList()
  }, [currentPage])

  return (
    <div id="story-container">
      <header className="header">
        사연 모아보기
        <button className="back-btn" onClick={() => history.goBack()}></button>
      </header>
      {roomNo === undefined ? (
        <div className="content-wrap">
          <List storyList={storyList} />
        </div>
      ) : (
        <Detail />
      )}
    </div>
  )
}
