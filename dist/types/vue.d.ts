import type { KnHttpError, KnHttpResponse, KnUploadInstance, KnUploadOptions, KnUploadRejection, KnUploadReport, KnUploadSettings } from 'kn-upload';
import { type MaybeRefOrGetter, type PropType, type Ref, type ShallowRef, type SlotsType } from 'vue';
/**
 * Status of a file
 */
export type KnUploadItemStatus = 'pending' | 'uploading' | 'success' | 'error' | 'canceled';
/**
 * File of the upload in progress (or of the last upload)
 */
export interface KnUploadItem {
    /** File */
    readonly file: File;
    /** Status */
    readonly status: KnUploadItemStatus;
    /** Upload progress in pourcent */
    readonly progress: number;
    /** Error of the request of the file */
    readonly error: KnHttpError | null;
}
/**
 * Reactive state and methods of an upload zone
 */
export interface UseKnUploadReturn<T = unknown> {
    /** Upload zone instance (null if the element is not mounted) */
    readonly zone: Readonly<ShallowRef<KnUploadInstance<T> | null>>;
    /** True if an upload is in progress */
    readonly uploading: Readonly<Ref<boolean>>;
    /** True if files are dragged over the zone */
    readonly dragover: Readonly<Ref<boolean>>;
    /** Global upload progress in pourcent */
    readonly progress: Readonly<Ref<number>>;
    /** Files of the upload in progress (or of the last upload) */
    readonly items: Readonly<Ref<readonly KnUploadItem[]>>;
    /** Files rejected by the last validation */
    readonly rejected: Readonly<Ref<readonly KnUploadRejection[]>>;
    /** Report of the last upload */
    readonly report: Readonly<ShallowRef<KnUploadReport<T> | null>>;
    /** Upload files (validation included) */
    upload(files: FileList | readonly File[]): Promise<KnUploadReport<T>>;
    /** Open the file selection (must be called from a user action) */
    browse(): void;
    /** Cancel the upload */
    cancel(): void;
}
/**
 * Upload zone composable: creates the zone when the element is mounted and destroys it with the component
 * @param target Zone element (template ref or getter)
 * @param options KnUpload options (read when the zone is created, use functions for the dynamic values)
 * @returns
 */
export declare function useKnUpload<T = unknown>(target: MaybeRefOrGetter<Element | null | undefined>, options: KnUploadOptions<T>): UseKnUploadReturn<T>;
/**
 * Props of the default slot of KnUploadZone
 */
export interface KnUploadSlotProps {
    /** True if an upload is in progress */
    uploading: boolean;
    /** True if files are dragged over the zone */
    dragover: boolean;
    /** Global upload progress in pourcent */
    progress: number;
    /** Files of the upload in progress (or of the last upload) */
    items: readonly KnUploadItem[];
    /** Files rejected by the last validation */
    rejected: readonly KnUploadRejection[];
    /** Report of the last upload */
    report: KnUploadReport<unknown> | null;
    /** Open the file selection */
    browse(): void;
    /** Cancel the upload */
    cancel(): void;
}
/**
 * Upload zone component
 *
 * <KnUploadZone url="/upload" :options="{ maxFiles: 5 }" @success="onSuccess" v-slot="{ progress, items }">...</KnUploadZone>
 */
export declare const KnUploadZone: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    /** Upload URL */
    url: {
        type: PropType<KnUploadSettings["url"]>;
        required: true;
    };
    /** KnUpload settings (read when the zone is created) */
    options: {
        type: PropType<Omit<KnUploadSettings, "url">>;
        default: () => {};
    };
    /** Element of the zone */
    tag: {
        type: StringConstructor;
        default: string;
    };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    dragenter: () => true;
    dragleave: () => true;
    files: (_files: File[]) => true;
    reject: (_rejections: KnUploadRejection[]) => true;
    start: (_files: File[]) => true;
    progress: (_progress: number) => true;
    fileProgress: (_file: File, _progress: number) => true;
    sent: () => true;
    success: (_res: KnHttpResponse<unknown>, _files: File[]) => true;
    error: (_err: KnHttpError, _files: File[]) => true;
    end: (_report: KnUploadReport<unknown>) => true;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /** Upload URL */
    url: {
        type: PropType<KnUploadSettings["url"]>;
        required: true;
    };
    /** KnUpload settings (read when the zone is created) */
    options: {
        type: PropType<Omit<KnUploadSettings, "url">>;
        default: () => {};
    };
    /** Element of the zone */
    tag: {
        type: StringConstructor;
        default: string;
    };
}>> & Readonly<{
    onFiles?: (_files: File[]) => any;
    onProgress?: (_progress: number) => any;
    onDragenter?: () => any;
    onDragleave?: () => any;
    onError?: (_err: KnHttpError, _files: File[]) => any;
    onSuccess?: (_res: KnHttpResponse<unknown>, _files: File[]) => any;
    onReject?: (_rejections: KnUploadRejection[]) => any;
    onStart?: (_files: File[]) => any;
    onFileProgress?: (_file: File, _progress: number) => any;
    onSent?: () => any;
    onEnd?: (_report: KnUploadReport<unknown>) => any;
}>, {
    options: Omit<KnUploadSettings<unknown>, "url">;
    tag: string;
}, SlotsType<{
    default: KnUploadSlotProps;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
