import React, { useState, useContext } from 'react'

import { Context } from 'context';

import BackBtn from '../static/ic_back.svg'
import IconNotice from '../static/ic_notice.svg'
import checkOff from '../static/ico-checkbox-off.svg'
import checkOn from '../static/ico-checkbox-on.svg'

import SelectBoxWrap from '../component/select';

import Api from 'context/api';

const initialCalc = {
  basicCash: 0, // 환전예상금액
  benefitCash: null, // 스페셜DJ혜택
  taxCash: 0, // 원천징수세액
  feeCash: 0, // 이체수수료
  realCash: 0 // 환전실수령액
}

export default (props) => {
  const context = useContext(Context);
  
  const [status, setStatus] = useState(0);
  const [check, setCheck] = useState(false); //개인정보 수집 동의
  const [exchangeStar, setExchangeStar] = useState(0); //환전 신청 별
  const [exchangeCalc, setExchangeCalc] = useState(initialCalc);

  const [name, setName] = useState("") // 예금주
  const [selectBank, setSelectBank] = useState(""); // 은행
  const [account, setAccount] = useState(0) // 계좌번호
  const [fSocialNo, setFSocialNo] = useState("") // 주민번호 앞자리
  const [bSocialNo, setBSocialNo] = useState("") // 주민번호 뒷자리
  const [phone, setPhone] = useState("") // 전화번호

  const [zonecode, setZonecode] = useState("") // 우편번호
  const [address1, setAddress1] = useState("") // addr1
  const [address2, setAddress2] = useState("") // addr2

  // 신분증 사본
  const [idPhotoPath, setIdPhotoPath] = useState(""); 
  const [idPhotoUploading, setIdPhotoUploading] = useState(false);
  const [idPhotoName, setIdPhotoName] = useState("");
  //////////////////////////////////////////////////
  
  // 통장사본
  const [bankBookPath, setBankBookPath] = useState(""); 
  const [bankBookUploading, setBankBookUploading] = useState(false);
  const [bankBookName, setBankBookName] = useState("");
  /////////////////////////////////////////////////
  const applyExchange = async () => {
    const paramData = {
      byeol: exchangeStar,
      accountName: name,
      bankCode: selectBank,
      accountNo: account,
      socialNo: fSocialNo + bSocialNo,
      phoneNo: phone,
      address1: address1,
      address2: address2,
      addFile1: idPhotoPath,
      addFile2: bankBookPath,

      termsAgree: 1
    };

    const res = await Api.exchangeApply({
      data: {...paramData}
    });
    const { result, data } = res;
    if(result === "success") {
      props.history.push({
        pathname: "/temp_test/chargeSuccess",
        state: { ...data }
      })
      
      res.data
    } else {
      context.action.alert({
        msg: '알 수 없는 문제로 환전신청에 실패하였습니다. 입력값을 확인해 주세요',
        callback: () => {
          context.action.alert({visible: false})
        }
      })
    }
  }
  
  const checkExchange = () => {
    if(exchangeStar === 0) {
      context.action.alert({
        msg: "환전 신청별은 필수 입력값입니다.",
        callback: () => {
          context.action.alert({visible: false})
        }
      })
      return;
    }
    if(exchangeStar < 600) {
      context.action.alert({
        msg: "환전 신청별은 600개 이상이어야 합니다.",
        callback: () => {
          context.action.alert({visible: false})
        }
      })
      return;
    }
    if(name === "") {
      context.action.alert({
        msg: "예금주를 입력해 주세요.",
        callback: () => {
          context.action.alert({visible: false})
        }
      })
      return;
    }
    if(selectBank === "") {
      context.action.alert({
        msg: "은행을 선택해주세요",
        callback: () => {
          context.action.alert({visible: false})
        }
      })
      return;
    }
    if(account === 0) {
      context.action.alert({
        msg: "계좌번호를 입력해주세요",
        callback: () => {
          context.action.alert({visible: false})
        }
      })
      return;
    }
    if(fSocialNo === "" && bSocialNo === "") {
      context.action.alert({
        msg: "주민번호를 입력해주세요.",
        callback: () => {
          context.action.alert({visible: false})
        }
      })
      return
    }
    if(phone === "") {
      context.action.alert({
        msg: "전화번호를 입력해주세요.",
        callback: () => {
          context.action.alert({visible: false})
        }
      })
      return
    }
    if(address1 === "") {
      context.action.alert({
        msg: "주소를 입력해 주세요.",
        callback: () => {
          context.action.alert({visible: false})
        }
      })
      return
    }

    if(idPhotoName === "") {
      context.action.alert({
        msg: "신분증 사본을 첨부해주세요.",
        callback: () => {
          context.action.alert({visible: false})
        }
      })
      return;
    }
    if(bankBookName === "") {
      context.action.alert({
        msg: "통장 사본을 첨부해주세요.",
        callback: () => {
          context.action.alert({visible: false})
        }
      })
      return;
    }
    
    applyExchange();

  }

  const fnExchangeCalc = async () => {
    console.log(exchangeStar);
    if(exchangeStar === 0) {
      return;
    } else if(!Number.isInteger(parseInt(exchangeStar))){
      return;
    } else {
      const res = await Api.exchangeCalc({
        data: {
          byeol: exchangeStar
        }
      });
      const { result, data, message } = res;

      if(result === "success") {
        setExchangeCalc({...data});
      } else {
        context.action.alert({
          msg: message,
          callback: () => {
            context.action.alert({visible: false})
          }
        })
      }
      
    }
  }

  const profileImageUpload = (e) => {
      const target = e.currentTarget
      const targetName = e.target.name;
      let reader = new FileReader()
      const file = target.files[0]
      const fileName = file.name
      const fileSplited = fileName.split('.')
      const fileExtension = fileSplited.pop()
      const extValidator = (ext) => {
        const list = ['jpg', 'jpeg', 'png']
        return list.includes(ext)
      }
      
      if (!extValidator(fileExtension)) {
        return context.action.alert({
          msg: 'jpg, png 이미지만 사용 가능합니다.',
          title: '',
          callback: () => {
            context.action.alert({visible: false})
          }
        })
      }
      //파일을 배열 버퍼로 읽는 최신 약속 기반 API입니다
      reader.readAsArrayBuffer(file)
      // reader.readAsDataURL(file)
  
      //오리엔테이션 뽑아내는 함수
      function getOrientation(buffer) {
        var view = new DataView(buffer)
        if (view.getUint16(0, false) !== 0xffd8) {
          return {
            buffer: view.buffer,
            orientation: -2
          }
        }
        var length = view.byteLength,
          offset = 2
        while (offset < length) {
          var marker = view.getUint16(offset, false)
          offset += 2
          if (marker === 0xffe1) {
            if (view.getUint32((offset += 2), false) !== 0x45786966) {
              return {
                buffer: view.buffer,
                orientation: -1
              }
            }
            var little = view.getUint16((offset += 6), false) === 0x4949
            offset += view.getUint32(offset + 4, little)
            var tags = view.getUint16(offset, little)
            offset += 2
            for (var i = 0; i < tags; i++) {
              if (view.getUint16(offset + i * 12, little) === 0x0112) {
                const orientation = view.getUint16(offset + i * 12 + 8, little)
                view.setUint16(offset + i * 12 + 8, 1, little)
                return {
                  buffer: view.buffer,
                  orientation
                }
              }
            }
          } else if ((marker & 0xff00) !== 0xff00) {
            break
          } else {
            offset += view.getUint16(offset, false)
          }
        }
  
        return {
          buffer: view.buffer,
          orientation: -1
        }
      }
  
      //캔버스로 그려서 dataurl 로 뽑아내는 함수
      function drawAdjustImage(img, orientation) {
        const cnvs = document.createElement('canvas')
        const ctx = cnvs.getContext('2d')
        let dx = 0
        let dy = 0
        let dw
        let dh
        let deg = 0
        let vt = 1
        let hr = 1
        let rad
        let sin
        let cos
  
        cnvs.width = orientation >= 5 ? img.height : img.width
        cnvs.height = orientation >= 5 ? img.width : img.height
  
        switch (orientation) {
          case 2: // flip horizontal
            hr = -1
            dx = cnvs.width
            break
          case 3: // rotate 180 degrees
            deg = 180
            dx = cnvs.width
            dy = cnvs.height
            break
          case 4: // flip upside down
            vt = -1
            dy = cnvs.height
            break
          case 5: // flip upside down and rotate 90 degrees clock wise
            vt = -1
            deg = 90
            break
          case 6: // rotate 90 degrees clock wise
            deg = 90
            dx = cnvs.width
            break
          case 7: // flip upside down and rotate 270 degrees clock wise
            vt = -1
            deg = 270
            dx = cnvs.width
            dy = cnvs.height
            break
          case 8: // rotate 270 degrees clock wise
            deg = 270
            dy = cnvs.height
            break
        }
        rad = deg * (Math.PI / 180)
        sin = Math.sin(rad)
        cos = Math.cos(rad)
        ctx.setTransform(cos * hr, sin * hr, -sin * vt, cos * vt, dx, dy)
  
        dw = orientation >= 5 ? cnvs.height : cnvs.width
        dh = orientation >= 5 ? cnvs.width : cnvs.height
        ctx.drawImage(img, 0, 0, dw, dh)
        return cnvs.toDataURL('image/jpeg', 1.0)
      }
  
      reader.onload = async () => {
        if (reader.result) {
          const originalBuffer = reader.result
          const {buffer, orientation} = getOrientation(originalBuffer)
          const blob = new Blob([buffer])
          //createObjectURL 주어진 객체를 가리키는 URL을 DOMString으로 반환합니다
          const originalCacheURL = (window.URL || window.webkitURL || window || {}).createObjectURL(file)
          const cacheURL = (window.URL || window.webkitURL || window || {}).createObjectURL(blob)
          const img = new Image()
          img.src = cacheURL
          if(targetName === "idcard") {
            setIdPhotoUploading(true)
          } else if(targetName === "bankbook") {
            setBankBookUploading(true)
          }
          
          console.log(originalCacheURL)
  
          img.onload = async () => {
            const limitSize = 1280
            if (img.width > limitSize || img.height > limitSize) {
              img.width = img.width / 5
              img.height = img.height / 5
            }
  
            const encodedDataAsBase64 = drawAdjustImage(img, orientation)
            uploadImageToServer(encodedDataAsBase64)
          }
  
          async function uploadImageToServer(data) {
            const res = await Api.image_upload({
              data: {
                dataURL: data,
                uploadType: 'exchange'
              }
            })
            if (res.result === 'success') {
              if(targetName === "idcard") {
                setIdPhotoPath(res.data.path)
                setIdPhotoUploading(false)
                setIdPhotoName(fileName)
              } else if( targetName === "bankbook") {
                setBankBookPath(res.data.path)
                setBankBookUploading(false)
                setBankBookName(fileName)
              }
              
              console.log(res);
            } else {
              context.action.alert({
                msg: '사진 업로드에 실패하였습니다.\n다시 시도해주세요.',
                title: '',
                callback: () => {
                  context.action.alert({visible: false})
                }
              })
            }
          }
        }
      }
  }

  const handleEvent = (value) => {
    setSelectBank(value);
  }

  const serachAddr = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setAddress1(data.address);
        setZonecode(data.zonecode);
      }
    }).open();
  }

  return (
      <React.Fragment>
          {
              status === 0 ? (
                  <>
                      <div className="header">
                          <img src={BackBtn} className="header__button--back" />
                          <h1 className="header__title">환전하기</h1>
                      </div>

                      <div className="content">
                          <div className="myStar">
                          <div className="charge__title">
                              <div className="mystar__title">환전 정보</div>
                              <div className="charge__title--point" onClick={() => setStatus(1)}>
                                유의사항
                                <img src={IconNotice} className="charge__title--object" />
                              </div>
                          </div>
                          {
                            isSpecial &&
                            <div className="myStar__special">
                              <p className="myStar__special--title">DJ님은 스페셜 DJ 입니다.</p>
                              <p className="myStar__special--point">스페셜 DJ의 경우 환전 실수령액이 10% 추가 됩니다.</p>
                            </div>
                          }
                          <p className="myStar__notice">* 별은 600개 이상이어야 환전 신청이 가능하며, 별 1개당 KRW 60으로 환전됩니다.</p>

                          <div className="point">
                              <div className="point__list point__list--left">
                              <div className="point__label">보유 별</div>
                              <div className="point__value">600</div>
                              </div>
                              <div className="point__list">
                              <div className="point__label">환전 신청 별</div>
                              <input type="number" className="point__value  point__value--input" onChange={(e) => setExchangeStar(e.target.value)} />
                              </div>
                          </div>

                          <a className="point__button" onClick={fnExchangeCalc}>
                              환전 계산
                          </a>

                          <div className="pay">
                              <div className="pay__list pay__list--margin">
                                <div className="pay__label pay__label--title">환전 예상 금액</div>
                                <div className="pay__value">{exchangeCalc.basicCash}</div>
                              </div>
                              {
                                exchangeCalc.benefitCash &&
                                exchangeCalc.benefitCash > 0 ?
                                (<div className="pay__list">
                                  <div className="pay__list--small">스페셜DJ 혜택(+10%)</div>
                                  <div className="pay__list--small">{exchangeCalc.benefitCash}</div>
                                </div>)
                                : (<> </>)
                              }
                              <div className="pay__list">
                                <div className="pay__list--small">원천징수세액</div>
                                <div className="pay__list--small">{exchangeCalc.taxCash}</div>
                              </div>
                              <div className="pay__list">
                                <div className="pay__list--small">이체수수료</div>
                                <div className="pay__list--small">{exchangeCalc.feeCash}</div>
                              </div>
                              <div className="pay__list pay__list--line">
                                <div className="pay__label pay__label--title">환전 실수령액</div>
                                <div className="pay__value">
                                  <div className="pay__value--text">KRW</div>
                                  <div className="pay__value--purple">{exchangeCalc.realCash}</div>
                                </div>
                              </div>
                          </div>
                          </div>

                          <div className="comon__title">입금 정보</div>

                          <div className="PayView">
                          <div className="PayView__list">
                              <div className="PayView__title">예금주</div>
                              <div className="PayView__input">
                              <input type="text" value="달나라" className="PayView__input--text" />
                              </div>
                          </div>

                          <div className="PayView__list">
                              <div className="PayView__title">은행</div>
                              <div className="PayView__input">
                              <SelectBoxWrap boxList={bankList} onChangeEvent={handleEvent} />
                              </div>
                          </div>

                          <div className="PayView__list">
                              <div className="PayView__title">계좌번호</div>
                              <div className="PayView__input">
                              <input type="text" value="059402-04194521" className="PayView__input--text" />
                              </div>
                          </div>

                          <div className="PayView__list">
                              <div className="PayView__title">주민등록번호</div>
                              <div className="PayView__input--nomber">
                              <input type="text" value="901231" className="PayView__input--text" />
                              <span className="PayView__input--line">-</span>
                              <input type="text" value="1234567" className="PayView__input--text" />
                              </div>
                          </div>

                          <div className="PayView__list">
                              <div className="PayView__title">전화번호</div>
                              <div className="PayView__input">
                              <input type="text" value="01098765432" className="PayView__input--text" />
                              </div>
                          </div>
                          <div className="PayView__list">
                              <div className="PayView__title">주소</div>
                              <div className="PayView__input">
                              <div className="PayView__address--list">
                                  <input type="text" className="PayView__input--text adressBg" disabled="true" value={zonecode}/>
                                  <button className="PayView__input--button" onClick={serachAddr}>주소검색</button>
                              </div>
                              <div className="PayView__address--list">
                                  <input type="text" value={address1} className="PayView__input--text adressBg" disabled="true" />
                              </div>
                              <div className="PayView__address--list">
                                  <input type="text" className="PayView__input--text" onChange={(e) => {setAddress2(e.target.value)}}/>
                              </div>
                              </div>
                          </div>

                          <div className="PayView__list">
                              <div className="PayView__title">신분증사본</div>
                              <div className="PayView__input--file">
                              <input type="text" value={idPhotoName} disabled="true" className="PayView__input--text" />
                              <label for="id-upload" className="PayView__input--button">찾아보기</label>
                              <input id="id-upload" name="idcard" type="file" onChange={profileImageUpload}/>
                              </div>
                          </div>

                          <div className="PayView__list">
                              <div className="PayView__title">통장사본</div>
                              <div className="PayView__input--file">
                              <input type="text" value={bankBookName} disabled="true" className="PayView__input--text" />
                              <label for="bankbook-upload" className="PayView__input--button">찾아보기</label>
                              <input id="bankbook-upload" name="bankbook" type="file" onChange={profileImageUpload}/>
                              
                              </div>
                          </div>
                          </div>

                          <div className="privacy">
                          <div className="privacy__title">
                              <img src={check ?  checkOn : checkOff} onClick={() => setCheck(!check)} className="privacy__checkBox" />
                              개인정보 수집 및 이용에 동의합니다.
                          </div>
                          <div className="privacy__text">
                              회사는 환전의 목적으로 회원 동의 하에 관계 법령에서 정하는 바에 따라 개인정보를 수집할 수 있습니다. (수집된 개인정보는
                              확인 후 폐기 처리합니다.)
                          </div>
                          </div>

                          <button className="privacyButton" onClick={checkExchange}>환전 신청하기</button>
                      </div>
                  </>
              ) : (
                  <React.Fragment>
                      <div className="header">
                          <img src={BackBtn} className="header__button--back" onClick={() => setStatus(0)} />
                          <h1 className="header__title">환전 유의 사항</h1>
                      </div>
                      <div className="content">
                          <div className="exchange">
                          <div className="exchange__list">
                              <i className="exchange__list--icon">∙</i> 회원가입자와 신청자가 일치하지 않을 경우 환전신청 승인이 거절됩니다.
                          </div>
                          <div className="exchange__list">
                              <i className="exchange__list--icon">∙</i> 이전에 등록하신 정보가 있는 경우, 재입력 불편함이 없도록 이전 정보가
                              보여집니다.
                          </div>
                          <div className="exchange__list">
                              <i className="exchange__list--icon">∙</i> 환전신청 내역은 관리자가 확인 후 운영원칙을 위반한 경우는 환전이 거부됩니다.
                          </div>
                          <div className="exchange__list">
                              <i className="exchange__list--icon">∙</i> 입력하신 입금정보가 불일치할 경우 환전되지 않습니다.
                          </div>
                          </div>
                      </div>
                  </React.Fragment>
              )
              
          }
          
          
      </React.Fragment>
  )
}

const bankList = [
  {"text":"산업은행","value":"BK001"},
  {"text":"기업은행","value":"BK002"},
  {"text":"국민은행","value":"BK003"},
  {"text":"수협은행","value":"BK004"},
  {"text":"수출입은행","value":"BK005"},
  {"text":"농협","value":"BK006"},
  {"text":"우리은행","value":"BK007"},
  {"text":"SC제일은행","value":"BK008"},
  {"text":"한국씨티은행","value":"BK009"},
  {"text":"대구은행","value":"BK010"},
  {"text":"부산은행","value":"BK011"},
  {"text":"광주은행","value":"BK012"},
  {"text":"제주은행","value":"BK013"},
  {"text":"전북은행","value":"BK014"},
  {"text":"경남은행","value":"BK015"},
  {"text":"새마을금고중앙회","value":"BK016"},
  {"text":"신협","value":"BK017"},
  {"text":"저축은행","value":"BK018"},
  {"text":"HSBC은행","value":"BK019"},
  {"text":"도이치은행","value":"BK020"},
  {"text":"제이피모간체이스은행","value":"BK021"},
  {"text":"BOA은행","value":"BK022"},
  {"text":"비엔피파리바은행","value":"BK023"},
  {"text":"중국공상은행","value":"BK024"},
  {"text":"산림조합중앙회","value":"BK025"},
  {"text":"중국건설은행","value":"BK026"},
  {"text":"우체국","value":"BK027"},
  {"text":"하나은행","value":"BK028"},
  {"text":"신한은행","value":"BK029"},
  {"text":"케이뱅크","value":"BK030"},
  {"text":"카카오뱅크","value":"BK031"},
  {"text":"KB투자증권","value":"BK032"},
  {"text":"미래에셋증권","value":"BK033"},
  {"text":"메리츠종합금융증권","value":"BK034"},
  {"text":"NH투자증권","value":"BK035"},
  {"text":"유안타증권","value":"BK036"},
  {"text":"KB증권","value":"BK037"},
  {"text":"KTB투자증권","value":"BK038"},
  {"text":"미래에셋대우","value":"BK039"},
  {"text":"삼성증권","value":"BK040"},
  {"text":"한국투자증권","value":"BK041"},
  {"text":"NH투자증권","value":"BK042"},
  {"text":"교보증권","value":"BK043"},
  {"text":"하이투자증권","value":"BK044"},
  {"text":"현대차증권","value":"BK045"},
  {"text":"키움증권","value":"BK046"},
  {"text":"이베스트투자증권","value":"BK047"},
  {"text":"SK증권","value":"BK048"},
  {"text":"대신증권","value":"BK049"},
  {"text":"한화투자증권","value":"BK050"},
  {"text":"하나금융투자","value":"BK051"},
  {"text":"신한금융투자","value":"BK052"},
  {"text":"DB금융투자","value":"BK053"},
  {"text":"유진투자증권","value":"BK054"},
  {"text":"메리츠종합금융증권","value":"BK055"},
  {"text":"부국증권","value":"BK056"},
  {"text":"신영증권","value":"BK057"},
  {"text":"케이프투자증권","value":"BK058"},
  {"text":"펀드온라인코리아","value":"BK059"}
]