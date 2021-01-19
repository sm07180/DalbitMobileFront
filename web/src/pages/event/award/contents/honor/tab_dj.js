import React, {useState, useEffect, useCallback, useContext} from 'react'
import Api from 'context/api'
import {Context} from 'context'

import AwardsDetail from './components/awards_detail'
import AwardsScore from './components/awards_score'
import AwardsBtmBtn from './components/awards_btm_btn'

export default function TabDJ(props) {
  const {djMemNo} = props
  const context = useContext(Context)
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
        context.action.alert_no_close({
          msg: message
        })
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
