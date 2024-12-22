import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { BottomSheetContainer } from '@/components/BottomeSheetContainer';
import { TextButton } from '@/components/button';
import { TextInput } from '@/components/input/Input';
import { LabelContainer } from '@/components/input/LabelContainer';
import { SpinnerLoading } from '@/components/Loading';
import { ServiceContext } from '@/context/ServiceContext';
import { TokenAuthContext } from '@/context/TokenAuthContext';
import { useGuardContext } from '@/hooks/useGuardContext';
import { useBottomSheet } from '@/hooks/useVisible';
import { showDialog } from '@/utils/showDialog';

export const AddTimeTableBySemesterBottomSheet = ({
  year,
  semester,
  onClose,
}: {
  year: number;
  semester: number;
  onClose(): void;
}) => {
  const { isVisible, handleClose } = useBottomSheet({ onClose });
  const [timeTableName, setTimeTableName] = useState('');
  const { createTimeTableBySemester, isPending } = useCreateTimeTableBySemester(
    { handleClose },
  );

  const onSubmit = () => {
    if (timeTableName !== '') {
      createTimeTableBySemester({ year, semester, timeTableName });
    }
  };

  return (
    <>
      <BottomSheetContainer
        isVisible={isVisible}
        onClick={handleClose}
        padding="p-6"
      >
        {isPending && <SpinnerLoading />}
        <div className="flex flex-col gap-6 dark:bg-gray-800 dark:text-gray-200">
          <div className="flex-end flex justify-between">
            <TextButton onClick={handleClose}>취소</TextButton>
            <TextButton form="addTimeTableBySemesterForm">완료</TextButton>
          </div>

          <form
            id="addTimeTableBySemesterForm"
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit();
            }}
          >
            <div className="flex flex-col gap-2">
              <LabelContainer
                id="id"
                label="새로운 시간표 만들기"
                className="gap-2"
              >
                <TextInput
                  id="id"
                  value={timeTableName}
                  onChange={(e) => {
                    setTimeTableName(e.target.value);
                  }}
                  placeholder={'시간표 제목을 입력하세요'}
                  disabled={isPending}
                />
              </LabelContainer>
            </div>
          </form>
        </div>
      </BottomSheetContainer>
    </>
  );
};

const useCreateTimeTableBySemester = ({
  handleClose,
}: {
  handleClose(): void;
}) => {
  const { timeTableService } = useGuardContext(ServiceContext);
  const { token } = useGuardContext(TokenAuthContext);
  const { showErrorDialog } = showDialog();
  const queryClient = useQueryClient();

  const { mutate: createTimeTableBySemester, isPending } = useMutation({
    mutationFn: async ({
      year,
      semester,
      timeTableName,
    }: {
      year: number;
      semester: number;
      timeTableName: string;
    }) => {
      if (token === null) {
        throw new Error('토큰이 존재하지 않습니다.');
      }
      return await timeTableService.createTimeTable({
        token,
        year,
        semester,
        title: timeTableName,
      });
    },
    onSuccess: async (response) => {
      if (response.type === 'success') {
        handleClose();
        await queryClient.invalidateQueries({
          queryKey: ['TimeTableService'],
        });
      } else {
        showErrorDialog(response.message);
      }
    },
    onError: () => {
      showErrorDialog('시간표 생성 중 문제가 발생했습니다.');
    },
  });

  return { createTimeTableBySemester, isPending };
};
