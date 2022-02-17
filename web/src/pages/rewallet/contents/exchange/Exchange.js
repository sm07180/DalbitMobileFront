import React, {useEffect, useState} from 'react'
import Utility from 'components/lib/utility'

// global components
// components
import Tabmenu from '../../components/tabmenu'
// contents
import DepositInfo from './DepositInfo'
import NewlyAccount from './NewlyAccount'
import MyAccount from './MyAccount'
import {useHistory} from "react-router-dom";
import Api from "context/api";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage, setGlobalCtxWalletAddData} from "redux/actions/globalCtx";

const Exchange = (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const depositTabmenu = ['신규 정보', '최근 계좌', '내 계좌'];

  const [depositType, setDepositType] = useState(depositTabmenu[2]);
  const history = useHistory();
  const {profile, walletData} = globalState;
  const {byeolTotCnt, dalTotCnt} = walletData;
  const [calcFormShow, setCalcFormShow] = useState(false);

  useEffect(() => {
    if (byeolTotCnt === 0 || dalTotCnt === 0) {
      dispatch(setGlobalCtxWalletAddData({dalTotCnt: profile?.dalCnt || 0, byeolTotCnt: profile?.byeolCnt || 0}));
    }
  },[profile]);

  const [exchangeCalcData, setExchangeCalcData] = useState({
    reqByeolCnt: 0// 환전 신청할 별 갯수
  });

  const [exchangeForm, setExchangeForm] = useState({
    accountName : '' //예금주
    ,bankCode: 0  //은행
    ,accountNo: ''//계좌번호
    ,socialNo:''  //주민등록번호
    ,phoneNo:''   //휴대폰번호
    ,address1:''  //주소
    ,address2:''  //주소
    ,addFile1:''  //신분증사본
    ,addFile2:''  //통장사본
    ,addFile3:''  //미성년자인 경우 부모님 동의

    ,agree: false  //3자 제공 동의 (단순 체크 확인로직 처리 api 전송 x)
    ,zoneCode: ''  //우편번호 폼 단순 표기용
  });

  //환전 계산하기
  const exchangeCalc = async (sendByeolCnt = 0) => {
    if (sendByeolCnt < 570) {
      dispatch(setGlobalCtxMessage({type: "alert", msg: '환전 신청별은\n570개 이상이어야 합니다.'}));
    } else if (sendByeolCnt > byeolTotCnt) {
      dispatch(setGlobalCtxMessage({type: "alert", msg: '환전 신청별은\n보유 별보다 같거나 작아야 합니다.'}))
      return;
    } else {
      const res = await Api.exchangeCalc({
        data: {byeol: sendByeolCnt}
      })
      if (res.result === 'success') {
        setExchangeCalcData({...exchangeCalcData, ...res.data});
        setCalcFormShow(true);
      }
    }
  };

  //파일 첨부
  const uploadSingleFile = (e, idx) => {
    e.persist();
    const target = e.currentTarget
    if (target.files.length === 0) return
    let reader = new FileReader()
    const file = target.files[0]
    const fileName = file.name

    const fileSplited = fileName.split('.');
    const fileExtension = fileSplited.pop().toLowerCase();
    //
    const extValidator = (ext) => {
      const list = ['jpg', 'jpeg', 'png', 'PNG']
      return list.includes(ext)
    }
    if (!extValidator(fileExtension)) {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: 'jpg, png 이미지만 사용 가능합니다.',
        callback: () => {
          dispatch(setGlobalCtxMessage({type: "alert", visible: false}))
        }
      }));
      return;
    }
    reader.readAsDataURL(target.files[0]);
    reader.onload = async () => {
      if (reader.result) {
        const res = await Api.image_upload({
          data: {dataURL: reader.result, uploadType: 'exchange'}
        })
        if (res.result === 'success') {

          setExchangeForm({...exchangeForm, [`addFile${idx + 1}`]: {path: res.data.path, name: fileName}});
          // const arr = state.files.map((v, i) => {
          //   if (i === idx) {
          //     return {path: res.data.path, name: fileName}
          //   } else {
          //     return v
          //   }
          // })
          // dispatch({type: 'file', val: arr})
        } else {
          dispatch(setGlobalCtxMessage({
            type: "alert",
            msg: '사진 업로드에 실패하였습니다.\n다시 시도해주세요.',
            callback: () => {
              dispatch(setGlobalCtxMessage({type: "alert", visible: false}))
            }
          }))
        }
      }
    };
  }

  //환전 신청하기
  const exchangeSubmit = async () => {
    // param
    const {accountName, bankCode, accountNo, socialNo, phoneNo, address1, address2,
      addFile1, addFile2, addFile3} = exchangeForm;

    const paramData = {
      byeol : exchangeCalcData?.reqByeolCnt,
      accountName,
      bankCode,
      accountNo,
      socialNo,
      phoneNo,
      address1,
      address2,
      addFile1,
      addFile2,
      addFile3,
      termsAgree: 1
    }
    const {result, data, message} = await Api.exchangeApply({data: {...paramData}});

    if (result === 'success') {
      history.push('/wallet/result');
    } else {
      dispatch(setGlobalCtxMessage({type: "alert", msg: message}));
    }
  }

  return (
    <>
    <section className="doExchange">
      <button className='noticeBtn'>
        <span className="noticeIcon">?</span>환전이 궁금하시다면?
      </button>
      <div className="amountBox">
        <i className="iconStar"></i>
        <p>보유 별</p>
        <div className='counter active'>
          <input className="num" value={Utility.addComma(byeolTotCnt)} disabled/>
          <span className="unit">개</span>
        </div>
      </div>
      <div className="infoBox">
          {profile?.badgeSpecial > 0 && (
            <>
              <p className="special">DJ님은 스페셜 DJ 입니다.</p>
              <p className="special">환전 실수령액이 5% 추가 됩니다.</p>
            </>
          )}
          <p>별은 570개 이상이어야 환전 신청이 가능합니다</p>
          <p>별 1개당 KRW 60으로 환전됩니다.</p>
      </div>
      <div className="amountBox apply">
        <i className="iconStar"/>
        <p>환전 신청 별</p>
        <div className={`counter ${exchangeCalcData?.reqByeolCnt>569? 'active':''}`}>
          <input className='num' placeholder={0}
                 onChange = {(e) => {
                        const joinNum = e.target.value.split(',').join('');
                        const num = Number(joinNum);
                        if(num > byeolTotCnt){
                          e.target.value = Utility.addComma(byeolTotCnt);
                          setExchangeCalcData({...exchangeCalcData, reqByeolCnt: byeolTotCnt });
                        }else if(!Number.isNaN(num) ){
                          e.target.value = Utility.addComma(num);
                          setExchangeCalcData({...exchangeCalcData, reqByeolCnt: num });
                        } else {
                          e.target.value = exchangeCalcData?.reqByeolCnt;
                        }
                 }}
          />
          <span className='unit'>개</span>
        </div>
      </div>
      <div className="buttonGroup">
        <button onClick={() => exchangeCalc(exchangeCalcData?.reqByeolCnt || 0)}>
          환전 계산하기
        </button>
        <button className='exchange' onClick={() => history.push('/wallet/exchange')}>
          달 교환
        </button>
      </div>
    </section>

    {/* 환전 계산하기 결과 */}
    {calcFormShow &&
    <section className="receiptBoard">
      <div className="receiptList">
        <span>환전 신청 금액</span>
        <p>KRW {Utility.addComma(exchangeCalcData?.basicCash)}</p>
      </div>
      <div className="receiptList">
        <span>원천징수세액</span>
        <p>-{Utility.addComma(exchangeCalcData?.taxCash)}</p>
      </div>
      <div className="receiptList">
        <span>이체 수수료</span>
        <p>-{Utility.addComma(exchangeCalcData?.feeCash)}</p>
      </div>
      <div className="receiptList">
        <span>환전 예상 금액</span>
        <p className="point">KRW {Utility.addComma(exchangeCalcData?.realCash)}</p>
      </div>
    </section>
    }

    <section className="depositInfo">
      <h2>입금 정보</h2>
      <Tabmenu data={depositTabmenu} tab={depositType} setTab={setDepositType} />

      {depositType === depositTabmenu[0] ?
        /*신규 정보*/
        <DepositInfo exchangeSubmit={exchangeSubmit} exchangeForm={exchangeForm} setExchangeForm={setExchangeForm}
                     uploadSingleFile={uploadSingleFile}
        />
        : depositType === depositTabmenu[1] ?
          /*최근 계좌*/
        <NewlyAccount exchangeSubmit={exchangeSubmit} exchangeForm={exchangeForm} setExchangeForm={setExchangeForm}/>
        :
          /*내 계좌*/
        <MyAccount exchangeSubmit={exchangeSubmit} exchangeForm={exchangeForm} setExchangeForm={setExchangeForm}/>
      }
    </section>
    </>
  )
}

export default Exchange;
