/**
 * KnUpload v6.0.1 (2026-09-24T12:26:42.850Z)
 * Copyright (c) 2019 - 2026 Florent VIALATTE
 * Released under the MIT license
 */
import KnHttp from "kn-http";
import KnUpload from "@karewan/kn-upload";
import { defineComponent, h, markRaw, onScopeDispose, readonly, ref, shallowReadonly, shallowRef, toValue, watch } from "vue";
//#region src/vue.ts
/**
* Upload zone composable: creates the zone when the element is mounted and destroys it with the component
* @param target Zone element (template ref or getter)
* @param options KnUpload options (read when the zone is created, use functions for the dynamic values)
* @returns
*/
function useKnUpload(target, options) {
	const zone = shallowRef(null), uploading = ref(false), dragover = ref(false), progress = ref(0), items = ref([]), rejected = shallowRef([]), report = shallowRef(null);
	const update = (files, changes) => {
		for (const item of items.value) if (files.includes(item.file)) Object.assign(item, changes);
	};
	const callbacks = {
		onDragEnter: () => {
			dragover.value = true;
			options.onDragEnter?.();
		},
		onDragLeave: () => {
			dragover.value = false;
			options.onDragLeave?.();
		},
		onFiles: (files) => {
			rejected.value = [];
			options.onFiles?.(files);
		},
		onReject: (rejections) => {
			rejected.value = rejections;
			options.onReject?.(rejections);
		},
		onStart: (files) => {
			const batch = zone.value?.options.batch ?? true;
			items.value = files.map((file) => ({
				file,
				status: batch ? "uploading" : "pending",
				progress: 0,
				error: null
			}));
			progress.value = 0;
			report.value = null;
			uploading.value = true;
			options.onStart?.(files);
		},
		onProgress: (value) => {
			progress.value = value;
			if (zone.value?.options.batch ?? true) update(items.value.map((i) => i.file), { progress: value });
			options.onProgress?.(value);
		},
		onFileProgress: (file, value) => {
			update([file], {
				status: "uploading",
				progress: value
			});
			options.onFileProgress?.(file, value);
		},
		onSent: () => {
			options.onSent?.();
		},
		onSuccess: (res, files) => {
			update(files, {
				status: "success",
				progress: 100
			});
			options.onSuccess?.(res, files);
		},
		onError: (err, files) => {
			update(files, {
				status: "error",
				error: err
			});
			if (options.onError) options.onError(err, files);
			else (options.client ?? KnHttp).defaults.onUnhandledError?.(err);
		},
		onEnd: (result) => {
			if (result.canceled) {
				for (const item of items.value) if (item.status == "pending" || item.status == "uploading") item.status = "canceled";
			}
			uploading.value = false;
			report.value = result;
			options.onEnd?.(result);
		}
	};
	watch(() => toValue(target), (element) => {
		zone.value?.destroy();
		zone.value = element ? markRaw(KnUpload.create(element, {
			...options,
			...callbacks
		})) : null;
		dragover.value = false;
		uploading.value = false;
	}, {
		immediate: true,
		flush: "post"
	});
	onScopeDispose(() => {
		zone.value?.destroy();
		zone.value = null;
	});
	return {
		zone: shallowReadonly(zone),
		uploading: readonly(uploading),
		dragover: readonly(dragover),
		progress: readonly(progress),
		items,
		rejected: shallowReadonly(rejected),
		report: shallowReadonly(report),
		upload: (files) => zone.value ? zone.value.upload(files) : Promise.reject(/* @__PURE__ */ new Error("Upload zone not mounted")),
		browse: () => zone.value?.browse(),
		cancel: () => zone.value?.cancel()
	};
}
/**
* Upload zone component
*
* <KnUploadZone url="/upload" :options="{ maxFiles: 5 }" @success="onSuccess" v-slot="{ progress, items }">...</KnUploadZone>
*/
var KnUploadZone = defineComponent({
	name: "KnUploadZone",
	props: {
		/** Upload URL */
		url: {
			type: [String, Function],
			required: true
		},
		/** KnUpload settings (read when the zone is created) */
		options: {
			type: Object,
			default: () => ({})
		},
		/** Element of the zone */
		tag: {
			type: String,
			default: "div"
		}
	},
	emits: {
		dragenter: () => true,
		dragleave: () => true,
		files: (_files) => true,
		reject: (_rejections) => true,
		start: (_files) => true,
		progress: (_progress) => true,
		fileProgress: (_file, _progress) => true,
		sent: () => true,
		success: (_res, _files) => true,
		error: (_err, _files) => true,
		end: (_report) => true
	},
	slots: Object,
	setup(props, { emit, slots, expose }) {
		const element = ref(null);
		const dragoverClass = props.options.dragoverClass === void 0 ? "is-dragover" : props.options.dragoverClass, uploadingClass = props.options.uploadingClass === void 0 ? "is-uploading" : props.options.uploadingClass;
		const state = useKnUpload(element, {
			...props.options,
			url: props.url,
			dragoverClass: null,
			uploadingClass: null,
			onDragEnter: () => emit("dragenter"),
			onDragLeave: () => emit("dragleave"),
			onFiles: (files) => emit("files", files),
			onReject: (rejections) => emit("reject", rejections),
			onStart: (files) => emit("start", files),
			onProgress: (progress) => emit("progress", progress),
			onFileProgress: (file, progress) => emit("fileProgress", file, progress),
			onSent: () => emit("sent"),
			onSuccess: (res, files) => emit("success", res, files),
			onError: (err, files) => emit("error", err, files),
			onEnd: (report) => emit("end", report)
		});
		expose({
			upload: state.upload,
			browse: state.browse,
			cancel: state.cancel
		});
		return () => h(props.tag, {
			ref: element,
			class: [state.dragover.value && dragoverClass, state.uploading.value && uploadingClass]
		}, slots.default?.({
			uploading: state.uploading.value,
			dragover: state.dragover.value,
			progress: state.progress.value,
			items: state.items.value,
			rejected: state.rejected.value,
			report: state.report.value,
			browse: state.browse,
			cancel: state.cancel
		}));
	}
});
//#endregion
export { KnUploadZone, useKnUpload };
