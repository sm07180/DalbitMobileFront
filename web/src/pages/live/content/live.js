import React, {useState, useContext, useEffect} from 'react'
import styled from 'styled-components'
import {Context} from 'context'
import {WIDTH_MOBILE, WIDTH_TABLET} from 'context/config'
import LiveList from './live-list'
export default props => {
  //----------------------------------------------------------- declare start
  const [sort1, setSort1] = useState('랭킹')
  const [sort2, setSort2] = useState('방송주제')
  const [open1, setOpen1] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [open3, setOpen3] = useState(false)
  const context = useContext(Context)
  const [list, setList] = useState([{cd: '', cdNm: '전체'}])
  //----------------------------------------------------------- func start

  // dropDown button
  const drop1 = () => {
    setOpen1(!open1)
    setOpen2(false)
    setOpen3(false)
  }

  // dropDown button
  const drop2 = () => {
    setOpen1(false)
    setOpen2(!open2)
    setOpen3(false)
  }

  // dropDown 선택 시 데이터 가져와야함
  const searchLive = (index, data) => {
    if (index === 1) setSort1(data.cdNm)

    if (index === 2) {
      setSort2(data.cdNm)
      const params = {
        roomType: data.cd,
        page: 1,
        records: 10
      }
      props.setType(data.cd)
      props.getBroadList({params}) // 조회 function call
    }

    setOpen1(false)
    setOpen2(false)
    setOpen3(false)
  }

  useEffect(() => {
    if (context.common !== undefined) {
      setList(list.concat(context.common.roomType))
    }
  }, [context])

  //----------------------------------------------------------- components start
  console.log('## list :', list)
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
                <Icon onClick={() => drop1()}></Icon> {/*이미지 아직 업로드 전이라 다른 이미지로 대체*/}
                {open1 && (
                  <DropDown>
                    <li onClick={() => searchLive(1, '랭킹')}>랭킹</li>
                    <li onClick={() => searchLive(1, '추천')}>추천</li>
                    <li onClick={() => searchLive(1, '인기')}>인기</li>
                    <li onClick={() => searchLive(1, '신입')}>신입</li>
                  </DropDown>
                )}
              </div>
              <div className="dropDown">
                <span>{sort2}</span>
                <Icon onClick={() => drop2()}></Icon> {/*이미지 아직 업로드 전이라 다른 이미지로 대체*/}
                {open2 && (
                  <DropDown>
                    {list.map((data, index) => {
                      return (
                        <li onClick={() => searchLive(2, data)} key={index}>
                          {data.cdNm}
                        </li>
                      )
                    })}
                  </DropDown>
                )}
              </div>
            </Sort>
          </div>
        </div>
      </TopArea>
      {props.broadList.length > 0 && props.broadList && <LiveList broadList={props.broadList} joinRoom={props.joinRoom} paging={props.paging} />}
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
  }
`

const TopArea = styled.div`
  display: flex;
  width: 100%;
  height: 120px;
  align-items: flex-end;

  .sort {
    display: flex;
    width: 100%;
    height: 80px;
    @media (max-width: ${WIDTH_MOBILE}) {
      height: 100px;
    }

    .inside {
      display: flex;
      width: 100%;
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
  width: 275px;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  position: relative;

  @media (max-width: ${WIDTH_MOBILE}) {
    width: 100%;
    height: 80%;
    /* border-bottom-color: #8556f6;
    border-bottom-width: 1px;
    border-bottom-style: solid; */
  }

  .dropDown {
    display: flex;
    width: 136px;
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
    position: relative;
    & > span {
      padding-left: 10px;
    }
    @media (max-width: ${WIDTH_MOBILE}) {
      width: 48%;
    }
  }

  .sideDropDown {
    position: absolute;
    right: -150px;

    @media (max-width: ${WIDTH_MOBILE}) {
      display: none;
    }
  }
`
const DropDown = styled.ul`
  display: flex;
  flex-direction: column;
  width: 136px;
  /* height: 116px; */
  position: absolute;
  top: 38px;
  z-index: 11;
  background: #fff;
  border-style: solid;
  border-color: #8556f6;
  border-width: 1px;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 400;
  line-height: 2.13;
  letter-spacing: -0.4px;
  color: #878787;

  @media (max-width: ${WIDTH_MOBILE}) {
    width: 100%;
  }

  & > li {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    :hover {
      background-color: #f8f8f8;
      color: #8556f6;
    }
  }
`
const Icon = styled.button`
  display: flex;
  width: 36px;
  height: 36px;
  background: url('https://devimage.dalbitcast.com/images/api/ic_arrow_down.png');
`
