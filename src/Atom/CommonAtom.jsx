import { atom,selector } from "recoil";


export const userAtom = atom({
    key: 'userAtom', 
    default: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : [],

  });
  // export const tokenAtom = atom({
  //   key: 'tokenAtom', 
  //   default: localStorage.getItem('user') ? JSON.parse(localStorage.user).token : null,

  // });
  // export const UserAtom = atom({
  //   key: 'UserAtom', 
  //   default: localStorage.getItem('user') ? JSON.parse(localStorage.user) : null,

  // });
  export const filterUserDataAtom = atom({
    key: 'filterUserDataAtom',
    default: {
      sortBy: 'id',
      sortOrder: 'DESC',
    },
  });


// export const userInfo=atom({
//     key:'userInfo',
//     default: []
// })

// export const charCountState=selector({
//     key:charCountState,
//     get:({get})=>{
//         const text =get(userState);
//         return text.name.length;
//     }
// })