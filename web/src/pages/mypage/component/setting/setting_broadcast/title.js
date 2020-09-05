import React, {useState, useEffect} from 'react'

import Api from 'context/api'

import './index.scss'
function BC_SettingTitle() {
  const [title, setTitle] = useState('')
  const [list, setList] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      const res = await Api.getBroadcastOption({
        optionType: 1
      })

      if (res.result === 'success') {
        console.log(res.data)
        setList(res.data.list)
      }
    }

    fetchData()
  }, [])

  return (
    <div id="bc_setting_title">
      <div className="title">
        <span>최대 3개까지 저장 가능</span>
        <span>
          <span className="bold">{title.length}</span> / 20
        </span>
      </div>
      <textarea
        placeholder="내용을 입력해주세요."
        value={title}
        onChange={(e) => {
          if (e.target.value.length <= 20) {
            setTitle(e.target.value)
          }
        }}
      />
      <div className="buttonWrap">
        <button className="buttonWrap__delete">삭제</button>
        <button className="buttonWrap__add">등록</button>
        <button className="buttonWrap__cancle">취소</button>
      </div>
      {list.length > 0 && (
        <div>
          <p>
            등록 된 제목<span>{list.length}</span>
          </p>
          {list.map((v, idx) => {
            return <button key={idx}>{v.contents}</button>
          })}
        </div>
      )}
    </div>
  )
}

export default React.memo(BC_SettingTitle)
