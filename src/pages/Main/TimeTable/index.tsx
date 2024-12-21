import { ServiceContext } from '@/context/ServiceContext';
import { colorList } from '@/entities/color';
import { DAY_LABEL_MAP } from '@/entities/time';
import { dayList, hourList } from '@/entities/time';
import type { TimeTable } from '@/entities/timetable';
import { useGuardContext } from '@/hooks/useGuardContext';
import { useRouteNavigation } from '@/hooks/useRouteNavigation';

export const TimeTableView = ({
  currentTimetable,
}: {
  currentTimetable: TimeTable;
}) => {
  const { timeTableService } = useGuardContext(ServiceContext);
  const { toLectureDetailPage } = useRouteNavigation();

  const columnCount = dayList.length - 2;
  const rowCount = hourList.length * 12;

  return (
    <div
      className="grid h-full dark:bg-gray-800 dark:text-gray-100"
      style={{
        gridTemplateColumns: `16px repeat(${columnCount}, 1fr)`,
        gridTemplateRows: `16px repeat(${rowCount}, 1fr)`,
      }}
    >
      {/* 날짜 라벨 */}
      {dayList.slice(0, 5).map((day, i) => (
        <div
          key={`day-${day}`}
          className="row-start-1 row-end-2 flex items-end justify-center text-xs opacity-40"
          style={{
            gridColumnStart: i + 2,
            gridColumnEnd: i + 2 + 1,
          }}
        >
          {DAY_LABEL_MAP[day]}
        </div>
      ))}
      {/* 시간 라벨 */}
      {hourList.map((hour, i) => (
        <div
          key={`time-${hour}`}
          className="col-start-1 col-end-2 pr-0.5 pt-1 text-right text-xs opacity-40"
          style={{
            gridRowStart: i * 12 + 2,
            gridRowEnd: i * 12 + 2 + 6,
          }}
        >
          {hour}
        </div>
      ))}
      {/* 시간 라인 진한거*/}
      {hourList.map((time, i) => (
        <div
          key={`time-line-${time}`}
          className="col-start-1 -col-end-1 border-t-[1px] border-solid border-t-line dark:border-gray-600"
          style={{
            gridRowStart: i * 12 + 2,
            gridRowEnd: i * 12 + 2 + 6,
          }}
        ></div>
      ))}
      {/* 시간 라인 연한거 */}
      {hourList.map((time, i) => (
        <div
          key={`time-sub-line-${time}`}
          className="col-start-2 -col-end-1 border-b-[1px] border-solid border-b-line-light dark:border-gray-700"
          style={{
            gridRowStart: i * 12 + 2,
            gridRowEnd: i * 12 + 2 + 6,
          }}
        ></div>
      ))}

      {/* 날짜 라인 */}
      {dayList.slice(0, 5).map((day, i) => (
        <div
          key={`day-line-${day}`}
          className="row-start-1 -row-end-1 border-l-[1px] border-solid border-l-line dark:border-gray-600"
          style={{
            gridColumnStart: i + 2,
            gridColumnEnd: i + 2 + 1,
          }}
        ></div>
      ))}

      {/* 강의 item */}
      {currentTimetable.lecture_list.map((lecture) =>
        lecture.class_time_json.map((time, i) => {
          const {
            col: [colStart, colEnd],
            row: [rowStart, rowEnd],
          } = timeTableService.getGridPos(time);
          const colorClass = colorList(lecture.colorIndex);

          return (
            <button
              key={`${lecture._id}-${i}`}
              className={`flex flex-col items-center justify-center p-2 text-center text-white ${colorClass} col-start-${colStart} col-end-${colEnd} row-start-${rowStart} row-end-${rowEnd} cursor-pointer`}
              style={{
                gridColumnStart: colStart,
                gridColumnEnd: colEnd,
                gridRowStart: rowStart,
                gridRowEnd: rowEnd,
              }}
              onClick={() => {
                toLectureDetailPage({
                  timetableId: currentTimetable._id,
                  lectureId: lecture._id,
                });
              }}
            >
              <span className="text-[10px] font-normal">
                {lecture.course_title}
              </span>
              <span className="text-[10px] font-bold">{time.place}</span>
            </button>
          );
        }),
      )}
    </div>
  );
};
