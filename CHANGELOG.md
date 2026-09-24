KnUpload Changelog
==========

v6.0.0 (2026-09-24):
----------------------------
### Breaking changes
* KnHttpJs **>= 4.0.0** is now required (an error is thrown at init if KnHttp is missing or too old)
* **element.KnUpload(options)** replaced by **KnUpload.create(element or selector, options)**, **Element.prototype** is no longer modified
* The files are sent in the **files[]** field (**fieldName** option) instead of **nb_files**, **file_X** and **file_X_name**
* The request options (**csrf**, **csrfHeader**, **headers**, **timeout**, **withCredentials**, **basicAuth**, **bearerAuthToken**, **responseType**) are replaced by the **request** option given to KnHttpJs (object or function)
* The **data** option is an object or a function returning an object (its values are no longer functions), serialized by KnHttpJs: nested objects and arrays are sent as **key[subkey]**, null values as an empty string
* **maxFilesSize** renamed **maxTotalSize**, **killDocumentDad** renamed **preventDocumentDrop**
* Callbacks renamed:
	* **onNewFiles(files)** renamed **onFiles(files)**, it receives a **File[]** array instead of a **FileList**
	* **onTooManyFiles()** and **onFileSizeError()** replaced by **onReject(rejections)**
	* **onBeforeUpload()** renamed **onStart(files)**
	* **onUploadProgress(progress)** renamed **onProgress(progress)**
	* **onUploadComplete()** renamed **onSent()**
	* **onUploadSuccess(res, headers)** replaced by **onSuccess(res, files)** with a KnHttp response object (res.data, res.headers, res.status)
	* **onUploadError(err, status)** replaced by **onError(err, files)** with a KnHttp error object (err.code, err.status, err.data, err.message)
	* **onAjaxComplete()** replaced by **onEnd(report)**, always called last
* **zone.opt** and **zone.uploadInProgress** renamed **zone.options** and **zone.uploading**
* The zone opens the file selection on click, Enter and Space (**clickable** option), it gets **tabindex** and **role** attributes if missing
* **dist/kn_upload.js** and **dist/kn_upload.min.js** replaced by **dist/kn-upload.iife.js** and **dist/kn-upload.iife.min.js**
* Errors thrown at init are now **Error** objects instead of strings
* Requires Chrome / Edge 85+, Firefox 79+ or Safari 14.1+

### New features
* Vue 3 integration (**kn-upload/vue**, Vue >= 3.5 as optional peer dependency)
	* **useKnUpload(target, options)** composable: reactive state (uploading, dragover, progress, items with the status of each file, rejected, report) and methods (upload, browse, cancel)
	* **KnUploadZone** component: state in the default slot, callbacks as events, exposed methods, state classes rendered by Vue (merged with the classes of the parent)
* One request per file with parallel uploads: **batch: false** and **concurrency** options (all the files in one request by default)
	* **onFileProgress(file, progress)** callback, global progress weighted by the file sizes
	* A failed file does not stop the other files
* Validation: **accept** (MIME types, MIME groups, extensions, also set on the input), **maxFileSize** (per file), **maxTotalSize** and **validate** (custom rules) options
	* **onReject(rejections)** callback with the file, the reason (type, file-size, invalid, too-many, total-size) and the message
* **zone.upload(files)**: upload files from code, returns a Promise resolved with the report (success, canceled, files, rejected, responses, errors)
* **zone.browse()**: open the file selection, **zone.element** and **zone.input** properties
* The file input is created automatically if the zone does not contain one
* **paste** option: upload the files pasted in the page
* **directories** option: the files of the dropped folders are uploaded
* Automatic CSS classes: **is-dragover** and **is-uploading** (**dragoverClass** and **uploadingClass** options), **aria-busy** during the upload
* **client** option: send the files with a KnHttp instance (base URL, auth token, hooks, retry...)
* **request** option: all the KnHttpJs request options, static or evaluated at each request
* **parse** option: optional runtime validation of the server response
* Files are uploaded as-is (no more FileReader): not loaded in memory before the upload, sent with their original name
* **data** values can be **File** or **Blob**
* The unhandled error callback of the KnHttp instance is used when **onError** is not set
* The zones are never made reactive by Vue: they can be stored in a ref, a reactive object or a Pinia store
* **KnUpload.KNHTTP_MIN_VERSION** property added
* Written in TypeScript with strong typing
	* Generic response type: `KnUpload.create<MyResponse>(zone, {...})`, or inferred from the **parse** option
	* Exported types: **KnUploadOptions**, **KnUploadSettings**, **KnUploadCallbacks**, **KnUploadResolvedOptions**, **KnUploadInstance**, **KnUploadReport**, **KnUploadRejection**, **KnUploadRejectReason**, **KnUploadRequestOptions**, **KnUploadValue** and the KnHttpJs types used by the options
* ES module build (**dist/kn-upload.js**) importing **kn-http**, without side effect, with the TypeScript declarations (**dist/types/**)
* Samples with CSS examples (dragover, upload in progress, keyboard focus, file status): browser script (**samples/index.html**), ES module (**samples/esm.html**) and Vue 3 + TypeScript (**samples/vue/**: FileUpload.vue with the composable, ImageUpload.vue with the component)

### Bug fixes
* **preventDocumentDrop** only blocks the files dropped outside the zone: the drag & drop of the page elements is no longer broken
* The drags of text or links no longer trigger **onDragEnter** / **onDragLeave**
* Fixed **uploading** (previously **uploadInProgress**) property always returning false
* An exception thrown in a callback no longer leaves the zone in the uploading state

### Build
* Migrated from gulp to Vite 8 (library mode) and TypeScript 6 (strict mode)
	* **build**, **typecheck** and **dev** scripts
	* **samples** script: Vite dev server of the samples with a mock upload API
	* The Vue sample is type-checked with vue-tsc (**typecheck** script)
* Upload zone rewritten as a class
* Added **kn-http** and **vue** (optional) as peer dependencies, **exports**, **files** and **sideEffects** fields to package.json
* Commented out all the console.log

v5.0.1 (2023-12-23):
----------------------------
* Use Object.assign to set default options

v5.0.0 (2023-12-16):
----------------------------
* Add the ability to use more KnHttpJS parameters in the upload request
	* responseType
	* csrf
	* csrfHeader
	* withCredentials
	* basicAuth
	* bearerAuthToken
* Breaking change
	* **kill_document_dad** option renamed to **killDocumentDad**
	* **max_files** option renamed to **maxFiles**
	* **max_files_size** option renamed to **maxFilesSize**
	* **upload_in_progress** property renamed to **uploadInProgress**

v4.0.1 (2023-02-01):
----------------------------
* Allow functions in the URL and on the data object

v4.0.0 (2023-01-07):
----------------------------
* Migrating from “Axios” to “KnHttpJs”
