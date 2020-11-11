import React, {useState, useCallback, useEffect, useContext} from 'react'
import DalbitCheckbox from 'components/ui/dalbit_checkbox'
import DalbitCropper from 'components/ui/dalbit_cropper'
import Api from 'context/api'
import {Context} from 'context'

function NoticeInsertCompnent(props) {
  const {setIsAdd, memNo, getNotice, setIsList, customName, setPhotoUploading} = props
  const context = useContext(Context)

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

  const insertNotice = useCallback(async () => {
    if (formState.title === '') {
      context.action.alert({
        msg: '제목을 입력해주세요.',
        callback: () => {
          return
        }
      })
    } else if (formState.contents === '') {
      context.action.alert({
        msg: '내용을 입력해주세요.',
        callback: () => {
          return
        }
      })
    }

    const res = await Api.mypage_notice_upload({
      data: {
        ...formState,
        memNo: memNo,
        imagePath: thumbNail !== null ? thumbNail.path : ''
      }
    })

    if (res.result === 'success') {
      getNotice()
      setIsAdd(false)
      setIsList(true)
      context.action.toast({
        msg: res.message
      })
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
        context.action.alert({
          msg: image.content
        })
      } else {
        setPhotoUploading(true)
        const imageUpload = async () => {
          const res = await Api.image_upload({
            data: {
              dataURL: image.content,
              uploadType: 'room'
            }
          })
          if (res.result === 'success') {
            document.getElementById('save_fileImg').value = ''
            setThumbNail(res.data)
            setImage(null)
            setPhotoUploading(false)
          } else {
            context.action.toast({
              msg: res.message
            })
          }
        }
        imageUpload()
      }
    }
  }, [image])

  // useEffect(() => {
  // }, [thumbNail])

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
              thumbNail !== null ? thumbNail.url : 'https://image.dalbitlive.com/svg/gallery_w.svg'
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
        <DalbitCropper customName={`croperWrap`} event={eventObj} setCropOpen={setCropOpen} setImage={setImage} />
      )}

      <button className={`noticeWrite__button ${activeState && 'active'}`} onClick={insertNotice}>
        등록
      </button>
    </div>
  )
}

export default NoticeInsertCompnent
