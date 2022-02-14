import React from 'react'

// global components
import LevelItems from '../../../components/ui/levelItems/LevelItems'

const MyInfo = (props) => {
  const {data} = props

  return (
    <>
      <div className="textWrap">
        <p className='text'><strong>{data?.nickNm}</strong>님<br/>
        오늘 즐거운 방송해볼까요?</p>
        <div className="info">
          <LevelItems data={data?.level} />
          <span className='userId'>{data?.memId}</span>
        </div>
        <div className="count">
          <i>팬</i>
          <span>{data?.fanCnt}</span>
          <i>스타</i>
          <span>{data?.starCnt}</span>
          <i>좋아요</i>
          <span>{data?.likeTotCnt}</span>
        </div>
      </div>
      <div className="photo">
        {data?.profImg && <img src={data.profImg.thumb150x150} alt="" />}
      </div>
    </>
  )
}

export default MyInfo
