import React from 'react'
import styled from 'styled-components'
//context
import {COLOR_WHITE, COLOR_GREYISHBROWN} from 'context/color'
//ui
import Swiper from 'react-id-swiper'

export default (props) => {
  const swiperParams = {
    slidesPerView: 'auto',
    spaceBetween: 10,
    pagination: false
  }
  return (
    <>
      {props.data.map((data, index) => {
        return (
          <LevelListItem key={index} className="level-item">
            <span
              className="level-item__tit"
              style={
                data.color.length > 1
                  ? {background: `linear-gradient(to right, ${data.color[0]}, ${data.color[1]} 53%, ${data.color[2]}`}
                  : {backgroundColor: `${data.color}`}
              }>
              {data.level}
            </span>
            <div className="detail-list">
              <Swiper {...swiperParams}>
                {data.levels.map((data2, index) => {
                  return (
                    <div className="detail-list__item" key={index}>
                      <div className="top">
                        <span className="num">{data2.level}</span>
                        <figure url={data2.frame}>
                          <img src={data2.frame} />
                        </figure>
                      </div>
                      <div className="bottom">
                        <span
                          className="grade"
                          style={
                            data.color.length > 1
                              ? {color: `${data.color[0]}`, borderColor: `${data.color[0]}`}
                              : {color: `${data.color}`, borderColor: `${data.color}`}
                          }>
                          {data2.grade}
                        </span>
                        <span className="reward">
                          보상: {data2.dal > `0` ? `달 ` + data2.dal : ``}
                          {data2.byeol > `0` ? `, 별 ` + data2.byeol : ``}
                          <br />
                          프로필 프레임
                        </span>
                      </div>
                    </div>
                  )
                })}
              </Swiper>
            </div>
          </LevelListItem>
        )
      })}
    </>
  )
}

const LevelListItem = styled.li`
  &.level-item {
    padding: 0 0 20px 16px;
    .level-item__tit {
      display: inline-block;
      padding: 5px 12px 4px;
      margin-bottom: 10px;
      border-radius: 13px;
      color: ${COLOR_WHITE};
      font-size: 14px;
      font-weight: 600;
      line-height: 1.2;
      text-align: center;
    }
    .detail-list {
      &__item {
        position: relative;
        display: inline-block;
        width: 120px;
        min-height: 194px;
        border: 1px solid #e0e0e0;
        border-radius: 12px;
        font-size: 12px;
        text-align: center;
        .top {
          position: relative;
          top: -1px;
          left: -1px;
          width: 120px;
          padding: 6px 6px 16px;
          background: #f0f0f0;
          border-radius: 12px 12px;
        }
        .bottom {
          position: relative;
          z-index: 1;
          margin-top: -14px;
        }
        .num {
          display: block;
          position: absolute;
          left: 6px;
          top: 6px;
          width: 18px;
          height: 18px;
          line-height: 1.84;
          background: #757575;
          color: ${COLOR_WHITE};
          font-size: 10px;
          font-weight: 600;
          border-radius: 100%;
        }
        figure {
          display: block;
          width: 108px;
          height: 108px;
          margin: 0 auto;
          img {
            width: 100%;
          }
        }
        .grade {
          display: inline-block;
          min-width: 36px;
          max-width: 120px;
          max-height: 25px;
          padding: 4px 6px 3px;
          border-radius: 13px;
          border-width: 1px;
          border-style: solid;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: -1px;
          background: ${COLOR_WHITE};
          box-sizing: border-box;
        }
        .reward {
          display: block;
          margin-top: 8px;
          line-height: 1.4;
          color: ${COLOR_GREYISHBROWN};
        }
      }
    }
  }
`
const figure = styled.figure`
  display: inline-block;
  width: 108px;
  height: 108px;
`
