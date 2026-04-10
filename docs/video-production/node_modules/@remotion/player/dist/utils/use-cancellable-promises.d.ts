import { CancellablePromise } from './cancellable-promise';
declare const useCancellablePromises: () => {
    appendPendingPromise: (promise: CancellablePromise) => void;
    removePendingPromise: (promise: CancellablePromise) => void;
    clearPendingPromises: () => void[];
};
export { useCancellablePromises };
//# sourceMappingURL=use-cancellable-promises.d.ts.map