'use strict';

// On message
self.addEventListener('message', e => {
	// Import pako with the right URL
	if(e.data.pakoDeflatePath) {
		importScripts(e.data.pakoDeflatePath);
		return;
	}

	// The files
	var files = e.data.files;
	var compress = e.data.compress;

	// The final res
	var final_res = [];

	// For each files
	for(var i in files) {
		// The file
		var file = files[i];

		// Read the file
		var content;

		// Read the file and compress if needed
		if(compress) content = pako.gzip((new FileReaderSync()).readAsArrayBuffer(file), {level: 1});
		else content = (new FileReaderSync()).readAsArrayBuffer(file);

		// Add file to the final result
		final_res.push({
			filename: file.name,
			orig_size: file.size,
			compressed: compress,
			content: new Blob([content])
		});
	}

	// Send the result to the UI thread
	self.postMessage(final_res);
}, false);
