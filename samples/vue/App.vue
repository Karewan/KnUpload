<script setup lang="ts">
import { ref } from 'vue';
import FileUpload from './FileUpload.vue';
import ImageUpload from './ImageUpload.vue';

const uploadedFiles = ref<string[]>([]);
</script>

<template>
	<main>
		<h1>KnUpload + Vue 3</h1>
		<p class="hint">Mock server: the files with "error" in their name return an error.</p>

		<section>
			<h2>Composable: useKnUpload</h2>
			<FileUpload :folder-id="42" @uploaded="files => uploadedFiles.push(...files)" />
			<p v-if="uploadedFiles.length" class="hint">Uploaded: {{ uploadedFiles.join(', ') }}</p>
		</section>

		<section>
			<h2>Component: KnUploadZone</h2>
			<ImageUpload />
		</section>
	</main>
</template>

<style>
body {
	margin: 0;
	font-family: system-ui, sans-serif;
	color: #1e293b;
	background: #f8fafc;
}

main {
	max-width: 640px;
	margin: 0 auto;
	padding: 32px 16px;
}

section {
	margin-top: 32px;
}

.hint {
	color: #64748b;
	font-size: 14px;
}
</style>
