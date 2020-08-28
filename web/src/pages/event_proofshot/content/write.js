import React, {useState, useEffect, useRef, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import {Context} from 'context'
import {VIEW_TYPE} from '../constant'

import Gallery_w from '../static/gallery_w.svg'
import {size} from 'lodash'

function proofWirte(props) {
  const {setViewType, viewType, item, setScrollToList, fetchEventProofshotList, eventStatusCheck} = props
  const [content, setContent] = useState('')
  const [imageData, setImageData] = useState('')
  const [delicate, setDelicate] = useState(false)
  let history = useHistory()
  const context = useContext(Context)

  const TextareaRef = useRef()
  const textareaResize = (e) => {
    TextareaRef.current.style.height = 'auto'
    TextareaRef.current.style.height = TextareaRef.current.scrollHeight + 12 + 'px'
  }

  // input file에서 이미지 업로드했을때 파일객체 dataURL로 값 셋팅
  function uploadSingleFile(e) {
    const target = e.currentTarget
    let reader = new FileReader()
    const file = target.files[0]
    if (!file) {
      return
    }
    const fileName = file.name
    const fileSplited = fileName.split('.')
    const fileExtension = fileSplited.pop()
    //
    const extValidator = (ext) => {
      const list = ['jpg', 'jpeg', 'png', 'gif']
      return list.includes(ext)
    }
    if (!extValidator(fileExtension)) {
      return context.action.alert({
        msg: 'gif,jpg, png 이미지만 사용 가능합니다.',
        title: '',
        callback: () => {
          context.action.alert({visible: false})
        }
      })
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
        if (res.result === 'success') {
          setImageData(res.data.url)
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
  async function uploadFn() {
    if (checkInspection()) {
      const res = await Api.event_proofshot_insert({
        data: {
          image_url: imageData,
          contents: content
        }
      })

      const {result, data} = res
      if (result === 'success') {
        context.action.alert({
          msg: '작성 완료되었습니다.',
          callback: async () => {
            setViewType(VIEW_TYPE.MAIN)
            await fetchEventProofshotList()
            await eventStatusCheck()
          }
        })
      } else {
        context.action.alert({
          msg: res.message,
          callback: () => {}
        })
      }
    }
  }

  async function modifyFn() {
    if (checkInspection()) {
      const res = await Api.event_proofshot_update({
        data: {
          idx: item[0].idx,
          image_url: imageData,
          contents: content
        }
      })
      const {result, data} = res
      if (result === 'success') {
        context.action.alert({
          msg: '수정이 완료 되었습니다.',
          callback: () => {
            setViewType(VIEW_TYPE.MAIN)
            fetchEventProofshotList()
          }
        })
      }
    }
  }

  const checkInspection = () => {
    if (content.length < 10) {
      context.action.alert({
        msg: '10자 이상 내용을\n 작성해주세요.'
      })
      return false
    } else if (imageData === '') {
      context.action.alert({
        msg: '이미지를 등록해주세요.'
      })
      return false
    } else {
      return true
    }
  }

  useEffect(() => {
    if (viewType === VIEW_TYPE.MODIFY) {
      if (item) {
        setContent(item[0].contents)
        setImageData(item[0].image_url)
      }
    } else {
      setContent('')
      setImageData('')
    }
  }, [viewType])

  useEffect(() => {
    if (content !== '' && content.length > 10 && imageData !== '') {
      setDelicate(true)
    } else {
      setDelicate(false)
    }
  }, [content, imageData])

  return (
    <div className="writeBg">
      <div className="titleSubPage">
        <button
          onClick={() => {
            setViewType(VIEW_TYPE.MAIN)
            setScrollToList(true)
          }}>
          닫기
        </button>

        <h2>인증샷 등록하기</h2>
      </div>

      <textarea
        className="textWrite"
        ref={TextareaRef}
        style={{minHeight: '50px', overflowY: 'visible'}}
        placeholder="제목을 입력해주세요"
        value={content}
        onChange={(e) => {
          if (e.target.value.length < 1000) {
            setContent(e.target.value)
            textareaResize(e)
          }
        }}
      />
      <p className="textNumber">{content.length}/1000</p>

      <div className="writeTitle">
        <h3>사진등록</h3>
        <p>가로가 긴 이미지를 권장합니다.</p>
      </div>

      <div className="imgUploadWrap">
        {viewType === VIEW_TYPE.WRITE && (
          <label htmlFor="imgUpload">
            {imageData === '' ? (
              <span className="uploadButton">사진등록</span>
            ) : (
              <span className="modifyButton">
                <img src={imageData ? imageData : imageData.profImg ? imageData.profImg['thumb150x150'] : ''} />
              </span>
            )}
          </label>
        )}
        {viewType === VIEW_TYPE.MODIFY && (
          <label htmlFor="imgUpload">
            {imageData === '' ? (
              <span className="uploadButton">사진등록</span>
            ) : (
              <span className="modifyButton">
                <div className="modifyText">
                  <p>
                    사진수정
                    <img src={Gallery_w} className="galleryIcon" />
                  </p>
                </div>
                <img src={imageData ? imageData : imageData.profImg ? imageData.profImg['thumb150x150'] : ''} />
              </span>
            )}
          </label>
        )}

        <input
          type="file"
          name="imgUpload"
          id="imgUpload"
          accept="image/jpg, image/jpeg, image/png"
          onChange={(e) => {
            uploadSingleFile(e)
          }}
        />
      </div>
      {viewType === VIEW_TYPE.WRITE && (
        <button className={`${delicate && 'active'}`} onClick={uploadFn}>
          등록
        </button>
      )}
      {viewType === VIEW_TYPE.MODIFY && (
        <button className={`${delicate && 'active'}`} onClick={modifyFn}>
          수정
        </button>
      )}
    </div>
  )
}

export default proofWirte
