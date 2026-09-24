import KnHttp from 'kn-http';
import { KnUploadZone } from './kn-upload-zone';
import type { KnUploadInstance, KnUploadOptions } from './types';

export type * from './types';

/**
 * Minimum KnHttp version required
 */
const KNHTTP_MIN_VERSION = '4.0.0';

/**
 * Throw if KnHttp is missing or too old
 * @returns
 */
function checkKnHttp(): void {
	if (typeof KnHttp === 'undefined') throw new Error('KnHttp is required');

	const cur = String(KnHttp.VERSION || '0').split('.').map(v => parseInt(v) || 0),
		min = KNHTTP_MIN_VERSION.split('.').map(v => parseInt(v) || 0);

	for (const [i, m] of min.entries()) {
		const c = cur[i] ?? 0;
		if (c > m) return;
		if (c < m) throw new Error('KnHttp >= ' + KNHTTP_MIN_VERSION + ' is required');
	}
}

/**
 * KnUpload
 */
const KnUpload = {
	/** LIB VERSION */
	VERSION: __KN_UPLOAD_VERSION__ as string,

	/** MINIMUM KNHTTP VERSION REQUIRED */
	KNHTTP_MIN_VERSION: KNHTTP_MIN_VERSION as string,

	/**
	 * Create an upload zone
	 * @param target Zone element or CSS selector
	 * @param options
	 * @returns
	 */
	create<T = unknown>(target: Element | string, options: KnUploadOptions<T>): KnUploadInstance<T> {
		//console.log('KnUpload.create()', target, options);

		checkKnHttp();

		const element = typeof target === 'string' ? document.querySelector(target) : target;
		if (!element) throw new Error('Upload zone not found: ' + String(target));

		return new KnUploadZone<T>(element, options);
	}
} as const;

export default KnUpload;
