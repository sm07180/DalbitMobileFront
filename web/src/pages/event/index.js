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
import SpecialLeague from './special_league'
import SpecialdjBest from './specialdj_best'
import ShiningDj from './shiningdj'
import LevelAchieve from './level_achieve'
import Award from './award'
import Purchase from './purchase'
import PurchaseBenefit from './purchase_benefit'
import PostGuide from './post_guide'
import GoodStart from './goodstart'
import GganbuPocket from './gganbu/content/marblePocket'
import RecommendDj from './recommend_dj'
import RecommendDj2 from './recommend_dj2'
import NewYear from './new_year'
import Tree from './tree'
import Package from './package'
import VideoOpen from './video_open'
import VideoOpen2 from './video_open2'
import MoonRise from './moon_rise'
import BestdjIntro from './bestdj_intro'
import Bestdj from './bestdj'
import Championship from './championship'
import BroadcastRoulette from './broadcast_roulette'
import AnniversaryEvent from './anniversary'
import Welcome from './welcome'
import Gotomoon from './gotomoon'
import PlayMaker from './playMaker'
// import Gganbu from './gganbu'
// import Participant from './gganbu/content/participant'
// import MarblePocket from './gganbu/content/marblePocket'

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
        return <SpecialdjBest />
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
      case 'goodstart':
        return <GoodStart />
      case 'gganbuPocket':
        return <GganbuPocket />
      case 'recommend_dj':
        return <RecommendDj />
      case 'recommend_dj2':
        return <RecommendDj2 />
      case 'new_year':
        return <NewYear />
      case 'tree':
        return <Tree />
      case 'package':
        return <Package />
      case 'video_open':
        return <VideoOpen />
      case 'video_open2':
        return <VideoOpen2 />
      case 'special_league':
        return <SpecialLeague />
      case 'moon_rise':
        return <MoonRise />
      case 'bestdj_intro':
        return <BestdjIntro />
      case 'bestdj':
        return <Bestdj />
      case 'championship':
        return <Championship />
      case 'broadcast_roulette':
        return <BroadcastRoulette />
      case 'anniversary':
        return <AnniversaryEvent />
      case 'welcome':
        return <Welcome />
      case 'gotomoon':
        return <Gotomoon />
      case 'playMaker':
        return <PlayMaker />
      // case 'gganbu':
      //   return <Gganbu />
      // case 'participant':
      //   return <Participant />
      // case 'marblePocket':
      //   return <MarblePocket />
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
