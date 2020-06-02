import React, { useState, useContext, useEffect } from 'react'

import { Context } from 'context';

import BackBtn from './static/ic_back.svg'
import IconNotice from './static/ic_notice.svg'
import checkOff from './static/ico-checkbox-off.svg'
import checkOn from './static/ico-checkbox-on.svg'

import SelectBoxWrap from './component/select';

import Api from 'context/api';
import Message from 'pages/common/message';

import './index.scss';

const initialCalc = {
  basicCash: 0, // 환전예상금액
  benefitCash: null, // 스페셜DJ혜택
  taxCash: 0, // 원천징수세액
  feeCash: 0, // 이체수수료
  realCash: 0 // 환전실수령액
}

export default (props) => {
  const context = useContext(Context);

  const { profile } = context;
  const [isSpecial, setIsSpecial] = useState(false);
  const [byeolCnt, setByeolCnt] = useState(0)
  const [status, setStatus] = useState(0);
  const [check, setCheck] = useState(false); //개인정보 수집 동의
  const [exchangeStar, setExchangeStar] = useState(0); //환전 신청 별
  const [exchangeStarStr, setExchangeStarStr] = useState("0") //환전 신청 별 with comma
  const [exchangeCalc, setExchangeCalc] = useState(initialCalc);

  const [name, setName] = useState("") // 예금주
  const [selectBank, setSelectBank] = useState("0"); // 은행
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
        pathname: "/money_exchange_result",
        state: { ...data }
      })

    } else {
      context.action.alert({
        msg: res.message,
        callback: () => {
          context.action.alert({visible: false})
        }
      })
    }
  }
  
  const checkExchange = () => {
    if(exchangeStar === 0 || !exchangeStar) {
      context.action.alert({
        msg: "환전 신청별은 필수 입력값입니다.",
        callback: () => {
          context.action.alert({visible: false})
        }
      })
      return;
    }
    if(exchangeStar < 570) {
      context.action.alert({
        msg: "환전 신청별은 570개 이상이어야 합니다.",
        callback: () => {
          context.action.alert({visible: false})
        }
      })
      return;
    }
    if( exchangeStar > byeolCnt) {
      context.action.alert({
        msg: "환전 신청별은 보유 별보다 작거나 같아야 합니다.",
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
    if(selectBank === "0") {
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

    if(!check) {
      context.action.alert({
        msg: "개인정보 수집 및 이용에 동의하셔야 환전 신청이 가능합니다.",
        callback: () => {
          context.action.alert({visible: false})
        }
      })
      return;
    }
    
    applyExchange();

  }

  const fnExchangeCalc = async () => {    
    if(exchangeStar === 0) {
      return;
    } else if(!Number.isInteger(parseInt(exchangeStar))){
      return;
    } else if(exchangeStar > byeolCnt) {
      context.action.alert({
        msg: '환전 신청별은 보유 별보다 같거나 작아야 합니다.',
        callback: () => {
          context.action.alert({
            visible: false
          })
        }
      })
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
          msg: "별 개수는 반드시 570개 이상이어야 합니다.",
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

  const serachAddr = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const element_layer = document.getElementById("layer");
    
    new window.daum.Postcode({
      oncomplete: (data) => {
        setAddress1(data.address);
        setZonecode(data.zonecode);

        element_layer.style.display = "none";
      },
      width : '100%',
      height : '100%',
      maxSuggestItems : 5
    }).embed(element_layer);

    element_layer.style.display = "block";
    
    initLayerPosition();
    
    
  }

  const closeDaumPostCode = () => {
    const element_layer = document.getElementById("layer");
    element_layer.style.display = "none";
  }

  const backHandle = () => {
    props.history.goBack()
  }

  const initLayerPosition = () =>{
    var width = 300; //우편번호서비스가 들어갈 element의 width
    var height = 500; //우편번호서비스가 들어갈 element의 height
    var borderWidth = 2; //샘플에서 사용하는 border의 두께
    const element_layer = document.getElementById("layer");
    const closeBtn = document.getElementById("layer__close");
    // 위에서 선언한 값들을 실제 element에 넣는다.
    // element_layer.style.width = width + 'px';
    element_layer.style.height = height + 'px';
    element_layer.style.border = borderWidth + 'px solid';
    // 실행되는 순간의 화면 너비와 높이 값을 가져와서 중앙에 뜰 수 있도록 위치를 계산한다.
    element_layer.style.left = (((window.innerWidth || document.documentElement.clientWidth) - width)/2 - borderWidth) + 'px';
    element_layer.style.top = (((window.screen.height || document.documentElement.clientHeight) - height)/2 - borderWidth - 50) + 'px';
    closeBtn.style.right = (((window.innerWidth || document.documentElement.clientWidth) - width)/2 - borderWidth - 20) + 'px';
    closeBtn.style.top = (((window.screen.height || document.documentElement.clientHeight) - height)/2 - borderWidth - 50) + 'px';
}

const handleChange = (value) => {  
  setExchangeStarStr(Number(value.split(",").join("")).toLocaleString());
  setExchangeStar(Number(value.split(",").join("")));
  
}

const handleSocial = (value) => {
  setFSocialNo(value);
  if(value.length === 6) {
    document.getElementById("bsocialNo").focus();
  }
}

  useEffect(() => {
    if(profile) {
      setByeolCnt(profile.byeolCnt);
      setIsSpecial(profile.isSpecial);
      if(profile.byeolCnt >= 570) {
        setExchangeStar(profile.byeolCnt);
      }
    }
  }, [profile])

  return (
      <React.Fragment>
          {
              status === 0 ? (
                  <>
                      <div className="header">
                          <img src={BackBtn} className="header__button--back" onClick={backHandle} />
                          <h1 className="header__title">환전하기</h1>
                      </div>

                      <div className="content">
                          <div className="myStar">
                          <div className="charge__title">
                              <div className="mystar__title">환전 정보</div>
                              <div className="charge__title--point" onClick={() => setStatus(1)}>
                                환전 안내
                                <img src={IconNotice} className="charge__title--object" />
                              </div>
                          </div>
                          {
                            isSpecial &&
                            <div className="myStar__special">
                              <p className="myStar__special--title">DJ님은 스페셜 DJ 입니다.</p>
                              <p className="myStar__special--point">스페셜 DJ의 경우 환전 실수령액이 5% 추가 됩니다.</p>
                            </div>
                          }
                          <p className="myStar__notice">* 별은 570개 이상이어야 환전 신청이 가능하며, 별 1개당 KRW 60으로 환전됩니다.</p>

                          <div className="point">
                              <div className="point__list point__list--left">
                              <div className="point__label">보유 별</div>
                              <div className="point__value">{Number(byeolCnt).toLocaleString()}</div>
                              </div>
                              <div className="point__list">
                              <div className="point__label">환전 신청 별</div>
                              <input type="text" value={exchangeStar.toLocaleString()} className="point__value  point__value--input" onChange={(e) => handleChange(e.target.value)} />
                              </div>
                          </div>

                          <a className="point__button" onClick={fnExchangeCalc}>
                              환전 계산
                          </a>

                          <div className="pay">
                              <div className="pay__list pay__list--margin">
                                <div className="pay__label pay__label--title">환전 예상 금액</div>
                                <div className="pay__value">{Number(exchangeCalc.basicCash).toLocaleString()}</div>
                              </div>
                              {
                                exchangeCalc.benefitCash &&
                                exchangeCalc.benefitCash > 0 ?
                                (<div className="pay__list">
                                  <div className="pay__list--small">스페셜DJ 혜택(+5%)</div>
                                  <div className="pay__list--small">+{Number(exchangeCalc.benefitCash).toLocaleString()}</div>
                                </div>)
                                : (<> </>)
                              }
                              <div className="pay__list">
                                <div className="pay__list--small">원천징수세액</div>
                                <div className="pay__list--small">-{Number(exchangeCalc.taxCash).toLocaleString()}</div>
                              </div>
                              <div className="pay__list">
                                <div className="pay__list--small">이체수수료</div>
                                <div className="pay__list--small">-{Number(exchangeCalc.feeCash).toLocaleString()}</div>
                              </div>
                              <div className="pay__list pay__list--line">
                                <div className="pay__label pay__label--title">환전 실수령액</div>
                                <div className="pay__value">
                                  <div className="pay__value--text">KRW</div>
                                  <div className="pay__value--purple">{Number(exchangeCalc.realCash).toLocaleString()}</div>
                                </div>
                              </div>
                          </div>
                          </div>

                          <div className="comon__title">입금 정보</div>

                          <div className="PayView">
                          <div className="PayView__list">
                              <div className="PayView__title">예금주</div>
                              <div className="PayView__input">
                              <input type="text" className="PayView__input--text" onChange={(e) => setName(e.target.value)} />
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
                              <input type="number" pattern="[0-9]*" className="PayView__input--text" onChange={(e) => setAccount(e.target.value)} />
                              </div>
                          </div>

                          <div className="PayView__list">
                              <div className="PayView__title">주민등록번호</div>
                              <div className="PayView__input--nomber">
                              <input type="tel" pattern="[0-9]*" maxLength="6" className="PayView__input--text" onChange={(e) => handleSocial(e.target.value)} />
                              <span className="PayView__input--line">-</span>
                              <input type="password" maxLength="7" id="bsocialNo" className="PayView__input--text" onChange={(e) => setBSocialNo(e.target.value)} />
                              </div>
                          </div>

                          <div className="PayView__list">
                              <div className="PayView__title">전화번호</div>
                              <div className="PayView__input">
                              <input type="tel" pattern="[0-9]*" maxLength="11" className="PayView__input--text" onChange={(e) => setPhone(e.target.value)} />
                              </div>
                          </div>
                          <div className="PayView__list">
                              <div className="PayView__title">주소</div>
                              <div className="PayView__input">
                              <div className="PayView__address--list" onClick={(e) => serachAddr(e)}>
                                  <input type="text" className="PayView__input--text adressBg" disabled={true} value={zonecode}/>
                                  <button className="PayView__input--button" onClick={(e) => serachAddr(e)}>주소검색</button>
                              </div>
                              <div className="PayView__address--list" onClick={(e) => serachAddr(e)}>
                                  <input type="text" value={address1} className="PayView__input--text adressBg" disabled={true} />
                              </div>
                              <div className="PayView__address--list">
                                  <input type="text" className="PayView__input--text" onChange={(e) => {setAddress2(e.target.value)}}/>
                              </div>
                              </div>
                          </div>

                          <div className="PayView__list">
                              <div className="PayView__title">신분증사본</div>
                              <div className="PayView__input--file">
                              <label htmlFor="id-upload-text" className="PayView__input--label">
                                {
                                  idPhotoName !== "" ? 
                                  idPhotoName : "신분증사본을 첨부해주세요"
                                }
                              </label>
                              <input type="file" name="idcard" id="id-upload-text" className="PayView__input--text" placeholder="신분증사본을 첨부해주세요" onChange={profileImageUpload} />
                              <label htmlFor="id-upload" className="PayView__input--button">찾아보기</label>
                              <input id="id-upload" name="idcard" type="file" onChange={profileImageUpload}/>
                              </div>
                          </div>

                          <div className="PayView__list">
                              <div className="PayView__title">통장사본</div>
                              <div className="PayView__input--file">
                                <label htmlFor="bankbook-upload-text" className="PayView__input--label">
                                  {
                                    bankBookName !== "" ? 
                                    bankBookName : "통장사본을 첨부해주세요"
                                  }
                                </label>
                                
                                <input type="file" name="bankbook" id="bankbook-upload-text" className="PayView__input--text" placeholder="통장사본을 첨부해주세요" onChange={profileImageUpload} />
                                <label htmlFor="bankbook-upload" className="PayView__input--button">찾아보기</label>
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
                          <h1 className="header__title">환전 안내</h1>
                      </div>
                      <div className="content">
                        <div className="exchange">
                          <div className="exchange__list">
                            <div className="exchange__list--title">◈ 환전은?</div>
                            <div className="exchange__list--gray">
                              방송 중 DJ가 타회원에게 받은 "별"선물을 현금으로 전환하는 것입니다.
                              <br />방송에서 보유한 "별"은 1개당 60KRW으로 환전 됩니다. 
                              <br />또한, 보유한 "별"은 570별 이상부터 환전 신청이 가능합니다.
                              <br />(원천징수세액 3.3%, 이체수수료 500원 제외) 
                              <br />★ 보유한 “별”은 최종 선물을 받은 일을 기준으로 12개월이 지나면 소멸됩니다.
                            </div>
                          </div>
                          <div className="exchange__list">
                            <div className="exchange__list--title">◈ 환전방법</div>
                            <div className="exchange__list--gray">
                              1.	(세금신고를 위해) 환전 신청자는 본인확인을 위한 정확한 정보를 입력합니다.
                              <br/>2.	본인확인은 본인임을 증명할 신분증을 첨부합니다. 
                              <br/>(주민등록증, 운전면허증, 주민등록등본, 여권 등 사본)
                              <br/>3.	환전처리 후 입금할 본인통장 사본을 첨부합니다.
                              <br/>4.	[환전 신청하기]버튼을 클릭하면 신청완료!!
                              <br/>5.	스페셜 DJ의 경우 일반회원과의 차별화된 환전정책을 제공합니다.
                            </div>
                          </div>
                          <div className="exchange__list">
                            <div className="exchange__list--title">◈ 환전신청 후 입금일정</div>
                            <div className="exchange__list--gray">
                              -	환전 신청 마감 : 매 주 일요일, 수요일 (주2회)
                              <br />-	서류확인 및 입금 : 일요일까지 신청 건은 월요일, 수요일까지 신청 건은 목요일 순차적으로 처리됩니다.
                              <br />-	단, 신청자가 많을 경우나 공휴일인 경우 다음날 환전처리가 될 수 있습니다.
                              <br />※ 운영자 검토 후 입력된 통장으로 현금이 입금되고, 입금 후에는 휴대폰 SMS를 통해 확인이 가능합니다.
                              <br />(SMS결과는 휴대폰 연락처가 있는 회원에게만 발송하여 드립니다.)
                            </div>
                          </div>
                          <div className="exchange__list">
                            <div className="exchange__list--title">◈ 유의사항</div>
                            <div className="exchange__list--gray">
                              1. 입금정보는 개인소득신고용으로 사용되는 필수 입력 정보입니다.
                              <br />2. 회원가입자와 신청자가 일치하지 않을 경우 환전 승인이 거부됩니다.
                              <br />3. 입력하신 입금정보가 증빙서류와 일치하지 않은 경우 환전 승인이 거부됩니다.
                              <br />4. 환전 신청 시 입력한 정보는 재입력의 불편함이 없도록 입금정보가 암호화되어 저장됩니다.
                              <br /><span className="exchange__list--red">5. 부정적인 행위로 수집된 “달”, “별”에 대한 정황이 포착될 경우 환전 승인이 거부됩니다.</span>
                              <br /><span className="exchange__list--red">6. 운영정책을 위반하여 정지 상태 회원은 환전 승인이 거부됩니다.</span>
                              <br />7. 미성년자 환전 신청 시 부모동의 또는 가족관계 증명서를 추가 요청할 수 있습니다.
                            </div>
                          </div>
                          <div className="exchange__list">
                            <div className="exchange__list--title">◈ 환전 불가 서류</div>
                            <div className="exchange__list--gray">
                              - (X) 정보 확인이 불분명한 서류 
                              <br />- (X) 학생증 
                              <br />- (X) 건강보험증 
                              <br />- (X) 기타 민간 자격증 
                              <br />- (X) 수기 작성한 서류 
                              <br />- (X) 기타 기준에 부합하지 않은 모든 서류
                            </div>
                          </div>
                          <div className="exchange__list">
                            <div>※ 해당 환전 정책은 서비스 진행 중이더라도 변경될 수 있고, 정책 변경 시 회원에 대한 고지 후 변경정책에 따른 서비스를 진행할 수 있습니다.</div>
                          </div>
                          <div className="exchange__list">
                            <div>※ 아이템 선물을 원하는 회원께서는 “별”을 "달"로 교환하여 이용이 가능합니다.</div>
                          </div>
                          <div className="exchange__list">
                            <div>
                              - 별을 달로 교환하는 방법 : “마이페이지>내지갑>별”에서 [달교환] 버튼을 클릭하시면
                              즉시 처리되어 아이템선물이 가능합니다. (수수료 없음)
                            </div>
                          </div>
                        </div>
                      </div>
                  </React.Fragment>
              )
              
          }
          <div id="layer">
            <button id="layer__close" onClick={closeDaumPostCode}>X</button>
          </div>
          <Message />
      </React.Fragment>
  )
}

const bankList = [
  {"text":"은행명", "value":"0"},
  {"text":"경남은행","value":"39"},
  {"text":"광주은행","value":"34"},
  {"text":"국민은행","value":"4"},
  {"text":"기업은행","value":"3"},
  {"text":"농협","value":"11"},
  {"text":"대구은행","value":"31"},
  {"text":"도이치은행","value":"55"},
  {"text":"부산은행","value":"32"},
  {"text":"비엔피파리바은행","value":"61"},
  {"text":"산림조합중앙회","value":"64"},
  {"text":"산업은행","value":"2"},
  {"text":"저축은행","value":"50"},
  {"text":"새마을금고중앙회","value":"45"},
  {"text":"수출입은행","value":"8"},
  {"text":"수협은행","value":"7"},
  {"text":"신한은행","value":"88"},
  {"text":"신협","value":"48"},
  {"text":"우리은행","value":"20"},
  {"text":"우체국","value":"71"},
  {"text":"전북은행","value":"37"},
  {"text":"제주은행","value":"35"},
  {"text":"중국건설은행","value":"67"},
  {"text":"중국공상은행","value":"62"},
  {"text":"카카오뱅크","value":"90"},
  {"text":"케이뱅크","value":"89"},
  {"text":"펀드온라인코리아","value":"294"},
  {"text":"한국씨티은행","value":"27"},
  {"text":"BOA은행","value":"60"},
  {"text":"HSBC은행","value":"54"},
  {"text":"제이피모간체이스은행","value":"57"},
  {"text":"하나은행","value":"81"},
  {"text":"SC제일은행","value":"23"},
  {"text":"NH투자증권","value":"247"},
  {"text":"교보증권","value":"261"},
  {"text":"대신증권","value":"267"},
  {"text":"메리츠종합금융증권","value":"287"},
  {"text":"미래에셋대우","value":"238"},
  {"text":"부국증권","value":"290"},
  {"text":"삼성증권","value":"240"},
  {"text":"신영증권","value":"291"},
  {"text":"신한금융투자","value":"278"},
  {"text":"유안타증권","value":"209"},
  {"text":"유진투자증권","value":"280"},
  {"text":"이베스트투자증권","value":"265"},
  {"text":"케이프투자증권","value":"292"},
  {"text":"키움증권","value":"264"},
  {"text":"하나금융투자","value":"270"},
  {"text":"하이투자증권","value":"262"},
  {"text":"한국투자증권","value":"243"},
  {"text":"한화투자증권","value":"269"},
  {"text":"현대차증권","value":"263"},
  {"text":"DB금융투자","value":"279"},
  {"text":"KB증권","value":"218"},
  {"text":"KTB투자증권","value":"227"},
  {"text":"SK증권","value":"266"},
]