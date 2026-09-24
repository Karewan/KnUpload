import type { KnUploadInstance, KnUploadOptions } from './types';
export type * from './types';
/**
 * KnUpload
 */
declare const KnUpload: {
    /** LIB VERSION */
    readonly VERSION: string;
    /** MINIMUM KNHTTP VERSION REQUIRED */
    readonly KNHTTP_MIN_VERSION: string;
    /**
     * Create an upload zone
     * @param target Zone element or CSS selector
     * @param options
     * @returns
     */
    readonly create: <T = unknown>(target: Element | string, options: KnUploadOptions<T>) => KnUploadInstance<T>;
};
export default KnUpload;
