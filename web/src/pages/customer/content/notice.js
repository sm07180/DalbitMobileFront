/**
 * @file notice.js
 * @brief 고객센터 공지사항 컨텐츠
 *
 */
import React, {useState, useContext, useEffect} from 'react'
import {useParams} from 'react-router-dom'
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
let timer
let currentPage = 1
let moreState = false
////////////////////////////////////////////////////////////////////////////////////
function Notice(props) {
  //context
  let {memNo, num} = useParams()
  const context = useContext(Context)
  const history = useHistory()

  //notice state
  const [noticeList, setNoticeList] = useState([])
  const [noticeDetail, setNoticeDetail] = useState([])
  const [noticeNum, setNoticeNum] = useState(0)
  const [listPage, setListPage] = useState([])
  const [nextListPage, setNextListPage] = useState([])

  const details = Store().noticePage.noticeIdx

  //----------------------------------------------------------

  //
  //api----공지사항리스트
  async function fetchData(next) {
    currentPage = next ? ++currentPage : currentPage
    const res = await Api.notice_list({
      params: {
        noticeType: noticeNum,
        page: currentPage,
        records: 15
      }
    })
    if (res.result === 'success') {
      //setNoticeList(res.data.list)
      if (res.code === '0') {
        //if (!next) setListPage(0)
        moreState = false
      } else {
        if (next) {
          setNextListPage(res.data.list)
          moreState = true
        } else {
          setListPage(res.data.list)
          fetchData('next')
        }
      }
    } else if (res.result === 'fail') {
    }
  }
  //api----디테일스
  async function fetchDataDetail() {
    const res = await Api.notice_list_detail({
      params: {
        noticeIdx: details
      }
    })
    if (res.result === 'success') {
      setNoticeDetail(res.data)
    } else if (res.result === 'fail') {
    }
  }
  //function---------------------------------------
  const GoNotice = () => {
    Store().action.updatenoticePage('')
    //window.location.href = '/customer'
  }

  const NoticeUrl = () => {
    const index = Store().noticePage.noticeIdx

    if (index !== '') {
      history.push(`/customer/notice/${index}`)

      fetchDataDetail()
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
    currentPage = 1
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

  useEffect(() => {
    async function fetchDataDetail() {
      const res = await Api.notice_list_detail({
        params: {
          noticeIdx: num
        }
      })
      if (res.result === 'success') {
        setNoticeDetail(res.data)

        Store().action.updatenoticePage(num)
        setTimeout(() => {
          history.push(`/customer/notice/${num}`)
        }, 10)
      } else if (res.result === 'fail') {
      }
    }

    fetchDataDetail()
  }, [context.noticeIndexNum])

  ////////////////////////////////
  useEffect(() => {
    if (Store().noticePage !== undefined) {
      window.onpopstate = e => {
        window.history.back()
      }
    }
  }, [])
  useEffect(() => {
    if (history.location.pathname.split('/')[4] === 'undefined') {
      history.push(`/customer`)
    }
  }, [Store().noticePage])

  const showMoreList = () => {
    if (moreState) {
      setListPage(listPage.concat(nextListPage))
      fetchData('next')
    }
  }

  //----------------------------------------------------------
  const scrollEvtHdr = event => {
    if (timer) window.clearTimeout(timer)
    timer = window.setTimeout(function() {
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
      if (windowBottom >= docHeight - 200) {
        showMoreList()
      } else {
      }
    }, 10)
  }

  useEffect(() => {
    //reload
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [nextListPage])

  //--------------------------------------------------------
  return (
    <>
      <List className={Store().noticePage !== '' ? 'on' : ''}>
        {/* 컨텐츠 : 게시판 스타일 */}
        {/* <ContentInfo>
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
        </ContentInfo> */}

        <PageWrap>
          <dl>
            {listPage.map((item, index) => {
              const {noticeType, writeDt, title, noticeIdx, writeTs} = item
              //console.log((IntTime - writeTs) / 3600)

              if (listPage === null) return
              return (
                <div key={index}>
                  {noticeType === noticeNum && (
                    <TableWrap onClick={() => Store().action.updatenoticePage(item)}>
                      {/* <dt>
                        {noticeType === 1 ? '공지사항' : ''}
                        {noticeType === 2 ? '이벤트' : ''}
                      </dt> */}
                      <dd>
                        {(IntTime - writeTs) / 3600 < 3 && <em></em>}
                        {noticeType !== 0 && (
                          <span>
                            {noticeType === 1 ? '공지사항 ' : ''}
                            {noticeType === 2 ? '이벤트 ' : ''}
                            {noticeType === 3 ? '정기정검 ' : ''}
                            {noticeType === 4 ? '업데이트 ' : ''}
                            {noticeType === 5 ? '언론보도 ' : ''}
                          </span>
                        )}

                        <em></em>
                        {title}
                      </dd>
                      <dd>{timeFormat(writeDt)}</dd>
                    </TableWrap>
                  )}
                  {noticeNum === 0 && (
                    <TableWrap onClick={() => Store().action.updatenoticePage(item)}>
                      {/* <dt>
                        {noticeType === 1 ? '공지사항' : ''}
                        {noticeType === 2 ? '이벤트' : ''}
                      </dt> */}
                      <dd>
                        {(IntTime - writeTs) / 3600 < 3 && <em></em>}
                        {noticeType !== 0 && (
                          <span>
                            {noticeType === 1 ? '공지사항 ' : ''}
                            {noticeType === 2 ? '이벤트 ' : ''}
                            {noticeType === 3 ? '정기정검 ' : ''}
                            {noticeType === 4 ? '업데이트 ' : ''}
                            {noticeType === 5 ? '언론보도 ' : ''}
                          </span>
                        )}
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
        {/* <PageNumber>
          <button onClick={() => (page > 1 ? setPage(page - 1) : null)} className="prev" />
          {numberPages.map((item, index) => {
            return (
              <button onClick={() => setPage(item + 1)} className={page === item + 1 ? 'on' : ''} key={index}>
                {item + 1}
              </button>
            )
          })}
          <button onClick={() => (page + 1 <= numberPages.length ? setPage(page + 1) : null)} className="next" />
        </PageNumber> */}
      </List>
      {/* 컨텐츠 : 클릭 디테일 */}
      <Detail className={Store().noticePage === '' ? 'on' : ''}>
        <header onClick={GoNotice}>
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
  width:calc(100% + 32px);
  margin-lefT:-16px;
  padding-bottom:1px;
  /* border-top: 1px solid ${COLOR_MAIN}; */
  @media (min-width: 768px) {
  padding:0 20px;
}
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
      font-size: 16px;
      font-weight: 600;
      color: #000;
      transform: skew(-0.03deg);
    }
    & span:nth-child(2) {
      margin-top: 8px;
      font-size: 14px;
      color: #757575;
    }
  }
  & > div {
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    padding: 20px;
    font-size: 14px;
    color: #424242;
    transform: skew(-0.03deg);
    & img {
      width: 100% !important;
    }
  }
  & > button {
    display: block;
    margin: 20px auto 100px auto;
    padding: 12px 24px;
    background-color: ${COLOR_MAIN};
    border-radius: 8px;
    color: #fff;
  }
  &.on {
    display: none;
  }
`

const PageWrap = styled.div`
  
  /* border-top: 1px solid ${COLOR_MAIN}; */
  & dl {
    width: 100%;
  }
  
`
const PageNumber = styled.nav`
  display: flex;
  justify-content: center;
  margin: 20px 0 100px 0;
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
  padding: 10px 0;
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
    font-size: 16px;
    transform: skew(-0.03deg);
    @media (max-width: ${WIDTH_MOBILE}) {
      /* display: none; */
    }
  }
  & dd {
    display: flex;
    align-items: center;
    width: calc(100% - 240px);
    font-size: 16px;
    color: #000;
    transform: skew(-0.03deg);
    letter-spacing: -0.5px;
    font-weight: 600;
    @media (max-width: ${WIDTH_MOBILE}) {
      width: 100%;
    }

    span {
      color: ${COLOR_MAIN};
      margin-right: 5px;
    }
  }
  & dd:last-child {
    width: 120px;
    font-size: 14px;
    color: #757575;
    transform: skew(-0.03deg);
    font-weight: 400;
    @media (max-width: ${WIDTH_MOBILE}) {
      width: 90%;
      margin-top: 4px;
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
