import React, {useEffect, useState, useContext, useRef, useReducer} from 'react'
import qs from 'query-string'
//styled
import styled from 'styled-components'
//context
import Api from 'context/api'
import {Context} from 'context'
import {useHistory} from 'react-router-dom'
//scroll
import {Scrollbars} from 'react-custom-scrollbars'
import Utility, {dateFormatterKor, settingAlarmTime, printNumber, minuteToTime} from 'components/lib/utility'
//svg
import PtimeIcon from '../../static/ic_p_time.svg'
import PstarIcon from '../../static/ic_p_star.svg'
import PlastTimeIcon from '../../static/ic_p_headphone.svg'
import PxBtnIcon from '../../static/close_w_l.svg'
import PmemoGray from '../../static/ic_p_mem_g.svg'
import PmemoDark from '../../static/ic_p_mem_b.svg'
import PdeleteBtn from '../../static/ic_p_delete.svg'
import GarBageIcon from '../../static/garbage.svg'
import PlastTimeIconP from '../../static/ic_p_headphone_p.svg'
import PstarIconP from '../../static/ic_p_star_p.svg'
import PtimeIconP from '../../static/ic_p_time_p.svg'
//
import NoResult from 'components/ui/noResult'

//---------------------------------------------------------------------------------
// concat flag
let currentPage = 1
let timer
let moreState = false
console.log()
//---------------------------------------------------------------------------------
export default (props) => {
  const {sortNum} = props
  const history = useHistory()
  //context
  const ctx = useContext(Context)
  const {webview} = qs.parse(location.search)
  const {profile} = ctx
  var urlrStr = location.pathname.split('/')[2]
  //state
  const [list, setList] = useState([])
  const [nextList, setNextList] = useState(false)
  const [memoContent, setMemoContent] = useState('')
  const [defaultMemo, setDefaultMemo] = useState('')
  const [memoMemNo, setMemoMemNo] = useState(-1)
  const [popState, setPopState] = useState(false)
  // const [deleteList, setDeleteList] = useState('')
  // const [filterLeng, setFilterLeng] = useState(0)
  //스크롤 이벤트
  const scrollEvtHdr = (event) => {
    if (timer) window.clearTimeout(timer)
    timer = window.setTimeout(function () {
      const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
      const body = document.body
      const html = document.documentElement
      const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
      const windowBottom = windowHeight + window.pageYOffset
      if (moreState && windowBottom >= docHeight - 200) {
        showMoreList()
      } else {
      }
    }, 10)
  }
  //콘켓 쇼모어 이벤트
  const showMoreList = () => {
    if (moreState) {
      setList(list.concat(nextList))
      fetchData('next')
    }
  }
  // 콘켓 데이터 패치
  async function fetchData(next) {
    currentPage = next ? ++currentPage : currentPage
    const res = await Api.getNewFanList({
      memNo: urlrStr,
      sortType: sortNum,
      page: currentPage,
      records: 20
    })
    if (res.result === 'success') {
      if (res.code === '0') {
        if (next !== 'next') {
          setList(false)
        }
        moreState = false
      } else {
        if (next) {
          moreState = true
          setNextList(res.data.list)
        } else {
          ctx.action.updateFanEditeLength(res.data.list.length)
          setList(res.data.list)
          fetchData('next')
        }
      }
    } else {
    }
  }
  //등록,해제
  const Regist = (memNo, nickNm) => {
    async function fetchDataFanRegist(memNo) {
      const res = await Api.fan_change({
        data: {
          memNo: memNo
        }
      })
      if (res.result === 'success') {
        ctx.action.toast({
          msg: `${nickNm}님의 팬이 되었습니다`
        })
      } else if (res.result === 'fail') {
        ctx.action.alert({
          callback: () => {},
          msg: res.message
        })
      }
    }
    fetchDataFanRegist(memNo)
  }
  const Cancel = (memNo, nickNm) => {
    ctx.action.confirm({
      msg: `${nickNm} 님의 팬을 취소 하시겠습니까?`,
      callback: () => {
        async function fetchDataFanCancel(memNo) {
          const res = await Api.mypage_fan_cancel({
            data: {
              memNo: memNo
            }
          })
          if (res.result === 'success') {
            ctx.action.toast({
              msg: res.message
            })
          } else if (res.result === 'fail') {
            ctx.action.alert({
              callback: () => {},
              msg: res.message
            })
          }
        }
        fetchDataFanCancel(memNo)
      }
    })
  }
  // 팬등록 버튼 토글
  const registToggle = (isFan, memNo, nickNm) => {
    const test = list.map((item, index) => {
      if (item.memNo === memNo) {
        item.isFan = !item.isFan
      }
      return item
    })
    setList(test)
    if (isFan === false) {
      Regist(memNo, nickNm)
    } else if (isFan === true) {
      Cancel(memNo, nickNm)
    }
  }
  // 메모 활성화/비활성화 조회
  const GetMemoList = (memNo) => {
    fetchDataGetMemo(memNo)
    setMemoMemNo(memNo)
    setPopState(true)
  }
  // 메모 입력 벨리데이션
  const memoChange = (e) => {
    const {value} = e.target
    if (value.length > 500) return
    setMemoContent(value)
  }
  // 메모 전송
  const postMemo = () => {
    fetchDataPostMemo()
  }
  // 팝업 클로즈 토글
  const ClosePop = () => {
    setPopState(false)
    setMemoContent('')
  }

  //window Scroll
  useEffect(() => {
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [nextList])
  //-----------------------------------------------------------
  useEffect(() => {
    currentPage = 1
    fetchData()
  }, [sortNum])
  //-----------------------------------------------------------
  async function fetchDataGetMemo(memNo) {
    const res = await Api.getNewFanMemo({
      memNo: memNo
    })
    if (res.result === 'success') {
      setDefaultMemo(res.data.fanMemo)
      setMemoContent(res.data.fanMemo)
    } else if (res.result === 'fail') {
      ctx.action.alert({
        callback: () => {},
        msg: res.message
      })
    }
  }
  async function fetchDataPostMemo() {
    const res = await Api.postNewFanMemo({
      memNo: memoMemNo,
      memo: memoContent
    })
    if (res.result === 'success') {
      const test = list.map((item, index) => {
        if (item.memNo === memoMemNo) {
          if (item.fanMemo === '' || memoContent === '') {
            if (item.fanMemo === '') {
              item.fanMemo = memoContent
            } else if (memoContent === '') {
              item.fanMemo = memoContent
            }
          }
        }
        return item
      })
      setList(test)
      ctx.action.alert({
        callback: () => {
          setPopState(false)
          setMemoContent('')
        },
        msg: res.message
      })
    } else if (res.result === 'fail') {
      ctx.action.alert({
        callback: () => {
          setPopState(false)
          setMemoContent('')
        },
        msg: res.message
      })
    }
  }
  //삭제하기
  async function fetchDeleteList(memNo) {
    const res = await Api.deleteNewFanList({
      fanNoList: memNo
    })
    if (res.result === 'success') {
      const test = list.map((item, index) => {
        if (item.memNo === memNo) {
          item.nickNm = ''
        }
        return item
      })
      setList(test)
    } else if (res.result === 'fail') {
      ctx.action.alert({
        callback: () => {},
        msg: res.message
      })
    }
  }
  // 삭제하기 클릭
  const DeleteItem = (memNo) => {
    ctx.action.confirm({
      callback: () => {
        fetchDeleteList(memNo)
      },
      msg: '팬 삭제 시 메모도 삭제되며 <br/> 복구가 불가능합니다. <br/> <strong>정말 삭제하시겠습니까?<strong>'
    })
  }
  const Link = (memNo) => {
    if (webview && webview === 'new') {
      history.push(`/mypage/${memNo}?webview=new`)
    } else {
      history.push(`/mypage/${memNo}`)
    }
  }
  return (
    <Wrap>
      {(ctx.fanEditeLength === -1 || ctx.fanEditeLength === 0) && <NoResult />}
      {list &&
        list.map((item, idx) => {
          const {nickNm, profImg, regDt, listenTime, giftedByeol, lastListenTs, isFan, fanMemo, memNo} = item
          return (
            <React.Fragment key={idx}>
              {nickNm !== '' && (
                <div className="list">
                  <div className="list__imgBox" onClick={() => Link(memNo)}>
                    <img src={profImg.thumb120x120} alt="팬 프로필 이미지" />
                  </div>
                  <div className="list__infoBox" onClick={() => Link(memNo)}>
                    <span className="list__nick">{nickNm}</span>
                    <span className={sortNum === 0 ? 'list__registDt list__registDt--active' : 'list__registDt'}>
                      등록일 - {Utility.dateFormatterKor(regDt)}
                    </span>
                    <div className="list__details">
                      <span className={sortNum === 1 ? 'list__details__time list__details__time--active' : 'list__details__time'}>
                        {listenTime}분
                      </span>
                      <span
                        className={sortNum === 2 ? 'list__details__byeol list__details__byeol--active' : 'list__details__byeol'}>
                        {Utility.printNumber(giftedByeol)}
                      </span>
                      <span
                        className={
                          sortNum === 3 ? 'list__details__lastTime list__details__lastTime--active' : 'list__details__lastTime'
                        }>
                        {lastListenTs === '' || lastListenTs === 0 ? '-' : Utility.settingAlarmTime(lastListenTs)}
                      </span>
                    </div>
                  </div>

                  <div className="list__btnBox">
                    <button
                      className={isFan ? 'list__btnBox__fanBtn list__btnBox__fanBtn--active' : 'list__btnBox__fanBtn'}
                      onClick={() => registToggle(isFan, memNo, nickNm)}>
                      {isFan ? '팬' : '+팬등록'}
                    </button>
                    {fanMemo === '' ? (
                      <div className="editeWrap">
                        <button className="list__btnBox__memoBtn" onClick={() => GetMemoList(memNo)}></button>
                        <button className="editeWrap__garbageBtn" onClick={() => DeleteItem(memNo)}></button>
                      </div>
                    ) : (
                      <div className="editeWrap">
                        <button
                          className="list__btnBox__memoBtn list__btnBox__memoBtn--active"
                          onClick={() => GetMemoList(memNo)}></button>
                        <button className="editeWrap__garbageBtn" onClick={() => DeleteItem(memNo)}></button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </React.Fragment>
          )
        })}
      {popState && (
        <div className="memoPop">
          <div className="memoContents">
            <div className="memoContent__popTitle">
              메모
              <button onClick={ClosePop} />
            </div>

            <div className="writeWrap">
              <div className="txtCnt">
                <textarea
                  placeholder="회원을 기억하기 위한 메모를 입력해주세요.
                최대 500자까지 저장 가능합니다."
                  defaultValue={memoContent}
                  onChange={memoChange}></textarea>
              </div>
              <span className="txtcount">
                <b>{memoContent.length}</b> / 500
              </span>

              <div className="saveBtnWrap">
                {memoContent.length > 0 ? (
                  <>
                    <button className="saveBtn" onClick={ClosePop}>
                      취소
                    </button>
                    <button className="active" onClick={postMemo}>
                      {defaultMemo === '' ? '저장하기' : '수정하기'}
                    </button>
                  </>
                ) : defaultMemo === '' ? (
                  <>
                    <button onClick={ClosePop}>취소</button>
                    <button>확인</button>
                  </>
                ) : (
                  <>
                    <button onClick={ClosePop}>취소</button>
                    <button className="active" onClick={postMemo}>
                      수정하기
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Wrap>
  )
}

//styled
const Wrap = styled.div`
  .list {
    display: flex;
    align-items: center;
    min-height: 78px;
    padding: 8px 16px;
    box-sizing: border-box;
    background-color: #fff;
    border-bottom: 1px solid #eee;
    &__imgBox {
      margin-right: 11px;
      > img {
        width: 54px;
        border-radius: 50%;
      }
    }
    &__infoBox {
      display: flex;
      flex-direction: column;
      flex: 1;
      cursor: pointer;
    }
    &__nick {
      margin-bottom: 4px;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.14;
      text-align: left;
      color: #000000;
    }
    &__registDt {
      margin-bottom: 4px;
      font-size: 12px;
      line-height: 16px;
      text-align: left;

      &--active {
        color: #FF3C7B;
        font-weight: 600;
      }
    }
    &__details {
      display: flex;
      flex-direction: row;
      &__time,
      &__byeol,
      &__lastTime {
        margin-right: 4px;
        font-size: 12px;
        line-height: 16px;
        height: 16px;
        letter-spacing: normal;
        text-align: left;
        color: #424242;
      }
      &__time {
        position: relative;
        &:before {
          margin-right: 1px;
          display: inline-block;
          vertical-align: middle;
          width: 16px;
          line-height: 16px;
          height: 16px;
          content: '';
          background: url(${PtimeIcon});
        }
        &--active {
          font-weight: 600;
          color: #FF3C7B;
          &:before {
            background: url(${PtimeIconP});
          }
        }
      }
      &__byeol {
        position: relative;
        &:before {
          margin-right: 1px;
          display: inline-block;
          vertical-align: middle;
          line-height: 16px;
          width: 16px;
          height: 16px;
          content: '';
          background: url(${PstarIcon});
        }
        &--active {
          font-weight: 600;
          color: #FF3C7B;
          &:before {
            background: url(${PstarIconP});
          }
        }
      }
      &__lastTime {
        display: flex;
        align-items: center;
        position: relative;
        &:before {
          margin-right: 1px;
          display: inline-block;
          vertical-align: middle;
          width: 16px;
          height: 16px;
          content: '';
          background: url(${PlastTimeIcon});
        }
        &--active {
          font-weight: 600;
          color: #FF3C7B;
          &:before {
            background: url(${PlastTimeIconP});
          }
        }
      }
    }
    &__btnBox {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-left: auto;
      &__fanBtn {
        width: 64px;
        height: 32px;
        border-radius: 16px;
        color: #fff;
        font-size: 14px;
        text-align: center;
        border: solid 1px #FF3C7B;
        background-color: #FF3C7B;
        &--active {
          color: #FF3C7B;
          background-color: #fff;
          border: solid 1px #5f29e2;
        }
      }
      &__memoBtn {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 600;
        line-height: 1.14;
        letter-spacing: -0.35px;
        text-align: center;
        color: #bdbdbd;
        &:before {
          display: block;
          width: 24px;
          height: 24px;
          background: url(${PmemoGray});
          content: '';
        }
        &--active {
          color: #000000;
          &:before {
            display: block;
            width: 24px;
            height: 24px;
            background: url(${PmemoDark});
            content: '';
          }
        }
      }
    }
  }
  .deleteBtn {
    width: 24px;
    height: 24px;
    background: url(${PdeleteBtn});
  }
  .memoPop {
    z-index: 55;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0%;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    .memoContents {
      margin: 0px 16px;
      display: flex;
      align-items: center;
      flex-direction: column;
      box-sizing: border-box;
      width: 100%;
      max-width: 328px;
      background-color: #fff;
      border-radius: 20px;

      .writeWrap {
        width: 100%;
        background: #eee;
        border-radius: 0 0 20px 20px;
      }
      .txtCnt {
        position: relative;
        padding: 0px 16px;
        textarea {
          margin-top: 16px;
          border: 1px solid #e0e0e0;
          width: 100%;
          min-height: 160px;
          border-radius: 12px;
          padding: 14px 16px;
          box-sizing: border-box;
          font-size: 16px;
          text-align: left;
          color: #000;
          &::placeholder {
            font-size: 14px;
            line-height: 1.43;
            letter-spacing: -0.4px;
            text-align: left;
            color: #9e9e9e;
            font-weight: normal;
            letter-spacing: normal;
          }
        }
      }
      .txtcount {
        display: block;
        width: 100%;
        padding: 0px 16px;
        box-sizing: border-box;
        font-size: 12px;
        text-align: left;
        text-align: right;
        color: #616161;
        b {
          color: #000;
        }
      }

      .saveBtnWrap {
        display: flex;
        margin-top: 24px;
        padding: 0px 16px 16px 16px;

        button {
          flex: 1;
          line-height: 44px;
          border-radius: 12px;
          background-color: #bdbdbd;
          font-size: 16px;
          text-align: center;
          color: #fff;
          font-weight: 700;

          &.active {
            background-color: #6b36eb;
          }
          &:first-child {
            margin-right: 4px;
            background-color: #757575;
          }
        }
      }

      .memoContent__popTitle {
        width: 100%;
        display: block;
        position: relative;
        text-align: center;
        border-bottom: 1px solid #eeeeee;
        font-size: 18px;
        font-weight: 700;
        line-height: 52px;
        color: #000000;
        box-sizing: border-box;
        button {
          position: absolute;
          top: -40px;
          right: 0px;
          width: 32px;
          height: 32px;
          background: url(${PxBtnIcon});
        }
      }
    }
  }
  .editeWrap {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    margin-top: 6px;
    align-items: center;

    &__garbageBtn {
      display: inline-block;
      margin-left: 6px;
      width: 24px;
      height: 24px;
      background: url(${GarBageIcon});
    }
  }
`
