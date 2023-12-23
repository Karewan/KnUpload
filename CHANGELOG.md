KnUpload Changelog
==========

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
