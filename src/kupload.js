/**
 * kupload v1.0.0 - Copyright (c) 2019 Nogema Technology SAS
 * Released under proprietary licence, all rights reserved
 */
"use strict";
(function($) {
	// Init kUpload has jQuery plugin
	$.fn.kupload = function(opt) {
		// Init vars
		var worker;
		var zone = $(this);
		var dragover = 0;
		var upinprogress = false;
		if(!opt) opt = {};
		if(!opt.url) throw 'upload URL is mandatory';
		if(!opt.multiple) opt.multiple = false; // No multiple
		if(!opt.maxfiles) opt.maxfiles = 3; // 3 files max by default
		if(!opt.compress) opt.compress = false; // No compress
		if(opt.compress && !opt.pakoDeflatePath) throw 'pakoDeflatePath is mandatory if compress';
		if(!opt.timeout) opt.timeout = 0; // No timeout
		if(!opt.maxfilesize) opt.maxfilesize = 20971520; // 20 Mega
		if(!opt.resDataType) opt.resDataType = null; // No type
		if(!opt.onDragEnter) opt.onDragEnter = function(){};
		if(!opt.onDragLeave) opt.onDragLeave = function(){};
		if(!opt.onNewFiles) opt.onNewFiles = function(){};
		if(!opt.onFileSizeError) opt.onFileSizeError = function(){};
		if(!opt.onTooManyFiles) opt.onTooManyFiles = function(){};
		if(!opt.onBeforeUpload) opt.onBeforeUpload = function(){};
		if(!opt.onUploadProgress) opt.onUploadProgress = function(){};
		if(!opt.onUploadComplete) opt.onUploadComplete = function(){};
		if(!opt.onUploadSuccess) opt.onUploadSuccess = function(){};
		if(!opt.onUploadError) opt.onUploadError = function(){};
		if(!opt.onAjaxComplete) opt.onAjaxComplete = function(){};
		this.upInProgress = function() {
			return upinprogress;
		};

		// Prepare files for upload
		var prepareFiles = function(files) {
			// Error
			var error = false;
			var totalsize = 0;
			upinprogress = true;

			// Callback
			opt.onNewFiles.call(this, files);

			// Check if too many files
			if(files.length > opt.maxfiles) {
				opt.onTooManyFiles.call();
				return;
			}

			// The files
			var final_files = [];

			// For each files
			for(var i in files) {
				// Check if is an object
				if(typeof files[i] !== "object") continue;

				// The file
				var file = files[i];

				// If files are too big
				totalsize += file.size;
				if(file.size > opt.maxfilesize || totalsize > opt.maxfilesize) {
					opt.onFileSizeError.call();
					error = true;
					break;
				}

				// Push the file to the array
				final_files.push(files[i]);

				// If multiple file upload is disabled
				if(!opt.multiple) break;
			}

			// If error cancel upload
			if(error) {
				upinprogress = false;
				return;
			}

			// Callback
			opt.onBeforeUpload.call();

			// Send files to the worker
			worker.postMessage({compress: opt.compress, files: final_files});
		};

		// Progress function for upload
		var progress = function(e) {
			if(typeof e === 'undefined' || !e.lengthComputable) return;
			var pourcent = Math.round((e.loaded * 100)/e.total);
			opt.onUploadProgress.call(this, pourcent);
			if(pourcent >= 100) opt.onUploadComplete.call();
		};

		// The upload function
		var upload = function(files) {
			// Callback upload start with progress 0
			opt.onUploadProgress.call(this, 0);

			// Create form data
			var fd = new FormData();
			fd.append('files_count', files.length);
			for(var i in files) {
				fd.append('file_'+i, files[i].content);
				fd.append('file_'+i+'_infos', JSON.stringify({
					name: files[i].filename,
					orig_size: files[i].orig_size,
					compressed: files[i].compressed,
				}));
			}

			$.ajax({
				type: 'POST',
				url: opt.url,
				data: fd,
				processData: false,
				contentType: false,
				cache: false,
				timeout: opt.timeout,
				dataType: opt.resDataType,
				xhr: function() {
					var aXhr = $.ajaxSettings.xhr();
					if(aXhr.upload) aXhr.upload.addEventListener('progress', progress, false);
					return aXhr;
				},
				success: function(res) {
					opt.onUploadSuccess.call(this, res);
				},
				error: function(error) {
					opt.onUploadError.call(this, error);
				}
			}).always(function() {
				opt.onAjaxComplete.call();
				upinprogress = false;
			});
		};

		// Init the worker
		var workerScript = "'use strict';var act=['','text/css','text/javascript','text/xml','text/plain','text/html','text/x-component','application/javascript','application/x-javascript','application/json','application/manifest+json','application/xml','application/xhtml+xml','application/rss+xml','application/atom+xml','application/rdf+xml','application/vnd.ms-fontobject','font/truetype','font/opentype','font/ttf','font/eot','font/otf','application/x-font-ttf','application/x-font-opentype','application/x-font-truetype','image/svg+xml','image/x-icon','image/vnd.microsoft.icon'];self.addEventListener('message',function(e){if(e.data.pakoDeflatePath){importScripts(e.data.pakoDeflatePath);return}var files=e.data.files;var compress=e.data.compress;var final_res=[];for(var i in files){var can_compress=!1;var file=files[i];if(compress&&file.size>100&&act.indexOf(file.type)>-1)can_compress=!0;var content;if(can_compress)content=pako.gzip((new FileReaderSync()).readAsArrayBuffer(file),{level:1});else content=(new FileReaderSync()).readAsArrayBuffer(file);final_res.push({filename:file.name,orig_size:file.size,compressed:can_compress,content:new Blob([content])})}self.postMessage(final_res)},!1)";
		var workerBlob;
		try {
			workerBlob = new Blob([workerScript], {type: 'application/javascript'});
		} catch (e) {
			window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
			workerBlob = new BlobBuilder();
			workerBlob.append(workerScript);
			workerBlob = workerBlob.getBlob();
		}
		worker = new Worker((window.URL || window.webkitURL).createObjectURL(workerBlob));

		// Load pako if compress
		if(opt.compress) worker.postMessage({pakoDeflatePath: opt.pakoDeflatePath});

		// Worker callback
		worker.addEventListener('message', function (e) {
			// Start upload
			upload(e.data);
		}, false);

		// Cancel all drag and drop document events
		$(document).off('drop').on('drop', function(e) {
			e.preventDefault();
		});
		$(document).off('dragenter').on('dragenter', function(e) {
			e.preventDefault();
		});
		$(document).off('dragleave').on('dragleave', function(e) {
			e.preventDefault();
		});
		$(document).off('dragover').on('dragover', function(e) {
			e.preventDefault();
		});

		// Zone events
		zone.off('click').on('click', function(e) {
			// Block click during uploading
			if(upinprogress) e.preventDefault();
		});
		zone.find('input[type=file]').off('change').on('change', function(e) {
			// Block if currently uploading
			if(upinprogress) return;

			// Check if has files
			var files = e.target && e.target.files;
			if(!files || !files.length) return;

			// Prepare files
			prepareFiles(files);

			// Clear input
			$(this).val('');
		});
		zone.off('dragenter').on('dragenter', function(e) {
			e.preventDefault();

			// Block if currently uploading
			if(upinprogress) return;

			if(dragover === 0) opt.onDragEnter.call();
			dragover++;
		});
		zone.off('dragleave').on('dragleave', function(e) {
			e.preventDefault();

			// Block if currently uploading
			if(upinprogress) return;

			dragover--;
			if(dragover === 0) opt.onDragLeave.call();
		});
		zone.off('drop').on('drop', function(e) {
			e.preventDefault();

			// Block if currently uploading
			if(upinprogress) return;

			// If dragover before drop
			if(dragover > 0) {
				dragover = 0;
				opt.onDragLeave.call();
			}

			// Check if datatransfer is ok
			var dataTransfer = e.originalEvent && e.originalEvent.dataTransfer;
			if (!dataTransfer || !dataTransfer.files || !dataTransfer.files.length) return;

			// Prepare files
			prepareFiles(dataTransfer.files);
		});
	};
}(jQuery));