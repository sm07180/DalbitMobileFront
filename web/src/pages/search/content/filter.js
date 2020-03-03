import React, {useState, useContext, useEffect} from 'react'
import styled from 'styled-components'
import {Context} from 'context'
import API from 'context/api'
export default props => {
  let {setValue} = props
  const context = useContext(Context)
  const [list, setPosts] = useState([])
  const [filter, setFilter] = useState('')
  const [show, setShow] = useState(false)

  async function fetchData() {
    const res = await API.live_search({
      params: {
        search: filter,
        page: 1,
        records: 10
      }
    })
    if (res.result === 'success') {
      setPosts(res.data.list)
      //props.history.push('/user/')
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
        setValue(true)
        return (
          <ListWrap>
            <li key={index}>{item.title}</li>
          </ListWrap>
        )
      } else {
        return null
      }
    } else {
      setValue(false)
    }
  })

  const searchOnKeyDown = e => {
    const {currentTarget} = e
    if (currentTarget.value === '') {
      return
    }
    if (e.keyCode === 13) {
      fetchData()
    }
  }

  return (
    <Wrap>
      <SearchBar>
        <input value={filter} onKeyDown={searchOnKeyDown} onChange={e => (setFilter(e.target.value), setShow(false))} />
        <Icon
          onClick={() => {
            ShowClick()
          }}></Icon>
      </SearchBar>
      {props.children}
      <ul>{show === true && ShowFilter}</ul>
    </Wrap>
  )
}
const Wrap = styled.div`
  & .box {
    background-color: blue;
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
  background: url('https://devimage.dalbitcast.com/svg/ic_search_normal.svg');
`

const ListWrap = styled.ul`
  width: 100%;
  display: flex;
  & li {
    width: 14.7%;
  }
`
