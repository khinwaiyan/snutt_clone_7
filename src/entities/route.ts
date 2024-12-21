export const PATH = {
  INDEX: '/',
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  MYPAGE: '/mypage',
  MYPAGE_ACCOUNT: '/mypage/account',
  MYPAGE_CHANGENICKNAME: '/mypage/account/change-nickname',
  MYPAGE_COLORSCHEME: '/mypage/color-scheme',
  SEARCH: '/search',
  LECTURE_LIST: '/timetables/:timetableId/lectures',
  LECTURE_DETAIL: '/timetables/:timetableId/lectures/:lectureId',
};

export const HREF = {
  LECTURE_LIST: (timetableId: string) => `/timetables/${timetableId}/lectures`,
  LECTURE_DETAIL: (timetableId: string, lectureId: string) =>
    `/timetables/${timetableId}/lectures/${lectureId}`,
};

export const ICON_SRC = {
  TIMETABLE: {
    ON: '/navbar/tab_timetable_on.svg',
    OFF: '/navbar/tab_timetable_off.svg',
  },
  SEARCH: {
    ON: '/navbar/tab_search_on.svg',
    OFF: '/navbar/tab_search_off.svg',
  },
  EV: {
    ON: '/navbar/tab_ev_on.svg',
    OFF: '/navbar/tab_ev_off.svg',
  },
  FRIENDS: {
    ON: '/navbar/tab_friends_on.svg',
    OFF: '/navbar/tab_friends_off.svg',
  },
  MYPAGE: {
    ON: '/navbar/tab_mypage_on.svg',
    OFF: '/navbar/tab_mypage_off.svg',
  },
  HAMBURGER: '/header/hamburger.svg',
  LIST_BULLET: '/header/listbullet.svg',
  BELL: '/header/bell.svg',
  SHARE: '/header/share.svg',
  LOGO: '/logo/snutt_logo.svg',
  ARROW: {
    DOWN: '/arrow/arrow_down.svg',
  },
  ADD: '/drawer/Add.svg',
  CHECK_BOX: {
    CIRCLE: '/drawer/CheckBoxCircle.svg',
  },
  CLOSE: '/drawer/Close.svg',
  PRIMARY: '/drawer/Primary.svg',
  COPY: '/drawer/Copy.svg',
  MORE: '/drawer/More.svg',
  BOOKMARK: '/header/bookmark.svg',
  PLUS: '/header/plus.svg',
  SOCIAL: {
    KAKAO: '/landing/kakaotalkid.png',
    GOOGLE: '/landing/googleid.png',
    FACEBOOK: '/landing/facebookid.png',
    APPLE: '/landing/appleid.png',
  },
};
