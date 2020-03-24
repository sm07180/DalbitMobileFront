import React, {useState, useContext, useEffect} from 'react'
import styled from 'styled-components'
import {Context} from 'context'
import Api from 'context/api'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {useHistory} from 'react-router-dom'
import {Store} from './index'
//func:페이지네이션
function Pagination(props) {
  const context = useContext(Context)
  const history = useHistory()
  const [noticeList, setNoticeList] = useState([])
  const [noticeNum, setNoticeNum] = useState(0)
  const [page, setPage] = useState(1)
  const {perPage} = props
  const pageStart = page != 1 ? perPage * page - 10 : 0
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

  //api
  async function fetchData() {
    const res = await Api.notice_list({
      params: {
        noticeType: noticeNum,
        page: 1,
        records: 100
      }
    })
    if (res.result === 'success') {
      console.log(res.data.list)
      setNoticeList(res.data.list)
    } else if (res.result === 'fail') {
      console.log(res)
    }
  }
  useEffect(() => {
    fetchData()
  }, [noticeNum])
  const typeActive = e => {
    const number = parseInt(e.target.value)
    setNoticeNum(number)
  }

  return (
    <>
      {/* 컨텐츠 */}
      <ContentInfo>
        <h2>전체</h2>
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
      </ContentInfo>

      <PageWrap>
        <dl>
          {paginatedDated.map((item, index) => {
            const {noticeType, writeDt, title, noticeIdx} = item
            if (paginatedDated === null) return
            return (
              <div key={index}>
                {noticeType === noticeNum && (
                  <TableWrap onClick={(() => history.push(`/customer?${noticeIdx}`), Store().action.updatenoticePage(noticeIdx))}>
                    <dt>
                      {noticeType === 1 ? '공지사항' : ''}
                      {noticeType === 2 ? '이벤트' : ''}
                    </dt>
                    <dd>{title}</dd>
                    <dd>{writeDt}</dd>
                  </TableWrap>
                )}
                {noticeNum === 0 && (
                  <TableWrap key={index}>
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
    </>
  )
}
export default Pagination
//styled------------------------------------------------------------------------------------------------------------------
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
  & dt {
    width: 120px;
    color: ${COLOR_MAIN};
    font-size: 14px;
    transform: skew(-0.03deg);
  }
  & dd {
    width: calc(100% - 240px);
    font-size: 14px;
    color: #424242;
    transform: skew(-0.03deg);
  }
  & dd:last-child {
    width: 120px;
    font-size: 12px;
    color: #bdbdbd;
    transform: skew(-0.03deg);
  }
`

const ContentInfo = styled.div`
  margin-top: 40px;
  &:after {
    content: '';
    clear: both;
    display: block;
  }
  & h2 {
    display: inline-block;
    font-size: 20px;
    color: ${COLOR_MAIN};
  }
  & h3 {
    display: inline-block;
    font-size: 20px;
    color: #757575;
    margin-left: 10px;
  }
  & .category {
    float: right;
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
