import { HandlersType, Callback } from "./types";
export declare class Interceptor {
    handlers: HandlersType;
    constructor();
    use(fulfilled: Callback, rejected: Callback): number;
    eject(index: number): void;
}
