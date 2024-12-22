type TitleHeaderProps = {
  title: string;
};

export const TitleHeader = ({ title }: TitleHeaderProps) => {
  return (
    <div
      id="upper-bar"
      className="flex h-14 w-full items-center justify-center bg-white dark:bg-gray-800 dark:text-gray-200"
    >
      <p className="font-bold">{title}</p>
    </div>
  );
};
