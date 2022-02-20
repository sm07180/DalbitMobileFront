/**
 * @file /mypage/component/blacklist.js
 * @brief 마이페이지 방송설정 - 매니저 설정
 **/
import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'
import useChange from 'components/hooks/useChange'
import qs from 'query-string'

//context
import {Context} from 'context'
import Api from 'context/api'
import {useHistory} from 'react-router-dom'
import _ from 'lodash'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import Utility from 'components/lib/utility'

//component
import Paging from 'components/ui/paging.js'
import NoResult from 'components/ui/new_noResult'
//ui
import SelectBoxs from 'components/ui/selectBox.js'
import SearchIconGray from '../../static/ic_search_g.svg'
import ArrowIconGray from '../../static/ic_arrow_down_gray.svg'
let currentPage = 1
let timer
let moreState = false
export default (props) => {
  //-----------------------------------------------------------------------------
  const {webview} = qs.parse(location.search)
  let history = useHistory()
  //contenxt
  const context = useContext(Context)

  //hooks
  const {changes, setChanges, onChange} = useChange({onChange: -1})

  //state

  const [userList, setUserList] = useState([])
  const [nextUserList, setNextUserList] = useState([])
  const [userTotalCount, setUserTotalCount] = useState(0)
  const [managerList, setManagerList] = useState([])
  const [tabState, setTabState] = useState(1)
  let userTypeSetting = 0

  const selectBoxData = [
    {value: 0, text: '전체'},
    {value: 0, text: '전체'},
    {value: 1, text: '닉네임'},
    {value: 2, text: 'ID'}
  ]
  //async
  async function getManagerList() {
    const res = await Api.mypage_manager_list({})
    if (res.result == 'success' && _.hasIn(res, 'data.list')) {
      if (res.data.list.length > 0) {
        setManagerList(res.data.list)
      } else {
        setManagerList([])
      }
    } else {
      context.action.alert({
        msg: res.message
      })
    }
  }
  async function addManager(memNum) {
    const res = await Api.mypage_manager_add({
      data: {
        memNo: memNum
      }
    })
    if (res.result == 'success') {
      context.action.toast({
        msg: res.message
      })
      getSearchList('search')
    } else {
      context.action.toast({
        msg: res.message
      })
    }
  }
  async function deleteManager(memNum) {
    const res = await Api.mypage_manager_delete({
      data: {
        memNo: memNum
      }
    })
    if (res.result == 'success') {
      getManagerList()
      context.action.toast({
        msg: res.message
      })
    } else {
      context.action.toast({
        msg: res.message
      })
    }
  }
  async function getSearchList(type, next) {
    if (!next) currentPage = 1
    currentPage = next ? ++currentPage : currentPage
    if (!_.hasIn(changes, 'search') || changes.search.length == 0)
      return context.action.alert({
        msg: `검색어를 입력해주세요.`
      })
    userTypeSetting = type == 'search' ? Number(_.hasIn(changes, 'searchType') ? changes.searchType : 0) : userTypeSetting
    const params = {
      userType: userTypeSetting,
      search: changes.search,
      searchType: 'maneger',
      page: next === 'next' ? currentPage : 1,
      records: 30
    }
    const res = await Api.mypage_user_search({params})
    if (res.result === 'success' && res.data.hasOwnProperty('list')) {
      const {list, paging} = res.data
      if (paging) {
        const {totalPage, total} = paging
        setUserTotalCount(total)
      }
      if (res.data.list.length === 0) {
        if (!next) {
          setUserList([])
        }
        moreState = false
      } else {
        if (next) {
          moreState = true
          setNextUserList(res.data.list)
        } else {
          setUserList(res.data.list)
          getSearchList('search', 'next')
        }
      }
    } else {
      context.action.alert({
        msg: res.message
      })
    }
  }

  const createUserList = () => {
    return (
      <>
        <p className="titleCount">
          검색 결과<em>{userTotalCount}</em>
        </p>
        {userList.length > 0 ? (
          <ul className="list-item search">
            {userList.map((item, index) => {
              const {memNo, nickNm, memId, profImg} = item
              const link = webview ? `/mypage/${memNo}?webview=${webview}` : `/mypage/${memNo}`
              return (
                <li key={index}>
                  <a onClick={() => history.push(link)}>
                    <figure
                      style={{
                        background: `url(${profImg.thumb80x80}) no-repeat center center/ cover`
                      }}></figure>
                    <div>
                      <span>{nickNm}</span>
                      <span>@{memId}</span>
                    </div>
                  </a>
                  <button
                    onClick={() => {
                      context.action.confirm({
                        msg: `${nickNm} 님을 매니저로 등록 하시겠습니까?`,
                        callback: () => {
                          addManager(memNo)
                        }
                      })
                    }}>
                    등록
                  </button>
                </li>
              )
            })}
          </ul>
        ) : (
          <NoResult height={400} type="default" text="등록된 매니저가 없습니다." />
        )}
      </>
    )
  }
  const createManagerList = () => {
    return (
      <>
        <p className="titleCount">
          등록된 매니저 <em>{managerList.length}</em>
        </p>
        {managerList.length > 0 ? (
          <ul className="list-item search">
            {managerList.map((item, index) => {
              const {memNo, nickNm, memId, profImg, regDt} = item
              const date = Utility.dateFormatter(regDt)
              const link = webview ? `/mypage/${memNo}?webview=${webview}` : `/mypage/${memNo}`
              return (
                <li key={index}>
                  <a onClick={() => history.push(link)}>
                    <figure
                      style={{
                        background: `url(${profImg.thumb80x80}) no-repeat center center/ cover`
                      }}></figure>
                    <div>
                      <span>{nickNm}</span>
                      <span>@{memId}</span>
                    </div>
                  </a>
                  <button
                    onClick={() => {
                      context.action.confirm({
                        msg: `고정 매니저 권한을 해제하시겠습니까?`,
                        callback: () => {
                          deleteManager(memNo)
                        }
                      })
                    }}
                    className="grayBtn">
                    해제
                  </button>
                </li>
              )
            })}
          </ul>
        ) : (
          <NoResult height={400} type="default" text="등록된 고정 매니저가 없습니다" />
        )}
      </>
    )
  }
  const createSearchList = () => {
    return (
      <>
        <p className="titleCount">
          검색 결과 <em>{manegerSearchList.length}</em>
        </p>
        {manegerSearchList.length > 0 ? (
          <ul className="list-item search">
            {manegerSearchList.map((item, index) => {
              const {memNo, nickNm, memId, profImg, regDt} = item
              const date = Utility.dateFormatter(regDt)
              const link = webview ? `/mypage/${memNo}?webview=${webview}` : `/mypage/${memNo}`
              return (
                <li key={index}>
                  <a onClick={() => history.push(link)}>
                    <figure
                      style={{
                        background: `url(${profImg.thumb80x80}) no-repeat center center/ cover`
                      }}></figure>
                    <div>
                      <span>{nickNm}</span>
                      <span>@{memId}</span>
                    </div>
                  </a>
                  <button
                    onClick={() => {
                      context.action.confirm({
                        msg: `고정 매니저 권한을 해제하시겠습니까?`,
                        callback: () => {
                          deleteManager(memNo)
                        }
                      })
                    }}
                    className="grayBtn">
                    해제
                  </button>
                </li>
              )
            })}
          </ul>
        ) : (
          <NoResult height={400} type="default" text="검색 결과가 없습니다." />
        )}
      </>
    )
  }
  const typeActive = (value) => {
    setChanges({...changes, searchType: value})
  }
  //매니저 필터
  const [manegerValue, setManegerValue] = useState('')
  const [manegerSearchList, setManegerSearchList] = useState(managerList)
  const SearchManeger = (manegerValue, selectBoxData) => {
    if (changes.searchType === 0) {
      setManegerSearchList(
        managerList.filter((managerList) => managerList.nickNm.includes(manegerValue) || managerList.memId.includes(manegerValue))
      )
    } else if (changes.searchType === 1) {
      setManegerSearchList(managerList.filter((managerList) => managerList.nickNm.includes(manegerValue)))
    } else if (changes.searchType === 2) {
      setManegerSearchList(managerList.filter((managerList) => managerList.memId.includes(manegerValue)))
    }
  }
  const tabChangeFunction = () => {
    moreState = false
    currentPage = 1
    setManegerValue('')
    if (tabState === 0) {
      getManagerList()
      setTabState(1)
    } else {
      setTabState(0)
    }
  }
  const showMoreList = () => {
    if (moreState) {
      getSearchList('search', 'next')
      setUserList(userList.concat(nextUserList))
    }
  }
  const scrollEvtHdr = (event) => {
    if (timer) window.clearTimeout(timer)
    timer = window.setTimeout(function () {
      //스크롤
      const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
      const body = document.body
      const html = document.documentElement
      const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
      const windowBottom = windowHeight + window.pageYOffset
      //스크롤이벤트체크
      /*
       * @가속처리
       */
      if (windowBottom >= docHeight - 300 && nextUserList.length !== 0) {
        showMoreList()
      } else {
      }
    }, 140)
  }
  useEffect(() => {
    //reload
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [nextUserList])
  useEffect(() => {
    getManagerList()
    return () => {
      currentPage = 1
    }
  }, [])
  //-----------------------------------------------------------------------------
  return (
    <Content>
      <div className="tab">
        <button onClick={tabChangeFunction} className={tabState === 1 ? 'on' : ''}>
          관리
        </button>
        <button onClick={tabChangeFunction} className={tabState === 0 ? 'on' : ''}>
          등록
        </button>
      </div>
      {tabState === 0 && (
        <>
          <SearchArea>
            <div className="select-box">
              <SelectBoxs
                type={'remove-init-data'}
                boxList={selectBoxData}
                onChangeEvent={typeActive}
                inlineStyling={{
                  left: 0,
                  top: 0,
                  zIndex: 8,
                  // position: 'static',
                  position: 'relative',
                  width: '100%'
                }}
              />
            </div>
            <input
              type="search"
              name="search"
              placeholder="검색어를 입력해 보세요"
              onChange={onChange}
              onKeyUp={(e) => {
                if (e.keyCode === 13) getSearchList('search')
              }}
            />
            <button
              onClick={() => {
                getSearchList('search')
              }}>
              찾기
            </button>
          </SearchArea>
          {userList && userList.length > 0 ? (
            <div className="result-area">{createUserList()}</div>
          ) : (
            <NoResult height={400} type="default" text="등록된 고정 매니저가 없습니다." />
          )}
        </>
      )}
      {tabState === 1 && (
        <>
          {/* <SearchArea>
            <div className="select-box">
              <SelectBoxs
                type={'remove-init-data'}
                boxList={selectBoxData}
                onChangeEvent={typeActive}
                inlineStyling={{
                  left: 0,
                  top: 0,
                  zIndex: 8,
                  // position: 'static',
                  position: 'relative',
                  width: '100%'
                }}
              />
            </div>
            <input
              type="search"
              name="search"
              placeholder="검색어를 입력해 보세요"
              onChange={(e) => setManegerValue(e.target.value)}
              onKeyUp={(e) => {
                if (e.keyCode === 13) SearchManeger(manegerValue)
              }}
            />
            <button
              onClick={() => {
                SearchManeger(manegerValue, selectBoxData)
              }}>
              찾기
            </button>
          </SearchArea> */}
          <div className="result-area">
            {manegerValue === '' && createManagerList()}
            {manegerValue !== '' && createSearchList()}
          </div>
        </>
      )}
    </Content>
  )
}

const SearchArea = styled.div`
  position: relative;
  border-radius: 12px;

  select {
    width: 100px;
    border-right: 1px solid #bdbdbd;
    color: #707070;
    text-indent: 12px;
    background: url(${IMG_SERVER}/images/api/ico_selectdown_g.png) no-repeat 89% center;
    height: 44px;
    line-height: 44px;
  }
  .select-box {
    * {
      height: 44px;
      line-height: 44px;
    }
  }
  input {
    width: calc(100% - 102px);
    margin-left: 100px;
    padding: 10px 46px 10px 12px;
    height: 44px;
    line-height: 24px;
    color: #000;
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-left: none;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
    font-weight: 800;
    font-size: 16px;
    :focus {
      border: 1px solid #000;
    }
    ::placeholder {
      font-size: 14px;
      font-weight: 600;
      letter-spacing: normal;
      text-align: left;
      color: #9e9e9e;
    }
  }
  button {
    position: absolute;
    right: 10px;
    top: 3px;
    width: 36px;
    height: 36px;
    background: url(${SearchIconGray}) no-repeat center / cover;
    text-indent: -9999px;
  }

  .select-box {
    display: inline-block;
    position: absolute;
    left: 0;
    top: 0px;
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
    border-right: none;
    height: 44px;
    width: 100px;
    text-indent: 12px;

    .options {
      z-index: 9999;
      border-top-left-radius: 12px;
      border-bottom-left-radius: 12px;
    }

    .options + div {
      position: absolute;
      height: auto;
      width: calc(100% + 2px);
      margin-left: -1px;
      padding-top: 14px;
      background: #fff;
      top: 30px;
      z-index: -1;
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
      overflow: hidden;
      border: 1px solid #e0e0e0;
      border-top: none;

      .box-list {
        padding: 0;
        font-size: 14px;
      }
    }
    > div {
      border-right: 1px solid #e0e0e0;
      width: 100%;
      position: relative;
      :after {
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        content: '';
        width: 24px;
        height: 24px;
        background: url(${ArrowIconGray}) no-repeat center center / cover;
      }
      > div {
        width: 100%;
        border: 0;
        padding: 0;
        letter-spacing: -0.35px;
        color: #000000;
        font-weight: 600;
        font-size: 14px;
        :before {
          background-color: #757575;
        }
        :after {
          background-color: #757575;
        }
        :before,
        :after {
          display: none;
          top: 24px;
        }
      }
    }
  }
`

const Content = styled.div`
  padding: 0 16px;
  .titleCount {
    margin-bottom: 8px;
    font-size: 16px;
    font-weight: 800;
    text-align: left;
    color: #000000;
    > em {
      font-weight: 600;
      font-style: normal;
      margin-left: 4px;
      color: #FF3C7B;
    }
  }
  .tab {
    display: flex;
    margin-bottom: 8px;
    button {
      width: 80px;
      height: 32px;
      border-radius: 12px;
      border: solid 1px #FF3C7B;
      margin-right: 2px;
      border: solid 1px #e0e0e0;
      background-color: #ffffff;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: normal;
      text-align: center;
      color: #000000;
    }
    .on {
      border: solid 1px #FF3C7B;
      background-color: #FF3C7B;
      color: #fff;
    }
  }
  .list-item {
    .grayBtn {
      display: block;
      width: 46px;
      height: 32px;
      border-radius: 8px;
      border: solid 1px #757575;
      font-size: 14px;
      text-align: center;
      color: #000000;
      background-color: #fff !important;
    }
    .result_count {
      display: flex;
      margin-bottom: 8px;
      font-size: 16px;
      font-weight: 800;
      text-align: left;
      color: #000000;
      > span {
        color: #FF3C7B;
        margin-left: 8px;
      }
    }
    li {
      display: flex;
      position: relative;
      padding: 4px 10px;
      height: 48px;
      margin-bottom: 4px;
      border-radius: 12px;
      background-color: #fff;
      figure {
        flex-basis: 40px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }

      a {
        display: flex;
        max-width: 100%;
      }

      div {
        max-width: calc(100% - 36px);
        white-space: nowrap;
        text-overflow: ellipsis;
        padding: 0 10px;
        * {
          display: block;
          font-size: 14px;
          transform: skew(-0.03deg);
        }
        span:first-child {
          line-height: 21px;
          height: 21px;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: normal;
          text-align: left;
          color: #000000;
        }

        span:last-child {
          line-height: 16px;
          height: 16px;
          font-size: 12px;
          text-align: left;
          color: #000000;
        }
        p {
          overflow: hidden;
          padding-top: 1px;
          color: #424242;
          line-height: 22px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        em {
          color: #bdbdbd;
          font-style: normal;
          font-size: 12px;
        }
      }

      button {
        position: absolute;
        right: 10px;
        width: 48px;
        height: 32px;
        margin-top: 9px;
        border-radius: 10px;
        background: #bdbdbd;
        color: #fff;
        font-size: 14px;
      }
    }
  }
  .list-item.search {
    margin-top: 0;
    margin-bottom: 30px;

    div {
      /* padding-top: 3px; */
    }
    button {
      margin-top: 3px;
      background: ${COLOR_MAIN};
    }
  }
  .result-area {
    min-height: 100px;
    padding: 12px 0;
  }
  .paging-wrap {
    margin-top: -20px;
  }
`
