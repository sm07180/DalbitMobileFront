import React from 'react'
import {useParams} from 'react-router-dom'
import {EventAttendProvider} from './event_attend_new/attend_ctx'

//component
import Layout from 'pages/common/layout'
import ThxGiving from './thanksgiving'
import ClipEventNative from './clip_event'
import ClipGiftEvent from './clip_gift_event'
import AttendEvent from './event_attend_new'
import AttendGiftWinner from './event_attend_new/content/roulette/gift_winner'
import AttendMyApply from './event_attend_new/content/roulette/my_apply'
import GuestGuide from './guest_guide'
import ImageGuide from './image_guide'
import PaymentMrnoing from './payment_morning'
import PaymentLunch from './payment_lunch'

export default () => {
  const params = useParams()

  const createContent = () => {
    let {title} = params
    switch (title) {
      case 'thanksgiving':
        return <ThxGiving />
      case 'clip_event':
        return <ClipEventNative />
      case 'clip_gift_event':
        return <ClipGiftEvent />
      case 'attend_event':
        return <AttendEvent />
      case 'attend_event_gift':
        return <AttendGiftWinner />
      case 'attend_my_apply':
        return <AttendMyApply />
      case 'guest_guide':
        return <GuestGuide />
      case 'image_guide':
        return <ImageGuide />
      case 'payment_morning':
        return <PaymentMrnoing />
      case 'payment_lunch':
        return <PaymentLunch />

      default:
        return <></>
        break
    }
  }
  return (
    <EventAttendProvider>
      <Layout status="no_gnb">{createContent()}</Layout>
    </EventAttendProvider>
  )
}
