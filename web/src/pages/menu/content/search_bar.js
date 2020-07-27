/**
 * @title 검색바
 */
import React, {useState} from 'react'
import styled from 'styled-components'
//hooks
import useChange from 'components/hooks/useChange'
//static
import SearchIco from '../static/search/ic_search.svg'
//
export default (props) => {
  //---------------------------------------------------------------------
  //hooks
  const {changes, setChanges, onChange} = useChange(update, {onChange: -1})
  const [typing, setTyping] = useState('')
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
    setTyping(changes.query)
  }
  //---------------------------------------------------------------------
  return (
    <Content className={typing.length > 0 ? 'in_wrap focusing' : 'in_wrap'}>
      <div className={typing.length > 0 ? 'in_wrap focusing' : 'in_wrap'}>
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
  padding: 10px 16px 11px;
  background-color: #fff;
  border-radius: 12px;
  border: solid 1px #e0e0e0;
  &.focusing {
    border: solid 1px #000000;
  }
  .in_wrap {
    position: relative;

    input {
      display: block;
      width: 100%;
      font-size: 16px;
      font-weight: 800;
      line-height: 1.5;
      text-align: left;
      color: #000000;

      /* &:focus + button .ico {
        right: -10px;
        transform: rotate(60deg);
      } */
      &::placeholder {
        font-family: inherit;
        font-size: 14px;
        font-weight: 700;
        line-height: 1.71;
        letter-spacing: -0.35px;
        text-align: left;
        line-height: 1.71;
        color: #9e9e9e;
      }
    }
    button {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 0px;
      .ico {
        transition: 0.3s;
      }
    }
  }
`