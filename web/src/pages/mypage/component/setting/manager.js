/**
 * @file /mypage/component/blacklist.js
 * @brief 마이페이지 방송설정 - 매니저 설정
 **/
import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'

//context
import {Context} from 'context'
import Api from 'context/api'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

export default props => {
  //-----------------------------------------------------------------------------
  //contenxt
  const context = useContext(Context)

  //state

  //-----------------------------------------------------------------------------
  //function

  //-----------------------------------------------------------------------------
  return (
    <Content>
      <ul className="list-item">
        <li>
          <figure
            style={{
              background: `url(https://photo.dalbitlive.com/profile_0/20600190000/20200320092207071548.jpeg?336x336) no-repeat center center/ cover`
            }}></figure>
          <div>
            <span>@34f432</span>
            <p>이것이 나의 닉네임입니다</p>
            <em>2020-03-20</em>
          </div>
          <button>해제</button>
        </li>
      </ul>
      <SearchArea>
        <select>
          <option value="0">전체</option>
          <option value="1">닉네임</option>
          <option value="2">ID</option>
        </select>
        <input type="text" />
        <button>찾기</button>
      </SearchArea>
      <ul className="list-item search">
        <li>
          <figure
            style={{
              background: `url(https://photo.dalbitlive.com/profile_0/20600190000/20200320092207071548.jpeg?336x336) no-repeat center center/ cover`
            }}></figure>
          <div>
            <span>@34f432</span>
            <p>이것이 나의 닉네임입니다 닉네임이 길면 어떻게 하실건가요;; </p>
          </div>
          <button>등록</button>
        </li>
      </ul>
    </Content>
  )
}

const SearchArea = styled.div`
  position: relative;
  margin: 12px 0;
  border: 1px solid #e0e0e0;
  * {
    height: 46px;
    line-height: 46px;
  }
  select {
    width: 116px;
    border-right: 1px solid #e0e0e0;
    color: #707070;
    text-indent: 12px;
    background: url(${IMG_SERVER}/images/api/ico_selectdown_g.png) no-repeat 89% center;
  }
  input {
    width: calc(100% - 117px);
    padding: 0 46px 0 12px;
    color: #424242;
  }
  button {
    position: absolute;
    right: 6px;
    top: 5px;
    width: 36px;
    height: 36px;
    background: url(${IMG_SERVER}/images/api/ico_search_w_m.png) no-repeat center;
    text-indent: -9999px;
  }
`

const Content = styled.div`
  .list-item {
    li {
      display: flex;
      padding: 16px 0;
      border-bottom: 1px solid #e0e0e0;

      figure {
        flex-basis: 36px;
        height: 36px;
        border-radius: 50%;
      }

      div {
        width: calc(100% - 83px);
        padding: 0 10px;
        * {
          display: block;
          font-size: 14px;
          transform: skew(-0.03deg);
        }
        span {
          color: ${COLOR_MAIN};
        }
        p {
          overflow: hidden;
          padding-top: 3px;
          color: #424242;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        em {
          padding-top: 6px;
          color: #bdbdbd;
          font-style: normal;
          font-size: 12px;
        }
      }

      button {
        flex-basis: 47px;
        height: 36px;
        margin-top: 9px;
        border-radius: 10px;
        background: #bdbdbd;
        color: #fff;
        font-size: 14px;
      }
    }
  }
  .list-item.search {
    border-top: 1px solid ${COLOR_MAIN};
    div {
      padding-top: 3px;
    }
    button {
      margin-top: 3px;
      background: ${COLOR_MAIN};
    }
  }
`
