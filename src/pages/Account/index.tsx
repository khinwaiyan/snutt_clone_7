import { useQuery } from '@tanstack/react-query';

import { NavigationHeader } from '@/components/header';
import { Icon } from '@/components/icon';
import { Layout } from '@/components/layout';
import { LoadingPage } from '@/components/Loading';
import { MenuCategory, MenuSelect } from '@/components/menu';
import { Navbar } from '@/components/Navbar';
import { ModalManageContext } from '@/context/ModalManageContext';
import { ServiceContext } from '@/context/ServiceContext';
import { TokenAuthContext } from '@/context/TokenAuthContext';
import { ICON_SRC } from '@/entities/route';
import { useGuardContext } from '@/hooks/useGuardContext';
import { useRouteNavigation } from '@/hooks/useRouteNavigation';
import { showDialog } from '@/utils/showDialog';

export const AccountPage = () => {
  const { setOpen } = useGuardContext(ModalManageContext);
  const { showErrorDialog, showCompleteDialog } = showDialog();
  const { toMypage, toChangeNickname } = useRouteNavigation();

  const { userData, isError } = useGetUserInfo();

  if (isError) {
    setOpen(true);
    return null;
  }

  if (userData === undefined) return <LoadingPage />;

  const copyNicknameToClipboard = async () => {
    if (userData.type === 'success') {
      await navigator.clipboard.writeText(
        `${userData.data.nickname.nickname}#${userData.data.nickname.tag}`,
      );
    } else {
      showErrorDialog('닉네임 복사에 실패했습니다.');
    }
  };

  const handleClickCopyNickname = () => {
    copyNicknameToClipboard()
      .then(() => {
        showCompleteDialog('닉네임을 복사했습니다.');
      })
      .catch(() => {
        showErrorDialog('닉네임 복사에 실패했습니다.');
      });
  };

  if (userData.type === 'success') {
    return (
      <Layout>
        <NavigationHeader title="내 계정" moveTo={toMypage} />
        <div className="flex w-full flex-1 flex-col items-center bg-gray-200 p-5 dark:bg-gray-950 dark:text-gray-200">
          <div id="Main-Container" className="flex flex-col gap-5">
            <MenuCategory>
              <MenuSelect
                menu="닉네임 변경"
                value={`${userData.data.nickname.nickname}#${userData.data.nickname.tag}`}
                variant="top"
                onClick={toChangeNickname}
              >
                <Icon
                  src={ICON_SRC.ARROW.DOWN}
                  size="sm"
                  className="-rotate-90"
                />
              </MenuSelect>
              <MenuSelect
                menu="닉네임 복사하기"
                variant="bottom"
                onClick={handleClickCopyNickname}
              />
            </MenuCategory>

            <MenuCategory>
              <MenuSelect menu="아이디 / 비밀번호 추가">
                <Icon
                  src={ICON_SRC.ARROW.DOWN}
                  size="sm"
                  className="-rotate-90"
                />
              </MenuSelect>
            </MenuCategory>

            <MenuCategory>
              <MenuSelect menu="SNS 계정 연동 및 해제">
                <Icon
                  src={ICON_SRC.ARROW.DOWN}
                  size="sm"
                  className="-rotate-90"
                />
              </MenuSelect>
            </MenuCategory>

            <MenuCategory>
              <MenuSelect menu="이메일" value={userData.data.email} />
            </MenuCategory>

            <MenuCategory>
              <MenuSelect menu="회원 탈퇴" highlight="red"></MenuSelect>
            </MenuCategory>
          </div>
        </div>
        <Navbar selectedMenu="mypage" />
      </Layout>
    );
  }

  showErrorDialog(userData.message);
  return null;
};

const useGetUserInfo = () => {
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
