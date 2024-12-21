type MenuCategoryProps = React.HTMLAttributes<HTMLDivElement>;

export const MenuCategory = ({ children }: MenuCategoryProps) => {
  return (
    <div className="flex flex-col items-center justify-between">{children}</div>
  );
};
