import React, {useState, useEffect, useContext, useMemo, useRef} from 'react'
import {useHistory} from 'react-router-dom'

// global components
import InputItems from '../../../../components/ui/inputItems/InputItems'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
import PopSlide, {closePopup} from 'components/ui/popSlide/PopSlide'
import Api from "context/api";
import {useDispatch, useSelector} from "react-redux";
import {setSlidePopupOpen} from "redux/actions/common";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";
// components

const MyAccount = (props) => {
  const {repplySubmit, accountList, setAccountList, getMyAccountData, recent_exchangeIndex} = props;

  const history = useHistory();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const {profile, splash} = globalState;

  const [slideData, setSlideData] = useState({});
  const [listShow, setListShow] = useState(false);
  const [modifySlidePop, setModifySlidePop] = useState(true);


  const popup = useSelector(state => state.popup);

  const formInit = {
    recent_accountName: '' //예금주 (계좌추가탭에서 추가한 리스트 눌렀을때)
    ,recent_bankCode: 0    //최근 거래 은행 (계좌추가탭에서 추가한 리스트 눌렀을때)
    ,recent_accountNo: '' //최근 거래 계좌번호 (계좌추가탭에서 추가한 리스트 눌렀을때)
    ,recent_socialNo:''   //주민등록번호
    ,recent_phoneNo:''    //휴대폰번호
    ,recent_address1:''   //주소
    ,recent_address2:''   //상세주소
    ,bankName:'은행선택'
    ,idx: -1
  }
  const [exchangeForm, setExchangeForm] = useState(formInit);
  const prevState = useRef(formInit);


  const bankList = useMemo(() => {
    if (splash !== null) {
      return [...splash.exchangeBankCode];  //{cd: '0', cdNm: '은행선택'}
    } else {
      return [];
    }
  }, [splash]);

  // 계좌 추가
  const onClickAddAcount = () => {
    dispatch(setSlidePopupOpen());
    setSlideData({})
    setExchangeForm(formInit);          // 추가시 디폴트 폼으로 세팅
    prevState.current = exchangeForm;   //이전 state 유지용
    setModifySlidePop(false); //추가
  }

  // 계좌 수정
  const onClickModifyAcount = (exchangeForm) => {
    dispatch(setSlidePopupOpen());
    setSlideData(exchangeForm);
    setExchangeForm(exchangeForm);    //계좌목록중에서 선택한 값 세팅
    prevState.current = exchangeForm; //이전 state 유지용
    setModifySlidePop(true);  //등록
  }

  //blur
  const selectBoxRef = useRef(null);
  const clickEvent = (e) => {
    if (selectBoxRef.current !== e.target) {
      //blur로 판단
      setListShow(false);
    }
  }

  useEffect(() => {
    document.body.addEventListener('click', clickEvent);
    return () => {
      document.body.removeEventListener('click', clickEvent);
    };
  },[]);

  const closePop = () => {
    setSlideData({})
    closePopup(dispatch);
  }

  //등록
  async function fetchAddAccount() {
    const res = await Api.exchangeAddAccount({
      data: {
        accountName: exchangeForm?.recent_accountName,
        accountNo: exchangeForm?.recent_accountNo,
        bankCode: exchangeForm?.recent_bankCode,
        bankName: exchangeForm?.bankName
      }
    });
    const {result, data, message} = res;

    //팝업 닫기
    closePop();
    setExchangeForm(formInit);
    if (result === 'success') {
      getMyAccountData();
      dispatch(setGlobalCtxMessage({type: "toast",
        msg: message
      }))
    } else {
      dispatch(setGlobalCtxMessage({type: "alert",
        msg: message,
      }))
    }
  }

  //삭제
  async function fetchDeleteAccount({deleteIdx}) {
    const res = await Api.exchangeDeleteAccount({
      data: {
        idx: deleteIdx,
        beforeAccountNo: exchangeForm?.recent_accountNo
      }
    });
    const {result, data, message, messageKey} = res;

    //팝업 닫기
    closePop();
    if (result === 'success') {
      getMyAccountData();
      dispatch(setGlobalCtxMessage({type: "alert",
        msg: message
      }));
    } else {
      if(messageKey === "exchange.my.account.number.delete.impossible"){
        dispatch(setGlobalCtxMessage({type: "alert",
          msg: '환전신청 또는 승인 정보로\n삭제가 불가합니다.'
        }));
      }else {
        dispatch(setGlobalCtxMessage({type: "alert",
          msg: message
        }));
      }
    }
  }

  //수정
  async function fetchModiAccount({modifyIdx, prevAccountNo}) {
    const res = await Api.exchangeEditAccount({
      data: {
        accountName: exchangeForm?.recent_accountName,
        accountNo: exchangeForm?.recent_accountNo,
        bankCode: exchangeForm?.recent_bankCode,
        bankName: exchangeForm?.bankName,
        beforeAccountNo: prevAccountNo,
        idx: modifyIdx
      }
    });
    const {result, data, message, messageKey} = res;

    //팝업 닫기
    closePop();
    setExchangeForm(formInit);
    if (result === 'success') {
      getMyAccountData();
      dispatch(setGlobalCtxMessage({type: "alert",
        msg: message
      }));
    } else {
      if(messageKey === "exchange.my.account.number.delete.impossible"){
        dispatch(setGlobalCtxMessage({type: "alert",
          msg: '환전신청 또는 승인 정보로\n삭제가 불가합니다.'
        }));
      }else {
        dispatch(setGlobalCtxMessage({type: "alert",
          msg: message
        }));
      }
    }
  }

  const slideOptionListView = (listShow &&
    <div className="selectWrap">
      {bankList.map((item, index) =>
        <div key={index} className="option"
             onClick={(e) => {
               e.stopPropagation();
               //단순 화면 표기용
               setListShow(false);
               //계좌 폼 정보
               setExchangeForm({...exchangeForm, bankCode: item.cd, bankName: item?.cdNm});
             }}
        >{item.cdNm}</div>
      )}
    </div>);

  //환전신청 조건 실패시 true!
  const vaildationFaild = useMemo(() => {
    const {recent_accountName, recent_accountNo, recent_bankCode} = exchangeForm;
    return !(recent_exchangeIndex > 0) || !recent_accountName || !recent_accountNo || !recent_bankCode;
  },[exchangeForm]);

  return (
    <>
      {accountList.length === 0?
      <div className="formBox empty">
        <p>등록된 내 계좌가 없어요.</p>
        <button className='addAccountBtn' onClick={onClickAddAcount}>+ 계좌추가</button>
      </div>
      :
      <div className="formBox">
        {accountList.map((data, index) => {
          const accountData = {...exchangeForm, recent_accountName: data.accountName, recent_accountNo: data.accountNo,
            recent_bankCode: data.bankCode, bankName: data.bankName, idx: data.idx};
          return(
          <div key={index} className={`accountList ${exchangeForm?.idx === data?.idx && 'active'}`}
               onClick={() => setExchangeForm(accountData)}>
            <div className="content">
              <div className="name">{data?.accountName}</div>
              <div className="account">
                {`${data?.bankName} ${data?.accountNo?.concat([]).slice(0, 3)}-${data?.accountNo?.concat([]).slice(3, 7)}-${data?.accountNo?.concat([]).slice(7, 11)}-${data?.accountNo?.concat([]).slice(11, data?.accountNo.length)}`}
              </div>
            </div>
            <span className="iconEdit"
                  onClick={() => onClickModifyAcount(accountData) }/>
          </div>);
        })
        }
          <button className='addAccountBtn haveList' onClick={onClickAddAcount}>+ 계좌추가</button>
          <SubmitBtn text="환전 신청하기" state={vaildationFaild ? 'disabled' : ''} onClick={() =>{repplySubmit(exchangeForm)}}/>
      </div>
      }

      {/* 수정, 추가시 팝업*/}
      {popup.commonPopup &&
        <PopSlide setPopSlide={()=>{setExchangeForm(prevState.current)}}>
          <section className="addAcount">
            {modifySlidePop === true ?
            <>
              <h3>계좌 수정</h3>
              <div className="formBox">
                <div className="listRow">
                  <InputItems title="예금주">
                    <input type="text" placeholder="" defaultValue={slideData?.recent_accountName}
                           onChange={(e) => {
                             setExchangeForm({...exchangeForm, recent_accountName: e.target.value});
                           }}/>
                  </InputItems>
                </div>
                <div className="listRow">
                  <InputItems title="은행">
                    <div className="select" ref={selectBoxRef}
                         onClick={()=> setListShow(true)}>{exchangeForm?.bankName || slideData?.bankName}</div>
                    {slideOptionListView}
                  </InputItems>
                </div>
                <div className="listRow">
                  <InputItems title="계좌번호">
                    <input type="number" placeholder="" defaultValue={slideData?.recent_accountNo}
                           onChange={(e) => {
                             const num = e.target.value;
                             if(!Number.isNaN(Number(num))) {
                               if (num?.length < 21) {
                                 setExchangeForm({...exchangeForm, recent_accountNo: num})
                               } else {
                                 e.target.value = exchangeForm?.recent_accountNo;
                               }
                             } else {
                               e.target.value = exchangeForm?.recent_accountNo;
                             }
                           }}/>
                  </InputItems>
                </div>
              </div>
              <div className="buttonGroup">
                <button className="cancel"
                        onClick={() => fetchDeleteAccount({deleteIdx: slideData?.idx,})}
                >삭제</button>
                <button className="apply"
                        onClick={() =>
                          fetchModiAccount({
                            modifyIdx: slideData?.idx,
                            prevAccountNo: slideData?.recent_accountNo
                          })}
                >수정
                </button>
              </div>
            </>
            :
            <>
              <h3>계좌 추가</h3>
              <div className="formBox">
                <div className="listRow">
                  <InputItems title="예금주">
                    <input type="text" placeholder=""
                           onChange={(e) => {
                             setExchangeForm({...exchangeForm, recent_accountName: e.target.value});
                           }}
                    />
                  </InputItems>
                </div>
                <div className="listRow">
                  <InputItems title="은행">
                    <div className="select" ref={selectBoxRef}
                         onClick={()=> setListShow(true)}
                    >{exchangeForm?.bankName}</div>
                    {slideOptionListView}
                  </InputItems>
                </div>
                <div className="listRow">
                  <InputItems title="계좌번호">
                    <input type="number" placeholder=""
                           onChange={(e) => {
                             const num = e.target.value;
                             if(!Number.isNaN(Number(num))) {
                               if (num?.length < 21) {
                                 setExchangeForm({...exchangeForm, recent_accountNo: num})
                               } else {
                                 e.target.value = exchangeForm?.recent_accountNo;
                               }
                             } else {
                               e.target.value = exchangeForm?.recent_accountNo;
                             }
                           }}
                    />
                  </InputItems>
                </div>
              </div>
              <div className="buttonGroup">
                <button className="cancel"
                        onClick={() => {
                          closePop();
                          setExchangeForm(prevState.current);
                        }}
                >취소
                </button>
                <button className="apply" onClick={() => fetchAddAccount()}>적용</button>
              </div>
            </>
            }
          </section>
        </PopSlide>
      }
    </>
  )
}

export default MyAccount
