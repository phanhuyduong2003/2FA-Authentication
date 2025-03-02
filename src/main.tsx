import App from "@/App";
import { AuthProvider } from "@/context/AuthContext";
import { ConfigProvider } from "antd";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { IconContext } from "react-icons";
import { BrowserRouter } from "react-router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "Noto Sans JP",
            fontSize: 16,
          },
          components: {
            Card: {
              headerBg: "#1677ff",
            },
            Layout: {
              headerBg: "#fff",
              bodyBg: "#fff",
              footerBg: "#fff",
              headerPadding: "15px 0",
              footerPadding: "10px 15px",
              headerHeight: 80,
            },
          },
        }}
      >
        <IconContext.Provider value={{ size: "20" }}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </IconContext.Provider>
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>,
);
