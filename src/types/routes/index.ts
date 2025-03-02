import { ComponentType, ReactNode } from "react";

export interface RouteType {
    path: string;
    component: React.ComponentType;
    layout?: ComponentType<{children: ReactNode}> | null;
}