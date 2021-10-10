/**
 * kupload v2.x
 * Copyright (c) 2019-2021 Florent VIALATTE
 * Released under the MIT license
 */
'use strict';

const kupload = function() {
	const VERSION = '2.0.0',
	WORKER_INLINE_SCRIPT = "'use strict';!function(t,e){'object'==typeof exports&&'undefined'!=typeof module?e(exports):'function'==typeof define&&define.amd?define(['exports'],e):e((t='undefined'!=typeof globalThis?globalThis:t||self).pako={})}(this,function(t){'use strict';function e(t){let e=t.length;for(;--e>=0;)t[e]=0}const a=256,n=286,r=30,i=15,s=new Uint8Array([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0]),_=new Uint8Array([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13]),l=new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7]),h=new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),o=new Array(576);e(o);const d=new Array(60);e(d);const u=new Array(512);e(u);const f=new Array(256);e(f);const c=new Array(29);e(c);const p=new Array(r);function g(t,e,a,n,r){this.static_tree=t,this.extra_bits=e,this.extra_base=a,this.elems=n,this.max_length=r,this.has_stree=t&&t.length}let w,b,m;function v(t,e){this.dyn_tree=t,this.max_code=0,this.stat_desc=e}e(p);const y=t=>t<256?u[t]:u[256+(t>>>7)],z=(t,e)=>{t.pending_buf[t.pending++]=255&e,t.pending_buf[t.pending++]=e>>>8&255},k=(t,e,a)=>{t.bi_valid>16-a?(t.bi_buf|=e<<t.bi_valid&65535,z(t,t.bi_buf),t.bi_buf=e>>16-t.bi_valid,t.bi_valid+=a-16):(t.bi_buf|=e<<t.bi_valid&65535,t.bi_valid+=a)},x=(t,e,a)=>{k(t,a[2*e],a[2*e+1])},A=(t,e)=>{let a=0;do{a|=1&t,t>>>=1,a<<=1}while(--e>0);return a>>>1},E=(t,e,a)=>{const n=new Array(16);let r,s,_=0;for(r=1;r<=i;r++)n[r]=_=_+a[r-1]<<1;for(s=0;s<=e;s++){let e=t[2*s+1];0!==e&&(t[2*s]=A(n[e]++,e))}},Z=t=>{let e;for(e=0;e<n;e++)t.dyn_ltree[2*e]=0;for(e=0;e<r;e++)t.dyn_dtree[2*e]=0;for(e=0;e<19;e++)t.bl_tree[2*e]=0;t.dyn_ltree[512]=1,t.opt_len=t.static_len=0,t.last_lit=t.matches=0},R=t=>{t.bi_valid>8?z(t,t.bi_buf):t.bi_valid>0&&(t.pending_buf[t.pending++]=t.bi_buf),t.bi_buf=0,t.bi_valid=0},U=(t,e,a,n)=>{const r=2*e,i=2*a;return t[r]<t[i]||t[r]===t[i]&&n[e]<=n[a]},S=(t,e,a)=>{const n=t.heap[a];let r=a<<1;for(;r<=t.heap_len&&(r<t.heap_len&&U(e,t.heap[r+1],t.heap[r],t.depth)&&r++,!U(e,n,t.heap[r],t.depth));)t.heap[a]=t.heap[r],a=r,r<<=1;t.heap[a]=n},T=(t,e,n)=>{let r,i,l,h,o=0;if(0!==t.last_lit)do{r=t.pending_buf[t.d_buf+2*o]<<8|t.pending_buf[t.d_buf+2*o+1],i=t.pending_buf[t.l_buf+o],o++,0===r?x(t,i,e):(l=f[i],x(t,l+a+1,e),h=s[l],0!==h&&(i-=c[l],k(t,i,h)),r--,l=y(r),x(t,l,n),h=_[l],0!==h&&(r-=p[l],k(t,r,h)))}while(o<t.last_lit);x(t,256,e)},L=(t,e)=>{const a=e.dyn_tree,n=e.stat_desc.static_tree,r=e.stat_desc.has_stree,s=e.stat_desc.elems;let _,l,h,o=-1;for(t.heap_len=0,t.heap_max=573,_=0;_<s;_++)0!==a[2*_]?(t.heap[++t.heap_len]=o=_,t.depth[_]=0):a[2*_+1]=0;for(;t.heap_len<2;)h=t.heap[++t.heap_len]=o<2?++o:0,a[2*h]=1,t.depth[h]=0,t.opt_len--,r&&(t.static_len-=n[2*h+1]);for(e.max_code=o,_=t.heap_len>>1;_>=1;_--)S(t,a,_);h=s;do{_=t.heap[1],t.heap[1]=t.heap[t.heap_len--],S(t,a,1),l=t.heap[1],t.heap[--t.heap_max]=_,t.heap[--t.heap_max]=l,a[2*h]=a[2*_]+a[2*l],t.depth[h]=(t.depth[_]>=t.depth[l]?t.depth[_]:t.depth[l])+1,a[2*_+1]=a[2*l+1]=h,t.heap[1]=h++,S(t,a,1)}while(t.heap_len>=2);t.heap[--t.heap_max]=t.heap[1],((t,e)=>{const a=e.dyn_tree,n=e.max_code,r=e.stat_desc.static_tree,s=e.stat_desc.has_stree,_=e.stat_desc.extra_bits,l=e.stat_desc.extra_base,h=e.stat_desc.max_length;let o,d,u,f,c,p,g=0;for(f=0;f<=i;f++)t.bl_count[f]=0;for(a[2*t.heap[t.heap_max]+1]=0,o=t.heap_max+1;o<573;o++)d=t.heap[o],f=a[2*a[2*d+1]+1]+1,f>h&&(f=h,g++),a[2*d+1]=f,d>n||(t.bl_count[f]++,c=0,d>=l&&(c=_[d-l]),p=a[2*d],t.opt_len+=p*(f+c),s&&(t.static_len+=p*(r[2*d+1]+c)));if(0!==g){do{for(f=h-1;0===t.bl_count[f];)f--;t.bl_count[f]--,t.bl_count[f+1]+=2,t.bl_count[h]--,g-=2}while(g>0);for(f=h;0!==f;f--)for(d=t.bl_count[f];0!==d;)u=t.heap[--o],u>n||(a[2*u+1]!==f&&(t.opt_len+=(f-a[2*u+1])*a[2*u],a[2*u+1]=f),d--)}})(t,e),E(a,o,t.bl_count)},F=(t,e,a)=>{let n,r,i=-1,s=e[1],_=0,l=7,h=4;for(0===s&&(l=138,h=3),e[2*(a+1)+1]=65535,n=0;n<=a;n++)r=s,s=e[2*(n+1)+1],++_<l&&r===s||(_<h?t.bl_tree[2*r]+=_:0!==r?(r!==i&&t.bl_tree[2*r]++,t.bl_tree[32]++):_<=10?t.bl_tree[34]++:t.bl_tree[36]++,_=0,i=r,0===s?(l=138,h=3):r===s?(l=6,h=3):(l=7,h=4))},O=(t,e,a)=>{let n,r,i=-1,s=e[1],_=0,l=7,h=4;for(0===s&&(l=138,h=3),n=0;n<=a;n++)if(r=s,s=e[2*(n+1)+1],!(++_<l&&r===s)){if(_<h)do{x(t,r,t.bl_tree)}while(0!=--_);else 0!==r?(r!==i&&(x(t,r,t.bl_tree),_--),x(t,16,t.bl_tree),k(t,_-3,2)):_<=10?(x(t,17,t.bl_tree),k(t,_-3,3)):(x(t,18,t.bl_tree),k(t,_-11,7));_=0,i=r,0===s?(l=138,h=3):r===s?(l=6,h=3):(l=7,h=4)}};let D=!1;const N=(t,e,a,n)=>{k(t,0+(n?1:0),3),((t,e,a,n)=>{R(t),n&&(z(t,a),z(t,~a)),t.pending_buf.set(t.window.subarray(e,e+a),t.pending),t.pending+=a})(t,e,a,!0)};var I={_tr_init:t=>{D||((()=>{let t,e,a,h,v;const y=new Array(16);for(a=0,h=0;h<28;h++)for(c[h]=a,t=0;t<1<<s[h];t++)f[a++]=h;for(f[a-1]=h,v=0,h=0;h<16;h++)for(p[h]=v,t=0;t<1<<_[h];t++)u[v++]=h;for(v>>=7;h<r;h++)for(p[h]=v<<7,t=0;t<1<<_[h]-7;t++)u[256+v++]=h;for(e=0;e<=i;e++)y[e]=0;for(t=0;t<=143;)o[2*t+1]=8,t++,y[8]++;for(;t<=255;)o[2*t+1]=9,t++,y[9]++;for(;t<=279;)o[2*t+1]=7,t++,y[7]++;for(;t<=287;)o[2*t+1]=8,t++,y[8]++;for(E(o,287,y),t=0;t<r;t++)d[2*t+1]=5,d[2*t]=A(t,5);w=new g(o,s,257,n,i),b=new g(d,_,0,r,i),m=new g(new Array(0),l,0,19,7)})(),D=!0),t.l_desc=new v(t.dyn_ltree,w),t.d_desc=new v(t.dyn_dtree,b),t.bl_desc=new v(t.bl_tree,m),t.bi_buf=0,t.bi_valid=0,Z(t)},_tr_stored_block:N,_tr_flush_block:(t,e,n,r)=>{let i,s,_=0;t.level>0?(2===t.strm.data_type&&(t.strm.data_type=(t=>{let e,n=4093624447;for(e=0;e<=31;e++,n>>>=1)if(1&n&&0!==t.dyn_ltree[2*e])return 0;if(0!==t.dyn_ltree[18]||0!==t.dyn_ltree[20]||0!==t.dyn_ltree[26])return 1;for(e=32;e<a;e++)if(0!==t.dyn_ltree[2*e])return 1;return 0})(t)),L(t,t.l_desc),L(t,t.d_desc),_=(t=>{let e;for(F(t,t.dyn_ltree,t.l_desc.max_code),F(t,t.dyn_dtree,t.d_desc.max_code),L(t,t.bl_desc),e=18;e>=3&&0===t.bl_tree[2*h[e]+1];e--);return t.opt_len+=3*(e+1)+5+5+4,e})(t),i=t.opt_len+3+7>>>3,s=t.static_len+3+7>>>3,s<=i&&(i=s)):i=s=n+5,n+4<=i&&-1!==e?N(t,e,n,r):4===t.strategy||s===i?(k(t,2+(r?1:0),3),T(t,o,d)):(k(t,4+(r?1:0),3),((t,e,a,n)=>{let r;for(k(t,e-257,5),k(t,a-1,5),k(t,n-4,4),r=0;r<n;r++)k(t,t.bl_tree[2*h[r]+1],3);O(t,t.dyn_ltree,e-1),O(t,t.dyn_dtree,a-1)})(t,t.l_desc.max_code+1,t.d_desc.max_code+1,_+1),T(t,t.dyn_ltree,t.dyn_dtree)),Z(t),r&&R(t)},_tr_tally:(t,e,n)=>(t.pending_buf[t.d_buf+2*t.last_lit]=e>>>8&255,t.pending_buf[t.d_buf+2*t.last_lit+1]=255&e,t.pending_buf[t.l_buf+t.last_lit]=255&n,t.last_lit++,0===e?t.dyn_ltree[2*n]++:(t.matches++,e--,t.dyn_ltree[2*(f[n]+a+1)]++,t.dyn_dtree[2*y(e)]++),t.last_lit===t.lit_bufsize-1),_tr_align:t=>{k(t,2,3),x(t,256,o),(t=>{16===t.bi_valid?(z(t,t.bi_buf),t.bi_buf=0,t.bi_valid=0):t.bi_valid>=8&&(t.pending_buf[t.pending++]=255&t.bi_buf,t.bi_buf>>=8,t.bi_valid-=8)})(t)}};var C=(t,e,a,n)=>{let r=65535&t|0,i=t>>>16&65535|0,s=0;for(;0!==a;){s=a>2e3?2e3:a,a-=s;do{r=r+e[n++]|0,i=i+r|0}while(--s);r%=65521,i%=65521}return r|i<<16|0};const B=new Uint32Array((()=>{let t,e=[];for(var a=0;a<256;a++){t=a;for(var n=0;n<8;n++)t=1&t?3988292384^t>>>1:t>>>1;e[a]=t}return e})());var H=(t,e,a,n)=>{const r=B,i=n+a;t^=-1;for(let a=n;a<i;a++)t=t>>>8^r[255&(t^e[a])];return-1^t},M={2:'need dictionary',1:'stream end',0:'','-1':'file error','-2':'stream error','-3':'data error','-4':'insufficient memory','-5':'buffer error','-6':'incompatible version'},P={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_MEM_ERROR:-4,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8};const{_tr_init:j,_tr_stored_block:K,_tr_flush_block:Y,_tr_tally:G,_tr_align:X}=I,{Z_NO_FLUSH:W,Z_PARTIAL_FLUSH:q,Z_FULL_FLUSH:J,Z_FINISH:Q,Z_BLOCK:V,Z_OK:$,Z_STREAM_END:tt,Z_STREAM_ERROR:et,Z_DATA_ERROR:at,Z_BUF_ERROR:nt,Z_DEFAULT_COMPRESSION:rt,Z_FILTERED:it,Z_HUFFMAN_ONLY:st,Z_RLE:_t,Z_FIXED:lt,Z_DEFAULT_STRATEGY:ht,Z_UNKNOWN:ot,Z_DEFLATED:dt}=P,ut=258,ft=262,ct=103,pt=113,gt=666,wt=(t,e)=>(t.msg=M[e],e),bt=t=>(t<<1)-(t>4?9:0),mt=t=>{let e=t.length;for(;--e>=0;)t[e]=0};let vt=(t,e,a)=>(e<<t.hash_shift^a)&t.hash_mask;const yt=t=>{const e=t.state;let a=e.pending;a>t.avail_out&&(a=t.avail_out),0!==a&&(t.output.set(e.pending_buf.subarray(e.pending_out,e.pending_out+a),t.next_out),t.next_out+=a,e.pending_out+=a,t.total_out+=a,t.avail_out-=a,e.pending-=a,0===e.pending&&(e.pending_out=0))},zt=(t,e)=>{Y(t,t.block_start>=0?t.block_start:-1,t.strstart-t.block_start,e),t.block_start=t.strstart,yt(t.strm)},kt=(t,e)=>{t.pending_buf[t.pending++]=e},xt=(t,e)=>{t.pending_buf[t.pending++]=e>>>8&255,t.pending_buf[t.pending++]=255&e},At=(t,e,a,n)=>{let r=t.avail_in;return r>n&&(r=n),0===r?0:(t.avail_in-=r,e.set(t.input.subarray(t.next_in,t.next_in+r),a),1===t.state.wrap?t.adler=C(t.adler,e,r,a):2===t.state.wrap&&(t.adler=H(t.adler,e,r,a)),t.next_in+=r,t.total_in+=r,r)},Et=(t,e)=>{let a,n,r=t.max_chain_length,i=t.strstart,s=t.prev_length,_=t.nice_match;const l=t.strstart>t.w_size-ft?t.strstart-(t.w_size-ft):0,h=t.window,o=t.w_mask,d=t.prev,u=t.strstart+ut;let f=h[i+s-1],c=h[i+s];t.prev_length>=t.good_match&&(r>>=2),_>t.lookahead&&(_=t.lookahead);do{if(a=e,h[a+s]===c&&h[a+s-1]===f&&h[a]===h[i]&&h[++a]===h[i+1]){i+=2,a++;do{}while(h[++i]===h[++a]&&h[++i]===h[++a]&&h[++i]===h[++a]&&h[++i]===h[++a]&&h[++i]===h[++a]&&h[++i]===h[++a]&&h[++i]===h[++a]&&h[++i]===h[++a]&&i<u);if(n=ut-(u-i),i=u-ut,n>s){if(t.match_start=e,s=n,n>=_)break;f=h[i+s-1],c=h[i+s]}}}while((e=d[e&o])>l&&0!=--r);return s<=t.lookahead?s:t.lookahead},Zt=t=>{const e=t.w_size;let a,n,r,i,s;do{if(i=t.window_size-t.lookahead-t.strstart,t.strstart>=e+(e-ft)){t.window.set(t.window.subarray(e,e+e),0),t.match_start-=e,t.strstart-=e,t.block_start-=e,n=t.hash_size,a=n;do{r=t.head[--a],t.head[a]=r>=e?r-e:0}while(--n);n=e,a=n;do{r=t.prev[--a],t.prev[a]=r>=e?r-e:0}while(--n);i+=e}if(0===t.strm.avail_in)break;if(n=At(t.strm,t.window,t.strstart+t.lookahead,i),t.lookahead+=n,t.lookahead+t.insert>=3)for(s=t.strstart-t.insert,t.ins_h=t.window[s],t.ins_h=vt(t,t.ins_h,t.window[s+1]);t.insert&&(t.ins_h=vt(t,t.ins_h,t.window[s+3-1]),t.prev[s&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=s,s++,t.insert--,!(t.lookahead+t.insert<3)););}while(t.lookahead<ft&&0!==t.strm.avail_in)},Rt=(t,e)=>{let a,n;for(;;){if(t.lookahead<ft){if(Zt(t),t.lookahead<ft&&e===W)return 1;if(0===t.lookahead)break}if(a=0,t.lookahead>=3&&(t.ins_h=vt(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),0!==a&&t.strstart-a<=t.w_size-ft&&(t.match_length=Et(t,a)),t.match_length>=3)if(n=G(t,t.strstart-t.match_start,t.match_length-3),t.lookahead-=t.match_length,t.match_length<=t.max_lazy_match&&t.lookahead>=3){t.match_length--;do{t.strstart++,t.ins_h=vt(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart}while(0!=--t.match_length);t.strstart++}else t.strstart+=t.match_length,t.match_length=0,t.ins_h=t.window[t.strstart],t.ins_h=vt(t,t.ins_h,t.window[t.strstart+1]);else n=G(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++;if(n&&(zt(t,!1),0===t.strm.avail_out))return 1}return t.insert=t.strstart<2?t.strstart:2,e===Q?(zt(t,!0),0===t.strm.avail_out?3:4):t.last_lit&&(zt(t,!1),0===t.strm.avail_out)?1:2},Ut=(t,e)=>{let a,n,r;for(;;){if(t.lookahead<ft){if(Zt(t),t.lookahead<ft&&e===W)return 1;if(0===t.lookahead)break}if(a=0,t.lookahead>=3&&(t.ins_h=vt(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),t.prev_length=t.match_length,t.prev_match=t.match_start,t.match_length=2,0!==a&&t.prev_length<t.max_lazy_match&&t.strstart-a<=t.w_size-ft&&(t.match_length=Et(t,a),t.match_length<=5&&(t.strategy===it||3===t.match_length&&t.strstart-t.match_start>4096)&&(t.match_length=2)),t.prev_length>=3&&t.match_length<=t.prev_length){r=t.strstart+t.lookahead-3,n=G(t,t.strstart-1-t.prev_match,t.prev_length-3),t.lookahead-=t.prev_length-1,t.prev_length-=2;do{++t.strstart<=r&&(t.ins_h=vt(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart)}while(0!=--t.prev_length);if(t.match_available=0,t.match_length=2,t.strstart++,n&&(zt(t,!1),0===t.strm.avail_out))return 1}else if(t.match_available){if(n=G(t,0,t.window[t.strstart-1]),n&&zt(t,!1),t.strstart++,t.lookahead--,0===t.strm.avail_out)return 1}else t.match_available=1,t.strstart++,t.lookahead--}return t.match_available&&(n=G(t,0,t.window[t.strstart-1]),t.match_available=0),t.insert=t.strstart<2?t.strstart:2,e===Q?(zt(t,!0),0===t.strm.avail_out?3:4):t.last_lit&&(zt(t,!1),0===t.strm.avail_out)?1:2};function St(t,e,a,n,r){this.good_length=t,this.max_lazy=e,this.nice_length=a,this.max_chain=n,this.func=r}const Tt=[new St(0,0,0,0,(t,e)=>{let a=65535;for(a>t.pending_buf_size-5&&(a=t.pending_buf_size-5);;){if(t.lookahead<=1){if(Zt(t),0===t.lookahead&&e===W)return 1;if(0===t.lookahead)break}t.strstart+=t.lookahead,t.lookahead=0;const n=t.block_start+a;if((0===t.strstart||t.strstart>=n)&&(t.lookahead=t.strstart-n,t.strstart=n,zt(t,!1),0===t.strm.avail_out))return 1;if(t.strstart-t.block_start>=t.w_size-ft&&(zt(t,!1),0===t.strm.avail_out))return 1}return t.insert=0,e===Q?(zt(t,!0),0===t.strm.avail_out?3:4):(t.strstart>t.block_start&&(zt(t,!1),t.strm.avail_out),1)}),new St(4,4,8,4,Rt),new St(4,5,16,8,Rt),new St(4,6,32,32,Rt),new St(4,4,16,16,Ut),new St(8,16,32,32,Ut),new St(8,16,128,128,Ut),new St(8,32,128,256,Ut),new St(32,128,258,1024,Ut),new St(32,258,258,4096,Ut)];function Lt(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=dt,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new Uint16Array(1146),this.dyn_dtree=new Uint16Array(122),this.bl_tree=new Uint16Array(78),mt(this.dyn_ltree),mt(this.dyn_dtree),mt(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new Uint16Array(16),this.heap=new Uint16Array(573),mt(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new Uint16Array(573),mt(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}const Ft=t=>{if(!t||!t.state)return wt(t,et);t.total_in=t.total_out=0,t.data_type=ot;const e=t.state;return e.pending=0,e.pending_out=0,e.wrap<0&&(e.wrap=-e.wrap),e.status=e.wrap?42:pt,t.adler=2===e.wrap?0:1,e.last_flush=W,j(e),$},Ot=t=>{const e=Ft(t);var a;return e===$&&((a=t.state).window_size=2*a.w_size,mt(a.head),a.max_lazy_match=Tt[a.level].max_lazy,a.good_match=Tt[a.level].good_length,a.nice_match=Tt[a.level].nice_length,a.max_chain_length=Tt[a.level].max_chain,a.strstart=0,a.block_start=0,a.lookahead=0,a.insert=0,a.match_length=a.prev_length=2,a.match_available=0,a.ins_h=0),e},Dt=(t,e,a,n,r,i)=>{if(!t)return et;let s=1;if(e===rt&&(e=6),n<0?(s=0,n=-n):n>15&&(s=2,n-=16),r<1||r>9||a!==dt||n<8||n>15||e<0||e>9||i<0||i>lt)return wt(t,et);8===n&&(n=9);const _=new Lt;return t.state=_,_.strm=t,_.wrap=s,_.gzhead=null,_.w_bits=n,_.w_size=1<<_.w_bits,_.w_mask=_.w_size-1,_.hash_bits=r+7,_.hash_size=1<<_.hash_bits,_.hash_mask=_.hash_size-1,_.hash_shift=~~((_.hash_bits+3-1)/3),_.window=new Uint8Array(2*_.w_size),_.head=new Uint16Array(_.hash_size),_.prev=new Uint16Array(_.w_size),_.lit_bufsize=1<<r+6,_.pending_buf_size=4*_.lit_bufsize,_.pending_buf=new Uint8Array(_.pending_buf_size),_.d_buf=1*_.lit_bufsize,_.l_buf=3*_.lit_bufsize,_.level=e,_.strategy=i,_.method=a,Ot(t)};var Nt={deflateInit:(t,e)=>Dt(t,e,dt,15,8,ht),deflateInit2:Dt,deflateReset:Ot,deflateResetKeep:Ft,deflateSetHeader:(t,e)=>t&&t.state?2!==t.state.wrap?et:(t.state.gzhead=e,$):et,deflate:(t,e)=>{let a,n;if(!t||!t.state||e>V||e<0)return t?wt(t,et):et;const r=t.state;if(!t.output||!t.input&&0!==t.avail_in||r.status===gt&&e!==Q)return wt(t,0===t.avail_out?nt:et);r.strm=t;const i=r.last_flush;if(r.last_flush=e,42===r.status)if(2===r.wrap)t.adler=0,kt(r,31),kt(r,139),kt(r,8),r.gzhead?(kt(r,(r.gzhead.text?1:0)+(r.gzhead.hcrc?2:0)+(r.gzhead.extra?4:0)+(r.gzhead.name?8:0)+(r.gzhead.comment?16:0)),kt(r,255&r.gzhead.time),kt(r,r.gzhead.time>>8&255),kt(r,r.gzhead.time>>16&255),kt(r,r.gzhead.time>>24&255),kt(r,9===r.level?2:r.strategy>=st||r.level<2?4:0),kt(r,255&r.gzhead.os),r.gzhead.extra&&r.gzhead.extra.length&&(kt(r,255&r.gzhead.extra.length),kt(r,r.gzhead.extra.length>>8&255)),r.gzhead.hcrc&&(t.adler=H(t.adler,r.pending_buf,r.pending,0)),r.gzindex=0,r.status=69):(kt(r,0),kt(r,0),kt(r,0),kt(r,0),kt(r,0),kt(r,9===r.level?2:r.strategy>=st||r.level<2?4:0),kt(r,3),r.status=pt);else{let e=dt+(r.w_bits-8<<4)<<8,a=-1;a=r.strategy>=st||r.level<2?0:r.level<6?1:6===r.level?2:3,e|=a<<6,0!==r.strstart&&(e|=32),e+=31-e%31,r.status=pt,xt(r,e),0!==r.strstart&&(xt(r,t.adler>>>16),xt(r,65535&t.adler)),t.adler=1}if(69===r.status)if(r.gzhead.extra){for(a=r.pending;r.gzindex<(65535&r.gzhead.extra.length)&&(r.pending!==r.pending_buf_size||(r.gzhead.hcrc&&r.pending>a&&(t.adler=H(t.adler,r.pending_buf,r.pending-a,a)),yt(t),a=r.pending,r.pending!==r.pending_buf_size));)kt(r,255&r.gzhead.extra[r.gzindex]),r.gzindex++;r.gzhead.hcrc&&r.pending>a&&(t.adler=H(t.adler,r.pending_buf,r.pending-a,a)),r.gzindex===r.gzhead.extra.length&&(r.gzindex=0,r.status=73)}else r.status=73;if(73===r.status)if(r.gzhead.name){a=r.pending;do{if(r.pending===r.pending_buf_size&&(r.gzhead.hcrc&&r.pending>a&&(t.adler=H(t.adler,r.pending_buf,r.pending-a,a)),yt(t),a=r.pending,r.pending===r.pending_buf_size)){n=1;break}n=r.gzindex<r.gzhead.name.length?255&r.gzhead.name.charCodeAt(r.gzindex++):0,kt(r,n)}while(0!==n);r.gzhead.hcrc&&r.pending>a&&(t.adler=H(t.adler,r.pending_buf,r.pending-a,a)),0===n&&(r.gzindex=0,r.status=91)}else r.status=91;if(91===r.status)if(r.gzhead.comment){a=r.pending;do{if(r.pending===r.pending_buf_size&&(r.gzhead.hcrc&&r.pending>a&&(t.adler=H(t.adler,r.pending_buf,r.pending-a,a)),yt(t),a=r.pending,r.pending===r.pending_buf_size)){n=1;break}n=r.gzindex<r.gzhead.comment.length?255&r.gzhead.comment.charCodeAt(r.gzindex++):0,kt(r,n)}while(0!==n);r.gzhead.hcrc&&r.pending>a&&(t.adler=H(t.adler,r.pending_buf,r.pending-a,a)),0===n&&(r.status=ct)}else r.status=ct;if(r.status===ct&&(r.gzhead.hcrc?(r.pending+2>r.pending_buf_size&&yt(t),r.pending+2<=r.pending_buf_size&&(kt(r,255&t.adler),kt(r,t.adler>>8&255),t.adler=0,r.status=pt)):r.status=pt),0!==r.pending){if(yt(t),0===t.avail_out)return r.last_flush=-1,$}else if(0===t.avail_in&&bt(e)<=bt(i)&&e!==Q)return wt(t,nt);if(r.status===gt&&0!==t.avail_in)return wt(t,nt);if(0!==t.avail_in||0!==r.lookahead||e!==W&&r.status!==gt){let a=r.strategy===st?((t,e)=>{let a;for(;;){if(0===t.lookahead&&(Zt(t),0===t.lookahead)){if(e===W)return 1;break}if(t.match_length=0,a=G(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++,a&&(zt(t,!1),0===t.strm.avail_out))return 1}return t.insert=0,e===Q?(zt(t,!0),0===t.strm.avail_out?3:4):t.last_lit&&(zt(t,!1),0===t.strm.avail_out)?1:2})(r,e):r.strategy===_t?((t,e)=>{let a,n,r,i;const s=t.window;for(;;){if(t.lookahead<=ut){if(Zt(t),t.lookahead<=ut&&e===W)return 1;if(0===t.lookahead)break}if(t.match_length=0,t.lookahead>=3&&t.strstart>0&&(r=t.strstart-1,n=s[r],n===s[++r]&&n===s[++r]&&n===s[++r])){i=t.strstart+ut;do{}while(n===s[++r]&&n===s[++r]&&n===s[++r]&&n===s[++r]&&n===s[++r]&&n===s[++r]&&n===s[++r]&&n===s[++r]&&r<i);t.match_length=ut-(i-r),t.match_length>t.lookahead&&(t.match_length=t.lookahead)}if(t.match_length>=3?(a=G(t,1,t.match_length-3),t.lookahead-=t.match_length,t.strstart+=t.match_length,t.match_length=0):(a=G(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++),a&&(zt(t,!1),0===t.strm.avail_out))return 1}return t.insert=0,e===Q?(zt(t,!0),0===t.strm.avail_out?3:4):t.last_lit&&(zt(t,!1),0===t.strm.avail_out)?1:2})(r,e):Tt[r.level].func(r,e);if(3!==a&&4!==a||(r.status=gt),1===a||3===a)return 0===t.avail_out&&(r.last_flush=-1),$;if(2===a&&(e===q?X(r):e!==V&&(K(r,0,0,!1),e===J&&(mt(r.head),0===r.lookahead&&(r.strstart=0,r.block_start=0,r.insert=0))),yt(t),0===t.avail_out))return r.last_flush=-1,$}return e!==Q?$:r.wrap<=0?tt:(2===r.wrap?(kt(r,255&t.adler),kt(r,t.adler>>8&255),kt(r,t.adler>>16&255),kt(r,t.adler>>24&255),kt(r,255&t.total_in),kt(r,t.total_in>>8&255),kt(r,t.total_in>>16&255),kt(r,t.total_in>>24&255)):(xt(r,t.adler>>>16),xt(r,65535&t.adler)),yt(t),r.wrap>0&&(r.wrap=-r.wrap),0!==r.pending?$:tt)},deflateEnd:t=>{if(!t||!t.state)return et;const e=t.state.status;return 42!==e&&69!==e&&73!==e&&91!==e&&e!==ct&&e!==pt&&e!==gt?wt(t,et):(t.state=null,e===pt?wt(t,at):$)},deflateSetDictionary:(t,e)=>{let a=e.length;if(!t||!t.state)return et;const n=t.state,r=n.wrap;if(2===r||1===r&&42!==n.status||n.lookahead)return et;if(1===r&&(t.adler=C(t.adler,e,a,0)),n.wrap=0,a>=n.w_size){0===r&&(mt(n.head),n.strstart=0,n.block_start=0,n.insert=0);let t=new Uint8Array(n.w_size);t.set(e.subarray(a-n.w_size,a),0),e=t,a=n.w_size}const i=t.avail_in,s=t.next_in,_=t.input;for(t.avail_in=a,t.next_in=0,t.input=e,Zt(n);n.lookahead>=3;){let t=n.strstart,e=n.lookahead-2;do{n.ins_h=vt(n,n.ins_h,n.window[t+3-1]),n.prev[t&n.w_mask]=n.head[n.ins_h],n.head[n.ins_h]=t,t++}while(--e);n.strstart=t,n.lookahead=2,Zt(n)}return n.strstart+=n.lookahead,n.block_start=n.strstart,n.insert=n.lookahead,n.lookahead=0,n.match_length=n.prev_length=2,n.match_available=0,t.next_in=s,t.input=_,t.avail_in=i,n.wrap=r,$},deflateInfo:'pako deflate (from Nodeca project)'};const It=(t,e)=>Object.prototype.hasOwnProperty.call(t,e);var Ct=function(t){const e=Array.prototype.slice.call(arguments,1);for(;e.length;){const a=e.shift();if(a){if('object'!=typeof a)throw new TypeError(a+'must be non-object');for(const e in a)It(a,e)&&(t[e]=a[e])}}return t},Bt=t=>{let e=0;for(let a=0,n=t.length;a<n;a++)e+=t[a].length;const a=new Uint8Array(e);for(let e=0,n=0,r=t.length;e<r;e++){let r=t[e];a.set(r,n),n+=r.length}return a};let Ht=!0;try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(t){Ht=!1}const Mt=new Uint8Array(256);for(let t=0;t<256;t++)Mt[t]=t>=252?6:t>=248?5:t>=240?4:t>=224?3:t>=192?2:1;Mt[254]=Mt[254]=1;var Pt=t=>{if('function'==typeof TextEncoder&&TextEncoder.prototype.encode)return(new TextEncoder).encode(t);let e,a,n,r,i,s=t.length,_=0;for(r=0;r<s;r++)a=t.charCodeAt(r),55296==(64512&a)&&r+1<s&&(n=t.charCodeAt(r+1),56320==(64512&n)&&(a=65536+(a-55296<<10)+(n-56320),r++)),_+=a<128?1:a<2048?2:a<65536?3:4;for(e=new Uint8Array(_),i=0,r=0;i<_;r++)a=t.charCodeAt(r),55296==(64512&a)&&r+1<s&&(n=t.charCodeAt(r+1),56320==(64512&n)&&(a=65536+(a-55296<<10)+(n-56320),r++)),a<128?e[i++]=a:a<2048?(e[i++]=192|a>>>6,e[i++]=128|63&a):a<65536?(e[i++]=224|a>>>12,e[i++]=128|a>>>6&63,e[i++]=128|63&a):(e[i++]=240|a>>>18,e[i++]=128|a>>>12&63,e[i++]=128|a>>>6&63,e[i++]=128|63&a);return e};var jt=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg='',this.state=null,this.data_type=2,this.adler=0};const Kt=Object.prototype.toString,{Z_NO_FLUSH:Yt,Z_SYNC_FLUSH:Gt,Z_FULL_FLUSH:Xt,Z_FINISH:Wt,Z_OK:qt,Z_STREAM_END:Jt,Z_DEFAULT_COMPRESSION:Qt,Z_DEFAULT_STRATEGY:Vt,Z_DEFLATED:$t}=P;function te(t){this.options=Ct({level:Qt,method:$t,chunkSize:16384,windowBits:15,memLevel:8,strategy:Vt},t||{});let e=this.options;e.raw&&e.windowBits>0?e.windowBits=-e.windowBits:e.gzip&&e.windowBits>0&&e.windowBits<16&&(e.windowBits+=16),this.err=0,this.msg='',this.ended=!1,this.chunks=[],this.strm=new jt,this.strm.avail_out=0;let a=Nt.deflateInit2(this.strm,e.level,e.method,e.windowBits,e.memLevel,e.strategy);if(a!==qt)throw new Error(M[a]);if(e.header&&Nt.deflateSetHeader(this.strm,e.header),e.dictionary){let t;if(t='string'==typeof e.dictionary?Pt(e.dictionary):'[object ArrayBuffer]'===Kt.call(e.dictionary)?new Uint8Array(e.dictionary):e.dictionary,a=Nt.deflateSetDictionary(this.strm,t),a!==qt)throw new Error(M[a]);this._dict_set=!0}}function ee(t,e){const a=new te(e);if(a.push(t,!0),a.err)throw a.msg||M[a.err];return a.result}te.prototype.push=function(t,e){const a=this.strm,n=this.options.chunkSize;let r,i;if(this.ended)return!1;for(i=e===~~e?e:!0===e?Wt:Yt,'string'==typeof t?a.input=Pt(t):'[object ArrayBuffer]'===Kt.call(t)?a.input=new Uint8Array(t):a.input=t,a.next_in=0,a.avail_in=a.input.length;;)if(0===a.avail_out&&(a.output=new Uint8Array(n),a.next_out=0,a.avail_out=n),(i===Gt||i===Xt)&&a.avail_out<=6)this.onData(a.output.subarray(0,a.next_out)),a.avail_out=0;else{if(r=Nt.deflate(a,i),r===Jt)return a.next_out>0&&this.onData(a.output.subarray(0,a.next_out)),r=Nt.deflateEnd(this.strm),this.onEnd(r),this.ended=!0,r===qt;if(0!==a.avail_out){if(i>0&&a.next_out>0)this.onData(a.output.subarray(0,a.next_out)),a.avail_out=0;else if(0===a.avail_in)break}else this.onData(a.output)}return!0},te.prototype.onData=function(t){this.chunks.push(t)},te.prototype.onEnd=function(t){t===qt&&(this.result=Bt(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg};var ae=te,ne=ee,re=function(t,e){return(e=e||{}).raw=!0,ee(t,e)},ie=function(t,e){return(e=e||{}).gzip=!0,ee(t,e)},se=P,_e={Deflate:ae,deflate:ne,deflateRaw:re,gzip:ie,constants:se};t.Deflate=ae,t.constants=se,t.default=_e,t.deflate=ne,t.deflateRaw=re,t.gzip=ie,Object.defineProperty(t,'__esModule',{value:!0})});self.addEventListener('message',e=>{const files=[];e.data.files.forEach(file=>{if(file.size<1e3)e.data.compress=false;let content;if(e.data.compress)content=pako.gzip((new FileReaderSync).readAsArrayBuffer(file),{level:1});else content=(new FileReaderSync).readAsArrayBuffer(file);files.push({filename:file.name,orig_size:file.size,compressed:e.data.compress,content:new Blob([content])})});self.postMessage(files)},false);";

	let worker;

	function getWorker() {
		if(worker) {
			console.log('kupload.getWorker() reuse the worker');
			return worker;
		}

		console.log('kupload.getWorker() init a new worker');

		let worker_blob;

		try {
			worker_blob = new Blob([WORKER_INLINE_SCRIPT], {type: 'application/javascript'});
		} catch (e) {
			window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
			worker_blob = new BlobBuilder();
			worker_blob.append(WORKER_INLINE_SCRIPT);
			worker_blob = worker_blob.getBlob();
		}

		return worker = new Worker((window.URL || window.webkitURL).createObjectURL(worker_blob));
	}

	return {
		VERSION,
		getWorker
	}
}();

Element.prototype.kupload = function(opt) {
	console.log('Element.prototype.kupload()', opt);

	const acm = 'kupload_canceled';

	let zone = this,
	input = zone.querySelector('input[type=file]'),
	dragover = 0,
	upload_in_progress = false,
	ajax_cancel_source;

	if(!opt) opt = {};
	if(!opt.url) throw 'URL is mandatory';
	if(!opt.headers) opt.headers = {};
	if(!opt.max_files) opt.max_files = 1;
	if(!opt.compress) opt.compress = false;
	if(!opt.timeout) opt.timeout = 0;
	if(!opt.max_files_size) opt.max_files_size = 20971520;
	if(!opt.kill_document_dad) opt.kill_document_dad = false;
	if(!opt.onDragEnter) opt.onDragEnter = null;
	if(!opt.onDragLeave) opt.onDragLeave = null;
	if(!opt.onNewFiles) opt.onNewFiles = null;
	if(!opt.onFileSizeError) opt.onFileSizeError = null;
	if(!opt.onTooManyFiles) opt.onTooManyFiles = null;
	if(!opt.onBeforeUpload) opt.onBeforeUpload = null;
	if(!opt.onUploadProgress) opt.onUploadProgress = null;
	if(!opt.onUploadComplete) opt.onUploadComplete = null;
	if(!opt.onUploadSuccess) opt.onUploadSuccess = null;
	if(!opt.onUploadError) opt.onUploadError = null;
	if(!opt.onAjaxComplete) opt.onAjaxComplete = null;

	if(opt.max_files > 1) input.setAttribute('multiple', '');
	else input.removeAttribute('multiple');

	kupload.getWorker().addEventListener('message', onWorkerMessage, false);
	zone.addEventListener('click', onClick);
	input.addEventListener('change', onInputChange);
	zone.addEventListener('drop', onDrop);
	zone.addEventListener('dragenter', onDragEnter);
	zone.addEventListener('dragover', onDragOver);
	zone.addEventListener('dragleave', onDragLeave);

	if(opt.kill_document_dad) {
		document.addEventListener('drag', onKillDad);
		document.addEventListener('dragstart', onKillDad);
		document.addEventListener('dragend', onKillDad);
		document.addEventListener('dragenter', onKillDad);
		document.addEventListener('dragover', onKillDad);
		document.addEventListener('dragleave', onKillDad);
		document.addEventListener('drop', onKillDad);
	}

	function onWorkerMessage(e) {
		console.log('kupload.onWorkerMessage()', e);
		upload(e.data);
	}

	function onClick(e) {
		console.log('kupload.onClick()', e);
		if(!upload_in_progress) return;
		e.stopPropagation();
		e.preventDefault();
	}

	function onInputChange(e) {
		console.log('kupload.onInputChange()', e);
		if(upload_in_progress) return;

		// Files
		if(!e.target || !e.target.files || !e.target.files.length) return;

		// Process files
		processFiles(e.target.files);

		// Reset input
		this.value = '';
	}

	function onDrop(e) {
		console.log('kupload.onDrop()', e);
		e.stopPropagation();
		e.preventDefault();
		if(upload_in_progress) return;

		// Drag leave
		if(dragover > 0) {
			dragover = 0;
			if(opt.onDragLeave) opt.onDragLeave.call();
		}

		// Files
		if (!e.dataTransfer || !e.dataTransfer.files || !e.dataTransfer.files.length) return;

		// Process files
		processFiles(e.dataTransfer.files);
	}

	function onDragEnter(e) {
		console.log('kupload.onDragEnter()', e);
		e.stopPropagation();
		e.preventDefault();
		if(upload_in_progress) return;

		if(opt.onDragEnter && dragover == 0) opt.onDragEnter.call();
		dragover++;
	}

	function onDragOver(e) {
		//console.log('kupload.onDragOver()', e);
		e.stopPropagation();
		e.preventDefault();
	}

	function onDragLeave(e) {
		console.log('kupload.onDragLeave()', e);
		e.stopPropagation();
		e.preventDefault();
		if(upload_in_progress) return;

		dragover--;
		if(opt.onDragLeave && dragover == 0) opt.onDragLeave.call();
	}

	function onKillDad(e) {
		//console.log('kupload.onKillDad()', e);
		e.stopPropagation();
		e.preventDefault();
		return false;
	}

	function processFiles(files) {
		console.log('kupload.processFiles()', files);

		// Upload in progress
		upload_in_progress = true;

		// Callback
		if(opt.onNewFiles) opt.onNewFiles.call(this, files);

		// Check if too many files
		if(files.length > opt.max_files) {
			if(opt.onTooManyFiles) opt.onTooManyFiles.call();
			upload_in_progress = false;
			return;
		}

		// Vars
		const files_to_read = [];
		let total_size = 0;

		// For each files
		for(let i in files) {
			// Must be an object
			if(typeof files[i] !== 'object') continue;

			// If files are too big
			total_size += files[i].size;
			if(files[i].size > opt.max_files_size || total_size > opt.max_files_size) {
				if(opt.onFileSizeError) opt.onFileSizeError.call();
				upload_in_progress = false;
				return;
			}

			// Push the file to the array
			files_to_read.push(files[i]);
		}

		// Callback
		if(opt.onBeforeUpload) opt.onBeforeUpload.call();

		// Send files to the worker
		kupload.getWorker().postMessage({
			compress: opt.compress,
			files: files_to_read
		});
	}

	function cancelAjax() {
		console.log('kupload.cancelAjax()');
		if(ajax_cancel_source == null) return;
		ajax_cancel_source.cancel(acm);
		ajax_cancel_source = null;
	}

	function genCancelToken() {
		console.log('kupload.genCancelToken()');
		cancelAjax();
		ajax_cancel_source = axios.CancelToken.source();
		return ajax_cancel_source.token;
	}

	function upload(files) {
		console.log('kupload.upload()', files);

		// Callback
		if(opt.onUploadProgress) opt.onUploadProgress.call(this, 0);

		// Create form data
		let fd = new FormData();
		fd.append('nb_files', files.length);
		files.forEach((file, i) => {
			fd.append('file_' + i, file.content);
			fd.append('file_' + i + '_name', file.filename);
			fd.append('file_' + i + '_orig_size', file.orig_size);
			fd.append('file_' + i + '_compressed', file.compressed);
		});

		// Form data header
		opt.headers['Content-Type'] = 'multipart/form-data';

		// Upload
		axios.post(opt.url, fd, {
			timeout: opt.timeout,
			headers: opt.headers,
			onUploadProgress: onUploadProgress,
			cancelToken: genCancelToken()
		})
		.then(res => {
			console.log('kupload.upload() success()', res);
			if(opt.onUploadSuccess) opt.onUploadSuccess.call(this, res);
		})
		.catch(error => {
			console.log('kupload.upload() error()', error);
			if(error.message && error.message == acm) return;
			if(opt.onUploadError) opt.onUploadError.call(this, error);
		})
		.then(() => {
			console.log('kupload.upload() always()');
			if(opt.onAjaxComplete) opt.onAjaxComplete.call();
			upload_in_progress = false;
		});
	}

	function onUploadProgress(e) {
		console.log('kupload.onUploadProgress()', e);
		if(typeof e === 'undefined' || !e.lengthComputable) return;
		let pourcent = Math.floor((e.loaded * 100)/e.total);
		if(opt.onUploadProgress) opt.onUploadProgress.call(this, pourcent);
		if(pourcent >= 100 && opt.onUploadComplete) opt.onUploadComplete.call();
	}

	function destroy() {
		console.log('Element.prototype.kupload.destroy()');

		kupload.getWorker().removeEventListener('message', onWorkerMessage, false);
		zone.removeEventListener('click', onClick);
		input.removeEventListener('change', onInputChange);
		zone.removeEventListener('drop', onDrop);
		zone.removeEventListener('dragenter', onDragEnter);
		zone.removeEventListener('dragover', onDragOver);
		zone.removeEventListener('dragleave', onDragLeave);

		if(opt.kill_document_dad) {
			document.removeEventListener('drag', onKillDad);
			document.removeEventListener('dragstart', onKillDad);
			document.removeEventListener('dragend', onKillDad);
			document.removeEventListener('dragenter', onKillDad);
			document.removeEventListener('dragover', onKillDad);
			document.removeEventListener('dragleave', onKillDad);
			document.removeEventListener('drop', onKillDad);
		}

		cancelAjax();
	}

	return {
		opt,
		upload_in_progress,
		cancelAjax,
		destroy
	};
};
