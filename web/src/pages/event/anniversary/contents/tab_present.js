import React, {useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import {Context} from 'context'

import PresentPop from './pop_present'
import LayerPopupExp from './layer_popup_exp'

export default function anniversaryEventPresnet(){
    const [presentPop, setPresentPop] = useState(false)
    const [popupExp, setPopupExp] = useState(false)
    const globalCtx = useContext(Context)
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
        const {result, message} = await Api.postEventOneYearInsert()
        if (result === 'success') {
            setPresentPop(true)
        }else {
            console.log(message);
        }
    }
    const onReceivePresent = () => {
        if (globalCtx.selfAuth === false) {
            globalCtx.action.alert({
                msg: `본인인증 후 참여해주세요.`,
                callback: () => {
                history.push('/selfauth?event=/event/anniversary')
                }
            })
        }else {
            eventOneYearCheck()
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
            <img src="https://image.dalbitlive.com/event/anniversary/notice.png" className="notice" alt="이벤트 유의사항"/>
            {presentPop && <PresentPop setPresentPop={setPresentPop}/>}
            {popupExp && <LayerPopupExp setPopupExp={setPopupExp} />}
        </>
    )
}