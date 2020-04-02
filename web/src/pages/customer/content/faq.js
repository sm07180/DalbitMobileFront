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
//styled component
import styled from 'styled-components'
//ui
import SelectBoxs from 'components/ui/selectBox.js'
//----------------------------------------------------------

function Faq(props) {
  const selectBoxData = [
    {value: 0, text: '전체'},
    {value: 1, text: '일반'},
    {value: 2, text: '방송'},
    {value: 3, text: '결제'},
    {value: 4, text: '기타'}
  ]

  //context
  const context = useContext(Context)
  //faq state
  const [faqList, setFaqList] = useState([])
  const [faqDetail, setFaqDetail] = useState([])
  const [faqNum, setfaqNum] = useState(0)
  const [listhide, SetListhide] = useState('')
  //page state
  const [page, setPage] = useState(1)
  const {perPage} = props
  const details = Store().faqPage
  //page func
  const pageStart = page != 1 ? perPage * page - Store().page : 0
  const pageEnd = perPage * page
  const paginatedDated = faqList.slice(pageStart, pageEnd)
  const amountPages = Math.round(faqList.length / perPage)
  //pages
  let a = 0,
    b = amountPages
  function* range(a, b) {
    for (var i = a; i <= b; ++i) yield i
  }
  const numberPages = Array.from(range(a, b))
  //api----faq리스트
  async function fetchData() {
    const res = await Api.faq_list({
      params: {
        faqType: faqNum,
        page: 1,
        records: 100
      }
    })
    if (res.result === 'success') {
      //console.log(res.data.list)
      setFaqList(res.data.list)
    } else if (res.result === 'fail') {
      console.log(res)
    }
  }
  //api----디테일스
  async function fetchData2() {
    const res = await Api.faq_list_detail({
      params: {
        faqIdx: details
      }
    })
    if (res.result === 'success') {
      //console.log(res.data)
      setFaqDetail(res.data)
    } else if (res.result === 'fail') {
      console.log(res)
    }
  }
  //function---------------------------------------
  /**
   *
   * @func 상위 faq타입
   */
  const typeActive = e => {
    const number = parseInt(e.target.value)
    setPage(1)
    setfaqNum(number)
  }
  /**
   *
   * @func 토글 패치
   */
  const FaqToggle = () => {
    fetchData2()
  }

  /**
   *
   * @func 클릭 조건 실행
   */

  const clickEvent = faqIdx => {
    //Store().action.updatefaqPage(faqIdx)
    if (Store().faqPage === '') {
      Store().action.updatefaqPage(faqIdx)
    } else if (Store().faqPage !== '') {
      Store().action.updatefaqPage('')
    }
    SetListhide(faqIdx)
  }

  //set type select
  const setType = value => {
    if (value === 0) {
      setfaqNum(0)
    } else if (value === 1) {
      Store().action.updatefaqPage('')
      setfaqNum(1)
    } else if (value === 2) {
      Store().action.updatefaqPage('')
      setfaqNum(2)
    } else if (value === 3) {
      Store().action.updatefaqPage('')
      setfaqNum(3)
    } else if (value === 4) {
      Store().action.updatefaqPage('')
      setfaqNum(4)
    }
  }
  //--------------------------------------------------------
  useEffect(() => {
    fetchData()
  }, [faqNum])
  //--------------------------------------------------------
  useEffect(() => {
    if (Store().faqPage !== '') {
      FaqToggle()
    }
  }, [Store().faqPage])
  //--------------------------------------------------------

  return (
    <>
      {/* 컨텐츠 : 게시판 스타일 */}
      <ContentInfo onClick={() => SetListhide('')}>
        <h2>
          {faqNum === 0 ? '전체' : ''}
          {faqNum === 1 ? '일반' : ''}
          {faqNum === 2 ? '방송' : ''}
          {faqNum === 3 ? '결제' : ''}
          {faqNum === 4 ? '기타' : ''}
        </h2>
        <h3>{faqList.length}</h3>
        <div className="category">
          <button value="0" className={faqNum === 0 ? 'on' : ''} onClick={typeActive}>
            전체
          </button>
          <button value="1" className={faqNum === 1 ? 'on' : ''} onClick={typeActive}>
            일반
          </button>
          <button value="2" className={faqNum === 2 ? 'on' : ''} onClick={typeActive}>
            방송
          </button>
          <button value="3" className={faqNum === 3 ? 'on' : ''} onClick={typeActive}>
            결제
          </button>
          <button value="4" className={faqNum === 4 ? 'on' : ''} onClick={typeActive}>
            기타
          </button>
        </div>
        <div className="m-catecory">
          <SelectBoxs
            boxList={selectBoxData}
            onChangeEvent={setType}
            inlineStyling={{right: 0, top: 0, zIndex: 8}}
            type={'remove-init-data'}
          />
        </div>
      </ContentInfo>

      <PageWrap>
        <dl>
          {paginatedDated.map((item, index) => {
            const {faqType, writeDt, question, faqIdx} = item

            if (paginatedDated === null) return
            return (
              <div key={index}>
                {faqType === faqNum && (
                  <>
                    <TableWrap
                      onClick={() => clickEvent(faqIdx)}
                      className={Store().faqPage === faqIdx && listhide !== '' ? 'on' : ''}>
                      <dt>
                        {faqType === 0 ? '전체' : ''}
                        {faqType === 1 ? '일반' : ''}
                        {faqType === 2 ? '방송' : ''}
                        {faqType === 3 ? '결제' : ''}
                        {faqType === 4 ? '기타' : ''}
                      </dt>
                      <dd>
                        <span>Q</span>
                        {question}
                      </dd>
                      <dd className={Store().faqPage === faqIdx && listhide !== '' ? 'on' : ''}></dd>
                    </TableWrap>
                    <Detail className={Store().faqPage === faqIdx && listhide !== '' ? 'on' : ''}>
                      <div>
                        <span className="icon">A</span>
                        {faqDetail.answer && (
                          <p dangerouslySetInnerHTML={{__html: faqDetail.answer.replace(/class/gi, 'className')}}></p>
                        )}
                      </div>
                    </Detail>
                  </>
                )}
                {faqNum === 0 && (
                  <>
                    <TableWrap
                      onClick={() => clickEvent(faqIdx)}
                      className={Store().faqPage === faqIdx && listhide !== '' ? 'on' : ''}>
                      <dt>
                        {faqType === 0 ? '전체' : ''}
                        {faqType === 1 ? '일반' : ''}
                        {faqType === 2 ? '방송' : ''}
                        {faqType === 3 ? '결제' : ''}
                        {faqType === 4 ? '기타' : ''}
                      </dt>
                      <dd>
                        <span>Q</span>
                        {question}
                      </dd>
                      <dd className={Store().faqPage === faqIdx && listhide !== '' ? 'on' : ''}></dd>
                    </TableWrap>
                    <Detail className={Store().faqPage === faqIdx && listhide !== '' && listhide !== '' ? 'on' : ''}>
                      <div>
                        <span className="icon">A</span>
                        {faqDetail.answer && (
                          <p dangerouslySetInnerHTML={{__html: faqDetail.answer.replace(/class/gi, 'className')}}></p>
                        )}
                      </div>
                    </Detail>
                  </>
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
  & > div {
    display: flex;
    font-size: 14px;
    color: #424242;
    transform: skew(-0.03deg);
    & .icon {
      display: inline-block;
      margin-right: 4px;
      width: 16px;
      height: 16px;
      background-color: #ec455f;
      color: #fff;
      text-align: center;
      border-radius: 50%;
      @media (max-width: ${WIDTH_MOBILE}) {
        margin-right: 6px;
      }
    }
    & p {
      width: calc(100% - 44px);
      @media (max-width: ${WIDTH_MOBILE}) {
        width: 92%;
      }
    }
  }
  &.on {
    opacity: 1;
    height: auto;
    padding: 30px 0 30px 120px;
    transition: padding-top 0.6s ease;
    @media (max-width: ${WIDTH_MOBILE}) {
      padding: 30px 0 30px 0px;
    }
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
  @media (max-width: ${WIDTH_MOBILE}) {
    position: relative;
    flex-wrap: wrap;
  }
  & dt {
    width: 120px;
    color: ${COLOR_MAIN};
    font-size: 14px;
    transform: skew(-0.03deg);
    @media (max-width: ${WIDTH_MOBILE}) {
      width: 100%;
    }
  }
  & dd {
    width: calc(100% - 144px);
    font-size: 14px;
    color: #424242;
    transform: skew(-0.03deg);

    @media (max-width: ${WIDTH_MOBILE}) {
      width: 92%;
      margin-top: 8px;
      line-height: 1.4;
    }
  }
  & dd:last-child {
    width: 24px;
    height: 24px;
    background: url(${IMG_SERVER}/images/api/ico-prevmy.png) no-repeat center center/cover;
    &.on {
      background: url('https://devimage.dalbitlive.com/images/api/ico-selectup-g.png') no-repeat center center / 17px 9px;
    }

    @media (max-width: ${WIDTH_MOBILE}) {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  & span {
    display: inline-block;
    margin-right: 4px;
    width: 16px;
    height: 16px;
    background-color: ${COLOR_MAIN};
    color: #fff;
    text-align: center;
    border-radius: 50%;
    @media (max-width: ${WIDTH_MOBILE}) {
      margin-right: 6px;
    }
  }
  &.on {
    border-bottom: none;
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
