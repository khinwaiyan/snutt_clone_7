import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { TextButton } from '@/components/button';
import { DialogContainer } from '@/components/Dialog';
import { TextInput } from '@/components/input/Input';
import { LabelContainer } from '@/components/input/LabelContainer';
import { SpinnerLoading } from '@/components/Loading';
import { ServiceContext } from '@/context/ServiceContext';
import { TokenAuthContext } from '@/context/TokenAuthContext';
import { useGuardContext } from '@/hooks/useGuardContext';
import { useDialog } from '@/hooks/useVisible';
import { showDialog } from '@/utils/showDialog';

export const ChangeNameDialog = ({
  timetableId,
  onClose,
  prevTimeTableName,
}: {
  timetableId: string;
  onClose(): void;
  prevTimeTableName: string;
}) => {
  const [timetableName, setTimetableName] = useState(prevTimeTableName);

  const { isVisible, handleClose } = useDialog({ onClose });
  const { changeTimeTableName, isPending } = useChangeTimeTableName({
    handleClose,
  });

  const onSubmit = () => {
    if (timetableName !== '') {
      changeTimeTableName({ timetableId, timetableName });
    }
  };

  return (
    <DialogContainer isVisible={isVisible} onClick={handleClose}>
      {isPending && <SpinnerLoading />}
      <form id="changeNameForm" onSubmit={onSubmit}>
        <LabelContainer
          id="id"
          label="이름 변경하기"
          className="gap-3 text-lg font-semibold"
        >
          <TextInput
            id="id"
            value={timetableName}
            onChange={(e) => {
              setTimetableName(e.target.value);
            }}
            placeholder={'시간표 제목을 입력하세요'}
            disabled={isPending}
            dark="none"
          />
        </LabelContainer>
      </form>
      <div className="flex-end flex justify-end gap-4">
        <TextButton onClick={handleClose}>취소</TextButton>
        <TextButton form="changeNameForm">확인</TextButton>
      </div>
    </DialogContainer>
  );
};

const useChangeTimeTableName = ({ handleClose }: { handleClose(): void }) => {
  const { timeTableService } = useGuardContext(ServiceContext);
  const { token } = useGuardContext(TokenAuthContext);
  const { showErrorDialog } = showDialog();
  const queryClient = useQueryClient();

  const { mutate: changeTimeTableName, isPending } = useMutation({
    mutationFn: async ({
      timetableId,
      timetableName,
    }: {
      timetableId: string;
      timetableName: string;
    }) => {
      if (token === null) {
        throw new Error('토큰이 존재하지 않습니다.');
      }
      return await timeTableService.changeTimeTableName({
        token,
        timetableId,
        timetableName,
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
      showErrorDialog('시간표 이름 변경 중 문제가 발생했습니다.');
    },
  });

  return { changeTimeTableName, isPending };
};
