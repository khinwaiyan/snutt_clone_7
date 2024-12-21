export const colorList = (colorIndex: number) => {
  switch (colorIndex) {
    case 0:
      return 'bg-orange dark:bg-orange-dark';
    case 1:
      return 'bg-red dark:bg-red-dark';
    case 2:
      return 'bg-blue dark:bg-blue-dark';
    case 3:
      return 'bg-lime dark:bg-lime-dark';
    case 4:
      return 'bg-green dark:bg-green-dark';
    case 5:
      return 'bg-mint dark:bg-mint-dark';
    case 6:
      return 'bg-purple dark:bg-purple-dark';
    case 7:
      return 'bg-pink dark:bg-pink-dark';
    case 8:
      return 'bg-yellow dark:bg-yellow-dark';
    default:
      return 'bg-orange dark:bg-orange-dark';
  }
};
