type TitleHeaderProps = {
  title: string;
};

export const TitleHeader = ({ title }: TitleHeaderProps) => {
  return (
    <div
      id="upper-bar"
      className="flex w-full items-center justify-center bg-white pb-1.5 pl-4 pt-2 dark:bg-gray-800 dark:text-gray-200"
    >
      <p className="font-bold">{title}</p>
    </div>
  );
};
