import React, {useState} from 'react'
import styled from 'styled-components'
import {WIDTH_MOBILE, WIDTH_TABLET} from 'context/config'

export default props => {
  //----------------------------------------------------------- declare start
  const [sort1, setSort1] = useState('랭킹')
  const [sort2, setSort2] = useState('방송주제')
  const [sort3, setSort3] = useState()
  //----------------------------------------------------------- func start
  //----------------------------------------------------------- components start
  return (
    <Container>
      <TopArea>
        <div className="sort">
          <div className="inside">
            <span>
              실시간<span>&nbsp;LIVE</span>
            </span>
            <Sort>
              <div className="dropDown">
                <span>{sort1}</span>
                <button></button> {/*이미지 아직 업로드 전이라 다른 이미지로 대체*/}
              </div>
              <div className="dropDown">
                <span>{sort2}</span>
                <button></button> {/*이미지 아직 업로드 전이라 다른 이미지로 대체*/}
              </div>
            </Sort>
          </div>
        </div>
      </TopArea>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 70%;
`

const TopArea = styled.div`
  display: flex;
  width: 100%;
  height: 180px;

  .sort {
    display: flex;
    width: 100%;
    height: 80px;
    @media (max-width: ${WIDTH_MOBILE}) {
      height: 100px;
    }

    .inside {
      display: flex;
      width: 85%;
      height: 100%;
      border-bottom-color: #8556f6;
      border-bottom-width: 1px;
      border-bottom-style: solid;
      align-items: center;
      justify-content: space-between;
      @media (max-width: ${WIDTH_MOBILE}) {
        flex-wrap: wrap;
        width: 100%;
      }
      @media (max-width: ${WIDTH_TABLET}) {
        flex-wrap: wrap;
        width: 100%;
      }
    }

    & > div > span {
      display: flex;
      width: 119px;
      height: 26px;
      font-size: 24px;
      font-weight: 600;
      letter-spacing: -0.6px;
      color: #8556f6;

      & > span {
        font-weight: 800;
      }
    }
  }
`
const Sort = styled.div`
  display: flex;
  width: 237px;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  background: yellow;
  @media (max-width: ${WIDTH_MOBILE}) {
    width: 100%;
    height: 80%;
    border-bottom-color: #8556f6;
    border-bottom-width: 1px;
    border-bottom-style: solid;
  }

  .dropDown {
    display: flex;
    width: 116px;
    height: 40px;
    border-style: solid;
    border-width: 1px;
    border-color: #8556f6;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.4px;
    color: #8556f6;
    align-items: center;
    justify-content: space-between;
    padding-left: 10px;
    @media (max-width: ${WIDTH_MOBILE}) {
      width: 48%;
    }

    & > button {
      display: flex;
      width: 36px;
      height: 36px;
      background: url('https://devimage.dalbitcast.com/images/api/ic_arrow_down.png');
    }
  }
`
