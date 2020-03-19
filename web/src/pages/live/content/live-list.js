import React, {useState, useContext, useRef, useEffect} from 'react'
import styled from 'styled-components'
import {WIDTH_MOBILE, WIDTH_TABLET} from 'context/config'
import {Context} from 'context'
import {IMG_SERVER} from 'context/config'
import {Scrollbars} from 'react-custom-scrollbars'
import Utility from 'components/lib/utility'

export default props => {
  //------------------------------------------------------------ declare start
  const [hover, setHover] = useState(false)
  const [seleted, setSelected] = useState()
  const context = useContext(Context)
  const scrollbars = useRef(null)
  const [roomType, setRoomType] = useState(context.common.roomType)

  //------------------------------------------------------------ func start
  const handleHover = (flag, index) => {
    setSelected(index)
    setHover(flag)
  }

  //------------------------------------------------------------ components start
  return (
    <Container>
      {props.broadList.map((data, index) => {
        return (
          <List key={index} onMouseEnter={() => handleHover(true, index)} onMouseLeave={() => handleHover(false, index)} onClick={() => props.joinRoom(data)}>
            <div className="profile">
              <div className="rank">{props.paging !== undefined && props.paging.page > 1 ? (props.paging.page - 1) * props.paging.records + (index + 1) : index + 1}</div>
              <div>
                {index == seleted && hover && (
                  <div className="hoverWrap">
                    <button></button>
                  </div>
                )}
                <div className="profileImg">
                  <BgImg url={data.bjProfImg.thumb120x120}>{data.gstProfImg.thumb62x62 != '' && data.gstProfImg.thumb62x62 != null && <Img url={data.gstProfImg.thumb62x62}></Img>}</BgImg>
                </div>
              </div>
            </div>
            <MobileWrap>
              <div className="content">
                <div className="title">
                  {/* {context.common.roomType !== undefined && roomType[roomType.map(x => x.cd).indexOf(data.roomType)].cdNm} */}
                  {data.isRecomm && <Tag bgColor={'#8555f6'}>추천</Tag>}
                  {data.isPop && <Tag bgColor={'#ec455f'}>인기</Tag>}
                  {data.isNew && <Tag bgColor={'#fdad2b'}>신입</Tag>}
                </div>
                <div className="roomTitle">{data.title}</div>
                <div className="nickName">{data.bjNickNm}</div>
              </div>
              <CountArea>
                <div>
                  <Icon>
                    <img src={'https://image.dalbitcast.com/images/api/ic_headphone_s.png'} width={24} height={24} />
                    &nbsp;&nbsp;{data.entryCnt}
                  </Icon>
                  <span>|</span>
                  <Icon>
                    <img src={'https://image.dalbitcast.com/images/api/ic_hearts_s.png'} width={24} height={24} />
                    &nbsp;&nbsp;{data.likeCnt}
                  </Icon>
                </div>
              </CountArea>
            </MobileWrap>
          </List>
        )
      })}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  width: 100%;
  /* height: 100%; */
  flex-direction: column;

  @media (max-width: ${WIDTH_MOBILE}) {
    width: 100%;
    /* height: 100%; */
  }
`
const List = styled.div`
  display: flex;
  width: 100%;
  height: 120px;
  align-items: center;
  border-bottom-style: solid;
  border-color: #e0e0e0;
  border-width: 1px;

  @media (max-width: ${WIDTH_MOBILE}) {
    height: 140px;
  }

  :hover {
    background-color: #f8f8f8;
  }

  .profile {
    display: flex;
    width: 164px;
    height: 100%;
    align-items: center;

    .hoverWrap {
      cursor: pointer;
      display: flex;
      width: 96px;
      height: 96px;
      background-color: rgba(133, 86, 246, 0.5);
      position: absolute;
      justify-content: center;
      align-items: center;
      z-index: 99;
      border-radius: 10px;
      border-width: 3px;
      border-style: solid;
      border-color: #8556f6;
      @media (max-width: ${WIDTH_MOBILE}) {
        display: none;
      }

      & > button {
        display: flex;
        width: 24px;
        height: 24px;
        background: url(${IMG_SERVER}/images/api/ic_play_color_24.png) no-repeat;
        z-index: 100;
      }
    }

    .rank {
      display: flex;
      width: 68px;
      height: 100%;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 600;
      line-height: 1.5;
      letter-spacing: -0.4px;
      color: #9e9e9e;
      position: relative;
      @media (max-width: ${WIDTH_MOBILE}) {
        display: none;
      }
    }
    .profileImg {
      display: flex;
      width: 96px;
      height: 96px;
      align-items: center;
      position: relative;
      z-index: 1;
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    width: 80%;
    height: 100%;
    justify-content: space-between;
    padding: 22px 18px 22px 18px;
    @media (max-width: ${WIDTH_MOBILE}) {
      padding: 15px 0px 0px 0px;
      height: 68%;
      justify-content: space-between;
    }

    .title {
      display: flex;
      width: 100%;
      height: 15px;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.43;
      letter-spacing: -0.35px;
      color: #bdbdbd;
      @media (max-width: ${WIDTH_MOBILE}) {
        height: 30px;
        margin-bottom: 5px;
      }
    }

    .rootTitle {
      display: flex;
      width: 100%;
      height: 20px;
      font-size: 16px;
      font-weight: 400;
      line-height: 1.5;
      letter-spacing: -0.4px;
      align-items: center;
      @media (max-width: ${WIDTH_MOBILE}) {
        height: 30px;
        line-height: 0;
      }
    }

    .nickName {
      display: flex;
      width: 100%;
      height: 20px;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.43;
      letter-spacing: -0.35px;
      color: #8556f6;
      align-items: center;
      @media (max-width: ${WIDTH_MOBILE}) {
        height: 40px;
        margin-top: 3px;
      }
    }
  }

  .cntArea {
    display: flex;
    width: 20%;
    height: 100%;
  }
`
const CountArea = styled.div`
  display: flex;
  width: 30%;
  /* height: 100%; */
  padding-bottom: 22px;
  justify-content: flex-end;
  align-items: flex-end;
  padding-right: 20px;

  @media (max-width: ${WIDTH_MOBILE}) {
    width: 80%;
    height: 28px;
    justify-content: flex-start;
    align-items: center;
    padding: 0px 0px 0px 0px;
  }

  & > div {
    display: flex;
    align-items: center;
  }

  & > div > span {
    display: flex;
    width: 15px;
    color: #e0e0e0;
    font-size: 12px;
    margin-right: 3px;
    justify-content: center;
  }
`
const Icon = styled.div`
  display: flex;
  align-items: center;
  width: 80px;
  height: 24px;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: -0.35px;
  color: #9e9e9e;
`
const MobileWrap = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  @media (max-width: ${WIDTH_MOBILE}) {
    flex-direction: column;
    margin-left: 10px;
  }

  .roomTitle {
    @media (max-width: ${WIDTH_MOBILE}) {
      padding-top: 0px;
      width: 100%;
      height: 70px;
      overflow: hidden;
      font-size: 15px;
    }
  }
`
const Tag = styled.div`
  height: 16px;
  background: ${props => (props.bgColor ? props.bgColor : '')};
  font-size: 10px;
  font-weight: 400;
  color: #fff;
  border-radius: 8px;
  padding: 1px 6px 0px 6px;
  justify-content: center;
  align-items: center;
  margin-left: 4px;
  margin-top: 1px;
`
const BgImg = styled.div`
  width: 96px;
  height: 96px;
  background: url(${props => (props.url ? props.url : '')}) no-repeat;
  border-radius: 10px;
  position: relative;
  @media (max-width: ${WIDTH_MOBILE}) {
    width: 108px;
    height: 108px;
  }
`

const Img = styled.div`
  width: 40px;
  height: 40px;
  background: url(${props => (props.url ? props.url : '')}) no-repeat;
  position: absolute;
  bottom: 0px;
  right: 0px;
  z-index: 999;
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
`
