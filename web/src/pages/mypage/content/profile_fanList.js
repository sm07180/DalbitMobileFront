import React, {useEffect, useState, useContext, useRef} from 'react'
import styled from 'styled-components'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import {COLOR_MAIN} from 'context/color'
import Api from 'context/api'
import {Context} from 'context'
import {Scrollbars} from 'react-custom-scrollbars'
export default props => {
  //context------------------------------------------
  const {reportShow} = props
  const context = useContext(Context)
  const ctx = useContext(Context)
  const urlrStr = props.location.pathname.split('/')[2]
  const {profile} = props

  const myProfileNo = ctx.profile.memNo

  const [rankInfo, setRankInfo] = useState('')
  console.log(rankInfo)
  const [select, setSelect] = useState('')
  const [active, setActive] = useState(false)
  const [allFalse, setAllFalse] = useState(false)

  //scroll
  const scrollbars = useRef(null)
  const area = useRef()
  //3.버튼info 배열 --------------------------------------
  //api
  const fetchData = async () => {
    const res = await Api.mypage_fan_ranking({
      params: {
        memNo: urlrStr,
        page: 1,
        records: 100
      }
    })
    if (res.result === 'success') {
      setRankInfo(res.data.list)
      console.log(res)
      //   context.action.alert({
      //     callback: () => {
      //       context.action.updateMypageReport(false)
      //     },
      //     msg: profile.nickNm + '님을 신고 하였습니다.'
      //   })
    } else {
      console.log(res)
      //   context.action.alert({
      //     callback: () => {
      //       context.action.updateMypageReport(false)
      //     },
      //     msg: '이미 신고한 회원 입니다.'
      //   })
    }

    return
  }

  useEffect(() => {
    fetchData()
  }, [select])

  //api

  // context.action.updateMypageReport(false)
  //버튼map
  //   console.log(rankInfo)
  //   const Reportmap = rankInfo.map((item, index) => {
  //     const {title, id} = item
  //     return <div>asdas</div>
  //   })

  //scroll function
  const scrollOnUpdate = () => {
    let thisHeight = ''
    if (document.getElementsByClassName('round')[0]) {
      thisHeight = document.getElementsByClassName('round')[0].offsetHeight + 18
      area.current.children[1].children[0].style.maxHeight = `calc(${thisHeight}px)`
    }
  }
  const Regist = memNo => {
    async function fetchDataFanRegist(memNo) {
      const res = await Api.fan_change({
        data: {
          memNo: memNo
        }
      })
      if (res.result === 'success') {
        setSelect(memNo)
        //context.action.updateMypageFanCnt(myProfileNo)
        //console.log(res.data)
      } else if (res.result === 'fail') {
        console.log(res)
      }
    }
    fetchDataFanRegist(memNo)
    //   const fanRegist = myProfileNo => {
    //     fetchDataFanRegist(myProfileNo)
    //   }
  }
  // background: url(${IMG_SERVER}/images/common/ic_close_m@2x.png) no-repeat center center / cover;
  //------------------------------------------------------------
  return (
    <>
      <FixedBg className={allFalse === true ? 'on' : ''} ref={area}>
        <div className="wrapper">
          <button className="close" onClick={() => context.action.updateClose(false)}></button>
          <Scrollbars ref={scrollbars} autoHeight autoHeightMax={'100%'} onUpdate={scrollOnUpdate} autoHide>
            <div className="scrollWrap">
              <Container>
                <div className="reportTitle"></div>
                <h2>팬 랭킹</h2>
                {rankInfo !== '' &&
                  rankInfo.map((item, index) => {
                    const {title, id, profImg, nickNm, isFan, memNo} = item
                    return (
                      <>
                        <List>
                          <Photo bg={profImg.thumb62x62}></Photo>
                          <span>{nickNm}</span>
                          {isFan === false && (
                            <button onClick={() => Regist(memNo)} className="plusFan">
                              +팬등록
                            </button>
                          )}
                          {isFan === true && <button>팬</button>}
                        </List>
                      </>
                    )
                  })}
              </Container>
            </div>
          </Scrollbars>
        </div>
      </FixedBg>
      {/* <Dim onClick={() => context.action.updateClose(false)}></Dim> */}
    </>
  )
}
//----------------------------------------
//styled
const Dim = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 24;
`

const List = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 7px;
  > span {
    flex: none;
    display: block;
    margin-left: 10px;
    line-height: 40px;
    font-size: 14px;
    color: #424242;
    transform: skew(-0.03deg);
    letter-spacing: -0.35px;
  }
  > button {
    flex: none;
    margin-left: auto;
    width: 53px;
    height: 26px;
    border: 1px solid ${COLOR_MAIN};
    font-size: 12px;
    line-height: 1.2;
    letter-spacing: -0.3px;
    border-radius: 13px;
    transform: skew(-0.03deg);
    color: ${COLOR_MAIN};
  }
  .plusFan {
    background-color: ${COLOR_MAIN};
    color: #fff;
  }
`
const Photo = styled.div`
  flex: none;
  width: 40px;
  height: 40px;
  background: url(${props => props.bg}) no-repeat center center/cover;
  border-radius: 50%;
`

const FixedBg = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 83.33%;

  background-color: rgba(0, 0, 0, 0.5);
  z-index: 24;

  .wrapper {
    &:after {
      content: '';
      clear: both;
      display: block;
    }
    .close {
      display: block;
      float: right;
      margin-right: calc(16.67% - 36px);
      width: 36px;
      height: 36px;
      background: url(${IMG_SERVER}/images/common/ic_close_m@2x.png) no-repeat center center / cover;
    }

    & .scrollCustom {
      & > div:nth-child(3) {
        position: relative;
        width: 10px !important;
        height: auto;
      }
    }
  }
  .scrollWrap {
    width: 100vw;
    max-height: 500px;
  }
  &.on {
    display: none;
  }
  .btnWrap {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
`
const Container = styled.div`
  padding: 12px;

  margin: 0 auto;
  display: flex;
  background-color: #fff;
  /* align-items: center; */
  flex-direction: column;
  justify-content: center;
  border-radius: 10px;
  & h2 {
    margin-top: 14px;
    margin-bottom: 20px;
    color: #424242;
    font-size: 20px;
    font-weight: 800;
    text-align: center;
    letter-spacing: -0.4px;
    transform: skew(-0.03deg);
    & > span {
      color: ${COLOR_MAIN};
    }
  }
  & p {
    margin: 12px 0 20px 0;
    color: #616161;
    font-size: 14px;
    letter-spacing: -0.35px;
    text-align: left;
    transform: skew(-0.03deg);
  }
`
const BTN = styled.button`
  display: block;
  width: 100%;
  margin-top: 4px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 8px 0;
  color: #616161;
  font-size: 12px;
  transform: skew(-0.03deg);
  outline: none;
  &.on {
    border: 1px solid ${COLOR_MAIN};
    color: ${COLOR_MAIN};
    font-weight: 600;
  }
`
const SubmitBTN = styled.button`
  display: block;
  width: calc(50% - 4px);
  margin-top: 12px;
  padding: 16px 0;
  border-radius: 10px;
  background-color: #bdbdbd;
  font-size: 14px;
  color: #fff;
  letter-spacing: -0.4px;
  :first-child {
    background-color: #fff;
    border: solid 1px ${COLOR_MAIN};
    color: ${COLOR_MAIN};
  }
  &.on {
    background-color: ${COLOR_MAIN};
  }
`
