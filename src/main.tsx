import App from "@/App";
import { ConfigProvider } from "antd";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
        <BrowserRouter>
			<ConfigProvider>
                <App />
            </ConfigProvider>
		</BrowserRouter>
	</StrictMode>
);
