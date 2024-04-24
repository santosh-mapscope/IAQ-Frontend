/**
 * @author SPARC GLOBAL SOLUTIONS INC.
 */

import React, { lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import ErrorPage from "./layouts/ErrorPage";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../src/Redux/Userslice';
import { RecoilRoot } from "recoil";
import SuspenseFallback from "./util/SuspenseFallback";
import { AutoLogout, startInterval } from "./services/AuthServices";

// const isLoggedIn = true; 

function App() {
  const user = useSelector(selectUser) !== null ? true : false;
  const dispatch = useDispatch();
  const userData = useSelector(selectUser);

  useEffect(() => {
    if (user) {
      const intervalId = startInterval(() => {
        AutoLogout(dispatch);
      }, 5000);
      return () => {
        clearInterval(intervalId);
      };
    }

  }, [dispatch, user]);

  const LazyUserList = lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(import("../src/pages/User/index")), 1000);
    });
  });
  const LazyDashboard = lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(import("./components/Dashboard")), 1000);
    });
  });
  const LazyRoleList = lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(import("./pages/Role/index")), 1000);
    });
  });
  const LazyMenuList = lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(import("./pages/Menu/index")), 1000);
    });
  });
  const LazyRoleMenu = lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(import("./pages/Role/RoleMenu")), 1000);
    });
  });
  const LazyClientsMenu = lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(import("./pages/Clients/ClientsList")), 1000);
    });
  });
  const LazyClientStatistics = lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(import("./pages/Clients/ClientStatistics")), 1000);
    });
  });

  const LazyClientsReprsentativeMenu = lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(import("./pages/Clients/ClientRepresentative")), 1000);
    });
  });
  const LazyBlankpage = lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(import("./components/BlankPage")), 1000);
    });
  });

  const LazyTemplatecode = lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(import("./components/TemplateCode")), 1000);
    });
  });



  const LazyCharts = lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(import("./components/Charts/Charts")), 1000);
    });
  });

  const LazyBuildingList = lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(import("./pages/Building/BuildingList")), 1000);
    });
  });
  const LazyJobManagement = lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(import("./pages/Jobs/index")), 1000);
    });
  });
  const LazyTenantsManagement = lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(import("./pages/Tenants/Tenants")), 1000);
    });
  });
  const LazyShortcodesManagement = lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(import("./pages/Shortcodes/index")), 1000);
    });
  });


  const LazyManageTemplate = lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(import("./pages/Template/index")), 1000);
    });
  });

  const LazyManageReports = lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(import("./pages/Report/index")), 1000);
    });
  });

  const LazyManageOtherReports = lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(import("./pages/Report/indexOtherReports")), 1000);
    });
  });

  const LazyAddTemplate = lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(import("./pages/Template/AddTemplate")), 1000);
    });
  });
  const LazyGenerateReport = lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(import("./pages/Report/GenerateReport")), 1000);
    });
  });
  const LazyCSVupload = lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(import("./pages/UploadCSV/UploadCSVHelper")), 1000);
    });
  });

  const LazyEditTemplate = lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(import("./pages/Template/EditTemplate")), 1000);
    });
  });

  const LazyEditReport = lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(import("./pages/Report/EditReport")), 1000);
    });
  });

  const LazyDesignation = lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(import("./pages/Designation/index")), 1000);
    });
  });
  const LazyProvience = lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(import("./pages/Provience/index")), 1000);
    });
  });
  const LazyCity = lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(import("./pages/City/index")), 1000);
    });
  });
  const LazyCountry = lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(import("./pages/Country/index")), 1000);
    });
  });
  const LazyUploadCsv = lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(import("./pages/UploadCSV/index")), 1000);
    });
  });

  const LazyEmailTemplate = lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(import("./pages/Template/EmailTemplate")), 1000);
    });
  });

  console.log("User:", user);
  console.log("UserData:", userData);

  const allowedPaths = user ? userData.menu.reduce((paths, item) => {
    if (item.module === "/") {
      paths.push(item.module); // Include parent module
      item.child.forEach(childItem => {
        paths.push(childItem.module); // Include child modules
      });
    } else {
      paths.push(item.module); // Include regular modules
    }
    return paths;
  }, []) : [];


  const isPathAllowed = (path) => {
    return allowedPaths.includes(path);
  };


  return (
    <div>
      <RecoilRoot>
        <BrowserRouter>
          <React.Suspense fallback={<SuspenseFallback />}>
            <Routes>
              <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
              <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <AuthLayout />} />
              <Route path="/login" element={<AuthLayout />} />
              <Route path="/error" element={<ErrorPage />} />
              <Route path="/accessDenied" element={<ErrorPage errorType='Oops! Access Denied' />} />
              <Route path="*" element={<ErrorPage />} /> {/* Redirect to error page for non-existing routes */}
              {/* <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
              <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <AuthLayout />} /> */}

              <Route element={<ProtectedRoutes auth={user} allowedPaths={allowedPaths} />}>
                {/* <Route path="/dashboard" element={userData.acess==building ? <Navigate to="/buildingManagement" /> : <LazyDashboard />} /> */}
                <Route path="/dashboard" element={isPathAllowed('/dashboard') ? <LazyDashboard /> : <Navigate to="/accessDenied" />} />
                <Route path="/blankpage" element={isPathAllowed('/blankpage') ? <LazyBlankpage /> : <Navigate to="/accessDenied" />} />
                <Route path="/templatecode" element={isPathAllowed('/templatecode') ? <LazyTemplatecode /> : <Navigate to="/accessDenied" />} />
                <Route path="/charts" element={isPathAllowed('/charts') ? <LazyCharts /> : <Navigate to="/accessDenied" />} />
                <Route path="/users" element={isPathAllowed('/users') ? <LazyUserList /> : <Navigate to="/accessDenied" />} />
                <Route path="/role" element={isPathAllowed('/role') ? <LazyRoleList /> : <Navigate to="/accessDenied" />} />
                <Route path="/menu" element={isPathAllowed('/menu') ? <LazyMenuList /> : <Navigate to="/accessDenied" />} />
                <Route path="/roleMenu" element={isPathAllowed('/roleMenu') ? <LazyRoleMenu /> : <Navigate to="/accessDenied" />} />
                <Route path="/clientManagement" element={isPathAllowed('/clientManagement') ? <LazyClientsMenu /> : <Navigate to="/accessDenied" />} />
                <Route path="/clientStatistics" element={isPathAllowed('/clientStatistics') ? <LazyClientStatistics /> : <Navigate to="/accessDenied" />} />
                <Route path="/clientRepresentative" element={isPathAllowed('/clientRepresentative') ? <LazyClientsReprsentativeMenu /> : <Navigate to="/accessDenied" />} />
                <Route path="/buildingManagement" element={isPathAllowed('/buildingManagement') ? <LazyBuildingList /> : <Navigate to="/accessDenied" />} />
                <Route path="/jobManagement" element={isPathAllowed('/jobManagement') ? <LazyJobManagement /> : <Navigate to="/accessDenied" />} />
                <Route path="/tenantsManagement" element={isPathAllowed('/tenantsManagement') ? <LazyTenantsManagement /> : <Navigate to="/accessDenied" />} />
                <Route path="/shortcodes" element={isPathAllowed('/shortcodes') ? <LazyShortcodesManagement /> : <Navigate to="/accessDenied" />} />
                <Route path="/reportTemplates" element={isPathAllowed('/reportTemplates') ? <LazyManageTemplate /> : <Navigate to="/accessDenied" />} />
                <Route path="/reportTemplates/addTemplate" element={isPathAllowed('/reportTemplates') ? <LazyAddTemplate /> : <Navigate to="/accessDenied" />} />
                <Route path="/reportTemplates/edit-template/:id" element={isPathAllowed('/reportTemplates') ? <LazyEditTemplate /> : <Navigate to="/accessDenied" />} />
                <Route path="/manageReports/edit-report/:id" element={isPathAllowed('/manageReports') ? <LazyEditReport /> : <Navigate to="/accessDenied" />} />
                <Route path="/manageReports" element={isPathAllowed('/manageReports') ? <LazyManageReports /> : <Navigate to="/accessDenied" />} />
                <Route path="/manageOtherReports" element={isPathAllowed('/manageOtherReports') ? <LazyManageOtherReports /> : <Navigate to="/accessDenied" />} />
                <Route path="/manageReports/generate-report" element={isPathAllowed('/manageReports') ? <LazyGenerateReport /> : <Navigate to="/accessDenied" />} />
                <Route path="/designation" element={isPathAllowed('/designation') ? <LazyDesignation /> : <Navigate to="/accessDenied" />} />
                <Route path="/uploadCSV" element={isPathAllowed('/uploadCSV') ? <LazyUploadCsv /> : <Navigate to="/accessDenied" />} />
                <Route path="/uploadCSV/uploadcsvhelper" element={isPathAllowed('/uploadCSV') ? <LazyCSVupload /> : <Navigate to="/accessDenied" />} />
                <Route path="/emailTemplate" element={isPathAllowed('/emailTemplate') ? <LazyEmailTemplate /> : <Navigate to="/accessDenied" />} />
                <Route path="/provience" element={isPathAllowed('/provience') ? <LazyProvience /> : <Navigate to="/accessDenied" />} />
                <Route path="/city" element={isPathAllowed('/city') ? <LazyCity /> : <Navigate to="/accessDenied" />} />
                <Route path="/country" element={isPathAllowed('/country') ? <LazyCountry /> : <Navigate to="/accessDenied" />} />
              </Route>

            </Routes>
          </React.Suspense>
        </BrowserRouter>
      </RecoilRoot>

    </div>
  );
}

export default App;
