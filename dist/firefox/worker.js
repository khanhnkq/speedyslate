/*!
 * ONNX Runtime Web v1.30.0
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */var Wa=Object.defineProperty,Xg=Object.getOwnPropertyDescriptor,Qg=Object.getOwnPropertyNames,Yg=Object.prototype.hasOwnProperty,Jg=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),q=(e,t,r)=>()=>{if(r)throw r[0];try{return e&&(t=e(e=0)),t}catch(i){throw r=[i],i}},Ft=(e,t)=>{for(var r in t)Wa(e,r,{get:t[r],enumerable:!0})},e0=(e,t,r,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of Qg(t))!Yg.call(e,a)&&a!==r&&Wa(e,a,{get:()=>t[a],enumerable:!(i=Xg(t,a))||i.enumerable});return e},cr=e=>e0(Wa({},"__esModule",{value:!0}),e),Qt,ht,Wt,co,tp,rp=q(()=>{"use strict";Qt=new Map,ht=[],Wt=(e,t,r)=>{if(t&&typeof t.init=="function"&&typeof t.createInferenceSessionHandler=="function"){let i=Qt.get(e);if(i===void 0)Qt.set(e,{backend:t,priority:r});else{if(i.priority>r)return;if(i.priority===r&&i.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${r}`)}if(r>=0){let a=ht.indexOf(e);a!==-1&&ht.splice(a,1);for(let n=0;n<ht.length;n++)if(Qt.get(ht[n]).priority<=r){ht.splice(n,0,e);return}ht.push(e)}return}throw new TypeError("not a valid backend")},co=async e=>{let t=Qt.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;if(t.aborted)return t.error;{let r=!!t.initPromise;try{return r||(t.initPromise=t.backend.init(e)),await t.initPromise,t.initialized=!0,t.backend}catch(i){return r||(t.error=`${i}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},tp=async e=>{let t=e.executionProviders||[],r=t.map(l=>typeof l=="string"?l:l.name),i=r.length===0?ht:r,a,n=[],s=new Set;for(let l of i){let p=await co(l);typeof p=="string"?n.push({name:l,err:p}):(a||(a=p),a===p&&s.add(l))}if(!a)throw new Error(`no available backend found. ERR: ${n.map(l=>`[${l.name}] ${l.err}`).join(", ")}`);for(let{name:l,err:p}of n)r.includes(l)&&console.warn(`removing requested execution provider "${l}" from session options because it is not available: ${p}`);let u=t.filter(l=>s.has(typeof l=="string"?l:l.name));return[a,new Proxy(e,{get:(l,p)=>p==="executionProviders"?u:Reflect.get(l,p)})]}}),t0=q(()=>{"use strict";rp()}),ip,r0=q(()=>{"use strict";ip="1.30.0"}),Si,ze,ap=q(()=>{"use strict";r0(),Si="warning",ze={wasm:{},webgl:{},webgpu:{},versions:{common:ip},set logLevel(e){if(e!==void 0){if(typeof e!="string"||["verbose","info","warning","error","fatal"].indexOf(e)===-1)throw new Error(`Unsupported logging level: ${e}`);Si=e}},get logLevel(){return Si}},Object.defineProperty(ze,"logLevel",{enumerable:!0})}),ge,i0=q(()=>{"use strict";ap(),ge=ze}),np,sp,a0=q(()=>{"use strict";np=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);r.width=e.dims[3],r.height=e.dims[2];let i=r.getContext("2d");if(i!=null){let a,n;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(a=e.dims[2],n=e.dims[3]):(a=e.dims[3],n=e.dims[2]);let s=t?.format!==void 0?t.format:"RGB",u=t?.norm,l,p;u===void 0||u.mean===void 0?l=[255,255,255,255]:typeof u.mean=="number"?l=[u.mean,u.mean,u.mean,u.mean]:(l=[u.mean[0],u.mean[1],u.mean[2],0],u.mean[3]!==void 0&&(l[3]=u.mean[3])),u===void 0||u.bias===void 0?p=[0,0,0,0]:typeof u.bias=="number"?p=[u.bias,u.bias,u.bias,u.bias]:(p=[u.bias[0],u.bias[1],u.bias[2],0],u.bias[3]!==void 0&&(p[3]=u.bias[3]));let c=n*a,h=0,g=c,_=c*2,y=-1;s==="RGBA"?(h=0,g=c,_=c*2,y=c*3):s==="RGB"?(h=0,g=c,_=c*2):s==="RBG"&&(h=0,_=c,g=c*2);for(let w=0;w<n;w++)for(let S=0;S<a;S++){let x=(e.data[h++]-p[0])*l[0],b=(e.data[g++]-p[1])*l[1],I=(e.data[_++]-p[2])*l[2],k=y===-1?255:(e.data[y++]-p[3])*l[3];i.fillStyle="rgba("+x+","+b+","+I+","+k+")",i.fillRect(S,w,1,1)}if("toDataURL"in r)return r.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},sp=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),i;if(r!=null){let a,n,s;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(a=e.dims[2],n=e.dims[1],s=e.dims[3]):(a=e.dims[3],n=e.dims[2],s=e.dims[1]);let u=t!==void 0&&t.format!==void 0?t.format:"RGB",l=t?.norm,p,c;l===void 0||l.mean===void 0?p=[255,255,255,255]:typeof l.mean=="number"?p=[l.mean,l.mean,l.mean,l.mean]:(p=[l.mean[0],l.mean[1],l.mean[2],255],l.mean[3]!==void 0&&(p[3]=l.mean[3])),l===void 0||l.bias===void 0?c=[0,0,0,0]:typeof l.bias=="number"?c=[l.bias,l.bias,l.bias,l.bias]:(c=[l.bias[0],l.bias[1],l.bias[2],0],l.bias[3]!==void 0&&(c[3]=l.bias[3]));let h=n*a;if(t!==void 0&&(t.format!==void 0&&s===4&&t.format!=="RGBA"||s===3&&t.format!=="RGB"&&t.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let g=4,_=0,y=1,w=2,S=3,x=0,b=h,I=h*2,k=-1;u==="RGBA"?(x=0,b=h,I=h*2,k=h*3):u==="RGB"?(x=0,b=h,I=h*2):u==="RBG"&&(x=0,I=h,b=h*2),i=r.createImageData(a,n);for(let T=0;T<n*a;_+=g,y+=g,w+=g,S+=g,T++)i.data[_]=(e.data[x++]-c[0])*p[0],i.data[y]=(e.data[b++]-c[1])*p[1],i.data[w]=(e.data[I++]-c[2])*p[2],i.data[S]=k===-1?255:(e.data[k++]-c[3])*p[3]}else throw new Error("Can not access image data");return i}}),Er,op,up,lp,dp,pp,n0=q(()=>{"use strict";Va(),Er=(e,t)=>{if(e===void 0)throw new Error("Image buffer must be defined");if(t.height===void 0||t.width===void 0)throw new Error("Image height and width must be defined");if(t.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:r,width:i}=t,a=t.norm??{mean:255,bias:0},n,s;typeof a.mean=="number"?n=[a.mean,a.mean,a.mean,a.mean]:n=[a.mean[0],a.mean[1],a.mean[2],a.mean[3]??255],typeof a.bias=="number"?s=[a.bias,a.bias,a.bias,a.bias]:s=[a.bias[0],a.bias[1],a.bias[2],a.bias[3]??0];let u=t.format!==void 0?t.format:"RGBA",l=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",p=r*i,c=l==="RGBA"?new Float32Array(p*4):new Float32Array(p*3),h=4,g=0,_=1,y=2,w=3,S=0,x=p,b=p*2,I=-1;u==="RGB"&&(h=3,g=0,_=1,y=2,w=-1),l==="RGBA"?I=p*3:l==="RBG"?(S=0,b=p,x=p*2):l==="BGR"&&(b=0,x=p,S=p*2);for(let k=0;k<p;k++,g+=h,y+=h,_+=h,w+=h)c[S++]=(e[g]+s[0])/n[0],c[x++]=(e[_]+s[1])/n[1],c[b++]=(e[y]+s[2])/n[2],I!==-1&&w!==-1&&(c[I++]=(e[w]+s[3])/n[3]);return l==="RGBA"?new Ne("float32",c,[1,4,r,i]):new Ne("float32",c,[1,3,r,i])},op=async(e,t)=>{let r=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,i=typeof ImageData<"u"&&e instanceof ImageData,a=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,n=typeof e=="string",s,u=t??{},l=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},p=c=>typeof HTMLCanvasElement<"u"&&c instanceof HTMLCanvasElement||c instanceof OffscreenCanvas?c.getContext("2d"):null;if(r){let c=l();c.width=e.width,c.height=e.height;let h=p(c);if(h!=null){let g=e.height,_=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(g=t.resizedHeight,_=t.resizedWidth),t!==void 0){if(u=t,t.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");u.tensorFormat="RGBA",u.height=g,u.width=_}else u.tensorFormat="RGBA",u.height=g,u.width=_;h.drawImage(e,0,0),s=h.getImageData(0,0,_,g).data}else throw new Error("Can not access image data")}else if(i){let c,h;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(c=t.resizedHeight,h=t.resizedWidth):(c=e.height,h=e.width),t!==void 0&&(u=t),u.format="RGBA",u.height=c,u.width=h,t!==void 0){let g=l();g.width=h,g.height=c;let _=p(g);if(_!=null)_.putImageData(e,0,0),s=_.getImageData(0,0,h,c).data;else throw new Error("Can not access image data")}else s=e.data}else if(a){if(t===void 0)throw new Error("Please provide image config with format for Imagebitmap");let c=l();c.width=e.width,c.height=e.height;let h=p(c);if(h!=null){let g=e.height,_=e.width;return h.drawImage(e,0,0,_,g),s=h.getImageData(0,0,_,g).data,u.height=g,u.width=_,Er(s,u)}else throw new Error("Can not access image data")}else{if(n)return new Promise((c,h)=>{let g=l(),_=p(g);if(!e||!_)return h();let y=new Image;y.crossOrigin="Anonymous",y.src=e,y.onload=()=>{g.width=y.width,g.height=y.height,_.drawImage(y,0,0,g.width,g.height);let w=_.getImageData(0,0,g.width,g.height);u.height=g.height,u.width=g.width,c(Er(w.data,u))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(s!==void 0)return Er(s,u);throw new Error("Input data provided is not supported - aborted tensor creation")},up=(e,t)=>{let{width:r,height:i,download:a,dispose:n}=t,s=[1,i,r,4];return new Ne({location:"texture",type:"float32",texture:e,dims:s,download:a,dispose:n})},lp=(e,t)=>{let{dataType:r,dims:i,download:a,dispose:n}=t;return new Ne({location:"gpu-buffer",type:r??"float32",gpuBuffer:e,dims:i,download:a,dispose:n})},dp=(e,t)=>{let{dataType:r,dims:i,download:a,dispose:n}=t;return new Ne({location:"ml-tensor",type:r??"float32",mlTensor:e,dims:i,download:a,dispose:n})},pp=(e,t,r)=>new Ne({location:"cpu-pinned",type:e,data:t,dims:r??[t.length]})}),zt,ur,ki,cp,s0=q(()=>{"use strict";zt=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),ur=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),ki=!1,cp=()=>{if(!ki){ki=!0;let e=typeof BigInt64Array<"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,r=globalThis.Float16Array,i=typeof r<"u"&&r.from;e&&(zt.set("int64",BigInt64Array),ur.set(BigInt64Array,"int64")),t&&(zt.set("uint64",BigUint64Array),ur.set(BigUint64Array,"uint64")),i?(zt.set("float16",r),ur.set(r,"float16")):zt.set("float16",Uint16Array)}}}),hp,fp,o0=q(()=>{"use strict";Va(),hp=e=>{let t=1;for(let r=0;r<e.length;r++){let i=e[r];if(typeof i!="number"||!Number.isSafeInteger(i))throw new TypeError(`dims[${r}] must be an integer, got: ${i}`);if(i<0)throw new RangeError(`dims[${r}] must be a non-negative integer, got: ${i}`);t*=i}return t},fp=(e,t)=>{switch(e.location){case"cpu":return new Ne(e.type,e.data,t);case"cpu-pinned":return new Ne({location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new Ne({location:"texture",texture:e.texture,type:e.type,dims:t});case"gpu-buffer":return new Ne({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"ml-tensor":return new Ne({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),Ne,Va=q(()=>{"use strict";a0(),n0(),s0(),o0(),Ne=class{constructor(e,t,r){cp();let i,a;if(typeof e=="object"&&"location"in e)switch(this.dataLocation=e.location,i=e.type,a=e.dims,e.location){case"cpu-pinned":{let s=zt.get(i);if(!s)throw new TypeError(`unsupported type "${i}" to create tensor from pinned buffer`);if(!(e.data instanceof s))throw new TypeError(`buffer should be of type ${s.name}`);this.cpuData=e.data;break}case"texture":{if(i!=="float32")throw new TypeError(`unsupported type "${i}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break}case"gpu-buffer":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break}case"ml-tensor":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint64"&&i!=="int8"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let s,u;if(typeof e=="string")if(i=e,u=r,e==="string"){if(!Array.isArray(t))throw new TypeError("A string tensor's data must be a string array.");s=t}else{let l=zt.get(e);if(l===void 0)throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e==="float16"&&l===Uint16Array||e==="uint4"||e==="int4")throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${l.name} as data.`);e==="uint64"||e==="int64"?s=l.from(t,BigInt):s=l.from(t)}else if(t instanceof l)s=t;else if(t instanceof Uint8ClampedArray)if(e==="uint8")s=Uint8Array.from(t);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(e==="float16"&&t instanceof Uint16Array&&l!==Uint16Array)s=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw new TypeError(`A ${i} tensor's data must be type of ${l}`)}else if(u=t,Array.isArray(e)){if(e.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let l=typeof e[0];if(l==="string")i="string",s=e;else if(l==="boolean")i="bool",s=Uint8Array.from(e);else throw new TypeError(`Invalid element type of data array: ${l}.`)}else if(e instanceof Uint8ClampedArray)i="uint8",s=Uint8Array.from(e);else{let l=ur.get(e.constructor);if(l===void 0)throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);i=l,s=e}if(u===void 0)u=[s.length];else if(!Array.isArray(u))throw new TypeError("A tensor's dims must be a number array");a=u,this.cpuData=s,this.dataLocation="cpu"}let n=hp(a);if(this.cpuData&&n!==this.cpuData.length&&!((i==="uint4"||i==="int4")&&Math.ceil(n/2)===this.cpuData.length))throw new Error(`Tensor's size(${n}) does not match data length(${this.cpuData.length}).`);this.type=i,this.dims=a,this.size=n}static async fromImage(e,t){return op(e,t)}static fromTexture(e,t){return up(e,t)}static fromGpuBuffer(e,t){return lp(e,t)}static fromMLTensor(e,t){return dp(e,t)}static fromPinnedBuffer(e,t,r){return pp(e,t,r)}toDataURL(e){return np(this,e)}toImageData(e){return sp(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return fp(this,e)}}}),qe,mp=q(()=>{"use strict";Va(),qe=Ne}),Hr,Ti,tt,Ze,Ot,Bt,gp=q(()=>{"use strict";ap(),Hr=(e,t)=>{(typeof ze.trace>"u"?!ze.wasm.trace:!ze.trace)||console.timeStamp(`${e}::ORT::${t}`)},Ti=(e,t)=>{let r=new Error().stack?.split(/\r\n|\r|\n/g)||[],i=!1;for(let a=0;a<r.length;a++){if(i&&!r[a].includes("TRACE_FUNC")){let n=`FUNC_${e}::${r[a].trim().split(" ")[1]}`;t&&(n+=`::${t}`),Hr("CPU",n);return}r[a].includes("TRACE_FUNC")&&(i=!0)}},tt=e=>{(typeof ze.trace>"u"?!ze.wasm.trace:!ze.trace)||Ti("BEGIN",e)},Ze=e=>{(typeof ze.trace>"u"?!ze.wasm.trace:!ze.trace)||Ti("END",e)},Ot=e=>{(typeof ze.trace>"u"?!ze.wasm.trace:!ze.trace)||console.time(`ORT::${e}`)},Bt=e=>{(typeof ze.trace>"u"?!ze.wasm.trace:!ze.trace)||console.timeEnd(`ORT::${e}`)}}),yp,u0=q(()=>{"use strict";rp(),mp(),gp(),yp=class _p{constructor(t){this.handler=t}async run(t,r,i){tt(),Ot("InferenceSession.run");let a={},n={};if(typeof t!="object"||t===null||t instanceof qe||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let s=!0;if(typeof r=="object"){if(r===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(r instanceof qe)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(r)){if(r.length===0)throw new TypeError("'fetches' cannot be an empty array.");s=!1;for(let p of r){if(typeof p!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(p)===-1)throw new RangeError(`'fetches' contains invalid output name: ${p}.`);a[p]=null}if(typeof i=="object"&&i!==null)n=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else{let p=!1,c=Object.getOwnPropertyNames(r);for(let h of this.outputNames)if(c.indexOf(h)!==-1){let g=r[h];(g===null||g instanceof qe)&&(p=!0,s=!1,a[h]=g)}if(p){if(typeof i=="object"&&i!==null)n=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else n=r}}else if(typeof r<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let p of this.inputNames)if(typeof t[p]>"u")throw new Error(`input '${p}' is missing in 'feeds'.`);if(s)for(let p of this.outputNames)a[p]=null;let u=await this.handler.run(t,a,n),l={};for(let p in u)if(Object.hasOwnProperty.call(u,p)){let c=u[p];c instanceof qe?l[p]=c:l[p]=new qe(c.type,c.data,c.dims)}return Bt("InferenceSession.run"),Ze(),l}async release(){return this.handler.dispose()}static async create(t,r,i,a){tt(),Ot("InferenceSession.create");let n,s={};if(typeof t=="string"){if(n=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof Uint8Array){if(n=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&t instanceof SharedArrayBuffer){let c=t,h=0,g=t.byteLength;if(typeof r=="object"&&r!==null)s=r;else if(typeof r=="number"){if(h=r,!Number.isSafeInteger(h))throw new RangeError("'byteOffset' must be an integer.");if(h<0||h>=c.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${c.byteLength}).`);if(g=t.byteLength-h,typeof i=="number"){if(g=i,!Number.isSafeInteger(g))throw new RangeError("'byteLength' must be an integer.");if(g<=0||h+g>c.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${c.byteLength-h}].`);if(typeof a=="object"&&a!==null)s=a;else if(typeof a<"u")throw new TypeError("'options' must be an object.")}else if(typeof i<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof r<"u")throw new TypeError("'options' must be an object.");n=new Uint8Array(c,h,g)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[u,l]=await tp(s),p=await u.createInferenceSessionHandler(n,l);return Bt("InferenceSession.create"),Ze(),new _p(p)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),hr,l0=q(()=>{"use strict";u0(),hr=yp}),d0=q(()=>{"use strict"}),p0=q(()=>{"use strict"}),c0=q(()=>{"use strict"}),h0=q(()=>{"use strict"}),f0={};Ft(f0,{InferenceSession:()=>hr,TRACE:()=>Hr,TRACE_EVENT_BEGIN:()=>Ot,TRACE_EVENT_END:()=>Bt,TRACE_FUNC_BEGIN:()=>tt,TRACE_FUNC_END:()=>Ze,Tensor:()=>qe,env:()=>ge,registerBackend:()=>Wt});var Le=q(()=>{"use strict";t0(),i0(),l0(),mp(),d0(),p0(),gp(),c0(),h0()}),Ga=q(()=>{"use strict"}),bp={};Ft(bp,{default:()=>wp});var Ii,Ei,wp,m0=q(()=>{"use strict";zf(),Dt(),Ha(),Ii="ort-wasm-proxy-worker",Ei=globalThis.self?.name===Ii,Ei&&(self.onmessage=e=>{let{type:t,in:r}=e.data;try{switch(t){case"init-wasm":Fa(r.wasm).then(()=>{dn(r).then(()=>{postMessage({type:t})},i=>{postMessage({type:t,err:i})})},i=>{postMessage({type:t,err:i})});break;case"init-ep":{let{epName:i,env:a}=r;pn(a,i).then(()=>{postMessage({type:t})},n=>{postMessage({type:t,err:n})});break}case"copy-from":{let{buffer:i}=r,a=Yr(i);postMessage({type:t,out:a});break}case"create":{let{model:i,options:a}=r;cn(i,a).then(n=>{postMessage({type:t,out:n})},n=>{postMessage({type:t,err:n})});break}case"release":hn(r),postMessage({type:t});break;case"run":{let{sessionId:i,inputIndices:a,inputs:n,outputIndices:s,options:u}=r;fn(i,a,n,s,new Array(s.length).fill(null),u).then(l=>{l.some(p=>p[3]!=="cpu")?postMessage({type:t,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:t,out:l},gn([...n,...l]))},l=>{postMessage({type:t,err:l})});break}case"end-profiling":mn(r),postMessage({type:t});break;default:}}catch(i){postMessage({type:t,err:i})}}),wp=Ei?null:e=>new Worker(e??Me,{type:"module",name:Ii})}),$p={};Ft($p,{default:()=>vp});async function ho(e={}){var t=e,r=!!globalThis.window,i=!!globalThis.WorkerGlobalScope,a=i&&self.name?.startsWith("em-pthread");t.mountExternalData=(o,d)=>{o.startsWith("./")&&(o=o.substring(2)),(t.ad||(t.ad=new Map)).set(o,d)},t.unmountExternalData=()=>{delete t.ad,delete t.Yd,delete t.Xd,delete t.be},globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,shared:!0}).buffer.constructor;let n=o=>async(...d)=>{try{if(t.$c)throw Error("Session already started");let m=t.$c={Nd:d[0],errors:[]},f=await o(...d);if(t.$c!==m)throw Error("Session mismatch");t.hd?.flush();let $=m.errors;if(0<$.length){let E=await Promise.all($);if(E=E.filter(A=>A),0<E.length)throw Error(E.join(`
`))}return f}finally{t.$c=null}};t.jsepInit=(o,d)=>{if(o==="webgpu"){[t.hd,t.Dd,t.Hd,t.jd,t.Gd,t.bc,t.Id,t.Kd,t.Ed,t.Fd,t.Jd]=d;let m=t.hd;t.jsepRegisterBuffer=(f,$,E,A)=>m.registerBuffer(f,$,E,A),t.jsepGetBuffer=f=>m.getBuffer(f),t.jsepCreateDownloader=(f,$,E)=>m.createDownloader(f,$,E),t.jsepOnCreateSession=f=>{m.onCreateSession(f)},t.jsepOnReleaseSession=f=>{m.onReleaseSession(f)},t.jsepOnRunStart=f=>m.onRunStart(f),t.Ld=(f,$)=>{m.upload(f,$)}}else if(o==="webnn"){let m=d[0];[t.Vd,t.vd,t.webnnEnsureTensor,t.wd,t.webnnDownloadTensor,t.Ud,t.webnnEnableTraceEvent]=d.slice(1),t.webnnReleaseTensorId=t.vd,t.webnnUploadTensor=t.wd,t.webnnRegisterMLContext=t.Ud,t.webnnOnRunStart=f=>m.onRunStart(f),t.webnnOnRunEnd=m.onRunEnd.bind(m),t.webnnOnReleaseSession=f=>{m.onReleaseSession(f)},t.webnnCreateMLTensorDownloader=(f,$)=>m.createMLTensorDownloader(f,$),t.webnnRegisterMLTensor=(f,$,E,A)=>m.registerMLTensor(f,$,E,A),t.webnnCreateMLContext=f=>m.createMLContext(f),t.webnnRegisterGraphInput=m.registerGraphInput.bind(m),t.webnnIsGraphInput=m.isGraphInput.bind(m),t.webnnRegisterGraphOutput=m.registerGraphOutput.bind(m),t.webnnIsGraphOutput=m.isGraphOutput.bind(m),t.webnnCreateTemporaryTensor=m.createTemporaryTensor.bind(m),t.webnnIsGraphInputOutputTypeSupported=m.isGraphInputOutputTypeSupported.bind(m)}};let s=()=>{let o=d=>(...m)=>{let f=Ye;return m=d(...m),Ye!=f?new Promise(($,E)=>{pi={resolve:$,reject:E}}):m};(()=>{for(let d of["_OrtAppendExecutionProvider","_OrtCreateSession","_OrtRun","_OrtRunWithBinding","_OrtBindInput"])t[d]=o(t[d])})(),n!==void 0&&(t._OrtRun=n(t._OrtRun),t._OrtRunWithBinding=n(t._OrtRunWithBinding)),s=void 0};t.asyncInit=()=>{s?.()};var u,l,p=(o,d)=>{throw d},c=import.meta.url,h="";if(r||i){try{h=new URL(".",c).href}catch{}i&&(l=o=>{var d=new XMLHttpRequest;return d.open("GET",o,!1),d.responseType="arraybuffer",d.send(null),new Uint8Array(d.response)}),u=async o=>{if(C(o))return new Promise((m,f)=>{var $=new XMLHttpRequest;$.open("GET",o,!0),$.responseType="arraybuffer",$.onload=()=>{$.status==200||$.status==0&&$.response?m($.response):f($.status)},$.onerror=f,$.send(null)});var d=await fetch(o,{credentials:"same-origin"});if(d.ok)return d.arrayBuffer();throw Error(d.status+" : "+d.url)}}var g,_,y,w,S,x,b=console.log.bind(console),I=console.error.bind(console),k=b,T=I,z=!1,C=o=>o.startsWith("file://");function v(){lt.buffer!=P.buffer&&ee()}if(a){let o=function(d){try{var m=d.data,f=m.Vc;if(f==="load"){let $=[];self.onmessage=E=>$.push(E),x=()=>{postMessage({Vc:"loaded"});for(let E of $)o(E);self.onmessage=o};for(let E of m.Ad)t[E]&&!t[E].proxy||(t[E]=(...A)=>{postMessage({Vc:"callHandler",yd:E,args:A})},E=="print"&&(k=t[E]),E=="printErr"&&(T=t[E]));lt=m.Rd,ee(),_=m.Sd,Ae(),Ir()}else if(f==="run"){(function($){var E=(v(),D)[$+52>>>2>>>0];$=(v(),D)[$+56>>>2>>>0],ws(E,E-$),oe(E)})(m.Uc),gi(m.Uc,0,0,1,0,0),wn(),ui(m.Uc),N||(fs(),N=!0);try{Lf(m.Pd,m.ed)}catch($){if($!="unwind")throw $}}else m.target!=="setimmediate"&&(f==="checkMailbox"?N&&wr():f&&(T(`worker: received unknown command ${f}`),T(m)))}catch($){throw ms(),$}};var N=!1;self.onunhandledrejection=d=>{throw d.reason||d},self.onmessage=o}var P,F,W,K,B,D,H,Q,J,te,ne,U=!1;function ee(){var o=lt.buffer;t.HEAP8=P=new Int8Array(o),W=new Int16Array(o),t.HEAPU8=F=new Uint8Array(o),K=new Uint16Array(o),t.HEAP32=B=new Int32Array(o),t.HEAPU32=D=new Uint32Array(o),H=new Float32Array(o),Q=new Float64Array(o),J=new BigInt64Array(o),te=new BigUint64Array(o)}function Y(){U=!0,a?x():it.ub()}function G(o){throw T(o="Aborted("+o+")"),z=!0,o=new WebAssembly.RuntimeError(o+". Build with -sASSERTIONS for more info."),S?.(o),o}function Te(){return{a:{ma:dg,hb:lg,g:Wf,J:Vf,f:Gf,o:Hf,i:Ff,$:jf,b:Kf,S:Zf,Ha:Tn,n:Xf,aa:Cn,Ya:An,Da:On,Fa:Bn,Za:Rn,Wa:Mn,Pa:Nn,Va:Dn,ka:Un,Ea:Pn,Ba:qn,Xa:Ln,Ca:Wn,cb:Qf,fa:Yf,wa:Jf,ua:tm,ea:im,N:am,H:nm,va:sm,_:hm,xa:fm,Sa:mm,za:ym,Ia:_m,sa:bm,ga:wm,Ra:ui,$a:$m,Q:km,r:Cm,c:si,ib:Am,y:Om,M:Bm,D:Rm,l:Mm,s:Xn,jb:Nm,I:Dm,R:Um,j:Pm,u:qm,q:Lm,k:Wm,Ma:Vm,Na:Gm,Oa:Hm,Ka:es,La:ts,ta:rs,eb:jm,bb:Zm,v:Xm,ba:Qm,ha:Ym,ab:Km,V:Jm,_a:eg,Aa:tg,F:Fm,U:rg,la:kr,ya:ag,gb:ig,fb:ng,Ta:ss,Ua:os,Ga:ti,T:us,Ja:ls,ja:ds,Qa:ps,ia:cs,lb:jg,na:Wg,mb:Fg,oa:Lg,G:Cg,e:fg,t:cg,w:pg,B:Sg,nb:Ug,Z:Dg,x:yg,pa:Pg,X:Vg,ca:Ng,ob:Mg,pb:Rg,O:kg,qb:Og,qa:Bg,rb:Ag,L:Eg,Y:qg,d:hg,A:gg,m:mg,kb:Kg,p:bg,z:wg,C:_g,E:$g,K:Tg,ra:zg,P:Gg,da:Ig,W:Hg,sb:xg,tb:vg,h:og,a:lt,db:ei}}}async function Ae(){function o(f,$){var E=it=f.exports;f={};for(let[A,M]of Object.entries(E))typeof M=="function"?(E=vm(M),f[A]=E):f[A]=M;return it=f,it=(function(){var A=it,M=V=>se=>V(se)>>>0,L=V=>()=>V()>>>0;return(A=Object.assign({},A)).vb=M(A.vb),A.Zb=L(A.Zb),A.$b=M(A.$b),A.nc=M(A.nc),A.oc=L(A.oc),A.sc=M(A.sc),A})(),_n.push(it.ac),hs=(f=it).vb,fs=f.wb,t._OrtInit=f.xb,t._OrtGetLastError=f.yb,t._OrtCreateSessionOptions=f.zb,t._OrtAppendExecutionProvider=f.Ab,t._OrtAddFreeDimensionOverride=f.Bb,t._OrtAddSessionConfigEntry=f.Cb,t._OrtReleaseSessionOptions=f.Db,t._OrtCreateSession=f.Eb,t._OrtReleaseSession=f.Fb,t._OrtGetInputOutputCount=f.Gb,t._OrtGetInputOutputMetadata=f.Hb,t._OrtFree=f.Ib,t._OrtCreateTensor=f.Jb,t._OrtGetTensorData=f.Kb,t._OrtReleaseTensor=f.Lb,t._OrtCreateRunOptions=f.Mb,t._OrtAddRunConfigEntry=f.Nb,t._OrtReleaseRunOptions=f.Ob,t._OrtCreateBinding=f.Pb,t._OrtBindInput=f.Qb,t._OrtBindOutput=f.Rb,t._OrtClearBoundOutputs=f.Sb,t._OrtReleaseBinding=f.Tb,t._OrtRunWithBinding=f.Ub,t._OrtRun=f.Vb,t._OrtEndProfiling=f.Wb,t._JsepOutput=f.Xb,t._JsepGetNodeName=f.Yb,Tr=f.Zb,Je=t._free=f._b,Zt=t._malloc=f.$b,gi=f.cc,ms=f.dc,gs=f.ec,ys=f.fc,yi=f.gc,_s=f.hc,bs=f.ic,le=f.jc,Xt=f.kc,ws=f.lc,oe=f.mc,_i=f.nc,ue=f.oc,$s=f.pc,bi=f.qc,vs=f.rc,xs=f.sc,Ss=f.tc,wi=f.uc,ks=f.vc,Ts=f.wc,Is=f.xc,Es=f.yc,zs=f.zc,Cs=f.Ac,As=f.Bc,Os=f.Cc,Bs=f.Dc,Rs=f.Ec,Ms=f.Fc,Ns=f.Gc,Ds=f.Hc,Us=f.Ic,Ps=f.Jc,qs=f.Kc,Ls=f.Lc,Ws=f.Mc,Vs=f.Nc,Gs=f.Oc,Hs=f.Pc,Fs=f.Qc,js=f.Sc,Ks=f.Tc,Zs=f.cd,Xs=f.dd,Qs=f.id,Ys=f.nd,Js=f.od,eo=f.pd,to=f.qd,ro=f.rd,io=f.sd,ao=f.td,no=f.ud,so=f.zd,oo=f.Zd,uo=f._d,lo=f.$d,po=f.ae,_=$,it}var d,m=Te();return t.instantiateWasm?new Promise(f=>{t.instantiateWasm(m,($,E)=>{f(o($,E))})}):a?o(new WebAssembly.Instance(_,Te()),_):(ne??=t.locateFile?t.locateFile?t.locateFile("ort-wasm-simd-threaded.jsep.wasm",h):h+"ort-wasm-simd-threaded.jsep.wasm":new URL("/assets/ort-wasm-simd-threaded.jsep.wasm",import.meta.url).href,d=await(async function(f){var $=ne;if(!g&&!C($))try{var E=fetch($,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(E,f)}catch(A){T(`wasm streaming compile failed: ${A}`),T("falling back to ArrayBuffer instantiation")}return(async function(A,M){try{var L=await(async function(V){if(!g)try{var se=await u(V);return new Uint8Array(se)}catch{}if(V==ne&&g)V=new Uint8Array(g);else{if(!l)throw"both async and sync fetching of the wasm failed";V=l(V)}return V})(A);return await WebAssembly.instantiate(L,M)}catch(V){T(`failed to asynchronously prepare wasm: ${V}`),G(V)}})($,f)})(m),o(d.instance,d.module))}class ve{name="ExitStatus";constructor(d){this.message=`Program terminated with exit(${d})`,this.status=d}}var Oe=o=>{o.terminate(),o.onmessage=()=>{}},me=[],we=0,Be=null,mr=o=>{ut.length==0&&(vn(),$n(ut[0]));var d=ut.pop();if(!d)return 6;jt.push(d),wt[o.Uc]=d,d.Uc=o.Uc;var m={Vc:"run",Pd:o.Od,ed:o.ed,Uc:o.Uc};return d.postMessage(m,o.md),0},Xe=0,$e=(o,d,...m)=>{var f,$=16*m.length,E=ue(),A=_i($),M=A>>>3;for(f of m)typeof f=="bigint"?((v(),J)[M++>>>0]=1n,(v(),J)[M++>>>0]=f):((v(),J)[M++>>>0]=0n,(v(),Q)[M++>>>0]=f);return o=gs(o,0,$,A,d),oe(E),o};function ei(o){if(a)return $e(0,1,o);if(y=o,!(0<Xe)){for(var d of jt)Oe(d);for(d of ut)Oe(d);ut=[],jt=[],wt={},z=!0}p(0,new ve(o))}function yn(o){if(a)return $e(1,0,o);ti(o)}var ti=o=>{if(y=o,a)throw yn(o),"unwind";ei(o)},ut=[],jt=[],_n=[],wt={},bn=o=>{var d=o.Uc;delete wt[d],ut.push(o),jt.splice(jt.indexOf(o),1),o.Uc=0,ys(d)};function wn(){_n.forEach(o=>o())}var $n=o=>new Promise(d=>{o.onmessage=$=>{var E=$.data;if($=E.Vc,E.bd&&E.bd!=Tr()){var A=wt[E.bd];A?A.postMessage(E,E.md):T(`Internal error! Worker sent a message "${$}" to target pthread ${E.bd}, but that thread no longer exists!`)}else $==="checkMailbox"?wr():$==="spawnThread"?mr(E):$==="cleanupThread"?br(()=>{bn(wt[E.Qd])}):$==="loaded"?(o.loaded=!0,d(o)):E.target==="setimmediate"?o.postMessage(E):$==="uncaughtException"?o.onerror(E.error):$==="callHandler"?t[E.yd](...E.args):$&&T(`worker sent an unknown command ${$}`)},o.onerror=$=>{throw T(`worker sent an error! ${$.filename}:${$.lineno}: ${$.message}`),$};var m,f=[];for(m of[])t.propertyIsEnumerable(m)&&f.push(m);o.postMessage({Vc:"load",Ad:f,Rd:lt,Sd:_})});function vn(){var o=new Worker((()=>{let d=URL;return import.meta.url>"file:"&&import.meta.url<"file;"?new d("ort.bundle.min.mjs",import.meta.url):new URL(import.meta.url)})(),{type:"module",workerData:"em-pthread",name:"em-pthread"});ut.push(o)}var lt,Lf=(o,d)=>{Xe=0,o=wi(o,d),0<Xe?y=o:yi(o)},gr=[],yr=0;function Wf(o){var d=new ri(o>>>=0);return(v(),P)[d.Wc+12>>>0]==0&&(xn(d,!0),yr--),Sn(d,!1),gr.push(d),xs(o)}var Pt=0,Vf=()=>{le(0,0);var o=gr.pop();$s(o.gd),Pt=0};function xn(o,d){d=d?1:0,(v(),P)[o.Wc+12>>>0]=d}function Sn(o,d){d=d?1:0,(v(),P)[o.Wc+13>>>0]=d}class ri{constructor(d){this.gd=d,this.Wc=d-24}}var ii=o=>{var d=Pt;if(!d)return Xt(0),0;var m=new ri(d);(v(),D)[m.Wc+16>>>2>>>0]=d;var f=(v(),D)[m.Wc+4>>>2>>>0];if(!f)return Xt(0),d;for(var $ of o){if($===0||$===f)break;if(vs($,f,m.Wc+16))return Xt($),d}return Xt(f),d};function Gf(){return ii([])}function Hf(o){return ii([o>>>0])}function Ff(o,d,m,f){return ii([o>>>0,d>>>0,m>>>0,f>>>0])}var jf=()=>{var o=gr.pop();o||G("no exception to throw");var d=o.gd;throw(v(),P)[o.Wc+13>>>0]==0&&(gr.push(o),Sn(o,!0),xn(o,!1),yr++),bi(d),Pt=d};function Kf(o,d,m){var f=new ri(o>>>=0);throw d>>>=0,m>>>=0,(v(),D)[f.Wc+16>>>2>>>0]=0,(v(),D)[f.Wc+4>>>2>>>0]=d,(v(),D)[f.Wc+8>>>2>>>0]=m,bi(o),yr++,Pt=o}var Zf=()=>yr;function kn(o,d,m,f){return a?$e(2,1,o,d,m,f):Tn(o,d,m,f)}function Tn(o,d,m,f){if(o>>>=0,d>>>=0,m>>>=0,f>>>=0,!globalThis.SharedArrayBuffer)return 6;var $=[];return a&&$.length===0?kn(o,d,m,f):(o={Od:m,Uc:o,ed:f,md:$},a?(o.Vc="spawnThread",postMessage(o,$),0):mr(o))}function Xf(o){throw Pt||=o>>>0,Pt}var In=globalThis.TextDecoder&&new TextDecoder,En=(o,d,m,f)=>{if(m=d+m,f)return m;for(;o[d]&&!(d>=m);)++d;return d},zn=(o,d=0,m,f)=>{if(16<(m=En(o,d>>>=0,m,f))-d&&o.buffer&&In)return In.decode(o.buffer instanceof ArrayBuffer?o.subarray(d,m):o.slice(d,m));for(f="";d<m;){var $=o[d++];if(128&$){var E=63&o[d++];if((224&$)==192)f+=String.fromCharCode((31&$)<<6|E);else{var A=63&o[d++];65536>($=(240&$)==224?(15&$)<<12|E<<6|A:(7&$)<<18|E<<12|A<<6|63&o[d++])?f+=String.fromCharCode($):($-=65536,f+=String.fromCharCode(55296|$>>10,56320|1023&$))}}else f+=String.fromCharCode($)}return f},ke=(o,d,m)=>(o>>>=0)?zn((v(),F),o,d,m):"";function Cn(o,d,m){return a?$e(3,1,o,d,m):0}function An(o,d){if(a)return $e(4,1,o,d)}function On(o,d){if(a)return $e(5,1,o,d)}function Bn(o,d,m){if(a)return $e(6,1,o,d,m)}function Rn(o,d,m){return a?$e(7,1,o,d,m):0}function Mn(o,d){if(a)return $e(8,1,o,d)}function Nn(o,d,m){if(a)return $e(9,1,o,d,m)}function Dn(o,d,m,f){if(a)return $e(10,1,o,d,m,f)}function Un(o,d,m,f){if(a)return $e(11,1,o,d,m,f)}function Pn(o,d,m,f){if(a)return $e(12,1,o,d,m,f)}function qn(o){if(a)return $e(13,1,o)}function Ln(o,d){if(a)return $e(14,1,o,d)}function Wn(o,d,m){if(a)return $e(15,1,o,d,m)}var Qf=()=>G(""),Qe=o=>{o>>>=0;for(var d="";;){var m=(v(),F)[o++>>>0];if(!m)return d;d+=String.fromCharCode(m)}},ai={},ni={},qt=class extends Error{constructor(o){super(o),this.name="BindingError"}};function rt(o,d,m={}){return(function(f,$,E={}){var A=$.name;if(!f)throw new qt(`type "${A}" must have a positive integer typeid pointer`);if(ni.hasOwnProperty(f)){if(E.Bd)return;throw new qt(`Cannot register type '${A}' twice`)}ni[f]=$,ai.hasOwnProperty(f)&&($=ai[f],delete ai[f],$.forEach(M=>M()))})(o,d,m)}var Vn=(o,d,m)=>{switch(d){case 1:return m?f=>(v(),P)[f>>>0]:f=>(v(),F)[f>>>0];case 2:return m?f=>(v(),W)[f>>>1>>>0]:f=>(v(),K)[f>>>1>>>0];case 4:return m?f=>(v(),B)[f>>>2>>>0]:f=>(v(),D)[f>>>2>>>0];case 8:return m?f=>(v(),J)[f>>>3>>>0]:f=>(v(),te)[f>>>3>>>0];default:throw new TypeError(`invalid integer width (${d}): ${o}`)}};function Yf(o,d,m,f,$){o>>>=0,m>>>=0,d=Qe(d>>>0);let E=A=>A;if(f=f===0n){let A=8*m;E=M=>BigInt.asUintN(A,M),$=E($)}rt(o,{name:d,Rc:E,Yc:(A,M)=>(typeof M=="number"&&(M=BigInt(M)),M),Xc:Vn(d,m,!f),Zc:null})}function Jf(o,d,m,f){rt(o>>>=0,{name:d=Qe(d>>>0),Rc:function($){return!!$},Yc:function($,E){return E?m:f},Xc:function($){return this.Rc((v(),F)[$>>>0])},Zc:null})}var Gn=[],$t=[0,1,,1,null,1,!0,1,!1,1];function si(o){9<(o>>>=0)&&--$t[o+1]===0&&($t[o]=void 0,Gn.push(o))}var Ue=o=>{if(!o)throw new qt(`Cannot use deleted val. handle = ${o}`);return $t[o]},We=o=>{switch(o){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let d=Gn.pop()||$t.length;return $t[d]=o,$t[d+1]=1,d}};function oi(o){return this.Rc((v(),D)[o>>>2>>>0])}var em={name:"emscripten::val",Rc:o=>{var d=Ue(o);return si(o),d},Yc:(o,d)=>We(d),Xc:oi,Zc:null};function tm(o){return rt(o>>>0,em)}var rm=(o,d)=>{switch(d){case 4:return function(m){return this.Rc((v(),H)[m>>>2>>>0])};case 8:return function(m){return this.Rc((v(),Q)[m>>>3>>>0])};default:throw new TypeError(`invalid float width (${d}): ${o}`)}};function im(o,d,m){m>>>=0,rt(o>>>=0,{name:d=Qe(d>>>0),Rc:f=>f,Yc:(f,$)=>$,Xc:rm(d,m),Zc:null})}function am(o,d,m,f,$){o>>>=0,m>>>=0,d=Qe(d>>>0);let E=M=>M;if(f===0){var A=32-8*m;E=M=>M<<A>>>A,$=E($)}rt(o,{name:d,Rc:E,Yc:(M,L)=>L,Xc:Vn(d,m,f!==0),Zc:null})}function nm(o,d,m){function f(E){var A=(v(),D)[E>>>2>>>0];return E=(v(),D)[E+4>>>2>>>0],new $((v(),P).buffer,E,A)}var $=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][d];rt(o>>>=0,{name:m=Qe(m>>>0),Rc:f,Xc:f},{Bd:!0})}var dt=(o,d,m)=>{var f=(v(),F);if(d>>>=0,0<m){var $=d;m=d+m-1;for(var E=0;E<o.length;++E){var A=o.codePointAt(E);if(127>=A){if(d>=m)break;f[d++>>>0]=A}else if(2047>=A){if(d+1>=m)break;f[d++>>>0]=192|A>>6,f[d++>>>0]=128|63&A}else if(65535>=A){if(d+2>=m)break;f[d++>>>0]=224|A>>12,f[d++>>>0]=128|A>>6&63,f[d++>>>0]=128|63&A}else{if(d+3>=m)break;f[d++>>>0]=240|A>>18,f[d++>>>0]=128|A>>12&63,f[d++>>>0]=128|A>>6&63,f[d++>>>0]=128|63&A,E++}}f[d>>>0]=0,o=d-$}else o=0;return o},_r=o=>{for(var d=0,m=0;m<o.length;++m){var f=o.charCodeAt(m);127>=f?d++:2047>=f?d+=2:55296<=f&&57343>=f?(d+=4,++m):d+=3}return d};function sm(o,d){rt(o>>>=0,{name:d=Qe(d>>>0),Rc(m){var f=(v(),D)[m>>>2>>>0];return f=ke(m+4,f,!0),Je(m),f},Yc(m,f){f instanceof ArrayBuffer&&(f=new Uint8Array(f));var $=typeof f=="string";if(!($||ArrayBuffer.isView(f)&&f.BYTES_PER_ELEMENT==1))throw new qt("Cannot pass non-string to std::string");var E=$?_r(f):f.length,A=Zt(4+E+1),M=A+4;return(v(),D)[A>>>2>>>0]=E,$?dt(f,M,E+1):(v(),F).set(f,M>>>0),m!==null&&m.push(Je,A),A},Xc:oi,Zc(m){Je(m)}})}var Hn=globalThis.TextDecoder?new TextDecoder("utf-16le"):void 0,om=(o,d,m)=>{if(o>>>=1,16<(d=En((v(),K),o,d/2,m))-o&&Hn)return Hn.decode((v(),K).slice(o,d));for(m="";o<d;++o){var f=(v(),K)[o>>>0];m+=String.fromCharCode(f)}return m},um=(o,d,m)=>{if(m??=2147483647,2>m)return 0;var f=d;m=(m-=2)<2*o.length?m/2:o.length;for(var $=0;$<m;++$){var E=o.charCodeAt($);(v(),W)[d>>>1>>>0]=E,d+=2}return(v(),W)[d>>>1>>>0]=0,d-f},lm=o=>2*o.length,dm=(o,d,m)=>{var f="";o>>>=2;for(var $=0;!($>=d/4);$++){var E=(v(),D)[o+$>>>0];if(!E&&!m)break;f+=String.fromCodePoint(E)}return f},pm=(o,d,m)=>{if(d>>>=0,m??=2147483647,4>m)return 0;var f=d;m=f+m-4;for(var $=0;$<o.length;++$){var E=o.codePointAt($);if(65535<E&&$++,(v(),B)[d>>>2>>>0]=E,(d+=4)+4>m)break}return(v(),B)[d>>>2>>>0]=0,d-f},cm=o=>{for(var d=0,m=0;m<o.length;++m)65535<o.codePointAt(m)&&m++,d+=4;return d};function hm(o,d,m){if(o>>>=0,d>>>=0,m=Qe(m>>>=0),d===2)var f=om,$=um,E=lm;else f=dm,$=pm,E=cm;rt(o,{name:m,Rc:A=>{var M=(v(),D)[A>>>2>>>0];return M=f(A+4,M*d,!0),Je(A),M},Yc:(A,M)=>{if(typeof M!="string")throw new qt(`Cannot pass non-string to C++ string type ${m}`);var L=E(M),V=Zt(4+L+d);return(v(),D)[V>>>2>>>0]=L/d,$(M,V+4,L+d),A!==null&&A.push(Je,V),V},Xc:oi,Zc(A){Je(A)}})}function fm(o,d){rt(o>>>=0,{Cd:!0,name:d=Qe(d>>>0),Rc:()=>{},Yc:()=>{}})}function mm(o){gi(o>>>0,!i,1,!r,131072,!1),wn()}var br=o=>{if(!z)try{if(o(),!(0<Xe))try{a?Tr()&&yi(y):ti(y)}catch(d){d instanceof ve||d=="unwind"||p(0,d)}}catch(d){d instanceof ve||d=="unwind"||p(0,d)}},gm=!Atomics.waitAsync||globalThis.navigator?.userAgent&&91>Number((navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)||[])[2]);function ui(o){o>>>=0,gm||(Atomics.waitAsync((v(),B),o>>>2,o).value.then(wr),o+=128,Atomics.store((v(),B),o>>>2,1))}var wr=()=>br(()=>{var o=Tr();o&&(ui(o),bs())});function ym(o,d){(o>>>=0)==d>>>0?setTimeout(wr):a?postMessage({bd:o,Vc:"checkMailbox"}):(o=wt[o])&&o.postMessage({Vc:"checkMailbox"})}var li=[];function _m(o,d,m,f,$){for(d>>>=0,$>>>=0,li.length=0,m=$>>>3,f=$+f>>>3;m<f;){var E;E=(v(),J)[m++>>>0]?(v(),J)[m++>>>0]:(v(),Q)[m++>>>0],li.push(E)}return(d?$i[d]:ug[o])(...li)}var bm=()=>{Xe=0};function wm(o){o>>>=0,a?postMessage({Vc:"cleanupThread",Qd:o}):bn(wt[o])}function $m(o){}var $r=o=>{try{o()}catch(d){G(d)}};function vm(o){var d=(...m)=>{vr.push(o);try{return o(...m)}finally{z||(vr.pop(),Ye&&pt===1&&vr.length===0&&(pt=0,Xe+=1,$r(uo),typeof Fibers<"u"&&Fibers.de()))}};return Kn.set(o,d),d}var pt=0,Ye=null,Fn=0,vr=[],di=new Map,jn=new Map,Kn=new Map,xm=0,pi=null,Sm=[],Zn=o=>(function(d){if(!z){if(pt===0){var m=!1,f=!1;d(($=0)=>{if(!z&&(Fn=$,m=!0,f)){pt=2,$r(()=>lo(Ye)),typeof MainLoop<"u"&&MainLoop.xd&&MainLoop.resume(),$=!1;try{var E=(function(){var L=(v(),B)[Ye+8>>>2>>>0];return L=jn.get(L),L=Kn.get(L),--Xe,L()})()}catch(L){E=L,$=!0}var A=!1;if(!Ye){var M=pi;M&&(pi=null,($?M.reject:M.resolve)(E),A=!0)}if($&&!A)throw E}}),f=!0,m||(pt=1,Ye=(function(){var $=Zt(65548),E=$+12;if((v(),D)[$>>>2>>>0]=E,(v(),D)[$+4>>>2>>>0]=E+65536,E=vr[0],!di.has(E)){var A=xm++;di.set(E,A),jn.set(A,E)}return E=di.get(E),(v(),B)[$+8>>>2>>>0]=E,$})(),typeof MainLoop<"u"&&MainLoop.xd&&MainLoop.pause(),$r(()=>oo(Ye)))}else pt===2?(pt=0,$r(po),Je(Ye),Ye=null,Sm.forEach(br)):G(`invalid state: ${pt}`);return Fn}})(d=>{o().then(d)});function km(o){return o>>>=0,Zn(async()=>{var d=await Ue(o);return We(d)})}var ci=[],Tm=o=>{var d=ci.length;return ci.push(o),d},Im=(o,d)=>{for(var m=Array(o),f=0;f<o;++f){var $=f,E=(v(),D)[d+4*f>>>2>>>0],A=ni[E];if(A===void 0)throw o=`parameter ${f}`,E=hs(E),d=Qe(E),Je(E),new qt(`${o} has unknown type ${d}`);m[$]=A}return m},Em=(o,d,m)=>{var f=[];return o=o(f,m),f.length&&((v(),D)[d>>>2>>>0]=We(f)),o},zm={},xr=o=>{var d=zm[o];return d===void 0?Qe(o):d};function Cm(o,d,m){var[f,...$]=Im(o,d>>>0);d=f.Yc.bind(f);var E=$.map(L=>L.Xc.bind(L));o--;var A={toValue:Ue};switch(o=E.map((L,V)=>{var se=`argFromPtr${V}`;return A[se]=L,`${se}(args${V?"+"+8*V:""})`}),m){case 0:var M="toValue(handle)";break;case 2:M="new (toValue(handle))";break;case 3:M="";break;case 1:A.getStringOrSymbol=xr,M="toValue(handle)[getStringOrSymbol(methodName)]"}return M+=`(${o})`,f.Cd||(A.toReturnWire=d,A.emval_returnValue=Em,M=`return emval_returnValue(toReturnWire, destructorsRef, ${M})`),M=`return function (handle, methodName, destructorsRef, args) {
  ${M}
  }`,m=new Function(Object.keys(A),M)(...Object.values(A)),M=`methodCaller<(${$.map(L=>L.name)}) => ${f.name}>`,Tm(Object.defineProperty(m,"name",{value:M}))}function Am(o,d){return d>>>=0,(o=Ue(o>>>0))==Ue(d)}function Om(o){return(o>>>=0)?(o=xr(o),We(globalThis[o])):We(globalThis)}function Bm(o){return o=xr(o>>>0),We(t[o])}function Rm(o,d){return d>>>=0,o=Ue(o>>>0),d=Ue(d),We(o[d])}function Mm(o){9<(o>>>=0)&&($t[o+1]+=1)}function Xn(o,d,m,f,$){return ci[o>>>0](d>>>0,m>>>0,f>>>0,$>>>0)}function Nm(o,d,m,f,$){return Xn(o>>>0,d>>>0,m>>>0,f>>>0,$>>>0)}function Dm(){return We([])}function Um(o){o=Ue(o>>>0);for(var d=Array(o.length),m=0;m<o.length;m++)d[m]=o[m];return We(d)}function Pm(o){return We(xr(o>>>0))}function qm(){return We({})}function Lm(o){for(var d=Ue(o>>>=0);d.length;){var m=d.pop();d.pop()(m)}si(o)}function Wm(o,d,m){d>>>=0,m>>>=0,o=Ue(o>>>0),d=Ue(d),m=Ue(m),o[d]=m}function Vm(o,d){o=-9007199254740992>o||9007199254740992<o?NaN:Number(o),d>>>=0,o=new Date(1e3*o),(v(),B)[d>>>2>>>0]=o.getUTCSeconds(),(v(),B)[d+4>>>2>>>0]=o.getUTCMinutes(),(v(),B)[d+8>>>2>>>0]=o.getUTCHours(),(v(),B)[d+12>>>2>>>0]=o.getUTCDate(),(v(),B)[d+16>>>2>>>0]=o.getUTCMonth(),(v(),B)[d+20>>>2>>>0]=o.getUTCFullYear()-1900,(v(),B)[d+24>>>2>>>0]=o.getUTCDay(),o=(o.getTime()-Date.UTC(o.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,(v(),B)[d+28>>>2>>>0]=o}var Qn=o=>o%4==0&&(o%100!=0||o%400==0),Yn=[0,31,60,91,121,152,182,213,244,274,305,335],Jn=[0,31,59,90,120,151,181,212,243,273,304,334];function Gm(o,d){o=-9007199254740992>o||9007199254740992<o?NaN:Number(o),d>>>=0,o=new Date(1e3*o),(v(),B)[d>>>2>>>0]=o.getSeconds(),(v(),B)[d+4>>>2>>>0]=o.getMinutes(),(v(),B)[d+8>>>2>>>0]=o.getHours(),(v(),B)[d+12>>>2>>>0]=o.getDate(),(v(),B)[d+16>>>2>>>0]=o.getMonth(),(v(),B)[d+20>>>2>>>0]=o.getFullYear()-1900,(v(),B)[d+24>>>2>>>0]=o.getDay();var m=(Qn(o.getFullYear())?Yn:Jn)[o.getMonth()]+o.getDate()-1|0;(v(),B)[d+28>>>2>>>0]=m,(v(),B)[d+36>>>2>>>0]=-60*o.getTimezoneOffset(),m=new Date(o.getFullYear(),6,1).getTimezoneOffset();var f=new Date(o.getFullYear(),0,1).getTimezoneOffset();o=0|(m!=f&&o.getTimezoneOffset()==Math.min(f,m)),(v(),B)[d+32>>>2>>>0]=o}function Hm(o){o>>>=0;var d=new Date((v(),B)[o+20>>>2>>>0]+1900,(v(),B)[o+16>>>2>>>0],(v(),B)[o+12>>>2>>>0],(v(),B)[o+8>>>2>>>0],(v(),B)[o+4>>>2>>>0],(v(),B)[o>>>2>>>0],0),m=(v(),B)[o+32>>>2>>>0],f=d.getTimezoneOffset(),$=new Date(d.getFullYear(),6,1).getTimezoneOffset(),E=new Date(d.getFullYear(),0,1).getTimezoneOffset(),A=Math.min(E,$);return 0>m?(v(),B)[o+32>>>2>>>0]=+($!=E&&A==f):0<m!=(A==f)&&($=Math.max(E,$),d.setTime(d.getTime()+6e4*((0<m?A:$)-f))),(v(),B)[o+24>>>2>>>0]=d.getDay(),m=(Qn(d.getFullYear())?Yn:Jn)[d.getMonth()]+d.getDate()-1|0,(v(),B)[o+28>>>2>>>0]=m,(v(),B)[o>>>2>>>0]=d.getSeconds(),(v(),B)[o+4>>>2>>>0]=d.getMinutes(),(v(),B)[o+8>>>2>>>0]=d.getHours(),(v(),B)[o+12>>>2>>>0]=d.getDate(),(v(),B)[o+16>>>2>>>0]=d.getMonth(),(v(),B)[o+20>>>2>>>0]=d.getYear(),o=d.getTime(),BigInt(isNaN(o)?-1:o/1e3)}function es(o,d,m,f,$,E,A){return a?$e(16,1,o,d,m,f,$,E,A):-52}function ts(o,d,m,f,$,E){if(a)return $e(17,1,o,d,m,f,$,E)}var Kt={},Fm=()=>performance.timeOrigin+performance.now();function rs(o,d){if(a)return $e(18,1,o,d);if(Kt[o]&&(clearTimeout(Kt[o].id),delete Kt[o]),!d)return 0;var m=setTimeout(()=>{delete Kt[o],br(()=>_s(o,performance.timeOrigin+performance.now()))},d);return Kt[o]={id:m,ce:d},0}function jm(o,d,m,f){o>>>=0,d>>>=0,m>>>=0,f>>>=0;var $=new Date().getFullYear(),E=new Date($,0,1).getTimezoneOffset();$=new Date($,6,1).getTimezoneOffset();var A=Math.max(E,$);(v(),D)[o>>>2>>>0]=60*A,(v(),B)[d>>>2>>>0]=+(E!=$),o=(d=M=>{var L=Math.abs(M);return`UTC${0<=M?"-":"+"}${String(Math.floor(L/60)).padStart(2,"0")}${String(L%60).padStart(2,"0")}`})(E),d=d($),$<E?(dt(o,m,17),dt(d,f,17)):(dt(o,f,17),dt(d,m,17))}var Km=()=>Date.now();function Zm(o,d,m){return m>>>=0,0<=o&&3>=o?(o===0?o=Date.now():o=performance.timeOrigin+performance.now(),o=Math.round(1e6*o),(v(),J)[m>>>3>>>0]=BigInt(o),0):28}var hi=[],is=(o,d)=>{hi.length=0;for(var m;m=(v(),F)[o++>>>0];){var f=m!=105;d+=(f&=m!=112)&&d%8?4:0,hi.push(m==112?(v(),D)[d>>>2>>>0]:m==106?(v(),J)[d>>>3>>>0]:m==105?(v(),B)[d>>>2>>>0]:(v(),Q)[d>>>3>>>0]),d+=f?8:4}return hi};function Xm(o,d,m){return o>>>=0,d=is(d>>>0,m>>>0),$i[o](...d)}function Qm(o,d,m){return o>>>=0,d=is(d>>>0,m>>>0),$i[o](...d)}var Ym=()=>{};function Jm(o,d){return T(ke(o>>>0,d>>>0))}var eg=()=>{throw Xe+=1,"unwind"};function tg(){return 4294901760}var rg=()=>navigator.hardwareConcurrency,vt={},Sr=o=>{var d;return(d=/\bwasm-function\[\d+\]:(0x[0-9a-f]+)/.exec(o))?+d[1]:(d=/:(\d+):\d+(?:\)|$)/.exec(o))?2147483648|+d[1]:0},as=o=>{for(var d of o)(o=Sr(d))&&(vt[o]=d)};function ig(){var o=Error().stack.toString().split(`
`);return o[0]=="Error"&&o.shift(),as(o),vt.kd=Sr(o[3]),vt.Md=o,vt.kd}function kr(o){if(!(o=vt[o>>>0]))return 0;var d;if(d=/^\s+at .*\.wasm\.(.*) \(.*\)$/.exec(o))o=d[1];else if(d=/^\s+at (.*) \(.*\)$/.exec(o))o=d[1];else{if(!(d=/^(.+?)@/.exec(o)))return 0;o=d[1]}Je(kr.ld??0),d=_r(o)+1;var m=Zt(d);return m&&dt(o,m,d),kr.ld=m,kr.ld}function ag(o){o>>>=0;var d=(v(),F).length;if(o<=d||4294901760<o)return!1;for(var m=1;4>=m;m*=2){var f=d*(1+.2/m);f=Math.min(f,o+100663296);e:{f=(Math.min(4294901760,65536*Math.ceil(Math.max(o,f)/65536))-lt.buffer.byteLength+65535)/65536|0;try{lt.grow(f),ee();var $=1;break e}catch{}$=void 0}if($)return!0}return!1}function ng(o,d,m){if(o>>>=0,d>>>=0,vt.kd==o)var f=vt.Md;else(f=Error().stack.toString().split(`
`))[0]=="Error"&&f.shift(),as(f);for(var $=3;f[$]&&Sr(f[$])!=o;)++$;for(o=0;o<m&&f[o+$];++o)(v(),B)[d+4*o>>>2>>>0]=Sr(f[o+$]);return o}var fi,mi={},ns=()=>{if(!fi){var o,d={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(globalThis.navigator?.language??"C").replace("-","_")+".UTF-8",_:"./this.program"};for(o in mi)mi[o]===void 0?delete d[o]:d[o]=mi[o];var m=[];for(o in d)m.push(`${o}=${d[o]}`);fi=m}return fi};function ss(o,d){if(a)return $e(19,1,o,d);o>>>=0,d>>>=0;var m,f=0,$=0;for(m of ns()){var E=d+f;(v(),D)[o+$>>>2>>>0]=E,f+=dt(m,E,1/0)+1,$+=4}return 0}function os(o,d){if(a)return $e(20,1,o,d);o>>>=0,d>>>=0;var m=ns();for(var f of((v(),D)[o>>>2>>>0]=m.length,o=0,m))o+=_r(f)+1;return(v(),D)[d>>>2>>>0]=o,0}function us(o){return a?$e(21,1,o):52}function ls(o,d,m,f,$){return a?$e(22,1,o,d,m,f,$):52}function ds(o,d,m,f){return a?$e(23,1,o,d,m,f):52}function ps(o,d,m,f){return a?$e(24,1,o,d,m,f):70}var sg=[null,[],[]];function cs(o,d,m,f){if(a)return $e(25,1,o,d,m,f);d>>>=0,m>>>=0,f>>>=0;for(var $=0,E=0;E<m;E++){var A=(v(),D)[d>>>2>>>0],M=(v(),D)[d+4>>>2>>>0];d+=8;for(var L=0;L<M;L++){var V=o,se=(v(),F)[A+L>>>0],pe=sg[V];se===0||se===10?((V===1?k:T)(zn(pe)),pe.length=0):pe.push(se)}$+=M}return(v(),D)[f>>>2>>>0]=$,0}function og(o){return o>>>0}a||(function(){for(var o=t.numThreads-1;o--;)vn();me.push(async()=>{var d=(async function(){if(!a)return Promise.all(ut.map($n))})();we++,await d,--we==0&&Be&&(d=Be,Be=null,d())})})(),a||(lt=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0}),ee()),t.wasmBinary&&(g=t.wasmBinary),t.stackSave=()=>ue(),t.stackRestore=o=>oe(o),t.stackAlloc=o=>_i(o),t.setValue=function(o,d,m="i8"){switch(m.endsWith("*")&&(m="*"),m){case"i1":case"i8":(v(),P)[o>>>0]=d;break;case"i16":(v(),W)[o>>>1>>>0]=d;break;case"i32":(v(),B)[o>>>2>>>0]=d;break;case"i64":(v(),J)[o>>>3>>>0]=BigInt(d);break;case"float":(v(),H)[o>>>2>>>0]=d;break;case"double":(v(),Q)[o>>>3>>>0]=d;break;case"*":(v(),D)[o>>>2>>>0]=d;break;default:G(`invalid type for setValue: ${m}`)}},t.getValue=function(o,d="i8"){switch(d.endsWith("*")&&(d="*"),d){case"i1":case"i8":return(v(),P)[o>>>0];case"i16":return(v(),W)[o>>>1>>>0];case"i32":return(v(),B)[o>>>2>>>0];case"i64":return(v(),J)[o>>>3>>>0];case"float":return(v(),H)[o>>>2>>>0];case"double":return(v(),Q)[o>>>3>>>0];case"*":return(v(),D)[o>>>2>>>0];default:G(`invalid type for getValue: ${d}`)}},t.UTF8ToString=ke,t.stringToUTF8=dt,t.lengthBytesUTF8=_r;var hs,fs,Tr,Je,Zt,gi,ms,gs,ys,yi,_s,bs,le,Xt,ws,oe,_i,ue,$s,bi,vs,xs,Ss,wi,ks,Ts,Is,Es,zs,Cs,As,Os,Bs,Rs,Ms,Ns,Ds,Us,Ps,qs,Ls,Ws,Vs,Gs,Hs,Fs,js,Ks,Zs,Xs,Qs,Ys,Js,eo,to,ro,io,ao,no,so,oo,uo,lo,po,it,ug=[ei,yn,kn,Cn,An,On,Bn,Rn,Mn,Nn,Dn,Un,Pn,qn,Ln,Wn,es,ts,rs,ss,os,us,ls,ds,ps,cs],$i={1086876:(o,d,m,f,$)=>{if(t===void 0||!t.ad)return 1;if((o=ke(Number(o>>>0))).startsWith("./")&&(o=o.substring(2)),!(o=t.ad.get(o)))return 2;if(d=Number(d>>>0),m=Number(m>>>0),f=Number(f>>>0),d+m>o.byteLength)return 3;try{let E=o.subarray(d,d+m);switch($){case 0:(v(),F).set(E,f>>>0);break;case 1:t.Td?t.Td(f,E):t.Ld(f,E);break;default:return 4}return 0}catch{return 4}},1087700:(o,d,m)=>{t.wd(o,(v(),F).subarray(d>>>0,d+m>>>0))},1087764:()=>t.Vd(),1087806:o=>{t.vd(o)},1087843:()=>{t.Ed()},1087874:()=>{t.Fd()},1087903:()=>{t.Jd()},1087928:o=>t.Dd(o),1087961:o=>t.Hd(o),1087993:(o,d,m)=>{t.jd(Number(o),Number(d),Number(m),!0)},1088056:(o,d,m)=>{t.jd(Number(o),Number(d),Number(m))},1088113:()=>typeof wasmOffsetConverter<"u",1088170:o=>{t.bc("Abs",o,void 0)},1088221:o=>{t.bc("Neg",o,void 0)},1088272:o=>{t.bc("Floor",o,void 0)},1088325:o=>{t.bc("Ceil",o,void 0)},1088377:o=>{t.bc("Reciprocal",o,void 0)},1088435:o=>{t.bc("Sqrt",o,void 0)},1088487:o=>{t.bc("Exp",o,void 0)},1088538:o=>{t.bc("Erf",o,void 0)},1088589:o=>{t.bc("Sigmoid",o,void 0)},1088644:(o,d,m)=>{t.bc("HardSigmoid",o,{alpha:d,beta:m})},1088723:o=>{t.bc("HardSwish",o,void 0)},1088780:o=>{t.bc("Log",o,void 0)},1088831:o=>{t.bc("Sin",o,void 0)},1088882:o=>{t.bc("Cos",o,void 0)},1088933:o=>{t.bc("Tan",o,void 0)},1088984:o=>{t.bc("Asin",o,void 0)},1089036:o=>{t.bc("Acos",o,void 0)},1089088:o=>{t.bc("Atan",o,void 0)},1089140:o=>{t.bc("Sinh",o,void 0)},1089192:o=>{t.bc("Cosh",o,void 0)},1089244:o=>{t.bc("Asinh",o,void 0)},1089297:o=>{t.bc("Acosh",o,void 0)},1089350:o=>{t.bc("Atanh",o,void 0)},1089403:o=>{t.bc("Tanh",o,void 0)},1089455:o=>{t.bc("Not",o,void 0)},1089506:(o,d,m)=>{t.bc("Clip",o,{min:d,max:m})},1089575:o=>{t.bc("Clip",o,void 0)},1089627:(o,d)=>{t.bc("Elu",o,{alpha:d})},1089685:o=>{t.bc("Gelu",o,void 0)},1089737:o=>{t.bc("Relu",o,void 0)},1089789:(o,d)=>{t.bc("LeakyRelu",o,{alpha:d})},1089853:(o,d)=>{t.bc("ThresholdedRelu",o,{alpha:d})},1089923:(o,d)=>{t.bc("Cast",o,{to:d})},1089981:o=>{t.bc("Add",o,void 0)},1090032:o=>{t.bc("Sub",o,void 0)},1090083:o=>{t.bc("Mul",o,void 0)},1090134:o=>{t.bc("Div",o,void 0)},1090185:o=>{t.bc("Pow",o,void 0)},1090236:o=>{t.bc("Equal",o,void 0)},1090289:o=>{t.bc("Greater",o,void 0)},1090344:o=>{t.bc("GreaterOrEqual",o,void 0)},1090406:o=>{t.bc("Less",o,void 0)},1090458:o=>{t.bc("LessOrEqual",o,void 0)},1090517:(o,d,m,f,$)=>{t.bc("ReduceMean",o,{keepDims:!!d,noopWithEmptyAxes:!!m,axes:f?Array.from((v(),B).subarray(Number(f)>>>0,Number($)>>>0)):[]})},1090692:(o,d,m,f,$)=>{t.bc("ReduceMax",o,{keepDims:!!d,noopWithEmptyAxes:!!m,axes:f?Array.from((v(),B).subarray(Number(f)>>>0,Number($)>>>0)):[]})},1090866:(o,d,m,f,$)=>{t.bc("ReduceMin",o,{keepDims:!!d,noopWithEmptyAxes:!!m,axes:f?Array.from((v(),B).subarray(Number(f)>>>0,Number($)>>>0)):[]})},1091040:(o,d,m,f,$)=>{t.bc("ReduceProd",o,{keepDims:!!d,noopWithEmptyAxes:!!m,axes:f?Array.from((v(),B).subarray(Number(f)>>>0,Number($)>>>0)):[]})},1091215:(o,d,m,f,$)=>{t.bc("ReduceSum",o,{keepDims:!!d,noopWithEmptyAxes:!!m,axes:f?Array.from((v(),B).subarray(Number(f)>>>0,Number($)>>>0)):[]})},1091389:(o,d,m,f,$)=>{t.bc("ReduceL1",o,{keepDims:!!d,noopWithEmptyAxes:!!m,axes:f?Array.from((v(),B).subarray(Number(f)>>>0,Number($)>>>0)):[]})},1091562:(o,d,m,f,$)=>{t.bc("ReduceL2",o,{keepDims:!!d,noopWithEmptyAxes:!!m,axes:f?Array.from((v(),B).subarray(Number(f)>>>0,Number($)>>>0)):[]})},1091735:(o,d,m,f,$)=>{t.bc("ReduceLogSum",o,{keepDims:!!d,noopWithEmptyAxes:!!m,axes:f?Array.from((v(),B).subarray(Number(f)>>>0,Number($)>>>0)):[]})},1091912:(o,d,m,f,$)=>{t.bc("ReduceSumSquare",o,{keepDims:!!d,noopWithEmptyAxes:!!m,axes:f?Array.from((v(),B).subarray(Number(f)>>>0,Number($)>>>0)):[]})},1092092:(o,d,m,f,$)=>{t.bc("ReduceLogSumExp",o,{keepDims:!!d,noopWithEmptyAxes:!!m,axes:f?Array.from((v(),B).subarray(Number(f)>>>0,Number($)>>>0)):[]})},1092272:o=>{t.bc("Where",o,void 0)},1092325:(o,d,m)=>{t.bc("Transpose",o,{perm:d?Array.from((v(),B).subarray(Number(d)>>>0,Number(m)>>>0)):[]})},1092449:(o,d,m,f)=>{t.bc("DepthToSpace",o,{blocksize:d,mode:ke(m),format:f?"NHWC":"NCHW"})},1092582:(o,d,m,f)=>{t.bc("DepthToSpace",o,{blocksize:d,mode:ke(m),format:f?"NHWC":"NCHW"})},1092715:(o,d,m,f)=>{t.bc("DFT",o,{axis:d,inverse:m,onesided:f})},1092807:(o,d,m,f,$,E,A,M,L,V,se,pe,ye,be,ct)=>{t.bc("ConvTranspose",o,{format:L?"NHWC":"NCHW",autoPad:d,dilations:[m],group:f,kernelShape:[$],pads:[E,A],strides:[M],wIsConst:()=>!!(v(),P)[V>>>0],outputPadding:se?Array.from((v(),B).subarray(Number(se)>>>0,Number(pe)>>>0)):[],outputShape:ye?Array.from((v(),B).subarray(Number(ye)>>>0,Number(be)>>>0)):[],activation:ke(ct)})},1093240:(o,d,m,f,$,E,A,M,L,V,se,pe,ye,be)=>{t.bc("ConvTranspose",o,{format:M?"NHWC":"NCHW",autoPad:d,dilations:Array.from((v(),B).subarray(Number(m)>>>0,(Number(m)>>>0)+2>>>0)),group:f,kernelShape:Array.from((v(),B).subarray(Number($)>>>0,(Number($)>>>0)+2>>>0)),pads:Array.from((v(),B).subarray(Number(E)>>>0,(Number(E)>>>0)+4>>>0)),strides:Array.from((v(),B).subarray(Number(A)>>>0,(Number(A)>>>0)+2>>>0)),wIsConst:()=>!!(v(),P)[L>>>0],outputPadding:V?Array.from((v(),B).subarray(Number(V)>>>0,Number(se)>>>0)):[],outputShape:pe?Array.from((v(),B).subarray(Number(pe)>>>0,Number(ye)>>>0)):[],activation:ke(be)})},1093901:(o,d,m,f,$,E,A,M,L,V,se,pe,ye,be,ct)=>{t.bc("ConvTranspose",o,{format:L?"NHWC":"NCHW",autoPad:d,dilations:[m],group:f,kernelShape:[$],pads:[E,A],strides:[M],wIsConst:()=>!!(v(),P)[V>>>0],outputPadding:se?Array.from((v(),B).subarray(Number(se)>>>0,Number(pe)>>>0)):[],outputShape:ye?Array.from((v(),B).subarray(Number(ye)>>>0,Number(be)>>>0)):[],activation:ke(ct)})},1094334:(o,d,m,f,$,E,A,M,L,V,se,pe,ye,be)=>{t.bc("ConvTranspose",o,{format:M?"NHWC":"NCHW",autoPad:d,dilations:Array.from((v(),B).subarray(Number(m)>>>0,(Number(m)>>>0)+2>>>0)),group:f,kernelShape:Array.from((v(),B).subarray(Number($)>>>0,(Number($)>>>0)+2>>>0)),pads:Array.from((v(),B).subarray(Number(E)>>>0,(Number(E)>>>0)+4>>>0)),strides:Array.from((v(),B).subarray(Number(A)>>>0,(Number(A)>>>0)+2>>>0)),wIsConst:()=>!!(v(),P)[L>>>0],outputPadding:V?Array.from((v(),B).subarray(Number(V)>>>0,Number(se)>>>0)):[],outputShape:pe?Array.from((v(),B).subarray(Number(pe)>>>0,Number(ye)>>>0)):[],activation:ke(be)})},1094995:(o,d)=>{t.bc("GlobalAveragePool",o,{format:d?"NHWC":"NCHW"})},1095086:(o,d,m,f,$,E,A,M,L,V,se,pe,ye,be)=>{t.bc("AveragePool",o,{format:be?"NHWC":"NCHW",auto_pad:d,ceil_mode:m,count_include_pad:f,storage_order:$,dilations:E?Array.from((v(),B).subarray(Number(E)>>>0,Number(A)>>>0)):[],kernel_shape:M?Array.from((v(),B).subarray(Number(M)>>>0,Number(L)>>>0)):[],pads:V?Array.from((v(),B).subarray(Number(V)>>>0,Number(se)>>>0)):[],strides:pe?Array.from((v(),B).subarray(Number(pe)>>>0,Number(ye)>>>0)):[]})},1095565:(o,d)=>{t.bc("GlobalAveragePool",o,{format:d?"NHWC":"NCHW"})},1095656:(o,d,m,f,$,E,A,M,L,V,se,pe,ye,be)=>{t.bc("AveragePool",o,{format:be?"NHWC":"NCHW",auto_pad:d,ceil_mode:m,count_include_pad:f,storage_order:$,dilations:E?Array.from((v(),B).subarray(Number(E)>>>0,Number(A)>>>0)):[],kernel_shape:M?Array.from((v(),B).subarray(Number(M)>>>0,Number(L)>>>0)):[],pads:V?Array.from((v(),B).subarray(Number(V)>>>0,Number(se)>>>0)):[],strides:pe?Array.from((v(),B).subarray(Number(pe)>>>0,Number(ye)>>>0)):[]})},1096135:(o,d)=>{t.bc("GlobalMaxPool",o,{format:d?"NHWC":"NCHW"})},1096222:(o,d,m,f,$,E,A,M,L,V,se,pe,ye,be)=>{t.bc("MaxPool",o,{format:be?"NHWC":"NCHW",auto_pad:d,ceil_mode:m,count_include_pad:f,storage_order:$,dilations:E?Array.from((v(),B).subarray(Number(E)>>>0,Number(A)>>>0)):[],kernel_shape:M?Array.from((v(),B).subarray(Number(M)>>>0,Number(L)>>>0)):[],pads:V?Array.from((v(),B).subarray(Number(V)>>>0,Number(se)>>>0)):[],strides:pe?Array.from((v(),B).subarray(Number(pe)>>>0,Number(ye)>>>0)):[]})},1096697:(o,d)=>{t.bc("GlobalMaxPool",o,{format:d?"NHWC":"NCHW"})},1096784:(o,d,m,f,$,E,A,M,L,V,se,pe,ye,be)=>{t.bc("MaxPool",o,{format:be?"NHWC":"NCHW",auto_pad:d,ceil_mode:m,count_include_pad:f,storage_order:$,dilations:E?Array.from((v(),B).subarray(Number(E)>>>0,Number(A)>>>0)):[],kernel_shape:M?Array.from((v(),B).subarray(Number(M)>>>0,Number(L)>>>0)):[],pads:V?Array.from((v(),B).subarray(Number(V)>>>0,Number(se)>>>0)):[],strides:pe?Array.from((v(),B).subarray(Number(pe)>>>0,Number(ye)>>>0)):[]})},1097259:(o,d,m,f,$)=>{t.bc("Gemm",o,{alpha:d,beta:m,transA:f,transB:$})},1097363:o=>{t.bc("MatMul",o,void 0)},1097417:(o,d,m,f)=>{t.bc("ArgMax",o,{keepDims:!!d,selectLastIndex:!!m,axis:f})},1097525:(o,d,m,f)=>{t.bc("ArgMin",o,{keepDims:!!d,selectLastIndex:!!m,axis:f})},1097633:(o,d)=>{t.bc("Softmax",o,{axis:d})},1097696:(o,d)=>{t.bc("Concat",o,{axis:d})},1097756:(o,d,m,f,$)=>{t.bc("Split",o,{axis:d,numOutputs:m,splitSizes:f?Array.from((v(),B).subarray(Number(f)>>>0,Number($)>>>0)):[]})},1097912:o=>{t.bc("Expand",o,void 0)},1097966:(o,d)=>{t.bc("Gather",o,{axis:Number(d)})},1098037:(o,d)=>{t.bc("GatherElements",o,{axis:Number(d)})},1098116:(o,d)=>{t.bc("GatherND",o,{batch_dims:Number(d)})},1098195:(o,d,m,f,$,E,A,M,L,V,se)=>{t.bc("Resize",o,{antialias:d,axes:m?Array.from((v(),B).subarray(Number(m)>>>0,Number(f)>>>0)):[],coordinateTransformMode:ke($),cubicCoeffA:E,excludeOutside:A,extrapolationValue:M,keepAspectRatioPolicy:ke(L),mode:ke(V),nearestMode:ke(se)})},1098557:(o,d,m,f,$,E,A)=>{t.bc("Slice",o,{starts:d?Array.from((v(),B).subarray(Number(d)>>>0,Number(m)>>>0)):[],ends:f?Array.from((v(),B).subarray(Number(f)>>>0,Number($)>>>0)):[],axes:E?Array.from((v(),B).subarray(Number(E)>>>0,Number(A)>>>0)):[]})},1098821:o=>{t.bc("Tile",o,void 0)},1098873:(o,d,m)=>{t.bc("InstanceNormalization",o,{epsilon:d,format:m?"NHWC":"NCHW"})},1098987:(o,d,m)=>{t.bc("InstanceNormalization",o,{epsilon:d,format:m?"NHWC":"NCHW"})},1099101:o=>{t.bc("Range",o,void 0)},1099154:(o,d)=>{t.bc("Einsum",o,{equation:ke(d)})},1099235:(o,d,m,f,$)=>{t.bc("Pad",o,{mode:d,value:m,pads:f?Array.from((v(),B).subarray(Number(f)>>>0,Number($)>>>0)):[]})},1099378:(o,d,m,f,$,E)=>{t.bc("BatchNormalization",o,{epsilon:d,momentum:m,spatial:!!$,trainingMode:!!f,format:E?"NHWC":"NCHW"})},1099547:(o,d,m,f,$,E)=>{t.bc("BatchNormalization",o,{epsilon:d,momentum:m,spatial:!!$,trainingMode:!!f,format:E?"NHWC":"NCHW"})},1099716:(o,d,m)=>{t.bc("CumSum",o,{exclusive:Number(d),reverse:Number(m)})},1099813:(o,d,m)=>{t.bc("DequantizeLinear",o,{axis:d,blockSize:m})},1099903:(o,d,m,f,$)=>{t.bc("GridSample",o,{align_corners:d,mode:ke(m),padding_mode:ke(f),format:$?"NHWC":"NCHW"})},1100073:(o,d,m,f,$)=>{t.bc("GridSample",o,{align_corners:d,mode:ke(m),padding_mode:ke(f),format:$?"NHWC":"NCHW"})},1100243:(o,d)=>{t.bc("ScatterND",o,{reduction:ke(d)})},1100328:(o,d,m,f,$,E,A,M,L)=>{t.bc("Attention",o,{numHeads:d,isUnidirectional:m,maskFilterValue:f,scale:$,doRotary:E,qkvHiddenSizes:A?Array.from((v(),B).subarray(Number(M)>>>0,Number(M)+A>>>0)):[],pastPresentShareBuffer:!!L})},1100600:o=>{t.bc("BiasAdd",o,void 0)},1100655:o=>{t.bc("BiasSplitGelu",o,void 0)},1100716:o=>{t.bc("FastGelu",o,void 0)},1100772:(o,d,m,f,$,E,A,M,L,V,se,pe,ye,be,ct,vi)=>{t.bc("Conv",o,{format:pe?"NHWC":"NCHW",auto_pad:d,dilations:m?Array.from((v(),B).subarray(Number(m)>>>0,Number(f)>>>0)):[],group:$,kernel_shape:E?Array.from((v(),B).subarray(Number(E)>>>0,Number(A)>>>0)):[],pads:M?Array.from((v(),B).subarray(Number(M)>>>0,Number(L)>>>0)):[],strides:V?Array.from((v(),B).subarray(Number(V)>>>0,Number(se)>>>0)):[],w_is_const:()=>!!(v(),P)[Number(ye)>>>0],activation:ke(be),activation_params:ct?Array.from((v(),H).subarray(Number(ct)>>>0,Number(vi)>>>0)):[]})},1101356:o=>{t.bc("Gelu",o,void 0)},1101408:(o,d,m,f,$,E,A,M,L)=>{t.bc("GroupQueryAttention",o,{numHeads:d,kvNumHeads:m,scale:f,softcap:$,doRotary:E,rotaryInterleaved:A,smoothSoftmax:M,localWindowSize:L})},1101625:(o,d,m,f)=>{t.bc("LayerNormalization",o,{axis:d,epsilon:m,simplified:!!f})},1101736:(o,d,m,f)=>{t.bc("LayerNormalization",o,{axis:d,epsilon:m,simplified:!!f})},1101847:(o,d,m,f,$,E)=>{t.bc("MatMulNBits",o,{k:d,n:m,accuracyLevel:f,bits:$,blockSize:E})},1101974:(o,d,m,f,$,E)=>{t.bc("MultiHeadAttention",o,{numHeads:d,isUnidirectional:m,maskFilterValue:f,scale:$,doRotary:E})},1102133:(o,d)=>{t.bc("QuickGelu",o,{alpha:d})},1102197:(o,d,m,f,$)=>{t.bc("RotaryEmbedding",o,{interleaved:!!d,numHeads:m,rotaryEmbeddingDim:f,scale:$})},1102336:(o,d,m)=>{t.bc("SkipLayerNormalization",o,{epsilon:d,simplified:!!m})},1102438:(o,d,m)=>{t.bc("SkipLayerNormalization",o,{epsilon:d,simplified:!!m})},1102540:(o,d,m,f)=>{t.bc("GatherBlockQuantized",o,{gatherAxis:d,quantizeAxis:m,blockSize:f})},1102661:o=>{t.Id(o)},1102695:(o,d)=>t.Kd(Number(o),Number(d),t.$c.Nd,t.$c.errors)};function lg(o,d,m){return Zn(async()=>{await t.Gd(Number(o),Number(d),Number(m))})}function dg(){return typeof wasmOffsetConverter<"u"}function pg(o,d,m,f){var $=ue();try{return Os(o,d,m,f)}catch(E){if(oe($),E!==E+0)throw E;le(1,0)}}function cg(o,d,m){var f=ue();try{return Es(o,d,m)}catch($){if(oe(f),$!==$+0)throw $;le(1,0)}}function hg(o){var d=ue();try{ks(o)}catch(m){if(oe(d),m!==m+0)throw m;le(1,0)}}function fg(o,d){var m=ue();try{return wi(o,d)}catch(f){if(oe(m),f!==f+0)throw f;le(1,0)}}function mg(o,d,m){var f=ue();try{Ss(o,d,m)}catch($){if(oe(f),$!==$+0)throw $;le(1,0)}}function gg(o,d){var m=ue();try{Bs(o,d)}catch(f){if(oe(m),f!==f+0)throw f;le(1,0)}}function yg(o,d,m,f,$,E,A){var M=ue();try{return Cs(o,d,m,f,$,E,A)}catch(L){if(oe(M),L!==L+0)throw L;le(1,0)}}function _g(o,d,m,f,$,E){var A=ue();try{Ts(o,d,m,f,$,E)}catch(M){if(oe(A),M!==M+0)throw M;le(1,0)}}function bg(o,d,m,f){var $=ue();try{As(o,d,m,f)}catch(E){if(oe($),E!==E+0)throw E;le(1,0)}}function wg(o,d,m,f,$){var E=ue();try{Is(o,d,m,f,$)}catch(A){if(oe(E),A!==A+0)throw A;le(1,0)}}function $g(o,d,m,f,$,E,A){var M=ue();try{Ms(o,d,m,f,$,E,A)}catch(L){if(oe(M),L!==L+0)throw L;le(1,0)}}function vg(o,d,m,f,$,E,A){var M=ue();try{Ns(o,d,m,f,$,E,A)}catch(L){if(oe(M),L!==L+0)throw L;le(1,0)}}function xg(o,d,m,f,$,E,A,M){var L=ue();try{qs(o,d,m,f,$,E,A,M)}catch(V){if(oe(L),V!==V+0)throw V;le(1,0)}}function Sg(o,d,m,f,$){var E=ue();try{return Rs(o,d,m,f,$)}catch(A){if(oe(E),A!==A+0)throw A;le(1,0)}}function kg(o,d,m){var f=ue();try{return Ls(o,d,m)}catch($){if(oe(f),$!==$+0)throw $;le(1,0)}}function Tg(o,d,m,f,$,E,A,M){var L=ue();try{Ws(o,d,m,f,$,E,A,M)}catch(V){if(oe(L),V!==V+0)throw V;le(1,0)}}function Ig(o,d,m,f,$,E,A,M,L,V,se,pe){var ye=ue();try{Ds(o,d,m,f,$,E,A,M,L,V,se,pe)}catch(be){if(oe(ye),be!==be+0)throw be;le(1,0)}}function Eg(o,d,m){var f=ue();try{return Vs(o,d,m)}catch($){if(oe(f),$!==$+0)throw $;return le(1,0),0n}}function zg(o,d,m,f,$,E,A,M,L){var V=ue();try{zs(o,d,m,f,$,E,A,M,L)}catch(se){if(oe(V),se!==se+0)throw se;le(1,0)}}function Cg(o){var d=ue();try{return Gs(o)}catch(m){if(oe(d),m!==m+0)throw m;le(1,0)}}function Ag(o,d){var m=ue();try{return so(o,d)}catch(f){if(oe(m),f!==f+0)throw f;return le(1,0),0n}}function Og(o,d,m,f){var $=ue();try{return Hs(o,d,m,f)}catch(E){if(oe($),E!==E+0)throw E;le(1,0)}}function Bg(o){var d=ue();try{return Fs(o)}catch(m){if(oe(d),m!==m+0)throw m;return le(1,0),0n}}function Rg(o,d,m,f){var $=ue();try{return Ys(o,d,m,f)}catch(E){if(oe($),E!==E+0)throw E;le(1,0)}}function Mg(o,d,m,f,$){var E=ue();try{return Js(o,d,m,f,$)}catch(A){if(oe(E),A!==A+0)throw A;le(1,0)}}function Ng(o,d,m,f,$,E){var A=ue();try{return eo(o,d,m,f,$,E)}catch(M){if(oe(A),M!==M+0)throw M;le(1,0)}}function Dg(o,d,m,f,$,E){var A=ue();try{return Us(o,d,m,f,$,E)}catch(M){if(oe(A),M!==M+0)throw M;le(1,0)}}function Ug(o,d,m,f,$,E){var A=ue();try{return to(o,d,m,f,$,E)}catch(M){if(oe(A),M!==M+0)throw M;le(1,0)}}function Pg(o,d,m,f,$,E,A,M){var L=ue();try{return Ps(o,d,m,f,$,E,A,M)}catch(V){if(oe(L),V!==V+0)throw V;le(1,0)}}function qg(o,d,m,f,$){var E=ue();try{return ro(o,d,m,f,$)}catch(A){if(oe(E),A!==A+0)throw A;return le(1,0),0n}}function Lg(o,d,m,f){var $=ue();try{return io(o,d,m,f)}catch(E){if(oe($),E!==E+0)throw E;le(1,0)}}function Wg(o,d,m,f){var $=ue();try{return ao(o,d,m,f)}catch(E){if(oe($),E!==E+0)throw E;le(1,0)}}function Vg(o,d,m,f,$,E,A,M,L,V,se,pe){var ye=ue();try{return no(o,d,m,f,$,E,A,M,L,V,se,pe)}catch(be){if(oe(ye),be!==be+0)throw be;le(1,0)}}function Gg(o,d,m,f,$,E,A,M,L,V,se){var pe=ue();try{Xs(o,d,m,f,$,E,A,M,L,V,se)}catch(ye){if(oe(pe),ye!==ye+0)throw ye;le(1,0)}}function Hg(o,d,m,f,$,E,A,M,L,V,se,pe,ye,be,ct,vi){var Zg=ue();try{Qs(o,d,m,f,$,E,A,M,L,V,se,pe,ye,be,ct,vi)}catch(xi){if(oe(Zg),xi!==xi+0)throw xi;le(1,0)}}function Fg(o,d,m){var f=ue();try{return js(o,d,m)}catch($){if(oe(f),$!==$+0)throw $;le(1,0)}}function jg(o,d,m){var f=ue();try{return Ks(o,d,m)}catch($){if(oe(f),$!==$+0)throw $;le(1,0)}}function Kg(o,d,m,f){var $=ue();try{Zs(o,d,m,f)}catch(E){if(oe($),E!==E+0)throw E;le(1,0)}}function Ir(){if(0<we)Be=Ir;else if(a)w?.(t),Y();else{for(var o=me;0<o.length;)o.shift()(t);0<we?Be=Ir:(t.calledRun=!0,z||(Y(),w?.(t)))}}return a||(it=await Ae(),Ir()),t.PTR_SIZE=4,U?t:new Promise((o,d)=>{w=o,S=d})}var vp,fo,g0=q(()=>{"use strict";vp=ho,fo=globalThis.self?.name?.startsWith("em-pthread"),fo&&ho()}),zi,Ia,mo,Me,xp,zr,go,yo,Ci,_o,Ai,Sp,Oi,kp,Ha=q(()=>{"use strict";Ga(),zi=typeof location>"u"?void 0:location.origin,Ia=import.meta.url>"file:"&&import.meta.url<"file;",mo=()=>{if(Ia){let e=URL;return new URL(new e("ort.bundle.min.mjs",import.meta.url).href,zi).href}return import.meta.url},Me=mo(),xp=()=>{if(Me&&!Me.startsWith("blob:"))return Me.substring(0,Me.lastIndexOf("/")+1)},zr=(e,t)=>{try{let r=t??Me;return(r?new URL(e,r):new URL(e)).origin===zi}catch{return!1}},go=(e,t)=>{let r=t??Me;try{return(r?new URL(e,r):new URL(e)).href}catch{return}},yo=(e,t)=>`${t??"./"}${e}`,Ci=async e=>{let t=await(await fetch(e,{credentials:"same-origin"})).blob();return URL.createObjectURL(t)},_o=async e=>(await import(e)).default,Ai=(m0(),cr(bp)).default,Sp=async()=>{if(!Me)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(zr(Me))return[void 0,Ai()];let e=await Ci(Me);return[e,Ai(e)]},Oi=(g0(),cr($p)).default,kp=async(e,t,r,i)=>{let a=Oi&&!(e||t);if(a)if(Me)a=zr(Me)||i&&!r;else if(i&&!r)a=!0;else throw new Error("cannot determine the script source URL.");if(a)return[void 0,Oi];{let n="ort-wasm-simd-threaded.jsep.mjs",s=e??go(n,t),u=r&&s&&!zr(s,t),l=u?await Ci(s):s??yo(n,t);return[u?l:void 0,await _o(l)]}}}),Bi,Cr,Yt,Ri,bo,wo,$o,Fa,_e,Dt=q(()=>{"use strict";Ha(),Cr=!1,Yt=!1,Ri=!1,bo=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},wo=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},$o=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},Fa=async e=>{if(Cr)return Promise.resolve();if(Yt)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(Ri)throw new Error("previous call to 'initializeWebAssembly()' failed.");Yt=!0;let t=e.initTimeout,r=e.numThreads;if(e.simd!==!1){if(e.simd==="relaxed"){if(!$o())throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.")}else if(!wo())throw new Error("WebAssembly SIMD is not supported in the current environment.")}let i=bo();r>1&&!i&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+r+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),e.numThreads=r=1);let a=e.wasmPaths,n=typeof a=="string"?a:void 0,s=a?.mjs,u=s?.href??s,l=a?.wasm,p=l?.href??l,c=e.wasmBinary,[h,g]=await kp(u,n,r>1,!!c||!!p),_=!1,y=[];if(t>0&&y.push(new Promise(w=>{setTimeout(()=>{_=!0,w()},t)})),y.push(new Promise((w,S)=>{let x={numThreads:r};if(c)x.wasmBinary=c,x.locateFile=b=>b;else if(p||n)x.locateFile=b=>p??n+b;else if(u&&u.indexOf("blob:")!==0)x.locateFile=b=>new URL(b,u).href;else if(h){let b=xp();b&&(x.locateFile=I=>b+I)}g(x).then(b=>{Yt=!1,Cr=!0,Bi=b,w(),h&&URL.revokeObjectURL(h)},b=>{Yt=!1,Ri=!0,S(b)})})),await Promise.race(y),_)throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},_e=()=>{if(Cr&&Bi)return Bi;throw new Error("WebAssembly is not initialized yet.")}}),Ke,Fr,fe,ja=q(()=>{"use strict";Dt(),Ke=(e,t)=>{let r=_e(),i=r.lengthBytesUTF8(e)+1,a=r._malloc(i);return r.stringToUTF8(e,a,i),t.push(a),a},Fr=(e,t,r,i)=>{if(typeof e=="object"&&e!==null){if(r.has(e))throw new Error("Circular reference in options");r.add(e)}Object.entries(e).forEach(([a,n])=>{let s=t?t+a:a;if(typeof n=="object")Fr(n,s+".",r,i);else if(typeof n=="string"||typeof n=="number")i(s,n.toString());else if(typeof n=="boolean")i(s,n?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof n}`)})},fe=e=>{let t=_e(),r=t.stackSave();try{let i=t.PTR_SIZE,a=t.stackAlloc(2*i);t._OrtGetLastError(a,a+i);let n=Number(t.getValue(a,i===4?"i32":"i64")),s=t.getValue(a+i,"*"),u=s?t.UTF8ToString(s):"";throw new Error(`${e} ERROR_CODE: ${n}, ERROR_MESSAGE: ${u}`)}finally{t.stackRestore(r)}}}),Tp,y0=q(()=>{"use strict";Dt(),ja(),Tp=e=>{let t=_e(),r=0,i=[],a=e||{};try{if(e?.logSeverityLevel===void 0)a.logSeverityLevel=2;else if(typeof e.logSeverityLevel!="number"||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log severity level is not valid: ${e.logSeverityLevel}`);if(e?.logVerbosityLevel===void 0)a.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!="number"||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);e?.terminate===void 0&&(a.terminate=!1);let n=0;return e?.tag!==void 0&&(n=Ke(e.tag,i)),r=t._OrtCreateRunOptions(a.logSeverityLevel,a.logVerbosityLevel,!!a.terminate,n),r===0&&fe("Can't create run options."),e?.extra!==void 0&&Fr(e.extra,"",new WeakSet,(s,u)=>{let l=Ke(s,i),p=Ke(u,i);t._OrtAddRunConfigEntry(r,l,p)!==0&&fe(`Can't set a run config entry: ${s} - ${u}.`)}),[r,i]}catch(n){throw r!==0&&t._OrtReleaseRunOptions(r),i.forEach(s=>t._free(s)),n}}}),vo,xo,So,xt,ko,Ip,_0=q(()=>{"use strict";Dt(),ja(),vo=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"layout":return 3;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}},xo=e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}},So=e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some(r=>(typeof r=="string"?r:r.name)==="webgpu")&&(e.enableMemPattern=!1)},xt=(e,t,r,i)=>{let a=Ke(t,i),n=Ke(r,i);_e()._OrtAddSessionConfigEntry(e,a,n)!==0&&fe(`Can't set a session config entry: ${t} - ${r}.`)},ko=async(e,t,r)=>{let i=t.executionProviders;for(let a of i){let n=typeof a=="string"?a:a.name,s=[];switch(n){case"webnn":if(n="WEBNN",xt(e,"session.disable_quant_qdq","1",r),xt(e,"session.disable_qdq_constant_folding","1",r),typeof a!="string"){let h=a?.deviceType;h&&xt(e,"deviceType",h,r)}break;case"webgpu":if(n="JS",typeof a!="string"){let h=a;if(h?.preferredLayout){if(h.preferredLayout!=="NCHW"&&h.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${h.preferredLayout}`);xt(e,"preferredLayout",h.preferredLayout,r)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${n}`)}let u=Ke(n,r),l=s.length,p=0,c=0;if(l>0){p=_e()._malloc(l*_e().PTR_SIZE),r.push(p),c=_e()._malloc(l*_e().PTR_SIZE),r.push(c);for(let h=0;h<l;h++)_e().setValue(p+h*_e().PTR_SIZE,s[h][0],"*"),_e().setValue(c+h*_e().PTR_SIZE,s[h][1],"*")}await _e()._OrtAppendExecutionProvider(e,u,p,c,l)!==0&&fe(`Can't append execution provider: ${n}.`)}},Ip=async e=>{let t=_e(),r=0,i=[],a=e||{};So(a);try{let n=vo(a.graphOptimizationLevel??"all"),s=xo(a.executionMode??"sequential"),u=typeof a.logId=="string"?Ke(a.logId,i):0,l=a.logSeverityLevel??2;if(!Number.isInteger(l)||l<0||l>4)throw new Error(`log severity level is not valid: ${l}`);let p=a.logVerbosityLevel??0;if(!Number.isInteger(p)||p<0||p>4)throw new Error(`log verbosity level is not valid: ${p}`);let c=typeof a.optimizedModelFilePath=="string"?Ke(a.optimizedModelFilePath,i):0;if(r=t._OrtCreateSessionOptions(n,!!a.enableCpuMemArena,!!a.enableMemPattern,s,!!a.enableProfiling,0,u,l,p,c),r===0&&fe("Can't create session options."),a.executionProviders&&await ko(r,a,i),a.enableGraphCapture!==void 0){if(typeof a.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${a.enableGraphCapture}`);xt(r,"enableGraphCapture",a.enableGraphCapture.toString(),i)}if(a.freeDimensionOverrides)for(let[h,g]of Object.entries(a.freeDimensionOverrides)){if(typeof h!="string")throw new Error(`free dimension override name must be a string: ${h}`);if(typeof g!="number"||!Number.isInteger(g)||g<0)throw new Error(`free dimension override value must be a non-negative integer: ${g}`);let _=Ke(h,i);t._OrtAddFreeDimensionOverride(r,_,g)!==0&&fe(`Can't set a free dimension override: ${h} - ${g}.`)}return a.extra!==void 0&&Fr(a.extra,"",new WeakSet,(h,g)=>{xt(r,h,g,i)}),[r,i]}catch(n){throw r!==0&&t._OrtReleaseSessionOptions(r)!==0&&fe("Can't release session options."),i.forEach(s=>t._free(s)),n}}}),Ct,st,At,Jr,jr,Ka,Za,Ea,re=q(()=>{"use strict";Ct=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data type: ${e}`)}},st=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw new Error(`unsupported data type: ${e}`)}},At=(e,t)=>{let r=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],i=typeof t=="number"?t:t.reduce((a,n)=>a*n,1);return r>0?Math.ceil(i*r):void 0},Jr=e=>{switch(e){case"float16":return typeof Float16Array<"u"?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${e}`)}},jr=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}},Ka=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",Za=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint64"||e==="int8"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",Ea=e=>{switch(e){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${e}`)}}}),Xa,Ep=q(()=>{"use strict";Ga(),Xa=async e=>{if(typeof e=="string"){let t=await fetch(e);if(!t.ok)throw new Error(`failed to load external data file: ${e}`);let r=t.headers.get("Content-Length"),i=r?parseInt(r,10):0;if(i<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw new Error(`failed to load external data file: ${e}, no response body.`);let a=t.body.getReader(),n;try{n=new ArrayBuffer(i)}catch(u){if(u instanceof RangeError){let l=Math.ceil(i/65536);n=new WebAssembly.Memory({initial:l,maximum:l}).buffer}else throw u}let s=0;for(;;){let{done:u,value:l}=await a.read();if(u)break;let p=l.byteLength;new Uint8Array(n,s,p).set(l),s+=p}return new Uint8Array(n,0,i)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),To,Io,Eo,zo,Qa,Co,de,ot=q(()=>{"use strict";re(),To=["V","I","W","E","F"],Io=(e,t)=>{console.log(`[${To[e]},${new Date().toISOString()}]${t}`)},Qa=(e,t)=>{Eo=e,zo=t},Co=(e,t)=>{let r=jr(e),i=jr(Eo);r>=i&&Io(r,typeof t=="function"?t():t)},de=(...e)=>{zo&&Co(...e)}}),Ao,Gt,O,Kr,zp,Cp,Ap,ie=q(()=>{"use strict";Ao=class{static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}},Gt=class{static calcShape(e,t,r=!1){let i=e.length,a=t.length;if(i===0)return t;if(a===0)return e;let n=Math.max(e.length,t.length),s=new Array(n);if(r){if(i<2||a<2)return;let u=Ao.calcMatMulShape([e[i-2],e[i-1]],[t[a-2],t[a-1]]);if(u===void 0)return;[s[n-2],s[n-1]]=u}for(let u=r?3:1;u<=n;u++){let l=i-u<0?1:e[i-u],p=a-u<0?1:t[a-u];if(l!==p&&l>1&&p>1)return;let c=Math.max(l,p);if(l&&p)s[n-u]=Math.max(l,p);else{if(c>1)return;s[n-u]=0}}return s}static isValidBroadcast(e,t){let r=e.length,i=t.length;if(r>i)return!1;for(let a=1;a<=r;a++)if(e[r-a]!==1&&e[r-a]!==t[i-a])return!1;return!0}},O=class Wr{static size(t){return Wr.getSizeFromDimensionRange(t,0,t.length)}static convertShape(t,r=4){let i=t.length;if(i===0)return[];let a=new Array(i),n=i-1;for(;n>=0;){if(t[n]%r===0){a[n]=t[n]/r;break}if(r%t[n]!==0)throw new Error("cannot convert shape");a[n]=1,r/=t[n],n--}for(n--;n>=0;n--)a[n]=t[n];return a}static sizeFromDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return Wr.getSizeFromDimensionRange(t,r,t.length)}static sizeToDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeToDimension as Tensor has ${t.length} dimensions.`);return Wr.getSizeFromDimensionRange(t,0,r)}static getSizeFromDimensionRange(t,r,i){let a=1;for(let n=r;n<i;n++){if(t[n]<0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");a*=Number(t[n])}return a}static computeStrides(t){let r=t.length;if(r===0)return[];if(r===1)return[1];let i=new Array(r);i[r-1]=1,i[r-2]=t[r-1];for(let a=r-3;a>=0;--a)i[a]=i[a+1]*t[a+1];return i}static normalizeAxis(t,r){if(t<-r&&t>=r)throw new Error("unsupported axis for this operation.");return t<0?t+r:t}static normalizeAxes(t,r){return t.map(i=>this.normalizeAxis(i,r??t.length))}static sortBasedOnPerm(t,r){return r?r.map(i=>t[i]):t.slice().reverse()}static padShape(t,r){let i=t.length;return t.map((a,n)=>a+r[n]+r[n+i])}static areEqual(t,r){return t.length!==r.length?!1:t.every((i,a)=>i===r[a])}},Kr=class yt{static adjustPoolAttributes(t,r,i,a,n,s){if(!t&&i.length!==r.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(t)for(let u=0;u<r.length-2;u++)u>=i.length?i.push(r[u+2]):i[u]=r[u+2];for(let u=0;u<i.length;u++)if(u<a.length){if(a[u]<0)throw new Error("strides should be greater than or equal to 1")}else a.push(1);for(let u=0;u<i.length;u++)if(u<n.length){if(n[u]<0)throw new Error("dilations should be greater than or equal to 1")}else n.push(1);for(let u=0;u<i.length*2;u++)if(u<s.length){if(s[u]<0)throw new Error("pad should be greater than or equal to 1")}else s.push(0);for(let u=0;u<i.length;u++){if(i[u]<=0)throw new Error("kernel shapes need to be greater than 0");if(s[u]>=i[u]||s[u+i.length]>=i[u])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,r,i,a,n,s,u){if(u){if(n.length!==2*(t.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(r.length!==t.length-2)throw new Error("length of strides should be the length of data dimensions");if(a.length!==t.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let l=0;l<t.length-2;l++)yt.adjustPadAndReturnShape(t[l+(s?1:2)],r[l],i[l],a[l],n,l,l+t.length-2,u)}}static computePoolOutputShape(t,r,i,a,n,s,u,l=0){if(r.length<=0)throw new Error("input shape must be of size greater than 0");let p=[r[0],r[1]];return yt.computeShapeHelper(t,r,p,i,a,n,s,u,l),p}static computeConvOutputShape(t,r,i,a,n,s,u){if(t.length<=0||r.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let l=[t[0],r[0]];return yt.computeShapeHelper(!1,t,l,i,a,n,s,u),l}static computeShapeHelper(t,r,i,a,n,s,u,l,p=0){if(t)for(let c=0;c<r.length-2;c++)i.push(1);else for(let c=0;c<r.length-2;c++)i.push(yt.adjustPadAndReturnShape(r[c+2],a[c],n[c],s[c],u,c,c+r.length-2,l,p))}static computeOutputSize(t,r,i,a,n){let s=Math.floor(t/r)+1;return n===1&&(s=Math.ceil(t/r)+1,(s-1)*r>=i+a&&(s-=1)),s}static adjustPadAndReturnShape(t,r,i,a,n,s,u,l,p=0){let c=i*(a-1)+1;if(l&&l!=="NOTSET")switch(l){case"VALID":return n[s]=0,n[u]=0,yt.computeOutputSize(t-c,r,t,0,p);case"SAME_LOWER":case"SAME_UPPER":if(i!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let h=(Math.floor((t+r-1)/r)-1)*r+a-t;return n[s]=Math.floor(l==="SAME_LOWER"?(h+1)/2:h/2),n[u]=h-n[s],yt.computeOutputSize(t+n[s]+n[u]-c,r,t,n[s],p)}default:throw new Error("Unsupported AutoPad type")}else return yt.computeOutputSize(t+n[s]+n[u]-c,r,t,n[s],p)}},zp=class{static getShapeOfGemmResult(e,t,r,i,a){if(e.length!==2||r.length!==2)throw new Error("shape need to be of size 2");let n,s,u;t?(n=e[1],s=e[0]):(n=e[0],s=e[1]);let l=-1;if(i?(u=r[0],l=1):(u=r[1],l=0),r[l]!==s)throw new Error("dimension mismatch");if(n<=0||u<=0||s<=0)throw new Error("invalid shape specified");if(a&&!Gt.isValidBroadcast(a,[n,u]))throw new Error("gemm: invalid bias shape for broadcast");return[n,u,s]}},Cp=-34028234663852886e22,Ap=34028234663852886e22}),Ya,Op=q(()=>{"use strict";re(),Ya=(e,t)=>new(Jr(t))(e)}),Mi,Oo,Ni,Bo,Di,Ro,Ui,Pi,qi,Mo,Bp,b0=q(()=>{"use strict";re(),ot(),Mi=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),Oo=(e,t)=>{if(t==="int32")return e;let r=Mi.get(t);if(!r)throw new Error(`WebNN backend does not support data type: ${t}`);let i=r/8;if(e.byteLength%i!==0)throw new Error(`Invalid Uint8Array length - must be a multiple of ${i}.`);let a=e.byteLength/i,n=new(Jr(t))(e.buffer,e.byteOffset,a);switch(t){case"int64":case"uint64":{let s=new Int32Array(a);for(let u=0;u<a;u++){let l=n[u];if(l>2147483647n||l<-2147483648n)throw new Error("Can not convert int64 data to int32 - value out of range.");s[u]=Number(l)}return new Uint8Array(s.buffer)}case"int8":case"uint8":case"uint32":{if(t==="uint32"&&n.some(u=>u>2147483647))throw new Error("Can not convert uint32 data to int32 - value out of range.");let s=Int32Array.from(n,Number);return new Uint8Array(s.buffer)}default:throw new Error(`Unsupported data conversion from ${t} to 'int32'`)}},Ni=(e,t)=>{if(t==="int32")return e;if(e.byteLength%4!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");let r=e.byteLength/4,i=new Int32Array(e.buffer,e.byteOffset,r);switch(t){case"int64":{let a=BigInt64Array.from(i,BigInt);return new Uint8Array(a.buffer)}case"uint64":{if(i.some(n=>n<0))throw new Error("Can not convert int32 data to uin64 - negative value found.");let a=BigUint64Array.from(i,BigInt);return new Uint8Array(a.buffer)}case"int8":{if(i.some(n=>n<-128||n>127))throw new Error("Can not convert int32 data to int8 - value out of range.");let a=Int8Array.from(i,Number);return new Uint8Array(a.buffer)}case"uint8":{if(i.some(a=>a<0||a>255))throw new Error("Can not convert int32 data to uint8 - value out of range.");return Uint8Array.from(i,Number)}case"uint32":{if(i.some(n=>n<0))throw new Error("Can not convert int32 data to uint32 - negative value found.");let a=Uint32Array.from(i,Number);return new Uint8Array(a.buffer)}default:throw new Error(`Unsupported data conversion from 'int32' to ${t}`)}},Bo=1,Di=()=>Bo++,Ro=new Map([["int8","int32"],["uint8","int32"],["uint32","int32"],["int64","int32"]]),Ui=(e,t)=>{let r=Mi.get(e);if(!r)throw new Error(`WebNN backend does not support data type: ${e}`);return t.length>0?Math.ceil(t.reduce((i,a)=>i*a)*r/8):0},Pi=class{constructor(e){this.isDataConverted=!1;let{sessionId:t,context:r,tensor:i,dataType:a,shape:n,fallbackDataType:s}=e;this.sessionId=t,this.mlContext=r,this.mlTensor=i,this.dataType=a,this.tensorShape=n,this.fallbackDataType=s}get tensor(){return this.mlTensor}get type(){return this.dataType}get fallbackType(){return this.fallbackDataType}get shape(){return this.tensorShape}get byteLength(){return Ui(this.dataType,this.tensorShape)}destroy(){de("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e){if(this.fallbackDataType){let t=await this.mlContext.readTensor(this.mlTensor),r=Ni(new Uint8Array(t),this.dataType);if(e){(e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)).set(r);return}else return new Uint8Array(r).buffer}else return e?this.mlContext.readTensor(this.mlTensor,e):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(e,t,r){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===r.length&&this.tensorShape.every((i,a)=>i===r[a])}setIsDataConverted(e){this.isDataConverted=e}},qi=class{constructor(e,t){this.tensorManager=e,this.wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,r,i){let a=this.tensorManager.getMLContext(e),n=this.tensorManager.getMLOpSupportLimits(e),s;if(!n?.input.dataTypes.includes(t)){if(s=Ro.get(t),!s||!n?.input.dataTypes.includes(s))throw new Error(`WebNN backend does not support data type: ${t}`);de("verbose",()=>`[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${t} to ${s}`)}if(this.wrapper){if(this.wrapper.canReuseTensor(a,t,r))return this.wrapper.tensor;if(i){if(this.wrapper.byteLength!==Ui(t,r))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let u=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,t,r,u,!0,!0,s),i&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){let t=e;if(this.wrapper){if(this.wrapper.fallbackType)if(this.wrapper.fallbackType==="int32")t=Oo(e,this.wrapper.type),this.wrapper.setIsDataConverted(!0);else throw new Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);if(e.byteLength===this.wrapper.byteLength){this.wrapper.write(t);return}else de("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor()}this.activeUpload?this.activeUpload.set(t):this.activeUpload=new Uint8Array(t)}async download(e){if(this.activeUpload){let t=this.wrapper?.isDataConverted?Ni(this.activeUpload,this.wrapper?.type):this.activeUpload;if(e){e instanceof ArrayBuffer?new Uint8Array(e).set(t):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(t);return}else return t.buffer}if(!this.wrapper)throw new Error("Tensor has not been created.");return e?this.wrapper.read(e):this.wrapper.read()}},Mo=class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){let t=this.backend.getMLContext(e);if(!t)throw new Error("MLContext not found for session.");return t}getMLOpSupportLimits(e){return this.backend.getMLOpSupportLimits(e)}reserveTensorId(){let e=Di();return this.tensorTrackersById.set(e,new qi(this)),e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(t.tensorWrapper))}async ensureTensor(e,t,r,i,a){de("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${r}, shape: ${i}, copyOld: ${a}}`);let n=this.tensorTrackersById.get(t);if(!n)throw new Error("Tensor not found.");return n.ensureTensor(e,r,i,a)}upload(e,t){let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");r.upload(t)}async download(e,t){de("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t?.byteLength}}`);let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");return r.download(t)}releaseTensorsForSession(e){for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,r,i){let a=this.getMLContext(e),n=Di(),s=new Pi({sessionId:e,context:a,tensor:t,dataType:r,shape:i});return this.tensorTrackersById.set(n,new qi(this,s)),this.externalTensors.add(s),n}async getCachedTensor(e,t,r,i,a,n,s){let u=this.getMLContext(e);for(let[p,c]of this.freeTensors.entries())if(c.canReuseTensor(u,t,r)){de("verbose",()=>`[WebNN] Reusing tensor {dataType: ${t}, ${s?`fallbackDataType: ${s},`:""} shape: ${r}`);let h=this.freeTensors.splice(p,1)[0];return h.sessionId=e,h}de("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${t}, ${s?`fallbackDataType: ${s},`:""} shape: ${r}}`);let l=await u.createTensor({dataType:s??t,shape:r,dimensions:r,usage:i,writable:a,readable:n});return new Pi({sessionId:e,context:u,tensor:l,dataType:t,shape:r,fallbackDataType:s})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},Bp=(...e)=>new Mo(...e)}),Jt,No,Rp,w0=q(()=>{"use strict";re(),Dt(),Op(),b0(),ot(),Jt=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),No=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let r=Object.keys(e).sort(),i=Object.keys(t).sort();return r.length===i.length&&r.every((a,n)=>a===i[n]&&e[a]===t[a])},Rp=class{constructor(e){this.tensorManager=Bp(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.sessionGraphOutputs=new Map,this.temporaryGraphInputs=[],this.temporaryGraphOutputs=[],this.temporarySessionTensorIds=new Map,this.mlOpSupportLimitsBySessionId=new Map,Qa(e.logLevel,!!e.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(e){de("verbose",()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){de("verbose",()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let r of t)de("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${r}}`),this.tensorManager.releaseTensorId(r);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let r=this.mlContextCache.findIndex(i=>i.gpuDevice===e);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:i}),i}}else if(e===void 0){let r=this.mlContextCache.findIndex(i=>i.options===void 0&&i.gpuDevice===void 0);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:i}),i}}let t=this.mlContextCache.findIndex(r=>No(r.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;{let r=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:r}),r}}registerMLContext(e,t){this.mlContextBySessionId.set(e,t);let r=this.sessionIdsByMLContext.get(t);r||(r=new Set,this.sessionIdsByMLContext.set(t,r)),r.add(e),this.mlOpSupportLimitsBySessionId.has(e)||this.mlOpSupportLimitsBySessionId.set(e,t.opSupportLimits()),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[]),this.temporaryGraphOutputs.length>0&&(this.sessionGraphOutputs.set(e,this.temporaryGraphOutputs),this.temporaryGraphOutputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e),this.sessionGraphOutputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e),this.mlOpSupportLimitsBySessionId.delete(e);let r=this.sessionIdsByMLContext.get(t);if(r.delete(e),r.size===0){this.sessionIdsByMLContext.delete(t);let i=this.mlContextCache.findIndex(a=>a.mlContext===t);i!==-1&&this.mlContextCache.splice(i,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}getMLOpSupportLimits(e){return this.mlOpSupportLimitsBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){de("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,t,r,i,a){let n=Jt.get(r);if(!n)throw new Error(`Unsupported ONNX data type: ${r}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,t,n,i,a)}async createTemporaryTensor(e,t,r){de("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${r}}`);let i=Jt.get(t);if(!i)throw new Error(`Unsupported ONNX data type: ${t}`);let a=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,a,i,r,!1);let n=this.temporarySessionTensorIds.get(e);return n?n.push(a):this.temporarySessionTensorIds.set(e,[a]),a}uploadTensor(e,t){if(!_e().shouldTransferToMLTensor)throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");de("verbose",()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let r=await this.tensorManager.download(e);return Ya(r,t)}}registerMLTensor(e,t,r,i){let a=Jt.get(r);if(!a)throw new Error(`Unsupported ONNX data type: ${r}`);let n=this.tensorManager.registerTensor(e,t,a,i);return de("verbose",()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${a}, dimensions: ${i}} -> {tensorId: ${n}}`),n}registerGraphInput(e){this.temporaryGraphInputs.push(e)}registerGraphOutput(e){this.temporaryGraphOutputs.push(e)}isGraphInput(e,t){let r=this.sessionGraphInputs.get(e);return r?r.includes(t):!1}isGraphOutput(e,t){let r=this.sessionGraphOutputs.get(e);return r?r.includes(t):!1}isGraphInputOutputTypeSupported(e,t,r=!0){let i=Jt.get(Ct(t)),a=this.mlOpSupportLimitsBySessionId.get(e);return typeof i>"u"?!1:r?!!a?.input.dataTypes.includes(i):!!a?.output.dataTypes.includes(i)}flush(){}}}),Ja=q(()=>{"use strict"}),Li,Ar,Or,Do,Uo,Wi,za,Po,Mp,$0=q(()=>{"use strict";ot(),Ja(),Li=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),Ar=[],Or=e=>Math.ceil(Number(e)/16)*16,Do=e=>{for(let t=0;t<Ar.length;t++){let r=Ar[t];if(e<=r)return r}return Math.ceil(e/16)*16},Uo=1,Wi=()=>Uo++,za=async(e,t,r,i)=>{let a=Or(r),n=e.device.createBuffer({size:a,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let s=e.getCommandEncoder();e.endComputePass(),s.copyBufferToBuffer(t,0,n,0,a),e.flush(),await n.mapAsync(GPUMapMode.READ);let u=n.getMappedRange();if(i){let l=i();return l.set(new Uint8Array(u,0,r)),l}else return new Uint8Array(u.slice(0,r))}finally{n.destroy()}},Po=class{constructor(e){this.backend=e,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[t]of Li)Ar.push(t),this.freeBuffers.set(t,[]),this.freeUniformBuffers.set(t,[]);this.sessionCount=0}upload(e,t){let r=t.buffer,i=t.byteOffset,a=t.byteLength,n=Or(a),s=this.storageCache.get(e);if(!s)throw new Error("gpu data for uploading does not exist");if(Number(s.originalSize)!==a)throw new Error(`inconsistent data size. gpu data size=${s.originalSize}, data size=${a}`);if(n===a&&i%4===0)this.backend.device.queue.writeBuffer(s.gpuData.buffer,0,r,i,a);else{let u=new Uint8Array(n);u.set(t),this.backend.device.queue.writeBuffer(s.gpuData.buffer,0,u,0,n)}de("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${e})`)}memcpy(e,t){let r=this.storageCache.get(e);if(!r)throw new Error("source gpu data for memcpy does not exist");let i=this.storageCache.get(t);if(!i)throw new Error("destination gpu data for memcpy does not exist");if(r.originalSize!==i.originalSize)throw new Error("inconsistent source and destination gpu data size");let a=Or(r.originalSize),n=this.backend.getCommandEncoder();this.backend.endComputePass(),n.copyBufferToBuffer(r.gpuData.buffer,0,i.gpuData.buffer,0,a)}registerExternalBuffer(e,t,r){let i;if(r){if(i=r[0],e===r[1])return de("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, buffer is the same, skip.`),i;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else i=Wi();return this.storageCache.set(i,{gpuData:{id:i,type:0,buffer:e},originalSize:t}),de("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, registered.`),i}unregisterExternalBuffer(e){e!==void 0&&(this.storageCache.delete(e),de("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`))}create(e,t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let r=Do(e),i,a=(t&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,n=(t&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(a||n){let u=(a?this.freeBuffers:this.freeUniformBuffers).get(r);u?u.length>0?i=u.pop():i=this.backend.device.createBuffer({size:r,usage:t}):i=this.backend.device.createBuffer({size:r,usage:t})}else i=this.backend.device.createBuffer({size:r,usage:t});let s={id:Wi(),type:0,buffer:i};return this.storageCache.set(s.id,{gpuData:s,originalSize:Number(e)}),de("verbose",()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${s.id}`),s}get(e){return this.storageCache.get(e)?.gpuData}release(e){let t=typeof e=="bigint"?Number(e):e,r=this.storageCache.get(t);if(!r){if(this.storageCache.size===0)return 0;throw new Error("releasing data does not exist")}return de("verbose",()=>`[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${r.gpuData.id}`),this.storageCache.delete(t),this.buffersPending.push(r.gpuData.buffer),r.originalSize}async download(e,t){let r=this.storageCache.get(Number(e));if(!r)throw new Error("data does not exist");await za(this.backend,r.gpuData.buffer,r.originalSize,t)}refreshPendingBuffers(){if(this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let e of this.buffersPending){let t=Li.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let r=this.freeBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let r=this.freeUniformBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e));for(let t of this.buffersPending)e.push(t);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(e){let t=this.capturedPendingBuffers.get(e);t&&(t.forEach(r=>{r.destroy()}),this.capturedPendingBuffers.delete(e)),this.sessionCount-=1,this.sessionCount===0&&(de("warning",()=>"[WebGPU] Clearing webgpu buffer cache"),this.storageCache.forEach(r=>{r.gpuData.buffer.destroy()}),this.storageCache=new Map)}},Mp=(...e)=>new Po(...e)}),qo,he,Se=q(()=>{"use strict";qo=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},he=e=>new qo(e)}),Ht,Br,Ee,Ie,X,xe,Ca,Vt,_t,Z,er,R,j,Np,en,Lo,Dp,ae=q(()=>{"use strict";re(),ie(),Ht=64,Br=(e,t)=>{if(t===3)throw new Error("vec3 has same alignment as vec4, use vec4 instead");switch(Number(e)){case 10:return t>1?`vec${t}<f16>`:"f16";case 1:return t>1?`vec${t}<f32>`:"f32";case 6:return t>1?`vec${t}<i32>`:"i32";case 12:return t>1?`vec${t}<u32>`:"u32";case 7:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(t!==4)throw new Error("bool must be vec4");return["u32","vec4<bool>"];case 22:return"i32";case 21:return"u32";default:throw new Error(`Unknown data type: ${e}`)}},Ee=(e,t=1)=>{let r=Br(e,t);return typeof r=="string"?r:r[0]},Ie=(e,t=1)=>{let r=Br(e,t);return typeof r=="string"?r:r[1]},X=(...e)=>{let t=[];return e.forEach(r=>{r.length!==0&&t.push({type:12,data:r},{type:12,data:O.computeStrides(r)})}),t},xe=e=>e%4===0?4:e%2===0?2:1,Ca=(e="f32",t,r="0")=>!t||t===1?`${e}(${r})`:`vec${t}<${e}>(${r})`,Vt=(e,t,r)=>e==="f32"?r:t===1?`f32(${r})`:`vec${t}<f32>(${r})`,_t=(e,t)=>t===4?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:t===2?`(${e}.x + ${e}.y)`:t===3?`(${e}.x + ${e}.y + ${e}.z)`:e,Z=(e,t,r,i)=>e.startsWith("uniforms.")&&r>4?typeof t=="string"?i==="f16"?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:i==="f16"?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:r>1?`${e}[${t}]`:e,er=(e,t,r,i,a)=>{let n=typeof r=="number",s=n?r:r.length,u=[...new Array(s).keys()],l=s<2?"u32":s<=4?`vec${s}<u32>`:`array<u32, ${s}>`,p=Br(t,a),c=typeof p=="string"?p:p[1],h=typeof p=="string"?p:p[0],g={indices:l,value:c,storage:h,tensor:t},_=U=>typeof U=="string"?U:`${U}u`,y={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},w=n?"uniforms.":"",S=`${w}${e}_shape`,x=`${w}${e}_strides`,b="";for(let U=0;U<s-1;U++)b+=`
    let dim${U} = current / ${Z(x,U,s)};
    let rest${U} = current % ${Z(x,U,s)};
    indices[${U}] = dim${U};
    current = rest${U};
    `;b+=`indices[${s-1}] = current;`;let I=s<2?"":`
  fn o2i_${e}(offset: u32) -> ${g.indices} {
    var indices: ${g.indices};
    var current = offset;
    ${b}
    return indices;
  }`,k=U=>(y.offsetToIndices=!0,s<2?U:`o2i_${e}(${U})`),T=[];if(s>=2)for(let U=s-1;U>=0;U--)T.push(`${Z(x,U,s)} * (indices[${U}])`);let z=s<2?"":`
  fn i2o_${e}(indices: ${g.indices}) -> u32 {
    return ${T.join("+")};
  }`,C=U=>(y.indicesToOffset=!0,s<2?U:`i2o_${e}(${U})`),v=(...U)=>s===0?"0u":`${g.indices}(${U.map(_).join(",")})`,N=(U,ee)=>s<2?`${U}`:`${Z(U,ee,s)}`,P=(U,ee,Y)=>s<2?`${U}=${Y};`:`${Z(U,ee,s)}=${Y};`,F={},W=(U,ee)=>{y.broadcastedIndicesToOffset=!0;let Y=`${ee.name}broadcastedIndicesTo${e}Offset`;if(Y in F)return`${Y}(${U})`;let G=[];for(let Te=s-1;Te>=0;Te--){let Ae=ee.indicesGet("outputIndices",Te+ee.rank-s);G.push(`${N(x,Te)} * (${Ae} % ${N(S,Te)})`)}return F[Y]=`fn ${Y}(outputIndices: ${ee.type.indices}) -> u32 {
             return ${G.length>0?G.join("+"):"0u"};
           }`,`${Y}(${U})`},K=(U,ee)=>(()=>{if(g.storage===g.value)return`${e}[${U}]=${ee};`;if(g.storage==="vec2<u32>"&&g.value==="i32")return`${e}[${U}]=vec2<u32>(u32(${ee}), select(0u, 0xFFFFFFFFu, ${ee} < 0));`;if(g.storage==="vec2<u32>"&&g.value==="u32")return`${e}[${U}]=vec2<u32>(u32(${ee}), 0u);`;if(g.storage==="u32"&&g.value==="vec4<bool>")return`${e}[${U}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${ee}));`;throw new Error(`not supported combination of storage type ${g.storage} and value type ${g.value} yet`)})(),B=U=>(()=>{if(g.storage===g.value)return`${e}[${U}]`;if(g.storage==="vec2<u32>"&&g.value==="i32")return`i32(${e}[${U}].x)`;if(g.storage==="vec2<u32>"&&g.value==="u32")return`u32(${e}[${U}].x)`;if(g.storage==="u32"&&g.value==="vec4<bool>")return`vec4<bool>(bool(${e}[${U}] & 0xFFu), bool(${e}[${U}] & 0xFF00u), bool(${e}[${U}] & 0xFF0000u), bool(${e}[${U}] & 0xFF000000u))`;throw new Error(`not supported combination of storage type ${g.storage} and value type ${g.value} yet`)})(),D=s<2?"":`
  fn get_${e}ByIndices(indices: ${g.indices}) -> ${c} {
    return ${B(`i2o_${e}(indices)`)};
  }`,H=s<2?"":(()=>{let U=u.map(Y=>`d${Y}: u32`).join(", "),ee=u.map(Y=>`d${Y}`).join(", ");return`
  fn get_${e}(${U}) -> ${c} {
    return get_${e}ByIndices(${v(ee)});
  }`})(),Q=(...U)=>{if(U.length!==s)throw new Error(`indices length must be ${s}`);let ee=U.map(_).join(",");return s===0?B("0u"):s===1?B(ee[0]):(y.get=!0,y.getByIndices=!0,y.indicesToOffset=!0,`get_${e}(${ee})`)},J=U=>s<2?B(U):(y.getByIndices=!0,y.indicesToOffset=!0,`get_${e}ByIndices(${U})`),te=s<2?"":`
  fn set_${e}ByIndices(indices: ${g.indices}, value: ${c}) {
    ${K(`i2o_${e}(indices)`,"value")}
  }`,ne=s<2?"":(()=>{let U=u.map(Y=>`d${Y}: u32`).join(", "),ee=u.map(Y=>`d${Y}`).join(", ");return`
  fn set_${e}(${U}, value: ${c}) {
    set_${e}ByIndices(${v(ee)}, value);
  }`})();return{impl:()=>{let U=[],ee=!1;return y.offsetToIndices&&(U.push(I),ee=!0),y.indicesToOffset&&(U.push(z),ee=!0),y.broadcastedIndicesToOffset&&(Object.values(F).forEach(Y=>U.push(Y)),ee=!0),y.set&&(U.push(ne),ee=!0),y.setByIndices&&(U.push(te),ee=!0),y.get&&(U.push(H),ee=!0),y.getByIndices&&(U.push(D),ee=!0),!n&&ee&&U.unshift(`const ${S} = ${g.indices}(${r.join(",")});`,`const ${x} = ${g.indices}(${O.computeStrides(r).join(",")});`),U.join(`
`)},type:g,offsetToIndices:k,indicesToOffset:C,broadcastedIndicesToOffset:W,indices:v,indicesGet:N,indicesSet:P,set:(...U)=>{if(U.length!==s+1)throw new Error(`indices length must be ${s}`);let ee=U[s];if(typeof ee!="string")throw new Error("value must be string");let Y=U.slice(0,s).map(_).join(",");return s===0?K("0u",ee):s===1?K(Y[0],ee):(y.set=!0,y.setByIndices=!0,y.indicesToOffset=!0,`set_${e}(${Y}, ${ee})`)},setByOffset:K,setByIndices:(U,ee)=>s<2?K(U,ee):(y.setByIndices=!0,y.indicesToOffset=!0,`set_${e}ByIndices(${U}, ${ee});`),get:Q,getByOffset:B,getByIndices:J,usage:i,name:e,strides:x,shape:S,rank:s}},R=(e,t,r,i=1)=>er(e,t,r,"input",i),j=(e,t,r,i=1)=>er(e,t,r,"output",i),Np=(e,t,r)=>er(e,t,r,"atomicOutput",1),en=(e,t,r,i=1)=>er(e,t,r,"internal",i),Lo=class{constructor(e,t){this.normalizedDispatchGroup=e,this.limits=t,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${typeof e=="number"?`${e}u`:e}) { return; }`}mainStart(e=Ht){let t=typeof e=="number"?e:e[0],r=typeof e=="number"?1:e[1],i=typeof e=="number"?1:e[2];if(t>this.limits.maxComputeWorkgroupSizeX||r>this.limits.maxComputeWorkgroupSizeY||i>this.limits.maxComputeWorkgroupSizeZ)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(t*r*i>this.limits.maxComputeInvocationsPerWorkgroup)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let a=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1,n=a?`@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(local_invocation_id) local_id : vec3<u32>`:`@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`,s=a?`let global_idx = global_id.x;
         let workgroup_index = workgroup_id.x;`:`let workgroup_index = workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
             workgroup_id.y * num_workgroups[0] + workgroup_id.x;
         let global_idx = workgroup_index * ${t*r*i}u + local_idx;`;return`@compute @workgroup_size(${t}, ${r}, ${i})
  fn main(${n}) {
    ${s}
  `}appendVariableUniforms(e){e.rank!==0&&(e.shape.startsWith("uniforms.")&&this.uniforms.push({name:e.shape.replace("uniforms.",""),type:"u32",length:e.rank}),e.strides.startsWith("uniforms.")&&this.uniforms.push({name:e.strides.replace("uniforms.",""),type:"u32",length:e.rank}))}declareVariable(e,t){if(e.usage==="internal")throw new Error("cannot use internal variable with declareVariable(). use registerInternalVariables() instead.");this.variables.push(e),this.appendVariableUniforms(e);let r=e.usage==="input"?"read":"read_write",i=e.usage==="atomicOutput"?"atomic<i32>":e.type.storage;return`@group(0) @binding(${t}) var<storage, ${r}> ${e.name}: array<${i}>;`}declareVariables(...e){return e.map(t=>this.declareVariable(t,this.variableIndex++)).join(`
`)}registerInternalVariable(e){if(e.usage!=="internal")throw new Error("cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.");this.internalVariables.push(e),this.appendVariableUniforms(e)}registerInternalVariables(...e){return e.forEach(t=>this.registerInternalVariable(t)),this}registerUniform(e,t,r=1){return this.uniforms.push({name:e,type:t,length:r}),this}registerUniforms(e){return this.uniforms=this.uniforms.concat(e),this}uniformDeclaration(){if(this.uniforms.length===0)return"";let e=[];for(let{name:t,type:r,length:i}of this.uniforms)if(i&&i>4)r==="f16"?e.push(`@align(16) ${t}:array<mat2x4<${r}>, ${Math.ceil(i/8)}>`):e.push(`${t}:array<vec4<${r}>, ${Math.ceil(i/4)}>`);else{let a=i==null||i===1?r:`vec${i}<${r}>`;e.push(`${t}:${a}`)}return`
      struct Uniforms { ${e.join(", ")} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`}get additionalImplementations(){return this.uniformDeclaration()+this.variables.map(e=>e.impl()).join(`
`)+this.internalVariables.map(e=>e.impl()).join(`
`)}get variablesInfo(){if(this.uniforms.length===0)return;let e=t=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(t)];return this.uniforms.map(t=>[e(t.type),t.length??1])}},Dp=(e,t)=>new Lo(e,t)}),Wo,Vi,Vo,Go,Ho,Fo,De,Up,Pp,bt=q(()=>{"use strict";re(),ie(),Se(),ae(),Wo=(e,t)=>{if(!e||e.length!==1)throw new Error("Transpose requires 1 input.");if(t.length!==0&&t.length!==e[0].dims.length)throw new Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`)},Vi=(e,t)=>t.length!==0?t:[...new Array(e).keys()].reverse(),Vo=(e,t)=>O.sortBasedOnPerm(e,Vi(e.length,t)),Go=(e,t,r,i)=>{let a=`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`;for(let n=0;n<t;++n)a+=`a[${e[n]}]=i[${n}];`;return a+="return a;}"},Ho=(e,t)=>{let r=[],i=[];for(let a=0;a<e.length;++a)e[a]!==1&&r.push(e[a]),e[t[a]]!==1&&i.push(t[a]);return{newShape:r,newPerm:i}},Fo=(e,t)=>{let r=0;for(let i=0;i<e.length;++i)if(t[e[i]]!==1){if(e[i]<r)return!1;r=e[i]}return!0},De=(e,t)=>{let r=e.dataType,i=e.dims.length,a=Vi(i,t),n=Vo(e.dims,a),s=e.dims,u=n,l=i<2||Fo(a,e.dims),p;if(l)return p=y=>{let w=R("input",r,s,4),S=j("output",r,u,4);return`
  ${y.registerUniform("output_size","u32").declareVariables(w,S)}
  ${y.mainStart()}
    ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`},{name:"TransposeCopy",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let y=O.size(n);return{outputs:[{dims:n,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(y/64/4)},programUniforms:[{type:12,data:Math.ceil(y/4)}]}},getShaderSource:p};let{newShape:c,newPerm:h}=Ho(e.dims,a),g=O.areEqual(h,[2,3,1]),_=O.areEqual(h,[3,1,2]);if(c.length===2||g||_){s=g?[c[0],c[1]*c[2]]:_?[c[0]*c[1],c[2]]:c,u=[s[1],s[0]];let y=16;return p=w=>{let S=R("a",r,s.length),x=j("output",r,u.length);return`
  ${w.registerUniform("output_size","u32").declareVariables(S,x)}
  var<workgroup> tile : array<array<${x.type.value}, ${y+1}>, ${y}>;
  ${w.mainStart([y,y,1])}
    let stride = (uniforms.output_shape[1] - 1) / ${y} + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * ${y}u + local_id.x;
    let input_row = workgroup_id_x * ${y}u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${S.getByIndices(`${S.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * ${y}u + local_id.x;
    let output_row = workgroup_id_y * ${y}u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${x.setByIndices(`${x.type.indices}(output_row, output_col)`,"tile[local_id.x][local_id.y]")}
    }
  }`},{name:"TransposeShared",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let w=O.size(n);return{outputs:[{dims:n,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(u[1]/y),y:Math.ceil(u[0]/y)},programUniforms:[{type:12,data:w},...X(s,u)]}},getShaderSource:p}}return p=y=>{let w=R("a",r,s.length),S=j("output",r,u.length);return`
  ${y.registerUniform("output_size","u32").declareVariables(w,S)}

  ${Go(a,i,w,S)}

  ${y.mainStart()}
    ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${S.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${S.setByOffset("global_idx",w.getByIndices("aIndices"))}
  }`},{name:"Transpose",shaderCache:{hint:`${t}`,inputDependencies:["rank"]},getRunData:()=>{let y=O.size(n);return{outputs:[{dims:n,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(y/64)},programUniforms:[{type:12,data:y},...X(s,u)]}},getShaderSource:p}},Up=(e,t)=>{Wo(e.inputs,t.perm),e.compute(De(e.inputs[0],t.perm))},Pp=e=>he({perm:e.perm})}),jo,Ko,Zo,Xo,Qo,Yo,Jo,eu,tu,ru,Ve,qp,Lp,Wp,Vp,Gp,Hp,Fp,jp,Kp,Zp,v0=q(()=>{"use strict";re(),ie(),ae(),tn(),bt(),jo={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},Ko={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},Zo={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},Xo={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},Qo=(e,t)=>{let r=[];for(let i=t-e;i<t;++i)r.push(i);return r},Yo=(e,t)=>{let r=[],i=e.length;for(let n=0;n<i;n++)t.indexOf(n)===-1&&r.push(e[n]);let a=t.map(n=>e[n]);return[r,a]},Jo=(e,t)=>{let r=e.length+t.length,i=[],a=0;for(let n=0;n<r;n++)t.indexOf(n)===-1?i.push(e[a++]):i.push(1);return i},eu=(e,t)=>{for(let r=0;r<e.length;++r)if(e[e.length-r-1]!==t-1-r)return!1;return!0},tu=(e,t)=>{let r=[];if(!eu(e,t)){for(let i=0;i<t;++i)e.indexOf(i)===-1&&r.push(i);e.forEach(i=>r.push(i))}return r},ru=(e,t,r,i,a,n,s)=>{let u=r[0].dims,l=O.size(n),p=O.size(s),c=R("_A",r[0].dataType,u),h=j("output",a,n),g=64;l===1&&(g=256);let _=`
          var<workgroup> aBestValues : array<f32, ${g}>;
       `,y=w=>`
        ${w.registerUniform("reduceSize","u32").declareVariables(c,h)}
        ${_}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${w.mainStart(g)}

          let outputIndex = global_idx / ${g};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${Zo[i]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${g}) {
           let candidate = f32(${c.getByOffset("offset + k")});
           bestValue = ${jo[i]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${g}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${Ko[i]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${h.setByOffset("outputIndex",`${i==="mean"?`${h.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${h.type.storage}(${Xo[i]})`}`)};
         }
        }`;return{name:e,shaderCache:{hint:`${t};${g}`,inputDependencies:["type"]},getShaderSource:y,getRunData:()=>({outputs:[{dims:n,dataType:a}],dispatchGroup:{x:l},programUniforms:[{type:12,data:p}]})}},Ve=(e,t,r,i)=>{let a=e.inputs.length===1?r:Aa(e.inputs,r),n=a.axes;n.length===0&&!a.noopWithEmptyAxes&&(n=e.inputs[0].dims.map((_,y)=>y));let s=O.normalizeAxes(n,e.inputs[0].dims.length),u=s,l=e.inputs[0],p=tu(u,e.inputs[0].dims.length);p.length>0&&(l=e.compute(De(e.inputs[0],p),{inputs:[0],outputs:[-1]})[0],u=Qo(u.length,l.dims.length));let[c,h]=Yo(l.dims,u),g=c;a.keepDims&&(g=Jo(c,s)),e.compute(ru(t,a.cacheKey,[l],i,e.inputs[0].dataType,g,h),{inputs:[l]})},qp=(e,t)=>{Ve(e,"ReduceMeanShared",t,"mean")},Lp=(e,t)=>{Ve(e,"ReduceL1Shared",t,"l1")},Wp=(e,t)=>{Ve(e,"ReduceL2Shared",t,"l2")},Vp=(e,t)=>{Ve(e,"ReduceLogSumExpShared",t,"logSumExp")},Gp=(e,t)=>{Ve(e,"ReduceMaxShared",t,"max")},Hp=(e,t)=>{Ve(e,"ReduceMinShared",t,"min")},Fp=(e,t)=>{Ve(e,"ReduceProdShared",t,"prod")},jp=(e,t)=>{Ve(e,"ReduceSumShared",t,"sum")},Kp=(e,t)=>{Ve(e,"ReduceSumSquareShared",t,"sumSquare")},Zp=(e,t)=>{Ve(e,"ReduceLogSumShared",t,"logSum")}}),Ge,iu,Zr,Aa,He,au,nu,su,ou,uu,lu,du,pu,cu,hu,Fe,Xp,Qp,Yp,Jp,ec,tc,rc,ic,ac,nc,tn=q(()=>{"use strict";re(),ie(),Se(),ae(),v0(),Ge=e=>{if(!e||e.length===0||e.length>2)throw new Error("Reduce op requires 1 or 2 inputs.");if(e.length===2&&e[1].dims.length!==1)throw new Error("Invalid axes input dims.")},iu=e=>["","",`var value = ${e.getByIndices("input_indices")};`,""],Zr=(e,t,r,i,a,n,s=!1,u=!1)=>{let l=[],p=r[0].dims,c=p.length,h=O.normalizeAxes(a,c),g=!u&&h.length===0;p.forEach((w,S)=>{g||h.indexOf(S)>=0?s&&l.push(1):l.push(w)});let _=l.length,y=O.size(l);return{name:e,shaderCache:t,getShaderSource:w=>{let S=[],x=R("_A",r[0].dataType,c),b=j("output",n,_),I=i(x,b,h),k=I[2];for(let T=0,z=0;T<c;T++)g||h.indexOf(T)>=0?(s&&z++,k=`for(var j${T}: u32 = 0; j${T} < ${p[T]}; j${T}++) {
                  ${I[2].includes("last_index")?`let last_index = j${T};`:""}
                  ${x.indicesSet("input_indices",T,`j${T}`)}
                  ${k}
                }`):(S.push(`${x.indicesSet("input_indices",T,b.indicesGet("output_indices",z))};`),z++);return`

        ${w.registerUniform("output_size","u32").declareVariables(x,b)}

        ${w.mainStart()}
          ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${x.type.indices};
          let output_indices = ${b.offsetToIndices("global_idx")};

          ${S.join(`
`)}
          ${I[0]}       // init ops for reduce max/min
          ${I[1]}
          ${k}
          ${I[3]}
          ${I.length===4?b.setByOffset("global_idx","value"):I.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:l,dataType:n}],dispatchGroup:{x:Math.ceil(y/64)},programUniforms:[{type:12,data:y},...X(p,l)]})}},Aa=(e,t)=>{let r=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(i=>r.push(Number(i))),he({axes:r,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},He=(e,t,r,i)=>{let a=e.inputs,n=a.length===1?r:Aa(a,r);e.compute(Zr(t,{hint:n.cacheKey,inputDependencies:["rank"]},[a[0]],n.noopWithEmptyAxes&&n.axes.length===0?iu:i,n.axes,a[0].dataType,n.keepDims,n.noopWithEmptyAxes),{inputs:[0]})},au=(e,t)=>{Ge(e.inputs),He(e,"ReduceLogSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,"value = log(value);"])},nu=(e,t)=>{Ge(e.inputs),He(e,"ReduceL1",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += abs(${r.getByIndices("input_indices")});`,""])},su=(e,t)=>{Ge(e.inputs),He(e,"ReduceL2",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},ou=(e,t)=>{Ge(e.inputs),He(e,"ReduceLogSumExp",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += exp(${r.getByIndices("input_indices")});`,"value = log(value);"])},uu=(e,t)=>{Ge(e.inputs),He(e,"ReduceMax",t,(r,i,a)=>{let n=[];for(let s=0;s<r.rank;s++)(a.indexOf(s)>=0||a.length===0)&&n.push(r.indicesSet("input_indices",s,0));return[`${n.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = max(value, ${r.getByIndices("input_indices")});`,""]})},lu=(e,t)=>{Ge(e.inputs),He(e,"ReduceMean",t,(r,i,a)=>{let n=1;for(let s=0;s<r.rank;s++)(a.indexOf(s)>=0||a.length===0)&&(n*=e.inputs[0].dims[s]);return["var sum = f32(0);","",`sum += f32(${r.getByIndices("input_indices")});`,`let value = ${i.type.value}(sum / ${n});`]})},du=(e,t)=>{Ge(e.inputs),He(e,"ReduceMin",t,(r,i,a)=>{let n=[];for(let s=0;s<r.rank;s++)(a.indexOf(s)>=0||a.length===0)&&n.push(`input_indices[${s}] = 0;`);return[`${n.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = min(value, ${r.getByIndices("input_indices")});`,""]})},pu=(e,t)=>{Ge(e.inputs),He(e,"ReduceProd",t,(r,i)=>[`var value = ${i.type.storage}(1);`,"",`value *= ${r.getByIndices("input_indices")};`,""])},cu=(e,t)=>{Ge(e.inputs),He(e,"ReduceSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,""])},hu=(e,t)=>{Ge(e.inputs),He(e,"ReduceSumSquare",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += t * t;`,""])},Fe=(e,t,r)=>{if(t.length===0)return r;let i=1,a=1;for(let n=0;n<t.length;n++)t.indexOf(n)===-1?i*=e[n]:a*=e[n];return a<32&&i>1024},Xp=(e,t)=>{Fe(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?lu(e,t):qp(e,t)},Qp=(e,t)=>{Fe(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?nu(e,t):Lp(e,t)},Yp=(e,t)=>{Fe(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?su(e,t):Wp(e,t)},Jp=(e,t)=>{Fe(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?ou(e,t):Vp(e,t)},ec=(e,t)=>{Fe(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?uu(e,t):Gp(e,t)},tc=(e,t)=>{Fe(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?du(e,t):Hp(e,t)},rc=(e,t)=>{Fe(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?pu(e,t):Fp(e,t)},ic=(e,t)=>{Fe(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?cu(e,t):jp(e,t)},ac=(e,t)=>{Fe(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?hu(e,t):Kp(e,t)},nc=(e,t)=>{Fe(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?au(e,t):Zp(e,t)}}),Gi,sc,oc,Oa,x0=q(()=>{"use strict";re(),Se(),tn(),Gi=e=>{if(!e||e.length===0||e.length>2)throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(e[0].dataType!==1)throw new Error("Invalid input type.")},sc=(e,t)=>{Gi(e.inputs);let r=(i,a,n)=>{let s=[];for(let u=0;u<i.rank;u++)(n.indexOf(u)>=0||n.length===0)&&s.push(`input_indices[${u}] = 0;`);return[`${s.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?"<=":"<"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",a.setByOffset("global_idx","best_index")]};e.compute(Zr("ArgMin",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},oc=(e,t)=>{Gi(e.inputs);let r=(i,a,n)=>{let s=[];for(let u=0;u<i.rank;u++)(n.indexOf(u)>=0||n.length===0)&&s.push(`input_indices[${u}] = 0;`);return[`${s.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?">=":">"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",a.setByOffset("global_idx","best_index")]};e.compute(Zr("argMax",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},Oa=e=>he(e)}),fu,Rr,mu,gu,yu,fr,_u,uc,rn=q(()=>{"use strict";re(),ie(),Ja(),ae(),fu=(e,t)=>{let r=e[0],i=e[1],a=e[2],n=e[3],s=e[4],u=e[5];if(s&&u)throw new Error("Attention cannot have both past and attention_bias");if(r.dims.length!==3)throw new Error('Input "input" must have 3 dimensions');let l=r.dims[0],p=r.dims[1],c=r.dims[2];if(a.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimensions');if(i.dims.length!==2)throw new Error('Input "weights" is expected to have 2 dimensions');if(i.dims[0]!==c)throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(a.dims[0]!==i.dims[1])throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let h=a.dims[0]/3,g=h,_=g;if(t.qkvHiddenSizes.length>0){if(t.qkvHiddenSizes.length!==3)throw new Error("qkv_hidden_sizes attribute should have 3 elements");for(let I of t.qkvHiddenSizes)if(I%t.numHeads!==0)throw new Error("qkv_hidden_sizes should be divisible by num_heads");h=t.qkvHiddenSizes[0],g=t.qkvHiddenSizes[1],_=t.qkvHiddenSizes[2]}let y=p;if(h!==g)throw new Error("qkv_hidden_sizes first element should be same as the second");if(a.dims[0]!==h+g+_)throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let w=0;if(s){if(g!==_)throw new Error('Input "past" expect k_hidden_size == v_hidden_size');if(s.dims.length!==5)throw new Error('Input "past" must have 5 dimensions');if(s.dims[0]!==2)throw new Error('Input "past" first dimension must be 2');if(s.dims[1]!==l)throw new Error('Input "past" second dimension must be batch_size');if(s.dims[2]!==t.numHeads)throw new Error('Input "past" third dimension must be num_heads');if(s.dims[4]!==g/t.numHeads)throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');t.pastPresentShareBuffer||(w=s.dims[3])}let S=y+w,x=-1,b=0;if(n)throw new Error("Mask not supported");if(s)throw new Error("past is not supported");if(u){if(u.dims.length!==4)throw new Error('Input "attention_bias" must have 4 dimensions');if(u.dims[0]!==l||u.dims[1]!==t.numHeads||u.dims[2]!==p||u.dims[3]!==S)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:l,sequenceLength:p,pastSequenceLength:w,kvSequenceLength:y,totalSequenceLength:S,maxSequenceLength:x,inputHiddenSize:c,hiddenSize:h,vHiddenSize:_,headSize:Math.floor(h/t.numHeads),vHeadSize:Math.floor(_/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:b,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},Rr=(e,t,r)=>t&&e?`
      let total_sequence_length_input = u32(${t.getByOffset("0")});
      let present_sequence_length = max(total_sequence_length_input, uniforms.past_sequence_length);
      let is_subsequent_prompt: bool = sequence_length > 1 && sequence_length != total_sequence_length_input;
      let is_first_prompt: bool = is_subsequent_prompt == false && sequence_length == total_sequence_length_input;
      total_sequence_length = u32(${e?.getByOffset("batchIdx")}) + 1;
      var past_sequence_length: u32 = 0;
      if (is_first_prompt == false) {
        past_sequence_length = total_sequence_length - sequence_length;
      }
       `:`
    ${r?"let past_sequence_length = uniforms.past_sequence_length":""};
    let present_sequence_length = total_sequence_length;
    `,mu=(e,t,r,i,a,n,s,u)=>{let l=xe(s?1:n),p=64,c=n/l;c<p&&(p=32);let h=Math.ceil(n/l/p),g=[{type:12,data:t},{type:12,data:r},{type:12,data:i},{type:12,data:a},{type:12,data:c},{type:12,data:h}],_=Ee(e.dataType,l),y=Ie(1,l),w=["type"];s&&w.push("type"),u&&w.push("type");let S=x=>{let b=j("x",e.dataType,e.dims,l),I=[b],k=s?R("seq_lens",s.dataType,s.dims):void 0;k&&I.push(k);let T=u?R("total_sequence_length_input",u.dataType,u.dims):void 0;T&&I.push(T);let z=Ie(e.dataType),C=[{name:"batch_size",type:"u32"},{name:"num_heads",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"sequence_length",type:"u32"},{name:"total_sequence_length",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${p}>;
  var<workgroup> thread_sum: array<f32, ${p}>;
  ${x.registerUniforms(C).declareVariables(...I)}
  ${x.mainStart([p,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${Rr(k,T,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${p}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${s?"u32(past_sequence_length + workgroup_id.y + 1)":"total_sequence_length"};
    var thread_max_vector = ${y}(-3.4028234663852886e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${y}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(l){case 1:return"thread_max_vector";case 2:return"max(thread_max_vector.x, thread_max_vector.y)";case 4:return"max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";default:throw new Error(`Unsupported components: ${l}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.4028234663852886e+38f);
    for (var i = 0u; i < ${p}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${y}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${y}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(l){case 1:return"sum_vector";case 2:return"sum_vector.x + sum_vector.y";case 4:return"sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";default:throw new Error(`Unsupported components: ${l}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${p}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${b.type.value}(${z}(1.0) / ${z}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${y}(x[offset + i]);
        x[offset + i] = ${b.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${s?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${b.type.value}(${z}(0));
        }`:""};
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${p};${_};${l}`,inputDependencies:w},getShaderSource:S,getRunData:()=>({outputs:[],dispatchGroup:{x:1,y:a,z:t*r},programUniforms:g})}},gu=(e,t,r,i,a,n,s,u,l)=>{let p=s+n.kvSequenceLength,c=[n.batchSize,n.numHeads,n.sequenceLength,p],h=e>1&&i,g=n.kvNumHeads?n.kvNumHeads:n.numHeads,_=h?[n.batchSize,g,p,n.headSize]:void 0,y=n.nReps?n.nReps:1,w=n.scale===0?1/Math.sqrt(n.headSize):n.scale,S=xe(n.headSize),x=n.headSize/S,b=12,I={x:Math.ceil(p/b),y:Math.ceil(n.sequenceLength/b),z:n.batchSize*n.numHeads},k=[{type:12,data:n.sequenceLength},{type:12,data:x},{type:12,data:p},{type:12,data:n.numHeads},{type:12,data:n.headSize},{type:1,data:w},{type:12,data:s},{type:12,data:n.kvSequenceLength},{type:12,data:y}],T=h&&i&&O.size(i.dims)>0,z=["type","type"];T&&z.push("type"),a&&z.push("type"),u&&z.push("type"),l&&z.push("type");let C=[{dims:c,dataType:t.dataType,gpuDataType:0}];h&&C.push({dims:_,dataType:t.dataType,gpuDataType:0});let v=N=>{let P=R("q",t.dataType,t.dims,S),F=R("key",r.dataType,r.dims,S),W=[P,F];if(T){let te=R("past_key",i.dataType,i.dims,S);W.push(te)}a&&W.push(R("attention_bias",a.dataType,a.dims));let K=u?R("seq_lens",u.dataType,u.dims):void 0;K&&W.push(K);let B=l?R("total_sequence_length_input",l.dataType,l.dims):void 0;B&&W.push(B);let D=j("output",t.dataType,c),H=[D];h&&H.push(j("present_key",t.dataType,_,S));let Q=Ie(1,S),J=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${b}u;

  var<workgroup> tileQ: array<${P.type.storage}, ${b*b}>;
  var<workgroup> tileK: array<${P.type.storage}, ${b*b}>;
  ${N.registerUniforms(J).declareVariables(...W,...H)}
  ${N.mainStart([b,b,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${y===1?"headIdx":"headIdx / uniforms.n_reps"};
    let kv_num_heads = ${y===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${Rr(K,B,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${T&&h?"let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;":""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${h?"let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;":""}
    var value = ${Q}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${T&&h?`
              if (n + local_id.y < past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else if (n + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
                tileK[idx] = key[kOffset + (n + local_id.y - past_sequence_length) * uniforms.K + w + local_id.x];
              }`:`
          if (n + local_id.y < uniforms.kv_sequence_length) {
            tileK[idx] = key[kOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
          }`}
      ${h?`if (n + local_id.y < present_sequence_length) {
        present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];
      }`:""}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
          value += ${Q}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(S){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw new Error(`Unsupported components: ${S}`)}})()};
        output[outputIdx] = ${D.type.value} (sum * uniforms.alpha) + ${a?"attention_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${S};${a!==void 0};${i!==void 0};${e}`,inputDependencies:z},getRunData:()=>({outputs:C,dispatchGroup:I,programUniforms:k}),getShaderSource:v}},yu=(e,t,r,i,a,n,s=void 0,u=void 0)=>{let l=n+a.kvSequenceLength,p=a.nReps?a.nReps:1,c=a.vHiddenSize*p,h=e>1&&i,g=a.kvNumHeads?a.kvNumHeads:a.numHeads,_=h?[a.batchSize,g,l,a.headSize]:void 0,y=[a.batchSize,a.sequenceLength,c],w=12,S={x:Math.ceil(a.vHeadSize/w),y:Math.ceil(a.sequenceLength/w),z:a.batchSize*a.numHeads},x=[{type:12,data:a.sequenceLength},{type:12,data:l},{type:12,data:a.vHeadSize},{type:12,data:a.numHeads},{type:12,data:a.headSize},{type:12,data:c},{type:12,data:n},{type:12,data:a.kvSequenceLength},{type:12,data:p}],b=h&&i&&O.size(i.dims)>0,I=["type","type"];b&&I.push("type"),s&&I.push("type"),u&&I.push("type");let k=[{dims:y,dataType:t.dataType,gpuDataType:0}];h&&k.push({dims:_,dataType:t.dataType,gpuDataType:0});let T=z=>{let C=R("probs",t.dataType,t.dims),v=R("v",r.dataType,r.dims),N=[C,v];b&&N.push(R("past_value",i.dataType,i.dims));let P=s?R("seq_lens",s.dataType,s.dims):void 0;s&&N.push(P);let F=u?R("total_sequence_length_input",u.dataType,u.dims):void 0;u&&N.push(F);let W=[j("output",t.dataType,y)];h&&W.push(j("present_value",t.dataType,_));let K=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${w}u;
  var<workgroup> tileQ: array<${C.type.value}, ${w*w}>;
  var<workgroup> tileV: array<${C.type.value}, ${w*w}>;
  ${z.registerUniforms(K).declareVariables(...N,...W)}
  ${z.mainStart([w,w,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${p===1?"headIdx":"headIdx / uniforms.n_reps"};
   let kv_num_heads = ${p===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${Rr(P,F,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${b&&h?"let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;":""};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${h?"let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;":""}
   var value = ${C.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${b&&h?`
        if (w + local_id.y < past_sequence_length) {
          tileV[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else if (w + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
          tileV[idx] = v[vOffset + (w + local_id.y - past_sequence_length) * uniforms.N];
        }
      `:`
            if (w + local_id.y < uniforms.kv_sequence_length) {
              tileV[idx] = v[vOffset + (w + local_id.y) * uniforms.N];
            }`}
        ${h?`
            if (w + local_id.y < present_sequence_length) {
          present_value[presentValueOffset + (w + local_id.y) * uniforms.N] = tileV[idx];
        }`:""}
      }
     workgroupBarrier();
     for (var k: u32 = 0u; k < TILE_SIZE && w+k < total_sequence_length; k++) {
       value += tileQ[TILE_SIZE * local_id.y + k] * tileV[TILE_SIZE * k + local_id.x];
     }
     workgroupBarrier();
   }

   // we need to transpose output from BNSH_v to BSND_v
   if (m < uniforms.M && n < uniforms.N) {
     let outputIdx = batchIdx * uniforms.M * uniforms.v_hidden_size + m * uniforms.v_hidden_size
       + headIdx * uniforms.N + n;
     output[outputIdx] = value;
   }
  }`};return{name:"AttentionScore",shaderCache:{hint:`${i!==void 0};${e}`,inputDependencies:I},getRunData:()=>({outputs:k,dispatchGroup:S,programUniforms:x}),getShaderSource:T}},fr=(e,t,r,i,a,n,s,u,l,p,c=void 0,h=void 0)=>{let g=Math.min(e.outputCount,1+(s?1:0)+(u?1:0)),_=g>1?s:void 0,y=g>1?u:void 0,w=g>1?p.pastSequenceLength:0,S=w+p.kvSequenceLength,x=l&&O.size(l.dims)>0?l:void 0,b=[t,r];_&&O.size(_.dims)>0&&b.push(_),x&&b.push(x),c&&b.push(c),h&&b.push(h);let I=e.compute(gu(g,t,r,_,x,p,w,c,h),{inputs:b,outputs:g>1?[-1,1]:[-1]})[0];e.compute(mu(I,p.batchSize,p.numHeads,w,p.sequenceLength,S,c,h),{inputs:c&&h?[I,c,h]:[I],outputs:[]});let k=[I,i];y&&O.size(y.dims)>0&&k.push(y),c&&k.push(c),h&&k.push(h),e.compute(yu(g,I,i,y,p,w,c,h),{inputs:k,outputs:g>1?[0,2]:[0]})},_u=(e,t)=>{let r=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],i=t.sequenceLength,a=t.inputHiddenSize,n=t.headSize,s=12,u={x:Math.ceil(t.headSize/s),y:Math.ceil(t.sequenceLength/s),z:t.batchSize*t.numHeads},l=[e.inputs[0],e.inputs[1],e.inputs[2]],p=[{type:12,data:i},{type:12,data:a},{type:12,data:n},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}],c=h=>{let g=j("output_q",l[0].dataType,r),_=j("output_k",l[0].dataType,r),y=j("output_v",l[0].dataType,r),w=R("input",l[0].dataType,l[0].dims),S=R("weight",l[1].dataType,l[1].dims),x=R("bias",l[2].dataType,l[2].dims),b=w.type.storage,I=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
  const TILE_SIZE = ${s}u;
  var<workgroup> tileInput: array<${b}, ${s*s}>;
  var<workgroup> tileWeightQ: array<${b}, ${s*s}>;
  var<workgroup> tileWeightK: array<${b}, ${s*s}>;
  var<workgroup> tileWeightV: array<${b}, ${s*s}>;
  ${h.registerUniforms(I).declareVariables(w,S,x,g,_,y)}
  ${h.mainStart([s,s,1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${b}(0);
    var valueK = ${b}(0);
    var valueV = ${b}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileInput[TILE_SIZE * local_id.y + local_id.x] = input[inputOffset + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        let offset = n + (w + local_id.y) * uniforms.ldb;
        tileWeightQ[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetQ + offset];
        tileWeightK[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetK + offset];
        tileWeightV[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetV + offset];
      }
      workgroupBarrier();
      for (var k: u32 = 0u; k<TILE_SIZE && w+k < uniforms.K; k++) {
        let inputTileOffset = TILE_SIZE * local_id.y + k;
        let weightTileOffset = TILE_SIZE * k + local_id.x;
        valueQ += tileInput[inputTileOffset] * tileWeightQ[weightTileOffset];
        valueK += tileInput[inputTileOffset] * tileWeightK[weightTileOffset];
        valueV += tileInput[inputTileOffset] * tileWeightV[weightTileOffset];
      }

      workgroupBarrier();
    }

    let headOffset = (m * uniforms.N + n) % uniforms.head_size;
    valueQ += bias[headOffset + biasOffsetQ];
    valueK += bias[headOffset + biasOffsetK];
    valueV += bias[headOffset + biasOffsetV];

    let offset = workgroup_id.z * uniforms.M * uniforms.N;
    if (m < uniforms.M && n < uniforms.N) {
      let outputIdx = offset + m * uniforms.N + n;
      output_q[outputIdx] = valueQ;
      output_k[outputIdx] = valueK;
      output_v[outputIdx] = valueV;
    }
  }`};return e.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:u,programUniforms:p}),getShaderSource:c},{inputs:l,outputs:[-1,-1,-1]})},uc=(e,t)=>{let r=fu(e.inputs,t),[i,a,n]=_u(e,r);return fr(e,i,a,n,e.inputs[4],void 0,void 0,void 0,e.inputs[5],r)}}),bu,wu,$u,lc,S0=q(()=>{"use strict";Le(),re(),ie(),Se(),ae(),bu=(e,t)=>{if(!e||e.length!==5)throw new Error("BatchNormalization requires 5 inputs");let r=(i,a,n)=>{let s=a.length;if(s!==i.length)throw new Error(`${n}: num dimensions != ${s}`);a.forEach((u,l)=>{if(u!==i[l])throw new Error(`${n}: dim[${l}] do not match`)})};if(e[0].dims.length>1){let i=t.format==="NHWC"?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);r(e[1].dims,i,"Invalid input scale"),r(e[2].dims,i,"Invalid input B"),r(e[3].dims,i,"Invalid input mean"),r(e[4].dims,i,"Invalid input var")}else r(e[1].dims,[1],"Invalid input scale"),r(e[2].dims,[1],"Invalid input B"),r(e[3].dims,[1],"Invalid input mean"),r(e[4].dims,[1],"Invalid input var")},wu=(e,t)=>{let{epsilon:r,spatial:i,format:a}=t,n=e[0].dims,s=i?xe(n[n.length-1]):1,u=a==="NHWC"&&n.length>1?s:1,l=O.size(n)/s,p=i,c=p?n.length:n,h=R("x",e[0].dataType,e[0].dims,s),g=R("scale",e[1].dataType,e[1].dims,u),_=R("bias",e[2].dataType,e[2].dims,u),y=R("inputMean",e[3].dataType,e[3].dims,u),w=R("inputVar",e[4].dataType,e[4].dims,u),S=j("y",e[0].dataType,c,s),x=()=>{let I="";if(i)I=`let cOffset = ${n.length===1?"0u":a==="NHWC"?`outputIndices[${n.length-1}] / ${s}`:"outputIndices[1]"};`;else if(a==="NCHW")I=`
            ${S.indicesSet("outputIndices","0","0")}
            let cOffset = ${S.indicesToOffset("outputIndices")};`;else{I=`var cIndices = ${g.type.indices}(0);
                       cIndices[0] = outputIndices[${n.length-1}];`;for(let k=1;k<g.rank;k++)I+=`cIndices[${k}] = outputIndices[${k}];`;I+=`let cOffset = ${g.indicesToOffset("cIndices")};`}return I},b=I=>`
  const epsilon = ${r};
  ${I.registerUniform("outputSize","u32").declareVariables(h,g,_,y,w,S)}
  ${I.mainStart()}
  ${I.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${S.offsetToIndices(`global_idx * ${s}`)};
    ${x()}
    let scale = ${g.getByOffset("cOffset")};
    let bias = ${_.getByOffset("cOffset")};
    let inputMean = ${y.getByOffset("cOffset")};
    let inputVar = ${w.getByOffset("cOffset")};
    let x = ${h.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${S.setByOffset("global_idx","value")}
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${t.epsilon}_${t.format}_${i}_${s}`,inputDependencies:p?["rank","type","type","type","type"]:void 0},getShaderSource:b,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:p?[{type:12,data:l},...X(n)]:[{type:12,data:l}]})}},$u=e=>he(e),lc=(e,t)=>{let{inputs:r,outputCount:i}=e,a=$u({...t,outputCount:i});if(ge.webgpu.validateInputContent&&bu(r,a),t.trainingMode)throw new Error("BatchNormalization trainingMode is not supported yet.");e.compute(wu(r,a))}}),vu,xu,dc,k0=q(()=>{"use strict";ie(),ae(),vu=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![320,640,1280].includes(e[0].dims[2]))throw new Error("number of channels should be 320, 640 or 1280");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},xu=e=>{let t=e[0].dims,r=e[0].dims[2],i=O.size(t)/4,a=e[0].dataType,n=R("input",a,t,4),s=R("bias",a,[r],4),u=R("residual",a,t,4),l=j("output",a,t,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)}}),getShaderSource:p=>`
  const channels = ${r}u / 4;
  ${p.declareVariables(n,s,u,l)}

  ${p.mainStart()}
    ${p.guardAgainstOutOfBoundsWorkgroupSizes(i)}
    let value = ${n.getByOffset("global_idx")}
      + ${s.getByOffset("global_idx % channels")} + ${u.getByOffset("global_idx")};
    ${l.setByOffset("global_idx","value")}
  }`}},dc=e=>{vu(e.inputs),e.compute(xu(e.inputs))}}),Su,ce,pc,cc,hc,fc,mc,gc,yc,_c,bc,ku,wc,$c,vc,xc,lr,Sc,Vr,kc,Tc,Ic,Ec,zc,Cc,Ac,Oc,Bc,Rc,Mc,Nc,Dc,Uc,Pc,qc,Lc,Hi,Wc,Ba,Ra,Vc,Gc,Hc,Tu,Iu,Fc,an=q(()=>{"use strict";re(),ie(),Se(),ae(),Su=(e,t,r,i,a,n,s)=>{let u=Math.ceil(t/4),l="";typeof a=="string"?l=`${a}(a)`:l=a("a");let p=R("inputData",r,[u],4),c=j("outputData",i,[u],4),h=[{name:"vec_size",type:"u32"}];return s&&h.push(...s),`
      ${e.registerUniforms(h).declareVariables(p,c)}

  ${n??""}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${p.getByOffset("global_idx")};
    ${c.setByOffset("global_idx",l)}
  }`},ce=(e,t,r,i,a,n=e.dataType,s,u)=>{let l=[{type:12,data:Math.ceil(O.size(e.dims)/4)}];return s&&l.push(...s),{name:t,shaderCache:{hint:a,inputDependencies:["type"]},getShaderSource:p=>Su(p,O.size(e.dims),e.dataType,n,r,i,u),getRunData:p=>({outputs:[{dims:e.dims,dataType:n}],dispatchGroup:{x:Math.ceil(O.size(p[0].dims)/64/4)},programUniforms:l})}},pc=e=>{e.compute(ce(e.inputs[0],"Abs","abs"))},cc=e=>{e.compute(ce(e.inputs[0],"Acos","acos"))},hc=e=>{e.compute(ce(e.inputs[0],"Acosh","acosh"))},fc=e=>{e.compute(ce(e.inputs[0],"Asin","asin"))},mc=e=>{e.compute(ce(e.inputs[0],"Asinh","asinh"))},gc=e=>{e.compute(ce(e.inputs[0],"Atan","atan"))},yc=e=>{e.compute(ce(e.inputs[0],"Atanh","atanh"))},_c=e=>he(e),bc=(e,t)=>{let r;switch(t.to){case 10:r="vec4<f16>";break;case 1:r="vec4<f32>";break;case 12:r="vec4<u32>";break;case 6:r="vec4<i32>";break;case 9:r="vec4<bool>";break;default:throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute(ce(e.inputs[0],"Cast",r,void 0,t.cacheKey,t.to))},ku=e=>{let t,r,i=e.length>=2&&e[1].data!==0,a=e.length>=3&&e[2].data!==0;switch(e[0].dataType){case 1:t=i?e[1].getFloat32Array()[0]:-34028234663852886e22,r=a?e[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:t=i?e[1].getUint16Array()[0]:64511,r=a?e[2].getUint16Array()[0]:31743;break;default:throw new Error("Unsupport data type")}return he({min:t,max:r})},wc=(e,t)=>{let r=t||ku(e.inputs),i=Ie(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"Clip",a=>`clamp(${a}, vec4<${i}>(uniforms.min), vec4<${i}>(uniforms.max))`,void 0,r.cacheKey,void 0,[{type:e.inputs[0].dataType,data:r.min},{type:e.inputs[0].dataType,data:r.max}],[{name:"min",type:i},{name:"max",type:i}]),{inputs:[0]})},$c=e=>{e.compute(ce(e.inputs[0],"Ceil","ceil"))},vc=e=>{e.compute(ce(e.inputs[0],"Cos","cos"))},xc=e=>{e.compute(ce(e.inputs[0],"Cosh","cosh"))},lr=e=>he(e),Sc=(e,t)=>{let r=Ie(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"Elu",i=>`elu_vf32(${i})`,`
  const elu_alpha_ = ${r}(${t.alpha});

  fn elu_f32(a: ${r}) -> ${r} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${r}>) -> vec4<${r}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,t.cacheKey))},Vr=(e="f32")=>`
const r0: ${e} = 0.3275911;
const r1: ${e} = 0.254829592;
const r2: ${e} = -0.284496736;
const r3: ${e} = 1.421413741;
const r4: ${e} = -1.453152027;
const r5: ${e} = 1.061405429;

fn erf_vf32(v: vec4<${e}>) -> vec4<${e}> {
  let absv = abs(v);
  let x = 1.0 / (1.0 + r0 * absv);
  return sign(v) * (1.0 - ((((r5 * x + r4) * x + r3) * x + r2) * x + r1) * x * exp(-absv * absv));
}`,kc=e=>{let t=Ie(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"Erf",r=>`erf_vf32(${r})`,Vr(t)))},Tc=e=>{e.compute(ce(e.inputs[0],"Exp","exp"))},Ic=e=>{e.compute(ce(e.inputs[0],"Floor","floor"))},Ec=e=>{let t=Ie(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"Gelu",r=>`0.5 * ${r} * (1.0 + erf_vf32(${r} * 0.7071067811865475))`,Vr(t)))},zc=(e,t)=>{let r=Ie(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"LeakyRelu",i=>`select(leaky_relu_alpha_ * ${i}, ${i}, ${i} >= vec4<${r}>(0.0))`,`const leaky_relu_alpha_ = ${r}(${t.alpha});`,t.cacheKey))},Cc=e=>{e.compute(ce(e.inputs[0],"Not",t=>`!${t}`))},Ac=e=>{e.compute(ce(e.inputs[0],"Neg",t=>`-${t}`))},Oc=e=>{e.compute(ce(e.inputs[0],"Reciprocal",t=>`1.0/${t}`))},Bc=e=>{let t=Ie(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"Relu",r=>`select(vec4<${t}>(0.0), ${r}, ${r} > vec4<${t}>(0.0))`))},Rc=e=>{e.compute(ce(e.inputs[0],"Sigmoid",t=>`(1.0 / (1.0 + exp(-${t})))`))},Mc=e=>he(e),Nc=(e,t)=>{let r=Ie(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"HardSigmoid",i=>`max(vec4<${r}>(0.0), min(vec4<${r}>(1.0), ${t.alpha} * ${i} + vec4<${r}>(${t.beta})))`,void 0,t.cacheKey))},Dc=e=>{let t=Ie(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"HardSwish",r=>`${r} * max(vec4<${t}>(0.0), min(vec4<${t}>(1.0), vec4<${t}>(${t}(1.0 / 6.0)) * ${r} + vec4<${t}>(0.5)))`))},Uc=e=>{e.compute(ce(e.inputs[0],"Sin","sin"))},Pc=e=>{e.compute(ce(e.inputs[0],"Sinh","sinh"))},qc=e=>{e.compute(ce(e.inputs[0],"Sqrt","sqrt"))},Lc=e=>{e.compute(ce(e.inputs[0],"Tan","tan"))},Hi=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,Wc=e=>{e.compute(ce(e.inputs[0],"Tanh",Hi))},Ba=(e="f32")=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${Hi("v")};
}
`,Ra=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,Vc=e=>{let t=Ie(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"FastGelu",Ra,Ba(t),void 0,e.inputs[0].dataType))},Gc=(e,t)=>{let r=Ie(e.inputs[0].dataType);return e.compute(ce(e.inputs[0],"ThresholdedRelu",i=>`select(vec4<${r}>(0.0), ${i}, ${i} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${r}>(${t.alpha});`,t.cacheKey)),0},Hc=e=>{e.compute(ce(e.inputs[0],"Log","log"))},Tu=(e,t)=>`
const alpha = vec4<${e}>(${t});
const one = ${e}(1.0);
const zero = ${e}(0.0);

fn quick_gelu_impl(x: vec4<${e}>) -> vec4<${e}> {
  let v = x *alpha;
  var x1 : vec4<${e}>;
  for (var i = 0; i < 4; i = i + 1) {
    if (v[i] >= zero) {
      x1[i] = one / (one + exp(-v[i]));
    } else {
      x1[i] = one - one / (one + exp(v[i]));
    }
  }
  return x * x1;
}
`,Iu=e=>`quick_gelu_impl(${e})`,Fc=(e,t)=>{let r=Ie(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"QuickGelu",Iu,Tu(r,t.alpha),t.cacheKey,e.inputs[0].dataType))}}),Eu,zu,jc,T0=q(()=>{"use strict";ie(),ae(),an(),Eu=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![2560,5120,10240].includes(e[0].dims[2]))throw new Error("hidden state should be 2560, 5120 or 10240");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},zu=e=>{let t=e[0].dims.slice();t[2]=t[2]/2;let r=R("input",e[0].dataType,e[0].dims,4),i=R("bias",e[0].dataType,[e[0].dims[2]],4),a=j("output",e[0].dataType,t,4),n=O.size(t)/4,s=Ee(e[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(n/64)}}),getShaderSource:u=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2]/4/2}u;

  ${u.declareVariables(r,i,a)}

  ${Vr(s)}

  ${u.mainStart()}
    ${u.guardAgainstOutOfBoundsWorkgroupSizes(n)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${a.setByOffset("global_idx","valueLeft * geluRight")}
  }`}},jc=e=>{Eu(e.inputs),e.compute(zu(e.inputs))}}),Cu,Au,je,Kc,Zc,Xc,Qc,Yc,Jc,eh,th,rh,ih,I0=q(()=>{"use strict";re(),ie(),ae(),Cu=(e,t,r,i,a,n,s,u,l,p,c,h)=>{let g,_;typeof u=="string"?g=_=(b,I)=>`${u}((${b}),(${I}))`:typeof u=="function"?g=_=u:(g=u.scalar,_=u.vector);let y=j("outputData",c,i.length,4),w=R("aData",l,t.length,4),S=R("bData",p,r.length,4),x;if(a)if(n){let b=O.size(t)===1,I=O.size(r)===1,k=t.length>0&&t[t.length-1]%4===0,T=r.length>0&&r[r.length-1]%4===0;b||I?x=y.setByOffset("global_idx",_(b?`${w.type.value}(${w.getByOffset("0")}.x)`:w.getByOffset("global_idx"),I?`${S.type.value}(${S.getByOffset("0")}.x)`:S.getByOffset("global_idx"))):x=`
            let outputIndices = ${y.offsetToIndices("global_idx * 4u")};
            let offsetA = ${w.broadcastedIndicesToOffset("outputIndices",y)};
            let offsetB = ${S.broadcastedIndicesToOffset("outputIndices",y)};
            ${y.setByOffset("global_idx",_(s||k?w.getByOffset("offsetA / 4u"):`${w.type.value}(${w.getByOffset("offsetA / 4u")}[offsetA % 4u])`,s||T?S.getByOffset("offsetB / 4u"):`${S.type.value}(${S.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else x=y.setByOffset("global_idx",_(w.getByOffset("global_idx"),S.getByOffset("global_idx")));else{if(!n)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");let b=(I,k,T="")=>{let z=`aData[indexA${k}][componentA${k}]`,C=`bData[indexB${k}][componentB${k}]`;return`
            let outputIndices${k} = ${y.offsetToIndices(`global_idx * 4u + ${k}u`)};
            let offsetA${k} = ${w.broadcastedIndicesToOffset(`outputIndices${k}`,y)};
            let offsetB${k} = ${S.broadcastedIndicesToOffset(`outputIndices${k}`,y)};
            let indexA${k} = offsetA${k} / 4u;
            let indexB${k} = offsetB${k} / 4u;
            let componentA${k} = offsetA${k} % 4u;
            let componentB${k} = offsetB${k} % 4u;
            ${I}[${k}] = ${T}(${g(z,C)});
          `};c===9?x=`
            var data = vec4<u32>(0);
            ${b("data",0,"u32")}
            ${b("data",1,"u32")}
            ${b("data",2,"u32")}
            ${b("data",3,"u32")}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:x=`
            ${b("outputData[global_idx]",0)}
            ${b("outputData[global_idx]",1)}
            ${b("outputData[global_idx]",2)}
            ${b("outputData[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(w,S,y)}

        ${h??""}

        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${x}
      }`},Au=(e,t,r,i,a,n,s=r.dataType)=>{let u=r.dims.map(Number),l=i.dims.map(Number),p=!O.areEqual(u,l),c=u,h=O.size(u),g=!1,_=!1,y=[p];if(p){let w=Gt.calcShape(u,l,!1);if(!w)throw new Error("Can't perform binary op on the given tensors");c=w.slice(),h=O.size(c);let S=O.size(u)===1,x=O.size(l)===1,b=u.length>0&&u[u.length-1]%4===0,I=l.length>0&&l[l.length-1]%4===0;y.push(S),y.push(x),y.push(b),y.push(I);let k=1;for(let T=1;T<c.length;T++){let z=u[u.length-T],C=l[l.length-T];if(z===C)k*=z;else break}k%4===0?(_=!0,g=!0):(S||x||b||I)&&(g=!0)}else g=!0;return y.push(g),{name:e,shaderCache:{hint:t+y.map(w=>w.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:w=>Cu(w,u,l,c,g,p,_,a,r.dataType,i.dataType,s,n),getRunData:()=>({outputs:[{dims:c,dataType:s}],dispatchGroup:{x:Math.ceil(h/64/4)},programUniforms:[{type:12,data:Math.ceil(O.size(c)/4)},...X(u,l,c)]})}},je=(e,t,r,i,a,n)=>{e.compute(Au(t,a??"",e.inputs[0],e.inputs[1],r,i,n))},Kc=e=>{je(e,"Add",(t,r)=>`${t}+${r}`)},Zc=e=>{je(e,"Div",(t,r)=>`${t}/${r}`)},Xc=e=>{je(e,"Equal",{scalar:(t,r)=>`u32(${t}==${r})`,vector:(t,r)=>`vec4<u32>(${t}==${r})`},void 0,void 0,9)},Qc=e=>{je(e,"Mul",(t,r)=>`${t}*${r}`)},Yc=e=>{let t=R("input",e.inputs[0].dataType,e.inputs[0].dims).type.value;je(e,"Pow",{scalar:(r,i)=>`pow_custom(${r},${i})`,vector:(r,i)=>`pow_vector_custom(${r},${i})`},`
    fn pow_custom(a : ${t}, b : ${t}) -> ${t} {
      if (b == ${t}(0.0)) {
        return ${t}(1.0);
      } else if (a < ${t}(0.0) && f32(b) != floor(f32(b))) {
        return ${t}(pow(f32(a), f32(b))); // NaN
      }
      return select(sign(a), ${t}(1.0), round(f32(abs(b) % ${t}(2.0))) != 1.0) * ${t}(${t==="i32"?"round":""}(pow(f32(abs(a)), f32(b))));
    }
    fn pow_vector_custom(a : vec4<${t}>, b : vec4<${t}>) -> vec4<${t}> {
      // TODO: implement vectorized pow
      return vec4<${t}>(pow_custom(a.x, b.x), pow_custom(a.y, b.y), pow_custom(a.z, b.z), pow_custom(a.w, b.w));
    }
      `)},Jc=e=>{je(e,"Sub",(t,r)=>`${t}-${r}`)},eh=e=>{je(e,"Greater",{scalar:(t,r)=>`u32(${t}>${r})`,vector:(t,r)=>`vec4<u32>(${t}>${r})`},void 0,void 0,9)},th=e=>{je(e,"Less",{scalar:(t,r)=>`u32(${t}<${r})`,vector:(t,r)=>`vec4<u32>(${t}<${r})`},void 0,void 0,9)},rh=e=>{je(e,"GreaterOrEqual",{scalar:(t,r)=>`u32(${t}>=${r})`,vector:(t,r)=>`vec4<u32>(${t}>=${r})`},void 0,void 0,9)},ih=e=>{je(e,"LessOrEqual",{scalar:(t,r)=>`u32(${t}<=${r})`,vector:(t,r)=>`vec4<u32>(${t}<=${r})`},void 0,void 0,9)}}),Ou,Bu,Ru,Mu,ah,nh,E0=q(()=>{"use strict";re(),ie(),Se(),ae(),Ou=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");let r=0,i=e[r],a=i.dataType,n=i.dims.length;e.forEach((s,u)=>{if(u!==r){if(s.dataType!==a)throw new Error("input tensors should be one type");if(s.dims.length!==n)throw new Error("input tensors should have the same shape");s.dims.forEach((l,p)=>{if(p!==t&&l!==i.dims[p])throw new Error("non concat dimensions must match")})}})},Bu=(e,t)=>`
  fn calculateInputIndex(index: u32) -> u32 {
    let sizeInConcatAxis = array<u32, ${e}u>(${t});
    for (var i: u32 = 0u; i < ${e}; i += 1u ) {
      if (index < sizeInConcatAxis[i]) {
        return i;
      }
    }
    return ${e}u;
  }`,Ru=(e,t)=>{let r=e.length,i=[];for(let a=0;a<r;++a){let n=t.setByOffset("global_idx",e[a].getByIndices("indices"));r===1?i.push(n):a===0?i.push(`if (inputIndex == ${a}u) { ${n} }`):a===r-1?i.push(`else { ${n} }`):i.push(`else if (inputIndex == ${a}) { ${n} }`)}return i.join(`
`)},Mu=(e,t,r,i)=>{let a=O.size(r),n=new Array(e.length),s=new Array(e.length),u=0,l=[],p=[],c=[{type:12,data:a}];for(let w=0;w<e.length;++w)u+=e[w].dims[t],n[w]=u,p.push(e[w].dims.length),s[w]=R(`input${w}`,i,p[w]),l.push("rank"),c.push({type:12,data:n[w]});for(let w=0;w<e.length;++w)c.push(...X(e[w].dims));c.push(...X(r));let h=j("output",i,r.length),g=h.indicesGet("indices",t),_=Array.from(Array(n.length).keys()).map(w=>`uniforms.sizeInConcatAxis${w}`).join(","),y=w=>`

  ${(()=>{w.registerUniform("outputSize","u32");for(let S=0;S<e.length;S++)w.registerUniform(`sizeInConcatAxis${S}`,"u32");return w.declareVariables(...s,h)})()}

  ${Bu(n.length,_)}

  ${w.mainStart()}
    ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    var indices = ${h.offsetToIndices("global_idx")};

    let inputIndex = calculateInputIndex(${g});
    if (inputIndex != 0u) {
      let sizeInConcatAxis = array<u32, ${n.length}u>(${_});
      ${g} -= sizeInConcatAxis[inputIndex - 1u];
    }

    ${Ru(s,h)}
  }`;return{name:"Concat",shaderCache:{hint:`${t}`,inputDependencies:l},getRunData:()=>({outputs:[{dims:r,dataType:i}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:c}),getShaderSource:y}},ah=(e,t)=>{let r=e.inputs,i=r[0].dims,a=O.normalizeAxis(t.axis,i.length);Ou(r,a);let n=i.slice();n[a]=r.reduce((u,l)=>u+(l.dims.length>a?l.dims[a]:0),0);let s=r.filter(u=>O.size(u.dims)>0);e.compute(Mu(s,a,n,r[0].dataType),{inputs:s})},nh=e=>he({axis:e.axis})}),Rt,Mt,Nt,nn,Ut=q(()=>{"use strict";re(),ie(),Rt=(e,t,r="f32")=>{switch(e.activation){case"Relu":return`value = max(value, ${t}(0.0));`;case"Sigmoid":return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${t}(${r}(uniforms.clip_min)), ${t}(${r}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${t}(0.0), min(${t}(1.0), ${r}(uniforms.alpha) * value + ${r}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${r}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw new Error(`Unsupported activation ${e.activation}`)}},Mt=(e,t)=>{e.activation==="Clip"?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):e.activation==="HardSigmoid"?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):e.activation==="LeakyRelu"&&t.push({type:1,data:e.alpha})},Nt=(e,t)=>{e.activation==="Clip"?t.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):e.activation==="HardSigmoid"?t.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):e.activation==="LeakyRelu"&&t.push({name:"alpha",type:"f32"})},nn=e=>{let t=e?.activation||"";if(t==="HardSigmoid"){let[r,i]=e?.activation_params||[.2,.5];return{activation:t,alpha:r,beta:i}}else if(t==="Clip"){let[r,i]=e?.activation_params||[Cp,Ap];return{activation:t,clipMax:i,clipMin:r}}else if(t==="LeakyRelu"){let[r]=e?.activation_params||[.01];return{activation:t,alpha:r}}return{activation:t}}}),Ce,sh,sn=q(()=>{"use strict";Ce=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw new Error(`${e}-component is not supported.`)}},sh=e=>`
      ${e?"value = value + getBiasByOutputCoords(coords);":""}
      `}),oh,z0=q(()=>{"use strict";oh=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`}),pr,on,un=q(()=>{"use strict";re(),ie(),ae(),Ut(),pr=(e,t,r,i,a)=>{let n=i-r;return`
      ${Array.from({length:r}).map((s,u)=>`
      if (${Z(t.shape,u,t.rank)} != 1) {
        ${t.indicesSet(e,u,Z(a,u+n,i))}
      } else {
        ${t.indicesSet(e,u,0)}
      }`).join("")}
`},on=(e,t,r,i,a=!1,n)=>{let s=e[0].dims,u=e[1].dims,l=s[s.length-2],p=u[u.length-1],c=s[s.length-1],h=xe(p),g=xe(c),_=xe(l),y=O.size(r)/h/_,w=e.length>2,S=i?i.slice(0,-2):r.slice(0,-2),x=[O.size(S),l,p],b=[{type:12,data:y},{type:12,data:l},{type:12,data:p},{type:12,data:c}];Mt(t,b),b.push(...X(S,s,u)),w&&b.push(...X(e[2].dims)),b.push(...X(x));let I=k=>{let T=en("batch_dims",e[0].dataType,S.length),z=R("a",e[0].dataType,s.length,g),C=R("b",e[1].dataType,u.length,h),v=j("output",e[0].dataType,x.length,h),N=Ee(v.type.tensor),P=Rt(t,v.type.value,N),F=[z,C],W="";if(w){let D=a?h:1;F.push(R("bias",e[2].dataType,e[2].dims.length,D)),W=`${a?`value += bias[col / ${D}];`:`value += ${v.type.value}(bias[row + i]);`}`}let K=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];Nt(t,K);let B=()=>{let D=`var a_data: ${z.type.value};`;for(let H=0;H<g;H++)D+=`
              let b_data${H} = b[(b_offset + (k + ${H}) * uniforms.N + col) / ${h}];`;for(let H=0;H<_;H++){D+=`a_data = a[(a_offset + (row + ${H}) * uniforms.K + k) / ${g}];`;for(let Q=0;Q<g;Q++)D+=`
            values[${H}] = fma(${C.type.value}(a_data${g===1?"":`[${Q}]`}), b_data${Q}, values[${H}]);
`}return D};return`
  ${k.registerUniforms(K).registerInternalVariables(T).declareVariables(...F,v)}
  ${k.mainStart()}
    ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${h})) * ${h};
    var index1 = global_idx / (uniforms.N / ${h});
    let stride1 = uniforms.M / ${_};
    let row = (index1 % stride1) * ${_};
    let batch = index1 / stride1;

    ${r.length===2?"":`let batch_indices = ${T.offsetToIndices("batch")};`}

    var a_indices: ${z.type.indices};
    ${pr("a_indices",z,z.rank-2,T.rank,"batch_indices")}
    ${z.indicesSet("a_indices",z.rank-2,0)}
    ${z.indicesSet("a_indices",z.rank-1,0)}
    let a_offset = ${z.indicesToOffset("a_indices")};

    var b_indices: ${C.type.indices};
    ${pr("b_indices",C,C.rank-2,T.rank,"batch_indices")}
    ${C.indicesSet("b_indices",C.rank-2,0)}
    ${C.indicesSet("b_indices",C.rank-1,0)}
    let b_offset = ${C.indicesToOffset("b_indices")};
    var values: array<${v.type.value}, ${_}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${g}) {
      ${B()}
    }
    for (var i = 0u; i < ${_}u; i++) {
      var value = values[i];
      ${W}
      ${P}
      let cur_indices = ${v.type.indices}(batch, row + i, col);
      let offset = ${v.indicesToOffset("cur_indices")};
      ${v.setByOffset(`offset / ${h}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${t.activation};${h};${g};${_};${a}`,inputDependencies:w?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:n?n(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(y/64)},programUniforms:b}),getShaderSource:I}}}),Nu,Du,Ma,Fi,Uu,Na,Pu,Xr,ln=q(()=>{"use strict";re(),ie(),ae(),Ut(),un(),sn(),Nu=(e,t)=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${t?", batchIndices":""});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${t?", batchIndices":""});
        `,Du=(e,t)=>e?`
        let ACached0 = mm_Asub[k * innerElementSize][localRow];
        let ACached1 = mm_Asub[k * innerElementSize + 1][localRow];
        let ACached2 = mm_Asub[k * innerElementSize + 2][localRow];
        ${t===3?"":"let ACached3 = mm_Asub[k * innerElementSize + 3][localRow];"}
        for (var i = 0; i < rowPerThread; i = i + 1) {
          acc[i] = BCached0 * ACached0[i] + acc[i];
          acc[i] = BCached1 * ACached1[i] + acc[i];
          acc[i] = BCached2 * ACached2[i] + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached3[i] + acc[i];"}
        }`:`
        for (var i = 0; i < rowPerThread; i = i + 1) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = BCached0 * ACached.x + acc[i];
          acc[i] = BCached1 * ACached.y + acc[i];
          acc[i] = BCached2 * ACached.z + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached.w + acc[i];"}
        }`,Ma=(e,t,r="f32",i,a=!1,n=32,s=!1,u=32)=>{let l=t[1]*e[1],p=t[0]*e[0],c=a?l:n,h=a?n:l,g=c/t[0],_=n/t[1];if(!((a&&g===4&&e[1]===4||!a&&(g===3||g===4))&&c%t[0]===0&&n%t[1]===0&&e[0]===4))throw new Error(`If transposeA ${a} is true, innerElementSize ${g} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${g} must be 3 or 4.
  tileAWidth ${c} must be divisible by workgroupSize[0]${t[0]}. tileInner ${n} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${g}<${r}>, ${c/g}>, ${h}>;
var<workgroup> mm_Bsub: array<array<vec4<${r}>, ${p/e[0]}>, ${n}>;

const rowPerThread = ${e[1]};
const colPerThread = ${e[0]};
const innerElementSize = ${g};
const tileInner = ${n};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
  let localRow = i32(localId.y);
  let tileRow = localRow * rowPerThread;
  let tileCol = i32(localId.x);

  let globalRow =i32(globalId.y) * rowPerThread;
  let globalCol = i32(globalId.x);
  let batch = ${s?"0":"i32(globalId.z)"};
  ${i?`let batchIndices = ${i.offsetToIndices("u32(batch)")};`:""}
  let globalRowStart = i32(workgroupId.y) * ${l};

  let num_tiles = ${s?`${Math.ceil(u/n)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
  var kStart = ${s?`i32(globalId.z) * ${u}`:"0"};

  var acc: array<vec4<${r}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${_};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${Nu(a,i)}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${_}; innerRow = innerRow + 1) {
          let inputRow = tileRowB + innerRow;
          let inputCol = tileCol;
          mm_Bsub[inputRow][inputCol] = mm_readB(batch, kStart + inputRow, globalCol${i?", batchIndices":""});
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      for (var k = 0; k < tileInner / innerElementSize; k = k + 1) {
          let BCached0 = mm_Bsub[k * innerElementSize][tileCol];
          let BCached1 = mm_Bsub[k * innerElementSize + 1][tileCol];
          let BCached2 = mm_Bsub[k * innerElementSize + 2][tileCol];
          ${g===3?"":"let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}

          ${Du(a,g)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},Fi=(e,t)=>e?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t?", batchIndices":""});
            `,Uu=e=>e?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",Na=(e,t,r="f32",i,a=!1,n=32,s=!1,u=32,l=!1)=>{let p=e[1]*t[1],c=e[0]*t[0],h=a?p:n,g=a?n:p;if(!(g%t[1]===0&&h%t[0]===0&&n%t[1]===0))throw new Error(`tileAHight ${g} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${h} must be divisible by workgroupSize[0]${t[0]}, tileInner ${n} must be divisible by workgroupSize[1]${t[1]}`);let _=g/t[1],y=h/t[0],w=n/t[1],S=l?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${p};
    let globalColStart = i32(workgroupId.x) * ${c};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${g}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${h}; inputCol = inputCol + ${t[0]}) {
          ${Fi(a,i)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${n}; inputRow = inputRow + ${t[1]}) {
            for (var inputCol = localCol; inputCol < ${c}; inputCol = inputCol + ${t[0]}) {
          mm_Bsub[inputRow][inputCol] = mm_readB(batch,
            kStart + inputRow,
            globalColStart + inputCol${i?", batchIndices":""});
        }
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      var BCached : array<${r}, colPerThread>;
      for (var k = 0; k < tileInner; k = k + 1) {
        for (var inner = 0; inner < colPerThread; inner = inner + 1) {
          BCached[inner] = mm_Bsub[k][localCol + inner * ${t[0]}];
        }
        for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let ACached = ${a?`mm_Asub[k][localRow + innerRow * ${t[1]}];`:`mm_Asub[localRow + innerRow * ${t[1]}][k];`}
          for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
            acc[innerRow][innerCol] = acc[innerRow][innerCol] +
                ACached * BCached[innerCol];
          }
        }
      }
      workgroupBarrier();
    }
    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      let gRow = globalRowStart + localRow + innerRow * ${t[1]};
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        let gCol = globalColStart + localCol + innerCol * ${t[0]};
        mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
      }
    }
    `:`
let tileRow = i32(localId.y) * rowPerThread;
let tileCol = i32(localId.x) * colPerThread;

let globalRow = i32(globalId.y) * rowPerThread;
let globalCol = i32(globalId.x) * colPerThread;
let globalRowStart = i32(workgroupId.y) * ${p};

let tileRowA = i32(localId.y) * ${_};
let tileColA = i32(localId.x) * ${y};
let tileRowB = i32(localId.y) * ${w};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${_}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${y}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${Fi(a,i)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${w}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
      let inputRow = tileRowB + innerRow;
      let inputCol = tileCol + innerCol;
      mm_Bsub[inputRow][inputCol] = mm_readB(batch,
        kStart + inputRow,
        globalCol + innerCol${i?", batchIndices":""});
    }
  }
  kStart = kStart + tileInner;
  workgroupBarrier();

  // Compute acc values for a single thread.
  var BCached : array<${r}, colPerThread>;
  for (var k = 0; k < tileInner; k = k + 1) {
    for (var inner = 0; inner < colPerThread; inner = inner + 1) {
      BCached[inner] = mm_Bsub[k][tileCol + inner];
    }

    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      ${Uu(a)}
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        acc[innerRow][innerCol] = acc[innerRow][innerCol] + ACached * BCached[innerCol];
      }
    }
  }

  workgroupBarrier();
}

for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
  for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
    mm_write(batch, globalRow + innerRow, globalCol + innerCol,
        acc[innerRow][innerCol]);
  }
}
`;return`
  var<workgroup> mm_Asub : array<array<${r}, ${h}>, ${g}>;
  var<workgroup> mm_Bsub : array<array<${r}, ${c}>, ${n}>;
  const rowPerThread = ${e[1]};
  const colPerThread = ${e[0]};
  const tileInner = ${n};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${s?"0":"i32(globalId.z)"};
    ${i?`let batchIndices = ${i.offsetToIndices("u32(batch)")};`:""}
    let num_tiles = ${s?`${Math.ceil(u/n)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
    var kStart = ${s?`i32(globalId.z) * ${u}`:"0"};

    var acc : array<array<${r}, colPerThread>, rowPerThread>;
    ${S}
  }
`},Pu=(e,t,r,i,a=!1)=>{let[n,s,u,l]=i,p=Ee(i[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${n.type.indices}) -> ${Ce(e,p)} {
      var value = ${Ce(e,p)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${s.type.indices};
        ${pr("aIndices",s,s.rank-2,n.rank,"batchIndices")}
        ${s.indicesSet("aIndices",s.rank-2,"u32(row)")}
        ${s.indicesSet("aIndices",s.rank-1,"u32(colIn)")}
        value = ${s.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${n.type.indices}) -> ${Ce(e,p)} {
      var value = ${Ce(e,p)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${u.type.indices};
        ${pr("bIndices",u,u.rank-2,n.rank,"batchIndices")}
        ${u.indicesSet("bIndices",u.rank-2,"u32(row)")}
        ${u.indicesSet("bIndices",u.rank-1,"u32(colIn)")}
        value = ${u.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${Ce(e,p)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${a?"bias[colIn]":`${Ce(e,p)}(bias[row])`};`:""}
        ${r}
        ${l.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},Xr=(e,t,r,i,a=!1,n)=>{let s=e[0].dims,u=e[1].dims,l=s.slice(0,-2),p=u.slice(0,-2),c=i?i.slice(0,-2):r.slice(0,-2),h=O.size(c),g=s[s.length-2],_=s[s.length-1],y=u[u.length-1],w=_%4===0&&y%4===0,S=g<=8?[4,1,1]:[4,4,1],x=[8,8,1],b=[Math.ceil(y/x[0]/S[0]),Math.ceil(g/x[1]/S[1]),Math.ceil(h/x[2]/S[2])],I=w?4:1,k=[...l,g,_/I],T=k.length,z=[...p,_,y/I],C=z.length,v=[h,g,y/I],N=[{type:6,data:g},{type:6,data:y},{type:6,data:_}];Mt(t,N),N.push(...X(c,k,z));let P=["rank","rank"],F=e.length>2;F&&(N.push(...X(e[2].dims)),P.push("rank")),N.push(...X(v));let W=K=>{let B=c.length,D=en("batchDims",e[0].dataType,B,1),H=Ee(e[0].dataType),Q=R("a",e[0].dataType,T,I),J=R("b",e[1].dataType,C,I),te=j("result",e[0].dataType,v.length,I),ne=[Q,J];if(F){let Te=a?I:1;ne.push(R("bias",e[2].dataType,e[2].dims.length,Te))}let U=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];Nt(t,U);let ee=Ee(te.type.tensor),Y=Rt(t,te.type.value,ee),G=Pu(I,F,Y,[D,Q,J,te],a);return`
  ${K.registerUniforms(U).registerInternalVariables(D).declareVariables(...ne,te)}
  ${G}
  ${w?Ma(S,x,H,D):Na(S,x,H,D)}
                   `};return{name:"MatMul",shaderCache:{hint:`${S};${t.activation};${w};${a}`,inputDependencies:P},getRunData:()=>({outputs:[{dims:n?n(r):r,dataType:e[0].dataType}],dispatchGroup:{x:b[0],y:b[1],z:b[2]},programUniforms:N}),getShaderSource:W}}}),qu,uh,C0=q(()=>{"use strict";re(),ot(),ae(),Ut(),sn(),z0(),ln(),qu=(e,t,r,i,a=!1,n,s=4,u=4,l=4,p="f32")=>{let c=N=>{switch(N){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${p}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${N} is not supported.`)}},h=N=>{switch(N){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw new Error(`innerElementSize ${N} is not supported.`)}},g=e?`
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    `:`
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `,_=e?`
    let coords = vec4<i32>(
      batch,
      row / outWidth,
      row % outWidth,
      col);
    `:`
    let coords = vec4<i32>(
      batch,
      row,
      col / outWidth,
      col % outWidth);
    `,y=e?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",w=e?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",S=e?"row":"col",x=e?"col":"row",b=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
    let outRow = ${S} / outWidth;
    let outCol = ${S} % outWidth;

    let WRow = ${x} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${x} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${x} % inChannels;
    var resData = ${Ce(s,p)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${y} && xCol >= 0 && xCol < ${w}) {
      ${g}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${c(s)}
    }
    return resData;`,I=e?t&&i?`
    let col = colIn * ${s};
    ${b}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${b}
    }
    return ${Ce(s,p)}(0.0);`:i&&r?`
    let col = colIn * ${s};
    ${b}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${b}
    }
    return ${Ce(s,p)}(0.0);`,k=e?i&&r?h(u):`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${h(u)}
    }
    return ${Ce(u,p)}(0.0);`:`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${h(u)}
    }
    return ${Ce(u,p)}(0.0);`,T=Ce(l,p),z=Ce(e?s:u,p),C=Ce(e?u:s,p),v=Rt(n,T,p);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${z} {
      ${e?I:k}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${C} {
      ${e?k:I}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${T}) {
      let col = colIn * ${l};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${_}
      ${sh(a)}
      ${v}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},uh=(e,t,r,i,a,n,s,u,l)=>{let p=t.format==="NHWC",c=p?e[0].dims[3]:e[0].dims[1],h=r[0],g=p?r[2]:r[3],_=p?r[1]:r[2],y=p?r[3]:r[1],w=p&&(c%4===0||c%3===0)&&y%4===0,S=p?y:g*_,x=p?g*_:y,b=[8,8,1],I=i<=8?[4,1,1]:[4,4,1],k=[Math.ceil(S/b[0]/I[0]),Math.ceil(x/b[1]/I[1]),Math.ceil(h/b[2]/I[2])];de("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${k}`);let T=w?p&&c%4!==0?3:4:1,z=b[1]*I[1],C=b[0]*I[0],v=Math.max(b[0]*T,b[1]),N=i%z===0,P=a%C===0,F=n%v===0,W=w?[T,4,4]:[1,1,1],K=[{type:6,data:i},{type:6,data:a},{type:6,data:n},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];Mt(t,K),K.push(...X(e[0].dims,e[1].dims));let B=["rank","rank"];s&&(K.push(...X(e[2].dims)),B.push("rank")),K.push(...X(r));let D=H=>{let Q=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];Nt(t,Q);let J=w?4:1,te=Ee(e[0].dataType),ne=`
      fn setOutputAtIndex(flatIndex : i32, value : ${w?`vec4<${te}>`:te}) {
        result[flatIndex] = ${w?`vec4<${te}>`:te}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${w?`vec4<${te}>`:te}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${w?"/ 4":""}, value);
      }`,U=R("x",e[0].dataType,e[0].dims.length,T===3?1:T),ee=R("w",e[1].dataType,e[1].dims.length,J),Y=[U,ee],G=j("result",e[0].dataType,r.length,J);if(s){let Te=R("bias",e[2].dataType,e[2].dims.length,J);Y.push(Te),ne+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${w?`vec4<${te}>`:te} {
          return bias[coords.${p?"w":"y"}${w?"/ 4":""}];
        }`}return`
        ${oh("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${H.registerUniforms(Q).declareVariables(...Y,G)}
        ${ne}
        ${qu(p,N,P,F,s,t,W[0],W[1],W[2],te)}
        ${w?Ma(I,b,te,void 0,!p,v):Na(I,b,te,void 0,!p,v,!1,void 0,u)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${t.cacheKey};${T};${w};${N};${P};${F};${z};${C};${v}`,inputDependencies:B},getRunData:()=>({outputs:[{dims:l?l(r):r,dataType:e[0].dataType}],dispatchGroup:{x:k[0],y:k[1],z:k[2]},programUniforms:K}),getShaderSource:D}}}),Lu,ji,tr,Wu,Ki,Vu,lh,dh,A0=q(()=>{"use strict";re(),ot(),ie(),ae(),Ut(),sn(),Lu=e=>{let t=1;for(let r=0;r<e.length;r++)t*=e[r];return t},ji=e=>typeof e=="number"?[e,e,e]:e,tr=(e,t)=>t<=1?e:e+(e-1)*(t-1),Wu=(e,t,r,i=1)=>{let a=tr(t,i);return Math.floor((e[0]*(r-1)-r+a)/2)},Ki=(e,t,r,i,a)=>{a==null&&(a=Wu(e,t[0],i[0]));let n=[0,0,0,r];for(let s=0;s<3;s++)e[s]+2*a>=t[s]&&(n[s]=Math.trunc((e[s]-t[s]+2*a)/i[s]+1));return n},Vu=(e,t,r,i,a,n,s,u,l,p)=>{let c,h,g,_;if(e==="VALID"&&(e=0),typeof e=="number"){c={top:e,bottom:e,left:e,right:e,front:e,back:e};let y=Ki([t,r,i,1],[u,l,p],1,[a,n,s],e);h=y[0],g=y[1],_=y[2]}else if(Array.isArray(e)){if(!e.every((w,S,x)=>w===x[0]))throw Error(`Unsupported padding parameter: ${e}`);c={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let y=Ki([t,r,i,1],[u,l,p],1,[a,n,s],e[0]);h=y[0],g=y[1],_=y[2]}else if(e==="SAME_UPPER"){h=Math.ceil(t/a),g=Math.ceil(r/n),_=Math.ceil(i/s);let y=(h-1)*a+u-t,w=(g-1)*n+l-r,S=(_-1)*s+p-i,x=Math.floor(y/2),b=y-x,I=Math.floor(w/2),k=w-I,T=Math.floor(S/2),z=S-T;c={top:I,bottom:k,left:T,right:z,front:x,back:b}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:c,outDepth:h,outHeight:g,outWidth:_}},lh=(e,t,r,i,a,n=!1,s="channelsLast")=>{let u,l,p,c,h;if(s==="channelsLast")[u,l,p,c,h]=e;else if(s==="channelsFirst")[u,h,l,p,c]=e;else throw new Error(`Unknown dataFormat ${s}`);let[g,,_,y,w]=t,[S,x,b]=ji(r),[I,k,T]=ji(i),z=tr(_,I),C=tr(y,k),v=tr(w,T),{padInfo:N,outDepth:P,outHeight:F,outWidth:W}=Vu(a,l,p,c,S,x,b,z,C,v),K=n?g*h:g,B=[0,0,0,0,0];return s==="channelsFirst"?B=[u,K,P,F,W]:s==="channelsLast"&&(B=[u,P,F,W,K]),{batchSize:u,dataFormat:s,inDepth:l,inHeight:p,inWidth:c,inChannels:h,outDepth:P,outHeight:F,outWidth:W,outChannels:K,padInfo:N,strideDepth:S,strideHeight:x,strideWidth:b,filterDepth:_,filterHeight:y,filterWidth:w,effectiveFilterDepth:z,effectiveFilterHeight:C,effectiveFilterWidth:v,dilationDepth:I,dilationHeight:k,dilationWidth:T,inShape:e,outShape:B,filterShape:t}},dh=(e,t,r,i,a,n)=>{let s=n==="channelsLast",u=s?e[0].dims[3]:e[0].dims[1],l=!1,p=[64,1,1],c={x:r.map((b,I)=>I)},h=[Math.ceil(Lu(c.x.map(b=>r[b]))/p[0]),1,1];de("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${h}`);let g=l?s&&u%4!==0?3:4:1,_=O.size(r),y=[{type:12,data:_},{type:12,data:i},{type:12,data:a},{type:12,data:t.strides},{type:12,data:t.dilations}];Mt(t,y),y.push(...X(e[0].dims,e[1].dims));let w=["rank","rank"],S=e.length===3;S&&(y.push(...X(e[2].dims)),w.push("rank")),y.push(...X(r));let x=b=>{let I=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:i.length},{name:"pads",type:"u32",length:a.length},{name:"strides",type:"u32",length:t.strides.length},{name:"dilations",type:"u32",length:t.dilations.length}];Nt(t,I);let k=l?4:1,T=Ee(e[0].dataType),z=R("x",e[0].dataType,e[0].dims.length,g===3?1:g),C=R("W",e[1].dataType,e[1].dims.length,k),v=[z,C],N=j("result",e[0].dataType,r.length,k),P="";if(S){let K=R("bias",e[2].dataType,e[2].dims.length,k);v.push(K),P+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${l?`vec4<${T}>`:T} {
          return bias[${s?Z("coords",4,5):Z("coords",1,5)}${l?"/ 4":""}];
        }`}let F=Ce(g,T),W=Rt(t,F,T);return`
            ${P}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> ${T} {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${z.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> ${T} {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${C.getByIndices("aIndices")};
            }
          ${b.registerUniforms(I).declareVariables(...v,N)}
          ${b.mainStart()}
          ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${N.offsetToIndices("global_idx")};
              let batch = ${Z("coords",0,z.rank)};
              let d2 = ${s?Z("coords",z.rank-1,z.rank):Z("coords",1,z.rank)};
              let xFRCCorner = vec3<u32>(${s?Z("coords",1,z.rank):Z("coords",2,z.rank)},
              ${s?Z("coords",2,z.rank):Z("coords",3,z.rank)},
              ${s?Z("coords",3,z.rank):Z("coords",4,z.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${s?Z("uniforms.x_shape",1,z.rank):Z("uniforms.x_shape",2,z.rank)};
              let xShapeZ = ${s?Z("uniforms.x_shape",2,z.rank):Z("uniforms.x_shape",3,z.rank)};
              let xShapeW = ${s?Z("uniforms.x_shape",3,z.rank):Z("uniforms.x_shape",4,z.rank)};
              let xShapeU = ${s?Z("uniforms.x_shape",4,z.rank):Z("uniforms.x_shape",1,z.rank)};
              let inputDepthNearestVec4 = (xShapeU / 4) * 4;
              let inputDepthVec4Remainder = xShapeU % 4;

              var value = ${T}(0);
              for (var wF = 0u; wF < uniforms.filter_dims[0]; wF++) {
                let xF = xFCorner + wF * uniforms.dilations[0];
                if (xF < 0 || xF >= xShapeY) {
                  continue;
                }

                for (var wR = 0u; wR < uniforms.filter_dims[1]; wR++) {
                  let xR = xRCorner + wR * uniforms.dilations[1];
                  if (xR < 0 || xR >= xShapeZ) {
                    continue;
                  }

                  for (var wC = 0u; wC < uniforms.filter_dims[2]; wC++) {
                    let xC = xCCorner + wC * uniforms.dilations[2];
                    if (xC < 0 || xC >= xShapeW) {
                      continue;
                    }

                    for (var d1 = 0u; d1 < inputDepthNearestVec4; d1 += 4) {
                      ${s?`let xValues = vec4<${T}>(
                               getX(batch, xF, xR, xC, d1),
                               getX(batch, xF, xR, xC, d1 + 1),
                               getX(batch, xF, xR, xC, d1 + 2),
                               getX(batch, xF, xR, xC, d1 + 3));
                            `:`let xValues = vec4<${T}>(
                               getX(batch, d1, xF, xR, xC),
                               getX(batch, d1 + 1, xF, xR, xC),
                               getX(batch, d1 + 2, xF, xR, xC),
                               getX(batch, d1 + 3, xF, xR, xC));
                            `}
                            let wValues = vec4<${T}>(
                              getW(d2, d1, wF, wR, wC),
                              getW(d2, d1 + 1, wF, wR, wC),
                              getW(d2, d1 + 2, wF, wR, wC),
                              getW(d2, d1 + 3, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                    if (inputDepthVec4Remainder == 1) {
                        ${s?`value += getX(batch, xF, xR, xC, inputDepthNearestVec4)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`:`value += getX(batch, inputDepthNearestVec4, xF, xR, xC)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`}
                    } else if (inputDepthVec4Remainder == 2) {
                      ${s?`let xValues = vec2<${T}>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1));
                      `:`let xValues = vec2<${T}>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC));
                    `}
                    let wValues = vec2<${T}>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC));
                      value += dot(xValues, wValues);
                    } else if (inputDepthVec4Remainder == 3) {
                      ${s?`let xValues = vec3<${T}>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2));
                      `:`let xValues = vec3<${T}>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 2, xF, xR, xC));
                    `}
                    let wValues = vec3<${T}>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 2, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                  }
                }
              }
              ${S?"value = value + getBiasByOutputCoords(coords)":""};
              ${W}
              result[global_idx] = ${T}(value);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${t.cacheKey};${s};${g};${S}`,inputDependencies:w},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:h[0],y:h[1],z:h[2]},programUniforms:y}),getShaderSource:x}}}),ph,ch,O0=q(()=>{"use strict";re(),ie(),ae(),Ut(),ph=(e,t,r,i)=>{let a=e.length>2,n=a?"value += b[output_channel];":"",s=e[0].dims,u=e[1].dims,l=t.format==="NHWC",p=l?r[3]:r[1],c=p/t.group,h=l&&c>=4?xe(p):1,g=O.size(r)/h,_=[{type:12,data:g},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:c}];Mt(t,_),_.push(...X(s,[u[0],u[1],u[2],u[3]/h]));let y=a?["rank","rank","rank"]:["rank","rank"];_.push(...X([r[0],r[1],r[2],r[3]/h]));let w=S=>{let x=j("output",e[0].dataType,r.length,h),b=Ee(x.type.tensor),I=Rt(t,x.type.value,b),k=R("x",e[0].dataType,s.length),T=R("w",e[1].dataType,u.length,h),z=[k,T];a&&z.push(R("b",e[2].dataType,e[2].dims,h));let C=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:t.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];Nt(t,C);let v=l?`
      for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[0]; wHeight++) {
        let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

        if (xHeight < 0u || xHeight >= uniforms.x_shape[1]) {
          continue;
        }

        for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[1]; wWidth++) {
          let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
          if (xWidth < 0u || xWidth >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[2]; wInChannel++) {
            let input_channel = in_channel_offset + wInChannel;
            let xVal = ${k.get("batch","xHeight","xWidth","input_channel")};
            let wVal = ${T.get("wHeight","wWidth","wInChannel","output_channel")};
            value += xVal * wVal;
          }
        }
      }
      `:`
      for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[1]; wInChannel++) {
        let input_channel = in_channel_offset + wInChannel;
        for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[2]; wHeight++) {
          let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

          if (xHeight < 0u || xHeight >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[3]; wWidth++) {
            let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
            if (xWidth < 0u || xWidth >= uniforms.x_shape[3]) {
              continue;
            }

            let xVal = ${k.get("batch","input_channel","xHeight","xWidth")};
            let wVal = ${T.get("output_channel","wInChannel","wHeight","wWidth")};
            value += xVal * wVal;
          }
        }
      }
      `;return`
  ${S.registerUniforms(C).declareVariables(...z,x)}

  ${S.mainStart()}
    ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${x.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${l?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${l?1:2}], outputIndices[${l?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${h} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${l?2:1}];

    var value: ${x.type.value} = ${x.type.value}(0);
    ${v}
    ${n}
    ${I}
    ${x.setByOffset("global_idx","value")}
  }`};return{name:"GroupedConv",shaderCache:{hint:`${t.cacheKey}_${h}`,inputDependencies:y},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:_}),getShaderSource:w}},ch=(e,t,r,i)=>{let a=e.length>2,n=xe(r[3]),s=xe(r[2]),u=O.size(r)/n/s,l=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/n],p=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/n],c=[r[0],r[1],r[2],r[3]/n],h=[{type:12,data:u},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];Mt(t,h),h.push(...X(l,p,c));let g=(s-1)*t.strides[1]+p[1],_=y=>{let w=j("output",e[0].dataType,c.length,n),S=Ee(w.type.tensor),x=Rt(t,w.type.value,S),b=R("x",e[0].dataType,l.length,n),I=R("w",e[1].dataType,p.length,n),k=[b,I];a&&k.push(R("b",e[2].dataType,e[2].dims,n));let T=a?"value += b[output_channel];":"",z=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return Nt(t,z),`
  ${y.registerUniforms(z).declareVariables(...k,w)}
  ${y.mainStart()}
    ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${s}u;
    let col = (index1 % width1) * ${s}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${b.type.value}, ${g}>;
    var values: array<${w.type.value}, ${s}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${p[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${g}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${b.get("batch","u32(x_height)","u32(x_width)","input_channel")};
          } else {
            x_vals[i] = ${b.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${p[1]}; w_width++) {
          let w_val = ${I.get("w_height","w_width","0","output_channel")};
          for (var i = 0u; i < ${s}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${s}u; i++) {
      var value = values[i];
      ${T}
      ${x}
      ${w.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${t.cacheKey};${n};${s};${g};${p[0]};${p[1]}`,inputDependencies:a?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:h}),getShaderSource:_}}}),Gu,Mr,Hu,Nr,Da,Zi,Fu,ju,Ua,B0=q(()=>{"use strict";ie(),C0(),A0(),ln(),O0(),Ut(),un(),bt(),Gu=(e,t,r,i,a,n)=>{let s=e[0],u=e.slice(n?1:2,n?3:4),l=u.length,p=t[0],c=t.slice(2).map((g,_)=>g+(g-1)*(r[_]-1)),h=u.map((g,_)=>g+i[_]+i[_+l]).map((g,_)=>Math.floor((g-c[_]+a[_])/a[_]));return h.splice(0,0,s),h.splice(n?3:1,0,p),h},Mr=[2,3,1,0],Hu=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length>5)throw new Error("greater than 5D is not supported");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[1]*t.group;if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");let a=e[0].dims.length-2;if(t.dilations.length!==a)throw new Error(`dilations should be ${a}D`);if(t.strides.length!==a)throw new Error(`strides should be ${a}D`);if(t.pads.length!==a*2)throw new Error(`pads should be ${a*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape")},Nr=(e,t)=>{let r=e.kernelShape.slice();r.length<t[1].dims.length-2&&r.push(...Array(t[1].dims.length-2-r.length).fill(0));for(let n=2;n<t[1].dims.length;++n)r[n-2]===0&&(r[n-2]=t[1].dims[n]);let i=e.pads.slice();Kr.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,r,i,e.format==="NHWC",e.autoPad);let a=Object.assign({},e);return Object.assign(a,{kernelShape:r,pads:i}),a},Da=e=>{let t=nn(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],a=e.dilations,n=e.group,s=e.kernel_shape,u=e.pads,l=e.strides,p=e.w_is_const();return{autoPad:i,format:r,dilations:a,group:n,kernelShape:s,pads:u,strides:l,wIsConst:p,...t,cacheKey:`${e.format};${t.activation};`}},Zi=(e,t,r,i)=>{let a=r.format==="NHWC",n=Gu(t[0].dims,t[1].dims,r.dilations,r.pads,r.strides,a);if(r.group!==1){let z=[t[0]];if(a){let C=e.kernelCustomData.wT??e.compute(De(t[1],Mr),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=C),z.push(C)}else z.push(t[1]);t.length===3&&z.push(t[2]),!e.adapterInfo.isArchitecture("ampere")&&a&&t[1].dims[0]===r.group&&t[1].dims[1]===1&&r.dilations[0]===1&&r.dilations[1]===1?e.compute(ch(z,r,n,i),{inputs:z}):e.compute(ph(z,r,n,i),{inputs:z});return}let s=t.length===3,u=t[0].dims[a?1:2],l=t[0].dims[a?2:3],p=t[0].dims[a?3:1],c=t[1].dims[2],h=t[1].dims[3],g=n[a?1:2],_=n[a?2:3],y=n[a?3:1],w=a&&c===u&&h===l&&r.pads[0]===0&&r.pads[1]===0;if(w||c===1&&h===1&&r.dilations[0]===1&&r.dilations[1]===1&&r.strides[0]===1&&r.strides[1]===1&&r.pads[0]===0&&r.pads[1]===0){let z=n[0],C,v,N,P=[];if(a){let K=e.kernelCustomData.wT??e.compute(De(t[1],Mr),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];if(r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=K),w){let B=u*l*p;C=t[0].reshape([1,z,B]),v=K.reshape([1,B,y]),N=[1,z,y]}else C=t[0].reshape([z,u*l,p]),v=K.reshape([1,p,y]),N=[z,g*_,y];P.push(C),P.push(v)}else C=t[0].reshape([z,p,u*l]),v=t[1].reshape([1,y,p]),N=[z,y,g*_],P.push(v),P.push(C);s&&P.push(t[2]);let F=N[2],W=P[0].dims[P[0].dims.length-1];F<8&&W<8?e.compute(on(P,r,n,N,a,i),{inputs:P}):e.compute(Xr(P,r,n,N,a,i),{inputs:P});return}let S=!0,x=e.kernelCustomData.wT??e.compute(De(t[1],Mr),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=x);let b=[t[0],x];s&&b.push(t[2]);let I=a?g*_:y,k=a?y:g*_,T=c*h*p;e.compute(uh(b,r,n,I,k,T,s,S,i),{inputs:b})},Fu=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let a=[0,t.pads[0],0,t.pads[1]],n=[1].concat(t.strides),s=[1].concat(t.dilations),u=[1].concat(t.kernelShape),l=Nr({...t,pads:a,strides:n,dilations:s,kernelShape:u},i);Zi(e,i,l,p=>r?[p[0],p[2],p[3]]:[p[0],p[1],p[3]])},ju=(e,t,r)=>{let i=r.format==="NHWC"?"channelsLast":"channelsFirst",a=Nr(r,t),n=r.autoPad==="NOTSET"?r.pads:r.autoPad,s=lh(t[0].dims,t[1].dims,r.strides,r.dilations,n,!1,i);e.compute(dh(t,a,s.outShape,[s.filterDepth,s.filterHeight,s.filterWidth],[s.padInfo.front,s.padInfo.top,s.padInfo.left],i))},Ua=(e,t)=>{if(Hu(e.inputs,t),e.inputs[0].dims.length===3)Fu(e,t);else if(e.inputs[0].dims.length===5)ju(e,e.inputs,t);else{let r=Nr(t,e.inputs);Zi(e,e.inputs,r)}}}),hh,R0=q(()=>{"use strict";re(),ot(),ie(),ae(),hh=(e,t,r)=>{let i=e.length>2,a=t.outputShape,n=t.format==="NHWC",s=t.group,u=e[1].dims,l=u[2]/s,p=u[3],c=n?xe(l):1,h=n&&p===1&&l>=4,g=h?Math.floor(l/4)*4:Math.floor(l/c)*c,_=l-g,y=n?xe(p):1,w=n?p===1?c:y:1,S=O.size(a)/y,x=[Math.ceil(S/64),1,1];de("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${x}`);let b=["rank","rank"],I=[t.strides[0],t.strides[1]],k=[t.kernelShape[n?1:2],t.kernelShape[n?2:3]],T=[t.dilations[0],t.dilations[1]],z=[k[0]+(t.dilations[0]<=1?0:(t.kernelShape[n?1:2]-1)*(t.dilations[0]-1)),k[1]+(t.dilations[1]<=1?0:(t.kernelShape[n?2:3]-1)*(t.dilations[1]-1))],C=[z[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),z[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],v=[{type:12,data:S},{type:12,data:I},{type:12,data:k},{type:12,data:T},{type:12,data:z},{type:6,data:C},{type:12,data:g},{type:12,data:l},{type:12,data:p},...X(e[0].dims,e[1].dims)];i&&(v.push(...X(e[2].dims)),b.push("rank")),v.push(...X(a));let N=P=>{let F=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:I.length},{name:"filter_dims",type:"u32",length:k.length},{name:"dilations",type:"u32",length:k.length},{name:"effective_filter_dims",type:"u32",length:z.length},{name:"pads",type:"i32",length:C.length},{name:"input_channels_per_group_int",type:"u32"},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],W=Ee(e[0].dataType),K=n?1:2,B=n?2:3,D=n?3:1,H=R("W",e[1].dataType,e[1].dims.length,w),Q=R("Dy",e[0].dataType,e[0].dims.length,c),J=[Q,H];i&&J.push(R("bias",e[2].dataType,[a[D]].length,y));let te=j("result",e[0].dataType,a.length,y),ne=()=>{let Y="";if(h)c===4?Y+=`
        let xValue = ${Q.getByOffset("x_offset")};
        let wValue = ${H.getByOffset("w_offset")};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;`:c===2?Y+=`
          dotProd = dotProd + dot(vec4<${W}>(${Q.getByOffset("x_offset")}, ${Q.getByOffset("x_offset + 1u")}), vec4<${W}>(${H.getByOffset("w_offset")}, ${H.getByOffset("w_offset + 1u")}));
          x_offset += 2u;
          w_offset += 2u;`:c===1&&(Y+=`
          dotProd = dotProd + dot(vec4<${W}>(${Q.getByOffset("x_offset")}, ${Q.getByOffset("x_offset + 1u")}, ${Q.getByOffset("x_offset + 2u")}, ${Q.getByOffset("x_offset + 3u")}), vec4<${W}>(${H.getByOffset("w_offset")}, ${H.getByOffset("w_offset + 1u")}, ${H.getByOffset("w_offset + 2u")}, ${H.getByOffset("w_offset + 3u")}));
          x_offset += 4u;
          w_offset += 4u;`);else if(Y+=`
                  let xValue = ${n?Q.getByOffset(`${Q.indicesToOffset(`${Q.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${c}`):Q.get("batch","inputChannel","idyR","idyC")};
        `,c===1)Y+=`
          let w_offset = ${H.indicesToOffset(`${H.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${H.getByOffset(`w_offset / ${w}`)};
          dotProd = dotProd + xValue * wValue;`;else for(let G=0;G<c;G++)Y+=`
            let wValue${G} = ${H.getByOffset(`${H.indicesToOffset(`${H.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${G}, wOutChannel)`)} / ${w}`)};
            dotProd = dotProd + xValue[${G}] * wValue${G};`;return Y},U=()=>{if(_===0)return"";if(!h)throw new Error(`packInputAs4 ${h} is not true.`);let Y="";if(c===1){Y+="dotProd = dotProd";for(let G=0;G<_;G++)Y+=`
            + ${Q.getByOffset(`x_offset + ${G}`)} * ${H.getByOffset(`w_offset + ${G}`)}`;Y+=";"}else if(c===2){if(_!==2)throw new Error(`Invalid inputChannelsRemainder ${_}.`);Y+=`
          let xValue = ${Q.getByOffset("x_offset")};
          let wValue = ${H.getByOffset("w_offset")};
          dotProd = dotProd + dot(xValue, wValue);`}return Y},ee=`
            let outputIndices = ${te.offsetToIndices(`global_idx * ${y}`)};
            let batch = ${te.indicesGet("outputIndices",0)};
            let d1 = ${te.indicesGet("outputIndices",D)};
            let r = ${te.indicesGet("outputIndices",K)};
            let c = ${te.indicesGet("outputIndices",B)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${te.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${W}(dyRCorner) + ${W}(wR)) / ${W}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${W}(uniforms.Dy_shape[${K}]) || fract(dyR) > 0.0 ||
                  wRPerm < 0) {
                continue;
              }
              let idyR: u32 = u32(dyR);
              var wC: u32 = 0;
              if (uniforms.dilations.y == 1) {
                // Minimum wC >= 0 that satisfies (dyCCorner + wC) % (uniforms.strides.y) == 0
                wC = u32(((dyCCorner + i32(uniforms.strides.y) - 1) / i32(uniforms.strides.y)) * i32(uniforms.strides.y) - dyCCorner);
              }
              for (; wC < uniforms.effective_filter_dims.y; wC = wC + 1) {
                if (wC % uniforms.dilations.y != 0) {
                  continue;
                }
                let dyC = (${W}(dyCCorner) + ${W}(wC)) / ${W}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${W}(uniforms.Dy_shape[${B}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${h?`
                var x_offset = ${Q.indicesToOffset(`${Q.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${c};
                var w_offset = ${H.indicesToOffset(`${H.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${w};
                  `:""}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${h?4:c}) {
                  ${ne()}
                  inputChannel = inputChannel + ${h?4:c};
                }
                ${U()}
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${i?` + bias[d1 / ${y}]`:""};
            ${te.setByOffset("global_idx","value")};
          `;return`
    ${P.registerUniforms(F).declareVariables(...J,te)}
      ${P.mainStart()}
      ${P.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${ee}}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${t.cacheKey};${c}${w}${y}${h}${_}`,inputDependencies:b},getRunData:()=>({dispatchGroup:{x:x[0],y:x[1],z:x[2]},outputs:[{dims:r?r(a):a,dataType:e[0].dataType}],programUniforms:v}),getShaderSource:N}}}),Ku,Zu,Xu,Xi,fh,Qu,Qi,Yu,mh,M0=q(()=>{"use strict";R0(),Ut(),bt(),Ku=(e,t,r,i,a,n)=>(e-1)*t+r+(i-1)*a+1-n,Zu=(e,t,r,i,a)=>{let n=Math.floor(e/2);t==="SAME_UPPER"?(r[i]=n,r[a]=e-n):t==="SAME_LOWER"&&(r[i]=e-n,r[a]=n)},Xu=(e,t,r,i,a,n,s,u,l,p)=>{let c=e.length-2,h=p.length===0;l.length<c&&l.push(...Array(c-l.length).fill(0));let g=e[0],_=t[u?3:1]*a;for(let y=0,w=e.length-c-(u?1:0);y<c;++y,++w){let S=e[w],x=h?S*s[y]:p[y],b=Ku(S,s[y],n[y],t[w],r[y],x);Zu(b,i,n,y,y+c),h&&p.push(s[y]*(S-1)+l[y]+(t[w]-1)*r[y]+1-n[y]-n[y+c])}p.splice(0,0,g),p.splice(u?3:1,0,_)},Xi=(e,t)=>{let r=e.kernelShape.slice();if(e.kernelShape.length===0||e.kernelShape.reduce((h,g)=>h*g,1)===0){r.length=0;for(let h=2;h<t[1].dims.length;++h)r.push(t[1].dims[h])}let i=e.format==="NHWC";r.splice(0,0,t[1].dims[0]),r.splice(i?3:1,0,t[1].dims[1]);let a=e.pads.slice(),n=e.outputShape.slice(),s=e.outputPadding.slice(),u=t[0].dims,l=e.dilations.slice();if(l.reduce((h,g)=>h+g,0)===0){let h=t[0].dims.length-2;l=new Array(h).fill(1)}let p=e.strides.slice();if(p.reduce((h,g)=>h+g,0)===0){let h=t[0].dims.length-2;p=new Array(h).fill(1)}Xu(u,r,l,e.autoPad,e.group,a,p,i,s,n);let c=Object.assign({},e);return Object.assign(c,{kernelShape:r,pads:a,outputPadding:s,outputShape:n,dilations:l,strides:p}),c},fh=e=>{let t=nn(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof e.autoPad>"u"?0:e.autoPad],a=e.dilations,n=e.group??1,s=e.kernelShape,u=e.pads,l=e.strides,p=e.wIsConst(),c=e.outputPadding,h=e.outputShape;return{autoPad:i,format:r,dilations:a,group:n,kernelShape:s,outputPadding:c,outputShape:h,pads:u,strides:l,wIsConst:p,...t,cacheKey:`${e.format};${t.activation};`}},Qu=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4&&e[0].dims.length!==3)throw new Error("currently only support 2-dimensional conv");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[0];if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let a=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==a))throw new Error("invalid bias");let n=e[0].dims.length-2;if(t.dilations.reduce((s,u)=>s+u,0)>0&&t.dilations.length!==n)throw new Error(`dilations should be ${n}D`);if(t.strides.reduce((s,u)=>s+u,0)>0&&t.strides.length!==n)throw new Error(`strides should be ${n}D`);if(t.pads.reduce((s,u)=>s+u,0)>0&&t.pads.length!==n*2)throw new Error(`pads should be ${n*2}D`);if(t.outputPadding.length!==n&&t.outputPadding.length!==0)throw new Error(`output_padding should be ${n}D`);if(t.kernelShape.reduce((s,u)=>s+u,0)>0&&t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw new Error("invalid output shape")},Qi=(e,t,r,i)=>{let a=e.kernelCustomData.wT??e.compute(De(t[1],[2,3,0,1]),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=a);let n=[t[0],a];t.length===3&&n.push(t[2]),e.compute(hh(n,r,i),{inputs:n})},Yu=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let a=t.kernelShape;(a.length===0||a[0]===0)&&(a=[e.inputs[1].dims[2]]);let n=t.dilations;(n.length===0||n[0]===0)&&(n=[1]);let s=t.strides;(s.length===0||s[0]===0)&&(s=[1]);let u=t.pads;u.length===0&&(u=[0,0]),u=[0,u[0],0,u[1]],s=[1].concat(s),n=[1].concat(n),a=[1].concat(a);let l=t.outputPadding;l=[0].concat(l);let p=Xi({...t,pads:u,strides:s,dilations:n,kernelShape:a,outputPadding:l},i);Qi(e,i,p,c=>r?[c[0],c[2],c[3]]:[c[0],c[1],c[3]])},mh=(e,t)=>{if(Qu(e.inputs,t),e.inputs[0].dims.length===3)Yu(e,t);else{let r=Xi(t,e.inputs);Qi(e,e.inputs,r)}}}),Ju,gh,yh,N0=q(()=>{"use strict";re(),ie(),Se(),ae(),Ju=(e,t,r,i)=>{let a=O.size(t),n=t.length,s=R("input",e,n),u=j("output",e,n),l=r.dataType===6?r.getInt32Array()[0]:Number(r.getBigInt64Array()[0]),p=O.normalizeAxis(l,n),c=h=>{let g=` i32(${s.indicesGet("inputIndices","uniforms.axis")}) `,_=Z("uniforms.input_shape","uniforms.axis",n),y=i.reverse?g+(i.exclusive?" + 1":""):"0",w=i.reverse?_:g+(i.exclusive?"":" + 1");return`
                ${h.registerUniform("outputSize","u32").registerUniform("axis","u32").declareVariables(s,u)}
                ${h.mainStart()}
                  ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${u.offsetToIndices("global_idx")};
                  var sum = ${u.type.value}(0);
                  let first : i32 = ${y};
                  let last : i32 = ${w};
                  for (var i : i32 = first; i < last; i++) {
                    ${s.indicesSet("inputIndices","uniforms.axis","u32(i)")};
                    sum = sum + ${s.getByIndices("inputIndices")};
                  }
                  ${u.setByOffset("global_idx","sum")};
                }`};return{name:"CumSum",shaderCache:{hint:i.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:[{type:12,data:a},{type:12,data:p},...X(t,t)]}),getShaderSource:c}},gh=(e,t)=>{let r=e.inputs[0].dims,i=e.inputs[0].dataType,a=e.inputs[1];e.compute(Ju(i,r,a,t),{inputs:[0]})},yh=e=>{let t=e.exclusive===1,r=e.reverse===1;return he({exclusive:t,reverse:r})}}),el,tl,rl,_h,bh,D0=q(()=>{"use strict";re(),ie(),Se(),ae(),el=e=>{if(!e||e.length!==1)throw new Error("DepthToSpace requires 1 input.");if(e[0].dims.length!==4)throw new Error("DepthToSpace requires 4D input.")},tl=(e,t,r,i)=>{let a=[];a.push(`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`);for(let n=0;n<t;++n)a.push(r.indicesSet("a",e[n],`i[${n}]`));return a.push("return a;}"),a.join(`
`)},rl=(e,t)=>{let r,i,a,n,s,u,l=t.format==="NHWC",p=t.blocksize,c=t.mode==="DCR";l?([r,i,a,n]=e.dims,s=c?[r,i,a,p,p,n/p**2]:[r,i,a,n/p**2,p,p],u=c?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([r,i,a,n]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],s=c?[r,p,p,n/p**2,i,a]:[r,n/p**2,p,p,i,a],u=c?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let h=e.reshape(s),g=h.dims.length,_=e.dataType,y=R("a",_,g),w=j("output",_,g),S=x=>`
  ${x.registerUniform("output_size","u32").declareVariables(y,w)}

  ${tl(u,g,y,w)}

  ${x.mainStart()}
    ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${w.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${w.setByOffset("global_idx",y.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:["rank"]},getRunData:x=>{let b=l?[r,i*p,a*p,n/p**2]:[r,n/p**2,i*p,a*p],I=O.size(b),k=h.dims,T=O.sortBasedOnPerm(k,u);return{outputs:[{dims:b,dataType:x[0].dataType}],dispatchGroup:{x:Math.ceil(I/64)},programUniforms:[{type:12,data:I},...X(k,T)]}},getShaderSource:S}},_h=(e,t)=>{el(e.inputs),e.compute(rl(e.inputs[0],t))},bh=e=>he({blocksize:e.blocksize,mode:e.mode,format:e.format})}),at,rr,Dr,Yi,ft,il,al,nl,Ji,ea,ta,sl,ol,ra,ul,wh,$h,U0=q(()=>{"use strict";re(),ie(),Se(),ae(),at=256,rr=512,Dr=2*Math.PI,Yi=e=>{let t=[],r=e;for(let i of[4,2,3,5])for(;r%i===0;)t.push(i),r/=i;return r===1?t:void 0},ft=e=>{let t=e.toPrecision(9);return/[.eE]/.test(t)?t:`${t}.0`},il=(e,t,r,i,a)=>{let n=r/e,s=rr-i,u=p=>`smem[${s}u + base + ${p*t}u]`,l=`  for (var t = local_idx; t < ${n}u; t += ${at}u) {
`;l+=`    let twiddleIndex = t % ${t}u;
    let angleUnit = f32(twiddleIndex);
`,l+=`    var leg: array<vec2<f32>, 5>;
`;for(let p=0;p<e;p++){let c=`${i}u + t + ${p*n}u`;if(p===0)l+=`    leg[0] = smem[${c}];
`;else{let h=a*Dr*p/(e*t);l+=`    { let a = ${ft(h)} * angleUnit; leg[${p}] = cmul(smem[${c}], vec2<f32>(cos(a), sin(a))); }
`}}if(l+=`    let base = (t / ${t}u) * ${t*e}u + twiddleIndex;
`,e===2)l+=`    ${u(0)} = leg[0] + leg[1];
    ${u(1)} = leg[0] - leg[1];
`;else if(e===4){let p=a<0?"vec2<f32>(oddDiff.y, -oddDiff.x)":"vec2<f32>(-oddDiff.y, oddDiff.x)";l+=`    let evenSum = leg[0] + leg[2]; let evenDiff = leg[0] - leg[2];
`,l+=`    let oddSum = leg[1] + leg[3]; let oddDiff = leg[1] - leg[3];
`,l+=`    let oddRot = ${p};
`,l+=`    ${u(0)} = evenSum + oddSum;
    ${u(1)} = evenDiff + oddRot;
`,l+=`    ${u(2)} = evenSum - oddSum;
    ${u(3)} = evenDiff - oddRot;
`}else for(let p=0;p<e;p++){let c=["leg[0]"];for(let h=1;h<e;h++){let g=a*Dr*(h*p)/e,_=ft(Math.cos(g)),y=ft(Math.sin(g));c.push(`vec2<f32>(leg[${h}].x*${_} - leg[${h}].y*${y}, leg[${h}].x*${y} + leg[${h}].y*${_})`)}l+=`    ${u(p)} = ${c.join(" + ")};
`}return`${l}  }
  workgroupBarrier();
`},al=(e,t,r)=>{let i="",a=1,n=0;for(let s of e)i+=il(s,a,t,n,r),a*=s,n=rr-n;return{code:i,resultOffset:n}},nl=(e,t,r,i,a)=>{let n=e.dims,s=n.length,u=n[s-1],l=n[t],p=r&&i?(l-1)*2:l;a!==void 0&&(p=a);let c=r&&i?1:2,h=i&&!r?Math.floor(p/2)+1:p,g=n.slice();g[t]=h,g[s-1]=c;let _=1;for(let w=t+1;w<s-1;w++)_*=n[w];let y=O.size(n)/u/l;return{dataType:e.dataType,outputDims:g,length:p,signalLength:l,inner:_,batch:y,inputComponents:u,outputComponents:c,outputLength:h,inverse:r,onesided:i}},Ji=(e,t)=>[t,e.length,e.inputComponents,e.outputComponents,e.inverse,e.onesided].join(";"),ea=e=>[{type:12,data:e.batch},{type:12,data:e.signalLength},{type:12,data:e.inner},{type:12,data:e.outputLength}],ta=(e,t,r)=>e.registerUniform("batch","u32").registerUniform("signalLength","u32").registerUniform("inner","u32").registerUniform("outputLength","u32").declareVariables(t,r),sl=e=>{let{dataType:t,length:r,inputComponents:i,outputComponents:a,inverse:n,onesided:s}=e,u=Ie(t),l=n?1:-1,p=n?1/r:1,c=Yi(r),h=g=>{let _=R("x",t,[1]),y=j("y",t,[1]),w=T=>{let z=`inBase + (${T}) * uniforms.inner * ${i}u`,C=`f32(${_.getByOffset(z)})`,v=i===2?`f32(${_.getByOffset(`${z} + 1u`)})`:"0.0";return`vec2<f32>(${C}, ${v})`},S;if(n&&s){let T=Math.floor(r/2)+1,z=r%2===0?`select(provided, provided - 1u, provided == ${T}u)`:"provided";S=`
    let provided = min(uniforms.signalLength, ${T}u);
    for (var i = local_idx; i < ${r}u; i += ${at}u) {
      if (i < provided) { smem[i] = ${w("i")}; } else { smem[i] = vec2<f32>(0.0); }
    }
    workgroupBarrier();
    for (var k = local_idx + 1u; k < ${z}; k += ${at}u) {
      let h = smem[k];
      smem[${r}u - k] = vec2<f32>(h.x, -h.y);
    }
    workgroupBarrier();`}else S=`
    let loadCount = min(uniforms.signalLength, ${r}u);
    for (var i = local_idx; i < ${r}u; i += ${at}u) {
      if (i < loadCount) { smem[i] = ${w("i")}; } else { smem[i] = vec2<f32>(0.0); }
    }
    workgroupBarrier();`;let{code:x,resultOffset:b}=al(c,r,l),I=p===1?`smem[${b}u + i]`:`smem[${b}u + i] * ${ft(p)}`,k=a===2?y.setByOffset("off + 1u",`${u}(v.y)`):"";return`
  ${ta(g,_,y)}
  var<workgroup> smem: array<vec2<f32>, ${2*rr}>;
  fn cmul(a: vec2<f32>, b: vec2<f32>) -> vec2<f32> {
    return vec2<f32>(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
  }
  ${g.mainStart(at)}
    let row = workgroup_index;
    if (row >= uniforms.batch) { return; }
    let outer = row / uniforms.inner;
    let within = row % uniforms.inner;
    let inBase = (outer * uniforms.signalLength * uniforms.inner + within) * ${i}u;
    let outBase = (outer * uniforms.outputLength * uniforms.inner + within) * ${a}u;
    ${S}
${x}    for (var i = local_idx; i < uniforms.outputLength; i += ${at}u) {
      let v = ${I};
      let off = outBase + i * uniforms.inner * ${a}u;
      ${y.setByOffset("off",`${u}(v.x)`)}
      ${k}
    }
  }`};return{name:"DFT",shaderCache:{hint:Ji(e,"fft"),inputDependencies:["type"]},getShaderSource:h,getRunData:()=>({outputs:[{dims:e.outputDims,dataType:t}],programUniforms:ea(e),dispatchGroup:{x:e.batch}})}},ol=e=>{let{dataType:t,length:r,inputComponents:i,outputComponents:a,inverse:n,onesided:s}=e,u=Ie(t),l=n?1:-1,p=n?1/r:1,c=h=>{let g=R("x",t,[1]),_=j("y",t,[1]),y=I=>{let k=`inBase + (${I}) * uniforms.inner * ${i}u`,T=`f32(${g.getByOffset(k)})`,z=i===2?`f32(${g.getByOffset(`${k} + 1u`)})`:"0.0";return`vec2<f32>(${T}, ${z})`},w=n&&s?`fn spectrum(inBase: u32, k: u32) -> vec2<f32> {
    let provided = min(uniforms.signalLength, ${Math.floor(r/2)+1}u);
    if (k < provided) { return ${y("k")}; }
    let m = ${r}u - k;
    if (m < provided) {
      let h = ${y("m")};
      return vec2<f32>(h.x, -h.y);
    }
    return vec2<f32>(0.0, 0.0);
  }`:`fn spectrum(inBase: u32, n: u32) -> vec2<f32> {
    if (n < uniforms.signalLength) { return ${y("n")}; }
    return vec2<f32>(0.0, 0.0);
  }`,S=`
      let angle = ${ft(l*Dr)} * f32(knMod) / ${ft(r)};
      acc += cmul(spectrum(inBase, n), vec2<f32>(cos(angle), sin(angle)));
      knMod += k;
      if (knMod >= ${r}u) { knMod -= ${r}u; }`,x=a===2?_.setByOffset("off + 1u",`${u}(v.y)`):"",b=p===1?"acc":`acc * ${ft(p)}`;return`
  ${ta(h,g,_)}
  fn cmul(a: vec2<f32>, b: vec2<f32>) -> vec2<f32> {
    return vec2<f32>(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
  }
  ${w}
  ${h.mainStart(at)}
    let row = workgroup_index;
    if (row >= uniforms.batch) { return; }
    let outer = row / uniforms.inner;
    let within = row % uniforms.inner;
    let inBase = (outer * uniforms.signalLength * uniforms.inner + within) * ${i}u;
    let outBase = (outer * uniforms.outputLength * uniforms.inner + within) * ${a}u;
    for (var k = local_idx; k < uniforms.outputLength; k += ${at}u) {
      var acc = vec2<f32>(0.0, 0.0);
      var knMod = 0u;
      for (var n = 0u; n < ${r}u; n++) {${S}
      }
      let v = ${b};
      let off = outBase + k * uniforms.inner * ${a}u;
      ${_.setByOffset("off",`${u}(v.x)`)}
      ${x}
    }
  }`};return{name:"DFT",shaderCache:{hint:Ji(e,"direct"),inputDependencies:["type"]},getShaderSource:c,getRunData:()=>({outputs:[{dims:e.outputDims,dataType:t}],programUniforms:ea(e),dispatchGroup:{x:e.batch}})}},ra=e=>{if(!e||e.dataType===0)return;if(O.size(e.dims)!==1)throw new Error("DFT optional scalar inputs must have exactly 1 element.");if(e.dataType===6)return e.getInt32Array()[0];let t=Number(e.getBigInt64Array()[0]);if(!Number.isSafeInteger(t))throw new Error("DFT optional scalar inputs are out of JavaScript safe integer range.");return t},ul=e=>{if(!e||e.length<1)throw new Error("DFT requires at least 1 input.");let t=e[0].dims;if(t.length<2)throw new Error("DFT input must have at least 2 dimensions.");let r=t[t.length-1];if(r!==1&&r!==2)throw new Error("DFT input's innermost dimension must be 1 (real) or 2 (complex).")},wh=(e,t)=>{ul(e.inputs);let r=e.inputs[0],i=r.dims.length,a=t.inverse!==0,n=t.onesided!==0,s=ra(e.inputs[1]);if(s!==void 0&&s<=0)throw new Error("dft_length must be greater than zero.");let u=O.normalizeAxis(ra(e.inputs[2])??t.axis,i);if(u===i-1)throw new Error("DFT axis must refer to a signal dimension, not the innermost (real/imaginary) dimension.");if(a&&n&&r.dims[i-1]!==2)throw new Error("Inverse one-sided DFT (IRFFT) requires complex-valued input (innermost dimension 2).");let l=nl(r,u,a,n,s);if(l.length<=0)throw new Error(`Invalid DFT length: ${l.length}`);let p=l.length<=rr&&Yi(l.length)!==void 0?sl(l):ol(l);e.compute(p,{inputs:[0]})},$h=e=>he({axis:e.axis??1,inverse:e.inverse??0,onesided:e.onesided??0})}),Ur,ir,ia,ll,dl,pl,cl,aa,hl,vh,xh,P0=q(()=>{"use strict";re(),ie(),Se(),ae(),Ur="[a-zA-Z]|\\.\\.\\.",ir="("+Ur+")+",ia="^"+ir+"$",ll="("+ir+",)*"+ir,dl="^"+ll+"$",pl=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,t){let r=this.symbolToIndices.get(e);r===void 0?r=[t]:r.push(t),this.symbolToIndices.set(e,r)}},cl=class{constructor(e,t){this.equation=t,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=new Array,this.outputDims=[];let[r,i]=t.includes("->")?t.split("->",2):[t,""];if(!r.match(RegExp(dl)))throw new Error("Invalid LHS term");if(r.split(",").forEach((a,n)=>{let s=e[n].dims.slice();if(!a.match(RegExp(ia)))throw new Error("Invalid LHS term");let u=this.processTerm(a,!0,s,n);this.lhs.push(u)}),i==="")i+=[...this.symbolToInfo.entries()].filter(([a,n])=>n.count===1||a==="...").map(([a])=>a).join("");else if(!i.match(RegExp(ir)))throw new Error("Invalid RHS");i.match(RegExp(Ur,"g"))?.forEach(a=>{if(a==="...")this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let n=this.symbolToInfo.get(a);if(n===void 0)throw new Error("Invalid RHS symbol");this.outputDims.push(n.dimValue)}}),this.rhs=this.processTerm(i,!1,this.outputDims)}addSymbol(e,t,r){let i=this.symbolToInfo.get(e);if(i!==void 0){if(i.dimValue!==t&&i.count!==1)throw new Error("Dimension mismatch");i.count++,i.inputIndices.push(r)}else i={count:1,dimValue:t,inputIndices:[r]};this.symbolToInfo.set(e,i)}processTerm(e,t,r,i=-1){let a=r.length,n=!1,s=[],u=0;if(!e.match(RegExp(ia))&&!t&&e!=="")throw new Error("Invalid LHS term");let l=e.match(RegExp(Ur,"g")),p=new pl(i);return l?.forEach((c,h)=>{if(c==="..."){if(n)throw new Error("Only one ellipsis is allowed per input term");n=!0;let g=a-l.length+1;if(g<0)throw new Error("Ellipsis out of bounds");if(s=r.slice(u,u+g),this.hasEllipsis){if(this.ellipsisDims.length!==s.length||this.ellipsisDims.toString()!==s.toString())throw new Error("Ellipsis dimensions mismatch")}else if(t)this.hasEllipsis=!0,this.ellipsisDims=s;else throw new Error("Ellipsis must be specified in the LHS");for(let _=0;_<s.length;_++){let y=String.fromCharCode(48+_);p.addSymbol(y,h+_),this.addSymbol(y,r[u++],i)}}else p.addSymbol(c,h+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(c,r[u++],i)}),p}},aa=e=>e+"_max",hl=(e,t,r,i)=>{let a=e.map(p=>p.length).map((p,c)=>R(`input${c}`,t,p)),n=O.size(i),s=j("output",t,i.length),u=[...r.symbolToInfo.keys()].filter(p=>!r.rhs.symbolToIndices.has(p)),l=p=>{let c=[],h="var prod = 1.0;",g="var sum = 0.0;",_="sum += prod;",y=[],w=[],S=[],x=[],b=r.symbolToInfo.size===r.rhs.symbolToIndices.size;r.symbolToInfo.forEach((k,T)=>{if(r.rhs.symbolToIndices.has(T)){let z=r.rhs.symbolToIndices.get(T)?.[0];z!==void 0&&r.lhs.forEach((C,v)=>{if(k.inputIndices.includes(v)){let N=C.symbolToIndices.get(T);if(N===void 0)throw new Error("Invalid symbol error");N.forEach(P=>{c.push(`${a[v].indicesSet(`input${v}Indices`,P,s.indicesGet("outputIndices",z))}`)})}})}else r.lhs.forEach((z,C)=>{if(k.inputIndices.includes(C)){let v=z.symbolToIndices.get(T);if(v===void 0)throw new Error("Invalid symbol error");v.forEach(N=>{y.push(`${a[C].indicesSet(`input${C}Indices`,N,`${T}`)}`)}),x.push(`prod *= ${a[C].getByIndices(`input${C}Indices`)};`)}}),w.push(`for(var ${T}: u32 = 0; ${T} < uniforms.${aa(T)}; ${T}++) {`),S.push("}")});let I=b?[...c,`let sum = ${a.map((k,T)=>k.getByIndices(`input${T}Indices`)).join(" * ")};`]:[...c,g,...w,...y,h,...x,_,...S];return`
            ${p.registerUniforms(u.map(k=>({name:`${aa(k)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...a,s)}

            ${p.mainStart()}
            ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${s.offsetToIndices("global_idx")};
            ${a.map((k,T)=>`var input${T}Indices: ${a[T].type.indices};`).join(`
`)}
            ${I.join(`
`)};
            ${s.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:r.equation,inputDependencies:e.map(()=>"rank")},getRunData:()=>{let p=u.filter(h=>r.symbolToInfo.has(h)).map(h=>({type:12,data:r.symbolToInfo.get(h)?.dimValue||0}));p.push({type:12,data:n});let c=e.map((h,g)=>[...X(h)]).reduce((h,g)=>h.concat(g),p);return c.push(...X(i)),{outputs:[{dims:i,dataType:t}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:c}},getShaderSource:l}},vh=(e,t)=>{let r=new cl(e.inputs,t.equation),i=r.outputDims,a=e.inputs.map((n,s)=>n.dims);e.compute(hl(a,e.inputs[0].dataType,r,i))},xh=e=>{let t=e.equation.replace(/\s+/g,"");return he({equation:t})}}),fl,na,ml,gl,Sh,q0=q(()=>{"use strict";re(),ie(),ae(),fl=e=>{if(!e||e.length!==2)throw new Error("Expand requires 2 input.");let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=r.length<t.length?0:r.length-t.length,a=t.length<r.length?0:t.length-r.length;for(;i<r.length&&a<t.length;++i,++a)if(r[i]!==t[a]&&r[i]!==1&&t[a]!==1)throw new Error("Expand requires shape to be broadcastable to input")},na=(e,t)=>{let r=e.length-t.length,i=[];for(let a=0;a<r;++a)i.push(e[a]);for(let a=0;a<t.length;++a)i.push(t[a]===1?e[a+r]:t[a]);return i},ml=(e,t)=>e.length>t.length?na(e,t):na(t,e),gl=e=>{let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=ml(t,r),a=e[0].dataType,n=a===9||O.size(t)===1,s=a===9||t.length>0&&t[t.length-1]%4===0?4:1,u=n||i.length>0&&i[i.length-1]%4===0?4:1,l=Math.ceil(O.size(i)/u),p=h=>{let g=R("input",a,t.length,s),_=j("output",a,i.length,u),y;if(a===9){let w=(S,x,b="")=>`
          let outputIndices${x} = ${_.offsetToIndices(`outputOffset + ${x}u`)};
          let offset${x} = ${g.broadcastedIndicesToOffset(`outputIndices${x}`,_)};
          let index${x} = offset${x} / 4u;
          let component${x} = offset${x} % 4u;
          ${S}[${x}] = ${b}(${g.getByOffset(`index${x}`)}[component${x}]);
        `;y=`
        let outputOffset = global_idx * ${u};
        var data = vec4<u32>(0);
        ${w("data",0,"u32")}
        ${w("data",1,"u32")}
        ${w("data",2,"u32")}
        ${w("data",3,"u32")}
        ${_.setByOffset("global_idx","data")}
      }`}else y=`
        let outputIndices = ${_.offsetToIndices(`global_idx * ${u}`)};
        let inputOffset = ${g.broadcastedIndicesToOffset("outputIndices",_)};
        let data = ${_.type.value}(${g.getByOffset(`inputOffset / ${s}`)});
        ${_.setByOffset("global_idx","data")}
      }`;return`
    ${h.registerUniform("vec_size","u32").declareVariables(g,_)}
    ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${y}`},c=[{type:12,data:l},...X(t,i)];return{name:"Expand",shaderCache:{hint:`${i.length};${s}${u}`,inputDependencies:["rank"]},getShaderSource:p,getRunData:()=>({outputs:[{dims:i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:c})}},Sh=e=>{fl(e.inputs),e.compute(gl(e.inputs),{inputs:[0]})}}),yl,kh,L0=q(()=>{"use strict";re(),ie(),ae(),an(),yl=e=>{let t=e[0].dataType,r=O.size(e[0].dims),i=O.size(e[1].dims),a=i%4===0,n=s=>{let u=R("x",t,[1],4),l=R("bias",t,[1],4),p=j("y",t,[1],4),c=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],h=_=>`
      let bias${_}_offset: u32 = (global_idx * 4 + ${_}) % uniforms.bias_size;
      let bias${_} = ${l.getByOffset(`bias${_}_offset / 4`)}[bias${_}_offset % 4];`,g=a?`
      let bias = ${l.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${h(0)}${h(1)}${h(2)}${h(3)}
      let bias = ${u.type.value}(bias0, bias1, bias2, bias3);`;return`${s.registerUniforms(c).declareVariables(u,l,p)}

    ${Ba(Ie(t))}

    ${s.mainStart(Ht)}
      ${s.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${u.getByOffset("global_idx")};
      ${g}
      let x_in = x + bias;
      ${p.setByOffset("global_idx",Ra("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${a}`,inputDependencies:["type","type"]},getShaderSource:n,getRunData:s=>({outputs:[{dims:s[0].dims,dataType:s[0].dataType}],programUniforms:[{type:12,data:Math.ceil(r/4)},{type:12,data:i}],dispatchGroup:{x:Math.ceil(r/Ht/4)}})}},kh=e=>{e.inputs.length<2||O.size(e.inputs[1].dims)===0?Vc(e):e.compute(yl(e.inputs))}}),_l,bl,Th,Ih,W0=q(()=>{"use strict";re(),ie(),Se(),ae(),_l=e=>{if(!e||e.length!==2)throw new Error("Gather requires 2 inputs.")},bl=(e,t)=>{let r=e[0].dims,i=e[1].dims,a=r.length,n=O.normalizeAxis(t.axis,a),s=r.slice(0);s.splice(n,1,...i);let u=r[n],l=e[0].dataType===9?4:1,p=Math.ceil(O.size(s)/l),c=[{type:12,data:p},{type:6,data:u},{type:12,data:n},...X(e[0].dims,e[1].dims,s)],h=g=>{let _=R("data",e[0].dataType,e[0].dims.length,l),y=R("inputIndices",e[1].dataType,e[1].dims.length),w=j("output",e[0].dataType,s.length,l),S=b=>{let I=i.length,k=`var indicesIndices${b}  = ${y.type.indices}(0);`;for(let T=0;T<I;T++)k+=`${I>1?`indicesIndices${b}[${T}]`:`indicesIndices${b}`} = ${s.length>1?`outputIndices${b}[uniforms.axis + ${T}]`:`outputIndices${b}`};`;k+=`
          var idx${b} = ${y.getByIndices(`indicesIndices${b}`)};
          if (idx${b} < 0) {
            idx${b} = idx${b} + uniforms.axisDimLimit;
          }
          var dataIndices${b} : ${_.type.indices};
        `;for(let T=0,z=0;T<a;T++)T===n?(k+=`${a>1?`dataIndices${b}[${T}]`:`dataIndices${b}`} = u32(idx${b});`,z+=I):(k+=`${a>1?`dataIndices${b}[${T}]`:`dataIndices${b}`} = ${s.length>1?`outputIndices${b}[${z}]`:`outputIndices${b}`};`,z++);return k},x;if(e[0].dataType===9){let b=(I,k,T="")=>`
          let outputIndices${k} = ${w.offsetToIndices(`outputOffset + ${k}u`)};
          ${S(k)};
          let offset${k} = ${_.indicesToOffset(`dataIndices${k}`)};
          let index${k} = offset${k} / 4u;
          let component${k} = offset${k} % 4u;
          ${I}[${k}] = ${T}(${_.getByOffset(`index${k}`)}[component${k}]);
        `;x=`
        let outputOffset = global_idx * ${l};
        var value = vec4<u32>(0);
        ${b("value",0,"u32")}
        ${b("value",1,"u32")}
        ${b("value",2,"u32")}
        ${b("value",3,"u32")}
        ${w.setByOffset("global_idx","value")}
      `}else x=`
      let outputIndices = ${w.offsetToIndices("global_idx")};
      ${S("")};
      let value = ${_.getByIndices("dataIndices")};
      ${w.setByOffset("global_idx","value")};
      `;return`
      ${g.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(_,y,w)}
      ${g.mainStart()}
        ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${x}
      }`};return{name:"Gather",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:s,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(p/64)},programUniforms:c}),getShaderSource:h}},Th=e=>he({axis:e.axis}),Ih=(e,t)=>{let r=e.inputs;_l(r),e.compute(bl(e.inputs,t))}}),wl,Eh,zh,V0=q(()=>{"use strict";re(),ie(),ae(),wl=(e,t,r,i,a,n,s,u,l)=>{let p=[{type:12,data:n},{type:12,data:i},{type:12,data:a},{type:12,data:r},{type:12,data:s},{type:12,data:u},{type:12,data:l}],c=[n];p.push(...X(t.dims,c));let h=g=>{let _=R("indices_data",t.dataType,t.dims.length),y=j("input_slice_offsets_data",12,1,1),w=[_,y],S=[{name:"output_size",type:"u32"},{name:"batch_dims",type:"u32"},{name:"input_dims",type:"u32",length:a.length},{name:"sizes_from_slice_dims_data",type:"u32",length:r.length},{name:"num_slices_per_batch",type:"u32"},{name:"input_batch_stride",type:"u32"},{name:"num_slice_dims",type:"u32"}];return`
  ${g.registerUniforms(S).declareVariables(...w)}
  ${g.mainStart()}
    ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let batch_idx = global_idx / uniforms.num_slices_per_batch;
    let base_offset = batch_idx * uniforms.input_batch_stride;

    let slice_indices_base_offset = global_idx * uniforms.num_slice_dims;
    var relative_slice_offset = 0;
    for (var dim_idx = 0u; dim_idx < uniforms.num_slice_dims; dim_idx ++) {
      var index = i32(indices_data[dim_idx + slice_indices_base_offset].x);
      let input_dim_idx = uniforms.batch_dims + dim_idx;
      if (index < 0) {
        ${a.length===1?"index += i32(uniforms.input_dims);":"index += i32(uniforms.input_dims[input_dim_idx]);"}
      }
      ${r.length===1?"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data);":"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data[dim_idx]);"}
    }

    input_slice_offsets_data[global_idx] =  base_offset + u32(relative_slice_offset);
  }`};return e.compute({name:"computeSliceOffsets",shaderCache:{hint:`${a.length}_${r.length}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:c,dataType:e.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:p}),getShaderSource:h},{inputs:[t],outputs:[-1]})[0]},Eh=(e,t)=>{let r=e.inputs,i=r[0].dims,a=r[0].dataType,n=r[1].dims,s=n[n.length-1],u=O.sizeToDimension(n,n.length-1),l=O.sizeFromDimension(i,t.batchDims+s),p=O.sizeToDimension(i,t.batchDims),c=O.sizeFromDimension(i,t.batchDims),h=u/p,g=new Array(s),_=l;for(let k=0;k<s;++k)g[s-1-k]=_,_*=i[t.batchDims+s-1-k];let y=wl(e,r[1],g,t.batchDims,i,u,h,c,s),w=t.batchDims+s;if(w>i.length)throw new Error("last dimension of indices must not be larger than rank of input tensor");let S=n.slice(0,-1).concat(i.slice(w)),x=O.size(S),b=[{type:12,data:x},{type:12,data:l},...X(r[0].dims,y.dims,S)],I=k=>{let T=R("data",r[0].dataType,r[0].dims.length),z=R("slice_offsets",12,y.dims.length),C=j("output",r[0].dataType,S.length);return`
          ${k.registerUniform("output_size","u32").registerUniform("slice_size","u32").declareVariables(T,z,C)}
            ${k.mainStart()}
            ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`};e.compute({name:"GatherND",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:S,dataType:a}],dispatchGroup:{x:Math.ceil(x/64)},programUniforms:b}),getShaderSource:I},{inputs:[r[0],y]})},zh=e=>({batchDims:e.batch_dims,cacheKey:""})}),$l,vl,Ch,Ah,G0=q(()=>{"use strict";re(),ie(),Se(),ae(),$l=(e,t)=>{if(e.length<3||e.length>4)throw new Error("GatherBlockQuantized requires 3 or 4 inputs.");let r=O.normalizeAxis(t.quantizeAxis,e[0].dims.length),i=t.blockSize,a=e[0],n=e[2],s=e.length===4?e[3]:void 0;if(n.dims.length!==a.dims.length||!a.dims.map((u,l)=>l===r?Math.ceil(u/i)===n.dims[l]:u===n.dims[l]).reduce((u,l)=>u&&l,!0))throw new Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");if(s){if(s.dataType!==a.dataType)throw new Error("Zero point must have the same data type as the input tensor.");if(s.dims.length!==n.dims.length||!s.dims.map((u,l)=>u===n.dims[l]).reduce((u,l)=>u&&l,!0))throw new Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.")}},vl=(e,t)=>{let r=e[0].dims,i=e[1].dims,a=r.length,n=O.normalizeAxis(t.gatherAxis,a),s=O.normalizeAxis(t.quantizeAxis,a),u=r.slice(0);u.splice(n,1,...i);let l=O.size(u),p=e[2].dataType,c=e[0].dataType===22,h=[{type:12,data:l},{type:12,data:s},{type:12,data:n},{type:12,data:t.blockSize},...X(...e.map((_,y)=>_.dims),u)],g=_=>{let y=R("data",e[0].dataType,e[0].dims.length),w=R("inputIndices",e[1].dataType,e[1].dims.length),S=R("scales",e[2].dataType,e[2].dims.length),x=e.length>3?R("zeroPoint",e[3].dataType,e[3].dims.length):void 0,b=j("output",p,u.length),I=[y,w,S];x&&I.push(x);let k=[{name:"output_size",type:"u32"},{name:"quantize_axis",type:"u32"},{name:"gather_axis",type:"u32"},{name:"block_size",type:"u32"}];return`
        ${_.registerUniforms(k).declareVariables(...I,b)}
        ${_.mainStart()}
        let output_indices = ${b.offsetToIndices("global_idx")};
        var indices_indices = ${w.type.indices}(0);
        ${i.length>1?`
          for (var i: u32 = 0; i < ${i.length}; i++) {
            let index = ${b.indicesGet("output_indices","uniforms.gather_axis + i")};
            ${w.indicesSet("indices_indices","i","index")};
          }`:`indices_indices = ${b.indicesGet("output_indices","uniforms.gather_axis")};`};
        var data_indices = ${y.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${b.indicesGet("output_indices","i")};
          ${y.indicesSet("data_indices","i","index")};
        }
        var index_from_indices = ${w.getByIndices("indices_indices")};
        if (index_from_indices < 0) {
          index_from_indices += ${r[n]};
        }
        ${y.indicesSet("data_indices","uniforms.gather_axis","u32(index_from_indices)")};
        for (var i = uniforms.gather_axis + 1; i < ${u.length}; i++) {
          let index = ${b.indicesGet("output_indices",`i + ${i.length} - 1`)};
          ${y.indicesSet("data_indices","i","index")};
        }
        let data_offset = ${y.indicesToOffset("data_indices")};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${y.getByOffset("data_offset / 8")};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${c?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${S.indicesGet("data_indices","uniforms.quantize_axis")} / uniforms.block_size;
        ${S.indicesSet("scale_indices","uniforms.quantize_axis","quantize_axis_index")};
        var scale = ${S.getByIndices("scale_indices")};
        ${x?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${x.indicesToOffset("zero_point_indices")};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${x.getByOffset("zero_point_offset / 8")};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${c?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:"var zero_point = 0"};
        let dequantized_data = ${Ie(p)}(quantized_data - zero_point) * scale;
        ${b.setByOffset("global_idx","dequantized_data")};
    }`};return{name:"GatherBlockQuantized",shaderCache:{hint:`${t.cacheKey};${e.filter((_,y)=>y!==1).map(_=>_.dims.join("_")).join(";")}`,inputDependencies:Array.from({length:e.length},(_,y)=>"rank")},getRunData:()=>({outputs:[{dims:u,dataType:p}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:h}),getShaderSource:g}},Ch=(e,t)=>{let r=e.inputs;$l(r,t),e.compute(vl(e.inputs,t))},Ah=e=>he({blockSize:e.blockSize,gatherAxis:e.gatherAxis,quantizeAxis:e.quantizeAxis})}),xl,Sl,Oh,Bh,H0=q(()=>{"use strict";re(),ie(),Se(),ae(),xl=e=>{if(!e||e.length!==2)throw new Error("GatherElements requires 2 inputs.");if(e[0].dims.length<1)throw new Error("GatherElements requires that the data input be rank >= 1.");if(e[0].dims.length!==e[1].dims.length)throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},Sl=(e,t)=>{let r=e[0].dims,i=e[0].dataType,a=r.length,n=e[1].dims,s=e[1].dataType,u=O.normalizeAxis(t.axis,a),l=r[u],p=n.slice(0),c=O.size(p),h=R("input",i,a),g=R("indicesInput",s,n.length),_=j("output",i,p.length),y=[{type:12,data:c},{type:6,data:l},{type:12,data:u}];return y.push(...X(r,n,p)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:p,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:y}),getShaderSource:w=>`
      ${w.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(h,g,_)}
      ${w.mainStart()}
      ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${_.offsetToIndices("global_idx")};

      var idx = ${g.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${h.type.indices}(outputIndices);
      ${h.indicesSet("inputIndices","uniforms.axis","u32(idx)")};
      let value = ${h.getByIndices("inputIndices")};

      ${_.setByOffset("global_idx","value")};
  }`}},Oh=e=>he({axis:e.axis}),Bh=(e,t)=>{let r=e.inputs;xl(r),e.compute(Sl(e.inputs,t))}}),kl,Tl,Rh,Mh,F0=q(()=>{"use strict";re(),ie(),ae(),kl=e=>{if(!e)throw new Error("Input is missing");if(e.length<2||e.length>3)throw new Error("Invaid input number.");if(e.length===3&&e[2].dims.length>2)throw new Error("Invalid input shape of C");if(e[0].dataType!==e[1].dataType||e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("Input types are mismatched")},Tl=(e,t)=>{let r=e[0].dims.slice(),i=e[1].dims.slice(),[a,n,s]=zp.getShapeOfGemmResult(r,t.transA,i,t.transB,e.length===3?e[2].dims:void 0),u=[a,n];if(!u)throw new Error("Can't use gemm on the given tensors");let l=16,p=Math.ceil(n/l),c=Math.ceil(a/l),h=!0,g=O.size(u),_=[{type:12,data:h?p:g},{type:12,data:a},{type:12,data:n},{type:12,data:s},{type:1,data:t.alpha},{type:1,data:t.beta}],y=["type","type"];e.length===3&&(_.push(...X(e[2].dims)),y.push("rank")),_.push(...X(u));let w=x=>{let b="";t.transA&&t.transB?b="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":t.transA&&!t.transB?b="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!t.transA&&t.transB?b="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":!t.transA&&!t.transB&&(b="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let I=t.alpha===1?"":"value *= uniforms.alpha;",k=R("a",e[0].dataType,e[0].dims),T=R("b",e[1].dataType,e[1].dims),z=k.type.value,C=null,v=[k,T];e.length===3&&(C=R("c",e[2].dataType,e[2].dims.length),v.push(C));let N=j("output",e[0].dataType,u.length);v.push(N);let P=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${x.registerUniforms(P).declareVariables(...v)}

  ${x.mainStart()}
    ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${z}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${b}
    }

    ${I}
    ${C!=null?`let cOffset = ${C.broadcastedIndicesToOffset("vec2(m, n)",N)}; value += ${z}(uniforms.beta) * ${C.getByOffset("cOffset")};`:""}
    output[global_idx] = value;
  }`},S=x=>{let b=R("a",e[0].dataType,e[0].dims),I=R("b",e[1].dataType,e[1].dims),k=null,T=[b,I];e.length===3&&(k=R("c",e[2].dataType,e[2].dims.length),T.push(k));let z=j("output",e[0].dataType,u.length);T.push(z);let C=[{name:"num_tile_n",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}],v="",N="";t.transA&&t.transB?(N=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${b.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${I.type.value}(0);
      }
      `,v="value += tile_a[k][local_id.y] * tile_b[local_id.x][k];"):t.transA&&!t.transB?(N=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${b.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${I.type.value}(0);
      }
      `,v="value += tile_a[k][local_id.y] * tile_b[k][local_id.x];"):!t.transA&&t.transB?(N=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${b.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${I.type.value}(0);
      }
      `,v="value += tile_a[local_id.y][k] * tile_b[local_id.x][k];"):!t.transA&&!t.transB&&(N=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${b.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${I.type.value}(0);
      }
      `,v="value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");let P=t.alpha===1?"":"value *= uniforms.alpha;";return`
  ${x.registerUniforms(C).declareVariables(...T)}
  var<workgroup> tile_a: array<array<${b.type.storage}, ${l}>, ${l}>;
  var<workgroup> tile_b: array<array<${I.type.storage}, ${l}>, ${l}>;
  ${x.mainStart([l,l,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * ${l};
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * ${l};
    let num_tiles = (uniforms.K - 1) / ${l} + 1;
    var k_start = 0u;
    var value = ${z.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${N}
      k_start = k_start + ${l};
      workgroupBarrier();

      for (var k: u32 = 0u; k < ${l}; k++) {
        ${v}
      }
      workgroupBarrier();
    }

    ${P}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${k!=null?`let cOffset = ${k.broadcastedIndicesToOffset("vec2(m, n)",z)}; value += ${z.type.value}(uniforms.beta) * ${k.getByOffset("cOffset")};`:""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`};return h?{name:"GemmShared",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:y},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:p*c},programUniforms:_}),getShaderSource:S}:{name:"Gemm",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:y},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:_}),getShaderSource:w}},Rh=e=>{let t=e.transA,r=e.transB,i=e.alpha,a=e.beta;return{transA:t,transB:r,alpha:i,beta:a,cacheKey:`${e.transA};${e.transB};${e.alpha===1}`}},Mh=(e,t)=>{kl(e.inputs),e.compute(Tl(e.inputs,t))}}),et,nt,St,kt,Il,El,zl,Cl,Al,Ol,Bl,Rl,Nh,Dh,j0=q(()=>{"use strict";re(),ie(),Se(),ae(),[et,nt,St,kt]=[0,1,2,3],Il=e=>{if(e[0].dims.length!==4)throw new Error("only 4-D tensor is supported.");if(e[0].dims.length!==e[1].dims.length)throw new Error("input dimensions must be equal to grid dimensions");if(e[0].dims.length-2!==e[1].dims[e[1].dims.length-1])throw new Error(`last dimension of grid must be equal to ${e[0].dims.length-2}`);if(e[0].dims[0]!==e[1].dims[0])throw new Error("grid batch size must match input batch size")},El=`
  fn gs_get_cubic_coeffs(x: f32) -> vec4<f32> {
    let cubic_alpha = -0.75f;
    let x_abs = abs(x);
    var coeffs: vec4<f32>;
    coeffs[0] = (((cubic_alpha * (x_abs + 1) - 5 * cubic_alpha) * (x_abs + 1) + 8 * cubic_alpha) * (x_abs + 1) - 4 * cubic_alpha);
    coeffs[1] = (((cubic_alpha + 2) * x_abs - (cubic_alpha + 3)) * x_abs * x_abs + 1);
    coeffs[2] = (((cubic_alpha + 2) * (1 - x_abs) - (cubic_alpha + 3)) * (1 - x_abs) * (1 - x_abs) + 1);
    coeffs[3] = (((cubic_alpha * (2 - x_abs) - 5 * cubic_alpha) * (2 - x_abs) + 8 * cubic_alpha) * (2 - x_abs) - 4 * cubic_alpha);
    return coeffs;
  }
`,zl=e=>`
  fn gs_bicubic_interpolate(p: mat4x4<${e}>, x: f32, y: f32) -> ${e} {
    var v: vec4<f32>;
    var coeffs = gs_get_cubic_coeffs(x);
    for (var i = 0; i < 4; i++) {
      v[i] = coeffs[0] * p[i][0] + coeffs[1] * p[i][1] + coeffs[2] * p[i][2] + coeffs[3] * p[i][3];
    }
    coeffs = gs_get_cubic_coeffs(y);
    let pixel = ${e}(coeffs[0] * v[0] + coeffs[1] * v[1] + coeffs[2] * v[2] + coeffs[3] * v[3]);
    return pixel;
  }
`,Cl=e=>`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${e.alignCorners===0?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`,Al=e=>`
  ${e.paddingMode==="reflection"?`
      fn gs_reflect(x: i32, x_min: f32, x_max: f32) -> u32 {
        var dx = 0.0;
        var fx = f32(x);
        let range = x_max - x_min;
        if (fx < x_min) {
          dx = x_min - fx;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_min + r;
          } else {
            fx = x_max - r;
          }
        } else if (fx > x_max) {
          dx = fx - x_max;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_max - r;
          } else {
            fx = x_min + r;
          }
        }
        return u32(fx);
      }`:""}
`,Ol=(e,t,r)=>`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${t} {
     var pixel = ${t}(0);
     var indices = vec4<u32>(0);
     indices[${et}] = batch;
     indices[${nt}] = channel;`+(()=>{switch(r.paddingMode){case"zeros":return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${St}] = u32(r);
            indices[${kt}] = u32(c);
          } else {
            return ${t}(0);
          }
        `;case"border":return`
          indices[${St}] = u32(clamp(r, 0, H - 1));
          indices[${kt}] = u32(clamp(c, 0, W - 1));
        `;case"reflection":return`
          indices[${St}] = gs_reflect(r, border[1], border[3]);
          indices[${kt}] = gs_reflect(c, border[0], border[2]);
        `;default:throw new Error(`padding mode ${r.paddingMode} is not supported`)}})()+`
    return ${e.getByIndices("indices")};
  }
`,Bl=(e,t,r)=>(()=>{switch(r.mode){case"nearest":return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${et}], indices[${nt}], border);
        `;case"bilinear":return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${et}], indices[${nt}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${et}], indices[${nt}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${et}], indices[${nt}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${et}], indices[${nt}], border);

          let dx2 = ${t}(f32(x2) - x);
          let dx1 = ${t}(x - f32(x1));
          let dy2 = ${t}(f32(y2) - y);
          let dy1 = ${t}(y - f32(y1));
          let result = dy2 * (dx2 * p11 + dx1 * p12) + dy1 * (dx2 * p21 + dx1 * p22);
        `;case"bicubic":return`
          let x0 = i32(floor(x)) - 1;
          let y0 = i32(floor(y)) - 1;
          var p: mat4x4<${t}>;
          for (var h = 0; h < 4; h++) {
            for (var w = 0; w < 4; w++) {
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${et}], indices[${nt}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw new Error(`mode ${r.mode} is not supported`)}})()+`${e.setByOffset("global_idx","result")}`,Rl=(e,t)=>{let r=R("x",e[0].dataType,e[0].dims.length),i=[e[1].dims[0],e[1].dims[1],e[1].dims[2]],a=R("grid",e[1].dataType,i.length,2),n=[e[0].dims[0],e[0].dims[1],e[1].dims[1],e[1].dims[2]];t.format==="NHWC"&&(n=[e[0].dims[0],e[1].dims[1],e[1].dims[2],e[0].dims[3]],[et,nt,St,kt]=[0,3,1,2]);let s=j("output",e[0].dataType,n.length),u=r.type.value,l=O.size(n),p=[{type:12,data:l},...X(e[0].dims,i,n)],c=h=>`
  ${h.registerUniform("output_size","u32").declareVariables(r,a,s)}
  ${El}
  ${zl(u)}
  ${Cl(t)}
  ${Al(t)}
  ${Ol(r,u,t)}

  ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${St}]);
      let W_in = i32(uniforms.x_shape[${kt}]);

      ${t.alignCorners===0?`
      let x_min = -0.5;
      let x_max = f32(W_in) - 0.5;
      let y_min = -0.5;
      let y_max = f32(H_in) - 0.5;
      `:`
      let x_min = 0.0;
      let x_max = f32(W_in) - 1.0;
      let y_min = 0.0;
      let y_max = f32(H_in) - 1.0;
      `};
      let border = vec4<f32>(x_min, y_min, x_max, y_max);

      let indices = ${s.offsetToIndices("global_idx")};
      var grid_indices = vec3<u32>(indices[${et}], indices[${St}], indices[${kt}]);
      let nxy = ${a.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${Bl(s,u,t)}
  }`;return{name:"GridSample",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:["type","type"]},getRunData:h=>{let g=O.size(n);return{outputs:[{dims:n,dataType:h[0].dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:p}},getShaderSource:c}},Nh=(e,t)=>{Il(e.inputs),e.compute(Rl(e.inputs,t))},Dh=e=>he({alignCorners:e.align_corners,mode:e.mode,paddingMode:e.padding_mode,format:e.format})}),Re,Ml,Uh,sa,Nl,dr,Ph,qh=q(()=>{"use strict";re(),ie(),Se(),Ja(),rn(),ae(),bt(),Re=(e,t)=>e.length>t&&e[t].dims.length>0?e[t]:void 0,Ml=(e,t)=>{let r=e[0],i=Re(e,1),a=Re(e,2),n=Re(e,3),s=Re(e,4),u=Re(e,5),l=Re(e,6),p=Re(e,7);if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let c=r.dims[0],h=r.dims[1],g=r.dims.length===3?r.dims[2]:t.numHeads*r.dims[4],_=h,y=0,w=0,S=Math.floor(g/t.numHeads);if(l&&p&&O.size(l.dims)&&O.size(p.dims)){if(l.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(l.dims[0]!==c||l.dims[1]!==t.numHeads||l.dims[3]!==S)throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(p.dims[0]!==c||p.dims[1]!==t.numHeads||p.dims[3]!==S)throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(l.dims[2]!==p.dims[2])throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(p.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');y=l.dims[2],w=l.dims[2]}else if(l&&O.size(l.dims)||p&&O.size(p.dims))throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let x;if(i&&O.size(i.dims)>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(i.dims[2]!==r.dims[2])throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');x=2,_=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==S)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(a)throw new Error('Expect "value" be none when "key" has packed kv format.');x=5,_=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==S)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');x=0,_=i.dims[2]}}else{if(r.dims.length!==5)throw new Error('Input "query" is expected to have 5 dimensions when key is empty');if(r.dims[2]!==t.numHeads||r.dims[3]!==3)throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');x=3}if(n&&O.size(n.dims)>0){if(n.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimension');if(i&&i.dims.length===5&&i.dims[3]===2)throw new Error("bias is not allowed for packed kv.")}let b=y+_,I=0;if(s&&O.size(s.dims)>0){I=8;let C=s.dims;throw C.length===1?C[0]===c?I=1:C[0]===3*c+2&&(I=3):C.length===2&&C[0]===c&&C[1]===b&&(I=5),I===8?new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)'):new Error("Mask not supported")}let k=!1,T=g;if(a&&O.size(a.dims)>0){if(a.dims.length!==3&&a.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==a.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(a.dims.length===3){if(_!==a.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');T=a.dims[2]}else{if(_!==a.dims[2])throw new Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');T=a.dims[1]*a.dims[3],k=!0}}let z=!1;if(s&&O.size(s.dims)>0)throw new Error("Key padding mask is not supported");if(u&&O.size(u.dims)>0){if(u.dims.length!==4)throw new Error('Input "attention_bias" is expected to have 4 dimensions');if(u.dims[0]!==c||u.dims[1]!==t.numHeads||u.dims[2]!==h||u.dims[3]!==b)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:c,sequenceLength:h,pastSequenceLength:y,kvSequenceLength:_,totalSequenceLength:b,maxSequenceLength:w,inputHiddenSize:0,hiddenSize:g,vHiddenSize:T,headSize:S,vHeadSize:Math.floor(T/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:I,scale:t.scale,broadcastResPosBias:z,passPastInKv:k,qkvFormat:x}},Uh=e=>he({...e}),sa=he({perm:[0,2,1,3]}),Nl=(e,t,r,i,a,n,s)=>{let u=[i,a,n],l=O.size(u),p=[{type:12,data:l},{type:12,data:s},{type:12,data:n}],c=h=>{let g=j("qkv_with_bias",t.dataType,u),_=R("qkv",t.dataType,u),y=R("bias",r.dataType,u),w=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${h.registerUniforms(w).declareVariables(_,y,g)}
  ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return e.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:u,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:p}),getShaderSource:c},{inputs:[t,r],outputs:[-1]})[0]},dr=(e,t,r,i,a,n,s,u)=>{let l=n;if(s&&O.size(s.dims)>0){if(i===1)throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return l=Nl(e,n,s,t,i,r*a,u),l=l.reshape([t,i,r,a]),r===1||i===1?l:e.compute(De(l,sa.perm),{inputs:[l],outputs:[-1]})[0]}else return n.dims.length===3&&(l=n.reshape([t,i,r,a])),r===1||i===1?l:e.compute(De(l,sa.perm),{inputs:[l],outputs:[-1]})[0]},Ph=(e,t)=>{let r=Ml(e.inputs,t),i=e.inputs[0],a=Re(e.inputs,1),n=Re(e.inputs,2),s=Re(e.inputs,3),u=Re(e.inputs,4),l=Re(e.inputs,5),p=Re(e.inputs,6),c=Re(e.inputs,7);if(i.dims.length===5)throw new Error("Packed QKV is not implemented");if(a?.dims.length===5)throw new Error("Packed KV is not implemented");let h=a&&n&&a.dims.length===4&&n.dims.length===4,g=dr(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,i,s,0);if(h)return fr(e,g,a,n,u,void 0,p,c,l,r);if(!a||!n)throw new Error("key and value must be provided");let _=dr(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.headSize,a,s,r.hiddenSize),y=dr(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.vHeadSize,n,s,2*r.hiddenSize);fr(e,g,_,y,u,void 0,p,c,l,r)}}),Dl,Ul,Pl,ql,Pa,Lh,Wh,Vh=q(()=>{"use strict";re(),ie(),Se(),ae(),Dl=e=>{if(!e||e.length<1)throw new Error("too few inputs")},Ul=(e,t)=>{let r=[],i=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(a=>r.push(Number(a))),i=r.length),he({numOutputs:i,axis:t.axis,splitSizes:r})},Pl=e=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${Z("uniforms.size_in_split_axis","i",e)}) {
        return i;
    }
    }
    return ${e}u;
}`,ql=e=>{let t=e.length,r=[];for(let i=0;i<t;++i){let a=e[i].setByIndices("indices","input[global_idx]");t===1?r.push(a):i===0?r.push(`if (output_number == ${i}u) { ${a} }`):i===t-1?r.push(`else { ${a} }`):r.push(`else if (output_number == ${i}) { ${a} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${r.join(`
`)}
      }`},Pa=(e,t)=>{let r=e[0].dims,i=O.size(r),a=e[0].dataType,n=O.normalizeAxis(t.axis,r.length),s=new Array(t.numOutputs),u=R("input",a,r.length),l=new Array(t.numOutputs),p=[],c=[],h=0,g=[{type:12,data:i}];for(let y=0;y<t.numOutputs;y++){h+=t.splitSizes[y],l[y]=h;let w=r.slice();w[n]=t.splitSizes[y],c.push(w),s[y]=j(`output${y}`,a,w.length),p.push({dims:c[y],dataType:e[0].dataType})}g.push({type:12,data:l},...X(r,...c));let _=y=>`
  ${y.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",l.length).declareVariables(u,...s)}
  ${Pl(l.length)}
  ${ql(s)}

  ${y.mainStart()}
    ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${u.offsetToIndices("global_idx")};
    var index = ${u.indicesGet("indices",n)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${Z("uniforms.size_in_split_axis","output_number - 1u",l.length)};
      ${u.indicesSet("indices",n,"index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;return{name:"Split",shaderCache:{hint:t.cacheKey,inputDependencies:["rank"]},getShaderSource:_,getRunData:()=>({outputs:p,dispatchGroup:{x:Math.ceil(i/64)},programUniforms:g})}},Lh=(e,t)=>{Dl(e.inputs);let r=e.inputs.length===1?t:Ul(e.inputs,t);e.compute(Pa(e.inputs,r),{inputs:[0]})},Wh=e=>{let t=e.axis,r=e.splitSizes,i=e.numOutputs<0?r.length:e.numOutputs;if(i!==r.length)throw new Error("numOutputs and splitSizes length must be equal");return he({axis:t,numOutputs:i,splitSizes:r})}}),Ll,Qr,Gh,Hh=q(()=>{"use strict";re(),ie(),Se(),ae(),Ll=(e,t)=>{let[r,i,a,n]=e,{numHeads:s,rotaryEmbeddingDim:u}=t;if(r.dims.length!==3&&r.dims.length!==4)throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${r.dims.length}`);if(!O.areEqual(i.dims,[])&&!O.areEqual(i.dims,[1])&&i.dims.length!==2)throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${i.dims.length}`);if(a.dims.length!==2)throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${a.dims.length}`);if(n.dims.length!==2)throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${n.dims.length}`);if(!O.areEqual(a.dims,n.dims))throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(u>0&&s===0)throw new Error("num_heads must be provided if rotary_embedding_dim is specified");let l=r.dims[0],p=r.dims[r.dims.length-2],c=a.dims[0],h=O.sizeFromDimension(r.dims,1)/p,g=u===0?a.dims[1]*2:h/s;if(u>g)throw new Error("rotary_embedding_dim must be less than or equal to head_size");if(i.dims.length===2){if(l!==i.dims[0])throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${i.dims[0]}`);if(p!==i.dims[1])throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${i.dims[1]}`)}if(p>c)throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported");if(g/2!==a.dims[1]&&u/2!==a.dims[1])throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${a.dims[1]}`)},Qr=(e,t)=>{let{interleaved:r,numHeads:i,rotaryEmbeddingDim:a,scale:n}=t,s=e[0].dims[0],u=O.sizeFromDimension(e[0].dims,1),l=e[0].dims[e[0].dims.length-2],p=u/l,c=e[2].dims[1],h=a===0?c*2:p/i,g=new Array(s,l,p/h,h-c),_=O.computeStrides(g),y=[{type:1,data:n},{type:12,data:g},{type:12,data:_},...e[0].dims.length===3?new Array({type:12,data:[u,p,h,1]}):[],...e[0].dims.length===4?new Array({type:12,data:[u,h,l*h,1]}):[],...X(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)],w=S=>{let x=R("input",e[0].dataType,e[0].dims.length),b=R("position_ids",e[1].dataType,e[1].dims.length),I=R("cos_cache",e[2].dataType,e[2].dims.length),k=R("sin_cache",e[3].dataType,e[3].dims.length),T=j("output",e[0].dataType,e[0].dims.length);return S.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:g.length},{name:"global_strides",type:"u32",length:_.length},{name:"input_output_strides",type:"u32",length:_.length}]),`
        ${S.declareVariables(x,b,I,k,T)}

        ${S.mainStart(Ht)}
          let half_rotary_emb_dim = uniforms.${I.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${S.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${b.broadcastedIndicesToOffset("bsnh.xy",j("",b.type.tensor,2))};
            let position_id =
                u32(${b.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${r});
            let j = i + select(half_rotary_emb_dim, 1, ${r});
            let re = ${x.getByOffset("i")} * ${I.get("position_id","bsnh[3]")} -
                ${x.getByOffset("j")} * ${k.get("position_id","bsnh[3]")};
            ${T.setByOffset("i","re")}
            let im = ${x.getByOffset("i")} * ${k.get("position_id","bsnh[3]")} +
                ${x.getByOffset("j")} * ${I.get("position_id","bsnh[3]")};
            ${T.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${T.setByOffset("k",x.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:he({interleaved:r}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:w,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(O.size(g)/Ht)},programUniforms:y})}},Gh=(e,t)=>{Ll(e.inputs,t),e.compute(Qr(e.inputs,t))}}),Wl,Vl,oa,Gl,Fh,K0=q(()=>{"use strict";Se(),re(),rn(),qh(),Vh(),bt(),Hh(),ae(),Wl=(e,t)=>{if(t.doRotary&&e.length<=7)throw new Error("cos_cache and sin_cache inputs are required if do_rotary is specified");let r=e[0],i=e[1],a=e[2],n=e[3],s=e[4];if(t.doRotary!==0&&e.length<=7)throw new Error("cos_cast and sin_cache are expected if do_rotary attribute is non-zero");if(t.localWindowSize!==-1)throw new Error("Local attention is not supported");if(t.softcap!==0)throw new Error("Softcap is not supported");if(t.rotaryInterleaved!==0)throw new Error("Rotary interleaved is not supported");if(t.smoothSoftmax)throw new Error("Smooth softmax is not supported");if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let u=!1,l=r.dims[0],p=r.dims[1],c=r.dims.length===3?u?r.dims[2]/3:r.dims[2]:t.numHeads*r.dims[4],h=p,g=0,_=!i||i.dims.length===0,y=Math.floor(_?c/(t.numHeads+2*t.kvNumHeads):c/t.numHeads);_&&(c=y*t.numHeads);let w=n&&n.dims.length!==0,S=s&&s.dims.length!==0;if(w&&n.dims.length===4&&n.dims[0]===l&&n.dims[1]!==t.kvNumHeads&&n.dims[2]===t.kvNumHeads&&n.dims[3]===y)throw new Error("BSNH pastKey/pastValue is not supported");if(w&&S){if(n.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(s.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');g=n.dims[2]}else if(w||S)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let x=1;if(i&&i.dims.length>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(r.dims[2]%i.dims[2]!==0)throw new Error('Dimension 2 of "query" should be a multiple of "key"');h=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==y)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(a)throw new Error('Expect "value" be none when "key" has packed kv format.');h=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==y)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');h=i.dims[2]}}else{if(r.dims.length!==3&&r.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(r.dims.length===5&&(r.dims[2]!==t.numHeads||r.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');x=3}let b=0,I=!1,k=t.kvNumHeads?y*t.kvNumHeads:c;if(a&&a.dims.length>0){if(a.dims.length!==3&&a.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==a.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(a.dims.length===3){if(h!==a.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');k=a.dims[2]}else{if(h!==a.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');k=a.dims[1]*a.dims[3],I=!0}}let T=e.length>4?e[5]:void 0;if(T){if(T.dims.length===0)throw new Error("seqlens_k must be at least 1D, got scalar.");let z=T.dims.reduce((C,v)=>C*v,1);if(z!==l)throw new Error(`seqlens_k must have batch_size (${l}) elements, got ${z}.`);for(let C=0;C<T.dims.length;C++)if(T.dims[C]!==1&&T.dims[C]!==l)throw new Error(`seqlens_k has unexpected shape. Each dimension must be 1 or batch_size (${l}), got dims[${C}] = ${T.dims[C]}.`)}return{batchSize:l,sequenceLength:p,pastSequenceLength:g,kvSequenceLength:h,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:c,vHiddenSize:k,headSize:y,vHeadSize:Math.floor(k/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:b,scale:t.scale,broadcastResPosBias:!1,passPastInKv:I,qkvFormat:x}},Vl=he({perm:[0,2,1,3]}),oa=(e,t,r)=>{let i=t,a=r.kvNumHeads;return t.dims.length===3&&r.kvSequenceLength!==0&&(i=t.reshape([r.batchSize,r.kvSequenceLength,a,r.headSize]),i=e.compute(De(i,Vl.perm),{inputs:[i],outputs:[-1]})[0]),i},Gl=(e,t,r,i)=>{let a=7,n=["type","type"],s=[e*t],u=e*t,l=[{type:12,data:u},{type:12,data:t},{type:12,data:e}],p=c=>{let h=R("seq_lens",r.dataType,r.dims),g=R("total_seq_lens",i.dataType,i.dims),_=j("pos_ids",a,s),y=[{name:"output_size",type:"u32"},{name:"sequence_length",type:"u32"},{name:"batch_size",type:"u32"}];return`
  ${c.registerUniforms(y).declareVariables(h,g,_)}
  ${c.mainStart()}
    ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let total_sequence_length = u32(${g.getByOffset("0")});
    let is_subsequent_prompt = uniforms.sequence_length > 1 && uniforms.sequence_length != total_sequence_length;
    let is_first_prompt = !is_subsequent_prompt && uniforms.sequence_length == total_sequence_length;
    let batch_idx = global_idx / uniforms.sequence_length;
    let sequence_idx = i32(global_idx % uniforms.sequence_length);
    var pos_id: i32 = 0;
    let seqlen = ${h.getByOffset("batch_idx")};
    let total_seqlen = seqlen + 1;
    if (is_first_prompt) {
      if (sequence_idx < total_seqlen) {
        pos_id = sequence_idx;
      } else {
        pos_id = 1;
      }
      ${_.setByOffset("global_idx","pos_id")}
    } else if (is_subsequent_prompt) {
      let past_seqlen = total_seqlen - i32(uniforms.sequence_length);
      if (past_seqlen + sequence_idx < total_seqlen) {
        pos_id = past_seqlen + sequence_idx;
      } else {
        pos_id = 1;
      }
      ${_.setByOffset("global_idx","pos_id")}
    } else if (global_idx < uniforms.batch_size) {
      ${_.setByOffset("global_idx","seqlen")}
    };
  }
  `};return{name:"GeneratePositionIds",shaderCache:{hint:`${e};${t}`,inputDependencies:n},getRunData:()=>({outputs:[{dims:s,dataType:a}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:l}),getShaderSource:p}},Fh=(e,t)=>{if(e.inputs.length>14&&e.inputs[14]||e.inputs.length>15&&e.inputs[15])throw new Error("GroupQueryAttention (JSEP): q_norm_weight / k_norm_weight inputs are not supported. The per-head Q/K RMS normalization prologue is implemented only on the CUDA and native WebGPU EPs.");let r=Wl(e.inputs,t);if(e.inputs[0].dims.length===5)throw new Error("Packed QKV is not implemented");if(e.inputs[1]?.dims.length===5)throw new Error("Packed KV is not implemented");let i=e.inputs[0],a=e.inputs[1]&&e.inputs[1].dims.length>0?e.inputs[1]:void 0,n=e.inputs[2]&&e.inputs[2].dims.length>0?e.inputs[2]:void 0,s=e.inputs[3]&&e.inputs[3].dims.length!==0?e.inputs[3]:void 0,u=e.inputs[4]&&e.inputs[4].dims.length!==0?e.inputs[4]:void 0,l=e.inputs.length>4?e.inputs[5]:void 0,p=e.inputs.length>5?e.inputs[6]:void 0,c=r.kvNumHeads?r.kvNumHeads:r.numHeads,h=he({axis:2,numOutputs:3,splitSizes:[r.numHeads*r.headSize,c*r.headSize,c*r.headSize]}),[g,_,y]=!a&&!n?e.compute(Pa([i],h),{inputs:[i],outputs:[-1,-1,-1]}):[i,a,n],w,S;if(t.doRotary){let k=e.compute(Gl(r.batchSize,r.sequenceLength,l,p),{inputs:[l,p],outputs:[-1]})[0],T=e.inputs[7],z=e.inputs[8],C=he({interleaved:t.rotaryInterleaved!==0,numHeads:r.numHeads,rotaryEmbeddingDim:0,scale:t.scale}),v=[g,k,T,z],N=[-1];w=e.compute(Qr(v,C),{inputs:v,outputs:N})[0],v.splice(0,1,_);let P=he({interleaved:t.rotaryInterleaved!==0,numHeads:r.kvNumHeads,rotaryEmbeddingDim:0,scale:t.scale});S=e.compute(Qr(v,P),{inputs:v,outputs:N})[0]}let x=dr(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,t.doRotary?w:g,void 0,0),b=oa(e,t.doRotary?S:_,r),I=oa(e,y,r);fr(e,x,b,I,void 0,void 0,s,u,void 0,r,l,p)}}),ua,Hl,Fl,jh,Z0=q(()=>{"use strict";re(),ie(),bt(),ae(),ua=(e,t,r,i,a,n,s,u)=>{let l=xe(n),p=l===1?"f32":`vec${l}f`,c=l===1?"vec2f":`mat2x${l}f`,h=a*s,g=64;h===1&&(g=256);let _=[a,s,n/l],y=[a,s,2],w=["rank","type","type"],S=[];S.push(...X(_,y));let x=b=>{let I=R("x",t.dataType,3,l),k=R("scale",r.dataType,r.dims),T=R("bias",i.dataType,i.dims),z=j("output",1,3,2),C=[I,k,T,z];return`
  var<workgroup> workgroup_shared : array<${c}, ${g}>;
  const workgroup_size = ${g}u;
  ${b.declareVariables(...C)}
  ${b.mainStart(g)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${p}(0);
    var squared_sum = ${p}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${p}(${I.get("batch","channel","h")});
      sum += value;
      squared_sum += value * value;
    }
    workgroup_shared[local_idx] = ${c}(sum, squared_sum);
    workgroupBarrier();

    for (var currSize = workgroup_size >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (local_idx < currSize) {
        workgroup_shared[local_idx] = workgroup_shared[local_idx] + workgroup_shared[local_idx + currSize];
      }
      workgroupBarrier();
    }
    if (local_idx == 0) {
      let sum_final = ${_t("workgroup_shared[0][0]",l)} / f32(hight * ${l});
      let squared_sum_final = ${_t("workgroup_shared[0][1]",l)} / f32(hight * ${l});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${u}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`};return e.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${l};${u};${g}`,inputDependencies:w},getRunData:()=>({outputs:[{dims:y,dataType:1}],dispatchGroup:{x:h},programUniforms:S}),getShaderSource:x},{inputs:[t,r,i],outputs:[-1]})[0]},Hl=(e,t,r)=>{let i=t[0].dims,a=i,n=2,s=i[0],u=i[1],l=O.sizeFromDimension(i,n),p=xe(l),c=O.size(a)/p,h=ua(e,t[0],t[1],t[2],s,l,u,r.epsilon),g=[s,u,l/p],_=[s,u],y=["type","none"],w=S=>{let x=R("x",t[0].dataType,g.length,p),b=R("scale_shift",1,_.length,2),I=j("output",t[0].dataType,g.length,p),k=[x,b,I];return`
  ${S.registerUniform("output_size","u32").declareVariables(...k)}
  ${S.mainStart()}
  ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${I.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${b.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${x.getByOffset("global_idx")} * ${I.type.value}(scale_shift.x) + ${I.type.value}(scale_shift.y);
      ${I.setByOffset("global_idx","value")};
  }`};e.compute({name:"InstanceNormalization",shaderCache:{hint:`${p}`,inputDependencies:y},getRunData:()=>({outputs:[{dims:a,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:[{type:12,data:c},...X(g,_,g)]}),getShaderSource:w},{inputs:[t[0],h]})},Fl=(e,t,r)=>{let i=t[0].dims,a=i,n=i[0],s=i[i.length-1],u=O.sizeFromDimension(i,1)/s,l=xe(s),p=O.size(a)/l,c=[{type:12,data:u},{type:12,data:Math.floor(s/l)}],h=["type","type"],g=!1,_=[0,i.length-1];for(let x=0;x<i.length-2;x++)g=g||i[x+1]!==1,_.push(x+1);g=g&&i[i.length-1]!==1;let y=g?e.compute(De(e.inputs[0],_),{inputs:[e.inputs[0]],outputs:[-1]})[0]:e.inputs[0].reshape(Array.from({length:i.length},(x,b)=>i[_[b]])),w=ua(e,y,t[1],t[2],n,u,s,r.epsilon),S=x=>{let b=Ee(t[0].dataType),I=l===1?"vec2f":`mat${l}x2f`,k=C=>{let v=C===0?"x":"y",N=l===1?"f32":`vec${l}f`;switch(l){case 1:return`${b}(${N}(scale.${v}))`;case 2:return`vec2<${b}>(${N}(scale[0].${v}, scale[1].${v}))`;case 4:return`vec4<${b}>(${N}(scale[0].${v}, scale[1].${v}, scale[2].${v}, scale[3].${v}))`;default:throw new Error(`Not supported compoents ${l}`)}},T=R("input",t[0].dataType,t[0].dims,l),z=j("output",t[0].dataType,a,l);return`
  @group(0) @binding(0) var<storage, read> input : array<${T.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${I}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${z.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${x.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${k(0)}, ${k(1)});
  }`};e.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${l}`,inputDependencies:h},getRunData:()=>({outputs:[{dims:a,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(p/64)},programUniforms:c}),getShaderSource:S},{inputs:[t[0],w]})},jh=(e,t)=>{t.format==="NHWC"?Fl(e,e.inputs,t):Hl(e,e.inputs,t)}}),jl,Kl,Kh,X0=q(()=>{"use strict";re(),ie(),ae(),jl=e=>{if(!e||e.length<2)throw new Error("layerNorm requires at least 2 inputs.")},Kl=(e,t,r)=>{let i=t.simplified,a=e[0].dims,n=e[1],s=!i&&e[2],u=a,l=O.normalizeAxis(t.axis,a.length),p=O.sizeToDimension(a,l),c=O.sizeFromDimension(a,l),h=O.size(n.dims),g=s?O.size(s.dims):0;if(h!==c||s&&g!==c)throw new Error(`Size of X.shape()[axis:] == ${c}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${h} and bias size of ${g}`);let _=[];for(let T=0;T<a.length;++T)T<l?_.push(a[T]):_.push(1);let y=xe(c),w=["type","type"],S=[{type:12,data:p},{type:1,data:c},{type:12,data:Math.floor(c/y)},{type:1,data:t.epsilon}];s&&w.push("type");let x=r>1,b=r>2,I=T=>{let z=Ee(e[0].dataType),C=[R("x",e[0].dataType,e[0].dims,y),R("scale",n.dataType,n.dims,y)];s&&C.push(R("bias",s.dataType,s.dims,y)),C.push(j("output",e[0].dataType,u,y)),x&&C.push(j("mean_data_output",1,_)),b&&C.push(j("inv_std_output",1,_));let v=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${T.registerUniforms(v).declareVariables(...C)}
  ${T.mainStart()}
    ${T.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${Ca("f32",y)};
    var mean_square_vector = ${Ca("f32",y)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${Vt(z,y,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${_t("mean_vector",y)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${_t("mean_square_vector",y)} / uniforms.norm_size ${i?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${Vt(z,y,"x[j + offset]")};
      let f32scale = ${Vt(z,y,"scale[j]")};
      output[j + offset] = ${C[0].type.value}((f32input ${i?"":"- mean"}) * inv_std_dev * f32scale
        ${s?`+ ${Vt(z,y,"bias[j]")}`:""}
      );
    }

    ${x?"mean_data_output[global_idx] = mean":""};
    ${b?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},k=[{dims:u,dataType:e[0].dataType}];return x&&k.push({dims:_,dataType:1}),b&&k.push({dims:_,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${y};${r};${i}`,inputDependencies:w},getRunData:()=>({outputs:k,dispatchGroup:{x:Math.ceil(p/64)},programUniforms:S}),getShaderSource:I}},Kh=(e,t)=>{jl(e.inputs),e.compute(Kl(e.inputs,t,e.outputCount))}}),Zl,Zh,Q0=q(()=>{"use strict";ie(),un(),ln(),Zl=e=>{if(!e||e.length!==2)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.")},Zh=e=>{Zl(e.inputs);let t=Gt.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw new Error("Can't use matmul on the given tensors");let r=t[t.length-1],i=e.inputs[0].dims[e.inputs[0].dims.length-1];if(r<8&&i<8)e.compute(on(e.inputs,{activation:""},t));else{let a=t[t.length-2],n=O.size(e.inputs[0].dims.slice(0,-2)),s=O.size(e.inputs[1].dims.slice(0,-2));if(n!==1&&a===1&&s===1){let u=e.inputs[0].reshape([1,n,i]),l=e.inputs[1].reshape([1,i,r]),p=[1,n,r],c=[u,l];e.compute(Xr(c,{activation:""},t,p),{inputs:c})}else e.compute(Xr(e.inputs,{activation:""},t))}}}),Xl,Ql,Yl,Xh,Qh,Y0=q(()=>{"use strict";re(),ie(),Se(),ae(),Xl=(e,t)=>{if(e.length<3||e.length>4)throw new Error("MatMulNBits requires 3 or 4 inputs");let r=e[0],i=r.dims.length;if(r.dims[i-1]!==t.k)throw new Error("The last dim of input shape does not match the k value");let a=Math.floor((t.k+t.blockSize-1)/t.blockSize),n=t.blockSize/8*t.bits,s=e[1];if(!O.areEqual(s.dims,[t.n,a,n]))throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let u=e[2].dims;if(O.size(u)!==t.n*a)throw new Error("scales input size error.");if(e.length===4){let l=e[3].dims,p=t.n*(t.bits===8?a:Math.floor((a*t.bits+7)/8));if(O.size(l)!==p)throw new Error("zeroPoints input size error.")}},Ql=(e,t)=>{let r=e[0].dims,i=r.length,a=r[i-2],n=t.k,s=t.n,u=r.slice(0,i-2),l=O.size(u),p=e[1].dims[2]/4,c=e[0].dataType,h=xe(t.k),g=xe(p),_=xe(s),y=u.concat([a,s]),w=a>1&&s/_%2===0?2:1,S=O.size(y)/_/w,x=64,b=[],I=[l,a,n/h],k=O.convertShape(e[1].dims).slice();k.splice(-1,1,p/g),b.push(...X(I)),b.push(...X(k)),b.push(...X(e[2].dims)),e.length===4&&b.push(...X(O.convertShape(e[3].dims)));let T=[l,a,s/_];b.push(...X(T));let z=C=>{let v=I.length,N=R("a",e[0].dataType,v,h),P=R("b",12,k.length,g),F=R("scales",e[2].dataType,e[2].dims.length),W=[N,P,F],K=e.length===4?R("zero_points",12,e[3].dims.length):void 0;K&&W.push(K);let B=T.length,D=j("output",e[0].dataType,B,_),H=Ee(e[0].dataType),Q=(()=>{switch(h){case 1:return`array<${H}, 8>`;case 2:return`mat4x2<${H}>`;case 4:return`mat2x4<${H}>`;default:throw new Error(`${h}-component is not supported.`)}})(),J=Math.floor(32/t.bits),te=Math.floor(J/8),ne=()=>{let Y="";for(let G=0;G<te;G++){let Te=G*t.bits*4,Ae=Te+t.bits;Y+=`
          // reuse a data (pass ${G})
            var input_offset${G>0?G:""} = ${G===0?N.indicesToOffset(`${N.type.indices}(batch, row, word_offset)`):"input_offset"};
            var a_data${G>0?G:""}: ${Q};
            for (var j${G>0?G:""}: u32 = 0; j${G>0?G:""} < ${8/h}; j${G>0?G:""}++) {
              a_data${G>0?G:""}[j${G>0?G:""}] = ${N.getByOffset(`input_offset${G>0?G:""}`)};
              input_offset${G>0?G:""}++;
            }
          `;for(let ve=0;ve<_*w;ve++)Y+=`
            b_value = ${g===1?`b${ve}_data`:`b${ve}_data[i]`};
            ${t.bits===2?`{
              let half_word = b_value >> ${G*16}u;
              let byte_lo = half_word & 0xFFu;
              let byte_hi = (half_word >> 8u) & 0xFFu;
              let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
              b_value_lower = unpack4xU8(spread_word & b_mask);
              b_value_upper = unpack4xU8((spread_word >> 2u) & b_mask);
            }`:`b_value_lower = unpack4xU8((b_value >> ${Te}u) & b_mask);
            b_value_upper = unpack4xU8((b_value >> ${Ae}u) & b_mask);`}
            b_quantized_values = ${Q}(${Array.from({length:4},(Oe,me)=>`${H}(b_value_lower[${me}]), ${H}(b_value_upper[${me}])`).join(", ")});
            b_dequantized_values = ${h===1?`${Q}(${Array.from({length:8},(Oe,me)=>`(b_quantized_values[${me}] - ${K?`zero_point${ve}`:"zero_point"}) * scale${ve}`).join(", ")});`:`(b_quantized_values - ${Q}(${Array(8).fill(`${K?`zero_point${ve}`:"zero_point"}`).join(",")})) * scale${ve};`};
            workgroup_shared[local_id.x * ${w} + ${Math.floor(ve/_)}]${_>1?`[${ve%_}]`:""} += ${Array.from({length:8/h},(Oe,me)=>`${h===1?`a_data${G>0?G:""}[${me}] * b_dequantized_values[${me}]`:`dot(a_data${G>0?G:""}[${me}], b_dequantized_values[${me}])`}`).join(" + ")};
          `}return Y},U=()=>{let Y=`
            var col_index = col * ${_};
            ${K?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (nBlocksPerCol + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is ${Math.pow(2,t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${H}(${Math.pow(2,t.bits-1).toFixed(1)});`}
            `;for(let G=0;G<_*w;G++)Y+=`
            let scale${G} = ${F.getByOffset("col_index * nBlocksPerCol + block")};
            ${K?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            zero_point_word = ${K.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${G} = ${H}((zero_point_word) & ${t.bits===2?"0x3u":"0xFu"});`:""}
            col_index += 1;`;return Y},ee=()=>{let Y=`col_index = col * ${_};`;for(let G=0;G<_*w;G++)Y+=`
            let b${G}_data = ${P.getByIndices(`${P.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return Y+=`
            var b_value: u32;
            let b_mask: u32 = ${t.bits===2?"0x03030303u":"0x0F0F0F0Fu"};
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${Q};
            var b_dequantized_values: ${Q};`,Y};return`
        var<workgroup> workgroup_shared: array<${D.type.value}, ${w*x}>;
        ${C.declareVariables(...W,D)}
        ${C.mainStart([x,1,1])}
          let output_indices = ${D.offsetToIndices(`(global_idx / ${x}) * ${w}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${x}) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize/h};
            ${U()}
            for (var word: u32 = 0; word < ${p}; word += ${g}) {
              ${ee()}
              for (var i: u32 = 0; i < ${g}; i++) {
                ${ne()}
                word_offset += ${J/h};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${w}) {
            var output_value: ${D.type.value} = ${D.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${x}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${w};
            }
            ${D.setByIndices(`${D.type.indices}(batch, row, col + local_id.x)`,"output_value")};
          }
        }`};return{name:"MatMulNBits",shaderCache:{hint:`${t.blockSize};${t.bits};${h};${g};${_};${w};${x}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:y,dataType:c}],dispatchGroup:{x:S},programUniforms:b}),getShaderSource:z}},Yl=(e,t)=>{let r=e[0].dims,i=r.length,a=r[i-2],n=t.k,s=t.n,u=r.slice(0,i-2),l=O.size(u),p=e[1].dims[2]/4,c=e[0].dataType,h=xe(t.k),g=xe(p),_=u.concat([a,s]),y=128,w=s%8===0?8:s%4===0?4:1,S=y/w,x=Math.floor(32/t.bits),b=S*g*x,I=b/h,k=b/t.blockSize,T=O.size(_)/w,z=[],C=[l,a,n/h],v=O.convertShape(e[1].dims).slice();v.splice(-1,1,p/g),z.push(...X(C)),z.push(...X(v)),z.push(...X(e[2].dims)),e.length===4&&z.push(...X(O.convertShape(e[3].dims)));let N=[l,a,s];z.push(...X(N));let P=F=>{let W=C.length,K=R("a",e[0].dataType,W,h),B=R("b",12,v.length,g),D=R("scales",e[2].dataType,e[2].dims.length),H=[K,B,D],Q=e.length===4?R("zero_points",12,e[3].dims.length):void 0;Q&&H.push(Q);let J=N.length,te=j("output",e[0].dataType,J),ne=Ee(e[0].dataType),U=()=>{switch(h){case 1:return`
          let a_data0 = vec4<${ne}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${ne}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${ne}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${ne}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw new Error(`${h}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${K.type.value}, ${I}>;
        var<workgroup> inter_results: array<array<${te.type.value}, ${S}>, ${w}>;
        ${F.declareVariables(...H,te)}
        ${F.mainStart([S,w,1])}
          let output_indices = ${te.offsetToIndices(`workgroup_index * ${w}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${k} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${I};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${I}; a_offset += ${y})
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${K.getByIndices(`${K.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${K.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${k} + local_id.x;
            ${Q?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (n_blocks_per_col + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            let zero_point_word = ${Q.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${ne}((zero_point_word) & ${t.bits===2?"0x3u":"0xFu"});`:`
            // The default zero point is ${Math.pow(2,t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${ne}(${Math.pow(2,t.bits-1).toFixed(1)});`}
            let scale = ${D.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${B.getByIndices(`${B.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize/h};
            for (var i: u32 = 0; i < ${g}; i++) {
              let b_value = ${g===1?"b_data":"b_data[i]"};
              ${(()=>{let ee=Math.floor(x/8),Y="";for(let G=0;G<ee;G++){let Te=G*t.bits*4,Ae=Te+t.bits;Y+=`
              ${U()}
              {${t.bits===2?`
                let half_word = b_value >> ${G*16}u;
                let byte_lo = half_word & 0xFFu;
                let byte_hi = (half_word >> 8u) & 0xFFu;
                let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
                let b_value_lower = unpack4xU8(spread_word & 0x03030303u);
                let b_value_upper = unpack4xU8((spread_word >> 2u) & 0x03030303u);`:`
                let b_value_lower = unpack4xU8((b_value >> ${Te}u) & 0x0F0F0F0Fu);
                let b_value_upper = unpack4xU8((b_value >> ${Ae}u) & 0x0F0F0F0Fu);`}
                let b_quantized_values = mat2x4<${ne}>(${Array.from({length:4},(ve,Oe)=>`${ne}(b_value_lower[${Oe}]), ${ne}(b_value_upper[${Oe}])`).join(", ")});
                let b_dequantized_values = (b_quantized_values - mat2x4<${ne}>(${Array(8).fill("zero_point").join(",")})) * scale;
                inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(ve,Oe)=>`${`dot(a_data${Oe}, b_dequantized_values[${Oe}])`}`).join(" + ")};
              }
              word_offset += ${8/h};`}return Y})()}
            }
            workgroupBarrier();
          }

          if (local_idx < ${w}) {
            var output_value: ${te.type.value} = ${te.type.value}(0);
            for (var b = 0u; b < ${S}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${te.setByIndices(`${te.type.indices}(batch, row, col + local_idx)`,"output_value")}
            }
          }
        }`};return{name:"BlockwiseMatMulNBits32",shaderCache:{hint:`${t.blockSize};${h};${g};${S};${w}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:_,dataType:c}],dispatchGroup:{x:T},programUniforms:z}),getShaderSource:P}},Xh=(e,t)=>{Xl(e.inputs,t),t.blockSize===32&&e.adapterInfo.isVendor("intel")&&e.adapterInfo.isArchitecture("gen-12lp")?e.compute(Yl(e.inputs,t)):e.compute(Ql(e.inputs,t))},Qh=e=>he(e)}),Jl,ed,td,rd,id,ad,nd,sd,Yh,J0=q(()=>{"use strict";re(),ie(),ae(),Jl=e=>{if(!e||e.length<1)throw new Error("Too few inputs");if(e[0].dataType!==1&&e[0].dataType!==10)throw new Error("Input type must be float or float16.");if(e.length>=2){let t=e[0].dims.length*2===e[1].dims[0];if(e.length===4&&(t=e[3].dims[0]*2===e[1].dims[0]),!t)throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},ed=(e,t,r)=>{let i="";for(let a=t-1;a>=0;--a)i+=`
            k = i32(${e.indicesGet("indices",a)}) - ${Z("uniforms.pads",a,r)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${Z("uniforms.x_shape",a,t)})) {
              break;
            }
            offset += k * i32(${Z("uniforms.x_strides",a,t)});
        `;return`
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${i}
            value = x[offset];
          }
      `},td=(e,t,r)=>{let i="";for(let a=t-1;a>=0;--a)i+=`
                k = i32(${e.indicesGet("indices",a)}) - ${Z("uniforms.pads",a,r)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${Z("uniforms.x_shape",a,t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${Z("uniforms.x_shape",a,t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${Z("uniforms.x_strides",a,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},rd=(e,t,r)=>{let i="";for(let a=t-1;a>=0;--a)i+=`
                k = i32(${e.indicesGet("indices",a)}) - ${Z("uniforms.pads",a,r)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${Z("uniforms.x_shape",a,t)})) {
                  k = i32(${Z("uniforms.x_shape",a,t)}) - 1;
                }
                offset += k * i32(${Z("uniforms.x_strides",a,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},id=(e,t,r)=>{let i="";for(let a=t-1;a>=0;--a)i+=`
                k = i32(${e.indicesGet("indices",a)}) - ${Z("uniforms.pads",a,r)};
                if (k < 0)  {
                  k += i32(${Z("uniforms.x_shape",a,t)}]);
                }
                if (k >= i32(${Z("uniforms.x_shape",a,t)})) {
                  k -= i32(${Z("uniforms.x_shape",a,t)});
                }
                offset += k * i32(${Z("uniforms.x_strides",a,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},ad=(e,t,r)=>{switch(r.mode){case 0:return ed(e,t,r.pads.length);case 1:return td(e,t,r.pads.length);case 2:return rd(e,t,r.pads.length);case 3:return id(e,t,r.pads.length);default:throw new Error("Invalid mode")}},nd=(e,t)=>{let r=O.padShape(e[0].dims.slice(),t.pads),i=e[0].dims,a=O.size(r),n=[{type:12,data:a},{type:6,data:t.pads}],s=e.length>=3&&e[2].data;t.mode===0&&n.push({type:s?e[2].dataType:1,data:t.value}),n.push(...X(e[0].dims,r));let u=["rank"],l=p=>{let c=j("output",e[0].dataType,r.length),h=R("x",e[0].dataType,i.length),g=h.type.value,_=ad(c,i.length,t),y=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:t.pads.length}];return t.mode===0&&y.push({name:"constant_value",type:s?g:"f32"}),`
            ${p.registerUniforms(y).declareVariables(h,c)}
            ${p.mainStart()}
            ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${c.offsetToIndices("global_idx")};

            var value = ${g}(0);
            ${_}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${t.mode}${s}`,inputDependencies:u},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(O.size(r)/64)},programUniforms:n}),getShaderSource:l}},sd=(e,t)=>{if(e.length>1){let r=e[1].getBigInt64Array(),i=e.length>=3&&e[2].data?e[2].dataType===10?e[2].getUint16Array()[0]:e[2].getFloat32Array()[0]:0,a=e[0].dims.length,n=new Int32Array(2*a).fill(0);if(e.length>=4){let u=e[3].getBigInt64Array();for(let l=0;l<u.length;l++)n[Number(u[l])]=Number(r[l]),n[Number(u[l])+a]=Number(r[l+u.length])}else r.forEach((u,l)=>n[Number(l)]=Number(u));let s=[];return n.forEach(u=>s.push(u)),{mode:t.mode,value:i,pads:s}}else return t},Yh=(e,t)=>{Jl(e.inputs);let r=sd(e.inputs,t);e.compute(nd(e.inputs,r),{inputs:[0]})}}),ar,la,da,pa,ca,od,ud,ha,fa,Jh,ef,ma,tf,rf,ga,af,nf,sf,of,ey=q(()=>{"use strict";Le(),re(),ie(),ae(),ar=e=>{if(ge.webgpu.validateInputContent&&(!e||e.length!==1))throw new Error("Pool ops requires 1 input.")},la=(e,t,r)=>{let i=t.format==="NHWC",a=e.dims.slice();i&&a.splice(1,0,a.pop());let n=Object.hasOwnProperty.call(t,"dilations"),s=t.kernelShape.slice(),u=t.strides.slice(),l=n?t.dilations.slice():[],p=t.pads.slice();Kr.adjustPoolAttributes(r,a,s,u,l,p);let c=Kr.computePoolOutputShape(r,a,u,l,s,p,t.autoPad,t.ceilMode),h=Object.assign({},t);n?Object.assign(h,{kernelShape:s,strides:u,pads:p,dilations:l,cacheKey:t.cacheKey}):Object.assign(h,{kernelShape:s,strides:u,pads:p,cacheKey:t.cacheKey});let g=c.slice();return g.push(g.splice(1,1)[0]),[h,i?g:c]},da=(e,t)=>{let r=t.format==="NHWC",i=O.size(e),a=O.size(t.kernelShape),n=[{type:12,data:i},{type:12,data:a}],s=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(t.kernelShape.length<=2){let u=t.kernelShape[t.kernelShape.length-1],l=t.strides[t.strides.length-1],p=t.pads[t.pads.length/2-1],c=t.pads[t.pads.length-1],h=!!(p+c);n.push({type:12,data:u},{type:12,data:l},{type:12,data:p},{type:12,data:c}),s.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let g=!1;if(t.kernelShape.length===2){let _=t.kernelShape[t.kernelShape.length-2],y=t.strides[t.strides.length-2],w=t.pads[t.pads.length/2-2],S=t.pads[t.pads.length-2];g=!!(w+S),n.push({type:12,data:_},{type:12,data:y},{type:12,data:w},{type:12,data:S}),s.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[n,s,!0,h,g]}else{if(r)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let u=O.computeStrides(t.kernelShape);n.push({type:12,data:u},{type:12,data:t.pads},{type:12,data:t.strides}),s.push({name:"kernelStrides",type:"u32",length:u.length},{name:"pads",type:"u32",length:t.pads.length},{name:"strides",type:"u32",length:t.strides.length});let l=t.pads.reduce((p,c)=>p+c);return[n,s,!!l,!1,!1]}},pa=(e,t,r,i,a,n,s,u,l,p,c,h)=>{let g=a.format==="NHWC",_=t.type.value,y=j("output",t.type.tensor,i);if(a.kernelShape.length<=2){let w="",S="",x="",b=r-(g?2:1);if(c?w=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${b}] = indices[${b}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${b}] < 0 || xIndices[${b}]
                      >= uniforms.x_shape[${b}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${n}
                }`:w=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${b}] = indices[${b}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${n}
                }`,a.kernelShape.length===2){let I=r-(g?3:2);h?S=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${I}] = indices[${I}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${I}] < 0 || xIndices[${I}] >= uniforms.x_shape[${I}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:S=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${I}] = indices[${I}] * uniforms.sh - uniforms.phStart + j;
                `,x=`
              }
            `}return`
            ${e.registerUniforms(l).declareVariables(t,y)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${y.offsetToIndices("global_idx")};
              var xIndices = ${y.offsetToIndices("global_idx")};

              var value = ${_}(${u});
              var pad = 0;
              ${S}
              ${w}
              ${x}
              ${s}

              output[global_idx] = value;
            }`}else{if(g)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let w=a.kernelShape.length,S=a.pads.length,x="";return p?x=`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${t.indicesToOffset("xIndices")}];
                ${n}
              }`:x=`
              }
              let x_val = x[${t.indicesToOffset("xIndices")}];
              ${n}
            `,`
            ${e.registerUniforms(l).declareVariables(t,y)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${y.offsetToIndices("global_idx")};
              var xIndices = ${y.offsetToIndices("global_idx")};

              var offsets: array<u32, ${w}>;

              var value = ${_}(${u});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${w-1}u; j++) {
                  offsets[j] = offset / ${Z("uniforms.kernelStrides","j",w)};
                  offset -= offsets[j] * ${Z("uniforms.kernelStrides","j",w)};
                }
                offsets[${w-1}] = offset;

                isPad = false;
                for (var j = ${r-w}u; j < ${r}u; j++) {
                  xIndices[j] = indices[j] * ${Z("uniforms.strides",`j - ${r-w}u`,w)}
                    + offsets[j - ${r-w}u] - ${Z("uniforms.pads","j - 2u",S)};
                  ${x}
              }
              ${s}

              output[global_idx] = value;
            }`}},ca=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,od=e=>`${ca(e)};${e.countIncludePad}`,ud=e=>`${ca(e)};${e.storageOrder};${e.dilations}`,ha=e=>({format:e.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),fa=(e,t,r,i)=>{let[a,n]=la(t,i,r),s=R("x",t.dataType,t.dims.length),u=s.type.value,l="value += x_val;",p="";a.countIncludePad?p+=`value /= ${u}(uniforms.kernelSize);`:p+=`value /= ${u}(i32(uniforms.kernelSize) - pad);`;let[c,h,g,_,y]=da(n,a);c.push(...X(t.dims,n));let w=["rank"];return{name:e,shaderCache:{hint:`${i.cacheKey};${g};${_};${y}`,inputDependencies:w},getRunData:()=>({outputs:[{dims:n,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(O.size(n)/64)},programUniforms:c}),getShaderSource:S=>pa(S,s,t.dims.length,n.length,a,l,p,0,h,g,_,y)}},Jh=e=>{let t=e.count_include_pad!==0,r=ha(e);if(r.ceilMode!==0)throw new Error("ceil_mode output-shape is computed, but ceil_mode kernel execution (padding/divisor) is not yet implemented in the WebGPU AveragePool kernel");let i={countIncludePad:t,...r,cacheKey:""};return{...i,cacheKey:od(i)}},ef=(e,t)=>{ar(e.inputs),e.compute(fa("AveragePool",e.inputs[0],!1,t))},ma={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},tf=e=>{let t=e.format;return{format:t,...ma,cacheKey:t}},rf=(e,t)=>{ar(e.inputs),e.compute(fa("GlobalAveragePool",e.inputs[0],!0,t))},ga=(e,t,r,i)=>{let[a,n]=la(t,i,r),s=`
      value = max(x_val, value);
    `,u="",l=R("x",t.dataType,t.dims.length),p=["rank"],[c,h,g,_,y]=da(n,a);return c.push(...X(t.dims,n)),{name:e,shaderCache:{hint:`${i.cacheKey};${g};${_};${y}`,inputDependencies:p},getRunData:()=>({outputs:[{dims:n,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(O.size(n)/64)},programUniforms:c}),getShaderSource:w=>pa(w,l,t.dims.length,n.length,a,s,u,t.dataType===10?-65504:-1e5,h,g,_,y)}},af=(e,t)=>{ar(e.inputs),e.compute(ga("MaxPool",e.inputs[0],!1,t))},nf=e=>{let t=e.storage_order,r=e.dilations,i=ha(e);if(t!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(i.ceilMode!==0)throw new Error("ceil_mode output-shape is computed, but ceil_mode kernel execution (padding) is not yet implemented in the WebGPU MaxPool kernel");let a={storageOrder:t,dilations:r,...i,cacheKey:""};return{...a,cacheKey:ud(a)}},sf=e=>{let t=e.format;return{format:t,...ma,cacheKey:t}},of=(e,t)=>{ar(e.inputs),e.compute(ga("GlobalMaxPool",e.inputs[0],!0,t))}}),ld,dd,uf,lf,ty=q(()=>{"use strict";re(),ie(),Se(),ae(),ld=(e,t)=>{if(e.length<2||e.length>3)throw new Error("DequantizeLinear requires 2 or 3 inputs.");if(e.length===3&&e[1].dims===e[2].dims)throw new Error("x-scale and x-zero-point must have the same shape.");if(e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==0&&e[1].dims.length!==1&&e[1].dims.length!==e[0].dims.length)throw new Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");if(e.length>2){if(e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==e[2].dims.length)throw new Error("scale and zero-point inputs must have the same rank.");if(!e[1].dims.map((r,i)=>r===e[2].dims[i]).reduce((r,i)=>r&&i,!0))throw new Error("scale and zero-point inputs must have the same shape.")}if(t.blockSize>0){if(e[1].dims.length===0||e[1].dims.length===1&&e[1].dims[0]===1)throw new Error("blockSize must be set only for block quantization.");if(!e[1].dims.map((a,n)=>n===t.axis||a===e[0].dims[n]).reduce((a,n)=>a&&n,!0))throw new Error("For block qunatization, scale input shape to match the input shape except for the axis");if(e[1].dims.length!==e[0].dims.length)throw new Error("For block qunatization the scale input rank must be the same as the x rank.");let r=e[0].dims[t.axis],i=e[1].dims[t.axis];if(t.blockSize<Math.ceil(r/i)||t.blockSize>Math.ceil(r/(i-1)-1))throw new Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].")}},dd=(e,t)=>{let r=O.normalizeAxis(t.axis,e[0].dims.length),i=e[0].dataType,a=i===3,n=e[0].dims,s=e[1].dataType,u=O.size(n),l=i===3||i===2,p=l?[Math.ceil(O.size(e[0].dims)/4)]:e[0].dims,c=e[1].dims,h=e.length>2?e[2]:void 0,g=h?l?[Math.ceil(O.size(h.dims)/4)]:h.dims:void 0,_=c.length===0||c.length===1&&c[0]===1,y=_===!1&&c.length===1,w=xe(u),S=_&&(!l||w===4),x=S?w:1,b=S&&!l?w:1,I=R("input",l?12:i,p.length,b),k=R("scale",s,c.length),T=h?R("zero_point",l?12:i,g.length):void 0,z=j("output",s,n.length,x),C=[I,k];T&&C.push(T);let v=[p,c];h&&v.push(g);let N=[{type:12,data:u/x},{type:12,data:r},{type:12,data:t.blockSize},...X(...v,n)],P=F=>{let W=[{name:"output_size",type:"u32"},{name:"axis",type:"u32"},{name:"block_size",type:"u32"}];return`
      ${F.registerUniforms(W).declareVariables(...C,z)}
      ${F.mainStart()}
          ${F.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${z.offsetToIndices("global_idx")};

          // Set input x
          ${l?`
            let input = ${I.getByOffset("global_idx / 4")};
            let x_vec = ${a?"unpack4xI8(input)":"unpack4xU8(input)"};
            let x_value = ${x===1?"x_vec[global_idx % 4]":"x_vec"};`:`let x_value = ${I.getByOffset("global_idx")};`};

          // Set scale input
          ${_?`let scale_value= ${k.getByOffset("0")}`:y?`
            let scale_index = ${z.indicesGet("output_indices","uniforms.axis")};
            let scale_value= ${k.getByOffset("scale_index")};`:`
            var scale_indices: ${k.type.indices} = output_indices;
            let index = ${k.indicesGet("scale_indices","uniforms.axis")} / uniforms.block_size;
            ${k.indicesSet("scale_indices","uniforms.axis","index")};
            let scale_value= ${k.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${T?_?l?`
                let zero_point_input = ${T.getByOffset("0")};
                let zero_point_vec =  ${a?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${T.getByOffset("0")}`:y?l?`
                let zero_point_index = ${z.indicesGet("output_indices","uniforms.axis")};
                let zero_point_input = ${T.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${a?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${z.indicesGet("output_indices","uniforms.axis")};
                let zero_point_value = ${T.getByOffset("zero_point_index")};`:l?`
                let zero_point_offset = ${k.indicesToOffset("scale_indices")};
                let zero_point_input = ${T.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${a?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${T.getByIndices("scale_indices")};`:`let zero_point_value = ${l?a?"i32":"u32":I.type.value}(0);`};
      // Compute and write output
      ${z.setByOffset("global_idx",`${z.type.value}(x_value - zero_point_value) * scale_value`)};
      }`};return{name:"DequantizeLinear",shaderCache:{hint:t.cacheKey,inputDependencies:T?["rank","rank","rank"]:["rank","rank"]},getShaderSource:P,getRunData:()=>({outputs:[{dims:n,dataType:s}],dispatchGroup:{x:Math.ceil(u/x/64),y:1,z:1},programUniforms:N})}},uf=(e,t)=>{ld(e.inputs,t),e.compute(dd(e.inputs,t))},lf=e=>he({axis:e.axis,blockSize:e.blockSize})}),pd,cd,df,ry=q(()=>{"use strict";Le(),re(),ae(),pd=(e,t,r)=>{let i=e===t,a=e<t&&r<0,n=e>t&&r>0;if(i||a||n)throw new Error("Range these inputs' contents are invalid.")},cd=(e,t,r,i)=>{let a=Math.abs(Math.ceil((t-e)/r)),n=[a],s=a,u=[{type:12,data:s},{type:i,data:e},{type:i,data:r},...X(n)],l=p=>{let c=j("output",i,n.length),h=c.type.value,g=[{name:"outputSize",type:"u32"},{name:"start",type:h},{name:"delta",type:h}];return`
        ${p.registerUniforms(g).declareVariables(c)}
        ${p.mainStart()}
        ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${h}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${i}`},getShaderSource:l,getRunData:()=>({outputs:[{dims:n,dataType:i}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:u})}},df=e=>{let t=0,r=0,i=0;e.inputs[0].dataType===6?(t=e.inputs[0].getInt32Array()[0],r=e.inputs[1].getInt32Array()[0],i=e.inputs[2].getInt32Array()[0]):e.inputs[0].dataType===1&&(t=e.inputs[0].getFloat32Array()[0],r=e.inputs[1].getFloat32Array()[0],i=e.inputs[2].getFloat32Array()[0]),ge.webgpu.validateInputContent&&pd(t,r,i),e.compute(cd(t,r,i,e.inputs[0].dataType),{inputs:[]})}}),hd,fd,pf,cf,iy=q(()=>{"use strict";re(),ie(),Se(),ae(),hd=(e,t,r,i)=>{if(e!=="none"&&i!=="i32"&&i!=="u32"&&i!=="f32")throw new Error(`Input ${i} is not supported with reduction ${e}.`);let a=`{
                var oldValue = 0;
                loop {
                  let newValueF32 =`,n=`;
                  let newValue = bitcast<i32>(newValueF32);
                  let res = atomicCompareExchangeWeak(&${t}, oldValue, newValue);
                  if res.exchanged {
                    break;
                  }
                  oldValue = res.old_value;
                }
              }`;switch(e){case"none":return`${t}=${r};`;case"add":return i==="i32"||i==="u32"?`atomicAdd(&${t}, bitcast<${i}>(${r}));`:`
              ${a}bitcast<${i}>(oldValue) + (${r})${n}`;case"max":return i==="i32"||i==="u32"?`atomicMax(&${t}, bitcast<${i}>(${r}));`:`
                ${a}max(bitcast<f32>(oldValue), (${r}))${n}`;case"min":return i==="i32"||i==="u32"?`atomicMin(&${t}, bitcast<${i}>(${r}));`:`${a}min(bitcast<${i}>(oldValue), (${r}))${n}`;case"mul":return`${a}(bitcast<${i}>(oldValue) * (${r}))${n}`;default:throw new Error(`Reduction ${e} is not supported.`)}},fd=(e,t)=>{let r=e[0].dims,i=e[1].dims,a=r,n=1,s=Math.ceil(O.sizeToDimension(i,i.length-1)/n),u=i[i.length-1],l=O.sizeFromDimension(r,u),p=[{type:12,data:s},{type:12,data:u},{type:12,data:l},...X(e[1].dims,e[2].dims,a)],c=h=>{let g=R("indices",e[1].dataType,e[1].dims.length),_=R("updates",e[2].dataType,e[2].dims.length,n),y=t.reduction!=="none"&&t.reduction!==""?Np("output",e[0].dataType,a.length):j("output",e[0].dataType,a.length,n);return`
      ${h.registerUniform("output_size","u32").registerUniform("last_index_dimension","u32").registerUniform("num_updates_elements","u32").declareVariables(g,_,y)}
      ${h.mainStart()}
        ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
  var data_offset = 0u;
  let indices_start = uniforms.last_index_dimension * global_idx;
  let indices_end = indices_start + uniforms.last_index_dimension;
  for (var i = indices_start; i < indices_end; i++) {
    var index = i32(indices[i].x);
    ${e[0].dims.length===1?`
    let element_count_dim = uniforms.output_strides;
    let dim_value = uniforms.output_shape;`:`
    let element_count_dim = uniforms.output_strides[i - indices_start];
    let dim_value = uniforms.output_shape[i - indices_start];`}
    if (index >= 0) {
      if (index >= i32(dim_value)) {
        index = i32(dim_value - 1);
      }
    } else {
      if (index < -i32(dim_value)) {
        index = 0;
      } else {
        index += i32(dim_value);
      }
    }
    data_offset += u32((u32(index) * element_count_dim));
  }

  for (var i = 0u; i < uniforms.num_updates_elements; i++) {
    let value = updates[uniforms.num_updates_elements * global_idx + i];
    ${hd(t.reduction,"output[data_offset + i]","value",y.type.value)}
  }

      }`};return{name:"ScatterND",shaderCache:{hint:`${t.cacheKey}_${t.reduction}`,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:p}),getShaderSource:c}},pf=e=>he({reduction:e.reduction}),cf=(e,t)=>{e.compute(fd(e.inputs,t),{inputs:[e.inputs[1],e.inputs[2]],outputs:[]})}}),md,gd,yd,ya,_d,bd,wd,$d,vd,xd,Sd,kd,_a,Td,Id,Ed,zd,Cd,hf,ff,ay=q(()=>{"use strict";re(),ie(),Se(),ae(),md=(e,t)=>{if(e.every(r=>r>0||(()=>{throw new Error("Resize requires scales input values to be positive")})),e.length>0){if(t.mode==="linear"){if(!(e.length===2||e.length===3||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1||e.length===5&&e[0]===1&&e[1]===1))throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(t.mode==="cubic"&&!(e.length===2||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1))throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},gd=(e,t,r)=>{t.every(a=>a>=0&&a<r||(()=>{throw new Error("Resize requires axes input values to be positive and less than rank")}));let i=new Array(r).fill(1);return t.forEach((a,n)=>i[a]=e[n]),i},yd=(e,t,r,i,a,n)=>{let[s,u,l]=r>10?[1,2,3]:[-1,e.length>1?1:-1,-1],p=e[0].dims.length;if(s>0&&e.length>s&&e[s].dims.length>0)e[s].getFloat32Array().forEach(c=>n.push(c));else if(t.coordinateTransformMode==="tf_crop_and_resize")throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(u>0&&e.length>u&&e[u].dims.length===1&&e[u].dims[0]>0){if(e[u].getFloat32Array().forEach(c=>i.push(c)),i.length!==0&&i.length!==p&&r>=18&&i.length!==t.axes.length)throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");md(i,t),t.axes.length>0&&gd(i,t.axes,p).forEach((c,h)=>i[h]=c)}if(l>0&&e.length>l&&e[l].dims.length===1&&e[l].dims[0]>0&&(e[l].getBigInt64Array().forEach(c=>a.push(Number(c))),a.length!==0&&a.length!==p&&r>=18&&a.length!==t.axes.length))throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(t.axes.length>0){if(i.length!==0&&i.length!==t.axes.length)throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(a.length!==0&&a.length!==t.axes.length)throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if(typeof i<"u"&&typeof a<"u"&&i.length>0&&a.length>p)throw new Error("Resize requires only of scales or sizes to be specified")},ya=(e,t,r,i)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${e}) * (${t});
  let whole = ${i}(big / (${r}));
  let fract = ${i}(big % (${r})) / ${i}(${r});
  return whole + fract;
`,_d=(e,t)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${t} { `+(()=>{switch(e){case"asymmetric":return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${t}(xResized) / ${t}(xScale);
          } else {
            ${ya("xResized","lengthOriginal","lengthResized",t)}
          }
        `;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${t}(xResized) + 0.5) / ${t}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${ya("xResized","lengthOriginal - 1","lengthResized - 1",t)}
                  }`;case"tf_crop_and_resize":return`if (lengthResized > 1) {
                    return ${t}(roiStart) * ${t}(lengthOriginal - 1) +
                        (${t}(xResized) * ${t}(roiEnd - roiStart) * ${t}(lengthOriginal - 1)) /
                        ${t}(lengthResized - 1);
                  } else {
                    return 0.5 * ${t}(roiStart + roiEnd) * ${t}(lengthOriginal - 1);
                  }`;case"half_pixel_symmetric":return`const outputWidth = ${t}xScale * ${t}(lengthResized);
                  const adjustment = ${t}(lengthResized) / outputWidth;
                  const center = ${t}(lengthOriginal) / 2;
                  const offset = center * (1 - adjustment);
                  return offset + ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;case"half_pixel":return`return ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;default:throw new Error(`Coordinate transform mode ${e} is not supported`)}})()+"}",bd=(e,t,r)=>`fn getNearestPixelFromOriginal(xOriginal: ${r}, isDownSample: bool) -> ${r} {`+(()=>{switch(e){case"round_prefer_ceil":return"if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";case"floor":return"return floor(xOriginal);";case"ceil":return"return ceil(xOriginal);";case"round_prefer_floor":return"if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";default:if(t<11)return"if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";throw new Error(`Nearest mode ${e} is not supported`)}})()+"}",wd=(e,t,r)=>{let i=new Array(r).fill(0).concat(new Array(r).fill(1)),a=e.length===0?i:e.slice();return t.length>0?(t.forEach((n,s)=>{i[n]=a[s],i[s+r]=a[t.length+s]}),i):a},$d=(e,t,r,i)=>{let a=[];if(r.length>0)if(i.length>0){if(e.forEach(n=>a.push(n)),Math.max(...i)>e.length)throw new Error("axes is out of bound");i.forEach((n,s)=>a[n]=r[s])}else r.forEach(n=>a.push(n));else{if(t.length===0)throw new Error("Resize requires either scales or sizes.");a=e.map((n,s)=>Math.round(n*t[s]))}return a},vd=(e,t,r)=>{let i=(()=>{switch(r.keepAspectRatioPolicy){case"not_larger":return r.axes.length>0?Math.min(...r.axes.map(n=>t[n]),Number.MAX_VALUE):Math.min(...t,Number.MAX_VALUE);case"not_smaller":return r.axes.length>0?Math.max(...r.axes.map(n=>t[n]),Number.MIN_VALUE):Math.max(...t,Number.MIN_VALUE);default:throw new Error(`Keep aspect ratio policy ${r.keepAspectRatioPolicy} is not supported`)}})();t.fill(1,0,t.length);let a=e.slice();return r.axes.length>0?(r.axes.forEach(n=>t[n]=i),r.axes.forEach(n=>a[n]=Math.round(e[n]*t[n]))):(t.fill(i,0,t.length),a.forEach((n,s)=>a[s]=Math.round(n*t[s]))),a},xd=(e,t,r,i,a)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> array<${e.type.value}, ${r.length}> {
      var original_indices: array<${e.type.value}, ${r.length}>;
      for (var i:u32 = 0; i < ${r.length}; i++) {
        var output_index = ${e.indicesGet("output_indices","i")};
        var scale = ${Z("uniforms.scales","i",i)};
        var roi_low = ${Z("uniforms.roi","i",a)};
        var roi_hi = ${Z("uniforms.roi",`i + ${t.length}`,a)};
        if (scale == 1.0) {
          original_indices[i] = ${e.type.value}(output_index);
        } else {
          var input_shape_i = ${Z("uniforms.input_shape","i",t.length)};
          var output_shape_i = ${Z("uniforms.output_shape","i",r.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,Sd=(e,t,r,i,a,n,s)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
      var input_indices: ${e.type.indices};
      for (var i:u32 = 0; i < ${i.length}; i++) {
        var output_index = ${t.indicesGet("output_indices","i")};
        var input_index: u32;
        var scale = ${Z("uniforms.scales","i",a)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${Z("uniforms.roi","i",n)};
          var roi_hi = ${Z("uniforms.roi",`i + ${r.length}`,n)};
          var input_shape_i = ${Z("uniforms.input_shape","i",r.length)};
          var output_shape_i = ${Z("uniforms.output_shape","i",i.length)};
          var original_idx = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                        input_shape_i, roi_low, roi_hi);
          if (!${s} || (original_idx >= 0 && original_idx < ${t.type.value}(input_shape_i))) {
            if (original_idx < 0) {
              input_index = 0;
            } else if (original_idx > ${t.type.value}(input_shape_i - 1)) {
              input_index = input_shape_i - 1;
            } else {
              input_index = u32(getNearestPixelFromOriginal(original_idx, scale < 1));
            }
          } else {
            input_index = u32(original_idx);
          }
        }
        ${e.indicesSet("input_indices","i","input_index")}
      }
      return input_indices;
    }`,kd=(e,t)=>`
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${Z("uniforms.input_shape","i",t.length)}) {
          return false;
        }
      }
      return true;
    }`,_a=(e,t,r,i)=>e.rank>i?`
    ${e.indicesSet("input_indices",t,"channel")};
    ${e.indicesSet("input_indices",r,"batch")};
`:"",Td=(e,t,r,i,a)=>{let[n,s,u,l]=r.length===2?[-1,0,1,-1]:[0,2,3,1],p=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${p} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(row, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(col, ${r[u]} - 1))`)};
      ${_a(e,l,n,2)}
      return ${e.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${t.type.indices}) -> ${p} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${p} = originalIndices[${s}];
      var col:${p} = originalIndices[${u}];
      ${i?`if (row < 0 || row > (${r[s]} - 1) || col < 0 || col > (${r[u]} - 1)) {
        return ${a};
      }`:""};
      row = max(0, min(row, ${r[s]} - 1));
      col = max(0, min(col, ${r[u]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${r.length>2?`u32(originalIndices[${l}])`:"0"};
      var batch: u32 =  ${r.length>2?`u32(originalIndices[${n}])`:"0"};
      var x11: ${p} = getInputValue(batch, channel, row1, col1);
      var x12: ${p} = getInputValue(batch, channel, row1, col2);
      var x21: ${p} = getInputValue(batch, channel, row2, col1);
      var x22: ${p} = getInputValue(batch, channel, row2, col2);
      var dx1: ${p} = abs(row - ${p}(row1));
      var dx2: ${p} = abs(${p}(row2) - row);
      var dy1: ${p} = abs(col - ${p}(col1));
      var dy2: ${p} = abs(${p}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`},Id=(e,t,r,i,a,n,s,u,l,p)=>{let c=r.length===2,h=!0,[g,_]=c?[0,1]:h?[2,3]:[1,2],y=e.type.value,w=S=>{let x=S===g?"row":"col";return`
      fn ${x}CubicInterpolation(input_indices: ${e.type.indices}, output_indices: ${t.type.indices}) -> ${y} {
        var output_index = ${t.indicesGet("output_indices",S)};
        var originalIdx: ${y} = getOriginalCoordinateFromResizedCoordinate(output_index, ${a[S]},
        ${i[S]}, ${r[S]}, ${n[S]}, ${n[S]} + ${r.length});
        var fractOriginalIdx: ${y} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${u} && (originalIdx < 0 || originalIdx > (${r[S]} - 1))) {
          return ${l};
        }
        var data: array<${y}, 4> = array<${y}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${x}: ${y} = originalIdx + ${y}(i);
          if (${x} < 0 || ${x} >= ${r[S]}) {
            ${p?`coefs[i + 1] = 0.0;
                        continue;`:u?`return ${l};`:`${x} = max(0, min(${x}, ${r[S]} - 1));`};
          }
        var input_indices_copy: ${e.type.indices} = input_indices;
          ${e.indicesSet("input_indices_copy",S,`u32(${x})`)};
          data[i + 1] = ${S===g?e.getByIndices("input_indices_copy"):"rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${w(g)};
    ${w(_)};
  fn getCubicInterpolationCoefs(s: ${y}) -> array<${y}, 4> {
    var absS = abs(s);
    var coeffs: array<${y}, 4> = array<${y}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${y} = 1.0 - absS;
    var twoMinusAbsS: ${y} = 2.0 - absS;
    var onePlusAbsS: ${y} = 1.0 + absS;
    coeffs[0] = ((${s} * onePlusAbsS - 5 * ${s}) * onePlusAbsS + 8 * ${s}) * onePlusAbsS - 4 * ${s};
    coeffs[1] = ((${s} + 2) * absS - (${s} + 3)) * absS * absS + 1;
    coeffs[2] = ((${s} + 2) * oneMinusAbsS - (${s} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${s} * twoMinusAbsS - 5 * ${s}) * twoMinusAbsS + 8 * ${s}) * twoMinusAbsS - 4 * ${s};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${y}, 4>, coefs: array<${y}, 4>) -> ${y} {
    var coefsSum: ${y} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${t.type.indices}) -> ${y} {
    var input_indices: ${e.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `},Ed=(e,t,r,i,a)=>{let[n,s,u,l,p]=r.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],c=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${c} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(depth, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(height, ${r[u]} - 1))`)};
      ${e.indicesSet("input_indices",l,`max(0, min(width, ${r[l]} - 1))`)};
      ${_a(e,p,n,3)}
      return ${e.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${t.type.indices}) -> ${c} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${c} = originalIndices[${s}];
      var height:${c} = originalIndices[${u}];
      var width:${c} = originalIndices[${l}];
      ${i?`if (depth < 0 || depth > (${r[s]} - 1) || height < 0 || height > (${r[u]} - 1) || width < 0 || (width > ${r[l]} - 1)) {
      return ${a};
        }`:""};

    depth = max(0, min(depth, ${r[s]} - 1));
      height = max(0, min(height, ${r[u]} - 1));
      width = max(0, min(width, ${r[l]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${r.length>3?`u32(originalIndices[${p}])`:"0"};
      var batch: u32 =  ${r.length>3?`u32(originalIndices[${n}])`:"0"};

      var x111: ${c} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${c} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${c} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${c} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${c} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${c} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${c} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${c} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${c} = abs(depth - ${c}(depth1));
      var dx2: ${c} = abs(${c}(depth2) - depth);
      var dy1: ${c} = abs(height - ${c}(height1));
      var dy2: ${c} = abs(${c}(height2) - height);
      var dz1: ${c} = abs(width - ${c}(width1));
      var dz2: ${c} = abs(${c}(width2) - width);
      if (depth1 == depth2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (height1 == height2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      if (width1 == width2) {
        dz1 = 0.5;
        dz2 = 0.5;
      }
      return (x111 * dx2 * dy2 * dz2 + x112 * dx2 * dy2 * dz1 + x121 * dx2 * dy1 *dz2 + x122 * dx2 * dy1 * dz1 +
              x211 * dx1 * dy2 * dz2 + x212 * dx1 * dy2 * dz1 + x221 * dx1 * dy1 *dz2 + x222 * dx1 * dy1 * dz1);
    }`},zd=(e,t,r,i,a,n)=>{let s=e.dims,u=wd(n,t.axes,s.length),l=$d(s,i,a,t.axes),p=i.slice();i.length===0&&(p=s.map((b,I)=>b===0?1:l[I]/b),t.keepAspectRatioPolicy!=="stretch"&&(l=vd(s,p,t)));let c=j("output",e.dataType,l.length),h=R("input",e.dataType,s.length),g=O.size(l),_=s.length===l.length&&s.every((b,I)=>b===l[I]),y=t.coordinateTransformMode==="tf_crop_and_resize",w=t.extrapolationValue,S=h.type.value,x=b=>`
      ${_?"":`
      ${_d(t.coordinateTransformMode,S)};
      ${(()=>{switch(t.mode){case"nearest":return`
              ${kd(h,s)};
              ${bd(t.nearestMode,r,S)};
              ${Sd(h,c,s,l,p.length,u.length,y)};
              `;case"linear":return`
              ${xd(c,s,l,p.length,u.length)};
              ${(()=>{if(s.length===2||s.length===4)return`${Td(h,c,s,y,w)}`;if(s.length===3||s.length===5)return`${Ed(h,c,s,y,w)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(s.length===2||s.length===4)return`${Id(h,c,s,l,p,u,t.cubicCoeffA,y,t.extrapolationValue,t.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
            `;default:throw Error("Invalid resize mode")}})()};
      `}
      ${b.registerUniform("output_size","u32").registerUniform("scales","f32",p.length).registerUniform("roi","f32",u.length).declareVariables(h,c)}
      ${b.mainStart()}
        ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${_?"output[global_idx] = input[global_idx];":`
        let output_indices = ${c.offsetToIndices("global_idx")};
        var input_indices: ${h.type.indices};
        ${(()=>{switch(t.mode){case"nearest":return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${h.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${t.extrapolationValue};
                }`;case"linear":return`output[global_idx] = ${s.length===2||s.length===4?"bilinearInterpolation":"trilinearInterpolation"}(output_indices);`;case"cubic":return"output[global_idx] = bicubicInterpolation(output_indices);";default:throw Error(`Unsupported resize mode: ${t.mode}`)}})()};
`}
      }`;return{name:"Resize",shaderCache:{hint:`${t.cacheKey}|${r}|${p.length>0?t.mode==="cubic"?p:p.length:""}|${a.length>0?a:""}|${u.length>0?u:""}|${_}|${t.mode==="nearest"?s.length:s}`,inputDependencies:["rank"]},getShaderSource:x,getRunData:()=>({outputs:[{dims:l,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:[{type:12,data:g},{type:1,data:p},{type:1,data:u},...X(s,l)]})}},Cd=e=>{let t=e.customDataBuffer;return new Uint32Array(t.buffer,t.byteOffset,1)[0]},hf=(e,t)=>{let r=[],i=[],a=[],n=Cd(e);if(t.antialias!==0)throw Error("Only default value (0) for Antialias attribute is supported");yd(e.inputs,t,n,r,i,a),e.compute(zd(e.inputs[0],t,n,r,i,a),{inputs:[0]})},ff=e=>{let t=e.antialias,r=e.axes,i=e.coordinateTransformMode,a=e.cubicCoeffA,n=e.excludeOutside!==0,s=e.extrapolationValue,u=e.keepAspectRatioPolicy,l=e.mode,p=e.nearestMode===""?"simple":e.nearestMode;return he({antialias:t,axes:r,coordinateTransformMode:i,cubicCoeffA:a,excludeOutside:n,extrapolationValue:s,keepAspectRatioPolicy:u,mode:l,nearestMode:p})}}),Ad,Od,mf,ny=q(()=>{"use strict";re(),ie(),ae(),Ad=e=>{if(!e||e.length<3)throw new Error("layerNorm requires at least 3 inputs.");let t=e[0],r=e[1],i=e[2];if(t.dataType!==r.dataType||t.dataType!==i.dataType)throw new Error("All inputs must have the same data type");if(t.dims.length!==3&&t.dims.length!==2)throw new Error("Input must be 2D or 3D");if(r.dims.length!==3&&r.dims.length!==2)throw new Error("Skip must be 2D or 3D");let a=t.dims[t.dims.length-1],n=t.dims[t.dims.length-2];if(r.dims[r.dims.length-1]!==a)throw new Error("Skip must have the same hidden size as input");if(r.dims[r.dims.length-2]!==n)throw new Error("Skip must have the same sequence length as input");if(i.dims.length!==1)throw new Error("Gamma must be 1D");if(i.dims[i.dims.length-1]!==a)throw new Error("Gamma must have the same hidden size as input");if(e.length>3){let s=e[3];if(s.dims.length!==1)throw new Error("Beta must be 1D");if(s.dims[s.dims.length-1]!==a)throw new Error("Beta must have the same hidden size as input")}if(e.length>4){let s=e[4];if(s.dims.length!==1)throw new Error("Bias must be 1D");if(s.dims[s.dims.length-1]!==a)throw new Error("Bias must have the same hidden size as input")}},Od=(e,t,r,i)=>{let a=t.simplified,n=e[0].dims,s=O.size(n),u=n,l=s,p=n.slice(-1)[0],c=i?n.slice(0,-1).concat(1):[],h=!a&&e.length>3,g=e.length>4,_=i&&r>1,y=i&&r>2,w=r>3,S=64,x=xe(p),b=[{type:12,data:l},{type:12,data:x},{type:12,data:p},{type:1,data:t.epsilon}],I=T=>{let z=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],C=[R("x",e[0].dataType,e[0].dims,x),R("skip",e[1].dataType,e[1].dims,x),R("gamma",e[2].dataType,e[2].dims,x)];h&&C.push(R("beta",e[3].dataType,e[3].dims,x)),g&&C.push(R("bias",e[4].dataType,e[4].dims,x)),C.push(j("output",e[0].dataType,u,x)),_&&C.push(j("mean_output",1,c)),y&&C.push(j("inv_std_output",1,c)),w&&C.push(j("input_skip_bias_sum",e[0].dataType,u,x));let v=Ee(e[0].dataType),N=Ee(1,x);return`

      ${T.registerUniforms(z).declareVariables(...C)}
      var<workgroup> sum_shared : array<${N}, ${S}>;
      var<workgroup> sum_squared_shared : array<${N}, ${S}>;

      ${T.mainStart([S,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / ${S};

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / ${S};
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == ${S-1}) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${g?"bias[offset1d + i]":v+"(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${w?"input_skip_bias_sum[offset + i] = value;":""}
          output[offset + i] = value;
          let f32_value = ${Vt(v,x,"value")};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = ${S};
        for (var curr_size = reduce_size >> 1;  curr_size > 0; curr_size = reduce_size >> 1) {
          reduce_size = curr_size + (reduce_size & 1);
          if (ix < curr_size) {
            sum_shared[ix] += sum_shared[ix + reduce_size];
            sum_squared_shared[ix] += sum_squared_shared[ix + reduce_size];
          }
          workgroupBarrier();
        }

        let sum = sum_shared[0];
        let square_sum = sum_squared_shared[0];
        let mean = ${_t("sum",x)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${_t("square_sum",x)} / f32(uniforms.hidden_size) ${a?"":"- mean * mean"} + uniforms.epsilon);
        ${_?"mean_output[global_idx] = mean;":""}
        ${y?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${a?"":`- ${v}(mean)`}) *
            ${v}(inv_std_dev) * gamma[offset1d + i]
            ${h?"+ beta[offset1d + i]":""};
        }
      }`},k=[{dims:u,dataType:e[0].dataType}];return r>1&&k.push({dims:c,dataType:1}),r>2&&k.push({dims:c,dataType:1}),r>3&&k.push({dims:n,dataType:e[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${x};${_};${y};${w}`,inputDependencies:e.map((T,z)=>"type")},getShaderSource:I,getRunData:()=>({outputs:k,dispatchGroup:{x:Math.ceil(l/p)},programUniforms:b})}},mf=(e,t)=>{Ad(e.inputs);let r=[0];e.outputCount>1&&r.push(-3),e.outputCount>2&&r.push(-3),e.outputCount>3&&r.push(3),e.compute(Od(e.inputs,t,e.outputCount,!1),{outputs:r})}}),Bd,nr,Rd,ba,Md,Nd,gf,yf,sy=q(()=>{"use strict";re(),ie(),Se(),ae(),Bd=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");if(t.axes.length!==0){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw new Error("axes, starts and ends must have the same length")}else if(t.starts.length!==t.ends.length)throw new Error("starts and ends must have the same length");e.slice(1).forEach((r,i)=>{if(e[i+1].dataType!==6&&e[i+1].dataType!==7)throw new Error(`Input ${i} must be an array of int32 or int64`)})},nr=(e,t)=>{let r=[];if(e.length>t)if(e[t].dataType===7)e[t].getBigInt64Array().forEach(i=>r.push(Number(i)));else if(e[t].dataType===6)e[t].getInt32Array().forEach(i=>r.push(Number(i)));else throw new Error(`Input ${t} must be an array of int32 or int64`);return r},Rd=(e,t)=>{if(e.length>1){let r=nr(e,1),i=nr(e,2),a=nr(e,3);return a.length===0&&(a=[...Array(e[0].dims.length).keys()]),he({starts:r,ends:i,axes:a})}else return t},ba=(e,t,r,i,a)=>{let n=e;return e<0&&(n+=r[i[t]]),a[t]<0?Math.max(0,Math.min(n,r[i[t]]-1)):Math.max(0,Math.min(n,r[i[t]]))},Md=(e,t,r)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
          var input_indices: ${e.type.indices};
          var carry = 0u;
          for (var i = ${r.length-1}; i >= 0; i--) {
            let input_shape_i = ${Z("uniforms.input_shape","i",r.length)};
            let steps_i = ${Z("uniforms.steps","i",r.length)};
            let signs_i = ${Z("uniforms.signs","i",r.length)};
            let starts_i = ${Z("uniforms.starts","i",r.length)};
            var output_index = ${t.indicesGet("output_indices","i")};
            var input_index = output_index * steps_i + starts_i + carry;
            carry = input_index / input_shape_i;
            input_index = input_index % input_shape_i;
            if (signs_i < 0) {
              input_index = input_shape_i - input_index - 1u + starts_i;
            }
            ${e.indicesSet("input_indices","i","input_index")};
          }
          return input_indices;
      }`,Nd=(e,t)=>{let r=e[0].dims,i=O.size(r),a=t.axes.length>0?O.normalizeAxes(t.axes,r.length):[...Array(r.length).keys()],n=nr(e,4);n.forEach(x=>x!==0||(()=>{throw new Error("step cannot be 0")})),n.length===0&&(n=Array(a.length).fill(1));let s=t.starts.map((x,b)=>ba(x,b,r,a,n)),u=t.ends.map((x,b)=>ba(x,b,r,a,n));if(a.length!==s.length||a.length!==u.length)throw new Error("start, ends and axes should have the same number of elements");if(a.length!==r.length)for(let x=0;x<r.length;++x)a.includes(x)||(s.splice(x,0,0),u.splice(x,0,r[x]),n.splice(x,0,1));let l=n.map(x=>Math.sign(x));n.forEach((x,b,I)=>{if(x<0){let k=(u[b]-s[b])/x,T=s[b],z=T+k*n[b];s[b]=z,u[b]=T,I[b]=-x}});let p=r.slice(0);a.forEach((x,b)=>{p[x]=Math.ceil((u[x]-s[x])/n[x])});let c={dims:p,dataType:e[0].dataType},h=j("output",e[0].dataType,p.length),g=R("input",e[0].dataType,e[0].dims.length),_=O.size(p),y=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:s.length},{name:"signs",type:"i32",length:l.length},{name:"steps",type:"u32",length:n.length}],w=[{type:12,data:_},{type:12,data:s},{type:6,data:l},{type:12,data:n},...X(e[0].dims,p)],S=x=>`
      ${x.registerUniforms(y).declareVariables(g,h)}
        ${Md(g,h,r)}
        ${x.mainStart()}
          ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${h.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${h.setByOffset("global_idx",g.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${l.length}_${s.length}_${n.length}`,inputDependencies:["rank"]},getShaderSource:S,getRunData:()=>({outputs:[c],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:w})}},gf=(e,t)=>{Bd(e.inputs,t);let r=Rd(e.inputs,t);e.compute(Nd(e.inputs,r),{inputs:[0]})},yf=e=>{let t=e.starts,r=e.ends,i=e.axes;return he({starts:t,ends:r,axes:i})}}),Dd,Ud,_f,bf,oy=q(()=>{"use strict";re(),ie(),Se(),bt(),ae(),Dd=e=>{if(!e||e.length!==1)throw new Error("Softmax op requires 1 input.")},Ud=(e,t)=>{let r=e.inputs[0],i=r.dims,a=O.size(i),n=i.length,s=O.normalizeAxis(t.axis,n),u=s<i.length-1,l,p=[];u?(p=Array.from({length:n},(C,v)=>v),p[s]=n-1,p[n-1]=s,l=e.compute(De(r,p),{inputs:[r],outputs:[-1]})[0]):l=r;let c=l.dims,h=c[n-1],g=a/h,_=xe(h),y=h/_,w=64;g===1&&(w=256);let S=(C,v)=>v===4?`max(max(${C}.x, ${C}.y), max(${C}.z, ${C}.w))`:v===2?`max(${C}.x, ${C}.y)`:v===3?`max(max(${C}.x, ${C}.y), ${C}.z)`:C,x=R("x",l.dataType,l.dims,_),b=j("result",l.dataType,l.dims,_),I=x.type.value,k=Ee(l.dataType)==="f32"?`var threadMax = ${I}(-3.4028234663852886e+38f);`:`var threadMax = ${I}(-65504.0h);`,T=C=>`
      var<workgroup> rowMaxShared : ${I};
      var<workgroup> rowSumShared : ${I};
      var<workgroup> threadShared : array<${I}, ${w}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${I} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${I}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${C.registerUniform("packedCols","i32").declareVariables(x,b)}
      ${C.mainStart(w)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${w};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${k}
        for (var col = lindex; col < cols; col += wg) {
          let value = getValue(row, col, row_stride);
          threadMax = max(threadMax, value);
        }
        if (lindex < cols) {
          threadShared[lindex] = threadMax;
        }
        workgroupBarrier();

        var reduceSize = min(cols, wg);
        for (var currSize = reduceSize >> 1;  currSize > 0; currSize = reduceSize >> 1) {
          reduceSize = currSize + (reduceSize & 1);
          if (lindex < currSize) {
            threadShared[lindex] = max(threadShared[lindex], threadShared[lindex + reduceSize]);
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowMaxShared = ${I}(${S("threadShared[0]",_)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${I}(0.0);
        for (var col = lindex; col < cols; col += wg) {
          let subExp = exp(getValue(row, col, row_stride) - rowMaxShared);
          threadSum += subExp;
        }
        threadShared[lindex] = threadSum;
        workgroupBarrier();

        for (var currSize = wg >> 1;  currSize > 0; currSize = currSize >> 1) {
          if (lindex < currSize) {
            threadShared[lindex] = threadShared[lindex] + threadShared[lindex + currSize];
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowSumShared = ${I}(${_t("threadShared[0]",_)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          var value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          // max operation protects against NaN since all values should be >=0
          value = max(value, ${I}(0.0));
          setValue(row, col, row_stride, value);
        }
      }`,z=e.compute({name:"Softmax",shaderCache:{hint:`${_};${w}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:c,dataType:l.dataType}],dispatchGroup:{x:g},programUniforms:[{type:6,data:y}]}),getShaderSource:T},{inputs:[l],outputs:[u?-1:0]})[0];u&&e.compute(De(z,p),{inputs:[z]})},_f=(e,t)=>{Dd(e.inputs),Ud(e,t)},bf=e=>he({axis:e.axis})}),wa,Pd,qd,Ld,wf,uy=q(()=>{"use strict";re(),ie(),ae(),wa=e=>Array.from(e.getBigInt64Array(),Number),Pd=e=>{if(!e||e.length!==2)throw new Error("Tile requires 2 inputs.");if(e[0].dataType!==1&&e[0].dataType!==10&&e[0].dataType!==6&&e[0].dataType!==12)throw new Error("Tile only support float, float16, int32, and uint32 data types");if(e[1].dataType!==7)throw new Error("Tile `repeats` input should be of int64 data type");if(e[1].dims.length!==1)throw new Error("Tile `repeats` input should be 1-D");if(wa(e[1]).length!==e[0].dims.length)throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},qd=(e,t)=>{let r=[];for(let i=0;i<e.length;++i)r.push(e[i]*t[i]);return r},Ld=(e,t)=>{let r=e[0].dims,i=t??wa(e[1]),a=qd(r,i),n=O.size(a),s=e[0].dataType,u=R("input",s,r.length),l=j("output",s,a.length),p=c=>`
      const inputShape = ${u.indices(...r)};
      ${c.registerUniform("output_size","u32").declareVariables(u,l)}
      ${c.mainStart()}
      ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let output_indices = ${l.offsetToIndices("global_idx")};
      var input_indices: ${u.type.indices};
      for (var i = 0; i < ${r.length}; i++) {
        let input_dim_i = ${u.indicesGet("uniforms.input_shape","i")};
        let input_dim_value = ${l.indicesGet("output_indices","i")}  % input_dim_i;

        ${u.indicesSet("input_indices","i","input_dim_value")}
      }
      ${l.setByOffset("global_idx",u.getByIndices("input_indices"))}
    }`;return{name:"Tile",shaderCache:{hint:`${i}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:[{type:12,data:n},...X(e[0].dims,a)]}),getShaderSource:p}},wf=e=>{Pd(e.inputs),e.compute(Ld(e.inputs),{inputs:[0]})}}),Wd,Vd,$f,ly=q(()=>{"use strict";re(),ie(),ae(),Wd=(e,t,r,i,a)=>{let n=j("output_data",a,r.length,4),s=R("a_data",t[1].dataType,t[1].dims.length,4),u=R("b_data",t[2].dataType,t[2].dims.length,4),l=R("c_data",t[0].dataType,t[0].dims.length,4),p,c=(h,g,_)=>`select(${g}, ${h}, ${_})`;if(!i)p=n.setByOffset("global_idx",c(s.getByOffset("global_idx"),u.getByOffset("global_idx"),l.getByOffset("global_idx")));else{let h=(g,_,y="")=>{let w=`a_data[index_a${_}][component_a${_}]`,S=`b_data[index_b${_}][component_b${_}]`,x=`bool(c_data[index_c${_}] & (0xffu << (component_c${_} * 8)))`;return`
            let output_indices${_} = ${n.offsetToIndices(`global_idx * 4u + ${_}u`)};
            let offset_a${_} = ${s.broadcastedIndicesToOffset(`output_indices${_}`,n)};
            let offset_b${_} = ${u.broadcastedIndicesToOffset(`output_indices${_}`,n)};
            let offset_c${_} = ${l.broadcastedIndicesToOffset(`output_indices${_}`,n)};
            let index_a${_} = offset_a${_} / 4u;
            let index_b${_} = offset_b${_} / 4u;
            let index_c${_} = offset_c${_} / 4u;
            let component_a${_} = offset_a${_} % 4u;
            let component_b${_} = offset_b${_} % 4u;
            let component_c${_} = offset_c${_} % 4u;
            ${g}[${_}] = ${y}(${c(w,S,x)});
          `};a===9?p=`
            var data = vec4<u32>(0);
            ${h("data",0,"u32")}
            ${h("data",1,"u32")}
            ${h("data",2,"u32")}
            ${h("data",3,"u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:p=`
            ${h("output_data[global_idx]",0)}
            ${h("output_data[global_idx]",1)}
            ${h("output_data[global_idx]",2)}
            ${h("output_data[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(l,s,u,n)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${p}
      }`},Vd=e=>{let t=e[1].dims,r=e[2].dims,i=e[0].dims,a=e[1].dataType,n=!(O.areEqual(t,r)&&O.areEqual(r,i)),s=t,u=O.size(t);if(n){let p=Gt.calcShape(Gt.calcShape(t,r,!1),i,!1);if(!p)throw new Error("Can't perform where op on the given tensors");s=p,u=O.size(s)}let l=Math.ceil(u/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:p=>Wd(p,e,s,n,a),getRunData:()=>({outputs:[{dims:s,dataType:a}],dispatchGroup:{x:Math.ceil(u/64/4)},programUniforms:[{type:12,data:l},...X(i,t,r,s)]})}},$f=e=>{e.compute(Vd(e.inputs))}}),vf,dy=q(()=>{"use strict";x0(),rn(),S0(),k0(),T0(),I0(),E0(),B0(),M0(),N0(),D0(),U0(),P0(),q0(),L0(),W0(),V0(),G0(),H0(),F0(),j0(),K0(),Z0(),X0(),Q0(),Y0(),qh(),J0(),ey(),ty(),ry(),iy(),tn(),ay(),Hh(),ny(),sy(),oy(),Vh(),uy(),bt(),an(),ly(),vf=new Map([["Abs",[pc]],["Acos",[cc]],["Acosh",[hc]],["Add",[Kc]],["ArgMax",[oc,Oa]],["ArgMin",[sc,Oa]],["Asin",[fc]],["Asinh",[mc]],["Atan",[gc]],["Atanh",[yc]],["Attention",[uc]],["AveragePool",[ef,Jh]],["BatchNormalization",[lc]],["BiasAdd",[dc]],["BiasSplitGelu",[jc]],["Cast",[bc,_c]],["Ceil",[$c]],["Clip",[wc]],["Concat",[ah,nh]],["Conv",[Ua,Da]],["ConvTranspose",[mh,fh]],["Cos",[vc]],["Cosh",[xc]],["CumSum",[gh,yh]],["DepthToSpace",[_h,bh]],["DequantizeLinear",[uf,lf]],["DFT",[wh,$h]],["Div",[Zc]],["Einsum",[vh,xh]],["Elu",[Sc,lr]],["Equal",[Xc]],["Erf",[kc]],["Exp",[Tc]],["Expand",[Sh]],["FastGelu",[kh]],["Floor",[Ic]],["FusedConv",[Ua,Da]],["Gather",[Ih,Th]],["GatherElements",[Bh,Oh]],["GatherBlockQuantized",[Ch,Ah]],["GatherND",[Eh,zh]],["Gelu",[Ec]],["Gemm",[Mh,Rh]],["GlobalAveragePool",[rf,tf]],["GlobalMaxPool",[of,sf]],["Greater",[eh]],["GreaterOrEqual",[rh]],["GridSample",[Nh,Dh]],["GroupQueryAttention",[Fh]],["HardSigmoid",[Nc,Mc]],["HardSwish",[Dc]],["InstanceNormalization",[jh]],["LayerNormalization",[Kh]],["LeakyRelu",[zc,lr]],["Less",[th]],["LessOrEqual",[ih]],["Log",[Hc]],["MatMul",[Zh]],["MatMulNBits",[Xh,Qh]],["MaxPool",[af,nf]],["Mul",[Qc]],["MultiHeadAttention",[Ph,Uh]],["Neg",[Ac]],["Not",[Cc]],["Pad",[Yh]],["Pow",[Yc]],["QuickGelu",[Fc,lr]],["Range",[df]],["Reciprocal",[Oc]],["ReduceMin",[tc]],["ReduceMean",[Xp]],["ReduceMax",[ec]],["ReduceSum",[ic]],["ReduceProd",[rc]],["ReduceL1",[Qp]],["ReduceL2",[Yp]],["ReduceLogSum",[nc]],["ReduceLogSumExp",[Jp]],["ReduceSumSquare",[ac]],["Relu",[Bc]],["Resize",[hf,ff]],["RotaryEmbedding",[Gh]],["ScatterND",[cf,pf]],["Sigmoid",[Rc]],["Sin",[Uc]],["Sinh",[Pc]],["Slice",[gf,yf]],["SkipLayerNormalization",[mf]],["Split",[Lh,Wh]],["Sqrt",[qc]],["Softmax",[_f,bf]],["Sub",[Jc]],["Tan",[Lc]],["Tanh",[Wc]],["ThresholdedRelu",[Gc,lr]],["Tile",[wf]],["Transpose",[Up,Pp]],["Where",[$f]]])}),xf,py=q(()=>{"use strict";Le(),ot(),ae(),xf=class{constructor(e){this.backend=e,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,r,i,a){tt(e.programInfo.name);let n=this.backend.device,s=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let u=[];for(let p of t)u.push({binding:u.length,resource:{buffer:p.buffer}});for(let p of r)u.push({binding:u.length,resource:{buffer:p.buffer}});a&&u.push({binding:u.length,resource:a});let l=n.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:u,label:e.programInfo.name});if(this.backend.sessionStatus==="capturing"){let p={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:l,dispatchGroup:i};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(p)}s.setPipeline(e.computePipeline),s.setBindGroup(0,l),s.dispatchWorkgroups(...i),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType==="at-passes")&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),Ze(e.programInfo.name)}dispose(){}build(e,t){tt(e.name);let r=this.backend.device,i=[];[{feature:"shader-f16",extension:"f16"},{feature:"subgroups",extension:"subgroups"}].forEach(p=>{r.features.has(p.feature)&&i.push(`enable ${p.extension};`)});let a=Dp(t,this.backend.device.limits),n=e.getShaderSource(a),s=`${i.join(`
`)}
${a.additionalImplementations}
${n}`,u=r.createShaderModule({code:s,label:e.name});de("verbose",()=>`[WebGPU] ${e.name} shader code: ${s}`);let l=r.createComputePipeline({compute:{module:u,entryPoint:"main"},layout:"auto",label:e.name});return Ze(e.name),{programInfo:e,computePipeline:l,uniformVariablesInfo:a.variablesInfo}}normalizeDispatchGroupSize(e){let t=typeof e=="number"?e:e.x,r=typeof e=="number"?1:e.y||1,i=typeof e=="number"?1:e.z||1,a=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(t<=a&&r<=a&&i<=a)return[t,r,i];let n=t*r*i,s=Math.ceil(Math.sqrt(n));if(s>a){if(s=Math.ceil(Math.cbrt(n)),s>a)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[s,s,s]}else return[s,s,1]}}}),Sf={};Ft(Sf,{WebGpuBackend:()=>kf});var Gd,Hd,Fd,kf,cy=q(()=>{"use strict";Le(),re(),ot(),Op(),$0(),dy(),py(),Gd=(e,t)=>{if(t.length!==e.length)throw new Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let r=[];for(let i=0;i<e.length;++i){let a=e[i].dataType;switch(t[i]){case"none":{r.push("");break}case"type":{r.push(`${a}`);break}case"rank":{let n=e[i].dims.length;r.push(`${a};${n}`);break}case"dims":{let n=e[i].dims.join(",");r.push(`${a};${n}`);break}default:throw new Error(`unsupported input dependency: ${t[i]}`)}}return r.join("|")},Hd=(e,t,r)=>{let i=e.name;return e.shaderCache?.hint&&(i+="["+e.shaderCache.hint+"]"),i+=":"+r+`:${Gd(t,e.shaderCache?.inputDependencies??new Array(t.length).fill("dims"))}`,i},Fd=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},kf=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus="default",this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,t){this.env=e;let r=[],i={requiredLimits:{maxComputeWorkgroupStorageSize:t.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:t.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:t.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.limits.maxComputeWorkgroupSizeZ},requiredFeatures:r},a=u=>t.features.has(u)&&r.push(u)&&!0;a("chromium-experimental-timestamp-query-inside-passes")||a("timestamp-query"),a("shader-f16"),a("subgroups"),this.device=await t.requestDevice(i);let n=t,s=t.info??(typeof n.requestAdapterInfo=="function"?await n.requestAdapterInfo():void 0);this.adapterInfo=new Fd(s),this.gpuDataManager=Mp(this),this.programManager=new xf(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,Qa(e.logLevel,!!e.debug),this.device.onuncapturederror=u=>{u.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${u.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!0}),Object.defineProperty(this.env.webgpu,"adapter",{value:t,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){typeof this.querySet<"u"&&this.querySet.destroy(),this.gpuDataManager.dispose(),this.device&&this.env?.webgpu&&this.device.lost.then(()=>{delete this.env.webgpu.device})}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),t={};this.queryType==="at-passes"&&(t.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=e.beginComputePass(t)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){if(!this.commandEncoder)return;tt(),this.endComputePass();let e;this.queryType!=="none"&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),e=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!=="none"&&e.mapAsync(GPUMapMode.READ).then(()=>{let t=new BigUint64Array(e.getMappedRange()),r=this.pendingQueries.get(e);for(let i=0;i<t.length/2;i++){let a=r[i],n=a.kernelId,s=this.kernels.get(n),u=s.kernelType,l=s.kernelName,p=a.programName,c=a.inputTensorViews,h=a.outputTensorViews,g=t[i*2],_=t[i*2+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=g);let y=Number(g-this.queryTimeBase),w=Number(_-this.queryTimeBase);if(!Number.isSafeInteger(y)||!Number.isSafeInteger(w))throw new RangeError("incorrect timestamp range");if(this.env.webgpu.profiling?.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:c.map(S=>({dims:S.dims,dataType:st(S.dataType)})),outputsMetadata:h.map(S=>({dims:S.dims,dataType:st(S.dataType)})),kernelId:n,kernelType:u,kernelName:l,programName:p,startTime:y,endTime:w});else{let S="";c.forEach((b,I)=>{S+=`input[${I}]: [${b.dims}] | ${st(b.dataType)}, `});let x="";h.forEach((b,I)=>{x+=`output[${I}]: [${b.dims}] | ${st(b.dataType)}, `}),console.log(`[profiling] kernel "${n}|${u}|${l}|${p}" ${S}${x}start time: ${y} ns, execution time: ${w-y} ns`)}Hr("GPU",`${p}::${g}::${_}`)}e.unmap(),this.pendingQueries.delete(e)}),Ze()}run(e,t,r,i,a,n){tt(e.name);let s=[];for(let b=0;b<t.length;++b){let I=t[b].data;if(I===0)continue;let k=this.gpuDataManager.get(I);if(!k)throw new Error(`no GPU data for input: ${I}`);s.push(k)}let{outputs:u,dispatchGroup:l,programUniforms:p}=e.getRunData(t),c=r.length===0?u.map((b,I)=>I):r;if(c.length!==u.length)throw new Error(`Output size ${c.length} must be equal to ${u.length}.`);let h=[],g=[];for(let b=0;b<u.length;++b){if(!Number.isInteger(c[b])||c[b]<-3||c[b]>=n)throw new Error(`Invalid output index: ${c[b]}`);if(c[b]===-3)continue;let I=c[b]===-1,k=c[b]===-2,T=I||k?a(u[b].dataType,u[b].dims):i(c[b],u[b].dataType,u[b].dims);if(h.push(T),T.data===0)continue;let z=this.gpuDataManager.get(T.data);if(!z)throw new Error(`no GPU data for output: ${T.data}`);if(I&&this.temporaryData.push(z),k){let C=this.kernelPersistentData.get(this.currentKernelId);C||(C=[],this.kernelPersistentData.set(this.currentKernelId,C)),C.push(z)}g.push(z)}if(s.length!==t.length||g.length!==h.length){if(g.length===0)return Ze(e.name),h;throw new Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let _;if(p){let b=0,I=[];p.forEach(C=>{let v=typeof C.data=="number"?[C.data]:C.data;if(v.length===0)return;let N=C.type===10?2:4,P,F;C.type===10?(F=v.length>4?16:v.length>2?8:v.length*N,P=v.length>4?16:N*v.length):(F=v.length<=2?v.length*N:16,P=16),b=Math.ceil(b/F)*F,I.push(b);let W=C.type===10?8:4;b+=v.length>4?Math.ceil(v.length/W)*P:v.length*N});let k=16;b=Math.ceil(b/k)*k;let T=new ArrayBuffer(b);p.forEach((C,v)=>{let N=I[v],P=typeof C.data=="number"?[C.data]:C.data;if(C.type===6)new Int32Array(T,N,P.length).set(P);else if(C.type===12)new Uint32Array(T,N,P.length).set(P);else if(C.type===10)new Uint16Array(T,N,P.length).set(P);else if(C.type===1)new Float32Array(T,N,P.length).set(P);else throw new Error(`Unsupported uniform type: ${st(C.type)}`)});let z=this.gpuDataManager.create(b,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(z.buffer,0,T,0,b),this.gpuDataManager.release(z.id),_={offset:0,size:b,buffer:z.buffer}}let y=this.programManager.normalizeDispatchGroupSize(l),w=y[1]===1&&y[2]===1,S=Hd(e,t,w),x=this.programManager.getArtifact(S);if(x||(x=this.programManager.build(e,y),this.programManager.setArtifact(S,x),de("info",()=>`[artifact] key: ${S}, programName: ${e.name}`)),p&&x.uniformVariablesInfo){if(p.length!==x.uniformVariablesInfo.length)throw new Error(`Uniform variables count mismatch: expect ${x.uniformVariablesInfo.length}, got ${p.length} in program "${x.programInfo.name}".`);for(let b=0;b<p.length;b++){let I=p[b],k=I.type,T=typeof I.data=="number"?1:I.data.length,[z,C]=x.uniformVariablesInfo[b];if(k!==z||T!==C)throw new Error(`Uniform variable ${b} mismatch: expect type ${z} with size ${C}, got type ${k} with size ${T} in program "${x.programInfo.name}".`)}}if(de("info",()=>`[ProgramManager] run "${e.name}" (key=${S}) with ${y[0]}x${y[1]}x${y[2]}`),this.queryType!=="none"||this.sessionStatus==="capturing"){let b={kernelId:this.currentKernelId,programName:x.programInfo.name,inputTensorViews:t,outputTensorViews:h};this.pendingKernels.push(b),this.sessionStatus==="capturing"&&this.capturedPendingKernels.get(this.currentSessionId).push(b)}return this.programManager.run(x,s,g,y,_),Ze(e.name),h}upload(e,t){this.gpuDataManager.upload(e,t)}memcpy(e,t){this.gpuDataManager.memcpy(e,t)}async download(e,t){await this.gpuDataManager.download(e,t)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,t,r,i){let a=vf.get(e);if(!a)throw new Error(`kernel not implemented: ${e}`);let n={kernelType:e,kernelName:i,kernelEntry:a[0],attributes:[a[1],r]};this.kernels.set(t,n)}releaseKernel(e){let t=this.kernelPersistentData.get(e);if(t){for(let r of t)this.gpuDataManager.release(r.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,t,r){let i=this.kernels.get(e);if(!i)throw new Error(`kernel not created: ${e}`);let a=i.kernelType,n=i.kernelName,s=i.kernelEntry,u=i.attributes;if(this.currentKernelId!==null)throw new Error(`kernel "[${a}] ${n}" is not allowed to be called recursively`);this.currentKernelId=e,u[0]&&(u[1]=u[0](u[1]),u[0]=void 0),de("info",()=>`[WebGPU] Start to run kernel "[${a}] ${n}"...`);let l=this.env.debug;this.temporaryData=[];try{return l&&this.device.pushErrorScope("validation"),s(t,u[1]),0}catch(p){return r.push(Promise.resolve(`[WebGPU] Kernel "[${a}] ${n}" failed. ${p}`)),1}finally{l&&r.push(this.device.popErrorScope().then(p=>p?`GPU validation error for kernel "[${a}] ${n}": ${p.message}`:null));for(let p of this.temporaryData)this.gpuDataManager.release(p.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,t,r,i){let a=this.sessionExternalDataMapping.get(e);a||(a=new Map,this.sessionExternalDataMapping.set(e,a));let n=a.get(t),s=this.gpuDataManager.registerExternalBuffer(r,i,n);return a.set(t,[s,r]),s}unregisterBuffers(e){let t=this.sessionExternalDataMapping.get(e);t&&(t.forEach(r=>this.gpuDataManager.unregisterExternalBuffer(r[0])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let t=this.gpuDataManager.get(e);if(!t)throw new Error(`no GPU data for buffer: ${e}`);return t.buffer}createDownloader(e,t,r){return async()=>{let i=await za(this,e,t);return Ya(i.buffer,r)}}writeTimestamp(e){this.queryType==="inside-passes"&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){this.queryType="none",(this.env.webgpu.profiling?.mode==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),this.queryType!=="none"&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){de("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){de("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){de("info","replay"),this.sessionStatus="replaying";let e=this.capturedCommandList.get(this.currentSessionId),t=this.capturedPendingKernels.get(this.currentSessionId),r=e.length;this.pendingKernels=[];for(let i=0;i<r;i++){let a=this.getComputePassEncoder(),n=e[i];this.writeTimestamp(this.pendingDispatchNumber*2),a.setPipeline(n.computePipeline),a.setBindGroup(0,n.bindGroup),a.dispatchWorkgroups(...n.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!=="none"&&this.pendingKernels.push(t[i]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType==="at-passes")&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}}),Tf={};Ft(Tf,{init:()=>If});var Pr,jd,If,hy=q(()=>{"use strict";re(),ot(),ie(),w0(),Pr=class Ef{constructor(t,r,i,a){this.module=t,this.dataType=r,this.data=i,this.dims=a}getFloat32Array(){if(this.dataType!==1)throw new Error("Invalid data type");let t=O.size(this.dims);return t===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,t)}getBigInt64Array(){if(this.dataType!==7)throw new Error("Invalid data type");let t=O.size(this.dims);return t===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,t)}getInt32Array(){if(this.dataType!==6)throw new Error("Invalid data type");let t=O.size(this.dims);return t===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,t)}getUint16Array(){if(this.dataType!==10&&this.dataType!==4)throw new Error("Invalid data type");let t=O.size(this.dims);return t===0?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,t)}reshape(t){if(O.size(t)!==O.size(this.dims))throw new Error("Invalid new shape");return new Ef(this.module,this.dataType,this.data,t)}},jd=class{constructor(e,t,r){this.module=e,this.backend=t,this.customDataOffset=0,this.customDataSize=0,this.adapterInfo=t.adapterInfo;let i=e.PTR_SIZE,a=r/e.PTR_SIZE,n=i===4?"i32":"i64";this.opKernelContext=Number(e.getValue(i*a++,n));let s=Number(e.getValue(i*a++,n));this.outputCount=Number(e.getValue(i*a++,n)),this.customDataOffset=Number(e.getValue(i*a++,"*")),this.customDataSize=Number(e.getValue(i*a++,n));let u=[];for(let l=0;l<s;l++){let p=Number(e.getValue(i*a++,n)),c=Number(e.getValue(i*a++,"*")),h=Number(e.getValue(i*a++,n)),g=[];for(let _=0;_<h;_++)g.push(Number(e.getValue(i*a++,n)));u.push(new Pr(e,p,c,g))}this.inputs=u}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(e,t){let r=t?.inputs?.map(s=>typeof s=="number"?this.inputs[s]:s)??this.inputs,i=t?.outputs??[],a=(s,u,l)=>new Pr(this.module,u,this.output(s,l),l),n=(s,u)=>{let l=At(s,u);if(!l)throw new Error(`Unsupported data type: ${s}`);let p=l>0?this.backend.gpuDataManager.create(l).id:0;return new Pr(this.module,s,p,u)};return this.backend.run(e,r,i,a,n,this.outputCount)}output(e,t){let r=this.module.stackSave();try{let i=this.module.PTR_SIZE,a=i===4?"i32":"i64",n=this.module.stackAlloc((1+t.length)*i);this.module.setValue(n,t.length,a);for(let s=0;s<t.length;s++)this.module.setValue(n+i*(s+1),t[s],a);return this.module._JsepOutput(this.opKernelContext,e,n)}catch(i){throw new Error(`Failed to generate kernel's output[${e}] with dims [${t}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${i}`)}finally{this.module.stackRestore(r)}}},If=async(e,t,r,i)=>{let a=t.jsepInit;if(!a)throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if(e==="webgpu"){let n=(cy(),cr(Sf)).WebGpuBackend,s=new n;await s.initialize(r,i),a("webgpu",[s,u=>s.alloc(Number(u)),u=>s.free(u),(u,l,p,c=!1)=>{if(c)de("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(u)}, dst=${Number(l)}, size=${Number(p)}`),s.memcpy(Number(u),Number(l));else{de("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(u)}, gpuDataId=${Number(l)}, size=${Number(p)}`);let h=t.HEAPU8.subarray(Number(u>>>0),Number(u>>>0)+Number(p));s.upload(Number(l),h)}},async(u,l,p)=>{de("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${u}, dataOffset=${l}, size=${p}`),await s.download(Number(u),()=>t.HEAPU8.subarray(Number(l)>>>0,Number(l+p)>>>0))},(u,l,p)=>s.createKernel(u,Number(l),p,t.UTF8ToString(t._JsepGetNodeName(Number(l)))),u=>s.releaseKernel(u),(u,l,p,c)=>{de("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${p}, kernel=${u}, contextDataOffset=${l}`);let h=new jd(t,s,Number(l));return s.computeKernel(Number(u),h,c)},()=>s.captureBegin(),()=>s.captureEnd(),()=>s.replay()])}else{let n=new Rp(r);a("webnn",[n,()=>n.reserveTensorId(),s=>n.releaseTensorId(s),async(s,u,l,p,c)=>n.ensureTensor(s,u,l,p,c),(s,u)=>{n.uploadTensor(s,u)},async(s,u)=>n.downloadTensor(s,u),(s,u)=>n.registerMLContext(s,u),!!r.trace])}}}),Kd,dn,pn,mt,Zd,$a,Yr,cn,hn,va,fn,mn,gn,zf=q(()=>{"use strict";Le(),y0(),_0(),re(),Dt(),ja(),Ep(),Kd=(e,t)=>{_e()._OrtInit(e,t)!==0&&fe("Can't initialize onnxruntime.")},dn=async e=>{Kd(e.wasm.numThreads,jr(e.logLevel))},pn=async(e,t)=>{_e().asyncInit?.();let r=e.webgpu.adapter;if(t==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");if(r){if(typeof r.limits!="object"||typeof r.features!="object"||typeof r.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let i=e.webgpu.powerPreference;if(i!==void 0&&i!=="low-power"&&i!=="high-performance")throw new Error(`Invalid powerPreference setting: "${i}"`);let a=e.webgpu.forceFallbackAdapter;if(a!==void 0&&typeof a!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${a}"`);if(r=await navigator.gpu.requestAdapter({powerPreference:i,forceFallbackAdapter:a}),!r)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}}if(t==="webnn"&&(typeof navigator>"u"||!navigator.ml))throw new Error("WebNN is not supported in current environment");{let i=(hy(),cr(Tf)).init;t==="webgpu"&&await i("webgpu",_e(),e,r),t==="webnn"&&await i("webnn",_e(),e)}},mt=new Map,Zd=e=>{let t=_e(),r=t.stackSave();try{let i=t.PTR_SIZE,a=t.stackAlloc(2*i);t._OrtGetInputOutputCount(e,a,a+i)!==0&&fe("Can't get session input/output count.");let n=i===4?"i32":"i64";return[Number(t.getValue(a,n)),Number(t.getValue(a+i,n))]}finally{t.stackRestore(r)}},$a=(e,t)=>{let r=_e(),i=r.stackSave(),a=0;try{let n=r.PTR_SIZE,s=r.stackAlloc(2*n);r._OrtGetInputOutputMetadata(e,t,s,s+n)!==0&&fe("Can't get session input/output metadata.");let u=Number(r.getValue(s,"*"));a=Number(r.getValue(s+n,"*"));let l=r.HEAP32[a/4];if(l===0)return[u,0];let p=r.HEAPU32[a/4+1],c=[];for(let h=0;h<p;h++){let g=Number(r.getValue(a+8+h*n,"*"));c.push(g!==0?r.UTF8ToString(g):Number(r.getValue(a+8+(h+p)*n,"*")))}return[u,l,c]}finally{r.stackRestore(i),a!==0&&r._OrtFree(a)}},Yr=e=>{let t=_e(),r=t._malloc(e.byteLength);if(r===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,r),[r,e.byteLength]},cn=async(e,t)=>{let r,i,a=_e();Array.isArray(e)?[r,i]=e:e.buffer===a.HEAPU8.buffer?[r,i]=[e.byteOffset,e.byteLength]:[r,i]=Yr(e);let n=0,s=0,u=0,l=[],p=[],c=[];try{if([s,l]=await Ip(t),t?.externalData&&a.mountExternalData){let k=[];for(let T of t.externalData){let z=typeof T=="string"?T:T.path,C=typeof T=="string"?T:T.data;k.push(Xa(C).then(v=>{a.mountExternalData(z,v)}))}await Promise.all(k)}for(let k of t?.executionProviders??[])if((typeof k=="string"?k:k.name)==="webnn"){if(a.shouldTransferToMLTensor=!1,typeof k!="string"){let T=k,z=T?.context,C=T?.gpuDevice,v=T?.deviceType,N=T?.powerPreference;z?a.currentContext=z:C?a.currentContext=await a.webnnCreateMLContext(C):a.currentContext=await a.webnnCreateMLContext({deviceType:v,powerPreference:N})}else a.currentContext=await a.webnnCreateMLContext();break}n=await a._OrtCreateSession(r,i,s),a.webgpuOnCreateSession?.(n),n===0&&fe("Can't create a session."),a.jsepOnCreateSession?.(),a.currentContext&&(a.webnnRegisterMLContext(n,a.currentContext),a.currentContext=void 0,a.shouldTransferToMLTensor=!0);let[h,g]=Zd(n),_=!!t?.enableGraphCapture,y=[],w=[],S=[],x=[],b=[];for(let k=0;k<h;k++){let[T,z,C]=$a(n,k);T===0&&fe("Can't get an input name."),p.push(T);let v=a.UTF8ToString(T);y.push(v),S.push(z===0?{name:v,isTensor:!1}:{name:v,isTensor:!0,type:st(z),shape:C})}for(let k=0;k<g;k++){let[T,z,C]=$a(n,k+h);T===0&&fe("Can't get an output name."),c.push(T);let v=a.UTF8ToString(T);w.push(v),x.push(z===0?{name:v,isTensor:!1}:{name:v,isTensor:!0,type:st(z),shape:C});{if(_&&t?.preferredOutputLocation===void 0){b.push("gpu-buffer");continue}let N=typeof t?.preferredOutputLocation=="string"?t.preferredOutputLocation:t?.preferredOutputLocation?.[v]??"cpu",P=a.webnnIsGraphOutput;if(N==="cpu"&&P&&P(n,v)){b.push("ml-tensor-cpu-output");continue}if(N!=="cpu"&&N!=="cpu-pinned"&&N!=="gpu-buffer"&&N!=="ml-tensor")throw new Error(`Not supported preferred output location: ${N}.`);if(_&&N!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${N}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);b.push(N)}}let I=null;return b.some(k=>k==="gpu-buffer"||k==="ml-tensor"||k==="ml-tensor-cpu-output")&&(u=a._OrtCreateBinding(n),u===0&&fe("Can't create IO binding."),I={handle:u,outputPreferredLocations:b,outputPreferredLocationsEncoded:b.map(k=>k==="ml-tensor-cpu-output"?"ml-tensor":k).map(k=>Ea(k))}),mt.set(n,[n,p,c,I,_,!1]),[n,y,w,S,x]}catch(h){throw p.forEach(g=>a._OrtFree(g)),c.forEach(g=>a._OrtFree(g)),u!==0&&a._OrtReleaseBinding(u)!==0&&fe("Can't release IO binding."),n!==0&&a._OrtReleaseSession(n)!==0&&fe("Can't release session."),h}finally{a._free(r),s!==0&&a._OrtReleaseSessionOptions(s)!==0&&fe("Can't release session options."),l.forEach(h=>a._free(h)),a.unmountExternalData?.()}},hn=e=>{let t=_e(),r=mt.get(e);if(!r)throw new Error(`cannot release session. invalid session id: ${e}`);let[i,a,n,s,u]=r;s&&(u&&t._OrtClearBoundOutputs(s.handle)!==0&&fe("Can't clear bound outputs."),t._OrtReleaseBinding(s.handle)!==0&&fe("Can't release IO binding.")),t.jsepOnReleaseSession?.(e),t.webnnOnReleaseSession?.(e),t.webgpuOnReleaseSession?.(e),a.forEach(l=>t._OrtFree(l)),n.forEach(l=>t._OrtFree(l)),t._OrtReleaseSession(i)!==0&&fe("Can't release session."),mt.delete(e)},va=async(e,t,r,i,a,n,s=!1)=>{if(!e){t.push(0);return}let u=_e(),l=u.PTR_SIZE,p=e[0],c=e[1],h=e[3],g=h,_,y;if(p==="string"&&(h==="gpu-buffer"||h==="ml-tensor"))throw new Error("String tensor is not supported on GPU.");if(s&&h!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${n} when enableGraphCapture is true.`);if(h==="gpu-buffer"){let x=e[2].gpuBuffer;y=At(Ct(p),c);{let b=u.jsepRegisterBuffer;if(!b)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');_=b(i,n,x,y)}}else if(h==="ml-tensor"){let x=e[2].mlTensor;y=At(Ct(p),c);let b=u.webnnRegisterMLTensor;if(!b)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');_=b(i,x,Ct(p),c)}else{let x=e[2];if(Array.isArray(x)){y=l*x.length,_=u._malloc(y),r.push(_);for(let b=0;b<x.length;b++){if(typeof x[b]!="string")throw new TypeError(`tensor data at index ${b} is not a string`);u.setValue(_+b*l,Ke(x[b],r),"*")}}else{let b=u.webnnIsGraphInput,I=u.webnnIsGraphOutput;if(p!=="string"&&b&&I){let k=u.UTF8ToString(a);if(b(i,k)||I(i,k)){let T=Ct(p);y=At(T,c),g="ml-tensor";let z=u.webnnCreateTemporaryTensor,C=u.webnnUploadTensor;if(!z||!C)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let v=await z(i,T,c);C(v,new Uint8Array(x.buffer,x.byteOffset,x.byteLength)),_=v}else y=x.byteLength,_=u._malloc(y),r.push(_),u.HEAPU8.set(new Uint8Array(x.buffer,x.byteOffset,y),_)}else y=x.byteLength,_=u._malloc(y),r.push(_),u.HEAPU8.set(new Uint8Array(x.buffer,x.byteOffset,y),_)}}let w=u.stackSave(),S=u.stackAlloc(4*c.length);try{c.forEach((b,I)=>u.setValue(S+I*l,b,l===4?"i32":"i64"));let x=u._OrtCreateTensor(Ct(p),_,y,S,c.length,Ea(g));x===0&&fe(`Can't create tensor for input/output. session=${i}, index=${n}.`),t.push(x)}finally{u.stackRestore(w)}},fn=async(e,t,r,i,a,n)=>{let s=_e(),u=s.PTR_SIZE,l=mt.get(e);if(!l)throw new Error(`cannot run inference. invalid session id: ${e}`);let p=l[0],c=l[1],h=l[2],g=l[3],_=l[4],y=l[5],w=t.length,S=i.length,x=0,b=[],I=[],k=[],T=[],z=[],C=s.stackSave(),v=s.stackAlloc(w*u),N=s.stackAlloc(w*u),P=s.stackAlloc(S*u),F=s.stackAlloc(S*u);try{[x,b]=Tp(n),Ot("wasm prepareInputOutputTensor");for(let D=0;D<w;D++)await va(r[D],I,T,e,c[t[D]],t[D],_);for(let D=0;D<S;D++)await va(a[D],k,T,e,h[i[D]],w+i[D],_);Bt("wasm prepareInputOutputTensor");for(let D=0;D<w;D++)s.setValue(v+D*u,I[D],"*"),s.setValue(N+D*u,c[t[D]],"*");for(let D=0;D<S;D++)s.setValue(P+D*u,k[D],"*"),s.setValue(F+D*u,h[i[D]],"*");if(g&&!y){let{handle:D,outputPreferredLocations:H,outputPreferredLocationsEncoded:Q}=g;if(c.length!==w)throw new Error(`input count from feeds (${w}) is expected to be always equal to model's input count (${c.length}).`);Ot("wasm bindInputsOutputs");for(let J=0;J<w;J++){let te=t[J];await s._OrtBindInput(D,c[te],I[J])!==0&&fe(`Can't bind input[${J}] for session=${e}.`)}for(let J=0;J<S;J++){let te=i[J];a[J]?.[3]?(z.push(k[J]),s._OrtBindOutput(D,h[te],k[J],0)!==0&&fe(`Can't bind pre-allocated output[${J}] for session=${e}.`)):s._OrtBindOutput(D,h[te],0,Q[te])!==0&&fe(`Can't bind output[${J}] to ${H[J]} for session=${e}.`)}Bt("wasm bindInputsOutputs"),mt.set(e,[p,c,h,g,_,!0])}s.jsepOnRunStart?.(p),s.webnnOnRunStart?.(p);let W;g?W=await s._OrtRunWithBinding(p,g.handle,S,P,x):W=await s._OrtRun(p,N,v,w,F,S,P,x),W!==0&&fe("failed to call OrtRun().");let K=[],B=[];Ot("wasm ProcessOutputTensor");for(let D=0;D<S;D++){let H=Number(s.getValue(P+D*u,"*"));if(H===k[D]||z.includes(k[D])){K.push(a[D]),H!==k[D]&&s._OrtReleaseTensor(H)!==0&&fe("Can't release tensor.");continue}let Q=s.stackSave(),J=s.stackAlloc(4*u),te=!1,ne,U=0;try{s._OrtGetTensorData(H,J,J+u,J+2*u,J+3*u)!==0&&fe(`Can't access output tensor data on index ${D}.`);let ee=u===4?"i32":"i64",Y=Number(s.getValue(J,ee));U=s.getValue(J+u,"*");let G=s.getValue(J+u*2,"*"),Te=Number(s.getValue(J+u*3,ee)),Ae=[];for(let me=0;me<Te;me++)Ae.push(Number(s.getValue(G+me*u,ee)));s._OrtFree(G)!==0&&fe("Can't free memory for tensor dims.");let ve=Ae.reduce((me,we)=>me*we,1);ne=st(Y);let Oe=g?.outputPreferredLocations[i[D]];if(ne==="string"){if(Oe==="gpu-buffer"||Oe==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let me=[];for(let we=0;we<ve;we++){let Be=s.getValue(U+we*u,"*"),mr=s.getValue(U+(we+1)*u,"*"),Xe=we===ve-1?void 0:mr-Be;me.push(s.UTF8ToString(Be,Xe))}K.push([ne,Ae,me,"cpu"])}else if(Oe==="gpu-buffer"&&ve>0){let me=s.jsepGetBuffer;if(!me)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let we=me(U),Be=At(Y,ve);if(Be===void 0||!Ka(ne))throw new Error(`Unsupported data type: ${ne}`);te=!0,K.push([ne,Ae,{gpuBuffer:we,download:s.jsepCreateDownloader(we,Be,ne),dispose:()=>{s._OrtReleaseTensor(H)!==0&&fe("Can't release tensor.")}},"gpu-buffer"])}else if(Oe==="ml-tensor"&&ve>0){let me=s.webnnEnsureTensor,we=s.webnnIsGraphInputOutputTypeSupported;if(!me||!we)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(At(Y,ve)===void 0||!Za(ne))throw new Error(`Unsupported data type: ${ne}`);if(!we(e,ne,!1))throw new Error(`preferredLocation "ml-tensor" for ${ne} output is not supported by current WebNN Context.`);let Be=await me(e,U,Y,Ae,!1);te=!0,K.push([ne,Ae,{mlTensor:Be,download:s.webnnCreateMLTensorDownloader(U,ne),dispose:()=>{s.webnnReleaseTensorId(U),s._OrtReleaseTensor(H)}},"ml-tensor"])}else if(Oe==="ml-tensor-cpu-output"&&ve>0){let me=s.webnnCreateMLTensorDownloader(U,ne)(),we=K.length;te=!0,B.push((async()=>{let Be=[we,await me];return s.webnnReleaseTensorId(U),s._OrtReleaseTensor(H),Be})()),K.push([ne,Ae,[],"cpu"])}else{let me=Jr(ne),we=new me(ve);new Uint8Array(we.buffer,we.byteOffset,we.byteLength).set(s.HEAPU8.subarray(U,U+we.byteLength)),K.push([ne,Ae,we,"cpu"])}}finally{s.stackRestore(Q),ne==="string"&&U&&s._free(U),te||s._OrtReleaseTensor(H)}}g&&!_&&(s._OrtClearBoundOutputs(g.handle)!==0&&fe("Can't clear bound outputs."),mt.set(e,[p,c,h,g,_,!1]));for(let[D,H]of await Promise.all(B))K[D][2]=H;return Bt("wasm ProcessOutputTensor"),K}finally{s.webnnOnRunEnd?.(p),s.stackRestore(C),I.forEach(W=>s._OrtReleaseTensor(W)),k.forEach(W=>s._OrtReleaseTensor(W)),T.forEach(W=>s._free(W)),x!==0&&s._OrtReleaseRunOptions(x),b.forEach(W=>s._free(W))}},mn=e=>{let t=_e(),r=mt.get(e);if(!r)throw new Error("invalid session id");let i=r[0],a=t._OrtEndProfiling(i);a===0&&fe("Can't get an profile file name."),t._OrtFree(a)},gn=e=>{let t=[];for(let r of e){let i=r[2];!Array.isArray(i)&&"buffer"in i&&t.push(i.buffer)}return t}}),gt,Pe,Lt,sr,or,qr,xa,Lr,Tt,It,Xd,Cf,Af,Of,Bf,Rf,Mf,Nf,Df=q(()=>{"use strict";Le(),zf(),Dt(),Ha(),gt=()=>!!ge.wasm.proxy&&typeof document<"u",Lt=!1,sr=!1,or=!1,Lr=new Map,Tt=(e,t)=>{let r=Lr.get(e);r?r.push(t):Lr.set(e,[t])},It=()=>{if(Lt||!sr||or||!Pe)throw new Error("worker not ready")},Xd=e=>{switch(e.data.type){case"init-wasm":Lt=!1,e.data.err?(or=!0,xa[1](e.data.err)):(sr=!0,xa[0]()),qr&&(URL.revokeObjectURL(qr),qr=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=Lr.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}default:}},Cf=async()=>{if(!sr){if(Lt)throw new Error("multiple calls to 'initWasm()' detected.");if(or)throw new Error("previous call to 'initWasm()' failed.");if(Lt=!0,gt())return new Promise((e,t)=>{Pe?.terminate(),Sp().then(([r,i])=>{try{Pe=i,Pe.onerror=n=>t(n),Pe.onmessage=Xd,xa=[e,t];let a={type:"init-wasm",in:ge};!a.in.wasm.wasmPaths&&(r||Ia)&&(a.in.wasm.wasmPaths={wasm:new URL("/assets/ort-wasm-simd-threaded.jsep.wasm",import.meta.url).href}),Pe.postMessage(a),qr=r}catch(a){t(a)}},t)});try{await Fa(ge.wasm),await dn(ge),sr=!0}catch(e){throw or=!0,e}finally{Lt=!1}}},Af=async e=>{if(gt())return It(),new Promise((t,r)=>{Tt("init-ep",[t,r]);let i={type:"init-ep",in:{epName:e,env:ge}};Pe.postMessage(i)});await pn(ge,e)},Of=async e=>gt()?(It(),new Promise((t,r)=>{Tt("copy-from",[t,r]);let i={type:"copy-from",in:{buffer:e}};Pe.postMessage(i,[e.buffer])})):Yr(e),Bf=async(e,t)=>{if(gt()){if(t?.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return It(),new Promise((r,i)=>{Tt("create",[r,i]);let a={type:"create",in:{model:e,options:{...t}}},n=[];e instanceof Uint8Array&&n.push(e.buffer),Pe.postMessage(a,n)})}else return cn(e,t)},Rf=async e=>{if(gt())return It(),new Promise((t,r)=>{Tt("release",[t,r]);let i={type:"release",in:e};Pe.postMessage(i)});hn(e)},Mf=async(e,t,r,i,a,n)=>{if(gt()){if(r.some(s=>s[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(a.some(s=>s))throw new Error("pre-allocated output tensor is not supported for proxy.");return It(),new Promise((s,u)=>{Tt("run",[s,u]);let l=r,p={type:"run",in:{sessionId:e,inputIndices:t,inputs:l,outputIndices:i,options:n}};Pe.postMessage(p,gn(l))})}else return fn(e,t,r,i,a,n)},Nf=async e=>{if(gt())return It(),new Promise((t,r)=>{Tt("end-profiling",[t,r]);let i={type:"end-profiling",in:e};Pe.postMessage(i)});mn(e)}}),Sa,Qd,Uf,fy=q(()=>{"use strict";Le(),Df(),re(),Ga(),Ep(),Sa=(e,t)=>{switch(e.location){case"cpu":return[e.type,e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[e.type,e.dims,{mlTensor:e.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${e.location} for ${t()}`)}},Qd=e=>{switch(e[3]){case"cpu":return new qe(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!Ka(t))throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:r,download:i,dispose:a}=e[2];return qe.fromGpuBuffer(r,{dataType:t,dims:e[1],download:i,dispose:a})}case"ml-tensor":{let t=e[0];if(!Za(t))throw new Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:r,download:i,dispose:a}=e[2];return qe.fromMLTensor(r,{dataType:t,dims:e[1],download:i,dispose:a})}default:throw new Error(`invalid data location: ${e[3]}`)}},Uf=class{async fetchModelAndCopyToWasmMemory(e){return Of(await Xa(e))}async loadModel(e,t){tt();let r;typeof e=="string"?r=await this.fetchModelAndCopyToWasmMemory(e):r=e,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await Bf(r,t),Ze()}async dispose(){return Rf(this.sessionId)}async run(e,t,r){tt();let i=[],a=[];Object.entries(e).forEach(h=>{let g=h[0],_=h[1],y=this.inputNames.indexOf(g);if(y===-1)throw new Error(`invalid input '${g}'`);i.push(_),a.push(y)});let n=[],s=[];Object.entries(t).forEach(h=>{let g=h[0],_=h[1],y=this.outputNames.indexOf(g);if(y===-1)throw new Error(`invalid output '${g}'`);n.push(_),s.push(y)});let u=i.map((h,g)=>Sa(h,()=>`input "${this.inputNames[a[g]]}"`)),l=n.map((h,g)=>h?Sa(h,()=>`output "${this.outputNames[s[g]]}"`):null),p=await Mf(this.sessionId,a,u,s,l,r),c={};for(let h=0;h<p.length;h++)c[this.outputNames[s[h]]]=n[h]??Qd(p[h]);return Ze(),c}startProfiling(){}endProfiling(){Nf(this.sessionId)}}}),Pf={};Ft(Pf,{OnnxruntimeWebAssemblyBackend:()=>La,initializeFlags:()=>qa,wasmBackend:()=>qf});var qa,La,qf,my=q(()=>{"use strict";Le(),Df(),fy(),qa=()=>{(typeof ge.wasm.initTimeout!="number"||ge.wasm.initTimeout<0)&&(ge.wasm.initTimeout=0);let e=ge.wasm.simd;if(typeof e!="boolean"&&e!==void 0&&e!=="fixed"&&e!=="relaxed"&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` and ignore SIMD feature checking.`),ge.wasm.simd=!1),typeof ge.wasm.proxy!="boolean"&&(ge.wasm.proxy=!1),typeof ge.wasm.trace!="boolean"&&(ge.wasm.trace=!1),typeof ge.wasm.numThreads!="number"||!Number.isInteger(ge.wasm.numThreads)||ge.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)ge.wasm.numThreads=1;else{let t=typeof navigator>"u"?Jg("node:os").cpus().length:navigator.hardwareConcurrency;ge.wasm.numThreads=Math.min(4,Math.ceil((t||1)/2))}},La=class{async init(e){qa(),await Cf(),await Af(e)}async createInferenceSessionHandler(e,t){let r=new Uf;return await r.loadModel(e,t),r}},qf=new La});Le();Le();Le();var gy="1.30.0";{let e=(my(),cr(Pf)).wasmBackend;Wt("webgpu",e,5),Wt("webnn",e,5),Wt("cpu",e,10),Wt("wasm",e,10)}Object.defineProperty(ge.versions,"web",{value:gy,enumerable:!0});/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*//**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 *//**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Gr{static calculateDetResize(t,r){let i=1;t>1120?i=1120/t:t<800&&(i=Math.min(1.5,960/t)),r*i>3840&&(i=3840/r);let a=Math.round(t*i),n=Math.round(r*i);return a=Math.max(32,Math.round(a/32)*32),n=Math.max(32,Math.round(n/32)*32),{targetW:a,targetH:n,ratioW:a/t,ratioH:n/r}}static imageToDetTensor(t,r,i){const a=[.485,.456,.406],n=[.229,.224,.225],s=new Float32Array(3*i*r),u=t.data,l=i*r;for(let p=0;p<i;p++)for(let c=0;c<r;c++){const h=(p*r+c)*4,g=p*r+c,_=(u[h]/255-a[0])/n[0],y=(u[h+1]/255-a[1])/n[1],w=(u[h+2]/255-a[2])/n[2];s[g]=_,s[g+l]=y,s[g+l*2]=w}return new qe("float32",s,[1,3,i,r])}static imageToRecTensor(t,r,i){const a=new Float32Array(3*i*r),n=t.data,s=i*r;for(let u=0;u<i;u++)for(let l=0;l<r;l++){const p=(u*r+l)*4,c=u*r+l,h=(n[p]/255-.5)/.5,g=(n[p+1]/255-.5)/.5,_=(n[p+2]/255-.5)/.5;a[c]=h,a[c+s]=g,a[c+s*2]=_}return new qe("float32",a,[1,3,i,r])}static clampBox(t,r,i){const a=Math.max(0,Math.min(t.x,r-1)),n=Math.max(0,Math.min(t.y,i-1)),s=Math.max(1,Math.min(t.width,r-a)),u=Math.max(1,Math.min(t.height,i-n));return{x:a,y:n,width:s,height:u,confidence:t.confidence}}}class yy{session;thresh=.1;boxThresh=.15;unclipRatio=1.65;constructor(t){this.session=t}async detectText(t,r,i){const{targetW:a,targetH:n,ratioW:s,ratioH:u}=Gr.calculateDetResize(r,i),p=new OffscreenCanvas(a,n).getContext("2d");if(!p)throw new Error("Khong the khoi tao OffscreenCanvas 2D context");p.drawImage(t,0,0,a,n);const c=p.getImageData(0,0,a,n),h=Gr.imageToDetTensor(c,a,n),g={},_=this.session.inputNames[0]||"x";g[_]=h;const y=await this.session.run(g),w=this.session.outputNames[0],x=y[w].data,b=this.extractBoxes(x,a,n),I=[];for(const T of b){if(T.confidence&&T.confidence<this.boxThresh)continue;const z=T.width*T.height,C=2*(T.width+T.height),v=Math.max(3,Math.min(18,z*this.unclipRatio/Math.max(1,C))),N=T.x+T.width/2,P=T.y+T.height/2,F=T.width+v*2,W=T.height+v*2,K=Math.round((N-F/2)/s),B=Math.round((P-W/2)/u),D=Math.round(F/s),H=Math.round(W/u),Q=Gr.clampBox({x:K,y:B,width:D,height:H,confidence:T.confidence},r,i),J=Q.width<8||Q.height<8,te=Q.width>=r*.98&&Q.height>=i*.94;!J&&!te&&I.push(Q)}return this.mergeHorizontalBoxes(I,r).sort((T,z)=>T.y-z.y)}mergeHorizontalBoxes(t,r){if(t.length<=1)return t;let i=[...t],a=!0;for(;a;){a=!1;const n=[],s=new Set;for(let u=0;u<i.length;u++){if(s.has(u))continue;let l={...i[u]};for(let p=u+1;p<i.length;p++){if(s.has(p))continue;const c=i[p],h=l.y,g=l.y+l.height,_=c.y,y=c.y+c.height,w=Math.max(0,Math.min(g,y)-Math.max(h,_)),S=Math.min(l.height,c.height);if(w/Math.max(1,S)>=.4){const b=l.x,I=l.x+l.width,k=c.x,T=c.x+c.width,z=Math.max(0,Math.max(b,k)-Math.min(I,T)),C=Math.max(l.height,c.height)*2.2,v=Math.min(b,k),P=Math.max(I,T)-v;if(z<=C&&P<=r*.96){const F=Math.min(h,_),W=Math.max(g,y);l={x:v,y:F,width:P,height:W-F,confidence:Math.max(l.confidence||0,c.confidence||0)},s.add(p),a=!0}}}n.push(l)}i=n}return i}extractBoxes(t,r,i){const a=new Uint8Array(r*i),n=[];for(let s=0;s<i;s++)for(let u=0;u<r;u++){const l=s*r+u;if(a[l]||t[l]<this.thresh)continue;let p=u,c=u,h=s,g=s,_=0,y=0;const w=[l];for(a[l]=1;w.length>0;){const b=w.pop(),I=Math.floor(b/r),k=b%r;_+=t[b],y++,k<p&&(p=k),k>c&&(c=k),I<h&&(h=I),I>g&&(g=I);const T=[I>0?(I-1)*r+k:-1,I<i-1?(I+1)*r+k:-1,k>0?I*r+(k-1):-1,k<r-1?I*r+(k+1):-1];for(const z of T)z>=0&&!a[z]&&t[z]>=this.thresh&&(a[z]=1,w.push(z))}const S=c-p+1,x=g-h+1;S>=5&&x>=5&&y>=6&&n.push({x:p,y:h,width:S,height:x,confidence:_/y})}return n}}class _y{session;characters;targetH=48;constructor(t,r){this.session=t,this.characters=r.split(/\r?\n/),this.characters.length>0&&(this.characters[this.characters.length-1]=" ")}async recognizeBoxes(t,r){const i=[];if(!t.getContext("2d"))return[];let n=0;for(const s of r){n++;const u=2,l=1,p=Math.max(0,s.x-u),c=Math.max(0,s.y-l),h=Math.max(1,Math.min(t.width-p,s.width+u*2)),g=Math.max(1,Math.min(t.height-c,s.height+l*2)),_=h/g;let y=Math.max(32,Math.min(960,Math.round(this.targetH*_)));y=Math.round(y/8)*8;const S=new OffscreenCanvas(y,this.targetH).getContext("2d");if(!S)continue;S.drawImage(t,p,c,h,g,0,0,y,this.targetH);const x=S.getImageData(0,0,y,this.targetH),b=this.detectDarkBackground(x),I=Gr.imageToRecTensor(x,y,this.targetH),T={[this.session.inputNames[0]||"x"]:I};try{const z=await this.session.run(T),C=this.session.outputNames[0],v=z[C],{text:N,confidence:P}=this.ctcDecode(v.data,v.dims),F=N.replace(/\s+/g," ").trim(),W=/[\p{L}\p{N}]/u.test(F);F.length>0&&W&&P>.28&&i.push({id:`bubble-${Date.now()}-${n}`,box:s,originalText:F,isDarkBackground:b})}catch(z){console.warn("[SpeedySlate] Rec inference error for box:",z)}}return i}detectDarkBackground(t){const r=t.data,i=t.width,a=t.height;if(i<=0||a<=0)return!1;let n=0,s=0;for(let l=0;l<i;l+=3){const p=(0*i+l)*4;n+=.299*r[p]+.587*r[p+1]+.114*r[p+2];const c=((a-1)*i+l)*4;n+=.299*r[c]+.587*r[c+1]+.114*r[c+2],s+=2}for(let l=1;l<a-1;l+=2){const p=(l*i+0)*4;n+=.299*r[p]+.587*r[p+1]+.114*r[p+2];const c=(l*i+(i-1))*4;n+=.299*r[c]+.587*r[c+1]+.114*r[c+2],s+=2}return(s>0?n/s:255)<105}ctcDecode(t,r){let i=0,a=0;if(r.length===3)i=r[1],a=r[2];else return{text:"",confidence:0};let n=[],s=-1,u=0,l=0;for(let c=0;c<i;c++){let h=-1/0,g=0;const _=c*a;for(let y=0;y<a;y++){const w=t[_+y];w>h&&(h=w,g=y)}if(g!==0&&g!==s){const y=g-1;y<this.characters.length&&(n.push(this.characters[y]),u+=h,l++)}s=g}const p=l>0?u/l:0;return{text:n.join(""),confidence:p}}}const by=self.location.href.substring(0,self.location.href.lastIndexOf("/")+1);ge.wasm.wasmPaths=by;ge.wasm.numThreads=2;ge.wasm.simd=!0;ge.logLevel="error";let ka=null,Ta=null,Yd=null,Et="wasm",Jd=Promise.resolve();async function ep(e,t){try{return await hr.create(e,{...t,executionProviders:["webgpu"]})}catch(r){return console.warn("[OCR Worker] WebGPU session creation failed, will fallback to WASM:",r?.message),null}}self.onmessage=e=>{const t=e.data,r=t._reqId,i=a=>self.postMessage({...a,_reqId:r});Jd=Jd.then(async()=>{try{switch(t.type){case"PING":{i({type:"PONG",success:!0});break}case"INIT_MODEL":{if(!t.detBuffer||!t.recBuffer||!t.keysText)throw new Error("Thiếu dữ liệu buffer hoặc keys để khởi tạo model.");const a={graphOptimizationLevel:"all",logSeverityLevel:3};let n=null,s=null;if(t.useWebGpu!==!1)try{const[u,l]=await Promise.all([ep(t.detBuffer,a),ep(t.recBuffer,a)]);u&&l?(n=u,s=l,Et="webgpu"):(u?.release?.(),l?.release?.(),Et="wasm")}catch{Et="wasm"}else Et="wasm";if(Et==="wasm"||!n||!s){const u={...a,executionProviders:["wasm"]};[n,s]=await Promise.all([hr.create(t.detBuffer,u),hr.create(t.recBuffer,u)]),Et="wasm"}ka=new yy(n),Ta=new _y(s,t.keysText),Yd=t.modelId||"loaded",i({type:"INIT_RESULT",success:!0,modelId:Yd,backend:Et});break}case"PROCESS_IMAGE":{if(!ka||!Ta)throw new Error("Model PaddleOCR chưa được nạp. Hãy khởi tạo trước khi nhận diện.");if(!t.imageBitmap)throw new Error("Thiếu ImageBitmap cần nhận diện.");const a=t.imageBitmap;try{const n=a.width,s=a.height,u=new OffscreenCanvas(n,s),l=u.getContext("2d");if(!l)throw new Error("Không thể tạo 2D context trong Worker");l.drawImage(a,0,0);const p=await ka.detectText(u,n,s),c=await Ta.recognizeBoxes(u,p);i({type:"PROCESS_RESULT",success:!0,elementId:t.elementId,dialogues:c})}finally{a.close()}break}default:throw new Error(`Thông điệp worker không hỗ trợ: ${t.type}`)}}catch(a){console.error("[OCR Worker] Processing error:",a),i({type:"ERROR",success:!1,elementId:t.elementId,error:`${a?.message||"Lỗi không xác định trong Web Worker"}${a?.stack?`
`+a.stack:""}`})}}).catch(a=>{console.error("[OCR Worker] Fatal queue error:",a),i({type:"ERROR",success:!1,error:`Fatal queue error: ${a?.message||a}`})})};self.addEventListener("error",e=>{console.error("[OCR Worker] Global error:",e),self.postMessage({type:"ERROR",success:!1,error:`Worker GlobalError: ${e.message||String(e)}`})});self.addEventListener("unhandledrejection",e=>{console.error("[OCR Worker] Unhandled rejection:",e),self.postMessage({type:"ERROR",success:!1,error:`Worker UnhandledRejection: ${e.reason?.message||String(e.reason)}`})});
