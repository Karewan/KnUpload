/**
 * kupload v2.0.1 (2021-10-16 15:30:39 +0200)
 * Copyright (c) 2019-2021 Florent VIALATTE
 * Released under the MIT license
 */

'use strict';

const kupload = function() {
	const VERSION = '2.0.1',
	WORKER_INLINE_SCRIPT = "'use strict';!function(t,e){'object'==typeof exports&&'undefined'!=typeof module?e(exports):'function'==typeof define&&define.amd?define(['exports'],e):e((t='undefined'!=typeof globalThis?globalThis:t||self).pako={})}(this,(function(t){function e(t){let e=t.length;for(;--e>=0;)t[e]=0}const a=new Uint8Array([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0]),n=new Uint8Array([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13]),r=new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7]),s=new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),i=new Array(576);e(i);const _=new Array(60);e(_);const l=new Array(512);e(l);const h=new Array(256);e(h);const o=new Array(29);e(o);const d=new Array(30);function u(t,e,a,n,r){this.static_tree=t,this.extra_bits=e,this.extra_base=a,this.elems=n,this.max_length=r,this.has_stree=t&&t.length}let f,c,p;function g(t,e){this.dyn_tree=t,this.max_code=0,this.stat_desc=e}e(d);const w=t=>t<256?l[t]:l[256+(t>>>7)],b=(t,e)=>{t.pending_buf[t.pending++]=255&e,t.pending_buf[t.pending++]=e>>>8&255},m=(t,e,a)=>{t.bi_valid>16-a?(t.bi_buf|=e<<t.bi_valid&65535,b(t,t.bi_buf),t.bi_buf=e>>16-t.bi_valid,t.bi_valid+=a-16):(t.bi_buf|=e<<t.bi_valid&65535,t.bi_valid+=a)},v=(t,e,a)=>{m(t,a[2*e],a[2*e+1])},y=(t,e)=>{let a=0;do{a|=1&t,t>>>=1,a<<=1}while(--e>0);return a>>>1},z=(t,e,a)=>{const n=new Array(16);let r,s,i=0;for(r=1;r<=15;r++)n[r]=i=i+a[r-1]<<1;for(s=0;s<=e;s++){let e=t[2*s+1];0!==e&&(t[2*s]=y(n[e]++,e))}},k=t=>{let e;for(e=0;e<286;e++)t.dyn_ltree[2*e]=0;for(e=0;e<30;e++)t.dyn_dtree[2*e]=0;for(e=0;e<19;e++)t.bl_tree[2*e]=0;t.dyn_ltree[512]=1,t.opt_len=t.static_len=0,t.last_lit=t.matches=0},x=t=>{t.bi_valid>8?b(t,t.bi_buf):t.bi_valid>0&&(t.pending_buf[t.pending++]=t.bi_buf),t.bi_buf=0,t.bi_valid=0},A=(t,e,a,n)=>{const r=2*e,s=2*a;return t[r]<t[s]||t[r]===t[s]&&n[e]<=n[a]},E=(t,e,a)=>{const n=t.heap[a];let r=a<<1;for(;r<=t.heap_len&&(r<t.heap_len&&A(e,t.heap[r+1],t.heap[r],t.depth)&&r++,!A(e,n,t.heap[r],t.depth));)t.heap[a]=t.heap[r],a=r,r<<=1;t.heap[a]=n},Z=(t,e,r)=>{let s,i,_,l,u=0;if(0!==t.last_lit)do{s=t.pending_buf[t.d_buf+2*u]<<8|t.pending_buf[t.d_buf+2*u+1],i=t.pending_buf[t.l_buf+u],u++,0===s?v(t,i,e):(_=h[i],v(t,_+256+1,e),l=a[_],0!==l&&(i-=o[_],m(t,i,l)),s--,_=w(s),v(t,_,r),l=n[_],0!==l&&(s-=d[_],m(t,s,l)))}while(u<t.last_lit);v(t,256,e)},R=(t,e)=>{const a=e.dyn_tree,n=e.stat_desc.static_tree,r=e.stat_desc.has_stree,s=e.stat_desc.elems;let i,_,l,h=-1;for(t.heap_len=0,t.heap_max=573,i=0;i<s;i++)0!==a[2*i]?(t.heap[++t.heap_len]=h=i,t.depth[i]=0):a[2*i+1]=0;for(;t.heap_len<2;)l=t.heap[++t.heap_len]=h<2?++h:0,a[2*l]=1,t.depth[l]=0,t.opt_len--,r&&(t.static_len-=n[2*l+1]);for(e.max_code=h,i=t.heap_len>>1;i>=1;i--)E(t,a,i);l=s;do{i=t.heap[1],t.heap[1]=t.heap[t.heap_len--],E(t,a,1),_=t.heap[1],t.heap[--t.heap_max]=i,t.heap[--t.heap_max]=_,a[2*l]=a[2*i]+a[2*_],t.depth[l]=(t.depth[i]>=t.depth[_]?t.depth[i]:t.depth[_])+1,a[2*i+1]=a[2*_+1]=l,t.heap[1]=l++,E(t,a,1)}while(t.heap_len>=2);t.heap[--t.heap_max]=t.heap[1],((t,e)=>{const a=e.dyn_tree,n=e.max_code,r=e.stat_desc.static_tree,s=e.stat_desc.has_stree,i=e.stat_desc.extra_bits,_=e.stat_desc.extra_base,l=e.stat_desc.max_length;let h,o,d,u,f,c,p=0;for(u=0;u<=15;u++)t.bl_count[u]=0;for(a[2*t.heap[t.heap_max]+1]=0,h=t.heap_max+1;h<573;h++)o=t.heap[h],u=a[2*a[2*o+1]+1]+1,u>l&&(u=l,p++),a[2*o+1]=u,o>n||(t.bl_count[u]++,f=0,o>=_&&(f=i[o-_]),c=a[2*o],t.opt_len+=c*(u+f),s&&(t.static_len+=c*(r[2*o+1]+f)));if(0!==p){do{for(u=l-1;0===t.bl_count[u];)u--;t.bl_count[u]--,t.bl_count[u+1]+=2,t.bl_count[l]--,p-=2}while(p>0);for(u=l;0!==u;u--)for(o=t.bl_count[u];0!==o;)d=t.heap[--h],d>n||(a[2*d+1]!==u&&(t.opt_len+=(u-a[2*d+1])*a[2*d],a[2*d+1]=u),o--)}})(t,e),z(a,h,t.bl_count)},U=(t,e,a)=>{let n,r,s=-1,i=e[1],_=0,l=7,h=4;for(0===i&&(l=138,h=3),e[2*(a+1)+1]=65535,n=0;n<=a;n++)r=i,i=e[2*(n+1)+1],++_<l&&r===i||(_<h?t.bl_tree[2*r]+=_:0!==r?(r!==s&&t.bl_tree[2*r]++,t.bl_tree[32]++):_<=10?t.bl_tree[34]++:t.bl_tree[36]++,_=0,s=r,0===i?(l=138,h=3):r===i?(l=6,h=3):(l=7,h=4))},S=(t,e,a)=>{let n,r,s=-1,i=e[1],_=0,l=7,h=4;for(0===i&&(l=138,h=3),n=0;n<=a;n++)if(r=i,i=e[2*(n+1)+1],!(++_<l&&r===i)){if(_<h)do{v(t,r,t.bl_tree)}while(0!=--_);else 0!==r?(r!==s&&(v(t,r,t.bl_tree),_--),v(t,16,t.bl_tree),m(t,_-3,2)):_<=10?(v(t,17,t.bl_tree),m(t,_-3,3)):(v(t,18,t.bl_tree),m(t,_-11,7));_=0,s=r,0===i?(l=138,h=3):r===i?(l=6,h=3):(l=7,h=4)}};let L=!1;const T=(t,e,a,n)=>{m(t,0+(n?1:0),3),((t,e,a,n)=>{x(t),b(t,a),b(t,~a),t.pending_buf.set(t.window.subarray(e,e+a),t.pending),t.pending+=a})(t,e,a)};var F={_tr_init:t=>{L||((()=>{let t,e,s,g,w;const b=new Array(16);for(s=0,g=0;g<28;g++)for(o[g]=s,t=0;t<1<<a[g];t++)h[s++]=g;for(h[s-1]=g,w=0,g=0;g<16;g++)for(d[g]=w,t=0;t<1<<n[g];t++)l[w++]=g;for(w>>=7;g<30;g++)for(d[g]=w<<7,t=0;t<1<<n[g]-7;t++)l[256+w++]=g;for(e=0;e<=15;e++)b[e]=0;for(t=0;t<=143;)i[2*t+1]=8,t++,b[8]++;for(;t<=255;)i[2*t+1]=9,t++,b[9]++;for(;t<=279;)i[2*t+1]=7,t++,b[7]++;for(;t<=287;)i[2*t+1]=8,t++,b[8]++;for(z(i,287,b),t=0;t<30;t++)_[2*t+1]=5,_[2*t]=y(t,5);f=new u(i,a,257,286,15),c=new u(_,n,0,30,15),p=new u(new Array(0),r,0,19,7)})(),L=!0),t.l_desc=new g(t.dyn_ltree,f),t.d_desc=new g(t.dyn_dtree,c),t.bl_desc=new g(t.bl_tree,p),t.bi_buf=0,t.bi_valid=0,k(t)},_tr_stored_block:T,_tr_flush_block:(t,e,a,n)=>{let r,l,h=0;t.level>0?(2===t.strm.data_type&&(t.strm.data_type=(t=>{let e,a=4093624447;for(e=0;e<=31;e++,a>>>=1)if(1&a&&0!==t.dyn_ltree[2*e])return 0;if(0!==t.dyn_ltree[18]||0!==t.dyn_ltree[20]||0!==t.dyn_ltree[26])return 1;for(e=32;e<256;e++)if(0!==t.dyn_ltree[2*e])return 1;return 0})(t)),R(t,t.l_desc),R(t,t.d_desc),h=(t=>{let e;for(U(t,t.dyn_ltree,t.l_desc.max_code),U(t,t.dyn_dtree,t.d_desc.max_code),R(t,t.bl_desc),e=18;e>=3&&0===t.bl_tree[2*s[e]+1];e--);return t.opt_len+=3*(e+1)+5+5+4,e})(t),r=t.opt_len+3+7>>>3,l=t.static_len+3+7>>>3,l<=r&&(r=l)):r=l=a+5,a+4<=r&&-1!==e?T(t,e,a,n):4===t.strategy||l===r?(m(t,2+(n?1:0),3),Z(t,i,_)):(m(t,4+(n?1:0),3),((t,e,a,n)=>{let r;for(m(t,e-257,5),m(t,a-1,5),m(t,n-4,4),r=0;r<n;r++)m(t,t.bl_tree[2*s[r]+1],3);S(t,t.dyn_ltree,e-1),S(t,t.dyn_dtree,a-1)})(t,t.l_desc.max_code+1,t.d_desc.max_code+1,h+1),Z(t,t.dyn_ltree,t.dyn_dtree)),k(t),n&&x(t)},_tr_tally:(t,e,a)=>(t.pending_buf[t.d_buf+2*t.last_lit]=e>>>8&255,t.pending_buf[t.d_buf+2*t.last_lit+1]=255&e,t.pending_buf[t.l_buf+t.last_lit]=255&a,t.last_lit++,0===e?t.dyn_ltree[2*a]++:(t.matches++,e--,t.dyn_ltree[2*(h[a]+256+1)]++,t.dyn_dtree[2*w(e)]++),t.last_lit===t.lit_bufsize-1),_tr_align:t=>{m(t,2,3),v(t,256,i),(t=>{16===t.bi_valid?(b(t,t.bi_buf),t.bi_buf=0,t.bi_valid=0):t.bi_valid>=8&&(t.pending_buf[t.pending++]=255&t.bi_buf,t.bi_buf>>=8,t.bi_valid-=8)})(t)}},O=(t,e,a,n)=>{let r=65535&t|0,s=t>>>16&65535|0,i=0;for(;0!==a;){i=a>2e3?2e3:a,a-=i;do{r=r+e[n++]|0,s=s+r|0}while(--i);r%=65521,s%=65521}return r|s<<16|0};const D=new Uint32Array((()=>{let t,e=[];for(var a=0;a<256;a++){t=a;for(var n=0;n<8;n++)t=1&t?3988292384^t>>>1:t>>>1;e[a]=t}return e})());var N=(t,e,a,n)=>{const r=D,s=n+a;t^=-1;for(let a=n;a<s;a++)t=t>>>8^r[255&(t^e[a])];return-1^t},B={2:'need dictionary',1:'stream end',0:'','-1':'file error','-2':'stream error','-3':'data error','-4':'insufficient memory','-5':'buffer error','-6':'incompatible version'},I={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_MEM_ERROR:-4,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8};const{_tr_init:C,_tr_stored_block:M,_tr_flush_block:H,_tr_tally:P,_tr_align:j}=F,{Z_NO_FLUSH:Y,Z_PARTIAL_FLUSH:K,Z_FULL_FLUSH:G,Z_FINISH:X,Z_BLOCK:W,Z_OK:q,Z_STREAM_END:J,Z_STREAM_ERROR:Q,Z_DATA_ERROR:V,Z_BUF_ERROR:$,Z_DEFAULT_COMPRESSION:tt,Z_FILTERED:et,Z_HUFFMAN_ONLY:at,Z_RLE:nt,Z_FIXED:rt,Z_DEFAULT_STRATEGY:st,Z_UNKNOWN:it,Z_DEFLATED:_t}=I,lt=258,ht=262,ot=103,dt=113,ut=666,ft=(t,e)=>(t.msg=B[e],e),ct=t=>(t<<1)-(t>4?9:0),pt=t=>{let e=t.length;for(;--e>=0;)t[e]=0};let gt=(t,e,a)=>(e<<t.hash_shift^a)&t.hash_mask;const wt=t=>{const e=t.state;let a=e.pending;a>t.avail_out&&(a=t.avail_out),0!==a&&(t.output.set(e.pending_buf.subarray(e.pending_out,e.pending_out+a),t.next_out),t.next_out+=a,e.pending_out+=a,t.total_out+=a,t.avail_out-=a,e.pending-=a,0===e.pending&&(e.pending_out=0))},bt=(t,e)=>{H(t,t.block_start>=0?t.block_start:-1,t.strstart-t.block_start,e),t.block_start=t.strstart,wt(t.strm)},mt=(t,e)=>{t.pending_buf[t.pending++]=e},vt=(t,e)=>{t.pending_buf[t.pending++]=e>>>8&255,t.pending_buf[t.pending++]=255&e},yt=(t,e,a,n)=>{let r=t.avail_in;return r>n&&(r=n),0===r?0:(t.avail_in-=r,e.set(t.input.subarray(t.next_in,t.next_in+r),a),1===t.state.wrap?t.adler=O(t.adler,e,r,a):2===t.state.wrap&&(t.adler=N(t.adler,e,r,a)),t.next_in+=r,t.total_in+=r,r)},zt=(t,e)=>{let a,n,r=t.max_chain_length,s=t.strstart,i=t.prev_length,_=t.nice_match;const l=t.strstart>t.w_size-ht?t.strstart-(t.w_size-ht):0,h=t.window,o=t.w_mask,d=t.prev,u=t.strstart+lt;let f=h[s+i-1],c=h[s+i];t.prev_length>=t.good_match&&(r>>=2),_>t.lookahead&&(_=t.lookahead);do{if(a=e,h[a+i]===c&&h[a+i-1]===f&&h[a]===h[s]&&h[++a]===h[s+1]){s+=2,a++;do{}while(h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&s<u);if(n=lt-(u-s),s=u-lt,n>i){if(t.match_start=e,i=n,n>=_)break;f=h[s+i-1],c=h[s+i]}}}while((e=d[e&o])>l&&0!=--r);return i<=t.lookahead?i:t.lookahead},kt=t=>{const e=t.w_size;let a,n,r,s,i;do{if(s=t.window_size-t.lookahead-t.strstart,t.strstart>=e+(e-ht)){t.window.set(t.window.subarray(e,e+e),0),t.match_start-=e,t.strstart-=e,t.block_start-=e,n=t.hash_size,a=n;do{r=t.head[--a],t.head[a]=r>=e?r-e:0}while(--n);n=e,a=n;do{r=t.prev[--a],t.prev[a]=r>=e?r-e:0}while(--n);s+=e}if(0===t.strm.avail_in)break;if(n=yt(t.strm,t.window,t.strstart+t.lookahead,s),t.lookahead+=n,t.lookahead+t.insert>=3)for(i=t.strstart-t.insert,t.ins_h=t.window[i],t.ins_h=gt(t,t.ins_h,t.window[i+1]);t.insert&&(t.ins_h=gt(t,t.ins_h,t.window[i+3-1]),t.prev[i&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=i,i++,t.insert--,!(t.lookahead+t.insert<3)););}while(t.lookahead<ht&&0!==t.strm.avail_in)},xt=(t,e)=>{let a,n;for(;;){if(t.lookahead<ht){if(kt(t),t.lookahead<ht&&e===Y)return 1;if(0===t.lookahead)break}if(a=0,t.lookahead>=3&&(t.ins_h=gt(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),0!==a&&t.strstart-a<=t.w_size-ht&&(t.match_length=zt(t,a)),t.match_length>=3)if(n=P(t,t.strstart-t.match_start,t.match_length-3),t.lookahead-=t.match_length,t.match_length<=t.max_lazy_match&&t.lookahead>=3){t.match_length--;do{t.strstart++,t.ins_h=gt(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart}while(0!=--t.match_length);t.strstart++}else t.strstart+=t.match_length,t.match_length=0,t.ins_h=t.window[t.strstart],t.ins_h=gt(t,t.ins_h,t.window[t.strstart+1]);else n=P(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++;if(n&&(bt(t,!1),0===t.strm.avail_out))return 1}return t.insert=t.strstart<2?t.strstart:2,e===X?(bt(t,!0),0===t.strm.avail_out?3:4):t.last_lit&&(bt(t,!1),0===t.strm.avail_out)?1:2},At=(t,e)=>{let a,n,r;for(;;){if(t.lookahead<ht){if(kt(t),t.lookahead<ht&&e===Y)return 1;if(0===t.lookahead)break}if(a=0,t.lookahead>=3&&(t.ins_h=gt(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),t.prev_length=t.match_length,t.prev_match=t.match_start,t.match_length=2,0!==a&&t.prev_length<t.max_lazy_match&&t.strstart-a<=t.w_size-ht&&(t.match_length=zt(t,a),t.match_length<=5&&(t.strategy===et||3===t.match_length&&t.strstart-t.match_start>4096)&&(t.match_length=2)),t.prev_length>=3&&t.match_length<=t.prev_length){r=t.strstart+t.lookahead-3,n=P(t,t.strstart-1-t.prev_match,t.prev_length-3),t.lookahead-=t.prev_length-1,t.prev_length-=2;do{++t.strstart<=r&&(t.ins_h=gt(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart)}while(0!=--t.prev_length);if(t.match_available=0,t.match_length=2,t.strstart++,n&&(bt(t,!1),0===t.strm.avail_out))return 1}else if(t.match_available){if(n=P(t,0,t.window[t.strstart-1]),n&&bt(t,!1),t.strstart++,t.lookahead--,0===t.strm.avail_out)return 1}else t.match_available=1,t.strstart++,t.lookahead--}return t.match_available&&(n=P(t,0,t.window[t.strstart-1]),t.match_available=0),t.insert=t.strstart<2?t.strstart:2,e===X?(bt(t,!0),0===t.strm.avail_out?3:4):t.last_lit&&(bt(t,!1),0===t.strm.avail_out)?1:2};function Et(t,e,a,n,r){this.good_length=t,this.max_lazy=e,this.nice_length=a,this.max_chain=n,this.func=r}const Zt=[new Et(0,0,0,0,((t,e)=>{let a=65535;for(a>t.pending_buf_size-5&&(a=t.pending_buf_size-5);;){if(t.lookahead<=1){if(kt(t),0===t.lookahead&&e===Y)return 1;if(0===t.lookahead)break}t.strstart+=t.lookahead,t.lookahead=0;const n=t.block_start+a;if((0===t.strstart||t.strstart>=n)&&(t.lookahead=t.strstart-n,t.strstart=n,bt(t,!1),0===t.strm.avail_out))return 1;if(t.strstart-t.block_start>=t.w_size-ht&&(bt(t,!1),0===t.strm.avail_out))return 1}return t.insert=0,e===X?(bt(t,!0),0===t.strm.avail_out?3:4):(t.strstart>t.block_start&&(bt(t,!1),t.strm.avail_out),1)})),new Et(4,4,8,4,xt),new Et(4,5,16,8,xt),new Et(4,6,32,32,xt),new Et(4,4,16,16,At),new Et(8,16,32,32,At),new Et(8,16,128,128,At),new Et(8,32,128,256,At),new Et(32,128,258,1024,At),new Et(32,258,258,4096,At)];function Rt(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=_t,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new Uint16Array(1146),this.dyn_dtree=new Uint16Array(122),this.bl_tree=new Uint16Array(78),pt(this.dyn_ltree),pt(this.dyn_dtree),pt(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new Uint16Array(16),this.heap=new Uint16Array(573),pt(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new Uint16Array(573),pt(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}const Ut=t=>{const e=(t=>{if(!t||!t.state)return ft(t,Q);t.total_in=t.total_out=0,t.data_type=it;const e=t.state;return e.pending=0,e.pending_out=0,e.wrap<0&&(e.wrap=-e.wrap),e.status=e.wrap?42:dt,t.adler=2===e.wrap?0:1,e.last_flush=Y,C(e),q})(t);var a;return e===q&&((a=t.state).window_size=2*a.w_size,pt(a.head),a.max_lazy_match=Zt[a.level].max_lazy,a.good_match=Zt[a.level].good_length,a.nice_match=Zt[a.level].nice_length,a.max_chain_length=Zt[a.level].max_chain,a.strstart=0,a.block_start=0,a.lookahead=0,a.insert=0,a.match_length=a.prev_length=2,a.match_available=0,a.ins_h=0),e};var St=(t,e,a,n,r,s)=>{if(!t)return Q;let i=1;if(e===tt&&(e=6),n<0?(i=0,n=-n):n>15&&(i=2,n-=16),r<1||r>9||a!==_t||n<8||n>15||e<0||e>9||s<0||s>rt)return ft(t,Q);8===n&&(n=9);const _=new Rt;return t.state=_,_.strm=t,_.wrap=i,_.gzhead=null,_.w_bits=n,_.w_size=1<<_.w_bits,_.w_mask=_.w_size-1,_.hash_bits=r+7,_.hash_size=1<<_.hash_bits,_.hash_mask=_.hash_size-1,_.hash_shift=~~((_.hash_bits+3-1)/3),_.window=new Uint8Array(2*_.w_size),_.head=new Uint16Array(_.hash_size),_.prev=new Uint16Array(_.w_size),_.lit_bufsize=1<<r+6,_.pending_buf_size=4*_.lit_bufsize,_.pending_buf=new Uint8Array(_.pending_buf_size),_.d_buf=1*_.lit_bufsize,_.l_buf=3*_.lit_bufsize,_.level=e,_.strategy=s,_.method=a,Ut(t)},Lt=(t,e)=>{let a,n;if(!t||!t.state||e>W||e<0)return t?ft(t,Q):Q;const r=t.state;if(!t.output||!t.input&&0!==t.avail_in||r.status===ut&&e!==X)return ft(t,0===t.avail_out?$:Q);r.strm=t;const s=r.last_flush;if(r.last_flush=e,42===r.status)if(2===r.wrap)t.adler=0,mt(r,31),mt(r,139),mt(r,8),r.gzhead?(mt(r,(r.gzhead.text?1:0)+(r.gzhead.hcrc?2:0)+(r.gzhead.extra?4:0)+(r.gzhead.name?8:0)+(r.gzhead.comment?16:0)),mt(r,255&r.gzhead.time),mt(r,r.gzhead.time>>8&255),mt(r,r.gzhead.time>>16&255),mt(r,r.gzhead.time>>24&255),mt(r,9===r.level?2:r.strategy>=at||r.level<2?4:0),mt(r,255&r.gzhead.os),r.gzhead.extra&&r.gzhead.extra.length&&(mt(r,255&r.gzhead.extra.length),mt(r,r.gzhead.extra.length>>8&255)),r.gzhead.hcrc&&(t.adler=N(t.adler,r.pending_buf,r.pending,0)),r.gzindex=0,r.status=69):(mt(r,0),mt(r,0),mt(r,0),mt(r,0),mt(r,0),mt(r,9===r.level?2:r.strategy>=at||r.level<2?4:0),mt(r,3),r.status=dt);else{let e=_t+(r.w_bits-8<<4)<<8,a=-1;a=r.strategy>=at||r.level<2?0:r.level<6?1:6===r.level?2:3,e|=a<<6,0!==r.strstart&&(e|=32),e+=31-e%31,r.status=dt,vt(r,e),0!==r.strstart&&(vt(r,t.adler>>>16),vt(r,65535&t.adler)),t.adler=1}if(69===r.status)if(r.gzhead.extra){for(a=r.pending;r.gzindex<(65535&r.gzhead.extra.length)&&(r.pending!==r.pending_buf_size||(r.gzhead.hcrc&&r.pending>a&&(t.adler=N(t.adler,r.pending_buf,r.pending-a,a)),wt(t),a=r.pending,r.pending!==r.pending_buf_size));)mt(r,255&r.gzhead.extra[r.gzindex]),r.gzindex++;r.gzhead.hcrc&&r.pending>a&&(t.adler=N(t.adler,r.pending_buf,r.pending-a,a)),r.gzindex===r.gzhead.extra.length&&(r.gzindex=0,r.status=73)}else r.status=73;if(73===r.status)if(r.gzhead.name){a=r.pending;do{if(r.pending===r.pending_buf_size&&(r.gzhead.hcrc&&r.pending>a&&(t.adler=N(t.adler,r.pending_buf,r.pending-a,a)),wt(t),a=r.pending,r.pending===r.pending_buf_size)){n=1;break}n=r.gzindex<r.gzhead.name.length?255&r.gzhead.name.charCodeAt(r.gzindex++):0,mt(r,n)}while(0!==n);r.gzhead.hcrc&&r.pending>a&&(t.adler=N(t.adler,r.pending_buf,r.pending-a,a)),0===n&&(r.gzindex=0,r.status=91)}else r.status=91;if(91===r.status)if(r.gzhead.comment){a=r.pending;do{if(r.pending===r.pending_buf_size&&(r.gzhead.hcrc&&r.pending>a&&(t.adler=N(t.adler,r.pending_buf,r.pending-a,a)),wt(t),a=r.pending,r.pending===r.pending_buf_size)){n=1;break}n=r.gzindex<r.gzhead.comment.length?255&r.gzhead.comment.charCodeAt(r.gzindex++):0,mt(r,n)}while(0!==n);r.gzhead.hcrc&&r.pending>a&&(t.adler=N(t.adler,r.pending_buf,r.pending-a,a)),0===n&&(r.status=ot)}else r.status=ot;if(r.status===ot&&(r.gzhead.hcrc?(r.pending+2>r.pending_buf_size&&wt(t),r.pending+2<=r.pending_buf_size&&(mt(r,255&t.adler),mt(r,t.adler>>8&255),t.adler=0,r.status=dt)):r.status=dt),0!==r.pending){if(wt(t),0===t.avail_out)return r.last_flush=-1,q}else if(0===t.avail_in&&ct(e)<=ct(s)&&e!==X)return ft(t,$);if(r.status===ut&&0!==t.avail_in)return ft(t,$);if(0!==t.avail_in||0!==r.lookahead||e!==Y&&r.status!==ut){let a=r.strategy===at?((t,e)=>{let a;for(;;){if(0===t.lookahead&&(kt(t),0===t.lookahead)){if(e===Y)return 1;break}if(t.match_length=0,a=P(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++,a&&(bt(t,!1),0===t.strm.avail_out))return 1}return t.insert=0,e===X?(bt(t,!0),0===t.strm.avail_out?3:4):t.last_lit&&(bt(t,!1),0===t.strm.avail_out)?1:2})(r,e):r.strategy===nt?((t,e)=>{let a,n,r,s;const i=t.window;for(;;){if(t.lookahead<=lt){if(kt(t),t.lookahead<=lt&&e===Y)return 1;if(0===t.lookahead)break}if(t.match_length=0,t.lookahead>=3&&t.strstart>0&&(r=t.strstart-1,n=i[r],n===i[++r]&&n===i[++r]&&n===i[++r])){s=t.strstart+lt;do{}while(n===i[++r]&&n===i[++r]&&n===i[++r]&&n===i[++r]&&n===i[++r]&&n===i[++r]&&n===i[++r]&&n===i[++r]&&r<s);t.match_length=lt-(s-r),t.match_length>t.lookahead&&(t.match_length=t.lookahead)}if(t.match_length>=3?(a=P(t,1,t.match_length-3),t.lookahead-=t.match_length,t.strstart+=t.match_length,t.match_length=0):(a=P(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++),a&&(bt(t,!1),0===t.strm.avail_out))return 1}return t.insert=0,e===X?(bt(t,!0),0===t.strm.avail_out?3:4):t.last_lit&&(bt(t,!1),0===t.strm.avail_out)?1:2})(r,e):Zt[r.level].func(r,e);if(3!==a&&4!==a||(r.status=ut),1===a||3===a)return 0===t.avail_out&&(r.last_flush=-1),q;if(2===a&&(e===K?j(r):e!==W&&(M(r,0,0,!1),e===G&&(pt(r.head),0===r.lookahead&&(r.strstart=0,r.block_start=0,r.insert=0))),wt(t),0===t.avail_out))return r.last_flush=-1,q}return e!==X?q:r.wrap<=0?J:(2===r.wrap?(mt(r,255&t.adler),mt(r,t.adler>>8&255),mt(r,t.adler>>16&255),mt(r,t.adler>>24&255),mt(r,255&t.total_in),mt(r,t.total_in>>8&255),mt(r,t.total_in>>16&255),mt(r,t.total_in>>24&255)):(vt(r,t.adler>>>16),vt(r,65535&t.adler)),wt(t),r.wrap>0&&(r.wrap=-r.wrap),0!==r.pending?q:J)},Tt=t=>{if(!t||!t.state)return Q;const e=t.state.status;return 42!==e&&69!==e&&73!==e&&91!==e&&e!==ot&&e!==dt&&e!==ut?ft(t,Q):(t.state=null,e===dt?ft(t,V):q)};const Ft=(t,e)=>Object.prototype.hasOwnProperty.call(t,e);let Ot=!0;try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(t){Ot=!1}const Dt=new Uint8Array(256);for(let t=0;t<256;t++)Dt[t]=t>=252?6:t>=248?5:t>=240?4:t>=224?3:t>=192?2:1;Dt[254]=Dt[254]=1;var Nt=t=>{if('function'==typeof TextEncoder&&TextEncoder.prototype.encode)return(new TextEncoder).encode(t);let e,a,n,r,s,i=t.length,_=0;for(r=0;r<i;r++)a=t.charCodeAt(r),55296==(64512&a)&&r+1<i&&(n=t.charCodeAt(r+1),56320==(64512&n)&&(a=65536+(a-55296<<10)+(n-56320),r++)),_+=a<128?1:a<2048?2:a<65536?3:4;for(e=new Uint8Array(_),s=0,r=0;s<_;r++)a=t.charCodeAt(r),55296==(64512&a)&&r+1<i&&(n=t.charCodeAt(r+1),56320==(64512&n)&&(a=65536+(a-55296<<10)+(n-56320),r++)),a<128?e[s++]=a:a<2048?(e[s++]=192|a>>>6,e[s++]=128|63&a):a<65536?(e[s++]=224|a>>>12,e[s++]=128|a>>>6&63,e[s++]=128|63&a):(e[s++]=240|a>>>18,e[s++]=128|a>>>12&63,e[s++]=128|a>>>6&63,e[s++]=128|63&a);return e},Bt=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg='',this.state=null,this.data_type=2,this.adler=0};const It=Object.prototype.toString,{Z_NO_FLUSH:Ct,Z_SYNC_FLUSH:Mt,Z_FULL_FLUSH:Ht,Z_FINISH:Pt,Z_OK:jt,Z_STREAM_END:Yt,Z_DEFAULT_COMPRESSION:Kt,Z_DEFAULT_STRATEGY:Gt,Z_DEFLATED:Xt}=I;function Wt(t){this.options=function(t){const e=Array.prototype.slice.call(arguments,1);for(;e.length;){const a=e.shift();if(a){if('object'!=typeof a)throw new TypeError(a+'must be non-object');for(const e in a)Ft(a,e)&&(t[e]=a[e])}}return t}({level:Kt,method:Xt,chunkSize:16384,windowBits:15,memLevel:8,strategy:Gt},t||{});let e=this.options;e.raw&&e.windowBits>0?e.windowBits=-e.windowBits:e.gzip&&e.windowBits>0&&e.windowBits<16&&(e.windowBits+=16),this.err=0,this.msg='',this.ended=!1,this.chunks=[],this.strm=new Bt,this.strm.avail_out=0;let a=St(this.strm,e.level,e.method,e.windowBits,e.memLevel,e.strategy);if(a!==jt)throw new Error(B[a]);if(e.header&&((t,e)=>{t&&t.state&&(2!==t.state.wrap||(t.state.gzhead=e))})(this.strm,e.header),e.dictionary){let t;if(t='string'==typeof e.dictionary?Nt(e.dictionary):'[object ArrayBuffer]'===It.call(e.dictionary)?new Uint8Array(e.dictionary):e.dictionary,a=((t,e)=>{let a=e.length;if(!t||!t.state)return Q;const n=t.state,r=n.wrap;if(2===r||1===r&&42!==n.status||n.lookahead)return Q;if(1===r&&(t.adler=O(t.adler,e,a,0)),n.wrap=0,a>=n.w_size){0===r&&(pt(n.head),n.strstart=0,n.block_start=0,n.insert=0);let t=new Uint8Array(n.w_size);t.set(e.subarray(a-n.w_size,a),0),e=t,a=n.w_size}const s=t.avail_in,i=t.next_in,_=t.input;for(t.avail_in=a,t.next_in=0,t.input=e,kt(n);n.lookahead>=3;){let t=n.strstart,e=n.lookahead-2;do{n.ins_h=gt(n,n.ins_h,n.window[t+3-1]),n.prev[t&n.w_mask]=n.head[n.ins_h],n.head[n.ins_h]=t,t++}while(--e);n.strstart=t,n.lookahead=2,kt(n)}return n.strstart+=n.lookahead,n.block_start=n.strstart,n.insert=n.lookahead,n.lookahead=0,n.match_length=n.prev_length=2,n.match_available=0,t.next_in=i,t.input=_,t.avail_in=s,n.wrap=r,q})(this.strm,t),a!==jt)throw new Error(B[a]);this._dict_set=!0}}function qt(t,e){const a=new Wt(e);if(a.push(t,!0),a.err)throw a.msg||B[a.err];return a.result}Wt.prototype.push=function(t,e){const a=this.strm,n=this.options.chunkSize;let r,s;if(this.ended)return!1;for(s=e===~~e?e:!0===e?Pt:Ct,'string'==typeof t?a.input=Nt(t):'[object ArrayBuffer]'===It.call(t)?a.input=new Uint8Array(t):a.input=t,a.next_in=0,a.avail_in=a.input.length;;)if(0===a.avail_out&&(a.output=new Uint8Array(n),a.next_out=0,a.avail_out=n),(s===Mt||s===Ht)&&a.avail_out<=6)this.onData(a.output.subarray(0,a.next_out)),a.avail_out=0;else{if(r=Lt(a,s),r===Yt)return a.next_out>0&&this.onData(a.output.subarray(0,a.next_out)),r=Tt(this.strm),this.onEnd(r),this.ended=!0,r===jt;if(0!==a.avail_out){if(s>0&&a.next_out>0)this.onData(a.output.subarray(0,a.next_out)),a.avail_out=0;else if(0===a.avail_in)break}else this.onData(a.output)}return!0},Wt.prototype.onData=function(t){this.chunks.push(t)},Wt.prototype.onEnd=function(t){t===jt&&(this.result=(t=>{let e=0;for(let a=0,n=t.length;a<n;a++)e+=t[a].length;const a=new Uint8Array(e);for(let e=0,n=0,r=t.length;e<r;e++){let r=t[e];a.set(r,n),n+=r.length}return a})(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg};var Jt=Wt,Qt=qt,Vt=function(t,e){return(e=e||{}).raw=!0,qt(t,e)},$t=function(t,e){return(e=e||{}).gzip=!0,qt(t,e)},te=I,ee={Deflate:Jt,deflate:Qt,deflateRaw:Vt,gzip:$t,constants:te};t.Deflate=Jt,t.constants=te,t.default=ee,t.deflate=Qt,t.deflateRaw=Vt,t.gzip=$t,Object.defineProperty(t,'__esModule',{value:!0})})),self.addEventListener('message',(t=>{const e=[];t.data.files.forEach((a=>{let n;a.size<1e3&&(t.data.compress=!1),n=t.data.compress?pako.gzip((new FileReaderSync).readAsArrayBuffer(a),{level:1}):(new FileReaderSync).readAsArrayBuffer(a),e.push({filename:a.name,orig_size:a.size,compressed:t.data.compress,content:new Blob([n])})})),self.postMessage(e)}),!1);";

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
	if(!opt.data) opt.data = {};
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

		// Put files in form data
		fd.append('nb_files', files.length);
		files.forEach((file, i) => {
			fd.append('file_' + i, file.content);
			fd.append('file_' + i + '_name', file.filename);
			fd.append('file_' + i + '_orig_size', file.orig_size);
			fd.append('file_' + i + '_compressed', file.compressed);
		});

		// Put additional data in form data
		for(const [k, v] of Object.entries(opt.data)) fd.append(k, v);

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