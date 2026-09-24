<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { useKnUpload, type KnUploadItemStatus } from '@karewan/kn-upload/vue';
import type { KnUploadRejectReason } from '@karewan/kn-upload';

/**
 * Server response of the upload
 */
interface UploadResult {
	files: string[];
}

const props = defineProps<{
	folderId: number;
}>();

const emit = defineEmits<{
	uploaded: [files: string[]];
}>();

// Upload zone: one request per file, 2 files uploaded at the same time
const { uploading, dragover, progress, items, rejected, report, browse, cancel } = useKnUpload<UploadResult>(useTemplateRef<HTMLElement>('zone'), {
	url: () => `/api/upload?folder=${props.folderId}`,
	data: () => ({ folderId: props.folderId }),
	batch: false,
	concurrency: 2,
	accept: ['image/*', '.pdf', '.txt'],
	maxFiles: 20,
	maxFileSize: 20 * 1024 * 1024,
	maxTotalSize: 0,
	paste: true,
	onSuccess: res => emit('uploaded', res.data.files)
});

const REJECT_MESSAGES: Record<KnUploadRejectReason, string> = {
	'type': 'file type not accepted',
	'file-size': 'file too big (20 MB max)',
	'invalid': 'invalid file',
	'too-many': 'too many files (20 max)',
	'total-size': 'files too big'
};

const STATUS_LABELS: Record<KnUploadItemStatus, string> = {
	pending: 'Waiting',
	uploading: 'Uploading',
	success: 'Uploaded',
	error: 'Error',
	canceled: 'Canceled'
};

/**
 * Format a file size
 * @param bytes
 * @returns
 */
function formatSize(bytes: number): string {
	if (bytes < 1024) return bytes + ' B';
	if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
	return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}
</script>

<template>
	<!-- KnUpload adds the is-dragover and is-uploading classes, tabindex and role -->
	<div ref="zone" class="upload-zone">
		<template v-if="uploading">
			<p>Uploading... {{ progress }}%</p>
			<div class="progress">
				<div class="progress-bar" :style="{ width: progress + '%' }"></div>
			</div>
		</template>
		<p v-else-if="dragover">Drop the files to upload them</p>
		<p v-else>Drop your files here, paste them or <strong>click to select them</strong></p>
		<small>Images, PDF and text files, 20 MB max per file</small>
	</div>

	<ul v-if="rejected.length" class="rejected">
		<li v-for="r in rejected" :key="r.file.name">{{ r.file.name }}: {{ REJECT_MESSAGES[r.reason] }}</li>
	</ul>

	<ul v-if="items.length" class="files">
		<li v-for="item in items" :key="item.file.name" :class="item.status">
			<span class="name">{{ item.file.name }}</span>
			<span class="size">{{ formatSize(item.file.size) }}</span>
			<span class="status">{{ item.error ? item.error.message : STATUS_LABELS[item.status] }}</span>
			<div class="progress">
				<div class="progress-bar" :style="{ width: item.progress + '%' }"></div>
			</div>
		</li>
	</ul>

	<div class="actions">
		<button v-if="uploading" type="button" @click="cancel">Cancel</button>
		<button v-else type="button" @click="browse">Add files</button>
		<span v-if="report && !uploading" :class="report.success ? 'success' : 'error'">
			{{ report.success ? 'All the files have been uploaded' : `${report.errors.length} error(s)` }}
		</span>
	</div>
</template>

<style scoped>
/* Upload zone */
.upload-zone {
	padding: 32px;
	border: 2px dashed #cbd5e1;
	border-radius: 12px;
	background: #fff;
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

/* Files dragged over the zone (class added by KnUpload) */
.upload-zone.is-dragover {
	border-color: #2563eb;
	background: #eff6ff;
}

/* Upload in progress (class added by KnUpload) */
.upload-zone.is-uploading {
	border-style: solid;
	border-color: #2563eb;
	cursor: progress;
}

.upload-zone small {
	color: #64748b;
}

/* Progress bars */
.progress {
	height: 6px;
	border-radius: 3px;
	background: #e2e8f0;
	overflow: hidden;
}

.progress-bar {
	height: 100%;
	background: #2563eb;
	transition: width .2s;
}

/* Rejected files */
.rejected {
	padding: 12px 16px;
	border-radius: 8px;
	background: #fef2f2;
	color: #b91c1c;
	list-style: none;
}

/* Files and their status */
.files {
	padding: 0;
	list-style: none;
}

.files li {
	display: grid;
	grid-template-columns: 1fr auto auto;
	gap: 4px 12px;
	padding: 8px 0;
	border-bottom: 1px solid #e2e8f0;
}

.files .progress {
	grid-column: 1 / -1;
}

.files .size,
.files .status {
	color: #64748b;
}

.files li.success .status {
	color: #15803d;
}

.files li.success .progress-bar {
	background: #16a34a;
}

.files li.error .status,
.files li.canceled .status {
	color: #b91c1c;
}

.files li.error .progress-bar,
.files li.canceled .progress-bar {
	background: #dc2626;
}

/* Actions */
.actions {
	display: flex;
	align-items: center;
	gap: 12px;
	margin-top: 16px;
}

.actions .success {
	color: #15803d;
}

.actions .error {
	color: #b91c1c;
}
</style>
