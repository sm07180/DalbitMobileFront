import React, {useState, useEffect,useContext} from 'react'
import {Context} from 'context'

// global components
import InputItems from '../../../../components/ui/inputItems/InputItems'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
// components

const NewlyAccount = (props) => {
  const {repplySubmit, exchangeForm, setExchangeForm} = props;
  //context
  const context = useContext(Context);
  const {profile} = context;

  return (
    <>
      <form className="formBox">
        <div className="listRow">
          <div className="title">예금주</div>
          <InputItems>
            <div className="text" value={exchangeForm?.recent_accountName}/>
          </InputItems>
        </div>
        <div className="listRow">
          <div className="title">은행</div>
          <InputItems>
            <div className="text" value={exchangeForm?.recent_accountName}/>
          </InputItems>
        </div>
        <div className="listRow">
          <div className="title">계좌번호</div>
          <InputItems>
            <div className="text" value={exchangeForm?.recent_accountNo}/>
          </InputItems>
        </div>

        {/*주민등록번호*/}
        {exchangeForm?.recent_socialNo &&
        <div className="listRow">
          <div className="title">주민등록번호</div>
          <div className="inputGroup">
            {/* 주민번호 앞자리*/}
            <InputItems>
              <div className="text">{exchangeForm?.recent_socialNo?.concat([]).slice(0, 6)}</div>
            </InputItems>
            <span className='line'>-</span>

            {/* 주민번호 뒷자리*/}
            <InputItems>
              <div className="text">●●●●●●●</div>
            </InputItems>
          </div>
        </div>
        }

        {exchangeForm?.recent_phoneNo &&
        <div className="listRow">
          <div className="title">휴대폰 번호</div>
          <InputItems>
            <div className="text">{exchangeForm?.recent_phoneNo}</div>
          </InputItems>
        </div>
        }

        {(exchangeForm?.recent_address1 || exchangeForm?.recent_address2) &&
        <div className="listRow address">
          <div className="title">주소</div>
          <InputItems>
            <div className="text">{exchangeForm?.recent_address1} {exchangeForm?.recent_address2}</div>
          </InputItems>
        </div>
        }

        {/*disabled*/}
        {/*todo submit -> validation*/}

        <SubmitBtn text="환전 신청하기" state=""
                   onClick={()=>{repplySubmit()}}/>
      </form>
    </>
  )
}

export default NewlyAccount