import type { Callback, DepStateWithWatch, DepStack, ComponentInstance } from "./types";
export declare class Dep extends Map<any, Set<Callback>> {
    static stores: Record<string, DepStateWithWatch>;
    static stack: DepStack;
}
export declare function updateStoreState(): void;
export declare function clearStoreDep(): void;
export declare function removeStoreDep(instance: ComponentInstance): void;
