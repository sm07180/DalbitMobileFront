import React, {useCallback, useEffect, useState, useContext} from 'react'

import Api from 'context/api'

import {PHOTO_SERVER} from 'context/config'

import {Context} from 'context/index'
import DalbitCheckbox from 'components/ui/dalbit_checkbox'
import DalbitCropper from 'components/ui/dalbit_cropper'

function ModifyNoticeCompnent(props) {
  const {setModifyItem, modifyItem, memNo, getNotice} = props

  const globalCtx = useContext(Context)

  const [image, setImage] = useState(null)
  const [cropOpen, setCropOpen] = useState(false)
  const [eventObj, setEventObj] = useState(null)
  const [thumbNail, setThumbNail] = useState(null)

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

  const ModionSubmit = useCallback(() => {
    async function ModiRegistNotice() {
      const {result, data} = await Api.mypage_notice_edit({
        memNo: memNo,
        imagePath: thumbNail !== null ? thumbNail.path : '',
        ...modifyItem
      })
      if (result === 'success') {
        setModifyItem(null)
        getNotice()
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
            globalCtx.action.alert({
              msg: message
            })
          }
        }
        imageUpload()
      }
    }
  }, [image])

  return (
    <>
      {modifyItem !== null && (
        <div className="writeWrapper">
          <form className="writeWrapper__form">
            <h2 className="writeTitle">공지사항 수정</h2>
            <input
              placeholder="공지사항 제목을 입력해주세요"
              onChange={(e) => {
                if (e.target.value.length > 20) return
                else onChange(e)
              }}
              value={modifyItem.title}
              name="title"
              className="writeWrapper__titleInput"
            />
            <textarea
              value={modifyItem.contents}
              placeholder="공지사항 내용을 입력해주세요"
              onChange={(e) => {
                if (e.target.value.length > 500) return
                else onChange(e)
              }}
              name="contents"
              className="writeWrapper__contentTextarea"
            />

            <div className="saveFileImg">
              <label
                htmlFor="save_fileImg"
                className="fileBasic"
                style={{
                  background: `url("${modifyItem.imagePath === '' ? thumbNail !== null && thumbNail.url : PHOTO_SERVER}/${
                    modifyItem.imagePath
                  }") center no-repeat #333`
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

            {cropOpen && eventObj !== null && <DalbitCropper event={eventObj} setCropOpen={setCropOpen} setImage={setImage} />}
          </form>
          <div className="writeController">
            <label className="writeController__checkLabel">
              <DalbitCheckbox callback={changeCheckStatus} status={modifyItem.isTop} />
              <span className="writeController__labelTxt">고정공지사항</span>
            </label>

            <div className="writeController__btnWrapper">
              <button
                onClick={() => {
                  setModifyItem(null)
                }}
                className="writeWrapper__btn writeWrapper__btn__cancel">
                취소
              </button>
              <button onClick={ModionSubmit} className="writeWrapper__btn">
                수정
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ModifyNoticeCompnent
