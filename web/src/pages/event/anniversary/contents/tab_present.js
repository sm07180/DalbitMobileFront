import React, {useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import {Context} from 'context'

import PresentPop from './pop_present'
import LayerPopupExp from './layer_popup_exp'

export default function anniversaryEventPresnet(){
    const [presentPop, setPresentPop] = useState(false)
    const [popupExp, setPopupExp] = useState(false)
    const [rcvDalCnt, setRcvDalCnt] = useState(0)
    const globalCtx = useContext(Context)
    const {token} = globalCtx
    const history = useHistory()
    
    async function eventOneYearCheck() {
        const {result, message} = await Api.postEventOneYearCheck()
        if (result === 'success') {
            eventOneYearInsert()
        }else {
            globalCtx.action.alert({
                msg: message
              })
        }
    }
    async function eventOneYearInsert() {
        const {result, message, data} = await Api.postEventOneYearInsert()
        if (result === 'success') {
            setPresentPop(true)
            console.log(data.rcvDalCnt)
            setRcvDalCnt(data.rcvDalCnt)
        }else {
            console.log(message);
        }
    }
    const onReceivePresent = () => {
        if (!token.isLogin) {
            globalCtx.action.alert({
              msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
              callback: () => {
                history.push({
                  pathname: '/login',
                  state: {
                    state: 'event/anniversary'
                  }
                })
              }
            })
        }else{
            if (globalCtx.profile.level >= 5) {
                if (globalCtx.selfAuth === false) {
                    globalCtx.action.alert({
                        msg: `본인인증 후 참여해주세요.`,
                        callback: () => {
                        history.push('/selfauth?event=/event/anniversary')
                        }
                    })
                }else {eventOneYearCheck()}                
            }else {eventOneYearCheck()}
        }
    }

    return(
        <>
            <div className="tabContentWrap">
                <img src="https://image.dalbitlive.com/event/anniversary/present.png" className="contentImg" />
                <button className="button_present">
                    <img src="https://image.dalbitlive.com/event/anniversary/btn_present.png" className="button_img"  onClick={() => onReceivePresent()}/>
                </button>
                <button className="button_level" onClick={() => setPopupExp(true)}>레벨 올리는 방법 알아보기
                </button>
            </div>
            <div className="notice">
                <div className="notice_title">
                    <span className="exclamation">!</span>이벤트 유의사항
                </div>
                <ul className="notice_list">
                    <li>- 선물은 1인 1번만 지급됩니다.</li>
                    <li>- 휴대폰 인증 후 선물이 지급됩니다.</li>
                    <li>- 부정한 방법으로 선물 수령시 회수 조치 및 제재될 수 있습니다.</li>
                    <li>- 휴대폰 번호가 없는 해외 회원의 경우 1:1 문의로 별도 문의해주세요.</li>
                    <li>- 댓글 이벤트 결과는 0월 0일 공지사항에서 확인할 수 있습니다.</li>
                </ul>
            </div>
            {presentPop && <PresentPop setPresentPop={setPresentPop} rcvDalCnt={rcvDalCnt}/>}
            {popupExp && <LayerPopupExp setPopupExp={setPopupExp} />}
        </>
        )
}