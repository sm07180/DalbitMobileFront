import React, {useState, useEffect,useContext, useMemo, useRef} from 'react'
import {Context} from 'context'

// global components
import InputItems from '../../../../components/ui/inputItems/InputItems'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
// components
import CheckList from '../../components/CheckList'

const DepositInfo = (props) => {
  const {exchangeForm, setExchangeForm, exchangeSubmit, uploadSingleFile, parentAgree, tabMenuRef} = props;
  //context
  const context = useContext(Context);
  const {profile, splash} = context;

  //은행 선택 값 (단순 화면 표기용)
  const [selectBank, setSelectBank] = useState(false);

  const bankList = useMemo(() => {
    if (splash !== null) {
      return [...splash.exchangeBankCode];
    } else {
      return [];
    }
  }, [splash]);

  //다음 주소 검색 창 띄우기
  const searchAddr = () => {
    const element_layer = document.getElementById('layer');

    new window['daum'].Postcode({
      oncomplete: (data) => {
        // data.zonecode 우편번호 안씀...
        setExchangeForm({...exchangeForm, address1: data.address, zoneCode:data.zonecode}); // 선택 주소
        element_layer.setAttribute('style', 'display: none;');
      },
      width: '100%',
      height: '100%',
      maxSuggestItems: 5
    }).embed(element_layer);
    element_layer.style.display = 'block';

    const width = 300; //우편번호서비스가 들어갈 element의 width
    const height = 500; //우편번호서비스가 들어갈 element의 height
    const borderWidth = 2; //샘플에서 사용하는 border의 두께
    const closeBtn = document.getElementById('layer__close');
    // 위에서 선언한 값들을 실제 element에 넣는다.
    // 위에서 선언한 값들을 실제 element에 넣는다.
    // element_layer.style.width = width + 'px';
    element_layer.style.height = height + 'px';
    element_layer.style.border = borderWidth + 'px solid';
    // 실행되는 순간의 화면 너비와 높이 값을 가져와서 중앙에 뜰 수 있도록 위치를 계산한다.
    element_layer.style.left = ((window.innerWidth || document.documentElement.clientWidth) - width) / 2 - borderWidth + 'px';
    closeBtn.style.right = ((window.innerWidth || document.documentElement.clientWidth) - width) / 2 - borderWidth - 20 + 'px';
    // 사파리 버그 (getBoundingClientRect)
    setTimeout(() => {
      if(element_layer && closeBtn && tabMenuRef.current) {
        element_layer.style.top = tabMenuRef.current?.getBoundingClientRect()?.bottom + 20 + 'px';
        //((window.screen.height || document.documentElement.clientHeight) - height) / 2 - borderWidth - 50 + 'px';
        closeBtn.style.top = tabMenuRef.current?.getBoundingClientRect()?.bottom + 20 + 'px';
        //((window.screen.height || document.documentElement.clientHeight) - height) / 2 - borderWidth - 50 + 'px';

      }
    },500);
  }

  const closeDaumPostCode = () => {
    const element_layer = document.getElementById('layer');
    element_layer.style.display = 'none';
  }

  // accountName : '' //예금주
  //   ,bankCode: 0  //은행
  //   ,accountNo: ''//계좌번호
  //   ,socialNo:''  //주민등록번호
  //   ,phoneNo:''   //휴대폰번호
  //   ,address1:''  //주소
  //   ,address2:''  //주소
  //   ,addFile1:''  //신분증사본
  //   ,addFile2:''  //통장사본
  //   ,addFile3:''  //미성년자 부모님 동의

  //blur
  const selectBoxRef = useRef(null);
  const clickEvent = (e) => {
    if (selectBoxRef.current !== e.target) {
      //blur로 판단
      setSelectBank(false);
    }
  }
  useEffect(() => {
    document.body.addEventListener('click', clickEvent);
    return () => {
      document.body.removeEventListener('click', clickEvent);
    };
  },[]);

  //환전신청 조건 실패시 true!
  const vaildationFaild = useMemo(()=>{
    const {accountName, bankCode, accountNo, fSocialNo, bSocialNo, phoneNo, address1, address2,
      addFile1, addFile2, addFile3, agree} = exchangeForm;
    return !accountName || !bankCode || !accountNo || !fSocialNo || !bSocialNo || !phoneNo || !address1 || !address2
      || !addFile1 || !addFile2 || !agree || (parentAgree && !addFile3);
  },[exchangeForm, parentAgree]);

  return (
    <>
      {/*다음 주소 검색*/}
      <div id="layer">
        <button id="layer__close" onClick={closeDaumPostCode}>X</button>
      </div>

      <form className="formBox">
        <div className="listRow">
          <div className={"title"}>예금주</div>
          <InputItems>
            <input type="text" placeholder=""
                   defaultValue={exchangeForm?.accountName}
                   onChange={(e) =>
                     setExchangeForm({...exchangeForm, accountName: e.target.value})}/>
          </InputItems>
        </div>

        <div className="listRow">
          <div className={"title"}>은행</div>
          <InputItems>
            <div className="select" ref={selectBoxRef}
                 onClick={()=>{ setSelectBank(true)}}
            >{exchangeForm.bankName || '은행선택'}</div>
            {selectBank &&
              <div className="selectWrap">
              {bankList.map((item, index) => {
                  return <div key={index} className="option"
                              onClick={(e) => {
                                e.stopPropagation();
                                //단순 화면 표기용
                                setSelectBank( false);
                                //계좌 폼 정보
                                setExchangeForm({...exchangeForm, bankCode: item.cd, bankName: item?.cdNm});
                              }}
                  >{item.cdNm}</div>}
              )}
            </div>}
          </InputItems>
        </div>

        <div className="listRow">
          <div className={"title"}>계좌번호</div>
          <InputItems>
            <input type="text" placeholder=""
                   defaultValue={exchangeForm?.accountNo}
                   onChange={(e) => {
                     const num = e.target.value;
                     if(!Number.isNaN(Number(num))) {
                       if (num?.length < 21) {
                         setExchangeForm({...exchangeForm, accountNo: num})
                       } else {
                         e.target.value = exchangeForm?.accountNo;
                       }
                     } else {
                       e.target.value = exchangeForm?.accountNo;
                     }
                   }}
            />
          </InputItems>
        </div>

        <div className="listRow">
          <div className="title">주민등록번호</div>
          <div className="inputGroup">
            <InputItems>
              <input type="number" maxLength={6} placeholder='앞 6자리'
                     autoComplete="new-password"
                     defaultValue={exchangeForm?.fSocialNo}
                     onChange={(e) => {
                       const num = e.target.value;
                       if(!Number.isNaN(Number(num))) {
                         if (num?.length < 7) {
                           setExchangeForm({...exchangeForm, fSocialNo: num})
                         } else {
                           e.target.value = exchangeForm?.fSocialNo;
                         }
                       } else {
                         e.target.value = exchangeForm?.fSocialNo;
                       }
                     }}
              />
            </InputItems>
            <span className='line'>-</span>
            <InputItems>
              <input type="password" maxLength={7} placeholder='뒤 7자리'
                     autoComplete="new-password"
                     defaultValue={exchangeForm?.bSocialNo}
                     onChange={(e) => {
                       const num = e.target.value;
                       if(!Number.isNaN(Number(num))) {
                         if (num?.length < 8) {
                           setExchangeForm({...exchangeForm, bSocialNo: num})
                         } else {
                           e.target.value = exchangeForm?.bSocialNo;
                         }
                       } else {
                         e.target.value = exchangeForm?.bSocialNo;
                       }
                     }}
              />
            </InputItems>
          </div>
        </div>

        <div className="listRow">
          <div className="title">휴대폰 번호</div>
          <InputItems>
            <input type="num" placeholder=""
                   defaultValue={exchangeForm?.phoneNo}
                   onChange={(e) => {
                     const num = e.target.value;
                     if(!Number.isNaN(Number(num))) {
                       if (num?.length < 12) {
                         setExchangeForm({...exchangeForm, phoneNo: num})
                       } else {
                         e.target.value = exchangeForm?.phoneNo;
                       }
                     } else {
                       e.target.value = exchangeForm?.phoneNo;
                     }
                   }}
            />
          </InputItems>
        </div>

        <div className="listRow">
          <div className="title">우편번호</div>
          <InputItems button='주소검색' focusDisable={true} onClick={searchAddr}>
            <input type="number" placeholder="주소 검색 해주세요" value={exchangeForm?.zoneCode} readOnly/>
          </InputItems>
        </div>
        <div className="listRow">
          <div className="title">주소</div>
          <InputItems focusDisable={true}>
            <input type="text" placeholder="자동 입력됩니다" value={exchangeForm?.address1} readOnly/>
          </InputItems>
        </div>
        <div className="listRow">
          <div className="title">상세주소</div>
          <InputItems>
            <input type="text" placeholder='상세주소를 입력 해주세요'
                   defaultValue={exchangeForm?.address2}
                   onChange={(e)=>{setExchangeForm({...exchangeForm, address2: e.target.value})}}/>
          </InputItems>
        </div>

        <div className="listRow">
          <div className="title">신분증사본</div>
          <InputItems button="찾아보기" onClick={()=>{document.querySelector('#depositInfo_fileInput__1')?.click(); }}>
            <div className="value">{exchangeForm.addFile1?.name || '등록해주세요'}</div>
            <input id={"depositInfo_fileInput__1"} type="file" className='blind'
                   onChange={(e) => uploadSingleFile(e, 0)}/>
          </InputItems>
        </div>

        <div className="listRow">
          <div className="title">통장사본</div>
          <InputItems button="찾아보기" onClick={()=>{document.querySelector('#depositInfo_fileInput__2')?.click(); }}>
            <div className="value">{exchangeForm.addFile2?.name || '등록해주세요'}</div>
            <input id={"depositInfo_fileInput__2"} type="file" className='blind'
                   onChange={(e) => uploadSingleFile(e, 1)}/>
          </InputItems>
        </div>

        {/*휴대폰 인증후 미성년자인 경우 노출*/}
        {parentAgree &&
          <>
            <div className="listRow">
              <div className="title">부모동의 사본</div>
              <InputItems button="찾아보기" onClick={()=>{document.querySelector('#depositInfo_fileInput__3')?.click(); }}>
                <div className="value">{exchangeForm.addFile3?.name || '등록해주세요'}</div>
                <input id={"depositInfo_fileInput__3"} type="file" className='blind'
                       onChange={(e) => uploadSingleFile(e, 2)}/>
              </InputItems>
            </div>
            <div className="noticeBox">
              <span>* 가족관계 증명서 또는 주민등록등본을 등록해주세요.</span>
              <span>* 부모님의 주민번호 앞 6자리가 명확히 확인되어야 합니다.</span>
            </div>
          </>
        }
        <div className="privacyBox">
          <CheckList text="개인정보 수집 동의" name="privacy" checkState={exchangeForm?.agree}
                     onClick={() => setExchangeForm((state) => {
                       return {...exchangeForm, agree: !state.agree}
                     })}>
            <sup>[필수]</sup>
          </CheckList>
          <p>회사는 환전의 목적으로 회원 동의 하에 관계 법령에서 정하는 바에 따라 개인정보를 수집할 수 있습니다. (수집된 개인정보는 확인 후 폐기 처리 합니다.)</p>
        </div>
        {/*disabled*/}
        <SubmitBtn text="환전 신청하기" state={vaildationFaild?'disabled':''} onClick={exchangeSubmit}/>
      </form>

    </>
  )
};

export default DepositInfo;