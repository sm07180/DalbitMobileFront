import React, {useEffect, useState, useCallback, useContext} from 'react'
import Cropper from 'react-cropper'
import Header from '../new_header'
import './index.scss'
import CropImg from './static/ico-crop.png'
import CropRotation from './static/ico-rotation.png'
import {isAndroid} from "context/hybrid";
import {useDispatch, useSelector} from "react-redux";
import {
  setGlobalCtxBackEventCallback,
  setGlobalCtxBackFunction,
  setGlobalCtxBackFunctionEnd,
  setGlobalCtxBackState
} from "redux/actions/globalCtx";

function DalbitCropper(props) {
  const {imgInfo, onClose, onCrop, className} = props;
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  //state
  const [state, setState] = useState({
    status: true,
    fileName: '',
    content: ''
  })
  //열고 닫기
  const [cropper, setCropper] = useState(false)

  const rotateImage = useCallback(() => {
    if (cropper) {
      cropper.rotate(90)
    }
  }, [state, cropper])

  const cropImage = useCallback(() => {
    if (cropper) {
      setState({
        ...state,
        content: cropper.getCroppedCanvas().toDataURL('image/jpeg', 20 / 100)
      })
    }
  }, [state, cropper])

  const submit = useCallback(() => {
    setState({
      ...state,
      content: cropper.getCroppedCanvas().toDataURL('image/jpeg', 20 / 100)
    })

    onCrop({
      ...state,
      content: cropper.getCroppedCanvas().toDataURL()
    })
    onClose()
  }, [state, cropper])

  useEffect(() => {
    const uploadSingleFile = (e) => {
      const target = e.target
      if (target.files.length === 0) {
        setState({
          ...state,
          status: false
        })
        return
      }
      let reader = new FileReader()
      const file = target.files[0]
      const fileName = file.name
      const fileSplited = fileName.split('.')
      const fileExtension = fileSplited.pop()
      const extValidator = (ext) => {
        const list = ['jpg', 'jpeg', 'png', 'PNG']
        return list.includes(ext)
      }
      if (!extValidator(fileExtension)) {
        setState({
          ...state,
          status: false,
          content: 'jpg, png 이미지만 사용 가능합니다.'
        })
        return
      }
      reader.readAsDataURL(target.files[0])
      reader.onload = async () => {
        if (reader.result) {
          setState({
            status: true,
            content: reader.result,
            fileName: fileName
          })
        } else {
          setState({
            ...state,
            status: false,
            content: '예상치 못한 에러 발생'
          })
        }
      }
    }

    if (imgInfo) {
      uploadSingleFile(imgInfo)
    }
  }, [imgInfo])

  useEffect(() => {
    if (state) {
      if (state.status === false) {
        onCrop({...state})
        onClose()
      }
    }
  }, [state])

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    /* 안드로이드 물리 백버튼시 감지용 */
    if (isAndroid()) {
      dispatch(setGlobalCtxBackState(true));
      dispatch(setGlobalCtxBackFunction({name: 'callback'}));
      dispatch(setGlobalCtxBackEventCallback(onClose));
    }
    return () => {
      document.body.style.overflow = ''

      if (isAndroid()) {
        dispatch(setGlobalCtxBackFunctionEnd(''));
        dispatch(setGlobalCtxBackEventCallback(null));
        if (globalState.backFunction?.name?.length === 1) {
          dispatch(setGlobalCtxBackState(null));
        }
      }
    }
  }, [])

  return (
    <div className={`croperWrap ${className} ${globalState.player || globalState.clipState ? 'gutter' : ''}`}>
      <Header>
        <button className="croperClose" onClick={() => onClose()} type="button">
          크롭퍼 닫기
        </button>
      </Header>
      <Cropper
        style={{height: 'calc(100vh - 163px)', width: '100%', display: 'flex', alignItems: 'center'}}
        initialAspectRatio={1}
        preview=".img-preview"
        src={state && state.status !== false ? state.content : undefined}
        viewMode={1}
        guides={false}
        minCropBoxWidth={100}
        minCropBoxHeight={100}
        background={false}
        autoCropArea={1}
        responsive={true}
        autoCropArea={1}
        checkOrientation={false}
        onInitialized={(instance) => {
          setCropper(instance)
        }}
        zoomable={false}
      />
      <div className="btnBox">
        <button onClick={rotateImage} type="button">
          <img src={CropRotation} alt="회전" />
        </button>
        <button className="cropButton" onClick={cropImage} type="button">
          <img src={CropImg} alt="자르기" />
        </button>
        <button className="btn__save" onClick={submit} type="button">
          저장
        </button>
      </div>
    </div>
  )
}

export default DalbitCropper
