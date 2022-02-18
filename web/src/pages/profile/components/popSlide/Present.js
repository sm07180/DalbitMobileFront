import React, {useContext, useRef, useState} from 'react'
import Utility from 'components/lib/utility'
// global components
import InputItems from '../../../../components/ui/inputItems/InputItems';
// components
import './style.scss'
import {useHistory} from "react-router-dom";
import {Context} from "context";
import UseInput from "common/useInput/useInput";
import Api from "context/api";

const dalList = [50, 100, 500, 1000, 2000, 3000, 5000, 10000];
const MIN_DAL_CNT = 10;

const Present = (props) => {
  const { profileData, setPopPresent } = props
  const context = useContext(Context);
  const history = useHistory();
  const [selected, setSelected] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const numberRestrict = /^[0-9\b]+$/;
  const presentInputRef = useRef();

  const goCharge = () => {
    history.push('/store')
  }

  /* 달 입력란 focus */
  const focusAction = () => {
    setSelected(-1);
  }

  /* 달 입력란 blur */
  const blurAction = () => {
    const toNumber = parseInt(inputValue);
    if(!isNaN(toNumber)) {
      setInputValue(toNumber.toString());
    }else {
      setInputValue('');
    }
  }

  /* 달 선물 리스트 클릭 */
  const dalBtnAction = (index) => {
    setSelected(index)
    setInputValue('');
  }

  /* 선물 입력란 체크 */
  const presentInputValidator = (value) => {
    const isNumber = value.length === 0 || numberRestrict.test(value); // 숫자만
    const lengthCheck = value.length <= 5; // 최대 5자리

    return isNumber && lengthCheck;
  }

  /* 선물하기 버튼 이벤트 */
  const dalGiftAction = () => {
    if(selected > -1) {
      dalGiftApiAction(dalList[selected]);
      setPopPresent(false);
    }else if(parseInt(inputValue) >= 10){
      dalGiftApiAction(inputValue);
      setPopPresent(false);
    }else {
      context.action.alert({
        msg: `달은 ${MIN_DAL_CNT}개 이상부터 선물이 가능합니다.`
      })
    }
  }

  /* 선물하기 api */
  const dalGiftApiAction = (dalCount) => {
    const targetMemNo = profileData.memNo;
    const myMemNo = context.profile.memNo;
    const data = {
      memNo: targetMemNo,
      dal: dalCount
    }
    Api.member_gift_dal({data}).then(res => {
      if (res.result === 'success') {
        context.action.alert({
          callback: () => {
            async function updateMyPofile() {
              const profileInfo = await Api.profile({params: {memNo: myMemNo}})
              if (profileInfo.result === 'success') {
                context.action.updateProfile(profileInfo.data)
              }
            }
            updateMyPofile()
          },
          msg: res.message
        })
      } else if (res.result === 'fail' && res.code === '-4') {
        context.action.confirm({
          msg: res.message,
          buttonText: {
            right: '충전하기'
          },
          callback: () => {
            history.push('/store')
          }
        })
      } else {
        context.action.alert({
          msg: res.message
        })
      }
    })
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
                    onClick={() => dalBtnAction(index)}>
              {Utility.addComma(item)}
            </button>
          )
        })}
      </div>
      <InputItems>
        <UseInput forwardedRef={presentInputRef}
                  placeholder="직접입력"
                  validator={presentInputValidator}
                  focus={focusAction}
                  blur={blurAction}
                  value={inputValue}
                  setValue={setInputValue}
        />
      </InputItems>
      <span className='log'>달은 {MIN_DAL_CNT}개 이상부터 선물이 가능합니다.</span>
      <div className="buttonGroup">
        <button className='cancel' onClick={() => setPopPresent(false)}>취소</button>
        <button className={(selected > -1 || parseInt(inputValue) >= MIN_DAL_CNT) ? 'active' : 'disabled'}
                onClick={dalGiftAction}
        >선물하기</button>
      </div>
    </section>
  )
}

export default Present
