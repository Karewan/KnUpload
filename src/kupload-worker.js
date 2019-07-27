'use strict';

// List of valid file type for compression
var act = [
	'', // Unknown type => try to compress
	'text/css',
	'text/javascript',
	'text/xml',
	'text/plain',
	'text/html',
	'text/x-component',
	'application/javascript',
	'application/x-javascript',
	'application/json',
	'application/manifest+json',
	'application/xml',
	'application/xhtml+xml',
	'application/rss+xml',
	'application/atom+xml',
	'application/rdf+xml',
	'application/vnd.ms-fontobject',
	'font/truetype',
	'font/opentype',
	'font/ttf',
	'font/eot',
	'font/otf',
	'application/x-font-ttf',
	'application/x-font-opentype',
	'application/x-font-truetype',
	'image/svg+xml',
	'image/x-icon',
	'image/vnd.microsoft.icon'
];

// On message
self.addEventListener('message', function(e) {
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
		// Compress ?
		var can_compress = false;

		// The file
		var file = files[i];

		// Can compress ? (min 100 bytes and authorized file type)
		if(compress && file.size > 100 && act.indexOf(file.type) > -1) can_compress = true;

		// Read the file
		var content;

		// Read the file and compress if needed
		if(can_compress) content = pako.gzip((new FileReaderSync()).readAsArrayBuffer(file), {level: 1});
		else content = (new FileReaderSync()).readAsArrayBuffer(file);

		// Add file to the final result
		final_res.push({
			filename: file.name,
			orig_size: file.size,
			compressed: can_compress,
			content: new Blob([content])
		});
	}

	// Send the result to the UI thread
	self.postMessage(final_res);
}, false);
