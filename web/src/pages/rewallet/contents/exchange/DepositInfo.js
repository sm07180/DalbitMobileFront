import React, {useMemo, useState} from 'react'

// global components
import InputItems from '../../../../components/ui/inputItems/InputItems'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
// components
import CheckList from '../../components/CheckList'
import {useDispatch, useSelector} from "react-redux";

const DepositInfo = (props) => {
  const {exchangeForm, setExchangeForm, uploadSingleFile} = props;
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const {profile, splash} = globalState

  const [selectBank, setSelectBank] = useState('은행선택');

  const bankList = useMemo(() => {
    if (splash !== null) {
      return [{cd: '0', cdNm: '은행선택'}, ...splash.exchangeBankCode];
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
    element_layer.style.top =
      ((window.screen.height || document.documentElement.clientHeight) - height) / 2 - borderWidth - 50 + 'px';
    closeBtn.style.right = ((window.innerWidth || document.documentElement.clientWidth) - width) / 2 - borderWidth - 20 + 'px';
    closeBtn.style.top = ((window.screen.height || document.documentElement.clientHeight) - height) / 2 - borderWidth - 50 + 'px';
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
                   onChange={(e) =>
                     setExchangeForm({...exchangeForm, accountName: e.target.value})}/>
          </InputItems>
        </div>

        <div className="listRow">
          <div className={"title"}>은행</div>
          <InputItems>
            <div className="select">{selectBank}</div>
            {<div className="selectWrap">
              {bankList.map((item, index) => {
                return <div key={index} className="option"
                            onClick={() => {
                              setSelectBank(item?.cdNm);
                              setExchangeForm({...exchangeForm, bankCode:item.cd});
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
              <input type="number" maxLength={6} autoComplete="off" placeholder='앞 6자리'/>
            </InputItems>
            <span className='line'>-</span>
            <InputItems>
              <input type="password" maxLength={7} autoComplete="off" placeholder='뒤 7자리'/>
            </InputItems>
          </div>
        </div>

        <div className="listRow">
          <div className="title">휴대폰 번호</div>
          <InputItems>
            <input type="num" placeholder=""/>
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
                   onChange={(e)=>{setExchangeForm({...exchangeForm, address2: e.target.value})}}/>
          </InputItems>
        </div>

        <div className="listRow">
          <div className="title">신분증사본</div>
          <InputItems button="찾아보기">
            <div className="value">{exchangeForm.addFile1?.name || '등록해주세요'}</div>
            <input type="file" className='blind'
                   onChange={(e) => uploadSingleFile(e, 0)}/>
          </InputItems>
        </div>

        <div className="listRow">
          <div className="title">통장사본</div>
          <InputItems button="찾아보기" >
            <div className="value">{exchangeForm.addFile2?.name || '등록해주세요'}</div>
            <input type="file" className='blind'
                   onChange={(e) => uploadSingleFile(e, 1)}/>
          </InputItems>
        </div>

        {/*휴대폰 인증후 미성년자인 경우 노출*/}
        <div className="listRow">
          <div className="title">부모동의 사본</div>
          <InputItems button="찾아보기">
            <div className="value">{exchangeForm.addFile3?.name || '등록해주세요'}</div>
            <input type="file" className='blind'
                   onChange={(e) => uploadSingleFile(e, 2)}/>
          </InputItems>

        </div>
        <div className="noticeBox">
          <span>* 가족관계 증명서 또는 주민등록등본을 등록해주세요.</span>
          <span>* 부모님의 주민번호 앞 6자리가 명확히 확인되어야 합니다.</span>
        </div>

        <div className="privacyBox">
          <CheckList text="개인정보 수집 동의" name="privacy"
                     onClick={() => setExchangeForm((state) => {
                       return {...exchangeForm, agree: !state.agree}
                     })}>
            <sup>[필수]</sup>
          </CheckList>
          <p>회사는 환전의 목적으로 회원 동의 하에 관계 법령에서 정하는 바에 따라 개인정보를 수집할 수 있습니다. (수집된 개인정보는 확인 후 폐기 처리 합니다.)</p>
        </div>
        <SubmitBtn text="환전 신청하기" state="disabled" />
      </form>

    </>
  )
};

export default DepositInfo;
