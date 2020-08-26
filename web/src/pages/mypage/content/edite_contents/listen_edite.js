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
import PlastTimeIconP from '../../static/ic_p_headphone_p.svg'
import PxBtnIcon from '../../static/ic_p_xbtn.svg'
import PmemoGray from '../../static/ic_p_mem_g.svg'
import PmemoDark from '../../static/ic_p_mem_b.svg'
import PdeleteBtn from '../../static/ic_p_delete.svg'
import GarBageIcon from '../../static/garbage.svg'
//
import NoResult from 'components/ui/noResult'

//---------------------------------------------------------------------------------
// concat flag
let currentPage = 1
let timer
let moreState = false

//---------------------------------------------------------------------------------
export default (props) => {
  const history = useHistory()
  //context
  const ctx = useContext(Context)
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
      sortType: 3,
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
  const Regist = (memNo) => {
    async function fetchDataFanRegist(memNo) {
      const res = await Api.fan_change({
        data: {
          memNo: memNo
        }
      })
      if (res.result === 'success') {
        ctx.action.alert({
          callback: () => {},
          msg: res.message
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
  const Cancel = (memNo, isFan) => {
    async function fetchDataFanCancel(memNo, isFan) {
      const res = await Api.mypage_fan_cancel({
        data: {
          memNo: memNo
        }
      })
      if (res.result === 'success') {
        ctx.action.alert({
          callback: () => {},
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
  // 팬등록 버튼 토글
  const registToggle = (isFan, memNo) => {
    const test = list.map((item, index) => {
      if (item.memNo === memNo) {
        item.isFan = !item.isFan
      }
      return item
    })
    setList(test)
    if (isFan === false) {
      Regist(memNo)
    } else if (isFan === true) {
      Cancel(memNo)
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
  // 임시 삭제하기 기능
  // const hideList = (memNo) => {
  //   const test = list.map((item, index) => {
  //     if (item.memNo === memNo) {
  //       item.nickNm = ''
  //     }
  //     return item
  //   })
  //   const filterList = test.filter((v) => {
  //     return v.nickNm === ''
  //   })
  //   setList(test)
  //   setFilterLeng(filterList.length)
  //   if (filterList.length > 0) {
  //     ctx.action.updateEditeToggle(true)
  //   }
  //   let str = ''
  //   filterList.forEach((v, i, self) => {
  //     if (i === self.length - 1) {
  //       str += v.memNo
  //     } else {
  //       str += v.memNo + '|'
  //     }
  //   })
  //   setDeleteList(str)
  // }

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
  }, [])
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
                  <div className="list__imgBox" onClick={() => history.push(`/mypage/${memNo}`)}>
                    <img src={profImg.thumb120x120} alt="팬 프로필 이미지" />
                  </div>
                  <div className="list__infoBox">
                    <span className="list__nick">{nickNm}</span>
                    <span className="list__registDt">등록일 - {Utility.dateFormatterKor(regDt)}</span>
                    <div className="list__details">
                      <span className="list__details__time">{listenTime}분</span>
                      <span className="list__details__byeol">{Utility.printNumber(giftedByeol)}</span>
                      <span className="list__details__lastTime">
                        {lastListenTs === '' || lastListenTs === 0 ? '-' : Utility.settingAlarmTime(lastListenTs)}
                      </span>
                    </div>
                  </div>

                  <div className="list__btnBox">
                    <button
                      className={isFan ? 'list__btnBox__fanBtn list__btnBox__fanBtn--active' : 'list__btnBox__fanBtn'}
                      onClick={() => registToggle(isFan, memNo)}>
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
            <header>
              메모
              <button onClick={ClosePop} />
            </header>
            <div className="txtCnt">
              <textarea
                placeholder="회원을 기억하기 위한 메모를 입력해주세요.
최대 500자까지 저장 가능합니다."
                defaultValue={memoContent}
                onChange={memoChange}></textarea>
              <span className="txtcount">{memoContent.length} / 500</span>
            </div>
            {memoContent.length > 0 ? (
              <button className="saveBtn saveBtn--active" onClick={postMemo}>
                {defaultMemo === '' ? '저장하기' : '수정하기'}
              </button>
            ) : defaultMemo === '' ? (
              <button className="saveBtn">저장하기</button>
            ) : (
              <button className="saveBtn saveBtn--active" onClick={postMemo}>
                수정하기
              </button>
            )}
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
      line-height: 1.08;
      text-align: left;
      color: #424242;
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
          height: 16px;
          content: '';
          background: url(${PtimeIcon});
        }
      }
      &__byeol {
        position: relative;
        &:before {
          margin-right: 1px;
          display: inline-block;
          vertical-align: middle;
          width: 16px;
          height: 16px;
          content: '';
          background: url(${PstarIcon});
        }
      }
      &__lastTime {
        display: flex;
        align-items: center;
        position: relative;
        font-weight: 600;
        color: #632beb;
        &:before {
          margin-right: 1px;
          display: inline-block;
          vertical-align: middle;
          width: 16px;
          height: 16px;
          content: '';
          background: url(${PlastTimeIconP});
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
        border: solid 1px #632beb;
        background-color: #632beb;
        &--active {
          color: #632beb;
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
      display: flex;
      align-items: center;
      flex-direction: column;
      width: 300px;
      min-height: 296px;
      background-color: #fff;
      border-radius: 16px;
      .txtCnt {
        position: relative;
        textarea {
          margin-top: 12px;
          border: 1px solid #e0e0e0;
          width: 268px;
          min-height: 160px;
          border-radius: 12px;
          padding: 8px 10px;
          box-sizing: border-box;
          font-size: 14px;
          text-align: left;
          color: #424242;
          &::placeholder {
            font-size: 14px;
            line-height: 1.43;
            letter-spacing: -0.4px;
            text-align: left;
            color: #757575;
          }
        }
        .txtcount {
          position: absolute;
          bottom: 8px;
          right: 10px;
          font-size: 12px;
          line-height: 1.42;
          letter-spacing: normal;
          text-align: left;
          color: #e0e0e0;
        }
      }
      .saveBtn {
        width: 268px;
        margin-top: 16px;
        line-height: 44px;
        border-radius: 12px;
        background-color: #bdbdbd;
        font-size: 16px;
        letter-spacing: normal;
        text-align: center;
        color: #ffffff;
        &--active {
          background-color: #6b36eb;
        }
      }

      header {
        position: relative;
        width: 100%;
        text-align: center;
        border-bottom: 1px solid #eeeeee;
        font-size: 16px;
        font-weight: 800;
        line-height: 44px;
        color: #000000;
        button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: 6px;
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
    margin-top: 10px;
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
