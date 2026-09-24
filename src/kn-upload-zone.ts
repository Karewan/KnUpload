import KnHttp from 'kn-http';
import type { KnHttpError, KnHttpFormDataValue, KnHttpRequest, KnHttpResponse } from 'kn-http';
import type { KnUploadInstance, KnUploadOptions, KnUploadRejection, KnUploadReport, KnUploadResolvedOptions, KnUploadValue } from './types';

/**
 * Default options (the options depending on the response type are added by the constructor)
 */
const DEFAULTS: Omit<KnUploadResolvedOptions<unknown>, 'url' | 'parse' | 'onSuccess' | 'onEnd'> = {
	client: null,
	request: {},
	fieldName: 'files',
	data: {},
	batch: true,
	concurrency: 3,
	accept: null,
	maxFiles: 1,
	maxFileSize: 0,
	maxTotalSize: 20_971_520,
	validate: null,
	clickable: true,
	paste: false,
	directories: true,
	preventDocumentDrop: false,
	dragoverClass: 'is-dragover',
	uploadingClass: 'is-uploading',
	onDragEnter: null,
	onDragLeave: null,
	onFiles: null,
	onReject: null,
	onStart: null,
	onProgress: null,
	onFileProgress: null,
	onSent: null,
	onError: null
};

/**
 * Natively interactive elements (focusable and activated by the keyboard)
 */
const INTERACTIVE = 'a[href], button, input, select, textarea';

/**
 * Upload session (one per processing of files)
 */
interface KnUploadSession<T> {
	canceled: boolean;
	readonly requests: Set<KnHttpRequest<T>>;
	readonly responses: KnHttpResponse<T>[];
	readonly errors: KnHttpError[];
}

/**
 * Resolve a value or a function returning the value
 * @param value
 * @returns
 */
function resolveValue<T>(value: KnUploadValue<T>): T {
	return typeof value === 'function' ? (value as () => T)() : value;
}

/**
 * Check if a drag event contains files
 * @param e
 * @returns
 */
function isFileDrag(e: DragEvent): boolean {
	return !!e.dataTransfer && Array.from(e.dataTransfer.types).includes('Files');
}

/**
 * Normalize the accept option
 * @param accept
 * @returns
 */
function acceptTokens(accept: string | readonly string[] | null): string[] {
	return (typeof accept === 'string' ? accept.split(',') : accept ?? []).map(t => t.trim().toLowerCase()).filter(t => t);
}

/**
 * Check if a file matches the accept tokens (extensions, MIME types and MIME groups)
 * @param file
 * @param tokens
 * @returns
 */
function isAccepted(file: File, tokens: string[]): boolean {
	const name = file.name.toLowerCase(),
		type = file.type.toLowerCase();

	return tokens.some(t => t.startsWith('.') ? name.endsWith(t) : (t.endsWith('/*') ? type.startsWith(t.slice(0, -1)) : type === t));
}

/**
 * Read all the entries of a directory
 * @param dir
 * @returns
 */
function readDirectory(dir: FileSystemDirectoryEntry): Promise<FileSystemEntry[]> {
	const reader = dir.createReader(),
		entries: FileSystemEntry[] = [];

	return new Promise((resolve, reject) => {
		const read = () => reader.readEntries(batch => {
			if (!batch.length) return resolve(entries);
			entries.push(...batch);
			read();
		}, reject);

		read();
	});
}

/**
 * Read the files of file system entries (folders are read recursively)
 * @param entries
 * @returns
 */
async function readEntries(entries: FileSystemEntry[]): Promise<File[]> {
	const files: File[] = [];

	for (const entry of entries) {
		if (entry.isFile) files.push(await new Promise<File>((resolve, reject) => (entry as FileSystemFileEntry).file(resolve, reject)));
		else if (entry.isDirectory) files.push(...await readEntries(await readDirectory(entry as FileSystemDirectoryEntry)));
	}

	return files;
}

/**
 * Get the dropped files (the entries must be read during the drop event)
 * @param dt
 * @param directories
 * @returns
 */
function droppedFiles(dt: DataTransfer, directories: boolean): Promise<File[]> {
	const files = Array.from(dt.files);
	if (!directories) return Promise.resolve(files);

	const entries: FileSystemEntry[] = [];
	for (const item of Array.from(dt.items)) {
		if (item.kind != 'file') continue;
		const entry = item.webkitGetAsEntry?.();
		if (entry) entries.push(entry);
	}

	return entries.some(e => e.isDirectory) ? readEntries(entries) : Promise.resolve(files);
}

/**
 * Upload zone
 */
export class KnUploadZone<T = unknown> implements KnUploadInstance<T> {
	readonly options: KnUploadResolvedOptions<T>;

	private readonly _zone: Element;

	private readonly _input: HTMLInputElement;

	private readonly _inputCreated: boolean;

	private readonly _addedAttributes: string[] = [];

	private readonly _keyboard: boolean;

	private readonly _documentDrop: boolean;

	private readonly _paste: boolean;

	private _dragover = 0;

	private _hover = false;

	private _session: KnUploadSession<T> | null = null;

	/**
	 * Class constructor (use KnUpload.create instead)
	 * @param zone
	 * @param options
	 */
	constructor(zone: Element, options: KnUploadOptions<T>) {
		//console.log('KnUploadZone.constructor()', zone, options);

		// Options (undefined values are ignored)
		const resolved: KnUploadResolvedOptions<T> = { ...DEFAULTS, url: '', parse: null, onSuccess: null, onEnd: null },
			target = resolved as unknown as Record<string, unknown>;
		for (const [k, v] of Object.entries(options)) if (v !== undefined) target[k] = v;
		this.options = resolved;

		if (!resolved.url) throw new Error('URL is mandatory');

		// File input (created outside the zone if missing, the content of the zone can be replaced)
		let input = zone.querySelector<HTMLInputElement>('input[type=file]');
		this._inputCreated = !input;
		if (!input) {
			input = document.createElement('input');
			input.type = 'file';
			input.hidden = true;
			document.body.appendChild(input);
		}

		this._zone = zone;
		this._input = input;

		// Never proxied by Vue (same as markRaw): the zone has an internal state
		Object.defineProperty(this, '__v_skip', { value: true });

		input.multiple = resolved.maxFiles > 1;
		const accept = acceptTokens(resolved.accept);
		if (accept.length) input.accept = accept.join(',');

		// Keyboard and ARIA (the natively interactive elements already handle them)
		this._keyboard = resolved.clickable && !zone.matches(INTERACTIVE);
		if (this._keyboard) {
			this._addAttribute('tabindex', '0');
			this._addAttribute('role', 'button');
		}

		zone.addEventListener('click', this._onClick);
		if (this._keyboard) zone.addEventListener('keydown', this._onKeyDown);
		input.addEventListener('change', this._onInputChange);
		zone.addEventListener('dragenter', this._onDragEnter);
		zone.addEventListener('dragover', this._onDragOver);
		zone.addEventListener('dragleave', this._onDragLeave);
		zone.addEventListener('drop', this._onDrop);

		// Prevent the browser to open the files dropped outside the zone
		this._documentDrop = resolved.preventDocumentDrop;
		if (this._documentDrop) {
			document.addEventListener('dragover', this._onDocumentDrag);
			document.addEventListener('drop', this._onDocumentDrag);
		}

		// Paste
		this._paste = resolved.paste;
		if (this._paste) document.addEventListener('paste', this._onPaste);
	}

	/**
	 * Zone element
	 */
	get element(): Element {
		return this._zone;
	}

	/**
	 * File input
	 */
	get input(): HTMLInputElement {
		return this._input;
	}

	/**
	 * True if an upload is in progress
	 */
	get uploading(): boolean {
		return this._session !== null;
	}

	/**
	 * Upload files (validation included), rejected if an upload is in progress
	 * @param files
	 * @returns
	 */
	upload(files: FileList | readonly File[]): Promise<KnUploadReport<T>> {
		//console.log('KnUploadZone.upload()', files);

		if (this.uploading) return Promise.reject(new Error('An upload is already in progress'));
		return this._start(Promise.resolve(Array.from(files)));
	}

	/**
	 * Open the file selection (must be called from a user action)
	 * @returns
	 */
	browse(): void {
		//console.log('KnUploadZone.browse()');

		if (!this.uploading) this._input.click();
	}

	/**
	 * Cancel / abort the upload
	 * @returns
	 */
	cancel(): void {
		//console.log('KnUploadZone.cancel()');

		const session = this._session;
		if (!session) return;

		session.canceled = true;
		for (const req of session.requests) req.abort();
		this._finish(session);
	}

	/**
	 * Destroy the upload zone (abort the upload and clear all listeners)
	 * @returns
	 */
	destroy(): void {
		//console.log('KnUploadZone.destroy()');

		this.cancel();
		this._setHover(false);

		this._zone.removeEventListener('click', this._onClick);
		this._zone.removeEventListener('keydown', this._onKeyDown);
		this._input.removeEventListener('change', this._onInputChange);
		this._zone.removeEventListener('dragenter', this._onDragEnter);
		this._zone.removeEventListener('dragover', this._onDragOver);
		this._zone.removeEventListener('dragleave', this._onDragLeave);
		this._zone.removeEventListener('drop', this._onDrop);

		if (this._documentDrop) {
			document.removeEventListener('dragover', this._onDocumentDrag);
			document.removeEventListener('drop', this._onDocumentDrag);
		}

		if (this._paste) document.removeEventListener('paste', this._onPaste);

		for (const name of this._addedAttributes) this._zone.removeAttribute(name);
		if (this._inputCreated) this._input.remove();
	}

	private readonly _onClick = (e: Event): void => {
		//console.log('KnUploadZone.onClick()', e);

		// No file selection during the upload
		if (this.uploading) {
			e.stopPropagation();
			e.preventDefault();
			return;
		}

		if (!this.options.clickable) return;

		// The input, the labels and the interactive elements of the zone keep their native behavior
		const target = e.target instanceof Element ? e.target : null;
		if (!target || target === this._input) return;

		const native = target.closest('label, ' + INTERACTIVE);
		if (native && native !== this._zone && this._zone.contains(native)) return;
		if (native === this._zone && native.matches('label')) return;

		this.browse();
	};

	private readonly _onKeyDown = (e: Event): void => {
		const key = (e as KeyboardEvent).key;
		if (!this.options.clickable || e.target !== this._zone || (key != 'Enter' && key != ' ')) return;

		e.preventDefault();
		this.browse();
	};

	private readonly _onInputChange = (): void => {
		//console.log('KnUploadZone.onInputChange()');

		const files = Array.from(this._input.files ?? []);

		// Reset input
		this._input.value = '';

		if (!files.length || this.uploading) return;
		void this._start(Promise.resolve(files));
	};

	private readonly _onDragEnter = (e: Event): void => {
		//console.log('KnUploadZone.onDragEnter()', e);

		if (!isFileDrag(e as DragEvent)) return;

		e.stopPropagation();
		e.preventDefault();

		if (this._dragover++ == 0 && !this.uploading) this._setHover(true);
	};

	private readonly _onDragOver = (e: Event): void => {
		const dt = (e as DragEvent).dataTransfer;
		if (!dt || !isFileDrag(e as DragEvent)) return;

		e.stopPropagation();
		e.preventDefault();

		dt.dropEffect = this.uploading ? 'none' : 'copy';
	};

	private readonly _onDragLeave = (e: Event): void => {
		//console.log('KnUploadZone.onDragLeave()', e);

		if (!isFileDrag(e as DragEvent)) return;

		e.stopPropagation();
		e.preventDefault();

		if (this._dragover > 0 && --this._dragover == 0) this._setHover(false);
	};

	private readonly _onDrop = (e: Event): void => {
		//console.log('KnUploadZone.onDrop()', e);

		const dt = (e as DragEvent).dataTransfer;
		if (!dt || !isFileDrag(e as DragEvent)) return;

		e.stopPropagation();
		e.preventDefault();

		this._dragover = 0;
		this._setHover(false);

		if (this.uploading) return;
		void this._start(droppedFiles(dt, this.options.directories));
	};

	private readonly _onDocumentDrag = (e: Event): void => {
		const dt = (e as DragEvent).dataTransfer;
		if (!dt || !isFileDrag(e as DragEvent)) return;

		e.preventDefault();
		if (e.type == 'dragover') dt.dropEffect = 'none';
	};

	private readonly _onPaste = (e: Event): void => {
		//console.log('KnUploadZone.onPaste()', e);

		const files = Array.from((e as ClipboardEvent).clipboardData?.files ?? []);
		if (!files.length || this.uploading) return;

		e.preventDefault();
		void this._start(Promise.resolve(files));
	};

	/**
	 * Add an attribute to the zone (if missing), removed by destroy
	 * @param name
	 * @param value
	 * @returns
	 */
	private _addAttribute(name: string, value: string): void {
		if (this._zone.hasAttribute(name)) return;
		this._zone.setAttribute(name, value);
		this._addedAttributes.push(name);
	}

	/**
	 * Set the drag hover state
	 * @param hover
	 * @returns
	 */
	private _setHover(hover: boolean): void {
		if (this._hover == hover) return;
		this._hover = hover;

		if (this.options.dragoverClass) this._zone.classList.toggle(this.options.dragoverClass, hover);

		if (hover) this.options.onDragEnter?.();
		else this.options.onDragLeave?.();
	}

	/**
	 * Set the uploading state
	 * @param uploading
	 * @returns
	 */
	private _setUploading(uploading: boolean): void {
		if (this.options.uploadingClass) this._zone.classList.toggle(this.options.uploadingClass, uploading);

		if (uploading) this._zone.setAttribute('aria-busy', 'true');
		else this._zone.removeAttribute('aria-busy');
	}

	/**
	 * End the upload session
	 * @param session
	 * @returns
	 */
	private _finish(session: KnUploadSession<T>): void {
		if (this._session !== session) return;
		this._session = null;
		this._setUploading(false);
	}

	/**
	 * Validate the files
	 * @param files
	 * @returns
	 */
	private _validate(files: File[]): { accepted: File[]; rejected: KnUploadRejection[] } {
		const opt = this.options,
			accept = acceptTokens(opt.accept),
			rejected: KnUploadRejection[] = [];

		let accepted: File[] = [];

		// File checks
		for (const file of files) {
			if (accept.length && !isAccepted(file, accept)) {
				rejected.push({ file, reason: 'type', message: null });
			} else if (opt.maxFileSize > 0 && file.size > opt.maxFileSize) {
				rejected.push({ file, reason: 'file-size', message: null });
			} else {
				const result = opt.validate?.(file);
				if (result === false || typeof result === 'string') rejected.push({ file, reason: 'invalid', message: typeof result === 'string' && result ? result : null });
				else accepted.push(file);
			}
		}

		// Upload checks
		if (accepted.length > opt.maxFiles) {
			for (const file of accepted) rejected.push({ file, reason: 'too-many', message: null });
			accepted = [];
		} else if (opt.maxTotalSize > 0 && accepted.reduce((size, file) => size + file.size, 0) > opt.maxTotalSize) {
			for (const file of accepted) rejected.push({ file, reason: 'total-size', message: null });
			accepted = [];
		}

		return { accepted, rejected };
	}

	/**
	 * Validate and upload the files
	 * @param filesPromise
	 * @returns
	 */
	private async _start(filesPromise: Promise<File[]>): Promise<KnUploadReport<T>> {
		//console.log('KnUploadZone.start()');

		const opt = this.options,
			session: KnUploadSession<T> = { canceled: false, requests: new Set(), responses: [], errors: [] };

		this._session = session;

		let accepted: File[] = [],
			rejected: KnUploadRejection[] = [];

		// End of the processing (onEnd is always called last)
		const end = (): KnUploadReport<T> => {
			const report: KnUploadReport<T> = {
				success: !session.canceled && accepted.length > 0 && session.errors.length == 0,
				canceled: session.canceled,
				files: accepted,
				rejected: rejected,
				responses: session.responses,
				errors: session.errors
			};

			this._finish(session);
			opt.onEnd?.(report);

			return report;
		};

		try {
			// Files (the folders are read asynchronously)
			const files = await filesPromise;
			if (session.canceled) return end();

			opt.onFiles?.(files);

			// Validation
			({ accepted, rejected } = this._validate(files));
			if (rejected.length) opt.onReject?.(rejected);
			if (!accepted.length || session.canceled) return end();

			opt.onStart?.(accepted);
			if (session.canceled) return end();

			// Upload
			this._setUploading(true);
			opt.onProgress?.(0);

			let lastProgress = 0,
				sent = false;

			const onProgress = (progress: number) => {
				if (session.canceled || progress == lastProgress) return;
				lastProgress = progress;
				opt.onProgress?.(progress);

				if (progress >= 100 && !sent) {
					sent = true;
					opt.onSent?.();
				}
			};

			if (opt.batch) {
				// All the files in one request
				await this._send(accepted, session, onProgress);
			} else {
				// One request per file, the global progress is weighted by the file sizes
				const totalSize = accepted.reduce((size, file) => size + file.size, 0),
					weight = (file: File) => totalSize > 0 ? file.size : 1,
					total = totalSize > 0 ? totalSize : accepted.length,
					loaded = new Map<File, number>(),
					queue = [...accepted];

				const worker = async () => {
					while (!session.canceled) {
						const file = queue.shift();
						if (!file) return;

						await this._send([file], session, progress => {
							opt.onFileProgress?.(file, progress);
							loaded.set(file, weight(file) * progress / 100);

							let sum = 0;
							for (const value of loaded.values()) sum += value;
							onProgress(Math.floor(sum / total * 100));
						});
					}
				};

				await Promise.all(Array.from({ length: Math.max(1, Math.min(opt.concurrency, accepted.length)) }, worker));
			}

			return end();
		} finally {
			this._finish(session);
		}
	}

	/**
	 * Send files in one request
	 * @param files
	 * @param session
	 * @param onProgress
	 * @returns
	 */
	private _send(files: File[], session: KnUploadSession<T>, onProgress: (progress: number) => void): Promise<void> {
		//console.log('KnUploadZone.send()', files);

		return new Promise(resolve => {
			if (session.canceled) return resolve();

			const opt = this.options,
				client = opt.client ?? KnHttp;

			// Form data body: files and data
			const body: Record<string, KnHttpFormDataValue> = { [opt.fieldName]: files };
			for (const [k, v] of Object.entries(resolveValue(opt.data))) body[k] = v;

			const req = client.request<T>(resolveValue(opt.url), {
				...resolveValue(opt.request),
				method: 'POST',
				formData: body,
				upload: true,
				parse: opt.parse
			})
				.onProgress(progress => {
					if (progress >= 0) onProgress(progress);
				})
				.onSuccess(res => {
					session.responses.push(res);
					opt.onSuccess?.(res, files);
				})
				.onError(err => {
					if (err.code == client.CANCELED_ERROR) return;
					session.errors.push(err);

					// Without onError, the unhandled error callback of the KnHttp instance is called
					if (opt.onError) opt.onError(err, files);
					else client.defaults.onUnhandledError?.(err);
				})
				.onEnd(() => {
					session.requests.delete(req);
					resolve();
				});

			if (!req.ended) session.requests.add(req);
		});
	}
}
