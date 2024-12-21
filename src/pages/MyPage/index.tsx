import { useQuery } from '@tanstack/react-query';

import { TitleHeader } from '@/components/header';
import { Layout } from '@/components/layout';
import { LoadingPage } from '@/components/Loading';
import { MenuCategory, MenuOption, MenuSelect } from '@/components/menu';
import { Navbar } from '@/components/Navbar';
import { ColorSchemeContext } from '@/context/ColorSchemeContext';
import { ModalManageContext } from '@/context/ModalManageContext';
import { ServiceContext } from '@/context/ServiceContext';
import { TokenAuthContext } from '@/context/TokenAuthContext';
import { TokenManageContext } from '@/context/TokenManageContext';
import { useGuardContext } from '@/hooks/useGuardContext';
import { useRouteNavigation } from '@/hooks/useRouteNavigation';
import { showDialog } from '@/utils/showDialog';

export const MyPage = () => {
  const { clearToken } = useGuardContext(TokenManageContext);
  const { authService } = useGuardContext(ServiceContext);
  const { setOpen } = useGuardContext(ModalManageContext);
  const { showErrorDialog, showTBDDialog } = showDialog();
  const { toMain, toAccount, toColorScheme } = useRouteNavigation();
  const { colorScheme } = useGuardContext(ColorSchemeContext);

  const { userData, isError } = useMyPage();

  if (isError) {
    setOpen(true);
    return null;
  }

  const handleClickLogoutButton = () => {
    authService.logout();
    clearToken();
    toMain();
  };

  const handleClickInformationButton = () => {
    toAccount();
  };

  if (userData === undefined) return <LoadingPage />;

  if (userData.type === 'success') {
    return (
      <Layout>
        <TitleHeader title="마이페이지" />
        <div className="flex flex-1 flex-col items-center gap-5 bg-gray-200 py-10 dark:bg-gray-950 dark:text-gray-200">
          <MenuCategory>
            <MenuSelect
              menu="내 계정"
              value={`${userData.data.nickname.nickname}#${userData.data.nickname.tag}`}
              onClick={handleClickInformationButton}
              className="h-12"
            />
          </MenuCategory>

          <MenuCategory>
            <MenuOption label="디스플레이" />
            <MenuSelect
              menu="색상 모드"
              value={
                colorScheme === 'light' ? '☀️ 라이트 모드' : '🌙 다크 모드'
              }
              variant="top"
              onClick={toColorScheme}
            />
            <MenuSelect
              menu="시간표 설정"
              value=">"
              variant="none"
              onClick={showTBDDialog}
            />
            <MenuSelect
              menu="시간표 테마"
              value=">"
              variant="bottom"
              onClick={showTBDDialog}
            />
          </MenuCategory>

          <MenuCategory>
            <MenuOption label="서비스" />
            <MenuSelect menu="빈자리 알림" value=">" onClick={showTBDDialog} />
          </MenuCategory>

          <MenuCategory>
            <MenuOption label="버전 정보" />
            <MenuSelect
              menu="버전 정보"
              value="Waffle team07"
              variant="top"
              onClick={showTBDDialog}
            />
            <MenuSelect
              menu="개발자 정보"
              value=">"
              variant="bottom"
              onClick={showTBDDialog}
            />
          </MenuCategory>

          <MenuCategory>
            <MenuSelect
              menu="개발자 괴롭히기"
              value=">"
              onClick={showTBDDialog}
            />
          </MenuCategory>

          <MenuCategory>
            <MenuSelect
              menu="로그아웃"
              onClick={handleClickLogoutButton}
              highlight="red"
            />
          </MenuCategory>
        </div>
        <Navbar selectedMenu="mypage" />
      </Layout>
    );
  }

  showErrorDialog(userData.message);
  return null;
};

const useMyPage = () => {
  const { token } = useGuardContext(TokenAuthContext);
  const { userService } = useGuardContext(ServiceContext);

  const { data: userData, isError } = useQuery({
    queryKey: ['UserService', 'getUserInfo', token] as const,
    queryFn: ({ queryKey: [, , t] }) => {
      if (t === null) {
        throw new Error();
      }
      return userService.getUserInfo({ token: t });
    },
    enabled: token !== null,
  });

  return { userData, isError };
};
