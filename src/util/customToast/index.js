/**
 * @author SPARC GLOBAL SOLUTIONS INC.
 */

import toast from 'react-hot-toast';

export const SuccessToast = (message) => {
  console.log(message)
  return toast.success(`${message}`, {
    style: {
      border: '1px solid #fff',
      borderRadius: '17px',
      padding: '15px 17px 15px',
      fontSize: '14px',
      color: '#fff',
      backgroundColor: '#00bc8c',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#5bc3a2',
    },
  });
};

export const ErrorToast = (message) => {
  return toast.error(`${message}`, {
    style: {
      border: '1px solid #fff',
      borderRadius: '17px',
      padding: '15px 17px 15px',
      color: '#fff',
      backgroundColor: '#e84c3d',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#e84c3d',
    },
  });
};

export const SuccessToastWithToastId = (message, toastId) => {
 
  return toast.success(`${message}`, {
    id: toastId,
    style: {
      border: '1px solid #fff',
      borderRadius: '17px',
      padding: '15px 17px 15px',
      fontSize: '14px',
      color: '#fff',
      backgroundColor: '#00bc8c',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#5bc3a2',
    },
  });
};
export const ErrorToastWithToastId = (message, toastId) => {
  return toast.error(`${message}`, {
    id: toastId,
    style: {
      border: '1px solid #fff',
      borderRadius: '17px',
      padding: '15px 17px 15px',
      color: '#fff',
      backgroundColor: '#e84c3d',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#e84c3d',
    },
  });
};
