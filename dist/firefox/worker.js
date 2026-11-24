import{V as Lo,B as B0}from"./assets/bubble-aggregator.js";/*!
 * ONNX Runtime Web v1.31.1
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */var ha=Object.defineProperty,R0=Object.getOwnPropertyDescriptor,D0=Object.getOwnPropertyNames,N0=Object.prototype.hasOwnProperty,U0=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),te=(e,t,r)=>()=>{if(r)throw r[0];try{return e&&(t=e(e=0)),t}catch(i){throw r=[i],i}},or=(e,t)=>{for(var r in t)ha(e,r,{get:t[r],enumerable:!0})},P0=(e,t,r,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of D0(t))!N0.call(e,n)&&n!==r&&ha(e,n,{get:()=>t[n],enumerable:!(i=R0(t,n))||i.enumerable});return e},Er=e=>P0(ha({},"__esModule",{value:!0}),e),Zt,ft,Li,Jt,Wi,Ac,Oc,fa=te(()=>{"use strict";Zt=new Map,ft=[],Li=new WeakMap,Jt=(e,t,r)=>{if(t&&typeof t.init=="function"&&typeof t.createInferenceSessionHandler=="function"){let i=Zt.get(e);if(i===void 0)Zt.set(e,{backend:t,priority:r});else{if(i.priority>r)return;if(i.priority===r&&i.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${r}`)}if(r>=0){let n=ft.indexOf(e);n!==-1&&ft.splice(n,1);for(let a=0;a<ft.length;a++)if(Zt.get(ft[a]).priority<=r){ft.splice(a,0,e);return}ft.push(e)}return}throw new TypeError("not a valid backend")},Wi=async e=>{let t=Zt.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;if(t.aborted)return t.error;{let r=!!t.initPromise;try{if(!r){let i=t.backend,n=Li.get(i);t.initPromise=n?n.then(async()=>i.init(e),async()=>i.init(e)):i.init(e),Li.set(i,t.initPromise)}return await t.initPromise,t.initialized=!0,t.backend}catch(i){return r||(t.error=`${i}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},Ac=async e=>{let t=e.executionProviders||[],r=t.map(u=>typeof u=="string"?u:u.name),i=r.length===0?ft:r,n,a=[],s=new Set;for(let u of i){let l=await Wi(u);typeof l=="string"?a.push({name:u,err:l}):(n||(n=l),n===l&&s.add(u))}if(!n)throw new Error(`no available backend found. ERR: ${a.map(u=>`[${u.name}] ${u.err}`).join(", ")}`);for(let{name:u,err:l}of a)r.includes(u)&&console.warn(`removing requested execution provider "${u}" from session options because it is not available: ${l}`);let o=t.filter(u=>s.has(typeof u=="string"?u:u.name));return[n,new Proxy(e,{get:(u,l)=>l==="executionProviders"?o:Reflect.get(u,l)})]},Oc=async()=>{let e=[];for(let r of ft){if(typeof Zt.get(r).backend.createLoraAdapterHandler!="function")continue;let i=await Wi(r);if(typeof i!="string")return i;e.push({name:r,err:i})}let t=e.length===0?"":` ERR: ${e.map(r=>`[${r.name}] ${r.err}`).join(", ")}`;throw new Error(`no available backend supports LoRA adapters.${t}`)}}),L0=te(()=>{"use strict";fa()}),Bc,W0=te(()=>{"use strict";Bc="1.31.1"}),qi,qe,Rc=te(()=>{"use strict";W0(),qi="warning",qe={wasm:{},webgl:{},webgpu:{},versions:{common:Bc},set logLevel(e){if(e!==void 0){if(typeof e!="string"||["verbose","info","warning","error","fatal"].indexOf(e)===-1)throw new Error(`Unsupported logging level: ${e}`);qi=e}},get logLevel(){return qi}},Object.defineProperty(qe,"logLevel",{enumerable:!0})}),Ee,q0=te(()=>{"use strict";Rc(),Ee=qe}),oi,Gi,Je,Ke,Lt,Wt,ma=te(()=>{"use strict";Rc(),oi=(e,t)=>{(typeof qe.trace>"u"?!qe.wasm.trace:!qe.trace)||console.timeStamp(`${e}::ORT::${t}`)},Gi=(e,t)=>{let r=new Error().stack?.split(/\r\n|\r|\n/g)||[],i=!1;for(let n=0;n<r.length;n++){if(i&&!r[n].includes("TRACE_FUNC")){let a=`FUNC_${e}::${r[n].trim().split(" ")[1]}`;t&&(a+=`::${t}`),oi("CPU",a);return}r[n].includes("TRACE_FUNC")&&(i=!0)}},Je=e=>{(typeof qe.trace>"u"?!qe.wasm.trace:!qe.trace)||Gi("BEGIN",e)},Ke=e=>{(typeof qe.trace>"u"?!qe.wasm.trace:!qe.trace)||Gi("END",e)},Lt=e=>{(typeof qe.trace>"u"?!qe.wasm.trace:!qe.trace)||console.time(`ORT::${e}`)},Wt=e=>{(typeof qe.trace>"u"?!qe.wasm.trace:!qe.trace)||console.timeEnd(`ORT::${e}`)}}),ga,Dc=te(()=>{"use strict";fa(),ma(),ga=class Nc{constructor(t,r){this.backend=t,this.handler=r}static async create(t){if(Je(),typeof t!="string"&&!(t instanceof Uint8Array))throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let r=await Oc(),i=await r.createLoraAdapterHandler(t);return Ke(),new Nc(r,i)}async release(){return this.handler.dispose()}}}),Uc,Pc,G0=te(()=>{"use strict";Uc=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);r.width=e.dims[3],r.height=e.dims[2];let i=r.getContext("2d");if(i!=null){let n,a;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(n=e.dims[2],a=e.dims[3]):(n=e.dims[3],a=e.dims[2]);let s=t?.format!==void 0?t.format:"RGB",o=t?.norm,u,l;o===void 0||o.mean===void 0?u=[255,255,255,255]:typeof o.mean=="number"?u=[o.mean,o.mean,o.mean,o.mean]:(u=[o.mean[0],o.mean[1],o.mean[2],0],o.mean[3]!==void 0&&(u[3]=o.mean[3])),o===void 0||o.bias===void 0?l=[0,0,0,0]:typeof o.bias=="number"?l=[o.bias,o.bias,o.bias,o.bias]:(l=[o.bias[0],o.bias[1],o.bias[2],0],o.bias[3]!==void 0&&(l[3]=o.bias[3]));let c=a*n,h=0,m=c,g=c*2,f=-1;s==="RGBA"?(h=0,m=c,g=c*2,f=c*3):s==="RGB"?(h=0,m=c,g=c*2):s==="RBG"&&(h=0,g=c,m=c*2);for(let $=0;$<a;$++)for(let v=0;v<n;v++){let b=(e.data[h++]-l[0])*u[0],w=(e.data[m++]-l[1])*u[1],k=(e.data[g++]-l[2])*u[2],I=f===-1?255:(e.data[f++]-l[3])*u[3];i.fillStyle="rgba("+b+","+w+","+k+","+I+")",i.fillRect(v,$,1,1)}if("toDataURL"in r)return r.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},Pc=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),i;if(r!=null){let n,a,s;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(n=e.dims[2],a=e.dims[1],s=e.dims[3]):(n=e.dims[3],a=e.dims[2],s=e.dims[1]);let o=t!==void 0&&t.format!==void 0?t.format:"RGB",u=t?.norm,l,c;u===void 0||u.mean===void 0?l=[255,255,255,255]:typeof u.mean=="number"?l=[u.mean,u.mean,u.mean,u.mean]:(l=[u.mean[0],u.mean[1],u.mean[2],255],u.mean[3]!==void 0&&(l[3]=u.mean[3])),u===void 0||u.bias===void 0?c=[0,0,0,0]:typeof u.bias=="number"?c=[u.bias,u.bias,u.bias,u.bias]:(c=[u.bias[0],u.bias[1],u.bias[2],0],u.bias[3]!==void 0&&(c[3]=u.bias[3]));let h=a*n;if(t!==void 0&&(t.format!==void 0&&s===4&&t.format!=="RGBA"||s===3&&t.format!=="RGB"&&t.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let m=4,g=0,f=1,$=2,v=3,b=0,w=h,k=h*2,I=-1;o==="RGBA"?(b=0,w=h,k=h*2,I=h*3):o==="RGB"?(b=0,w=h,k=h*2):o==="RBG"&&(b=0,k=h,w=h*2),i=r.createImageData(n,a);for(let S=0;S<a*n;g+=m,f+=m,$+=m,v+=m,S++)i.data[g]=(e.data[b++]-c[0])*l[0],i.data[f]=(e.data[w++]-c[1])*l[1],i.data[$]=(e.data[k++]-c[2])*l[2],i.data[v]=I===-1?255:(e.data[I++]-c[3])*l[3]}else throw new Error("Can not access image data");return i}}),Gr,Lc,Wc,qc,Gc,Vc,V0=te(()=>{"use strict";ya(),Gr=(e,t)=>{if(e===void 0)throw new Error("Image buffer must be defined");if(t.height===void 0||t.width===void 0)throw new Error("Image height and width must be defined");if(t.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:r,width:i}=t,n=t.norm??{mean:255,bias:0},a,s;typeof n.mean=="number"?a=[n.mean,n.mean,n.mean,n.mean]:a=[n.mean[0],n.mean[1],n.mean[2],n.mean[3]??255],typeof n.bias=="number"?s=[n.bias,n.bias,n.bias,n.bias]:s=[n.bias[0],n.bias[1],n.bias[2],n.bias[3]??0];let o=t.format!==void 0?t.format:"RGBA",u=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",l=r*i,c=u==="RGBA"?new Float32Array(l*4):new Float32Array(l*3),h=4,m=0,g=1,f=2,$=3,v=0,b=l,w=l*2,k=-1;o==="RGB"&&(h=3,m=0,g=1,f=2,$=-1),u==="RGBA"?k=l*3:u==="RBG"?(v=0,w=l,b=l*2):u==="BGR"&&(w=0,b=l,v=l*2);for(let I=0;I<l;I++,m+=h,f+=h,g+=h,$+=h)c[v++]=(e[m]+s[0])/a[0],c[b++]=(e[g]+s[1])/a[1],c[w++]=(e[f]+s[2])/a[2],k!==-1&&$!==-1&&(c[k++]=(e[$]+s[3])/a[3]);return u==="RGBA"?new je("float32",c,[1,4,r,i]):new je("float32",c,[1,3,r,i])},Lc=async(e,t)=>{let r=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,i=typeof ImageData<"u"&&e instanceof ImageData,n=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,a=typeof e=="string",s,o=t??{},u=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},l=c=>typeof HTMLCanvasElement<"u"&&c instanceof HTMLCanvasElement||c instanceof OffscreenCanvas?c.getContext("2d"):null;if(r){let c=u();c.width=e.width,c.height=e.height;let h=l(c);if(h!=null){let m=e.height,g=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(m=t.resizedHeight,g=t.resizedWidth),t!==void 0){if(o=t,t.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");o.tensorFormat="RGBA",o.height=m,o.width=g}else o.tensorFormat="RGBA",o.height=m,o.width=g;h.drawImage(e,0,0),s=h.getImageData(0,0,g,m).data}else throw new Error("Can not access image data")}else if(i){let c,h;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(c=t.resizedHeight,h=t.resizedWidth):(c=e.height,h=e.width),t!==void 0&&(o=t),o.format="RGBA",o.height=c,o.width=h,t!==void 0){let m=u();m.width=h,m.height=c;let g=l(m);if(g!=null)g.putImageData(e,0,0),s=g.getImageData(0,0,h,c).data;else throw new Error("Can not access image data")}else s=e.data}else if(n){if(t===void 0)throw new Error("Please provide image config with format for Imagebitmap");let c=u();c.width=e.width,c.height=e.height;let h=l(c);if(h!=null){let m=e.height,g=e.width;return h.drawImage(e,0,0,g,m),s=h.getImageData(0,0,g,m).data,o.height=m,o.width=g,Gr(s,o)}else throw new Error("Can not access image data")}else{if(a)return new Promise((c,h)=>{let m=u(),g=l(m);if(!e||!g)return h();let f=new Image;f.crossOrigin="Anonymous",f.src=e,f.onload=()=>{m.width=f.width,m.height=f.height,g.drawImage(f,0,0,m.width,m.height);let $=g.getImageData(0,0,m.width,m.height);o.height=m.height,o.width=m.width,c(Gr($.data,o))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(s!==void 0)return Gr(s,o);throw new Error("Input data provided is not supported - aborted tensor creation")},Wc=(e,t)=>{let{width:r,height:i,download:n,dispose:a}=t,s=[1,i,r,4];return new je({location:"texture",type:"float32",texture:e,dims:s,download:n,dispose:a})},qc=(e,t)=>{let{dataType:r,dims:i,download:n,dispose:a}=t;return new je({location:"gpu-buffer",type:r??"float32",gpuBuffer:e,dims:i,download:n,dispose:a})},Gc=(e,t)=>{let{dataType:r,dims:i,download:n,dispose:a}=t;return new je({location:"ml-tensor",type:r??"float32",mlTensor:e,dims:i,download:n,dispose:a})},Vc=(e,t,r)=>new je({location:"cpu-pinned",type:e,data:t,dims:r??[t.length]})}),Nt,vr,Vi,Hc,H0=te(()=>{"use strict";Nt=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),vr=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),Vi=!1,Hc=()=>{if(!Vi){Vi=!0;let e=typeof BigInt64Array<"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,r=globalThis.Float16Array,i=typeof r<"u"&&r.from;e&&(Nt.set("int64",BigInt64Array),vr.set(BigInt64Array,"int64")),t&&(Nt.set("uint64",BigUint64Array),vr.set(BigUint64Array,"uint64")),i?(Nt.set("float16",r),vr.set(r,"float16")):Nt.set("float16",Uint16Array)}}}),Fc,jc,F0=te(()=>{"use strict";ya(),Fc=e=>{let t=1;for(let r=0;r<e.length;r++){let i=e[r];if(typeof i!="number"||!Number.isSafeInteger(i))throw new TypeError(`dims[${r}] must be an integer, got: ${i}`);if(i<0)throw new RangeError(`dims[${r}] must be a non-negative integer, got: ${i}`);t*=i}return t},jc=(e,t)=>{switch(e.location){case"cpu":return new je(e.type,e.data,t);case"cpu-pinned":return new je({location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new je({location:"texture",texture:e.texture,type:e.type,dims:t});case"gpu-buffer":return new je({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"ml-tensor":return new je({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),je,ya=te(()=>{"use strict";G0(),V0(),H0(),F0(),je=class{constructor(e,t,r){Hc();let i,n;if(typeof e=="object"&&"location"in e)switch(this.dataLocation=e.location,i=e.type,n=e.dims,e.location){case"cpu-pinned":{let s=Nt.get(i);if(!s)throw new TypeError(`unsupported type "${i}" to create tensor from pinned buffer`);if(!(e.data instanceof s))throw new TypeError(`buffer should be of type ${s.name}`);this.cpuData=e.data;break}case"texture":{if(i!=="float32")throw new TypeError(`unsupported type "${i}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break}case"gpu-buffer":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break}case"ml-tensor":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint64"&&i!=="int8"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let s,o;if(typeof e=="string")if(i=e,o=r,e==="string"){if(!Array.isArray(t))throw new TypeError("A string tensor's data must be a string array.");s=t}else{let u=Nt.get(e);if(u===void 0)throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e==="float16"&&u===Uint16Array||e==="uint4"||e==="int4")throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${u.name} as data.`);e==="uint64"||e==="int64"?s=u.from(t,BigInt):s=u.from(t)}else if(t instanceof u)s=t;else if(t instanceof Uint8ClampedArray)if(e==="uint8")s=Uint8Array.from(t);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(e==="float16"&&t instanceof Uint16Array&&u!==Uint16Array)s=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw new TypeError(`A ${i} tensor's data must be type of ${u}`)}else if(o=t,Array.isArray(e)){if(e.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let u=typeof e[0];if(u==="string")i="string",s=e;else if(u==="boolean")i="bool",s=Uint8Array.from(e);else throw new TypeError(`Invalid element type of data array: ${u}.`)}else if(e instanceof Uint8ClampedArray)i="uint8",s=Uint8Array.from(e);else{let u=vr.get(e.constructor);if(u===void 0)throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);i=u,s=e}if(o===void 0)o=[s.length];else if(!Array.isArray(o))throw new TypeError("A tensor's dims must be a number array");n=o,this.cpuData=s,this.dataLocation="cpu"}let a=Fc(n);if(this.cpuData&&a!==this.cpuData.length&&!((i==="uint4"||i==="int4")&&Math.ceil(a/2)===this.cpuData.length))throw new Error(`Tensor's size(${a}) does not match data length(${this.cpuData.length}).`);this.type=i,this.dims=n,this.size=a}static async fromImage(e,t){return Lc(e,t)}static fromTexture(e,t){return Wc(e,t)}static fromGpuBuffer(e,t){return qc(e,t)}static fromMLTensor(e,t){return Gc(e,t)}static fromPinnedBuffer(e,t,r){return Vc(e,t,r)}toDataURL(e){return Uc(this,e)}toImageData(e){return Pc(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return jc(this,e)}}}),Ve,Kc=te(()=>{"use strict";ya(),Ve=je}),Zc,j0=te(()=>{"use strict";fa(),Dc(),Kc(),ma(),Zc=class Yc{constructor(t,r){this.handler=t,this.backend=r}async run(t,r,i){Je(),Lt("InferenceSession.run");let n={},a={};if(typeof t!="object"||t===null||t instanceof Ve||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let s=!0;if(typeof r=="object"){if(r===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(r instanceof Ve)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(r)){if(r.length===0)throw new TypeError("'fetches' cannot be an empty array.");s=!1;for(let c of r){if(typeof c!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(c)===-1)throw new RangeError(`'fetches' contains invalid output name: ${c}.`);n[c]=null}if(typeof i=="object"&&i!==null)a=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else{let c=!1,h=Object.getOwnPropertyNames(r);for(let m of this.outputNames)if(h.indexOf(m)!==-1){let g=r[m];(g===null||g instanceof Ve)&&(c=!0,s=!1,n[m]=g)}if(c){if(typeof i=="object"&&i!==null)a=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else a=r}}else if(typeof r<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let c of this.inputNames)if(typeof t[c]>"u")throw new Error(`input '${c}' is missing in 'feeds'.`);if(s)for(let c of this.outputNames)n[c]=null;let o;if(a.activeLoraAdapters!==void 0){if(!Array.isArray(a.activeLoraAdapters))throw new TypeError("'activeLoraAdapters' must be an array.");o=a.activeLoraAdapters.map(c=>{if(!(c instanceof ga))throw new TypeError("'activeLoraAdapters' must be an array of LoraAdapter objects.");if(c.backend!==this.backend)throw new Error("LoRA adapter was created by a different backend than the session.");return c.handler})}let u=await this.handler.run(t,n,a,o),l={};for(let c in u)if(Object.hasOwnProperty.call(u,c)){let h=u[c];h instanceof Ve?l[c]=h:l[c]=new Ve(h.type,h.data,h.dims)}return Wt("InferenceSession.run"),Ke(),l}async release(){return this.handler.dispose()}static async create(t,r,i,n){Je(),Lt("InferenceSession.create");let a,s={};if(typeof t=="string"){if(a=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof Uint8Array){if(a=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&t instanceof SharedArrayBuffer){let c=t,h=0,m=t.byteLength;if(typeof r=="object"&&r!==null)s=r;else if(typeof r=="number"){if(h=r,!Number.isSafeInteger(h))throw new RangeError("'byteOffset' must be an integer.");if(h<0||h>=c.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${c.byteLength}).`);if(m=t.byteLength-h,typeof i=="number"){if(m=i,!Number.isSafeInteger(m))throw new RangeError("'byteLength' must be an integer.");if(m<=0||h+m>c.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${c.byteLength-h}].`);if(typeof n=="object"&&n!==null)s=n;else if(typeof n<"u")throw new TypeError("'options' must be an object.")}else if(typeof i<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof r<"u")throw new TypeError("'options' must be an object.");a=new Uint8Array(c,h,m)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[o,u]=await Ac(s),l=await o.createInferenceSessionHandler(a,u);return Wt("InferenceSession.create"),Ke(),new Yc(l,o)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),rr,K0=te(()=>{"use strict";j0(),rr=Zc}),Qc,Z0=te(()=>{"use strict";Dc(),Qc=ga}),Y0=te(()=>{"use strict"}),Q0=te(()=>{"use strict"}),X0=te(()=>{"use strict"}),J0=te(()=>{"use strict"}),ey={};or(ey,{InferenceSession:()=>rr,LoraAdapter:()=>Qc,TRACE:()=>oi,TRACE_EVENT_BEGIN:()=>Lt,TRACE_EVENT_END:()=>Wt,TRACE_FUNC_BEGIN:()=>Je,TRACE_FUNC_END:()=>Ke,Tensor:()=>Ve,env:()=>Ee,registerBackend:()=>Jt});var Ye=te(()=>{"use strict";L0(),q0(),K0(),Z0(),Kc(),Y0(),Q0(),ma(),X0(),J0()}),wa=te(()=>{"use strict"}),Xc={};or(Xc,{default:()=>Jc});var Hi,Fi,Jc,ty=te(()=>{"use strict";lm(),Ht(),_a(),Hi="ort-wasm-proxy-worker",Fi=globalThis.self?.name===Hi,Fi&&(self.onmessage=e=>{let{type:t,in:r}=e.data;try{switch(t){case"init-wasm":ba(r.wasm).then(()=>{Na(r).then(()=>{postMessage({type:t})},i=>{postMessage({type:t,err:i})})},i=>{postMessage({type:t,err:i})});break;case"init-ep":{let{epName:i,env:n}=r;Ua(n,i).then(()=>{postMessage({type:t})},a=>{postMessage({type:t,err:a})});break}case"copy-from":{let{buffer:i}=r,n=fi(i);postMessage({type:t,out:n});break}case"create":{let{model:i,options:n}=r;Pa(i,n).then(a=>{postMessage({type:t,out:a})},a=>{postMessage({type:t,err:a})});break}case"release":La(r),postMessage({type:t});break;case"run":{let{sessionId:i,inputIndices:n,inputs:a,outputIndices:s,options:o}=r;Wa(i,n,a,s,new Array(s.length).fill(null),o).then(u=>{u.some(l=>l[3]!=="cpu")?postMessage({type:t,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:t,out:u},Ga([...a,...u]))},u=>{postMessage({type:t,err:u})});break}case"end-profiling":qa(r),postMessage({type:t});break;default:}}catch(i){postMessage({type:t,err:i})}}),Jc=Fi?null:e=>new Worker(e??Fe,{type:"module",name:Hi})}),ep={};or(ep,{default:()=>tp});async function Wo(e={}){var t=e,r=!!globalThis.window,i=!!globalThis.WorkerGlobalScope,n=i&&self.name?.startsWith("em-pthread");t.mountExternalData=(d,p)=>{d.startsWith("./")&&(d=d.substring(2)),(t.jd||(t.jd=new Map)).set(d,p)},t.unmountExternalData=()=>{delete t.jd,delete t.ke,delete t.je,delete t.le},globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,shared:!0}).buffer.constructor;let a=d=>async(...p)=>{try{if(t.hd)throw Error("Session already started");let _=t.hd={Vd:p[0],errors:[]},y=await d(...p);if(t.hd!==_)throw Error("Session mismatch");t.pd?.flush();let T=_.errors;if(0<T.length){let z=await Promise.all(T);if(z=z.filter(R=>R),0<z.length)throw Error(z.join(`
`))}return y}finally{t.hd=null}};t.jsepInit=(d,p)=>{if(d==="webgpu"){[t.pd,t.Ld,t.Pd,t.rd,t.Od,t.ic,t.Qd,t.Sd,t.Md,t.Nd,t.Rd]=p;let _=t.pd;t.jsepRegisterBuffer=(y,T,z,R)=>_.registerBuffer(y,T,z,R),t.jsepGetBuffer=y=>_.getBuffer(y),t.jsepCreateDownloader=(y,T,z)=>_.createDownloader(y,T,z),t.jsepOnCreateSession=y=>{_.onCreateSession(y)},t.jsepOnReleaseSession=y=>{_.onReleaseSession(y)},t.jsepOnRunStart=y=>_.onRunStart(y),t.Td=(y,T)=>{_.upload(y,T)}}else if(d==="webnn"){let _=p[0];[t.ce,t.Cd,t.webnnEnsureTensor,t.Dd,t.webnnDownloadTensor,t.be,t.webnnEnableTraceEvent]=p.slice(1),t.webnnReleaseTensorId=t.Cd,t.webnnUploadTensor=t.Dd,t.webnnRegisterMLContext=t.be,t.webnnOnRunStart=y=>_.onRunStart(y),t.webnnOnRunEnd=_.onRunEnd.bind(_),t.webnnOnReleaseSession=y=>{_.onReleaseSession(y)},t.webnnCreateMLTensorDownloader=(y,T)=>_.createMLTensorDownloader(y,T),t.webnnRegisterMLTensor=(y,T,z,R)=>_.registerMLTensor(y,T,z,R),t.webnnCreateMLContext=y=>_.createMLContext(y),t.webnnRegisterGraphInput=_.registerGraphInput.bind(_),t.webnnIsGraphInput=_.isGraphInput.bind(_),t.webnnRegisterGraphOutput=_.registerGraphOutput.bind(_),t.webnnIsGraphOutput=_.isGraphOutput.bind(_),t.webnnCreateTemporaryTensor=_.createTemporaryTensor.bind(_),t.webnnIsGraphInputOutputTypeSupported=_.isGraphInputOutputTypeSupported.bind(_)}};let s=()=>{let d=p=>(..._)=>{let y=ut;return _=p(..._),ut!=y?new Promise((T,z)=>{Ti={resolve:T,reject:z}}):_};(p=>{for(let _ of p)t[_]=d(t[_])})("_OrtAppendExecutionProvider _OrtAppendExecutionProviderV2 _OrtCreateSession _OrtRun _OrtRunWithBinding _OrtBindInput".split(" ")),a!==void 0&&(t._OrtRun=a(t._OrtRun),t._OrtRunWithBinding=a(t._OrtRunWithBinding)),s=void 0};t.asyncInit=()=>{s?.()};var o,u,l=(d,p)=>{throw p},c=import.meta.url,h="";if(r||i){try{h=new URL(".",c).href}catch{}i&&(u=d=>{var p=new XMLHttpRequest;return p.open("GET",d,!1),p.responseType="arraybuffer",p.send(null),new Uint8Array(p.response)}),o=async d=>{if(C(d))return new Promise((_,y)=>{var T=new XMLHttpRequest;T.open("GET",d,!0),T.responseType="arraybuffer",T.onload=()=>{T.status==200||T.status==0&&T.response?_(T.response):y(T.status)},T.onerror=y,T.send(null)});var p=await fetch(d,{credentials:"same-origin"});if(p.ok)return p.arrayBuffer();throw Error(p.status+" : "+p.url)}}var m,g,f,$,v,b,w=console.log.bind(console),k=console.error.bind(console),I=w,S=k,E=!1,C=d=>d.startsWith("file://");function x(){bt.buffer!=N.buffer&&W()}if(n){let d=function(p){try{var _=p.data,y=_.bd;if(y==="load"){let T=[];self.onmessage=z=>T.push(z),b=()=>{postMessage({bd:"loaded"});for(let z of T)d(z);self.onmessage=d};for(let z of _.Hd)t[z]&&!t[z].proxy||(t[z]=(...R)=>{postMessage({bd:"callHandler",Fd:z,args:R})},z=="print"&&(I=t[z]),z=="printErr"&&(S=t[z]));bt=_.Zd,W(),g=_.$d,we(),qr()}else if(y==="run"){(function(T){var z=(x(),q)[T+52>>>2>>>0];T=(x(),q)[T+56>>>2>>>0],js(z,z-T),be(z)})(_.ad),Ai(_.ad,0,0,1,0,0),ja(),ki(_.ad),M||(Ws(),M=!0);try{km(_.Xd,_.nd)}catch(T){if(T!="unwind")throw T}}else _.target!=="setimmediate"&&(y==="checkMailbox"?M&&Rr():y&&(S(`worker: received unknown command ${y}`),S(_)))}catch(T){throw qs(),T}};var M=!1;self.onunhandledrejection=p=>{throw p.reason||p},self.onmessage=d}var N,B,U,F,O,q,j,P,ie,ae,Q,A=!1;function W(){var d=bt.buffer;t.HEAP8=N=new Int8Array(d),U=new Int16Array(d),t.HEAPU8=B=new Uint8Array(d),F=new Uint16Array(d),t.HEAP32=O=new Int32Array(d),t.HEAPU32=q=new Uint32Array(d),j=new Float32Array(d),P=new Float64Array(d),ie=new BigInt64Array(d),ae=new BigUint64Array(d)}function G(){A=!0,n?b():ht.vb()}function Z(d){throw S(d="Aborted("+d+")"),E=!0,d=new WebAssembly.RuntimeError(d+". Build with -sASSERTIONS for more info."),v?.(d),d}function ce(){return{a:{na:jg,jb:Fg,g:Sm,G:Im,f:Tm,o:Cm,h:Em,$:zm,b:Mm,S:Am,Ja,n:Om,aa:is,_a:ns,Fa:as,Ha:ss,$a:os,Ya:us,Ra:ls,Xa:ds,la:cs,Ga:ps,Da:hs,Za:fs,Ea:ms,eb:Bm,ga:Rm,ya:Dm,wa:Um,fa:Lm,N:Wm,I:qm,xa:Gm,_:Ym,za:Qm,Ua:Xm,Ba:eg,Ka:tg,ua:rg,ha:ig,Ta:ki,bb:ng,Q:ug,r:hg,c:xi,kb:fg,y:mg,M:gg,D:yg,m:wg,s:vs,lb:_g,J:bg,R:$g,j:xg,u:vg,q:kg,k:Sg,Oa:Ig,Pa:Tg,Qa:Cg,Ma:Ts,Na:Cs,va:Es,gb:zg,db:Ag,v:Og,ba:Bg,ia:Rg,cb:Mg,V:Dg,ab:Ng,Ca:Ug,F:Eg,U:Pg,ma:Lr,Aa:Wg,ib:Lg,hb:qg,Va:Os,Wa:Bs,Ia:Pe,T:Rs,La:Ds,ka:Ns,Sa:Us,ja:Ps,nb:M0,oa:I0,ob:z0,pa:S0,H:f0,e:Qg,t:Zg,w:Kg,B:u0,pb:x0,Z:$0,x:t0,qa:v0,X:T0,ca:b0,qb:_0,ea:Jg,O:l0,sb:g0,ra:w0,tb:m0,L:p0,Y:k0,d:Yg,A:e0,l:Xg,mb:A0,p:i0,z:n0,C:r0,E:a0,K:d0,sa:h0,P:C0,da:c0,W:E0,ub:o0,ta:s0,rb:y0,i:Vg,a:bt,fb:le}}}async function we(){function d(y,T){var z=ht=y.exports;y={};for(let[R,V]of Object.entries(z))typeof V=="function"?(z=ag(V),y[R]=z):y[R]=V;return ht=y,ht=(function(){var R=ht,V=se=>_e=>se(_e)>>>0,ne=se=>()=>se()>>>0;return(R=Object.assign({},R)).wb=V(R.wb),R.ec=ne(R.ec),R.gc=V(R.gc),R.uc=V(R.uc),R.vc=ne(R.vc),R.zc=V(R.zc),R})(),fe.push(ht.hc),Ls=(y=ht).wb,Ws=y.xb,t._OrtInit=y.yb,t._OrtGetLastError=y.zb,t._OrtCreateSessionOptions=y.Ab,t._OrtAppendExecutionProvider=y.Bb,t._OrtGetEpDevices=y.Cb,t._OrtEpDevice_EpName=y.Db,t._OrtAppendExecutionProviderV2=y.Eb,t._OrtAddFreeDimensionOverride=y.Fb,t._OrtAddSessionConfigEntry=y.Gb,t._OrtReleaseSessionOptions=y.Hb,t._OrtCreateSession=y.Ib,t._OrtReleaseSession=y.Jb,t._OrtGetInputOutputCount=y.Kb,t._OrtGetInputOutputMetadata=y.Lb,t._OrtFree=y.Mb,t._OrtCreateTensor=y.Nb,t._OrtGetTensorData=y.Ob,t._OrtReleaseTensor=y.Pb,t._OrtCreateLoraAdapter=y.Qb,t._OrtReleaseLoraAdapter=y.Rb,t._OrtCreateRunOptions=y.Sb,t._OrtAddRunConfigEntry=y.Tb,t._OrtRunOptionsAddActiveLoraAdapter=y.Ub,t._OrtReleaseRunOptions=y.Vb,t._OrtCreateBinding=y.Wb,t._OrtBindInput=y.Xb,t._OrtBindOutput=y.Yb,t._OrtClearBoundOutputs=y.Zb,t._OrtReleaseBinding=y._b,t._OrtRunWithBinding=y.$b,t._OrtRun=y.ac,t._OrtEndProfiling=y.bc,t._JsepOutput=y.cc,t._JsepGetNodeName=y.dc,Wr=y.ec,lt=t._free=y.fc,lr=t._malloc=y.gc,Ai=y.jc,qs=y.kc,Gs=y.lc,Vs=y.mc,Oi=y.nc,Hs=y.oc,Fs=y.pc,xe=y.qc,dr=y.rc,js=y.sc,be=y.tc,Bi=y.uc,$e=y.vc,Ks=y.wc,Ri=y.xc,Zs=y.yc,Ys=y.zc,Qs=y.Ac,Di=y.Bc,Xs=y.Cc,Js=y.Dc,eo=y.Ec,to=y.Fc,ro=y.Gc,io=y.Hc,no=y.Ic,ao=y.Jc,so=y.Kc,oo=y.Lc,uo=y.Mc,lo=y.Nc,co=y.Oc,po=y.Pc,ho=y.Qc,fo=y.Rc,mo=y.Sc,go=y.Tc,yo=y.Uc,wo=y.Vc,_o=y.Wc,bo=y.Xc,$o=y.Yc,xo=y._c,vo=y.$c,ko=y.kd,So=y.ld,Io=y.qd,To=y.vd,Co=y.wd,Eo=y.xd,zo=y.yd,Mo=y.zd,Ao=y.Ad,Oo=y.Bd,Bo=y.Gd,Ro=y.Jd,Do=y.fe,No=y.ge,Uo=y.he,Po=y.ie,g=T,ht}var p,_=ce();return t.instantiateWasm?new Promise(y=>{t.instantiateWasm(_,(T,z)=>{y(d(T,z))})}):n?d(new WebAssembly.Instance(g,ce()),g):(Q??=t.locateFile?t.locateFile?t.locateFile("ort-wasm-simd-threaded.jsep.wasm",h):h+"ort-wasm-simd-threaded.jsep.wasm":new URL("/assets/ort-wasm-simd-threaded.jsep.wasm",import.meta.url).href,p=await(async function(y){var T=Q;if(!m&&!C(T))try{var z=fetch(T,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(z,y)}catch(R){S(`wasm streaming compile failed: ${R}`),S("falling back to ArrayBuffer instantiation")}return(async function(R,V){try{var ne=await(async function(se){if(!m)try{var _e=await o(se);return new Uint8Array(_e)}catch{}if(se==Q&&m)se=new Uint8Array(m);else{if(!u)throw"both async and sync fetching of the wasm failed";se=u(se)}return se})(R);return await WebAssembly.instantiate(ne,V)}catch(se){S(`failed to asynchronously prepare wasm: ${se}`),Z(se)}})(T,y)})(_),d(p.instance,p.module))}class Y{name="ExitStatus";constructor(p){this.message=`Program terminated with exit(${p})`,this.status=p}}var J=d=>{d.terminate(),d.onmessage=()=>{}},re=[],ee=0,oe=null,he=d=>{De.length==0&&(Za(),Ka(De[0]));var p=De.pop();if(!p)return 6;X.push(p),ve[d.ad]=p,p.ad=d.ad;var _={bd:"run",Xd:d.Wd,nd:d.nd,ad:d.ad};return p.postMessage(_,d.ud),0},D=0,K=(d,p,..._)=>{var y,T=16*_.length,z=$e(),R=Bi(T),V=R>>>3;for(y of _)typeof y=="bigint"?((x(),ie)[V++>>>0]=1n,(x(),ie)[V++>>>0]=y):((x(),ie)[V++>>>0]=0n,(x(),P)[V++>>>0]=y);return d=Gs(d,0,T,R,p),be(z),d};function le(d){if(n)return K(0,1,d);if(f=d,!(0<D)){for(var p of X)J(p);for(p of De)J(p);De=[],X=[],ve={},E=!0}l(0,new Y(d))}function Ae(d){if(n)return K(1,0,d);Pe(d)}var Pe=d=>{if(f=d,n)throw Ae(d),"unwind";le(d)},De=[],X=[],fe=[],ve={},Fa=d=>{var p=d.ad;delete ve[p],De.push(d),X.splice(X.indexOf(d),1),d.ad=0,Vs(p)};function ja(){fe.forEach(d=>d())}var Ka=d=>new Promise(p=>{d.onmessage=T=>{var z=T.data;if(T=z.bd,z.md&&z.md!=Wr()){var R=ve[z.md];R?R.postMessage(z,z.ud):S(`Internal error! Worker sent a message "${T}" to target pthread ${z.md}, but that thread no longer exists!`)}else T==="checkMailbox"?Rr():T==="spawnThread"?he(z):T==="cleanupThread"?Br(()=>{Fa(ve[z.Yd])}):T==="loaded"?(d.loaded=!0,p(d)):z.target==="setimmediate"?d.postMessage(z):T==="uncaughtException"?d.onerror(z.error):T==="callHandler"?t[z.Fd](...z.args):T&&S(`worker sent an unknown command ${T}`)},d.onerror=T=>{throw S(`worker sent an error! ${T.filename}:${T.lineno}: ${T.message}`),T};var _,y=[];for(_ of[])t.propertyIsEnumerable(_)&&y.push(_);d.postMessage({bd:"load",Hd:y,Zd:bt,$d:g})});function Za(){var d=new Worker((()=>{let p=URL;return import.meta.url>"file:"&&import.meta.url<"file;"?new p("ort.bundle.min.mjs",import.meta.url):new URL(import.meta.url)})(),{type:"module",workerData:"em-pthread",name:"em-pthread"});De.push(d)}var bt,km=(d,p)=>{D=0,d=Di(d,p),0<D?f=d:Oi(d)},Mr=[],Ar=0;function Sm(d){var p=new wi(d>>>=0);return(x(),N)[p.cd+12>>>0]==0&&(Ya(p,!0),Ar--),Qa(p,!1),Mr.push(p),Ys(d)}var jt=0,Im=()=>{xe(0,0);var d=Mr.pop();Ks(d.od),jt=0};function Ya(d,p){p=p?1:0,(x(),N)[d.cd+12>>>0]=p}function Qa(d,p){p=p?1:0,(x(),N)[d.cd+13>>>0]=p}class wi{constructor(p){this.od=p,this.cd=p-24}}var _i=d=>{var p=jt;if(!p)return dr(0),0;var _=new wi(p);(x(),q)[_.cd+16>>>2>>>0]=p;var y=(x(),q)[_.cd+4>>>2>>>0];if(!y)return dr(0),p;for(var T of d){if(T===0||T===y)break;if(Zs(T,y,_.cd+16))return dr(T),p}return dr(y),p};function Tm(){return _i([])}function Cm(d){return _i([d>>>0])}function Em(d,p,_,y){return _i([d>>>0,p>>>0,_>>>0,y>>>0])}var zm=()=>{var d=Mr.pop();d||Z("no exception to throw");var p=d.od;throw(x(),N)[d.cd+13>>>0]==0&&(Mr.push(d),Qa(d,!0),Ya(d,!1),Ar++),Ri(p),jt=p};function Mm(d,p,_){var y=new wi(d>>>=0);throw p>>>=0,_>>>=0,(x(),q)[y.cd+16>>>2>>>0]=0,(x(),q)[y.cd+4>>>2>>>0]=p,(x(),q)[y.cd+8>>>2>>>0]=_,Ri(d),Ar++,jt=d}var Am=()=>Ar;function Xa(d,p,_,y){return n?K(2,1,d,p,_,y):Ja(d,p,_,y)}function Ja(d,p,_,y){if(d>>>=0,p>>>=0,_>>>=0,y>>>=0,!globalThis.SharedArrayBuffer)return 6;var T=[];return n&&T.length===0?Xa(d,p,_,y):(d={Wd:_,ad:d,nd:y,ud:T},n?(d.bd="spawnThread",postMessage(d,T),0):he(d))}function Om(d){throw jt||=d>>>0,jt}var es=globalThis.TextDecoder&&new TextDecoder,ts=(d,p,_,y)=>{if(_=p+_,y)return _;for(;d[p]&&!(p>=_);)++p;return p},rs=(d,p=0,_,y)=>{if(16<(_=ts(d,p>>>=0,_,y))-p&&d.buffer&&es)return es.decode(d.buffer instanceof ArrayBuffer?d.subarray(p,_):d.slice(p,_));for(y="";p<_;){var T=d[p++];if(128&T){var z=63&d[p++];if((224&T)==192)y+=String.fromCharCode((31&T)<<6|z);else{var R=63&d[p++];65536>(T=(240&T)==224?(15&T)<<12|z<<6|R:(7&T)<<18|z<<12|R<<6|63&d[p++])?y+=String.fromCharCode(T):(T-=65536,y+=String.fromCharCode(55296|T>>10,56320|1023&T))}}else y+=String.fromCharCode(T)}return y},Ue=(d,p,_)=>(d>>>=0)?rs((x(),B),d,p,_):"";function is(d,p,_){return n?K(3,1,d,p,_):0}function ns(d,p){if(n)return K(4,1,d,p)}function as(d,p){if(n)return K(5,1,d,p)}function ss(d,p,_){if(n)return K(6,1,d,p,_)}function os(d,p,_){return n?K(7,1,d,p,_):0}function us(d,p){if(n)return K(8,1,d,p)}function ls(d,p,_){if(n)return K(9,1,d,p,_)}function ds(d,p,_,y){if(n)return K(10,1,d,p,_,y)}function cs(d,p,_,y){if(n)return K(11,1,d,p,_,y)}function ps(d,p,_,y){if(n)return K(12,1,d,p,_,y)}function hs(d){if(n)return K(13,1,d)}function fs(d,p){if(n)return K(14,1,d,p)}function ms(d,p,_){if(n)return K(15,1,d,p,_)}var Bm=()=>Z(""),ot=d=>{d>>>=0;for(var p="";;){var _=(x(),B)[d++>>>0];if(!_)return p;p+=String.fromCharCode(_)}},bi={},$i={},Kt=class extends Error{constructor(d){super(d),this.name="BindingError"}};function pt(d,p,_={}){return(function(y,T,z={}){var R=T.name;if(!y)throw new Kt(`type "${R}" must have a positive integer typeid pointer`);if($i.hasOwnProperty(y)){if(z.Id)return;throw new Kt(`Cannot register type '${R}' twice`)}$i[y]=T,bi.hasOwnProperty(y)&&(T=bi[y],delete bi[y],T.forEach(V=>V()))})(d,p,_)}var gs=(d,p,_)=>{switch(p){case 1:return _?y=>(x(),N)[y>>>0]:y=>(x(),B)[y>>>0];case 2:return _?y=>(x(),U)[y>>>1>>>0]:y=>(x(),F)[y>>>1>>>0];case 4:return _?y=>(x(),O)[y>>>2>>>0]:y=>(x(),q)[y>>>2>>>0];case 8:return _?y=>(x(),ie)[y>>>3>>>0]:y=>(x(),ae)[y>>>3>>>0];default:throw new TypeError(`invalid integer width (${p}): ${d}`)}};function Rm(d,p,_,y,T){d>>>=0,_>>>=0,p=ot(p>>>0);let z=R=>R;if(y=y===0n){let R=8*_;z=V=>BigInt.asUintN(R,V),T=z(T)}pt(d,{name:p,Zc:z,ed:(R,V)=>(typeof V=="number"&&(V=BigInt(V)),V),dd:gs(p,_,!y),gd:null})}function Dm(d,p,_,y){pt(d>>>=0,{name:p=ot(p>>>0),Zc:function(T){return!!T},ed:function(T,z){return z?_:y},dd:function(T){return this.Zc((x(),B)[T>>>0])},gd:null})}var ys=[],Et=[0,1,,1,null,1,!0,1,!1,1];function xi(d){9<(d>>>=0)&&--Et[d+1]===0&&(Et[d]=void 0,ys.push(d))}var Qe=d=>{if(!d)throw new Kt(`Cannot use deleted val. handle = ${d}`);return Et[d]},et=d=>{switch(d){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let p=ys.pop()||Et.length;return Et[p]=d,Et[p+1]=1,p}};function vi(d){return this.Zc((x(),q)[d>>>2>>>0])}var Nm={name:"emscripten::val",Zc:d=>{var p=Qe(d);return xi(d),p},ed:(d,p)=>et(p),dd:vi,gd:null};function Um(d){return pt(d>>>0,Nm)}var Pm=(d,p)=>{switch(p){case 4:return function(_){return this.Zc((x(),j)[_>>>2>>>0])};case 8:return function(_){return this.Zc((x(),P)[_>>>3>>>0])};default:throw new TypeError(`invalid float width (${p}): ${d}`)}};function Lm(d,p,_){_>>>=0,pt(d>>>=0,{name:p=ot(p>>>0),Zc:y=>y,ed:(y,T)=>T,dd:Pm(p,_),gd:null})}function Wm(d,p,_,y,T){d>>>=0,_>>>=0,p=ot(p>>>0);let z=V=>V;if(y===0){var R=32-8*_;z=V=>V<<R>>>R,T=z(T)}pt(d,{name:p,Zc:z,ed:(V,ne)=>ne,dd:gs(p,_,y!==0),gd:null})}function qm(d,p,_){function y(z){var R=(x(),q)[z>>>2>>>0];return z=(x(),q)[z+4>>>2>>>0],new T((x(),N).buffer,z,R)}var T=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][p];pt(d>>>=0,{name:_=ot(_>>>0),Zc:y,dd:y},{Id:!0})}var $t=(d,p,_)=>{var y=(x(),B);if(p>>>=0,0<_){var T=p;_=p+_-1;for(var z=0;z<d.length;++z){var R=d.codePointAt(z);if(127>=R){if(p>=_)break;y[p++>>>0]=R}else if(2047>=R){if(p+1>=_)break;y[p++>>>0]=192|R>>6,y[p++>>>0]=128|63&R}else if(65535>=R){if(p+2>=_)break;y[p++>>>0]=224|R>>12,y[p++>>>0]=128|R>>6&63,y[p++>>>0]=128|63&R}else{if(p+3>=_)break;y[p++>>>0]=240|R>>18,y[p++>>>0]=128|R>>12&63,y[p++>>>0]=128|R>>6&63,y[p++>>>0]=128|63&R,z++}}y[p>>>0]=0,d=p-T}else d=0;return d},Or=d=>{for(var p=0,_=0;_<d.length;++_){var y=d.charCodeAt(_);127>=y?p++:2047>=y?p+=2:55296<=y&&57343>=y?(p+=4,++_):p+=3}return p};function Gm(d,p){pt(d>>>=0,{name:p=ot(p>>>0),Zc(_){var y=(x(),q)[_>>>2>>>0];return y=Ue(_+4,y,!0),lt(_),y},ed(_,y){y instanceof ArrayBuffer&&(y=new Uint8Array(y));var T=typeof y=="string";if(!(T||ArrayBuffer.isView(y)&&y.BYTES_PER_ELEMENT==1))throw new Kt("Cannot pass non-string to std::string");var z=T?Or(y):y.length,R=lr(4+z+1),V=R+4;return(x(),q)[R>>>2>>>0]=z,T?$t(y,V,z+1):(x(),B).set(y,V>>>0),_!==null&&_.push(lt,R),R},dd:vi,gd(_){lt(_)}})}var ws=globalThis.TextDecoder?new TextDecoder("utf-16le"):void 0,Vm=(d,p,_)=>{if(d>>>=1,16<(p=ts((x(),F),d,p/2,_))-d&&ws)return ws.decode((x(),F).slice(d,p));for(_="";d<p;++d){var y=(x(),F)[d>>>0];_+=String.fromCharCode(y)}return _},Hm=(d,p,_)=>{if(_??=2147483647,2>_)return 0;var y=p;_=(_-=2)<2*d.length?_/2:d.length;for(var T=0;T<_;++T){var z=d.charCodeAt(T);(x(),U)[p>>>1>>>0]=z,p+=2}return(x(),U)[p>>>1>>>0]=0,p-y},Fm=d=>2*d.length,jm=(d,p,_)=>{var y="";d>>>=2;for(var T=0;!(T>=p/4);T++){var z=(x(),q)[d+T>>>0];if(!z&&!_)break;y+=String.fromCodePoint(z)}return y},Km=(d,p,_)=>{if(p>>>=0,_??=2147483647,4>_)return 0;var y=p;_=y+_-4;for(var T=0;T<d.length;++T){var z=d.codePointAt(T);if(65535<z&&T++,(x(),O)[p>>>2>>>0]=z,(p+=4)+4>_)break}return(x(),O)[p>>>2>>>0]=0,p-y},Zm=d=>{for(var p=0,_=0;_<d.length;++_)65535<d.codePointAt(_)&&_++,p+=4;return p};function Ym(d,p,_){if(d>>>=0,p>>>=0,_=ot(_>>>=0),p===2)var y=Vm,T=Hm,z=Fm;else y=jm,T=Km,z=Zm;pt(d,{name:_,Zc:R=>{var V=(x(),q)[R>>>2>>>0];return V=y(R+4,V*p,!0),lt(R),V},ed:(R,V)=>{if(typeof V!="string")throw new Kt(`Cannot pass non-string to C++ string type ${_}`);var ne=z(V),se=lr(4+ne+p);return(x(),q)[se>>>2>>>0]=ne/p,T(V,se+4,ne+p),R!==null&&R.push(lt,se),se},dd:vi,gd(R){lt(R)}})}function Qm(d,p){pt(d>>>=0,{Kd:!0,name:p=ot(p>>>0),Zc:()=>{},ed:()=>{}})}function Xm(d){Ai(d>>>0,!i,1,!r,131072,!1),ja()}var Br=d=>{if(!E)try{if(d(),!(0<D))try{n?Wr()&&Oi(f):Pe(f)}catch(p){p instanceof Y||p=="unwind"||l(0,p)}}catch(p){p instanceof Y||p=="unwind"||l(0,p)}},Jm=!Atomics.waitAsync||globalThis.navigator?.userAgent&&91>Number((navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)||[])[2]);function ki(d){d>>>=0,Jm||(Atomics.waitAsync((x(),O),d>>>2,d).value.then(Rr),d+=128,Atomics.store((x(),O),d>>>2,1))}var Rr=()=>Br(()=>{var d=Wr();d&&(ki(d),Fs())});function eg(d,p){(d>>>=0)==p>>>0?setTimeout(Rr):n?postMessage({md:d,bd:"checkMailbox"}):(d=ve[d])&&d.postMessage({bd:"checkMailbox"})}var Si=[];function tg(d,p,_,y,T){for(p>>>=0,T>>>=0,Si.length=0,_=T>>>3,y=T+y>>>3;_<y;){var z;z=(x(),ie)[_++>>>0]?(x(),ie)[_++>>>0]:(x(),P)[_++>>>0],Si.push(z)}return(p?Ni[p]:Hg[d])(...Si)}var rg=()=>{D=0};function ig(d){d>>>=0,n?postMessage({bd:"cleanupThread",Yd:d}):Fa(ve[d])}function ng(d){}var Dr=d=>{try{d()}catch(p){Z(p)}};function ag(d){var p=(..._)=>{Nr.push(d);try{return d(..._)}finally{E||(Nr.pop(),ut&&xt===1&&Nr.length===0&&(xt=0,D+=1,Dr(No),typeof Fibers<"u"&&Fibers.ne()))}};return $s.set(d,p),p}var xt=0,ut=null,_s=0,Nr=[],Ii=new Map,bs=new Map,$s=new Map,sg=0,Ti=null,og=[],xs=d=>(function(p){if(!E){if(xt===0){var _=!1,y=!1;p((T=0)=>{if(!E&&(_s=T,_=!0,y)){xt=2,Dr(()=>Uo(ut)),typeof MainLoop<"u"&&MainLoop.Ed&&MainLoop.resume(),T=!1;try{var z=(function(){var ne=(x(),O)[ut+8>>>2>>>0];return ne=bs.get(ne),ne=$s.get(ne),--D,ne()})()}catch(ne){z=ne,T=!0}var R=!1;if(!ut){var V=Ti;V&&(Ti=null,(T?V.reject:V.resolve)(z),R=!0)}if(T&&!R)throw z}}),y=!0,_||(xt=1,ut=(function(){var T=lr(65548),z=T+12;if((x(),q)[T>>>2>>>0]=z,(x(),q)[T+4>>>2>>>0]=z+65536,z=Nr[0],!Ii.has(z)){var R=sg++;Ii.set(z,R),bs.set(R,z)}return z=Ii.get(z),(x(),O)[T+8>>>2>>>0]=z,T})(),typeof MainLoop<"u"&&MainLoop.Ed&&MainLoop.pause(),Dr(()=>Do(ut)))}else xt===2?(xt=0,Dr(Po),lt(ut),ut=null,og.forEach(Br)):Z(`invalid state: ${xt}`);return _s}})(p=>{d().then(p)});function ug(d){return d>>>=0,xs(async()=>{var p=await Qe(d);return et(p)})}var Ci=[],lg=d=>{var p=Ci.length;return Ci.push(d),p},dg=(d,p)=>{for(var _=Array(d),y=0;y<d;++y){var T=y,z=(x(),q)[p+4*y>>>2>>>0],R=$i[z];if(R===void 0)throw d=`parameter ${y}`,z=Ls(z),p=ot(z),lt(z),new Kt(`${d} has unknown type ${p}`);_[T]=R}return _},cg=(d,p,_)=>{var y=[];return d=d(y,_),y.length&&((x(),q)[p>>>2>>>0]=et(y)),d},pg={},Ur=d=>{var p=pg[d];return p===void 0?ot(d):p};function hg(d,p,_){var[y,...T]=dg(d,p>>>0);p=y.ed.bind(y);var z=T.map(ne=>ne.dd.bind(ne));d--;var R={toValue:Qe};switch(d=z.map((ne,se)=>{var _e=`argFromPtr${se}`;return R[_e]=ne,`${_e}(args${se?"+"+8*se:""})`}),_){case 0:var V="toValue(handle)";break;case 2:V="new (toValue(handle))";break;case 3:V="";break;case 1:R.getStringOrSymbol=Ur,V="toValue(handle)[getStringOrSymbol(methodName)]"}return V+=`(${d})`,y.Kd||(R.toReturnWire=p,R.emval_returnValue=cg,V=`return emval_returnValue(toReturnWire, destructorsRef, ${V})`),V=`return function (handle, methodName, destructorsRef, args) {
  ${V}
  }`,_=new Function(Object.keys(R),V)(...Object.values(R)),V=`methodCaller<(${T.map(ne=>ne.name)}) => ${y.name}>`,lg(Object.defineProperty(_,"name",{value:V}))}function fg(d,p){return p>>>=0,(d=Qe(d>>>0))==Qe(p)}function mg(d){return(d>>>=0)?(d=Ur(d),et(globalThis[d])):et(globalThis)}function gg(d){return d=Ur(d>>>0),et(t[d])}function yg(d,p){return p>>>=0,d=Qe(d>>>0),p=Qe(p),et(d[p])}function wg(d){9<(d>>>=0)&&(Et[d+1]+=1)}function vs(d,p,_,y,T){return Ci[d>>>0](p>>>0,_>>>0,y>>>0,T>>>0)}function _g(d,p,_,y,T){return vs(d>>>0,p>>>0,_>>>0,y>>>0,T>>>0)}function bg(){return et([])}function $g(d){d=Qe(d>>>0);for(var p=Array(d.length),_=0;_<d.length;_++)p[_]=d[_];return et(p)}function xg(d){return et(Ur(d>>>0))}function vg(){return et({})}function kg(d){for(var p=Qe(d>>>=0);p.length;){var _=p.pop();p.pop()(_)}xi(d)}function Sg(d,p,_){p>>>=0,_>>>=0,d=Qe(d>>>0),p=Qe(p),_=Qe(_),d[p]=_}function Ig(d,p){d=-9007199254740992>d||9007199254740992<d?NaN:Number(d),p>>>=0,d=new Date(1e3*d),(x(),O)[p>>>2>>>0]=d.getUTCSeconds(),(x(),O)[p+4>>>2>>>0]=d.getUTCMinutes(),(x(),O)[p+8>>>2>>>0]=d.getUTCHours(),(x(),O)[p+12>>>2>>>0]=d.getUTCDate(),(x(),O)[p+16>>>2>>>0]=d.getUTCMonth(),(x(),O)[p+20>>>2>>>0]=d.getUTCFullYear()-1900,(x(),O)[p+24>>>2>>>0]=d.getUTCDay(),d=(d.getTime()-Date.UTC(d.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,(x(),O)[p+28>>>2>>>0]=d}var ks=d=>d%4==0&&(d%100!=0||d%400==0),Ss=[0,31,60,91,121,152,182,213,244,274,305,335],Is=[0,31,59,90,120,151,181,212,243,273,304,334];function Tg(d,p){d=-9007199254740992>d||9007199254740992<d?NaN:Number(d),p>>>=0,d=new Date(1e3*d),(x(),O)[p>>>2>>>0]=d.getSeconds(),(x(),O)[p+4>>>2>>>0]=d.getMinutes(),(x(),O)[p+8>>>2>>>0]=d.getHours(),(x(),O)[p+12>>>2>>>0]=d.getDate(),(x(),O)[p+16>>>2>>>0]=d.getMonth(),(x(),O)[p+20>>>2>>>0]=d.getFullYear()-1900,(x(),O)[p+24>>>2>>>0]=d.getDay();var _=(ks(d.getFullYear())?Ss:Is)[d.getMonth()]+d.getDate()-1|0;(x(),O)[p+28>>>2>>>0]=_,(x(),O)[p+36>>>2>>>0]=-60*d.getTimezoneOffset(),_=new Date(d.getFullYear(),6,1).getTimezoneOffset();var y=new Date(d.getFullYear(),0,1).getTimezoneOffset();d=0|(_!=y&&d.getTimezoneOffset()==Math.min(y,_)),(x(),O)[p+32>>>2>>>0]=d}function Cg(d){d>>>=0;var p=new Date((x(),O)[d+20>>>2>>>0]+1900,(x(),O)[d+16>>>2>>>0],(x(),O)[d+12>>>2>>>0],(x(),O)[d+8>>>2>>>0],(x(),O)[d+4>>>2>>>0],(x(),O)[d>>>2>>>0],0),_=(x(),O)[d+32>>>2>>>0],y=p.getTimezoneOffset(),T=new Date(p.getFullYear(),6,1).getTimezoneOffset(),z=new Date(p.getFullYear(),0,1).getTimezoneOffset(),R=Math.min(z,T);return 0>_?(x(),O)[d+32>>>2>>>0]=+(T!=z&&R==y):0<_!=(R==y)&&(T=Math.max(z,T),p.setTime(p.getTime()+6e4*((0<_?R:T)-y))),(x(),O)[d+24>>>2>>>0]=p.getDay(),_=(ks(p.getFullYear())?Ss:Is)[p.getMonth()]+p.getDate()-1|0,(x(),O)[d+28>>>2>>>0]=_,(x(),O)[d>>>2>>>0]=p.getSeconds(),(x(),O)[d+4>>>2>>>0]=p.getMinutes(),(x(),O)[d+8>>>2>>>0]=p.getHours(),(x(),O)[d+12>>>2>>>0]=p.getDate(),(x(),O)[d+16>>>2>>>0]=p.getMonth(),(x(),O)[d+20>>>2>>>0]=p.getYear(),d=p.getTime(),BigInt(isNaN(d)?-1:d/1e3)}function Ts(d,p,_,y,T,z,R){return n?K(16,1,d,p,_,y,T,z,R):-52}function Cs(d,p,_,y,T,z){if(n)return K(17,1,d,p,_,y,T,z)}var ur={},Eg=()=>performance.timeOrigin+performance.now();function Es(d,p){if(n)return K(18,1,d,p);if(ur[d]&&(clearTimeout(ur[d].id),delete ur[d]),!p)return 0;var _=setTimeout(()=>{delete ur[d],Br(()=>Hs(d,performance.timeOrigin+performance.now()))},p);return ur[d]={id:_,me:p},0}function zg(d,p,_,y){d>>>=0,p>>>=0,_>>>=0,y>>>=0;var T=new Date().getFullYear(),z=new Date(T,0,1).getTimezoneOffset();T=new Date(T,6,1).getTimezoneOffset();var R=Math.max(z,T);(x(),q)[d>>>2>>>0]=60*R,(x(),O)[p>>>2>>>0]=+(z!=T),d=(p=V=>{var ne=Math.abs(V);return`UTC${0<=V?"-":"+"}${String(Math.floor(ne/60)).padStart(2,"0")}${String(ne%60).padStart(2,"0")}`})(z),p=p(T),T<z?($t(d,_,17),$t(p,y,17)):($t(d,y,17),$t(p,_,17))}var Mg=()=>Date.now();function Ag(d,p,_){return _>>>=0,0<=d&&3>=d?(d===0?d=Date.now():d=performance.timeOrigin+performance.now(),d=Math.round(1e6*d),(x(),ie)[_>>>3>>>0]=BigInt(d),0):28}var Ei=[],zs=(d,p)=>{Ei.length=0;for(var _;_=(x(),B)[d++>>>0];){var y=_!=105;p+=(y&=_!=112)&&p%8?4:0,Ei.push(_==112?(x(),q)[p>>>2>>>0]:_==106?(x(),ie)[p>>>3>>>0]:_==105?(x(),O)[p>>>2>>>0]:(x(),P)[p>>>3>>>0]),p+=y?8:4}return Ei};function Og(d,p,_){return d>>>=0,p=zs(p>>>0,_>>>0),Ni[d](...p)}function Bg(d,p,_){return d>>>=0,p=zs(p>>>0,_>>>0),Ni[d](...p)}var Rg=()=>{};function Dg(d,p){return S(Ue(d>>>0,p>>>0))}var Ng=()=>{throw D+=1,"unwind"};function Ug(){return 4294901760}var Pg=()=>navigator.hardwareConcurrency,zt={},Pr=d=>{var p;return(p=/\bwasm-function\[\d+\]:(0x[0-9a-f]+)/.exec(d))?+p[1]:(p=/:(\d+):\d+(?:\)|$)/.exec(d))?2147483648|+p[1]:0},Ms=d=>{for(var p of d)(d=Pr(p))&&(zt[d]=p)};function Lg(){var d=Error().stack.toString().split(`
`);return d[0]=="Error"&&d.shift(),Ms(d),zt.sd=Pr(d[3]),zt.Ud=d,zt.sd}function Lr(d){if(!(d=zt[d>>>0]))return 0;var p;if(p=/^\s+at .*\.wasm\.(.*) \(.*\)$/.exec(d))d=p[1];else if(p=/^\s+at (.*) \(.*\)$/.exec(d))d=p[1];else{if(!(p=/^(.+?)@/.exec(d)))return 0;d=p[1]}lt(Lr.td??0),p=Or(d)+1;var _=lr(p);return _&&$t(d,_,p),Lr.td=_,Lr.td}function Wg(d){d>>>=0;var p=(x(),B).length;if(d<=p||4294901760<d)return!1;for(var _=1;4>=_;_*=2){var y=p*(1+.2/_);y=Math.min(y,d+100663296);e:{y=(Math.min(4294901760,65536*Math.ceil(Math.max(d,y)/65536))-bt.buffer.byteLength+65535)/65536|0;try{bt.grow(y),W();var T=1;break e}catch{}T=void 0}if(T)return!0}return!1}function qg(d,p,_){if(d>>>=0,p>>>=0,zt.sd==d)var y=zt.Ud;else(y=Error().stack.toString().split(`
`))[0]=="Error"&&y.shift(),Ms(y);for(var T=3;y[T]&&Pr(y[T])!=d;)++T;for(d=0;d<_&&y[d+T];++d)(x(),O)[p+4*d>>>2>>>0]=Pr(y[d+T]);return d}var zi,Mi={},As=()=>{if(!zi){var d,p={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(globalThis.navigator?.language??"C").replace("-","_")+".UTF-8",_:"./this.program"};for(d in Mi)Mi[d]===void 0?delete p[d]:p[d]=Mi[d];var _=[];for(d in p)_.push(`${d}=${p[d]}`);zi=_}return zi};function Os(d,p){if(n)return K(19,1,d,p);d>>>=0,p>>>=0;var _,y=0,T=0;for(_ of As()){var z=p+y;(x(),q)[d+T>>>2>>>0]=z,y+=$t(_,z,1/0)+1,T+=4}return 0}function Bs(d,p){if(n)return K(20,1,d,p);d>>>=0,p>>>=0;var _=As();for(var y of((x(),q)[d>>>2>>>0]=_.length,d=0,_))d+=Or(y)+1;return(x(),q)[p>>>2>>>0]=d,0}function Rs(d){return n?K(21,1,d):52}function Ds(d,p,_,y,T){return n?K(22,1,d,p,_,y,T):52}function Ns(d,p,_,y){return n?K(23,1,d,p,_,y):52}function Us(d,p,_,y){return n?K(24,1,d,p,_,y):70}var Gg=[null,[],[]];function Ps(d,p,_,y){if(n)return K(25,1,d,p,_,y);p>>>=0,_>>>=0,y>>>=0;for(var T=0,z=0;z<_;z++){var R=(x(),q)[p>>>2>>>0],V=(x(),q)[p+4>>>2>>>0];p+=8;for(var ne=0;ne<V;ne++){var se=d,_e=(x(),B)[R+ne>>>0],Se=Gg[se];_e===0||_e===10?((se===1?I:S)(rs(Se)),Se.length=0):Se.push(_e)}T+=V}return(x(),q)[y>>>2>>>0]=T,0}function Vg(d){return d>>>0}n||(function(){for(var d=t.numThreads-1;d--;)Za();re.push(async()=>{var p=(async function(){if(!n)return Promise.all(De.map(Ka))})();ee++,await p,--ee==0&&oe&&(p=oe,oe=null,p())})})(),n||(bt=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0}),W()),t.wasmBinary&&(m=t.wasmBinary),t.stackSave=()=>$e(),t.stackRestore=d=>be(d),t.stackAlloc=d=>Bi(d),t.setValue=function(d,p,_="i8"){switch(_.endsWith("*")&&(_="*"),_){case"i1":case"i8":(x(),N)[d>>>0]=p;break;case"i16":(x(),U)[d>>>1>>>0]=p;break;case"i32":(x(),O)[d>>>2>>>0]=p;break;case"i64":(x(),ie)[d>>>3>>>0]=BigInt(p);break;case"float":(x(),j)[d>>>2>>>0]=p;break;case"double":(x(),P)[d>>>3>>>0]=p;break;case"*":(x(),q)[d>>>2>>>0]=p;break;default:Z(`invalid type for setValue: ${_}`)}},t.getValue=function(d,p="i8"){switch(p.endsWith("*")&&(p="*"),p){case"i1":case"i8":return(x(),N)[d>>>0];case"i16":return(x(),U)[d>>>1>>>0];case"i32":return(x(),O)[d>>>2>>>0];case"i64":return(x(),ie)[d>>>3>>>0];case"float":return(x(),j)[d>>>2>>>0];case"double":return(x(),P)[d>>>3>>>0];case"*":return(x(),q)[d>>>2>>>0];default:Z(`invalid type for getValue: ${p}`)}},t.UTF8ToString=Ue,t.stringToUTF8=$t,t.lengthBytesUTF8=Or;var Ls,Ws,Wr,lt,lr,Ai,qs,Gs,Vs,Oi,Hs,Fs,xe,dr,js,be,Bi,$e,Ks,Ri,Zs,Ys,Qs,Di,Xs,Js,eo,to,ro,io,no,ao,so,oo,uo,lo,co,po,ho,fo,mo,go,yo,wo,_o,bo,$o,xo,vo,ko,So,Io,To,Co,Eo,zo,Mo,Ao,Oo,Bo,Ro,Do,No,Uo,Po,ht,Hg=[le,Ae,Xa,is,ns,as,ss,os,us,ls,ds,cs,ps,hs,fs,ms,Ts,Cs,Es,Os,Bs,Rs,Ds,Ns,Us,Ps],Ni={1124124:(d,p,_,y,T)=>{if(t===void 0||!t.jd)return 1;if((d=Ue(Number(d>>>0))).startsWith("./")&&(d=d.substring(2)),!(d=t.jd.get(d)))return 2;if(p=Number(p>>>0),_=Number(_>>>0),y=Number(y>>>0),p+_>d.byteLength)return 3;try{let z=d.subarray(p,p+_);switch(T){case 0:(x(),B).set(z,y>>>0);break;case 1:t.ae?t.ae(y,z):t.Td(y,z);break;default:return 4}return 0}catch{return 4}},1124948:()=>typeof navigator<"u"&&navigator.de?1:0,1125020:(d,p,_)=>{t.Dd(d,(x(),B).subarray(p>>>0,p+_>>>0))},1125084:()=>t.ce(),1125126:d=>{t.Cd(d)},1125163:()=>{t.Md()},1125194:()=>{t.Nd()},1125223:()=>{t.Rd()},1125248:d=>t.Ld(d),1125281:d=>t.Pd(d),1125313:(d,p,_)=>{t.rd(Number(d),Number(p),Number(_),!0)},1125376:(d,p,_)=>{t.rd(Number(d),Number(p),Number(_))},1125433:()=>typeof wasmOffsetConverter<"u",1125490:d=>{t.ic("Abs",d,void 0)},1125541:d=>{t.ic("Neg",d,void 0)},1125592:d=>{t.ic("Floor",d,void 0)},1125645:d=>{t.ic("Ceil",d,void 0)},1125697:d=>{t.ic("Reciprocal",d,void 0)},1125755:d=>{t.ic("Sqrt",d,void 0)},1125807:d=>{t.ic("Exp",d,void 0)},1125858:d=>{t.ic("Erf",d,void 0)},1125909:d=>{t.ic("Sigmoid",d,void 0)},1125964:(d,p,_)=>{t.ic("HardSigmoid",d,{alpha:p,beta:_})},1126043:d=>{t.ic("HardSwish",d,void 0)},1126100:d=>{t.ic("Log",d,void 0)},1126151:d=>{t.ic("Sin",d,void 0)},1126202:d=>{t.ic("Cos",d,void 0)},1126253:d=>{t.ic("Tan",d,void 0)},1126304:d=>{t.ic("Asin",d,void 0)},1126356:d=>{t.ic("Acos",d,void 0)},1126408:d=>{t.ic("Atan",d,void 0)},1126460:d=>{t.ic("Sinh",d,void 0)},1126512:d=>{t.ic("Cosh",d,void 0)},1126564:d=>{t.ic("Asinh",d,void 0)},1126617:d=>{t.ic("Acosh",d,void 0)},1126670:d=>{t.ic("Atanh",d,void 0)},1126723:d=>{t.ic("Tanh",d,void 0)},1126775:d=>{t.ic("Not",d,void 0)},1126826:(d,p,_)=>{t.ic("Clip",d,{min:p,max:_})},1126895:d=>{t.ic("Clip",d,void 0)},1126947:(d,p)=>{t.ic("Elu",d,{alpha:p})},1127005:d=>{t.ic("Gelu",d,void 0)},1127057:d=>{t.ic("Relu",d,void 0)},1127109:(d,p)=>{t.ic("LeakyRelu",d,{alpha:p})},1127173:(d,p)=>{t.ic("ThresholdedRelu",d,{alpha:p})},1127243:(d,p)=>{t.ic("Cast",d,{to:p})},1127301:d=>{t.ic("Add",d,void 0)},1127352:d=>{t.ic("Sub",d,void 0)},1127403:d=>{t.ic("Mul",d,void 0)},1127454:d=>{t.ic("Div",d,void 0)},1127505:d=>{t.ic("Pow",d,void 0)},1127556:d=>{t.ic("Equal",d,void 0)},1127609:d=>{t.ic("Greater",d,void 0)},1127664:d=>{t.ic("GreaterOrEqual",d,void 0)},1127726:d=>{t.ic("Less",d,void 0)},1127778:d=>{t.ic("LessOrEqual",d,void 0)},1127837:(d,p,_,y,T)=>{t.ic("ReduceMean",d,{keepDims:!!p,noopWithEmptyAxes:!!_,axes:y?Array.from((x(),O).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1128012:(d,p,_,y,T)=>{t.ic("ReduceMax",d,{keepDims:!!p,noopWithEmptyAxes:!!_,axes:y?Array.from((x(),O).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1128186:(d,p,_,y,T)=>{t.ic("ReduceMin",d,{keepDims:!!p,noopWithEmptyAxes:!!_,axes:y?Array.from((x(),O).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1128360:(d,p,_,y,T)=>{t.ic("ReduceProd",d,{keepDims:!!p,noopWithEmptyAxes:!!_,axes:y?Array.from((x(),O).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1128535:(d,p,_,y,T)=>{t.ic("ReduceSum",d,{keepDims:!!p,noopWithEmptyAxes:!!_,axes:y?Array.from((x(),O).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1128709:(d,p,_,y,T)=>{t.ic("ReduceL1",d,{keepDims:!!p,noopWithEmptyAxes:!!_,axes:y?Array.from((x(),O).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1128882:(d,p,_,y,T)=>{t.ic("ReduceL2",d,{keepDims:!!p,noopWithEmptyAxes:!!_,axes:y?Array.from((x(),O).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1129055:(d,p,_,y,T)=>{t.ic("ReduceLogSum",d,{keepDims:!!p,noopWithEmptyAxes:!!_,axes:y?Array.from((x(),O).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1129232:(d,p,_,y,T)=>{t.ic("ReduceSumSquare",d,{keepDims:!!p,noopWithEmptyAxes:!!_,axes:y?Array.from((x(),O).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1129412:(d,p,_,y,T)=>{t.ic("ReduceLogSumExp",d,{keepDims:!!p,noopWithEmptyAxes:!!_,axes:y?Array.from((x(),O).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1129592:d=>{t.ic("Where",d,void 0)},1129645:(d,p,_)=>{t.ic("Transpose",d,{perm:p?Array.from((x(),O).subarray(Number(p)>>>0,Number(_)>>>0)):[]})},1129769:(d,p,_,y)=>{t.ic("DepthToSpace",d,{blocksize:p,mode:Ue(_),format:y?"NHWC":"NCHW"})},1129902:(d,p,_,y)=>{t.ic("DepthToSpace",d,{blocksize:p,mode:Ue(_),format:y?"NHWC":"NCHW"})},1130035:(d,p,_,y)=>{t.ic("DFT",d,{axis:p,inverse:_,onesided:y})},1130127:(d,p,_,y,T,z,R,V,ne,se,_e,Se,Me,Oe,vt)=>{t.ic("ConvTranspose",d,{format:ne?"NHWC":"NCHW",autoPad:p,dilations:[_],group:y,kernelShape:[T],pads:[z,R],strides:[V],wIsConst:()=>!!(x(),N)[se>>>0],outputPadding:_e?Array.from((x(),O).subarray(Number(_e)>>>0,Number(Se)>>>0)):[],outputShape:Me?Array.from((x(),O).subarray(Number(Me)>>>0,Number(Oe)>>>0)):[],activation:Ue(vt)})},1130560:(d,p,_,y,T,z,R,V,ne,se,_e,Se,Me,Oe)=>{t.ic("ConvTranspose",d,{format:V?"NHWC":"NCHW",autoPad:p,dilations:Array.from((x(),O).subarray(Number(_)>>>0,(Number(_)>>>0)+2>>>0)),group:y,kernelShape:Array.from((x(),O).subarray(Number(T)>>>0,(Number(T)>>>0)+2>>>0)),pads:Array.from((x(),O).subarray(Number(z)>>>0,(Number(z)>>>0)+4>>>0)),strides:Array.from((x(),O).subarray(Number(R)>>>0,(Number(R)>>>0)+2>>>0)),wIsConst:()=>!!(x(),N)[ne>>>0],outputPadding:se?Array.from((x(),O).subarray(Number(se)>>>0,Number(_e)>>>0)):[],outputShape:Se?Array.from((x(),O).subarray(Number(Se)>>>0,Number(Me)>>>0)):[],activation:Ue(Oe)})},1131221:(d,p,_,y,T,z,R,V,ne,se,_e,Se,Me,Oe,vt)=>{t.ic("ConvTranspose",d,{format:ne?"NHWC":"NCHW",autoPad:p,dilations:[_],group:y,kernelShape:[T],pads:[z,R],strides:[V],wIsConst:()=>!!(x(),N)[se>>>0],outputPadding:_e?Array.from((x(),O).subarray(Number(_e)>>>0,Number(Se)>>>0)):[],outputShape:Me?Array.from((x(),O).subarray(Number(Me)>>>0,Number(Oe)>>>0)):[],activation:Ue(vt)})},1131654:(d,p,_,y,T,z,R,V,ne,se,_e,Se,Me,Oe)=>{t.ic("ConvTranspose",d,{format:V?"NHWC":"NCHW",autoPad:p,dilations:Array.from((x(),O).subarray(Number(_)>>>0,(Number(_)>>>0)+2>>>0)),group:y,kernelShape:Array.from((x(),O).subarray(Number(T)>>>0,(Number(T)>>>0)+2>>>0)),pads:Array.from((x(),O).subarray(Number(z)>>>0,(Number(z)>>>0)+4>>>0)),strides:Array.from((x(),O).subarray(Number(R)>>>0,(Number(R)>>>0)+2>>>0)),wIsConst:()=>!!(x(),N)[ne>>>0],outputPadding:se?Array.from((x(),O).subarray(Number(se)>>>0,Number(_e)>>>0)):[],outputShape:Se?Array.from((x(),O).subarray(Number(Se)>>>0,Number(Me)>>>0)):[],activation:Ue(Oe)})},1132315:(d,p)=>{t.ic("GlobalAveragePool",d,{format:p?"NHWC":"NCHW"})},1132406:(d,p,_,y,T,z,R,V,ne,se,_e,Se,Me,Oe)=>{t.ic("AveragePool",d,{format:Oe?"NHWC":"NCHW",auto_pad:p,ceil_mode:_,count_include_pad:y,storage_order:T,dilations:z?Array.from((x(),O).subarray(Number(z)>>>0,Number(R)>>>0)):[],kernel_shape:V?Array.from((x(),O).subarray(Number(V)>>>0,Number(ne)>>>0)):[],pads:se?Array.from((x(),O).subarray(Number(se)>>>0,Number(_e)>>>0)):[],strides:Se?Array.from((x(),O).subarray(Number(Se)>>>0,Number(Me)>>>0)):[]})},1132885:(d,p)=>{t.ic("GlobalAveragePool",d,{format:p?"NHWC":"NCHW"})},1132976:(d,p,_,y,T,z,R,V,ne,se,_e,Se,Me,Oe)=>{t.ic("AveragePool",d,{format:Oe?"NHWC":"NCHW",auto_pad:p,ceil_mode:_,count_include_pad:y,storage_order:T,dilations:z?Array.from((x(),O).subarray(Number(z)>>>0,Number(R)>>>0)):[],kernel_shape:V?Array.from((x(),O).subarray(Number(V)>>>0,Number(ne)>>>0)):[],pads:se?Array.from((x(),O).subarray(Number(se)>>>0,Number(_e)>>>0)):[],strides:Se?Array.from((x(),O).subarray(Number(Se)>>>0,Number(Me)>>>0)):[]})},1133455:(d,p)=>{t.ic("GlobalMaxPool",d,{format:p?"NHWC":"NCHW"})},1133542:(d,p,_,y,T,z,R,V,ne,se,_e,Se,Me,Oe)=>{t.ic("MaxPool",d,{format:Oe?"NHWC":"NCHW",auto_pad:p,ceil_mode:_,count_include_pad:y,storage_order:T,dilations:z?Array.from((x(),O).subarray(Number(z)>>>0,Number(R)>>>0)):[],kernel_shape:V?Array.from((x(),O).subarray(Number(V)>>>0,Number(ne)>>>0)):[],pads:se?Array.from((x(),O).subarray(Number(se)>>>0,Number(_e)>>>0)):[],strides:Se?Array.from((x(),O).subarray(Number(Se)>>>0,Number(Me)>>>0)):[]})},1134017:(d,p)=>{t.ic("GlobalMaxPool",d,{format:p?"NHWC":"NCHW"})},1134104:(d,p,_,y,T,z,R,V,ne,se,_e,Se,Me,Oe)=>{t.ic("MaxPool",d,{format:Oe?"NHWC":"NCHW",auto_pad:p,ceil_mode:_,count_include_pad:y,storage_order:T,dilations:z?Array.from((x(),O).subarray(Number(z)>>>0,Number(R)>>>0)):[],kernel_shape:V?Array.from((x(),O).subarray(Number(V)>>>0,Number(ne)>>>0)):[],pads:se?Array.from((x(),O).subarray(Number(se)>>>0,Number(_e)>>>0)):[],strides:Se?Array.from((x(),O).subarray(Number(Se)>>>0,Number(Me)>>>0)):[]})},1134579:(d,p,_,y,T)=>{t.ic("Gemm",d,{alpha:p,beta:_,transA:y,transB:T})},1134683:d=>{t.ic("MatMul",d,void 0)},1134737:(d,p,_,y)=>{t.ic("ArgMax",d,{keepDims:!!p,selectLastIndex:!!_,axis:y})},1134845:(d,p,_,y)=>{t.ic("ArgMin",d,{keepDims:!!p,selectLastIndex:!!_,axis:y})},1134953:(d,p)=>{t.ic("Softmax",d,{axis:p})},1135016:(d,p)=>{t.ic("Concat",d,{axis:p})},1135076:(d,p,_,y,T)=>{t.ic("Split",d,{axis:p,numOutputs:_,splitSizes:y?Array.from((x(),O).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1135232:d=>{t.ic("Expand",d,void 0)},1135286:(d,p)=>{t.ic("Gather",d,{axis:Number(p)})},1135357:(d,p)=>{t.ic("GatherElements",d,{axis:Number(p)})},1135436:(d,p)=>{t.ic("GatherND",d,{batch_dims:Number(p)})},1135515:(d,p,_,y,T,z,R,V,ne,se,_e)=>{t.ic("Resize",d,{antialias:p,axes:_?Array.from((x(),O).subarray(Number(_)>>>0,Number(y)>>>0)):[],coordinateTransformMode:Ue(T),cubicCoeffA:z,excludeOutside:R,extrapolationValue:V,keepAspectRatioPolicy:Ue(ne),mode:Ue(se),nearestMode:Ue(_e)})},1135877:(d,p,_,y,T,z,R)=>{t.ic("Slice",d,{starts:p?Array.from((x(),O).subarray(Number(p)>>>0,Number(_)>>>0)):[],ends:y?Array.from((x(),O).subarray(Number(y)>>>0,Number(T)>>>0)):[],axes:z?Array.from((x(),O).subarray(Number(z)>>>0,Number(R)>>>0)):[]})},1136141:d=>{t.ic("Tile",d,void 0)},1136193:(d,p,_)=>{t.ic("InstanceNormalization",d,{epsilon:p,format:_?"NHWC":"NCHW"})},1136307:(d,p,_)=>{t.ic("InstanceNormalization",d,{epsilon:p,format:_?"NHWC":"NCHW"})},1136421:d=>{t.ic("Range",d,void 0)},1136474:(d,p)=>{t.ic("Einsum",d,{equation:Ue(p)})},1136555:(d,p,_,y,T)=>{t.ic("Pad",d,{mode:p,value:_,pads:y?Array.from((x(),O).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1136698:(d,p,_,y,T,z)=>{t.ic("BatchNormalization",d,{epsilon:p,momentum:_,spatial:!!T,trainingMode:!!y,format:z?"NHWC":"NCHW"})},1136867:(d,p,_,y,T,z)=>{t.ic("BatchNormalization",d,{epsilon:p,momentum:_,spatial:!!T,trainingMode:!!y,format:z?"NHWC":"NCHW"})},1137036:(d,p,_)=>{t.ic("CumSum",d,{exclusive:Number(p),reverse:Number(_)})},1137133:(d,p,_)=>{t.ic("DequantizeLinear",d,{axis:p,blockSize:_})},1137223:(d,p,_,y,T)=>{t.ic("GridSample",d,{align_corners:p,mode:Ue(_),padding_mode:Ue(y),format:T?"NHWC":"NCHW"})},1137393:(d,p,_,y,T)=>{t.ic("GridSample",d,{align_corners:p,mode:Ue(_),padding_mode:Ue(y),format:T?"NHWC":"NCHW"})},1137563:(d,p)=>{t.ic("ScatterND",d,{reduction:Ue(p)})},1137648:(d,p,_,y,T,z,R,V,ne)=>{t.ic("Attention",d,{numHeads:p,isUnidirectional:_,maskFilterValue:y,scale:T,doRotary:z,qkvHiddenSizes:R?Array.from((x(),O).subarray(Number(V)>>>0,Number(V)+R>>>0)):[],pastPresentShareBuffer:!!ne})},1137920:d=>{t.ic("BiasAdd",d,void 0)},1137975:d=>{t.ic("BiasSplitGelu",d,void 0)},1138036:d=>{t.ic("FastGelu",d,void 0)},1138092:(d,p,_,y,T,z,R,V,ne,se,_e,Se,Me,Oe,vt,Ui)=>{t.ic("Conv",d,{format:Se?"NHWC":"NCHW",auto_pad:p,dilations:_?Array.from((x(),O).subarray(Number(_)>>>0,Number(y)>>>0)):[],group:T,kernel_shape:z?Array.from((x(),O).subarray(Number(z)>>>0,Number(R)>>>0)):[],pads:V?Array.from((x(),O).subarray(Number(V)>>>0,Number(ne)>>>0)):[],strides:se?Array.from((x(),O).subarray(Number(se)>>>0,Number(_e)>>>0)):[],w_is_const:()=>!!(x(),N)[Number(Me)>>>0],activation:Ue(Oe),activation_params:vt?Array.from((x(),j).subarray(Number(vt)>>>0,Number(Ui)>>>0)):[]})},1138676:d=>{t.ic("Gelu",d,void 0)},1138728:(d,p,_,y,T,z,R,V,ne)=>{t.ic("GroupQueryAttention",d,{numHeads:p,kvNumHeads:_,scale:y,softcap:T,doRotary:z,rotaryInterleaved:R,smoothSoftmax:V,localWindowSize:ne})},1138945:(d,p,_,y)=>{t.ic("LayerNormalization",d,{axis:p,epsilon:_,simplified:!!y})},1139056:(d,p,_,y)=>{t.ic("LayerNormalization",d,{axis:p,epsilon:_,simplified:!!y})},1139167:(d,p,_,y,T,z)=>{t.ic("MatMulNBits",d,{k:p,n:_,accuracyLevel:y,bits:T,blockSize:z})},1139294:(d,p,_,y,T,z)=>{t.ic("MultiHeadAttention",d,{numHeads:p,isUnidirectional:_,maskFilterValue:y,scale:T,doRotary:z})},1139453:(d,p)=>{t.ic("QuickGelu",d,{alpha:p})},1139517:(d,p,_,y,T)=>{t.ic("RotaryEmbedding",d,{interleaved:!!p,numHeads:_,rotaryEmbeddingDim:y,scale:T})},1139656:(d,p,_)=>{t.ic("SkipLayerNormalization",d,{epsilon:p,simplified:!!_})},1139758:(d,p,_)=>{t.ic("SkipLayerNormalization",d,{epsilon:p,simplified:!!_})},1139860:(d,p,_,y)=>{t.ic("GatherBlockQuantized",d,{gatherAxis:p,quantizeAxis:_,blockSize:y})},1139981:d=>{t.Qd(d)},1140015:(d,p)=>t.Sd(Number(d),Number(p),t.hd.Vd,t.hd.errors)};function Fg(d,p,_){return xs(async()=>{await t.Od(Number(d),Number(p),Number(_))})}function jg(){return typeof wasmOffsetConverter<"u"}function Kg(d,p,_,y){var T=$e();try{return so(d,p,_,y)}catch(z){if(be(T),z!==z+0)throw z;xe(1,0)}}function Zg(d,p,_){var y=$e();try{return no(d,p,_)}catch(T){if(be(y),T!==T+0)throw T;xe(1,0)}}function Yg(d){var p=$e();try{ro(d)}catch(_){if(be(p),_!==_+0)throw _;xe(1,0)}}function Qg(d,p){var _=$e();try{return Di(d,p)}catch(y){if(be(_),y!==y+0)throw y;xe(1,0)}}function Xg(d,p,_){var y=$e();try{Qs(d,p,_)}catch(T){if(be(y),T!==T+0)throw T;xe(1,0)}}function Jg(d,p,_,y){var T=$e();try{return po(d,p,_,y)}catch(z){if(be(T),z!==z+0)throw z;xe(1,0)}}function e0(d,p){var _=$e();try{oo(d,p)}catch(y){if(be(_),y!==y+0)throw y;xe(1,0)}}function t0(d,p,_,y,T,z,R){var V=$e();try{return ao(d,p,_,y,T,z,R)}catch(ne){if(be(V),ne!==ne+0)throw ne;xe(1,0)}}function r0(d,p,_,y,T,z){var R=$e();try{Xs(d,p,_,y,T,z)}catch(V){if(be(R),V!==V+0)throw V;xe(1,0)}}function i0(d,p,_,y){var T=$e();try{eo(d,p,_,y)}catch(z){if(be(T),z!==z+0)throw z;xe(1,0)}}function n0(d,p,_,y,T){var z=$e();try{io(d,p,_,y,T)}catch(R){if(be(z),R!==R+0)throw R;xe(1,0)}}function a0(d,p,_,y,T,z,R){var V=$e();try{lo(d,p,_,y,T,z,R)}catch(ne){if(be(V),ne!==ne+0)throw ne;xe(1,0)}}function s0(d,p,_,y,T,z,R){var V=$e();try{co(d,p,_,y,T,z,R)}catch(ne){if(be(V),ne!==ne+0)throw ne;xe(1,0)}}function o0(d,p,_,y,T,z,R,V){var ne=$e();try{go(d,p,_,y,T,z,R,V)}catch(se){if(be(ne),se!==se+0)throw se;xe(1,0)}}function u0(d,p,_,y,T){var z=$e();try{return uo(d,p,_,y,T)}catch(R){if(be(z),R!==R+0)throw R;xe(1,0)}}function l0(d,p,_){var y=$e();try{return to(d,p,_)}catch(T){if(be(y),T!==T+0)throw T;xe(1,0)}}function d0(d,p,_,y,T,z,R,V){var ne=$e();try{yo(d,p,_,y,T,z,R,V)}catch(se){if(be(ne),se!==se+0)throw se;xe(1,0)}}function c0(d,p,_,y,T,z,R,V,ne,se,_e,Se){var Me=$e();try{ho(d,p,_,y,T,z,R,V,ne,se,_e,Se)}catch(Oe){if(be(Me),Oe!==Oe+0)throw Oe;xe(1,0)}}function p0(d,p,_){var y=$e();try{return wo(d,p,_)}catch(T){if(be(y),T!==T+0)throw T;return xe(1,0),0n}}function h0(d,p,_,y,T,z,R,V,ne){var se=$e();try{Js(d,p,_,y,T,z,R,V,ne)}catch(_e){if(be(se),_e!==_e+0)throw _e;xe(1,0)}}function f0(d){var p=$e();try{return _o(d)}catch(_){if(be(p),_!==_+0)throw _;xe(1,0)}}function m0(d,p){var _=$e();try{return Bo(d,p)}catch(y){if(be(_),y!==y+0)throw y;return xe(1,0),0n}}function g0(d,p,_,y){var T=$e();try{return bo(d,p,_,y)}catch(z){if(be(T),z!==z+0)throw z;xe(1,0)}}function y0(d,p,_,y,T,z,R){var V=$e();try{Ro(d,p,_,y,T,z,R)}catch(ne){if(be(V),ne!==ne+0)throw ne;xe(1,0)}}function w0(d){var p=$e();try{return $o(d)}catch(_){if(be(p),_!==_+0)throw _;return xe(1,0),0n}}function _0(d,p,_,y,T){var z=$e();try{return To(d,p,_,y,T)}catch(R){if(be(z),R!==R+0)throw R;xe(1,0)}}function b0(d,p,_,y,T,z){var R=$e();try{return Co(d,p,_,y,T,z)}catch(V){if(be(R),V!==V+0)throw V;xe(1,0)}}function $0(d,p,_,y,T,z){var R=$e();try{return fo(d,p,_,y,T,z)}catch(V){if(be(R),V!==V+0)throw V;xe(1,0)}}function x0(d,p,_,y,T,z){var R=$e();try{return Eo(d,p,_,y,T,z)}catch(V){if(be(R),V!==V+0)throw V;xe(1,0)}}function v0(d,p,_,y,T,z,R,V){var ne=$e();try{return mo(d,p,_,y,T,z,R,V)}catch(se){if(be(ne),se!==se+0)throw se;xe(1,0)}}function k0(d,p,_,y,T){var z=$e();try{return zo(d,p,_,y,T)}catch(R){if(be(z),R!==R+0)throw R;return xe(1,0),0n}}function S0(d,p,_,y){var T=$e();try{return Mo(d,p,_,y)}catch(z){if(be(T),z!==z+0)throw z;xe(1,0)}}function I0(d,p,_,y){var T=$e();try{return Ao(d,p,_,y)}catch(z){if(be(T),z!==z+0)throw z;xe(1,0)}}function T0(d,p,_,y,T,z,R,V,ne,se,_e,Se){var Me=$e();try{return Oo(d,p,_,y,T,z,R,V,ne,se,_e,Se)}catch(Oe){if(be(Me),Oe!==Oe+0)throw Oe;xe(1,0)}}function C0(d,p,_,y,T,z,R,V,ne,se,_e){var Se=$e();try{So(d,p,_,y,T,z,R,V,ne,se,_e)}catch(Me){if(be(Se),Me!==Me+0)throw Me;xe(1,0)}}function E0(d,p,_,y,T,z,R,V,ne,se,_e,Se,Me,Oe,vt,Ui){var O0=$e();try{Io(d,p,_,y,T,z,R,V,ne,se,_e,Se,Me,Oe,vt,Ui)}catch(Pi){if(be(O0),Pi!==Pi+0)throw Pi;xe(1,0)}}function z0(d,p,_){var y=$e();try{return xo(d,p,_)}catch(T){if(be(y),T!==T+0)throw T;xe(1,0)}}function M0(d,p,_){var y=$e();try{return vo(d,p,_)}catch(T){if(be(y),T!==T+0)throw T;xe(1,0)}}function A0(d,p,_,y){var T=$e();try{ko(d,p,_,y)}catch(z){if(be(T),z!==z+0)throw z;xe(1,0)}}function qr(){if(0<ee)oe=qr;else if(n)$?.(t),G();else{for(var d=re;0<d.length;)d.shift()(t);0<ee?oe=qr:(t.calledRun=!0,E||(G(),$?.(t)))}}return n||(ht=await we(),qr()),t.PTR_SIZE=4,A?t:new Promise((d,p)=>{$=d,v=p})}var tp,qo,ry=te(()=>{"use strict";tp=Wo,qo=globalThis.self?.name?.startsWith("em-pthread"),qo&&Wo()}),ji,Yn,Go,Fe,rp,Vr,Vo,Ho,Ki,Fo,Zi,ip,Yi,np,_a=te(()=>{"use strict";wa(),ji=typeof location>"u"?void 0:location.origin,Yn=import.meta.url>"file:"&&import.meta.url<"file;",Go=()=>{if(Yn){let e=URL;return new URL(new e("ort.bundle.min.mjs",import.meta.url).href,ji).href}return import.meta.url},Fe=Go(),rp=()=>{if(Fe&&!Fe.startsWith("blob:"))return Fe.substring(0,Fe.lastIndexOf("/")+1)},Vr=(e,t)=>{try{let r=t??Fe;return(r?new URL(e,r):new URL(e)).origin===ji}catch{return!1}},Vo=(e,t)=>{let r=t??Fe;try{return(r?new URL(e,r):new URL(e)).href}catch{return}},Ho=(e,t)=>`${t??"./"}${e}`,Ki=async e=>{let t=await(await fetch(e,{credentials:"same-origin"})).blob();return URL.createObjectURL(t)},Fo=async e=>(await import(e)).default,Zi=(ty(),Er(Xc)).default,ip=async()=>{if(!Fe)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(Vr(Fe))return[void 0,Zi()];let e=await Ki(Fe);return[e,Zi(e)]},Yi=(ry(),Er(ep)).default,np=async(e,t,r,i)=>{let n=Yi&&!(e||t);if(n)if(Fe)n=Vr(Fe)||i&&!r;else if(i&&!r)n=!0;else throw new Error("cannot determine the script source URL.");if(n)return[void 0,Yi];{let a="ort-wasm-simd-threaded.jsep.mjs",s=e??Vo(a,t),o=r&&s&&!Vr(s,t),u=o?await Ki(s):s??Ho(a,t);return[o?u:void 0,await Fo(u)]}}}),Qi,Hr,cr,Xi,jo,Ko,Zo,ba,ze,Ht=te(()=>{"use strict";_a(),Hr=!1,cr=!1,Xi=!1,jo=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},Ko=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},Zo=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},ba=async e=>{if(Hr)return Promise.resolve();if(cr)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(Xi)throw new Error("previous call to 'initializeWebAssembly()' failed.");cr=!0;let t=e.initTimeout,r=e.numThreads;if(e.simd!==!1){if(e.simd==="relaxed"){if(!Zo())throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.")}else if(!Ko())throw new Error("WebAssembly SIMD is not supported in the current environment.")}let i=jo();r>1&&!i&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+r+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),e.numThreads=r=1);let n=e.wasmPaths,a=typeof n=="string"?n:void 0,s=n?.mjs,o=s?.href??s,u=n?.wasm,l=u?.href??u,c=e.wasmBinary,[h,m]=await np(o,a,r>1,!!c||!!l),g=!1,f=[];if(t>0&&f.push(new Promise($=>{setTimeout(()=>{g=!0,$()},t)})),f.push(new Promise(($,v)=>{let b={numThreads:r};if(c)b.wasmBinary=c,b.locateFile=w=>w;else if(l||a)b.locateFile=w=>l??a+w;else if(o&&o.indexOf("blob:")!==0)b.locateFile=w=>new URL(w,o).href;else if(h){let w=rp();w&&(b.locateFile=k=>w+k)}m(b).then(w=>{cr=!1,Hr=!0,Qi=w,$(),h&&URL.revokeObjectURL(h)},w=>{cr=!1,Xi=!0,v(w)})})),await Promise.race(f),g)throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},ze=()=>{if(Hr&&Qi)return Qi;throw new Error("WebAssembly is not initialized yet.")}}),st,ui,Te,$a=te(()=>{"use strict";Ht(),st=(e,t)=>{let r=ze(),i=r.lengthBytesUTF8(e)+1,n=r._malloc(i);return r.stringToUTF8(e,n,i),t.push(n),n},ui=(e,t,r,i)=>{if(typeof e=="object"&&e!==null){if(r.has(e))throw new Error("Circular reference in options");r.add(e)}Object.entries(e).forEach(([n,a])=>{let s=t?t+n:n;if(typeof a=="object")ui(a,s+".",r,i);else if(typeof a=="string"||typeof a=="number")i(s,a.toString());else if(typeof a=="boolean")i(s,a?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof a}`)})},Te=e=>{let t=ze(),r=t.stackSave();try{let i=t.PTR_SIZE,n=t.stackAlloc(2*i);t._OrtGetLastError(n,n+i);let a=Number(t.getValue(n,i===4?"i32":"i64")),s=t.getValue(n+i,"*"),o=s?t.UTF8ToString(s):"";throw new Error(`${e} ERROR_CODE: ${a}, ERROR_MESSAGE: ${o}`)}finally{t.stackRestore(r)}}}),ap,iy=te(()=>{"use strict";Ht(),$a(),ap=(e,t)=>{let r=ze(),i=0,n=[],a=e||{};try{if(e?.logSeverityLevel===void 0)a.logSeverityLevel=2;else if(typeof e.logSeverityLevel!="number"||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log severity level is not valid: ${e.logSeverityLevel}`);if(e?.logVerbosityLevel===void 0)a.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!="number"||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);e?.terminate===void 0&&(a.terminate=!1);let s=0;e?.tag!==void 0&&(s=st(e.tag,n)),i=r._OrtCreateRunOptions(a.logSeverityLevel,a.logVerbosityLevel,!!a.terminate,s),i===0&&Te("Can't create run options."),e?.extra!==void 0&&ui(e.extra,"",new WeakSet,(o,u)=>{let l=st(o,n),c=st(u,n);r._OrtAddRunConfigEntry(i,l,c)!==0&&Te(`Can't set a run config entry: ${o} - ${u}.`)});for(let o of t)r._OrtRunOptionsAddActiveLoraAdapter(i,o)!==0&&Te("Can't add an active LoRA adapter.");return[i,n]}catch(s){throw i!==0&&r._OrtReleaseRunOptions(i),n.forEach(o=>r._free(o)),s}}}),Yo,Qo,Xo,Mt,Jo,sp,ny=te(()=>{"use strict";Ht(),$a(),Yo=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"layout":return 3;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}},Qo=e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}},Xo=e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some(r=>(typeof r=="string"?r:r.name)==="webgpu")&&(e.enableMemPattern=!1)},Mt=(e,t,r,i)=>{let n=st(t,i),a=st(r,i);ze()._OrtAddSessionConfigEntry(e,n,a)!==0&&Te(`Can't set a session config entry: ${t} - ${r}.`)},Jo=async(e,t,r)=>{let i=t.executionProviders;for(let n of i){let a=typeof n=="string"?n:n.name,s=[],o;switch(a){case"webnn":if(a="WEBNN",Mt(e,"session.disable_quant_qdq","1",r),Mt(e,"session.disable_qdq_constant_folding","1",r),typeof n!="string"){let m=n?.deviceType;m&&Mt(e,"deviceType",m,r)}break;case"webgpu":if(a="JS",typeof n!="string"){let m=n;if(m?.preferredLayout){if(m.preferredLayout!=="NCHW"&&m.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${m.preferredLayout}`);Mt(e,"preferredLayout",m.preferredLayout,r)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${a}`)}let u=s.length,l=0,c=0;if(u>0){l=ze()._malloc(u*ze().PTR_SIZE),r.push(l),c=ze()._malloc(u*ze().PTR_SIZE),r.push(c);for(let m=0;m<u;m++)ze().setValue(l+m*ze().PTR_SIZE,s[m][0],"*"),ze().setValue(c+m*ze().PTR_SIZE,s[m][1],"*")}let h;if(o===void 0){let m=st(a,r);h=await ze()._OrtAppendExecutionProvider(e,m,l,c,u)}h!==0&&Te(`Can't append execution provider: ${a}.`)}},sp=async e=>{let t=ze(),r=0,i=[],n=e||{};Xo(n);try{let a=Yo(n.graphOptimizationLevel??"all"),s=Qo(n.executionMode??"sequential"),o=typeof n.logId=="string"?st(n.logId,i):0,u=n.logSeverityLevel??2;if(!Number.isInteger(u)||u<0||u>4)throw new Error(`log severity level is not valid: ${u}`);let l=n.logVerbosityLevel??0;if(!Number.isInteger(l)||l<0||l>4)throw new Error(`log verbosity level is not valid: ${l}`);let c=typeof n.optimizedModelFilePath=="string"?st(n.optimizedModelFilePath,i):0;if(r=t._OrtCreateSessionOptions(a,!!n.enableCpuMemArena,!!n.enableMemPattern,s,!!n.enableProfiling,0,o,u,l,c),r===0&&Te("Can't create session options."),n.executionProviders&&await Jo(r,n,i),n.enableGraphCapture!==void 0){if(typeof n.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${n.enableGraphCapture}`);Mt(r,"enableGraphCapture",n.enableGraphCapture.toString(),i)}if(n.freeDimensionOverrides)for(let[h,m]of Object.entries(n.freeDimensionOverrides)){if(typeof h!="string")throw new Error(`free dimension override name must be a string: ${h}`);if(typeof m!="number"||!Number.isInteger(m)||m<0)throw new Error(`free dimension override value must be a non-negative integer: ${m}`);let g=st(h,i);t._OrtAddFreeDimensionOverride(r,g,m)!==0&&Te(`Can't set a free dimension override: ${h} - ${m}.`)}return n.extra!==void 0&&ui(n.extra,"",new WeakSet,(h,m)=>{Mt(r,h,m,i)}),[r,i]}catch(a){throw r!==0&&t._OrtReleaseSessionOptions(r)!==0&&Te("Can't release session options."),i.forEach(s=>t._free(s)),a}}}),Ut,wt,Pt,gi,li,xa,va,Qn,me=te(()=>{"use strict";Ut=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data type: ${e}`)}},wt=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw new Error(`unsupported data type: ${e}`)}},Pt=(e,t)=>{let r=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],i=typeof t=="number"?t:t.reduce((n,a)=>n*a,1);return r>0?Math.ceil(i*r):void 0},gi=e=>{switch(e){case"float16":return typeof Float16Array<"u"?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${e}`)}},li=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}},xa=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",va=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint64"||e==="int8"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",Qn=e=>{switch(e){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${e}`)}}}),yi,ka=te(()=>{"use strict";wa(),yi=async e=>{if(typeof e=="string"){let t=await fetch(e);if(!t.ok)throw new Error(`failed to load external data file: ${e}`);let r=t.headers.get("Content-Length"),i=r?parseInt(r,10):0;if(i<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw new Error(`failed to load external data file: ${e}, no response body.`);let n=t.body.getReader(),a;try{a=new ArrayBuffer(i)}catch(o){if(o instanceof RangeError){let u=Math.ceil(i/65536);a=new WebAssembly.Memory({initial:u,maximum:u}).buffer}else throw o}let s=0;for(;;){let{done:o,value:u}=await n.read();if(o)break;let l=u.byteLength;new Uint8Array(a,s,l).set(u),s+=l}return new Uint8Array(a,0,i)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),eu,tu,ru,iu,Sa,nu,ke,_t=te(()=>{"use strict";me(),eu=["V","I","W","E","F"],tu=(e,t)=>{console.log(`[${eu[e]},${new Date().toISOString()}]${t}`)},Sa=(e,t)=>{ru=e,iu=t},nu=(e,t)=>{let r=li(e),i=li(ru);r>=i&&tu(r,typeof t=="function"?t():t)},ke=(...e)=>{iu&&nu(...e)}}),au,ar,L,di,op,up,lp,ge=te(()=>{"use strict";au=class{static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}},ar=class{static calcShape(e,t,r=!1){let i=e.length,n=t.length;if(i===0)return t;if(n===0)return e;let a=Math.max(e.length,t.length),s=new Array(a);if(r){if(i<2||n<2)return;let o=au.calcMatMulShape([e[i-2],e[i-1]],[t[n-2],t[n-1]]);if(o===void 0)return;[s[a-2],s[a-1]]=o}for(let o=r?3:1;o<=a;o++){let u=i-o<0?1:e[i-o],l=n-o<0?1:t[n-o];if(u!==l&&u>1&&l>1)return;let c=Math.max(u,l);if(u&&l)s[a-o]=Math.max(u,l);else{if(c>1)return;s[a-o]=0}}return s}static isValidBroadcast(e,t){let r=e.length,i=t.length;if(r>i)return!1;for(let n=1;n<=r;n++)if(e[r-n]!==1&&e[r-n]!==t[i-n])return!1;return!0}},L=class ai{static size(t){return ai.getSizeFromDimensionRange(t,0,t.length)}static convertShape(t,r=4){let i=t.length;if(i===0)return[];let n=new Array(i),a=i-1;for(;a>=0;){if(t[a]%r===0){n[a]=t[a]/r;break}if(r%t[a]!==0)throw new Error("cannot convert shape");n[a]=1,r/=t[a],a--}for(a--;a>=0;a--)n[a]=t[a];return n}static sizeFromDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return ai.getSizeFromDimensionRange(t,r,t.length)}static sizeToDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeToDimension as Tensor has ${t.length} dimensions.`);return ai.getSizeFromDimensionRange(t,0,r)}static getSizeFromDimensionRange(t,r,i){let n=1;for(let a=r;a<i;a++){if(t[a]<0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");n*=Number(t[a])}return n}static computeStrides(t){let r=t.length;if(r===0)return[];if(r===1)return[1];let i=new Array(r);i[r-1]=1,i[r-2]=t[r-1];for(let n=r-3;n>=0;--n)i[n]=i[n+1]*t[n+1];return i}static normalizeAxis(t,r){if(t<-r&&t>=r)throw new Error("unsupported axis for this operation.");return t<0?t+r:t}static normalizeAxes(t,r){return t.map(i=>this.normalizeAxis(i,r??t.length))}static sortBasedOnPerm(t,r){return r?r.map(i=>t[i]):t.slice().reverse()}static padShape(t,r){let i=t.length;return t.map((n,a)=>n+r[a]+r[a+i])}static areEqual(t,r){return t.length!==r.length?!1:t.every((i,n)=>i===r[n])}},di=class It{static adjustPoolAttributes(t,r,i,n,a,s){if(!t&&i.length!==r.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(t)for(let o=0;o<r.length-2;o++)o>=i.length?i.push(r[o+2]):i[o]=r[o+2];for(let o=0;o<i.length;o++)if(o<n.length){if(n[o]<0)throw new Error("strides should be greater than or equal to 1")}else n.push(1);for(let o=0;o<i.length;o++)if(o<a.length){if(a[o]<0)throw new Error("dilations should be greater than or equal to 1")}else a.push(1);for(let o=0;o<i.length*2;o++)if(o<s.length){if(s[o]<0)throw new Error("pad should be greater than or equal to 1")}else s.push(0);for(let o=0;o<i.length;o++){if(i[o]<=0)throw new Error("kernel shapes need to be greater than 0");if(s[o]>=i[o]||s[o+i.length]>=i[o])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,r,i,n,a,s,o){if(o){if(a.length!==2*(t.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(r.length!==t.length-2)throw new Error("length of strides should be the length of data dimensions");if(n.length!==t.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let u=0;u<t.length-2;u++)It.adjustPadAndReturnShape(t[u+(s?1:2)],r[u],i[u],n[u],a,u,u+t.length-2,o)}}static computePoolOutputShape(t,r,i,n,a,s,o,u=0){if(r.length<=0)throw new Error("input shape must be of size greater than 0");let l=[r[0],r[1]];return It.computeShapeHelper(t,r,l,i,n,a,s,o,u),l}static computeConvOutputShape(t,r,i,n,a,s,o){if(t.length<=0||r.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let u=[t[0],r[0]];return It.computeShapeHelper(!1,t,u,i,n,a,s,o),u}static computeShapeHelper(t,r,i,n,a,s,o,u,l=0){if(t)for(let c=0;c<r.length-2;c++)i.push(1);else for(let c=0;c<r.length-2;c++)i.push(It.adjustPadAndReturnShape(r[c+2],n[c],a[c],s[c],o,c,c+r.length-2,u,l))}static computeOutputSize(t,r,i,n,a){let s=Math.floor(t/r)+1;return a===1&&(s=Math.ceil(t/r)+1,(s-1)*r>=i+n&&(s-=1)),s}static adjustPadAndReturnShape(t,r,i,n,a,s,o,u,l=0){let c=i*(n-1)+1;if(u&&u!=="NOTSET")switch(u){case"VALID":return a[s]=0,a[o]=0,It.computeOutputSize(t-c,r,t,0,l);case"SAME_LOWER":case"SAME_UPPER":if(i!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let h=(Math.floor((t+r-1)/r)-1)*r+n-t;return a[s]=Math.floor(u==="SAME_LOWER"?(h+1)/2:h/2),a[o]=h-a[s],It.computeOutputSize(t+a[s]+a[o]-c,r,t,a[s],l)}default:throw new Error("Unsupported AutoPad type")}else return It.computeOutputSize(t+a[s]+a[o]-c,r,t,a[s],l)}},op=class{static getShapeOfGemmResult(e,t,r,i,n){if(e.length!==2||r.length!==2)throw new Error("shape need to be of size 2");let a,s,o;t?(a=e[1],s=e[0]):(a=e[0],s=e[1]);let u=-1;if(i?(o=r[0],u=1):(o=r[1],u=0),r[u]!==s)throw new Error("dimension mismatch");if(a<=0||o<=0||s<=0)throw new Error("invalid shape specified");if(n&&!ar.isValidBroadcast(n,[a,o]))throw new Error("gemm: invalid bias shape for broadcast");return[a,o,s]}},up=-34028234663852886e22,lp=34028234663852886e22}),Ia,dp=te(()=>{"use strict";me(),Ia=(e,t)=>new(gi(t))(e)}),Ji,su,en,ou,tn,uu,rn,nn,an,lu,cp,ay=te(()=>{"use strict";me(),_t(),Ji=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),su=(e,t)=>{if(t==="int32")return e;let r=Ji.get(t);if(!r)throw new Error(`WebNN backend does not support data type: ${t}`);let i=r/8;if(e.byteLength%i!==0)throw new Error(`Invalid Uint8Array length - must be a multiple of ${i}.`);let n=e.byteLength/i,a=new(gi(t))(e.buffer,e.byteOffset,n);switch(t){case"int64":case"uint64":{let s=new Int32Array(n);for(let o=0;o<n;o++){let u=a[o];if(u>2147483647n||u<-2147483648n)throw new Error("Can not convert int64 data to int32 - value out of range.");s[o]=Number(u)}return new Uint8Array(s.buffer)}case"int8":case"uint8":case"uint32":{if(t==="uint32"&&a.some(o=>o>2147483647))throw new Error("Can not convert uint32 data to int32 - value out of range.");let s=Int32Array.from(a,Number);return new Uint8Array(s.buffer)}default:throw new Error(`Unsupported data conversion from ${t} to 'int32'`)}},en=(e,t)=>{if(t==="int32")return e;if(e.byteLength%4!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");let r=e.byteLength/4,i=new Int32Array(e.buffer,e.byteOffset,r);switch(t){case"int64":{let n=BigInt64Array.from(i,BigInt);return new Uint8Array(n.buffer)}case"uint64":{if(i.some(a=>a<0))throw new Error("Can not convert int32 data to uin64 - negative value found.");let n=BigUint64Array.from(i,BigInt);return new Uint8Array(n.buffer)}case"int8":{if(i.some(a=>a<-128||a>127))throw new Error("Can not convert int32 data to int8 - value out of range.");let n=Int8Array.from(i,Number);return new Uint8Array(n.buffer)}case"uint8":{if(i.some(n=>n<0||n>255))throw new Error("Can not convert int32 data to uint8 - value out of range.");return Uint8Array.from(i,Number)}case"uint32":{if(i.some(a=>a<0))throw new Error("Can not convert int32 data to uint32 - negative value found.");let n=Uint32Array.from(i,Number);return new Uint8Array(n.buffer)}default:throw new Error(`Unsupported data conversion from 'int32' to ${t}`)}},ou=1,tn=()=>ou++,uu=new Map([["int8","int32"],["uint8","int32"],["uint32","int32"],["int64","int32"]]),rn=(e,t)=>{let r=Ji.get(e);if(!r)throw new Error(`WebNN backend does not support data type: ${e}`);return t.length>0?Math.ceil(t.reduce((i,n)=>i*n)*r/8):0},nn=class{constructor(e){this.isDataConverted=!1;let{sessionId:t,context:r,tensor:i,dataType:n,shape:a,fallbackDataType:s}=e;this.sessionId=t,this.mlContext=r,this.mlTensor=i,this.dataType=n,this.tensorShape=a,this.fallbackDataType=s}get tensor(){return this.mlTensor}get type(){return this.dataType}get fallbackType(){return this.fallbackDataType}get shape(){return this.tensorShape}get byteLength(){return rn(this.dataType,this.tensorShape)}destroy(){ke("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e){if(this.fallbackDataType){let t=await this.mlContext.readTensor(this.mlTensor),r=en(new Uint8Array(t),this.dataType);if(e){(e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)).set(r);return}else return new Uint8Array(r).buffer}else return e?this.mlContext.readTensor(this.mlTensor,e):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(e,t,r){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===r.length&&this.tensorShape.every((i,n)=>i===r[n])}setIsDataConverted(e){this.isDataConverted=e}},an=class{constructor(e,t){this.tensorManager=e,this.wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,r,i){let n=this.tensorManager.getMLContext(e),a=this.tensorManager.getMLOpSupportLimits(e),s;if(!a?.input.dataTypes.includes(t)){if(s=uu.get(t),!s||!a?.input.dataTypes.includes(s))throw new Error(`WebNN backend does not support data type: ${t}`);ke("verbose",()=>`[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${t} to ${s}`)}if(this.wrapper){if(this.wrapper.canReuseTensor(n,t,r))return this.wrapper.tensor;if(i){if(this.wrapper.byteLength!==rn(t,r))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let o=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,t,r,o,!0,!0,s),i&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){let t=e;if(this.wrapper){if(this.wrapper.fallbackType)if(this.wrapper.fallbackType==="int32")t=su(e,this.wrapper.type),this.wrapper.setIsDataConverted(!0);else throw new Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);if(e.byteLength===this.wrapper.byteLength){this.wrapper.write(t);return}else ke("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor()}this.activeUpload?this.activeUpload.set(t):this.activeUpload=new Uint8Array(t)}async download(e){if(this.activeUpload){let t=this.wrapper?.isDataConverted?en(this.activeUpload,this.wrapper?.type):this.activeUpload;if(e){e instanceof ArrayBuffer?new Uint8Array(e).set(t):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(t);return}else return t.buffer}if(!this.wrapper)throw new Error("Tensor has not been created.");return e?this.wrapper.read(e):this.wrapper.read()}},lu=class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){let t=this.backend.getMLContext(e);if(!t)throw new Error("MLContext not found for session.");return t}getMLOpSupportLimits(e){return this.backend.getMLOpSupportLimits(e)}reserveTensorId(){let e=tn();return this.tensorTrackersById.set(e,new an(this)),e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(t.tensorWrapper))}async ensureTensor(e,t,r,i,n){ke("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${r}, shape: ${i}, copyOld: ${n}}`);let a=this.tensorTrackersById.get(t);if(!a)throw new Error("Tensor not found.");return a.ensureTensor(e,r,i,n)}upload(e,t){let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");r.upload(t)}async download(e,t){ke("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t?.byteLength}}`);let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");return r.download(t)}releaseTensorsForSession(e){for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,r,i){let n=this.getMLContext(e),a=tn(),s=new nn({sessionId:e,context:n,tensor:t,dataType:r,shape:i});return this.tensorTrackersById.set(a,new an(this,s)),this.externalTensors.add(s),a}async getCachedTensor(e,t,r,i,n,a,s){let o=this.getMLContext(e);for(let[l,c]of this.freeTensors.entries())if(c.canReuseTensor(o,t,r)){ke("verbose",()=>`[WebNN] Reusing tensor {dataType: ${t}, ${s?`fallbackDataType: ${s},`:""} shape: ${r}`);let h=this.freeTensors.splice(l,1)[0];return h.sessionId=e,h}ke("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${t}, ${s?`fallbackDataType: ${s},`:""} shape: ${r}}`);let u=await o.createTensor({dataType:s??t,shape:r,dimensions:r,usage:i,writable:n,readable:a});return new nn({sessionId:e,context:o,tensor:u,dataType:t,shape:r,fallbackDataType:s})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},cp=(...e)=>new lu(...e)}),pr,du,pp,sy=te(()=>{"use strict";me(),Ht(),dp(),ay(),_t(),pr=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),du=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let r=Object.keys(e).sort(),i=Object.keys(t).sort();return r.length===i.length&&r.every((n,a)=>n===i[a]&&e[n]===t[n])},pp=class{constructor(e){this.tensorManager=cp(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.sessionGraphOutputs=new Map,this.temporaryGraphInputs=[],this.temporaryGraphOutputs=[],this.temporarySessionTensorIds=new Map,this.mlOpSupportLimitsBySessionId=new Map,Sa(e.logLevel,!!e.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(e){ke("verbose",()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){ke("verbose",()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let r of t)ke("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${r}}`),this.tensorManager.releaseTensorId(r);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let r=this.mlContextCache.findIndex(i=>i.gpuDevice===e);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:i}),i}}else if(e===void 0){let r=this.mlContextCache.findIndex(i=>i.options===void 0&&i.gpuDevice===void 0);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:i}),i}}let t=this.mlContextCache.findIndex(r=>du(r.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;{let r=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:r}),r}}registerMLContext(e,t){this.mlContextBySessionId.set(e,t);let r=this.sessionIdsByMLContext.get(t);r||(r=new Set,this.sessionIdsByMLContext.set(t,r)),r.add(e),this.mlOpSupportLimitsBySessionId.has(e)||this.mlOpSupportLimitsBySessionId.set(e,t.opSupportLimits()),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[]),this.temporaryGraphOutputs.length>0&&(this.sessionGraphOutputs.set(e,this.temporaryGraphOutputs),this.temporaryGraphOutputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e),this.sessionGraphOutputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e),this.mlOpSupportLimitsBySessionId.delete(e);let r=this.sessionIdsByMLContext.get(t);if(r.delete(e),r.size===0){this.sessionIdsByMLContext.delete(t);let i=this.mlContextCache.findIndex(n=>n.mlContext===t);i!==-1&&this.mlContextCache.splice(i,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}getMLOpSupportLimits(e){return this.mlOpSupportLimitsBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){ke("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,t,r,i,n){let a=pr.get(r);if(!a)throw new Error(`Unsupported ONNX data type: ${r}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,t,a,i,n)}async createTemporaryTensor(e,t,r){ke("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${r}}`);let i=pr.get(t);if(!i)throw new Error(`Unsupported ONNX data type: ${t}`);let n=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,n,i,r,!1);let a=this.temporarySessionTensorIds.get(e);return a?a.push(n):this.temporarySessionTensorIds.set(e,[n]),n}uploadTensor(e,t){if(!ze().shouldTransferToMLTensor)throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");ke("verbose",()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let r=await this.tensorManager.download(e);return Ia(r,t)}}registerMLTensor(e,t,r,i){let n=pr.get(r);if(!n)throw new Error(`Unsupported ONNX data type: ${r}`);let a=this.tensorManager.registerTensor(e,t,n,i);return ke("verbose",()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${n}, dimensions: ${i}} -> {tensorId: ${a}}`),a}registerGraphInput(e){this.temporaryGraphInputs.push(e)}registerGraphOutput(e){this.temporaryGraphOutputs.push(e)}isGraphInput(e,t){let r=this.sessionGraphInputs.get(e);return r?r.includes(t):!1}isGraphOutput(e,t){let r=this.sessionGraphOutputs.get(e);return r?r.includes(t):!1}isGraphInputOutputTypeSupported(e,t,r=!0){let i=pr.get(Ut(t)),n=this.mlOpSupportLimitsBySessionId.get(e);return typeof i>"u"?!1:r?!!n?.input.dataTypes.includes(i):!!n?.output.dataTypes.includes(i)}flush(){}}}),Ta=te(()=>{"use strict"}),sn,Fr,jr,cu,pu,on,Xn,hu,hp,oy=te(()=>{"use strict";_t(),Ta(),sn=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),Fr=[],jr=e=>Math.ceil(Number(e)/16)*16,cu=e=>{for(let t=0;t<Fr.length;t++){let r=Fr[t];if(e<=r)return r}return Math.ceil(e/16)*16},pu=1,on=()=>pu++,Xn=async(e,t,r,i)=>{let n=jr(r),a=e.device.createBuffer({size:n,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let s=e.getCommandEncoder();e.endComputePass(),s.copyBufferToBuffer(t,0,a,0,n),e.flush(),await a.mapAsync(GPUMapMode.READ);let o=a.getMappedRange();if(i){let u=i();return u.set(new Uint8Array(o,0,r)),u}else return new Uint8Array(o.slice(0,r))}finally{a.destroy()}},hu=class{constructor(e){this.backend=e,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[t]of sn)Fr.push(t),this.freeBuffers.set(t,[]),this.freeUniformBuffers.set(t,[]);this.sessionCount=0}upload(e,t){let r=t.buffer,i=t.byteOffset,n=t.byteLength,a=jr(n),s=this.storageCache.get(e);if(!s)throw new Error("gpu data for uploading does not exist");if(Number(s.originalSize)!==n)throw new Error(`inconsistent data size. gpu data size=${s.originalSize}, data size=${n}`);if(a===n&&i%4===0)this.backend.device.queue.writeBuffer(s.gpuData.buffer,0,r,i,n);else{let o=new Uint8Array(a);o.set(t),this.backend.device.queue.writeBuffer(s.gpuData.buffer,0,o,0,a)}ke("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${e})`)}memcpy(e,t){let r=this.storageCache.get(e);if(!r)throw new Error("source gpu data for memcpy does not exist");let i=this.storageCache.get(t);if(!i)throw new Error("destination gpu data for memcpy does not exist");if(r.originalSize!==i.originalSize)throw new Error("inconsistent source and destination gpu data size");let n=jr(r.originalSize),a=this.backend.getCommandEncoder();this.backend.endComputePass(),a.copyBufferToBuffer(r.gpuData.buffer,0,i.gpuData.buffer,0,n)}registerExternalBuffer(e,t,r){let i;if(r){if(i=r[0],e===r[1])return ke("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, buffer is the same, skip.`),i;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else i=on();return this.storageCache.set(i,{gpuData:{id:i,type:0,buffer:e},originalSize:t}),ke("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, registered.`),i}unregisterExternalBuffer(e){e!==void 0&&(this.storageCache.delete(e),ke("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`))}create(e,t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let r=cu(e),i,n=(t&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,a=(t&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(n||a){let o=(n?this.freeBuffers:this.freeUniformBuffers).get(r);o?o.length>0?i=o.pop():i=this.backend.device.createBuffer({size:r,usage:t}):i=this.backend.device.createBuffer({size:r,usage:t})}else i=this.backend.device.createBuffer({size:r,usage:t});let s={id:on(),type:0,buffer:i};return this.storageCache.set(s.id,{gpuData:s,originalSize:Number(e)}),ke("verbose",()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${s.id}`),s}get(e){return this.storageCache.get(e)?.gpuData}release(e){let t=typeof e=="bigint"?Number(e):e,r=this.storageCache.get(t);if(!r){if(this.storageCache.size===0)return 0;throw new Error("releasing data does not exist")}return ke("verbose",()=>`[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${r.gpuData.id}`),this.storageCache.delete(t),this.buffersPending.push(r.gpuData.buffer),r.originalSize}async download(e,t){let r=this.storageCache.get(Number(e));if(!r)throw new Error("data does not exist");await Xn(this.backend,r.gpuData.buffer,r.originalSize,t)}refreshPendingBuffers(){if(this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let e of this.buffersPending){let t=sn.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let r=this.freeBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let r=this.freeUniformBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e));for(let t of this.buffersPending)e.push(t);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(e){let t=this.capturedPendingBuffers.get(e);t&&(t.forEach(r=>{r.destroy()}),this.capturedPendingBuffers.delete(e)),this.sessionCount-=1,this.sessionCount===0&&(ke("warning",()=>"[WebGPU] Clearing webgpu buffer cache"),this.storageCache.forEach(r=>{r.gpuData.buffer.destroy()}),this.storageCache=new Map)}},hp=(...e)=>new hu(...e)}),fu,Ce,Re=te(()=>{"use strict";fu=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},Ce=e=>new fu(e)}),sr,Kr,We,Le,pe,Be,Jn,er,Tt,de,hr,H,ue,fp,Ca,mu,mp,ye=te(()=>{"use strict";me(),ge(),sr=64,Kr=(e,t)=>{if(t===3)throw new Error("vec3 has same alignment as vec4, use vec4 instead");switch(Number(e)){case 10:return t>1?`vec${t}<f16>`:"f16";case 1:return t>1?`vec${t}<f32>`:"f32";case 6:return t>1?`vec${t}<i32>`:"i32";case 12:return t>1?`vec${t}<u32>`:"u32";case 7:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(t!==4)throw new Error("bool must be vec4");return["u32","vec4<bool>"];case 22:return"i32";case 21:return"u32";default:throw new Error(`Unknown data type: ${e}`)}},We=(e,t=1)=>{let r=Kr(e,t);return typeof r=="string"?r:r[0]},Le=(e,t=1)=>{let r=Kr(e,t);return typeof r=="string"?r:r[1]},pe=(...e)=>{let t=[];return e.forEach(r=>{r.length!==0&&t.push({type:12,data:r},{type:12,data:L.computeStrides(r)})}),t},Be=e=>e%4===0?4:e%2===0?2:1,Jn=(e="f32",t,r="0")=>!t||t===1?`${e}(${r})`:`vec${t}<${e}>(${r})`,er=(e,t,r)=>e==="f32"?r:t===1?`f32(${r})`:`vec${t}<f32>(${r})`,Tt=(e,t)=>t===4?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:t===2?`(${e}.x + ${e}.y)`:t===3?`(${e}.x + ${e}.y + ${e}.z)`:e,de=(e,t,r,i)=>e.startsWith("uniforms.")&&r>4?typeof t=="string"?i==="f16"?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:i==="f16"?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:r>1?`${e}[${t}]`:e,hr=(e,t,r,i,n)=>{let a=typeof r=="number",s=a?r:r.length,o=[...new Array(s).keys()],u=s<2?"u32":s<=4?`vec${s}<u32>`:`array<u32, ${s}>`,l=Kr(t,n),c=typeof l=="string"?l:l[1],h=typeof l=="string"?l:l[0],m={indices:u,value:c,storage:h,tensor:t},g=A=>typeof A=="string"?A:`${A}u`,f={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},$=a?"uniforms.":"",v=`${$}${e}_shape`,b=`${$}${e}_strides`,w="";for(let A=0;A<s-1;A++)w+=`
    let dim${A} = current / ${de(b,A,s)};
    let rest${A} = current % ${de(b,A,s)};
    indices[${A}] = dim${A};
    current = rest${A};
    `;w+=`indices[${s-1}] = current;`;let k=s<2?"":`
  fn o2i_${e}(offset: u32) -> ${m.indices} {
    var indices: ${m.indices};
    var current = offset;
    ${w}
    return indices;
  }`,I=A=>(f.offsetToIndices=!0,s<2?A:`o2i_${e}(${A})`),S=[];if(s>=2)for(let A=s-1;A>=0;A--)S.push(`${de(b,A,s)} * (indices[${A}])`);let E=s<2?"":`
  fn i2o_${e}(indices: ${m.indices}) -> u32 {
    return ${S.join("+")};
  }`,C=A=>(f.indicesToOffset=!0,s<2?A:`i2o_${e}(${A})`),x=(...A)=>s===0?"0u":`${m.indices}(${A.map(g).join(",")})`,M=(A,W)=>s<2?`${A}`:`${de(A,W,s)}`,N=(A,W,G)=>s<2?`${A}=${G};`:`${de(A,W,s)}=${G};`,B={},U=(A,W)=>{f.broadcastedIndicesToOffset=!0;let G=`${W.name}broadcastedIndicesTo${e}Offset`;if(G in B)return`${G}(${A})`;let Z=[];for(let ce=s-1;ce>=0;ce--){let we=W.indicesGet("outputIndices",ce+W.rank-s);Z.push(`${M(b,ce)} * (${we} % ${M(v,ce)})`)}return B[G]=`fn ${G}(outputIndices: ${W.type.indices}) -> u32 {
             return ${Z.length>0?Z.join("+"):"0u"};
           }`,`${G}(${A})`},F=(A,W)=>(()=>{if(m.storage===m.value)return`${e}[${A}]=${W};`;if(m.storage==="vec2<u32>"&&m.value==="i32")return`${e}[${A}]=vec2<u32>(u32(${W}), select(0u, 0xFFFFFFFFu, ${W} < 0));`;if(m.storage==="vec2<u32>"&&m.value==="u32")return`${e}[${A}]=vec2<u32>(u32(${W}), 0u);`;if(m.storage==="u32"&&m.value==="vec4<bool>")return`${e}[${A}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${W}));`;throw new Error(`not supported combination of storage type ${m.storage} and value type ${m.value} yet`)})(),O=A=>(()=>{if(m.storage===m.value)return`${e}[${A}]`;if(m.storage==="vec2<u32>"&&m.value==="i32")return`i32(${e}[${A}].x)`;if(m.storage==="vec2<u32>"&&m.value==="u32")return`u32(${e}[${A}].x)`;if(m.storage==="u32"&&m.value==="vec4<bool>")return`vec4<bool>(bool(${e}[${A}] & 0xFFu), bool(${e}[${A}] & 0xFF00u), bool(${e}[${A}] & 0xFF0000u), bool(${e}[${A}] & 0xFF000000u))`;throw new Error(`not supported combination of storage type ${m.storage} and value type ${m.value} yet`)})(),q=s<2?"":`
  fn get_${e}ByIndices(indices: ${m.indices}) -> ${c} {
    return ${O(`i2o_${e}(indices)`)};
  }`,j=s<2?"":(()=>{let A=o.map(G=>`d${G}: u32`).join(", "),W=o.map(G=>`d${G}`).join(", ");return`
  fn get_${e}(${A}) -> ${c} {
    return get_${e}ByIndices(${x(W)});
  }`})(),P=(...A)=>{if(A.length!==s)throw new Error(`indices length must be ${s}`);let W=A.map(g).join(",");return s===0?O("0u"):s===1?O(W[0]):(f.get=!0,f.getByIndices=!0,f.indicesToOffset=!0,`get_${e}(${W})`)},ie=A=>s<2?O(A):(f.getByIndices=!0,f.indicesToOffset=!0,`get_${e}ByIndices(${A})`),ae=s<2?"":`
  fn set_${e}ByIndices(indices: ${m.indices}, value: ${c}) {
    ${F(`i2o_${e}(indices)`,"value")}
  }`,Q=s<2?"":(()=>{let A=o.map(G=>`d${G}: u32`).join(", "),W=o.map(G=>`d${G}`).join(", ");return`
  fn set_${e}(${A}, value: ${c}) {
    set_${e}ByIndices(${x(W)}, value);
  }`})();return{impl:()=>{let A=[],W=!1;return f.offsetToIndices&&(A.push(k),W=!0),f.indicesToOffset&&(A.push(E),W=!0),f.broadcastedIndicesToOffset&&(Object.values(B).forEach(G=>A.push(G)),W=!0),f.set&&(A.push(Q),W=!0),f.setByIndices&&(A.push(ae),W=!0),f.get&&(A.push(j),W=!0),f.getByIndices&&(A.push(q),W=!0),!a&&W&&A.unshift(`const ${v} = ${m.indices}(${r.join(",")});`,`const ${b} = ${m.indices}(${L.computeStrides(r).join(",")});`),A.join(`
`)},type:m,offsetToIndices:I,indicesToOffset:C,broadcastedIndicesToOffset:U,indices:x,indicesGet:M,indicesSet:N,set:(...A)=>{if(A.length!==s+1)throw new Error(`indices length must be ${s}`);let W=A[s];if(typeof W!="string")throw new Error("value must be string");let G=A.slice(0,s).map(g).join(",");return s===0?F("0u",W):s===1?F(G[0],W):(f.set=!0,f.setByIndices=!0,f.indicesToOffset=!0,`set_${e}(${G}, ${W})`)},setByOffset:F,setByIndices:(A,W)=>s<2?F(A,W):(f.setByIndices=!0,f.indicesToOffset=!0,`set_${e}ByIndices(${A}, ${W});`),get:P,getByOffset:O,getByIndices:ie,usage:i,name:e,strides:b,shape:v,rank:s}},H=(e,t,r,i=1)=>hr(e,t,r,"input",i),ue=(e,t,r,i=1)=>hr(e,t,r,"output",i),fp=(e,t,r)=>hr(e,t,r,"atomicOutput",1),Ca=(e,t,r,i=1)=>hr(e,t,r,"internal",i),mu=class{constructor(e,t){this.normalizedDispatchGroup=e,this.limits=t,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${typeof e=="number"?`${e}u`:e}) { return; }`}mainStart(e=sr){let t=typeof e=="number"?e:e[0],r=typeof e=="number"?1:e[1],i=typeof e=="number"?1:e[2];if(t>this.limits.maxComputeWorkgroupSizeX||r>this.limits.maxComputeWorkgroupSizeY||i>this.limits.maxComputeWorkgroupSizeZ)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(t*r*i>this.limits.maxComputeInvocationsPerWorkgroup)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let n=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1,a=n?`@builtin(global_invocation_id) global_id : vec3<u32>,
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
`)}get variablesInfo(){if(this.uniforms.length===0)return;let e=t=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(t)];return this.uniforms.map(t=>[e(t.type),t.length??1])}},mp=(e,t)=>new mu(e,t)}),gu,un,yu,wu,_u,bu,Ze,gp,yp,Ct=te(()=>{"use strict";me(),ge(),Re(),ye(),gu=(e,t)=>{if(!e||e.length!==1)throw new Error("Transpose requires 1 input.");if(t.length!==0&&t.length!==e[0].dims.length)throw new Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`)},un=(e,t)=>t.length!==0?t:[...new Array(e).keys()].reverse(),yu=(e,t)=>L.sortBasedOnPerm(e,un(e.length,t)),wu=(e,t,r,i)=>{let n=`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`;for(let a=0;a<t;++a)n+=`a[${e[a]}]=i[${a}];`;return n+="return a;}"},_u=(e,t)=>{let r=[],i=[];for(let n=0;n<e.length;++n)e[n]!==1&&r.push(e[n]),e[t[n]]!==1&&i.push(t[n]);return{newShape:r,newPerm:i}},bu=(e,t)=>{let r=0;for(let i=0;i<e.length;++i)if(t[e[i]]!==1){if(e[i]<r)return!1;r=e[i]}return!0},Ze=(e,t)=>{let r=e.dataType,i=e.dims.length,n=un(i,t),a=yu(e.dims,n),s=e.dims,o=a,u=i<2||bu(n,e.dims),l;if(u)return l=f=>{let $=H("input",r,s,4),v=ue("output",r,o,4);return`
  ${f.registerUniform("output_size","u32").declareVariables($,v)}
  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`},{name:"TransposeCopy",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let f=L.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(f/64/4)},programUniforms:[{type:12,data:Math.ceil(f/4)}]}},getShaderSource:l};let{newShape:c,newPerm:h}=_u(e.dims,n),m=L.areEqual(h,[2,3,1]),g=L.areEqual(h,[3,1,2]);if(c.length===2||m||g){s=m?[c[0],c[1]*c[2]]:g?[c[0]*c[1],c[2]]:c,o=[s[1],s[0]];let f=16;return l=$=>{let v=H("a",r,s.length),b=ue("output",r,o.length);return`
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
  }`},{name:"TransposeShared",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let $=L.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(o[1]/f),y:Math.ceil(o[0]/f)},programUniforms:[{type:12,data:$},...pe(s,o)]}},getShaderSource:l}}return l=f=>{let $=H("a",r,s.length),v=ue("output",r,o.length);return`
  ${f.registerUniform("output_size","u32").declareVariables($,v)}

  ${wu(n,i,$,v)}

  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${v.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${v.setByOffset("global_idx",$.getByIndices("aIndices"))}
  }`},{name:"Transpose",shaderCache:{hint:`${t}`,inputDependencies:["rank"]},getRunData:()=>{let f=L.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:[{type:12,data:f},...pe(s,o)]}},getShaderSource:l}},gp=(e,t)=>{gu(e.inputs,t.perm),e.compute(Ze(e.inputs[0],t.perm))},yp=e=>Ce({perm:e.perm})}),$u,xu,vu,ku,Su,Iu,Tu,Cu,Eu,zu,tt,wp,_p,bp,$p,xp,vp,kp,Sp,Ip,Tp,uy=te(()=>{"use strict";me(),ge(),ye(),Ea(),Ct(),$u={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},xu={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},vu={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},ku={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},Su=(e,t)=>{let r=[];for(let i=t-e;i<t;++i)r.push(i);return r},Iu=(e,t)=>{let r=[],i=e.length;for(let a=0;a<i;a++)t.indexOf(a)===-1&&r.push(e[a]);let n=t.map(a=>e[a]);return[r,n]},Tu=(e,t)=>{let r=e.length+t.length,i=[],n=0;for(let a=0;a<r;a++)t.indexOf(a)===-1?i.push(e[n++]):i.push(1);return i},Cu=(e,t)=>{for(let r=0;r<e.length;++r)if(e[e.length-r-1]!==t-1-r)return!1;return!0},Eu=(e,t)=>{let r=[];if(!Cu(e,t)){for(let i=0;i<t;++i)e.indexOf(i)===-1&&r.push(i);e.forEach(i=>r.push(i))}return r},zu=(e,t,r,i,n,a,s)=>{let o=r[0].dims,u=L.size(a),l=L.size(s),c=H("_A",r[0].dataType,o),h=ue("output",n,a),m=64;u===1&&(m=256);let g=`
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

          var bestValue = f32(${vu[i]});
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
            bestValue = ${xu[i]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${h.setByOffset("outputIndex",`${i==="mean"?`${h.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${h.type.storage}(${ku[i]})`}`)};
         }
        }`;return{name:e,shaderCache:{hint:`${t};${m}`,inputDependencies:["type"]},getShaderSource:f,getRunData:()=>({outputs:[{dims:a,dataType:n}],dispatchGroup:{x:u},programUniforms:[{type:12,data:l}]})}},tt=(e,t,r,i)=>{let n=e.inputs.length===1?r:ea(e.inputs,r),a=n.axes;a.length===0&&!n.noopWithEmptyAxes&&(a=e.inputs[0].dims.map((g,f)=>f));let s=L.normalizeAxes(a,e.inputs[0].dims.length),o=s,u=e.inputs[0],l=Eu(o,e.inputs[0].dims.length);l.length>0&&(u=e.compute(Ze(e.inputs[0],l),{inputs:[0],outputs:[-1]})[0],o=Su(o.length,u.dims.length));let[c,h]=Iu(u.dims,o),m=c;n.keepDims&&(m=Tu(c,s)),e.compute(zu(t,n.cacheKey,[u],i,e.inputs[0].dataType,m,h),{inputs:[u]})},wp=(e,t)=>{tt(e,"ReduceMeanShared",t,"mean")},_p=(e,t)=>{tt(e,"ReduceL1Shared",t,"l1")},bp=(e,t)=>{tt(e,"ReduceL2Shared",t,"l2")},$p=(e,t)=>{tt(e,"ReduceLogSumExpShared",t,"logSumExp")},xp=(e,t)=>{tt(e,"ReduceMaxShared",t,"max")},vp=(e,t)=>{tt(e,"ReduceMinShared",t,"min")},kp=(e,t)=>{tt(e,"ReduceProdShared",t,"prod")},Sp=(e,t)=>{tt(e,"ReduceSumShared",t,"sum")},Ip=(e,t)=>{tt(e,"ReduceSumSquareShared",t,"sumSquare")},Tp=(e,t)=>{tt(e,"ReduceLogSumShared",t,"logSum")}}),rt,Mu,ci,ea,it,Au,Ou,Bu,Ru,Du,Nu,Uu,Pu,Lu,Wu,nt,Cp,Ep,zp,Mp,Ap,Op,Bp,Rp,Dp,Np,Ea=te(()=>{"use strict";me(),ge(),Re(),ye(),uy(),rt=e=>{if(!e||e.length===0||e.length>2)throw new Error("Reduce op requires 1 or 2 inputs.");if(e.length===2&&e[1].dims.length!==1)throw new Error("Invalid axes input dims.")},Mu=e=>["","",`var value = ${e.getByIndices("input_indices")};`,""],ci=(e,t,r,i,n,a,s=!1,o=!1)=>{let u=[],l=r[0].dims,c=l.length,h=L.normalizeAxes(n,c),m=!o&&h.length===0;l.forEach(($,v)=>{m||h.indexOf(v)>=0?s&&u.push(1):u.push($)});let g=u.length,f=L.size(u);return{name:e,shaderCache:t,getShaderSource:$=>{let v=[],b=H("_A",r[0].dataType,c),w=ue("output",a,g),k=i(b,w,h),I=k[2];for(let S=0,E=0;S<c;S++)m||h.indexOf(S)>=0?(s&&E++,I=`for(var j${S}: u32 = 0; j${S} < ${l[S]}; j${S}++) {
                  ${k[2].includes("last_index")?`let last_index = j${S};`:""}
                  ${b.indicesSet("input_indices",S,`j${S}`)}
                  ${I}
                }`):(v.push(`${b.indicesSet("input_indices",S,w.indicesGet("output_indices",E))};`),E++);return`

        ${$.registerUniform("output_size","u32").declareVariables(b,w)}

        ${$.mainStart()}
          ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${b.type.indices};
          let output_indices = ${w.offsetToIndices("global_idx")};

          ${v.join(`
`)}
          ${k[0]}       // init ops for reduce max/min
          ${k[1]}
          ${I}
          ${k[3]}
          ${k.length===4?w.setByOffset("global_idx","value"):k.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:u,dataType:a}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:[{type:12,data:f},...pe(l,u)]})}},ea=(e,t)=>{let r=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(i=>r.push(Number(i))),Ce({axes:r,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},it=(e,t,r,i)=>{let n=e.inputs,a=n.length===1?r:ea(n,r);e.compute(ci(t,{hint:a.cacheKey,inputDependencies:["rank"]},[n[0]],a.noopWithEmptyAxes&&a.axes.length===0?Mu:i,a.axes,n[0].dataType,a.keepDims,a.noopWithEmptyAxes),{inputs:[0]})},Au=(e,t)=>{rt(e.inputs),it(e,"ReduceLogSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,"value = log(value);"])},Ou=(e,t)=>{rt(e.inputs),it(e,"ReduceL1",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += abs(${r.getByIndices("input_indices")});`,""])},Bu=(e,t)=>{rt(e.inputs),it(e,"ReduceL2",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},Ru=(e,t)=>{rt(e.inputs),it(e,"ReduceLogSumExp",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += exp(${r.getByIndices("input_indices")});`,"value = log(value);"])},Du=(e,t)=>{rt(e.inputs),it(e,"ReduceMax",t,(r,i,n)=>{let a=[];for(let s=0;s<r.rank;s++)(n.indexOf(s)>=0||n.length===0)&&a.push(r.indicesSet("input_indices",s,0));return[`${a.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = max(value, ${r.getByIndices("input_indices")});`,""]})},Nu=(e,t)=>{rt(e.inputs),it(e,"ReduceMean",t,(r,i,n)=>{let a=1;for(let s=0;s<r.rank;s++)(n.indexOf(s)>=0||n.length===0)&&(a*=e.inputs[0].dims[s]);return["var sum = f32(0);","",`sum += f32(${r.getByIndices("input_indices")});`,`let value = ${i.type.value}(sum / ${a});`]})},Uu=(e,t)=>{rt(e.inputs),it(e,"ReduceMin",t,(r,i,n)=>{let a=[];for(let s=0;s<r.rank;s++)(n.indexOf(s)>=0||n.length===0)&&a.push(`input_indices[${s}] = 0;`);return[`${a.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = min(value, ${r.getByIndices("input_indices")});`,""]})},Pu=(e,t)=>{rt(e.inputs),it(e,"ReduceProd",t,(r,i)=>[`var value = ${i.type.storage}(1);`,"",`value *= ${r.getByIndices("input_indices")};`,""])},Lu=(e,t)=>{rt(e.inputs),it(e,"ReduceSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,""])},Wu=(e,t)=>{rt(e.inputs),it(e,"ReduceSumSquare",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += t * t;`,""])},nt=(e,t,r)=>{if(t.length===0)return r;let i=1,n=1;for(let a=0;a<t.length;a++)t.indexOf(a)===-1?i*=e[a]:n*=e[a];return n<32&&i>1024},Cp=(e,t)=>{nt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Nu(e,t):wp(e,t)},Ep=(e,t)=>{nt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Ou(e,t):_p(e,t)},zp=(e,t)=>{nt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Bu(e,t):bp(e,t)},Mp=(e,t)=>{nt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Ru(e,t):$p(e,t)},Ap=(e,t)=>{nt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Du(e,t):xp(e,t)},Op=(e,t)=>{nt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Uu(e,t):vp(e,t)},Bp=(e,t)=>{nt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Pu(e,t):kp(e,t)},Rp=(e,t)=>{nt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Lu(e,t):Sp(e,t)},Dp=(e,t)=>{nt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Wu(e,t):Ip(e,t)},Np=(e,t)=>{nt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Au(e,t):Tp(e,t)}}),ln,Up,Pp,ta,ly=te(()=>{"use strict";me(),Re(),Ea(),ln=e=>{if(!e||e.length===0||e.length>2)throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(e[0].dataType!==1)throw new Error("Invalid input type.")},Up=(e,t)=>{ln(e.inputs);let r=(i,n,a)=>{let s=[];for(let o=0;o<i.rank;o++)(a.indexOf(o)>=0||a.length===0)&&s.push(`input_indices[${o}] = 0;`);return[`${s.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?"<=":"<"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",n.setByOffset("global_idx","best_index")]};e.compute(ci("ArgMin",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},Pp=(e,t)=>{ln(e.inputs);let r=(i,n,a)=>{let s=[];for(let o=0;o<i.rank;o++)(a.indexOf(o)>=0||a.length===0)&&s.push(`input_indices[${o}] = 0;`);return[`${s.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?">=":">"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",n.setByOffset("global_idx","best_index")]};e.compute(ci("argMax",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},ta=e=>Ce(e)}),qu,Zr,Gu,Vu,Hu,zr,Fu,Lp,za=te(()=>{"use strict";me(),ge(),Ta(),ye(),qu=(e,t)=>{let r=e[0],i=e[1],n=e[2],a=e[3],s=e[4],o=e[5];if(s&&o)throw new Error("Attention cannot have both past and attention_bias");if(r.dims.length!==3)throw new Error('Input "input" must have 3 dimensions');let u=r.dims[0],l=r.dims[1],c=r.dims[2];if(n.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimensions');if(i.dims.length!==2)throw new Error('Input "weights" is expected to have 2 dimensions');if(i.dims[0]!==c)throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(n.dims[0]!==i.dims[1])throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let h=n.dims[0]/3,m=h,g=m;if(t.qkvHiddenSizes.length>0){if(t.qkvHiddenSizes.length!==3)throw new Error("qkv_hidden_sizes attribute should have 3 elements");for(let k of t.qkvHiddenSizes)if(k%t.numHeads!==0)throw new Error("qkv_hidden_sizes should be divisible by num_heads");h=t.qkvHiddenSizes[0],m=t.qkvHiddenSizes[1],g=t.qkvHiddenSizes[2]}let f=l;if(h!==m)throw new Error("qkv_hidden_sizes first element should be same as the second");if(n.dims[0]!==h+m+g)throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let $=0;if(s){if(m!==g)throw new Error('Input "past" expect k_hidden_size == v_hidden_size');if(s.dims.length!==5)throw new Error('Input "past" must have 5 dimensions');if(s.dims[0]!==2)throw new Error('Input "past" first dimension must be 2');if(s.dims[1]!==u)throw new Error('Input "past" second dimension must be batch_size');if(s.dims[2]!==t.numHeads)throw new Error('Input "past" third dimension must be num_heads');if(s.dims[4]!==m/t.numHeads)throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');t.pastPresentShareBuffer||($=s.dims[3])}let v=f+$,b=-1,w=0;if(a)throw new Error("Mask not supported");if(s)throw new Error("past is not supported");if(o){if(o.dims.length!==4)throw new Error('Input "attention_bias" must have 4 dimensions');if(o.dims[0]!==u||o.dims[1]!==t.numHeads||o.dims[2]!==l||o.dims[3]!==v)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:u,sequenceLength:l,pastSequenceLength:$,kvSequenceLength:f,totalSequenceLength:v,maxSequenceLength:b,inputHiddenSize:c,hiddenSize:h,vHiddenSize:g,headSize:Math.floor(h/t.numHeads),vHeadSize:Math.floor(g/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:w,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},Zr=(e,t,r)=>t&&e?`
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
    `,Gu=(e,t,r,i,n,a,s,o)=>{let u=Be(s?1:a),l=64,c=a/u;c<l&&(l=32);let h=Math.ceil(a/u/l),m=[{type:12,data:t},{type:12,data:r},{type:12,data:i},{type:12,data:n},{type:12,data:c},{type:12,data:h}],g=We(e.dataType,u),f=Le(1,u),$=["type"];s&&$.push("type"),o&&$.push("type");let v=b=>{let w=ue("x",e.dataType,e.dims,u),k=[w],I=s?H("seq_lens",s.dataType,s.dims):void 0;I&&k.push(I);let S=o?H("total_sequence_length_input",o.dataType,o.dims):void 0;S&&k.push(S);let E=Le(e.dataType),C=[{name:"batch_size",type:"u32"},{name:"num_heads",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"sequence_length",type:"u32"},{name:"total_sequence_length",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${l}>;
  var<workgroup> thread_sum: array<f32, ${l}>;
  ${b.registerUniforms(C).declareVariables(...k)}
  ${b.mainStart([l,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${Zr(I,S,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${l}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${s?"u32(past_sequence_length + workgroup_id.y + 1)":"total_sequence_length"};
    var thread_max_vector = ${f}(-3.4028234663852886e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${f}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(u){case 1:return"thread_max_vector";case 2:return"max(thread_max_vector.x, thread_max_vector.y)";case 4:return"max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";default:throw new Error(`Unsupported components: ${u}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.4028234663852886e+38f);
    for (var i = 0u; i < ${l}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${f}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${f}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(u){case 1:return"sum_vector";case 2:return"sum_vector.x + sum_vector.y";case 4:return"sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";default:throw new Error(`Unsupported components: ${u}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${l}; i++) {
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
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${l};${g};${u}`,inputDependencies:$},getShaderSource:v,getRunData:()=>({outputs:[],dispatchGroup:{x:1,y:n,z:t*r},programUniforms:m})}},Vu=(e,t,r,i,n,a,s,o,u)=>{let l=s+a.kvSequenceLength,c=[a.batchSize,a.numHeads,a.sequenceLength,l],h=e>1&&i,m=a.kvNumHeads?a.kvNumHeads:a.numHeads,g=h?[a.batchSize,m,l,a.headSize]:void 0,f=a.nReps?a.nReps:1,$=a.scale===0?1/Math.sqrt(a.headSize):a.scale,v=Be(a.headSize),b=a.headSize/v,w=12,k={x:Math.ceil(l/w),y:Math.ceil(a.sequenceLength/w),z:a.batchSize*a.numHeads},I=[{type:12,data:a.sequenceLength},{type:12,data:b},{type:12,data:l},{type:12,data:a.numHeads},{type:12,data:a.headSize},{type:1,data:$},{type:12,data:s},{type:12,data:a.kvSequenceLength},{type:12,data:f}],S=h&&i&&L.size(i.dims)>0,E=["type","type"];S&&E.push("type"),n&&E.push("type"),o&&E.push("type"),u&&E.push("type");let C=[{dims:c,dataType:t.dataType,gpuDataType:0}];h&&C.push({dims:g,dataType:t.dataType,gpuDataType:0});let x=M=>{let N=H("q",t.dataType,t.dims,v),B=H("key",r.dataType,r.dims,v),U=[N,B];if(S){let ae=H("past_key",i.dataType,i.dims,v);U.push(ae)}n&&U.push(H("attention_bias",n.dataType,n.dims));let F=o?H("seq_lens",o.dataType,o.dims):void 0;F&&U.push(F);let O=u?H("total_sequence_length_input",u.dataType,u.dims):void 0;O&&U.push(O);let q=ue("output",t.dataType,c),j=[q];h&&j.push(ue("present_key",t.dataType,g,v));let P=Le(1,v),ie=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${w}u;

  var<workgroup> tileQ: array<${N.type.storage}, ${w*w}>;
  var<workgroup> tileK: array<${N.type.storage}, ${w*w}>;
  ${M.registerUniforms(ie).declareVariables(...U,...j)}
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
    ${Zr(F,O,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${S&&h?"let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;":""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${h?"let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;":""}
    var value = ${P}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${S&&h?`
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
          value += ${P}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(v){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw new Error(`Unsupported components: ${v}`)}})()};
        output[outputIdx] = ${q.type.value} (sum * uniforms.alpha) + ${n?"attention_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${v};${n!==void 0};${i!==void 0};${e}`,inputDependencies:E},getRunData:()=>({outputs:C,dispatchGroup:k,programUniforms:I}),getShaderSource:x}},Hu=(e,t,r,i,n,a,s=void 0,o=void 0)=>{let u=a+n.kvSequenceLength,l=n.nReps?n.nReps:1,c=n.vHiddenSize*l,h=e>1&&i,m=n.kvNumHeads?n.kvNumHeads:n.numHeads,g=h?[n.batchSize,m,u,n.headSize]:void 0,f=[n.batchSize,n.sequenceLength,c],$=12,v={x:Math.ceil(n.vHeadSize/$),y:Math.ceil(n.sequenceLength/$),z:n.batchSize*n.numHeads},b=[{type:12,data:n.sequenceLength},{type:12,data:u},{type:12,data:n.vHeadSize},{type:12,data:n.numHeads},{type:12,data:n.headSize},{type:12,data:c},{type:12,data:a},{type:12,data:n.kvSequenceLength},{type:12,data:l}],w=h&&i&&L.size(i.dims)>0,k=["type","type"];w&&k.push("type"),s&&k.push("type"),o&&k.push("type");let I=[{dims:f,dataType:t.dataType,gpuDataType:0}];h&&I.push({dims:g,dataType:t.dataType,gpuDataType:0});let S=E=>{let C=H("probs",t.dataType,t.dims),x=H("v",r.dataType,r.dims),M=[C,x];w&&M.push(H("past_value",i.dataType,i.dims));let N=s?H("seq_lens",s.dataType,s.dims):void 0;s&&M.push(N);let B=o?H("total_sequence_length_input",o.dataType,o.dims):void 0;o&&M.push(B);let U=[ue("output",t.dataType,f)];h&&U.push(ue("present_value",t.dataType,g));let F=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${$}u;
  var<workgroup> tileQ: array<${C.type.value}, ${$*$}>;
  var<workgroup> tileV: array<${C.type.value}, ${$*$}>;
  ${E.registerUniforms(F).declareVariables(...M,...U)}
  ${E.mainStart([$,$,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${l===1?"headIdx":"headIdx / uniforms.n_reps"};
   let kv_num_heads = ${l===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${Zr(N,B,!0)}
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
  }`};return{name:"AttentionScore",shaderCache:{hint:`${i!==void 0};${e}`,inputDependencies:k},getRunData:()=>({outputs:I,dispatchGroup:v,programUniforms:b}),getShaderSource:S}},zr=(e,t,r,i,n,a,s,o,u,l,c=void 0,h=void 0)=>{let m=Math.min(e.outputCount,1+(s?1:0)+(o?1:0)),g=m>1?s:void 0,f=m>1?o:void 0,$=m>1?l.pastSequenceLength:0,v=$+l.kvSequenceLength,b=u&&L.size(u.dims)>0?u:void 0,w=[t,r];g&&L.size(g.dims)>0&&w.push(g),b&&w.push(b),c&&w.push(c),h&&w.push(h);let k=e.compute(Vu(m,t,r,g,b,l,$,c,h),{inputs:w,outputs:m>1?[-1,1]:[-1]})[0];e.compute(Gu(k,l.batchSize,l.numHeads,$,l.sequenceLength,v,c,h),{inputs:c&&h?[k,c,h]:[k],outputs:[]});let I=[k,i];f&&L.size(f.dims)>0&&I.push(f),c&&I.push(c),h&&I.push(h),e.compute(Hu(m,k,i,f,l,$,c,h),{inputs:I,outputs:m>1?[0,2]:[0]})},Fu=(e,t)=>{let r=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],i=t.sequenceLength,n=t.inputHiddenSize,a=t.headSize,s=12,o={x:Math.ceil(t.headSize/s),y:Math.ceil(t.sequenceLength/s),z:t.batchSize*t.numHeads},u=[e.inputs[0],e.inputs[1],e.inputs[2]],l=[{type:12,data:i},{type:12,data:n},{type:12,data:a},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}],c=h=>{let m=ue("output_q",u[0].dataType,r),g=ue("output_k",u[0].dataType,r),f=ue("output_v",u[0].dataType,r),$=H("input",u[0].dataType,u[0].dims),v=H("weight",u[1].dataType,u[1].dims),b=H("bias",u[2].dataType,u[2].dims),w=$.type.storage,k=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
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
  }`};return e.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:o,programUniforms:l}),getShaderSource:c},{inputs:u,outputs:[-1,-1,-1]})},Lp=(e,t)=>{let r=qu(e.inputs,t),[i,n,a]=Fu(e,r);return zr(e,i,n,a,e.inputs[4],void 0,void 0,void 0,e.inputs[5],r)}}),ju,Ku,Zu,Wp,dy=te(()=>{"use strict";Ye(),me(),ge(),Re(),ye(),ju=(e,t)=>{if(!e||e.length!==5)throw new Error("BatchNormalization requires 5 inputs");let r=(i,n,a)=>{let s=n.length;if(s!==i.length)throw new Error(`${a}: num dimensions != ${s}`);n.forEach((o,u)=>{if(o!==i[u])throw new Error(`${a}: dim[${u}] do not match`)})};if(e[0].dims.length>1){let i=t.format==="NHWC"?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);r(e[1].dims,i,"Invalid input scale"),r(e[2].dims,i,"Invalid input B"),r(e[3].dims,i,"Invalid input mean"),r(e[4].dims,i,"Invalid input var")}else r(e[1].dims,[1],"Invalid input scale"),r(e[2].dims,[1],"Invalid input B"),r(e[3].dims,[1],"Invalid input mean"),r(e[4].dims,[1],"Invalid input var")},Ku=(e,t)=>{let{epsilon:r,spatial:i,format:n}=t,a=e[0].dims,s=i?Be(a[a.length-1]):1,o=n==="NHWC"&&a.length>1?s:1,u=L.size(a)/s,l=i,c=l?a.length:a,h=H("x",e[0].dataType,e[0].dims,s),m=H("scale",e[1].dataType,e[1].dims,o),g=H("bias",e[2].dataType,e[2].dims,o),f=H("inputMean",e[3].dataType,e[3].dims,o),$=H("inputVar",e[4].dataType,e[4].dims,o),v=ue("y",e[0].dataType,c,s),b=()=>{let k="";if(i)k=`let cOffset = ${a.length===1?"0u":n==="NHWC"?`outputIndices[${a.length-1}] / ${s}`:"outputIndices[1]"};`;else if(n==="NCHW")k=`
            ${v.indicesSet("outputIndices","0","0")}
            let cOffset = ${v.indicesToOffset("outputIndices")};`;else{k=`var cIndices = ${m.type.indices}(0);
                       cIndices[0] = outputIndices[${a.length-1}];`;for(let I=1;I<m.rank;I++)k+=`cIndices[${I}] = outputIndices[${I}];`;k+=`let cOffset = ${m.indicesToOffset("cIndices")};`}return k},w=k=>`
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
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${t.epsilon}_${t.format}_${i}_${s}`,inputDependencies:l?["rank","type","type","type","type"]:void 0},getShaderSource:w,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:l?[{type:12,data:u},...pe(a)]:[{type:12,data:u}]})}},Zu=e=>Ce(e),Wp=(e,t)=>{let{inputs:r,outputCount:i}=e,n=Zu({...t,outputCount:i});if(Ee.webgpu.validateInputContent&&ju(r,n),t.trainingMode)throw new Error("BatchNormalization trainingMode is not supported yet.");e.compute(Ku(r,n))}}),Yu,Qu,qp,cy=te(()=>{"use strict";ge(),ye(),Yu=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![320,640,1280].includes(e[0].dims[2]))throw new Error("number of channels should be 320, 640 or 1280");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},Qu=e=>{let t=e[0].dims,r=e[0].dims[2],i=L.size(t)/4,n=e[0].dataType,a=H("input",n,t,4),s=H("bias",n,[r],4),o=H("residual",n,t,4),u=ue("output",n,t,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)}}),getShaderSource:l=>`
  const channels = ${r}u / 4;
  ${l.declareVariables(a,s,o,u)}

  ${l.mainStart()}
    ${l.guardAgainstOutOfBoundsWorkgroupSizes(i)}
    let value = ${a.getByOffset("global_idx")}
      + ${s.getByOffset("global_idx % channels")} + ${o.getByOffset("global_idx")};
    ${u.setByOffset("global_idx","value")}
  }`}},qp=e=>{Yu(e.inputs),e.compute(Qu(e.inputs))}}),Xu,Ie,Gp,Vp,Hp,Fp,jp,Kp,Zp,Yp,Qp,Ju,Xp,Jp,eh,th,kr,rh,si,ih,nh,ah,sh,oh,uh,lh,dh,ch,ph,hh,fh,mh,gh,yh,wh,_h,dn,bh,ra,ia,$h,xh,vh,el,tl,kh,Ma=te(()=>{"use strict";me(),ge(),Re(),ye(),Xu=(e,t,r,i,n,a,s)=>{let o=Math.ceil(t/4),u="";typeof n=="string"?u=`${n}(a)`:u=n("a");let l=H("inputData",r,[o],4),c=ue("outputData",i,[o],4),h=[{name:"vec_size",type:"u32"}];return s&&h.push(...s),`
      ${e.registerUniforms(h).declareVariables(l,c)}

  ${a??""}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${l.getByOffset("global_idx")};
    ${c.setByOffset("global_idx",u)}
  }`},Ie=(e,t,r,i,n,a=e.dataType,s,o)=>{let u=[{type:12,data:Math.ceil(L.size(e.dims)/4)}];return s&&u.push(...s),{name:t,shaderCache:{hint:n,inputDependencies:["type"]},getShaderSource:l=>Xu(l,L.size(e.dims),e.dataType,a,r,i,o),getRunData:l=>({outputs:[{dims:e.dims,dataType:a}],dispatchGroup:{x:Math.ceil(L.size(l[0].dims)/64/4)},programUniforms:u})}},Gp=e=>{e.compute(Ie(e.inputs[0],"Abs","abs"))},Vp=e=>{e.compute(Ie(e.inputs[0],"Acos","acos"))},Hp=e=>{e.compute(Ie(e.inputs[0],"Acosh","acosh"))},Fp=e=>{e.compute(Ie(e.inputs[0],"Asin","asin"))},jp=e=>{e.compute(Ie(e.inputs[0],"Asinh","asinh"))},Kp=e=>{e.compute(Ie(e.inputs[0],"Atan","atan"))},Zp=e=>{e.compute(Ie(e.inputs[0],"Atanh","atanh"))},Yp=e=>Ce(e),Qp=(e,t)=>{let r;switch(t.to){case 10:r="vec4<f16>";break;case 1:r="vec4<f32>";break;case 12:r="vec4<u32>";break;case 6:r="vec4<i32>";break;case 9:r="vec4<bool>";break;default:throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute(Ie(e.inputs[0],"Cast",r,void 0,t.cacheKey,t.to))},Ju=e=>{let t,r,i=e.length>=2&&e[1].data!==0,n=e.length>=3&&e[2].data!==0;switch(e[0].dataType){case 1:t=i?e[1].getFloat32Array()[0]:-34028234663852886e22,r=n?e[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:t=i?e[1].getUint16Array()[0]:64511,r=n?e[2].getUint16Array()[0]:31743;break;default:throw new Error("Unsupport data type")}return Ce({min:t,max:r})},Xp=(e,t)=>{let r=t||Ju(e.inputs),i=Le(e.inputs[0].dataType);e.compute(Ie(e.inputs[0],"Clip",n=>`clamp(${n}, vec4<${i}>(uniforms.min), vec4<${i}>(uniforms.max))`,void 0,r.cacheKey,void 0,[{type:e.inputs[0].dataType,data:r.min},{type:e.inputs[0].dataType,data:r.max}],[{name:"min",type:i},{name:"max",type:i}]),{inputs:[0]})},Jp=e=>{e.compute(Ie(e.inputs[0],"Ceil","ceil"))},eh=e=>{e.compute(Ie(e.inputs[0],"Cos","cos"))},th=e=>{e.compute(Ie(e.inputs[0],"Cosh","cosh"))},kr=e=>Ce(e),rh=(e,t)=>{let r=Le(e.inputs[0].dataType);e.compute(Ie(e.inputs[0],"Elu",i=>`elu_vf32(${i})`,`
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
}`,ih=e=>{let t=Le(e.inputs[0].dataType);e.compute(Ie(e.inputs[0],"Erf",r=>`erf_vf32(${r})`,si(t)))},nh=e=>{e.compute(Ie(e.inputs[0],"Exp","exp"))},ah=e=>{e.compute(Ie(e.inputs[0],"Floor","floor"))},sh=e=>{let t=Le(e.inputs[0].dataType);e.compute(Ie(e.inputs[0],"Gelu",r=>`0.5 * ${r} * (1.0 + erf_vf32(${r} * 0.7071067811865475))`,si(t)))},oh=(e,t)=>{let r=Le(e.inputs[0].dataType);e.compute(Ie(e.inputs[0],"LeakyRelu",i=>`select(leaky_relu_alpha_ * ${i}, ${i}, ${i} >= vec4<${r}>(0.0))`,`const leaky_relu_alpha_ = ${r}(${t.alpha});`,t.cacheKey))},uh=e=>{e.compute(Ie(e.inputs[0],"Not",t=>`!${t}`))},lh=e=>{e.compute(Ie(e.inputs[0],"Neg",t=>`-${t}`))},dh=e=>{e.compute(Ie(e.inputs[0],"Reciprocal",t=>`1.0/${t}`))},ch=e=>{let t=Le(e.inputs[0].dataType);e.compute(Ie(e.inputs[0],"Relu",r=>`select(vec4<${t}>(0.0), ${r}, ${r} > vec4<${t}>(0.0))`))},ph=e=>{e.compute(Ie(e.inputs[0],"Sigmoid",t=>`(1.0 / (1.0 + exp(-${t})))`))},hh=e=>Ce(e),fh=(e,t)=>{let r=Le(e.inputs[0].dataType);e.compute(Ie(e.inputs[0],"HardSigmoid",i=>`max(vec4<${r}>(0.0), min(vec4<${r}>(1.0), ${t.alpha} * ${i} + vec4<${r}>(${t.beta})))`,void 0,t.cacheKey))},mh=e=>{let t=Le(e.inputs[0].dataType);e.compute(Ie(e.inputs[0],"HardSwish",r=>`${r} * max(vec4<${t}>(0.0), min(vec4<${t}>(1.0), vec4<${t}>(${t}(1.0 / 6.0)) * ${r} + vec4<${t}>(0.5)))`))},gh=e=>{e.compute(Ie(e.inputs[0],"Sin","sin"))},yh=e=>{e.compute(Ie(e.inputs[0],"Sinh","sinh"))},wh=e=>{e.compute(Ie(e.inputs[0],"Sqrt","sqrt"))},_h=e=>{e.compute(Ie(e.inputs[0],"Tan","tan"))},dn=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,bh=e=>{e.compute(Ie(e.inputs[0],"Tanh",dn))},ra=(e="f32")=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${dn("v")};
}
`,ia=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,$h=e=>{let t=Le(e.inputs[0].dataType);e.compute(Ie(e.inputs[0],"FastGelu",ia,ra(t),void 0,e.inputs[0].dataType))},xh=(e,t)=>{let r=Le(e.inputs[0].dataType);return e.compute(Ie(e.inputs[0],"ThresholdedRelu",i=>`select(vec4<${r}>(0.0), ${i}, ${i} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${r}>(${t.alpha});`,t.cacheKey)),0},vh=e=>{e.compute(Ie(e.inputs[0],"Log","log"))},el=(e,t)=>`
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
`,tl=e=>`quick_gelu_impl(${e})`,kh=(e,t)=>{let r=Le(e.inputs[0].dataType);e.compute(Ie(e.inputs[0],"QuickGelu",tl,el(r,t.alpha),t.cacheKey,e.inputs[0].dataType))}}),rl,il,Sh,py=te(()=>{"use strict";ge(),ye(),Ma(),rl=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![2560,5120,10240].includes(e[0].dims[2]))throw new Error("hidden state should be 2560, 5120 or 10240");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},il=e=>{let t=e[0].dims.slice();t[2]=t[2]/2;let r=H("input",e[0].dataType,e[0].dims,4),i=H("bias",e[0].dataType,[e[0].dims[2]],4),n=ue("output",e[0].dataType,t,4),a=L.size(t)/4,s=We(e[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)}}),getShaderSource:o=>`
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
  }`}},Sh=e=>{rl(e.inputs),e.compute(il(e.inputs))}}),nl,al,at,Ih,Th,Ch,Eh,zh,Mh,Ah,Oh,Bh,Rh,hy=te(()=>{"use strict";me(),ge(),ye(),nl=(e,t,r,i,n,a,s,o,u,l,c,h)=>{let m,g;typeof o=="string"?m=g=(w,k)=>`${o}((${w}),(${k}))`:typeof o=="function"?m=g=o:(m=o.scalar,g=o.vector);let f=ue("outputData",c,i.length,4),$=H("aData",u,t.length,4),v=H("bData",l,r.length,4),b;if(n)if(a){let w=L.size(t)===1,k=L.size(r)===1,I=t.length>0&&t[t.length-1]%4===0,S=r.length>0&&r[r.length-1]%4===0;w||k?b=f.setByOffset("global_idx",g(w?`${$.type.value}(${$.getByOffset("0")}.x)`:$.getByOffset("global_idx"),k?`${v.type.value}(${v.getByOffset("0")}.x)`:v.getByOffset("global_idx"))):b=`
            let outputIndices = ${f.offsetToIndices("global_idx * 4u")};
            let offsetA = ${$.broadcastedIndicesToOffset("outputIndices",f)};
            let offsetB = ${v.broadcastedIndicesToOffset("outputIndices",f)};
            ${f.setByOffset("global_idx",g(s||I?$.getByOffset("offsetA / 4u"):`${$.type.value}(${$.getByOffset("offsetA / 4u")}[offsetA % 4u])`,s||S?v.getByOffset("offsetB / 4u"):`${v.type.value}(${v.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else b=f.setByOffset("global_idx",g($.getByOffset("global_idx"),v.getByOffset("global_idx")));else{if(!a)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");let w=(k,I,S="")=>{let E=`aData[indexA${I}][componentA${I}]`,C=`bData[indexB${I}][componentB${I}]`;return`
            let outputIndices${I} = ${f.offsetToIndices(`global_idx * 4u + ${I}u`)};
            let offsetA${I} = ${$.broadcastedIndicesToOffset(`outputIndices${I}`,f)};
            let offsetB${I} = ${v.broadcastedIndicesToOffset(`outputIndices${I}`,f)};
            let indexA${I} = offsetA${I} / 4u;
            let indexB${I} = offsetB${I} / 4u;
            let componentA${I} = offsetA${I} % 4u;
            let componentB${I} = offsetB${I} % 4u;
            ${k}[${I}] = ${S}(${m(E,C)});
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
      }`},al=(e,t,r,i,n,a,s=r.dataType)=>{let o=r.dims.map(Number),u=i.dims.map(Number),l=!L.areEqual(o,u),c=o,h=L.size(o),m=!1,g=!1,f=[l];if(l){let $=ar.calcShape(o,u,!1);if(!$)throw new Error("Can't perform binary op on the given tensors");c=$.slice(),h=L.size(c);let v=L.size(o)===1,b=L.size(u)===1,w=o.length>0&&o[o.length-1]%4===0,k=u.length>0&&u[u.length-1]%4===0;f.push(v),f.push(b),f.push(w),f.push(k);let I=1;for(let S=1;S<c.length;S++){let E=o[o.length-S],C=u[u.length-S];if(E===C)I*=E;else break}I%4===0?(g=!0,m=!0):(v||b||w||k)&&(m=!0)}else m=!0;return f.push(m),{name:e,shaderCache:{hint:t+f.map($=>$.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:$=>nl($,o,u,c,m,l,g,n,r.dataType,i.dataType,s,a),getRunData:()=>({outputs:[{dims:c,dataType:s}],dispatchGroup:{x:Math.ceil(h/64/4)},programUniforms:[{type:12,data:Math.ceil(L.size(c)/4)},...pe(o,u,c)]})}},at=(e,t,r,i,n,a)=>{e.compute(al(t,n??"",e.inputs[0],e.inputs[1],r,i,a))},Ih=e=>{at(e,"Add",(t,r)=>`${t}+${r}`)},Th=e=>{at(e,"Div",(t,r)=>`${t}/${r}`)},Ch=e=>{at(e,"Equal",{scalar:(t,r)=>`u32(${t}==${r})`,vector:(t,r)=>`vec4<u32>(${t}==${r})`},void 0,void 0,9)},Eh=e=>{at(e,"Mul",(t,r)=>`${t}*${r}`)},zh=e=>{let t=H("input",e.inputs[0].dataType,e.inputs[0].dims).type.value;at(e,"Pow",{scalar:(r,i)=>`pow_custom(${r},${i})`,vector:(r,i)=>`pow_vector_custom(${r},${i})`},`
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
      `)},Mh=e=>{at(e,"Sub",(t,r)=>`${t}-${r}`)},Ah=e=>{at(e,"Greater",{scalar:(t,r)=>`u32(${t}>${r})`,vector:(t,r)=>`vec4<u32>(${t}>${r})`},void 0,void 0,9)},Oh=e=>{at(e,"Less",{scalar:(t,r)=>`u32(${t}<${r})`,vector:(t,r)=>`vec4<u32>(${t}<${r})`},void 0,void 0,9)},Bh=e=>{at(e,"GreaterOrEqual",{scalar:(t,r)=>`u32(${t}>=${r})`,vector:(t,r)=>`vec4<u32>(${t}>=${r})`},void 0,void 0,9)},Rh=e=>{at(e,"LessOrEqual",{scalar:(t,r)=>`u32(${t}<=${r})`,vector:(t,r)=>`vec4<u32>(${t}<=${r})`},void 0,void 0,9)}}),sl,ol,Dh,Nh,fy=te(()=>{"use strict";me(),ge(),Re(),ye(),sl=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");let r=0,i=e[r],n=i.dataType,a=i.dims.length;e.forEach((s,o)=>{if(o!==r){if(s.dataType!==n)throw new Error("input tensors should be one type");if(s.dims.length!==a)throw new Error("input tensors should have the same shape");s.dims.forEach((u,l)=>{if(l!==t&&u!==i.dims[l])throw new Error("non concat dimensions must match")})}})},ol=(e,t,r,i,n=0)=>{let a=e.reduce((b,w)=>b+L.size(w.dims),0),s=new Array(e.length),o=new Array(e.length),u=new Array(e.length),l=0,c=n,h=[],m=[],g=[{type:12,data:a}];for(let b=0;b<e.length;++b)s[b]=l,o[b]=c,l+=L.size(e[b].dims),c+=e[b].dims[t],m.push(e[b].dims.length),u[b]=H(`input${b}`,i,m[b]),h.push("rank"),g.push({type:12,data:s[b]}),g.push({type:12,data:o[b]});for(let b=0;b<e.length;++b)g.push(...pe(e[b].dims));g.push(...pe(r));let f=ue("output",i,r.length),$=u.map((b,w)=>{let k=`
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
  }`;return{name:"Concat",shaderCache:{hint:`${t}`,inputDependencies:h},getRunData:()=>({outputs:[{dims:r,dataType:i}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:g}),getShaderSource:v}},Dh=(e,t)=>{let r=e.inputs,i=r[0].dims,n=L.normalizeAxis(t.axis,i.length);sl(r,n);let a=i.slice();a[n]=r.reduce((l,c)=>l+(c.dims.length>n?c.dims[n]:0),0);let s=r.filter(l=>L.size(l.dims)>0);if(s.length===0){e.output(0,a);return}let o=e.deviceLimits.maxStorageBuffersPerShaderStage-1,u=0;for(let l=0;l<s.length;l+=o){let c=s.slice(l,l+o);e.compute(ol(c,n,a,r[0].dataType,u),{inputs:c,outputs:[0]}),u+=c.reduce((h,m)=>h+m.dims[n],0)}},Nh=e=>Ce({axis:e.axis})}),qt,Gt,Vt,Aa,Ft=te(()=>{"use strict";me(),ge(),qt=(e,t,r="f32")=>{switch(e.activation){case"Relu":return`value = max(value, ${t}(0.0));`;case"Sigmoid":return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${t}(${r}(uniforms.clip_min)), ${t}(${r}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${t}(0.0), min(${t}(1.0), ${r}(uniforms.alpha) * value + ${r}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${r}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw new Error(`Unsupported activation ${e.activation}`)}},Gt=(e,t)=>{e.activation==="Clip"?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):e.activation==="HardSigmoid"?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):e.activation==="LeakyRelu"&&t.push({type:1,data:e.alpha})},Vt=(e,t)=>{e.activation==="Clip"?t.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):e.activation==="HardSigmoid"?t.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):e.activation==="LeakyRelu"&&t.push({name:"alpha",type:"f32"})},Aa=e=>{let t=e?.activation||"";if(t==="HardSigmoid"){let[r,i]=e?.activation_params||[.2,.5];return{activation:t,alpha:r,beta:i}}else if(t==="Clip"){let[r,i]=e?.activation_params||[up,lp];return{activation:t,clipMax:i,clipMin:r}}else if(t==="LeakyRelu"){let[r]=e?.activation_params||[.01];return{activation:t,alpha:r}}return{activation:t}}}),Ge,Uh,Oa=te(()=>{"use strict";Ge=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw new Error(`${e}-component is not supported.`)}},Uh=e=>`
      ${e?"value = value + getBiasByOutputCoords(coords);":""}
      `}),Ph,my=te(()=>{"use strict";Ph=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`}),Ir,Ba,Ra=te(()=>{"use strict";me(),ge(),ye(),Ft(),Ir=(e,t,r,i,n)=>{let a=i-r;return`
      ${Array.from({length:r}).map((s,o)=>`
      if (${de(t.shape,o,t.rank)} != 1) {
        ${t.indicesSet(e,o,de(n,o+a,i))}
      } else {
        ${t.indicesSet(e,o,0)}
      }`).join("")}
`},Ba=(e,t,r,i,n=!1,a)=>{let s=e[0].dims,o=e[1].dims,u=s[s.length-2],l=o[o.length-1],c=s[s.length-1],h=Be(l),m=Be(c),g=Be(u),f=L.size(r)/h/g,$=e.length>2,v=i?i.slice(0,-2):r.slice(0,-2),b=[L.size(v),u,l],w=[{type:12,data:f},{type:12,data:u},{type:12,data:l},{type:12,data:c}];Gt(t,w),w.push(...pe(v,s,o)),$&&w.push(...pe(e[2].dims)),w.push(...pe(b));let k=I=>{let S=Ca("batch_dims",e[0].dataType,v.length),E=H("a",e[0].dataType,s.length,m),C=H("b",e[1].dataType,o.length,h),x=ue("output",e[0].dataType,b.length,h),M=We(x.type.tensor),N=qt(t,x.type.value,M),B=[E,C],U="";if($){let q=n?h:1;B.push(H("bias",e[2].dataType,e[2].dims.length,q)),U=`${n?`value += bias[col / ${q}];`:`value += ${x.type.value}(bias[row + i]);`}`}let F=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];Vt(t,F);let O=()=>{let q=`var a_data: ${E.type.value};`;for(let j=0;j<m;j++)q+=`
              let b_data${j} = b[(b_offset + (k + ${j}) * uniforms.N + col) / ${h}];`;for(let j=0;j<g;j++){q+=`a_data = a[(a_offset + (row + ${j}) * uniforms.K + k) / ${m}];`;for(let P=0;P<m;P++)q+=`
            values[${j}] = fma(${C.type.value}(a_data${m===1?"":`[${P}]`}), b_data${P}, values[${j}]);
`}return q};return`
  ${I.registerUniforms(F).registerInternalVariables(S).declareVariables(...B,x)}
  ${I.mainStart()}
    ${I.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${h})) * ${h};
    var index1 = global_idx / (uniforms.N / ${h});
    let stride1 = uniforms.M / ${g};
    let row = (index1 % stride1) * ${g};
    let batch = index1 / stride1;

    ${r.length===2?"":`let batch_indices = ${S.offsetToIndices("batch")};`}

    var a_indices: ${E.type.indices};
    ${Ir("a_indices",E,E.rank-2,S.rank,"batch_indices")}
    ${E.indicesSet("a_indices",E.rank-2,0)}
    ${E.indicesSet("a_indices",E.rank-1,0)}
    let a_offset = ${E.indicesToOffset("a_indices")};

    var b_indices: ${C.type.indices};
    ${Ir("b_indices",C,C.rank-2,S.rank,"batch_indices")}
    ${C.indicesSet("b_indices",C.rank-2,0)}
    ${C.indicesSet("b_indices",C.rank-1,0)}
    let b_offset = ${C.indicesToOffset("b_indices")};
    var values: array<${x.type.value}, ${g}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${m}) {
      ${O()}
    }
    for (var i = 0u; i < ${g}u; i++) {
      var value = values[i];
      ${U}
      ${N}
      let cur_indices = ${x.type.indices}(batch, row + i, col);
      let offset = ${x.indicesToOffset("cur_indices")};
      ${x.setByOffset(`offset / ${h}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${t.activation};${h};${m};${g};${n}`,inputDependencies:$?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:a?a(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:w}),getShaderSource:k}}}),ul,ll,na,cn,dl,aa,cl,pi,Da=te(()=>{"use strict";me(),ge(),ye(),Ft(),Ra(),Oa(),ul=(e,t)=>e?`
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
        }`,na=(e,t,r="f32",i,n=!1,a=32,s=!1,o=32)=>{let u=t[1]*e[1],l=t[0]*e[0],c=n?u:a,h=n?a:u,m=c/t[0],g=a/t[1];if(!((n&&m===4&&e[1]===4||!n&&(m===3||m===4))&&c%t[0]===0&&a%t[1]===0&&e[0]===4))throw new Error(`If transposeA ${n} is true, innerElementSize ${m} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${m} must be 3 or 4.
  tileAWidth ${c} must be divisible by workgroupSize[0]${t[0]}. tileInner ${a} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${m}<${r}>, ${c/m}>, ${h}>;
var<workgroup> mm_Bsub: array<array<vec4<${r}>, ${l/e[0]}>, ${a}>;

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
            `,dl=e=>e?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",aa=(e,t,r="f32",i,n=!1,a=32,s=!1,o=32,u=!1)=>{let l=e[1]*t[1],c=e[0]*t[0],h=n?l:a,m=n?a:l;if(!(m%t[1]===0&&h%t[0]===0&&a%t[1]===0))throw new Error(`tileAHight ${m} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${h} must be divisible by workgroupSize[0]${t[0]}, tileInner ${a} must be divisible by workgroupSize[1]${t[1]}`);let g=m/t[1],f=h/t[0],$=a/t[1],v=u?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${l};
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
let globalRowStart = i32(workgroupId.y) * ${l};

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
`},cl=(e,t,r,i,n=!1)=>{let[a,s,o,u]=i,l=We(i[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${a.type.indices}) -> ${Ge(e,l)} {
      var value = ${Ge(e,l)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${s.type.indices};
        ${Ir("aIndices",s,s.rank-2,a.rank,"batchIndices")}
        ${s.indicesSet("aIndices",s.rank-2,"u32(row)")}
        ${s.indicesSet("aIndices",s.rank-1,"u32(colIn)")}
        value = ${s.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${a.type.indices}) -> ${Ge(e,l)} {
      var value = ${Ge(e,l)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${o.type.indices};
        ${Ir("bIndices",o,o.rank-2,a.rank,"batchIndices")}
        ${o.indicesSet("bIndices",o.rank-2,"u32(row)")}
        ${o.indicesSet("bIndices",o.rank-1,"u32(colIn)")}
        value = ${o.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${Ge(e,l)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${n?"bias[colIn]":`${Ge(e,l)}(bias[row])`};`:""}
        ${r}
        ${u.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},pi=(e,t,r,i,n=!1,a)=>{let s=e[0].dims,o=e[1].dims,u=s.slice(0,-2),l=o.slice(0,-2),c=i?i.slice(0,-2):r.slice(0,-2),h=L.size(c),m=s[s.length-2],g=s[s.length-1],f=o[o.length-1],$=g%4===0&&f%4===0,v=m<=8?[4,1,1]:[4,4,1],b=[8,8,1],w=[Math.ceil(f/b[0]/v[0]),Math.ceil(m/b[1]/v[1]),Math.ceil(h/b[2]/v[2])],k=$?4:1,I=[...u,m,g/k],S=I.length,E=[...l,g,f/k],C=E.length,x=[h,m,f/k],M=[{type:6,data:m},{type:6,data:f},{type:6,data:g}];Gt(t,M),M.push(...pe(c,I,E));let N=["rank","rank"],B=e.length>2;B&&(M.push(...pe(e[2].dims)),N.push("rank")),M.push(...pe(x));let U=F=>{let O=c.length,q=Ca("batchDims",e[0].dataType,O,1),j=We(e[0].dataType),P=H("a",e[0].dataType,S,k),ie=H("b",e[1].dataType,C,k),ae=ue("result",e[0].dataType,x.length,k),Q=[P,ie];if(B){let ce=n?k:1;Q.push(H("bias",e[2].dataType,e[2].dims.length,ce))}let A=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];Vt(t,A);let W=We(ae.type.tensor),G=qt(t,ae.type.value,W),Z=cl(k,B,G,[q,P,ie,ae],n);return`
  ${F.registerUniforms(A).registerInternalVariables(q).declareVariables(...Q,ae)}
  ${Z}
  ${$?na(v,b,j,q):aa(v,b,j,q)}
                   `};return{name:"MatMul",shaderCache:{hint:`${v};${t.activation};${$};${n}`,inputDependencies:N},getRunData:()=>({outputs:[{dims:a?a(r):r,dataType:e[0].dataType}],dispatchGroup:{x:w[0],y:w[1],z:w[2]},programUniforms:M}),getShaderSource:U}}}),pl,Lh,gy=te(()=>{"use strict";me(),_t(),ye(),Ft(),Oa(),my(),Da(),pl=(e,t,r,i,n=!1,a,s=4,o=4,u=4,l="f32")=>{let c=M=>{switch(M){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${l}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${M} is not supported.`)}},h=M=>{switch(M){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw new Error(`innerElementSize ${M} is not supported.`)}},m=e?`
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
    var resData = ${Ge(s,l)}(0.0);
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
    return ${Ge(s,l)}(0.0);`:i&&r?`
    let col = colIn * ${s};
    ${w}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${w}
    }
    return ${Ge(s,l)}(0.0);`,I=e?i&&r?h(o):`
    let col = colIn * ${o};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${h(o)}
    }
    return ${Ge(o,l)}(0.0);`:`
    let col = colIn * ${o};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${h(o)}
    }
    return ${Ge(o,l)}(0.0);`,S=Ge(u,l),E=Ge(e?s:o,l),C=Ge(e?o:s,l),x=qt(a,S,l);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${E} {
      ${e?k:I}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${C} {
      ${e?I:k}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${S}) {
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
    }`},Lh=(e,t,r,i,n,a,s,o,u)=>{let l=t.format==="NHWC",c=l?e[0].dims[3]:e[0].dims[1],h=r[0],m=l?r[2]:r[3],g=l?r[1]:r[2],f=l?r[3]:r[1],$=l&&(c%4===0||c%3===0)&&f%4===0,v=l?f:m*g,b=l?m*g:f,w=[8,8,1],k=i<=8?[4,1,1]:[4,4,1],I=[Math.ceil(v/w[0]/k[0]),Math.ceil(b/w[1]/k[1]),Math.ceil(h/w[2]/k[2])];ke("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${I}`);let S=$?l&&c%4!==0?3:4:1,E=w[1]*k[1],C=w[0]*k[0],x=Math.max(w[0]*S,w[1]),M=i%E===0,N=n%C===0,B=a%x===0,U=$?[S,4,4]:[1,1,1],F=[{type:6,data:i},{type:6,data:n},{type:6,data:a},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];Gt(t,F),F.push(...pe(e[0].dims,e[1].dims));let O=["rank","rank"];s&&(F.push(...pe(e[2].dims)),O.push("rank")),F.push(...pe(r));let q=j=>{let P=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];Vt(t,P);let ie=$?4:1,ae=We(e[0].dataType),Q=`
      fn setOutputAtIndex(flatIndex : i32, value : ${$?`vec4<${ae}>`:ae}) {
        result[flatIndex] = ${$?`vec4<${ae}>`:ae}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${$?`vec4<${ae}>`:ae}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${$?"/ 4":""}, value);
      }`,A=H("x",e[0].dataType,e[0].dims.length,S===3?1:S),W=H("w",e[1].dataType,e[1].dims.length,ie),G=[A,W],Z=ue("result",e[0].dataType,r.length,ie);if(s){let ce=H("bias",e[2].dataType,e[2].dims.length,ie);G.push(ce),Q+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${$?`vec4<${ae}>`:ae} {
          return bias[coords.${l?"w":"y"}${$?"/ 4":""}];
        }`}return`
        ${Ph("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${j.registerUniforms(P).declareVariables(...G,Z)}
        ${Q}
        ${pl(l,M,N,B,s,t,U[0],U[1],U[2],ae)}
        ${$?na(k,w,ae,void 0,!l,x):aa(k,w,ae,void 0,!l,x,!1,void 0,o)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${t.cacheKey};${S};${$};${M};${N};${B};${E};${C};${x}`,inputDependencies:O},getRunData:()=>({outputs:[{dims:u?u(r):r,dataType:e[0].dataType}],dispatchGroup:{x:I[0],y:I[1],z:I[2]},programUniforms:F}),getShaderSource:q}}}),hl,pn,fr,fl,hn,ml,Wh,qh,yy=te(()=>{"use strict";me(),_t(),ge(),ye(),Ft(),Oa(),hl=e=>{let t=1;for(let r=0;r<e.length;r++)t*=e[r];return t},pn=e=>typeof e=="number"?[e,e,e]:e,fr=(e,t)=>t<=1?e:e+(e-1)*(t-1),fl=(e,t,r,i=1)=>{let n=fr(t,i);return Math.floor((e[0]*(r-1)-r+n)/2)},hn=(e,t,r,i,n)=>{n==null&&(n=fl(e,t[0],i[0]));let a=[0,0,0,r];for(let s=0;s<3;s++)e[s]+2*n>=t[s]&&(a[s]=Math.trunc((e[s]-t[s]+2*n)/i[s]+1));return a},ml=(e,t,r,i,n,a,s,o,u,l)=>{let c,h,m,g;if(e==="VALID"&&(e=0),typeof e=="number"){c={top:e,bottom:e,left:e,right:e,front:e,back:e};let f=hn([t,r,i,1],[o,u,l],1,[n,a,s],e);h=f[0],m=f[1],g=f[2]}else if(Array.isArray(e)){if(!e.every(($,v,b)=>$===b[0]))throw Error(`Unsupported padding parameter: ${e}`);c={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let f=hn([t,r,i,1],[o,u,l],1,[n,a,s],e[0]);h=f[0],m=f[1],g=f[2]}else if(e==="SAME_UPPER"){h=Math.ceil(t/n),m=Math.ceil(r/a),g=Math.ceil(i/s);let f=(h-1)*n+o-t,$=(m-1)*a+u-r,v=(g-1)*s+l-i,b=Math.floor(f/2),w=f-b,k=Math.floor($/2),I=$-k,S=Math.floor(v/2),E=v-S;c={top:k,bottom:I,left:S,right:E,front:b,back:w}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:c,outDepth:h,outHeight:m,outWidth:g}},Wh=(e,t,r,i,n,a=!1,s="channelsLast")=>{let o,u,l,c,h;if(s==="channelsLast")[o,u,l,c,h]=e;else if(s==="channelsFirst")[o,h,u,l,c]=e;else throw new Error(`Unknown dataFormat ${s}`);let[m,,g,f,$]=t,[v,b,w]=pn(r),[k,I,S]=pn(i),E=fr(g,k),C=fr(f,I),x=fr($,S),{padInfo:M,outDepth:N,outHeight:B,outWidth:U}=ml(n,u,l,c,v,b,w,E,C,x),F=a?m*h:m,O=[0,0,0,0,0];return s==="channelsFirst"?O=[o,F,N,B,U]:s==="channelsLast"&&(O=[o,N,B,U,F]),{batchSize:o,dataFormat:s,inDepth:u,inHeight:l,inWidth:c,inChannels:h,outDepth:N,outHeight:B,outWidth:U,outChannels:F,padInfo:M,strideDepth:v,strideHeight:b,strideWidth:w,filterDepth:g,filterHeight:f,filterWidth:$,effectiveFilterDepth:E,effectiveFilterHeight:C,effectiveFilterWidth:x,dilationDepth:k,dilationHeight:I,dilationWidth:S,inShape:e,outShape:O,filterShape:t}},qh=(e,t,r,i,n,a)=>{let s=a==="channelsLast",o=s?e[0].dims[3]:e[0].dims[1],u=!1,l=[64,1,1],c={x:r.map((w,k)=>k)},h=[Math.ceil(hl(c.x.map(w=>r[w]))/l[0]),1,1];ke("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${h}`);let m=u?s&&o%4!==0?3:4:1,g=L.size(r),f=[{type:12,data:g},{type:12,data:i},{type:12,data:n},{type:12,data:t.strides},{type:12,data:t.dilations}];Gt(t,f),f.push(...pe(e[0].dims,e[1].dims));let $=["rank","rank"],v=e.length===3;v&&(f.push(...pe(e[2].dims)),$.push("rank")),f.push(...pe(r));let b=w=>{let k=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:i.length},{name:"pads",type:"u32",length:n.length},{name:"strides",type:"u32",length:t.strides.length},{name:"dilations",type:"u32",length:t.dilations.length}];Vt(t,k);let I=u?4:1,S=We(e[0].dataType),E=H("x",e[0].dataType,e[0].dims.length,m===3?1:m),C=H("W",e[1].dataType,e[1].dims.length,I),x=[E,C],M=ue("result",e[0].dataType,r.length,I),N="";if(v){let F=H("bias",e[2].dataType,e[2].dims.length,I);x.push(F),N+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${u?`vec4<${S}>`:S} {
          return bias[${s?de("coords",4,5):de("coords",1,5)}${u?"/ 4":""}];
        }`}let B=Ge(m,S),U=qt(t,B,S);return`
            ${N}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> ${S} {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${E.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> ${S} {
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

              var value = ${S}(0);
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
                      ${s?`let xValues = vec4<${S}>(
                               getX(batch, xF, xR, xC, d1),
                               getX(batch, xF, xR, xC, d1 + 1),
                               getX(batch, xF, xR, xC, d1 + 2),
                               getX(batch, xF, xR, xC, d1 + 3));
                            `:`let xValues = vec4<${S}>(
                               getX(batch, d1, xF, xR, xC),
                               getX(batch, d1 + 1, xF, xR, xC),
                               getX(batch, d1 + 2, xF, xR, xC),
                               getX(batch, d1 + 3, xF, xR, xC));
                            `}
                            let wValues = vec4<${S}>(
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
                      ${s?`let xValues = vec2<${S}>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1));
                      `:`let xValues = vec2<${S}>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC));
                    `}
                    let wValues = vec2<${S}>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC));
                      value += dot(xValues, wValues);
                    } else if (inputDepthVec4Remainder == 3) {
                      ${s?`let xValues = vec3<${S}>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2));
                      `:`let xValues = vec3<${S}>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 2, xF, xR, xC));
                    `}
                    let wValues = vec3<${S}>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 2, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                  }
                }
              }
              ${v?"value = value + getBiasByOutputCoords(coords)":""};
              ${U}
              result[global_idx] = ${S}(value);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${t.cacheKey};${s};${m};${v}`,inputDependencies:$},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:h[0],y:h[1],z:h[2]},programUniforms:f}),getShaderSource:b}}}),Gh,Vh,wy=te(()=>{"use strict";me(),ge(),ye(),Ft(),Gh=(e,t,r,i)=>{let n=e.length>2,a=n?"value += b[output_channel];":"",s=e[0].dims,o=e[1].dims,u=t.format==="NHWC",l=u?r[3]:r[1],c=l/t.group,h=u&&c>=4?Be(l):1,m=L.size(r)/h,g=[{type:12,data:m},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:c}];Gt(t,g),g.push(...pe(s,[o[0],o[1],o[2],o[3]/h]));let f=n?["rank","rank","rank"]:["rank","rank"];g.push(...pe([r[0],r[1],r[2],r[3]/h]));let $=v=>{let b=ue("output",e[0].dataType,r.length,h),w=We(b.type.tensor),k=qt(t,b.type.value,w),I=H("x",e[0].dataType,s.length),S=H("w",e[1].dataType,o.length,h),E=[I,S];n&&E.push(H("b",e[2].dataType,e[2].dims,h));let C=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:t.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];Vt(t,C);let x=u?`
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
            let wVal = ${S.get("wHeight","wWidth","wInChannel","output_channel")};
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
            let wVal = ${S.get("output_channel","wInChannel","wHeight","wWidth")};
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
  }`};return{name:"GroupedConv",shaderCache:{hint:`${t.cacheKey}_${h}`,inputDependencies:f},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:g}),getShaderSource:$}},Vh=(e,t,r,i)=>{let n=e.length>2,a=Be(r[3]),s=Be(r[2]),o=L.size(r)/a/s,u=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/a],l=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/a],c=[r[0],r[1],r[2],r[3]/a],h=[{type:12,data:o},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];Gt(t,h),h.push(...pe(u,l,c));let m=(s-1)*t.strides[1]+l[1],g=f=>{let $=ue("output",e[0].dataType,c.length,a),v=We($.type.tensor),b=qt(t,$.type.value,v),w=H("x",e[0].dataType,u.length,a),k=H("w",e[1].dataType,l.length,a),I=[w,k];n&&I.push(H("b",e[2].dataType,e[2].dims,a));let S=n?"value += b[output_channel];":"",E=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return Vt(t,E),`
  ${f.registerUniforms(E).declareVariables(...I,$)}
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
    for (var w_height: u32 = 0u; w_height < ${l[0]}; w_height++) {
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
        for (var w_width: u32 = 0u; w_width < ${l[1]}; w_width++) {
          let w_val = ${k.get("w_height","w_width","0","output_channel")};
          for (var i = 0u; i < ${s}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${s}u; i++) {
      var value = values[i];
      ${S}
      ${b}
      ${$.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${t.cacheKey};${a};${s};${m};${l[0]};${l[1]}`,inputDependencies:n?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:h}),getShaderSource:g}}}),gl,Yr,yl,Qr,sa,fn,wl,_l,oa,_y=te(()=>{"use strict";ge(),gy(),yy(),Da(),wy(),Ft(),Ra(),Ct(),gl=(e,t,r,i,n,a)=>{let s=e[0],o=e.slice(a?1:2,a?3:4),u=o.length,l=t[0],c=t.slice(2).map((m,g)=>m+(m-1)*(r[g]-1)),h=o.map((m,g)=>m+i[g]+i[g+u]).map((m,g)=>Math.floor((m-c[g]+n[g])/n[g]));return h.splice(0,0,s),h.splice(a?3:1,0,l),h},Yr=[2,3,1,0],yl=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length>5)throw new Error("greater than 5D is not supported");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[1]*t.group;if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");let n=e[0].dims.length-2;if(t.dilations.length!==n)throw new Error(`dilations should be ${n}D`);if(t.strides.length!==n)throw new Error(`strides should be ${n}D`);if(t.pads.length!==n*2)throw new Error(`pads should be ${n*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape")},Qr=(e,t)=>{let r=e.kernelShape.slice();r.length<t[1].dims.length-2&&r.push(...Array(t[1].dims.length-2-r.length).fill(0));for(let a=2;a<t[1].dims.length;++a)r[a-2]===0&&(r[a-2]=t[1].dims[a]);let i=e.pads.slice();di.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,r,i,e.format==="NHWC",e.autoPad);let n=Object.assign({},e);return Object.assign(n,{kernelShape:r,pads:i}),n},sa=e=>{let t=Aa(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],n=e.dilations,a=e.group,s=e.kernel_shape,o=e.pads,u=e.strides,l=e.w_is_const();return{autoPad:i,format:r,dilations:n,group:a,kernelShape:s,pads:o,strides:u,wIsConst:l,...t,cacheKey:`${e.format};${t.activation};`}},fn=(e,t,r,i)=>{let n=r.format==="NHWC",a=gl(t[0].dims,t[1].dims,r.dilations,r.pads,r.strides,n);if(r.group!==1){let E=[t[0]];if(n){let C=e.kernelCustomData.wT??e.compute(Ze(t[1],Yr),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=C),E.push(C)}else E.push(t[1]);t.length===3&&E.push(t[2]),!e.adapterInfo.isArchitecture("ampere")&&n&&t[1].dims[0]===r.group&&t[1].dims[1]===1&&r.dilations[0]===1&&r.dilations[1]===1?e.compute(Vh(E,r,a,i),{inputs:E}):e.compute(Gh(E,r,a,i),{inputs:E});return}let s=t.length===3,o=t[0].dims[n?1:2],u=t[0].dims[n?2:3],l=t[0].dims[n?3:1],c=t[1].dims[2],h=t[1].dims[3],m=a[n?1:2],g=a[n?2:3],f=a[n?3:1],$=n&&c===o&&h===u&&r.pads[0]===0&&r.pads[1]===0;if($||c===1&&h===1&&r.dilations[0]===1&&r.dilations[1]===1&&r.strides[0]===1&&r.strides[1]===1&&r.pads[0]===0&&r.pads[1]===0){let E=a[0],C,x,M,N=[];if(n){let F=e.kernelCustomData.wT??e.compute(Ze(t[1],Yr),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];if(r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=F),$){let O=o*u*l;C=t[0].reshape([1,E,O]),x=F.reshape([1,O,f]),M=[1,E,f]}else C=t[0].reshape([E,o*u,l]),x=F.reshape([1,l,f]),M=[E,m*g,f];N.push(C),N.push(x)}else C=t[0].reshape([E,l,o*u]),x=t[1].reshape([1,f,l]),M=[E,f,m*g],N.push(x),N.push(C);s&&N.push(t[2]);let B=M[2],U=N[0].dims[N[0].dims.length-1];B<8&&U<8?e.compute(Ba(N,r,a,M,n,i),{inputs:N}):e.compute(pi(N,r,a,M,n,i),{inputs:N});return}let v=!0,b=e.kernelCustomData.wT??e.compute(Ze(t[1],Yr),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=b);let w=[t[0],b];s&&w.push(t[2]);let k=n?m*g:f,I=n?f:m*g,S=c*h*l;e.compute(Lh(w,r,a,k,I,S,s,v,i),{inputs:w})},wl=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let n=[0,t.pads[0],0,t.pads[1]],a=[1].concat(t.strides),s=[1].concat(t.dilations),o=[1].concat(t.kernelShape),u=Qr({...t,pads:n,strides:a,dilations:s,kernelShape:o},i);fn(e,i,u,l=>r?[l[0],l[2],l[3]]:[l[0],l[1],l[3]])},_l=(e,t,r)=>{let i=r.format==="NHWC"?"channelsLast":"channelsFirst",n=Qr(r,t),a=r.autoPad==="NOTSET"?r.pads:r.autoPad,s=Wh(t[0].dims,t[1].dims,r.strides,r.dilations,a,!1,i);e.compute(qh(t,n,s.outShape,[s.filterDepth,s.filterHeight,s.filterWidth],[s.padInfo.front,s.padInfo.top,s.padInfo.left],i))},oa=(e,t)=>{if(yl(e.inputs,t),e.inputs[0].dims.length===3)wl(e,t);else if(e.inputs[0].dims.length===5)_l(e,e.inputs,t);else{let r=Qr(t,e.inputs);fn(e,e.inputs,r)}}}),Hh,by=te(()=>{"use strict";me(),_t(),ge(),ye(),Hh=(e,t,r)=>{let i=e.length>2,n=t.outputShape,a=t.format==="NHWC",s=t.group,o=e[1].dims,u=o[2]/s,l=o[3],c=a?Be(u):1,h=a&&l===1&&u>=4,m=h?Math.floor(u/4)*4:Math.floor(u/c)*c,g=u-m,f=a?Be(l):1,$=a?l===1?c:f:1,v=L.size(n)/f,b=[Math.ceil(v/64),1,1];ke("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${b}`);let w=["rank","rank"],k=[t.strides[0],t.strides[1]],I=[t.kernelShape[a?1:2],t.kernelShape[a?2:3]],S=[t.dilations[0],t.dilations[1]],E=[I[0]+(t.dilations[0]<=1?0:(t.kernelShape[a?1:2]-1)*(t.dilations[0]-1)),I[1]+(t.dilations[1]<=1?0:(t.kernelShape[a?2:3]-1)*(t.dilations[1]-1))],C=[E[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),E[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],x=[{type:12,data:v},{type:12,data:k},{type:12,data:I},{type:12,data:S},{type:12,data:E},{type:6,data:C},{type:12,data:m},{type:12,data:u},{type:12,data:l},...pe(e[0].dims,e[1].dims)];i&&(x.push(...pe(e[2].dims)),w.push("rank")),x.push(...pe(n));let M=N=>{let B=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:k.length},{name:"filter_dims",type:"u32",length:I.length},{name:"dilations",type:"u32",length:I.length},{name:"effective_filter_dims",type:"u32",length:E.length},{name:"pads",type:"i32",length:C.length},{name:"input_channels_per_group_int",type:"u32"},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],U=We(e[0].dataType),F=a?1:2,O=a?2:3,q=a?3:1,j=H("W",e[1].dataType,e[1].dims.length,$),P=H("Dy",e[0].dataType,e[0].dims.length,c),ie=[P,j];i&&ie.push(H("bias",e[2].dataType,[n[q]].length,f));let ae=ue("result",e[0].dataType,n.length,f),Q=()=>{let G="";if(h)c===4?G+=`
        let xValue = ${P.getByOffset("x_offset")};
        let wValue = ${j.getByOffset("w_offset")};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;`:c===2?G+=`
          dotProd = dotProd + dot(vec4<${U}>(${P.getByOffset("x_offset")}, ${P.getByOffset("x_offset + 1u")}), vec4<${U}>(${j.getByOffset("w_offset")}, ${j.getByOffset("w_offset + 1u")}));
          x_offset += 2u;
          w_offset += 2u;`:c===1&&(G+=`
          dotProd = dotProd + dot(vec4<${U}>(${P.getByOffset("x_offset")}, ${P.getByOffset("x_offset + 1u")}, ${P.getByOffset("x_offset + 2u")}, ${P.getByOffset("x_offset + 3u")}), vec4<${U}>(${j.getByOffset("w_offset")}, ${j.getByOffset("w_offset + 1u")}, ${j.getByOffset("w_offset + 2u")}, ${j.getByOffset("w_offset + 3u")}));
          x_offset += 4u;
          w_offset += 4u;`);else if(G+=`
                  let xValue = ${a?P.getByOffset(`${P.indicesToOffset(`${P.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${c}`):P.get("batch","inputChannel","idyR","idyC")};
        `,c===1)G+=`
          let w_offset = ${j.indicesToOffset(`${j.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${j.getByOffset(`w_offset / ${$}`)};
          dotProd = dotProd + xValue * wValue;`;else for(let Z=0;Z<c;Z++)G+=`
            let wValue${Z} = ${j.getByOffset(`${j.indicesToOffset(`${j.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${Z}, wOutChannel)`)} / ${$}`)};
            dotProd = dotProd + xValue[${Z}] * wValue${Z};`;return G},A=()=>{if(g===0)return"";if(!h)throw new Error(`packInputAs4 ${h} is not true.`);let G="";if(c===1){G+="dotProd = dotProd";for(let Z=0;Z<g;Z++)G+=`
            + ${P.getByOffset(`x_offset + ${Z}`)} * ${j.getByOffset(`w_offset + ${Z}`)}`;G+=";"}else if(c===2){if(g!==2)throw new Error(`Invalid inputChannelsRemainder ${g}.`);G+=`
          let xValue = ${P.getByOffset("x_offset")};
          let wValue = ${j.getByOffset("w_offset")};
          dotProd = dotProd + dot(xValue, wValue);`}return G},W=`
            let outputIndices = ${ae.offsetToIndices(`global_idx * ${f}`)};
            let batch = ${ae.indicesGet("outputIndices",0)};
            let d1 = ${ae.indicesGet("outputIndices",q)};
            let r = ${ae.indicesGet("outputIndices",F)};
            let c = ${ae.indicesGet("outputIndices",O)};
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
              let dyR = (${U}(dyRCorner) + ${U}(wR)) / ${U}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${U}(uniforms.Dy_shape[${F}]) || fract(dyR) > 0.0 ||
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
                let dyC = (${U}(dyCCorner) + ${U}(wC)) / ${U}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${U}(uniforms.Dy_shape[${O}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${h?`
                var x_offset = ${P.indicesToOffset(`${P.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${c};
                var w_offset = ${j.indicesToOffset(`${j.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${$};
                  `:""}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${h?4:c}) {
                  ${Q()}
                  inputChannel = inputChannel + ${h?4:c};
                }
                ${A()}
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${i?` + bias[d1 / ${f}]`:""};
            ${ae.setByOffset("global_idx","value")};
          `;return`
    ${N.registerUniforms(B).declareVariables(...ie,ae)}
      ${N.mainStart()}
      ${N.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${W}}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${t.cacheKey};${c}${$}${f}${h}${g}`,inputDependencies:w},getRunData:()=>({dispatchGroup:{x:b[0],y:b[1],z:b[2]},outputs:[{dims:r?r(n):n,dataType:e[0].dataType}],programUniforms:x}),getShaderSource:M}}}),bl,$l,xl,mn,Fh,vl,gn,kl,jh,$y=te(()=>{"use strict";by(),Ft(),Ct(),bl=(e,t,r,i,n,a)=>(e-1)*t+r+(i-1)*n+1-a,$l=(e,t,r,i,n)=>{let a=Math.floor(e/2);t==="SAME_UPPER"?(r[i]=a,r[n]=e-a):t==="SAME_LOWER"&&(r[i]=e-a,r[n]=a)},xl=(e,t,r,i,n,a,s,o,u,l)=>{let c=e.length-2,h=l.length===0;u.length<c&&u.push(...Array(c-u.length).fill(0));let m=e[0],g=t[o?3:1]*n;for(let f=0,$=e.length-c-(o?1:0);f<c;++f,++$){let v=e[$],b=h?v*s[f]:l[f],w=bl(v,s[f],a[f],t[$],r[f],b);$l(w,i,a,f,f+c),h&&l.push(s[f]*(v-1)+u[f]+(t[$]-1)*r[f]+1-a[f]-a[f+c])}l.splice(0,0,m),l.splice(o?3:1,0,g)},mn=(e,t)=>{let r=e.kernelShape.slice();if(e.kernelShape.length===0||e.kernelShape.reduce((h,m)=>h*m,1)===0){r.length=0;for(let h=2;h<t[1].dims.length;++h)r.push(t[1].dims[h])}let i=e.format==="NHWC";r.splice(0,0,t[1].dims[0]),r.splice(i?3:1,0,t[1].dims[1]);let n=e.pads.slice(),a=e.outputShape.slice(),s=e.outputPadding.slice(),o=t[0].dims,u=e.dilations.slice();if(u.reduce((h,m)=>h+m,0)===0){let h=t[0].dims.length-2;u=new Array(h).fill(1)}let l=e.strides.slice();if(l.reduce((h,m)=>h+m,0)===0){let h=t[0].dims.length-2;l=new Array(h).fill(1)}xl(o,r,u,e.autoPad,e.group,n,l,i,s,a);let c=Object.assign({},e);return Object.assign(c,{kernelShape:r,pads:n,outputPadding:s,outputShape:a,dilations:u,strides:l}),c},Fh=e=>{let t=Aa(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof e.autoPad>"u"?0:e.autoPad],n=e.dilations,a=e.group??1,s=e.kernelShape,o=e.pads,u=e.strides,l=e.wIsConst(),c=e.outputPadding,h=e.outputShape;return{autoPad:i,format:r,dilations:n,group:a,kernelShape:s,outputPadding:c,outputShape:h,pads:o,strides:u,wIsConst:l,...t,cacheKey:`${e.format};${t.activation};`}},vl=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4&&e[0].dims.length!==3)throw new Error("currently only support 2-dimensional conv");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[0];if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let n=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==n))throw new Error("invalid bias");let a=e[0].dims.length-2;if(t.dilations.reduce((s,o)=>s+o,0)>0&&t.dilations.length!==a)throw new Error(`dilations should be ${a}D`);if(t.strides.reduce((s,o)=>s+o,0)>0&&t.strides.length!==a)throw new Error(`strides should be ${a}D`);if(t.pads.reduce((s,o)=>s+o,0)>0&&t.pads.length!==a*2)throw new Error(`pads should be ${a*2}D`);if(t.outputPadding.length!==a&&t.outputPadding.length!==0)throw new Error(`output_padding should be ${a}D`);if(t.kernelShape.reduce((s,o)=>s+o,0)>0&&t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw new Error("invalid output shape")},gn=(e,t,r,i)=>{let n=e.kernelCustomData.wT??e.compute(Ze(t[1],[2,3,0,1]),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=n);let a=[t[0],n];t.length===3&&a.push(t[2]),e.compute(Hh(a,r,i),{inputs:a})},kl=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let n=t.kernelShape;(n.length===0||n[0]===0)&&(n=[e.inputs[1].dims[2]]);let a=t.dilations;(a.length===0||a[0]===0)&&(a=[1]);let s=t.strides;(s.length===0||s[0]===0)&&(s=[1]);let o=t.pads;o.length===0&&(o=[0,0]),o=[0,o[0],0,o[1]],s=[1].concat(s),a=[1].concat(a),n=[1].concat(n);let u=t.outputPadding;u=[0].concat(u);let l=mn({...t,pads:o,strides:s,dilations:a,kernelShape:n,outputPadding:u},i);gn(e,i,l,c=>r?[c[0],c[2],c[3]]:[c[0],c[1],c[3]])},jh=(e,t)=>{if(vl(e.inputs,t),e.inputs[0].dims.length===3)kl(e,t);else{let r=mn(t,e.inputs);gn(e,e.inputs,r)}}}),Sl,Kh,Zh,xy=te(()=>{"use strict";me(),ge(),Re(),ye(),Sl=(e,t,r,i)=>{let n=L.size(t),a=t.length,s=H("input",e,a),o=ue("output",e,a),u=r.dataType===6?r.getInt32Array()[0]:Number(r.getBigInt64Array()[0]),l=L.normalizeAxis(u,a),c=h=>{let m=` i32(${s.indicesGet("inputIndices","uniforms.axis")}) `,g=de("uniforms.input_shape","uniforms.axis",a),f=i.reverse?m+(i.exclusive?" + 1":""):"0",$=i.reverse?g:m+(i.exclusive?"":" + 1");return`
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
                }`};return{name:"CumSum",shaderCache:{hint:i.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:[{type:12,data:n},{type:12,data:l},...pe(t,t)]}),getShaderSource:c}},Kh=(e,t)=>{let r=e.inputs[0].dims,i=e.inputs[0].dataType,n=e.inputs[1];e.compute(Sl(i,r,n,t),{inputs:[0]})},Zh=e=>{let t=e.exclusive===1,r=e.reverse===1;return Ce({exclusive:t,reverse:r})}}),Il,Tl,Cl,Yh,Qh,vy=te(()=>{"use strict";me(),ge(),Re(),ye(),Il=e=>{if(!e||e.length!==1)throw new Error("DepthToSpace requires 1 input.");if(e[0].dims.length!==4)throw new Error("DepthToSpace requires 4D input.")},Tl=(e,t,r,i)=>{let n=[];n.push(`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`);for(let a=0;a<t;++a)n.push(r.indicesSet("a",e[a],`i[${a}]`));return n.push("return a;}"),n.join(`
`)},Cl=(e,t)=>{let r,i,n,a,s,o,u=t.format==="NHWC",l=t.blocksize,c=t.mode==="DCR";u?([r,i,n,a]=e.dims,s=c?[r,i,n,l,l,a/l**2]:[r,i,n,a/l**2,l,l],o=c?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([r,i,n,a]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],s=c?[r,l,l,a/l**2,i,n]:[r,a/l**2,l,l,i,n],o=c?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let h=e.reshape(s),m=h.dims.length,g=e.dataType,f=H("a",g,m),$=ue("output",g,m),v=b=>`
  ${b.registerUniform("output_size","u32").declareVariables(f,$)}

  ${Tl(o,m,f,$)}

  ${b.mainStart()}
    ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${$.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${$.setByOffset("global_idx",f.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:["rank"]},getRunData:b=>{let w=u?[r,i*l,n*l,a/l**2]:[r,a/l**2,i*l,n*l],k=L.size(w),I=h.dims,S=L.sortBasedOnPerm(I,o);return{outputs:[{dims:w,dataType:b[0].dataType}],dispatchGroup:{x:Math.ceil(k/64)},programUniforms:[{type:12,data:k},...pe(I,S)]}},getShaderSource:v}},Yh=(e,t)=>{Il(e.inputs),e.compute(Cl(e.inputs[0],t))},Qh=e=>Ce({blocksize:e.blocksize,mode:e.mode,format:e.format})}),mt,mr,Xr,yn,kt,El,zl,Ml,wn,_n,bn,Al,Ol,$n,Bl,Xh,Jh,ky=te(()=>{"use strict";me(),ge(),Re(),ye(),mt=256,mr=512,Xr=2*Math.PI,yn=e=>{let t=[],r=e;for(let i of[4,2,3,5])for(;r%i===0;)t.push(i),r/=i;return r===1?t:void 0},kt=e=>{let t=e.toPrecision(9);return/[.eE]/.test(t)?t:`${t}.0`},El=(e,t,r,i,n)=>{let a=r/e,s=mr-i,o=l=>`smem[${s}u + base + ${l*t}u]`,u=`  for (var t = local_idx; t < ${a}u; t += ${mt}u) {
`;u+=`    let twiddleIndex = t % ${t}u;
    let angleUnit = f32(twiddleIndex);
`,u+=`    var leg: array<vec2<f32>, 5>;
`;for(let l=0;l<e;l++){let c=`${i}u + t + ${l*a}u`;if(l===0)u+=`    leg[0] = smem[${c}];
`;else{let h=n*Xr*l/(e*t);u+=`    { let a = ${kt(h)} * angleUnit; leg[${l}] = cmul(smem[${c}], vec2<f32>(cos(a), sin(a))); }
`}}if(u+=`    let base = (t / ${t}u) * ${t*e}u + twiddleIndex;
`,e===2)u+=`    ${o(0)} = leg[0] + leg[1];
    ${o(1)} = leg[0] - leg[1];
`;else if(e===4){let l=n<0?"vec2<f32>(oddDiff.y, -oddDiff.x)":"vec2<f32>(-oddDiff.y, oddDiff.x)";u+=`    let evenSum = leg[0] + leg[2]; let evenDiff = leg[0] - leg[2];
`,u+=`    let oddSum = leg[1] + leg[3]; let oddDiff = leg[1] - leg[3];
`,u+=`    let oddRot = ${l};
`,u+=`    ${o(0)} = evenSum + oddSum;
    ${o(1)} = evenDiff + oddRot;
`,u+=`    ${o(2)} = evenSum - oddSum;
    ${o(3)} = evenDiff - oddRot;
`}else for(let l=0;l<e;l++){let c=["leg[0]"];for(let h=1;h<e;h++){let m=n*Xr*(h*l)/e,g=kt(Math.cos(m)),f=kt(Math.sin(m));c.push(`vec2<f32>(leg[${h}].x*${g} - leg[${h}].y*${f}, leg[${h}].x*${f} + leg[${h}].y*${g})`)}u+=`    ${o(l)} = ${c.join(" + ")};
`}return`${u}  }
  workgroupBarrier();
`},zl=(e,t,r)=>{let i="",n=1,a=0;for(let s of e)i+=El(s,n,t,a,r),n*=s,a=mr-a;return{code:i,resultOffset:a}},Ml=(e,t,r,i,n)=>{let a=e.dims,s=a.length,o=a[s-1],u=a[t],l=r&&i?(u-1)*2:u;n!==void 0&&(l=n);let c=r&&i?1:2,h=i&&!r?Math.floor(l/2)+1:l,m=a.slice();m[t]=h,m[s-1]=c;let g=1;for(let $=t+1;$<s-1;$++)g*=a[$];let f=L.size(a)/o/u;return{dataType:e.dataType,outputDims:m,length:l,signalLength:u,inner:g,batch:f,inputComponents:o,outputComponents:c,outputLength:h,inverse:r,onesided:i}},wn=(e,t)=>[t,e.length,e.inputComponents,e.outputComponents,e.inverse,e.onesided].join(";"),_n=e=>[{type:12,data:e.batch},{type:12,data:e.signalLength},{type:12,data:e.inner},{type:12,data:e.outputLength}],bn=(e,t,r)=>e.registerUniform("batch","u32").registerUniform("signalLength","u32").registerUniform("inner","u32").registerUniform("outputLength","u32").declareVariables(t,r),Al=e=>{let{dataType:t,length:r,inputComponents:i,outputComponents:n,inverse:a,onesided:s}=e,o=Le(t),u=a?1:-1,l=a?1/r:1,c=yn(r),h=m=>{let g=H("x",t,[1]),f=ue("y",t,[1]),$=S=>{let E=`inBase + (${S}) * uniforms.inner * ${i}u`,C=`f32(${g.getByOffset(E)})`,x=i===2?`f32(${g.getByOffset(`${E} + 1u`)})`:"0.0";return`vec2<f32>(${C}, ${x})`},v;if(a&&s){let S=Math.floor(r/2)+1,E=r%2===0?`select(provided, provided - 1u, provided == ${S}u)`:"provided";v=`
    let provided = min(uniforms.signalLength, ${S}u);
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
    workgroupBarrier();`;let{code:b,resultOffset:w}=zl(c,r,u),k=l===1?`smem[${w}u + i]`:`smem[${w}u + i] * ${kt(l)}`,I=n===2?f.setByOffset("off + 1u",`${o}(v.y)`):"";return`
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
      ${I}
    }
  }`};return{name:"DFT",shaderCache:{hint:wn(e,"fft"),inputDependencies:["type"]},getShaderSource:h,getRunData:()=>({outputs:[{dims:e.outputDims,dataType:t}],programUniforms:_n(e),dispatchGroup:{x:e.batch}})}},Ol=e=>{let{dataType:t,length:r,inputComponents:i,outputComponents:n,inverse:a,onesided:s}=e,o=Le(t),u=a?1:-1,l=a?1/r:1,c=h=>{let m=H("x",t,[1]),g=ue("y",t,[1]),f=k=>{let I=`inBase + (${k}) * uniforms.inner * ${i}u`,S=`f32(${m.getByOffset(I)})`,E=i===2?`f32(${m.getByOffset(`${I} + 1u`)})`:"0.0";return`vec2<f32>(${S}, ${E})`},$=a&&s?`fn spectrum(inBase: u32, k: u32) -> vec2<f32> {
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
      if (knMod >= ${r}u) { knMod -= ${r}u; }`,b=n===2?g.setByOffset("off + 1u",`${o}(v.y)`):"",w=l===1?"acc":`acc * ${kt(l)}`;return`
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
  }`};return{name:"DFT",shaderCache:{hint:wn(e,"direct"),inputDependencies:["type"]},getShaderSource:c,getRunData:()=>({outputs:[{dims:e.outputDims,dataType:t}],programUniforms:_n(e),dispatchGroup:{x:e.batch}})}},$n=e=>{if(!e||e.dataType===0)return;if(L.size(e.dims)!==1)throw new Error("DFT optional scalar inputs must have exactly 1 element.");if(e.dataType===6)return e.getInt32Array()[0];let t=Number(e.getBigInt64Array()[0]);if(!Number.isSafeInteger(t))throw new Error("DFT optional scalar inputs are out of JavaScript safe integer range.");return t},Bl=e=>{if(!e||e.length<1)throw new Error("DFT requires at least 1 input.");let t=e[0].dims;if(t.length<2)throw new Error("DFT input must have at least 2 dimensions.");let r=t[t.length-1];if(r!==1&&r!==2)throw new Error("DFT input's innermost dimension must be 1 (real) or 2 (complex).")},Xh=(e,t)=>{Bl(e.inputs);let r=e.inputs[0],i=r.dims.length,n=t.inverse!==0,a=t.onesided!==0,s=$n(e.inputs[1]);if(s!==void 0&&s<=0)throw new Error("dft_length must be greater than zero.");let o=L.normalizeAxis($n(e.inputs[2])??t.axis,i);if(o===i-1)throw new Error("DFT axis must refer to a signal dimension, not the innermost (real/imaginary) dimension.");if(n&&a&&r.dims[i-1]!==2)throw new Error("Inverse one-sided DFT (IRFFT) requires complex-valued input (innermost dimension 2).");let u=Ml(r,o,n,a,s);if(u.length<=0)throw new Error(`Invalid DFT length: ${u.length}`);let l=u.length<=mr&&yn(u.length)!==void 0?Al(u):Ol(u);e.compute(l,{inputs:[0]})},Jh=e=>Ce({axis:e.axis??1,inverse:e.inverse??0,onesided:e.onesided??0})}),Jr,gr,xn,Rl,Dl,Nl,Ul,vn,Pl,ef,tf,Sy=te(()=>{"use strict";me(),ge(),Re(),ye(),Jr="[a-zA-Z]|\\.\\.\\.",gr="("+Jr+")+",xn="^"+gr+"$",Rl="("+gr+",)*"+gr,Dl="^"+Rl+"$",Nl=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,t){let r=this.symbolToIndices.get(e);r===void 0?r=[t]:r.push(t),this.symbolToIndices.set(e,r)}},Ul=class{constructor(e,t){this.equation=t,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=new Array,this.outputDims=[];let[r,i]=t.includes("->")?t.split("->",2):[t,""];if(!r.match(RegExp(Dl)))throw new Error("Invalid LHS term");if(r.split(",").forEach((n,a)=>{let s=e[a].dims.slice();if(!n.match(RegExp(xn)))throw new Error("Invalid LHS term");let o=this.processTerm(n,!0,s,a);this.lhs.push(o)}),i==="")i+=[...this.symbolToInfo.entries()].filter(([n,a])=>a.count===1||n==="...").map(([n])=>n).join("");else if(!i.match(RegExp(gr)))throw new Error("Invalid RHS");i.match(RegExp(Jr,"g"))?.forEach(n=>{if(n==="...")this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let a=this.symbolToInfo.get(n);if(a===void 0)throw new Error("Invalid RHS symbol");this.outputDims.push(a.dimValue)}}),this.rhs=this.processTerm(i,!1,this.outputDims)}addSymbol(e,t,r){let i=this.symbolToInfo.get(e);if(i!==void 0){if(i.dimValue!==t&&i.count!==1)throw new Error("Dimension mismatch");i.count++,i.inputIndices.push(r)}else i={count:1,dimValue:t,inputIndices:[r]};this.symbolToInfo.set(e,i)}processTerm(e,t,r,i=-1){let n=r.length,a=!1,s=[],o=0;if(!e.match(RegExp(xn))&&!t&&e!=="")throw new Error("Invalid LHS term");let u=e.match(RegExp(Jr,"g")),l=new Nl(i);return u?.forEach((c,h)=>{if(c==="..."){if(a)throw new Error("Only one ellipsis is allowed per input term");a=!0;let m=n-u.length+1;if(m<0)throw new Error("Ellipsis out of bounds");if(s=r.slice(o,o+m),this.hasEllipsis){if(this.ellipsisDims.length!==s.length||this.ellipsisDims.toString()!==s.toString())throw new Error("Ellipsis dimensions mismatch")}else if(t)this.hasEllipsis=!0,this.ellipsisDims=s;else throw new Error("Ellipsis must be specified in the LHS");for(let g=0;g<s.length;g++){let f=String.fromCharCode(48+g);l.addSymbol(f,h+g),this.addSymbol(f,r[o++],i)}}else l.addSymbol(c,h+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(c,r[o++],i)}),l}},vn=e=>e+"_max",Pl=(e,t,r,i)=>{let n=e.map(l=>l.length).map((l,c)=>H(`input${c}`,t,l)),a=L.size(i),s=ue("output",t,i.length),o=[...r.symbolToInfo.keys()].filter(l=>!r.rhs.symbolToIndices.has(l)),u=l=>{let c=[],h="var prod = 1.0;",m="var sum = 0.0;",g="sum += prod;",f=[],$=[],v=[],b=[],w=r.symbolToInfo.size===r.rhs.symbolToIndices.size;r.symbolToInfo.forEach((I,S)=>{if(r.rhs.symbolToIndices.has(S)){let E=r.rhs.symbolToIndices.get(S)?.[0];E!==void 0&&r.lhs.forEach((C,x)=>{if(I.inputIndices.includes(x)){let M=C.symbolToIndices.get(S);if(M===void 0)throw new Error("Invalid symbol error");M.forEach(N=>{c.push(`${n[x].indicesSet(`input${x}Indices`,N,s.indicesGet("outputIndices",E))}`)})}})}else r.lhs.forEach((E,C)=>{if(I.inputIndices.includes(C)){let x=E.symbolToIndices.get(S);if(x===void 0)throw new Error("Invalid symbol error");x.forEach(M=>{f.push(`${n[C].indicesSet(`input${C}Indices`,M,`${S}`)}`)}),b.push(`prod *= ${n[C].getByIndices(`input${C}Indices`)};`)}}),$.push(`for(var ${S}: u32 = 0; ${S} < uniforms.${vn(S)}; ${S}++) {`),v.push("}")});let k=w?[...c,`let sum = ${n.map((I,S)=>I.getByIndices(`input${S}Indices`)).join(" * ")};`]:[...c,m,...$,...f,h,...b,g,...v];return`
            ${l.registerUniforms(o.map(I=>({name:`${vn(I)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...n,s)}

            ${l.mainStart()}
            ${l.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${s.offsetToIndices("global_idx")};
            ${n.map((I,S)=>`var input${S}Indices: ${n[S].type.indices};`).join(`
`)}
            ${k.join(`
`)};
            ${s.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:r.equation,inputDependencies:e.map(()=>"rank")},getRunData:()=>{let l=o.filter(h=>r.symbolToInfo.has(h)).map(h=>({type:12,data:r.symbolToInfo.get(h)?.dimValue||0}));l.push({type:12,data:a});let c=e.map((h,m)=>[...pe(h)]).reduce((h,m)=>h.concat(m),l);return c.push(...pe(i)),{outputs:[{dims:i,dataType:t}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:c}},getShaderSource:u}},ef=(e,t)=>{let r=new Ul(e.inputs,t.equation),i=r.outputDims,n=e.inputs.map((a,s)=>a.dims);e.compute(Pl(n,e.inputs[0].dataType,r,i))},tf=e=>{let t=e.equation.replace(/\s+/g,"");return Ce({equation:t})}}),Ll,kn,Wl,ql,rf,Iy=te(()=>{"use strict";me(),ge(),ye(),Ll=e=>{if(!e||e.length!==2)throw new Error("Expand requires 2 input.");let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=r.length<t.length?0:r.length-t.length,n=t.length<r.length?0:t.length-r.length;for(;i<r.length&&n<t.length;++i,++n)if(r[i]!==t[n]&&r[i]!==1&&t[n]!==1)throw new Error("Expand requires shape to be broadcastable to input")},kn=(e,t)=>{let r=e.length-t.length,i=[];for(let n=0;n<r;++n)i.push(e[n]);for(let n=0;n<t.length;++n)i.push(t[n]===1?e[n+r]:t[n]);return i},Wl=(e,t)=>e.length>t.length?kn(e,t):kn(t,e),ql=e=>{let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=Wl(t,r),n=e[0].dataType,a=n===9||L.size(t)===1,s=n===9||t.length>0&&t[t.length-1]%4===0?4:1,o=a||i.length>0&&i[i.length-1]%4===0?4:1,u=Math.ceil(L.size(i)/o),l=h=>{let m=H("input",n,t.length,s),g=ue("output",n,i.length,o),f;if(n===9){let $=(v,b,w="")=>`
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
    ${f}`},c=[{type:12,data:u},...pe(t,i)];return{name:"Expand",shaderCache:{hint:`${i.length};${s}${o}`,inputDependencies:["rank"]},getShaderSource:l,getRunData:()=>({outputs:[{dims:i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:c})}},rf=e=>{Ll(e.inputs),e.compute(ql(e.inputs),{inputs:[0]})}}),Gl,nf,Ty=te(()=>{"use strict";me(),ge(),ye(),Ma(),Gl=e=>{let t=e[0].dataType,r=L.size(e[0].dims),i=L.size(e[1].dims),n=i%4===0,a=s=>{let o=H("x",t,[1],4),u=H("bias",t,[1],4),l=ue("y",t,[1],4),c=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],h=g=>`
      let bias${g}_offset: u32 = (global_idx * 4 + ${g}) % uniforms.bias_size;
      let bias${g} = ${u.getByOffset(`bias${g}_offset / 4`)}[bias${g}_offset % 4];`,m=n?`
      let bias = ${u.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${h(0)}${h(1)}${h(2)}${h(3)}
      let bias = ${o.type.value}(bias0, bias1, bias2, bias3);`;return`${s.registerUniforms(c).declareVariables(o,u,l)}

    ${ra(Le(t))}

    ${s.mainStart(sr)}
      ${s.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${o.getByOffset("global_idx")};
      ${m}
      let x_in = x + bias;
      ${l.setByOffset("global_idx",ia("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${n}`,inputDependencies:["type","type"]},getShaderSource:a,getRunData:s=>({outputs:[{dims:s[0].dims,dataType:s[0].dataType}],programUniforms:[{type:12,data:Math.ceil(r/4)},{type:12,data:i}],dispatchGroup:{x:Math.ceil(r/sr/4)}})}},nf=e=>{e.inputs.length<2||L.size(e.inputs[1].dims)===0?$h(e):e.compute(Gl(e.inputs))}}),Vl,Hl,af,sf,Cy=te(()=>{"use strict";me(),ge(),Re(),ye(),Vl=e=>{if(!e||e.length!==2)throw new Error("Gather requires 2 inputs.")},Hl=(e,t)=>{let r=e[0].dims,i=e[1].dims,n=r.length,a=L.normalizeAxis(t.axis,n),s=r.slice(0);s.splice(a,1,...i);let o=r[a],u=e[0].dataType===9?4:1,l=Math.ceil(L.size(s)/u),c=[{type:12,data:l},{type:6,data:o},{type:12,data:a},...pe(e[0].dims,e[1].dims,s)],h=m=>{let g=H("data",e[0].dataType,e[0].dims.length,u),f=H("inputIndices",e[1].dataType,e[1].dims.length),$=ue("output",e[0].dataType,s.length,u),v=w=>{let k=i.length,I=`var indicesIndices${w}  = ${f.type.indices}(0);`;for(let S=0;S<k;S++)I+=`${k>1?`indicesIndices${w}[${S}]`:`indicesIndices${w}`} = ${s.length>1?`outputIndices${w}[uniforms.axis + ${S}]`:`outputIndices${w}`};`;I+=`
          var idx${w} = ${f.getByIndices(`indicesIndices${w}`)};
          if (idx${w} < 0) {
            idx${w} = idx${w} + uniforms.axisDimLimit;
          }
          var dataIndices${w} : ${g.type.indices};
        `;for(let S=0,E=0;S<n;S++)S===a?(I+=`${n>1?`dataIndices${w}[${S}]`:`dataIndices${w}`} = u32(idx${w});`,E+=k):(I+=`${n>1?`dataIndices${w}[${S}]`:`dataIndices${w}`} = ${s.length>1?`outputIndices${w}[${E}]`:`outputIndices${w}`};`,E++);return I},b;if(e[0].dataType===9){let w=(k,I,S="")=>`
          let outputIndices${I} = ${$.offsetToIndices(`outputOffset + ${I}u`)};
          ${v(I)};
          let offset${I} = ${g.indicesToOffset(`dataIndices${I}`)};
          let index${I} = offset${I} / 4u;
          let component${I} = offset${I} % 4u;
          ${k}[${I}] = ${S}(${g.getByOffset(`index${I}`)}[component${I}]);
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
      }`};return{name:"Gather",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:s,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:c}),getShaderSource:h}},af=e=>Ce({axis:e.axis}),sf=(e,t)=>{let r=e.inputs;Vl(r),e.compute(Hl(e.inputs,t))}}),Fl,of,uf,Ey=te(()=>{"use strict";me(),ge(),ye(),Fl=(e,t,r,i,n,a,s,o,u)=>{let l=[{type:12,data:a},{type:12,data:i},{type:12,data:n},{type:12,data:r},{type:12,data:s},{type:12,data:o},{type:12,data:u}],c=[a];l.push(...pe(t.dims,c));let h=m=>{let g=H("indices_data",t.dataType,t.dims.length),f=ue("input_slice_offsets_data",12,1,1),$=[g,f],v=[{name:"output_size",type:"u32"},{name:"batch_dims",type:"u32"},{name:"input_dims",type:"u32",length:n.length},{name:"sizes_from_slice_dims_data",type:"u32",length:r.length},{name:"num_slices_per_batch",type:"u32"},{name:"input_batch_stride",type:"u32"},{name:"num_slice_dims",type:"u32"}];return`
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
  }`};return e.compute({name:"computeSliceOffsets",shaderCache:{hint:`${n.length}_${r.length}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:c,dataType:e.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:l}),getShaderSource:h},{inputs:[t],outputs:[-1]})[0]},of=(e,t)=>{let r=e.inputs,i=r[0].dims,n=r[0].dataType,a=r[1].dims,s=a[a.length-1],o=L.sizeToDimension(a,a.length-1),u=L.sizeFromDimension(i,t.batchDims+s),l=L.sizeToDimension(i,t.batchDims),c=L.sizeFromDimension(i,t.batchDims),h=o/l,m=new Array(s),g=u;for(let I=0;I<s;++I)m[s-1-I]=g,g*=i[t.batchDims+s-1-I];let f=Fl(e,r[1],m,t.batchDims,i,o,h,c,s),$=t.batchDims+s;if($>i.length)throw new Error("last dimension of indices must not be larger than rank of input tensor");let v=a.slice(0,-1).concat(i.slice($)),b=L.size(v),w=[{type:12,data:b},{type:12,data:u},...pe(r[0].dims,f.dims,v)],k=I=>{let S=H("data",r[0].dataType,r[0].dims.length),E=H("slice_offsets",12,f.dims.length),C=ue("output",r[0].dataType,v.length);return`
          ${I.registerUniform("output_size","u32").registerUniform("slice_size","u32").declareVariables(S,E,C)}
            ${I.mainStart()}
            ${I.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`};e.compute({name:"GatherND",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:v,dataType:n}],dispatchGroup:{x:Math.ceil(b/64)},programUniforms:w}),getShaderSource:k},{inputs:[r[0],f]})},uf=e=>({batchDims:e.batch_dims,cacheKey:""})}),jl,Kl,lf,df,zy=te(()=>{"use strict";me(),ge(),Re(),ye(),jl=(e,t)=>{if(e.length<3||e.length>4)throw new Error("GatherBlockQuantized requires 3 or 4 inputs.");let r=L.normalizeAxis(t.quantizeAxis,e[0].dims.length),i=t.blockSize,n=e[0],a=e[2],s=e.length===4?e[3]:void 0;if(a.dims.length!==n.dims.length||!n.dims.map((o,u)=>u===r?Math.ceil(o/i)===a.dims[u]:o===a.dims[u]).reduce((o,u)=>o&&u,!0))throw new Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");if(s){if(s.dataType!==n.dataType)throw new Error("Zero point must have the same data type as the input tensor.");if(s.dims.length!==a.dims.length||!s.dims.map((o,u)=>o===a.dims[u]).reduce((o,u)=>o&&u,!0))throw new Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.")}},Kl=(e,t)=>{let r=e[0].dims,i=e[1].dims,n=r.length,a=L.normalizeAxis(t.gatherAxis,n),s=L.normalizeAxis(t.quantizeAxis,n),o=r.slice(0);o.splice(a,1,...i);let u=L.size(o),l=e[2].dataType,c=e[0].dataType===22,h=[{type:12,data:u},{type:12,data:s},{type:12,data:a},{type:12,data:t.blockSize},...pe(...e.map((g,f)=>g.dims),o)],m=g=>{let f=H("data",e[0].dataType,e[0].dims.length),$=H("inputIndices",e[1].dataType,e[1].dims.length),v=H("scales",e[2].dataType,e[2].dims.length),b=e.length>3?H("zeroPoint",e[3].dataType,e[3].dims.length):void 0,w=ue("output",l,o.length),k=[f,$,v];b&&k.push(b);let I=[{name:"output_size",type:"u32"},{name:"quantize_axis",type:"u32"},{name:"gather_axis",type:"u32"},{name:"block_size",type:"u32"}];return`
        ${g.registerUniforms(I).declareVariables(...k,w)}
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
        let dequantized_data = ${Le(l)}(quantized_data - zero_point) * scale;
        ${w.setByOffset("global_idx","dequantized_data")};
    }`};return{name:"GatherBlockQuantized",shaderCache:{hint:`${t.cacheKey};${e.filter((g,f)=>f!==1).map(g=>g.dims.join("_")).join(";")}`,inputDependencies:Array.from({length:e.length},(g,f)=>"rank")},getRunData:()=>({outputs:[{dims:o,dataType:l}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:h}),getShaderSource:m}},lf=(e,t)=>{let r=e.inputs;jl(r,t),e.compute(Kl(e.inputs,t))},df=e=>Ce({blockSize:e.blockSize,gatherAxis:e.gatherAxis,quantizeAxis:e.quantizeAxis})}),Zl,Yl,cf,pf,My=te(()=>{"use strict";me(),ge(),Re(),ye(),Zl=e=>{if(!e||e.length!==2)throw new Error("GatherElements requires 2 inputs.");if(e[0].dims.length<1)throw new Error("GatherElements requires that the data input be rank >= 1.");if(e[0].dims.length!==e[1].dims.length)throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},Yl=(e,t)=>{let r=e[0].dims,i=e[0].dataType,n=r.length,a=e[1].dims,s=e[1].dataType,o=L.normalizeAxis(t.axis,n),u=r[o],l=a.slice(0),c=L.size(l),h=H("input",i,n),m=H("indicesInput",s,a.length),g=ue("output",i,l.length),f=[{type:12,data:c},{type:6,data:u},{type:12,data:o}];return f.push(...pe(r,a,l)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:l,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:f}),getShaderSource:$=>`
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
  }`}},cf=e=>Ce({axis:e.axis}),pf=(e,t)=>{let r=e.inputs;Zl(r),e.compute(Yl(e.inputs,t))}}),Ql,Xl,hf,ff,Ay=te(()=>{"use strict";me(),ge(),ye(),Ql=e=>{if(!e)throw new Error("Input is missing");if(e.length<2||e.length>3)throw new Error("Invaid input number.");if(e.length===3&&e[2].dims.length>2)throw new Error("Invalid input shape of C");if(e[0].dataType!==e[1].dataType||e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("Input types are mismatched")},Xl=(e,t)=>{let r=e[0].dims.slice(),i=e[1].dims.slice(),[n,a,s]=op.getShapeOfGemmResult(r,t.transA,i,t.transB,e.length===3?e[2].dims:void 0),o=[n,a];if(!o)throw new Error("Can't use gemm on the given tensors");let u=16,l=Math.ceil(a/u),c=Math.ceil(n/u),h=!0,m=L.size(o),g=[{type:12,data:h?l:m},{type:12,data:n},{type:12,data:a},{type:12,data:s},{type:1,data:t.alpha},{type:1,data:t.beta}],f=["type","type"];e.length===3&&(g.push(...pe(e[2].dims)),f.push("rank")),g.push(...pe(o));let $=b=>{let w="";t.transA&&t.transB?w="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":t.transA&&!t.transB?w="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!t.transA&&t.transB?w="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":!t.transA&&!t.transB&&(w="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let k=t.alpha===1?"":"value *= uniforms.alpha;",I=H("a",e[0].dataType,e[0].dims),S=H("b",e[1].dataType,e[1].dims),E=I.type.value,C=null,x=[I,S];e.length===3&&(C=H("c",e[2].dataType,e[2].dims.length),x.push(C));let M=ue("output",e[0].dataType,o.length);x.push(M);let N=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${b.registerUniforms(N).declareVariables(...x)}

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
  }`},v=b=>{let w=H("a",e[0].dataType,e[0].dims),k=H("b",e[1].dataType,e[1].dims),I=null,S=[w,k];e.length===3&&(I=H("c",e[2].dataType,e[2].dims.length),S.push(I));let E=ue("output",e[0].dataType,o.length);S.push(E);let C=[{name:"num_tile_n",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}],x="",M="";t.transA&&t.transB?(M=`
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
      `,x="value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");let N=t.alpha===1?"":"value *= uniforms.alpha;";return`
  ${b.registerUniforms(C).declareVariables(...S)}
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

    ${N}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${I!=null?`let cOffset = ${I.broadcastedIndicesToOffset("vec2(m, n)",E)}; value += ${E.type.value}(uniforms.beta) * ${I.getByOffset("cOffset")};`:""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`};return h?{name:"GemmShared",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:f},getRunData:()=>({outputs:[{dims:o,dataType:e[0].dataType}],dispatchGroup:{x:l*c},programUniforms:g}),getShaderSource:v}:{name:"Gemm",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:f},getRunData:()=>({outputs:[{dims:o,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:g}),getShaderSource:$}},hf=e=>{let t=e.transA,r=e.transB,i=e.alpha,n=e.beta;return{transA:t,transB:r,alpha:i,beta:n,cacheKey:`${e.transA};${e.transB};${e.alpha===1}`}},ff=(e,t)=>{Ql(e.inputs),e.compute(Xl(e.inputs,t))}}),dt,gt,At,Ot,Jl,ed,td,rd,id,nd,ad,sd,mf,gf,Oy=te(()=>{"use strict";me(),ge(),Re(),ye(),[dt,gt,At,Ot]=[0,1,2,3],Jl=e=>{if(e[0].dims.length!==4)throw new Error("only 4-D tensor is supported.");if(e[0].dims.length!==e[1].dims.length)throw new Error("input dimensions must be equal to grid dimensions");if(e[0].dims.length-2!==e[1].dims[e[1].dims.length-1])throw new Error(`last dimension of grid must be equal to ${e[0].dims.length-2}`);if(e[0].dims[0]!==e[1].dims[0])throw new Error("grid batch size must match input batch size")},ed=`
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
        `;default:throw new Error(`mode ${r.mode} is not supported`)}})()+`${e.setByOffset("global_idx","result")}`,sd=(e,t)=>{let r=H("x",e[0].dataType,e[0].dims.length),i=[e[1].dims[0],e[1].dims[1],e[1].dims[2]],n=H("grid",e[1].dataType,i.length,2),a=[e[0].dims[0],e[0].dims[1],e[1].dims[1],e[1].dims[2]];t.format==="NHWC"&&(a=[e[0].dims[0],e[1].dims[1],e[1].dims[2],e[0].dims[3]],[dt,gt,At,Ot]=[0,3,1,2]);let s=ue("output",e[0].dataType,a.length),o=r.type.value,u=L.size(a),l=[{type:12,data:u},...pe(e[0].dims,i,a)],c=h=>`
  ${h.registerUniform("output_size","u32").declareVariables(r,n,s)}
  ${ed}
  ${td(o)}
  ${rd(t)}
  ${id(t)}
  ${nd(r,o,t)}

  ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
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
      var grid_indices = vec3<u32>(indices[${dt}], indices[${At}], indices[${Ot}]);
      let nxy = ${n.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${ad(s,o,t)}
  }`;return{name:"GridSample",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:["type","type"]},getRunData:h=>{let m=L.size(a);return{outputs:[{dims:a,dataType:h[0].dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:l}},getShaderSource:c}},mf=(e,t)=>{Jl(e.inputs),e.compute(sd(e.inputs,t))},gf=e=>Ce({alignCorners:e.align_corners,mode:e.mode,paddingMode:e.padding_mode,format:e.format})}),He,od,yf,Sn,ud,Sr,wf,_f=te(()=>{"use strict";me(),ge(),Re(),Ta(),za(),ye(),Ct(),He=(e,t)=>e.length>t&&e[t].dims.length>0?e[t]:void 0,od=(e,t)=>{let r=e[0],i=He(e,1),n=He(e,2),a=He(e,3),s=He(e,4),o=He(e,5),u=He(e,6),l=He(e,7);if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let c=r.dims[0],h=r.dims[1],m=r.dims.length===3?r.dims[2]:t.numHeads*r.dims[4],g=h,f=0,$=0,v=Math.floor(m/t.numHeads);if(u&&l&&L.size(u.dims)&&L.size(l.dims)){if(u.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(u.dims[0]!==c||u.dims[1]!==t.numHeads||u.dims[3]!==v)throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(l.dims[0]!==c||l.dims[1]!==t.numHeads||l.dims[3]!==v)throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(u.dims[2]!==l.dims[2])throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(l.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');f=u.dims[2],$=u.dims[2]}else if(u&&L.size(u.dims)||l&&L.size(l.dims))throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let b;if(i&&L.size(i.dims)>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(i.dims[2]!==r.dims[2])throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');b=2,g=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==v)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(n)throw new Error('Expect "value" be none when "key" has packed kv format.');b=5,g=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==v)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');b=0,g=i.dims[2]}}else{if(r.dims.length!==5)throw new Error('Input "query" is expected to have 5 dimensions when key is empty');if(r.dims[2]!==t.numHeads||r.dims[3]!==3)throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');b=3}if(a&&L.size(a.dims)>0){if(a.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimension');if(i&&i.dims.length===5&&i.dims[3]===2)throw new Error("bias is not allowed for packed kv.")}let w=f+g,k=0;if(s&&L.size(s.dims)>0){k=8;let C=s.dims;throw C.length===1?C[0]===c?k=1:C[0]===3*c+2&&(k=3):C.length===2&&C[0]===c&&C[1]===w&&(k=5),k===8?new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)'):new Error("Mask not supported")}let I=!1,S=m;if(n&&L.size(n.dims)>0){if(n.dims.length!==3&&n.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==n.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(n.dims.length===3){if(g!==n.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');S=n.dims[2]}else{if(g!==n.dims[2])throw new Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');S=n.dims[1]*n.dims[3],I=!0}}let E=!1;if(s&&L.size(s.dims)>0)throw new Error("Key padding mask is not supported");if(o&&L.size(o.dims)>0){if(o.dims.length!==4)throw new Error('Input "attention_bias" is expected to have 4 dimensions');if(o.dims[0]!==c||o.dims[1]!==t.numHeads||o.dims[2]!==h||o.dims[3]!==w)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:c,sequenceLength:h,pastSequenceLength:f,kvSequenceLength:g,totalSequenceLength:w,maxSequenceLength:$,inputHiddenSize:0,hiddenSize:m,vHiddenSize:S,headSize:v,vHeadSize:Math.floor(S/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:k,scale:t.scale,broadcastResPosBias:E,passPastInKv:I,qkvFormat:b}},yf=e=>Ce({...e}),Sn=Ce({perm:[0,2,1,3]}),ud=(e,t,r,i,n,a,s)=>{let o=[i,n,a],u=L.size(o),l=[{type:12,data:u},{type:12,data:s},{type:12,data:a}],c=h=>{let m=ue("qkv_with_bias",t.dataType,o),g=H("qkv",t.dataType,o),f=H("bias",r.dataType,o),$=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${h.registerUniforms($).declareVariables(g,f,m)}
  ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return e.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:o,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:l}),getShaderSource:c},{inputs:[t,r],outputs:[-1]})[0]},Sr=(e,t,r,i,n,a,s,o)=>{let u=a;if(s&&L.size(s.dims)>0){if(i===1)throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return u=ud(e,a,s,t,i,r*n,o),u=u.reshape([t,i,r,n]),r===1||i===1?u:e.compute(Ze(u,Sn.perm),{inputs:[u],outputs:[-1]})[0]}else return a.dims.length===3&&(u=a.reshape([t,i,r,n])),r===1||i===1?u:e.compute(Ze(u,Sn.perm),{inputs:[u],outputs:[-1]})[0]},wf=(e,t)=>{let r=od(e.inputs,t),i=e.inputs[0],n=He(e.inputs,1),a=He(e.inputs,2),s=He(e.inputs,3),o=He(e.inputs,4),u=He(e.inputs,5),l=He(e.inputs,6),c=He(e.inputs,7);if(i.dims.length===5)throw new Error("Packed QKV is not implemented");if(n?.dims.length===5)throw new Error("Packed KV is not implemented");let h=n&&a&&n.dims.length===4&&a.dims.length===4,m=Sr(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,i,s,0);if(h)return zr(e,m,n,a,o,void 0,l,c,u,r);if(!n||!a)throw new Error("key and value must be provided");let g=Sr(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.headSize,n,s,r.hiddenSize),f=Sr(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.vHeadSize,a,s,2*r.hiddenSize);zr(e,m,g,f,o,void 0,l,c,u,r)}}),ld,dd,cd,pd,ua,bf,$f,xf=te(()=>{"use strict";me(),ge(),Re(),ye(),ld=e=>{if(!e||e.length<1)throw new Error("too few inputs")},dd=(e,t)=>{let r=[],i=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(n=>r.push(Number(n))),i=r.length),Ce({numOutputs:i,axis:t.axis,splitSizes:r})},cd=e=>`
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
      }`},ua=(e,t)=>{let r=e[0].dims,i=L.size(r),n=e[0].dataType,a=L.normalizeAxis(t.axis,r.length),s=new Array(t.numOutputs),o=H("input",n,r.length),u=new Array(t.numOutputs),l=[],c=[],h=0,m=[{type:12,data:i}];for(let f=0;f<t.numOutputs;f++){h+=t.splitSizes[f],u[f]=h;let $=r.slice();$[a]=t.splitSizes[f],c.push($),s[f]=ue(`output${f}`,n,$.length),l.push({dims:c[f],dataType:e[0].dataType})}m.push({type:12,data:u},...pe(r,...c));let g=f=>`
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
  }`;return{name:"Split",shaderCache:{hint:t.cacheKey,inputDependencies:["rank"]},getShaderSource:g,getRunData:()=>({outputs:l,dispatchGroup:{x:Math.ceil(i/64)},programUniforms:m})}},bf=(e,t)=>{ld(e.inputs);let r=e.inputs.length===1?t:dd(e.inputs,t);e.compute(ua(e.inputs,r),{inputs:[0]})},$f=e=>{let t=e.axis,r=e.splitSizes,i=e.numOutputs<0?r.length:e.numOutputs;if(i!==r.length)throw new Error("numOutputs and splitSizes length must be equal");return Ce({axis:t,numOutputs:i,splitSizes:r})}}),hd,hi,vf,kf=te(()=>{"use strict";me(),ge(),Re(),ye(),hd=(e,t)=>{let[r,i,n,a]=e,{numHeads:s,rotaryEmbeddingDim:o}=t;if(r.dims.length!==3&&r.dims.length!==4)throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${r.dims.length}`);if(!L.areEqual(i.dims,[])&&!L.areEqual(i.dims,[1])&&i.dims.length!==2)throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${i.dims.length}`);if(n.dims.length!==2)throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${n.dims.length}`);if(a.dims.length!==2)throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${a.dims.length}`);if(!L.areEqual(n.dims,a.dims))throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(o>0&&s===0)throw new Error("num_heads must be provided if rotary_embedding_dim is specified");let u=r.dims[0],l=r.dims[r.dims.length-2],c=n.dims[0],h=L.sizeFromDimension(r.dims,1)/l,m=o===0?n.dims[1]*2:h/s;if(o>m)throw new Error("rotary_embedding_dim must be less than or equal to head_size");if(i.dims.length===2){if(u!==i.dims[0])throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${i.dims[0]}`);if(l!==i.dims[1])throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${i.dims[1]}`)}if(l>c)throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported");if(m/2!==n.dims[1]&&o/2!==n.dims[1])throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${n.dims[1]}`)},hi=(e,t)=>{let{interleaved:r,numHeads:i,rotaryEmbeddingDim:n,scale:a}=t,s=e[0].dims[0],o=L.sizeFromDimension(e[0].dims,1),u=e[0].dims[e[0].dims.length-2],l=o/u,c=e[2].dims[1],h=n===0?c*2:l/i,m=new Array(s,u,l/h,h-c),g=L.computeStrides(m),f=[{type:1,data:a},{type:12,data:m},{type:12,data:g},...e[0].dims.length===3?new Array({type:12,data:[o,l,h,1]}):[],...e[0].dims.length===4?new Array({type:12,data:[o,h,u*h,1]}):[],...pe(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)],$=v=>{let b=H("input",e[0].dataType,e[0].dims.length),w=H("position_ids",e[1].dataType,e[1].dims.length),k=H("cos_cache",e[2].dataType,e[2].dims.length),I=H("sin_cache",e[3].dataType,e[3].dims.length),S=ue("output",e[0].dataType,e[0].dims.length);return v.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:m.length},{name:"global_strides",type:"u32",length:g.length},{name:"input_output_strides",type:"u32",length:g.length}]),`
        ${v.declareVariables(b,w,k,I,S)}

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
                ${b.getByOffset("j")} * ${I.get("position_id","bsnh[3]")};
            ${S.setByOffset("i","re")}
            let im = ${b.getByOffset("i")} * ${I.get("position_id","bsnh[3]")} +
                ${b.getByOffset("j")} * ${k.get("position_id","bsnh[3]")};
            ${S.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${S.setByOffset("k",b.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:Ce({interleaved:r}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:$,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(L.size(m)/sr)},programUniforms:f})}},vf=(e,t)=>{hd(e.inputs,t),e.compute(hi(e.inputs,t))}}),fd,md,In,gd,Sf,By=te(()=>{"use strict";Re(),me(),za(),_f(),xf(),Ct(),kf(),ye(),fd=(e,t)=>{if(t.doRotary&&e.length<=7)throw new Error("cos_cache and sin_cache inputs are required if do_rotary is specified");let r=e[0],i=e[1],n=e[2],a=e[3],s=e[4];if(t.doRotary!==0&&e.length<=7)throw new Error("cos_cast and sin_cache are expected if do_rotary attribute is non-zero");if(t.localWindowSize!==-1)throw new Error("Local attention is not supported");if(t.softcap!==0)throw new Error("Softcap is not supported");if(t.rotaryInterleaved!==0)throw new Error("Rotary interleaved is not supported");if(t.smoothSoftmax)throw new Error("Smooth softmax is not supported");if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let o=!1,u=r.dims[0],l=r.dims[1],c=r.dims.length===3?o?r.dims[2]/3:r.dims[2]:t.numHeads*r.dims[4],h=l,m=0,g=!i||i.dims.length===0,f=Math.floor(g?c/(t.numHeads+2*t.kvNumHeads):c/t.numHeads);g&&(c=f*t.numHeads);let $=a&&a.dims.length!==0,v=s&&s.dims.length!==0;if($&&a.dims.length===4&&a.dims[0]===u&&a.dims[1]!==t.kvNumHeads&&a.dims[2]===t.kvNumHeads&&a.dims[3]===f)throw new Error("BSNH pastKey/pastValue is not supported");if($&&v){if(a.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(s.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');m=a.dims[2]}else if($||v)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let b=1;if(i&&i.dims.length>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(r.dims[2]%i.dims[2]!==0)throw new Error('Dimension 2 of "query" should be a multiple of "key"');h=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==f)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(n)throw new Error('Expect "value" be none when "key" has packed kv format.');h=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==f)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');h=i.dims[2]}}else{if(r.dims.length!==3&&r.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(r.dims.length===5&&(r.dims[2]!==t.numHeads||r.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');b=3}let w=0,k=!1,I=t.kvNumHeads?f*t.kvNumHeads:c;if(n&&n.dims.length>0){if(n.dims.length!==3&&n.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==n.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(n.dims.length===3){if(h!==n.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');I=n.dims[2]}else{if(h!==n.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');I=n.dims[1]*n.dims[3],k=!0}}let S=e.length>4?e[5]:void 0;if(S){if(S.dims.length===0)throw new Error("seqlens_k must be at least 1D, got scalar.");let E=S.dims.reduce((C,x)=>C*x,1);if(E!==u)throw new Error(`seqlens_k must have batch_size (${u}) elements, got ${E}.`);for(let C=0;C<S.dims.length;C++)if(S.dims[C]!==1&&S.dims[C]!==u)throw new Error(`seqlens_k has unexpected shape. Each dimension must be 1 or batch_size (${u}), got dims[${C}] = ${S.dims[C]}.`)}return{batchSize:u,sequenceLength:l,pastSequenceLength:m,kvSequenceLength:h,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:c,vHiddenSize:I,headSize:f,vHeadSize:Math.floor(I/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:w,scale:t.scale,broadcastResPosBias:!1,passPastInKv:k,qkvFormat:b}},md=Ce({perm:[0,2,1,3]}),In=(e,t,r)=>{let i=t,n=r.kvNumHeads;return t.dims.length===3&&r.kvSequenceLength!==0&&(i=t.reshape([r.batchSize,r.kvSequenceLength,n,r.headSize]),i=e.compute(Ze(i,md.perm),{inputs:[i],outputs:[-1]})[0]),i},gd=(e,t,r,i)=>{let n=7,a=["type","type"],s=[e*t],o=e*t,u=[{type:12,data:o},{type:12,data:t},{type:12,data:e}],l=c=>{let h=H("seq_lens",r.dataType,r.dims),m=H("total_seq_lens",i.dataType,i.dims),g=ue("pos_ids",n,s),f=[{name:"output_size",type:"u32"},{name:"sequence_length",type:"u32"},{name:"batch_size",type:"u32"}];return`
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
  `};return{name:"GeneratePositionIds",shaderCache:{hint:`${e};${t}`,inputDependencies:a},getRunData:()=>({outputs:[{dims:s,dataType:n}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:u}),getShaderSource:l}},Sf=(e,t)=>{if(e.inputs.length>14&&e.inputs[14]||e.inputs.length>15&&e.inputs[15])throw new Error("GroupQueryAttention (JSEP): q_norm_weight / k_norm_weight inputs are not supported. The per-head Q/K RMS normalization prologue is implemented only on the CUDA and native WebGPU EPs.");let r=fd(e.inputs,t);if(e.inputs[0].dims.length===5)throw new Error("Packed QKV is not implemented");if(e.inputs[1]?.dims.length===5)throw new Error("Packed KV is not implemented");let i=e.inputs[0],n=e.inputs[1]&&e.inputs[1].dims.length>0?e.inputs[1]:void 0,a=e.inputs[2]&&e.inputs[2].dims.length>0?e.inputs[2]:void 0,s=e.inputs[3]&&e.inputs[3].dims.length!==0?e.inputs[3]:void 0,o=e.inputs[4]&&e.inputs[4].dims.length!==0?e.inputs[4]:void 0,u=e.inputs.length>4?e.inputs[5]:void 0,l=e.inputs.length>5?e.inputs[6]:void 0,c=r.kvNumHeads?r.kvNumHeads:r.numHeads,h=Ce({axis:2,numOutputs:3,splitSizes:[r.numHeads*r.headSize,c*r.headSize,c*r.headSize]}),[m,g,f]=!n&&!a?e.compute(ua([i],h),{inputs:[i],outputs:[-1,-1,-1]}):[i,n,a],$,v;if(t.doRotary){let I=e.compute(gd(r.batchSize,r.sequenceLength,u,l),{inputs:[u,l],outputs:[-1]})[0],S=e.inputs[7],E=e.inputs[8],C=Ce({interleaved:t.rotaryInterleaved!==0,numHeads:r.numHeads,rotaryEmbeddingDim:0,scale:t.scale}),x=[m,I,S,E],M=[-1];$=e.compute(hi(x,C),{inputs:x,outputs:M})[0],x.splice(0,1,g);let N=Ce({interleaved:t.rotaryInterleaved!==0,numHeads:r.kvNumHeads,rotaryEmbeddingDim:0,scale:t.scale});v=e.compute(hi(x,N),{inputs:x,outputs:M})[0]}let b=Sr(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,t.doRotary?$:m,void 0,0),w=In(e,t.doRotary?v:g,r),k=In(e,f,r);zr(e,b,w,k,void 0,void 0,s,o,void 0,r,u,l)}}),Tn,yd,wd,If,Ry=te(()=>{"use strict";me(),ge(),Ct(),ye(),Tn=(e,t,r,i,n,a,s,o)=>{let u=Be(a),l=u===1?"f32":`vec${u}f`,c=u===1?"vec2f":`mat2x${u}f`,h=n*s,m=64;h===1&&(m=256);let g=[n,s,a/u],f=[n,s,2],$=["rank","type","type"],v=[];v.push(...pe(g,f));let b=w=>{let k=H("x",t.dataType,3,u),I=H("scale",r.dataType,r.dims),S=H("bias",i.dataType,i.dims),E=ue("output",1,3,2),C=[k,I,S,E];return`
  var<workgroup> workgroup_shared : array<${c}, ${m}>;
  const workgroup_size = ${m}u;
  ${w.declareVariables(...C)}
  ${w.mainStart(m)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${l}(0);
    var squared_sum = ${l}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${l}(${k.get("batch","channel","h")});
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
      let sum_final = ${Tt("workgroup_shared[0][0]",u)} / f32(hight * ${u});
      let squared_sum_final = ${Tt("workgroup_shared[0][1]",u)} / f32(hight * ${u});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${o}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`};return e.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${u};${o};${m}`,inputDependencies:$},getRunData:()=>({outputs:[{dims:f,dataType:1}],dispatchGroup:{x:h},programUniforms:v}),getShaderSource:b},{inputs:[t,r,i],outputs:[-1]})[0]},yd=(e,t,r)=>{let i=t[0].dims,n=i,a=2,s=i[0],o=i[1],u=L.sizeFromDimension(i,a),l=Be(u),c=L.size(n)/l,h=Tn(e,t[0],t[1],t[2],s,u,o,r.epsilon),m=[s,o,u/l],g=[s,o],f=["type","none"],$=v=>{let b=H("x",t[0].dataType,m.length,l),w=H("scale_shift",1,g.length,2),k=ue("output",t[0].dataType,m.length,l),I=[b,w,k];return`
  ${v.registerUniform("output_size","u32").declareVariables(...I)}
  ${v.mainStart()}
  ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${k.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${w.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${b.getByOffset("global_idx")} * ${k.type.value}(scale_shift.x) + ${k.type.value}(scale_shift.y);
      ${k.setByOffset("global_idx","value")};
  }`};e.compute({name:"InstanceNormalization",shaderCache:{hint:`${l}`,inputDependencies:f},getRunData:()=>({outputs:[{dims:n,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:[{type:12,data:c},...pe(m,g,m)]}),getShaderSource:$},{inputs:[t[0],h]})},wd=(e,t,r)=>{let i=t[0].dims,n=i,a=i[0],s=i[i.length-1],o=L.sizeFromDimension(i,1)/s,u=Be(s),l=L.size(n)/u,c=[{type:12,data:o},{type:12,data:Math.floor(s/u)}],h=["type","type"],m=!1,g=[0,i.length-1];for(let b=0;b<i.length-2;b++)m=m||i[b+1]!==1,g.push(b+1);m=m&&i[i.length-1]!==1;let f=m?e.compute(Ze(e.inputs[0],g),{inputs:[e.inputs[0]],outputs:[-1]})[0]:e.inputs[0].reshape(Array.from({length:i.length},(b,w)=>i[g[w]])),$=Tn(e,f,t[1],t[2],a,o,s,r.epsilon),v=b=>{let w=We(t[0].dataType),k=u===1?"vec2f":`mat${u}x2f`,I=C=>{let x=C===0?"x":"y",M=u===1?"f32":`vec${u}f`;switch(u){case 1:return`${w}(${M}(scale.${x}))`;case 2:return`vec2<${w}>(${M}(scale[0].${x}, scale[1].${x}))`;case 4:return`vec4<${w}>(${M}(scale[0].${x}, scale[1].${x}, scale[2].${x}, scale[3].${x}))`;default:throw new Error(`Not supported compoents ${u}`)}},S=H("input",t[0].dataType,t[0].dims,u),E=ue("output",t[0].dataType,n,u);return`
  @group(0) @binding(0) var<storage, read> input : array<${S.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${k}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${E.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${b.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${I(0)}, ${I(1)});
  }`};e.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${u}`,inputDependencies:h},getRunData:()=>({outputs:[{dims:n,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:c}),getShaderSource:v},{inputs:[t[0],$]})},If=(e,t)=>{t.format==="NHWC"?wd(e,e.inputs,t):yd(e,e.inputs,t)}}),_d,bd,Tf,Dy=te(()=>{"use strict";me(),ge(),ye(),_d=e=>{if(!e||e.length<2)throw new Error("layerNorm requires at least 2 inputs.")},bd=(e,t,r)=>{let i=t.simplified,n=e[0].dims,a=e[1],s=!i&&e[2],o=n,u=L.normalizeAxis(t.axis,n.length),l=L.sizeToDimension(n,u),c=L.sizeFromDimension(n,u),h=L.size(a.dims),m=s?L.size(s.dims):0;if(h!==c||s&&m!==c)throw new Error(`Size of X.shape()[axis:] == ${c}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${h} and bias size of ${m}`);let g=[];for(let S=0;S<n.length;++S)S<u?g.push(n[S]):g.push(1);let f=Be(c),$=["type","type"],v=[{type:12,data:l},{type:1,data:c},{type:12,data:Math.floor(c/f)},{type:1,data:t.epsilon}];s&&$.push("type");let b=r>1,w=r>2,k=S=>{let E=We(e[0].dataType),C=[H("x",e[0].dataType,e[0].dims,f),H("scale",a.dataType,a.dims,f)];s&&C.push(H("bias",s.dataType,s.dims,f)),C.push(ue("output",e[0].dataType,o,f)),b&&C.push(ue("mean_data_output",1,g)),w&&C.push(ue("inv_std_output",1,g));let x=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${S.registerUniforms(x).declareVariables(...C)}
  ${S.mainStart()}
    ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${Jn("f32",f)};
    var mean_square_vector = ${Jn("f32",f)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${er(E,f,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${Tt("mean_vector",f)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${Tt("mean_square_vector",f)} / uniforms.norm_size ${i?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${er(E,f,"x[j + offset]")};
      let f32scale = ${er(E,f,"scale[j]")};
      output[j + offset] = ${C[0].type.value}((f32input ${i?"":"- mean"}) * inv_std_dev * f32scale
        ${s?`+ ${er(E,f,"bias[j]")}`:""}
      );
    }

    ${b?"mean_data_output[global_idx] = mean":""};
    ${w?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},I=[{dims:o,dataType:e[0].dataType}];return b&&I.push({dims:g,dataType:1}),w&&I.push({dims:g,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${f};${r};${i}`,inputDependencies:$},getRunData:()=>({outputs:I,dispatchGroup:{x:Math.ceil(l/64)},programUniforms:v}),getShaderSource:k}},Tf=(e,t)=>{_d(e.inputs),e.compute(bd(e.inputs,t,e.outputCount))}}),$d,Cf,Ny=te(()=>{"use strict";ge(),Ra(),Da(),$d=e=>{if(!e||e.length!==2)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.")},Cf=e=>{$d(e.inputs);let t=ar.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw new Error("Can't use matmul on the given tensors");let r=t[t.length-1],i=e.inputs[0].dims[e.inputs[0].dims.length-1];if(r<8&&i<8)e.compute(Ba(e.inputs,{activation:""},t));else{let n=t[t.length-2],a=L.size(e.inputs[0].dims.slice(0,-2)),s=L.size(e.inputs[1].dims.slice(0,-2));if(a!==1&&n===1&&s===1){let o=e.inputs[0].reshape([1,a,i]),u=e.inputs[1].reshape([1,i,r]),l=[1,a,r],c=[o,u];e.compute(pi(c,{activation:""},t,l),{inputs:c})}else e.compute(pi(e.inputs,{activation:""},t))}}}),xd,vd,kd,Ef,zf,Uy=te(()=>{"use strict";me(),ge(),Re(),ye(),xd=(e,t)=>{if(e.length<3||e.length>4)throw new Error("MatMulNBits requires 3 or 4 inputs");let r=e[0],i=r.dims.length;if(r.dims[i-1]!==t.k)throw new Error("The last dim of input shape does not match the k value");let n=Math.floor((t.k+t.blockSize-1)/t.blockSize),a=t.blockSize/8*t.bits,s=e[1];if(!L.areEqual(s.dims,[t.n,n,a]))throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let o=e[2].dims;if(L.size(o)!==t.n*n)throw new Error("scales input size error.");if(e.length===4){let u=e[3].dims,l=t.n*(t.bits===8?n:Math.floor((n*t.bits+7)/8));if(L.size(u)!==l)throw new Error("zeroPoints input size error.")}},vd=(e,t)=>{let r=e[0].dims,i=r.length,n=r[i-2],a=t.k,s=t.n,o=r.slice(0,i-2),u=L.size(o),l=e[1].dims[2]/4,c=e[0].dataType,h=Be(t.k),m=Be(l),g=Be(s),f=o.concat([n,s]),$=n>1&&s/g%2===0?2:1,v=L.size(f)/g/$,b=64,w=[],k=[u,n,a/h],I=L.convertShape(e[1].dims).slice();I.splice(-1,1,l/m),w.push(...pe(k)),w.push(...pe(I)),w.push(...pe(e[2].dims)),e.length===4&&w.push(...pe(L.convertShape(e[3].dims)));let S=[u,n,s/g];w.push(...pe(S));let E=C=>{let x=k.length,M=H("a",e[0].dataType,x,h),N=H("b",12,I.length,m),B=H("scales",e[2].dataType,e[2].dims.length),U=[M,N,B],F=e.length===4?H("zero_points",12,e[3].dims.length):void 0;F&&U.push(F);let O=S.length,q=ue("output",e[0].dataType,O,g),j=We(e[0].dataType),P=(()=>{switch(h){case 1:return`array<${j}, 8>`;case 2:return`mat4x2<${j}>`;case 4:return`mat2x4<${j}>`;default:throw new Error(`${h}-component is not supported.`)}})(),ie=Math.floor(32/t.bits),ae=Math.floor(ie/8),Q=()=>{let G="";for(let Z=0;Z<ae;Z++){let ce=Z*t.bits*4,we=ce+t.bits;G+=`
          // reuse a data (pass ${Z})
            var input_offset${Z>0?Z:""} = ${Z===0?M.indicesToOffset(`${M.type.indices}(batch, row, word_offset)`):"input_offset"};
            var a_data${Z>0?Z:""}: ${P};
            for (var j${Z>0?Z:""}: u32 = 0; j${Z>0?Z:""} < ${8/h}; j${Z>0?Z:""}++) {
              a_data${Z>0?Z:""}[j${Z>0?Z:""}] = ${M.getByOffset(`input_offset${Z>0?Z:""}`)};
              input_offset${Z>0?Z:""}++;
            }
          `;for(let Y=0;Y<g*$;Y++)G+=`
            b_value = ${m===1?`b${Y}_data`:`b${Y}_data[i]`};
            ${t.bits===2?`{
              let half_word = b_value >> ${Z*16}u;
              let byte_lo = half_word & 0xFFu;
              let byte_hi = (half_word >> 8u) & 0xFFu;
              let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
              b_value_lower = unpack4xU8(spread_word & b_mask);
              b_value_upper = unpack4xU8((spread_word >> 2u) & b_mask);
            }`:`b_value_lower = unpack4xU8((b_value >> ${ce}u) & b_mask);
            b_value_upper = unpack4xU8((b_value >> ${we}u) & b_mask);`}
            b_quantized_values = ${P}(${Array.from({length:4},(J,re)=>`${j}(b_value_lower[${re}]), ${j}(b_value_upper[${re}])`).join(", ")});
            b_dequantized_values = ${h===1?`${P}(${Array.from({length:8},(J,re)=>`(b_quantized_values[${re}] - ${F?`zero_point${Y}`:"zero_point"}) * scale${Y}`).join(", ")});`:`(b_quantized_values - ${P}(${Array(8).fill(`${F?`zero_point${Y}`:"zero_point"}`).join(",")})) * scale${Y};`};
            workgroup_shared[local_id.x * ${$} + ${Math.floor(Y/g)}]${g>1?`[${Y%g}]`:""} += ${Array.from({length:8/h},(J,re)=>`${h===1?`a_data${Z>0?Z:""}[${re}] * b_dequantized_values[${re}]`:`dot(a_data${Z>0?Z:""}[${re}], b_dequantized_values[${re}])`}`).join(" + ")};
          `}return G},A=()=>{let G=`
            var col_index = col * ${g};
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
            let zero_point = ${j}(${Math.pow(2,t.bits-1).toFixed(1)});`}
            `;for(let Z=0;Z<g*$;Z++)G+=`
            let scale${Z} = ${B.getByOffset("col_index * nBlocksPerCol + block")};
            ${F?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            zero_point_word = ${F.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${Z} = ${j}((zero_point_word) & ${t.bits===2?"0x3u":"0xFu"});`:""}
            col_index += 1;`;return G},W=()=>{let G=`col_index = col * ${g};`;for(let Z=0;Z<g*$;Z++)G+=`
            let b${Z}_data = ${N.getByIndices(`${N.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return G+=`
            var b_value: u32;
            let b_mask: u32 = ${t.bits===2?"0x03030303u":"0x0F0F0F0Fu"};
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${P};
            var b_dequantized_values: ${P};`,G};return`
        var<workgroup> workgroup_shared: array<${q.type.value}, ${$*b}>;
        ${C.declareVariables(...U,q)}
        ${C.mainStart([b,1,1])}
          let output_indices = ${q.offsetToIndices(`(global_idx / ${b}) * ${$}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${b}) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize/h};
            ${A()}
            for (var word: u32 = 0; word < ${l}; word += ${m}) {
              ${W()}
              for (var i: u32 = 0; i < ${m}; i++) {
                ${Q()}
                word_offset += ${ie/h};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${$}) {
            var output_value: ${q.type.value} = ${q.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${b}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${$};
            }
            ${q.setByIndices(`${q.type.indices}(batch, row, col + local_id.x)`,"output_value")};
          }
        }`};return{name:"MatMulNBits",shaderCache:{hint:`${t.blockSize};${t.bits};${h};${m};${g};${$};${b}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:f,dataType:c}],dispatchGroup:{x:v},programUniforms:w}),getShaderSource:E}},kd=(e,t)=>{let r=e[0].dims,i=r.length,n=r[i-2],a=t.k,s=t.n,o=r.slice(0,i-2),u=L.size(o),l=e[1].dims[2]/4,c=e[0].dataType,h=Be(t.k),m=Be(l),g=o.concat([n,s]),f=128,$=s%8===0?8:s%4===0?4:1,v=f/$,b=Math.floor(32/t.bits),w=v*m*b,k=w/h,I=w/t.blockSize,S=L.size(g)/$,E=[],C=[u,n,a/h],x=L.convertShape(e[1].dims).slice();x.splice(-1,1,l/m),E.push(...pe(C)),E.push(...pe(x)),E.push(...pe(e[2].dims)),e.length===4&&E.push(...pe(L.convertShape(e[3].dims)));let M=[u,n,s];E.push(...pe(M));let N=B=>{let U=C.length,F=H("a",e[0].dataType,U,h),O=H("b",12,x.length,m),q=H("scales",e[2].dataType,e[2].dims.length),j=[F,O,q],P=e.length===4?H("zero_points",12,e[3].dims.length):void 0;P&&j.push(P);let ie=M.length,ae=ue("output",e[0].dataType,ie),Q=We(e[0].dataType),A=()=>{switch(h){case 1:return`
          let a_data0 = vec4<${Q}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${Q}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${Q}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${Q}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw new Error(`${h}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${F.type.value}, ${k}>;
        var<workgroup> inter_results: array<array<${ae.type.value}, ${v}>, ${$}>;
        ${B.declareVariables(...j,ae)}
        ${B.mainStart([v,$,1])}
          let output_indices = ${ae.offsetToIndices(`workgroup_index * ${$}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${I} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${k};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${k}; a_offset += ${f})
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
            ${P?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (n_blocks_per_col + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            let zero_point_word = ${P.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${Q}((zero_point_word) & ${t.bits===2?"0x3u":"0xFu"});`:`
            // The default zero point is ${Math.pow(2,t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${Q}(${Math.pow(2,t.bits-1).toFixed(1)});`}
            let scale = ${q.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${O.getByIndices(`${O.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize/h};
            for (var i: u32 = 0; i < ${m}; i++) {
              let b_value = ${m===1?"b_data":"b_data[i]"};
              ${(()=>{let W=Math.floor(b/8),G="";for(let Z=0;Z<W;Z++){let ce=Z*t.bits*4,we=ce+t.bits;G+=`
              ${A()}
              {${t.bits===2?`
                let half_word = b_value >> ${Z*16}u;
                let byte_lo = half_word & 0xFFu;
                let byte_hi = (half_word >> 8u) & 0xFFu;
                let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
                let b_value_lower = unpack4xU8(spread_word & 0x03030303u);
                let b_value_upper = unpack4xU8((spread_word >> 2u) & 0x03030303u);`:`
                let b_value_lower = unpack4xU8((b_value >> ${ce}u) & 0x0F0F0F0Fu);
                let b_value_upper = unpack4xU8((b_value >> ${we}u) & 0x0F0F0F0Fu);`}
                let b_quantized_values = mat2x4<${Q}>(${Array.from({length:4},(Y,J)=>`${Q}(b_value_lower[${J}]), ${Q}(b_value_upper[${J}])`).join(", ")});
                let b_dequantized_values = (b_quantized_values - mat2x4<${Q}>(${Array(8).fill("zero_point").join(",")})) * scale;
                inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(Y,J)=>`${`dot(a_data${J}, b_dequantized_values[${J}])`}`).join(" + ")};
              }
              word_offset += ${8/h};`}return G})()}
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
        }`};return{name:"BlockwiseMatMulNBits32",shaderCache:{hint:`${t.blockSize};${h};${m};${v};${$}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:g,dataType:c}],dispatchGroup:{x:S},programUniforms:E}),getShaderSource:N}},Ef=(e,t)=>{xd(e.inputs,t),t.blockSize===32&&e.adapterInfo.isVendor("intel")&&e.adapterInfo.isArchitecture("gen-12lp")?e.compute(kd(e.inputs,t)):e.compute(vd(e.inputs,t))},zf=e=>Ce(e)}),Sd,Id,Td,Cd,Ed,zd,Md,Ad,Mf,Py=te(()=>{"use strict";me(),ge(),ye(),Sd=e=>{if(!e||e.length<1)throw new Error("Too few inputs");if(e[0].dataType!==1&&e[0].dataType!==10)throw new Error("Input type must be float or float16.");if(e.length>=2){let t=e[0].dims.length*2===e[1].dims[0];if(e.length===4&&(t=e[3].dims[0]*2===e[1].dims[0]),!t)throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},Id=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
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
      `},Td=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
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
          `},zd=(e,t,r)=>{switch(r.mode){case 0:return Id(e,t,r.pads.length);case 1:return Td(e,t,r.pads.length);case 2:return Cd(e,t,r.pads.length);case 3:return Ed(e,t,r.pads.length);default:throw new Error("Invalid mode")}},Md=(e,t)=>{let r=L.padShape(e[0].dims.slice(),t.pads),i=e[0].dims,n=L.size(r),a=[{type:12,data:n},{type:6,data:t.pads}],s=e.length>=3&&e[2].data;t.mode===0&&a.push({type:s?e[2].dataType:1,data:t.value}),a.push(...pe(e[0].dims,r));let o=["rank"],u=l=>{let c=ue("output",e[0].dataType,r.length),h=H("x",e[0].dataType,i.length),m=h.type.value,g=zd(c,i.length,t),f=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:t.pads.length}];return t.mode===0&&f.push({name:"constant_value",type:s?m:"f32"}),`
            ${l.registerUniforms(f).declareVariables(h,c)}
            ${l.mainStart()}
            ${l.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${c.offsetToIndices("global_idx")};

            var value = ${m}(0);
            ${g}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${t.mode}${s}`,inputDependencies:o},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(L.size(r)/64)},programUniforms:a}),getShaderSource:u}},Ad=(e,t)=>{if(e.length>1){let r=e[1].getBigInt64Array(),i=e.length>=3&&e[2].data?e[2].dataType===10?e[2].getUint16Array()[0]:e[2].getFloat32Array()[0]:0,n=e[0].dims.length,a=new Int32Array(2*n).fill(0);if(e.length>=4){let o=e[3].getBigInt64Array();for(let u=0;u<o.length;u++)a[Number(o[u])]=Number(r[u]),a[Number(o[u])+n]=Number(r[u+o.length])}else r.forEach((o,u)=>a[Number(u)]=Number(o));let s=[];return a.forEach(o=>s.push(o)),{mode:t.mode,value:i,pads:s}}else return t},Mf=(e,t)=>{Sd(e.inputs);let r=Ad(e.inputs,t);e.compute(Md(e.inputs,r),{inputs:[0]})}}),yr,Cn,En,zn,Mn,Od,Bd,An,On,Af,Of,Bn,Bf,Rf,Rn,Df,Nf,Uf,Pf,Ly=te(()=>{"use strict";Ye(),me(),ge(),ye(),yr=e=>{if(Ee.webgpu.validateInputContent&&(!e||e.length!==1))throw new Error("Pool ops requires 1 input.")},Cn=(e,t,r)=>{let i=t.format==="NHWC",n=e.dims.slice();i&&n.splice(1,0,n.pop());let a=Object.hasOwnProperty.call(t,"dilations"),s=t.kernelShape.slice(),o=t.strides.slice(),u=a?t.dilations.slice():[],l=t.pads.slice();di.adjustPoolAttributes(r,n,s,o,u,l);let c=di.computePoolOutputShape(r,n,o,u,s,l,t.autoPad,t.ceilMode),h=Object.assign({},t);a?Object.assign(h,{kernelShape:s,strides:o,pads:l,dilations:u,cacheKey:t.cacheKey}):Object.assign(h,{kernelShape:s,strides:o,pads:l,cacheKey:t.cacheKey});let m=c.slice();return m.push(m.splice(1,1)[0]),[h,i?m:c]},En=(e,t)=>{let r=t.format==="NHWC",i=L.size(e),n=L.size(t.kernelShape),a=[{type:12,data:i},{type:12,data:n}],s=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(t.kernelShape.length<=2){let o=t.kernelShape[t.kernelShape.length-1],u=t.strides[t.strides.length-1],l=t.pads[t.pads.length/2-1],c=t.pads[t.pads.length-1],h=!!(l+c);a.push({type:12,data:o},{type:12,data:u},{type:12,data:l},{type:12,data:c}),s.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let m=!1;if(t.kernelShape.length===2){let g=t.kernelShape[t.kernelShape.length-2],f=t.strides[t.strides.length-2],$=t.pads[t.pads.length/2-2],v=t.pads[t.pads.length-2];m=!!($+v),a.push({type:12,data:g},{type:12,data:f},{type:12,data:$},{type:12,data:v}),s.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[a,s,!0,h,m]}else{if(r)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let o=L.computeStrides(t.kernelShape);a.push({type:12,data:o},{type:12,data:t.pads},{type:12,data:t.strides}),s.push({name:"kernelStrides",type:"u32",length:o.length},{name:"pads",type:"u32",length:t.pads.length},{name:"strides",type:"u32",length:t.strides.length});let u=t.pads.reduce((l,c)=>l+c);return[a,s,!!u,!1,!1]}},zn=(e,t,r,i,n,a,s,o,u,l,c,h)=>{let m=n.format==="NHWC",g=t.type.value,f=ue("output",t.type.tensor,i);if(n.kernelShape.length<=2){let $="",v="",b="",w=r-(m?2:1);if(c?$=`
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
            }`}else{if(m)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let $=n.kernelShape.length,v=n.pads.length,b="";return l?b=`
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
            }`}},Mn=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,Od=e=>`${Mn(e)};${e.countIncludePad}`,Bd=e=>`${Mn(e)};${e.storageOrder};${e.dilations}`,An=e=>({format:e.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),On=(e,t,r,i)=>{let[n,a]=Cn(t,i,r),s=H("x",t.dataType,t.dims.length),o=s.type.value,u="value += x_val;",l="";n.countIncludePad?l+=`value /= ${o}(uniforms.kernelSize);`:l+=`value /= ${o}(i32(uniforms.kernelSize) - pad);`;let[c,h,m,g,f]=En(a,n);c.push(...pe(t.dims,a));let $=["rank"];return{name:e,shaderCache:{hint:`${i.cacheKey};${m};${g};${f}`,inputDependencies:$},getRunData:()=>({outputs:[{dims:a,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(L.size(a)/64)},programUniforms:c}),getShaderSource:v=>zn(v,s,t.dims.length,a.length,n,u,l,0,h,m,g,f)}},Af=e=>{let t=e.count_include_pad!==0,r=An(e);if(r.ceilMode!==0)throw new Error("ceil_mode output-shape is computed, but ceil_mode kernel execution (padding/divisor) is not yet implemented in the WebGPU AveragePool kernel");let i={countIncludePad:t,...r,cacheKey:""};return{...i,cacheKey:Od(i)}},Of=(e,t)=>{yr(e.inputs),e.compute(On("AveragePool",e.inputs[0],!1,t))},Bn={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},Bf=e=>{let t=e.format;return{format:t,...Bn,cacheKey:t}},Rf=(e,t)=>{yr(e.inputs),e.compute(On("GlobalAveragePool",e.inputs[0],!0,t))},Rn=(e,t,r,i)=>{let[n,a]=Cn(t,i,r),s=`
      value = max(x_val, value);
    `,o="",u=H("x",t.dataType,t.dims.length),l=["rank"],[c,h,m,g,f]=En(a,n);return c.push(...pe(t.dims,a)),{name:e,shaderCache:{hint:`${i.cacheKey};${m};${g};${f}`,inputDependencies:l},getRunData:()=>({outputs:[{dims:a,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(L.size(a)/64)},programUniforms:c}),getShaderSource:$=>zn($,u,t.dims.length,a.length,n,s,o,t.dataType===10?-65504:-1e5,h,m,g,f)}},Df=(e,t)=>{yr(e.inputs),e.compute(Rn("MaxPool",e.inputs[0],!1,t))},Nf=e=>{let t=e.storage_order,r=e.dilations,i=An(e);if(t!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(i.ceilMode!==0)throw new Error("ceil_mode output-shape is computed, but ceil_mode kernel execution (padding) is not yet implemented in the WebGPU MaxPool kernel");let n={storageOrder:t,dilations:r,...i,cacheKey:""};return{...n,cacheKey:Bd(n)}},Uf=e=>{let t=e.format;return{format:t,...Bn,cacheKey:t}},Pf=(e,t)=>{yr(e.inputs),e.compute(Rn("GlobalMaxPool",e.inputs[0],!0,t))}}),Rd,Dd,Lf,Wf,Wy=te(()=>{"use strict";me(),ge(),Re(),ye(),Rd=(e,t)=>{if(e.length<2||e.length>3)throw new Error("DequantizeLinear requires 2 or 3 inputs.");if(e.length===3&&e[1].dims===e[2].dims)throw new Error("x-scale and x-zero-point must have the same shape.");if(e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==0&&e[1].dims.length!==1&&e[1].dims.length!==e[0].dims.length)throw new Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");if(e.length>2){if(e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==e[2].dims.length)throw new Error("scale and zero-point inputs must have the same rank.");if(!e[1].dims.map((r,i)=>r===e[2].dims[i]).reduce((r,i)=>r&&i,!0))throw new Error("scale and zero-point inputs must have the same shape.")}if(t.blockSize>0){if(e[1].dims.length===0||e[1].dims.length===1&&e[1].dims[0]===1)throw new Error("blockSize must be set only for block quantization.");if(!e[1].dims.map((n,a)=>a===t.axis||n===e[0].dims[a]).reduce((n,a)=>n&&a,!0))throw new Error("For block qunatization, scale input shape to match the input shape except for the axis");if(e[1].dims.length!==e[0].dims.length)throw new Error("For block qunatization the scale input rank must be the same as the x rank.");let r=e[0].dims[t.axis],i=e[1].dims[t.axis];if(t.blockSize<Math.ceil(r/i)||t.blockSize>Math.ceil(r/(i-1)-1))throw new Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].")}},Dd=(e,t)=>{let r=L.normalizeAxis(t.axis,e[0].dims.length),i=e[0].dataType,n=i===3,a=e[0].dims,s=e[1].dataType,o=L.size(a),u=i===3||i===2,l=u?[Math.ceil(L.size(e[0].dims)/4)]:e[0].dims,c=e[1].dims,h=e.length>2?e[2]:void 0,m=h?u?[Math.ceil(L.size(h.dims)/4)]:h.dims:void 0,g=c.length===0||c.length===1&&c[0]===1,f=g===!1&&c.length===1,$=Be(o),v=g&&(!u||$===4),b=v?$:1,w=v&&!u?$:1,k=H("input",u?12:i,l.length,w),I=H("scale",s,c.length),S=h?H("zero_point",u?12:i,m.length):void 0,E=ue("output",s,a.length,b),C=[k,I];S&&C.push(S);let x=[l,c];h&&x.push(m);let M=[{type:12,data:o/b},{type:12,data:r},{type:12,data:t.blockSize},...pe(...x,a)],N=B=>{let U=[{name:"output_size",type:"u32"},{name:"axis",type:"u32"},{name:"block_size",type:"u32"}];return`
      ${B.registerUniforms(U).declareVariables(...C,E)}
      ${B.mainStart()}
          ${B.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${E.offsetToIndices("global_idx")};

          // Set input x
          ${u?`
            let input = ${k.getByOffset("global_idx / 4")};
            let x_vec = ${n?"unpack4xI8(input)":"unpack4xU8(input)"};
            let x_value = ${b===1?"x_vec[global_idx % 4]":"x_vec"};`:`let x_value = ${k.getByOffset("global_idx")};`};

          // Set scale input
          ${g?`let scale_value= ${I.getByOffset("0")}`:f?`
            let scale_index = ${E.indicesGet("output_indices","uniforms.axis")};
            let scale_value= ${I.getByOffset("scale_index")};`:`
            var scale_indices: ${I.type.indices} = output_indices;
            let index = ${I.indicesGet("scale_indices","uniforms.axis")} / uniforms.block_size;
            ${I.indicesSet("scale_indices","uniforms.axis","index")};
            let scale_value= ${I.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${S?g?u?`
                let zero_point_input = ${S.getByOffset("0")};
                let zero_point_vec =  ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${S.getByOffset("0")}`:f?u?`
                let zero_point_index = ${E.indicesGet("output_indices","uniforms.axis")};
                let zero_point_input = ${S.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${E.indicesGet("output_indices","uniforms.axis")};
                let zero_point_value = ${S.getByOffset("zero_point_index")};`:u?`
                let zero_point_offset = ${I.indicesToOffset("scale_indices")};
                let zero_point_input = ${S.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${S.getByIndices("scale_indices")};`:`let zero_point_value = ${u?n?"i32":"u32":k.type.value}(0);`};
      // Compute and write output
      ${E.setByOffset("global_idx",`${E.type.value}(x_value - zero_point_value) * scale_value`)};
      }`};return{name:"DequantizeLinear",shaderCache:{hint:t.cacheKey,inputDependencies:S?["rank","rank","rank"]:["rank","rank"]},getShaderSource:N,getRunData:()=>({outputs:[{dims:a,dataType:s}],dispatchGroup:{x:Math.ceil(o/b/64),y:1,z:1},programUniforms:M})}},Lf=(e,t)=>{Rd(e.inputs,t),e.compute(Dd(e.inputs,t))},Wf=e=>Ce({axis:e.axis,blockSize:e.blockSize})}),Nd,Ud,qf,qy=te(()=>{"use strict";Ye(),me(),ye(),Nd=(e,t,r)=>{let i=e===t,n=e<t&&r<0,a=e>t&&r>0;if(i||n||a)throw new Error("Range these inputs' contents are invalid.")},Ud=(e,t,r,i)=>{let n=Math.abs(Math.ceil((t-e)/r)),a=[n],s=n,o=[{type:12,data:s},{type:i,data:e},{type:i,data:r},...pe(a)],u=l=>{let c=ue("output",i,a.length),h=c.type.value,m=[{name:"outputSize",type:"u32"},{name:"start",type:h},{name:"delta",type:h}];return`
        ${l.registerUniforms(m).declareVariables(c)}
        ${l.mainStart()}
        ${l.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${h}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${i}`},getShaderSource:u,getRunData:()=>({outputs:[{dims:a,dataType:i}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:o})}},qf=e=>{let t=0,r=0,i=0;e.inputs[0].dataType===6?(t=e.inputs[0].getInt32Array()[0],r=e.inputs[1].getInt32Array()[0],i=e.inputs[2].getInt32Array()[0]):e.inputs[0].dataType===1&&(t=e.inputs[0].getFloat32Array()[0],r=e.inputs[1].getFloat32Array()[0],i=e.inputs[2].getFloat32Array()[0]),Ee.webgpu.validateInputContent&&Nd(t,r,i),e.compute(Ud(t,r,i,e.inputs[0].dataType),{inputs:[]})}}),Pd,Ld,Gf,Vf,Gy=te(()=>{"use strict";me(),ge(),Re(),ye(),Pd=(e,t,r,i)=>{if(e!=="none"&&i!=="i32"&&i!=="u32"&&i!=="f32")throw new Error(`Input ${i} is not supported with reduction ${e}.`);let n=`{
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
                ${n}max(bitcast<f32>(oldValue), (${r}))${a}`;case"min":return i==="i32"||i==="u32"?`atomicMin(&${t}, bitcast<${i}>(${r}));`:`${n}min(bitcast<${i}>(oldValue), (${r}))${a}`;case"mul":return`${n}(bitcast<${i}>(oldValue) * (${r}))${a}`;default:throw new Error(`Reduction ${e} is not supported.`)}},Ld=(e,t)=>{let r=e[0].dims,i=e[1].dims,n=r,a=1,s=Math.ceil(L.sizeToDimension(i,i.length-1)/a),o=i[i.length-1],u=L.sizeFromDimension(r,o),l=[{type:12,data:s},{type:12,data:o},{type:12,data:u},...pe(e[1].dims,e[2].dims,n)],c=h=>{let m=H("indices",e[1].dataType,e[1].dims.length),g=H("updates",e[2].dataType,e[2].dims.length,a),f=t.reduction!=="none"&&t.reduction!==""?fp("output",e[0].dataType,n.length):ue("output",e[0].dataType,n.length,a);return`
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

      }`};return{name:"ScatterND",shaderCache:{hint:`${t.cacheKey}_${t.reduction}`,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:l}),getShaderSource:c}},Gf=e=>Ce({reduction:e.reduction}),Vf=(e,t)=>{e.compute(Ld(e.inputs,t),{inputs:[e.inputs[1],e.inputs[2]],outputs:[]})}}),Wd,qd,Gd,Dn,Vd,Hd,Fd,jd,Kd,Zd,Yd,Qd,Nn,Xd,Jd,ec,tc,rc,Hf,Ff,Vy=te(()=>{"use strict";me(),ge(),Re(),ye(),Wd=(e,t)=>{if(e.every(r=>r>0||(()=>{throw new Error("Resize requires scales input values to be positive")})),e.length>0){if(t.mode==="linear"){if(!(e.length===2||e.length===3||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1||e.length===5&&e[0]===1&&e[1]===1))throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(t.mode==="cubic"&&!(e.length===2||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1))throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},qd=(e,t,r)=>{t.every(n=>n>=0&&n<r||(()=>{throw new Error("Resize requires axes input values to be positive and less than rank")}));let i=new Array(r).fill(1);return t.forEach((n,a)=>i[n]=e[a]),i},Gd=(e,t,r,i,n,a)=>{let[s,o,u]=r>10?[1,2,3]:[-1,e.length>1?1:-1,-1],l=e[0].dims.length;if(s>0&&e.length>s&&e[s].dims.length>0)e[s].getFloat32Array().forEach(c=>a.push(c));else if(t.coordinateTransformMode==="tf_crop_and_resize")throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(o>0&&e.length>o&&e[o].dims.length===1&&e[o].dims[0]>0){if(e[o].getFloat32Array().forEach(c=>i.push(c)),i.length!==0&&i.length!==l&&r>=18&&i.length!==t.axes.length)throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");Wd(i,t),t.axes.length>0&&qd(i,t.axes,l).forEach((c,h)=>i[h]=c)}if(u>0&&e.length>u&&e[u].dims.length===1&&e[u].dims[0]>0&&(e[u].getBigInt64Array().forEach(c=>n.push(Number(c))),n.length!==0&&n.length!==l&&r>=18&&n.length!==t.axes.length))throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(t.axes.length>0){if(i.length!==0&&i.length!==t.axes.length)throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(n.length!==0&&n.length!==t.axes.length)throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if(typeof i<"u"&&typeof n<"u"&&i.length>0&&n.length>l)throw new Error("Resize requires only of scales or sizes to be specified")},Dn=(e,t,r,i)=>`
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
`:"",Xd=(e,t,r,i,n)=>{let[a,s,o,u]=r.length===2?[-1,0,1,-1]:[0,2,3,1],l=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${l} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(row, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",o,`max(0, min(col, ${r[o]} - 1))`)};
      ${Nn(e,u,a,2)}
      return ${e.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${t.type.indices}) -> ${l} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${l} = originalIndices[${s}];
      var col:${l} = originalIndices[${o}];
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
      var x11: ${l} = getInputValue(batch, channel, row1, col1);
      var x12: ${l} = getInputValue(batch, channel, row1, col2);
      var x21: ${l} = getInputValue(batch, channel, row2, col1);
      var x22: ${l} = getInputValue(batch, channel, row2, col2);
      var dx1: ${l} = abs(row - ${l}(row1));
      var dx2: ${l} = abs(${l}(row2) - row);
      var dy1: ${l} = abs(col - ${l}(col1));
      var dy2: ${l} = abs(${l}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`},Jd=(e,t,r,i,n,a,s,o,u,l)=>{let c=r.length===2,h=!0,[m,g]=c?[0,1]:h?[2,3]:[1,2],f=e.type.value,$=v=>{let b=v===m?"row":"col";return`
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
            ${l?`coefs[i + 1] = 0.0;
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
    `},ec=(e,t,r,i,n)=>{let[a,s,o,u,l]=r.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],c=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${c} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(depth, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",o,`max(0, min(height, ${r[o]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(width, ${r[u]} - 1))`)};
      ${Nn(e,l,a,3)}
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
      var channel: u32 = ${r.length>3?`u32(originalIndices[${l}])`:"0"};
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
    }`},tc=(e,t,r,i,n,a)=>{let s=e.dims,o=Fd(a,t.axes,s.length),u=jd(s,i,n,t.axes),l=i.slice();i.length===0&&(l=s.map((w,k)=>w===0?1:u[k]/w),t.keepAspectRatioPolicy!=="stretch"&&(u=Kd(s,l,t)));let c=ue("output",e.dataType,u.length),h=H("input",e.dataType,s.length),m=L.size(u),g=s.length===u.length&&s.every((w,k)=>w===u[k]),f=t.coordinateTransformMode==="tf_crop_and_resize",$=t.extrapolationValue,v=h.type.value,b=w=>`
      ${g?"":`
      ${Vd(t.coordinateTransformMode,v)};
      ${(()=>{switch(t.mode){case"nearest":return`
              ${Qd(h,s)};
              ${Hd(t.nearestMode,r,v)};
              ${Yd(h,c,s,u,l.length,o.length,f)};
              `;case"linear":return`
              ${Zd(c,s,u,l.length,o.length)};
              ${(()=>{if(s.length===2||s.length===4)return`${Xd(h,c,s,f,$)}`;if(s.length===3||s.length===5)return`${ec(h,c,s,f,$)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(s.length===2||s.length===4)return`${Jd(h,c,s,u,l,o,t.cubicCoeffA,f,t.extrapolationValue,t.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
            `;default:throw Error("Invalid resize mode")}})()};
      `}
      ${w.registerUniform("output_size","u32").registerUniform("scales","f32",l.length).registerUniform("roi","f32",o.length).declareVariables(h,c)}
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
      }`;return{name:"Resize",shaderCache:{hint:`${t.cacheKey}|${r}|${l.length>0?t.mode==="cubic"?l:l.length:""}|${n.length>0?n:""}|${o.length>0?o:""}|${g}|${t.mode==="nearest"?s.length:s}`,inputDependencies:["rank"]},getShaderSource:b,getRunData:()=>({outputs:[{dims:u,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:[{type:12,data:m},{type:1,data:l},{type:1,data:o},...pe(s,u)]})}},rc=e=>{let t=e.customDataBuffer;return new Uint32Array(t.buffer,t.byteOffset,1)[0]},Hf=(e,t)=>{let r=[],i=[],n=[],a=rc(e);if(t.antialias!==0)throw Error("Only default value (0) for Antialias attribute is supported");Gd(e.inputs,t,a,r,i,n),e.compute(tc(e.inputs[0],t,a,r,i,n),{inputs:[0]})},Ff=e=>{let t=e.antialias,r=e.axes,i=e.coordinateTransformMode,n=e.cubicCoeffA,a=e.excludeOutside!==0,s=e.extrapolationValue,o=e.keepAspectRatioPolicy,u=e.mode,l=e.nearestMode===""?"simple":e.nearestMode;return Ce({antialias:t,axes:r,coordinateTransformMode:i,cubicCoeffA:n,excludeOutside:a,extrapolationValue:s,keepAspectRatioPolicy:o,mode:u,nearestMode:l})}}),ic,nc,jf,Hy=te(()=>{"use strict";me(),ge(),ye(),ic=e=>{if(!e||e.length<3)throw new Error("layerNorm requires at least 3 inputs.");let t=e[0],r=e[1],i=e[2];if(t.dataType!==r.dataType||t.dataType!==i.dataType)throw new Error("All inputs must have the same data type");if(t.dims.length!==3&&t.dims.length!==2)throw new Error("Input must be 2D or 3D");if(r.dims.length!==3&&r.dims.length!==2)throw new Error("Skip must be 2D or 3D");let n=t.dims[t.dims.length-1],a=t.dims[t.dims.length-2];if(r.dims[r.dims.length-1]!==n)throw new Error("Skip must have the same hidden size as input");if(r.dims[r.dims.length-2]!==a)throw new Error("Skip must have the same sequence length as input");if(i.dims.length!==1)throw new Error("Gamma must be 1D");if(i.dims[i.dims.length-1]!==n)throw new Error("Gamma must have the same hidden size as input");if(e.length>3){let s=e[3];if(s.dims.length!==1)throw new Error("Beta must be 1D");if(s.dims[s.dims.length-1]!==n)throw new Error("Beta must have the same hidden size as input")}if(e.length>4){let s=e[4];if(s.dims.length!==1)throw new Error("Bias must be 1D");if(s.dims[s.dims.length-1]!==n)throw new Error("Bias must have the same hidden size as input")}},nc=(e,t,r,i)=>{let n=t.simplified,a=e[0].dims,s=L.size(a),o=a,u=s,l=a.slice(-1)[0],c=i?a.slice(0,-1).concat(1):[],h=!n&&e.length>3,m=e.length>4,g=i&&r>1,f=i&&r>2,$=r>3,v=64,b=Be(l),w=[{type:12,data:u},{type:12,data:b},{type:12,data:l},{type:1,data:t.epsilon}],k=S=>{let E=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],C=[H("x",e[0].dataType,e[0].dims,b),H("skip",e[1].dataType,e[1].dims,b),H("gamma",e[2].dataType,e[2].dims,b)];h&&C.push(H("beta",e[3].dataType,e[3].dims,b)),m&&C.push(H("bias",e[4].dataType,e[4].dims,b)),C.push(ue("output",e[0].dataType,o,b)),g&&C.push(ue("mean_output",1,c)),f&&C.push(ue("inv_std_output",1,c)),$&&C.push(ue("input_skip_bias_sum",e[0].dataType,o,b));let x=We(e[0].dataType),M=We(1,b);return`

      ${S.registerUniforms(E).declareVariables(...C)}
      var<workgroup> sum_shared : array<${M}, ${v}>;
      var<workgroup> sum_squared_shared : array<${M}, ${v}>;

      ${S.mainStart([v,1,1])}
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
        let mean = ${Tt("sum",b)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${Tt("square_sum",b)} / f32(uniforms.hidden_size) ${n?"":"- mean * mean"} + uniforms.epsilon);
        ${g?"mean_output[global_idx] = mean;":""}
        ${f?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${n?"":`- ${x}(mean)`}) *
            ${x}(inv_std_dev) * gamma[offset1d + i]
            ${h?"+ beta[offset1d + i]":""};
        }
      }`},I=[{dims:o,dataType:e[0].dataType}];return r>1&&I.push({dims:c,dataType:1}),r>2&&I.push({dims:c,dataType:1}),r>3&&I.push({dims:a,dataType:e[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${b};${g};${f};${$}`,inputDependencies:e.map((S,E)=>"type")},getShaderSource:k,getRunData:()=>({outputs:I,dispatchGroup:{x:Math.ceil(u/l)},programUniforms:w})}},jf=(e,t)=>{ic(e.inputs);let r=[0];e.outputCount>1&&r.push(-3),e.outputCount>2&&r.push(-3),e.outputCount>3&&r.push(3),e.compute(nc(e.inputs,t,e.outputCount,!1),{outputs:r})}}),ac,wr,sc,Un,oc,uc,Kf,Zf,Fy=te(()=>{"use strict";me(),ge(),Re(),ye(),ac=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");if(t.axes.length!==0){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw new Error("axes, starts and ends must have the same length")}else if(t.starts.length!==t.ends.length)throw new Error("starts and ends must have the same length");e.slice(1).forEach((r,i)=>{if(e[i+1].dataType!==6&&e[i+1].dataType!==7)throw new Error(`Input ${i} must be an array of int32 or int64`)})},wr=(e,t)=>{let r=[];if(e.length>t)if(e[t].dataType===7)e[t].getBigInt64Array().forEach(i=>r.push(Number(i)));else if(e[t].dataType===6)e[t].getInt32Array().forEach(i=>r.push(Number(i)));else throw new Error(`Input ${t} must be an array of int32 or int64`);return r},sc=(e,t)=>{if(e.length>1){let r=wr(e,1),i=wr(e,2),n=wr(e,3);return n.length===0&&(n=[...Array(e[0].dims.length).keys()]),Ce({starts:r,ends:i,axes:n})}else return t},Un=(e,t,r,i,n)=>{let a=e;return e<0&&(a+=r[i[t]]),n[t]<0?Math.max(0,Math.min(a,r[i[t]]-1)):Math.max(0,Math.min(a,r[i[t]]))},oc=(e,t,r)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
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
      }`,uc=(e,t)=>{let r=e[0].dims,i=L.size(r),n=t.axes.length>0?L.normalizeAxes(t.axes,r.length):[...Array(r.length).keys()],a=wr(e,4);a.forEach(b=>b!==0||(()=>{throw new Error("step cannot be 0")})),a.length===0&&(a=Array(n.length).fill(1));let s=t.starts.map((b,w)=>Un(b,w,r,n,a)),o=t.ends.map((b,w)=>Un(b,w,r,n,a));if(n.length!==s.length||n.length!==o.length)throw new Error("start, ends and axes should have the same number of elements");if(n.length!==r.length)for(let b=0;b<r.length;++b)n.includes(b)||(s.splice(b,0,0),o.splice(b,0,r[b]),a.splice(b,0,1));let u=a.map(b=>Math.sign(b));a.forEach((b,w,k)=>{if(b<0){let I=(o[w]-s[w])/b,S=s[w],E=S+I*a[w];s[w]=E,o[w]=S,k[w]=-b}});let l=r.slice(0);n.forEach((b,w)=>{l[b]=Math.ceil((o[b]-s[b])/a[b])});let c={dims:l,dataType:e[0].dataType},h=ue("output",e[0].dataType,l.length),m=H("input",e[0].dataType,e[0].dims.length),g=L.size(l),f=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:s.length},{name:"signs",type:"i32",length:u.length},{name:"steps",type:"u32",length:a.length}],$=[{type:12,data:g},{type:12,data:s},{type:6,data:u},{type:12,data:a},...pe(e[0].dims,l)],v=b=>`
      ${b.registerUniforms(f).declareVariables(m,h)}
        ${oc(m,h,r)}
        ${b.mainStart()}
          ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${h.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${h.setByOffset("global_idx",m.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${u.length}_${s.length}_${a.length}`,inputDependencies:["rank"]},getShaderSource:v,getRunData:()=>({outputs:[c],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:$})}},Kf=(e,t)=>{ac(e.inputs,t);let r=sc(e.inputs,t);e.compute(uc(e.inputs,r),{inputs:[0]})},Zf=e=>{let t=e.starts,r=e.ends,i=e.axes;return Ce({starts:t,ends:r,axes:i})}}),lc,dc,Yf,Qf,jy=te(()=>{"use strict";me(),ge(),Re(),Ct(),ye(),lc=e=>{if(!e||e.length!==1)throw new Error("Softmax op requires 1 input.")},dc=(e,t)=>{let r=e.inputs[0],i=r.dims,n=L.size(i),a=i.length,s=L.normalizeAxis(t.axis,a),o=s<i.length-1,u,l=[];o?(l=Array.from({length:a},(C,x)=>x),l[s]=a-1,l[a-1]=s,u=e.compute(Ze(r,l),{inputs:[r],outputs:[-1]})[0]):u=r;let c=u.dims,h=c[a-1],m=n/h,g=Be(h),f=h/g,$=64;m===1&&($=256);let v=(C,x)=>x===4?`max(max(${C}.x, ${C}.y), max(${C}.z, ${C}.w))`:x===2?`max(${C}.x, ${C}.y)`:x===3?`max(max(${C}.x, ${C}.y), ${C}.z)`:C,b=H("x",u.dataType,u.dims,g),w=ue("result",u.dataType,u.dims,g),k=b.type.value,I=We(u.dataType)==="f32"?`var threadMax = ${k}(-3.4028234663852886e+38f);`:`var threadMax = ${k}(-65504.0h);`,S=C=>`
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
          rowSumShared = ${k}(${Tt("threadShared[0]",g)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          var value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          // max operation protects against NaN since all values should be >=0
          value = max(value, ${k}(0.0));
          setValue(row, col, row_stride, value);
        }
      }`,E=e.compute({name:"Softmax",shaderCache:{hint:`${g};${$}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:c,dataType:u.dataType}],dispatchGroup:{x:m},programUniforms:[{type:6,data:f}]}),getShaderSource:S},{inputs:[u],outputs:[o?-1:0]})[0];o&&e.compute(Ze(E,l),{inputs:[E]})},Yf=(e,t)=>{lc(e.inputs),dc(e,t)},Qf=e=>Ce({axis:e.axis})}),Pn,cc,pc,hc,Xf,Ky=te(()=>{"use strict";me(),ge(),ye(),Pn=e=>Array.from(e.getBigInt64Array(),Number),cc=e=>{if(!e||e.length!==2)throw new Error("Tile requires 2 inputs.");if(e[0].dataType!==1&&e[0].dataType!==10&&e[0].dataType!==6&&e[0].dataType!==12)throw new Error("Tile only support float, float16, int32, and uint32 data types");if(e[1].dataType!==7)throw new Error("Tile `repeats` input should be of int64 data type");if(e[1].dims.length!==1)throw new Error("Tile `repeats` input should be 1-D");if(Pn(e[1]).length!==e[0].dims.length)throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},pc=(e,t)=>{let r=[];for(let i=0;i<e.length;++i)r.push(e[i]*t[i]);return r},hc=(e,t)=>{let r=e[0].dims,i=t??Pn(e[1]),n=pc(r,i),a=L.size(n),s=e[0].dataType,o=H("input",s,r.length),u=ue("output",s,n.length),l=c=>`
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
    }`;return{name:"Tile",shaderCache:{hint:`${i}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:[{type:12,data:a},...pe(e[0].dims,n)]}),getShaderSource:l}},Xf=e=>{cc(e.inputs),e.compute(hc(e.inputs),{inputs:[0]})}}),fc,mc,Jf,Zy=te(()=>{"use strict";me(),ge(),ye(),fc=(e,t,r,i,n)=>{let a=ue("output_data",n,r.length,4),s=H("a_data",t[1].dataType,t[1].dims.length,4),o=H("b_data",t[2].dataType,t[2].dims.length,4),u=H("c_data",t[0].dataType,t[0].dims.length,4),l,c=(h,m,g)=>`select(${m}, ${h}, ${g})`;if(!i)l=a.setByOffset("global_idx",c(s.getByOffset("global_idx"),o.getByOffset("global_idx"),u.getByOffset("global_idx")));else{let h=(m,g,f="")=>{let $=`a_data[index_a${g}][component_a${g}]`,v=`b_data[index_b${g}][component_b${g}]`,b=`bool(c_data[index_c${g}] & (0xffu << (component_c${g} * 8)))`;return`
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
          `};n===9?l=`
            var data = vec4<u32>(0);
            ${h("data",0,"u32")}
            ${h("data",1,"u32")}
            ${h("data",2,"u32")}
            ${h("data",3,"u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:l=`
            ${h("output_data[global_idx]",0)}
            ${h("output_data[global_idx]",1)}
            ${h("output_data[global_idx]",2)}
            ${h("output_data[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(u,s,o,a)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${l}
      }`},mc=e=>{let t=e[1].dims,r=e[2].dims,i=e[0].dims,n=e[1].dataType,a=!(L.areEqual(t,r)&&L.areEqual(r,i)),s=t,o=L.size(t);if(a){let l=ar.calcShape(ar.calcShape(t,r,!1),i,!1);if(!l)throw new Error("Can't perform where op on the given tensors");s=l,o=L.size(s)}let u=Math.ceil(o/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:l=>fc(l,e,s,a,n),getRunData:()=>({outputs:[{dims:s,dataType:n}],dispatchGroup:{x:Math.ceil(o/64/4)},programUniforms:[{type:12,data:u},...pe(i,t,r,s)]})}},Jf=e=>{e.compute(mc(e.inputs))}}),em,Yy=te(()=>{"use strict";ly(),za(),dy(),cy(),py(),hy(),fy(),_y(),$y(),xy(),vy(),ky(),Sy(),Iy(),Ty(),Cy(),Ey(),zy(),My(),Ay(),Oy(),By(),Ry(),Dy(),Ny(),Uy(),_f(),Py(),Ly(),Wy(),qy(),Gy(),Ea(),Vy(),kf(),Hy(),Fy(),jy(),xf(),Ky(),Ct(),Ma(),Zy(),em=new Map([["Abs",[Gp]],["Acos",[Vp]],["Acosh",[Hp]],["Add",[Ih]],["ArgMax",[Pp,ta]],["ArgMin",[Up,ta]],["Asin",[Fp]],["Asinh",[jp]],["Atan",[Kp]],["Atanh",[Zp]],["Attention",[Lp]],["AveragePool",[Of,Af]],["BatchNormalization",[Wp]],["BiasAdd",[qp]],["BiasSplitGelu",[Sh]],["Cast",[Qp,Yp]],["Ceil",[Jp]],["Clip",[Xp]],["Concat",[Dh,Nh]],["Conv",[oa,sa]],["ConvTranspose",[jh,Fh]],["Cos",[eh]],["Cosh",[th]],["CumSum",[Kh,Zh]],["DepthToSpace",[Yh,Qh]],["DequantizeLinear",[Lf,Wf]],["DFT",[Xh,Jh]],["Div",[Th]],["Einsum",[ef,tf]],["Elu",[rh,kr]],["Equal",[Ch]],["Erf",[ih]],["Exp",[nh]],["Expand",[rf]],["FastGelu",[nf]],["Floor",[ah]],["FusedConv",[oa,sa]],["Gather",[sf,af]],["GatherElements",[pf,cf]],["GatherBlockQuantized",[lf,df]],["GatherND",[of,uf]],["Gelu",[sh]],["Gemm",[ff,hf]],["GlobalAveragePool",[Rf,Bf]],["GlobalMaxPool",[Pf,Uf]],["Greater",[Ah]],["GreaterOrEqual",[Bh]],["GridSample",[mf,gf]],["GroupQueryAttention",[Sf]],["HardSigmoid",[fh,hh]],["HardSwish",[mh]],["InstanceNormalization",[If]],["LayerNormalization",[Tf]],["LeakyRelu",[oh,kr]],["Less",[Oh]],["LessOrEqual",[Rh]],["Log",[vh]],["MatMul",[Cf]],["MatMulNBits",[Ef,zf]],["MaxPool",[Df,Nf]],["Mul",[Eh]],["MultiHeadAttention",[wf,yf]],["Neg",[lh]],["Not",[uh]],["Pad",[Mf]],["Pow",[zh]],["QuickGelu",[kh,kr]],["Range",[qf]],["Reciprocal",[dh]],["ReduceMin",[Op]],["ReduceMean",[Cp]],["ReduceMax",[Ap]],["ReduceSum",[Rp]],["ReduceProd",[Bp]],["ReduceL1",[Ep]],["ReduceL2",[zp]],["ReduceLogSum",[Np]],["ReduceLogSumExp",[Mp]],["ReduceSumSquare",[Dp]],["Relu",[ch]],["Resize",[Hf,Ff]],["RotaryEmbedding",[vf]],["ScatterND",[Vf,Gf]],["Sigmoid",[ph]],["Sin",[gh]],["Sinh",[yh]],["Slice",[Kf,Zf]],["SkipLayerNormalization",[jf]],["Split",[bf,$f]],["Sqrt",[wh]],["Softmax",[Yf,Qf]],["Sub",[Mh]],["Tan",[_h]],["Tanh",[bh]],["ThresholdedRelu",[xh,kr]],["Tile",[Xf]],["Transpose",[gp,yp]],["Where",[Jf]]])}),tm,Qy=te(()=>{"use strict";Ye(),_t(),ye(),tm=class{constructor(e){this.backend=e,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,r,i,n){Je(e.programInfo.name);let a=this.backend.device,s=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let o=[];for(let l of t)o.push({binding:o.length,resource:{buffer:l.buffer}});for(let l of r)o.push({binding:o.length,resource:{buffer:l.buffer}});n&&o.push({binding:o.length,resource:n});let u=a.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:o,label:e.programInfo.name});if(this.backend.sessionStatus==="capturing"){let l={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:u,dispatchGroup:i};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(l)}s.setPipeline(e.computePipeline),s.setBindGroup(0,u),s.dispatchWorkgroups(...i),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType==="at-passes")&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),Ke(e.programInfo.name)}dispose(){}build(e,t){Je(e.name);let r=this.backend.device,i=[];[{feature:"shader-f16",extension:"f16"},{feature:"subgroups",extension:"subgroups"}].forEach(l=>{r.features.has(l.feature)&&i.push(`enable ${l.extension};`)});let n=mp(t,this.backend.device.limits),a=e.getShaderSource(n),s=`${i.join(`
`)}
${n.additionalImplementations}
${a}`,o=r.createShaderModule({code:s,label:e.name});ke("verbose",()=>`[WebGPU] ${e.name} shader code: ${s}`);let u=r.createComputePipeline({compute:{module:o,entryPoint:"main"},layout:"auto",label:e.name});return Ke(e.name),{programInfo:e,computePipeline:u,uniformVariablesInfo:n.variablesInfo}}normalizeDispatchGroupSize(e){let t=typeof e=="number"?e:e.x,r=typeof e=="number"?1:e.y||1,i=typeof e=="number"?1:e.z||1,n=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(t<=n&&r<=n&&i<=n)return[t,r,i];let a=t*r*i,s=Math.ceil(Math.sqrt(a));if(s>n){if(s=Math.ceil(Math.cbrt(a)),s>n)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[s,s,s]}else return[s,s,1]}}}),rm={};or(rm,{WebGpuBackend:()=>im});var gc,yc,wc,im,Xy=te(()=>{"use strict";Ye(),me(),_t(),dp(),oy(),Yy(),Qy(),gc=(e,t)=>{if(t.length!==e.length)throw new Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let r=[];for(let i=0;i<e.length;++i){let n=e[i].dataType;switch(t[i]){case"none":{r.push("");break}case"type":{r.push(`${n}`);break}case"rank":{let a=e[i].dims.length;r.push(`${n};${a}`);break}case"dims":{let a=e[i].dims.join(",");r.push(`${n};${a}`);break}default:throw new Error(`unsupported input dependency: ${t[i]}`)}}return r.join("|")},yc=(e,t,r)=>{let i=e.name;return e.shaderCache?.hint&&(i+="["+e.shaderCache.hint+"]"),i+=":"+r+`:${gc(t,e.shaderCache?.inputDependencies??new Array(t.length).fill("dims"))}`,i},wc=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},im=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus="default",this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,t){this.env=e;let r=[],i={requiredLimits:{maxComputeWorkgroupStorageSize:t.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:t.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:t.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.limits.maxComputeWorkgroupSizeZ},requiredFeatures:r},n=o=>t.features.has(o)&&r.push(o)&&!0;n("chromium-experimental-timestamp-query-inside-passes")||n("timestamp-query"),n("shader-f16"),n("subgroups"),this.device=await t.requestDevice(i);let a=t,s=t.info??(typeof a.requestAdapterInfo=="function"?await a.requestAdapterInfo():void 0);this.adapterInfo=new wc(s),this.gpuDataManager=hp(this),this.programManager=new tm(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,Sa(e.logLevel,!!e.debug),this.device.onuncapturederror=o=>{o.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${o.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!0}),Object.defineProperty(this.env.webgpu,"adapter",{value:t,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){typeof this.querySet<"u"&&this.querySet.destroy(),this.gpuDataManager.dispose(),this.device&&this.env?.webgpu&&this.device.lost.then(()=>{delete this.env.webgpu.device})}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),t={};this.queryType==="at-passes"&&(t.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=e.beginComputePass(t)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){if(!this.commandEncoder)return;Je(),this.endComputePass();let e;this.queryType!=="none"&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),e=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!=="none"&&e.mapAsync(GPUMapMode.READ).then(()=>{let t=new BigUint64Array(e.getMappedRange()),r=this.pendingQueries.get(e);for(let i=0;i<t.length/2;i++){let n=r[i],a=n.kernelId,s=this.kernels.get(a),o=s.kernelType,u=s.kernelName,l=n.programName,c=n.inputTensorViews,h=n.outputTensorViews,m=t[i*2],g=t[i*2+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=m);let f=Number(m-this.queryTimeBase),$=Number(g-this.queryTimeBase);if(!Number.isSafeInteger(f)||!Number.isSafeInteger($))throw new RangeError("incorrect timestamp range");if(this.env.webgpu.profiling?.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:c.map(v=>({dims:v.dims,dataType:wt(v.dataType)})),outputsMetadata:h.map(v=>({dims:v.dims,dataType:wt(v.dataType)})),kernelId:a,kernelType:o,kernelName:u,programName:l,startTime:f,endTime:$});else{let v="";c.forEach((w,k)=>{v+=`input[${k}]: [${w.dims}] | ${wt(w.dataType)}, `});let b="";h.forEach((w,k)=>{b+=`output[${k}]: [${w.dims}] | ${wt(w.dataType)}, `}),console.log(`[profiling] kernel "${a}|${o}|${u}|${l}" ${v}${b}start time: ${f} ns, execution time: ${$-f} ns`)}oi("GPU",`${l}::${m}::${g}`)}e.unmap(),this.pendingQueries.delete(e)}),Ke()}run(e,t,r,i,n,a){Je(e.name);let s=[];for(let w=0;w<t.length;++w){let k=t[w].data;if(k===0)continue;let I=this.gpuDataManager.get(k);if(!I)throw new Error(`no GPU data for input: ${k}`);s.push(I)}let{outputs:o,dispatchGroup:u,programUniforms:l}=e.getRunData(t),c=r.length===0?o.map((w,k)=>k):r;if(c.length!==o.length)throw new Error(`Output size ${c.length} must be equal to ${o.length}.`);let h=[],m=[];for(let w=0;w<o.length;++w){if(!Number.isInteger(c[w])||c[w]<-3||c[w]>=a)throw new Error(`Invalid output index: ${c[w]}`);if(c[w]===-3)continue;let k=c[w]===-1,I=c[w]===-2,S=k||I?n(o[w].dataType,o[w].dims):i(c[w],o[w].dataType,o[w].dims);if(h.push(S),S.data===0)continue;let E=this.gpuDataManager.get(S.data);if(!E)throw new Error(`no GPU data for output: ${S.data}`);if(k&&this.temporaryData.push(E),I){let C=this.kernelPersistentData.get(this.currentKernelId);C||(C=[],this.kernelPersistentData.set(this.currentKernelId,C)),C.push(E)}m.push(E)}if(s.length!==t.length||m.length!==h.length){if(m.length===0)return Ke(e.name),h;throw new Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let g;if(l){let w=0,k=[];l.forEach(C=>{let x=typeof C.data=="number"?[C.data]:C.data;if(x.length===0)return;let M=C.type===10?2:4,N,B;C.type===10?(B=x.length>4?16:x.length>2?8:x.length*M,N=x.length>4?16:M*x.length):(B=x.length<=2?x.length*M:16,N=16),w=Math.ceil(w/B)*B,k.push(w);let U=C.type===10?8:4;w+=x.length>4?Math.ceil(x.length/U)*N:x.length*M});let I=16;w=Math.ceil(w/I)*I;let S=new ArrayBuffer(w);l.forEach((C,x)=>{let M=k[x],N=typeof C.data=="number"?[C.data]:C.data;if(C.type===6)new Int32Array(S,M,N.length).set(N);else if(C.type===12)new Uint32Array(S,M,N.length).set(N);else if(C.type===10)new Uint16Array(S,M,N.length).set(N);else if(C.type===1)new Float32Array(S,M,N.length).set(N);else throw new Error(`Unsupported uniform type: ${wt(C.type)}`)});let E=this.gpuDataManager.create(w,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(E.buffer,0,S,0,w),this.gpuDataManager.release(E.id),g={offset:0,size:w,buffer:E.buffer}}let f=this.programManager.normalizeDispatchGroupSize(u),$=f[1]===1&&f[2]===1,v=yc(e,t,$),b=this.programManager.getArtifact(v);if(b||(b=this.programManager.build(e,f),this.programManager.setArtifact(v,b),ke("info",()=>`[artifact] key: ${v}, programName: ${e.name}`)),l&&b.uniformVariablesInfo){if(l.length!==b.uniformVariablesInfo.length)throw new Error(`Uniform variables count mismatch: expect ${b.uniformVariablesInfo.length}, got ${l.length} in program "${b.programInfo.name}".`);for(let w=0;w<l.length;w++){let k=l[w],I=k.type,S=typeof k.data=="number"?1:k.data.length,[E,C]=b.uniformVariablesInfo[w];if(I!==E||S!==C)throw new Error(`Uniform variable ${w} mismatch: expect type ${E} with size ${C}, got type ${I} with size ${S} in program "${b.programInfo.name}".`)}}if(ke("info",()=>`[ProgramManager] run "${e.name}" (key=${v}) with ${f[0]}x${f[1]}x${f[2]}`),this.queryType!=="none"||this.sessionStatus==="capturing"){let w={kernelId:this.currentKernelId,programName:b.programInfo.name,inputTensorViews:t,outputTensorViews:h};this.pendingKernels.push(w),this.sessionStatus==="capturing"&&this.capturedPendingKernels.get(this.currentSessionId).push(w)}return this.programManager.run(b,s,m,f,g),Ke(e.name),h}upload(e,t){this.gpuDataManager.upload(e,t)}memcpy(e,t){this.gpuDataManager.memcpy(e,t)}async download(e,t){await this.gpuDataManager.download(e,t)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,t,r,i){let n=em.get(e);if(!n)throw new Error(`kernel not implemented: ${e}`);let a={kernelType:e,kernelName:i,kernelEntry:n[0],attributes:[n[1],r]};this.kernels.set(t,a)}releaseKernel(e){let t=this.kernelPersistentData.get(e);if(t){for(let r of t)this.gpuDataManager.release(r.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,t,r){let i=this.kernels.get(e);if(!i)throw new Error(`kernel not created: ${e}`);let n=i.kernelType,a=i.kernelName,s=i.kernelEntry,o=i.attributes;if(this.currentKernelId!==null)throw new Error(`kernel "[${n}] ${a}" is not allowed to be called recursively`);this.currentKernelId=e,o[0]&&(o[1]=o[0](o[1]),o[0]=void 0),ke("info",()=>`[WebGPU] Start to run kernel "[${n}] ${a}"...`);let u=this.env.debug;this.temporaryData=[];try{return u&&this.device.pushErrorScope("validation"),s(t,o[1]),0}catch(l){return r.push(Promise.resolve(`[WebGPU] Kernel "[${n}] ${a}" failed. ${l}`)),1}finally{u&&r.push(this.device.popErrorScope().then(l=>l?`GPU validation error for kernel "[${n}] ${a}": ${l.message}`:null));for(let l of this.temporaryData)this.gpuDataManager.release(l.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,t,r,i){let n=this.sessionExternalDataMapping.get(e);n||(n=new Map,this.sessionExternalDataMapping.set(e,n));let a=n.get(t),s=this.gpuDataManager.registerExternalBuffer(r,i,a);return n.set(t,[s,r]),s}unregisterBuffers(e){let t=this.sessionExternalDataMapping.get(e);t&&(t.forEach(r=>this.gpuDataManager.unregisterExternalBuffer(r[0])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let t=this.gpuDataManager.get(e);if(!t)throw new Error(`no GPU data for buffer: ${e}`);return t.buffer}createDownloader(e,t,r){return async()=>{let i=await Xn(this,e,t);return Ia(i.buffer,r)}}writeTimestamp(e){this.queryType==="inside-passes"&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){this.queryType="none",(this.env.webgpu.profiling?.mode==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),this.queryType!=="none"&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){ke("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){ke("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){ke("info","replay"),this.sessionStatus="replaying";let e=this.capturedCommandList.get(this.currentSessionId),t=this.capturedPendingKernels.get(this.currentSessionId),r=e.length;this.pendingKernels=[];for(let i=0;i<r;i++){let n=this.getComputePassEncoder(),a=e[i];this.writeTimestamp(this.pendingDispatchNumber*2),n.setPipeline(a.computePipeline),n.setBindGroup(0,a.bindGroup),n.dispatchWorkgroups(...a.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!=="none"&&this.pendingKernels.push(t[i]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType==="at-passes")&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}}),nm={};or(nm,{init:()=>am});var ei,_c,am,Jy=te(()=>{"use strict";me(),_t(),ge(),sy(),ei=class sm{constructor(t,r,i,n){this.module=t,this.dataType=r,this.data=i,this.dims=n}getFloat32Array(){if(this.dataType!==1)throw new Error("Invalid data type");let t=L.size(this.dims);return t===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,t)}getBigInt64Array(){if(this.dataType!==7)throw new Error("Invalid data type");let t=L.size(this.dims);return t===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,t)}getInt32Array(){if(this.dataType!==6)throw new Error("Invalid data type");let t=L.size(this.dims);return t===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,t)}getUint16Array(){if(this.dataType!==10&&this.dataType!==4)throw new Error("Invalid data type");let t=L.size(this.dims);return t===0?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,t)}reshape(t){if(L.size(t)!==L.size(this.dims))throw new Error("Invalid new shape");return new sm(this.module,this.dataType,this.data,t)}},_c=class{constructor(e,t,r){this.module=e,this.backend=t,this.customDataOffset=0,this.customDataSize=0,this.adapterInfo=t.adapterInfo,this.deviceLimits=t.device.limits;let i=e.PTR_SIZE,n=r/e.PTR_SIZE,a=i===4?"i32":"i64";this.opKernelContext=Number(e.getValue(i*n++,a));let s=Number(e.getValue(i*n++,a));this.outputCount=Number(e.getValue(i*n++,a)),this.customDataOffset=Number(e.getValue(i*n++,"*")),this.customDataSize=Number(e.getValue(i*n++,a));let o=[];for(let u=0;u<s;u++){let l=Number(e.getValue(i*n++,a)),c=Number(e.getValue(i*n++,"*")),h=Number(e.getValue(i*n++,a)),m=[];for(let g=0;g<h;g++)m.push(Number(e.getValue(i*n++,a)));o.push(new ei(e,l,c,m))}this.inputs=o}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(e,t){let r=t?.inputs?.map(s=>typeof s=="number"?this.inputs[s]:s)??this.inputs,i=t?.outputs??[],n=(s,o,u)=>new ei(this.module,o,this.output(s,u),u),a=(s,o)=>{let u=Pt(s,o);if(!u)throw new Error(`Unsupported data type: ${s}`);let l=u>0?this.backend.gpuDataManager.create(u).id:0;return new ei(this.module,s,l,o)};return this.backend.run(e,r,i,n,a,this.outputCount)}output(e,t){let r=this.module.stackSave();try{let i=this.module.PTR_SIZE,n=i===4?"i32":"i64",a=this.module.stackAlloc((1+t.length)*i);this.module.setValue(a,t.length,n);for(let s=0;s<t.length;s++)this.module.setValue(a+i*(s+1),t[s],n);return this.module._JsepOutput(this.opKernelContext,e,a)}catch(i){throw new Error(`Failed to generate kernel's output[${e}] with dims [${t}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${i}`)}finally{this.module.stackRestore(r)}}},am=async(e,t,r,i)=>{let n=t.jsepInit;if(!n)throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if(e==="webgpu"){let a=(Xy(),Er(rm)).WebGpuBackend,s=new a;await s.initialize(r,i),n("webgpu",[s,o=>s.alloc(Number(o)),o=>s.free(o),(o,u,l,c=!1)=>{if(c)ke("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(o)}, dst=${Number(u)}, size=${Number(l)}`),s.memcpy(Number(o),Number(u));else{ke("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(o)}, gpuDataId=${Number(u)}, size=${Number(l)}`);let h=t.HEAPU8.subarray(Number(o>>>0),Number(o>>>0)+Number(l));s.upload(Number(u),h)}},async(o,u,l)=>{ke("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${o}, dataOffset=${u}, size=${l}`),await s.download(Number(o),()=>t.HEAPU8.subarray(Number(u)>>>0,Number(u+l)>>>0))},(o,u,l)=>s.createKernel(o,Number(u),l,t.UTF8ToString(t._JsepGetNodeName(Number(u)))),o=>s.releaseKernel(o),(o,u,l,c)=>{ke("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${l}, kernel=${o}, contextDataOffset=${u}`);let h=new _c(t,s,Number(u));return s.computeKernel(Number(o),h,c)},()=>s.captureBegin(),()=>s.captureEnd(),()=>s.replay()])}else{let a=new pp(r);n("webnn",[a,()=>a.reserveTensorId(),s=>a.releaseTensorId(s),async(s,o,u,l,c)=>a.ensureTensor(s,o,u,l,c),(s,o)=>{a.uploadTensor(s,o)},async(s,o)=>a.downloadTensor(s,o),(s,o)=>a.registerMLContext(s,o),!!r.trace])}}}),bc,Na,Ua,St,$c,Ln,fi,Pa,La,_r,xc,Bt,om,um,Wn,Wa,qa,Ga,lm=te(()=>{"use strict";Ye(),iy(),ny(),me(),Ht(),$a(),ka(),bc=(e,t)=>{ze()._OrtInit(e,t)!==0&&Te("Can't initialize onnxruntime.")},Na=async e=>{bc(e.wasm.numThreads,li(e.logLevel))},Ua=async(e,t)=>{ze().asyncInit?.();let r=e.webgpu.adapter;if(t==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");if(r){if(typeof r.limits!="object"||typeof r.features!="object"||typeof r.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let i=e.webgpu.powerPreference;if(i!==void 0&&i!=="low-power"&&i!=="high-performance")throw new Error(`Invalid powerPreference setting: "${i}"`);let n=e.webgpu.forceFallbackAdapter;if(n!==void 0&&typeof n!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${n}"`);if(r=await navigator.gpu.requestAdapter({powerPreference:i,forceFallbackAdapter:n}),!r)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}}if(t==="webnn"&&(typeof navigator>"u"||!navigator.ml))throw new Error("WebNN is not supported in current environment");{let i=(Jy(),Er(nm)).init;t==="webgpu"&&await i("webgpu",ze(),e,r),t==="webnn"&&await i("webnn",ze(),e)}},St=new Map,$c=e=>{let t=ze(),r=t.stackSave();try{let i=t.PTR_SIZE,n=t.stackAlloc(2*i);t._OrtGetInputOutputCount(e,n,n+i)!==0&&Te("Can't get session input/output count.");let a=i===4?"i32":"i64";return[Number(t.getValue(n,a)),Number(t.getValue(n+i,a))]}finally{t.stackRestore(r)}},Ln=(e,t)=>{let r=ze(),i=r.stackSave(),n=0;try{let a=r.PTR_SIZE,s=r.stackAlloc(2*a);r._OrtGetInputOutputMetadata(e,t,s,s+a)!==0&&Te("Can't get session input/output metadata.");let o=Number(r.getValue(s,"*"));n=Number(r.getValue(s+a,"*"));let u=r.HEAP32[n/4];if(u===0)return[o,0];let l=r.HEAPU32[n/4+1],c=[];for(let h=0;h<l;h++){let m=Number(r.getValue(n+8+h*a,"*"));c.push(m!==0?r.UTF8ToString(m):Number(r.getValue(n+8+(h+l)*a,"*")))}return[o,u,c]}finally{r.stackRestore(i),n!==0&&r._OrtFree(n)}},fi=e=>{let t=ze(),r=t._malloc(e.byteLength);if(r===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,r),[r,e.byteLength]},Pa=async(e,t)=>{let r,i,n=ze();Array.isArray(e)?[r,i]=e:e.buffer===n.HEAPU8.buffer?[r,i]=[e.byteOffset,e.byteLength]:[r,i]=fi(e);let a=0,s=0,o=0,u=[],l=[],c=[];try{if([s,u]=await sp(t),t?.externalData&&n.mountExternalData){let I=[];for(let S of t.externalData){let E=typeof S=="string"?S:S.path,C=typeof S=="string"?S:S.data;I.push(yi(C).then(x=>{n.mountExternalData(E,x)}))}await Promise.all(I)}for(let I of t?.executionProviders??[])if((typeof I=="string"?I:I.name)==="webnn"){if(n.shouldTransferToMLTensor=!1,typeof I!="string"){let S=I,E=S?.context,C=S?.gpuDevice,x=S?.deviceType,M=S?.powerPreference;E?n.currentContext=E:C?n.currentContext=await n.webnnCreateMLContext(C):n.currentContext=await n.webnnCreateMLContext({deviceType:x,powerPreference:M})}else n.currentContext=await n.webnnCreateMLContext();break}a=await n._OrtCreateSession(r,i,s),n.webgpuOnCreateSession?.(a),a===0&&Te("Can't create a session."),n.jsepOnCreateSession?.(),n.currentContext&&(n.webnnRegisterMLContext(a,n.currentContext),n.currentContext=void 0,n.shouldTransferToMLTensor=!0);let[h,m]=$c(a),g=!!t?.enableGraphCapture,f=[],$=[],v=[],b=[],w=[];for(let I=0;I<h;I++){let[S,E,C]=Ln(a,I);S===0&&Te("Can't get an input name."),l.push(S);let x=n.UTF8ToString(S);f.push(x),v.push(E===0?{name:x,isTensor:!1}:{name:x,isTensor:!0,type:wt(E),shape:C})}for(let I=0;I<m;I++){let[S,E,C]=Ln(a,I+h);S===0&&Te("Can't get an output name."),c.push(S);let x=n.UTF8ToString(S);$.push(x),b.push(E===0?{name:x,isTensor:!1}:{name:x,isTensor:!0,type:wt(E),shape:C});{if(g&&t?.preferredOutputLocation===void 0){w.push("gpu-buffer");continue}let M=typeof t?.preferredOutputLocation=="string"?t.preferredOutputLocation:t?.preferredOutputLocation?.[x]??"cpu",N=n.webnnIsGraphOutput;if(M==="cpu"&&N&&N(a,x)){w.push("ml-tensor-cpu-output");continue}if(M!=="cpu"&&M!=="cpu-pinned"&&M!=="gpu-buffer"&&M!=="ml-tensor")throw new Error(`Not supported preferred output location: ${M}.`);if(g&&M!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${M}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);w.push(M)}}let k=null;return w.some(I=>I==="gpu-buffer"||I==="ml-tensor"||I==="ml-tensor-cpu-output")&&(o=n._OrtCreateBinding(a),o===0&&Te("Can't create IO binding."),k={handle:o,outputPreferredLocations:w,outputPreferredLocationsEncoded:w.map(I=>I==="ml-tensor-cpu-output"?"ml-tensor":I).map(I=>Qn(I))}),St.set(a,[a,l,c,k,g,!1]),[a,f,$,v,b]}catch(h){throw l.forEach(m=>n._OrtFree(m)),c.forEach(m=>n._OrtFree(m)),o!==0&&n._OrtReleaseBinding(o)!==0&&Te("Can't release IO binding."),a!==0&&n._OrtReleaseSession(a)!==0&&Te("Can't release session."),h}finally{n._free(r),s!==0&&n._OrtReleaseSessionOptions(s)!==0&&Te("Can't release session options."),u.forEach(h=>n._free(h)),n.unmountExternalData?.()}},La=e=>{let t=ze(),r=St.get(e);if(!r)throw new Error(`cannot release session. invalid session id: ${e}`);let[i,n,a,s,o]=r;s&&(o&&t._OrtClearBoundOutputs(s.handle)!==0&&Te("Can't clear bound outputs."),t._OrtReleaseBinding(s.handle)!==0&&Te("Can't release IO binding.")),t.jsepOnReleaseSession?.(e),t.webnnOnReleaseSession?.(e),t.webgpuOnReleaseSession?.(e),n.forEach(u=>t._OrtFree(u)),a.forEach(u=>t._OrtFree(u)),t._OrtReleaseSession(i)!==0&&Te("Can't release session."),St.delete(e)},_r=new Map,xc=1,Bt=new Map,om=e=>{let t=ze(),r=t._malloc(e.byteLength);if(r===0)throw new Error(`Can't create a LoRA adapter. failed to allocate a buffer of size ${e.byteLength}.`);try{t.HEAPU8.set(e,r);let i=t._OrtCreateLoraAdapter(r,e.byteLength);i===0&&Te("Can't create a LoRA adapter.");let n=xc++;return _r.set(n,i),n}finally{t._free(r)}},um=e=>{let t=ze(),r=_r.get(e);if(r===void 0)throw new Error(`cannot release LoRA adapter. invalid adapter id: ${e}`);if(Bt.has(e))throw new Error(`cannot release LoRA adapter. the adapter is used by a run in progress. adapter id: ${e}`);t._OrtReleaseLoraAdapter(r)!==0&&Te("Can't release LoRA adapter."),_r.delete(e)},Wn=async(e,t,r,i,n,a,s=!1)=>{if(!e){t.push(0);return}let o=ze(),u=o.PTR_SIZE,l=e[0],c=e[1],h=e[3],m=h,g,f;if(l==="string"&&(h==="gpu-buffer"||h==="ml-tensor"))throw new Error("String tensor is not supported on GPU.");if(s&&h!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${a} when enableGraphCapture is true.`);if(h==="gpu-buffer"){let b=e[2].gpuBuffer;f=Pt(Ut(l),c);{let w=o.jsepRegisterBuffer;if(!w)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');g=w(i,a,b,f)}}else if(h==="ml-tensor"){let b=e[2].mlTensor;f=Pt(Ut(l),c);let w=o.webnnRegisterMLTensor;if(!w)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');g=w(i,b,Ut(l),c)}else{let b=e[2];if(Array.isArray(b)){f=u*b.length,g=o._malloc(f),r.push(g);for(let w=0;w<b.length;w++){if(typeof b[w]!="string")throw new TypeError(`tensor data at index ${w} is not a string`);o.setValue(g+w*u,st(b[w],r),"*")}}else{let w=o.webnnIsGraphInput,k=o.webnnIsGraphOutput;if(l!=="string"&&w&&k){let I=o.UTF8ToString(n);if(w(i,I)||k(i,I)){let S=Ut(l);f=Pt(S,c),m="ml-tensor";let E=o.webnnCreateTemporaryTensor,C=o.webnnUploadTensor;if(!E||!C)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let x=await E(i,S,c);C(x,new Uint8Array(b.buffer,b.byteOffset,b.byteLength)),g=x}else f=b.byteLength,g=o._malloc(f),r.push(g),o.HEAPU8.set(new Uint8Array(b.buffer,b.byteOffset,f),g)}else f=b.byteLength,g=o._malloc(f),r.push(g),o.HEAPU8.set(new Uint8Array(b.buffer,b.byteOffset,f),g)}}let $=o.stackSave(),v=o.stackAlloc(4*c.length);try{c.forEach((w,k)=>o.setValue(v+k*u,w,u===4?"i32":"i64"));let b=o._OrtCreateTensor(Ut(l),g,f,v,c.length,Qn(m));b===0&&Te(`Can't create tensor for input/output. session=${i}, index=${a}.`),t.push(b)}finally{o.stackRestore($)}},Wa=async(e,t,r,i,n,a,s=[])=>{let o=ze(),u=o.PTR_SIZE,l=St.get(e);if(!l)throw new Error(`cannot run inference. invalid session id: ${e}`);let c=l[0],h=l[1],m=l[2],g=l[3],f=l[4],$=l[5],v=[];if(s.length>0){if(g)throw new Error("LoRA adapters are not supported for a session that uses IO binding, e.g. when an output is preferred to be on GPU, or when the WebNN execution provider produces an output.");for(let O of s){let q=_r.get(O);if(q===void 0)throw new Error(`cannot run inference. invalid LoRA adapter id: ${O}`);v.push(q)}}let b=t.length,w=i.length,k=0,I=[],S=[],E=[],C=[],x=[],M=o.stackSave(),N=o.stackAlloc(b*u),B=o.stackAlloc(b*u),U=o.stackAlloc(w*u),F=o.stackAlloc(w*u);try{for(let P of s)Bt.set(P,(Bt.get(P)??0)+1);[k,I]=ap(a,v),Lt("wasm prepareInputOutputTensor");for(let P=0;P<b;P++)await Wn(r[P],S,C,e,h[t[P]],t[P],f);for(let P=0;P<w;P++)await Wn(n[P],E,C,e,m[i[P]],b+i[P],f);Wt("wasm prepareInputOutputTensor");for(let P=0;P<b;P++)o.setValue(N+P*u,S[P],"*"),o.setValue(B+P*u,h[t[P]],"*");for(let P=0;P<w;P++)o.setValue(U+P*u,E[P],"*"),o.setValue(F+P*u,m[i[P]],"*");if(g&&!$){let{handle:P,outputPreferredLocations:ie,outputPreferredLocationsEncoded:ae}=g;if(h.length!==b)throw new Error(`input count from feeds (${b}) is expected to be always equal to model's input count (${h.length}).`);Lt("wasm bindInputsOutputs");for(let Q=0;Q<b;Q++){let A=t[Q];await o._OrtBindInput(P,h[A],S[Q])!==0&&Te(`Can't bind input[${Q}] for session=${e}.`)}for(let Q=0;Q<w;Q++){let A=i[Q];n[Q]?.[3]?(x.push(E[Q]),o._OrtBindOutput(P,m[A],E[Q],0)!==0&&Te(`Can't bind pre-allocated output[${Q}] for session=${e}.`)):o._OrtBindOutput(P,m[A],0,ae[A])!==0&&Te(`Can't bind output[${Q}] to ${ie[Q]} for session=${e}.`)}Wt("wasm bindInputsOutputs"),St.set(e,[c,h,m,g,f,!0])}o.jsepOnRunStart?.(c),o.webnnOnRunStart?.(c);let O;g?O=await o._OrtRunWithBinding(c,g.handle,w,U,k):O=await o._OrtRun(c,B,N,b,F,w,U,k),O!==0&&Te("failed to call OrtRun().");let q=[],j=[];Lt("wasm ProcessOutputTensor");for(let P=0;P<w;P++){let ie=Number(o.getValue(U+P*u,"*"));if(ie===E[P]||x.includes(E[P])){q.push(n[P]),ie!==E[P]&&o._OrtReleaseTensor(ie)!==0&&Te("Can't release tensor.");continue}let ae=o.stackSave(),Q=o.stackAlloc(4*u),A=!1,W,G=0;try{o._OrtGetTensorData(ie,Q,Q+u,Q+2*u,Q+3*u)!==0&&Te(`Can't access output tensor data on index ${P}.`);let Z=u===4?"i32":"i64",ce=Number(o.getValue(Q,Z));G=o.getValue(Q+u,"*");let we=o.getValue(Q+u*2,"*"),Y=Number(o.getValue(Q+u*3,Z)),J=[];for(let oe=0;oe<Y;oe++)J.push(Number(o.getValue(we+oe*u,Z)));o._OrtFree(we)!==0&&Te("Can't free memory for tensor dims.");let re=J.reduce((oe,he)=>oe*he,1);W=wt(ce);let ee=g?.outputPreferredLocations[i[P]];if(W==="string"){if(ee==="gpu-buffer"||ee==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let oe=[];for(let he=0;he<re;he++){let D=o.getValue(G+he*u,"*"),K=o.getValue(G+(he+1)*u,"*"),le=he===re-1?void 0:K-D;oe.push(o.UTF8ToString(D,le))}q.push([W,J,oe,"cpu"])}else if(ee==="gpu-buffer"&&re>0){let oe=o.jsepGetBuffer;if(!oe)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let he=oe(G),D=Pt(ce,re);if(D===void 0||!xa(W))throw new Error(`Unsupported data type: ${W}`);A=!0,q.push([W,J,{gpuBuffer:he,download:o.jsepCreateDownloader(he,D,W),dispose:()=>{o._OrtReleaseTensor(ie)!==0&&Te("Can't release tensor.")}},"gpu-buffer"])}else if(ee==="ml-tensor"&&re>0){let oe=o.webnnEnsureTensor,he=o.webnnIsGraphInputOutputTypeSupported;if(!oe||!he)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(Pt(ce,re)===void 0||!va(W))throw new Error(`Unsupported data type: ${W}`);if(!he(e,W,!1))throw new Error(`preferredLocation "ml-tensor" for ${W} output is not supported by current WebNN Context.`);let D=await oe(e,G,ce,J,!1);A=!0,q.push([W,J,{mlTensor:D,download:o.webnnCreateMLTensorDownloader(G,W),dispose:()=>{o.webnnReleaseTensorId(G),o._OrtReleaseTensor(ie)}},"ml-tensor"])}else if(ee==="ml-tensor-cpu-output"&&re>0){let oe=o.webnnCreateMLTensorDownloader(G,W)(),he=q.length;A=!0,j.push((async()=>{let D=[he,await oe];return o.webnnReleaseTensorId(G),o._OrtReleaseTensor(ie),D})()),q.push([W,J,[],"cpu"])}else{let oe=gi(W),he=new oe(re);new Uint8Array(he.buffer,he.byteOffset,he.byteLength).set(o.HEAPU8.subarray(G,G+he.byteLength)),q.push([W,J,he,"cpu"])}}finally{o.stackRestore(ae),W==="string"&&G&&o._free(G),A||o._OrtReleaseTensor(ie)}}g&&!f&&(o._OrtClearBoundOutputs(g.handle)!==0&&Te("Can't clear bound outputs."),St.set(e,[c,h,m,g,f,!1]));for(let[P,ie]of await Promise.all(j))q[P][2]=ie;return Wt("wasm ProcessOutputTensor"),q}finally{o.webnnOnRunEnd?.(c),o.stackRestore(M),S.forEach(O=>o._OrtReleaseTensor(O)),E.forEach(O=>o._OrtReleaseTensor(O)),C.forEach(O=>o._free(O)),k!==0&&o._OrtReleaseRunOptions(k),I.forEach(O=>o._free(O));for(let O of s){let q=Bt.get(O)-1;q===0?Bt.delete(O):Bt.set(O,q)}}},qa=e=>{let t=ze(),r=St.get(e);if(!r)throw new Error("invalid session id");let i=r[0],n=t._OrtEndProfiling(i);n===0&&Te("Can't get an profile file name."),t._OrtFree(n)},Ga=e=>{let t=[];for(let r of e){let i=r[2];!Array.isArray(i)&&"buffer"in i&&t.push(i.buffer)}return t}}),ct,Xe,Yt,br,$r,ti,qn,ri,Rt,Dt,vc,dm,cm,pm,hm,fm,mm,gm,ym,wm,Va=te(()=>{"use strict";Ye(),lm(),Ht(),_a(),ka(),ct=()=>!!Ee.wasm.proxy&&typeof document<"u",Yt=!1,br=!1,$r=!1,ri=new Map,Rt=(e,t)=>{let r=ri.get(e);r?r.push(t):ri.set(e,[t])},Dt=()=>{if(Yt||!br||$r||!Xe)throw new Error("worker not ready")},vc=e=>{switch(e.data.type){case"init-wasm":Yt=!1,e.data.err?($r=!0,qn[1](e.data.err)):(br=!0,qn[0]()),ti&&(URL.revokeObjectURL(ti),ti=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=ri.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}default:}},dm=async()=>{if(!br){if(Yt)throw new Error("multiple calls to 'initWasm()' detected.");if($r)throw new Error("previous call to 'initWasm()' failed.");if(Yt=!0,ct())return new Promise((e,t)=>{Xe?.terminate(),ip().then(([r,i])=>{try{Xe=i,Xe.onerror=a=>t(a),Xe.onmessage=vc,qn=[e,t];let n={type:"init-wasm",in:Ee};!n.in.wasm.wasmPaths&&(r||Yn)&&(n.in.wasm.wasmPaths={wasm:new URL("/assets/ort-wasm-simd-threaded.jsep.wasm",import.meta.url).href}),Xe.postMessage(n),ti=r}catch(n){t(n)}},t)});try{await ba(Ee.wasm),await Na(Ee),br=!0}catch(e){throw $r=!0,e}finally{Yt=!1}}},cm=async e=>{if(ct())return Dt(),new Promise((t,r)=>{Rt("init-ep",[t,r]);let i={type:"init-ep",in:{epName:e,env:Ee}};Xe.postMessage(i)});await Ua(Ee,e)},pm=async e=>ct()?(Dt(),new Promise((t,r)=>{Rt("copy-from",[t,r]);let i={type:"copy-from",in:{buffer:e}};Xe.postMessage(i,[e.buffer])})):fi(e),hm=async(e,t)=>{if(ct()){if(t?.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return Dt(),new Promise((r,i)=>{Rt("create",[r,i]);let n={type:"create",in:{model:e,options:{...t}}},a=[];e instanceof Uint8Array&&a.push(e.buffer),Xe.postMessage(n,a)})}else return Pa(e,t)},fm=async e=>{if(ct())return Dt(),new Promise((t,r)=>{Rt("release",[t,r]);let i={type:"release",in:e};Xe.postMessage(i)});La(e)},mm=async e=>{if(ct())throw new Error("LoRA adapter is not supported for proxy.");let t=typeof e=="string"?await yi(e):e;return om(t)},gm=async e=>{if(ct())throw new Error("LoRA adapter is not supported for proxy.");um(e)},ym=async(e,t,r,i,n,a,s)=>{if(ct()){if(s.length>0)throw new Error("LoRA adapter is not supported for proxy.");if(r.some(o=>o[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(n.some(o=>o))throw new Error("pre-allocated output tensor is not supported for proxy.");return Dt(),new Promise((o,u)=>{Rt("run",[o,u]);let l=r,c={type:"run",in:{sessionId:e,inputIndices:t,inputs:l,outputIndices:i,options:a}};Xe.postMessage(c,Ga(l))})}else return Wa(e,t,r,i,n,a,s)},wm=async e=>{if(ct())return Dt(),new Promise((t,r)=>{Rt("end-profiling",[t,r]);let i={type:"end-profiling",in:e};Xe.postMessage(i)});qa(e)}}),Ha,_m=te(()=>{"use strict";Ye(),Va(),Ha=class{async loadAdapter(e){Je(),this.adapterId=await mm(e),Ke()}async dispose(){return gm(this.adapterId)}}}),Gn,kc,bm,e1=te(()=>{"use strict";Ye(),_m(),Va(),me(),wa(),ka(),Gn=(e,t)=>{switch(e.location){case"cpu":return[e.type,e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[e.type,e.dims,{mlTensor:e.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${e.location} for ${t()}`)}},kc=e=>{switch(e[3]){case"cpu":return new Ve(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!xa(t))throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:r,download:i,dispose:n}=e[2];return Ve.fromGpuBuffer(r,{dataType:t,dims:e[1],download:i,dispose:n})}case"ml-tensor":{let t=e[0];if(!va(t))throw new Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:r,download:i,dispose:n}=e[2];return Ve.fromMLTensor(r,{dataType:t,dims:e[1],download:i,dispose:n})}default:throw new Error(`invalid data location: ${e[3]}`)}},bm=class{async fetchModelAndCopyToWasmMemory(e){return pm(await yi(e))}async loadModel(e,t){Je();let r;typeof e=="string"?r=await this.fetchModelAndCopyToWasmMemory(e):r=e,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await hm(r,t),Ke()}async dispose(){return fm(this.sessionId)}async run(e,t,r,i=[]){Je();let n=i.map(g=>{if(!(g instanceof Ha))throw new Error("LoRA adapter was not created by the WebAssembly backend.");return g.adapterId}),a=[],s=[];Object.entries(e).forEach(g=>{let f=g[0],$=g[1],v=this.inputNames.indexOf(f);if(v===-1)throw new Error(`invalid input '${f}'`);a.push($),s.push(v)});let o=[],u=[];Object.entries(t).forEach(g=>{let f=g[0],$=g[1],v=this.outputNames.indexOf(f);if(v===-1)throw new Error(`invalid output '${f}'`);o.push($),u.push(v)});let l=a.map((g,f)=>Gn(g,()=>`input "${this.inputNames[s[f]]}"`)),c=o.map((g,f)=>g?Gn(g,()=>`output "${this.outputNames[u[f]]}"`):null),h=await ym(this.sessionId,s,l,u,c,r,n),m={};for(let g=0;g<h.length;g++)m[this.outputNames[u[g]]]=o[g]??kc(h[g]);return Ke(),m}startProfiling(){}endProfiling(){wm(this.sessionId)}}}),$m,t1=te(()=>{"use strict";$m=e=>{if(e?.epContextDataRead)throw new Error('session option "epContextDataRead" is not supported by ONNX Runtime Web')}}),xm={};or(xm,{OnnxruntimeWebAssemblyBackend:()=>da,initializeFlags:()=>la,wasmBackend:()=>vm});var la,da,vm,r1=te(()=>{"use strict";Ye(),_m(),Va(),e1(),t1(),la=()=>{(typeof Ee.wasm.initTimeout!="number"||Ee.wasm.initTimeout<0)&&(Ee.wasm.initTimeout=0);let e=Ee.wasm.simd;if(typeof e!="boolean"&&e!==void 0&&e!=="fixed"&&e!=="relaxed"&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` and ignore SIMD feature checking.`),Ee.wasm.simd=!1),typeof Ee.wasm.proxy!="boolean"&&(Ee.wasm.proxy=!1),typeof Ee.wasm.trace!="boolean"&&(Ee.wasm.trace=!1),typeof Ee.wasm.numThreads!="number"||!Number.isInteger(Ee.wasm.numThreads)||Ee.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)Ee.wasm.numThreads=1;else{let t=typeof navigator>"u"?U0("node:os").cpus().length:navigator.hardwareConcurrency;Ee.wasm.numThreads=Math.min(4,Math.ceil((t||1)/2))}},da=class{async init(e){la(),await dm(),await cm(e)}async createInferenceSessionHandler(e,t){$m(t);let r=new bm;return await r.loadModel(e,t),r}async createLoraAdapterHandler(e){let t=new Ha;return await t.loadAdapter(e),t}},vm=new da});Ye();Ye();Ye();var i1="1.31.1";{let e=(r1(),Er(xm)).wasmBackend;Jt("webgpu",e,5),Jt("webnn",e,5),Jt("cpu",e,10),Jt("wasm",e,10)}Object.defineProperty(Ee.versions,"web",{value:i1,enumerable:!0});/**
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
 */class ir{static calculateDetResize(t,r,i=1920){const n=Math.max(t,r);let a=n>i?i/n:1,s=Math.max(32,Math.round(t*a/32)*32),o=Math.max(32,Math.round(r*a/32)*32);return{targetW:s,targetH:o,ratioW:s/t,ratioH:o/r}}static imageToDetTensor(t,r,i){const n=[.485,.456,.406],a=[.229,.224,.225],s=new Float32Array(3*i*r),o=t.data,u=i*r;for(let l=0;l<i;l++)for(let c=0;c<r;c++){const h=(l*r+c)*4,m=l*r+c,g=(o[h]/255-n[0])/a[0],f=(o[h+1]/255-n[1])/a[1],$=(o[h+2]/255-n[2])/a[2];s[m]=g,s[m+u]=f,s[m+u*2]=$}return new Ve("float32",s,[1,3,i,r])}static imageToRecTensor(t,r,i){const n=new Float32Array(3*i*r),a=t.data,s=i*r;for(let o=0;o<i;o++)for(let u=0;u<r;u++){const l=(o*r+u)*4,c=o*r+u,h=(a[l]/255-.5)/.5,m=(a[l+1]/255-.5)/.5,g=(a[l+2]/255-.5)/.5;n[c]=h,n[c+s]=m,n[c+s*2]=g}return new Ve("float32",n,[1,3,i,r])}static imageToRecTensorBatch(t,r,i){const n=i*r,a=new Float32Array(t.length*3*n);for(let s=0;s<t.length;s++){const o=t[s],u=Math.min(o.width,r),l=s*3*n;for(let c=0;c<i;c++)for(let h=0;h<u;h++){const m=(c*o.width+h)*4,g=l+c*r+h;a[g]=(o.data[m]/255-.5)/.5,a[g+n]=(o.data[m+1]/255-.5)/.5,a[g+n*2]=(o.data[m+2]/255-.5)/.5}}return new Ve("float32",a,[t.length,3,i,r])}static clampBox(t,r,i){const n=Math.max(0,Math.min(t.x,r-1)),a=Math.max(0,Math.min(t.y,i-1)),s=Math.max(1,Math.min(t.width,r-n)),o=Math.max(1,Math.min(t.height,i-a));return{x:n,y:a,width:s,height:o,confidence:t.confidence}}}class ca{static segmentLines(t,r,i,n){try{const s=t.getImageData(r.x,r.y,r.width,r.height).data,o=r.width,u=r.height,l=new Int32Array(256),c=B=>(s[B*4]*299+s[B*4+1]*587+s[B*4+2]*114)/1e3,h=o*u;for(let B=0;B<h;B++)l[Math.round(c(B))]++;let m=0;for(let B=0;B<256;B++)m+=B*l[B];let g=0,f=0,$=-1,v=128;for(let B=0;B<256;B++){if(f+=l[B],f===0)continue;const U=h-f;if(U===0)break;g+=B*l[B];const F=g/f,O=(m-g)/U,q=f*U*(F-O)*(F-O);q>$&&($=q,v=B)}let b=0;for(let B=0;B<=v;B++)b+=l[B];const w=b<=h/2,k=B=>w?B<=v:B>v,I=Math.round(o*.08),S=new Int32Array(u);for(let B=0;B<u;B++){let U=0;const F=B*o;for(let O=I;O<o-I;O++)k(c(F+O))&&U++;S[B]=U}const E=Math.max(4,Math.round(o*.03)),C=[];let x=!1,M=0;for(let B=0;B<u;B++){const U=S[B]>=E;if(U&&!x)x=!0,M=B;else if(!U&&x){x=!1;const F=B-M;F>=11&&C.push({startY:M,height:F})}}if(x){const B=u-M;B>=11&&C.push({startY:M,height:B})}if(C.length<=1)return[r];const N=[];if(!w){const U=Math.ceil(o/8),F=Math.ceil(u/8),O=new Int32Array(U*F),q=new Int32Array(U*F);for(let Q=0;Q<u;Q++){const A=Q/8|0,W=Q*o;for(let G=0;G<o;G++){const Z=A*U+(G/8|0);q[Z]++,k(c(W+G))&&O[Z]++}}const j=new Uint8Array(U*F);for(let Q=0;Q<U*F;Q++)q[Q]>0&&O[Q]/q[Q]>=.85&&(j[Q]=1);const P=new Int16Array(U*F).fill(-1);let ie=0;const ae=[];for(let Q=0;Q<U*F;Q++){if(!j[Q]||P[Q]>=0)continue;let A=U,W=-1,G=F,Z=-1;const ce=[Q];for(P[Q]=ie;ce.length;){const we=ce.pop(),Y=we/U|0,J=we%U;J<A&&(A=J),J>W&&(W=J),Y<G&&(G=Y),Y>Z&&(Z=Y);const re=[Y>0?we-U:-1,Y<F-1?we+U:-1,J>0?we-1:-1,J<U-1?we+1:-1];for(const ee of re)ee>=0&&j[ee]&&P[ee]<0&&(P[ee]=ie,ce.push(ee))}ae.push({cx0:A,cx1:W,cy0:G,cy1:Z}),ie++}for(const Q of ae)Q.cx1-Q.cx0+1>=4&&Q.cy1-Q.cy0+1>=4&&N.push({x0:Q.cx0*8,x1:Math.min(o-1,(Q.cx1+1)*8),y0:Q.cy0*8,y1:Math.min(u-1,(Q.cy1+1)*8)})}return C.flatMap(B=>{const U=B.startY,F=B.startY+B.height,O=N.filter(A=>A.y0<F&&A.y1>U),q=new Uint8Array(o);for(let A=0;A<B.height;A++){const G=(B.startY+A)*o;for(let Z=0;Z<o;Z++)k(c(G+Z))&&(q[Z]=1)}for(const A of O)for(let W=A.x0;W<=A.x1&&W<o;W++)q[W]=0;let j=o,P=-1;for(let A=0;A<o;A++)q[A]&&(A<j&&(j=A),A>P&&(P=A));let ie;if(j>P)ie=[{x0:0,x1:o-1}];else{ie=[{x0:j,x1:P}];for(const A of O){const W=[];for(const G of ie){if(A.x1<G.x0||A.x0>G.x1){W.push(G);continue}A.x0>G.x0&&W.push({x0:G.x0,x1:A.x0-1}),A.x1<G.x1&&W.push({x0:A.x1+1,x1:G.x1})}ie=W}ie.length===0&&ie.push({x0:0,x1:o-1})}O.length===0&&ie.length===1&&ie[0].x1-ie[0].x0<o*.5&&(ie[0]={x0:0,x1:o-1});const ae=6,Q=ie.filter(A=>A.x1-A.x0>=10);return Q.length===0&&Q.push({x0:0,x1:o-1}),Q.map(A=>{const W=ir.clampBox({x:Math.max(r.x,r.x+A.x0-ae),y:r.y+B.startY,width:A.x1-A.x0+1+ae*2,height:B.height,confidence:r.confidence},i,n);return W.kind=r.kind,W})})}catch{return[r]}}}class Sc{session;inputSize=640;textBubbleThresh=.15;textFreeThresh=.07;bubbleFallbackThresh=.3;constructor(t){this.session=t}async release(){await this.session.release?.()}async detectText(t,r,i){const a=new OffscreenCanvas(this.inputSize,this.inputSize).getContext("2d");if(!a)throw new Error("Không thể tạo context 2D cho ComicDetEngine");a.drawImage(t,0,0,this.inputSize,this.inputSize);const o=a.getImageData(0,0,this.inputSize,this.inputSize).data,u=this.inputSize*this.inputSize,l=new Float32Array(3*u);for(let C=0;C<u;C++){const x=C*4;l[C]=o[x]/255,l[u+C]=o[x+1]/255,l[2*u+C]=o[x+2]/255}const c=new Ve("float32",l,[1,3,this.inputSize,this.inputSize]),h=new Ve("int64",new BigInt64Array([BigInt(r),BigInt(i)]),[1,2]),m={images:c,orig_target_sizes:h};let g=null,f,$,v;try{g=await this.session.run(m),f=Array.from(g.labels.data),$=new Float32Array(g.boxes.data),v=new Float32Array(g.scores.data)}finally{if(c.dispose?.(),h.dispose?.(),g)for(const C of Object.values(g))C.dispose?.()}const b=v.length,w=[],k=[];for(let C=0;C<b;C++){const x=v[C],M=Number(f[C]),N=Math.max(0,Math.round($[C*4+0])),B=Math.max(0,Math.round($[C*4+1])),U=Math.min(r,Math.round($[C*4+2])),F=Math.min(i,Math.round($[C*4+3])),O=U-N,q=F-B;if(O<8||q<8||O>=r*.98&&q>=i*.95)continue;const j={x:N,y:B,width:O,height:q,confidence:x};M===1&&x>=this.textBubbleThresh?(j.kind="dialogue",w.push(j)):M===2&&x>=this.textFreeThresh?(j.kind="sfx",w.push(j)):M===0&&x>=this.bubbleFallbackThresh&&k.push(j)}for(const C of k)if(!w.some(M=>M.x>=C.x-12&&M.y>=C.y-12&&M.x+M.width<=C.x+C.width+12&&M.y+M.height<=C.y+C.height+12)){const M=Math.round(C.width*.08),N=Math.round(C.height*.08);w.push({x:C.x+M,y:C.y+N,width:Math.max(12,C.width-M*2),height:Math.max(12,C.height-N*2),confidence:C.confidence,kind:"dialogue"})}const I=w,S=[],E=t.getContext("2d");for(const C of I){if(C.height>=34&&C.width>=28&&E){const x=ca.segmentLines(E,C,r,i);if(x.length>0){S.push(...x);continue}}S.push(C)}return S.sort((C,x)=>C.y-x.y)}}class yt{static shouldWarp(t){return typeof t=="number"&&Math.abs(t)>=10}static minAreaQuad(t){if(t.length<3){const[c=0,h=0]=t[0]||[];return{quad:[[c,h],[c+1,h],[c+1,h+1],[c,h+1]],angleDeg:0}}const r=this.convexHull(t);if(r.length<3){let c=1/0,h=1/0,m=-1/0,g=-1/0;for(const[f,$]of t)f<c&&(c=f),f>m&&(m=f),$<h&&(h=$),$>g&&(g=$);return{quad:[[c,h],[m,h],[m,g],[c,g]],angleDeg:0}}let i=1/0,n=[];for(let c=0;c<r.length;c++){const[h,m]=r[c],[g,f]=r[(c+1)%r.length],$=g-h,v=f-m,b=Math.hypot($,v);if(b<1e-6)continue;const w=$/b,k=v/b,I=-k,S=w;let E=1/0,C=-1/0,x=1/0,M=-1/0;for(const[B,U]of r){const F=B*w+U*k,O=B*I+U*S;F<E&&(E=F),F>C&&(C=F),O<x&&(x=O),O>M&&(M=O)}const N=(C-E)*(M-x);N<i&&(i=N,n=[[E*w+x*I,E*k+x*S],[C*w+x*I,C*k+x*S],[C*w+M*I,C*k+M*S],[E*w+M*I,E*k+M*S]])}const a=this.orderCornersTLTRBRBL(n),s=Math.hypot(a[1][0]-a[0][0],a[1][1]-a[0][1]),o=Math.hypot(a[3][0]-a[0][0],a[3][1]-a[0][1]);let u;s>=o?u=Math.atan2(a[1][1]-a[0][1],a[1][0]-a[0][0]):u=Math.atan2(a[2][1]-a[1][1],a[2][0]-a[1][0])-Math.PI/2;let l=u*180/Math.PI;for(;l>45;)l-=90;for(;l<-45;)l+=90;return{quad:a,angleDeg:l}}static unclipQuad(t,r){const i=Math.hypot(t[1][0]-t[0][0],t[1][1]-t[0][1]),n=Math.hypot(t[3][0]-t[0][0],t[3][1]-t[0][1]),a=i*n,s=Math.max(1,2*(i+n)),o=Math.max(3,Math.min(18,a*r/s)),u=(t[0][0]+t[1][0]+t[2][0]+t[3][0])*.25,l=(t[0][1]+t[1][1]+t[2][1]+t[3][1])*.25,c=i>1e-6?(t[1][0]-t[0][0])/i:1,h=i>1e-6?(t[1][1]-t[0][1])/i:0,m=n>1e-6?(t[3][0]-t[0][0])/n:0,g=n>1e-6?(t[3][1]-t[0][1])/n:1,f=i*.5+o,$=n*.5+o;return[[u-f*c-$*m,l-f*h-$*g],[u+f*c-$*m,l+f*h-$*g],[u+f*c+$*m,l+f*h+$*g],[u-f*c+$*m,l-f*h+$*g]]}static warpQuadToHorizontal(t,r){const i=Math.hypot(r[1][0]-r[0][0],r[1][1]-r[0][1]),n=Math.hypot(r[2][0]-r[3][0],r[2][1]-r[3][1]),a=Math.hypot(r[3][0]-r[0][0],r[3][1]-r[0][1]),s=Math.hypot(r[2][0]-r[1][0],r[2][1]-r[1][1]),o=Math.max(4,Math.round((i+n)*.5)),u=Math.max(4,Math.round((a+s)*.5));if(o<4||u<4)return null;const l=new Uint8ClampedArray(o*u*4),{data:c,width:h,height:m}=t;for(let g=0;g<u;g++){const f=u>1?g/(u-1):0,$=r[0][0]+(r[3][0]-r[0][0])*f,v=r[0][1]+(r[3][1]-r[0][1])*f,b=r[1][0]+(r[2][0]-r[1][0])*f,w=r[1][1]+(r[2][1]-r[1][1])*f;for(let k=0;k<o;k++){const I=o>1?k/(o-1):0,S=Math.max(0,Math.min(h-1.001,$+(b-$)*I)),E=Math.max(0,Math.min(m-1.001,v+(w-v)*I)),C=S|0,x=E|0,M=S-C,N=E-x,B=Math.min(h-1,C+1),U=Math.min(m-1,x+1),F=(x*h+C)*4,O=(x*h+B)*4,q=(U*h+C)*4,j=(U*h+B)*4,P=(1-M)*(1-N),ie=M*(1-N),ae=(1-M)*N,Q=M*N,A=(g*o+k)*4;l[A]=c[F]*P+c[O]*ie+c[q]*ae+c[j]*Q,l[A+1]=c[F+1]*P+c[O+1]*ie+c[q+1]*ae+c[j+1]*Q,l[A+2]=c[F+2]*P+c[O+2]*ie+c[q+2]*ae+c[j+2]*Q,l[A+3]=255}}return{data:l,width:o,height:u}}static pointInQuad(t,r,i){if(i.length<4)return!0;let n=0,a=0;for(let s=0;s<4;s++){const[o,u]=i[s],[l,c]=i[s+1&3],h=(l-o)*(r-u)-(c-u)*(t-o);if(h>1e-6?n++:h<-1e-6&&a++,n>0&&a>0)return!1}return!0}static convexHull(t){const r=[...t].sort((s,o)=>s[0]!==o[0]?s[0]-o[0]:s[1]-o[1]),i=(s,o,u)=>(o[0]-s[0])*(u[1]-s[1])-(o[1]-s[1])*(u[0]-s[0]),n=[];for(const s of r){for(;n.length>=2&&i(n[n.length-2],n[n.length-1],s)<=0;)n.pop();n.push(s)}const a=[];for(let s=r.length-1;s>=0;s--){const o=r[s];for(;a.length>=2&&i(a[a.length-2],a[a.length-1],o)<=0;)a.pop();a.push(o)}return n.pop(),a.pop(),n.concat(a)}static orderCornersTLTRBRBL(t){const r=[...t].sort((a,s)=>a[1]-s[1]),i=r.slice(0,2).sort((a,s)=>a[0]-s[0]),n=r.slice(2,4).sort((a,s)=>a[0]-s[0]);return[i[0],i[1],n[1],n[0]]}}class Ic{session;thresh=.2;boxThresh=.22;unclipRatio=1.65;lastProbMap=null;constructor(t,r){this.session=t,r?.thresh!==void 0&&(this.thresh=r.thresh),r?.boxThresh!==void 0&&(this.boxThresh=r.boxThresh),r?.unclipRatio!==void 0&&(this.unclipRatio=r.unclipRatio)}async release(){await this.session.release?.()}async detectText(t,r,i){const{targetW:n,targetH:a,ratioW:s,ratioH:o}=ir.calculateDetResize(r,i),l=new OffscreenCanvas(n,a).getContext("2d");if(!l)throw new Error("Khong the khoi tao OffscreenCanvas 2D context");l.drawImage(t,0,0,n,a);const c=l.getImageData(0,0,n,a),h=ir.imageToDetTensor(c,n,a),m={},g=this.session.inputNames[0]||"x";m[g]=h;let f=null,$;try{f=await this.session.run(m);const k=this.session.outputNames[0],I=f[k];$=new Float32Array(I.data)}finally{if(h.dispose?.(),f)for(const k of Object.values(f))k.dispose?.()}this.lastProbMap={data:$,w:n,h:a,ratioW:s,ratioH:o};const v=this.extractBoxes($,n,a),b=[];for(const k of v){if(k.confidence&&k.confidence<this.boxThresh)continue;let I,S,E,C,x;if(k.quad&&yt.shouldWarp(k.angleDeg)){const U=k.quad.map(([j,P])=>[j/s,P/o]);x=yt.unclipQuad(U,this.unclipRatio).map(([j,P])=>[Math.max(0,Math.min(r-1,Math.round(j))),Math.max(0,Math.min(i-1,Math.round(P)))]);const O=x.map(j=>j[0]),q=x.map(j=>j[1]);I=Math.min(...O),S=Math.min(...q),E=Math.max(...O)-I,C=Math.max(...q)-S}else{const U=k.width*k.height,F=2*(k.width+k.height),O=Math.max(3,Math.min(18,U*this.unclipRatio/Math.max(1,F))),q=k.x+k.width/2,j=k.y+k.height/2,P=k.width+O*2,ie=k.height+O*2;I=Math.round((q-P/2)/s),S=Math.round((j-ie/2)/o),E=Math.round(P/s),C=Math.round(ie/o)}const M=ir.clampBox({x:I,y:S,width:E,height:C,confidence:k.confidence},r,i);M.kind=k.kind,x&&(M.quad=x,M.angleDeg=k.angleDeg);const N=M.width<8||M.height<8,B=M.width>=r*.98&&M.height>=i*.94;!N&&!B&&b.push(M)}return this.mergeHorizontalBoxes(b,r).sort((k,I)=>k.y-I.y)}mergeHorizontalBoxes(t,r){if(t.length<=1)return t;let i=[...t],n=!0;for(;n;){n=!1;const a=[],s=new Set;for(let o=0;o<i.length;o++){if(s.has(o))continue;let u={...i[o]};for(let l=o+1;l<i.length;l++){if(s.has(l))continue;const c=i[l];if(yt.shouldWarp(u.angleDeg)||yt.shouldWarp(c.angleDeg))continue;const h=u.y,m=u.y+u.height,g=c.y,f=c.y+c.height,$=Math.max(0,Math.min(m,f)-Math.max(h,g)),v=Math.min(u.height,c.height);if($/Math.max(1,v)>=.4){const w=u.x,k=u.x+u.width,I=c.x,S=c.x+c.width,E=Math.max(0,Math.max(w,I)-Math.min(k,S)),C=Math.max(u.height,c.height)*.85,x=Math.min(w,I),N=Math.max(k,S)-x;if(E<=C&&N<=r*.96){const B=Math.min(h,g),U=Math.max(m,f);u={x,y:B,width:N,height:U-B,confidence:Math.max(u.confidence||0,c.confidence||0),kind:u.kind??c.kind},s.add(l),n=!0}}}a.push(u)}i=a}return i}extractBoxes(t,r,i){const n=new Uint8Array(r*i),a=[];for(let s=0;s<i;s++)for(let o=0;o<r;o++){const u=s*r+o;if(n[u]||t[u]<this.thresh)continue;let l=o,c=o,h=s,m=s,g=0,f=0;const $=[],v=[u];for(n[u]=1;v.length>0;){const k=v.pop(),I=Math.floor(k/r),S=k%r;g+=t[k],f++,S<l&&(l=S),S>c&&(c=S),I<h&&(h=I),I>m&&(m=I);const E=[I>0?(I-1)*r+S:-1,I<i-1?(I+1)*r+S:-1,S>0?I*r+(S-1):-1,S<r-1?I*r+(S+1):-1];let C=!1;for(const x of E)x<0||t[x]<this.thresh?C=!0:n[x]||(n[x]=1,v.push(x));C&&$.length<512&&$.push([S,I])}const b=c-l+1,w=m-h+1;if(b>=5&&w>=5&&f>=6){const k={x:l,y:h,width:b,height:w,confidence:g/f,kind:"dialogue"};if($.length>=8){const{quad:I,angleDeg:S}=yt.minAreaQuad($);yt.shouldWarp(S)&&(k.quad=I,k.angleDeg=S)}a.push(k)}}return a}}class n1{static analyzeRegion(t,r=.18){const i=t.width,n=t.height;if(i<=0||n<=0||t.data.length<i*n*4)return{isDark:!1,bgHex:"#ffffff",luma:255,lumaStdDev:0};const a=Math.max(1,Math.round(Math.min(i,n)*r)),s=[],o=[],u=[],l=[],c=(v,b)=>{const w=(b*i+v)*4,k=t.data[w],I=t.data[w+1],S=t.data[w+2];s.push(k),o.push(I),u.push(S),l.push(.299*k+.587*I+.114*S)};for(let v=0;v<i;v+=3)for(let b=0;b<a;b++)c(v,b),c(v,n-1-b);for(let v=a;v<n-a;v+=3)for(let b=0;b<a;b++)c(b,v),c(i-1-b,v);if(l.length===0)return{isDark:!1,bgHex:"#ffffff",luma:255,lumaStdDev:0};const h=Vn(s),m=Vn(o),g=Vn(u),f=l.reduce((v,b)=>v+b,0)/l.length,$=l.reduce((v,b)=>v+(b-f)*(b-f),0)/l.length;return{isDark:f<105,bgHex:`#${Hn(h)}${Hn(m)}${Hn(g)}`,luma:f,lumaStdDev:Math.sqrt($)}}}function Vn(e){const t=e.slice().sort((i,n)=>i-n),r=t.length>>1;return t.length%2===0?Math.round((t[r-1]+t[r])/2):t[r]}function Hn(e){return Math.max(0,Math.min(255,e)).toString(16).padStart(2,"0")}class Tr{static BUCKETS=[64,128,256,512,960];static MAX_BATCH=8;static assignBuckets(t,r=Tr.BUCKETS){const i=new Map,n=r[r.length-1];for(let a=0;a<t.length;a++){let s=n;for(const u of r)if(t[a]<=u){s=u;break}const o=i.get(s);o?o.push(a):i.set(s,[a])}return i}static concatTensors(t,r,i,n){const a=n*i,s=new Float32Array(t.length*3*a);for(let o=0;o<t.length;o++){const u=Math.min(r[o],i),l=n*u,c=o*3*a;for(let h=0;h<3;h++){const m=h*l,g=c+h*a;for(let f=0;f<n;f++)s.set(t[o].subarray(m+f*u,m+f*u+u),g+f*i)}}return s}}function a1(e){const t=e.replace(/(?:\r?\n)+$/,"");if(!t)return[" "];const r=t.split(/\r?\n/);for(;r.length>0&&r[0]==="";)r.shift();return r.length===0?[" "]:(r[r.length-1]!==" "&&r.push(" "),r)}class Cr{session;characters;targetH=48;isCjkModel;batchSupported=!0;constructor(t,r,i){this.session=t,this.isCjkModel=i?.isCjkModel??!1,this.characters=a1(r)}async release(){await this.session.release?.()}async recognizeBoxes(t,r){if(!t.getContext("2d"))return[];const n=[];for(let o=0;o<r.length;o++){const u=this.prepareCrop(t,r[o],o);u&&n.push(u)}const a=this.session.inputNames[0]||"x";if(this.batchSupported)try{await this.runBatched(n,a)}catch(o){this.batchSupported=!1,console.warn("[SpeedySlate] Rec batch inference unsupported, using sequential path:",o)}this.batchSupported||await this.runSequential(n,a),await this.retryLowConfidence(n,a);const s=[];for(const o of n){if(!o.decoded)continue;const u=o.text.replace(/\s+/g," ").trim(),l=/[\p{L}\p{N}]/u.test(u),c=u.length<=2&&o.confidence<.65;u.length>0&&l&&!c&&o.confidence>.28&&s.push({id:`bubble-${Date.now()}-${o.index}`,box:o.box,originalText:u,isDarkBackground:o.isDark,confidence:o.confidence,bgColor:o.bgColor,kind:o.box.kind??"dialogue",...o.isVertical?{isVertical:!0}:{}})}return s}prepareCrop(t,r,i){const s=Math.max(0,r.x-5),o=Math.max(0,r.y-2),u=Math.max(1,Math.min(t.width-s,r.width+10)),l=Math.max(1,Math.min(t.height-o,r.height+4));let c=new OffscreenCanvas(u,l),h=c.getContext("2d");if(!h)return null;h.drawImage(t,s,o,u,l,0,0,u,l);let m=h.getImageData(0,0,u,l);if(r.quad&&r.quad.length===4&&yt.shouldWarp(r.angleDeg)){const x=r.quad.map(([N,B])=>[N-s,B-o]),M=yt.warpQuadToHorizontal(m,x);if(M){if(c=new OffscreenCanvas(M.width,M.height),h=c.getContext("2d"),!h)return null;m=new ImageData(new Uint8ClampedArray(M.data),M.width,M.height),h.putImageData(m,0,0)}}m.width>=16&&m.height>=12&&(Cr.cleanCropToMask(m),h.putImageData(m,0,0));const g=Lo.isVerticalCandidate(r,this.isCjkModel);let f=m.width,$=m.height,v=null;if(g){const x=Lo.rotateCropCCW(m);v=new OffscreenCanvas(x.width,x.height);const M=v.getContext("2d");if(!M)return null;const N=new Uint8ClampedArray(x.data);M.putImageData(new ImageData(N,x.width,x.height),0,0),f=x.width,$=x.height}const b=f/$;let w=Math.max(32,Math.min(960,Math.round(this.targetH*b)));w=Math.round(w/8)*8;const I=new OffscreenCanvas(w,this.targetH).getContext("2d");if(!I)return null;v?I.drawImage(v,0,0,f,$,0,0,w,this.targetH):I.drawImage(c,0,0,f,$,0,0,w,this.targetH);const S=I.getImageData(0,0,w,this.targetH),E=n1.analyzeRegion(S),C=E.isDark;return C&&Cr.invertRgb(S.data),{index:i,box:r,imageData:S,targetW:w,inverted:C,isDark:E.isDark,bgColor:E.bgHex,isVertical:g,text:"",confidence:0,decoded:!1}}async runBatched(t,r){const i=Tr.assignBuckets(t.map(n=>n.targetW));for(const[n,a]of i)for(let s=0;s<a.length;s+=Tr.MAX_BATCH){const o=a.slice(s,s+Tr.MAX_BATCH).map(c=>t[c]),u=ir.imageToRecTensorBatch(o.map(c=>c.imageData),n,this.targetH);let l=null;try{l=await this.session.run({[r]:u});const c=l[this.session.outputNames[0]],h=c.dims;if(h.length!==3)throw new Error(`Unexpected rec output dims: ${h.join("x")}`);const m=h[1],g=h[2],f=m*g,$=c.data;for(let v=0;v<o.length;v++){const b=$.subarray(v*f,(v+1)*f),w=this.ctcDecode(b,[1,m,g]);o[v].text=w.text,o[v].confidence=w.confidence,o[v].decoded=!0}}finally{if(u.dispose?.(),l)for(const c of Object.values(l))c.dispose?.()}}}async runSequential(t,r){for(const i of t)if(!i.decoded)try{const n=await this.runSingle(i,r);i.text=n.text,i.confidence=n.confidence,i.decoded=!0}catch(n){console.warn("[SpeedySlate] Rec inference error for box:",n)}}async runSingle(t,r){const i=ir.imageToRecTensor(t.imageData,t.targetW,this.targetH);let n=null;try{n=await this.session.run({[r]:i});const a=n[this.session.outputNames[0]];return this.ctcDecode(a.data,a.dims)}finally{if(i.dispose?.(),n)for(const a of Object.values(n))a.dispose?.()}}async retryLowConfidence(t,r){for(const i of t){if(!i.decoded||i.confidence>=.45)continue;const n=new ImageData(new Uint8ClampedArray(i.imageData.data),i.imageData.width,i.imageData.height);Cr.invertRgb(n.data);try{const a=await this.runSingle({...i,imageData:n},r);a.confidence>i.confidence&&(i.text=a.text,i.confidence=a.confidence,i.inverted=!i.inverted)}catch(a){console.warn("[SpeedySlate] Rec retry error for box:",a)}}}static cleanCropToMask(t){const r=t.data,i=t.width*t.height,n=new Uint8Array(i),a=new Int32Array(256);for(let B=0;B<i;B++){const U=B*4,O=(r[U]*299+r[U+1]*587+r[U+2]*114)/1e3|0;n[B]=O,a[O]++}let s=0;for(let B=0;B<256;B++)s+=B*a[B];let o=0,u=0,l=-1,c=128;for(let B=0;B<256;B++){if(u+=a[B],u===0)continue;const U=i-u;if(U===0)break;o+=B*a[B];const F=o/u,O=(s-o)/U,q=u*U*(F-O)*(F-O);q>l&&(l=q,c=B)}let h=0;for(let B=0;B<=c;B++)h+=a[B];if(c<20||c>235)return;const m=Math.min(h,i-h);if(m<i*.02||m>i*.45)return;const g=h<=i/2;let f=0,$=0,v=0,b=0,w=0,k=0;for(let B=0;B<i;B++){if(g?n[B]<=c:n[B]>c)continue;const F=B*4;f+=r[F],$+=r[F+1],v+=r[F+2],b+=n[B],w+=n[B]*n[B],k++}if(k===0||Math.sqrt(Math.max(0,w/k-(b/k)**2))<=30)return;const S=f/k,E=$/k,C=v/k,x=t.width,M=t.height,N=new Uint8Array(i);for(let B=0;B<i;B++)N[B]=(g?n[B]<=c:n[B]>c)?1:0;for(let B=0;B<M;B++)for(let U=0;U<x;U++){const F=B*x+U;if(N[F]){let q=0;for(let j=-1;j<=1;j++)for(let P=-1;P<=1;P++){if(!P&&!j)continue;const ie=U+P,ae=B+j;ie>=0&&ie<x&&ae>=0&&ae<M&&N[ae*x+ie]&&q++}if(q>=3)continue}const O=F*4;r[O]=S,r[O+1]=E,r[O+2]=C}}static invertRgb(t){for(let r=0;r<t.length;r+=4)t[r]=255-t[r],t[r+1]=255-t[r+1],t[r+2]=255-t[r+2]}ctcDecode(t,r){let i=0,n=0;if(r.length===3)i=r[1],n=r[2];else return{text:"",confidence:0};let a=[],s=-1,o=0,u=0;for(let c=0;c<i;c++){let h=-1/0,m=0;const g=c*n;for(let f=0;f<n;f++){const $=t[g+f];$>h&&(h=$,m=f)}if(m!==0&&m!==s){const f=m-1;f<this.characters.length&&(a.push(this.characters[f]),o+=h,u++)}s=m}const l=u>0?o/u:0;return{text:a.join(""),confidence:l}}}class Fn{static computeSliceHeights(t,r,i={}){const n=i.maxSliceHeight??2e3,a=i.overlap??200,s=i.aspectCap!==void 0?Math.min(n,Math.max(640,Math.round(t*i.aspectCap))):n;if(r<=s+200)return[{startY:0,h:r}];const o=Math.max(1,s-a),u=[];for(let l=0;l<r;l+=o)u.push({startY:l,h:Math.min(s,r-l)});return u}static async detectWithSlicing(t,r,i,n,a={}){const s=this.computeSliceHeights(r,i,a),o=await this.detectSlices(t,r,i,n,s,a.overlap??200,a.textMapOut);if(a.invertedPass){const u=this.findDarkRanges(t,r,i,o);if(u.length>0){const l=this.buildInverted(t,r,i),c=await this.detectSlices(l,r,i,n,u,0,a.textMapOut);for(const h of c)o.some(g=>this.calculateIoU(g,h)>.5)||o.push(h)}}return o.sort((u,l)=>u.y-l.y)}static async detectSlices(t,r,i,n,a,s,o){if(a.length===1&&a[0].h===i){const l=await n.detectText(t,r,i);return this.blitProbMap(n,o,r,0),l}const u=[];for(const l of a){const c=new OffscreenCanvas(r,l.h),h=c.getContext("2d");if(!h)continue;h.drawImage(t,0,l.startY,r,l.h,0,0,r,l.h);const m=await n.detectText(c,r,l.h);this.blitProbMap(n,o,r,l.startY);for(const g of m){const f={x:g.x,y:l.startY+g.y,width:g.width,height:g.height,confidence:g.confidence,kind:g.kind,...g.quad?{quad:g.quad.map(([$,v])=>[$,l.startY+v]),angleDeg:g.angleDeg}:{}};l.startY>0&&g.y<s+40&&u.some(v=>this.calculateIoU(v,f)>.35)||u.push(f)}}return u}static blitProbMap(t,r,i,n){const a=t.lastProbMap;if(!a||!r)return;const s=Math.round(a.h/a.ratioH),o=Math.min(i,Math.round(a.w/a.ratioW));for(let u=0;u<s;u++){const l=n+u;if(l*i>=r.length)break;const c=Math.min(a.h-1,Math.floor(u*a.ratioH)),h=l*i,m=c*a.w;for(let g=0;g<o;g++){const f=Math.min(a.w-1,Math.floor(g*a.ratioW)),$=a.data[m+f];$>r[h+g]&&(r[h+g]=$)}}}static findDarkRanges(t,r,i,n){const a=t.getContext("2d");if(!a)return[];const s=16,o=Math.ceil(r/s),u=Math.ceil(i/s),l=a.getImageData(0,0,r,i).data,c=new Int32Array(u);let h=0;for(let $=0;$<u;$++){const v=Math.min(i-1,$*s+(s>>1));for(let b=0;b<o;b++){const w=Math.min(r-1,b*s+(s>>1)),k=(v*r+w)*4;(l[k]*299+l[k+1]*587+l[k+2]*114)/1e3>=90||n.some(E=>w>=E.x&&w<=E.x+E.width&&v>=E.y&&v<=E.y+E.height)||(c[$]++,h++)}}if(h<8)return[];const m=[];let g=-1,f=-1;for(let $=0;$<=u;$++)if($<u&&c[$]>=2)g<0&&(g=$),f=$;else if(g>=0&&($===u||$-f>5)){const b=g*s,w=(f+1)*s-b;w>=48&&m.push({startY:b,h:Math.min(w,i-b)}),g=-1}return m}static buildInverted(t,r,i){const n=t.getContext("2d"),a=new OffscreenCanvas(r,i),s=a.getContext("2d");if(!n||!s)return t;const o=n.getImageData(0,0,r,i),u=o.data;for(let l=0;l<u.length;l+=4)u[l]=255-u[l],u[l+1]=255-u[l+1],u[l+2]=255-u[l+2];return s.putImageData(o,0,0),a}static calculateIoU(t,r){const i=Math.max(0,Math.min(t.x+t.width,r.x+r.width)-Math.max(t.x,r.x)),n=Math.max(0,Math.min(t.y+t.height,r.y+r.height)-Math.max(t.y,r.y)),a=i*n;if(a<=0)return 0;const s=t.width*t.height,o=r.width*r.height,u=s+o-a;return u>0?a/u:0}}function jn(e,t,r,i,n=!1){const a=new Uint8Array(i);let s=0;for(let v=0;v<i;v++)s+=e[v];if(s===0)return null;const o=s>i*.25;if(o)for(let v=0;v<r;v++)for(let b=0;b<t;b++){const w=v*t+b;if(!e[w])continue;let k=0;for(let I=-1;I<=1;I++)for(let S=-1;S<=1;S++){if(!S&&!I)continue;const E=b+S,C=v+I;E>=0&&E<t&&C>=0&&C<r&&e[C*t+E]&&k++}k>=3&&(a[w]=1)}else a.set(e);let u=0;for(let v=0;v<i;v++)u+=a[v];u===0&&a.set(e);const l=new Int32Array(i).fill(-1),c=[],h=[],m=[],g=new Int32Array(i);for(let v=0;v<i;v++){if(!a[v]||l[v]>=0)continue;const b=c.length;let w=0,k=0,I=0,S=t,E=0,C=r,x=0;for(l[v]=b,g[k++]=v;w<k;){const M=g[w++],N=M%t,B=M/t|0;I++,N<S&&(S=N),N>E&&(E=N),B<C&&(C=B),B>x&&(x=B),N>0&&a[M-1]&&l[M-1]<0&&(l[M-1]=b,g[k++]=M-1),N<t-1&&a[M+1]&&l[M+1]<0&&(l[M+1]=b,g[k++]=M+1),B>0&&a[M-t]&&l[M-t]<0&&(l[M-t]=b,g[k++]=M-t),B<r-1&&a[M+t]&&l[M+t]<0&&(l[M+t]=b,g[k++]=M+t)}c.push(I),h.push(E-S+1),m.push(x-C+1)}const f=n?i*.5:Math.min(700,i*.25);let $=0;for(let v=0;v<i;v++){const b=l[v];if(b<0)continue;const w=!n&&o&&(h[b]>t*.8&&m[b]<r*.5||m[b]>r*.8&&h[b]<t*.5);c[b]>f||w||o&&!n&&c[b]<5?a[v]=0:$++}return $>0?a:null}function Tc(e,t,r,i,n,a=4){const s=i*n,o=new Uint8Array(s);for(let f=0;f<s;f++)o[f]=!r[f]&&Math.abs(e[f]-t)>60?1:0;for(let f=0;f<5;f++){const $=o.slice();for(let v=0;v<n;v++)for(let b=0;b<i;b++){const w=v*i+b;$[w]||(b>0&&$[w-1]||b<i-1&&$[w+1]||v>0&&$[w-i]||v<n-1&&$[w+i])&&(o[w]=1)}}const u=new Uint8Array(s),l=new Int32Array(s);let c=0,h=0;const m=f=>{o[f]&&!u[f]&&(u[f]=1,l[h++]=f)};for(let f=0;f<i;f++)m(f),m((n-1)*i+f);for(let f=0;f<n;f++)m(f*i),m(f*i+i-1);for(;c<h;){const f=l[c++],$=f%i,v=f/i|0;$>0&&m(f-1),$<i-1&&m(f+1),v>0&&m(f-i),v<n-1&&m(f+i)}const g=u.slice();for(let f=0;f<a;f++){const $=g.slice();for(let v=0;v<n;v++)for(let b=0;b<i;b++){const w=v*i+b;$[w]||(b>0&&$[w-1]||b<i-1&&$[w+1]||v>0&&$[w-i]||v<n-1&&$[w+i])&&(g[w]=1)}}return g}const Ne=0,Cc=1,Kn=2,pa=1e6,ii=1e-6;class s1{keys;idxs;size=0;constructor(t){const r=Math.max(32,t);this.keys=new Float32Array(r),this.idxs=new Int32Array(r)}push(t,r){if(this.size>=this.keys.length){const n=this.keys.length*2,a=new Float32Array(n),s=new Int32Array(n);a.set(this.keys),s.set(this.idxs),this.keys=a,this.idxs=s}let i=this.size++;for(;i>0;){const n=i-1>>1;if(this.keys[n]<=t)break;this.keys[i]=this.keys[n],this.idxs[i]=this.idxs[n],i=n}this.keys[i]=t,this.idxs[i]=r}pop(){if(this.size===0)return-1;const t=this.idxs[0],r=this.keys[--this.size],i=this.idxs[this.size];if(this.size>0){let n=0;const a=this.size>>1;for(;n<a;){let s=(n<<1)+1;const o=s+1;if(o<this.size&&this.keys[o]<this.keys[s]&&(s=o),r<=this.keys[s])break;this.keys[n]=this.keys[s],this.idxs[n]=this.idxs[s],n=s}this.keys[n]=r,this.idxs[n]=i}return t}}function ni(e,t,r,i,n,a){const s=t&&n[e]===Ne,o=i&&n[r]===Ne;if(s&&o){const u=a[e],l=a[r],c=u-l,h=2-c*c;if(h>=0){const m=(u+l+Math.sqrt(h))*.5;if(m>=u&&m>=l)return m}return Math.min(u,l)+1}return s?a[e]+1:o?a[r]+1:pa}class nr{static computeDilationRadius(t){return Math.max(2,Math.min(5,Math.round(t*.1)))}static diffuseMaskedRegion(t,r,i,n,a){return nr.teleaInpaint(t,r,i,n,a,3)}static teleaInpaint(t,r,i,n,a,s=3){const o=n*a,u=new Float32Array(o*3),l=new Uint8Array(o),c=new Float32Array(o),h=new s1(o>>2);for(let f=0;f<o;f++){const $=f*4;u[f*3]=t[$],u[f*3+1]=t[$+1],u[f*3+2]=t[$+2],r[f]?(l[f]=Kn,c[f]=pa):(l[f]=Ne,c[f]=0)}for(let f=0;f<a;f++)for(let $=0;$<n;$++){const v=f*n+$;if(l[v]!==Kn)continue;($>0&&l[v-1]===Ne||$<n-1&&l[v+1]===Ne||f>0&&l[v-n]===Ne||f<a-1&&l[v+n]===Ne)&&(l[v]=Cc,c[v]=1,nr.inpaintPixel(v,$,f,n,a,s,l,c,u),h.push(1,v))}const m=[-1,1,-n,n];for(;h.size>0;){const f=h.pop();if(f<0||l[f]===Ne)continue;l[f]=Ne;const $=f%n,v=f/n|0;for(let b=0;b<4;b++){if(b===0&&$===0||b===1&&$===n-1||b===2&&v===0||b===3&&v===a-1)continue;const w=f+m[b];if(l[w]===Ne)continue;const k=w%n,I=w/n|0,S=Math.min(ni(w-n,I>0,w-1,k>0,l,c),ni(w-n,I>0,w+1,k<n-1,l,c),ni(w+n,I<a-1,w-1,k>0,l,c),ni(w+n,I<a-1,w+1,k<n-1,l,c));S<c[w]&&(c[w]=S),l[w]===Kn&&(nr.inpaintPixel(w,k,I,n,a,s,l,c,u),l[w]=Cc,h.push(c[w],w))}}const g=new Uint8ClampedArray(o*4);for(let f=0;f<o;f++){if(!i[f])continue;const $=f*4;g[$]=Math.max(0,Math.min(255,Math.round(u[f*3]))),g[$+1]=Math.max(0,Math.min(255,Math.round(u[f*3+1]))),g[$+2]=Math.max(0,Math.min(255,Math.round(u[f*3+2]))),g[$+3]=255}return g}static inpaintPixel(t,r,i,n,a,s,o,u,l){let c=0,h=0;r>0&&r<n-1&&o[t-1]===Ne&&o[t+1]===Ne?c=(u[t+1]-u[t-1])*.5:r>0&&o[t-1]===Ne?c=u[t]-u[t-1]:r<n-1&&o[t+1]===Ne&&(c=u[t+1]-u[t]),i>0&&i<a-1&&o[t-n]===Ne&&o[t+n]===Ne?h=(u[t+n]-u[t-n])*.5:i>0&&o[t-n]===Ne?h=u[t]-u[t-n]:i<a-1&&o[t+n]===Ne&&(h=u[t+n]-u[t]);const m=Math.hypot(c,h);m>ii&&(c/=m,h/=m);const g=s*s,f=Math.max(0,i-s),$=Math.min(a-1,i+s),v=Math.max(0,r-s),b=Math.min(n-1,r+s);let w=0,k=0,I=0,S=0;const E=u[t]<pa?u[t]:1;for(let C=f;C<=$;C++){const x=i-C;for(let M=v;M<=b;M++){const N=r-M,B=N*N+x*x;if(B===0||B>g)continue;const U=C*n+M;if(o[U]!==Ne)continue;const F=Math.sqrt(B),O=m>ii?Math.max(ii,Math.abs(N*c+x*h)/F):1,q=1/(B*F),j=1/(1+Math.abs(E-u[U])),P=O*q*j,ie=U*3;let ae=0,Q=0,A=0;M>0&&M<n-1&&o[U-1]===Ne&&o[U+1]===Ne&&(ae=Math.max(-40,Math.min(40,(l[ie+3]-l[ie-3])*.5)),Q=Math.max(-40,Math.min(40,(l[ie+4]-l[ie-2])*.5)),A=Math.max(-40,Math.min(40,(l[ie+5]-l[ie-1])*.5)));let W=0,G=0,Z=0;if(C>0&&C<a-1&&o[U-n]===Ne&&o[U+n]===Ne){const ce=(U-n)*3,we=(U+n)*3;W=Math.max(-40,Math.min(40,(l[we]-l[ce])*.5)),G=Math.max(-40,Math.min(40,(l[we+1]-l[ce+1])*.5)),Z=Math.max(-40,Math.min(40,(l[we+2]-l[ce+2])*.5))}w+=P*(l[ie]+ae*N+W*x),k+=P*(l[ie+1]+Q*N+G*x),I+=P*(l[ie+2]+A*N+Z*x),S+=P}}S>ii&&(l[t*3]=w/S,l[t*3+1]=k/S,l[t*3+2]=I/S)}}class mi{static buildPatch(t,r,i,n,a,s,o){const u=t.width,l=t.height,c=u*l;if(c<16)return null;const h=t.data,m=new Uint8Array(c),g=new Int32Array(256);for(let Y=0;Y<c;Y++){const J=Y*4,re=(h[J]*299+h[J+1]*587+h[J+2]*114)/1e3;m[Y]=re|0,g[re|0]++}let f=0;for(let Y=0;Y<256;Y++)f+=Y*g[Y];let $=0,v=0,b=-1,w=128;for(let Y=0;Y<256;Y++){if(v+=g[Y],v===0)continue;const J=c-v;if(J===0)break;$+=Y*g[Y];const re=$/v,ee=(f-$)/J,oe=v*J*(re-ee)*(re-ee);oe>b&&(b=oe,w=Y)}let k=0;for(let Y=0;Y<=w;Y++)k+=g[Y];const I=new Uint8ClampedArray(c*4),S=(Y,J)=>{const re=mi.hexToRgb(J);if(!re)return null;for(let ee=0;ee<c;ee++){if(!Y[ee])continue;const oe=ee*4;I[oe]=re[0],I[oe+1]=re[1],I[oe+2]=re[2],I[oe+3]=255}return{x:r,y:i,width:u,height:l,pixels:I,dbg:{path:"rawflat",guided:M}}},E=mi.hexToRgb(n),C=new Uint8Array(c);if(E){const Y=(E[0]*299+E[1]*587+E[2]*114)/1e3;for(let J=0;J<c;J++)C[J]=Math.abs(m[J]-Y)>60?1:0}else{const Y=k<=c/2;for(let J=0;J<c;J++)C[J]=(Y?m[J]<=w:m[J]>w)?1:0}const x=new Uint8Array(c);if(E){const Y=k<=c/2;for(let J=0;J<c;J++)x[J]=(Y?m[J]<=w:m[J]>w)?1:0}let M=!1;const N=new Uint8Array(c),B=new Float32Array(c);let U=128,F=0;if(a&&s){let Y=0;for(let J=0;J<c;J++){const re=i+(J/u|0),ee=r+J%u;B[J]=a[re*s+ee]||0,B[J]>F&&(F=B[J]),B[J]>.3&&Y++}if(Y>c*.01){M=!0;const J=Math.max(4,Math.min(10,Math.round(l*.16)));for(let ee=0;ee<c;ee++)N[ee]=B[ee]>.1?1:0;for(let ee=0;ee<J;ee++){const oe=N.slice();for(let he=0;he<l;he++)for(let D=0;D<u;D++){const K=he*u+D;oe[K]||(D>0&&oe[K-1]||D<u-1&&oe[K+1]||he>0&&oe[K-u]||he<l-1&&oe[K+u])&&(N[K]=1)}}const re=[];for(let ee=0;ee<c;ee++)N[ee]||re.push(m[ee]);re.sort((ee,oe)=>ee-oe),U=re.length>c*.05?re[re.length/2|0]:E?(E[0]*299+E[1]*587+E[2]*114)/1e3:128;for(let ee=0;ee<c;ee++)C[ee]=N[ee]&&Math.abs(m[ee]-U)>25?1:0,N[ee]||(x[ee]=0)}}if(o&&o.length===4)for(let Y=0;Y<c;Y++)yt.pointInQuad(Y%u,Y/u|0,o)||(C[Y]=0,x[Y]=0);let O=jn(C,u,l,c,M);if(!O&&E&&(O=jn(x,u,l,c,M)),!O){let Y=!1;for(let ee=0;ee<c;ee++)if(C[ee]||x[ee]){Y=!0;break}if(!Y)return null;const J=new Uint8Array(c);for(let ee=0;ee<c;ee++)J[ee]=C[ee]|x[ee];const re=new Uint8Array(c);for(let ee=0;ee<l;ee++)for(let oe=0;oe<u;oe++){const he=ee*u+oe;if(J[he])for(let D=-1;D<=1;D++)for(let K=-1;K<=1;K++){const le=oe+K,Ae=ee+D;le>=0&&le<u&&Ae>=0&&Ae<l&&(re[Ae*u+le]=1)}}return S(re,n)}const q=nr.computeDilationRadius(l),j=new Uint8Array(c);j.set(O);for(let Y=0;Y<q;Y++){const J=j.slice();for(let re=0;re<l;re++)for(let ee=0;ee<u;ee++){const oe=re*u+ee;if(J[oe])for(let he=-1;he<=1;he++)for(let D=-1;D<=1;D++){const K=ee+D,le=re+he;K>=0&&K<u&&le>=0&&le<l&&(j[le*u+K]=1)}}}const P=new Uint8Array(c);if(M){const Y=new Uint8Array(c);for(let re=0;re<c;re++)Y[re]=B[re]>.3&&Math.abs(m[re]-U)>40?1:0;const J=jn(Y,u,l,c,!0);if(J){P.set(J);for(let re=0;re<4;re++){const ee=P.slice();for(let oe=0;oe<l;oe++)for(let he=0;he<u;he++){const D=oe*u+he;if(ee[D])for(let K=-1;K<=1;K++)for(let le=-1;le<=1;le++){const Ae=he+le,Pe=oe+K;Ae>=0&&Ae<u&&Pe>=0&&Pe<l&&(P[Pe*u+Ae]=1)}}}}}const ie=new Uint8Array(c);ie.set(N);for(let Y=0;Y<4;Y++){const J=ie.slice();for(let re=0;re<l;re++)for(let ee=0;ee<u;ee++){const oe=re*u+ee;if(J[oe])for(let he=-1;he<=1;he++)for(let D=-1;D<=1;D++){const K=ee+D,le=re+he;K>=0&&K<u&&le>=0&&le<l&&(ie[le*u+K]=1)}}}const ae=new Uint8Array(c),Q=j.slice();for(let Y=0;Y<4;Y++){const J=Q.slice();for(let re=0;re<l;re++)for(let ee=0;ee<u;ee++){const oe=re*u+ee;if(J[oe])for(let he=-1;he<=1;he++)for(let D=-1;D<=1;D++){const K=ee+D,le=re+he;K>=0&&K<u&&le>=0&&le<l&&(Q[le*u+K]=1)}}}for(let Y=0;Y<c;Y++)ae[Y]=Q[Y]&&!j[Y]?1:0;let A=-1,W=-1;const G=[];for(let Y=0;Y<c;Y++)ae[Y]&&G.push(m[Y]);if(G.length>20){G.sort((K,le)=>K-le);const Y=G[G.length/2|0];let J=0,re=0,ee=0,oe=0,he=0,D=0;for(let K=0;K<c;K++){if(!ae[K]||Math.abs(m[K]-Y)>40)continue;const le=K*4;re+=h[le],ee+=h[le+1],oe+=h[le+2],he+=m[K],D+=m[K]*m[K],J++}if(J>20){const K=he/J,le=Math.sqrt(Math.max(0,D/J-K*K));let Ae=0,Pe=0;for(let X=0;X<c;X++){if(!Q[X])continue;Pe++,!(M?!!P[X]:!!j[X])&&Math.abs(m[X]-Y)>40&&Ae++}const De=Pe?Ae/Pe:0;if(A=De,W=le,le<20&&De<.08){const X=Tc(m,Y,Q,u,l,0);for(let fe=0;fe<c;fe++){if(!Q[fe]||X[fe]&&Math.abs(m[fe]-Y)>45)continue;const ve=fe*4;I[ve]=re/J,I[ve+1]=ee/J,I[ve+2]=oe/J,I[ve+3]=255}return{x:r,y:i,width:u,height:l,pixels:I,dbg:{path:"flat",risky:De,std:le,guided:M}}}}}const Z={path:M?"donor-tex":"donor",guided:M,risky:A,std:W,tmMax:F};let ce=j;if(M){let Y=!1;for(let J=0;J<c;J++)if(P[J]){Y=!0;break}if(Y){const J=Tc(m,U,j,u,l),re=P.slice();for(let ee=0;ee<2;ee++){const oe=re.slice();for(let he=0;he<l;he++)for(let D=0;D<u;D++){const K=he*u+D;oe[K]||(D>0&&oe[K-1]||D<u-1&&oe[K+1]||he>0&&oe[K-u]||he<l-1&&oe[K+u])&&(re[K]=1)}}ce=new Uint8Array(c);for(let ee=0;ee<c;ee++){const oe=j[ee]&&!P[ee]&&B[ee]<.12&&Math.abs(m[ee]-U)>40;ce[ee]=oe&&J[ee]&&!re[ee]?0:j[ee]}}}const we=nr.teleaInpaint(h,j,ce,u,l,3);return{x:r,y:i,width:u,height:l,pixels:we,dbg:Z}}static hexToRgb(t){return!t||!/^#[0-9a-fA-F]{6}$/.test(t)?null:[parseInt(t.slice(1,3),16),parseInt(t.slice(3,5),16),parseInt(t.slice(5,7),16)]}}class o1{static buildBubblePatch(t,r,i,n){const a=t.width,s=t.height,o=a*s,u=t.data,l=new Uint8Array(o);for(let D=0;D<o;D++){const K=D*4;l[D]=u[K]*77+u[K+1]*150+u[K+2]*29>>8}const c=[],h=Math.floor(a*.25),m=Math.ceil(a*.75),g=Math.floor(s*.25),f=Math.ceil(s*.75);for(let D=g;D<f;D++)for(let K=h;K<m;K++)c.push(l[D*a+K]);c.sort((D,K)=>D-K);const $=c.length>0?c[c.length>>1]:240,v=new Uint8Array(o);for(let D=0;D<o;D++)Math.abs(l[D]-$)>45&&(v[D]=1);const b=new Uint8Array(o);for(let D=0;D<s;D++)for(let K=0;K<a;K++){const le=D*a+K;if(v[le])for(let Ae=-1;Ae<=1;Ae++){const Pe=D+Ae;if(!(Pe<0||Pe>=s))for(let De=-1;De<=1;De++){const X=K+De;X>=0&&X<a&&(b[Pe*a+X]=1)}}}const w=new Uint8Array(o),k=new Int32Array(o);let I=0,S=0;const E=Math.floor(a*.3),C=Math.ceil(a*.7),x=Math.floor(s*.3),M=Math.ceil(s*.7);for(let D=x;D<M;D++)for(let K=E;K<C;K++){const le=D*a+K;!b[le]&&!w[le]&&(w[le]=1,k[S++]=le)}let N=0;for(;I<S;){const D=k[I++],K=D%a,le=D/a|0;(K===0||K===a-1||le===0||le===s-1)&&N++,K>0&&!b[D-1]&&!w[D-1]&&(w[D-1]=1,k[S++]=D-1),K<a-1&&!b[D+1]&&!w[D+1]&&(w[D+1]=1,k[S++]=D+1),le>0&&!b[D-a]&&!w[D-a]&&(w[D-a]=1,k[S++]=D-a),le<s-1&&!b[D+a]&&!w[D+a]&&(w[D+a]=1,k[S++]=D+a)}if(S<o*.08||N>2)return null;const U=new Uint8Array(o),F=new Int32Array(o);let O=0,q=0;const j=D=>{!w[D]&&!U[D]&&(U[D]=1,F[q++]=D)};for(let D=0;D<a;D++)j(D),j((s-1)*a+D);for(let D=0;D<s;D++)j(D*a),j(D*a+a-1);for(;O<q;){const D=F[O++],K=D%a,le=D/a|0;K>0&&!w[D-1]&&!U[D-1]&&(U[D-1]=1,F[q++]=D-1),K<a-1&&!w[D+1]&&!U[D+1]&&(U[D+1]=1,F[q++]=D+1),le>0&&!w[D-a]&&!U[D-a]&&(U[D-a]=1,F[q++]=D-a),le<s-1&&!w[D+a]&&!U[D+a]&&(U[D+a]=1,F[q++]=D+a)}let P=0,ie=0,ae=0,Q=0,A=0,W=0;for(let D=0;D<o;D++){if(!w[D]||v[D])continue;const K=l[D];ie+=K,ae+=K*K;const le=D*4;Q+=u[le],A+=u[le+1],W+=u[le+2],P++}if(P===0)return null;const G=ie/P,Z=Math.sqrt(Math.max(0,ae/P-G*G));if(Z>25)return null;const ce=new Uint8Array(o);if(n&&n.length>0)for(const D of n){const K=Math.max(0,Math.floor(D.x-r-25)),le=Math.max(0,Math.floor(D.y-i-25)),Ae=Math.min(a,Math.ceil(D.x-r+D.width+25)),Pe=Math.min(s,Math.ceil(D.y-i+D.height+25));for(let De=le;De<Pe;De++)ce.fill(1,De*a+K,De*a+Ae)}else ce.fill(1);let we=0,Y=0,J=0;for(let D=0;D<o;D++){if(U[D]||!ce[D])continue;we++,v[D]&&Y++;const K=D%a,le=D/a|0;(K>0&&!ce[D-1]&&!U[D-1]||K<a-1&&!ce[D+1]&&!U[D+1]||le>0&&!ce[D-a]&&!U[D-a]||le<s-1&&!ce[D+a]&&!U[D+a])&&J++}if(we<o*.05||Y>we*.4||J>4)return null;const re=new Uint8ClampedArray(o*4),ee=Q/P,oe=A/P,he=W/P;for(let D=0;D<o;D++){if(U[D]||!ce[D])continue;const K=D%a,le=D/a|0;if(K>0&&v[D-1]&&U[D-1]||K<a-1&&v[D+1]&&U[D+1]||le>0&&v[D-a]&&U[D-a]||le<s-1&&v[D+a]&&U[D+a])continue;const Ae=D*4;re[Ae]=ee,re[Ae+1]=oe,re[Ae+2]=he,re[Ae+3]=255}return{x:r,y:i,width:a,height:s,pixels:re,dbg:{path:"bubble",guided:!0,risky:Y/we,std:Z,tmMax:0}}}}const u1=1<<20;class tr{static extractChamber(t,r,i,n){const{data:a,width:s,height:o}=t,u=s*o;if(s<20||o<20||n.width<8||n.height<8)return null;const l=Math.max(0,Math.floor(n.x-r)),c=Math.max(0,Math.floor(n.y-i)),h=Math.min(s-1,Math.ceil(n.x+n.width-r)-1),m=Math.min(o-1,Math.ceil(n.y+n.height-i)-1);if(h<=l||m<=c)return null;const g=new Uint8Array(u);for(let X=0;X<u;X++){const fe=X*4;g[X]=a[fe]*77+a[fe+1]*150+a[fe+2]*29>>8}const f=new Int32Array(16);for(let X=c;X<=m;X++)for(let fe=l;fe<=h;fe++)f[g[X*s+fe]>>4]++;let $=0;for(let X=1;X<16;X++)f[X]>f[$]&&($=X);if($>5&&$<9)return null;const v=$<=5,b=[];for(let X=c;X<=m;X++)for(let fe=l;fe<=h;fe++){const ve=g[X*s+fe];Math.abs((ve>>4)-$)<=2&&b.push(ve)}if(b.length<8)return null;b.sort((X,fe)=>X-fe);const w=b[b.length>>1],k=new Uint8Array(u);if(v){const X=Math.min(85,w+22);for(let fe=0;fe<u;fe++)g[fe]<=X&&(k[fe]=1)}else{const X=Math.max(155,w-22);for(let fe=0;fe<u;fe++)g[fe]>=X&&(k[fe]=1)}const I=new Uint8Array(u),S=new Int32Array(u);let E=0,C=0;for(let X=c;X<=m;X++)for(let fe=l;fe<=h;fe++){const ve=X*s+fe;k[ve]&&!I[ve]&&(I[ve]=1,S[C++]=ve)}if(C<12)return null;let x=s,M=o,N=0,B=0,U=0;for(;E<C;){const X=S[E++],fe=X%s,ve=X/s|0;fe<x&&(x=fe),fe>N&&(N=fe),ve<M&&(M=ve),ve>B&&(B=ve),(fe===0||fe===s-1||ve===0||ve===o-1)&&U++,fe>0&&k[X-1]&&!I[X-1]&&(I[X-1]=1,S[C++]=X-1),fe<s-1&&k[X+1]&&!I[X+1]&&(I[X+1]=1,S[C++]=X+1),ve>0&&k[X-s]&&!I[X-s]&&(I[X-s]=1,S[C++]=X-s),ve<o-1&&k[X+s]&&!I[X+s]&&(I[X+s]=1,S[C++]=X+s)}const F=2*(s+o);if(U>F*.35||N-x+1>=s*.96&&B-M+1>=o*.96)return null;const O=new Uint8Array(u);E=0,C=0;const q=X=>{!I[X]&&!O[X]&&(O[X]=1,S[C++]=X)};for(let X=0;X<s;X++)q(X),q((o-1)*s+X);for(let X=0;X<o;X++)q(X*s),q(X*s+s-1);for(;E<C;){const X=S[E++],fe=X%s,ve=X/s|0;fe>0&&!I[X-1]&&!O[X-1]&&(O[X-1]=1,S[C++]=X-1),fe<s-1&&!I[X+1]&&!O[X+1]&&(O[X+1]=1,S[C++]=X+1),ve>0&&!I[X-s]&&!O[X-s]&&(O[X-s]=1,S[C++]=X-s),ve<o-1&&!I[X+s]&&!O[X+s]&&(O[X+s]=1,S[C++]=X+s)}const j=new Uint8Array(u);for(let X=0;X<u;X++)j[X]=O[X]?0:1;const P=tr.chamferDistance(j,s,o,0),ie=Math.min(N-x+1,B-M+1);let ae=Math.max(6,Math.min(14,Math.round(ie*.11))),Q=tr.extractSeededCore(P,ae*3,l,c,h,m,s,o);if(!Q&&ae>5&&(ae=Math.max(4,ae>>1),Q=tr.extractSeededCore(P,ae*3,l,c,h,m,s,o)),!Q)return null;const A=tr.chamferDistance(Q,s,o,1),W=(ae+1)*3;let G=s,Z=o,ce=0,we=0,Y=0;for(let X=0;X<u;X++){if(!j[X]||A[X]>W)continue;const fe=X%s,ve=X/s|0;fe<G&&(G=fe),fe>ce&&(ce=fe),ve<Z&&(Z=ve),ve>we&&(we=ve),Y++}if(Y<64||ce<=G||we<=Z)return null;const J=ce-G+1,re=we-Z+1,ee=Y/(J*re),oe=(l+h)*.5,he=(c+m)*.5,D=(G+ce)*.5,K=(Z+we)*.5;if(Math.abs(D-oe)>J*.3||Math.abs(K-he)>re*.3)return null;const le=Math.min(G,l),Ae=Math.min(Z,c),Pe=Math.max(ce,h),De=Math.max(we,m);return{chamberBox:{x:r+le,y:i+Ae,width:Pe-le+1,height:De-Ae+1},isOval:ee<.88}}static chamferDistance(t,r,i,n){const a=r*i,s=new Int32Array(a);for(let o=0;o<a;o++)s[o]=t[o]===n?0:u1;for(let o=0;o<i;o++)for(let u=0;u<r;u++){const l=o*r+u;let c=s[l];u>0&&s[l-1]+3<c&&(c=s[l-1]+3),o>0&&(s[l-r]+3<c&&(c=s[l-r]+3),u>0&&s[l-r-1]+4<c&&(c=s[l-r-1]+4),u<r-1&&s[l-r+1]+4<c&&(c=s[l-r+1]+4)),s[l]=c}for(let o=i-1;o>=0;o--)for(let u=r-1;u>=0;u--){const l=o*r+u;let c=s[l];u<r-1&&s[l+1]+3<c&&(c=s[l+1]+3),o<i-1&&(s[l+r]+3<c&&(c=s[l+r]+3),u<r-1&&s[l+r+1]+4<c&&(c=s[l+r+1]+4),u>0&&s[l+r-1]+4<c&&(c=s[l+r-1]+4)),s[l]=c}return s}static extractSeededCore(t,r,i,n,a,s,o,u){const l=o*u,c=new Uint8Array(l),h=new Int32Array(l);let m=0,g=0;for(let f=n;f<=s;f++)for(let $=i;$<=a;$++){const v=f*o+$;t[v]>=r&&!c[v]&&(c[v]=1,h[g++]=v)}if(g===0)return null;for(;m<g;){const f=h[m++],$=f%o,v=f/o|0;$>0&&t[f-1]>=r&&!c[f-1]&&(c[f-1]=1,h[g++]=f-1),$<o-1&&t[f+1]>=r&&!c[f+1]&&(c[f+1]=1,h[g++]=f+1),v>0&&t[f-o]>=r&&!c[f-o]&&(c[f-o]=1,h[g++]=f-o),v<u-1&&t[f+o]>=r&&!c[f+o]&&(c[f+o]=1,h[g++]=f+o)}return c}}class l1{static recoverMissedLines(t,r){const{data:i,width:n,height:a}=t;if(r.length===0||n<24||a<24)return[];const s=new Uint8Array(n*a);for(let l=0;l<n*a;l++){const c=l*4;s[l]=i[c]*77+i[c+1]*150+i[c+2]*29>>8}const o=this.clusterVerticalStacks(r),u=[];for(const l of o){const c=Math.max(0,Math.min(...l.map(A=>A.x))),h=Math.max(0,Math.min(...l.map(A=>A.y))),m=Math.min(n-1,Math.max(...l.map(A=>A.x+A.width-1))),g=Math.min(a-1,Math.max(...l.map(A=>A.y+A.height-1)));if(m-c<14||g-h<10)continue;const f=l.reduce((A,W)=>A+W.height,0)/Math.max(1,l.length);if(f>65)continue;const $=[];for(let A=h;A<=g;A+=2)for(let W=c;W<=m;W+=2)$.push(s[A*n+W]);if($.length<12)continue;$.sort((A,W)=>A-W);const v=$[Math.floor($.length*.7)],b=$[Math.floor($.length*.3)];let w;if(v>=215)w=v;else if(b<=45)w=b;else continue;const k=Math.max(0,c-34),I=Math.min(n-1,m+34),S=Math.max(0,Math.round(h-Math.min(90,Math.max(46,f*3.5)))),E=Math.min(a-1,Math.round(g+Math.min(125,Math.max(65,f*4.8)))),C=I-k+1,x=E-S+1;if(C<16||x<24)continue;const M=new Uint8Array(C*x),N=new Int32Array(C*x);let B=0,U=0;const F=A=>Math.abs(A-w)<=28;for(let A=h;A<=g;A++)for(let W=c;W<=m;W++){if(!F(s[A*n+W]))continue;const G=(A-S)*C+(W-k);M[G]||(M[G]=1,N[U++]=G)}if(U<20)continue;let O=0;for(;B<U;){const A=N[B++],W=A%C,G=A/C|0;(W===0||W===C-1)&&O++;const Z=k+W,ce=S+G;W>0&&!M[A-1]&&F(s[ce*n+Z-1])&&(M[A-1]=1,N[U++]=A-1),W<C-1&&!M[A+1]&&F(s[ce*n+Z+1])&&(M[A+1]=1,N[U++]=A+1),G>0&&!M[A-C]&&F(s[(ce-1)*n+Z])&&(M[A-C]=1,N[U++]=A-C),G<x-1&&!M[A+C]&&F(s[(ce+1)*n+Z])&&(M[A+C]=1,N[U++]=A+C)}if(O>x*.45)continue;const q=new Int16Array(x).fill(C),j=new Int16Array(x).fill(-1);for(let A=0;A<x;A++){const W=A*C;for(let G=0;G<C;G++)M[W+G]&&(G<q[A]&&(q[A]=G),G>j[A]&&(j[A]=G))}const P=new Int16Array(x),ie=new Int16Array(x),ae=A=>r.some(W=>A>=W.y-2&&A<=W.y+W.height+2&&W.x<I&&W.x+W.width>k);for(let A=0;A<x;A++){const W=S+A;if(ae(W))continue;let G=C,Z=-1;for(let J=-5;J<=5;J++){const re=A+J;re>=0&&re<x&&j[re]>=q[re]&&(q[re]<G&&(G=q[re]),j[re]>Z&&(Z=j[re]))}const ce=G+2,we=Z-2;if(we-ce<8)continue;ie[A]=we-ce+1;let Y=0;for(let J=ce;J<=we;J++)Math.abs(s[W*n+(k+J)]-w)>55&&Y++;P[A]=Y}let Q=-1;for(let A=0;A<=x;A++){const W=A<x?ie[A]:0,G=A<x?P[A]:0,Z=W>=8&&G>=Math.max(2,Math.round(W*.04))&&G<=W*.9;if(Z&&Q<0)Q=A;else if(!Z&&Q>=0){const ce=A-Q;if(ce>=8&&ce<=Math.max(30,f*1.85)){const we=this.buildBandBox(s,n,a,k,S,Q,A-1,q,j,x,C,w);we&&!r.some(Y=>this.overlapRatio(Y,we)>.2)&&!u.some(Y=>this.overlapRatio(Y,we)>.2)&&u.push(we)}Q=-1}}}return u}static buildBandBox(t,r,i,n,a,s,o,u,l,c,h,m){let g=h,f=-1;for(let x=Math.max(0,s-5);x<=Math.min(c-1,o+5);x++)l[x]>=u[x]&&(u[x]<g&&(g=u[x]),l[x]>f&&(f=l[x]));const $=g+2,v=f-2;if(v-$<10)return null;let b=h,w=-1,k=0;for(let x=s;x<=o;x++){const M=a+x;for(let N=$;N<=v;N++)Math.abs(t[M*r+(n+N)]-m)>60&&(N<b&&(b=N),N>w&&(w=N),k++)}if(w-b<6||k<8)return null;const I=Math.max(0,n+b-5),S=Math.max(0,a+s-4),E=Math.min(r,n+w+6),C=Math.min(i,a+o+5);return{x:I,y:S,width:E-I,height:C-S,confidence:.75,kind:"dialogue"}}static clusterVerticalStacks(t){const r=t.filter(a=>a.kind!=="sfx").sort((a,s)=>a.y-s.y),i=new Set,n=[];for(let a=0;a<r.length;a++){if(i.has(a))continue;const s=[r[a]];i.add(a);let o=!0;for(;o;){o=!1;const u=s[s.length-1],l=u.x+u.width*.5;for(let c=0;c<r.length;c++){if(i.has(c))continue;const h=r[c],m=h.y-(u.y+u.height),g=Math.max(u.height,h.height);if(m<-u.height*.5||m>g*2.8)continue;const f=Math.max(0,Math.min(u.x+u.width,h.x+h.width)-Math.max(u.x,h.x)),$=Math.max(1,Math.min(u.width,h.width)),v=Math.max(1,Math.max(u.width,h.width)),b=h.x+h.width*.5;if(f/$>=.25||Math.abs(l-b)/v<=.45){s.push(h),i.add(c),o=!0;break}}}n.push(s)}return n}static overlapRatio(t,r){const i=Math.max(0,Math.min(t.x+t.width,r.x+r.width)-Math.max(t.x,r.x)),n=Math.max(0,Math.min(t.y+t.height,r.y+r.height)-Math.max(t.y,r.y)),a=i*n;return a<=0?0:a/Math.max(1,Math.min(t.width*t.height,r.width*r.height))}}const d1=self.location.href.substring(0,self.location.href.lastIndexOf("/")+1);Ee.wasm.wasmPaths=d1;Ee.wasm.numThreads=self.crossOriginIsolated?Math.min(4,Math.max(1,(self.navigator?.hardwareConcurrency??2)-1)):1;Ee.wasm.simd=!0;Ee.webgpu={...Ee.webgpu||{},powerPreference:"high-performance"};Ee.logLevel="error";let Qt=null,Xt=null,xr=null,Ec=null,zc="wasm",Mc=Promise.resolve();async function Zn(e,t,r){try{const i=await rr.create(e,{...t,executionProviders:["webgpu"]});if(r&&i.inputNames.length>0){const n=i.inputNames[0],a=r.reduce((u,l)=>u*l,1),s=new Ve("float32",new Float32Array(a),r);let o=null;try{o=await i.run({[n]:s})}catch(u){throw await i.release?.().catch(()=>{}),u}finally{if(s.dispose?.(),o)for(const u of Object.values(o))u.dispose?.()}}return i}catch(i){return console.warn("[OCR Worker] WebGPU session creation/kernel validation failed, falling back to WASM:",i?.message),null}}self.onmessage=e=>{const t=e.data,r=t._reqId,i=n=>self.postMessage({...n,_reqId:r});Mc=Mc.then(async()=>{try{switch(t.type){case"PING":{i({type:"PONG",success:!0});break}case"INIT_MODEL":{if(!t.detBuffer||!t.recBuffer||!t.keysText)throw new Error("Thiếu dữ liệu buffer hoặc keys để khởi tạo model.");await Qt?.release?.().catch(()=>{}),await Xt?.release?.().catch(()=>{}),await xr?.release?.().catch(()=>{}),Qt=null,Xt=null,xr=null;const n={graphOptimizationLevel:"all",logSeverityLevel:3};let a=null,s=null,o=!1,u=!1;const l=!!(t.modelId&&t.modelId.includes("comic")),c={...n,executionProviders:["wasm"]};if(t.useWebGpu!==!1&&!l&&(a=await Zn(t.detBuffer,n,[1,3,48,48]),a&&(o=!0)),a||(a=await rr.create(t.detBuffer,c)),t.useWebGpu!==!1&&(s=await Zn(t.recBuffer,n,[1,3,48,64]),s&&(u=!0)),s||(s=await rr.create(t.recBuffer,c)),zc=o||u?"webgpu":"wasm",Qt=a.inputNames.includes("orig_target_sizes")||a.inputNames.includes("images")||!!(t.modelId&&t.modelId.includes("comic"))?new Sc(a):new Ic(a),Xt=null,t.det2Buffer)try{const m=(t.useWebGpu!==!1?await Zn(t.det2Buffer,n,[1,3,64,64]):null)??await rr.create(t.det2Buffer,c);Xt=new Ic(m,{thresh:.3,boxThresh:.35,unclipRatio:1.3})}catch(m){console.warn("[OCR Worker] Supplementary det session failed:",m)}xr=new Cr(s,t.keysText,{isCjkModel:/japan|korean|chinese|cjk|multilingual|v6/i.test(t.modelId??"")}),Ec=t.modelId||"loaded",i({type:"INIT_RESULT",success:!0,modelId:Ec,backend:zc});break}case"PROCESS_IMAGE":{if(!Qt||!xr)throw new Error("Model PaddleOCR chưa được nạp. Hãy khởi tạo trước khi nhận diện.");if(!t.imageBitmap)throw new Error("Thiếu ImageBitmap cần nhận diện.");const n=t.imageBitmap;try{const a=n.width,s=n.height,o=new OffscreenCanvas(a,s),u=o.getContext("2d");if(!u)throw new Error("Không thể tạo 2D context trong Worker");u.drawImage(n,0,0);const l=performance.now(),c=Qt instanceof Sc,h=new Float32Array(a*s),m=await Fn.detectWithSlicing(o,a,s,Qt,{aspectCap:c?s<=2200?.85:1.8:void 0,invertedPass:c,textMapOut:h});if(Xt){const S=await Fn.detectWithSlicing(o,a,s,Xt,{textMapOut:h});for(const E of S)if(!m.some(x=>Fn.calculateIoU(x,E)>.5))if(E.height>=34&&E.width>=28){const x=ca.segmentLines(u,E,a,s);for(const M of x)m.push({...M,kind:"free"})}else m.push({...E,kind:"free"});m.sort((E,C)=>E.y-C.y)}const g=[];for(const S of m)if(S.kind!=="free"&&S.height>=42&&S.height<=S.width*2.2){const E=ca.segmentLines(u,S,a,s);for(const C of E)g.push({...C,kind:S.kind})}else g.push(S);m.length=0,m.push(...g);const f=u.getImageData(0,0,a,s),$=l1.recoverMissedLines(f,m);if($.length>0)for(const S of $){m.push(S);const E=Math.max(0,S.x+5),C=Math.min(a-1,S.x+S.width-6),x=Math.max(0,S.y+3),M=Math.min(s-1,S.y+S.height-4);for(let N=x;N<=M;N++)for(let B=E;B<=C;B++)h[N*a+B]<.85&&(h[N*a+B]=.85)}m.sort((S,E)=>S.y-E.y);const v=performance.now()-l,b=performance.now(),k=(await xr.recognizeBoxes(o,m)).filter(S=>$.some(C=>Math.abs(C.x-S.box.x)<=2&&Math.abs(C.y-S.box.y)<=2)?(S.originalText.match(/\p{L}/gu)||[]).length>=2:!0),I=performance.now()-b;c1(o,k,h),i({type:"PROCESS_RESULT",success:!0,elementId:t.elementId,dialogues:k,timings:{detMs:Math.round(v),recMs:Math.round(I),boxCount:m.length}})}finally{n.close()}break}default:throw new Error(`Thông điệp worker không hỗ trợ: ${t.type}`)}}catch(n){console.error("[OCR Worker] Processing error:",n),i({type:"ERROR",success:!1,elementId:t.elementId,error:`${n?.message||"Lỗi không xác định trong Web Worker"}${n?.stack?`
`+n.stack:""}`})}}).catch(n=>{console.error("[OCR Worker] Fatal queue error:",n),i({type:"ERROR",success:!1,error:`Fatal queue error: ${n?.message||n}`})})};function c1(e,t,r){const i=e.getContext("2d");if(!i)return;const n=4;for(const a of t){const s=Math.max(0,a.box.x-n),o=Math.max(0,a.box.y-n),u=Math.min(e.width-s,a.box.width+n*2),l=Math.min(e.height-o,a.box.height+n*2);if(!(u<4||l<4))try{const c=i.getImageData(s,o,u,l),h=a.box.quad?.map(([g,f])=>[g-s,f-o]),m=mi.buildPatch(c,s,o,a.bgColor,r,e.width,h);m&&(a.erasePatch=m)}catch{}}try{const a=B0.aggregateDialogues(t,e.width,e.height),s=new Map(t.map(o=>[o.box,o]));for(const o of a){const u=Math.max(24,Math.min(180,Math.round(Math.max(o.box.width*1.6,o.box.height*.85)))),l=Math.max(16,Math.min(120,Math.round(o.box.height*.45))),c=Math.max(0,o.box.x-u),h=Math.max(0,o.box.y-l),m=Math.min(e.width-c,o.box.width+u*2),g=Math.min(e.height-h,o.box.height+l*2);if(o.kind==="dialogue"&&m>=20&&g>=20){const I=i.getImageData(c,h,m,g),S=tr.extractChamber(I,c,h,o.box);if(S)for(const E of o.lineBoxes||[]){const C=s.get(E);C&&(C.chamberBox=S.chamberBox,C.isOvalChamber=S.isOval)}}const f=Math.max(0,o.box.x-16),$=Math.max(0,o.box.y-16),v=Math.min(e.width-f,o.box.width+32),b=Math.min(e.height-$,o.box.height+32);if(v<12||b<12)continue;const w=i.getImageData(f,$,v,b),k=o1.buildBubblePatch(w,f,$,o.lineBoxes);if(k)for(const I of o.lineBoxes||[]){const S=s.get(I);S&&(S.bubblePatch=k)}}}catch{}}self.addEventListener("error",e=>{console.error("[OCR Worker] Global error:",e),self.postMessage({type:"ERROR",success:!1,error:`Worker GlobalError: ${e.message||String(e)}`})});self.addEventListener("unhandledrejection",e=>{console.error("[OCR Worker] Unhandled rejection:",e),self.postMessage({type:"ERROR",success:!1,error:`Worker UnhandledRejection: ${e.reason?.message||String(e.reason)}`})});
