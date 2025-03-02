import { protectedRoutes, publicRoutes } from "@/routes";
import ProtectedRoutes from "@/routes/protectedRoutes";
import { RouteType } from "@/types/routes";
import { Result, Spin } from "antd";
import { Suspense } from "react";
import { Route, Routes } from "react-router";
import { Fragment } from "react/jsx-runtime";

function App() {
  const publicRoute = publicRoutes?.map((route: RouteType) => {
    const Page = route.component;
    const Layout = route.layout ?? Fragment;

    return (
      <Route
        key={route.path}
        path={route.path}
        element={
          <Layout>
            <Page />
          </Layout>
        }
      />
    );
  });
  const protectedRoute = protectedRoutes?.map((route: RouteType) => {
    const Page = route.component;
    const Layout = route.layout ?? Fragment;

    return (
      <Route
        key={route.path}
        path={route.path}
        element={
          <Layout>
            <Page />
          </Layout>
        }
      />
    );
  });

  return (
    <>
      <Suspense fallback={<Spin size="large" />}>
        <Routes>
          {publicRoute}
          <Route element={<ProtectedRoutes />}>{protectedRoute}</Route>
          <Route
            path="*"
            element={<Result status="404" title="404" subTitle="Sorry, the page you visited does not exist." />}
          />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
