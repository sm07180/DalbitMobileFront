import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'

import List from './content/list'
import Detail from './content/detail'
import './index.scss'

export default () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [storyList, setStoryList] = useState([])
  const history = useHistory()

  const {roomNo} = useParams()

  const fetchStoryList = async () => {
    const {result, data} = await Api.getStoryList({page: currentPage, records: 20})
    if (result === 'success') {
      setStoryList(data)
    }
  }

  useEffect(() => {
    fetchStoryList()
  }, [])
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
