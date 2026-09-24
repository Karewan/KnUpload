import type { KnHttpClient, KnHttpError, KnHttpFormDataBody, KnHttpOptions, KnHttpResponse } from 'kn-http';

export type { KnHttpClient, KnHttpError, KnHttpFormDataBody, KnHttpOptions, KnHttpRequest, KnHttpResponse } from 'kn-http';

/**
 * Value or function returning the value (evaluated at each request)
 */
export type KnUploadValue<T> = T | (() => T);

/**
 * KnHttp options of the upload requests (timeout, headers, authToken, csrf, retry...), upload and parse are set by KnUpload
 */
export type KnUploadRequestOptions = Omit<KnHttpOptions, 'upload' | 'parse'>;

/**
 * Reason of a file rejection
 * - type: file type not accepted (accept option)
 * - file-size: file too big (maxFileSize option)
 * - invalid: rejected by the validate option
 * - too-many: too many files (maxFiles option)
 * - total-size: files too big (maxTotalSize option)
 */
export type KnUploadRejectReason = 'type' | 'file-size' | 'invalid' | 'too-many' | 'total-size';

/**
 * Rejected file
 */
export interface KnUploadRejection {
	/** Rejected file */
	readonly file: File;
	/** Reason of the rejection */
	readonly reason: KnUploadRejectReason;
	/** Message returned by the validate option (null otherwise) */
	readonly message: string | null;
}

/**
 * Upload report (onEnd callback and result of zone.upload())
 */
export interface KnUploadReport<T = unknown> {
	/** True if files have been uploaded without error */
	readonly success: boolean;
	/** True if the upload has been canceled */
	readonly canceled: boolean;
	/** Uploaded files (accepted by the validation) */
	readonly files: readonly File[];
	/** Rejected files */
	readonly rejected: readonly KnUploadRejection[];
	/** Success responses (one per request) */
	readonly responses: readonly KnHttpResponse<T>[];
	/** Errors (one per failed request, canceled requests excluded) */
	readonly errors: readonly KnHttpError[];
}

/**
 * Upload zone settings (T = type of the server response data)
 */
export interface KnUploadSettings<T = unknown> {
	/** URL (mandatory) */
	url: KnUploadValue<string>;
	/** KnHttp instance used for the requests (KnHttp.create()), null = default KnHttp instance */
	client?: KnHttpClient | null;
	/** KnHttp options of the requests (timeout, headers, authToken, csrf, retry...) */
	request?: KnUploadValue<KnUploadRequestOptions>;
	/** Parse / validate the response data (the returned value is the response data) */
	parse?: ((data: unknown) => T) | null;
	/** Name of the files field (sent as files[0], files[1]...) */
	fieldName?: string;
	/** Data sent with the files (nested objects and arrays are serialized as key[subkey]) */
	data?: KnUploadValue<KnHttpFormDataBody>;
	/** Send all the files in one request (true) or one request per file (false) */
	batch?: boolean;
	/** Number of parallel requests when batch is false */
	concurrency?: number;
	/** Accepted file types: MIME types (image/png), MIME groups (image/*) or extensions (.pdf), null = all */
	accept?: string | readonly string[] | null;
	/** Maximum number of files per upload */
	maxFiles?: number;
	/** Maximum size of each file in bytes (0 = no limit) */
	maxFileSize?: number;
	/** Maximum total size of the files in bytes (0 = no limit) */
	maxTotalSize?: number;
	/** Custom validation: return false or an error message to reject the file */
	validate?: ((file: File) => boolean | string | null | undefined | void) | null;
	/** Open the file selection on click, Enter and Space (the zone is focusable) */
	clickable?: boolean;
	/** Upload the files pasted in the page */
	paste?: boolean;
	/** Upload the files of the dropped folders */
	directories?: boolean;
	/** Prevent the browser to open the files dropped outside the zone */
	preventDocumentDrop?: boolean;
	/** CSS class added to the zone when files are dragged over (null = no class) */
	dragoverClass?: string | null;
	/** CSS class added to the zone during the upload (null = no class) */
	uploadingClass?: string | null;
}

/**
 * Upload zone callbacks
 */
export interface KnUploadCallbacks<T = unknown> {
	/** Files dragged over the zone */
	onDragEnter?: (() => void) | null;
	/** Files dragged out of the zone (or dropped) */
	onDragLeave?: (() => void) | null;
	/** Files dropped, selected, pasted or given to upload() (before the validation) */
	onFiles?: ((files: File[]) => void) | null;
	/** Files rejected by the validation */
	onReject?: ((rejections: KnUploadRejection[]) => void) | null;
	/** Upload start (accepted files) */
	onStart?: ((files: File[]) => void) | null;
	/** Global upload progress in pourcent */
	onProgress?: ((progress: number) => void) | null;
	/** Upload progress of a file in pourcent (batch false only) */
	onFileProgress?: ((file: File, progress: number) => void) | null;
	/** All the files have been sent (the server can now process them) */
	onSent?: (() => void) | null;
	/** Request success (files = files of the request) */
	onSuccess?: ((res: KnHttpResponse<T>, files: File[]) => void) | null;
	/** Request error, not called on cancel (if not set, the unhandled error callback of the KnHttp instance is called) */
	onError?: ((err: KnHttpError, files: File[]) => void) | null;
	/** End of the processing (always called last, whatever the result) */
	onEnd?: ((report: KnUploadReport<T>) => void) | null;
}

/**
 * Upload zone options
 */
export interface KnUploadOptions<T = unknown> extends KnUploadSettings<T>, KnUploadCallbacks<T> {}

/**
 * Upload zone options with the defaults applied
 */
export type KnUploadResolvedOptions<T = unknown> = Required<KnUploadOptions<T>>;

/**
 * Upload zone instance
 */
export interface KnUploadInstance<T = unknown> {
	/** Zone element */
	readonly element: Element;
	/** File input */
	readonly input: HTMLInputElement;
	/** Zone options (can be updated) */
	readonly options: KnUploadResolvedOptions<T>;
	/** True if an upload is in progress */
	readonly uploading: boolean;
	/** Upload files (validation included), rejected if an upload is in progress */
	upload(files: FileList | readonly File[]): Promise<KnUploadReport<T>>;
	/** Open the file selection (must be called from a user action) */
	browse(): void;
	/** Cancel / abort the upload */
	cancel(): void;
	/** Destroy the upload zone (abort the upload and clear all listeners) */
	destroy(): void;
}
