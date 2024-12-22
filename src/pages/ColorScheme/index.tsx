import { useQuery } from '@tanstack/react-query';

import { NavigationHeader } from '@/components/header';
import { Layout } from '@/components/layout';
import { LoadingPage } from '@/components/Loading';
import { MenuCategory } from '@/components/menu';
import { MenuSelect } from '@/components/menu/MenuSelect';
import { Navbar } from '@/components/Navbar';
import { ColorSchemeContext } from '@/context/ColorSchemeContext';
import { ModalManageContext } from '@/context/ModalManageContext';
import { ServiceContext } from '@/context/ServiceContext';
import { TokenAuthContext } from '@/context/TokenAuthContext';
import { useGuardContext } from '@/hooks/useGuardContext';
import { useRouteNavigation } from '@/hooks/useRouteNavigation';
import { showDialog } from '@/utils/showDialog';

export const ColorSchemePage = () => {
  const { token } = useGuardContext(TokenAuthContext);
  const { userService, colorSchemeService } = useGuardContext(ServiceContext);
  const { setOpen } = useGuardContext(ModalManageContext);
  const { showErrorDialog } = showDialog();
  const { toMypage } = useRouteNavigation();
  const { colorScheme, toggleColorScheme } =
    useGuardContext(ColorSchemeContext);

  const handleSetColorScheme = () => {
    toggleColorScheme();
    colorSchemeService.storeColorScheme({
      scheme: colorScheme === 'light' ? 'dark' : 'light',
    });
  };

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

  if (isError) {
    setOpen(true);
    return null;
  }

  if (userData === undefined) return <LoadingPage />;

  if (userData.type === 'success') {
    return (
      <Layout>
        <NavigationHeader title="화면 모드" moveTo={toMypage} />
        <div className="flex w-full flex-1 flex-col items-center justify-start gap-5 bg-gray-200 p-5 dark:bg-gray-950">
          <MenuCategory>
            <MenuSelect
              menu={
                colorScheme === 'light'
                  ? '🌙 다크 모드로 변경하기'
                  : '☀️ 라이트 모드로 변경하기'
              }
              onClick={handleSetColorScheme}
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
