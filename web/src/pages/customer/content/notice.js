/**
 * @file notice.js
 * @brief 고객센터 공지사항 컨텐츠
 *
 */
import React, {useState, useContext, useEffect} from 'react'
//context
import {Store} from './index'
import {Context} from 'context'
import Api from 'context/api'
import useClick from 'components/hooks/useClick'
import useChange from 'components/hooks/useChange'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import {useHistory} from 'react-router-dom'
//styled component
import styled from 'styled-components'
////////////////////////////////////////////////////////////////////////////////////
function Pagination(props) {
  //update
  function update(mode, e) {
    switch (true) {
      case mode.onChange !== undefined: //----------------------------상태변화
        if (changes.value === '전체') {
          setNoticeNum(0)
        }
        if (changes.value === '공지사항') {
          setNoticeNum(1)
        }
        if (changes.value === '이벤트') {
          setNoticeNum(2)
        }
        break
      case mode.downDown !== undefined: //----------------------------문의유형선택
        setIsOpen(false)
        setChanges({
          ...changes,
          type: mode.downDown,
          value: mode.downDown
        })

        break
    }
  }
  //context
  const context = useContext(Context)
  const history = useHistory()
  const {changes, setChanges, onChange} = useChange(update, {type: '전체', onChange: -1, value: '전체'})
  //hooks
  const dropDown1 = useClick(update, {downDown: '전체'})
  const dropDown2 = useClick(update, {downDown: '공지사항'})
  const dropDown3 = useClick(update, {downDown: '이벤트'})
  const [isOpen, setIsOpen] = useState(false)
  //notice state
  const [noticeList, setNoticeList] = useState([])
  const [noticeDetail, setNoticeDetail] = useState([])
  const [noticeNum, setNoticeNum] = useState(0)
  const [PageChange, setPageChange] = useState(0)
  //page state
  const [page, setPage] = useState(1)
  const {perPage} = props
  const details = Store().noticePage.noticeIdx
  //page func
  const pageStart = page != 1 ? perPage * page - Store().page : 0
  const pageEnd = perPage * page
  const paginatedDated = noticeList.slice(pageStart, pageEnd)
  const amountPages = Math.round(noticeList.length / perPage)
  //pages
  let a = 0,
    b = amountPages
  function* range(a, b) {
    for (var i = a; i <= b; ++i) yield i
  }
  const numberPages = Array.from(range(a, b))

  //----------------------------------------------------------

  //
  //api----공지사항리스트
  async function fetchData() {
    const res = await Api.notice_list({
      params: {
        noticeType: noticeNum,
        page: 1,
        records: 100
      }
    })
    if (res.result === 'success') {
      //console.log(res.data.list)
      setNoticeList(res.data.list)
    } else if (res.result === 'fail') {
      console.log(res)
    }
  }
  //api----디테일스
  async function fetchData2() {
    const res = await Api.notice_list_detail({
      params: {
        noticeIdx: details
      }
    })
    if (res.result === 'success') {
      setNoticeDetail(res.data)
    } else if (res.result === 'fail') {
      console.log(res)
    }
  }
  //function---------------------------------------
  const GoNotice = () => {
    Store().action.updatenoticePage('')
    history.push(`/customer`)
  }
  const typeActive = e => {
    const number = parseInt(e.target.value)
    setNoticeNum(number)
  }

  const NoticeUrl = () => {
    const index = Store().noticePage.noticeIdx

    if (index !== '') {
      history.push(`/customer?${index}`)
      fetchData2()
    }
  }

  //--------------------------------------------------------
  useEffect(() => {
    fetchData()
  }, [noticeNum])
  //--------------------------------------------------------
  useEffect(() => {
    if (Store().noticePage !== '') {
      NoticeUrl()
    }
  }, [Store().noticePage])

  //--------------------------------------------------------
  return (
    <>
      <List className={Store().noticePage !== '' ? 'on' : ''}>
        {/* 컨텐츠 : 게시판 스타일 */}
        <ContentInfo>
          <h2>
            {noticeNum === 0 ? '전체' : ''}
            {noticeNum === 1 ? '공지사항' : ''}
            {noticeNum === 2 ? '이벤트' : ''}
          </h2>
          <h3>{noticeList.length}</h3>
          <div className="category">
            <button onClick={typeActive} value="0" className={noticeNum === 0 ? 'on' : ''}>
              전체
            </button>
            <button onClick={typeActive} value="1" className={noticeNum === 1 ? 'on' : ''}>
              공지사항
            </button>
            <button onClick={typeActive} value="2" className={noticeNum === 2 ? 'on' : ''}>
              이벤트
            </button>
          </div>
          <SelectBox className={isOpen ? 'on' : ''}>
            <div className="wrap">
              <label htmlFor="allTerm">{changes.type}</label>
              <button
                className={isOpen ? 'on' : 'off'}
                onClick={() => {
                  setIsOpen(!isOpen)
                }}>
                펼치기
              </button>
            </div>
            {/* DropDown메뉴 */}
            <div className="dropDown">
              <a href="#1" {...dropDown1}>
                전체
              </a>
              <a href="#2" {...dropDown2}>
                공지사항
              </a>
              <a href="#3" {...dropDown3}>
                이벤트
              </a>
            </div>
          </SelectBox>
        </ContentInfo>

        <PageWrap>
          <dl>
            {paginatedDated.map((item, index) => {
              const {noticeType, writeDt, title, noticeIdx} = item

              if (paginatedDated === null) return
              return (
                <div key={index}>
                  {noticeType === noticeNum && (
                    <TableWrap onClick={() => Store().action.updatenoticePage(item)}>
                      <dt>
                        {noticeType === 1 ? '공지사항' : ''}
                        {noticeType === 2 ? '이벤트' : ''}
                      </dt>
                      <dd>{title}</dd>
                      <dd>{writeDt}</dd>
                    </TableWrap>
                  )}
                  {noticeNum === 0 && (
                    <TableWrap onClick={() => Store().action.updatenoticePage(item)}>
                      <dt>
                        {noticeType === 1 ? '공지사항' : ''}
                        {noticeType === 2 ? '이벤트' : ''}
                      </dt>
                      <dd>{title}</dd>
                      <dd>{writeDt}</dd>
                    </TableWrap>
                  )}
                </div>
              )
            })}
          </dl>
        </PageWrap>
        {/* 페이지네이션 */}
        <PageNumber>
          <button onClick={() => (page > 1 ? setPage(page - 1) : null)} className="prev" />
          {numberPages.map((item, index) => {
            return (
              <button onClick={() => setPage(item + 1)} className={page === item + 1 ? 'on' : ''} key={index}>
                {item + 1}
              </button>
            )
          })}
          <button onClick={() => (page + 1 <= numberPages.length ? setPage(page + 1) : null)} className="next" />
        </PageNumber>
      </List>
      {/* 컨텐츠 : 클릭 디테일 */}
      <Detail className={Store().noticePage === '' ? 'on' : ''}>
        <header>
          <span>{noticeDetail.title}</span>
          <span>{noticeDetail.writeDt}</span>
        </header>
        <div>
          <p>{noticeDetail.contents}</p>
        </div>
        <button onClick={GoNotice}>목록보기</button>
      </Detail>
    </>
  )
}
export default Pagination
//styled------------------------------------------------------------------------------------------------------------------
const List = styled.section`
  display: block;
  &.on {
    display: none;
  }
`

const Detail = styled.section`
  display: block;
  margin-top: 40px;
  border-top: 1px solid ${COLOR_MAIN};
  & > header {
    display: flex;
    justify-content: space-between;
    padding: 16px 20px;
    background-color: #f5f5f5;
    @media (max-width: ${WIDTH_MOBILE}) {
      flex-wrap: wrap;
      flex-direction: column;
    }
    & span:nth-child(1) {
      font-size: 14px;
      font-weight: 600;
      color: #424242;
      transform: skew(-0.03deg);
    }
    & span:nth-child(2) {
      margin-top: 8px;
      font-size: 12px;
      color: #bdbdbd;
    }
  }
  & > div {
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    padding: 40px 20px 60px 20px;
    font-size: 14px;
    color: #424242;
    transform: skew(-0.03deg);
  }
  & > button {
    display: block;
    margin: 40px auto 100px auto;
    padding: 16px 40px;
    background-color: ${COLOR_MAIN};
    border-radius: 8px;
    color: #fff;
  }
  &.on {
    display: none;
  }
`

const PageWrap = styled.div`
  margin-top: 25px;
  border-top: 1px solid ${COLOR_MAIN};
  & dl {
    width: 100%;
  }
`
const PageNumber = styled.nav`
  display: flex;
  justify-content: center;
  margin: 40px 0 100px 0;
  & > button {
    display: block;
    width: 36px;
    height: 36px;
    margin-right: 8px;
    border: solid 1px #e0e0e0;
    border-radius: 8px;
    color: #e0e0e0;
    font-size: 14px;
    transform: skew(-0.03deg);
    &.on {
      background-color: ${COLOR_MAIN};
      border: solid 1px ${COLOR_MAIN};
      color: #fff;
    }
    &.next {
      border: none;
      background: url('https://devimage.dalbitcast.com/images/api/Layer.png') no-repeat center center / 8.9px 17.7px;
    }
    &.prev {
      border: none;
      background: url('https://devimage.dalbitcast.com/images/api/Layerleft.png') no-repeat center center / 8.9px 17.7px;
    }
  }
`

const TableWrap = styled.div`
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  padding: 16px 0;
  cursor: pointer;
  @media (max-width: ${WIDTH_MOBILE}) {
    flex-wrap: wrap;
  }
  & dt {
    width: 120px;
    color: ${COLOR_MAIN};
    font-size: 14px;
    transform: skew(-0.03deg);
    @media (max-width: ${WIDTH_MOBILE}) {
      display: none;
    }
  }
  & dd {
    width: calc(100% - 240px);
    font-size: 14px;
    color: #424242;
    transform: skew(-0.03deg);
    @media (max-width: ${WIDTH_MOBILE}) {
      width: 100%;
    }
  }
  & dd:last-child {
    width: 120px;
    font-size: 12px;
    color: #bdbdbd;
    transform: skew(-0.03deg);
    @media (max-width: ${WIDTH_MOBILE}) {
      margin-top: 8px;
      width: 100%;
    }
  }
`

const ContentInfo = styled.div`
  margin-top: 40px;
  position: relative;

  &:after {
    content: '';
    clear: both;
    display: block;
  }
  & h2 {
    display: inline-block;
    font-size: 20px;
    color: ${COLOR_MAIN};
    line-height: 42px;
  }
  & h3 {
    display: inline-block;
    font-size: 20px;
    color: #757575;
    margin-left: 10px;
  }
  & .category {
    display: block;
    float: right;
    @media (max-width: ${WIDTH_MOBILE}) {
      display: none;
    }
    & button {
      padding: 11px 20px;
      margin-right: 4px;
      border-radius: 20px;
      border: 1px solid #e0e0e0;
      &.on {
        color: ${COLOR_MAIN};
        border: 1px solid ${COLOR_MAIN};
      }
    }
  }
`
const SelectBox = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: none;
  width: 140px;
  overflow: hidden;
  z-index: 11;
  border: 1px solid ${COLOR_MAIN};
  @media (max-width: ${WIDTH_MOBILE}) {
    display: block;
  }
  .dropDown {
    a {
      display: block;
      font-size: 14px;
      padding: 12px;
      border-top: 1px solid ${COLOR_MAIN};
      color: #424242;
      display: none;
    }
  }
  &.on {
    /* 높이조절 */
    /* height: 253px; */
    a {
      display: block;
      background-color: white;
      z-index: 11;
    }
  }
  .wrap {
    position: relative;

    * {
      line-height: 24px;
      vertical-align: top;
    }
    button {
      position: absolute;
      right: 2px;
      top: 2px;
      width: 36px;
      height: 36px;
      text-indent: -9999px;
    }

    label {
      display: inline-block;
      font-size: 14px !important;
      color: ${COLOR_MAIN};
      transform: skew(-0.03deg);
    }
  }
  & > div:first-child > button {
    background: url(https://devimage.dalbitcast.com/images/api/ic_arrow_down_purple.png) no-repeat center;
    transform: rotate(0deg);
    /* transition: transform 0.3s ease-in-out; */

    &.on {
      transform: rotate(180deg);
    }
  }
  & > div:first-child {
    padding: 8.5px 12px 8.5px 12px;
  }
`
