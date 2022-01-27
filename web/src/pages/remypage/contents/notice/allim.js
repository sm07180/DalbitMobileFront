import React, {useEffect, useState, useContext, useRef} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'

import Api from 'context/api'
// global components
import ListRow from 'components/ui/listRow/ListRow'
// components

const Allim = (props) => {
  const {data} = props

  // 페이지 시작
  return (
    <div className="allim">
      <ListRow photo={data.profImg.thumb88x88}>
        <div className="listContent">
          <div className="title">혹시!!!!! 오늘 출석체크 했니? 😃 아직이라면
          출석 check!!♟[가즈아~👉]</div>
          <div className="date">22.01.03</div>
        </div>
      </ListRow>
      <ListRow photo={data.profImg.thumb88x88}>
        <div className="listContent">
          <div className="title">어? 아직 출석달을 받아가지 않으셨네요?</div>
          <div className="date">22.01.03</div>
        </div>
      </ListRow>
      <ListRow photo={data.profImg.thumb88x88}>
        <div className="listContent">
          <div className="title">윤호❤리링(화이팅!⏳ 아들)님의 레벨업을
          축하해 주세요🤩</div>
          <div className="date">22.01.03</div>
        </div>
      </ListRow>
      <div className="allimNone">
        <p>새로운 소식이 없어요<br/>오늘의 소식이 생기면 알려드릴게요!</p>
        <button>푸시 설정하기</button>
      </div>
    </div>
  )
}

export default Allim
