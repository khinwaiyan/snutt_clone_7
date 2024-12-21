import '@/reset.css';
import '@/index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

import type { CallParams } from '@/api';
import { impleSnuttApi } from '@/api';
import {
  AuthProtectedRoute,
  AuthProtectedSwitchRoute,
} from '@/components/Auth';
import { ColorSchemeContext } from '@/context/ColorSchemeContext';
import { ModalManageContext } from '@/context/ModalManageContext';
import { ServiceContext } from '@/context/ServiceContext';
import { TimetableContext } from '@/context/TimetableContext';
import { TokenAuthContext } from '@/context/TokenAuthContext';
import { TokenManageContext } from '@/context/TokenManageContext';
import { PATH } from '@/entities/route';
import { impleAuthRepository } from '@/infrastructure/impleAuthRepository';
import { implCourseBookRepository } from '@/infrastructure/impleCourseBookRepository';
import {
  implTimetableStorageRepository,
  implTokenSessionStorageRepository,
} from '@/infrastructure/impleStorageRepository';
import { impleColorSchemeRepository } from '@/infrastructure/impleStorageRepository';
import { impleTimeTableRepository } from '@/infrastructure/impleTimeTableRespository';
import { impleUserRepository } from '@/infrastructure/impleUserRepository';
import { ChangeNicknamePage } from '@/pages//ChangeNickname';
import { AccountPage } from '@/pages/Account';
import { ColorSchemePage } from '@/pages/ColorScheme';
import { NotFoundPage } from '@/pages/Error';
import { LandingPage } from '@/pages/Landing';
import { LectureDetailPage } from '@/pages/Lecture/LectureDetail';
import { LectureListPage } from '@/pages/Lecture/LectureList';
import { MainPage } from '@/pages/Main';
import { MyPage } from '@/pages/MyPage';
import { SignInPage } from '@/pages/SignIn';
import { SignUpPage } from '@/pages/SignUp';
import { getAuthService } from '@/usecases/authServices';
import { getColorSchemeService } from '@/usecases/colorSchemeService';
import { getCourseBookService } from '@/usecases/courseBookService';
import { getTimeTableService } from '@/usecases/timeTableService';
import { getUserService } from '@/usecases/userService';
import { showDialog } from '@/utils/showDialog';

import { implLectureRepository } from './infrastructure/impleLecutreRepository';
import { getLecutureService } from './usecases/lectureService';

// 어떠한 경로로 요청하더라도 Landing Page로 이동할 수 있도록 함.
// 무효 토큰을 막아야 하는 페이지는 AuthProtectedRoute 사용

const publicRoutes = [
  {
    path: PATH.SIGNIN,
    element: <SignInPage />,
  },
  {
    path: PATH.SIGNUP,
    element: <SignUpPage />,
  },
  {
    path: '/*',
    element: <NotFoundPage />,
  },
];

const authSwitchRoutes = [
  {
    path: PATH.INDEX,
    element: (
      <AuthProtectedSwitchRoute
        authorized={<MainPage />}
        unauthorized={<LandingPage />}
      />
    ),
  },
];

const authRoutes = [
  {
    element: (
      <AuthProtectedRoute>
        <Outlet />
      </AuthProtectedRoute>
    ),
    children: [
      {
        path: PATH.MYPAGE,
        element: <MyPage />,
      },
      {
        path: PATH.MYPAGE_ACCOUNT,
        element: <AccountPage />,
      },
      {
        path: PATH.MYPAGE_CHANGENICKNAME,
        element: <ChangeNicknamePage />,
      },
      {
        path: PATH.MYPAGE_COLORSCHEME,
        element: <ColorSchemePage />,
      },
      {
        path: PATH.LECTURE_DETAIL,
        element: <LectureDetailPage />,
      },
      {
        path: PATH.LECTURE_LIST,
        element: <LectureListPage />,
      },
    ],
  },
];

const routers = createBrowserRouter([
  ...publicRoutes,
  ...authSwitchRoutes,
  ...authRoutes,
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export const App = () => {
  const [isTokenError, setIsTokenError] = useState(false);
  // .env를 추가하면 lint가 터져서 일단 하드코딩해서 넣음.
  // 추후 허락 받고 rule 추가하기
  const ENV = {
    API_BASE_URL: 'https://wafflestudio-seminar-2024-snutt-redirect.vercel.app',
  };
  const { showErrorDialog } = showDialog();

  const call = async (content: CallParams) => {
    const response = await fetch(`${ENV.API_BASE_URL}/${content.path}`, {
      method: content.method,
      headers: content.headers,
      ...(content.body !== undefined
        ? { body: JSON.stringify(content.body) }
        : {}),
    });

    const responseBody = (await response.json().catch(() => null)) as unknown;

    if (!response.ok) {
      if (
        responseBody !== null &&
        typeof responseBody === 'object' &&
        'errcode' in responseBody &&
        responseBody.errcode === 8194
      )
        setIsTokenError(true);
    }
    return {
      status: response.status,
      data: responseBody,
    };
  };

  const snuttApi = impleSnuttApi({
    httpClient: {
      call: call,
    },
  });

  // Repository, Service를 하나의 services 변수로 통합
  const authRepository = impleAuthRepository({ snuttApi });
  const userRepository = impleUserRepository({ snuttApi });
  const temporaryStorageRepository = implTokenSessionStorageRepository();
  const timeTableRepository = impleTimeTableRepository({ snuttApi });
  const courseBookRepository = implCourseBookRepository({ snuttApi });
  const lectureRepository = implLectureRepository({ snuttApi });
  const timetableStorageRepository = implTimetableStorageRepository();
  const colorSchemeRepository = impleColorSchemeRepository();

  const authService = getAuthService({
    authRepository,
    tokenRepository: temporaryStorageRepository,
  });
  const userService = getUserService({ userRepository });
  const timeTableService = getTimeTableService({
    timeTableRepository,
    timetableStorageRepository,
  });
  const courseBookService = getCourseBookService({ courseBookRepository });
  const lectureService = getLecutureService({ lectureRepository });
  const colorSchemeService = getColorSchemeService({ colorSchemeRepository });

  const services = {
    authService,
    userService,
    timeTableService,
    courseBookService,
    lectureService,
    colorSchemeService,
  };

  // 토큰과 관련된 context는 따로 저장

  // tanstack query를 사용하지 않으면 그냥 tokenService를 TokenManageContext에 넣으면 됨.
  // 하지만 우리는 tanstack query를 사용하기로 했으므로
  // 인증 상태에 따라 캐싱된 데이터를 업데이트 or 삭제해줘야 함.
  const [token, setToken] = useState(temporaryStorageRepository.getToken());

  const [timetableId, setTimetableId] = useState(
    timetableStorageRepository.getStorageTimetableId,
  );

  const [colorScheme, setColorScheme] = useState<string | null>(() => {
    const savedColorScheme = colorSchemeRepository.getStorageColorScheme();

    if (savedColorScheme !== null) return savedColorScheme;

    const prefersDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    return prefersDarkMode ? 'dark' : 'light';
  });

  const toggleColorScheme = () => {
    setColorScheme((prevColorScheme) =>
      prevColorScheme === 'light' ? 'dark' : 'light',
    );
  };

  const colorSchemeContextValue = {
    colorScheme,
    toggleColorScheme,
  };

  // token을 context api를 사용하여 관리하면 getToken을 사용할 이유가 없어짐.
  // saveToken과 clearToken만 생성
  const manageToken = {
    saveToken: (newToken: string) => {
      setToken(newToken);
    },
    clearToken: () => {
      setToken(null);
      // 241009 연우:
      // resetQuery에서 오류가 나오면 어떻게 해야할지 몰라서 일단 error 찍는 걸로 넣음.
      queryClient.resetQueries().catch(() => {
        showErrorDialog(
          '예상치 못한 에러가 발생했어요. 페이지를 새로고침 해주세요.',
        );
      });
    },

    // 241012 연우:
    // 개발자용 토큰 변조를 위한 부분
    // 다음주 과제 생성 시에 삭제
    contaminateToken: (wrongToken: string) => {
      setToken(wrongToken);
      temporaryStorageRepository.saveToken(wrongToken);
    },
  };

  // 모달 창 닫아주는 함수를 context api를 사용하여 관리
  const setOpen = (isOpen: boolean) => {
    setIsTokenError(isOpen);
  };

  useEffect(() => {
    if (colorScheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [colorScheme]);

  return (
    <QueryClientProvider key={token} client={queryClient}>
      <ServiceContext.Provider value={services}>
        <TokenManageContext.Provider value={manageToken}>
          <ModalManageContext.Provider
            value={{ isModalOpen: isTokenError, setOpen }}
          >
            <TokenAuthContext.Provider value={{ token }}>
              <ColorSchemeContext.Provider value={colorSchemeContextValue}>
                <TimetableContext.Provider
                  value={{ timetableId, setTimetableId }}
                >
                  <RouterProvider router={routers} />
                </TimetableContext.Provider>
              </ColorSchemeContext.Provider>
            </TokenAuthContext.Provider>
            <Toaster position="top-center" />
          </ModalManageContext.Provider>
        </TokenManageContext.Provider>
      </ServiceContext.Provider>
    </QueryClientProvider>
  );
};
