import React, {useState, useContext, useEffect, useRef} from 'react'
import styled from 'styled-components'
import {Context} from 'context'
import API from 'context/api'
import {IMG_SERVER} from 'context/config'
export default props => {
  let {setValue} = props

  const context = useContext(Context)
  const [list, setPosts] = useState([])
  const [filter, setFilter] = useState('')
  const [show, setShow] = useState(false)
  const [query, setQuery] = useState('')
  const prevQueryRef = useRef('')
  useEffect(() => {
    const qs = location.href.split('?')[1] && decodeURIComponent(location.href.split('?')[1].split('=')[1])
    if (prevQueryRef.current !== qs) {
      setFilter(qs)
      prevQueryRef.current = qs
    }
    ShowClick()
    console.log('pq', prevQueryRef)
  }, [query])

  // useEffect(() => {
  //   return () => {
  //     const qs = location.href.split('?')[1] && decodeURIComponent(location.href.split('?')[1].split('=')[1])
  //     if (prevQueryRef.current !== qs) {
  //       setFilter(qs)
  //       prevQueryRef.current = qs
  //     }
  //     ShowClick()
  //     console.log('pq', prevQueryRef)
  //   }
  // }, [query])

  async function fetchData() {
    const qs = location.href.split('?')[1] && decodeURIComponent(location.href.split('?')[1].split('=')[1])
    const res = await API.live_search({
      params: {
        search: filter || qs,
        page: 1,
        records: 10
      }
    })
    if (res.result === 'success') {
      setPosts(res.data.list)
    }
    console.log(res)
  }

  const ShowClick = () => {
    setShow(true)
    fetchData()
  }

  const ShowFilter = list.map((item, index) => {
    if (filter.length > 1) {
      if (item.title.toLocaleLowerCase().includes(filter.toLocaleLowerCase())) {
        return (
          <ListWrap key={index}>
            <Img className="imgwrap" bg={item.profImg.url}>
              <Thumb thumb={item.profImg.thumb62x62} />
            </Img>
            <em>{item.title}</em>
            <h2>{item.title}</h2>
            <h3>{item.nickNm}</h3>
            <InfoWrap>
              <div>
                <span className="listen"></span>
                <strong>{item.entryCnt}</strong>
              </div>
              <div>
                <span className="like"></span>
                <strong>{item.likeCnt}</strong>
              </div>
            </InfoWrap>
          </ListWrap>
        )
      } else {
        return null
      }
    } else {
    }
  })

  const searchOnKeyDown = e => {
    const {currentTarget} = e
    if (currentTarget.value === '') {
      return
    }
    if (e.keyCode === 13) {
      setShow(true)
      fetchData()
    }
  }

  return (
    <Wrap>
      {show === true && (
        <div className="liveList">
          <div className="livetitle">
            <p>
              라이브 <em>{list.length}건</em>
            </p>
            <p>
              결과 더보기<em></em>
            </p>
          </div>
          <div className="flexWrap">{ShowFilter}</div>
        </div>
      )}
    </Wrap>
  )
}

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 325px;
  background: yellow;
`
const Wrap = styled.div`
  & .liveList {
    width: 100%;
    margin-top: 58px;
    & .livetitle {
      width: 100%;
      &:after {
        content: '';
        clear: both;
        display: block;
      }
    }
    & .flexWrap {
      display: flex;
    }
    & p:first-child {
      float: left;
      color: #8556f6;
      font-size: 20px;
      font-weight: 600;
      letter-spacing: -0.5px;
      em {
        margin-left: 10px;
        color: #757575;
        font-style: normal;
        font-weight: normal;
      }
    }
    & p:last-child {
      float: right;
      color: #757575;
      font-size: 14px;
      line-height: 36px;
      letter-spacing: -0.35px;
      &:after {
        content: '';
        clear: both;
        display: block;
      }
      & em {
        float: right;
        width: 36px;
        height: 36px;
        margin-left: 10px;
        background: url(${IMG_SERVER}/images/api/ico_plus_p.png);
      }
    }
  }
`
const SearchBar = styled.div`
  display: flex;
  width: 100%;
  height: 68px;
  border-style: solid;
  border-color: #8556f6;
  border-width: 3px;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  padding-right: 10px;
  & input {
    width: 95%;
    height: 100%;
    font-size: 24px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: -0.6px;
    text-align: left;
    color: #8556f6;
    outline: none;
  }
`
const Icon = styled.button`
  display: flex;
  width: 48px;
  height: 48px;
  background: url('${IMG_SERVER}/svg/ic_search_normal.svg');
`

const ListWrap = styled.div`
  width: 148px;
  margin-right: 29px;
  margin-bottom: 37px;
  & em {
    display: block;
    margin-top: 19px;
    color: #bdbdbd;
    font-style: normal;
    font-size: 14px;
    letter-spacing: -0.35px;
  }
  & h2 {
    margin-top: 18px;
    color: #424242;
    font-size: 16px;
    font-weight: normal;
    letter-spacing: -0.4px;
  }
  & h3 {
    margin-top: 12px;
    color: #8556f6;
    font-size: 14px;
    letter-spacing: -0.35px;
  }
`
const Img = styled.div`
  position: relative;
  width: 100%;
  height: 148px;
  background: url(${props => props.bg}) no-repeat center center / cover;
`
const Thumb = styled.div`
  position: absolute;
  width: 64px;
  height: 64px;
  bottom: -32px;
  right: 0;
  border-radius: 50%;
  background: url(${props => props.thumb}) no-repeat center center / cover;
`
const InfoWrap = styled.div`
  display: flex;
  margin-top: 35px;
  & div {
    width: 50%;
    &:after {
      content: '';
      display: block;
      clear: both;
    }
    & span {
      float: left;
      width: 24px;
      height: 24px;
      margin-right: 6px;
      background: url(${IMG_SERVER}/images/api/ic_headphone_s.png) no-repeat center center / cover;
    }
    & strong {
      float: left;
      color: #bdbdbd;
      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      line-height: 24px;
      letter-spacing: -0.35px;
    }
    & .like {
      background: url(${IMG_SERVER}/images/api/ico-like-g-s.png) no-repeat center center / cover;
    }
  }
`
