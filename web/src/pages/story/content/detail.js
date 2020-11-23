import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import Api from 'context/api'

export default () => {
  const {roomNo} = useParams()
  const [storyList, setStoryList] = useState([])

  const fetchStory = async () => {
    const {result, data} = await Api.getStory({roomNo})
    if (result === 'success') {
      const {list} = data
      setStoryList(list)
    }
  }

  useEffect(() => {
    fetchStory()
  }, [])

  return (
    <div className="detail-wrap">
      <div className="main-txt">
        <span className="label">사연</span>
        <span className="number">{storyList.length > 0 ? storyList.length : '0'}</span>
      </div>

      {storyList.map((story, idx) => {
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
                  <div className="date">{writeDt}</div>
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
      })}
    </div>
  )
}
