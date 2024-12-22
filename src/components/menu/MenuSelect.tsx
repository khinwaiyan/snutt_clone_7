import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

import { cn } from '@/utils/designSystem';

const menuSelectVariants = cva(
  'flex w-[355px] cursor-pointer items-center justify-between bg-white px-4 py-2 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-600',
  {
    variants: {
      variant: {
        default: 'rounded-lg',
        top: 'rounded-t-lg',
        bottom: 'rounded-b-lg',
        none: '',
      },
      highlight: {
        default: 'dark:text-gray-200',
        red: 'text-red dark:text-red-dark',
      },
    },
    defaultVariants: {
      variant: 'default',
      highlight: 'default',
    },
  },
);

interface MenuSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof menuSelectVariants> {
  menu: string;
  value?: string;
  onClick?: () => void;
}

export const MenuSelect = ({
  menu,
  value,
  className,
  variant,
  highlight,
  children,
  onClick,
}: MenuSelectProps) => {
  return (
    <div
      className={cn(menuSelectVariants({ variant, highlight, className }))}
      onClick={onClick}
    >
      <span>{menu}</span>
      <div className="flex items-center gap-2">
        <span className="text-gray-400">{value}</span>
        {children}
      </div>
    </div>
  );
};
