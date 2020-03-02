import React, {useState, useContext, useEffect} from 'react'
import styled from 'styled-components'
import {Context} from 'context'
import API from 'context/api'
export default props => {
  const {onClick} = props
  let {setValue} = props
  const context = useContext(Context)
  const [broadList, setBroadList] = useState(null)
  const [list, setPosts] = useState([])
  const [filter, setFilter] = useState('')
  const [show, setShow] = useState(false)

  async function fetchData() {
    const res = await API.live_search({
      params: {
        search: setFilter,
        page: 1,
        records: 10
      }
    })
    if (res.result === 'success') {
      setBroadList(res.params)
    }

    console.log(res.params.list)
    setPosts(res.params.list)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const ShowFilter = list.map((item, index) => {
    // if (filter.length !== 0) {
    //   if (item.title.toLocaleLowerCase().includes(filter.toLocaleLowerCase())) {
    //     setValue(true)
    //     return <li key={index}>{item.title}</li>
    //   } else {
    //     console.log('결과없음')
    //     setValue(false)
    //     return null
    //   }
    // }
    //setValue(false)
  })
  const ShowClick = () => {
    setShow(true)
  }

  return (
    <Wrap>
      <SearchBar>
        <input value={filter} onChange={e => (setFilter(e.target.value), setShow(false))} />
        <Icon
          onClick={() => {
            ShowClick()
            onClick()
          }}></Icon>
      </SearchBar>
      <ul>
        <div className="div">{show === true && ShowFilter}</div>
      </ul>
    </Wrap>
  )
}
const Wrap = styled.div``
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
