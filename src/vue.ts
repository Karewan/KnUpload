import KnHttp from 'kn-http';
import KnUpload from '@karewan/kn-upload';
import type { KnHttpError, KnHttpResponse, KnUploadCallbacks, KnUploadInstance, KnUploadOptions, KnUploadRejection, KnUploadReport, KnUploadSettings } from '@karewan/kn-upload';
import {
	defineComponent, h, markRaw, onScopeDispose, readonly, ref, shallowReadonly, shallowRef, toValue, watch,
	type MaybeRefOrGetter, type PropType, type Ref, type ShallowRef, type SlotsType
} from 'vue';

/**
 * Status of a file
 */
export type KnUploadItemStatus = 'pending' | 'uploading' | 'success' | 'error' | 'canceled';

/**
 * File of the upload in progress (or of the last upload)
 */
export interface KnUploadItem {
	/** File */
	readonly file: File;
	/** Status */
	readonly status: KnUploadItemStatus;
	/** Upload progress in pourcent */
	readonly progress: number;
	/** Error of the request of the file */
	readonly error: KnHttpError | null;
}

/**
 * Reactive state and methods of an upload zone
 */
export interface UseKnUploadReturn<T = unknown> {
	/** Upload zone instance (null if the element is not mounted) */
	readonly zone: Readonly<ShallowRef<KnUploadInstance<T> | null>>;
	/** True if an upload is in progress */
	readonly uploading: Readonly<Ref<boolean>>;
	/** True if files are dragged over the zone */
	readonly dragover: Readonly<Ref<boolean>>;
	/** Global upload progress in pourcent */
	readonly progress: Readonly<Ref<number>>;
	/** Files of the upload in progress (or of the last upload) */
	readonly items: Readonly<Ref<readonly KnUploadItem[]>>;
	/** Files rejected by the last validation */
	readonly rejected: Readonly<Ref<readonly KnUploadRejection[]>>;
	/** Report of the last upload */
	readonly report: Readonly<ShallowRef<KnUploadReport<T> | null>>;
	/** Upload files (validation included) */
	upload(files: FileList | readonly File[]): Promise<KnUploadReport<T>>;
	/** Open the file selection (must be called from a user action) */
	browse(): void;
	/** Cancel the upload */
	cancel(): void;
}

/**
 * Mutable file item (internal)
 */
interface KnUploadMutableItem {
	file: File;
	status: KnUploadItemStatus;
	progress: number;
	error: KnHttpError | null;
}

/**
 * Upload zone composable: creates the zone when the element is mounted and destroys it with the component
 * @param target Zone element (template ref or getter)
 * @param options KnUpload options (read when the zone is created, use functions for the dynamic values)
 * @returns
 */
export function useKnUpload<T = unknown>(target: MaybeRefOrGetter<Element | null | undefined>, options: KnUploadOptions<T>): UseKnUploadReturn<T> {
	const zone = shallowRef<KnUploadInstance<T> | null>(null),
		uploading = ref(false),
		dragover = ref(false),
		progress = ref(0),
		items = ref<KnUploadMutableItem[]>([]),
		rejected = shallowRef<readonly KnUploadRejection[]>([]),
		report = shallowRef<KnUploadReport<T> | null>(null);

	// Items of files
	const update = (files: readonly File[], changes: Partial<KnUploadMutableItem>) => {
		for (const item of items.value) if (files.includes(item.file)) Object.assign(item, changes);
	};

	// Callbacks: update the state then call the callbacks of the options
	const callbacks: Required<KnUploadCallbacks<T>> = {
		onDragEnter: () => {
			dragover.value = true;
			options.onDragEnter?.();
		},
		onDragLeave: () => {
			dragover.value = false;
			options.onDragLeave?.();
		},
		onFiles: files => {
			rejected.value = [];
			options.onFiles?.(files);
		},
		onReject: rejections => {
			rejected.value = rejections;
			options.onReject?.(rejections);
		},
		onStart: files => {
			const batch = zone.value?.options.batch ?? true;
			items.value = files.map(file => ({ file, status: batch ? 'uploading' : 'pending', progress: 0, error: null }));
			progress.value = 0;
			report.value = null;
			uploading.value = true;
			options.onStart?.(files);
		},
		onProgress: value => {
			progress.value = value;
			if (zone.value?.options.batch ?? true) update(items.value.map(i => i.file), { progress: value });
			options.onProgress?.(value);
		},
		onFileProgress: (file, value) => {
			update([file], { status: 'uploading', progress: value });
			options.onFileProgress?.(file, value);
		},
		onSent: () => {
			options.onSent?.();
		},
		onSuccess: (res, files) => {
			update(files, { status: 'success', progress: 100 });
			options.onSuccess?.(res, files);
		},
		onError: (err, files) => {
			update(files, { status: 'error', error: err });

			// Without onError, the unhandled error callback of the KnHttp instance is called
			if (options.onError) options.onError(err, files);
			else (options.client ?? KnHttp).defaults.onUnhandledError?.(err);
		},
		onEnd: result => {
			if (result.canceled) for (const item of items.value) if (item.status == 'pending' || item.status == 'uploading') item.status = 'canceled';
			uploading.value = false;
			report.value = result;
			options.onEnd?.(result);
		}
	};

	// Create the zone when the element is mounted (and recreate it if the element changes)
	watch(() => toValue(target), element => {
		zone.value?.destroy();
		// The instance is not made reactive (no proxy)
		zone.value = element ? markRaw(KnUpload.create<T>(element, { ...options, ...callbacks })) : null;
		dragover.value = false;
		uploading.value = false;
	}, { immediate: true, flush: 'post' });

	onScopeDispose(() => {
		zone.value?.destroy();
		zone.value = null;
	});

	return {
		zone: shallowReadonly(zone),
		uploading: readonly(uploading),
		dragover: readonly(dragover),
		progress: readonly(progress),
		items: items as Readonly<Ref<readonly KnUploadItem[]>>,
		rejected: shallowReadonly(rejected),
		report: shallowReadonly(report),
		upload: files => zone.value ? zone.value.upload(files) : Promise.reject(new Error('Upload zone not mounted')),
		browse: () => zone.value?.browse(),
		cancel: () => zone.value?.cancel()
	};
}

/**
 * Props of the default slot of KnUploadZone
 */
export interface KnUploadSlotProps {
	/** True if an upload is in progress */
	uploading: boolean;
	/** True if files are dragged over the zone */
	dragover: boolean;
	/** Global upload progress in pourcent */
	progress: number;
	/** Files of the upload in progress (or of the last upload) */
	items: readonly KnUploadItem[];
	/** Files rejected by the last validation */
	rejected: readonly KnUploadRejection[];
	/** Report of the last upload */
	report: KnUploadReport<unknown> | null;
	/** Open the file selection */
	browse(): void;
	/** Cancel the upload */
	cancel(): void;
}

/**
 * Upload zone component
 *
 * <KnUploadZone url="/upload" :options="{ maxFiles: 5 }" @success="onSuccess" v-slot="{ progress, items }">...</KnUploadZone>
 */
export const KnUploadZone = defineComponent({
	name: 'KnUploadZone',
	props: {
		/** Upload URL */
		url: { type: [String, Function] as PropType<KnUploadSettings['url']>, required: true },
		/** KnUpload settings (read when the zone is created) */
		options: { type: Object as PropType<Omit<KnUploadSettings, 'url'>>, default: () => ({}) },
		/** Element of the zone */
		tag: { type: String, default: 'div' }
	},
	emits: {
		dragenter: () => true,
		dragleave: () => true,
		files: (_files: File[]) => true,
		reject: (_rejections: KnUploadRejection[]) => true,
		start: (_files: File[]) => true,
		progress: (_progress: number) => true,
		fileProgress: (_file: File, _progress: number) => true,
		sent: () => true,
		success: (_res: KnHttpResponse<unknown>, _files: File[]) => true,
		error: (_err: KnHttpError, _files: File[]) => true,
		end: (_report: KnUploadReport<unknown>) => true
	},
	slots: Object as SlotsType<{ default: KnUploadSlotProps }>,
	setup(props, { emit, slots, expose }) {
		const element = ref<Element | null>(null);

		// The state classes are rendered by Vue (the classes set by the parent are merged)
		const dragoverClass = props.options.dragoverClass === undefined ? 'is-dragover' : props.options.dragoverClass,
			uploadingClass = props.options.uploadingClass === undefined ? 'is-uploading' : props.options.uploadingClass;

		const state = useKnUpload<unknown>(element, {
			...props.options,
			url: props.url,
			dragoverClass: null,
			uploadingClass: null,
			onDragEnter: () => emit('dragenter'),
			onDragLeave: () => emit('dragleave'),
			onFiles: files => emit('files', files),
			onReject: rejections => emit('reject', rejections),
			onStart: files => emit('start', files),
			onProgress: progress => emit('progress', progress),
			onFileProgress: (file, progress) => emit('fileProgress', file, progress),
			onSent: () => emit('sent'),
			onSuccess: (res, files) => emit('success', res, files),
			onError: (err, files) => emit('error', err, files),
			onEnd: report => emit('end', report)
		});

		expose({ upload: state.upload, browse: state.browse, cancel: state.cancel });

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
