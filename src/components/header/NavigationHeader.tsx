import type { ReactNode } from 'react';

import { Icon } from '@/components/icon';
import { ICON_SRC } from '@/entities/route';

type NavigationHeaderProps = {
  darkModeInvert?: 'default' | 'none';
  title: string;
  moveTo(): void;
  children?: ReactNode;
};

export const NavigationHeader = ({
  darkModeInvert = 'default',
  title,
  moveTo,
  children,
}: NavigationHeaderProps) => {
  return (
    <div className="relative flex h-14 w-full justify-between px-5 py-3 dark:bg-gray-800 dark:text-gray-200">
      <div className="flex cursor-pointer items-center">
        <Icon
          src={ICON_SRC.ARROW.DOWN}
          darkModeInvert={darkModeInvert}
          className="rotate-90"
          alt="뒤로가기"
        />
        <span className="text-sm text-black hover:text-orange" onClick={moveTo}>
          뒤로
        </span>
      </div>
      <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-semibold">
        {title}
      </h1>
      <div className="flex cursor-pointer items-center">{children}</div>
    </div>
  );
};
