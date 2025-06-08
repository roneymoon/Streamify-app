import React from "react";
import { Routes, Route, Navigate } from "react-router";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import NotificationsPage from "./pages/NotificationsPage";
import CallPage from "./pages/CallPage";
import ChatPage from "./pages/ChatPage";
import OnBoardingPage from "./pages/OnBoardingPage";
import PageLoader from "./components/PageLoader";
import useAuthUser from "./hooks/useAuthUser";
import Layout from "./components/Layout";
import { useThemeStore } from "./store/useThemeStore";

// debugging UI page

const App = () => {
  const { isLoading, authUser } = useAuthUser();

  const isAuthenticated = Boolean(authUser);
  const isOnBoarded = authUser?.isOnboarded;

  const { theme } = useThemeStore();

  if (isLoading) return <PageLoader />;

  return (
    <div className="h-screen" data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnBoarded ? (
              <Layout showSidebar={true}>
                <HomePage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : (
              <Navigate to={isOnBoarded ? "/" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <SignUpPage />
            ) : (
              <Navigate to={isOnBoarded ? "/" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            isAuthenticated && isOnBoarded ? (
              <Layout showSidebar={true}>
                <NotificationsPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/call/:id"
          element={isAuthenticated && isOnBoarded ? (
            <Layout>
              <CallPage/>
            </Layout>
          ) : (
            <Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>
          )}
        />
        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnBoarded ? (
              <Layout showSidebar={true}>
                <ChatPage/>
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "onboarding"}/>
            )
          }
        />
        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnBoarded ? (
                <OnBoardingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

      </Routes>
    </div>
  );
};

export default App;
