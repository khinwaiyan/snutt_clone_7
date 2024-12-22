import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { TextButton } from '@/components/button';
import { NavigationHeader } from '@/components/header';
import { IosTextInput } from '@/components/input/Input';
import { Layout } from '@/components/layout';
import { LoadingPage, SpinnerLoading } from '@/components/Loading';
import { MenuOption } from '@/components/menu/MenuOption';
import { Navbar } from '@/components/Navbar';
import { ModalManageContext } from '@/context/ModalManageContext';
import { ServiceContext } from '@/context/ServiceContext';
import { TokenAuthContext } from '@/context/TokenAuthContext';
import { useGuardContext } from '@/hooks/useGuardContext';
import { useRouteNavigation } from '@/hooks/useRouteNavigation';
import { showDialog } from '@/utils/showDialog';

type LongDescription = { label: string; className?: string }[];

export const ChangeNicknamePage = () => {
  const { setOpen } = useGuardContext(ModalManageContext);
  const { toAccount } = useRouteNavigation();
  const [nickname, setNickname] = useState<string>('');

  const {
    changeNickname,
    isPending,
    isError: isNicknameError,
  } = useChangeNickname();
  const { userData, isError } = useGetUserInfo();

  if (isError || isNicknameError) {
    setOpen(true);
    return null;
  }

  const handleClickSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (nickname !== '') {
      changeNickname({ inputNickname: nickname });
    }
  };

  const descriptions: LongDescription = [
    { label: '최초 닉네임은 가입 시 임의 부여된 닉네임으로,' },
    { label: '앞의 이름을 변경할 시 4자리 숫자 태그는 자동 변경됩니다.' },
    { label: '변경된 닉네임은 나의 모든 친구에게 반영됩니다.' },
  ];

  const conditionDescriptions: LongDescription = [
    { label: '닉네임 조건', className: 'font-bold' },
    { label: '- 불완전한 한글(예: ㄱ, ㅏ)은 포함될 수 없습니다.' },
    { label: '- 영문 대/소문자는 구분됩니다.' },
    {
      label:
        '- 상대에게 불쾌감을 주는 등 부적절한 닉네임은 관리자에 의해 안내없이 수정될 수 있습니다.',
    },
  ];

  if (userData === undefined) return <LoadingPage />;

  if (userData.type === 'success') {
    return (
      <Layout>
        {isPending && <SpinnerLoading />}
        <NavigationHeader title="닉네임 변경" moveTo={toAccount}>
          <TextButton form="changeNicknameForm" className="top-0">
            저장
          </TextButton>
        </NavigationHeader>
        <div className="flex flex-1 flex-col items-center bg-gray-200 p-5 dark:bg-gray-950 dark:text-gray-200">
          <MenuOption label="닉네임 (공백 포함 한/영/숫자 10자 이내)" />
          <form id="changeNicknameForm" onSubmit={handleClickSubmit}>
            <IosTextInput
              id="nickname"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
              }}
              disabled={isPending}
              placeholder={userData.data.nickname.nickname}
            />
          </form>
          <div className="flex w-full flex-col items-start gap-4">
            <div className="flex flex-col">
              {descriptions.map((description, index) => (
                <MenuOption
                  key={`description-${index}`}
                  label={description.label}
                  className={description.className}
                />
              ))}
            </div>
            <div className="flex flex-col">
              {conditionDescriptions.map((description, index) => (
                <MenuOption
                  key={`description-${index}`}
                  label={description.label}
                  className={description.className}
                />
              ))}
            </div>
          </div>
        </div>
        <Navbar selectedMenu="mypage" />
      </Layout>
    );
  }

  return null;
};

const useChangeNickname = () => {
  const { token } = useGuardContext(TokenAuthContext);
  const { userService } = useGuardContext(ServiceContext);
  const { toAccount } = useRouteNavigation();
  const { showErrorDialog } = showDialog();

  const queryClient = useQueryClient();

  const {
    mutate: changeNickname,
    isPending,
    isError,
  } = useMutation({
    mutationFn: ({ inputNickname }: { inputNickname: string }) => {
      if (token === null) {
        throw new Error();
      }
      return userService.patchUserInfo({
        token: token,
        nickname: inputNickname,
      });
    },
    onSuccess: async (response) => {
      if (response.type === 'success') {
        await queryClient.invalidateQueries({
          queryKey: ['UserService', 'getUserInfo', token],
        });
        toAccount();
      } else {
        showErrorDialog(response.message);
      }
    },
    onError: () => {
      showErrorDialog('로그인 중 문제가 발생했습니다.');
    },
  });

  return { changeNickname, isPending, isError };
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
