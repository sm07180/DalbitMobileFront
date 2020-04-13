/**
 * @file mypersonal.js
 * @brief 고객센터 1:1문의 컨텐츠
 *
 */
import React, {useState, useContext, useEffect} from 'react'
//context
import {Store} from './index'
import {Context} from 'context'
import Api from 'context/api'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
//styled component
import styled from 'styled-components'

//----------------------------------------------------------

function Faq(props) {
  //context
  const context = useContext(Context)
  //faq state
  const [personalList, setPersonalList] = useState([])
  const [PersonalNum, setpersonalNum] = useState(0)
  const [listhide, SetListhide] = useState('')
  //page state
  const [page, setPage] = useState(1)
  const {perPage} = props
  //page func
  const pageStart = page != 1 ? perPage * page - Store().page : 0
  const pageEnd = perPage * page
  const paginatedDated = personalList.slice(pageStart, pageEnd)
  const amountPages = Math.floor((personalList.length - 1) / perPage)
  //pages
  let a = 0,
    b = amountPages
  function* range(a, b) {
    for (var i = a; i <= b; ++i) yield i
  }
  const numberPages = Array.from(range(a, b))
  //api----faq리스트
  async function fetchData() {
    const res = await Api.center_qna_list({
      params: {
        page: 1,
        records: 100
      }
    })
    if (res.result === 'success') {
      //console.log(res)
      setPersonalList(res.data.list)
    } else if (res.result === 'fail') {
      //console.log(res)
    }
  }

  /**
   *
   * @func 클릭 조건 실행
   */
  const clickEvent = qnaIdx => {
    Store().action.updatePersonalPage(qnaIdx)
    SetListhide(qnaIdx)

    if (Store().personalPage === qnaIdx && listhide !== '') {
      Store().action.updatePersonalPage('')
      SetListhide('')
    }
  }
  useEffect(() => {})

  //--------------------------------------------------------
  useEffect(() => {
    fetchData()
  }, [PersonalNum])
  //--------------------------------------------------------

  //date format
  const timeFormat = strFormatFromServer => {
    let date = strFormatFromServer.slice(0, 8)
    date = [date.slice(0, 4), date.slice(4, 6), date.slice(6)].join('.')
    let time = strFormatFromServer.slice(8)
    time = [time.slice(0, 2), time.slice(2, 4), time.slice(4)].join(':')
    return `${date} ${time}`
  }
  //--------------------------------------------------------

  return (
    <>
      <PageWrap>
        <dl>
          {paginatedDated.map((item, index) => {
            const {qnaIdx, qnaType, title, contents, answer, state, writeDt, writeTs} = item
            if (paginatedDated === null) return
            return (
              <div key={index}>
                <TableWrap onClick={() => clickEvent(qnaIdx)} key={index}>
                  <dt>
                    {state === 0 && <span className="state">처리중</span>}
                    {state === 1 && <span className="stateComplete">처리완료</span>}
                    {qnaType === 1 && <span className="type">[ 회원정보 ]</span>}
                    {qnaType === 2 && <span className="type">[ 방송 ]</span>}
                    {qnaType === 3 && <span className="type">[ 청취 ]</span>}
                    {qnaType === 4 && <span className="type">[ 결제 ]</span>}
                    {qnaType === 5 && <span className="type">[ 건의 ]</span>}
                    {qnaType === 6 && <span className="type">[ 장애/버그 ]</span>}
                    {qnaType === 7 && <span className="type">[ 선물/아이템 ]</span>}
                    <p>{title}</p>
                  </dt>
                  <em className={Store().personalPage === qnaIdx ? 'on' : ''}></em>
                  <dd>{timeFormat(writeDt)}</dd>
                </TableWrap>

                <Detail className={Store().personalPage === qnaIdx && listhide !== '' ? 'on' : ''}>
                  <p dangerouslySetInnerHTML={{__html: contents.replace(/class/gi, 'className')}}></p>
                  {answer !== '' && (
                    <div className="answerWrap">
                      <span className="icon">A</span>
                      <p dangerouslySetInnerHTML={{__html: answer.replace(/class/gi, 'className')}}></p>
                    </div>
                  )}
                </Detail>
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
      {/* 컨텐츠 : 클릭 디테일 */}
    </>
  )
}
export default Faq
//styled------------------------------------------------------------------------------------------------------------------
const Detail = styled.section`
  opacity: 0;
  height: 0;
  overflow: hidden;
  padding: 0;
  background-color: #f8f8f8;
  & > div {
    display: flex;
    font-size: 14px;
    color: #424242;
    transform: skew(-0.03deg);
    & .icon {
      display: block;
      margin-right: 4px;
      width: 16px;
      height: 16px;
      line-height: 16px;
      background-color: #ec455f;
      color: #fff;
      text-align: center;
      border-radius: 50%;
      @media (max-width: ${WIDTH_MOBILE}) {
        margin-right: 6px;
      }
    }
  }
  &.on {
    opacity: 1;
    height: auto;
    padding: 30px 0 30px 120px;
    transition: padding-top 0.2s ease-in-out;
    @media (max-width: ${WIDTH_MOBILE}) {
      padding: 24px 16px;
    }
  }
  & p {
    width: calc(100% - 44px);
    @media (max-width: ${WIDTH_MOBILE}) {
      width: 100%;
      margin-top: -1px;
      color: #424242;
      font-size: 14px;
      line-height: 1.43;
      transform: skew(-0.03deg);
      letter-spacing: -0.35px;
    }
  }
  & .answerWrap {
    display: flex;
    justify-content: center;
    margin-top: 30px;
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////
const TableWrap = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  padding: 14px 0;
  border-bottom: 1px solid #e0e0e0;
  em {
    display: block;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    width: 24px;
    height: 24px;
    background: url(${IMG_SERVER}/images/api/ico-prevmy.png) no-repeat center center/cover;
    &.on {
      background: url(${IMG_SERVER}/images/api/ico-selectup-g.png) no-repeat center center / 17px 9px;
    }
  }

  dt {
    display: flex;
    align-items: center;
    width: 100%;
  }

  dd {
    margin-top: 4px;
    font-size: 12px;
    color: #bdbdbd;
    line-height: 1.08;
    letter-spacing: -0.3px;
    transform: skew(-0.03deg);
  }

  p {
    display: block;
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-left: 4px;
    font-size: 14px;
    color: #424242;
    letter-spacing: -0.35px;
    transform: skew(-0.03deg);
  }
  & .type {
    display: block;
    font-size: 14px;
    color: #424242;
    letter-spacing: -0.35px;
    transform: skew(-0.03deg);
  }
  & .state {
    display: block;
    width: 60px;
    height: 24px;
    margin-right: 6px;
    border-radius: 12px;
    border: solid 1px #e0e0e0;
    font-size: 12px;
    line-height: 24px;
    color: #616161;
    text-align: center;
    letter-spacing: normal;
    transform: skew(-0.03deg);
  }
  & .stateComplete {
    display: block;
    width: 60px;
    height: 24px;
    margin-right: 6px;
    border-radius: 12px;
    border: solid 1px #ec455f;
    font-size: 12px;
    line-height: 24px;
    color: #ec455f;
    text-align: center;
    letter-spacing: normal;
    transform: skew(-0.03deg);
  }
`
