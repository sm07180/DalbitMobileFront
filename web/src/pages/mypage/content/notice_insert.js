import React, {useState, useCallback, useEffect, useContext} from 'react'

import DalbitCheckbox from 'components/ui/dalbit_checkbox'
// import DalbitCropper from 'common/ui/dalbit_cropper'

import Api from 'context/api'
import {Context} from 'context'

function NoticeInsertCompnent(props) {
  const {setIsAdd, memNo, getNotice} = props

  const context = useContext(Context)

  const [image, setImage] = useState(null)
  const [cropOpen, setCropOpen] = useState(false)
  const [eventObj, setEventObj] = useState(null)

  const [formState, setFormState] = useState({
    title: '',
    contents: '',
    isTop: false,
    imagePath: ''
  })

  const [thumbNail, setThumbNail] = useState(null)

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
    }
  }, [formState])

  useEffect(() => {
    if (image !== null) {
      if (image.status === false) {
        context.action.alert({
          msg: image.content
        })
      } else {
        const imageUpload = async () => {
          const {result, data, message} = await Api.image_upload({
            dataURL: image.content,
            uploadType: 'room'
          })

          if (result === 'success') {
            document.getElementById('save_fileImg').value = ''

            setImage(null)
            setThumbNail(data)
          } else {
            context.action.toast({
              msg: message
            })
          }
        }
        imageUpload()
      }
    }
  }, [image])

  useEffect(() => {
    console.log(thumbNail)
  }, [thumbNail])

  console.log(`formState.title`, formState.title)

  return (
    <div className="writeWrapper">
      <input
        value={formState.title}
        placeholder="공지사항 제목을 입력해주세요"
        className="writeWrapper__titleInput"
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
        className="writeWrapper__contentTextarea"
        placeholder="작성하고자 하는 글의 내용을 입력해주세요."
      />
      <div className="saveFileImg">
        <label
          htmlFor="save_fileImg"
          className="fileBasic"
          style={{
            background: `url("${thumbNail !== null && thumbNail.url}") center no-repeat #333`
            // backgroundColor: "#333",
          }}></label>
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

      {cropOpen && eventObj !== null && <DalbitCropper event={eventObj} setCropOpen={setCropOpen} setImage={setImage} />}
      <div className="writeController">
        <label className="writeController__checkLabel">
          <DalbitCheckbox callback={changeCheckStatus} status={formState.isTop} />
          <span className="writeController__labelTxt">고정 공지사항</span>
        </label>
        <div className="writeController__btnWrapper">
          <button
            onClick={() => {
              setIsAdd(false)
            }}
            className="writeWrapper__btn writeWrapper__btn__cancel">
            취소
          </button>
          <button onClick={insettNorice} className="writeWrapper__btn">
            등록
          </button>
        </div>
      </div>
    </div>
  )
}

export default NoticeInsertCompnent
