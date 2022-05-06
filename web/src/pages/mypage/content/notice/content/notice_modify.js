import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import DalbitCheckbox from 'components/ui/dalbit_checkbox'
import DalbitCropper from 'components/ui/dalbit_cropper'
import Api from 'context/api'

import {PHOTO_SERVER} from 'context/config'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

function ModifyNoticeCompnents(props) {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const {modifyItem, setPhotoUploading, setNoticeList, noticeList} = props

  const {memNo, addpage} = useParams()
  const history = useHistory()
  const inputRef = useRef()

  //크롭퍼 state
  const [image, setImage] = useState(null)
  const [cropOpen, setCropOpen] = useState(false)
  const [eventObj, setEventObj] = useState(null)
  const [thumbNail, setThumbNail] = useState({
    path: modifyItem ? modifyItem.imagePath : ''
  })

  const [isTop, setIsTop] = useState(modifyItem ? modifyItem.isTop : false)

  const [inputs, setInputs] = useState({
    ...modifyItem
  })

  //버튼 활성화

  const activeState = useMemo(() => {
    if (inputs && inputs.title !== '' && inputs.contents !== '') {
      return true
    } else {
      return false
    }
  }, [inputs])

  const onChange = useCallback(
    (e) => {
      const {value, name} = e.target

      setInputs({
        ...inputs,
        [name]: value
      })
    },
    [inputs]
  )
  const changeCheckStatus = useCallback(() => {
    setIsTop(!isTop)
  }, [isTop])

  const ModionSubmit = useCallback(async () => {
    const {result, data, message} = await Api.mypage_notice_edit({
      data: {
        ...inputs,
        memNo: memNo,
        isTop: isTop,
        imagePath: thumbNail !== null ? thumbNail.path : ''
      }
    })
    if (result === 'success') {
      dispatch(setGlobalCtxMessage({
        visible: true,
        type: 'alert',
        msg: message,
        callback: () => {
          setNoticeList(
            noticeList.map((v) => {
              if (v.noticeIdx === inputs.noticeIdx) {
                return {
                  ...inputs,
                  imagePath: thumbNail !== null ? thumbNail.path : '',
                  isTop: isTop
                }
              }
              return v
            })
          )
          setTimeout(() => {
            history.goBack()
          })
        }
      }))
    }
  }, [inputs, memNo, thumbNail, isTop])

  useEffect(() => {
    if (image !== null) {
      if (image.status === false) {
        dispatch(setGlobalCtxMessage({
          visible: true,
          type: 'alert',
          msg: image.content
        }))
      } else {
        setPhotoUploading(true)
        const imageUpload = async () => {
          const {result, data, message} = await Api.image_upload({
            data: {
              dataURL: image.content,
              uploadType: 'room'
            }
          })
          if (result === 'success') {
            document.getElementById('save_fileImg').value = ''
            setImage(null)
            setThumbNail(data)
            setPhotoUploading(false)
          } else {
            dispatch(setGlobalCtxMessage({
              visible: true,
              type: 'alert',
              msg: data.message,
              callback: () => {
                history.goBack()
              }
            }))
          }
        }
        imageUpload()
      }
    }
  }, [image])

  //---------------------------------------------------------------------

  return (
    <>
      {inputs !== null && (
        <div className="noticeWrite">
          <input
            placeholder="공지사항 제목을 입력해주세요"
            onChange={(e) => {
              if (e.target.value.length > 20) return
              else onChange(e)
            }}
            value={inputs.title}
            name="title"
            className="noticeWrite__title"
          />
          <textarea
            value={inputs.contents}
            placeholder="공지사항 내용을 입력해주세요"
            onChange={(e) => {
              if (e.target.value.length > 500) return
              else onChange(e)
            }}
            name="contents"
            className="noticeWrite__content"
          />

          <label className="noticeWrite__checkbox">
            <DalbitCheckbox size={20} callback={changeCheckStatus} status={isTop} />
            상단 고정
          </label>

          <div className="saveFileImg">
            <label
              htmlFor="save_fileImg"
              className={`modifyBasic ${thumbNail !== null && thumbNail.path !== '' ? '' : 'modifyFileOn'}`}
              style={{
                backgroundImage: `url("${
                  thumbNail !== null && thumbNail.path !== ''
                    ? `${PHOTO_SERVER}${thumbNail.path}`
                    : 'https://image.dalbitlive.com/svg/gallery_w.svg'

                  // inputs.imagePath === ""
                  //   ? thumbNail !== null
                  //     ? thumbNail.url
                  //     : "https://image.dalbitlive.com/svg/gallery_w.svg"
                  //   : `${PHOTO_SERVER}${inputs.imagePath}`
                }")`
              }}></label>

            {thumbNail !== null && thumbNail.path !== '' && (
              <button
                className="saveFileImgClose"
                onClick={(e) => {
                  e.stopPropagation()
                  setImage(null)
                  setThumbNail(null)
                }}>
                첨부이미지 닫기
              </button>
            )}

            <input
              ref={inputRef}
              type="file"
              id="save_fileImg"
              onChange={(e) => {
                e.persist()
                setEventObj(e)
                setCropOpen(true)
              }}
            />
          </div>

          {cropOpen && eventObj !== null && (
            <DalbitCropper
              imgInfo={eventObj}
              onClose={() => {
                setCropOpen(false)
                if (inputRef && inputRef.current) {
                  inputRef.current.value = ''
                }
              }}
              onCrop={(value) => setImage(value)}
            />
          )}

          <button className={`modifyButton ${activeState && 'active'}`} onClick={ModionSubmit}>
            수정
          </button>
        </div>
      )}
    </>
  )
}

export default ModifyNoticeCompnents
