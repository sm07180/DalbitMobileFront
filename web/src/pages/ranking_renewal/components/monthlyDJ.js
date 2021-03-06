import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'

export default () => {
  const history = useHistory()

  const [tooltipPop, setTooltipPop] = useState(false);

  const togglePopup = () =>{
    setTooltipPop(!tooltipPop);
  }


  return (
    <>
        <div className="monthlyDJWrap">
            <div className="monthlyDJ">
                <div className="contentWrap">
                    <div className="title">
                    π€ μκ° DJλ­νΉ νν!
                    </div>
                    <div className="content">
                    λ­νΉ 5μκΉμ§ μ μ²΄ νμ λμ νΈμ λ°μ‘ μ§μ
                    </div>
                </div>
                <div className="btn" onClick={togglePopup}>
                    μμΈν
                    {tooltipPop && (
                        <div className="monthlyDJ__tooltip" value='false'>
                            λ­νΉ 5μκΉμ§ μ΅μ’ μ μ λ DJλ<br/>
                            <span className="monthlyDJ__tooltip-strong">μ μ²΄ νμ λμ νΈμλ₯Ό 1ν</span> λ³΄λΌ μ μμ΅λλ€. 1:1λ¬Έμλ₯Ό
                            ν΅ν΄ μ μ²­ κ°λ₯νλ©° μμΈν λ΄μ©μ κ³΅μ§μ¬ν­μ νμΈνμΈμ.
                            <img className="monthlyDJ__tooltip-btnClose" onClick={togglePopup} src="https://image.dalbitlive.com/svg/close_g_l.svg" alt="λ«κΈ°" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    </>
  )
}
