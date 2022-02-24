import React from 'react'

const Voting =(props)=>{
  const {setTemp} = props;

  const listClick =()=>{
    setTemp('content');
  }

  return(
    <>
      <div className="voteList" onClick={listClick}>
        <div className="listInfo">
          <div className="listItem">
            <span className="voteOn">진행중</span>
            일이삼사오육칠팔구십일이삼사육칠팔구십일
          </div>
          <div className="listItem countBox">
            <div className="num">
              <span className="icon"></span>
              <p><span>4</span>명 참여</p>
            </div>
            <div className="due">
              <span>20:04</span> 마감예정
            </div>
          </div>
        </div>
        <div className="time">
          <span className="icon"/>
          60분
        </div>
      </div>
    </>
  )
}

export default Voting;