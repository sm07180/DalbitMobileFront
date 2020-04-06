/**
 * @title 검색바
 */
import React from 'react'
import styled from 'styled-components'
//hooks
import useChange from 'components/hooks/useChange'
//static
import SearchIco from '../static/search/ic_search_p.svg'
//
export default props => {
  //---------------------------------------------------------------------
  //hooks
  const {changes, setChanges, onChange} = useChange(update, {onChange: -1})
  //update
  function update(mode) {
    switch (true) {
      case mode.onChange !== undefined:
        break
    }
  }
  //---------------------------------------------------------------------
  return (
    <Content>
      <div className="in_wrap">
        <input type="text" name="query" placeholder="검색어를 입력해 보세요." onChange={onChange} />
        <button
          onClick={() => {
            props.update({search: changes})
          }}>
          <img className="ico" src={SearchIco} />
        </button>
      </div>
    </Content>
  )
}
//---------------------------------------------------------------------
const Content = styled.div`
  display: block;
  margin-top: 20px;
  margin-bottom: 36px;
  padding: 17px 16px 15px;
  border-radius: 28px;
  border: solid 2px #8556f6;
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
      &:focus + button .ico {
        right: -10px;
        transform: rotate(60deg);
      }
    }
    button {
      position: absolute;
      top: -7px;
      right: 0;
      .ico {
        transition: 0.3s;
      }
    }
  }
`
