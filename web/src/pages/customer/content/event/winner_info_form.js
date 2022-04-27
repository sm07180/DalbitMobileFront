import React, {useContext, useReducer} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import WinnerInfo from './winner_info'
import {winnerInspection} from './validation_fn'
import {useDispatch} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const FormDataReducer = (state, action) => {
  switch (action.type) {
    case 'eventIdx':
      return {
        ...state,
        eventIdx: action.val
      }
    case 'prizeIdx':
      return {
        ...state,
        prizeIdx: action.val
      }
    case 'winner_name':
      return {
        ...state,
        winner_name: action.val
      }
    case 'winner_phone':
      return {
        ...state,
        winner_phone: action.val
      }
    case 'winner_email':
      return {
        ...state,
        winner_email: action.val
      }
    case 'winner_post_code':
      return {
        ...state,
        winner_post_code: action.val
      }
    case 'winner_address_1':
      return {
        ...state,
        winner_address_1: action.val
      }
    case 'winner_address_2':
      return {
        ...state,
        winner_address_2: action.val
      }
    case 'file':
      return {
        ...state,
        files: action.val
      }
    case 'check':
      return {
        ...state,
        check: action.val
      }
    case 'init':
      return action.val

    default:
      return state
  }
}

const initData = {
  eventIdx: '',
  prizeIdx: '',
  winner_name: '',
  winner_phone: '',
  winner_email: '',
  winner_post_code: '',
  winner_address_1: '',
  winner_address_2: '',
  files: [false, false],
  check: false
}

export default function WinnerInfoForm() {
  const history = useHistory()
  const [formData, formDispatch] = useReducer(FormDataReducer, initData)
  const dispatch = useDispatch();

  const submitWinnerForm = () => {
    async function fetchData() {
      const {result, message} = await Api.winnerInfoAddEdit({
        data: {
          eventIdx: formData.eventIdx,
          prizeIdx: formData.prizeIdx,
          winner_name: formData.winner_name,
          winner_phone: formData.winner_phone,
          winner_email: formData.winner_email,
          winner_post_code: formData.winner_post_code,
          winner_address_1: formData.winner_address_1,
          winner_address_2: formData.winner_address_2,
          winner_add_file_1: formData.files[0].path,
          winner_add_file_1_name: formData.files[0].name,
          winner_add_file_2: formData.files[1].path !== false ? formData.files[1].path : '',
          winner_add_file_2_name: formData.files[1].name !== false ? formData.files[1].name : ''
        }
      })
      if (result === 'success') {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: message,
          callback: () => {
            return window.location.href='/'
          }
        }));
      } else {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: message,
        }));
      }
    }
    fetchData()
  }

  const checkInspection = (minorYn) => {
    const result = winnerInspection(minorYn, formData)
    if (result['status']) {
      submitWinnerForm()
    } else {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: result.content,
      }));
    }
  }

  return <WinnerInfo state={formData} formDispatch={formDispatch} WinnerInspection={checkInspection} />
}
