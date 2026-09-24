# KnUpload

Drag & drop file upload library for the browser, based on [KnHttpJs](https://github.com/Karewan/KnHttpJs), written in TypeScript.

* Drag & drop, click, keyboard and paste on any element, dropped folders included
* Validation: file types, file size, total size, number of files, custom rules
* All the files in one request, or one request per file with parallel uploads
* Global and per file progress, cancel, `await zone.upload(files)`
* CSS classes and ARIA attributes managed automatically
* All the KnHttpJs options (instances, auth token, CSRF, hooks, retry...)
* Vue 3 composable and component (optional)
* Strongly typed: generic server response, typed options and callbacks
* ES module and browser script (IIFE) builds, no global side effect

## Table of contents

* [Requirements](#requirements)
* [Installation](#installation)
* [Quick start](#quick-start)
* [Vue 3](#vue-3)
* [Usage](#usage)
* [API](#api)
* [Server side](#server-side)
* [TypeScript](#typescript)
* [Samples](#samples)
* [Upgrading from v5](#upgrading-from-v5)
* [Browser support](#browser-support)
* [Build](#build)
* [Changelog](#changelog)
* [License](#license)

## Requirements

* [KnHttpJs](https://github.com/Karewan/KnHttpJs) **>= 4.0.0** (peer dependency)
* Vue **>= 3.5** for the Vue composable and component only (optional peer dependency)

## Installation

### With a package manager (ES module)

```shell
pnpm add kn-http @karewan/kn-upload
```

```shell
npm install kn-http @karewan/kn-upload
```

KnUpload is published on npm as `@karewan/kn-upload`. The TypeScript declarations are included in the packages, nothing else to install.

### Browser script (IIFE)

Load KnHttpJs **first**, then KnUpload, from the `dist` folders, from `node_modules/kn-http/dist/` and `node_modules/@karewan/kn-upload/dist/` or from a CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/kn-http@4/dist/kn-http.iife.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@karewan/kn-upload@6/dist/kn-upload.iife.min.js"></script>
```

The script defines the global `KnUpload` object.

### Dist files

| File | Format | Usage |
| --- | --- | --- |
| `dist/kn-upload.js` | ES module | `import KnUpload from '@karewan/kn-upload'` (Vite, webpack, Rollup...), imports `kn-http` |
| `dist/kn-upload.iife.js` | Browser script | `<script>`, uses the global `KnHttp`, defines the global `KnUpload` |
| `dist/kn-upload.iife.min.js` | Browser script (minified) | `<script>`, uses the global `KnHttp`, defines the global `KnUpload` |
| `dist/vue.js` | ES module | `import { useKnUpload, KnUploadZone } from '@karewan/kn-upload/vue'`, imports `vue`, `@karewan/kn-upload` and `kn-http` |
| `dist/types/` | TypeScript declarations | Used automatically by TypeScript and the editors |

## Quick start

The upload zone can be any element. A click, Enter or Space on the zone opens the file selection (a hidden `<input type="file">` is created if the zone does not contain one).

```html
<div id="zone">Drop your files here or click to select them</div>

<style>
	#zone { border: 2px dashed #ddd; padding: 40px; text-align: center; cursor: pointer; }
	#zone.is-dragover { border-color: #2196F3; }  /* Files dragged over the zone */
	#zone.is-uploading { opacity: .6; }           /* Upload in progress */
</style>
```

### TypeScript (npm)

```typescript
import KnHttp from 'kn-http';
import KnUpload from '@karewan/kn-upload';

interface UploadResult {
	files: string[];
}

const zone = document.getElementById('zone')!;

// The generic type is the type of the server response data (res.data)
const upload = KnUpload.create<UploadResult>(zone, {
	url: '/upload.php',
	data: () => ({ folderId: currentFolderId }),
	request: { csrf: csrfToken },
	accept: ['image/*', '.pdf'],
	maxFiles: 5,
	maxFileSize: 10 * 1024 * 1024,
	onReject: rejections => {
		zone.textContent = rejections.map(r => `${r.file.name}: ${r.reason}`).join(', ');
	},
	onProgress: progress => {
		zone.textContent = `Uploading... ${progress}%`;
	},
	onSuccess: res => {
		zone.textContent = `${res.data.files.length} file(s) uploaded`;
	},
	onError: err => {
		zone.textContent = err.code == KnHttp.NETWORK_ERROR ? 'Please check your internet connection' : `Upload failed: ${err.message}`;
	}
});

// Later
upload.destroy();
```

### JavaScript (npm, ES module)

```javascript
import KnHttp from 'kn-http';
import KnUpload from '@karewan/kn-upload';

const zone = document.getElementById('zone');

const upload = KnUpload.create(zone, {
	url: '/upload.php',
	data: () => ({ folderId: currentFolderId }),
	request: { csrf: csrfToken },
	accept: ['image/*', '.pdf'],
	maxFiles: 5,
	maxFileSize: 10 * 1024 * 1024,
	onProgress: progress => {
		zone.textContent = `Uploading... ${progress}%`;
	},
	onSuccess: res => {
		zone.textContent = `${res.data.files.length} file(s) uploaded`;
	},
	onError: err => {
		zone.textContent = err.code == KnHttp.NETWORK_ERROR ? 'Please check your internet connection' : `Upload failed: ${err.message}`;
	}
});
```

See the ES module sample [here](samples/esm.html).

### JavaScript (browser script, IIFE)

```html
<div id="zone">Drop your files here or click to select them</div>

<script src="kn-http.iife.min.js"></script>
<script src="kn-upload.iife.min.js"></script>
<script>
	const zone = document.getElementById('zone');

	const upload = KnUpload.create(zone, {
		url: '/upload.php',
		data: { folderId: 42 },
		maxFiles: 5,
		onProgress: progress => {
			zone.textContent = 'Uploading... ' + progress + '%';
		},
		onSuccess: res => {
			zone.textContent = res.data.files.length + ' file(s) uploaded';
		},
		onError: err => {
			zone.textContent = 'Upload failed: ' + err.message;
		}
	});
</script>
```

See the browser script sample [here](samples/index.html).

## Vue 3

`@karewan/kn-upload/vue` contains a composable and a component (Vue >= 3.5). The zone is created when the element is mounted and destroyed with the component. See the complete Vue sample in [samples/vue](samples/vue) ([FileUpload.vue](samples/vue/FileUpload.vue) with the composable, [ImageUpload.vue](samples/vue/ImageUpload.vue) with the component).

### Composable: useKnUpload

The composable gives a reactive state, the markup stays free:

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { useKnUpload } from '@karewan/kn-upload/vue';

interface UploadResult {
	files: string[];
}

const props = defineProps<{ folderId: number }>();

const { uploading, dragover, progress, items, rejected, browse, cancel } = useKnUpload<UploadResult>(useTemplateRef<HTMLElement>('zone'), {
	url: () => `/folders/${props.folderId}/upload`,
	batch: false,
	accept: ['image/*', '.pdf'],
	maxFiles: 20,
	maxFileSize: 10 * 1024 * 1024,
	onSuccess: res => console.log(res.data.files)
});
</script>

<template>
	<!-- KnUpload adds the is-dragover and is-uploading classes -->
	<div ref="zone" class="upload-zone">
		<p v-if="uploading">Uploading... {{ progress }}%</p>
		<p v-else-if="dragover">Drop the files</p>
		<p v-else>Drop your files here or click to select them</p>
	</div>

	<p v-for="r in rejected" :key="r.file.name" class="error">{{ r.file.name }}: {{ r.reason }}</p>

	<ul class="files">
		<li v-for="item in items" :key="item.file.name" :class="item.status">
			{{ item.file.name }}: {{ item.status }} {{ item.progress }}%
			<span v-if="item.error">{{ item.error.message }}</span>
		</li>
	</ul>

	<button v-if="uploading" @click="cancel">Cancel</button>
	<button v-else @click="browse">Add files</button>
</template>

<style scoped>
.upload-zone {
	padding: 32px;
	border: 2px dashed #cbd5e1;
	border-radius: 12px;
	text-align: center;
	cursor: pointer;
	transition: border-color .2s, background-color .2s;
}

/* Mouse hover and keyboard focus (the zone is focusable) */
.upload-zone:hover,
.upload-zone:focus-visible {
	border-color: #94a3b8;
	outline: none;
}

/* Files dragged over the zone */
.upload-zone.is-dragover {
	border-color: #2563eb;
	background: #eff6ff;
}

/* Upload in progress */
.upload-zone.is-uploading {
	border-style: solid;
	cursor: progress;
}

/* File status */
.files .success { color: #15803d; }
.files .error, .error { color: #b91c1c; }
</style>
```

| Returned | Type | Description |
| --- | --- | --- |
| `uploading` | `Ref<boolean>` | Upload in progress |
| `dragover` | `Ref<boolean>` | Files dragged over the zone |
| `progress` | `Ref<number>` | Global progress in pourcent |
| `items` | `Ref<KnUploadItem[]>` | Files of the upload in progress (or of the last upload): `{ file, status, progress, error }`, status: `'pending'`, `'uploading'`, `'success'`, `'error'` or `'canceled'` |
| `rejected` | `Ref<KnUploadRejection[]>` | Files rejected by the last validation |
| `report` | `Ref<KnUploadReport \| null>` | Report of the last upload |
| `zone` | `Ref<KnUploadInstance \| null>` | Upload zone instance (`null` if the element is not mounted) |
| `upload(files)`, `browse()`, `cancel()` | Methods | See [Upload zone instance](#upload-zone-instance) |

* The state is read-only. The options are read when the zone is created: use functions for the dynamic values (`url`, `data`, `request`). The callbacks of the options are called after the state update.
* The `is-dragover` and `is-uploading` classes are added by KnUpload: do not use a dynamic `:class` binding on the zone element (Vue would remove them when the binding changes), use the `dragover` and `uploading` state instead (`:class="{ active: dragover }"`).

### Component: KnUploadZone

The component renders the zone element (`tag` prop, `div` by default) with the `is-dragover` and `is-uploading` classes, gives the state to its default slot and emits the callbacks as events:

```vue
<script setup lang="ts">
import { KnUploadZone } from '@karewan/kn-upload/vue';
import type { KnHttpError, KnHttpResponse } from 'kn-http';

function onSuccess(res: KnHttpResponse, files: File[]) {
	console.log(res.data, files);
}

function onError(err: KnHttpError) {
	console.error(err.message);
}
</script>

<template>
	<KnUploadZone class="image-zone" url="/upload" :options="{ accept: 'image/*', maxFiles: 5 }"
		@success="onSuccess" @error="onError" v-slot="{ uploading, progress, dragover, rejected }">
		<p v-if="uploading">Uploading... {{ progress }}%</p>
		<p v-else-if="dragover">Drop the images</p>
		<p v-else>Drop your images here or click to select them</p>
		<p v-for="r in rejected" :key="r.file.name">{{ r.file.name }}: {{ r.reason }}</p>
	</KnUploadZone>
</template>

<style scoped>
/* Root element of KnUploadZone */
.image-zone {
	padding: 24px;
	border: 2px dashed #d8b4fe;
	border-radius: 12px;
	text-align: center;
	cursor: pointer;
	transition: border-color .2s, background-color .2s, transform .2s;
}

.image-zone.is-dragover {
	border-color: #9333ea;
	background: #faf5ff;
	transform: scale(1.02);
}

.image-zone.is-uploading {
	border-style: solid;
	opacity: .7;
}
</style>
```

| Prop | Type | Description |
| --- | --- | --- |
| `url` | `string` or `() => string` | Upload URL (mandatory) |
| `options` | `object` | [Options](#options) (without the callbacks), read when the zone is created |
| `tag` | `string` | Element of the zone (`'div'` by default) |

* Events: `dragenter`, `dragleave`, `files`, `reject`, `start`, `progress`, `file-progress`, `sent`, `success`, `error`, `end` (same parameters as the [callbacks](#callbacks))
* Slot props: `uploading`, `dragover`, `progress`, `items`, `rejected`, `report`, `browse()`, `cancel()`
* Exposed methods (template ref): `upload(files)`, `browse()`, `cancel()`
* The state classes are rendered by Vue (`dragoverClass` and `uploadingClass` options), the `class` and `:class` of the parent are merged

## Usage

### Validation

```javascript
KnUpload.create('#zone', {
	url: '/upload.php',
	accept: ['image/*', 'application/pdf', '.docx'], // MIME types, MIME groups or extensions
	maxFiles: 10,                                     // Files per upload
	maxFileSize: 5 * 1024 * 1024,                     // Size of each file (0 = no limit)
	maxTotalSize: 50 * 1024 * 1024,                   // Total size (0 = no limit)
	validate: file => file.name.length > 100 ? 'File name too long' : true, // false or a message to reject the file
	onReject: rejections => {
		for (const { file, reason, message } of rejections) console.log(file.name, reason, message);
	}
});
```

* The files rejected by `accept`, `maxFileSize` or `validate` are removed, the other files are uploaded
* If there are more files than `maxFiles` or if the total size is bigger than `maxTotalSize`, all the files are rejected
* The rejection reasons are: `'type'`, `'file-size'`, `'invalid'` (validate), `'too-many'` and `'total-size'`
* The `accept` option is also set on the input (file selection filter)

### One request per file

By default, all the files are sent in one request. With `batch: false`, each file is sent in its own request, with parallel uploads:

```javascript
const rows = new Map();

KnUpload.create('#zone', {
	url: '/upload.php',
	batch: false,
	concurrency: 3,         // 3 files uploaded at the same time
	maxFiles: 50,
	maxTotalSize: 0,
	onStart: files => files.forEach(file => rows.set(file, addFileRow(file))),
	onFileProgress: (file, progress) => rows.get(file).setProgress(progress),
	onSuccess: (res, files) => rows.get(files[0]).setDone(),
	onError: (err, files) => rows.get(files[0]).setError(err.message),  // The other files are still uploaded
	onProgress: progress => globalBar.value = progress,                 // Global progress (weighted by the file sizes)
	onEnd: report => console.log(report.success ? 'All uploaded' : report.errors.length + ' file(s) failed')
});
```

### Upload files from code

```javascript
const upload = KnUpload.create('#zone', { url: '/upload.php', maxFiles: 10 });

// Upload files from anywhere (validation included), the promise is resolved with the report
const report = await upload.upload(fileList);
console.log(report.success, report.files, report.rejected, report.responses, report.errors);

// Open the file selection from another button (must be called from a user action)
document.getElementById('browseBtn').addEventListener('click', () => upload.browse());

// Upload the files pasted in the page (Ctrl+V)
KnUpload.create('#zone', { url: '/upload.php', paste: true });
```

### Request options

The `request` option is given to KnHttpJs (timeout, headers, auth token, CSRF, retry...), it can be a function evaluated at each request. The `client` option sends the files with a KnHttp instance (base URL, defaults, hooks...):

```javascript
const api = KnHttp.create({
	baseUrl: '/api',
	authToken: () => localStorage.getItem('token')
});

KnUpload.create('#zone', {
	client: api,
	url: '/files/upload',
	request: () => ({ timeout: 0, headers: { 'X-Folder': currentFolder } })
});
```

### Styling and accessibility

* `is-dragover` class: files dragged over the zone (`dragoverClass` option, `null` to disable)
* `is-uploading` class: upload in progress (`uploadingClass` option, `null` to disable)
* `aria-busy="true"` during the upload
* With `clickable: true` (default), the zone gets `tabindex="0"` and `role="button"` (if missing) and opens the file selection with Enter and Space
* The labels, links, buttons and inputs of the zone keep their own behavior

## API

### KnUpload object

The global `KnUpload` object (browser script) or the default export (ES module):

```javascript
// Create an upload zone (element or CSS selector)
const upload = KnUpload.create(elementOrSelector, options);

// Lib version
KnUpload.VERSION;

// Minimum KnHttpJs version required
KnUpload.KNHTTP_MIN_VERSION;
```

`KnUpload.create` throws an `Error` if KnHttpJs is missing or too old, if the element is not found or if the `url` option is missing.

### Upload zone instance

```javascript
upload.upload(files);   // Upload files (FileList or File[]), returns a Promise<report>, rejected if an upload is in progress
upload.browse();        // Open the file selection (from a user action)
upload.cancel();        // Cancel the upload in progress (onError is not called, onEnd is called with report.canceled)
upload.destroy();       // Cancel the upload and remove the listeners, the attributes and the created input

upload.options;         // Options (with the default values), can be updated
upload.uploading;       // True if an upload is in progress
upload.element;         // Zone element
upload.input;           // File input
```

The instance is never made reactive by Vue: it can be stored in a `ref`, a `reactive` object or a Pinia store.

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| **Request** | | | |
| `url` | `string` or `() => string` | **mandatory** | Upload URL |
| `client` | KnHttp instance or `null` | `null` | KnHttp instance used for the requests (`null` = `KnHttp`) |
| `request` | `object` or `() => object` | `{}` | KnHttpJs request options: `timeout`, `headers`, `authToken`, `csrf`, `retry`, `responseType`... |
| `parse` | `(data) => T` or `null` | `null` | Parse / validate the response data (see the KnHttpJs `parse` option) |
| `fieldName` | `string` | `'files'` | Name of the files field (sent as `files[0]`, `files[1]`...) |
| `data` | `object` or `() => object` | `{}` | Data sent with the files (see [Server side](#server-side)) |
| **Upload** | | | |
| `batch` | `boolean` | `true` | All the files in one request (`true`) or one request per file (`false`) |
| `concurrency` | `number` | `3` | Parallel requests when `batch` is `false` |
| **Validation** | | | |
| `accept` | `string`, `string[]` or `null` | `null` | Accepted types: MIME types, MIME groups (`image/*`) or extensions (`.pdf`) |
| `maxFiles` | `number` | `1` | Maximum number of files per upload |
| `maxFileSize` | `number` | `0` | Maximum size of each file in bytes (0 = no limit) |
| `maxTotalSize` | `number` | `20971520` (20 MB) | Maximum total size in bytes (0 = no limit) |
| `validate` | `(file) => boolean \| string` or `null` | `null` | Custom validation: return `false` or an error message to reject the file |
| **Behavior** | | | |
| `clickable` | `boolean` | `true` | Open the file selection on click, Enter and Space |
| `paste` | `boolean` | `false` | Upload the files pasted in the page |
| `directories` | `boolean` | `true` | Upload the files of the dropped folders (the folder structure is not kept) |
| `preventDocumentDrop` | `boolean` | `false` | Prevent the browser to open the files dropped outside the zone |
| `dragoverClass` | `string` or `null` | `'is-dragover'` | CSS class when files are dragged over the zone |
| `uploadingClass` | `string` or `null` | `'is-uploading'` | CSS class during the upload |

The KnHttpJs options not set in `request` use the default values of the KnHttp instance (see the [KnHttpJs documentation](https://github.com/Karewan/KnHttpJs#default-options)).

### Callbacks

| Callback | Parameters | Description |
| --- | --- | --- |
| `onDragEnter` | - | Files dragged over the zone |
| `onDragLeave` | - | Files dragged out of the zone (or dropped) |
| `onFiles` | `files: File[]` | Files dropped, selected, pasted or given to `upload()` (before the validation) |
| `onReject` | `rejections: KnUploadRejection[]` | Rejected files: `{ file, reason, message }` |
| `onStart` | `files: File[]` | Upload start (accepted files) |
| `onProgress` | `progress: number` | Global progress in pourcent (from 0 to 100) |
| `onFileProgress` | `file: File, progress: number` | Progress of a file (`batch: false` only) |
| `onSent` | - | All the files have been sent, the server is processing them |
| `onSuccess` | `res: KnHttpResponse, files: File[]` | Request success (`res.data`, `res.headers`, `res.status`), `files` = files of the request |
| `onError` | `err: KnHttpError, files: File[]` | Request error (`err.code`, `err.status`, `err.data`, `err.message`), not called on cancel. If not set, the unhandled error callback of the KnHttp instance is called |
| `onEnd` | `report: KnUploadReport` | End of the processing (always called last, even if all the files are rejected) |

The callbacks are called in this order:

```
onFiles
├── onReject (rejected files)
├── onStart (accepted files)
│   └── onProgress (0 → 100), onFileProgress
│       └── onSent
│           └── onSuccess or onError (once per request)
└── onEnd
```

### Upload report

The report is given to `onEnd` and returned by `upload.upload(files)`:

| Property | Type | Description |
| --- | --- | --- |
| `success` | `boolean` | True if files have been uploaded without error |
| `canceled` | `boolean` | True if the upload has been canceled |
| `files` | `File[]` | Uploaded files (accepted by the validation) |
| `rejected` | `KnUploadRejection[]` | Rejected files |
| `responses` | `KnHttpResponse[]` | Success responses (one per request) |
| `errors` | `KnHttpError[]` | Errors (one per failed request) |

## Server side

The files are sent in a `multipart/form-data` POST request (one request for all the files, or one request per file with `batch: false`):

| Field | Description |
| --- | --- |
| `files[0]`, `files[1]`... | Files with their original name (`fieldName` option) |
| Other fields | Keys / values of the `data` option (nested objects and arrays as `key[subkey]`) |

The response must have a 2xx HTTP status and, with the default response type, a JSON body (or an empty body).

PHP example (`$_FILES['files']` works the same way with one or several files):

```php
<?php
$uploaded = [];

foreach ($_FILES['files']['tmp_name'] as $i => $tmpName) {
	$name = basename($_FILES['files']['name'][$i]);

	if ($_FILES['files']['error'][$i] === UPLOAD_ERR_OK && move_uploaded_file($tmpName, '/path/to/uploads/' . $name)) {
		$uploaded[] = $name;
	}
}

header('Content-Type: application/json');
echo json_encode(['files' => $uploaded]);
```

## TypeScript

### Typed server response

`KnUpload.create()` and `useKnUpload()` are generic, the type parameter is the type of `res.data` (`unknown` by default). It can be inferred from the `parse` option:

```typescript
interface UploadResult {
	files: string[];
}

KnUpload.create<UploadResult>('#zone', {
	url: '/upload.php',
	onSuccess: res => console.log(res.data.files) // res.data is UploadResult
});

// Runtime validation (optional), res.data is the return type of parse
KnUpload.create('#zone', {
	url: '/upload.php',
	parse: data => UploadResultSchema.parse(data),
	onSuccess: res => console.log(res.data.files)
});
```

The options are checked at compile time:

```typescript
KnUpload.create('#zone', {});                                           // Error: url is mandatory
KnUpload.create('#zone', { url: '/upload', maxFiles: '3' });            // Error: maxFiles is a number
KnUpload.create('#zone', { url: '/upload', data: { d: new Date() } });  // Error: Date is not a form data value
KnUpload.create('#zone', { url: '/upload', onUploadSuccess: () => {} }); // Error: unknown option (v5 name)
```

### Exported types

```typescript
import type { KnUploadOptions, KnUploadInstance, KnUploadReport } from '@karewan/kn-upload';
import type { KnUploadItem, UseKnUploadReturn } from '@karewan/kn-upload/vue';
```

| Type | Description |
| --- | --- |
| `KnUploadOptions<T>` | Options of `KnUpload.create()` (`KnUploadSettings<T>` and `KnUploadCallbacks<T>`) |
| `KnUploadResolvedOptions<T>` | Options with the default values (`upload.options`) |
| `KnUploadInstance<T>` | Upload zone instance |
| `KnUploadReport<T>` | Upload report |
| `KnUploadRejection`, `KnUploadRejectReason` | Rejected file and rejection reason |
| `KnUploadRequestOptions` | Type of the `request` option |
| `KnUploadValue<V>` | Value or function returning the value |
| `KnHttpClient`, `KnHttpRequest<T>`, `KnHttpResponse<T>`, `KnHttpError`, `KnHttpOptions`, `KnHttpFormDataBody` | Re-exported from `kn-http` |
| `KnUploadItem`, `KnUploadItemStatus` | Files of the Vue state (`@karewan/kn-upload/vue`) |
| `UseKnUploadReturn<T>`, `KnUploadSlotProps` | Vue composable result and component slot props (`@karewan/kn-upload/vue`) |

## Samples

| Sample | Description |
| --- | --- |
| [samples/index.html](samples/index.html) | Browser script (IIFE), one request for all the files, progress bar |
| [samples/esm.html](samples/esm.html) | ES module, KnHttp instance, one request per file with the status of each file |
| [samples/vue](samples/vue) | Vue 3 + TypeScript: [FileUpload.vue](samples/vue/FileUpload.vue) (composable, file list, progress bars) and [ImageUpload.vue](samples/vue/ImageUpload.vue) (component, image previews) |

All the samples have CSS examples (dragover, upload in progress, keyboard focus...). They run with a Vite dev server and a mock upload API (the upload speed is limited to see the progress, the files with "error" in their name return an HTTP 500 error):

```shell
pnpm install
pnpm build
pnpm samples
```

Then open http://localhost:5173/samples/vue/, http://localhost:5173/samples/index.html or http://localhost:5173/samples/esm.html.

## Upgrading from v5

| v5 | v6 |
| --- | --- |
| `dist/kn_upload.js`, `dist/kn_upload.min.js` | `dist/kn-upload.iife.js`, `dist/kn-upload.iife.min.js` |
| `element.KnUpload(options)` | `KnUpload.create(element, options)` |
| Fields `nb_files`, `file_0`, `file_0_name`... | Field `files[]` (`fieldName` option), see [Server side](#server-side) |
| `csrf`, `csrfHeader`, `headers`, `timeout`, `withCredentials`, `basicAuth`, `bearerAuthToken`, `responseType` options | `request` option: `{ csrf, csrfHeader, headers, timeout, withCredentials, basicAuth, authToken, responseType }` |
| `data: { id: () => myId }` | `data: () => ({ id: myId })` |
| `maxFilesSize` | `maxTotalSize` (and `maxFileSize` per file) |
| `killDocumentDad` | `preventDocumentDrop` (only blocks the dropped files) |
| `onNewFiles(files)` | `onFiles(files)` (`File[]` instead of `FileList`) |
| `onTooManyFiles()`, `onFileSizeError()` | `onReject(rejections)` |
| `onBeforeUpload()` | `onStart(files)` |
| `onUploadProgress(progress)` | `onProgress(progress)` |
| `onUploadComplete()` | `onSent()` |
| `onUploadSuccess(res, headers)` | `onSuccess(res, files)`: `res.data`, `res.headers`, `res.status` |
| `onUploadError(err, status)` | `onError(err, files)`: `err.code`, `err.status`, `err.data`, `err.message` |
| `onAjaxComplete()` | `onEnd(report)` |
| `zone.opt`, `zone.uploadInProgress` | `zone.options`, `zone.uploading` |

Other changes:

* KnHttpJs **>= 4.0.0** is required, load it before KnUpload
* The zone opens the file selection on click (`clickable: false` to disable), the `<label>` of the previous markup is no longer needed
* The errors thrown at init are `Error` objects (instead of strings)
* The `data` option is serialized by KnHttpJs: nested objects and arrays are sent as `key[subkey]`, `null` values as an empty string
* The minimum browser versions are higher, see [Browser support](#browser-support)

See the [changelog](CHANGELOG.md) for all the changes.

## Browser support

* Chrome / Edge 85+
* Firefox 79+
* Safari 14.1+

## Build

The sources are in [src](src) (TypeScript 6, strict mode), bundled with Vite 8 (library mode), the declarations are generated with `tsc`.

```shell
# Install the dev dependencies
pnpm install

# Type check the sources, the Vite configs and the Vue sample (vue-tsc)
pnpm typecheck

# Type check, build the bundles (core and Vue) and the declarations into dist
pnpm build

# Rebuild the core bundles on each change
pnpm dev

# Samples dev server (Vue sample with the sources, mock upload API)
pnpm samples
```

## Changelog

See the changelog [here](CHANGELOG.md)

## License

See the license [here](LICENSE.txt)

```
The MIT License (MIT)

Copyright (c) 2019-2026 Florent VIALATTE

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
