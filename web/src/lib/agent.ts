const userAgent =  typeof window != "undefined" && window.navigator ? window.navigator.userAgent : "";
const isBrowser = ()=>{
    return typeof window != "undefined" && window.navigator;
}

const IOS = 'IOS';
const ANDROID = 'ANDROID';
const DESKTOP = 'DESKTOP';
const SERVER = 'SERVER';
export const getDevice = ()=>{
    if(isBrowser()){
        if(/(iPhone|iPad)/gi.test(userAgent)){
            return IOS
        }else if(/(Android)/gi.test(userAgent)){
            return ANDROID;
        }else{
            return DESKTOP;
        }
    }
    return SERVER;
}
export const isDesktop = ()=>{
    return getDevice() === DESKTOP
}
export const isDesktopViewRouter = ()=>{
    return isDesktop() &&
        (location.pathname.indexOf("/broadcast") > -1
        || location.pathname.indexOf("/clip_recoding") > -1
        || location.pathname.indexOf("/clip_upload") > -1
        || location.pathname.indexOf("/clip/") > -1
        || location.pathname.indexOf("/mailbox") > -1)
}

export { userAgent , isBrowser , IOS, ANDROID , DESKTOP }
export default getDevice();