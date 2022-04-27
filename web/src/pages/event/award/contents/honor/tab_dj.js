import React, {useState, useEffect, useCallback, useContext} from 'react'
import Api from 'context/api'

import AwardsDetail from './components/awards_detail'
import AwardsScore from './components/awards_score'
import AwardsBtmBtn from './components/awards_btm_btn'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

export default function TabDJ(props) {
  const {djMemNo} = props
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const [selectedDJ, setSelectedDJ] = useState(null)
  const [isFan, setIsFan] = useState(false)

  const fetchDJData = useCallback(
    async (djMemNo) => {
      const {result, data, message} = await Api.getAwardHonor({
        slctType: 1,
        memNo: djMemNo
      })
      if (result === 'success') {
        const {list, ...neededProperties} = data
        setSelectedDJ({...neededProperties})
        setIsFan(neededProperties.isFan)
      } else {
        dispatch(setGlobalCtxMessage({type:"alert_no_close",
          msg: message
        }))
      }
    },
    [selectedDJ]
  )

  const toggleFan = () => setIsFan((prev) => !prev)

  useEffect(() => {
    fetchDJData(djMemNo)
  }, [djMemNo])

  return (
    <>
      {selectedDJ !== null && (
        <>
          <AwardsDetail selectedDJ={selectedDJ} />
          <AwardsScore selectedDJ={selectedDJ} />
          <AwardsBtmBtn selectedDJ={selectedDJ} djMemNo={djMemNo} isFan={isFan} toggleFan={toggleFan} />
        </>
      )}
    </>
  )
}
