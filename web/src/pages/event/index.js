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
import AttendMyCoupon from './event_attend_new/content/roulette/my_coupon'
import AttendHistory from './event_attend_new/content/roulette/my_history'
import GuestGuide from './guest_guide'
import ImageGuide from './image_guide'
import PaymentMrnoing from './payment_morning'
import PaymentLunch from './payment_lunch'
import RestChange from './rest_customer/customer_change'
import RestClear from './rest_customer/customer_clear'
import RestNotice from './rest_customer/customer_notice'
import HappyTime from './happy_time'
import Specialdj from './specialdj'
import ShiningDj from './shiningdj'
import LevelAchieve from './level_achieve'
import Award from './award'
import Purchase from './purchase'
import PurchaseBenefit from './purchase_benefit'
import PostGuide from './post_guide'
import RecommendDj from './recommend_dj'
import NewYear from './new_year'
import Package from './package'
import VideoOpen from './video_open'

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
      case 'my_coupon':
        return <AttendMyCoupon />
      case 'my_history':
        return <AttendHistory />
      case 'guest_guide':
        return <GuestGuide />
      case 'image_guide':
        return <ImageGuide />
      case 'payment_morning':
        return <PaymentMrnoing />
      case 'payment_lunch':
        return <PaymentLunch />
      case 'customer_change':
        return <RestChange />
      case 'customer_clear':
        return <RestClear />
      case 'customer_notice':
        return <RestNotice />
      case 'happy_time':
        return <HappyTime />
      case 'specialdj':
        return <Specialdj />
      case 'shiningdj':
        return <ShiningDj />
      case 'level_achieve':
        return <LevelAchieve />
      case 'award':
        return <Award />
      case 'purchase':
        return <Purchase />
      case 'purchaseBenefit':
        return <PurchaseBenefit />
      case 'post_guide':
        return <PostGuide />
      case 'recommend_dj':
        return <RecommendDj />
      case 'new_year':
        return <NewYear />
      case 'package':
        return <Package />
      case 'video_open':
        return <VideoOpen />
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
