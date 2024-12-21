import type { ReactNode } from 'react';

import { cn } from '@/utils/designSystem';

type LabelContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  label: string;
  id: string;
};

export const LabelContainer = ({
  children,
  label,
  id,
  className,
}: LabelContainerProps) => {
  return (
    <div className={cn('flex flex-col', className)}>
      <label htmlFor={id} className="mb-1">
        {label}
      </label>
      {children}
    </div>
  );
};
