import React, { useState, useContext } from 'react'

import { Context } from 'context';

import BackBtn from '../static/ic_back.svg'
import IconNotice from '../static/ic_notice.svg'
import check from '../static/ico-checkbox-off.svg'

import SelectBoxWrap from '../component/select';

export default () => {
    const context = useContext(Context);
    const [status, setStatus] = useState(0);

    const profileImageUpload = (e) => {
        const target = e.currentTarget
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
    
            setPhotoUploading(true)
            setTempPhoto(originalCacheURL)
    
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
                  uploadType: 'profile'
                }
              })
              if (res.result === 'success') {
                setPhotoPath(res.data.path)
                setPhotoUploading(false)
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

                            <p className="myStar__notice">* 별은 500개 이상이어야 환전 신청이 가능하며, 별 1개당 KRW 60으로 환전됩니다.</p>

                            <div className="point">
                                <div className="point__list point__list--left">
                                <div className="point__label">보유 별</div>
                                <div className="point__value">500</div>
                                </div>
                                <div className="point__list">
                                <div className="point__label">환전 신청 별</div>
                                <input type="text" className="point__value  point__value--input" value="90" />
                                </div>
                            </div>

                            <a href="#" className="point__button">
                                환전 계산
                            </a>

                            <div className="pay">
                                <div className="pay__list pay__list--margin">
                                <div className="pay__label pay__label--title">환전 예상 금액</div>
                                <div className="pay__value">KRW 30,000</div>
                                </div>
                                <div className="pay__list">
                                <div className="pay__list--small">원천징수세액</div>
                                <div className="pay__list--small">-990</div>
                                </div>
                                <div className="pay__list">
                                <div className="pay__list--small">이체수수료</div>
                                <div className="pay__list--small">-500</div>
                                </div>
                                <div className="pay__list pay__list--line">
                                <div className="pay__label pay__label--title">환전 실수령액</div>
                                <div className="pay__value">
                                    <div className="pay__value--text">KRW</div> <div className="pay__value--purple">28,510</div>
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
                                <SelectBoxWrap boxList={[{value: 0, text: '주민번호'}]} onChangeEvent={() => console.log('hi')} />
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
                                    <input type="text" value="54789" className="PayView__input--text adressBg" />
                                    <button className="PayView__input--button">주소검색</button>
                                </div>
                                <div className="PayView__address--list">
                                    <input type="text" value="서울시 강남구 삼성1동 56-2" className="PayView__input--text adressBg" />
                                </div>
                                <div className="PayView__address--list">
                                    <input type="text" value="매직킹덤빌딩 801호" className="PayView__input--text" />
                                </div>
                                </div>
                            </div>

                            <div className="PayView__list">
                                <div className="PayView__title">신분증사본</div>
                                <div className="PayView__input--file">
                                <input type="text" value="주민등록등본.pdf" className="PayView__input--text" />
                                <button className="PayView__input--button">찾아보기</button>
                                </div>
                            </div>

                            <div className="PayView__list">
                                <div className="PayView__title">통장사본</div>
                                <div className="PayView__input--file">
                                <input type="text" className="PayView__input--text"></input>
                                <label for="image-upload" className="PayView__input--button">찾아보기</label>
                                <input id="image-upload" type="file" onChange={profileImageUpload}/>
                                
                                </div>
                            </div>
                            </div>

                            <div className="privacy">
                            <div className="privacy__title">
                                <img src={check} className="privacy__checkBox" />
                                개인정보 수집 및 이용에 동의합니다.
                            </div>
                            <div className="privacy__text">
                                회사는 환전의 목적으로 회원 동의 하에 관계 법령에서 정하는 바에 따라 개인정보를 수집할 수 있습니다. (수집된 개인정보는
                                확인 후 폐기 처리합니다.)
                            </div>
                            </div>

                            <button className="privacyButton">환전 신청하기</button>
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