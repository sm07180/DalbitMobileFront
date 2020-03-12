/**
 * App -> React sampleCode
 * @params "detail" 속성으로 전달
 */
function native() {
  // document.dispatchEvent(
  //   new CustomEvent('native-goLogin', {
  //     detail: {title: 'text', auth: '111112222CCCCCDDDDD'}
  //   })
  // )
  document.dispatchEvent(
    new CustomEvent('native-player-show', {
      detail: {
        isLike: true,
        auth: 0,
        hasStory: false,
        link: 'xy9v05euaj',
        ctrlRole: '0000000000',
        title: '4444445555555',
        rank: 3,
        state: 1,
        gstProfImg: {
          url: '',
          path: '',
          thumb62x62: '',
          thumb80x80: '',
          thumb88x88: '',
          thumb120x120: '',
          thumb150x150: '',
          thumb190x190: '',
          thumb292x292: '',
          thumb336x336: '',
          thumb700x700: ''
        },
        bjPlayToken: '611645454194137550550946',
        likes: 0,
        roomNo: '91583983205269',
        bjHolder: 'https://devimage.dalbitcast.com/holder/gold.png',
        fanRank: [
          {
            rank: 1,
            memNo: '11583120890262',
            nickNm: '임시팬랭킹1',
            gender: 'm',
            age: 10,
            profImg: {
              url: 'https://devphoto2.dalbitcast.com:44443/profile_0/20559801600/20200213133546969166.png',
              path: '/profile_0/20559801600/20200213133546969166.png',
              thumb62x62: 'https://devphoto2.dalbitcast.com:44443/profile_0/20559801600/20200213133546969166.png?62x62',
              thumb80x80: 'https://devphoto2.dalbitcast.com:44443/profile_0/20559801600/20200213133546969166.png?80x80',
              thumb88x88: 'https://devphoto2.dalbitcast.com:44443/profile_0/20559801600/20200213133546969166.png?88x88',
              thumb120x120: 'https://devphoto2.dalbitcast.com:44443/profile_0/20559801600/20200213133546969166.png?120x120',
              thumb150x150: 'https://devphoto2.dalbitcast.com:44443/profile_0/20559801600/20200213133546969166.png?150x150',
              thumb190x190: 'https://devphoto2.dalbitcast.com:44443/profile_0/20559801600/20200213133546969166.png?190x190',
              thumb292x292: 'https://devphoto2.dalbitcast.com:44443/profile_0/20559801600/20200213133546969166.png?292x292',
              thumb336x336: 'https://devphoto2.dalbitcast.com:44443/profile_0/20559801600/20200213133546969166.png?336x336',
              thumb700x700: 'https://devphoto2.dalbitcast.com:44443/profile_0/20559801600/20200213133546969166.png?700x700'
            }
          },
          {
            rank: 2,
            memNo: '11583128215641',
            nickNm: '임시팬랭킹2',
            gender: 'm',
            age: 20,
            profImg: {
              url: 'https://devphoto2.dalbitcast.com:44443/profile_0/20559801600/20200213141031308290.jpeg',
              path: '/profile_0/20559801600/20200213141031308290.jpeg',
              thumb62x62: 'https://devphoto2.dalbitcast.com:44443/profile_0/20559801600/20200213141031308290.jpeg?62x62',
              thumb80x80: 'https://devphoto2.dalbitcast.com:44443/profile_0/20559801600/20200213141031308290.jpeg?80x80',
              thumb88x88: 'https://devphoto2.dalbitcast.com:44443/profile_0/20559801600/20200213141031308290.jpeg?88x88',
              thumb120x120: 'https://devphoto2.dalbitcast.com:44443/profile_0/20559801600/20200213141031308290.jpeg?120x120',
              thumb150x150: 'https://devphoto2.dalbitcast.com:44443/profile_0/20559801600/20200213141031308290.jpeg?150x150',
              thumb190x190: 'https://devphoto2.dalbitcast.com:44443/profile_0/20559801600/20200213141031308290.jpeg?190x190',
              thumb292x292: 'https://devphoto2.dalbitcast.com:44443/profile_0/20559801600/20200213141031308290.jpeg?292x292',
              thumb336x336: 'https://devphoto2.dalbitcast.com:44443/profile_0/20559801600/20200213141031308290.jpeg?336x336',
              thumb700x700: 'https://devphoto2.dalbitcast.com:44443/profile_0/20559801600/20200213141031308290.jpeg?700x700'
            }
          },
          {
            rank: 3,
            memNo: '11583121468981',
            nickNm: '임시팬랭킹3',
            gender: 'm',
            age: 30,
            profImg: {
              url: 'https://devphoto2.dalbitcast.com:44443/profile_0/20559801600/20200213133546969166.png',
              path: '/profile_0/20559801600/20200213133546969166.png',
              thumb62x62: 'https://devphoto2.dalbitcast.com:44443/profile_0/20559801600/20200213133546969166.png?62x62',
              thumb80x80: 'https://devphoto2.dalbitcast.com:44443/profile_0/20559801600/20200213133546969166.png?80x80',
              thumb88x88: 'https://devphoto2.dalbitcast.com:44443/profile_0/20559801600/20200213133546969166.png?88x88',
              thumb120x120: 'https://devphoto2.dalbitcast.com:44443/profile_0/20559801600/20200213133546969166.png?120x120',
              thumb150x150: 'https://devphoto2.dalbitcast.com:44443/profile_0/20559801600/20200213133546969166.png?150x150',
              thumb190x190: 'https://devphoto2.dalbitcast.com:44443/profile_0/20559801600/20200213133546969166.png?190x190',
              thumb292x292: 'https://devphoto2.dalbitcast.com:44443/profile_0/20559801600/20200213133546969166.png?292x292',
              thumb336x336: 'https://devphoto2.dalbitcast.com:44443/profile_0/20559801600/20200213133546969166.png?336x336',
              thumb700x700: 'https://devphoto2.dalbitcast.com:44443/profile_0/20559801600/20200213133546969166.png?700x700'
            }
          }
        ],
        bgImg: {
          url: 'https://devphoto2.dalbitcast.com:44443/bg_3/roombg_200310_1.jpg',
          path: '/bg_3/roombg_200310_1.jpg',
          thumb62x62: 'https://devphoto2.dalbitcast.com:44443/bg_3/roombg_200310_1.jpg?62x62',
          thumb80x80: 'https://devphoto2.dalbitcast.com:44443/bg_3/roombg_200310_1.jpg?80x80',
          thumb88x88: 'https://devphoto2.dalbitcast.com:44443/bg_3/roombg_200310_1.jpg?88x88',
          thumb120x120: 'https://devphoto2.dalbitcast.com:44443/bg_3/roombg_200310_1.jpg?120x120',
          thumb150x150: 'https://devphoto2.dalbitcast.com:44443/bg_3/roombg_200310_1.jpg?150x150',
          thumb190x190: 'https://devphoto2.dalbitcast.com:44443/bg_3/roombg_200310_1.jpg?190x190',
          thumb292x292: 'https://devphoto2.dalbitcast.com:44443/bg_3/roombg_200310_1.jpg?292x292',
          thumb336x336: 'https://devphoto2.dalbitcast.com:44443/bg_3/roombg_200310_1.jpg?336x336',
          thumb700x700: 'https://devphoto2.dalbitcast.com:44443/bg_3/roombg_200310_1.jpg?700x700'
        },
        gstMemNo: '',
        remainTime: 0,
        startTs: 1583983205,
        hasNotice: false,
        isNew: false,
        bjStreamId: '716034632873737421892501',
        isFan: false,
        bjProfImg: {
          url: 'https://devphoto2.dalbitcast.com:44443/profile_0/20587834800/profile_002.jpg',
          path: '/profile_0/20587834800/profile_002.jpg',
          thumb62x62: 'https://devphoto2.dalbitcast.com:44443/profile_0/20587834800/profile_002.jpg?62x62',
          thumb80x80: 'https://devphoto2.dalbitcast.com:44443/profile_0/20587834800/profile_002.jpg?80x80',
          thumb88x88: 'https://devphoto2.dalbitcast.com:44443/profile_0/20587834800/profile_002.jpg?88x88',
          thumb120x120: 'https://devphoto2.dalbitcast.com:44443/profile_0/20587834800/profile_002.jpg?120x120',
          thumb150x150: 'https://devphoto2.dalbitcast.com:44443/profile_0/20587834800/profile_002.jpg?150x150',
          thumb190x190: 'https://devphoto2.dalbitcast.com:44443/profile_0/20587834800/profile_002.jpg?190x190',
          thumb292x292: 'https://devphoto2.dalbitcast.com:44443/profile_0/20587834800/profile_002.jpg?292x292',
          thumb336x336: 'https://devphoto2.dalbitcast.com:44443/profile_0/20587834800/profile_002.jpg?336x336',
          thumb700x700: 'https://devphoto2.dalbitcast.com:44443/profile_0/20587834800/profile_002.jpg?700x700'
        },
        gstNickNm: '',
        startDt: '20200312122005',
        isRecomm: false,
        isPop: false,
        bjNickNm: 'kanghyun1',
        gstStreamId: '',
        bjMemNo: '11583120797169'
      }
    })
  )
  return true
  //document.dispatchEvent(new Event('REACT-callback'))
}
