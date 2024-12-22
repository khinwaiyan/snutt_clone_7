import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

import { cn } from '@/utils/designSystem';

const buttonVariants = cva(
  'w-full py-2 transition-colors duration-200 rounded-md',
  {
    variants: {
      variant: {
        default: 'text-white bg-orange hover:bg-orange-hover cursor-pointer',
        mint: 'text-white bg-mint hover:bg-mint-hover cursor-pointer',
        white: 'text-black bg-white hover:text-orange cursor-pointer',
        disable: 'bg-gray-100 text-gray-500 cursor-not-allowed',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const textButtonVariants = cva(
  'rounded transition-colors duration-200 p-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-600',
  {
    variants: {
      variant: {
        default:
          'text-gray-500 hover:text-orange dark:text-gray-200 cursor-pointer',
        red: 'text-red dark:text-red-dark cursor-pointer',
        disable: 'text-gray-400 dark:text-gray-300 cursor-pointer',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  onClick?: () => void;
}

interface TextButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof textButtonVariants> {}

export const Button = ({
  form,
  children,
  onClick,
  className,
  variant,
}: ButtonProps) => {
  const disabled = variant === 'disable' ? true : false;
  return (
    <button
      type="submit"
      form={form}
      className={cn(buttonVariants({ variant, className }))}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const TextButton = ({
  form,
  disabled,
  className,
  variant,
  children,
  onClick,
}: TextButtonProps) => {
  return (
    <button
      type="submit"
      form={form}
      disabled={disabled}
      onClick={onClick}
      className={cn(textButtonVariants({ variant, className }))}
    >
      {children}
    </button>
  );
};
