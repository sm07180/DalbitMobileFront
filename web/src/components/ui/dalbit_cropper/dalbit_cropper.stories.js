import React, {useState, useEffect, useCallback} from 'react'
import styled from 'styled-components'

import DalbitCropper from './index'
export default {
  title: 'Dalbit Cropper',
  component: DalbitCropper
}

export const Default = () => {
  const [image, setImage] = useState(null)
  const [cropOpen, setCropOpen] = useState(false)
  const [eventObj, setEventObj] = useState(null)

  useEffect(() => {
    if (image !== null) {
      if (image.status === false) {
        // GlobalContext 에서 Alert
      } else {
        console.log('이미지 업로드 하기', image)
      }
    }
  }, [image])

  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          e.persist()
          setEventObj(e)
          setCropOpen(true)
        }}
      />
      {cropOpen !== false && eventObj !== null && (
        <Test>
          <DalbitCropper event={eventObj} setCropOpen={setCropOpen} setImage={setImage} customName={'testDalbitCropper'} />
        </Test>
      )}
    </div>
  )
}

const Test = styled.div`
  .testDalbitCropper {
    & > div:first-child {
      height: calc(100vh - 163px);
      width: 100%;
      display: flex;
      align-items: center;
    }
  }
`
