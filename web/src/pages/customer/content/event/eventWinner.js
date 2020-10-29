import React, {useContext, useState, useEffect} from 'react'
import Api from 'context/api'
import {Context} from 'context'
import {useHistory} from 'react-router-dom'
import './eventWinner.scss'
import API from "context/api"
import imgPrize from './img_prize.svg'

export default function eventWinner() {

    const [resultPrize, setResultPrize] = useState([])
    const [resultBoolean, setResultBoolean] = useState('')
    const [winnerRankList, setWinnerRankList] = useState([])
    const [winnerList, setWinnerList] = useState([])
    const history = useHistory()
    const context = useContext(Context)
    const eventIdx = history.location.pathname.split('/')[3]
    const memNo = context.token.memNo
    const [authState, setAuthState] = useState(true)
    const [phone, setPhone] = useState('')
    const eventTitle = history.location.state.title
    const announcementDate = history.location.state.announcementDate


    function dateFormat(num) {
        if(!num) return ''
        var formatNum = ''
        num = num.replace(/\-/gi, '')
        num = num.substr(0,8)
        try {
            if(num.length == 8) {
                formatNum = num.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3')
            }
        } catch(e) {
            formatNum = num
        }
        return formatNum
    }

    const dalReceive = (receiveDal, prizeIdx, state) => {
        context.action.confirm ({
            callback: () => {
                receiveWayClick(prizeIdx, 2, state)
                fnReceiveDal(receiveDal)
            },
            msg : '바로 받으실 경우 추가 입력절차 없이  <br/>' + receiveDal + '달이 즉시 지급됩니다. <br/>' +
                '<p style="margin-top: 16px; font-size:22px; font-weight: bold; color: #632beb;">바로 받으시겠습니까?</p>'
        })
    }

    function fnReceiveDal(receiveDal) {
        context.action.alert({
            msg: receiveDal + ' 달 지급이 완료되었습니다.<br/>내 지갑에서 확인하실 수 있습니다.'
        })
        window.history.back()
    }

    const checkSelfAuth = (prizeIdx, minorYn, state) => {
        async function fetchSelfAuth() {
            const res = await Api.self_auth_check({})
            console.log(res)
            if(res.result === 'success') {
                setAuthState(true)
                setPhone(res.data.phoneNo)
                receiveWayClick(prizeIdx, 1, minorYn, state)
            } else {
                setAuthState(false)
                history.push(`/selfauth?event=/customer/event/${eventIdx}`)

            }
        }
        fetchSelfAuth()
    }


    const receiveWayClick = (prizeIdx, receiveWay_param, minorYn, state) => {
        async function prizeReceiveWay() {
            const {result, data, message} = await API.prizeReceiveWay({
                data: {
                    memNo: memNo,
                    eventIdx: eventIdx,
                    prizeIdx: prizeIdx,
                    receiveWay: receiveWay_param
                }
            })
            if(result === 'success') {
                if(receiveWay_param === 1) {
                    history.push({
                        pathname: `/customer/event/winnerInfo`,
                        state: {
                            eventIdx: eventIdx,
                            prizeIdx: prizeIdx,
                            minorYn: minorYn,
                            state_: state
                        }
                    })
                }
            } else {
                context.action.alert({
                    msg : message
                })
            }
        }
        prizeReceiveWay()
    }

    async function getResultBoolean() {
        const {result, data, message} = await Api.getEventResult({
            data: {
                memNo : memNo,
                eventIdx : eventIdx
            }
        })
        if(data === undefined) {
            setResultBoolean('false')
        } else {
            setResultBoolean('true')
        }
    }

    async function getResult() {
        const {result, data, message} = await Api.getEventResult({
            data: {
                memNo : memNo,
                eventIdx : eventIdx
            }
        })
        if(result === 'success') {
            setResultPrize(data)
        } else {
            context.action.alert({
                msg : message,
                callback: () => {history.push('/')}
            })
        }
    }

    async function getWinner() {
        const {result, data, message} = await API.getEventWinner({
            data: {
                memNo : memNo,
                eventIdx : eventIdx
            }
        })
        console.log(data)

        if (result === 'success') {
            setWinnerRankList(data.rankList)
            setWinnerList(data.resultList)
            let preRank = 0;
            const winnerList = data.resultList.map((data, idx) => {
                if(preRank != data.prizeRank){
                    preRank = data.prizeRank;
                    return data
                }
            })
            setWinnerRankList(winnerList.filter((data) => {
                return data !== undefined
            }))

        } else {
            context.action.alert({
                msg: message
            })
            console.log(data)
        }
    }

    useEffect(() => {
        console.log('winnerRankList', winnerRankList)
    }, [winnerRankList]);

    useEffect(() => {
        getResult()
        getWinner()
        getResultBoolean()
        window.scrollTo(0,0)
    }, []);


    useEffect(()=>{
        if(!context.token.isLogin) history.push('/')
    },[context.token])


    return (
        <React.Fragment>
            <div id="winnerList">
                <div className="resultWrap">
                    <div className="resultBox">
                        <h3 className="title">
                            나의 당첨 결과
                        </h3>

                        {resultBoolean === 'false' &&
                            <div className="resultState">
                                <div className="noResult">당첨된 경품이 없습니다.<br/>다음엔 꼭 당첨되길 빌어요!</div>
                            </div>
                        }

                        {resultBoolean === 'true' && resultPrize.map((item, idx) => {
                            if(!item) return null
                            const{
                                certificationYn
                                , minorYn
                                , prizeIdx
                                , prizeName
                                , prizeSlct
                                , prizeRank
                                , receiveWay
                                , state
                                , receiveDal
                            } = item
                            return (
                                <div className="resultState">
                                    <div className="winResult" key={`resultPrize-${idx}`}>
                                        <>
                                            <img src={imgPrize}/>
                                            <div className="resultPrizeName">
                                                {prizeName}
                                            </div>

                                            {/* 최초 당첨 - 현물 */}
                                            {prizeSlct === 1 && state === 0 &&
                                                <div className="buttonArea">
                                                    <button className="infoButton"
                                                            onClick={() => {
                                                                checkSelfAuth(prizeIdx, minorYn, state)}}>
                                                        배송 정보 입력
                                                    </button>
                                                    <button className="dalButton"
                                                            onClick={() =>
                                                                dalReceive(receiveDal, prizeIdx, state)
                                                            }>달로 바로 받기
                                                    </button>
                                                </div>
                                            }

                                            {/* 최초 당첨 - 달/별 */}
                                            {(prizeSlct === 2 || prizeSlct === 3) && state !== 3 &&
                                            <>
                                                <div className="textAreaBold">
                                                    달/별은 추후 일괄 지급 예정입니다.<br />
                                                </div>
                                                <div className="textArea">
                                                    조금만 기다려주세요.
                                                </div>
                                            </>
                                            }

                                            {/* (현물) 입금 대기 중, 추가 정보 입력 */}
                                            {prizeSlct === 1 && state === 1 &&
                                                <div className="buttonArea">
                                                    <button className="infoButton"
                                                            onClick={() => {
                                                                receiveWayClick(prizeIdx, 1, minorYn, state)
                                                            }}>배송 정보 변경
                                                    </button>
                                                    <button className="dalButton" onClick={() =>
                                                        dalReceive(receiveDal, prizeIdx, state)
                                                    }>달로 바로 받기
                                                    </button>
                                                </div>
                                            }

                                            {/* (현물) 입금 확인 후, 발송 완료 전 */}
                                            {prizeSlct === 1 && state === 2 &&
                                            <>
                                                <div className="textAreaBold">
                                                    경품 발송 준비 중입니다.
                                                </div>
                                                <div className="textArea">
                                                    궁금하신 사항은 고객센터로 문의 바랍니다.
                                                </div>
                                            </>
                                            }

                                            {/* 발송 완료 - 현물, 달/별 */}
                                            {state === 3 &&
                                                <div className="textAreaBold">
                                                    경품 지급 완료.
                                                </div>
                                            }
                                        </>
                                    </div>
                                </div>
                            )
                        })}

                    </div>
                </div>

                <div className="winnerWrap">
                    <div className="eventTitleBox">{eventTitle} 당첨자 명단</div>
                    <div className="eventDateBox">{dateFormat(announcementDate)}</div>
                    <ul className="winner-list">
                        {winnerRankList.map((rank, rankIdx) => {
                            return (
                                <li key = {`winner-${rankIdx}`}>
                                    <div className="winnerTextArea">{rank.prizeName}</div>
                                    <ul className="winnerUser-list">
                                    {winnerList.map((item, idx) => {
                                        if(rank.prizeRank == item.prizeRank) {
                                            return (
                                                <li className="winnerUser-item" key={`user-${idx}`}>
                                                    <span className="winnerNick">{item.nickName}</span>
                                                </li>
                                            )
                                        }
                                    })}
                                    </ul>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </React.Fragment>
    )
}