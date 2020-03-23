import React, {useState, useContext, useEffect, forwardRef} from 'react'
import styled from 'styled-components'
import {IMG_SERVER} from 'context/config'
import {Context} from 'context'
import {WIDTH_MOBILE, WIDTH_TABLET} from 'context/config'
import LiveList from './live-list'
export default props => {
  //----------------------------------------------------------- declare start
  const [sort1, setSort1] = useState('0')
  const [drop, setDrop] = useState('전체')
  const [sort2, setSort2] = useState('방송주제')
  const [open1, setOpen1] = useState(false)
  const [open2, setOpen2] = useState(false)
  const context = useContext(Context)
  const [list, setList] = useState([{cd: '', cdNm: '전체'}])
  const [searchType, setSearchType] = useState([
    {index: 0, type: '전체'},
    {index: 1, type: '추천'},
    {index: 2, type: '인기'},
    {index: 3, type: '신입'}
  ])
  //----------------------------------------------------------- func start

  // dropDown button
  const drop1 = () => {
    setOpen1(!open1)
    setOpen2(false)
  }

  // dropDown button
  const drop2 = () => {
    setOpen1(false)
    setOpen2(!open2)
  }

  // dropDown 선택 시 데이터 가져와야함
  const searchLive = (index, data) => {
    if (index === 1) {
      setSort1(data)
      setDrop(data.type)
      props.setSearchType(String(data.index))
    }

    if (index === 2) {
      setSort2(data.cdNm)
      props.setType(String(data.cd))
    }

    setOpen1(false)
    setOpen2(false)
  }

  useEffect(() => {
    if (context.common !== undefined) {
      setList(list.concat(context.common.roomType))
    }
  }, [context])

  //----------------------------------------------------------- components start
  return (
    <Container>
      <TopArea>
        <div className="sort">
          <div className="inside">
            <span>
              <span>실시간 LIVE</span>
            </span>
            <Sort>
              <div className="dropDown">
                <span>{drop}</span>
                <Icon onClick={() => drop1()}></Icon>
                {open1 && (
                  <DropDown>
                    {searchType.map((data, index) => {
                      return (
                        <li onClick={() => searchLive(1, data)} key={index}>
                          {data.type}
                        </li>
                      )
                    })}
                  </DropDown>
                )}
              </div>
              <div className="dropDown">
                <span>{sort2}</span>
                <Icon onClick={() => drop2()}></Icon>
                {open2 && (
                  <DropDown>
                    {list.map((data, index) => {
                      if (index > 14) return
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
      <LiveList broadList={props.broadList} joinRoom={props.joinRoom} paging={props.paging} />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  width: 100%;
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
      transform: skew(-0.03deg);
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
    transform: skew(-0.03deg);
    z-index: 1;
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
  left: -1px;
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
  transform: skew(-0.03deg);
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
  background: url(${IMG_SERVER}/images/api/ic_arrow_down.png);
`
