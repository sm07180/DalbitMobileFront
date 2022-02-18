import React, {useState, useEffect, useContext, useMemo} from 'react'
import Utility ,{addComma} from 'components/lib/utility'

// global components
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
import LayerPopup from 'components/ui/layerPopup/LayerPopup'
// components
import Tabmenu from '../../components/tabmenu'
// contents
import DepositInfo from './DepositInfo'
import NewlyAccount from './NewlyAccount'
import MyAccount from './MyAccount'
import {useHistory} from "react-router-dom";
import Api from "context/api";
import {Context} from "context";

const Exchange = (props) => {
  const origin_depositTabmenu = ['신규 정보','최근 계좌','내 계좌'];

  const [depositType, setDepositType] = useState(origin_depositTabmenu[0]);
  const history = useHistory();
  const context = useContext(Context);
  const {profile, walletData} = context;
  const {byeolTotCnt, dalTotCnt} = walletData;
  const [calcFormShow, setCalcFormShow] = useState(false);
  const [popup, setPopup] = useState(false)

  const noticePop =()=>{
    setPopup(true)
  }


  useEffect(()=>{
    getMyAccountData(); //내 계좌 정보 조회
    recentExchangeData(); //최근 환전신청 내역 조회
  },[]);

  useEffect(() => {
    if(byeolTotCnt === 0 || dalTotCnt ===0) {
      context.globalAction.dispatchWalletData({
        type: 'ADD_DATA',
        data: {dalTotCnt: profile?.dalCnt || 0, byeolTotCnt: profile?.byeolCnt || 0}
      });
    }
  },[profile]);

  //부모님 동의서 파일첨부란 필요 여부
  const [parentAgree, setParentAgree] = useState(false);  

  //환전 신청할 별 갯수
  const [exchangeCalcData, setExchangeCalcData] = useState({reqByeolCnt: 0, realCash:0});

  //신규 환전 신청폼
  const [exchangeForm, setExchangeForm] = useState({
    //신규거래 환전신청시 사용
    accountName : '' //예금주
    ,bankCode: 0  //은행
    ,accountNo: ''//계좌번호
    ,fSocialNo:''  //주민등록번호 앞자리
    ,bSocialNo:''  //주민등록번호 뒷자리
    ,phoneNo:''   //휴대폰번호
    ,address1:''  //주소
    ,address2:''  //주소
    ,addFile1:''  //신분증사본
    ,addFile2:''  //통장사본
    ,addFile3:''  //미성년자인 경우 부모님 동의
    ,bankName: '' //은행명
    ,agree: false  //3자 제공 동의 (단순 체크 확인로직 처리 api 전송 x)
    ,zoneCode: ''  //우편번호 폼 단순 표기용

    //최근거래 index, 최근거래한 계좌 정보
    ,recent_exchangeIndex: 0 //최근 거래 글번호
    ,recent_accountName: '' //예금주 (계좌추가탭에서 추가한 리스트 눌렀을때)
    ,recent_bankCode: 0    //최근 거래 은행 (계좌추가탭에서 추가한 리스트 눌렀을때)
    ,recent_accountNo: '' //최근 거래 계좌번호 (계좌추가탭에서 추가한 리스트 눌렀을때)
    ,recent_socialNo:''   //주민등록번호
    ,recent_phoneNo:''    //휴대폰번호
    ,recent_address1:''   //주소
    ,recent_address2:''   //상세주소
  });

  //내 계좌 리스트
  const [accountList, setAccountList] = useState([]);

  const depositTabmenu = useMemo(() => {
    if(exchangeForm?.recent_exchangeIndex > 0){ // num > 0
      return origin_depositTabmenu;
    } else {
      return [origin_depositTabmenu[0]];
    }
  }, [exchangeForm?.recent_exchangeIndex]);

  //내 계좌 목록 불러오기
  const getMyAccountData = async () => {
    const res = await Api.exchangeSearchAccount({})
    const {result, data, message} = res
    if (result === 'success') {
      setAccountList(data.list)
    } else {
      context.action.alert({
        msg: message
      })
    }
  };

  //최근 환전내역 승인건 조회하기 (조회된 결과가 있으면 : 최근, 계좌추가 탭 활성화)
  const recentExchangeData = async () => {
    //미성년자 여부 체크 (부모님 동의서 자료첨부란 활성)
    const authCheck = await Api.self_auth_check();
    if (authCheck.result === 'success') {
      if (authCheck.data.parentsAgreeYn === 'y') {  //미성년자 대상인 경우
        setParentAgree(true);
      }
    }

    //최근 계좌 내역 탭 활성화
    const {result, data, message} = await Api.exchangeSelect();

    if (result === 'success') {
      const {exchangeIdx, accountName, accountNo, bankCode, socialNo, phoneNo,
        address1, address2} = data;

      //,recent_accountName: accountName
      //,recent_bankCode: bankCode
      //,recent_accountNo: accountNo

      //최근 환전신청 승인건이 있다면 세팅, 최근탭을 눌러서 api에 쏠때는 index만 필요
      //최근에 거래한 정보 세팅

      setExchangeForm({...exchangeForm
        ,recent_exchangeIndex: exchangeIdx
        ,recent_accountName: accountName
        ,recent_bankCode: bankCode
        ,recent_accountNo: accountNo
        ,recent_socialNo: socialNo
        ,recent_phoneNo: phoneNo
        ,recent_address1: address1
        ,recent_address2: address2
      });
    }
  };
  
  //환전 계산하기
  const exchangeCalc = async (sendByeolCnt = 0) => {
    if (sendByeolCnt < 570) {
      context.action.alert({msg: '환전 신청별은\n570개 이상이어야 합니다.'});
    } else if (sendByeolCnt > byeolTotCnt) {
      context.action.alert({msg: '환전 신청별은\n보유 별보다 같거나 작아야 합니다.'})
      return;
    } else {
      const res = await Api.exchangeCalc({
        data: {byeol: sendByeolCnt}
      })
      context.action.alert({msg:res.message});

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
      context.action.alert({
        msg: 'jpg, png 이미지만 사용 가능합니다.',
        callback: () => {
          context.action.alert({visible: false})
        }
      });
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
          context.action.alert({
            msg: '사진 업로드에 실패하였습니다.\n다시 시도해주세요.',
            callback: () => {
              context.action.alert({visible: false})
            }
          })
        }
      }
    };
  }
  
  //환전 신청하기
  const exchangeSubmit = async () => {
    // param
    const {accountName, bankCode, accountNo, fSocialNo, bSocialNo, phoneNo, address1, address2,
      addFile1, addFile2, addFile3} = exchangeForm;

    if(!accountName || !bankCode || !accountNo || !fSocialNo || !bSocialNo || !phoneNo || !address1 || !address2
      || !addFile1 || !addFile2 || (parentAgree && addFile3)){
      return;
    }

    const paramData = {
      byeol : exchangeCalcData?.reqByeolCnt,
      accountName,
      bankCode,
      accountNo,
      socialNo : `${fSocialNo}${bSocialNo}`,
      phoneNo,
      address1,
      address2,
      addFile1: addFile1?.path,
      addFile2: addFile2?.path,
      addFile3: addFile3?.path || '',
      termsAgree: 1
    }
    const {result, data, message} = await Api.exchangeApply({data: {...paramData}});

    if (result === 'success') {
      context.action.toast({msg:message});
      history.push({
        pathname:'/wallet/result',
        state:{
          reqByeolCnt:exchangeCalcData?.reqByeolCnt,  //환전 신청 별
          realCash: exchangeCalcData?.realCash || 0,  //실수령액
          accountName,  //예금주
          bankName:exchangeForm?.bankName,  //은행명
          accountNo,    //계좌번호
        }
      });
    } else {
      context.action.alert({msg: message});
    }
  }

  //최근 신청내역으로 환전신청 (계좌내역, 최근내역)
  const repplySubmit = async (param) => {
    if(!exchangeForm?.recent_exchangeIndex) return;

    const {recent_exchangeIndex} = exchangeForm;
    const {recent_accountName, recent_accountNo, recent_bankCode} = !param ? exchangeForm: param;
    let paramData = {};

    //계좌내역으로 환전신청
    if (exchangeForm?.recent_accountName && exchangeForm?.recent_accountNo && exchangeForm?.recent_bankCode) {
      paramData = {
        byeol: exchangeCalcData?.reqByeolCnt,//최근 신청내역의 index, 없으면 신청 불가
        exchangeIdx: recent_exchangeIndex,
        accountName: recent_accountName,
        accountNo: recent_accountNo,
        bankCode: recent_bankCode
      }
    } else {  //최근신청내역으로 환전신청
      paramData = {
        byeol: exchangeCalcData?.reqByeolCnt,
        exchangeIdx: recent_exchangeIndex //최근 신청내역의 index
      }
    }

    const {result, message, data} = await Api.exchangeReApply({data: {...paramData}});

    if (result === 'success') {
      context.action.toast({msg:message});
      history.push({
        pathname:'/wallet/result',
        state:{
          reqByeolCnt:exchangeCalcData?.reqByeolCnt,  //환전 신청 별
          realCash: exchangeCalcData?.realCash || 0,  //실수령액
          accountName,  //예금주
          bankName:exchangeForm?.bankName,  //은행명
          accountNo,    //계좌번호
        }
      });
    } else {
      context.action.alert({msg: message});
    }
  }

  return (
    <>
    <section className="doExchange">
      <button className='noticeBtn' onClick={noticePop}>
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
        <NewlyAccount repplySubmit={repplySubmit} exchangeForm={exchangeForm} setExchangeForm={setExchangeForm}/>
        :
          /*내 계좌*/
        <MyAccount repplySubmit={repplySubmit} exchangeForm={exchangeForm} setExchangeForm={setExchangeForm}
                   accountList={accountList} setAccountList={setAccountList}
                   getMyAccountData={getMyAccountData}
        />
      }
    </section>
    {
      popup &&
      <LayerPopup setPopup={setPopup}>
        <div className='popTitle'>환전 유의사항</div>
        <div className='popContent'>
          <div className="wrap">
            <h3>◈ 환전은?</h3>
            <p>방송 중 DJ가 타회원에게 받은 "별"선물을 현금으로 전환하는 것입니다.</p>
            <p>방송에서 보유한 "별"은 1개당 60KRW으로 환전 됩니다.</p>
            <p>또한, 보유한 "별"은 570별 이상부터 환전 신청이 가능합니다. (원천징수세액 3.3%, 이체수수료 500원 제외)</p>
            <p>★ 보유한 “별”은 최종 선물을 받은 일을 기준으로 12개월이 지나면 소멸됩니다.</p>
            <p></p>
          </div>
        </div>
      </LayerPopup>
    }
    </>
  )
}

export default Exchange;