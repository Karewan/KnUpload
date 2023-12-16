# KnUpload

Javascript Drag & Drop upload library based on KnHttpJs.

### Changelog

See the changelog [here](CHANGELOG.md)

### Requirements

* KnHttpJs (https://github.com/Karewan/KnHttpJs)

### Usage

* Get the latest version in [dist](dist) folder
* See exemple [here](samples/index.html)

* Methods

	```javascript
	// Initiate an instance of an upload zone (with options)
	let zoneInstance = document.getElementById('myzone').KnUpload(opt);

	// Cancel / abort the upload
	zoneInstance.cancel();

	// Destroy the upload zone (abort the upload and clear all listeners)
	destroy.destroy();
	```

* Properties

	```javascript
	// Return the zone options
	zoneInstance.opt;

	// Return the lib version
	KnUpload.VERSION;
	```

* Options

	```javascript
	let zoneInstance = zone.KnUpload({
		// URL
		url: 'https://mysuperurl/script.php',
		// Data object (See KnHttpJs doc)
		data: {},
		// Response type (See KnHttpJs doc)
		responseType = null,
		// Headers (See KnHttpJs doc)
		headers: {},
		// CSRF Token (See KnHttpJs doc)
		csrf = null,
		// CSRF Header (See KnHttpJs doc)
		csrfHeader = null,
		// With credentials (See KnHttpJs doc)
		withCredentials = null,
		// Basic auth (See KnHttpJs doc)
		basicAuth = null,
		// Bearer auth token (See KnHttpJs doc)
		bearerAuthToken = null,
		// Timeout in ms (See KnHttpJs doc)
		timeout: 0,
		// Number of concurrent files allowed for the upload
		maxFiles: 3,
		// Sum of the files sizes allowed for the upload
		maxFilesSize: 20971520,
		// Kill document drag&drop to only allow this upload zone
		killDocumentDad: true,
		// On drag hover the zone
		onDragEnter: () => {},
		// On drag leave the zone
		onDragLeave: () => {},
		// Files dropped into the zone
		onNewFiles: (files) => {},
		// Sum of files size are to big (maxFilesSize option)
		onFileSizeError: () => {},
		// Too many files (maxFiles option)
		onTooManyFiles: () => {},
		// Just before the upload start
		onBeforeUpload: () => {},
		// Upload progress in pourcent
		onUploadProgress: (progress) => {},
		// Upload is completed (all files has been sent to the server, the server can now process the files)
		onUploadComplete: () => {},
		// Upload success (the server response is good)
		onUploadSuccess: (res, headers) => {},
		// Upload error (the server response is bad or the upload has failed) (See KnHttpJs doc for the errors)
		onUploadError: (err, status) => {},
		// The upload and the ajax request are fully completed (whatever the final result)
		onAjaxComplete: () => {}
	});
	```

### License

See the license [here](LICENSE.txt)

```
The MIT License (MIT)

Copyright (c) 2019-2023 Florent VIALATTE

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
