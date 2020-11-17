import React, {useCallback, useEffect, useState, useContext} from 'react'
import Api from 'context/api'
import {Context} from 'context'
import {PHOTO_SERVER} from 'context/config'

import DalbitCheckbox from 'components/ui/dalbit_checkbox'
import DalbitCropper from 'components/ui/dalbit_cropper'
import {useHistory, useParams} from 'react-router-dom'

function ModifyNoticeCompnent(props) {
  const globalCtx = useContext(Context)
  const context = useContext(Context)
  const {setModifyItem, modifyItem, getNotice, setPhotoUploading} = props
  let {memNo, addpage} = useParams()
  //크롭퍼 state
  const [image, setImage] = useState(null)
  const [cropOpen, setCropOpen] = useState(false)
  const [eventObj, setEventObj] = useState(null)
  const [thumbNail, setThumbNail] = useState(null)

  let history = useHistory()

  //버튼 활성화
  const [activeState, setActiveState] = useState(false)

  const onChange = useCallback(
    (e) => {
      const {value, name} = e.target

      setModifyItem({
        ...modifyItem,
        [name]: value
      })
    },
    [modifyItem]
  )

  const ButtonActive = () => {
    if (modifyItem && modifyItem.title !== '' && modifyItem && modifyItem.contents !== '') {
      setActiveState(true)
    } else {
      setActiveState(false)
    }
  }

  const pramsNum = Number(addpage.substring(9))

  const ModionSubmit = useCallback(() => {
    async function ModiRegistNotice() {
      const res = await Api.mypage_notice_edit({
        data: {
          ...modifyItem,
          memNo: memNo,
          imagePath: thumbNail !== null ? thumbNail.path : modifyItem.imagePath
        }
      })
      if (res.result === 'success') {
        globalCtx.action.toast({
          msg: res.message
        })

        getNotice()
        setTimeout(() => {
          history.push(`/mypage/${memNo}/notice/isDetile=${pramsNum}`)
        }, 100)
      }
    }
    ModiRegistNotice()
  }, [modifyItem, memNo])

  const changeCheckStatus = useCallback(() => {
    setModifyItem({
      ...modifyItem,
      isTop: !modifyItem.isTop
    })
  }, [modifyItem])

  useEffect(() => {
    if (image !== null) {
      if (image.status === false) {
        globalCtx.action.alert({
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
            setImage(null)
            setThumbNail(res.data)

            setModifyItem({
              ...modifyItem,
              imagePath: ''
            })

            setPhotoUploading(false)
          } else {
            globalCtx.action.alert({
              msg: res.message
            })
          }
        }
        imageUpload()
      }
    }
  }, [image])

  //---------------------------------------------------------------------
  useEffect(() => {
    ButtonActive()
  }, [modifyItem])

  return (
    <>
      {modifyItem !== null && (
        <div className="noticeWrite">
          <input
            placeholder="공지사항 제목을 입력해주세요"
            onChange={(e) => {
              if (e.target.value.length > 20) return
              else onChange(e)
            }}
            value={modifyItem.title}
            name="title"
            className="noticeWrite__title"
          />
          <textarea
            value={modifyItem.contents}
            placeholder="공지사항 내용을 입력해주세요"
            onChange={(e) => {
              if (e.target.value.length > 500) return
              else onChange(e)
            }}
            name="contents"
            className="noticeWrite__content"
          />

          <label className="noticeWrite__checkbox">
            <DalbitCheckbox size={20} callback={changeCheckStatus} status={modifyItem.isTop} />
            상단 고정
          </label>

          <div className="saveFileImg">
            <label
              htmlFor="save_fileImg"
              className={`modifyBasic 
              
              ${modifyItem.imagePath === '' ? (thumbNail !== null ? '' : 'modifyFileOn') : ''}`}
              style={{
                backgroundImage: `url("${
                  modifyItem.imagePath === ''
                    ? thumbNail !== null
                      ? thumbNail.url
                      : 'https://image.dalbitlive.com/svg/gallery_w.svg'
                    : `${PHOTO_SERVER}${modifyItem.imagePath}`
                }")`
              }}></label>

            {(modifyItem.imagePath !== '' || thumbNail !== null) && (
              <button
                className="saveFileImgClose"
                onClick={(e) => {
                  e.stopPropagation()
                  setModifyItem({
                    ...modifyItem,
                    imagePath: ''
                  })
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

          <button className={`modifyButton ${activeState && 'active'}`} onClick={ModionSubmit}>
            수정
          </button>
        </div>
      )}
    </>
  )
}

export default ModifyNoticeCompnent
