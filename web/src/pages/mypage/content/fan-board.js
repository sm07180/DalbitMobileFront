/**
 * @file /mypage/content/fan-board.js
 * @brief 마이페이지 팬보드
 */

import React, {useEffect, useState} from 'react'
import styled from 'styled-components'

//layout
import {WIDTH_PC, WIDTH_TABLET} from 'context/config'

//material ui
import TextField from '@material-ui/core/TextField'

const TabFanBoard = ({value, onChange}) => {
  const [listItems, setListItem] = useState([
    {id: 0, name: '홍길동1', date: '2019-09-09', text: '팬입니다.'},
    {id: 1, name: '홍길동2', date: '2019-09-09', text: '팬입니다.'},
    {id: 2, name: '홍길동3', date: '2019-09-09', text: '멋져요'},
    {id: 3, name: '홍길동4', date: '2019-09-09', text: '방송언제하나요'}
  ])

  const [writeText, setWriteText] = useState('')

  function boardDelet(idx) {
    setListItem(listItems.filter((item, id) => id !== idx.idx))
  }

  function boardAdd(data) {
    setListItem([
      ...listItems,
      {
        name: '내이름',
        date: '2019-09-09',
        text: writeText
      }
    ])
  }

  const makeFanBoard = () => {
    return listItems.map((list, idx) => {
      return (
        <FanBoardList key={idx}>
          <p>{list.name}</p>
          <span>{list.date}</span>
          <p>{list.text}</p>
          <button
            onClick={() => {
              boardDelet({idx})
            }}>
            삭제
          </button>
        </FanBoardList>
      )
    })
  }

  const handlingSubmit = e => {
    e.preventDefault()
    boardAdd()
  }

  const handleChange = e => {
    setWriteText(e.target.value)
  }

  return (
    <FanBoard>
      <WriteArea onSubmit={handlingSubmit}>
        <Textarea value={value} onChange={handleChange}></Textarea>
        <Button type="submit">쓰기</Button>
      </WriteArea>
      <ListArea>{makeFanBoard()}</ListArea>
    </FanBoard>
  )
}

export default TabFanBoard

const FanBoard = styled.div``

const WriteArea = styled.form`
  display: flex;
  justify-content: space-between;
`

const Textarea = styled.textarea`
  width: 78%;
  height: 80px;
  margin-right: 2%;
  padding: 8px;
  border: 1px solid #e4e4e4;
  resize: none;
`

const Button = styled.button`
  width: 20%;
  height: 80px;
  background: #feac2c;
  color: #fff;
`

const ListArea = styled.div`
  margin: 30px 0;
`

const FanBoardList = styled.div`
  position: relative;
  padding: 10px;
  border-bottom: 1px solid #e4e4e4;

  * {
    color: #555;
    font-size: 14px;
  }

  button {
    position: absolute;
    top: 10px;
    right: 10px;
  }
`
