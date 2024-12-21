import { cn } from '@/utils/designSystem';

type MenuOptionProps = React.HTMLAttributes<HTMLDivElement> & {
  label: string;
};

export const MenuOption = ({ label, className }: MenuOptionProps) => {
  return (
    <p className={cn('w-full pl-3.5 text-sm text-gray-500', className)}>
      {label}
    </p>
  );
};
