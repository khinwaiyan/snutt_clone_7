import { useState } from 'react';

import { BottomSheetContainer } from '@/components/BottomeSheetContainer';
import { useBottomSheet } from '@/hooks/useVisible';
import { ChangeNameDialog, DeleteDialog } from '@/pages/Main/Dialog';
import { showDialog } from '@/utils/showDialog';

type TimeTableMenuBottomSheet = {
  timetable: {
    _id: string;
    title: string;
  };
  onClose(): void;
  selectedTimetableId: string | null;
  handleClickSetTimetableId: (timetableId: string | null) => void;
};

type DialogMenu = 'NAME' | 'DELETE' | 'NONE';

export const TimeTableMenuBottomSheet = ({
  timetable,
  onClose,
  handleClickSetTimetableId,
  selectedTimetableId,
}: TimeTableMenuBottomSheet) => {
  const { isVisible, handleClose } = useBottomSheet({ onClose });
  const [dialogMenu, setDialogMenu] = useState<DialogMenu>('NONE');

  const { showTBDDialog } = showDialog();

  const menuOptions = [
    {
      label: '이름 변경',
      action: () => {
        setDialogMenu('NAME');
      },
    },
    {
      label: '학기 대표 시간표 해제',
      action: () => {
        showTBDDialog();
      },
    },
    {
      label: '시간표 테마 설정',
      action: () => {
        showTBDDialog();
      },
    },
    {
      label: '시간표 삭제',
      action: () => {
        setDialogMenu('DELETE');
      },
    },
  ];

  const onCloseDialog = () => {
    handleClose();
    setDialogMenu('NONE');
  };

  const Dialog = () => {
    switch (dialogMenu) {
      case 'NAME':
        return (
          <ChangeNameDialog
            timetableId={timetable._id}
            onClose={onCloseDialog}
            prevTimeTableName={timetable.title}
          />
        );
      case 'DELETE':
        return (
          <DeleteDialog
            onClose={onCloseDialog}
            timetableId={timetable._id}
            selectedTimetableId={selectedTimetableId}
            handleClickSetTimetableId={handleClickSetTimetableId}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <BottomSheetContainer
        isVisible={isVisible}
        onClick={handleClose}
        padding="p-6"
      >
        {menuOptions.map((option, index) => (
          <div
            key={index}
            className="flex cursor-pointer items-center rounded px-2 py-2 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              option.action();
            }}
          >
            <span>{option.label}</span>
          </div>
        ))}
      </BottomSheetContainer>
      <Dialog />
    </>
  );
};
