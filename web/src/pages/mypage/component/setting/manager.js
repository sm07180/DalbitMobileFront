/**
 * @file /mypage/component/blacklist.js
 * @brief 마이페이지 방송설정 - 매니저 설정
 **/
import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'
import useChange from 'components/hooks/useChange'

//context
import {Context} from 'context'
import Api from 'context/api'
import _ from 'lodash'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import Utility from 'components/lib/utility'

//component
import Paging from 'components/ui/paging.js'
import NoResult from 'components/ui/noResult'
//ui
import SelectBoxs from 'components/ui/selectBox.js'

export default props => {
  //-----------------------------------------------------------------------------
  //contenxt
  const context = useContext(Context)

  //hooks
  const {changes, setChanges, onChange} = useChange({onChange: -1})

  //state
  const [managerState, setManagerState] = useState(-1)
  const [userState, setUserState] = useState(-1)
  const [userList, setUserList] = useState(false)
  const [managerList, setManagerList] = useState(false)
  const [totalPageNumber, setTotalPageNumber] = useState(null)
  const [page, setPage] = useState(1)

  let userTypeSetting = 0

  const selectBoxData = [
    {value: 0, text: '전체'},
    {value: 0, text: '전체'},
    {value: 1, text: '닉네임'},
    {value: 2, text: 'ID'}
  ]

  //-----------------------------------------------------------------------------
  //async
  async function getManagerList() {
    const res = await Api.mypage_manager_list({})
    if (res.result == 'success' && _.hasIn(res, 'data.list')) {
      if (res.data.list == false) {
        setManagerState(0)
        setManagerList(false)
      } else {
        setManagerState(1)
        setManagerList(res.data.list)
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
      getManagerList()
    } else {
      context.action.alert({
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
    } else {
      context.action.alert({
        msg: res.message
      })
    }
  }

  async function getSearchList(type, typeDetail) {
    if (!_.hasIn(changes, 'search') || changes.search.length == 0)
      return context.action.alert({
        msg: `검색어를 입력해주세요.`
      })
    userTypeSetting = type == 'search' ? Number(_.hasIn(changes, 'searchType') ? changes.searchType : 0) : userTypeSetting
    const params = {
      userType: userTypeSetting,
      search: changes.search,
      page: type == 'page' ? typeDetail : 1,
      records: 5
    }
    const res = await Api.mypage_user_search({params})
    if (res.result == 'success' && _.hasIn(res, 'data.list')) {
      if (res.data.list == false) {
        setUserState(0)
        setUserList(false)
      } else {
        const {list, paging} = res.data
        if (paging) {
          const {totalPage} = paging
          setTotalPageNumber(totalPage)
          setUserState(1)
          setUserList(list)
        }
        if (type == 'search') {
          setPage(1)
        }
      }
    } else {
      context.action.alert({
        msg: res.message
      })
    }
  }
  //-----------------------------------------------------------------------------
  //function

  const createUserList = () => {
    if (userList == false) return null
    return (
      <>
        <ul className="list-item search">
          {userList.map((item, index) => {
            const {memNo, nickNm, memId, profImg} = item
            return (
              <li key={index}>
                <figure
                  style={{
                    background: `url(${profImg.thumb80x80}) no-repeat center center/ cover`
                  }}></figure>
                <div>
                  <span>@{memId}</span>
                  <p>{nickNm}</p>
                </div>
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
        <Paging setPage={setPagination} totalPage={totalPageNumber} currentPage={page} />
      </>
    )
  }

  const createManagerList = () => {
    if (managerList == false) return null
    return (
      <>
        <ul className="list-item">
          {managerList.map((item, index) => {
            const {memNo, nickNm, memId, profImg, regDt} = item
            const date = Utility.dateFormatter(regDt)
            return (
              <li key={index}>
                <figure
                  style={{
                    background: `url(${profImg.thumb80x80}) no-repeat center center/ cover`
                  }}></figure>
                <div>
                  <span>@{memId}</span>
                  <p>{nickNm}</p>
                  <em>{date}</em>
                </div>
                <button
                  onClick={() => {
                    context.action.confirm({
                      msg: `고정 매니저 권한을 해제하시겠습니까?`,
                      callback: () => {
                        deleteManager(memNo)
                      }
                    })
                  }}>
                  해제
                </button>
              </li>
            )
          })}
        </ul>
      </>
    )
  }

  const setPagination = page => {
    setPage(page)
    getSearchList('page', page)
  }

  const createUserResult = () => {
    if (userState === -1) {
      return null
    } else if (userState === 0) {
      return <NoResult className="mobile" />
    } else {
      return createUserList()
    }
  }

  const createManagerResult = () => {
    if (managerState === -1) {
      return null
    } else if (managerState === 0) {
      return <NoResult className="mobile" text="지정된 매니저가 없습니다." />
    } else {
      return createManagerList()
    }
  }

  //-----------------------------------------------------------------------------
  //useEffect
  useEffect(() => {
    getManagerList()
  }, [])

  const typeActive = value => {
    setChanges({...changes, searchType: value})
  }

  //-----------------------------------------------------------------------------
  return (
    <Content>
      <div className="resulte-area">{createManagerResult()}</div>
      <SearchArea>
        <div className="select-box">
          <SelectBoxs
            type={'remove-init-data'}
            boxList={selectBoxData}
            onChangeEvent={typeActive}
            inlineStyling={{left: 0, top: 0, zIndex: 8, position: 'static', width: '100%'}}
          />
        </div>
        <input
          type="search"
          name="search"
          onChange={onChange}
          onKeyUp={e => {
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
      <div className="resulte-area">{createUserResult()}</div>
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
    margin-left: 116px;
    padding: 0 46px 0 12px;
    color: #424242;
    font-size: 14px;
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

  .select-box {
    display: inline-block;
    position: absolute;
    left: 0;
    top: 0;

    height: 46px;
    width: 116px;
    text-indent: 12px;
    z-index: 8;
    .options + div {
      height: auto;
      width: calc(100% + 2px);
      margin-left: -1px;
      border: 1px solid #e0e0e0;
      .box-list {
        padding: 0;
        font-size: 14px;
      }
    }
    > div {
      border-right: 1px solid #e0e0e0;
      width: 100%;
      > div {
        width: 100%;
        border: 0;
        padding: 0;
        color: #616161;
        font-size: 14px;
        :before {
          background-color: #757575;
        }
        :after {
          background-color: #757575;
        }
      }
    }
  }
`

const Content = styled.div`
  .list-item {
    margin-top: -20px;
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
          padding-top: 1px;
          color: #424242;
          line-height: 22px;
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
    margin-top: 0;
    margin-bottom: 30px;
    border-top: 1px solid ${COLOR_MAIN};
    div {
      padding-top: 3px;
    }
    button {
      margin-top: 3px;
      background: ${COLOR_MAIN};
    }
  }
  .resulte-area {
    min-height: 100px;
    padding: 20px 0;
  }
`
