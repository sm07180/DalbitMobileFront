import React, {useContext} from 'react'
import styled from 'styled-components'

// context
import ArrowDownIcon from '../../static/ic_arrow_down_gray.svg'

export default (props) => {
  const {setShowFilter} = props

  return (
    <ListContainer>
      <section className="optionWrap">
        <div className="option">
          <div className="selectBox"
            onClick={() => {
              setShowFilter(true)
            }}>
            <button>
              전체
              <img src={ArrowDownIcon} />
            </button>
          </div>
          <span className="sub">최근 6개월 이내</span>
        </div>
      </section>
      <section className="listWrap">
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
    </ListContainer>
  )
}

const ListContainer = styled.div`
  position: relative;
  margin-top: 19px;
  .option{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-top: 11px;
    padding:0 16px;
    height:28px;
    .selectBox{
      font-size:15px;
      font-weight:400;
      & > button {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: bold;
      }
    }
    span {
      font-size: 13px;
      font-weight: 400;
      color: #666;
    }
  }
  .listWrap{
    .list {
      display: flex;
      flex-direction: row;
      align-items: center;
      width:100%;
      height: 65px;
      text-align: center;
      border-bottom: 1px solid #f5f5f5;
      padding: 0 16px;
      .content {
        display:flex;
        flex-direction:column;
        align-items:flex-start;
        width: calc(100% - 100px);
        flex:none;
        font-size: 15px;
        font-weight: 500;
        .item{
          display:flex;
          align-items:center;
          &.date {
            font-size: 12px;
            color: #707070;
          }
          .divider{
            width:1px;
            height:14px;
            background:#000;
            margin:0 5px;
          }
          .exchangeCancelBtn {
            width:55px
            height: 22px;
            margin-left: 4px;
            border-radius: 11px;
            background-color: #FF3C7B;
            font-size: 12px;
            text-align: center;
            color: #fff;
          }
          .privateBdg{
            height:16px;
            line-height:16px;
            background:#999999;
            border-radius:20px;
            font-size:12px;
            color:#fff;
            text-align:center;
            margin-left:4px;
            padding:0 4px;
          }
        }
      }
      .quantity {
        font-size: 17px;
        color: #000000;
        margin-left:auto;
        &.minous{
          color:#999
          font-weight:400;
        }
      }
    }
  }
`