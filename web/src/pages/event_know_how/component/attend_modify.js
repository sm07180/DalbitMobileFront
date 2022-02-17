import React, {useState, useEffect, useCallback} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import {KnowHowContext} from '../store'
import Api from 'context/api'

import Header from 'components/ui/new_header'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

function AttendModify() {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const history = useHistory()
  const params = useParams()

  const fetchData = useCallback(async () => {
    const res = await Api.knowhow_detail({
      idx: params.num,
      is_detail: 1
    })

    if (res.result === 'success') {
      setDetail(res.data.detail)
      setGoodCnt(res.data.detail.good_cnt)
      console.log(res.data.detail.is_good)
      setIsLike(res.data.detail.is_good === 0 ? false : true)
      let arr = [res.data.detail.image_url, res.data.detail.image_url2, res.data.detail.image_url3]

      setImgList(
        arr.filter((v) => {
          return v
        })
      )
    } else {
      dispatch(setGlobalCtxMessage({type:"alert",
        msg: '조회에 실패했습니다.',
        callback: () => {
          history.goBack()
        }
      }))
    }
  }, [])

  return (
    <>
      <Header title={'노하우 수정'} />
    </>
  )
}

export default React.memo(AttendModify)
