import { paths } from "@/config";
import { DefaultLayout } from "@/layouts/DefaultLayout";
import { Home, Login, MyAccount, Register } from "@/pages";
import { RouteType } from "@/types/routes";

export const publicRoutes: RouteType[] = [
  {
    path: paths.login,
    component: Login,
  },
  {
    path: paths.register,
    component: Register,
  },
];
export const protectedRoutes: RouteType[] = [
  {
    path: paths.home,
    component: Home,
    layout: DefaultLayout,
  },
  {
    path: paths.account,
    component: MyAccount,
    layout: DefaultLayout,
  },
];
