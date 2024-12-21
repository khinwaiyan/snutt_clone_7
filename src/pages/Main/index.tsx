import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { TimeTableHeaderContainer } from '@/components/header';
import { Icon } from '@/components/icon';
import { Layout } from '@/components/layout';
import { LoadingPage } from '@/components/Loading';
import { Navbar } from '@/components/Navbar';
import { ServiceContext } from '@/context/ServiceContext';
import { TimetableContext } from '@/context/TimetableContext';
import { TokenAuthContext } from '@/context/TokenAuthContext';
import { ICON_SRC } from '@/entities/route';
import { useGuardContext } from '@/hooks/useGuardContext';
import { useRouteNavigation } from '@/hooks/useRouteNavigation';
import { Drawer } from '@/pages/Main/Drawer';
import { TimeTableView } from '@/pages/Main/TimeTable';
import { showDialog } from '@/utils/showDialog';

export const MainPage = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const { toLectureList } = useRouteNavigation();
  const { timetableId, setTimetableId } = useGuardContext(TimetableContext);
  const { timeTableService } = useGuardContext(ServiceContext);
  const { timeTableListData } = useGetTimeTable();
  const { showErrorDialog } = showDialog();

  const currentTimetable = (() => {
    if (timeTableListData === undefined || timeTableListData.type === 'error') {
      return null;
    }
    return timetableId !== null
      ? timeTableListData.data.find((tt) => tt._id === timetableId)
      : timeTableListData.data[0];
  })();

  const { timetableData } = useGetTimetableData({
    timetableId: currentTimetable?._id,
  });

  if (timetableData === undefined) return <LoadingPage />;

  if (timetableData.type === 'error') {
    showErrorDialog(timetableData.message);
    return null;
  }

  const handleClickSetTimetableId = (selectedTimetableId: string | null) => {
    setTimetableId(selectedTimetableId);
    if (selectedTimetableId === null) {
      timeTableService.resetSelectedTimetableId();
      return;
    }
    timeTableService.storeSelectedTimetableId({
      selectedTimetableId,
    });
  };

  const totalCredit = timetableData.data.lecture_list.reduce(
    (acc, lecture) => acc + lecture.credit,
    0,
  );
  const title = timetableData.data.title;

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <Layout>
      <TimeTableHeader
        onMenuClick={toggleDrawer}
        onLectureListClick={() => {
          if (timetableId !== null) {
            toLectureList({ timetableId });
          }
        }}
        totalCredit={totalCredit}
        title={title}
      />
      <div className="w-full flex-1 overflow-hidden">
        <Drawer
          isOpen={isDrawerOpen}
          onClose={closeDrawer}
          selectedTimetableId={currentTimetable?._id ?? null}
          handleClickSetTimetableId={handleClickSetTimetableId}
        />
        <TimeTableView currentTimetable={timetableData.data} />
      </div>
      <Navbar selectedMenu="timetable" />
    </Layout>
  );
};

const TimeTableHeader = ({
  onMenuClick,
  onLectureListClick,
  totalCredit,
  title,
}: {
  onMenuClick: () => void;
  onLectureListClick: () => void;
  totalCredit: number;
  title: string;
}) => {
  return (
    <TimeTableHeaderContainer>
      <div className="flex items-center gap-2">
        <Icon
          src={ICON_SRC.HAMBURGER}
          alt="서랍 열기 버튼"
          onClick={onMenuClick}
        />
        <h1 className="font-semibold">{title}</h1>
        <span className="text-xs text-gray-400">{`(${totalCredit} 학점)`}</span>
      </div>
      <div className="flex items-center gap-2">
        <Icon
          src={ICON_SRC.LIST_BULLET}
          onClick={onLectureListClick}
          alt="강의 목록 보기 버튼"
        />
        <Icon src={ICON_SRC.SHARE} alt="공유하기 버튼" />
        <Icon src={ICON_SRC.BELL} alt="알림 버튼" />
      </div>
    </TimeTableHeaderContainer>
  );
};

const useGetTimeTable = () => {
  const { token } = useGuardContext(TokenAuthContext);
  const { timeTableService } = useGuardContext(ServiceContext);

  const { data: timeTableListData } = useQuery({
    queryKey: ['TimeTableService', 'getTimeTableList', token] as const,
    queryFn: ({ queryKey: [, , t] }) => {
      if (t === null) {
        throw new Error('토큰이 없습니다.');
      }
      return timeTableService.getTimeTableList({ token: t });
    },
    enabled: token !== null,
  });

  return { timeTableListData };
};

const useGetTimetableData = ({
  timetableId,
}: {
  timetableId: string | undefined;
}) => {
  const { token } = useGuardContext(TokenAuthContext);
  const { timeTableService } = useGuardContext(ServiceContext);

  const { data: timetableData } = useQuery({
    queryKey: [
      'TimeTableService',
      'getTimeTableById',
      token,
      timetableId,
    ] as const,
    queryFn: ({ queryKey: [, , t, ttId] }) => {
      if (t === null || ttId === undefined) {
        throw new Error('잘못된 요청입니다.');
      }
      return timeTableService.getTimeTableById({ token: t, timetableId: ttId });
    },
    enabled: token !== null && timetableId !== undefined,
  });

  return { timetableData };
};
