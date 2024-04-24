import { jwtDecode } from "jwt-decode";
  
import { logout } from "../Redux/Userslice"; 
import Swal from 'sweetalert2'

const AutoLogout = (dispatch) => {
    if (localStorage.getItem('user') && localStorage.getItem('user').token !== '') {
      const jwt_Token_decoded = jwtDecode(JSON.parse(localStorage.getItem('user')).token);
      if (jwt_Token_decoded.exp * 1000 < Date.now()) {
        Swal.fire({
          text: 'Your session is expired ! Please Login again..',
          showConfirmButton: false,
          timer: 2500,
        }).then((result) => {
          dispatch(logout());
        });
      }
    }
  };
  
  const startInterval = (callback, interval) => {
    const intervalId = setInterval(() => {
      callback();
    }, interval);
  
    return intervalId;
  };
  
  export { AutoLogout, startInterval };