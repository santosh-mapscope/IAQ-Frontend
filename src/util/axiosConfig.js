import axios from 'axios';
import { baseURL } from '../util/baseURL';
// import { tokenAtom } from '../Atom/CommonAtom';

const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;

export const axiosInstance = axios.create({
  baseURL: baseURL
});

export const headers = {
  'Content-Type': 'application/json',
}
export const headersForJwt = {
  'Authorization': `Bearer ${token}`,
}
export const headersForJwtWithJson = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}


