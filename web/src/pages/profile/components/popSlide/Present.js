import React, {useContext, useState} from 'react'
import Utility from 'components/lib/utility'
// global components
import InputItems from 'components/ui/inputItems/InputItems'
// components

import './style.scss'
import {useHistory} from "react-router-dom";
import {Context} from "context";

const blockReportTabmenu = ['차단하기','신고하기']

const dalList = [50, 100, 500, 1000, 2000, 3000, 5000, 10000];

const Present = (props) => {
  const { profileData, closePresentPop } = props
  const context = useContext(Context);
  const history = useHistory();
  const [selected, setSelected] = useState(0);

  const goCharge = () => {
    history.push('/pay/store')
  }

  return (
    <section className="present">
      <h2>선물하기</h2>
      <div className="message">
        <strong>{profileData.nickNm}</strong>님에게<br/>
        달을 선물하시겠습니까?
      </div>
      <div className="payBox">
        <div className="possess">
          <span>내가 보유한 달</span>
          <div className="count">{Utility.addComma(context.profile.dalCnt)}</div>
        </div>
        <button onClick={goCharge}>충전하기</button>
      </div>
      <div className="payCount">
        {dalList.map((item,index) => {
          return (
            <button key={index}
                    className={`${selected === index ? 'active' : ''}`}
                    onClick={() => setSelected(index)}>
              {Utility.addComma(item)}
            </button>
          )
        })}

      </div>
      <InputItems>
        <input type="number" placeholder='직접입력' />
      </InputItems>
      <span className='log'>달은 10개 이상부터 선물이 가능합니다.</span>
      <div className="buttonGroup">
        <button className='cancel' onClick={closePresentPop}>취소</button>
        <button className={false ? 'active' : 'disabled'}>선물하기</button>
      </div>
    </section>
  )
}

export default Present
