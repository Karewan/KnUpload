/**
 * KnUpload v5.0.0 (2023-12-16 12:50:37 +0100)
 * Copyright (c) 2019-2023 Florent VIALATTE
 * Released under the MIT license
 */
'use strict';

const KnUpload = function() {
	const VERSION = '5.0.0';
	return {VERSION};
}();

Element.prototype.KnUpload = function(opt) {
	console.log('Element.prototype.KnUpload()', opt);

	let zone = this,
	input = zone.querySelector('input[type=file]'),
	dragover = 0,
	uploadInProgress = false,
	xhr = null;

	if(!opt) opt = {};
	if(!opt.url) throw 'URL is mandatory';
	if(!opt.data) opt.data = {};
	if(!opt.responseType) opt.responseType = null;
	if(!opt.headers) opt.headers = {};
	if(!opt.csrf) opt.csrf = null;
	if(!opt.csrfHeader) opt.csrfHeader = null;
	if(!opt.withCredentials) opt.withCredentials = null;
	if(!opt.basicAuth) opt.basicAuth = null;
	if(!opt.bearerAuthToken) opt.bearerAuthToken = null;
	if(!opt.maxFiles) opt.maxFiles = 1;
	if(!opt.timeout) opt.timeout = 0;
	if(!opt.maxFilesSize) opt.maxFilesSize = 20971520;
	if(!opt.killDocumentDad) opt.killDocumentDad = false;
	if(!opt.onDragEnter) opt.onDragEnter = null;
	if(!opt.onDragLeave) opt.onDragLeave = null;
	if(!opt.onNewFiles) opt.onNewFiles = null;
	if(!opt.onFileSizeError) opt.onFileSizeError = null;
	if(!opt.onTooManyFiles) opt.onTooManyFiles = null;
	if(!opt.onBeforeUpload) opt.onBeforeUpload = null;
	if(!opt.onUploadProgress) opt.onUploadProgress = null;
	if(!opt.onUploadComplete) opt.onUploadComplete = null;
	if(!opt.onUploadSuccess) opt.onUploadSuccess = null;
	if(!opt.onUploadError) opt.onUploadError = null;
	if(!opt.onAjaxComplete) opt.onAjaxComplete = null;

	if(opt.maxFiles > 1) input.setAttribute('multiple', '');
	else input.removeAttribute('multiple');

	zone.addEventListener('click', onClick);
	input.addEventListener('change', onInputChange);
	zone.addEventListener('drop', onDrop);
	zone.addEventListener('dragenter', onDragEnter);
	zone.addEventListener('dragover', onDragOver);
	zone.addEventListener('dragleave', onDragLeave);

	if(opt.killDocumentDad) {
		document.addEventListener('drag', onKillDad);
		document.addEventListener('dragstart', onKillDad);
		document.addEventListener('dragend', onKillDad);
		document.addEventListener('dragenter', onKillDad);
		document.addEventListener('dragover', onKillDad);
		document.addEventListener('dragleave', onKillDad);
		document.addEventListener('drop', onKillDad);
	}

	function onClick(e) {
		console.log('KnUpload.onClick()', e);

		if(!uploadInProgress) return;

		e.stopPropagation();
		e.preventDefault();
	}

	function onInputChange(e) {
		console.log('KnUpload.onInputChange()', e);

		if(uploadInProgress) return;

		// Files
		if(!e.target || !e.target.files || !e.target.files.length) return;

		// Process files
		processFiles(e.target.files);

		// Reset input
		this.value = '';
	}

	function onDrop(e) {
		console.log('KnUpload.onDrop()', e);

		e.stopPropagation();
		e.preventDefault();

		if(uploadInProgress) return;

		// Drag leave
		if(dragover > 0) {
			dragover = 0;
			if(opt.onDragLeave) opt.onDragLeave.call();
		}

		// Files
		if (!e.dataTransfer || !e.dataTransfer.files || !e.dataTransfer.files.length) return;

		// Process files
		processFiles(e.dataTransfer.files);
	}

	function onDragEnter(e) {
		console.log('KnUpload.onDragEnter()', e);

		e.stopPropagation();
		e.preventDefault();

		if(uploadInProgress) return;

		if(opt.onDragEnter && dragover == 0) opt.onDragEnter.call();
		dragover++;
	}

	function onDragOver(e) {
		//console.log('KnUpload.onDragOver()', e);

		e.stopPropagation();
		e.preventDefault();
	}

	function onDragLeave(e) {
		console.log('KnUpload.onDragLeave()', e);

		e.stopPropagation();
		e.preventDefault();
		if(uploadInProgress) return;

		dragover--;
		if(opt.onDragLeave && dragover == 0) opt.onDragLeave.call();
	}

	function onKillDad(e) {
		//console.log('KnUpload.onKillDad()', e);

		e.stopPropagation();
		e.preventDefault();
		return false;
	}

	function processFiles(files) {
		console.log('KnUpload.processFiles()', files);

		// Upload in progress
		uploadInProgress = true;

		// Callback
		if(opt.onNewFiles) opt.onNewFiles.call(this, files);

		// Check if too many files
		if(files.length > opt.maxFiles) {
			if(opt.onTooManyFiles) opt.onTooManyFiles.call();
			uploadInProgress = false;
			return;
		}

		// Files to read
		const filestoRead = [];

		// Total size
		let totalSize = 0;

		// For each files
		for(const i in files) {
			// Must be an object
			if(typeof files[i] !== 'object') continue;

			// If files are too big
			totalSize += files[i].size;
			if(files[i].size > opt.maxFilesSize || totalSize > opt.maxFilesSize) {
				if(opt.onFileSizeError) opt.onFileSizeError.call();
				uploadInProgress = false;
				return;
			}

			// Push the file to the array
			filestoRead.push(files[i]);
		}

		// Callback
		if(opt.onBeforeUpload) opt.onBeforeUpload.call();

		// Files to upload
		const filesToUpload = [];

		// Read files
		for(const x in filestoRead) {
			const reader = new FileReader();

			reader.onload = e => {
				filesToUpload.push({
					name: filestoRead[x].name,
					content: new Blob([e.target.result])
				});

				if(filesToUpload.length == filestoRead.length && uploadInProgress) {
					upload(filesToUpload);
					return;
				}
			};

			reader.onerror = err => {
				if(opt.onUploadError) opt.onUploadError.call(this, err);
				uploadInProgress = false;
				return;
			};

			reader.readAsArrayBuffer(filestoRead[x]);
		}
	}

	function upload(files) {
		console.log('KnUpload.upload()', files);

		// Cancel xhr
		if(xhr != null) xhr.abort();

		// Callback
		if(opt.onUploadProgress) opt.onUploadProgress.call(this, 0);

		// Create form data
		let fd = new FormData();

		// Put files in form data
		fd.append('nb_files', files.length);
		files.forEach((file, i) => {
			fd.append('file_' + i, file.content);
			fd.append('file_' + i + '_name', file.name);
		});

		// Put additional data in form data
		for(const [k, v] of Object.entries(typeof opt.data === 'function' ? opt.data() : opt.data)) fd.append(k, (typeof v === 'function') ? v() : v);

		// Headers
		for(const [k, v] of Object.entries(opt.headers)) opt.headers[k] =( typeof v === 'function') ? v() : v;

		// Upload
		xhr = KnHttp.postRaw(typeof opt.url === 'function' ? opt.url() : opt.url, fd, {
			upload: true,
			timeout: opt.timeout,
			responseType: opt.responseType,
			headers: opt.headers,
			csrf: opt.csrf,
			csrfHeader: opt.csrfHeader,
			withCredentials: opt.withCredentials,
			basicAuth: opt.basicAuth,
			bearerAuthToken: opt.bearerAuthToken
		})
		.onProgress(pourcent => {
			console.log('KnUpload.upload() onProgress()', pourcent);

			if(pourcent == -1) return;
			if(opt.onUploadProgress) opt.onUploadProgress.call(this, pourcent);
			if(pourcent >= 100 && opt.onUploadComplete) opt.onUploadComplete.call();
		})
		.onSuccess((res, headers) => {
			console.log('KnUpload.upload() onSuccess()', res, headers);

			if(opt.onUploadSuccess) opt.onUploadSuccess.call(this, res, headers);
		})
		.onError((err, status) => {
			console.log('KnUpload.upload() onError()', err, status);

			if(err == KnHttp.CANCELED_ERROR) return;
			if(opt.onUploadError) opt.onUploadError.call(this, err, status);
		})
		.onEnd(() => {
			console.log('KnUpload.upload() onEnd()');

			if(opt.onAjaxComplete) opt.onAjaxComplete.call();
			uploadInProgress = false;
		});
	}

	function destroy() {
		console.log('Element.prototype.KnUpload.destroy()');

		zone.removeEventListener('click', onClick);
		input.removeEventListener('change', onInputChange);
		zone.removeEventListener('drop', onDrop);
		zone.removeEventListener('dragenter', onDragEnter);
		zone.removeEventListener('dragover', onDragOver);
		zone.removeEventListener('dragleave', onDragLeave);

		if(opt.killDocumentDad) {
			document.removeEventListener('drag', onKillDad);
			document.removeEventListener('dragstart', onKillDad);
			document.removeEventListener('dragend', onKillDad);
			document.removeEventListener('dragenter', onKillDad);
			document.removeEventListener('dragover', onKillDad);
			document.removeEventListener('dragleave', onKillDad);
			document.removeEventListener('drop', onKillDad);
		}

		if(xhr != null) xhr.abort();
	}

	function cancel() {
		console.log('KnUpload.cancel()');

		uploadInProgress = false;
		if(xhr != null) xhr.abort();
	}

	return {
		opt,
		uploadInProgress,
		cancel,
		destroy
	};
};
