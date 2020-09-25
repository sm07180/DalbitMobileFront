import React, {useState, useContext, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {IMG_SERVER} from 'context/config'
import './thanksgiving.scss'
import Api from 'context/api'
// context
import {Context} from 'context'
import {OS_TYPE} from 'context/config.js'

export default () => {
  let history = useHistory()
  const context = useContext(Context)
  const [myDal, setMyDal] = useState(0)

  const fetchGetBonus = async () => {
    const res = await Api.getChooseokBonus()

    if (res) {
      context.action.alert({msg: res.message})
    }
  }

  const fetchMyPurchase = async () => {
    const res = await Api.getChooseokPurchase()
    if (res.result === 'success') {
      setMyDal(res.data.purchaseDal.purchaseDal)
    } else {
      context.action.alert({msg: res.message})
    }
  }

  const HandleStore = () => {
    if (context.customHeader['os'] === OS_TYPE['IOS']) {
      return webkit.messageHandlers.openInApp.postMessage('')
    } else {
      return history.push('/pay/store')
    }
  }

  useEffect(() => {
    fetchMyPurchase()
  }, [])

  return (
    <div id="thxGiving">
      <img src={`${IMG_SERVER}/event/thxgiving/event_img_top.jpg`} />
      <div className="middleWrap">
        <div className="middle__inner">
          <p>
            내가 구매한 달 :
            <span>
              {myDal}
              <em>달</em>
            </span>
          </p>
          <button onClick={HandleStore}>
            <img src={`${IMG_SERVER}/event/thxgiving/btn_buy.png`} />
          </button>
        </div>
      </div>
      <img src={`${IMG_SERVER}/event/thxgiving/event_img_middle.jpg`} />
      <img src={`${IMG_SERVER}/event/thxgiving/event_img_bottom.jpg`} />
      <div className="bottomWrap">
        <button onClick={fetchGetBonus}>
          <img src={`${IMG_SERVER}/event/thxgiving/btn_bonus.png`} />
        </button>
      </div>
    </div>
  )
}
