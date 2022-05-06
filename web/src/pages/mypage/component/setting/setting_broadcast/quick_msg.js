import React, {useCallback, useEffect, useReducer, useRef} from 'react'
import Api from 'context/api'
import {useDispatch} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const reducer = (state, action) => {
  switch (action.type) {
    case 'order':
      return state.map((v, i) => {
        if (i === action.idx) {
          v.order = action.val
        }
        return v
      })
    case 'text':
      return state.map((v, i) => {
        if (i === action.idx) {
          v.text = action.val
        }
        return v
      })
    case 'init':
      return [...action.val]
    default:
      return state
  }
}

function BC_SettingQuickMsg() {
  const dispatch = useDispatch();

  const [state, dispatchWithoutAction] = useReducer(reducer, [])

  const modifyState = useCallback(
    async (idx) => {
      if (state[idx].order === '') {
        dispatch(setGlobalCtxMessage({
          type: "toast",
          msg: '명령어를 입력해주세요.'
        }))
      } else if (state[idx].text === '') {
        dispatch(setGlobalCtxMessage({
          type: "toast",
          msg: '내용을 입력해주세요.'
        }))
      } else {
        const res = await Api.member_broadcast_shortcut({
          method: 'POST',
          data: {
            ...state[idx]
          }
        })

        if (res.result === 'success') {
          dispatch(setGlobalCtxMessage({
            type: "toast",
            msg: '퀵 메시지가 저장 되었습니다.'
          }))
        } else {
          dispatch(setGlobalCtxMessage({
            type: "toast",
            msg: res.message
          }))
        }
      }
    },
    [state]
  )

  useEffect(() => {
    async function fetchData() {
      const res = await Api.member_broadcast_shortcut({
        method: 'GET'
      })

      if (res.result === 'success') {
        dispatchWithoutAction({type: 'init', val: res.data.list})
      }
    }

    fetchData()
  }, [])

  return (
    <div id="bc_setting_quick">
      <p className="title">명령어는 2글자, 내용은 최대 200글자까지 입력 가능</p>
      {state.length > 0 &&
        state.map((v, idx) => {
          return (
            <div key={idx} className="contents">
              <QuickContent item={v} idx={idx} state={state} dispatch={dispatchWithoutAction}
                            modifyState={modifyState}/>
            </div>
          )
        })}
    </div>
  )
}

function QuickContent({item, idx, state, dispatch, modifyState}) {
  const TextareaRef = useRef(null)

  useEffect(() => {
    if (TextareaRef) {
      if (TextareaRef.current) {
        if (TextareaRef.current.scrollHeight >= 36) {
          TextareaRef.current.style.height = '0'
          TextareaRef.current.style.height = TextareaRef.current.scrollHeight + 'px'
        } else {
          TextareaRef.current.style.height = '24px'
        }
      }
    }
  }, [state[idx].text])

  return (
    <>
      <div className="contents__header">
        <p>
          퀵 메시지 <span>{item.orderNo}</span>
        </p>
        <button onClick={() => modifyState(idx)}>저장</button>
      </div>
      <div>
        <div className="contents__inputWrap">
          <span className="contents__inputWrap--inputTitle">명령어</span>
          <input
            value={item.order}
            onChange={(e) => {
              if (e.target.value.length <= 2) {
                dispatch({type: 'order', val: e.target.value, idx: idx})
              }
            }}
          />
        </div>
        <div className="contents__inputWrap">
          <span className="contents__inputWrap--title">내용</span>
          <textarea
            ref={TextareaRef}
            value={item.text}
            onChange={(e) => {
              if (e.target.value.length <= 200) dispatch({type: 'text', val: e.target.value, idx: idx})
            }}
          />
        </div>
      </div>
    </>
  )
}

export default React.memo(BC_SettingQuickMsg)
