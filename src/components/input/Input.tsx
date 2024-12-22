import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

import { cn } from '@/utils/designSystem';

const textInputVariants = cva(
  'dark-text-gray-200 border-b-2 border-gray py-1 text-sm focus:outline-none',
  {
    variants: {
      variant: {
        default: 'focus:border-mint',
        orange: 'focus:border-orange',
      },
      dark: {
        default: 'dark:bg-gray-800 dark:text-gray-200',
        none: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      dark: 'default',
    },
  },
);

interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof textInputVariants> {
  type?: 'text' | 'password';
  darkModeInvert?: 'none' | 'default';
}

type SelectInputProps = React.InputHTMLAttributes<HTMLSelectElement>;

type iosTextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  type?: 'text' | 'password';
};

export const TextInput = ({
  type,
  value,
  id,
  onChange,
  onKeyDown,
  placeholder,
  className,
  variant,
  dark,
}: TextInputProps) => {
  return (
    <input
      type={type === 'password' ? 'password' : 'text'}
      id={id}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className={cn(
        textInputVariants({
          variant,
          dark,
          className,
        }),
      )}
    />
  );
};

export const SelectInput = ({
  onChange,
  disabled,
  className,
  children,
}: SelectInputProps) => {
  return (
    <select
      onChange={onChange}
      className={cn(
        'border-b-2 border-gray py-1 text-sm focus:border-mint focus:outline-none dark:bg-gray-800 dark:text-gray-200',
        className,
      )}
      disabled={disabled}
    >
      {children}
    </select>
  );
};

export const IosTextInput = ({
  type,
  value,
  id,
  onChange,
  placeholder,
  className,
}: iosTextInputProps) => {
  return (
    <input
      type={type === 'password' ? 'password' : 'text'}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={cn(
        'm-1 mb-3 h-10 w-[335px] rounded-lg bg-white pl-4 dark:bg-gray-800 dark:text-gray-200',
        className,
      )}
    />
  );
};
