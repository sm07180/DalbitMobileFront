import React from 'react'

const ClipRankList = (props) => {
  const {data} = props

  return (
    <>
      {data.map((list, index) => {
        return (
          <div key={index} className="listRow">
            <div className="photo">
              <img src={list.profImg.thumb100x100} alt="유저이미지" />
              <span className="play"></span>
            </div>
            <div className="rank">{list.rank}</div>
              <div className="listContent">
                <div className="type">{list.type}</div>
                <div className="title">{list.title}</div>
                <div className="nick">{list.nickNm}</div>
              </div>
          </div>
        )
      })}
    </>
  )
}

export default ClipRankList