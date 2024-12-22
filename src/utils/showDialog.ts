import toast from 'react-hot-toast';

export const showDialog = () => {
  return {
    showErrorDialog: (message: string) => {
      toast.error(message);
    },
    showTBDDialog: () => {
      toast('아직 없는 기능이에요.', {
        icon: '🔔',
      });
    },
    showCompleteDialog: (message: string) => {
      toast.success(message);
    },
  };
};
