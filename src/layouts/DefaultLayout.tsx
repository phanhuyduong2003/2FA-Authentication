import { HeaderComponent } from "@/components/Header";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { ReactNode } from "react";

export const DefaultLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Layout>
      <HeaderComponent />
      <Content>{children}</Content>
    </Layout>
  );
};
