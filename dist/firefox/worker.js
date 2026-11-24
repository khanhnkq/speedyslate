import{V as Lo,B as B0}from"./assets/bubble-aggregator.js";/*!
 * ONNX Runtime Web v1.31.1
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */var ha=Object.defineProperty,R0=Object.getOwnPropertyDescriptor,D0=Object.getOwnPropertyNames,N0=Object.prototype.hasOwnProperty,U0=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),J=(e,t,r)=>()=>{if(r)throw r[0];try{return e&&(t=e(e=0)),t}catch(i){throw r=[i],i}},or=(e,t)=>{for(var r in t)ha(e,r,{get:t[r],enumerable:!0})},P0=(e,t,r,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of D0(t))!N0.call(e,n)&&n!==r&&ha(e,n,{get:()=>t[n],enumerable:!(i=R0(t,n))||i.enumerable});return e},Er=e=>P0(ha({},"__esModule",{value:!0}),e),Zt,ft,Li,Jt,Wi,Mc,Oc,fa=J(()=>{"use strict";Zt=new Map,ft=[],Li=new WeakMap,Jt=(e,t,r)=>{if(t&&typeof t.init=="function"&&typeof t.createInferenceSessionHandler=="function"){let i=Zt.get(e);if(i===void 0)Zt.set(e,{backend:t,priority:r});else{if(i.priority>r)return;if(i.priority===r&&i.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${r}`)}if(r>=0){let n=ft.indexOf(e);n!==-1&&ft.splice(n,1);for(let a=0;a<ft.length;a++)if(Zt.get(ft[a]).priority<=r){ft.splice(a,0,e);return}ft.push(e)}return}throw new TypeError("not a valid backend")},Wi=async e=>{let t=Zt.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;if(t.aborted)return t.error;{let r=!!t.initPromise;try{if(!r){let i=t.backend,n=Li.get(i);t.initPromise=n?n.then(async()=>i.init(e),async()=>i.init(e)):i.init(e),Li.set(i,t.initPromise)}return await t.initPromise,t.initialized=!0,t.backend}catch(i){return r||(t.error=`${i}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},Mc=async e=>{let t=e.executionProviders||[],r=t.map(u=>typeof u=="string"?u:u.name),i=r.length===0?ft:r,n,a=[],s=new Set;for(let u of i){let d=await Wi(u);typeof d=="string"?a.push({name:u,err:d}):(n||(n=d),n===d&&s.add(u))}if(!n)throw new Error(`no available backend found. ERR: ${a.map(u=>`[${u.name}] ${u.err}`).join(", ")}`);for(let{name:u,err:d}of a)r.includes(u)&&console.warn(`removing requested execution provider "${u}" from session options because it is not available: ${d}`);let o=t.filter(u=>s.has(typeof u=="string"?u:u.name));return[n,new Proxy(e,{get:(u,d)=>d==="executionProviders"?o:Reflect.get(u,d)})]},Oc=async()=>{let e=[];for(let r of ft){if(typeof Zt.get(r).backend.createLoraAdapterHandler!="function")continue;let i=await Wi(r);if(typeof i!="string")return i;e.push({name:r,err:i})}let t=e.length===0?"":` ERR: ${e.map(r=>`[${r.name}] ${r.err}`).join(", ")}`;throw new Error(`no available backend supports LoRA adapters.${t}`)}}),L0=J(()=>{"use strict";fa()}),Bc,W0=J(()=>{"use strict";Bc="1.31.1"}),qi,qe,Rc=J(()=>{"use strict";W0(),qi="warning",qe={wasm:{},webgl:{},webgpu:{},versions:{common:Bc},set logLevel(e){if(e!==void 0){if(typeof e!="string"||["verbose","info","warning","error","fatal"].indexOf(e)===-1)throw new Error(`Unsupported logging level: ${e}`);qi=e}},get logLevel(){return qi}},Object.defineProperty(qe,"logLevel",{enumerable:!0})}),Ee,q0=J(()=>{"use strict";Rc(),Ee=qe}),oi,Gi,Je,Ke,Lt,Wt,ma=J(()=>{"use strict";Rc(),oi=(e,t)=>{(typeof qe.trace>"u"?!qe.wasm.trace:!qe.trace)||console.timeStamp(`${e}::ORT::${t}`)},Gi=(e,t)=>{let r=new Error().stack?.split(/\r\n|\r|\n/g)||[],i=!1;for(let n=0;n<r.length;n++){if(i&&!r[n].includes("TRACE_FUNC")){let a=`FUNC_${e}::${r[n].trim().split(" ")[1]}`;t&&(a+=`::${t}`),oi("CPU",a);return}r[n].includes("TRACE_FUNC")&&(i=!0)}},Je=e=>{(typeof qe.trace>"u"?!qe.wasm.trace:!qe.trace)||Gi("BEGIN",e)},Ke=e=>{(typeof qe.trace>"u"?!qe.wasm.trace:!qe.trace)||Gi("END",e)},Lt=e=>{(typeof qe.trace>"u"?!qe.wasm.trace:!qe.trace)||console.time(`ORT::${e}`)},Wt=e=>{(typeof qe.trace>"u"?!qe.wasm.trace:!qe.trace)||console.timeEnd(`ORT::${e}`)}}),ga,Dc=J(()=>{"use strict";fa(),ma(),ga=class Nc{constructor(t,r){this.backend=t,this.handler=r}static async create(t){if(Je(),typeof t!="string"&&!(t instanceof Uint8Array))throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let r=await Oc(),i=await r.createLoraAdapterHandler(t);return Ke(),new Nc(r,i)}async release(){return this.handler.dispose()}}}),Uc,Pc,G0=J(()=>{"use strict";Uc=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);r.width=e.dims[3],r.height=e.dims[2];let i=r.getContext("2d");if(i!=null){let n,a;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(n=e.dims[2],a=e.dims[3]):(n=e.dims[3],a=e.dims[2]);let s=t?.format!==void 0?t.format:"RGB",o=t?.norm,u,d;o===void 0||o.mean===void 0?u=[255,255,255,255]:typeof o.mean=="number"?u=[o.mean,o.mean,o.mean,o.mean]:(u=[o.mean[0],o.mean[1],o.mean[2],0],o.mean[3]!==void 0&&(u[3]=o.mean[3])),o===void 0||o.bias===void 0?d=[0,0,0,0]:typeof o.bias=="number"?d=[o.bias,o.bias,o.bias,o.bias]:(d=[o.bias[0],o.bias[1],o.bias[2],0],o.bias[3]!==void 0&&(d[3]=o.bias[3]));let c=a*n,h=0,m=c,g=c*2,f=-1;s==="RGBA"?(h=0,m=c,g=c*2,f=c*3):s==="RGB"?(h=0,m=c,g=c*2):s==="RBG"&&(h=0,g=c,m=c*2);for(let $=0;$<a;$++)for(let v=0;v<n;v++){let b=(e.data[h++]-d[0])*u[0],w=(e.data[m++]-d[1])*u[1],k=(e.data[g++]-d[2])*u[2],S=f===-1?255:(e.data[f++]-d[3])*u[3];i.fillStyle="rgba("+b+","+w+","+k+","+S+")",i.fillRect(v,$,1,1)}if("toDataURL"in r)return r.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},Pc=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),i;if(r!=null){let n,a,s;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(n=e.dims[2],a=e.dims[1],s=e.dims[3]):(n=e.dims[3],a=e.dims[2],s=e.dims[1]);let o=t!==void 0&&t.format!==void 0?t.format:"RGB",u=t?.norm,d,c;u===void 0||u.mean===void 0?d=[255,255,255,255]:typeof u.mean=="number"?d=[u.mean,u.mean,u.mean,u.mean]:(d=[u.mean[0],u.mean[1],u.mean[2],255],u.mean[3]!==void 0&&(d[3]=u.mean[3])),u===void 0||u.bias===void 0?c=[0,0,0,0]:typeof u.bias=="number"?c=[u.bias,u.bias,u.bias,u.bias]:(c=[u.bias[0],u.bias[1],u.bias[2],0],u.bias[3]!==void 0&&(c[3]=u.bias[3]));let h=a*n;if(t!==void 0&&(t.format!==void 0&&s===4&&t.format!=="RGBA"||s===3&&t.format!=="RGB"&&t.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let m=4,g=0,f=1,$=2,v=3,b=0,w=h,k=h*2,S=-1;o==="RGBA"?(b=0,w=h,k=h*2,S=h*3):o==="RGB"?(b=0,w=h,k=h*2):o==="RBG"&&(b=0,k=h,w=h*2),i=r.createImageData(n,a);for(let T=0;T<a*n;g+=m,f+=m,$+=m,v+=m,T++)i.data[g]=(e.data[b++]-c[0])*d[0],i.data[f]=(e.data[w++]-c[1])*d[1],i.data[$]=(e.data[k++]-c[2])*d[2],i.data[v]=S===-1?255:(e.data[S++]-c[3])*d[3]}else throw new Error("Can not access image data");return i}}),Gr,Lc,Wc,qc,Gc,Vc,V0=J(()=>{"use strict";ya(),Gr=(e,t)=>{if(e===void 0)throw new Error("Image buffer must be defined");if(t.height===void 0||t.width===void 0)throw new Error("Image height and width must be defined");if(t.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:r,width:i}=t,n=t.norm??{mean:255,bias:0},a,s;typeof n.mean=="number"?a=[n.mean,n.mean,n.mean,n.mean]:a=[n.mean[0],n.mean[1],n.mean[2],n.mean[3]??255],typeof n.bias=="number"?s=[n.bias,n.bias,n.bias,n.bias]:s=[n.bias[0],n.bias[1],n.bias[2],n.bias[3]??0];let o=t.format!==void 0?t.format:"RGBA",u=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",d=r*i,c=u==="RGBA"?new Float32Array(d*4):new Float32Array(d*3),h=4,m=0,g=1,f=2,$=3,v=0,b=d,w=d*2,k=-1;o==="RGB"&&(h=3,m=0,g=1,f=2,$=-1),u==="RGBA"?k=d*3:u==="RBG"?(v=0,w=d,b=d*2):u==="BGR"&&(w=0,b=d,v=d*2);for(let S=0;S<d;S++,m+=h,f+=h,g+=h,$+=h)c[v++]=(e[m]+s[0])/a[0],c[b++]=(e[g]+s[1])/a[1],c[w++]=(e[f]+s[2])/a[2],k!==-1&&$!==-1&&(c[k++]=(e[$]+s[3])/a[3]);return u==="RGBA"?new je("float32",c,[1,4,r,i]):new je("float32",c,[1,3,r,i])},Lc=async(e,t)=>{let r=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,i=typeof ImageData<"u"&&e instanceof ImageData,n=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,a=typeof e=="string",s,o=t??{},u=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},d=c=>typeof HTMLCanvasElement<"u"&&c instanceof HTMLCanvasElement||c instanceof OffscreenCanvas?c.getContext("2d"):null;if(r){let c=u();c.width=e.width,c.height=e.height;let h=d(c);if(h!=null){let m=e.height,g=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(m=t.resizedHeight,g=t.resizedWidth),t!==void 0){if(o=t,t.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");o.tensorFormat="RGBA",o.height=m,o.width=g}else o.tensorFormat="RGBA",o.height=m,o.width=g;h.drawImage(e,0,0),s=h.getImageData(0,0,g,m).data}else throw new Error("Can not access image data")}else if(i){let c,h;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(c=t.resizedHeight,h=t.resizedWidth):(c=e.height,h=e.width),t!==void 0&&(o=t),o.format="RGBA",o.height=c,o.width=h,t!==void 0){let m=u();m.width=h,m.height=c;let g=d(m);if(g!=null)g.putImageData(e,0,0),s=g.getImageData(0,0,h,c).data;else throw new Error("Can not access image data")}else s=e.data}else if(n){if(t===void 0)throw new Error("Please provide image config with format for Imagebitmap");let c=u();c.width=e.width,c.height=e.height;let h=d(c);if(h!=null){let m=e.height,g=e.width;return h.drawImage(e,0,0,g,m),s=h.getImageData(0,0,g,m).data,o.height=m,o.width=g,Gr(s,o)}else throw new Error("Can not access image data")}else{if(a)return new Promise((c,h)=>{let m=u(),g=d(m);if(!e||!g)return h();let f=new Image;f.crossOrigin="Anonymous",f.src=e,f.onload=()=>{m.width=f.width,m.height=f.height,g.drawImage(f,0,0,m.width,m.height);let $=g.getImageData(0,0,m.width,m.height);o.height=m.height,o.width=m.width,c(Gr($.data,o))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(s!==void 0)return Gr(s,o);throw new Error("Input data provided is not supported - aborted tensor creation")},Wc=(e,t)=>{let{width:r,height:i,download:n,dispose:a}=t,s=[1,i,r,4];return new je({location:"texture",type:"float32",texture:e,dims:s,download:n,dispose:a})},qc=(e,t)=>{let{dataType:r,dims:i,download:n,dispose:a}=t;return new je({location:"gpu-buffer",type:r??"float32",gpuBuffer:e,dims:i,download:n,dispose:a})},Gc=(e,t)=>{let{dataType:r,dims:i,download:n,dispose:a}=t;return new je({location:"ml-tensor",type:r??"float32",mlTensor:e,dims:i,download:n,dispose:a})},Vc=(e,t,r)=>new je({location:"cpu-pinned",type:e,data:t,dims:r??[t.length]})}),Nt,xr,Vi,Hc,H0=J(()=>{"use strict";Nt=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),xr=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),Vi=!1,Hc=()=>{if(!Vi){Vi=!0;let e=typeof BigInt64Array<"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,r=globalThis.Float16Array,i=typeof r<"u"&&r.from;e&&(Nt.set("int64",BigInt64Array),xr.set(BigInt64Array,"int64")),t&&(Nt.set("uint64",BigUint64Array),xr.set(BigUint64Array,"uint64")),i?(Nt.set("float16",r),xr.set(r,"float16")):Nt.set("float16",Uint16Array)}}}),Fc,jc,F0=J(()=>{"use strict";ya(),Fc=e=>{let t=1;for(let r=0;r<e.length;r++){let i=e[r];if(typeof i!="number"||!Number.isSafeInteger(i))throw new TypeError(`dims[${r}] must be an integer, got: ${i}`);if(i<0)throw new RangeError(`dims[${r}] must be a non-negative integer, got: ${i}`);t*=i}return t},jc=(e,t)=>{switch(e.location){case"cpu":return new je(e.type,e.data,t);case"cpu-pinned":return new je({location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new je({location:"texture",texture:e.texture,type:e.type,dims:t});case"gpu-buffer":return new je({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"ml-tensor":return new je({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),je,ya=J(()=>{"use strict";G0(),V0(),H0(),F0(),je=class{constructor(e,t,r){Hc();let i,n;if(typeof e=="object"&&"location"in e)switch(this.dataLocation=e.location,i=e.type,n=e.dims,e.location){case"cpu-pinned":{let s=Nt.get(i);if(!s)throw new TypeError(`unsupported type "${i}" to create tensor from pinned buffer`);if(!(e.data instanceof s))throw new TypeError(`buffer should be of type ${s.name}`);this.cpuData=e.data;break}case"texture":{if(i!=="float32")throw new TypeError(`unsupported type "${i}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break}case"gpu-buffer":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break}case"ml-tensor":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint64"&&i!=="int8"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let s,o;if(typeof e=="string")if(i=e,o=r,e==="string"){if(!Array.isArray(t))throw new TypeError("A string tensor's data must be a string array.");s=t}else{let u=Nt.get(e);if(u===void 0)throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e==="float16"&&u===Uint16Array||e==="uint4"||e==="int4")throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${u.name} as data.`);e==="uint64"||e==="int64"?s=u.from(t,BigInt):s=u.from(t)}else if(t instanceof u)s=t;else if(t instanceof Uint8ClampedArray)if(e==="uint8")s=Uint8Array.from(t);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(e==="float16"&&t instanceof Uint16Array&&u!==Uint16Array)s=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw new TypeError(`A ${i} tensor's data must be type of ${u}`)}else if(o=t,Array.isArray(e)){if(e.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let u=typeof e[0];if(u==="string")i="string",s=e;else if(u==="boolean")i="bool",s=Uint8Array.from(e);else throw new TypeError(`Invalid element type of data array: ${u}.`)}else if(e instanceof Uint8ClampedArray)i="uint8",s=Uint8Array.from(e);else{let u=xr.get(e.constructor);if(u===void 0)throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);i=u,s=e}if(o===void 0)o=[s.length];else if(!Array.isArray(o))throw new TypeError("A tensor's dims must be a number array");n=o,this.cpuData=s,this.dataLocation="cpu"}let a=Fc(n);if(this.cpuData&&a!==this.cpuData.length&&!((i==="uint4"||i==="int4")&&Math.ceil(a/2)===this.cpuData.length))throw new Error(`Tensor's size(${a}) does not match data length(${this.cpuData.length}).`);this.type=i,this.dims=n,this.size=a}static async fromImage(e,t){return Lc(e,t)}static fromTexture(e,t){return Wc(e,t)}static fromGpuBuffer(e,t){return qc(e,t)}static fromMLTensor(e,t){return Gc(e,t)}static fromPinnedBuffer(e,t,r){return Vc(e,t,r)}toDataURL(e){return Uc(this,e)}toImageData(e){return Pc(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return jc(this,e)}}}),Ve,Kc=J(()=>{"use strict";ya(),Ve=je}),Zc,j0=J(()=>{"use strict";fa(),Dc(),Kc(),ma(),Zc=class Yc{constructor(t,r){this.handler=t,this.backend=r}async run(t,r,i){Je(),Lt("InferenceSession.run");let n={},a={};if(typeof t!="object"||t===null||t instanceof Ve||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let s=!0;if(typeof r=="object"){if(r===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(r instanceof Ve)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(r)){if(r.length===0)throw new TypeError("'fetches' cannot be an empty array.");s=!1;for(let c of r){if(typeof c!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(c)===-1)throw new RangeError(`'fetches' contains invalid output name: ${c}.`);n[c]=null}if(typeof i=="object"&&i!==null)a=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else{let c=!1,h=Object.getOwnPropertyNames(r);for(let m of this.outputNames)if(h.indexOf(m)!==-1){let g=r[m];(g===null||g instanceof Ve)&&(c=!0,s=!1,n[m]=g)}if(c){if(typeof i=="object"&&i!==null)a=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else a=r}}else if(typeof r<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let c of this.inputNames)if(typeof t[c]>"u")throw new Error(`input '${c}' is missing in 'feeds'.`);if(s)for(let c of this.outputNames)n[c]=null;let o;if(a.activeLoraAdapters!==void 0){if(!Array.isArray(a.activeLoraAdapters))throw new TypeError("'activeLoraAdapters' must be an array.");o=a.activeLoraAdapters.map(c=>{if(!(c instanceof ga))throw new TypeError("'activeLoraAdapters' must be an array of LoraAdapter objects.");if(c.backend!==this.backend)throw new Error("LoRA adapter was created by a different backend than the session.");return c.handler})}let u=await this.handler.run(t,n,a,o),d={};for(let c in u)if(Object.hasOwnProperty.call(u,c)){let h=u[c];h instanceof Ve?d[c]=h:d[c]=new Ve(h.type,h.data,h.dims)}return Wt("InferenceSession.run"),Ke(),d}async release(){return this.handler.dispose()}static async create(t,r,i,n){Je(),Lt("InferenceSession.create");let a,s={};if(typeof t=="string"){if(a=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof Uint8Array){if(a=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&t instanceof SharedArrayBuffer){let c=t,h=0,m=t.byteLength;if(typeof r=="object"&&r!==null)s=r;else if(typeof r=="number"){if(h=r,!Number.isSafeInteger(h))throw new RangeError("'byteOffset' must be an integer.");if(h<0||h>=c.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${c.byteLength}).`);if(m=t.byteLength-h,typeof i=="number"){if(m=i,!Number.isSafeInteger(m))throw new RangeError("'byteLength' must be an integer.");if(m<=0||h+m>c.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${c.byteLength-h}].`);if(typeof n=="object"&&n!==null)s=n;else if(typeof n<"u")throw new TypeError("'options' must be an object.")}else if(typeof i<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof r<"u")throw new TypeError("'options' must be an object.");a=new Uint8Array(c,h,m)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[o,u]=await Mc(s),d=await o.createInferenceSessionHandler(a,u);return Wt("InferenceSession.create"),Ke(),new Yc(d,o)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),rr,K0=J(()=>{"use strict";j0(),rr=Zc}),Qc,Z0=J(()=>{"use strict";Dc(),Qc=ga}),Y0=J(()=>{"use strict"}),Q0=J(()=>{"use strict"}),X0=J(()=>{"use strict"}),J0=J(()=>{"use strict"}),ey={};or(ey,{InferenceSession:()=>rr,LoraAdapter:()=>Qc,TRACE:()=>oi,TRACE_EVENT_BEGIN:()=>Lt,TRACE_EVENT_END:()=>Wt,TRACE_FUNC_BEGIN:()=>Je,TRACE_FUNC_END:()=>Ke,Tensor:()=>Ve,env:()=>Ee,registerBackend:()=>Jt});var Ye=J(()=>{"use strict";L0(),q0(),K0(),Z0(),Kc(),Y0(),Q0(),ma(),X0(),J0()}),wa=J(()=>{"use strict"}),Xc={};or(Xc,{default:()=>Jc});var Hi,Fi,Jc,ty=J(()=>{"use strict";lm(),Ht(),_a(),Hi="ort-wasm-proxy-worker",Fi=globalThis.self?.name===Hi,Fi&&(self.onmessage=e=>{let{type:t,in:r}=e.data;try{switch(t){case"init-wasm":ba(r.wasm).then(()=>{Na(r).then(()=>{postMessage({type:t})},i=>{postMessage({type:t,err:i})})},i=>{postMessage({type:t,err:i})});break;case"init-ep":{let{epName:i,env:n}=r;Ua(n,i).then(()=>{postMessage({type:t})},a=>{postMessage({type:t,err:a})});break}case"copy-from":{let{buffer:i}=r,n=fi(i);postMessage({type:t,out:n});break}case"create":{let{model:i,options:n}=r;Pa(i,n).then(a=>{postMessage({type:t,out:a})},a=>{postMessage({type:t,err:a})});break}case"release":La(r),postMessage({type:t});break;case"run":{let{sessionId:i,inputIndices:n,inputs:a,outputIndices:s,options:o}=r;Wa(i,n,a,s,new Array(s.length).fill(null),o).then(u=>{u.some(d=>d[3]!=="cpu")?postMessage({type:t,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:t,out:u},Ga([...a,...u]))},u=>{postMessage({type:t,err:u})});break}case"end-profiling":qa(r),postMessage({type:t});break;default:}}catch(i){postMessage({type:t,err:i})}}),Jc=Fi?null:e=>new Worker(e??Fe,{type:"module",name:Hi})}),ep={};or(ep,{default:()=>tp});async function Wo(e={}){var t=e,r=!!globalThis.window,i=!!globalThis.WorkerGlobalScope,n=i&&self.name?.startsWith("em-pthread");t.mountExternalData=(l,p)=>{l.startsWith("./")&&(l=l.substring(2)),(t.jd||(t.jd=new Map)).set(l,p)},t.unmountExternalData=()=>{delete t.jd,delete t.ke,delete t.je,delete t.le},globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,shared:!0}).buffer.constructor;let a=l=>async(...p)=>{try{if(t.hd)throw Error("Session already started");let _=t.hd={Vd:p[0],errors:[]},y=await l(...p);if(t.hd!==_)throw Error("Session mismatch");t.pd?.flush();let I=_.errors;if(0<I.length){let z=await Promise.all(I);if(z=z.filter(B=>B),0<z.length)throw Error(z.join(`
`))}return y}finally{t.hd=null}};t.jsepInit=(l,p)=>{if(l==="webgpu"){[t.pd,t.Ld,t.Pd,t.rd,t.Od,t.ic,t.Qd,t.Sd,t.Md,t.Nd,t.Rd]=p;let _=t.pd;t.jsepRegisterBuffer=(y,I,z,B)=>_.registerBuffer(y,I,z,B),t.jsepGetBuffer=y=>_.getBuffer(y),t.jsepCreateDownloader=(y,I,z)=>_.createDownloader(y,I,z),t.jsepOnCreateSession=y=>{_.onCreateSession(y)},t.jsepOnReleaseSession=y=>{_.onReleaseSession(y)},t.jsepOnRunStart=y=>_.onRunStart(y),t.Td=(y,I)=>{_.upload(y,I)}}else if(l==="webnn"){let _=p[0];[t.ce,t.Cd,t.webnnEnsureTensor,t.Dd,t.webnnDownloadTensor,t.be,t.webnnEnableTraceEvent]=p.slice(1),t.webnnReleaseTensorId=t.Cd,t.webnnUploadTensor=t.Dd,t.webnnRegisterMLContext=t.be,t.webnnOnRunStart=y=>_.onRunStart(y),t.webnnOnRunEnd=_.onRunEnd.bind(_),t.webnnOnReleaseSession=y=>{_.onReleaseSession(y)},t.webnnCreateMLTensorDownloader=(y,I)=>_.createMLTensorDownloader(y,I),t.webnnRegisterMLTensor=(y,I,z,B)=>_.registerMLTensor(y,I,z,B),t.webnnCreateMLContext=y=>_.createMLContext(y),t.webnnRegisterGraphInput=_.registerGraphInput.bind(_),t.webnnIsGraphInput=_.isGraphInput.bind(_),t.webnnRegisterGraphOutput=_.registerGraphOutput.bind(_),t.webnnIsGraphOutput=_.isGraphOutput.bind(_),t.webnnCreateTemporaryTensor=_.createTemporaryTensor.bind(_),t.webnnIsGraphInputOutputTypeSupported=_.isGraphInputOutputTypeSupported.bind(_)}};let s=()=>{let l=p=>(..._)=>{let y=ut;return _=p(..._),ut!=y?new Promise((I,z)=>{Ii={resolve:I,reject:z}}):_};(p=>{for(let _ of p)t[_]=l(t[_])})("_OrtAppendExecutionProvider _OrtAppendExecutionProviderV2 _OrtCreateSession _OrtRun _OrtRunWithBinding _OrtBindInput".split(" ")),a!==void 0&&(t._OrtRun=a(t._OrtRun),t._OrtRunWithBinding=a(t._OrtRunWithBinding)),s=void 0};t.asyncInit=()=>{s?.()};var o,u,d=(l,p)=>{throw p},c=import.meta.url,h="";if(r||i){try{h=new URL(".",c).href}catch{}i&&(u=l=>{var p=new XMLHttpRequest;return p.open("GET",l,!1),p.responseType="arraybuffer",p.send(null),new Uint8Array(p.response)}),o=async l=>{if(C(l))return new Promise((_,y)=>{var I=new XMLHttpRequest;I.open("GET",l,!0),I.responseType="arraybuffer",I.onload=()=>{I.status==200||I.status==0&&I.response?_(I.response):y(I.status)},I.onerror=y,I.send(null)});var p=await fetch(l,{credentials:"same-origin"});if(p.ok)return p.arrayBuffer();throw Error(p.status+" : "+p.url)}}var m,g,f,$,v,b,w=console.log.bind(console),k=console.error.bind(console),S=w,T=k,E=!1,C=l=>l.startsWith("file://");function x(){bt.buffer!=U.buffer&&Q()}if(n){let l=function(p){try{var _=p.data,y=_.bd;if(y==="load"){let I=[];self.onmessage=z=>I.push(z),b=()=>{postMessage({bd:"loaded"});for(let z of I)l(z);self.onmessage=l};for(let z of _.Hd)t[z]&&!t[z].proxy||(t[z]=(...B)=>{postMessage({bd:"callHandler",Fd:z,args:B})},z=="print"&&(S=t[z]),z=="printErr"&&(T=t[z]));bt=_.Zd,Q(),g=_.$d,xe(),qr()}else if(y==="run"){(function(I){var z=(x(),G)[I+52>>>2>>>0];I=(x(),G)[I+56>>>2>>>0],js(z,z-I),_e(z)})(_.ad),Mi(_.ad,0,0,1,0,0),ja(),ki(_.ad),M||(Ws(),M=!0);try{km(_.Xd,_.nd)}catch(I){if(I!="unwind")throw I}}else _.target!=="setimmediate"&&(y==="checkMailbox"?M&&Rr():y&&(T(`worker: received unknown command ${y}`),T(_)))}catch(I){throw qs(),I}};var M=!1;self.onunhandledrejection=p=>{throw p.reason||p},self.onmessage=l}var U,O,D,V,A,G,F,L,re,ae,Y,N=!1;function Q(){var l=bt.buffer;t.HEAP8=U=new Int8Array(l),D=new Int16Array(l),t.HEAPU8=O=new Uint8Array(l),V=new Uint16Array(l),t.HEAP32=A=new Int32Array(l),t.HEAPU32=G=new Uint32Array(l),F=new Float32Array(l),L=new Float64Array(l),re=new BigInt64Array(l),ae=new BigUint64Array(l)}function K(){N=!0,n?b():ht.vb()}function ee(l){throw T(l="Aborted("+l+")"),E=!0,l=new WebAssembly.RuntimeError(l+". Build with -sASSERTIONS for more info."),v?.(l),l}function me(){return{a:{na:jg,jb:Fg,g:Sm,G:Tm,f:Im,o:Cm,h:Em,$:zm,b:Am,S:Mm,Ja,n:Om,aa:is,_a:ns,Fa:as,Ha:ss,$a:os,Ya:us,Ra:ls,Xa:ds,la:cs,Ga:ps,Da:hs,Za:fs,Ea:ms,eb:Bm,ga:Rm,ya:Dm,wa:Um,fa:Lm,N:Wm,I:qm,xa:Gm,_:Ym,za:Qm,Ua:Xm,Ba:eg,Ka:tg,ua:rg,ha:ig,Ta:ki,bb:ng,Q:ug,r:hg,c:vi,kb:fg,y:mg,M:gg,D:yg,m:wg,s:xs,lb:_g,J:bg,R:$g,j:vg,u:xg,q:kg,k:Sg,Oa:Tg,Pa:Ig,Qa:Cg,Ma:Is,Na:Cs,va:Es,gb:zg,db:Mg,v:Og,ba:Bg,ia:Rg,cb:Ag,V:Dg,ab:Ng,Ca:Ug,F:Eg,U:Pg,ma:Lr,Aa:Wg,ib:Lg,hb:qg,Va:Os,Wa:Bs,Ia:Pe,T:Rs,La:Ds,ka:Ns,Sa:Us,ja:Ps,nb:A0,oa:T0,ob:z0,pa:S0,H:f0,e:Qg,t:Zg,w:Kg,B:u0,pb:v0,Z:$0,x:t0,qa:x0,X:I0,ca:b0,qb:_0,ea:Jg,O:l0,sb:g0,ra:w0,tb:m0,L:p0,Y:k0,d:Yg,A:e0,l:Xg,mb:M0,p:i0,z:n0,C:r0,E:a0,K:d0,sa:h0,P:C0,da:c0,W:E0,ub:o0,ta:s0,rb:y0,i:Vg,a:bt,fb:le}}}async function xe(){function l(y,I){var z=ht=y.exports;y={};for(let[B,W]of Object.entries(z))typeof W=="function"?(z=ag(W),y[B]=z):y[B]=W;return ht=y,ht=(function(){var B=ht,W=se=>we=>se(we)>>>0,ie=se=>()=>se()>>>0;return(B=Object.assign({},B)).wb=W(B.wb),B.ec=ie(B.ec),B.gc=W(B.gc),B.uc=W(B.uc),B.vc=ie(B.vc),B.zc=W(B.zc),B})(),he.push(ht.hc),Ls=(y=ht).wb,Ws=y.xb,t._OrtInit=y.yb,t._OrtGetLastError=y.zb,t._OrtCreateSessionOptions=y.Ab,t._OrtAppendExecutionProvider=y.Bb,t._OrtGetEpDevices=y.Cb,t._OrtEpDevice_EpName=y.Db,t._OrtAppendExecutionProviderV2=y.Eb,t._OrtAddFreeDimensionOverride=y.Fb,t._OrtAddSessionConfigEntry=y.Gb,t._OrtReleaseSessionOptions=y.Hb,t._OrtCreateSession=y.Ib,t._OrtReleaseSession=y.Jb,t._OrtGetInputOutputCount=y.Kb,t._OrtGetInputOutputMetadata=y.Lb,t._OrtFree=y.Mb,t._OrtCreateTensor=y.Nb,t._OrtGetTensorData=y.Ob,t._OrtReleaseTensor=y.Pb,t._OrtCreateLoraAdapter=y.Qb,t._OrtReleaseLoraAdapter=y.Rb,t._OrtCreateRunOptions=y.Sb,t._OrtAddRunConfigEntry=y.Tb,t._OrtRunOptionsAddActiveLoraAdapter=y.Ub,t._OrtReleaseRunOptions=y.Vb,t._OrtCreateBinding=y.Wb,t._OrtBindInput=y.Xb,t._OrtBindOutput=y.Yb,t._OrtClearBoundOutputs=y.Zb,t._OrtReleaseBinding=y._b,t._OrtRunWithBinding=y.$b,t._OrtRun=y.ac,t._OrtEndProfiling=y.bc,t._JsepOutput=y.cc,t._JsepGetNodeName=y.dc,Wr=y.ec,lt=t._free=y.fc,lr=t._malloc=y.gc,Mi=y.jc,qs=y.kc,Gs=y.lc,Vs=y.mc,Oi=y.nc,Hs=y.oc,Fs=y.pc,$e=y.qc,dr=y.rc,js=y.sc,_e=y.tc,Bi=y.uc,be=y.vc,Ks=y.wc,Ri=y.xc,Zs=y.yc,Ys=y.zc,Qs=y.Ac,Di=y.Bc,Xs=y.Cc,Js=y.Dc,eo=y.Ec,to=y.Fc,ro=y.Gc,io=y.Hc,no=y.Ic,ao=y.Jc,so=y.Kc,oo=y.Lc,uo=y.Mc,lo=y.Nc,co=y.Oc,po=y.Pc,ho=y.Qc,fo=y.Rc,mo=y.Sc,go=y.Tc,yo=y.Uc,wo=y.Vc,_o=y.Wc,bo=y.Xc,$o=y.Yc,vo=y._c,xo=y.$c,ko=y.kd,So=y.ld,To=y.qd,Io=y.vd,Co=y.wd,Eo=y.xd,zo=y.yd,Ao=y.zd,Mo=y.Ad,Oo=y.Bd,Bo=y.Gd,Ro=y.Jd,Do=y.fe,No=y.ge,Uo=y.he,Po=y.ie,g=I,ht}var p,_=me();return t.instantiateWasm?new Promise(y=>{t.instantiateWasm(_,(I,z)=>{y(l(I,z))})}):n?l(new WebAssembly.Instance(g,me()),g):(Y??=t.locateFile?t.locateFile?t.locateFile("ort-wasm-simd-threaded.jsep.wasm",h):h+"ort-wasm-simd-threaded.jsep.wasm":new URL("/assets/ort-wasm-simd-threaded.jsep.wasm",import.meta.url).href,p=await(async function(y){var I=Y;if(!m&&!C(I))try{var z=fetch(I,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(z,y)}catch(B){T(`wasm streaming compile failed: ${B}`),T("falling back to ArrayBuffer instantiation")}return(async function(B,W){try{var ie=await(async function(se){if(!m)try{var we=await o(se);return new Uint8Array(we)}catch{}if(se==Y&&m)se=new Uint8Array(m);else{if(!u)throw"both async and sync fetching of the wasm failed";se=u(se)}return se})(B);return await WebAssembly.instantiate(ie,W)}catch(se){T(`failed to asynchronously prepare wasm: ${se}`),ee(se)}})(I,y)})(_),l(p.instance,p.module))}class Z{name="ExitStatus";constructor(p){this.message=`Program terminated with exit(${p})`,this.status=p}}var te=l=>{l.terminate(),l.onmessage=()=>{}},ne=[],X=0,oe=null,pe=l=>{De.length==0&&(Za(),Ka(De[0]));var p=De.pop();if(!p)return 6;j.push(p),ve[l.ad]=p,p.ad=l.ad;var _={bd:"run",Xd:l.Wd,nd:l.nd,ad:l.ad};return p.postMessage(_,l.ud),0},R=0,H=(l,p,..._)=>{var y,I=16*_.length,z=be(),B=Bi(I),W=B>>>3;for(y of _)typeof y=="bigint"?((x(),re)[W++>>>0]=1n,(x(),re)[W++>>>0]=y):((x(),re)[W++>>>0]=0n,(x(),L)[W++>>>0]=y);return l=Gs(l,0,I,B,p),_e(z),l};function le(l){if(n)return H(0,1,l);if(f=l,!(0<R)){for(var p of j)te(p);for(p of De)te(p);De=[],j=[],ve={},E=!0}d(0,new Z(l))}function Me(l){if(n)return H(1,0,l);Pe(l)}var Pe=l=>{if(f=l,n)throw Me(l),"unwind";le(l)},De=[],j=[],he=[],ve={},Fa=l=>{var p=l.ad;delete ve[p],De.push(l),j.splice(j.indexOf(l),1),l.ad=0,Vs(p)};function ja(){he.forEach(l=>l())}var Ka=l=>new Promise(p=>{l.onmessage=I=>{var z=I.data;if(I=z.bd,z.md&&z.md!=Wr()){var B=ve[z.md];B?B.postMessage(z,z.ud):T(`Internal error! Worker sent a message "${I}" to target pthread ${z.md}, but that thread no longer exists!`)}else I==="checkMailbox"?Rr():I==="spawnThread"?pe(z):I==="cleanupThread"?Br(()=>{Fa(ve[z.Yd])}):I==="loaded"?(l.loaded=!0,p(l)):z.target==="setimmediate"?l.postMessage(z):I==="uncaughtException"?l.onerror(z.error):I==="callHandler"?t[z.Fd](...z.args):I&&T(`worker sent an unknown command ${I}`)},l.onerror=I=>{throw T(`worker sent an error! ${I.filename}:${I.lineno}: ${I.message}`),I};var _,y=[];for(_ of[])t.propertyIsEnumerable(_)&&y.push(_);l.postMessage({bd:"load",Hd:y,Zd:bt,$d:g})});function Za(){var l=new Worker((()=>{let p=URL;return import.meta.url>"file:"&&import.meta.url<"file;"?new p("ort.bundle.min.mjs",import.meta.url):new URL(import.meta.url)})(),{type:"module",workerData:"em-pthread",name:"em-pthread"});De.push(l)}var bt,km=(l,p)=>{R=0,l=Di(l,p),0<R?f=l:Oi(l)},Ar=[],Mr=0;function Sm(l){var p=new wi(l>>>=0);return(x(),U)[p.cd+12>>>0]==0&&(Ya(p,!0),Mr--),Qa(p,!1),Ar.push(p),Ys(l)}var jt=0,Tm=()=>{$e(0,0);var l=Ar.pop();Ks(l.od),jt=0};function Ya(l,p){p=p?1:0,(x(),U)[l.cd+12>>>0]=p}function Qa(l,p){p=p?1:0,(x(),U)[l.cd+13>>>0]=p}class wi{constructor(p){this.od=p,this.cd=p-24}}var _i=l=>{var p=jt;if(!p)return dr(0),0;var _=new wi(p);(x(),G)[_.cd+16>>>2>>>0]=p;var y=(x(),G)[_.cd+4>>>2>>>0];if(!y)return dr(0),p;for(var I of l){if(I===0||I===y)break;if(Zs(I,y,_.cd+16))return dr(I),p}return dr(y),p};function Im(){return _i([])}function Cm(l){return _i([l>>>0])}function Em(l,p,_,y){return _i([l>>>0,p>>>0,_>>>0,y>>>0])}var zm=()=>{var l=Ar.pop();l||ee("no exception to throw");var p=l.od;throw(x(),U)[l.cd+13>>>0]==0&&(Ar.push(l),Qa(l,!0),Ya(l,!1),Mr++),Ri(p),jt=p};function Am(l,p,_){var y=new wi(l>>>=0);throw p>>>=0,_>>>=0,(x(),G)[y.cd+16>>>2>>>0]=0,(x(),G)[y.cd+4>>>2>>>0]=p,(x(),G)[y.cd+8>>>2>>>0]=_,Ri(l),Mr++,jt=l}var Mm=()=>Mr;function Xa(l,p,_,y){return n?H(2,1,l,p,_,y):Ja(l,p,_,y)}function Ja(l,p,_,y){if(l>>>=0,p>>>=0,_>>>=0,y>>>=0,!globalThis.SharedArrayBuffer)return 6;var I=[];return n&&I.length===0?Xa(l,p,_,y):(l={Wd:_,ad:l,nd:y,ud:I},n?(l.bd="spawnThread",postMessage(l,I),0):pe(l))}function Om(l){throw jt||=l>>>0,jt}var es=globalThis.TextDecoder&&new TextDecoder,ts=(l,p,_,y)=>{if(_=p+_,y)return _;for(;l[p]&&!(p>=_);)++p;return p},rs=(l,p=0,_,y)=>{if(16<(_=ts(l,p>>>=0,_,y))-p&&l.buffer&&es)return es.decode(l.buffer instanceof ArrayBuffer?l.subarray(p,_):l.slice(p,_));for(y="";p<_;){var I=l[p++];if(128&I){var z=63&l[p++];if((224&I)==192)y+=String.fromCharCode((31&I)<<6|z);else{var B=63&l[p++];65536>(I=(240&I)==224?(15&I)<<12|z<<6|B:(7&I)<<18|z<<12|B<<6|63&l[p++])?y+=String.fromCharCode(I):(I-=65536,y+=String.fromCharCode(55296|I>>10,56320|1023&I))}}else y+=String.fromCharCode(I)}return y},Ue=(l,p,_)=>(l>>>=0)?rs((x(),O),l,p,_):"";function is(l,p,_){return n?H(3,1,l,p,_):0}function ns(l,p){if(n)return H(4,1,l,p)}function as(l,p){if(n)return H(5,1,l,p)}function ss(l,p,_){if(n)return H(6,1,l,p,_)}function os(l,p,_){return n?H(7,1,l,p,_):0}function us(l,p){if(n)return H(8,1,l,p)}function ls(l,p,_){if(n)return H(9,1,l,p,_)}function ds(l,p,_,y){if(n)return H(10,1,l,p,_,y)}function cs(l,p,_,y){if(n)return H(11,1,l,p,_,y)}function ps(l,p,_,y){if(n)return H(12,1,l,p,_,y)}function hs(l){if(n)return H(13,1,l)}function fs(l,p){if(n)return H(14,1,l,p)}function ms(l,p,_){if(n)return H(15,1,l,p,_)}var Bm=()=>ee(""),ot=l=>{l>>>=0;for(var p="";;){var _=(x(),O)[l++>>>0];if(!_)return p;p+=String.fromCharCode(_)}},bi={},$i={},Kt=class extends Error{constructor(l){super(l),this.name="BindingError"}};function pt(l,p,_={}){return(function(y,I,z={}){var B=I.name;if(!y)throw new Kt(`type "${B}" must have a positive integer typeid pointer`);if($i.hasOwnProperty(y)){if(z.Id)return;throw new Kt(`Cannot register type '${B}' twice`)}$i[y]=I,bi.hasOwnProperty(y)&&(I=bi[y],delete bi[y],I.forEach(W=>W()))})(l,p,_)}var gs=(l,p,_)=>{switch(p){case 1:return _?y=>(x(),U)[y>>>0]:y=>(x(),O)[y>>>0];case 2:return _?y=>(x(),D)[y>>>1>>>0]:y=>(x(),V)[y>>>1>>>0];case 4:return _?y=>(x(),A)[y>>>2>>>0]:y=>(x(),G)[y>>>2>>>0];case 8:return _?y=>(x(),re)[y>>>3>>>0]:y=>(x(),ae)[y>>>3>>>0];default:throw new TypeError(`invalid integer width (${p}): ${l}`)}};function Rm(l,p,_,y,I){l>>>=0,_>>>=0,p=ot(p>>>0);let z=B=>B;if(y=y===0n){let B=8*_;z=W=>BigInt.asUintN(B,W),I=z(I)}pt(l,{name:p,Zc:z,ed:(B,W)=>(typeof W=="number"&&(W=BigInt(W)),W),dd:gs(p,_,!y),gd:null})}function Dm(l,p,_,y){pt(l>>>=0,{name:p=ot(p>>>0),Zc:function(I){return!!I},ed:function(I,z){return z?_:y},dd:function(I){return this.Zc((x(),O)[I>>>0])},gd:null})}var ys=[],Et=[0,1,,1,null,1,!0,1,!1,1];function vi(l){9<(l>>>=0)&&--Et[l+1]===0&&(Et[l]=void 0,ys.push(l))}var Qe=l=>{if(!l)throw new Kt(`Cannot use deleted val. handle = ${l}`);return Et[l]},et=l=>{switch(l){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let p=ys.pop()||Et.length;return Et[p]=l,Et[p+1]=1,p}};function xi(l){return this.Zc((x(),G)[l>>>2>>>0])}var Nm={name:"emscripten::val",Zc:l=>{var p=Qe(l);return vi(l),p},ed:(l,p)=>et(p),dd:xi,gd:null};function Um(l){return pt(l>>>0,Nm)}var Pm=(l,p)=>{switch(p){case 4:return function(_){return this.Zc((x(),F)[_>>>2>>>0])};case 8:return function(_){return this.Zc((x(),L)[_>>>3>>>0])};default:throw new TypeError(`invalid float width (${p}): ${l}`)}};function Lm(l,p,_){_>>>=0,pt(l>>>=0,{name:p=ot(p>>>0),Zc:y=>y,ed:(y,I)=>I,dd:Pm(p,_),gd:null})}function Wm(l,p,_,y,I){l>>>=0,_>>>=0,p=ot(p>>>0);let z=W=>W;if(y===0){var B=32-8*_;z=W=>W<<B>>>B,I=z(I)}pt(l,{name:p,Zc:z,ed:(W,ie)=>ie,dd:gs(p,_,y!==0),gd:null})}function qm(l,p,_){function y(z){var B=(x(),G)[z>>>2>>>0];return z=(x(),G)[z+4>>>2>>>0],new I((x(),U).buffer,z,B)}var I=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][p];pt(l>>>=0,{name:_=ot(_>>>0),Zc:y,dd:y},{Id:!0})}var $t=(l,p,_)=>{var y=(x(),O);if(p>>>=0,0<_){var I=p;_=p+_-1;for(var z=0;z<l.length;++z){var B=l.codePointAt(z);if(127>=B){if(p>=_)break;y[p++>>>0]=B}else if(2047>=B){if(p+1>=_)break;y[p++>>>0]=192|B>>6,y[p++>>>0]=128|63&B}else if(65535>=B){if(p+2>=_)break;y[p++>>>0]=224|B>>12,y[p++>>>0]=128|B>>6&63,y[p++>>>0]=128|63&B}else{if(p+3>=_)break;y[p++>>>0]=240|B>>18,y[p++>>>0]=128|B>>12&63,y[p++>>>0]=128|B>>6&63,y[p++>>>0]=128|63&B,z++}}y[p>>>0]=0,l=p-I}else l=0;return l},Or=l=>{for(var p=0,_=0;_<l.length;++_){var y=l.charCodeAt(_);127>=y?p++:2047>=y?p+=2:55296<=y&&57343>=y?(p+=4,++_):p+=3}return p};function Gm(l,p){pt(l>>>=0,{name:p=ot(p>>>0),Zc(_){var y=(x(),G)[_>>>2>>>0];return y=Ue(_+4,y,!0),lt(_),y},ed(_,y){y instanceof ArrayBuffer&&(y=new Uint8Array(y));var I=typeof y=="string";if(!(I||ArrayBuffer.isView(y)&&y.BYTES_PER_ELEMENT==1))throw new Kt("Cannot pass non-string to std::string");var z=I?Or(y):y.length,B=lr(4+z+1),W=B+4;return(x(),G)[B>>>2>>>0]=z,I?$t(y,W,z+1):(x(),O).set(y,W>>>0),_!==null&&_.push(lt,B),B},dd:xi,gd(_){lt(_)}})}var ws=globalThis.TextDecoder?new TextDecoder("utf-16le"):void 0,Vm=(l,p,_)=>{if(l>>>=1,16<(p=ts((x(),V),l,p/2,_))-l&&ws)return ws.decode((x(),V).slice(l,p));for(_="";l<p;++l){var y=(x(),V)[l>>>0];_+=String.fromCharCode(y)}return _},Hm=(l,p,_)=>{if(_??=2147483647,2>_)return 0;var y=p;_=(_-=2)<2*l.length?_/2:l.length;for(var I=0;I<_;++I){var z=l.charCodeAt(I);(x(),D)[p>>>1>>>0]=z,p+=2}return(x(),D)[p>>>1>>>0]=0,p-y},Fm=l=>2*l.length,jm=(l,p,_)=>{var y="";l>>>=2;for(var I=0;!(I>=p/4);I++){var z=(x(),G)[l+I>>>0];if(!z&&!_)break;y+=String.fromCodePoint(z)}return y},Km=(l,p,_)=>{if(p>>>=0,_??=2147483647,4>_)return 0;var y=p;_=y+_-4;for(var I=0;I<l.length;++I){var z=l.codePointAt(I);if(65535<z&&I++,(x(),A)[p>>>2>>>0]=z,(p+=4)+4>_)break}return(x(),A)[p>>>2>>>0]=0,p-y},Zm=l=>{for(var p=0,_=0;_<l.length;++_)65535<l.codePointAt(_)&&_++,p+=4;return p};function Ym(l,p,_){if(l>>>=0,p>>>=0,_=ot(_>>>=0),p===2)var y=Vm,I=Hm,z=Fm;else y=jm,I=Km,z=Zm;pt(l,{name:_,Zc:B=>{var W=(x(),G)[B>>>2>>>0];return W=y(B+4,W*p,!0),lt(B),W},ed:(B,W)=>{if(typeof W!="string")throw new Kt(`Cannot pass non-string to C++ string type ${_}`);var ie=z(W),se=lr(4+ie+p);return(x(),G)[se>>>2>>>0]=ie/p,I(W,se+4,ie+p),B!==null&&B.push(lt,se),se},dd:xi,gd(B){lt(B)}})}function Qm(l,p){pt(l>>>=0,{Kd:!0,name:p=ot(p>>>0),Zc:()=>{},ed:()=>{}})}function Xm(l){Mi(l>>>0,!i,1,!r,131072,!1),ja()}var Br=l=>{if(!E)try{if(l(),!(0<R))try{n?Wr()&&Oi(f):Pe(f)}catch(p){p instanceof Z||p=="unwind"||d(0,p)}}catch(p){p instanceof Z||p=="unwind"||d(0,p)}},Jm=!Atomics.waitAsync||globalThis.navigator?.userAgent&&91>Number((navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)||[])[2]);function ki(l){l>>>=0,Jm||(Atomics.waitAsync((x(),A),l>>>2,l).value.then(Rr),l+=128,Atomics.store((x(),A),l>>>2,1))}var Rr=()=>Br(()=>{var l=Wr();l&&(ki(l),Fs())});function eg(l,p){(l>>>=0)==p>>>0?setTimeout(Rr):n?postMessage({md:l,bd:"checkMailbox"}):(l=ve[l])&&l.postMessage({bd:"checkMailbox"})}var Si=[];function tg(l,p,_,y,I){for(p>>>=0,I>>>=0,Si.length=0,_=I>>>3,y=I+y>>>3;_<y;){var z;z=(x(),re)[_++>>>0]?(x(),re)[_++>>>0]:(x(),L)[_++>>>0],Si.push(z)}return(p?Ni[p]:Hg[l])(...Si)}var rg=()=>{R=0};function ig(l){l>>>=0,n?postMessage({bd:"cleanupThread",Yd:l}):Fa(ve[l])}function ng(l){}var Dr=l=>{try{l()}catch(p){ee(p)}};function ag(l){var p=(..._)=>{Nr.push(l);try{return l(..._)}finally{E||(Nr.pop(),ut&&vt===1&&Nr.length===0&&(vt=0,R+=1,Dr(No),typeof Fibers<"u"&&Fibers.ne()))}};return $s.set(l,p),p}var vt=0,ut=null,_s=0,Nr=[],Ti=new Map,bs=new Map,$s=new Map,sg=0,Ii=null,og=[],vs=l=>(function(p){if(!E){if(vt===0){var _=!1,y=!1;p((I=0)=>{if(!E&&(_s=I,_=!0,y)){vt=2,Dr(()=>Uo(ut)),typeof MainLoop<"u"&&MainLoop.Ed&&MainLoop.resume(),I=!1;try{var z=(function(){var ie=(x(),A)[ut+8>>>2>>>0];return ie=bs.get(ie),ie=$s.get(ie),--R,ie()})()}catch(ie){z=ie,I=!0}var B=!1;if(!ut){var W=Ii;W&&(Ii=null,(I?W.reject:W.resolve)(z),B=!0)}if(I&&!B)throw z}}),y=!0,_||(vt=1,ut=(function(){var I=lr(65548),z=I+12;if((x(),G)[I>>>2>>>0]=z,(x(),G)[I+4>>>2>>>0]=z+65536,z=Nr[0],!Ti.has(z)){var B=sg++;Ti.set(z,B),bs.set(B,z)}return z=Ti.get(z),(x(),A)[I+8>>>2>>>0]=z,I})(),typeof MainLoop<"u"&&MainLoop.Ed&&MainLoop.pause(),Dr(()=>Do(ut)))}else vt===2?(vt=0,Dr(Po),lt(ut),ut=null,og.forEach(Br)):ee(`invalid state: ${vt}`);return _s}})(p=>{l().then(p)});function ug(l){return l>>>=0,vs(async()=>{var p=await Qe(l);return et(p)})}var Ci=[],lg=l=>{var p=Ci.length;return Ci.push(l),p},dg=(l,p)=>{for(var _=Array(l),y=0;y<l;++y){var I=y,z=(x(),G)[p+4*y>>>2>>>0],B=$i[z];if(B===void 0)throw l=`parameter ${y}`,z=Ls(z),p=ot(z),lt(z),new Kt(`${l} has unknown type ${p}`);_[I]=B}return _},cg=(l,p,_)=>{var y=[];return l=l(y,_),y.length&&((x(),G)[p>>>2>>>0]=et(y)),l},pg={},Ur=l=>{var p=pg[l];return p===void 0?ot(l):p};function hg(l,p,_){var[y,...I]=dg(l,p>>>0);p=y.ed.bind(y);var z=I.map(ie=>ie.dd.bind(ie));l--;var B={toValue:Qe};switch(l=z.map((ie,se)=>{var we=`argFromPtr${se}`;return B[we]=ie,`${we}(args${se?"+"+8*se:""})`}),_){case 0:var W="toValue(handle)";break;case 2:W="new (toValue(handle))";break;case 3:W="";break;case 1:B.getStringOrSymbol=Ur,W="toValue(handle)[getStringOrSymbol(methodName)]"}return W+=`(${l})`,y.Kd||(B.toReturnWire=p,B.emval_returnValue=cg,W=`return emval_returnValue(toReturnWire, destructorsRef, ${W})`),W=`return function (handle, methodName, destructorsRef, args) {
  ${W}
  }`,_=new Function(Object.keys(B),W)(...Object.values(B)),W=`methodCaller<(${I.map(ie=>ie.name)}) => ${y.name}>`,lg(Object.defineProperty(_,"name",{value:W}))}function fg(l,p){return p>>>=0,(l=Qe(l>>>0))==Qe(p)}function mg(l){return(l>>>=0)?(l=Ur(l),et(globalThis[l])):et(globalThis)}function gg(l){return l=Ur(l>>>0),et(t[l])}function yg(l,p){return p>>>=0,l=Qe(l>>>0),p=Qe(p),et(l[p])}function wg(l){9<(l>>>=0)&&(Et[l+1]+=1)}function xs(l,p,_,y,I){return Ci[l>>>0](p>>>0,_>>>0,y>>>0,I>>>0)}function _g(l,p,_,y,I){return xs(l>>>0,p>>>0,_>>>0,y>>>0,I>>>0)}function bg(){return et([])}function $g(l){l=Qe(l>>>0);for(var p=Array(l.length),_=0;_<l.length;_++)p[_]=l[_];return et(p)}function vg(l){return et(Ur(l>>>0))}function xg(){return et({})}function kg(l){for(var p=Qe(l>>>=0);p.length;){var _=p.pop();p.pop()(_)}vi(l)}function Sg(l,p,_){p>>>=0,_>>>=0,l=Qe(l>>>0),p=Qe(p),_=Qe(_),l[p]=_}function Tg(l,p){l=-9007199254740992>l||9007199254740992<l?NaN:Number(l),p>>>=0,l=new Date(1e3*l),(x(),A)[p>>>2>>>0]=l.getUTCSeconds(),(x(),A)[p+4>>>2>>>0]=l.getUTCMinutes(),(x(),A)[p+8>>>2>>>0]=l.getUTCHours(),(x(),A)[p+12>>>2>>>0]=l.getUTCDate(),(x(),A)[p+16>>>2>>>0]=l.getUTCMonth(),(x(),A)[p+20>>>2>>>0]=l.getUTCFullYear()-1900,(x(),A)[p+24>>>2>>>0]=l.getUTCDay(),l=(l.getTime()-Date.UTC(l.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,(x(),A)[p+28>>>2>>>0]=l}var ks=l=>l%4==0&&(l%100!=0||l%400==0),Ss=[0,31,60,91,121,152,182,213,244,274,305,335],Ts=[0,31,59,90,120,151,181,212,243,273,304,334];function Ig(l,p){l=-9007199254740992>l||9007199254740992<l?NaN:Number(l),p>>>=0,l=new Date(1e3*l),(x(),A)[p>>>2>>>0]=l.getSeconds(),(x(),A)[p+4>>>2>>>0]=l.getMinutes(),(x(),A)[p+8>>>2>>>0]=l.getHours(),(x(),A)[p+12>>>2>>>0]=l.getDate(),(x(),A)[p+16>>>2>>>0]=l.getMonth(),(x(),A)[p+20>>>2>>>0]=l.getFullYear()-1900,(x(),A)[p+24>>>2>>>0]=l.getDay();var _=(ks(l.getFullYear())?Ss:Ts)[l.getMonth()]+l.getDate()-1|0;(x(),A)[p+28>>>2>>>0]=_,(x(),A)[p+36>>>2>>>0]=-60*l.getTimezoneOffset(),_=new Date(l.getFullYear(),6,1).getTimezoneOffset();var y=new Date(l.getFullYear(),0,1).getTimezoneOffset();l=0|(_!=y&&l.getTimezoneOffset()==Math.min(y,_)),(x(),A)[p+32>>>2>>>0]=l}function Cg(l){l>>>=0;var p=new Date((x(),A)[l+20>>>2>>>0]+1900,(x(),A)[l+16>>>2>>>0],(x(),A)[l+12>>>2>>>0],(x(),A)[l+8>>>2>>>0],(x(),A)[l+4>>>2>>>0],(x(),A)[l>>>2>>>0],0),_=(x(),A)[l+32>>>2>>>0],y=p.getTimezoneOffset(),I=new Date(p.getFullYear(),6,1).getTimezoneOffset(),z=new Date(p.getFullYear(),0,1).getTimezoneOffset(),B=Math.min(z,I);return 0>_?(x(),A)[l+32>>>2>>>0]=+(I!=z&&B==y):0<_!=(B==y)&&(I=Math.max(z,I),p.setTime(p.getTime()+6e4*((0<_?B:I)-y))),(x(),A)[l+24>>>2>>>0]=p.getDay(),_=(ks(p.getFullYear())?Ss:Ts)[p.getMonth()]+p.getDate()-1|0,(x(),A)[l+28>>>2>>>0]=_,(x(),A)[l>>>2>>>0]=p.getSeconds(),(x(),A)[l+4>>>2>>>0]=p.getMinutes(),(x(),A)[l+8>>>2>>>0]=p.getHours(),(x(),A)[l+12>>>2>>>0]=p.getDate(),(x(),A)[l+16>>>2>>>0]=p.getMonth(),(x(),A)[l+20>>>2>>>0]=p.getYear(),l=p.getTime(),BigInt(isNaN(l)?-1:l/1e3)}function Is(l,p,_,y,I,z,B){return n?H(16,1,l,p,_,y,I,z,B):-52}function Cs(l,p,_,y,I,z){if(n)return H(17,1,l,p,_,y,I,z)}var ur={},Eg=()=>performance.timeOrigin+performance.now();function Es(l,p){if(n)return H(18,1,l,p);if(ur[l]&&(clearTimeout(ur[l].id),delete ur[l]),!p)return 0;var _=setTimeout(()=>{delete ur[l],Br(()=>Hs(l,performance.timeOrigin+performance.now()))},p);return ur[l]={id:_,me:p},0}function zg(l,p,_,y){l>>>=0,p>>>=0,_>>>=0,y>>>=0;var I=new Date().getFullYear(),z=new Date(I,0,1).getTimezoneOffset();I=new Date(I,6,1).getTimezoneOffset();var B=Math.max(z,I);(x(),G)[l>>>2>>>0]=60*B,(x(),A)[p>>>2>>>0]=+(z!=I),l=(p=W=>{var ie=Math.abs(W);return`UTC${0<=W?"-":"+"}${String(Math.floor(ie/60)).padStart(2,"0")}${String(ie%60).padStart(2,"0")}`})(z),p=p(I),I<z?($t(l,_,17),$t(p,y,17)):($t(l,y,17),$t(p,_,17))}var Ag=()=>Date.now();function Mg(l,p,_){return _>>>=0,0<=l&&3>=l?(l===0?l=Date.now():l=performance.timeOrigin+performance.now(),l=Math.round(1e6*l),(x(),re)[_>>>3>>>0]=BigInt(l),0):28}var Ei=[],zs=(l,p)=>{Ei.length=0;for(var _;_=(x(),O)[l++>>>0];){var y=_!=105;p+=(y&=_!=112)&&p%8?4:0,Ei.push(_==112?(x(),G)[p>>>2>>>0]:_==106?(x(),re)[p>>>3>>>0]:_==105?(x(),A)[p>>>2>>>0]:(x(),L)[p>>>3>>>0]),p+=y?8:4}return Ei};function Og(l,p,_){return l>>>=0,p=zs(p>>>0,_>>>0),Ni[l](...p)}function Bg(l,p,_){return l>>>=0,p=zs(p>>>0,_>>>0),Ni[l](...p)}var Rg=()=>{};function Dg(l,p){return T(Ue(l>>>0,p>>>0))}var Ng=()=>{throw R+=1,"unwind"};function Ug(){return 4294901760}var Pg=()=>navigator.hardwareConcurrency,zt={},Pr=l=>{var p;return(p=/\bwasm-function\[\d+\]:(0x[0-9a-f]+)/.exec(l))?+p[1]:(p=/:(\d+):\d+(?:\)|$)/.exec(l))?2147483648|+p[1]:0},As=l=>{for(var p of l)(l=Pr(p))&&(zt[l]=p)};function Lg(){var l=Error().stack.toString().split(`
`);return l[0]=="Error"&&l.shift(),As(l),zt.sd=Pr(l[3]),zt.Ud=l,zt.sd}function Lr(l){if(!(l=zt[l>>>0]))return 0;var p;if(p=/^\s+at .*\.wasm\.(.*) \(.*\)$/.exec(l))l=p[1];else if(p=/^\s+at (.*) \(.*\)$/.exec(l))l=p[1];else{if(!(p=/^(.+?)@/.exec(l)))return 0;l=p[1]}lt(Lr.td??0),p=Or(l)+1;var _=lr(p);return _&&$t(l,_,p),Lr.td=_,Lr.td}function Wg(l){l>>>=0;var p=(x(),O).length;if(l<=p||4294901760<l)return!1;for(var _=1;4>=_;_*=2){var y=p*(1+.2/_);y=Math.min(y,l+100663296);e:{y=(Math.min(4294901760,65536*Math.ceil(Math.max(l,y)/65536))-bt.buffer.byteLength+65535)/65536|0;try{bt.grow(y),Q();var I=1;break e}catch{}I=void 0}if(I)return!0}return!1}function qg(l,p,_){if(l>>>=0,p>>>=0,zt.sd==l)var y=zt.Ud;else(y=Error().stack.toString().split(`
`))[0]=="Error"&&y.shift(),As(y);for(var I=3;y[I]&&Pr(y[I])!=l;)++I;for(l=0;l<_&&y[l+I];++l)(x(),A)[p+4*l>>>2>>>0]=Pr(y[l+I]);return l}var zi,Ai={},Ms=()=>{if(!zi){var l,p={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(globalThis.navigator?.language??"C").replace("-","_")+".UTF-8",_:"./this.program"};for(l in Ai)Ai[l]===void 0?delete p[l]:p[l]=Ai[l];var _=[];for(l in p)_.push(`${l}=${p[l]}`);zi=_}return zi};function Os(l,p){if(n)return H(19,1,l,p);l>>>=0,p>>>=0;var _,y=0,I=0;for(_ of Ms()){var z=p+y;(x(),G)[l+I>>>2>>>0]=z,y+=$t(_,z,1/0)+1,I+=4}return 0}function Bs(l,p){if(n)return H(20,1,l,p);l>>>=0,p>>>=0;var _=Ms();for(var y of((x(),G)[l>>>2>>>0]=_.length,l=0,_))l+=Or(y)+1;return(x(),G)[p>>>2>>>0]=l,0}function Rs(l){return n?H(21,1,l):52}function Ds(l,p,_,y,I){return n?H(22,1,l,p,_,y,I):52}function Ns(l,p,_,y){return n?H(23,1,l,p,_,y):52}function Us(l,p,_,y){return n?H(24,1,l,p,_,y):70}var Gg=[null,[],[]];function Ps(l,p,_,y){if(n)return H(25,1,l,p,_,y);p>>>=0,_>>>=0,y>>>=0;for(var I=0,z=0;z<_;z++){var B=(x(),G)[p>>>2>>>0],W=(x(),G)[p+4>>>2>>>0];p+=8;for(var ie=0;ie<W;ie++){var se=l,we=(x(),O)[B+ie>>>0],Se=Gg[se];we===0||we===10?((se===1?S:T)(rs(Se)),Se.length=0):Se.push(we)}I+=W}return(x(),G)[y>>>2>>>0]=I,0}function Vg(l){return l>>>0}n||(function(){for(var l=t.numThreads-1;l--;)Za();ne.push(async()=>{var p=(async function(){if(!n)return Promise.all(De.map(Ka))})();X++,await p,--X==0&&oe&&(p=oe,oe=null,p())})})(),n||(bt=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0}),Q()),t.wasmBinary&&(m=t.wasmBinary),t.stackSave=()=>be(),t.stackRestore=l=>_e(l),t.stackAlloc=l=>Bi(l),t.setValue=function(l,p,_="i8"){switch(_.endsWith("*")&&(_="*"),_){case"i1":case"i8":(x(),U)[l>>>0]=p;break;case"i16":(x(),D)[l>>>1>>>0]=p;break;case"i32":(x(),A)[l>>>2>>>0]=p;break;case"i64":(x(),re)[l>>>3>>>0]=BigInt(p);break;case"float":(x(),F)[l>>>2>>>0]=p;break;case"double":(x(),L)[l>>>3>>>0]=p;break;case"*":(x(),G)[l>>>2>>>0]=p;break;default:ee(`invalid type for setValue: ${_}`)}},t.getValue=function(l,p="i8"){switch(p.endsWith("*")&&(p="*"),p){case"i1":case"i8":return(x(),U)[l>>>0];case"i16":return(x(),D)[l>>>1>>>0];case"i32":return(x(),A)[l>>>2>>>0];case"i64":return(x(),re)[l>>>3>>>0];case"float":return(x(),F)[l>>>2>>>0];case"double":return(x(),L)[l>>>3>>>0];case"*":return(x(),G)[l>>>2>>>0];default:ee(`invalid type for getValue: ${p}`)}},t.UTF8ToString=Ue,t.stringToUTF8=$t,t.lengthBytesUTF8=Or;var Ls,Ws,Wr,lt,lr,Mi,qs,Gs,Vs,Oi,Hs,Fs,$e,dr,js,_e,Bi,be,Ks,Ri,Zs,Ys,Qs,Di,Xs,Js,eo,to,ro,io,no,ao,so,oo,uo,lo,co,po,ho,fo,mo,go,yo,wo,_o,bo,$o,vo,xo,ko,So,To,Io,Co,Eo,zo,Ao,Mo,Oo,Bo,Ro,Do,No,Uo,Po,ht,Hg=[le,Me,Xa,is,ns,as,ss,os,us,ls,ds,cs,ps,hs,fs,ms,Is,Cs,Es,Os,Bs,Rs,Ds,Ns,Us,Ps],Ni={1124124:(l,p,_,y,I)=>{if(t===void 0||!t.jd)return 1;if((l=Ue(Number(l>>>0))).startsWith("./")&&(l=l.substring(2)),!(l=t.jd.get(l)))return 2;if(p=Number(p>>>0),_=Number(_>>>0),y=Number(y>>>0),p+_>l.byteLength)return 3;try{let z=l.subarray(p,p+_);switch(I){case 0:(x(),O).set(z,y>>>0);break;case 1:t.ae?t.ae(y,z):t.Td(y,z);break;default:return 4}return 0}catch{return 4}},1124948:()=>typeof navigator<"u"&&navigator.de?1:0,1125020:(l,p,_)=>{t.Dd(l,(x(),O).subarray(p>>>0,p+_>>>0))},1125084:()=>t.ce(),1125126:l=>{t.Cd(l)},1125163:()=>{t.Md()},1125194:()=>{t.Nd()},1125223:()=>{t.Rd()},1125248:l=>t.Ld(l),1125281:l=>t.Pd(l),1125313:(l,p,_)=>{t.rd(Number(l),Number(p),Number(_),!0)},1125376:(l,p,_)=>{t.rd(Number(l),Number(p),Number(_))},1125433:()=>typeof wasmOffsetConverter<"u",1125490:l=>{t.ic("Abs",l,void 0)},1125541:l=>{t.ic("Neg",l,void 0)},1125592:l=>{t.ic("Floor",l,void 0)},1125645:l=>{t.ic("Ceil",l,void 0)},1125697:l=>{t.ic("Reciprocal",l,void 0)},1125755:l=>{t.ic("Sqrt",l,void 0)},1125807:l=>{t.ic("Exp",l,void 0)},1125858:l=>{t.ic("Erf",l,void 0)},1125909:l=>{t.ic("Sigmoid",l,void 0)},1125964:(l,p,_)=>{t.ic("HardSigmoid",l,{alpha:p,beta:_})},1126043:l=>{t.ic("HardSwish",l,void 0)},1126100:l=>{t.ic("Log",l,void 0)},1126151:l=>{t.ic("Sin",l,void 0)},1126202:l=>{t.ic("Cos",l,void 0)},1126253:l=>{t.ic("Tan",l,void 0)},1126304:l=>{t.ic("Asin",l,void 0)},1126356:l=>{t.ic("Acos",l,void 0)},1126408:l=>{t.ic("Atan",l,void 0)},1126460:l=>{t.ic("Sinh",l,void 0)},1126512:l=>{t.ic("Cosh",l,void 0)},1126564:l=>{t.ic("Asinh",l,void 0)},1126617:l=>{t.ic("Acosh",l,void 0)},1126670:l=>{t.ic("Atanh",l,void 0)},1126723:l=>{t.ic("Tanh",l,void 0)},1126775:l=>{t.ic("Not",l,void 0)},1126826:(l,p,_)=>{t.ic("Clip",l,{min:p,max:_})},1126895:l=>{t.ic("Clip",l,void 0)},1126947:(l,p)=>{t.ic("Elu",l,{alpha:p})},1127005:l=>{t.ic("Gelu",l,void 0)},1127057:l=>{t.ic("Relu",l,void 0)},1127109:(l,p)=>{t.ic("LeakyRelu",l,{alpha:p})},1127173:(l,p)=>{t.ic("ThresholdedRelu",l,{alpha:p})},1127243:(l,p)=>{t.ic("Cast",l,{to:p})},1127301:l=>{t.ic("Add",l,void 0)},1127352:l=>{t.ic("Sub",l,void 0)},1127403:l=>{t.ic("Mul",l,void 0)},1127454:l=>{t.ic("Div",l,void 0)},1127505:l=>{t.ic("Pow",l,void 0)},1127556:l=>{t.ic("Equal",l,void 0)},1127609:l=>{t.ic("Greater",l,void 0)},1127664:l=>{t.ic("GreaterOrEqual",l,void 0)},1127726:l=>{t.ic("Less",l,void 0)},1127778:l=>{t.ic("LessOrEqual",l,void 0)},1127837:(l,p,_,y,I)=>{t.ic("ReduceMean",l,{keepDims:!!p,noopWithEmptyAxes:!!_,axes:y?Array.from((x(),A).subarray(Number(y)>>>0,Number(I)>>>0)):[]})},1128012:(l,p,_,y,I)=>{t.ic("ReduceMax",l,{keepDims:!!p,noopWithEmptyAxes:!!_,axes:y?Array.from((x(),A).subarray(Number(y)>>>0,Number(I)>>>0)):[]})},1128186:(l,p,_,y,I)=>{t.ic("ReduceMin",l,{keepDims:!!p,noopWithEmptyAxes:!!_,axes:y?Array.from((x(),A).subarray(Number(y)>>>0,Number(I)>>>0)):[]})},1128360:(l,p,_,y,I)=>{t.ic("ReduceProd",l,{keepDims:!!p,noopWithEmptyAxes:!!_,axes:y?Array.from((x(),A).subarray(Number(y)>>>0,Number(I)>>>0)):[]})},1128535:(l,p,_,y,I)=>{t.ic("ReduceSum",l,{keepDims:!!p,noopWithEmptyAxes:!!_,axes:y?Array.from((x(),A).subarray(Number(y)>>>0,Number(I)>>>0)):[]})},1128709:(l,p,_,y,I)=>{t.ic("ReduceL1",l,{keepDims:!!p,noopWithEmptyAxes:!!_,axes:y?Array.from((x(),A).subarray(Number(y)>>>0,Number(I)>>>0)):[]})},1128882:(l,p,_,y,I)=>{t.ic("ReduceL2",l,{keepDims:!!p,noopWithEmptyAxes:!!_,axes:y?Array.from((x(),A).subarray(Number(y)>>>0,Number(I)>>>0)):[]})},1129055:(l,p,_,y,I)=>{t.ic("ReduceLogSum",l,{keepDims:!!p,noopWithEmptyAxes:!!_,axes:y?Array.from((x(),A).subarray(Number(y)>>>0,Number(I)>>>0)):[]})},1129232:(l,p,_,y,I)=>{t.ic("ReduceSumSquare",l,{keepDims:!!p,noopWithEmptyAxes:!!_,axes:y?Array.from((x(),A).subarray(Number(y)>>>0,Number(I)>>>0)):[]})},1129412:(l,p,_,y,I)=>{t.ic("ReduceLogSumExp",l,{keepDims:!!p,noopWithEmptyAxes:!!_,axes:y?Array.from((x(),A).subarray(Number(y)>>>0,Number(I)>>>0)):[]})},1129592:l=>{t.ic("Where",l,void 0)},1129645:(l,p,_)=>{t.ic("Transpose",l,{perm:p?Array.from((x(),A).subarray(Number(p)>>>0,Number(_)>>>0)):[]})},1129769:(l,p,_,y)=>{t.ic("DepthToSpace",l,{blocksize:p,mode:Ue(_),format:y?"NHWC":"NCHW"})},1129902:(l,p,_,y)=>{t.ic("DepthToSpace",l,{blocksize:p,mode:Ue(_),format:y?"NHWC":"NCHW"})},1130035:(l,p,_,y)=>{t.ic("DFT",l,{axis:p,inverse:_,onesided:y})},1130127:(l,p,_,y,I,z,B,W,ie,se,we,Se,Ae,Oe,xt)=>{t.ic("ConvTranspose",l,{format:ie?"NHWC":"NCHW",autoPad:p,dilations:[_],group:y,kernelShape:[I],pads:[z,B],strides:[W],wIsConst:()=>!!(x(),U)[se>>>0],outputPadding:we?Array.from((x(),A).subarray(Number(we)>>>0,Number(Se)>>>0)):[],outputShape:Ae?Array.from((x(),A).subarray(Number(Ae)>>>0,Number(Oe)>>>0)):[],activation:Ue(xt)})},1130560:(l,p,_,y,I,z,B,W,ie,se,we,Se,Ae,Oe)=>{t.ic("ConvTranspose",l,{format:W?"NHWC":"NCHW",autoPad:p,dilations:Array.from((x(),A).subarray(Number(_)>>>0,(Number(_)>>>0)+2>>>0)),group:y,kernelShape:Array.from((x(),A).subarray(Number(I)>>>0,(Number(I)>>>0)+2>>>0)),pads:Array.from((x(),A).subarray(Number(z)>>>0,(Number(z)>>>0)+4>>>0)),strides:Array.from((x(),A).subarray(Number(B)>>>0,(Number(B)>>>0)+2>>>0)),wIsConst:()=>!!(x(),U)[ie>>>0],outputPadding:se?Array.from((x(),A).subarray(Number(se)>>>0,Number(we)>>>0)):[],outputShape:Se?Array.from((x(),A).subarray(Number(Se)>>>0,Number(Ae)>>>0)):[],activation:Ue(Oe)})},1131221:(l,p,_,y,I,z,B,W,ie,se,we,Se,Ae,Oe,xt)=>{t.ic("ConvTranspose",l,{format:ie?"NHWC":"NCHW",autoPad:p,dilations:[_],group:y,kernelShape:[I],pads:[z,B],strides:[W],wIsConst:()=>!!(x(),U)[se>>>0],outputPadding:we?Array.from((x(),A).subarray(Number(we)>>>0,Number(Se)>>>0)):[],outputShape:Ae?Array.from((x(),A).subarray(Number(Ae)>>>0,Number(Oe)>>>0)):[],activation:Ue(xt)})},1131654:(l,p,_,y,I,z,B,W,ie,se,we,Se,Ae,Oe)=>{t.ic("ConvTranspose",l,{format:W?"NHWC":"NCHW",autoPad:p,dilations:Array.from((x(),A).subarray(Number(_)>>>0,(Number(_)>>>0)+2>>>0)),group:y,kernelShape:Array.from((x(),A).subarray(Number(I)>>>0,(Number(I)>>>0)+2>>>0)),pads:Array.from((x(),A).subarray(Number(z)>>>0,(Number(z)>>>0)+4>>>0)),strides:Array.from((x(),A).subarray(Number(B)>>>0,(Number(B)>>>0)+2>>>0)),wIsConst:()=>!!(x(),U)[ie>>>0],outputPadding:se?Array.from((x(),A).subarray(Number(se)>>>0,Number(we)>>>0)):[],outputShape:Se?Array.from((x(),A).subarray(Number(Se)>>>0,Number(Ae)>>>0)):[],activation:Ue(Oe)})},1132315:(l,p)=>{t.ic("GlobalAveragePool",l,{format:p?"NHWC":"NCHW"})},1132406:(l,p,_,y,I,z,B,W,ie,se,we,Se,Ae,Oe)=>{t.ic("AveragePool",l,{format:Oe?"NHWC":"NCHW",auto_pad:p,ceil_mode:_,count_include_pad:y,storage_order:I,dilations:z?Array.from((x(),A).subarray(Number(z)>>>0,Number(B)>>>0)):[],kernel_shape:W?Array.from((x(),A).subarray(Number(W)>>>0,Number(ie)>>>0)):[],pads:se?Array.from((x(),A).subarray(Number(se)>>>0,Number(we)>>>0)):[],strides:Se?Array.from((x(),A).subarray(Number(Se)>>>0,Number(Ae)>>>0)):[]})},1132885:(l,p)=>{t.ic("GlobalAveragePool",l,{format:p?"NHWC":"NCHW"})},1132976:(l,p,_,y,I,z,B,W,ie,se,we,Se,Ae,Oe)=>{t.ic("AveragePool",l,{format:Oe?"NHWC":"NCHW",auto_pad:p,ceil_mode:_,count_include_pad:y,storage_order:I,dilations:z?Array.from((x(),A).subarray(Number(z)>>>0,Number(B)>>>0)):[],kernel_shape:W?Array.from((x(),A).subarray(Number(W)>>>0,Number(ie)>>>0)):[],pads:se?Array.from((x(),A).subarray(Number(se)>>>0,Number(we)>>>0)):[],strides:Se?Array.from((x(),A).subarray(Number(Se)>>>0,Number(Ae)>>>0)):[]})},1133455:(l,p)=>{t.ic("GlobalMaxPool",l,{format:p?"NHWC":"NCHW"})},1133542:(l,p,_,y,I,z,B,W,ie,se,we,Se,Ae,Oe)=>{t.ic("MaxPool",l,{format:Oe?"NHWC":"NCHW",auto_pad:p,ceil_mode:_,count_include_pad:y,storage_order:I,dilations:z?Array.from((x(),A).subarray(Number(z)>>>0,Number(B)>>>0)):[],kernel_shape:W?Array.from((x(),A).subarray(Number(W)>>>0,Number(ie)>>>0)):[],pads:se?Array.from((x(),A).subarray(Number(se)>>>0,Number(we)>>>0)):[],strides:Se?Array.from((x(),A).subarray(Number(Se)>>>0,Number(Ae)>>>0)):[]})},1134017:(l,p)=>{t.ic("GlobalMaxPool",l,{format:p?"NHWC":"NCHW"})},1134104:(l,p,_,y,I,z,B,W,ie,se,we,Se,Ae,Oe)=>{t.ic("MaxPool",l,{format:Oe?"NHWC":"NCHW",auto_pad:p,ceil_mode:_,count_include_pad:y,storage_order:I,dilations:z?Array.from((x(),A).subarray(Number(z)>>>0,Number(B)>>>0)):[],kernel_shape:W?Array.from((x(),A).subarray(Number(W)>>>0,Number(ie)>>>0)):[],pads:se?Array.from((x(),A).subarray(Number(se)>>>0,Number(we)>>>0)):[],strides:Se?Array.from((x(),A).subarray(Number(Se)>>>0,Number(Ae)>>>0)):[]})},1134579:(l,p,_,y,I)=>{t.ic("Gemm",l,{alpha:p,beta:_,transA:y,transB:I})},1134683:l=>{t.ic("MatMul",l,void 0)},1134737:(l,p,_,y)=>{t.ic("ArgMax",l,{keepDims:!!p,selectLastIndex:!!_,axis:y})},1134845:(l,p,_,y)=>{t.ic("ArgMin",l,{keepDims:!!p,selectLastIndex:!!_,axis:y})},1134953:(l,p)=>{t.ic("Softmax",l,{axis:p})},1135016:(l,p)=>{t.ic("Concat",l,{axis:p})},1135076:(l,p,_,y,I)=>{t.ic("Split",l,{axis:p,numOutputs:_,splitSizes:y?Array.from((x(),A).subarray(Number(y)>>>0,Number(I)>>>0)):[]})},1135232:l=>{t.ic("Expand",l,void 0)},1135286:(l,p)=>{t.ic("Gather",l,{axis:Number(p)})},1135357:(l,p)=>{t.ic("GatherElements",l,{axis:Number(p)})},1135436:(l,p)=>{t.ic("GatherND",l,{batch_dims:Number(p)})},1135515:(l,p,_,y,I,z,B,W,ie,se,we)=>{t.ic("Resize",l,{antialias:p,axes:_?Array.from((x(),A).subarray(Number(_)>>>0,Number(y)>>>0)):[],coordinateTransformMode:Ue(I),cubicCoeffA:z,excludeOutside:B,extrapolationValue:W,keepAspectRatioPolicy:Ue(ie),mode:Ue(se),nearestMode:Ue(we)})},1135877:(l,p,_,y,I,z,B)=>{t.ic("Slice",l,{starts:p?Array.from((x(),A).subarray(Number(p)>>>0,Number(_)>>>0)):[],ends:y?Array.from((x(),A).subarray(Number(y)>>>0,Number(I)>>>0)):[],axes:z?Array.from((x(),A).subarray(Number(z)>>>0,Number(B)>>>0)):[]})},1136141:l=>{t.ic("Tile",l,void 0)},1136193:(l,p,_)=>{t.ic("InstanceNormalization",l,{epsilon:p,format:_?"NHWC":"NCHW"})},1136307:(l,p,_)=>{t.ic("InstanceNormalization",l,{epsilon:p,format:_?"NHWC":"NCHW"})},1136421:l=>{t.ic("Range",l,void 0)},1136474:(l,p)=>{t.ic("Einsum",l,{equation:Ue(p)})},1136555:(l,p,_,y,I)=>{t.ic("Pad",l,{mode:p,value:_,pads:y?Array.from((x(),A).subarray(Number(y)>>>0,Number(I)>>>0)):[]})},1136698:(l,p,_,y,I,z)=>{t.ic("BatchNormalization",l,{epsilon:p,momentum:_,spatial:!!I,trainingMode:!!y,format:z?"NHWC":"NCHW"})},1136867:(l,p,_,y,I,z)=>{t.ic("BatchNormalization",l,{epsilon:p,momentum:_,spatial:!!I,trainingMode:!!y,format:z?"NHWC":"NCHW"})},1137036:(l,p,_)=>{t.ic("CumSum",l,{exclusive:Number(p),reverse:Number(_)})},1137133:(l,p,_)=>{t.ic("DequantizeLinear",l,{axis:p,blockSize:_})},1137223:(l,p,_,y,I)=>{t.ic("GridSample",l,{align_corners:p,mode:Ue(_),padding_mode:Ue(y),format:I?"NHWC":"NCHW"})},1137393:(l,p,_,y,I)=>{t.ic("GridSample",l,{align_corners:p,mode:Ue(_),padding_mode:Ue(y),format:I?"NHWC":"NCHW"})},1137563:(l,p)=>{t.ic("ScatterND",l,{reduction:Ue(p)})},1137648:(l,p,_,y,I,z,B,W,ie)=>{t.ic("Attention",l,{numHeads:p,isUnidirectional:_,maskFilterValue:y,scale:I,doRotary:z,qkvHiddenSizes:B?Array.from((x(),A).subarray(Number(W)>>>0,Number(W)+B>>>0)):[],pastPresentShareBuffer:!!ie})},1137920:l=>{t.ic("BiasAdd",l,void 0)},1137975:l=>{t.ic("BiasSplitGelu",l,void 0)},1138036:l=>{t.ic("FastGelu",l,void 0)},1138092:(l,p,_,y,I,z,B,W,ie,se,we,Se,Ae,Oe,xt,Ui)=>{t.ic("Conv",l,{format:Se?"NHWC":"NCHW",auto_pad:p,dilations:_?Array.from((x(),A).subarray(Number(_)>>>0,Number(y)>>>0)):[],group:I,kernel_shape:z?Array.from((x(),A).subarray(Number(z)>>>0,Number(B)>>>0)):[],pads:W?Array.from((x(),A).subarray(Number(W)>>>0,Number(ie)>>>0)):[],strides:se?Array.from((x(),A).subarray(Number(se)>>>0,Number(we)>>>0)):[],w_is_const:()=>!!(x(),U)[Number(Ae)>>>0],activation:Ue(Oe),activation_params:xt?Array.from((x(),F).subarray(Number(xt)>>>0,Number(Ui)>>>0)):[]})},1138676:l=>{t.ic("Gelu",l,void 0)},1138728:(l,p,_,y,I,z,B,W,ie)=>{t.ic("GroupQueryAttention",l,{numHeads:p,kvNumHeads:_,scale:y,softcap:I,doRotary:z,rotaryInterleaved:B,smoothSoftmax:W,localWindowSize:ie})},1138945:(l,p,_,y)=>{t.ic("LayerNormalization",l,{axis:p,epsilon:_,simplified:!!y})},1139056:(l,p,_,y)=>{t.ic("LayerNormalization",l,{axis:p,epsilon:_,simplified:!!y})},1139167:(l,p,_,y,I,z)=>{t.ic("MatMulNBits",l,{k:p,n:_,accuracyLevel:y,bits:I,blockSize:z})},1139294:(l,p,_,y,I,z)=>{t.ic("MultiHeadAttention",l,{numHeads:p,isUnidirectional:_,maskFilterValue:y,scale:I,doRotary:z})},1139453:(l,p)=>{t.ic("QuickGelu",l,{alpha:p})},1139517:(l,p,_,y,I)=>{t.ic("RotaryEmbedding",l,{interleaved:!!p,numHeads:_,rotaryEmbeddingDim:y,scale:I})},1139656:(l,p,_)=>{t.ic("SkipLayerNormalization",l,{epsilon:p,simplified:!!_})},1139758:(l,p,_)=>{t.ic("SkipLayerNormalization",l,{epsilon:p,simplified:!!_})},1139860:(l,p,_,y)=>{t.ic("GatherBlockQuantized",l,{gatherAxis:p,quantizeAxis:_,blockSize:y})},1139981:l=>{t.Qd(l)},1140015:(l,p)=>t.Sd(Number(l),Number(p),t.hd.Vd,t.hd.errors)};function Fg(l,p,_){return vs(async()=>{await t.Od(Number(l),Number(p),Number(_))})}function jg(){return typeof wasmOffsetConverter<"u"}function Kg(l,p,_,y){var I=be();try{return so(l,p,_,y)}catch(z){if(_e(I),z!==z+0)throw z;$e(1,0)}}function Zg(l,p,_){var y=be();try{return no(l,p,_)}catch(I){if(_e(y),I!==I+0)throw I;$e(1,0)}}function Yg(l){var p=be();try{ro(l)}catch(_){if(_e(p),_!==_+0)throw _;$e(1,0)}}function Qg(l,p){var _=be();try{return Di(l,p)}catch(y){if(_e(_),y!==y+0)throw y;$e(1,0)}}function Xg(l,p,_){var y=be();try{Qs(l,p,_)}catch(I){if(_e(y),I!==I+0)throw I;$e(1,0)}}function Jg(l,p,_,y){var I=be();try{return po(l,p,_,y)}catch(z){if(_e(I),z!==z+0)throw z;$e(1,0)}}function e0(l,p){var _=be();try{oo(l,p)}catch(y){if(_e(_),y!==y+0)throw y;$e(1,0)}}function t0(l,p,_,y,I,z,B){var W=be();try{return ao(l,p,_,y,I,z,B)}catch(ie){if(_e(W),ie!==ie+0)throw ie;$e(1,0)}}function r0(l,p,_,y,I,z){var B=be();try{Xs(l,p,_,y,I,z)}catch(W){if(_e(B),W!==W+0)throw W;$e(1,0)}}function i0(l,p,_,y){var I=be();try{eo(l,p,_,y)}catch(z){if(_e(I),z!==z+0)throw z;$e(1,0)}}function n0(l,p,_,y,I){var z=be();try{io(l,p,_,y,I)}catch(B){if(_e(z),B!==B+0)throw B;$e(1,0)}}function a0(l,p,_,y,I,z,B){var W=be();try{lo(l,p,_,y,I,z,B)}catch(ie){if(_e(W),ie!==ie+0)throw ie;$e(1,0)}}function s0(l,p,_,y,I,z,B){var W=be();try{co(l,p,_,y,I,z,B)}catch(ie){if(_e(W),ie!==ie+0)throw ie;$e(1,0)}}function o0(l,p,_,y,I,z,B,W){var ie=be();try{go(l,p,_,y,I,z,B,W)}catch(se){if(_e(ie),se!==se+0)throw se;$e(1,0)}}function u0(l,p,_,y,I){var z=be();try{return uo(l,p,_,y,I)}catch(B){if(_e(z),B!==B+0)throw B;$e(1,0)}}function l0(l,p,_){var y=be();try{return to(l,p,_)}catch(I){if(_e(y),I!==I+0)throw I;$e(1,0)}}function d0(l,p,_,y,I,z,B,W){var ie=be();try{yo(l,p,_,y,I,z,B,W)}catch(se){if(_e(ie),se!==se+0)throw se;$e(1,0)}}function c0(l,p,_,y,I,z,B,W,ie,se,we,Se){var Ae=be();try{ho(l,p,_,y,I,z,B,W,ie,se,we,Se)}catch(Oe){if(_e(Ae),Oe!==Oe+0)throw Oe;$e(1,0)}}function p0(l,p,_){var y=be();try{return wo(l,p,_)}catch(I){if(_e(y),I!==I+0)throw I;return $e(1,0),0n}}function h0(l,p,_,y,I,z,B,W,ie){var se=be();try{Js(l,p,_,y,I,z,B,W,ie)}catch(we){if(_e(se),we!==we+0)throw we;$e(1,0)}}function f0(l){var p=be();try{return _o(l)}catch(_){if(_e(p),_!==_+0)throw _;$e(1,0)}}function m0(l,p){var _=be();try{return Bo(l,p)}catch(y){if(_e(_),y!==y+0)throw y;return $e(1,0),0n}}function g0(l,p,_,y){var I=be();try{return bo(l,p,_,y)}catch(z){if(_e(I),z!==z+0)throw z;$e(1,0)}}function y0(l,p,_,y,I,z,B){var W=be();try{Ro(l,p,_,y,I,z,B)}catch(ie){if(_e(W),ie!==ie+0)throw ie;$e(1,0)}}function w0(l){var p=be();try{return $o(l)}catch(_){if(_e(p),_!==_+0)throw _;return $e(1,0),0n}}function _0(l,p,_,y,I){var z=be();try{return Io(l,p,_,y,I)}catch(B){if(_e(z),B!==B+0)throw B;$e(1,0)}}function b0(l,p,_,y,I,z){var B=be();try{return Co(l,p,_,y,I,z)}catch(W){if(_e(B),W!==W+0)throw W;$e(1,0)}}function $0(l,p,_,y,I,z){var B=be();try{return fo(l,p,_,y,I,z)}catch(W){if(_e(B),W!==W+0)throw W;$e(1,0)}}function v0(l,p,_,y,I,z){var B=be();try{return Eo(l,p,_,y,I,z)}catch(W){if(_e(B),W!==W+0)throw W;$e(1,0)}}function x0(l,p,_,y,I,z,B,W){var ie=be();try{return mo(l,p,_,y,I,z,B,W)}catch(se){if(_e(ie),se!==se+0)throw se;$e(1,0)}}function k0(l,p,_,y,I){var z=be();try{return zo(l,p,_,y,I)}catch(B){if(_e(z),B!==B+0)throw B;return $e(1,0),0n}}function S0(l,p,_,y){var I=be();try{return Ao(l,p,_,y)}catch(z){if(_e(I),z!==z+0)throw z;$e(1,0)}}function T0(l,p,_,y){var I=be();try{return Mo(l,p,_,y)}catch(z){if(_e(I),z!==z+0)throw z;$e(1,0)}}function I0(l,p,_,y,I,z,B,W,ie,se,we,Se){var Ae=be();try{return Oo(l,p,_,y,I,z,B,W,ie,se,we,Se)}catch(Oe){if(_e(Ae),Oe!==Oe+0)throw Oe;$e(1,0)}}function C0(l,p,_,y,I,z,B,W,ie,se,we){var Se=be();try{So(l,p,_,y,I,z,B,W,ie,se,we)}catch(Ae){if(_e(Se),Ae!==Ae+0)throw Ae;$e(1,0)}}function E0(l,p,_,y,I,z,B,W,ie,se,we,Se,Ae,Oe,xt,Ui){var O0=be();try{To(l,p,_,y,I,z,B,W,ie,se,we,Se,Ae,Oe,xt,Ui)}catch(Pi){if(_e(O0),Pi!==Pi+0)throw Pi;$e(1,0)}}function z0(l,p,_){var y=be();try{return vo(l,p,_)}catch(I){if(_e(y),I!==I+0)throw I;$e(1,0)}}function A0(l,p,_){var y=be();try{return xo(l,p,_)}catch(I){if(_e(y),I!==I+0)throw I;$e(1,0)}}function M0(l,p,_,y){var I=be();try{ko(l,p,_,y)}catch(z){if(_e(I),z!==z+0)throw z;$e(1,0)}}function qr(){if(0<X)oe=qr;else if(n)$?.(t),K();else{for(var l=ne;0<l.length;)l.shift()(t);0<X?oe=qr:(t.calledRun=!0,E||(K(),$?.(t)))}}return n||(ht=await xe(),qr()),t.PTR_SIZE=4,N?t:new Promise((l,p)=>{$=l,v=p})}var tp,qo,ry=J(()=>{"use strict";tp=Wo,qo=globalThis.self?.name?.startsWith("em-pthread"),qo&&Wo()}),ji,Yn,Go,Fe,rp,Vr,Vo,Ho,Ki,Fo,Zi,ip,Yi,np,_a=J(()=>{"use strict";wa(),ji=typeof location>"u"?void 0:location.origin,Yn=import.meta.url>"file:"&&import.meta.url<"file;",Go=()=>{if(Yn){let e=URL;return new URL(new e("ort.bundle.min.mjs",import.meta.url).href,ji).href}return import.meta.url},Fe=Go(),rp=()=>{if(Fe&&!Fe.startsWith("blob:"))return Fe.substring(0,Fe.lastIndexOf("/")+1)},Vr=(e,t)=>{try{let r=t??Fe;return(r?new URL(e,r):new URL(e)).origin===ji}catch{return!1}},Vo=(e,t)=>{let r=t??Fe;try{return(r?new URL(e,r):new URL(e)).href}catch{return}},Ho=(e,t)=>`${t??"./"}${e}`,Ki=async e=>{let t=await(await fetch(e,{credentials:"same-origin"})).blob();return URL.createObjectURL(t)},Fo=async e=>(await import(e)).default,Zi=(ty(),Er(Xc)).default,ip=async()=>{if(!Fe)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(Vr(Fe))return[void 0,Zi()];let e=await Ki(Fe);return[e,Zi(e)]},Yi=(ry(),Er(ep)).default,np=async(e,t,r,i)=>{let n=Yi&&!(e||t);if(n)if(Fe)n=Vr(Fe)||i&&!r;else if(i&&!r)n=!0;else throw new Error("cannot determine the script source URL.");if(n)return[void 0,Yi];{let a="ort-wasm-simd-threaded.jsep.mjs",s=e??Vo(a,t),o=r&&s&&!Vr(s,t),u=o?await Ki(s):s??Ho(a,t);return[o?u:void 0,await Fo(u)]}}}),Qi,Hr,cr,Xi,jo,Ko,Zo,ba,ze,Ht=J(()=>{"use strict";_a(),Hr=!1,cr=!1,Xi=!1,jo=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},Ko=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},Zo=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},ba=async e=>{if(Hr)return Promise.resolve();if(cr)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(Xi)throw new Error("previous call to 'initializeWebAssembly()' failed.");cr=!0;let t=e.initTimeout,r=e.numThreads;if(e.simd!==!1){if(e.simd==="relaxed"){if(!Zo())throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.")}else if(!Ko())throw new Error("WebAssembly SIMD is not supported in the current environment.")}let i=jo();r>1&&!i&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+r+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),e.numThreads=r=1);let n=e.wasmPaths,a=typeof n=="string"?n:void 0,s=n?.mjs,o=s?.href??s,u=n?.wasm,d=u?.href??u,c=e.wasmBinary,[h,m]=await np(o,a,r>1,!!c||!!d),g=!1,f=[];if(t>0&&f.push(new Promise($=>{setTimeout(()=>{g=!0,$()},t)})),f.push(new Promise(($,v)=>{let b={numThreads:r};if(c)b.wasmBinary=c,b.locateFile=w=>w;else if(d||a)b.locateFile=w=>d??a+w;else if(o&&o.indexOf("blob:")!==0)b.locateFile=w=>new URL(w,o).href;else if(h){let w=rp();w&&(b.locateFile=k=>w+k)}m(b).then(w=>{cr=!1,Hr=!0,Qi=w,$(),h&&URL.revokeObjectURL(h)},w=>{cr=!1,Xi=!0,v(w)})})),await Promise.race(f),g)throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},ze=()=>{if(Hr&&Qi)return Qi;throw new Error("WebAssembly is not initialized yet.")}}),st,ui,Ie,$a=J(()=>{"use strict";Ht(),st=(e,t)=>{let r=ze(),i=r.lengthBytesUTF8(e)+1,n=r._malloc(i);return r.stringToUTF8(e,n,i),t.push(n),n},ui=(e,t,r,i)=>{if(typeof e=="object"&&e!==null){if(r.has(e))throw new Error("Circular reference in options");r.add(e)}Object.entries(e).forEach(([n,a])=>{let s=t?t+n:n;if(typeof a=="object")ui(a,s+".",r,i);else if(typeof a=="string"||typeof a=="number")i(s,a.toString());else if(typeof a=="boolean")i(s,a?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof a}`)})},Ie=e=>{let t=ze(),r=t.stackSave();try{let i=t.PTR_SIZE,n=t.stackAlloc(2*i);t._OrtGetLastError(n,n+i);let a=Number(t.getValue(n,i===4?"i32":"i64")),s=t.getValue(n+i,"*"),o=s?t.UTF8ToString(s):"";throw new Error(`${e} ERROR_CODE: ${a}, ERROR_MESSAGE: ${o}`)}finally{t.stackRestore(r)}}}),ap,iy=J(()=>{"use strict";Ht(),$a(),ap=(e,t)=>{let r=ze(),i=0,n=[],a=e||{};try{if(e?.logSeverityLevel===void 0)a.logSeverityLevel=2;else if(typeof e.logSeverityLevel!="number"||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log severity level is not valid: ${e.logSeverityLevel}`);if(e?.logVerbosityLevel===void 0)a.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!="number"||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);e?.terminate===void 0&&(a.terminate=!1);let s=0;e?.tag!==void 0&&(s=st(e.tag,n)),i=r._OrtCreateRunOptions(a.logSeverityLevel,a.logVerbosityLevel,!!a.terminate,s),i===0&&Ie("Can't create run options."),e?.extra!==void 0&&ui(e.extra,"",new WeakSet,(o,u)=>{let d=st(o,n),c=st(u,n);r._OrtAddRunConfigEntry(i,d,c)!==0&&Ie(`Can't set a run config entry: ${o} - ${u}.`)});for(let o of t)r._OrtRunOptionsAddActiveLoraAdapter(i,o)!==0&&Ie("Can't add an active LoRA adapter.");return[i,n]}catch(s){throw i!==0&&r._OrtReleaseRunOptions(i),n.forEach(o=>r._free(o)),s}}}),Yo,Qo,Xo,At,Jo,sp,ny=J(()=>{"use strict";Ht(),$a(),Yo=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"layout":return 3;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}},Qo=e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}},Xo=e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some(r=>(typeof r=="string"?r:r.name)==="webgpu")&&(e.enableMemPattern=!1)},At=(e,t,r,i)=>{let n=st(t,i),a=st(r,i);ze()._OrtAddSessionConfigEntry(e,n,a)!==0&&Ie(`Can't set a session config entry: ${t} - ${r}.`)},Jo=async(e,t,r)=>{let i=t.executionProviders;for(let n of i){let a=typeof n=="string"?n:n.name,s=[],o;switch(a){case"webnn":if(a="WEBNN",At(e,"session.disable_quant_qdq","1",r),At(e,"session.disable_qdq_constant_folding","1",r),typeof n!="string"){let m=n?.deviceType;m&&At(e,"deviceType",m,r)}break;case"webgpu":if(a="JS",typeof n!="string"){let m=n;if(m?.preferredLayout){if(m.preferredLayout!=="NCHW"&&m.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${m.preferredLayout}`);At(e,"preferredLayout",m.preferredLayout,r)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${a}`)}let u=s.length,d=0,c=0;if(u>0){d=ze()._malloc(u*ze().PTR_SIZE),r.push(d),c=ze()._malloc(u*ze().PTR_SIZE),r.push(c);for(let m=0;m<u;m++)ze().setValue(d+m*ze().PTR_SIZE,s[m][0],"*"),ze().setValue(c+m*ze().PTR_SIZE,s[m][1],"*")}let h;if(o===void 0){let m=st(a,r);h=await ze()._OrtAppendExecutionProvider(e,m,d,c,u)}h!==0&&Ie(`Can't append execution provider: ${a}.`)}},sp=async e=>{let t=ze(),r=0,i=[],n=e||{};Xo(n);try{let a=Yo(n.graphOptimizationLevel??"all"),s=Qo(n.executionMode??"sequential"),o=typeof n.logId=="string"?st(n.logId,i):0,u=n.logSeverityLevel??2;if(!Number.isInteger(u)||u<0||u>4)throw new Error(`log severity level is not valid: ${u}`);let d=n.logVerbosityLevel??0;if(!Number.isInteger(d)||d<0||d>4)throw new Error(`log verbosity level is not valid: ${d}`);let c=typeof n.optimizedModelFilePath=="string"?st(n.optimizedModelFilePath,i):0;if(r=t._OrtCreateSessionOptions(a,!!n.enableCpuMemArena,!!n.enableMemPattern,s,!!n.enableProfiling,0,o,u,d,c),r===0&&Ie("Can't create session options."),n.executionProviders&&await Jo(r,n,i),n.enableGraphCapture!==void 0){if(typeof n.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${n.enableGraphCapture}`);At(r,"enableGraphCapture",n.enableGraphCapture.toString(),i)}if(n.freeDimensionOverrides)for(let[h,m]of Object.entries(n.freeDimensionOverrides)){if(typeof h!="string")throw new Error(`free dimension override name must be a string: ${h}`);if(typeof m!="number"||!Number.isInteger(m)||m<0)throw new Error(`free dimension override value must be a non-negative integer: ${m}`);let g=st(h,i);t._OrtAddFreeDimensionOverride(r,g,m)!==0&&Ie(`Can't set a free dimension override: ${h} - ${m}.`)}return n.extra!==void 0&&ui(n.extra,"",new WeakSet,(h,m)=>{At(r,h,m,i)}),[r,i]}catch(a){throw r!==0&&t._OrtReleaseSessionOptions(r)!==0&&Ie("Can't release session options."),i.forEach(s=>t._free(s)),a}}}),Ut,wt,Pt,gi,li,va,xa,Qn,fe=J(()=>{"use strict";Ut=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data type: ${e}`)}},wt=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw new Error(`unsupported data type: ${e}`)}},Pt=(e,t)=>{let r=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],i=typeof t=="number"?t:t.reduce((n,a)=>n*a,1);return r>0?Math.ceil(i*r):void 0},gi=e=>{switch(e){case"float16":return typeof Float16Array<"u"?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${e}`)}},li=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}},va=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",xa=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint64"||e==="int8"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",Qn=e=>{switch(e){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${e}`)}}}),yi,ka=J(()=>{"use strict";wa(),yi=async e=>{if(typeof e=="string"){let t=await fetch(e);if(!t.ok)throw new Error(`failed to load external data file: ${e}`);let r=t.headers.get("Content-Length"),i=r?parseInt(r,10):0;if(i<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw new Error(`failed to load external data file: ${e}, no response body.`);let n=t.body.getReader(),a;try{a=new ArrayBuffer(i)}catch(o){if(o instanceof RangeError){let u=Math.ceil(i/65536);a=new WebAssembly.Memory({initial:u,maximum:u}).buffer}else throw o}let s=0;for(;;){let{done:o,value:u}=await n.read();if(o)break;let d=u.byteLength;new Uint8Array(a,s,d).set(u),s+=d}return new Uint8Array(a,0,i)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),eu,tu,ru,iu,Sa,nu,ke,_t=J(()=>{"use strict";fe(),eu=["V","I","W","E","F"],tu=(e,t)=>{console.log(`[${eu[e]},${new Date().toISOString()}]${t}`)},Sa=(e,t)=>{ru=e,iu=t},nu=(e,t)=>{let r=li(e),i=li(ru);r>=i&&tu(r,typeof t=="function"?t():t)},ke=(...e)=>{iu&&nu(...e)}}),au,ar,P,di,op,up,lp,ge=J(()=>{"use strict";au=class{static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}},ar=class{static calcShape(e,t,r=!1){let i=e.length,n=t.length;if(i===0)return t;if(n===0)return e;let a=Math.max(e.length,t.length),s=new Array(a);if(r){if(i<2||n<2)return;let o=au.calcMatMulShape([e[i-2],e[i-1]],[t[n-2],t[n-1]]);if(o===void 0)return;[s[a-2],s[a-1]]=o}for(let o=r?3:1;o<=a;o++){let u=i-o<0?1:e[i-o],d=n-o<0?1:t[n-o];if(u!==d&&u>1&&d>1)return;let c=Math.max(u,d);if(u&&d)s[a-o]=Math.max(u,d);else{if(c>1)return;s[a-o]=0}}return s}static isValidBroadcast(e,t){let r=e.length,i=t.length;if(r>i)return!1;for(let n=1;n<=r;n++)if(e[r-n]!==1&&e[r-n]!==t[i-n])return!1;return!0}},P=class ai{static size(t){return ai.getSizeFromDimensionRange(t,0,t.length)}static convertShape(t,r=4){let i=t.length;if(i===0)return[];let n=new Array(i),a=i-1;for(;a>=0;){if(t[a]%r===0){n[a]=t[a]/r;break}if(r%t[a]!==0)throw new Error("cannot convert shape");n[a]=1,r/=t[a],a--}for(a--;a>=0;a--)n[a]=t[a];return n}static sizeFromDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return ai.getSizeFromDimensionRange(t,r,t.length)}static sizeToDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeToDimension as Tensor has ${t.length} dimensions.`);return ai.getSizeFromDimensionRange(t,0,r)}static getSizeFromDimensionRange(t,r,i){let n=1;for(let a=r;a<i;a++){if(t[a]<0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");n*=Number(t[a])}return n}static computeStrides(t){let r=t.length;if(r===0)return[];if(r===1)return[1];let i=new Array(r);i[r-1]=1,i[r-2]=t[r-1];for(let n=r-3;n>=0;--n)i[n]=i[n+1]*t[n+1];return i}static normalizeAxis(t,r){if(t<-r&&t>=r)throw new Error("unsupported axis for this operation.");return t<0?t+r:t}static normalizeAxes(t,r){return t.map(i=>this.normalizeAxis(i,r??t.length))}static sortBasedOnPerm(t,r){return r?r.map(i=>t[i]):t.slice().reverse()}static padShape(t,r){let i=t.length;return t.map((n,a)=>n+r[a]+r[a+i])}static areEqual(t,r){return t.length!==r.length?!1:t.every((i,n)=>i===r[n])}},di=class Tt{static adjustPoolAttributes(t,r,i,n,a,s){if(!t&&i.length!==r.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(t)for(let o=0;o<r.length-2;o++)o>=i.length?i.push(r[o+2]):i[o]=r[o+2];for(let o=0;o<i.length;o++)if(o<n.length){if(n[o]<0)throw new Error("strides should be greater than or equal to 1")}else n.push(1);for(let o=0;o<i.length;o++)if(o<a.length){if(a[o]<0)throw new Error("dilations should be greater than or equal to 1")}else a.push(1);for(let o=0;o<i.length*2;o++)if(o<s.length){if(s[o]<0)throw new Error("pad should be greater than or equal to 1")}else s.push(0);for(let o=0;o<i.length;o++){if(i[o]<=0)throw new Error("kernel shapes need to be greater than 0");if(s[o]>=i[o]||s[o+i.length]>=i[o])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,r,i,n,a,s,o){if(o){if(a.length!==2*(t.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(r.length!==t.length-2)throw new Error("length of strides should be the length of data dimensions");if(n.length!==t.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let u=0;u<t.length-2;u++)Tt.adjustPadAndReturnShape(t[u+(s?1:2)],r[u],i[u],n[u],a,u,u+t.length-2,o)}}static computePoolOutputShape(t,r,i,n,a,s,o,u=0){if(r.length<=0)throw new Error("input shape must be of size greater than 0");let d=[r[0],r[1]];return Tt.computeShapeHelper(t,r,d,i,n,a,s,o,u),d}static computeConvOutputShape(t,r,i,n,a,s,o){if(t.length<=0||r.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let u=[t[0],r[0]];return Tt.computeShapeHelper(!1,t,u,i,n,a,s,o),u}static computeShapeHelper(t,r,i,n,a,s,o,u,d=0){if(t)for(let c=0;c<r.length-2;c++)i.push(1);else for(let c=0;c<r.length-2;c++)i.push(Tt.adjustPadAndReturnShape(r[c+2],n[c],a[c],s[c],o,c,c+r.length-2,u,d))}static computeOutputSize(t,r,i,n,a){let s=Math.floor(t/r)+1;return a===1&&(s=Math.ceil(t/r)+1,(s-1)*r>=i+n&&(s-=1)),s}static adjustPadAndReturnShape(t,r,i,n,a,s,o,u,d=0){let c=i*(n-1)+1;if(u&&u!=="NOTSET")switch(u){case"VALID":return a[s]=0,a[o]=0,Tt.computeOutputSize(t-c,r,t,0,d);case"SAME_LOWER":case"SAME_UPPER":if(i!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let h=(Math.floor((t+r-1)/r)-1)*r+n-t;return a[s]=Math.floor(u==="SAME_LOWER"?(h+1)/2:h/2),a[o]=h-a[s],Tt.computeOutputSize(t+a[s]+a[o]-c,r,t,a[s],d)}default:throw new Error("Unsupported AutoPad type")}else return Tt.computeOutputSize(t+a[s]+a[o]-c,r,t,a[s],d)}},op=class{static getShapeOfGemmResult(e,t,r,i,n){if(e.length!==2||r.length!==2)throw new Error("shape need to be of size 2");let a,s,o;t?(a=e[1],s=e[0]):(a=e[0],s=e[1]);let u=-1;if(i?(o=r[0],u=1):(o=r[1],u=0),r[u]!==s)throw new Error("dimension mismatch");if(a<=0||o<=0||s<=0)throw new Error("invalid shape specified");if(n&&!ar.isValidBroadcast(n,[a,o]))throw new Error("gemm: invalid bias shape for broadcast");return[a,o,s]}},up=-34028234663852886e22,lp=34028234663852886e22}),Ta,dp=J(()=>{"use strict";fe(),Ta=(e,t)=>new(gi(t))(e)}),Ji,su,en,ou,tn,uu,rn,nn,an,lu,cp,ay=J(()=>{"use strict";fe(),_t(),Ji=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),su=(e,t)=>{if(t==="int32")return e;let r=Ji.get(t);if(!r)throw new Error(`WebNN backend does not support data type: ${t}`);let i=r/8;if(e.byteLength%i!==0)throw new Error(`Invalid Uint8Array length - must be a multiple of ${i}.`);let n=e.byteLength/i,a=new(gi(t))(e.buffer,e.byteOffset,n);switch(t){case"int64":case"uint64":{let s=new Int32Array(n);for(let o=0;o<n;o++){let u=a[o];if(u>2147483647n||u<-2147483648n)throw new Error("Can not convert int64 data to int32 - value out of range.");s[o]=Number(u)}return new Uint8Array(s.buffer)}case"int8":case"uint8":case"uint32":{if(t==="uint32"&&a.some(o=>o>2147483647))throw new Error("Can not convert uint32 data to int32 - value out of range.");let s=Int32Array.from(a,Number);return new Uint8Array(s.buffer)}default:throw new Error(`Unsupported data conversion from ${t} to 'int32'`)}},en=(e,t)=>{if(t==="int32")return e;if(e.byteLength%4!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");let r=e.byteLength/4,i=new Int32Array(e.buffer,e.byteOffset,r);switch(t){case"int64":{let n=BigInt64Array.from(i,BigInt);return new Uint8Array(n.buffer)}case"uint64":{if(i.some(a=>a<0))throw new Error("Can not convert int32 data to uin64 - negative value found.");let n=BigUint64Array.from(i,BigInt);return new Uint8Array(n.buffer)}case"int8":{if(i.some(a=>a<-128||a>127))throw new Error("Can not convert int32 data to int8 - value out of range.");let n=Int8Array.from(i,Number);return new Uint8Array(n.buffer)}case"uint8":{if(i.some(n=>n<0||n>255))throw new Error("Can not convert int32 data to uint8 - value out of range.");return Uint8Array.from(i,Number)}case"uint32":{if(i.some(a=>a<0))throw new Error("Can not convert int32 data to uint32 - negative value found.");let n=Uint32Array.from(i,Number);return new Uint8Array(n.buffer)}default:throw new Error(`Unsupported data conversion from 'int32' to ${t}`)}},ou=1,tn=()=>ou++,uu=new Map([["int8","int32"],["uint8","int32"],["uint32","int32"],["int64","int32"]]),rn=(e,t)=>{let r=Ji.get(e);if(!r)throw new Error(`WebNN backend does not support data type: ${e}`);return t.length>0?Math.ceil(t.reduce((i,n)=>i*n)*r/8):0},nn=class{constructor(e){this.isDataConverted=!1;let{sessionId:t,context:r,tensor:i,dataType:n,shape:a,fallbackDataType:s}=e;this.sessionId=t,this.mlContext=r,this.mlTensor=i,this.dataType=n,this.tensorShape=a,this.fallbackDataType=s}get tensor(){return this.mlTensor}get type(){return this.dataType}get fallbackType(){return this.fallbackDataType}get shape(){return this.tensorShape}get byteLength(){return rn(this.dataType,this.tensorShape)}destroy(){ke("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e){if(this.fallbackDataType){let t=await this.mlContext.readTensor(this.mlTensor),r=en(new Uint8Array(t),this.dataType);if(e){(e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)).set(r);return}else return new Uint8Array(r).buffer}else return e?this.mlContext.readTensor(this.mlTensor,e):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(e,t,r){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===r.length&&this.tensorShape.every((i,n)=>i===r[n])}setIsDataConverted(e){this.isDataConverted=e}},an=class{constructor(e,t){this.tensorManager=e,this.wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,r,i){let n=this.tensorManager.getMLContext(e),a=this.tensorManager.getMLOpSupportLimits(e),s;if(!a?.input.dataTypes.includes(t)){if(s=uu.get(t),!s||!a?.input.dataTypes.includes(s))throw new Error(`WebNN backend does not support data type: ${t}`);ke("verbose",()=>`[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${t} to ${s}`)}if(this.wrapper){if(this.wrapper.canReuseTensor(n,t,r))return this.wrapper.tensor;if(i){if(this.wrapper.byteLength!==rn(t,r))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let o=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,t,r,o,!0,!0,s),i&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){let t=e;if(this.wrapper){if(this.wrapper.fallbackType)if(this.wrapper.fallbackType==="int32")t=su(e,this.wrapper.type),this.wrapper.setIsDataConverted(!0);else throw new Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);if(e.byteLength===this.wrapper.byteLength){this.wrapper.write(t);return}else ke("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor()}this.activeUpload?this.activeUpload.set(t):this.activeUpload=new Uint8Array(t)}async download(e){if(this.activeUpload){let t=this.wrapper?.isDataConverted?en(this.activeUpload,this.wrapper?.type):this.activeUpload;if(e){e instanceof ArrayBuffer?new Uint8Array(e).set(t):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(t);return}else return t.buffer}if(!this.wrapper)throw new Error("Tensor has not been created.");return e?this.wrapper.read(e):this.wrapper.read()}},lu=class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){let t=this.backend.getMLContext(e);if(!t)throw new Error("MLContext not found for session.");return t}getMLOpSupportLimits(e){return this.backend.getMLOpSupportLimits(e)}reserveTensorId(){let e=tn();return this.tensorTrackersById.set(e,new an(this)),e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(t.tensorWrapper))}async ensureTensor(e,t,r,i,n){ke("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${r}, shape: ${i}, copyOld: ${n}}`);let a=this.tensorTrackersById.get(t);if(!a)throw new Error("Tensor not found.");return a.ensureTensor(e,r,i,n)}upload(e,t){let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");r.upload(t)}async download(e,t){ke("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t?.byteLength}}`);let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");return r.download(t)}releaseTensorsForSession(e){for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,r,i){let n=this.getMLContext(e),a=tn(),s=new nn({sessionId:e,context:n,tensor:t,dataType:r,shape:i});return this.tensorTrackersById.set(a,new an(this,s)),this.externalTensors.add(s),a}async getCachedTensor(e,t,r,i,n,a,s){let o=this.getMLContext(e);for(let[d,c]of this.freeTensors.entries())if(c.canReuseTensor(o,t,r)){ke("verbose",()=>`[WebNN] Reusing tensor {dataType: ${t}, ${s?`fallbackDataType: ${s},`:""} shape: ${r}`);let h=this.freeTensors.splice(d,1)[0];return h.sessionId=e,h}ke("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${t}, ${s?`fallbackDataType: ${s},`:""} shape: ${r}}`);let u=await o.createTensor({dataType:s??t,shape:r,dimensions:r,usage:i,writable:n,readable:a});return new nn({sessionId:e,context:o,tensor:u,dataType:t,shape:r,fallbackDataType:s})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},cp=(...e)=>new lu(...e)}),pr,du,pp,sy=J(()=>{"use strict";fe(),Ht(),dp(),ay(),_t(),pr=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),du=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let r=Object.keys(e).sort(),i=Object.keys(t).sort();return r.length===i.length&&r.every((n,a)=>n===i[a]&&e[n]===t[n])},pp=class{constructor(e){this.tensorManager=cp(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.sessionGraphOutputs=new Map,this.temporaryGraphInputs=[],this.temporaryGraphOutputs=[],this.temporarySessionTensorIds=new Map,this.mlOpSupportLimitsBySessionId=new Map,Sa(e.logLevel,!!e.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(e){ke("verbose",()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){ke("verbose",()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let r of t)ke("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${r}}`),this.tensorManager.releaseTensorId(r);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let r=this.mlContextCache.findIndex(i=>i.gpuDevice===e);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:i}),i}}else if(e===void 0){let r=this.mlContextCache.findIndex(i=>i.options===void 0&&i.gpuDevice===void 0);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:i}),i}}let t=this.mlContextCache.findIndex(r=>du(r.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;{let r=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:r}),r}}registerMLContext(e,t){this.mlContextBySessionId.set(e,t);let r=this.sessionIdsByMLContext.get(t);r||(r=new Set,this.sessionIdsByMLContext.set(t,r)),r.add(e),this.mlOpSupportLimitsBySessionId.has(e)||this.mlOpSupportLimitsBySessionId.set(e,t.opSupportLimits()),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[]),this.temporaryGraphOutputs.length>0&&(this.sessionGraphOutputs.set(e,this.temporaryGraphOutputs),this.temporaryGraphOutputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e),this.sessionGraphOutputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e),this.mlOpSupportLimitsBySessionId.delete(e);let r=this.sessionIdsByMLContext.get(t);if(r.delete(e),r.size===0){this.sessionIdsByMLContext.delete(t);let i=this.mlContextCache.findIndex(n=>n.mlContext===t);i!==-1&&this.mlContextCache.splice(i,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}getMLOpSupportLimits(e){return this.mlOpSupportLimitsBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){ke("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,t,r,i,n){let a=pr.get(r);if(!a)throw new Error(`Unsupported ONNX data type: ${r}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,t,a,i,n)}async createTemporaryTensor(e,t,r){ke("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${r}}`);let i=pr.get(t);if(!i)throw new Error(`Unsupported ONNX data type: ${t}`);let n=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,n,i,r,!1);let a=this.temporarySessionTensorIds.get(e);return a?a.push(n):this.temporarySessionTensorIds.set(e,[n]),n}uploadTensor(e,t){if(!ze().shouldTransferToMLTensor)throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");ke("verbose",()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let r=await this.tensorManager.download(e);return Ta(r,t)}}registerMLTensor(e,t,r,i){let n=pr.get(r);if(!n)throw new Error(`Unsupported ONNX data type: ${r}`);let a=this.tensorManager.registerTensor(e,t,n,i);return ke("verbose",()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${n}, dimensions: ${i}} -> {tensorId: ${a}}`),a}registerGraphInput(e){this.temporaryGraphInputs.push(e)}registerGraphOutput(e){this.temporaryGraphOutputs.push(e)}isGraphInput(e,t){let r=this.sessionGraphInputs.get(e);return r?r.includes(t):!1}isGraphOutput(e,t){let r=this.sessionGraphOutputs.get(e);return r?r.includes(t):!1}isGraphInputOutputTypeSupported(e,t,r=!0){let i=pr.get(Ut(t)),n=this.mlOpSupportLimitsBySessionId.get(e);return typeof i>"u"?!1:r?!!n?.input.dataTypes.includes(i):!!n?.output.dataTypes.includes(i)}flush(){}}}),Ia=J(()=>{"use strict"}),sn,Fr,jr,cu,pu,on,Xn,hu,hp,oy=J(()=>{"use strict";_t(),Ia(),sn=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),Fr=[],jr=e=>Math.ceil(Number(e)/16)*16,cu=e=>{for(let t=0;t<Fr.length;t++){let r=Fr[t];if(e<=r)return r}return Math.ceil(e/16)*16},pu=1,on=()=>pu++,Xn=async(e,t,r,i)=>{let n=jr(r),a=e.device.createBuffer({size:n,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let s=e.getCommandEncoder();e.endComputePass(),s.copyBufferToBuffer(t,0,a,0,n),e.flush(),await a.mapAsync(GPUMapMode.READ);let o=a.getMappedRange();if(i){let u=i();return u.set(new Uint8Array(o,0,r)),u}else return new Uint8Array(o.slice(0,r))}finally{a.destroy()}},hu=class{constructor(e){this.backend=e,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[t]of sn)Fr.push(t),this.freeBuffers.set(t,[]),this.freeUniformBuffers.set(t,[]);this.sessionCount=0}upload(e,t){let r=t.buffer,i=t.byteOffset,n=t.byteLength,a=jr(n),s=this.storageCache.get(e);if(!s)throw new Error("gpu data for uploading does not exist");if(Number(s.originalSize)!==n)throw new Error(`inconsistent data size. gpu data size=${s.originalSize}, data size=${n}`);if(a===n&&i%4===0)this.backend.device.queue.writeBuffer(s.gpuData.buffer,0,r,i,n);else{let o=new Uint8Array(a);o.set(t),this.backend.device.queue.writeBuffer(s.gpuData.buffer,0,o,0,a)}ke("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${e})`)}memcpy(e,t){let r=this.storageCache.get(e);if(!r)throw new Error("source gpu data for memcpy does not exist");let i=this.storageCache.get(t);if(!i)throw new Error("destination gpu data for memcpy does not exist");if(r.originalSize!==i.originalSize)throw new Error("inconsistent source and destination gpu data size");let n=jr(r.originalSize),a=this.backend.getCommandEncoder();this.backend.endComputePass(),a.copyBufferToBuffer(r.gpuData.buffer,0,i.gpuData.buffer,0,n)}registerExternalBuffer(e,t,r){let i;if(r){if(i=r[0],e===r[1])return ke("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, buffer is the same, skip.`),i;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else i=on();return this.storageCache.set(i,{gpuData:{id:i,type:0,buffer:e},originalSize:t}),ke("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, registered.`),i}unregisterExternalBuffer(e){e!==void 0&&(this.storageCache.delete(e),ke("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`))}create(e,t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let r=cu(e),i,n=(t&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,a=(t&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(n||a){let o=(n?this.freeBuffers:this.freeUniformBuffers).get(r);o?o.length>0?i=o.pop():i=this.backend.device.createBuffer({size:r,usage:t}):i=this.backend.device.createBuffer({size:r,usage:t})}else i=this.backend.device.createBuffer({size:r,usage:t});let s={id:on(),type:0,buffer:i};return this.storageCache.set(s.id,{gpuData:s,originalSize:Number(e)}),ke("verbose",()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${s.id}`),s}get(e){return this.storageCache.get(e)?.gpuData}release(e){let t=typeof e=="bigint"?Number(e):e,r=this.storageCache.get(t);if(!r){if(this.storageCache.size===0)return 0;throw new Error("releasing data does not exist")}return ke("verbose",()=>`[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${r.gpuData.id}`),this.storageCache.delete(t),this.buffersPending.push(r.gpuData.buffer),r.originalSize}async download(e,t){let r=this.storageCache.get(Number(e));if(!r)throw new Error("data does not exist");await Xn(this.backend,r.gpuData.buffer,r.originalSize,t)}refreshPendingBuffers(){if(this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let e of this.buffersPending){let t=sn.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let r=this.freeBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let r=this.freeUniformBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e));for(let t of this.buffersPending)e.push(t);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(e){let t=this.capturedPendingBuffers.get(e);t&&(t.forEach(r=>{r.destroy()}),this.capturedPendingBuffers.delete(e)),this.sessionCount-=1,this.sessionCount===0&&(ke("warning",()=>"[WebGPU] Clearing webgpu buffer cache"),this.storageCache.forEach(r=>{r.gpuData.buffer.destroy()}),this.storageCache=new Map)}},hp=(...e)=>new hu(...e)}),fu,Ce,Re=J(()=>{"use strict";fu=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},Ce=e=>new fu(e)}),sr,Kr,We,Le,ce,Be,Jn,er,It,de,hr,q,ue,fp,Ca,mu,mp,ye=J(()=>{"use strict";fe(),ge(),sr=64,Kr=(e,t)=>{if(t===3)throw new Error("vec3 has same alignment as vec4, use vec4 instead");switch(Number(e)){case 10:return t>1?`vec${t}<f16>`:"f16";case 1:return t>1?`vec${t}<f32>`:"f32";case 6:return t>1?`vec${t}<i32>`:"i32";case 12:return t>1?`vec${t}<u32>`:"u32";case 7:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(t!==4)throw new Error("bool must be vec4");return["u32","vec4<bool>"];case 22:return"i32";case 21:return"u32";default:throw new Error(`Unknown data type: ${e}`)}},We=(e,t=1)=>{let r=Kr(e,t);return typeof r=="string"?r:r[0]},Le=(e,t=1)=>{let r=Kr(e,t);return typeof r=="string"?r:r[1]},ce=(...e)=>{let t=[];return e.forEach(r=>{r.length!==0&&t.push({type:12,data:r},{type:12,data:P.computeStrides(r)})}),t},Be=e=>e%4===0?4:e%2===0?2:1,Jn=(e="f32",t,r="0")=>!t||t===1?`${e}(${r})`:`vec${t}<${e}>(${r})`,er=(e,t,r)=>e==="f32"?r:t===1?`f32(${r})`:`vec${t}<f32>(${r})`,It=(e,t)=>t===4?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:t===2?`(${e}.x + ${e}.y)`:t===3?`(${e}.x + ${e}.y + ${e}.z)`:e,de=(e,t,r,i)=>e.startsWith("uniforms.")&&r>4?typeof t=="string"?i==="f16"?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:i==="f16"?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:r>1?`${e}[${t}]`:e,hr=(e,t,r,i,n)=>{let a=typeof r=="number",s=a?r:r.length,o=[...new Array(s).keys()],u=s<2?"u32":s<=4?`vec${s}<u32>`:`array<u32, ${s}>`,d=Kr(t,n),c=typeof d=="string"?d:d[1],h=typeof d=="string"?d:d[0],m={indices:u,value:c,storage:h,tensor:t},g=N=>typeof N=="string"?N:`${N}u`,f={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},$=a?"uniforms.":"",v=`${$}${e}_shape`,b=`${$}${e}_strides`,w="";for(let N=0;N<s-1;N++)w+=`
    let dim${N} = current / ${de(b,N,s)};
    let rest${N} = current % ${de(b,N,s)};
    indices[${N}] = dim${N};
    current = rest${N};
    `;w+=`indices[${s-1}] = current;`;let k=s<2?"":`
  fn o2i_${e}(offset: u32) -> ${m.indices} {
    var indices: ${m.indices};
    var current = offset;
    ${w}
    return indices;
  }`,S=N=>(f.offsetToIndices=!0,s<2?N:`o2i_${e}(${N})`),T=[];if(s>=2)for(let N=s-1;N>=0;N--)T.push(`${de(b,N,s)} * (indices[${N}])`);let E=s<2?"":`
  fn i2o_${e}(indices: ${m.indices}) -> u32 {
    return ${T.join("+")};
  }`,C=N=>(f.indicesToOffset=!0,s<2?N:`i2o_${e}(${N})`),x=(...N)=>s===0?"0u":`${m.indices}(${N.map(g).join(",")})`,M=(N,Q)=>s<2?`${N}`:`${de(N,Q,s)}`,U=(N,Q,K)=>s<2?`${N}=${K};`:`${de(N,Q,s)}=${K};`,O={},D=(N,Q)=>{f.broadcastedIndicesToOffset=!0;let K=`${Q.name}broadcastedIndicesTo${e}Offset`;if(K in O)return`${K}(${N})`;let ee=[];for(let me=s-1;me>=0;me--){let xe=Q.indicesGet("outputIndices",me+Q.rank-s);ee.push(`${M(b,me)} * (${xe} % ${M(v,me)})`)}return O[K]=`fn ${K}(outputIndices: ${Q.type.indices}) -> u32 {
             return ${ee.length>0?ee.join("+"):"0u"};
           }`,`${K}(${N})`},V=(N,Q)=>(()=>{if(m.storage===m.value)return`${e}[${N}]=${Q};`;if(m.storage==="vec2<u32>"&&m.value==="i32")return`${e}[${N}]=vec2<u32>(u32(${Q}), select(0u, 0xFFFFFFFFu, ${Q} < 0));`;if(m.storage==="vec2<u32>"&&m.value==="u32")return`${e}[${N}]=vec2<u32>(u32(${Q}), 0u);`;if(m.storage==="u32"&&m.value==="vec4<bool>")return`${e}[${N}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${Q}));`;throw new Error(`not supported combination of storage type ${m.storage} and value type ${m.value} yet`)})(),A=N=>(()=>{if(m.storage===m.value)return`${e}[${N}]`;if(m.storage==="vec2<u32>"&&m.value==="i32")return`i32(${e}[${N}].x)`;if(m.storage==="vec2<u32>"&&m.value==="u32")return`u32(${e}[${N}].x)`;if(m.storage==="u32"&&m.value==="vec4<bool>")return`vec4<bool>(bool(${e}[${N}] & 0xFFu), bool(${e}[${N}] & 0xFF00u), bool(${e}[${N}] & 0xFF0000u), bool(${e}[${N}] & 0xFF000000u))`;throw new Error(`not supported combination of storage type ${m.storage} and value type ${m.value} yet`)})(),G=s<2?"":`
  fn get_${e}ByIndices(indices: ${m.indices}) -> ${c} {
    return ${A(`i2o_${e}(indices)`)};
  }`,F=s<2?"":(()=>{let N=o.map(K=>`d${K}: u32`).join(", "),Q=o.map(K=>`d${K}`).join(", ");return`
  fn get_${e}(${N}) -> ${c} {
    return get_${e}ByIndices(${x(Q)});
  }`})(),L=(...N)=>{if(N.length!==s)throw new Error(`indices length must be ${s}`);let Q=N.map(g).join(",");return s===0?A("0u"):s===1?A(Q[0]):(f.get=!0,f.getByIndices=!0,f.indicesToOffset=!0,`get_${e}(${Q})`)},re=N=>s<2?A(N):(f.getByIndices=!0,f.indicesToOffset=!0,`get_${e}ByIndices(${N})`),ae=s<2?"":`
  fn set_${e}ByIndices(indices: ${m.indices}, value: ${c}) {
    ${V(`i2o_${e}(indices)`,"value")}
  }`,Y=s<2?"":(()=>{let N=o.map(K=>`d${K}: u32`).join(", "),Q=o.map(K=>`d${K}`).join(", ");return`
  fn set_${e}(${N}, value: ${c}) {
    set_${e}ByIndices(${x(Q)}, value);
  }`})();return{impl:()=>{let N=[],Q=!1;return f.offsetToIndices&&(N.push(k),Q=!0),f.indicesToOffset&&(N.push(E),Q=!0),f.broadcastedIndicesToOffset&&(Object.values(O).forEach(K=>N.push(K)),Q=!0),f.set&&(N.push(Y),Q=!0),f.setByIndices&&(N.push(ae),Q=!0),f.get&&(N.push(F),Q=!0),f.getByIndices&&(N.push(G),Q=!0),!a&&Q&&N.unshift(`const ${v} = ${m.indices}(${r.join(",")});`,`const ${b} = ${m.indices}(${P.computeStrides(r).join(",")});`),N.join(`
`)},type:m,offsetToIndices:S,indicesToOffset:C,broadcastedIndicesToOffset:D,indices:x,indicesGet:M,indicesSet:U,set:(...N)=>{if(N.length!==s+1)throw new Error(`indices length must be ${s}`);let Q=N[s];if(typeof Q!="string")throw new Error("value must be string");let K=N.slice(0,s).map(g).join(",");return s===0?V("0u",Q):s===1?V(K[0],Q):(f.set=!0,f.setByIndices=!0,f.indicesToOffset=!0,`set_${e}(${K}, ${Q})`)},setByOffset:V,setByIndices:(N,Q)=>s<2?V(N,Q):(f.setByIndices=!0,f.indicesToOffset=!0,`set_${e}ByIndices(${N}, ${Q});`),get:L,getByOffset:A,getByIndices:re,usage:i,name:e,strides:b,shape:v,rank:s}},q=(e,t,r,i=1)=>hr(e,t,r,"input",i),ue=(e,t,r,i=1)=>hr(e,t,r,"output",i),fp=(e,t,r)=>hr(e,t,r,"atomicOutput",1),Ca=(e,t,r,i=1)=>hr(e,t,r,"internal",i),mu=class{constructor(e,t){this.normalizedDispatchGroup=e,this.limits=t,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${typeof e=="number"?`${e}u`:e}) { return; }`}mainStart(e=sr){let t=typeof e=="number"?e:e[0],r=typeof e=="number"?1:e[1],i=typeof e=="number"?1:e[2];if(t>this.limits.maxComputeWorkgroupSizeX||r>this.limits.maxComputeWorkgroupSizeY||i>this.limits.maxComputeWorkgroupSizeZ)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(t*r*i>this.limits.maxComputeInvocationsPerWorkgroup)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let n=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1,a=n?`@builtin(global_invocation_id) global_id : vec3<u32>,
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
`)}get variablesInfo(){if(this.uniforms.length===0)return;let e=t=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(t)];return this.uniforms.map(t=>[e(t.type),t.length??1])}},mp=(e,t)=>new mu(e,t)}),gu,un,yu,wu,_u,bu,Ze,gp,yp,Ct=J(()=>{"use strict";fe(),ge(),Re(),ye(),gu=(e,t)=>{if(!e||e.length!==1)throw new Error("Transpose requires 1 input.");if(t.length!==0&&t.length!==e[0].dims.length)throw new Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`)},un=(e,t)=>t.length!==0?t:[...new Array(e).keys()].reverse(),yu=(e,t)=>P.sortBasedOnPerm(e,un(e.length,t)),wu=(e,t,r,i)=>{let n=`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`;for(let a=0;a<t;++a)n+=`a[${e[a]}]=i[${a}];`;return n+="return a;}"},_u=(e,t)=>{let r=[],i=[];for(let n=0;n<e.length;++n)e[n]!==1&&r.push(e[n]),e[t[n]]!==1&&i.push(t[n]);return{newShape:r,newPerm:i}},bu=(e,t)=>{let r=0;for(let i=0;i<e.length;++i)if(t[e[i]]!==1){if(e[i]<r)return!1;r=e[i]}return!0},Ze=(e,t)=>{let r=e.dataType,i=e.dims.length,n=un(i,t),a=yu(e.dims,n),s=e.dims,o=a,u=i<2||bu(n,e.dims),d;if(u)return d=f=>{let $=q("input",r,s,4),v=ue("output",r,o,4);return`
  ${f.registerUniform("output_size","u32").declareVariables($,v)}
  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`},{name:"TransposeCopy",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let f=P.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(f/64/4)},programUniforms:[{type:12,data:Math.ceil(f/4)}]}},getShaderSource:d};let{newShape:c,newPerm:h}=_u(e.dims,n),m=P.areEqual(h,[2,3,1]),g=P.areEqual(h,[3,1,2]);if(c.length===2||m||g){s=m?[c[0],c[1]*c[2]]:g?[c[0]*c[1],c[2]]:c,o=[s[1],s[0]];let f=16;return d=$=>{let v=q("a",r,s.length),b=ue("output",r,o.length);return`
  ${$.registerUniform("output_size","u32").declareVariables(v,b)}
  var<workgroup> tile : array<array<${b.type.value}, ${f+1}>, ${f}>;
  ${$.mainStart([f,f,1])}
    let stride = (uniforms.output_shape[1] - 1) / ${f} + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * ${f}u + local_id.x;
    let input_row = workgroup_id_x * ${f}u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${v.getByIndices(`${v.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * ${f}u + local_id.x;
    let output_row = workgroup_id_y * ${f}u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${b.setByIndices(`${b.type.indices}(output_row, output_col)`,"tile[local_id.x][local_id.y]")}
    }
  }`},{name:"TransposeShared",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let $=P.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(o[1]/f),y:Math.ceil(o[0]/f)},programUniforms:[{type:12,data:$},...ce(s,o)]}},getShaderSource:d}}return d=f=>{let $=q("a",r,s.length),v=ue("output",r,o.length);return`
  ${f.registerUniform("output_size","u32").declareVariables($,v)}

  ${wu(n,i,$,v)}

  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${v.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${v.setByOffset("global_idx",$.getByIndices("aIndices"))}
  }`},{name:"Transpose",shaderCache:{hint:`${t}`,inputDependencies:["rank"]},getRunData:()=>{let f=P.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:[{type:12,data:f},...ce(s,o)]}},getShaderSource:d}},gp=(e,t)=>{gu(e.inputs,t.perm),e.compute(Ze(e.inputs[0],t.perm))},yp=e=>Ce({perm:e.perm})}),$u,vu,xu,ku,Su,Tu,Iu,Cu,Eu,zu,tt,wp,_p,bp,$p,vp,xp,kp,Sp,Tp,Ip,uy=J(()=>{"use strict";fe(),ge(),ye(),Ea(),Ct(),$u={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},vu={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},xu={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},ku={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},Su=(e,t)=>{let r=[];for(let i=t-e;i<t;++i)r.push(i);return r},Tu=(e,t)=>{let r=[],i=e.length;for(let a=0;a<i;a++)t.indexOf(a)===-1&&r.push(e[a]);let n=t.map(a=>e[a]);return[r,n]},Iu=(e,t)=>{let r=e.length+t.length,i=[],n=0;for(let a=0;a<r;a++)t.indexOf(a)===-1?i.push(e[n++]):i.push(1);return i},Cu=(e,t)=>{for(let r=0;r<e.length;++r)if(e[e.length-r-1]!==t-1-r)return!1;return!0},Eu=(e,t)=>{let r=[];if(!Cu(e,t)){for(let i=0;i<t;++i)e.indexOf(i)===-1&&r.push(i);e.forEach(i=>r.push(i))}return r},zu=(e,t,r,i,n,a,s)=>{let o=r[0].dims,u=P.size(a),d=P.size(s),c=q("_A",r[0].dataType,o),h=ue("output",n,a),m=64;u===1&&(m=256);let g=`
          var<workgroup> aBestValues : array<f32, ${m}>;
       `,f=$=>`
        ${$.registerUniform("reduceSize","u32").declareVariables(c,h)}
        ${g}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${$.mainStart(m)}

          let outputIndex = global_idx / ${m};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${xu[i]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${m}) {
           let candidate = f32(${c.getByOffset("offset + k")});
           bestValue = ${$u[i]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${m}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${vu[i]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${h.setByOffset("outputIndex",`${i==="mean"?`${h.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${h.type.storage}(${ku[i]})`}`)};
         }
        }`;return{name:e,shaderCache:{hint:`${t};${m}`,inputDependencies:["type"]},getShaderSource:f,getRunData:()=>({outputs:[{dims:a,dataType:n}],dispatchGroup:{x:u},programUniforms:[{type:12,data:d}]})}},tt=(e,t,r,i)=>{let n=e.inputs.length===1?r:ea(e.inputs,r),a=n.axes;a.length===0&&!n.noopWithEmptyAxes&&(a=e.inputs[0].dims.map((g,f)=>f));let s=P.normalizeAxes(a,e.inputs[0].dims.length),o=s,u=e.inputs[0],d=Eu(o,e.inputs[0].dims.length);d.length>0&&(u=e.compute(Ze(e.inputs[0],d),{inputs:[0],outputs:[-1]})[0],o=Su(o.length,u.dims.length));let[c,h]=Tu(u.dims,o),m=c;n.keepDims&&(m=Iu(c,s)),e.compute(zu(t,n.cacheKey,[u],i,e.inputs[0].dataType,m,h),{inputs:[u]})},wp=(e,t)=>{tt(e,"ReduceMeanShared",t,"mean")},_p=(e,t)=>{tt(e,"ReduceL1Shared",t,"l1")},bp=(e,t)=>{tt(e,"ReduceL2Shared",t,"l2")},$p=(e,t)=>{tt(e,"ReduceLogSumExpShared",t,"logSumExp")},vp=(e,t)=>{tt(e,"ReduceMaxShared",t,"max")},xp=(e,t)=>{tt(e,"ReduceMinShared",t,"min")},kp=(e,t)=>{tt(e,"ReduceProdShared",t,"prod")},Sp=(e,t)=>{tt(e,"ReduceSumShared",t,"sum")},Tp=(e,t)=>{tt(e,"ReduceSumSquareShared",t,"sumSquare")},Ip=(e,t)=>{tt(e,"ReduceLogSumShared",t,"logSum")}}),rt,Au,ci,ea,it,Mu,Ou,Bu,Ru,Du,Nu,Uu,Pu,Lu,Wu,nt,Cp,Ep,zp,Ap,Mp,Op,Bp,Rp,Dp,Np,Ea=J(()=>{"use strict";fe(),ge(),Re(),ye(),uy(),rt=e=>{if(!e||e.length===0||e.length>2)throw new Error("Reduce op requires 1 or 2 inputs.");if(e.length===2&&e[1].dims.length!==1)throw new Error("Invalid axes input dims.")},Au=e=>["","",`var value = ${e.getByIndices("input_indices")};`,""],ci=(e,t,r,i,n,a,s=!1,o=!1)=>{let u=[],d=r[0].dims,c=d.length,h=P.normalizeAxes(n,c),m=!o&&h.length===0;d.forEach(($,v)=>{m||h.indexOf(v)>=0?s&&u.push(1):u.push($)});let g=u.length,f=P.size(u);return{name:e,shaderCache:t,getShaderSource:$=>{let v=[],b=q("_A",r[0].dataType,c),w=ue("output",a,g),k=i(b,w,h),S=k[2];for(let T=0,E=0;T<c;T++)m||h.indexOf(T)>=0?(s&&E++,S=`for(var j${T}: u32 = 0; j${T} < ${d[T]}; j${T}++) {
                  ${k[2].includes("last_index")?`let last_index = j${T};`:""}
                  ${b.indicesSet("input_indices",T,`j${T}`)}
                  ${S}
                }`):(v.push(`${b.indicesSet("input_indices",T,w.indicesGet("output_indices",E))};`),E++);return`

        ${$.registerUniform("output_size","u32").declareVariables(b,w)}

        ${$.mainStart()}
          ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${b.type.indices};
          let output_indices = ${w.offsetToIndices("global_idx")};

          ${v.join(`
`)}
          ${k[0]}       // init ops for reduce max/min
          ${k[1]}
          ${S}
          ${k[3]}
          ${k.length===4?w.setByOffset("global_idx","value"):k.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:u,dataType:a}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:[{type:12,data:f},...ce(d,u)]})}},ea=(e,t)=>{let r=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(i=>r.push(Number(i))),Ce({axes:r,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},it=(e,t,r,i)=>{let n=e.inputs,a=n.length===1?r:ea(n,r);e.compute(ci(t,{hint:a.cacheKey,inputDependencies:["rank"]},[n[0]],a.noopWithEmptyAxes&&a.axes.length===0?Au:i,a.axes,n[0].dataType,a.keepDims,a.noopWithEmptyAxes),{inputs:[0]})},Mu=(e,t)=>{rt(e.inputs),it(e,"ReduceLogSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,"value = log(value);"])},Ou=(e,t)=>{rt(e.inputs),it(e,"ReduceL1",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += abs(${r.getByIndices("input_indices")});`,""])},Bu=(e,t)=>{rt(e.inputs),it(e,"ReduceL2",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},Ru=(e,t)=>{rt(e.inputs),it(e,"ReduceLogSumExp",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += exp(${r.getByIndices("input_indices")});`,"value = log(value);"])},Du=(e,t)=>{rt(e.inputs),it(e,"ReduceMax",t,(r,i,n)=>{let a=[];for(let s=0;s<r.rank;s++)(n.indexOf(s)>=0||n.length===0)&&a.push(r.indicesSet("input_indices",s,0));return[`${a.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = max(value, ${r.getByIndices("input_indices")});`,""]})},Nu=(e,t)=>{rt(e.inputs),it(e,"ReduceMean",t,(r,i,n)=>{let a=1;for(let s=0;s<r.rank;s++)(n.indexOf(s)>=0||n.length===0)&&(a*=e.inputs[0].dims[s]);return["var sum = f32(0);","",`sum += f32(${r.getByIndices("input_indices")});`,`let value = ${i.type.value}(sum / ${a});`]})},Uu=(e,t)=>{rt(e.inputs),it(e,"ReduceMin",t,(r,i,n)=>{let a=[];for(let s=0;s<r.rank;s++)(n.indexOf(s)>=0||n.length===0)&&a.push(`input_indices[${s}] = 0;`);return[`${a.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = min(value, ${r.getByIndices("input_indices")});`,""]})},Pu=(e,t)=>{rt(e.inputs),it(e,"ReduceProd",t,(r,i)=>[`var value = ${i.type.storage}(1);`,"",`value *= ${r.getByIndices("input_indices")};`,""])},Lu=(e,t)=>{rt(e.inputs),it(e,"ReduceSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,""])},Wu=(e,t)=>{rt(e.inputs),it(e,"ReduceSumSquare",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += t * t;`,""])},nt=(e,t,r)=>{if(t.length===0)return r;let i=1,n=1;for(let a=0;a<t.length;a++)t.indexOf(a)===-1?i*=e[a]:n*=e[a];return n<32&&i>1024},Cp=(e,t)=>{nt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Nu(e,t):wp(e,t)},Ep=(e,t)=>{nt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Ou(e,t):_p(e,t)},zp=(e,t)=>{nt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Bu(e,t):bp(e,t)},Ap=(e,t)=>{nt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Ru(e,t):$p(e,t)},Mp=(e,t)=>{nt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Du(e,t):vp(e,t)},Op=(e,t)=>{nt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Uu(e,t):xp(e,t)},Bp=(e,t)=>{nt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Pu(e,t):kp(e,t)},Rp=(e,t)=>{nt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Lu(e,t):Sp(e,t)},Dp=(e,t)=>{nt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Wu(e,t):Tp(e,t)},Np=(e,t)=>{nt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Mu(e,t):Ip(e,t)}}),ln,Up,Pp,ta,ly=J(()=>{"use strict";fe(),Re(),Ea(),ln=e=>{if(!e||e.length===0||e.length>2)throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(e[0].dataType!==1)throw new Error("Invalid input type.")},Up=(e,t)=>{ln(e.inputs);let r=(i,n,a)=>{let s=[];for(let o=0;o<i.rank;o++)(a.indexOf(o)>=0||a.length===0)&&s.push(`input_indices[${o}] = 0;`);return[`${s.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?"<=":"<"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",n.setByOffset("global_idx","best_index")]};e.compute(ci("ArgMin",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},Pp=(e,t)=>{ln(e.inputs);let r=(i,n,a)=>{let s=[];for(let o=0;o<i.rank;o++)(a.indexOf(o)>=0||a.length===0)&&s.push(`input_indices[${o}] = 0;`);return[`${s.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?">=":">"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",n.setByOffset("global_idx","best_index")]};e.compute(ci("argMax",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},ta=e=>Ce(e)}),qu,Zr,Gu,Vu,Hu,zr,Fu,Lp,za=J(()=>{"use strict";fe(),ge(),Ia(),ye(),qu=(e,t)=>{let r=e[0],i=e[1],n=e[2],a=e[3],s=e[4],o=e[5];if(s&&o)throw new Error("Attention cannot have both past and attention_bias");if(r.dims.length!==3)throw new Error('Input "input" must have 3 dimensions');let u=r.dims[0],d=r.dims[1],c=r.dims[2];if(n.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimensions');if(i.dims.length!==2)throw new Error('Input "weights" is expected to have 2 dimensions');if(i.dims[0]!==c)throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(n.dims[0]!==i.dims[1])throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let h=n.dims[0]/3,m=h,g=m;if(t.qkvHiddenSizes.length>0){if(t.qkvHiddenSizes.length!==3)throw new Error("qkv_hidden_sizes attribute should have 3 elements");for(let k of t.qkvHiddenSizes)if(k%t.numHeads!==0)throw new Error("qkv_hidden_sizes should be divisible by num_heads");h=t.qkvHiddenSizes[0],m=t.qkvHiddenSizes[1],g=t.qkvHiddenSizes[2]}let f=d;if(h!==m)throw new Error("qkv_hidden_sizes first element should be same as the second");if(n.dims[0]!==h+m+g)throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let $=0;if(s){if(m!==g)throw new Error('Input "past" expect k_hidden_size == v_hidden_size');if(s.dims.length!==5)throw new Error('Input "past" must have 5 dimensions');if(s.dims[0]!==2)throw new Error('Input "past" first dimension must be 2');if(s.dims[1]!==u)throw new Error('Input "past" second dimension must be batch_size');if(s.dims[2]!==t.numHeads)throw new Error('Input "past" third dimension must be num_heads');if(s.dims[4]!==m/t.numHeads)throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');t.pastPresentShareBuffer||($=s.dims[3])}let v=f+$,b=-1,w=0;if(a)throw new Error("Mask not supported");if(s)throw new Error("past is not supported");if(o){if(o.dims.length!==4)throw new Error('Input "attention_bias" must have 4 dimensions');if(o.dims[0]!==u||o.dims[1]!==t.numHeads||o.dims[2]!==d||o.dims[3]!==v)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:u,sequenceLength:d,pastSequenceLength:$,kvSequenceLength:f,totalSequenceLength:v,maxSequenceLength:b,inputHiddenSize:c,hiddenSize:h,vHiddenSize:g,headSize:Math.floor(h/t.numHeads),vHeadSize:Math.floor(g/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:w,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},Zr=(e,t,r)=>t&&e?`
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
    `,Gu=(e,t,r,i,n,a,s,o)=>{let u=Be(s?1:a),d=64,c=a/u;c<d&&(d=32);let h=Math.ceil(a/u/d),m=[{type:12,data:t},{type:12,data:r},{type:12,data:i},{type:12,data:n},{type:12,data:c},{type:12,data:h}],g=We(e.dataType,u),f=Le(1,u),$=["type"];s&&$.push("type"),o&&$.push("type");let v=b=>{let w=ue("x",e.dataType,e.dims,u),k=[w],S=s?q("seq_lens",s.dataType,s.dims):void 0;S&&k.push(S);let T=o?q("total_sequence_length_input",o.dataType,o.dims):void 0;T&&k.push(T);let E=Le(e.dataType),C=[{name:"batch_size",type:"u32"},{name:"num_heads",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"sequence_length",type:"u32"},{name:"total_sequence_length",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${d}>;
  var<workgroup> thread_sum: array<f32, ${d}>;
  ${b.registerUniforms(C).declareVariables(...k)}
  ${b.mainStart([d,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${Zr(S,T,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${d}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${s?"u32(past_sequence_length + workgroup_id.y + 1)":"total_sequence_length"};
    var thread_max_vector = ${f}(-3.4028234663852886e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${f}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(u){case 1:return"thread_max_vector";case 2:return"max(thread_max_vector.x, thread_max_vector.y)";case 4:return"max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";default:throw new Error(`Unsupported components: ${u}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.4028234663852886e+38f);
    for (var i = 0u; i < ${d}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${f}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${f}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(u){case 1:return"sum_vector";case 2:return"sum_vector.x + sum_vector.y";case 4:return"sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";default:throw new Error(`Unsupported components: ${u}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${d}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${w.type.value}(${E}(1.0) / ${E}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${f}(x[offset + i]);
        x[offset + i] = ${w.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${s?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${w.type.value}(${E}(0));
        }`:""};
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${d};${g};${u}`,inputDependencies:$},getShaderSource:v,getRunData:()=>({outputs:[],dispatchGroup:{x:1,y:n,z:t*r},programUniforms:m})}},Vu=(e,t,r,i,n,a,s,o,u)=>{let d=s+a.kvSequenceLength,c=[a.batchSize,a.numHeads,a.sequenceLength,d],h=e>1&&i,m=a.kvNumHeads?a.kvNumHeads:a.numHeads,g=h?[a.batchSize,m,d,a.headSize]:void 0,f=a.nReps?a.nReps:1,$=a.scale===0?1/Math.sqrt(a.headSize):a.scale,v=Be(a.headSize),b=a.headSize/v,w=12,k={x:Math.ceil(d/w),y:Math.ceil(a.sequenceLength/w),z:a.batchSize*a.numHeads},S=[{type:12,data:a.sequenceLength},{type:12,data:b},{type:12,data:d},{type:12,data:a.numHeads},{type:12,data:a.headSize},{type:1,data:$},{type:12,data:s},{type:12,data:a.kvSequenceLength},{type:12,data:f}],T=h&&i&&P.size(i.dims)>0,E=["type","type"];T&&E.push("type"),n&&E.push("type"),o&&E.push("type"),u&&E.push("type");let C=[{dims:c,dataType:t.dataType,gpuDataType:0}];h&&C.push({dims:g,dataType:t.dataType,gpuDataType:0});let x=M=>{let U=q("q",t.dataType,t.dims,v),O=q("key",r.dataType,r.dims,v),D=[U,O];if(T){let ae=q("past_key",i.dataType,i.dims,v);D.push(ae)}n&&D.push(q("attention_bias",n.dataType,n.dims));let V=o?q("seq_lens",o.dataType,o.dims):void 0;V&&D.push(V);let A=u?q("total_sequence_length_input",u.dataType,u.dims):void 0;A&&D.push(A);let G=ue("output",t.dataType,c),F=[G];h&&F.push(ue("present_key",t.dataType,g,v));let L=Le(1,v),re=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${w}u;

  var<workgroup> tileQ: array<${U.type.storage}, ${w*w}>;
  var<workgroup> tileK: array<${U.type.storage}, ${w*w}>;
  ${M.registerUniforms(re).declareVariables(...D,...F)}
  ${M.mainStart([w,w,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${f===1?"headIdx":"headIdx / uniforms.n_reps"};
    let kv_num_heads = ${f===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${Zr(V,A,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${T&&h?"let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;":""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${h?"let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;":""}
    var value = ${L}(0);
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
          value += ${L}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(v){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw new Error(`Unsupported components: ${v}`)}})()};
        output[outputIdx] = ${G.type.value} (sum * uniforms.alpha) + ${n?"attention_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${v};${n!==void 0};${i!==void 0};${e}`,inputDependencies:E},getRunData:()=>({outputs:C,dispatchGroup:k,programUniforms:S}),getShaderSource:x}},Hu=(e,t,r,i,n,a,s=void 0,o=void 0)=>{let u=a+n.kvSequenceLength,d=n.nReps?n.nReps:1,c=n.vHiddenSize*d,h=e>1&&i,m=n.kvNumHeads?n.kvNumHeads:n.numHeads,g=h?[n.batchSize,m,u,n.headSize]:void 0,f=[n.batchSize,n.sequenceLength,c],$=12,v={x:Math.ceil(n.vHeadSize/$),y:Math.ceil(n.sequenceLength/$),z:n.batchSize*n.numHeads},b=[{type:12,data:n.sequenceLength},{type:12,data:u},{type:12,data:n.vHeadSize},{type:12,data:n.numHeads},{type:12,data:n.headSize},{type:12,data:c},{type:12,data:a},{type:12,data:n.kvSequenceLength},{type:12,data:d}],w=h&&i&&P.size(i.dims)>0,k=["type","type"];w&&k.push("type"),s&&k.push("type"),o&&k.push("type");let S=[{dims:f,dataType:t.dataType,gpuDataType:0}];h&&S.push({dims:g,dataType:t.dataType,gpuDataType:0});let T=E=>{let C=q("probs",t.dataType,t.dims),x=q("v",r.dataType,r.dims),M=[C,x];w&&M.push(q("past_value",i.dataType,i.dims));let U=s?q("seq_lens",s.dataType,s.dims):void 0;s&&M.push(U);let O=o?q("total_sequence_length_input",o.dataType,o.dims):void 0;o&&M.push(O);let D=[ue("output",t.dataType,f)];h&&D.push(ue("present_value",t.dataType,g));let V=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${$}u;
  var<workgroup> tileQ: array<${C.type.value}, ${$*$}>;
  var<workgroup> tileV: array<${C.type.value}, ${$*$}>;
  ${E.registerUniforms(V).declareVariables(...M,...D)}
  ${E.mainStart([$,$,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${d===1?"headIdx":"headIdx / uniforms.n_reps"};
   let kv_num_heads = ${d===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${Zr(U,O,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${w&&h?"let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;":""};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${h?"let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;":""}
   var value = ${C.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${w&&h?`
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
  }`};return{name:"AttentionScore",shaderCache:{hint:`${i!==void 0};${e}`,inputDependencies:k},getRunData:()=>({outputs:S,dispatchGroup:v,programUniforms:b}),getShaderSource:T}},zr=(e,t,r,i,n,a,s,o,u,d,c=void 0,h=void 0)=>{let m=Math.min(e.outputCount,1+(s?1:0)+(o?1:0)),g=m>1?s:void 0,f=m>1?o:void 0,$=m>1?d.pastSequenceLength:0,v=$+d.kvSequenceLength,b=u&&P.size(u.dims)>0?u:void 0,w=[t,r];g&&P.size(g.dims)>0&&w.push(g),b&&w.push(b),c&&w.push(c),h&&w.push(h);let k=e.compute(Vu(m,t,r,g,b,d,$,c,h),{inputs:w,outputs:m>1?[-1,1]:[-1]})[0];e.compute(Gu(k,d.batchSize,d.numHeads,$,d.sequenceLength,v,c,h),{inputs:c&&h?[k,c,h]:[k],outputs:[]});let S=[k,i];f&&P.size(f.dims)>0&&S.push(f),c&&S.push(c),h&&S.push(h),e.compute(Hu(m,k,i,f,d,$,c,h),{inputs:S,outputs:m>1?[0,2]:[0]})},Fu=(e,t)=>{let r=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],i=t.sequenceLength,n=t.inputHiddenSize,a=t.headSize,s=12,o={x:Math.ceil(t.headSize/s),y:Math.ceil(t.sequenceLength/s),z:t.batchSize*t.numHeads},u=[e.inputs[0],e.inputs[1],e.inputs[2]],d=[{type:12,data:i},{type:12,data:n},{type:12,data:a},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}],c=h=>{let m=ue("output_q",u[0].dataType,r),g=ue("output_k",u[0].dataType,r),f=ue("output_v",u[0].dataType,r),$=q("input",u[0].dataType,u[0].dims),v=q("weight",u[1].dataType,u[1].dims),b=q("bias",u[2].dataType,u[2].dims),w=$.type.storage,k=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
  const TILE_SIZE = ${s}u;
  var<workgroup> tileInput: array<${w}, ${s*s}>;
  var<workgroup> tileWeightQ: array<${w}, ${s*s}>;
  var<workgroup> tileWeightK: array<${w}, ${s*s}>;
  var<workgroup> tileWeightV: array<${w}, ${s*s}>;
  ${h.registerUniforms(k).declareVariables($,v,b,m,g,f)}
  ${h.mainStart([s,s,1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${w}(0);
    var valueK = ${w}(0);
    var valueV = ${w}(0);
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
  }`};return e.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:o,programUniforms:d}),getShaderSource:c},{inputs:u,outputs:[-1,-1,-1]})},Lp=(e,t)=>{let r=qu(e.inputs,t),[i,n,a]=Fu(e,r);return zr(e,i,n,a,e.inputs[4],void 0,void 0,void 0,e.inputs[5],r)}}),ju,Ku,Zu,Wp,dy=J(()=>{"use strict";Ye(),fe(),ge(),Re(),ye(),ju=(e,t)=>{if(!e||e.length!==5)throw new Error("BatchNormalization requires 5 inputs");let r=(i,n,a)=>{let s=n.length;if(s!==i.length)throw new Error(`${a}: num dimensions != ${s}`);n.forEach((o,u)=>{if(o!==i[u])throw new Error(`${a}: dim[${u}] do not match`)})};if(e[0].dims.length>1){let i=t.format==="NHWC"?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);r(e[1].dims,i,"Invalid input scale"),r(e[2].dims,i,"Invalid input B"),r(e[3].dims,i,"Invalid input mean"),r(e[4].dims,i,"Invalid input var")}else r(e[1].dims,[1],"Invalid input scale"),r(e[2].dims,[1],"Invalid input B"),r(e[3].dims,[1],"Invalid input mean"),r(e[4].dims,[1],"Invalid input var")},Ku=(e,t)=>{let{epsilon:r,spatial:i,format:n}=t,a=e[0].dims,s=i?Be(a[a.length-1]):1,o=n==="NHWC"&&a.length>1?s:1,u=P.size(a)/s,d=i,c=d?a.length:a,h=q("x",e[0].dataType,e[0].dims,s),m=q("scale",e[1].dataType,e[1].dims,o),g=q("bias",e[2].dataType,e[2].dims,o),f=q("inputMean",e[3].dataType,e[3].dims,o),$=q("inputVar",e[4].dataType,e[4].dims,o),v=ue("y",e[0].dataType,c,s),b=()=>{let k="";if(i)k=`let cOffset = ${a.length===1?"0u":n==="NHWC"?`outputIndices[${a.length-1}] / ${s}`:"outputIndices[1]"};`;else if(n==="NCHW")k=`
            ${v.indicesSet("outputIndices","0","0")}
            let cOffset = ${v.indicesToOffset("outputIndices")};`;else{k=`var cIndices = ${m.type.indices}(0);
                       cIndices[0] = outputIndices[${a.length-1}];`;for(let S=1;S<m.rank;S++)k+=`cIndices[${S}] = outputIndices[${S}];`;k+=`let cOffset = ${m.indicesToOffset("cIndices")};`}return k},w=k=>`
  const epsilon = ${r};
  ${k.registerUniform("outputSize","u32").declareVariables(h,m,g,f,$,v)}
  ${k.mainStart()}
  ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${v.offsetToIndices(`global_idx * ${s}`)};
    ${b()}
    let scale = ${m.getByOffset("cOffset")};
    let bias = ${g.getByOffset("cOffset")};
    let inputMean = ${f.getByOffset("cOffset")};
    let inputVar = ${$.getByOffset("cOffset")};
    let x = ${h.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${v.setByOffset("global_idx","value")}
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${t.epsilon}_${t.format}_${i}_${s}`,inputDependencies:d?["rank","type","type","type","type"]:void 0},getShaderSource:w,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:d?[{type:12,data:u},...ce(a)]:[{type:12,data:u}]})}},Zu=e=>Ce(e),Wp=(e,t)=>{let{inputs:r,outputCount:i}=e,n=Zu({...t,outputCount:i});if(Ee.webgpu.validateInputContent&&ju(r,n),t.trainingMode)throw new Error("BatchNormalization trainingMode is not supported yet.");e.compute(Ku(r,n))}}),Yu,Qu,qp,cy=J(()=>{"use strict";ge(),ye(),Yu=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![320,640,1280].includes(e[0].dims[2]))throw new Error("number of channels should be 320, 640 or 1280");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},Qu=e=>{let t=e[0].dims,r=e[0].dims[2],i=P.size(t)/4,n=e[0].dataType,a=q("input",n,t,4),s=q("bias",n,[r],4),o=q("residual",n,t,4),u=ue("output",n,t,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)}}),getShaderSource:d=>`
  const channels = ${r}u / 4;
  ${d.declareVariables(a,s,o,u)}

  ${d.mainStart()}
    ${d.guardAgainstOutOfBoundsWorkgroupSizes(i)}
    let value = ${a.getByOffset("global_idx")}
      + ${s.getByOffset("global_idx % channels")} + ${o.getByOffset("global_idx")};
    ${u.setByOffset("global_idx","value")}
  }`}},qp=e=>{Yu(e.inputs),e.compute(Qu(e.inputs))}}),Xu,Te,Gp,Vp,Hp,Fp,jp,Kp,Zp,Yp,Qp,Ju,Xp,Jp,eh,th,kr,rh,si,ih,nh,ah,sh,oh,uh,lh,dh,ch,ph,hh,fh,mh,gh,yh,wh,_h,dn,bh,ra,ia,$h,vh,xh,el,tl,kh,Aa=J(()=>{"use strict";fe(),ge(),Re(),ye(),Xu=(e,t,r,i,n,a,s)=>{let o=Math.ceil(t/4),u="";typeof n=="string"?u=`${n}(a)`:u=n("a");let d=q("inputData",r,[o],4),c=ue("outputData",i,[o],4),h=[{name:"vec_size",type:"u32"}];return s&&h.push(...s),`
      ${e.registerUniforms(h).declareVariables(d,c)}

  ${a??""}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${d.getByOffset("global_idx")};
    ${c.setByOffset("global_idx",u)}
  }`},Te=(e,t,r,i,n,a=e.dataType,s,o)=>{let u=[{type:12,data:Math.ceil(P.size(e.dims)/4)}];return s&&u.push(...s),{name:t,shaderCache:{hint:n,inputDependencies:["type"]},getShaderSource:d=>Xu(d,P.size(e.dims),e.dataType,a,r,i,o),getRunData:d=>({outputs:[{dims:e.dims,dataType:a}],dispatchGroup:{x:Math.ceil(P.size(d[0].dims)/64/4)},programUniforms:u})}},Gp=e=>{e.compute(Te(e.inputs[0],"Abs","abs"))},Vp=e=>{e.compute(Te(e.inputs[0],"Acos","acos"))},Hp=e=>{e.compute(Te(e.inputs[0],"Acosh","acosh"))},Fp=e=>{e.compute(Te(e.inputs[0],"Asin","asin"))},jp=e=>{e.compute(Te(e.inputs[0],"Asinh","asinh"))},Kp=e=>{e.compute(Te(e.inputs[0],"Atan","atan"))},Zp=e=>{e.compute(Te(e.inputs[0],"Atanh","atanh"))},Yp=e=>Ce(e),Qp=(e,t)=>{let r;switch(t.to){case 10:r="vec4<f16>";break;case 1:r="vec4<f32>";break;case 12:r="vec4<u32>";break;case 6:r="vec4<i32>";break;case 9:r="vec4<bool>";break;default:throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute(Te(e.inputs[0],"Cast",r,void 0,t.cacheKey,t.to))},Ju=e=>{let t,r,i=e.length>=2&&e[1].data!==0,n=e.length>=3&&e[2].data!==0;switch(e[0].dataType){case 1:t=i?e[1].getFloat32Array()[0]:-34028234663852886e22,r=n?e[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:t=i?e[1].getUint16Array()[0]:64511,r=n?e[2].getUint16Array()[0]:31743;break;default:throw new Error("Unsupport data type")}return Ce({min:t,max:r})},Xp=(e,t)=>{let r=t||Ju(e.inputs),i=Le(e.inputs[0].dataType);e.compute(Te(e.inputs[0],"Clip",n=>`clamp(${n}, vec4<${i}>(uniforms.min), vec4<${i}>(uniforms.max))`,void 0,r.cacheKey,void 0,[{type:e.inputs[0].dataType,data:r.min},{type:e.inputs[0].dataType,data:r.max}],[{name:"min",type:i},{name:"max",type:i}]),{inputs:[0]})},Jp=e=>{e.compute(Te(e.inputs[0],"Ceil","ceil"))},eh=e=>{e.compute(Te(e.inputs[0],"Cos","cos"))},th=e=>{e.compute(Te(e.inputs[0],"Cosh","cosh"))},kr=e=>Ce(e),rh=(e,t)=>{let r=Le(e.inputs[0].dataType);e.compute(Te(e.inputs[0],"Elu",i=>`elu_vf32(${i})`,`
  const elu_alpha_ = ${r}(${t.alpha});

  fn elu_f32(a: ${r}) -> ${r} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${r}>) -> vec4<${r}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,t.cacheKey))},si=(e="f32")=>`
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
}`,ih=e=>{let t=Le(e.inputs[0].dataType);e.compute(Te(e.inputs[0],"Erf",r=>`erf_vf32(${r})`,si(t)))},nh=e=>{e.compute(Te(e.inputs[0],"Exp","exp"))},ah=e=>{e.compute(Te(e.inputs[0],"Floor","floor"))},sh=e=>{let t=Le(e.inputs[0].dataType);e.compute(Te(e.inputs[0],"Gelu",r=>`0.5 * ${r} * (1.0 + erf_vf32(${r} * 0.7071067811865475))`,si(t)))},oh=(e,t)=>{let r=Le(e.inputs[0].dataType);e.compute(Te(e.inputs[0],"LeakyRelu",i=>`select(leaky_relu_alpha_ * ${i}, ${i}, ${i} >= vec4<${r}>(0.0))`,`const leaky_relu_alpha_ = ${r}(${t.alpha});`,t.cacheKey))},uh=e=>{e.compute(Te(e.inputs[0],"Not",t=>`!${t}`))},lh=e=>{e.compute(Te(e.inputs[0],"Neg",t=>`-${t}`))},dh=e=>{e.compute(Te(e.inputs[0],"Reciprocal",t=>`1.0/${t}`))},ch=e=>{let t=Le(e.inputs[0].dataType);e.compute(Te(e.inputs[0],"Relu",r=>`select(vec4<${t}>(0.0), ${r}, ${r} > vec4<${t}>(0.0))`))},ph=e=>{e.compute(Te(e.inputs[0],"Sigmoid",t=>`(1.0 / (1.0 + exp(-${t})))`))},hh=e=>Ce(e),fh=(e,t)=>{let r=Le(e.inputs[0].dataType);e.compute(Te(e.inputs[0],"HardSigmoid",i=>`max(vec4<${r}>(0.0), min(vec4<${r}>(1.0), ${t.alpha} * ${i} + vec4<${r}>(${t.beta})))`,void 0,t.cacheKey))},mh=e=>{let t=Le(e.inputs[0].dataType);e.compute(Te(e.inputs[0],"HardSwish",r=>`${r} * max(vec4<${t}>(0.0), min(vec4<${t}>(1.0), vec4<${t}>(${t}(1.0 / 6.0)) * ${r} + vec4<${t}>(0.5)))`))},gh=e=>{e.compute(Te(e.inputs[0],"Sin","sin"))},yh=e=>{e.compute(Te(e.inputs[0],"Sinh","sinh"))},wh=e=>{e.compute(Te(e.inputs[0],"Sqrt","sqrt"))},_h=e=>{e.compute(Te(e.inputs[0],"Tan","tan"))},dn=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,bh=e=>{e.compute(Te(e.inputs[0],"Tanh",dn))},ra=(e="f32")=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${dn("v")};
}
`,ia=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,$h=e=>{let t=Le(e.inputs[0].dataType);e.compute(Te(e.inputs[0],"FastGelu",ia,ra(t),void 0,e.inputs[0].dataType))},vh=(e,t)=>{let r=Le(e.inputs[0].dataType);return e.compute(Te(e.inputs[0],"ThresholdedRelu",i=>`select(vec4<${r}>(0.0), ${i}, ${i} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${r}>(${t.alpha});`,t.cacheKey)),0},xh=e=>{e.compute(Te(e.inputs[0],"Log","log"))},el=(e,t)=>`
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
`,tl=e=>`quick_gelu_impl(${e})`,kh=(e,t)=>{let r=Le(e.inputs[0].dataType);e.compute(Te(e.inputs[0],"QuickGelu",tl,el(r,t.alpha),t.cacheKey,e.inputs[0].dataType))}}),rl,il,Sh,py=J(()=>{"use strict";ge(),ye(),Aa(),rl=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![2560,5120,10240].includes(e[0].dims[2]))throw new Error("hidden state should be 2560, 5120 or 10240");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},il=e=>{let t=e[0].dims.slice();t[2]=t[2]/2;let r=q("input",e[0].dataType,e[0].dims,4),i=q("bias",e[0].dataType,[e[0].dims[2]],4),n=ue("output",e[0].dataType,t,4),a=P.size(t)/4,s=We(e[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)}}),getShaderSource:o=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2]/4/2}u;

  ${o.declareVariables(r,i,n)}

  ${si(s)}

  ${o.mainStart()}
    ${o.guardAgainstOutOfBoundsWorkgroupSizes(a)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${n.setByOffset("global_idx","valueLeft * geluRight")}
  }`}},Sh=e=>{rl(e.inputs),e.compute(il(e.inputs))}}),nl,al,at,Th,Ih,Ch,Eh,zh,Ah,Mh,Oh,Bh,Rh,hy=J(()=>{"use strict";fe(),ge(),ye(),nl=(e,t,r,i,n,a,s,o,u,d,c,h)=>{let m,g;typeof o=="string"?m=g=(w,k)=>`${o}((${w}),(${k}))`:typeof o=="function"?m=g=o:(m=o.scalar,g=o.vector);let f=ue("outputData",c,i.length,4),$=q("aData",u,t.length,4),v=q("bData",d,r.length,4),b;if(n)if(a){let w=P.size(t)===1,k=P.size(r)===1,S=t.length>0&&t[t.length-1]%4===0,T=r.length>0&&r[r.length-1]%4===0;w||k?b=f.setByOffset("global_idx",g(w?`${$.type.value}(${$.getByOffset("0")}.x)`:$.getByOffset("global_idx"),k?`${v.type.value}(${v.getByOffset("0")}.x)`:v.getByOffset("global_idx"))):b=`
            let outputIndices = ${f.offsetToIndices("global_idx * 4u")};
            let offsetA = ${$.broadcastedIndicesToOffset("outputIndices",f)};
            let offsetB = ${v.broadcastedIndicesToOffset("outputIndices",f)};
            ${f.setByOffset("global_idx",g(s||S?$.getByOffset("offsetA / 4u"):`${$.type.value}(${$.getByOffset("offsetA / 4u")}[offsetA % 4u])`,s||T?v.getByOffset("offsetB / 4u"):`${v.type.value}(${v.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else b=f.setByOffset("global_idx",g($.getByOffset("global_idx"),v.getByOffset("global_idx")));else{if(!a)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");let w=(k,S,T="")=>{let E=`aData[indexA${S}][componentA${S}]`,C=`bData[indexB${S}][componentB${S}]`;return`
            let outputIndices${S} = ${f.offsetToIndices(`global_idx * 4u + ${S}u`)};
            let offsetA${S} = ${$.broadcastedIndicesToOffset(`outputIndices${S}`,f)};
            let offsetB${S} = ${v.broadcastedIndicesToOffset(`outputIndices${S}`,f)};
            let indexA${S} = offsetA${S} / 4u;
            let indexB${S} = offsetB${S} / 4u;
            let componentA${S} = offsetA${S} % 4u;
            let componentB${S} = offsetB${S} % 4u;
            ${k}[${S}] = ${T}(${m(E,C)});
          `};c===9?b=`
            var data = vec4<u32>(0);
            ${w("data",0,"u32")}
            ${w("data",1,"u32")}
            ${w("data",2,"u32")}
            ${w("data",3,"u32")}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:b=`
            ${w("outputData[global_idx]",0)}
            ${w("outputData[global_idx]",1)}
            ${w("outputData[global_idx]",2)}
            ${w("outputData[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables($,v,f)}

        ${h??""}

        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${b}
      }`},al=(e,t,r,i,n,a,s=r.dataType)=>{let o=r.dims.map(Number),u=i.dims.map(Number),d=!P.areEqual(o,u),c=o,h=P.size(o),m=!1,g=!1,f=[d];if(d){let $=ar.calcShape(o,u,!1);if(!$)throw new Error("Can't perform binary op on the given tensors");c=$.slice(),h=P.size(c);let v=P.size(o)===1,b=P.size(u)===1,w=o.length>0&&o[o.length-1]%4===0,k=u.length>0&&u[u.length-1]%4===0;f.push(v),f.push(b),f.push(w),f.push(k);let S=1;for(let T=1;T<c.length;T++){let E=o[o.length-T],C=u[u.length-T];if(E===C)S*=E;else break}S%4===0?(g=!0,m=!0):(v||b||w||k)&&(m=!0)}else m=!0;return f.push(m),{name:e,shaderCache:{hint:t+f.map($=>$.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:$=>nl($,o,u,c,m,d,g,n,r.dataType,i.dataType,s,a),getRunData:()=>({outputs:[{dims:c,dataType:s}],dispatchGroup:{x:Math.ceil(h/64/4)},programUniforms:[{type:12,data:Math.ceil(P.size(c)/4)},...ce(o,u,c)]})}},at=(e,t,r,i,n,a)=>{e.compute(al(t,n??"",e.inputs[0],e.inputs[1],r,i,a))},Th=e=>{at(e,"Add",(t,r)=>`${t}+${r}`)},Ih=e=>{at(e,"Div",(t,r)=>`${t}/${r}`)},Ch=e=>{at(e,"Equal",{scalar:(t,r)=>`u32(${t}==${r})`,vector:(t,r)=>`vec4<u32>(${t}==${r})`},void 0,void 0,9)},Eh=e=>{at(e,"Mul",(t,r)=>`${t}*${r}`)},zh=e=>{let t=q("input",e.inputs[0].dataType,e.inputs[0].dims).type.value;at(e,"Pow",{scalar:(r,i)=>`pow_custom(${r},${i})`,vector:(r,i)=>`pow_vector_custom(${r},${i})`},`
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
      `)},Ah=e=>{at(e,"Sub",(t,r)=>`${t}-${r}`)},Mh=e=>{at(e,"Greater",{scalar:(t,r)=>`u32(${t}>${r})`,vector:(t,r)=>`vec4<u32>(${t}>${r})`},void 0,void 0,9)},Oh=e=>{at(e,"Less",{scalar:(t,r)=>`u32(${t}<${r})`,vector:(t,r)=>`vec4<u32>(${t}<${r})`},void 0,void 0,9)},Bh=e=>{at(e,"GreaterOrEqual",{scalar:(t,r)=>`u32(${t}>=${r})`,vector:(t,r)=>`vec4<u32>(${t}>=${r})`},void 0,void 0,9)},Rh=e=>{at(e,"LessOrEqual",{scalar:(t,r)=>`u32(${t}<=${r})`,vector:(t,r)=>`vec4<u32>(${t}<=${r})`},void 0,void 0,9)}}),sl,ol,Dh,Nh,fy=J(()=>{"use strict";fe(),ge(),Re(),ye(),sl=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");let r=0,i=e[r],n=i.dataType,a=i.dims.length;e.forEach((s,o)=>{if(o!==r){if(s.dataType!==n)throw new Error("input tensors should be one type");if(s.dims.length!==a)throw new Error("input tensors should have the same shape");s.dims.forEach((u,d)=>{if(d!==t&&u!==i.dims[d])throw new Error("non concat dimensions must match")})}})},ol=(e,t,r,i,n=0)=>{let a=e.reduce((b,w)=>b+P.size(w.dims),0),s=new Array(e.length),o=new Array(e.length),u=new Array(e.length),d=0,c=n,h=[],m=[],g=[{type:12,data:a}];for(let b=0;b<e.length;++b)s[b]=d,o[b]=c,d+=P.size(e[b].dims),c+=e[b].dims[t],m.push(e[b].dims.length),u[b]=q(`input${b}`,i,m[b]),h.push("rank"),g.push({type:12,data:s[b]}),g.push({type:12,data:o[b]});for(let b=0;b<e.length;++b)g.push(...ce(e[b].dims));g.push(...ce(r));let f=ue("output",i,r.length),$=u.map((b,w)=>{let k=`
        let inputOffset = ${`global_idx - uniforms.inputOffset${w}`};
        var outputIndices = ${b.offsetToIndices("inputOffset")};
        ${f.indicesGet("outputIndices",t)} += uniforms.outputAxisOffset${w};
        ${f.setByIndices("outputIndices",b.getByOffset("inputOffset"))}`;return e.length===1?k:w===0?`if (inputIndex == 0u) {${k}}`:w===e.length-1?`else {${k}}`:`else if (inputIndex == ${w}u) {${k}}`}).join(`
`),v=b=>`

  ${(()=>{b.registerUniform("outputSize","u32");for(let w=0;w<e.length;w++)b.registerUniform(`inputOffset${w}`,"u32"),b.registerUniform(`outputAxisOffset${w}`,"u32");return b.declareVariables(...u,f)})()}

  fn calculateInputIndex(global_idx: u32) -> u32 {
    ${u.slice(1).map((w,k)=>`if (global_idx < uniforms.inputOffset${k+1}) {
      return ${k}u;
    }`).join(`
`)}
    return ${e.length-1}u;
  }

  ${b.mainStart()}
    ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    let inputIndex = calculateInputIndex(global_idx);
    ${$}
  }`;return{name:"Concat",shaderCache:{hint:`${t}`,inputDependencies:h},getRunData:()=>({outputs:[{dims:r,dataType:i}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:g}),getShaderSource:v}},Dh=(e,t)=>{let r=e.inputs,i=r[0].dims,n=P.normalizeAxis(t.axis,i.length);sl(r,n);let a=i.slice();a[n]=r.reduce((d,c)=>d+(c.dims.length>n?c.dims[n]:0),0);let s=r.filter(d=>P.size(d.dims)>0);if(s.length===0){e.output(0,a);return}let o=e.deviceLimits.maxStorageBuffersPerShaderStage-1,u=0;for(let d=0;d<s.length;d+=o){let c=s.slice(d,d+o);e.compute(ol(c,n,a,r[0].dataType,u),{inputs:c,outputs:[0]}),u+=c.reduce((h,m)=>h+m.dims[n],0)}},Nh=e=>Ce({axis:e.axis})}),qt,Gt,Vt,Ma,Ft=J(()=>{"use strict";fe(),ge(),qt=(e,t,r="f32")=>{switch(e.activation){case"Relu":return`value = max(value, ${t}(0.0));`;case"Sigmoid":return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${t}(${r}(uniforms.clip_min)), ${t}(${r}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${t}(0.0), min(${t}(1.0), ${r}(uniforms.alpha) * value + ${r}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${r}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw new Error(`Unsupported activation ${e.activation}`)}},Gt=(e,t)=>{e.activation==="Clip"?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):e.activation==="HardSigmoid"?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):e.activation==="LeakyRelu"&&t.push({type:1,data:e.alpha})},Vt=(e,t)=>{e.activation==="Clip"?t.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):e.activation==="HardSigmoid"?t.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):e.activation==="LeakyRelu"&&t.push({name:"alpha",type:"f32"})},Ma=e=>{let t=e?.activation||"";if(t==="HardSigmoid"){let[r,i]=e?.activation_params||[.2,.5];return{activation:t,alpha:r,beta:i}}else if(t==="Clip"){let[r,i]=e?.activation_params||[up,lp];return{activation:t,clipMax:i,clipMin:r}}else if(t==="LeakyRelu"){let[r]=e?.activation_params||[.01];return{activation:t,alpha:r}}return{activation:t}}}),Ge,Uh,Oa=J(()=>{"use strict";Ge=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw new Error(`${e}-component is not supported.`)}},Uh=e=>`
      ${e?"value = value + getBiasByOutputCoords(coords);":""}
      `}),Ph,my=J(()=>{"use strict";Ph=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`}),Tr,Ba,Ra=J(()=>{"use strict";fe(),ge(),ye(),Ft(),Tr=(e,t,r,i,n)=>{let a=i-r;return`
      ${Array.from({length:r}).map((s,o)=>`
      if (${de(t.shape,o,t.rank)} != 1) {
        ${t.indicesSet(e,o,de(n,o+a,i))}
      } else {
        ${t.indicesSet(e,o,0)}
      }`).join("")}
`},Ba=(e,t,r,i,n=!1,a)=>{let s=e[0].dims,o=e[1].dims,u=s[s.length-2],d=o[o.length-1],c=s[s.length-1],h=Be(d),m=Be(c),g=Be(u),f=P.size(r)/h/g,$=e.length>2,v=i?i.slice(0,-2):r.slice(0,-2),b=[P.size(v),u,d],w=[{type:12,data:f},{type:12,data:u},{type:12,data:d},{type:12,data:c}];Gt(t,w),w.push(...ce(v,s,o)),$&&w.push(...ce(e[2].dims)),w.push(...ce(b));let k=S=>{let T=Ca("batch_dims",e[0].dataType,v.length),E=q("a",e[0].dataType,s.length,m),C=q("b",e[1].dataType,o.length,h),x=ue("output",e[0].dataType,b.length,h),M=We(x.type.tensor),U=qt(t,x.type.value,M),O=[E,C],D="";if($){let G=n?h:1;O.push(q("bias",e[2].dataType,e[2].dims.length,G)),D=`${n?`value += bias[col / ${G}];`:`value += ${x.type.value}(bias[row + i]);`}`}let V=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];Vt(t,V);let A=()=>{let G=`var a_data: ${E.type.value};`;for(let F=0;F<m;F++)G+=`
              let b_data${F} = b[(b_offset + (k + ${F}) * uniforms.N + col) / ${h}];`;for(let F=0;F<g;F++){G+=`a_data = a[(a_offset + (row + ${F}) * uniforms.K + k) / ${m}];`;for(let L=0;L<m;L++)G+=`
            values[${F}] = fma(${C.type.value}(a_data${m===1?"":`[${L}]`}), b_data${L}, values[${F}]);
`}return G};return`
  ${S.registerUniforms(V).registerInternalVariables(T).declareVariables(...O,x)}
  ${S.mainStart()}
    ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${h})) * ${h};
    var index1 = global_idx / (uniforms.N / ${h});
    let stride1 = uniforms.M / ${g};
    let row = (index1 % stride1) * ${g};
    let batch = index1 / stride1;

    ${r.length===2?"":`let batch_indices = ${T.offsetToIndices("batch")};`}

    var a_indices: ${E.type.indices};
    ${Tr("a_indices",E,E.rank-2,T.rank,"batch_indices")}
    ${E.indicesSet("a_indices",E.rank-2,0)}
    ${E.indicesSet("a_indices",E.rank-1,0)}
    let a_offset = ${E.indicesToOffset("a_indices")};

    var b_indices: ${C.type.indices};
    ${Tr("b_indices",C,C.rank-2,T.rank,"batch_indices")}
    ${C.indicesSet("b_indices",C.rank-2,0)}
    ${C.indicesSet("b_indices",C.rank-1,0)}
    let b_offset = ${C.indicesToOffset("b_indices")};
    var values: array<${x.type.value}, ${g}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${m}) {
      ${A()}
    }
    for (var i = 0u; i < ${g}u; i++) {
      var value = values[i];
      ${D}
      ${U}
      let cur_indices = ${x.type.indices}(batch, row + i, col);
      let offset = ${x.indicesToOffset("cur_indices")};
      ${x.setByOffset(`offset / ${h}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${t.activation};${h};${m};${g};${n}`,inputDependencies:$?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:a?a(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:w}),getShaderSource:k}}}),ul,ll,na,cn,dl,aa,cl,pi,Da=J(()=>{"use strict";fe(),ge(),ye(),Ft(),Ra(),Oa(),ul=(e,t)=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${t?", batchIndices":""});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${t?", batchIndices":""});
        `,ll=(e,t)=>e?`
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
        }`,na=(e,t,r="f32",i,n=!1,a=32,s=!1,o=32)=>{let u=t[1]*e[1],d=t[0]*e[0],c=n?u:a,h=n?a:u,m=c/t[0],g=a/t[1];if(!((n&&m===4&&e[1]===4||!n&&(m===3||m===4))&&c%t[0]===0&&a%t[1]===0&&e[0]===4))throw new Error(`If transposeA ${n} is true, innerElementSize ${m} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${m} must be 3 or 4.
  tileAWidth ${c} must be divisible by workgroupSize[0]${t[0]}. tileInner ${a} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${m}<${r}>, ${c/m}>, ${h}>;
var<workgroup> mm_Bsub: array<array<vec4<${r}>, ${d/e[0]}>, ${a}>;

const rowPerThread = ${e[1]};
const colPerThread = ${e[0]};
const innerElementSize = ${m};
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
  let globalRowStart = i32(workgroupId.y) * ${u};

  let num_tiles = ${s?`${Math.ceil(o/a)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
  var kStart = ${s?`i32(globalId.z) * ${o}`:"0"};

  var acc: array<vec4<${r}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${g};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${ul(n,i)}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${g}; innerRow = innerRow + 1) {
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
          ${m===3?"":"let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}

          ${ll(n,m)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},cn=(e,t)=>e?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t?", batchIndices":""});
            `,dl=e=>e?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",aa=(e,t,r="f32",i,n=!1,a=32,s=!1,o=32,u=!1)=>{let d=e[1]*t[1],c=e[0]*t[0],h=n?d:a,m=n?a:d;if(!(m%t[1]===0&&h%t[0]===0&&a%t[1]===0))throw new Error(`tileAHight ${m} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${h} must be divisible by workgroupSize[0]${t[0]}, tileInner ${a} must be divisible by workgroupSize[1]${t[1]}`);let g=m/t[1],f=h/t[0],$=a/t[1],v=u?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${d};
    let globalColStart = i32(workgroupId.x) * ${c};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${m}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${h}; inputCol = inputCol + ${t[0]}) {
          ${cn(n,i)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${a}; inputRow = inputRow + ${t[1]}) {
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

let tileRowA = i32(localId.y) * ${g};
let tileColA = i32(localId.x) * ${f};
let tileRowB = i32(localId.y) * ${$};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${g}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${f}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${cn(n,i)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${$}; innerRow = innerRow + 1) {
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
      ${dl(n)}
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
  var<workgroup> mm_Asub : array<array<${r}, ${h}>, ${m}>;
  var<workgroup> mm_Bsub : array<array<${r}, ${c}>, ${a}>;
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
    ${v}
  }
`},cl=(e,t,r,i,n=!1)=>{let[a,s,o,u]=i,d=We(i[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${a.type.indices}) -> ${Ge(e,d)} {
      var value = ${Ge(e,d)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${s.type.indices};
        ${Tr("aIndices",s,s.rank-2,a.rank,"batchIndices")}
        ${s.indicesSet("aIndices",s.rank-2,"u32(row)")}
        ${s.indicesSet("aIndices",s.rank-1,"u32(colIn)")}
        value = ${s.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${a.type.indices}) -> ${Ge(e,d)} {
      var value = ${Ge(e,d)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${o.type.indices};
        ${Tr("bIndices",o,o.rank-2,a.rank,"batchIndices")}
        ${o.indicesSet("bIndices",o.rank-2,"u32(row)")}
        ${o.indicesSet("bIndices",o.rank-1,"u32(colIn)")}
        value = ${o.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${Ge(e,d)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${n?"bias[colIn]":`${Ge(e,d)}(bias[row])`};`:""}
        ${r}
        ${u.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},pi=(e,t,r,i,n=!1,a)=>{let s=e[0].dims,o=e[1].dims,u=s.slice(0,-2),d=o.slice(0,-2),c=i?i.slice(0,-2):r.slice(0,-2),h=P.size(c),m=s[s.length-2],g=s[s.length-1],f=o[o.length-1],$=g%4===0&&f%4===0,v=m<=8?[4,1,1]:[4,4,1],b=[8,8,1],w=[Math.ceil(f/b[0]/v[0]),Math.ceil(m/b[1]/v[1]),Math.ceil(h/b[2]/v[2])],k=$?4:1,S=[...u,m,g/k],T=S.length,E=[...d,g,f/k],C=E.length,x=[h,m,f/k],M=[{type:6,data:m},{type:6,data:f},{type:6,data:g}];Gt(t,M),M.push(...ce(c,S,E));let U=["rank","rank"],O=e.length>2;O&&(M.push(...ce(e[2].dims)),U.push("rank")),M.push(...ce(x));let D=V=>{let A=c.length,G=Ca("batchDims",e[0].dataType,A,1),F=We(e[0].dataType),L=q("a",e[0].dataType,T,k),re=q("b",e[1].dataType,C,k),ae=ue("result",e[0].dataType,x.length,k),Y=[L,re];if(O){let me=n?k:1;Y.push(q("bias",e[2].dataType,e[2].dims.length,me))}let N=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];Vt(t,N);let Q=We(ae.type.tensor),K=qt(t,ae.type.value,Q),ee=cl(k,O,K,[G,L,re,ae],n);return`
  ${V.registerUniforms(N).registerInternalVariables(G).declareVariables(...Y,ae)}
  ${ee}
  ${$?na(v,b,F,G):aa(v,b,F,G)}
                   `};return{name:"MatMul",shaderCache:{hint:`${v};${t.activation};${$};${n}`,inputDependencies:U},getRunData:()=>({outputs:[{dims:a?a(r):r,dataType:e[0].dataType}],dispatchGroup:{x:w[0],y:w[1],z:w[2]},programUniforms:M}),getShaderSource:D}}}),pl,Lh,gy=J(()=>{"use strict";fe(),_t(),ye(),Ft(),Oa(),my(),Da(),pl=(e,t,r,i,n=!1,a,s=4,o=4,u=4,d="f32")=>{let c=M=>{switch(M){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${d}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${M} is not supported.`)}},h=M=>{switch(M){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw new Error(`innerElementSize ${M} is not supported.`)}},m=e?`
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    `:`
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `,g=e?`
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
    `,f=e?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",$=e?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",v=e?"row":"col",b=e?"col":"row",w=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
    let outRow = ${v} / outWidth;
    let outCol = ${v} % outWidth;

    let WRow = ${b} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${b} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${b} % inChannels;
    var resData = ${Ge(s,d)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${f} && xCol >= 0 && xCol < ${$}) {
      ${m}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${c(s)}
    }
    return resData;`,k=e?t&&i?`
    let col = colIn * ${s};
    ${w}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${w}
    }
    return ${Ge(s,d)}(0.0);`:i&&r?`
    let col = colIn * ${s};
    ${w}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${w}
    }
    return ${Ge(s,d)}(0.0);`,S=e?i&&r?h(o):`
    let col = colIn * ${o};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${h(o)}
    }
    return ${Ge(o,d)}(0.0);`:`
    let col = colIn * ${o};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${h(o)}
    }
    return ${Ge(o,d)}(0.0);`,T=Ge(u,d),E=Ge(e?s:o,d),C=Ge(e?o:s,d),x=qt(a,T,d);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${E} {
      ${e?k:S}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${C} {
      ${e?S:k}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${T}) {
      let col = colIn * ${u};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${g}
      ${Uh(n)}
      ${x}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},Lh=(e,t,r,i,n,a,s,o,u)=>{let d=t.format==="NHWC",c=d?e[0].dims[3]:e[0].dims[1],h=r[0],m=d?r[2]:r[3],g=d?r[1]:r[2],f=d?r[3]:r[1],$=d&&(c%4===0||c%3===0)&&f%4===0,v=d?f:m*g,b=d?m*g:f,w=[8,8,1],k=i<=8?[4,1,1]:[4,4,1],S=[Math.ceil(v/w[0]/k[0]),Math.ceil(b/w[1]/k[1]),Math.ceil(h/w[2]/k[2])];ke("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${S}`);let T=$?d&&c%4!==0?3:4:1,E=w[1]*k[1],C=w[0]*k[0],x=Math.max(w[0]*T,w[1]),M=i%E===0,U=n%C===0,O=a%x===0,D=$?[T,4,4]:[1,1,1],V=[{type:6,data:i},{type:6,data:n},{type:6,data:a},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];Gt(t,V),V.push(...ce(e[0].dims,e[1].dims));let A=["rank","rank"];s&&(V.push(...ce(e[2].dims)),A.push("rank")),V.push(...ce(r));let G=F=>{let L=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];Vt(t,L);let re=$?4:1,ae=We(e[0].dataType),Y=`
      fn setOutputAtIndex(flatIndex : i32, value : ${$?`vec4<${ae}>`:ae}) {
        result[flatIndex] = ${$?`vec4<${ae}>`:ae}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${$?`vec4<${ae}>`:ae}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${$?"/ 4":""}, value);
      }`,N=q("x",e[0].dataType,e[0].dims.length,T===3?1:T),Q=q("w",e[1].dataType,e[1].dims.length,re),K=[N,Q],ee=ue("result",e[0].dataType,r.length,re);if(s){let me=q("bias",e[2].dataType,e[2].dims.length,re);K.push(me),Y+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${$?`vec4<${ae}>`:ae} {
          return bias[coords.${d?"w":"y"}${$?"/ 4":""}];
        }`}return`
        ${Ph("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${F.registerUniforms(L).declareVariables(...K,ee)}
        ${Y}
        ${pl(d,M,U,O,s,t,D[0],D[1],D[2],ae)}
        ${$?na(k,w,ae,void 0,!d,x):aa(k,w,ae,void 0,!d,x,!1,void 0,o)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${t.cacheKey};${T};${$};${M};${U};${O};${E};${C};${x}`,inputDependencies:A},getRunData:()=>({outputs:[{dims:u?u(r):r,dataType:e[0].dataType}],dispatchGroup:{x:S[0],y:S[1],z:S[2]},programUniforms:V}),getShaderSource:G}}}),hl,pn,fr,fl,hn,ml,Wh,qh,yy=J(()=>{"use strict";fe(),_t(),ge(),ye(),Ft(),Oa(),hl=e=>{let t=1;for(let r=0;r<e.length;r++)t*=e[r];return t},pn=e=>typeof e=="number"?[e,e,e]:e,fr=(e,t)=>t<=1?e:e+(e-1)*(t-1),fl=(e,t,r,i=1)=>{let n=fr(t,i);return Math.floor((e[0]*(r-1)-r+n)/2)},hn=(e,t,r,i,n)=>{n==null&&(n=fl(e,t[0],i[0]));let a=[0,0,0,r];for(let s=0;s<3;s++)e[s]+2*n>=t[s]&&(a[s]=Math.trunc((e[s]-t[s]+2*n)/i[s]+1));return a},ml=(e,t,r,i,n,a,s,o,u,d)=>{let c,h,m,g;if(e==="VALID"&&(e=0),typeof e=="number"){c={top:e,bottom:e,left:e,right:e,front:e,back:e};let f=hn([t,r,i,1],[o,u,d],1,[n,a,s],e);h=f[0],m=f[1],g=f[2]}else if(Array.isArray(e)){if(!e.every(($,v,b)=>$===b[0]))throw Error(`Unsupported padding parameter: ${e}`);c={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let f=hn([t,r,i,1],[o,u,d],1,[n,a,s],e[0]);h=f[0],m=f[1],g=f[2]}else if(e==="SAME_UPPER"){h=Math.ceil(t/n),m=Math.ceil(r/a),g=Math.ceil(i/s);let f=(h-1)*n+o-t,$=(m-1)*a+u-r,v=(g-1)*s+d-i,b=Math.floor(f/2),w=f-b,k=Math.floor($/2),S=$-k,T=Math.floor(v/2),E=v-T;c={top:k,bottom:S,left:T,right:E,front:b,back:w}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:c,outDepth:h,outHeight:m,outWidth:g}},Wh=(e,t,r,i,n,a=!1,s="channelsLast")=>{let o,u,d,c,h;if(s==="channelsLast")[o,u,d,c,h]=e;else if(s==="channelsFirst")[o,h,u,d,c]=e;else throw new Error(`Unknown dataFormat ${s}`);let[m,,g,f,$]=t,[v,b,w]=pn(r),[k,S,T]=pn(i),E=fr(g,k),C=fr(f,S),x=fr($,T),{padInfo:M,outDepth:U,outHeight:O,outWidth:D}=ml(n,u,d,c,v,b,w,E,C,x),V=a?m*h:m,A=[0,0,0,0,0];return s==="channelsFirst"?A=[o,V,U,O,D]:s==="channelsLast"&&(A=[o,U,O,D,V]),{batchSize:o,dataFormat:s,inDepth:u,inHeight:d,inWidth:c,inChannels:h,outDepth:U,outHeight:O,outWidth:D,outChannels:V,padInfo:M,strideDepth:v,strideHeight:b,strideWidth:w,filterDepth:g,filterHeight:f,filterWidth:$,effectiveFilterDepth:E,effectiveFilterHeight:C,effectiveFilterWidth:x,dilationDepth:k,dilationHeight:S,dilationWidth:T,inShape:e,outShape:A,filterShape:t}},qh=(e,t,r,i,n,a)=>{let s=a==="channelsLast",o=s?e[0].dims[3]:e[0].dims[1],u=!1,d=[64,1,1],c={x:r.map((w,k)=>k)},h=[Math.ceil(hl(c.x.map(w=>r[w]))/d[0]),1,1];ke("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${h}`);let m=u?s&&o%4!==0?3:4:1,g=P.size(r),f=[{type:12,data:g},{type:12,data:i},{type:12,data:n},{type:12,data:t.strides},{type:12,data:t.dilations}];Gt(t,f),f.push(...ce(e[0].dims,e[1].dims));let $=["rank","rank"],v=e.length===3;v&&(f.push(...ce(e[2].dims)),$.push("rank")),f.push(...ce(r));let b=w=>{let k=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:i.length},{name:"pads",type:"u32",length:n.length},{name:"strides",type:"u32",length:t.strides.length},{name:"dilations",type:"u32",length:t.dilations.length}];Vt(t,k);let S=u?4:1,T=We(e[0].dataType),E=q("x",e[0].dataType,e[0].dims.length,m===3?1:m),C=q("W",e[1].dataType,e[1].dims.length,S),x=[E,C],M=ue("result",e[0].dataType,r.length,S),U="";if(v){let V=q("bias",e[2].dataType,e[2].dims.length,S);x.push(V),U+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${u?`vec4<${T}>`:T} {
          return bias[${s?de("coords",4,5):de("coords",1,5)}${u?"/ 4":""}];
        }`}let O=Ge(m,T),D=qt(t,O,T);return`
            ${U}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> ${T} {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${E.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> ${T} {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${C.getByIndices("aIndices")};
            }
          ${w.registerUniforms(k).declareVariables(...x,M)}
          ${w.mainStart()}
          ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${M.offsetToIndices("global_idx")};
              let batch = ${de("coords",0,E.rank)};
              let d2 = ${s?de("coords",E.rank-1,E.rank):de("coords",1,E.rank)};
              let xFRCCorner = vec3<u32>(${s?de("coords",1,E.rank):de("coords",2,E.rank)},
              ${s?de("coords",2,E.rank):de("coords",3,E.rank)},
              ${s?de("coords",3,E.rank):de("coords",4,E.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${s?de("uniforms.x_shape",1,E.rank):de("uniforms.x_shape",2,E.rank)};
              let xShapeZ = ${s?de("uniforms.x_shape",2,E.rank):de("uniforms.x_shape",3,E.rank)};
              let xShapeW = ${s?de("uniforms.x_shape",3,E.rank):de("uniforms.x_shape",4,E.rank)};
              let xShapeU = ${s?de("uniforms.x_shape",4,E.rank):de("uniforms.x_shape",1,E.rank)};
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
              ${v?"value = value + getBiasByOutputCoords(coords)":""};
              ${D}
              result[global_idx] = ${T}(value);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${t.cacheKey};${s};${m};${v}`,inputDependencies:$},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:h[0],y:h[1],z:h[2]},programUniforms:f}),getShaderSource:b}}}),Gh,Vh,wy=J(()=>{"use strict";fe(),ge(),ye(),Ft(),Gh=(e,t,r,i)=>{let n=e.length>2,a=n?"value += b[output_channel];":"",s=e[0].dims,o=e[1].dims,u=t.format==="NHWC",d=u?r[3]:r[1],c=d/t.group,h=u&&c>=4?Be(d):1,m=P.size(r)/h,g=[{type:12,data:m},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:c}];Gt(t,g),g.push(...ce(s,[o[0],o[1],o[2],o[3]/h]));let f=n?["rank","rank","rank"]:["rank","rank"];g.push(...ce([r[0],r[1],r[2],r[3]/h]));let $=v=>{let b=ue("output",e[0].dataType,r.length,h),w=We(b.type.tensor),k=qt(t,b.type.value,w),S=q("x",e[0].dataType,s.length),T=q("w",e[1].dataType,o.length,h),E=[S,T];n&&E.push(q("b",e[2].dataType,e[2].dims,h));let C=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:t.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];Vt(t,C);let x=u?`
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
            let xVal = ${S.get("batch","xHeight","xWidth","input_channel")};
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

            let xVal = ${S.get("batch","input_channel","xHeight","xWidth")};
            let wVal = ${T.get("output_channel","wInChannel","wHeight","wWidth")};
            value += xVal * wVal;
          }
        }
      }
      `;return`
  ${v.registerUniforms(C).declareVariables(...E,b)}

  ${v.mainStart()}
    ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${b.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${u?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${u?1:2}], outputIndices[${u?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${h} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${u?2:1}];

    var value: ${b.type.value} = ${b.type.value}(0);
    ${x}
    ${a}
    ${k}
    ${b.setByOffset("global_idx","value")}
  }`};return{name:"GroupedConv",shaderCache:{hint:`${t.cacheKey}_${h}`,inputDependencies:f},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:g}),getShaderSource:$}},Vh=(e,t,r,i)=>{let n=e.length>2,a=Be(r[3]),s=Be(r[2]),o=P.size(r)/a/s,u=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/a],d=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/a],c=[r[0],r[1],r[2],r[3]/a],h=[{type:12,data:o},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];Gt(t,h),h.push(...ce(u,d,c));let m=(s-1)*t.strides[1]+d[1],g=f=>{let $=ue("output",e[0].dataType,c.length,a),v=We($.type.tensor),b=qt(t,$.type.value,v),w=q("x",e[0].dataType,u.length,a),k=q("w",e[1].dataType,d.length,a),S=[w,k];n&&S.push(q("b",e[2].dataType,e[2].dims,a));let T=n?"value += b[output_channel];":"",E=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return Vt(t,E),`
  ${f.registerUniforms(E).declareVariables(...S,$)}
  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${s}u;
    let col = (index1 % width1) * ${s}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${w.type.value}, ${m}>;
    var values: array<${$.type.value}, ${s}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${d[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${m}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${w.get("batch","u32(x_height)","u32(x_width)","input_channel")};
          } else {
            x_vals[i] = ${w.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${d[1]}; w_width++) {
          let w_val = ${k.get("w_height","w_width","0","output_channel")};
          for (var i = 0u; i < ${s}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${s}u; i++) {
      var value = values[i];
      ${T}
      ${b}
      ${$.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${t.cacheKey};${a};${s};${m};${d[0]};${d[1]}`,inputDependencies:n?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:h}),getShaderSource:g}}}),gl,Yr,yl,Qr,sa,fn,wl,_l,oa,_y=J(()=>{"use strict";ge(),gy(),yy(),Da(),wy(),Ft(),Ra(),Ct(),gl=(e,t,r,i,n,a)=>{let s=e[0],o=e.slice(a?1:2,a?3:4),u=o.length,d=t[0],c=t.slice(2).map((m,g)=>m+(m-1)*(r[g]-1)),h=o.map((m,g)=>m+i[g]+i[g+u]).map((m,g)=>Math.floor((m-c[g]+n[g])/n[g]));return h.splice(0,0,s),h.splice(a?3:1,0,d),h},Yr=[2,3,1,0],yl=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length>5)throw new Error("greater than 5D is not supported");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[1]*t.group;if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");let n=e[0].dims.length-2;if(t.dilations.length!==n)throw new Error(`dilations should be ${n}D`);if(t.strides.length!==n)throw new Error(`strides should be ${n}D`);if(t.pads.length!==n*2)throw new Error(`pads should be ${n*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape")},Qr=(e,t)=>{let r=e.kernelShape.slice();r.length<t[1].dims.length-2&&r.push(...Array(t[1].dims.length-2-r.length).fill(0));for(let a=2;a<t[1].dims.length;++a)r[a-2]===0&&(r[a-2]=t[1].dims[a]);let i=e.pads.slice();di.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,r,i,e.format==="NHWC",e.autoPad);let n=Object.assign({},e);return Object.assign(n,{kernelShape:r,pads:i}),n},sa=e=>{let t=Ma(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],n=e.dilations,a=e.group,s=e.kernel_shape,o=e.pads,u=e.strides,d=e.w_is_const();return{autoPad:i,format:r,dilations:n,group:a,kernelShape:s,pads:o,strides:u,wIsConst:d,...t,cacheKey:`${e.format};${t.activation};`}},fn=(e,t,r,i)=>{let n=r.format==="NHWC",a=gl(t[0].dims,t[1].dims,r.dilations,r.pads,r.strides,n);if(r.group!==1){let E=[t[0]];if(n){let C=e.kernelCustomData.wT??e.compute(Ze(t[1],Yr),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=C),E.push(C)}else E.push(t[1]);t.length===3&&E.push(t[2]),!e.adapterInfo.isArchitecture("ampere")&&n&&t[1].dims[0]===r.group&&t[1].dims[1]===1&&r.dilations[0]===1&&r.dilations[1]===1?e.compute(Vh(E,r,a,i),{inputs:E}):e.compute(Gh(E,r,a,i),{inputs:E});return}let s=t.length===3,o=t[0].dims[n?1:2],u=t[0].dims[n?2:3],d=t[0].dims[n?3:1],c=t[1].dims[2],h=t[1].dims[3],m=a[n?1:2],g=a[n?2:3],f=a[n?3:1],$=n&&c===o&&h===u&&r.pads[0]===0&&r.pads[1]===0;if($||c===1&&h===1&&r.dilations[0]===1&&r.dilations[1]===1&&r.strides[0]===1&&r.strides[1]===1&&r.pads[0]===0&&r.pads[1]===0){let E=a[0],C,x,M,U=[];if(n){let V=e.kernelCustomData.wT??e.compute(Ze(t[1],Yr),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];if(r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=V),$){let A=o*u*d;C=t[0].reshape([1,E,A]),x=V.reshape([1,A,f]),M=[1,E,f]}else C=t[0].reshape([E,o*u,d]),x=V.reshape([1,d,f]),M=[E,m*g,f];U.push(C),U.push(x)}else C=t[0].reshape([E,d,o*u]),x=t[1].reshape([1,f,d]),M=[E,f,m*g],U.push(x),U.push(C);s&&U.push(t[2]);let O=M[2],D=U[0].dims[U[0].dims.length-1];O<8&&D<8?e.compute(Ba(U,r,a,M,n,i),{inputs:U}):e.compute(pi(U,r,a,M,n,i),{inputs:U});return}let v=!0,b=e.kernelCustomData.wT??e.compute(Ze(t[1],Yr),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=b);let w=[t[0],b];s&&w.push(t[2]);let k=n?m*g:f,S=n?f:m*g,T=c*h*d;e.compute(Lh(w,r,a,k,S,T,s,v,i),{inputs:w})},wl=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let n=[0,t.pads[0],0,t.pads[1]],a=[1].concat(t.strides),s=[1].concat(t.dilations),o=[1].concat(t.kernelShape),u=Qr({...t,pads:n,strides:a,dilations:s,kernelShape:o},i);fn(e,i,u,d=>r?[d[0],d[2],d[3]]:[d[0],d[1],d[3]])},_l=(e,t,r)=>{let i=r.format==="NHWC"?"channelsLast":"channelsFirst",n=Qr(r,t),a=r.autoPad==="NOTSET"?r.pads:r.autoPad,s=Wh(t[0].dims,t[1].dims,r.strides,r.dilations,a,!1,i);e.compute(qh(t,n,s.outShape,[s.filterDepth,s.filterHeight,s.filterWidth],[s.padInfo.front,s.padInfo.top,s.padInfo.left],i))},oa=(e,t)=>{if(yl(e.inputs,t),e.inputs[0].dims.length===3)wl(e,t);else if(e.inputs[0].dims.length===5)_l(e,e.inputs,t);else{let r=Qr(t,e.inputs);fn(e,e.inputs,r)}}}),Hh,by=J(()=>{"use strict";fe(),_t(),ge(),ye(),Hh=(e,t,r)=>{let i=e.length>2,n=t.outputShape,a=t.format==="NHWC",s=t.group,o=e[1].dims,u=o[2]/s,d=o[3],c=a?Be(u):1,h=a&&d===1&&u>=4,m=h?Math.floor(u/4)*4:Math.floor(u/c)*c,g=u-m,f=a?Be(d):1,$=a?d===1?c:f:1,v=P.size(n)/f,b=[Math.ceil(v/64),1,1];ke("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${b}`);let w=["rank","rank"],k=[t.strides[0],t.strides[1]],S=[t.kernelShape[a?1:2],t.kernelShape[a?2:3]],T=[t.dilations[0],t.dilations[1]],E=[S[0]+(t.dilations[0]<=1?0:(t.kernelShape[a?1:2]-1)*(t.dilations[0]-1)),S[1]+(t.dilations[1]<=1?0:(t.kernelShape[a?2:3]-1)*(t.dilations[1]-1))],C=[E[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),E[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],x=[{type:12,data:v},{type:12,data:k},{type:12,data:S},{type:12,data:T},{type:12,data:E},{type:6,data:C},{type:12,data:m},{type:12,data:u},{type:12,data:d},...ce(e[0].dims,e[1].dims)];i&&(x.push(...ce(e[2].dims)),w.push("rank")),x.push(...ce(n));let M=U=>{let O=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:k.length},{name:"filter_dims",type:"u32",length:S.length},{name:"dilations",type:"u32",length:S.length},{name:"effective_filter_dims",type:"u32",length:E.length},{name:"pads",type:"i32",length:C.length},{name:"input_channels_per_group_int",type:"u32"},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],D=We(e[0].dataType),V=a?1:2,A=a?2:3,G=a?3:1,F=q("W",e[1].dataType,e[1].dims.length,$),L=q("Dy",e[0].dataType,e[0].dims.length,c),re=[L,F];i&&re.push(q("bias",e[2].dataType,[n[G]].length,f));let ae=ue("result",e[0].dataType,n.length,f),Y=()=>{let K="";if(h)c===4?K+=`
        let xValue = ${L.getByOffset("x_offset")};
        let wValue = ${F.getByOffset("w_offset")};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;`:c===2?K+=`
          dotProd = dotProd + dot(vec4<${D}>(${L.getByOffset("x_offset")}, ${L.getByOffset("x_offset + 1u")}), vec4<${D}>(${F.getByOffset("w_offset")}, ${F.getByOffset("w_offset + 1u")}));
          x_offset += 2u;
          w_offset += 2u;`:c===1&&(K+=`
          dotProd = dotProd + dot(vec4<${D}>(${L.getByOffset("x_offset")}, ${L.getByOffset("x_offset + 1u")}, ${L.getByOffset("x_offset + 2u")}, ${L.getByOffset("x_offset + 3u")}), vec4<${D}>(${F.getByOffset("w_offset")}, ${F.getByOffset("w_offset + 1u")}, ${F.getByOffset("w_offset + 2u")}, ${F.getByOffset("w_offset + 3u")}));
          x_offset += 4u;
          w_offset += 4u;`);else if(K+=`
                  let xValue = ${a?L.getByOffset(`${L.indicesToOffset(`${L.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${c}`):L.get("batch","inputChannel","idyR","idyC")};
        `,c===1)K+=`
          let w_offset = ${F.indicesToOffset(`${F.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${F.getByOffset(`w_offset / ${$}`)};
          dotProd = dotProd + xValue * wValue;`;else for(let ee=0;ee<c;ee++)K+=`
            let wValue${ee} = ${F.getByOffset(`${F.indicesToOffset(`${F.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${ee}, wOutChannel)`)} / ${$}`)};
            dotProd = dotProd + xValue[${ee}] * wValue${ee};`;return K},N=()=>{if(g===0)return"";if(!h)throw new Error(`packInputAs4 ${h} is not true.`);let K="";if(c===1){K+="dotProd = dotProd";for(let ee=0;ee<g;ee++)K+=`
            + ${L.getByOffset(`x_offset + ${ee}`)} * ${F.getByOffset(`w_offset + ${ee}`)}`;K+=";"}else if(c===2){if(g!==2)throw new Error(`Invalid inputChannelsRemainder ${g}.`);K+=`
          let xValue = ${L.getByOffset("x_offset")};
          let wValue = ${F.getByOffset("w_offset")};
          dotProd = dotProd + dot(xValue, wValue);`}return K},Q=`
            let outputIndices = ${ae.offsetToIndices(`global_idx * ${f}`)};
            let batch = ${ae.indicesGet("outputIndices",0)};
            let d1 = ${ae.indicesGet("outputIndices",G)};
            let r = ${ae.indicesGet("outputIndices",V)};
            let c = ${ae.indicesGet("outputIndices",A)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${ae.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${D}(dyRCorner) + ${D}(wR)) / ${D}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${D}(uniforms.Dy_shape[${V}]) || fract(dyR) > 0.0 ||
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
                let dyC = (${D}(dyCCorner) + ${D}(wC)) / ${D}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${D}(uniforms.Dy_shape[${A}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${h?`
                var x_offset = ${L.indicesToOffset(`${L.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${c};
                var w_offset = ${F.indicesToOffset(`${F.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${$};
                  `:""}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${h?4:c}) {
                  ${Y()}
                  inputChannel = inputChannel + ${h?4:c};
                }
                ${N()}
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${i?` + bias[d1 / ${f}]`:""};
            ${ae.setByOffset("global_idx","value")};
          `;return`
    ${U.registerUniforms(O).declareVariables(...re,ae)}
      ${U.mainStart()}
      ${U.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${Q}}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${t.cacheKey};${c}${$}${f}${h}${g}`,inputDependencies:w},getRunData:()=>({dispatchGroup:{x:b[0],y:b[1],z:b[2]},outputs:[{dims:r?r(n):n,dataType:e[0].dataType}],programUniforms:x}),getShaderSource:M}}}),bl,$l,vl,mn,Fh,xl,gn,kl,jh,$y=J(()=>{"use strict";by(),Ft(),Ct(),bl=(e,t,r,i,n,a)=>(e-1)*t+r+(i-1)*n+1-a,$l=(e,t,r,i,n)=>{let a=Math.floor(e/2);t==="SAME_UPPER"?(r[i]=a,r[n]=e-a):t==="SAME_LOWER"&&(r[i]=e-a,r[n]=a)},vl=(e,t,r,i,n,a,s,o,u,d)=>{let c=e.length-2,h=d.length===0;u.length<c&&u.push(...Array(c-u.length).fill(0));let m=e[0],g=t[o?3:1]*n;for(let f=0,$=e.length-c-(o?1:0);f<c;++f,++$){let v=e[$],b=h?v*s[f]:d[f],w=bl(v,s[f],a[f],t[$],r[f],b);$l(w,i,a,f,f+c),h&&d.push(s[f]*(v-1)+u[f]+(t[$]-1)*r[f]+1-a[f]-a[f+c])}d.splice(0,0,m),d.splice(o?3:1,0,g)},mn=(e,t)=>{let r=e.kernelShape.slice();if(e.kernelShape.length===0||e.kernelShape.reduce((h,m)=>h*m,1)===0){r.length=0;for(let h=2;h<t[1].dims.length;++h)r.push(t[1].dims[h])}let i=e.format==="NHWC";r.splice(0,0,t[1].dims[0]),r.splice(i?3:1,0,t[1].dims[1]);let n=e.pads.slice(),a=e.outputShape.slice(),s=e.outputPadding.slice(),o=t[0].dims,u=e.dilations.slice();if(u.reduce((h,m)=>h+m,0)===0){let h=t[0].dims.length-2;u=new Array(h).fill(1)}let d=e.strides.slice();if(d.reduce((h,m)=>h+m,0)===0){let h=t[0].dims.length-2;d=new Array(h).fill(1)}vl(o,r,u,e.autoPad,e.group,n,d,i,s,a);let c=Object.assign({},e);return Object.assign(c,{kernelShape:r,pads:n,outputPadding:s,outputShape:a,dilations:u,strides:d}),c},Fh=e=>{let t=Ma(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof e.autoPad>"u"?0:e.autoPad],n=e.dilations,a=e.group??1,s=e.kernelShape,o=e.pads,u=e.strides,d=e.wIsConst(),c=e.outputPadding,h=e.outputShape;return{autoPad:i,format:r,dilations:n,group:a,kernelShape:s,outputPadding:c,outputShape:h,pads:o,strides:u,wIsConst:d,...t,cacheKey:`${e.format};${t.activation};`}},xl=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4&&e[0].dims.length!==3)throw new Error("currently only support 2-dimensional conv");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[0];if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let n=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==n))throw new Error("invalid bias");let a=e[0].dims.length-2;if(t.dilations.reduce((s,o)=>s+o,0)>0&&t.dilations.length!==a)throw new Error(`dilations should be ${a}D`);if(t.strides.reduce((s,o)=>s+o,0)>0&&t.strides.length!==a)throw new Error(`strides should be ${a}D`);if(t.pads.reduce((s,o)=>s+o,0)>0&&t.pads.length!==a*2)throw new Error(`pads should be ${a*2}D`);if(t.outputPadding.length!==a&&t.outputPadding.length!==0)throw new Error(`output_padding should be ${a}D`);if(t.kernelShape.reduce((s,o)=>s+o,0)>0&&t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw new Error("invalid output shape")},gn=(e,t,r,i)=>{let n=e.kernelCustomData.wT??e.compute(Ze(t[1],[2,3,0,1]),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=n);let a=[t[0],n];t.length===3&&a.push(t[2]),e.compute(Hh(a,r,i),{inputs:a})},kl=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let n=t.kernelShape;(n.length===0||n[0]===0)&&(n=[e.inputs[1].dims[2]]);let a=t.dilations;(a.length===0||a[0]===0)&&(a=[1]);let s=t.strides;(s.length===0||s[0]===0)&&(s=[1]);let o=t.pads;o.length===0&&(o=[0,0]),o=[0,o[0],0,o[1]],s=[1].concat(s),a=[1].concat(a),n=[1].concat(n);let u=t.outputPadding;u=[0].concat(u);let d=mn({...t,pads:o,strides:s,dilations:a,kernelShape:n,outputPadding:u},i);gn(e,i,d,c=>r?[c[0],c[2],c[3]]:[c[0],c[1],c[3]])},jh=(e,t)=>{if(xl(e.inputs,t),e.inputs[0].dims.length===3)kl(e,t);else{let r=mn(t,e.inputs);gn(e,e.inputs,r)}}}),Sl,Kh,Zh,vy=J(()=>{"use strict";fe(),ge(),Re(),ye(),Sl=(e,t,r,i)=>{let n=P.size(t),a=t.length,s=q("input",e,a),o=ue("output",e,a),u=r.dataType===6?r.getInt32Array()[0]:Number(r.getBigInt64Array()[0]),d=P.normalizeAxis(u,a),c=h=>{let m=` i32(${s.indicesGet("inputIndices","uniforms.axis")}) `,g=de("uniforms.input_shape","uniforms.axis",a),f=i.reverse?m+(i.exclusive?" + 1":""):"0",$=i.reverse?g:m+(i.exclusive?"":" + 1");return`
                ${h.registerUniform("outputSize","u32").registerUniform("axis","u32").declareVariables(s,o)}
                ${h.mainStart()}
                  ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${o.offsetToIndices("global_idx")};
                  var sum = ${o.type.value}(0);
                  let first : i32 = ${f};
                  let last : i32 = ${$};
                  for (var i : i32 = first; i < last; i++) {
                    ${s.indicesSet("inputIndices","uniforms.axis","u32(i)")};
                    sum = sum + ${s.getByIndices("inputIndices")};
                  }
                  ${o.setByOffset("global_idx","sum")};
                }`};return{name:"CumSum",shaderCache:{hint:i.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:[{type:12,data:n},{type:12,data:d},...ce(t,t)]}),getShaderSource:c}},Kh=(e,t)=>{let r=e.inputs[0].dims,i=e.inputs[0].dataType,n=e.inputs[1];e.compute(Sl(i,r,n,t),{inputs:[0]})},Zh=e=>{let t=e.exclusive===1,r=e.reverse===1;return Ce({exclusive:t,reverse:r})}}),Tl,Il,Cl,Yh,Qh,xy=J(()=>{"use strict";fe(),ge(),Re(),ye(),Tl=e=>{if(!e||e.length!==1)throw new Error("DepthToSpace requires 1 input.");if(e[0].dims.length!==4)throw new Error("DepthToSpace requires 4D input.")},Il=(e,t,r,i)=>{let n=[];n.push(`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`);for(let a=0;a<t;++a)n.push(r.indicesSet("a",e[a],`i[${a}]`));return n.push("return a;}"),n.join(`
`)},Cl=(e,t)=>{let r,i,n,a,s,o,u=t.format==="NHWC",d=t.blocksize,c=t.mode==="DCR";u?([r,i,n,a]=e.dims,s=c?[r,i,n,d,d,a/d**2]:[r,i,n,a/d**2,d,d],o=c?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([r,i,n,a]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],s=c?[r,d,d,a/d**2,i,n]:[r,a/d**2,d,d,i,n],o=c?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let h=e.reshape(s),m=h.dims.length,g=e.dataType,f=q("a",g,m),$=ue("output",g,m),v=b=>`
  ${b.registerUniform("output_size","u32").declareVariables(f,$)}

  ${Il(o,m,f,$)}

  ${b.mainStart()}
    ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${$.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${$.setByOffset("global_idx",f.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:["rank"]},getRunData:b=>{let w=u?[r,i*d,n*d,a/d**2]:[r,a/d**2,i*d,n*d],k=P.size(w),S=h.dims,T=P.sortBasedOnPerm(S,o);return{outputs:[{dims:w,dataType:b[0].dataType}],dispatchGroup:{x:Math.ceil(k/64)},programUniforms:[{type:12,data:k},...ce(S,T)]}},getShaderSource:v}},Yh=(e,t)=>{Tl(e.inputs),e.compute(Cl(e.inputs[0],t))},Qh=e=>Ce({blocksize:e.blocksize,mode:e.mode,format:e.format})}),mt,mr,Xr,yn,kt,El,zl,Al,wn,_n,bn,Ml,Ol,$n,Bl,Xh,Jh,ky=J(()=>{"use strict";fe(),ge(),Re(),ye(),mt=256,mr=512,Xr=2*Math.PI,yn=e=>{let t=[],r=e;for(let i of[4,2,3,5])for(;r%i===0;)t.push(i),r/=i;return r===1?t:void 0},kt=e=>{let t=e.toPrecision(9);return/[.eE]/.test(t)?t:`${t}.0`},El=(e,t,r,i,n)=>{let a=r/e,s=mr-i,o=d=>`smem[${s}u + base + ${d*t}u]`,u=`  for (var t = local_idx; t < ${a}u; t += ${mt}u) {
`;u+=`    let twiddleIndex = t % ${t}u;
    let angleUnit = f32(twiddleIndex);
`,u+=`    var leg: array<vec2<f32>, 5>;
`;for(let d=0;d<e;d++){let c=`${i}u + t + ${d*a}u`;if(d===0)u+=`    leg[0] = smem[${c}];
`;else{let h=n*Xr*d/(e*t);u+=`    { let a = ${kt(h)} * angleUnit; leg[${d}] = cmul(smem[${c}], vec2<f32>(cos(a), sin(a))); }
`}}if(u+=`    let base = (t / ${t}u) * ${t*e}u + twiddleIndex;
`,e===2)u+=`    ${o(0)} = leg[0] + leg[1];
    ${o(1)} = leg[0] - leg[1];
`;else if(e===4){let d=n<0?"vec2<f32>(oddDiff.y, -oddDiff.x)":"vec2<f32>(-oddDiff.y, oddDiff.x)";u+=`    let evenSum = leg[0] + leg[2]; let evenDiff = leg[0] - leg[2];
`,u+=`    let oddSum = leg[1] + leg[3]; let oddDiff = leg[1] - leg[3];
`,u+=`    let oddRot = ${d};
`,u+=`    ${o(0)} = evenSum + oddSum;
    ${o(1)} = evenDiff + oddRot;
`,u+=`    ${o(2)} = evenSum - oddSum;
    ${o(3)} = evenDiff - oddRot;
`}else for(let d=0;d<e;d++){let c=["leg[0]"];for(let h=1;h<e;h++){let m=n*Xr*(h*d)/e,g=kt(Math.cos(m)),f=kt(Math.sin(m));c.push(`vec2<f32>(leg[${h}].x*${g} - leg[${h}].y*${f}, leg[${h}].x*${f} + leg[${h}].y*${g})`)}u+=`    ${o(d)} = ${c.join(" + ")};
`}return`${u}  }
  workgroupBarrier();
`},zl=(e,t,r)=>{let i="",n=1,a=0;for(let s of e)i+=El(s,n,t,a,r),n*=s,a=mr-a;return{code:i,resultOffset:a}},Al=(e,t,r,i,n)=>{let a=e.dims,s=a.length,o=a[s-1],u=a[t],d=r&&i?(u-1)*2:u;n!==void 0&&(d=n);let c=r&&i?1:2,h=i&&!r?Math.floor(d/2)+1:d,m=a.slice();m[t]=h,m[s-1]=c;let g=1;for(let $=t+1;$<s-1;$++)g*=a[$];let f=P.size(a)/o/u;return{dataType:e.dataType,outputDims:m,length:d,signalLength:u,inner:g,batch:f,inputComponents:o,outputComponents:c,outputLength:h,inverse:r,onesided:i}},wn=(e,t)=>[t,e.length,e.inputComponents,e.outputComponents,e.inverse,e.onesided].join(";"),_n=e=>[{type:12,data:e.batch},{type:12,data:e.signalLength},{type:12,data:e.inner},{type:12,data:e.outputLength}],bn=(e,t,r)=>e.registerUniform("batch","u32").registerUniform("signalLength","u32").registerUniform("inner","u32").registerUniform("outputLength","u32").declareVariables(t,r),Ml=e=>{let{dataType:t,length:r,inputComponents:i,outputComponents:n,inverse:a,onesided:s}=e,o=Le(t),u=a?1:-1,d=a?1/r:1,c=yn(r),h=m=>{let g=q("x",t,[1]),f=ue("y",t,[1]),$=T=>{let E=`inBase + (${T}) * uniforms.inner * ${i}u`,C=`f32(${g.getByOffset(E)})`,x=i===2?`f32(${g.getByOffset(`${E} + 1u`)})`:"0.0";return`vec2<f32>(${C}, ${x})`},v;if(a&&s){let T=Math.floor(r/2)+1,E=r%2===0?`select(provided, provided - 1u, provided == ${T}u)`:"provided";v=`
    let provided = min(uniforms.signalLength, ${T}u);
    for (var i = local_idx; i < ${r}u; i += ${mt}u) {
      if (i < provided) { smem[i] = ${$("i")}; } else { smem[i] = vec2<f32>(0.0); }
    }
    workgroupBarrier();
    for (var k = local_idx + 1u; k < ${E}; k += ${mt}u) {
      let h = smem[k];
      smem[${r}u - k] = vec2<f32>(h.x, -h.y);
    }
    workgroupBarrier();`}else v=`
    let loadCount = min(uniforms.signalLength, ${r}u);
    for (var i = local_idx; i < ${r}u; i += ${mt}u) {
      if (i < loadCount) { smem[i] = ${$("i")}; } else { smem[i] = vec2<f32>(0.0); }
    }
    workgroupBarrier();`;let{code:b,resultOffset:w}=zl(c,r,u),k=d===1?`smem[${w}u + i]`:`smem[${w}u + i] * ${kt(d)}`,S=n===2?f.setByOffset("off + 1u",`${o}(v.y)`):"";return`
  ${bn(m,g,f)}
  var<workgroup> smem: array<vec2<f32>, ${2*mr}>;
  fn cmul(a: vec2<f32>, b: vec2<f32>) -> vec2<f32> {
    return vec2<f32>(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
  }
  ${m.mainStart(mt)}
    let row = workgroup_index;
    if (row >= uniforms.batch) { return; }
    let outer = row / uniforms.inner;
    let within = row % uniforms.inner;
    let inBase = (outer * uniforms.signalLength * uniforms.inner + within) * ${i}u;
    let outBase = (outer * uniforms.outputLength * uniforms.inner + within) * ${n}u;
    ${v}
${b}    for (var i = local_idx; i < uniforms.outputLength; i += ${mt}u) {
      let v = ${k};
      let off = outBase + i * uniforms.inner * ${n}u;
      ${f.setByOffset("off",`${o}(v.x)`)}
      ${S}
    }
  }`};return{name:"DFT",shaderCache:{hint:wn(e,"fft"),inputDependencies:["type"]},getShaderSource:h,getRunData:()=>({outputs:[{dims:e.outputDims,dataType:t}],programUniforms:_n(e),dispatchGroup:{x:e.batch}})}},Ol=e=>{let{dataType:t,length:r,inputComponents:i,outputComponents:n,inverse:a,onesided:s}=e,o=Le(t),u=a?1:-1,d=a?1/r:1,c=h=>{let m=q("x",t,[1]),g=ue("y",t,[1]),f=k=>{let S=`inBase + (${k}) * uniforms.inner * ${i}u`,T=`f32(${m.getByOffset(S)})`,E=i===2?`f32(${m.getByOffset(`${S} + 1u`)})`:"0.0";return`vec2<f32>(${T}, ${E})`},$=a&&s?`fn spectrum(inBase: u32, k: u32) -> vec2<f32> {
    let provided = min(uniforms.signalLength, ${Math.floor(r/2)+1}u);
    if (k < provided) { return ${f("k")}; }
    let m = ${r}u - k;
    if (m < provided) {
      let h = ${f("m")};
      return vec2<f32>(h.x, -h.y);
    }
    return vec2<f32>(0.0, 0.0);
  }`:`fn spectrum(inBase: u32, n: u32) -> vec2<f32> {
    if (n < uniforms.signalLength) { return ${f("n")}; }
    return vec2<f32>(0.0, 0.0);
  }`,v=`
      let angle = ${kt(u*Xr)} * f32(knMod) / ${kt(r)};
      acc += cmul(spectrum(inBase, n), vec2<f32>(cos(angle), sin(angle)));
      knMod += k;
      if (knMod >= ${r}u) { knMod -= ${r}u; }`,b=n===2?g.setByOffset("off + 1u",`${o}(v.y)`):"",w=d===1?"acc":`acc * ${kt(d)}`;return`
  ${bn(h,m,g)}
  fn cmul(a: vec2<f32>, b: vec2<f32>) -> vec2<f32> {
    return vec2<f32>(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
  }
  ${$}
  ${h.mainStart(mt)}
    let row = workgroup_index;
    if (row >= uniforms.batch) { return; }
    let outer = row / uniforms.inner;
    let within = row % uniforms.inner;
    let inBase = (outer * uniforms.signalLength * uniforms.inner + within) * ${i}u;
    let outBase = (outer * uniforms.outputLength * uniforms.inner + within) * ${n}u;
    for (var k = local_idx; k < uniforms.outputLength; k += ${mt}u) {
      var acc = vec2<f32>(0.0, 0.0);
      var knMod = 0u;
      for (var n = 0u; n < ${r}u; n++) {${v}
      }
      let v = ${w};
      let off = outBase + k * uniforms.inner * ${n}u;
      ${g.setByOffset("off",`${o}(v.x)`)}
      ${b}
    }
  }`};return{name:"DFT",shaderCache:{hint:wn(e,"direct"),inputDependencies:["type"]},getShaderSource:c,getRunData:()=>({outputs:[{dims:e.outputDims,dataType:t}],programUniforms:_n(e),dispatchGroup:{x:e.batch}})}},$n=e=>{if(!e||e.dataType===0)return;if(P.size(e.dims)!==1)throw new Error("DFT optional scalar inputs must have exactly 1 element.");if(e.dataType===6)return e.getInt32Array()[0];let t=Number(e.getBigInt64Array()[0]);if(!Number.isSafeInteger(t))throw new Error("DFT optional scalar inputs are out of JavaScript safe integer range.");return t},Bl=e=>{if(!e||e.length<1)throw new Error("DFT requires at least 1 input.");let t=e[0].dims;if(t.length<2)throw new Error("DFT input must have at least 2 dimensions.");let r=t[t.length-1];if(r!==1&&r!==2)throw new Error("DFT input's innermost dimension must be 1 (real) or 2 (complex).")},Xh=(e,t)=>{Bl(e.inputs);let r=e.inputs[0],i=r.dims.length,n=t.inverse!==0,a=t.onesided!==0,s=$n(e.inputs[1]);if(s!==void 0&&s<=0)throw new Error("dft_length must be greater than zero.");let o=P.normalizeAxis($n(e.inputs[2])??t.axis,i);if(o===i-1)throw new Error("DFT axis must refer to a signal dimension, not the innermost (real/imaginary) dimension.");if(n&&a&&r.dims[i-1]!==2)throw new Error("Inverse one-sided DFT (IRFFT) requires complex-valued input (innermost dimension 2).");let u=Al(r,o,n,a,s);if(u.length<=0)throw new Error(`Invalid DFT length: ${u.length}`);let d=u.length<=mr&&yn(u.length)!==void 0?Ml(u):Ol(u);e.compute(d,{inputs:[0]})},Jh=e=>Ce({axis:e.axis??1,inverse:e.inverse??0,onesided:e.onesided??0})}),Jr,gr,vn,Rl,Dl,Nl,Ul,xn,Pl,ef,tf,Sy=J(()=>{"use strict";fe(),ge(),Re(),ye(),Jr="[a-zA-Z]|\\.\\.\\.",gr="("+Jr+")+",vn="^"+gr+"$",Rl="("+gr+",)*"+gr,Dl="^"+Rl+"$",Nl=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,t){let r=this.symbolToIndices.get(e);r===void 0?r=[t]:r.push(t),this.symbolToIndices.set(e,r)}},Ul=class{constructor(e,t){this.equation=t,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=new Array,this.outputDims=[];let[r,i]=t.includes("->")?t.split("->",2):[t,""];if(!r.match(RegExp(Dl)))throw new Error("Invalid LHS term");if(r.split(",").forEach((n,a)=>{let s=e[a].dims.slice();if(!n.match(RegExp(vn)))throw new Error("Invalid LHS term");let o=this.processTerm(n,!0,s,a);this.lhs.push(o)}),i==="")i+=[...this.symbolToInfo.entries()].filter(([n,a])=>a.count===1||n==="...").map(([n])=>n).join("");else if(!i.match(RegExp(gr)))throw new Error("Invalid RHS");i.match(RegExp(Jr,"g"))?.forEach(n=>{if(n==="...")this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let a=this.symbolToInfo.get(n);if(a===void 0)throw new Error("Invalid RHS symbol");this.outputDims.push(a.dimValue)}}),this.rhs=this.processTerm(i,!1,this.outputDims)}addSymbol(e,t,r){let i=this.symbolToInfo.get(e);if(i!==void 0){if(i.dimValue!==t&&i.count!==1)throw new Error("Dimension mismatch");i.count++,i.inputIndices.push(r)}else i={count:1,dimValue:t,inputIndices:[r]};this.symbolToInfo.set(e,i)}processTerm(e,t,r,i=-1){let n=r.length,a=!1,s=[],o=0;if(!e.match(RegExp(vn))&&!t&&e!=="")throw new Error("Invalid LHS term");let u=e.match(RegExp(Jr,"g")),d=new Nl(i);return u?.forEach((c,h)=>{if(c==="..."){if(a)throw new Error("Only one ellipsis is allowed per input term");a=!0;let m=n-u.length+1;if(m<0)throw new Error("Ellipsis out of bounds");if(s=r.slice(o,o+m),this.hasEllipsis){if(this.ellipsisDims.length!==s.length||this.ellipsisDims.toString()!==s.toString())throw new Error("Ellipsis dimensions mismatch")}else if(t)this.hasEllipsis=!0,this.ellipsisDims=s;else throw new Error("Ellipsis must be specified in the LHS");for(let g=0;g<s.length;g++){let f=String.fromCharCode(48+g);d.addSymbol(f,h+g),this.addSymbol(f,r[o++],i)}}else d.addSymbol(c,h+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(c,r[o++],i)}),d}},xn=e=>e+"_max",Pl=(e,t,r,i)=>{let n=e.map(d=>d.length).map((d,c)=>q(`input${c}`,t,d)),a=P.size(i),s=ue("output",t,i.length),o=[...r.symbolToInfo.keys()].filter(d=>!r.rhs.symbolToIndices.has(d)),u=d=>{let c=[],h="var prod = 1.0;",m="var sum = 0.0;",g="sum += prod;",f=[],$=[],v=[],b=[],w=r.symbolToInfo.size===r.rhs.symbolToIndices.size;r.symbolToInfo.forEach((S,T)=>{if(r.rhs.symbolToIndices.has(T)){let E=r.rhs.symbolToIndices.get(T)?.[0];E!==void 0&&r.lhs.forEach((C,x)=>{if(S.inputIndices.includes(x)){let M=C.symbolToIndices.get(T);if(M===void 0)throw new Error("Invalid symbol error");M.forEach(U=>{c.push(`${n[x].indicesSet(`input${x}Indices`,U,s.indicesGet("outputIndices",E))}`)})}})}else r.lhs.forEach((E,C)=>{if(S.inputIndices.includes(C)){let x=E.symbolToIndices.get(T);if(x===void 0)throw new Error("Invalid symbol error");x.forEach(M=>{f.push(`${n[C].indicesSet(`input${C}Indices`,M,`${T}`)}`)}),b.push(`prod *= ${n[C].getByIndices(`input${C}Indices`)};`)}}),$.push(`for(var ${T}: u32 = 0; ${T} < uniforms.${xn(T)}; ${T}++) {`),v.push("}")});let k=w?[...c,`let sum = ${n.map((S,T)=>S.getByIndices(`input${T}Indices`)).join(" * ")};`]:[...c,m,...$,...f,h,...b,g,...v];return`
            ${d.registerUniforms(o.map(S=>({name:`${xn(S)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...n,s)}

            ${d.mainStart()}
            ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${s.offsetToIndices("global_idx")};
            ${n.map((S,T)=>`var input${T}Indices: ${n[T].type.indices};`).join(`
`)}
            ${k.join(`
`)};
            ${s.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:r.equation,inputDependencies:e.map(()=>"rank")},getRunData:()=>{let d=o.filter(h=>r.symbolToInfo.has(h)).map(h=>({type:12,data:r.symbolToInfo.get(h)?.dimValue||0}));d.push({type:12,data:a});let c=e.map((h,m)=>[...ce(h)]).reduce((h,m)=>h.concat(m),d);return c.push(...ce(i)),{outputs:[{dims:i,dataType:t}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:c}},getShaderSource:u}},ef=(e,t)=>{let r=new Ul(e.inputs,t.equation),i=r.outputDims,n=e.inputs.map((a,s)=>a.dims);e.compute(Pl(n,e.inputs[0].dataType,r,i))},tf=e=>{let t=e.equation.replace(/\s+/g,"");return Ce({equation:t})}}),Ll,kn,Wl,ql,rf,Ty=J(()=>{"use strict";fe(),ge(),ye(),Ll=e=>{if(!e||e.length!==2)throw new Error("Expand requires 2 input.");let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=r.length<t.length?0:r.length-t.length,n=t.length<r.length?0:t.length-r.length;for(;i<r.length&&n<t.length;++i,++n)if(r[i]!==t[n]&&r[i]!==1&&t[n]!==1)throw new Error("Expand requires shape to be broadcastable to input")},kn=(e,t)=>{let r=e.length-t.length,i=[];for(let n=0;n<r;++n)i.push(e[n]);for(let n=0;n<t.length;++n)i.push(t[n]===1?e[n+r]:t[n]);return i},Wl=(e,t)=>e.length>t.length?kn(e,t):kn(t,e),ql=e=>{let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=Wl(t,r),n=e[0].dataType,a=n===9||P.size(t)===1,s=n===9||t.length>0&&t[t.length-1]%4===0?4:1,o=a||i.length>0&&i[i.length-1]%4===0?4:1,u=Math.ceil(P.size(i)/o),d=h=>{let m=q("input",n,t.length,s),g=ue("output",n,i.length,o),f;if(n===9){let $=(v,b,w="")=>`
          let outputIndices${b} = ${g.offsetToIndices(`outputOffset + ${b}u`)};
          let offset${b} = ${m.broadcastedIndicesToOffset(`outputIndices${b}`,g)};
          let index${b} = offset${b} / 4u;
          let component${b} = offset${b} % 4u;
          ${v}[${b}] = ${w}(${m.getByOffset(`index${b}`)}[component${b}]);
        `;f=`
        let outputOffset = global_idx * ${o};
        var data = vec4<u32>(0);
        ${$("data",0,"u32")}
        ${$("data",1,"u32")}
        ${$("data",2,"u32")}
        ${$("data",3,"u32")}
        ${g.setByOffset("global_idx","data")}
      }`}else f=`
        let outputIndices = ${g.offsetToIndices(`global_idx * ${o}`)};
        let inputOffset = ${m.broadcastedIndicesToOffset("outputIndices",g)};
        let data = ${g.type.value}(${m.getByOffset(`inputOffset / ${s}`)});
        ${g.setByOffset("global_idx","data")}
      }`;return`
    ${h.registerUniform("vec_size","u32").declareVariables(m,g)}
    ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${f}`},c=[{type:12,data:u},...ce(t,i)];return{name:"Expand",shaderCache:{hint:`${i.length};${s}${o}`,inputDependencies:["rank"]},getShaderSource:d,getRunData:()=>({outputs:[{dims:i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:c})}},rf=e=>{Ll(e.inputs),e.compute(ql(e.inputs),{inputs:[0]})}}),Gl,nf,Iy=J(()=>{"use strict";fe(),ge(),ye(),Aa(),Gl=e=>{let t=e[0].dataType,r=P.size(e[0].dims),i=P.size(e[1].dims),n=i%4===0,a=s=>{let o=q("x",t,[1],4),u=q("bias",t,[1],4),d=ue("y",t,[1],4),c=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],h=g=>`
      let bias${g}_offset: u32 = (global_idx * 4 + ${g}) % uniforms.bias_size;
      let bias${g} = ${u.getByOffset(`bias${g}_offset / 4`)}[bias${g}_offset % 4];`,m=n?`
      let bias = ${u.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${h(0)}${h(1)}${h(2)}${h(3)}
      let bias = ${o.type.value}(bias0, bias1, bias2, bias3);`;return`${s.registerUniforms(c).declareVariables(o,u,d)}

    ${ra(Le(t))}

    ${s.mainStart(sr)}
      ${s.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${o.getByOffset("global_idx")};
      ${m}
      let x_in = x + bias;
      ${d.setByOffset("global_idx",ia("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${n}`,inputDependencies:["type","type"]},getShaderSource:a,getRunData:s=>({outputs:[{dims:s[0].dims,dataType:s[0].dataType}],programUniforms:[{type:12,data:Math.ceil(r/4)},{type:12,data:i}],dispatchGroup:{x:Math.ceil(r/sr/4)}})}},nf=e=>{e.inputs.length<2||P.size(e.inputs[1].dims)===0?$h(e):e.compute(Gl(e.inputs))}}),Vl,Hl,af,sf,Cy=J(()=>{"use strict";fe(),ge(),Re(),ye(),Vl=e=>{if(!e||e.length!==2)throw new Error("Gather requires 2 inputs.")},Hl=(e,t)=>{let r=e[0].dims,i=e[1].dims,n=r.length,a=P.normalizeAxis(t.axis,n),s=r.slice(0);s.splice(a,1,...i);let o=r[a],u=e[0].dataType===9?4:1,d=Math.ceil(P.size(s)/u),c=[{type:12,data:d},{type:6,data:o},{type:12,data:a},...ce(e[0].dims,e[1].dims,s)],h=m=>{let g=q("data",e[0].dataType,e[0].dims.length,u),f=q("inputIndices",e[1].dataType,e[1].dims.length),$=ue("output",e[0].dataType,s.length,u),v=w=>{let k=i.length,S=`var indicesIndices${w}  = ${f.type.indices}(0);`;for(let T=0;T<k;T++)S+=`${k>1?`indicesIndices${w}[${T}]`:`indicesIndices${w}`} = ${s.length>1?`outputIndices${w}[uniforms.axis + ${T}]`:`outputIndices${w}`};`;S+=`
          var idx${w} = ${f.getByIndices(`indicesIndices${w}`)};
          if (idx${w} < 0) {
            idx${w} = idx${w} + uniforms.axisDimLimit;
          }
          var dataIndices${w} : ${g.type.indices};
        `;for(let T=0,E=0;T<n;T++)T===a?(S+=`${n>1?`dataIndices${w}[${T}]`:`dataIndices${w}`} = u32(idx${w});`,E+=k):(S+=`${n>1?`dataIndices${w}[${T}]`:`dataIndices${w}`} = ${s.length>1?`outputIndices${w}[${E}]`:`outputIndices${w}`};`,E++);return S},b;if(e[0].dataType===9){let w=(k,S,T="")=>`
          let outputIndices${S} = ${$.offsetToIndices(`outputOffset + ${S}u`)};
          ${v(S)};
          let offset${S} = ${g.indicesToOffset(`dataIndices${S}`)};
          let index${S} = offset${S} / 4u;
          let component${S} = offset${S} % 4u;
          ${k}[${S}] = ${T}(${g.getByOffset(`index${S}`)}[component${S}]);
        `;b=`
        let outputOffset = global_idx * ${u};
        var value = vec4<u32>(0);
        ${w("value",0,"u32")}
        ${w("value",1,"u32")}
        ${w("value",2,"u32")}
        ${w("value",3,"u32")}
        ${$.setByOffset("global_idx","value")}
      `}else b=`
      let outputIndices = ${$.offsetToIndices("global_idx")};
      ${v("")};
      let value = ${g.getByIndices("dataIndices")};
      ${$.setByOffset("global_idx","value")};
      `;return`
      ${m.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(g,f,$)}
      ${m.mainStart()}
        ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${b}
      }`};return{name:"Gather",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:s,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:c}),getShaderSource:h}},af=e=>Ce({axis:e.axis}),sf=(e,t)=>{let r=e.inputs;Vl(r),e.compute(Hl(e.inputs,t))}}),Fl,of,uf,Ey=J(()=>{"use strict";fe(),ge(),ye(),Fl=(e,t,r,i,n,a,s,o,u)=>{let d=[{type:12,data:a},{type:12,data:i},{type:12,data:n},{type:12,data:r},{type:12,data:s},{type:12,data:o},{type:12,data:u}],c=[a];d.push(...ce(t.dims,c));let h=m=>{let g=q("indices_data",t.dataType,t.dims.length),f=ue("input_slice_offsets_data",12,1,1),$=[g,f],v=[{name:"output_size",type:"u32"},{name:"batch_dims",type:"u32"},{name:"input_dims",type:"u32",length:n.length},{name:"sizes_from_slice_dims_data",type:"u32",length:r.length},{name:"num_slices_per_batch",type:"u32"},{name:"input_batch_stride",type:"u32"},{name:"num_slice_dims",type:"u32"}];return`
  ${m.registerUniforms(v).declareVariables(...$)}
  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
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
  }`};return e.compute({name:"computeSliceOffsets",shaderCache:{hint:`${n.length}_${r.length}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:c,dataType:e.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:d}),getShaderSource:h},{inputs:[t],outputs:[-1]})[0]},of=(e,t)=>{let r=e.inputs,i=r[0].dims,n=r[0].dataType,a=r[1].dims,s=a[a.length-1],o=P.sizeToDimension(a,a.length-1),u=P.sizeFromDimension(i,t.batchDims+s),d=P.sizeToDimension(i,t.batchDims),c=P.sizeFromDimension(i,t.batchDims),h=o/d,m=new Array(s),g=u;for(let S=0;S<s;++S)m[s-1-S]=g,g*=i[t.batchDims+s-1-S];let f=Fl(e,r[1],m,t.batchDims,i,o,h,c,s),$=t.batchDims+s;if($>i.length)throw new Error("last dimension of indices must not be larger than rank of input tensor");let v=a.slice(0,-1).concat(i.slice($)),b=P.size(v),w=[{type:12,data:b},{type:12,data:u},...ce(r[0].dims,f.dims,v)],k=S=>{let T=q("data",r[0].dataType,r[0].dims.length),E=q("slice_offsets",12,f.dims.length),C=ue("output",r[0].dataType,v.length);return`
          ${S.registerUniform("output_size","u32").registerUniform("slice_size","u32").declareVariables(T,E,C)}
            ${S.mainStart()}
            ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`};e.compute({name:"GatherND",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:v,dataType:n}],dispatchGroup:{x:Math.ceil(b/64)},programUniforms:w}),getShaderSource:k},{inputs:[r[0],f]})},uf=e=>({batchDims:e.batch_dims,cacheKey:""})}),jl,Kl,lf,df,zy=J(()=>{"use strict";fe(),ge(),Re(),ye(),jl=(e,t)=>{if(e.length<3||e.length>4)throw new Error("GatherBlockQuantized requires 3 or 4 inputs.");let r=P.normalizeAxis(t.quantizeAxis,e[0].dims.length),i=t.blockSize,n=e[0],a=e[2],s=e.length===4?e[3]:void 0;if(a.dims.length!==n.dims.length||!n.dims.map((o,u)=>u===r?Math.ceil(o/i)===a.dims[u]:o===a.dims[u]).reduce((o,u)=>o&&u,!0))throw new Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");if(s){if(s.dataType!==n.dataType)throw new Error("Zero point must have the same data type as the input tensor.");if(s.dims.length!==a.dims.length||!s.dims.map((o,u)=>o===a.dims[u]).reduce((o,u)=>o&&u,!0))throw new Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.")}},Kl=(e,t)=>{let r=e[0].dims,i=e[1].dims,n=r.length,a=P.normalizeAxis(t.gatherAxis,n),s=P.normalizeAxis(t.quantizeAxis,n),o=r.slice(0);o.splice(a,1,...i);let u=P.size(o),d=e[2].dataType,c=e[0].dataType===22,h=[{type:12,data:u},{type:12,data:s},{type:12,data:a},{type:12,data:t.blockSize},...ce(...e.map((g,f)=>g.dims),o)],m=g=>{let f=q("data",e[0].dataType,e[0].dims.length),$=q("inputIndices",e[1].dataType,e[1].dims.length),v=q("scales",e[2].dataType,e[2].dims.length),b=e.length>3?q("zeroPoint",e[3].dataType,e[3].dims.length):void 0,w=ue("output",d,o.length),k=[f,$,v];b&&k.push(b);let S=[{name:"output_size",type:"u32"},{name:"quantize_axis",type:"u32"},{name:"gather_axis",type:"u32"},{name:"block_size",type:"u32"}];return`
        ${g.registerUniforms(S).declareVariables(...k,w)}
        ${g.mainStart()}
        let output_indices = ${w.offsetToIndices("global_idx")};
        var indices_indices = ${$.type.indices}(0);
        ${i.length>1?`
          for (var i: u32 = 0; i < ${i.length}; i++) {
            let index = ${w.indicesGet("output_indices","uniforms.gather_axis + i")};
            ${$.indicesSet("indices_indices","i","index")};
          }`:`indices_indices = ${w.indicesGet("output_indices","uniforms.gather_axis")};`};
        var data_indices = ${f.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${w.indicesGet("output_indices","i")};
          ${f.indicesSet("data_indices","i","index")};
        }
        var index_from_indices = ${$.getByIndices("indices_indices")};
        if (index_from_indices < 0) {
          index_from_indices += ${r[a]};
        }
        ${f.indicesSet("data_indices","uniforms.gather_axis","u32(index_from_indices)")};
        for (var i = uniforms.gather_axis + 1; i < ${o.length}; i++) {
          let index = ${w.indicesGet("output_indices",`i + ${i.length} - 1`)};
          ${f.indicesSet("data_indices","i","index")};
        }
        let data_offset = ${f.indicesToOffset("data_indices")};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${f.getByOffset("data_offset / 8")};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${c?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${v.indicesGet("data_indices","uniforms.quantize_axis")} / uniforms.block_size;
        ${v.indicesSet("scale_indices","uniforms.quantize_axis","quantize_axis_index")};
        var scale = ${v.getByIndices("scale_indices")};
        ${b?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${b.indicesToOffset("zero_point_indices")};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${b.getByOffset("zero_point_offset / 8")};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${c?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:"var zero_point = 0"};
        let dequantized_data = ${Le(d)}(quantized_data - zero_point) * scale;
        ${w.setByOffset("global_idx","dequantized_data")};
    }`};return{name:"GatherBlockQuantized",shaderCache:{hint:`${t.cacheKey};${e.filter((g,f)=>f!==1).map(g=>g.dims.join("_")).join(";")}`,inputDependencies:Array.from({length:e.length},(g,f)=>"rank")},getRunData:()=>({outputs:[{dims:o,dataType:d}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:h}),getShaderSource:m}},lf=(e,t)=>{let r=e.inputs;jl(r,t),e.compute(Kl(e.inputs,t))},df=e=>Ce({blockSize:e.blockSize,gatherAxis:e.gatherAxis,quantizeAxis:e.quantizeAxis})}),Zl,Yl,cf,pf,Ay=J(()=>{"use strict";fe(),ge(),Re(),ye(),Zl=e=>{if(!e||e.length!==2)throw new Error("GatherElements requires 2 inputs.");if(e[0].dims.length<1)throw new Error("GatherElements requires that the data input be rank >= 1.");if(e[0].dims.length!==e[1].dims.length)throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},Yl=(e,t)=>{let r=e[0].dims,i=e[0].dataType,n=r.length,a=e[1].dims,s=e[1].dataType,o=P.normalizeAxis(t.axis,n),u=r[o],d=a.slice(0),c=P.size(d),h=q("input",i,n),m=q("indicesInput",s,a.length),g=ue("output",i,d.length),f=[{type:12,data:c},{type:6,data:u},{type:12,data:o}];return f.push(...ce(r,a,d)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:d,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:f}),getShaderSource:$=>`
      ${$.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(h,m,g)}
      ${$.mainStart()}
      ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${g.offsetToIndices("global_idx")};

      var idx = ${m.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${h.type.indices}(outputIndices);
      ${h.indicesSet("inputIndices","uniforms.axis","u32(idx)")};
      let value = ${h.getByIndices("inputIndices")};

      ${g.setByOffset("global_idx","value")};
  }`}},cf=e=>Ce({axis:e.axis}),pf=(e,t)=>{let r=e.inputs;Zl(r),e.compute(Yl(e.inputs,t))}}),Ql,Xl,hf,ff,My=J(()=>{"use strict";fe(),ge(),ye(),Ql=e=>{if(!e)throw new Error("Input is missing");if(e.length<2||e.length>3)throw new Error("Invaid input number.");if(e.length===3&&e[2].dims.length>2)throw new Error("Invalid input shape of C");if(e[0].dataType!==e[1].dataType||e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("Input types are mismatched")},Xl=(e,t)=>{let r=e[0].dims.slice(),i=e[1].dims.slice(),[n,a,s]=op.getShapeOfGemmResult(r,t.transA,i,t.transB,e.length===3?e[2].dims:void 0),o=[n,a];if(!o)throw new Error("Can't use gemm on the given tensors");let u=16,d=Math.ceil(a/u),c=Math.ceil(n/u),h=!0,m=P.size(o),g=[{type:12,data:h?d:m},{type:12,data:n},{type:12,data:a},{type:12,data:s},{type:1,data:t.alpha},{type:1,data:t.beta}],f=["type","type"];e.length===3&&(g.push(...ce(e[2].dims)),f.push("rank")),g.push(...ce(o));let $=b=>{let w="";t.transA&&t.transB?w="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":t.transA&&!t.transB?w="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!t.transA&&t.transB?w="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":!t.transA&&!t.transB&&(w="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let k=t.alpha===1?"":"value *= uniforms.alpha;",S=q("a",e[0].dataType,e[0].dims),T=q("b",e[1].dataType,e[1].dims),E=S.type.value,C=null,x=[S,T];e.length===3&&(C=q("c",e[2].dataType,e[2].dims.length),x.push(C));let M=ue("output",e[0].dataType,o.length);x.push(M);let U=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${b.registerUniforms(U).declareVariables(...x)}

  ${b.mainStart()}
    ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${E}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${w}
    }

    ${k}
    ${C!=null?`let cOffset = ${C.broadcastedIndicesToOffset("vec2(m, n)",M)}; value += ${E}(uniforms.beta) * ${C.getByOffset("cOffset")};`:""}
    output[global_idx] = value;
  }`},v=b=>{let w=q("a",e[0].dataType,e[0].dims),k=q("b",e[1].dataType,e[1].dims),S=null,T=[w,k];e.length===3&&(S=q("c",e[2].dataType,e[2].dims.length),T.push(S));let E=ue("output",e[0].dataType,o.length);T.push(E);let C=[{name:"num_tile_n",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}],x="",M="";t.transA&&t.transB?(M=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${w.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${k.type.value}(0);
      }
      `,x="value += tile_a[k][local_id.y] * tile_b[local_id.x][k];"):t.transA&&!t.transB?(M=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${w.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${k.type.value}(0);
      }
      `,x="value += tile_a[k][local_id.y] * tile_b[k][local_id.x];"):!t.transA&&t.transB?(M=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${w.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${k.type.value}(0);
      }
      `,x="value += tile_a[local_id.y][k] * tile_b[local_id.x][k];"):!t.transA&&!t.transB&&(M=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${w.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${k.type.value}(0);
      }
      `,x="value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");let U=t.alpha===1?"":"value *= uniforms.alpha;";return`
  ${b.registerUniforms(C).declareVariables(...T)}
  var<workgroup> tile_a: array<array<${w.type.storage}, ${u}>, ${u}>;
  var<workgroup> tile_b: array<array<${k.type.storage}, ${u}>, ${u}>;
  ${b.mainStart([u,u,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * ${u};
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * ${u};
    let num_tiles = (uniforms.K - 1) / ${u} + 1;
    var k_start = 0u;
    var value = ${E.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${M}
      k_start = k_start + ${u};
      workgroupBarrier();

      for (var k: u32 = 0u; k < ${u}; k++) {
        ${x}
      }
      workgroupBarrier();
    }

    ${U}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${S!=null?`let cOffset = ${S.broadcastedIndicesToOffset("vec2(m, n)",E)}; value += ${E.type.value}(uniforms.beta) * ${S.getByOffset("cOffset")};`:""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`};return h?{name:"GemmShared",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:f},getRunData:()=>({outputs:[{dims:o,dataType:e[0].dataType}],dispatchGroup:{x:d*c},programUniforms:g}),getShaderSource:v}:{name:"Gemm",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:f},getRunData:()=>({outputs:[{dims:o,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:g}),getShaderSource:$}},hf=e=>{let t=e.transA,r=e.transB,i=e.alpha,n=e.beta;return{transA:t,transB:r,alpha:i,beta:n,cacheKey:`${e.transA};${e.transB};${e.alpha===1}`}},ff=(e,t)=>{Ql(e.inputs),e.compute(Xl(e.inputs,t))}}),dt,gt,Mt,Ot,Jl,ed,td,rd,id,nd,ad,sd,mf,gf,Oy=J(()=>{"use strict";fe(),ge(),Re(),ye(),[dt,gt,Mt,Ot]=[0,1,2,3],Jl=e=>{if(e[0].dims.length!==4)throw new Error("only 4-D tensor is supported.");if(e[0].dims.length!==e[1].dims.length)throw new Error("input dimensions must be equal to grid dimensions");if(e[0].dims.length-2!==e[1].dims[e[1].dims.length-1])throw new Error(`last dimension of grid must be equal to ${e[0].dims.length-2}`);if(e[0].dims[0]!==e[1].dims[0])throw new Error("grid batch size must match input batch size")},ed=`
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
`,td=e=>`
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
`,rd=e=>`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${e.alignCorners===0?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`,id=e=>`
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
`,nd=(e,t,r)=>`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${t} {
     var pixel = ${t}(0);
     var indices = vec4<u32>(0);
     indices[${dt}] = batch;
     indices[${gt}] = channel;`+(()=>{switch(r.paddingMode){case"zeros":return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${Mt}] = u32(r);
            indices[${Ot}] = u32(c);
          } else {
            return ${t}(0);
          }
        `;case"border":return`
          indices[${Mt}] = u32(clamp(r, 0, H - 1));
          indices[${Ot}] = u32(clamp(c, 0, W - 1));
        `;case"reflection":return`
          indices[${Mt}] = gs_reflect(r, border[1], border[3]);
          indices[${Ot}] = gs_reflect(c, border[0], border[2]);
        `;default:throw new Error(`padding mode ${r.paddingMode} is not supported`)}})()+`
    return ${e.getByIndices("indices")};
  }
`,ad=(e,t,r)=>(()=>{switch(r.mode){case"nearest":return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${dt}], indices[${gt}], border);
        `;case"bilinear":return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${dt}], indices[${gt}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${dt}], indices[${gt}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${dt}], indices[${gt}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${dt}], indices[${gt}], border);

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
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${dt}], indices[${gt}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw new Error(`mode ${r.mode} is not supported`)}})()+`${e.setByOffset("global_idx","result")}`,sd=(e,t)=>{let r=q("x",e[0].dataType,e[0].dims.length),i=[e[1].dims[0],e[1].dims[1],e[1].dims[2]],n=q("grid",e[1].dataType,i.length,2),a=[e[0].dims[0],e[0].dims[1],e[1].dims[1],e[1].dims[2]];t.format==="NHWC"&&(a=[e[0].dims[0],e[1].dims[1],e[1].dims[2],e[0].dims[3]],[dt,gt,Mt,Ot]=[0,3,1,2]);let s=ue("output",e[0].dataType,a.length),o=r.type.value,u=P.size(a),d=[{type:12,data:u},...ce(e[0].dims,i,a)],c=h=>`
  ${h.registerUniform("output_size","u32").declareVariables(r,n,s)}
  ${ed}
  ${td(o)}
  ${rd(t)}
  ${id(t)}
  ${nd(r,o,t)}

  ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${Mt}]);
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
      var grid_indices = vec3<u32>(indices[${dt}], indices[${Mt}], indices[${Ot}]);
      let nxy = ${n.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${ad(s,o,t)}
  }`;return{name:"GridSample",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:["type","type"]},getRunData:h=>{let m=P.size(a);return{outputs:[{dims:a,dataType:h[0].dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:d}},getShaderSource:c}},mf=(e,t)=>{Jl(e.inputs),e.compute(sd(e.inputs,t))},gf=e=>Ce({alignCorners:e.align_corners,mode:e.mode,paddingMode:e.padding_mode,format:e.format})}),He,od,yf,Sn,ud,Sr,wf,_f=J(()=>{"use strict";fe(),ge(),Re(),Ia(),za(),ye(),Ct(),He=(e,t)=>e.length>t&&e[t].dims.length>0?e[t]:void 0,od=(e,t)=>{let r=e[0],i=He(e,1),n=He(e,2),a=He(e,3),s=He(e,4),o=He(e,5),u=He(e,6),d=He(e,7);if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let c=r.dims[0],h=r.dims[1],m=r.dims.length===3?r.dims[2]:t.numHeads*r.dims[4],g=h,f=0,$=0,v=Math.floor(m/t.numHeads);if(u&&d&&P.size(u.dims)&&P.size(d.dims)){if(u.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(u.dims[0]!==c||u.dims[1]!==t.numHeads||u.dims[3]!==v)throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(d.dims[0]!==c||d.dims[1]!==t.numHeads||d.dims[3]!==v)throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(u.dims[2]!==d.dims[2])throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(d.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');f=u.dims[2],$=u.dims[2]}else if(u&&P.size(u.dims)||d&&P.size(d.dims))throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let b;if(i&&P.size(i.dims)>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(i.dims[2]!==r.dims[2])throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');b=2,g=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==v)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(n)throw new Error('Expect "value" be none when "key" has packed kv format.');b=5,g=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==v)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');b=0,g=i.dims[2]}}else{if(r.dims.length!==5)throw new Error('Input "query" is expected to have 5 dimensions when key is empty');if(r.dims[2]!==t.numHeads||r.dims[3]!==3)throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');b=3}if(a&&P.size(a.dims)>0){if(a.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimension');if(i&&i.dims.length===5&&i.dims[3]===2)throw new Error("bias is not allowed for packed kv.")}let w=f+g,k=0;if(s&&P.size(s.dims)>0){k=8;let C=s.dims;throw C.length===1?C[0]===c?k=1:C[0]===3*c+2&&(k=3):C.length===2&&C[0]===c&&C[1]===w&&(k=5),k===8?new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)'):new Error("Mask not supported")}let S=!1,T=m;if(n&&P.size(n.dims)>0){if(n.dims.length!==3&&n.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==n.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(n.dims.length===3){if(g!==n.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');T=n.dims[2]}else{if(g!==n.dims[2])throw new Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');T=n.dims[1]*n.dims[3],S=!0}}let E=!1;if(s&&P.size(s.dims)>0)throw new Error("Key padding mask is not supported");if(o&&P.size(o.dims)>0){if(o.dims.length!==4)throw new Error('Input "attention_bias" is expected to have 4 dimensions');if(o.dims[0]!==c||o.dims[1]!==t.numHeads||o.dims[2]!==h||o.dims[3]!==w)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:c,sequenceLength:h,pastSequenceLength:f,kvSequenceLength:g,totalSequenceLength:w,maxSequenceLength:$,inputHiddenSize:0,hiddenSize:m,vHiddenSize:T,headSize:v,vHeadSize:Math.floor(T/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:k,scale:t.scale,broadcastResPosBias:E,passPastInKv:S,qkvFormat:b}},yf=e=>Ce({...e}),Sn=Ce({perm:[0,2,1,3]}),ud=(e,t,r,i,n,a,s)=>{let o=[i,n,a],u=P.size(o),d=[{type:12,data:u},{type:12,data:s},{type:12,data:a}],c=h=>{let m=ue("qkv_with_bias",t.dataType,o),g=q("qkv",t.dataType,o),f=q("bias",r.dataType,o),$=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${h.registerUniforms($).declareVariables(g,f,m)}
  ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return e.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:o,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:d}),getShaderSource:c},{inputs:[t,r],outputs:[-1]})[0]},Sr=(e,t,r,i,n,a,s,o)=>{let u=a;if(s&&P.size(s.dims)>0){if(i===1)throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return u=ud(e,a,s,t,i,r*n,o),u=u.reshape([t,i,r,n]),r===1||i===1?u:e.compute(Ze(u,Sn.perm),{inputs:[u],outputs:[-1]})[0]}else return a.dims.length===3&&(u=a.reshape([t,i,r,n])),r===1||i===1?u:e.compute(Ze(u,Sn.perm),{inputs:[u],outputs:[-1]})[0]},wf=(e,t)=>{let r=od(e.inputs,t),i=e.inputs[0],n=He(e.inputs,1),a=He(e.inputs,2),s=He(e.inputs,3),o=He(e.inputs,4),u=He(e.inputs,5),d=He(e.inputs,6),c=He(e.inputs,7);if(i.dims.length===5)throw new Error("Packed QKV is not implemented");if(n?.dims.length===5)throw new Error("Packed KV is not implemented");let h=n&&a&&n.dims.length===4&&a.dims.length===4,m=Sr(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,i,s,0);if(h)return zr(e,m,n,a,o,void 0,d,c,u,r);if(!n||!a)throw new Error("key and value must be provided");let g=Sr(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.headSize,n,s,r.hiddenSize),f=Sr(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.vHeadSize,a,s,2*r.hiddenSize);zr(e,m,g,f,o,void 0,d,c,u,r)}}),ld,dd,cd,pd,ua,bf,$f,vf=J(()=>{"use strict";fe(),ge(),Re(),ye(),ld=e=>{if(!e||e.length<1)throw new Error("too few inputs")},dd=(e,t)=>{let r=[],i=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(n=>r.push(Number(n))),i=r.length),Ce({numOutputs:i,axis:t.axis,splitSizes:r})},cd=e=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${de("uniforms.size_in_split_axis","i",e)}) {
        return i;
    }
    }
    return ${e}u;
}`,pd=e=>{let t=e.length,r=[];for(let i=0;i<t;++i){let n=e[i].setByIndices("indices","input[global_idx]");t===1?r.push(n):i===0?r.push(`if (output_number == ${i}u) { ${n} }`):i===t-1?r.push(`else { ${n} }`):r.push(`else if (output_number == ${i}) { ${n} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${r.join(`
`)}
      }`},ua=(e,t)=>{let r=e[0].dims,i=P.size(r),n=e[0].dataType,a=P.normalizeAxis(t.axis,r.length),s=new Array(t.numOutputs),o=q("input",n,r.length),u=new Array(t.numOutputs),d=[],c=[],h=0,m=[{type:12,data:i}];for(let f=0;f<t.numOutputs;f++){h+=t.splitSizes[f],u[f]=h;let $=r.slice();$[a]=t.splitSizes[f],c.push($),s[f]=ue(`output${f}`,n,$.length),d.push({dims:c[f],dataType:e[0].dataType})}m.push({type:12,data:u},...ce(r,...c));let g=f=>`
  ${f.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",u.length).declareVariables(o,...s)}
  ${cd(u.length)}
  ${pd(s)}

  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${o.offsetToIndices("global_idx")};
    var index = ${o.indicesGet("indices",a)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${de("uniforms.size_in_split_axis","output_number - 1u",u.length)};
      ${o.indicesSet("indices",a,"index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;return{name:"Split",shaderCache:{hint:t.cacheKey,inputDependencies:["rank"]},getShaderSource:g,getRunData:()=>({outputs:d,dispatchGroup:{x:Math.ceil(i/64)},programUniforms:m})}},bf=(e,t)=>{ld(e.inputs);let r=e.inputs.length===1?t:dd(e.inputs,t);e.compute(ua(e.inputs,r),{inputs:[0]})},$f=e=>{let t=e.axis,r=e.splitSizes,i=e.numOutputs<0?r.length:e.numOutputs;if(i!==r.length)throw new Error("numOutputs and splitSizes length must be equal");return Ce({axis:t,numOutputs:i,splitSizes:r})}}),hd,hi,xf,kf=J(()=>{"use strict";fe(),ge(),Re(),ye(),hd=(e,t)=>{let[r,i,n,a]=e,{numHeads:s,rotaryEmbeddingDim:o}=t;if(r.dims.length!==3&&r.dims.length!==4)throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${r.dims.length}`);if(!P.areEqual(i.dims,[])&&!P.areEqual(i.dims,[1])&&i.dims.length!==2)throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${i.dims.length}`);if(n.dims.length!==2)throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${n.dims.length}`);if(a.dims.length!==2)throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${a.dims.length}`);if(!P.areEqual(n.dims,a.dims))throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(o>0&&s===0)throw new Error("num_heads must be provided if rotary_embedding_dim is specified");let u=r.dims[0],d=r.dims[r.dims.length-2],c=n.dims[0],h=P.sizeFromDimension(r.dims,1)/d,m=o===0?n.dims[1]*2:h/s;if(o>m)throw new Error("rotary_embedding_dim must be less than or equal to head_size");if(i.dims.length===2){if(u!==i.dims[0])throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${i.dims[0]}`);if(d!==i.dims[1])throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${i.dims[1]}`)}if(d>c)throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported");if(m/2!==n.dims[1]&&o/2!==n.dims[1])throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${n.dims[1]}`)},hi=(e,t)=>{let{interleaved:r,numHeads:i,rotaryEmbeddingDim:n,scale:a}=t,s=e[0].dims[0],o=P.sizeFromDimension(e[0].dims,1),u=e[0].dims[e[0].dims.length-2],d=o/u,c=e[2].dims[1],h=n===0?c*2:d/i,m=new Array(s,u,d/h,h-c),g=P.computeStrides(m),f=[{type:1,data:a},{type:12,data:m},{type:12,data:g},...e[0].dims.length===3?new Array({type:12,data:[o,d,h,1]}):[],...e[0].dims.length===4?new Array({type:12,data:[o,h,u*h,1]}):[],...ce(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)],$=v=>{let b=q("input",e[0].dataType,e[0].dims.length),w=q("position_ids",e[1].dataType,e[1].dims.length),k=q("cos_cache",e[2].dataType,e[2].dims.length),S=q("sin_cache",e[3].dataType,e[3].dims.length),T=ue("output",e[0].dataType,e[0].dims.length);return v.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:m.length},{name:"global_strides",type:"u32",length:g.length},{name:"input_output_strides",type:"u32",length:g.length}]),`
        ${v.declareVariables(b,w,k,S,T)}

        ${v.mainStart(sr)}
          let half_rotary_emb_dim = uniforms.${k.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${v.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${w.broadcastedIndicesToOffset("bsnh.xy",ue("",w.type.tensor,2))};
            let position_id =
                u32(${w.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${r});
            let j = i + select(half_rotary_emb_dim, 1, ${r});
            let re = ${b.getByOffset("i")} * ${k.get("position_id","bsnh[3]")} -
                ${b.getByOffset("j")} * ${S.get("position_id","bsnh[3]")};
            ${T.setByOffset("i","re")}
            let im = ${b.getByOffset("i")} * ${S.get("position_id","bsnh[3]")} +
                ${b.getByOffset("j")} * ${k.get("position_id","bsnh[3]")};
            ${T.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${T.setByOffset("k",b.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:Ce({interleaved:r}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:$,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(P.size(m)/sr)},programUniforms:f})}},xf=(e,t)=>{hd(e.inputs,t),e.compute(hi(e.inputs,t))}}),fd,md,Tn,gd,Sf,By=J(()=>{"use strict";Re(),fe(),za(),_f(),vf(),Ct(),kf(),ye(),fd=(e,t)=>{if(t.doRotary&&e.length<=7)throw new Error("cos_cache and sin_cache inputs are required if do_rotary is specified");let r=e[0],i=e[1],n=e[2],a=e[3],s=e[4];if(t.doRotary!==0&&e.length<=7)throw new Error("cos_cast and sin_cache are expected if do_rotary attribute is non-zero");if(t.localWindowSize!==-1)throw new Error("Local attention is not supported");if(t.softcap!==0)throw new Error("Softcap is not supported");if(t.rotaryInterleaved!==0)throw new Error("Rotary interleaved is not supported");if(t.smoothSoftmax)throw new Error("Smooth softmax is not supported");if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let o=!1,u=r.dims[0],d=r.dims[1],c=r.dims.length===3?o?r.dims[2]/3:r.dims[2]:t.numHeads*r.dims[4],h=d,m=0,g=!i||i.dims.length===0,f=Math.floor(g?c/(t.numHeads+2*t.kvNumHeads):c/t.numHeads);g&&(c=f*t.numHeads);let $=a&&a.dims.length!==0,v=s&&s.dims.length!==0;if($&&a.dims.length===4&&a.dims[0]===u&&a.dims[1]!==t.kvNumHeads&&a.dims[2]===t.kvNumHeads&&a.dims[3]===f)throw new Error("BSNH pastKey/pastValue is not supported");if($&&v){if(a.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(s.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');m=a.dims[2]}else if($||v)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let b=1;if(i&&i.dims.length>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(r.dims[2]%i.dims[2]!==0)throw new Error('Dimension 2 of "query" should be a multiple of "key"');h=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==f)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(n)throw new Error('Expect "value" be none when "key" has packed kv format.');h=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==f)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');h=i.dims[2]}}else{if(r.dims.length!==3&&r.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(r.dims.length===5&&(r.dims[2]!==t.numHeads||r.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');b=3}let w=0,k=!1,S=t.kvNumHeads?f*t.kvNumHeads:c;if(n&&n.dims.length>0){if(n.dims.length!==3&&n.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==n.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(n.dims.length===3){if(h!==n.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');S=n.dims[2]}else{if(h!==n.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');S=n.dims[1]*n.dims[3],k=!0}}let T=e.length>4?e[5]:void 0;if(T){if(T.dims.length===0)throw new Error("seqlens_k must be at least 1D, got scalar.");let E=T.dims.reduce((C,x)=>C*x,1);if(E!==u)throw new Error(`seqlens_k must have batch_size (${u}) elements, got ${E}.`);for(let C=0;C<T.dims.length;C++)if(T.dims[C]!==1&&T.dims[C]!==u)throw new Error(`seqlens_k has unexpected shape. Each dimension must be 1 or batch_size (${u}), got dims[${C}] = ${T.dims[C]}.`)}return{batchSize:u,sequenceLength:d,pastSequenceLength:m,kvSequenceLength:h,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:c,vHiddenSize:S,headSize:f,vHeadSize:Math.floor(S/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:w,scale:t.scale,broadcastResPosBias:!1,passPastInKv:k,qkvFormat:b}},md=Ce({perm:[0,2,1,3]}),Tn=(e,t,r)=>{let i=t,n=r.kvNumHeads;return t.dims.length===3&&r.kvSequenceLength!==0&&(i=t.reshape([r.batchSize,r.kvSequenceLength,n,r.headSize]),i=e.compute(Ze(i,md.perm),{inputs:[i],outputs:[-1]})[0]),i},gd=(e,t,r,i)=>{let n=7,a=["type","type"],s=[e*t],o=e*t,u=[{type:12,data:o},{type:12,data:t},{type:12,data:e}],d=c=>{let h=q("seq_lens",r.dataType,r.dims),m=q("total_seq_lens",i.dataType,i.dims),g=ue("pos_ids",n,s),f=[{name:"output_size",type:"u32"},{name:"sequence_length",type:"u32"},{name:"batch_size",type:"u32"}];return`
  ${c.registerUniforms(f).declareVariables(h,m,g)}
  ${c.mainStart()}
    ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let total_sequence_length = u32(${m.getByOffset("0")});
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
      ${g.setByOffset("global_idx","pos_id")}
    } else if (is_subsequent_prompt) {
      let past_seqlen = total_seqlen - i32(uniforms.sequence_length);
      if (past_seqlen + sequence_idx < total_seqlen) {
        pos_id = past_seqlen + sequence_idx;
      } else {
        pos_id = 1;
      }
      ${g.setByOffset("global_idx","pos_id")}
    } else if (global_idx < uniforms.batch_size) {
      ${g.setByOffset("global_idx","seqlen")}
    };
  }
  `};return{name:"GeneratePositionIds",shaderCache:{hint:`${e};${t}`,inputDependencies:a},getRunData:()=>({outputs:[{dims:s,dataType:n}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:u}),getShaderSource:d}},Sf=(e,t)=>{if(e.inputs.length>14&&e.inputs[14]||e.inputs.length>15&&e.inputs[15])throw new Error("GroupQueryAttention (JSEP): q_norm_weight / k_norm_weight inputs are not supported. The per-head Q/K RMS normalization prologue is implemented only on the CUDA and native WebGPU EPs.");let r=fd(e.inputs,t);if(e.inputs[0].dims.length===5)throw new Error("Packed QKV is not implemented");if(e.inputs[1]?.dims.length===5)throw new Error("Packed KV is not implemented");let i=e.inputs[0],n=e.inputs[1]&&e.inputs[1].dims.length>0?e.inputs[1]:void 0,a=e.inputs[2]&&e.inputs[2].dims.length>0?e.inputs[2]:void 0,s=e.inputs[3]&&e.inputs[3].dims.length!==0?e.inputs[3]:void 0,o=e.inputs[4]&&e.inputs[4].dims.length!==0?e.inputs[4]:void 0,u=e.inputs.length>4?e.inputs[5]:void 0,d=e.inputs.length>5?e.inputs[6]:void 0,c=r.kvNumHeads?r.kvNumHeads:r.numHeads,h=Ce({axis:2,numOutputs:3,splitSizes:[r.numHeads*r.headSize,c*r.headSize,c*r.headSize]}),[m,g,f]=!n&&!a?e.compute(ua([i],h),{inputs:[i],outputs:[-1,-1,-1]}):[i,n,a],$,v;if(t.doRotary){let S=e.compute(gd(r.batchSize,r.sequenceLength,u,d),{inputs:[u,d],outputs:[-1]})[0],T=e.inputs[7],E=e.inputs[8],C=Ce({interleaved:t.rotaryInterleaved!==0,numHeads:r.numHeads,rotaryEmbeddingDim:0,scale:t.scale}),x=[m,S,T,E],M=[-1];$=e.compute(hi(x,C),{inputs:x,outputs:M})[0],x.splice(0,1,g);let U=Ce({interleaved:t.rotaryInterleaved!==0,numHeads:r.kvNumHeads,rotaryEmbeddingDim:0,scale:t.scale});v=e.compute(hi(x,U),{inputs:x,outputs:M})[0]}let b=Sr(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,t.doRotary?$:m,void 0,0),w=Tn(e,t.doRotary?v:g,r),k=Tn(e,f,r);zr(e,b,w,k,void 0,void 0,s,o,void 0,r,u,d)}}),In,yd,wd,Tf,Ry=J(()=>{"use strict";fe(),ge(),Ct(),ye(),In=(e,t,r,i,n,a,s,o)=>{let u=Be(a),d=u===1?"f32":`vec${u}f`,c=u===1?"vec2f":`mat2x${u}f`,h=n*s,m=64;h===1&&(m=256);let g=[n,s,a/u],f=[n,s,2],$=["rank","type","type"],v=[];v.push(...ce(g,f));let b=w=>{let k=q("x",t.dataType,3,u),S=q("scale",r.dataType,r.dims),T=q("bias",i.dataType,i.dims),E=ue("output",1,3,2),C=[k,S,T,E];return`
  var<workgroup> workgroup_shared : array<${c}, ${m}>;
  const workgroup_size = ${m}u;
  ${w.declareVariables(...C)}
  ${w.mainStart(m)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${d}(0);
    var squared_sum = ${d}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${d}(${k.get("batch","channel","h")});
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
      let sum_final = ${It("workgroup_shared[0][0]",u)} / f32(hight * ${u});
      let squared_sum_final = ${It("workgroup_shared[0][1]",u)} / f32(hight * ${u});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${o}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`};return e.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${u};${o};${m}`,inputDependencies:$},getRunData:()=>({outputs:[{dims:f,dataType:1}],dispatchGroup:{x:h},programUniforms:v}),getShaderSource:b},{inputs:[t,r,i],outputs:[-1]})[0]},yd=(e,t,r)=>{let i=t[0].dims,n=i,a=2,s=i[0],o=i[1],u=P.sizeFromDimension(i,a),d=Be(u),c=P.size(n)/d,h=In(e,t[0],t[1],t[2],s,u,o,r.epsilon),m=[s,o,u/d],g=[s,o],f=["type","none"],$=v=>{let b=q("x",t[0].dataType,m.length,d),w=q("scale_shift",1,g.length,2),k=ue("output",t[0].dataType,m.length,d),S=[b,w,k];return`
  ${v.registerUniform("output_size","u32").declareVariables(...S)}
  ${v.mainStart()}
  ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${k.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${w.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${b.getByOffset("global_idx")} * ${k.type.value}(scale_shift.x) + ${k.type.value}(scale_shift.y);
      ${k.setByOffset("global_idx","value")};
  }`};e.compute({name:"InstanceNormalization",shaderCache:{hint:`${d}`,inputDependencies:f},getRunData:()=>({outputs:[{dims:n,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:[{type:12,data:c},...ce(m,g,m)]}),getShaderSource:$},{inputs:[t[0],h]})},wd=(e,t,r)=>{let i=t[0].dims,n=i,a=i[0],s=i[i.length-1],o=P.sizeFromDimension(i,1)/s,u=Be(s),d=P.size(n)/u,c=[{type:12,data:o},{type:12,data:Math.floor(s/u)}],h=["type","type"],m=!1,g=[0,i.length-1];for(let b=0;b<i.length-2;b++)m=m||i[b+1]!==1,g.push(b+1);m=m&&i[i.length-1]!==1;let f=m?e.compute(Ze(e.inputs[0],g),{inputs:[e.inputs[0]],outputs:[-1]})[0]:e.inputs[0].reshape(Array.from({length:i.length},(b,w)=>i[g[w]])),$=In(e,f,t[1],t[2],a,o,s,r.epsilon),v=b=>{let w=We(t[0].dataType),k=u===1?"vec2f":`mat${u}x2f`,S=C=>{let x=C===0?"x":"y",M=u===1?"f32":`vec${u}f`;switch(u){case 1:return`${w}(${M}(scale.${x}))`;case 2:return`vec2<${w}>(${M}(scale[0].${x}, scale[1].${x}))`;case 4:return`vec4<${w}>(${M}(scale[0].${x}, scale[1].${x}, scale[2].${x}, scale[3].${x}))`;default:throw new Error(`Not supported compoents ${u}`)}},T=q("input",t[0].dataType,t[0].dims,u),E=ue("output",t[0].dataType,n,u);return`
  @group(0) @binding(0) var<storage, read> input : array<${T.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${k}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${E.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${b.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${S(0)}, ${S(1)});
  }`};e.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${u}`,inputDependencies:h},getRunData:()=>({outputs:[{dims:n,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:c}),getShaderSource:v},{inputs:[t[0],$]})},Tf=(e,t)=>{t.format==="NHWC"?wd(e,e.inputs,t):yd(e,e.inputs,t)}}),_d,bd,If,Dy=J(()=>{"use strict";fe(),ge(),ye(),_d=e=>{if(!e||e.length<2)throw new Error("layerNorm requires at least 2 inputs.")},bd=(e,t,r)=>{let i=t.simplified,n=e[0].dims,a=e[1],s=!i&&e[2],o=n,u=P.normalizeAxis(t.axis,n.length),d=P.sizeToDimension(n,u),c=P.sizeFromDimension(n,u),h=P.size(a.dims),m=s?P.size(s.dims):0;if(h!==c||s&&m!==c)throw new Error(`Size of X.shape()[axis:] == ${c}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${h} and bias size of ${m}`);let g=[];for(let T=0;T<n.length;++T)T<u?g.push(n[T]):g.push(1);let f=Be(c),$=["type","type"],v=[{type:12,data:d},{type:1,data:c},{type:12,data:Math.floor(c/f)},{type:1,data:t.epsilon}];s&&$.push("type");let b=r>1,w=r>2,k=T=>{let E=We(e[0].dataType),C=[q("x",e[0].dataType,e[0].dims,f),q("scale",a.dataType,a.dims,f)];s&&C.push(q("bias",s.dataType,s.dims,f)),C.push(ue("output",e[0].dataType,o,f)),b&&C.push(ue("mean_data_output",1,g)),w&&C.push(ue("inv_std_output",1,g));let x=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${T.registerUniforms(x).declareVariables(...C)}
  ${T.mainStart()}
    ${T.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${Jn("f32",f)};
    var mean_square_vector = ${Jn("f32",f)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${er(E,f,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${It("mean_vector",f)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${It("mean_square_vector",f)} / uniforms.norm_size ${i?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${er(E,f,"x[j + offset]")};
      let f32scale = ${er(E,f,"scale[j]")};
      output[j + offset] = ${C[0].type.value}((f32input ${i?"":"- mean"}) * inv_std_dev * f32scale
        ${s?`+ ${er(E,f,"bias[j]")}`:""}
      );
    }

    ${b?"mean_data_output[global_idx] = mean":""};
    ${w?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},S=[{dims:o,dataType:e[0].dataType}];return b&&S.push({dims:g,dataType:1}),w&&S.push({dims:g,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${f};${r};${i}`,inputDependencies:$},getRunData:()=>({outputs:S,dispatchGroup:{x:Math.ceil(d/64)},programUniforms:v}),getShaderSource:k}},If=(e,t)=>{_d(e.inputs),e.compute(bd(e.inputs,t,e.outputCount))}}),$d,Cf,Ny=J(()=>{"use strict";ge(),Ra(),Da(),$d=e=>{if(!e||e.length!==2)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.")},Cf=e=>{$d(e.inputs);let t=ar.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw new Error("Can't use matmul on the given tensors");let r=t[t.length-1],i=e.inputs[0].dims[e.inputs[0].dims.length-1];if(r<8&&i<8)e.compute(Ba(e.inputs,{activation:""},t));else{let n=t[t.length-2],a=P.size(e.inputs[0].dims.slice(0,-2)),s=P.size(e.inputs[1].dims.slice(0,-2));if(a!==1&&n===1&&s===1){let o=e.inputs[0].reshape([1,a,i]),u=e.inputs[1].reshape([1,i,r]),d=[1,a,r],c=[o,u];e.compute(pi(c,{activation:""},t,d),{inputs:c})}else e.compute(pi(e.inputs,{activation:""},t))}}}),vd,xd,kd,Ef,zf,Uy=J(()=>{"use strict";fe(),ge(),Re(),ye(),vd=(e,t)=>{if(e.length<3||e.length>4)throw new Error("MatMulNBits requires 3 or 4 inputs");let r=e[0],i=r.dims.length;if(r.dims[i-1]!==t.k)throw new Error("The last dim of input shape does not match the k value");let n=Math.floor((t.k+t.blockSize-1)/t.blockSize),a=t.blockSize/8*t.bits,s=e[1];if(!P.areEqual(s.dims,[t.n,n,a]))throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let o=e[2].dims;if(P.size(o)!==t.n*n)throw new Error("scales input size error.");if(e.length===4){let u=e[3].dims,d=t.n*(t.bits===8?n:Math.floor((n*t.bits+7)/8));if(P.size(u)!==d)throw new Error("zeroPoints input size error.")}},xd=(e,t)=>{let r=e[0].dims,i=r.length,n=r[i-2],a=t.k,s=t.n,o=r.slice(0,i-2),u=P.size(o),d=e[1].dims[2]/4,c=e[0].dataType,h=Be(t.k),m=Be(d),g=Be(s),f=o.concat([n,s]),$=n>1&&s/g%2===0?2:1,v=P.size(f)/g/$,b=64,w=[],k=[u,n,a/h],S=P.convertShape(e[1].dims).slice();S.splice(-1,1,d/m),w.push(...ce(k)),w.push(...ce(S)),w.push(...ce(e[2].dims)),e.length===4&&w.push(...ce(P.convertShape(e[3].dims)));let T=[u,n,s/g];w.push(...ce(T));let E=C=>{let x=k.length,M=q("a",e[0].dataType,x,h),U=q("b",12,S.length,m),O=q("scales",e[2].dataType,e[2].dims.length),D=[M,U,O],V=e.length===4?q("zero_points",12,e[3].dims.length):void 0;V&&D.push(V);let A=T.length,G=ue("output",e[0].dataType,A,g),F=We(e[0].dataType),L=(()=>{switch(h){case 1:return`array<${F}, 8>`;case 2:return`mat4x2<${F}>`;case 4:return`mat2x4<${F}>`;default:throw new Error(`${h}-component is not supported.`)}})(),re=Math.floor(32/t.bits),ae=Math.floor(re/8),Y=()=>{let K="";for(let ee=0;ee<ae;ee++){let me=ee*t.bits*4,xe=me+t.bits;K+=`
          // reuse a data (pass ${ee})
            var input_offset${ee>0?ee:""} = ${ee===0?M.indicesToOffset(`${M.type.indices}(batch, row, word_offset)`):"input_offset"};
            var a_data${ee>0?ee:""}: ${L};
            for (var j${ee>0?ee:""}: u32 = 0; j${ee>0?ee:""} < ${8/h}; j${ee>0?ee:""}++) {
              a_data${ee>0?ee:""}[j${ee>0?ee:""}] = ${M.getByOffset(`input_offset${ee>0?ee:""}`)};
              input_offset${ee>0?ee:""}++;
            }
          `;for(let Z=0;Z<g*$;Z++)K+=`
            b_value = ${m===1?`b${Z}_data`:`b${Z}_data[i]`};
            ${t.bits===2?`{
              let half_word = b_value >> ${ee*16}u;
              let byte_lo = half_word & 0xFFu;
              let byte_hi = (half_word >> 8u) & 0xFFu;
              let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
              b_value_lower = unpack4xU8(spread_word & b_mask);
              b_value_upper = unpack4xU8((spread_word >> 2u) & b_mask);
            }`:`b_value_lower = unpack4xU8((b_value >> ${me}u) & b_mask);
            b_value_upper = unpack4xU8((b_value >> ${xe}u) & b_mask);`}
            b_quantized_values = ${L}(${Array.from({length:4},(te,ne)=>`${F}(b_value_lower[${ne}]), ${F}(b_value_upper[${ne}])`).join(", ")});
            b_dequantized_values = ${h===1?`${L}(${Array.from({length:8},(te,ne)=>`(b_quantized_values[${ne}] - ${V?`zero_point${Z}`:"zero_point"}) * scale${Z}`).join(", ")});`:`(b_quantized_values - ${L}(${Array(8).fill(`${V?`zero_point${Z}`:"zero_point"}`).join(",")})) * scale${Z};`};
            workgroup_shared[local_id.x * ${$} + ${Math.floor(Z/g)}]${g>1?`[${Z%g}]`:""} += ${Array.from({length:8/h},(te,ne)=>`${h===1?`a_data${ee>0?ee:""}[${ne}] * b_dequantized_values[${ne}]`:`dot(a_data${ee>0?ee:""}[${ne}], b_dequantized_values[${ne}])`}`).join(" + ")};
          `}return K},N=()=>{let K=`
            var col_index = col * ${g};
            ${V?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (nBlocksPerCol + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is ${Math.pow(2,t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${F}(${Math.pow(2,t.bits-1).toFixed(1)});`}
            `;for(let ee=0;ee<g*$;ee++)K+=`
            let scale${ee} = ${O.getByOffset("col_index * nBlocksPerCol + block")};
            ${V?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            zero_point_word = ${V.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${ee} = ${F}((zero_point_word) & ${t.bits===2?"0x3u":"0xFu"});`:""}
            col_index += 1;`;return K},Q=()=>{let K=`col_index = col * ${g};`;for(let ee=0;ee<g*$;ee++)K+=`
            let b${ee}_data = ${U.getByIndices(`${U.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return K+=`
            var b_value: u32;
            let b_mask: u32 = ${t.bits===2?"0x03030303u":"0x0F0F0F0Fu"};
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${L};
            var b_dequantized_values: ${L};`,K};return`
        var<workgroup> workgroup_shared: array<${G.type.value}, ${$*b}>;
        ${C.declareVariables(...D,G)}
        ${C.mainStart([b,1,1])}
          let output_indices = ${G.offsetToIndices(`(global_idx / ${b}) * ${$}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${b}) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize/h};
            ${N()}
            for (var word: u32 = 0; word < ${d}; word += ${m}) {
              ${Q()}
              for (var i: u32 = 0; i < ${m}; i++) {
                ${Y()}
                word_offset += ${re/h};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${$}) {
            var output_value: ${G.type.value} = ${G.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${b}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${$};
            }
            ${G.setByIndices(`${G.type.indices}(batch, row, col + local_id.x)`,"output_value")};
          }
        }`};return{name:"MatMulNBits",shaderCache:{hint:`${t.blockSize};${t.bits};${h};${m};${g};${$};${b}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:f,dataType:c}],dispatchGroup:{x:v},programUniforms:w}),getShaderSource:E}},kd=(e,t)=>{let r=e[0].dims,i=r.length,n=r[i-2],a=t.k,s=t.n,o=r.slice(0,i-2),u=P.size(o),d=e[1].dims[2]/4,c=e[0].dataType,h=Be(t.k),m=Be(d),g=o.concat([n,s]),f=128,$=s%8===0?8:s%4===0?4:1,v=f/$,b=Math.floor(32/t.bits),w=v*m*b,k=w/h,S=w/t.blockSize,T=P.size(g)/$,E=[],C=[u,n,a/h],x=P.convertShape(e[1].dims).slice();x.splice(-1,1,d/m),E.push(...ce(C)),E.push(...ce(x)),E.push(...ce(e[2].dims)),e.length===4&&E.push(...ce(P.convertShape(e[3].dims)));let M=[u,n,s];E.push(...ce(M));let U=O=>{let D=C.length,V=q("a",e[0].dataType,D,h),A=q("b",12,x.length,m),G=q("scales",e[2].dataType,e[2].dims.length),F=[V,A,G],L=e.length===4?q("zero_points",12,e[3].dims.length):void 0;L&&F.push(L);let re=M.length,ae=ue("output",e[0].dataType,re),Y=We(e[0].dataType),N=()=>{switch(h){case 1:return`
          let a_data0 = vec4<${Y}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${Y}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${Y}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${Y}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw new Error(`${h}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${V.type.value}, ${k}>;
        var<workgroup> inter_results: array<array<${ae.type.value}, ${v}>, ${$}>;
        ${O.declareVariables(...F,ae)}
        ${O.mainStart([v,$,1])}
          let output_indices = ${ae.offsetToIndices(`workgroup_index * ${$}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${S} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${k};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${k}; a_offset += ${f})
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${V.getByIndices(`${V.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${V.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${S} + local_id.x;
            ${L?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (n_blocks_per_col + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            let zero_point_word = ${L.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${Y}((zero_point_word) & ${t.bits===2?"0x3u":"0xFu"});`:`
            // The default zero point is ${Math.pow(2,t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${Y}(${Math.pow(2,t.bits-1).toFixed(1)});`}
            let scale = ${G.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${A.getByIndices(`${A.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize/h};
            for (var i: u32 = 0; i < ${m}; i++) {
              let b_value = ${m===1?"b_data":"b_data[i]"};
              ${(()=>{let Q=Math.floor(b/8),K="";for(let ee=0;ee<Q;ee++){let me=ee*t.bits*4,xe=me+t.bits;K+=`
              ${N()}
              {${t.bits===2?`
                let half_word = b_value >> ${ee*16}u;
                let byte_lo = half_word & 0xFFu;
                let byte_hi = (half_word >> 8u) & 0xFFu;
                let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
                let b_value_lower = unpack4xU8(spread_word & 0x03030303u);
                let b_value_upper = unpack4xU8((spread_word >> 2u) & 0x03030303u);`:`
                let b_value_lower = unpack4xU8((b_value >> ${me}u) & 0x0F0F0F0Fu);
                let b_value_upper = unpack4xU8((b_value >> ${xe}u) & 0x0F0F0F0Fu);`}
                let b_quantized_values = mat2x4<${Y}>(${Array.from({length:4},(Z,te)=>`${Y}(b_value_lower[${te}]), ${Y}(b_value_upper[${te}])`).join(", ")});
                let b_dequantized_values = (b_quantized_values - mat2x4<${Y}>(${Array(8).fill("zero_point").join(",")})) * scale;
                inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(Z,te)=>`${`dot(a_data${te}, b_dequantized_values[${te}])`}`).join(" + ")};
              }
              word_offset += ${8/h};`}return K})()}
            }
            workgroupBarrier();
          }

          if (local_idx < ${$}) {
            var output_value: ${ae.type.value} = ${ae.type.value}(0);
            for (var b = 0u; b < ${v}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${ae.setByIndices(`${ae.type.indices}(batch, row, col + local_idx)`,"output_value")}
            }
          }
        }`};return{name:"BlockwiseMatMulNBits32",shaderCache:{hint:`${t.blockSize};${h};${m};${v};${$}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:g,dataType:c}],dispatchGroup:{x:T},programUniforms:E}),getShaderSource:U}},Ef=(e,t)=>{vd(e.inputs,t),t.blockSize===32&&e.adapterInfo.isVendor("intel")&&e.adapterInfo.isArchitecture("gen-12lp")?e.compute(kd(e.inputs,t)):e.compute(xd(e.inputs,t))},zf=e=>Ce(e)}),Sd,Td,Id,Cd,Ed,zd,Ad,Md,Af,Py=J(()=>{"use strict";fe(),ge(),ye(),Sd=e=>{if(!e||e.length<1)throw new Error("Too few inputs");if(e[0].dataType!==1&&e[0].dataType!==10)throw new Error("Input type must be float or float16.");if(e.length>=2){let t=e[0].dims.length*2===e[1].dims[0];if(e.length===4&&(t=e[3].dims[0]*2===e[1].dims[0]),!t)throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},Td=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
            k = i32(${e.indicesGet("indices",n)}) - ${de("uniforms.pads",n,r)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${de("uniforms.x_shape",n,t)})) {
              break;
            }
            offset += k * i32(${de("uniforms.x_strides",n,t)});
        `;return`
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${i}
            value = x[offset];
          }
      `},Id=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
                k = i32(${e.indicesGet("indices",n)}) - ${de("uniforms.pads",n,r)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${de("uniforms.x_shape",n,t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${de("uniforms.x_shape",n,t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${de("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},Cd=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
                k = i32(${e.indicesGet("indices",n)}) - ${de("uniforms.pads",n,r)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${de("uniforms.x_shape",n,t)})) {
                  k = i32(${de("uniforms.x_shape",n,t)}) - 1;
                }
                offset += k * i32(${de("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},Ed=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
                k = i32(${e.indicesGet("indices",n)}) - ${de("uniforms.pads",n,r)};
                if (k < 0)  {
                  k += i32(${de("uniforms.x_shape",n,t)}]);
                }
                if (k >= i32(${de("uniforms.x_shape",n,t)})) {
                  k -= i32(${de("uniforms.x_shape",n,t)});
                }
                offset += k * i32(${de("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},zd=(e,t,r)=>{switch(r.mode){case 0:return Td(e,t,r.pads.length);case 1:return Id(e,t,r.pads.length);case 2:return Cd(e,t,r.pads.length);case 3:return Ed(e,t,r.pads.length);default:throw new Error("Invalid mode")}},Ad=(e,t)=>{let r=P.padShape(e[0].dims.slice(),t.pads),i=e[0].dims,n=P.size(r),a=[{type:12,data:n},{type:6,data:t.pads}],s=e.length>=3&&e[2].data;t.mode===0&&a.push({type:s?e[2].dataType:1,data:t.value}),a.push(...ce(e[0].dims,r));let o=["rank"],u=d=>{let c=ue("output",e[0].dataType,r.length),h=q("x",e[0].dataType,i.length),m=h.type.value,g=zd(c,i.length,t),f=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:t.pads.length}];return t.mode===0&&f.push({name:"constant_value",type:s?m:"f32"}),`
            ${d.registerUniforms(f).declareVariables(h,c)}
            ${d.mainStart()}
            ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${c.offsetToIndices("global_idx")};

            var value = ${m}(0);
            ${g}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${t.mode}${s}`,inputDependencies:o},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(P.size(r)/64)},programUniforms:a}),getShaderSource:u}},Md=(e,t)=>{if(e.length>1){let r=e[1].getBigInt64Array(),i=e.length>=3&&e[2].data?e[2].dataType===10?e[2].getUint16Array()[0]:e[2].getFloat32Array()[0]:0,n=e[0].dims.length,a=new Int32Array(2*n).fill(0);if(e.length>=4){let o=e[3].getBigInt64Array();for(let u=0;u<o.length;u++)a[Number(o[u])]=Number(r[u]),a[Number(o[u])+n]=Number(r[u+o.length])}else r.forEach((o,u)=>a[Number(u)]=Number(o));let s=[];return a.forEach(o=>s.push(o)),{mode:t.mode,value:i,pads:s}}else return t},Af=(e,t)=>{Sd(e.inputs);let r=Md(e.inputs,t);e.compute(Ad(e.inputs,r),{inputs:[0]})}}),yr,Cn,En,zn,An,Od,Bd,Mn,On,Mf,Of,Bn,Bf,Rf,Rn,Df,Nf,Uf,Pf,Ly=J(()=>{"use strict";Ye(),fe(),ge(),ye(),yr=e=>{if(Ee.webgpu.validateInputContent&&(!e||e.length!==1))throw new Error("Pool ops requires 1 input.")},Cn=(e,t,r)=>{let i=t.format==="NHWC",n=e.dims.slice();i&&n.splice(1,0,n.pop());let a=Object.hasOwnProperty.call(t,"dilations"),s=t.kernelShape.slice(),o=t.strides.slice(),u=a?t.dilations.slice():[],d=t.pads.slice();di.adjustPoolAttributes(r,n,s,o,u,d);let c=di.computePoolOutputShape(r,n,o,u,s,d,t.autoPad,t.ceilMode),h=Object.assign({},t);a?Object.assign(h,{kernelShape:s,strides:o,pads:d,dilations:u,cacheKey:t.cacheKey}):Object.assign(h,{kernelShape:s,strides:o,pads:d,cacheKey:t.cacheKey});let m=c.slice();return m.push(m.splice(1,1)[0]),[h,i?m:c]},En=(e,t)=>{let r=t.format==="NHWC",i=P.size(e),n=P.size(t.kernelShape),a=[{type:12,data:i},{type:12,data:n}],s=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(t.kernelShape.length<=2){let o=t.kernelShape[t.kernelShape.length-1],u=t.strides[t.strides.length-1],d=t.pads[t.pads.length/2-1],c=t.pads[t.pads.length-1],h=!!(d+c);a.push({type:12,data:o},{type:12,data:u},{type:12,data:d},{type:12,data:c}),s.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let m=!1;if(t.kernelShape.length===2){let g=t.kernelShape[t.kernelShape.length-2],f=t.strides[t.strides.length-2],$=t.pads[t.pads.length/2-2],v=t.pads[t.pads.length-2];m=!!($+v),a.push({type:12,data:g},{type:12,data:f},{type:12,data:$},{type:12,data:v}),s.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[a,s,!0,h,m]}else{if(r)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let o=P.computeStrides(t.kernelShape);a.push({type:12,data:o},{type:12,data:t.pads},{type:12,data:t.strides}),s.push({name:"kernelStrides",type:"u32",length:o.length},{name:"pads",type:"u32",length:t.pads.length},{name:"strides",type:"u32",length:t.strides.length});let u=t.pads.reduce((d,c)=>d+c);return[a,s,!!u,!1,!1]}},zn=(e,t,r,i,n,a,s,o,u,d,c,h)=>{let m=n.format==="NHWC",g=t.type.value,f=ue("output",t.type.tensor,i);if(n.kernelShape.length<=2){let $="",v="",b="",w=r-(m?2:1);if(c?$=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${w}] = indices[${w}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${w}] < 0 || xIndices[${w}]
                      >= uniforms.x_shape[${w}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${a}
                }`:$=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${w}] = indices[${w}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${a}
                }`,n.kernelShape.length===2){let k=r-(m?3:2);h?v=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${k}] = indices[${k}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${k}] < 0 || xIndices[${k}] >= uniforms.x_shape[${k}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:v=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${k}] = indices[${k}] * uniforms.sh - uniforms.phStart + j;
                `,b=`
              }
            `}return`
            ${e.registerUniforms(u).declareVariables(t,f)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${f.offsetToIndices("global_idx")};
              var xIndices = ${f.offsetToIndices("global_idx")};

              var value = ${g}(${o});
              var pad = 0;
              ${v}
              ${$}
              ${b}
              ${s}

              output[global_idx] = value;
            }`}else{if(m)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let $=n.kernelShape.length,v=n.pads.length,b="";return d?b=`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${t.indicesToOffset("xIndices")}];
                ${a}
              }`:b=`
              }
              let x_val = x[${t.indicesToOffset("xIndices")}];
              ${a}
            `,`
            ${e.registerUniforms(u).declareVariables(t,f)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${f.offsetToIndices("global_idx")};
              var xIndices = ${f.offsetToIndices("global_idx")};

              var offsets: array<u32, ${$}>;

              var value = ${g}(${o});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${$-1}u; j++) {
                  offsets[j] = offset / ${de("uniforms.kernelStrides","j",$)};
                  offset -= offsets[j] * ${de("uniforms.kernelStrides","j",$)};
                }
                offsets[${$-1}] = offset;

                isPad = false;
                for (var j = ${r-$}u; j < ${r}u; j++) {
                  xIndices[j] = indices[j] * ${de("uniforms.strides",`j - ${r-$}u`,$)}
                    + offsets[j - ${r-$}u] - ${de("uniforms.pads","j - 2u",v)};
                  ${b}
              }
              ${s}

              output[global_idx] = value;
            }`}},An=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,Od=e=>`${An(e)};${e.countIncludePad}`,Bd=e=>`${An(e)};${e.storageOrder};${e.dilations}`,Mn=e=>({format:e.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),On=(e,t,r,i)=>{let[n,a]=Cn(t,i,r),s=q("x",t.dataType,t.dims.length),o=s.type.value,u="value += x_val;",d="";n.countIncludePad?d+=`value /= ${o}(uniforms.kernelSize);`:d+=`value /= ${o}(i32(uniforms.kernelSize) - pad);`;let[c,h,m,g,f]=En(a,n);c.push(...ce(t.dims,a));let $=["rank"];return{name:e,shaderCache:{hint:`${i.cacheKey};${m};${g};${f}`,inputDependencies:$},getRunData:()=>({outputs:[{dims:a,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(P.size(a)/64)},programUniforms:c}),getShaderSource:v=>zn(v,s,t.dims.length,a.length,n,u,d,0,h,m,g,f)}},Mf=e=>{let t=e.count_include_pad!==0,r=Mn(e);if(r.ceilMode!==0)throw new Error("ceil_mode output-shape is computed, but ceil_mode kernel execution (padding/divisor) is not yet implemented in the WebGPU AveragePool kernel");let i={countIncludePad:t,...r,cacheKey:""};return{...i,cacheKey:Od(i)}},Of=(e,t)=>{yr(e.inputs),e.compute(On("AveragePool",e.inputs[0],!1,t))},Bn={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},Bf=e=>{let t=e.format;return{format:t,...Bn,cacheKey:t}},Rf=(e,t)=>{yr(e.inputs),e.compute(On("GlobalAveragePool",e.inputs[0],!0,t))},Rn=(e,t,r,i)=>{let[n,a]=Cn(t,i,r),s=`
      value = max(x_val, value);
    `,o="",u=q("x",t.dataType,t.dims.length),d=["rank"],[c,h,m,g,f]=En(a,n);return c.push(...ce(t.dims,a)),{name:e,shaderCache:{hint:`${i.cacheKey};${m};${g};${f}`,inputDependencies:d},getRunData:()=>({outputs:[{dims:a,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(P.size(a)/64)},programUniforms:c}),getShaderSource:$=>zn($,u,t.dims.length,a.length,n,s,o,t.dataType===10?-65504:-1e5,h,m,g,f)}},Df=(e,t)=>{yr(e.inputs),e.compute(Rn("MaxPool",e.inputs[0],!1,t))},Nf=e=>{let t=e.storage_order,r=e.dilations,i=Mn(e);if(t!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(i.ceilMode!==0)throw new Error("ceil_mode output-shape is computed, but ceil_mode kernel execution (padding) is not yet implemented in the WebGPU MaxPool kernel");let n={storageOrder:t,dilations:r,...i,cacheKey:""};return{...n,cacheKey:Bd(n)}},Uf=e=>{let t=e.format;return{format:t,...Bn,cacheKey:t}},Pf=(e,t)=>{yr(e.inputs),e.compute(Rn("GlobalMaxPool",e.inputs[0],!0,t))}}),Rd,Dd,Lf,Wf,Wy=J(()=>{"use strict";fe(),ge(),Re(),ye(),Rd=(e,t)=>{if(e.length<2||e.length>3)throw new Error("DequantizeLinear requires 2 or 3 inputs.");if(e.length===3&&e[1].dims===e[2].dims)throw new Error("x-scale and x-zero-point must have the same shape.");if(e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==0&&e[1].dims.length!==1&&e[1].dims.length!==e[0].dims.length)throw new Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");if(e.length>2){if(e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==e[2].dims.length)throw new Error("scale and zero-point inputs must have the same rank.");if(!e[1].dims.map((r,i)=>r===e[2].dims[i]).reduce((r,i)=>r&&i,!0))throw new Error("scale and zero-point inputs must have the same shape.")}if(t.blockSize>0){if(e[1].dims.length===0||e[1].dims.length===1&&e[1].dims[0]===1)throw new Error("blockSize must be set only for block quantization.");if(!e[1].dims.map((n,a)=>a===t.axis||n===e[0].dims[a]).reduce((n,a)=>n&&a,!0))throw new Error("For block qunatization, scale input shape to match the input shape except for the axis");if(e[1].dims.length!==e[0].dims.length)throw new Error("For block qunatization the scale input rank must be the same as the x rank.");let r=e[0].dims[t.axis],i=e[1].dims[t.axis];if(t.blockSize<Math.ceil(r/i)||t.blockSize>Math.ceil(r/(i-1)-1))throw new Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].")}},Dd=(e,t)=>{let r=P.normalizeAxis(t.axis,e[0].dims.length),i=e[0].dataType,n=i===3,a=e[0].dims,s=e[1].dataType,o=P.size(a),u=i===3||i===2,d=u?[Math.ceil(P.size(e[0].dims)/4)]:e[0].dims,c=e[1].dims,h=e.length>2?e[2]:void 0,m=h?u?[Math.ceil(P.size(h.dims)/4)]:h.dims:void 0,g=c.length===0||c.length===1&&c[0]===1,f=g===!1&&c.length===1,$=Be(o),v=g&&(!u||$===4),b=v?$:1,w=v&&!u?$:1,k=q("input",u?12:i,d.length,w),S=q("scale",s,c.length),T=h?q("zero_point",u?12:i,m.length):void 0,E=ue("output",s,a.length,b),C=[k,S];T&&C.push(T);let x=[d,c];h&&x.push(m);let M=[{type:12,data:o/b},{type:12,data:r},{type:12,data:t.blockSize},...ce(...x,a)],U=O=>{let D=[{name:"output_size",type:"u32"},{name:"axis",type:"u32"},{name:"block_size",type:"u32"}];return`
      ${O.registerUniforms(D).declareVariables(...C,E)}
      ${O.mainStart()}
          ${O.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${E.offsetToIndices("global_idx")};

          // Set input x
          ${u?`
            let input = ${k.getByOffset("global_idx / 4")};
            let x_vec = ${n?"unpack4xI8(input)":"unpack4xU8(input)"};
            let x_value = ${b===1?"x_vec[global_idx % 4]":"x_vec"};`:`let x_value = ${k.getByOffset("global_idx")};`};

          // Set scale input
          ${g?`let scale_value= ${S.getByOffset("0")}`:f?`
            let scale_index = ${E.indicesGet("output_indices","uniforms.axis")};
            let scale_value= ${S.getByOffset("scale_index")};`:`
            var scale_indices: ${S.type.indices} = output_indices;
            let index = ${S.indicesGet("scale_indices","uniforms.axis")} / uniforms.block_size;
            ${S.indicesSet("scale_indices","uniforms.axis","index")};
            let scale_value= ${S.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${T?g?u?`
                let zero_point_input = ${T.getByOffset("0")};
                let zero_point_vec =  ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${T.getByOffset("0")}`:f?u?`
                let zero_point_index = ${E.indicesGet("output_indices","uniforms.axis")};
                let zero_point_input = ${T.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${E.indicesGet("output_indices","uniforms.axis")};
                let zero_point_value = ${T.getByOffset("zero_point_index")};`:u?`
                let zero_point_offset = ${S.indicesToOffset("scale_indices")};
                let zero_point_input = ${T.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${T.getByIndices("scale_indices")};`:`let zero_point_value = ${u?n?"i32":"u32":k.type.value}(0);`};
      // Compute and write output
      ${E.setByOffset("global_idx",`${E.type.value}(x_value - zero_point_value) * scale_value`)};
      }`};return{name:"DequantizeLinear",shaderCache:{hint:t.cacheKey,inputDependencies:T?["rank","rank","rank"]:["rank","rank"]},getShaderSource:U,getRunData:()=>({outputs:[{dims:a,dataType:s}],dispatchGroup:{x:Math.ceil(o/b/64),y:1,z:1},programUniforms:M})}},Lf=(e,t)=>{Rd(e.inputs,t),e.compute(Dd(e.inputs,t))},Wf=e=>Ce({axis:e.axis,blockSize:e.blockSize})}),Nd,Ud,qf,qy=J(()=>{"use strict";Ye(),fe(),ye(),Nd=(e,t,r)=>{let i=e===t,n=e<t&&r<0,a=e>t&&r>0;if(i||n||a)throw new Error("Range these inputs' contents are invalid.")},Ud=(e,t,r,i)=>{let n=Math.abs(Math.ceil((t-e)/r)),a=[n],s=n,o=[{type:12,data:s},{type:i,data:e},{type:i,data:r},...ce(a)],u=d=>{let c=ue("output",i,a.length),h=c.type.value,m=[{name:"outputSize",type:"u32"},{name:"start",type:h},{name:"delta",type:h}];return`
        ${d.registerUniforms(m).declareVariables(c)}
        ${d.mainStart()}
        ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${h}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${i}`},getShaderSource:u,getRunData:()=>({outputs:[{dims:a,dataType:i}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:o})}},qf=e=>{let t=0,r=0,i=0;e.inputs[0].dataType===6?(t=e.inputs[0].getInt32Array()[0],r=e.inputs[1].getInt32Array()[0],i=e.inputs[2].getInt32Array()[0]):e.inputs[0].dataType===1&&(t=e.inputs[0].getFloat32Array()[0],r=e.inputs[1].getFloat32Array()[0],i=e.inputs[2].getFloat32Array()[0]),Ee.webgpu.validateInputContent&&Nd(t,r,i),e.compute(Ud(t,r,i,e.inputs[0].dataType),{inputs:[]})}}),Pd,Ld,Gf,Vf,Gy=J(()=>{"use strict";fe(),ge(),Re(),ye(),Pd=(e,t,r,i)=>{if(e!=="none"&&i!=="i32"&&i!=="u32"&&i!=="f32")throw new Error(`Input ${i} is not supported with reduction ${e}.`);let n=`{
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
                ${n}max(bitcast<f32>(oldValue), (${r}))${a}`;case"min":return i==="i32"||i==="u32"?`atomicMin(&${t}, bitcast<${i}>(${r}));`:`${n}min(bitcast<${i}>(oldValue), (${r}))${a}`;case"mul":return`${n}(bitcast<${i}>(oldValue) * (${r}))${a}`;default:throw new Error(`Reduction ${e} is not supported.`)}},Ld=(e,t)=>{let r=e[0].dims,i=e[1].dims,n=r,a=1,s=Math.ceil(P.sizeToDimension(i,i.length-1)/a),o=i[i.length-1],u=P.sizeFromDimension(r,o),d=[{type:12,data:s},{type:12,data:o},{type:12,data:u},...ce(e[1].dims,e[2].dims,n)],c=h=>{let m=q("indices",e[1].dataType,e[1].dims.length),g=q("updates",e[2].dataType,e[2].dims.length,a),f=t.reduction!=="none"&&t.reduction!==""?fp("output",e[0].dataType,n.length):ue("output",e[0].dataType,n.length,a);return`
      ${h.registerUniform("output_size","u32").registerUniform("last_index_dimension","u32").registerUniform("num_updates_elements","u32").declareVariables(m,g,f)}
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
    ${Pd(t.reduction,"output[data_offset + i]","value",f.type.value)}
  }

      }`};return{name:"ScatterND",shaderCache:{hint:`${t.cacheKey}_${t.reduction}`,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:d}),getShaderSource:c}},Gf=e=>Ce({reduction:e.reduction}),Vf=(e,t)=>{e.compute(Ld(e.inputs,t),{inputs:[e.inputs[1],e.inputs[2]],outputs:[]})}}),Wd,qd,Gd,Dn,Vd,Hd,Fd,jd,Kd,Zd,Yd,Qd,Nn,Xd,Jd,ec,tc,rc,Hf,Ff,Vy=J(()=>{"use strict";fe(),ge(),Re(),ye(),Wd=(e,t)=>{if(e.every(r=>r>0||(()=>{throw new Error("Resize requires scales input values to be positive")})),e.length>0){if(t.mode==="linear"){if(!(e.length===2||e.length===3||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1||e.length===5&&e[0]===1&&e[1]===1))throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(t.mode==="cubic"&&!(e.length===2||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1))throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},qd=(e,t,r)=>{t.every(n=>n>=0&&n<r||(()=>{throw new Error("Resize requires axes input values to be positive and less than rank")}));let i=new Array(r).fill(1);return t.forEach((n,a)=>i[n]=e[a]),i},Gd=(e,t,r,i,n,a)=>{let[s,o,u]=r>10?[1,2,3]:[-1,e.length>1?1:-1,-1],d=e[0].dims.length;if(s>0&&e.length>s&&e[s].dims.length>0)e[s].getFloat32Array().forEach(c=>a.push(c));else if(t.coordinateTransformMode==="tf_crop_and_resize")throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(o>0&&e.length>o&&e[o].dims.length===1&&e[o].dims[0]>0){if(e[o].getFloat32Array().forEach(c=>i.push(c)),i.length!==0&&i.length!==d&&r>=18&&i.length!==t.axes.length)throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");Wd(i,t),t.axes.length>0&&qd(i,t.axes,d).forEach((c,h)=>i[h]=c)}if(u>0&&e.length>u&&e[u].dims.length===1&&e[u].dims[0]>0&&(e[u].getBigInt64Array().forEach(c=>n.push(Number(c))),n.length!==0&&n.length!==d&&r>=18&&n.length!==t.axes.length))throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(t.axes.length>0){if(i.length!==0&&i.length!==t.axes.length)throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(n.length!==0&&n.length!==t.axes.length)throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if(typeof i<"u"&&typeof n<"u"&&i.length>0&&n.length>d)throw new Error("Resize requires only of scales or sizes to be specified")},Dn=(e,t,r,i)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${e}) * (${t});
  let whole = ${i}(big / (${r}));
  let fract = ${i}(big % (${r})) / ${i}(${r});
  return whole + fract;
`,Vd=(e,t)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${t} { `+(()=>{switch(e){case"asymmetric":return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${t}(xResized) / ${t}(xScale);
          } else {
            ${Dn("xResized","lengthOriginal","lengthResized",t)}
          }
        `;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${t}(xResized) + 0.5) / ${t}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${Dn("xResized","lengthOriginal - 1","lengthResized - 1",t)}
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
                  return offset + ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;case"half_pixel":return`return ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;default:throw new Error(`Coordinate transform mode ${e} is not supported`)}})()+"}",Hd=(e,t,r)=>`fn getNearestPixelFromOriginal(xOriginal: ${r}, isDownSample: bool) -> ${r} {`+(()=>{switch(e){case"round_prefer_ceil":return"if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";case"floor":return"return floor(xOriginal);";case"ceil":return"return ceil(xOriginal);";case"round_prefer_floor":return"if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";default:if(t<11)return"if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";throw new Error(`Nearest mode ${e} is not supported`)}})()+"}",Fd=(e,t,r)=>{let i=new Array(r).fill(0).concat(new Array(r).fill(1)),n=e.length===0?i:e.slice();return t.length>0?(t.forEach((a,s)=>{i[a]=n[s],i[s+r]=n[t.length+s]}),i):n},jd=(e,t,r,i)=>{let n=[];if(r.length>0)if(i.length>0){if(e.forEach(a=>n.push(a)),Math.max(...i)>e.length)throw new Error("axes is out of bound");i.forEach((a,s)=>n[a]=r[s])}else r.forEach(a=>n.push(a));else{if(t.length===0)throw new Error("Resize requires either scales or sizes.");n=e.map((a,s)=>Math.round(a*t[s]))}return n},Kd=(e,t,r)=>{let i=(()=>{switch(r.keepAspectRatioPolicy){case"not_larger":return r.axes.length>0?Math.min(...r.axes.map(a=>t[a]),Number.MAX_VALUE):Math.min(...t,Number.MAX_VALUE);case"not_smaller":return r.axes.length>0?Math.max(...r.axes.map(a=>t[a]),Number.MIN_VALUE):Math.max(...t,Number.MIN_VALUE);default:throw new Error(`Keep aspect ratio policy ${r.keepAspectRatioPolicy} is not supported`)}})();t.fill(1,0,t.length);let n=e.slice();return r.axes.length>0?(r.axes.forEach(a=>t[a]=i),r.axes.forEach(a=>n[a]=Math.round(e[a]*t[a]))):(t.fill(i,0,t.length),n.forEach((a,s)=>n[s]=Math.round(a*t[s]))),n},Zd=(e,t,r,i,n)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> array<${e.type.value}, ${r.length}> {
      var original_indices: array<${e.type.value}, ${r.length}>;
      for (var i:u32 = 0; i < ${r.length}; i++) {
        var output_index = ${e.indicesGet("output_indices","i")};
        var scale = ${de("uniforms.scales","i",i)};
        var roi_low = ${de("uniforms.roi","i",n)};
        var roi_hi = ${de("uniforms.roi",`i + ${t.length}`,n)};
        if (scale == 1.0) {
          original_indices[i] = ${e.type.value}(output_index);
        } else {
          var input_shape_i = ${de("uniforms.input_shape","i",t.length)};
          var output_shape_i = ${de("uniforms.output_shape","i",r.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,Yd=(e,t,r,i,n,a,s)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
      var input_indices: ${e.type.indices};
      for (var i:u32 = 0; i < ${i.length}; i++) {
        var output_index = ${t.indicesGet("output_indices","i")};
        var input_index: u32;
        var scale = ${de("uniforms.scales","i",n)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${de("uniforms.roi","i",a)};
          var roi_hi = ${de("uniforms.roi",`i + ${r.length}`,a)};
          var input_shape_i = ${de("uniforms.input_shape","i",r.length)};
          var output_shape_i = ${de("uniforms.output_shape","i",i.length)};
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
    }`,Qd=(e,t)=>`
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${de("uniforms.input_shape","i",t.length)}) {
          return false;
        }
      }
      return true;
    }`,Nn=(e,t,r,i)=>e.rank>i?`
    ${e.indicesSet("input_indices",t,"channel")};
    ${e.indicesSet("input_indices",r,"batch")};
`:"",Xd=(e,t,r,i,n)=>{let[a,s,o,u]=r.length===2?[-1,0,1,-1]:[0,2,3,1],d=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${d} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(row, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",o,`max(0, min(col, ${r[o]} - 1))`)};
      ${Nn(e,u,a,2)}
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
      var channel: u32 = ${r.length>2?`u32(originalIndices[${u}])`:"0"};
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
    }`},Jd=(e,t,r,i,n,a,s,o,u,d)=>{let c=r.length===2,h=!0,[m,g]=c?[0,1]:h?[2,3]:[1,2],f=e.type.value,$=v=>{let b=v===m?"row":"col";return`
      fn ${b}CubicInterpolation(input_indices: ${e.type.indices}, output_indices: ${t.type.indices}) -> ${f} {
        var output_index = ${t.indicesGet("output_indices",v)};
        var originalIdx: ${f} = getOriginalCoordinateFromResizedCoordinate(output_index, ${n[v]},
        ${i[v]}, ${r[v]}, ${a[v]}, ${a[v]} + ${r.length});
        var fractOriginalIdx: ${f} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${o} && (originalIdx < 0 || originalIdx > (${r[v]} - 1))) {
          return ${u};
        }
        var data: array<${f}, 4> = array<${f}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${b}: ${f} = originalIdx + ${f}(i);
          if (${b} < 0 || ${b} >= ${r[v]}) {
            ${d?`coefs[i + 1] = 0.0;
                        continue;`:o?`return ${u};`:`${b} = max(0, min(${b}, ${r[v]} - 1));`};
          }
        var input_indices_copy: ${e.type.indices} = input_indices;
          ${e.indicesSet("input_indices_copy",v,`u32(${b})`)};
          data[i + 1] = ${v===m?e.getByIndices("input_indices_copy"):"rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${$(m)};
    ${$(g)};
  fn getCubicInterpolationCoefs(s: ${f}) -> array<${f}, 4> {
    var absS = abs(s);
    var coeffs: array<${f}, 4> = array<${f}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${f} = 1.0 - absS;
    var twoMinusAbsS: ${f} = 2.0 - absS;
    var onePlusAbsS: ${f} = 1.0 + absS;
    coeffs[0] = ((${s} * onePlusAbsS - 5 * ${s}) * onePlusAbsS + 8 * ${s}) * onePlusAbsS - 4 * ${s};
    coeffs[1] = ((${s} + 2) * absS - (${s} + 3)) * absS * absS + 1;
    coeffs[2] = ((${s} + 2) * oneMinusAbsS - (${s} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${s} * twoMinusAbsS - 5 * ${s}) * twoMinusAbsS + 8 * ${s}) * twoMinusAbsS - 4 * ${s};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${f}, 4>, coefs: array<${f}, 4>) -> ${f} {
    var coefsSum: ${f} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${t.type.indices}) -> ${f} {
    var input_indices: ${e.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `},ec=(e,t,r,i,n)=>{let[a,s,o,u,d]=r.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],c=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${c} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(depth, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",o,`max(0, min(height, ${r[o]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(width, ${r[u]} - 1))`)};
      ${Nn(e,d,a,3)}
      return ${e.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${t.type.indices}) -> ${c} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${c} = originalIndices[${s}];
      var height:${c} = originalIndices[${o}];
      var width:${c} = originalIndices[${u}];
      ${i?`if (depth < 0 || depth > (${r[s]} - 1) || height < 0 || height > (${r[o]} - 1) || width < 0 || (width > ${r[u]} - 1)) {
      return ${n};
        }`:""};

    depth = max(0, min(depth, ${r[s]} - 1));
      height = max(0, min(height, ${r[o]} - 1));
      width = max(0, min(width, ${r[u]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${r.length>3?`u32(originalIndices[${d}])`:"0"};
      var batch: u32 =  ${r.length>3?`u32(originalIndices[${a}])`:"0"};

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
    }`},tc=(e,t,r,i,n,a)=>{let s=e.dims,o=Fd(a,t.axes,s.length),u=jd(s,i,n,t.axes),d=i.slice();i.length===0&&(d=s.map((w,k)=>w===0?1:u[k]/w),t.keepAspectRatioPolicy!=="stretch"&&(u=Kd(s,d,t)));let c=ue("output",e.dataType,u.length),h=q("input",e.dataType,s.length),m=P.size(u),g=s.length===u.length&&s.every((w,k)=>w===u[k]),f=t.coordinateTransformMode==="tf_crop_and_resize",$=t.extrapolationValue,v=h.type.value,b=w=>`
      ${g?"":`
      ${Vd(t.coordinateTransformMode,v)};
      ${(()=>{switch(t.mode){case"nearest":return`
              ${Qd(h,s)};
              ${Hd(t.nearestMode,r,v)};
              ${Yd(h,c,s,u,d.length,o.length,f)};
              `;case"linear":return`
              ${Zd(c,s,u,d.length,o.length)};
              ${(()=>{if(s.length===2||s.length===4)return`${Xd(h,c,s,f,$)}`;if(s.length===3||s.length===5)return`${ec(h,c,s,f,$)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(s.length===2||s.length===4)return`${Jd(h,c,s,u,d,o,t.cubicCoeffA,f,t.extrapolationValue,t.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
            `;default:throw Error("Invalid resize mode")}})()};
      `}
      ${w.registerUniform("output_size","u32").registerUniform("scales","f32",d.length).registerUniform("roi","f32",o.length).declareVariables(h,c)}
      ${w.mainStart()}
        ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${g?"output[global_idx] = input[global_idx];":`
        let output_indices = ${c.offsetToIndices("global_idx")};
        var input_indices: ${h.type.indices};
        ${(()=>{switch(t.mode){case"nearest":return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${h.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${t.extrapolationValue};
                }`;case"linear":return`output[global_idx] = ${s.length===2||s.length===4?"bilinearInterpolation":"trilinearInterpolation"}(output_indices);`;case"cubic":return"output[global_idx] = bicubicInterpolation(output_indices);";default:throw Error(`Unsupported resize mode: ${t.mode}`)}})()};
`}
      }`;return{name:"Resize",shaderCache:{hint:`${t.cacheKey}|${r}|${d.length>0?t.mode==="cubic"?d:d.length:""}|${n.length>0?n:""}|${o.length>0?o:""}|${g}|${t.mode==="nearest"?s.length:s}`,inputDependencies:["rank"]},getShaderSource:b,getRunData:()=>({outputs:[{dims:u,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:[{type:12,data:m},{type:1,data:d},{type:1,data:o},...ce(s,u)]})}},rc=e=>{let t=e.customDataBuffer;return new Uint32Array(t.buffer,t.byteOffset,1)[0]},Hf=(e,t)=>{let r=[],i=[],n=[],a=rc(e);if(t.antialias!==0)throw Error("Only default value (0) for Antialias attribute is supported");Gd(e.inputs,t,a,r,i,n),e.compute(tc(e.inputs[0],t,a,r,i,n),{inputs:[0]})},Ff=e=>{let t=e.antialias,r=e.axes,i=e.coordinateTransformMode,n=e.cubicCoeffA,a=e.excludeOutside!==0,s=e.extrapolationValue,o=e.keepAspectRatioPolicy,u=e.mode,d=e.nearestMode===""?"simple":e.nearestMode;return Ce({antialias:t,axes:r,coordinateTransformMode:i,cubicCoeffA:n,excludeOutside:a,extrapolationValue:s,keepAspectRatioPolicy:o,mode:u,nearestMode:d})}}),ic,nc,jf,Hy=J(()=>{"use strict";fe(),ge(),ye(),ic=e=>{if(!e||e.length<3)throw new Error("layerNorm requires at least 3 inputs.");let t=e[0],r=e[1],i=e[2];if(t.dataType!==r.dataType||t.dataType!==i.dataType)throw new Error("All inputs must have the same data type");if(t.dims.length!==3&&t.dims.length!==2)throw new Error("Input must be 2D or 3D");if(r.dims.length!==3&&r.dims.length!==2)throw new Error("Skip must be 2D or 3D");let n=t.dims[t.dims.length-1],a=t.dims[t.dims.length-2];if(r.dims[r.dims.length-1]!==n)throw new Error("Skip must have the same hidden size as input");if(r.dims[r.dims.length-2]!==a)throw new Error("Skip must have the same sequence length as input");if(i.dims.length!==1)throw new Error("Gamma must be 1D");if(i.dims[i.dims.length-1]!==n)throw new Error("Gamma must have the same hidden size as input");if(e.length>3){let s=e[3];if(s.dims.length!==1)throw new Error("Beta must be 1D");if(s.dims[s.dims.length-1]!==n)throw new Error("Beta must have the same hidden size as input")}if(e.length>4){let s=e[4];if(s.dims.length!==1)throw new Error("Bias must be 1D");if(s.dims[s.dims.length-1]!==n)throw new Error("Bias must have the same hidden size as input")}},nc=(e,t,r,i)=>{let n=t.simplified,a=e[0].dims,s=P.size(a),o=a,u=s,d=a.slice(-1)[0],c=i?a.slice(0,-1).concat(1):[],h=!n&&e.length>3,m=e.length>4,g=i&&r>1,f=i&&r>2,$=r>3,v=64,b=Be(d),w=[{type:12,data:u},{type:12,data:b},{type:12,data:d},{type:1,data:t.epsilon}],k=T=>{let E=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],C=[q("x",e[0].dataType,e[0].dims,b),q("skip",e[1].dataType,e[1].dims,b),q("gamma",e[2].dataType,e[2].dims,b)];h&&C.push(q("beta",e[3].dataType,e[3].dims,b)),m&&C.push(q("bias",e[4].dataType,e[4].dims,b)),C.push(ue("output",e[0].dataType,o,b)),g&&C.push(ue("mean_output",1,c)),f&&C.push(ue("inv_std_output",1,c)),$&&C.push(ue("input_skip_bias_sum",e[0].dataType,o,b));let x=We(e[0].dataType),M=We(1,b);return`

      ${T.registerUniforms(E).declareVariables(...C)}
      var<workgroup> sum_shared : array<${M}, ${v}>;
      var<workgroup> sum_squared_shared : array<${M}, ${v}>;

      ${T.mainStart([v,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / ${v};

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / ${v};
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == ${v-1}) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${m?"bias[offset1d + i]":x+"(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${$?"input_skip_bias_sum[offset + i] = value;":""}
          output[offset + i] = value;
          let f32_value = ${er(x,b,"value")};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = ${v};
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
        let mean = ${It("sum",b)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${It("square_sum",b)} / f32(uniforms.hidden_size) ${n?"":"- mean * mean"} + uniforms.epsilon);
        ${g?"mean_output[global_idx] = mean;":""}
        ${f?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${n?"":`- ${x}(mean)`}) *
            ${x}(inv_std_dev) * gamma[offset1d + i]
            ${h?"+ beta[offset1d + i]":""};
        }
      }`},S=[{dims:o,dataType:e[0].dataType}];return r>1&&S.push({dims:c,dataType:1}),r>2&&S.push({dims:c,dataType:1}),r>3&&S.push({dims:a,dataType:e[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${b};${g};${f};${$}`,inputDependencies:e.map((T,E)=>"type")},getShaderSource:k,getRunData:()=>({outputs:S,dispatchGroup:{x:Math.ceil(u/d)},programUniforms:w})}},jf=(e,t)=>{ic(e.inputs);let r=[0];e.outputCount>1&&r.push(-3),e.outputCount>2&&r.push(-3),e.outputCount>3&&r.push(3),e.compute(nc(e.inputs,t,e.outputCount,!1),{outputs:r})}}),ac,wr,sc,Un,oc,uc,Kf,Zf,Fy=J(()=>{"use strict";fe(),ge(),Re(),ye(),ac=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");if(t.axes.length!==0){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw new Error("axes, starts and ends must have the same length")}else if(t.starts.length!==t.ends.length)throw new Error("starts and ends must have the same length");e.slice(1).forEach((r,i)=>{if(e[i+1].dataType!==6&&e[i+1].dataType!==7)throw new Error(`Input ${i} must be an array of int32 or int64`)})},wr=(e,t)=>{let r=[];if(e.length>t)if(e[t].dataType===7)e[t].getBigInt64Array().forEach(i=>r.push(Number(i)));else if(e[t].dataType===6)e[t].getInt32Array().forEach(i=>r.push(Number(i)));else throw new Error(`Input ${t} must be an array of int32 or int64`);return r},sc=(e,t)=>{if(e.length>1){let r=wr(e,1),i=wr(e,2),n=wr(e,3);return n.length===0&&(n=[...Array(e[0].dims.length).keys()]),Ce({starts:r,ends:i,axes:n})}else return t},Un=(e,t,r,i,n)=>{let a=e;return e<0&&(a+=r[i[t]]),n[t]<0?Math.max(0,Math.min(a,r[i[t]]-1)):Math.max(0,Math.min(a,r[i[t]]))},oc=(e,t,r)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
          var input_indices: ${e.type.indices};
          var carry = 0u;
          for (var i = ${r.length-1}; i >= 0; i--) {
            let input_shape_i = ${de("uniforms.input_shape","i",r.length)};
            let steps_i = ${de("uniforms.steps","i",r.length)};
            let signs_i = ${de("uniforms.signs","i",r.length)};
            let starts_i = ${de("uniforms.starts","i",r.length)};
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
      }`,uc=(e,t)=>{let r=e[0].dims,i=P.size(r),n=t.axes.length>0?P.normalizeAxes(t.axes,r.length):[...Array(r.length).keys()],a=wr(e,4);a.forEach(b=>b!==0||(()=>{throw new Error("step cannot be 0")})),a.length===0&&(a=Array(n.length).fill(1));let s=t.starts.map((b,w)=>Un(b,w,r,n,a)),o=t.ends.map((b,w)=>Un(b,w,r,n,a));if(n.length!==s.length||n.length!==o.length)throw new Error("start, ends and axes should have the same number of elements");if(n.length!==r.length)for(let b=0;b<r.length;++b)n.includes(b)||(s.splice(b,0,0),o.splice(b,0,r[b]),a.splice(b,0,1));let u=a.map(b=>Math.sign(b));a.forEach((b,w,k)=>{if(b<0){let S=(o[w]-s[w])/b,T=s[w],E=T+S*a[w];s[w]=E,o[w]=T,k[w]=-b}});let d=r.slice(0);n.forEach((b,w)=>{d[b]=Math.ceil((o[b]-s[b])/a[b])});let c={dims:d,dataType:e[0].dataType},h=ue("output",e[0].dataType,d.length),m=q("input",e[0].dataType,e[0].dims.length),g=P.size(d),f=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:s.length},{name:"signs",type:"i32",length:u.length},{name:"steps",type:"u32",length:a.length}],$=[{type:12,data:g},{type:12,data:s},{type:6,data:u},{type:12,data:a},...ce(e[0].dims,d)],v=b=>`
      ${b.registerUniforms(f).declareVariables(m,h)}
        ${oc(m,h,r)}
        ${b.mainStart()}
          ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${h.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${h.setByOffset("global_idx",m.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${u.length}_${s.length}_${a.length}`,inputDependencies:["rank"]},getShaderSource:v,getRunData:()=>({outputs:[c],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:$})}},Kf=(e,t)=>{ac(e.inputs,t);let r=sc(e.inputs,t);e.compute(uc(e.inputs,r),{inputs:[0]})},Zf=e=>{let t=e.starts,r=e.ends,i=e.axes;return Ce({starts:t,ends:r,axes:i})}}),lc,dc,Yf,Qf,jy=J(()=>{"use strict";fe(),ge(),Re(),Ct(),ye(),lc=e=>{if(!e||e.length!==1)throw new Error("Softmax op requires 1 input.")},dc=(e,t)=>{let r=e.inputs[0],i=r.dims,n=P.size(i),a=i.length,s=P.normalizeAxis(t.axis,a),o=s<i.length-1,u,d=[];o?(d=Array.from({length:a},(C,x)=>x),d[s]=a-1,d[a-1]=s,u=e.compute(Ze(r,d),{inputs:[r],outputs:[-1]})[0]):u=r;let c=u.dims,h=c[a-1],m=n/h,g=Be(h),f=h/g,$=64;m===1&&($=256);let v=(C,x)=>x===4?`max(max(${C}.x, ${C}.y), max(${C}.z, ${C}.w))`:x===2?`max(${C}.x, ${C}.y)`:x===3?`max(max(${C}.x, ${C}.y), ${C}.z)`:C,b=q("x",u.dataType,u.dims,g),w=ue("result",u.dataType,u.dims,g),k=b.type.value,S=We(u.dataType)==="f32"?`var threadMax = ${k}(-3.4028234663852886e+38f);`:`var threadMax = ${k}(-65504.0h);`,T=C=>`
      var<workgroup> rowMaxShared : ${k};
      var<workgroup> rowSumShared : ${k};
      var<workgroup> threadShared : array<${k}, ${$}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${k} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${k}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${C.registerUniform("packedCols","i32").declareVariables(b,w)}
      ${C.mainStart($)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${$};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${S}
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
          rowMaxShared = ${k}(${v("threadShared[0]",g)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${k}(0.0);
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
          rowSumShared = ${k}(${It("threadShared[0]",g)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          var value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          // max operation protects against NaN since all values should be >=0
          value = max(value, ${k}(0.0));
          setValue(row, col, row_stride, value);
        }
      }`,E=e.compute({name:"Softmax",shaderCache:{hint:`${g};${$}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:c,dataType:u.dataType}],dispatchGroup:{x:m},programUniforms:[{type:6,data:f}]}),getShaderSource:T},{inputs:[u],outputs:[o?-1:0]})[0];o&&e.compute(Ze(E,d),{inputs:[E]})},Yf=(e,t)=>{lc(e.inputs),dc(e,t)},Qf=e=>Ce({axis:e.axis})}),Pn,cc,pc,hc,Xf,Ky=J(()=>{"use strict";fe(),ge(),ye(),Pn=e=>Array.from(e.getBigInt64Array(),Number),cc=e=>{if(!e||e.length!==2)throw new Error("Tile requires 2 inputs.");if(e[0].dataType!==1&&e[0].dataType!==10&&e[0].dataType!==6&&e[0].dataType!==12)throw new Error("Tile only support float, float16, int32, and uint32 data types");if(e[1].dataType!==7)throw new Error("Tile `repeats` input should be of int64 data type");if(e[1].dims.length!==1)throw new Error("Tile `repeats` input should be 1-D");if(Pn(e[1]).length!==e[0].dims.length)throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},pc=(e,t)=>{let r=[];for(let i=0;i<e.length;++i)r.push(e[i]*t[i]);return r},hc=(e,t)=>{let r=e[0].dims,i=t??Pn(e[1]),n=pc(r,i),a=P.size(n),s=e[0].dataType,o=q("input",s,r.length),u=ue("output",s,n.length),d=c=>`
      const inputShape = ${o.indices(...r)};
      ${c.registerUniform("output_size","u32").declareVariables(o,u)}
      ${c.mainStart()}
      ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let output_indices = ${u.offsetToIndices("global_idx")};
      var input_indices: ${o.type.indices};
      for (var i = 0; i < ${r.length}; i++) {
        let input_dim_i = ${o.indicesGet("uniforms.input_shape","i")};
        let input_dim_value = ${u.indicesGet("output_indices","i")}  % input_dim_i;

        ${o.indicesSet("input_indices","i","input_dim_value")}
      }
      ${u.setByOffset("global_idx",o.getByIndices("input_indices"))}
    }`;return{name:"Tile",shaderCache:{hint:`${i}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:[{type:12,data:a},...ce(e[0].dims,n)]}),getShaderSource:d}},Xf=e=>{cc(e.inputs),e.compute(hc(e.inputs),{inputs:[0]})}}),fc,mc,Jf,Zy=J(()=>{"use strict";fe(),ge(),ye(),fc=(e,t,r,i,n)=>{let a=ue("output_data",n,r.length,4),s=q("a_data",t[1].dataType,t[1].dims.length,4),o=q("b_data",t[2].dataType,t[2].dims.length,4),u=q("c_data",t[0].dataType,t[0].dims.length,4),d,c=(h,m,g)=>`select(${m}, ${h}, ${g})`;if(!i)d=a.setByOffset("global_idx",c(s.getByOffset("global_idx"),o.getByOffset("global_idx"),u.getByOffset("global_idx")));else{let h=(m,g,f="")=>{let $=`a_data[index_a${g}][component_a${g}]`,v=`b_data[index_b${g}][component_b${g}]`,b=`bool(c_data[index_c${g}] & (0xffu << (component_c${g} * 8)))`;return`
            let output_indices${g} = ${a.offsetToIndices(`global_idx * 4u + ${g}u`)};
            let offset_a${g} = ${s.broadcastedIndicesToOffset(`output_indices${g}`,a)};
            let offset_b${g} = ${o.broadcastedIndicesToOffset(`output_indices${g}`,a)};
            let offset_c${g} = ${u.broadcastedIndicesToOffset(`output_indices${g}`,a)};
            let index_a${g} = offset_a${g} / 4u;
            let index_b${g} = offset_b${g} / 4u;
            let index_c${g} = offset_c${g} / 4u;
            let component_a${g} = offset_a${g} % 4u;
            let component_b${g} = offset_b${g} % 4u;
            let component_c${g} = offset_c${g} % 4u;
            ${m}[${g}] = ${f}(${c($,v,b)});
          `};n===9?d=`
            var data = vec4<u32>(0);
            ${h("data",0,"u32")}
            ${h("data",1,"u32")}
            ${h("data",2,"u32")}
            ${h("data",3,"u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:d=`
            ${h("output_data[global_idx]",0)}
            ${h("output_data[global_idx]",1)}
            ${h("output_data[global_idx]",2)}
            ${h("output_data[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(u,s,o,a)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${d}
      }`},mc=e=>{let t=e[1].dims,r=e[2].dims,i=e[0].dims,n=e[1].dataType,a=!(P.areEqual(t,r)&&P.areEqual(r,i)),s=t,o=P.size(t);if(a){let d=ar.calcShape(ar.calcShape(t,r,!1),i,!1);if(!d)throw new Error("Can't perform where op on the given tensors");s=d,o=P.size(s)}let u=Math.ceil(o/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:d=>fc(d,e,s,a,n),getRunData:()=>({outputs:[{dims:s,dataType:n}],dispatchGroup:{x:Math.ceil(o/64/4)},programUniforms:[{type:12,data:u},...ce(i,t,r,s)]})}},Jf=e=>{e.compute(mc(e.inputs))}}),em,Yy=J(()=>{"use strict";ly(),za(),dy(),cy(),py(),hy(),fy(),_y(),$y(),vy(),xy(),ky(),Sy(),Ty(),Iy(),Cy(),Ey(),zy(),Ay(),My(),Oy(),By(),Ry(),Dy(),Ny(),Uy(),_f(),Py(),Ly(),Wy(),qy(),Gy(),Ea(),Vy(),kf(),Hy(),Fy(),jy(),vf(),Ky(),Ct(),Aa(),Zy(),em=new Map([["Abs",[Gp]],["Acos",[Vp]],["Acosh",[Hp]],["Add",[Th]],["ArgMax",[Pp,ta]],["ArgMin",[Up,ta]],["Asin",[Fp]],["Asinh",[jp]],["Atan",[Kp]],["Atanh",[Zp]],["Attention",[Lp]],["AveragePool",[Of,Mf]],["BatchNormalization",[Wp]],["BiasAdd",[qp]],["BiasSplitGelu",[Sh]],["Cast",[Qp,Yp]],["Ceil",[Jp]],["Clip",[Xp]],["Concat",[Dh,Nh]],["Conv",[oa,sa]],["ConvTranspose",[jh,Fh]],["Cos",[eh]],["Cosh",[th]],["CumSum",[Kh,Zh]],["DepthToSpace",[Yh,Qh]],["DequantizeLinear",[Lf,Wf]],["DFT",[Xh,Jh]],["Div",[Ih]],["Einsum",[ef,tf]],["Elu",[rh,kr]],["Equal",[Ch]],["Erf",[ih]],["Exp",[nh]],["Expand",[rf]],["FastGelu",[nf]],["Floor",[ah]],["FusedConv",[oa,sa]],["Gather",[sf,af]],["GatherElements",[pf,cf]],["GatherBlockQuantized",[lf,df]],["GatherND",[of,uf]],["Gelu",[sh]],["Gemm",[ff,hf]],["GlobalAveragePool",[Rf,Bf]],["GlobalMaxPool",[Pf,Uf]],["Greater",[Mh]],["GreaterOrEqual",[Bh]],["GridSample",[mf,gf]],["GroupQueryAttention",[Sf]],["HardSigmoid",[fh,hh]],["HardSwish",[mh]],["InstanceNormalization",[Tf]],["LayerNormalization",[If]],["LeakyRelu",[oh,kr]],["Less",[Oh]],["LessOrEqual",[Rh]],["Log",[xh]],["MatMul",[Cf]],["MatMulNBits",[Ef,zf]],["MaxPool",[Df,Nf]],["Mul",[Eh]],["MultiHeadAttention",[wf,yf]],["Neg",[lh]],["Not",[uh]],["Pad",[Af]],["Pow",[zh]],["QuickGelu",[kh,kr]],["Range",[qf]],["Reciprocal",[dh]],["ReduceMin",[Op]],["ReduceMean",[Cp]],["ReduceMax",[Mp]],["ReduceSum",[Rp]],["ReduceProd",[Bp]],["ReduceL1",[Ep]],["ReduceL2",[zp]],["ReduceLogSum",[Np]],["ReduceLogSumExp",[Ap]],["ReduceSumSquare",[Dp]],["Relu",[ch]],["Resize",[Hf,Ff]],["RotaryEmbedding",[xf]],["ScatterND",[Vf,Gf]],["Sigmoid",[ph]],["Sin",[gh]],["Sinh",[yh]],["Slice",[Kf,Zf]],["SkipLayerNormalization",[jf]],["Split",[bf,$f]],["Sqrt",[wh]],["Softmax",[Yf,Qf]],["Sub",[Ah]],["Tan",[_h]],["Tanh",[bh]],["ThresholdedRelu",[vh,kr]],["Tile",[Xf]],["Transpose",[gp,yp]],["Where",[Jf]]])}),tm,Qy=J(()=>{"use strict";Ye(),_t(),ye(),tm=class{constructor(e){this.backend=e,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,r,i,n){Je(e.programInfo.name);let a=this.backend.device,s=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let o=[];for(let d of t)o.push({binding:o.length,resource:{buffer:d.buffer}});for(let d of r)o.push({binding:o.length,resource:{buffer:d.buffer}});n&&o.push({binding:o.length,resource:n});let u=a.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:o,label:e.programInfo.name});if(this.backend.sessionStatus==="capturing"){let d={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:u,dispatchGroup:i};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(d)}s.setPipeline(e.computePipeline),s.setBindGroup(0,u),s.dispatchWorkgroups(...i),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType==="at-passes")&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),Ke(e.programInfo.name)}dispose(){}build(e,t){Je(e.name);let r=this.backend.device,i=[];[{feature:"shader-f16",extension:"f16"},{feature:"subgroups",extension:"subgroups"}].forEach(d=>{r.features.has(d.feature)&&i.push(`enable ${d.extension};`)});let n=mp(t,this.backend.device.limits),a=e.getShaderSource(n),s=`${i.join(`
`)}
${n.additionalImplementations}
${a}`,o=r.createShaderModule({code:s,label:e.name});ke("verbose",()=>`[WebGPU] ${e.name} shader code: ${s}`);let u=r.createComputePipeline({compute:{module:o,entryPoint:"main"},layout:"auto",label:e.name});return Ke(e.name),{programInfo:e,computePipeline:u,uniformVariablesInfo:n.variablesInfo}}normalizeDispatchGroupSize(e){let t=typeof e=="number"?e:e.x,r=typeof e=="number"?1:e.y||1,i=typeof e=="number"?1:e.z||1,n=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(t<=n&&r<=n&&i<=n)return[t,r,i];let a=t*r*i,s=Math.ceil(Math.sqrt(a));if(s>n){if(s=Math.ceil(Math.cbrt(a)),s>n)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[s,s,s]}else return[s,s,1]}}}),rm={};or(rm,{WebGpuBackend:()=>im});var gc,yc,wc,im,Xy=J(()=>{"use strict";Ye(),fe(),_t(),dp(),oy(),Yy(),Qy(),gc=(e,t)=>{if(t.length!==e.length)throw new Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let r=[];for(let i=0;i<e.length;++i){let n=e[i].dataType;switch(t[i]){case"none":{r.push("");break}case"type":{r.push(`${n}`);break}case"rank":{let a=e[i].dims.length;r.push(`${n};${a}`);break}case"dims":{let a=e[i].dims.join(",");r.push(`${n};${a}`);break}default:throw new Error(`unsupported input dependency: ${t[i]}`)}}return r.join("|")},yc=(e,t,r)=>{let i=e.name;return e.shaderCache?.hint&&(i+="["+e.shaderCache.hint+"]"),i+=":"+r+`:${gc(t,e.shaderCache?.inputDependencies??new Array(t.length).fill("dims"))}`,i},wc=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},im=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus="default",this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,t){this.env=e;let r=[],i={requiredLimits:{maxComputeWorkgroupStorageSize:t.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:t.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:t.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.limits.maxComputeWorkgroupSizeZ},requiredFeatures:r},n=o=>t.features.has(o)&&r.push(o)&&!0;n("chromium-experimental-timestamp-query-inside-passes")||n("timestamp-query"),n("shader-f16"),n("subgroups"),this.device=await t.requestDevice(i);let a=t,s=t.info??(typeof a.requestAdapterInfo=="function"?await a.requestAdapterInfo():void 0);this.adapterInfo=new wc(s),this.gpuDataManager=hp(this),this.programManager=new tm(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,Sa(e.logLevel,!!e.debug),this.device.onuncapturederror=o=>{o.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${o.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!0}),Object.defineProperty(this.env.webgpu,"adapter",{value:t,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){typeof this.querySet<"u"&&this.querySet.destroy(),this.gpuDataManager.dispose(),this.device&&this.env?.webgpu&&this.device.lost.then(()=>{delete this.env.webgpu.device})}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),t={};this.queryType==="at-passes"&&(t.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=e.beginComputePass(t)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){if(!this.commandEncoder)return;Je(),this.endComputePass();let e;this.queryType!=="none"&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),e=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!=="none"&&e.mapAsync(GPUMapMode.READ).then(()=>{let t=new BigUint64Array(e.getMappedRange()),r=this.pendingQueries.get(e);for(let i=0;i<t.length/2;i++){let n=r[i],a=n.kernelId,s=this.kernels.get(a),o=s.kernelType,u=s.kernelName,d=n.programName,c=n.inputTensorViews,h=n.outputTensorViews,m=t[i*2],g=t[i*2+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=m);let f=Number(m-this.queryTimeBase),$=Number(g-this.queryTimeBase);if(!Number.isSafeInteger(f)||!Number.isSafeInteger($))throw new RangeError("incorrect timestamp range");if(this.env.webgpu.profiling?.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:c.map(v=>({dims:v.dims,dataType:wt(v.dataType)})),outputsMetadata:h.map(v=>({dims:v.dims,dataType:wt(v.dataType)})),kernelId:a,kernelType:o,kernelName:u,programName:d,startTime:f,endTime:$});else{let v="";c.forEach((w,k)=>{v+=`input[${k}]: [${w.dims}] | ${wt(w.dataType)}, `});let b="";h.forEach((w,k)=>{b+=`output[${k}]: [${w.dims}] | ${wt(w.dataType)}, `}),console.log(`[profiling] kernel "${a}|${o}|${u}|${d}" ${v}${b}start time: ${f} ns, execution time: ${$-f} ns`)}oi("GPU",`${d}::${m}::${g}`)}e.unmap(),this.pendingQueries.delete(e)}),Ke()}run(e,t,r,i,n,a){Je(e.name);let s=[];for(let w=0;w<t.length;++w){let k=t[w].data;if(k===0)continue;let S=this.gpuDataManager.get(k);if(!S)throw new Error(`no GPU data for input: ${k}`);s.push(S)}let{outputs:o,dispatchGroup:u,programUniforms:d}=e.getRunData(t),c=r.length===0?o.map((w,k)=>k):r;if(c.length!==o.length)throw new Error(`Output size ${c.length} must be equal to ${o.length}.`);let h=[],m=[];for(let w=0;w<o.length;++w){if(!Number.isInteger(c[w])||c[w]<-3||c[w]>=a)throw new Error(`Invalid output index: ${c[w]}`);if(c[w]===-3)continue;let k=c[w]===-1,S=c[w]===-2,T=k||S?n(o[w].dataType,o[w].dims):i(c[w],o[w].dataType,o[w].dims);if(h.push(T),T.data===0)continue;let E=this.gpuDataManager.get(T.data);if(!E)throw new Error(`no GPU data for output: ${T.data}`);if(k&&this.temporaryData.push(E),S){let C=this.kernelPersistentData.get(this.currentKernelId);C||(C=[],this.kernelPersistentData.set(this.currentKernelId,C)),C.push(E)}m.push(E)}if(s.length!==t.length||m.length!==h.length){if(m.length===0)return Ke(e.name),h;throw new Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let g;if(d){let w=0,k=[];d.forEach(C=>{let x=typeof C.data=="number"?[C.data]:C.data;if(x.length===0)return;let M=C.type===10?2:4,U,O;C.type===10?(O=x.length>4?16:x.length>2?8:x.length*M,U=x.length>4?16:M*x.length):(O=x.length<=2?x.length*M:16,U=16),w=Math.ceil(w/O)*O,k.push(w);let D=C.type===10?8:4;w+=x.length>4?Math.ceil(x.length/D)*U:x.length*M});let S=16;w=Math.ceil(w/S)*S;let T=new ArrayBuffer(w);d.forEach((C,x)=>{let M=k[x],U=typeof C.data=="number"?[C.data]:C.data;if(C.type===6)new Int32Array(T,M,U.length).set(U);else if(C.type===12)new Uint32Array(T,M,U.length).set(U);else if(C.type===10)new Uint16Array(T,M,U.length).set(U);else if(C.type===1)new Float32Array(T,M,U.length).set(U);else throw new Error(`Unsupported uniform type: ${wt(C.type)}`)});let E=this.gpuDataManager.create(w,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(E.buffer,0,T,0,w),this.gpuDataManager.release(E.id),g={offset:0,size:w,buffer:E.buffer}}let f=this.programManager.normalizeDispatchGroupSize(u),$=f[1]===1&&f[2]===1,v=yc(e,t,$),b=this.programManager.getArtifact(v);if(b||(b=this.programManager.build(e,f),this.programManager.setArtifact(v,b),ke("info",()=>`[artifact] key: ${v}, programName: ${e.name}`)),d&&b.uniformVariablesInfo){if(d.length!==b.uniformVariablesInfo.length)throw new Error(`Uniform variables count mismatch: expect ${b.uniformVariablesInfo.length}, got ${d.length} in program "${b.programInfo.name}".`);for(let w=0;w<d.length;w++){let k=d[w],S=k.type,T=typeof k.data=="number"?1:k.data.length,[E,C]=b.uniformVariablesInfo[w];if(S!==E||T!==C)throw new Error(`Uniform variable ${w} mismatch: expect type ${E} with size ${C}, got type ${S} with size ${T} in program "${b.programInfo.name}".`)}}if(ke("info",()=>`[ProgramManager] run "${e.name}" (key=${v}) with ${f[0]}x${f[1]}x${f[2]}`),this.queryType!=="none"||this.sessionStatus==="capturing"){let w={kernelId:this.currentKernelId,programName:b.programInfo.name,inputTensorViews:t,outputTensorViews:h};this.pendingKernels.push(w),this.sessionStatus==="capturing"&&this.capturedPendingKernels.get(this.currentSessionId).push(w)}return this.programManager.run(b,s,m,f,g),Ke(e.name),h}upload(e,t){this.gpuDataManager.upload(e,t)}memcpy(e,t){this.gpuDataManager.memcpy(e,t)}async download(e,t){await this.gpuDataManager.download(e,t)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,t,r,i){let n=em.get(e);if(!n)throw new Error(`kernel not implemented: ${e}`);let a={kernelType:e,kernelName:i,kernelEntry:n[0],attributes:[n[1],r]};this.kernels.set(t,a)}releaseKernel(e){let t=this.kernelPersistentData.get(e);if(t){for(let r of t)this.gpuDataManager.release(r.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,t,r){let i=this.kernels.get(e);if(!i)throw new Error(`kernel not created: ${e}`);let n=i.kernelType,a=i.kernelName,s=i.kernelEntry,o=i.attributes;if(this.currentKernelId!==null)throw new Error(`kernel "[${n}] ${a}" is not allowed to be called recursively`);this.currentKernelId=e,o[0]&&(o[1]=o[0](o[1]),o[0]=void 0),ke("info",()=>`[WebGPU] Start to run kernel "[${n}] ${a}"...`);let u=this.env.debug;this.temporaryData=[];try{return u&&this.device.pushErrorScope("validation"),s(t,o[1]),0}catch(d){return r.push(Promise.resolve(`[WebGPU] Kernel "[${n}] ${a}" failed. ${d}`)),1}finally{u&&r.push(this.device.popErrorScope().then(d=>d?`GPU validation error for kernel "[${n}] ${a}": ${d.message}`:null));for(let d of this.temporaryData)this.gpuDataManager.release(d.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,t,r,i){let n=this.sessionExternalDataMapping.get(e);n||(n=new Map,this.sessionExternalDataMapping.set(e,n));let a=n.get(t),s=this.gpuDataManager.registerExternalBuffer(r,i,a);return n.set(t,[s,r]),s}unregisterBuffers(e){let t=this.sessionExternalDataMapping.get(e);t&&(t.forEach(r=>this.gpuDataManager.unregisterExternalBuffer(r[0])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let t=this.gpuDataManager.get(e);if(!t)throw new Error(`no GPU data for buffer: ${e}`);return t.buffer}createDownloader(e,t,r){return async()=>{let i=await Xn(this,e,t);return Ta(i.buffer,r)}}writeTimestamp(e){this.queryType==="inside-passes"&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){this.queryType="none",(this.env.webgpu.profiling?.mode==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),this.queryType!=="none"&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){ke("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){ke("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){ke("info","replay"),this.sessionStatus="replaying";let e=this.capturedCommandList.get(this.currentSessionId),t=this.capturedPendingKernels.get(this.currentSessionId),r=e.length;this.pendingKernels=[];for(let i=0;i<r;i++){let n=this.getComputePassEncoder(),a=e[i];this.writeTimestamp(this.pendingDispatchNumber*2),n.setPipeline(a.computePipeline),n.setBindGroup(0,a.bindGroup),n.dispatchWorkgroups(...a.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!=="none"&&this.pendingKernels.push(t[i]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType==="at-passes")&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}}),nm={};or(nm,{init:()=>am});var ei,_c,am,Jy=J(()=>{"use strict";fe(),_t(),ge(),sy(),ei=class sm{constructor(t,r,i,n){this.module=t,this.dataType=r,this.data=i,this.dims=n}getFloat32Array(){if(this.dataType!==1)throw new Error("Invalid data type");let t=P.size(this.dims);return t===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,t)}getBigInt64Array(){if(this.dataType!==7)throw new Error("Invalid data type");let t=P.size(this.dims);return t===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,t)}getInt32Array(){if(this.dataType!==6)throw new Error("Invalid data type");let t=P.size(this.dims);return t===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,t)}getUint16Array(){if(this.dataType!==10&&this.dataType!==4)throw new Error("Invalid data type");let t=P.size(this.dims);return t===0?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,t)}reshape(t){if(P.size(t)!==P.size(this.dims))throw new Error("Invalid new shape");return new sm(this.module,this.dataType,this.data,t)}},_c=class{constructor(e,t,r){this.module=e,this.backend=t,this.customDataOffset=0,this.customDataSize=0,this.adapterInfo=t.adapterInfo,this.deviceLimits=t.device.limits;let i=e.PTR_SIZE,n=r/e.PTR_SIZE,a=i===4?"i32":"i64";this.opKernelContext=Number(e.getValue(i*n++,a));let s=Number(e.getValue(i*n++,a));this.outputCount=Number(e.getValue(i*n++,a)),this.customDataOffset=Number(e.getValue(i*n++,"*")),this.customDataSize=Number(e.getValue(i*n++,a));let o=[];for(let u=0;u<s;u++){let d=Number(e.getValue(i*n++,a)),c=Number(e.getValue(i*n++,"*")),h=Number(e.getValue(i*n++,a)),m=[];for(let g=0;g<h;g++)m.push(Number(e.getValue(i*n++,a)));o.push(new ei(e,d,c,m))}this.inputs=o}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(e,t){let r=t?.inputs?.map(s=>typeof s=="number"?this.inputs[s]:s)??this.inputs,i=t?.outputs??[],n=(s,o,u)=>new ei(this.module,o,this.output(s,u),u),a=(s,o)=>{let u=Pt(s,o);if(!u)throw new Error(`Unsupported data type: ${s}`);let d=u>0?this.backend.gpuDataManager.create(u).id:0;return new ei(this.module,s,d,o)};return this.backend.run(e,r,i,n,a,this.outputCount)}output(e,t){let r=this.module.stackSave();try{let i=this.module.PTR_SIZE,n=i===4?"i32":"i64",a=this.module.stackAlloc((1+t.length)*i);this.module.setValue(a,t.length,n);for(let s=0;s<t.length;s++)this.module.setValue(a+i*(s+1),t[s],n);return this.module._JsepOutput(this.opKernelContext,e,a)}catch(i){throw new Error(`Failed to generate kernel's output[${e}] with dims [${t}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${i}`)}finally{this.module.stackRestore(r)}}},am=async(e,t,r,i)=>{let n=t.jsepInit;if(!n)throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if(e==="webgpu"){let a=(Xy(),Er(rm)).WebGpuBackend,s=new a;await s.initialize(r,i),n("webgpu",[s,o=>s.alloc(Number(o)),o=>s.free(o),(o,u,d,c=!1)=>{if(c)ke("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(o)}, dst=${Number(u)}, size=${Number(d)}`),s.memcpy(Number(o),Number(u));else{ke("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(o)}, gpuDataId=${Number(u)}, size=${Number(d)}`);let h=t.HEAPU8.subarray(Number(o>>>0),Number(o>>>0)+Number(d));s.upload(Number(u),h)}},async(o,u,d)=>{ke("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${o}, dataOffset=${u}, size=${d}`),await s.download(Number(o),()=>t.HEAPU8.subarray(Number(u)>>>0,Number(u+d)>>>0))},(o,u,d)=>s.createKernel(o,Number(u),d,t.UTF8ToString(t._JsepGetNodeName(Number(u)))),o=>s.releaseKernel(o),(o,u,d,c)=>{ke("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${d}, kernel=${o}, contextDataOffset=${u}`);let h=new _c(t,s,Number(u));return s.computeKernel(Number(o),h,c)},()=>s.captureBegin(),()=>s.captureEnd(),()=>s.replay()])}else{let a=new pp(r);n("webnn",[a,()=>a.reserveTensorId(),s=>a.releaseTensorId(s),async(s,o,u,d,c)=>a.ensureTensor(s,o,u,d,c),(s,o)=>{a.uploadTensor(s,o)},async(s,o)=>a.downloadTensor(s,o),(s,o)=>a.registerMLContext(s,o),!!r.trace])}}}),bc,Na,Ua,St,$c,Ln,fi,Pa,La,_r,vc,Bt,om,um,Wn,Wa,qa,Ga,lm=J(()=>{"use strict";Ye(),iy(),ny(),fe(),Ht(),$a(),ka(),bc=(e,t)=>{ze()._OrtInit(e,t)!==0&&Ie("Can't initialize onnxruntime.")},Na=async e=>{bc(e.wasm.numThreads,li(e.logLevel))},Ua=async(e,t)=>{ze().asyncInit?.();let r=e.webgpu.adapter;if(t==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");if(r){if(typeof r.limits!="object"||typeof r.features!="object"||typeof r.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let i=e.webgpu.powerPreference;if(i!==void 0&&i!=="low-power"&&i!=="high-performance")throw new Error(`Invalid powerPreference setting: "${i}"`);let n=e.webgpu.forceFallbackAdapter;if(n!==void 0&&typeof n!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${n}"`);if(r=await navigator.gpu.requestAdapter({powerPreference:i,forceFallbackAdapter:n}),!r)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}}if(t==="webnn"&&(typeof navigator>"u"||!navigator.ml))throw new Error("WebNN is not supported in current environment");{let i=(Jy(),Er(nm)).init;t==="webgpu"&&await i("webgpu",ze(),e,r),t==="webnn"&&await i("webnn",ze(),e)}},St=new Map,$c=e=>{let t=ze(),r=t.stackSave();try{let i=t.PTR_SIZE,n=t.stackAlloc(2*i);t._OrtGetInputOutputCount(e,n,n+i)!==0&&Ie("Can't get session input/output count.");let a=i===4?"i32":"i64";return[Number(t.getValue(n,a)),Number(t.getValue(n+i,a))]}finally{t.stackRestore(r)}},Ln=(e,t)=>{let r=ze(),i=r.stackSave(),n=0;try{let a=r.PTR_SIZE,s=r.stackAlloc(2*a);r._OrtGetInputOutputMetadata(e,t,s,s+a)!==0&&Ie("Can't get session input/output metadata.");let o=Number(r.getValue(s,"*"));n=Number(r.getValue(s+a,"*"));let u=r.HEAP32[n/4];if(u===0)return[o,0];let d=r.HEAPU32[n/4+1],c=[];for(let h=0;h<d;h++){let m=Number(r.getValue(n+8+h*a,"*"));c.push(m!==0?r.UTF8ToString(m):Number(r.getValue(n+8+(h+d)*a,"*")))}return[o,u,c]}finally{r.stackRestore(i),n!==0&&r._OrtFree(n)}},fi=e=>{let t=ze(),r=t._malloc(e.byteLength);if(r===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,r),[r,e.byteLength]},Pa=async(e,t)=>{let r,i,n=ze();Array.isArray(e)?[r,i]=e:e.buffer===n.HEAPU8.buffer?[r,i]=[e.byteOffset,e.byteLength]:[r,i]=fi(e);let a=0,s=0,o=0,u=[],d=[],c=[];try{if([s,u]=await sp(t),t?.externalData&&n.mountExternalData){let S=[];for(let T of t.externalData){let E=typeof T=="string"?T:T.path,C=typeof T=="string"?T:T.data;S.push(yi(C).then(x=>{n.mountExternalData(E,x)}))}await Promise.all(S)}for(let S of t?.executionProviders??[])if((typeof S=="string"?S:S.name)==="webnn"){if(n.shouldTransferToMLTensor=!1,typeof S!="string"){let T=S,E=T?.context,C=T?.gpuDevice,x=T?.deviceType,M=T?.powerPreference;E?n.currentContext=E:C?n.currentContext=await n.webnnCreateMLContext(C):n.currentContext=await n.webnnCreateMLContext({deviceType:x,powerPreference:M})}else n.currentContext=await n.webnnCreateMLContext();break}a=await n._OrtCreateSession(r,i,s),n.webgpuOnCreateSession?.(a),a===0&&Ie("Can't create a session."),n.jsepOnCreateSession?.(),n.currentContext&&(n.webnnRegisterMLContext(a,n.currentContext),n.currentContext=void 0,n.shouldTransferToMLTensor=!0);let[h,m]=$c(a),g=!!t?.enableGraphCapture,f=[],$=[],v=[],b=[],w=[];for(let S=0;S<h;S++){let[T,E,C]=Ln(a,S);T===0&&Ie("Can't get an input name."),d.push(T);let x=n.UTF8ToString(T);f.push(x),v.push(E===0?{name:x,isTensor:!1}:{name:x,isTensor:!0,type:wt(E),shape:C})}for(let S=0;S<m;S++){let[T,E,C]=Ln(a,S+h);T===0&&Ie("Can't get an output name."),c.push(T);let x=n.UTF8ToString(T);$.push(x),b.push(E===0?{name:x,isTensor:!1}:{name:x,isTensor:!0,type:wt(E),shape:C});{if(g&&t?.preferredOutputLocation===void 0){w.push("gpu-buffer");continue}let M=typeof t?.preferredOutputLocation=="string"?t.preferredOutputLocation:t?.preferredOutputLocation?.[x]??"cpu",U=n.webnnIsGraphOutput;if(M==="cpu"&&U&&U(a,x)){w.push("ml-tensor-cpu-output");continue}if(M!=="cpu"&&M!=="cpu-pinned"&&M!=="gpu-buffer"&&M!=="ml-tensor")throw new Error(`Not supported preferred output location: ${M}.`);if(g&&M!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${M}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);w.push(M)}}let k=null;return w.some(S=>S==="gpu-buffer"||S==="ml-tensor"||S==="ml-tensor-cpu-output")&&(o=n._OrtCreateBinding(a),o===0&&Ie("Can't create IO binding."),k={handle:o,outputPreferredLocations:w,outputPreferredLocationsEncoded:w.map(S=>S==="ml-tensor-cpu-output"?"ml-tensor":S).map(S=>Qn(S))}),St.set(a,[a,d,c,k,g,!1]),[a,f,$,v,b]}catch(h){throw d.forEach(m=>n._OrtFree(m)),c.forEach(m=>n._OrtFree(m)),o!==0&&n._OrtReleaseBinding(o)!==0&&Ie("Can't release IO binding."),a!==0&&n._OrtReleaseSession(a)!==0&&Ie("Can't release session."),h}finally{n._free(r),s!==0&&n._OrtReleaseSessionOptions(s)!==0&&Ie("Can't release session options."),u.forEach(h=>n._free(h)),n.unmountExternalData?.()}},La=e=>{let t=ze(),r=St.get(e);if(!r)throw new Error(`cannot release session. invalid session id: ${e}`);let[i,n,a,s,o]=r;s&&(o&&t._OrtClearBoundOutputs(s.handle)!==0&&Ie("Can't clear bound outputs."),t._OrtReleaseBinding(s.handle)!==0&&Ie("Can't release IO binding.")),t.jsepOnReleaseSession?.(e),t.webnnOnReleaseSession?.(e),t.webgpuOnReleaseSession?.(e),n.forEach(u=>t._OrtFree(u)),a.forEach(u=>t._OrtFree(u)),t._OrtReleaseSession(i)!==0&&Ie("Can't release session."),St.delete(e)},_r=new Map,vc=1,Bt=new Map,om=e=>{let t=ze(),r=t._malloc(e.byteLength);if(r===0)throw new Error(`Can't create a LoRA adapter. failed to allocate a buffer of size ${e.byteLength}.`);try{t.HEAPU8.set(e,r);let i=t._OrtCreateLoraAdapter(r,e.byteLength);i===0&&Ie("Can't create a LoRA adapter.");let n=vc++;return _r.set(n,i),n}finally{t._free(r)}},um=e=>{let t=ze(),r=_r.get(e);if(r===void 0)throw new Error(`cannot release LoRA adapter. invalid adapter id: ${e}`);if(Bt.has(e))throw new Error(`cannot release LoRA adapter. the adapter is used by a run in progress. adapter id: ${e}`);t._OrtReleaseLoraAdapter(r)!==0&&Ie("Can't release LoRA adapter."),_r.delete(e)},Wn=async(e,t,r,i,n,a,s=!1)=>{if(!e){t.push(0);return}let o=ze(),u=o.PTR_SIZE,d=e[0],c=e[1],h=e[3],m=h,g,f;if(d==="string"&&(h==="gpu-buffer"||h==="ml-tensor"))throw new Error("String tensor is not supported on GPU.");if(s&&h!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${a} when enableGraphCapture is true.`);if(h==="gpu-buffer"){let b=e[2].gpuBuffer;f=Pt(Ut(d),c);{let w=o.jsepRegisterBuffer;if(!w)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');g=w(i,a,b,f)}}else if(h==="ml-tensor"){let b=e[2].mlTensor;f=Pt(Ut(d),c);let w=o.webnnRegisterMLTensor;if(!w)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');g=w(i,b,Ut(d),c)}else{let b=e[2];if(Array.isArray(b)){f=u*b.length,g=o._malloc(f),r.push(g);for(let w=0;w<b.length;w++){if(typeof b[w]!="string")throw new TypeError(`tensor data at index ${w} is not a string`);o.setValue(g+w*u,st(b[w],r),"*")}}else{let w=o.webnnIsGraphInput,k=o.webnnIsGraphOutput;if(d!=="string"&&w&&k){let S=o.UTF8ToString(n);if(w(i,S)||k(i,S)){let T=Ut(d);f=Pt(T,c),m="ml-tensor";let E=o.webnnCreateTemporaryTensor,C=o.webnnUploadTensor;if(!E||!C)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let x=await E(i,T,c);C(x,new Uint8Array(b.buffer,b.byteOffset,b.byteLength)),g=x}else f=b.byteLength,g=o._malloc(f),r.push(g),o.HEAPU8.set(new Uint8Array(b.buffer,b.byteOffset,f),g)}else f=b.byteLength,g=o._malloc(f),r.push(g),o.HEAPU8.set(new Uint8Array(b.buffer,b.byteOffset,f),g)}}let $=o.stackSave(),v=o.stackAlloc(4*c.length);try{c.forEach((w,k)=>o.setValue(v+k*u,w,u===4?"i32":"i64"));let b=o._OrtCreateTensor(Ut(d),g,f,v,c.length,Qn(m));b===0&&Ie(`Can't create tensor for input/output. session=${i}, index=${a}.`),t.push(b)}finally{o.stackRestore($)}},Wa=async(e,t,r,i,n,a,s=[])=>{let o=ze(),u=o.PTR_SIZE,d=St.get(e);if(!d)throw new Error(`cannot run inference. invalid session id: ${e}`);let c=d[0],h=d[1],m=d[2],g=d[3],f=d[4],$=d[5],v=[];if(s.length>0){if(g)throw new Error("LoRA adapters are not supported for a session that uses IO binding, e.g. when an output is preferred to be on GPU, or when the WebNN execution provider produces an output.");for(let A of s){let G=_r.get(A);if(G===void 0)throw new Error(`cannot run inference. invalid LoRA adapter id: ${A}`);v.push(G)}}let b=t.length,w=i.length,k=0,S=[],T=[],E=[],C=[],x=[],M=o.stackSave(),U=o.stackAlloc(b*u),O=o.stackAlloc(b*u),D=o.stackAlloc(w*u),V=o.stackAlloc(w*u);try{for(let L of s)Bt.set(L,(Bt.get(L)??0)+1);[k,S]=ap(a,v),Lt("wasm prepareInputOutputTensor");for(let L=0;L<b;L++)await Wn(r[L],T,C,e,h[t[L]],t[L],f);for(let L=0;L<w;L++)await Wn(n[L],E,C,e,m[i[L]],b+i[L],f);Wt("wasm prepareInputOutputTensor");for(let L=0;L<b;L++)o.setValue(U+L*u,T[L],"*"),o.setValue(O+L*u,h[t[L]],"*");for(let L=0;L<w;L++)o.setValue(D+L*u,E[L],"*"),o.setValue(V+L*u,m[i[L]],"*");if(g&&!$){let{handle:L,outputPreferredLocations:re,outputPreferredLocationsEncoded:ae}=g;if(h.length!==b)throw new Error(`input count from feeds (${b}) is expected to be always equal to model's input count (${h.length}).`);Lt("wasm bindInputsOutputs");for(let Y=0;Y<b;Y++){let N=t[Y];await o._OrtBindInput(L,h[N],T[Y])!==0&&Ie(`Can't bind input[${Y}] for session=${e}.`)}for(let Y=0;Y<w;Y++){let N=i[Y];n[Y]?.[3]?(x.push(E[Y]),o._OrtBindOutput(L,m[N],E[Y],0)!==0&&Ie(`Can't bind pre-allocated output[${Y}] for session=${e}.`)):o._OrtBindOutput(L,m[N],0,ae[N])!==0&&Ie(`Can't bind output[${Y}] to ${re[Y]} for session=${e}.`)}Wt("wasm bindInputsOutputs"),St.set(e,[c,h,m,g,f,!0])}o.jsepOnRunStart?.(c),o.webnnOnRunStart?.(c);let A;g?A=await o._OrtRunWithBinding(c,g.handle,w,D,k):A=await o._OrtRun(c,O,U,b,V,w,D,k),A!==0&&Ie("failed to call OrtRun().");let G=[],F=[];Lt("wasm ProcessOutputTensor");for(let L=0;L<w;L++){let re=Number(o.getValue(D+L*u,"*"));if(re===E[L]||x.includes(E[L])){G.push(n[L]),re!==E[L]&&o._OrtReleaseTensor(re)!==0&&Ie("Can't release tensor.");continue}let ae=o.stackSave(),Y=o.stackAlloc(4*u),N=!1,Q,K=0;try{o._OrtGetTensorData(re,Y,Y+u,Y+2*u,Y+3*u)!==0&&Ie(`Can't access output tensor data on index ${L}.`);let ee=u===4?"i32":"i64",me=Number(o.getValue(Y,ee));K=o.getValue(Y+u,"*");let xe=o.getValue(Y+u*2,"*"),Z=Number(o.getValue(Y+u*3,ee)),te=[];for(let oe=0;oe<Z;oe++)te.push(Number(o.getValue(xe+oe*u,ee)));o._OrtFree(xe)!==0&&Ie("Can't free memory for tensor dims.");let ne=te.reduce((oe,pe)=>oe*pe,1);Q=wt(me);let X=g?.outputPreferredLocations[i[L]];if(Q==="string"){if(X==="gpu-buffer"||X==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let oe=[];for(let pe=0;pe<ne;pe++){let R=o.getValue(K+pe*u,"*"),H=o.getValue(K+(pe+1)*u,"*"),le=pe===ne-1?void 0:H-R;oe.push(o.UTF8ToString(R,le))}G.push([Q,te,oe,"cpu"])}else if(X==="gpu-buffer"&&ne>0){let oe=o.jsepGetBuffer;if(!oe)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let pe=oe(K),R=Pt(me,ne);if(R===void 0||!va(Q))throw new Error(`Unsupported data type: ${Q}`);N=!0,G.push([Q,te,{gpuBuffer:pe,download:o.jsepCreateDownloader(pe,R,Q),dispose:()=>{o._OrtReleaseTensor(re)!==0&&Ie("Can't release tensor.")}},"gpu-buffer"])}else if(X==="ml-tensor"&&ne>0){let oe=o.webnnEnsureTensor,pe=o.webnnIsGraphInputOutputTypeSupported;if(!oe||!pe)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(Pt(me,ne)===void 0||!xa(Q))throw new Error(`Unsupported data type: ${Q}`);if(!pe(e,Q,!1))throw new Error(`preferredLocation "ml-tensor" for ${Q} output is not supported by current WebNN Context.`);let R=await oe(e,K,me,te,!1);N=!0,G.push([Q,te,{mlTensor:R,download:o.webnnCreateMLTensorDownloader(K,Q),dispose:()=>{o.webnnReleaseTensorId(K),o._OrtReleaseTensor(re)}},"ml-tensor"])}else if(X==="ml-tensor-cpu-output"&&ne>0){let oe=o.webnnCreateMLTensorDownloader(K,Q)(),pe=G.length;N=!0,F.push((async()=>{let R=[pe,await oe];return o.webnnReleaseTensorId(K),o._OrtReleaseTensor(re),R})()),G.push([Q,te,[],"cpu"])}else{let oe=gi(Q),pe=new oe(ne);new Uint8Array(pe.buffer,pe.byteOffset,pe.byteLength).set(o.HEAPU8.subarray(K,K+pe.byteLength)),G.push([Q,te,pe,"cpu"])}}finally{o.stackRestore(ae),Q==="string"&&K&&o._free(K),N||o._OrtReleaseTensor(re)}}g&&!f&&(o._OrtClearBoundOutputs(g.handle)!==0&&Ie("Can't clear bound outputs."),St.set(e,[c,h,m,g,f,!1]));for(let[L,re]of await Promise.all(F))G[L][2]=re;return Wt("wasm ProcessOutputTensor"),G}finally{o.webnnOnRunEnd?.(c),o.stackRestore(M),T.forEach(A=>o._OrtReleaseTensor(A)),E.forEach(A=>o._OrtReleaseTensor(A)),C.forEach(A=>o._free(A)),k!==0&&o._OrtReleaseRunOptions(k),S.forEach(A=>o._free(A));for(let A of s){let G=Bt.get(A)-1;G===0?Bt.delete(A):Bt.set(A,G)}}},qa=e=>{let t=ze(),r=St.get(e);if(!r)throw new Error("invalid session id");let i=r[0],n=t._OrtEndProfiling(i);n===0&&Ie("Can't get an profile file name."),t._OrtFree(n)},Ga=e=>{let t=[];for(let r of e){let i=r[2];!Array.isArray(i)&&"buffer"in i&&t.push(i.buffer)}return t}}),ct,Xe,Yt,br,$r,ti,qn,ri,Rt,Dt,xc,dm,cm,pm,hm,fm,mm,gm,ym,wm,Va=J(()=>{"use strict";Ye(),lm(),Ht(),_a(),ka(),ct=()=>!!Ee.wasm.proxy&&typeof document<"u",Yt=!1,br=!1,$r=!1,ri=new Map,Rt=(e,t)=>{let r=ri.get(e);r?r.push(t):ri.set(e,[t])},Dt=()=>{if(Yt||!br||$r||!Xe)throw new Error("worker not ready")},xc=e=>{switch(e.data.type){case"init-wasm":Yt=!1,e.data.err?($r=!0,qn[1](e.data.err)):(br=!0,qn[0]()),ti&&(URL.revokeObjectURL(ti),ti=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=ri.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}default:}},dm=async()=>{if(!br){if(Yt)throw new Error("multiple calls to 'initWasm()' detected.");if($r)throw new Error("previous call to 'initWasm()' failed.");if(Yt=!0,ct())return new Promise((e,t)=>{Xe?.terminate(),ip().then(([r,i])=>{try{Xe=i,Xe.onerror=a=>t(a),Xe.onmessage=xc,qn=[e,t];let n={type:"init-wasm",in:Ee};!n.in.wasm.wasmPaths&&(r||Yn)&&(n.in.wasm.wasmPaths={wasm:new URL("/assets/ort-wasm-simd-threaded.jsep.wasm",import.meta.url).href}),Xe.postMessage(n),ti=r}catch(n){t(n)}},t)});try{await ba(Ee.wasm),await Na(Ee),br=!0}catch(e){throw $r=!0,e}finally{Yt=!1}}},cm=async e=>{if(ct())return Dt(),new Promise((t,r)=>{Rt("init-ep",[t,r]);let i={type:"init-ep",in:{epName:e,env:Ee}};Xe.postMessage(i)});await Ua(Ee,e)},pm=async e=>ct()?(Dt(),new Promise((t,r)=>{Rt("copy-from",[t,r]);let i={type:"copy-from",in:{buffer:e}};Xe.postMessage(i,[e.buffer])})):fi(e),hm=async(e,t)=>{if(ct()){if(t?.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return Dt(),new Promise((r,i)=>{Rt("create",[r,i]);let n={type:"create",in:{model:e,options:{...t}}},a=[];e instanceof Uint8Array&&a.push(e.buffer),Xe.postMessage(n,a)})}else return Pa(e,t)},fm=async e=>{if(ct())return Dt(),new Promise((t,r)=>{Rt("release",[t,r]);let i={type:"release",in:e};Xe.postMessage(i)});La(e)},mm=async e=>{if(ct())throw new Error("LoRA adapter is not supported for proxy.");let t=typeof e=="string"?await yi(e):e;return om(t)},gm=async e=>{if(ct())throw new Error("LoRA adapter is not supported for proxy.");um(e)},ym=async(e,t,r,i,n,a,s)=>{if(ct()){if(s.length>0)throw new Error("LoRA adapter is not supported for proxy.");if(r.some(o=>o[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(n.some(o=>o))throw new Error("pre-allocated output tensor is not supported for proxy.");return Dt(),new Promise((o,u)=>{Rt("run",[o,u]);let d=r,c={type:"run",in:{sessionId:e,inputIndices:t,inputs:d,outputIndices:i,options:a}};Xe.postMessage(c,Ga(d))})}else return Wa(e,t,r,i,n,a,s)},wm=async e=>{if(ct())return Dt(),new Promise((t,r)=>{Rt("end-profiling",[t,r]);let i={type:"end-profiling",in:e};Xe.postMessage(i)});qa(e)}}),Ha,_m=J(()=>{"use strict";Ye(),Va(),Ha=class{async loadAdapter(e){Je(),this.adapterId=await mm(e),Ke()}async dispose(){return gm(this.adapterId)}}}),Gn,kc,bm,e1=J(()=>{"use strict";Ye(),_m(),Va(),fe(),wa(),ka(),Gn=(e,t)=>{switch(e.location){case"cpu":return[e.type,e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[e.type,e.dims,{mlTensor:e.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${e.location} for ${t()}`)}},kc=e=>{switch(e[3]){case"cpu":return new Ve(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!va(t))throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:r,download:i,dispose:n}=e[2];return Ve.fromGpuBuffer(r,{dataType:t,dims:e[1],download:i,dispose:n})}case"ml-tensor":{let t=e[0];if(!xa(t))throw new Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:r,download:i,dispose:n}=e[2];return Ve.fromMLTensor(r,{dataType:t,dims:e[1],download:i,dispose:n})}default:throw new Error(`invalid data location: ${e[3]}`)}},bm=class{async fetchModelAndCopyToWasmMemory(e){return pm(await yi(e))}async loadModel(e,t){Je();let r;typeof e=="string"?r=await this.fetchModelAndCopyToWasmMemory(e):r=e,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await hm(r,t),Ke()}async dispose(){return fm(this.sessionId)}async run(e,t,r,i=[]){Je();let n=i.map(g=>{if(!(g instanceof Ha))throw new Error("LoRA adapter was not created by the WebAssembly backend.");return g.adapterId}),a=[],s=[];Object.entries(e).forEach(g=>{let f=g[0],$=g[1],v=this.inputNames.indexOf(f);if(v===-1)throw new Error(`invalid input '${f}'`);a.push($),s.push(v)});let o=[],u=[];Object.entries(t).forEach(g=>{let f=g[0],$=g[1],v=this.outputNames.indexOf(f);if(v===-1)throw new Error(`invalid output '${f}'`);o.push($),u.push(v)});let d=a.map((g,f)=>Gn(g,()=>`input "${this.inputNames[s[f]]}"`)),c=o.map((g,f)=>g?Gn(g,()=>`output "${this.outputNames[u[f]]}"`):null),h=await ym(this.sessionId,s,d,u,c,r,n),m={};for(let g=0;g<h.length;g++)m[this.outputNames[u[g]]]=o[g]??kc(h[g]);return Ke(),m}startProfiling(){}endProfiling(){wm(this.sessionId)}}}),$m,t1=J(()=>{"use strict";$m=e=>{if(e?.epContextDataRead)throw new Error('session option "epContextDataRead" is not supported by ONNX Runtime Web')}}),vm={};or(vm,{OnnxruntimeWebAssemblyBackend:()=>da,initializeFlags:()=>la,wasmBackend:()=>xm});var la,da,xm,r1=J(()=>{"use strict";Ye(),_m(),Va(),e1(),t1(),la=()=>{(typeof Ee.wasm.initTimeout!="number"||Ee.wasm.initTimeout<0)&&(Ee.wasm.initTimeout=0);let e=Ee.wasm.simd;if(typeof e!="boolean"&&e!==void 0&&e!=="fixed"&&e!=="relaxed"&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` and ignore SIMD feature checking.`),Ee.wasm.simd=!1),typeof Ee.wasm.proxy!="boolean"&&(Ee.wasm.proxy=!1),typeof Ee.wasm.trace!="boolean"&&(Ee.wasm.trace=!1),typeof Ee.wasm.numThreads!="number"||!Number.isInteger(Ee.wasm.numThreads)||Ee.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)Ee.wasm.numThreads=1;else{let t=typeof navigator>"u"?U0("node:os").cpus().length:navigator.hardwareConcurrency;Ee.wasm.numThreads=Math.min(4,Math.ceil((t||1)/2))}},da=class{async init(e){la(),await dm(),await cm(e)}async createInferenceSessionHandler(e,t){$m(t);let r=new bm;return await r.loadModel(e,t),r}async createLoraAdapterHandler(e){let t=new Ha;return await t.loadAdapter(e),t}},xm=new da});Ye();Ye();Ye();var i1="1.31.1";{let e=(r1(),Er(vm)).wasmBackend;Jt("webgpu",e,5),Jt("webnn",e,5),Jt("cpu",e,10),Jt("wasm",e,10)}Object.defineProperty(Ee.versions,"web",{value:i1,enumerable:!0});/**
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
 */class ir{static calculateDetResize(t,r,i=1920){const n=Math.max(t,r);let a=n>i?i/n:1,s=Math.max(32,Math.round(t*a/32)*32),o=Math.max(32,Math.round(r*a/32)*32);return{targetW:s,targetH:o,ratioW:s/t,ratioH:o/r}}static imageToDetTensor(t,r,i){const n=[.485,.456,.406],a=[.229,.224,.225],s=new Float32Array(3*i*r),o=t.data,u=i*r;for(let d=0;d<i;d++)for(let c=0;c<r;c++){const h=(d*r+c)*4,m=d*r+c,g=(o[h]/255-n[0])/a[0],f=(o[h+1]/255-n[1])/a[1],$=(o[h+2]/255-n[2])/a[2];s[m]=g,s[m+u]=f,s[m+u*2]=$}return new Ve("float32",s,[1,3,i,r])}static imageToRecTensor(t,r,i){const n=new Float32Array(3*i*r),a=t.data,s=i*r;for(let o=0;o<i;o++)for(let u=0;u<r;u++){const d=(o*r+u)*4,c=o*r+u,h=(a[d]/255-.5)/.5,m=(a[d+1]/255-.5)/.5,g=(a[d+2]/255-.5)/.5;n[c]=h,n[c+s]=m,n[c+s*2]=g}return new Ve("float32",n,[1,3,i,r])}static imageToRecTensorBatch(t,r,i){const n=i*r,a=new Float32Array(t.length*3*n);for(let s=0;s<t.length;s++){const o=t[s],u=Math.min(o.width,r),d=s*3*n;for(let c=0;c<i;c++)for(let h=0;h<u;h++){const m=(c*o.width+h)*4,g=d+c*r+h;a[g]=(o.data[m]/255-.5)/.5,a[g+n]=(o.data[m+1]/255-.5)/.5,a[g+n*2]=(o.data[m+2]/255-.5)/.5}}return new Ve("float32",a,[t.length,3,i,r])}static clampBox(t,r,i){const n=Math.max(0,Math.min(t.x,r-1)),a=Math.max(0,Math.min(t.y,i-1)),s=Math.max(1,Math.min(t.width,r-n)),o=Math.max(1,Math.min(t.height,i-a));return{x:n,y:a,width:s,height:o,confidence:t.confidence}}}class ca{static segmentLines(t,r,i,n){try{const s=t.getImageData(r.x,r.y,r.width,r.height).data,o=r.width,u=r.height,d=new Int32Array(256),c=O=>(s[O*4]*299+s[O*4+1]*587+s[O*4+2]*114)/1e3,h=o*u;for(let O=0;O<h;O++)d[Math.round(c(O))]++;let m=0;for(let O=0;O<256;O++)m+=O*d[O];let g=0,f=0,$=-1,v=128;for(let O=0;O<256;O++){if(f+=d[O],f===0)continue;const D=h-f;if(D===0)break;g+=O*d[O];const V=g/f,A=(m-g)/D,G=f*D*(V-A)*(V-A);G>$&&($=G,v=O)}let b=0;for(let O=0;O<=v;O++)b+=d[O];const w=b<=h/2,k=O=>w?O<=v:O>v,S=Math.round(o*.08),T=new Int32Array(u);for(let O=0;O<u;O++){let D=0;const V=O*o;for(let A=S;A<o-S;A++)k(c(V+A))&&D++;T[O]=D}const E=Math.max(4,Math.round(o*.03)),C=[];let x=!1,M=0;for(let O=0;O<u;O++){const D=T[O]>=E;if(D&&!x)x=!0,M=O;else if(!D&&x){x=!1;const V=O-M;V>=11&&C.push({startY:M,height:V})}}if(x){const O=u-M;O>=11&&C.push({startY:M,height:O})}if(C.length<=1)return[r];const U=[];if(!w){const D=Math.ceil(o/8),V=Math.ceil(u/8),A=new Int32Array(D*V),G=new Int32Array(D*V);for(let Y=0;Y<u;Y++){const N=Y/8|0,Q=Y*o;for(let K=0;K<o;K++){const ee=N*D+(K/8|0);G[ee]++,k(c(Q+K))&&A[ee]++}}const F=new Uint8Array(D*V);for(let Y=0;Y<D*V;Y++)G[Y]>0&&A[Y]/G[Y]>=.85&&(F[Y]=1);const L=new Int16Array(D*V).fill(-1);let re=0;const ae=[];for(let Y=0;Y<D*V;Y++){if(!F[Y]||L[Y]>=0)continue;let N=D,Q=-1,K=V,ee=-1;const me=[Y];for(L[Y]=re;me.length;){const xe=me.pop(),Z=xe/D|0,te=xe%D;te<N&&(N=te),te>Q&&(Q=te),Z<K&&(K=Z),Z>ee&&(ee=Z);const ne=[Z>0?xe-D:-1,Z<V-1?xe+D:-1,te>0?xe-1:-1,te<D-1?xe+1:-1];for(const X of ne)X>=0&&F[X]&&L[X]<0&&(L[X]=re,me.push(X))}ae.push({cx0:N,cx1:Q,cy0:K,cy1:ee}),re++}for(const Y of ae)Y.cx1-Y.cx0+1>=4&&Y.cy1-Y.cy0+1>=4&&U.push({x0:Y.cx0*8,x1:Math.min(o-1,(Y.cx1+1)*8),y0:Y.cy0*8,y1:Math.min(u-1,(Y.cy1+1)*8)})}return C.flatMap(O=>{const D=O.startY,V=O.startY+O.height,A=U.filter(N=>N.y0<V&&N.y1>D),G=new Uint8Array(o);for(let N=0;N<O.height;N++){const K=(O.startY+N)*o;for(let ee=0;ee<o;ee++)k(c(K+ee))&&(G[ee]=1)}for(const N of A)for(let Q=N.x0;Q<=N.x1&&Q<o;Q++)G[Q]=0;let F=o,L=-1;for(let N=0;N<o;N++)G[N]&&(N<F&&(F=N),N>L&&(L=N));let re;if(F>L)re=[{x0:0,x1:o-1}];else{re=[{x0:F,x1:L}];for(const N of A){const Q=[];for(const K of re){if(N.x1<K.x0||N.x0>K.x1){Q.push(K);continue}N.x0>K.x0&&Q.push({x0:K.x0,x1:N.x0-1}),N.x1<K.x1&&Q.push({x0:N.x1+1,x1:K.x1})}re=Q}re.length===0&&re.push({x0:0,x1:o-1})}A.length===0&&re.length===1&&re[0].x1-re[0].x0<o*.5&&(re[0]={x0:0,x1:o-1});const ae=6,Y=re.filter(N=>N.x1-N.x0>=10);return Y.length===0&&Y.push({x0:0,x1:o-1}),Y.map(N=>{const Q=ir.clampBox({x:Math.max(r.x,r.x+N.x0-ae),y:r.y+O.startY,width:N.x1-N.x0+1+ae*2,height:O.height,confidence:r.confidence},i,n);return Q.kind=r.kind,Q})})}catch{return[r]}}}class Sc{session;inputSize=640;textBubbleThresh=.15;textFreeThresh=.07;bubbleFallbackThresh=.3;constructor(t){this.session=t}async release(){await this.session.release?.()}async detectText(t,r,i){const a=new OffscreenCanvas(this.inputSize,this.inputSize).getContext("2d");if(!a)throw new Error("Không thể tạo context 2D cho ComicDetEngine");a.drawImage(t,0,0,this.inputSize,this.inputSize);const o=a.getImageData(0,0,this.inputSize,this.inputSize).data,u=this.inputSize*this.inputSize,d=new Float32Array(3*u);for(let C=0;C<u;C++){const x=C*4;d[C]=o[x]/255,d[u+C]=o[x+1]/255,d[2*u+C]=o[x+2]/255}const c=new Ve("float32",d,[1,3,this.inputSize,this.inputSize]),h=new Ve("int64",new BigInt64Array([BigInt(r),BigInt(i)]),[1,2]),m={images:c,orig_target_sizes:h};let g=null,f,$,v;try{g=await this.session.run(m),f=Array.from(g.labels.data),$=new Float32Array(g.boxes.data),v=new Float32Array(g.scores.data)}finally{if(c.dispose?.(),h.dispose?.(),g)for(const C of Object.values(g))C.dispose?.()}const b=v.length,w=[],k=[];for(let C=0;C<b;C++){const x=v[C],M=Number(f[C]),U=Math.max(0,Math.round($[C*4+0])),O=Math.max(0,Math.round($[C*4+1])),D=Math.min(r,Math.round($[C*4+2])),V=Math.min(i,Math.round($[C*4+3])),A=D-U,G=V-O;if(A<8||G<8||A>=r*.98&&G>=i*.95)continue;const F={x:U,y:O,width:A,height:G,confidence:x};M===1&&x>=this.textBubbleThresh?(F.kind="dialogue",w.push(F)):M===2&&x>=this.textFreeThresh?(F.kind="sfx",w.push(F)):M===0&&x>=this.bubbleFallbackThresh&&k.push(F)}for(const C of k)if(!w.some(M=>M.x>=C.x-12&&M.y>=C.y-12&&M.x+M.width<=C.x+C.width+12&&M.y+M.height<=C.y+C.height+12)){const M=Math.round(C.width*.08),U=Math.round(C.height*.08);w.push({x:C.x+M,y:C.y+U,width:Math.max(12,C.width-M*2),height:Math.max(12,C.height-U*2),confidence:C.confidence,kind:"dialogue"})}const S=w,T=[],E=t.getContext("2d");for(const C of S){if(C.height>=34&&C.width>=28&&E){const x=ca.segmentLines(E,C,r,i);if(x.length>0){T.push(...x);continue}}T.push(C)}return T.sort((C,x)=>C.y-x.y)}}class yt{static shouldWarp(t){return typeof t=="number"&&Math.abs(t)>=10}static minAreaQuad(t){if(t.length<3){const[c=0,h=0]=t[0]||[];return{quad:[[c,h],[c+1,h],[c+1,h+1],[c,h+1]],angleDeg:0}}const r=this.convexHull(t);if(r.length<3){let c=1/0,h=1/0,m=-1/0,g=-1/0;for(const[f,$]of t)f<c&&(c=f),f>m&&(m=f),$<h&&(h=$),$>g&&(g=$);return{quad:[[c,h],[m,h],[m,g],[c,g]],angleDeg:0}}let i=1/0,n=[];for(let c=0;c<r.length;c++){const[h,m]=r[c],[g,f]=r[(c+1)%r.length],$=g-h,v=f-m,b=Math.hypot($,v);if(b<1e-6)continue;const w=$/b,k=v/b,S=-k,T=w;let E=1/0,C=-1/0,x=1/0,M=-1/0;for(const[O,D]of r){const V=O*w+D*k,A=O*S+D*T;V<E&&(E=V),V>C&&(C=V),A<x&&(x=A),A>M&&(M=A)}const U=(C-E)*(M-x);U<i&&(i=U,n=[[E*w+x*S,E*k+x*T],[C*w+x*S,C*k+x*T],[C*w+M*S,C*k+M*T],[E*w+M*S,E*k+M*T]])}const a=this.orderCornersTLTRBRBL(n),s=Math.hypot(a[1][0]-a[0][0],a[1][1]-a[0][1]),o=Math.hypot(a[3][0]-a[0][0],a[3][1]-a[0][1]);let u;s>=o?u=Math.atan2(a[1][1]-a[0][1],a[1][0]-a[0][0]):u=Math.atan2(a[2][1]-a[1][1],a[2][0]-a[1][0])-Math.PI/2;let d=u*180/Math.PI;for(;d>45;)d-=90;for(;d<-45;)d+=90;return{quad:a,angleDeg:d}}static unclipQuad(t,r){const i=Math.hypot(t[1][0]-t[0][0],t[1][1]-t[0][1]),n=Math.hypot(t[3][0]-t[0][0],t[3][1]-t[0][1]),a=i*n,s=Math.max(1,2*(i+n)),o=Math.max(3,Math.min(18,a*r/s)),u=(t[0][0]+t[1][0]+t[2][0]+t[3][0])*.25,d=(t[0][1]+t[1][1]+t[2][1]+t[3][1])*.25,c=i>1e-6?(t[1][0]-t[0][0])/i:1,h=i>1e-6?(t[1][1]-t[0][1])/i:0,m=n>1e-6?(t[3][0]-t[0][0])/n:0,g=n>1e-6?(t[3][1]-t[0][1])/n:1,f=i*.5+o,$=n*.5+o;return[[u-f*c-$*m,d-f*h-$*g],[u+f*c-$*m,d+f*h-$*g],[u+f*c+$*m,d+f*h+$*g],[u-f*c+$*m,d-f*h+$*g]]}static warpQuadToHorizontal(t,r){const i=Math.hypot(r[1][0]-r[0][0],r[1][1]-r[0][1]),n=Math.hypot(r[2][0]-r[3][0],r[2][1]-r[3][1]),a=Math.hypot(r[3][0]-r[0][0],r[3][1]-r[0][1]),s=Math.hypot(r[2][0]-r[1][0],r[2][1]-r[1][1]),o=Math.max(4,Math.round((i+n)*.5)),u=Math.max(4,Math.round((a+s)*.5));if(o<4||u<4)return null;const d=new Uint8ClampedArray(o*u*4),{data:c,width:h,height:m}=t;for(let g=0;g<u;g++){const f=u>1?g/(u-1):0,$=r[0][0]+(r[3][0]-r[0][0])*f,v=r[0][1]+(r[3][1]-r[0][1])*f,b=r[1][0]+(r[2][0]-r[1][0])*f,w=r[1][1]+(r[2][1]-r[1][1])*f;for(let k=0;k<o;k++){const S=o>1?k/(o-1):0,T=Math.max(0,Math.min(h-1.001,$+(b-$)*S)),E=Math.max(0,Math.min(m-1.001,v+(w-v)*S)),C=T|0,x=E|0,M=T-C,U=E-x,O=Math.min(h-1,C+1),D=Math.min(m-1,x+1),V=(x*h+C)*4,A=(x*h+O)*4,G=(D*h+C)*4,F=(D*h+O)*4,L=(1-M)*(1-U),re=M*(1-U),ae=(1-M)*U,Y=M*U,N=(g*o+k)*4;d[N]=c[V]*L+c[A]*re+c[G]*ae+c[F]*Y,d[N+1]=c[V+1]*L+c[A+1]*re+c[G+1]*ae+c[F+1]*Y,d[N+2]=c[V+2]*L+c[A+2]*re+c[G+2]*ae+c[F+2]*Y,d[N+3]=255}}return{data:d,width:o,height:u}}static pointInQuad(t,r,i){if(i.length<4)return!0;let n=0,a=0;for(let s=0;s<4;s++){const[o,u]=i[s],[d,c]=i[s+1&3],h=(d-o)*(r-u)-(c-u)*(t-o);if(h>1e-6?n++:h<-1e-6&&a++,n>0&&a>0)return!1}return!0}static convexHull(t){const r=[...t].sort((s,o)=>s[0]!==o[0]?s[0]-o[0]:s[1]-o[1]),i=(s,o,u)=>(o[0]-s[0])*(u[1]-s[1])-(o[1]-s[1])*(u[0]-s[0]),n=[];for(const s of r){for(;n.length>=2&&i(n[n.length-2],n[n.length-1],s)<=0;)n.pop();n.push(s)}const a=[];for(let s=r.length-1;s>=0;s--){const o=r[s];for(;a.length>=2&&i(a[a.length-2],a[a.length-1],o)<=0;)a.pop();a.push(o)}return n.pop(),a.pop(),n.concat(a)}static orderCornersTLTRBRBL(t){const r=[...t].sort((a,s)=>a[1]-s[1]),i=r.slice(0,2).sort((a,s)=>a[0]-s[0]),n=r.slice(2,4).sort((a,s)=>a[0]-s[0]);return[i[0],i[1],n[1],n[0]]}}class Tc{session;thresh=.2;boxThresh=.22;unclipRatio=1.65;lastProbMap=null;constructor(t,r){this.session=t,r?.thresh!==void 0&&(this.thresh=r.thresh),r?.boxThresh!==void 0&&(this.boxThresh=r.boxThresh),r?.unclipRatio!==void 0&&(this.unclipRatio=r.unclipRatio)}async release(){await this.session.release?.()}async detectText(t,r,i){const{targetW:n,targetH:a,ratioW:s,ratioH:o}=ir.calculateDetResize(r,i),d=new OffscreenCanvas(n,a).getContext("2d");if(!d)throw new Error("Khong the khoi tao OffscreenCanvas 2D context");d.drawImage(t,0,0,n,a);const c=d.getImageData(0,0,n,a),h=ir.imageToDetTensor(c,n,a),m={},g=this.session.inputNames[0]||"x";m[g]=h;let f=null,$;try{f=await this.session.run(m);const k=this.session.outputNames[0],S=f[k];$=new Float32Array(S.data)}finally{if(h.dispose?.(),f)for(const k of Object.values(f))k.dispose?.()}this.lastProbMap={data:$,w:n,h:a,ratioW:s,ratioH:o};const v=this.extractBoxes($,n,a),b=[];for(const k of v){if(k.confidence&&k.confidence<this.boxThresh)continue;let S,T,E,C,x;if(k.quad&&yt.shouldWarp(k.angleDeg)){const D=k.quad.map(([F,L])=>[F/s,L/o]);x=yt.unclipQuad(D,this.unclipRatio).map(([F,L])=>[Math.max(0,Math.min(r-1,Math.round(F))),Math.max(0,Math.min(i-1,Math.round(L)))]);const A=x.map(F=>F[0]),G=x.map(F=>F[1]);S=Math.min(...A),T=Math.min(...G),E=Math.max(...A)-S,C=Math.max(...G)-T}else{const D=k.width*k.height,V=2*(k.width+k.height),A=Math.max(3,Math.min(18,D*this.unclipRatio/Math.max(1,V))),G=k.x+k.width/2,F=k.y+k.height/2,L=k.width+A*2,re=k.height+A*2;S=Math.round((G-L/2)/s),T=Math.round((F-re/2)/o),E=Math.round(L/s),C=Math.round(re/o)}const M=ir.clampBox({x:S,y:T,width:E,height:C,confidence:k.confidence},r,i);M.kind=k.kind,x&&(M.quad=x,M.angleDeg=k.angleDeg);const U=M.width<8||M.height<8,O=M.width>=r*.98&&M.height>=i*.94;!U&&!O&&b.push(M)}return this.mergeHorizontalBoxes(b,r).sort((k,S)=>k.y-S.y)}mergeHorizontalBoxes(t,r){if(t.length<=1)return t;let i=[...t],n=!0;for(;n;){n=!1;const a=[],s=new Set;for(let o=0;o<i.length;o++){if(s.has(o))continue;let u={...i[o]};for(let d=o+1;d<i.length;d++){if(s.has(d))continue;const c=i[d];if(yt.shouldWarp(u.angleDeg)||yt.shouldWarp(c.angleDeg))continue;const h=u.y,m=u.y+u.height,g=c.y,f=c.y+c.height,$=Math.max(0,Math.min(m,f)-Math.max(h,g)),v=Math.min(u.height,c.height);if($/Math.max(1,v)>=.4){const w=u.x,k=u.x+u.width,S=c.x,T=c.x+c.width,E=Math.max(0,Math.max(w,S)-Math.min(k,T)),C=Math.max(u.height,c.height)*.85,x=Math.min(w,S),U=Math.max(k,T)-x;if(E<=C&&U<=r*.96){const O=Math.min(h,g),D=Math.max(m,f);u={x,y:O,width:U,height:D-O,confidence:Math.max(u.confidence||0,c.confidence||0),kind:u.kind??c.kind},s.add(d),n=!0}}}a.push(u)}i=a}return i}extractBoxes(t,r,i){const n=new Uint8Array(r*i),a=[];for(let s=0;s<i;s++)for(let o=0;o<r;o++){const u=s*r+o;if(n[u]||t[u]<this.thresh)continue;let d=o,c=o,h=s,m=s,g=0,f=0;const $=[],v=[u];for(n[u]=1;v.length>0;){const k=v.pop(),S=Math.floor(k/r),T=k%r;g+=t[k],f++,T<d&&(d=T),T>c&&(c=T),S<h&&(h=S),S>m&&(m=S);const E=[S>0?(S-1)*r+T:-1,S<i-1?(S+1)*r+T:-1,T>0?S*r+(T-1):-1,T<r-1?S*r+(T+1):-1];let C=!1;for(const x of E)x<0||t[x]<this.thresh?C=!0:n[x]||(n[x]=1,v.push(x));C&&$.length<512&&$.push([T,S])}const b=c-d+1,w=m-h+1;if(b>=5&&w>=5&&f>=6){const k={x:d,y:h,width:b,height:w,confidence:g/f,kind:"dialogue"};if($.length>=8){const{quad:S,angleDeg:T}=yt.minAreaQuad($);yt.shouldWarp(T)&&(k.quad=S,k.angleDeg=T)}a.push(k)}}return a}}class n1{static analyzeRegion(t,r=.18){const i=t.width,n=t.height;if(i<=0||n<=0||t.data.length<i*n*4)return{isDark:!1,bgHex:"#ffffff",luma:255,lumaStdDev:0};const a=Math.max(1,Math.round(Math.min(i,n)*r)),s=[],o=[],u=[],d=[],c=(v,b)=>{const w=(b*i+v)*4,k=t.data[w],S=t.data[w+1],T=t.data[w+2];s.push(k),o.push(S),u.push(T),d.push(.299*k+.587*S+.114*T)};for(let v=0;v<i;v+=3)for(let b=0;b<a;b++)c(v,b),c(v,n-1-b);for(let v=a;v<n-a;v+=3)for(let b=0;b<a;b++)c(b,v),c(i-1-b,v);if(d.length===0)return{isDark:!1,bgHex:"#ffffff",luma:255,lumaStdDev:0};const h=Vn(s),m=Vn(o),g=Vn(u),f=d.reduce((v,b)=>v+b,0)/d.length,$=d.reduce((v,b)=>v+(b-f)*(b-f),0)/d.length;return{isDark:f<105,bgHex:`#${Hn(h)}${Hn(m)}${Hn(g)}`,luma:f,lumaStdDev:Math.sqrt($)}}}function Vn(e){const t=e.slice().sort((i,n)=>i-n),r=t.length>>1;return t.length%2===0?Math.round((t[r-1]+t[r])/2):t[r]}function Hn(e){return Math.max(0,Math.min(255,e)).toString(16).padStart(2,"0")}class Ir{static BUCKETS=[64,128,256,512,960];static MAX_BATCH=8;static assignBuckets(t,r=Ir.BUCKETS){const i=new Map,n=r[r.length-1];for(let a=0;a<t.length;a++){let s=n;for(const u of r)if(t[a]<=u){s=u;break}const o=i.get(s);o?o.push(a):i.set(s,[a])}return i}static concatTensors(t,r,i,n){const a=n*i,s=new Float32Array(t.length*3*a);for(let o=0;o<t.length;o++){const u=Math.min(r[o],i),d=n*u,c=o*3*a;for(let h=0;h<3;h++){const m=h*d,g=c+h*a;for(let f=0;f<n;f++)s.set(t[o].subarray(m+f*u,m+f*u+u),g+f*i)}}return s}}function a1(e){const t=e.replace(/(?:\r?\n)+$/,"");if(!t)return[" "];const r=t.split(/\r?\n/);for(;r.length>0&&r[0]==="";)r.shift();return r.length===0?[" "]:(r[r.length-1]!==" "&&r.push(" "),r)}class Cr{session;characters;targetH=48;isCjkModel;batchSupported=!0;constructor(t,r,i){this.session=t,this.isCjkModel=i?.isCjkModel??!1,this.characters=a1(r)}async release(){await this.session.release?.()}async recognizeBoxes(t,r){if(!t.getContext("2d"))return[];const n=[];for(let o=0;o<r.length;o++){const u=this.prepareCrop(t,r[o],o);u&&n.push(u)}const a=this.session.inputNames[0]||"x";if(this.batchSupported)try{await this.runBatched(n,a)}catch(o){this.batchSupported=!1,console.warn("[SpeedySlate] Rec batch inference unsupported, using sequential path:",o)}this.batchSupported||await this.runSequential(n,a),await this.retryLowConfidence(n,a);const s=[];for(const o of n){if(!o.decoded)continue;const u=o.text.replace(/\s+/g," ").trim(),d=/[\p{L}\p{N}]/u.test(u),c=u.length<=2&&o.confidence<.65;u.length>0&&d&&!c&&o.confidence>.28&&s.push({id:`bubble-${Date.now()}-${o.index}`,box:o.box,originalText:u,isDarkBackground:o.isDark,confidence:o.confidence,bgColor:o.bgColor,kind:o.box.kind??"dialogue",...o.isVertical?{isVertical:!0}:{}})}return s}prepareCrop(t,r,i){const s=Math.max(0,r.x-5),o=Math.max(0,r.y-2),u=Math.max(1,Math.min(t.width-s,r.width+10)),d=Math.max(1,Math.min(t.height-o,r.height+4));let c=new OffscreenCanvas(u,d),h=c.getContext("2d");if(!h)return null;h.drawImage(t,s,o,u,d,0,0,u,d);let m=h.getImageData(0,0,u,d);if(r.quad&&r.quad.length===4&&yt.shouldWarp(r.angleDeg)){const x=r.quad.map(([U,O])=>[U-s,O-o]),M=yt.warpQuadToHorizontal(m,x);if(M){if(c=new OffscreenCanvas(M.width,M.height),h=c.getContext("2d"),!h)return null;m=new ImageData(new Uint8ClampedArray(M.data),M.width,M.height),h.putImageData(m,0,0)}}m.width>=16&&m.height>=12&&(Cr.cleanCropToMask(m),h.putImageData(m,0,0));const g=Lo.isVerticalCandidate(r,this.isCjkModel);let f=m.width,$=m.height,v=null;if(g){const x=Lo.rotateCropCCW(m);v=new OffscreenCanvas(x.width,x.height);const M=v.getContext("2d");if(!M)return null;const U=new Uint8ClampedArray(x.data);M.putImageData(new ImageData(U,x.width,x.height),0,0),f=x.width,$=x.height}const b=f/$;let w=Math.max(32,Math.min(960,Math.round(this.targetH*b)));w=Math.round(w/8)*8;const S=new OffscreenCanvas(w,this.targetH).getContext("2d");if(!S)return null;v?S.drawImage(v,0,0,f,$,0,0,w,this.targetH):S.drawImage(c,0,0,f,$,0,0,w,this.targetH);const T=S.getImageData(0,0,w,this.targetH),E=n1.analyzeRegion(T),C=E.isDark;return C&&Cr.invertRgb(T.data),{index:i,box:r,imageData:T,targetW:w,inverted:C,isDark:E.isDark,bgColor:E.bgHex,isVertical:g,text:"",confidence:0,decoded:!1}}async runBatched(t,r){const i=Ir.assignBuckets(t.map(n=>n.targetW));for(const[n,a]of i)for(let s=0;s<a.length;s+=Ir.MAX_BATCH){const o=a.slice(s,s+Ir.MAX_BATCH).map(c=>t[c]),u=ir.imageToRecTensorBatch(o.map(c=>c.imageData),n,this.targetH);let d=null;try{d=await this.session.run({[r]:u});const c=d[this.session.outputNames[0]],h=c.dims;if(h.length!==3)throw new Error(`Unexpected rec output dims: ${h.join("x")}`);const m=h[1],g=h[2],f=m*g,$=c.data;for(let v=0;v<o.length;v++){const b=$.subarray(v*f,(v+1)*f),w=this.ctcDecode(b,[1,m,g]);o[v].text=w.text,o[v].confidence=w.confidence,o[v].decoded=!0}}finally{if(u.dispose?.(),d)for(const c of Object.values(d))c.dispose?.()}}}async runSequential(t,r){for(const i of t)if(!i.decoded)try{const n=await this.runSingle(i,r);i.text=n.text,i.confidence=n.confidence,i.decoded=!0}catch(n){console.warn("[SpeedySlate] Rec inference error for box:",n)}}async runSingle(t,r){const i=ir.imageToRecTensor(t.imageData,t.targetW,this.targetH);let n=null;try{n=await this.session.run({[r]:i});const a=n[this.session.outputNames[0]];return this.ctcDecode(a.data,a.dims)}finally{if(i.dispose?.(),n)for(const a of Object.values(n))a.dispose?.()}}async retryLowConfidence(t,r){for(const i of t){if(!i.decoded||i.confidence>=.45)continue;const n=new ImageData(new Uint8ClampedArray(i.imageData.data),i.imageData.width,i.imageData.height);Cr.invertRgb(n.data);try{const a=await this.runSingle({...i,imageData:n},r);a.confidence>i.confidence&&(i.text=a.text,i.confidence=a.confidence,i.inverted=!i.inverted)}catch(a){console.warn("[SpeedySlate] Rec retry error for box:",a)}}}static cleanCropToMask(t){const r=t.data,i=t.width*t.height,n=new Uint8Array(i),a=new Int32Array(256);for(let O=0;O<i;O++){const D=O*4,A=(r[D]*299+r[D+1]*587+r[D+2]*114)/1e3|0;n[O]=A,a[A]++}let s=0;for(let O=0;O<256;O++)s+=O*a[O];let o=0,u=0,d=-1,c=128;for(let O=0;O<256;O++){if(u+=a[O],u===0)continue;const D=i-u;if(D===0)break;o+=O*a[O];const V=o/u,A=(s-o)/D,G=u*D*(V-A)*(V-A);G>d&&(d=G,c=O)}let h=0;for(let O=0;O<=c;O++)h+=a[O];if(c<20||c>235)return;const m=Math.min(h,i-h);if(m<i*.02||m>i*.45)return;const g=h<=i/2;let f=0,$=0,v=0,b=0,w=0,k=0;for(let O=0;O<i;O++){if(g?n[O]<=c:n[O]>c)continue;const V=O*4;f+=r[V],$+=r[V+1],v+=r[V+2],b+=n[O],w+=n[O]*n[O],k++}if(k===0||Math.sqrt(Math.max(0,w/k-(b/k)**2))<=30)return;const T=f/k,E=$/k,C=v/k,x=t.width,M=t.height,U=new Uint8Array(i);for(let O=0;O<i;O++)U[O]=(g?n[O]<=c:n[O]>c)?1:0;for(let O=0;O<M;O++)for(let D=0;D<x;D++){const V=O*x+D;if(U[V]){let G=0;for(let F=-1;F<=1;F++)for(let L=-1;L<=1;L++){if(!L&&!F)continue;const re=D+L,ae=O+F;re>=0&&re<x&&ae>=0&&ae<M&&U[ae*x+re]&&G++}if(G>=3)continue}const A=V*4;r[A]=T,r[A+1]=E,r[A+2]=C}}static invertRgb(t){for(let r=0;r<t.length;r+=4)t[r]=255-t[r],t[r+1]=255-t[r+1],t[r+2]=255-t[r+2]}ctcDecode(t,r){let i=0,n=0;if(r.length===3)i=r[1],n=r[2];else return{text:"",confidence:0};let a=[],s=-1,o=0,u=0;for(let c=0;c<i;c++){let h=-1/0,m=0;const g=c*n;for(let f=0;f<n;f++){const $=t[g+f];$>h&&(h=$,m=f)}if(m!==0&&m!==s){const f=m-1;f<this.characters.length&&(a.push(this.characters[f]),o+=h,u++)}s=m}const d=u>0?o/u:0;return{text:a.join(""),confidence:d}}}class Fn{static computeSliceHeights(t,r,i={}){const n=i.maxSliceHeight??2e3,a=i.overlap??200,s=i.aspectCap!==void 0?Math.min(n,Math.max(640,Math.round(t*i.aspectCap))):n;if(r<=s+200)return[{startY:0,h:r}];const o=Math.max(1,s-a),u=[];for(let d=0;d<r;d+=o)u.push({startY:d,h:Math.min(s,r-d)});return u}static async detectWithSlicing(t,r,i,n,a={}){const s=this.computeSliceHeights(r,i,a),o=await this.detectSlices(t,r,i,n,s,a.overlap??200,a.textMapOut);if(a.invertedPass){const u=this.findDarkRanges(t,r,i,o);if(u.length>0){const d=this.buildInverted(t,r,i),c=await this.detectSlices(d,r,i,n,u,0,a.textMapOut);for(const h of c)o.some(g=>this.calculateIoU(g,h)>.5)||o.push(h)}}return o.sort((u,d)=>u.y-d.y)}static async detectSlices(t,r,i,n,a,s,o){if(a.length===1&&a[0].h===i){const d=await n.detectText(t,r,i);return this.blitProbMap(n,o,r,0),d}const u=[];for(const d of a){const c=new OffscreenCanvas(r,d.h),h=c.getContext("2d");if(!h)continue;h.drawImage(t,0,d.startY,r,d.h,0,0,r,d.h);const m=await n.detectText(c,r,d.h);this.blitProbMap(n,o,r,d.startY);for(const g of m){const f={x:g.x,y:d.startY+g.y,width:g.width,height:g.height,confidence:g.confidence,kind:g.kind,...g.quad?{quad:g.quad.map(([$,v])=>[$,d.startY+v]),angleDeg:g.angleDeg}:{}};d.startY>0&&g.y<s+40&&u.some(v=>this.calculateIoU(v,f)>.35)||u.push(f)}}return u}static blitProbMap(t,r,i,n){const a=t.lastProbMap;if(!a||!r)return;const s=Math.round(a.h/a.ratioH),o=Math.min(i,Math.round(a.w/a.ratioW));for(let u=0;u<s;u++){const d=n+u;if(d*i>=r.length)break;const c=Math.min(a.h-1,Math.floor(u*a.ratioH)),h=d*i,m=c*a.w;for(let g=0;g<o;g++){const f=Math.min(a.w-1,Math.floor(g*a.ratioW)),$=a.data[m+f];$>r[h+g]&&(r[h+g]=$)}}}static findDarkRanges(t,r,i,n){const a=t.getContext("2d");if(!a)return[];const s=16,o=Math.ceil(r/s),u=Math.ceil(i/s),d=a.getImageData(0,0,r,i).data,c=new Int32Array(u);let h=0;for(let $=0;$<u;$++){const v=Math.min(i-1,$*s+(s>>1));for(let b=0;b<o;b++){const w=Math.min(r-1,b*s+(s>>1)),k=(v*r+w)*4;(d[k]*299+d[k+1]*587+d[k+2]*114)/1e3>=90||n.some(E=>w>=E.x&&w<=E.x+E.width&&v>=E.y&&v<=E.y+E.height)||(c[$]++,h++)}}if(h<8)return[];const m=[];let g=-1,f=-1;for(let $=0;$<=u;$++)if($<u&&c[$]>=2)g<0&&(g=$),f=$;else if(g>=0&&($===u||$-f>5)){const b=g*s,w=(f+1)*s-b;w>=48&&m.push({startY:b,h:Math.min(w,i-b)}),g=-1}return m}static buildInverted(t,r,i){const n=t.getContext("2d"),a=new OffscreenCanvas(r,i),s=a.getContext("2d");if(!n||!s)return t;const o=n.getImageData(0,0,r,i),u=o.data;for(let d=0;d<u.length;d+=4)u[d]=255-u[d],u[d+1]=255-u[d+1],u[d+2]=255-u[d+2];return s.putImageData(o,0,0),a}static calculateIoU(t,r){const i=Math.max(0,Math.min(t.x+t.width,r.x+r.width)-Math.max(t.x,r.x)),n=Math.max(0,Math.min(t.y+t.height,r.y+r.height)-Math.max(t.y,r.y)),a=i*n;if(a<=0)return 0;const s=t.width*t.height,o=r.width*r.height,u=s+o-a;return u>0?a/u:0}}function jn(e,t,r,i,n=!1){const a=new Uint8Array(i);let s=0;for(let v=0;v<i;v++)s+=e[v];if(s===0)return null;const o=s>i*.25;if(o)for(let v=0;v<r;v++)for(let b=0;b<t;b++){const w=v*t+b;if(!e[w])continue;let k=0;for(let S=-1;S<=1;S++)for(let T=-1;T<=1;T++){if(!T&&!S)continue;const E=b+T,C=v+S;E>=0&&E<t&&C>=0&&C<r&&e[C*t+E]&&k++}k>=3&&(a[w]=1)}else a.set(e);let u=0;for(let v=0;v<i;v++)u+=a[v];u===0&&a.set(e);const d=new Int32Array(i).fill(-1),c=[],h=[],m=[],g=new Int32Array(i);for(let v=0;v<i;v++){if(!a[v]||d[v]>=0)continue;const b=c.length;let w=0,k=0,S=0,T=t,E=0,C=r,x=0;for(d[v]=b,g[k++]=v;w<k;){const M=g[w++],U=M%t,O=M/t|0;S++,U<T&&(T=U),U>E&&(E=U),O<C&&(C=O),O>x&&(x=O),U>0&&a[M-1]&&d[M-1]<0&&(d[M-1]=b,g[k++]=M-1),U<t-1&&a[M+1]&&d[M+1]<0&&(d[M+1]=b,g[k++]=M+1),O>0&&a[M-t]&&d[M-t]<0&&(d[M-t]=b,g[k++]=M-t),O<r-1&&a[M+t]&&d[M+t]<0&&(d[M+t]=b,g[k++]=M+t)}c.push(S),h.push(E-T+1),m.push(x-C+1)}const f=n?i*.5:Math.min(700,i*.25);let $=0;for(let v=0;v<i;v++){const b=d[v];if(b<0)continue;const w=!n&&o&&(h[b]>t*.8&&m[b]<r*.5||m[b]>r*.8&&h[b]<t*.5);c[b]>f||w||o&&!n&&c[b]<5?a[v]=0:$++}return $>0?a:null}function Ic(e,t,r,i,n,a=4){const s=i*n,o=new Uint8Array(s);for(let f=0;f<s;f++)o[f]=!r[f]&&Math.abs(e[f]-t)>60?1:0;for(let f=0;f<5;f++){const $=o.slice();for(let v=0;v<n;v++)for(let b=0;b<i;b++){const w=v*i+b;$[w]||(b>0&&$[w-1]||b<i-1&&$[w+1]||v>0&&$[w-i]||v<n-1&&$[w+i])&&(o[w]=1)}}const u=new Uint8Array(s),d=new Int32Array(s);let c=0,h=0;const m=f=>{o[f]&&!u[f]&&(u[f]=1,d[h++]=f)};for(let f=0;f<i;f++)m(f),m((n-1)*i+f);for(let f=0;f<n;f++)m(f*i),m(f*i+i-1);for(;c<h;){const f=d[c++],$=f%i,v=f/i|0;$>0&&m(f-1),$<i-1&&m(f+1),v>0&&m(f-i),v<n-1&&m(f+i)}const g=u.slice();for(let f=0;f<a;f++){const $=g.slice();for(let v=0;v<n;v++)for(let b=0;b<i;b++){const w=v*i+b;$[w]||(b>0&&$[w-1]||b<i-1&&$[w+1]||v>0&&$[w-i]||v<n-1&&$[w+i])&&(g[w]=1)}}return g}const Ne=0,Cc=1,Kn=2,pa=1e6,ii=1e-6;class s1{keys;idxs;size=0;constructor(t){const r=Math.max(32,t);this.keys=new Float32Array(r),this.idxs=new Int32Array(r)}push(t,r){if(this.size>=this.keys.length){const n=this.keys.length*2,a=new Float32Array(n),s=new Int32Array(n);a.set(this.keys),s.set(this.idxs),this.keys=a,this.idxs=s}let i=this.size++;for(;i>0;){const n=i-1>>1;if(this.keys[n]<=t)break;this.keys[i]=this.keys[n],this.idxs[i]=this.idxs[n],i=n}this.keys[i]=t,this.idxs[i]=r}pop(){if(this.size===0)return-1;const t=this.idxs[0],r=this.keys[--this.size],i=this.idxs[this.size];if(this.size>0){let n=0;const a=this.size>>1;for(;n<a;){let s=(n<<1)+1;const o=s+1;if(o<this.size&&this.keys[o]<this.keys[s]&&(s=o),r<=this.keys[s])break;this.keys[n]=this.keys[s],this.idxs[n]=this.idxs[s],n=s}this.keys[n]=r,this.idxs[n]=i}return t}}function ni(e,t,r,i,n,a){const s=t&&n[e]===Ne,o=i&&n[r]===Ne;if(s&&o){const u=a[e],d=a[r],c=u-d,h=2-c*c;if(h>=0){const m=(u+d+Math.sqrt(h))*.5;if(m>=u&&m>=d)return m}return Math.min(u,d)+1}return s?a[e]+1:o?a[r]+1:pa}class nr{static computeDilationRadius(t){return Math.max(2,Math.min(5,Math.round(t*.1)))}static diffuseMaskedRegion(t,r,i,n,a){return nr.teleaInpaint(t,r,i,n,a,3)}static teleaInpaint(t,r,i,n,a,s=3){const o=n*a,u=new Float32Array(o*3),d=new Uint8Array(o),c=new Float32Array(o),h=new s1(o>>2);for(let f=0;f<o;f++){const $=f*4;u[f*3]=t[$],u[f*3+1]=t[$+1],u[f*3+2]=t[$+2],r[f]?(d[f]=Kn,c[f]=pa):(d[f]=Ne,c[f]=0)}for(let f=0;f<a;f++)for(let $=0;$<n;$++){const v=f*n+$;if(d[v]!==Kn)continue;($>0&&d[v-1]===Ne||$<n-1&&d[v+1]===Ne||f>0&&d[v-n]===Ne||f<a-1&&d[v+n]===Ne)&&(d[v]=Cc,c[v]=1,nr.inpaintPixel(v,$,f,n,a,s,d,c,u),h.push(1,v))}const m=[-1,1,-n,n];for(;h.size>0;){const f=h.pop();if(f<0||d[f]===Ne)continue;d[f]=Ne;const $=f%n,v=f/n|0;for(let b=0;b<4;b++){if(b===0&&$===0||b===1&&$===n-1||b===2&&v===0||b===3&&v===a-1)continue;const w=f+m[b];if(d[w]===Ne)continue;const k=w%n,S=w/n|0,T=Math.min(ni(w-n,S>0,w-1,k>0,d,c),ni(w-n,S>0,w+1,k<n-1,d,c),ni(w+n,S<a-1,w-1,k>0,d,c),ni(w+n,S<a-1,w+1,k<n-1,d,c));T<c[w]&&(c[w]=T),d[w]===Kn&&(nr.inpaintPixel(w,k,S,n,a,s,d,c,u),d[w]=Cc,h.push(c[w],w))}}const g=new Uint8ClampedArray(o*4);for(let f=0;f<o;f++){if(!i[f])continue;const $=f*4;g[$]=Math.max(0,Math.min(255,Math.round(u[f*3]))),g[$+1]=Math.max(0,Math.min(255,Math.round(u[f*3+1]))),g[$+2]=Math.max(0,Math.min(255,Math.round(u[f*3+2]))),g[$+3]=255}return g}static inpaintPixel(t,r,i,n,a,s,o,u,d){let c=0,h=0;r>0&&r<n-1&&o[t-1]===Ne&&o[t+1]===Ne?c=(u[t+1]-u[t-1])*.5:r>0&&o[t-1]===Ne?c=u[t]-u[t-1]:r<n-1&&o[t+1]===Ne&&(c=u[t+1]-u[t]),i>0&&i<a-1&&o[t-n]===Ne&&o[t+n]===Ne?h=(u[t+n]-u[t-n])*.5:i>0&&o[t-n]===Ne?h=u[t]-u[t-n]:i<a-1&&o[t+n]===Ne&&(h=u[t+n]-u[t]);const m=Math.hypot(c,h);m>ii&&(c/=m,h/=m);const g=s*s,f=Math.max(0,i-s),$=Math.min(a-1,i+s),v=Math.max(0,r-s),b=Math.min(n-1,r+s);let w=0,k=0,S=0,T=0;const E=u[t]<pa?u[t]:1;for(let C=f;C<=$;C++){const x=i-C;for(let M=v;M<=b;M++){const U=r-M,O=U*U+x*x;if(O===0||O>g)continue;const D=C*n+M;if(o[D]!==Ne)continue;const V=Math.sqrt(O),A=m>ii?Math.max(ii,Math.abs(U*c+x*h)/V):1,G=1/(O*V),F=1/(1+Math.abs(E-u[D])),L=A*G*F,re=D*3;let ae=0,Y=0,N=0;M>0&&M<n-1&&o[D-1]===Ne&&o[D+1]===Ne&&(ae=Math.max(-40,Math.min(40,(d[re+3]-d[re-3])*.5)),Y=Math.max(-40,Math.min(40,(d[re+4]-d[re-2])*.5)),N=Math.max(-40,Math.min(40,(d[re+5]-d[re-1])*.5)));let Q=0,K=0,ee=0;if(C>0&&C<a-1&&o[D-n]===Ne&&o[D+n]===Ne){const me=(D-n)*3,xe=(D+n)*3;Q=Math.max(-40,Math.min(40,(d[xe]-d[me])*.5)),K=Math.max(-40,Math.min(40,(d[xe+1]-d[me+1])*.5)),ee=Math.max(-40,Math.min(40,(d[xe+2]-d[me+2])*.5))}w+=L*(d[re]+ae*U+Q*x),k+=L*(d[re+1]+Y*U+K*x),S+=L*(d[re+2]+N*U+ee*x),T+=L}}T>ii&&(d[t*3]=w/T,d[t*3+1]=k/T,d[t*3+2]=S/T)}}class mi{static buildPatch(t,r,i,n,a,s,o){const u=t.width,d=t.height,c=u*d;if(c<16)return null;const h=t.data,m=new Uint8Array(c),g=new Int32Array(256);for(let Z=0;Z<c;Z++){const te=Z*4,ne=(h[te]*299+h[te+1]*587+h[te+2]*114)/1e3;m[Z]=ne|0,g[ne|0]++}let f=0;for(let Z=0;Z<256;Z++)f+=Z*g[Z];let $=0,v=0,b=-1,w=128;for(let Z=0;Z<256;Z++){if(v+=g[Z],v===0)continue;const te=c-v;if(te===0)break;$+=Z*g[Z];const ne=$/v,X=(f-$)/te,oe=v*te*(ne-X)*(ne-X);oe>b&&(b=oe,w=Z)}let k=0;for(let Z=0;Z<=w;Z++)k+=g[Z];const S=new Uint8ClampedArray(c*4),T=(Z,te)=>{const ne=mi.hexToRgb(te);if(!ne)return null;for(let X=0;X<c;X++){if(!Z[X])continue;const oe=X*4;S[oe]=ne[0],S[oe+1]=ne[1],S[oe+2]=ne[2],S[oe+3]=255}return{x:r,y:i,width:u,height:d,pixels:S,dbg:{path:"rawflat",guided:M}}},E=mi.hexToRgb(n),C=new Uint8Array(c);if(E){const Z=(E[0]*299+E[1]*587+E[2]*114)/1e3;for(let te=0;te<c;te++)C[te]=Math.abs(m[te]-Z)>60?1:0}else{const Z=k<=c/2;for(let te=0;te<c;te++)C[te]=(Z?m[te]<=w:m[te]>w)?1:0}const x=new Uint8Array(c);if(E){const Z=k<=c/2;for(let te=0;te<c;te++)x[te]=(Z?m[te]<=w:m[te]>w)?1:0}let M=!1;const U=new Uint8Array(c),O=new Float32Array(c);let D=128,V=0;if(a&&s){let Z=0;for(let te=0;te<c;te++){const ne=i+(te/u|0),X=r+te%u;O[te]=a[ne*s+X]||0,O[te]>V&&(V=O[te]),O[te]>.3&&Z++}if(Z>c*.01){M=!0;const te=Math.max(4,Math.min(10,Math.round(d*.16)));for(let X=0;X<c;X++)U[X]=O[X]>.1?1:0;for(let X=0;X<te;X++){const oe=U.slice();for(let pe=0;pe<d;pe++)for(let R=0;R<u;R++){const H=pe*u+R;oe[H]||(R>0&&oe[H-1]||R<u-1&&oe[H+1]||pe>0&&oe[H-u]||pe<d-1&&oe[H+u])&&(U[H]=1)}}const ne=[];for(let X=0;X<c;X++)U[X]||ne.push(m[X]);ne.sort((X,oe)=>X-oe),D=ne.length>c*.05?ne[ne.length/2|0]:E?(E[0]*299+E[1]*587+E[2]*114)/1e3:128;for(let X=0;X<c;X++)C[X]=U[X]&&Math.abs(m[X]-D)>25?1:0,U[X]||(x[X]=0)}}if(o&&o.length===4)for(let Z=0;Z<c;Z++)yt.pointInQuad(Z%u,Z/u|0,o)||(C[Z]=0,x[Z]=0);let A=jn(C,u,d,c,M);if(!A&&E&&(A=jn(x,u,d,c,M)),!A){let Z=!1;for(let X=0;X<c;X++)if(C[X]||x[X]){Z=!0;break}if(!Z)return null;const te=new Uint8Array(c);for(let X=0;X<c;X++)te[X]=C[X]|x[X];const ne=new Uint8Array(c);for(let X=0;X<d;X++)for(let oe=0;oe<u;oe++){const pe=X*u+oe;if(te[pe])for(let R=-1;R<=1;R++)for(let H=-1;H<=1;H++){const le=oe+H,Me=X+R;le>=0&&le<u&&Me>=0&&Me<d&&(ne[Me*u+le]=1)}}return T(ne,n)}const G=nr.computeDilationRadius(d),F=new Uint8Array(c);F.set(A);for(let Z=0;Z<G;Z++){const te=F.slice();for(let ne=0;ne<d;ne++)for(let X=0;X<u;X++){const oe=ne*u+X;if(te[oe])for(let pe=-1;pe<=1;pe++)for(let R=-1;R<=1;R++){const H=X+R,le=ne+pe;H>=0&&H<u&&le>=0&&le<d&&(F[le*u+H]=1)}}}const L=new Uint8Array(c);if(M){const Z=new Uint8Array(c);for(let ne=0;ne<c;ne++)Z[ne]=O[ne]>.3&&Math.abs(m[ne]-D)>40?1:0;const te=jn(Z,u,d,c,!0);if(te){L.set(te);for(let ne=0;ne<4;ne++){const X=L.slice();for(let oe=0;oe<d;oe++)for(let pe=0;pe<u;pe++){const R=oe*u+pe;if(X[R])for(let H=-1;H<=1;H++)for(let le=-1;le<=1;le++){const Me=pe+le,Pe=oe+H;Me>=0&&Me<u&&Pe>=0&&Pe<d&&(L[Pe*u+Me]=1)}}}}}const re=new Uint8Array(c);re.set(U);for(let Z=0;Z<4;Z++){const te=re.slice();for(let ne=0;ne<d;ne++)for(let X=0;X<u;X++){const oe=ne*u+X;if(te[oe])for(let pe=-1;pe<=1;pe++)for(let R=-1;R<=1;R++){const H=X+R,le=ne+pe;H>=0&&H<u&&le>=0&&le<d&&(re[le*u+H]=1)}}}const ae=new Uint8Array(c),Y=F.slice();for(let Z=0;Z<4;Z++){const te=Y.slice();for(let ne=0;ne<d;ne++)for(let X=0;X<u;X++){const oe=ne*u+X;if(te[oe])for(let pe=-1;pe<=1;pe++)for(let R=-1;R<=1;R++){const H=X+R,le=ne+pe;H>=0&&H<u&&le>=0&&le<d&&(Y[le*u+H]=1)}}}for(let Z=0;Z<c;Z++)ae[Z]=Y[Z]&&!F[Z]?1:0;let N=-1,Q=-1;const K=[];for(let Z=0;Z<c;Z++)ae[Z]&&K.push(m[Z]);if(K.length>20){K.sort((H,le)=>H-le);const Z=K[K.length/2|0];let te=0,ne=0,X=0,oe=0,pe=0,R=0;for(let H=0;H<c;H++){if(!ae[H]||Math.abs(m[H]-Z)>40)continue;const le=H*4;ne+=h[le],X+=h[le+1],oe+=h[le+2],pe+=m[H],R+=m[H]*m[H],te++}if(te>20){const H=pe/te,le=Math.sqrt(Math.max(0,R/te-H*H));let Me=0,Pe=0;for(let j=0;j<c;j++){if(!Y[j])continue;Pe++,!(M?!!L[j]:!!F[j])&&Math.abs(m[j]-Z)>40&&Me++}const De=Pe?Me/Pe:0;if(N=De,Q=le,le<20&&De<.08){const j=Ic(m,Z,Y,u,d,0);for(let he=0;he<c;he++){if(!Y[he]||j[he]&&Math.abs(m[he]-Z)>45)continue;const ve=he*4;S[ve]=ne/te,S[ve+1]=X/te,S[ve+2]=oe/te,S[ve+3]=255}return{x:r,y:i,width:u,height:d,pixels:S,dbg:{path:"flat",risky:De,std:le,guided:M}}}}}const ee={path:M?"donor-tex":"donor",guided:M,risky:N,std:Q,tmMax:V};let me=F;if(M){let Z=!1;for(let te=0;te<c;te++)if(L[te]){Z=!0;break}if(Z){const te=Ic(m,D,F,u,d),ne=L.slice();for(let X=0;X<2;X++){const oe=ne.slice();for(let pe=0;pe<d;pe++)for(let R=0;R<u;R++){const H=pe*u+R;oe[H]||(R>0&&oe[H-1]||R<u-1&&oe[H+1]||pe>0&&oe[H-u]||pe<d-1&&oe[H+u])&&(ne[H]=1)}}me=new Uint8Array(c);for(let X=0;X<c;X++){const oe=F[X]&&!L[X]&&O[X]<.12&&Math.abs(m[X]-D)>40;me[X]=oe&&te[X]&&!ne[X]?0:F[X]}}}const xe=nr.teleaInpaint(h,F,me,u,d,3);return{x:r,y:i,width:u,height:d,pixels:xe,dbg:ee}}static hexToRgb(t){return!t||!/^#[0-9a-fA-F]{6}$/.test(t)?null:[parseInt(t.slice(1,3),16),parseInt(t.slice(3,5),16),parseInt(t.slice(5,7),16)]}}class o1{static buildBubblePatch(t,r,i,n){const a=t.width,s=t.height,o=a*s,u=t.data,d=new Uint8Array(o);for(let R=0;R<o;R++){const H=R*4;d[R]=u[H]*77+u[H+1]*150+u[H+2]*29>>8}const c=[],h=Math.floor(a*.25),m=Math.ceil(a*.75),g=Math.floor(s*.25),f=Math.ceil(s*.75);for(let R=g;R<f;R++)for(let H=h;H<m;H++)c.push(d[R*a+H]);c.sort((R,H)=>R-H);const $=c.length>0?c[c.length>>1]:240,v=new Uint8Array(o);for(let R=0;R<o;R++)Math.abs(d[R]-$)>45&&(v[R]=1);const b=new Uint8Array(o);for(let R=0;R<s;R++)for(let H=0;H<a;H++){const le=R*a+H;if(v[le])for(let Me=-1;Me<=1;Me++){const Pe=R+Me;if(!(Pe<0||Pe>=s))for(let De=-1;De<=1;De++){const j=H+De;j>=0&&j<a&&(b[Pe*a+j]=1)}}}const w=new Uint8Array(o),k=new Int32Array(o);let S=0,T=0;const E=Math.floor(a*.3),C=Math.ceil(a*.7),x=Math.floor(s*.3),M=Math.ceil(s*.7);for(let R=x;R<M;R++)for(let H=E;H<C;H++){const le=R*a+H;!b[le]&&!w[le]&&(w[le]=1,k[T++]=le)}let U=0;for(;S<T;){const R=k[S++],H=R%a,le=R/a|0;(H===0||H===a-1||le===0||le===s-1)&&U++,H>0&&!b[R-1]&&!w[R-1]&&(w[R-1]=1,k[T++]=R-1),H<a-1&&!b[R+1]&&!w[R+1]&&(w[R+1]=1,k[T++]=R+1),le>0&&!b[R-a]&&!w[R-a]&&(w[R-a]=1,k[T++]=R-a),le<s-1&&!b[R+a]&&!w[R+a]&&(w[R+a]=1,k[T++]=R+a)}if(T<o*.08||U>2)return null;const D=new Uint8Array(o),V=new Int32Array(o);let A=0,G=0;const F=R=>{!w[R]&&!D[R]&&(D[R]=1,V[G++]=R)};for(let R=0;R<a;R++)F(R),F((s-1)*a+R);for(let R=0;R<s;R++)F(R*a),F(R*a+a-1);for(;A<G;){const R=V[A++],H=R%a,le=R/a|0;H>0&&!w[R-1]&&!D[R-1]&&(D[R-1]=1,V[G++]=R-1),H<a-1&&!w[R+1]&&!D[R+1]&&(D[R+1]=1,V[G++]=R+1),le>0&&!w[R-a]&&!D[R-a]&&(D[R-a]=1,V[G++]=R-a),le<s-1&&!w[R+a]&&!D[R+a]&&(D[R+a]=1,V[G++]=R+a)}let L=0,re=0,ae=0,Y=0,N=0,Q=0;for(let R=0;R<o;R++){if(!w[R]||v[R])continue;const H=d[R];re+=H,ae+=H*H;const le=R*4;Y+=u[le],N+=u[le+1],Q+=u[le+2],L++}if(L===0)return null;const K=re/L,ee=Math.sqrt(Math.max(0,ae/L-K*K));if(ee>25)return null;const me=new Uint8Array(o);if(n&&n.length>0)for(const R of n){const H=Math.max(0,Math.floor(R.x-r-25)),le=Math.max(0,Math.floor(R.y-i-25)),Me=Math.min(a,Math.ceil(R.x-r+R.width+25)),Pe=Math.min(s,Math.ceil(R.y-i+R.height+25));for(let De=le;De<Pe;De++)me.fill(1,De*a+H,De*a+Me)}else me.fill(1);let xe=0,Z=0,te=0;for(let R=0;R<o;R++){if(D[R]||!me[R])continue;xe++,v[R]&&Z++;const H=R%a,le=R/a|0;(H>0&&!me[R-1]&&!D[R-1]||H<a-1&&!me[R+1]&&!D[R+1]||le>0&&!me[R-a]&&!D[R-a]||le<s-1&&!me[R+a]&&!D[R+a])&&te++}if(xe<o*.05||Z>xe*.4||te>4)return null;const ne=new Uint8ClampedArray(o*4),X=Y/L,oe=N/L,pe=Q/L;for(let R=0;R<o;R++){if(D[R]||!me[R])continue;const H=R%a,le=R/a|0;if(H>0&&v[R-1]&&D[R-1]||H<a-1&&v[R+1]&&D[R+1]||le>0&&v[R-a]&&D[R-a]||le<s-1&&v[R+a]&&D[R+a])continue;const Me=R*4;ne[Me]=X,ne[Me+1]=oe,ne[Me+2]=pe,ne[Me+3]=255}return{x:r,y:i,width:a,height:s,pixels:ne,dbg:{path:"bubble",guided:!0,risky:Z/xe,std:ee,tmMax:0}}}}const u1=1<<20;class tr{static extractChamber(t,r,i,n){const{data:a,width:s,height:o}=t,u=s*o;if(s<20||o<20||n.width<8||n.height<8)return null;const d=Math.max(0,Math.floor(n.x-r)),c=Math.max(0,Math.floor(n.y-i)),h=Math.min(s-1,Math.ceil(n.x+n.width-r)-1),m=Math.min(o-1,Math.ceil(n.y+n.height-i)-1);if(h<=d||m<=c)return null;const g=new Uint8Array(u);for(let j=0;j<u;j++){const he=j*4;g[j]=a[he]*77+a[he+1]*150+a[he+2]*29>>8}const f=new Int32Array(16);for(let j=c;j<=m;j++)for(let he=d;he<=h;he++)f[g[j*s+he]>>4]++;let $=0;for(let j=1;j<16;j++)f[j]>f[$]&&($=j);if($>5&&$<9)return null;const v=$<=5,b=[];for(let j=c;j<=m;j++)for(let he=d;he<=h;he++){const ve=g[j*s+he];Math.abs((ve>>4)-$)<=2&&b.push(ve)}if(b.length<8)return null;b.sort((j,he)=>j-he);const w=b[b.length>>1],k=new Uint8Array(u);if(v){const j=Math.min(85,w+22);for(let he=0;he<u;he++)g[he]<=j&&(k[he]=1)}else{const j=Math.max(155,w-22);for(let he=0;he<u;he++)g[he]>=j&&(k[he]=1)}const S=new Uint8Array(u),T=new Int32Array(u);let E=0,C=0;for(let j=c;j<=m;j++)for(let he=d;he<=h;he++){const ve=j*s+he;k[ve]&&!S[ve]&&(S[ve]=1,T[C++]=ve)}if(C<12)return null;let x=s,M=o,U=0,O=0,D=0;for(;E<C;){const j=T[E++],he=j%s,ve=j/s|0;he<x&&(x=he),he>U&&(U=he),ve<M&&(M=ve),ve>O&&(O=ve),(he===0||he===s-1||ve===0||ve===o-1)&&D++,he>0&&k[j-1]&&!S[j-1]&&(S[j-1]=1,T[C++]=j-1),he<s-1&&k[j+1]&&!S[j+1]&&(S[j+1]=1,T[C++]=j+1),ve>0&&k[j-s]&&!S[j-s]&&(S[j-s]=1,T[C++]=j-s),ve<o-1&&k[j+s]&&!S[j+s]&&(S[j+s]=1,T[C++]=j+s)}const V=2*(s+o);if(D>V*.35||U-x+1>=s*.96&&O-M+1>=o*.96)return null;const A=new Uint8Array(u);E=0,C=0;const G=j=>{!S[j]&&!A[j]&&(A[j]=1,T[C++]=j)};for(let j=0;j<s;j++)G(j),G((o-1)*s+j);for(let j=0;j<o;j++)G(j*s),G(j*s+s-1);for(;E<C;){const j=T[E++],he=j%s,ve=j/s|0;he>0&&!S[j-1]&&!A[j-1]&&(A[j-1]=1,T[C++]=j-1),he<s-1&&!S[j+1]&&!A[j+1]&&(A[j+1]=1,T[C++]=j+1),ve>0&&!S[j-s]&&!A[j-s]&&(A[j-s]=1,T[C++]=j-s),ve<o-1&&!S[j+s]&&!A[j+s]&&(A[j+s]=1,T[C++]=j+s)}const F=new Uint8Array(u);for(let j=0;j<u;j++)F[j]=A[j]?0:1;const L=tr.chamferDistance(F,s,o,0),re=Math.min(U-x+1,O-M+1);let ae=Math.max(6,Math.min(14,Math.round(re*.11))),Y=tr.extractSeededCore(L,ae*3,d,c,h,m,s,o);if(!Y&&ae>5&&(ae=Math.max(4,ae>>1),Y=tr.extractSeededCore(L,ae*3,d,c,h,m,s,o)),!Y)return null;const N=tr.chamferDistance(Y,s,o,1),Q=(ae+1)*3;let K=s,ee=o,me=0,xe=0,Z=0;for(let j=0;j<u;j++){if(!F[j]||N[j]>Q)continue;const he=j%s,ve=j/s|0;he<K&&(K=he),he>me&&(me=he),ve<ee&&(ee=ve),ve>xe&&(xe=ve),Z++}if(Z<64||me<=K||xe<=ee)return null;const te=me-K+1,ne=xe-ee+1,X=Z/(te*ne),oe=(d+h)*.5,pe=(c+m)*.5,R=(K+me)*.5,H=(ee+xe)*.5;if(Math.abs(R-oe)>te*.3||Math.abs(H-pe)>ne*.3)return null;const le=Math.min(K,d),Me=Math.min(ee,c),Pe=Math.max(me,h),De=Math.max(xe,m);return{chamberBox:{x:r+le,y:i+Me,width:Pe-le+1,height:De-Me+1},isOval:X<.88}}static chamferDistance(t,r,i,n){const a=r*i,s=new Int32Array(a);for(let o=0;o<a;o++)s[o]=t[o]===n?0:u1;for(let o=0;o<i;o++)for(let u=0;u<r;u++){const d=o*r+u;let c=s[d];u>0&&s[d-1]+3<c&&(c=s[d-1]+3),o>0&&(s[d-r]+3<c&&(c=s[d-r]+3),u>0&&s[d-r-1]+4<c&&(c=s[d-r-1]+4),u<r-1&&s[d-r+1]+4<c&&(c=s[d-r+1]+4)),s[d]=c}for(let o=i-1;o>=0;o--)for(let u=r-1;u>=0;u--){const d=o*r+u;let c=s[d];u<r-1&&s[d+1]+3<c&&(c=s[d+1]+3),o<i-1&&(s[d+r]+3<c&&(c=s[d+r]+3),u<r-1&&s[d+r+1]+4<c&&(c=s[d+r+1]+4),u>0&&s[d+r-1]+4<c&&(c=s[d+r-1]+4)),s[d]=c}return s}static extractSeededCore(t,r,i,n,a,s,o,u){const d=o*u,c=new Uint8Array(d),h=new Int32Array(d);let m=0,g=0;for(let f=n;f<=s;f++)for(let $=i;$<=a;$++){const v=f*o+$;t[v]>=r&&!c[v]&&(c[v]=1,h[g++]=v)}if(g===0)return null;for(;m<g;){const f=h[m++],$=f%o,v=f/o|0;$>0&&t[f-1]>=r&&!c[f-1]&&(c[f-1]=1,h[g++]=f-1),$<o-1&&t[f+1]>=r&&!c[f+1]&&(c[f+1]=1,h[g++]=f+1),v>0&&t[f-o]>=r&&!c[f-o]&&(c[f-o]=1,h[g++]=f-o),v<u-1&&t[f+o]>=r&&!c[f+o]&&(c[f+o]=1,h[g++]=f+o)}return c}}const l1=self.location.href.substring(0,self.location.href.lastIndexOf("/")+1);Ee.wasm.wasmPaths=l1;Ee.wasm.numThreads=self.crossOriginIsolated?Math.min(4,Math.max(1,(self.navigator?.hardwareConcurrency??2)-1)):1;Ee.wasm.simd=!0;Ee.webgpu={...Ee.webgpu||{},powerPreference:"high-performance"};Ee.logLevel="error";let Qt=null,Xt=null,vr=null,Ec=null,zc="wasm",Ac=Promise.resolve();async function Zn(e,t,r){try{const i=await rr.create(e,{...t,executionProviders:["webgpu"]});if(r&&i.inputNames.length>0){const n=i.inputNames[0],a=r.reduce((u,d)=>u*d,1),s=new Ve("float32",new Float32Array(a),r);let o=null;try{o=await i.run({[n]:s})}catch(u){throw await i.release?.().catch(()=>{}),u}finally{if(s.dispose?.(),o)for(const u of Object.values(o))u.dispose?.()}}return i}catch(i){return console.warn("[OCR Worker] WebGPU session creation/kernel validation failed, falling back to WASM:",i?.message),null}}self.onmessage=e=>{const t=e.data,r=t._reqId,i=n=>self.postMessage({...n,_reqId:r});Ac=Ac.then(async()=>{try{switch(t.type){case"PING":{i({type:"PONG",success:!0});break}case"INIT_MODEL":{if(!t.detBuffer||!t.recBuffer||!t.keysText)throw new Error("Thiếu dữ liệu buffer hoặc keys để khởi tạo model.");await Qt?.release?.().catch(()=>{}),await Xt?.release?.().catch(()=>{}),await vr?.release?.().catch(()=>{}),Qt=null,Xt=null,vr=null;const n={graphOptimizationLevel:"all",logSeverityLevel:3};let a=null,s=null,o=!1,u=!1;const d=!!(t.modelId&&t.modelId.includes("comic")),c={...n,executionProviders:["wasm"]};if(t.useWebGpu!==!1&&!d&&(a=await Zn(t.detBuffer,n,[1,3,48,48]),a&&(o=!0)),a||(a=await rr.create(t.detBuffer,c)),t.useWebGpu!==!1&&(s=await Zn(t.recBuffer,n,[1,3,48,64]),s&&(u=!0)),s||(s=await rr.create(t.recBuffer,c)),zc=o||u?"webgpu":"wasm",Qt=a.inputNames.includes("orig_target_sizes")||a.inputNames.includes("images")||!!(t.modelId&&t.modelId.includes("comic"))?new Sc(a):new Tc(a),Xt=null,t.det2Buffer)try{const m=(t.useWebGpu!==!1?await Zn(t.det2Buffer,n,[1,3,64,64]):null)??await rr.create(t.det2Buffer,c);Xt=new Tc(m,{thresh:.3,boxThresh:.35,unclipRatio:1.3})}catch(m){console.warn("[OCR Worker] Supplementary det session failed:",m)}vr=new Cr(s,t.keysText,{isCjkModel:/japan|korean|chinese|cjk|multilingual|v6/i.test(t.modelId??"")}),Ec=t.modelId||"loaded",i({type:"INIT_RESULT",success:!0,modelId:Ec,backend:zc});break}case"PROCESS_IMAGE":{if(!Qt||!vr)throw new Error("Model PaddleOCR chưa được nạp. Hãy khởi tạo trước khi nhận diện.");if(!t.imageBitmap)throw new Error("Thiếu ImageBitmap cần nhận diện.");const n=t.imageBitmap;try{const a=n.width,s=n.height,o=new OffscreenCanvas(a,s),u=o.getContext("2d");if(!u)throw new Error("Không thể tạo 2D context trong Worker");u.drawImage(n,0,0);const d=performance.now(),c=Qt instanceof Sc,h=new Float32Array(a*s),m=await Fn.detectWithSlicing(o,a,s,Qt,{aspectCap:c?s<=2200?.85:1.8:void 0,invertedPass:c,textMapOut:h});if(Xt){const w=await Fn.detectWithSlicing(o,a,s,Xt,{textMapOut:h});for(const k of w)if(!m.some(T=>Fn.calculateIoU(T,k)>.5))if(k.height>=34&&k.width>=28){const T=ca.segmentLines(u,k,a,s);for(const E of T)m.push({...E,kind:"free"})}else m.push({...k,kind:"free"});m.sort((k,S)=>k.y-S.y)}const g=[];for(const w of m)if(w.kind!=="free"&&w.height>=42&&w.height<=w.width*2.2){const k=ca.segmentLines(u,w,a,s);for(const S of k)g.push({...S,kind:w.kind})}else g.push(w);m.length=0,m.push(...g),m.sort((w,k)=>w.y-k.y);const f=performance.now()-d,$=performance.now(),v=await vr.recognizeBoxes(o,m),b=performance.now()-$;d1(o,v,h),i({type:"PROCESS_RESULT",success:!0,elementId:t.elementId,dialogues:v,timings:{detMs:Math.round(f),recMs:Math.round(b),boxCount:m.length}})}finally{n.close()}break}default:throw new Error(`Thông điệp worker không hỗ trợ: ${t.type}`)}}catch(n){console.error("[OCR Worker] Processing error:",n),i({type:"ERROR",success:!1,elementId:t.elementId,error:`${n?.message||"Lỗi không xác định trong Web Worker"}${n?.stack?`
`+n.stack:""}`})}}).catch(n=>{console.error("[OCR Worker] Fatal queue error:",n),i({type:"ERROR",success:!1,error:`Fatal queue error: ${n?.message||n}`})})};function d1(e,t,r){const i=e.getContext("2d");if(!i)return;const n=4;for(const a of t){const s=Math.max(0,a.box.x-n),o=Math.max(0,a.box.y-n),u=Math.min(e.width-s,a.box.width+n*2),d=Math.min(e.height-o,a.box.height+n*2);if(!(u<4||d<4))try{const c=i.getImageData(s,o,u,d),h=a.box.quad?.map(([g,f])=>[g-s,f-o]),m=mi.buildPatch(c,s,o,a.bgColor,r,e.width,h);m&&(a.erasePatch=m)}catch{}}try{const a=B0.aggregateDialogues(t,e.width,e.height),s=new Map(t.map(o=>[o.box,o]));for(const o of a){const u=Math.max(24,Math.min(180,Math.round(Math.max(o.box.width*1.6,o.box.height*.85)))),d=Math.max(16,Math.min(120,Math.round(o.box.height*.45))),c=Math.max(0,o.box.x-u),h=Math.max(0,o.box.y-d),m=Math.min(e.width-c,o.box.width+u*2),g=Math.min(e.height-h,o.box.height+d*2);if(o.kind==="dialogue"&&m>=20&&g>=20){const S=i.getImageData(c,h,m,g),T=tr.extractChamber(S,c,h,o.box);if(T)for(const E of o.lineBoxes||[]){const C=s.get(E);C&&(C.chamberBox=T.chamberBox,C.isOvalChamber=T.isOval)}}const f=Math.max(0,o.box.x-16),$=Math.max(0,o.box.y-16),v=Math.min(e.width-f,o.box.width+32),b=Math.min(e.height-$,o.box.height+32);if(v<12||b<12)continue;const w=i.getImageData(f,$,v,b),k=o1.buildBubblePatch(w,f,$,o.lineBoxes);if(k)for(const S of o.lineBoxes||[]){const T=s.get(S);T&&(T.bubblePatch=k)}}}catch{}}self.addEventListener("error",e=>{console.error("[OCR Worker] Global error:",e),self.postMessage({type:"ERROR",success:!1,error:`Worker GlobalError: ${e.message||String(e)}`})});self.addEventListener("unhandledrejection",e=>{console.error("[OCR Worker] Unhandled rejection:",e),self.postMessage({type:"ERROR",success:!1,error:`Worker UnhandledRejection: ${e.reason?.message||String(e.reason)}`})});
