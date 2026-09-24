/**
 * KnUpload v6.0.0 (2026-09-24T12:17:38.521Z)
 * Copyright (c) 2019 - 2026 Florent VIALATTE
 * Released under the MIT license
 */
var KnUpload = (function(kn_http) {
	//#region \0rolldown/runtime.js
	var __create = Object.create;
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __getProtoOf = Object.getPrototypeOf;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
			key = keys[i];
			if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
				get: ((k) => from[k]).bind(null, key),
				enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
		value: mod,
		enumerable: true
	}) : target, mod));
	//#endregion
	kn_http = __toESM(kn_http, 1);
	//#region src/kn-upload-zone.ts
	/**
	* Default options (the options depending on the response type are added by the constructor)
	*/
	var DEFAULTS = {
		client: null,
		request: {},
		fieldName: "files",
		data: {},
		batch: true,
		concurrency: 3,
		accept: null,
		maxFiles: 1,
		maxFileSize: 0,
		maxTotalSize: 20971520,
		validate: null,
		clickable: true,
		paste: false,
		directories: true,
		preventDocumentDrop: false,
		dragoverClass: "is-dragover",
		uploadingClass: "is-uploading",
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
	var INTERACTIVE = "a[href], button, input, select, textarea";
	/**
	* Resolve a value or a function returning the value
	* @param value
	* @returns
	*/
	function resolveValue(value) {
		return typeof value === "function" ? value() : value;
	}
	/**
	* Check if a drag event contains files
	* @param e
	* @returns
	*/
	function isFileDrag(e) {
		return !!e.dataTransfer && Array.from(e.dataTransfer.types).includes("Files");
	}
	/**
	* Normalize the accept option
	* @param accept
	* @returns
	*/
	function acceptTokens(accept) {
		return (typeof accept === "string" ? accept.split(",") : accept ?? []).map((t) => t.trim().toLowerCase()).filter((t) => t);
	}
	/**
	* Check if a file matches the accept tokens (extensions, MIME types and MIME groups)
	* @param file
	* @param tokens
	* @returns
	*/
	function isAccepted(file, tokens) {
		const name = file.name.toLowerCase(), type = file.type.toLowerCase();
		return tokens.some((t) => t.startsWith(".") ? name.endsWith(t) : t.endsWith("/*") ? type.startsWith(t.slice(0, -1)) : type === t);
	}
	/**
	* Read all the entries of a directory
	* @param dir
	* @returns
	*/
	function readDirectory(dir) {
		const reader = dir.createReader(), entries = [];
		return new Promise((resolve, reject) => {
			const read = () => reader.readEntries((batch) => {
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
	async function readEntries(entries) {
		const files = [];
		for (const entry of entries) if (entry.isFile) files.push(await new Promise((resolve, reject) => entry.file(resolve, reject)));
		else if (entry.isDirectory) files.push(...await readEntries(await readDirectory(entry)));
		return files;
	}
	/**
	* Get the dropped files (the entries must be read during the drop event)
	* @param dt
	* @param directories
	* @returns
	*/
	function droppedFiles(dt, directories) {
		const files = Array.from(dt.files);
		if (!directories) return Promise.resolve(files);
		const entries = [];
		for (const item of Array.from(dt.items)) {
			if (item.kind != "file") continue;
			const entry = item.webkitGetAsEntry?.();
			if (entry) entries.push(entry);
		}
		return entries.some((e) => e.isDirectory) ? readEntries(entries) : Promise.resolve(files);
	}
	/**
	* Upload zone
	*/
	var KnUploadZone = class {
		options;
		_zone;
		_input;
		_inputCreated;
		_addedAttributes = [];
		_keyboard;
		_documentDrop;
		_paste;
		_dragover = 0;
		_hover = false;
		_session = null;
		/**
		* Class constructor (use KnUpload.create instead)
		* @param zone
		* @param options
		*/
		constructor(zone, options) {
			const resolved = {
				...DEFAULTS,
				url: "",
				parse: null,
				onSuccess: null,
				onEnd: null
			}, target = resolved;
			for (const [k, v] of Object.entries(options)) if (v !== void 0) target[k] = v;
			this.options = resolved;
			if (!resolved.url) throw new Error("URL is mandatory");
			let input = zone.querySelector("input[type=file]");
			this._inputCreated = !input;
			if (!input) {
				input = document.createElement("input");
				input.type = "file";
				input.hidden = true;
				document.body.appendChild(input);
			}
			this._zone = zone;
			this._input = input;
			Object.defineProperty(this, "__v_skip", { value: true });
			input.multiple = resolved.maxFiles > 1;
			const accept = acceptTokens(resolved.accept);
			if (accept.length) input.accept = accept.join(",");
			this._keyboard = resolved.clickable && !zone.matches(INTERACTIVE);
			if (this._keyboard) {
				this._addAttribute("tabindex", "0");
				this._addAttribute("role", "button");
			}
			zone.addEventListener("click", this._onClick);
			if (this._keyboard) zone.addEventListener("keydown", this._onKeyDown);
			input.addEventListener("change", this._onInputChange);
			zone.addEventListener("dragenter", this._onDragEnter);
			zone.addEventListener("dragover", this._onDragOver);
			zone.addEventListener("dragleave", this._onDragLeave);
			zone.addEventListener("drop", this._onDrop);
			this._documentDrop = resolved.preventDocumentDrop;
			if (this._documentDrop) {
				document.addEventListener("dragover", this._onDocumentDrag);
				document.addEventListener("drop", this._onDocumentDrag);
			}
			this._paste = resolved.paste;
			if (this._paste) document.addEventListener("paste", this._onPaste);
		}
		/**
		* Zone element
		*/
		get element() {
			return this._zone;
		}
		/**
		* File input
		*/
		get input() {
			return this._input;
		}
		/**
		* True if an upload is in progress
		*/
		get uploading() {
			return this._session !== null;
		}
		/**
		* Upload files (validation included), rejected if an upload is in progress
		* @param files
		* @returns
		*/
		upload(files) {
			if (this.uploading) return Promise.reject(/* @__PURE__ */ new Error("An upload is already in progress"));
			return this._start(Promise.resolve(Array.from(files)));
		}
		/**
		* Open the file selection (must be called from a user action)
		* @returns
		*/
		browse() {
			if (!this.uploading) this._input.click();
		}
		/**
		* Cancel / abort the upload
		* @returns
		*/
		cancel() {
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
		destroy() {
			this.cancel();
			this._setHover(false);
			this._zone.removeEventListener("click", this._onClick);
			this._zone.removeEventListener("keydown", this._onKeyDown);
			this._input.removeEventListener("change", this._onInputChange);
			this._zone.removeEventListener("dragenter", this._onDragEnter);
			this._zone.removeEventListener("dragover", this._onDragOver);
			this._zone.removeEventListener("dragleave", this._onDragLeave);
			this._zone.removeEventListener("drop", this._onDrop);
			if (this._documentDrop) {
				document.removeEventListener("dragover", this._onDocumentDrag);
				document.removeEventListener("drop", this._onDocumentDrag);
			}
			if (this._paste) document.removeEventListener("paste", this._onPaste);
			for (const name of this._addedAttributes) this._zone.removeAttribute(name);
			if (this._inputCreated) this._input.remove();
		}
		_onClick = (e) => {
			if (this.uploading) {
				e.stopPropagation();
				e.preventDefault();
				return;
			}
			if (!this.options.clickable) return;
			const target = e.target instanceof Element ? e.target : null;
			if (!target || target === this._input) return;
			const native = target.closest("label, " + INTERACTIVE);
			if (native && native !== this._zone && this._zone.contains(native)) return;
			if (native === this._zone && native.matches("label")) return;
			this.browse();
		};
		_onKeyDown = (e) => {
			const key = e.key;
			if (!this.options.clickable || e.target !== this._zone || key != "Enter" && key != " ") return;
			e.preventDefault();
			this.browse();
		};
		_onInputChange = () => {
			const files = Array.from(this._input.files ?? []);
			this._input.value = "";
			if (!files.length || this.uploading) return;
			this._start(Promise.resolve(files));
		};
		_onDragEnter = (e) => {
			if (!isFileDrag(e)) return;
			e.stopPropagation();
			e.preventDefault();
			if (this._dragover++ == 0 && !this.uploading) this._setHover(true);
		};
		_onDragOver = (e) => {
			const dt = e.dataTransfer;
			if (!dt || !isFileDrag(e)) return;
			e.stopPropagation();
			e.preventDefault();
			dt.dropEffect = this.uploading ? "none" : "copy";
		};
		_onDragLeave = (e) => {
			if (!isFileDrag(e)) return;
			e.stopPropagation();
			e.preventDefault();
			if (this._dragover > 0 && --this._dragover == 0) this._setHover(false);
		};
		_onDrop = (e) => {
			const dt = e.dataTransfer;
			if (!dt || !isFileDrag(e)) return;
			e.stopPropagation();
			e.preventDefault();
			this._dragover = 0;
			this._setHover(false);
			if (this.uploading) return;
			this._start(droppedFiles(dt, this.options.directories));
		};
		_onDocumentDrag = (e) => {
			const dt = e.dataTransfer;
			if (!dt || !isFileDrag(e)) return;
			e.preventDefault();
			if (e.type == "dragover") dt.dropEffect = "none";
		};
		_onPaste = (e) => {
			const files = Array.from(e.clipboardData?.files ?? []);
			if (!files.length || this.uploading) return;
			e.preventDefault();
			this._start(Promise.resolve(files));
		};
		/**
		* Add an attribute to the zone (if missing), removed by destroy
		* @param name
		* @param value
		* @returns
		*/
		_addAttribute(name, value) {
			if (this._zone.hasAttribute(name)) return;
			this._zone.setAttribute(name, value);
			this._addedAttributes.push(name);
		}
		/**
		* Set the drag hover state
		* @param hover
		* @returns
		*/
		_setHover(hover) {
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
		_setUploading(uploading) {
			if (this.options.uploadingClass) this._zone.classList.toggle(this.options.uploadingClass, uploading);
			if (uploading) this._zone.setAttribute("aria-busy", "true");
			else this._zone.removeAttribute("aria-busy");
		}
		/**
		* End the upload session
		* @param session
		* @returns
		*/
		_finish(session) {
			if (this._session !== session) return;
			this._session = null;
			this._setUploading(false);
		}
		/**
		* Validate the files
		* @param files
		* @returns
		*/
		_validate(files) {
			const opt = this.options, accept = acceptTokens(opt.accept), rejected = [];
			let accepted = [];
			for (const file of files) if (accept.length && !isAccepted(file, accept)) rejected.push({
				file,
				reason: "type",
				message: null
			});
			else if (opt.maxFileSize > 0 && file.size > opt.maxFileSize) rejected.push({
				file,
				reason: "file-size",
				message: null
			});
			else {
				const result = opt.validate?.(file);
				if (result === false || typeof result === "string") rejected.push({
					file,
					reason: "invalid",
					message: typeof result === "string" && result ? result : null
				});
				else accepted.push(file);
			}
			if (accepted.length > opt.maxFiles) {
				for (const file of accepted) rejected.push({
					file,
					reason: "too-many",
					message: null
				});
				accepted = [];
			} else if (opt.maxTotalSize > 0 && accepted.reduce((size, file) => size + file.size, 0) > opt.maxTotalSize) {
				for (const file of accepted) rejected.push({
					file,
					reason: "total-size",
					message: null
				});
				accepted = [];
			}
			return {
				accepted,
				rejected
			};
		}
		/**
		* Validate and upload the files
		* @param filesPromise
		* @returns
		*/
		async _start(filesPromise) {
			const opt = this.options, session = {
				canceled: false,
				requests: /* @__PURE__ */ new Set(),
				responses: [],
				errors: []
			};
			this._session = session;
			let accepted = [], rejected = [];
			const end = () => {
				const report = {
					success: !session.canceled && accepted.length > 0 && session.errors.length == 0,
					canceled: session.canceled,
					files: accepted,
					rejected,
					responses: session.responses,
					errors: session.errors
				};
				this._finish(session);
				opt.onEnd?.(report);
				return report;
			};
			try {
				const files = await filesPromise;
				if (session.canceled) return end();
				opt.onFiles?.(files);
				({accepted, rejected} = this._validate(files));
				if (rejected.length) opt.onReject?.(rejected);
				if (!accepted.length || session.canceled) return end();
				opt.onStart?.(accepted);
				if (session.canceled) return end();
				this._setUploading(true);
				opt.onProgress?.(0);
				let lastProgress = 0, sent = false;
				const onProgress = (progress) => {
					if (session.canceled || progress == lastProgress) return;
					lastProgress = progress;
					opt.onProgress?.(progress);
					if (progress >= 100 && !sent) {
						sent = true;
						opt.onSent?.();
					}
				};
				if (opt.batch) await this._send(accepted, session, onProgress);
				else {
					const totalSize = accepted.reduce((size, file) => size + file.size, 0), weight = (file) => totalSize > 0 ? file.size : 1, total = totalSize > 0 ? totalSize : accepted.length, loaded = /* @__PURE__ */ new Map(), queue = [...accepted];
					const worker = async () => {
						while (!session.canceled) {
							const file = queue.shift();
							if (!file) return;
							await this._send([file], session, (progress) => {
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
		_send(files, session, onProgress) {
			return new Promise((resolve) => {
				if (session.canceled) return resolve();
				const opt = this.options, client = opt.client ?? kn_http.default;
				const body = { [opt.fieldName]: files };
				for (const [k, v] of Object.entries(resolveValue(opt.data))) body[k] = v;
				const req = client.request(resolveValue(opt.url), {
					...resolveValue(opt.request),
					method: "POST",
					formData: body,
					upload: true,
					parse: opt.parse
				}).onProgress((progress) => {
					if (progress >= 0) onProgress(progress);
				}).onSuccess((res) => {
					session.responses.push(res);
					opt.onSuccess?.(res, files);
				}).onError((err) => {
					if (err.code == client.CANCELED_ERROR) return;
					session.errors.push(err);
					if (opt.onError) opt.onError(err, files);
					else client.defaults.onUnhandledError?.(err);
				}).onEnd(() => {
					session.requests.delete(req);
					resolve();
				});
				if (!req.ended) session.requests.add(req);
			});
		}
	};
	//#endregion
	//#region src/kn-upload.ts
	/**
	* Minimum KnHttp version required
	*/
	var KNHTTP_MIN_VERSION = "4.0.0";
	/**
	* Throw if KnHttp is missing or too old
	* @returns
	*/
	function checkKnHttp() {
		if (typeof kn_http.default === "undefined") throw new Error("KnHttp is required");
		const cur = String(kn_http.default.VERSION || "0").split(".").map((v) => parseInt(v) || 0), min = KNHTTP_MIN_VERSION.split(".").map((v) => parseInt(v) || 0);
		for (const [i, m] of min.entries()) {
			const c = cur[i] ?? 0;
			if (c > m) return;
			if (c < m) throw new Error("KnHttp >= 4.0.0 is required");
		}
	}
	//#endregion
	return {
		/** LIB VERSION */
		VERSION: "6.0.0",
		/** MINIMUM KNHTTP VERSION REQUIRED */
		KNHTTP_MIN_VERSION,
		/**
		* Create an upload zone
		* @param target Zone element or CSS selector
		* @param options
		* @returns
		*/
		create(target, options) {
			checkKnHttp();
			const element = typeof target === "string" ? document.querySelector(target) : target;
			if (!element) throw new Error("Upload zone not found: " + String(target));
			return new KnUploadZone(element, options);
		}
	};
})(KnHttp);
