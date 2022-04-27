/**
 * @brief 마이페이지 팬보드 쓰기
 */
import React, {useEffect, useState} from 'react'
import {useLocation, useParams} from 'react-router-dom'
//modules
// context
//api
import Api from 'context/api'
import {Hybrid} from 'context/hybrid'
import DalbitCheckbox from 'components/ui/dalbit_checkbox'
import {useDispatch, useSelector} from "react-redux";
import {
  setGlobalCtxBackFunction,
  setGlobalCtxBackState,
  setGlobalCtxBoardIdx,
  setGlobalCtxBoardModifyInfo,
  setGlobalCtxFanBoardReplyNum,
  setGlobalCtxMessage
} from "redux/actions/globalCtx";
//layout
export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  let location = useLocation()
  let params = useParams()
  const LocationClip = params.clipNo
  const {profile} = globalState
  //urlNumber
  let urlrStr = location.pathname.split('/')[2]
  //state
  const list = props.list
  const [writeState, setWriteState] = useState(false)
  const [textChange, setTextChange] = useState('')
  const [isScreet, setIsScreet] = useState(false)
  const [isOther, setIsOther] = useState(true)
  const [writeType, setWriteType] = useState('')
  const [currentProfileMemNo, setCurrentProfileMemNo] = useState('');
  //팬보드 댓글 온체인지
  const handleChangeInput = (e) => {
    const target = e.currentTarget
    if (target.value.length > 100) return
    setTextChange(e.target.value)
  }
  //쓰기버튼 토글이벤트
  const writeToggle = (arg) => {
    if (writeState === false) {
      setWriteState(true)
      dispatch(setGlobalCtxBoardIdx(0));
      dispatch(setGlobalCtxBoardModifyInfo(null));
    } else {
      setWriteState(false)
      dispatch(setGlobalCtxBoardIdx(0));
      dispatch(setGlobalCtxBoardModifyInfo(null));
    }
    if (props.type === 'modify') {
      props.setCancelModify()
    }
  }
  //팬보드 댓글추가
  async function PostBoardData() {
    let params, msg
    if (writeType === 'board') {
      params = {
        memNo: urlrStr,
        depth: 1,
        contents: textChange,
        viewOn: isScreet === true ? 0 : 1
      }
      msg = '내용을 입력해 주세요.'
    } else if (writeType === 'reply') {
      params = {
        memNo: urlrStr,
        depth: 2,
        contents: textChange,
        viewOn: isScreet === true ? 0 : 1,
        parentGroupIdx: globalState.fanboardReplyNum
      }
      msg = '내용을 입력해 주세요.'
    }
    if (writeType === 'clip_board') {
      async function fetchReplyAdd() {
        const {result, data, message} = await Api.postClipReplySumbit({
          clipNo: LocationClip,
          contents: textChange
        })
        if (result === 'success') {
          props.set(true, writeType)
          writeToggle()
          setTextChange('')
          Hybrid('ClipUpdateInfo', data.clipPlayInfo)
        }
      }
      fetchReplyAdd()
    } else {
      const res = await Api.mypage_fanboard_upload({
        data: params
      })
      if (res.result === 'success') {
        props.set(true, writeType)
        dispatch(setGlobalCtxBoardIdx(0));
        dispatch(setGlobalCtxBoardModifyInfo(null));
        writeToggle()
        setTextChange('')
        setIsScreet(false)
        if (list instanceof Array) {
          let findIdx = list.findIndex((v) => {
            return v.boardIdx === globalState.fanboardReplyNum
          })
          if (findIdx !== -1) {
            list[findIdx].replyCnt++
          }
        }
      } else if (res.result === 'fail') {
        if (textChange.length === 0) {
          dispatch(setGlobalCtxMessage({
            type: "alert",
            callback: () => {
            },
            msg: msg
          }))
        }
      }
    }
  }
  // 팬보드 뉴표시
  async function getMyPageNewFanBoard() {
    const newFanBoard = await Api.getMyPageNewFanBoard()
    let mypageNewStg = localStorage.getItem('mypageNew')
    if (mypageNewStg === undefined || mypageNewStg === null || mypageNewStg === '') {
      mypageNewStg = {}
    } else {
      mypageNewStg = JSON.parse(mypageNewStg)
    }
    const fanBoard = newFanBoard.data
    mypageNewStg.fanBoard = fanBoard === undefined || fanBoard === null || fanBoard === '' ? 0 : fanBoard
    localStorage.setItem('mypageNew', JSON.stringify(mypageNewStg))
  }
  //수정하기 fetch
  async function editBoard(editType) {
    if (editType === 'fanboardEdit') {
      const res = await Api.mypage_board_edit({
        data: {
          memNo: urlrStr,
          replyIdx: props.replyIdx,
          contents: textChange
        }
      })
      if (res.result === 'success') {
        props.setCancelModify()
        props.set(true)
        dispatch(setGlobalCtxBoardIdx(0));
        dispatch(setGlobalCtxBoardModifyInfo(null));
        //Hybrid('ClipUpdateInfo', res.data.clipPlayInfo)
      } else if (res.result === 'fail') {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          callback: () => {
          },
          msg: res.message
        }))
      }
    } else if (editType === 'clipEdit') {
      const res = await Api.postClipReplyEdit({
        clipNo: LocationClip,
        contents: textChange,
        replyIdx: props.replyIdx
      })
      if (res.result === 'success') {
        props.setCancelModify()
        props.set(true)
        dispatch(setGlobalCtxBoardIdx(0));
        dispatch(setGlobalCtxBoardModifyInfo(null));
        Hybrid('ClipUpdateInfo', res.data.clipPlayInfo)
        props.set(true)
      } else if (res.result === 'fail') {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          callback: () => {
          },
          msg: res.message
        }))
      }
    }
  }
  const createWriteBtn = () => {
    return (
      <button onClick={() => writeToggle()}
              className={[`write-btn ${urlrStr === globalState.profile.memNo ? 'on' : 'on'}`]}>
        쓰기
      </button>
    )
  }

  // 댓글마다 인덱스 번호 입력시 큰댓글 접힘
  useEffect(() => {
    if (props.type !== 'modify' && globalState.boardIdx !== 0) {
      setWriteState(false)
    }
  }, [globalState.boardIdx])
  // 수정하기 초기 메세지값 초기화및 설정
  useEffect(() => {
    if (props.type === 'modify') {
      setTextChange(props.modifyMsg)
      setWriteState(true)
    } else {
      setWriteState(false)
    }
  }, [])
  // useEffect(() => {
  //   console.log(props.isWrite)
  //   if (props.isWrite === true) {
  //     setWriteState(true)
  //   }
  // }, [props.isWrite])
  //팬보드일경우 아덜쇼 뉴팬보드표시
  useEffect(() => {
    if (profile.memNo === urlrStr) {
      setIsOther(false)
    } else {
      setIsOther(true)
    }
    if (props.type !== 'clip_board' && globalState.token.memNo === profile.memNo) {
      getMyPageNewFanBoard()
    }
  }, [])
  //팬보드 안드로이드 접기 로직
  useEffect(() => {
    if (globalState.backFunction.name === 'booleanType' && !globalState.backFunction.value) {
      //글쓰기
      setWriteState(globalState.backFunction.value)
      //댓글닫기
      dispatch(setGlobalCtxFanBoardReplyNum(-1))
      //수정하기 취소
      if (props.type === 'modify') {
        props.setCancelModify()
      }
      //초기화
      dispatch(setGlobalCtxBackFunction({
        name: ''
      }))
      dispatch(setGlobalCtxBackState(null))
    }
  }, [globalState.backFunction])
  useEffect(() => {
    //안드로이드 백 이니셜 분기
    if (writeState || globalState.fanboardReplyNum !== -1 || globalState.fanboardReplyNum !== false) {
      dispatch(setGlobalCtxBackState(true))
      dispatch(setGlobalCtxBackFunction({
        name: 'booleanType',
        value: true
      }))
    } else {
      dispatch(setGlobalCtxBackState(null))
    }
    return () => {
      dispatch(setGlobalCtxBackState(null))
    }
  }, [writeState, globalState.fanboardReplyNum])

  //재조회 및 초기조회
  useEffect(() => {
    if (props.type === undefined || props.type === 'userprofile') {
      setWriteType('board')
    } else if (props.type === 'reply') {
      setWriteType('reply')
    } else if (props.type === 'clip_board') {
      setWriteType('clip_board')
    }
  }, [writeState, globalState.fanBoardBigIdx])
  useEffect(() => {
    setCurrentProfileMemNo(urlrStr)
  },[urlrStr])
  //--------------------------------------------------
  return (
    <>
      {currentProfileMemNo !== '10000000000000' &&
      <div className="writeWrap">
        <div className="writeWrap__top">
          <div
            className={`writeWrap__header ${writeState === true && 'writeWrap__header--active'}`}
            onClick={() => {
              writeToggle(writeState)
            }}>
            <img src={profile.profImg.thumb62x62} alt={profile.nickNm}/>
            {writeState === false && (
              <span>
                글쓰기 <span className="gray">최대 100자</span>
              </span>
            )}
            {writeState === true && <strong>{profile.nickNm}</strong>}
          </div>
          {writeState === true && (
            <div className="content_area">
              <textarea autoFocus="autofocus" placeholder="내용을 입력해주세요" onChange={handleChangeInput} value={textChange} />
            </div>
          )}
        </div>
        {writeState === true && (
          <div className="writeWrap__btnWrap">
            <span className="countBox">
              {isOther === true && !props.isViewOn ? (
                writeType === 'board' && (
                  <span className="secret">
                    <DalbitCheckbox
                      status={isScreet}
                      callback={() => {
                        setIsScreet(!isScreet)
                      }}
                    />
                    <span className="bold">비공개</span>
                  </span>
                )
              ) : (
                <></>
              )}
              <span className="count">
                <em>{textChange.length}</em> / 100
              </span>
            </span>
            {props.type === 'modify' ? (
              <button className="btn__ok" onClick={() => editBoard(props.editType)}>
                수정
              </button>
            ) : (
              <button className="btn__ok" onClick={() => PostBoardData()}>
                등록
              </button>
            )}
          </div>
        )}
        {props.replyWriteState || writeState === true ? (
          <div
            className="writeWrap__btn"
            onClick={() => {
              if (writeType === 'reply') {
                dispatch(setGlobalCtxFanBoardReplyNum(-1))
              }
              writeToggle(writeState)
            }}>
            <button className="btn__toggle">접기</button>
          </div>
        ) : (
          <></>
        )}
        {props.isShowBtn && createWriteBtn()}
      </div>
    }
    </>
  )
}
