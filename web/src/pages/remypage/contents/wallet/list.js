import React, {useContext} from 'react'
import styled from 'styled-components'

// context

export default (props) => {

  return (
    <div className='listWrap'>
      <section className="optionWrap">
        <div className="option">
          <div className="selectBox">
            <button>
              전체
              <span className="arrowDownIcon" />
            </button>
          </div>
          <span className="sub">최근 6개월 이내</span>
        </div>
      </section>
      <section className="listBox">
        <div className="list">
          <div className="content">
            <div className="item">굿스타트 이벤트 2위</div>
            <div className="item date">22.01.03</div>
          </div>
          <div className="quantity">+7,000</div>
        </div>
        <div className="list">
          <div className="content">
            <div className="item">
              환전신청
              <button className="exchangeCancelBtn">
                취소하기
              </button>
            </div>
            <div className="item date">22.01.03</div>
          </div>
          <div className="quantity minous">-7,000</div>
        </div>
        <div className="list">
          <div className="content">
            <div className="item">
              선물 "소라게" <span className="divider"></span> 계란노른자
              <span className="privateBdg">
                몰래
              </span>
            </div>
            <div className="item date">22.01.03</div>
          </div>
          <div className="quantity minous">-7,000</div>
        </div>
      </section>
    </div>
  )
}

const ListContainer = styled.div`
  
`