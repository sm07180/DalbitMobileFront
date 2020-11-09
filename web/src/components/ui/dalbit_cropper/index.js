import React, {useEffect, useState, useCallback} from 'react'
import Cropper from 'react-cropper'

// import 'cropperjs/dist/cropper.css'
import './index.scss'

// /** PropsType */
// type PropsType = {
//   /** Input onChange 로 받는 Event 객체 */
//   event: any;
//   /** 부모에서 이 Component를 Rendering 할지 결정하는 Boolean */
//   setCropOpen(value: boolean): void;
//   /** 부모의 Image 와 Alert 관련 오브젝트<br />
//    * status === true ? 성공 : 실패 <br />
//    * fileName: Upload 할 file이름 <br />
//    * content: Alert 에 들어갈 내용 or DataURL
//    */
//   setImage(value: { status: boolean; fileName: string; content: string }): void;
//   /** ClassName */
//   customName?: string;
// };

function DalbitCropper(props) {
  const {event, setCropOpen, setImage, customName} = props
  const [state, setState] = useState({
    status: true,
    fileName: '',
    content: ''
  })
  const [cropper, setCropper] = useState(null)

  const rotateImage = useCallback(() => {
    if (cropper) {
      cropper.rotate(90)
    }
  }, [state, cropper])

  const cropImage = useCallback(() => {
    if (cropper) {
      setState({
        ...state,
        content: cropper.getCroppedCanvas().toDataURL()
      })
    }
  }, [state, cropper])

  const submit = useCallback(() => {
    setImage({
      ...state,
      content: cropper.setCropBoxData(cropper.getCanvasData()).getCroppedCanvas().toDataURL()
    })
    setCropOpen(false)
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

    if (event !== null) {
      uploadSingleFile(event)
    }
  }, [event])

  useEffect(() => {
    if (state) {
      if (state.status === false) {
        setImage({...state})
        setCropOpen(false)
      }
    }
  }, [state])

  return (
    <div className={customName || ''}>
      <Cropper
        initialAspectRatio={1}
        preview=".img-preview"
        src={state && state.status !== false ? state.content : undefined}
        viewMode={1}
        guides={false}
        minCropBoxWidth={100}
        minCropBoxHeight={100}
        background={false}
        // autoCropArea={1}
        // responsive={true}
        // autoCropArea={1}
        // checkOrientation={false}
        onInitialized={(instance) => {
          setCropper(instance)
        }}
        zoomable={false}
      />
      <div className="btnBox">
        <button onClick={rotateImage}>회전</button>
        <button className="btn__ok" onClick={cropImage}>
          자르기
        </button>
        <button className="btn__save" onClick={submit}>
          저장
        </button>
      </div>
    </div>
  )
}

export default DalbitCropper
