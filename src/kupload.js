'use strict';

const kupload = function() {
	const VERSION = '2.0.2',
	WORKER_INLINE_SCRIPT = "";

	let worker;

	function getWorker() {
		if(worker) {
			console.log('kupload.getWorker() reuse the worker');
			return worker;
		}

		console.log('kupload.getWorker() init a new worker');

		let worker_blob;

		try {
			worker_blob = new Blob([WORKER_INLINE_SCRIPT], {type: 'application/javascript'});
		} catch (e) {
			window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
			worker_blob = new BlobBuilder();
			worker_blob.append(WORKER_INLINE_SCRIPT);
			worker_blob = worker_blob.getBlob();
		}

		return worker = new Worker((window.URL || window.webkitURL).createObjectURL(worker_blob));
	}

	return {
		VERSION,
		getWorker
	}
}();

Element.prototype.kupload = function(opt) {
	console.log('Element.prototype.kupload()', opt);

	const acm = 'kupload_canceled';

	let zone = this,
	input = zone.querySelector('input[type=file]'),
	dragover = 0,
	upload_in_progress = false,
	ajax_cancel_source;

	if(!opt) opt = {};
	if(!opt.url) throw 'URL is mandatory';
	if(!opt.data) opt.data = {};
	if(!opt.headers) opt.headers = {};
	if(!opt.max_files) opt.max_files = 1;
	if(!opt.compress) opt.compress = false;
	if(!opt.timeout) opt.timeout = 0;
	if(!opt.max_files_size) opt.max_files_size = 20971520;
	if(!opt.kill_document_dad) opt.kill_document_dad = false;
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

	if(opt.max_files > 1) input.setAttribute('multiple', '');
	else input.removeAttribute('multiple');

	kupload.getWorker().addEventListener('message', onWorkerMessage, false);
	zone.addEventListener('click', onClick);
	input.addEventListener('change', onInputChange);
	zone.addEventListener('drop', onDrop);
	zone.addEventListener('dragenter', onDragEnter);
	zone.addEventListener('dragover', onDragOver);
	zone.addEventListener('dragleave', onDragLeave);

	if(opt.kill_document_dad) {
		document.addEventListener('drag', onKillDad);
		document.addEventListener('dragstart', onKillDad);
		document.addEventListener('dragend', onKillDad);
		document.addEventListener('dragenter', onKillDad);
		document.addEventListener('dragover', onKillDad);
		document.addEventListener('dragleave', onKillDad);
		document.addEventListener('drop', onKillDad);
	}

	function onWorkerMessage(e) {
		console.log('kupload.onWorkerMessage()', e);
		if(!upload_in_progress) return;
		upload(e.data);
	}

	function onClick(e) {
		console.log('kupload.onClick()', e);
		if(!upload_in_progress) return;
		e.stopPropagation();
		e.preventDefault();
	}

	function onInputChange(e) {
		console.log('kupload.onInputChange()', e);
		if(upload_in_progress) return;

		// Files
		if(!e.target || !e.target.files || !e.target.files.length) return;

		// Process files
		processFiles(e.target.files);

		// Reset input
		this.value = '';
	}

	function onDrop(e) {
		console.log('kupload.onDrop()', e);
		e.stopPropagation();
		e.preventDefault();
		if(upload_in_progress) return;

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
		console.log('kupload.onDragEnter()', e);
		e.stopPropagation();
		e.preventDefault();
		if(upload_in_progress) return;

		if(opt.onDragEnter && dragover == 0) opt.onDragEnter.call();
		dragover++;
	}

	function onDragOver(e) {
		//console.log('kupload.onDragOver()', e);
		e.stopPropagation();
		e.preventDefault();
	}

	function onDragLeave(e) {
		console.log('kupload.onDragLeave()', e);
		e.stopPropagation();
		e.preventDefault();
		if(upload_in_progress) return;

		dragover--;
		if(opt.onDragLeave && dragover == 0) opt.onDragLeave.call();
	}

	function onKillDad(e) {
		//console.log('kupload.onKillDad()', e);
		e.stopPropagation();
		e.preventDefault();
		return false;
	}

	function processFiles(files) {
		console.log('kupload.processFiles()', files);

		// Upload in progress
		upload_in_progress = true;

		// Callback
		if(opt.onNewFiles) opt.onNewFiles.call(this, files);

		// Check if too many files
		if(files.length > opt.max_files) {
			if(opt.onTooManyFiles) opt.onTooManyFiles.call();
			upload_in_progress = false;
			return;
		}

		// Vars
		const files_to_read = [];
		let total_size = 0;

		// For each files
		for(let i in files) {
			// Must be an object
			if(typeof files[i] !== 'object') continue;

			// If files are too big
			total_size += files[i].size;
			if(files[i].size > opt.max_files_size || total_size > opt.max_files_size) {
				if(opt.onFileSizeError) opt.onFileSizeError.call();
				upload_in_progress = false;
				return;
			}

			// Push the file to the array
			files_to_read.push(files[i]);
		}

		// Callback
		if(opt.onBeforeUpload) opt.onBeforeUpload.call();

		// Send files to the worker
		kupload.getWorker().postMessage({
			compress: opt.compress,
			files: files_to_read
		});
	}

	function cancelAjax() {
		console.log('kupload.cancelAjax()');
		if(ajax_cancel_source == null) return;
		ajax_cancel_source.cancel(acm);
		ajax_cancel_source = null;
	}

	function genCancelToken() {
		console.log('kupload.genCancelToken()');
		cancelAjax();
		ajax_cancel_source = axios.CancelToken.source();
		return ajax_cancel_source.token;
	}

	function upload(files) {
		console.log('kupload.upload()', files);

		// Callback
		if(opt.onUploadProgress) opt.onUploadProgress.call(this, 0);

		// Create form data
		let fd = new FormData();

		// Put files in form data
		fd.append('nb_files', files.length);
		files.forEach((file, i) => {
			fd.append('file_' + i, file.content);
			fd.append('file_' + i + '_name', file.filename);
			fd.append('file_' + i + '_orig_size', file.orig_size);
			fd.append('file_' + i + '_compressed', file.compressed);
		});

		// Put additional data in form data
		for(const [k, v] of Object.entries(opt.data)) fd.append(k, (typeof v === 'function') ? v() : v);

		// Headers
		for(const [k, v] of Object.entries(opt.headers)) opt.headers[k] =( typeof v === 'function') ? v() : v;
		opt.headers['Content-Type'] = 'multipart/form-data';

		// Upload
		axios.post(opt.url, fd, {
			timeout: opt.timeout,
			headers: opt.headers,
			onUploadProgress: onUploadProgress,
			cancelToken: genCancelToken()
		})
		.then(res => {
			console.log('kupload.upload() success()', res);
			if(opt.onUploadSuccess) opt.onUploadSuccess.call(this, res);
		})
		.catch(error => {
			console.log('kupload.upload() error()', error);
			if(error.message && error.message == acm) return;
			if(opt.onUploadError) opt.onUploadError.call(this, error);
		})
		.then(() => {
			console.log('kupload.upload() always()');
			if(opt.onAjaxComplete) opt.onAjaxComplete.call();
			upload_in_progress = false;
		});
	}

	function onUploadProgress(e) {
		console.log('kupload.onUploadProgress()', e);
		if(typeof e === 'undefined' || !e.lengthComputable) return;
		let pourcent = Math.floor((e.loaded * 100)/e.total);
		if(opt.onUploadProgress) opt.onUploadProgress.call(this, pourcent);
		if(pourcent >= 100 && opt.onUploadComplete) opt.onUploadComplete.call();
	}

	function destroy() {
		console.log('Element.prototype.kupload.destroy()');

		kupload.getWorker().removeEventListener('message', onWorkerMessage, false);
		zone.removeEventListener('click', onClick);
		input.removeEventListener('change', onInputChange);
		zone.removeEventListener('drop', onDrop);
		zone.removeEventListener('dragenter', onDragEnter);
		zone.removeEventListener('dragover', onDragOver);
		zone.removeEventListener('dragleave', onDragLeave);

		if(opt.kill_document_dad) {
			document.removeEventListener('drag', onKillDad);
			document.removeEventListener('dragstart', onKillDad);
			document.removeEventListener('dragend', onKillDad);
			document.removeEventListener('dragenter', onKillDad);
			document.removeEventListener('dragover', onKillDad);
			document.removeEventListener('dragleave', onKillDad);
			document.removeEventListener('drop', onKillDad);
		}

		cancelAjax();
	}

	function cancel() {
		console.log('kupload.cancel()');
		upload_in_progress = false;
		cancelAjax();
	}

	return {
		opt,
		upload_in_progress,
		cancel,
		destroy
	};
};
