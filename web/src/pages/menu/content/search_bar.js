/**
 * @title 검색바
 */
import React, {useState} from 'react'
import styled from 'styled-components'
//hooks
import useChange from 'components/hooks/useChange'
//static
import SearchIco from '../static/search/ic_search_p.svg'
//
export default (props) => {
  //---------------------------------------------------------------------
  //hooks
  const {changes, setChanges, onChange} = useChange(update, {onChange: -1})
  const [filter, setFilter] = useState('')
  //update
  function update(mode) {
    switch (true) {
      case mode.onChange !== undefined:
        break
    }
  }
  //handleKeyPress
  const handleKeyPress = (e) => {
    const {currentTarget} = e
    if (currentTarget.value.length < 2) {
      return
    }
    if (e.key === 'Enter') {
      props.update({search: changes})
    }
  }
  //submit
  const handleSubmit = (e) => {
    e.preventDefault()
    props.update({search: changes})
  }
  //---------------------------------------------------------------------
  return (
    <Content>
      <div className="in_wrap">
        <form onSubmit={handleSubmit}>
          <input type="text" name="query" placeholder="검색어를 입력해 보세요." onKeyPress={handleKeyPress} onChange={onChange} />
          <button type="submit">
            <img className="ico" src={SearchIco} />
          </button>
        </form>
      </div>
    </Content>
  )
}
//---------------------------------------------------------------------
const Content = styled.div`
  display: block;
  margin-top: 20px;
  margin-bottom: 36px;
  padding: 10px 16px 11px;
  border-radius: 28px;
  border: solid 2px #632beb;
  .in_wrap {
    position: relative;
    input {
      display: block;
      width: 100%;
      color: #424242;
      font-size: 14px;
      line-height: 1.71;
      letter-spacing: -0.35px;
      text-align: left;
      /* &:focus + button .ico {
        right: -10px;
        transform: rotate(60deg);
      } */
    }
    button {
      position: absolute;
      top: -8px;
      right: -12px;
      .ico {
        transition: 0.3s;
      }
    }
  }
`
