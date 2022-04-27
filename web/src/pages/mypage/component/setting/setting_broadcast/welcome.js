import React, {useState, useEffect, useCallback, useContext} from 'react'

import Api from 'context/api'

import './index.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";
function BC_SettingWelcome() {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('')
  const [list, setList] = useState([])
  const [deleteIdx, setDeleteIdx] = useState(-1)
  const [fetching, setFetching] = useState(false)

  const insertTitle = useCallback(async () => {
    if (title === '') {

      dispatch(setGlobalCtxMessage({
        type:"toast",
        msg: '입력 된 인사말이 없습니다.\n인사말을 입력하세요.'
      }))
    } else {
      const res = await Api.insertBroadcastOption({
        optionType: 2,
        contents: title
      })
      if (res.result === 'success') {
        dispatch(setGlobalCtxMessage({
          type:"toast",
          msg: 'DJ 인사말이 등록 되었습니다.'
        }))

        setList(res.data.list)
      }
    }
  }, [title, list])

  const deleteTitle = useCallback(async () => {
    const res = await Api.deleteBroadcastOption({
      optionType: 2,
      idx: deleteIdx
    })

    if (res.result === 'success') {
      dispatch(setGlobalCtxMessage({
        type:"toast",
        msg: 'DJ 인사말이 삭제 되었습니다.'
      }))
      setTitle('')
      setList(res.data.list)
      setDeleteIdx(-1)
    }
  }, [deleteIdx, list])

  const modifyTitle = useCallback(async () => {
    const res = await Api.modifyBroadcastOption({
      optionType: 2,
      idx: deleteIdx,
      contents: title
    })

    if (res.result === 'success') {
      dispatch(setGlobalCtxMessage({
        type:"toast",
        msg: 'DJ 인사말이 수정 되었습니다.'
      }))

      setList(res.data.list)
    }
  }, [title, deleteIdx, list])

  useEffect(() => {
    const fetchData = async () => {
      const res = await Api.getBroadcastOption({
        optionType: 2
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
              <span className="bold">{title.length}</span> / 100
            </span>
          </div>
          <textarea
            placeholder={`${list.length === 3 ? '더이상 추가 등록은 되지 않습니다.' : '내용을 입력해주세요'}`}
            value={title}
            disabled={list.length === 3 && deleteIdx === -1 && true}
            onChange={(e) => {
              if (e.target.value.length <= 100) {
                setTitle(e.target.value)
              }
            }}
          />
          <div className="buttonWrap">
            {deleteIdx !== -1 && (
              <button className="buttonWrap__delete" onClick={deleteTitle}>
                삭제
              </button>
            )}
            {deleteIdx === -1 ? (
              <button
                className={`buttonWrap__add ${list.length === 3 && 'disabled'}`}
                onClick={() => {
                  if (list.length < 3) {
                    insertTitle()
                  }
                }}>
                등록
              </button>
            ) : (
              <button
                className={`buttonWrap__add`}
                onClick={() => {
                  modifyTitle()
                }}>
                수정
              </button>
            )}

            {deleteIdx !== -1 && (
              <button
                className="buttonWrap__cancle"
                onClick={() => {
                  setTitle('')
                  setDeleteIdx(-1)
                }}>
                취소
              </button>
            )}
          </div>
          {list.length > 0 && (
            <div className="contentsWrap">
              <p>
                등록 된 인사말<span>{list.length}</span>
              </p>
              {list.map((v, idx) => {
                return (
                  <button
                    key={idx}
                    className={`${v.idx === deleteIdx && 'on'}`}
                    onClick={() => {
                      if (deleteIdx !== v.idx) {
                        setDeleteIdx(v.idx)
                        setTitle(v.contents)
                      }
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

export default React.memo(BC_SettingWelcome)
