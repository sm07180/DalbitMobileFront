import React, {useState, forwardRef, useImperativeHandle, useContext} from 'react'
import Api from 'context/api'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage, setGlobalCtxUpdateProfile} from "redux/actions/globalCtx";

const OperationModal = forwardRef((props, ref) => {
  const {imgInfo} = props
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const {profile} = globalState
  const [open, setOpen] = useState(false)
  useImperativeHandle(ref, () => ({
    handleOpen: () => {
      setOpen(true)
    }
  }))

  const handleClose = () => {
    setOpen(false)
  }

  const alertMessage = (message) => {
    dispatch(setGlobalCtxMessage({type:"alert",
      msg: message,
    }))
  }

  const getProfileAcount = () => {
    Api.profile({params: {memNo: profile.memNo}}).then((res) => {
      const {result, message, data} = res
      if (result === 'success') {
        dispatch(setGlobalCtxUpdateProfile(data));
      } else {
        alertMessage(message)
      }
    })
  }

  const onStarClick = () => {
    if (imgInfo !== null) {
      Api.postSetLeaderProfileImg({idx: imgInfo}).then((res) => {
        const {result, message} = res
        if (result === 'success') {
          getProfileAcount()
          dispatch(setGlobalCtxMessage({type:"toast",
            msg: '선택 이미지로 대표 이미지가 변경되었습니다.'
          }))
          handleClose()
        } else {
          alertMessage(message)
        }
      })
    }
  }

  const onDelClick = () => {
    dispatch(setGlobalCtxMessage({type:"confirm",
      title: '프로필 이미지 삭제',
      msg: '선택하신 이미지를 삭제하시겠습니까?<br/>삭제한 프로필 이미지는 복구 할 수 없습니다.',
      callback: deleteImage
    }))
  }

  const deleteImage = () => {
    if (imgInfo !== null) {
      Api.postDeleteProfileImg({idx: imgInfo}).then((res) => {
        const {result, message} = res
        if (result === 'success') {
          getProfileAcount()
          handleClose()
        } else {
          alertMessage(message)
        }
      })
    }
  }
  return (
    <>
      {open && (
        <div className="overlay" id="operationPop">
          <div className="modal">
            <div className="modal__header">
              <button className="close" onClick={handleClose}>
                닫기
              </button>
            </div>

            <div className="modal__content">
              <div className="modal__content__btnWrap star">
                <button className="modal__content__btnWrap__btn" type="button" onClick={onStarClick}>
                  대표 사진 등록하기
                </button>
              </div>
              <div className="modal__content__btnWrap del">
                <button className="modal__content__btnWrap__btn" type="button" onClick={onDelClick}>
                  삭제하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
})

export default OperationModal
