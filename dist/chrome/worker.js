import{V as wo,B as l0}from"./assets/bubble-aggregator.js";/*!
 * ONNX Runtime Web v1.30.0
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */var ta=Object.defineProperty,d0=Object.getOwnPropertyDescriptor,c0=Object.getOwnPropertyNames,p0=Object.prototype.hasOwnProperty,h0=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),K=(e,t,r)=>()=>{if(r)throw r[0];try{return e&&(t=e(e=0)),t}catch(i){throw r=[i],i}},tr=(e,t)=>{for(var r in t)ta(e,r,{get:t[r],enumerable:!0})},f0=(e,t,r,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of c0(t))!p0.call(e,n)&&n!==r&&ta(e,n,{get:()=>t[n],enumerable:!(i=d0(t,n))||i.enumerable});return e},vr=e=>f0(ta({},"__esModule",{value:!0}),e),ar,wt,Xt,$o,fc,mc=K(()=>{"use strict";ar=new Map,wt=[],Xt=(e,t,r)=>{if(t&&typeof t.init=="function"&&typeof t.createInferenceSessionHandler=="function"){let i=ar.get(e);if(i===void 0)ar.set(e,{backend:t,priority:r});else{if(i.priority>r)return;if(i.priority===r&&i.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${r}`)}if(r>=0){let n=wt.indexOf(e);n!==-1&&wt.splice(n,1);for(let a=0;a<wt.length;a++)if(ar.get(wt[a]).priority<=r){wt.splice(a,0,e);return}wt.push(e)}return}throw new TypeError("not a valid backend")},$o=async e=>{let t=ar.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;if(t.aborted)return t.error;{let r=!!t.initPromise;try{return r||(t.initPromise=t.backend.init(e)),await t.initPromise,t.initialized=!0,t.backend}catch(i){return r||(t.error=`${i}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},fc=async e=>{let t=e.executionProviders||[],r=t.map(l=>typeof l=="string"?l:l.name),i=r.length===0?wt:r,n,a=[],s=new Set;for(let l of i){let d=await $o(l);typeof d=="string"?a.push({name:l,err:d}):(n||(n=d),n===d&&s.add(l))}if(!n)throw new Error(`no available backend found. ERR: ${a.map(l=>`[${l.name}] ${l.err}`).join(", ")}`);for(let{name:l,err:d}of a)r.includes(l)&&console.warn(`removing requested execution provider "${l}" from session options because it is not available: ${d}`);let o=t.filter(l=>s.has(typeof l=="string"?l:l.name));return[n,new Proxy(e,{get:(l,d)=>d==="executionProviders"?o:Reflect.get(l,d)})]}}),m0=K(()=>{"use strict";mc()}),gc,g0=K(()=>{"use strict";gc="1.30.0"}),Oi,Ue,yc=K(()=>{"use strict";g0(),Oi="warning",Ue={wasm:{},webgl:{},webgpu:{},versions:{common:gc},set logLevel(e){if(e!==void 0){if(typeof e!="string"||["verbose","info","warning","error","fatal"].indexOf(e)===-1)throw new Error(`Unsupported logging level: ${e}`);Oi=e}},get logLevel(){return Oi}},Object.defineProperty(Ue,"logLevel",{enumerable:!0})}),Ee,y0=K(()=>{"use strict";yc(),Ee=Ue}),_c,bc,_0=K(()=>{"use strict";_c=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);r.width=e.dims[3],r.height=e.dims[2];let i=r.getContext("2d");if(i!=null){let n,a;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(n=e.dims[2],a=e.dims[3]):(n=e.dims[3],a=e.dims[2]);let s=t?.format!==void 0?t.format:"RGB",o=t?.norm,l,d;o===void 0||o.mean===void 0?l=[255,255,255,255]:typeof o.mean=="number"?l=[o.mean,o.mean,o.mean,o.mean]:(l=[o.mean[0],o.mean[1],o.mean[2],0],o.mean[3]!==void 0&&(l[3]=o.mean[3])),o===void 0||o.bias===void 0?d=[0,0,0,0]:typeof o.bias=="number"?d=[o.bias,o.bias,o.bias,o.bias]:(d=[o.bias[0],o.bias[1],o.bias[2],0],o.bias[3]!==void 0&&(d[3]=o.bias[3]));let h=a*n,p=0,f=h,_=h*2,m=-1;s==="RGBA"?(p=0,f=h,_=h*2,m=h*3):s==="RGB"?(p=0,f=h,_=h*2):s==="RBG"&&(p=0,_=h,f=h*2);for(let w=0;w<a;w++)for(let x=0;x<n;x++){let $=(e.data[p++]-d[0])*l[0],b=(e.data[f++]-d[1])*l[1],S=(e.data[_++]-d[2])*l[2],I=m===-1?255:(e.data[m++]-d[3])*l[3];i.fillStyle="rgba("+$+","+b+","+S+","+I+")",i.fillRect(x,w,1,1)}if("toDataURL"in r)return r.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},bc=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),i;if(r!=null){let n,a,s;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(n=e.dims[2],a=e.dims[1],s=e.dims[3]):(n=e.dims[3],a=e.dims[2],s=e.dims[1]);let o=t!==void 0&&t.format!==void 0?t.format:"RGB",l=t?.norm,d,h;l===void 0||l.mean===void 0?d=[255,255,255,255]:typeof l.mean=="number"?d=[l.mean,l.mean,l.mean,l.mean]:(d=[l.mean[0],l.mean[1],l.mean[2],255],l.mean[3]!==void 0&&(d[3]=l.mean[3])),l===void 0||l.bias===void 0?h=[0,0,0,0]:typeof l.bias=="number"?h=[l.bias,l.bias,l.bias,l.bias]:(h=[l.bias[0],l.bias[1],l.bias[2],0],l.bias[3]!==void 0&&(h[3]=l.bias[3]));let p=a*n;if(t!==void 0&&(t.format!==void 0&&s===4&&t.format!=="RGBA"||s===3&&t.format!=="RGB"&&t.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let f=4,_=0,m=1,w=2,x=3,$=0,b=p,S=p*2,I=-1;o==="RGBA"?($=0,b=p,S=p*2,I=p*3):o==="RGB"?($=0,b=p,S=p*2):o==="RBG"&&($=0,S=p,b=p*2),i=r.createImageData(n,a);for(let T=0;T<a*n;_+=f,m+=f,w+=f,x+=f,T++)i.data[_]=(e.data[$++]-h[0])*d[0],i.data[m]=(e.data[b++]-h[1])*d[1],i.data[w]=(e.data[S++]-h[2])*d[2],i.data[x]=I===-1?255:(e.data[I++]-h[3])*d[3]}else throw new Error("Can not access image data");return i}}),Dr,wc,$c,vc,xc,kc,b0=K(()=>{"use strict";ra(),Dr=(e,t)=>{if(e===void 0)throw new Error("Image buffer must be defined");if(t.height===void 0||t.width===void 0)throw new Error("Image height and width must be defined");if(t.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:r,width:i}=t,n=t.norm??{mean:255,bias:0},a,s;typeof n.mean=="number"?a=[n.mean,n.mean,n.mean,n.mean]:a=[n.mean[0],n.mean[1],n.mean[2],n.mean[3]??255],typeof n.bias=="number"?s=[n.bias,n.bias,n.bias,n.bias]:s=[n.bias[0],n.bias[1],n.bias[2],n.bias[3]??0];let o=t.format!==void 0?t.format:"RGBA",l=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",d=r*i,h=l==="RGBA"?new Float32Array(d*4):new Float32Array(d*3),p=4,f=0,_=1,m=2,w=3,x=0,$=d,b=d*2,S=-1;o==="RGB"&&(p=3,f=0,_=1,m=2,w=-1),l==="RGBA"?S=d*3:l==="RBG"?(x=0,b=d,$=d*2):l==="BGR"&&(b=0,$=d,x=d*2);for(let I=0;I<d;I++,f+=p,m+=p,_+=p,w+=p)h[x++]=(e[f]+s[0])/a[0],h[$++]=(e[_]+s[1])/a[1],h[b++]=(e[m]+s[2])/a[2],S!==-1&&w!==-1&&(h[S++]=(e[w]+s[3])/a[3]);return l==="RGBA"?new He("float32",h,[1,4,r,i]):new He("float32",h,[1,3,r,i])},wc=async(e,t)=>{let r=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,i=typeof ImageData<"u"&&e instanceof ImageData,n=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,a=typeof e=="string",s,o=t??{},l=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},d=h=>typeof HTMLCanvasElement<"u"&&h instanceof HTMLCanvasElement||h instanceof OffscreenCanvas?h.getContext("2d"):null;if(r){let h=l();h.width=e.width,h.height=e.height;let p=d(h);if(p!=null){let f=e.height,_=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(f=t.resizedHeight,_=t.resizedWidth),t!==void 0){if(o=t,t.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");o.tensorFormat="RGBA",o.height=f,o.width=_}else o.tensorFormat="RGBA",o.height=f,o.width=_;p.drawImage(e,0,0),s=p.getImageData(0,0,_,f).data}else throw new Error("Can not access image data")}else if(i){let h,p;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(h=t.resizedHeight,p=t.resizedWidth):(h=e.height,p=e.width),t!==void 0&&(o=t),o.format="RGBA",o.height=h,o.width=p,t!==void 0){let f=l();f.width=p,f.height=h;let _=d(f);if(_!=null)_.putImageData(e,0,0),s=_.getImageData(0,0,p,h).data;else throw new Error("Can not access image data")}else s=e.data}else if(n){if(t===void 0)throw new Error("Please provide image config with format for Imagebitmap");let h=l();h.width=e.width,h.height=e.height;let p=d(h);if(p!=null){let f=e.height,_=e.width;return p.drawImage(e,0,0,_,f),s=p.getImageData(0,0,_,f).data,o.height=f,o.width=_,Dr(s,o)}else throw new Error("Can not access image data")}else{if(a)return new Promise((h,p)=>{let f=l(),_=d(f);if(!e||!_)return p();let m=new Image;m.crossOrigin="Anonymous",m.src=e,m.onload=()=>{f.width=m.width,f.height=m.height,_.drawImage(m,0,0,f.width,f.height);let w=_.getImageData(0,0,f.width,f.height);o.height=f.height,o.width=f.width,h(Dr(w.data,o))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(s!==void 0)return Dr(s,o);throw new Error("Input data provided is not supported - aborted tensor creation")},$c=(e,t)=>{let{width:r,height:i,download:n,dispose:a}=t,s=[1,i,r,4];return new He({location:"texture",type:"float32",texture:e,dims:s,download:n,dispose:a})},vc=(e,t)=>{let{dataType:r,dims:i,download:n,dispose:a}=t;return new He({location:"gpu-buffer",type:r??"float32",gpuBuffer:e,dims:i,download:n,dispose:a})},xc=(e,t)=>{let{dataType:r,dims:i,download:n,dispose:a}=t;return new He({location:"ml-tensor",type:r??"float32",mlTensor:e,dims:i,download:n,dispose:a})},kc=(e,t,r)=>new He({location:"cpu-pinned",type:e,data:t,dims:r??[t.length]})}),Rt,gr,Mi,Sc,w0=K(()=>{"use strict";Rt=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),gr=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),Mi=!1,Sc=()=>{if(!Mi){Mi=!0;let e=typeof BigInt64Array<"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,r=globalThis.Float16Array,i=typeof r<"u"&&r.from;e&&(Rt.set("int64",BigInt64Array),gr.set(BigInt64Array,"int64")),t&&(Rt.set("uint64",BigUint64Array),gr.set(BigUint64Array,"uint64")),i?(Rt.set("float16",r),gr.set(r,"float16")):Rt.set("float16",Uint16Array)}}}),Tc,Ic,$0=K(()=>{"use strict";ra(),Tc=e=>{let t=1;for(let r=0;r<e.length;r++){let i=e[r];if(typeof i!="number"||!Number.isSafeInteger(i))throw new TypeError(`dims[${r}] must be an integer, got: ${i}`);if(i<0)throw new RangeError(`dims[${r}] must be a non-negative integer, got: ${i}`);t*=i}return t},Ic=(e,t)=>{switch(e.location){case"cpu":return new He(e.type,e.data,t);case"cpu-pinned":return new He({location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new He({location:"texture",texture:e.texture,type:e.type,dims:t});case"gpu-buffer":return new He({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"ml-tensor":return new He({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),He,ra=K(()=>{"use strict";_0(),b0(),w0(),$0(),He=class{constructor(e,t,r){Sc();let i,n;if(typeof e=="object"&&"location"in e)switch(this.dataLocation=e.location,i=e.type,n=e.dims,e.location){case"cpu-pinned":{let s=Rt.get(i);if(!s)throw new TypeError(`unsupported type "${i}" to create tensor from pinned buffer`);if(!(e.data instanceof s))throw new TypeError(`buffer should be of type ${s.name}`);this.cpuData=e.data;break}case"texture":{if(i!=="float32")throw new TypeError(`unsupported type "${i}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break}case"gpu-buffer":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break}case"ml-tensor":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint64"&&i!=="int8"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let s,o;if(typeof e=="string")if(i=e,o=r,e==="string"){if(!Array.isArray(t))throw new TypeError("A string tensor's data must be a string array.");s=t}else{let l=Rt.get(e);if(l===void 0)throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e==="float16"&&l===Uint16Array||e==="uint4"||e==="int4")throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${l.name} as data.`);e==="uint64"||e==="int64"?s=l.from(t,BigInt):s=l.from(t)}else if(t instanceof l)s=t;else if(t instanceof Uint8ClampedArray)if(e==="uint8")s=Uint8Array.from(t);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(e==="float16"&&t instanceof Uint16Array&&l!==Uint16Array)s=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw new TypeError(`A ${i} tensor's data must be type of ${l}`)}else if(o=t,Array.isArray(e)){if(e.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let l=typeof e[0];if(l==="string")i="string",s=e;else if(l==="boolean")i="bool",s=Uint8Array.from(e);else throw new TypeError(`Invalid element type of data array: ${l}.`)}else if(e instanceof Uint8ClampedArray)i="uint8",s=Uint8Array.from(e);else{let l=gr.get(e.constructor);if(l===void 0)throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);i=l,s=e}if(o===void 0)o=[s.length];else if(!Array.isArray(o))throw new TypeError("A tensor's dims must be a number array");n=o,this.cpuData=s,this.dataLocation="cpu"}let a=Tc(n);if(this.cpuData&&a!==this.cpuData.length&&!((i==="uint4"||i==="int4")&&Math.ceil(a/2)===this.cpuData.length))throw new Error(`Tensor's size(${a}) does not match data length(${this.cpuData.length}).`);this.type=i,this.dims=n,this.size=a}static async fromImage(e,t){return wc(e,t)}static fromTexture(e,t){return $c(e,t)}static fromGpuBuffer(e,t){return vc(e,t)}static fromMLTensor(e,t){return xc(e,t)}static fromPinnedBuffer(e,t,r){return kc(e,t,r)}toDataURL(e){return _c(this,e)}toImageData(e){return bc(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return Ic(this,e)}}}),Le,Ec=K(()=>{"use strict";ra(),Le=He}),ei,Bi,ut,it,Ut,Pt,Cc=K(()=>{"use strict";yc(),ei=(e,t)=>{(typeof Ue.trace>"u"?!Ue.wasm.trace:!Ue.trace)||console.timeStamp(`${e}::ORT::${t}`)},Bi=(e,t)=>{let r=new Error().stack?.split(/\r\n|\r|\n/g)||[],i=!1;for(let n=0;n<r.length;n++){if(i&&!r[n].includes("TRACE_FUNC")){let a=`FUNC_${e}::${r[n].trim().split(" ")[1]}`;t&&(a+=`::${t}`),ei("CPU",a);return}r[n].includes("TRACE_FUNC")&&(i=!0)}},ut=e=>{(typeof Ue.trace>"u"?!Ue.wasm.trace:!Ue.trace)||Bi("BEGIN",e)},it=e=>{(typeof Ue.trace>"u"?!Ue.wasm.trace:!Ue.trace)||Bi("END",e)},Ut=e=>{(typeof Ue.trace>"u"?!Ue.wasm.trace:!Ue.trace)||console.time(`ORT::${e}`)},Pt=e=>{(typeof Ue.trace>"u"?!Ue.wasm.trace:!Ue.trace)||console.timeEnd(`ORT::${e}`)}}),zc,v0=K(()=>{"use strict";mc(),Ec(),Cc(),zc=class Ac{constructor(t){this.handler=t}async run(t,r,i){ut(),Ut("InferenceSession.run");let n={},a={};if(typeof t!="object"||t===null||t instanceof Le||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let s=!0;if(typeof r=="object"){if(r===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(r instanceof Le)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(r)){if(r.length===0)throw new TypeError("'fetches' cannot be an empty array.");s=!1;for(let d of r){if(typeof d!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(d)===-1)throw new RangeError(`'fetches' contains invalid output name: ${d}.`);n[d]=null}if(typeof i=="object"&&i!==null)a=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else{let d=!1,h=Object.getOwnPropertyNames(r);for(let p of this.outputNames)if(h.indexOf(p)!==-1){let f=r[p];(f===null||f instanceof Le)&&(d=!0,s=!1,n[p]=f)}if(d){if(typeof i=="object"&&i!==null)a=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else a=r}}else if(typeof r<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let d of this.inputNames)if(typeof t[d]>"u")throw new Error(`input '${d}' is missing in 'feeds'.`);if(s)for(let d of this.outputNames)n[d]=null;let o=await this.handler.run(t,n,a),l={};for(let d in o)if(Object.hasOwnProperty.call(o,d)){let h=o[d];h instanceof Le?l[d]=h:l[d]=new Le(h.type,h.data,h.dims)}return Pt("InferenceSession.run"),it(),l}async release(){return this.handler.dispose()}static async create(t,r,i,n){ut(),Ut("InferenceSession.create");let a,s={};if(typeof t=="string"){if(a=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof Uint8Array){if(a=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&t instanceof SharedArrayBuffer){let h=t,p=0,f=t.byteLength;if(typeof r=="object"&&r!==null)s=r;else if(typeof r=="number"){if(p=r,!Number.isSafeInteger(p))throw new RangeError("'byteOffset' must be an integer.");if(p<0||p>=h.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${h.byteLength}).`);if(f=t.byteLength-p,typeof i=="number"){if(f=i,!Number.isSafeInteger(f))throw new RangeError("'byteLength' must be an integer.");if(f<=0||p+f>h.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${h.byteLength-p}].`);if(typeof n=="object"&&n!==null)s=n;else if(typeof n<"u")throw new TypeError("'options' must be an object.")}else if(typeof i<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof r<"u")throw new TypeError("'options' must be an object.");a=new Uint8Array(h,p,f)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[o,l]=await fc(s),d=await o.createInferenceSessionHandler(a,l);return Pt("InferenceSession.create"),it(),new Ac(d)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),Zt,x0=K(()=>{"use strict";v0(),Zt=zc}),k0=K(()=>{"use strict"}),S0=K(()=>{"use strict"}),T0=K(()=>{"use strict"}),I0=K(()=>{"use strict"}),E0={};tr(E0,{InferenceSession:()=>Zt,TRACE:()=>ei,TRACE_EVENT_BEGIN:()=>Ut,TRACE_EVENT_END:()=>Pt,TRACE_FUNC_BEGIN:()=>ut,TRACE_FUNC_END:()=>it,Tensor:()=>Le,env:()=>Ee,registerBackend:()=>Xt});var Xe=K(()=>{"use strict";m0(),y0(),x0(),Ec(),k0(),S0(),Cc(),T0(),I0()}),ia=K(()=>{"use strict"}),Oc={};tr(Oc,{default:()=>Mc});var Ri,Di,Mc,C0=K(()=>{"use strict";Wf(),Vt(),na(),Ri="ort-wasm-proxy-worker",Di=globalThis.self?.name===Ri,Di&&(self.onmessage=e=>{let{type:t,in:r}=e.data;try{switch(t){case"init-wasm":aa(r.wasm).then(()=>{va(r).then(()=>{postMessage({type:t})},i=>{postMessage({type:t,err:i})})},i=>{postMessage({type:t,err:i})});break;case"init-ep":{let{epName:i,env:n}=r;xa(n,i).then(()=>{postMessage({type:t})},a=>{postMessage({type:t,err:a})});break}case"copy-from":{let{buffer:i}=r,n=oi(i);postMessage({type:t,out:n});break}case"create":{let{model:i,options:n}=r;ka(i,n).then(a=>{postMessage({type:t,out:a})},a=>{postMessage({type:t,err:a})});break}case"release":Sa(r),postMessage({type:t});break;case"run":{let{sessionId:i,inputIndices:n,inputs:a,outputIndices:s,options:o}=r;Ta(i,n,a,s,new Array(s.length).fill(null),o).then(l=>{l.some(d=>d[3]!=="cpu")?postMessage({type:t,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:t,out:l},Ea([...a,...l]))},l=>{postMessage({type:t,err:l})});break}case"end-profiling":Ia(r),postMessage({type:t});break;default:}}catch(i){postMessage({type:t,err:i})}}),Mc=Di?null:e=>new Worker(e??Ge,{type:"module",name:Ri})}),Bc={};tr(Bc,{default:()=>Rc});async function vo(e={}){var t=e,r=!!globalThis.window,i=!!globalThis.WorkerGlobalScope,n=i&&self.name?.startsWith("em-pthread");t.mountExternalData=(u,c)=>{u.startsWith("./")&&(u=u.substring(2)),(t.ad||(t.ad=new Map)).set(u,c)},t.unmountExternalData=()=>{delete t.ad,delete t.Yd,delete t.Xd,delete t.be},globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,shared:!0}).buffer.constructor;let a=u=>async(...c)=>{try{if(t.$c)throw Error("Session already started");let y=t.$c={Nd:c[0],errors:[]},g=await u(...c);if(t.$c!==y)throw Error("Session mismatch");t.hd?.flush();let k=y.errors;if(0<k.length){let C=await Promise.all(k);if(C=C.filter(M=>M),0<C.length)throw Error(C.join(`
`))}return g}finally{t.$c=null}};t.jsepInit=(u,c)=>{if(u==="webgpu"){[t.hd,t.Dd,t.Hd,t.jd,t.Gd,t.bc,t.Id,t.Kd,t.Ed,t.Fd,t.Jd]=c;let y=t.hd;t.jsepRegisterBuffer=(g,k,C,M)=>y.registerBuffer(g,k,C,M),t.jsepGetBuffer=g=>y.getBuffer(g),t.jsepCreateDownloader=(g,k,C)=>y.createDownloader(g,k,C),t.jsepOnCreateSession=g=>{y.onCreateSession(g)},t.jsepOnReleaseSession=g=>{y.onReleaseSession(g)},t.jsepOnRunStart=g=>y.onRunStart(g),t.Ld=(g,k)=>{y.upload(g,k)}}else if(u==="webnn"){let y=c[0];[t.Vd,t.vd,t.webnnEnsureTensor,t.wd,t.webnnDownloadTensor,t.Ud,t.webnnEnableTraceEvent]=c.slice(1),t.webnnReleaseTensorId=t.vd,t.webnnUploadTensor=t.wd,t.webnnRegisterMLContext=t.Ud,t.webnnOnRunStart=g=>y.onRunStart(g),t.webnnOnRunEnd=y.onRunEnd.bind(y),t.webnnOnReleaseSession=g=>{y.onReleaseSession(g)},t.webnnCreateMLTensorDownloader=(g,k)=>y.createMLTensorDownloader(g,k),t.webnnRegisterMLTensor=(g,k,C,M)=>y.registerMLTensor(g,k,C,M),t.webnnCreateMLContext=g=>y.createMLContext(g),t.webnnRegisterGraphInput=y.registerGraphInput.bind(y),t.webnnIsGraphInput=y.isGraphInput.bind(y),t.webnnRegisterGraphOutput=y.registerGraphOutput.bind(y),t.webnnIsGraphOutput=y.isGraphOutput.bind(y),t.webnnCreateTemporaryTensor=y.createTemporaryTensor.bind(y),t.webnnIsGraphInputOutputTypeSupported=y.isGraphInputOutputTypeSupported.bind(y)}};let s=()=>{let u=c=>(...y)=>{let g=at;return y=c(...y),at!=g?new Promise((k,C)=>{bi={resolve:k,reject:C}}):y};(()=>{for(let c of["_OrtAppendExecutionProvider","_OrtCreateSession","_OrtRun","_OrtRunWithBinding","_OrtBindInput"])t[c]=u(t[c])})(),a!==void 0&&(t._OrtRun=a(t._OrtRun),t._OrtRunWithBinding=a(t._OrtRunWithBinding)),s=void 0};t.asyncInit=()=>{s?.()};var o,l,d=(u,c)=>{throw c},h=import.meta.url,p="";if(r||i){try{p=new URL(".",h).href}catch{}i&&(l=u=>{var c=new XMLHttpRequest;return c.open("GET",u,!1),c.responseType="arraybuffer",c.send(null),new Uint8Array(c.response)}),o=async u=>{if(z(u))return new Promise((y,g)=>{var k=new XMLHttpRequest;k.open("GET",u,!0),k.responseType="arraybuffer",k.onload=()=>{k.status==200||k.status==0&&k.response?y(k.response):g(k.status)},k.onerror=g,k.send(null)});var c=await fetch(u,{credentials:"same-origin"});if(c.ok)return c.arrayBuffer();throw Error(c.status+" : "+c.url)}}var f,_,m,w,x,$,b=console.log.bind(console),S=console.error.bind(console),I=b,T=S,E=!1,z=u=>u.startsWith("file://");function v(){gt.buffer!=P.buffer&&te()}if(n){let u=function(c){try{var y=c.data,g=y.Vc;if(g==="load"){let k=[];self.onmessage=C=>k.push(C),$=()=>{postMessage({Vc:"loaded"});for(let C of k)u(C);self.onmessage=u};for(let C of y.Ad)t[C]&&!t[C].proxy||(t[C]=(...M)=>{postMessage({Vc:"callHandler",yd:C,args:M})},C=="print"&&(I=t[C]),C=="printErr"&&(T=t[C]));gt=y.Rd,te(),_=y.Sd,L(),Rr()}else if(g==="run"){(function(k){var C=(v(),N)[k+52>>>2>>>0];k=(v(),N)[k+56>>>2>>>0],Es(C,C-k),_e(C)})(y.Uc),ki(y.Uc,0,0,1,0,0),It(),gi(y.Uc),B||(vs(),B=!0);try{em(y.Pd,y.ed)}catch(k){if(k!="unwind")throw k}}else y.target!=="setimmediate"&&(g==="checkMailbox"?B&&Er():g&&(T(`worker: received unknown command ${g}`),T(y)))}catch(k){throw xs(),k}};var B=!1;self.onunhandledrejection=c=>{throw c.reason||c},self.onmessage=u}var P,O,V,F,A,N,X,J,Q,ne,ee,R=!1;function te(){var u=gt.buffer;t.HEAP8=P=new Int8Array(u),V=new Int16Array(u),t.HEAPU8=O=new Uint8Array(u),F=new Uint16Array(u),t.HEAP32=A=new Int32Array(u),t.HEAPU32=N=new Uint32Array(u),X=new Float32Array(u),J=new Float64Array(u),Q=new BigInt64Array(u),ne=new BigUint64Array(u)}function Z(){R=!0,n?$():ct.ub()}function H(u){throw T(u="Aborted("+u+")"),E=!0,u=new WebAssembly.RuntimeError(u+". Build with -sASSERTIONS for more info."),x?.(u),u}function Ie(){return{a:{ma:xg,hb:vg,g:tm,J:rm,f:im,o:nm,i:am,$:sm,b:om,S:um,Ha:Ba,n:lm,aa:Ua,Ya:Pa,Da:qa,Fa:La,Za:Wa,Wa:Va,Pa:Ga,Va:Ha,ka:Fa,Ea:ja,Ba:Ka,Xa,Ca:Ya,cb:dm,fa:cm,wa:pm,ua:fm,ea:gm,N:ym,H:_m,va:bm,_:Tm,xa:Im,Sa:Em,za:zm,Ia:Am,sa:Om,ga:Mm,Ra:gi,$a:Bm,Q:Um,r:Vm,c:fi,ib:Gm,y:Hm,M:Fm,D:jm,l:Km,s:ns,jb:Xm,I:Ym,R:Zm,j:Qm,u:Jm,q:eg,k:tg,Ma:rg,Na:ig,Oa:ng,Ka:us,La:ls,ta:ds,eb:sg,bb:ug,v:lg,ba:dg,ha:cg,ab:og,V:pg,_a:hg,Aa:fg,F:ag,U:mg,la:Mr,ya:yg,gb:gg,fb:_g,Ta:fs,Ua:ms,Ga:$e,T:gs,Ja:ys,ja:_s,Qa:bs,ia:ws,lb:s0,na:t0,mb:a0,oa:e0,G:Vg,e:Ig,t:Sg,w:kg,B:Ng,nb:Zg,Z:Yg,x:zg,pa:Qg,X:r0,ca:Xg,ob:Kg,pb:jg,O:Ug,qb:Hg,qa:Fg,rb:Gg,L:Lg,Y:Jg,d:Tg,A:Cg,m:Eg,kb:o0,p:Og,z:Mg,C:Ag,E:Bg,K:Pg,ra:Wg,P:i0,da:qg,W:n0,sb:Dg,tb:Rg,h:wg,a:gt,db:ye}}}async function L(){function u(g,k){var C=ct=g.exports;g={};for(let[M,W]of Object.entries(C))typeof W=="function"?(C=Rm(W),g[M]=C):g[M]=W;return ct=g,ct=(function(){var M=ct,W=ie=>ge=>ie(ge)>>>0,re=ie=>()=>ie()>>>0;return(M=Object.assign({},M)).vb=W(M.vb),M.Zb=re(M.Zb),M.$b=W(M.$b),M.nc=W(M.nc),M.oc=re(M.oc),M.sc=W(M.sc),M})(),Ht.push(ct.ac),$s=(g=ct).vb,vs=g.wb,t._OrtInit=g.xb,t._OrtGetLastError=g.yb,t._OrtCreateSessionOptions=g.zb,t._OrtAppendExecutionProvider=g.Ab,t._OrtAddFreeDimensionOverride=g.Bb,t._OrtAddSessionConfigEntry=g.Cb,t._OrtReleaseSessionOptions=g.Db,t._OrtCreateSession=g.Eb,t._OrtReleaseSession=g.Fb,t._OrtGetInputOutputCount=g.Gb,t._OrtGetInputOutputMetadata=g.Hb,t._OrtFree=g.Ib,t._OrtCreateTensor=g.Jb,t._OrtGetTensorData=g.Kb,t._OrtReleaseTensor=g.Lb,t._OrtCreateRunOptions=g.Mb,t._OrtAddRunConfigEntry=g.Nb,t._OrtReleaseRunOptions=g.Ob,t._OrtCreateBinding=g.Pb,t._OrtBindInput=g.Qb,t._OrtBindOutput=g.Rb,t._OrtClearBoundOutputs=g.Sb,t._OrtReleaseBinding=g.Tb,t._OrtRunWithBinding=g.Ub,t._OrtRun=g.Vb,t._OrtEndProfiling=g.Wb,t._JsepOutput=g.Xb,t._JsepGetNodeName=g.Yb,Br=g.Zb,st=t._free=g._b,ir=t._malloc=g.$b,ki=g.cc,xs=g.dc,ks=g.ec,Ss=g.fc,Si=g.gc,Ts=g.hc,Is=g.ic,we=g.jc,nr=g.kc,Es=g.lc,_e=g.mc,Ti=g.nc,be=g.oc,Cs=g.pc,Ii=g.qc,zs=g.rc,As=g.sc,Os=g.tc,Ei=g.uc,Ms=g.vc,Bs=g.wc,Rs=g.xc,Ds=g.yc,Ns=g.zc,Us=g.Ac,Ps=g.Bc,qs=g.Cc,Ls=g.Dc,Ws=g.Ec,Vs=g.Fc,Gs=g.Gc,Hs=g.Hc,Fs=g.Ic,js=g.Jc,Ks=g.Kc,Xs=g.Lc,Ys=g.Mc,Zs=g.Nc,Qs=g.Oc,Js=g.Pc,eo=g.Qc,to=g.Sc,ro=g.Tc,io=g.cd,no=g.dd,ao=g.id,so=g.nd,oo=g.od,uo=g.pd,lo=g.qd,co=g.rd,po=g.sd,ho=g.td,fo=g.ud,mo=g.zd,go=g.Zd,yo=g._d,_o=g.$d,bo=g.ae,_=k,ct}var c,y=Ie();return t.instantiateWasm?new Promise(g=>{t.instantiateWasm(y,(k,C)=>{g(u(k,C))})}):n?u(new WebAssembly.Instance(_,Ie()),_):(ee??=t.locateFile?t.locateFile?t.locateFile("ort-wasm-simd-threaded.jsep.wasm",p):p+"ort-wasm-simd-threaded.jsep.wasm":new URL("/assets/ort-wasm-simd-threaded.jsep.wasm",import.meta.url).href,c=await(async function(g){var k=ee;if(!f&&!z(k))try{var C=fetch(k,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(C,g)}catch(M){T(`wasm streaming compile failed: ${M}`),T("falling back to ArrayBuffer instantiation")}return(async function(M,W){try{var re=await(async function(ie){if(!f)try{var ge=await o(ie);return new Uint8Array(ge)}catch{}if(ie==ee&&f)ie=new Uint8Array(f);else{if(!l)throw"both async and sync fetching of the wasm failed";ie=l(ie)}return ie})(M);return await WebAssembly.instantiate(re,W)}catch(ie){T(`failed to asynchronously prepare wasm: ${ie}`),H(ie)}})(k,g)})(y),u(c.instance,c.module))}class de{name="ExitStatus";constructor(c){this.message=`Program terminated with exit(${c})`,this.status=c}}var he=u=>{u.terminate(),u.onmessage=()=>{}},U=[],G=0,j=null,Y=u=>{Re.length==0&&(za(),Ca(Re[0]));var c=Re.pop();if(!c)return 6;Ve.push(c),qe[u.Uc]=c,c.Uc=u.Uc;var y={Vc:"run",Pd:u.Od,ed:u.ed,Uc:u.Uc};return c.postMessage(y,u.md),0},ue=0,se=(u,c,...y)=>{var g,k=16*y.length,C=be(),M=Ti(k),W=M>>>3;for(g of y)typeof g=="bigint"?((v(),Q)[W++>>>0]=1n,(v(),Q)[W++>>>0]=g):((v(),Q)[W++>>>0]=0n,(v(),J)[W++>>>0]=g);return u=ks(u,0,k,M,c),_e(C),u};function ye(u){if(n)return se(0,1,u);if(m=u,!(0<ue)){for(var c of Ve)he(c);for(c of Re)he(c);Re=[],Ve=[],qe={},E=!0}d(0,new de(u))}function pe(u){if(n)return se(1,0,u);$e(u)}var $e=u=>{if(m=u,n)throw pe(u),"unwind";ye(u)},Re=[],Ve=[],Ht=[],qe={},lt=u=>{var c=u.Uc;delete qe[c],Re.push(u),Ve.splice(Ve.indexOf(u),1),u.Uc=0,Ss(c)};function It(){Ht.forEach(u=>u())}var Ca=u=>new Promise(c=>{u.onmessage=k=>{var C=k.data;if(k=C.Vc,C.bd&&C.bd!=Br()){var M=qe[C.bd];M?M.postMessage(C,C.md):T(`Internal error! Worker sent a message "${k}" to target pthread ${C.bd}, but that thread no longer exists!`)}else k==="checkMailbox"?Er():k==="spawnThread"?Y(C):k==="cleanupThread"?Ir(()=>{lt(qe[C.Qd])}):k==="loaded"?(u.loaded=!0,c(u)):C.target==="setimmediate"?u.postMessage(C):k==="uncaughtException"?u.onerror(C.error):k==="callHandler"?t[C.yd](...C.args):k&&T(`worker sent an unknown command ${k}`)},u.onerror=k=>{throw T(`worker sent an error! ${k.filename}:${k.lineno}: ${k.message}`),k};var y,g=[];for(y of[])t.propertyIsEnumerable(y)&&g.push(y);u.postMessage({Vc:"load",Ad:g,Rd:gt,Sd:_})});function za(){var u=new Worker((()=>{let c=URL;return import.meta.url>"file:"&&import.meta.url<"file;"?new c("ort.bundle.min.mjs",import.meta.url):new URL(import.meta.url)})(),{type:"module",workerData:"em-pthread",name:"em-pthread"});Re.push(u)}var gt,em=(u,c)=>{ue=0,u=Ei(u,c),0<ue?m=u:Si(u)},kr=[],Sr=0;function tm(u){var c=new di(u>>>=0);return(v(),P)[c.Wc+12>>>0]==0&&(Aa(c,!0),Sr--),Oa(c,!1),kr.push(c),As(u)}var Ft=0,rm=()=>{we(0,0);var u=kr.pop();Cs(u.gd),Ft=0};function Aa(u,c){c=c?1:0,(v(),P)[u.Wc+12>>>0]=c}function Oa(u,c){c=c?1:0,(v(),P)[u.Wc+13>>>0]=c}class di{constructor(c){this.gd=c,this.Wc=c-24}}var ci=u=>{var c=Ft;if(!c)return nr(0),0;var y=new di(c);(v(),N)[y.Wc+16>>>2>>>0]=c;var g=(v(),N)[y.Wc+4>>>2>>>0];if(!g)return nr(0),c;for(var k of u){if(k===0||k===g)break;if(zs(k,g,y.Wc+16))return nr(k),c}return nr(g),c};function im(){return ci([])}function nm(u){return ci([u>>>0])}function am(u,c,y,g){return ci([u>>>0,c>>>0,y>>>0,g>>>0])}var sm=()=>{var u=kr.pop();u||H("no exception to throw");var c=u.gd;throw(v(),P)[u.Wc+13>>>0]==0&&(kr.push(u),Oa(u,!0),Aa(u,!1),Sr++),Ii(c),Ft=c};function om(u,c,y){var g=new di(u>>>=0);throw c>>>=0,y>>>=0,(v(),N)[g.Wc+16>>>2>>>0]=0,(v(),N)[g.Wc+4>>>2>>>0]=c,(v(),N)[g.Wc+8>>>2>>>0]=y,Ii(u),Sr++,Ft=u}var um=()=>Sr;function Ma(u,c,y,g){return n?se(2,1,u,c,y,g):Ba(u,c,y,g)}function Ba(u,c,y,g){if(u>>>=0,c>>>=0,y>>>=0,g>>>=0,!globalThis.SharedArrayBuffer)return 6;var k=[];return n&&k.length===0?Ma(u,c,y,g):(u={Od:y,Uc:u,ed:g,md:k},n?(u.Vc="spawnThread",postMessage(u,k),0):Y(u))}function lm(u){throw Ft||=u>>>0,Ft}var Ra=globalThis.TextDecoder&&new TextDecoder,Da=(u,c,y,g)=>{if(y=c+y,g)return y;for(;u[c]&&!(c>=y);)++c;return c},Na=(u,c=0,y,g)=>{if(16<(y=Da(u,c>>>=0,y,g))-c&&u.buffer&&Ra)return Ra.decode(u.buffer instanceof ArrayBuffer?u.subarray(c,y):u.slice(c,y));for(g="";c<y;){var k=u[c++];if(128&k){var C=63&u[c++];if((224&k)==192)g+=String.fromCharCode((31&k)<<6|C);else{var M=63&u[c++];65536>(k=(240&k)==224?(15&k)<<12|C<<6|M:(7&k)<<18|C<<12|M<<6|63&u[c++])?g+=String.fromCharCode(k):(k-=65536,g+=String.fromCharCode(55296|k>>10,56320|1023&k))}}else g+=String.fromCharCode(k)}return g},Be=(u,c,y)=>(u>>>=0)?Na((v(),O),u,c,y):"";function Ua(u,c,y){return n?se(3,1,u,c,y):0}function Pa(u,c){if(n)return se(4,1,u,c)}function qa(u,c){if(n)return se(5,1,u,c)}function La(u,c,y){if(n)return se(6,1,u,c,y)}function Wa(u,c,y){return n?se(7,1,u,c,y):0}function Va(u,c){if(n)return se(8,1,u,c)}function Ga(u,c,y){if(n)return se(9,1,u,c,y)}function Ha(u,c,y,g){if(n)return se(10,1,u,c,y,g)}function Fa(u,c,y,g){if(n)return se(11,1,u,c,y,g)}function ja(u,c,y,g){if(n)return se(12,1,u,c,y,g)}function Ka(u){if(n)return se(13,1,u)}function Xa(u,c){if(n)return se(14,1,u,c)}function Ya(u,c,y){if(n)return se(15,1,u,c,y)}var dm=()=>H(""),nt=u=>{u>>>=0;for(var c="";;){var y=(v(),O)[u++>>>0];if(!y)return c;c+=String.fromCharCode(y)}},pi={},hi={},jt=class extends Error{constructor(u){super(u),this.name="BindingError"}};function dt(u,c,y={}){return(function(g,k,C={}){var M=k.name;if(!g)throw new jt(`type "${M}" must have a positive integer typeid pointer`);if(hi.hasOwnProperty(g)){if(C.Bd)return;throw new jt(`Cannot register type '${M}' twice`)}hi[g]=k,pi.hasOwnProperty(g)&&(k=pi[g],delete pi[g],k.forEach(W=>W()))})(u,c,y)}var Za=(u,c,y)=>{switch(c){case 1:return y?g=>(v(),P)[g>>>0]:g=>(v(),O)[g>>>0];case 2:return y?g=>(v(),V)[g>>>1>>>0]:g=>(v(),F)[g>>>1>>>0];case 4:return y?g=>(v(),A)[g>>>2>>>0]:g=>(v(),N)[g>>>2>>>0];case 8:return y?g=>(v(),Q)[g>>>3>>>0]:g=>(v(),ne)[g>>>3>>>0];default:throw new TypeError(`invalid integer width (${c}): ${u}`)}};function cm(u,c,y,g,k){u>>>=0,y>>>=0,c=nt(c>>>0);let C=M=>M;if(g=g===0n){let M=8*y;C=W=>BigInt.asUintN(M,W),k=C(k)}dt(u,{name:c,Rc:C,Yc:(M,W)=>(typeof W=="number"&&(W=BigInt(W)),W),Xc:Za(c,y,!g),Zc:null})}function pm(u,c,y,g){dt(u>>>=0,{name:c=nt(c>>>0),Rc:function(k){return!!k},Yc:function(k,C){return C?y:g},Xc:function(k){return this.Rc((v(),O)[k>>>0])},Zc:null})}var Qa=[],Et=[0,1,,1,null,1,!0,1,!1,1];function fi(u){9<(u>>>=0)&&--Et[u+1]===0&&(Et[u]=void 0,Qa.push(u))}var je=u=>{if(!u)throw new jt(`Cannot use deleted val. handle = ${u}`);return Et[u]},Ye=u=>{switch(u){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let c=Qa.pop()||Et.length;return Et[c]=u,Et[c+1]=1,c}};function mi(u){return this.Rc((v(),N)[u>>>2>>>0])}var hm={name:"emscripten::val",Rc:u=>{var c=je(u);return fi(u),c},Yc:(u,c)=>Ye(c),Xc:mi,Zc:null};function fm(u){return dt(u>>>0,hm)}var mm=(u,c)=>{switch(c){case 4:return function(y){return this.Rc((v(),X)[y>>>2>>>0])};case 8:return function(y){return this.Rc((v(),J)[y>>>3>>>0])};default:throw new TypeError(`invalid float width (${c}): ${u}`)}};function gm(u,c,y){y>>>=0,dt(u>>>=0,{name:c=nt(c>>>0),Rc:g=>g,Yc:(g,k)=>k,Xc:mm(c,y),Zc:null})}function ym(u,c,y,g,k){u>>>=0,y>>>=0,c=nt(c>>>0);let C=W=>W;if(g===0){var M=32-8*y;C=W=>W<<M>>>M,k=C(k)}dt(u,{name:c,Rc:C,Yc:(W,re)=>re,Xc:Za(c,y,g!==0),Zc:null})}function _m(u,c,y){function g(C){var M=(v(),N)[C>>>2>>>0];return C=(v(),N)[C+4>>>2>>>0],new k((v(),P).buffer,C,M)}var k=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][c];dt(u>>>=0,{name:y=nt(y>>>0),Rc:g,Xc:g},{Bd:!0})}var yt=(u,c,y)=>{var g=(v(),O);if(c>>>=0,0<y){var k=c;y=c+y-1;for(var C=0;C<u.length;++C){var M=u.codePointAt(C);if(127>=M){if(c>=y)break;g[c++>>>0]=M}else if(2047>=M){if(c+1>=y)break;g[c++>>>0]=192|M>>6,g[c++>>>0]=128|63&M}else if(65535>=M){if(c+2>=y)break;g[c++>>>0]=224|M>>12,g[c++>>>0]=128|M>>6&63,g[c++>>>0]=128|63&M}else{if(c+3>=y)break;g[c++>>>0]=240|M>>18,g[c++>>>0]=128|M>>12&63,g[c++>>>0]=128|M>>6&63,g[c++>>>0]=128|63&M,C++}}g[c>>>0]=0,u=c-k}else u=0;return u},Tr=u=>{for(var c=0,y=0;y<u.length;++y){var g=u.charCodeAt(y);127>=g?c++:2047>=g?c+=2:55296<=g&&57343>=g?(c+=4,++y):c+=3}return c};function bm(u,c){dt(u>>>=0,{name:c=nt(c>>>0),Rc(y){var g=(v(),N)[y>>>2>>>0];return g=Be(y+4,g,!0),st(y),g},Yc(y,g){g instanceof ArrayBuffer&&(g=new Uint8Array(g));var k=typeof g=="string";if(!(k||ArrayBuffer.isView(g)&&g.BYTES_PER_ELEMENT==1))throw new jt("Cannot pass non-string to std::string");var C=k?Tr(g):g.length,M=ir(4+C+1),W=M+4;return(v(),N)[M>>>2>>>0]=C,k?yt(g,W,C+1):(v(),O).set(g,W>>>0),y!==null&&y.push(st,M),M},Xc:mi,Zc(y){st(y)}})}var Ja=globalThis.TextDecoder?new TextDecoder("utf-16le"):void 0,wm=(u,c,y)=>{if(u>>>=1,16<(c=Da((v(),F),u,c/2,y))-u&&Ja)return Ja.decode((v(),F).slice(u,c));for(y="";u<c;++u){var g=(v(),F)[u>>>0];y+=String.fromCharCode(g)}return y},$m=(u,c,y)=>{if(y??=2147483647,2>y)return 0;var g=c;y=(y-=2)<2*u.length?y/2:u.length;for(var k=0;k<y;++k){var C=u.charCodeAt(k);(v(),V)[c>>>1>>>0]=C,c+=2}return(v(),V)[c>>>1>>>0]=0,c-g},vm=u=>2*u.length,xm=(u,c,y)=>{var g="";u>>>=2;for(var k=0;!(k>=c/4);k++){var C=(v(),N)[u+k>>>0];if(!C&&!y)break;g+=String.fromCodePoint(C)}return g},km=(u,c,y)=>{if(c>>>=0,y??=2147483647,4>y)return 0;var g=c;y=g+y-4;for(var k=0;k<u.length;++k){var C=u.codePointAt(k);if(65535<C&&k++,(v(),A)[c>>>2>>>0]=C,(c+=4)+4>y)break}return(v(),A)[c>>>2>>>0]=0,c-g},Sm=u=>{for(var c=0,y=0;y<u.length;++y)65535<u.codePointAt(y)&&y++,c+=4;return c};function Tm(u,c,y){if(u>>>=0,c>>>=0,y=nt(y>>>=0),c===2)var g=wm,k=$m,C=vm;else g=xm,k=km,C=Sm;dt(u,{name:y,Rc:M=>{var W=(v(),N)[M>>>2>>>0];return W=g(M+4,W*c,!0),st(M),W},Yc:(M,W)=>{if(typeof W!="string")throw new jt(`Cannot pass non-string to C++ string type ${y}`);var re=C(W),ie=ir(4+re+c);return(v(),N)[ie>>>2>>>0]=re/c,k(W,ie+4,re+c),M!==null&&M.push(st,ie),ie},Xc:mi,Zc(M){st(M)}})}function Im(u,c){dt(u>>>=0,{Cd:!0,name:c=nt(c>>>0),Rc:()=>{},Yc:()=>{}})}function Em(u){ki(u>>>0,!i,1,!r,131072,!1),It()}var Ir=u=>{if(!E)try{if(u(),!(0<ue))try{n?Br()&&Si(m):$e(m)}catch(c){c instanceof de||c=="unwind"||d(0,c)}}catch(c){c instanceof de||c=="unwind"||d(0,c)}},Cm=!Atomics.waitAsync||globalThis.navigator?.userAgent&&91>Number((navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)||[])[2]);function gi(u){u>>>=0,Cm||(Atomics.waitAsync((v(),A),u>>>2,u).value.then(Er),u+=128,Atomics.store((v(),A),u>>>2,1))}var Er=()=>Ir(()=>{var u=Br();u&&(gi(u),Is())});function zm(u,c){(u>>>=0)==c>>>0?setTimeout(Er):n?postMessage({bd:u,Vc:"checkMailbox"}):(u=qe[u])&&u.postMessage({Vc:"checkMailbox"})}var yi=[];function Am(u,c,y,g,k){for(c>>>=0,k>>>=0,yi.length=0,y=k>>>3,g=k+g>>>3;y<g;){var C;C=(v(),Q)[y++>>>0]?(v(),Q)[y++>>>0]:(v(),J)[y++>>>0],yi.push(C)}return(c?Ci[c]:$g[u])(...yi)}var Om=()=>{ue=0};function Mm(u){u>>>=0,n?postMessage({Vc:"cleanupThread",Qd:u}):lt(qe[u])}function Bm(u){}var Cr=u=>{try{u()}catch(c){H(c)}};function Rm(u){var c=(...y)=>{zr.push(u);try{return u(...y)}finally{E||(zr.pop(),at&&_t===1&&zr.length===0&&(_t=0,ue+=1,Cr(yo),typeof Fibers<"u"&&Fibers.de()))}};return rs.set(u,c),c}var _t=0,at=null,es=0,zr=[],_i=new Map,ts=new Map,rs=new Map,Dm=0,bi=null,Nm=[],is=u=>(function(c){if(!E){if(_t===0){var y=!1,g=!1;c((k=0)=>{if(!E&&(es=k,y=!0,g)){_t=2,Cr(()=>_o(at)),typeof MainLoop<"u"&&MainLoop.xd&&MainLoop.resume(),k=!1;try{var C=(function(){var re=(v(),A)[at+8>>>2>>>0];return re=ts.get(re),re=rs.get(re),--ue,re()})()}catch(re){C=re,k=!0}var M=!1;if(!at){var W=bi;W&&(bi=null,(k?W.reject:W.resolve)(C),M=!0)}if(k&&!M)throw C}}),g=!0,y||(_t=1,at=(function(){var k=ir(65548),C=k+12;if((v(),N)[k>>>2>>>0]=C,(v(),N)[k+4>>>2>>>0]=C+65536,C=zr[0],!_i.has(C)){var M=Dm++;_i.set(C,M),ts.set(M,C)}return C=_i.get(C),(v(),A)[k+8>>>2>>>0]=C,k})(),typeof MainLoop<"u"&&MainLoop.xd&&MainLoop.pause(),Cr(()=>go(at)))}else _t===2?(_t=0,Cr(bo),st(at),at=null,Nm.forEach(Ir)):H(`invalid state: ${_t}`);return es}})(c=>{u().then(c)});function Um(u){return u>>>=0,is(async()=>{var c=await je(u);return Ye(c)})}var wi=[],Pm=u=>{var c=wi.length;return wi.push(u),c},qm=(u,c)=>{for(var y=Array(u),g=0;g<u;++g){var k=g,C=(v(),N)[c+4*g>>>2>>>0],M=hi[C];if(M===void 0)throw u=`parameter ${g}`,C=$s(C),c=nt(C),st(C),new jt(`${u} has unknown type ${c}`);y[k]=M}return y},Lm=(u,c,y)=>{var g=[];return u=u(g,y),g.length&&((v(),N)[c>>>2>>>0]=Ye(g)),u},Wm={},Ar=u=>{var c=Wm[u];return c===void 0?nt(u):c};function Vm(u,c,y){var[g,...k]=qm(u,c>>>0);c=g.Yc.bind(g);var C=k.map(re=>re.Xc.bind(re));u--;var M={toValue:je};switch(u=C.map((re,ie)=>{var ge=`argFromPtr${ie}`;return M[ge]=re,`${ge}(args${ie?"+"+8*ie:""})`}),y){case 0:var W="toValue(handle)";break;case 2:W="new (toValue(handle))";break;case 3:W="";break;case 1:M.getStringOrSymbol=Ar,W="toValue(handle)[getStringOrSymbol(methodName)]"}return W+=`(${u})`,g.Cd||(M.toReturnWire=c,M.emval_returnValue=Lm,W=`return emval_returnValue(toReturnWire, destructorsRef, ${W})`),W=`return function (handle, methodName, destructorsRef, args) {
  ${W}
  }`,y=new Function(Object.keys(M),W)(...Object.values(M)),W=`methodCaller<(${k.map(re=>re.name)}) => ${g.name}>`,Pm(Object.defineProperty(y,"name",{value:W}))}function Gm(u,c){return c>>>=0,(u=je(u>>>0))==je(c)}function Hm(u){return(u>>>=0)?(u=Ar(u),Ye(globalThis[u])):Ye(globalThis)}function Fm(u){return u=Ar(u>>>0),Ye(t[u])}function jm(u,c){return c>>>=0,u=je(u>>>0),c=je(c),Ye(u[c])}function Km(u){9<(u>>>=0)&&(Et[u+1]+=1)}function ns(u,c,y,g,k){return wi[u>>>0](c>>>0,y>>>0,g>>>0,k>>>0)}function Xm(u,c,y,g,k){return ns(u>>>0,c>>>0,y>>>0,g>>>0,k>>>0)}function Ym(){return Ye([])}function Zm(u){u=je(u>>>0);for(var c=Array(u.length),y=0;y<u.length;y++)c[y]=u[y];return Ye(c)}function Qm(u){return Ye(Ar(u>>>0))}function Jm(){return Ye({})}function eg(u){for(var c=je(u>>>=0);c.length;){var y=c.pop();c.pop()(y)}fi(u)}function tg(u,c,y){c>>>=0,y>>>=0,u=je(u>>>0),c=je(c),y=je(y),u[c]=y}function rg(u,c){u=-9007199254740992>u||9007199254740992<u?NaN:Number(u),c>>>=0,u=new Date(1e3*u),(v(),A)[c>>>2>>>0]=u.getUTCSeconds(),(v(),A)[c+4>>>2>>>0]=u.getUTCMinutes(),(v(),A)[c+8>>>2>>>0]=u.getUTCHours(),(v(),A)[c+12>>>2>>>0]=u.getUTCDate(),(v(),A)[c+16>>>2>>>0]=u.getUTCMonth(),(v(),A)[c+20>>>2>>>0]=u.getUTCFullYear()-1900,(v(),A)[c+24>>>2>>>0]=u.getUTCDay(),u=(u.getTime()-Date.UTC(u.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,(v(),A)[c+28>>>2>>>0]=u}var as=u=>u%4==0&&(u%100!=0||u%400==0),ss=[0,31,60,91,121,152,182,213,244,274,305,335],os=[0,31,59,90,120,151,181,212,243,273,304,334];function ig(u,c){u=-9007199254740992>u||9007199254740992<u?NaN:Number(u),c>>>=0,u=new Date(1e3*u),(v(),A)[c>>>2>>>0]=u.getSeconds(),(v(),A)[c+4>>>2>>>0]=u.getMinutes(),(v(),A)[c+8>>>2>>>0]=u.getHours(),(v(),A)[c+12>>>2>>>0]=u.getDate(),(v(),A)[c+16>>>2>>>0]=u.getMonth(),(v(),A)[c+20>>>2>>>0]=u.getFullYear()-1900,(v(),A)[c+24>>>2>>>0]=u.getDay();var y=(as(u.getFullYear())?ss:os)[u.getMonth()]+u.getDate()-1|0;(v(),A)[c+28>>>2>>>0]=y,(v(),A)[c+36>>>2>>>0]=-60*u.getTimezoneOffset(),y=new Date(u.getFullYear(),6,1).getTimezoneOffset();var g=new Date(u.getFullYear(),0,1).getTimezoneOffset();u=0|(y!=g&&u.getTimezoneOffset()==Math.min(g,y)),(v(),A)[c+32>>>2>>>0]=u}function ng(u){u>>>=0;var c=new Date((v(),A)[u+20>>>2>>>0]+1900,(v(),A)[u+16>>>2>>>0],(v(),A)[u+12>>>2>>>0],(v(),A)[u+8>>>2>>>0],(v(),A)[u+4>>>2>>>0],(v(),A)[u>>>2>>>0],0),y=(v(),A)[u+32>>>2>>>0],g=c.getTimezoneOffset(),k=new Date(c.getFullYear(),6,1).getTimezoneOffset(),C=new Date(c.getFullYear(),0,1).getTimezoneOffset(),M=Math.min(C,k);return 0>y?(v(),A)[u+32>>>2>>>0]=+(k!=C&&M==g):0<y!=(M==g)&&(k=Math.max(C,k),c.setTime(c.getTime()+6e4*((0<y?M:k)-g))),(v(),A)[u+24>>>2>>>0]=c.getDay(),y=(as(c.getFullYear())?ss:os)[c.getMonth()]+c.getDate()-1|0,(v(),A)[u+28>>>2>>>0]=y,(v(),A)[u>>>2>>>0]=c.getSeconds(),(v(),A)[u+4>>>2>>>0]=c.getMinutes(),(v(),A)[u+8>>>2>>>0]=c.getHours(),(v(),A)[u+12>>>2>>>0]=c.getDate(),(v(),A)[u+16>>>2>>>0]=c.getMonth(),(v(),A)[u+20>>>2>>>0]=c.getYear(),u=c.getTime(),BigInt(isNaN(u)?-1:u/1e3)}function us(u,c,y,g,k,C,M){return n?se(16,1,u,c,y,g,k,C,M):-52}function ls(u,c,y,g,k,C){if(n)return se(17,1,u,c,y,g,k,C)}var rr={},ag=()=>performance.timeOrigin+performance.now();function ds(u,c){if(n)return se(18,1,u,c);if(rr[u]&&(clearTimeout(rr[u].id),delete rr[u]),!c)return 0;var y=setTimeout(()=>{delete rr[u],Ir(()=>Ts(u,performance.timeOrigin+performance.now()))},c);return rr[u]={id:y,ce:c},0}function sg(u,c,y,g){u>>>=0,c>>>=0,y>>>=0,g>>>=0;var k=new Date().getFullYear(),C=new Date(k,0,1).getTimezoneOffset();k=new Date(k,6,1).getTimezoneOffset();var M=Math.max(C,k);(v(),N)[u>>>2>>>0]=60*M,(v(),A)[c>>>2>>>0]=+(C!=k),u=(c=W=>{var re=Math.abs(W);return`UTC${0<=W?"-":"+"}${String(Math.floor(re/60)).padStart(2,"0")}${String(re%60).padStart(2,"0")}`})(C),c=c(k),k<C?(yt(u,y,17),yt(c,g,17)):(yt(u,g,17),yt(c,y,17))}var og=()=>Date.now();function ug(u,c,y){return y>>>=0,0<=u&&3>=u?(u===0?u=Date.now():u=performance.timeOrigin+performance.now(),u=Math.round(1e6*u),(v(),Q)[y>>>3>>>0]=BigInt(u),0):28}var $i=[],cs=(u,c)=>{$i.length=0;for(var y;y=(v(),O)[u++>>>0];){var g=y!=105;c+=(g&=y!=112)&&c%8?4:0,$i.push(y==112?(v(),N)[c>>>2>>>0]:y==106?(v(),Q)[c>>>3>>>0]:y==105?(v(),A)[c>>>2>>>0]:(v(),J)[c>>>3>>>0]),c+=g?8:4}return $i};function lg(u,c,y){return u>>>=0,c=cs(c>>>0,y>>>0),Ci[u](...c)}function dg(u,c,y){return u>>>=0,c=cs(c>>>0,y>>>0),Ci[u](...c)}var cg=()=>{};function pg(u,c){return T(Be(u>>>0,c>>>0))}var hg=()=>{throw ue+=1,"unwind"};function fg(){return 4294901760}var mg=()=>navigator.hardwareConcurrency,Ct={},Or=u=>{var c;return(c=/\bwasm-function\[\d+\]:(0x[0-9a-f]+)/.exec(u))?+c[1]:(c=/:(\d+):\d+(?:\)|$)/.exec(u))?2147483648|+c[1]:0},ps=u=>{for(var c of u)(u=Or(c))&&(Ct[u]=c)};function gg(){var u=Error().stack.toString().split(`
`);return u[0]=="Error"&&u.shift(),ps(u),Ct.kd=Or(u[3]),Ct.Md=u,Ct.kd}function Mr(u){if(!(u=Ct[u>>>0]))return 0;var c;if(c=/^\s+at .*\.wasm\.(.*) \(.*\)$/.exec(u))u=c[1];else if(c=/^\s+at (.*) \(.*\)$/.exec(u))u=c[1];else{if(!(c=/^(.+?)@/.exec(u)))return 0;u=c[1]}st(Mr.ld??0),c=Tr(u)+1;var y=ir(c);return y&&yt(u,y,c),Mr.ld=y,Mr.ld}function yg(u){u>>>=0;var c=(v(),O).length;if(u<=c||4294901760<u)return!1;for(var y=1;4>=y;y*=2){var g=c*(1+.2/y);g=Math.min(g,u+100663296);e:{g=(Math.min(4294901760,65536*Math.ceil(Math.max(u,g)/65536))-gt.buffer.byteLength+65535)/65536|0;try{gt.grow(g),te();var k=1;break e}catch{}k=void 0}if(k)return!0}return!1}function _g(u,c,y){if(u>>>=0,c>>>=0,Ct.kd==u)var g=Ct.Md;else(g=Error().stack.toString().split(`
`))[0]=="Error"&&g.shift(),ps(g);for(var k=3;g[k]&&Or(g[k])!=u;)++k;for(u=0;u<y&&g[u+k];++u)(v(),A)[c+4*u>>>2>>>0]=Or(g[u+k]);return u}var vi,xi={},hs=()=>{if(!vi){var u,c={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(globalThis.navigator?.language??"C").replace("-","_")+".UTF-8",_:"./this.program"};for(u in xi)xi[u]===void 0?delete c[u]:c[u]=xi[u];var y=[];for(u in c)y.push(`${u}=${c[u]}`);vi=y}return vi};function fs(u,c){if(n)return se(19,1,u,c);u>>>=0,c>>>=0;var y,g=0,k=0;for(y of hs()){var C=c+g;(v(),N)[u+k>>>2>>>0]=C,g+=yt(y,C,1/0)+1,k+=4}return 0}function ms(u,c){if(n)return se(20,1,u,c);u>>>=0,c>>>=0;var y=hs();for(var g of((v(),N)[u>>>2>>>0]=y.length,u=0,y))u+=Tr(g)+1;return(v(),N)[c>>>2>>>0]=u,0}function gs(u){return n?se(21,1,u):52}function ys(u,c,y,g,k){return n?se(22,1,u,c,y,g,k):52}function _s(u,c,y,g){return n?se(23,1,u,c,y,g):52}function bs(u,c,y,g){return n?se(24,1,u,c,y,g):70}var bg=[null,[],[]];function ws(u,c,y,g){if(n)return se(25,1,u,c,y,g);c>>>=0,y>>>=0,g>>>=0;for(var k=0,C=0;C<y;C++){var M=(v(),N)[c>>>2>>>0],W=(v(),N)[c+4>>>2>>>0];c+=8;for(var re=0;re<W;re++){var ie=u,ge=(v(),O)[M+re>>>0],xe=bg[ie];ge===0||ge===10?((ie===1?I:T)(Na(xe)),xe.length=0):xe.push(ge)}k+=W}return(v(),N)[g>>>2>>>0]=k,0}function wg(u){return u>>>0}n||(function(){for(var u=t.numThreads-1;u--;)za();U.push(async()=>{var c=(async function(){if(!n)return Promise.all(Re.map(Ca))})();G++,await c,--G==0&&j&&(c=j,j=null,c())})})(),n||(gt=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0}),te()),t.wasmBinary&&(f=t.wasmBinary),t.stackSave=()=>be(),t.stackRestore=u=>_e(u),t.stackAlloc=u=>Ti(u),t.setValue=function(u,c,y="i8"){switch(y.endsWith("*")&&(y="*"),y){case"i1":case"i8":(v(),P)[u>>>0]=c;break;case"i16":(v(),V)[u>>>1>>>0]=c;break;case"i32":(v(),A)[u>>>2>>>0]=c;break;case"i64":(v(),Q)[u>>>3>>>0]=BigInt(c);break;case"float":(v(),X)[u>>>2>>>0]=c;break;case"double":(v(),J)[u>>>3>>>0]=c;break;case"*":(v(),N)[u>>>2>>>0]=c;break;default:H(`invalid type for setValue: ${y}`)}},t.getValue=function(u,c="i8"){switch(c.endsWith("*")&&(c="*"),c){case"i1":case"i8":return(v(),P)[u>>>0];case"i16":return(v(),V)[u>>>1>>>0];case"i32":return(v(),A)[u>>>2>>>0];case"i64":return(v(),Q)[u>>>3>>>0];case"float":return(v(),X)[u>>>2>>>0];case"double":return(v(),J)[u>>>3>>>0];case"*":return(v(),N)[u>>>2>>>0];default:H(`invalid type for getValue: ${c}`)}},t.UTF8ToString=Be,t.stringToUTF8=yt,t.lengthBytesUTF8=Tr;var $s,vs,Br,st,ir,ki,xs,ks,Ss,Si,Ts,Is,we,nr,Es,_e,Ti,be,Cs,Ii,zs,As,Os,Ei,Ms,Bs,Rs,Ds,Ns,Us,Ps,qs,Ls,Ws,Vs,Gs,Hs,Fs,js,Ks,Xs,Ys,Zs,Qs,Js,eo,to,ro,io,no,ao,so,oo,uo,lo,co,po,ho,fo,mo,go,yo,_o,bo,ct,$g=[ye,pe,Ma,Ua,Pa,qa,La,Wa,Va,Ga,Ha,Fa,ja,Ka,Xa,Ya,us,ls,ds,fs,ms,gs,ys,_s,bs,ws],Ci={1086876:(u,c,y,g,k)=>{if(t===void 0||!t.ad)return 1;if((u=Be(Number(u>>>0))).startsWith("./")&&(u=u.substring(2)),!(u=t.ad.get(u)))return 2;if(c=Number(c>>>0),y=Number(y>>>0),g=Number(g>>>0),c+y>u.byteLength)return 3;try{let C=u.subarray(c,c+y);switch(k){case 0:(v(),O).set(C,g>>>0);break;case 1:t.Td?t.Td(g,C):t.Ld(g,C);break;default:return 4}return 0}catch{return 4}},1087700:(u,c,y)=>{t.wd(u,(v(),O).subarray(c>>>0,c+y>>>0))},1087764:()=>t.Vd(),1087806:u=>{t.vd(u)},1087843:()=>{t.Ed()},1087874:()=>{t.Fd()},1087903:()=>{t.Jd()},1087928:u=>t.Dd(u),1087961:u=>t.Hd(u),1087993:(u,c,y)=>{t.jd(Number(u),Number(c),Number(y),!0)},1088056:(u,c,y)=>{t.jd(Number(u),Number(c),Number(y))},1088113:()=>typeof wasmOffsetConverter<"u",1088170:u=>{t.bc("Abs",u,void 0)},1088221:u=>{t.bc("Neg",u,void 0)},1088272:u=>{t.bc("Floor",u,void 0)},1088325:u=>{t.bc("Ceil",u,void 0)},1088377:u=>{t.bc("Reciprocal",u,void 0)},1088435:u=>{t.bc("Sqrt",u,void 0)},1088487:u=>{t.bc("Exp",u,void 0)},1088538:u=>{t.bc("Erf",u,void 0)},1088589:u=>{t.bc("Sigmoid",u,void 0)},1088644:(u,c,y)=>{t.bc("HardSigmoid",u,{alpha:c,beta:y})},1088723:u=>{t.bc("HardSwish",u,void 0)},1088780:u=>{t.bc("Log",u,void 0)},1088831:u=>{t.bc("Sin",u,void 0)},1088882:u=>{t.bc("Cos",u,void 0)},1088933:u=>{t.bc("Tan",u,void 0)},1088984:u=>{t.bc("Asin",u,void 0)},1089036:u=>{t.bc("Acos",u,void 0)},1089088:u=>{t.bc("Atan",u,void 0)},1089140:u=>{t.bc("Sinh",u,void 0)},1089192:u=>{t.bc("Cosh",u,void 0)},1089244:u=>{t.bc("Asinh",u,void 0)},1089297:u=>{t.bc("Acosh",u,void 0)},1089350:u=>{t.bc("Atanh",u,void 0)},1089403:u=>{t.bc("Tanh",u,void 0)},1089455:u=>{t.bc("Not",u,void 0)},1089506:(u,c,y)=>{t.bc("Clip",u,{min:c,max:y})},1089575:u=>{t.bc("Clip",u,void 0)},1089627:(u,c)=>{t.bc("Elu",u,{alpha:c})},1089685:u=>{t.bc("Gelu",u,void 0)},1089737:u=>{t.bc("Relu",u,void 0)},1089789:(u,c)=>{t.bc("LeakyRelu",u,{alpha:c})},1089853:(u,c)=>{t.bc("ThresholdedRelu",u,{alpha:c})},1089923:(u,c)=>{t.bc("Cast",u,{to:c})},1089981:u=>{t.bc("Add",u,void 0)},1090032:u=>{t.bc("Sub",u,void 0)},1090083:u=>{t.bc("Mul",u,void 0)},1090134:u=>{t.bc("Div",u,void 0)},1090185:u=>{t.bc("Pow",u,void 0)},1090236:u=>{t.bc("Equal",u,void 0)},1090289:u=>{t.bc("Greater",u,void 0)},1090344:u=>{t.bc("GreaterOrEqual",u,void 0)},1090406:u=>{t.bc("Less",u,void 0)},1090458:u=>{t.bc("LessOrEqual",u,void 0)},1090517:(u,c,y,g,k)=>{t.bc("ReduceMean",u,{keepDims:!!c,noopWithEmptyAxes:!!y,axes:g?Array.from((v(),A).subarray(Number(g)>>>0,Number(k)>>>0)):[]})},1090692:(u,c,y,g,k)=>{t.bc("ReduceMax",u,{keepDims:!!c,noopWithEmptyAxes:!!y,axes:g?Array.from((v(),A).subarray(Number(g)>>>0,Number(k)>>>0)):[]})},1090866:(u,c,y,g,k)=>{t.bc("ReduceMin",u,{keepDims:!!c,noopWithEmptyAxes:!!y,axes:g?Array.from((v(),A).subarray(Number(g)>>>0,Number(k)>>>0)):[]})},1091040:(u,c,y,g,k)=>{t.bc("ReduceProd",u,{keepDims:!!c,noopWithEmptyAxes:!!y,axes:g?Array.from((v(),A).subarray(Number(g)>>>0,Number(k)>>>0)):[]})},1091215:(u,c,y,g,k)=>{t.bc("ReduceSum",u,{keepDims:!!c,noopWithEmptyAxes:!!y,axes:g?Array.from((v(),A).subarray(Number(g)>>>0,Number(k)>>>0)):[]})},1091389:(u,c,y,g,k)=>{t.bc("ReduceL1",u,{keepDims:!!c,noopWithEmptyAxes:!!y,axes:g?Array.from((v(),A).subarray(Number(g)>>>0,Number(k)>>>0)):[]})},1091562:(u,c,y,g,k)=>{t.bc("ReduceL2",u,{keepDims:!!c,noopWithEmptyAxes:!!y,axes:g?Array.from((v(),A).subarray(Number(g)>>>0,Number(k)>>>0)):[]})},1091735:(u,c,y,g,k)=>{t.bc("ReduceLogSum",u,{keepDims:!!c,noopWithEmptyAxes:!!y,axes:g?Array.from((v(),A).subarray(Number(g)>>>0,Number(k)>>>0)):[]})},1091912:(u,c,y,g,k)=>{t.bc("ReduceSumSquare",u,{keepDims:!!c,noopWithEmptyAxes:!!y,axes:g?Array.from((v(),A).subarray(Number(g)>>>0,Number(k)>>>0)):[]})},1092092:(u,c,y,g,k)=>{t.bc("ReduceLogSumExp",u,{keepDims:!!c,noopWithEmptyAxes:!!y,axes:g?Array.from((v(),A).subarray(Number(g)>>>0,Number(k)>>>0)):[]})},1092272:u=>{t.bc("Where",u,void 0)},1092325:(u,c,y)=>{t.bc("Transpose",u,{perm:c?Array.from((v(),A).subarray(Number(c)>>>0,Number(y)>>>0)):[]})},1092449:(u,c,y,g)=>{t.bc("DepthToSpace",u,{blocksize:c,mode:Be(y),format:g?"NHWC":"NCHW"})},1092582:(u,c,y,g)=>{t.bc("DepthToSpace",u,{blocksize:c,mode:Be(y),format:g?"NHWC":"NCHW"})},1092715:(u,c,y,g)=>{t.bc("DFT",u,{axis:c,inverse:y,onesided:g})},1092807:(u,c,y,g,k,C,M,W,re,ie,ge,xe,Ce,Ae,bt)=>{t.bc("ConvTranspose",u,{format:re?"NHWC":"NCHW",autoPad:c,dilations:[y],group:g,kernelShape:[k],pads:[C,M],strides:[W],wIsConst:()=>!!(v(),P)[ie>>>0],outputPadding:ge?Array.from((v(),A).subarray(Number(ge)>>>0,Number(xe)>>>0)):[],outputShape:Ce?Array.from((v(),A).subarray(Number(Ce)>>>0,Number(Ae)>>>0)):[],activation:Be(bt)})},1093240:(u,c,y,g,k,C,M,W,re,ie,ge,xe,Ce,Ae)=>{t.bc("ConvTranspose",u,{format:W?"NHWC":"NCHW",autoPad:c,dilations:Array.from((v(),A).subarray(Number(y)>>>0,(Number(y)>>>0)+2>>>0)),group:g,kernelShape:Array.from((v(),A).subarray(Number(k)>>>0,(Number(k)>>>0)+2>>>0)),pads:Array.from((v(),A).subarray(Number(C)>>>0,(Number(C)>>>0)+4>>>0)),strides:Array.from((v(),A).subarray(Number(M)>>>0,(Number(M)>>>0)+2>>>0)),wIsConst:()=>!!(v(),P)[re>>>0],outputPadding:ie?Array.from((v(),A).subarray(Number(ie)>>>0,Number(ge)>>>0)):[],outputShape:xe?Array.from((v(),A).subarray(Number(xe)>>>0,Number(Ce)>>>0)):[],activation:Be(Ae)})},1093901:(u,c,y,g,k,C,M,W,re,ie,ge,xe,Ce,Ae,bt)=>{t.bc("ConvTranspose",u,{format:re?"NHWC":"NCHW",autoPad:c,dilations:[y],group:g,kernelShape:[k],pads:[C,M],strides:[W],wIsConst:()=>!!(v(),P)[ie>>>0],outputPadding:ge?Array.from((v(),A).subarray(Number(ge)>>>0,Number(xe)>>>0)):[],outputShape:Ce?Array.from((v(),A).subarray(Number(Ce)>>>0,Number(Ae)>>>0)):[],activation:Be(bt)})},1094334:(u,c,y,g,k,C,M,W,re,ie,ge,xe,Ce,Ae)=>{t.bc("ConvTranspose",u,{format:W?"NHWC":"NCHW",autoPad:c,dilations:Array.from((v(),A).subarray(Number(y)>>>0,(Number(y)>>>0)+2>>>0)),group:g,kernelShape:Array.from((v(),A).subarray(Number(k)>>>0,(Number(k)>>>0)+2>>>0)),pads:Array.from((v(),A).subarray(Number(C)>>>0,(Number(C)>>>0)+4>>>0)),strides:Array.from((v(),A).subarray(Number(M)>>>0,(Number(M)>>>0)+2>>>0)),wIsConst:()=>!!(v(),P)[re>>>0],outputPadding:ie?Array.from((v(),A).subarray(Number(ie)>>>0,Number(ge)>>>0)):[],outputShape:xe?Array.from((v(),A).subarray(Number(xe)>>>0,Number(Ce)>>>0)):[],activation:Be(Ae)})},1094995:(u,c)=>{t.bc("GlobalAveragePool",u,{format:c?"NHWC":"NCHW"})},1095086:(u,c,y,g,k,C,M,W,re,ie,ge,xe,Ce,Ae)=>{t.bc("AveragePool",u,{format:Ae?"NHWC":"NCHW",auto_pad:c,ceil_mode:y,count_include_pad:g,storage_order:k,dilations:C?Array.from((v(),A).subarray(Number(C)>>>0,Number(M)>>>0)):[],kernel_shape:W?Array.from((v(),A).subarray(Number(W)>>>0,Number(re)>>>0)):[],pads:ie?Array.from((v(),A).subarray(Number(ie)>>>0,Number(ge)>>>0)):[],strides:xe?Array.from((v(),A).subarray(Number(xe)>>>0,Number(Ce)>>>0)):[]})},1095565:(u,c)=>{t.bc("GlobalAveragePool",u,{format:c?"NHWC":"NCHW"})},1095656:(u,c,y,g,k,C,M,W,re,ie,ge,xe,Ce,Ae)=>{t.bc("AveragePool",u,{format:Ae?"NHWC":"NCHW",auto_pad:c,ceil_mode:y,count_include_pad:g,storage_order:k,dilations:C?Array.from((v(),A).subarray(Number(C)>>>0,Number(M)>>>0)):[],kernel_shape:W?Array.from((v(),A).subarray(Number(W)>>>0,Number(re)>>>0)):[],pads:ie?Array.from((v(),A).subarray(Number(ie)>>>0,Number(ge)>>>0)):[],strides:xe?Array.from((v(),A).subarray(Number(xe)>>>0,Number(Ce)>>>0)):[]})},1096135:(u,c)=>{t.bc("GlobalMaxPool",u,{format:c?"NHWC":"NCHW"})},1096222:(u,c,y,g,k,C,M,W,re,ie,ge,xe,Ce,Ae)=>{t.bc("MaxPool",u,{format:Ae?"NHWC":"NCHW",auto_pad:c,ceil_mode:y,count_include_pad:g,storage_order:k,dilations:C?Array.from((v(),A).subarray(Number(C)>>>0,Number(M)>>>0)):[],kernel_shape:W?Array.from((v(),A).subarray(Number(W)>>>0,Number(re)>>>0)):[],pads:ie?Array.from((v(),A).subarray(Number(ie)>>>0,Number(ge)>>>0)):[],strides:xe?Array.from((v(),A).subarray(Number(xe)>>>0,Number(Ce)>>>0)):[]})},1096697:(u,c)=>{t.bc("GlobalMaxPool",u,{format:c?"NHWC":"NCHW"})},1096784:(u,c,y,g,k,C,M,W,re,ie,ge,xe,Ce,Ae)=>{t.bc("MaxPool",u,{format:Ae?"NHWC":"NCHW",auto_pad:c,ceil_mode:y,count_include_pad:g,storage_order:k,dilations:C?Array.from((v(),A).subarray(Number(C)>>>0,Number(M)>>>0)):[],kernel_shape:W?Array.from((v(),A).subarray(Number(W)>>>0,Number(re)>>>0)):[],pads:ie?Array.from((v(),A).subarray(Number(ie)>>>0,Number(ge)>>>0)):[],strides:xe?Array.from((v(),A).subarray(Number(xe)>>>0,Number(Ce)>>>0)):[]})},1097259:(u,c,y,g,k)=>{t.bc("Gemm",u,{alpha:c,beta:y,transA:g,transB:k})},1097363:u=>{t.bc("MatMul",u,void 0)},1097417:(u,c,y,g)=>{t.bc("ArgMax",u,{keepDims:!!c,selectLastIndex:!!y,axis:g})},1097525:(u,c,y,g)=>{t.bc("ArgMin",u,{keepDims:!!c,selectLastIndex:!!y,axis:g})},1097633:(u,c)=>{t.bc("Softmax",u,{axis:c})},1097696:(u,c)=>{t.bc("Concat",u,{axis:c})},1097756:(u,c,y,g,k)=>{t.bc("Split",u,{axis:c,numOutputs:y,splitSizes:g?Array.from((v(),A).subarray(Number(g)>>>0,Number(k)>>>0)):[]})},1097912:u=>{t.bc("Expand",u,void 0)},1097966:(u,c)=>{t.bc("Gather",u,{axis:Number(c)})},1098037:(u,c)=>{t.bc("GatherElements",u,{axis:Number(c)})},1098116:(u,c)=>{t.bc("GatherND",u,{batch_dims:Number(c)})},1098195:(u,c,y,g,k,C,M,W,re,ie,ge)=>{t.bc("Resize",u,{antialias:c,axes:y?Array.from((v(),A).subarray(Number(y)>>>0,Number(g)>>>0)):[],coordinateTransformMode:Be(k),cubicCoeffA:C,excludeOutside:M,extrapolationValue:W,keepAspectRatioPolicy:Be(re),mode:Be(ie),nearestMode:Be(ge)})},1098557:(u,c,y,g,k,C,M)=>{t.bc("Slice",u,{starts:c?Array.from((v(),A).subarray(Number(c)>>>0,Number(y)>>>0)):[],ends:g?Array.from((v(),A).subarray(Number(g)>>>0,Number(k)>>>0)):[],axes:C?Array.from((v(),A).subarray(Number(C)>>>0,Number(M)>>>0)):[]})},1098821:u=>{t.bc("Tile",u,void 0)},1098873:(u,c,y)=>{t.bc("InstanceNormalization",u,{epsilon:c,format:y?"NHWC":"NCHW"})},1098987:(u,c,y)=>{t.bc("InstanceNormalization",u,{epsilon:c,format:y?"NHWC":"NCHW"})},1099101:u=>{t.bc("Range",u,void 0)},1099154:(u,c)=>{t.bc("Einsum",u,{equation:Be(c)})},1099235:(u,c,y,g,k)=>{t.bc("Pad",u,{mode:c,value:y,pads:g?Array.from((v(),A).subarray(Number(g)>>>0,Number(k)>>>0)):[]})},1099378:(u,c,y,g,k,C)=>{t.bc("BatchNormalization",u,{epsilon:c,momentum:y,spatial:!!k,trainingMode:!!g,format:C?"NHWC":"NCHW"})},1099547:(u,c,y,g,k,C)=>{t.bc("BatchNormalization",u,{epsilon:c,momentum:y,spatial:!!k,trainingMode:!!g,format:C?"NHWC":"NCHW"})},1099716:(u,c,y)=>{t.bc("CumSum",u,{exclusive:Number(c),reverse:Number(y)})},1099813:(u,c,y)=>{t.bc("DequantizeLinear",u,{axis:c,blockSize:y})},1099903:(u,c,y,g,k)=>{t.bc("GridSample",u,{align_corners:c,mode:Be(y),padding_mode:Be(g),format:k?"NHWC":"NCHW"})},1100073:(u,c,y,g,k)=>{t.bc("GridSample",u,{align_corners:c,mode:Be(y),padding_mode:Be(g),format:k?"NHWC":"NCHW"})},1100243:(u,c)=>{t.bc("ScatterND",u,{reduction:Be(c)})},1100328:(u,c,y,g,k,C,M,W,re)=>{t.bc("Attention",u,{numHeads:c,isUnidirectional:y,maskFilterValue:g,scale:k,doRotary:C,qkvHiddenSizes:M?Array.from((v(),A).subarray(Number(W)>>>0,Number(W)+M>>>0)):[],pastPresentShareBuffer:!!re})},1100600:u=>{t.bc("BiasAdd",u,void 0)},1100655:u=>{t.bc("BiasSplitGelu",u,void 0)},1100716:u=>{t.bc("FastGelu",u,void 0)},1100772:(u,c,y,g,k,C,M,W,re,ie,ge,xe,Ce,Ae,bt,zi)=>{t.bc("Conv",u,{format:xe?"NHWC":"NCHW",auto_pad:c,dilations:y?Array.from((v(),A).subarray(Number(y)>>>0,Number(g)>>>0)):[],group:k,kernel_shape:C?Array.from((v(),A).subarray(Number(C)>>>0,Number(M)>>>0)):[],pads:W?Array.from((v(),A).subarray(Number(W)>>>0,Number(re)>>>0)):[],strides:ie?Array.from((v(),A).subarray(Number(ie)>>>0,Number(ge)>>>0)):[],w_is_const:()=>!!(v(),P)[Number(Ce)>>>0],activation:Be(Ae),activation_params:bt?Array.from((v(),X).subarray(Number(bt)>>>0,Number(zi)>>>0)):[]})},1101356:u=>{t.bc("Gelu",u,void 0)},1101408:(u,c,y,g,k,C,M,W,re)=>{t.bc("GroupQueryAttention",u,{numHeads:c,kvNumHeads:y,scale:g,softcap:k,doRotary:C,rotaryInterleaved:M,smoothSoftmax:W,localWindowSize:re})},1101625:(u,c,y,g)=>{t.bc("LayerNormalization",u,{axis:c,epsilon:y,simplified:!!g})},1101736:(u,c,y,g)=>{t.bc("LayerNormalization",u,{axis:c,epsilon:y,simplified:!!g})},1101847:(u,c,y,g,k,C)=>{t.bc("MatMulNBits",u,{k:c,n:y,accuracyLevel:g,bits:k,blockSize:C})},1101974:(u,c,y,g,k,C)=>{t.bc("MultiHeadAttention",u,{numHeads:c,isUnidirectional:y,maskFilterValue:g,scale:k,doRotary:C})},1102133:(u,c)=>{t.bc("QuickGelu",u,{alpha:c})},1102197:(u,c,y,g,k)=>{t.bc("RotaryEmbedding",u,{interleaved:!!c,numHeads:y,rotaryEmbeddingDim:g,scale:k})},1102336:(u,c,y)=>{t.bc("SkipLayerNormalization",u,{epsilon:c,simplified:!!y})},1102438:(u,c,y)=>{t.bc("SkipLayerNormalization",u,{epsilon:c,simplified:!!y})},1102540:(u,c,y,g)=>{t.bc("GatherBlockQuantized",u,{gatherAxis:c,quantizeAxis:y,blockSize:g})},1102661:u=>{t.Id(u)},1102695:(u,c)=>t.Kd(Number(u),Number(c),t.$c.Nd,t.$c.errors)};function vg(u,c,y){return is(async()=>{await t.Gd(Number(u),Number(c),Number(y))})}function xg(){return typeof wasmOffsetConverter<"u"}function kg(u,c,y,g){var k=be();try{return qs(u,c,y,g)}catch(C){if(_e(k),C!==C+0)throw C;we(1,0)}}function Sg(u,c,y){var g=be();try{return Ds(u,c,y)}catch(k){if(_e(g),k!==k+0)throw k;we(1,0)}}function Tg(u){var c=be();try{Ms(u)}catch(y){if(_e(c),y!==y+0)throw y;we(1,0)}}function Ig(u,c){var y=be();try{return Ei(u,c)}catch(g){if(_e(y),g!==g+0)throw g;we(1,0)}}function Eg(u,c,y){var g=be();try{Os(u,c,y)}catch(k){if(_e(g),k!==k+0)throw k;we(1,0)}}function Cg(u,c){var y=be();try{Ls(u,c)}catch(g){if(_e(y),g!==g+0)throw g;we(1,0)}}function zg(u,c,y,g,k,C,M){var W=be();try{return Us(u,c,y,g,k,C,M)}catch(re){if(_e(W),re!==re+0)throw re;we(1,0)}}function Ag(u,c,y,g,k,C){var M=be();try{Bs(u,c,y,g,k,C)}catch(W){if(_e(M),W!==W+0)throw W;we(1,0)}}function Og(u,c,y,g){var k=be();try{Ps(u,c,y,g)}catch(C){if(_e(k),C!==C+0)throw C;we(1,0)}}function Mg(u,c,y,g,k){var C=be();try{Rs(u,c,y,g,k)}catch(M){if(_e(C),M!==M+0)throw M;we(1,0)}}function Bg(u,c,y,g,k,C,M){var W=be();try{Vs(u,c,y,g,k,C,M)}catch(re){if(_e(W),re!==re+0)throw re;we(1,0)}}function Rg(u,c,y,g,k,C,M){var W=be();try{Gs(u,c,y,g,k,C,M)}catch(re){if(_e(W),re!==re+0)throw re;we(1,0)}}function Dg(u,c,y,g,k,C,M,W){var re=be();try{Ks(u,c,y,g,k,C,M,W)}catch(ie){if(_e(re),ie!==ie+0)throw ie;we(1,0)}}function Ng(u,c,y,g,k){var C=be();try{return Ws(u,c,y,g,k)}catch(M){if(_e(C),M!==M+0)throw M;we(1,0)}}function Ug(u,c,y){var g=be();try{return Xs(u,c,y)}catch(k){if(_e(g),k!==k+0)throw k;we(1,0)}}function Pg(u,c,y,g,k,C,M,W){var re=be();try{Ys(u,c,y,g,k,C,M,W)}catch(ie){if(_e(re),ie!==ie+0)throw ie;we(1,0)}}function qg(u,c,y,g,k,C,M,W,re,ie,ge,xe){var Ce=be();try{Hs(u,c,y,g,k,C,M,W,re,ie,ge,xe)}catch(Ae){if(_e(Ce),Ae!==Ae+0)throw Ae;we(1,0)}}function Lg(u,c,y){var g=be();try{return Zs(u,c,y)}catch(k){if(_e(g),k!==k+0)throw k;return we(1,0),0n}}function Wg(u,c,y,g,k,C,M,W,re){var ie=be();try{Ns(u,c,y,g,k,C,M,W,re)}catch(ge){if(_e(ie),ge!==ge+0)throw ge;we(1,0)}}function Vg(u){var c=be();try{return Qs(u)}catch(y){if(_e(c),y!==y+0)throw y;we(1,0)}}function Gg(u,c){var y=be();try{return mo(u,c)}catch(g){if(_e(y),g!==g+0)throw g;return we(1,0),0n}}function Hg(u,c,y,g){var k=be();try{return Js(u,c,y,g)}catch(C){if(_e(k),C!==C+0)throw C;we(1,0)}}function Fg(u){var c=be();try{return eo(u)}catch(y){if(_e(c),y!==y+0)throw y;return we(1,0),0n}}function jg(u,c,y,g){var k=be();try{return so(u,c,y,g)}catch(C){if(_e(k),C!==C+0)throw C;we(1,0)}}function Kg(u,c,y,g,k){var C=be();try{return oo(u,c,y,g,k)}catch(M){if(_e(C),M!==M+0)throw M;we(1,0)}}function Xg(u,c,y,g,k,C){var M=be();try{return uo(u,c,y,g,k,C)}catch(W){if(_e(M),W!==W+0)throw W;we(1,0)}}function Yg(u,c,y,g,k,C){var M=be();try{return Fs(u,c,y,g,k,C)}catch(W){if(_e(M),W!==W+0)throw W;we(1,0)}}function Zg(u,c,y,g,k,C){var M=be();try{return lo(u,c,y,g,k,C)}catch(W){if(_e(M),W!==W+0)throw W;we(1,0)}}function Qg(u,c,y,g,k,C,M,W){var re=be();try{return js(u,c,y,g,k,C,M,W)}catch(ie){if(_e(re),ie!==ie+0)throw ie;we(1,0)}}function Jg(u,c,y,g,k){var C=be();try{return co(u,c,y,g,k)}catch(M){if(_e(C),M!==M+0)throw M;return we(1,0),0n}}function e0(u,c,y,g){var k=be();try{return po(u,c,y,g)}catch(C){if(_e(k),C!==C+0)throw C;we(1,0)}}function t0(u,c,y,g){var k=be();try{return ho(u,c,y,g)}catch(C){if(_e(k),C!==C+0)throw C;we(1,0)}}function r0(u,c,y,g,k,C,M,W,re,ie,ge,xe){var Ce=be();try{return fo(u,c,y,g,k,C,M,W,re,ie,ge,xe)}catch(Ae){if(_e(Ce),Ae!==Ae+0)throw Ae;we(1,0)}}function i0(u,c,y,g,k,C,M,W,re,ie,ge){var xe=be();try{no(u,c,y,g,k,C,M,W,re,ie,ge)}catch(Ce){if(_e(xe),Ce!==Ce+0)throw Ce;we(1,0)}}function n0(u,c,y,g,k,C,M,W,re,ie,ge,xe,Ce,Ae,bt,zi){var u0=be();try{ao(u,c,y,g,k,C,M,W,re,ie,ge,xe,Ce,Ae,bt,zi)}catch(Ai){if(_e(u0),Ai!==Ai+0)throw Ai;we(1,0)}}function a0(u,c,y){var g=be();try{return to(u,c,y)}catch(k){if(_e(g),k!==k+0)throw k;we(1,0)}}function s0(u,c,y){var g=be();try{return ro(u,c,y)}catch(k){if(_e(g),k!==k+0)throw k;we(1,0)}}function o0(u,c,y,g){var k=be();try{io(u,c,y,g)}catch(C){if(_e(k),C!==C+0)throw C;we(1,0)}}function Rr(){if(0<G)j=Rr;else if(n)w?.(t),Z();else{for(var u=U;0<u.length;)u.shift()(t);0<G?j=Rr:(t.calledRun=!0,E||(Z(),w?.(t)))}}return n||(ct=await L(),Rr()),t.PTR_SIZE=4,R?t:new Promise((u,c)=>{w=u,x=c})}var Rc,xo,z0=K(()=>{"use strict";Rc=vo,xo=globalThis.self?.name?.startsWith("em-pthread"),xo&&vo()}),Ni,Pn,ko,Ge,Dc,Nr,So,To,Ui,Io,Pi,Nc,qi,Uc,na=K(()=>{"use strict";ia(),Ni=typeof location>"u"?void 0:location.origin,Pn=import.meta.url>"file:"&&import.meta.url<"file;",ko=()=>{if(Pn){let e=URL;return new URL(new e("ort.bundle.min.mjs",import.meta.url).href,Ni).href}return import.meta.url},Ge=ko(),Dc=()=>{if(Ge&&!Ge.startsWith("blob:"))return Ge.substring(0,Ge.lastIndexOf("/")+1)},Nr=(e,t)=>{try{let r=t??Ge;return(r?new URL(e,r):new URL(e)).origin===Ni}catch{return!1}},So=(e,t)=>{let r=t??Ge;try{return(r?new URL(e,r):new URL(e)).href}catch{return}},To=(e,t)=>`${t??"./"}${e}`,Ui=async e=>{let t=await(await fetch(e,{credentials:"same-origin"})).blob();return URL.createObjectURL(t)},Io=async e=>(await import(e)).default,Pi=(C0(),vr(Oc)).default,Nc=async()=>{if(!Ge)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(Nr(Ge))return[void 0,Pi()];let e=await Ui(Ge);return[e,Pi(e)]},qi=(z0(),vr(Bc)).default,Uc=async(e,t,r,i)=>{let n=qi&&!(e||t);if(n)if(Ge)n=Nr(Ge)||i&&!r;else if(i&&!r)n=!0;else throw new Error("cannot determine the script source URL.");if(n)return[void 0,qi];{let a="ort-wasm-simd-threaded.jsep.mjs",s=e??So(a,t),o=r&&s&&!Nr(s,t),l=o?await Ui(s):s??To(a,t);return[o?l:void 0,await Io(l)]}}}),Li,Ur,sr,Wi,Eo,Co,zo,aa,ze,Vt=K(()=>{"use strict";na(),Ur=!1,sr=!1,Wi=!1,Eo=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},Co=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},zo=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},aa=async e=>{if(Ur)return Promise.resolve();if(sr)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(Wi)throw new Error("previous call to 'initializeWebAssembly()' failed.");sr=!0;let t=e.initTimeout,r=e.numThreads;if(e.simd!==!1){if(e.simd==="relaxed"){if(!zo())throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.")}else if(!Co())throw new Error("WebAssembly SIMD is not supported in the current environment.")}let i=Eo();r>1&&!i&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+r+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),e.numThreads=r=1);let n=e.wasmPaths,a=typeof n=="string"?n:void 0,s=n?.mjs,o=s?.href??s,l=n?.wasm,d=l?.href??l,h=e.wasmBinary,[p,f]=await Uc(o,a,r>1,!!h||!!d),_=!1,m=[];if(t>0&&m.push(new Promise(w=>{setTimeout(()=>{_=!0,w()},t)})),m.push(new Promise((w,x)=>{let $={numThreads:r};if(h)$.wasmBinary=h,$.locateFile=b=>b;else if(d||a)$.locateFile=b=>d??a+b;else if(o&&o.indexOf("blob:")!==0)$.locateFile=b=>new URL(b,o).href;else if(p){let b=Dc();b&&($.locateFile=S=>b+S)}f($).then(b=>{sr=!1,Ur=!0,Li=b,w(),p&&URL.revokeObjectURL(p)},b=>{sr=!1,Wi=!0,x(b)})})),await Promise.race(m),_)throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},ze=()=>{if(Ur&&Li)return Li;throw new Error("WebAssembly is not initialized yet.")}}),rt,ti,Te,sa=K(()=>{"use strict";Vt(),rt=(e,t)=>{let r=ze(),i=r.lengthBytesUTF8(e)+1,n=r._malloc(i);return r.stringToUTF8(e,n,i),t.push(n),n},ti=(e,t,r,i)=>{if(typeof e=="object"&&e!==null){if(r.has(e))throw new Error("Circular reference in options");r.add(e)}Object.entries(e).forEach(([n,a])=>{let s=t?t+n:n;if(typeof a=="object")ti(a,s+".",r,i);else if(typeof a=="string"||typeof a=="number")i(s,a.toString());else if(typeof a=="boolean")i(s,a?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof a}`)})},Te=e=>{let t=ze(),r=t.stackSave();try{let i=t.PTR_SIZE,n=t.stackAlloc(2*i);t._OrtGetLastError(n,n+i);let a=Number(t.getValue(n,i===4?"i32":"i64")),s=t.getValue(n+i,"*"),o=s?t.UTF8ToString(s):"";throw new Error(`${e} ERROR_CODE: ${a}, ERROR_MESSAGE: ${o}`)}finally{t.stackRestore(r)}}}),Pc,A0=K(()=>{"use strict";Vt(),sa(),Pc=e=>{let t=ze(),r=0,i=[],n=e||{};try{if(e?.logSeverityLevel===void 0)n.logSeverityLevel=2;else if(typeof e.logSeverityLevel!="number"||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log severity level is not valid: ${e.logSeverityLevel}`);if(e?.logVerbosityLevel===void 0)n.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!="number"||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);e?.terminate===void 0&&(n.terminate=!1);let a=0;return e?.tag!==void 0&&(a=rt(e.tag,i)),r=t._OrtCreateRunOptions(n.logSeverityLevel,n.logVerbosityLevel,!!n.terminate,a),r===0&&Te("Can't create run options."),e?.extra!==void 0&&ti(e.extra,"",new WeakSet,(s,o)=>{let l=rt(s,i),d=rt(o,i);t._OrtAddRunConfigEntry(r,l,d)!==0&&Te(`Can't set a run config entry: ${s} - ${o}.`)}),[r,i]}catch(a){throw r!==0&&t._OrtReleaseRunOptions(r),i.forEach(s=>t._free(s)),a}}}),Ao,Oo,Mo,zt,Bo,qc,O0=K(()=>{"use strict";Vt(),sa(),Ao=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"layout":return 3;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}},Oo=e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}},Mo=e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some(r=>(typeof r=="string"?r:r.name)==="webgpu")&&(e.enableMemPattern=!1)},zt=(e,t,r,i)=>{let n=rt(t,i),a=rt(r,i);ze()._OrtAddSessionConfigEntry(e,n,a)!==0&&Te(`Can't set a session config entry: ${t} - ${r}.`)},Bo=async(e,t,r)=>{let i=t.executionProviders;for(let n of i){let a=typeof n=="string"?n:n.name,s=[];switch(a){case"webnn":if(a="WEBNN",zt(e,"session.disable_quant_qdq","1",r),zt(e,"session.disable_qdq_constant_folding","1",r),typeof n!="string"){let p=n?.deviceType;p&&zt(e,"deviceType",p,r)}break;case"webgpu":if(a="JS",typeof n!="string"){let p=n;if(p?.preferredLayout){if(p.preferredLayout!=="NCHW"&&p.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${p.preferredLayout}`);zt(e,"preferredLayout",p.preferredLayout,r)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${a}`)}let o=rt(a,r),l=s.length,d=0,h=0;if(l>0){d=ze()._malloc(l*ze().PTR_SIZE),r.push(d),h=ze()._malloc(l*ze().PTR_SIZE),r.push(h);for(let p=0;p<l;p++)ze().setValue(d+p*ze().PTR_SIZE,s[p][0],"*"),ze().setValue(h+p*ze().PTR_SIZE,s[p][1],"*")}await ze()._OrtAppendExecutionProvider(e,o,d,h,l)!==0&&Te(`Can't append execution provider: ${a}.`)}},qc=async e=>{let t=ze(),r=0,i=[],n=e||{};Mo(n);try{let a=Ao(n.graphOptimizationLevel??"all"),s=Oo(n.executionMode??"sequential"),o=typeof n.logId=="string"?rt(n.logId,i):0,l=n.logSeverityLevel??2;if(!Number.isInteger(l)||l<0||l>4)throw new Error(`log severity level is not valid: ${l}`);let d=n.logVerbosityLevel??0;if(!Number.isInteger(d)||d<0||d>4)throw new Error(`log verbosity level is not valid: ${d}`);let h=typeof n.optimizedModelFilePath=="string"?rt(n.optimizedModelFilePath,i):0;if(r=t._OrtCreateSessionOptions(a,!!n.enableCpuMemArena,!!n.enableMemPattern,s,!!n.enableProfiling,0,o,l,d,h),r===0&&Te("Can't create session options."),n.executionProviders&&await Bo(r,n,i),n.enableGraphCapture!==void 0){if(typeof n.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${n.enableGraphCapture}`);zt(r,"enableGraphCapture",n.enableGraphCapture.toString(),i)}if(n.freeDimensionOverrides)for(let[p,f]of Object.entries(n.freeDimensionOverrides)){if(typeof p!="string")throw new Error(`free dimension override name must be a string: ${p}`);if(typeof f!="number"||!Number.isInteger(f)||f<0)throw new Error(`free dimension override value must be a non-negative integer: ${f}`);let _=rt(p,i);t._OrtAddFreeDimensionOverride(r,_,f)!==0&&Te(`Can't set a free dimension override: ${p} - ${f}.`)}return n.extra!==void 0&&ti(n.extra,"",new WeakSet,(p,f)=>{zt(r,p,f,i)}),[r,i]}catch(a){throw r!==0&&t._OrtReleaseSessionOptions(r)!==0&&Te("Can't release session options."),i.forEach(s=>t._free(s)),a}}}),Dt,ft,Nt,li,ri,oa,ua,qn,ce=K(()=>{"use strict";Dt=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data type: ${e}`)}},ft=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw new Error(`unsupported data type: ${e}`)}},Nt=(e,t)=>{let r=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],i=typeof t=="number"?t:t.reduce((n,a)=>n*a,1);return r>0?Math.ceil(i*r):void 0},li=e=>{switch(e){case"float16":return typeof Float16Array<"u"?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${e}`)}},ri=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}},oa=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",ua=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint64"||e==="int8"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",qn=e=>{switch(e){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${e}`)}}}),la,Lc=K(()=>{"use strict";ia(),la=async e=>{if(typeof e=="string"){let t=await fetch(e);if(!t.ok)throw new Error(`failed to load external data file: ${e}`);let r=t.headers.get("Content-Length"),i=r?parseInt(r,10):0;if(i<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw new Error(`failed to load external data file: ${e}, no response body.`);let n=t.body.getReader(),a;try{a=new ArrayBuffer(i)}catch(o){if(o instanceof RangeError){let l=Math.ceil(i/65536);a=new WebAssembly.Memory({initial:l,maximum:l}).buffer}else throw o}let s=0;for(;;){let{done:o,value:l}=await n.read();if(o)break;let d=l.byteLength;new Uint8Array(a,s,d).set(l),s+=d}return new Uint8Array(a,0,i)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),Ro,Do,No,Uo,da,Po,ve,mt=K(()=>{"use strict";ce(),Ro=["V","I","W","E","F"],Do=(e,t)=>{console.log(`[${Ro[e]},${new Date().toISOString()}]${t}`)},da=(e,t)=>{No=e,Uo=t},Po=(e,t)=>{let r=ri(e),i=ri(No);r>=i&&Do(r,typeof t=="function"?t():t)},ve=(...e)=>{Uo&&Po(...e)}}),qo,Jt,D,ii,Wc,Vc,Gc,fe=K(()=>{"use strict";qo=class{static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}},Jt=class{static calcShape(e,t,r=!1){let i=e.length,n=t.length;if(i===0)return t;if(n===0)return e;let a=Math.max(e.length,t.length),s=new Array(a);if(r){if(i<2||n<2)return;let o=qo.calcMatMulShape([e[i-2],e[i-1]],[t[n-2],t[n-1]]);if(o===void 0)return;[s[a-2],s[a-1]]=o}for(let o=r?3:1;o<=a;o++){let l=i-o<0?1:e[i-o],d=n-o<0?1:t[n-o];if(l!==d&&l>1&&d>1)return;let h=Math.max(l,d);if(l&&d)s[a-o]=Math.max(l,d);else{if(h>1)return;s[a-o]=0}}return s}static isValidBroadcast(e,t){let r=e.length,i=t.length;if(r>i)return!1;for(let n=1;n<=r;n++)if(e[r-n]!==1&&e[r-n]!==t[i-n])return!1;return!0}},D=class Qr{static size(t){return Qr.getSizeFromDimensionRange(t,0,t.length)}static convertShape(t,r=4){let i=t.length;if(i===0)return[];let n=new Array(i),a=i-1;for(;a>=0;){if(t[a]%r===0){n[a]=t[a]/r;break}if(r%t[a]!==0)throw new Error("cannot convert shape");n[a]=1,r/=t[a],a--}for(a--;a>=0;a--)n[a]=t[a];return n}static sizeFromDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return Qr.getSizeFromDimensionRange(t,r,t.length)}static sizeToDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeToDimension as Tensor has ${t.length} dimensions.`);return Qr.getSizeFromDimensionRange(t,0,r)}static getSizeFromDimensionRange(t,r,i){let n=1;for(let a=r;a<i;a++){if(t[a]<0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");n*=Number(t[a])}return n}static computeStrides(t){let r=t.length;if(r===0)return[];if(r===1)return[1];let i=new Array(r);i[r-1]=1,i[r-2]=t[r-1];for(let n=r-3;n>=0;--n)i[n]=i[n+1]*t[n+1];return i}static normalizeAxis(t,r){if(t<-r&&t>=r)throw new Error("unsupported axis for this operation.");return t<0?t+r:t}static normalizeAxes(t,r){return t.map(i=>this.normalizeAxis(i,r??t.length))}static sortBasedOnPerm(t,r){return r?r.map(i=>t[i]):t.slice().reverse()}static padShape(t,r){let i=t.length;return t.map((n,a)=>n+r[a]+r[a+i])}static areEqual(t,r){return t.length!==r.length?!1:t.every((i,n)=>i===r[n])}},ii=class kt{static adjustPoolAttributes(t,r,i,n,a,s){if(!t&&i.length!==r.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(t)for(let o=0;o<r.length-2;o++)o>=i.length?i.push(r[o+2]):i[o]=r[o+2];for(let o=0;o<i.length;o++)if(o<n.length){if(n[o]<0)throw new Error("strides should be greater than or equal to 1")}else n.push(1);for(let o=0;o<i.length;o++)if(o<a.length){if(a[o]<0)throw new Error("dilations should be greater than or equal to 1")}else a.push(1);for(let o=0;o<i.length*2;o++)if(o<s.length){if(s[o]<0)throw new Error("pad should be greater than or equal to 1")}else s.push(0);for(let o=0;o<i.length;o++){if(i[o]<=0)throw new Error("kernel shapes need to be greater than 0");if(s[o]>=i[o]||s[o+i.length]>=i[o])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,r,i,n,a,s,o){if(o){if(a.length!==2*(t.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(r.length!==t.length-2)throw new Error("length of strides should be the length of data dimensions");if(n.length!==t.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let l=0;l<t.length-2;l++)kt.adjustPadAndReturnShape(t[l+(s?1:2)],r[l],i[l],n[l],a,l,l+t.length-2,o)}}static computePoolOutputShape(t,r,i,n,a,s,o,l=0){if(r.length<=0)throw new Error("input shape must be of size greater than 0");let d=[r[0],r[1]];return kt.computeShapeHelper(t,r,d,i,n,a,s,o,l),d}static computeConvOutputShape(t,r,i,n,a,s,o){if(t.length<=0||r.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let l=[t[0],r[0]];return kt.computeShapeHelper(!1,t,l,i,n,a,s,o),l}static computeShapeHelper(t,r,i,n,a,s,o,l,d=0){if(t)for(let h=0;h<r.length-2;h++)i.push(1);else for(let h=0;h<r.length-2;h++)i.push(kt.adjustPadAndReturnShape(r[h+2],n[h],a[h],s[h],o,h,h+r.length-2,l,d))}static computeOutputSize(t,r,i,n,a){let s=Math.floor(t/r)+1;return a===1&&(s=Math.ceil(t/r)+1,(s-1)*r>=i+n&&(s-=1)),s}static adjustPadAndReturnShape(t,r,i,n,a,s,o,l,d=0){let h=i*(n-1)+1;if(l&&l!=="NOTSET")switch(l){case"VALID":return a[s]=0,a[o]=0,kt.computeOutputSize(t-h,r,t,0,d);case"SAME_LOWER":case"SAME_UPPER":if(i!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let p=(Math.floor((t+r-1)/r)-1)*r+n-t;return a[s]=Math.floor(l==="SAME_LOWER"?(p+1)/2:p/2),a[o]=p-a[s],kt.computeOutputSize(t+a[s]+a[o]-h,r,t,a[s],d)}default:throw new Error("Unsupported AutoPad type")}else return kt.computeOutputSize(t+a[s]+a[o]-h,r,t,a[s],d)}},Wc=class{static getShapeOfGemmResult(e,t,r,i,n){if(e.length!==2||r.length!==2)throw new Error("shape need to be of size 2");let a,s,o;t?(a=e[1],s=e[0]):(a=e[0],s=e[1]);let l=-1;if(i?(o=r[0],l=1):(o=r[1],l=0),r[l]!==s)throw new Error("dimension mismatch");if(a<=0||o<=0||s<=0)throw new Error("invalid shape specified");if(n&&!Jt.isValidBroadcast(n,[a,o]))throw new Error("gemm: invalid bias shape for broadcast");return[a,o,s]}},Vc=-34028234663852886e22,Gc=34028234663852886e22}),ca,Hc=K(()=>{"use strict";ce(),ca=(e,t)=>new(li(t))(e)}),Vi,Lo,Gi,Wo,Hi,Vo,Fi,ji,Ki,Go,Fc,M0=K(()=>{"use strict";ce(),mt(),Vi=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),Lo=(e,t)=>{if(t==="int32")return e;let r=Vi.get(t);if(!r)throw new Error(`WebNN backend does not support data type: ${t}`);let i=r/8;if(e.byteLength%i!==0)throw new Error(`Invalid Uint8Array length - must be a multiple of ${i}.`);let n=e.byteLength/i,a=new(li(t))(e.buffer,e.byteOffset,n);switch(t){case"int64":case"uint64":{let s=new Int32Array(n);for(let o=0;o<n;o++){let l=a[o];if(l>2147483647n||l<-2147483648n)throw new Error("Can not convert int64 data to int32 - value out of range.");s[o]=Number(l)}return new Uint8Array(s.buffer)}case"int8":case"uint8":case"uint32":{if(t==="uint32"&&a.some(o=>o>2147483647))throw new Error("Can not convert uint32 data to int32 - value out of range.");let s=Int32Array.from(a,Number);return new Uint8Array(s.buffer)}default:throw new Error(`Unsupported data conversion from ${t} to 'int32'`)}},Gi=(e,t)=>{if(t==="int32")return e;if(e.byteLength%4!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");let r=e.byteLength/4,i=new Int32Array(e.buffer,e.byteOffset,r);switch(t){case"int64":{let n=BigInt64Array.from(i,BigInt);return new Uint8Array(n.buffer)}case"uint64":{if(i.some(a=>a<0))throw new Error("Can not convert int32 data to uin64 - negative value found.");let n=BigUint64Array.from(i,BigInt);return new Uint8Array(n.buffer)}case"int8":{if(i.some(a=>a<-128||a>127))throw new Error("Can not convert int32 data to int8 - value out of range.");let n=Int8Array.from(i,Number);return new Uint8Array(n.buffer)}case"uint8":{if(i.some(n=>n<0||n>255))throw new Error("Can not convert int32 data to uint8 - value out of range.");return Uint8Array.from(i,Number)}case"uint32":{if(i.some(a=>a<0))throw new Error("Can not convert int32 data to uint32 - negative value found.");let n=Uint32Array.from(i,Number);return new Uint8Array(n.buffer)}default:throw new Error(`Unsupported data conversion from 'int32' to ${t}`)}},Wo=1,Hi=()=>Wo++,Vo=new Map([["int8","int32"],["uint8","int32"],["uint32","int32"],["int64","int32"]]),Fi=(e,t)=>{let r=Vi.get(e);if(!r)throw new Error(`WebNN backend does not support data type: ${e}`);return t.length>0?Math.ceil(t.reduce((i,n)=>i*n)*r/8):0},ji=class{constructor(e){this.isDataConverted=!1;let{sessionId:t,context:r,tensor:i,dataType:n,shape:a,fallbackDataType:s}=e;this.sessionId=t,this.mlContext=r,this.mlTensor=i,this.dataType=n,this.tensorShape=a,this.fallbackDataType=s}get tensor(){return this.mlTensor}get type(){return this.dataType}get fallbackType(){return this.fallbackDataType}get shape(){return this.tensorShape}get byteLength(){return Fi(this.dataType,this.tensorShape)}destroy(){ve("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e){if(this.fallbackDataType){let t=await this.mlContext.readTensor(this.mlTensor),r=Gi(new Uint8Array(t),this.dataType);if(e){(e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)).set(r);return}else return new Uint8Array(r).buffer}else return e?this.mlContext.readTensor(this.mlTensor,e):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(e,t,r){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===r.length&&this.tensorShape.every((i,n)=>i===r[n])}setIsDataConverted(e){this.isDataConverted=e}},Ki=class{constructor(e,t){this.tensorManager=e,this.wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,r,i){let n=this.tensorManager.getMLContext(e),a=this.tensorManager.getMLOpSupportLimits(e),s;if(!a?.input.dataTypes.includes(t)){if(s=Vo.get(t),!s||!a?.input.dataTypes.includes(s))throw new Error(`WebNN backend does not support data type: ${t}`);ve("verbose",()=>`[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${t} to ${s}`)}if(this.wrapper){if(this.wrapper.canReuseTensor(n,t,r))return this.wrapper.tensor;if(i){if(this.wrapper.byteLength!==Fi(t,r))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let o=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,t,r,o,!0,!0,s),i&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){let t=e;if(this.wrapper){if(this.wrapper.fallbackType)if(this.wrapper.fallbackType==="int32")t=Lo(e,this.wrapper.type),this.wrapper.setIsDataConverted(!0);else throw new Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);if(e.byteLength===this.wrapper.byteLength){this.wrapper.write(t);return}else ve("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor()}this.activeUpload?this.activeUpload.set(t):this.activeUpload=new Uint8Array(t)}async download(e){if(this.activeUpload){let t=this.wrapper?.isDataConverted?Gi(this.activeUpload,this.wrapper?.type):this.activeUpload;if(e){e instanceof ArrayBuffer?new Uint8Array(e).set(t):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(t);return}else return t.buffer}if(!this.wrapper)throw new Error("Tensor has not been created.");return e?this.wrapper.read(e):this.wrapper.read()}},Go=class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){let t=this.backend.getMLContext(e);if(!t)throw new Error("MLContext not found for session.");return t}getMLOpSupportLimits(e){return this.backend.getMLOpSupportLimits(e)}reserveTensorId(){let e=Hi();return this.tensorTrackersById.set(e,new Ki(this)),e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(t.tensorWrapper))}async ensureTensor(e,t,r,i,n){ve("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${r}, shape: ${i}, copyOld: ${n}}`);let a=this.tensorTrackersById.get(t);if(!a)throw new Error("Tensor not found.");return a.ensureTensor(e,r,i,n)}upload(e,t){let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");r.upload(t)}async download(e,t){ve("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t?.byteLength}}`);let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");return r.download(t)}releaseTensorsForSession(e){for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,r,i){let n=this.getMLContext(e),a=Hi(),s=new ji({sessionId:e,context:n,tensor:t,dataType:r,shape:i});return this.tensorTrackersById.set(a,new Ki(this,s)),this.externalTensors.add(s),a}async getCachedTensor(e,t,r,i,n,a,s){let o=this.getMLContext(e);for(let[d,h]of this.freeTensors.entries())if(h.canReuseTensor(o,t,r)){ve("verbose",()=>`[WebNN] Reusing tensor {dataType: ${t}, ${s?`fallbackDataType: ${s},`:""} shape: ${r}`);let p=this.freeTensors.splice(d,1)[0];return p.sessionId=e,p}ve("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${t}, ${s?`fallbackDataType: ${s},`:""} shape: ${r}}`);let l=await o.createTensor({dataType:s??t,shape:r,dimensions:r,usage:i,writable:n,readable:a});return new ji({sessionId:e,context:o,tensor:l,dataType:t,shape:r,fallbackDataType:s})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},Fc=(...e)=>new Go(...e)}),or,Ho,jc,B0=K(()=>{"use strict";ce(),Vt(),Hc(),M0(),mt(),or=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),Ho=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let r=Object.keys(e).sort(),i=Object.keys(t).sort();return r.length===i.length&&r.every((n,a)=>n===i[a]&&e[n]===t[n])},jc=class{constructor(e){this.tensorManager=Fc(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.sessionGraphOutputs=new Map,this.temporaryGraphInputs=[],this.temporaryGraphOutputs=[],this.temporarySessionTensorIds=new Map,this.mlOpSupportLimitsBySessionId=new Map,da(e.logLevel,!!e.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(e){ve("verbose",()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){ve("verbose",()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let r of t)ve("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${r}}`),this.tensorManager.releaseTensorId(r);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let r=this.mlContextCache.findIndex(i=>i.gpuDevice===e);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:i}),i}}else if(e===void 0){let r=this.mlContextCache.findIndex(i=>i.options===void 0&&i.gpuDevice===void 0);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:i}),i}}let t=this.mlContextCache.findIndex(r=>Ho(r.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;{let r=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:r}),r}}registerMLContext(e,t){this.mlContextBySessionId.set(e,t);let r=this.sessionIdsByMLContext.get(t);r||(r=new Set,this.sessionIdsByMLContext.set(t,r)),r.add(e),this.mlOpSupportLimitsBySessionId.has(e)||this.mlOpSupportLimitsBySessionId.set(e,t.opSupportLimits()),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[]),this.temporaryGraphOutputs.length>0&&(this.sessionGraphOutputs.set(e,this.temporaryGraphOutputs),this.temporaryGraphOutputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e),this.sessionGraphOutputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e),this.mlOpSupportLimitsBySessionId.delete(e);let r=this.sessionIdsByMLContext.get(t);if(r.delete(e),r.size===0){this.sessionIdsByMLContext.delete(t);let i=this.mlContextCache.findIndex(n=>n.mlContext===t);i!==-1&&this.mlContextCache.splice(i,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}getMLOpSupportLimits(e){return this.mlOpSupportLimitsBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){ve("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,t,r,i,n){let a=or.get(r);if(!a)throw new Error(`Unsupported ONNX data type: ${r}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,t,a,i,n)}async createTemporaryTensor(e,t,r){ve("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${r}}`);let i=or.get(t);if(!i)throw new Error(`Unsupported ONNX data type: ${t}`);let n=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,n,i,r,!1);let a=this.temporarySessionTensorIds.get(e);return a?a.push(n):this.temporarySessionTensorIds.set(e,[n]),n}uploadTensor(e,t){if(!ze().shouldTransferToMLTensor)throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");ve("verbose",()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let r=await this.tensorManager.download(e);return ca(r,t)}}registerMLTensor(e,t,r,i){let n=or.get(r);if(!n)throw new Error(`Unsupported ONNX data type: ${r}`);let a=this.tensorManager.registerTensor(e,t,n,i);return ve("verbose",()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${n}, dimensions: ${i}} -> {tensorId: ${a}}`),a}registerGraphInput(e){this.temporaryGraphInputs.push(e)}registerGraphOutput(e){this.temporaryGraphOutputs.push(e)}isGraphInput(e,t){let r=this.sessionGraphInputs.get(e);return r?r.includes(t):!1}isGraphOutput(e,t){let r=this.sessionGraphOutputs.get(e);return r?r.includes(t):!1}isGraphInputOutputTypeSupported(e,t,r=!0){let i=or.get(Dt(t)),n=this.mlOpSupportLimitsBySessionId.get(e);return typeof i>"u"?!1:r?!!n?.input.dataTypes.includes(i):!!n?.output.dataTypes.includes(i)}flush(){}}}),pa=K(()=>{"use strict"}),Xi,Pr,qr,Fo,jo,Yi,Ln,Ko,Kc,R0=K(()=>{"use strict";mt(),pa(),Xi=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),Pr=[],qr=e=>Math.ceil(Number(e)/16)*16,Fo=e=>{for(let t=0;t<Pr.length;t++){let r=Pr[t];if(e<=r)return r}return Math.ceil(e/16)*16},jo=1,Yi=()=>jo++,Ln=async(e,t,r,i)=>{let n=qr(r),a=e.device.createBuffer({size:n,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let s=e.getCommandEncoder();e.endComputePass(),s.copyBufferToBuffer(t,0,a,0,n),e.flush(),await a.mapAsync(GPUMapMode.READ);let o=a.getMappedRange();if(i){let l=i();return l.set(new Uint8Array(o,0,r)),l}else return new Uint8Array(o.slice(0,r))}finally{a.destroy()}},Ko=class{constructor(e){this.backend=e,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[t]of Xi)Pr.push(t),this.freeBuffers.set(t,[]),this.freeUniformBuffers.set(t,[]);this.sessionCount=0}upload(e,t){let r=t.buffer,i=t.byteOffset,n=t.byteLength,a=qr(n),s=this.storageCache.get(e);if(!s)throw new Error("gpu data for uploading does not exist");if(Number(s.originalSize)!==n)throw new Error(`inconsistent data size. gpu data size=${s.originalSize}, data size=${n}`);if(a===n&&i%4===0)this.backend.device.queue.writeBuffer(s.gpuData.buffer,0,r,i,n);else{let o=new Uint8Array(a);o.set(t),this.backend.device.queue.writeBuffer(s.gpuData.buffer,0,o,0,a)}ve("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${e})`)}memcpy(e,t){let r=this.storageCache.get(e);if(!r)throw new Error("source gpu data for memcpy does not exist");let i=this.storageCache.get(t);if(!i)throw new Error("destination gpu data for memcpy does not exist");if(r.originalSize!==i.originalSize)throw new Error("inconsistent source and destination gpu data size");let n=qr(r.originalSize),a=this.backend.getCommandEncoder();this.backend.endComputePass(),a.copyBufferToBuffer(r.gpuData.buffer,0,i.gpuData.buffer,0,n)}registerExternalBuffer(e,t,r){let i;if(r){if(i=r[0],e===r[1])return ve("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, buffer is the same, skip.`),i;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else i=Yi();return this.storageCache.set(i,{gpuData:{id:i,type:0,buffer:e},originalSize:t}),ve("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, registered.`),i}unregisterExternalBuffer(e){e!==void 0&&(this.storageCache.delete(e),ve("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`))}create(e,t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let r=Fo(e),i,n=(t&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,a=(t&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(n||a){let o=(n?this.freeBuffers:this.freeUniformBuffers).get(r);o?o.length>0?i=o.pop():i=this.backend.device.createBuffer({size:r,usage:t}):i=this.backend.device.createBuffer({size:r,usage:t})}else i=this.backend.device.createBuffer({size:r,usage:t});let s={id:Yi(),type:0,buffer:i};return this.storageCache.set(s.id,{gpuData:s,originalSize:Number(e)}),ve("verbose",()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${s.id}`),s}get(e){return this.storageCache.get(e)?.gpuData}release(e){let t=typeof e=="bigint"?Number(e):e,r=this.storageCache.get(t);if(!r){if(this.storageCache.size===0)return 0;throw new Error("releasing data does not exist")}return ve("verbose",()=>`[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${r.gpuData.id}`),this.storageCache.delete(t),this.buffersPending.push(r.gpuData.buffer),r.originalSize}async download(e,t){let r=this.storageCache.get(Number(e));if(!r)throw new Error("data does not exist");await Ln(this.backend,r.gpuData.buffer,r.originalSize,t)}refreshPendingBuffers(){if(this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let e of this.buffersPending){let t=Xi.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let r=this.freeBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let r=this.freeUniformBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e));for(let t of this.buffersPending)e.push(t);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(e){let t=this.capturedPendingBuffers.get(e);t&&(t.forEach(r=>{r.destroy()}),this.capturedPendingBuffers.delete(e)),this.sessionCount-=1,this.sessionCount===0&&(ve("warning",()=>"[WebGPU] Clearing webgpu buffer cache"),this.storageCache.forEach(r=>{r.gpuData.buffer.destroy()}),this.storageCache=new Map)}},Kc=(...e)=>new Ko(...e)}),Xo,Se,Me=K(()=>{"use strict";Xo=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},Se=e=>new Xo(e)}),er,Lr,Ne,De,le,Oe,Wn,Yt,St,oe,ur,q,ae,Xc,ha,Yo,Yc,me=K(()=>{"use strict";ce(),fe(),er=64,Lr=(e,t)=>{if(t===3)throw new Error("vec3 has same alignment as vec4, use vec4 instead");switch(Number(e)){case 10:return t>1?`vec${t}<f16>`:"f16";case 1:return t>1?`vec${t}<f32>`:"f32";case 6:return t>1?`vec${t}<i32>`:"i32";case 12:return t>1?`vec${t}<u32>`:"u32";case 7:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(t!==4)throw new Error("bool must be vec4");return["u32","vec4<bool>"];case 22:return"i32";case 21:return"u32";default:throw new Error(`Unknown data type: ${e}`)}},Ne=(e,t=1)=>{let r=Lr(e,t);return typeof r=="string"?r:r[0]},De=(e,t=1)=>{let r=Lr(e,t);return typeof r=="string"?r:r[1]},le=(...e)=>{let t=[];return e.forEach(r=>{r.length!==0&&t.push({type:12,data:r},{type:12,data:D.computeStrides(r)})}),t},Oe=e=>e%4===0?4:e%2===0?2:1,Wn=(e="f32",t,r="0")=>!t||t===1?`${e}(${r})`:`vec${t}<${e}>(${r})`,Yt=(e,t,r)=>e==="f32"?r:t===1?`f32(${r})`:`vec${t}<f32>(${r})`,St=(e,t)=>t===4?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:t===2?`(${e}.x + ${e}.y)`:t===3?`(${e}.x + ${e}.y + ${e}.z)`:e,oe=(e,t,r,i)=>e.startsWith("uniforms.")&&r>4?typeof t=="string"?i==="f16"?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:i==="f16"?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:r>1?`${e}[${t}]`:e,ur=(e,t,r,i,n)=>{let a=typeof r=="number",s=a?r:r.length,o=[...new Array(s).keys()],l=s<2?"u32":s<=4?`vec${s}<u32>`:`array<u32, ${s}>`,d=Lr(t,n),h=typeof d=="string"?d:d[1],p=typeof d=="string"?d:d[0],f={indices:l,value:h,storage:p,tensor:t},_=R=>typeof R=="string"?R:`${R}u`,m={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},w=a?"uniforms.":"",x=`${w}${e}_shape`,$=`${w}${e}_strides`,b="";for(let R=0;R<s-1;R++)b+=`
    let dim${R} = current / ${oe($,R,s)};
    let rest${R} = current % ${oe($,R,s)};
    indices[${R}] = dim${R};
    current = rest${R};
    `;b+=`indices[${s-1}] = current;`;let S=s<2?"":`
  fn o2i_${e}(offset: u32) -> ${f.indices} {
    var indices: ${f.indices};
    var current = offset;
    ${b}
    return indices;
  }`,I=R=>(m.offsetToIndices=!0,s<2?R:`o2i_${e}(${R})`),T=[];if(s>=2)for(let R=s-1;R>=0;R--)T.push(`${oe($,R,s)} * (indices[${R}])`);let E=s<2?"":`
  fn i2o_${e}(indices: ${f.indices}) -> u32 {
    return ${T.join("+")};
  }`,z=R=>(m.indicesToOffset=!0,s<2?R:`i2o_${e}(${R})`),v=(...R)=>s===0?"0u":`${f.indices}(${R.map(_).join(",")})`,B=(R,te)=>s<2?`${R}`:`${oe(R,te,s)}`,P=(R,te,Z)=>s<2?`${R}=${Z};`:`${oe(R,te,s)}=${Z};`,O={},V=(R,te)=>{m.broadcastedIndicesToOffset=!0;let Z=`${te.name}broadcastedIndicesTo${e}Offset`;if(Z in O)return`${Z}(${R})`;let H=[];for(let Ie=s-1;Ie>=0;Ie--){let L=te.indicesGet("outputIndices",Ie+te.rank-s);H.push(`${B($,Ie)} * (${L} % ${B(x,Ie)})`)}return O[Z]=`fn ${Z}(outputIndices: ${te.type.indices}) -> u32 {
             return ${H.length>0?H.join("+"):"0u"};
           }`,`${Z}(${R})`},F=(R,te)=>(()=>{if(f.storage===f.value)return`${e}[${R}]=${te};`;if(f.storage==="vec2<u32>"&&f.value==="i32")return`${e}[${R}]=vec2<u32>(u32(${te}), select(0u, 0xFFFFFFFFu, ${te} < 0));`;if(f.storage==="vec2<u32>"&&f.value==="u32")return`${e}[${R}]=vec2<u32>(u32(${te}), 0u);`;if(f.storage==="u32"&&f.value==="vec4<bool>")return`${e}[${R}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${te}));`;throw new Error(`not supported combination of storage type ${f.storage} and value type ${f.value} yet`)})(),A=R=>(()=>{if(f.storage===f.value)return`${e}[${R}]`;if(f.storage==="vec2<u32>"&&f.value==="i32")return`i32(${e}[${R}].x)`;if(f.storage==="vec2<u32>"&&f.value==="u32")return`u32(${e}[${R}].x)`;if(f.storage==="u32"&&f.value==="vec4<bool>")return`vec4<bool>(bool(${e}[${R}] & 0xFFu), bool(${e}[${R}] & 0xFF00u), bool(${e}[${R}] & 0xFF0000u), bool(${e}[${R}] & 0xFF000000u))`;throw new Error(`not supported combination of storage type ${f.storage} and value type ${f.value} yet`)})(),N=s<2?"":`
  fn get_${e}ByIndices(indices: ${f.indices}) -> ${h} {
    return ${A(`i2o_${e}(indices)`)};
  }`,X=s<2?"":(()=>{let R=o.map(Z=>`d${Z}: u32`).join(", "),te=o.map(Z=>`d${Z}`).join(", ");return`
  fn get_${e}(${R}) -> ${h} {
    return get_${e}ByIndices(${v(te)});
  }`})(),J=(...R)=>{if(R.length!==s)throw new Error(`indices length must be ${s}`);let te=R.map(_).join(",");return s===0?A("0u"):s===1?A(te[0]):(m.get=!0,m.getByIndices=!0,m.indicesToOffset=!0,`get_${e}(${te})`)},Q=R=>s<2?A(R):(m.getByIndices=!0,m.indicesToOffset=!0,`get_${e}ByIndices(${R})`),ne=s<2?"":`
  fn set_${e}ByIndices(indices: ${f.indices}, value: ${h}) {
    ${F(`i2o_${e}(indices)`,"value")}
  }`,ee=s<2?"":(()=>{let R=o.map(Z=>`d${Z}: u32`).join(", "),te=o.map(Z=>`d${Z}`).join(", ");return`
  fn set_${e}(${R}, value: ${h}) {
    set_${e}ByIndices(${v(te)}, value);
  }`})();return{impl:()=>{let R=[],te=!1;return m.offsetToIndices&&(R.push(S),te=!0),m.indicesToOffset&&(R.push(E),te=!0),m.broadcastedIndicesToOffset&&(Object.values(O).forEach(Z=>R.push(Z)),te=!0),m.set&&(R.push(ee),te=!0),m.setByIndices&&(R.push(ne),te=!0),m.get&&(R.push(X),te=!0),m.getByIndices&&(R.push(N),te=!0),!a&&te&&R.unshift(`const ${x} = ${f.indices}(${r.join(",")});`,`const ${$} = ${f.indices}(${D.computeStrides(r).join(",")});`),R.join(`
`)},type:f,offsetToIndices:I,indicesToOffset:z,broadcastedIndicesToOffset:V,indices:v,indicesGet:B,indicesSet:P,set:(...R)=>{if(R.length!==s+1)throw new Error(`indices length must be ${s}`);let te=R[s];if(typeof te!="string")throw new Error("value must be string");let Z=R.slice(0,s).map(_).join(",");return s===0?F("0u",te):s===1?F(Z[0],te):(m.set=!0,m.setByIndices=!0,m.indicesToOffset=!0,`set_${e}(${Z}, ${te})`)},setByOffset:F,setByIndices:(R,te)=>s<2?F(R,te):(m.setByIndices=!0,m.indicesToOffset=!0,`set_${e}ByIndices(${R}, ${te});`),get:J,getByOffset:A,getByIndices:Q,usage:i,name:e,strides:$,shape:x,rank:s}},q=(e,t,r,i=1)=>ur(e,t,r,"input",i),ae=(e,t,r,i=1)=>ur(e,t,r,"output",i),Xc=(e,t,r)=>ur(e,t,r,"atomicOutput",1),ha=(e,t,r,i=1)=>ur(e,t,r,"internal",i),Yo=class{constructor(e,t){this.normalizedDispatchGroup=e,this.limits=t,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${typeof e=="number"?`${e}u`:e}) { return; }`}mainStart(e=er){let t=typeof e=="number"?e:e[0],r=typeof e=="number"?1:e[1],i=typeof e=="number"?1:e[2];if(t>this.limits.maxComputeWorkgroupSizeX||r>this.limits.maxComputeWorkgroupSizeY||i>this.limits.maxComputeWorkgroupSizeZ)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(t*r*i>this.limits.maxComputeInvocationsPerWorkgroup)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let n=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1,a=n?`@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(local_invocation_id) local_id : vec3<u32>`:`@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`,s=n?`let global_idx = global_id.x;
         let workgroup_index = workgroup_id.x;`:`let workgroup_index = workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
             workgroup_id.y * num_workgroups[0] + workgroup_id.x;
         let global_idx = workgroup_index * ${t*r*i}u + local_idx;`;return`@compute @workgroup_size(${t}, ${r}, ${i})
  fn main(${a}) {
    ${s}
  `}appendVariableUniforms(e){e.rank!==0&&(e.shape.startsWith("uniforms.")&&this.uniforms.push({name:e.shape.replace("uniforms.",""),type:"u32",length:e.rank}),e.strides.startsWith("uniforms.")&&this.uniforms.push({name:e.strides.replace("uniforms.",""),type:"u32",length:e.rank}))}declareVariable(e,t){if(e.usage==="internal")throw new Error("cannot use internal variable with declareVariable(). use registerInternalVariables() instead.");this.variables.push(e),this.appendVariableUniforms(e);let r=e.usage==="input"?"read":"read_write",i=e.usage==="atomicOutput"?"atomic<i32>":e.type.storage;return`@group(0) @binding(${t}) var<storage, ${r}> ${e.name}: array<${i}>;`}declareVariables(...e){return e.map(t=>this.declareVariable(t,this.variableIndex++)).join(`
`)}registerInternalVariable(e){if(e.usage!=="internal")throw new Error("cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.");this.internalVariables.push(e),this.appendVariableUniforms(e)}registerInternalVariables(...e){return e.forEach(t=>this.registerInternalVariable(t)),this}registerUniform(e,t,r=1){return this.uniforms.push({name:e,type:t,length:r}),this}registerUniforms(e){return this.uniforms=this.uniforms.concat(e),this}uniformDeclaration(){if(this.uniforms.length===0)return"";let e=[];for(let{name:t,type:r,length:i}of this.uniforms)if(i&&i>4)r==="f16"?e.push(`@align(16) ${t}:array<mat2x4<${r}>, ${Math.ceil(i/8)}>`):e.push(`${t}:array<vec4<${r}>, ${Math.ceil(i/4)}>`);else{let n=i==null||i===1?r:`vec${i}<${r}>`;e.push(`${t}:${n}`)}return`
      struct Uniforms { ${e.join(", ")} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`}get additionalImplementations(){return this.uniformDeclaration()+this.variables.map(e=>e.impl()).join(`
`)+this.internalVariables.map(e=>e.impl()).join(`
`)}get variablesInfo(){if(this.uniforms.length===0)return;let e=t=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(t)];return this.uniforms.map(t=>[e(t.type),t.length??1])}},Yc=(e,t)=>new Yo(e,t)}),Zo,Zi,Qo,Jo,eu,tu,Fe,Zc,Qc,Tt=K(()=>{"use strict";ce(),fe(),Me(),me(),Zo=(e,t)=>{if(!e||e.length!==1)throw new Error("Transpose requires 1 input.");if(t.length!==0&&t.length!==e[0].dims.length)throw new Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`)},Zi=(e,t)=>t.length!==0?t:[...new Array(e).keys()].reverse(),Qo=(e,t)=>D.sortBasedOnPerm(e,Zi(e.length,t)),Jo=(e,t,r,i)=>{let n=`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`;for(let a=0;a<t;++a)n+=`a[${e[a]}]=i[${a}];`;return n+="return a;}"},eu=(e,t)=>{let r=[],i=[];for(let n=0;n<e.length;++n)e[n]!==1&&r.push(e[n]),e[t[n]]!==1&&i.push(t[n]);return{newShape:r,newPerm:i}},tu=(e,t)=>{let r=0;for(let i=0;i<e.length;++i)if(t[e[i]]!==1){if(e[i]<r)return!1;r=e[i]}return!0},Fe=(e,t)=>{let r=e.dataType,i=e.dims.length,n=Zi(i,t),a=Qo(e.dims,n),s=e.dims,o=a,l=i<2||tu(n,e.dims),d;if(l)return d=m=>{let w=q("input",r,s,4),x=ae("output",r,o,4);return`
  ${m.registerUniform("output_size","u32").declareVariables(w,x)}
  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`},{name:"TransposeCopy",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let m=D.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(m/64/4)},programUniforms:[{type:12,data:Math.ceil(m/4)}]}},getShaderSource:d};let{newShape:h,newPerm:p}=eu(e.dims,n),f=D.areEqual(p,[2,3,1]),_=D.areEqual(p,[3,1,2]);if(h.length===2||f||_){s=f?[h[0],h[1]*h[2]]:_?[h[0]*h[1],h[2]]:h,o=[s[1],s[0]];let m=16;return d=w=>{let x=q("a",r,s.length),$=ae("output",r,o.length);return`
  ${w.registerUniform("output_size","u32").declareVariables(x,$)}
  var<workgroup> tile : array<array<${$.type.value}, ${m+1}>, ${m}>;
  ${w.mainStart([m,m,1])}
    let stride = (uniforms.output_shape[1] - 1) / ${m} + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * ${m}u + local_id.x;
    let input_row = workgroup_id_x * ${m}u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${x.getByIndices(`${x.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * ${m}u + local_id.x;
    let output_row = workgroup_id_y * ${m}u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${$.setByIndices(`${$.type.indices}(output_row, output_col)`,"tile[local_id.x][local_id.y]")}
    }
  }`},{name:"TransposeShared",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let w=D.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(o[1]/m),y:Math.ceil(o[0]/m)},programUniforms:[{type:12,data:w},...le(s,o)]}},getShaderSource:d}}return d=m=>{let w=q("a",r,s.length),x=ae("output",r,o.length);return`
  ${m.registerUniform("output_size","u32").declareVariables(w,x)}

  ${Jo(n,i,w,x)}

  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${x.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${x.setByOffset("global_idx",w.getByIndices("aIndices"))}
  }`},{name:"Transpose",shaderCache:{hint:`${t}`,inputDependencies:["rank"]},getRunData:()=>{let m=D.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:[{type:12,data:m},...le(s,o)]}},getShaderSource:d}},Zc=(e,t)=>{Zo(e.inputs,t.perm),e.compute(Fe(e.inputs[0],t.perm))},Qc=e=>Se({perm:e.perm})}),ru,iu,nu,au,su,ou,uu,lu,du,cu,Ze,Jc,ep,tp,rp,ip,np,ap,sp,op,up,D0=K(()=>{"use strict";ce(),fe(),me(),fa(),Tt(),ru={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},iu={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},nu={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},au={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},su=(e,t)=>{let r=[];for(let i=t-e;i<t;++i)r.push(i);return r},ou=(e,t)=>{let r=[],i=e.length;for(let a=0;a<i;a++)t.indexOf(a)===-1&&r.push(e[a]);let n=t.map(a=>e[a]);return[r,n]},uu=(e,t)=>{let r=e.length+t.length,i=[],n=0;for(let a=0;a<r;a++)t.indexOf(a)===-1?i.push(e[n++]):i.push(1);return i},lu=(e,t)=>{for(let r=0;r<e.length;++r)if(e[e.length-r-1]!==t-1-r)return!1;return!0},du=(e,t)=>{let r=[];if(!lu(e,t)){for(let i=0;i<t;++i)e.indexOf(i)===-1&&r.push(i);e.forEach(i=>r.push(i))}return r},cu=(e,t,r,i,n,a,s)=>{let o=r[0].dims,l=D.size(a),d=D.size(s),h=q("_A",r[0].dataType,o),p=ae("output",n,a),f=64;l===1&&(f=256);let _=`
          var<workgroup> aBestValues : array<f32, ${f}>;
       `,m=w=>`
        ${w.registerUniform("reduceSize","u32").declareVariables(h,p)}
        ${_}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${w.mainStart(f)}

          let outputIndex = global_idx / ${f};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${nu[i]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${f}) {
           let candidate = f32(${h.getByOffset("offset + k")});
           bestValue = ${ru[i]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${f}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${iu[i]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${p.setByOffset("outputIndex",`${i==="mean"?`${p.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${p.type.storage}(${au[i]})`}`)};
         }
        }`;return{name:e,shaderCache:{hint:`${t};${f}`,inputDependencies:["type"]},getShaderSource:m,getRunData:()=>({outputs:[{dims:a,dataType:n}],dispatchGroup:{x:l},programUniforms:[{type:12,data:d}]})}},Ze=(e,t,r,i)=>{let n=e.inputs.length===1?r:Vn(e.inputs,r),a=n.axes;a.length===0&&!n.noopWithEmptyAxes&&(a=e.inputs[0].dims.map((_,m)=>m));let s=D.normalizeAxes(a,e.inputs[0].dims.length),o=s,l=e.inputs[0],d=du(o,e.inputs[0].dims.length);d.length>0&&(l=e.compute(Fe(e.inputs[0],d),{inputs:[0],outputs:[-1]})[0],o=su(o.length,l.dims.length));let[h,p]=ou(l.dims,o),f=h;n.keepDims&&(f=uu(h,s)),e.compute(cu(t,n.cacheKey,[l],i,e.inputs[0].dataType,f,p),{inputs:[l]})},Jc=(e,t)=>{Ze(e,"ReduceMeanShared",t,"mean")},ep=(e,t)=>{Ze(e,"ReduceL1Shared",t,"l1")},tp=(e,t)=>{Ze(e,"ReduceL2Shared",t,"l2")},rp=(e,t)=>{Ze(e,"ReduceLogSumExpShared",t,"logSumExp")},ip=(e,t)=>{Ze(e,"ReduceMaxShared",t,"max")},np=(e,t)=>{Ze(e,"ReduceMinShared",t,"min")},ap=(e,t)=>{Ze(e,"ReduceProdShared",t,"prod")},sp=(e,t)=>{Ze(e,"ReduceSumShared",t,"sum")},op=(e,t)=>{Ze(e,"ReduceSumSquareShared",t,"sumSquare")},up=(e,t)=>{Ze(e,"ReduceLogSumShared",t,"logSum")}}),Qe,pu,ni,Vn,Je,hu,fu,mu,gu,yu,_u,bu,wu,$u,vu,et,lp,dp,cp,pp,hp,fp,mp,gp,yp,_p,fa=K(()=>{"use strict";ce(),fe(),Me(),me(),D0(),Qe=e=>{if(!e||e.length===0||e.length>2)throw new Error("Reduce op requires 1 or 2 inputs.");if(e.length===2&&e[1].dims.length!==1)throw new Error("Invalid axes input dims.")},pu=e=>["","",`var value = ${e.getByIndices("input_indices")};`,""],ni=(e,t,r,i,n,a,s=!1,o=!1)=>{let l=[],d=r[0].dims,h=d.length,p=D.normalizeAxes(n,h),f=!o&&p.length===0;d.forEach((w,x)=>{f||p.indexOf(x)>=0?s&&l.push(1):l.push(w)});let _=l.length,m=D.size(l);return{name:e,shaderCache:t,getShaderSource:w=>{let x=[],$=q("_A",r[0].dataType,h),b=ae("output",a,_),S=i($,b,p),I=S[2];for(let T=0,E=0;T<h;T++)f||p.indexOf(T)>=0?(s&&E++,I=`for(var j${T}: u32 = 0; j${T} < ${d[T]}; j${T}++) {
                  ${S[2].includes("last_index")?`let last_index = j${T};`:""}
                  ${$.indicesSet("input_indices",T,`j${T}`)}
                  ${I}
                }`):(x.push(`${$.indicesSet("input_indices",T,b.indicesGet("output_indices",E))};`),E++);return`

        ${w.registerUniform("output_size","u32").declareVariables($,b)}

        ${w.mainStart()}
          ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${$.type.indices};
          let output_indices = ${b.offsetToIndices("global_idx")};

          ${x.join(`
`)}
          ${S[0]}       // init ops for reduce max/min
          ${S[1]}
          ${I}
          ${S[3]}
          ${S.length===4?b.setByOffset("global_idx","value"):S.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:l,dataType:a}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:[{type:12,data:m},...le(d,l)]})}},Vn=(e,t)=>{let r=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(i=>r.push(Number(i))),Se({axes:r,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},Je=(e,t,r,i)=>{let n=e.inputs,a=n.length===1?r:Vn(n,r);e.compute(ni(t,{hint:a.cacheKey,inputDependencies:["rank"]},[n[0]],a.noopWithEmptyAxes&&a.axes.length===0?pu:i,a.axes,n[0].dataType,a.keepDims,a.noopWithEmptyAxes),{inputs:[0]})},hu=(e,t)=>{Qe(e.inputs),Je(e,"ReduceLogSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,"value = log(value);"])},fu=(e,t)=>{Qe(e.inputs),Je(e,"ReduceL1",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += abs(${r.getByIndices("input_indices")});`,""])},mu=(e,t)=>{Qe(e.inputs),Je(e,"ReduceL2",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},gu=(e,t)=>{Qe(e.inputs),Je(e,"ReduceLogSumExp",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += exp(${r.getByIndices("input_indices")});`,"value = log(value);"])},yu=(e,t)=>{Qe(e.inputs),Je(e,"ReduceMax",t,(r,i,n)=>{let a=[];for(let s=0;s<r.rank;s++)(n.indexOf(s)>=0||n.length===0)&&a.push(r.indicesSet("input_indices",s,0));return[`${a.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = max(value, ${r.getByIndices("input_indices")});`,""]})},_u=(e,t)=>{Qe(e.inputs),Je(e,"ReduceMean",t,(r,i,n)=>{let a=1;for(let s=0;s<r.rank;s++)(n.indexOf(s)>=0||n.length===0)&&(a*=e.inputs[0].dims[s]);return["var sum = f32(0);","",`sum += f32(${r.getByIndices("input_indices")});`,`let value = ${i.type.value}(sum / ${a});`]})},bu=(e,t)=>{Qe(e.inputs),Je(e,"ReduceMin",t,(r,i,n)=>{let a=[];for(let s=0;s<r.rank;s++)(n.indexOf(s)>=0||n.length===0)&&a.push(`input_indices[${s}] = 0;`);return[`${a.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = min(value, ${r.getByIndices("input_indices")});`,""]})},wu=(e,t)=>{Qe(e.inputs),Je(e,"ReduceProd",t,(r,i)=>[`var value = ${i.type.storage}(1);`,"",`value *= ${r.getByIndices("input_indices")};`,""])},$u=(e,t)=>{Qe(e.inputs),Je(e,"ReduceSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,""])},vu=(e,t)=>{Qe(e.inputs),Je(e,"ReduceSumSquare",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += t * t;`,""])},et=(e,t,r)=>{if(t.length===0)return r;let i=1,n=1;for(let a=0;a<t.length;a++)t.indexOf(a)===-1?i*=e[a]:n*=e[a];return n<32&&i>1024},lp=(e,t)=>{et(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?_u(e,t):Jc(e,t)},dp=(e,t)=>{et(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?fu(e,t):ep(e,t)},cp=(e,t)=>{et(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?mu(e,t):tp(e,t)},pp=(e,t)=>{et(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?gu(e,t):rp(e,t)},hp=(e,t)=>{et(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?yu(e,t):ip(e,t)},fp=(e,t)=>{et(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?bu(e,t):np(e,t)},mp=(e,t)=>{et(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?wu(e,t):ap(e,t)},gp=(e,t)=>{et(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?$u(e,t):sp(e,t)},yp=(e,t)=>{et(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?vu(e,t):op(e,t)},_p=(e,t)=>{et(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?hu(e,t):up(e,t)}}),Qi,bp,wp,Gn,N0=K(()=>{"use strict";ce(),Me(),fa(),Qi=e=>{if(!e||e.length===0||e.length>2)throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(e[0].dataType!==1)throw new Error("Invalid input type.")},bp=(e,t)=>{Qi(e.inputs);let r=(i,n,a)=>{let s=[];for(let o=0;o<i.rank;o++)(a.indexOf(o)>=0||a.length===0)&&s.push(`input_indices[${o}] = 0;`);return[`${s.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?"<=":"<"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",n.setByOffset("global_idx","best_index")]};e.compute(ni("ArgMin",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},wp=(e,t)=>{Qi(e.inputs);let r=(i,n,a)=>{let s=[];for(let o=0;o<i.rank;o++)(a.indexOf(o)>=0||a.length===0)&&s.push(`input_indices[${o}] = 0;`);return[`${s.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?">=":">"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",n.setByOffset("global_idx","best_index")]};e.compute(ni("argMax",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},Gn=e=>Se(e)}),xu,Wr,ku,Su,Tu,xr,Iu,$p,ma=K(()=>{"use strict";ce(),fe(),pa(),me(),xu=(e,t)=>{let r=e[0],i=e[1],n=e[2],a=e[3],s=e[4],o=e[5];if(s&&o)throw new Error("Attention cannot have both past and attention_bias");if(r.dims.length!==3)throw new Error('Input "input" must have 3 dimensions');let l=r.dims[0],d=r.dims[1],h=r.dims[2];if(n.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimensions');if(i.dims.length!==2)throw new Error('Input "weights" is expected to have 2 dimensions');if(i.dims[0]!==h)throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(n.dims[0]!==i.dims[1])throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let p=n.dims[0]/3,f=p,_=f;if(t.qkvHiddenSizes.length>0){if(t.qkvHiddenSizes.length!==3)throw new Error("qkv_hidden_sizes attribute should have 3 elements");for(let S of t.qkvHiddenSizes)if(S%t.numHeads!==0)throw new Error("qkv_hidden_sizes should be divisible by num_heads");p=t.qkvHiddenSizes[0],f=t.qkvHiddenSizes[1],_=t.qkvHiddenSizes[2]}let m=d;if(p!==f)throw new Error("qkv_hidden_sizes first element should be same as the second");if(n.dims[0]!==p+f+_)throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let w=0;if(s){if(f!==_)throw new Error('Input "past" expect k_hidden_size == v_hidden_size');if(s.dims.length!==5)throw new Error('Input "past" must have 5 dimensions');if(s.dims[0]!==2)throw new Error('Input "past" first dimension must be 2');if(s.dims[1]!==l)throw new Error('Input "past" second dimension must be batch_size');if(s.dims[2]!==t.numHeads)throw new Error('Input "past" third dimension must be num_heads');if(s.dims[4]!==f/t.numHeads)throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');t.pastPresentShareBuffer||(w=s.dims[3])}let x=m+w,$=-1,b=0;if(a)throw new Error("Mask not supported");if(s)throw new Error("past is not supported");if(o){if(o.dims.length!==4)throw new Error('Input "attention_bias" must have 4 dimensions');if(o.dims[0]!==l||o.dims[1]!==t.numHeads||o.dims[2]!==d||o.dims[3]!==x)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:l,sequenceLength:d,pastSequenceLength:w,kvSequenceLength:m,totalSequenceLength:x,maxSequenceLength:$,inputHiddenSize:h,hiddenSize:p,vHiddenSize:_,headSize:Math.floor(p/t.numHeads),vHeadSize:Math.floor(_/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:b,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},Wr=(e,t,r)=>t&&e?`
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
    `,ku=(e,t,r,i,n,a,s,o)=>{let l=Oe(s?1:a),d=64,h=a/l;h<d&&(d=32);let p=Math.ceil(a/l/d),f=[{type:12,data:t},{type:12,data:r},{type:12,data:i},{type:12,data:n},{type:12,data:h},{type:12,data:p}],_=Ne(e.dataType,l),m=De(1,l),w=["type"];s&&w.push("type"),o&&w.push("type");let x=$=>{let b=ae("x",e.dataType,e.dims,l),S=[b],I=s?q("seq_lens",s.dataType,s.dims):void 0;I&&S.push(I);let T=o?q("total_sequence_length_input",o.dataType,o.dims):void 0;T&&S.push(T);let E=De(e.dataType),z=[{name:"batch_size",type:"u32"},{name:"num_heads",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"sequence_length",type:"u32"},{name:"total_sequence_length",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${d}>;
  var<workgroup> thread_sum: array<f32, ${d}>;
  ${$.registerUniforms(z).declareVariables(...S)}
  ${$.mainStart([d,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${Wr(I,T,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${d}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${s?"u32(past_sequence_length + workgroup_id.y + 1)":"total_sequence_length"};
    var thread_max_vector = ${m}(-3.4028234663852886e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${m}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(l){case 1:return"thread_max_vector";case 2:return"max(thread_max_vector.x, thread_max_vector.y)";case 4:return"max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";default:throw new Error(`Unsupported components: ${l}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.4028234663852886e+38f);
    for (var i = 0u; i < ${d}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${m}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${m}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(l){case 1:return"sum_vector";case 2:return"sum_vector.x + sum_vector.y";case 4:return"sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";default:throw new Error(`Unsupported components: ${l}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${d}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${b.type.value}(${E}(1.0) / ${E}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${m}(x[offset + i]);
        x[offset + i] = ${b.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${s?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${b.type.value}(${E}(0));
        }`:""};
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${d};${_};${l}`,inputDependencies:w},getShaderSource:x,getRunData:()=>({outputs:[],dispatchGroup:{x:1,y:n,z:t*r},programUniforms:f})}},Su=(e,t,r,i,n,a,s,o,l)=>{let d=s+a.kvSequenceLength,h=[a.batchSize,a.numHeads,a.sequenceLength,d],p=e>1&&i,f=a.kvNumHeads?a.kvNumHeads:a.numHeads,_=p?[a.batchSize,f,d,a.headSize]:void 0,m=a.nReps?a.nReps:1,w=a.scale===0?1/Math.sqrt(a.headSize):a.scale,x=Oe(a.headSize),$=a.headSize/x,b=12,S={x:Math.ceil(d/b),y:Math.ceil(a.sequenceLength/b),z:a.batchSize*a.numHeads},I=[{type:12,data:a.sequenceLength},{type:12,data:$},{type:12,data:d},{type:12,data:a.numHeads},{type:12,data:a.headSize},{type:1,data:w},{type:12,data:s},{type:12,data:a.kvSequenceLength},{type:12,data:m}],T=p&&i&&D.size(i.dims)>0,E=["type","type"];T&&E.push("type"),n&&E.push("type"),o&&E.push("type"),l&&E.push("type");let z=[{dims:h,dataType:t.dataType,gpuDataType:0}];p&&z.push({dims:_,dataType:t.dataType,gpuDataType:0});let v=B=>{let P=q("q",t.dataType,t.dims,x),O=q("key",r.dataType,r.dims,x),V=[P,O];if(T){let ne=q("past_key",i.dataType,i.dims,x);V.push(ne)}n&&V.push(q("attention_bias",n.dataType,n.dims));let F=o?q("seq_lens",o.dataType,o.dims):void 0;F&&V.push(F);let A=l?q("total_sequence_length_input",l.dataType,l.dims):void 0;A&&V.push(A);let N=ae("output",t.dataType,h),X=[N];p&&X.push(ae("present_key",t.dataType,_,x));let J=De(1,x),Q=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${b}u;

  var<workgroup> tileQ: array<${P.type.storage}, ${b*b}>;
  var<workgroup> tileK: array<${P.type.storage}, ${b*b}>;
  ${B.registerUniforms(Q).declareVariables(...V,...X)}
  ${B.mainStart([b,b,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${m===1?"headIdx":"headIdx / uniforms.n_reps"};
    let kv_num_heads = ${m===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${Wr(F,A,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${T&&p?"let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;":""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${p?"let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;":""}
    var value = ${J}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${T&&p?`
              if (n + local_id.y < past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else if (n + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
                tileK[idx] = key[kOffset + (n + local_id.y - past_sequence_length) * uniforms.K + w + local_id.x];
              }`:`
          if (n + local_id.y < uniforms.kv_sequence_length) {
            tileK[idx] = key[kOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
          }`}
      ${p?`if (n + local_id.y < present_sequence_length) {
        present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];
      }`:""}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
          value += ${J}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(x){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw new Error(`Unsupported components: ${x}`)}})()};
        output[outputIdx] = ${N.type.value} (sum * uniforms.alpha) + ${n?"attention_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${x};${n!==void 0};${i!==void 0};${e}`,inputDependencies:E},getRunData:()=>({outputs:z,dispatchGroup:S,programUniforms:I}),getShaderSource:v}},Tu=(e,t,r,i,n,a,s=void 0,o=void 0)=>{let l=a+n.kvSequenceLength,d=n.nReps?n.nReps:1,h=n.vHiddenSize*d,p=e>1&&i,f=n.kvNumHeads?n.kvNumHeads:n.numHeads,_=p?[n.batchSize,f,l,n.headSize]:void 0,m=[n.batchSize,n.sequenceLength,h],w=12,x={x:Math.ceil(n.vHeadSize/w),y:Math.ceil(n.sequenceLength/w),z:n.batchSize*n.numHeads},$=[{type:12,data:n.sequenceLength},{type:12,data:l},{type:12,data:n.vHeadSize},{type:12,data:n.numHeads},{type:12,data:n.headSize},{type:12,data:h},{type:12,data:a},{type:12,data:n.kvSequenceLength},{type:12,data:d}],b=p&&i&&D.size(i.dims)>0,S=["type","type"];b&&S.push("type"),s&&S.push("type"),o&&S.push("type");let I=[{dims:m,dataType:t.dataType,gpuDataType:0}];p&&I.push({dims:_,dataType:t.dataType,gpuDataType:0});let T=E=>{let z=q("probs",t.dataType,t.dims),v=q("v",r.dataType,r.dims),B=[z,v];b&&B.push(q("past_value",i.dataType,i.dims));let P=s?q("seq_lens",s.dataType,s.dims):void 0;s&&B.push(P);let O=o?q("total_sequence_length_input",o.dataType,o.dims):void 0;o&&B.push(O);let V=[ae("output",t.dataType,m)];p&&V.push(ae("present_value",t.dataType,_));let F=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${w}u;
  var<workgroup> tileQ: array<${z.type.value}, ${w*w}>;
  var<workgroup> tileV: array<${z.type.value}, ${w*w}>;
  ${E.registerUniforms(F).declareVariables(...B,...V)}
  ${E.mainStart([w,w,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${d===1?"headIdx":"headIdx / uniforms.n_reps"};
   let kv_num_heads = ${d===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${Wr(P,O,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${b&&p?"let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;":""};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${p?"let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;":""}
   var value = ${z.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${b&&p?`
        if (w + local_id.y < past_sequence_length) {
          tileV[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else if (w + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
          tileV[idx] = v[vOffset + (w + local_id.y - past_sequence_length) * uniforms.N];
        }
      `:`
            if (w + local_id.y < uniforms.kv_sequence_length) {
              tileV[idx] = v[vOffset + (w + local_id.y) * uniforms.N];
            }`}
        ${p?`
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
  }`};return{name:"AttentionScore",shaderCache:{hint:`${i!==void 0};${e}`,inputDependencies:S},getRunData:()=>({outputs:I,dispatchGroup:x,programUniforms:$}),getShaderSource:T}},xr=(e,t,r,i,n,a,s,o,l,d,h=void 0,p=void 0)=>{let f=Math.min(e.outputCount,1+(s?1:0)+(o?1:0)),_=f>1?s:void 0,m=f>1?o:void 0,w=f>1?d.pastSequenceLength:0,x=w+d.kvSequenceLength,$=l&&D.size(l.dims)>0?l:void 0,b=[t,r];_&&D.size(_.dims)>0&&b.push(_),$&&b.push($),h&&b.push(h),p&&b.push(p);let S=e.compute(Su(f,t,r,_,$,d,w,h,p),{inputs:b,outputs:f>1?[-1,1]:[-1]})[0];e.compute(ku(S,d.batchSize,d.numHeads,w,d.sequenceLength,x,h,p),{inputs:h&&p?[S,h,p]:[S],outputs:[]});let I=[S,i];m&&D.size(m.dims)>0&&I.push(m),h&&I.push(h),p&&I.push(p),e.compute(Tu(f,S,i,m,d,w,h,p),{inputs:I,outputs:f>1?[0,2]:[0]})},Iu=(e,t)=>{let r=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],i=t.sequenceLength,n=t.inputHiddenSize,a=t.headSize,s=12,o={x:Math.ceil(t.headSize/s),y:Math.ceil(t.sequenceLength/s),z:t.batchSize*t.numHeads},l=[e.inputs[0],e.inputs[1],e.inputs[2]],d=[{type:12,data:i},{type:12,data:n},{type:12,data:a},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}],h=p=>{let f=ae("output_q",l[0].dataType,r),_=ae("output_k",l[0].dataType,r),m=ae("output_v",l[0].dataType,r),w=q("input",l[0].dataType,l[0].dims),x=q("weight",l[1].dataType,l[1].dims),$=q("bias",l[2].dataType,l[2].dims),b=w.type.storage,S=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
  const TILE_SIZE = ${s}u;
  var<workgroup> tileInput: array<${b}, ${s*s}>;
  var<workgroup> tileWeightQ: array<${b}, ${s*s}>;
  var<workgroup> tileWeightK: array<${b}, ${s*s}>;
  var<workgroup> tileWeightV: array<${b}, ${s*s}>;
  ${p.registerUniforms(S).declareVariables(w,x,$,f,_,m)}
  ${p.mainStart([s,s,1])}
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
  }`};return e.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:o,programUniforms:d}),getShaderSource:h},{inputs:l,outputs:[-1,-1,-1]})},$p=(e,t)=>{let r=xu(e.inputs,t),[i,n,a]=Iu(e,r);return xr(e,i,n,a,e.inputs[4],void 0,void 0,void 0,e.inputs[5],r)}}),Eu,Cu,zu,vp,U0=K(()=>{"use strict";Xe(),ce(),fe(),Me(),me(),Eu=(e,t)=>{if(!e||e.length!==5)throw new Error("BatchNormalization requires 5 inputs");let r=(i,n,a)=>{let s=n.length;if(s!==i.length)throw new Error(`${a}: num dimensions != ${s}`);n.forEach((o,l)=>{if(o!==i[l])throw new Error(`${a}: dim[${l}] do not match`)})};if(e[0].dims.length>1){let i=t.format==="NHWC"?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);r(e[1].dims,i,"Invalid input scale"),r(e[2].dims,i,"Invalid input B"),r(e[3].dims,i,"Invalid input mean"),r(e[4].dims,i,"Invalid input var")}else r(e[1].dims,[1],"Invalid input scale"),r(e[2].dims,[1],"Invalid input B"),r(e[3].dims,[1],"Invalid input mean"),r(e[4].dims,[1],"Invalid input var")},Cu=(e,t)=>{let{epsilon:r,spatial:i,format:n}=t,a=e[0].dims,s=i?Oe(a[a.length-1]):1,o=n==="NHWC"&&a.length>1?s:1,l=D.size(a)/s,d=i,h=d?a.length:a,p=q("x",e[0].dataType,e[0].dims,s),f=q("scale",e[1].dataType,e[1].dims,o),_=q("bias",e[2].dataType,e[2].dims,o),m=q("inputMean",e[3].dataType,e[3].dims,o),w=q("inputVar",e[4].dataType,e[4].dims,o),x=ae("y",e[0].dataType,h,s),$=()=>{let S="";if(i)S=`let cOffset = ${a.length===1?"0u":n==="NHWC"?`outputIndices[${a.length-1}] / ${s}`:"outputIndices[1]"};`;else if(n==="NCHW")S=`
            ${x.indicesSet("outputIndices","0","0")}
            let cOffset = ${x.indicesToOffset("outputIndices")};`;else{S=`var cIndices = ${f.type.indices}(0);
                       cIndices[0] = outputIndices[${a.length-1}];`;for(let I=1;I<f.rank;I++)S+=`cIndices[${I}] = outputIndices[${I}];`;S+=`let cOffset = ${f.indicesToOffset("cIndices")};`}return S},b=S=>`
  const epsilon = ${r};
  ${S.registerUniform("outputSize","u32").declareVariables(p,f,_,m,w,x)}
  ${S.mainStart()}
  ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${x.offsetToIndices(`global_idx * ${s}`)};
    ${$()}
    let scale = ${f.getByOffset("cOffset")};
    let bias = ${_.getByOffset("cOffset")};
    let inputMean = ${m.getByOffset("cOffset")};
    let inputVar = ${w.getByOffset("cOffset")};
    let x = ${p.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${x.setByOffset("global_idx","value")}
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${t.epsilon}_${t.format}_${i}_${s}`,inputDependencies:d?["rank","type","type","type","type"]:void 0},getShaderSource:b,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:d?[{type:12,data:l},...le(a)]:[{type:12,data:l}]})}},zu=e=>Se(e),vp=(e,t)=>{let{inputs:r,outputCount:i}=e,n=zu({...t,outputCount:i});if(Ee.webgpu.validateInputContent&&Eu(r,n),t.trainingMode)throw new Error("BatchNormalization trainingMode is not supported yet.");e.compute(Cu(r,n))}}),Au,Ou,xp,P0=K(()=>{"use strict";fe(),me(),Au=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![320,640,1280].includes(e[0].dims[2]))throw new Error("number of channels should be 320, 640 or 1280");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},Ou=e=>{let t=e[0].dims,r=e[0].dims[2],i=D.size(t)/4,n=e[0].dataType,a=q("input",n,t,4),s=q("bias",n,[r],4),o=q("residual",n,t,4),l=ae("output",n,t,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)}}),getShaderSource:d=>`
  const channels = ${r}u / 4;
  ${d.declareVariables(a,s,o,l)}

  ${d.mainStart()}
    ${d.guardAgainstOutOfBoundsWorkgroupSizes(i)}
    let value = ${a.getByOffset("global_idx")}
      + ${s.getByOffset("global_idx % channels")} + ${o.getByOffset("global_idx")};
    ${l.setByOffset("global_idx","value")}
  }`}},xp=e=>{Au(e.inputs),e.compute(Ou(e.inputs))}}),Mu,ke,kp,Sp,Tp,Ip,Ep,Cp,zp,Ap,Op,Bu,Mp,Bp,Rp,Dp,yr,Np,Jr,Up,Pp,qp,Lp,Wp,Vp,Gp,Hp,Fp,jp,Kp,Xp,Yp,Zp,Qp,Jp,eh,Ji,th,Hn,Fn,rh,ih,nh,Ru,Du,ah,ga=K(()=>{"use strict";ce(),fe(),Me(),me(),Mu=(e,t,r,i,n,a,s)=>{let o=Math.ceil(t/4),l="";typeof n=="string"?l=`${n}(a)`:l=n("a");let d=q("inputData",r,[o],4),h=ae("outputData",i,[o],4),p=[{name:"vec_size",type:"u32"}];return s&&p.push(...s),`
      ${e.registerUniforms(p).declareVariables(d,h)}

  ${a??""}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${d.getByOffset("global_idx")};
    ${h.setByOffset("global_idx",l)}
  }`},ke=(e,t,r,i,n,a=e.dataType,s,o)=>{let l=[{type:12,data:Math.ceil(D.size(e.dims)/4)}];return s&&l.push(...s),{name:t,shaderCache:{hint:n,inputDependencies:["type"]},getShaderSource:d=>Mu(d,D.size(e.dims),e.dataType,a,r,i,o),getRunData:d=>({outputs:[{dims:e.dims,dataType:a}],dispatchGroup:{x:Math.ceil(D.size(d[0].dims)/64/4)},programUniforms:l})}},kp=e=>{e.compute(ke(e.inputs[0],"Abs","abs"))},Sp=e=>{e.compute(ke(e.inputs[0],"Acos","acos"))},Tp=e=>{e.compute(ke(e.inputs[0],"Acosh","acosh"))},Ip=e=>{e.compute(ke(e.inputs[0],"Asin","asin"))},Ep=e=>{e.compute(ke(e.inputs[0],"Asinh","asinh"))},Cp=e=>{e.compute(ke(e.inputs[0],"Atan","atan"))},zp=e=>{e.compute(ke(e.inputs[0],"Atanh","atanh"))},Ap=e=>Se(e),Op=(e,t)=>{let r;switch(t.to){case 10:r="vec4<f16>";break;case 1:r="vec4<f32>";break;case 12:r="vec4<u32>";break;case 6:r="vec4<i32>";break;case 9:r="vec4<bool>";break;default:throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute(ke(e.inputs[0],"Cast",r,void 0,t.cacheKey,t.to))},Bu=e=>{let t,r,i=e.length>=2&&e[1].data!==0,n=e.length>=3&&e[2].data!==0;switch(e[0].dataType){case 1:t=i?e[1].getFloat32Array()[0]:-34028234663852886e22,r=n?e[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:t=i?e[1].getUint16Array()[0]:64511,r=n?e[2].getUint16Array()[0]:31743;break;default:throw new Error("Unsupport data type")}return Se({min:t,max:r})},Mp=(e,t)=>{let r=t||Bu(e.inputs),i=De(e.inputs[0].dataType);e.compute(ke(e.inputs[0],"Clip",n=>`clamp(${n}, vec4<${i}>(uniforms.min), vec4<${i}>(uniforms.max))`,void 0,r.cacheKey,void 0,[{type:e.inputs[0].dataType,data:r.min},{type:e.inputs[0].dataType,data:r.max}],[{name:"min",type:i},{name:"max",type:i}]),{inputs:[0]})},Bp=e=>{e.compute(ke(e.inputs[0],"Ceil","ceil"))},Rp=e=>{e.compute(ke(e.inputs[0],"Cos","cos"))},Dp=e=>{e.compute(ke(e.inputs[0],"Cosh","cosh"))},yr=e=>Se(e),Np=(e,t)=>{let r=De(e.inputs[0].dataType);e.compute(ke(e.inputs[0],"Elu",i=>`elu_vf32(${i})`,`
  const elu_alpha_ = ${r}(${t.alpha});

  fn elu_f32(a: ${r}) -> ${r} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${r}>) -> vec4<${r}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,t.cacheKey))},Jr=(e="f32")=>`
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
}`,Up=e=>{let t=De(e.inputs[0].dataType);e.compute(ke(e.inputs[0],"Erf",r=>`erf_vf32(${r})`,Jr(t)))},Pp=e=>{e.compute(ke(e.inputs[0],"Exp","exp"))},qp=e=>{e.compute(ke(e.inputs[0],"Floor","floor"))},Lp=e=>{let t=De(e.inputs[0].dataType);e.compute(ke(e.inputs[0],"Gelu",r=>`0.5 * ${r} * (1.0 + erf_vf32(${r} * 0.7071067811865475))`,Jr(t)))},Wp=(e,t)=>{let r=De(e.inputs[0].dataType);e.compute(ke(e.inputs[0],"LeakyRelu",i=>`select(leaky_relu_alpha_ * ${i}, ${i}, ${i} >= vec4<${r}>(0.0))`,`const leaky_relu_alpha_ = ${r}(${t.alpha});`,t.cacheKey))},Vp=e=>{e.compute(ke(e.inputs[0],"Not",t=>`!${t}`))},Gp=e=>{e.compute(ke(e.inputs[0],"Neg",t=>`-${t}`))},Hp=e=>{e.compute(ke(e.inputs[0],"Reciprocal",t=>`1.0/${t}`))},Fp=e=>{let t=De(e.inputs[0].dataType);e.compute(ke(e.inputs[0],"Relu",r=>`select(vec4<${t}>(0.0), ${r}, ${r} > vec4<${t}>(0.0))`))},jp=e=>{e.compute(ke(e.inputs[0],"Sigmoid",t=>`(1.0 / (1.0 + exp(-${t})))`))},Kp=e=>Se(e),Xp=(e,t)=>{let r=De(e.inputs[0].dataType);e.compute(ke(e.inputs[0],"HardSigmoid",i=>`max(vec4<${r}>(0.0), min(vec4<${r}>(1.0), ${t.alpha} * ${i} + vec4<${r}>(${t.beta})))`,void 0,t.cacheKey))},Yp=e=>{let t=De(e.inputs[0].dataType);e.compute(ke(e.inputs[0],"HardSwish",r=>`${r} * max(vec4<${t}>(0.0), min(vec4<${t}>(1.0), vec4<${t}>(${t}(1.0 / 6.0)) * ${r} + vec4<${t}>(0.5)))`))},Zp=e=>{e.compute(ke(e.inputs[0],"Sin","sin"))},Qp=e=>{e.compute(ke(e.inputs[0],"Sinh","sinh"))},Jp=e=>{e.compute(ke(e.inputs[0],"Sqrt","sqrt"))},eh=e=>{e.compute(ke(e.inputs[0],"Tan","tan"))},Ji=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,th=e=>{e.compute(ke(e.inputs[0],"Tanh",Ji))},Hn=(e="f32")=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${Ji("v")};
}
`,Fn=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,rh=e=>{let t=De(e.inputs[0].dataType);e.compute(ke(e.inputs[0],"FastGelu",Fn,Hn(t),void 0,e.inputs[0].dataType))},ih=(e,t)=>{let r=De(e.inputs[0].dataType);return e.compute(ke(e.inputs[0],"ThresholdedRelu",i=>`select(vec4<${r}>(0.0), ${i}, ${i} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${r}>(${t.alpha});`,t.cacheKey)),0},nh=e=>{e.compute(ke(e.inputs[0],"Log","log"))},Ru=(e,t)=>`
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
`,Du=e=>`quick_gelu_impl(${e})`,ah=(e,t)=>{let r=De(e.inputs[0].dataType);e.compute(ke(e.inputs[0],"QuickGelu",Du,Ru(r,t.alpha),t.cacheKey,e.inputs[0].dataType))}}),Nu,Uu,sh,q0=K(()=>{"use strict";fe(),me(),ga(),Nu=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![2560,5120,10240].includes(e[0].dims[2]))throw new Error("hidden state should be 2560, 5120 or 10240");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},Uu=e=>{let t=e[0].dims.slice();t[2]=t[2]/2;let r=q("input",e[0].dataType,e[0].dims,4),i=q("bias",e[0].dataType,[e[0].dims[2]],4),n=ae("output",e[0].dataType,t,4),a=D.size(t)/4,s=Ne(e[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)}}),getShaderSource:o=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2]/4/2}u;

  ${o.declareVariables(r,i,n)}

  ${Jr(s)}

  ${o.mainStart()}
    ${o.guardAgainstOutOfBoundsWorkgroupSizes(a)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${n.setByOffset("global_idx","valueLeft * geluRight")}
  }`}},sh=e=>{Nu(e.inputs),e.compute(Uu(e.inputs))}}),Pu,qu,tt,oh,uh,lh,dh,ch,ph,hh,fh,mh,gh,L0=K(()=>{"use strict";ce(),fe(),me(),Pu=(e,t,r,i,n,a,s,o,l,d,h,p)=>{let f,_;typeof o=="string"?f=_=(b,S)=>`${o}((${b}),(${S}))`:typeof o=="function"?f=_=o:(f=o.scalar,_=o.vector);let m=ae("outputData",h,i.length,4),w=q("aData",l,t.length,4),x=q("bData",d,r.length,4),$;if(n)if(a){let b=D.size(t)===1,S=D.size(r)===1,I=t.length>0&&t[t.length-1]%4===0,T=r.length>0&&r[r.length-1]%4===0;b||S?$=m.setByOffset("global_idx",_(b?`${w.type.value}(${w.getByOffset("0")}.x)`:w.getByOffset("global_idx"),S?`${x.type.value}(${x.getByOffset("0")}.x)`:x.getByOffset("global_idx"))):$=`
            let outputIndices = ${m.offsetToIndices("global_idx * 4u")};
            let offsetA = ${w.broadcastedIndicesToOffset("outputIndices",m)};
            let offsetB = ${x.broadcastedIndicesToOffset("outputIndices",m)};
            ${m.setByOffset("global_idx",_(s||I?w.getByOffset("offsetA / 4u"):`${w.type.value}(${w.getByOffset("offsetA / 4u")}[offsetA % 4u])`,s||T?x.getByOffset("offsetB / 4u"):`${x.type.value}(${x.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else $=m.setByOffset("global_idx",_(w.getByOffset("global_idx"),x.getByOffset("global_idx")));else{if(!a)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");let b=(S,I,T="")=>{let E=`aData[indexA${I}][componentA${I}]`,z=`bData[indexB${I}][componentB${I}]`;return`
            let outputIndices${I} = ${m.offsetToIndices(`global_idx * 4u + ${I}u`)};
            let offsetA${I} = ${w.broadcastedIndicesToOffset(`outputIndices${I}`,m)};
            let offsetB${I} = ${x.broadcastedIndicesToOffset(`outputIndices${I}`,m)};
            let indexA${I} = offsetA${I} / 4u;
            let indexB${I} = offsetB${I} / 4u;
            let componentA${I} = offsetA${I} % 4u;
            let componentB${I} = offsetB${I} % 4u;
            ${S}[${I}] = ${T}(${f(E,z)});
          `};h===9?$=`
            var data = vec4<u32>(0);
            ${b("data",0,"u32")}
            ${b("data",1,"u32")}
            ${b("data",2,"u32")}
            ${b("data",3,"u32")}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:$=`
            ${b("outputData[global_idx]",0)}
            ${b("outputData[global_idx]",1)}
            ${b("outputData[global_idx]",2)}
            ${b("outputData[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(w,x,m)}

        ${p??""}

        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${$}
      }`},qu=(e,t,r,i,n,a,s=r.dataType)=>{let o=r.dims.map(Number),l=i.dims.map(Number),d=!D.areEqual(o,l),h=o,p=D.size(o),f=!1,_=!1,m=[d];if(d){let w=Jt.calcShape(o,l,!1);if(!w)throw new Error("Can't perform binary op on the given tensors");h=w.slice(),p=D.size(h);let x=D.size(o)===1,$=D.size(l)===1,b=o.length>0&&o[o.length-1]%4===0,S=l.length>0&&l[l.length-1]%4===0;m.push(x),m.push($),m.push(b),m.push(S);let I=1;for(let T=1;T<h.length;T++){let E=o[o.length-T],z=l[l.length-T];if(E===z)I*=E;else break}I%4===0?(_=!0,f=!0):(x||$||b||S)&&(f=!0)}else f=!0;return m.push(f),{name:e,shaderCache:{hint:t+m.map(w=>w.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:w=>Pu(w,o,l,h,f,d,_,n,r.dataType,i.dataType,s,a),getRunData:()=>({outputs:[{dims:h,dataType:s}],dispatchGroup:{x:Math.ceil(p/64/4)},programUniforms:[{type:12,data:Math.ceil(D.size(h)/4)},...le(o,l,h)]})}},tt=(e,t,r,i,n,a)=>{e.compute(qu(t,n??"",e.inputs[0],e.inputs[1],r,i,a))},oh=e=>{tt(e,"Add",(t,r)=>`${t}+${r}`)},uh=e=>{tt(e,"Div",(t,r)=>`${t}/${r}`)},lh=e=>{tt(e,"Equal",{scalar:(t,r)=>`u32(${t}==${r})`,vector:(t,r)=>`vec4<u32>(${t}==${r})`},void 0,void 0,9)},dh=e=>{tt(e,"Mul",(t,r)=>`${t}*${r}`)},ch=e=>{let t=q("input",e.inputs[0].dataType,e.inputs[0].dims).type.value;tt(e,"Pow",{scalar:(r,i)=>`pow_custom(${r},${i})`,vector:(r,i)=>`pow_vector_custom(${r},${i})`},`
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
      `)},ph=e=>{tt(e,"Sub",(t,r)=>`${t}-${r}`)},hh=e=>{tt(e,"Greater",{scalar:(t,r)=>`u32(${t}>${r})`,vector:(t,r)=>`vec4<u32>(${t}>${r})`},void 0,void 0,9)},fh=e=>{tt(e,"Less",{scalar:(t,r)=>`u32(${t}<${r})`,vector:(t,r)=>`vec4<u32>(${t}<${r})`},void 0,void 0,9)},mh=e=>{tt(e,"GreaterOrEqual",{scalar:(t,r)=>`u32(${t}>=${r})`,vector:(t,r)=>`vec4<u32>(${t}>=${r})`},void 0,void 0,9)},gh=e=>{tt(e,"LessOrEqual",{scalar:(t,r)=>`u32(${t}<=${r})`,vector:(t,r)=>`vec4<u32>(${t}<=${r})`},void 0,void 0,9)}}),Lu,Wu,Vu,Gu,yh,_h,W0=K(()=>{"use strict";ce(),fe(),Me(),me(),Lu=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");let r=0,i=e[r],n=i.dataType,a=i.dims.length;e.forEach((s,o)=>{if(o!==r){if(s.dataType!==n)throw new Error("input tensors should be one type");if(s.dims.length!==a)throw new Error("input tensors should have the same shape");s.dims.forEach((l,d)=>{if(d!==t&&l!==i.dims[d])throw new Error("non concat dimensions must match")})}})},Wu=(e,t)=>`
  fn calculateInputIndex(index: u32) -> u32 {
    let sizeInConcatAxis = array<u32, ${e}u>(${t});
    for (var i: u32 = 0u; i < ${e}; i += 1u ) {
      if (index < sizeInConcatAxis[i]) {
        return i;
      }
    }
    return ${e}u;
  }`,Vu=(e,t)=>{let r=e.length,i=[];for(let n=0;n<r;++n){let a=t.setByOffset("global_idx",e[n].getByIndices("indices"));r===1?i.push(a):n===0?i.push(`if (inputIndex == ${n}u) { ${a} }`):n===r-1?i.push(`else { ${a} }`):i.push(`else if (inputIndex == ${n}) { ${a} }`)}return i.join(`
`)},Gu=(e,t,r,i)=>{let n=D.size(r),a=new Array(e.length),s=new Array(e.length),o=0,l=[],d=[],h=[{type:12,data:n}];for(let w=0;w<e.length;++w)o+=e[w].dims[t],a[w]=o,d.push(e[w].dims.length),s[w]=q(`input${w}`,i,d[w]),l.push("rank"),h.push({type:12,data:a[w]});for(let w=0;w<e.length;++w)h.push(...le(e[w].dims));h.push(...le(r));let p=ae("output",i,r.length),f=p.indicesGet("indices",t),_=Array.from(Array(a.length).keys()).map(w=>`uniforms.sizeInConcatAxis${w}`).join(","),m=w=>`

  ${(()=>{w.registerUniform("outputSize","u32");for(let x=0;x<e.length;x++)w.registerUniform(`sizeInConcatAxis${x}`,"u32");return w.declareVariables(...s,p)})()}

  ${Wu(a.length,_)}

  ${w.mainStart()}
    ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    var indices = ${p.offsetToIndices("global_idx")};

    let inputIndex = calculateInputIndex(${f});
    if (inputIndex != 0u) {
      let sizeInConcatAxis = array<u32, ${a.length}u>(${_});
      ${f} -= sizeInConcatAxis[inputIndex - 1u];
    }

    ${Vu(s,p)}
  }`;return{name:"Concat",shaderCache:{hint:`${t}`,inputDependencies:l},getRunData:()=>({outputs:[{dims:r,dataType:i}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:h}),getShaderSource:m}},yh=(e,t)=>{let r=e.inputs,i=r[0].dims,n=D.normalizeAxis(t.axis,i.length);Lu(r,n);let a=i.slice();a[n]=r.reduce((o,l)=>o+(l.dims.length>n?l.dims[n]:0),0);let s=r.filter(o=>D.size(o.dims)>0);e.compute(Gu(s,n,a,r[0].dataType),{inputs:s})},_h=e=>Se({axis:e.axis})}),qt,Lt,Wt,ya,Gt=K(()=>{"use strict";ce(),fe(),qt=(e,t,r="f32")=>{switch(e.activation){case"Relu":return`value = max(value, ${t}(0.0));`;case"Sigmoid":return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${t}(${r}(uniforms.clip_min)), ${t}(${r}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${t}(0.0), min(${t}(1.0), ${r}(uniforms.alpha) * value + ${r}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${r}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw new Error(`Unsupported activation ${e.activation}`)}},Lt=(e,t)=>{e.activation==="Clip"?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):e.activation==="HardSigmoid"?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):e.activation==="LeakyRelu"&&t.push({type:1,data:e.alpha})},Wt=(e,t)=>{e.activation==="Clip"?t.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):e.activation==="HardSigmoid"?t.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):e.activation==="LeakyRelu"&&t.push({name:"alpha",type:"f32"})},ya=e=>{let t=e?.activation||"";if(t==="HardSigmoid"){let[r,i]=e?.activation_params||[.2,.5];return{activation:t,alpha:r,beta:i}}else if(t==="Clip"){let[r,i]=e?.activation_params||[Vc,Gc];return{activation:t,clipMax:i,clipMin:r}}else if(t==="LeakyRelu"){let[r]=e?.activation_params||[.01];return{activation:t,alpha:r}}return{activation:t}}}),Pe,bh,_a=K(()=>{"use strict";Pe=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw new Error(`${e}-component is not supported.`)}},bh=e=>`
      ${e?"value = value + getBiasByOutputCoords(coords);":""}
      `}),wh,V0=K(()=>{"use strict";wh=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`}),br,ba,wa=K(()=>{"use strict";ce(),fe(),me(),Gt(),br=(e,t,r,i,n)=>{let a=i-r;return`
      ${Array.from({length:r}).map((s,o)=>`
      if (${oe(t.shape,o,t.rank)} != 1) {
        ${t.indicesSet(e,o,oe(n,o+a,i))}
      } else {
        ${t.indicesSet(e,o,0)}
      }`).join("")}
`},ba=(e,t,r,i,n=!1,a)=>{let s=e[0].dims,o=e[1].dims,l=s[s.length-2],d=o[o.length-1],h=s[s.length-1],p=Oe(d),f=Oe(h),_=Oe(l),m=D.size(r)/p/_,w=e.length>2,x=i?i.slice(0,-2):r.slice(0,-2),$=[D.size(x),l,d],b=[{type:12,data:m},{type:12,data:l},{type:12,data:d},{type:12,data:h}];Lt(t,b),b.push(...le(x,s,o)),w&&b.push(...le(e[2].dims)),b.push(...le($));let S=I=>{let T=ha("batch_dims",e[0].dataType,x.length),E=q("a",e[0].dataType,s.length,f),z=q("b",e[1].dataType,o.length,p),v=ae("output",e[0].dataType,$.length,p),B=Ne(v.type.tensor),P=qt(t,v.type.value,B),O=[E,z],V="";if(w){let N=n?p:1;O.push(q("bias",e[2].dataType,e[2].dims.length,N)),V=`${n?`value += bias[col / ${N}];`:`value += ${v.type.value}(bias[row + i]);`}`}let F=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];Wt(t,F);let A=()=>{let N=`var a_data: ${E.type.value};`;for(let X=0;X<f;X++)N+=`
              let b_data${X} = b[(b_offset + (k + ${X}) * uniforms.N + col) / ${p}];`;for(let X=0;X<_;X++){N+=`a_data = a[(a_offset + (row + ${X}) * uniforms.K + k) / ${f}];`;for(let J=0;J<f;J++)N+=`
            values[${X}] = fma(${z.type.value}(a_data${f===1?"":`[${J}]`}), b_data${J}, values[${X}]);
`}return N};return`
  ${I.registerUniforms(F).registerInternalVariables(T).declareVariables(...O,v)}
  ${I.mainStart()}
    ${I.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${p})) * ${p};
    var index1 = global_idx / (uniforms.N / ${p});
    let stride1 = uniforms.M / ${_};
    let row = (index1 % stride1) * ${_};
    let batch = index1 / stride1;

    ${r.length===2?"":`let batch_indices = ${T.offsetToIndices("batch")};`}

    var a_indices: ${E.type.indices};
    ${br("a_indices",E,E.rank-2,T.rank,"batch_indices")}
    ${E.indicesSet("a_indices",E.rank-2,0)}
    ${E.indicesSet("a_indices",E.rank-1,0)}
    let a_offset = ${E.indicesToOffset("a_indices")};

    var b_indices: ${z.type.indices};
    ${br("b_indices",z,z.rank-2,T.rank,"batch_indices")}
    ${z.indicesSet("b_indices",z.rank-2,0)}
    ${z.indicesSet("b_indices",z.rank-1,0)}
    let b_offset = ${z.indicesToOffset("b_indices")};
    var values: array<${v.type.value}, ${_}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${f}) {
      ${A()}
    }
    for (var i = 0u; i < ${_}u; i++) {
      var value = values[i];
      ${V}
      ${P}
      let cur_indices = ${v.type.indices}(batch, row + i, col);
      let offset = ${v.indicesToOffset("cur_indices")};
      ${v.setByOffset(`offset / ${p}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${t.activation};${p};${f};${_};${n}`,inputDependencies:w?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:a?a(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:b}),getShaderSource:S}}}),Hu,Fu,jn,en,ju,Kn,Ku,ai,$a=K(()=>{"use strict";ce(),fe(),me(),Gt(),wa(),_a(),Hu=(e,t)=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${t?", batchIndices":""});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${t?", batchIndices":""});
        `,Fu=(e,t)=>e?`
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
        }`,jn=(e,t,r="f32",i,n=!1,a=32,s=!1,o=32)=>{let l=t[1]*e[1],d=t[0]*e[0],h=n?l:a,p=n?a:l,f=h/t[0],_=a/t[1];if(!((n&&f===4&&e[1]===4||!n&&(f===3||f===4))&&h%t[0]===0&&a%t[1]===0&&e[0]===4))throw new Error(`If transposeA ${n} is true, innerElementSize ${f} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${f} must be 3 or 4.
  tileAWidth ${h} must be divisible by workgroupSize[0]${t[0]}. tileInner ${a} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${f}<${r}>, ${h/f}>, ${p}>;
var<workgroup> mm_Bsub: array<array<vec4<${r}>, ${d/e[0]}>, ${a}>;

const rowPerThread = ${e[1]};
const colPerThread = ${e[0]};
const innerElementSize = ${f};
const tileInner = ${a};

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

  let num_tiles = ${s?`${Math.ceil(o/a)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
  var kStart = ${s?`i32(globalId.z) * ${o}`:"0"};

  var acc: array<vec4<${r}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${_};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${Hu(n,i)}
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
          ${f===3?"":"let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}

          ${Fu(n,f)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},en=(e,t)=>e?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t?", batchIndices":""});
            `,ju=e=>e?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",Kn=(e,t,r="f32",i,n=!1,a=32,s=!1,o=32,l=!1)=>{let d=e[1]*t[1],h=e[0]*t[0],p=n?d:a,f=n?a:d;if(!(f%t[1]===0&&p%t[0]===0&&a%t[1]===0))throw new Error(`tileAHight ${f} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${p} must be divisible by workgroupSize[0]${t[0]}, tileInner ${a} must be divisible by workgroupSize[1]${t[1]}`);let _=f/t[1],m=p/t[0],w=a/t[1],x=l?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${d};
    let globalColStart = i32(workgroupId.x) * ${h};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${f}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${p}; inputCol = inputCol + ${t[0]}) {
          ${en(n,i)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${a}; inputRow = inputRow + ${t[1]}) {
            for (var inputCol = localCol; inputCol < ${h}; inputCol = inputCol + ${t[0]}) {
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
          let ACached = ${n?`mm_Asub[k][localRow + innerRow * ${t[1]}];`:`mm_Asub[localRow + innerRow * ${t[1]}][k];`}
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
let globalRowStart = i32(workgroupId.y) * ${d};

let tileRowA = i32(localId.y) * ${_};
let tileColA = i32(localId.x) * ${m};
let tileRowB = i32(localId.y) * ${w};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${_}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${m}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${en(n,i)}
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
      ${ju(n)}
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
  var<workgroup> mm_Asub : array<array<${r}, ${p}>, ${f}>;
  var<workgroup> mm_Bsub : array<array<${r}, ${h}>, ${a}>;
  const rowPerThread = ${e[1]};
  const colPerThread = ${e[0]};
  const tileInner = ${a};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${s?"0":"i32(globalId.z)"};
    ${i?`let batchIndices = ${i.offsetToIndices("u32(batch)")};`:""}
    let num_tiles = ${s?`${Math.ceil(o/a)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
    var kStart = ${s?`i32(globalId.z) * ${o}`:"0"};

    var acc : array<array<${r}, colPerThread>, rowPerThread>;
    ${x}
  }
`},Ku=(e,t,r,i,n=!1)=>{let[a,s,o,l]=i,d=Ne(i[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${a.type.indices}) -> ${Pe(e,d)} {
      var value = ${Pe(e,d)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${s.type.indices};
        ${br("aIndices",s,s.rank-2,a.rank,"batchIndices")}
        ${s.indicesSet("aIndices",s.rank-2,"u32(row)")}
        ${s.indicesSet("aIndices",s.rank-1,"u32(colIn)")}
        value = ${s.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${a.type.indices}) -> ${Pe(e,d)} {
      var value = ${Pe(e,d)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${o.type.indices};
        ${br("bIndices",o,o.rank-2,a.rank,"batchIndices")}
        ${o.indicesSet("bIndices",o.rank-2,"u32(row)")}
        ${o.indicesSet("bIndices",o.rank-1,"u32(colIn)")}
        value = ${o.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${Pe(e,d)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${n?"bias[colIn]":`${Pe(e,d)}(bias[row])`};`:""}
        ${r}
        ${l.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},ai=(e,t,r,i,n=!1,a)=>{let s=e[0].dims,o=e[1].dims,l=s.slice(0,-2),d=o.slice(0,-2),h=i?i.slice(0,-2):r.slice(0,-2),p=D.size(h),f=s[s.length-2],_=s[s.length-1],m=o[o.length-1],w=_%4===0&&m%4===0,x=f<=8?[4,1,1]:[4,4,1],$=[8,8,1],b=[Math.ceil(m/$[0]/x[0]),Math.ceil(f/$[1]/x[1]),Math.ceil(p/$[2]/x[2])],S=w?4:1,I=[...l,f,_/S],T=I.length,E=[...d,_,m/S],z=E.length,v=[p,f,m/S],B=[{type:6,data:f},{type:6,data:m},{type:6,data:_}];Lt(t,B),B.push(...le(h,I,E));let P=["rank","rank"],O=e.length>2;O&&(B.push(...le(e[2].dims)),P.push("rank")),B.push(...le(v));let V=F=>{let A=h.length,N=ha("batchDims",e[0].dataType,A,1),X=Ne(e[0].dataType),J=q("a",e[0].dataType,T,S),Q=q("b",e[1].dataType,z,S),ne=ae("result",e[0].dataType,v.length,S),ee=[J,Q];if(O){let Ie=n?S:1;ee.push(q("bias",e[2].dataType,e[2].dims.length,Ie))}let R=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];Wt(t,R);let te=Ne(ne.type.tensor),Z=qt(t,ne.type.value,te),H=Ku(S,O,Z,[N,J,Q,ne],n);return`
  ${F.registerUniforms(R).registerInternalVariables(N).declareVariables(...ee,ne)}
  ${H}
  ${w?jn(x,$,X,N):Kn(x,$,X,N)}
                   `};return{name:"MatMul",shaderCache:{hint:`${x};${t.activation};${w};${n}`,inputDependencies:P},getRunData:()=>({outputs:[{dims:a?a(r):r,dataType:e[0].dataType}],dispatchGroup:{x:b[0],y:b[1],z:b[2]},programUniforms:B}),getShaderSource:V}}}),Xu,$h,G0=K(()=>{"use strict";ce(),mt(),me(),Gt(),_a(),V0(),$a(),Xu=(e,t,r,i,n=!1,a,s=4,o=4,l=4,d="f32")=>{let h=B=>{switch(B){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${d}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${B} is not supported.`)}},p=B=>{switch(B){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw new Error(`innerElementSize ${B} is not supported.`)}},f=e?`
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
    `,m=e?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",w=e?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",x=e?"row":"col",$=e?"col":"row",b=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
    let outRow = ${x} / outWidth;
    let outCol = ${x} % outWidth;

    let WRow = ${$} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${$} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${$} % inChannels;
    var resData = ${Pe(s,d)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${m} && xCol >= 0 && xCol < ${w}) {
      ${f}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${h(s)}
    }
    return resData;`,S=e?t&&i?`
    let col = colIn * ${s};
    ${b}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${b}
    }
    return ${Pe(s,d)}(0.0);`:i&&r?`
    let col = colIn * ${s};
    ${b}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${b}
    }
    return ${Pe(s,d)}(0.0);`,I=e?i&&r?p(o):`
    let col = colIn * ${o};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${p(o)}
    }
    return ${Pe(o,d)}(0.0);`:`
    let col = colIn * ${o};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${p(o)}
    }
    return ${Pe(o,d)}(0.0);`,T=Pe(l,d),E=Pe(e?s:o,d),z=Pe(e?o:s,d),v=qt(a,T,d);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${E} {
      ${e?S:I}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${z} {
      ${e?I:S}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${T}) {
      let col = colIn * ${l};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${_}
      ${bh(n)}
      ${v}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},$h=(e,t,r,i,n,a,s,o,l)=>{let d=t.format==="NHWC",h=d?e[0].dims[3]:e[0].dims[1],p=r[0],f=d?r[2]:r[3],_=d?r[1]:r[2],m=d?r[3]:r[1],w=d&&(h%4===0||h%3===0)&&m%4===0,x=d?m:f*_,$=d?f*_:m,b=[8,8,1],S=i<=8?[4,1,1]:[4,4,1],I=[Math.ceil(x/b[0]/S[0]),Math.ceil($/b[1]/S[1]),Math.ceil(p/b[2]/S[2])];ve("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${I}`);let T=w?d&&h%4!==0?3:4:1,E=b[1]*S[1],z=b[0]*S[0],v=Math.max(b[0]*T,b[1]),B=i%E===0,P=n%z===0,O=a%v===0,V=w?[T,4,4]:[1,1,1],F=[{type:6,data:i},{type:6,data:n},{type:6,data:a},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];Lt(t,F),F.push(...le(e[0].dims,e[1].dims));let A=["rank","rank"];s&&(F.push(...le(e[2].dims)),A.push("rank")),F.push(...le(r));let N=X=>{let J=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];Wt(t,J);let Q=w?4:1,ne=Ne(e[0].dataType),ee=`
      fn setOutputAtIndex(flatIndex : i32, value : ${w?`vec4<${ne}>`:ne}) {
        result[flatIndex] = ${w?`vec4<${ne}>`:ne}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${w?`vec4<${ne}>`:ne}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${w?"/ 4":""}, value);
      }`,R=q("x",e[0].dataType,e[0].dims.length,T===3?1:T),te=q("w",e[1].dataType,e[1].dims.length,Q),Z=[R,te],H=ae("result",e[0].dataType,r.length,Q);if(s){let Ie=q("bias",e[2].dataType,e[2].dims.length,Q);Z.push(Ie),ee+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${w?`vec4<${ne}>`:ne} {
          return bias[coords.${d?"w":"y"}${w?"/ 4":""}];
        }`}return`
        ${wh("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${X.registerUniforms(J).declareVariables(...Z,H)}
        ${ee}
        ${Xu(d,B,P,O,s,t,V[0],V[1],V[2],ne)}
        ${w?jn(S,b,ne,void 0,!d,v):Kn(S,b,ne,void 0,!d,v,!1,void 0,o)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${t.cacheKey};${T};${w};${B};${P};${O};${E};${z};${v}`,inputDependencies:A},getRunData:()=>({outputs:[{dims:l?l(r):r,dataType:e[0].dataType}],dispatchGroup:{x:I[0],y:I[1],z:I[2]},programUniforms:F}),getShaderSource:N}}}),Yu,tn,lr,Zu,rn,Qu,vh,xh,H0=K(()=>{"use strict";ce(),mt(),fe(),me(),Gt(),_a(),Yu=e=>{let t=1;for(let r=0;r<e.length;r++)t*=e[r];return t},tn=e=>typeof e=="number"?[e,e,e]:e,lr=(e,t)=>t<=1?e:e+(e-1)*(t-1),Zu=(e,t,r,i=1)=>{let n=lr(t,i);return Math.floor((e[0]*(r-1)-r+n)/2)},rn=(e,t,r,i,n)=>{n==null&&(n=Zu(e,t[0],i[0]));let a=[0,0,0,r];for(let s=0;s<3;s++)e[s]+2*n>=t[s]&&(a[s]=Math.trunc((e[s]-t[s]+2*n)/i[s]+1));return a},Qu=(e,t,r,i,n,a,s,o,l,d)=>{let h,p,f,_;if(e==="VALID"&&(e=0),typeof e=="number"){h={top:e,bottom:e,left:e,right:e,front:e,back:e};let m=rn([t,r,i,1],[o,l,d],1,[n,a,s],e);p=m[0],f=m[1],_=m[2]}else if(Array.isArray(e)){if(!e.every((w,x,$)=>w===$[0]))throw Error(`Unsupported padding parameter: ${e}`);h={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let m=rn([t,r,i,1],[o,l,d],1,[n,a,s],e[0]);p=m[0],f=m[1],_=m[2]}else if(e==="SAME_UPPER"){p=Math.ceil(t/n),f=Math.ceil(r/a),_=Math.ceil(i/s);let m=(p-1)*n+o-t,w=(f-1)*a+l-r,x=(_-1)*s+d-i,$=Math.floor(m/2),b=m-$,S=Math.floor(w/2),I=w-S,T=Math.floor(x/2),E=x-T;h={top:S,bottom:I,left:T,right:E,front:$,back:b}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:h,outDepth:p,outHeight:f,outWidth:_}},vh=(e,t,r,i,n,a=!1,s="channelsLast")=>{let o,l,d,h,p;if(s==="channelsLast")[o,l,d,h,p]=e;else if(s==="channelsFirst")[o,p,l,d,h]=e;else throw new Error(`Unknown dataFormat ${s}`);let[f,,_,m,w]=t,[x,$,b]=tn(r),[S,I,T]=tn(i),E=lr(_,S),z=lr(m,I),v=lr(w,T),{padInfo:B,outDepth:P,outHeight:O,outWidth:V}=Qu(n,l,d,h,x,$,b,E,z,v),F=a?f*p:f,A=[0,0,0,0,0];return s==="channelsFirst"?A=[o,F,P,O,V]:s==="channelsLast"&&(A=[o,P,O,V,F]),{batchSize:o,dataFormat:s,inDepth:l,inHeight:d,inWidth:h,inChannels:p,outDepth:P,outHeight:O,outWidth:V,outChannels:F,padInfo:B,strideDepth:x,strideHeight:$,strideWidth:b,filterDepth:_,filterHeight:m,filterWidth:w,effectiveFilterDepth:E,effectiveFilterHeight:z,effectiveFilterWidth:v,dilationDepth:S,dilationHeight:I,dilationWidth:T,inShape:e,outShape:A,filterShape:t}},xh=(e,t,r,i,n,a)=>{let s=a==="channelsLast",o=s?e[0].dims[3]:e[0].dims[1],l=!1,d=[64,1,1],h={x:r.map((b,S)=>S)},p=[Math.ceil(Yu(h.x.map(b=>r[b]))/d[0]),1,1];ve("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${p}`);let f=l?s&&o%4!==0?3:4:1,_=D.size(r),m=[{type:12,data:_},{type:12,data:i},{type:12,data:n},{type:12,data:t.strides},{type:12,data:t.dilations}];Lt(t,m),m.push(...le(e[0].dims,e[1].dims));let w=["rank","rank"],x=e.length===3;x&&(m.push(...le(e[2].dims)),w.push("rank")),m.push(...le(r));let $=b=>{let S=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:i.length},{name:"pads",type:"u32",length:n.length},{name:"strides",type:"u32",length:t.strides.length},{name:"dilations",type:"u32",length:t.dilations.length}];Wt(t,S);let I=l?4:1,T=Ne(e[0].dataType),E=q("x",e[0].dataType,e[0].dims.length,f===3?1:f),z=q("W",e[1].dataType,e[1].dims.length,I),v=[E,z],B=ae("result",e[0].dataType,r.length,I),P="";if(x){let F=q("bias",e[2].dataType,e[2].dims.length,I);v.push(F),P+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${l?`vec4<${T}>`:T} {
          return bias[${s?oe("coords",4,5):oe("coords",1,5)}${l?"/ 4":""}];
        }`}let O=Pe(f,T),V=qt(t,O,T);return`
            ${P}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> ${T} {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${E.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> ${T} {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${z.getByIndices("aIndices")};
            }
          ${b.registerUniforms(S).declareVariables(...v,B)}
          ${b.mainStart()}
          ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${B.offsetToIndices("global_idx")};
              let batch = ${oe("coords",0,E.rank)};
              let d2 = ${s?oe("coords",E.rank-1,E.rank):oe("coords",1,E.rank)};
              let xFRCCorner = vec3<u32>(${s?oe("coords",1,E.rank):oe("coords",2,E.rank)},
              ${s?oe("coords",2,E.rank):oe("coords",3,E.rank)},
              ${s?oe("coords",3,E.rank):oe("coords",4,E.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${s?oe("uniforms.x_shape",1,E.rank):oe("uniforms.x_shape",2,E.rank)};
              let xShapeZ = ${s?oe("uniforms.x_shape",2,E.rank):oe("uniforms.x_shape",3,E.rank)};
              let xShapeW = ${s?oe("uniforms.x_shape",3,E.rank):oe("uniforms.x_shape",4,E.rank)};
              let xShapeU = ${s?oe("uniforms.x_shape",4,E.rank):oe("uniforms.x_shape",1,E.rank)};
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
              ${x?"value = value + getBiasByOutputCoords(coords)":""};
              ${V}
              result[global_idx] = ${T}(value);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${t.cacheKey};${s};${f};${x}`,inputDependencies:w},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:p[0],y:p[1],z:p[2]},programUniforms:m}),getShaderSource:$}}}),kh,Sh,F0=K(()=>{"use strict";ce(),fe(),me(),Gt(),kh=(e,t,r,i)=>{let n=e.length>2,a=n?"value += b[output_channel];":"",s=e[0].dims,o=e[1].dims,l=t.format==="NHWC",d=l?r[3]:r[1],h=d/t.group,p=l&&h>=4?Oe(d):1,f=D.size(r)/p,_=[{type:12,data:f},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:h}];Lt(t,_),_.push(...le(s,[o[0],o[1],o[2],o[3]/p]));let m=n?["rank","rank","rank"]:["rank","rank"];_.push(...le([r[0],r[1],r[2],r[3]/p]));let w=x=>{let $=ae("output",e[0].dataType,r.length,p),b=Ne($.type.tensor),S=qt(t,$.type.value,b),I=q("x",e[0].dataType,s.length),T=q("w",e[1].dataType,o.length,p),E=[I,T];n&&E.push(q("b",e[2].dataType,e[2].dims,p));let z=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:t.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];Wt(t,z);let v=l?`
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
            let xVal = ${I.get("batch","xHeight","xWidth","input_channel")};
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

            let xVal = ${I.get("batch","input_channel","xHeight","xWidth")};
            let wVal = ${T.get("output_channel","wInChannel","wHeight","wWidth")};
            value += xVal * wVal;
          }
        }
      }
      `;return`
  ${x.registerUniforms(z).declareVariables(...E,$)}

  ${x.mainStart()}
    ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${$.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${l?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${l?1:2}], outputIndices[${l?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${p} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${l?2:1}];

    var value: ${$.type.value} = ${$.type.value}(0);
    ${v}
    ${a}
    ${S}
    ${$.setByOffset("global_idx","value")}
  }`};return{name:"GroupedConv",shaderCache:{hint:`${t.cacheKey}_${p}`,inputDependencies:m},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:_}),getShaderSource:w}},Sh=(e,t,r,i)=>{let n=e.length>2,a=Oe(r[3]),s=Oe(r[2]),o=D.size(r)/a/s,l=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/a],d=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/a],h=[r[0],r[1],r[2],r[3]/a],p=[{type:12,data:o},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];Lt(t,p),p.push(...le(l,d,h));let f=(s-1)*t.strides[1]+d[1],_=m=>{let w=ae("output",e[0].dataType,h.length,a),x=Ne(w.type.tensor),$=qt(t,w.type.value,x),b=q("x",e[0].dataType,l.length,a),S=q("w",e[1].dataType,d.length,a),I=[b,S];n&&I.push(q("b",e[2].dataType,e[2].dims,a));let T=n?"value += b[output_channel];":"",E=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return Wt(t,E),`
  ${m.registerUniforms(E).declareVariables(...I,w)}
  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${s}u;
    let col = (index1 % width1) * ${s}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${b.type.value}, ${f}>;
    var values: array<${w.type.value}, ${s}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${d[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${f}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${b.get("batch","u32(x_height)","u32(x_width)","input_channel")};
          } else {
            x_vals[i] = ${b.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${d[1]}; w_width++) {
          let w_val = ${S.get("w_height","w_width","0","output_channel")};
          for (var i = 0u; i < ${s}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${s}u; i++) {
      var value = values[i];
      ${T}
      ${$}
      ${w.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${t.cacheKey};${a};${s};${f};${d[0]};${d[1]}`,inputDependencies:n?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:p}),getShaderSource:_}}}),Ju,Vr,el,Gr,Xn,nn,tl,rl,Yn,j0=K(()=>{"use strict";fe(),G0(),H0(),$a(),F0(),Gt(),wa(),Tt(),Ju=(e,t,r,i,n,a)=>{let s=e[0],o=e.slice(a?1:2,a?3:4),l=o.length,d=t[0],h=t.slice(2).map((f,_)=>f+(f-1)*(r[_]-1)),p=o.map((f,_)=>f+i[_]+i[_+l]).map((f,_)=>Math.floor((f-h[_]+n[_])/n[_]));return p.splice(0,0,s),p.splice(a?3:1,0,d),p},Vr=[2,3,1,0],el=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length>5)throw new Error("greater than 5D is not supported");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[1]*t.group;if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");let n=e[0].dims.length-2;if(t.dilations.length!==n)throw new Error(`dilations should be ${n}D`);if(t.strides.length!==n)throw new Error(`strides should be ${n}D`);if(t.pads.length!==n*2)throw new Error(`pads should be ${n*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape")},Gr=(e,t)=>{let r=e.kernelShape.slice();r.length<t[1].dims.length-2&&r.push(...Array(t[1].dims.length-2-r.length).fill(0));for(let a=2;a<t[1].dims.length;++a)r[a-2]===0&&(r[a-2]=t[1].dims[a]);let i=e.pads.slice();ii.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,r,i,e.format==="NHWC",e.autoPad);let n=Object.assign({},e);return Object.assign(n,{kernelShape:r,pads:i}),n},Xn=e=>{let t=ya(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],n=e.dilations,a=e.group,s=e.kernel_shape,o=e.pads,l=e.strides,d=e.w_is_const();return{autoPad:i,format:r,dilations:n,group:a,kernelShape:s,pads:o,strides:l,wIsConst:d,...t,cacheKey:`${e.format};${t.activation};`}},nn=(e,t,r,i)=>{let n=r.format==="NHWC",a=Ju(t[0].dims,t[1].dims,r.dilations,r.pads,r.strides,n);if(r.group!==1){let E=[t[0]];if(n){let z=e.kernelCustomData.wT??e.compute(Fe(t[1],Vr),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=z),E.push(z)}else E.push(t[1]);t.length===3&&E.push(t[2]),!e.adapterInfo.isArchitecture("ampere")&&n&&t[1].dims[0]===r.group&&t[1].dims[1]===1&&r.dilations[0]===1&&r.dilations[1]===1?e.compute(Sh(E,r,a,i),{inputs:E}):e.compute(kh(E,r,a,i),{inputs:E});return}let s=t.length===3,o=t[0].dims[n?1:2],l=t[0].dims[n?2:3],d=t[0].dims[n?3:1],h=t[1].dims[2],p=t[1].dims[3],f=a[n?1:2],_=a[n?2:3],m=a[n?3:1],w=n&&h===o&&p===l&&r.pads[0]===0&&r.pads[1]===0;if(w||h===1&&p===1&&r.dilations[0]===1&&r.dilations[1]===1&&r.strides[0]===1&&r.strides[1]===1&&r.pads[0]===0&&r.pads[1]===0){let E=a[0],z,v,B,P=[];if(n){let F=e.kernelCustomData.wT??e.compute(Fe(t[1],Vr),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];if(r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=F),w){let A=o*l*d;z=t[0].reshape([1,E,A]),v=F.reshape([1,A,m]),B=[1,E,m]}else z=t[0].reshape([E,o*l,d]),v=F.reshape([1,d,m]),B=[E,f*_,m];P.push(z),P.push(v)}else z=t[0].reshape([E,d,o*l]),v=t[1].reshape([1,m,d]),B=[E,m,f*_],P.push(v),P.push(z);s&&P.push(t[2]);let O=B[2],V=P[0].dims[P[0].dims.length-1];O<8&&V<8?e.compute(ba(P,r,a,B,n,i),{inputs:P}):e.compute(ai(P,r,a,B,n,i),{inputs:P});return}let x=!0,$=e.kernelCustomData.wT??e.compute(Fe(t[1],Vr),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=$);let b=[t[0],$];s&&b.push(t[2]);let S=n?f*_:m,I=n?m:f*_,T=h*p*d;e.compute($h(b,r,a,S,I,T,s,x,i),{inputs:b})},tl=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let n=[0,t.pads[0],0,t.pads[1]],a=[1].concat(t.strides),s=[1].concat(t.dilations),o=[1].concat(t.kernelShape),l=Gr({...t,pads:n,strides:a,dilations:s,kernelShape:o},i);nn(e,i,l,d=>r?[d[0],d[2],d[3]]:[d[0],d[1],d[3]])},rl=(e,t,r)=>{let i=r.format==="NHWC"?"channelsLast":"channelsFirst",n=Gr(r,t),a=r.autoPad==="NOTSET"?r.pads:r.autoPad,s=vh(t[0].dims,t[1].dims,r.strides,r.dilations,a,!1,i);e.compute(xh(t,n,s.outShape,[s.filterDepth,s.filterHeight,s.filterWidth],[s.padInfo.front,s.padInfo.top,s.padInfo.left],i))},Yn=(e,t)=>{if(el(e.inputs,t),e.inputs[0].dims.length===3)tl(e,t);else if(e.inputs[0].dims.length===5)rl(e,e.inputs,t);else{let r=Gr(t,e.inputs);nn(e,e.inputs,r)}}}),Th,K0=K(()=>{"use strict";ce(),mt(),fe(),me(),Th=(e,t,r)=>{let i=e.length>2,n=t.outputShape,a=t.format==="NHWC",s=t.group,o=e[1].dims,l=o[2]/s,d=o[3],h=a?Oe(l):1,p=a&&d===1&&l>=4,f=p?Math.floor(l/4)*4:Math.floor(l/h)*h,_=l-f,m=a?Oe(d):1,w=a?d===1?h:m:1,x=D.size(n)/m,$=[Math.ceil(x/64),1,1];ve("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${$}`);let b=["rank","rank"],S=[t.strides[0],t.strides[1]],I=[t.kernelShape[a?1:2],t.kernelShape[a?2:3]],T=[t.dilations[0],t.dilations[1]],E=[I[0]+(t.dilations[0]<=1?0:(t.kernelShape[a?1:2]-1)*(t.dilations[0]-1)),I[1]+(t.dilations[1]<=1?0:(t.kernelShape[a?2:3]-1)*(t.dilations[1]-1))],z=[E[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),E[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],v=[{type:12,data:x},{type:12,data:S},{type:12,data:I},{type:12,data:T},{type:12,data:E},{type:6,data:z},{type:12,data:f},{type:12,data:l},{type:12,data:d},...le(e[0].dims,e[1].dims)];i&&(v.push(...le(e[2].dims)),b.push("rank")),v.push(...le(n));let B=P=>{let O=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:S.length},{name:"filter_dims",type:"u32",length:I.length},{name:"dilations",type:"u32",length:I.length},{name:"effective_filter_dims",type:"u32",length:E.length},{name:"pads",type:"i32",length:z.length},{name:"input_channels_per_group_int",type:"u32"},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],V=Ne(e[0].dataType),F=a?1:2,A=a?2:3,N=a?3:1,X=q("W",e[1].dataType,e[1].dims.length,w),J=q("Dy",e[0].dataType,e[0].dims.length,h),Q=[J,X];i&&Q.push(q("bias",e[2].dataType,[n[N]].length,m));let ne=ae("result",e[0].dataType,n.length,m),ee=()=>{let Z="";if(p)h===4?Z+=`
        let xValue = ${J.getByOffset("x_offset")};
        let wValue = ${X.getByOffset("w_offset")};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;`:h===2?Z+=`
          dotProd = dotProd + dot(vec4<${V}>(${J.getByOffset("x_offset")}, ${J.getByOffset("x_offset + 1u")}), vec4<${V}>(${X.getByOffset("w_offset")}, ${X.getByOffset("w_offset + 1u")}));
          x_offset += 2u;
          w_offset += 2u;`:h===1&&(Z+=`
          dotProd = dotProd + dot(vec4<${V}>(${J.getByOffset("x_offset")}, ${J.getByOffset("x_offset + 1u")}, ${J.getByOffset("x_offset + 2u")}, ${J.getByOffset("x_offset + 3u")}), vec4<${V}>(${X.getByOffset("w_offset")}, ${X.getByOffset("w_offset + 1u")}, ${X.getByOffset("w_offset + 2u")}, ${X.getByOffset("w_offset + 3u")}));
          x_offset += 4u;
          w_offset += 4u;`);else if(Z+=`
                  let xValue = ${a?J.getByOffset(`${J.indicesToOffset(`${J.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${h}`):J.get("batch","inputChannel","idyR","idyC")};
        `,h===1)Z+=`
          let w_offset = ${X.indicesToOffset(`${X.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${X.getByOffset(`w_offset / ${w}`)};
          dotProd = dotProd + xValue * wValue;`;else for(let H=0;H<h;H++)Z+=`
            let wValue${H} = ${X.getByOffset(`${X.indicesToOffset(`${X.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${H}, wOutChannel)`)} / ${w}`)};
            dotProd = dotProd + xValue[${H}] * wValue${H};`;return Z},R=()=>{if(_===0)return"";if(!p)throw new Error(`packInputAs4 ${p} is not true.`);let Z="";if(h===1){Z+="dotProd = dotProd";for(let H=0;H<_;H++)Z+=`
            + ${J.getByOffset(`x_offset + ${H}`)} * ${X.getByOffset(`w_offset + ${H}`)}`;Z+=";"}else if(h===2){if(_!==2)throw new Error(`Invalid inputChannelsRemainder ${_}.`);Z+=`
          let xValue = ${J.getByOffset("x_offset")};
          let wValue = ${X.getByOffset("w_offset")};
          dotProd = dotProd + dot(xValue, wValue);`}return Z},te=`
            let outputIndices = ${ne.offsetToIndices(`global_idx * ${m}`)};
            let batch = ${ne.indicesGet("outputIndices",0)};
            let d1 = ${ne.indicesGet("outputIndices",N)};
            let r = ${ne.indicesGet("outputIndices",F)};
            let c = ${ne.indicesGet("outputIndices",A)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${ne.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${V}(dyRCorner) + ${V}(wR)) / ${V}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${V}(uniforms.Dy_shape[${F}]) || fract(dyR) > 0.0 ||
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
                let dyC = (${V}(dyCCorner) + ${V}(wC)) / ${V}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${V}(uniforms.Dy_shape[${A}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${p?`
                var x_offset = ${J.indicesToOffset(`${J.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${h};
                var w_offset = ${X.indicesToOffset(`${X.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${w};
                  `:""}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${p?4:h}) {
                  ${ee()}
                  inputChannel = inputChannel + ${p?4:h};
                }
                ${R()}
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${i?` + bias[d1 / ${m}]`:""};
            ${ne.setByOffset("global_idx","value")};
          `;return`
    ${P.registerUniforms(O).declareVariables(...Q,ne)}
      ${P.mainStart()}
      ${P.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${te}}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${t.cacheKey};${h}${w}${m}${p}${_}`,inputDependencies:b},getRunData:()=>({dispatchGroup:{x:$[0],y:$[1],z:$[2]},outputs:[{dims:r?r(n):n,dataType:e[0].dataType}],programUniforms:v}),getShaderSource:B}}}),il,nl,al,an,Ih,sl,sn,ol,Eh,X0=K(()=>{"use strict";K0(),Gt(),Tt(),il=(e,t,r,i,n,a)=>(e-1)*t+r+(i-1)*n+1-a,nl=(e,t,r,i,n)=>{let a=Math.floor(e/2);t==="SAME_UPPER"?(r[i]=a,r[n]=e-a):t==="SAME_LOWER"&&(r[i]=e-a,r[n]=a)},al=(e,t,r,i,n,a,s,o,l,d)=>{let h=e.length-2,p=d.length===0;l.length<h&&l.push(...Array(h-l.length).fill(0));let f=e[0],_=t[o?3:1]*n;for(let m=0,w=e.length-h-(o?1:0);m<h;++m,++w){let x=e[w],$=p?x*s[m]:d[m],b=il(x,s[m],a[m],t[w],r[m],$);nl(b,i,a,m,m+h),p&&d.push(s[m]*(x-1)+l[m]+(t[w]-1)*r[m]+1-a[m]-a[m+h])}d.splice(0,0,f),d.splice(o?3:1,0,_)},an=(e,t)=>{let r=e.kernelShape.slice();if(e.kernelShape.length===0||e.kernelShape.reduce((p,f)=>p*f,1)===0){r.length=0;for(let p=2;p<t[1].dims.length;++p)r.push(t[1].dims[p])}let i=e.format==="NHWC";r.splice(0,0,t[1].dims[0]),r.splice(i?3:1,0,t[1].dims[1]);let n=e.pads.slice(),a=e.outputShape.slice(),s=e.outputPadding.slice(),o=t[0].dims,l=e.dilations.slice();if(l.reduce((p,f)=>p+f,0)===0){let p=t[0].dims.length-2;l=new Array(p).fill(1)}let d=e.strides.slice();if(d.reduce((p,f)=>p+f,0)===0){let p=t[0].dims.length-2;d=new Array(p).fill(1)}al(o,r,l,e.autoPad,e.group,n,d,i,s,a);let h=Object.assign({},e);return Object.assign(h,{kernelShape:r,pads:n,outputPadding:s,outputShape:a,dilations:l,strides:d}),h},Ih=e=>{let t=ya(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof e.autoPad>"u"?0:e.autoPad],n=e.dilations,a=e.group??1,s=e.kernelShape,o=e.pads,l=e.strides,d=e.wIsConst(),h=e.outputPadding,p=e.outputShape;return{autoPad:i,format:r,dilations:n,group:a,kernelShape:s,outputPadding:h,outputShape:p,pads:o,strides:l,wIsConst:d,...t,cacheKey:`${e.format};${t.activation};`}},sl=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4&&e[0].dims.length!==3)throw new Error("currently only support 2-dimensional conv");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[0];if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let n=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==n))throw new Error("invalid bias");let a=e[0].dims.length-2;if(t.dilations.reduce((s,o)=>s+o,0)>0&&t.dilations.length!==a)throw new Error(`dilations should be ${a}D`);if(t.strides.reduce((s,o)=>s+o,0)>0&&t.strides.length!==a)throw new Error(`strides should be ${a}D`);if(t.pads.reduce((s,o)=>s+o,0)>0&&t.pads.length!==a*2)throw new Error(`pads should be ${a*2}D`);if(t.outputPadding.length!==a&&t.outputPadding.length!==0)throw new Error(`output_padding should be ${a}D`);if(t.kernelShape.reduce((s,o)=>s+o,0)>0&&t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw new Error("invalid output shape")},sn=(e,t,r,i)=>{let n=e.kernelCustomData.wT??e.compute(Fe(t[1],[2,3,0,1]),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=n);let a=[t[0],n];t.length===3&&a.push(t[2]),e.compute(Th(a,r,i),{inputs:a})},ol=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let n=t.kernelShape;(n.length===0||n[0]===0)&&(n=[e.inputs[1].dims[2]]);let a=t.dilations;(a.length===0||a[0]===0)&&(a=[1]);let s=t.strides;(s.length===0||s[0]===0)&&(s=[1]);let o=t.pads;o.length===0&&(o=[0,0]),o=[0,o[0],0,o[1]],s=[1].concat(s),a=[1].concat(a),n=[1].concat(n);let l=t.outputPadding;l=[0].concat(l);let d=an({...t,pads:o,strides:s,dilations:a,kernelShape:n,outputPadding:l},i);sn(e,i,d,h=>r?[h[0],h[2],h[3]]:[h[0],h[1],h[3]])},Eh=(e,t)=>{if(sl(e.inputs,t),e.inputs[0].dims.length===3)ol(e,t);else{let r=an(t,e.inputs);sn(e,e.inputs,r)}}}),ul,Ch,zh,Y0=K(()=>{"use strict";ce(),fe(),Me(),me(),ul=(e,t,r,i)=>{let n=D.size(t),a=t.length,s=q("input",e,a),o=ae("output",e,a),l=r.dataType===6?r.getInt32Array()[0]:Number(r.getBigInt64Array()[0]),d=D.normalizeAxis(l,a),h=p=>{let f=` i32(${s.indicesGet("inputIndices","uniforms.axis")}) `,_=oe("uniforms.input_shape","uniforms.axis",a),m=i.reverse?f+(i.exclusive?" + 1":""):"0",w=i.reverse?_:f+(i.exclusive?"":" + 1");return`
                ${p.registerUniform("outputSize","u32").registerUniform("axis","u32").declareVariables(s,o)}
                ${p.mainStart()}
                  ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${o.offsetToIndices("global_idx")};
                  var sum = ${o.type.value}(0);
                  let first : i32 = ${m};
                  let last : i32 = ${w};
                  for (var i : i32 = first; i < last; i++) {
                    ${s.indicesSet("inputIndices","uniforms.axis","u32(i)")};
                    sum = sum + ${s.getByIndices("inputIndices")};
                  }
                  ${o.setByOffset("global_idx","sum")};
                }`};return{name:"CumSum",shaderCache:{hint:i.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:[{type:12,data:n},{type:12,data:d},...le(t,t)]}),getShaderSource:h}},Ch=(e,t)=>{let r=e.inputs[0].dims,i=e.inputs[0].dataType,n=e.inputs[1];e.compute(ul(i,r,n,t),{inputs:[0]})},zh=e=>{let t=e.exclusive===1,r=e.reverse===1;return Se({exclusive:t,reverse:r})}}),ll,dl,cl,Ah,Oh,Z0=K(()=>{"use strict";ce(),fe(),Me(),me(),ll=e=>{if(!e||e.length!==1)throw new Error("DepthToSpace requires 1 input.");if(e[0].dims.length!==4)throw new Error("DepthToSpace requires 4D input.")},dl=(e,t,r,i)=>{let n=[];n.push(`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`);for(let a=0;a<t;++a)n.push(r.indicesSet("a",e[a],`i[${a}]`));return n.push("return a;}"),n.join(`
`)},cl=(e,t)=>{let r,i,n,a,s,o,l=t.format==="NHWC",d=t.blocksize,h=t.mode==="DCR";l?([r,i,n,a]=e.dims,s=h?[r,i,n,d,d,a/d**2]:[r,i,n,a/d**2,d,d],o=h?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([r,i,n,a]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],s=h?[r,d,d,a/d**2,i,n]:[r,a/d**2,d,d,i,n],o=h?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let p=e.reshape(s),f=p.dims.length,_=e.dataType,m=q("a",_,f),w=ae("output",_,f),x=$=>`
  ${$.registerUniform("output_size","u32").declareVariables(m,w)}

  ${dl(o,f,m,w)}

  ${$.mainStart()}
    ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${w.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${w.setByOffset("global_idx",m.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:["rank"]},getRunData:$=>{let b=l?[r,i*d,n*d,a/d**2]:[r,a/d**2,i*d,n*d],S=D.size(b),I=p.dims,T=D.sortBasedOnPerm(I,o);return{outputs:[{dims:b,dataType:$[0].dataType}],dispatchGroup:{x:Math.ceil(S/64)},programUniforms:[{type:12,data:S},...le(I,T)]}},getShaderSource:x}},Ah=(e,t)=>{ll(e.inputs),e.compute(cl(e.inputs[0],t))},Oh=e=>Se({blocksize:e.blocksize,mode:e.mode,format:e.format})}),pt,dr,Hr,on,$t,pl,hl,fl,un,ln,dn,ml,gl,cn,yl,Mh,Bh,Q0=K(()=>{"use strict";ce(),fe(),Me(),me(),pt=256,dr=512,Hr=2*Math.PI,on=e=>{let t=[],r=e;for(let i of[4,2,3,5])for(;r%i===0;)t.push(i),r/=i;return r===1?t:void 0},$t=e=>{let t=e.toPrecision(9);return/[.eE]/.test(t)?t:`${t}.0`},pl=(e,t,r,i,n)=>{let a=r/e,s=dr-i,o=d=>`smem[${s}u + base + ${d*t}u]`,l=`  for (var t = local_idx; t < ${a}u; t += ${pt}u) {
`;l+=`    let twiddleIndex = t % ${t}u;
    let angleUnit = f32(twiddleIndex);
`,l+=`    var leg: array<vec2<f32>, 5>;
`;for(let d=0;d<e;d++){let h=`${i}u + t + ${d*a}u`;if(d===0)l+=`    leg[0] = smem[${h}];
`;else{let p=n*Hr*d/(e*t);l+=`    { let a = ${$t(p)} * angleUnit; leg[${d}] = cmul(smem[${h}], vec2<f32>(cos(a), sin(a))); }
`}}if(l+=`    let base = (t / ${t}u) * ${t*e}u + twiddleIndex;
`,e===2)l+=`    ${o(0)} = leg[0] + leg[1];
    ${o(1)} = leg[0] - leg[1];
`;else if(e===4){let d=n<0?"vec2<f32>(oddDiff.y, -oddDiff.x)":"vec2<f32>(-oddDiff.y, oddDiff.x)";l+=`    let evenSum = leg[0] + leg[2]; let evenDiff = leg[0] - leg[2];
`,l+=`    let oddSum = leg[1] + leg[3]; let oddDiff = leg[1] - leg[3];
`,l+=`    let oddRot = ${d};
`,l+=`    ${o(0)} = evenSum + oddSum;
    ${o(1)} = evenDiff + oddRot;
`,l+=`    ${o(2)} = evenSum - oddSum;
    ${o(3)} = evenDiff - oddRot;
`}else for(let d=0;d<e;d++){let h=["leg[0]"];for(let p=1;p<e;p++){let f=n*Hr*(p*d)/e,_=$t(Math.cos(f)),m=$t(Math.sin(f));h.push(`vec2<f32>(leg[${p}].x*${_} - leg[${p}].y*${m}, leg[${p}].x*${m} + leg[${p}].y*${_})`)}l+=`    ${o(d)} = ${h.join(" + ")};
`}return`${l}  }
  workgroupBarrier();
`},hl=(e,t,r)=>{let i="",n=1,a=0;for(let s of e)i+=pl(s,n,t,a,r),n*=s,a=dr-a;return{code:i,resultOffset:a}},fl=(e,t,r,i,n)=>{let a=e.dims,s=a.length,o=a[s-1],l=a[t],d=r&&i?(l-1)*2:l;n!==void 0&&(d=n);let h=r&&i?1:2,p=i&&!r?Math.floor(d/2)+1:d,f=a.slice();f[t]=p,f[s-1]=h;let _=1;for(let w=t+1;w<s-1;w++)_*=a[w];let m=D.size(a)/o/l;return{dataType:e.dataType,outputDims:f,length:d,signalLength:l,inner:_,batch:m,inputComponents:o,outputComponents:h,outputLength:p,inverse:r,onesided:i}},un=(e,t)=>[t,e.length,e.inputComponents,e.outputComponents,e.inverse,e.onesided].join(";"),ln=e=>[{type:12,data:e.batch},{type:12,data:e.signalLength},{type:12,data:e.inner},{type:12,data:e.outputLength}],dn=(e,t,r)=>e.registerUniform("batch","u32").registerUniform("signalLength","u32").registerUniform("inner","u32").registerUniform("outputLength","u32").declareVariables(t,r),ml=e=>{let{dataType:t,length:r,inputComponents:i,outputComponents:n,inverse:a,onesided:s}=e,o=De(t),l=a?1:-1,d=a?1/r:1,h=on(r),p=f=>{let _=q("x",t,[1]),m=ae("y",t,[1]),w=T=>{let E=`inBase + (${T}) * uniforms.inner * ${i}u`,z=`f32(${_.getByOffset(E)})`,v=i===2?`f32(${_.getByOffset(`${E} + 1u`)})`:"0.0";return`vec2<f32>(${z}, ${v})`},x;if(a&&s){let T=Math.floor(r/2)+1,E=r%2===0?`select(provided, provided - 1u, provided == ${T}u)`:"provided";x=`
    let provided = min(uniforms.signalLength, ${T}u);
    for (var i = local_idx; i < ${r}u; i += ${pt}u) {
      if (i < provided) { smem[i] = ${w("i")}; } else { smem[i] = vec2<f32>(0.0); }
    }
    workgroupBarrier();
    for (var k = local_idx + 1u; k < ${E}; k += ${pt}u) {
      let h = smem[k];
      smem[${r}u - k] = vec2<f32>(h.x, -h.y);
    }
    workgroupBarrier();`}else x=`
    let loadCount = min(uniforms.signalLength, ${r}u);
    for (var i = local_idx; i < ${r}u; i += ${pt}u) {
      if (i < loadCount) { smem[i] = ${w("i")}; } else { smem[i] = vec2<f32>(0.0); }
    }
    workgroupBarrier();`;let{code:$,resultOffset:b}=hl(h,r,l),S=d===1?`smem[${b}u + i]`:`smem[${b}u + i] * ${$t(d)}`,I=n===2?m.setByOffset("off + 1u",`${o}(v.y)`):"";return`
  ${dn(f,_,m)}
  var<workgroup> smem: array<vec2<f32>, ${2*dr}>;
  fn cmul(a: vec2<f32>, b: vec2<f32>) -> vec2<f32> {
    return vec2<f32>(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
  }
  ${f.mainStart(pt)}
    let row = workgroup_index;
    if (row >= uniforms.batch) { return; }
    let outer = row / uniforms.inner;
    let within = row % uniforms.inner;
    let inBase = (outer * uniforms.signalLength * uniforms.inner + within) * ${i}u;
    let outBase = (outer * uniforms.outputLength * uniforms.inner + within) * ${n}u;
    ${x}
${$}    for (var i = local_idx; i < uniforms.outputLength; i += ${pt}u) {
      let v = ${S};
      let off = outBase + i * uniforms.inner * ${n}u;
      ${m.setByOffset("off",`${o}(v.x)`)}
      ${I}
    }
  }`};return{name:"DFT",shaderCache:{hint:un(e,"fft"),inputDependencies:["type"]},getShaderSource:p,getRunData:()=>({outputs:[{dims:e.outputDims,dataType:t}],programUniforms:ln(e),dispatchGroup:{x:e.batch}})}},gl=e=>{let{dataType:t,length:r,inputComponents:i,outputComponents:n,inverse:a,onesided:s}=e,o=De(t),l=a?1:-1,d=a?1/r:1,h=p=>{let f=q("x",t,[1]),_=ae("y",t,[1]),m=S=>{let I=`inBase + (${S}) * uniforms.inner * ${i}u`,T=`f32(${f.getByOffset(I)})`,E=i===2?`f32(${f.getByOffset(`${I} + 1u`)})`:"0.0";return`vec2<f32>(${T}, ${E})`},w=a&&s?`fn spectrum(inBase: u32, k: u32) -> vec2<f32> {
    let provided = min(uniforms.signalLength, ${Math.floor(r/2)+1}u);
    if (k < provided) { return ${m("k")}; }
    let m = ${r}u - k;
    if (m < provided) {
      let h = ${m("m")};
      return vec2<f32>(h.x, -h.y);
    }
    return vec2<f32>(0.0, 0.0);
  }`:`fn spectrum(inBase: u32, n: u32) -> vec2<f32> {
    if (n < uniforms.signalLength) { return ${m("n")}; }
    return vec2<f32>(0.0, 0.0);
  }`,x=`
      let angle = ${$t(l*Hr)} * f32(knMod) / ${$t(r)};
      acc += cmul(spectrum(inBase, n), vec2<f32>(cos(angle), sin(angle)));
      knMod += k;
      if (knMod >= ${r}u) { knMod -= ${r}u; }`,$=n===2?_.setByOffset("off + 1u",`${o}(v.y)`):"",b=d===1?"acc":`acc * ${$t(d)}`;return`
  ${dn(p,f,_)}
  fn cmul(a: vec2<f32>, b: vec2<f32>) -> vec2<f32> {
    return vec2<f32>(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
  }
  ${w}
  ${p.mainStart(pt)}
    let row = workgroup_index;
    if (row >= uniforms.batch) { return; }
    let outer = row / uniforms.inner;
    let within = row % uniforms.inner;
    let inBase = (outer * uniforms.signalLength * uniforms.inner + within) * ${i}u;
    let outBase = (outer * uniforms.outputLength * uniforms.inner + within) * ${n}u;
    for (var k = local_idx; k < uniforms.outputLength; k += ${pt}u) {
      var acc = vec2<f32>(0.0, 0.0);
      var knMod = 0u;
      for (var n = 0u; n < ${r}u; n++) {${x}
      }
      let v = ${b};
      let off = outBase + k * uniforms.inner * ${n}u;
      ${_.setByOffset("off",`${o}(v.x)`)}
      ${$}
    }
  }`};return{name:"DFT",shaderCache:{hint:un(e,"direct"),inputDependencies:["type"]},getShaderSource:h,getRunData:()=>({outputs:[{dims:e.outputDims,dataType:t}],programUniforms:ln(e),dispatchGroup:{x:e.batch}})}},cn=e=>{if(!e||e.dataType===0)return;if(D.size(e.dims)!==1)throw new Error("DFT optional scalar inputs must have exactly 1 element.");if(e.dataType===6)return e.getInt32Array()[0];let t=Number(e.getBigInt64Array()[0]);if(!Number.isSafeInteger(t))throw new Error("DFT optional scalar inputs are out of JavaScript safe integer range.");return t},yl=e=>{if(!e||e.length<1)throw new Error("DFT requires at least 1 input.");let t=e[0].dims;if(t.length<2)throw new Error("DFT input must have at least 2 dimensions.");let r=t[t.length-1];if(r!==1&&r!==2)throw new Error("DFT input's innermost dimension must be 1 (real) or 2 (complex).")},Mh=(e,t)=>{yl(e.inputs);let r=e.inputs[0],i=r.dims.length,n=t.inverse!==0,a=t.onesided!==0,s=cn(e.inputs[1]);if(s!==void 0&&s<=0)throw new Error("dft_length must be greater than zero.");let o=D.normalizeAxis(cn(e.inputs[2])??t.axis,i);if(o===i-1)throw new Error("DFT axis must refer to a signal dimension, not the innermost (real/imaginary) dimension.");if(n&&a&&r.dims[i-1]!==2)throw new Error("Inverse one-sided DFT (IRFFT) requires complex-valued input (innermost dimension 2).");let l=fl(r,o,n,a,s);if(l.length<=0)throw new Error(`Invalid DFT length: ${l.length}`);let d=l.length<=dr&&on(l.length)!==void 0?ml(l):gl(l);e.compute(d,{inputs:[0]})},Bh=e=>Se({axis:e.axis??1,inverse:e.inverse??0,onesided:e.onesided??0})}),Fr,cr,pn,_l,bl,wl,$l,hn,vl,Rh,Dh,J0=K(()=>{"use strict";ce(),fe(),Me(),me(),Fr="[a-zA-Z]|\\.\\.\\.",cr="("+Fr+")+",pn="^"+cr+"$",_l="("+cr+",)*"+cr,bl="^"+_l+"$",wl=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,t){let r=this.symbolToIndices.get(e);r===void 0?r=[t]:r.push(t),this.symbolToIndices.set(e,r)}},$l=class{constructor(e,t){this.equation=t,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=new Array,this.outputDims=[];let[r,i]=t.includes("->")?t.split("->",2):[t,""];if(!r.match(RegExp(bl)))throw new Error("Invalid LHS term");if(r.split(",").forEach((n,a)=>{let s=e[a].dims.slice();if(!n.match(RegExp(pn)))throw new Error("Invalid LHS term");let o=this.processTerm(n,!0,s,a);this.lhs.push(o)}),i==="")i+=[...this.symbolToInfo.entries()].filter(([n,a])=>a.count===1||n==="...").map(([n])=>n).join("");else if(!i.match(RegExp(cr)))throw new Error("Invalid RHS");i.match(RegExp(Fr,"g"))?.forEach(n=>{if(n==="...")this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let a=this.symbolToInfo.get(n);if(a===void 0)throw new Error("Invalid RHS symbol");this.outputDims.push(a.dimValue)}}),this.rhs=this.processTerm(i,!1,this.outputDims)}addSymbol(e,t,r){let i=this.symbolToInfo.get(e);if(i!==void 0){if(i.dimValue!==t&&i.count!==1)throw new Error("Dimension mismatch");i.count++,i.inputIndices.push(r)}else i={count:1,dimValue:t,inputIndices:[r]};this.symbolToInfo.set(e,i)}processTerm(e,t,r,i=-1){let n=r.length,a=!1,s=[],o=0;if(!e.match(RegExp(pn))&&!t&&e!=="")throw new Error("Invalid LHS term");let l=e.match(RegExp(Fr,"g")),d=new wl(i);return l?.forEach((h,p)=>{if(h==="..."){if(a)throw new Error("Only one ellipsis is allowed per input term");a=!0;let f=n-l.length+1;if(f<0)throw new Error("Ellipsis out of bounds");if(s=r.slice(o,o+f),this.hasEllipsis){if(this.ellipsisDims.length!==s.length||this.ellipsisDims.toString()!==s.toString())throw new Error("Ellipsis dimensions mismatch")}else if(t)this.hasEllipsis=!0,this.ellipsisDims=s;else throw new Error("Ellipsis must be specified in the LHS");for(let _=0;_<s.length;_++){let m=String.fromCharCode(48+_);d.addSymbol(m,p+_),this.addSymbol(m,r[o++],i)}}else d.addSymbol(h,p+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(h,r[o++],i)}),d}},hn=e=>e+"_max",vl=(e,t,r,i)=>{let n=e.map(d=>d.length).map((d,h)=>q(`input${h}`,t,d)),a=D.size(i),s=ae("output",t,i.length),o=[...r.symbolToInfo.keys()].filter(d=>!r.rhs.symbolToIndices.has(d)),l=d=>{let h=[],p="var prod = 1.0;",f="var sum = 0.0;",_="sum += prod;",m=[],w=[],x=[],$=[],b=r.symbolToInfo.size===r.rhs.symbolToIndices.size;r.symbolToInfo.forEach((I,T)=>{if(r.rhs.symbolToIndices.has(T)){let E=r.rhs.symbolToIndices.get(T)?.[0];E!==void 0&&r.lhs.forEach((z,v)=>{if(I.inputIndices.includes(v)){let B=z.symbolToIndices.get(T);if(B===void 0)throw new Error("Invalid symbol error");B.forEach(P=>{h.push(`${n[v].indicesSet(`input${v}Indices`,P,s.indicesGet("outputIndices",E))}`)})}})}else r.lhs.forEach((E,z)=>{if(I.inputIndices.includes(z)){let v=E.symbolToIndices.get(T);if(v===void 0)throw new Error("Invalid symbol error");v.forEach(B=>{m.push(`${n[z].indicesSet(`input${z}Indices`,B,`${T}`)}`)}),$.push(`prod *= ${n[z].getByIndices(`input${z}Indices`)};`)}}),w.push(`for(var ${T}: u32 = 0; ${T} < uniforms.${hn(T)}; ${T}++) {`),x.push("}")});let S=b?[...h,`let sum = ${n.map((I,T)=>I.getByIndices(`input${T}Indices`)).join(" * ")};`]:[...h,f,...w,...m,p,...$,_,...x];return`
            ${d.registerUniforms(o.map(I=>({name:`${hn(I)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...n,s)}

            ${d.mainStart()}
            ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${s.offsetToIndices("global_idx")};
            ${n.map((I,T)=>`var input${T}Indices: ${n[T].type.indices};`).join(`
`)}
            ${S.join(`
`)};
            ${s.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:r.equation,inputDependencies:e.map(()=>"rank")},getRunData:()=>{let d=o.filter(p=>r.symbolToInfo.has(p)).map(p=>({type:12,data:r.symbolToInfo.get(p)?.dimValue||0}));d.push({type:12,data:a});let h=e.map((p,f)=>[...le(p)]).reduce((p,f)=>p.concat(f),d);return h.push(...le(i)),{outputs:[{dims:i,dataType:t}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:h}},getShaderSource:l}},Rh=(e,t)=>{let r=new $l(e.inputs,t.equation),i=r.outputDims,n=e.inputs.map((a,s)=>a.dims);e.compute(vl(n,e.inputs[0].dataType,r,i))},Dh=e=>{let t=e.equation.replace(/\s+/g,"");return Se({equation:t})}}),xl,fn,kl,Sl,Nh,ey=K(()=>{"use strict";ce(),fe(),me(),xl=e=>{if(!e||e.length!==2)throw new Error("Expand requires 2 input.");let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=r.length<t.length?0:r.length-t.length,n=t.length<r.length?0:t.length-r.length;for(;i<r.length&&n<t.length;++i,++n)if(r[i]!==t[n]&&r[i]!==1&&t[n]!==1)throw new Error("Expand requires shape to be broadcastable to input")},fn=(e,t)=>{let r=e.length-t.length,i=[];for(let n=0;n<r;++n)i.push(e[n]);for(let n=0;n<t.length;++n)i.push(t[n]===1?e[n+r]:t[n]);return i},kl=(e,t)=>e.length>t.length?fn(e,t):fn(t,e),Sl=e=>{let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=kl(t,r),n=e[0].dataType,a=n===9||D.size(t)===1,s=n===9||t.length>0&&t[t.length-1]%4===0?4:1,o=a||i.length>0&&i[i.length-1]%4===0?4:1,l=Math.ceil(D.size(i)/o),d=p=>{let f=q("input",n,t.length,s),_=ae("output",n,i.length,o),m;if(n===9){let w=(x,$,b="")=>`
          let outputIndices${$} = ${_.offsetToIndices(`outputOffset + ${$}u`)};
          let offset${$} = ${f.broadcastedIndicesToOffset(`outputIndices${$}`,_)};
          let index${$} = offset${$} / 4u;
          let component${$} = offset${$} % 4u;
          ${x}[${$}] = ${b}(${f.getByOffset(`index${$}`)}[component${$}]);
        `;m=`
        let outputOffset = global_idx * ${o};
        var data = vec4<u32>(0);
        ${w("data",0,"u32")}
        ${w("data",1,"u32")}
        ${w("data",2,"u32")}
        ${w("data",3,"u32")}
        ${_.setByOffset("global_idx","data")}
      }`}else m=`
        let outputIndices = ${_.offsetToIndices(`global_idx * ${o}`)};
        let inputOffset = ${f.broadcastedIndicesToOffset("outputIndices",_)};
        let data = ${_.type.value}(${f.getByOffset(`inputOffset / ${s}`)});
        ${_.setByOffset("global_idx","data")}
      }`;return`
    ${p.registerUniform("vec_size","u32").declareVariables(f,_)}
    ${p.mainStart()}
    ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${m}`},h=[{type:12,data:l},...le(t,i)];return{name:"Expand",shaderCache:{hint:`${i.length};${s}${o}`,inputDependencies:["rank"]},getShaderSource:d,getRunData:()=>({outputs:[{dims:i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:h})}},Nh=e=>{xl(e.inputs),e.compute(Sl(e.inputs),{inputs:[0]})}}),Tl,Uh,ty=K(()=>{"use strict";ce(),fe(),me(),ga(),Tl=e=>{let t=e[0].dataType,r=D.size(e[0].dims),i=D.size(e[1].dims),n=i%4===0,a=s=>{let o=q("x",t,[1],4),l=q("bias",t,[1],4),d=ae("y",t,[1],4),h=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],p=_=>`
      let bias${_}_offset: u32 = (global_idx * 4 + ${_}) % uniforms.bias_size;
      let bias${_} = ${l.getByOffset(`bias${_}_offset / 4`)}[bias${_}_offset % 4];`,f=n?`
      let bias = ${l.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${p(0)}${p(1)}${p(2)}${p(3)}
      let bias = ${o.type.value}(bias0, bias1, bias2, bias3);`;return`${s.registerUniforms(h).declareVariables(o,l,d)}

    ${Hn(De(t))}

    ${s.mainStart(er)}
      ${s.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${o.getByOffset("global_idx")};
      ${f}
      let x_in = x + bias;
      ${d.setByOffset("global_idx",Fn("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${n}`,inputDependencies:["type","type"]},getShaderSource:a,getRunData:s=>({outputs:[{dims:s[0].dims,dataType:s[0].dataType}],programUniforms:[{type:12,data:Math.ceil(r/4)},{type:12,data:i}],dispatchGroup:{x:Math.ceil(r/er/4)}})}},Uh=e=>{e.inputs.length<2||D.size(e.inputs[1].dims)===0?rh(e):e.compute(Tl(e.inputs))}}),Il,El,Ph,qh,ry=K(()=>{"use strict";ce(),fe(),Me(),me(),Il=e=>{if(!e||e.length!==2)throw new Error("Gather requires 2 inputs.")},El=(e,t)=>{let r=e[0].dims,i=e[1].dims,n=r.length,a=D.normalizeAxis(t.axis,n),s=r.slice(0);s.splice(a,1,...i);let o=r[a],l=e[0].dataType===9?4:1,d=Math.ceil(D.size(s)/l),h=[{type:12,data:d},{type:6,data:o},{type:12,data:a},...le(e[0].dims,e[1].dims,s)],p=f=>{let _=q("data",e[0].dataType,e[0].dims.length,l),m=q("inputIndices",e[1].dataType,e[1].dims.length),w=ae("output",e[0].dataType,s.length,l),x=b=>{let S=i.length,I=`var indicesIndices${b}  = ${m.type.indices}(0);`;for(let T=0;T<S;T++)I+=`${S>1?`indicesIndices${b}[${T}]`:`indicesIndices${b}`} = ${s.length>1?`outputIndices${b}[uniforms.axis + ${T}]`:`outputIndices${b}`};`;I+=`
          var idx${b} = ${m.getByIndices(`indicesIndices${b}`)};
          if (idx${b} < 0) {
            idx${b} = idx${b} + uniforms.axisDimLimit;
          }
          var dataIndices${b} : ${_.type.indices};
        `;for(let T=0,E=0;T<n;T++)T===a?(I+=`${n>1?`dataIndices${b}[${T}]`:`dataIndices${b}`} = u32(idx${b});`,E+=S):(I+=`${n>1?`dataIndices${b}[${T}]`:`dataIndices${b}`} = ${s.length>1?`outputIndices${b}[${E}]`:`outputIndices${b}`};`,E++);return I},$;if(e[0].dataType===9){let b=(S,I,T="")=>`
          let outputIndices${I} = ${w.offsetToIndices(`outputOffset + ${I}u`)};
          ${x(I)};
          let offset${I} = ${_.indicesToOffset(`dataIndices${I}`)};
          let index${I} = offset${I} / 4u;
          let component${I} = offset${I} % 4u;
          ${S}[${I}] = ${T}(${_.getByOffset(`index${I}`)}[component${I}]);
        `;$=`
        let outputOffset = global_idx * ${l};
        var value = vec4<u32>(0);
        ${b("value",0,"u32")}
        ${b("value",1,"u32")}
        ${b("value",2,"u32")}
        ${b("value",3,"u32")}
        ${w.setByOffset("global_idx","value")}
      `}else $=`
      let outputIndices = ${w.offsetToIndices("global_idx")};
      ${x("")};
      let value = ${_.getByIndices("dataIndices")};
      ${w.setByOffset("global_idx","value")};
      `;return`
      ${f.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(_,m,w)}
      ${f.mainStart()}
        ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${$}
      }`};return{name:"Gather",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:s,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:h}),getShaderSource:p}},Ph=e=>Se({axis:e.axis}),qh=(e,t)=>{let r=e.inputs;Il(r),e.compute(El(e.inputs,t))}}),Cl,Lh,Wh,iy=K(()=>{"use strict";ce(),fe(),me(),Cl=(e,t,r,i,n,a,s,o,l)=>{let d=[{type:12,data:a},{type:12,data:i},{type:12,data:n},{type:12,data:r},{type:12,data:s},{type:12,data:o},{type:12,data:l}],h=[a];d.push(...le(t.dims,h));let p=f=>{let _=q("indices_data",t.dataType,t.dims.length),m=ae("input_slice_offsets_data",12,1,1),w=[_,m],x=[{name:"output_size",type:"u32"},{name:"batch_dims",type:"u32"},{name:"input_dims",type:"u32",length:n.length},{name:"sizes_from_slice_dims_data",type:"u32",length:r.length},{name:"num_slices_per_batch",type:"u32"},{name:"input_batch_stride",type:"u32"},{name:"num_slice_dims",type:"u32"}];return`
  ${f.registerUniforms(x).declareVariables(...w)}
  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let batch_idx = global_idx / uniforms.num_slices_per_batch;
    let base_offset = batch_idx * uniforms.input_batch_stride;

    let slice_indices_base_offset = global_idx * uniforms.num_slice_dims;
    var relative_slice_offset = 0;
    for (var dim_idx = 0u; dim_idx < uniforms.num_slice_dims; dim_idx ++) {
      var index = i32(indices_data[dim_idx + slice_indices_base_offset].x);
      let input_dim_idx = uniforms.batch_dims + dim_idx;
      if (index < 0) {
        ${n.length===1?"index += i32(uniforms.input_dims);":"index += i32(uniforms.input_dims[input_dim_idx]);"}
      }
      ${r.length===1?"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data);":"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data[dim_idx]);"}
    }

    input_slice_offsets_data[global_idx] =  base_offset + u32(relative_slice_offset);
  }`};return e.compute({name:"computeSliceOffsets",shaderCache:{hint:`${n.length}_${r.length}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:h,dataType:e.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:d}),getShaderSource:p},{inputs:[t],outputs:[-1]})[0]},Lh=(e,t)=>{let r=e.inputs,i=r[0].dims,n=r[0].dataType,a=r[1].dims,s=a[a.length-1],o=D.sizeToDimension(a,a.length-1),l=D.sizeFromDimension(i,t.batchDims+s),d=D.sizeToDimension(i,t.batchDims),h=D.sizeFromDimension(i,t.batchDims),p=o/d,f=new Array(s),_=l;for(let I=0;I<s;++I)f[s-1-I]=_,_*=i[t.batchDims+s-1-I];let m=Cl(e,r[1],f,t.batchDims,i,o,p,h,s),w=t.batchDims+s;if(w>i.length)throw new Error("last dimension of indices must not be larger than rank of input tensor");let x=a.slice(0,-1).concat(i.slice(w)),$=D.size(x),b=[{type:12,data:$},{type:12,data:l},...le(r[0].dims,m.dims,x)],S=I=>{let T=q("data",r[0].dataType,r[0].dims.length),E=q("slice_offsets",12,m.dims.length),z=ae("output",r[0].dataType,x.length);return`
          ${I.registerUniform("output_size","u32").registerUniform("slice_size","u32").declareVariables(T,E,z)}
            ${I.mainStart()}
            ${I.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`};e.compute({name:"GatherND",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:x,dataType:n}],dispatchGroup:{x:Math.ceil($/64)},programUniforms:b}),getShaderSource:S},{inputs:[r[0],m]})},Wh=e=>({batchDims:e.batch_dims,cacheKey:""})}),zl,Al,Vh,Gh,ny=K(()=>{"use strict";ce(),fe(),Me(),me(),zl=(e,t)=>{if(e.length<3||e.length>4)throw new Error("GatherBlockQuantized requires 3 or 4 inputs.");let r=D.normalizeAxis(t.quantizeAxis,e[0].dims.length),i=t.blockSize,n=e[0],a=e[2],s=e.length===4?e[3]:void 0;if(a.dims.length!==n.dims.length||!n.dims.map((o,l)=>l===r?Math.ceil(o/i)===a.dims[l]:o===a.dims[l]).reduce((o,l)=>o&&l,!0))throw new Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");if(s){if(s.dataType!==n.dataType)throw new Error("Zero point must have the same data type as the input tensor.");if(s.dims.length!==a.dims.length||!s.dims.map((o,l)=>o===a.dims[l]).reduce((o,l)=>o&&l,!0))throw new Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.")}},Al=(e,t)=>{let r=e[0].dims,i=e[1].dims,n=r.length,a=D.normalizeAxis(t.gatherAxis,n),s=D.normalizeAxis(t.quantizeAxis,n),o=r.slice(0);o.splice(a,1,...i);let l=D.size(o),d=e[2].dataType,h=e[0].dataType===22,p=[{type:12,data:l},{type:12,data:s},{type:12,data:a},{type:12,data:t.blockSize},...le(...e.map((_,m)=>_.dims),o)],f=_=>{let m=q("data",e[0].dataType,e[0].dims.length),w=q("inputIndices",e[1].dataType,e[1].dims.length),x=q("scales",e[2].dataType,e[2].dims.length),$=e.length>3?q("zeroPoint",e[3].dataType,e[3].dims.length):void 0,b=ae("output",d,o.length),S=[m,w,x];$&&S.push($);let I=[{name:"output_size",type:"u32"},{name:"quantize_axis",type:"u32"},{name:"gather_axis",type:"u32"},{name:"block_size",type:"u32"}];return`
        ${_.registerUniforms(I).declareVariables(...S,b)}
        ${_.mainStart()}
        let output_indices = ${b.offsetToIndices("global_idx")};
        var indices_indices = ${w.type.indices}(0);
        ${i.length>1?`
          for (var i: u32 = 0; i < ${i.length}; i++) {
            let index = ${b.indicesGet("output_indices","uniforms.gather_axis + i")};
            ${w.indicesSet("indices_indices","i","index")};
          }`:`indices_indices = ${b.indicesGet("output_indices","uniforms.gather_axis")};`};
        var data_indices = ${m.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${b.indicesGet("output_indices","i")};
          ${m.indicesSet("data_indices","i","index")};
        }
        var index_from_indices = ${w.getByIndices("indices_indices")};
        if (index_from_indices < 0) {
          index_from_indices += ${r[a]};
        }
        ${m.indicesSet("data_indices","uniforms.gather_axis","u32(index_from_indices)")};
        for (var i = uniforms.gather_axis + 1; i < ${o.length}; i++) {
          let index = ${b.indicesGet("output_indices",`i + ${i.length} - 1`)};
          ${m.indicesSet("data_indices","i","index")};
        }
        let data_offset = ${m.indicesToOffset("data_indices")};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${m.getByOffset("data_offset / 8")};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${h?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${x.indicesGet("data_indices","uniforms.quantize_axis")} / uniforms.block_size;
        ${x.indicesSet("scale_indices","uniforms.quantize_axis","quantize_axis_index")};
        var scale = ${x.getByIndices("scale_indices")};
        ${$?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${$.indicesToOffset("zero_point_indices")};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${$.getByOffset("zero_point_offset / 8")};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${h?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:"var zero_point = 0"};
        let dequantized_data = ${De(d)}(quantized_data - zero_point) * scale;
        ${b.setByOffset("global_idx","dequantized_data")};
    }`};return{name:"GatherBlockQuantized",shaderCache:{hint:`${t.cacheKey};${e.filter((_,m)=>m!==1).map(_=>_.dims.join("_")).join(";")}`,inputDependencies:Array.from({length:e.length},(_,m)=>"rank")},getRunData:()=>({outputs:[{dims:o,dataType:d}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:p}),getShaderSource:f}},Vh=(e,t)=>{let r=e.inputs;zl(r,t),e.compute(Al(e.inputs,t))},Gh=e=>Se({blockSize:e.blockSize,gatherAxis:e.gatherAxis,quantizeAxis:e.quantizeAxis})}),Ol,Ml,Hh,Fh,ay=K(()=>{"use strict";ce(),fe(),Me(),me(),Ol=e=>{if(!e||e.length!==2)throw new Error("GatherElements requires 2 inputs.");if(e[0].dims.length<1)throw new Error("GatherElements requires that the data input be rank >= 1.");if(e[0].dims.length!==e[1].dims.length)throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},Ml=(e,t)=>{let r=e[0].dims,i=e[0].dataType,n=r.length,a=e[1].dims,s=e[1].dataType,o=D.normalizeAxis(t.axis,n),l=r[o],d=a.slice(0),h=D.size(d),p=q("input",i,n),f=q("indicesInput",s,a.length),_=ae("output",i,d.length),m=[{type:12,data:h},{type:6,data:l},{type:12,data:o}];return m.push(...le(r,a,d)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:d,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:m}),getShaderSource:w=>`
      ${w.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(p,f,_)}
      ${w.mainStart()}
      ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${_.offsetToIndices("global_idx")};

      var idx = ${f.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${p.type.indices}(outputIndices);
      ${p.indicesSet("inputIndices","uniforms.axis","u32(idx)")};
      let value = ${p.getByIndices("inputIndices")};

      ${_.setByOffset("global_idx","value")};
  }`}},Hh=e=>Se({axis:e.axis}),Fh=(e,t)=>{let r=e.inputs;Ol(r),e.compute(Ml(e.inputs,t))}}),Bl,Rl,jh,Kh,sy=K(()=>{"use strict";ce(),fe(),me(),Bl=e=>{if(!e)throw new Error("Input is missing");if(e.length<2||e.length>3)throw new Error("Invaid input number.");if(e.length===3&&e[2].dims.length>2)throw new Error("Invalid input shape of C");if(e[0].dataType!==e[1].dataType||e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("Input types are mismatched")},Rl=(e,t)=>{let r=e[0].dims.slice(),i=e[1].dims.slice(),[n,a,s]=Wc.getShapeOfGemmResult(r,t.transA,i,t.transB,e.length===3?e[2].dims:void 0),o=[n,a];if(!o)throw new Error("Can't use gemm on the given tensors");let l=16,d=Math.ceil(a/l),h=Math.ceil(n/l),p=!0,f=D.size(o),_=[{type:12,data:p?d:f},{type:12,data:n},{type:12,data:a},{type:12,data:s},{type:1,data:t.alpha},{type:1,data:t.beta}],m=["type","type"];e.length===3&&(_.push(...le(e[2].dims)),m.push("rank")),_.push(...le(o));let w=$=>{let b="";t.transA&&t.transB?b="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":t.transA&&!t.transB?b="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!t.transA&&t.transB?b="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":!t.transA&&!t.transB&&(b="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let S=t.alpha===1?"":"value *= uniforms.alpha;",I=q("a",e[0].dataType,e[0].dims),T=q("b",e[1].dataType,e[1].dims),E=I.type.value,z=null,v=[I,T];e.length===3&&(z=q("c",e[2].dataType,e[2].dims.length),v.push(z));let B=ae("output",e[0].dataType,o.length);v.push(B);let P=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${$.registerUniforms(P).declareVariables(...v)}

  ${$.mainStart()}
    ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${E}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${b}
    }

    ${S}
    ${z!=null?`let cOffset = ${z.broadcastedIndicesToOffset("vec2(m, n)",B)}; value += ${E}(uniforms.beta) * ${z.getByOffset("cOffset")};`:""}
    output[global_idx] = value;
  }`},x=$=>{let b=q("a",e[0].dataType,e[0].dims),S=q("b",e[1].dataType,e[1].dims),I=null,T=[b,S];e.length===3&&(I=q("c",e[2].dataType,e[2].dims.length),T.push(I));let E=ae("output",e[0].dataType,o.length);T.push(E);let z=[{name:"num_tile_n",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}],v="",B="";t.transA&&t.transB?(B=`
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
        tile_b[local_id.y][local_id.x] = ${S.type.value}(0);
      }
      `,v="value += tile_a[k][local_id.y] * tile_b[local_id.x][k];"):t.transA&&!t.transB?(B=`
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
        tile_b[local_id.y][local_id.x] = ${S.type.value}(0);
      }
      `,v="value += tile_a[k][local_id.y] * tile_b[k][local_id.x];"):!t.transA&&t.transB?(B=`
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
        tile_b[local_id.y][local_id.x] = ${S.type.value}(0);
      }
      `,v="value += tile_a[local_id.y][k] * tile_b[local_id.x][k];"):!t.transA&&!t.transB&&(B=`
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
        tile_b[local_id.y][local_id.x] = ${S.type.value}(0);
      }
      `,v="value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");let P=t.alpha===1?"":"value *= uniforms.alpha;";return`
  ${$.registerUniforms(z).declareVariables(...T)}
  var<workgroup> tile_a: array<array<${b.type.storage}, ${l}>, ${l}>;
  var<workgroup> tile_b: array<array<${S.type.storage}, ${l}>, ${l}>;
  ${$.mainStart([l,l,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * ${l};
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * ${l};
    let num_tiles = (uniforms.K - 1) / ${l} + 1;
    var k_start = 0u;
    var value = ${E.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${B}
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
    ${I!=null?`let cOffset = ${I.broadcastedIndicesToOffset("vec2(m, n)",E)}; value += ${E.type.value}(uniforms.beta) * ${I.getByOffset("cOffset")};`:""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`};return p?{name:"GemmShared",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:m},getRunData:()=>({outputs:[{dims:o,dataType:e[0].dataType}],dispatchGroup:{x:d*h},programUniforms:_}),getShaderSource:x}:{name:"Gemm",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:m},getRunData:()=>({outputs:[{dims:o,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:_}),getShaderSource:w}},jh=e=>{let t=e.transA,r=e.transB,i=e.alpha,n=e.beta;return{transA:t,transB:r,alpha:i,beta:n,cacheKey:`${e.transA};${e.transB};${e.alpha===1}`}},Kh=(e,t)=>{Bl(e.inputs),e.compute(Rl(e.inputs,t))}}),ot,ht,At,Ot,Dl,Nl,Ul,Pl,ql,Ll,Wl,Vl,Xh,Yh,oy=K(()=>{"use strict";ce(),fe(),Me(),me(),[ot,ht,At,Ot]=[0,1,2,3],Dl=e=>{if(e[0].dims.length!==4)throw new Error("only 4-D tensor is supported.");if(e[0].dims.length!==e[1].dims.length)throw new Error("input dimensions must be equal to grid dimensions");if(e[0].dims.length-2!==e[1].dims[e[1].dims.length-1])throw new Error(`last dimension of grid must be equal to ${e[0].dims.length-2}`);if(e[0].dims[0]!==e[1].dims[0])throw new Error("grid batch size must match input batch size")},Nl=`
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
`,Ul=e=>`
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
`,Pl=e=>`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${e.alignCorners===0?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`,ql=e=>`
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
`,Ll=(e,t,r)=>`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${t} {
     var pixel = ${t}(0);
     var indices = vec4<u32>(0);
     indices[${ot}] = batch;
     indices[${ht}] = channel;`+(()=>{switch(r.paddingMode){case"zeros":return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${At}] = u32(r);
            indices[${Ot}] = u32(c);
          } else {
            return ${t}(0);
          }
        `;case"border":return`
          indices[${At}] = u32(clamp(r, 0, H - 1));
          indices[${Ot}] = u32(clamp(c, 0, W - 1));
        `;case"reflection":return`
          indices[${At}] = gs_reflect(r, border[1], border[3]);
          indices[${Ot}] = gs_reflect(c, border[0], border[2]);
        `;default:throw new Error(`padding mode ${r.paddingMode} is not supported`)}})()+`
    return ${e.getByIndices("indices")};
  }
`,Wl=(e,t,r)=>(()=>{switch(r.mode){case"nearest":return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${ot}], indices[${ht}], border);
        `;case"bilinear":return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${ot}], indices[${ht}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${ot}], indices[${ht}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${ot}], indices[${ht}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${ot}], indices[${ht}], border);

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
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${ot}], indices[${ht}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw new Error(`mode ${r.mode} is not supported`)}})()+`${e.setByOffset("global_idx","result")}`,Vl=(e,t)=>{let r=q("x",e[0].dataType,e[0].dims.length),i=[e[1].dims[0],e[1].dims[1],e[1].dims[2]],n=q("grid",e[1].dataType,i.length,2),a=[e[0].dims[0],e[0].dims[1],e[1].dims[1],e[1].dims[2]];t.format==="NHWC"&&(a=[e[0].dims[0],e[1].dims[1],e[1].dims[2],e[0].dims[3]],[ot,ht,At,Ot]=[0,3,1,2]);let s=ae("output",e[0].dataType,a.length),o=r.type.value,l=D.size(a),d=[{type:12,data:l},...le(e[0].dims,i,a)],h=p=>`
  ${p.registerUniform("output_size","u32").declareVariables(r,n,s)}
  ${Nl}
  ${Ul(o)}
  ${Pl(t)}
  ${ql(t)}
  ${Ll(r,o,t)}

  ${p.mainStart()}
    ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${At}]);
      let W_in = i32(uniforms.x_shape[${Ot}]);

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
      var grid_indices = vec3<u32>(indices[${ot}], indices[${At}], indices[${Ot}]);
      let nxy = ${n.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${Wl(s,o,t)}
  }`;return{name:"GridSample",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:["type","type"]},getRunData:p=>{let f=D.size(a);return{outputs:[{dims:a,dataType:p[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:d}},getShaderSource:h}},Xh=(e,t)=>{Dl(e.inputs),e.compute(Vl(e.inputs,t))},Yh=e=>Se({alignCorners:e.align_corners,mode:e.mode,paddingMode:e.padding_mode,format:e.format})}),We,Gl,Zh,mn,Hl,_r,Qh,Jh=K(()=>{"use strict";ce(),fe(),Me(),pa(),ma(),me(),Tt(),We=(e,t)=>e.length>t&&e[t].dims.length>0?e[t]:void 0,Gl=(e,t)=>{let r=e[0],i=We(e,1),n=We(e,2),a=We(e,3),s=We(e,4),o=We(e,5),l=We(e,6),d=We(e,7);if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let h=r.dims[0],p=r.dims[1],f=r.dims.length===3?r.dims[2]:t.numHeads*r.dims[4],_=p,m=0,w=0,x=Math.floor(f/t.numHeads);if(l&&d&&D.size(l.dims)&&D.size(d.dims)){if(l.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(l.dims[0]!==h||l.dims[1]!==t.numHeads||l.dims[3]!==x)throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(d.dims[0]!==h||d.dims[1]!==t.numHeads||d.dims[3]!==x)throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(l.dims[2]!==d.dims[2])throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(d.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');m=l.dims[2],w=l.dims[2]}else if(l&&D.size(l.dims)||d&&D.size(d.dims))throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let $;if(i&&D.size(i.dims)>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(i.dims[2]!==r.dims[2])throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');$=2,_=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==x)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(n)throw new Error('Expect "value" be none when "key" has packed kv format.');$=5,_=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==x)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');$=0,_=i.dims[2]}}else{if(r.dims.length!==5)throw new Error('Input "query" is expected to have 5 dimensions when key is empty');if(r.dims[2]!==t.numHeads||r.dims[3]!==3)throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');$=3}if(a&&D.size(a.dims)>0){if(a.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimension');if(i&&i.dims.length===5&&i.dims[3]===2)throw new Error("bias is not allowed for packed kv.")}let b=m+_,S=0;if(s&&D.size(s.dims)>0){S=8;let z=s.dims;throw z.length===1?z[0]===h?S=1:z[0]===3*h+2&&(S=3):z.length===2&&z[0]===h&&z[1]===b&&(S=5),S===8?new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)'):new Error("Mask not supported")}let I=!1,T=f;if(n&&D.size(n.dims)>0){if(n.dims.length!==3&&n.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==n.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(n.dims.length===3){if(_!==n.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');T=n.dims[2]}else{if(_!==n.dims[2])throw new Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');T=n.dims[1]*n.dims[3],I=!0}}let E=!1;if(s&&D.size(s.dims)>0)throw new Error("Key padding mask is not supported");if(o&&D.size(o.dims)>0){if(o.dims.length!==4)throw new Error('Input "attention_bias" is expected to have 4 dimensions');if(o.dims[0]!==h||o.dims[1]!==t.numHeads||o.dims[2]!==p||o.dims[3]!==b)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:h,sequenceLength:p,pastSequenceLength:m,kvSequenceLength:_,totalSequenceLength:b,maxSequenceLength:w,inputHiddenSize:0,hiddenSize:f,vHiddenSize:T,headSize:x,vHeadSize:Math.floor(T/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:S,scale:t.scale,broadcastResPosBias:E,passPastInKv:I,qkvFormat:$}},Zh=e=>Se({...e}),mn=Se({perm:[0,2,1,3]}),Hl=(e,t,r,i,n,a,s)=>{let o=[i,n,a],l=D.size(o),d=[{type:12,data:l},{type:12,data:s},{type:12,data:a}],h=p=>{let f=ae("qkv_with_bias",t.dataType,o),_=q("qkv",t.dataType,o),m=q("bias",r.dataType,o),w=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${p.registerUniforms(w).declareVariables(_,m,f)}
  ${p.mainStart()}
    ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return e.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:o,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:d}),getShaderSource:h},{inputs:[t,r],outputs:[-1]})[0]},_r=(e,t,r,i,n,a,s,o)=>{let l=a;if(s&&D.size(s.dims)>0){if(i===1)throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return l=Hl(e,a,s,t,i,r*n,o),l=l.reshape([t,i,r,n]),r===1||i===1?l:e.compute(Fe(l,mn.perm),{inputs:[l],outputs:[-1]})[0]}else return a.dims.length===3&&(l=a.reshape([t,i,r,n])),r===1||i===1?l:e.compute(Fe(l,mn.perm),{inputs:[l],outputs:[-1]})[0]},Qh=(e,t)=>{let r=Gl(e.inputs,t),i=e.inputs[0],n=We(e.inputs,1),a=We(e.inputs,2),s=We(e.inputs,3),o=We(e.inputs,4),l=We(e.inputs,5),d=We(e.inputs,6),h=We(e.inputs,7);if(i.dims.length===5)throw new Error("Packed QKV is not implemented");if(n?.dims.length===5)throw new Error("Packed KV is not implemented");let p=n&&a&&n.dims.length===4&&a.dims.length===4,f=_r(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,i,s,0);if(p)return xr(e,f,n,a,o,void 0,d,h,l,r);if(!n||!a)throw new Error("key and value must be provided");let _=_r(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.headSize,n,s,r.hiddenSize),m=_r(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.vHeadSize,a,s,2*r.hiddenSize);xr(e,f,_,m,o,void 0,d,h,l,r)}}),Fl,jl,Kl,Xl,Zn,ef,tf,rf=K(()=>{"use strict";ce(),fe(),Me(),me(),Fl=e=>{if(!e||e.length<1)throw new Error("too few inputs")},jl=(e,t)=>{let r=[],i=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(n=>r.push(Number(n))),i=r.length),Se({numOutputs:i,axis:t.axis,splitSizes:r})},Kl=e=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${oe("uniforms.size_in_split_axis","i",e)}) {
        return i;
    }
    }
    return ${e}u;
}`,Xl=e=>{let t=e.length,r=[];for(let i=0;i<t;++i){let n=e[i].setByIndices("indices","input[global_idx]");t===1?r.push(n):i===0?r.push(`if (output_number == ${i}u) { ${n} }`):i===t-1?r.push(`else { ${n} }`):r.push(`else if (output_number == ${i}) { ${n} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${r.join(`
`)}
      }`},Zn=(e,t)=>{let r=e[0].dims,i=D.size(r),n=e[0].dataType,a=D.normalizeAxis(t.axis,r.length),s=new Array(t.numOutputs),o=q("input",n,r.length),l=new Array(t.numOutputs),d=[],h=[],p=0,f=[{type:12,data:i}];for(let m=0;m<t.numOutputs;m++){p+=t.splitSizes[m],l[m]=p;let w=r.slice();w[a]=t.splitSizes[m],h.push(w),s[m]=ae(`output${m}`,n,w.length),d.push({dims:h[m],dataType:e[0].dataType})}f.push({type:12,data:l},...le(r,...h));let _=m=>`
  ${m.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",l.length).declareVariables(o,...s)}
  ${Kl(l.length)}
  ${Xl(s)}

  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${o.offsetToIndices("global_idx")};
    var index = ${o.indicesGet("indices",a)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${oe("uniforms.size_in_split_axis","output_number - 1u",l.length)};
      ${o.indicesSet("indices",a,"index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;return{name:"Split",shaderCache:{hint:t.cacheKey,inputDependencies:["rank"]},getShaderSource:_,getRunData:()=>({outputs:d,dispatchGroup:{x:Math.ceil(i/64)},programUniforms:f})}},ef=(e,t)=>{Fl(e.inputs);let r=e.inputs.length===1?t:jl(e.inputs,t);e.compute(Zn(e.inputs,r),{inputs:[0]})},tf=e=>{let t=e.axis,r=e.splitSizes,i=e.numOutputs<0?r.length:e.numOutputs;if(i!==r.length)throw new Error("numOutputs and splitSizes length must be equal");return Se({axis:t,numOutputs:i,splitSizes:r})}}),Yl,si,nf,af=K(()=>{"use strict";ce(),fe(),Me(),me(),Yl=(e,t)=>{let[r,i,n,a]=e,{numHeads:s,rotaryEmbeddingDim:o}=t;if(r.dims.length!==3&&r.dims.length!==4)throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${r.dims.length}`);if(!D.areEqual(i.dims,[])&&!D.areEqual(i.dims,[1])&&i.dims.length!==2)throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${i.dims.length}`);if(n.dims.length!==2)throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${n.dims.length}`);if(a.dims.length!==2)throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${a.dims.length}`);if(!D.areEqual(n.dims,a.dims))throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(o>0&&s===0)throw new Error("num_heads must be provided if rotary_embedding_dim is specified");let l=r.dims[0],d=r.dims[r.dims.length-2],h=n.dims[0],p=D.sizeFromDimension(r.dims,1)/d,f=o===0?n.dims[1]*2:p/s;if(o>f)throw new Error("rotary_embedding_dim must be less than or equal to head_size");if(i.dims.length===2){if(l!==i.dims[0])throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${i.dims[0]}`);if(d!==i.dims[1])throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${i.dims[1]}`)}if(d>h)throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported");if(f/2!==n.dims[1]&&o/2!==n.dims[1])throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${n.dims[1]}`)},si=(e,t)=>{let{interleaved:r,numHeads:i,rotaryEmbeddingDim:n,scale:a}=t,s=e[0].dims[0],o=D.sizeFromDimension(e[0].dims,1),l=e[0].dims[e[0].dims.length-2],d=o/l,h=e[2].dims[1],p=n===0?h*2:d/i,f=new Array(s,l,d/p,p-h),_=D.computeStrides(f),m=[{type:1,data:a},{type:12,data:f},{type:12,data:_},...e[0].dims.length===3?new Array({type:12,data:[o,d,p,1]}):[],...e[0].dims.length===4?new Array({type:12,data:[o,p,l*p,1]}):[],...le(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)],w=x=>{let $=q("input",e[0].dataType,e[0].dims.length),b=q("position_ids",e[1].dataType,e[1].dims.length),S=q("cos_cache",e[2].dataType,e[2].dims.length),I=q("sin_cache",e[3].dataType,e[3].dims.length),T=ae("output",e[0].dataType,e[0].dims.length);return x.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:f.length},{name:"global_strides",type:"u32",length:_.length},{name:"input_output_strides",type:"u32",length:_.length}]),`
        ${x.declareVariables($,b,S,I,T)}

        ${x.mainStart(er)}
          let half_rotary_emb_dim = uniforms.${S.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${x.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${b.broadcastedIndicesToOffset("bsnh.xy",ae("",b.type.tensor,2))};
            let position_id =
                u32(${b.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${r});
            let j = i + select(half_rotary_emb_dim, 1, ${r});
            let re = ${$.getByOffset("i")} * ${S.get("position_id","bsnh[3]")} -
                ${$.getByOffset("j")} * ${I.get("position_id","bsnh[3]")};
            ${T.setByOffset("i","re")}
            let im = ${$.getByOffset("i")} * ${I.get("position_id","bsnh[3]")} +
                ${$.getByOffset("j")} * ${S.get("position_id","bsnh[3]")};
            ${T.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${T.setByOffset("k",$.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:Se({interleaved:r}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:w,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(D.size(f)/er)},programUniforms:m})}},nf=(e,t)=>{Yl(e.inputs,t),e.compute(si(e.inputs,t))}}),Zl,Ql,gn,Jl,sf,uy=K(()=>{"use strict";Me(),ce(),ma(),Jh(),rf(),Tt(),af(),me(),Zl=(e,t)=>{if(t.doRotary&&e.length<=7)throw new Error("cos_cache and sin_cache inputs are required if do_rotary is specified");let r=e[0],i=e[1],n=e[2],a=e[3],s=e[4];if(t.doRotary!==0&&e.length<=7)throw new Error("cos_cast and sin_cache are expected if do_rotary attribute is non-zero");if(t.localWindowSize!==-1)throw new Error("Local attention is not supported");if(t.softcap!==0)throw new Error("Softcap is not supported");if(t.rotaryInterleaved!==0)throw new Error("Rotary interleaved is not supported");if(t.smoothSoftmax)throw new Error("Smooth softmax is not supported");if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let o=!1,l=r.dims[0],d=r.dims[1],h=r.dims.length===3?o?r.dims[2]/3:r.dims[2]:t.numHeads*r.dims[4],p=d,f=0,_=!i||i.dims.length===0,m=Math.floor(_?h/(t.numHeads+2*t.kvNumHeads):h/t.numHeads);_&&(h=m*t.numHeads);let w=a&&a.dims.length!==0,x=s&&s.dims.length!==0;if(w&&a.dims.length===4&&a.dims[0]===l&&a.dims[1]!==t.kvNumHeads&&a.dims[2]===t.kvNumHeads&&a.dims[3]===m)throw new Error("BSNH pastKey/pastValue is not supported");if(w&&x){if(a.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(s.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');f=a.dims[2]}else if(w||x)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let $=1;if(i&&i.dims.length>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(r.dims[2]%i.dims[2]!==0)throw new Error('Dimension 2 of "query" should be a multiple of "key"');p=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==m)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(n)throw new Error('Expect "value" be none when "key" has packed kv format.');p=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==m)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');p=i.dims[2]}}else{if(r.dims.length!==3&&r.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(r.dims.length===5&&(r.dims[2]!==t.numHeads||r.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');$=3}let b=0,S=!1,I=t.kvNumHeads?m*t.kvNumHeads:h;if(n&&n.dims.length>0){if(n.dims.length!==3&&n.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==n.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(n.dims.length===3){if(p!==n.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');I=n.dims[2]}else{if(p!==n.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');I=n.dims[1]*n.dims[3],S=!0}}let T=e.length>4?e[5]:void 0;if(T){if(T.dims.length===0)throw new Error("seqlens_k must be at least 1D, got scalar.");let E=T.dims.reduce((z,v)=>z*v,1);if(E!==l)throw new Error(`seqlens_k must have batch_size (${l}) elements, got ${E}.`);for(let z=0;z<T.dims.length;z++)if(T.dims[z]!==1&&T.dims[z]!==l)throw new Error(`seqlens_k has unexpected shape. Each dimension must be 1 or batch_size (${l}), got dims[${z}] = ${T.dims[z]}.`)}return{batchSize:l,sequenceLength:d,pastSequenceLength:f,kvSequenceLength:p,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:h,vHiddenSize:I,headSize:m,vHeadSize:Math.floor(I/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:b,scale:t.scale,broadcastResPosBias:!1,passPastInKv:S,qkvFormat:$}},Ql=Se({perm:[0,2,1,3]}),gn=(e,t,r)=>{let i=t,n=r.kvNumHeads;return t.dims.length===3&&r.kvSequenceLength!==0&&(i=t.reshape([r.batchSize,r.kvSequenceLength,n,r.headSize]),i=e.compute(Fe(i,Ql.perm),{inputs:[i],outputs:[-1]})[0]),i},Jl=(e,t,r,i)=>{let n=7,a=["type","type"],s=[e*t],o=e*t,l=[{type:12,data:o},{type:12,data:t},{type:12,data:e}],d=h=>{let p=q("seq_lens",r.dataType,r.dims),f=q("total_seq_lens",i.dataType,i.dims),_=ae("pos_ids",n,s),m=[{name:"output_size",type:"u32"},{name:"sequence_length",type:"u32"},{name:"batch_size",type:"u32"}];return`
  ${h.registerUniforms(m).declareVariables(p,f,_)}
  ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let total_sequence_length = u32(${f.getByOffset("0")});
    let is_subsequent_prompt = uniforms.sequence_length > 1 && uniforms.sequence_length != total_sequence_length;
    let is_first_prompt = !is_subsequent_prompt && uniforms.sequence_length == total_sequence_length;
    let batch_idx = global_idx / uniforms.sequence_length;
    let sequence_idx = i32(global_idx % uniforms.sequence_length);
    var pos_id: i32 = 0;
    let seqlen = ${p.getByOffset("batch_idx")};
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
  `};return{name:"GeneratePositionIds",shaderCache:{hint:`${e};${t}`,inputDependencies:a},getRunData:()=>({outputs:[{dims:s,dataType:n}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:l}),getShaderSource:d}},sf=(e,t)=>{if(e.inputs.length>14&&e.inputs[14]||e.inputs.length>15&&e.inputs[15])throw new Error("GroupQueryAttention (JSEP): q_norm_weight / k_norm_weight inputs are not supported. The per-head Q/K RMS normalization prologue is implemented only on the CUDA and native WebGPU EPs.");let r=Zl(e.inputs,t);if(e.inputs[0].dims.length===5)throw new Error("Packed QKV is not implemented");if(e.inputs[1]?.dims.length===5)throw new Error("Packed KV is not implemented");let i=e.inputs[0],n=e.inputs[1]&&e.inputs[1].dims.length>0?e.inputs[1]:void 0,a=e.inputs[2]&&e.inputs[2].dims.length>0?e.inputs[2]:void 0,s=e.inputs[3]&&e.inputs[3].dims.length!==0?e.inputs[3]:void 0,o=e.inputs[4]&&e.inputs[4].dims.length!==0?e.inputs[4]:void 0,l=e.inputs.length>4?e.inputs[5]:void 0,d=e.inputs.length>5?e.inputs[6]:void 0,h=r.kvNumHeads?r.kvNumHeads:r.numHeads,p=Se({axis:2,numOutputs:3,splitSizes:[r.numHeads*r.headSize,h*r.headSize,h*r.headSize]}),[f,_,m]=!n&&!a?e.compute(Zn([i],p),{inputs:[i],outputs:[-1,-1,-1]}):[i,n,a],w,x;if(t.doRotary){let I=e.compute(Jl(r.batchSize,r.sequenceLength,l,d),{inputs:[l,d],outputs:[-1]})[0],T=e.inputs[7],E=e.inputs[8],z=Se({interleaved:t.rotaryInterleaved!==0,numHeads:r.numHeads,rotaryEmbeddingDim:0,scale:t.scale}),v=[f,I,T,E],B=[-1];w=e.compute(si(v,z),{inputs:v,outputs:B})[0],v.splice(0,1,_);let P=Se({interleaved:t.rotaryInterleaved!==0,numHeads:r.kvNumHeads,rotaryEmbeddingDim:0,scale:t.scale});x=e.compute(si(v,P),{inputs:v,outputs:B})[0]}let $=_r(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,t.doRotary?w:f,void 0,0),b=gn(e,t.doRotary?x:_,r),S=gn(e,m,r);xr(e,$,b,S,void 0,void 0,s,o,void 0,r,l,d)}}),yn,ed,td,of,ly=K(()=>{"use strict";ce(),fe(),Tt(),me(),yn=(e,t,r,i,n,a,s,o)=>{let l=Oe(a),d=l===1?"f32":`vec${l}f`,h=l===1?"vec2f":`mat2x${l}f`,p=n*s,f=64;p===1&&(f=256);let _=[n,s,a/l],m=[n,s,2],w=["rank","type","type"],x=[];x.push(...le(_,m));let $=b=>{let S=q("x",t.dataType,3,l),I=q("scale",r.dataType,r.dims),T=q("bias",i.dataType,i.dims),E=ae("output",1,3,2),z=[S,I,T,E];return`
  var<workgroup> workgroup_shared : array<${h}, ${f}>;
  const workgroup_size = ${f}u;
  ${b.declareVariables(...z)}
  ${b.mainStart(f)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${d}(0);
    var squared_sum = ${d}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${d}(${S.get("batch","channel","h")});
      sum += value;
      squared_sum += value * value;
    }
    workgroup_shared[local_idx] = ${h}(sum, squared_sum);
    workgroupBarrier();

    for (var currSize = workgroup_size >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (local_idx < currSize) {
        workgroup_shared[local_idx] = workgroup_shared[local_idx] + workgroup_shared[local_idx + currSize];
      }
      workgroupBarrier();
    }
    if (local_idx == 0) {
      let sum_final = ${St("workgroup_shared[0][0]",l)} / f32(hight * ${l});
      let squared_sum_final = ${St("workgroup_shared[0][1]",l)} / f32(hight * ${l});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${o}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`};return e.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${l};${o};${f}`,inputDependencies:w},getRunData:()=>({outputs:[{dims:m,dataType:1}],dispatchGroup:{x:p},programUniforms:x}),getShaderSource:$},{inputs:[t,r,i],outputs:[-1]})[0]},ed=(e,t,r)=>{let i=t[0].dims,n=i,a=2,s=i[0],o=i[1],l=D.sizeFromDimension(i,a),d=Oe(l),h=D.size(n)/d,p=yn(e,t[0],t[1],t[2],s,l,o,r.epsilon),f=[s,o,l/d],_=[s,o],m=["type","none"],w=x=>{let $=q("x",t[0].dataType,f.length,d),b=q("scale_shift",1,_.length,2),S=ae("output",t[0].dataType,f.length,d),I=[$,b,S];return`
  ${x.registerUniform("output_size","u32").declareVariables(...I)}
  ${x.mainStart()}
  ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${S.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${b.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${$.getByOffset("global_idx")} * ${S.type.value}(scale_shift.x) + ${S.type.value}(scale_shift.y);
      ${S.setByOffset("global_idx","value")};
  }`};e.compute({name:"InstanceNormalization",shaderCache:{hint:`${d}`,inputDependencies:m},getRunData:()=>({outputs:[{dims:n,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:[{type:12,data:h},...le(f,_,f)]}),getShaderSource:w},{inputs:[t[0],p]})},td=(e,t,r)=>{let i=t[0].dims,n=i,a=i[0],s=i[i.length-1],o=D.sizeFromDimension(i,1)/s,l=Oe(s),d=D.size(n)/l,h=[{type:12,data:o},{type:12,data:Math.floor(s/l)}],p=["type","type"],f=!1,_=[0,i.length-1];for(let $=0;$<i.length-2;$++)f=f||i[$+1]!==1,_.push($+1);f=f&&i[i.length-1]!==1;let m=f?e.compute(Fe(e.inputs[0],_),{inputs:[e.inputs[0]],outputs:[-1]})[0]:e.inputs[0].reshape(Array.from({length:i.length},($,b)=>i[_[b]])),w=yn(e,m,t[1],t[2],a,o,s,r.epsilon),x=$=>{let b=Ne(t[0].dataType),S=l===1?"vec2f":`mat${l}x2f`,I=z=>{let v=z===0?"x":"y",B=l===1?"f32":`vec${l}f`;switch(l){case 1:return`${b}(${B}(scale.${v}))`;case 2:return`vec2<${b}>(${B}(scale[0].${v}, scale[1].${v}))`;case 4:return`vec4<${b}>(${B}(scale[0].${v}, scale[1].${v}, scale[2].${v}, scale[3].${v}))`;default:throw new Error(`Not supported compoents ${l}`)}},T=q("input",t[0].dataType,t[0].dims,l),E=ae("output",t[0].dataType,n,l);return`
  @group(0) @binding(0) var<storage, read> input : array<${T.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${S}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${E.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${$.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${I(0)}, ${I(1)});
  }`};e.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${l}`,inputDependencies:p},getRunData:()=>({outputs:[{dims:n,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:h}),getShaderSource:x},{inputs:[t[0],w]})},of=(e,t)=>{t.format==="NHWC"?td(e,e.inputs,t):ed(e,e.inputs,t)}}),rd,id,uf,dy=K(()=>{"use strict";ce(),fe(),me(),rd=e=>{if(!e||e.length<2)throw new Error("layerNorm requires at least 2 inputs.")},id=(e,t,r)=>{let i=t.simplified,n=e[0].dims,a=e[1],s=!i&&e[2],o=n,l=D.normalizeAxis(t.axis,n.length),d=D.sizeToDimension(n,l),h=D.sizeFromDimension(n,l),p=D.size(a.dims),f=s?D.size(s.dims):0;if(p!==h||s&&f!==h)throw new Error(`Size of X.shape()[axis:] == ${h}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${p} and bias size of ${f}`);let _=[];for(let T=0;T<n.length;++T)T<l?_.push(n[T]):_.push(1);let m=Oe(h),w=["type","type"],x=[{type:12,data:d},{type:1,data:h},{type:12,data:Math.floor(h/m)},{type:1,data:t.epsilon}];s&&w.push("type");let $=r>1,b=r>2,S=T=>{let E=Ne(e[0].dataType),z=[q("x",e[0].dataType,e[0].dims,m),q("scale",a.dataType,a.dims,m)];s&&z.push(q("bias",s.dataType,s.dims,m)),z.push(ae("output",e[0].dataType,o,m)),$&&z.push(ae("mean_data_output",1,_)),b&&z.push(ae("inv_std_output",1,_));let v=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${T.registerUniforms(v).declareVariables(...z)}
  ${T.mainStart()}
    ${T.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${Wn("f32",m)};
    var mean_square_vector = ${Wn("f32",m)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${Yt(E,m,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${St("mean_vector",m)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${St("mean_square_vector",m)} / uniforms.norm_size ${i?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${Yt(E,m,"x[j + offset]")};
      let f32scale = ${Yt(E,m,"scale[j]")};
      output[j + offset] = ${z[0].type.value}((f32input ${i?"":"- mean"}) * inv_std_dev * f32scale
        ${s?`+ ${Yt(E,m,"bias[j]")}`:""}
      );
    }

    ${$?"mean_data_output[global_idx] = mean":""};
    ${b?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},I=[{dims:o,dataType:e[0].dataType}];return $&&I.push({dims:_,dataType:1}),b&&I.push({dims:_,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${m};${r};${i}`,inputDependencies:w},getRunData:()=>({outputs:I,dispatchGroup:{x:Math.ceil(d/64)},programUniforms:x}),getShaderSource:S}},uf=(e,t)=>{rd(e.inputs),e.compute(id(e.inputs,t,e.outputCount))}}),nd,lf,cy=K(()=>{"use strict";fe(),wa(),$a(),nd=e=>{if(!e||e.length!==2)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.")},lf=e=>{nd(e.inputs);let t=Jt.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw new Error("Can't use matmul on the given tensors");let r=t[t.length-1],i=e.inputs[0].dims[e.inputs[0].dims.length-1];if(r<8&&i<8)e.compute(ba(e.inputs,{activation:""},t));else{let n=t[t.length-2],a=D.size(e.inputs[0].dims.slice(0,-2)),s=D.size(e.inputs[1].dims.slice(0,-2));if(a!==1&&n===1&&s===1){let o=e.inputs[0].reshape([1,a,i]),l=e.inputs[1].reshape([1,i,r]),d=[1,a,r],h=[o,l];e.compute(ai(h,{activation:""},t,d),{inputs:h})}else e.compute(ai(e.inputs,{activation:""},t))}}}),ad,sd,od,df,cf,py=K(()=>{"use strict";ce(),fe(),Me(),me(),ad=(e,t)=>{if(e.length<3||e.length>4)throw new Error("MatMulNBits requires 3 or 4 inputs");let r=e[0],i=r.dims.length;if(r.dims[i-1]!==t.k)throw new Error("The last dim of input shape does not match the k value");let n=Math.floor((t.k+t.blockSize-1)/t.blockSize),a=t.blockSize/8*t.bits,s=e[1];if(!D.areEqual(s.dims,[t.n,n,a]))throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let o=e[2].dims;if(D.size(o)!==t.n*n)throw new Error("scales input size error.");if(e.length===4){let l=e[3].dims,d=t.n*(t.bits===8?n:Math.floor((n*t.bits+7)/8));if(D.size(l)!==d)throw new Error("zeroPoints input size error.")}},sd=(e,t)=>{let r=e[0].dims,i=r.length,n=r[i-2],a=t.k,s=t.n,o=r.slice(0,i-2),l=D.size(o),d=e[1].dims[2]/4,h=e[0].dataType,p=Oe(t.k),f=Oe(d),_=Oe(s),m=o.concat([n,s]),w=n>1&&s/_%2===0?2:1,x=D.size(m)/_/w,$=64,b=[],S=[l,n,a/p],I=D.convertShape(e[1].dims).slice();I.splice(-1,1,d/f),b.push(...le(S)),b.push(...le(I)),b.push(...le(e[2].dims)),e.length===4&&b.push(...le(D.convertShape(e[3].dims)));let T=[l,n,s/_];b.push(...le(T));let E=z=>{let v=S.length,B=q("a",e[0].dataType,v,p),P=q("b",12,I.length,f),O=q("scales",e[2].dataType,e[2].dims.length),V=[B,P,O],F=e.length===4?q("zero_points",12,e[3].dims.length):void 0;F&&V.push(F);let A=T.length,N=ae("output",e[0].dataType,A,_),X=Ne(e[0].dataType),J=(()=>{switch(p){case 1:return`array<${X}, 8>`;case 2:return`mat4x2<${X}>`;case 4:return`mat2x4<${X}>`;default:throw new Error(`${p}-component is not supported.`)}})(),Q=Math.floor(32/t.bits),ne=Math.floor(Q/8),ee=()=>{let Z="";for(let H=0;H<ne;H++){let Ie=H*t.bits*4,L=Ie+t.bits;Z+=`
          // reuse a data (pass ${H})
            var input_offset${H>0?H:""} = ${H===0?B.indicesToOffset(`${B.type.indices}(batch, row, word_offset)`):"input_offset"};
            var a_data${H>0?H:""}: ${J};
            for (var j${H>0?H:""}: u32 = 0; j${H>0?H:""} < ${8/p}; j${H>0?H:""}++) {
              a_data${H>0?H:""}[j${H>0?H:""}] = ${B.getByOffset(`input_offset${H>0?H:""}`)};
              input_offset${H>0?H:""}++;
            }
          `;for(let de=0;de<_*w;de++)Z+=`
            b_value = ${f===1?`b${de}_data`:`b${de}_data[i]`};
            ${t.bits===2?`{
              let half_word = b_value >> ${H*16}u;
              let byte_lo = half_word & 0xFFu;
              let byte_hi = (half_word >> 8u) & 0xFFu;
              let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
              b_value_lower = unpack4xU8(spread_word & b_mask);
              b_value_upper = unpack4xU8((spread_word >> 2u) & b_mask);
            }`:`b_value_lower = unpack4xU8((b_value >> ${Ie}u) & b_mask);
            b_value_upper = unpack4xU8((b_value >> ${L}u) & b_mask);`}
            b_quantized_values = ${J}(${Array.from({length:4},(he,U)=>`${X}(b_value_lower[${U}]), ${X}(b_value_upper[${U}])`).join(", ")});
            b_dequantized_values = ${p===1?`${J}(${Array.from({length:8},(he,U)=>`(b_quantized_values[${U}] - ${F?`zero_point${de}`:"zero_point"}) * scale${de}`).join(", ")});`:`(b_quantized_values - ${J}(${Array(8).fill(`${F?`zero_point${de}`:"zero_point"}`).join(",")})) * scale${de};`};
            workgroup_shared[local_id.x * ${w} + ${Math.floor(de/_)}]${_>1?`[${de%_}]`:""} += ${Array.from({length:8/p},(he,U)=>`${p===1?`a_data${H>0?H:""}[${U}] * b_dequantized_values[${U}]`:`dot(a_data${H>0?H:""}[${U}], b_dequantized_values[${U}])`}`).join(" + ")};
          `}return Z},R=()=>{let Z=`
            var col_index = col * ${_};
            ${F?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (nBlocksPerCol + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is ${Math.pow(2,t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${X}(${Math.pow(2,t.bits-1).toFixed(1)});`}
            `;for(let H=0;H<_*w;H++)Z+=`
            let scale${H} = ${O.getByOffset("col_index * nBlocksPerCol + block")};
            ${F?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            zero_point_word = ${F.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${H} = ${X}((zero_point_word) & ${t.bits===2?"0x3u":"0xFu"});`:""}
            col_index += 1;`;return Z},te=()=>{let Z=`col_index = col * ${_};`;for(let H=0;H<_*w;H++)Z+=`
            let b${H}_data = ${P.getByIndices(`${P.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return Z+=`
            var b_value: u32;
            let b_mask: u32 = ${t.bits===2?"0x03030303u":"0x0F0F0F0Fu"};
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${J};
            var b_dequantized_values: ${J};`,Z};return`
        var<workgroup> workgroup_shared: array<${N.type.value}, ${w*$}>;
        ${z.declareVariables(...V,N)}
        ${z.mainStart([$,1,1])}
          let output_indices = ${N.offsetToIndices(`(global_idx / ${$}) * ${w}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${$}) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize/p};
            ${R()}
            for (var word: u32 = 0; word < ${d}; word += ${f}) {
              ${te()}
              for (var i: u32 = 0; i < ${f}; i++) {
                ${ee()}
                word_offset += ${Q/p};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${w}) {
            var output_value: ${N.type.value} = ${N.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${$}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${w};
            }
            ${N.setByIndices(`${N.type.indices}(batch, row, col + local_id.x)`,"output_value")};
          }
        }`};return{name:"MatMulNBits",shaderCache:{hint:`${t.blockSize};${t.bits};${p};${f};${_};${w};${$}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:m,dataType:h}],dispatchGroup:{x},programUniforms:b}),getShaderSource:E}},od=(e,t)=>{let r=e[0].dims,i=r.length,n=r[i-2],a=t.k,s=t.n,o=r.slice(0,i-2),l=D.size(o),d=e[1].dims[2]/4,h=e[0].dataType,p=Oe(t.k),f=Oe(d),_=o.concat([n,s]),m=128,w=s%8===0?8:s%4===0?4:1,x=m/w,$=Math.floor(32/t.bits),b=x*f*$,S=b/p,I=b/t.blockSize,T=D.size(_)/w,E=[],z=[l,n,a/p],v=D.convertShape(e[1].dims).slice();v.splice(-1,1,d/f),E.push(...le(z)),E.push(...le(v)),E.push(...le(e[2].dims)),e.length===4&&E.push(...le(D.convertShape(e[3].dims)));let B=[l,n,s];E.push(...le(B));let P=O=>{let V=z.length,F=q("a",e[0].dataType,V,p),A=q("b",12,v.length,f),N=q("scales",e[2].dataType,e[2].dims.length),X=[F,A,N],J=e.length===4?q("zero_points",12,e[3].dims.length):void 0;J&&X.push(J);let Q=B.length,ne=ae("output",e[0].dataType,Q),ee=Ne(e[0].dataType),R=()=>{switch(p){case 1:return`
          let a_data0 = vec4<${ee}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${ee}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${ee}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${ee}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw new Error(`${p}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${F.type.value}, ${S}>;
        var<workgroup> inter_results: array<array<${ne.type.value}, ${x}>, ${w}>;
        ${O.declareVariables(...X,ne)}
        ${O.mainStart([x,w,1])}
          let output_indices = ${ne.offsetToIndices(`workgroup_index * ${w}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${I} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${S};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${S}; a_offset += ${m})
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${F.getByIndices(`${F.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${F.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${I} + local_id.x;
            ${J?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (n_blocks_per_col + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            let zero_point_word = ${J.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${ee}((zero_point_word) & ${t.bits===2?"0x3u":"0xFu"});`:`
            // The default zero point is ${Math.pow(2,t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${ee}(${Math.pow(2,t.bits-1).toFixed(1)});`}
            let scale = ${N.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${A.getByIndices(`${A.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize/p};
            for (var i: u32 = 0; i < ${f}; i++) {
              let b_value = ${f===1?"b_data":"b_data[i]"};
              ${(()=>{let te=Math.floor($/8),Z="";for(let H=0;H<te;H++){let Ie=H*t.bits*4,L=Ie+t.bits;Z+=`
              ${R()}
              {${t.bits===2?`
                let half_word = b_value >> ${H*16}u;
                let byte_lo = half_word & 0xFFu;
                let byte_hi = (half_word >> 8u) & 0xFFu;
                let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
                let b_value_lower = unpack4xU8(spread_word & 0x03030303u);
                let b_value_upper = unpack4xU8((spread_word >> 2u) & 0x03030303u);`:`
                let b_value_lower = unpack4xU8((b_value >> ${Ie}u) & 0x0F0F0F0Fu);
                let b_value_upper = unpack4xU8((b_value >> ${L}u) & 0x0F0F0F0Fu);`}
                let b_quantized_values = mat2x4<${ee}>(${Array.from({length:4},(de,he)=>`${ee}(b_value_lower[${he}]), ${ee}(b_value_upper[${he}])`).join(", ")});
                let b_dequantized_values = (b_quantized_values - mat2x4<${ee}>(${Array(8).fill("zero_point").join(",")})) * scale;
                inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(de,he)=>`${`dot(a_data${he}, b_dequantized_values[${he}])`}`).join(" + ")};
              }
              word_offset += ${8/p};`}return Z})()}
            }
            workgroupBarrier();
          }

          if (local_idx < ${w}) {
            var output_value: ${ne.type.value} = ${ne.type.value}(0);
            for (var b = 0u; b < ${x}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${ne.setByIndices(`${ne.type.indices}(batch, row, col + local_idx)`,"output_value")}
            }
          }
        }`};return{name:"BlockwiseMatMulNBits32",shaderCache:{hint:`${t.blockSize};${p};${f};${x};${w}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:_,dataType:h}],dispatchGroup:{x:T},programUniforms:E}),getShaderSource:P}},df=(e,t)=>{ad(e.inputs,t),t.blockSize===32&&e.adapterInfo.isVendor("intel")&&e.adapterInfo.isArchitecture("gen-12lp")?e.compute(od(e.inputs,t)):e.compute(sd(e.inputs,t))},cf=e=>Se(e)}),ud,ld,dd,cd,pd,hd,fd,md,pf,hy=K(()=>{"use strict";ce(),fe(),me(),ud=e=>{if(!e||e.length<1)throw new Error("Too few inputs");if(e[0].dataType!==1&&e[0].dataType!==10)throw new Error("Input type must be float or float16.");if(e.length>=2){let t=e[0].dims.length*2===e[1].dims[0];if(e.length===4&&(t=e[3].dims[0]*2===e[1].dims[0]),!t)throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},ld=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
            k = i32(${e.indicesGet("indices",n)}) - ${oe("uniforms.pads",n,r)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${oe("uniforms.x_shape",n,t)})) {
              break;
            }
            offset += k * i32(${oe("uniforms.x_strides",n,t)});
        `;return`
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${i}
            value = x[offset];
          }
      `},dd=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
                k = i32(${e.indicesGet("indices",n)}) - ${oe("uniforms.pads",n,r)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${oe("uniforms.x_shape",n,t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${oe("uniforms.x_shape",n,t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${oe("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},cd=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
                k = i32(${e.indicesGet("indices",n)}) - ${oe("uniforms.pads",n,r)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${oe("uniforms.x_shape",n,t)})) {
                  k = i32(${oe("uniforms.x_shape",n,t)}) - 1;
                }
                offset += k * i32(${oe("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},pd=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
                k = i32(${e.indicesGet("indices",n)}) - ${oe("uniforms.pads",n,r)};
                if (k < 0)  {
                  k += i32(${oe("uniforms.x_shape",n,t)}]);
                }
                if (k >= i32(${oe("uniforms.x_shape",n,t)})) {
                  k -= i32(${oe("uniforms.x_shape",n,t)});
                }
                offset += k * i32(${oe("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},hd=(e,t,r)=>{switch(r.mode){case 0:return ld(e,t,r.pads.length);case 1:return dd(e,t,r.pads.length);case 2:return cd(e,t,r.pads.length);case 3:return pd(e,t,r.pads.length);default:throw new Error("Invalid mode")}},fd=(e,t)=>{let r=D.padShape(e[0].dims.slice(),t.pads),i=e[0].dims,n=D.size(r),a=[{type:12,data:n},{type:6,data:t.pads}],s=e.length>=3&&e[2].data;t.mode===0&&a.push({type:s?e[2].dataType:1,data:t.value}),a.push(...le(e[0].dims,r));let o=["rank"],l=d=>{let h=ae("output",e[0].dataType,r.length),p=q("x",e[0].dataType,i.length),f=p.type.value,_=hd(h,i.length,t),m=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:t.pads.length}];return t.mode===0&&m.push({name:"constant_value",type:s?f:"f32"}),`
            ${d.registerUniforms(m).declareVariables(p,h)}
            ${d.mainStart()}
            ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${h.offsetToIndices("global_idx")};

            var value = ${f}(0);
            ${_}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${t.mode}${s}`,inputDependencies:o},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(D.size(r)/64)},programUniforms:a}),getShaderSource:l}},md=(e,t)=>{if(e.length>1){let r=e[1].getBigInt64Array(),i=e.length>=3&&e[2].data?e[2].dataType===10?e[2].getUint16Array()[0]:e[2].getFloat32Array()[0]:0,n=e[0].dims.length,a=new Int32Array(2*n).fill(0);if(e.length>=4){let o=e[3].getBigInt64Array();for(let l=0;l<o.length;l++)a[Number(o[l])]=Number(r[l]),a[Number(o[l])+n]=Number(r[l+o.length])}else r.forEach((o,l)=>a[Number(l)]=Number(o));let s=[];return a.forEach(o=>s.push(o)),{mode:t.mode,value:i,pads:s}}else return t},pf=(e,t)=>{ud(e.inputs);let r=md(e.inputs,t);e.compute(fd(e.inputs,r),{inputs:[0]})}}),pr,_n,bn,wn,$n,gd,yd,vn,xn,hf,ff,kn,mf,gf,Sn,yf,_f,bf,wf,fy=K(()=>{"use strict";Xe(),ce(),fe(),me(),pr=e=>{if(Ee.webgpu.validateInputContent&&(!e||e.length!==1))throw new Error("Pool ops requires 1 input.")},_n=(e,t,r)=>{let i=t.format==="NHWC",n=e.dims.slice();i&&n.splice(1,0,n.pop());let a=Object.hasOwnProperty.call(t,"dilations"),s=t.kernelShape.slice(),o=t.strides.slice(),l=a?t.dilations.slice():[],d=t.pads.slice();ii.adjustPoolAttributes(r,n,s,o,l,d);let h=ii.computePoolOutputShape(r,n,o,l,s,d,t.autoPad,t.ceilMode),p=Object.assign({},t);a?Object.assign(p,{kernelShape:s,strides:o,pads:d,dilations:l,cacheKey:t.cacheKey}):Object.assign(p,{kernelShape:s,strides:o,pads:d,cacheKey:t.cacheKey});let f=h.slice();return f.push(f.splice(1,1)[0]),[p,i?f:h]},bn=(e,t)=>{let r=t.format==="NHWC",i=D.size(e),n=D.size(t.kernelShape),a=[{type:12,data:i},{type:12,data:n}],s=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(t.kernelShape.length<=2){let o=t.kernelShape[t.kernelShape.length-1],l=t.strides[t.strides.length-1],d=t.pads[t.pads.length/2-1],h=t.pads[t.pads.length-1],p=!!(d+h);a.push({type:12,data:o},{type:12,data:l},{type:12,data:d},{type:12,data:h}),s.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let f=!1;if(t.kernelShape.length===2){let _=t.kernelShape[t.kernelShape.length-2],m=t.strides[t.strides.length-2],w=t.pads[t.pads.length/2-2],x=t.pads[t.pads.length-2];f=!!(w+x),a.push({type:12,data:_},{type:12,data:m},{type:12,data:w},{type:12,data:x}),s.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[a,s,!0,p,f]}else{if(r)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let o=D.computeStrides(t.kernelShape);a.push({type:12,data:o},{type:12,data:t.pads},{type:12,data:t.strides}),s.push({name:"kernelStrides",type:"u32",length:o.length},{name:"pads",type:"u32",length:t.pads.length},{name:"strides",type:"u32",length:t.strides.length});let l=t.pads.reduce((d,h)=>d+h);return[a,s,!!l,!1,!1]}},wn=(e,t,r,i,n,a,s,o,l,d,h,p)=>{let f=n.format==="NHWC",_=t.type.value,m=ae("output",t.type.tensor,i);if(n.kernelShape.length<=2){let w="",x="",$="",b=r-(f?2:1);if(h?w=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${b}] = indices[${b}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${b}] < 0 || xIndices[${b}]
                      >= uniforms.x_shape[${b}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${a}
                }`:w=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${b}] = indices[${b}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${a}
                }`,n.kernelShape.length===2){let S=r-(f?3:2);p?x=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${S}] = indices[${S}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${S}] < 0 || xIndices[${S}] >= uniforms.x_shape[${S}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:x=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${S}] = indices[${S}] * uniforms.sh - uniforms.phStart + j;
                `,$=`
              }
            `}return`
            ${e.registerUniforms(l).declareVariables(t,m)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${m.offsetToIndices("global_idx")};
              var xIndices = ${m.offsetToIndices("global_idx")};

              var value = ${_}(${o});
              var pad = 0;
              ${x}
              ${w}
              ${$}
              ${s}

              output[global_idx] = value;
            }`}else{if(f)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let w=n.kernelShape.length,x=n.pads.length,$="";return d?$=`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${t.indicesToOffset("xIndices")}];
                ${a}
              }`:$=`
              }
              let x_val = x[${t.indicesToOffset("xIndices")}];
              ${a}
            `,`
            ${e.registerUniforms(l).declareVariables(t,m)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${m.offsetToIndices("global_idx")};
              var xIndices = ${m.offsetToIndices("global_idx")};

              var offsets: array<u32, ${w}>;

              var value = ${_}(${o});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${w-1}u; j++) {
                  offsets[j] = offset / ${oe("uniforms.kernelStrides","j",w)};
                  offset -= offsets[j] * ${oe("uniforms.kernelStrides","j",w)};
                }
                offsets[${w-1}] = offset;

                isPad = false;
                for (var j = ${r-w}u; j < ${r}u; j++) {
                  xIndices[j] = indices[j] * ${oe("uniforms.strides",`j - ${r-w}u`,w)}
                    + offsets[j - ${r-w}u] - ${oe("uniforms.pads","j - 2u",x)};
                  ${$}
              }
              ${s}

              output[global_idx] = value;
            }`}},$n=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,gd=e=>`${$n(e)};${e.countIncludePad}`,yd=e=>`${$n(e)};${e.storageOrder};${e.dilations}`,vn=e=>({format:e.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),xn=(e,t,r,i)=>{let[n,a]=_n(t,i,r),s=q("x",t.dataType,t.dims.length),o=s.type.value,l="value += x_val;",d="";n.countIncludePad?d+=`value /= ${o}(uniforms.kernelSize);`:d+=`value /= ${o}(i32(uniforms.kernelSize) - pad);`;let[h,p,f,_,m]=bn(a,n);h.push(...le(t.dims,a));let w=["rank"];return{name:e,shaderCache:{hint:`${i.cacheKey};${f};${_};${m}`,inputDependencies:w},getRunData:()=>({outputs:[{dims:a,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(D.size(a)/64)},programUniforms:h}),getShaderSource:x=>wn(x,s,t.dims.length,a.length,n,l,d,0,p,f,_,m)}},hf=e=>{let t=e.count_include_pad!==0,r=vn(e);if(r.ceilMode!==0)throw new Error("ceil_mode output-shape is computed, but ceil_mode kernel execution (padding/divisor) is not yet implemented in the WebGPU AveragePool kernel");let i={countIncludePad:t,...r,cacheKey:""};return{...i,cacheKey:gd(i)}},ff=(e,t)=>{pr(e.inputs),e.compute(xn("AveragePool",e.inputs[0],!1,t))},kn={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},mf=e=>{let t=e.format;return{format:t,...kn,cacheKey:t}},gf=(e,t)=>{pr(e.inputs),e.compute(xn("GlobalAveragePool",e.inputs[0],!0,t))},Sn=(e,t,r,i)=>{let[n,a]=_n(t,i,r),s=`
      value = max(x_val, value);
    `,o="",l=q("x",t.dataType,t.dims.length),d=["rank"],[h,p,f,_,m]=bn(a,n);return h.push(...le(t.dims,a)),{name:e,shaderCache:{hint:`${i.cacheKey};${f};${_};${m}`,inputDependencies:d},getRunData:()=>({outputs:[{dims:a,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(D.size(a)/64)},programUniforms:h}),getShaderSource:w=>wn(w,l,t.dims.length,a.length,n,s,o,t.dataType===10?-65504:-1e5,p,f,_,m)}},yf=(e,t)=>{pr(e.inputs),e.compute(Sn("MaxPool",e.inputs[0],!1,t))},_f=e=>{let t=e.storage_order,r=e.dilations,i=vn(e);if(t!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(i.ceilMode!==0)throw new Error("ceil_mode output-shape is computed, but ceil_mode kernel execution (padding) is not yet implemented in the WebGPU MaxPool kernel");let n={storageOrder:t,dilations:r,...i,cacheKey:""};return{...n,cacheKey:yd(n)}},bf=e=>{let t=e.format;return{format:t,...kn,cacheKey:t}},wf=(e,t)=>{pr(e.inputs),e.compute(Sn("GlobalMaxPool",e.inputs[0],!0,t))}}),_d,bd,$f,vf,my=K(()=>{"use strict";ce(),fe(),Me(),me(),_d=(e,t)=>{if(e.length<2||e.length>3)throw new Error("DequantizeLinear requires 2 or 3 inputs.");if(e.length===3&&e[1].dims===e[2].dims)throw new Error("x-scale and x-zero-point must have the same shape.");if(e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==0&&e[1].dims.length!==1&&e[1].dims.length!==e[0].dims.length)throw new Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");if(e.length>2){if(e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==e[2].dims.length)throw new Error("scale and zero-point inputs must have the same rank.");if(!e[1].dims.map((r,i)=>r===e[2].dims[i]).reduce((r,i)=>r&&i,!0))throw new Error("scale and zero-point inputs must have the same shape.")}if(t.blockSize>0){if(e[1].dims.length===0||e[1].dims.length===1&&e[1].dims[0]===1)throw new Error("blockSize must be set only for block quantization.");if(!e[1].dims.map((n,a)=>a===t.axis||n===e[0].dims[a]).reduce((n,a)=>n&&a,!0))throw new Error("For block qunatization, scale input shape to match the input shape except for the axis");if(e[1].dims.length!==e[0].dims.length)throw new Error("For block qunatization the scale input rank must be the same as the x rank.");let r=e[0].dims[t.axis],i=e[1].dims[t.axis];if(t.blockSize<Math.ceil(r/i)||t.blockSize>Math.ceil(r/(i-1)-1))throw new Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].")}},bd=(e,t)=>{let r=D.normalizeAxis(t.axis,e[0].dims.length),i=e[0].dataType,n=i===3,a=e[0].dims,s=e[1].dataType,o=D.size(a),l=i===3||i===2,d=l?[Math.ceil(D.size(e[0].dims)/4)]:e[0].dims,h=e[1].dims,p=e.length>2?e[2]:void 0,f=p?l?[Math.ceil(D.size(p.dims)/4)]:p.dims:void 0,_=h.length===0||h.length===1&&h[0]===1,m=_===!1&&h.length===1,w=Oe(o),x=_&&(!l||w===4),$=x?w:1,b=x&&!l?w:1,S=q("input",l?12:i,d.length,b),I=q("scale",s,h.length),T=p?q("zero_point",l?12:i,f.length):void 0,E=ae("output",s,a.length,$),z=[S,I];T&&z.push(T);let v=[d,h];p&&v.push(f);let B=[{type:12,data:o/$},{type:12,data:r},{type:12,data:t.blockSize},...le(...v,a)],P=O=>{let V=[{name:"output_size",type:"u32"},{name:"axis",type:"u32"},{name:"block_size",type:"u32"}];return`
      ${O.registerUniforms(V).declareVariables(...z,E)}
      ${O.mainStart()}
          ${O.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${E.offsetToIndices("global_idx")};

          // Set input x
          ${l?`
            let input = ${S.getByOffset("global_idx / 4")};
            let x_vec = ${n?"unpack4xI8(input)":"unpack4xU8(input)"};
            let x_value = ${$===1?"x_vec[global_idx % 4]":"x_vec"};`:`let x_value = ${S.getByOffset("global_idx")};`};

          // Set scale input
          ${_?`let scale_value= ${I.getByOffset("0")}`:m?`
            let scale_index = ${E.indicesGet("output_indices","uniforms.axis")};
            let scale_value= ${I.getByOffset("scale_index")};`:`
            var scale_indices: ${I.type.indices} = output_indices;
            let index = ${I.indicesGet("scale_indices","uniforms.axis")} / uniforms.block_size;
            ${I.indicesSet("scale_indices","uniforms.axis","index")};
            let scale_value= ${I.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${T?_?l?`
                let zero_point_input = ${T.getByOffset("0")};
                let zero_point_vec =  ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${T.getByOffset("0")}`:m?l?`
                let zero_point_index = ${E.indicesGet("output_indices","uniforms.axis")};
                let zero_point_input = ${T.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${E.indicesGet("output_indices","uniforms.axis")};
                let zero_point_value = ${T.getByOffset("zero_point_index")};`:l?`
                let zero_point_offset = ${I.indicesToOffset("scale_indices")};
                let zero_point_input = ${T.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${T.getByIndices("scale_indices")};`:`let zero_point_value = ${l?n?"i32":"u32":S.type.value}(0);`};
      // Compute and write output
      ${E.setByOffset("global_idx",`${E.type.value}(x_value - zero_point_value) * scale_value`)};
      }`};return{name:"DequantizeLinear",shaderCache:{hint:t.cacheKey,inputDependencies:T?["rank","rank","rank"]:["rank","rank"]},getShaderSource:P,getRunData:()=>({outputs:[{dims:a,dataType:s}],dispatchGroup:{x:Math.ceil(o/$/64),y:1,z:1},programUniforms:B})}},$f=(e,t)=>{_d(e.inputs,t),e.compute(bd(e.inputs,t))},vf=e=>Se({axis:e.axis,blockSize:e.blockSize})}),wd,$d,xf,gy=K(()=>{"use strict";Xe(),ce(),me(),wd=(e,t,r)=>{let i=e===t,n=e<t&&r<0,a=e>t&&r>0;if(i||n||a)throw new Error("Range these inputs' contents are invalid.")},$d=(e,t,r,i)=>{let n=Math.abs(Math.ceil((t-e)/r)),a=[n],s=n,o=[{type:12,data:s},{type:i,data:e},{type:i,data:r},...le(a)],l=d=>{let h=ae("output",i,a.length),p=h.type.value,f=[{name:"outputSize",type:"u32"},{name:"start",type:p},{name:"delta",type:p}];return`
        ${d.registerUniforms(f).declareVariables(h)}
        ${d.mainStart()}
        ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${p}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${i}`},getShaderSource:l,getRunData:()=>({outputs:[{dims:a,dataType:i}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:o})}},xf=e=>{let t=0,r=0,i=0;e.inputs[0].dataType===6?(t=e.inputs[0].getInt32Array()[0],r=e.inputs[1].getInt32Array()[0],i=e.inputs[2].getInt32Array()[0]):e.inputs[0].dataType===1&&(t=e.inputs[0].getFloat32Array()[0],r=e.inputs[1].getFloat32Array()[0],i=e.inputs[2].getFloat32Array()[0]),Ee.webgpu.validateInputContent&&wd(t,r,i),e.compute($d(t,r,i,e.inputs[0].dataType),{inputs:[]})}}),vd,xd,kf,Sf,yy=K(()=>{"use strict";ce(),fe(),Me(),me(),vd=(e,t,r,i)=>{if(e!=="none"&&i!=="i32"&&i!=="u32"&&i!=="f32")throw new Error(`Input ${i} is not supported with reduction ${e}.`);let n=`{
                var oldValue = 0;
                loop {
                  let newValueF32 =`,a=`;
                  let newValue = bitcast<i32>(newValueF32);
                  let res = atomicCompareExchangeWeak(&${t}, oldValue, newValue);
                  if res.exchanged {
                    break;
                  }
                  oldValue = res.old_value;
                }
              }`;switch(e){case"none":return`${t}=${r};`;case"add":return i==="i32"||i==="u32"?`atomicAdd(&${t}, bitcast<${i}>(${r}));`:`
              ${n}bitcast<${i}>(oldValue) + (${r})${a}`;case"max":return i==="i32"||i==="u32"?`atomicMax(&${t}, bitcast<${i}>(${r}));`:`
                ${n}max(bitcast<f32>(oldValue), (${r}))${a}`;case"min":return i==="i32"||i==="u32"?`atomicMin(&${t}, bitcast<${i}>(${r}));`:`${n}min(bitcast<${i}>(oldValue), (${r}))${a}`;case"mul":return`${n}(bitcast<${i}>(oldValue) * (${r}))${a}`;default:throw new Error(`Reduction ${e} is not supported.`)}},xd=(e,t)=>{let r=e[0].dims,i=e[1].dims,n=r,a=1,s=Math.ceil(D.sizeToDimension(i,i.length-1)/a),o=i[i.length-1],l=D.sizeFromDimension(r,o),d=[{type:12,data:s},{type:12,data:o},{type:12,data:l},...le(e[1].dims,e[2].dims,n)],h=p=>{let f=q("indices",e[1].dataType,e[1].dims.length),_=q("updates",e[2].dataType,e[2].dims.length,a),m=t.reduction!=="none"&&t.reduction!==""?Xc("output",e[0].dataType,n.length):ae("output",e[0].dataType,n.length,a);return`
      ${p.registerUniform("output_size","u32").registerUniform("last_index_dimension","u32").registerUniform("num_updates_elements","u32").declareVariables(f,_,m)}
      ${p.mainStart()}
        ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
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
    ${vd(t.reduction,"output[data_offset + i]","value",m.type.value)}
  }

      }`};return{name:"ScatterND",shaderCache:{hint:`${t.cacheKey}_${t.reduction}`,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:d}),getShaderSource:h}},kf=e=>Se({reduction:e.reduction}),Sf=(e,t)=>{e.compute(xd(e.inputs,t),{inputs:[e.inputs[1],e.inputs[2]],outputs:[]})}}),kd,Sd,Td,Tn,Id,Ed,Cd,zd,Ad,Od,Md,Bd,In,Rd,Dd,Nd,Ud,Pd,Tf,If,_y=K(()=>{"use strict";ce(),fe(),Me(),me(),kd=(e,t)=>{if(e.every(r=>r>0||(()=>{throw new Error("Resize requires scales input values to be positive")})),e.length>0){if(t.mode==="linear"){if(!(e.length===2||e.length===3||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1||e.length===5&&e[0]===1&&e[1]===1))throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(t.mode==="cubic"&&!(e.length===2||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1))throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},Sd=(e,t,r)=>{t.every(n=>n>=0&&n<r||(()=>{throw new Error("Resize requires axes input values to be positive and less than rank")}));let i=new Array(r).fill(1);return t.forEach((n,a)=>i[n]=e[a]),i},Td=(e,t,r,i,n,a)=>{let[s,o,l]=r>10?[1,2,3]:[-1,e.length>1?1:-1,-1],d=e[0].dims.length;if(s>0&&e.length>s&&e[s].dims.length>0)e[s].getFloat32Array().forEach(h=>a.push(h));else if(t.coordinateTransformMode==="tf_crop_and_resize")throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(o>0&&e.length>o&&e[o].dims.length===1&&e[o].dims[0]>0){if(e[o].getFloat32Array().forEach(h=>i.push(h)),i.length!==0&&i.length!==d&&r>=18&&i.length!==t.axes.length)throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");kd(i,t),t.axes.length>0&&Sd(i,t.axes,d).forEach((h,p)=>i[p]=h)}if(l>0&&e.length>l&&e[l].dims.length===1&&e[l].dims[0]>0&&(e[l].getBigInt64Array().forEach(h=>n.push(Number(h))),n.length!==0&&n.length!==d&&r>=18&&n.length!==t.axes.length))throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(t.axes.length>0){if(i.length!==0&&i.length!==t.axes.length)throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(n.length!==0&&n.length!==t.axes.length)throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if(typeof i<"u"&&typeof n<"u"&&i.length>0&&n.length>d)throw new Error("Resize requires only of scales or sizes to be specified")},Tn=(e,t,r,i)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${e}) * (${t});
  let whole = ${i}(big / (${r}));
  let fract = ${i}(big % (${r})) / ${i}(${r});
  return whole + fract;
`,Id=(e,t)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${t} { `+(()=>{switch(e){case"asymmetric":return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${t}(xResized) / ${t}(xScale);
          } else {
            ${Tn("xResized","lengthOriginal","lengthResized",t)}
          }
        `;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${t}(xResized) + 0.5) / ${t}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${Tn("xResized","lengthOriginal - 1","lengthResized - 1",t)}
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
                  return offset + ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;case"half_pixel":return`return ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;default:throw new Error(`Coordinate transform mode ${e} is not supported`)}})()+"}",Ed=(e,t,r)=>`fn getNearestPixelFromOriginal(xOriginal: ${r}, isDownSample: bool) -> ${r} {`+(()=>{switch(e){case"round_prefer_ceil":return"if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";case"floor":return"return floor(xOriginal);";case"ceil":return"return ceil(xOriginal);";case"round_prefer_floor":return"if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";default:if(t<11)return"if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";throw new Error(`Nearest mode ${e} is not supported`)}})()+"}",Cd=(e,t,r)=>{let i=new Array(r).fill(0).concat(new Array(r).fill(1)),n=e.length===0?i:e.slice();return t.length>0?(t.forEach((a,s)=>{i[a]=n[s],i[s+r]=n[t.length+s]}),i):n},zd=(e,t,r,i)=>{let n=[];if(r.length>0)if(i.length>0){if(e.forEach(a=>n.push(a)),Math.max(...i)>e.length)throw new Error("axes is out of bound");i.forEach((a,s)=>n[a]=r[s])}else r.forEach(a=>n.push(a));else{if(t.length===0)throw new Error("Resize requires either scales or sizes.");n=e.map((a,s)=>Math.round(a*t[s]))}return n},Ad=(e,t,r)=>{let i=(()=>{switch(r.keepAspectRatioPolicy){case"not_larger":return r.axes.length>0?Math.min(...r.axes.map(a=>t[a]),Number.MAX_VALUE):Math.min(...t,Number.MAX_VALUE);case"not_smaller":return r.axes.length>0?Math.max(...r.axes.map(a=>t[a]),Number.MIN_VALUE):Math.max(...t,Number.MIN_VALUE);default:throw new Error(`Keep aspect ratio policy ${r.keepAspectRatioPolicy} is not supported`)}})();t.fill(1,0,t.length);let n=e.slice();return r.axes.length>0?(r.axes.forEach(a=>t[a]=i),r.axes.forEach(a=>n[a]=Math.round(e[a]*t[a]))):(t.fill(i,0,t.length),n.forEach((a,s)=>n[s]=Math.round(a*t[s]))),n},Od=(e,t,r,i,n)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> array<${e.type.value}, ${r.length}> {
      var original_indices: array<${e.type.value}, ${r.length}>;
      for (var i:u32 = 0; i < ${r.length}; i++) {
        var output_index = ${e.indicesGet("output_indices","i")};
        var scale = ${oe("uniforms.scales","i",i)};
        var roi_low = ${oe("uniforms.roi","i",n)};
        var roi_hi = ${oe("uniforms.roi",`i + ${t.length}`,n)};
        if (scale == 1.0) {
          original_indices[i] = ${e.type.value}(output_index);
        } else {
          var input_shape_i = ${oe("uniforms.input_shape","i",t.length)};
          var output_shape_i = ${oe("uniforms.output_shape","i",r.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,Md=(e,t,r,i,n,a,s)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
      var input_indices: ${e.type.indices};
      for (var i:u32 = 0; i < ${i.length}; i++) {
        var output_index = ${t.indicesGet("output_indices","i")};
        var input_index: u32;
        var scale = ${oe("uniforms.scales","i",n)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${oe("uniforms.roi","i",a)};
          var roi_hi = ${oe("uniforms.roi",`i + ${r.length}`,a)};
          var input_shape_i = ${oe("uniforms.input_shape","i",r.length)};
          var output_shape_i = ${oe("uniforms.output_shape","i",i.length)};
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
    }`,Bd=(e,t)=>`
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${oe("uniforms.input_shape","i",t.length)}) {
          return false;
        }
      }
      return true;
    }`,In=(e,t,r,i)=>e.rank>i?`
    ${e.indicesSet("input_indices",t,"channel")};
    ${e.indicesSet("input_indices",r,"batch")};
`:"",Rd=(e,t,r,i,n)=>{let[a,s,o,l]=r.length===2?[-1,0,1,-1]:[0,2,3,1],d=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${d} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(row, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",o,`max(0, min(col, ${r[o]} - 1))`)};
      ${In(e,l,a,2)}
      return ${e.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${t.type.indices}) -> ${d} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${d} = originalIndices[${s}];
      var col:${d} = originalIndices[${o}];
      ${i?`if (row < 0 || row > (${r[s]} - 1) || col < 0 || col > (${r[o]} - 1)) {
        return ${n};
      }`:""};
      row = max(0, min(row, ${r[s]} - 1));
      col = max(0, min(col, ${r[o]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${r.length>2?`u32(originalIndices[${l}])`:"0"};
      var batch: u32 =  ${r.length>2?`u32(originalIndices[${a}])`:"0"};
      var x11: ${d} = getInputValue(batch, channel, row1, col1);
      var x12: ${d} = getInputValue(batch, channel, row1, col2);
      var x21: ${d} = getInputValue(batch, channel, row2, col1);
      var x22: ${d} = getInputValue(batch, channel, row2, col2);
      var dx1: ${d} = abs(row - ${d}(row1));
      var dx2: ${d} = abs(${d}(row2) - row);
      var dy1: ${d} = abs(col - ${d}(col1));
      var dy2: ${d} = abs(${d}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`},Dd=(e,t,r,i,n,a,s,o,l,d)=>{let h=r.length===2,p=!0,[f,_]=h?[0,1]:p?[2,3]:[1,2],m=e.type.value,w=x=>{let $=x===f?"row":"col";return`
      fn ${$}CubicInterpolation(input_indices: ${e.type.indices}, output_indices: ${t.type.indices}) -> ${m} {
        var output_index = ${t.indicesGet("output_indices",x)};
        var originalIdx: ${m} = getOriginalCoordinateFromResizedCoordinate(output_index, ${n[x]},
        ${i[x]}, ${r[x]}, ${a[x]}, ${a[x]} + ${r.length});
        var fractOriginalIdx: ${m} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${o} && (originalIdx < 0 || originalIdx > (${r[x]} - 1))) {
          return ${l};
        }
        var data: array<${m}, 4> = array<${m}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${$}: ${m} = originalIdx + ${m}(i);
          if (${$} < 0 || ${$} >= ${r[x]}) {
            ${d?`coefs[i + 1] = 0.0;
                        continue;`:o?`return ${l};`:`${$} = max(0, min(${$}, ${r[x]} - 1));`};
          }
        var input_indices_copy: ${e.type.indices} = input_indices;
          ${e.indicesSet("input_indices_copy",x,`u32(${$})`)};
          data[i + 1] = ${x===f?e.getByIndices("input_indices_copy"):"rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${w(f)};
    ${w(_)};
  fn getCubicInterpolationCoefs(s: ${m}) -> array<${m}, 4> {
    var absS = abs(s);
    var coeffs: array<${m}, 4> = array<${m}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${m} = 1.0 - absS;
    var twoMinusAbsS: ${m} = 2.0 - absS;
    var onePlusAbsS: ${m} = 1.0 + absS;
    coeffs[0] = ((${s} * onePlusAbsS - 5 * ${s}) * onePlusAbsS + 8 * ${s}) * onePlusAbsS - 4 * ${s};
    coeffs[1] = ((${s} + 2) * absS - (${s} + 3)) * absS * absS + 1;
    coeffs[2] = ((${s} + 2) * oneMinusAbsS - (${s} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${s} * twoMinusAbsS - 5 * ${s}) * twoMinusAbsS + 8 * ${s}) * twoMinusAbsS - 4 * ${s};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${m}, 4>, coefs: array<${m}, 4>) -> ${m} {
    var coefsSum: ${m} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${t.type.indices}) -> ${m} {
    var input_indices: ${e.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `},Nd=(e,t,r,i,n)=>{let[a,s,o,l,d]=r.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],h=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${h} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(depth, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",o,`max(0, min(height, ${r[o]} - 1))`)};
      ${e.indicesSet("input_indices",l,`max(0, min(width, ${r[l]} - 1))`)};
      ${In(e,d,a,3)}
      return ${e.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${t.type.indices}) -> ${h} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${h} = originalIndices[${s}];
      var height:${h} = originalIndices[${o}];
      var width:${h} = originalIndices[${l}];
      ${i?`if (depth < 0 || depth > (${r[s]} - 1) || height < 0 || height > (${r[o]} - 1) || width < 0 || (width > ${r[l]} - 1)) {
      return ${n};
        }`:""};

    depth = max(0, min(depth, ${r[s]} - 1));
      height = max(0, min(height, ${r[o]} - 1));
      width = max(0, min(width, ${r[l]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${r.length>3?`u32(originalIndices[${d}])`:"0"};
      var batch: u32 =  ${r.length>3?`u32(originalIndices[${a}])`:"0"};

      var x111: ${h} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${h} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${h} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${h} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${h} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${h} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${h} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${h} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${h} = abs(depth - ${h}(depth1));
      var dx2: ${h} = abs(${h}(depth2) - depth);
      var dy1: ${h} = abs(height - ${h}(height1));
      var dy2: ${h} = abs(${h}(height2) - height);
      var dz1: ${h} = abs(width - ${h}(width1));
      var dz2: ${h} = abs(${h}(width2) - width);
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
    }`},Ud=(e,t,r,i,n,a)=>{let s=e.dims,o=Cd(a,t.axes,s.length),l=zd(s,i,n,t.axes),d=i.slice();i.length===0&&(d=s.map((b,S)=>b===0?1:l[S]/b),t.keepAspectRatioPolicy!=="stretch"&&(l=Ad(s,d,t)));let h=ae("output",e.dataType,l.length),p=q("input",e.dataType,s.length),f=D.size(l),_=s.length===l.length&&s.every((b,S)=>b===l[S]),m=t.coordinateTransformMode==="tf_crop_and_resize",w=t.extrapolationValue,x=p.type.value,$=b=>`
      ${_?"":`
      ${Id(t.coordinateTransformMode,x)};
      ${(()=>{switch(t.mode){case"nearest":return`
              ${Bd(p,s)};
              ${Ed(t.nearestMode,r,x)};
              ${Md(p,h,s,l,d.length,o.length,m)};
              `;case"linear":return`
              ${Od(h,s,l,d.length,o.length)};
              ${(()=>{if(s.length===2||s.length===4)return`${Rd(p,h,s,m,w)}`;if(s.length===3||s.length===5)return`${Nd(p,h,s,m,w)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(s.length===2||s.length===4)return`${Dd(p,h,s,l,d,o,t.cubicCoeffA,m,t.extrapolationValue,t.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
            `;default:throw Error("Invalid resize mode")}})()};
      `}
      ${b.registerUniform("output_size","u32").registerUniform("scales","f32",d.length).registerUniform("roi","f32",o.length).declareVariables(p,h)}
      ${b.mainStart()}
        ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${_?"output[global_idx] = input[global_idx];":`
        let output_indices = ${h.offsetToIndices("global_idx")};
        var input_indices: ${p.type.indices};
        ${(()=>{switch(t.mode){case"nearest":return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${p.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${t.extrapolationValue};
                }`;case"linear":return`output[global_idx] = ${s.length===2||s.length===4?"bilinearInterpolation":"trilinearInterpolation"}(output_indices);`;case"cubic":return"output[global_idx] = bicubicInterpolation(output_indices);";default:throw Error(`Unsupported resize mode: ${t.mode}`)}})()};
`}
      }`;return{name:"Resize",shaderCache:{hint:`${t.cacheKey}|${r}|${d.length>0?t.mode==="cubic"?d:d.length:""}|${n.length>0?n:""}|${o.length>0?o:""}|${_}|${t.mode==="nearest"?s.length:s}`,inputDependencies:["rank"]},getShaderSource:$,getRunData:()=>({outputs:[{dims:l,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:[{type:12,data:f},{type:1,data:d},{type:1,data:o},...le(s,l)]})}},Pd=e=>{let t=e.customDataBuffer;return new Uint32Array(t.buffer,t.byteOffset,1)[0]},Tf=(e,t)=>{let r=[],i=[],n=[],a=Pd(e);if(t.antialias!==0)throw Error("Only default value (0) for Antialias attribute is supported");Td(e.inputs,t,a,r,i,n),e.compute(Ud(e.inputs[0],t,a,r,i,n),{inputs:[0]})},If=e=>{let t=e.antialias,r=e.axes,i=e.coordinateTransformMode,n=e.cubicCoeffA,a=e.excludeOutside!==0,s=e.extrapolationValue,o=e.keepAspectRatioPolicy,l=e.mode,d=e.nearestMode===""?"simple":e.nearestMode;return Se({antialias:t,axes:r,coordinateTransformMode:i,cubicCoeffA:n,excludeOutside:a,extrapolationValue:s,keepAspectRatioPolicy:o,mode:l,nearestMode:d})}}),qd,Ld,Ef,by=K(()=>{"use strict";ce(),fe(),me(),qd=e=>{if(!e||e.length<3)throw new Error("layerNorm requires at least 3 inputs.");let t=e[0],r=e[1],i=e[2];if(t.dataType!==r.dataType||t.dataType!==i.dataType)throw new Error("All inputs must have the same data type");if(t.dims.length!==3&&t.dims.length!==2)throw new Error("Input must be 2D or 3D");if(r.dims.length!==3&&r.dims.length!==2)throw new Error("Skip must be 2D or 3D");let n=t.dims[t.dims.length-1],a=t.dims[t.dims.length-2];if(r.dims[r.dims.length-1]!==n)throw new Error("Skip must have the same hidden size as input");if(r.dims[r.dims.length-2]!==a)throw new Error("Skip must have the same sequence length as input");if(i.dims.length!==1)throw new Error("Gamma must be 1D");if(i.dims[i.dims.length-1]!==n)throw new Error("Gamma must have the same hidden size as input");if(e.length>3){let s=e[3];if(s.dims.length!==1)throw new Error("Beta must be 1D");if(s.dims[s.dims.length-1]!==n)throw new Error("Beta must have the same hidden size as input")}if(e.length>4){let s=e[4];if(s.dims.length!==1)throw new Error("Bias must be 1D");if(s.dims[s.dims.length-1]!==n)throw new Error("Bias must have the same hidden size as input")}},Ld=(e,t,r,i)=>{let n=t.simplified,a=e[0].dims,s=D.size(a),o=a,l=s,d=a.slice(-1)[0],h=i?a.slice(0,-1).concat(1):[],p=!n&&e.length>3,f=e.length>4,_=i&&r>1,m=i&&r>2,w=r>3,x=64,$=Oe(d),b=[{type:12,data:l},{type:12,data:$},{type:12,data:d},{type:1,data:t.epsilon}],S=T=>{let E=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],z=[q("x",e[0].dataType,e[0].dims,$),q("skip",e[1].dataType,e[1].dims,$),q("gamma",e[2].dataType,e[2].dims,$)];p&&z.push(q("beta",e[3].dataType,e[3].dims,$)),f&&z.push(q("bias",e[4].dataType,e[4].dims,$)),z.push(ae("output",e[0].dataType,o,$)),_&&z.push(ae("mean_output",1,h)),m&&z.push(ae("inv_std_output",1,h)),w&&z.push(ae("input_skip_bias_sum",e[0].dataType,o,$));let v=Ne(e[0].dataType),B=Ne(1,$);return`

      ${T.registerUniforms(E).declareVariables(...z)}
      var<workgroup> sum_shared : array<${B}, ${x}>;
      var<workgroup> sum_squared_shared : array<${B}, ${x}>;

      ${T.mainStart([x,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / ${x};

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / ${x};
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == ${x-1}) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${f?"bias[offset1d + i]":v+"(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${w?"input_skip_bias_sum[offset + i] = value;":""}
          output[offset + i] = value;
          let f32_value = ${Yt(v,$,"value")};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = ${x};
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
        let mean = ${St("sum",$)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${St("square_sum",$)} / f32(uniforms.hidden_size) ${n?"":"- mean * mean"} + uniforms.epsilon);
        ${_?"mean_output[global_idx] = mean;":""}
        ${m?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${n?"":`- ${v}(mean)`}) *
            ${v}(inv_std_dev) * gamma[offset1d + i]
            ${p?"+ beta[offset1d + i]":""};
        }
      }`},I=[{dims:o,dataType:e[0].dataType}];return r>1&&I.push({dims:h,dataType:1}),r>2&&I.push({dims:h,dataType:1}),r>3&&I.push({dims:a,dataType:e[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${$};${_};${m};${w}`,inputDependencies:e.map((T,E)=>"type")},getShaderSource:S,getRunData:()=>({outputs:I,dispatchGroup:{x:Math.ceil(l/d)},programUniforms:b})}},Ef=(e,t)=>{qd(e.inputs);let r=[0];e.outputCount>1&&r.push(-3),e.outputCount>2&&r.push(-3),e.outputCount>3&&r.push(3),e.compute(Ld(e.inputs,t,e.outputCount,!1),{outputs:r})}}),Wd,hr,Vd,En,Gd,Hd,Cf,zf,wy=K(()=>{"use strict";ce(),fe(),Me(),me(),Wd=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");if(t.axes.length!==0){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw new Error("axes, starts and ends must have the same length")}else if(t.starts.length!==t.ends.length)throw new Error("starts and ends must have the same length");e.slice(1).forEach((r,i)=>{if(e[i+1].dataType!==6&&e[i+1].dataType!==7)throw new Error(`Input ${i} must be an array of int32 or int64`)})},hr=(e,t)=>{let r=[];if(e.length>t)if(e[t].dataType===7)e[t].getBigInt64Array().forEach(i=>r.push(Number(i)));else if(e[t].dataType===6)e[t].getInt32Array().forEach(i=>r.push(Number(i)));else throw new Error(`Input ${t} must be an array of int32 or int64`);return r},Vd=(e,t)=>{if(e.length>1){let r=hr(e,1),i=hr(e,2),n=hr(e,3);return n.length===0&&(n=[...Array(e[0].dims.length).keys()]),Se({starts:r,ends:i,axes:n})}else return t},En=(e,t,r,i,n)=>{let a=e;return e<0&&(a+=r[i[t]]),n[t]<0?Math.max(0,Math.min(a,r[i[t]]-1)):Math.max(0,Math.min(a,r[i[t]]))},Gd=(e,t,r)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
          var input_indices: ${e.type.indices};
          var carry = 0u;
          for (var i = ${r.length-1}; i >= 0; i--) {
            let input_shape_i = ${oe("uniforms.input_shape","i",r.length)};
            let steps_i = ${oe("uniforms.steps","i",r.length)};
            let signs_i = ${oe("uniforms.signs","i",r.length)};
            let starts_i = ${oe("uniforms.starts","i",r.length)};
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
      }`,Hd=(e,t)=>{let r=e[0].dims,i=D.size(r),n=t.axes.length>0?D.normalizeAxes(t.axes,r.length):[...Array(r.length).keys()],a=hr(e,4);a.forEach($=>$!==0||(()=>{throw new Error("step cannot be 0")})),a.length===0&&(a=Array(n.length).fill(1));let s=t.starts.map(($,b)=>En($,b,r,n,a)),o=t.ends.map(($,b)=>En($,b,r,n,a));if(n.length!==s.length||n.length!==o.length)throw new Error("start, ends and axes should have the same number of elements");if(n.length!==r.length)for(let $=0;$<r.length;++$)n.includes($)||(s.splice($,0,0),o.splice($,0,r[$]),a.splice($,0,1));let l=a.map($=>Math.sign($));a.forEach(($,b,S)=>{if($<0){let I=(o[b]-s[b])/$,T=s[b],E=T+I*a[b];s[b]=E,o[b]=T,S[b]=-$}});let d=r.slice(0);n.forEach(($,b)=>{d[$]=Math.ceil((o[$]-s[$])/a[$])});let h={dims:d,dataType:e[0].dataType},p=ae("output",e[0].dataType,d.length),f=q("input",e[0].dataType,e[0].dims.length),_=D.size(d),m=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:s.length},{name:"signs",type:"i32",length:l.length},{name:"steps",type:"u32",length:a.length}],w=[{type:12,data:_},{type:12,data:s},{type:6,data:l},{type:12,data:a},...le(e[0].dims,d)],x=$=>`
      ${$.registerUniforms(m).declareVariables(f,p)}
        ${Gd(f,p,r)}
        ${$.mainStart()}
          ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${p.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${p.setByOffset("global_idx",f.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${l.length}_${s.length}_${a.length}`,inputDependencies:["rank"]},getShaderSource:x,getRunData:()=>({outputs:[h],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:w})}},Cf=(e,t)=>{Wd(e.inputs,t);let r=Vd(e.inputs,t);e.compute(Hd(e.inputs,r),{inputs:[0]})},zf=e=>{let t=e.starts,r=e.ends,i=e.axes;return Se({starts:t,ends:r,axes:i})}}),Fd,jd,Af,Of,$y=K(()=>{"use strict";ce(),fe(),Me(),Tt(),me(),Fd=e=>{if(!e||e.length!==1)throw new Error("Softmax op requires 1 input.")},jd=(e,t)=>{let r=e.inputs[0],i=r.dims,n=D.size(i),a=i.length,s=D.normalizeAxis(t.axis,a),o=s<i.length-1,l,d=[];o?(d=Array.from({length:a},(z,v)=>v),d[s]=a-1,d[a-1]=s,l=e.compute(Fe(r,d),{inputs:[r],outputs:[-1]})[0]):l=r;let h=l.dims,p=h[a-1],f=n/p,_=Oe(p),m=p/_,w=64;f===1&&(w=256);let x=(z,v)=>v===4?`max(max(${z}.x, ${z}.y), max(${z}.z, ${z}.w))`:v===2?`max(${z}.x, ${z}.y)`:v===3?`max(max(${z}.x, ${z}.y), ${z}.z)`:z,$=q("x",l.dataType,l.dims,_),b=ae("result",l.dataType,l.dims,_),S=$.type.value,I=Ne(l.dataType)==="f32"?`var threadMax = ${S}(-3.4028234663852886e+38f);`:`var threadMax = ${S}(-65504.0h);`,T=z=>`
      var<workgroup> rowMaxShared : ${S};
      var<workgroup> rowSumShared : ${S};
      var<workgroup> threadShared : array<${S}, ${w}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${S} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${S}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${z.registerUniform("packedCols","i32").declareVariables($,b)}
      ${z.mainStart(w)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${w};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${I}
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
          rowMaxShared = ${S}(${x("threadShared[0]",_)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${S}(0.0);
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
          rowSumShared = ${S}(${St("threadShared[0]",_)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          var value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          // max operation protects against NaN since all values should be >=0
          value = max(value, ${S}(0.0));
          setValue(row, col, row_stride, value);
        }
      }`,E=e.compute({name:"Softmax",shaderCache:{hint:`${_};${w}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:h,dataType:l.dataType}],dispatchGroup:{x:f},programUniforms:[{type:6,data:m}]}),getShaderSource:T},{inputs:[l],outputs:[o?-1:0]})[0];o&&e.compute(Fe(E,d),{inputs:[E]})},Af=(e,t)=>{Fd(e.inputs),jd(e,t)},Of=e=>Se({axis:e.axis})}),Cn,Kd,Xd,Yd,Mf,vy=K(()=>{"use strict";ce(),fe(),me(),Cn=e=>Array.from(e.getBigInt64Array(),Number),Kd=e=>{if(!e||e.length!==2)throw new Error("Tile requires 2 inputs.");if(e[0].dataType!==1&&e[0].dataType!==10&&e[0].dataType!==6&&e[0].dataType!==12)throw new Error("Tile only support float, float16, int32, and uint32 data types");if(e[1].dataType!==7)throw new Error("Tile `repeats` input should be of int64 data type");if(e[1].dims.length!==1)throw new Error("Tile `repeats` input should be 1-D");if(Cn(e[1]).length!==e[0].dims.length)throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},Xd=(e,t)=>{let r=[];for(let i=0;i<e.length;++i)r.push(e[i]*t[i]);return r},Yd=(e,t)=>{let r=e[0].dims,i=t??Cn(e[1]),n=Xd(r,i),a=D.size(n),s=e[0].dataType,o=q("input",s,r.length),l=ae("output",s,n.length),d=h=>`
      const inputShape = ${o.indices(...r)};
      ${h.registerUniform("output_size","u32").declareVariables(o,l)}
      ${h.mainStart()}
      ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let output_indices = ${l.offsetToIndices("global_idx")};
      var input_indices: ${o.type.indices};
      for (var i = 0; i < ${r.length}; i++) {
        let input_dim_i = ${o.indicesGet("uniforms.input_shape","i")};
        let input_dim_value = ${l.indicesGet("output_indices","i")}  % input_dim_i;

        ${o.indicesSet("input_indices","i","input_dim_value")}
      }
      ${l.setByOffset("global_idx",o.getByIndices("input_indices"))}
    }`;return{name:"Tile",shaderCache:{hint:`${i}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:[{type:12,data:a},...le(e[0].dims,n)]}),getShaderSource:d}},Mf=e=>{Kd(e.inputs),e.compute(Yd(e.inputs),{inputs:[0]})}}),Zd,Qd,Bf,xy=K(()=>{"use strict";ce(),fe(),me(),Zd=(e,t,r,i,n)=>{let a=ae("output_data",n,r.length,4),s=q("a_data",t[1].dataType,t[1].dims.length,4),o=q("b_data",t[2].dataType,t[2].dims.length,4),l=q("c_data",t[0].dataType,t[0].dims.length,4),d,h=(p,f,_)=>`select(${f}, ${p}, ${_})`;if(!i)d=a.setByOffset("global_idx",h(s.getByOffset("global_idx"),o.getByOffset("global_idx"),l.getByOffset("global_idx")));else{let p=(f,_,m="")=>{let w=`a_data[index_a${_}][component_a${_}]`,x=`b_data[index_b${_}][component_b${_}]`,$=`bool(c_data[index_c${_}] & (0xffu << (component_c${_} * 8)))`;return`
            let output_indices${_} = ${a.offsetToIndices(`global_idx * 4u + ${_}u`)};
            let offset_a${_} = ${s.broadcastedIndicesToOffset(`output_indices${_}`,a)};
            let offset_b${_} = ${o.broadcastedIndicesToOffset(`output_indices${_}`,a)};
            let offset_c${_} = ${l.broadcastedIndicesToOffset(`output_indices${_}`,a)};
            let index_a${_} = offset_a${_} / 4u;
            let index_b${_} = offset_b${_} / 4u;
            let index_c${_} = offset_c${_} / 4u;
            let component_a${_} = offset_a${_} % 4u;
            let component_b${_} = offset_b${_} % 4u;
            let component_c${_} = offset_c${_} % 4u;
            ${f}[${_}] = ${m}(${h(w,x,$)});
          `};n===9?d=`
            var data = vec4<u32>(0);
            ${p("data",0,"u32")}
            ${p("data",1,"u32")}
            ${p("data",2,"u32")}
            ${p("data",3,"u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:d=`
            ${p("output_data[global_idx]",0)}
            ${p("output_data[global_idx]",1)}
            ${p("output_data[global_idx]",2)}
            ${p("output_data[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(l,s,o,a)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${d}
      }`},Qd=e=>{let t=e[1].dims,r=e[2].dims,i=e[0].dims,n=e[1].dataType,a=!(D.areEqual(t,r)&&D.areEqual(r,i)),s=t,o=D.size(t);if(a){let d=Jt.calcShape(Jt.calcShape(t,r,!1),i,!1);if(!d)throw new Error("Can't perform where op on the given tensors");s=d,o=D.size(s)}let l=Math.ceil(o/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:d=>Zd(d,e,s,a,n),getRunData:()=>({outputs:[{dims:s,dataType:n}],dispatchGroup:{x:Math.ceil(o/64/4)},programUniforms:[{type:12,data:l},...le(i,t,r,s)]})}},Bf=e=>{e.compute(Qd(e.inputs))}}),Rf,ky=K(()=>{"use strict";N0(),ma(),U0(),P0(),q0(),L0(),W0(),j0(),X0(),Y0(),Z0(),Q0(),J0(),ey(),ty(),ry(),iy(),ny(),ay(),sy(),oy(),uy(),ly(),dy(),cy(),py(),Jh(),hy(),fy(),my(),gy(),yy(),fa(),_y(),af(),by(),wy(),$y(),rf(),vy(),Tt(),ga(),xy(),Rf=new Map([["Abs",[kp]],["Acos",[Sp]],["Acosh",[Tp]],["Add",[oh]],["ArgMax",[wp,Gn]],["ArgMin",[bp,Gn]],["Asin",[Ip]],["Asinh",[Ep]],["Atan",[Cp]],["Atanh",[zp]],["Attention",[$p]],["AveragePool",[ff,hf]],["BatchNormalization",[vp]],["BiasAdd",[xp]],["BiasSplitGelu",[sh]],["Cast",[Op,Ap]],["Ceil",[Bp]],["Clip",[Mp]],["Concat",[yh,_h]],["Conv",[Yn,Xn]],["ConvTranspose",[Eh,Ih]],["Cos",[Rp]],["Cosh",[Dp]],["CumSum",[Ch,zh]],["DepthToSpace",[Ah,Oh]],["DequantizeLinear",[$f,vf]],["DFT",[Mh,Bh]],["Div",[uh]],["Einsum",[Rh,Dh]],["Elu",[Np,yr]],["Equal",[lh]],["Erf",[Up]],["Exp",[Pp]],["Expand",[Nh]],["FastGelu",[Uh]],["Floor",[qp]],["FusedConv",[Yn,Xn]],["Gather",[qh,Ph]],["GatherElements",[Fh,Hh]],["GatherBlockQuantized",[Vh,Gh]],["GatherND",[Lh,Wh]],["Gelu",[Lp]],["Gemm",[Kh,jh]],["GlobalAveragePool",[gf,mf]],["GlobalMaxPool",[wf,bf]],["Greater",[hh]],["GreaterOrEqual",[mh]],["GridSample",[Xh,Yh]],["GroupQueryAttention",[sf]],["HardSigmoid",[Xp,Kp]],["HardSwish",[Yp]],["InstanceNormalization",[of]],["LayerNormalization",[uf]],["LeakyRelu",[Wp,yr]],["Less",[fh]],["LessOrEqual",[gh]],["Log",[nh]],["MatMul",[lf]],["MatMulNBits",[df,cf]],["MaxPool",[yf,_f]],["Mul",[dh]],["MultiHeadAttention",[Qh,Zh]],["Neg",[Gp]],["Not",[Vp]],["Pad",[pf]],["Pow",[ch]],["QuickGelu",[ah,yr]],["Range",[xf]],["Reciprocal",[Hp]],["ReduceMin",[fp]],["ReduceMean",[lp]],["ReduceMax",[hp]],["ReduceSum",[gp]],["ReduceProd",[mp]],["ReduceL1",[dp]],["ReduceL2",[cp]],["ReduceLogSum",[_p]],["ReduceLogSumExp",[pp]],["ReduceSumSquare",[yp]],["Relu",[Fp]],["Resize",[Tf,If]],["RotaryEmbedding",[nf]],["ScatterND",[Sf,kf]],["Sigmoid",[jp]],["Sin",[Zp]],["Sinh",[Qp]],["Slice",[Cf,zf]],["SkipLayerNormalization",[Ef]],["Split",[ef,tf]],["Sqrt",[Jp]],["Softmax",[Af,Of]],["Sub",[ph]],["Tan",[eh]],["Tanh",[th]],["ThresholdedRelu",[ih,yr]],["Tile",[Mf]],["Transpose",[Zc,Qc]],["Where",[Bf]]])}),Df,Sy=K(()=>{"use strict";Xe(),mt(),me(),Df=class{constructor(e){this.backend=e,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,r,i,n){ut(e.programInfo.name);let a=this.backend.device,s=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let o=[];for(let d of t)o.push({binding:o.length,resource:{buffer:d.buffer}});for(let d of r)o.push({binding:o.length,resource:{buffer:d.buffer}});n&&o.push({binding:o.length,resource:n});let l=a.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:o,label:e.programInfo.name});if(this.backend.sessionStatus==="capturing"){let d={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:l,dispatchGroup:i};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(d)}s.setPipeline(e.computePipeline),s.setBindGroup(0,l),s.dispatchWorkgroups(...i),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType==="at-passes")&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),it(e.programInfo.name)}dispose(){}build(e,t){ut(e.name);let r=this.backend.device,i=[];[{feature:"shader-f16",extension:"f16"},{feature:"subgroups",extension:"subgroups"}].forEach(d=>{r.features.has(d.feature)&&i.push(`enable ${d.extension};`)});let n=Yc(t,this.backend.device.limits),a=e.getShaderSource(n),s=`${i.join(`
`)}
${n.additionalImplementations}
${a}`,o=r.createShaderModule({code:s,label:e.name});ve("verbose",()=>`[WebGPU] ${e.name} shader code: ${s}`);let l=r.createComputePipeline({compute:{module:o,entryPoint:"main"},layout:"auto",label:e.name});return it(e.name),{programInfo:e,computePipeline:l,uniformVariablesInfo:n.variablesInfo}}normalizeDispatchGroupSize(e){let t=typeof e=="number"?e:e.x,r=typeof e=="number"?1:e.y||1,i=typeof e=="number"?1:e.z||1,n=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(t<=n&&r<=n&&i<=n)return[t,r,i];let a=t*r*i,s=Math.ceil(Math.sqrt(a));if(s>n){if(s=Math.ceil(Math.cbrt(a)),s>n)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[s,s,s]}else return[s,s,1]}}}),Nf={};tr(Nf,{WebGpuBackend:()=>Uf});var Jd,ec,tc,Uf,Ty=K(()=>{"use strict";Xe(),ce(),mt(),Hc(),R0(),ky(),Sy(),Jd=(e,t)=>{if(t.length!==e.length)throw new Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let r=[];for(let i=0;i<e.length;++i){let n=e[i].dataType;switch(t[i]){case"none":{r.push("");break}case"type":{r.push(`${n}`);break}case"rank":{let a=e[i].dims.length;r.push(`${n};${a}`);break}case"dims":{let a=e[i].dims.join(",");r.push(`${n};${a}`);break}default:throw new Error(`unsupported input dependency: ${t[i]}`)}}return r.join("|")},ec=(e,t,r)=>{let i=e.name;return e.shaderCache?.hint&&(i+="["+e.shaderCache.hint+"]"),i+=":"+r+`:${Jd(t,e.shaderCache?.inputDependencies??new Array(t.length).fill("dims"))}`,i},tc=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},Uf=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus="default",this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,t){this.env=e;let r=[],i={requiredLimits:{maxComputeWorkgroupStorageSize:t.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:t.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:t.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.limits.maxComputeWorkgroupSizeZ},requiredFeatures:r},n=o=>t.features.has(o)&&r.push(o)&&!0;n("chromium-experimental-timestamp-query-inside-passes")||n("timestamp-query"),n("shader-f16"),n("subgroups"),this.device=await t.requestDevice(i);let a=t,s=t.info??(typeof a.requestAdapterInfo=="function"?await a.requestAdapterInfo():void 0);this.adapterInfo=new tc(s),this.gpuDataManager=Kc(this),this.programManager=new Df(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,da(e.logLevel,!!e.debug),this.device.onuncapturederror=o=>{o.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${o.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!0}),Object.defineProperty(this.env.webgpu,"adapter",{value:t,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){typeof this.querySet<"u"&&this.querySet.destroy(),this.gpuDataManager.dispose(),this.device&&this.env?.webgpu&&this.device.lost.then(()=>{delete this.env.webgpu.device})}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),t={};this.queryType==="at-passes"&&(t.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=e.beginComputePass(t)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){if(!this.commandEncoder)return;ut(),this.endComputePass();let e;this.queryType!=="none"&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),e=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!=="none"&&e.mapAsync(GPUMapMode.READ).then(()=>{let t=new BigUint64Array(e.getMappedRange()),r=this.pendingQueries.get(e);for(let i=0;i<t.length/2;i++){let n=r[i],a=n.kernelId,s=this.kernels.get(a),o=s.kernelType,l=s.kernelName,d=n.programName,h=n.inputTensorViews,p=n.outputTensorViews,f=t[i*2],_=t[i*2+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=f);let m=Number(f-this.queryTimeBase),w=Number(_-this.queryTimeBase);if(!Number.isSafeInteger(m)||!Number.isSafeInteger(w))throw new RangeError("incorrect timestamp range");if(this.env.webgpu.profiling?.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:h.map(x=>({dims:x.dims,dataType:ft(x.dataType)})),outputsMetadata:p.map(x=>({dims:x.dims,dataType:ft(x.dataType)})),kernelId:a,kernelType:o,kernelName:l,programName:d,startTime:m,endTime:w});else{let x="";h.forEach((b,S)=>{x+=`input[${S}]: [${b.dims}] | ${ft(b.dataType)}, `});let $="";p.forEach((b,S)=>{$+=`output[${S}]: [${b.dims}] | ${ft(b.dataType)}, `}),console.log(`[profiling] kernel "${a}|${o}|${l}|${d}" ${x}${$}start time: ${m} ns, execution time: ${w-m} ns`)}ei("GPU",`${d}::${f}::${_}`)}e.unmap(),this.pendingQueries.delete(e)}),it()}run(e,t,r,i,n,a){ut(e.name);let s=[];for(let b=0;b<t.length;++b){let S=t[b].data;if(S===0)continue;let I=this.gpuDataManager.get(S);if(!I)throw new Error(`no GPU data for input: ${S}`);s.push(I)}let{outputs:o,dispatchGroup:l,programUniforms:d}=e.getRunData(t),h=r.length===0?o.map((b,S)=>S):r;if(h.length!==o.length)throw new Error(`Output size ${h.length} must be equal to ${o.length}.`);let p=[],f=[];for(let b=0;b<o.length;++b){if(!Number.isInteger(h[b])||h[b]<-3||h[b]>=a)throw new Error(`Invalid output index: ${h[b]}`);if(h[b]===-3)continue;let S=h[b]===-1,I=h[b]===-2,T=S||I?n(o[b].dataType,o[b].dims):i(h[b],o[b].dataType,o[b].dims);if(p.push(T),T.data===0)continue;let E=this.gpuDataManager.get(T.data);if(!E)throw new Error(`no GPU data for output: ${T.data}`);if(S&&this.temporaryData.push(E),I){let z=this.kernelPersistentData.get(this.currentKernelId);z||(z=[],this.kernelPersistentData.set(this.currentKernelId,z)),z.push(E)}f.push(E)}if(s.length!==t.length||f.length!==p.length){if(f.length===0)return it(e.name),p;throw new Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let _;if(d){let b=0,S=[];d.forEach(z=>{let v=typeof z.data=="number"?[z.data]:z.data;if(v.length===0)return;let B=z.type===10?2:4,P,O;z.type===10?(O=v.length>4?16:v.length>2?8:v.length*B,P=v.length>4?16:B*v.length):(O=v.length<=2?v.length*B:16,P=16),b=Math.ceil(b/O)*O,S.push(b);let V=z.type===10?8:4;b+=v.length>4?Math.ceil(v.length/V)*P:v.length*B});let I=16;b=Math.ceil(b/I)*I;let T=new ArrayBuffer(b);d.forEach((z,v)=>{let B=S[v],P=typeof z.data=="number"?[z.data]:z.data;if(z.type===6)new Int32Array(T,B,P.length).set(P);else if(z.type===12)new Uint32Array(T,B,P.length).set(P);else if(z.type===10)new Uint16Array(T,B,P.length).set(P);else if(z.type===1)new Float32Array(T,B,P.length).set(P);else throw new Error(`Unsupported uniform type: ${ft(z.type)}`)});let E=this.gpuDataManager.create(b,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(E.buffer,0,T,0,b),this.gpuDataManager.release(E.id),_={offset:0,size:b,buffer:E.buffer}}let m=this.programManager.normalizeDispatchGroupSize(l),w=m[1]===1&&m[2]===1,x=ec(e,t,w),$=this.programManager.getArtifact(x);if($||($=this.programManager.build(e,m),this.programManager.setArtifact(x,$),ve("info",()=>`[artifact] key: ${x}, programName: ${e.name}`)),d&&$.uniformVariablesInfo){if(d.length!==$.uniformVariablesInfo.length)throw new Error(`Uniform variables count mismatch: expect ${$.uniformVariablesInfo.length}, got ${d.length} in program "${$.programInfo.name}".`);for(let b=0;b<d.length;b++){let S=d[b],I=S.type,T=typeof S.data=="number"?1:S.data.length,[E,z]=$.uniformVariablesInfo[b];if(I!==E||T!==z)throw new Error(`Uniform variable ${b} mismatch: expect type ${E} with size ${z}, got type ${I} with size ${T} in program "${$.programInfo.name}".`)}}if(ve("info",()=>`[ProgramManager] run "${e.name}" (key=${x}) with ${m[0]}x${m[1]}x${m[2]}`),this.queryType!=="none"||this.sessionStatus==="capturing"){let b={kernelId:this.currentKernelId,programName:$.programInfo.name,inputTensorViews:t,outputTensorViews:p};this.pendingKernels.push(b),this.sessionStatus==="capturing"&&this.capturedPendingKernels.get(this.currentSessionId).push(b)}return this.programManager.run($,s,f,m,_),it(e.name),p}upload(e,t){this.gpuDataManager.upload(e,t)}memcpy(e,t){this.gpuDataManager.memcpy(e,t)}async download(e,t){await this.gpuDataManager.download(e,t)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,t,r,i){let n=Rf.get(e);if(!n)throw new Error(`kernel not implemented: ${e}`);let a={kernelType:e,kernelName:i,kernelEntry:n[0],attributes:[n[1],r]};this.kernels.set(t,a)}releaseKernel(e){let t=this.kernelPersistentData.get(e);if(t){for(let r of t)this.gpuDataManager.release(r.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,t,r){let i=this.kernels.get(e);if(!i)throw new Error(`kernel not created: ${e}`);let n=i.kernelType,a=i.kernelName,s=i.kernelEntry,o=i.attributes;if(this.currentKernelId!==null)throw new Error(`kernel "[${n}] ${a}" is not allowed to be called recursively`);this.currentKernelId=e,o[0]&&(o[1]=o[0](o[1]),o[0]=void 0),ve("info",()=>`[WebGPU] Start to run kernel "[${n}] ${a}"...`);let l=this.env.debug;this.temporaryData=[];try{return l&&this.device.pushErrorScope("validation"),s(t,o[1]),0}catch(d){return r.push(Promise.resolve(`[WebGPU] Kernel "[${n}] ${a}" failed. ${d}`)),1}finally{l&&r.push(this.device.popErrorScope().then(d=>d?`GPU validation error for kernel "[${n}] ${a}": ${d.message}`:null));for(let d of this.temporaryData)this.gpuDataManager.release(d.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,t,r,i){let n=this.sessionExternalDataMapping.get(e);n||(n=new Map,this.sessionExternalDataMapping.set(e,n));let a=n.get(t),s=this.gpuDataManager.registerExternalBuffer(r,i,a);return n.set(t,[s,r]),s}unregisterBuffers(e){let t=this.sessionExternalDataMapping.get(e);t&&(t.forEach(r=>this.gpuDataManager.unregisterExternalBuffer(r[0])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let t=this.gpuDataManager.get(e);if(!t)throw new Error(`no GPU data for buffer: ${e}`);return t.buffer}createDownloader(e,t,r){return async()=>{let i=await Ln(this,e,t);return ca(i.buffer,r)}}writeTimestamp(e){this.queryType==="inside-passes"&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){this.queryType="none",(this.env.webgpu.profiling?.mode==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),this.queryType!=="none"&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){ve("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){ve("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){ve("info","replay"),this.sessionStatus="replaying";let e=this.capturedCommandList.get(this.currentSessionId),t=this.capturedPendingKernels.get(this.currentSessionId),r=e.length;this.pendingKernels=[];for(let i=0;i<r;i++){let n=this.getComputePassEncoder(),a=e[i];this.writeTimestamp(this.pendingDispatchNumber*2),n.setPipeline(a.computePipeline),n.setBindGroup(0,a.bindGroup),n.dispatchWorkgroups(...a.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!=="none"&&this.pendingKernels.push(t[i]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType==="at-passes")&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}}),Pf={};tr(Pf,{init:()=>qf});var jr,rc,qf,Iy=K(()=>{"use strict";ce(),mt(),fe(),B0(),jr=class Lf{constructor(t,r,i,n){this.module=t,this.dataType=r,this.data=i,this.dims=n}getFloat32Array(){if(this.dataType!==1)throw new Error("Invalid data type");let t=D.size(this.dims);return t===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,t)}getBigInt64Array(){if(this.dataType!==7)throw new Error("Invalid data type");let t=D.size(this.dims);return t===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,t)}getInt32Array(){if(this.dataType!==6)throw new Error("Invalid data type");let t=D.size(this.dims);return t===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,t)}getUint16Array(){if(this.dataType!==10&&this.dataType!==4)throw new Error("Invalid data type");let t=D.size(this.dims);return t===0?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,t)}reshape(t){if(D.size(t)!==D.size(this.dims))throw new Error("Invalid new shape");return new Lf(this.module,this.dataType,this.data,t)}},rc=class{constructor(e,t,r){this.module=e,this.backend=t,this.customDataOffset=0,this.customDataSize=0,this.adapterInfo=t.adapterInfo;let i=e.PTR_SIZE,n=r/e.PTR_SIZE,a=i===4?"i32":"i64";this.opKernelContext=Number(e.getValue(i*n++,a));let s=Number(e.getValue(i*n++,a));this.outputCount=Number(e.getValue(i*n++,a)),this.customDataOffset=Number(e.getValue(i*n++,"*")),this.customDataSize=Number(e.getValue(i*n++,a));let o=[];for(let l=0;l<s;l++){let d=Number(e.getValue(i*n++,a)),h=Number(e.getValue(i*n++,"*")),p=Number(e.getValue(i*n++,a)),f=[];for(let _=0;_<p;_++)f.push(Number(e.getValue(i*n++,a)));o.push(new jr(e,d,h,f))}this.inputs=o}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(e,t){let r=t?.inputs?.map(s=>typeof s=="number"?this.inputs[s]:s)??this.inputs,i=t?.outputs??[],n=(s,o,l)=>new jr(this.module,o,this.output(s,l),l),a=(s,o)=>{let l=Nt(s,o);if(!l)throw new Error(`Unsupported data type: ${s}`);let d=l>0?this.backend.gpuDataManager.create(l).id:0;return new jr(this.module,s,d,o)};return this.backend.run(e,r,i,n,a,this.outputCount)}output(e,t){let r=this.module.stackSave();try{let i=this.module.PTR_SIZE,n=i===4?"i32":"i64",a=this.module.stackAlloc((1+t.length)*i);this.module.setValue(a,t.length,n);for(let s=0;s<t.length;s++)this.module.setValue(a+i*(s+1),t[s],n);return this.module._JsepOutput(this.opKernelContext,e,a)}catch(i){throw new Error(`Failed to generate kernel's output[${e}] with dims [${t}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${i}`)}finally{this.module.stackRestore(r)}}},qf=async(e,t,r,i)=>{let n=t.jsepInit;if(!n)throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if(e==="webgpu"){let a=(Ty(),vr(Nf)).WebGpuBackend,s=new a;await s.initialize(r,i),n("webgpu",[s,o=>s.alloc(Number(o)),o=>s.free(o),(o,l,d,h=!1)=>{if(h)ve("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(o)}, dst=${Number(l)}, size=${Number(d)}`),s.memcpy(Number(o),Number(l));else{ve("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(o)}, gpuDataId=${Number(l)}, size=${Number(d)}`);let p=t.HEAPU8.subarray(Number(o>>>0),Number(o>>>0)+Number(d));s.upload(Number(l),p)}},async(o,l,d)=>{ve("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${o}, dataOffset=${l}, size=${d}`),await s.download(Number(o),()=>t.HEAPU8.subarray(Number(l)>>>0,Number(l+d)>>>0))},(o,l,d)=>s.createKernel(o,Number(l),d,t.UTF8ToString(t._JsepGetNodeName(Number(l)))),o=>s.releaseKernel(o),(o,l,d,h)=>{ve("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${d}, kernel=${o}, contextDataOffset=${l}`);let p=new rc(t,s,Number(l));return s.computeKernel(Number(o),p,h)},()=>s.captureBegin(),()=>s.captureEnd(),()=>s.replay()])}else{let a=new jc(r);n("webnn",[a,()=>a.reserveTensorId(),s=>a.releaseTensorId(s),async(s,o,l,d,h)=>a.ensureTensor(s,o,l,d,h),(s,o)=>{a.uploadTensor(s,o)},async(s,o)=>a.downloadTensor(s,o),(s,o)=>a.registerMLContext(s,o),!!r.trace])}}}),ic,va,xa,vt,nc,zn,oi,ka,Sa,An,Ta,Ia,Ea,Wf=K(()=>{"use strict";Xe(),A0(),O0(),ce(),Vt(),sa(),Lc(),ic=(e,t)=>{ze()._OrtInit(e,t)!==0&&Te("Can't initialize onnxruntime.")},va=async e=>{ic(e.wasm.numThreads,ri(e.logLevel))},xa=async(e,t)=>{ze().asyncInit?.();let r=e.webgpu.adapter;if(t==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");if(r){if(typeof r.limits!="object"||typeof r.features!="object"||typeof r.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let i=e.webgpu.powerPreference;if(i!==void 0&&i!=="low-power"&&i!=="high-performance")throw new Error(`Invalid powerPreference setting: "${i}"`);let n=e.webgpu.forceFallbackAdapter;if(n!==void 0&&typeof n!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${n}"`);if(r=await navigator.gpu.requestAdapter({powerPreference:i,forceFallbackAdapter:n}),!r)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}}if(t==="webnn"&&(typeof navigator>"u"||!navigator.ml))throw new Error("WebNN is not supported in current environment");{let i=(Iy(),vr(Pf)).init;t==="webgpu"&&await i("webgpu",ze(),e,r),t==="webnn"&&await i("webnn",ze(),e)}},vt=new Map,nc=e=>{let t=ze(),r=t.stackSave();try{let i=t.PTR_SIZE,n=t.stackAlloc(2*i);t._OrtGetInputOutputCount(e,n,n+i)!==0&&Te("Can't get session input/output count.");let a=i===4?"i32":"i64";return[Number(t.getValue(n,a)),Number(t.getValue(n+i,a))]}finally{t.stackRestore(r)}},zn=(e,t)=>{let r=ze(),i=r.stackSave(),n=0;try{let a=r.PTR_SIZE,s=r.stackAlloc(2*a);r._OrtGetInputOutputMetadata(e,t,s,s+a)!==0&&Te("Can't get session input/output metadata.");let o=Number(r.getValue(s,"*"));n=Number(r.getValue(s+a,"*"));let l=r.HEAP32[n/4];if(l===0)return[o,0];let d=r.HEAPU32[n/4+1],h=[];for(let p=0;p<d;p++){let f=Number(r.getValue(n+8+p*a,"*"));h.push(f!==0?r.UTF8ToString(f):Number(r.getValue(n+8+(p+d)*a,"*")))}return[o,l,h]}finally{r.stackRestore(i),n!==0&&r._OrtFree(n)}},oi=e=>{let t=ze(),r=t._malloc(e.byteLength);if(r===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,r),[r,e.byteLength]},ka=async(e,t)=>{let r,i,n=ze();Array.isArray(e)?[r,i]=e:e.buffer===n.HEAPU8.buffer?[r,i]=[e.byteOffset,e.byteLength]:[r,i]=oi(e);let a=0,s=0,o=0,l=[],d=[],h=[];try{if([s,l]=await qc(t),t?.externalData&&n.mountExternalData){let I=[];for(let T of t.externalData){let E=typeof T=="string"?T:T.path,z=typeof T=="string"?T:T.data;I.push(la(z).then(v=>{n.mountExternalData(E,v)}))}await Promise.all(I)}for(let I of t?.executionProviders??[])if((typeof I=="string"?I:I.name)==="webnn"){if(n.shouldTransferToMLTensor=!1,typeof I!="string"){let T=I,E=T?.context,z=T?.gpuDevice,v=T?.deviceType,B=T?.powerPreference;E?n.currentContext=E:z?n.currentContext=await n.webnnCreateMLContext(z):n.currentContext=await n.webnnCreateMLContext({deviceType:v,powerPreference:B})}else n.currentContext=await n.webnnCreateMLContext();break}a=await n._OrtCreateSession(r,i,s),n.webgpuOnCreateSession?.(a),a===0&&Te("Can't create a session."),n.jsepOnCreateSession?.(),n.currentContext&&(n.webnnRegisterMLContext(a,n.currentContext),n.currentContext=void 0,n.shouldTransferToMLTensor=!0);let[p,f]=nc(a),_=!!t?.enableGraphCapture,m=[],w=[],x=[],$=[],b=[];for(let I=0;I<p;I++){let[T,E,z]=zn(a,I);T===0&&Te("Can't get an input name."),d.push(T);let v=n.UTF8ToString(T);m.push(v),x.push(E===0?{name:v,isTensor:!1}:{name:v,isTensor:!0,type:ft(E),shape:z})}for(let I=0;I<f;I++){let[T,E,z]=zn(a,I+p);T===0&&Te("Can't get an output name."),h.push(T);let v=n.UTF8ToString(T);w.push(v),$.push(E===0?{name:v,isTensor:!1}:{name:v,isTensor:!0,type:ft(E),shape:z});{if(_&&t?.preferredOutputLocation===void 0){b.push("gpu-buffer");continue}let B=typeof t?.preferredOutputLocation=="string"?t.preferredOutputLocation:t?.preferredOutputLocation?.[v]??"cpu",P=n.webnnIsGraphOutput;if(B==="cpu"&&P&&P(a,v)){b.push("ml-tensor-cpu-output");continue}if(B!=="cpu"&&B!=="cpu-pinned"&&B!=="gpu-buffer"&&B!=="ml-tensor")throw new Error(`Not supported preferred output location: ${B}.`);if(_&&B!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${B}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);b.push(B)}}let S=null;return b.some(I=>I==="gpu-buffer"||I==="ml-tensor"||I==="ml-tensor-cpu-output")&&(o=n._OrtCreateBinding(a),o===0&&Te("Can't create IO binding."),S={handle:o,outputPreferredLocations:b,outputPreferredLocationsEncoded:b.map(I=>I==="ml-tensor-cpu-output"?"ml-tensor":I).map(I=>qn(I))}),vt.set(a,[a,d,h,S,_,!1]),[a,m,w,x,$]}catch(p){throw d.forEach(f=>n._OrtFree(f)),h.forEach(f=>n._OrtFree(f)),o!==0&&n._OrtReleaseBinding(o)!==0&&Te("Can't release IO binding."),a!==0&&n._OrtReleaseSession(a)!==0&&Te("Can't release session."),p}finally{n._free(r),s!==0&&n._OrtReleaseSessionOptions(s)!==0&&Te("Can't release session options."),l.forEach(p=>n._free(p)),n.unmountExternalData?.()}},Sa=e=>{let t=ze(),r=vt.get(e);if(!r)throw new Error(`cannot release session. invalid session id: ${e}`);let[i,n,a,s,o]=r;s&&(o&&t._OrtClearBoundOutputs(s.handle)!==0&&Te("Can't clear bound outputs."),t._OrtReleaseBinding(s.handle)!==0&&Te("Can't release IO binding.")),t.jsepOnReleaseSession?.(e),t.webnnOnReleaseSession?.(e),t.webgpuOnReleaseSession?.(e),n.forEach(l=>t._OrtFree(l)),a.forEach(l=>t._OrtFree(l)),t._OrtReleaseSession(i)!==0&&Te("Can't release session."),vt.delete(e)},An=async(e,t,r,i,n,a,s=!1)=>{if(!e){t.push(0);return}let o=ze(),l=o.PTR_SIZE,d=e[0],h=e[1],p=e[3],f=p,_,m;if(d==="string"&&(p==="gpu-buffer"||p==="ml-tensor"))throw new Error("String tensor is not supported on GPU.");if(s&&p!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${a} when enableGraphCapture is true.`);if(p==="gpu-buffer"){let $=e[2].gpuBuffer;m=Nt(Dt(d),h);{let b=o.jsepRegisterBuffer;if(!b)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');_=b(i,a,$,m)}}else if(p==="ml-tensor"){let $=e[2].mlTensor;m=Nt(Dt(d),h);let b=o.webnnRegisterMLTensor;if(!b)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');_=b(i,$,Dt(d),h)}else{let $=e[2];if(Array.isArray($)){m=l*$.length,_=o._malloc(m),r.push(_);for(let b=0;b<$.length;b++){if(typeof $[b]!="string")throw new TypeError(`tensor data at index ${b} is not a string`);o.setValue(_+b*l,rt($[b],r),"*")}}else{let b=o.webnnIsGraphInput,S=o.webnnIsGraphOutput;if(d!=="string"&&b&&S){let I=o.UTF8ToString(n);if(b(i,I)||S(i,I)){let T=Dt(d);m=Nt(T,h),f="ml-tensor";let E=o.webnnCreateTemporaryTensor,z=o.webnnUploadTensor;if(!E||!z)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let v=await E(i,T,h);z(v,new Uint8Array($.buffer,$.byteOffset,$.byteLength)),_=v}else m=$.byteLength,_=o._malloc(m),r.push(_),o.HEAPU8.set(new Uint8Array($.buffer,$.byteOffset,m),_)}else m=$.byteLength,_=o._malloc(m),r.push(_),o.HEAPU8.set(new Uint8Array($.buffer,$.byteOffset,m),_)}}let w=o.stackSave(),x=o.stackAlloc(4*h.length);try{h.forEach((b,S)=>o.setValue(x+S*l,b,l===4?"i32":"i64"));let $=o._OrtCreateTensor(Dt(d),_,m,x,h.length,qn(f));$===0&&Te(`Can't create tensor for input/output. session=${i}, index=${a}.`),t.push($)}finally{o.stackRestore(w)}},Ta=async(e,t,r,i,n,a)=>{let s=ze(),o=s.PTR_SIZE,l=vt.get(e);if(!l)throw new Error(`cannot run inference. invalid session id: ${e}`);let d=l[0],h=l[1],p=l[2],f=l[3],_=l[4],m=l[5],w=t.length,x=i.length,$=0,b=[],S=[],I=[],T=[],E=[],z=s.stackSave(),v=s.stackAlloc(w*o),B=s.stackAlloc(w*o),P=s.stackAlloc(x*o),O=s.stackAlloc(x*o);try{[$,b]=Pc(a),Ut("wasm prepareInputOutputTensor");for(let N=0;N<w;N++)await An(r[N],S,T,e,h[t[N]],t[N],_);for(let N=0;N<x;N++)await An(n[N],I,T,e,p[i[N]],w+i[N],_);Pt("wasm prepareInputOutputTensor");for(let N=0;N<w;N++)s.setValue(v+N*o,S[N],"*"),s.setValue(B+N*o,h[t[N]],"*");for(let N=0;N<x;N++)s.setValue(P+N*o,I[N],"*"),s.setValue(O+N*o,p[i[N]],"*");if(f&&!m){let{handle:N,outputPreferredLocations:X,outputPreferredLocationsEncoded:J}=f;if(h.length!==w)throw new Error(`input count from feeds (${w}) is expected to be always equal to model's input count (${h.length}).`);Ut("wasm bindInputsOutputs");for(let Q=0;Q<w;Q++){let ne=t[Q];await s._OrtBindInput(N,h[ne],S[Q])!==0&&Te(`Can't bind input[${Q}] for session=${e}.`)}for(let Q=0;Q<x;Q++){let ne=i[Q];n[Q]?.[3]?(E.push(I[Q]),s._OrtBindOutput(N,p[ne],I[Q],0)!==0&&Te(`Can't bind pre-allocated output[${Q}] for session=${e}.`)):s._OrtBindOutput(N,p[ne],0,J[ne])!==0&&Te(`Can't bind output[${Q}] to ${X[Q]} for session=${e}.`)}Pt("wasm bindInputsOutputs"),vt.set(e,[d,h,p,f,_,!0])}s.jsepOnRunStart?.(d),s.webnnOnRunStart?.(d);let V;f?V=await s._OrtRunWithBinding(d,f.handle,x,P,$):V=await s._OrtRun(d,B,v,w,O,x,P,$),V!==0&&Te("failed to call OrtRun().");let F=[],A=[];Ut("wasm ProcessOutputTensor");for(let N=0;N<x;N++){let X=Number(s.getValue(P+N*o,"*"));if(X===I[N]||E.includes(I[N])){F.push(n[N]),X!==I[N]&&s._OrtReleaseTensor(X)!==0&&Te("Can't release tensor.");continue}let J=s.stackSave(),Q=s.stackAlloc(4*o),ne=!1,ee,R=0;try{s._OrtGetTensorData(X,Q,Q+o,Q+2*o,Q+3*o)!==0&&Te(`Can't access output tensor data on index ${N}.`);let te=o===4?"i32":"i64",Z=Number(s.getValue(Q,te));R=s.getValue(Q+o,"*");let H=s.getValue(Q+o*2,"*"),Ie=Number(s.getValue(Q+o*3,te)),L=[];for(let U=0;U<Ie;U++)L.push(Number(s.getValue(H+U*o,te)));s._OrtFree(H)!==0&&Te("Can't free memory for tensor dims.");let de=L.reduce((U,G)=>U*G,1);ee=ft(Z);let he=f?.outputPreferredLocations[i[N]];if(ee==="string"){if(he==="gpu-buffer"||he==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let U=[];for(let G=0;G<de;G++){let j=s.getValue(R+G*o,"*"),Y=s.getValue(R+(G+1)*o,"*"),ue=G===de-1?void 0:Y-j;U.push(s.UTF8ToString(j,ue))}F.push([ee,L,U,"cpu"])}else if(he==="gpu-buffer"&&de>0){let U=s.jsepGetBuffer;if(!U)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let G=U(R),j=Nt(Z,de);if(j===void 0||!oa(ee))throw new Error(`Unsupported data type: ${ee}`);ne=!0,F.push([ee,L,{gpuBuffer:G,download:s.jsepCreateDownloader(G,j,ee),dispose:()=>{s._OrtReleaseTensor(X)!==0&&Te("Can't release tensor.")}},"gpu-buffer"])}else if(he==="ml-tensor"&&de>0){let U=s.webnnEnsureTensor,G=s.webnnIsGraphInputOutputTypeSupported;if(!U||!G)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(Nt(Z,de)===void 0||!ua(ee))throw new Error(`Unsupported data type: ${ee}`);if(!G(e,ee,!1))throw new Error(`preferredLocation "ml-tensor" for ${ee} output is not supported by current WebNN Context.`);let j=await U(e,R,Z,L,!1);ne=!0,F.push([ee,L,{mlTensor:j,download:s.webnnCreateMLTensorDownloader(R,ee),dispose:()=>{s.webnnReleaseTensorId(R),s._OrtReleaseTensor(X)}},"ml-tensor"])}else if(he==="ml-tensor-cpu-output"&&de>0){let U=s.webnnCreateMLTensorDownloader(R,ee)(),G=F.length;ne=!0,A.push((async()=>{let j=[G,await U];return s.webnnReleaseTensorId(R),s._OrtReleaseTensor(X),j})()),F.push([ee,L,[],"cpu"])}else{let U=li(ee),G=new U(de);new Uint8Array(G.buffer,G.byteOffset,G.byteLength).set(s.HEAPU8.subarray(R,R+G.byteLength)),F.push([ee,L,G,"cpu"])}}finally{s.stackRestore(J),ee==="string"&&R&&s._free(R),ne||s._OrtReleaseTensor(X)}}f&&!_&&(s._OrtClearBoundOutputs(f.handle)!==0&&Te("Can't clear bound outputs."),vt.set(e,[d,h,p,f,_,!1]));for(let[N,X]of await Promise.all(A))F[N][2]=X;return Pt("wasm ProcessOutputTensor"),F}finally{s.webnnOnRunEnd?.(d),s.stackRestore(z),S.forEach(V=>s._OrtReleaseTensor(V)),I.forEach(V=>s._OrtReleaseTensor(V)),T.forEach(V=>s._free(V)),$!==0&&s._OrtReleaseRunOptions($),b.forEach(V=>s._free(V))}},Ia=e=>{let t=ze(),r=vt.get(e);if(!r)throw new Error("invalid session id");let i=r[0],n=t._OrtEndProfiling(i);n===0&&Te("Can't get an profile file name."),t._OrtFree(n)},Ea=e=>{let t=[];for(let r of e){let i=r[2];!Array.isArray(i)&&"buffer"in i&&t.push(i.buffer)}return t}}),xt,Ke,Kt,fr,mr,Kr,On,Xr,Mt,Bt,ac,Vf,Gf,Hf,Ff,jf,Kf,Xf,Yf=K(()=>{"use strict";Xe(),Wf(),Vt(),na(),xt=()=>!!Ee.wasm.proxy&&typeof document<"u",Kt=!1,fr=!1,mr=!1,Xr=new Map,Mt=(e,t)=>{let r=Xr.get(e);r?r.push(t):Xr.set(e,[t])},Bt=()=>{if(Kt||!fr||mr||!Ke)throw new Error("worker not ready")},ac=e=>{switch(e.data.type){case"init-wasm":Kt=!1,e.data.err?(mr=!0,On[1](e.data.err)):(fr=!0,On[0]()),Kr&&(URL.revokeObjectURL(Kr),Kr=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=Xr.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}default:}},Vf=async()=>{if(!fr){if(Kt)throw new Error("multiple calls to 'initWasm()' detected.");if(mr)throw new Error("previous call to 'initWasm()' failed.");if(Kt=!0,xt())return new Promise((e,t)=>{Ke?.terminate(),Nc().then(([r,i])=>{try{Ke=i,Ke.onerror=a=>t(a),Ke.onmessage=ac,On=[e,t];let n={type:"init-wasm",in:Ee};!n.in.wasm.wasmPaths&&(r||Pn)&&(n.in.wasm.wasmPaths={wasm:new URL("/assets/ort-wasm-simd-threaded.jsep.wasm",import.meta.url).href}),Ke.postMessage(n),Kr=r}catch(n){t(n)}},t)});try{await aa(Ee.wasm),await va(Ee),fr=!0}catch(e){throw mr=!0,e}finally{Kt=!1}}},Gf=async e=>{if(xt())return Bt(),new Promise((t,r)=>{Mt("init-ep",[t,r]);let i={type:"init-ep",in:{epName:e,env:Ee}};Ke.postMessage(i)});await xa(Ee,e)},Hf=async e=>xt()?(Bt(),new Promise((t,r)=>{Mt("copy-from",[t,r]);let i={type:"copy-from",in:{buffer:e}};Ke.postMessage(i,[e.buffer])})):oi(e),Ff=async(e,t)=>{if(xt()){if(t?.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return Bt(),new Promise((r,i)=>{Mt("create",[r,i]);let n={type:"create",in:{model:e,options:{...t}}},a=[];e instanceof Uint8Array&&a.push(e.buffer),Ke.postMessage(n,a)})}else return ka(e,t)},jf=async e=>{if(xt())return Bt(),new Promise((t,r)=>{Mt("release",[t,r]);let i={type:"release",in:e};Ke.postMessage(i)});Sa(e)},Kf=async(e,t,r,i,n,a)=>{if(xt()){if(r.some(s=>s[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(n.some(s=>s))throw new Error("pre-allocated output tensor is not supported for proxy.");return Bt(),new Promise((s,o)=>{Mt("run",[s,o]);let l=r,d={type:"run",in:{sessionId:e,inputIndices:t,inputs:l,outputIndices:i,options:a}};Ke.postMessage(d,Ea(l))})}else return Ta(e,t,r,i,n,a)},Xf=async e=>{if(xt())return Bt(),new Promise((t,r)=>{Mt("end-profiling",[t,r]);let i={type:"end-profiling",in:e};Ke.postMessage(i)});Ia(e)}}),Mn,sc,Zf,Ey=K(()=>{"use strict";Xe(),Yf(),ce(),ia(),Lc(),Mn=(e,t)=>{switch(e.location){case"cpu":return[e.type,e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[e.type,e.dims,{mlTensor:e.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${e.location} for ${t()}`)}},sc=e=>{switch(e[3]){case"cpu":return new Le(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!oa(t))throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:r,download:i,dispose:n}=e[2];return Le.fromGpuBuffer(r,{dataType:t,dims:e[1],download:i,dispose:n})}case"ml-tensor":{let t=e[0];if(!ua(t))throw new Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:r,download:i,dispose:n}=e[2];return Le.fromMLTensor(r,{dataType:t,dims:e[1],download:i,dispose:n})}default:throw new Error(`invalid data location: ${e[3]}`)}},Zf=class{async fetchModelAndCopyToWasmMemory(e){return Hf(await la(e))}async loadModel(e,t){ut();let r;typeof e=="string"?r=await this.fetchModelAndCopyToWasmMemory(e):r=e,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await Ff(r,t),it()}async dispose(){return jf(this.sessionId)}async run(e,t,r){ut();let i=[],n=[];Object.entries(e).forEach(p=>{let f=p[0],_=p[1],m=this.inputNames.indexOf(f);if(m===-1)throw new Error(`invalid input '${f}'`);i.push(_),n.push(m)});let a=[],s=[];Object.entries(t).forEach(p=>{let f=p[0],_=p[1],m=this.outputNames.indexOf(f);if(m===-1)throw new Error(`invalid output '${f}'`);a.push(_),s.push(m)});let o=i.map((p,f)=>Mn(p,()=>`input "${this.inputNames[n[f]]}"`)),l=a.map((p,f)=>p?Mn(p,()=>`output "${this.outputNames[s[f]]}"`):null),d=await Kf(this.sessionId,n,o,s,l,r),h={};for(let p=0;p<d.length;p++)h[this.outputNames[s[p]]]=a[p]??sc(d[p]);return it(),h}startProfiling(){}endProfiling(){Xf(this.sessionId)}}}),Qf={};tr(Qf,{OnnxruntimeWebAssemblyBackend:()=>Jn,initializeFlags:()=>Qn,wasmBackend:()=>Jf});var Qn,Jn,Jf,Cy=K(()=>{"use strict";Xe(),Yf(),Ey(),Qn=()=>{(typeof Ee.wasm.initTimeout!="number"||Ee.wasm.initTimeout<0)&&(Ee.wasm.initTimeout=0);let e=Ee.wasm.simd;if(typeof e!="boolean"&&e!==void 0&&e!=="fixed"&&e!=="relaxed"&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` and ignore SIMD feature checking.`),Ee.wasm.simd=!1),typeof Ee.wasm.proxy!="boolean"&&(Ee.wasm.proxy=!1),typeof Ee.wasm.trace!="boolean"&&(Ee.wasm.trace=!1),typeof Ee.wasm.numThreads!="number"||!Number.isInteger(Ee.wasm.numThreads)||Ee.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)Ee.wasm.numThreads=1;else{let t=typeof navigator>"u"?h0("node:os").cpus().length:navigator.hardwareConcurrency;Ee.wasm.numThreads=Math.min(4,Math.ceil((t||1)/2))}},Jn=class{async init(e){Qn(),await Vf(),await Gf(e)}async createInferenceSessionHandler(e,t){let r=new Zf;return await r.loadModel(e,t),r}},Jf=new Jn});Xe();Xe();Xe();var zy="1.30.0";{let e=(Cy(),vr(Qf)).wasmBackend;Xt("webgpu",e,5),Xt("webnn",e,5),Xt("cpu",e,10),Xt("wasm",e,10)}Object.defineProperty(Ee.versions,"web",{value:zy,enumerable:!0});/**
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
 */class Qt{static calculateDetResize(t,r){let i=1;t>1120?i=1120/t:t<800&&(i=Math.min(1.5,960/t)),r*i>3840&&(i=3840/r);let n=Math.round(t*i),a=Math.round(r*i);return n=Math.max(32,Math.round(n/32)*32),a=Math.max(32,Math.round(a/32)*32),{targetW:n,targetH:a,ratioW:n/t,ratioH:a/r}}static imageToDetTensor(t,r,i){const n=[.485,.456,.406],a=[.229,.224,.225],s=new Float32Array(3*i*r),o=t.data,l=i*r;for(let d=0;d<i;d++)for(let h=0;h<r;h++){const p=(d*r+h)*4,f=d*r+h,_=(o[p]/255-n[0])/a[0],m=(o[p+1]/255-n[1])/a[1],w=(o[p+2]/255-n[2])/a[2];s[f]=_,s[f+l]=m,s[f+l*2]=w}return new Le("float32",s,[1,3,i,r])}static imageToRecTensor(t,r,i){const n=new Float32Array(3*i*r),a=t.data,s=i*r;for(let o=0;o<i;o++)for(let l=0;l<r;l++){const d=(o*r+l)*4,h=o*r+l,p=(a[d]/255-.5)/.5,f=(a[d+1]/255-.5)/.5,_=(a[d+2]/255-.5)/.5;n[h]=p,n[h+s]=f,n[h+s*2]=_}return new Le("float32",n,[1,3,i,r])}static imageToRecTensorBatch(t,r,i){const n=i*r,a=new Float32Array(t.length*3*n);for(let s=0;s<t.length;s++){const o=t[s],l=Math.min(o.width,r),d=s*3*n;for(let h=0;h<i;h++)for(let p=0;p<l;p++){const f=(h*o.width+p)*4,_=d+h*r+p;a[_]=(o.data[f]/255-.5)/.5,a[_+n]=(o.data[f+1]/255-.5)/.5,a[_+n*2]=(o.data[f+2]/255-.5)/.5}}return new Le("float32",a,[t.length,3,i,r])}static clampBox(t,r,i){const n=Math.max(0,Math.min(t.x,r-1)),a=Math.max(0,Math.min(t.y,i-1)),s=Math.max(1,Math.min(t.width,r-n)),o=Math.max(1,Math.min(t.height,i-a));return{x:n,y:a,width:s,height:o,confidence:t.confidence}}}class ea{static segmentLines(t,r,i,n){try{const s=t.getImageData(r.x,r.y,r.width,r.height).data,o=r.width,l=r.height,d=new Int32Array(256),h=O=>(s[O*4]*299+s[O*4+1]*587+s[O*4+2]*114)/1e3,p=o*l;for(let O=0;O<p;O++)d[Math.round(h(O))]++;let f=0;for(let O=0;O<256;O++)f+=O*d[O];let _=0,m=0,w=-1,x=128;for(let O=0;O<256;O++){if(m+=d[O],m===0)continue;const V=p-m;if(V===0)break;_+=O*d[O];const F=_/m,A=(f-_)/V,N=m*V*(F-A)*(F-A);N>w&&(w=N,x=O)}let $=0;for(let O=0;O<=x;O++)$+=d[O];const b=$<=p/2,S=O=>b?O<=x:O>x,I=Math.round(o*.08),T=new Int32Array(l);for(let O=0;O<l;O++){let V=0;const F=O*o;for(let A=I;A<o-I;A++)S(h(F+A))&&V++;T[O]=V}const E=Math.max(4,Math.round(o*.03)),z=[];let v=!1,B=0;for(let O=0;O<l;O++){const V=T[O]>=E;if(V&&!v)v=!0,B=O;else if(!V&&v){v=!1;const F=O-B;F>=11&&z.push({startY:B,height:F})}}if(v){const O=l-B;O>=11&&z.push({startY:B,height:O})}if(z.length<=1)return[r];const P=[];if(!b){const V=Math.ceil(o/8),F=Math.ceil(l/8),A=new Int32Array(V*F),N=new Int32Array(V*F);for(let ee=0;ee<l;ee++){const R=ee/8|0,te=ee*o;for(let Z=0;Z<o;Z++){const H=R*V+(Z/8|0);N[H]++,S(h(te+Z))&&A[H]++}}const X=new Uint8Array(V*F);for(let ee=0;ee<V*F;ee++)N[ee]>0&&A[ee]/N[ee]>=.85&&(X[ee]=1);const J=new Int16Array(V*F).fill(-1);let Q=0;const ne=[];for(let ee=0;ee<V*F;ee++){if(!X[ee]||J[ee]>=0)continue;let R=V,te=-1,Z=F,H=-1;const Ie=[ee];for(J[ee]=Q;Ie.length;){const L=Ie.pop(),de=L/V|0,he=L%V;he<R&&(R=he),he>te&&(te=he),de<Z&&(Z=de),de>H&&(H=de);const U=[de>0?L-V:-1,de<F-1?L+V:-1,he>0?L-1:-1,he<V-1?L+1:-1];for(const G of U)G>=0&&X[G]&&J[G]<0&&(J[G]=Q,Ie.push(G))}ne.push({cx0:R,cx1:te,cy0:Z,cy1:H}),Q++}for(const ee of ne)ee.cx1-ee.cx0+1>=4&&ee.cy1-ee.cy0+1>=4&&P.push({x0:ee.cx0*8,x1:Math.min(o-1,(ee.cx1+1)*8),y0:ee.cy0*8,y1:Math.min(l-1,(ee.cy1+1)*8)})}return z.flatMap(O=>{const V=O.startY,F=O.startY+O.height,A=P.filter(R=>R.y0<F&&R.y1>V),N=new Uint8Array(o);for(let R=0;R<O.height;R++){const Z=(O.startY+R)*o;for(let H=0;H<o;H++)S(h(Z+H))&&(N[H]=1)}for(const R of A)for(let te=R.x0;te<=R.x1&&te<o;te++)N[te]=0;let X=o,J=-1;for(let R=0;R<o;R++)N[R]&&(R<X&&(X=R),R>J&&(J=R));let Q;if(X>J)Q=[{x0:0,x1:o-1}];else{Q=[{x0:X,x1:J}];for(const R of A){const te=[];for(const Z of Q){if(R.x1<Z.x0||R.x0>Z.x1){te.push(Z);continue}R.x0>Z.x0&&te.push({x0:Z.x0,x1:R.x0-1}),R.x1<Z.x1&&te.push({x0:R.x1+1,x1:Z.x1})}Q=te}Q.length===0&&Q.push({x0:0,x1:o-1})}A.length===0&&Q.length===1&&Q[0].x1-Q[0].x0<o*.5&&(Q[0]={x0:0,x1:o-1});const ne=6,ee=Q.filter(R=>R.x1-R.x0>=10);return ee.length===0&&ee.push({x0:0,x1:o-1}),ee.map(R=>{const te=Qt.clampBox({x:Math.max(r.x,r.x+R.x0-ne),y:r.y+O.startY,width:R.x1-R.x0+1+ne*2,height:O.height,confidence:r.confidence},i,n);return te.kind=r.kind,te})})}catch{return[r]}}}class oc{session;inputSize=640;textBubbleThresh=.15;textFreeThresh=.07;bubbleFallbackThresh=.3;constructor(t){this.session=t}async detectText(t,r,i){const a=new OffscreenCanvas(this.inputSize,this.inputSize).getContext("2d");if(!a)throw new Error("Không thể tạo context 2D cho ComicDetEngine");a.drawImage(t,0,0,this.inputSize,this.inputSize);const o=a.getImageData(0,0,this.inputSize,this.inputSize).data,l=this.inputSize*this.inputSize,d=new Float32Array(3*l);for(let z=0;z<l;z++){const v=z*4;d[z]=o[v]/255,d[l+z]=o[v+1]/255,d[2*l+z]=o[v+2]/255}const h=new Le("float32",d,[1,3,this.inputSize,this.inputSize]),p=new Le("int64",new BigInt64Array([BigInt(r),BigInt(i)]),[1,2]),f={images:h,orig_target_sizes:p},_=await this.session.run(f),m=_.labels.data,w=_.boxes.data,x=_.scores.data,$=x.length,b=[],S=[];for(let z=0;z<$;z++){const v=x[z],B=Number(m[z]),P=Math.max(0,Math.round(w[z*4+0])),O=Math.max(0,Math.round(w[z*4+1])),V=Math.min(r,Math.round(w[z*4+2])),F=Math.min(i,Math.round(w[z*4+3])),A=V-P,N=F-O;if(A<8||N<8||A>=r*.98&&N>=i*.95)continue;const X={x:P,y:O,width:A,height:N,confidence:v};B===1&&v>=this.textBubbleThresh?(X.kind="dialogue",b.push(X)):B===2&&v>=this.textFreeThresh?(X.kind="sfx",b.push(X)):B===0&&v>=this.bubbleFallbackThresh&&S.push(X)}for(const z of S)if(!b.some(B=>B.x>=z.x-12&&B.y>=z.y-12&&B.x+B.width<=z.x+z.width+12&&B.y+B.height<=z.y+z.height+12)){const B=Math.round(z.width*.08),P=Math.round(z.height*.08);b.push({x:z.x+B,y:z.y+P,width:Math.max(12,z.width-B*2),height:Math.max(12,z.height-P*2),confidence:z.confidence,kind:"dialogue"})}const I=b,T=[],E=t.getContext("2d");for(const z of I){if(z.height>=34&&z.width>=28&&E){const v=ea.segmentLines(E,z,r,i);if(v.length>0){T.push(...v);continue}}T.push(z)}return T.sort((z,v)=>z.y-v.y)}}class uc{session;thresh=.1;boxThresh=.15;unclipRatio=1.65;lastProbMap=null;constructor(t,r){this.session=t,r?.thresh!==void 0&&(this.thresh=r.thresh),r?.boxThresh!==void 0&&(this.boxThresh=r.boxThresh),r?.unclipRatio!==void 0&&(this.unclipRatio=r.unclipRatio)}async detectText(t,r,i){const{targetW:n,targetH:a,ratioW:s,ratioH:o}=Qt.calculateDetResize(r,i),d=new OffscreenCanvas(n,a).getContext("2d");if(!d)throw new Error("Khong the khoi tao OffscreenCanvas 2D context");d.drawImage(t,0,0,n,a);const h=d.getImageData(0,0,n,a),p=Qt.imageToDetTensor(h,n,a),f={},_=this.session.inputNames[0]||"x";f[_]=p;const m=await this.session.run(f),w=this.session.outputNames[0],$=m[w].data;this.lastProbMap={data:$,w:n,h:a,ratioW:s,ratioH:o};const b=this.extractBoxes($,n,a),S=[];for(const T of b){if(T.confidence&&T.confidence<this.boxThresh)continue;const E=T.width*T.height,z=2*(T.width+T.height),v=Math.max(3,Math.min(18,E*this.unclipRatio/Math.max(1,z))),B=T.x+T.width/2,P=T.y+T.height/2,O=T.width+v*2,V=T.height+v*2,F=Math.round((B-O/2)/s),A=Math.round((P-V/2)/o),N=Math.round(O/s),X=Math.round(V/o),J=Qt.clampBox({x:F,y:A,width:N,height:X,confidence:T.confidence},r,i);J.kind=T.kind;const Q=J.width<8||J.height<8,ne=J.width>=r*.98&&J.height>=i*.94;!Q&&!ne&&S.push(J)}return this.mergeHorizontalBoxes(S,r).sort((T,E)=>T.y-E.y)}mergeHorizontalBoxes(t,r){if(t.length<=1)return t;let i=[...t],n=!0;for(;n;){n=!1;const a=[],s=new Set;for(let o=0;o<i.length;o++){if(s.has(o))continue;let l={...i[o]};for(let d=o+1;d<i.length;d++){if(s.has(d))continue;const h=i[d],p=l.y,f=l.y+l.height,_=h.y,m=h.y+h.height,w=Math.max(0,Math.min(f,m)-Math.max(p,_)),x=Math.min(l.height,h.height);if(w/Math.max(1,x)>=.4){const b=l.x,S=l.x+l.width,I=h.x,T=h.x+h.width,E=Math.max(0,Math.max(b,I)-Math.min(S,T)),z=Math.max(l.height,h.height)*2.2,v=Math.min(b,I),P=Math.max(S,T)-v;if(E<=z&&P<=r*.96){const O=Math.min(p,_),V=Math.max(f,m);l={x:v,y:O,width:P,height:V-O,confidence:Math.max(l.confidence||0,h.confidence||0),kind:l.kind??h.kind},s.add(d),n=!0}}}a.push(l)}i=a}return i}extractBoxes(t,r,i){const n=new Uint8Array(r*i),a=[];for(let s=0;s<i;s++)for(let o=0;o<r;o++){const l=s*r+o;if(n[l]||t[l]<this.thresh)continue;let d=o,h=o,p=s,f=s,_=0,m=0;const w=[l];for(n[l]=1;w.length>0;){const b=w.pop(),S=Math.floor(b/r),I=b%r;_+=t[b],m++,I<d&&(d=I),I>h&&(h=I),S<p&&(p=S),S>f&&(f=S);const T=[S>0?(S-1)*r+I:-1,S<i-1?(S+1)*r+I:-1,I>0?S*r+(I-1):-1,I<r-1?S*r+(I+1):-1];for(const E of T)E>=0&&!n[E]&&t[E]>=this.thresh&&(n[E]=1,w.push(E))}const x=h-d+1,$=f-p+1;x>=5&&$>=5&&m>=6&&a.push({x:d,y:p,width:x,height:$,confidence:_/m,kind:"dialogue"})}return a}}class Ay{static analyzeRegion(t,r=.18){const i=t.width,n=t.height;if(i<=0||n<=0||t.data.length<i*n*4)return{isDark:!1,bgHex:"#ffffff",luma:255,lumaStdDev:0};const a=Math.max(1,Math.round(Math.min(i,n)*r)),s=[],o=[],l=[],d=[],h=(x,$)=>{const b=($*i+x)*4,S=t.data[b],I=t.data[b+1],T=t.data[b+2];s.push(S),o.push(I),l.push(T),d.push(.299*S+.587*I+.114*T)};for(let x=0;x<i;x+=3)for(let $=0;$<a;$++)h(x,$),h(x,n-1-$);for(let x=a;x<n-a;x+=3)for(let $=0;$<a;$++)h($,x),h(i-1-$,x);if(d.length===0)return{isDark:!1,bgHex:"#ffffff",luma:255,lumaStdDev:0};const p=Bn(s),f=Bn(o),_=Bn(l),m=d.reduce((x,$)=>x+$,0)/d.length,w=d.reduce((x,$)=>x+($-m)*($-m),0)/d.length;return{isDark:m<105,bgHex:`#${Rn(p)}${Rn(f)}${Rn(_)}`,luma:m,lumaStdDev:Math.sqrt(w)}}}function Bn(e){const t=e.slice().sort((i,n)=>i-n),r=t.length>>1;return t.length%2===0?Math.round((t[r-1]+t[r])/2):t[r]}function Rn(e){return Math.max(0,Math.min(255,e)).toString(16).padStart(2,"0")}class wr{static BUCKETS=[64,128,256,512,960];static MAX_BATCH=8;static assignBuckets(t,r=wr.BUCKETS){const i=new Map,n=r[r.length-1];for(let a=0;a<t.length;a++){let s=n;for(const l of r)if(t[a]<=l){s=l;break}const o=i.get(s);o?o.push(a):i.set(s,[a])}return i}static concatTensors(t,r,i,n){const a=n*i,s=new Float32Array(t.length*3*a);for(let o=0;o<t.length;o++){const l=Math.min(r[o],i),d=n*l,h=o*3*a;for(let p=0;p<3;p++){const f=p*d,_=h+p*a;for(let m=0;m<n;m++)s.set(t[o].subarray(f+m*l,f+m*l+l),_+m*i)}}return s}}class $r{session;characters;targetH=48;isCjkModel;batchSupported=!0;constructor(t,r,i){this.session=t,this.isCjkModel=i?.isCjkModel??!1,this.characters=r.split(/\r?\n/),this.characters.length>0&&(this.characters[this.characters.length-1]=" ")}async recognizeBoxes(t,r){if(!t.getContext("2d"))return[];const n=[];for(let o=0;o<r.length;o++){const l=this.prepareCrop(t,r[o],o);l&&n.push(l)}const a=this.session.inputNames[0]||"x";if(this.batchSupported)try{await this.runBatched(n,a)}catch(o){this.batchSupported=!1,console.warn("[SpeedySlate] Rec batch inference unsupported, using sequential path:",o)}this.batchSupported||await this.runSequential(n,a),await this.retryLowConfidence(n,a);const s=[];for(const o of n){if(!o.decoded)continue;const l=o.text.replace(/\s+/g," ").trim(),d=/[\p{L}\p{N}]/u.test(l),h=l.length<=2&&o.confidence<.65;l.length>0&&d&&!h&&o.confidence>.28&&s.push({id:`bubble-${Date.now()}-${o.index}`,box:o.box,originalText:l,isDarkBackground:o.isDark,confidence:o.confidence,bgColor:o.bgColor,kind:o.box.kind??"dialogue",...o.isVertical?{isVertical:!0}:{}})}return s}prepareCrop(t,r,i){const s=Math.max(0,r.x-5),o=Math.max(0,r.y-2),l=Math.max(1,Math.min(t.width-s,r.width+10)),d=Math.max(1,Math.min(t.height-o,r.height+4)),h=new OffscreenCanvas(l,d),p=h.getContext("2d");if(!p)return null;p.drawImage(t,s,o,l,d,0,0,l,d);const f=p.getImageData(0,0,l,d);l>=16&&d>=12&&($r.cleanCropToMask(f),p.putImageData(f,0,0));const _=wo.isVerticalCandidate(r,this.isCjkModel);let m=l,w=d,x=null;if(_){const v=wo.rotateCropCCW(f);x=new OffscreenCanvas(v.width,v.height);const B=x.getContext("2d");if(!B)return null;const P=new Uint8ClampedArray(v.data);B.putImageData(new ImageData(P,v.width,v.height),0,0),m=v.width,w=v.height}const $=m/w;let b=Math.max(32,Math.min(960,Math.round(this.targetH*$)));b=Math.round(b/8)*8;const I=new OffscreenCanvas(b,this.targetH).getContext("2d");if(!I)return null;x?I.drawImage(x,0,0,m,w,0,0,b,this.targetH):I.drawImage(h,0,0,l,d,0,0,b,this.targetH);const T=I.getImageData(0,0,b,this.targetH),E=Ay.analyzeRegion(T),z=E.isDark;return z&&$r.invertRgb(T.data),{index:i,box:r,imageData:T,targetW:b,inverted:z,isDark:E.isDark,bgColor:E.bgHex,isVertical:_,text:"",confidence:0,decoded:!1}}async runBatched(t,r){const i=wr.assignBuckets(t.map(n=>n.targetW));for(const[n,a]of i)for(let s=0;s<a.length;s+=wr.MAX_BATCH){const o=a.slice(s,s+wr.MAX_BATCH).map(x=>t[x]),l=Qt.imageToRecTensorBatch(o.map(x=>x.imageData),n,this.targetH),h=(await this.session.run({[r]:l}))[this.session.outputNames[0]],p=h.dims;if(p.length!==3)throw new Error(`Unexpected rec output dims: ${p.join("x")}`);const f=p[1],_=p[2],m=f*_,w=h.data;for(let x=0;x<o.length;x++){const $=w.subarray(x*m,(x+1)*m),b=this.ctcDecode($,[1,f,_]);o[x].text=b.text,o[x].confidence=b.confidence,o[x].decoded=!0}}}async runSequential(t,r){for(const i of t)if(!i.decoded)try{const n=await this.runSingle(i,r);i.text=n.text,i.confidence=n.confidence,i.decoded=!0}catch(n){console.warn("[SpeedySlate] Rec inference error for box:",n)}}async runSingle(t,r){const i=Qt.imageToRecTensor(t.imageData,t.targetW,this.targetH),a=(await this.session.run({[r]:i}))[this.session.outputNames[0]];return this.ctcDecode(a.data,a.dims)}async retryLowConfidence(t,r){for(const i of t){if(!i.decoded||i.confidence>=.45)continue;const n=new ImageData(new Uint8ClampedArray(i.imageData.data),i.imageData.width,i.imageData.height);$r.invertRgb(n.data);try{const a=await this.runSingle({...i,imageData:n},r);a.confidence>i.confidence&&(i.text=a.text,i.confidence=a.confidence,i.inverted=!i.inverted)}catch(a){console.warn("[SpeedySlate] Rec retry error for box:",a)}}}static cleanCropToMask(t){const r=t.data,i=t.width*t.height,n=new Uint8Array(i),a=new Int32Array(256);for(let O=0;O<i;O++){const V=O*4,A=(r[V]*299+r[V+1]*587+r[V+2]*114)/1e3|0;n[O]=A,a[A]++}let s=0;for(let O=0;O<256;O++)s+=O*a[O];let o=0,l=0,d=-1,h=128;for(let O=0;O<256;O++){if(l+=a[O],l===0)continue;const V=i-l;if(V===0)break;o+=O*a[O];const F=o/l,A=(s-o)/V,N=l*V*(F-A)*(F-A);N>d&&(d=N,h=O)}let p=0;for(let O=0;O<=h;O++)p+=a[O];if(h<20||h>235)return;const f=Math.min(p,i-p);if(f<i*.02||f>i*.45)return;const _=p<=i/2;let m=0,w=0,x=0,$=0,b=0,S=0;for(let O=0;O<i;O++){if(_?n[O]<=h:n[O]>h)continue;const F=O*4;m+=r[F],w+=r[F+1],x+=r[F+2],$+=n[O],b+=n[O]*n[O],S++}if(S===0||Math.sqrt(Math.max(0,b/S-($/S)**2))<=30)return;const T=m/S,E=w/S,z=x/S,v=t.width,B=t.height,P=new Uint8Array(i);for(let O=0;O<i;O++)P[O]=(_?n[O]<=h:n[O]>h)?1:0;for(let O=0;O<B;O++)for(let V=0;V<v;V++){const F=O*v+V;if(P[F]){let N=0;for(let X=-1;X<=1;X++)for(let J=-1;J<=1;J++){if(!J&&!X)continue;const Q=V+J,ne=O+X;Q>=0&&Q<v&&ne>=0&&ne<B&&P[ne*v+Q]&&N++}if(N>=3)continue}const A=F*4;r[A]=T,r[A+1]=E,r[A+2]=z}}static invertRgb(t){for(let r=0;r<t.length;r+=4)t[r]=255-t[r],t[r+1]=255-t[r+1],t[r+2]=255-t[r+2]}ctcDecode(t,r){let i=0,n=0;if(r.length===3)i=r[1],n=r[2];else return{text:"",confidence:0};let a=[],s=-1,o=0,l=0;for(let h=0;h<i;h++){let p=-1/0,f=0;const _=h*n;for(let m=0;m<n;m++){const w=t[_+m];w>p&&(p=w,f=m)}if(f!==0&&f!==s){const m=f-1;m<this.characters.length&&(a.push(this.characters[m]),o+=p,l++)}s=f}const d=l>0?o/l:0;return{text:a.join(""),confidence:d}}}class Dn{static computeSliceHeights(t,r,i={}){const n=i.maxSliceHeight??2e3,a=i.overlap??200,s=i.aspectCap!==void 0?Math.min(n,Math.max(640,Math.round(t*i.aspectCap))):n;if(r<=s+200)return[{startY:0,h:r}];const o=Math.max(1,s-a),l=[];for(let d=0;d<r;d+=o)l.push({startY:d,h:Math.min(s,r-d)});return l}static async detectWithSlicing(t,r,i,n,a={}){const s=this.computeSliceHeights(r,i,a),o=await this.detectSlices(t,r,i,n,s,a.overlap??200,a.textMapOut);if(a.invertedPass){const l=this.findDarkRanges(t,r,i,o);if(l.length>0){const d=this.buildInverted(t,r,i),h=await this.detectSlices(d,r,i,n,l,0,a.textMapOut);for(const p of h)o.some(_=>this.calculateIoU(_,p)>.5)||o.push(p)}}return o.sort((l,d)=>l.y-d.y)}static async detectSlices(t,r,i,n,a,s,o){if(a.length===1&&a[0].h===i){const d=await n.detectText(t,r,i);return this.blitProbMap(n,o,r,0),d}const l=[];for(const d of a){const h=new OffscreenCanvas(r,d.h),p=h.getContext("2d");if(!p)continue;p.drawImage(t,0,d.startY,r,d.h,0,0,r,d.h);const f=await n.detectText(h,r,d.h);this.blitProbMap(n,o,r,d.startY);for(const _ of f){const m={x:_.x,y:d.startY+_.y,width:_.width,height:_.height,confidence:_.confidence,kind:_.kind};d.startY>0&&_.y<s+40&&l.some(x=>this.calculateIoU(x,m)>.35)||l.push(m)}}return l}static blitProbMap(t,r,i,n){const a=t.lastProbMap;if(!a||!r)return;const s=Math.round(a.h/a.ratioH),o=Math.min(i,Math.round(a.w/a.ratioW));for(let l=0;l<s;l++){const d=n+l;if(d*i>=r.length)break;const h=Math.min(a.h-1,Math.floor(l*a.ratioH)),p=d*i,f=h*a.w;for(let _=0;_<o;_++){const m=Math.min(a.w-1,Math.floor(_*a.ratioW)),w=a.data[f+m];w>r[p+_]&&(r[p+_]=w)}}}static findDarkRanges(t,r,i,n){const a=t.getContext("2d");if(!a)return[];const s=16,o=Math.ceil(r/s),l=Math.ceil(i/s),d=a.getImageData(0,0,r,i).data,h=new Int32Array(l);let p=0;for(let w=0;w<l;w++){const x=Math.min(i-1,w*s+(s>>1));for(let $=0;$<o;$++){const b=Math.min(r-1,$*s+(s>>1)),S=(x*r+b)*4;(d[S]*299+d[S+1]*587+d[S+2]*114)/1e3>=90||n.some(E=>b>=E.x&&b<=E.x+E.width&&x>=E.y&&x<=E.y+E.height)||(h[w]++,p++)}}if(p<8)return[];const f=[];let _=-1,m=-1;for(let w=0;w<=l;w++)if(w<l&&h[w]>=2)_<0&&(_=w),m=w;else if(_>=0&&(w===l||w-m>5)){const $=_*s,b=(m+1)*s-$;b>=48&&f.push({startY:$,h:Math.min(b,i-$)}),_=-1}return f}static buildInverted(t,r,i){const n=t.getContext("2d"),a=new OffscreenCanvas(r,i),s=a.getContext("2d");if(!n||!s)return t;const o=n.getImageData(0,0,r,i),l=o.data;for(let d=0;d<l.length;d+=4)l[d]=255-l[d],l[d+1]=255-l[d+1],l[d+2]=255-l[d+2];return s.putImageData(o,0,0),a}static calculateIoU(t,r){const i=Math.max(0,Math.min(t.x+t.width,r.x+r.width)-Math.max(t.x,r.x)),n=Math.max(0,Math.min(t.y+t.height,r.y+r.height)-Math.max(t.y,r.y)),a=i*n;if(a<=0)return 0;const s=t.width*t.height,o=r.width*r.height,l=s+o-a;return l>0?a/l:0}}function Nn(e,t,r,i,n=!1){const a=new Uint8Array(i);let s=0;for(let x=0;x<i;x++)s+=e[x];if(s===0)return null;const o=s>i*.25;if(o)for(let x=0;x<r;x++)for(let $=0;$<t;$++){const b=x*t+$;if(!e[b])continue;let S=0;for(let I=-1;I<=1;I++)for(let T=-1;T<=1;T++){if(!T&&!I)continue;const E=$+T,z=x+I;E>=0&&E<t&&z>=0&&z<r&&e[z*t+E]&&S++}S>=3&&(a[b]=1)}else a.set(e);let l=0;for(let x=0;x<i;x++)l+=a[x];l===0&&a.set(e);const d=new Int32Array(i).fill(-1),h=[],p=[],f=[],_=new Int32Array(i);for(let x=0;x<i;x++){if(!a[x]||d[x]>=0)continue;const $=h.length;let b=0,S=0,I=0,T=t,E=0,z=r,v=0;for(d[x]=$,_[S++]=x;b<S;){const B=_[b++],P=B%t,O=B/t|0;I++,P<T&&(T=P),P>E&&(E=P),O<z&&(z=O),O>v&&(v=O),P>0&&a[B-1]&&d[B-1]<0&&(d[B-1]=$,_[S++]=B-1),P<t-1&&a[B+1]&&d[B+1]<0&&(d[B+1]=$,_[S++]=B+1),O>0&&a[B-t]&&d[B-t]<0&&(d[B-t]=$,_[S++]=B-t),O<r-1&&a[B+t]&&d[B+t]<0&&(d[B+t]=$,_[S++]=B+t)}h.push(I),p.push(E-T+1),f.push(v-z+1)}const m=n?i*.5:Math.min(700,i*.25);let w=0;for(let x=0;x<i;x++){const $=d[x];if($<0)continue;const b=!n&&o&&(p[$]>t*.8&&f[$]<r*.5||f[$]>r*.8&&p[$]<t*.5);h[$]>m||b||o&&!n&&h[$]<5?a[x]=0:w++}return w>0?a:null}function lc(e,t,r,i,n,a=4){const s=i*n,o=new Uint8Array(s);for(let m=0;m<s;m++)o[m]=!r[m]&&Math.abs(e[m]-t)>60?1:0;for(let m=0;m<5;m++){const w=o.slice();for(let x=0;x<n;x++)for(let $=0;$<i;$++){const b=x*i+$;w[b]||($>0&&w[b-1]||$<i-1&&w[b+1]||x>0&&w[b-i]||x<n-1&&w[b+i])&&(o[b]=1)}}const l=new Uint8Array(s),d=new Int32Array(s);let h=0,p=0;const f=m=>{o[m]&&!l[m]&&(l[m]=1,d[p++]=m)};for(let m=0;m<i;m++)f(m),f((n-1)*i+m);for(let m=0;m<n;m++)f(m*i),f(m*i+i-1);for(;h<p;){const m=d[h++],w=m%i,x=m/i|0;w>0&&f(m-1),w<i-1&&f(m+1),x>0&&f(m-i),x<n-1&&f(m+i)}const _=l.slice();for(let m=0;m<a;m++){const w=_.slice();for(let x=0;x<n;x++)for(let $=0;$<i;$++){const b=x*i+$;w[b]||($>0&&w[b-1]||$<i-1&&w[b+1]||x>0&&w[b-i]||x<n-1&&w[b+i])&&(_[b]=1)}}return _}class ui{static buildPatch(t,r,i,n,a,s){const o=t.width,l=t.height,d=o*l;if(d<16)return null;const h=t.data,p=new Uint8Array(d),f=new Int32Array(256);for(let U=0;U<d;U++){const G=U*4,j=(h[G]*299+h[G+1]*587+h[G+2]*114)/1e3;p[U]=j|0,f[j|0]++}let _=0;for(let U=0;U<256;U++)_+=U*f[U];let m=0,w=0,x=-1,$=128;for(let U=0;U<256;U++){if(w+=f[U],w===0)continue;const G=d-w;if(G===0)break;m+=U*f[U];const j=m/w,Y=(_-m)/G,ue=w*G*(j-Y)*(j-Y);ue>x&&(x=ue,$=U)}let b=0;for(let U=0;U<=$;U++)b+=f[U];const S=new Uint8ClampedArray(d*4),I=(U,G)=>{const j=ui.hexToRgb(G);if(!j)return null;for(let Y=0;Y<d;Y++){if(!U[Y])continue;const ue=Y*4;S[ue]=j[0],S[ue+1]=j[1],S[ue+2]=j[2],S[ue+3]=255}return{x:r,y:i,width:o,height:l,pixels:S,dbg:{path:"rawflat",guided:v}}},T=ui.hexToRgb(n),E=new Uint8Array(d);if(T){const U=(T[0]*299+T[1]*587+T[2]*114)/1e3;for(let G=0;G<d;G++)E[G]=Math.abs(p[G]-U)>60?1:0}else{const U=b<=d/2;for(let G=0;G<d;G++)E[G]=(U?p[G]<=$:p[G]>$)?1:0}const z=new Uint8Array(d);if(T){const U=b<=d/2;for(let G=0;G<d;G++)z[G]=(U?p[G]<=$:p[G]>$)?1:0}let v=!1;const B=new Uint8Array(d),P=new Float32Array(d);let O=128,V=0;if(a&&s){let U=0;for(let G=0;G<d;G++){const j=i+(G/o|0),Y=r+G%o;P[G]=a[j*s+Y]||0,P[G]>V&&(V=P[G]),P[G]>.3&&U++}if(U>d*.01){v=!0;for(let j=0;j<d;j++)B[j]=P[j]>.12?1:0;for(let j=0;j<2;j++){const Y=B.slice();for(let ue=0;ue<l;ue++)for(let se=0;se<o;se++){const ye=ue*o+se;Y[ye]||(se>0&&Y[ye-1]||se<o-1&&Y[ye+1]||ue>0&&Y[ye-o]||ue<l-1&&Y[ye+o])&&(B[ye]=1)}}const G=[];for(let j=0;j<d;j++)B[j]||G.push(p[j]);G.sort((j,Y)=>j-Y),O=G.length>d*.05?G[G.length/2|0]:T?(T[0]*299+T[1]*587+T[2]*114)/1e3:128;for(let j=0;j<d;j++)E[j]=B[j]&&Math.abs(p[j]-O)>25?1:0,B[j]||(z[j]=0)}}let F=Nn(E,o,l,d,v);if(!F&&T&&(F=Nn(z,o,l,d,v)),!F){let U=!1;for(let Y=0;Y<d;Y++)if(E[Y]||z[Y]){U=!0;break}if(!U)return null;const G=new Uint8Array(d);for(let Y=0;Y<d;Y++)G[Y]=E[Y]|z[Y];const j=new Uint8Array(d);for(let Y=0;Y<l;Y++)for(let ue=0;ue<o;ue++){const se=Y*o+ue;if(G[se])for(let ye=-1;ye<=1;ye++)for(let pe=-1;pe<=1;pe++){const $e=ue+pe,Re=Y+ye;$e>=0&&$e<o&&Re>=0&&Re<l&&(j[Re*o+$e]=1)}}return I(j,n)}const A=new Uint8Array(d);A.set(F);for(let U=0;U<2;U++){const G=A.slice();for(let j=0;j<l;j++)for(let Y=0;Y<o;Y++){const ue=j*o+Y;if(G[ue])for(let se=-1;se<=1;se++)for(let ye=-1;ye<=1;ye++){const pe=Y+ye,$e=j+se;pe>=0&&pe<o&&$e>=0&&$e<l&&(A[$e*o+pe]=1)}}}const N=new Uint8Array(d);if(v){const U=new Uint8Array(d);for(let j=0;j<d;j++)U[j]=P[j]>.3&&Math.abs(p[j]-O)>40?1:0;const G=Nn(U,o,l,d,!0);if(G){N.set(G);for(let j=0;j<4;j++){const Y=N.slice();for(let ue=0;ue<l;ue++)for(let se=0;se<o;se++){const ye=ue*o+se;if(Y[ye])for(let pe=-1;pe<=1;pe++)for(let $e=-1;$e<=1;$e++){const Re=se+$e,Ve=ue+pe;Re>=0&&Re<o&&Ve>=0&&Ve<l&&(N[Ve*o+Re]=1)}}}}}const X=new Uint8Array(d);X.set(B);for(let U=0;U<4;U++){const G=X.slice();for(let j=0;j<l;j++)for(let Y=0;Y<o;Y++){const ue=j*o+Y;if(G[ue])for(let se=-1;se<=1;se++)for(let ye=-1;ye<=1;ye++){const pe=Y+ye,$e=j+se;pe>=0&&pe<o&&$e>=0&&$e<l&&(X[$e*o+pe]=1)}}}const J=new Uint8Array(d),Q=A.slice();for(let U=0;U<4;U++){const G=Q.slice();for(let j=0;j<l;j++)for(let Y=0;Y<o;Y++){const ue=j*o+Y;if(G[ue])for(let se=-1;se<=1;se++)for(let ye=-1;ye<=1;ye++){const pe=Y+ye,$e=j+se;pe>=0&&pe<o&&$e>=0&&$e<l&&(Q[$e*o+pe]=1)}}}for(let U=0;U<d;U++)J[U]=Q[U]&&!A[U]?1:0;let ne=-1,ee=-1;const R=[];for(let U=0;U<d;U++)J[U]&&R.push(p[U]);if(R.length>20){R.sort((pe,$e)=>pe-$e);const U=R[R.length/2|0];let G=0,j=0,Y=0,ue=0,se=0,ye=0;for(let pe=0;pe<d;pe++){if(!J[pe]||Math.abs(p[pe]-U)>40)continue;const $e=pe*4;j+=h[$e],Y+=h[$e+1],ue+=h[$e+2],se+=p[pe],ye+=p[pe]*p[pe],G++}if(G>20){const pe=se/G,$e=Math.sqrt(Math.max(0,ye/G-pe*pe));let Re=0,Ve=0;for(let qe=0;qe<d;qe++){if(!Q[qe])continue;Ve++,!(v?!!N[qe]:!!A[qe])&&Math.abs(p[qe]-U)>40&&Re++}const Ht=Ve?Re/Ve:0;if(ne=Ht,ee=$e,$e<20&&Ht<.08){const qe=lc(p,U,Q,o,l,0);for(let lt=0;lt<d;lt++){if(qe[lt]&&Math.abs(p[lt]-U)>90)continue;const It=lt*4;S[It]=j/G,S[It+1]=Y/G,S[It+2]=ue/G,S[It+3]=255}return{x:r,y:i,width:o,height:l,pixels:S,dbg:{path:"flat",risky:Ht,std:$e,guided:v}}}}}const te={path:v?"donor-tex":"donor",guided:v,risky:ne,std:ee,tmMax:V};let Z=A;if(v){let U=!1;for(let G=0;G<d;G++)if(N[G]){U=!0;break}if(U){const G=lc(p,O,A,o,l),j=N.slice();for(let Y=0;Y<2;Y++){const ue=j.slice();for(let se=0;se<l;se++)for(let ye=0;ye<o;ye++){const pe=se*o+ye;ue[pe]||(ye>0&&ue[pe-1]||ye<o-1&&ue[pe+1]||se>0&&ue[pe-o]||se<l-1&&ue[pe+o])&&(j[pe]=1)}}Z=new Uint8Array(d);for(let Y=0;Y<d;Y++){const ue=A[Y]&&!N[Y]&&P[Y]<.12&&Math.abs(p[Y]-O)>40;Z[Y]=ue&&G[Y]&&!j[Y]?0:A[Y]}}}const H=new Float32Array(d*3),Ie=new Int32Array(d);let L=0,de=0;for(let U=0;U<d;U++){const G=U*4;A[U]?H[U*3]=-1:(H[U*3]=h[G],H[U*3+1]=h[G+1],H[U*3+2]=h[G+2],Ie[de++]=U)}for(;L<de;){const U=Ie[L++],G=U%o,j=U/o|0,Y=ue=>{H[ue*3]>=0||(H[ue*3]=H[U*3],H[ue*3+1]=H[U*3+1],H[ue*3+2]=H[U*3+2],Ie[de++]=ue)};G>0&&Y(U-1),G<o-1&&Y(U+1),j>0&&Y(U-o),j<l-1&&Y(U+o)}const he=new Float32Array(H);for(let U=0;U<10;U++){for(let G=0;G<l;G++)for(let j=0;j<o;j++){const Y=G*o+j;if(!Z[Y])continue;let ue=0,se=0,ye=0,pe=0;j>0&&(ue+=H[(Y-1)*3],se+=H[(Y-1)*3+1],ye+=H[(Y-1)*3+2],pe++),j<o-1&&(ue+=H[(Y+1)*3],se+=H[(Y+1)*3+1],ye+=H[(Y+1)*3+2],pe++),G>0&&(ue+=H[(Y-o)*3],se+=H[(Y-o)*3+1],ye+=H[(Y-o)*3+2],pe++),G<l-1&&(ue+=H[(Y+o)*3],se+=H[(Y+o)*3+1],ye+=H[(Y+o)*3+2],pe++);const $e=Y*3;he[$e]=ue/pe,he[$e+1]=se/pe,he[$e+2]=ye/pe}H.set(he)}for(let U=0;U<d;U++){if(!Z[U])continue;const G=U*4;S[G]=H[U*3],S[G+1]=H[U*3+1],S[G+2]=H[U*3+2],S[G+3]=255}return{x:r,y:i,width:o,height:l,pixels:S,dbg:te}}static hexToRgb(t){return!t||!/^#[0-9a-fA-F]{6}$/.test(t)?null:[parseInt(t.slice(1,3),16),parseInt(t.slice(3,5),16),parseInt(t.slice(5,7),16)]}}class Oy{static buildBubblePatch(t,r,i,n){const a=t.width,s=t.height,o=a*s,l=t.data,d=new Uint8Array(o);for(let L=0;L<o;L++){const de=L*4;d[L]=l[de]*77+l[de+1]*150+l[de+2]*29>>8}const p=d.slice().sort()[o>>1],f=new Uint8Array(o);for(let L=0;L<o;L++)Math.abs(d[L]-p)>90&&(f[L]=1);const _=new Uint8Array(o),m=new Int32Array(o);let w=0,x=0;const $=Math.floor(a*.3),b=Math.ceil(a*.7),S=Math.floor(s*.3),I=Math.ceil(s*.7);for(let L=S;L<I;L++)for(let de=$;de<b;de++){const he=L*a+de;!f[he]&&!_[he]&&(_[he]=1,m[x++]=he)}for(;w<x;){const L=m[w++],de=L%a,he=L/a|0;de>0&&!f[L-1]&&!_[L-1]&&(_[L-1]=1,m[x++]=L-1),de<a-1&&!f[L+1]&&!_[L+1]&&(_[L+1]=1,m[x++]=L+1),he>0&&!f[L-a]&&!_[L-a]&&(_[L-a]=1,m[x++]=L-a),he<s-1&&!f[L+a]&&!_[L+a]&&(_[L+a]=1,m[x++]=L+a)}if(x<o*.08)return null;const E=new Uint8Array(o),z=new Int32Array(o);let v=0,B=0;const P=L=>{!_[L]&&!E[L]&&(E[L]=1,z[B++]=L)};for(let L=0;L<a;L++)P(L),P((s-1)*a+L);for(let L=0;L<s;L++)P(L*a),P(L*a+a-1);for(;v<B;){const L=z[v++],de=L%a,he=L/a|0;de>0&&!_[L-1]&&!E[L-1]&&(E[L-1]=1,z[B++]=L-1),de<a-1&&!_[L+1]&&!E[L+1]&&(E[L+1]=1,z[B++]=L+1),he>0&&!_[L-a]&&!E[L-a]&&(E[L-a]=1,z[B++]=L-a),he<s-1&&!_[L+a]&&!E[L+a]&&(E[L+a]=1,z[B++]=L+a)}let O=0,V=0,F=0,A=0,N=0,X=0;for(let L=0;L<o;L++){if(!_[L]||f[L])continue;const de=d[L];V+=de,F+=de*de;const he=L*4;A+=l[he],N+=l[he+1],X+=l[he+2],O++}if(O===0)return null;const J=V/O,Q=Math.sqrt(Math.max(0,F/O-J*J));if(Q>25)return null;const ne=new Uint8Array(o);if(n&&n.length>0)for(const L of n){const de=Math.max(0,Math.floor(L.x-r-25)),he=Math.max(0,Math.floor(L.y-i-25)),U=Math.min(a,Math.ceil(L.x-r+L.width+25)),G=Math.min(s,Math.ceil(L.y-i+L.height+25));for(let j=he;j<G;j++)ne.fill(1,j*a+de,j*a+U)}else ne.fill(1);let ee=0,R=0;for(let L=0;L<o;L++)E[L]||!ne[L]||(ee++,f[L]&&R++);if(ee<o*.05||R>ee*.4)return null;const te=new Uint8ClampedArray(o*4),Z=A/O,H=N/O,Ie=X/O;for(let L=0;L<o;L++){if(E[L]||!ne[L])continue;const de=L%a,he=L/a|0;if(de>0&&f[L-1]&&E[L-1]||de<a-1&&f[L+1]&&E[L+1]||he>0&&f[L-a]&&E[L-a]||he<s-1&&f[L+a]&&E[L+a])continue;const U=L*4;te[U]=Z,te[U+1]=H,te[U+2]=Ie,te[U+3]=255}return{x:r,y:i,width:a,height:s,pixels:te,dbg:{path:"bubble",guided:!0,risky:R/ee,std:Q,tmMax:0}}}}const My=self.location.href.substring(0,self.location.href.lastIndexOf("/")+1);Ee.wasm.wasmPaths=My;Ee.wasm.numThreads=Math.min(4,Math.max(1,(self.navigator?.hardwareConcurrency??2)-1));Ee.wasm.simd=!0;Ee.logLevel="error";let Yr=null,Zr=null,Un=null,dc=null,cc="wasm",pc=Promise.resolve();function By(e){const t=new Uint8Array(e),r=[99,101,105,108,95,109,111,100,101];let i=0;for(let n=0;n<t.length;n++)if(t[n]===r[i]){if(i++,i===r.length)return!0}else i=t[n]===r[0]?1:0;return!1}async function hc(e,t,r){try{if(By(e))return console.log("[OCR Worker] Model contains ceil_mode operator unsupported by WebGPU. Using WASM SIMD."),null;const i=await Zt.create(e,{...t,executionProviders:["webgpu"]});if(r&&i.inputNames.length>0){const n=i.inputNames[0],a=r.reduce((o,l)=>o*l,1),s=new Le("float32",new Float32Array(a),r);await i.run({[n]:s})}return i}catch(i){return console.warn("[OCR Worker] WebGPU session creation/kernel validation failed, falling back to WASM:",i?.message),null}}self.onmessage=e=>{const t=e.data,r=t._reqId,i=n=>self.postMessage({...n,_reqId:r});pc=pc.then(async()=>{try{switch(t.type){case"PING":{i({type:"PONG",success:!0});break}case"INIT_MODEL":{if(!t.detBuffer||!t.recBuffer||!t.keysText)throw new Error("Thiếu dữ liệu buffer hoặc keys để khởi tạo model.");const n={graphOptimizationLevel:"all",logSeverityLevel:3};let a=null,s=null,o=!1,l=!1;const d=!!(t.modelId&&t.modelId.includes("comic")),h={...n,executionProviders:["wasm"]};if(t.useWebGpu!==!1&&!d&&(a=await hc(t.detBuffer,n,[1,3,48,48]),a&&(o=!0)),a||(a=await Zt.create(t.detBuffer,h)),t.useWebGpu!==!1&&(s=await hc(t.recBuffer,n,[1,3,48,64]),s&&(l=!0)),s||(s=await Zt.create(t.recBuffer,h)),cc=o||l?"webgpu":"wasm",Yr=a.inputNames.includes("orig_target_sizes")||a.inputNames.includes("images")||!!(t.modelId&&t.modelId.includes("comic"))?new oc(a):new uc(a),Zr=null,t.det2Buffer)try{const f=await Zt.create(t.det2Buffer,h);Zr=new uc(f,{thresh:.3,boxThresh:.35,unclipRatio:1.3})}catch(f){console.warn("[OCR Worker] Supplementary det session failed:",f)}Un=new $r(s,t.keysText,{isCjkModel:/japan|korean|chinese|cjk/i.test(t.modelId??"")}),dc=t.modelId||"loaded",i({type:"INIT_RESULT",success:!0,modelId:dc,backend:cc});break}case"PROCESS_IMAGE":{if(!Yr||!Un)throw new Error("Model PaddleOCR chưa được nạp. Hãy khởi tạo trước khi nhận diện.");if(!t.imageBitmap)throw new Error("Thiếu ImageBitmap cần nhận diện.");const n=t.imageBitmap;try{const a=n.width,s=n.height,o=new OffscreenCanvas(a,s),l=o.getContext("2d");if(!l)throw new Error("Không thể tạo 2D context trong Worker");l.drawImage(n,0,0);const d=performance.now(),h=Yr instanceof oc,p=new Float32Array(a*s),f=await Dn.detectWithSlicing(o,a,s,Yr,{aspectCap:h?s<=2200?.85:1.8:void 0,invertedPass:!0,textMapOut:p});if(Zr){const b=await Dn.detectWithSlicing(o,a,s,Zr,{textMapOut:p});for(const S of b)if(!f.some(T=>Dn.calculateIoU(T,S)>.5))if(S.height>=34&&S.width>=28){const T=ea.segmentLines(l,S,a,s);for(const E of T)f.push({...E,kind:"free"})}else f.push({...S,kind:"free"});f.sort((S,I)=>S.y-I.y)}const _=[];for(const b of f)if(b.kind!=="free"&&b.height>=50&&b.height>b.width*.4){const S=ea.segmentLines(l,b,a,s);for(const I of S)_.push({...I,kind:b.kind})}else _.push(b);f.length=0,f.push(..._),f.sort((b,S)=>b.y-S.y);const m=performance.now()-d,w=performance.now(),x=await Un.recognizeBoxes(o,f),$=performance.now()-w;Ry(o,x,p),i({type:"PROCESS_RESULT",success:!0,elementId:t.elementId,dialogues:x,timings:{detMs:Math.round(m),recMs:Math.round($),boxCount:f.length}})}finally{n.close()}break}default:throw new Error(`Thông điệp worker không hỗ trợ: ${t.type}`)}}catch(n){console.error("[OCR Worker] Processing error:",n),i({type:"ERROR",success:!1,elementId:t.elementId,error:`${n?.message||"Lỗi không xác định trong Web Worker"}${n?.stack?`
`+n.stack:""}`})}}).catch(n=>{console.error("[OCR Worker] Fatal queue error:",n),i({type:"ERROR",success:!1,error:`Fatal queue error: ${n?.message||n}`})})};function Ry(e,t,r){const i=e.getContext("2d");if(!i)return;const n=4;for(const a of t){const s=Math.max(0,a.box.x-n),o=Math.max(0,a.box.y-n),l=Math.min(e.width-s,a.box.width+n*2),d=Math.min(e.height-o,a.box.height+n*2);if(!(l<4||d<4))try{const h=i.getImageData(s,o,l,d),p=ui.buildPatch(h,s,o,a.bgColor,r,e.width);p&&(a.erasePatch=p)}catch{}}try{const a=l0.aggregateDialogues(t,e.width,e.height),s=new Map(t.map(o=>[o.box,o]));for(const o of a){const l=Math.max(0,o.box.x-8),d=Math.max(0,o.box.y-8),h=Math.min(e.width-l,o.box.width+16),p=Math.min(e.height-d,o.box.height+16);if(h<12||p<12)continue;const f=i.getImageData(l,d,h,p),_=Oy.buildBubblePatch(f,l,d,o.lineBoxes);if(_)for(const m of o.lineBoxes||[]){const w=s.get(m);w&&(w.bubblePatch=_)}}}catch{}}self.addEventListener("error",e=>{console.error("[OCR Worker] Global error:",e),self.postMessage({type:"ERROR",success:!1,error:`Worker GlobalError: ${e.message||String(e)}`})});self.addEventListener("unhandledrejection",e=>{console.error("[OCR Worker] Unhandled rejection:",e),self.postMessage({type:"ERROR",success:!1,error:`Worker UnhandledRejection: ${e.reason?.message||String(e.reason)}`})});
