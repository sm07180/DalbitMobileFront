import React, {useCallback, useEffect, useRef, useState} from 'react'
import DalbitCheckbox from 'components/ui/dalbit_checkbox'
import DalbitCropper from 'components/ui/dalbit_cropper'
import Api from 'context/api'
import {useHistory} from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

function NoticeInsertCompnent(props) {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const {memNo, fetchData, setPhotoUploading} = props
  const history = useHistory()

  const inputRef = useRef()
  //크롭퍼 state
  const [image, setImage] = useState(null)
  const [cropOpen, setCropOpen] = useState(false)
  const [eventObj, setEventObj] = useState(null)
  const [activeState, setActiveState] = useState(false)
  const [thumbNail, setThumbNail] = useState(null)

  //state
  const [formState, setFormState] = useState({
    title: '',
    contents: '',
    isTop: false,
    imagePath: ''
  })

  const onChange = (e) => {
    const {value, name} = e.target

    setFormState({
      ...formState,
      [name]: value
    })
  }

  const changeCheckStatus = useCallback(() => {
    setFormState({
      ...formState,
      isTop: !formState.isTop
    })
  }, [formState])

  const insettNorice = useCallback(async () => {
    if (formState.title === '') {
      dispatch(setGlobalCtxMessage({
        visible: true,
        type: 'alert',
        msg: `제목을 입력해주세요.`
      }))
    } else if (formState.contents === '') {
      dispatch(setGlobalCtxMessage({
        visible: true,
        type: 'alert',
        msg: `내용을 입력해주세요.`
      }))
    }

    const {result, data, message} = await Api.mypage_notice_upload({
      data: {
        ...formState,
        memNo: memNo,
        imagePath: thumbNail !== null ? thumbNail.path : ''
      }
    })

    if (result === 'success') {
      dispatch(setGlobalCtxMessage({
        visible: true,
        type: 'alert',
        msg: message,
        callback: () => {
          history.goBack()
        }
      }))

      fetchData()
    }
  }, [formState, memNo, image])

  const ButtonActive = () => {
    if (formState.title !== '' && formState.contents !== '') {
      setActiveState(true)
    } else {
      setActiveState(false)
    }
  }
  //---------------------------------------------------------------------
  useEffect(() => {
    ButtonActive()
  }, [formState])

  useEffect(() => {
    if (image !== null) {
      if (image.status === false) {
        dispatch(setGlobalCtxMessage({
          status: true,
          type: 'alert',
          content: image.content,
          callback: () => {
            return
          }
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
            setThumbNail(data)
            setImage(null)
            setPhotoUploading(false)
          } else {
            dispatch(setGlobalCtxMessage({
              visible: true,
              type: 'alert',
              msg: message
            }))
          }
        }
        imageUpload()
      }
    }
  }, [image])

  return (
    <div className="noticeWrite">
      <input
        value={formState.title}
        placeholder="공지사항 제목을 입력해주세요"
        className="noticeWrite__title"
        name="title"
        onChange={(e) => {
          if (e.target.value.length > 20) return
          else onChange(e)
        }}
      />
      <textarea
        value={formState.contents}
        name="contents"
        onChange={(e) => {
          if (e.target.value.length > 500) return
          else onChange(e)
        }}
        className="noticeWrite__content"
        placeholder="작성하고자 하는 글의 내용을 입력해주세요."
      />
      <label className="noticeWrite__checkbox">
        <DalbitCheckbox size={20} callback={changeCheckStatus} status={formState.isTop} />
        상단 고정
      </label>
      <div className="saveFileImg">
        <label
          htmlFor="save_fileImg"
          style={{
            background: `url("${
              thumbNail !== null ? thumbNail.url : 'https://image.dallalive.com/svg/gallery_w.svg'
            }") center 19px no-repeat #bdbdbd`
          }}
          className={`fileBasic ${thumbNail !== null ? 'fileOn' : ''}`}></label>

        {thumbNail !== null && (
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
      <button className={`noticeWrite__button ${activeState && 'active'}`} onClick={insettNorice}>
        등록
      </button>
    </div>
  )
}

export default NoticeInsertCompnent
