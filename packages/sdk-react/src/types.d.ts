import {ReactChild} from "react";

export interface HWSDKConfig {
    initialData?: any
    token?: string
    projectId?: string
    hydrate?: boolean
    apiUrl?: string
}

export interface HWProps extends HWSDKConfig {
    children?: ReactChild;
}