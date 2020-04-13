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
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import {useHistory} from 'react-router-dom'
//styled component
import styled from 'styled-components'
import NewIcon from './static/ic_new.svg'
//ui
import SelectBoxs from 'components/ui/selectBox.js'
//components
import Utility from 'components/lib/utility'

////////////////////////////////////////////////////////////////////////////////////
function Notice(props) {
  const selectBoxData = [
    {value: 0, text: '전체'},
    {value: 1, text: '공지사항'},
    {value: 2, text: '이벤트'}
  ]

  //context
  const context = useContext(Context)
  const history = useHistory()

  //notice state
  const [noticeList, setNoticeList] = useState([])
  const [noticeDetail, setNoticeDetail] = useState([])
  const [noticeNum, setNoticeNum] = useState(0)

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
      history.push(`/customer/notice/${index}`)
      fetchData2()
    }
  }
  //set type select
  const setType = value => {
    if (value === 0) {
      setNoticeNum(0)
    } else if (value === 1) {
      setNoticeNum(1)
    } else if (value === 2) {
      setNoticeNum(2)
    }
  }
  //date format
  const timeFormat = strFormatFromServer => {
    let date = strFormatFromServer.slice(0, 8)
    date = [date.slice(0, 4), date.slice(4, 6), date.slice(6)].join('.')
    let time = strFormatFromServer.slice(8)
    time = [time.slice(0, 2), time.slice(2, 4), time.slice(4)].join(':')
    return `${date} ${time}`
  }
  const detailDate = () => {
    if (noticeDetail.writeDt !== undefined) {
      timeFormat(noticeDetail.writeDt)
      return timeFormat(noticeDetail.writeDt)
    }
  }
  detailDate()
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

  const timestamp = String(new Date().getTime()).substr(0, 10)
  const IntTime = parseInt(timestamp)

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
          <div className="m-catecory">
            <SelectBoxs boxList={selectBoxData} onChangeEvent={setType} inlineStyling={{right: 0, top: 0, zIndex: 8}} />
          </div>
        </ContentInfo>

        <PageWrap>
          <dl>
            {paginatedDated.map((item, index) => {
              const {noticeType, writeDt, title, noticeIdx, writeTs} = item
              //console.log((IntTime - writeTs) / 3600)

              if (paginatedDated === null) return
              return (
                <div key={index}>
                  {noticeType === noticeNum && (
                    <TableWrap onClick={() => Store().action.updatenoticePage(item)}>
                      <dt>
                        {noticeType === 1 ? '공지사항' : ''}
                        {noticeType === 2 ? '이벤트' : ''}
                      </dt>
                      <dd>
                        {(IntTime - writeTs) / 3600 < 3 && <em></em>}
                        {title}
                      </dd>
                      <dd>{timeFormat(writeDt)}</dd>
                    </TableWrap>
                  )}
                  {noticeNum === 0 && (
                    <TableWrap onClick={() => Store().action.updatenoticePage(item)}>
                      <dt>
                        {noticeType === 1 ? '공지사항' : ''}
                        {noticeType === 2 ? '이벤트' : ''}
                      </dt>

                      <dd>
                        {(IntTime - writeTs) / 3600 < 3 && <em></em>}
                        {title}
                      </dd>
                      <dd>{timeFormat(writeDt)}</dd>
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
          <span>{detailDate()}</span>
        </header>
        <div>
          <p dangerouslySetInnerHTML={{__html: noticeDetail.contents}}></p>
        </div>
        <button onClick={GoNotice}>목록보기</button>
      </Detail>
    </>
  )
}
export default Notice
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
    & img {
      width: 100% !important;
    }
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
  @media (max-width: ${WIDTH_MOBILE}) {
    margin-top: 16px;
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
      background: url(${IMG_SERVER}/images/api/Layer.png) no-repeat center center / 8.9px 17.7px;
    }
    &.prev {
      border: none;
      background: url(${IMG_SERVER}/images/api/Layerleft.png) no-repeat center center / 8.9px 17.7px;
    }
  }
`

const TableWrap = styled.div`
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  padding: 16px 0;
  cursor: pointer;
  & em {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 6px;
    background-position: center center;
    background-size: cover;
    background-image: url(${NewIcon});
  }
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
    display: flex;
    align-items: center;
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
      width: 90%;
      margin-top: 8px;
      line-height: 1.4;
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

  & .m-catecory {
    display: none;
    @media (max-width: ${WIDTH_MOBILE}) {
      display: block;
    }
  }
`
