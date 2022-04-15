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
import RestClear from './rest_customer/CustomerClear'
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
import Rebranding from './rebranding'
import RecommendDj from './recommend_dj'
import NewYear from './new_year'
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
import Acrostic from './acrostic'
import PlayMaker from './playMaker'
import Invite from './invite'
import Share from './share'
import PlatformWar from './platformWar'
import ContentLab from './contentLab'
import ContentStar from './contentStar'
import ContentStarSchedule from './contentStarSchedule'
import KeyboardHero from './keyboardHero'
import KeyboardTodayWinning from './keyboardHero/content/todayWinning'
import Wassup from './wassup'
import moment from "moment";

export default (props) => {
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
        return <GuestGuide title={title}/>
      case 'image_guide':
        return <ImageGuide />
      case 'payment_morning':
        return <PaymentMrnoing />
      case 'payment_lunch':
        return <PaymentLunch />
      case 'customer_change':
        return <RestChange />
      case 'customer_clear':
        return <RestClear memNo={props.location?.state?.memNo} />
      case 'customer_notice':
        return <RestNotice memNo={props.location?.state?.memNo} />
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
      case 'rebranding':
        return <Rebranding />
      case 'recommend_dj':
        return <RecommendDj />
      case 'new_year':
        return <NewYear />
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
      case 'acrostic':
        return <Acrostic />
      case 'playmaker':
        return <PlayMaker />
      // case 'gganbu':
      //   return <Gganbu />
      // case 'participant':
      //   return <Participant />
      // case 'marblePocket':
      //   return <MarblePocket />
      case 'invite':
        if(new moment().isAfter('20220308')){
          return window.location.href = '/'
        }else{
          return  <Invite/>
        }
      case 'share':
        return <Share />
      case 'platformWar':
        return <PlatformWar />
      case 'contentlab':
        return <ContentLab />
      case 'wassup':
        return <Wassup />
      case 'contentstar':
        return <ContentStar />
      case 'contentstar_schedule':
        return <ContentStarSchedule />
      case 'keyboardhero':
        return <KeyboardHero />
      case 'keyboardhero_todaywinning':
        return <KeyboardTodayWinning />
      default:
        return <></>
        break
    }
  }
  return (
    <EventAttendProvider>
      {createContent()}
    </EventAttendProvider>
  )
}
