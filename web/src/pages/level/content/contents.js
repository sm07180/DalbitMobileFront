import React from 'react'
import styled from 'styled-components'
// context
import {COLOR_GREYISHBROWN, COLOR_GRAY, COLOR_WHITE} from 'context/color'
import {IMG_SERVER} from 'context/config'
//ui
import LevelListComponent from './levelListComponent'

const InfoList = [
  {val: 'DJ와 청취자는 달라의 다양한 컨텐츠를 이용하면서 Exp (경험치)를 획득할 수 있습니다.'},
  {val: '레벨 업을 통하여 칭호, 프로필 프레임 효과, 보상혜택을 경험해 보세요.'},
  {val: '프로필 프레임 효과는 각 레벨마다 다르게 표현됩니다.'}
]

export default props => {
  return (
    <ContentBox>
      <div className="info-box">
        <Title className="tit-ico">레벨 별 혜택</Title>
        <ul className="info-list">
          {InfoList.map((data, index) => {
            return (
              <li key={index}>
                <span className="num">{index + 1}</span>
                <span className="txt">{data.val}</span>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="info-box">
        <Title>프로필 효과 및 칭호</Title>
        <LevelListComponent></LevelListComponent>
      </div>
    </ContentBox>
  )
}

const ContentBox = styled.div`
  background: #eee;
  margin-top: 12px;
  .info-box {
    margin-top: 12px;
    padding: 23px 0;
    background: ${COLOR_WHITE};
    &:first-child {
      margin-top: 0;
    }
    .info-list {
      padding: 0 16px;
      li {
        position: relative;
        display: flex;
        margin-top: 8px;
        font-size: 14px;
        color: ${COLOR_GREYISHBROWN};
        line-height: 20px;
        &:first-child {
          margin-top: 0;
        }
      }
      .num {
        display: block;
        width: 16px;
        height: 16px;
        margin: 2px 6px 0 0;
        text-align: center;
        font-size: 9px;
        line-height: 16px;
        color: ${COLOR_WHITE};
        background: ${COLOR_GRAY};
        border-radius: 100%;
      }
      .txt {
        display: block;
        width: calc(100% - 22px);
      }
    }
  }
  @media (max-width: 1240px) {
    width: 100%;
  }
`
const Title = styled.h3`
  margin-bottom: 5px;
  padding: 0 16px;
  font-size: 16px;
  font-weight: 600;
  &.tit-ico {
    &::before {
      display: inline-block;
      content: '';
      position: relative;
      top: -1px;
      width: 24px;
      height: 24px;
      margin-right: 6px;
      background: url('${IMG_SERVER}/images/api/ic_trophy.svg') no-repeat 0 0;
      vertical-align: top;
    }
  }
`
