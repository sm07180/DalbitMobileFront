/**
 * @file context/config.js
 * @brief 환경설정값
 * @todo 개발모드/프로덕션모드 분기할수있게.
 */

export const VERSION = '4.7'
/**
 * @brief 서버분기
 */
export const SERVICE_SERVER = 'https://devwww2.dalbitcast.com' //서비스서버
export const API_SERVER = window.location.port === '44443' ? 'https://devapi2.dalbitcast.com:44443' : 'https://devapi2.dalbitcast.com' //API서버
//export const API_SERVER = window.location.port === '44443' ? 'https://devapi2.dalbitcast.com:44443' : 'https://devm-hwlee.dalbitcast.com:4431' //API서버
//https://devm-hwlee.dalbitcast.com:4431/mypage/declar
export const IMG_SERVER = window.location.port === '44443' ? 'https://devimage.dalbitcast.com:44443' : 'https://devimage.dalbitcast.com' //이미지 CDN
export const PHOTO_SERVER = 'https://devphoto2.dalbitcast.com' //이미지서버 (사용자가 올리는서버)
//export const PHOTO_SERVER = 'https://devm-leejaeho1144.dalbitcast.com:4433' //이미지서버 (사용자가 올리는서버)

/**
 * @brief 레이아웃
 */
export const HEADER_HEIGHT = '350px'

/**
 * @brief PC,Tablet,Moble 사이즈 분기
 * @code import {WIDTH_TABLET} from 'context/config'
 */
export const WIDTH_PC = '1920px'
export const WIDTH_PC_S = '1280px' //디자인 시안 사이즈
export const WIDTH_TABLET = '1024px'
export const WIDTH_TABLET_S = '840px' //디자인 시안 사이즈
export const WIDTH_MOBILE = '600px'
export const WIDTH_MOBILE_S = '360px' //디자인 시안 사이즈
