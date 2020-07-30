/**
 * @title 최근 본 달디
 */
import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import styled from 'styled-components'
//context
import API from 'context/api'
import Room, {RoomJoin} from 'context/room'
// component
import NoResult from 'components/ui/noResult'
import PlayIcon from '../static/s_live.svg'
//static
import FemaleIcon from '../static/s_female.svg'
import MaleIcon from '../static/s_male.svg'
import SpecialIcon from '../static/s_special.svg'
import FanIcon from '../static/s_fanC.svg'
import LikeIcon from '../static/s_like.svg'
import StarIcon from '../static/s_star.svg'
import AllIcon from '../static/s_all.svg'
import AllFanIcon from '../static/s_fan.svg'
import AllLimitIcon from '../static/s_limit.svg'
export default (props) => {
  let history = useHistory()

  //update
  function update(mode) {
    switch (true) {
      case mode.search !== undefined: //-------------------------------검색어
        const {query} = mode.search
        fetchData(query)
        break
      default:
        break
    }
  }

  //makeContents
  const makeContents = () => {
    if (props.fetch === null || props.fetch === undefined) return
    const list = props.fetch
    const type = props.type

    if (list == false || list == undefined) {
      return <NoResult className={`search`} />
    } else if (type === 'member') {
      return list.map((list, idx) => {
        const {nickNm, profImg, roomNo, memNo, isSpecial, gender, fanCnt} = list
        return (
          <div key={idx} className="list">
            <div
              className="btnWrap"
              onClick={() => {
                props.update({select: {...list, type: props.type}})
              }}>
              <img src={profImg.thumb150x150} onClick={() => history.push(`/mypage/${memNo}`)} />
              <div className="infoBox">
                {roomNo !== '' && <em></em>}
                <span className="infoBox__nick">{nickNm}</span>
                <div className="detail">
                  {gender === 'f' && <span className="female" />}
                  {gender === 'm' && <span className="male"></span>}
                  {isSpecial === true && <span className="special"></span>}
                </div>
                <p className="fanCnt">{fanCnt}</p>
              </div>
            </div>
          </div>
        )
      })
    } else if (type === 'live') {
      return list.map((list, idx) => {
        const {
          bjNickNm,
          bgImg,
          roomNo,
          bjGender,
          isSpecial,
          roomType,
          entryType,
          byeolCnt,
          entryCnt,
          isNew,
          isPop,
          isRecomm,
          likeCnt,
          title
        } = list
        return (
          <div key={idx} className="listLive">
            <div
              className="btnWrap"
              onClick={() => {
                props.update({select: {...list, type: props.type}})
              }}>
              <img src={bgImg.thumb88x88} onClick={() => RoomJoin(roomNo)} />
              <div className="infoBox">
                {/* {roomNo !== '' && <em></em>} */}
                <div className="detail">
                  {entryType === 0 && <span className="entry" />}
                  {entryType === 1 && <span className="entry-fan" />}
                  {entryType === 2 && <span className="entry-limit" />}
                  {roomType === '00' && <span className="cate">일상/소통</span>}
                  {roomType === '01' && <span className="cate">힐링</span>}
                  {roomType === '02' && <span className="cate">노래/연주</span>}
                  {roomType === '03' && <span className="cate">수다/챗</span>}
                  {roomType === '04' && <span className="cate">미팅/소개팅</span>}
                  {roomType === '05' && <span className="cate">고민/사연</span>}
                  {roomType === '06' && <span className="cate">책/여행</span>}
                  {roomType === '07' && <span className="cate">먹방/요리</span>}
                  {roomType === '08' && <span className="cate">건강/스포츠</span>}
                  {roomType === '09' && <span className="cate">ASMR</span>}
                  {roomType === '10' && <span className="cate"> 판매/영업</span>}
                  {bjGender === 'f' && <span className="female" />}
                  {bjGender === 'm' && <span className="male"></span>}
                  {isSpecial === true && <span className="special"></span>}
                </div>
                <span className="infoBox__roomTitle">{title}</span>
                <span className="infoBox__nick">{bjNickNm}</span>
                <div className="roomCnt">
                  <p className="fanCnt">{entryCnt}</p>
                  <p className="likeCnt">{likeCnt}</p>
                  <p className="starCnt">{byeolCnt}</p>
                </div>
              </div>
            </div>
          </div>
        )
      })
    }
  }
  //---------------------------------------------------------------------
  return <Content>{makeContents()}</Content>
}
//---------------------------------------------------------------------
const Content = styled.div`
  /* min-height: 196px; */
  text-align: left;
  padding: 0 16px 16px 16px;
  box-sizing: border-box;
  .search {
    margin-top: -10px;
  }
  & + h1 {
    margin-top: 15px;
  }

  .list {
    position: relative;
    display: inline-block;
    width: 100%;
    margin-bottom: 20px;
    box-sizing: border-box;
    em {
      display: block;
      width: 28px;
      height: 28px;
      position: absolute;
      right: 0;
      top: 0;
      background: url(${PlayIcon}) no-repeat center center / cover;
    }
    .btnWrap {
      width: 100%;
      display: flex;
      .infoBox {
        width: calc(100% - 60px);
        display: flex;
        flex-direction: column;
        padding-left: 8px;
        box-sizing: border-box;
        &__nick {
          margin-bottom: 4px;
          font-size: 14px;
          font-weight: 600;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.43;
          letter-spacing: normal;
          text-align: left;
          color: #000000;
        }
        .detail {
          display: flex;
          align-items: center;
        }
        .female {
          display: block;
          width: 24px;
          height: 16px;
          background: url(${FemaleIcon});
          margin-right: 2px;
        }
        .male {
          display: block;
          width: 24px;
          height: 16px;
          background: url(${MaleIcon});
          margin-right: 2px;
        }
        .special {
          display: block;
          width: 62px;
          height: 16px;
          background: url(${SpecialIcon});
          margin-right: 2px;
        }
        .fanCnt {
          display: flex;
          align-items: center;
          margin-top: 4px;
          font-size: 12px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          letter-spacing: -0.3px;
          text-align: left;
          color: #424242;

          :before {
            margin-right: 2px;
            display: inline-block;
            content: '';
            width: 16px;
            height: 16px;
            background: url(${FanIcon});
            vertical-align: middle;
          }
        }
      }
      img {
        width: 60px;
        height: 60px;
        border-radius: 50%;

        vertical-align: top;
      }
    }
  }

  .listLive {
    position: relative;
    display: inline-block;
    width: 100%;
    margin-bottom: 20px;
    box-sizing: border-box;
    em {
      display: block;
      width: 28px;
      height: 28px;
      position: absolute;
      right: 0;
      top: 0;
      background: url(${PlayIcon}) no-repeat center center / cover;
    }
    .btnWrap {
      width: 100%;
      display: flex;
      .infoBox {
        width: calc(100% - 60px);
        display: flex;
        flex-direction: column;
        padding-left: 16px;
        box-sizing: border-box;
        &__roomTitle {
          margin-bottom: 3px;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.14;
          text-align: left;
          color: #000000;
        }
        &__nick {
          margin-bottom: 3px;
          font-size: 12px;
          line-height: 1.08;
          letter-spacing: normal;
          text-align: left;
          color: #000000;
        }
        .detail {
          display: flex;
          align-items: center;
          margin-bottom: 5px;
        }
        .roomCnt {
          display: flex;
        }
        .entry {
          width: 24px;
          height: 16px;
          background: url(${AllIcon});
          margin-right: 2px;
        }
        .entry-fan {
          width: 24px;
          height: 16px;
          background: url(${AllFanIcon});
          margin-right: 2px;
        }
        .entry-limit {
          width: 24px;
          height: 16px;
          background: url(${AllLimitIcon});
          margin-right: 2px;
        }
        .cate {
          margin-right: 2px;

          padding: 0 6px;
          height: 16px;
          border-radius: 8px;
          background-color: #9e9e9e;
          font-size: 12px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 16px;
          letter-spacing: -0.3px;
          text-align: center;
          color: #fff;
        }
        .female {
          display: block;
          width: 24px;
          height: 16px;
          background: url(${FemaleIcon});
          margin-right: 2px;
        }
        .male {
          display: block;
          width: 24px;
          height: 16px;
          background: url(${MaleIcon});
          margin-right: 2px;
        }
        .special {
          display: block;
          width: 62px;
          height: 16px;
          background: url(${SpecialIcon});
          margin-right: 2px;
        }
        .fanCnt,
        .likeCnt,
        .starCnt {
          display: flex;
          align-items: center;
          margin-top: 4px;
          margin-right: 5px;
          font-size: 12px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          letter-spacing: -0.3px;
          text-align: left;
          color: #424242;
          :before {
            margin-right: 2px;
            display: inline-block;
            content: '';
            width: 16px;
            height: 16px;
            background: url(${FanIcon});
            vertical-align: middle;
          }
        }
        .likeCnt {
          :before {
            background: url(${LikeIcon});
          }
        }
        .starCnt {
          :before {
            background: url(${StarIcon});
          }
        }
      }
      img {
        width: 72px;
        height: 72px;
        border-radius: 12px;

        vertical-align: top;
      }
    }
  }
`
