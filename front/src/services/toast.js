import toast from 'react-hot-toast';

const showToast = (message, type = 'success') => {
  const options = {
    duration: 2000,
    position: 'top-center',
    style: {
      backgroundColor: 'var(--card)',
      color: 'var(--text)',
      borderRadius: 'var(--radius)',
      padding: '16px 20px',
      fontSize: 'var(--font-size)',
    },
  };

  switch (type) {
    case 'success':
      toast.success(message, options);
      break;
    case 'error':
      toast.error(message, options);
      break;
    case 'loading':
      toast.loading(message, options);
      break;
    case 'custom':
      toast(message, options);
      break;
    default:
      toast(message, options);
  }
};

export default showToast;
