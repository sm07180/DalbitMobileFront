import React from 'react'

const ClipRankList = (props) => {
  const {data, playAction} = props

  return (
    <>
      {data.map((list, index) => {
        return (
          <div key={index} className="listRow" data-clip-no={list.clipNo} onClick={playAction}>
            <div className="photo">
              <img src={list.bgImg.thumb100x100} alt="유저이미지" />
              <span className="play"/>
            </div>
            <div className="rank">{list.rank}</div>
              <div className="listContent">
                <div className="type">{list.subjectName}</div>
                <div className="title">{list.title}</div>
                <div className="nick">{list.nickName}</div>
              </div>
          </div>
        )
      })}
    </>
  )
}

export default ClipRankList