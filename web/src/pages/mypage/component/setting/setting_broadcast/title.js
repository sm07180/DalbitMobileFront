import React, {useState, useEffect, useCallback} from 'react'

import Api from 'context/api'

import './index.scss'
function BC_SettingTitle() {
  const [title, setTitle] = useState('')
  const [list, setList] = useState([])
  const [deleteIdx, setDeleteIdx] = useState(-1)
  const [fetching, setFetching] = useState(false)

  const insertTitle = useCallback(async () => {
    const res = await Api.insertBroadcastOption({
      optionType: 1,
      contents: title
    })
    if (res.result === 'succcess') {
      setList(res.data.list)
    }
  }, [title, list])

  useEffect(() => {
    const fetchData = async () => {
      const res = await Api.getBroadcastOption({
        optionType: 1
      })

      if (res.result === 'success') {
        setList(res.data.list)

        setFetching(true)
      }
    }

    fetchData()
  }, [])

  return (
    <div id="bc_setting_title">
      {fetching === true && (
        <>
          <div className="title">
            <span>최대 3개까지 저장 가능</span>
            <span>
              <span className="bold">{title.length}</span> / 20
            </span>
          </div>
          <textarea
            placeholder={`${list.length === 3 ? '더이상 추가 등록은 되지 않습니다.' : '내용을 입력해주세요'}`}
            value={title}
            disabled={list.length === 3 && true}
            onChange={(e) => {
              if (e.target.value.length <= 20) {
                setTitle(e.target.value)
              }
            }}
          />
          <div className="buttonWrap">
            {deleteIdx !== -1 && <button className="buttonWrap__delete">삭제</button>}
            <button
              className={`buttonWrap__add ${list.length === 3 && 'disabled'}`}
              onClick={() => {
                if (list.length < 3) {
                  insertTitle()
                }
              }}>
              등록
            </button>
            {title.length > 0 && (
              <button
                className="buttonWrap__cancle"
                onClick={() => {
                  setTitle('')
                }}>
                취소
              </button>
            )}
          </div>
          {list.length > 0 && (
            <div className="contentsWrap">
              <p>
                등록 된 제목<span>{list.length}</span>
              </p>
              {list.map((v, idx) => {
                return (
                  <button
                    key={idx}
                    className={`${v.idx === deleteIdx && 'on'}`}
                    onClick={() => {
                      setDeleteIdx(v.idx)
                    }}>
                    {v.contents}
                  </button>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default React.memo(BC_SettingTitle)
