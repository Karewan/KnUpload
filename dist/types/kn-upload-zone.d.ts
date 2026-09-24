import type { KnUploadInstance, KnUploadOptions, KnUploadReport, KnUploadResolvedOptions } from './types';
/**
 * Upload zone
 */
export declare class KnUploadZone<T = unknown> implements KnUploadInstance<T> {
    readonly options: KnUploadResolvedOptions<T>;
    private readonly _zone;
    private readonly _input;
    private readonly _inputCreated;
    private readonly _addedAttributes;
    private readonly _keyboard;
    private readonly _documentDrop;
    private readonly _paste;
    private _dragover;
    private _hover;
    private _session;
    /**
     * Class constructor (use KnUpload.create instead)
     * @param zone
     * @param options
     */
    constructor(zone: Element, options: KnUploadOptions<T>);
    /**
     * Zone element
     */
    get element(): Element;
    /**
     * File input
     */
    get input(): HTMLInputElement;
    /**
     * True if an upload is in progress
     */
    get uploading(): boolean;
    /**
     * Upload files (validation included), rejected if an upload is in progress
     * @param files
     * @returns
     */
    upload(files: FileList | readonly File[]): Promise<KnUploadReport<T>>;
    /**
     * Open the file selection (must be called from a user action)
     * @returns
     */
    browse(): void;
    /**
     * Cancel / abort the upload
     * @returns
     */
    cancel(): void;
    /**
     * Destroy the upload zone (abort the upload and clear all listeners)
     * @returns
     */
    destroy(): void;
    private readonly _onClick;
    private readonly _onKeyDown;
    private readonly _onInputChange;
    private readonly _onDragEnter;
    private readonly _onDragOver;
    private readonly _onDragLeave;
    private readonly _onDrop;
    private readonly _onDocumentDrag;
    private readonly _onPaste;
    /**
     * Add an attribute to the zone (if missing), removed by destroy
     * @param name
     * @param value
     * @returns
     */
    private _addAttribute;
    /**
     * Set the drag hover state
     * @param hover
     * @returns
     */
    private _setHover;
    /**
     * Set the uploading state
     * @param uploading
     * @returns
     */
    private _setUploading;
    /**
     * End the upload session
     * @param session
     * @returns
     */
    private _finish;
    /**
     * Validate the files
     * @param files
     * @returns
     */
    private _validate;
    /**
     * Validate and upload the files
     * @param filesPromise
     * @returns
     */
    private _start;
    /**
     * Send files in one request
     * @param files
     * @param session
     * @param onProgress
     * @returns
     */
    private _send;
}
