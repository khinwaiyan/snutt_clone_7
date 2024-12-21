import type { ReactNode } from 'react';

export const TimeTableHeaderContainer = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className="border-b-lineLight flex w-full justify-between border-solid bg-white p-3 pb-1.5 pl-4 pt-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200">
      {children}
    </div>
  );
};
