<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { KnUploadZone } from 'kn-upload/vue';
import type { KnHttpError, KnHttpResponse } from 'kn-http';

// Previews of the uploaded images
const previews = ref<string[]>([]);
const error = ref<string | null>(null);

/**
 * Upload success: show the images
 * @param _res
 * @param files
 */
function onSuccess(_res: KnHttpResponse, files: File[]): void {
	error.value = null;
	previews.value.push(...files.map(file => URL.createObjectURL(file)));
}

/**
 * Upload error
 * @param err
 */
function onError(err: KnHttpError): void {
	error.value = err.message;
}

onBeforeUnmount(() => previews.value.forEach(url => URL.revokeObjectURL(url)));
</script>

<template>
	<!-- The component renders the zone element, the state is given to the slot -->
	<KnUploadZone class="image-zone" url="/api/upload" :options="{ accept: 'image/*', maxFiles: 5, maxFileSize: 5 * 1024 * 1024 }"
		@success="onSuccess" @error="onError" v-slot="{ uploading, progress, dragover, rejected }">
		<p v-if="uploading">Uploading... {{ progress }}%</p>
		<p v-else-if="dragover">Drop the images</p>
		<p v-else>Drop up to 5 images here or click to select them</p>
		<p v-for="r in rejected" :key="r.file.name" class="error">{{ r.file.name }}: {{ r.reason }}</p>
		<p v-if="error" class="error">{{ error }}</p>
	</KnUploadZone>

	<div v-if="previews.length" class="previews">
		<img v-for="src in previews" :key="src" :src="src" alt="">
	</div>
</template>

<style scoped>
/* Upload zone (root element of KnUploadZone) */
.image-zone {
	padding: 24px;
	border: 2px dashed #d8b4fe;
	border-radius: 12px;
	background: #fff;
	text-align: center;
	cursor: pointer;
	transition: border-color .2s, background-color .2s, transform .2s;
}

/* Mouse hover and keyboard focus */
.image-zone:hover,
.image-zone:focus-visible {
	border-color: #a855f7;
	outline: none;
}

/* Images dragged over the zone */
.image-zone.is-dragover {
	border-color: #9333ea;
	background: #faf5ff;
	transform: scale(1.02);
}

/* Upload in progress */
.image-zone.is-uploading {
	border-style: solid;
	opacity: .7;
	cursor: progress;
}

.error {
	color: #b91c1c;
}

/* Previews */
.previews {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
	gap: 8px;
	margin-top: 16px;
}

.previews img {
	width: 100%;
	aspect-ratio: 1;
	object-fit: cover;
	border-radius: 8px;
}
</style>
