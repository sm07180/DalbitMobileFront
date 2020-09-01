import React, {useState, useEffect, useContext} from 'react'
// import Header from './component/header'
import Header from 'components/ui/new_header'
import API from 'context/api'
import {Context} from 'context'
import {VIEW_TYPE} from '../constant/'

export default (props) => {
  const {setViewType, viewType} = props
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [content, setContent] = useState('')
  const [delicate, setDelicate] = useState(false)

  const global_ctx = useContext(Context)

  async function uploadFn() {
    const res = await API.eventPackageWrite({
      name: name,
      contactNo: phone,
      introduce: content
    })

    if (res.result === 'success') {
      global_ctx.action.alert({
        msg: '작성이 완료 되었습니다.',
        callback: () => {
          setViewType(0)
        }
      })
    }
  }
  useEffect(() => {
    if (name !== '' && content.length > 10 && phone !== '') {
      setDelicate(true)
    } else {
      setDelicate(false)
    }
  }, [name, content, phone])

  return (
    <div>
      <Header title="신청서 작성" />

      <div className="wirteWrap">
        <ul className="list">
          <li>
            <p className="list__title">이름(실명)</p>
            <input type="text" onChange={(e) => setName(e.target.value)} placeholder="이름을 입력하세요." maxLength="10" />
          </li>
          <li>
            <p className="list__title">휴대폰번호</p>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                if (isNaN(e.target.value)) {
                  return
                } else {
                  setPhone(e.target.value)
                }
              }}
              placeholder="'-'를 뺀 숫자만 입력하세요."
              maxLength="12"
            />
          </li>
        </ul>

        <h3>방송소개</h3>
        <textarea
          value={content}
          maxLength="100"
          placeholder="DJ님의 방송 및 방송장비를 받고서 진행하고 싶은 콘텐츠에 대해 자세히 설명해 주세요. "
          onChange={(e) => {
            if (e.target.value.length < 100) {
              setContent(e.target.value)
            }
          }}
        />

        <p className="textNumber">
          <b>{content.length}</b> / 100
        </p>

        <button className={`${delicate && 'active'}`} onClick={() => uploadFn()}>
          저장
        </button>
      </div>
    </div>
  )
}
