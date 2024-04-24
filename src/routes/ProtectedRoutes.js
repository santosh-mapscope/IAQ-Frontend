
import React from 'react';
import { Navigate } from "react-router-dom";
import MasterLayout from "../layouts/MasterLayout";
 
const ProtectedRoutes = ({auth}) => {  
    return (auth === true ? <MasterLayout /> : <Navigate to="/" replace/>)
}
export default ProtectedRoutes;
