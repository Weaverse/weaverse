import { Weaverse } from "@weaverse/core";

export interface WeaverseElementProps {
    children?: React.ReactNode;
}

export type WeaverseRootPropsType = { context: Weaverse }