import React, {useState, useRef, useEffect, useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import PresentPop from './pop_present'
import LayerPopupExp from './layer_popup_exp'
import Api from 'context/api'
import {Context} from 'context'

export default function anniversaryEventPresnet(){
    const [presentPop, setPresentPop] = useState(false)
    const [popupExp, setPopupExp] = useState(false);
    const globalCtx = useContext(Context)
    const history = useHistory()

    async function eventOneYearCheck() {
        const {result, message} = await Api.postEventOneYearCheck()
        if (result === 'success') {
            eventOneYearInsert()
        }else {
            alert(message)
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
                <button className="tabContentWrap__button present">
                    <img src="https://image.dalbitlive.com/event/anniversary/btn_present.png" className="button__img"  onClick={() => onReceivePresent()}/>
                </button>
                <button className="tabContentWrap__button level">
                    <img src="https://image.dalbitlive.com/event/anniversary/btn_level.png" className="button__img"  onClick={() => setPopupExp(true)}/>
                </button>
            </div>
            <img src="https://image.dalbitlive.com/event/anniversary/notice.png" className="notice"/>
            {presentPop && <PresentPop setPresentPop={setPresentPop}/>}
            {popupExp && <LayerPopupExp setPopupExp={setPopupExp} />}
        </>
    )
}