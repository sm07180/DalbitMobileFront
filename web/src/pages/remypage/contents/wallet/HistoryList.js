import React, {useContext} from 'react'

// context

export default (props) => {

  return (
    <section className='listWrap'>
      <div className="listRow">
        <div className="listContent">
          <div className="historyText">굿스타트 이벤트 2위</div>
          <div className="historyDate">22.01.03</div>
        </div>
        <div className="quantity">+7,000</div>
      </div>
      <div className="listRow">
        <div className="listContent">
          <div className="listItem">
            <div className="historyText">환전신청</div>
            <button className="exCancelBtn">취소하기</button>
          </div>
          <div className="historyDate">22.01.03</div>
        </div>
        <div className="quantity minous">-7,000</div>
      </div>
      <div className="listRow">
        <div className="listContent">
          <div className="listItem">
            <div>선물 "소라게" <span className="">계란노른자</span></div>
            <span className="privateBdg">몰래</span>
          </div>
          <div className="historyDate">22.01.03</div>
        </div>
        <div className="quantity minous">-7,000</div>
      </div>
    </section>
  )
}