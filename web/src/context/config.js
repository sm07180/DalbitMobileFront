/**
 * @file context/config.js
 * @brief 환경설정값
 * @todo 개발모드/프로덕션모드 분기할수있게.
 */

/**
 * @brief 서버분기
 */
export const SERVICE_SERVER = 'https://devwww2.dalbitcast.com' //서비스서버
export const API_SERVER = 'https://devapi2.dalbitcast.com' //API서버
export const IMG_SERVER = 'https://devimage.dalbitcast.com' //이미지 CDN
export const PHOTO_SERVER = 'https://devphoto2.dalbitcast.com' //이미지서버 (사용자가 올리는서버)

/**
 * @brief 레이아웃
 */
export const HEADER_HEIGHT = '350px'

/**
 * @brief PC,Tablet,Moble 사이즈 분기
 * @code import {WIDTH_TABLET} from 'Context/config'
 */
export const WIDTH_PC = '1920px'
export const WIDTH_PC2 = '1280px'
export const WIDTH_TABLET = '824px'
export const WIDTH_MOBILE = '600px'
export const WIDTH_MOBILE_S = '320px'
