import React, {useCallback, useContext, useEffect, useRef, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {KnowHowContext} from '../store'
import Api from 'context/api'

import {DEVICE_TYPE} from '../constant'
import {InspectionCheckWithAlert} from '../common_fn'

import uploadIcon from '../static/gallery_g.svg'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

let ImgHeight = 0
const DeviceArr = [
  {value: DEVICE_TYPE.DESKTOP, text: '데스크탑'},
  {value: DEVICE_TYPE.NOTEBOOK, text: '노트북/맥북'},
  {value: DEVICE_TYPE.AOS, text: '안드로이드폰'},
  {value: DEVICE_TYPE.IOS, text: '아이폰'},
  {value: DEVICE_TYPE.TABLET, text: '태블릿'}
]

function AttendAdd() {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const {KnowHowState, KnowHowAction} = useContext(KnowHowContext)

  const {mine, condition, order, list} = KnowHowState

  const setList = KnowHowAction.setList
  const setMyCnt = KnowHowAction.setMyCnt

  const history = useHistory()
  const params = useParams()
  const [device, setDevice] = useState(-1)
  const [inspection, setInspection] = useState(false)

  const [title, setTitle] = useState('')
  const [contents, setContents] = useState('')
  const [additional, setAdditional] = useState({
    device1: '',
    device2: ''
  })

  const [uploadFile, setUploadFile] = useState([false, false, false])

  const [modifyIdx, setModifyIdx] = useState(-1)

  const TextareaRef = useRef()
  const ImgRef = useRef()

  const fetchData = useCallback(async () => {
    const res = await Api.knowhow_detail({
      idx: params.num,
      is_detail: 0
    })

    if (res.result === 'success') {
      const detail = res.data.detail
      setDevice(parseInt(detail.slct_device))
      setAdditional({
        device1: detail.device1,
        device2: detail.device2
      })
      setTitle(detail.title)
      setContents(detail.contents)
      setUploadFile([
        detail.image_url,
        detail.image_url2 === '' ? false : detail.image_url2,
        detail.image_url3 === '' ? false : detail.image_url3
      ])
    }
  }, [])

  const MakeDeviceWrap = () => {
    return DeviceArr.map((v, idx) => {
      return (
        <button
          key={idx}
          className={`${v.value === device && 'active'}`}
          onClick={() => {
            setDevice(v.value)
          }}>
          {v.text}
        </button>
      )
    })
  }

  function uploadSingleFile(e, idx) {
    const target = e.currentTarget
    if (target.files.length === 0) return
    let reader = new FileReader()
    const file = target.files[0]
    const fileName = file.name
    const fileSplited = fileName.split('.')
    const fileExtension = fileSplited.pop()
    //const list = ['jpg', 'jpeg', 'png', 'PNG']
    const extValidator = (ext) => {
      const list = ['jpg', 'jpeg', 'png', 'PNG']
      return list.includes(ext)
    }
    if (!extValidator(fileExtension)) {
      return dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: 'jpg, png 이미지만 사용 가능합니다.',
        title: '',
        callback: () => {
          dispatch(setGlobalCtxMessage({type: "alert", visible: false}))
        }
      }))
    }
    reader.readAsDataURL(target.files[0])
    reader.onload = async () => {
      if (reader.result) {
        const res = await Api.image_upload({
          data: {
            dataURL: reader.result,
            uploadType: 'event-photo'
          }
        })
        if (res.result === 'success' && res.code === '0') {
          setUploadFile(
            uploadFile.map((v, i) => {
              if (i === idx) {
                return res.data.url
              } else {
                return v
              }
            })
          )
          console.log(res.data.url)
        } else {
          dispatch(setGlobalCtxMessage({
            type: "alert",
            msg: res.message,
            title: '',
            callback: () => {
              dispatch(setGlobalCtxMessage({type: "alert", visible: false}))
            }
          }))
        }
      }
    }
  }

  function deleteFile(e, idx) {
    e.preventDefault()

    dispatch(setGlobalCtxMessage({
      type: "confirm",
      msg: '첨부파일을 삭제하시겠습니까?\n삭제된 파일은 복원되지 않습니다.',
      callback: () => {
        document.getElementById('img' + idx).value = ''
        const uploadFileClone = uploadFile
          .map((v, i) => {
            if (i === idx) {
              return false
            } else {
              return v
            }
          })
          .filter((v) => {
            return v
          })

        uploadFileClone.length === 0
          ? setUploadFile([false, false, false])
          : setUploadFile(
              uploadFileClone
                .map((v, i, self) => {
                  if (self.length - 1 === i) {
                    if (self.length < 3) {
                      if (self.length === 1) {
                        return [v, false, false]
                      } else if (self.length === 2) {
                        return [v, false]
                      }
                    } else {
                      return v
                    }
                  } else {
                    return v
                  }
                })
                .flat()
          )
        dispatch(setGlobalCtxMessage({type: "confirm", visible: false}))
      },
      cancelCallback: () => {
        dispatch(setGlobalCtxMessage({type: "confirm", visible: false}))
      },
      buttonText: {
        left: '취소',
        right: '삭제'
      }
    }))
  }

  const insertKnowHow = useCallback(async () => {
    const result = InspectionCheckWithAlert(device, additional, title, contents, uploadFile)
    if (result.status === true) {
      const res = await Api.knowhow_insert({
        slct_device: device,
        device1: additional.device1,
        device2: additional.device2,
        title: title,
        contents: contents,
        image_url: uploadFile[0],
        image_url2: uploadFile[1] === false ? '' : uploadFile[1],
        image_url3: uploadFile[2] === false ? '' : uploadFile[2]
      })

      if (res.result === 'success') {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: '참여 완료하였습니다.',
          callback: async () => {
            const listRes = await Api.knowhow_list({
              page: 1,
              records: 10000,
              slct_type: mine,
              slct_platform: condition,
              slct_order: order
            })

            if (listRes.result === 'success') {
              setList(listRes.data.list)
              setMyCnt(listRes.data.myCnt)
            }

            history.goBack()
          }
        }))
      } else {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: '노하우 등록에 실패하셧습니다'
        }))
      }
    } else {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: result.msg
      }))
    }
  }, [title, contents, uploadFile, additional, device, globalState.token])

  const modifyKnowHow = useCallback(async () => {
    const result = InspectionCheckWithAlert(device, additional, title, contents, uploadFile)
    if (result.status === true) {
      const res = await Api.knowhow_modify({
        idx: modifyIdx,
        slct_device: device,
        device1: additional.device1,
        device2: additional.device2,
        title: title,
        contents: contents,
        image_url: uploadFile[0],
        image_url2: uploadFile[1] === false ? '' : uploadFile[1],
        image_url3: uploadFile[2] === false ? '' : uploadFile[2]
      })

      if (res.result === 'success') {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: '수정 완료하였습니다.',
          callback: () => {
            const findModifyList = list.findIndex((v) => {
              return v.idx === parseInt(modifyIdx)
            })
            if (findModifyList !== -1) {
              list[findModifyList] = {
                ...list[findModifyList],
                title: title,
                slct_device: device,
                image_url: uploadFile[0]
              }

              setList(list)
            }
            history.goBack()
          }
        }))
      } else {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: '노하우 등록에 실패하셧습니다'
        }))
      }
    } else {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: result.msg
      }))
    }
  }, [title, contents, uploadFile, additional, device])

  useEffect(() => {
    if (device !== -1 && title !== '' && contents !== '' && uploadFile[0] !== false && additional.device1 !== '')
      setInspection(true)
    else setInspection(false)
  }, [title, contents, uploadFile, additional, device])

  useEffect(() => {
    if (TextareaRef.current) {
      TextareaRef.current.style.height = 'auto'
      TextareaRef.current.style.height = TextareaRef.current.scrollHeight + 2 + 'px'
    }
  }, [contents])

  useEffect(() => {
    if (!globalState.token.isLogin) {
      history.push('/login')
    }

    if (params.num) {
      setModifyIdx(params.num)
      fetchData()
    }
    if (ImgRef.current) {
      ImgHeight = ImgRef.current.offsetWidth + 'px'
    }
  }, [])

  return (
    <>
      <div className="title_2">
        <h2>{modifyIdx !== -1 ? '방송 노하우 수정' : '방송 노하우 등록'}</h2>
        <button
          onClick={() => {
            history.goBack()
          }}>
          닫기
        </button>
      </div>
      <div className="attendAddWrap">
        <div className="attendAddWrap__condition">
          <div className="attendAddWrap__commonTitle">
            <span>디바이스 선택</span>
            <span>본인의 방송 디바이스를 선택해주세요</span>
          </div>
          <div className="attendAddWrap__condition--buttons">{MakeDeviceWrap()}</div>
        </div>
        {device !== -1 && (
          <div className="attendAddWrap__inputWrap">
            <div className="attendAddWrap__inputWrap--additional">
              {device === DEVICE_TYPE.DESKTOP || device === DEVICE_TYPE.NOTEBOOK ? (
                <>
                  <div className="attendAddWrap__inputWrap--input">
                    <span>마이크</span>
                    <input
                      type="text"
                      placeholder="제품명을 입력해 주세요."
                      value={additional.device1}
                      onChange={(e) => {
                        if (e.target.value.length <= 30) setAdditional({...additional, device1: e.target.value})
                      }}
                    />
                  </div>
                  <div className="attendAddWrap__inputWrap--input">
                    <span>믹서/오인페</span>
                    <input
                      type="text"
                      placeholder="제품명을 입력해 주세요."
                      value={additional.device2}
                      onChange={(e) => {
                        if (e.target.value.length <= 30) setAdditional({...additional, device2: e.target.value})
                      }}
                    />
                  </div>
                  <span>∙ 믹서/오디오 인터페이스는 사용 중일 경우에만 입력</span>
                </>
              ) : (
                <>
                  <div className="attendAddWrap__inputWrap--input">
                    <span>기종</span>
                    <input
                      type="text"
                      placeholder="제품명을 입력해 주세요."
                      value={additional.device1}
                      onChange={(e) => {
                        if (e.target.value.length <= 30) setAdditional({...additional, device1: e.target.value})
                      }}
                    />
                  </div>
                  <div className="attendAddWrap__inputWrap--input">
                    <span>외부 스피커</span>
                    <input
                      type="text"
                      placeholder="제품명을 입력해 주세요."
                      value={additional.device2}
                      onChange={(e) => {
                        if (e.target.value.length <= 30) setAdditional({...additional, device2: e.target.value})
                      }}
                    />
                  </div>
                  <span>∙ 외부 스피커는 사용 중일 경우에만 입력</span>
                </>
              )}
            </div>
            <div>
              <div className="attendAddWrap__commonTitle">
                <span>노하우 제목</span>
                <span>{title.length}/30</span>
              </div>
              <input
                type="text"
                className="attendAddWrap__commonTitle--title"
                value={title}
                placeholder="제목을 입력해주세요."
                onChange={(e) => {
                  if (e.target.value.length <= 30) setTitle(e.target.value)
                }}
              />
            </div>
            <div>
              <div className="attendAddWrap__commonTitle">
                <span>노하우 내용</span>
                <span>{contents.length}/1,000</span>
              </div>
              <textarea
                ref={TextareaRef}
                className="attendAddWrap__commonTitle--contents"
                value={contents}
                placeholder="내용을 작성해주세요. (나만의 방송 노하우, 제품 추천
                  등)"
                onChange={(e) => {
                  if (e.target.value.length <= 1000) setContents(e.target.value)
                }}
              />
            </div>
          </div>
        )}
        <div className="">
          <div className="attendAddWrap__commonTitle">
            <span>이미지 등록</span>
            <span>가로가 긴 이미지를 권장합니다. (최대 3장)</span>
          </div>
          <div className="attendAddWrap__imgWrap">
            <label
              ref={ImgRef}
              htmlFor="img0"
              className={`attendAddWrap__imgWrap--label ${uploadFile[0] !== false && 'black'}`}
              style={{height: ImgHeight}}>
              <span className="attendAddWrap__imgWrap--necessary">필수</span>
              {uploadFile[0] === false ? (
                <>
                  <img src={uploadIcon} />
                  <span className="attendAddWrap__imgWrap--uploadButton">사진등록</span>
                </>
              ) : (
                <img src={uploadFile[0]} className="attendAddWrap__imgWrap--uploadImg" style={{height: ImgHeight}} />
              )}
            </label>
            <input type="file" id="img0" onChange={(e) => uploadSingleFile(e, 0)} />
            <label
              htmlFor="img1"
              className={`attendAddWrap__imgWrap--label ${uploadFile[1] !== false && 'black'}`}
              style={{height: ImgHeight}}>
              {uploadFile[1] === false ? (
                <>
                  <img src={uploadIcon} />
                  <span className="attendAddWrap__imgWrap--uploadButton">사진등록</span>
                </>
              ) : (
                <>
                  <img src={uploadFile[1]} className="attendAddWrap__imgWrap--uploadImg" />
                  <span
                    className="attendAddWrap__imgWrap--deleteBtn"
                    onClick={(e) => {
                      deleteFile(e, 1)
                    }}
                  />
                </>
              )}
            </label>
            <input type="file" id="img1" onChange={(e) => uploadSingleFile(e, 1)} />
            <label
              htmlFor="img2"
              className={`attendAddWrap__imgWrap--label ${uploadFile[2] !== false && 'black'}`}
              style={{height: ImgHeight}}>
              {uploadFile[2] === false ? (
                <>
                  <img src={uploadIcon} />
                  <span className="attendAddWrap__imgWrap--uploadButton">사진등록</span>
                </>
              ) : (
                <>
                  <img src={uploadFile[2]} className="attendAddWrap__imgWrap--uploadImg" style={{height: ImgHeight}} />
                  <span
                    className="attendAddWrap__imgWrap--deleteBtn"
                    onClick={(e) => {
                      deleteFile(e, 2)
                    }}
                  />
                </>
              )}
            </label>
            <input type="file" id="img2" onChange={(e) => uploadSingleFile(e, 2)} />
          </div>
        </div>
        <button
          className={`attendAddWrap__addBtn ${inspection === true && 'active'}`}
          onClick={() => {
            if (modifyIdx !== -1) {
              modifyKnowHow()
            } else {
              insertKnowHow()
            }
          }}>
          {modifyIdx !== -1 ? '수정하기' : '등록하기'}
        </button>
      </div>
    </>
  )
}

export default React.memo(AttendAdd)
