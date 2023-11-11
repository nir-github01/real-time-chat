import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../modules/dashboard/Dashboard";
import FormPage from "../modules/form/FormPage";

const RoutesPage = () => {
  const ProtectedRoutes = ({ children, auth = false }) => {
    const isLoggedIn = localStorage.getItem("user:token") !== null || false;
    // console.log("isLoggedIn  "+ isLoggedIn)
    if (!isLoggedIn && auth) {
      return <Navigate to={"/users/login"} />;
    } else if (
      isLoggedIn &&
      ["/user/login", "/user/signup"].includes(window.location.pathname)
    ) {
      return <Navigate to={"/"} />;
    }
    // console.log('children   ' +  children)
    return children;
  };
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <Dashboard auth={true} />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/user/login"
          element={
            <ProtectedRoutes>
              <FormPage isSignIn={true} />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/user/signup"
          element={
            <ProtectedRoutes>
              <FormPage isSignIn={false} />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </div>
  );
};

export default RoutesPage;
