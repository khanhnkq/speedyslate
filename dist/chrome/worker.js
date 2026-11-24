import{V as Lo,B as A0}from"./assets/bubble-aggregator.js";/*!
 * ONNX Runtime Web v1.31.1
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */var ya=Object.defineProperty,O0=Object.getOwnPropertyDescriptor,B0=Object.getOwnPropertyNames,R0=Object.prototype.hasOwnProperty,D0=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),X=(e,t,r)=>()=>{if(r)throw r[0];try{return e&&(t=e(e=0)),t}catch(i){throw r=[i],i}},hr=(e,t)=>{for(var r in t)ya(e,r,{get:t[r],enumerable:!0})},N0=(e,t,r,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of B0(t))!R0.call(e,n)&&n!==r&&ya(e,n,{get:()=>t[n],enumerable:!(i=O0(t,n))||i.enumerable});return e},Rr=e=>N0(ya({},"__esModule",{value:!0}),e),tr,_t,Hi,ar,Fi,Mc,Ac,wa=X(()=>{"use strict";tr=new Map,_t=[],Hi=new WeakMap,ar=(e,t,r)=>{if(t&&typeof t.init=="function"&&typeof t.createInferenceSessionHandler=="function"){let i=tr.get(e);if(i===void 0)tr.set(e,{backend:t,priority:r});else{if(i.priority>r)return;if(i.priority===r&&i.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${r}`)}if(r>=0){let n=_t.indexOf(e);n!==-1&&_t.splice(n,1);for(let a=0;a<_t.length;a++)if(tr.get(_t[a]).priority<=r){_t.splice(a,0,e);return}_t.push(e)}return}throw new TypeError("not a valid backend")},Fi=async e=>{let t=tr.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;if(t.aborted)return t.error;{let r=!!t.initPromise;try{if(!r){let i=t.backend,n=Hi.get(i);t.initPromise=n?n.then(async()=>i.init(e),async()=>i.init(e)):i.init(e),Hi.set(i,t.initPromise)}return await t.initPromise,t.initialized=!0,t.backend}catch(i){return r||(t.error=`${i}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},Mc=async e=>{let t=e.executionProviders||[],r=t.map(u=>typeof u=="string"?u:u.name),i=r.length===0?_t:r,n,a=[],s=new Set;for(let u of i){let l=await Fi(u);typeof l=="string"?a.push({name:u,err:l}):(n||(n=l),n===l&&s.add(u))}if(!n)throw new Error(`no available backend found. ERR: ${a.map(u=>`[${u.name}] ${u.err}`).join(", ")}`);for(let{name:u,err:l}of a)r.includes(u)&&console.warn(`removing requested execution provider "${u}" from session options because it is not available: ${l}`);let o=t.filter(u=>s.has(typeof u=="string"?u:u.name));return[n,new Proxy(e,{get:(u,l)=>l==="executionProviders"?o:Reflect.get(u,l)})]},Ac=async()=>{let e=[];for(let r of _t){if(typeof tr.get(r).backend.createLoraAdapterHandler!="function")continue;let i=await Fi(r);if(typeof i!="string")return i;e.push({name:r,err:i})}let t=e.length===0?"":` ERR: ${e.map(r=>`[${r.name}] ${r.err}`).join(", ")}`;throw new Error(`no available backend supports LoRA adapters.${t}`)}}),U0=X(()=>{"use strict";wa()}),Oc,P0=X(()=>{"use strict";Oc="1.31.1"}),ji,Ge,Bc=X(()=>{"use strict";P0(),ji="warning",Ge={wasm:{},webgl:{},webgpu:{},versions:{common:Oc},set logLevel(e){if(e!==void 0){if(typeof e!="string"||["verbose","info","warning","error","fatal"].indexOf(e)===-1)throw new Error(`Unsupported logging level: ${e}`);ji=e}},get logLevel(){return ji}},Object.defineProperty(Ge,"logLevel",{enumerable:!0})}),Ce,L0=X(()=>{"use strict";Bc(),Ce=Ge}),hi,Ki,it,Qe,Ft,jt,_a=X(()=>{"use strict";Bc(),hi=(e,t)=>{(typeof Ge.trace>"u"?!Ge.wasm.trace:!Ge.trace)||console.timeStamp(`${e}::ORT::${t}`)},Ki=(e,t)=>{let r=new Error().stack?.split(/\r\n|\r|\n/g)||[],i=!1;for(let n=0;n<r.length;n++){if(i&&!r[n].includes("TRACE_FUNC")){let a=`FUNC_${e}::${r[n].trim().split(" ")[1]}`;t&&(a+=`::${t}`),hi("CPU",a);return}r[n].includes("TRACE_FUNC")&&(i=!0)}},it=e=>{(typeof Ge.trace>"u"?!Ge.wasm.trace:!Ge.trace)||Ki("BEGIN",e)},Qe=e=>{(typeof Ge.trace>"u"?!Ge.wasm.trace:!Ge.trace)||Ki("END",e)},Ft=e=>{(typeof Ge.trace>"u"?!Ge.wasm.trace:!Ge.trace)||console.time(`ORT::${e}`)},jt=e=>{(typeof Ge.trace>"u"?!Ge.wasm.trace:!Ge.trace)||console.timeEnd(`ORT::${e}`)}}),ba,Rc=X(()=>{"use strict";wa(),_a(),ba=class Dc{constructor(t,r){this.backend=t,this.handler=r}static async create(t){if(it(),typeof t!="string"&&!(t instanceof Uint8Array))throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let r=await Ac(),i=await r.createLoraAdapterHandler(t);return Qe(),new Dc(r,i)}async release(){return this.handler.dispose()}}}),Nc,Uc,W0=X(()=>{"use strict";Nc=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);r.width=e.dims[3],r.height=e.dims[2];let i=r.getContext("2d");if(i!=null){let n,a;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(n=e.dims[2],a=e.dims[3]):(n=e.dims[3],a=e.dims[2]);let s=t?.format!==void 0?t.format:"RGB",o=t?.norm,u,l;o===void 0||o.mean===void 0?u=[255,255,255,255]:typeof o.mean=="number"?u=[o.mean,o.mean,o.mean,o.mean]:(u=[o.mean[0],o.mean[1],o.mean[2],0],o.mean[3]!==void 0&&(u[3]=o.mean[3])),o===void 0||o.bias===void 0?l=[0,0,0,0]:typeof o.bias=="number"?l=[o.bias,o.bias,o.bias,o.bias]:(l=[o.bias[0],o.bias[1],o.bias[2],0],o.bias[3]!==void 0&&(l[3]=o.bias[3]));let c=a*n,p=0,m=c,g=c*2,f=-1;s==="RGBA"?(p=0,m=c,g=c*2,f=c*3):s==="RGB"?(p=0,m=c,g=c*2):s==="RBG"&&(p=0,g=c,m=c*2);for(let _=0;_<a;_++)for(let v=0;v<n;v++){let $=(e.data[p++]-l[0])*u[0],b=(e.data[m++]-l[1])*u[1],k=(e.data[g++]-l[2])*u[2],I=f===-1?255:(e.data[f++]-l[3])*u[3];i.fillStyle="rgba("+$+","+b+","+k+","+I+")",i.fillRect(v,_,1,1)}if("toDataURL"in r)return r.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},Uc=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),i;if(r!=null){let n,a,s;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(n=e.dims[2],a=e.dims[1],s=e.dims[3]):(n=e.dims[3],a=e.dims[2],s=e.dims[1]);let o=t!==void 0&&t.format!==void 0?t.format:"RGB",u=t?.norm,l,c;u===void 0||u.mean===void 0?l=[255,255,255,255]:typeof u.mean=="number"?l=[u.mean,u.mean,u.mean,u.mean]:(l=[u.mean[0],u.mean[1],u.mean[2],255],u.mean[3]!==void 0&&(l[3]=u.mean[3])),u===void 0||u.bias===void 0?c=[0,0,0,0]:typeof u.bias=="number"?c=[u.bias,u.bias,u.bias,u.bias]:(c=[u.bias[0],u.bias[1],u.bias[2],0],u.bias[3]!==void 0&&(c[3]=u.bias[3]));let p=a*n;if(t!==void 0&&(t.format!==void 0&&s===4&&t.format!=="RGBA"||s===3&&t.format!=="RGB"&&t.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let m=4,g=0,f=1,_=2,v=3,$=0,b=p,k=p*2,I=-1;o==="RGBA"?($=0,b=p,k=p*2,I=p*3):o==="RGB"?($=0,b=p,k=p*2):o==="RBG"&&($=0,k=p,b=p*2),i=r.createImageData(n,a);for(let S=0;S<a*n;g+=m,f+=m,_+=m,v+=m,S++)i.data[g]=(e.data[$++]-c[0])*l[0],i.data[f]=(e.data[b++]-c[1])*l[1],i.data[_]=(e.data[k++]-c[2])*l[2],i.data[v]=I===-1?255:(e.data[I++]-c[3])*l[3]}else throw new Error("Can not access image data");return i}}),Zr,Pc,Lc,Wc,qc,Gc,q0=X(()=>{"use strict";$a(),Zr=(e,t)=>{if(e===void 0)throw new Error("Image buffer must be defined");if(t.height===void 0||t.width===void 0)throw new Error("Image height and width must be defined");if(t.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:r,width:i}=t,n=t.norm??{mean:255,bias:0},a,s;typeof n.mean=="number"?a=[n.mean,n.mean,n.mean,n.mean]:a=[n.mean[0],n.mean[1],n.mean[2],n.mean[3]??255],typeof n.bias=="number"?s=[n.bias,n.bias,n.bias,n.bias]:s=[n.bias[0],n.bias[1],n.bias[2],n.bias[3]??0];let o=t.format!==void 0?t.format:"RGBA",u=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",l=r*i,c=u==="RGBA"?new Float32Array(l*4):new Float32Array(l*3),p=4,m=0,g=1,f=2,_=3,v=0,$=l,b=l*2,k=-1;o==="RGB"&&(p=3,m=0,g=1,f=2,_=-1),u==="RGBA"?k=l*3:u==="RBG"?(v=0,b=l,$=l*2):u==="BGR"&&(b=0,$=l,v=l*2);for(let I=0;I<l;I++,m+=p,f+=p,g+=p,_+=p)c[v++]=(e[m]+s[0])/a[0],c[$++]=(e[g]+s[1])/a[1],c[b++]=(e[f]+s[2])/a[2],k!==-1&&_!==-1&&(c[k++]=(e[_]+s[3])/a[3]);return u==="RGBA"?new Xe("float32",c,[1,4,r,i]):new Xe("float32",c,[1,3,r,i])},Pc=async(e,t)=>{let r=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,i=typeof ImageData<"u"&&e instanceof ImageData,n=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,a=typeof e=="string",s,o=t??{},u=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},l=c=>typeof HTMLCanvasElement<"u"&&c instanceof HTMLCanvasElement||c instanceof OffscreenCanvas?c.getContext("2d"):null;if(r){let c=u();c.width=e.width,c.height=e.height;let p=l(c);if(p!=null){let m=e.height,g=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(m=t.resizedHeight,g=t.resizedWidth),t!==void 0){if(o=t,t.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");o.tensorFormat="RGBA",o.height=m,o.width=g}else o.tensorFormat="RGBA",o.height=m,o.width=g;p.drawImage(e,0,0),s=p.getImageData(0,0,g,m).data}else throw new Error("Can not access image data")}else if(i){let c,p;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(c=t.resizedHeight,p=t.resizedWidth):(c=e.height,p=e.width),t!==void 0&&(o=t),o.format="RGBA",o.height=c,o.width=p,t!==void 0){let m=u();m.width=p,m.height=c;let g=l(m);if(g!=null)g.putImageData(e,0,0),s=g.getImageData(0,0,p,c).data;else throw new Error("Can not access image data")}else s=e.data}else if(n){if(t===void 0)throw new Error("Please provide image config with format for Imagebitmap");let c=u();c.width=e.width,c.height=e.height;let p=l(c);if(p!=null){let m=e.height,g=e.width;return p.drawImage(e,0,0,g,m),s=p.getImageData(0,0,g,m).data,o.height=m,o.width=g,Zr(s,o)}else throw new Error("Can not access image data")}else{if(a)return new Promise((c,p)=>{let m=u(),g=l(m);if(!e||!g)return p();let f=new Image;f.crossOrigin="Anonymous",f.src=e,f.onload=()=>{m.width=f.width,m.height=f.height,g.drawImage(f,0,0,m.width,m.height);let _=g.getImageData(0,0,m.width,m.height);o.height=m.height,o.width=m.width,c(Zr(_.data,o))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(s!==void 0)return Zr(s,o);throw new Error("Input data provided is not supported - aborted tensor creation")},Lc=(e,t)=>{let{width:r,height:i,download:n,dispose:a}=t,s=[1,i,r,4];return new Xe({location:"texture",type:"float32",texture:e,dims:s,download:n,dispose:a})},Wc=(e,t)=>{let{dataType:r,dims:i,download:n,dispose:a}=t;return new Xe({location:"gpu-buffer",type:r??"float32",gpuBuffer:e,dims:i,download:n,dispose:a})},qc=(e,t)=>{let{dataType:r,dims:i,download:n,dispose:a}=t;return new Xe({location:"ml-tensor",type:r??"float32",mlTensor:e,dims:i,download:n,dispose:a})},Gc=(e,t,r)=>new Xe({location:"cpu-pinned",type:e,data:t,dims:r??[t.length]})}),Gt,Er,Zi,Vc,G0=X(()=>{"use strict";Gt=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),Er=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),Zi=!1,Vc=()=>{if(!Zi){Zi=!0;let e=typeof BigInt64Array<"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,r=globalThis.Float16Array,i=typeof r<"u"&&r.from;e&&(Gt.set("int64",BigInt64Array),Er.set(BigInt64Array,"int64")),t&&(Gt.set("uint64",BigUint64Array),Er.set(BigUint64Array,"uint64")),i?(Gt.set("float16",r),Er.set(r,"float16")):Gt.set("float16",Uint16Array)}}}),Hc,Fc,V0=X(()=>{"use strict";$a(),Hc=e=>{let t=1;for(let r=0;r<e.length;r++){let i=e[r];if(typeof i!="number"||!Number.isSafeInteger(i))throw new TypeError(`dims[${r}] must be an integer, got: ${i}`);if(i<0)throw new RangeError(`dims[${r}] must be a non-negative integer, got: ${i}`);t*=i}return t},Fc=(e,t)=>{switch(e.location){case"cpu":return new Xe(e.type,e.data,t);case"cpu-pinned":return new Xe({location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new Xe({location:"texture",texture:e.texture,type:e.type,dims:t});case"gpu-buffer":return new Xe({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"ml-tensor":return new Xe({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),Xe,$a=X(()=>{"use strict";W0(),q0(),G0(),V0(),Xe=class{constructor(e,t,r){Vc();let i,n;if(typeof e=="object"&&"location"in e)switch(this.dataLocation=e.location,i=e.type,n=e.dims,e.location){case"cpu-pinned":{let s=Gt.get(i);if(!s)throw new TypeError(`unsupported type "${i}" to create tensor from pinned buffer`);if(!(e.data instanceof s))throw new TypeError(`buffer should be of type ${s.name}`);this.cpuData=e.data;break}case"texture":{if(i!=="float32")throw new TypeError(`unsupported type "${i}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break}case"gpu-buffer":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break}case"ml-tensor":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint64"&&i!=="int8"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let s,o;if(typeof e=="string")if(i=e,o=r,e==="string"){if(!Array.isArray(t))throw new TypeError("A string tensor's data must be a string array.");s=t}else{let u=Gt.get(e);if(u===void 0)throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e==="float16"&&u===Uint16Array||e==="uint4"||e==="int4")throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${u.name} as data.`);e==="uint64"||e==="int64"?s=u.from(t,BigInt):s=u.from(t)}else if(t instanceof u)s=t;else if(t instanceof Uint8ClampedArray)if(e==="uint8")s=Uint8Array.from(t);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(e==="float16"&&t instanceof Uint16Array&&u!==Uint16Array)s=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw new TypeError(`A ${i} tensor's data must be type of ${u}`)}else if(o=t,Array.isArray(e)){if(e.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let u=typeof e[0];if(u==="string")i="string",s=e;else if(u==="boolean")i="bool",s=Uint8Array.from(e);else throw new TypeError(`Invalid element type of data array: ${u}.`)}else if(e instanceof Uint8ClampedArray)i="uint8",s=Uint8Array.from(e);else{let u=Er.get(e.constructor);if(u===void 0)throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);i=u,s=e}if(o===void 0)o=[s.length];else if(!Array.isArray(o))throw new TypeError("A tensor's dims must be a number array");n=o,this.cpuData=s,this.dataLocation="cpu"}let a=Hc(n);if(this.cpuData&&a!==this.cpuData.length&&!((i==="uint4"||i==="int4")&&Math.ceil(a/2)===this.cpuData.length))throw new Error(`Tensor's size(${a}) does not match data length(${this.cpuData.length}).`);this.type=i,this.dims=n,this.size=a}static async fromImage(e,t){return Pc(e,t)}static fromTexture(e,t){return Lc(e,t)}static fromGpuBuffer(e,t){return Wc(e,t)}static fromMLTensor(e,t){return qc(e,t)}static fromPinnedBuffer(e,t,r){return Gc(e,t,r)}toDataURL(e){return Nc(this,e)}toImageData(e){return Uc(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return Fc(this,e)}}}),Fe,jc=X(()=>{"use strict";$a(),Fe=Xe}),Kc,H0=X(()=>{"use strict";wa(),Rc(),jc(),_a(),Kc=class Zc{constructor(t,r){this.handler=t,this.backend=r}async run(t,r,i){it(),Ft("InferenceSession.run");let n={},a={};if(typeof t!="object"||t===null||t instanceof Fe||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let s=!0;if(typeof r=="object"){if(r===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(r instanceof Fe)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(r)){if(r.length===0)throw new TypeError("'fetches' cannot be an empty array.");s=!1;for(let c of r){if(typeof c!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(c)===-1)throw new RangeError(`'fetches' contains invalid output name: ${c}.`);n[c]=null}if(typeof i=="object"&&i!==null)a=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else{let c=!1,p=Object.getOwnPropertyNames(r);for(let m of this.outputNames)if(p.indexOf(m)!==-1){let g=r[m];(g===null||g instanceof Fe)&&(c=!0,s=!1,n[m]=g)}if(c){if(typeof i=="object"&&i!==null)a=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else a=r}}else if(typeof r<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let c of this.inputNames)if(typeof t[c]>"u")throw new Error(`input '${c}' is missing in 'feeds'.`);if(s)for(let c of this.outputNames)n[c]=null;let o;if(a.activeLoraAdapters!==void 0){if(!Array.isArray(a.activeLoraAdapters))throw new TypeError("'activeLoraAdapters' must be an array.");o=a.activeLoraAdapters.map(c=>{if(!(c instanceof ba))throw new TypeError("'activeLoraAdapters' must be an array of LoraAdapter objects.");if(c.backend!==this.backend)throw new Error("LoRA adapter was created by a different backend than the session.");return c.handler})}let u=await this.handler.run(t,n,a,o),l={};for(let c in u)if(Object.hasOwnProperty.call(u,c)){let p=u[c];p instanceof Fe?l[c]=p:l[c]=new Fe(p.type,p.data,p.dims)}return jt("InferenceSession.run"),Qe(),l}async release(){return this.handler.dispose()}static async create(t,r,i,n){it(),Ft("InferenceSession.create");let a,s={};if(typeof t=="string"){if(a=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof Uint8Array){if(a=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&t instanceof SharedArrayBuffer){let c=t,p=0,m=t.byteLength;if(typeof r=="object"&&r!==null)s=r;else if(typeof r=="number"){if(p=r,!Number.isSafeInteger(p))throw new RangeError("'byteOffset' must be an integer.");if(p<0||p>=c.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${c.byteLength}).`);if(m=t.byteLength-p,typeof i=="number"){if(m=i,!Number.isSafeInteger(m))throw new RangeError("'byteLength' must be an integer.");if(m<=0||p+m>c.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${c.byteLength-p}].`);if(typeof n=="object"&&n!==null)s=n;else if(typeof n<"u")throw new TypeError("'options' must be an object.")}else if(typeof i<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof r<"u")throw new TypeError("'options' must be an object.");a=new Uint8Array(c,p,m)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[o,u]=await Mc(s),l=await o.createInferenceSessionHandler(a,u);return jt("InferenceSession.create"),Qe(),new Zc(l,o)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),ur,F0=X(()=>{"use strict";H0(),ur=Kc}),Yc,j0=X(()=>{"use strict";Rc(),Yc=ba}),K0=X(()=>{"use strict"}),Z0=X(()=>{"use strict"}),Y0=X(()=>{"use strict"}),X0=X(()=>{"use strict"}),Q0={};hr(Q0,{InferenceSession:()=>ur,LoraAdapter:()=>Yc,TRACE:()=>hi,TRACE_EVENT_BEGIN:()=>Ft,TRACE_EVENT_END:()=>jt,TRACE_FUNC_BEGIN:()=>it,TRACE_FUNC_END:()=>Qe,Tensor:()=>Fe,env:()=>Ce,registerBackend:()=>ar});var et=X(()=>{"use strict";U0(),L0(),F0(),j0(),jc(),K0(),Z0(),_a(),Y0(),X0()}),xa=X(()=>{"use strict"}),Xc={};hr(Xc,{default:()=>Qc});var Yi,Xi,Qc,J0=X(()=>{"use strict";um(),Xt(),va(),Yi="ort-wasm-proxy-worker",Xi=globalThis.self?.name===Yi,Xi&&(self.onmessage=e=>{let{type:t,in:r}=e.data;try{switch(t){case"init-wasm":ka(r.wasm).then(()=>{Wa(r).then(()=>{postMessage({type:t})},i=>{postMessage({type:t,err:i})})},i=>{postMessage({type:t,err:i})});break;case"init-ep":{let{epName:i,env:n}=r;qa(n,i).then(()=>{postMessage({type:t})},a=>{postMessage({type:t,err:a})});break}case"copy-from":{let{buffer:i}=r,n=bi(i);postMessage({type:t,out:n});break}case"create":{let{model:i,options:n}=r;Ga(i,n).then(a=>{postMessage({type:t,out:a})},a=>{postMessage({type:t,err:a})});break}case"release":Va(r),postMessage({type:t});break;case"run":{let{sessionId:i,inputIndices:n,inputs:a,outputIndices:s,options:o}=r;Ha(i,n,a,s,new Array(s.length).fill(null),o).then(u=>{u.some(l=>l[3]!=="cpu")?postMessage({type:t,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:t,out:u},ja([...a,...u]))},u=>{postMessage({type:t,err:u})});break}case"end-profiling":Fa(r),postMessage({type:t});break;default:}}catch(i){postMessage({type:t,err:i})}}),Qc=Xi?null:e=>new Worker(e??Ye,{type:"module",name:Yi})}),Jc={};hr(Jc,{default:()=>ep});async function Wo(e={}){var t=e,r=!!globalThis.window,i=!!globalThis.WorkerGlobalScope,n=i&&self.name?.startsWith("em-pthread");t.mountExternalData=(d,h)=>{d.startsWith("./")&&(d=d.substring(2)),(t.jd||(t.jd=new Map)).set(d,h)},t.unmountExternalData=()=>{delete t.jd,delete t.ke,delete t.je,delete t.le},globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,shared:!0}).buffer.constructor;let a=d=>async(...h)=>{try{if(t.hd)throw Error("Session already started");let w=t.hd={Vd:h[0],errors:[]},y=await d(...h);if(t.hd!==w)throw Error("Session mismatch");t.pd?.flush();let T=w.errors;if(0<T.length){let z=await Promise.all(T);if(z=z.filter(D=>D),0<z.length)throw Error(z.join(`
`))}return y}finally{t.hd=null}};t.jsepInit=(d,h)=>{if(d==="webgpu"){[t.pd,t.Ld,t.Pd,t.rd,t.Od,t.ic,t.Qd,t.Sd,t.Md,t.Nd,t.Rd]=h;let w=t.pd;t.jsepRegisterBuffer=(y,T,z,D)=>w.registerBuffer(y,T,z,D),t.jsepGetBuffer=y=>w.getBuffer(y),t.jsepCreateDownloader=(y,T,z)=>w.createDownloader(y,T,z),t.jsepOnCreateSession=y=>{w.onCreateSession(y)},t.jsepOnReleaseSession=y=>{w.onReleaseSession(y)},t.jsepOnRunStart=y=>w.onRunStart(y),t.Td=(y,T)=>{w.upload(y,T)}}else if(d==="webnn"){let w=h[0];[t.ce,t.Cd,t.webnnEnsureTensor,t.Dd,t.webnnDownloadTensor,t.be,t.webnnEnableTraceEvent]=h.slice(1),t.webnnReleaseTensorId=t.Cd,t.webnnUploadTensor=t.Dd,t.webnnRegisterMLContext=t.be,t.webnnOnRunStart=y=>w.onRunStart(y),t.webnnOnRunEnd=w.onRunEnd.bind(w),t.webnnOnReleaseSession=y=>{w.onReleaseSession(y)},t.webnnCreateMLTensorDownloader=(y,T)=>w.createMLTensorDownloader(y,T),t.webnnRegisterMLTensor=(y,T,z,D)=>w.registerMLTensor(y,T,z,D),t.webnnCreateMLContext=y=>w.createMLContext(y),t.webnnRegisterGraphInput=w.registerGraphInput.bind(w),t.webnnIsGraphInput=w.isGraphInput.bind(w),t.webnnRegisterGraphOutput=w.registerGraphOutput.bind(w),t.webnnIsGraphOutput=w.isGraphOutput.bind(w),t.webnnCreateTemporaryTensor=w.createTemporaryTensor.bind(w),t.webnnIsGraphInputOutputTypeSupported=w.isGraphInputOutputTypeSupported.bind(w)}};let s=()=>{let d=h=>(...w)=>{let y=pt;return w=h(...w),pt!=y?new Promise((T,z)=>{Ai={resolve:T,reject:z}}):w};(h=>{for(let w of h)t[w]=d(t[w])})("_OrtAppendExecutionProvider _OrtAppendExecutionProviderV2 _OrtCreateSession _OrtRun _OrtRunWithBinding _OrtBindInput".split(" ")),a!==void 0&&(t._OrtRun=a(t._OrtRun),t._OrtRunWithBinding=a(t._OrtRunWithBinding)),s=void 0};t.asyncInit=()=>{s?.()};var o,u,l=(d,h)=>{throw h},c=import.meta.url,p="";if(r||i){try{p=new URL(".",c).href}catch{}i&&(u=d=>{var h=new XMLHttpRequest;return h.open("GET",d,!1),h.responseType="arraybuffer",h.send(null),new Uint8Array(h.response)}),o=async d=>{if(C(d))return new Promise((w,y)=>{var T=new XMLHttpRequest;T.open("GET",d,!0),T.responseType="arraybuffer",T.onload=()=>{T.status==200||T.status==0&&T.response?w(T.response):y(T.status)},T.onerror=y,T.send(null)});var h=await fetch(d,{credentials:"same-origin"});if(h.ok)return h.arrayBuffer();throw Error(h.status+" : "+h.url)}}var m,g,f,_,v,$,b=console.log.bind(console),k=console.error.bind(console),I=b,S=k,E=!1,C=d=>d.startsWith("file://");function x(){Ue.buffer!=N.buffer&&W()}if(n){let d=function(h){try{var w=h.data,y=w.bd;if(y==="load"){let T=[];self.onmessage=z=>T.push(z),$=()=>{postMessage({bd:"loaded"});for(let z of T)d(z);self.onmessage=d};for(let z of w.Hd)t[z]&&!t[z].proxy||(t[z]=(...D)=>{postMessage({bd:"callHandler",Fd:z,args:D})},z=="print"&&(I=t[z]),z=="printErr"&&(S=t[z]));Ue=w.Zd,W(),g=w.$d,ge(),Kr()}else if(y==="run"){(function(T){var z=(x(),V)[T+52>>>2>>>0];T=(x(),V)[T+56>>>2>>>0],js(z,z-T),ye(z)})(w.ad),Ni(w.ad,0,0,1,0,0),je(),Ei(w.ad),O||(Ws(),O=!0);try{Bt(w.Xd,w.nd)}catch(T){if(T!="unwind")throw T}}else w.target!=="setimmediate"&&(y==="checkMailbox"?O&&Wr():y&&(S(`worker: received unknown command ${y}`),S(w)))}catch(T){throw qs(),T}};var O=!1;self.onunhandledrejection=h=>{throw h.reason||h},self.onmessage=d}var N,R,P,G,M,V,K,L,ee,J,Z,A=!1;function W(){var d=Ue.buffer;t.HEAP8=N=new Int8Array(d),P=new Int16Array(d),t.HEAPU8=R=new Uint8Array(d),G=new Uint16Array(d),t.HEAP32=M=new Int32Array(d),t.HEAPU32=V=new Uint32Array(d),K=new Float32Array(d),L=new Float64Array(d),ee=new BigInt64Array(d),J=new BigUint64Array(d)}function q(){A=!0,n?$():wt.vb()}function j(d){throw S(d="Aborted("+d+")"),E=!0,d=new WebAssembly.RuntimeError(d+". Build with -sASSERTIONS for more info."),v?.(d),d}function ue(){return{a:{na:Hg,jb:Vg,g:vm,G:km,f:Sm,o:Im,h:Tm,$:Cm,b:Em,S:zm,Ja,n:Mm,aa:is,_a:ns,Fa:as,Ha:ss,$a:os,Ya:us,Ra:ls,Xa:ds,la:cs,Ga:ps,Da:hs,Za:fs,Ea:ms,eb:Am,ga:Om,ya:Bm,wa:Dm,fa:Um,N:Pm,I:Lm,xa:Wm,_:Km,za:Zm,Ua:Ym,Ba:Qm,Ka:Jm,ua:eg,ha:tg,Ta:Ei,bb:rg,Q:sg,r:cg,c:Ti,kb:pg,y:hg,M:fg,D:mg,m:gg,s:vs,lb:yg,J:wg,R:_g,j:bg,u:$g,q:xg,k:vg,Oa:kg,Pa:Sg,Qa:Ig,Ma:Ts,Na:Cs,va:Es,gb:Cg,db:zg,v:Mg,ba:Ag,ia:Og,cb:Eg,V:Bg,ab:Rg,Ca:Dg,F:Tg,U:Ng,ma:Fr,Aa:Pg,ib:Ug,hb:Lg,Va:Os,Wa:Bs,Ia:gt,T:Rs,La:Ds,ka:Ns,Sa:Us,ja:Ps,nb:E0,oa:k0,ob:C0,pa:v0,H:p0,e:Zg,t:jg,w:Fg,B:s0,pb:b0,Z:_0,x:Jg,qa:$0,X:S0,ca:w0,qb:y0,ea:Xg,O:o0,sb:f0,ra:g0,tb:h0,L:d0,Y:x0,d:Kg,A:Qg,l:Yg,mb:z0,p:t0,z:r0,C:e0,E:i0,K:u0,sa:c0,P:I0,da:l0,W:T0,ub:a0,ta:n0,rb:m0,i:qg,a:Ue,fb:Ne}}}async function ge(){function d(y,T){var z=wt=y.exports;y={};for(let[D,H]of Object.entries(z))typeof H=="function"?(z=ig(H),y[D]=z):y[D]=H;return wt=y,wt=(function(){var D=wt,H=ne=>me=>ne(me)>>>0,re=ne=>()=>ne()>>>0;return(D=Object.assign({},D)).wb=H(D.wb),D.ec=re(D.ec),D.gc=H(D.gc),D.uc=H(D.uc),D.vc=re(D.vc),D.zc=H(D.zc),D})(),B.push(wt.hc),Ls=(y=wt).wb,Ws=y.xb,t._OrtInit=y.yb,t._OrtGetLastError=y.zb,t._OrtCreateSessionOptions=y.Ab,t._OrtAppendExecutionProvider=y.Bb,t._OrtGetEpDevices=y.Cb,t._OrtEpDevice_EpName=y.Db,t._OrtAppendExecutionProviderV2=y.Eb,t._OrtAddFreeDimensionOverride=y.Fb,t._OrtAddSessionConfigEntry=y.Gb,t._OrtReleaseSessionOptions=y.Hb,t._OrtCreateSession=y.Ib,t._OrtReleaseSession=y.Jb,t._OrtGetInputOutputCount=y.Kb,t._OrtGetInputOutputMetadata=y.Lb,t._OrtFree=y.Mb,t._OrtCreateTensor=y.Nb,t._OrtGetTensorData=y.Ob,t._OrtReleaseTensor=y.Pb,t._OrtCreateLoraAdapter=y.Qb,t._OrtReleaseLoraAdapter=y.Rb,t._OrtCreateRunOptions=y.Sb,t._OrtAddRunConfigEntry=y.Tb,t._OrtRunOptionsAddActiveLoraAdapter=y.Ub,t._OrtReleaseRunOptions=y.Vb,t._OrtCreateBinding=y.Wb,t._OrtBindInput=y.Xb,t._OrtBindOutput=y.Yb,t._OrtClearBoundOutputs=y.Zb,t._OrtReleaseBinding=y._b,t._OrtRunWithBinding=y.$b,t._OrtRun=y.ac,t._OrtEndProfiling=y.bc,t._JsepOutput=y.cc,t._JsepGetNodeName=y.dc,jr=y.ec,ht=t._free=y.fc,mr=t._malloc=y.gc,Ni=y.jc,qs=y.kc,Gs=y.lc,Vs=y.mc,Ui=y.nc,Hs=y.oc,Fs=y.pc,_e=y.qc,gr=y.rc,js=y.sc,ye=y.tc,Pi=y.uc,we=y.vc,Ks=y.wc,Li=y.xc,Zs=y.yc,Ys=y.zc,Xs=y.Ac,Wi=y.Bc,Qs=y.Cc,Js=y.Dc,eo=y.Ec,to=y.Fc,ro=y.Gc,io=y.Hc,no=y.Ic,ao=y.Jc,so=y.Kc,oo=y.Lc,uo=y.Mc,lo=y.Nc,co=y.Oc,po=y.Pc,ho=y.Qc,fo=y.Rc,mo=y.Sc,go=y.Tc,yo=y.Uc,wo=y.Vc,_o=y.Wc,bo=y.Xc,$o=y.Yc,xo=y._c,vo=y.$c,ko=y.kd,So=y.ld,Io=y.qd,To=y.vd,Co=y.wd,Eo=y.xd,zo=y.yd,Mo=y.zd,Ao=y.Ad,Oo=y.Bd,Bo=y.Gd,Ro=y.Jd,Do=y.fe,No=y.ge,Uo=y.he,Po=y.ie,g=T,wt}var h,w=ue();return t.instantiateWasm?new Promise(y=>{t.instantiateWasm(w,(T,z)=>{y(d(T,z))})}):n?d(new WebAssembly.Instance(g,ue()),g):(Z??=t.locateFile?t.locateFile?t.locateFile("ort-wasm-simd-threaded.jsep.wasm",p):p+"ort-wasm-simd-threaded.jsep.wasm":new URL("/assets/ort-wasm-simd-threaded.jsep.wasm",import.meta.url).href,h=await(async function(y){var T=Z;if(!m&&!C(T))try{var z=fetch(T,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(z,y)}catch(D){S(`wasm streaming compile failed: ${D}`),S("falling back to ArrayBuffer instantiation")}return(async function(D,H){try{var re=await(async function(ne){if(!m)try{var me=await o(ne);return new Uint8Array(me)}catch{}if(ne==Z&&m)ne=new Uint8Array(m);else{if(!u)throw"both async and sync fetching of the wasm failed";ne=u(ne)}return ne})(D);return await WebAssembly.instantiate(re,H)}catch(ne){S(`failed to asynchronously prepare wasm: ${ne}`),j(ne)}})(T,y)})(w),d(h.instance,h.module))}class Y{name="ExitStatus";constructor(h){this.message=`Program terminated with exit(${h})`,this.status=h}}var ie=d=>{d.terminate(),d.onmessage=()=>{}},ce=[],Ie=0,xe=null,be=d=>{Ze.length==0&&(Pe(),qe(Ze[0]));var h=Ze.pop();if(!h)return 6;Q.push(h),te[d.ad]=h,h.ad=d.ad;var w={bd:"run",Xd:d.Wd,nd:d.nd,ad:d.ad};return h.postMessage(w,d.ud),0},Me=0,de=(d,h,...w)=>{var y,T=16*w.length,z=we(),D=Pi(T),H=D>>>3;for(y of w)typeof y=="bigint"?((x(),ee)[H++>>>0]=1n,(x(),ee)[H++>>>0]=y):((x(),ee)[H++>>>0]=0n,(x(),L)[H++>>>0]=y);return d=Gs(d,0,T,D,h),ye(z),d};function Ne(d){if(n)return de(0,1,d);if(f=d,!(0<Me)){for(var h of Q)ie(h);for(h of Ze)ie(h);Ze=[],Q=[],te={},E=!0}l(0,new Y(d))}function He(d){if(n)return de(1,0,d);gt(d)}var gt=d=>{if(f=d,n)throw He(d),"unwind";Ne(d)},Ze=[],Q=[],B=[],te={},fe=d=>{var h=d.ad;delete te[h],Ze.push(d),Q.splice(Q.indexOf(d),1),d.ad=0,Vs(h)};function je(){B.forEach(d=>d())}var qe=d=>new Promise(h=>{d.onmessage=T=>{var z=T.data;if(T=z.bd,z.md&&z.md!=jr()){var D=te[z.md];D?D.postMessage(z,z.ud):S(`Internal error! Worker sent a message "${T}" to target pthread ${z.md}, but that thread no longer exists!`)}else T==="checkMailbox"?Wr():T==="spawnThread"?be(z):T==="cleanupThread"?Lr(()=>{fe(te[z.Yd])}):T==="loaded"?(d.loaded=!0,h(d)):z.target==="setimmediate"?d.postMessage(z):T==="uncaughtException"?d.onerror(z.error):T==="callHandler"?t[z.Fd](...z.args):T&&S(`worker sent an unknown command ${T}`)},d.onerror=T=>{throw S(`worker sent an error! ${T.filename}:${T.lineno}: ${T.message}`),T};var w,y=[];for(w of[])t.propertyIsEnumerable(w)&&y.push(w);d.postMessage({bd:"load",Hd:y,Zd:Ue,$d:g})});function Pe(){var d=new Worker((()=>{let h=URL;return import.meta.url>"file:"&&import.meta.url<"file;"?new h("ort.bundle.min.mjs",import.meta.url):new URL(import.meta.url)})(),{type:"module",workerData:"em-pthread",name:"em-pthread"});Ze.push(d)}var Ue,Bt=(d,h)=>{Me=0,d=Wi(d,h),0<Me?f=d:Ui(d)},Nr=[],Ur=0;function vm(d){var h=new vi(d>>>=0);return(x(),N)[h.cd+12>>>0]==0&&(Ya(h,!0),Ur--),Xa(h,!1),Nr.push(h),Ys(d)}var Jt=0,km=()=>{_e(0,0);var d=Nr.pop();Ks(d.od),Jt=0};function Ya(d,h){h=h?1:0,(x(),N)[d.cd+12>>>0]=h}function Xa(d,h){h=h?1:0,(x(),N)[d.cd+13>>>0]=h}class vi{constructor(h){this.od=h,this.cd=h-24}}var ki=d=>{var h=Jt;if(!h)return gr(0),0;var w=new vi(h);(x(),V)[w.cd+16>>>2>>>0]=h;var y=(x(),V)[w.cd+4>>>2>>>0];if(!y)return gr(0),h;for(var T of d){if(T===0||T===y)break;if(Zs(T,y,w.cd+16))return gr(T),h}return gr(y),h};function Sm(){return ki([])}function Im(d){return ki([d>>>0])}function Tm(d,h,w,y){return ki([d>>>0,h>>>0,w>>>0,y>>>0])}var Cm=()=>{var d=Nr.pop();d||j("no exception to throw");var h=d.od;throw(x(),N)[d.cd+13>>>0]==0&&(Nr.push(d),Xa(d,!0),Ya(d,!1),Ur++),Li(h),Jt=h};function Em(d,h,w){var y=new vi(d>>>=0);throw h>>>=0,w>>>=0,(x(),V)[y.cd+16>>>2>>>0]=0,(x(),V)[y.cd+4>>>2>>>0]=h,(x(),V)[y.cd+8>>>2>>>0]=w,Li(d),Ur++,Jt=d}var zm=()=>Ur;function Qa(d,h,w,y){return n?de(2,1,d,h,w,y):Ja(d,h,w,y)}function Ja(d,h,w,y){if(d>>>=0,h>>>=0,w>>>=0,y>>>=0,!globalThis.SharedArrayBuffer)return 6;var T=[];return n&&T.length===0?Qa(d,h,w,y):(d={Wd:w,ad:d,nd:y,ud:T},n?(d.bd="spawnThread",postMessage(d,T),0):be(d))}function Mm(d){throw Jt||=d>>>0,Jt}var es=globalThis.TextDecoder&&new TextDecoder,ts=(d,h,w,y)=>{if(w=h+w,y)return w;for(;d[h]&&!(h>=w);)++h;return h},rs=(d,h=0,w,y)=>{if(16<(w=ts(d,h>>>=0,w,y))-h&&d.buffer&&es)return es.decode(d.buffer instanceof ArrayBuffer?d.subarray(h,w):d.slice(h,w));for(y="";h<w;){var T=d[h++];if(128&T){var z=63&d[h++];if((224&T)==192)y+=String.fromCharCode((31&T)<<6|z);else{var D=63&d[h++];65536>(T=(240&T)==224?(15&T)<<12|z<<6|D:(7&T)<<18|z<<12|D<<6|63&d[h++])?y+=String.fromCharCode(T):(T-=65536,y+=String.fromCharCode(55296|T>>10,56320|1023&T))}}else y+=String.fromCharCode(T)}return y},De=(d,h,w)=>(d>>>=0)?rs((x(),R),d,h,w):"";function is(d,h,w){return n?de(3,1,d,h,w):0}function ns(d,h){if(n)return de(4,1,d,h)}function as(d,h){if(n)return de(5,1,d,h)}function ss(d,h,w){if(n)return de(6,1,d,h,w)}function os(d,h,w){return n?de(7,1,d,h,w):0}function us(d,h){if(n)return de(8,1,d,h)}function ls(d,h,w){if(n)return de(9,1,d,h,w)}function ds(d,h,w,y){if(n)return de(10,1,d,h,w,y)}function cs(d,h,w,y){if(n)return de(11,1,d,h,w,y)}function ps(d,h,w,y){if(n)return de(12,1,d,h,w,y)}function hs(d){if(n)return de(13,1,d)}function fs(d,h){if(n)return de(14,1,d,h)}function ms(d,h,w){if(n)return de(15,1,d,h,w)}var Am=()=>j(""),ct=d=>{d>>>=0;for(var h="";;){var w=(x(),R)[d++>>>0];if(!w)return h;h+=String.fromCharCode(w)}},Si={},Ii={},er=class extends Error{constructor(d){super(d),this.name="BindingError"}};function yt(d,h,w={}){return(function(y,T,z={}){var D=T.name;if(!y)throw new er(`type "${D}" must have a positive integer typeid pointer`);if(Ii.hasOwnProperty(y)){if(z.Id)return;throw new er(`Cannot register type '${D}' twice`)}Ii[y]=T,Si.hasOwnProperty(y)&&(T=Si[y],delete Si[y],T.forEach(H=>H()))})(d,h,w)}var gs=(d,h,w)=>{switch(h){case 1:return w?y=>(x(),N)[y>>>0]:y=>(x(),R)[y>>>0];case 2:return w?y=>(x(),P)[y>>>1>>>0]:y=>(x(),G)[y>>>1>>>0];case 4:return w?y=>(x(),M)[y>>>2>>>0]:y=>(x(),V)[y>>>2>>>0];case 8:return w?y=>(x(),ee)[y>>>3>>>0]:y=>(x(),J)[y>>>3>>>0];default:throw new TypeError(`invalid integer width (${h}): ${d}`)}};function Om(d,h,w,y,T){d>>>=0,w>>>=0,h=ct(h>>>0);let z=D=>D;if(y=y===0n){let D=8*w;z=H=>BigInt.asUintN(D,H),T=z(T)}yt(d,{name:h,Zc:z,ed:(D,H)=>(typeof H=="number"&&(H=BigInt(H)),H),dd:gs(h,w,!y),gd:null})}function Bm(d,h,w,y){yt(d>>>=0,{name:h=ct(h>>>0),Zc:function(T){return!!T},ed:function(T,z){return z?w:y},dd:function(T){return this.Zc((x(),R)[T>>>0])},gd:null})}var ys=[],Rt=[0,1,,1,null,1,!0,1,!1,1];function Ti(d){9<(d>>>=0)&&--Rt[d+1]===0&&(Rt[d]=void 0,ys.push(d))}var tt=d=>{if(!d)throw new er(`Cannot use deleted val. handle = ${d}`);return Rt[d]},nt=d=>{switch(d){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let h=ys.pop()||Rt.length;return Rt[h]=d,Rt[h+1]=1,h}};function Ci(d){return this.Zc((x(),V)[d>>>2>>>0])}var Rm={name:"emscripten::val",Zc:d=>{var h=tt(d);return Ti(d),h},ed:(d,h)=>nt(h),dd:Ci,gd:null};function Dm(d){return yt(d>>>0,Rm)}var Nm=(d,h)=>{switch(h){case 4:return function(w){return this.Zc((x(),K)[w>>>2>>>0])};case 8:return function(w){return this.Zc((x(),L)[w>>>3>>>0])};default:throw new TypeError(`invalid float width (${h}): ${d}`)}};function Um(d,h,w){w>>>=0,yt(d>>>=0,{name:h=ct(h>>>0),Zc:y=>y,ed:(y,T)=>T,dd:Nm(h,w),gd:null})}function Pm(d,h,w,y,T){d>>>=0,w>>>=0,h=ct(h>>>0);let z=H=>H;if(y===0){var D=32-8*w;z=H=>H<<D>>>D,T=z(T)}yt(d,{name:h,Zc:z,ed:(H,re)=>re,dd:gs(h,w,y!==0),gd:null})}function Lm(d,h,w){function y(z){var D=(x(),V)[z>>>2>>>0];return z=(x(),V)[z+4>>>2>>>0],new T((x(),N).buffer,z,D)}var T=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][h];yt(d>>>=0,{name:w=ct(w>>>0),Zc:y,dd:y},{Id:!0})}var It=(d,h,w)=>{var y=(x(),R);if(h>>>=0,0<w){var T=h;w=h+w-1;for(var z=0;z<d.length;++z){var D=d.codePointAt(z);if(127>=D){if(h>=w)break;y[h++>>>0]=D}else if(2047>=D){if(h+1>=w)break;y[h++>>>0]=192|D>>6,y[h++>>>0]=128|63&D}else if(65535>=D){if(h+2>=w)break;y[h++>>>0]=224|D>>12,y[h++>>>0]=128|D>>6&63,y[h++>>>0]=128|63&D}else{if(h+3>=w)break;y[h++>>>0]=240|D>>18,y[h++>>>0]=128|D>>12&63,y[h++>>>0]=128|D>>6&63,y[h++>>>0]=128|63&D,z++}}y[h>>>0]=0,d=h-T}else d=0;return d},Pr=d=>{for(var h=0,w=0;w<d.length;++w){var y=d.charCodeAt(w);127>=y?h++:2047>=y?h+=2:55296<=y&&57343>=y?(h+=4,++w):h+=3}return h};function Wm(d,h){yt(d>>>=0,{name:h=ct(h>>>0),Zc(w){var y=(x(),V)[w>>>2>>>0];return y=De(w+4,y,!0),ht(w),y},ed(w,y){y instanceof ArrayBuffer&&(y=new Uint8Array(y));var T=typeof y=="string";if(!(T||ArrayBuffer.isView(y)&&y.BYTES_PER_ELEMENT==1))throw new er("Cannot pass non-string to std::string");var z=T?Pr(y):y.length,D=mr(4+z+1),H=D+4;return(x(),V)[D>>>2>>>0]=z,T?It(y,H,z+1):(x(),R).set(y,H>>>0),w!==null&&w.push(ht,D),D},dd:Ci,gd(w){ht(w)}})}var ws=globalThis.TextDecoder?new TextDecoder("utf-16le"):void 0,qm=(d,h,w)=>{if(d>>>=1,16<(h=ts((x(),G),d,h/2,w))-d&&ws)return ws.decode((x(),G).slice(d,h));for(w="";d<h;++d){var y=(x(),G)[d>>>0];w+=String.fromCharCode(y)}return w},Gm=(d,h,w)=>{if(w??=2147483647,2>w)return 0;var y=h;w=(w-=2)<2*d.length?w/2:d.length;for(var T=0;T<w;++T){var z=d.charCodeAt(T);(x(),P)[h>>>1>>>0]=z,h+=2}return(x(),P)[h>>>1>>>0]=0,h-y},Vm=d=>2*d.length,Hm=(d,h,w)=>{var y="";d>>>=2;for(var T=0;!(T>=h/4);T++){var z=(x(),V)[d+T>>>0];if(!z&&!w)break;y+=String.fromCodePoint(z)}return y},Fm=(d,h,w)=>{if(h>>>=0,w??=2147483647,4>w)return 0;var y=h;w=y+w-4;for(var T=0;T<d.length;++T){var z=d.codePointAt(T);if(65535<z&&T++,(x(),M)[h>>>2>>>0]=z,(h+=4)+4>w)break}return(x(),M)[h>>>2>>>0]=0,h-y},jm=d=>{for(var h=0,w=0;w<d.length;++w)65535<d.codePointAt(w)&&w++,h+=4;return h};function Km(d,h,w){if(d>>>=0,h>>>=0,w=ct(w>>>=0),h===2)var y=qm,T=Gm,z=Vm;else y=Hm,T=Fm,z=jm;yt(d,{name:w,Zc:D=>{var H=(x(),V)[D>>>2>>>0];return H=y(D+4,H*h,!0),ht(D),H},ed:(D,H)=>{if(typeof H!="string")throw new er(`Cannot pass non-string to C++ string type ${w}`);var re=z(H),ne=mr(4+re+h);return(x(),V)[ne>>>2>>>0]=re/h,T(H,ne+4,re+h),D!==null&&D.push(ht,ne),ne},dd:Ci,gd(D){ht(D)}})}function Zm(d,h){yt(d>>>=0,{Kd:!0,name:h=ct(h>>>0),Zc:()=>{},ed:()=>{}})}function Ym(d){Ni(d>>>0,!i,1,!r,131072,!1),je()}var Lr=d=>{if(!E)try{if(d(),!(0<Me))try{n?jr()&&Ui(f):gt(f)}catch(h){h instanceof Y||h=="unwind"||l(0,h)}}catch(h){h instanceof Y||h=="unwind"||l(0,h)}},Xm=!Atomics.waitAsync||globalThis.navigator?.userAgent&&91>Number((navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)||[])[2]);function Ei(d){d>>>=0,Xm||(Atomics.waitAsync((x(),M),d>>>2,d).value.then(Wr),d+=128,Atomics.store((x(),M),d>>>2,1))}var Wr=()=>Lr(()=>{var d=jr();d&&(Ei(d),Fs())});function Qm(d,h){(d>>>=0)==h>>>0?setTimeout(Wr):n?postMessage({md:d,bd:"checkMailbox"}):(d=te[d])&&d.postMessage({bd:"checkMailbox"})}var zi=[];function Jm(d,h,w,y,T){for(h>>>=0,T>>>=0,zi.length=0,w=T>>>3,y=T+y>>>3;w<y;){var z;z=(x(),ee)[w++>>>0]?(x(),ee)[w++>>>0]:(x(),L)[w++>>>0],zi.push(z)}return(h?qi[h]:Gg[d])(...zi)}var eg=()=>{Me=0};function tg(d){d>>>=0,n?postMessage({bd:"cleanupThread",Yd:d}):fe(te[d])}function rg(d){}var qr=d=>{try{d()}catch(h){j(h)}};function ig(d){var h=(...w)=>{Gr.push(d);try{return d(...w)}finally{E||(Gr.pop(),pt&&Tt===1&&Gr.length===0&&(Tt=0,Me+=1,qr(No),typeof Fibers<"u"&&Fibers.ne()))}};return $s.set(d,h),h}var Tt=0,pt=null,_s=0,Gr=[],Mi=new Map,bs=new Map,$s=new Map,ng=0,Ai=null,ag=[],xs=d=>(function(h){if(!E){if(Tt===0){var w=!1,y=!1;h((T=0)=>{if(!E&&(_s=T,w=!0,y)){Tt=2,qr(()=>Uo(pt)),typeof MainLoop<"u"&&MainLoop.Ed&&MainLoop.resume(),T=!1;try{var z=(function(){var re=(x(),M)[pt+8>>>2>>>0];return re=bs.get(re),re=$s.get(re),--Me,re()})()}catch(re){z=re,T=!0}var D=!1;if(!pt){var H=Ai;H&&(Ai=null,(T?H.reject:H.resolve)(z),D=!0)}if(T&&!D)throw z}}),y=!0,w||(Tt=1,pt=(function(){var T=mr(65548),z=T+12;if((x(),V)[T>>>2>>>0]=z,(x(),V)[T+4>>>2>>>0]=z+65536,z=Gr[0],!Mi.has(z)){var D=ng++;Mi.set(z,D),bs.set(D,z)}return z=Mi.get(z),(x(),M)[T+8>>>2>>>0]=z,T})(),typeof MainLoop<"u"&&MainLoop.Ed&&MainLoop.pause(),qr(()=>Do(pt)))}else Tt===2?(Tt=0,qr(Po),ht(pt),pt=null,ag.forEach(Lr)):j(`invalid state: ${Tt}`);return _s}})(h=>{d().then(h)});function sg(d){return d>>>=0,xs(async()=>{var h=await tt(d);return nt(h)})}var Oi=[],og=d=>{var h=Oi.length;return Oi.push(d),h},ug=(d,h)=>{for(var w=Array(d),y=0;y<d;++y){var T=y,z=(x(),V)[h+4*y>>>2>>>0],D=Ii[z];if(D===void 0)throw d=`parameter ${y}`,z=Ls(z),h=ct(z),ht(z),new er(`${d} has unknown type ${h}`);w[T]=D}return w},lg=(d,h,w)=>{var y=[];return d=d(y,w),y.length&&((x(),V)[h>>>2>>>0]=nt(y)),d},dg={},Vr=d=>{var h=dg[d];return h===void 0?ct(d):h};function cg(d,h,w){var[y,...T]=ug(d,h>>>0);h=y.ed.bind(y);var z=T.map(re=>re.dd.bind(re));d--;var D={toValue:tt};switch(d=z.map((re,ne)=>{var me=`argFromPtr${ne}`;return D[me]=re,`${me}(args${ne?"+"+8*ne:""})`}),w){case 0:var H="toValue(handle)";break;case 2:H="new (toValue(handle))";break;case 3:H="";break;case 1:D.getStringOrSymbol=Vr,H="toValue(handle)[getStringOrSymbol(methodName)]"}return H+=`(${d})`,y.Kd||(D.toReturnWire=h,D.emval_returnValue=lg,H=`return emval_returnValue(toReturnWire, destructorsRef, ${H})`),H=`return function (handle, methodName, destructorsRef, args) {
  ${H}
  }`,w=new Function(Object.keys(D),H)(...Object.values(D)),H=`methodCaller<(${T.map(re=>re.name)}) => ${y.name}>`,og(Object.defineProperty(w,"name",{value:H}))}function pg(d,h){return h>>>=0,(d=tt(d>>>0))==tt(h)}function hg(d){return(d>>>=0)?(d=Vr(d),nt(globalThis[d])):nt(globalThis)}function fg(d){return d=Vr(d>>>0),nt(t[d])}function mg(d,h){return h>>>=0,d=tt(d>>>0),h=tt(h),nt(d[h])}function gg(d){9<(d>>>=0)&&(Rt[d+1]+=1)}function vs(d,h,w,y,T){return Oi[d>>>0](h>>>0,w>>>0,y>>>0,T>>>0)}function yg(d,h,w,y,T){return vs(d>>>0,h>>>0,w>>>0,y>>>0,T>>>0)}function wg(){return nt([])}function _g(d){d=tt(d>>>0);for(var h=Array(d.length),w=0;w<d.length;w++)h[w]=d[w];return nt(h)}function bg(d){return nt(Vr(d>>>0))}function $g(){return nt({})}function xg(d){for(var h=tt(d>>>=0);h.length;){var w=h.pop();h.pop()(w)}Ti(d)}function vg(d,h,w){h>>>=0,w>>>=0,d=tt(d>>>0),h=tt(h),w=tt(w),d[h]=w}function kg(d,h){d=-9007199254740992>d||9007199254740992<d?NaN:Number(d),h>>>=0,d=new Date(1e3*d),(x(),M)[h>>>2>>>0]=d.getUTCSeconds(),(x(),M)[h+4>>>2>>>0]=d.getUTCMinutes(),(x(),M)[h+8>>>2>>>0]=d.getUTCHours(),(x(),M)[h+12>>>2>>>0]=d.getUTCDate(),(x(),M)[h+16>>>2>>>0]=d.getUTCMonth(),(x(),M)[h+20>>>2>>>0]=d.getUTCFullYear()-1900,(x(),M)[h+24>>>2>>>0]=d.getUTCDay(),d=(d.getTime()-Date.UTC(d.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,(x(),M)[h+28>>>2>>>0]=d}var ks=d=>d%4==0&&(d%100!=0||d%400==0),Ss=[0,31,60,91,121,152,182,213,244,274,305,335],Is=[0,31,59,90,120,151,181,212,243,273,304,334];function Sg(d,h){d=-9007199254740992>d||9007199254740992<d?NaN:Number(d),h>>>=0,d=new Date(1e3*d),(x(),M)[h>>>2>>>0]=d.getSeconds(),(x(),M)[h+4>>>2>>>0]=d.getMinutes(),(x(),M)[h+8>>>2>>>0]=d.getHours(),(x(),M)[h+12>>>2>>>0]=d.getDate(),(x(),M)[h+16>>>2>>>0]=d.getMonth(),(x(),M)[h+20>>>2>>>0]=d.getFullYear()-1900,(x(),M)[h+24>>>2>>>0]=d.getDay();var w=(ks(d.getFullYear())?Ss:Is)[d.getMonth()]+d.getDate()-1|0;(x(),M)[h+28>>>2>>>0]=w,(x(),M)[h+36>>>2>>>0]=-60*d.getTimezoneOffset(),w=new Date(d.getFullYear(),6,1).getTimezoneOffset();var y=new Date(d.getFullYear(),0,1).getTimezoneOffset();d=0|(w!=y&&d.getTimezoneOffset()==Math.min(y,w)),(x(),M)[h+32>>>2>>>0]=d}function Ig(d){d>>>=0;var h=new Date((x(),M)[d+20>>>2>>>0]+1900,(x(),M)[d+16>>>2>>>0],(x(),M)[d+12>>>2>>>0],(x(),M)[d+8>>>2>>>0],(x(),M)[d+4>>>2>>>0],(x(),M)[d>>>2>>>0],0),w=(x(),M)[d+32>>>2>>>0],y=h.getTimezoneOffset(),T=new Date(h.getFullYear(),6,1).getTimezoneOffset(),z=new Date(h.getFullYear(),0,1).getTimezoneOffset(),D=Math.min(z,T);return 0>w?(x(),M)[d+32>>>2>>>0]=+(T!=z&&D==y):0<w!=(D==y)&&(T=Math.max(z,T),h.setTime(h.getTime()+6e4*((0<w?D:T)-y))),(x(),M)[d+24>>>2>>>0]=h.getDay(),w=(ks(h.getFullYear())?Ss:Is)[h.getMonth()]+h.getDate()-1|0,(x(),M)[d+28>>>2>>>0]=w,(x(),M)[d>>>2>>>0]=h.getSeconds(),(x(),M)[d+4>>>2>>>0]=h.getMinutes(),(x(),M)[d+8>>>2>>>0]=h.getHours(),(x(),M)[d+12>>>2>>>0]=h.getDate(),(x(),M)[d+16>>>2>>>0]=h.getMonth(),(x(),M)[d+20>>>2>>>0]=h.getYear(),d=h.getTime(),BigInt(isNaN(d)?-1:d/1e3)}function Ts(d,h,w,y,T,z,D){return n?de(16,1,d,h,w,y,T,z,D):-52}function Cs(d,h,w,y,T,z){if(n)return de(17,1,d,h,w,y,T,z)}var fr={},Tg=()=>performance.timeOrigin+performance.now();function Es(d,h){if(n)return de(18,1,d,h);if(fr[d]&&(clearTimeout(fr[d].id),delete fr[d]),!h)return 0;var w=setTimeout(()=>{delete fr[d],Lr(()=>Hs(d,performance.timeOrigin+performance.now()))},h);return fr[d]={id:w,me:h},0}function Cg(d,h,w,y){d>>>=0,h>>>=0,w>>>=0,y>>>=0;var T=new Date().getFullYear(),z=new Date(T,0,1).getTimezoneOffset();T=new Date(T,6,1).getTimezoneOffset();var D=Math.max(z,T);(x(),V)[d>>>2>>>0]=60*D,(x(),M)[h>>>2>>>0]=+(z!=T),d=(h=H=>{var re=Math.abs(H);return`UTC${0<=H?"-":"+"}${String(Math.floor(re/60)).padStart(2,"0")}${String(re%60).padStart(2,"0")}`})(z),h=h(T),T<z?(It(d,w,17),It(h,y,17)):(It(d,y,17),It(h,w,17))}var Eg=()=>Date.now();function zg(d,h,w){return w>>>=0,0<=d&&3>=d?(d===0?d=Date.now():d=performance.timeOrigin+performance.now(),d=Math.round(1e6*d),(x(),ee)[w>>>3>>>0]=BigInt(d),0):28}var Bi=[],zs=(d,h)=>{Bi.length=0;for(var w;w=(x(),R)[d++>>>0];){var y=w!=105;h+=(y&=w!=112)&&h%8?4:0,Bi.push(w==112?(x(),V)[h>>>2>>>0]:w==106?(x(),ee)[h>>>3>>>0]:w==105?(x(),M)[h>>>2>>>0]:(x(),L)[h>>>3>>>0]),h+=y?8:4}return Bi};function Mg(d,h,w){return d>>>=0,h=zs(h>>>0,w>>>0),qi[d](...h)}function Ag(d,h,w){return d>>>=0,h=zs(h>>>0,w>>>0),qi[d](...h)}var Og=()=>{};function Bg(d,h){return S(De(d>>>0,h>>>0))}var Rg=()=>{throw Me+=1,"unwind"};function Dg(){return 4294901760}var Ng=()=>navigator.hardwareConcurrency,Dt={},Hr=d=>{var h;return(h=/\bwasm-function\[\d+\]:(0x[0-9a-f]+)/.exec(d))?+h[1]:(h=/:(\d+):\d+(?:\)|$)/.exec(d))?2147483648|+h[1]:0},Ms=d=>{for(var h of d)(d=Hr(h))&&(Dt[d]=h)};function Ug(){var d=Error().stack.toString().split(`
`);return d[0]=="Error"&&d.shift(),Ms(d),Dt.sd=Hr(d[3]),Dt.Ud=d,Dt.sd}function Fr(d){if(!(d=Dt[d>>>0]))return 0;var h;if(h=/^\s+at .*\.wasm\.(.*) \(.*\)$/.exec(d))d=h[1];else if(h=/^\s+at (.*) \(.*\)$/.exec(d))d=h[1];else{if(!(h=/^(.+?)@/.exec(d)))return 0;d=h[1]}ht(Fr.td??0),h=Pr(d)+1;var w=mr(h);return w&&It(d,w,h),Fr.td=w,Fr.td}function Pg(d){d>>>=0;var h=(x(),R).length;if(d<=h||4294901760<d)return!1;for(var w=1;4>=w;w*=2){var y=h*(1+.2/w);y=Math.min(y,d+100663296);e:{y=(Math.min(4294901760,65536*Math.ceil(Math.max(d,y)/65536))-Ue.buffer.byteLength+65535)/65536|0;try{Ue.grow(y),W();var T=1;break e}catch{}T=void 0}if(T)return!0}return!1}function Lg(d,h,w){if(d>>>=0,h>>>=0,Dt.sd==d)var y=Dt.Ud;else(y=Error().stack.toString().split(`
`))[0]=="Error"&&y.shift(),Ms(y);for(var T=3;y[T]&&Hr(y[T])!=d;)++T;for(d=0;d<w&&y[d+T];++d)(x(),M)[h+4*d>>>2>>>0]=Hr(y[d+T]);return d}var Ri,Di={},As=()=>{if(!Ri){var d,h={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(globalThis.navigator?.language??"C").replace("-","_")+".UTF-8",_:"./this.program"};for(d in Di)Di[d]===void 0?delete h[d]:h[d]=Di[d];var w=[];for(d in h)w.push(`${d}=${h[d]}`);Ri=w}return Ri};function Os(d,h){if(n)return de(19,1,d,h);d>>>=0,h>>>=0;var w,y=0,T=0;for(w of As()){var z=h+y;(x(),V)[d+T>>>2>>>0]=z,y+=It(w,z,1/0)+1,T+=4}return 0}function Bs(d,h){if(n)return de(20,1,d,h);d>>>=0,h>>>=0;var w=As();for(var y of((x(),V)[d>>>2>>>0]=w.length,d=0,w))d+=Pr(y)+1;return(x(),V)[h>>>2>>>0]=d,0}function Rs(d){return n?de(21,1,d):52}function Ds(d,h,w,y,T){return n?de(22,1,d,h,w,y,T):52}function Ns(d,h,w,y){return n?de(23,1,d,h,w,y):52}function Us(d,h,w,y){return n?de(24,1,d,h,w,y):70}var Wg=[null,[],[]];function Ps(d,h,w,y){if(n)return de(25,1,d,h,w,y);h>>>=0,w>>>=0,y>>>=0;for(var T=0,z=0;z<w;z++){var D=(x(),V)[h>>>2>>>0],H=(x(),V)[h+4>>>2>>>0];h+=8;for(var re=0;re<H;re++){var ne=d,me=(x(),R)[D+re>>>0],ve=Wg[ne];me===0||me===10?((ne===1?I:S)(rs(ve)),ve.length=0):ve.push(me)}T+=H}return(x(),V)[y>>>2>>>0]=T,0}function qg(d){return d>>>0}n||(function(){for(var d=t.numThreads-1;d--;)Pe();ce.push(async()=>{var h=(async function(){if(!n)return Promise.all(Ze.map(qe))})();Ie++,await h,--Ie==0&&xe&&(h=xe,xe=null,h())})})(),n||(Ue=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0}),W()),t.wasmBinary&&(m=t.wasmBinary),t.stackSave=()=>we(),t.stackRestore=d=>ye(d),t.stackAlloc=d=>Pi(d),t.setValue=function(d,h,w="i8"){switch(w.endsWith("*")&&(w="*"),w){case"i1":case"i8":(x(),N)[d>>>0]=h;break;case"i16":(x(),P)[d>>>1>>>0]=h;break;case"i32":(x(),M)[d>>>2>>>0]=h;break;case"i64":(x(),ee)[d>>>3>>>0]=BigInt(h);break;case"float":(x(),K)[d>>>2>>>0]=h;break;case"double":(x(),L)[d>>>3>>>0]=h;break;case"*":(x(),V)[d>>>2>>>0]=h;break;default:j(`invalid type for setValue: ${w}`)}},t.getValue=function(d,h="i8"){switch(h.endsWith("*")&&(h="*"),h){case"i1":case"i8":return(x(),N)[d>>>0];case"i16":return(x(),P)[d>>>1>>>0];case"i32":return(x(),M)[d>>>2>>>0];case"i64":return(x(),ee)[d>>>3>>>0];case"float":return(x(),K)[d>>>2>>>0];case"double":return(x(),L)[d>>>3>>>0];case"*":return(x(),V)[d>>>2>>>0];default:j(`invalid type for getValue: ${h}`)}},t.UTF8ToString=De,t.stringToUTF8=It,t.lengthBytesUTF8=Pr;var Ls,Ws,jr,ht,mr,Ni,qs,Gs,Vs,Ui,Hs,Fs,_e,gr,js,ye,Pi,we,Ks,Li,Zs,Ys,Xs,Wi,Qs,Js,eo,to,ro,io,no,ao,so,oo,uo,lo,co,po,ho,fo,mo,go,yo,wo,_o,bo,$o,xo,vo,ko,So,Io,To,Co,Eo,zo,Mo,Ao,Oo,Bo,Ro,Do,No,Uo,Po,wt,Gg=[Ne,He,Qa,is,ns,as,ss,os,us,ls,ds,cs,ps,hs,fs,ms,Ts,Cs,Es,Os,Bs,Rs,Ds,Ns,Us,Ps],qi={1124124:(d,h,w,y,T)=>{if(t===void 0||!t.jd)return 1;if((d=De(Number(d>>>0))).startsWith("./")&&(d=d.substring(2)),!(d=t.jd.get(d)))return 2;if(h=Number(h>>>0),w=Number(w>>>0),y=Number(y>>>0),h+w>d.byteLength)return 3;try{let z=d.subarray(h,h+w);switch(T){case 0:(x(),R).set(z,y>>>0);break;case 1:t.ae?t.ae(y,z):t.Td(y,z);break;default:return 4}return 0}catch{return 4}},1124948:()=>typeof navigator<"u"&&navigator.de?1:0,1125020:(d,h,w)=>{t.Dd(d,(x(),R).subarray(h>>>0,h+w>>>0))},1125084:()=>t.ce(),1125126:d=>{t.Cd(d)},1125163:()=>{t.Md()},1125194:()=>{t.Nd()},1125223:()=>{t.Rd()},1125248:d=>t.Ld(d),1125281:d=>t.Pd(d),1125313:(d,h,w)=>{t.rd(Number(d),Number(h),Number(w),!0)},1125376:(d,h,w)=>{t.rd(Number(d),Number(h),Number(w))},1125433:()=>typeof wasmOffsetConverter<"u",1125490:d=>{t.ic("Abs",d,void 0)},1125541:d=>{t.ic("Neg",d,void 0)},1125592:d=>{t.ic("Floor",d,void 0)},1125645:d=>{t.ic("Ceil",d,void 0)},1125697:d=>{t.ic("Reciprocal",d,void 0)},1125755:d=>{t.ic("Sqrt",d,void 0)},1125807:d=>{t.ic("Exp",d,void 0)},1125858:d=>{t.ic("Erf",d,void 0)},1125909:d=>{t.ic("Sigmoid",d,void 0)},1125964:(d,h,w)=>{t.ic("HardSigmoid",d,{alpha:h,beta:w})},1126043:d=>{t.ic("HardSwish",d,void 0)},1126100:d=>{t.ic("Log",d,void 0)},1126151:d=>{t.ic("Sin",d,void 0)},1126202:d=>{t.ic("Cos",d,void 0)},1126253:d=>{t.ic("Tan",d,void 0)},1126304:d=>{t.ic("Asin",d,void 0)},1126356:d=>{t.ic("Acos",d,void 0)},1126408:d=>{t.ic("Atan",d,void 0)},1126460:d=>{t.ic("Sinh",d,void 0)},1126512:d=>{t.ic("Cosh",d,void 0)},1126564:d=>{t.ic("Asinh",d,void 0)},1126617:d=>{t.ic("Acosh",d,void 0)},1126670:d=>{t.ic("Atanh",d,void 0)},1126723:d=>{t.ic("Tanh",d,void 0)},1126775:d=>{t.ic("Not",d,void 0)},1126826:(d,h,w)=>{t.ic("Clip",d,{min:h,max:w})},1126895:d=>{t.ic("Clip",d,void 0)},1126947:(d,h)=>{t.ic("Elu",d,{alpha:h})},1127005:d=>{t.ic("Gelu",d,void 0)},1127057:d=>{t.ic("Relu",d,void 0)},1127109:(d,h)=>{t.ic("LeakyRelu",d,{alpha:h})},1127173:(d,h)=>{t.ic("ThresholdedRelu",d,{alpha:h})},1127243:(d,h)=>{t.ic("Cast",d,{to:h})},1127301:d=>{t.ic("Add",d,void 0)},1127352:d=>{t.ic("Sub",d,void 0)},1127403:d=>{t.ic("Mul",d,void 0)},1127454:d=>{t.ic("Div",d,void 0)},1127505:d=>{t.ic("Pow",d,void 0)},1127556:d=>{t.ic("Equal",d,void 0)},1127609:d=>{t.ic("Greater",d,void 0)},1127664:d=>{t.ic("GreaterOrEqual",d,void 0)},1127726:d=>{t.ic("Less",d,void 0)},1127778:d=>{t.ic("LessOrEqual",d,void 0)},1127837:(d,h,w,y,T)=>{t.ic("ReduceMean",d,{keepDims:!!h,noopWithEmptyAxes:!!w,axes:y?Array.from((x(),M).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1128012:(d,h,w,y,T)=>{t.ic("ReduceMax",d,{keepDims:!!h,noopWithEmptyAxes:!!w,axes:y?Array.from((x(),M).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1128186:(d,h,w,y,T)=>{t.ic("ReduceMin",d,{keepDims:!!h,noopWithEmptyAxes:!!w,axes:y?Array.from((x(),M).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1128360:(d,h,w,y,T)=>{t.ic("ReduceProd",d,{keepDims:!!h,noopWithEmptyAxes:!!w,axes:y?Array.from((x(),M).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1128535:(d,h,w,y,T)=>{t.ic("ReduceSum",d,{keepDims:!!h,noopWithEmptyAxes:!!w,axes:y?Array.from((x(),M).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1128709:(d,h,w,y,T)=>{t.ic("ReduceL1",d,{keepDims:!!h,noopWithEmptyAxes:!!w,axes:y?Array.from((x(),M).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1128882:(d,h,w,y,T)=>{t.ic("ReduceL2",d,{keepDims:!!h,noopWithEmptyAxes:!!w,axes:y?Array.from((x(),M).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1129055:(d,h,w,y,T)=>{t.ic("ReduceLogSum",d,{keepDims:!!h,noopWithEmptyAxes:!!w,axes:y?Array.from((x(),M).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1129232:(d,h,w,y,T)=>{t.ic("ReduceSumSquare",d,{keepDims:!!h,noopWithEmptyAxes:!!w,axes:y?Array.from((x(),M).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1129412:(d,h,w,y,T)=>{t.ic("ReduceLogSumExp",d,{keepDims:!!h,noopWithEmptyAxes:!!w,axes:y?Array.from((x(),M).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1129592:d=>{t.ic("Where",d,void 0)},1129645:(d,h,w)=>{t.ic("Transpose",d,{perm:h?Array.from((x(),M).subarray(Number(h)>>>0,Number(w)>>>0)):[]})},1129769:(d,h,w,y)=>{t.ic("DepthToSpace",d,{blocksize:h,mode:De(w),format:y?"NHWC":"NCHW"})},1129902:(d,h,w,y)=>{t.ic("DepthToSpace",d,{blocksize:h,mode:De(w),format:y?"NHWC":"NCHW"})},1130035:(d,h,w,y)=>{t.ic("DFT",d,{axis:h,inverse:w,onesided:y})},1130127:(d,h,w,y,T,z,D,H,re,ne,me,ve,ze,Ae,Ct)=>{t.ic("ConvTranspose",d,{format:re?"NHWC":"NCHW",autoPad:h,dilations:[w],group:y,kernelShape:[T],pads:[z,D],strides:[H],wIsConst:()=>!!(x(),N)[ne>>>0],outputPadding:me?Array.from((x(),M).subarray(Number(me)>>>0,Number(ve)>>>0)):[],outputShape:ze?Array.from((x(),M).subarray(Number(ze)>>>0,Number(Ae)>>>0)):[],activation:De(Ct)})},1130560:(d,h,w,y,T,z,D,H,re,ne,me,ve,ze,Ae)=>{t.ic("ConvTranspose",d,{format:H?"NHWC":"NCHW",autoPad:h,dilations:Array.from((x(),M).subarray(Number(w)>>>0,(Number(w)>>>0)+2>>>0)),group:y,kernelShape:Array.from((x(),M).subarray(Number(T)>>>0,(Number(T)>>>0)+2>>>0)),pads:Array.from((x(),M).subarray(Number(z)>>>0,(Number(z)>>>0)+4>>>0)),strides:Array.from((x(),M).subarray(Number(D)>>>0,(Number(D)>>>0)+2>>>0)),wIsConst:()=>!!(x(),N)[re>>>0],outputPadding:ne?Array.from((x(),M).subarray(Number(ne)>>>0,Number(me)>>>0)):[],outputShape:ve?Array.from((x(),M).subarray(Number(ve)>>>0,Number(ze)>>>0)):[],activation:De(Ae)})},1131221:(d,h,w,y,T,z,D,H,re,ne,me,ve,ze,Ae,Ct)=>{t.ic("ConvTranspose",d,{format:re?"NHWC":"NCHW",autoPad:h,dilations:[w],group:y,kernelShape:[T],pads:[z,D],strides:[H],wIsConst:()=>!!(x(),N)[ne>>>0],outputPadding:me?Array.from((x(),M).subarray(Number(me)>>>0,Number(ve)>>>0)):[],outputShape:ze?Array.from((x(),M).subarray(Number(ze)>>>0,Number(Ae)>>>0)):[],activation:De(Ct)})},1131654:(d,h,w,y,T,z,D,H,re,ne,me,ve,ze,Ae)=>{t.ic("ConvTranspose",d,{format:H?"NHWC":"NCHW",autoPad:h,dilations:Array.from((x(),M).subarray(Number(w)>>>0,(Number(w)>>>0)+2>>>0)),group:y,kernelShape:Array.from((x(),M).subarray(Number(T)>>>0,(Number(T)>>>0)+2>>>0)),pads:Array.from((x(),M).subarray(Number(z)>>>0,(Number(z)>>>0)+4>>>0)),strides:Array.from((x(),M).subarray(Number(D)>>>0,(Number(D)>>>0)+2>>>0)),wIsConst:()=>!!(x(),N)[re>>>0],outputPadding:ne?Array.from((x(),M).subarray(Number(ne)>>>0,Number(me)>>>0)):[],outputShape:ve?Array.from((x(),M).subarray(Number(ve)>>>0,Number(ze)>>>0)):[],activation:De(Ae)})},1132315:(d,h)=>{t.ic("GlobalAveragePool",d,{format:h?"NHWC":"NCHW"})},1132406:(d,h,w,y,T,z,D,H,re,ne,me,ve,ze,Ae)=>{t.ic("AveragePool",d,{format:Ae?"NHWC":"NCHW",auto_pad:h,ceil_mode:w,count_include_pad:y,storage_order:T,dilations:z?Array.from((x(),M).subarray(Number(z)>>>0,Number(D)>>>0)):[],kernel_shape:H?Array.from((x(),M).subarray(Number(H)>>>0,Number(re)>>>0)):[],pads:ne?Array.from((x(),M).subarray(Number(ne)>>>0,Number(me)>>>0)):[],strides:ve?Array.from((x(),M).subarray(Number(ve)>>>0,Number(ze)>>>0)):[]})},1132885:(d,h)=>{t.ic("GlobalAveragePool",d,{format:h?"NHWC":"NCHW"})},1132976:(d,h,w,y,T,z,D,H,re,ne,me,ve,ze,Ae)=>{t.ic("AveragePool",d,{format:Ae?"NHWC":"NCHW",auto_pad:h,ceil_mode:w,count_include_pad:y,storage_order:T,dilations:z?Array.from((x(),M).subarray(Number(z)>>>0,Number(D)>>>0)):[],kernel_shape:H?Array.from((x(),M).subarray(Number(H)>>>0,Number(re)>>>0)):[],pads:ne?Array.from((x(),M).subarray(Number(ne)>>>0,Number(me)>>>0)):[],strides:ve?Array.from((x(),M).subarray(Number(ve)>>>0,Number(ze)>>>0)):[]})},1133455:(d,h)=>{t.ic("GlobalMaxPool",d,{format:h?"NHWC":"NCHW"})},1133542:(d,h,w,y,T,z,D,H,re,ne,me,ve,ze,Ae)=>{t.ic("MaxPool",d,{format:Ae?"NHWC":"NCHW",auto_pad:h,ceil_mode:w,count_include_pad:y,storage_order:T,dilations:z?Array.from((x(),M).subarray(Number(z)>>>0,Number(D)>>>0)):[],kernel_shape:H?Array.from((x(),M).subarray(Number(H)>>>0,Number(re)>>>0)):[],pads:ne?Array.from((x(),M).subarray(Number(ne)>>>0,Number(me)>>>0)):[],strides:ve?Array.from((x(),M).subarray(Number(ve)>>>0,Number(ze)>>>0)):[]})},1134017:(d,h)=>{t.ic("GlobalMaxPool",d,{format:h?"NHWC":"NCHW"})},1134104:(d,h,w,y,T,z,D,H,re,ne,me,ve,ze,Ae)=>{t.ic("MaxPool",d,{format:Ae?"NHWC":"NCHW",auto_pad:h,ceil_mode:w,count_include_pad:y,storage_order:T,dilations:z?Array.from((x(),M).subarray(Number(z)>>>0,Number(D)>>>0)):[],kernel_shape:H?Array.from((x(),M).subarray(Number(H)>>>0,Number(re)>>>0)):[],pads:ne?Array.from((x(),M).subarray(Number(ne)>>>0,Number(me)>>>0)):[],strides:ve?Array.from((x(),M).subarray(Number(ve)>>>0,Number(ze)>>>0)):[]})},1134579:(d,h,w,y,T)=>{t.ic("Gemm",d,{alpha:h,beta:w,transA:y,transB:T})},1134683:d=>{t.ic("MatMul",d,void 0)},1134737:(d,h,w,y)=>{t.ic("ArgMax",d,{keepDims:!!h,selectLastIndex:!!w,axis:y})},1134845:(d,h,w,y)=>{t.ic("ArgMin",d,{keepDims:!!h,selectLastIndex:!!w,axis:y})},1134953:(d,h)=>{t.ic("Softmax",d,{axis:h})},1135016:(d,h)=>{t.ic("Concat",d,{axis:h})},1135076:(d,h,w,y,T)=>{t.ic("Split",d,{axis:h,numOutputs:w,splitSizes:y?Array.from((x(),M).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1135232:d=>{t.ic("Expand",d,void 0)},1135286:(d,h)=>{t.ic("Gather",d,{axis:Number(h)})},1135357:(d,h)=>{t.ic("GatherElements",d,{axis:Number(h)})},1135436:(d,h)=>{t.ic("GatherND",d,{batch_dims:Number(h)})},1135515:(d,h,w,y,T,z,D,H,re,ne,me)=>{t.ic("Resize",d,{antialias:h,axes:w?Array.from((x(),M).subarray(Number(w)>>>0,Number(y)>>>0)):[],coordinateTransformMode:De(T),cubicCoeffA:z,excludeOutside:D,extrapolationValue:H,keepAspectRatioPolicy:De(re),mode:De(ne),nearestMode:De(me)})},1135877:(d,h,w,y,T,z,D)=>{t.ic("Slice",d,{starts:h?Array.from((x(),M).subarray(Number(h)>>>0,Number(w)>>>0)):[],ends:y?Array.from((x(),M).subarray(Number(y)>>>0,Number(T)>>>0)):[],axes:z?Array.from((x(),M).subarray(Number(z)>>>0,Number(D)>>>0)):[]})},1136141:d=>{t.ic("Tile",d,void 0)},1136193:(d,h,w)=>{t.ic("InstanceNormalization",d,{epsilon:h,format:w?"NHWC":"NCHW"})},1136307:(d,h,w)=>{t.ic("InstanceNormalization",d,{epsilon:h,format:w?"NHWC":"NCHW"})},1136421:d=>{t.ic("Range",d,void 0)},1136474:(d,h)=>{t.ic("Einsum",d,{equation:De(h)})},1136555:(d,h,w,y,T)=>{t.ic("Pad",d,{mode:h,value:w,pads:y?Array.from((x(),M).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1136698:(d,h,w,y,T,z)=>{t.ic("BatchNormalization",d,{epsilon:h,momentum:w,spatial:!!T,trainingMode:!!y,format:z?"NHWC":"NCHW"})},1136867:(d,h,w,y,T,z)=>{t.ic("BatchNormalization",d,{epsilon:h,momentum:w,spatial:!!T,trainingMode:!!y,format:z?"NHWC":"NCHW"})},1137036:(d,h,w)=>{t.ic("CumSum",d,{exclusive:Number(h),reverse:Number(w)})},1137133:(d,h,w)=>{t.ic("DequantizeLinear",d,{axis:h,blockSize:w})},1137223:(d,h,w,y,T)=>{t.ic("GridSample",d,{align_corners:h,mode:De(w),padding_mode:De(y),format:T?"NHWC":"NCHW"})},1137393:(d,h,w,y,T)=>{t.ic("GridSample",d,{align_corners:h,mode:De(w),padding_mode:De(y),format:T?"NHWC":"NCHW"})},1137563:(d,h)=>{t.ic("ScatterND",d,{reduction:De(h)})},1137648:(d,h,w,y,T,z,D,H,re)=>{t.ic("Attention",d,{numHeads:h,isUnidirectional:w,maskFilterValue:y,scale:T,doRotary:z,qkvHiddenSizes:D?Array.from((x(),M).subarray(Number(H)>>>0,Number(H)+D>>>0)):[],pastPresentShareBuffer:!!re})},1137920:d=>{t.ic("BiasAdd",d,void 0)},1137975:d=>{t.ic("BiasSplitGelu",d,void 0)},1138036:d=>{t.ic("FastGelu",d,void 0)},1138092:(d,h,w,y,T,z,D,H,re,ne,me,ve,ze,Ae,Ct,Gi)=>{t.ic("Conv",d,{format:ve?"NHWC":"NCHW",auto_pad:h,dilations:w?Array.from((x(),M).subarray(Number(w)>>>0,Number(y)>>>0)):[],group:T,kernel_shape:z?Array.from((x(),M).subarray(Number(z)>>>0,Number(D)>>>0)):[],pads:H?Array.from((x(),M).subarray(Number(H)>>>0,Number(re)>>>0)):[],strides:ne?Array.from((x(),M).subarray(Number(ne)>>>0,Number(me)>>>0)):[],w_is_const:()=>!!(x(),N)[Number(ze)>>>0],activation:De(Ae),activation_params:Ct?Array.from((x(),K).subarray(Number(Ct)>>>0,Number(Gi)>>>0)):[]})},1138676:d=>{t.ic("Gelu",d,void 0)},1138728:(d,h,w,y,T,z,D,H,re)=>{t.ic("GroupQueryAttention",d,{numHeads:h,kvNumHeads:w,scale:y,softcap:T,doRotary:z,rotaryInterleaved:D,smoothSoftmax:H,localWindowSize:re})},1138945:(d,h,w,y)=>{t.ic("LayerNormalization",d,{axis:h,epsilon:w,simplified:!!y})},1139056:(d,h,w,y)=>{t.ic("LayerNormalization",d,{axis:h,epsilon:w,simplified:!!y})},1139167:(d,h,w,y,T,z)=>{t.ic("MatMulNBits",d,{k:h,n:w,accuracyLevel:y,bits:T,blockSize:z})},1139294:(d,h,w,y,T,z)=>{t.ic("MultiHeadAttention",d,{numHeads:h,isUnidirectional:w,maskFilterValue:y,scale:T,doRotary:z})},1139453:(d,h)=>{t.ic("QuickGelu",d,{alpha:h})},1139517:(d,h,w,y,T)=>{t.ic("RotaryEmbedding",d,{interleaved:!!h,numHeads:w,rotaryEmbeddingDim:y,scale:T})},1139656:(d,h,w)=>{t.ic("SkipLayerNormalization",d,{epsilon:h,simplified:!!w})},1139758:(d,h,w)=>{t.ic("SkipLayerNormalization",d,{epsilon:h,simplified:!!w})},1139860:(d,h,w,y)=>{t.ic("GatherBlockQuantized",d,{gatherAxis:h,quantizeAxis:w,blockSize:y})},1139981:d=>{t.Qd(d)},1140015:(d,h)=>t.Sd(Number(d),Number(h),t.hd.Vd,t.hd.errors)};function Vg(d,h,w){return xs(async()=>{await t.Od(Number(d),Number(h),Number(w))})}function Hg(){return typeof wasmOffsetConverter<"u"}function Fg(d,h,w,y){var T=we();try{return so(d,h,w,y)}catch(z){if(ye(T),z!==z+0)throw z;_e(1,0)}}function jg(d,h,w){var y=we();try{return no(d,h,w)}catch(T){if(ye(y),T!==T+0)throw T;_e(1,0)}}function Kg(d){var h=we();try{ro(d)}catch(w){if(ye(h),w!==w+0)throw w;_e(1,0)}}function Zg(d,h){var w=we();try{return Wi(d,h)}catch(y){if(ye(w),y!==y+0)throw y;_e(1,0)}}function Yg(d,h,w){var y=we();try{Xs(d,h,w)}catch(T){if(ye(y),T!==T+0)throw T;_e(1,0)}}function Xg(d,h,w,y){var T=we();try{return po(d,h,w,y)}catch(z){if(ye(T),z!==z+0)throw z;_e(1,0)}}function Qg(d,h){var w=we();try{oo(d,h)}catch(y){if(ye(w),y!==y+0)throw y;_e(1,0)}}function Jg(d,h,w,y,T,z,D){var H=we();try{return ao(d,h,w,y,T,z,D)}catch(re){if(ye(H),re!==re+0)throw re;_e(1,0)}}function e0(d,h,w,y,T,z){var D=we();try{Qs(d,h,w,y,T,z)}catch(H){if(ye(D),H!==H+0)throw H;_e(1,0)}}function t0(d,h,w,y){var T=we();try{eo(d,h,w,y)}catch(z){if(ye(T),z!==z+0)throw z;_e(1,0)}}function r0(d,h,w,y,T){var z=we();try{io(d,h,w,y,T)}catch(D){if(ye(z),D!==D+0)throw D;_e(1,0)}}function i0(d,h,w,y,T,z,D){var H=we();try{lo(d,h,w,y,T,z,D)}catch(re){if(ye(H),re!==re+0)throw re;_e(1,0)}}function n0(d,h,w,y,T,z,D){var H=we();try{co(d,h,w,y,T,z,D)}catch(re){if(ye(H),re!==re+0)throw re;_e(1,0)}}function a0(d,h,w,y,T,z,D,H){var re=we();try{go(d,h,w,y,T,z,D,H)}catch(ne){if(ye(re),ne!==ne+0)throw ne;_e(1,0)}}function s0(d,h,w,y,T){var z=we();try{return uo(d,h,w,y,T)}catch(D){if(ye(z),D!==D+0)throw D;_e(1,0)}}function o0(d,h,w){var y=we();try{return to(d,h,w)}catch(T){if(ye(y),T!==T+0)throw T;_e(1,0)}}function u0(d,h,w,y,T,z,D,H){var re=we();try{yo(d,h,w,y,T,z,D,H)}catch(ne){if(ye(re),ne!==ne+0)throw ne;_e(1,0)}}function l0(d,h,w,y,T,z,D,H,re,ne,me,ve){var ze=we();try{ho(d,h,w,y,T,z,D,H,re,ne,me,ve)}catch(Ae){if(ye(ze),Ae!==Ae+0)throw Ae;_e(1,0)}}function d0(d,h,w){var y=we();try{return wo(d,h,w)}catch(T){if(ye(y),T!==T+0)throw T;return _e(1,0),0n}}function c0(d,h,w,y,T,z,D,H,re){var ne=we();try{Js(d,h,w,y,T,z,D,H,re)}catch(me){if(ye(ne),me!==me+0)throw me;_e(1,0)}}function p0(d){var h=we();try{return _o(d)}catch(w){if(ye(h),w!==w+0)throw w;_e(1,0)}}function h0(d,h){var w=we();try{return Bo(d,h)}catch(y){if(ye(w),y!==y+0)throw y;return _e(1,0),0n}}function f0(d,h,w,y){var T=we();try{return bo(d,h,w,y)}catch(z){if(ye(T),z!==z+0)throw z;_e(1,0)}}function m0(d,h,w,y,T,z,D){var H=we();try{Ro(d,h,w,y,T,z,D)}catch(re){if(ye(H),re!==re+0)throw re;_e(1,0)}}function g0(d){var h=we();try{return $o(d)}catch(w){if(ye(h),w!==w+0)throw w;return _e(1,0),0n}}function y0(d,h,w,y,T){var z=we();try{return To(d,h,w,y,T)}catch(D){if(ye(z),D!==D+0)throw D;_e(1,0)}}function w0(d,h,w,y,T,z){var D=we();try{return Co(d,h,w,y,T,z)}catch(H){if(ye(D),H!==H+0)throw H;_e(1,0)}}function _0(d,h,w,y,T,z){var D=we();try{return fo(d,h,w,y,T,z)}catch(H){if(ye(D),H!==H+0)throw H;_e(1,0)}}function b0(d,h,w,y,T,z){var D=we();try{return Eo(d,h,w,y,T,z)}catch(H){if(ye(D),H!==H+0)throw H;_e(1,0)}}function $0(d,h,w,y,T,z,D,H){var re=we();try{return mo(d,h,w,y,T,z,D,H)}catch(ne){if(ye(re),ne!==ne+0)throw ne;_e(1,0)}}function x0(d,h,w,y,T){var z=we();try{return zo(d,h,w,y,T)}catch(D){if(ye(z),D!==D+0)throw D;return _e(1,0),0n}}function v0(d,h,w,y){var T=we();try{return Mo(d,h,w,y)}catch(z){if(ye(T),z!==z+0)throw z;_e(1,0)}}function k0(d,h,w,y){var T=we();try{return Ao(d,h,w,y)}catch(z){if(ye(T),z!==z+0)throw z;_e(1,0)}}function S0(d,h,w,y,T,z,D,H,re,ne,me,ve){var ze=we();try{return Oo(d,h,w,y,T,z,D,H,re,ne,me,ve)}catch(Ae){if(ye(ze),Ae!==Ae+0)throw Ae;_e(1,0)}}function I0(d,h,w,y,T,z,D,H,re,ne,me){var ve=we();try{So(d,h,w,y,T,z,D,H,re,ne,me)}catch(ze){if(ye(ve),ze!==ze+0)throw ze;_e(1,0)}}function T0(d,h,w,y,T,z,D,H,re,ne,me,ve,ze,Ae,Ct,Gi){var M0=we();try{Io(d,h,w,y,T,z,D,H,re,ne,me,ve,ze,Ae,Ct,Gi)}catch(Vi){if(ye(M0),Vi!==Vi+0)throw Vi;_e(1,0)}}function C0(d,h,w){var y=we();try{return xo(d,h,w)}catch(T){if(ye(y),T!==T+0)throw T;_e(1,0)}}function E0(d,h,w){var y=we();try{return vo(d,h,w)}catch(T){if(ye(y),T!==T+0)throw T;_e(1,0)}}function z0(d,h,w,y){var T=we();try{ko(d,h,w,y)}catch(z){if(ye(T),z!==z+0)throw z;_e(1,0)}}function Kr(){if(0<Ie)xe=Kr;else if(n)_?.(t),q();else{for(var d=ce;0<d.length;)d.shift()(t);0<Ie?xe=Kr:(t.calledRun=!0,E||(q(),_?.(t)))}}return n||(wt=await ge(),Kr()),t.PTR_SIZE=4,A?t:new Promise((d,h)=>{_=d,v=h})}var ep,qo,ey=X(()=>{"use strict";ep=Wo,qo=globalThis.self?.name?.startsWith("em-pthread"),qo&&Wo()}),Qi,ea,Go,Ye,tp,Yr,Vo,Ho,Ji,Fo,en,rp,tn,ip,va=X(()=>{"use strict";xa(),Qi=typeof location>"u"?void 0:location.origin,ea=import.meta.url>"file:"&&import.meta.url<"file;",Go=()=>{if(ea){let e=URL;return new URL(new e("ort.bundle.min.mjs",import.meta.url).href,Qi).href}return import.meta.url},Ye=Go(),tp=()=>{if(Ye&&!Ye.startsWith("blob:"))return Ye.substring(0,Ye.lastIndexOf("/")+1)},Yr=(e,t)=>{try{let r=t??Ye;return(r?new URL(e,r):new URL(e)).origin===Qi}catch{return!1}},Vo=(e,t)=>{let r=t??Ye;try{return(r?new URL(e,r):new URL(e)).href}catch{return}},Ho=(e,t)=>`${t??"./"}${e}`,Ji=async e=>{let t=await(await fetch(e,{credentials:"same-origin"})).blob();return URL.createObjectURL(t)},Fo=async e=>(await import(e)).default,en=(J0(),Rr(Xc)).default,rp=async()=>{if(!Ye)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(Yr(Ye))return[void 0,en()];let e=await Ji(Ye);return[e,en(e)]},tn=(ey(),Rr(Jc)).default,ip=async(e,t,r,i)=>{let n=tn&&!(e||t);if(n)if(Ye)n=Yr(Ye)||i&&!r;else if(i&&!r)n=!0;else throw new Error("cannot determine the script source URL.");if(n)return[void 0,tn];{let a="ort-wasm-simd-threaded.jsep.mjs",s=e??Vo(a,t),o=r&&s&&!Yr(s,t),u=o?await Ji(s):s??Ho(a,t);return[o?u:void 0,await Fo(u)]}}}),rn,Xr,yr,nn,jo,Ko,Zo,ka,Ee,Xt=X(()=>{"use strict";va(),Xr=!1,yr=!1,nn=!1,jo=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},Ko=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},Zo=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},ka=async e=>{if(Xr)return Promise.resolve();if(yr)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(nn)throw new Error("previous call to 'initializeWebAssembly()' failed.");yr=!0;let t=e.initTimeout,r=e.numThreads;if(e.simd!==!1){if(e.simd==="relaxed"){if(!Zo())throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.")}else if(!Ko())throw new Error("WebAssembly SIMD is not supported in the current environment.")}let i=jo();r>1&&!i&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+r+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),e.numThreads=r=1);let n=e.wasmPaths,a=typeof n=="string"?n:void 0,s=n?.mjs,o=s?.href??s,u=n?.wasm,l=u?.href??u,c=e.wasmBinary,[p,m]=await ip(o,a,r>1,!!c||!!l),g=!1,f=[];if(t>0&&f.push(new Promise(_=>{setTimeout(()=>{g=!0,_()},t)})),f.push(new Promise((_,v)=>{let $={numThreads:r};if(c)$.wasmBinary=c,$.locateFile=b=>b;else if(l||a)$.locateFile=b=>l??a+b;else if(o&&o.indexOf("blob:")!==0)$.locateFile=b=>new URL(b,o).href;else if(p){let b=tp();b&&($.locateFile=k=>b+k)}m($).then(b=>{yr=!1,Xr=!0,rn=b,_(),p&&URL.revokeObjectURL(p)},b=>{yr=!1,nn=!0,v(b)})})),await Promise.race(f),g)throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},Ee=()=>{if(Xr&&rn)return rn;throw new Error("WebAssembly is not initialized yet.")}}),dt,fi,Se,Sa=X(()=>{"use strict";Xt(),dt=(e,t)=>{let r=Ee(),i=r.lengthBytesUTF8(e)+1,n=r._malloc(i);return r.stringToUTF8(e,n,i),t.push(n),n},fi=(e,t,r,i)=>{if(typeof e=="object"&&e!==null){if(r.has(e))throw new Error("Circular reference in options");r.add(e)}Object.entries(e).forEach(([n,a])=>{let s=t?t+n:n;if(typeof a=="object")fi(a,s+".",r,i);else if(typeof a=="string"||typeof a=="number")i(s,a.toString());else if(typeof a=="boolean")i(s,a?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof a}`)})},Se=e=>{let t=Ee(),r=t.stackSave();try{let i=t.PTR_SIZE,n=t.stackAlloc(2*i);t._OrtGetLastError(n,n+i);let a=Number(t.getValue(n,i===4?"i32":"i64")),s=t.getValue(n+i,"*"),o=s?t.UTF8ToString(s):"";throw new Error(`${e} ERROR_CODE: ${a}, ERROR_MESSAGE: ${o}`)}finally{t.stackRestore(r)}}}),np,ty=X(()=>{"use strict";Xt(),Sa(),np=(e,t)=>{let r=Ee(),i=0,n=[],a=e||{};try{if(e?.logSeverityLevel===void 0)a.logSeverityLevel=2;else if(typeof e.logSeverityLevel!="number"||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log severity level is not valid: ${e.logSeverityLevel}`);if(e?.logVerbosityLevel===void 0)a.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!="number"||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);e?.terminate===void 0&&(a.terminate=!1);let s=0;e?.tag!==void 0&&(s=dt(e.tag,n)),i=r._OrtCreateRunOptions(a.logSeverityLevel,a.logVerbosityLevel,!!a.terminate,s),i===0&&Se("Can't create run options."),e?.extra!==void 0&&fi(e.extra,"",new WeakSet,(o,u)=>{let l=dt(o,n),c=dt(u,n);r._OrtAddRunConfigEntry(i,l,c)!==0&&Se(`Can't set a run config entry: ${o} - ${u}.`)});for(let o of t)r._OrtRunOptionsAddActiveLoraAdapter(i,o)!==0&&Se("Can't add an active LoRA adapter.");return[i,n]}catch(s){throw i!==0&&r._OrtReleaseRunOptions(i),n.forEach(o=>r._free(o)),s}}}),Yo,Xo,Qo,Nt,Jo,ap,ry=X(()=>{"use strict";Xt(),Sa(),Yo=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"layout":return 3;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}},Xo=e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}},Qo=e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some(r=>(typeof r=="string"?r:r.name)==="webgpu")&&(e.enableMemPattern=!1)},Nt=(e,t,r,i)=>{let n=dt(t,i),a=dt(r,i);Ee()._OrtAddSessionConfigEntry(e,n,a)!==0&&Se(`Can't set a session config entry: ${t} - ${r}.`)},Jo=async(e,t,r)=>{let i=t.executionProviders;for(let n of i){let a=typeof n=="string"?n:n.name,s=[],o;switch(a){case"webnn":if(a="WEBNN",Nt(e,"session.disable_quant_qdq","1",r),Nt(e,"session.disable_qdq_constant_folding","1",r),typeof n!="string"){let m=n?.deviceType;m&&Nt(e,"deviceType",m,r)}break;case"webgpu":if(a="JS",typeof n!="string"){let m=n;if(m?.preferredLayout){if(m.preferredLayout!=="NCHW"&&m.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${m.preferredLayout}`);Nt(e,"preferredLayout",m.preferredLayout,r)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${a}`)}let u=s.length,l=0,c=0;if(u>0){l=Ee()._malloc(u*Ee().PTR_SIZE),r.push(l),c=Ee()._malloc(u*Ee().PTR_SIZE),r.push(c);for(let m=0;m<u;m++)Ee().setValue(l+m*Ee().PTR_SIZE,s[m][0],"*"),Ee().setValue(c+m*Ee().PTR_SIZE,s[m][1],"*")}let p;if(o===void 0){let m=dt(a,r);p=await Ee()._OrtAppendExecutionProvider(e,m,l,c,u)}p!==0&&Se(`Can't append execution provider: ${a}.`)}},ap=async e=>{let t=Ee(),r=0,i=[],n=e||{};Qo(n);try{let a=Yo(n.graphOptimizationLevel??"all"),s=Xo(n.executionMode??"sequential"),o=typeof n.logId=="string"?dt(n.logId,i):0,u=n.logSeverityLevel??2;if(!Number.isInteger(u)||u<0||u>4)throw new Error(`log severity level is not valid: ${u}`);let l=n.logVerbosityLevel??0;if(!Number.isInteger(l)||l<0||l>4)throw new Error(`log verbosity level is not valid: ${l}`);let c=typeof n.optimizedModelFilePath=="string"?dt(n.optimizedModelFilePath,i):0;if(r=t._OrtCreateSessionOptions(a,!!n.enableCpuMemArena,!!n.enableMemPattern,s,!!n.enableProfiling,0,o,u,l,c),r===0&&Se("Can't create session options."),n.executionProviders&&await Jo(r,n,i),n.enableGraphCapture!==void 0){if(typeof n.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${n.enableGraphCapture}`);Nt(r,"enableGraphCapture",n.enableGraphCapture.toString(),i)}if(n.freeDimensionOverrides)for(let[p,m]of Object.entries(n.freeDimensionOverrides)){if(typeof p!="string")throw new Error(`free dimension override name must be a string: ${p}`);if(typeof m!="number"||!Number.isInteger(m)||m<0)throw new Error(`free dimension override value must be a non-negative integer: ${m}`);let g=dt(p,i);t._OrtAddFreeDimensionOverride(r,g,m)!==0&&Se(`Can't set a free dimension override: ${p} - ${m}.`)}return n.extra!==void 0&&fi(n.extra,"",new WeakSet,(p,m)=>{Nt(r,p,m,i)}),[r,i]}catch(a){throw r!==0&&t._OrtReleaseSessionOptions(r)!==0&&Se("Can't release session options."),i.forEach(s=>t._free(s)),a}}}),Vt,kt,Ht,$i,mi,Ia,Ta,ta,le=X(()=>{"use strict";Vt=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data type: ${e}`)}},kt=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw new Error(`unsupported data type: ${e}`)}},Ht=(e,t)=>{let r=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],i=typeof t=="number"?t:t.reduce((n,a)=>n*a,1);return r>0?Math.ceil(i*r):void 0},$i=e=>{switch(e){case"float16":return typeof Float16Array<"u"?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${e}`)}},mi=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}},Ia=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",Ta=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint64"||e==="int8"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",ta=e=>{switch(e){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${e}`)}}}),xi,Ca=X(()=>{"use strict";xa(),xi=async e=>{if(typeof e=="string"){let t=await fetch(e);if(!t.ok)throw new Error(`failed to load external data file: ${e}`);let r=t.headers.get("Content-Length"),i=r?parseInt(r,10):0;if(i<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw new Error(`failed to load external data file: ${e}, no response body.`);let n=t.body.getReader(),a;try{a=new ArrayBuffer(i)}catch(o){if(o instanceof RangeError){let u=Math.ceil(i/65536);a=new WebAssembly.Memory({initial:u,maximum:u}).buffer}else throw o}let s=0;for(;;){let{done:o,value:u}=await n.read();if(o)break;let l=u.byteLength;new Uint8Array(a,s,l).set(u),s+=l}return new Uint8Array(a,0,i)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),eu,tu,ru,iu,Ea,nu,$e,St=X(()=>{"use strict";le(),eu=["V","I","W","E","F"],tu=(e,t)=>{console.log(`[${eu[e]},${new Date().toISOString()}]${t}`)},Ea=(e,t)=>{ru=e,iu=t},nu=(e,t)=>{let r=mi(e),i=mi(ru);r>=i&&tu(r,typeof t=="function"?t():t)},$e=(...e)=>{iu&&nu(...e)}}),au,cr,U,gi,sp,op,up,pe=X(()=>{"use strict";au=class{static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}},cr=class{static calcShape(e,t,r=!1){let i=e.length,n=t.length;if(i===0)return t;if(n===0)return e;let a=Math.max(e.length,t.length),s=new Array(a);if(r){if(i<2||n<2)return;let o=au.calcMatMulShape([e[i-2],e[i-1]],[t[n-2],t[n-1]]);if(o===void 0)return;[s[a-2],s[a-1]]=o}for(let o=r?3:1;o<=a;o++){let u=i-o<0?1:e[i-o],l=n-o<0?1:t[n-o];if(u!==l&&u>1&&l>1)return;let c=Math.max(u,l);if(u&&l)s[a-o]=Math.max(u,l);else{if(c>1)return;s[a-o]=0}}return s}static isValidBroadcast(e,t){let r=e.length,i=t.length;if(r>i)return!1;for(let n=1;n<=r;n++)if(e[r-n]!==1&&e[r-n]!==t[i-n])return!1;return!0}},U=class ci{static size(t){return ci.getSizeFromDimensionRange(t,0,t.length)}static convertShape(t,r=4){let i=t.length;if(i===0)return[];let n=new Array(i),a=i-1;for(;a>=0;){if(t[a]%r===0){n[a]=t[a]/r;break}if(r%t[a]!==0)throw new Error("cannot convert shape");n[a]=1,r/=t[a],a--}for(a--;a>=0;a--)n[a]=t[a];return n}static sizeFromDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return ci.getSizeFromDimensionRange(t,r,t.length)}static sizeToDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeToDimension as Tensor has ${t.length} dimensions.`);return ci.getSizeFromDimensionRange(t,0,r)}static getSizeFromDimensionRange(t,r,i){let n=1;for(let a=r;a<i;a++){if(t[a]<0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");n*=Number(t[a])}return n}static computeStrides(t){let r=t.length;if(r===0)return[];if(r===1)return[1];let i=new Array(r);i[r-1]=1,i[r-2]=t[r-1];for(let n=r-3;n>=0;--n)i[n]=i[n+1]*t[n+1];return i}static normalizeAxis(t,r){if(t<-r&&t>=r)throw new Error("unsupported axis for this operation.");return t<0?t+r:t}static normalizeAxes(t,r){return t.map(i=>this.normalizeAxis(i,r??t.length))}static sortBasedOnPerm(t,r){return r?r.map(i=>t[i]):t.slice().reverse()}static padShape(t,r){let i=t.length;return t.map((n,a)=>n+r[a]+r[a+i])}static areEqual(t,r){return t.length!==r.length?!1:t.every((i,n)=>i===r[n])}},gi=class Mt{static adjustPoolAttributes(t,r,i,n,a,s){if(!t&&i.length!==r.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(t)for(let o=0;o<r.length-2;o++)o>=i.length?i.push(r[o+2]):i[o]=r[o+2];for(let o=0;o<i.length;o++)if(o<n.length){if(n[o]<0)throw new Error("strides should be greater than or equal to 1")}else n.push(1);for(let o=0;o<i.length;o++)if(o<a.length){if(a[o]<0)throw new Error("dilations should be greater than or equal to 1")}else a.push(1);for(let o=0;o<i.length*2;o++)if(o<s.length){if(s[o]<0)throw new Error("pad should be greater than or equal to 1")}else s.push(0);for(let o=0;o<i.length;o++){if(i[o]<=0)throw new Error("kernel shapes need to be greater than 0");if(s[o]>=i[o]||s[o+i.length]>=i[o])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,r,i,n,a,s,o){if(o){if(a.length!==2*(t.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(r.length!==t.length-2)throw new Error("length of strides should be the length of data dimensions");if(n.length!==t.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let u=0;u<t.length-2;u++)Mt.adjustPadAndReturnShape(t[u+(s?1:2)],r[u],i[u],n[u],a,u,u+t.length-2,o)}}static computePoolOutputShape(t,r,i,n,a,s,o,u=0){if(r.length<=0)throw new Error("input shape must be of size greater than 0");let l=[r[0],r[1]];return Mt.computeShapeHelper(t,r,l,i,n,a,s,o,u),l}static computeConvOutputShape(t,r,i,n,a,s,o){if(t.length<=0||r.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let u=[t[0],r[0]];return Mt.computeShapeHelper(!1,t,u,i,n,a,s,o),u}static computeShapeHelper(t,r,i,n,a,s,o,u,l=0){if(t)for(let c=0;c<r.length-2;c++)i.push(1);else for(let c=0;c<r.length-2;c++)i.push(Mt.adjustPadAndReturnShape(r[c+2],n[c],a[c],s[c],o,c,c+r.length-2,u,l))}static computeOutputSize(t,r,i,n,a){let s=Math.floor(t/r)+1;return a===1&&(s=Math.ceil(t/r)+1,(s-1)*r>=i+n&&(s-=1)),s}static adjustPadAndReturnShape(t,r,i,n,a,s,o,u,l=0){let c=i*(n-1)+1;if(u&&u!=="NOTSET")switch(u){case"VALID":return a[s]=0,a[o]=0,Mt.computeOutputSize(t-c,r,t,0,l);case"SAME_LOWER":case"SAME_UPPER":if(i!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let p=(Math.floor((t+r-1)/r)-1)*r+n-t;return a[s]=Math.floor(u==="SAME_LOWER"?(p+1)/2:p/2),a[o]=p-a[s],Mt.computeOutputSize(t+a[s]+a[o]-c,r,t,a[s],l)}default:throw new Error("Unsupported AutoPad type")}else return Mt.computeOutputSize(t+a[s]+a[o]-c,r,t,a[s],l)}},sp=class{static getShapeOfGemmResult(e,t,r,i,n){if(e.length!==2||r.length!==2)throw new Error("shape need to be of size 2");let a,s,o;t?(a=e[1],s=e[0]):(a=e[0],s=e[1]);let u=-1;if(i?(o=r[0],u=1):(o=r[1],u=0),r[u]!==s)throw new Error("dimension mismatch");if(a<=0||o<=0||s<=0)throw new Error("invalid shape specified");if(n&&!cr.isValidBroadcast(n,[a,o]))throw new Error("gemm: invalid bias shape for broadcast");return[a,o,s]}},op=-34028234663852886e22,up=34028234663852886e22}),za,lp=X(()=>{"use strict";le(),za=(e,t)=>new($i(t))(e)}),an,su,sn,ou,on,uu,un,ln,dn,lu,dp,iy=X(()=>{"use strict";le(),St(),an=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),su=(e,t)=>{if(t==="int32")return e;let r=an.get(t);if(!r)throw new Error(`WebNN backend does not support data type: ${t}`);let i=r/8;if(e.byteLength%i!==0)throw new Error(`Invalid Uint8Array length - must be a multiple of ${i}.`);let n=e.byteLength/i,a=new($i(t))(e.buffer,e.byteOffset,n);switch(t){case"int64":case"uint64":{let s=new Int32Array(n);for(let o=0;o<n;o++){let u=a[o];if(u>2147483647n||u<-2147483648n)throw new Error("Can not convert int64 data to int32 - value out of range.");s[o]=Number(u)}return new Uint8Array(s.buffer)}case"int8":case"uint8":case"uint32":{if(t==="uint32"&&a.some(o=>o>2147483647))throw new Error("Can not convert uint32 data to int32 - value out of range.");let s=Int32Array.from(a,Number);return new Uint8Array(s.buffer)}default:throw new Error(`Unsupported data conversion from ${t} to 'int32'`)}},sn=(e,t)=>{if(t==="int32")return e;if(e.byteLength%4!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");let r=e.byteLength/4,i=new Int32Array(e.buffer,e.byteOffset,r);switch(t){case"int64":{let n=BigInt64Array.from(i,BigInt);return new Uint8Array(n.buffer)}case"uint64":{if(i.some(a=>a<0))throw new Error("Can not convert int32 data to uin64 - negative value found.");let n=BigUint64Array.from(i,BigInt);return new Uint8Array(n.buffer)}case"int8":{if(i.some(a=>a<-128||a>127))throw new Error("Can not convert int32 data to int8 - value out of range.");let n=Int8Array.from(i,Number);return new Uint8Array(n.buffer)}case"uint8":{if(i.some(n=>n<0||n>255))throw new Error("Can not convert int32 data to uint8 - value out of range.");return Uint8Array.from(i,Number)}case"uint32":{if(i.some(a=>a<0))throw new Error("Can not convert int32 data to uint32 - negative value found.");let n=Uint32Array.from(i,Number);return new Uint8Array(n.buffer)}default:throw new Error(`Unsupported data conversion from 'int32' to ${t}`)}},ou=1,on=()=>ou++,uu=new Map([["int8","int32"],["uint8","int32"],["uint32","int32"],["int64","int32"]]),un=(e,t)=>{let r=an.get(e);if(!r)throw new Error(`WebNN backend does not support data type: ${e}`);return t.length>0?Math.ceil(t.reduce((i,n)=>i*n)*r/8):0},ln=class{constructor(e){this.isDataConverted=!1;let{sessionId:t,context:r,tensor:i,dataType:n,shape:a,fallbackDataType:s}=e;this.sessionId=t,this.mlContext=r,this.mlTensor=i,this.dataType=n,this.tensorShape=a,this.fallbackDataType=s}get tensor(){return this.mlTensor}get type(){return this.dataType}get fallbackType(){return this.fallbackDataType}get shape(){return this.tensorShape}get byteLength(){return un(this.dataType,this.tensorShape)}destroy(){$e("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e){if(this.fallbackDataType){let t=await this.mlContext.readTensor(this.mlTensor),r=sn(new Uint8Array(t),this.dataType);if(e){(e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)).set(r);return}else return new Uint8Array(r).buffer}else return e?this.mlContext.readTensor(this.mlTensor,e):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(e,t,r){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===r.length&&this.tensorShape.every((i,n)=>i===r[n])}setIsDataConverted(e){this.isDataConverted=e}},dn=class{constructor(e,t){this.tensorManager=e,this.wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,r,i){let n=this.tensorManager.getMLContext(e),a=this.tensorManager.getMLOpSupportLimits(e),s;if(!a?.input.dataTypes.includes(t)){if(s=uu.get(t),!s||!a?.input.dataTypes.includes(s))throw new Error(`WebNN backend does not support data type: ${t}`);$e("verbose",()=>`[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${t} to ${s}`)}if(this.wrapper){if(this.wrapper.canReuseTensor(n,t,r))return this.wrapper.tensor;if(i){if(this.wrapper.byteLength!==un(t,r))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let o=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,t,r,o,!0,!0,s),i&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){let t=e;if(this.wrapper){if(this.wrapper.fallbackType)if(this.wrapper.fallbackType==="int32")t=su(e,this.wrapper.type),this.wrapper.setIsDataConverted(!0);else throw new Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);if(e.byteLength===this.wrapper.byteLength){this.wrapper.write(t);return}else $e("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor()}this.activeUpload?this.activeUpload.set(t):this.activeUpload=new Uint8Array(t)}async download(e){if(this.activeUpload){let t=this.wrapper?.isDataConverted?sn(this.activeUpload,this.wrapper?.type):this.activeUpload;if(e){e instanceof ArrayBuffer?new Uint8Array(e).set(t):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(t);return}else return t.buffer}if(!this.wrapper)throw new Error("Tensor has not been created.");return e?this.wrapper.read(e):this.wrapper.read()}},lu=class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){let t=this.backend.getMLContext(e);if(!t)throw new Error("MLContext not found for session.");return t}getMLOpSupportLimits(e){return this.backend.getMLOpSupportLimits(e)}reserveTensorId(){let e=on();return this.tensorTrackersById.set(e,new dn(this)),e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(t.tensorWrapper))}async ensureTensor(e,t,r,i,n){$e("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${r}, shape: ${i}, copyOld: ${n}}`);let a=this.tensorTrackersById.get(t);if(!a)throw new Error("Tensor not found.");return a.ensureTensor(e,r,i,n)}upload(e,t){let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");r.upload(t)}async download(e,t){$e("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t?.byteLength}}`);let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");return r.download(t)}releaseTensorsForSession(e){for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,r,i){let n=this.getMLContext(e),a=on(),s=new ln({sessionId:e,context:n,tensor:t,dataType:r,shape:i});return this.tensorTrackersById.set(a,new dn(this,s)),this.externalTensors.add(s),a}async getCachedTensor(e,t,r,i,n,a,s){let o=this.getMLContext(e);for(let[l,c]of this.freeTensors.entries())if(c.canReuseTensor(o,t,r)){$e("verbose",()=>`[WebNN] Reusing tensor {dataType: ${t}, ${s?`fallbackDataType: ${s},`:""} shape: ${r}`);let p=this.freeTensors.splice(l,1)[0];return p.sessionId=e,p}$e("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${t}, ${s?`fallbackDataType: ${s},`:""} shape: ${r}}`);let u=await o.createTensor({dataType:s??t,shape:r,dimensions:r,usage:i,writable:n,readable:a});return new ln({sessionId:e,context:o,tensor:u,dataType:t,shape:r,fallbackDataType:s})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},dp=(...e)=>new lu(...e)}),wr,du,cp,ny=X(()=>{"use strict";le(),Xt(),lp(),iy(),St(),wr=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),du=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let r=Object.keys(e).sort(),i=Object.keys(t).sort();return r.length===i.length&&r.every((n,a)=>n===i[a]&&e[n]===t[n])},cp=class{constructor(e){this.tensorManager=dp(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.sessionGraphOutputs=new Map,this.temporaryGraphInputs=[],this.temporaryGraphOutputs=[],this.temporarySessionTensorIds=new Map,this.mlOpSupportLimitsBySessionId=new Map,Ea(e.logLevel,!!e.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(e){$e("verbose",()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){$e("verbose",()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let r of t)$e("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${r}}`),this.tensorManager.releaseTensorId(r);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let r=this.mlContextCache.findIndex(i=>i.gpuDevice===e);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:i}),i}}else if(e===void 0){let r=this.mlContextCache.findIndex(i=>i.options===void 0&&i.gpuDevice===void 0);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:i}),i}}let t=this.mlContextCache.findIndex(r=>du(r.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;{let r=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:r}),r}}registerMLContext(e,t){this.mlContextBySessionId.set(e,t);let r=this.sessionIdsByMLContext.get(t);r||(r=new Set,this.sessionIdsByMLContext.set(t,r)),r.add(e),this.mlOpSupportLimitsBySessionId.has(e)||this.mlOpSupportLimitsBySessionId.set(e,t.opSupportLimits()),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[]),this.temporaryGraphOutputs.length>0&&(this.sessionGraphOutputs.set(e,this.temporaryGraphOutputs),this.temporaryGraphOutputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e),this.sessionGraphOutputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e),this.mlOpSupportLimitsBySessionId.delete(e);let r=this.sessionIdsByMLContext.get(t);if(r.delete(e),r.size===0){this.sessionIdsByMLContext.delete(t);let i=this.mlContextCache.findIndex(n=>n.mlContext===t);i!==-1&&this.mlContextCache.splice(i,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}getMLOpSupportLimits(e){return this.mlOpSupportLimitsBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){$e("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,t,r,i,n){let a=wr.get(r);if(!a)throw new Error(`Unsupported ONNX data type: ${r}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,t,a,i,n)}async createTemporaryTensor(e,t,r){$e("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${r}}`);let i=wr.get(t);if(!i)throw new Error(`Unsupported ONNX data type: ${t}`);let n=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,n,i,r,!1);let a=this.temporarySessionTensorIds.get(e);return a?a.push(n):this.temporarySessionTensorIds.set(e,[n]),n}uploadTensor(e,t){if(!Ee().shouldTransferToMLTensor)throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");$e("verbose",()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let r=await this.tensorManager.download(e);return za(r,t)}}registerMLTensor(e,t,r,i){let n=wr.get(r);if(!n)throw new Error(`Unsupported ONNX data type: ${r}`);let a=this.tensorManager.registerTensor(e,t,n,i);return $e("verbose",()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${n}, dimensions: ${i}} -> {tensorId: ${a}}`),a}registerGraphInput(e){this.temporaryGraphInputs.push(e)}registerGraphOutput(e){this.temporaryGraphOutputs.push(e)}isGraphInput(e,t){let r=this.sessionGraphInputs.get(e);return r?r.includes(t):!1}isGraphOutput(e,t){let r=this.sessionGraphOutputs.get(e);return r?r.includes(t):!1}isGraphInputOutputTypeSupported(e,t,r=!0){let i=wr.get(Vt(t)),n=this.mlOpSupportLimitsBySessionId.get(e);return typeof i>"u"?!1:r?!!n?.input.dataTypes.includes(i):!!n?.output.dataTypes.includes(i)}flush(){}}}),Ma=X(()=>{"use strict"}),cn,Qr,Jr,cu,pu,pn,ra,hu,pp,ay=X(()=>{"use strict";St(),Ma(),cn=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),Qr=[],Jr=e=>Math.ceil(Number(e)/16)*16,cu=e=>{for(let t=0;t<Qr.length;t++){let r=Qr[t];if(e<=r)return r}return Math.ceil(e/16)*16},pu=1,pn=()=>pu++,ra=async(e,t,r,i)=>{let n=Jr(r),a=e.device.createBuffer({size:n,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let s=e.getCommandEncoder();e.endComputePass(),s.copyBufferToBuffer(t,0,a,0,n),e.flush(),await a.mapAsync(GPUMapMode.READ);let o=a.getMappedRange();if(i){let u=i();return u.set(new Uint8Array(o,0,r)),u}else return new Uint8Array(o.slice(0,r))}finally{a.destroy()}},hu=class{constructor(e){this.backend=e,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[t]of cn)Qr.push(t),this.freeBuffers.set(t,[]),this.freeUniformBuffers.set(t,[]);this.sessionCount=0}upload(e,t){let r=t.buffer,i=t.byteOffset,n=t.byteLength,a=Jr(n),s=this.storageCache.get(e);if(!s)throw new Error("gpu data for uploading does not exist");if(Number(s.originalSize)!==n)throw new Error(`inconsistent data size. gpu data size=${s.originalSize}, data size=${n}`);if(a===n&&i%4===0)this.backend.device.queue.writeBuffer(s.gpuData.buffer,0,r,i,n);else{let o=new Uint8Array(a);o.set(t),this.backend.device.queue.writeBuffer(s.gpuData.buffer,0,o,0,a)}$e("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${e})`)}memcpy(e,t){let r=this.storageCache.get(e);if(!r)throw new Error("source gpu data for memcpy does not exist");let i=this.storageCache.get(t);if(!i)throw new Error("destination gpu data for memcpy does not exist");if(r.originalSize!==i.originalSize)throw new Error("inconsistent source and destination gpu data size");let n=Jr(r.originalSize),a=this.backend.getCommandEncoder();this.backend.endComputePass(),a.copyBufferToBuffer(r.gpuData.buffer,0,i.gpuData.buffer,0,n)}registerExternalBuffer(e,t,r){let i;if(r){if(i=r[0],e===r[1])return $e("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, buffer is the same, skip.`),i;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else i=pn();return this.storageCache.set(i,{gpuData:{id:i,type:0,buffer:e},originalSize:t}),$e("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, registered.`),i}unregisterExternalBuffer(e){e!==void 0&&(this.storageCache.delete(e),$e("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`))}create(e,t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let r=cu(e),i,n=(t&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,a=(t&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(n||a){let o=(n?this.freeBuffers:this.freeUniformBuffers).get(r);o?o.length>0?i=o.pop():i=this.backend.device.createBuffer({size:r,usage:t}):i=this.backend.device.createBuffer({size:r,usage:t})}else i=this.backend.device.createBuffer({size:r,usage:t});let s={id:pn(),type:0,buffer:i};return this.storageCache.set(s.id,{gpuData:s,originalSize:Number(e)}),$e("verbose",()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${s.id}`),s}get(e){return this.storageCache.get(e)?.gpuData}release(e){let t=typeof e=="bigint"?Number(e):e,r=this.storageCache.get(t);if(!r){if(this.storageCache.size===0)return 0;throw new Error("releasing data does not exist")}return $e("verbose",()=>`[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${r.gpuData.id}`),this.storageCache.delete(t),this.buffersPending.push(r.gpuData.buffer),r.originalSize}async download(e,t){let r=this.storageCache.get(Number(e));if(!r)throw new Error("data does not exist");await ra(this.backend,r.gpuData.buffer,r.originalSize,t)}refreshPendingBuffers(){if(this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let e of this.buffersPending){let t=cn.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let r=this.freeBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let r=this.freeUniformBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e));for(let t of this.buffersPending)e.push(t);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(e){let t=this.capturedPendingBuffers.get(e);t&&(t.forEach(r=>{r.destroy()}),this.capturedPendingBuffers.delete(e)),this.sessionCount-=1,this.sessionCount===0&&($e("warning",()=>"[WebGPU] Clearing webgpu buffer cache"),this.storageCache.forEach(r=>{r.gpuData.buffer.destroy()}),this.storageCache=new Map)}},pp=(...e)=>new hu(...e)}),fu,Te,Be=X(()=>{"use strict";fu=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},Te=e=>new fu(e)}),pr,ei,We,Le,oe,Oe,ia,sr,At,se,_r,F,ae,hp,Aa,mu,fp,he=X(()=>{"use strict";le(),pe(),pr=64,ei=(e,t)=>{if(t===3)throw new Error("vec3 has same alignment as vec4, use vec4 instead");switch(Number(e)){case 10:return t>1?`vec${t}<f16>`:"f16";case 1:return t>1?`vec${t}<f32>`:"f32";case 6:return t>1?`vec${t}<i32>`:"i32";case 12:return t>1?`vec${t}<u32>`:"u32";case 7:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(t!==4)throw new Error("bool must be vec4");return["u32","vec4<bool>"];case 22:return"i32";case 21:return"u32";default:throw new Error(`Unknown data type: ${e}`)}},We=(e,t=1)=>{let r=ei(e,t);return typeof r=="string"?r:r[0]},Le=(e,t=1)=>{let r=ei(e,t);return typeof r=="string"?r:r[1]},oe=(...e)=>{let t=[];return e.forEach(r=>{r.length!==0&&t.push({type:12,data:r},{type:12,data:U.computeStrides(r)})}),t},Oe=e=>e%4===0?4:e%2===0?2:1,ia=(e="f32",t,r="0")=>!t||t===1?`${e}(${r})`:`vec${t}<${e}>(${r})`,sr=(e,t,r)=>e==="f32"?r:t===1?`f32(${r})`:`vec${t}<f32>(${r})`,At=(e,t)=>t===4?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:t===2?`(${e}.x + ${e}.y)`:t===3?`(${e}.x + ${e}.y + ${e}.z)`:e,se=(e,t,r,i)=>e.startsWith("uniforms.")&&r>4?typeof t=="string"?i==="f16"?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:i==="f16"?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:r>1?`${e}[${t}]`:e,_r=(e,t,r,i,n)=>{let a=typeof r=="number",s=a?r:r.length,o=[...new Array(s).keys()],u=s<2?"u32":s<=4?`vec${s}<u32>`:`array<u32, ${s}>`,l=ei(t,n),c=typeof l=="string"?l:l[1],p=typeof l=="string"?l:l[0],m={indices:u,value:c,storage:p,tensor:t},g=A=>typeof A=="string"?A:`${A}u`,f={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},_=a?"uniforms.":"",v=`${_}${e}_shape`,$=`${_}${e}_strides`,b="";for(let A=0;A<s-1;A++)b+=`
    let dim${A} = current / ${se($,A,s)};
    let rest${A} = current % ${se($,A,s)};
    indices[${A}] = dim${A};
    current = rest${A};
    `;b+=`indices[${s-1}] = current;`;let k=s<2?"":`
  fn o2i_${e}(offset: u32) -> ${m.indices} {
    var indices: ${m.indices};
    var current = offset;
    ${b}
    return indices;
  }`,I=A=>(f.offsetToIndices=!0,s<2?A:`o2i_${e}(${A})`),S=[];if(s>=2)for(let A=s-1;A>=0;A--)S.push(`${se($,A,s)} * (indices[${A}])`);let E=s<2?"":`
  fn i2o_${e}(indices: ${m.indices}) -> u32 {
    return ${S.join("+")};
  }`,C=A=>(f.indicesToOffset=!0,s<2?A:`i2o_${e}(${A})`),x=(...A)=>s===0?"0u":`${m.indices}(${A.map(g).join(",")})`,O=(A,W)=>s<2?`${A}`:`${se(A,W,s)}`,N=(A,W,q)=>s<2?`${A}=${q};`:`${se(A,W,s)}=${q};`,R={},P=(A,W)=>{f.broadcastedIndicesToOffset=!0;let q=`${W.name}broadcastedIndicesTo${e}Offset`;if(q in R)return`${q}(${A})`;let j=[];for(let ue=s-1;ue>=0;ue--){let ge=W.indicesGet("outputIndices",ue+W.rank-s);j.push(`${O($,ue)} * (${ge} % ${O(v,ue)})`)}return R[q]=`fn ${q}(outputIndices: ${W.type.indices}) -> u32 {
             return ${j.length>0?j.join("+"):"0u"};
           }`,`${q}(${A})`},G=(A,W)=>(()=>{if(m.storage===m.value)return`${e}[${A}]=${W};`;if(m.storage==="vec2<u32>"&&m.value==="i32")return`${e}[${A}]=vec2<u32>(u32(${W}), select(0u, 0xFFFFFFFFu, ${W} < 0));`;if(m.storage==="vec2<u32>"&&m.value==="u32")return`${e}[${A}]=vec2<u32>(u32(${W}), 0u);`;if(m.storage==="u32"&&m.value==="vec4<bool>")return`${e}[${A}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${W}));`;throw new Error(`not supported combination of storage type ${m.storage} and value type ${m.value} yet`)})(),M=A=>(()=>{if(m.storage===m.value)return`${e}[${A}]`;if(m.storage==="vec2<u32>"&&m.value==="i32")return`i32(${e}[${A}].x)`;if(m.storage==="vec2<u32>"&&m.value==="u32")return`u32(${e}[${A}].x)`;if(m.storage==="u32"&&m.value==="vec4<bool>")return`vec4<bool>(bool(${e}[${A}] & 0xFFu), bool(${e}[${A}] & 0xFF00u), bool(${e}[${A}] & 0xFF0000u), bool(${e}[${A}] & 0xFF000000u))`;throw new Error(`not supported combination of storage type ${m.storage} and value type ${m.value} yet`)})(),V=s<2?"":`
  fn get_${e}ByIndices(indices: ${m.indices}) -> ${c} {
    return ${M(`i2o_${e}(indices)`)};
  }`,K=s<2?"":(()=>{let A=o.map(q=>`d${q}: u32`).join(", "),W=o.map(q=>`d${q}`).join(", ");return`
  fn get_${e}(${A}) -> ${c} {
    return get_${e}ByIndices(${x(W)});
  }`})(),L=(...A)=>{if(A.length!==s)throw new Error(`indices length must be ${s}`);let W=A.map(g).join(",");return s===0?M("0u"):s===1?M(W[0]):(f.get=!0,f.getByIndices=!0,f.indicesToOffset=!0,`get_${e}(${W})`)},ee=A=>s<2?M(A):(f.getByIndices=!0,f.indicesToOffset=!0,`get_${e}ByIndices(${A})`),J=s<2?"":`
  fn set_${e}ByIndices(indices: ${m.indices}, value: ${c}) {
    ${G(`i2o_${e}(indices)`,"value")}
  }`,Z=s<2?"":(()=>{let A=o.map(q=>`d${q}: u32`).join(", "),W=o.map(q=>`d${q}`).join(", ");return`
  fn set_${e}(${A}, value: ${c}) {
    set_${e}ByIndices(${x(W)}, value);
  }`})();return{impl:()=>{let A=[],W=!1;return f.offsetToIndices&&(A.push(k),W=!0),f.indicesToOffset&&(A.push(E),W=!0),f.broadcastedIndicesToOffset&&(Object.values(R).forEach(q=>A.push(q)),W=!0),f.set&&(A.push(Z),W=!0),f.setByIndices&&(A.push(J),W=!0),f.get&&(A.push(K),W=!0),f.getByIndices&&(A.push(V),W=!0),!a&&W&&A.unshift(`const ${v} = ${m.indices}(${r.join(",")});`,`const ${$} = ${m.indices}(${U.computeStrides(r).join(",")});`),A.join(`
`)},type:m,offsetToIndices:I,indicesToOffset:C,broadcastedIndicesToOffset:P,indices:x,indicesGet:O,indicesSet:N,set:(...A)=>{if(A.length!==s+1)throw new Error(`indices length must be ${s}`);let W=A[s];if(typeof W!="string")throw new Error("value must be string");let q=A.slice(0,s).map(g).join(",");return s===0?G("0u",W):s===1?G(q[0],W):(f.set=!0,f.setByIndices=!0,f.indicesToOffset=!0,`set_${e}(${q}, ${W})`)},setByOffset:G,setByIndices:(A,W)=>s<2?G(A,W):(f.setByIndices=!0,f.indicesToOffset=!0,`set_${e}ByIndices(${A}, ${W});`),get:L,getByOffset:M,getByIndices:ee,usage:i,name:e,strides:$,shape:v,rank:s}},F=(e,t,r,i=1)=>_r(e,t,r,"input",i),ae=(e,t,r,i=1)=>_r(e,t,r,"output",i),hp=(e,t,r)=>_r(e,t,r,"atomicOutput",1),Aa=(e,t,r,i=1)=>_r(e,t,r,"internal",i),mu=class{constructor(e,t){this.normalizedDispatchGroup=e,this.limits=t,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${typeof e=="number"?`${e}u`:e}) { return; }`}mainStart(e=pr){let t=typeof e=="number"?e:e[0],r=typeof e=="number"?1:e[1],i=typeof e=="number"?1:e[2];if(t>this.limits.maxComputeWorkgroupSizeX||r>this.limits.maxComputeWorkgroupSizeY||i>this.limits.maxComputeWorkgroupSizeZ)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(t*r*i>this.limits.maxComputeInvocationsPerWorkgroup)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let n=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1,a=n?`@builtin(global_invocation_id) global_id : vec3<u32>,
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
`)}get variablesInfo(){if(this.uniforms.length===0)return;let e=t=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(t)];return this.uniforms.map(t=>[e(t.type),t.length??1])}},fp=(e,t)=>new mu(e,t)}),gu,hn,yu,wu,_u,bu,Je,mp,gp,Ot=X(()=>{"use strict";le(),pe(),Be(),he(),gu=(e,t)=>{if(!e||e.length!==1)throw new Error("Transpose requires 1 input.");if(t.length!==0&&t.length!==e[0].dims.length)throw new Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`)},hn=(e,t)=>t.length!==0?t:[...new Array(e).keys()].reverse(),yu=(e,t)=>U.sortBasedOnPerm(e,hn(e.length,t)),wu=(e,t,r,i)=>{let n=`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`;for(let a=0;a<t;++a)n+=`a[${e[a]}]=i[${a}];`;return n+="return a;}"},_u=(e,t)=>{let r=[],i=[];for(let n=0;n<e.length;++n)e[n]!==1&&r.push(e[n]),e[t[n]]!==1&&i.push(t[n]);return{newShape:r,newPerm:i}},bu=(e,t)=>{let r=0;for(let i=0;i<e.length;++i)if(t[e[i]]!==1){if(e[i]<r)return!1;r=e[i]}return!0},Je=(e,t)=>{let r=e.dataType,i=e.dims.length,n=hn(i,t),a=yu(e.dims,n),s=e.dims,o=a,u=i<2||bu(n,e.dims),l;if(u)return l=f=>{let _=F("input",r,s,4),v=ae("output",r,o,4);return`
  ${f.registerUniform("output_size","u32").declareVariables(_,v)}
  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`},{name:"TransposeCopy",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let f=U.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(f/64/4)},programUniforms:[{type:12,data:Math.ceil(f/4)}]}},getShaderSource:l};let{newShape:c,newPerm:p}=_u(e.dims,n),m=U.areEqual(p,[2,3,1]),g=U.areEqual(p,[3,1,2]);if(c.length===2||m||g){s=m?[c[0],c[1]*c[2]]:g?[c[0]*c[1],c[2]]:c,o=[s[1],s[0]];let f=16;return l=_=>{let v=F("a",r,s.length),$=ae("output",r,o.length);return`
  ${_.registerUniform("output_size","u32").declareVariables(v,$)}
  var<workgroup> tile : array<array<${$.type.value}, ${f+1}>, ${f}>;
  ${_.mainStart([f,f,1])}
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
      ${$.setByIndices(`${$.type.indices}(output_row, output_col)`,"tile[local_id.x][local_id.y]")}
    }
  }`},{name:"TransposeShared",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let _=U.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(o[1]/f),y:Math.ceil(o[0]/f)},programUniforms:[{type:12,data:_},...oe(s,o)]}},getShaderSource:l}}return l=f=>{let _=F("a",r,s.length),v=ae("output",r,o.length);return`
  ${f.registerUniform("output_size","u32").declareVariables(_,v)}

  ${wu(n,i,_,v)}

  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${v.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${v.setByOffset("global_idx",_.getByIndices("aIndices"))}
  }`},{name:"Transpose",shaderCache:{hint:`${t}`,inputDependencies:["rank"]},getRunData:()=>{let f=U.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:[{type:12,data:f},...oe(s,o)]}},getShaderSource:l}},mp=(e,t)=>{gu(e.inputs,t.perm),e.compute(Je(e.inputs[0],t.perm))},gp=e=>Te({perm:e.perm})}),$u,xu,vu,ku,Su,Iu,Tu,Cu,Eu,zu,at,yp,wp,_p,bp,$p,xp,vp,kp,Sp,Ip,sy=X(()=>{"use strict";le(),pe(),he(),Oa(),Ot(),$u={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},xu={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},vu={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},ku={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},Su=(e,t)=>{let r=[];for(let i=t-e;i<t;++i)r.push(i);return r},Iu=(e,t)=>{let r=[],i=e.length;for(let a=0;a<i;a++)t.indexOf(a)===-1&&r.push(e[a]);let n=t.map(a=>e[a]);return[r,n]},Tu=(e,t)=>{let r=e.length+t.length,i=[],n=0;for(let a=0;a<r;a++)t.indexOf(a)===-1?i.push(e[n++]):i.push(1);return i},Cu=(e,t)=>{for(let r=0;r<e.length;++r)if(e[e.length-r-1]!==t-1-r)return!1;return!0},Eu=(e,t)=>{let r=[];if(!Cu(e,t)){for(let i=0;i<t;++i)e.indexOf(i)===-1&&r.push(i);e.forEach(i=>r.push(i))}return r},zu=(e,t,r,i,n,a,s)=>{let o=r[0].dims,u=U.size(a),l=U.size(s),c=F("_A",r[0].dataType,o),p=ae("output",n,a),m=64;u===1&&(m=256);let g=`
          var<workgroup> aBestValues : array<f32, ${m}>;
       `,f=_=>`
        ${_.registerUniform("reduceSize","u32").declareVariables(c,p)}
        ${g}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${_.mainStart(m)}

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
          ${p.setByOffset("outputIndex",`${i==="mean"?`${p.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${p.type.storage}(${ku[i]})`}`)};
         }
        }`;return{name:e,shaderCache:{hint:`${t};${m}`,inputDependencies:["type"]},getShaderSource:f,getRunData:()=>({outputs:[{dims:a,dataType:n}],dispatchGroup:{x:u},programUniforms:[{type:12,data:l}]})}},at=(e,t,r,i)=>{let n=e.inputs.length===1?r:na(e.inputs,r),a=n.axes;a.length===0&&!n.noopWithEmptyAxes&&(a=e.inputs[0].dims.map((g,f)=>f));let s=U.normalizeAxes(a,e.inputs[0].dims.length),o=s,u=e.inputs[0],l=Eu(o,e.inputs[0].dims.length);l.length>0&&(u=e.compute(Je(e.inputs[0],l),{inputs:[0],outputs:[-1]})[0],o=Su(o.length,u.dims.length));let[c,p]=Iu(u.dims,o),m=c;n.keepDims&&(m=Tu(c,s)),e.compute(zu(t,n.cacheKey,[u],i,e.inputs[0].dataType,m,p),{inputs:[u]})},yp=(e,t)=>{at(e,"ReduceMeanShared",t,"mean")},wp=(e,t)=>{at(e,"ReduceL1Shared",t,"l1")},_p=(e,t)=>{at(e,"ReduceL2Shared",t,"l2")},bp=(e,t)=>{at(e,"ReduceLogSumExpShared",t,"logSumExp")},$p=(e,t)=>{at(e,"ReduceMaxShared",t,"max")},xp=(e,t)=>{at(e,"ReduceMinShared",t,"min")},vp=(e,t)=>{at(e,"ReduceProdShared",t,"prod")},kp=(e,t)=>{at(e,"ReduceSumShared",t,"sum")},Sp=(e,t)=>{at(e,"ReduceSumSquareShared",t,"sumSquare")},Ip=(e,t)=>{at(e,"ReduceLogSumShared",t,"logSum")}}),st,Mu,yi,na,ot,Au,Ou,Bu,Ru,Du,Nu,Uu,Pu,Lu,Wu,ut,Tp,Cp,Ep,zp,Mp,Ap,Op,Bp,Rp,Dp,Oa=X(()=>{"use strict";le(),pe(),Be(),he(),sy(),st=e=>{if(!e||e.length===0||e.length>2)throw new Error("Reduce op requires 1 or 2 inputs.");if(e.length===2&&e[1].dims.length!==1)throw new Error("Invalid axes input dims.")},Mu=e=>["","",`var value = ${e.getByIndices("input_indices")};`,""],yi=(e,t,r,i,n,a,s=!1,o=!1)=>{let u=[],l=r[0].dims,c=l.length,p=U.normalizeAxes(n,c),m=!o&&p.length===0;l.forEach((_,v)=>{m||p.indexOf(v)>=0?s&&u.push(1):u.push(_)});let g=u.length,f=U.size(u);return{name:e,shaderCache:t,getShaderSource:_=>{let v=[],$=F("_A",r[0].dataType,c),b=ae("output",a,g),k=i($,b,p),I=k[2];for(let S=0,E=0;S<c;S++)m||p.indexOf(S)>=0?(s&&E++,I=`for(var j${S}: u32 = 0; j${S} < ${l[S]}; j${S}++) {
                  ${k[2].includes("last_index")?`let last_index = j${S};`:""}
                  ${$.indicesSet("input_indices",S,`j${S}`)}
                  ${I}
                }`):(v.push(`${$.indicesSet("input_indices",S,b.indicesGet("output_indices",E))};`),E++);return`

        ${_.registerUniform("output_size","u32").declareVariables($,b)}

        ${_.mainStart()}
          ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${$.type.indices};
          let output_indices = ${b.offsetToIndices("global_idx")};

          ${v.join(`
`)}
          ${k[0]}       // init ops for reduce max/min
          ${k[1]}
          ${I}
          ${k[3]}
          ${k.length===4?b.setByOffset("global_idx","value"):k.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:u,dataType:a}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:[{type:12,data:f},...oe(l,u)]})}},na=(e,t)=>{let r=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(i=>r.push(Number(i))),Te({axes:r,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},ot=(e,t,r,i)=>{let n=e.inputs,a=n.length===1?r:na(n,r);e.compute(yi(t,{hint:a.cacheKey,inputDependencies:["rank"]},[n[0]],a.noopWithEmptyAxes&&a.axes.length===0?Mu:i,a.axes,n[0].dataType,a.keepDims,a.noopWithEmptyAxes),{inputs:[0]})},Au=(e,t)=>{st(e.inputs),ot(e,"ReduceLogSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,"value = log(value);"])},Ou=(e,t)=>{st(e.inputs),ot(e,"ReduceL1",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += abs(${r.getByIndices("input_indices")});`,""])},Bu=(e,t)=>{st(e.inputs),ot(e,"ReduceL2",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},Ru=(e,t)=>{st(e.inputs),ot(e,"ReduceLogSumExp",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += exp(${r.getByIndices("input_indices")});`,"value = log(value);"])},Du=(e,t)=>{st(e.inputs),ot(e,"ReduceMax",t,(r,i,n)=>{let a=[];for(let s=0;s<r.rank;s++)(n.indexOf(s)>=0||n.length===0)&&a.push(r.indicesSet("input_indices",s,0));return[`${a.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = max(value, ${r.getByIndices("input_indices")});`,""]})},Nu=(e,t)=>{st(e.inputs),ot(e,"ReduceMean",t,(r,i,n)=>{let a=1;for(let s=0;s<r.rank;s++)(n.indexOf(s)>=0||n.length===0)&&(a*=e.inputs[0].dims[s]);return["var sum = f32(0);","",`sum += f32(${r.getByIndices("input_indices")});`,`let value = ${i.type.value}(sum / ${a});`]})},Uu=(e,t)=>{st(e.inputs),ot(e,"ReduceMin",t,(r,i,n)=>{let a=[];for(let s=0;s<r.rank;s++)(n.indexOf(s)>=0||n.length===0)&&a.push(`input_indices[${s}] = 0;`);return[`${a.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = min(value, ${r.getByIndices("input_indices")});`,""]})},Pu=(e,t)=>{st(e.inputs),ot(e,"ReduceProd",t,(r,i)=>[`var value = ${i.type.storage}(1);`,"",`value *= ${r.getByIndices("input_indices")};`,""])},Lu=(e,t)=>{st(e.inputs),ot(e,"ReduceSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,""])},Wu=(e,t)=>{st(e.inputs),ot(e,"ReduceSumSquare",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += t * t;`,""])},ut=(e,t,r)=>{if(t.length===0)return r;let i=1,n=1;for(let a=0;a<t.length;a++)t.indexOf(a)===-1?i*=e[a]:n*=e[a];return n<32&&i>1024},Tp=(e,t)=>{ut(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Nu(e,t):yp(e,t)},Cp=(e,t)=>{ut(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Ou(e,t):wp(e,t)},Ep=(e,t)=>{ut(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Bu(e,t):_p(e,t)},zp=(e,t)=>{ut(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Ru(e,t):bp(e,t)},Mp=(e,t)=>{ut(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Du(e,t):$p(e,t)},Ap=(e,t)=>{ut(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Uu(e,t):xp(e,t)},Op=(e,t)=>{ut(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Pu(e,t):vp(e,t)},Bp=(e,t)=>{ut(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Lu(e,t):kp(e,t)},Rp=(e,t)=>{ut(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Wu(e,t):Sp(e,t)},Dp=(e,t)=>{ut(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Au(e,t):Ip(e,t)}}),fn,Np,Up,aa,oy=X(()=>{"use strict";le(),Be(),Oa(),fn=e=>{if(!e||e.length===0||e.length>2)throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(e[0].dataType!==1)throw new Error("Invalid input type.")},Np=(e,t)=>{fn(e.inputs);let r=(i,n,a)=>{let s=[];for(let o=0;o<i.rank;o++)(a.indexOf(o)>=0||a.length===0)&&s.push(`input_indices[${o}] = 0;`);return[`${s.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?"<=":"<"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",n.setByOffset("global_idx","best_index")]};e.compute(yi("ArgMin",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},Up=(e,t)=>{fn(e.inputs);let r=(i,n,a)=>{let s=[];for(let o=0;o<i.rank;o++)(a.indexOf(o)>=0||a.length===0)&&s.push(`input_indices[${o}] = 0;`);return[`${s.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?">=":">"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",n.setByOffset("global_idx","best_index")]};e.compute(yi("argMax",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},aa=e=>Te(e)}),qu,ti,Gu,Vu,Hu,Dr,Fu,Pp,Ba=X(()=>{"use strict";le(),pe(),Ma(),he(),qu=(e,t)=>{let r=e[0],i=e[1],n=e[2],a=e[3],s=e[4],o=e[5];if(s&&o)throw new Error("Attention cannot have both past and attention_bias");if(r.dims.length!==3)throw new Error('Input "input" must have 3 dimensions');let u=r.dims[0],l=r.dims[1],c=r.dims[2];if(n.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimensions');if(i.dims.length!==2)throw new Error('Input "weights" is expected to have 2 dimensions');if(i.dims[0]!==c)throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(n.dims[0]!==i.dims[1])throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let p=n.dims[0]/3,m=p,g=m;if(t.qkvHiddenSizes.length>0){if(t.qkvHiddenSizes.length!==3)throw new Error("qkv_hidden_sizes attribute should have 3 elements");for(let k of t.qkvHiddenSizes)if(k%t.numHeads!==0)throw new Error("qkv_hidden_sizes should be divisible by num_heads");p=t.qkvHiddenSizes[0],m=t.qkvHiddenSizes[1],g=t.qkvHiddenSizes[2]}let f=l;if(p!==m)throw new Error("qkv_hidden_sizes first element should be same as the second");if(n.dims[0]!==p+m+g)throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let _=0;if(s){if(m!==g)throw new Error('Input "past" expect k_hidden_size == v_hidden_size');if(s.dims.length!==5)throw new Error('Input "past" must have 5 dimensions');if(s.dims[0]!==2)throw new Error('Input "past" first dimension must be 2');if(s.dims[1]!==u)throw new Error('Input "past" second dimension must be batch_size');if(s.dims[2]!==t.numHeads)throw new Error('Input "past" third dimension must be num_heads');if(s.dims[4]!==m/t.numHeads)throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');t.pastPresentShareBuffer||(_=s.dims[3])}let v=f+_,$=-1,b=0;if(a)throw new Error("Mask not supported");if(s)throw new Error("past is not supported");if(o){if(o.dims.length!==4)throw new Error('Input "attention_bias" must have 4 dimensions');if(o.dims[0]!==u||o.dims[1]!==t.numHeads||o.dims[2]!==l||o.dims[3]!==v)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:u,sequenceLength:l,pastSequenceLength:_,kvSequenceLength:f,totalSequenceLength:v,maxSequenceLength:$,inputHiddenSize:c,hiddenSize:p,vHiddenSize:g,headSize:Math.floor(p/t.numHeads),vHeadSize:Math.floor(g/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:b,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},ti=(e,t,r)=>t&&e?`
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
    `,Gu=(e,t,r,i,n,a,s,o)=>{let u=Oe(s?1:a),l=64,c=a/u;c<l&&(l=32);let p=Math.ceil(a/u/l),m=[{type:12,data:t},{type:12,data:r},{type:12,data:i},{type:12,data:n},{type:12,data:c},{type:12,data:p}],g=We(e.dataType,u),f=Le(1,u),_=["type"];s&&_.push("type"),o&&_.push("type");let v=$=>{let b=ae("x",e.dataType,e.dims,u),k=[b],I=s?F("seq_lens",s.dataType,s.dims):void 0;I&&k.push(I);let S=o?F("total_sequence_length_input",o.dataType,o.dims):void 0;S&&k.push(S);let E=Le(e.dataType),C=[{name:"batch_size",type:"u32"},{name:"num_heads",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"sequence_length",type:"u32"},{name:"total_sequence_length",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${l}>;
  var<workgroup> thread_sum: array<f32, ${l}>;
  ${$.registerUniforms(C).declareVariables(...k)}
  ${$.mainStart([l,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${ti(I,S,!1)}
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
        x[offset + i] = ${b.type.value}(${E}(1.0) / ${E}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${f}(x[offset + i]);
        x[offset + i] = ${b.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${s?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${b.type.value}(${E}(0));
        }`:""};
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${l};${g};${u}`,inputDependencies:_},getShaderSource:v,getRunData:()=>({outputs:[],dispatchGroup:{x:1,y:n,z:t*r},programUniforms:m})}},Vu=(e,t,r,i,n,a,s,o,u)=>{let l=s+a.kvSequenceLength,c=[a.batchSize,a.numHeads,a.sequenceLength,l],p=e>1&&i,m=a.kvNumHeads?a.kvNumHeads:a.numHeads,g=p?[a.batchSize,m,l,a.headSize]:void 0,f=a.nReps?a.nReps:1,_=a.scale===0?1/Math.sqrt(a.headSize):a.scale,v=Oe(a.headSize),$=a.headSize/v,b=12,k={x:Math.ceil(l/b),y:Math.ceil(a.sequenceLength/b),z:a.batchSize*a.numHeads},I=[{type:12,data:a.sequenceLength},{type:12,data:$},{type:12,data:l},{type:12,data:a.numHeads},{type:12,data:a.headSize},{type:1,data:_},{type:12,data:s},{type:12,data:a.kvSequenceLength},{type:12,data:f}],S=p&&i&&U.size(i.dims)>0,E=["type","type"];S&&E.push("type"),n&&E.push("type"),o&&E.push("type"),u&&E.push("type");let C=[{dims:c,dataType:t.dataType,gpuDataType:0}];p&&C.push({dims:g,dataType:t.dataType,gpuDataType:0});let x=O=>{let N=F("q",t.dataType,t.dims,v),R=F("key",r.dataType,r.dims,v),P=[N,R];if(S){let J=F("past_key",i.dataType,i.dims,v);P.push(J)}n&&P.push(F("attention_bias",n.dataType,n.dims));let G=o?F("seq_lens",o.dataType,o.dims):void 0;G&&P.push(G);let M=u?F("total_sequence_length_input",u.dataType,u.dims):void 0;M&&P.push(M);let V=ae("output",t.dataType,c),K=[V];p&&K.push(ae("present_key",t.dataType,g,v));let L=Le(1,v),ee=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${b}u;

  var<workgroup> tileQ: array<${N.type.storage}, ${b*b}>;
  var<workgroup> tileK: array<${N.type.storage}, ${b*b}>;
  ${O.registerUniforms(ee).declareVariables(...P,...K)}
  ${O.mainStart([b,b,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${f===1?"headIdx":"headIdx / uniforms.n_reps"};
    let kv_num_heads = ${f===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${ti(G,M,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${S&&p?"let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;":""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${p?"let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;":""}
    var value = ${L}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${S&&p?`
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
          value += ${L}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(v){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw new Error(`Unsupported components: ${v}`)}})()};
        output[outputIdx] = ${V.type.value} (sum * uniforms.alpha) + ${n?"attention_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${v};${n!==void 0};${i!==void 0};${e}`,inputDependencies:E},getRunData:()=>({outputs:C,dispatchGroup:k,programUniforms:I}),getShaderSource:x}},Hu=(e,t,r,i,n,a,s=void 0,o=void 0)=>{let u=a+n.kvSequenceLength,l=n.nReps?n.nReps:1,c=n.vHiddenSize*l,p=e>1&&i,m=n.kvNumHeads?n.kvNumHeads:n.numHeads,g=p?[n.batchSize,m,u,n.headSize]:void 0,f=[n.batchSize,n.sequenceLength,c],_=12,v={x:Math.ceil(n.vHeadSize/_),y:Math.ceil(n.sequenceLength/_),z:n.batchSize*n.numHeads},$=[{type:12,data:n.sequenceLength},{type:12,data:u},{type:12,data:n.vHeadSize},{type:12,data:n.numHeads},{type:12,data:n.headSize},{type:12,data:c},{type:12,data:a},{type:12,data:n.kvSequenceLength},{type:12,data:l}],b=p&&i&&U.size(i.dims)>0,k=["type","type"];b&&k.push("type"),s&&k.push("type"),o&&k.push("type");let I=[{dims:f,dataType:t.dataType,gpuDataType:0}];p&&I.push({dims:g,dataType:t.dataType,gpuDataType:0});let S=E=>{let C=F("probs",t.dataType,t.dims),x=F("v",r.dataType,r.dims),O=[C,x];b&&O.push(F("past_value",i.dataType,i.dims));let N=s?F("seq_lens",s.dataType,s.dims):void 0;s&&O.push(N);let R=o?F("total_sequence_length_input",o.dataType,o.dims):void 0;o&&O.push(R);let P=[ae("output",t.dataType,f)];p&&P.push(ae("present_value",t.dataType,g));let G=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${_}u;
  var<workgroup> tileQ: array<${C.type.value}, ${_*_}>;
  var<workgroup> tileV: array<${C.type.value}, ${_*_}>;
  ${E.registerUniforms(G).declareVariables(...O,...P)}
  ${E.mainStart([_,_,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${l===1?"headIdx":"headIdx / uniforms.n_reps"};
   let kv_num_heads = ${l===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${ti(N,R,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${b&&p?"let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;":""};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${p?"let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;":""}
   var value = ${C.type.storage}(0);
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
  }`};return{name:"AttentionScore",shaderCache:{hint:`${i!==void 0};${e}`,inputDependencies:k},getRunData:()=>({outputs:I,dispatchGroup:v,programUniforms:$}),getShaderSource:S}},Dr=(e,t,r,i,n,a,s,o,u,l,c=void 0,p=void 0)=>{let m=Math.min(e.outputCount,1+(s?1:0)+(o?1:0)),g=m>1?s:void 0,f=m>1?o:void 0,_=m>1?l.pastSequenceLength:0,v=_+l.kvSequenceLength,$=u&&U.size(u.dims)>0?u:void 0,b=[t,r];g&&U.size(g.dims)>0&&b.push(g),$&&b.push($),c&&b.push(c),p&&b.push(p);let k=e.compute(Vu(m,t,r,g,$,l,_,c,p),{inputs:b,outputs:m>1?[-1,1]:[-1]})[0];e.compute(Gu(k,l.batchSize,l.numHeads,_,l.sequenceLength,v,c,p),{inputs:c&&p?[k,c,p]:[k],outputs:[]});let I=[k,i];f&&U.size(f.dims)>0&&I.push(f),c&&I.push(c),p&&I.push(p),e.compute(Hu(m,k,i,f,l,_,c,p),{inputs:I,outputs:m>1?[0,2]:[0]})},Fu=(e,t)=>{let r=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],i=t.sequenceLength,n=t.inputHiddenSize,a=t.headSize,s=12,o={x:Math.ceil(t.headSize/s),y:Math.ceil(t.sequenceLength/s),z:t.batchSize*t.numHeads},u=[e.inputs[0],e.inputs[1],e.inputs[2]],l=[{type:12,data:i},{type:12,data:n},{type:12,data:a},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}],c=p=>{let m=ae("output_q",u[0].dataType,r),g=ae("output_k",u[0].dataType,r),f=ae("output_v",u[0].dataType,r),_=F("input",u[0].dataType,u[0].dims),v=F("weight",u[1].dataType,u[1].dims),$=F("bias",u[2].dataType,u[2].dims),b=_.type.storage,k=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
  const TILE_SIZE = ${s}u;
  var<workgroup> tileInput: array<${b}, ${s*s}>;
  var<workgroup> tileWeightQ: array<${b}, ${s*s}>;
  var<workgroup> tileWeightK: array<${b}, ${s*s}>;
  var<workgroup> tileWeightV: array<${b}, ${s*s}>;
  ${p.registerUniforms(k).declareVariables(_,v,$,m,g,f)}
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
  }`};return e.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:o,programUniforms:l}),getShaderSource:c},{inputs:u,outputs:[-1,-1,-1]})},Pp=(e,t)=>{let r=qu(e.inputs,t),[i,n,a]=Fu(e,r);return Dr(e,i,n,a,e.inputs[4],void 0,void 0,void 0,e.inputs[5],r)}}),ju,Ku,Zu,Lp,uy=X(()=>{"use strict";et(),le(),pe(),Be(),he(),ju=(e,t)=>{if(!e||e.length!==5)throw new Error("BatchNormalization requires 5 inputs");let r=(i,n,a)=>{let s=n.length;if(s!==i.length)throw new Error(`${a}: num dimensions != ${s}`);n.forEach((o,u)=>{if(o!==i[u])throw new Error(`${a}: dim[${u}] do not match`)})};if(e[0].dims.length>1){let i=t.format==="NHWC"?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);r(e[1].dims,i,"Invalid input scale"),r(e[2].dims,i,"Invalid input B"),r(e[3].dims,i,"Invalid input mean"),r(e[4].dims,i,"Invalid input var")}else r(e[1].dims,[1],"Invalid input scale"),r(e[2].dims,[1],"Invalid input B"),r(e[3].dims,[1],"Invalid input mean"),r(e[4].dims,[1],"Invalid input var")},Ku=(e,t)=>{let{epsilon:r,spatial:i,format:n}=t,a=e[0].dims,s=i?Oe(a[a.length-1]):1,o=n==="NHWC"&&a.length>1?s:1,u=U.size(a)/s,l=i,c=l?a.length:a,p=F("x",e[0].dataType,e[0].dims,s),m=F("scale",e[1].dataType,e[1].dims,o),g=F("bias",e[2].dataType,e[2].dims,o),f=F("inputMean",e[3].dataType,e[3].dims,o),_=F("inputVar",e[4].dataType,e[4].dims,o),v=ae("y",e[0].dataType,c,s),$=()=>{let k="";if(i)k=`let cOffset = ${a.length===1?"0u":n==="NHWC"?`outputIndices[${a.length-1}] / ${s}`:"outputIndices[1]"};`;else if(n==="NCHW")k=`
            ${v.indicesSet("outputIndices","0","0")}
            let cOffset = ${v.indicesToOffset("outputIndices")};`;else{k=`var cIndices = ${m.type.indices}(0);
                       cIndices[0] = outputIndices[${a.length-1}];`;for(let I=1;I<m.rank;I++)k+=`cIndices[${I}] = outputIndices[${I}];`;k+=`let cOffset = ${m.indicesToOffset("cIndices")};`}return k},b=k=>`
  const epsilon = ${r};
  ${k.registerUniform("outputSize","u32").declareVariables(p,m,g,f,_,v)}
  ${k.mainStart()}
  ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${v.offsetToIndices(`global_idx * ${s}`)};
    ${$()}
    let scale = ${m.getByOffset("cOffset")};
    let bias = ${g.getByOffset("cOffset")};
    let inputMean = ${f.getByOffset("cOffset")};
    let inputVar = ${_.getByOffset("cOffset")};
    let x = ${p.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${v.setByOffset("global_idx","value")}
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${t.epsilon}_${t.format}_${i}_${s}`,inputDependencies:l?["rank","type","type","type","type"]:void 0},getShaderSource:b,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:l?[{type:12,data:u},...oe(a)]:[{type:12,data:u}]})}},Zu=e=>Te(e),Lp=(e,t)=>{let{inputs:r,outputCount:i}=e,n=Zu({...t,outputCount:i});if(Ce.webgpu.validateInputContent&&ju(r,n),t.trainingMode)throw new Error("BatchNormalization trainingMode is not supported yet.");e.compute(Ku(r,n))}}),Yu,Xu,Wp,ly=X(()=>{"use strict";pe(),he(),Yu=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![320,640,1280].includes(e[0].dims[2]))throw new Error("number of channels should be 320, 640 or 1280");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},Xu=e=>{let t=e[0].dims,r=e[0].dims[2],i=U.size(t)/4,n=e[0].dataType,a=F("input",n,t,4),s=F("bias",n,[r],4),o=F("residual",n,t,4),u=ae("output",n,t,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)}}),getShaderSource:l=>`
  const channels = ${r}u / 4;
  ${l.declareVariables(a,s,o,u)}

  ${l.mainStart()}
    ${l.guardAgainstOutOfBoundsWorkgroupSizes(i)}
    let value = ${a.getByOffset("global_idx")}
      + ${s.getByOffset("global_idx % channels")} + ${o.getByOffset("global_idx")};
    ${u.setByOffset("global_idx","value")}
  }`}},Wp=e=>{Yu(e.inputs),e.compute(Xu(e.inputs))}}),Qu,ke,qp,Gp,Vp,Hp,Fp,jp,Kp,Zp,Yp,Ju,Xp,Qp,Jp,eh,zr,th,pi,rh,ih,nh,ah,sh,oh,uh,lh,dh,ch,ph,hh,fh,mh,gh,yh,wh,mn,_h,sa,oa,bh,$h,xh,el,tl,vh,Ra=X(()=>{"use strict";le(),pe(),Be(),he(),Qu=(e,t,r,i,n,a,s)=>{let o=Math.ceil(t/4),u="";typeof n=="string"?u=`${n}(a)`:u=n("a");let l=F("inputData",r,[o],4),c=ae("outputData",i,[o],4),p=[{name:"vec_size",type:"u32"}];return s&&p.push(...s),`
      ${e.registerUniforms(p).declareVariables(l,c)}

  ${a??""}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${l.getByOffset("global_idx")};
    ${c.setByOffset("global_idx",u)}
  }`},ke=(e,t,r,i,n,a=e.dataType,s,o)=>{let u=[{type:12,data:Math.ceil(U.size(e.dims)/4)}];return s&&u.push(...s),{name:t,shaderCache:{hint:n,inputDependencies:["type"]},getShaderSource:l=>Qu(l,U.size(e.dims),e.dataType,a,r,i,o),getRunData:l=>({outputs:[{dims:e.dims,dataType:a}],dispatchGroup:{x:Math.ceil(U.size(l[0].dims)/64/4)},programUniforms:u})}},qp=e=>{e.compute(ke(e.inputs[0],"Abs","abs"))},Gp=e=>{e.compute(ke(e.inputs[0],"Acos","acos"))},Vp=e=>{e.compute(ke(e.inputs[0],"Acosh","acosh"))},Hp=e=>{e.compute(ke(e.inputs[0],"Asin","asin"))},Fp=e=>{e.compute(ke(e.inputs[0],"Asinh","asinh"))},jp=e=>{e.compute(ke(e.inputs[0],"Atan","atan"))},Kp=e=>{e.compute(ke(e.inputs[0],"Atanh","atanh"))},Zp=e=>Te(e),Yp=(e,t)=>{let r;switch(t.to){case 10:r="vec4<f16>";break;case 1:r="vec4<f32>";break;case 12:r="vec4<u32>";break;case 6:r="vec4<i32>";break;case 9:r="vec4<bool>";break;default:throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute(ke(e.inputs[0],"Cast",r,void 0,t.cacheKey,t.to))},Ju=e=>{let t,r,i=e.length>=2&&e[1].data!==0,n=e.length>=3&&e[2].data!==0;switch(e[0].dataType){case 1:t=i?e[1].getFloat32Array()[0]:-34028234663852886e22,r=n?e[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:t=i?e[1].getUint16Array()[0]:64511,r=n?e[2].getUint16Array()[0]:31743;break;default:throw new Error("Unsupport data type")}return Te({min:t,max:r})},Xp=(e,t)=>{let r=t||Ju(e.inputs),i=Le(e.inputs[0].dataType);e.compute(ke(e.inputs[0],"Clip",n=>`clamp(${n}, vec4<${i}>(uniforms.min), vec4<${i}>(uniforms.max))`,void 0,r.cacheKey,void 0,[{type:e.inputs[0].dataType,data:r.min},{type:e.inputs[0].dataType,data:r.max}],[{name:"min",type:i},{name:"max",type:i}]),{inputs:[0]})},Qp=e=>{e.compute(ke(e.inputs[0],"Ceil","ceil"))},Jp=e=>{e.compute(ke(e.inputs[0],"Cos","cos"))},eh=e=>{e.compute(ke(e.inputs[0],"Cosh","cosh"))},zr=e=>Te(e),th=(e,t)=>{let r=Le(e.inputs[0].dataType);e.compute(ke(e.inputs[0],"Elu",i=>`elu_vf32(${i})`,`
  const elu_alpha_ = ${r}(${t.alpha});

  fn elu_f32(a: ${r}) -> ${r} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${r}>) -> vec4<${r}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,t.cacheKey))},pi=(e="f32")=>`
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
}`,rh=e=>{let t=Le(e.inputs[0].dataType);e.compute(ke(e.inputs[0],"Erf",r=>`erf_vf32(${r})`,pi(t)))},ih=e=>{e.compute(ke(e.inputs[0],"Exp","exp"))},nh=e=>{e.compute(ke(e.inputs[0],"Floor","floor"))},ah=e=>{let t=Le(e.inputs[0].dataType);e.compute(ke(e.inputs[0],"Gelu",r=>`0.5 * ${r} * (1.0 + erf_vf32(${r} * 0.7071067811865475))`,pi(t)))},sh=(e,t)=>{let r=Le(e.inputs[0].dataType);e.compute(ke(e.inputs[0],"LeakyRelu",i=>`select(leaky_relu_alpha_ * ${i}, ${i}, ${i} >= vec4<${r}>(0.0))`,`const leaky_relu_alpha_ = ${r}(${t.alpha});`,t.cacheKey))},oh=e=>{e.compute(ke(e.inputs[0],"Not",t=>`!${t}`))},uh=e=>{e.compute(ke(e.inputs[0],"Neg",t=>`-${t}`))},lh=e=>{e.compute(ke(e.inputs[0],"Reciprocal",t=>`1.0/${t}`))},dh=e=>{let t=Le(e.inputs[0].dataType);e.compute(ke(e.inputs[0],"Relu",r=>`select(vec4<${t}>(0.0), ${r}, ${r} > vec4<${t}>(0.0))`))},ch=e=>{e.compute(ke(e.inputs[0],"Sigmoid",t=>`(1.0 / (1.0 + exp(-${t})))`))},ph=e=>Te(e),hh=(e,t)=>{let r=Le(e.inputs[0].dataType);e.compute(ke(e.inputs[0],"HardSigmoid",i=>`max(vec4<${r}>(0.0), min(vec4<${r}>(1.0), ${t.alpha} * ${i} + vec4<${r}>(${t.beta})))`,void 0,t.cacheKey))},fh=e=>{let t=Le(e.inputs[0].dataType);e.compute(ke(e.inputs[0],"HardSwish",r=>`${r} * max(vec4<${t}>(0.0), min(vec4<${t}>(1.0), vec4<${t}>(${t}(1.0 / 6.0)) * ${r} + vec4<${t}>(0.5)))`))},mh=e=>{e.compute(ke(e.inputs[0],"Sin","sin"))},gh=e=>{e.compute(ke(e.inputs[0],"Sinh","sinh"))},yh=e=>{e.compute(ke(e.inputs[0],"Sqrt","sqrt"))},wh=e=>{e.compute(ke(e.inputs[0],"Tan","tan"))},mn=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,_h=e=>{e.compute(ke(e.inputs[0],"Tanh",mn))},sa=(e="f32")=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${mn("v")};
}
`,oa=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,bh=e=>{let t=Le(e.inputs[0].dataType);e.compute(ke(e.inputs[0],"FastGelu",oa,sa(t),void 0,e.inputs[0].dataType))},$h=(e,t)=>{let r=Le(e.inputs[0].dataType);return e.compute(ke(e.inputs[0],"ThresholdedRelu",i=>`select(vec4<${r}>(0.0), ${i}, ${i} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${r}>(${t.alpha});`,t.cacheKey)),0},xh=e=>{e.compute(ke(e.inputs[0],"Log","log"))},el=(e,t)=>`
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
`,tl=e=>`quick_gelu_impl(${e})`,vh=(e,t)=>{let r=Le(e.inputs[0].dataType);e.compute(ke(e.inputs[0],"QuickGelu",tl,el(r,t.alpha),t.cacheKey,e.inputs[0].dataType))}}),rl,il,kh,dy=X(()=>{"use strict";pe(),he(),Ra(),rl=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![2560,5120,10240].includes(e[0].dims[2]))throw new Error("hidden state should be 2560, 5120 or 10240");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},il=e=>{let t=e[0].dims.slice();t[2]=t[2]/2;let r=F("input",e[0].dataType,e[0].dims,4),i=F("bias",e[0].dataType,[e[0].dims[2]],4),n=ae("output",e[0].dataType,t,4),a=U.size(t)/4,s=We(e[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)}}),getShaderSource:o=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2]/4/2}u;

  ${o.declareVariables(r,i,n)}

  ${pi(s)}

  ${o.mainStart()}
    ${o.guardAgainstOutOfBoundsWorkgroupSizes(a)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${n.setByOffset("global_idx","valueLeft * geluRight")}
  }`}},kh=e=>{rl(e.inputs),e.compute(il(e.inputs))}}),nl,al,lt,Sh,Ih,Th,Ch,Eh,zh,Mh,Ah,Oh,Bh,cy=X(()=>{"use strict";le(),pe(),he(),nl=(e,t,r,i,n,a,s,o,u,l,c,p)=>{let m,g;typeof o=="string"?m=g=(b,k)=>`${o}((${b}),(${k}))`:typeof o=="function"?m=g=o:(m=o.scalar,g=o.vector);let f=ae("outputData",c,i.length,4),_=F("aData",u,t.length,4),v=F("bData",l,r.length,4),$;if(n)if(a){let b=U.size(t)===1,k=U.size(r)===1,I=t.length>0&&t[t.length-1]%4===0,S=r.length>0&&r[r.length-1]%4===0;b||k?$=f.setByOffset("global_idx",g(b?`${_.type.value}(${_.getByOffset("0")}.x)`:_.getByOffset("global_idx"),k?`${v.type.value}(${v.getByOffset("0")}.x)`:v.getByOffset("global_idx"))):$=`
            let outputIndices = ${f.offsetToIndices("global_idx * 4u")};
            let offsetA = ${_.broadcastedIndicesToOffset("outputIndices",f)};
            let offsetB = ${v.broadcastedIndicesToOffset("outputIndices",f)};
            ${f.setByOffset("global_idx",g(s||I?_.getByOffset("offsetA / 4u"):`${_.type.value}(${_.getByOffset("offsetA / 4u")}[offsetA % 4u])`,s||S?v.getByOffset("offsetB / 4u"):`${v.type.value}(${v.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else $=f.setByOffset("global_idx",g(_.getByOffset("global_idx"),v.getByOffset("global_idx")));else{if(!a)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");let b=(k,I,S="")=>{let E=`aData[indexA${I}][componentA${I}]`,C=`bData[indexB${I}][componentB${I}]`;return`
            let outputIndices${I} = ${f.offsetToIndices(`global_idx * 4u + ${I}u`)};
            let offsetA${I} = ${_.broadcastedIndicesToOffset(`outputIndices${I}`,f)};
            let offsetB${I} = ${v.broadcastedIndicesToOffset(`outputIndices${I}`,f)};
            let indexA${I} = offsetA${I} / 4u;
            let indexB${I} = offsetB${I} / 4u;
            let componentA${I} = offsetA${I} % 4u;
            let componentB${I} = offsetB${I} % 4u;
            ${k}[${I}] = ${S}(${m(E,C)});
          `};c===9?$=`
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
        ${e.registerUniform("vec_size","u32").declareVariables(_,v,f)}

        ${p??""}

        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${$}
      }`},al=(e,t,r,i,n,a,s=r.dataType)=>{let o=r.dims.map(Number),u=i.dims.map(Number),l=!U.areEqual(o,u),c=o,p=U.size(o),m=!1,g=!1,f=[l];if(l){let _=cr.calcShape(o,u,!1);if(!_)throw new Error("Can't perform binary op on the given tensors");c=_.slice(),p=U.size(c);let v=U.size(o)===1,$=U.size(u)===1,b=o.length>0&&o[o.length-1]%4===0,k=u.length>0&&u[u.length-1]%4===0;f.push(v),f.push($),f.push(b),f.push(k);let I=1;for(let S=1;S<c.length;S++){let E=o[o.length-S],C=u[u.length-S];if(E===C)I*=E;else break}I%4===0?(g=!0,m=!0):(v||$||b||k)&&(m=!0)}else m=!0;return f.push(m),{name:e,shaderCache:{hint:t+f.map(_=>_.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:_=>nl(_,o,u,c,m,l,g,n,r.dataType,i.dataType,s,a),getRunData:()=>({outputs:[{dims:c,dataType:s}],dispatchGroup:{x:Math.ceil(p/64/4)},programUniforms:[{type:12,data:Math.ceil(U.size(c)/4)},...oe(o,u,c)]})}},lt=(e,t,r,i,n,a)=>{e.compute(al(t,n??"",e.inputs[0],e.inputs[1],r,i,a))},Sh=e=>{lt(e,"Add",(t,r)=>`${t}+${r}`)},Ih=e=>{lt(e,"Div",(t,r)=>`${t}/${r}`)},Th=e=>{lt(e,"Equal",{scalar:(t,r)=>`u32(${t}==${r})`,vector:(t,r)=>`vec4<u32>(${t}==${r})`},void 0,void 0,9)},Ch=e=>{lt(e,"Mul",(t,r)=>`${t}*${r}`)},Eh=e=>{let t=F("input",e.inputs[0].dataType,e.inputs[0].dims).type.value;lt(e,"Pow",{scalar:(r,i)=>`pow_custom(${r},${i})`,vector:(r,i)=>`pow_vector_custom(${r},${i})`},`
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
      `)},zh=e=>{lt(e,"Sub",(t,r)=>`${t}-${r}`)},Mh=e=>{lt(e,"Greater",{scalar:(t,r)=>`u32(${t}>${r})`,vector:(t,r)=>`vec4<u32>(${t}>${r})`},void 0,void 0,9)},Ah=e=>{lt(e,"Less",{scalar:(t,r)=>`u32(${t}<${r})`,vector:(t,r)=>`vec4<u32>(${t}<${r})`},void 0,void 0,9)},Oh=e=>{lt(e,"GreaterOrEqual",{scalar:(t,r)=>`u32(${t}>=${r})`,vector:(t,r)=>`vec4<u32>(${t}>=${r})`},void 0,void 0,9)},Bh=e=>{lt(e,"LessOrEqual",{scalar:(t,r)=>`u32(${t}<=${r})`,vector:(t,r)=>`vec4<u32>(${t}<=${r})`},void 0,void 0,9)}}),sl,ol,Rh,Dh,py=X(()=>{"use strict";le(),pe(),Be(),he(),sl=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");let r=0,i=e[r],n=i.dataType,a=i.dims.length;e.forEach((s,o)=>{if(o!==r){if(s.dataType!==n)throw new Error("input tensors should be one type");if(s.dims.length!==a)throw new Error("input tensors should have the same shape");s.dims.forEach((u,l)=>{if(l!==t&&u!==i.dims[l])throw new Error("non concat dimensions must match")})}})},ol=(e,t,r,i,n=0)=>{let a=e.reduce(($,b)=>$+U.size(b.dims),0),s=new Array(e.length),o=new Array(e.length),u=new Array(e.length),l=0,c=n,p=[],m=[],g=[{type:12,data:a}];for(let $=0;$<e.length;++$)s[$]=l,o[$]=c,l+=U.size(e[$].dims),c+=e[$].dims[t],m.push(e[$].dims.length),u[$]=F(`input${$}`,i,m[$]),p.push("rank"),g.push({type:12,data:s[$]}),g.push({type:12,data:o[$]});for(let $=0;$<e.length;++$)g.push(...oe(e[$].dims));g.push(...oe(r));let f=ae("output",i,r.length),_=u.map(($,b)=>{let k=`
        let inputOffset = ${`global_idx - uniforms.inputOffset${b}`};
        var outputIndices = ${$.offsetToIndices("inputOffset")};
        ${f.indicesGet("outputIndices",t)} += uniforms.outputAxisOffset${b};
        ${f.setByIndices("outputIndices",$.getByOffset("inputOffset"))}`;return e.length===1?k:b===0?`if (inputIndex == 0u) {${k}}`:b===e.length-1?`else {${k}}`:`else if (inputIndex == ${b}u) {${k}}`}).join(`
`),v=$=>`

  ${(()=>{$.registerUniform("outputSize","u32");for(let b=0;b<e.length;b++)$.registerUniform(`inputOffset${b}`,"u32"),$.registerUniform(`outputAxisOffset${b}`,"u32");return $.declareVariables(...u,f)})()}

  fn calculateInputIndex(global_idx: u32) -> u32 {
    ${u.slice(1).map((b,k)=>`if (global_idx < uniforms.inputOffset${k+1}) {
      return ${k}u;
    }`).join(`
`)}
    return ${e.length-1}u;
  }

  ${$.mainStart()}
    ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    let inputIndex = calculateInputIndex(global_idx);
    ${_}
  }`;return{name:"Concat",shaderCache:{hint:`${t}`,inputDependencies:p},getRunData:()=>({outputs:[{dims:r,dataType:i}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:g}),getShaderSource:v}},Rh=(e,t)=>{let r=e.inputs,i=r[0].dims,n=U.normalizeAxis(t.axis,i.length);sl(r,n);let a=i.slice();a[n]=r.reduce((l,c)=>l+(c.dims.length>n?c.dims[n]:0),0);let s=r.filter(l=>U.size(l.dims)>0);if(s.length===0){e.output(0,a);return}let o=e.deviceLimits.maxStorageBuffersPerShaderStage-1,u=0;for(let l=0;l<s.length;l+=o){let c=s.slice(l,l+o);e.compute(ol(c,n,a,r[0].dataType,u),{inputs:c,outputs:[0]}),u+=c.reduce((p,m)=>p+m.dims[n],0)}},Dh=e=>Te({axis:e.axis})}),Kt,Zt,Yt,Da,Qt=X(()=>{"use strict";le(),pe(),Kt=(e,t,r="f32")=>{switch(e.activation){case"Relu":return`value = max(value, ${t}(0.0));`;case"Sigmoid":return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${t}(${r}(uniforms.clip_min)), ${t}(${r}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${t}(0.0), min(${t}(1.0), ${r}(uniforms.alpha) * value + ${r}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${r}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw new Error(`Unsupported activation ${e.activation}`)}},Zt=(e,t)=>{e.activation==="Clip"?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):e.activation==="HardSigmoid"?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):e.activation==="LeakyRelu"&&t.push({type:1,data:e.alpha})},Yt=(e,t)=>{e.activation==="Clip"?t.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):e.activation==="HardSigmoid"?t.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):e.activation==="LeakyRelu"&&t.push({name:"alpha",type:"f32"})},Da=e=>{let t=e?.activation||"";if(t==="HardSigmoid"){let[r,i]=e?.activation_params||[.2,.5];return{activation:t,alpha:r,beta:i}}else if(t==="Clip"){let[r,i]=e?.activation_params||[op,up];return{activation:t,clipMax:i,clipMin:r}}else if(t==="LeakyRelu"){let[r]=e?.activation_params||[.01];return{activation:t,alpha:r}}return{activation:t}}}),Ve,Nh,Na=X(()=>{"use strict";Ve=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw new Error(`${e}-component is not supported.`)}},Nh=e=>`
      ${e?"value = value + getBiasByOutputCoords(coords);":""}
      `}),Uh,hy=X(()=>{"use strict";Uh=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`}),Ar,Ua,Pa=X(()=>{"use strict";le(),pe(),he(),Qt(),Ar=(e,t,r,i,n)=>{let a=i-r;return`
      ${Array.from({length:r}).map((s,o)=>`
      if (${se(t.shape,o,t.rank)} != 1) {
        ${t.indicesSet(e,o,se(n,o+a,i))}
      } else {
        ${t.indicesSet(e,o,0)}
      }`).join("")}
`},Ua=(e,t,r,i,n=!1,a)=>{let s=e[0].dims,o=e[1].dims,u=s[s.length-2],l=o[o.length-1],c=s[s.length-1],p=Oe(l),m=Oe(c),g=Oe(u),f=U.size(r)/p/g,_=e.length>2,v=i?i.slice(0,-2):r.slice(0,-2),$=[U.size(v),u,l],b=[{type:12,data:f},{type:12,data:u},{type:12,data:l},{type:12,data:c}];Zt(t,b),b.push(...oe(v,s,o)),_&&b.push(...oe(e[2].dims)),b.push(...oe($));let k=I=>{let S=Aa("batch_dims",e[0].dataType,v.length),E=F("a",e[0].dataType,s.length,m),C=F("b",e[1].dataType,o.length,p),x=ae("output",e[0].dataType,$.length,p),O=We(x.type.tensor),N=Kt(t,x.type.value,O),R=[E,C],P="";if(_){let V=n?p:1;R.push(F("bias",e[2].dataType,e[2].dims.length,V)),P=`${n?`value += bias[col / ${V}];`:`value += ${x.type.value}(bias[row + i]);`}`}let G=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];Yt(t,G);let M=()=>{let V=`var a_data: ${E.type.value};`;for(let K=0;K<m;K++)V+=`
              let b_data${K} = b[(b_offset + (k + ${K}) * uniforms.N + col) / ${p}];`;for(let K=0;K<g;K++){V+=`a_data = a[(a_offset + (row + ${K}) * uniforms.K + k) / ${m}];`;for(let L=0;L<m;L++)V+=`
            values[${K}] = fma(${C.type.value}(a_data${m===1?"":`[${L}]`}), b_data${L}, values[${K}]);
`}return V};return`
  ${I.registerUniforms(G).registerInternalVariables(S).declareVariables(...R,x)}
  ${I.mainStart()}
    ${I.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${p})) * ${p};
    var index1 = global_idx / (uniforms.N / ${p});
    let stride1 = uniforms.M / ${g};
    let row = (index1 % stride1) * ${g};
    let batch = index1 / stride1;

    ${r.length===2?"":`let batch_indices = ${S.offsetToIndices("batch")};`}

    var a_indices: ${E.type.indices};
    ${Ar("a_indices",E,E.rank-2,S.rank,"batch_indices")}
    ${E.indicesSet("a_indices",E.rank-2,0)}
    ${E.indicesSet("a_indices",E.rank-1,0)}
    let a_offset = ${E.indicesToOffset("a_indices")};

    var b_indices: ${C.type.indices};
    ${Ar("b_indices",C,C.rank-2,S.rank,"batch_indices")}
    ${C.indicesSet("b_indices",C.rank-2,0)}
    ${C.indicesSet("b_indices",C.rank-1,0)}
    let b_offset = ${C.indicesToOffset("b_indices")};
    var values: array<${x.type.value}, ${g}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${m}) {
      ${M()}
    }
    for (var i = 0u; i < ${g}u; i++) {
      var value = values[i];
      ${P}
      ${N}
      let cur_indices = ${x.type.indices}(batch, row + i, col);
      let offset = ${x.indicesToOffset("cur_indices")};
      ${x.setByOffset(`offset / ${p}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${t.activation};${p};${m};${g};${n}`,inputDependencies:_?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:a?a(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:b}),getShaderSource:k}}}),ul,ll,ua,gn,dl,la,cl,wi,La=X(()=>{"use strict";le(),pe(),he(),Qt(),Pa(),Na(),ul=(e,t)=>e?`
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
        }`,ua=(e,t,r="f32",i,n=!1,a=32,s=!1,o=32)=>{let u=t[1]*e[1],l=t[0]*e[0],c=n?u:a,p=n?a:u,m=c/t[0],g=a/t[1];if(!((n&&m===4&&e[1]===4||!n&&(m===3||m===4))&&c%t[0]===0&&a%t[1]===0&&e[0]===4))throw new Error(`If transposeA ${n} is true, innerElementSize ${m} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${m} must be 3 or 4.
  tileAWidth ${c} must be divisible by workgroupSize[0]${t[0]}. tileInner ${a} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${m}<${r}>, ${c/m}>, ${p}>;
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
}`},gn=(e,t)=>e?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t?", batchIndices":""});
            `,dl=e=>e?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",la=(e,t,r="f32",i,n=!1,a=32,s=!1,o=32,u=!1)=>{let l=e[1]*t[1],c=e[0]*t[0],p=n?l:a,m=n?a:l;if(!(m%t[1]===0&&p%t[0]===0&&a%t[1]===0))throw new Error(`tileAHight ${m} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${p} must be divisible by workgroupSize[0]${t[0]}, tileInner ${a} must be divisible by workgroupSize[1]${t[1]}`);let g=m/t[1],f=p/t[0],_=a/t[1],v=u?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${l};
    let globalColStart = i32(workgroupId.x) * ${c};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${m}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${p}; inputCol = inputCol + ${t[0]}) {
          ${gn(n,i)}
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
let tileRowB = i32(localId.y) * ${_};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${g}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${f}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${gn(n,i)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${_}; innerRow = innerRow + 1) {
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
  var<workgroup> mm_Asub : array<array<${r}, ${p}>, ${m}>;
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
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${a.type.indices}) -> ${Ve(e,l)} {
      var value = ${Ve(e,l)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${s.type.indices};
        ${Ar("aIndices",s,s.rank-2,a.rank,"batchIndices")}
        ${s.indicesSet("aIndices",s.rank-2,"u32(row)")}
        ${s.indicesSet("aIndices",s.rank-1,"u32(colIn)")}
        value = ${s.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${a.type.indices}) -> ${Ve(e,l)} {
      var value = ${Ve(e,l)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${o.type.indices};
        ${Ar("bIndices",o,o.rank-2,a.rank,"batchIndices")}
        ${o.indicesSet("bIndices",o.rank-2,"u32(row)")}
        ${o.indicesSet("bIndices",o.rank-1,"u32(colIn)")}
        value = ${o.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${Ve(e,l)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${n?"bias[colIn]":`${Ve(e,l)}(bias[row])`};`:""}
        ${r}
        ${u.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},wi=(e,t,r,i,n=!1,a)=>{let s=e[0].dims,o=e[1].dims,u=s.slice(0,-2),l=o.slice(0,-2),c=i?i.slice(0,-2):r.slice(0,-2),p=U.size(c),m=s[s.length-2],g=s[s.length-1],f=o[o.length-1],_=g%4===0&&f%4===0,v=m<=8?[4,1,1]:[4,4,1],$=[8,8,1],b=[Math.ceil(f/$[0]/v[0]),Math.ceil(m/$[1]/v[1]),Math.ceil(p/$[2]/v[2])],k=_?4:1,I=[...u,m,g/k],S=I.length,E=[...l,g,f/k],C=E.length,x=[p,m,f/k],O=[{type:6,data:m},{type:6,data:f},{type:6,data:g}];Zt(t,O),O.push(...oe(c,I,E));let N=["rank","rank"],R=e.length>2;R&&(O.push(...oe(e[2].dims)),N.push("rank")),O.push(...oe(x));let P=G=>{let M=c.length,V=Aa("batchDims",e[0].dataType,M,1),K=We(e[0].dataType),L=F("a",e[0].dataType,S,k),ee=F("b",e[1].dataType,C,k),J=ae("result",e[0].dataType,x.length,k),Z=[L,ee];if(R){let ue=n?k:1;Z.push(F("bias",e[2].dataType,e[2].dims.length,ue))}let A=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];Yt(t,A);let W=We(J.type.tensor),q=Kt(t,J.type.value,W),j=cl(k,R,q,[V,L,ee,J],n);return`
  ${G.registerUniforms(A).registerInternalVariables(V).declareVariables(...Z,J)}
  ${j}
  ${_?ua(v,$,K,V):la(v,$,K,V)}
                   `};return{name:"MatMul",shaderCache:{hint:`${v};${t.activation};${_};${n}`,inputDependencies:N},getRunData:()=>({outputs:[{dims:a?a(r):r,dataType:e[0].dataType}],dispatchGroup:{x:b[0],y:b[1],z:b[2]},programUniforms:O}),getShaderSource:P}}}),pl,Ph,fy=X(()=>{"use strict";le(),St(),he(),Qt(),Na(),hy(),La(),pl=(e,t,r,i,n=!1,a,s=4,o=4,u=4,l="f32")=>{let c=O=>{switch(O){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${l}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${O} is not supported.`)}},p=O=>{switch(O){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw new Error(`innerElementSize ${O} is not supported.`)}},m=e?`
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
    `,f=e?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",_=e?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",v=e?"row":"col",$=e?"col":"row",b=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
    let outRow = ${v} / outWidth;
    let outCol = ${v} % outWidth;

    let WRow = ${$} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${$} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${$} % inChannels;
    var resData = ${Ve(s,l)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${f} && xCol >= 0 && xCol < ${_}) {
      ${m}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${c(s)}
    }
    return resData;`,k=e?t&&i?`
    let col = colIn * ${s};
    ${b}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${b}
    }
    return ${Ve(s,l)}(0.0);`:i&&r?`
    let col = colIn * ${s};
    ${b}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${b}
    }
    return ${Ve(s,l)}(0.0);`,I=e?i&&r?p(o):`
    let col = colIn * ${o};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${p(o)}
    }
    return ${Ve(o,l)}(0.0);`:`
    let col = colIn * ${o};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${p(o)}
    }
    return ${Ve(o,l)}(0.0);`,S=Ve(u,l),E=Ve(e?s:o,l),C=Ve(e?o:s,l),x=Kt(a,S,l);return`
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
      ${Nh(n)}
      ${x}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},Ph=(e,t,r,i,n,a,s,o,u)=>{let l=t.format==="NHWC",c=l?e[0].dims[3]:e[0].dims[1],p=r[0],m=l?r[2]:r[3],g=l?r[1]:r[2],f=l?r[3]:r[1],_=l&&(c%4===0||c%3===0)&&f%4===0,v=l?f:m*g,$=l?m*g:f,b=[8,8,1],k=i<=8?[4,1,1]:[4,4,1],I=[Math.ceil(v/b[0]/k[0]),Math.ceil($/b[1]/k[1]),Math.ceil(p/b[2]/k[2])];$e("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${I}`);let S=_?l&&c%4!==0?3:4:1,E=b[1]*k[1],C=b[0]*k[0],x=Math.max(b[0]*S,b[1]),O=i%E===0,N=n%C===0,R=a%x===0,P=_?[S,4,4]:[1,1,1],G=[{type:6,data:i},{type:6,data:n},{type:6,data:a},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];Zt(t,G),G.push(...oe(e[0].dims,e[1].dims));let M=["rank","rank"];s&&(G.push(...oe(e[2].dims)),M.push("rank")),G.push(...oe(r));let V=K=>{let L=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];Yt(t,L);let ee=_?4:1,J=We(e[0].dataType),Z=`
      fn setOutputAtIndex(flatIndex : i32, value : ${_?`vec4<${J}>`:J}) {
        result[flatIndex] = ${_?`vec4<${J}>`:J}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${_?`vec4<${J}>`:J}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${_?"/ 4":""}, value);
      }`,A=F("x",e[0].dataType,e[0].dims.length,S===3?1:S),W=F("w",e[1].dataType,e[1].dims.length,ee),q=[A,W],j=ae("result",e[0].dataType,r.length,ee);if(s){let ue=F("bias",e[2].dataType,e[2].dims.length,ee);q.push(ue),Z+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${_?`vec4<${J}>`:J} {
          return bias[coords.${l?"w":"y"}${_?"/ 4":""}];
        }`}return`
        ${Uh("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${K.registerUniforms(L).declareVariables(...q,j)}
        ${Z}
        ${pl(l,O,N,R,s,t,P[0],P[1],P[2],J)}
        ${_?ua(k,b,J,void 0,!l,x):la(k,b,J,void 0,!l,x,!1,void 0,o)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${t.cacheKey};${S};${_};${O};${N};${R};${E};${C};${x}`,inputDependencies:M},getRunData:()=>({outputs:[{dims:u?u(r):r,dataType:e[0].dataType}],dispatchGroup:{x:I[0],y:I[1],z:I[2]},programUniforms:G}),getShaderSource:V}}}),hl,yn,br,fl,wn,ml,Lh,Wh,my=X(()=>{"use strict";le(),St(),pe(),he(),Qt(),Na(),hl=e=>{let t=1;for(let r=0;r<e.length;r++)t*=e[r];return t},yn=e=>typeof e=="number"?[e,e,e]:e,br=(e,t)=>t<=1?e:e+(e-1)*(t-1),fl=(e,t,r,i=1)=>{let n=br(t,i);return Math.floor((e[0]*(r-1)-r+n)/2)},wn=(e,t,r,i,n)=>{n==null&&(n=fl(e,t[0],i[0]));let a=[0,0,0,r];for(let s=0;s<3;s++)e[s]+2*n>=t[s]&&(a[s]=Math.trunc((e[s]-t[s]+2*n)/i[s]+1));return a},ml=(e,t,r,i,n,a,s,o,u,l)=>{let c,p,m,g;if(e==="VALID"&&(e=0),typeof e=="number"){c={top:e,bottom:e,left:e,right:e,front:e,back:e};let f=wn([t,r,i,1],[o,u,l],1,[n,a,s],e);p=f[0],m=f[1],g=f[2]}else if(Array.isArray(e)){if(!e.every((_,v,$)=>_===$[0]))throw Error(`Unsupported padding parameter: ${e}`);c={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let f=wn([t,r,i,1],[o,u,l],1,[n,a,s],e[0]);p=f[0],m=f[1],g=f[2]}else if(e==="SAME_UPPER"){p=Math.ceil(t/n),m=Math.ceil(r/a),g=Math.ceil(i/s);let f=(p-1)*n+o-t,_=(m-1)*a+u-r,v=(g-1)*s+l-i,$=Math.floor(f/2),b=f-$,k=Math.floor(_/2),I=_-k,S=Math.floor(v/2),E=v-S;c={top:k,bottom:I,left:S,right:E,front:$,back:b}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:c,outDepth:p,outHeight:m,outWidth:g}},Lh=(e,t,r,i,n,a=!1,s="channelsLast")=>{let o,u,l,c,p;if(s==="channelsLast")[o,u,l,c,p]=e;else if(s==="channelsFirst")[o,p,u,l,c]=e;else throw new Error(`Unknown dataFormat ${s}`);let[m,,g,f,_]=t,[v,$,b]=yn(r),[k,I,S]=yn(i),E=br(g,k),C=br(f,I),x=br(_,S),{padInfo:O,outDepth:N,outHeight:R,outWidth:P}=ml(n,u,l,c,v,$,b,E,C,x),G=a?m*p:m,M=[0,0,0,0,0];return s==="channelsFirst"?M=[o,G,N,R,P]:s==="channelsLast"&&(M=[o,N,R,P,G]),{batchSize:o,dataFormat:s,inDepth:u,inHeight:l,inWidth:c,inChannels:p,outDepth:N,outHeight:R,outWidth:P,outChannels:G,padInfo:O,strideDepth:v,strideHeight:$,strideWidth:b,filterDepth:g,filterHeight:f,filterWidth:_,effectiveFilterDepth:E,effectiveFilterHeight:C,effectiveFilterWidth:x,dilationDepth:k,dilationHeight:I,dilationWidth:S,inShape:e,outShape:M,filterShape:t}},Wh=(e,t,r,i,n,a)=>{let s=a==="channelsLast",o=s?e[0].dims[3]:e[0].dims[1],u=!1,l=[64,1,1],c={x:r.map((b,k)=>k)},p=[Math.ceil(hl(c.x.map(b=>r[b]))/l[0]),1,1];$e("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${p}`);let m=u?s&&o%4!==0?3:4:1,g=U.size(r),f=[{type:12,data:g},{type:12,data:i},{type:12,data:n},{type:12,data:t.strides},{type:12,data:t.dilations}];Zt(t,f),f.push(...oe(e[0].dims,e[1].dims));let _=["rank","rank"],v=e.length===3;v&&(f.push(...oe(e[2].dims)),_.push("rank")),f.push(...oe(r));let $=b=>{let k=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:i.length},{name:"pads",type:"u32",length:n.length},{name:"strides",type:"u32",length:t.strides.length},{name:"dilations",type:"u32",length:t.dilations.length}];Yt(t,k);let I=u?4:1,S=We(e[0].dataType),E=F("x",e[0].dataType,e[0].dims.length,m===3?1:m),C=F("W",e[1].dataType,e[1].dims.length,I),x=[E,C],O=ae("result",e[0].dataType,r.length,I),N="";if(v){let G=F("bias",e[2].dataType,e[2].dims.length,I);x.push(G),N+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${u?`vec4<${S}>`:S} {
          return bias[${s?se("coords",4,5):se("coords",1,5)}${u?"/ 4":""}];
        }`}let R=Ve(m,S),P=Kt(t,R,S);return`
            ${N}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> ${S} {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${E.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> ${S} {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${C.getByIndices("aIndices")};
            }
          ${b.registerUniforms(k).declareVariables(...x,O)}
          ${b.mainStart()}
          ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${O.offsetToIndices("global_idx")};
              let batch = ${se("coords",0,E.rank)};
              let d2 = ${s?se("coords",E.rank-1,E.rank):se("coords",1,E.rank)};
              let xFRCCorner = vec3<u32>(${s?se("coords",1,E.rank):se("coords",2,E.rank)},
              ${s?se("coords",2,E.rank):se("coords",3,E.rank)},
              ${s?se("coords",3,E.rank):se("coords",4,E.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${s?se("uniforms.x_shape",1,E.rank):se("uniforms.x_shape",2,E.rank)};
              let xShapeZ = ${s?se("uniforms.x_shape",2,E.rank):se("uniforms.x_shape",3,E.rank)};
              let xShapeW = ${s?se("uniforms.x_shape",3,E.rank):se("uniforms.x_shape",4,E.rank)};
              let xShapeU = ${s?se("uniforms.x_shape",4,E.rank):se("uniforms.x_shape",1,E.rank)};
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
              ${P}
              result[global_idx] = ${S}(value);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${t.cacheKey};${s};${m};${v}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:p[0],y:p[1],z:p[2]},programUniforms:f}),getShaderSource:$}}}),qh,Gh,gy=X(()=>{"use strict";le(),pe(),he(),Qt(),qh=(e,t,r,i)=>{let n=e.length>2,a=n?"value += b[output_channel];":"",s=e[0].dims,o=e[1].dims,u=t.format==="NHWC",l=u?r[3]:r[1],c=l/t.group,p=u&&c>=4?Oe(l):1,m=U.size(r)/p,g=[{type:12,data:m},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:c}];Zt(t,g),g.push(...oe(s,[o[0],o[1],o[2],o[3]/p]));let f=n?["rank","rank","rank"]:["rank","rank"];g.push(...oe([r[0],r[1],r[2],r[3]/p]));let _=v=>{let $=ae("output",e[0].dataType,r.length,p),b=We($.type.tensor),k=Kt(t,$.type.value,b),I=F("x",e[0].dataType,s.length),S=F("w",e[1].dataType,o.length,p),E=[I,S];n&&E.push(F("b",e[2].dataType,e[2].dims,p));let C=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:t.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];Yt(t,C);let x=u?`
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
  ${v.registerUniforms(C).declareVariables(...E,$)}

  ${v.mainStart()}
    ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${$.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${u?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${u?1:2}], outputIndices[${u?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${p} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${u?2:1}];

    var value: ${$.type.value} = ${$.type.value}(0);
    ${x}
    ${a}
    ${k}
    ${$.setByOffset("global_idx","value")}
  }`};return{name:"GroupedConv",shaderCache:{hint:`${t.cacheKey}_${p}`,inputDependencies:f},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:g}),getShaderSource:_}},Gh=(e,t,r,i)=>{let n=e.length>2,a=Oe(r[3]),s=Oe(r[2]),o=U.size(r)/a/s,u=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/a],l=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/a],c=[r[0],r[1],r[2],r[3]/a],p=[{type:12,data:o},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];Zt(t,p),p.push(...oe(u,l,c));let m=(s-1)*t.strides[1]+l[1],g=f=>{let _=ae("output",e[0].dataType,c.length,a),v=We(_.type.tensor),$=Kt(t,_.type.value,v),b=F("x",e[0].dataType,u.length,a),k=F("w",e[1].dataType,l.length,a),I=[b,k];n&&I.push(F("b",e[2].dataType,e[2].dims,a));let S=n?"value += b[output_channel];":"",E=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return Yt(t,E),`
  ${f.registerUniforms(E).declareVariables(...I,_)}
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

    var x_vals: array<${b.type.value}, ${m}>;
    var values: array<${_.type.value}, ${s}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${l[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${m}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${b.get("batch","u32(x_height)","u32(x_width)","input_channel")};
          } else {
            x_vals[i] = ${b.type.value}(0);
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
      ${$}
      ${_.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${t.cacheKey};${a};${s};${m};${l[0]};${l[1]}`,inputDependencies:n?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:p}),getShaderSource:g}}}),gl,ri,yl,ii,da,_n,wl,_l,ca,yy=X(()=>{"use strict";pe(),fy(),my(),La(),gy(),Qt(),Pa(),Ot(),gl=(e,t,r,i,n,a)=>{let s=e[0],o=e.slice(a?1:2,a?3:4),u=o.length,l=t[0],c=t.slice(2).map((m,g)=>m+(m-1)*(r[g]-1)),p=o.map((m,g)=>m+i[g]+i[g+u]).map((m,g)=>Math.floor((m-c[g]+n[g])/n[g]));return p.splice(0,0,s),p.splice(a?3:1,0,l),p},ri=[2,3,1,0],yl=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length>5)throw new Error("greater than 5D is not supported");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[1]*t.group;if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");let n=e[0].dims.length-2;if(t.dilations.length!==n)throw new Error(`dilations should be ${n}D`);if(t.strides.length!==n)throw new Error(`strides should be ${n}D`);if(t.pads.length!==n*2)throw new Error(`pads should be ${n*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape")},ii=(e,t)=>{let r=e.kernelShape.slice();r.length<t[1].dims.length-2&&r.push(...Array(t[1].dims.length-2-r.length).fill(0));for(let a=2;a<t[1].dims.length;++a)r[a-2]===0&&(r[a-2]=t[1].dims[a]);let i=e.pads.slice();gi.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,r,i,e.format==="NHWC",e.autoPad);let n=Object.assign({},e);return Object.assign(n,{kernelShape:r,pads:i}),n},da=e=>{let t=Da(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],n=e.dilations,a=e.group,s=e.kernel_shape,o=e.pads,u=e.strides,l=e.w_is_const();return{autoPad:i,format:r,dilations:n,group:a,kernelShape:s,pads:o,strides:u,wIsConst:l,...t,cacheKey:`${e.format};${t.activation};`}},_n=(e,t,r,i)=>{let n=r.format==="NHWC",a=gl(t[0].dims,t[1].dims,r.dilations,r.pads,r.strides,n);if(r.group!==1){let E=[t[0]];if(n){let C=e.kernelCustomData.wT??e.compute(Je(t[1],ri),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=C),E.push(C)}else E.push(t[1]);t.length===3&&E.push(t[2]),!e.adapterInfo.isArchitecture("ampere")&&n&&t[1].dims[0]===r.group&&t[1].dims[1]===1&&r.dilations[0]===1&&r.dilations[1]===1?e.compute(Gh(E,r,a,i),{inputs:E}):e.compute(qh(E,r,a,i),{inputs:E});return}let s=t.length===3,o=t[0].dims[n?1:2],u=t[0].dims[n?2:3],l=t[0].dims[n?3:1],c=t[1].dims[2],p=t[1].dims[3],m=a[n?1:2],g=a[n?2:3],f=a[n?3:1],_=n&&c===o&&p===u&&r.pads[0]===0&&r.pads[1]===0;if(_||c===1&&p===1&&r.dilations[0]===1&&r.dilations[1]===1&&r.strides[0]===1&&r.strides[1]===1&&r.pads[0]===0&&r.pads[1]===0){let E=a[0],C,x,O,N=[];if(n){let G=e.kernelCustomData.wT??e.compute(Je(t[1],ri),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];if(r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=G),_){let M=o*u*l;C=t[0].reshape([1,E,M]),x=G.reshape([1,M,f]),O=[1,E,f]}else C=t[0].reshape([E,o*u,l]),x=G.reshape([1,l,f]),O=[E,m*g,f];N.push(C),N.push(x)}else C=t[0].reshape([E,l,o*u]),x=t[1].reshape([1,f,l]),O=[E,f,m*g],N.push(x),N.push(C);s&&N.push(t[2]);let R=O[2],P=N[0].dims[N[0].dims.length-1];R<8&&P<8?e.compute(Ua(N,r,a,O,n,i),{inputs:N}):e.compute(wi(N,r,a,O,n,i),{inputs:N});return}let v=!0,$=e.kernelCustomData.wT??e.compute(Je(t[1],ri),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=$);let b=[t[0],$];s&&b.push(t[2]);let k=n?m*g:f,I=n?f:m*g,S=c*p*l;e.compute(Ph(b,r,a,k,I,S,s,v,i),{inputs:b})},wl=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let n=[0,t.pads[0],0,t.pads[1]],a=[1].concat(t.strides),s=[1].concat(t.dilations),o=[1].concat(t.kernelShape),u=ii({...t,pads:n,strides:a,dilations:s,kernelShape:o},i);_n(e,i,u,l=>r?[l[0],l[2],l[3]]:[l[0],l[1],l[3]])},_l=(e,t,r)=>{let i=r.format==="NHWC"?"channelsLast":"channelsFirst",n=ii(r,t),a=r.autoPad==="NOTSET"?r.pads:r.autoPad,s=Lh(t[0].dims,t[1].dims,r.strides,r.dilations,a,!1,i);e.compute(Wh(t,n,s.outShape,[s.filterDepth,s.filterHeight,s.filterWidth],[s.padInfo.front,s.padInfo.top,s.padInfo.left],i))},ca=(e,t)=>{if(yl(e.inputs,t),e.inputs[0].dims.length===3)wl(e,t);else if(e.inputs[0].dims.length===5)_l(e,e.inputs,t);else{let r=ii(t,e.inputs);_n(e,e.inputs,r)}}}),Vh,wy=X(()=>{"use strict";le(),St(),pe(),he(),Vh=(e,t,r)=>{let i=e.length>2,n=t.outputShape,a=t.format==="NHWC",s=t.group,o=e[1].dims,u=o[2]/s,l=o[3],c=a?Oe(u):1,p=a&&l===1&&u>=4,m=p?Math.floor(u/4)*4:Math.floor(u/c)*c,g=u-m,f=a?Oe(l):1,_=a?l===1?c:f:1,v=U.size(n)/f,$=[Math.ceil(v/64),1,1];$e("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${$}`);let b=["rank","rank"],k=[t.strides[0],t.strides[1]],I=[t.kernelShape[a?1:2],t.kernelShape[a?2:3]],S=[t.dilations[0],t.dilations[1]],E=[I[0]+(t.dilations[0]<=1?0:(t.kernelShape[a?1:2]-1)*(t.dilations[0]-1)),I[1]+(t.dilations[1]<=1?0:(t.kernelShape[a?2:3]-1)*(t.dilations[1]-1))],C=[E[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),E[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],x=[{type:12,data:v},{type:12,data:k},{type:12,data:I},{type:12,data:S},{type:12,data:E},{type:6,data:C},{type:12,data:m},{type:12,data:u},{type:12,data:l},...oe(e[0].dims,e[1].dims)];i&&(x.push(...oe(e[2].dims)),b.push("rank")),x.push(...oe(n));let O=N=>{let R=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:k.length},{name:"filter_dims",type:"u32",length:I.length},{name:"dilations",type:"u32",length:I.length},{name:"effective_filter_dims",type:"u32",length:E.length},{name:"pads",type:"i32",length:C.length},{name:"input_channels_per_group_int",type:"u32"},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],P=We(e[0].dataType),G=a?1:2,M=a?2:3,V=a?3:1,K=F("W",e[1].dataType,e[1].dims.length,_),L=F("Dy",e[0].dataType,e[0].dims.length,c),ee=[L,K];i&&ee.push(F("bias",e[2].dataType,[n[V]].length,f));let J=ae("result",e[0].dataType,n.length,f),Z=()=>{let q="";if(p)c===4?q+=`
        let xValue = ${L.getByOffset("x_offset")};
        let wValue = ${K.getByOffset("w_offset")};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;`:c===2?q+=`
          dotProd = dotProd + dot(vec4<${P}>(${L.getByOffset("x_offset")}, ${L.getByOffset("x_offset + 1u")}), vec4<${P}>(${K.getByOffset("w_offset")}, ${K.getByOffset("w_offset + 1u")}));
          x_offset += 2u;
          w_offset += 2u;`:c===1&&(q+=`
          dotProd = dotProd + dot(vec4<${P}>(${L.getByOffset("x_offset")}, ${L.getByOffset("x_offset + 1u")}, ${L.getByOffset("x_offset + 2u")}, ${L.getByOffset("x_offset + 3u")}), vec4<${P}>(${K.getByOffset("w_offset")}, ${K.getByOffset("w_offset + 1u")}, ${K.getByOffset("w_offset + 2u")}, ${K.getByOffset("w_offset + 3u")}));
          x_offset += 4u;
          w_offset += 4u;`);else if(q+=`
                  let xValue = ${a?L.getByOffset(`${L.indicesToOffset(`${L.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${c}`):L.get("batch","inputChannel","idyR","idyC")};
        `,c===1)q+=`
          let w_offset = ${K.indicesToOffset(`${K.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${K.getByOffset(`w_offset / ${_}`)};
          dotProd = dotProd + xValue * wValue;`;else for(let j=0;j<c;j++)q+=`
            let wValue${j} = ${K.getByOffset(`${K.indicesToOffset(`${K.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${j}, wOutChannel)`)} / ${_}`)};
            dotProd = dotProd + xValue[${j}] * wValue${j};`;return q},A=()=>{if(g===0)return"";if(!p)throw new Error(`packInputAs4 ${p} is not true.`);let q="";if(c===1){q+="dotProd = dotProd";for(let j=0;j<g;j++)q+=`
            + ${L.getByOffset(`x_offset + ${j}`)} * ${K.getByOffset(`w_offset + ${j}`)}`;q+=";"}else if(c===2){if(g!==2)throw new Error(`Invalid inputChannelsRemainder ${g}.`);q+=`
          let xValue = ${L.getByOffset("x_offset")};
          let wValue = ${K.getByOffset("w_offset")};
          dotProd = dotProd + dot(xValue, wValue);`}return q},W=`
            let outputIndices = ${J.offsetToIndices(`global_idx * ${f}`)};
            let batch = ${J.indicesGet("outputIndices",0)};
            let d1 = ${J.indicesGet("outputIndices",V)};
            let r = ${J.indicesGet("outputIndices",G)};
            let c = ${J.indicesGet("outputIndices",M)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${J.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${P}(dyRCorner) + ${P}(wR)) / ${P}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${P}(uniforms.Dy_shape[${G}]) || fract(dyR) > 0.0 ||
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
                let dyC = (${P}(dyCCorner) + ${P}(wC)) / ${P}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${P}(uniforms.Dy_shape[${M}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${p?`
                var x_offset = ${L.indicesToOffset(`${L.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${c};
                var w_offset = ${K.indicesToOffset(`${K.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${_};
                  `:""}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${p?4:c}) {
                  ${Z()}
                  inputChannel = inputChannel + ${p?4:c};
                }
                ${A()}
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${i?` + bias[d1 / ${f}]`:""};
            ${J.setByOffset("global_idx","value")};
          `;return`
    ${N.registerUniforms(R).declareVariables(...ee,J)}
      ${N.mainStart()}
      ${N.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${W}}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${t.cacheKey};${c}${_}${f}${p}${g}`,inputDependencies:b},getRunData:()=>({dispatchGroup:{x:$[0],y:$[1],z:$[2]},outputs:[{dims:r?r(n):n,dataType:e[0].dataType}],programUniforms:x}),getShaderSource:O}}}),bl,$l,xl,bn,Hh,vl,$n,kl,Fh,_y=X(()=>{"use strict";wy(),Qt(),Ot(),bl=(e,t,r,i,n,a)=>(e-1)*t+r+(i-1)*n+1-a,$l=(e,t,r,i,n)=>{let a=Math.floor(e/2);t==="SAME_UPPER"?(r[i]=a,r[n]=e-a):t==="SAME_LOWER"&&(r[i]=e-a,r[n]=a)},xl=(e,t,r,i,n,a,s,o,u,l)=>{let c=e.length-2,p=l.length===0;u.length<c&&u.push(...Array(c-u.length).fill(0));let m=e[0],g=t[o?3:1]*n;for(let f=0,_=e.length-c-(o?1:0);f<c;++f,++_){let v=e[_],$=p?v*s[f]:l[f],b=bl(v,s[f],a[f],t[_],r[f],$);$l(b,i,a,f,f+c),p&&l.push(s[f]*(v-1)+u[f]+(t[_]-1)*r[f]+1-a[f]-a[f+c])}l.splice(0,0,m),l.splice(o?3:1,0,g)},bn=(e,t)=>{let r=e.kernelShape.slice();if(e.kernelShape.length===0||e.kernelShape.reduce((p,m)=>p*m,1)===0){r.length=0;for(let p=2;p<t[1].dims.length;++p)r.push(t[1].dims[p])}let i=e.format==="NHWC";r.splice(0,0,t[1].dims[0]),r.splice(i?3:1,0,t[1].dims[1]);let n=e.pads.slice(),a=e.outputShape.slice(),s=e.outputPadding.slice(),o=t[0].dims,u=e.dilations.slice();if(u.reduce((p,m)=>p+m,0)===0){let p=t[0].dims.length-2;u=new Array(p).fill(1)}let l=e.strides.slice();if(l.reduce((p,m)=>p+m,0)===0){let p=t[0].dims.length-2;l=new Array(p).fill(1)}xl(o,r,u,e.autoPad,e.group,n,l,i,s,a);let c=Object.assign({},e);return Object.assign(c,{kernelShape:r,pads:n,outputPadding:s,outputShape:a,dilations:u,strides:l}),c},Hh=e=>{let t=Da(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof e.autoPad>"u"?0:e.autoPad],n=e.dilations,a=e.group??1,s=e.kernelShape,o=e.pads,u=e.strides,l=e.wIsConst(),c=e.outputPadding,p=e.outputShape;return{autoPad:i,format:r,dilations:n,group:a,kernelShape:s,outputPadding:c,outputShape:p,pads:o,strides:u,wIsConst:l,...t,cacheKey:`${e.format};${t.activation};`}},vl=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4&&e[0].dims.length!==3)throw new Error("currently only support 2-dimensional conv");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[0];if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let n=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==n))throw new Error("invalid bias");let a=e[0].dims.length-2;if(t.dilations.reduce((s,o)=>s+o,0)>0&&t.dilations.length!==a)throw new Error(`dilations should be ${a}D`);if(t.strides.reduce((s,o)=>s+o,0)>0&&t.strides.length!==a)throw new Error(`strides should be ${a}D`);if(t.pads.reduce((s,o)=>s+o,0)>0&&t.pads.length!==a*2)throw new Error(`pads should be ${a*2}D`);if(t.outputPadding.length!==a&&t.outputPadding.length!==0)throw new Error(`output_padding should be ${a}D`);if(t.kernelShape.reduce((s,o)=>s+o,0)>0&&t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw new Error("invalid output shape")},$n=(e,t,r,i)=>{let n=e.kernelCustomData.wT??e.compute(Je(t[1],[2,3,0,1]),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=n);let a=[t[0],n];t.length===3&&a.push(t[2]),e.compute(Vh(a,r,i),{inputs:a})},kl=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let n=t.kernelShape;(n.length===0||n[0]===0)&&(n=[e.inputs[1].dims[2]]);let a=t.dilations;(a.length===0||a[0]===0)&&(a=[1]);let s=t.strides;(s.length===0||s[0]===0)&&(s=[1]);let o=t.pads;o.length===0&&(o=[0,0]),o=[0,o[0],0,o[1]],s=[1].concat(s),a=[1].concat(a),n=[1].concat(n);let u=t.outputPadding;u=[0].concat(u);let l=bn({...t,pads:o,strides:s,dilations:a,kernelShape:n,outputPadding:u},i);$n(e,i,l,c=>r?[c[0],c[2],c[3]]:[c[0],c[1],c[3]])},Fh=(e,t)=>{if(vl(e.inputs,t),e.inputs[0].dims.length===3)kl(e,t);else{let r=bn(t,e.inputs);$n(e,e.inputs,r)}}}),Sl,jh,Kh,by=X(()=>{"use strict";le(),pe(),Be(),he(),Sl=(e,t,r,i)=>{let n=U.size(t),a=t.length,s=F("input",e,a),o=ae("output",e,a),u=r.dataType===6?r.getInt32Array()[0]:Number(r.getBigInt64Array()[0]),l=U.normalizeAxis(u,a),c=p=>{let m=` i32(${s.indicesGet("inputIndices","uniforms.axis")}) `,g=se("uniforms.input_shape","uniforms.axis",a),f=i.reverse?m+(i.exclusive?" + 1":""):"0",_=i.reverse?g:m+(i.exclusive?"":" + 1");return`
                ${p.registerUniform("outputSize","u32").registerUniform("axis","u32").declareVariables(s,o)}
                ${p.mainStart()}
                  ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${o.offsetToIndices("global_idx")};
                  var sum = ${o.type.value}(0);
                  let first : i32 = ${f};
                  let last : i32 = ${_};
                  for (var i : i32 = first; i < last; i++) {
                    ${s.indicesSet("inputIndices","uniforms.axis","u32(i)")};
                    sum = sum + ${s.getByIndices("inputIndices")};
                  }
                  ${o.setByOffset("global_idx","sum")};
                }`};return{name:"CumSum",shaderCache:{hint:i.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:[{type:12,data:n},{type:12,data:l},...oe(t,t)]}),getShaderSource:c}},jh=(e,t)=>{let r=e.inputs[0].dims,i=e.inputs[0].dataType,n=e.inputs[1];e.compute(Sl(i,r,n,t),{inputs:[0]})},Kh=e=>{let t=e.exclusive===1,r=e.reverse===1;return Te({exclusive:t,reverse:r})}}),Il,Tl,Cl,Zh,Yh,$y=X(()=>{"use strict";le(),pe(),Be(),he(),Il=e=>{if(!e||e.length!==1)throw new Error("DepthToSpace requires 1 input.");if(e[0].dims.length!==4)throw new Error("DepthToSpace requires 4D input.")},Tl=(e,t,r,i)=>{let n=[];n.push(`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`);for(let a=0;a<t;++a)n.push(r.indicesSet("a",e[a],`i[${a}]`));return n.push("return a;}"),n.join(`
`)},Cl=(e,t)=>{let r,i,n,a,s,o,u=t.format==="NHWC",l=t.blocksize,c=t.mode==="DCR";u?([r,i,n,a]=e.dims,s=c?[r,i,n,l,l,a/l**2]:[r,i,n,a/l**2,l,l],o=c?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([r,i,n,a]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],s=c?[r,l,l,a/l**2,i,n]:[r,a/l**2,l,l,i,n],o=c?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let p=e.reshape(s),m=p.dims.length,g=e.dataType,f=F("a",g,m),_=ae("output",g,m),v=$=>`
  ${$.registerUniform("output_size","u32").declareVariables(f,_)}

  ${Tl(o,m,f,_)}

  ${$.mainStart()}
    ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${_.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${_.setByOffset("global_idx",f.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:["rank"]},getRunData:$=>{let b=u?[r,i*l,n*l,a/l**2]:[r,a/l**2,i*l,n*l],k=U.size(b),I=p.dims,S=U.sortBasedOnPerm(I,o);return{outputs:[{dims:b,dataType:$[0].dataType}],dispatchGroup:{x:Math.ceil(k/64)},programUniforms:[{type:12,data:k},...oe(I,S)]}},getShaderSource:v}},Zh=(e,t)=>{Il(e.inputs),e.compute(Cl(e.inputs[0],t))},Yh=e=>Te({blocksize:e.blocksize,mode:e.mode,format:e.format})}),bt,$r,ni,xn,Et,El,zl,Ml,vn,kn,Sn,Al,Ol,In,Bl,Xh,Qh,xy=X(()=>{"use strict";le(),pe(),Be(),he(),bt=256,$r=512,ni=2*Math.PI,xn=e=>{let t=[],r=e;for(let i of[4,2,3,5])for(;r%i===0;)t.push(i),r/=i;return r===1?t:void 0},Et=e=>{let t=e.toPrecision(9);return/[.eE]/.test(t)?t:`${t}.0`},El=(e,t,r,i,n)=>{let a=r/e,s=$r-i,o=l=>`smem[${s}u + base + ${l*t}u]`,u=`  for (var t = local_idx; t < ${a}u; t += ${bt}u) {
`;u+=`    let twiddleIndex = t % ${t}u;
    let angleUnit = f32(twiddleIndex);
`,u+=`    var leg: array<vec2<f32>, 5>;
`;for(let l=0;l<e;l++){let c=`${i}u + t + ${l*a}u`;if(l===0)u+=`    leg[0] = smem[${c}];
`;else{let p=n*ni*l/(e*t);u+=`    { let a = ${Et(p)} * angleUnit; leg[${l}] = cmul(smem[${c}], vec2<f32>(cos(a), sin(a))); }
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
`}else for(let l=0;l<e;l++){let c=["leg[0]"];for(let p=1;p<e;p++){let m=n*ni*(p*l)/e,g=Et(Math.cos(m)),f=Et(Math.sin(m));c.push(`vec2<f32>(leg[${p}].x*${g} - leg[${p}].y*${f}, leg[${p}].x*${f} + leg[${p}].y*${g})`)}u+=`    ${o(l)} = ${c.join(" + ")};
`}return`${u}  }
  workgroupBarrier();
`},zl=(e,t,r)=>{let i="",n=1,a=0;for(let s of e)i+=El(s,n,t,a,r),n*=s,a=$r-a;return{code:i,resultOffset:a}},Ml=(e,t,r,i,n)=>{let a=e.dims,s=a.length,o=a[s-1],u=a[t],l=r&&i?(u-1)*2:u;n!==void 0&&(l=n);let c=r&&i?1:2,p=i&&!r?Math.floor(l/2)+1:l,m=a.slice();m[t]=p,m[s-1]=c;let g=1;for(let _=t+1;_<s-1;_++)g*=a[_];let f=U.size(a)/o/u;return{dataType:e.dataType,outputDims:m,length:l,signalLength:u,inner:g,batch:f,inputComponents:o,outputComponents:c,outputLength:p,inverse:r,onesided:i}},vn=(e,t)=>[t,e.length,e.inputComponents,e.outputComponents,e.inverse,e.onesided].join(";"),kn=e=>[{type:12,data:e.batch},{type:12,data:e.signalLength},{type:12,data:e.inner},{type:12,data:e.outputLength}],Sn=(e,t,r)=>e.registerUniform("batch","u32").registerUniform("signalLength","u32").registerUniform("inner","u32").registerUniform("outputLength","u32").declareVariables(t,r),Al=e=>{let{dataType:t,length:r,inputComponents:i,outputComponents:n,inverse:a,onesided:s}=e,o=Le(t),u=a?1:-1,l=a?1/r:1,c=xn(r),p=m=>{let g=F("x",t,[1]),f=ae("y",t,[1]),_=S=>{let E=`inBase + (${S}) * uniforms.inner * ${i}u`,C=`f32(${g.getByOffset(E)})`,x=i===2?`f32(${g.getByOffset(`${E} + 1u`)})`:"0.0";return`vec2<f32>(${C}, ${x})`},v;if(a&&s){let S=Math.floor(r/2)+1,E=r%2===0?`select(provided, provided - 1u, provided == ${S}u)`:"provided";v=`
    let provided = min(uniforms.signalLength, ${S}u);
    for (var i = local_idx; i < ${r}u; i += ${bt}u) {
      if (i < provided) { smem[i] = ${_("i")}; } else { smem[i] = vec2<f32>(0.0); }
    }
    workgroupBarrier();
    for (var k = local_idx + 1u; k < ${E}; k += ${bt}u) {
      let h = smem[k];
      smem[${r}u - k] = vec2<f32>(h.x, -h.y);
    }
    workgroupBarrier();`}else v=`
    let loadCount = min(uniforms.signalLength, ${r}u);
    for (var i = local_idx; i < ${r}u; i += ${bt}u) {
      if (i < loadCount) { smem[i] = ${_("i")}; } else { smem[i] = vec2<f32>(0.0); }
    }
    workgroupBarrier();`;let{code:$,resultOffset:b}=zl(c,r,u),k=l===1?`smem[${b}u + i]`:`smem[${b}u + i] * ${Et(l)}`,I=n===2?f.setByOffset("off + 1u",`${o}(v.y)`):"";return`
  ${Sn(m,g,f)}
  var<workgroup> smem: array<vec2<f32>, ${2*$r}>;
  fn cmul(a: vec2<f32>, b: vec2<f32>) -> vec2<f32> {
    return vec2<f32>(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
  }
  ${m.mainStart(bt)}
    let row = workgroup_index;
    if (row >= uniforms.batch) { return; }
    let outer = row / uniforms.inner;
    let within = row % uniforms.inner;
    let inBase = (outer * uniforms.signalLength * uniforms.inner + within) * ${i}u;
    let outBase = (outer * uniforms.outputLength * uniforms.inner + within) * ${n}u;
    ${v}
${$}    for (var i = local_idx; i < uniforms.outputLength; i += ${bt}u) {
      let v = ${k};
      let off = outBase + i * uniforms.inner * ${n}u;
      ${f.setByOffset("off",`${o}(v.x)`)}
      ${I}
    }
  }`};return{name:"DFT",shaderCache:{hint:vn(e,"fft"),inputDependencies:["type"]},getShaderSource:p,getRunData:()=>({outputs:[{dims:e.outputDims,dataType:t}],programUniforms:kn(e),dispatchGroup:{x:e.batch}})}},Ol=e=>{let{dataType:t,length:r,inputComponents:i,outputComponents:n,inverse:a,onesided:s}=e,o=Le(t),u=a?1:-1,l=a?1/r:1,c=p=>{let m=F("x",t,[1]),g=ae("y",t,[1]),f=k=>{let I=`inBase + (${k}) * uniforms.inner * ${i}u`,S=`f32(${m.getByOffset(I)})`,E=i===2?`f32(${m.getByOffset(`${I} + 1u`)})`:"0.0";return`vec2<f32>(${S}, ${E})`},_=a&&s?`fn spectrum(inBase: u32, k: u32) -> vec2<f32> {
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
      let angle = ${Et(u*ni)} * f32(knMod) / ${Et(r)};
      acc += cmul(spectrum(inBase, n), vec2<f32>(cos(angle), sin(angle)));
      knMod += k;
      if (knMod >= ${r}u) { knMod -= ${r}u; }`,$=n===2?g.setByOffset("off + 1u",`${o}(v.y)`):"",b=l===1?"acc":`acc * ${Et(l)}`;return`
  ${Sn(p,m,g)}
  fn cmul(a: vec2<f32>, b: vec2<f32>) -> vec2<f32> {
    return vec2<f32>(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
  }
  ${_}
  ${p.mainStart(bt)}
    let row = workgroup_index;
    if (row >= uniforms.batch) { return; }
    let outer = row / uniforms.inner;
    let within = row % uniforms.inner;
    let inBase = (outer * uniforms.signalLength * uniforms.inner + within) * ${i}u;
    let outBase = (outer * uniforms.outputLength * uniforms.inner + within) * ${n}u;
    for (var k = local_idx; k < uniforms.outputLength; k += ${bt}u) {
      var acc = vec2<f32>(0.0, 0.0);
      var knMod = 0u;
      for (var n = 0u; n < ${r}u; n++) {${v}
      }
      let v = ${b};
      let off = outBase + k * uniforms.inner * ${n}u;
      ${g.setByOffset("off",`${o}(v.x)`)}
      ${$}
    }
  }`};return{name:"DFT",shaderCache:{hint:vn(e,"direct"),inputDependencies:["type"]},getShaderSource:c,getRunData:()=>({outputs:[{dims:e.outputDims,dataType:t}],programUniforms:kn(e),dispatchGroup:{x:e.batch}})}},In=e=>{if(!e||e.dataType===0)return;if(U.size(e.dims)!==1)throw new Error("DFT optional scalar inputs must have exactly 1 element.");if(e.dataType===6)return e.getInt32Array()[0];let t=Number(e.getBigInt64Array()[0]);if(!Number.isSafeInteger(t))throw new Error("DFT optional scalar inputs are out of JavaScript safe integer range.");return t},Bl=e=>{if(!e||e.length<1)throw new Error("DFT requires at least 1 input.");let t=e[0].dims;if(t.length<2)throw new Error("DFT input must have at least 2 dimensions.");let r=t[t.length-1];if(r!==1&&r!==2)throw new Error("DFT input's innermost dimension must be 1 (real) or 2 (complex).")},Xh=(e,t)=>{Bl(e.inputs);let r=e.inputs[0],i=r.dims.length,n=t.inverse!==0,a=t.onesided!==0,s=In(e.inputs[1]);if(s!==void 0&&s<=0)throw new Error("dft_length must be greater than zero.");let o=U.normalizeAxis(In(e.inputs[2])??t.axis,i);if(o===i-1)throw new Error("DFT axis must refer to a signal dimension, not the innermost (real/imaginary) dimension.");if(n&&a&&r.dims[i-1]!==2)throw new Error("Inverse one-sided DFT (IRFFT) requires complex-valued input (innermost dimension 2).");let u=Ml(r,o,n,a,s);if(u.length<=0)throw new Error(`Invalid DFT length: ${u.length}`);let l=u.length<=$r&&xn(u.length)!==void 0?Al(u):Ol(u);e.compute(l,{inputs:[0]})},Qh=e=>Te({axis:e.axis??1,inverse:e.inverse??0,onesided:e.onesided??0})}),ai,xr,Tn,Rl,Dl,Nl,Ul,Cn,Pl,Jh,ef,vy=X(()=>{"use strict";le(),pe(),Be(),he(),ai="[a-zA-Z]|\\.\\.\\.",xr="("+ai+")+",Tn="^"+xr+"$",Rl="("+xr+",)*"+xr,Dl="^"+Rl+"$",Nl=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,t){let r=this.symbolToIndices.get(e);r===void 0?r=[t]:r.push(t),this.symbolToIndices.set(e,r)}},Ul=class{constructor(e,t){this.equation=t,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=new Array,this.outputDims=[];let[r,i]=t.includes("->")?t.split("->",2):[t,""];if(!r.match(RegExp(Dl)))throw new Error("Invalid LHS term");if(r.split(",").forEach((n,a)=>{let s=e[a].dims.slice();if(!n.match(RegExp(Tn)))throw new Error("Invalid LHS term");let o=this.processTerm(n,!0,s,a);this.lhs.push(o)}),i==="")i+=[...this.symbolToInfo.entries()].filter(([n,a])=>a.count===1||n==="...").map(([n])=>n).join("");else if(!i.match(RegExp(xr)))throw new Error("Invalid RHS");i.match(RegExp(ai,"g"))?.forEach(n=>{if(n==="...")this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let a=this.symbolToInfo.get(n);if(a===void 0)throw new Error("Invalid RHS symbol");this.outputDims.push(a.dimValue)}}),this.rhs=this.processTerm(i,!1,this.outputDims)}addSymbol(e,t,r){let i=this.symbolToInfo.get(e);if(i!==void 0){if(i.dimValue!==t&&i.count!==1)throw new Error("Dimension mismatch");i.count++,i.inputIndices.push(r)}else i={count:1,dimValue:t,inputIndices:[r]};this.symbolToInfo.set(e,i)}processTerm(e,t,r,i=-1){let n=r.length,a=!1,s=[],o=0;if(!e.match(RegExp(Tn))&&!t&&e!=="")throw new Error("Invalid LHS term");let u=e.match(RegExp(ai,"g")),l=new Nl(i);return u?.forEach((c,p)=>{if(c==="..."){if(a)throw new Error("Only one ellipsis is allowed per input term");a=!0;let m=n-u.length+1;if(m<0)throw new Error("Ellipsis out of bounds");if(s=r.slice(o,o+m),this.hasEllipsis){if(this.ellipsisDims.length!==s.length||this.ellipsisDims.toString()!==s.toString())throw new Error("Ellipsis dimensions mismatch")}else if(t)this.hasEllipsis=!0,this.ellipsisDims=s;else throw new Error("Ellipsis must be specified in the LHS");for(let g=0;g<s.length;g++){let f=String.fromCharCode(48+g);l.addSymbol(f,p+g),this.addSymbol(f,r[o++],i)}}else l.addSymbol(c,p+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(c,r[o++],i)}),l}},Cn=e=>e+"_max",Pl=(e,t,r,i)=>{let n=e.map(l=>l.length).map((l,c)=>F(`input${c}`,t,l)),a=U.size(i),s=ae("output",t,i.length),o=[...r.symbolToInfo.keys()].filter(l=>!r.rhs.symbolToIndices.has(l)),u=l=>{let c=[],p="var prod = 1.0;",m="var sum = 0.0;",g="sum += prod;",f=[],_=[],v=[],$=[],b=r.symbolToInfo.size===r.rhs.symbolToIndices.size;r.symbolToInfo.forEach((I,S)=>{if(r.rhs.symbolToIndices.has(S)){let E=r.rhs.symbolToIndices.get(S)?.[0];E!==void 0&&r.lhs.forEach((C,x)=>{if(I.inputIndices.includes(x)){let O=C.symbolToIndices.get(S);if(O===void 0)throw new Error("Invalid symbol error");O.forEach(N=>{c.push(`${n[x].indicesSet(`input${x}Indices`,N,s.indicesGet("outputIndices",E))}`)})}})}else r.lhs.forEach((E,C)=>{if(I.inputIndices.includes(C)){let x=E.symbolToIndices.get(S);if(x===void 0)throw new Error("Invalid symbol error");x.forEach(O=>{f.push(`${n[C].indicesSet(`input${C}Indices`,O,`${S}`)}`)}),$.push(`prod *= ${n[C].getByIndices(`input${C}Indices`)};`)}}),_.push(`for(var ${S}: u32 = 0; ${S} < uniforms.${Cn(S)}; ${S}++) {`),v.push("}")});let k=b?[...c,`let sum = ${n.map((I,S)=>I.getByIndices(`input${S}Indices`)).join(" * ")};`]:[...c,m,..._,...f,p,...$,g,...v];return`
            ${l.registerUniforms(o.map(I=>({name:`${Cn(I)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...n,s)}

            ${l.mainStart()}
            ${l.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${s.offsetToIndices("global_idx")};
            ${n.map((I,S)=>`var input${S}Indices: ${n[S].type.indices};`).join(`
`)}
            ${k.join(`
`)};
            ${s.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:r.equation,inputDependencies:e.map(()=>"rank")},getRunData:()=>{let l=o.filter(p=>r.symbolToInfo.has(p)).map(p=>({type:12,data:r.symbolToInfo.get(p)?.dimValue||0}));l.push({type:12,data:a});let c=e.map((p,m)=>[...oe(p)]).reduce((p,m)=>p.concat(m),l);return c.push(...oe(i)),{outputs:[{dims:i,dataType:t}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:c}},getShaderSource:u}},Jh=(e,t)=>{let r=new Ul(e.inputs,t.equation),i=r.outputDims,n=e.inputs.map((a,s)=>a.dims);e.compute(Pl(n,e.inputs[0].dataType,r,i))},ef=e=>{let t=e.equation.replace(/\s+/g,"");return Te({equation:t})}}),Ll,En,Wl,ql,tf,ky=X(()=>{"use strict";le(),pe(),he(),Ll=e=>{if(!e||e.length!==2)throw new Error("Expand requires 2 input.");let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=r.length<t.length?0:r.length-t.length,n=t.length<r.length?0:t.length-r.length;for(;i<r.length&&n<t.length;++i,++n)if(r[i]!==t[n]&&r[i]!==1&&t[n]!==1)throw new Error("Expand requires shape to be broadcastable to input")},En=(e,t)=>{let r=e.length-t.length,i=[];for(let n=0;n<r;++n)i.push(e[n]);for(let n=0;n<t.length;++n)i.push(t[n]===1?e[n+r]:t[n]);return i},Wl=(e,t)=>e.length>t.length?En(e,t):En(t,e),ql=e=>{let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=Wl(t,r),n=e[0].dataType,a=n===9||U.size(t)===1,s=n===9||t.length>0&&t[t.length-1]%4===0?4:1,o=a||i.length>0&&i[i.length-1]%4===0?4:1,u=Math.ceil(U.size(i)/o),l=p=>{let m=F("input",n,t.length,s),g=ae("output",n,i.length,o),f;if(n===9){let _=(v,$,b="")=>`
          let outputIndices${$} = ${g.offsetToIndices(`outputOffset + ${$}u`)};
          let offset${$} = ${m.broadcastedIndicesToOffset(`outputIndices${$}`,g)};
          let index${$} = offset${$} / 4u;
          let component${$} = offset${$} % 4u;
          ${v}[${$}] = ${b}(${m.getByOffset(`index${$}`)}[component${$}]);
        `;f=`
        let outputOffset = global_idx * ${o};
        var data = vec4<u32>(0);
        ${_("data",0,"u32")}
        ${_("data",1,"u32")}
        ${_("data",2,"u32")}
        ${_("data",3,"u32")}
        ${g.setByOffset("global_idx","data")}
      }`}else f=`
        let outputIndices = ${g.offsetToIndices(`global_idx * ${o}`)};
        let inputOffset = ${m.broadcastedIndicesToOffset("outputIndices",g)};
        let data = ${g.type.value}(${m.getByOffset(`inputOffset / ${s}`)});
        ${g.setByOffset("global_idx","data")}
      }`;return`
    ${p.registerUniform("vec_size","u32").declareVariables(m,g)}
    ${p.mainStart()}
    ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${f}`},c=[{type:12,data:u},...oe(t,i)];return{name:"Expand",shaderCache:{hint:`${i.length};${s}${o}`,inputDependencies:["rank"]},getShaderSource:l,getRunData:()=>({outputs:[{dims:i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:c})}},tf=e=>{Ll(e.inputs),e.compute(ql(e.inputs),{inputs:[0]})}}),Gl,rf,Sy=X(()=>{"use strict";le(),pe(),he(),Ra(),Gl=e=>{let t=e[0].dataType,r=U.size(e[0].dims),i=U.size(e[1].dims),n=i%4===0,a=s=>{let o=F("x",t,[1],4),u=F("bias",t,[1],4),l=ae("y",t,[1],4),c=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],p=g=>`
      let bias${g}_offset: u32 = (global_idx * 4 + ${g}) % uniforms.bias_size;
      let bias${g} = ${u.getByOffset(`bias${g}_offset / 4`)}[bias${g}_offset % 4];`,m=n?`
      let bias = ${u.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${p(0)}${p(1)}${p(2)}${p(3)}
      let bias = ${o.type.value}(bias0, bias1, bias2, bias3);`;return`${s.registerUniforms(c).declareVariables(o,u,l)}

    ${sa(Le(t))}

    ${s.mainStart(pr)}
      ${s.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${o.getByOffset("global_idx")};
      ${m}
      let x_in = x + bias;
      ${l.setByOffset("global_idx",oa("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${n}`,inputDependencies:["type","type"]},getShaderSource:a,getRunData:s=>({outputs:[{dims:s[0].dims,dataType:s[0].dataType}],programUniforms:[{type:12,data:Math.ceil(r/4)},{type:12,data:i}],dispatchGroup:{x:Math.ceil(r/pr/4)}})}},rf=e=>{e.inputs.length<2||U.size(e.inputs[1].dims)===0?bh(e):e.compute(Gl(e.inputs))}}),Vl,Hl,nf,af,Iy=X(()=>{"use strict";le(),pe(),Be(),he(),Vl=e=>{if(!e||e.length!==2)throw new Error("Gather requires 2 inputs.")},Hl=(e,t)=>{let r=e[0].dims,i=e[1].dims,n=r.length,a=U.normalizeAxis(t.axis,n),s=r.slice(0);s.splice(a,1,...i);let o=r[a],u=e[0].dataType===9?4:1,l=Math.ceil(U.size(s)/u),c=[{type:12,data:l},{type:6,data:o},{type:12,data:a},...oe(e[0].dims,e[1].dims,s)],p=m=>{let g=F("data",e[0].dataType,e[0].dims.length,u),f=F("inputIndices",e[1].dataType,e[1].dims.length),_=ae("output",e[0].dataType,s.length,u),v=b=>{let k=i.length,I=`var indicesIndices${b}  = ${f.type.indices}(0);`;for(let S=0;S<k;S++)I+=`${k>1?`indicesIndices${b}[${S}]`:`indicesIndices${b}`} = ${s.length>1?`outputIndices${b}[uniforms.axis + ${S}]`:`outputIndices${b}`};`;I+=`
          var idx${b} = ${f.getByIndices(`indicesIndices${b}`)};
          if (idx${b} < 0) {
            idx${b} = idx${b} + uniforms.axisDimLimit;
          }
          var dataIndices${b} : ${g.type.indices};
        `;for(let S=0,E=0;S<n;S++)S===a?(I+=`${n>1?`dataIndices${b}[${S}]`:`dataIndices${b}`} = u32(idx${b});`,E+=k):(I+=`${n>1?`dataIndices${b}[${S}]`:`dataIndices${b}`} = ${s.length>1?`outputIndices${b}[${E}]`:`outputIndices${b}`};`,E++);return I},$;if(e[0].dataType===9){let b=(k,I,S="")=>`
          let outputIndices${I} = ${_.offsetToIndices(`outputOffset + ${I}u`)};
          ${v(I)};
          let offset${I} = ${g.indicesToOffset(`dataIndices${I}`)};
          let index${I} = offset${I} / 4u;
          let component${I} = offset${I} % 4u;
          ${k}[${I}] = ${S}(${g.getByOffset(`index${I}`)}[component${I}]);
        `;$=`
        let outputOffset = global_idx * ${u};
        var value = vec4<u32>(0);
        ${b("value",0,"u32")}
        ${b("value",1,"u32")}
        ${b("value",2,"u32")}
        ${b("value",3,"u32")}
        ${_.setByOffset("global_idx","value")}
      `}else $=`
      let outputIndices = ${_.offsetToIndices("global_idx")};
      ${v("")};
      let value = ${g.getByIndices("dataIndices")};
      ${_.setByOffset("global_idx","value")};
      `;return`
      ${m.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(g,f,_)}
      ${m.mainStart()}
        ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${$}
      }`};return{name:"Gather",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:s,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:c}),getShaderSource:p}},nf=e=>Te({axis:e.axis}),af=(e,t)=>{let r=e.inputs;Vl(r),e.compute(Hl(e.inputs,t))}}),Fl,sf,of,Ty=X(()=>{"use strict";le(),pe(),he(),Fl=(e,t,r,i,n,a,s,o,u)=>{let l=[{type:12,data:a},{type:12,data:i},{type:12,data:n},{type:12,data:r},{type:12,data:s},{type:12,data:o},{type:12,data:u}],c=[a];l.push(...oe(t.dims,c));let p=m=>{let g=F("indices_data",t.dataType,t.dims.length),f=ae("input_slice_offsets_data",12,1,1),_=[g,f],v=[{name:"output_size",type:"u32"},{name:"batch_dims",type:"u32"},{name:"input_dims",type:"u32",length:n.length},{name:"sizes_from_slice_dims_data",type:"u32",length:r.length},{name:"num_slices_per_batch",type:"u32"},{name:"input_batch_stride",type:"u32"},{name:"num_slice_dims",type:"u32"}];return`
  ${m.registerUniforms(v).declareVariables(..._)}
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
  }`};return e.compute({name:"computeSliceOffsets",shaderCache:{hint:`${n.length}_${r.length}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:c,dataType:e.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:l}),getShaderSource:p},{inputs:[t],outputs:[-1]})[0]},sf=(e,t)=>{let r=e.inputs,i=r[0].dims,n=r[0].dataType,a=r[1].dims,s=a[a.length-1],o=U.sizeToDimension(a,a.length-1),u=U.sizeFromDimension(i,t.batchDims+s),l=U.sizeToDimension(i,t.batchDims),c=U.sizeFromDimension(i,t.batchDims),p=o/l,m=new Array(s),g=u;for(let I=0;I<s;++I)m[s-1-I]=g,g*=i[t.batchDims+s-1-I];let f=Fl(e,r[1],m,t.batchDims,i,o,p,c,s),_=t.batchDims+s;if(_>i.length)throw new Error("last dimension of indices must not be larger than rank of input tensor");let v=a.slice(0,-1).concat(i.slice(_)),$=U.size(v),b=[{type:12,data:$},{type:12,data:u},...oe(r[0].dims,f.dims,v)],k=I=>{let S=F("data",r[0].dataType,r[0].dims.length),E=F("slice_offsets",12,f.dims.length),C=ae("output",r[0].dataType,v.length);return`
          ${I.registerUniform("output_size","u32").registerUniform("slice_size","u32").declareVariables(S,E,C)}
            ${I.mainStart()}
            ${I.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`};e.compute({name:"GatherND",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:v,dataType:n}],dispatchGroup:{x:Math.ceil($/64)},programUniforms:b}),getShaderSource:k},{inputs:[r[0],f]})},of=e=>({batchDims:e.batch_dims,cacheKey:""})}),jl,Kl,uf,lf,Cy=X(()=>{"use strict";le(),pe(),Be(),he(),jl=(e,t)=>{if(e.length<3||e.length>4)throw new Error("GatherBlockQuantized requires 3 or 4 inputs.");let r=U.normalizeAxis(t.quantizeAxis,e[0].dims.length),i=t.blockSize,n=e[0],a=e[2],s=e.length===4?e[3]:void 0;if(a.dims.length!==n.dims.length||!n.dims.map((o,u)=>u===r?Math.ceil(o/i)===a.dims[u]:o===a.dims[u]).reduce((o,u)=>o&&u,!0))throw new Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");if(s){if(s.dataType!==n.dataType)throw new Error("Zero point must have the same data type as the input tensor.");if(s.dims.length!==a.dims.length||!s.dims.map((o,u)=>o===a.dims[u]).reduce((o,u)=>o&&u,!0))throw new Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.")}},Kl=(e,t)=>{let r=e[0].dims,i=e[1].dims,n=r.length,a=U.normalizeAxis(t.gatherAxis,n),s=U.normalizeAxis(t.quantizeAxis,n),o=r.slice(0);o.splice(a,1,...i);let u=U.size(o),l=e[2].dataType,c=e[0].dataType===22,p=[{type:12,data:u},{type:12,data:s},{type:12,data:a},{type:12,data:t.blockSize},...oe(...e.map((g,f)=>g.dims),o)],m=g=>{let f=F("data",e[0].dataType,e[0].dims.length),_=F("inputIndices",e[1].dataType,e[1].dims.length),v=F("scales",e[2].dataType,e[2].dims.length),$=e.length>3?F("zeroPoint",e[3].dataType,e[3].dims.length):void 0,b=ae("output",l,o.length),k=[f,_,v];$&&k.push($);let I=[{name:"output_size",type:"u32"},{name:"quantize_axis",type:"u32"},{name:"gather_axis",type:"u32"},{name:"block_size",type:"u32"}];return`
        ${g.registerUniforms(I).declareVariables(...k,b)}
        ${g.mainStart()}
        let output_indices = ${b.offsetToIndices("global_idx")};
        var indices_indices = ${_.type.indices}(0);
        ${i.length>1?`
          for (var i: u32 = 0; i < ${i.length}; i++) {
            let index = ${b.indicesGet("output_indices","uniforms.gather_axis + i")};
            ${_.indicesSet("indices_indices","i","index")};
          }`:`indices_indices = ${b.indicesGet("output_indices","uniforms.gather_axis")};`};
        var data_indices = ${f.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${b.indicesGet("output_indices","i")};
          ${f.indicesSet("data_indices","i","index")};
        }
        var index_from_indices = ${_.getByIndices("indices_indices")};
        if (index_from_indices < 0) {
          index_from_indices += ${r[a]};
        }
        ${f.indicesSet("data_indices","uniforms.gather_axis","u32(index_from_indices)")};
        for (var i = uniforms.gather_axis + 1; i < ${o.length}; i++) {
          let index = ${b.indicesGet("output_indices",`i + ${i.length} - 1`)};
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
        ${$?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${$.indicesToOffset("zero_point_indices")};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${$.getByOffset("zero_point_offset / 8")};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${c?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:"var zero_point = 0"};
        let dequantized_data = ${Le(l)}(quantized_data - zero_point) * scale;
        ${b.setByOffset("global_idx","dequantized_data")};
    }`};return{name:"GatherBlockQuantized",shaderCache:{hint:`${t.cacheKey};${e.filter((g,f)=>f!==1).map(g=>g.dims.join("_")).join(";")}`,inputDependencies:Array.from({length:e.length},(g,f)=>"rank")},getRunData:()=>({outputs:[{dims:o,dataType:l}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:p}),getShaderSource:m}},uf=(e,t)=>{let r=e.inputs;jl(r,t),e.compute(Kl(e.inputs,t))},lf=e=>Te({blockSize:e.blockSize,gatherAxis:e.gatherAxis,quantizeAxis:e.quantizeAxis})}),Zl,Yl,df,cf,Ey=X(()=>{"use strict";le(),pe(),Be(),he(),Zl=e=>{if(!e||e.length!==2)throw new Error("GatherElements requires 2 inputs.");if(e[0].dims.length<1)throw new Error("GatherElements requires that the data input be rank >= 1.");if(e[0].dims.length!==e[1].dims.length)throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},Yl=(e,t)=>{let r=e[0].dims,i=e[0].dataType,n=r.length,a=e[1].dims,s=e[1].dataType,o=U.normalizeAxis(t.axis,n),u=r[o],l=a.slice(0),c=U.size(l),p=F("input",i,n),m=F("indicesInput",s,a.length),g=ae("output",i,l.length),f=[{type:12,data:c},{type:6,data:u},{type:12,data:o}];return f.push(...oe(r,a,l)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:l,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:f}),getShaderSource:_=>`
      ${_.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(p,m,g)}
      ${_.mainStart()}
      ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${g.offsetToIndices("global_idx")};

      var idx = ${m.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${p.type.indices}(outputIndices);
      ${p.indicesSet("inputIndices","uniforms.axis","u32(idx)")};
      let value = ${p.getByIndices("inputIndices")};

      ${g.setByOffset("global_idx","value")};
  }`}},df=e=>Te({axis:e.axis}),cf=(e,t)=>{let r=e.inputs;Zl(r),e.compute(Yl(e.inputs,t))}}),Xl,Ql,pf,hf,zy=X(()=>{"use strict";le(),pe(),he(),Xl=e=>{if(!e)throw new Error("Input is missing");if(e.length<2||e.length>3)throw new Error("Invaid input number.");if(e.length===3&&e[2].dims.length>2)throw new Error("Invalid input shape of C");if(e[0].dataType!==e[1].dataType||e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("Input types are mismatched")},Ql=(e,t)=>{let r=e[0].dims.slice(),i=e[1].dims.slice(),[n,a,s]=sp.getShapeOfGemmResult(r,t.transA,i,t.transB,e.length===3?e[2].dims:void 0),o=[n,a];if(!o)throw new Error("Can't use gemm on the given tensors");let u=16,l=Math.ceil(a/u),c=Math.ceil(n/u),p=!0,m=U.size(o),g=[{type:12,data:p?l:m},{type:12,data:n},{type:12,data:a},{type:12,data:s},{type:1,data:t.alpha},{type:1,data:t.beta}],f=["type","type"];e.length===3&&(g.push(...oe(e[2].dims)),f.push("rank")),g.push(...oe(o));let _=$=>{let b="";t.transA&&t.transB?b="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":t.transA&&!t.transB?b="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!t.transA&&t.transB?b="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":!t.transA&&!t.transB&&(b="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let k=t.alpha===1?"":"value *= uniforms.alpha;",I=F("a",e[0].dataType,e[0].dims),S=F("b",e[1].dataType,e[1].dims),E=I.type.value,C=null,x=[I,S];e.length===3&&(C=F("c",e[2].dataType,e[2].dims.length),x.push(C));let O=ae("output",e[0].dataType,o.length);x.push(O);let N=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${$.registerUniforms(N).declareVariables(...x)}

  ${$.mainStart()}
    ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${E}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${b}
    }

    ${k}
    ${C!=null?`let cOffset = ${C.broadcastedIndicesToOffset("vec2(m, n)",O)}; value += ${E}(uniforms.beta) * ${C.getByOffset("cOffset")};`:""}
    output[global_idx] = value;
  }`},v=$=>{let b=F("a",e[0].dataType,e[0].dims),k=F("b",e[1].dataType,e[1].dims),I=null,S=[b,k];e.length===3&&(I=F("c",e[2].dataType,e[2].dims.length),S.push(I));let E=ae("output",e[0].dataType,o.length);S.push(E);let C=[{name:"num_tile_n",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}],x="",O="";t.transA&&t.transB?(O=`
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
        tile_b[local_id.y][local_id.x] = ${k.type.value}(0);
      }
      `,x="value += tile_a[k][local_id.y] * tile_b[local_id.x][k];"):t.transA&&!t.transB?(O=`
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
        tile_b[local_id.y][local_id.x] = ${k.type.value}(0);
      }
      `,x="value += tile_a[k][local_id.y] * tile_b[k][local_id.x];"):!t.transA&&t.transB?(O=`
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
        tile_b[local_id.y][local_id.x] = ${k.type.value}(0);
      }
      `,x="value += tile_a[local_id.y][k] * tile_b[local_id.x][k];"):!t.transA&&!t.transB&&(O=`
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
        tile_b[local_id.y][local_id.x] = ${k.type.value}(0);
      }
      `,x="value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");let N=t.alpha===1?"":"value *= uniforms.alpha;";return`
  ${$.registerUniforms(C).declareVariables(...S)}
  var<workgroup> tile_a: array<array<${b.type.storage}, ${u}>, ${u}>;
  var<workgroup> tile_b: array<array<${k.type.storage}, ${u}>, ${u}>;
  ${$.mainStart([u,u,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * ${u};
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * ${u};
    let num_tiles = (uniforms.K - 1) / ${u} + 1;
    var k_start = 0u;
    var value = ${E.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${O}
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
  }`};return p?{name:"GemmShared",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:f},getRunData:()=>({outputs:[{dims:o,dataType:e[0].dataType}],dispatchGroup:{x:l*c},programUniforms:g}),getShaderSource:v}:{name:"Gemm",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:f},getRunData:()=>({outputs:[{dims:o,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:g}),getShaderSource:_}},pf=e=>{let t=e.transA,r=e.transB,i=e.alpha,n=e.beta;return{transA:t,transB:r,alpha:i,beta:n,cacheKey:`${e.transA};${e.transB};${e.alpha===1}`}},hf=(e,t)=>{Xl(e.inputs),e.compute(Ql(e.inputs,t))}}),ft,$t,Ut,Pt,Jl,ed,td,rd,id,nd,ad,sd,ff,mf,My=X(()=>{"use strict";le(),pe(),Be(),he(),[ft,$t,Ut,Pt]=[0,1,2,3],Jl=e=>{if(e[0].dims.length!==4)throw new Error("only 4-D tensor is supported.");if(e[0].dims.length!==e[1].dims.length)throw new Error("input dimensions must be equal to grid dimensions");if(e[0].dims.length-2!==e[1].dims[e[1].dims.length-1])throw new Error(`last dimension of grid must be equal to ${e[0].dims.length-2}`);if(e[0].dims[0]!==e[1].dims[0])throw new Error("grid batch size must match input batch size")},ed=`
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
     indices[${ft}] = batch;
     indices[${$t}] = channel;`+(()=>{switch(r.paddingMode){case"zeros":return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${Ut}] = u32(r);
            indices[${Pt}] = u32(c);
          } else {
            return ${t}(0);
          }
        `;case"border":return`
          indices[${Ut}] = u32(clamp(r, 0, H - 1));
          indices[${Pt}] = u32(clamp(c, 0, W - 1));
        `;case"reflection":return`
          indices[${Ut}] = gs_reflect(r, border[1], border[3]);
          indices[${Pt}] = gs_reflect(c, border[0], border[2]);
        `;default:throw new Error(`padding mode ${r.paddingMode} is not supported`)}})()+`
    return ${e.getByIndices("indices")};
  }
`,ad=(e,t,r)=>(()=>{switch(r.mode){case"nearest":return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${ft}], indices[${$t}], border);
        `;case"bilinear":return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${ft}], indices[${$t}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${ft}], indices[${$t}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${ft}], indices[${$t}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${ft}], indices[${$t}], border);

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
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${ft}], indices[${$t}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw new Error(`mode ${r.mode} is not supported`)}})()+`${e.setByOffset("global_idx","result")}`,sd=(e,t)=>{let r=F("x",e[0].dataType,e[0].dims.length),i=[e[1].dims[0],e[1].dims[1],e[1].dims[2]],n=F("grid",e[1].dataType,i.length,2),a=[e[0].dims[0],e[0].dims[1],e[1].dims[1],e[1].dims[2]];t.format==="NHWC"&&(a=[e[0].dims[0],e[1].dims[1],e[1].dims[2],e[0].dims[3]],[ft,$t,Ut,Pt]=[0,3,1,2]);let s=ae("output",e[0].dataType,a.length),o=r.type.value,u=U.size(a),l=[{type:12,data:u},...oe(e[0].dims,i,a)],c=p=>`
  ${p.registerUniform("output_size","u32").declareVariables(r,n,s)}
  ${ed}
  ${td(o)}
  ${rd(t)}
  ${id(t)}
  ${nd(r,o,t)}

  ${p.mainStart()}
    ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${Ut}]);
      let W_in = i32(uniforms.x_shape[${Pt}]);

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
      var grid_indices = vec3<u32>(indices[${ft}], indices[${Ut}], indices[${Pt}]);
      let nxy = ${n.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${ad(s,o,t)}
  }`;return{name:"GridSample",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:["type","type"]},getRunData:p=>{let m=U.size(a);return{outputs:[{dims:a,dataType:p[0].dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:l}},getShaderSource:c}},ff=(e,t)=>{Jl(e.inputs),e.compute(sd(e.inputs,t))},mf=e=>Te({alignCorners:e.align_corners,mode:e.mode,paddingMode:e.padding_mode,format:e.format})}),Ke,od,gf,zn,ud,Mr,yf,wf=X(()=>{"use strict";le(),pe(),Be(),Ma(),Ba(),he(),Ot(),Ke=(e,t)=>e.length>t&&e[t].dims.length>0?e[t]:void 0,od=(e,t)=>{let r=e[0],i=Ke(e,1),n=Ke(e,2),a=Ke(e,3),s=Ke(e,4),o=Ke(e,5),u=Ke(e,6),l=Ke(e,7);if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let c=r.dims[0],p=r.dims[1],m=r.dims.length===3?r.dims[2]:t.numHeads*r.dims[4],g=p,f=0,_=0,v=Math.floor(m/t.numHeads);if(u&&l&&U.size(u.dims)&&U.size(l.dims)){if(u.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(u.dims[0]!==c||u.dims[1]!==t.numHeads||u.dims[3]!==v)throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(l.dims[0]!==c||l.dims[1]!==t.numHeads||l.dims[3]!==v)throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(u.dims[2]!==l.dims[2])throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(l.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');f=u.dims[2],_=u.dims[2]}else if(u&&U.size(u.dims)||l&&U.size(l.dims))throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let $;if(i&&U.size(i.dims)>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(i.dims[2]!==r.dims[2])throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');$=2,g=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==v)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(n)throw new Error('Expect "value" be none when "key" has packed kv format.');$=5,g=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==v)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');$=0,g=i.dims[2]}}else{if(r.dims.length!==5)throw new Error('Input "query" is expected to have 5 dimensions when key is empty');if(r.dims[2]!==t.numHeads||r.dims[3]!==3)throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');$=3}if(a&&U.size(a.dims)>0){if(a.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimension');if(i&&i.dims.length===5&&i.dims[3]===2)throw new Error("bias is not allowed for packed kv.")}let b=f+g,k=0;if(s&&U.size(s.dims)>0){k=8;let C=s.dims;throw C.length===1?C[0]===c?k=1:C[0]===3*c+2&&(k=3):C.length===2&&C[0]===c&&C[1]===b&&(k=5),k===8?new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)'):new Error("Mask not supported")}let I=!1,S=m;if(n&&U.size(n.dims)>0){if(n.dims.length!==3&&n.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==n.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(n.dims.length===3){if(g!==n.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');S=n.dims[2]}else{if(g!==n.dims[2])throw new Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');S=n.dims[1]*n.dims[3],I=!0}}let E=!1;if(s&&U.size(s.dims)>0)throw new Error("Key padding mask is not supported");if(o&&U.size(o.dims)>0){if(o.dims.length!==4)throw new Error('Input "attention_bias" is expected to have 4 dimensions');if(o.dims[0]!==c||o.dims[1]!==t.numHeads||o.dims[2]!==p||o.dims[3]!==b)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:c,sequenceLength:p,pastSequenceLength:f,kvSequenceLength:g,totalSequenceLength:b,maxSequenceLength:_,inputHiddenSize:0,hiddenSize:m,vHiddenSize:S,headSize:v,vHeadSize:Math.floor(S/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:k,scale:t.scale,broadcastResPosBias:E,passPastInKv:I,qkvFormat:$}},gf=e=>Te({...e}),zn=Te({perm:[0,2,1,3]}),ud=(e,t,r,i,n,a,s)=>{let o=[i,n,a],u=U.size(o),l=[{type:12,data:u},{type:12,data:s},{type:12,data:a}],c=p=>{let m=ae("qkv_with_bias",t.dataType,o),g=F("qkv",t.dataType,o),f=F("bias",r.dataType,o),_=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${p.registerUniforms(_).declareVariables(g,f,m)}
  ${p.mainStart()}
    ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return e.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:o,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:l}),getShaderSource:c},{inputs:[t,r],outputs:[-1]})[0]},Mr=(e,t,r,i,n,a,s,o)=>{let u=a;if(s&&U.size(s.dims)>0){if(i===1)throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return u=ud(e,a,s,t,i,r*n,o),u=u.reshape([t,i,r,n]),r===1||i===1?u:e.compute(Je(u,zn.perm),{inputs:[u],outputs:[-1]})[0]}else return a.dims.length===3&&(u=a.reshape([t,i,r,n])),r===1||i===1?u:e.compute(Je(u,zn.perm),{inputs:[u],outputs:[-1]})[0]},yf=(e,t)=>{let r=od(e.inputs,t),i=e.inputs[0],n=Ke(e.inputs,1),a=Ke(e.inputs,2),s=Ke(e.inputs,3),o=Ke(e.inputs,4),u=Ke(e.inputs,5),l=Ke(e.inputs,6),c=Ke(e.inputs,7);if(i.dims.length===5)throw new Error("Packed QKV is not implemented");if(n?.dims.length===5)throw new Error("Packed KV is not implemented");let p=n&&a&&n.dims.length===4&&a.dims.length===4,m=Mr(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,i,s,0);if(p)return Dr(e,m,n,a,o,void 0,l,c,u,r);if(!n||!a)throw new Error("key and value must be provided");let g=Mr(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.headSize,n,s,r.hiddenSize),f=Mr(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.vHeadSize,a,s,2*r.hiddenSize);Dr(e,m,g,f,o,void 0,l,c,u,r)}}),ld,dd,cd,pd,pa,_f,bf,$f=X(()=>{"use strict";le(),pe(),Be(),he(),ld=e=>{if(!e||e.length<1)throw new Error("too few inputs")},dd=(e,t)=>{let r=[],i=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(n=>r.push(Number(n))),i=r.length),Te({numOutputs:i,axis:t.axis,splitSizes:r})},cd=e=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${se("uniforms.size_in_split_axis","i",e)}) {
        return i;
    }
    }
    return ${e}u;
}`,pd=e=>{let t=e.length,r=[];for(let i=0;i<t;++i){let n=e[i].setByIndices("indices","input[global_idx]");t===1?r.push(n):i===0?r.push(`if (output_number == ${i}u) { ${n} }`):i===t-1?r.push(`else { ${n} }`):r.push(`else if (output_number == ${i}) { ${n} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${r.join(`
`)}
      }`},pa=(e,t)=>{let r=e[0].dims,i=U.size(r),n=e[0].dataType,a=U.normalizeAxis(t.axis,r.length),s=new Array(t.numOutputs),o=F("input",n,r.length),u=new Array(t.numOutputs),l=[],c=[],p=0,m=[{type:12,data:i}];for(let f=0;f<t.numOutputs;f++){p+=t.splitSizes[f],u[f]=p;let _=r.slice();_[a]=t.splitSizes[f],c.push(_),s[f]=ae(`output${f}`,n,_.length),l.push({dims:c[f],dataType:e[0].dataType})}m.push({type:12,data:u},...oe(r,...c));let g=f=>`
  ${f.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",u.length).declareVariables(o,...s)}
  ${cd(u.length)}
  ${pd(s)}

  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${o.offsetToIndices("global_idx")};
    var index = ${o.indicesGet("indices",a)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${se("uniforms.size_in_split_axis","output_number - 1u",u.length)};
      ${o.indicesSet("indices",a,"index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;return{name:"Split",shaderCache:{hint:t.cacheKey,inputDependencies:["rank"]},getShaderSource:g,getRunData:()=>({outputs:l,dispatchGroup:{x:Math.ceil(i/64)},programUniforms:m})}},_f=(e,t)=>{ld(e.inputs);let r=e.inputs.length===1?t:dd(e.inputs,t);e.compute(pa(e.inputs,r),{inputs:[0]})},bf=e=>{let t=e.axis,r=e.splitSizes,i=e.numOutputs<0?r.length:e.numOutputs;if(i!==r.length)throw new Error("numOutputs and splitSizes length must be equal");return Te({axis:t,numOutputs:i,splitSizes:r})}}),hd,_i,xf,vf=X(()=>{"use strict";le(),pe(),Be(),he(),hd=(e,t)=>{let[r,i,n,a]=e,{numHeads:s,rotaryEmbeddingDim:o}=t;if(r.dims.length!==3&&r.dims.length!==4)throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${r.dims.length}`);if(!U.areEqual(i.dims,[])&&!U.areEqual(i.dims,[1])&&i.dims.length!==2)throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${i.dims.length}`);if(n.dims.length!==2)throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${n.dims.length}`);if(a.dims.length!==2)throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${a.dims.length}`);if(!U.areEqual(n.dims,a.dims))throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(o>0&&s===0)throw new Error("num_heads must be provided if rotary_embedding_dim is specified");let u=r.dims[0],l=r.dims[r.dims.length-2],c=n.dims[0],p=U.sizeFromDimension(r.dims,1)/l,m=o===0?n.dims[1]*2:p/s;if(o>m)throw new Error("rotary_embedding_dim must be less than or equal to head_size");if(i.dims.length===2){if(u!==i.dims[0])throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${i.dims[0]}`);if(l!==i.dims[1])throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${i.dims[1]}`)}if(l>c)throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported");if(m/2!==n.dims[1]&&o/2!==n.dims[1])throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${n.dims[1]}`)},_i=(e,t)=>{let{interleaved:r,numHeads:i,rotaryEmbeddingDim:n,scale:a}=t,s=e[0].dims[0],o=U.sizeFromDimension(e[0].dims,1),u=e[0].dims[e[0].dims.length-2],l=o/u,c=e[2].dims[1],p=n===0?c*2:l/i,m=new Array(s,u,l/p,p-c),g=U.computeStrides(m),f=[{type:1,data:a},{type:12,data:m},{type:12,data:g},...e[0].dims.length===3?new Array({type:12,data:[o,l,p,1]}):[],...e[0].dims.length===4?new Array({type:12,data:[o,p,u*p,1]}):[],...oe(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)],_=v=>{let $=F("input",e[0].dataType,e[0].dims.length),b=F("position_ids",e[1].dataType,e[1].dims.length),k=F("cos_cache",e[2].dataType,e[2].dims.length),I=F("sin_cache",e[3].dataType,e[3].dims.length),S=ae("output",e[0].dataType,e[0].dims.length);return v.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:m.length},{name:"global_strides",type:"u32",length:g.length},{name:"input_output_strides",type:"u32",length:g.length}]),`
        ${v.declareVariables($,b,k,I,S)}

        ${v.mainStart(pr)}
          let half_rotary_emb_dim = uniforms.${k.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${v.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${b.broadcastedIndicesToOffset("bsnh.xy",ae("",b.type.tensor,2))};
            let position_id =
                u32(${b.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${r});
            let j = i + select(half_rotary_emb_dim, 1, ${r});
            let re = ${$.getByOffset("i")} * ${k.get("position_id","bsnh[3]")} -
                ${$.getByOffset("j")} * ${I.get("position_id","bsnh[3]")};
            ${S.setByOffset("i","re")}
            let im = ${$.getByOffset("i")} * ${I.get("position_id","bsnh[3]")} +
                ${$.getByOffset("j")} * ${k.get("position_id","bsnh[3]")};
            ${S.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${S.setByOffset("k",$.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:Te({interleaved:r}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:_,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(U.size(m)/pr)},programUniforms:f})}},xf=(e,t)=>{hd(e.inputs,t),e.compute(_i(e.inputs,t))}}),fd,md,Mn,gd,kf,Ay=X(()=>{"use strict";Be(),le(),Ba(),wf(),$f(),Ot(),vf(),he(),fd=(e,t)=>{if(t.doRotary&&e.length<=7)throw new Error("cos_cache and sin_cache inputs are required if do_rotary is specified");let r=e[0],i=e[1],n=e[2],a=e[3],s=e[4];if(t.doRotary!==0&&e.length<=7)throw new Error("cos_cast and sin_cache are expected if do_rotary attribute is non-zero");if(t.localWindowSize!==-1)throw new Error("Local attention is not supported");if(t.softcap!==0)throw new Error("Softcap is not supported");if(t.rotaryInterleaved!==0)throw new Error("Rotary interleaved is not supported");if(t.smoothSoftmax)throw new Error("Smooth softmax is not supported");if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let o=!1,u=r.dims[0],l=r.dims[1],c=r.dims.length===3?o?r.dims[2]/3:r.dims[2]:t.numHeads*r.dims[4],p=l,m=0,g=!i||i.dims.length===0,f=Math.floor(g?c/(t.numHeads+2*t.kvNumHeads):c/t.numHeads);g&&(c=f*t.numHeads);let _=a&&a.dims.length!==0,v=s&&s.dims.length!==0;if(_&&a.dims.length===4&&a.dims[0]===u&&a.dims[1]!==t.kvNumHeads&&a.dims[2]===t.kvNumHeads&&a.dims[3]===f)throw new Error("BSNH pastKey/pastValue is not supported");if(_&&v){if(a.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(s.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');m=a.dims[2]}else if(_||v)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let $=1;if(i&&i.dims.length>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(r.dims[2]%i.dims[2]!==0)throw new Error('Dimension 2 of "query" should be a multiple of "key"');p=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==f)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(n)throw new Error('Expect "value" be none when "key" has packed kv format.');p=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==f)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');p=i.dims[2]}}else{if(r.dims.length!==3&&r.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(r.dims.length===5&&(r.dims[2]!==t.numHeads||r.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');$=3}let b=0,k=!1,I=t.kvNumHeads?f*t.kvNumHeads:c;if(n&&n.dims.length>0){if(n.dims.length!==3&&n.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==n.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(n.dims.length===3){if(p!==n.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');I=n.dims[2]}else{if(p!==n.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');I=n.dims[1]*n.dims[3],k=!0}}let S=e.length>4?e[5]:void 0;if(S){if(S.dims.length===0)throw new Error("seqlens_k must be at least 1D, got scalar.");let E=S.dims.reduce((C,x)=>C*x,1);if(E!==u)throw new Error(`seqlens_k must have batch_size (${u}) elements, got ${E}.`);for(let C=0;C<S.dims.length;C++)if(S.dims[C]!==1&&S.dims[C]!==u)throw new Error(`seqlens_k has unexpected shape. Each dimension must be 1 or batch_size (${u}), got dims[${C}] = ${S.dims[C]}.`)}return{batchSize:u,sequenceLength:l,pastSequenceLength:m,kvSequenceLength:p,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:c,vHiddenSize:I,headSize:f,vHeadSize:Math.floor(I/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:b,scale:t.scale,broadcastResPosBias:!1,passPastInKv:k,qkvFormat:$}},md=Te({perm:[0,2,1,3]}),Mn=(e,t,r)=>{let i=t,n=r.kvNumHeads;return t.dims.length===3&&r.kvSequenceLength!==0&&(i=t.reshape([r.batchSize,r.kvSequenceLength,n,r.headSize]),i=e.compute(Je(i,md.perm),{inputs:[i],outputs:[-1]})[0]),i},gd=(e,t,r,i)=>{let n=7,a=["type","type"],s=[e*t],o=e*t,u=[{type:12,data:o},{type:12,data:t},{type:12,data:e}],l=c=>{let p=F("seq_lens",r.dataType,r.dims),m=F("total_seq_lens",i.dataType,i.dims),g=ae("pos_ids",n,s),f=[{name:"output_size",type:"u32"},{name:"sequence_length",type:"u32"},{name:"batch_size",type:"u32"}];return`
  ${c.registerUniforms(f).declareVariables(p,m,g)}
  ${c.mainStart()}
    ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let total_sequence_length = u32(${m.getByOffset("0")});
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
  `};return{name:"GeneratePositionIds",shaderCache:{hint:`${e};${t}`,inputDependencies:a},getRunData:()=>({outputs:[{dims:s,dataType:n}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:u}),getShaderSource:l}},kf=(e,t)=>{if(e.inputs.length>14&&e.inputs[14]||e.inputs.length>15&&e.inputs[15])throw new Error("GroupQueryAttention (JSEP): q_norm_weight / k_norm_weight inputs are not supported. The per-head Q/K RMS normalization prologue is implemented only on the CUDA and native WebGPU EPs.");let r=fd(e.inputs,t);if(e.inputs[0].dims.length===5)throw new Error("Packed QKV is not implemented");if(e.inputs[1]?.dims.length===5)throw new Error("Packed KV is not implemented");let i=e.inputs[0],n=e.inputs[1]&&e.inputs[1].dims.length>0?e.inputs[1]:void 0,a=e.inputs[2]&&e.inputs[2].dims.length>0?e.inputs[2]:void 0,s=e.inputs[3]&&e.inputs[3].dims.length!==0?e.inputs[3]:void 0,o=e.inputs[4]&&e.inputs[4].dims.length!==0?e.inputs[4]:void 0,u=e.inputs.length>4?e.inputs[5]:void 0,l=e.inputs.length>5?e.inputs[6]:void 0,c=r.kvNumHeads?r.kvNumHeads:r.numHeads,p=Te({axis:2,numOutputs:3,splitSizes:[r.numHeads*r.headSize,c*r.headSize,c*r.headSize]}),[m,g,f]=!n&&!a?e.compute(pa([i],p),{inputs:[i],outputs:[-1,-1,-1]}):[i,n,a],_,v;if(t.doRotary){let I=e.compute(gd(r.batchSize,r.sequenceLength,u,l),{inputs:[u,l],outputs:[-1]})[0],S=e.inputs[7],E=e.inputs[8],C=Te({interleaved:t.rotaryInterleaved!==0,numHeads:r.numHeads,rotaryEmbeddingDim:0,scale:t.scale}),x=[m,I,S,E],O=[-1];_=e.compute(_i(x,C),{inputs:x,outputs:O})[0],x.splice(0,1,g);let N=Te({interleaved:t.rotaryInterleaved!==0,numHeads:r.kvNumHeads,rotaryEmbeddingDim:0,scale:t.scale});v=e.compute(_i(x,N),{inputs:x,outputs:O})[0]}let $=Mr(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,t.doRotary?_:m,void 0,0),b=Mn(e,t.doRotary?v:g,r),k=Mn(e,f,r);Dr(e,$,b,k,void 0,void 0,s,o,void 0,r,u,l)}}),An,yd,wd,Sf,Oy=X(()=>{"use strict";le(),pe(),Ot(),he(),An=(e,t,r,i,n,a,s,o)=>{let u=Oe(a),l=u===1?"f32":`vec${u}f`,c=u===1?"vec2f":`mat2x${u}f`,p=n*s,m=64;p===1&&(m=256);let g=[n,s,a/u],f=[n,s,2],_=["rank","type","type"],v=[];v.push(...oe(g,f));let $=b=>{let k=F("x",t.dataType,3,u),I=F("scale",r.dataType,r.dims),S=F("bias",i.dataType,i.dims),E=ae("output",1,3,2),C=[k,I,S,E];return`
  var<workgroup> workgroup_shared : array<${c}, ${m}>;
  const workgroup_size = ${m}u;
  ${b.declareVariables(...C)}
  ${b.mainStart(m)}
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
      let sum_final = ${At("workgroup_shared[0][0]",u)} / f32(hight * ${u});
      let squared_sum_final = ${At("workgroup_shared[0][1]",u)} / f32(hight * ${u});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${o}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`};return e.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${u};${o};${m}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:f,dataType:1}],dispatchGroup:{x:p},programUniforms:v}),getShaderSource:$},{inputs:[t,r,i],outputs:[-1]})[0]},yd=(e,t,r)=>{let i=t[0].dims,n=i,a=2,s=i[0],o=i[1],u=U.sizeFromDimension(i,a),l=Oe(u),c=U.size(n)/l,p=An(e,t[0],t[1],t[2],s,u,o,r.epsilon),m=[s,o,u/l],g=[s,o],f=["type","none"],_=v=>{let $=F("x",t[0].dataType,m.length,l),b=F("scale_shift",1,g.length,2),k=ae("output",t[0].dataType,m.length,l),I=[$,b,k];return`
  ${v.registerUniform("output_size","u32").declareVariables(...I)}
  ${v.mainStart()}
  ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${k.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${b.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${$.getByOffset("global_idx")} * ${k.type.value}(scale_shift.x) + ${k.type.value}(scale_shift.y);
      ${k.setByOffset("global_idx","value")};
  }`};e.compute({name:"InstanceNormalization",shaderCache:{hint:`${l}`,inputDependencies:f},getRunData:()=>({outputs:[{dims:n,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:[{type:12,data:c},...oe(m,g,m)]}),getShaderSource:_},{inputs:[t[0],p]})},wd=(e,t,r)=>{let i=t[0].dims,n=i,a=i[0],s=i[i.length-1],o=U.sizeFromDimension(i,1)/s,u=Oe(s),l=U.size(n)/u,c=[{type:12,data:o},{type:12,data:Math.floor(s/u)}],p=["type","type"],m=!1,g=[0,i.length-1];for(let $=0;$<i.length-2;$++)m=m||i[$+1]!==1,g.push($+1);m=m&&i[i.length-1]!==1;let f=m?e.compute(Je(e.inputs[0],g),{inputs:[e.inputs[0]],outputs:[-1]})[0]:e.inputs[0].reshape(Array.from({length:i.length},($,b)=>i[g[b]])),_=An(e,f,t[1],t[2],a,o,s,r.epsilon),v=$=>{let b=We(t[0].dataType),k=u===1?"vec2f":`mat${u}x2f`,I=C=>{let x=C===0?"x":"y",O=u===1?"f32":`vec${u}f`;switch(u){case 1:return`${b}(${O}(scale.${x}))`;case 2:return`vec2<${b}>(${O}(scale[0].${x}, scale[1].${x}))`;case 4:return`vec4<${b}>(${O}(scale[0].${x}, scale[1].${x}, scale[2].${x}, scale[3].${x}))`;default:throw new Error(`Not supported compoents ${u}`)}},S=F("input",t[0].dataType,t[0].dims,u),E=ae("output",t[0].dataType,n,u);return`
  @group(0) @binding(0) var<storage, read> input : array<${S.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${k}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${E.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${$.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${I(0)}, ${I(1)});
  }`};e.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${u}`,inputDependencies:p},getRunData:()=>({outputs:[{dims:n,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:c}),getShaderSource:v},{inputs:[t[0],_]})},Sf=(e,t)=>{t.format==="NHWC"?wd(e,e.inputs,t):yd(e,e.inputs,t)}}),_d,bd,If,By=X(()=>{"use strict";le(),pe(),he(),_d=e=>{if(!e||e.length<2)throw new Error("layerNorm requires at least 2 inputs.")},bd=(e,t,r)=>{let i=t.simplified,n=e[0].dims,a=e[1],s=!i&&e[2],o=n,u=U.normalizeAxis(t.axis,n.length),l=U.sizeToDimension(n,u),c=U.sizeFromDimension(n,u),p=U.size(a.dims),m=s?U.size(s.dims):0;if(p!==c||s&&m!==c)throw new Error(`Size of X.shape()[axis:] == ${c}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${p} and bias size of ${m}`);let g=[];for(let S=0;S<n.length;++S)S<u?g.push(n[S]):g.push(1);let f=Oe(c),_=["type","type"],v=[{type:12,data:l},{type:1,data:c},{type:12,data:Math.floor(c/f)},{type:1,data:t.epsilon}];s&&_.push("type");let $=r>1,b=r>2,k=S=>{let E=We(e[0].dataType),C=[F("x",e[0].dataType,e[0].dims,f),F("scale",a.dataType,a.dims,f)];s&&C.push(F("bias",s.dataType,s.dims,f)),C.push(ae("output",e[0].dataType,o,f)),$&&C.push(ae("mean_data_output",1,g)),b&&C.push(ae("inv_std_output",1,g));let x=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${S.registerUniforms(x).declareVariables(...C)}
  ${S.mainStart()}
    ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${ia("f32",f)};
    var mean_square_vector = ${ia("f32",f)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${sr(E,f,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${At("mean_vector",f)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${At("mean_square_vector",f)} / uniforms.norm_size ${i?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${sr(E,f,"x[j + offset]")};
      let f32scale = ${sr(E,f,"scale[j]")};
      output[j + offset] = ${C[0].type.value}((f32input ${i?"":"- mean"}) * inv_std_dev * f32scale
        ${s?`+ ${sr(E,f,"bias[j]")}`:""}
      );
    }

    ${$?"mean_data_output[global_idx] = mean":""};
    ${b?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},I=[{dims:o,dataType:e[0].dataType}];return $&&I.push({dims:g,dataType:1}),b&&I.push({dims:g,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${f};${r};${i}`,inputDependencies:_},getRunData:()=>({outputs:I,dispatchGroup:{x:Math.ceil(l/64)},programUniforms:v}),getShaderSource:k}},If=(e,t)=>{_d(e.inputs),e.compute(bd(e.inputs,t,e.outputCount))}}),$d,Tf,Ry=X(()=>{"use strict";pe(),Pa(),La(),$d=e=>{if(!e||e.length!==2)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.")},Tf=e=>{$d(e.inputs);let t=cr.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw new Error("Can't use matmul on the given tensors");let r=t[t.length-1],i=e.inputs[0].dims[e.inputs[0].dims.length-1];if(r<8&&i<8)e.compute(Ua(e.inputs,{activation:""},t));else{let n=t[t.length-2],a=U.size(e.inputs[0].dims.slice(0,-2)),s=U.size(e.inputs[1].dims.slice(0,-2));if(a!==1&&n===1&&s===1){let o=e.inputs[0].reshape([1,a,i]),u=e.inputs[1].reshape([1,i,r]),l=[1,a,r],c=[o,u];e.compute(wi(c,{activation:""},t,l),{inputs:c})}else e.compute(wi(e.inputs,{activation:""},t))}}}),xd,vd,kd,Cf,Ef,Dy=X(()=>{"use strict";le(),pe(),Be(),he(),xd=(e,t)=>{if(e.length<3||e.length>4)throw new Error("MatMulNBits requires 3 or 4 inputs");let r=e[0],i=r.dims.length;if(r.dims[i-1]!==t.k)throw new Error("The last dim of input shape does not match the k value");let n=Math.floor((t.k+t.blockSize-1)/t.blockSize),a=t.blockSize/8*t.bits,s=e[1];if(!U.areEqual(s.dims,[t.n,n,a]))throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let o=e[2].dims;if(U.size(o)!==t.n*n)throw new Error("scales input size error.");if(e.length===4){let u=e[3].dims,l=t.n*(t.bits===8?n:Math.floor((n*t.bits+7)/8));if(U.size(u)!==l)throw new Error("zeroPoints input size error.")}},vd=(e,t)=>{let r=e[0].dims,i=r.length,n=r[i-2],a=t.k,s=t.n,o=r.slice(0,i-2),u=U.size(o),l=e[1].dims[2]/4,c=e[0].dataType,p=Oe(t.k),m=Oe(l),g=Oe(s),f=o.concat([n,s]),_=n>1&&s/g%2===0?2:1,v=U.size(f)/g/_,$=64,b=[],k=[u,n,a/p],I=U.convertShape(e[1].dims).slice();I.splice(-1,1,l/m),b.push(...oe(k)),b.push(...oe(I)),b.push(...oe(e[2].dims)),e.length===4&&b.push(...oe(U.convertShape(e[3].dims)));let S=[u,n,s/g];b.push(...oe(S));let E=C=>{let x=k.length,O=F("a",e[0].dataType,x,p),N=F("b",12,I.length,m),R=F("scales",e[2].dataType,e[2].dims.length),P=[O,N,R],G=e.length===4?F("zero_points",12,e[3].dims.length):void 0;G&&P.push(G);let M=S.length,V=ae("output",e[0].dataType,M,g),K=We(e[0].dataType),L=(()=>{switch(p){case 1:return`array<${K}, 8>`;case 2:return`mat4x2<${K}>`;case 4:return`mat2x4<${K}>`;default:throw new Error(`${p}-component is not supported.`)}})(),ee=Math.floor(32/t.bits),J=Math.floor(ee/8),Z=()=>{let q="";for(let j=0;j<J;j++){let ue=j*t.bits*4,ge=ue+t.bits;q+=`
          // reuse a data (pass ${j})
            var input_offset${j>0?j:""} = ${j===0?O.indicesToOffset(`${O.type.indices}(batch, row, word_offset)`):"input_offset"};
            var a_data${j>0?j:""}: ${L};
            for (var j${j>0?j:""}: u32 = 0; j${j>0?j:""} < ${8/p}; j${j>0?j:""}++) {
              a_data${j>0?j:""}[j${j>0?j:""}] = ${O.getByOffset(`input_offset${j>0?j:""}`)};
              input_offset${j>0?j:""}++;
            }
          `;for(let Y=0;Y<g*_;Y++)q+=`
            b_value = ${m===1?`b${Y}_data`:`b${Y}_data[i]`};
            ${t.bits===2?`{
              let half_word = b_value >> ${j*16}u;
              let byte_lo = half_word & 0xFFu;
              let byte_hi = (half_word >> 8u) & 0xFFu;
              let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
              b_value_lower = unpack4xU8(spread_word & b_mask);
              b_value_upper = unpack4xU8((spread_word >> 2u) & b_mask);
            }`:`b_value_lower = unpack4xU8((b_value >> ${ue}u) & b_mask);
            b_value_upper = unpack4xU8((b_value >> ${ge}u) & b_mask);`}
            b_quantized_values = ${L}(${Array.from({length:4},(ie,ce)=>`${K}(b_value_lower[${ce}]), ${K}(b_value_upper[${ce}])`).join(", ")});
            b_dequantized_values = ${p===1?`${L}(${Array.from({length:8},(ie,ce)=>`(b_quantized_values[${ce}] - ${G?`zero_point${Y}`:"zero_point"}) * scale${Y}`).join(", ")});`:`(b_quantized_values - ${L}(${Array(8).fill(`${G?`zero_point${Y}`:"zero_point"}`).join(",")})) * scale${Y};`};
            workgroup_shared[local_id.x * ${_} + ${Math.floor(Y/g)}]${g>1?`[${Y%g}]`:""} += ${Array.from({length:8/p},(ie,ce)=>`${p===1?`a_data${j>0?j:""}[${ce}] * b_dequantized_values[${ce}]`:`dot(a_data${j>0?j:""}[${ce}], b_dequantized_values[${ce}])`}`).join(" + ")};
          `}return q},A=()=>{let q=`
            var col_index = col * ${g};
            ${G?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (nBlocksPerCol + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is ${Math.pow(2,t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${K}(${Math.pow(2,t.bits-1).toFixed(1)});`}
            `;for(let j=0;j<g*_;j++)q+=`
            let scale${j} = ${R.getByOffset("col_index * nBlocksPerCol + block")};
            ${G?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            zero_point_word = ${G.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${j} = ${K}((zero_point_word) & ${t.bits===2?"0x3u":"0xFu"});`:""}
            col_index += 1;`;return q},W=()=>{let q=`col_index = col * ${g};`;for(let j=0;j<g*_;j++)q+=`
            let b${j}_data = ${N.getByIndices(`${N.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return q+=`
            var b_value: u32;
            let b_mask: u32 = ${t.bits===2?"0x03030303u":"0x0F0F0F0Fu"};
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${L};
            var b_dequantized_values: ${L};`,q};return`
        var<workgroup> workgroup_shared: array<${V.type.value}, ${_*$}>;
        ${C.declareVariables(...P,V)}
        ${C.mainStart([$,1,1])}
          let output_indices = ${V.offsetToIndices(`(global_idx / ${$}) * ${_}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${$}) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize/p};
            ${A()}
            for (var word: u32 = 0; word < ${l}; word += ${m}) {
              ${W()}
              for (var i: u32 = 0; i < ${m}; i++) {
                ${Z()}
                word_offset += ${ee/p};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${_}) {
            var output_value: ${V.type.value} = ${V.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${$}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${_};
            }
            ${V.setByIndices(`${V.type.indices}(batch, row, col + local_id.x)`,"output_value")};
          }
        }`};return{name:"MatMulNBits",shaderCache:{hint:`${t.blockSize};${t.bits};${p};${m};${g};${_};${$}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:f,dataType:c}],dispatchGroup:{x:v},programUniforms:b}),getShaderSource:E}},kd=(e,t)=>{let r=e[0].dims,i=r.length,n=r[i-2],a=t.k,s=t.n,o=r.slice(0,i-2),u=U.size(o),l=e[1].dims[2]/4,c=e[0].dataType,p=Oe(t.k),m=Oe(l),g=o.concat([n,s]),f=128,_=s%8===0?8:s%4===0?4:1,v=f/_,$=Math.floor(32/t.bits),b=v*m*$,k=b/p,I=b/t.blockSize,S=U.size(g)/_,E=[],C=[u,n,a/p],x=U.convertShape(e[1].dims).slice();x.splice(-1,1,l/m),E.push(...oe(C)),E.push(...oe(x)),E.push(...oe(e[2].dims)),e.length===4&&E.push(...oe(U.convertShape(e[3].dims)));let O=[u,n,s];E.push(...oe(O));let N=R=>{let P=C.length,G=F("a",e[0].dataType,P,p),M=F("b",12,x.length,m),V=F("scales",e[2].dataType,e[2].dims.length),K=[G,M,V],L=e.length===4?F("zero_points",12,e[3].dims.length):void 0;L&&K.push(L);let ee=O.length,J=ae("output",e[0].dataType,ee),Z=We(e[0].dataType),A=()=>{switch(p){case 1:return`
          let a_data0 = vec4<${Z}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${Z}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${Z}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${Z}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw new Error(`${p}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${G.type.value}, ${k}>;
        var<workgroup> inter_results: array<array<${J.type.value}, ${v}>, ${_}>;
        ${R.declareVariables(...K,J)}
        ${R.mainStart([v,_,1])}
          let output_indices = ${J.offsetToIndices(`workgroup_index * ${_}`)};
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
                sub_a[a_offset] = ${G.getByIndices(`${G.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${G.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${I} + local_id.x;
            ${L?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (n_blocks_per_col + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            let zero_point_word = ${L.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${Z}((zero_point_word) & ${t.bits===2?"0x3u":"0xFu"});`:`
            // The default zero point is ${Math.pow(2,t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${Z}(${Math.pow(2,t.bits-1).toFixed(1)});`}
            let scale = ${V.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${M.getByIndices(`${M.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize/p};
            for (var i: u32 = 0; i < ${m}; i++) {
              let b_value = ${m===1?"b_data":"b_data[i]"};
              ${(()=>{let W=Math.floor($/8),q="";for(let j=0;j<W;j++){let ue=j*t.bits*4,ge=ue+t.bits;q+=`
              ${A()}
              {${t.bits===2?`
                let half_word = b_value >> ${j*16}u;
                let byte_lo = half_word & 0xFFu;
                let byte_hi = (half_word >> 8u) & 0xFFu;
                let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
                let b_value_lower = unpack4xU8(spread_word & 0x03030303u);
                let b_value_upper = unpack4xU8((spread_word >> 2u) & 0x03030303u);`:`
                let b_value_lower = unpack4xU8((b_value >> ${ue}u) & 0x0F0F0F0Fu);
                let b_value_upper = unpack4xU8((b_value >> ${ge}u) & 0x0F0F0F0Fu);`}
                let b_quantized_values = mat2x4<${Z}>(${Array.from({length:4},(Y,ie)=>`${Z}(b_value_lower[${ie}]), ${Z}(b_value_upper[${ie}])`).join(", ")});
                let b_dequantized_values = (b_quantized_values - mat2x4<${Z}>(${Array(8).fill("zero_point").join(",")})) * scale;
                inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(Y,ie)=>`${`dot(a_data${ie}, b_dequantized_values[${ie}])`}`).join(" + ")};
              }
              word_offset += ${8/p};`}return q})()}
            }
            workgroupBarrier();
          }

          if (local_idx < ${_}) {
            var output_value: ${J.type.value} = ${J.type.value}(0);
            for (var b = 0u; b < ${v}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${J.setByIndices(`${J.type.indices}(batch, row, col + local_idx)`,"output_value")}
            }
          }
        }`};return{name:"BlockwiseMatMulNBits32",shaderCache:{hint:`${t.blockSize};${p};${m};${v};${_}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:g,dataType:c}],dispatchGroup:{x:S},programUniforms:E}),getShaderSource:N}},Cf=(e,t)=>{xd(e.inputs,t),t.blockSize===32&&e.adapterInfo.isVendor("intel")&&e.adapterInfo.isArchitecture("gen-12lp")?e.compute(kd(e.inputs,t)):e.compute(vd(e.inputs,t))},Ef=e=>Te(e)}),Sd,Id,Td,Cd,Ed,zd,Md,Ad,zf,Ny=X(()=>{"use strict";le(),pe(),he(),Sd=e=>{if(!e||e.length<1)throw new Error("Too few inputs");if(e[0].dataType!==1&&e[0].dataType!==10)throw new Error("Input type must be float or float16.");if(e.length>=2){let t=e[0].dims.length*2===e[1].dims[0];if(e.length===4&&(t=e[3].dims[0]*2===e[1].dims[0]),!t)throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},Id=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
            k = i32(${e.indicesGet("indices",n)}) - ${se("uniforms.pads",n,r)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${se("uniforms.x_shape",n,t)})) {
              break;
            }
            offset += k * i32(${se("uniforms.x_strides",n,t)});
        `;return`
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${i}
            value = x[offset];
          }
      `},Td=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
                k = i32(${e.indicesGet("indices",n)}) - ${se("uniforms.pads",n,r)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${se("uniforms.x_shape",n,t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${se("uniforms.x_shape",n,t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${se("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},Cd=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
                k = i32(${e.indicesGet("indices",n)}) - ${se("uniforms.pads",n,r)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${se("uniforms.x_shape",n,t)})) {
                  k = i32(${se("uniforms.x_shape",n,t)}) - 1;
                }
                offset += k * i32(${se("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},Ed=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
                k = i32(${e.indicesGet("indices",n)}) - ${se("uniforms.pads",n,r)};
                if (k < 0)  {
                  k += i32(${se("uniforms.x_shape",n,t)}]);
                }
                if (k >= i32(${se("uniforms.x_shape",n,t)})) {
                  k -= i32(${se("uniforms.x_shape",n,t)});
                }
                offset += k * i32(${se("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},zd=(e,t,r)=>{switch(r.mode){case 0:return Id(e,t,r.pads.length);case 1:return Td(e,t,r.pads.length);case 2:return Cd(e,t,r.pads.length);case 3:return Ed(e,t,r.pads.length);default:throw new Error("Invalid mode")}},Md=(e,t)=>{let r=U.padShape(e[0].dims.slice(),t.pads),i=e[0].dims,n=U.size(r),a=[{type:12,data:n},{type:6,data:t.pads}],s=e.length>=3&&e[2].data;t.mode===0&&a.push({type:s?e[2].dataType:1,data:t.value}),a.push(...oe(e[0].dims,r));let o=["rank"],u=l=>{let c=ae("output",e[0].dataType,r.length),p=F("x",e[0].dataType,i.length),m=p.type.value,g=zd(c,i.length,t),f=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:t.pads.length}];return t.mode===0&&f.push({name:"constant_value",type:s?m:"f32"}),`
            ${l.registerUniforms(f).declareVariables(p,c)}
            ${l.mainStart()}
            ${l.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${c.offsetToIndices("global_idx")};

            var value = ${m}(0);
            ${g}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${t.mode}${s}`,inputDependencies:o},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(U.size(r)/64)},programUniforms:a}),getShaderSource:u}},Ad=(e,t)=>{if(e.length>1){let r=e[1].getBigInt64Array(),i=e.length>=3&&e[2].data?e[2].dataType===10?e[2].getUint16Array()[0]:e[2].getFloat32Array()[0]:0,n=e[0].dims.length,a=new Int32Array(2*n).fill(0);if(e.length>=4){let o=e[3].getBigInt64Array();for(let u=0;u<o.length;u++)a[Number(o[u])]=Number(r[u]),a[Number(o[u])+n]=Number(r[u+o.length])}else r.forEach((o,u)=>a[Number(u)]=Number(o));let s=[];return a.forEach(o=>s.push(o)),{mode:t.mode,value:i,pads:s}}else return t},zf=(e,t)=>{Sd(e.inputs);let r=Ad(e.inputs,t);e.compute(Md(e.inputs,r),{inputs:[0]})}}),vr,On,Bn,Rn,Dn,Od,Bd,Nn,Un,Mf,Af,Pn,Of,Bf,Ln,Rf,Df,Nf,Uf,Uy=X(()=>{"use strict";et(),le(),pe(),he(),vr=e=>{if(Ce.webgpu.validateInputContent&&(!e||e.length!==1))throw new Error("Pool ops requires 1 input.")},On=(e,t,r)=>{let i=t.format==="NHWC",n=e.dims.slice();i&&n.splice(1,0,n.pop());let a=Object.hasOwnProperty.call(t,"dilations"),s=t.kernelShape.slice(),o=t.strides.slice(),u=a?t.dilations.slice():[],l=t.pads.slice();gi.adjustPoolAttributes(r,n,s,o,u,l);let c=gi.computePoolOutputShape(r,n,o,u,s,l,t.autoPad,t.ceilMode),p=Object.assign({},t);a?Object.assign(p,{kernelShape:s,strides:o,pads:l,dilations:u,cacheKey:t.cacheKey}):Object.assign(p,{kernelShape:s,strides:o,pads:l,cacheKey:t.cacheKey});let m=c.slice();return m.push(m.splice(1,1)[0]),[p,i?m:c]},Bn=(e,t)=>{let r=t.format==="NHWC",i=U.size(e),n=U.size(t.kernelShape),a=[{type:12,data:i},{type:12,data:n}],s=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(t.kernelShape.length<=2){let o=t.kernelShape[t.kernelShape.length-1],u=t.strides[t.strides.length-1],l=t.pads[t.pads.length/2-1],c=t.pads[t.pads.length-1],p=!!(l+c);a.push({type:12,data:o},{type:12,data:u},{type:12,data:l},{type:12,data:c}),s.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let m=!1;if(t.kernelShape.length===2){let g=t.kernelShape[t.kernelShape.length-2],f=t.strides[t.strides.length-2],_=t.pads[t.pads.length/2-2],v=t.pads[t.pads.length-2];m=!!(_+v),a.push({type:12,data:g},{type:12,data:f},{type:12,data:_},{type:12,data:v}),s.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[a,s,!0,p,m]}else{if(r)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let o=U.computeStrides(t.kernelShape);a.push({type:12,data:o},{type:12,data:t.pads},{type:12,data:t.strides}),s.push({name:"kernelStrides",type:"u32",length:o.length},{name:"pads",type:"u32",length:t.pads.length},{name:"strides",type:"u32",length:t.strides.length});let u=t.pads.reduce((l,c)=>l+c);return[a,s,!!u,!1,!1]}},Rn=(e,t,r,i,n,a,s,o,u,l,c,p)=>{let m=n.format==="NHWC",g=t.type.value,f=ae("output",t.type.tensor,i);if(n.kernelShape.length<=2){let _="",v="",$="",b=r-(m?2:1);if(c?_=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${b}] = indices[${b}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${b}] < 0 || xIndices[${b}]
                      >= uniforms.x_shape[${b}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${a}
                }`:_=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${b}] = indices[${b}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${a}
                }`,n.kernelShape.length===2){let k=r-(m?3:2);p?v=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${k}] = indices[${k}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${k}] < 0 || xIndices[${k}] >= uniforms.x_shape[${k}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:v=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${k}] = indices[${k}] * uniforms.sh - uniforms.phStart + j;
                `,$=`
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
              ${_}
              ${$}
              ${s}

              output[global_idx] = value;
            }`}else{if(m)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let _=n.kernelShape.length,v=n.pads.length,$="";return l?$=`
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
            ${e.registerUniforms(u).declareVariables(t,f)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${f.offsetToIndices("global_idx")};
              var xIndices = ${f.offsetToIndices("global_idx")};

              var offsets: array<u32, ${_}>;

              var value = ${g}(${o});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${_-1}u; j++) {
                  offsets[j] = offset / ${se("uniforms.kernelStrides","j",_)};
                  offset -= offsets[j] * ${se("uniforms.kernelStrides","j",_)};
                }
                offsets[${_-1}] = offset;

                isPad = false;
                for (var j = ${r-_}u; j < ${r}u; j++) {
                  xIndices[j] = indices[j] * ${se("uniforms.strides",`j - ${r-_}u`,_)}
                    + offsets[j - ${r-_}u] - ${se("uniforms.pads","j - 2u",v)};
                  ${$}
              }
              ${s}

              output[global_idx] = value;
            }`}},Dn=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,Od=e=>`${Dn(e)};${e.countIncludePad}`,Bd=e=>`${Dn(e)};${e.storageOrder};${e.dilations}`,Nn=e=>({format:e.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),Un=(e,t,r,i)=>{let[n,a]=On(t,i,r),s=F("x",t.dataType,t.dims.length),o=s.type.value,u="value += x_val;",l="";n.countIncludePad?l+=`value /= ${o}(uniforms.kernelSize);`:l+=`value /= ${o}(i32(uniforms.kernelSize) - pad);`;let[c,p,m,g,f]=Bn(a,n);c.push(...oe(t.dims,a));let _=["rank"];return{name:e,shaderCache:{hint:`${i.cacheKey};${m};${g};${f}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:a,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(U.size(a)/64)},programUniforms:c}),getShaderSource:v=>Rn(v,s,t.dims.length,a.length,n,u,l,0,p,m,g,f)}},Mf=e=>{let t=e.count_include_pad!==0,r=Nn(e);if(r.ceilMode!==0)throw new Error("ceil_mode output-shape is computed, but ceil_mode kernel execution (padding/divisor) is not yet implemented in the WebGPU AveragePool kernel");let i={countIncludePad:t,...r,cacheKey:""};return{...i,cacheKey:Od(i)}},Af=(e,t)=>{vr(e.inputs),e.compute(Un("AveragePool",e.inputs[0],!1,t))},Pn={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},Of=e=>{let t=e.format;return{format:t,...Pn,cacheKey:t}},Bf=(e,t)=>{vr(e.inputs),e.compute(Un("GlobalAveragePool",e.inputs[0],!0,t))},Ln=(e,t,r,i)=>{let[n,a]=On(t,i,r),s=`
      value = max(x_val, value);
    `,o="",u=F("x",t.dataType,t.dims.length),l=["rank"],[c,p,m,g,f]=Bn(a,n);return c.push(...oe(t.dims,a)),{name:e,shaderCache:{hint:`${i.cacheKey};${m};${g};${f}`,inputDependencies:l},getRunData:()=>({outputs:[{dims:a,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(U.size(a)/64)},programUniforms:c}),getShaderSource:_=>Rn(_,u,t.dims.length,a.length,n,s,o,t.dataType===10?-65504:-1e5,p,m,g,f)}},Rf=(e,t)=>{vr(e.inputs),e.compute(Ln("MaxPool",e.inputs[0],!1,t))},Df=e=>{let t=e.storage_order,r=e.dilations,i=Nn(e);if(t!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(i.ceilMode!==0)throw new Error("ceil_mode output-shape is computed, but ceil_mode kernel execution (padding) is not yet implemented in the WebGPU MaxPool kernel");let n={storageOrder:t,dilations:r,...i,cacheKey:""};return{...n,cacheKey:Bd(n)}},Nf=e=>{let t=e.format;return{format:t,...Pn,cacheKey:t}},Uf=(e,t)=>{vr(e.inputs),e.compute(Ln("GlobalMaxPool",e.inputs[0],!0,t))}}),Rd,Dd,Pf,Lf,Py=X(()=>{"use strict";le(),pe(),Be(),he(),Rd=(e,t)=>{if(e.length<2||e.length>3)throw new Error("DequantizeLinear requires 2 or 3 inputs.");if(e.length===3&&e[1].dims===e[2].dims)throw new Error("x-scale and x-zero-point must have the same shape.");if(e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==0&&e[1].dims.length!==1&&e[1].dims.length!==e[0].dims.length)throw new Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");if(e.length>2){if(e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==e[2].dims.length)throw new Error("scale and zero-point inputs must have the same rank.");if(!e[1].dims.map((r,i)=>r===e[2].dims[i]).reduce((r,i)=>r&&i,!0))throw new Error("scale and zero-point inputs must have the same shape.")}if(t.blockSize>0){if(e[1].dims.length===0||e[1].dims.length===1&&e[1].dims[0]===1)throw new Error("blockSize must be set only for block quantization.");if(!e[1].dims.map((n,a)=>a===t.axis||n===e[0].dims[a]).reduce((n,a)=>n&&a,!0))throw new Error("For block qunatization, scale input shape to match the input shape except for the axis");if(e[1].dims.length!==e[0].dims.length)throw new Error("For block qunatization the scale input rank must be the same as the x rank.");let r=e[0].dims[t.axis],i=e[1].dims[t.axis];if(t.blockSize<Math.ceil(r/i)||t.blockSize>Math.ceil(r/(i-1)-1))throw new Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].")}},Dd=(e,t)=>{let r=U.normalizeAxis(t.axis,e[0].dims.length),i=e[0].dataType,n=i===3,a=e[0].dims,s=e[1].dataType,o=U.size(a),u=i===3||i===2,l=u?[Math.ceil(U.size(e[0].dims)/4)]:e[0].dims,c=e[1].dims,p=e.length>2?e[2]:void 0,m=p?u?[Math.ceil(U.size(p.dims)/4)]:p.dims:void 0,g=c.length===0||c.length===1&&c[0]===1,f=g===!1&&c.length===1,_=Oe(o),v=g&&(!u||_===4),$=v?_:1,b=v&&!u?_:1,k=F("input",u?12:i,l.length,b),I=F("scale",s,c.length),S=p?F("zero_point",u?12:i,m.length):void 0,E=ae("output",s,a.length,$),C=[k,I];S&&C.push(S);let x=[l,c];p&&x.push(m);let O=[{type:12,data:o/$},{type:12,data:r},{type:12,data:t.blockSize},...oe(...x,a)],N=R=>{let P=[{name:"output_size",type:"u32"},{name:"axis",type:"u32"},{name:"block_size",type:"u32"}];return`
      ${R.registerUniforms(P).declareVariables(...C,E)}
      ${R.mainStart()}
          ${R.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${E.offsetToIndices("global_idx")};

          // Set input x
          ${u?`
            let input = ${k.getByOffset("global_idx / 4")};
            let x_vec = ${n?"unpack4xI8(input)":"unpack4xU8(input)"};
            let x_value = ${$===1?"x_vec[global_idx % 4]":"x_vec"};`:`let x_value = ${k.getByOffset("global_idx")};`};

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
      }`};return{name:"DequantizeLinear",shaderCache:{hint:t.cacheKey,inputDependencies:S?["rank","rank","rank"]:["rank","rank"]},getShaderSource:N,getRunData:()=>({outputs:[{dims:a,dataType:s}],dispatchGroup:{x:Math.ceil(o/$/64),y:1,z:1},programUniforms:O})}},Pf=(e,t)=>{Rd(e.inputs,t),e.compute(Dd(e.inputs,t))},Lf=e=>Te({axis:e.axis,blockSize:e.blockSize})}),Nd,Ud,Wf,Ly=X(()=>{"use strict";et(),le(),he(),Nd=(e,t,r)=>{let i=e===t,n=e<t&&r<0,a=e>t&&r>0;if(i||n||a)throw new Error("Range these inputs' contents are invalid.")},Ud=(e,t,r,i)=>{let n=Math.abs(Math.ceil((t-e)/r)),a=[n],s=n,o=[{type:12,data:s},{type:i,data:e},{type:i,data:r},...oe(a)],u=l=>{let c=ae("output",i,a.length),p=c.type.value,m=[{name:"outputSize",type:"u32"},{name:"start",type:p},{name:"delta",type:p}];return`
        ${l.registerUniforms(m).declareVariables(c)}
        ${l.mainStart()}
        ${l.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${p}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${i}`},getShaderSource:u,getRunData:()=>({outputs:[{dims:a,dataType:i}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:o})}},Wf=e=>{let t=0,r=0,i=0;e.inputs[0].dataType===6?(t=e.inputs[0].getInt32Array()[0],r=e.inputs[1].getInt32Array()[0],i=e.inputs[2].getInt32Array()[0]):e.inputs[0].dataType===1&&(t=e.inputs[0].getFloat32Array()[0],r=e.inputs[1].getFloat32Array()[0],i=e.inputs[2].getFloat32Array()[0]),Ce.webgpu.validateInputContent&&Nd(t,r,i),e.compute(Ud(t,r,i,e.inputs[0].dataType),{inputs:[]})}}),Pd,Ld,qf,Gf,Wy=X(()=>{"use strict";le(),pe(),Be(),he(),Pd=(e,t,r,i)=>{if(e!=="none"&&i!=="i32"&&i!=="u32"&&i!=="f32")throw new Error(`Input ${i} is not supported with reduction ${e}.`);let n=`{
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
                ${n}max(bitcast<f32>(oldValue), (${r}))${a}`;case"min":return i==="i32"||i==="u32"?`atomicMin(&${t}, bitcast<${i}>(${r}));`:`${n}min(bitcast<${i}>(oldValue), (${r}))${a}`;case"mul":return`${n}(bitcast<${i}>(oldValue) * (${r}))${a}`;default:throw new Error(`Reduction ${e} is not supported.`)}},Ld=(e,t)=>{let r=e[0].dims,i=e[1].dims,n=r,a=1,s=Math.ceil(U.sizeToDimension(i,i.length-1)/a),o=i[i.length-1],u=U.sizeFromDimension(r,o),l=[{type:12,data:s},{type:12,data:o},{type:12,data:u},...oe(e[1].dims,e[2].dims,n)],c=p=>{let m=F("indices",e[1].dataType,e[1].dims.length),g=F("updates",e[2].dataType,e[2].dims.length,a),f=t.reduction!=="none"&&t.reduction!==""?hp("output",e[0].dataType,n.length):ae("output",e[0].dataType,n.length,a);return`
      ${p.registerUniform("output_size","u32").registerUniform("last_index_dimension","u32").registerUniform("num_updates_elements","u32").declareVariables(m,g,f)}
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
    ${Pd(t.reduction,"output[data_offset + i]","value",f.type.value)}
  }

      }`};return{name:"ScatterND",shaderCache:{hint:`${t.cacheKey}_${t.reduction}`,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:l}),getShaderSource:c}},qf=e=>Te({reduction:e.reduction}),Gf=(e,t)=>{e.compute(Ld(e.inputs,t),{inputs:[e.inputs[1],e.inputs[2]],outputs:[]})}}),Wd,qd,Gd,Wn,Vd,Hd,Fd,jd,Kd,Zd,Yd,Xd,qn,Qd,Jd,ec,tc,rc,Vf,Hf,qy=X(()=>{"use strict";le(),pe(),Be(),he(),Wd=(e,t)=>{if(e.every(r=>r>0||(()=>{throw new Error("Resize requires scales input values to be positive")})),e.length>0){if(t.mode==="linear"){if(!(e.length===2||e.length===3||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1||e.length===5&&e[0]===1&&e[1]===1))throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(t.mode==="cubic"&&!(e.length===2||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1))throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},qd=(e,t,r)=>{t.every(n=>n>=0&&n<r||(()=>{throw new Error("Resize requires axes input values to be positive and less than rank")}));let i=new Array(r).fill(1);return t.forEach((n,a)=>i[n]=e[a]),i},Gd=(e,t,r,i,n,a)=>{let[s,o,u]=r>10?[1,2,3]:[-1,e.length>1?1:-1,-1],l=e[0].dims.length;if(s>0&&e.length>s&&e[s].dims.length>0)e[s].getFloat32Array().forEach(c=>a.push(c));else if(t.coordinateTransformMode==="tf_crop_and_resize")throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(o>0&&e.length>o&&e[o].dims.length===1&&e[o].dims[0]>0){if(e[o].getFloat32Array().forEach(c=>i.push(c)),i.length!==0&&i.length!==l&&r>=18&&i.length!==t.axes.length)throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");Wd(i,t),t.axes.length>0&&qd(i,t.axes,l).forEach((c,p)=>i[p]=c)}if(u>0&&e.length>u&&e[u].dims.length===1&&e[u].dims[0]>0&&(e[u].getBigInt64Array().forEach(c=>n.push(Number(c))),n.length!==0&&n.length!==l&&r>=18&&n.length!==t.axes.length))throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(t.axes.length>0){if(i.length!==0&&i.length!==t.axes.length)throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(n.length!==0&&n.length!==t.axes.length)throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if(typeof i<"u"&&typeof n<"u"&&i.length>0&&n.length>l)throw new Error("Resize requires only of scales or sizes to be specified")},Wn=(e,t,r,i)=>`
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
            ${Wn("xResized","lengthOriginal","lengthResized",t)}
          }
        `;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${t}(xResized) + 0.5) / ${t}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${Wn("xResized","lengthOriginal - 1","lengthResized - 1",t)}
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
        var scale = ${se("uniforms.scales","i",i)};
        var roi_low = ${se("uniforms.roi","i",n)};
        var roi_hi = ${se("uniforms.roi",`i + ${t.length}`,n)};
        if (scale == 1.0) {
          original_indices[i] = ${e.type.value}(output_index);
        } else {
          var input_shape_i = ${se("uniforms.input_shape","i",t.length)};
          var output_shape_i = ${se("uniforms.output_shape","i",r.length)};
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
        var scale = ${se("uniforms.scales","i",n)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${se("uniforms.roi","i",a)};
          var roi_hi = ${se("uniforms.roi",`i + ${r.length}`,a)};
          var input_shape_i = ${se("uniforms.input_shape","i",r.length)};
          var output_shape_i = ${se("uniforms.output_shape","i",i.length)};
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
    }`,Xd=(e,t)=>`
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${se("uniforms.input_shape","i",t.length)}) {
          return false;
        }
      }
      return true;
    }`,qn=(e,t,r,i)=>e.rank>i?`
    ${e.indicesSet("input_indices",t,"channel")};
    ${e.indicesSet("input_indices",r,"batch")};
`:"",Qd=(e,t,r,i,n)=>{let[a,s,o,u]=r.length===2?[-1,0,1,-1]:[0,2,3,1],l=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${l} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(row, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",o,`max(0, min(col, ${r[o]} - 1))`)};
      ${qn(e,u,a,2)}
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
    }`},Jd=(e,t,r,i,n,a,s,o,u,l)=>{let c=r.length===2,p=!0,[m,g]=c?[0,1]:p?[2,3]:[1,2],f=e.type.value,_=v=>{let $=v===m?"row":"col";return`
      fn ${$}CubicInterpolation(input_indices: ${e.type.indices}, output_indices: ${t.type.indices}) -> ${f} {
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
          var ${$}: ${f} = originalIdx + ${f}(i);
          if (${$} < 0 || ${$} >= ${r[v]}) {
            ${l?`coefs[i + 1] = 0.0;
                        continue;`:o?`return ${u};`:`${$} = max(0, min(${$}, ${r[v]} - 1));`};
          }
        var input_indices_copy: ${e.type.indices} = input_indices;
          ${e.indicesSet("input_indices_copy",v,`u32(${$})`)};
          data[i + 1] = ${v===m?e.getByIndices("input_indices_copy"):"rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${_(m)};
    ${_(g)};
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
      ${qn(e,l,a,3)}
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
    }`},tc=(e,t,r,i,n,a)=>{let s=e.dims,o=Fd(a,t.axes,s.length),u=jd(s,i,n,t.axes),l=i.slice();i.length===0&&(l=s.map((b,k)=>b===0?1:u[k]/b),t.keepAspectRatioPolicy!=="stretch"&&(u=Kd(s,l,t)));let c=ae("output",e.dataType,u.length),p=F("input",e.dataType,s.length),m=U.size(u),g=s.length===u.length&&s.every((b,k)=>b===u[k]),f=t.coordinateTransformMode==="tf_crop_and_resize",_=t.extrapolationValue,v=p.type.value,$=b=>`
      ${g?"":`
      ${Vd(t.coordinateTransformMode,v)};
      ${(()=>{switch(t.mode){case"nearest":return`
              ${Xd(p,s)};
              ${Hd(t.nearestMode,r,v)};
              ${Yd(p,c,s,u,l.length,o.length,f)};
              `;case"linear":return`
              ${Zd(c,s,u,l.length,o.length)};
              ${(()=>{if(s.length===2||s.length===4)return`${Qd(p,c,s,f,_)}`;if(s.length===3||s.length===5)return`${ec(p,c,s,f,_)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(s.length===2||s.length===4)return`${Jd(p,c,s,u,l,o,t.cubicCoeffA,f,t.extrapolationValue,t.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
            `;default:throw Error("Invalid resize mode")}})()};
      `}
      ${b.registerUniform("output_size","u32").registerUniform("scales","f32",l.length).registerUniform("roi","f32",o.length).declareVariables(p,c)}
      ${b.mainStart()}
        ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${g?"output[global_idx] = input[global_idx];":`
        let output_indices = ${c.offsetToIndices("global_idx")};
        var input_indices: ${p.type.indices};
        ${(()=>{switch(t.mode){case"nearest":return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${p.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${t.extrapolationValue};
                }`;case"linear":return`output[global_idx] = ${s.length===2||s.length===4?"bilinearInterpolation":"trilinearInterpolation"}(output_indices);`;case"cubic":return"output[global_idx] = bicubicInterpolation(output_indices);";default:throw Error(`Unsupported resize mode: ${t.mode}`)}})()};
`}
      }`;return{name:"Resize",shaderCache:{hint:`${t.cacheKey}|${r}|${l.length>0?t.mode==="cubic"?l:l.length:""}|${n.length>0?n:""}|${o.length>0?o:""}|${g}|${t.mode==="nearest"?s.length:s}`,inputDependencies:["rank"]},getShaderSource:$,getRunData:()=>({outputs:[{dims:u,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:[{type:12,data:m},{type:1,data:l},{type:1,data:o},...oe(s,u)]})}},rc=e=>{let t=e.customDataBuffer;return new Uint32Array(t.buffer,t.byteOffset,1)[0]},Vf=(e,t)=>{let r=[],i=[],n=[],a=rc(e);if(t.antialias!==0)throw Error("Only default value (0) for Antialias attribute is supported");Gd(e.inputs,t,a,r,i,n),e.compute(tc(e.inputs[0],t,a,r,i,n),{inputs:[0]})},Hf=e=>{let t=e.antialias,r=e.axes,i=e.coordinateTransformMode,n=e.cubicCoeffA,a=e.excludeOutside!==0,s=e.extrapolationValue,o=e.keepAspectRatioPolicy,u=e.mode,l=e.nearestMode===""?"simple":e.nearestMode;return Te({antialias:t,axes:r,coordinateTransformMode:i,cubicCoeffA:n,excludeOutside:a,extrapolationValue:s,keepAspectRatioPolicy:o,mode:u,nearestMode:l})}}),ic,nc,Ff,Gy=X(()=>{"use strict";le(),pe(),he(),ic=e=>{if(!e||e.length<3)throw new Error("layerNorm requires at least 3 inputs.");let t=e[0],r=e[1],i=e[2];if(t.dataType!==r.dataType||t.dataType!==i.dataType)throw new Error("All inputs must have the same data type");if(t.dims.length!==3&&t.dims.length!==2)throw new Error("Input must be 2D or 3D");if(r.dims.length!==3&&r.dims.length!==2)throw new Error("Skip must be 2D or 3D");let n=t.dims[t.dims.length-1],a=t.dims[t.dims.length-2];if(r.dims[r.dims.length-1]!==n)throw new Error("Skip must have the same hidden size as input");if(r.dims[r.dims.length-2]!==a)throw new Error("Skip must have the same sequence length as input");if(i.dims.length!==1)throw new Error("Gamma must be 1D");if(i.dims[i.dims.length-1]!==n)throw new Error("Gamma must have the same hidden size as input");if(e.length>3){let s=e[3];if(s.dims.length!==1)throw new Error("Beta must be 1D");if(s.dims[s.dims.length-1]!==n)throw new Error("Beta must have the same hidden size as input")}if(e.length>4){let s=e[4];if(s.dims.length!==1)throw new Error("Bias must be 1D");if(s.dims[s.dims.length-1]!==n)throw new Error("Bias must have the same hidden size as input")}},nc=(e,t,r,i)=>{let n=t.simplified,a=e[0].dims,s=U.size(a),o=a,u=s,l=a.slice(-1)[0],c=i?a.slice(0,-1).concat(1):[],p=!n&&e.length>3,m=e.length>4,g=i&&r>1,f=i&&r>2,_=r>3,v=64,$=Oe(l),b=[{type:12,data:u},{type:12,data:$},{type:12,data:l},{type:1,data:t.epsilon}],k=S=>{let E=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],C=[F("x",e[0].dataType,e[0].dims,$),F("skip",e[1].dataType,e[1].dims,$),F("gamma",e[2].dataType,e[2].dims,$)];p&&C.push(F("beta",e[3].dataType,e[3].dims,$)),m&&C.push(F("bias",e[4].dataType,e[4].dims,$)),C.push(ae("output",e[0].dataType,o,$)),g&&C.push(ae("mean_output",1,c)),f&&C.push(ae("inv_std_output",1,c)),_&&C.push(ae("input_skip_bias_sum",e[0].dataType,o,$));let x=We(e[0].dataType),O=We(1,$);return`

      ${S.registerUniforms(E).declareVariables(...C)}
      var<workgroup> sum_shared : array<${O}, ${v}>;
      var<workgroup> sum_squared_shared : array<${O}, ${v}>;

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
          ${_?"input_skip_bias_sum[offset + i] = value;":""}
          output[offset + i] = value;
          let f32_value = ${sr(x,$,"value")};
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
        let mean = ${At("sum",$)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${At("square_sum",$)} / f32(uniforms.hidden_size) ${n?"":"- mean * mean"} + uniforms.epsilon);
        ${g?"mean_output[global_idx] = mean;":""}
        ${f?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${n?"":`- ${x}(mean)`}) *
            ${x}(inv_std_dev) * gamma[offset1d + i]
            ${p?"+ beta[offset1d + i]":""};
        }
      }`},I=[{dims:o,dataType:e[0].dataType}];return r>1&&I.push({dims:c,dataType:1}),r>2&&I.push({dims:c,dataType:1}),r>3&&I.push({dims:a,dataType:e[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${$};${g};${f};${_}`,inputDependencies:e.map((S,E)=>"type")},getShaderSource:k,getRunData:()=>({outputs:I,dispatchGroup:{x:Math.ceil(u/l)},programUniforms:b})}},Ff=(e,t)=>{ic(e.inputs);let r=[0];e.outputCount>1&&r.push(-3),e.outputCount>2&&r.push(-3),e.outputCount>3&&r.push(3),e.compute(nc(e.inputs,t,e.outputCount,!1),{outputs:r})}}),ac,kr,sc,Gn,oc,uc,jf,Kf,Vy=X(()=>{"use strict";le(),pe(),Be(),he(),ac=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");if(t.axes.length!==0){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw new Error("axes, starts and ends must have the same length")}else if(t.starts.length!==t.ends.length)throw new Error("starts and ends must have the same length");e.slice(1).forEach((r,i)=>{if(e[i+1].dataType!==6&&e[i+1].dataType!==7)throw new Error(`Input ${i} must be an array of int32 or int64`)})},kr=(e,t)=>{let r=[];if(e.length>t)if(e[t].dataType===7)e[t].getBigInt64Array().forEach(i=>r.push(Number(i)));else if(e[t].dataType===6)e[t].getInt32Array().forEach(i=>r.push(Number(i)));else throw new Error(`Input ${t} must be an array of int32 or int64`);return r},sc=(e,t)=>{if(e.length>1){let r=kr(e,1),i=kr(e,2),n=kr(e,3);return n.length===0&&(n=[...Array(e[0].dims.length).keys()]),Te({starts:r,ends:i,axes:n})}else return t},Gn=(e,t,r,i,n)=>{let a=e;return e<0&&(a+=r[i[t]]),n[t]<0?Math.max(0,Math.min(a,r[i[t]]-1)):Math.max(0,Math.min(a,r[i[t]]))},oc=(e,t,r)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
          var input_indices: ${e.type.indices};
          var carry = 0u;
          for (var i = ${r.length-1}; i >= 0; i--) {
            let input_shape_i = ${se("uniforms.input_shape","i",r.length)};
            let steps_i = ${se("uniforms.steps","i",r.length)};
            let signs_i = ${se("uniforms.signs","i",r.length)};
            let starts_i = ${se("uniforms.starts","i",r.length)};
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
      }`,uc=(e,t)=>{let r=e[0].dims,i=U.size(r),n=t.axes.length>0?U.normalizeAxes(t.axes,r.length):[...Array(r.length).keys()],a=kr(e,4);a.forEach($=>$!==0||(()=>{throw new Error("step cannot be 0")})),a.length===0&&(a=Array(n.length).fill(1));let s=t.starts.map(($,b)=>Gn($,b,r,n,a)),o=t.ends.map(($,b)=>Gn($,b,r,n,a));if(n.length!==s.length||n.length!==o.length)throw new Error("start, ends and axes should have the same number of elements");if(n.length!==r.length)for(let $=0;$<r.length;++$)n.includes($)||(s.splice($,0,0),o.splice($,0,r[$]),a.splice($,0,1));let u=a.map($=>Math.sign($));a.forEach(($,b,k)=>{if($<0){let I=(o[b]-s[b])/$,S=s[b],E=S+I*a[b];s[b]=E,o[b]=S,k[b]=-$}});let l=r.slice(0);n.forEach(($,b)=>{l[$]=Math.ceil((o[$]-s[$])/a[$])});let c={dims:l,dataType:e[0].dataType},p=ae("output",e[0].dataType,l.length),m=F("input",e[0].dataType,e[0].dims.length),g=U.size(l),f=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:s.length},{name:"signs",type:"i32",length:u.length},{name:"steps",type:"u32",length:a.length}],_=[{type:12,data:g},{type:12,data:s},{type:6,data:u},{type:12,data:a},...oe(e[0].dims,l)],v=$=>`
      ${$.registerUniforms(f).declareVariables(m,p)}
        ${oc(m,p,r)}
        ${$.mainStart()}
          ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${p.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${p.setByOffset("global_idx",m.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${u.length}_${s.length}_${a.length}`,inputDependencies:["rank"]},getShaderSource:v,getRunData:()=>({outputs:[c],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:_})}},jf=(e,t)=>{ac(e.inputs,t);let r=sc(e.inputs,t);e.compute(uc(e.inputs,r),{inputs:[0]})},Kf=e=>{let t=e.starts,r=e.ends,i=e.axes;return Te({starts:t,ends:r,axes:i})}}),lc,dc,Zf,Yf,Hy=X(()=>{"use strict";le(),pe(),Be(),Ot(),he(),lc=e=>{if(!e||e.length!==1)throw new Error("Softmax op requires 1 input.")},dc=(e,t)=>{let r=e.inputs[0],i=r.dims,n=U.size(i),a=i.length,s=U.normalizeAxis(t.axis,a),o=s<i.length-1,u,l=[];o?(l=Array.from({length:a},(C,x)=>x),l[s]=a-1,l[a-1]=s,u=e.compute(Je(r,l),{inputs:[r],outputs:[-1]})[0]):u=r;let c=u.dims,p=c[a-1],m=n/p,g=Oe(p),f=p/g,_=64;m===1&&(_=256);let v=(C,x)=>x===4?`max(max(${C}.x, ${C}.y), max(${C}.z, ${C}.w))`:x===2?`max(${C}.x, ${C}.y)`:x===3?`max(max(${C}.x, ${C}.y), ${C}.z)`:C,$=F("x",u.dataType,u.dims,g),b=ae("result",u.dataType,u.dims,g),k=$.type.value,I=We(u.dataType)==="f32"?`var threadMax = ${k}(-3.4028234663852886e+38f);`:`var threadMax = ${k}(-65504.0h);`,S=C=>`
      var<workgroup> rowMaxShared : ${k};
      var<workgroup> rowSumShared : ${k};
      var<workgroup> threadShared : array<${k}, ${_}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${k} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${k}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${C.registerUniform("packedCols","i32").declareVariables($,b)}
      ${C.mainStart(_)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${_};
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
          rowSumShared = ${k}(${At("threadShared[0]",g)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          var value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          // max operation protects against NaN since all values should be >=0
          value = max(value, ${k}(0.0));
          setValue(row, col, row_stride, value);
        }
      }`,E=e.compute({name:"Softmax",shaderCache:{hint:`${g};${_}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:c,dataType:u.dataType}],dispatchGroup:{x:m},programUniforms:[{type:6,data:f}]}),getShaderSource:S},{inputs:[u],outputs:[o?-1:0]})[0];o&&e.compute(Je(E,l),{inputs:[E]})},Zf=(e,t)=>{lc(e.inputs),dc(e,t)},Yf=e=>Te({axis:e.axis})}),Vn,cc,pc,hc,Xf,Fy=X(()=>{"use strict";le(),pe(),he(),Vn=e=>Array.from(e.getBigInt64Array(),Number),cc=e=>{if(!e||e.length!==2)throw new Error("Tile requires 2 inputs.");if(e[0].dataType!==1&&e[0].dataType!==10&&e[0].dataType!==6&&e[0].dataType!==12)throw new Error("Tile only support float, float16, int32, and uint32 data types");if(e[1].dataType!==7)throw new Error("Tile `repeats` input should be of int64 data type");if(e[1].dims.length!==1)throw new Error("Tile `repeats` input should be 1-D");if(Vn(e[1]).length!==e[0].dims.length)throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},pc=(e,t)=>{let r=[];for(let i=0;i<e.length;++i)r.push(e[i]*t[i]);return r},hc=(e,t)=>{let r=e[0].dims,i=t??Vn(e[1]),n=pc(r,i),a=U.size(n),s=e[0].dataType,o=F("input",s,r.length),u=ae("output",s,n.length),l=c=>`
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
    }`;return{name:"Tile",shaderCache:{hint:`${i}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:[{type:12,data:a},...oe(e[0].dims,n)]}),getShaderSource:l}},Xf=e=>{cc(e.inputs),e.compute(hc(e.inputs),{inputs:[0]})}}),fc,mc,Qf,jy=X(()=>{"use strict";le(),pe(),he(),fc=(e,t,r,i,n)=>{let a=ae("output_data",n,r.length,4),s=F("a_data",t[1].dataType,t[1].dims.length,4),o=F("b_data",t[2].dataType,t[2].dims.length,4),u=F("c_data",t[0].dataType,t[0].dims.length,4),l,c=(p,m,g)=>`select(${m}, ${p}, ${g})`;if(!i)l=a.setByOffset("global_idx",c(s.getByOffset("global_idx"),o.getByOffset("global_idx"),u.getByOffset("global_idx")));else{let p=(m,g,f="")=>{let _=`a_data[index_a${g}][component_a${g}]`,v=`b_data[index_b${g}][component_b${g}]`,$=`bool(c_data[index_c${g}] & (0xffu << (component_c${g} * 8)))`;return`
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
            ${m}[${g}] = ${f}(${c(_,v,$)});
          `};n===9?l=`
            var data = vec4<u32>(0);
            ${p("data",0,"u32")}
            ${p("data",1,"u32")}
            ${p("data",2,"u32")}
            ${p("data",3,"u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:l=`
            ${p("output_data[global_idx]",0)}
            ${p("output_data[global_idx]",1)}
            ${p("output_data[global_idx]",2)}
            ${p("output_data[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(u,s,o,a)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${l}
      }`},mc=e=>{let t=e[1].dims,r=e[2].dims,i=e[0].dims,n=e[1].dataType,a=!(U.areEqual(t,r)&&U.areEqual(r,i)),s=t,o=U.size(t);if(a){let l=cr.calcShape(cr.calcShape(t,r,!1),i,!1);if(!l)throw new Error("Can't perform where op on the given tensors");s=l,o=U.size(s)}let u=Math.ceil(o/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:l=>fc(l,e,s,a,n),getRunData:()=>({outputs:[{dims:s,dataType:n}],dispatchGroup:{x:Math.ceil(o/64/4)},programUniforms:[{type:12,data:u},...oe(i,t,r,s)]})}},Qf=e=>{e.compute(mc(e.inputs))}}),Jf,Ky=X(()=>{"use strict";oy(),Ba(),uy(),ly(),dy(),cy(),py(),yy(),_y(),by(),$y(),xy(),vy(),ky(),Sy(),Iy(),Ty(),Cy(),Ey(),zy(),My(),Ay(),Oy(),By(),Ry(),Dy(),wf(),Ny(),Uy(),Py(),Ly(),Wy(),Oa(),qy(),vf(),Gy(),Vy(),Hy(),$f(),Fy(),Ot(),Ra(),jy(),Jf=new Map([["Abs",[qp]],["Acos",[Gp]],["Acosh",[Vp]],["Add",[Sh]],["ArgMax",[Up,aa]],["ArgMin",[Np,aa]],["Asin",[Hp]],["Asinh",[Fp]],["Atan",[jp]],["Atanh",[Kp]],["Attention",[Pp]],["AveragePool",[Af,Mf]],["BatchNormalization",[Lp]],["BiasAdd",[Wp]],["BiasSplitGelu",[kh]],["Cast",[Yp,Zp]],["Ceil",[Qp]],["Clip",[Xp]],["Concat",[Rh,Dh]],["Conv",[ca,da]],["ConvTranspose",[Fh,Hh]],["Cos",[Jp]],["Cosh",[eh]],["CumSum",[jh,Kh]],["DepthToSpace",[Zh,Yh]],["DequantizeLinear",[Pf,Lf]],["DFT",[Xh,Qh]],["Div",[Ih]],["Einsum",[Jh,ef]],["Elu",[th,zr]],["Equal",[Th]],["Erf",[rh]],["Exp",[ih]],["Expand",[tf]],["FastGelu",[rf]],["Floor",[nh]],["FusedConv",[ca,da]],["Gather",[af,nf]],["GatherElements",[cf,df]],["GatherBlockQuantized",[uf,lf]],["GatherND",[sf,of]],["Gelu",[ah]],["Gemm",[hf,pf]],["GlobalAveragePool",[Bf,Of]],["GlobalMaxPool",[Uf,Nf]],["Greater",[Mh]],["GreaterOrEqual",[Oh]],["GridSample",[ff,mf]],["GroupQueryAttention",[kf]],["HardSigmoid",[hh,ph]],["HardSwish",[fh]],["InstanceNormalization",[Sf]],["LayerNormalization",[If]],["LeakyRelu",[sh,zr]],["Less",[Ah]],["LessOrEqual",[Bh]],["Log",[xh]],["MatMul",[Tf]],["MatMulNBits",[Cf,Ef]],["MaxPool",[Rf,Df]],["Mul",[Ch]],["MultiHeadAttention",[yf,gf]],["Neg",[uh]],["Not",[oh]],["Pad",[zf]],["Pow",[Eh]],["QuickGelu",[vh,zr]],["Range",[Wf]],["Reciprocal",[lh]],["ReduceMin",[Ap]],["ReduceMean",[Tp]],["ReduceMax",[Mp]],["ReduceSum",[Bp]],["ReduceProd",[Op]],["ReduceL1",[Cp]],["ReduceL2",[Ep]],["ReduceLogSum",[Dp]],["ReduceLogSumExp",[zp]],["ReduceSumSquare",[Rp]],["Relu",[dh]],["Resize",[Vf,Hf]],["RotaryEmbedding",[xf]],["ScatterND",[Gf,qf]],["Sigmoid",[ch]],["Sin",[mh]],["Sinh",[gh]],["Slice",[jf,Kf]],["SkipLayerNormalization",[Ff]],["Split",[_f,bf]],["Sqrt",[yh]],["Softmax",[Zf,Yf]],["Sub",[zh]],["Tan",[wh]],["Tanh",[_h]],["ThresholdedRelu",[$h,zr]],["Tile",[Xf]],["Transpose",[mp,gp]],["Where",[Qf]]])}),em,Zy=X(()=>{"use strict";et(),St(),he(),em=class{constructor(e){this.backend=e,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,r,i,n){it(e.programInfo.name);let a=this.backend.device,s=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let o=[];for(let l of t)o.push({binding:o.length,resource:{buffer:l.buffer}});for(let l of r)o.push({binding:o.length,resource:{buffer:l.buffer}});n&&o.push({binding:o.length,resource:n});let u=a.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:o,label:e.programInfo.name});if(this.backend.sessionStatus==="capturing"){let l={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:u,dispatchGroup:i};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(l)}s.setPipeline(e.computePipeline),s.setBindGroup(0,u),s.dispatchWorkgroups(...i),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType==="at-passes")&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),Qe(e.programInfo.name)}dispose(){}build(e,t){it(e.name);let r=this.backend.device,i=[];[{feature:"shader-f16",extension:"f16"},{feature:"subgroups",extension:"subgroups"}].forEach(l=>{r.features.has(l.feature)&&i.push(`enable ${l.extension};`)});let n=fp(t,this.backend.device.limits),a=e.getShaderSource(n),s=`${i.join(`
`)}
${n.additionalImplementations}
${a}`,o=r.createShaderModule({code:s,label:e.name});$e("verbose",()=>`[WebGPU] ${e.name} shader code: ${s}`);let u=r.createComputePipeline({compute:{module:o,entryPoint:"main"},layout:"auto",label:e.name});return Qe(e.name),{programInfo:e,computePipeline:u,uniformVariablesInfo:n.variablesInfo}}normalizeDispatchGroupSize(e){let t=typeof e=="number"?e:e.x,r=typeof e=="number"?1:e.y||1,i=typeof e=="number"?1:e.z||1,n=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(t<=n&&r<=n&&i<=n)return[t,r,i];let a=t*r*i,s=Math.ceil(Math.sqrt(a));if(s>n){if(s=Math.ceil(Math.cbrt(a)),s>n)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[s,s,s]}else return[s,s,1]}}}),tm={};hr(tm,{WebGpuBackend:()=>rm});var gc,yc,wc,rm,Yy=X(()=>{"use strict";et(),le(),St(),lp(),ay(),Ky(),Zy(),gc=(e,t)=>{if(t.length!==e.length)throw new Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let r=[];for(let i=0;i<e.length;++i){let n=e[i].dataType;switch(t[i]){case"none":{r.push("");break}case"type":{r.push(`${n}`);break}case"rank":{let a=e[i].dims.length;r.push(`${n};${a}`);break}case"dims":{let a=e[i].dims.join(",");r.push(`${n};${a}`);break}default:throw new Error(`unsupported input dependency: ${t[i]}`)}}return r.join("|")},yc=(e,t,r)=>{let i=e.name;return e.shaderCache?.hint&&(i+="["+e.shaderCache.hint+"]"),i+=":"+r+`:${gc(t,e.shaderCache?.inputDependencies??new Array(t.length).fill("dims"))}`,i},wc=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},rm=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus="default",this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,t){this.env=e;let r=[],i={requiredLimits:{maxComputeWorkgroupStorageSize:t.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:t.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:t.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.limits.maxComputeWorkgroupSizeZ},requiredFeatures:r},n=o=>t.features.has(o)&&r.push(o)&&!0;n("chromium-experimental-timestamp-query-inside-passes")||n("timestamp-query"),n("shader-f16"),n("subgroups"),this.device=await t.requestDevice(i);let a=t,s=t.info??(typeof a.requestAdapterInfo=="function"?await a.requestAdapterInfo():void 0);this.adapterInfo=new wc(s),this.gpuDataManager=pp(this),this.programManager=new em(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,Ea(e.logLevel,!!e.debug),this.device.onuncapturederror=o=>{o.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${o.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!0}),Object.defineProperty(this.env.webgpu,"adapter",{value:t,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){typeof this.querySet<"u"&&this.querySet.destroy(),this.gpuDataManager.dispose(),this.device&&this.env?.webgpu&&this.device.lost.then(()=>{delete this.env.webgpu.device})}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),t={};this.queryType==="at-passes"&&(t.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=e.beginComputePass(t)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){if(!this.commandEncoder)return;it(),this.endComputePass();let e;this.queryType!=="none"&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),e=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!=="none"&&e.mapAsync(GPUMapMode.READ).then(()=>{let t=new BigUint64Array(e.getMappedRange()),r=this.pendingQueries.get(e);for(let i=0;i<t.length/2;i++){let n=r[i],a=n.kernelId,s=this.kernels.get(a),o=s.kernelType,u=s.kernelName,l=n.programName,c=n.inputTensorViews,p=n.outputTensorViews,m=t[i*2],g=t[i*2+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=m);let f=Number(m-this.queryTimeBase),_=Number(g-this.queryTimeBase);if(!Number.isSafeInteger(f)||!Number.isSafeInteger(_))throw new RangeError("incorrect timestamp range");if(this.env.webgpu.profiling?.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:c.map(v=>({dims:v.dims,dataType:kt(v.dataType)})),outputsMetadata:p.map(v=>({dims:v.dims,dataType:kt(v.dataType)})),kernelId:a,kernelType:o,kernelName:u,programName:l,startTime:f,endTime:_});else{let v="";c.forEach((b,k)=>{v+=`input[${k}]: [${b.dims}] | ${kt(b.dataType)}, `});let $="";p.forEach((b,k)=>{$+=`output[${k}]: [${b.dims}] | ${kt(b.dataType)}, `}),console.log(`[profiling] kernel "${a}|${o}|${u}|${l}" ${v}${$}start time: ${f} ns, execution time: ${_-f} ns`)}hi("GPU",`${l}::${m}::${g}`)}e.unmap(),this.pendingQueries.delete(e)}),Qe()}run(e,t,r,i,n,a){it(e.name);let s=[];for(let b=0;b<t.length;++b){let k=t[b].data;if(k===0)continue;let I=this.gpuDataManager.get(k);if(!I)throw new Error(`no GPU data for input: ${k}`);s.push(I)}let{outputs:o,dispatchGroup:u,programUniforms:l}=e.getRunData(t),c=r.length===0?o.map((b,k)=>k):r;if(c.length!==o.length)throw new Error(`Output size ${c.length} must be equal to ${o.length}.`);let p=[],m=[];for(let b=0;b<o.length;++b){if(!Number.isInteger(c[b])||c[b]<-3||c[b]>=a)throw new Error(`Invalid output index: ${c[b]}`);if(c[b]===-3)continue;let k=c[b]===-1,I=c[b]===-2,S=k||I?n(o[b].dataType,o[b].dims):i(c[b],o[b].dataType,o[b].dims);if(p.push(S),S.data===0)continue;let E=this.gpuDataManager.get(S.data);if(!E)throw new Error(`no GPU data for output: ${S.data}`);if(k&&this.temporaryData.push(E),I){let C=this.kernelPersistentData.get(this.currentKernelId);C||(C=[],this.kernelPersistentData.set(this.currentKernelId,C)),C.push(E)}m.push(E)}if(s.length!==t.length||m.length!==p.length){if(m.length===0)return Qe(e.name),p;throw new Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let g;if(l){let b=0,k=[];l.forEach(C=>{let x=typeof C.data=="number"?[C.data]:C.data;if(x.length===0)return;let O=C.type===10?2:4,N,R;C.type===10?(R=x.length>4?16:x.length>2?8:x.length*O,N=x.length>4?16:O*x.length):(R=x.length<=2?x.length*O:16,N=16),b=Math.ceil(b/R)*R,k.push(b);let P=C.type===10?8:4;b+=x.length>4?Math.ceil(x.length/P)*N:x.length*O});let I=16;b=Math.ceil(b/I)*I;let S=new ArrayBuffer(b);l.forEach((C,x)=>{let O=k[x],N=typeof C.data=="number"?[C.data]:C.data;if(C.type===6)new Int32Array(S,O,N.length).set(N);else if(C.type===12)new Uint32Array(S,O,N.length).set(N);else if(C.type===10)new Uint16Array(S,O,N.length).set(N);else if(C.type===1)new Float32Array(S,O,N.length).set(N);else throw new Error(`Unsupported uniform type: ${kt(C.type)}`)});let E=this.gpuDataManager.create(b,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(E.buffer,0,S,0,b),this.gpuDataManager.release(E.id),g={offset:0,size:b,buffer:E.buffer}}let f=this.programManager.normalizeDispatchGroupSize(u),_=f[1]===1&&f[2]===1,v=yc(e,t,_),$=this.programManager.getArtifact(v);if($||($=this.programManager.build(e,f),this.programManager.setArtifact(v,$),$e("info",()=>`[artifact] key: ${v}, programName: ${e.name}`)),l&&$.uniformVariablesInfo){if(l.length!==$.uniformVariablesInfo.length)throw new Error(`Uniform variables count mismatch: expect ${$.uniformVariablesInfo.length}, got ${l.length} in program "${$.programInfo.name}".`);for(let b=0;b<l.length;b++){let k=l[b],I=k.type,S=typeof k.data=="number"?1:k.data.length,[E,C]=$.uniformVariablesInfo[b];if(I!==E||S!==C)throw new Error(`Uniform variable ${b} mismatch: expect type ${E} with size ${C}, got type ${I} with size ${S} in program "${$.programInfo.name}".`)}}if($e("info",()=>`[ProgramManager] run "${e.name}" (key=${v}) with ${f[0]}x${f[1]}x${f[2]}`),this.queryType!=="none"||this.sessionStatus==="capturing"){let b={kernelId:this.currentKernelId,programName:$.programInfo.name,inputTensorViews:t,outputTensorViews:p};this.pendingKernels.push(b),this.sessionStatus==="capturing"&&this.capturedPendingKernels.get(this.currentSessionId).push(b)}return this.programManager.run($,s,m,f,g),Qe(e.name),p}upload(e,t){this.gpuDataManager.upload(e,t)}memcpy(e,t){this.gpuDataManager.memcpy(e,t)}async download(e,t){await this.gpuDataManager.download(e,t)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,t,r,i){let n=Jf.get(e);if(!n)throw new Error(`kernel not implemented: ${e}`);let a={kernelType:e,kernelName:i,kernelEntry:n[0],attributes:[n[1],r]};this.kernels.set(t,a)}releaseKernel(e){let t=this.kernelPersistentData.get(e);if(t){for(let r of t)this.gpuDataManager.release(r.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,t,r){let i=this.kernels.get(e);if(!i)throw new Error(`kernel not created: ${e}`);let n=i.kernelType,a=i.kernelName,s=i.kernelEntry,o=i.attributes;if(this.currentKernelId!==null)throw new Error(`kernel "[${n}] ${a}" is not allowed to be called recursively`);this.currentKernelId=e,o[0]&&(o[1]=o[0](o[1]),o[0]=void 0),$e("info",()=>`[WebGPU] Start to run kernel "[${n}] ${a}"...`);let u=this.env.debug;this.temporaryData=[];try{return u&&this.device.pushErrorScope("validation"),s(t,o[1]),0}catch(l){return r.push(Promise.resolve(`[WebGPU] Kernel "[${n}] ${a}" failed. ${l}`)),1}finally{u&&r.push(this.device.popErrorScope().then(l=>l?`GPU validation error for kernel "[${n}] ${a}": ${l.message}`:null));for(let l of this.temporaryData)this.gpuDataManager.release(l.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,t,r,i){let n=this.sessionExternalDataMapping.get(e);n||(n=new Map,this.sessionExternalDataMapping.set(e,n));let a=n.get(t),s=this.gpuDataManager.registerExternalBuffer(r,i,a);return n.set(t,[s,r]),s}unregisterBuffers(e){let t=this.sessionExternalDataMapping.get(e);t&&(t.forEach(r=>this.gpuDataManager.unregisterExternalBuffer(r[0])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let t=this.gpuDataManager.get(e);if(!t)throw new Error(`no GPU data for buffer: ${e}`);return t.buffer}createDownloader(e,t,r){return async()=>{let i=await ra(this,e,t);return za(i.buffer,r)}}writeTimestamp(e){this.queryType==="inside-passes"&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){this.queryType="none",(this.env.webgpu.profiling?.mode==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),this.queryType!=="none"&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){$e("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){$e("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){$e("info","replay"),this.sessionStatus="replaying";let e=this.capturedCommandList.get(this.currentSessionId),t=this.capturedPendingKernels.get(this.currentSessionId),r=e.length;this.pendingKernels=[];for(let i=0;i<r;i++){let n=this.getComputePassEncoder(),a=e[i];this.writeTimestamp(this.pendingDispatchNumber*2),n.setPipeline(a.computePipeline),n.setBindGroup(0,a.bindGroup),n.dispatchWorkgroups(...a.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!=="none"&&this.pendingKernels.push(t[i]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType==="at-passes")&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}}),im={};hr(im,{init:()=>nm});var si,_c,nm,Xy=X(()=>{"use strict";le(),St(),pe(),ny(),si=class am{constructor(t,r,i,n){this.module=t,this.dataType=r,this.data=i,this.dims=n}getFloat32Array(){if(this.dataType!==1)throw new Error("Invalid data type");let t=U.size(this.dims);return t===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,t)}getBigInt64Array(){if(this.dataType!==7)throw new Error("Invalid data type");let t=U.size(this.dims);return t===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,t)}getInt32Array(){if(this.dataType!==6)throw new Error("Invalid data type");let t=U.size(this.dims);return t===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,t)}getUint16Array(){if(this.dataType!==10&&this.dataType!==4)throw new Error("Invalid data type");let t=U.size(this.dims);return t===0?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,t)}reshape(t){if(U.size(t)!==U.size(this.dims))throw new Error("Invalid new shape");return new am(this.module,this.dataType,this.data,t)}},_c=class{constructor(e,t,r){this.module=e,this.backend=t,this.customDataOffset=0,this.customDataSize=0,this.adapterInfo=t.adapterInfo,this.deviceLimits=t.device.limits;let i=e.PTR_SIZE,n=r/e.PTR_SIZE,a=i===4?"i32":"i64";this.opKernelContext=Number(e.getValue(i*n++,a));let s=Number(e.getValue(i*n++,a));this.outputCount=Number(e.getValue(i*n++,a)),this.customDataOffset=Number(e.getValue(i*n++,"*")),this.customDataSize=Number(e.getValue(i*n++,a));let o=[];for(let u=0;u<s;u++){let l=Number(e.getValue(i*n++,a)),c=Number(e.getValue(i*n++,"*")),p=Number(e.getValue(i*n++,a)),m=[];for(let g=0;g<p;g++)m.push(Number(e.getValue(i*n++,a)));o.push(new si(e,l,c,m))}this.inputs=o}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(e,t){let r=t?.inputs?.map(s=>typeof s=="number"?this.inputs[s]:s)??this.inputs,i=t?.outputs??[],n=(s,o,u)=>new si(this.module,o,this.output(s,u),u),a=(s,o)=>{let u=Ht(s,o);if(!u)throw new Error(`Unsupported data type: ${s}`);let l=u>0?this.backend.gpuDataManager.create(u).id:0;return new si(this.module,s,l,o)};return this.backend.run(e,r,i,n,a,this.outputCount)}output(e,t){let r=this.module.stackSave();try{let i=this.module.PTR_SIZE,n=i===4?"i32":"i64",a=this.module.stackAlloc((1+t.length)*i);this.module.setValue(a,t.length,n);for(let s=0;s<t.length;s++)this.module.setValue(a+i*(s+1),t[s],n);return this.module._JsepOutput(this.opKernelContext,e,a)}catch(i){throw new Error(`Failed to generate kernel's output[${e}] with dims [${t}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${i}`)}finally{this.module.stackRestore(r)}}},nm=async(e,t,r,i)=>{let n=t.jsepInit;if(!n)throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if(e==="webgpu"){let a=(Yy(),Rr(tm)).WebGpuBackend,s=new a;await s.initialize(r,i),n("webgpu",[s,o=>s.alloc(Number(o)),o=>s.free(o),(o,u,l,c=!1)=>{if(c)$e("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(o)}, dst=${Number(u)}, size=${Number(l)}`),s.memcpy(Number(o),Number(u));else{$e("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(o)}, gpuDataId=${Number(u)}, size=${Number(l)}`);let p=t.HEAPU8.subarray(Number(o>>>0),Number(o>>>0)+Number(l));s.upload(Number(u),p)}},async(o,u,l)=>{$e("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${o}, dataOffset=${u}, size=${l}`),await s.download(Number(o),()=>t.HEAPU8.subarray(Number(u)>>>0,Number(u+l)>>>0))},(o,u,l)=>s.createKernel(o,Number(u),l,t.UTF8ToString(t._JsepGetNodeName(Number(u)))),o=>s.releaseKernel(o),(o,u,l,c)=>{$e("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${l}, kernel=${o}, contextDataOffset=${u}`);let p=new _c(t,s,Number(u));return s.computeKernel(Number(o),p,c)},()=>s.captureBegin(),()=>s.captureEnd(),()=>s.replay()])}else{let a=new cp(r);n("webnn",[a,()=>a.reserveTensorId(),s=>a.releaseTensorId(s),async(s,o,u,l,c)=>a.ensureTensor(s,o,u,l,c),(s,o)=>{a.uploadTensor(s,o)},async(s,o)=>a.downloadTensor(s,o),(s,o)=>a.registerMLContext(s,o),!!r.trace])}}}),bc,Wa,qa,zt,$c,Hn,bi,Ga,Va,Sr,xc,Lt,sm,om,Fn,Ha,Fa,ja,um=X(()=>{"use strict";et(),ty(),ry(),le(),Xt(),Sa(),Ca(),bc=(e,t)=>{Ee()._OrtInit(e,t)!==0&&Se("Can't initialize onnxruntime.")},Wa=async e=>{bc(e.wasm.numThreads,mi(e.logLevel))},qa=async(e,t)=>{Ee().asyncInit?.();let r=e.webgpu.adapter;if(t==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");if(r){if(typeof r.limits!="object"||typeof r.features!="object"||typeof r.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let i=e.webgpu.powerPreference;if(i!==void 0&&i!=="low-power"&&i!=="high-performance")throw new Error(`Invalid powerPreference setting: "${i}"`);let n=e.webgpu.forceFallbackAdapter;if(n!==void 0&&typeof n!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${n}"`);if(r=await navigator.gpu.requestAdapter({powerPreference:i,forceFallbackAdapter:n}),!r)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}}if(t==="webnn"&&(typeof navigator>"u"||!navigator.ml))throw new Error("WebNN is not supported in current environment");{let i=(Xy(),Rr(im)).init;t==="webgpu"&&await i("webgpu",Ee(),e,r),t==="webnn"&&await i("webnn",Ee(),e)}},zt=new Map,$c=e=>{let t=Ee(),r=t.stackSave();try{let i=t.PTR_SIZE,n=t.stackAlloc(2*i);t._OrtGetInputOutputCount(e,n,n+i)!==0&&Se("Can't get session input/output count.");let a=i===4?"i32":"i64";return[Number(t.getValue(n,a)),Number(t.getValue(n+i,a))]}finally{t.stackRestore(r)}},Hn=(e,t)=>{let r=Ee(),i=r.stackSave(),n=0;try{let a=r.PTR_SIZE,s=r.stackAlloc(2*a);r._OrtGetInputOutputMetadata(e,t,s,s+a)!==0&&Se("Can't get session input/output metadata.");let o=Number(r.getValue(s,"*"));n=Number(r.getValue(s+a,"*"));let u=r.HEAP32[n/4];if(u===0)return[o,0];let l=r.HEAPU32[n/4+1],c=[];for(let p=0;p<l;p++){let m=Number(r.getValue(n+8+p*a,"*"));c.push(m!==0?r.UTF8ToString(m):Number(r.getValue(n+8+(p+l)*a,"*")))}return[o,u,c]}finally{r.stackRestore(i),n!==0&&r._OrtFree(n)}},bi=e=>{let t=Ee(),r=t._malloc(e.byteLength);if(r===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,r),[r,e.byteLength]},Ga=async(e,t)=>{let r,i,n=Ee();Array.isArray(e)?[r,i]=e:e.buffer===n.HEAPU8.buffer?[r,i]=[e.byteOffset,e.byteLength]:[r,i]=bi(e);let a=0,s=0,o=0,u=[],l=[],c=[];try{if([s,u]=await ap(t),t?.externalData&&n.mountExternalData){let I=[];for(let S of t.externalData){let E=typeof S=="string"?S:S.path,C=typeof S=="string"?S:S.data;I.push(xi(C).then(x=>{n.mountExternalData(E,x)}))}await Promise.all(I)}for(let I of t?.executionProviders??[])if((typeof I=="string"?I:I.name)==="webnn"){if(n.shouldTransferToMLTensor=!1,typeof I!="string"){let S=I,E=S?.context,C=S?.gpuDevice,x=S?.deviceType,O=S?.powerPreference;E?n.currentContext=E:C?n.currentContext=await n.webnnCreateMLContext(C):n.currentContext=await n.webnnCreateMLContext({deviceType:x,powerPreference:O})}else n.currentContext=await n.webnnCreateMLContext();break}a=await n._OrtCreateSession(r,i,s),n.webgpuOnCreateSession?.(a),a===0&&Se("Can't create a session."),n.jsepOnCreateSession?.(),n.currentContext&&(n.webnnRegisterMLContext(a,n.currentContext),n.currentContext=void 0,n.shouldTransferToMLTensor=!0);let[p,m]=$c(a),g=!!t?.enableGraphCapture,f=[],_=[],v=[],$=[],b=[];for(let I=0;I<p;I++){let[S,E,C]=Hn(a,I);S===0&&Se("Can't get an input name."),l.push(S);let x=n.UTF8ToString(S);f.push(x),v.push(E===0?{name:x,isTensor:!1}:{name:x,isTensor:!0,type:kt(E),shape:C})}for(let I=0;I<m;I++){let[S,E,C]=Hn(a,I+p);S===0&&Se("Can't get an output name."),c.push(S);let x=n.UTF8ToString(S);_.push(x),$.push(E===0?{name:x,isTensor:!1}:{name:x,isTensor:!0,type:kt(E),shape:C});{if(g&&t?.preferredOutputLocation===void 0){b.push("gpu-buffer");continue}let O=typeof t?.preferredOutputLocation=="string"?t.preferredOutputLocation:t?.preferredOutputLocation?.[x]??"cpu",N=n.webnnIsGraphOutput;if(O==="cpu"&&N&&N(a,x)){b.push("ml-tensor-cpu-output");continue}if(O!=="cpu"&&O!=="cpu-pinned"&&O!=="gpu-buffer"&&O!=="ml-tensor")throw new Error(`Not supported preferred output location: ${O}.`);if(g&&O!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${O}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);b.push(O)}}let k=null;return b.some(I=>I==="gpu-buffer"||I==="ml-tensor"||I==="ml-tensor-cpu-output")&&(o=n._OrtCreateBinding(a),o===0&&Se("Can't create IO binding."),k={handle:o,outputPreferredLocations:b,outputPreferredLocationsEncoded:b.map(I=>I==="ml-tensor-cpu-output"?"ml-tensor":I).map(I=>ta(I))}),zt.set(a,[a,l,c,k,g,!1]),[a,f,_,v,$]}catch(p){throw l.forEach(m=>n._OrtFree(m)),c.forEach(m=>n._OrtFree(m)),o!==0&&n._OrtReleaseBinding(o)!==0&&Se("Can't release IO binding."),a!==0&&n._OrtReleaseSession(a)!==0&&Se("Can't release session."),p}finally{n._free(r),s!==0&&n._OrtReleaseSessionOptions(s)!==0&&Se("Can't release session options."),u.forEach(p=>n._free(p)),n.unmountExternalData?.()}},Va=e=>{let t=Ee(),r=zt.get(e);if(!r)throw new Error(`cannot release session. invalid session id: ${e}`);let[i,n,a,s,o]=r;s&&(o&&t._OrtClearBoundOutputs(s.handle)!==0&&Se("Can't clear bound outputs."),t._OrtReleaseBinding(s.handle)!==0&&Se("Can't release IO binding.")),t.jsepOnReleaseSession?.(e),t.webnnOnReleaseSession?.(e),t.webgpuOnReleaseSession?.(e),n.forEach(u=>t._OrtFree(u)),a.forEach(u=>t._OrtFree(u)),t._OrtReleaseSession(i)!==0&&Se("Can't release session."),zt.delete(e)},Sr=new Map,xc=1,Lt=new Map,sm=e=>{let t=Ee(),r=t._malloc(e.byteLength);if(r===0)throw new Error(`Can't create a LoRA adapter. failed to allocate a buffer of size ${e.byteLength}.`);try{t.HEAPU8.set(e,r);let i=t._OrtCreateLoraAdapter(r,e.byteLength);i===0&&Se("Can't create a LoRA adapter.");let n=xc++;return Sr.set(n,i),n}finally{t._free(r)}},om=e=>{let t=Ee(),r=Sr.get(e);if(r===void 0)throw new Error(`cannot release LoRA adapter. invalid adapter id: ${e}`);if(Lt.has(e))throw new Error(`cannot release LoRA adapter. the adapter is used by a run in progress. adapter id: ${e}`);t._OrtReleaseLoraAdapter(r)!==0&&Se("Can't release LoRA adapter."),Sr.delete(e)},Fn=async(e,t,r,i,n,a,s=!1)=>{if(!e){t.push(0);return}let o=Ee(),u=o.PTR_SIZE,l=e[0],c=e[1],p=e[3],m=p,g,f;if(l==="string"&&(p==="gpu-buffer"||p==="ml-tensor"))throw new Error("String tensor is not supported on GPU.");if(s&&p!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${a} when enableGraphCapture is true.`);if(p==="gpu-buffer"){let $=e[2].gpuBuffer;f=Ht(Vt(l),c);{let b=o.jsepRegisterBuffer;if(!b)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');g=b(i,a,$,f)}}else if(p==="ml-tensor"){let $=e[2].mlTensor;f=Ht(Vt(l),c);let b=o.webnnRegisterMLTensor;if(!b)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');g=b(i,$,Vt(l),c)}else{let $=e[2];if(Array.isArray($)){f=u*$.length,g=o._malloc(f),r.push(g);for(let b=0;b<$.length;b++){if(typeof $[b]!="string")throw new TypeError(`tensor data at index ${b} is not a string`);o.setValue(g+b*u,dt($[b],r),"*")}}else{let b=o.webnnIsGraphInput,k=o.webnnIsGraphOutput;if(l!=="string"&&b&&k){let I=o.UTF8ToString(n);if(b(i,I)||k(i,I)){let S=Vt(l);f=Ht(S,c),m="ml-tensor";let E=o.webnnCreateTemporaryTensor,C=o.webnnUploadTensor;if(!E||!C)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let x=await E(i,S,c);C(x,new Uint8Array($.buffer,$.byteOffset,$.byteLength)),g=x}else f=$.byteLength,g=o._malloc(f),r.push(g),o.HEAPU8.set(new Uint8Array($.buffer,$.byteOffset,f),g)}else f=$.byteLength,g=o._malloc(f),r.push(g),o.HEAPU8.set(new Uint8Array($.buffer,$.byteOffset,f),g)}}let _=o.stackSave(),v=o.stackAlloc(4*c.length);try{c.forEach((b,k)=>o.setValue(v+k*u,b,u===4?"i32":"i64"));let $=o._OrtCreateTensor(Vt(l),g,f,v,c.length,ta(m));$===0&&Se(`Can't create tensor for input/output. session=${i}, index=${a}.`),t.push($)}finally{o.stackRestore(_)}},Ha=async(e,t,r,i,n,a,s=[])=>{let o=Ee(),u=o.PTR_SIZE,l=zt.get(e);if(!l)throw new Error(`cannot run inference. invalid session id: ${e}`);let c=l[0],p=l[1],m=l[2],g=l[3],f=l[4],_=l[5],v=[];if(s.length>0){if(g)throw new Error("LoRA adapters are not supported for a session that uses IO binding, e.g. when an output is preferred to be on GPU, or when the WebNN execution provider produces an output.");for(let M of s){let V=Sr.get(M);if(V===void 0)throw new Error(`cannot run inference. invalid LoRA adapter id: ${M}`);v.push(V)}}let $=t.length,b=i.length,k=0,I=[],S=[],E=[],C=[],x=[],O=o.stackSave(),N=o.stackAlloc($*u),R=o.stackAlloc($*u),P=o.stackAlloc(b*u),G=o.stackAlloc(b*u);try{for(let L of s)Lt.set(L,(Lt.get(L)??0)+1);[k,I]=np(a,v),Ft("wasm prepareInputOutputTensor");for(let L=0;L<$;L++)await Fn(r[L],S,C,e,p[t[L]],t[L],f);for(let L=0;L<b;L++)await Fn(n[L],E,C,e,m[i[L]],$+i[L],f);jt("wasm prepareInputOutputTensor");for(let L=0;L<$;L++)o.setValue(N+L*u,S[L],"*"),o.setValue(R+L*u,p[t[L]],"*");for(let L=0;L<b;L++)o.setValue(P+L*u,E[L],"*"),o.setValue(G+L*u,m[i[L]],"*");if(g&&!_){let{handle:L,outputPreferredLocations:ee,outputPreferredLocationsEncoded:J}=g;if(p.length!==$)throw new Error(`input count from feeds (${$}) is expected to be always equal to model's input count (${p.length}).`);Ft("wasm bindInputsOutputs");for(let Z=0;Z<$;Z++){let A=t[Z];await o._OrtBindInput(L,p[A],S[Z])!==0&&Se(`Can't bind input[${Z}] for session=${e}.`)}for(let Z=0;Z<b;Z++){let A=i[Z];n[Z]?.[3]?(x.push(E[Z]),o._OrtBindOutput(L,m[A],E[Z],0)!==0&&Se(`Can't bind pre-allocated output[${Z}] for session=${e}.`)):o._OrtBindOutput(L,m[A],0,J[A])!==0&&Se(`Can't bind output[${Z}] to ${ee[Z]} for session=${e}.`)}jt("wasm bindInputsOutputs"),zt.set(e,[c,p,m,g,f,!0])}o.jsepOnRunStart?.(c),o.webnnOnRunStart?.(c);let M;g?M=await o._OrtRunWithBinding(c,g.handle,b,P,k):M=await o._OrtRun(c,R,N,$,G,b,P,k),M!==0&&Se("failed to call OrtRun().");let V=[],K=[];Ft("wasm ProcessOutputTensor");for(let L=0;L<b;L++){let ee=Number(o.getValue(P+L*u,"*"));if(ee===E[L]||x.includes(E[L])){V.push(n[L]),ee!==E[L]&&o._OrtReleaseTensor(ee)!==0&&Se("Can't release tensor.");continue}let J=o.stackSave(),Z=o.stackAlloc(4*u),A=!1,W,q=0;try{o._OrtGetTensorData(ee,Z,Z+u,Z+2*u,Z+3*u)!==0&&Se(`Can't access output tensor data on index ${L}.`);let j=u===4?"i32":"i64",ue=Number(o.getValue(Z,j));q=o.getValue(Z+u,"*");let ge=o.getValue(Z+u*2,"*"),Y=Number(o.getValue(Z+u*3,j)),ie=[];for(let xe=0;xe<Y;xe++)ie.push(Number(o.getValue(ge+xe*u,j)));o._OrtFree(ge)!==0&&Se("Can't free memory for tensor dims.");let ce=ie.reduce((xe,be)=>xe*be,1);W=kt(ue);let Ie=g?.outputPreferredLocations[i[L]];if(W==="string"){if(Ie==="gpu-buffer"||Ie==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let xe=[];for(let be=0;be<ce;be++){let Me=o.getValue(q+be*u,"*"),de=o.getValue(q+(be+1)*u,"*"),Ne=be===ce-1?void 0:de-Me;xe.push(o.UTF8ToString(Me,Ne))}V.push([W,ie,xe,"cpu"])}else if(Ie==="gpu-buffer"&&ce>0){let xe=o.jsepGetBuffer;if(!xe)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let be=xe(q),Me=Ht(ue,ce);if(Me===void 0||!Ia(W))throw new Error(`Unsupported data type: ${W}`);A=!0,V.push([W,ie,{gpuBuffer:be,download:o.jsepCreateDownloader(be,Me,W),dispose:()=>{o._OrtReleaseTensor(ee)!==0&&Se("Can't release tensor.")}},"gpu-buffer"])}else if(Ie==="ml-tensor"&&ce>0){let xe=o.webnnEnsureTensor,be=o.webnnIsGraphInputOutputTypeSupported;if(!xe||!be)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(Ht(ue,ce)===void 0||!Ta(W))throw new Error(`Unsupported data type: ${W}`);if(!be(e,W,!1))throw new Error(`preferredLocation "ml-tensor" for ${W} output is not supported by current WebNN Context.`);let Me=await xe(e,q,ue,ie,!1);A=!0,V.push([W,ie,{mlTensor:Me,download:o.webnnCreateMLTensorDownloader(q,W),dispose:()=>{o.webnnReleaseTensorId(q),o._OrtReleaseTensor(ee)}},"ml-tensor"])}else if(Ie==="ml-tensor-cpu-output"&&ce>0){let xe=o.webnnCreateMLTensorDownloader(q,W)(),be=V.length;A=!0,K.push((async()=>{let Me=[be,await xe];return o.webnnReleaseTensorId(q),o._OrtReleaseTensor(ee),Me})()),V.push([W,ie,[],"cpu"])}else{let xe=$i(W),be=new xe(ce);new Uint8Array(be.buffer,be.byteOffset,be.byteLength).set(o.HEAPU8.subarray(q,q+be.byteLength)),V.push([W,ie,be,"cpu"])}}finally{o.stackRestore(J),W==="string"&&q&&o._free(q),A||o._OrtReleaseTensor(ee)}}g&&!f&&(o._OrtClearBoundOutputs(g.handle)!==0&&Se("Can't clear bound outputs."),zt.set(e,[c,p,m,g,f,!1]));for(let[L,ee]of await Promise.all(K))V[L][2]=ee;return jt("wasm ProcessOutputTensor"),V}finally{o.webnnOnRunEnd?.(c),o.stackRestore(O),S.forEach(M=>o._OrtReleaseTensor(M)),E.forEach(M=>o._OrtReleaseTensor(M)),C.forEach(M=>o._free(M)),k!==0&&o._OrtReleaseRunOptions(k),I.forEach(M=>o._free(M));for(let M of s){let V=Lt.get(M)-1;V===0?Lt.delete(M):Lt.set(M,V)}}},Fa=e=>{let t=Ee(),r=zt.get(e);if(!r)throw new Error("invalid session id");let i=r[0],n=t._OrtEndProfiling(i);n===0&&Se("Can't get an profile file name."),t._OrtFree(n)},ja=e=>{let t=[];for(let r of e){let i=r[2];!Array.isArray(i)&&"buffer"in i&&t.push(i.buffer)}return t}}),mt,rt,rr,Ir,Tr,oi,jn,ui,Wt,qt,vc,lm,dm,cm,pm,hm,fm,mm,gm,ym,Ka=X(()=>{"use strict";et(),um(),Xt(),va(),Ca(),mt=()=>!!Ce.wasm.proxy&&typeof document<"u",rr=!1,Ir=!1,Tr=!1,ui=new Map,Wt=(e,t)=>{let r=ui.get(e);r?r.push(t):ui.set(e,[t])},qt=()=>{if(rr||!Ir||Tr||!rt)throw new Error("worker not ready")},vc=e=>{switch(e.data.type){case"init-wasm":rr=!1,e.data.err?(Tr=!0,jn[1](e.data.err)):(Ir=!0,jn[0]()),oi&&(URL.revokeObjectURL(oi),oi=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=ui.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}default:}},lm=async()=>{if(!Ir){if(rr)throw new Error("multiple calls to 'initWasm()' detected.");if(Tr)throw new Error("previous call to 'initWasm()' failed.");if(rr=!0,mt())return new Promise((e,t)=>{rt?.terminate(),rp().then(([r,i])=>{try{rt=i,rt.onerror=a=>t(a),rt.onmessage=vc,jn=[e,t];let n={type:"init-wasm",in:Ce};!n.in.wasm.wasmPaths&&(r||ea)&&(n.in.wasm.wasmPaths={wasm:new URL("/assets/ort-wasm-simd-threaded.jsep.wasm",import.meta.url).href}),rt.postMessage(n),oi=r}catch(n){t(n)}},t)});try{await ka(Ce.wasm),await Wa(Ce),Ir=!0}catch(e){throw Tr=!0,e}finally{rr=!1}}},dm=async e=>{if(mt())return qt(),new Promise((t,r)=>{Wt("init-ep",[t,r]);let i={type:"init-ep",in:{epName:e,env:Ce}};rt.postMessage(i)});await qa(Ce,e)},cm=async e=>mt()?(qt(),new Promise((t,r)=>{Wt("copy-from",[t,r]);let i={type:"copy-from",in:{buffer:e}};rt.postMessage(i,[e.buffer])})):bi(e),pm=async(e,t)=>{if(mt()){if(t?.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return qt(),new Promise((r,i)=>{Wt("create",[r,i]);let n={type:"create",in:{model:e,options:{...t}}},a=[];e instanceof Uint8Array&&a.push(e.buffer),rt.postMessage(n,a)})}else return Ga(e,t)},hm=async e=>{if(mt())return qt(),new Promise((t,r)=>{Wt("release",[t,r]);let i={type:"release",in:e};rt.postMessage(i)});Va(e)},fm=async e=>{if(mt())throw new Error("LoRA adapter is not supported for proxy.");let t=typeof e=="string"?await xi(e):e;return sm(t)},mm=async e=>{if(mt())throw new Error("LoRA adapter is not supported for proxy.");om(e)},gm=async(e,t,r,i,n,a,s)=>{if(mt()){if(s.length>0)throw new Error("LoRA adapter is not supported for proxy.");if(r.some(o=>o[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(n.some(o=>o))throw new Error("pre-allocated output tensor is not supported for proxy.");return qt(),new Promise((o,u)=>{Wt("run",[o,u]);let l=r,c={type:"run",in:{sessionId:e,inputIndices:t,inputs:l,outputIndices:i,options:a}};rt.postMessage(c,ja(l))})}else return Ha(e,t,r,i,n,a,s)},ym=async e=>{if(mt())return qt(),new Promise((t,r)=>{Wt("end-profiling",[t,r]);let i={type:"end-profiling",in:e};rt.postMessage(i)});Fa(e)}}),Za,wm=X(()=>{"use strict";et(),Ka(),Za=class{async loadAdapter(e){it(),this.adapterId=await fm(e),Qe()}async dispose(){return mm(this.adapterId)}}}),Kn,kc,_m,Qy=X(()=>{"use strict";et(),wm(),Ka(),le(),xa(),Ca(),Kn=(e,t)=>{switch(e.location){case"cpu":return[e.type,e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[e.type,e.dims,{mlTensor:e.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${e.location} for ${t()}`)}},kc=e=>{switch(e[3]){case"cpu":return new Fe(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!Ia(t))throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:r,download:i,dispose:n}=e[2];return Fe.fromGpuBuffer(r,{dataType:t,dims:e[1],download:i,dispose:n})}case"ml-tensor":{let t=e[0];if(!Ta(t))throw new Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:r,download:i,dispose:n}=e[2];return Fe.fromMLTensor(r,{dataType:t,dims:e[1],download:i,dispose:n})}default:throw new Error(`invalid data location: ${e[3]}`)}},_m=class{async fetchModelAndCopyToWasmMemory(e){return cm(await xi(e))}async loadModel(e,t){it();let r;typeof e=="string"?r=await this.fetchModelAndCopyToWasmMemory(e):r=e,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await pm(r,t),Qe()}async dispose(){return hm(this.sessionId)}async run(e,t,r,i=[]){it();let n=i.map(g=>{if(!(g instanceof Za))throw new Error("LoRA adapter was not created by the WebAssembly backend.");return g.adapterId}),a=[],s=[];Object.entries(e).forEach(g=>{let f=g[0],_=g[1],v=this.inputNames.indexOf(f);if(v===-1)throw new Error(`invalid input '${f}'`);a.push(_),s.push(v)});let o=[],u=[];Object.entries(t).forEach(g=>{let f=g[0],_=g[1],v=this.outputNames.indexOf(f);if(v===-1)throw new Error(`invalid output '${f}'`);o.push(_),u.push(v)});let l=a.map((g,f)=>Kn(g,()=>`input "${this.inputNames[s[f]]}"`)),c=o.map((g,f)=>g?Kn(g,()=>`output "${this.outputNames[u[f]]}"`):null),p=await gm(this.sessionId,s,l,u,c,r,n),m={};for(let g=0;g<p.length;g++)m[this.outputNames[u[g]]]=o[g]??kc(p[g]);return Qe(),m}startProfiling(){}endProfiling(){ym(this.sessionId)}}}),bm,Jy=X(()=>{"use strict";bm=e=>{if(e?.epContextDataRead)throw new Error('session option "epContextDataRead" is not supported by ONNX Runtime Web')}}),$m={};hr($m,{OnnxruntimeWebAssemblyBackend:()=>fa,initializeFlags:()=>ha,wasmBackend:()=>xm});var ha,fa,xm,e1=X(()=>{"use strict";et(),wm(),Ka(),Qy(),Jy(),ha=()=>{(typeof Ce.wasm.initTimeout!="number"||Ce.wasm.initTimeout<0)&&(Ce.wasm.initTimeout=0);let e=Ce.wasm.simd;if(typeof e!="boolean"&&e!==void 0&&e!=="fixed"&&e!=="relaxed"&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` and ignore SIMD feature checking.`),Ce.wasm.simd=!1),typeof Ce.wasm.proxy!="boolean"&&(Ce.wasm.proxy=!1),typeof Ce.wasm.trace!="boolean"&&(Ce.wasm.trace=!1),typeof Ce.wasm.numThreads!="number"||!Number.isInteger(Ce.wasm.numThreads)||Ce.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)Ce.wasm.numThreads=1;else{let t=typeof navigator>"u"?D0("node:os").cpus().length:navigator.hardwareConcurrency;Ce.wasm.numThreads=Math.min(4,Math.ceil((t||1)/2))}},fa=class{async init(e){ha(),await lm(),await dm(e)}async createInferenceSessionHandler(e,t){bm(t);let r=new _m;return await r.loadModel(e,t),r}async createLoraAdapterHandler(e){let t=new Za;return await t.loadAdapter(e),t}},xm=new fa});et();et();et();var t1="1.31.1";{let e=(e1(),Rr($m)).wasmBackend;ar("webgpu",e,5),ar("webnn",e,5),ar("cpu",e,10),ar("wasm",e,10)}Object.defineProperty(Ce.versions,"web",{value:t1,enumerable:!0});/**
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
 */class lr{static calculateDetResize(t,r,i=1920){const n=Math.max(t,r);let a=n>i?i/n:1,s=Math.max(32,Math.round(t*a/32)*32),o=Math.max(32,Math.round(r*a/32)*32);return{targetW:s,targetH:o,ratioW:s/t,ratioH:o/r}}static imageToDetTensor(t,r,i){const n=[.485,.456,.406],a=[.229,.224,.225],s=new Float32Array(3*i*r),o=t.data,u=i*r;for(let l=0;l<i;l++)for(let c=0;c<r;c++){const p=(l*r+c)*4,m=l*r+c,g=(o[p]/255-n[0])/a[0],f=(o[p+1]/255-n[1])/a[1],_=(o[p+2]/255-n[2])/a[2];s[m]=g,s[m+u]=f,s[m+u*2]=_}return new Fe("float32",s,[1,3,i,r])}static imageToRecTensor(t,r,i){const n=new Float32Array(3*i*r),a=t.data,s=i*r;for(let o=0;o<i;o++)for(let u=0;u<r;u++){const l=(o*r+u)*4,c=o*r+u,p=(a[l]/255-.5)/.5,m=(a[l+1]/255-.5)/.5,g=(a[l+2]/255-.5)/.5;n[c]=p,n[c+s]=m,n[c+s*2]=g}return new Fe("float32",n,[1,3,i,r])}static imageToRecTensorBatch(t,r,i){const n=i*r,a=new Float32Array(t.length*3*n);for(let s=0;s<t.length;s++){const o=t[s],u=Math.min(o.width,r),l=s*3*n;for(let c=0;c<i;c++)for(let p=0;p<u;p++){const m=(c*o.width+p)*4,g=l+c*r+p;a[g]=(o.data[m]/255-.5)/.5,a[g+n]=(o.data[m+1]/255-.5)/.5,a[g+n*2]=(o.data[m+2]/255-.5)/.5}}return new Fe("float32",a,[t.length,3,i,r])}static clampBox(t,r,i){const n=Math.max(0,Math.min(t.x,r-1)),a=Math.max(0,Math.min(t.y,i-1)),s=Math.max(1,Math.min(t.width,r-n)),o=Math.max(1,Math.min(t.height,i-a));return{x:n,y:a,width:s,height:o,confidence:t.confidence}}}class ma{static segmentLines(t,r,i,n){try{const s=t.getImageData(r.x,r.y,r.width,r.height).data,o=r.width,u=r.height,l=new Int32Array(256),c=R=>(s[R*4]*299+s[R*4+1]*587+s[R*4+2]*114)/1e3,p=o*u;for(let R=0;R<p;R++)l[Math.round(c(R))]++;let m=0;for(let R=0;R<256;R++)m+=R*l[R];let g=0,f=0,_=-1,v=128;for(let R=0;R<256;R++){if(f+=l[R],f===0)continue;const P=p-f;if(P===0)break;g+=R*l[R];const G=g/f,M=(m-g)/P,V=f*P*(G-M)*(G-M);V>_&&(_=V,v=R)}let $=0;for(let R=0;R<=v;R++)$+=l[R];const b=$<=p/2,k=R=>b?R<=v:R>v,I=Math.round(o*.08),S=new Int32Array(u);for(let R=0;R<u;R++){let P=0;const G=R*o;for(let M=I;M<o-I;M++)k(c(G+M))&&P++;S[R]=P}const E=Math.max(4,Math.round(o*.03)),C=[];let x=!1,O=0;for(let R=0;R<u;R++){const P=S[R]>=E;if(P&&!x)x=!0,O=R;else if(!P&&x){x=!1;const G=R-O;G>=11&&C.push({startY:O,height:G})}}if(x){const R=u-O;R>=11&&C.push({startY:O,height:R})}if(C.length<=1)return[r];const N=[];if(!b){const P=Math.ceil(o/8),G=Math.ceil(u/8),M=new Int32Array(P*G),V=new Int32Array(P*G);for(let Z=0;Z<u;Z++){const A=Z/8|0,W=Z*o;for(let q=0;q<o;q++){const j=A*P+(q/8|0);V[j]++,k(c(W+q))&&M[j]++}}const K=new Uint8Array(P*G);for(let Z=0;Z<P*G;Z++)V[Z]>0&&M[Z]/V[Z]>=.85&&(K[Z]=1);const L=new Int16Array(P*G).fill(-1);let ee=0;const J=[];for(let Z=0;Z<P*G;Z++){if(!K[Z]||L[Z]>=0)continue;let A=P,W=-1,q=G,j=-1;const ue=[Z];for(L[Z]=ee;ue.length;){const ge=ue.pop(),Y=ge/P|0,ie=ge%P;ie<A&&(A=ie),ie>W&&(W=ie),Y<q&&(q=Y),Y>j&&(j=Y);const ce=[Y>0?ge-P:-1,Y<G-1?ge+P:-1,ie>0?ge-1:-1,ie<P-1?ge+1:-1];for(const Ie of ce)Ie>=0&&K[Ie]&&L[Ie]<0&&(L[Ie]=ee,ue.push(Ie))}J.push({cx0:A,cx1:W,cy0:q,cy1:j}),ee++}for(const Z of J)Z.cx1-Z.cx0+1>=4&&Z.cy1-Z.cy0+1>=4&&N.push({x0:Z.cx0*8,x1:Math.min(o-1,(Z.cx1+1)*8),y0:Z.cy0*8,y1:Math.min(u-1,(Z.cy1+1)*8)})}return C.flatMap(R=>{const P=R.startY,G=R.startY+R.height,M=N.filter(A=>A.y0<G&&A.y1>P),V=new Uint8Array(o);for(let A=0;A<R.height;A++){const q=(R.startY+A)*o;for(let j=0;j<o;j++)k(c(q+j))&&(V[j]=1)}for(const A of M)for(let W=A.x0;W<=A.x1&&W<o;W++)V[W]=0;let K=o,L=-1;for(let A=0;A<o;A++)V[A]&&(A<K&&(K=A),A>L&&(L=A));let ee;if(K>L)ee=[{x0:0,x1:o-1}];else{ee=[{x0:K,x1:L}];for(const A of M){const W=[];for(const q of ee){if(A.x1<q.x0||A.x0>q.x1){W.push(q);continue}A.x0>q.x0&&W.push({x0:q.x0,x1:A.x0-1}),A.x1<q.x1&&W.push({x0:A.x1+1,x1:q.x1})}ee=W}ee.length===0&&ee.push({x0:0,x1:o-1})}M.length===0&&ee.length===1&&ee[0].x1-ee[0].x0<o*.5&&(ee[0]={x0:0,x1:o-1});const J=6,Z=ee.filter(A=>A.x1-A.x0>=10);return Z.length===0&&Z.push({x0:0,x1:o-1}),Z.map(A=>{const W=lr.clampBox({x:Math.max(r.x,r.x+A.x0-J),y:r.y+R.startY,width:A.x1-A.x0+1+J*2,height:R.height,confidence:r.confidence},i,n);return W.kind=r.kind,W})})}catch{return[r]}}}class Sc{session;inputSize=640;textBubbleThresh=.15;textFreeThresh=.07;bubbleFallbackThresh=.3;constructor(t){this.session=t}async release(){await this.session.release?.()}async detectText(t,r,i){const a=new OffscreenCanvas(this.inputSize,this.inputSize).getContext("2d");if(!a)throw new Error("Không thể tạo context 2D cho ComicDetEngine");a.drawImage(t,0,0,this.inputSize,this.inputSize);const o=a.getImageData(0,0,this.inputSize,this.inputSize).data,u=this.inputSize*this.inputSize,l=new Float32Array(3*u);for(let C=0;C<u;C++){const x=C*4;l[C]=o[x]/255,l[u+C]=o[x+1]/255,l[2*u+C]=o[x+2]/255}const c=new Fe("float32",l,[1,3,this.inputSize,this.inputSize]),p=new Fe("int64",new BigInt64Array([BigInt(r),BigInt(i)]),[1,2]),m={images:c,orig_target_sizes:p};let g=null,f,_,v;try{g=await this.session.run(m),f=Array.from(g.labels.data),_=new Float32Array(g.boxes.data),v=new Float32Array(g.scores.data)}finally{if(c.dispose?.(),p.dispose?.(),g)for(const C of Object.values(g))C.dispose?.()}const $=v.length,b=[],k=[];for(let C=0;C<$;C++){const x=v[C],O=Number(f[C]),N=Math.max(0,Math.round(_[C*4+0])),R=Math.max(0,Math.round(_[C*4+1])),P=Math.min(r,Math.round(_[C*4+2])),G=Math.min(i,Math.round(_[C*4+3])),M=P-N,V=G-R;if(M<8||V<8||M>=r*.98&&V>=i*.95)continue;const K={x:N,y:R,width:M,height:V,confidence:x};O===1&&x>=this.textBubbleThresh?(K.kind="dialogue",b.push(K)):O===2&&x>=this.textFreeThresh?(K.kind="sfx",b.push(K)):O===0&&x>=this.bubbleFallbackThresh&&k.push(K)}for(const C of k)if(!b.some(O=>O.x>=C.x-12&&O.y>=C.y-12&&O.x+O.width<=C.x+C.width+12&&O.y+O.height<=C.y+C.height+12)){const O=Math.round(C.width*.08),N=Math.round(C.height*.08);b.push({x:C.x+O,y:C.y+N,width:Math.max(12,C.width-O*2),height:Math.max(12,C.height-N*2),confidence:C.confidence,kind:"dialogue"})}const I=b,S=[],E=t.getContext("2d");for(const C of I){if(C.height>=34&&C.width>=28&&E){const x=ma.segmentLines(E,C,r,i);if(x.length>0){S.push(...x);continue}}S.push(C)}return S.sort((C,x)=>C.y-x.y)}}class vt{static shouldWarp(t){return typeof t=="number"&&Math.abs(t)>=10}static minAreaQuad(t){if(t.length<3){const[c=0,p=0]=t[0]||[];return{quad:[[c,p],[c+1,p],[c+1,p+1],[c,p+1]],angleDeg:0}}const r=this.convexHull(t);if(r.length<3){let c=1/0,p=1/0,m=-1/0,g=-1/0;for(const[f,_]of t)f<c&&(c=f),f>m&&(m=f),_<p&&(p=_),_>g&&(g=_);return{quad:[[c,p],[m,p],[m,g],[c,g]],angleDeg:0}}let i=1/0,n=[];for(let c=0;c<r.length;c++){const[p,m]=r[c],[g,f]=r[(c+1)%r.length],_=g-p,v=f-m,$=Math.hypot(_,v);if($<1e-6)continue;const b=_/$,k=v/$,I=-k,S=b;let E=1/0,C=-1/0,x=1/0,O=-1/0;for(const[R,P]of r){const G=R*b+P*k,M=R*I+P*S;G<E&&(E=G),G>C&&(C=G),M<x&&(x=M),M>O&&(O=M)}const N=(C-E)*(O-x);N<i&&(i=N,n=[[E*b+x*I,E*k+x*S],[C*b+x*I,C*k+x*S],[C*b+O*I,C*k+O*S],[E*b+O*I,E*k+O*S]])}const a=this.orderCornersTLTRBRBL(n),s=Math.hypot(a[1][0]-a[0][0],a[1][1]-a[0][1]),o=Math.hypot(a[3][0]-a[0][0],a[3][1]-a[0][1]);let u;s>=o?u=Math.atan2(a[1][1]-a[0][1],a[1][0]-a[0][0]):u=Math.atan2(a[2][1]-a[1][1],a[2][0]-a[1][0])-Math.PI/2;let l=u*180/Math.PI;for(;l>45;)l-=90;for(;l<-45;)l+=90;return{quad:a,angleDeg:l}}static unclipQuad(t,r){const i=Math.hypot(t[1][0]-t[0][0],t[1][1]-t[0][1]),n=Math.hypot(t[3][0]-t[0][0],t[3][1]-t[0][1]),a=i*n,s=Math.max(1,2*(i+n)),o=Math.max(3,Math.min(18,a*r/s)),u=(t[0][0]+t[1][0]+t[2][0]+t[3][0])*.25,l=(t[0][1]+t[1][1]+t[2][1]+t[3][1])*.25,c=i>1e-6?(t[1][0]-t[0][0])/i:1,p=i>1e-6?(t[1][1]-t[0][1])/i:0,m=n>1e-6?(t[3][0]-t[0][0])/n:0,g=n>1e-6?(t[3][1]-t[0][1])/n:1,f=i*.5+o,_=n*.5+o;return[[u-f*c-_*m,l-f*p-_*g],[u+f*c-_*m,l+f*p-_*g],[u+f*c+_*m,l+f*p+_*g],[u-f*c+_*m,l-f*p+_*g]]}static warpQuadToHorizontal(t,r){const i=Math.hypot(r[1][0]-r[0][0],r[1][1]-r[0][1]),n=Math.hypot(r[2][0]-r[3][0],r[2][1]-r[3][1]),a=Math.hypot(r[3][0]-r[0][0],r[3][1]-r[0][1]),s=Math.hypot(r[2][0]-r[1][0],r[2][1]-r[1][1]),o=Math.max(4,Math.round((i+n)*.5)),u=Math.max(4,Math.round((a+s)*.5));if(o<4||u<4)return null;const l=new Uint8ClampedArray(o*u*4),{data:c,width:p,height:m}=t;for(let g=0;g<u;g++){const f=u>1?g/(u-1):0,_=r[0][0]+(r[3][0]-r[0][0])*f,v=r[0][1]+(r[3][1]-r[0][1])*f,$=r[1][0]+(r[2][0]-r[1][0])*f,b=r[1][1]+(r[2][1]-r[1][1])*f;for(let k=0;k<o;k++){const I=o>1?k/(o-1):0,S=Math.max(0,Math.min(p-1.001,_+($-_)*I)),E=Math.max(0,Math.min(m-1.001,v+(b-v)*I)),C=S|0,x=E|0,O=S-C,N=E-x,R=Math.min(p-1,C+1),P=Math.min(m-1,x+1),G=(x*p+C)*4,M=(x*p+R)*4,V=(P*p+C)*4,K=(P*p+R)*4,L=(1-O)*(1-N),ee=O*(1-N),J=(1-O)*N,Z=O*N,A=(g*o+k)*4;l[A]=c[G]*L+c[M]*ee+c[V]*J+c[K]*Z,l[A+1]=c[G+1]*L+c[M+1]*ee+c[V+1]*J+c[K+1]*Z,l[A+2]=c[G+2]*L+c[M+2]*ee+c[V+2]*J+c[K+2]*Z,l[A+3]=255}}return{data:l,width:o,height:u}}static pointInQuad(t,r,i){if(i.length<4)return!0;let n=0,a=0;for(let s=0;s<4;s++){const[o,u]=i[s],[l,c]=i[s+1&3],p=(l-o)*(r-u)-(c-u)*(t-o);if(p>1e-6?n++:p<-1e-6&&a++,n>0&&a>0)return!1}return!0}static convexHull(t){const r=[...t].sort((s,o)=>s[0]!==o[0]?s[0]-o[0]:s[1]-o[1]),i=(s,o,u)=>(o[0]-s[0])*(u[1]-s[1])-(o[1]-s[1])*(u[0]-s[0]),n=[];for(const s of r){for(;n.length>=2&&i(n[n.length-2],n[n.length-1],s)<=0;)n.pop();n.push(s)}const a=[];for(let s=r.length-1;s>=0;s--){const o=r[s];for(;a.length>=2&&i(a[a.length-2],a[a.length-1],o)<=0;)a.pop();a.push(o)}return n.pop(),a.pop(),n.concat(a)}static orderCornersTLTRBRBL(t){const r=[...t].sort((a,s)=>a[1]-s[1]),i=r.slice(0,2).sort((a,s)=>a[0]-s[0]),n=r.slice(2,4).sort((a,s)=>a[0]-s[0]);return[i[0],i[1],n[1],n[0]]}}class Ic{session;thresh=.2;boxThresh=.22;unclipRatio=1.65;lastProbMap=null;constructor(t,r){this.session=t,r?.thresh!==void 0&&(this.thresh=r.thresh),r?.boxThresh!==void 0&&(this.boxThresh=r.boxThresh),r?.unclipRatio!==void 0&&(this.unclipRatio=r.unclipRatio)}async release(){await this.session.release?.()}async detectText(t,r,i){const{targetW:n,targetH:a,ratioW:s,ratioH:o}=lr.calculateDetResize(r,i),l=new OffscreenCanvas(n,a).getContext("2d");if(!l)throw new Error("Khong the khoi tao OffscreenCanvas 2D context");l.drawImage(t,0,0,n,a);const c=l.getImageData(0,0,n,a),p=lr.imageToDetTensor(c,n,a),m={},g=this.session.inputNames[0]||"x";m[g]=p;let f=null,_;try{f=await this.session.run(m);const k=this.session.outputNames[0],I=f[k];_=new Float32Array(I.data)}finally{if(p.dispose?.(),f)for(const k of Object.values(f))k.dispose?.()}this.lastProbMap={data:_,w:n,h:a,ratioW:s,ratioH:o};const v=this.extractBoxes(_,n,a),$=[];for(const k of v){if(k.confidence&&k.confidence<this.boxThresh)continue;let I,S,E,C,x;if(k.quad&&vt.shouldWarp(k.angleDeg)){const P=k.quad.map(([K,L])=>[K/s,L/o]);x=vt.unclipQuad(P,this.unclipRatio).map(([K,L])=>[Math.max(0,Math.min(r-1,Math.round(K))),Math.max(0,Math.min(i-1,Math.round(L)))]);const M=x.map(K=>K[0]),V=x.map(K=>K[1]);I=Math.min(...M),S=Math.min(...V),E=Math.max(...M)-I,C=Math.max(...V)-S}else{const P=k.width*k.height,G=2*(k.width+k.height),M=Math.max(3,Math.min(18,P*this.unclipRatio/Math.max(1,G))),V=k.x+k.width/2,K=k.y+k.height/2,L=k.width+M*2,ee=k.height+M*2;I=Math.round((V-L/2)/s),S=Math.round((K-ee/2)/o),E=Math.round(L/s),C=Math.round(ee/o)}const O=lr.clampBox({x:I,y:S,width:E,height:C,confidence:k.confidence},r,i);O.kind=k.kind,x&&(O.quad=x,O.angleDeg=k.angleDeg);const N=O.width<8||O.height<8,R=O.width>=r*.98&&O.height>=i*.94;!N&&!R&&$.push(O)}return this.mergeHorizontalBoxes($,r).sort((k,I)=>k.y-I.y)}mergeHorizontalBoxes(t,r){if(t.length<=1)return t;let i=[...t],n=!0;for(;n;){n=!1;const a=[],s=new Set;for(let o=0;o<i.length;o++){if(s.has(o))continue;let u={...i[o]};for(let l=o+1;l<i.length;l++){if(s.has(l))continue;const c=i[l];if(vt.shouldWarp(u.angleDeg)||vt.shouldWarp(c.angleDeg))continue;const p=u.y,m=u.y+u.height,g=c.y,f=c.y+c.height,_=Math.max(0,Math.min(m,f)-Math.max(p,g)),v=Math.min(u.height,c.height);if(_/Math.max(1,v)>=.4){const b=u.x,k=u.x+u.width,I=c.x,S=c.x+c.width,E=Math.max(0,Math.max(b,I)-Math.min(k,S)),C=Math.max(u.height,c.height)*.85,x=Math.min(b,I),N=Math.max(k,S)-x;if(E<=C&&N<=r*.96){const R=Math.min(p,g),P=Math.max(m,f);u={x,y:R,width:N,height:P-R,confidence:Math.max(u.confidence||0,c.confidence||0),kind:u.kind??c.kind},s.add(l),n=!0}}}a.push(u)}i=a}return i}extractBoxes(t,r,i){const n=new Uint8Array(r*i),a=[];for(let s=0;s<i;s++)for(let o=0;o<r;o++){const u=s*r+o;if(n[u]||t[u]<this.thresh)continue;let l=o,c=o,p=s,m=s,g=0,f=0;const _=[],v=[u];for(n[u]=1;v.length>0;){const k=v.pop(),I=Math.floor(k/r),S=k%r;g+=t[k],f++,S<l&&(l=S),S>c&&(c=S),I<p&&(p=I),I>m&&(m=I);const E=[I>0?(I-1)*r+S:-1,I<i-1?(I+1)*r+S:-1,S>0?I*r+(S-1):-1,S<r-1?I*r+(S+1):-1];let C=!1;for(const x of E)x<0||t[x]<this.thresh?C=!0:n[x]||(n[x]=1,v.push(x));C&&_.length<512&&_.push([S,I])}const $=c-l+1,b=m-p+1;if($>=5&&b>=5&&f>=6){const k={x:l,y:p,width:$,height:b,confidence:g/f,kind:"dialogue"};if(_.length>=8){const{quad:I,angleDeg:S}=vt.minAreaQuad(_);vt.shouldWarp(S)&&(k.quad=I,k.angleDeg=S)}a.push(k)}}return a}}class r1{static analyzeRegion(t,r=.18){const i=t.width,n=t.height;if(i<=0||n<=0||t.data.length<i*n*4)return{isDark:!1,bgHex:"#ffffff",luma:255,lumaStdDev:0};const a=Math.max(1,Math.round(Math.min(i,n)*r)),s=[],o=[],u=[],l=[],c=(v,$)=>{const b=($*i+v)*4,k=t.data[b],I=t.data[b+1],S=t.data[b+2];s.push(k),o.push(I),u.push(S),l.push(.299*k+.587*I+.114*S)};for(let v=0;v<i;v+=3)for(let $=0;$<a;$++)c(v,$),c(v,n-1-$);for(let v=a;v<n-a;v+=3)for(let $=0;$<a;$++)c($,v),c(i-1-$,v);if(l.length===0)return{isDark:!1,bgHex:"#ffffff",luma:255,lumaStdDev:0};const p=Zn(s),m=Zn(o),g=Zn(u),f=l.reduce((v,$)=>v+$,0)/l.length,_=l.reduce((v,$)=>v+($-f)*($-f),0)/l.length;return{isDark:f<105,bgHex:`#${Yn(p)}${Yn(m)}${Yn(g)}`,luma:f,lumaStdDev:Math.sqrt(_)}}}function Zn(e){const t=e.slice().sort((i,n)=>i-n),r=t.length>>1;return t.length%2===0?Math.round((t[r-1]+t[r])/2):t[r]}function Yn(e){return Math.max(0,Math.min(255,e)).toString(16).padStart(2,"0")}class Or{static BUCKETS=[64,128,256,512,960];static MAX_BATCH=8;static assignBuckets(t,r=Or.BUCKETS){const i=new Map,n=r[r.length-1];for(let a=0;a<t.length;a++){let s=n;for(const u of r)if(t[a]<=u){s=u;break}const o=i.get(s);o?o.push(a):i.set(s,[a])}return i}static concatTensors(t,r,i,n){const a=n*i,s=new Float32Array(t.length*3*a);for(let o=0;o<t.length;o++){const u=Math.min(r[o],i),l=n*u,c=o*3*a;for(let p=0;p<3;p++){const m=p*l,g=c+p*a;for(let f=0;f<n;f++)s.set(t[o].subarray(m+f*u,m+f*u+u),g+f*i)}}return s}}function i1(e){const t=e.replace(/(?:\r?\n)+$/,"");if(!t)return[" "];const r=t.split(/\r?\n/);for(;r.length>0&&r[0]==="";)r.shift();return r.length===0?[" "]:(r[r.length-1]!==" "&&r.push(" "),r)}class Br{session;characters;targetH=48;isCjkModel;batchSupported=!0;constructor(t,r,i){this.session=t,this.isCjkModel=i?.isCjkModel??!1,this.characters=i1(r)}async release(){await this.session.release?.()}async recognizeBoxes(t,r){if(!t.getContext("2d"))return[];const n=[];for(let o=0;o<r.length;o++){const u=this.prepareCrop(t,r[o],o);u&&n.push(u)}const a=this.session.inputNames[0]||"x";if(this.batchSupported)try{await this.runBatched(n,a)}catch(o){this.batchSupported=!1,console.warn("[SpeedySlate] Rec batch inference unsupported, using sequential path:",o)}this.batchSupported||await this.runSequential(n,a),await this.retryLowConfidence(n,a);const s=[];for(const o of n){if(!o.decoded)continue;const u=o.text.replace(/\s+/g," ").trim(),l=/[\p{L}\p{N}]/u.test(u),c=u.length<=2&&o.confidence<.65;u.length>0&&l&&!c&&o.confidence>.28&&s.push({id:`bubble-${Date.now()}-${o.index}`,box:o.box,originalText:u,isDarkBackground:o.isDark,confidence:o.confidence,bgColor:o.bgColor,kind:o.box.kind??"dialogue",...o.isVertical?{isVertical:!0}:{}})}return s}prepareCrop(t,r,i){const s=Math.max(0,r.x-5),o=Math.max(0,r.y-2),u=Math.max(1,Math.min(t.width-s,r.width+10)),l=Math.max(1,Math.min(t.height-o,r.height+4));let c=new OffscreenCanvas(u,l),p=c.getContext("2d");if(!p)return null;p.drawImage(t,s,o,u,l,0,0,u,l);let m=p.getImageData(0,0,u,l);if(r.quad&&r.quad.length===4&&vt.shouldWarp(r.angleDeg)){const x=r.quad.map(([N,R])=>[N-s,R-o]),O=vt.warpQuadToHorizontal(m,x);if(O){if(c=new OffscreenCanvas(O.width,O.height),p=c.getContext("2d"),!p)return null;m=new ImageData(new Uint8ClampedArray(O.data),O.width,O.height),p.putImageData(m,0,0)}}m.width>=16&&m.height>=12&&(Br.cleanCropToMask(m),p.putImageData(m,0,0));const g=Lo.isVerticalCandidate(r,this.isCjkModel);let f=m.width,_=m.height,v=null;if(g){const x=Lo.rotateCropCCW(m);v=new OffscreenCanvas(x.width,x.height);const O=v.getContext("2d");if(!O)return null;const N=new Uint8ClampedArray(x.data);O.putImageData(new ImageData(N,x.width,x.height),0,0),f=x.width,_=x.height}const $=f/_;let b=Math.max(32,Math.min(960,Math.round(this.targetH*$)));b=Math.round(b/8)*8;const I=new OffscreenCanvas(b,this.targetH).getContext("2d");if(!I)return null;v?I.drawImage(v,0,0,f,_,0,0,b,this.targetH):I.drawImage(c,0,0,f,_,0,0,b,this.targetH);const S=I.getImageData(0,0,b,this.targetH),E=r1.analyzeRegion(S),C=E.isDark;return C&&Br.invertRgb(S.data),{index:i,box:r,imageData:S,targetW:b,inverted:C,isDark:E.isDark,bgColor:E.bgHex,isVertical:g,text:"",confidence:0,decoded:!1}}async runBatched(t,r){const i=Or.assignBuckets(t.map(n=>n.targetW));for(const[n,a]of i)for(let s=0;s<a.length;s+=Or.MAX_BATCH){const o=a.slice(s,s+Or.MAX_BATCH).map(c=>t[c]),u=lr.imageToRecTensorBatch(o.map(c=>c.imageData),n,this.targetH);let l=null;try{l=await this.session.run({[r]:u});const c=l[this.session.outputNames[0]],p=c.dims;if(p.length!==3)throw new Error(`Unexpected rec output dims: ${p.join("x")}`);const m=p[1],g=p[2],f=m*g,_=c.data;for(let v=0;v<o.length;v++){const $=_.subarray(v*f,(v+1)*f),b=this.ctcDecode($,[1,m,g]);o[v].text=b.text,o[v].confidence=b.confidence,o[v].decoded=!0}}finally{if(u.dispose?.(),l)for(const c of Object.values(l))c.dispose?.()}}}async runSequential(t,r){for(const i of t)if(!i.decoded)try{const n=await this.runSingle(i,r);i.text=n.text,i.confidence=n.confidence,i.decoded=!0}catch(n){console.warn("[SpeedySlate] Rec inference error for box:",n)}}async runSingle(t,r){const i=lr.imageToRecTensor(t.imageData,t.targetW,this.targetH);let n=null;try{n=await this.session.run({[r]:i});const a=n[this.session.outputNames[0]];return this.ctcDecode(a.data,a.dims)}finally{if(i.dispose?.(),n)for(const a of Object.values(n))a.dispose?.()}}async retryLowConfidence(t,r){for(const i of t){if(!i.decoded||i.confidence>=.45)continue;const n=new ImageData(new Uint8ClampedArray(i.imageData.data),i.imageData.width,i.imageData.height);Br.invertRgb(n.data);try{const a=await this.runSingle({...i,imageData:n},r);a.confidence>i.confidence&&(i.text=a.text,i.confidence=a.confidence,i.inverted=!i.inverted)}catch(a){console.warn("[SpeedySlate] Rec retry error for box:",a)}}}static cleanCropToMask(t){const r=t.data,i=t.width*t.height,n=new Uint8Array(i),a=new Int32Array(256);for(let R=0;R<i;R++){const P=R*4,M=(r[P]*299+r[P+1]*587+r[P+2]*114)/1e3|0;n[R]=M,a[M]++}let s=0;for(let R=0;R<256;R++)s+=R*a[R];let o=0,u=0,l=-1,c=128;for(let R=0;R<256;R++){if(u+=a[R],u===0)continue;const P=i-u;if(P===0)break;o+=R*a[R];const G=o/u,M=(s-o)/P,V=u*P*(G-M)*(G-M);V>l&&(l=V,c=R)}let p=0;for(let R=0;R<=c;R++)p+=a[R];if(c<20||c>235)return;const m=Math.min(p,i-p);if(m<i*.02||m>i*.45)return;const g=p<=i/2;let f=0,_=0,v=0,$=0,b=0,k=0;for(let R=0;R<i;R++){if(g?n[R]<=c:n[R]>c)continue;const G=R*4;f+=r[G],_+=r[G+1],v+=r[G+2],$+=n[R],b+=n[R]*n[R],k++}if(k===0||Math.sqrt(Math.max(0,b/k-($/k)**2))<=30)return;const S=f/k,E=_/k,C=v/k,x=t.width,O=t.height,N=new Uint8Array(i);for(let R=0;R<i;R++)N[R]=(g?n[R]<=c:n[R]>c)?1:0;for(let R=0;R<O;R++)for(let P=0;P<x;P++){const G=R*x+P;if(N[G]){let V=0;for(let K=-1;K<=1;K++)for(let L=-1;L<=1;L++){if(!L&&!K)continue;const ee=P+L,J=R+K;ee>=0&&ee<x&&J>=0&&J<O&&N[J*x+ee]&&V++}if(V>=3)continue}const M=G*4;r[M]=S,r[M+1]=E,r[M+2]=C}}static invertRgb(t){for(let r=0;r<t.length;r+=4)t[r]=255-t[r],t[r+1]=255-t[r+1],t[r+2]=255-t[r+2]}ctcDecode(t,r){let i=0,n=0;if(r.length===3)i=r[1],n=r[2];else return{text:"",confidence:0};let a=[],s=-1,o=0,u=0;for(let c=0;c<i;c++){let p=-1/0,m=0;const g=c*n;for(let f=0;f<n;f++){const _=t[g+f];_>p&&(p=_,m=f)}if(m!==0&&m!==s){const f=m-1;f<this.characters.length&&(a.push(this.characters[f]),o+=p,u++)}s=m}const l=u>0?o/u:0;return{text:a.join(""),confidence:l}}}class Xn{static computeSliceHeights(t,r,i={}){const n=i.maxSliceHeight??2e3,a=i.overlap??200,s=i.aspectCap!==void 0?Math.min(n,Math.max(640,Math.round(t*i.aspectCap))):n;if(r<=s+200)return[{startY:0,h:r}];const o=Math.max(1,s-a),u=[];for(let l=0;l<r;l+=o)u.push({startY:l,h:Math.min(s,r-l)});return u}static async detectWithSlicing(t,r,i,n,a={}){const s=this.computeSliceHeights(r,i,a),o=await this.detectSlices(t,r,i,n,s,a.overlap??200,a.textMapOut);if(a.invertedPass){const u=this.findDarkRanges(t,r,i,o);if(u.length>0){const l=this.buildInverted(t,r,i),c=await this.detectSlices(l,r,i,n,u,0,a.textMapOut);for(const p of c)o.some(g=>this.calculateIoU(g,p)>.5)||o.push(p)}}return o.sort((u,l)=>u.y-l.y)}static async detectSlices(t,r,i,n,a,s,o){if(a.length===1&&a[0].h===i){const l=await n.detectText(t,r,i);return this.blitProbMap(n,o,r,0),l}const u=[];for(const l of a){const c=new OffscreenCanvas(r,l.h),p=c.getContext("2d");if(!p)continue;p.drawImage(t,0,l.startY,r,l.h,0,0,r,l.h);const m=await n.detectText(c,r,l.h);this.blitProbMap(n,o,r,l.startY);for(const g of m){const f={x:g.x,y:l.startY+g.y,width:g.width,height:g.height,confidence:g.confidence,kind:g.kind,...g.quad?{quad:g.quad.map(([_,v])=>[_,l.startY+v]),angleDeg:g.angleDeg}:{}};l.startY>0&&g.y<s+40&&u.some(v=>this.calculateIoU(v,f)>.35)||u.push(f)}}return u}static blitProbMap(t,r,i,n){const a=t.lastProbMap;if(!a||!r)return;const s=Math.round(a.h/a.ratioH),o=Math.min(i,Math.round(a.w/a.ratioW));for(let u=0;u<s;u++){const l=n+u;if(l*i>=r.length)break;const c=Math.min(a.h-1,Math.floor(u*a.ratioH)),p=l*i,m=c*a.w;for(let g=0;g<o;g++){const f=Math.min(a.w-1,Math.floor(g*a.ratioW)),_=a.data[m+f];_>r[p+g]&&(r[p+g]=_)}}}static findDarkRanges(t,r,i,n){const a=t.getContext("2d");if(!a)return[];const s=16,o=Math.ceil(r/s),u=Math.ceil(i/s),l=a.getImageData(0,0,r,i).data,c=new Int32Array(u);let p=0;for(let _=0;_<u;_++){const v=Math.min(i-1,_*s+(s>>1));for(let $=0;$<o;$++){const b=Math.min(r-1,$*s+(s>>1)),k=(v*r+b)*4;(l[k]*299+l[k+1]*587+l[k+2]*114)/1e3>=90||n.some(E=>b>=E.x&&b<=E.x+E.width&&v>=E.y&&v<=E.y+E.height)||(c[_]++,p++)}}if(p<8)return[];const m=[];let g=-1,f=-1;for(let _=0;_<=u;_++)if(_<u&&c[_]>=2)g<0&&(g=_),f=_;else if(g>=0&&(_===u||_-f>5)){const $=g*s,b=(f+1)*s-$;b>=48&&m.push({startY:$,h:Math.min(b,i-$)}),g=-1}return m}static buildInverted(t,r,i){const n=t.getContext("2d"),a=new OffscreenCanvas(r,i),s=a.getContext("2d");if(!n||!s)return t;const o=n.getImageData(0,0,r,i),u=o.data;for(let l=0;l<u.length;l+=4)u[l]=255-u[l],u[l+1]=255-u[l+1],u[l+2]=255-u[l+2];return s.putImageData(o,0,0),a}static calculateIoU(t,r){const i=Math.max(0,Math.min(t.x+t.width,r.x+r.width)-Math.max(t.x,r.x)),n=Math.max(0,Math.min(t.y+t.height,r.y+r.height)-Math.max(t.y,r.y)),a=i*n;if(a<=0)return 0;const s=t.width*t.height,o=r.width*r.height,u=s+o-a;return u>0?a/u:0}}function n1(e,t,r,i,n=!1){const a=new Uint8Array(i);let s=0;for(let v=0;v<i;v++)s+=e[v];if(s===0)return null;const o=s>i*.25;if(o)for(let v=0;v<r;v++)for(let $=0;$<t;$++){const b=v*t+$;if(!e[b])continue;let k=0;for(let I=-1;I<=1;I++)for(let S=-1;S<=1;S++){if(!S&&!I)continue;const E=$+S,C=v+I;E>=0&&E<t&&C>=0&&C<r&&e[C*t+E]&&k++}k>=3&&(a[b]=1)}else a.set(e);let u=0;for(let v=0;v<i;v++)u+=a[v];u===0&&a.set(e);const l=new Int32Array(i).fill(-1),c=[],p=[],m=[],g=new Int32Array(i);for(let v=0;v<i;v++){if(!a[v]||l[v]>=0)continue;const $=c.length;let b=0,k=0,I=0,S=t,E=0,C=r,x=0;for(l[v]=$,g[k++]=v;b<k;){const O=g[b++],N=O%t,R=O/t|0;I++,N<S&&(S=N),N>E&&(E=N),R<C&&(C=R),R>x&&(x=R),N>0&&a[O-1]&&l[O-1]<0&&(l[O-1]=$,g[k++]=O-1),N<t-1&&a[O+1]&&l[O+1]<0&&(l[O+1]=$,g[k++]=O+1),R>0&&a[O-t]&&l[O-t]<0&&(l[O-t]=$,g[k++]=O-t),R<r-1&&a[O+t]&&l[O+t]<0&&(l[O+t]=$,g[k++]=O+t)}c.push(I),p.push(E-S+1),m.push(x-C+1)}const f=n?i*.5:Math.min(700,i*.25);let _=0;for(let v=0;v<i;v++){const $=l[v];if($<0)continue;const b=!n&&o&&(p[$]>t*.8&&m[$]<r*.5||m[$]>r*.8&&p[$]<t*.5);c[$]>f||b||o&&!n&&c[$]<5?a[v]=0:_++}return _>0?a:null}const Re=0,Tc=1,Qn=2,ga=1e6,li=1e-6;class a1{keys;idxs;size=0;constructor(t){const r=Math.max(32,t);this.keys=new Float32Array(r),this.idxs=new Int32Array(r)}push(t,r){if(this.size>=this.keys.length){const n=this.keys.length*2,a=new Float32Array(n),s=new Int32Array(n);a.set(this.keys),s.set(this.idxs),this.keys=a,this.idxs=s}let i=this.size++;for(;i>0;){const n=i-1>>1;if(this.keys[n]<=t)break;this.keys[i]=this.keys[n],this.idxs[i]=this.idxs[n],i=n}this.keys[i]=t,this.idxs[i]=r}pop(){if(this.size===0)return-1;const t=this.idxs[0],r=this.keys[--this.size],i=this.idxs[this.size];if(this.size>0){let n=0;const a=this.size>>1;for(;n<a;){let s=(n<<1)+1;const o=s+1;if(o<this.size&&this.keys[o]<this.keys[s]&&(s=o),r<=this.keys[s])break;this.keys[n]=this.keys[s],this.idxs[n]=this.idxs[s],n=s}this.keys[n]=r,this.idxs[n]=i}return t}}function di(e,t,r,i,n,a){const s=t&&n[e]===Re,o=i&&n[r]===Re;if(s&&o){const u=a[e],l=a[r],c=u-l,p=2-c*c;if(p>=0){const m=(u+l+Math.sqrt(p))*.5;if(m>=u&&m>=l)return m}return Math.min(u,l)+1}return s?a[e]+1:o?a[r]+1:ga}class dr{static computeDilationRadius(t){return Math.max(2,Math.min(5,Math.round(t*.1)))}static diffuseMaskedRegion(t,r,i,n,a){return dr.teleaInpaint(t,r,i,n,a,3)}static teleaInpaint(t,r,i,n,a,s=3){const o=n*a,u=new Float32Array(o*3),l=new Uint8Array(o),c=new Float32Array(o),p=new a1(o>>2);for(let f=0;f<o;f++){const _=f*4;u[f*3]=t[_],u[f*3+1]=t[_+1],u[f*3+2]=t[_+2],r[f]?(l[f]=Qn,c[f]=ga):(l[f]=Re,c[f]=0)}for(let f=0;f<a;f++)for(let _=0;_<n;_++){const v=f*n+_;if(l[v]!==Qn)continue;(_>0&&l[v-1]===Re||_<n-1&&l[v+1]===Re||f>0&&l[v-n]===Re||f<a-1&&l[v+n]===Re)&&(l[v]=Tc,c[v]=1,dr.inpaintPixel(v,_,f,n,a,s,l,c,u),p.push(1,v))}const m=[-1,1,-n,n];for(;p.size>0;){const f=p.pop();if(f<0||l[f]===Re)continue;l[f]=Re;const _=f%n,v=f/n|0;for(let $=0;$<4;$++){if($===0&&_===0||$===1&&_===n-1||$===2&&v===0||$===3&&v===a-1)continue;const b=f+m[$];if(l[b]===Re)continue;const k=b%n,I=b/n|0,S=Math.min(di(b-n,I>0,b-1,k>0,l,c),di(b-n,I>0,b+1,k<n-1,l,c),di(b+n,I<a-1,b-1,k>0,l,c),di(b+n,I<a-1,b+1,k<n-1,l,c));S<c[b]&&(c[b]=S),l[b]===Qn&&(dr.inpaintPixel(b,k,I,n,a,s,l,c,u),l[b]=Tc,p.push(c[b],b))}}const g=new Uint8ClampedArray(o*4);for(let f=0;f<o;f++){if(!i[f])continue;const _=f*4;g[_]=Math.max(0,Math.min(255,Math.round(u[f*3]))),g[_+1]=Math.max(0,Math.min(255,Math.round(u[f*3+1]))),g[_+2]=Math.max(0,Math.min(255,Math.round(u[f*3+2]))),g[_+3]=255}return g}static inpaintPixel(t,r,i,n,a,s,o,u,l){let c=0,p=0;r>0&&r<n-1&&o[t-1]===Re&&o[t+1]===Re?c=(u[t+1]-u[t-1])*.5:r>0&&o[t-1]===Re?c=u[t]-u[t-1]:r<n-1&&o[t+1]===Re&&(c=u[t+1]-u[t]),i>0&&i<a-1&&o[t-n]===Re&&o[t+n]===Re?p=(u[t+n]-u[t-n])*.5:i>0&&o[t-n]===Re?p=u[t]-u[t-n]:i<a-1&&o[t+n]===Re&&(p=u[t+n]-u[t]);const m=Math.hypot(c,p);m>li&&(c/=m,p/=m);const g=s*s,f=Math.max(0,i-s),_=Math.min(a-1,i+s),v=Math.max(0,r-s),$=Math.min(n-1,r+s);let b=0,k=0,I=0,S=0;const E=u[t]<ga?u[t]:1;for(let C=f;C<=_;C++){const x=i-C;for(let O=v;O<=$;O++){const N=r-O,R=N*N+x*x;if(R===0||R>g)continue;const P=C*n+O;if(o[P]!==Re)continue;const G=Math.sqrt(R),M=m>li?Math.max(li,Math.abs(N*c+x*p)/G):1,V=1/(R*G),K=1/(1+Math.abs(E-u[P])),L=M*V*K,ee=P*3;let J=0,Z=0,A=0;O>0&&O<n-1&&o[P-1]===Re&&o[P+1]===Re&&(J=Math.max(-40,Math.min(40,(l[ee+3]-l[ee-3])*.5)),Z=Math.max(-40,Math.min(40,(l[ee+4]-l[ee-2])*.5)),A=Math.max(-40,Math.min(40,(l[ee+5]-l[ee-1])*.5)));let W=0,q=0,j=0;if(C>0&&C<a-1&&o[P-n]===Re&&o[P+n]===Re){const ue=(P-n)*3,ge=(P+n)*3;W=Math.max(-40,Math.min(40,(l[ge]-l[ue])*.5)),q=Math.max(-40,Math.min(40,(l[ge+1]-l[ue+1])*.5)),j=Math.max(-40,Math.min(40,(l[ge+2]-l[ue+2])*.5))}b+=L*(l[ee]+J*N+W*x),k+=L*(l[ee+1]+Z*N+q*x),I+=L*(l[ee+2]+A*N+j*x),S+=L}}S>li&&(l[t*3]=b/S,l[t*3+1]=k/S,l[t*3+2]=I/S)}}class xt{static buildPatch(t,r,i,n,a,s,o,u){const l=t.width,c=t.height,p=l*c;if(p<16)return null;const m=t.data,g=new Uint8Array(p);for(let Y=0;Y<p;Y++){const ie=Y*4;g[Y]=(m[ie]*299+m[ie+1]*587+m[ie+2]*114)/1e3|0}const f=u?Math.max(0,Math.min(l-1,u.x0)):0,_=u?Math.max(0,Math.min(c-1,u.y0)):0,v=u?Math.max(f+1,Math.min(l,u.x1)):l,$=u?Math.max(_+1,Math.min(c,u.y1)):c,b=Math.max(8,$-_),k=new Int32Array(256);let I=0;for(let Y=_;Y<$;Y++)for(let ie=f;ie<v;ie++)k[g[Y*l+ie]]++,I++;if(I<8)return null;let S=0;for(let Y=0;Y<256;Y++)S+=Y*k[Y];let E=0,C=0,x=-1,O=128;for(let Y=0;Y<256;Y++){if(C+=k[Y],C===0)continue;const ie=I-C;if(ie===0)break;E+=Y*k[Y];const ce=E/C,Ie=(S-E)/ie,xe=C*ie*(ce-Ie)*(ce-Ie);xe>x&&(x=xe,O=Y)}const N=new Float32Array(p);let R=0,P=0;if(a&&s)for(let Y=0;Y<p;Y++){const ie=i+(Y/l|0),ce=r+Y%l,Ie=a[ie*s+ce]||0;N[Y]=Ie,Ie>R&&(R=Ie),Ie>.25&&P++}const G=P>p*.01,M=new Uint8Array(p);if(u)for(let Y=_;Y<$;Y++)M.fill(1,Y*l+f,Y*l+v);else if(G){const Y=Math.max(4,Math.min(10,Math.round(c*.16)));for(let ie=0;ie<p;ie++)M[ie]=N[ie]>.1?1:0;xt.dilateBox(M,l,c,Y)}else M.fill(1);if(o&&o.length===4)for(let Y=0;Y<p;Y++)vt.pointInQuad(Y%l,Y/l|0,o)||(M[Y]=0);const V=xt.hexToRgb(n),K=[];for(let Y=_;Y<$;Y++)for(let ie=f;ie<v;ie++)(Y===_||Y===$-1||ie===f||ie===v-1)&&K.push(g[Y*l+ie]);if(u)for(let Y=0;Y<p;Y++)M[Y]||K.push(g[Y]);K.sort((Y,ie)=>Y-ie);const L=K.length>8?K[K.length*.6|0]:V?(V[0]*299+V[1]*587+V[2]*114)/1e3:240,ee=L>127,J=xt.detectOuterBorderStrokes(g,N,L,l,c,u),Z=new Uint8Array(p);for(let Y=0;Y<p;Y++){if(!M[Y]||J[Y])continue;const ie=g[Y],ce=ee?ie<=Math.max(O,L-28):ie>=Math.min(O,L+28),Ie=Math.abs(ie-L)>26;(ce||Ie)&&(Z[Y]=1)}const A=n1(Z,l,c,p,!0)??(xt.hasAny(Z)?Z:null);if(!A)return null;const W=Math.max(3,dr.computeDilationRadius(b)),q=xt.dilateDisk(A,l,c,W);for(let Y=0;Y<p;Y++)J[Y]&&(q[Y]=0);if(!xt.hasAny(q))return null;const j=xt.dilateDisk(q,l,c,3),ue=[];for(let Y=0;Y<p;Y++)j[Y]&&!q[Y]&&!J[Y]&&ue.push(g[Y]);if(ue.length>=16){ue.sort((de,Ne)=>de-Ne);const Y=ue[ue.length/2|0];let ie=0,ce=0,Ie=0,xe=0,be=0,Me=0;for(let de=0;de<p;de++){if(!j[de]||q[de]||J[de]||Math.abs(g[de]-Y)>25)continue;const Ne=de*4;ce+=m[Ne],Ie+=m[Ne+1],xe+=m[Ne+2],be+=g[de],Me+=g[de]*g[de],ie++}if(ie>=16){const de=be/ie,Ne=Math.sqrt(Math.max(0,Me/ie-de*de));if(Ne<14&&ie>=ue.length*.72){const He=new Uint8ClampedArray(p*4),gt=ce/ie,Ze=Ie/ie,Q=xe/ie;for(let B=0;B<p;B++){if(!q[B])continue;const te=B*4;He[te]=gt,He[te+1]=Ze,He[te+2]=Q,He[te+3]=255}return{x:r,y:i,width:l,height:c,pixels:He,dbg:{path:"flat",std:Ne,guided:G,tmMax:R}}}}}const ge=dr.teleaInpaint(m,q,q,l,c,4);return{x:r,y:i,width:l,height:c,pixels:ge,dbg:{path:"telea",guided:G,tmMax:R}}}static detectOuterBorderStrokes(t,r,i,n,a,s){const o=n*a,u=new Uint8Array(o),l=new Int32Array(o);let c=0,p=0;const m=new Uint8Array(n);if(s)for(let _=0;_<n;_++){let v=!1;for(let $=0;$<s.y0&&!v;$++)Math.abs(t[$*n+_]-i)>55&&(v=!0);for(let $=s.y1;$<a&&!v;$++)Math.abs(t[$*n+_]-i)>55&&(v=!0);if(v)for(let $=-3;$<=3;$++)_+$>=0&&_+$<n&&(m[_+$]=1)}else m.fill(1);const g=_=>{if(!s&&r[_]>=.25||Math.abs(t[_]-i)<=55)return!1;if(s){const v=_%n,$=_/n|0;if($>=s.y0&&$<s.y1&&!m[v]||v>=s.x0+4&&v<s.x1-4&&$>=s.y0+2&&$<s.y1-2)return!1}return!0},f=_=>{!u[_]&&g(_)&&(u[_]=1,l[p++]=_)};for(let _=0;_<n;_++)f(_),f((a-1)*n+_);for(let _=0;_<a;_++)f(_*n),f(_*n+n-1);for(;c<p;){const _=l[c++],v=_%n,$=_/n|0;v>0&&f(_-1),v<n-1&&f(_+1),$>0&&f(_-n),$<a-1&&f(_+n)}return u}static dilateDisk(t,r,i,n){const a=new Uint8Array(r*i),s=n*n;for(let o=0;o<i;o++)for(let u=0;u<r;u++){if(!t[o*r+u])continue;const l=Math.max(0,o-n),c=Math.min(i-1,o+n),p=Math.max(0,u-n),m=Math.min(r-1,u+n);for(let g=l;g<=c;g++){const f=g-o;for(let _=p;_<=m;_++){const v=_-u;v*v+f*f<=s&&(a[g*r+_]=1)}}}return a}static dilateBox(t,r,i,n){for(let a=0;a<n;a++){const s=t.slice();for(let o=0;o<i;o++)for(let u=0;u<r;u++){const l=o*r+u;s[l]||(u>0&&s[l-1]||u<r-1&&s[l+1]||o>0&&s[l-r]||o<i-1&&s[l+r])&&(t[l]=1)}}}static hasAny(t){for(let r=0;r<t.length;r++)if(t[r])return!0;return!1}static hexToRgb(t){return!t||!/^#[0-9a-fA-F]{6}$/.test(t)?null:[parseInt(t.slice(1,3),16),parseInt(t.slice(3,5),16),parseInt(t.slice(5,7),16)]}}class s1{static buildBubblePatch(t,r,i,n){const a=t.width,s=t.height,o=a*s,u=t.data,l=new Uint8Array(o);for(let B=0;B<o;B++){const te=B*4;l[B]=u[te]*77+u[te+1]*150+u[te+2]*29>>8}const c=[],p=Math.floor(a*.25),m=Math.ceil(a*.75),g=Math.floor(s*.25),f=Math.ceil(s*.75);for(let B=g;B<f;B++)for(let te=p;te<m;te++)c.push(l[B*a+te]);c.sort((B,te)=>B-te);const _=c.length>0?c[c.length>>1]:240,v=new Uint8Array(o);for(let B=0;B<o;B++)Math.abs(l[B]-_)>45&&(v[B]=1);const $=new Uint8Array(o);for(let B=0;B<s;B++)for(let te=0;te<a;te++){const fe=B*a+te;if(v[fe])for(let je=-1;je<=1;je++){const qe=B+je;if(!(qe<0||qe>=s))for(let Pe=-1;Pe<=1;Pe++){const Ue=te+Pe;Ue>=0&&Ue<a&&($[qe*a+Ue]=1)}}}const b=new Uint8Array(o),k=new Int32Array(o);let I=0,S=0;const E=Math.floor(a*.3),C=Math.ceil(a*.7),x=Math.floor(s*.3),O=Math.ceil(s*.7);for(let B=x;B<O;B++)for(let te=E;te<C;te++){const fe=B*a+te;!$[fe]&&!b[fe]&&(b[fe]=1,k[S++]=fe)}let N=0;for(;I<S;){const B=k[I++],te=B%a,fe=B/a|0;(te===0||te===a-1||fe===0||fe===s-1)&&N++,te>0&&!$[B-1]&&!b[B-1]&&(b[B-1]=1,k[S++]=B-1),te<a-1&&!$[B+1]&&!b[B+1]&&(b[B+1]=1,k[S++]=B+1),fe>0&&!$[B-a]&&!b[B-a]&&(b[B-a]=1,k[S++]=B-a),fe<s-1&&!$[B+a]&&!b[B+a]&&(b[B+a]=1,k[S++]=B+a)}if(S<o*.08||N>2)return null;const P=b.slice();for(let B=0;B<s;B++)for(let te=0;te<a;te++){const fe=B*a+te;P[fe]||v[fe]||(te>0&&b[fe-1]||te<a-1&&b[fe+1]||B>0&&b[fe-a]||B<s-1&&b[fe+a])&&(P[fe]=1)}const G=5,M=G*G,V=a+G*2,K=s+G*2,L=new Uint8Array(V*K);for(let B=0;B<s;B++)for(let te=0;te<a;te++){if(!P[B*a+te])continue;const fe=B+G,je=te+G;for(let qe=-G;qe<=G;qe++){const Pe=(fe+qe)*V+je;for(let Ue=-G;Ue<=G;Ue++)Ue*Ue+qe*qe<=M&&(L[Pe+Ue]=1)}}const ee=new Uint8Array(o);for(let B=0;B<s;B++){const te=B+G;for(let fe=0;fe<a;fe++){const je=fe+G;let qe=1;for(let Pe=-G;Pe<=G&&qe;Pe++){const Ue=(te+Pe)*V+je;for(let Bt=-G;Bt<=G;Bt++)if(Bt*Bt+Pe*Pe<=M&&!L[Ue+Bt]){qe=0;break}}ee[B*a+fe]=qe}}const J=new Uint8Array(o),Z=new Int32Array(o);let A=0,W=0;const q=B=>{!ee[B]&&!J[B]&&(J[B]=1,Z[W++]=B)};for(let B=0;B<a;B++)q(B),q((s-1)*a+B);for(let B=0;B<s;B++)q(B*a),q(B*a+a-1);for(;A<W;){const B=Z[A++],te=B%a,fe=B/a|0;te>0&&!ee[B-1]&&!J[B-1]&&(J[B-1]=1,Z[W++]=B-1),te<a-1&&!ee[B+1]&&!J[B+1]&&(J[B+1]=1,Z[W++]=B+1),fe>0&&!ee[B-a]&&!J[B-a]&&(J[B-a]=1,Z[W++]=B-a),fe<s-1&&!ee[B+a]&&!J[B+a]&&(J[B+a]=1,Z[W++]=B+a)}let j=0,ue=0,ge=0,Y=0,ie=0,ce=0;for(let B=0;B<o;B++){if(!b[B]||v[B])continue;const te=l[B];ue+=te,ge+=te*te;const fe=B*4;Y+=u[fe],ie+=u[fe+1],ce+=u[fe+2],j++}if(j===0)return null;const Ie=ue/j,xe=Math.sqrt(Math.max(0,ge/j-Ie*Ie));if(xe>25)return null;const be=new Uint8Array(o);if(n&&n.length>0)for(const B of n){const te=Math.max(0,Math.floor(B.x-r-25)),fe=Math.max(0,Math.floor(B.y-i-25)),je=Math.min(a,Math.ceil(B.x-r+B.width+25)),qe=Math.min(s,Math.ceil(B.y-i+B.height+25));for(let Pe=fe;Pe<qe;Pe++)be.fill(1,Pe*a+te,Pe*a+je)}else be.fill(1);let Me=0,de=0,Ne=0;for(let B=0;B<o;B++){if(J[B]||!be[B])continue;Me++,v[B]&&de++;const te=B%a,fe=B/a|0;(te>0&&!be[B-1]&&!J[B-1]||te<a-1&&!be[B+1]&&!J[B+1]||fe>0&&!be[B-a]&&!J[B-a]||fe<s-1&&!be[B+a]&&!J[B+a])&&Ne++}if(Me<o*.05||de>Me*.4||Ne>4)return null;const He=new Uint8ClampedArray(o*4),gt=Y/j,Ze=ie/j,Q=ce/j;for(let B=0;B<o;B++){if(J[B]||!be[B])continue;if(P[B]){const fe=B%a,je=B/a|0;if(fe>0&&v[B-1]&&J[B-1]||fe<a-1&&v[B+1]&&J[B+1]||je>0&&v[B-a]&&J[B-a]||je<s-1&&v[B+a]&&J[B+a])continue}const te=B*4;He[te]=gt,He[te+1]=Ze,He[te+2]=Q,He[te+3]=255}return{x:r,y:i,width:a,height:s,pixels:He,dbg:{path:"bubble",guided:!0,risky:de/Me,std:xe,tmMax:0}}}}const o1=1<<20;class or{static extractChamber(t,r,i,n){const{data:a,width:s,height:o}=t,u=s*o;if(s<20||o<20||n.width<8||n.height<8)return null;const l=Math.max(0,Math.floor(n.x-r)),c=Math.max(0,Math.floor(n.y-i)),p=Math.min(s-1,Math.ceil(n.x+n.width-r)-1),m=Math.min(o-1,Math.ceil(n.y+n.height-i)-1);if(p<=l||m<=c)return null;const g=new Uint8Array(u);for(let Q=0;Q<u;Q++){const B=Q*4;g[Q]=a[B]*77+a[B+1]*150+a[B+2]*29>>8}const f=new Int32Array(16);for(let Q=c;Q<=m;Q++)for(let B=l;B<=p;B++)f[g[Q*s+B]>>4]++;let _=0;for(let Q=1;Q<16;Q++)f[Q]>f[_]&&(_=Q);if(_>5&&_<9)return null;const v=_<=5,$=[];for(let Q=c;Q<=m;Q++)for(let B=l;B<=p;B++){const te=g[Q*s+B];Math.abs((te>>4)-_)<=2&&$.push(te)}if($.length<8)return null;$.sort((Q,B)=>Q-B);const b=$[$.length>>1],k=new Uint8Array(u);if(v){const Q=Math.min(85,b+22);for(let B=0;B<u;B++)g[B]<=Q&&(k[B]=1)}else{const Q=Math.max(155,b-22);for(let B=0;B<u;B++)g[B]>=Q&&(k[B]=1)}const I=new Uint8Array(u),S=new Int32Array(u);let E=0,C=0;for(let Q=c;Q<=m;Q++)for(let B=l;B<=p;B++){const te=Q*s+B;k[te]&&!I[te]&&(I[te]=1,S[C++]=te)}if(C<12)return null;let x=s,O=o,N=0,R=0,P=0;for(;E<C;){const Q=S[E++],B=Q%s,te=Q/s|0;B<x&&(x=B),B>N&&(N=B),te<O&&(O=te),te>R&&(R=te),(B===0||B===s-1||te===0||te===o-1)&&P++,B>0&&k[Q-1]&&!I[Q-1]&&(I[Q-1]=1,S[C++]=Q-1),B<s-1&&k[Q+1]&&!I[Q+1]&&(I[Q+1]=1,S[C++]=Q+1),te>0&&k[Q-s]&&!I[Q-s]&&(I[Q-s]=1,S[C++]=Q-s),te<o-1&&k[Q+s]&&!I[Q+s]&&(I[Q+s]=1,S[C++]=Q+s)}const G=2*(s+o);if(P>G*.35||N-x+1>=s*.96&&R-O+1>=o*.96)return null;const M=new Uint8Array(u);E=0,C=0;const V=Q=>{!I[Q]&&!M[Q]&&(M[Q]=1,S[C++]=Q)};for(let Q=0;Q<s;Q++)V(Q),V((o-1)*s+Q);for(let Q=0;Q<o;Q++)V(Q*s),V(Q*s+s-1);for(;E<C;){const Q=S[E++],B=Q%s,te=Q/s|0;B>0&&!I[Q-1]&&!M[Q-1]&&(M[Q-1]=1,S[C++]=Q-1),B<s-1&&!I[Q+1]&&!M[Q+1]&&(M[Q+1]=1,S[C++]=Q+1),te>0&&!I[Q-s]&&!M[Q-s]&&(M[Q-s]=1,S[C++]=Q-s),te<o-1&&!I[Q+s]&&!M[Q+s]&&(M[Q+s]=1,S[C++]=Q+s)}const K=new Uint8Array(u);for(let Q=0;Q<u;Q++)K[Q]=M[Q]?0:1;const L=or.chamferDistance(K,s,o,0),ee=Math.min(N-x+1,R-O+1);let J=Math.max(6,Math.min(14,Math.round(ee*.11))),Z=or.extractSeededCore(L,J*3,l,c,p,m,s,o);if(!Z&&J>5&&(J=Math.max(4,J>>1),Z=or.extractSeededCore(L,J*3,l,c,p,m,s,o)),!Z)return null;const A=or.chamferDistance(Z,s,o,1),W=(J+1)*3;let q=s,j=o,ue=0,ge=0,Y=0;for(let Q=0;Q<u;Q++){if(!K[Q]||A[Q]>W)continue;const B=Q%s,te=Q/s|0;B<q&&(q=B),B>ue&&(ue=B),te<j&&(j=te),te>ge&&(ge=te),Y++}if(Y<64||ue<=q||ge<=j)return null;const ie=ue-q+1,ce=ge-j+1,Ie=Y/(ie*ce),xe=(l+p)*.5,be=(c+m)*.5,Me=(q+ue)*.5,de=(j+ge)*.5;if(Math.abs(Me-xe)>ie*.3||Math.abs(de-be)>ce*.3)return null;const Ne=Math.min(q,l),He=Math.min(j,c),gt=Math.max(ue,p),Ze=Math.max(ge,m);return{chamberBox:{x:r+Ne,y:i+He,width:gt-Ne+1,height:Ze-He+1},isOval:Ie<.88}}static chamferDistance(t,r,i,n){const a=r*i,s=new Int32Array(a);for(let o=0;o<a;o++)s[o]=t[o]===n?0:o1;for(let o=0;o<i;o++)for(let u=0;u<r;u++){const l=o*r+u;let c=s[l];u>0&&s[l-1]+3<c&&(c=s[l-1]+3),o>0&&(s[l-r]+3<c&&(c=s[l-r]+3),u>0&&s[l-r-1]+4<c&&(c=s[l-r-1]+4),u<r-1&&s[l-r+1]+4<c&&(c=s[l-r+1]+4)),s[l]=c}for(let o=i-1;o>=0;o--)for(let u=r-1;u>=0;u--){const l=o*r+u;let c=s[l];u<r-1&&s[l+1]+3<c&&(c=s[l+1]+3),o<i-1&&(s[l+r]+3<c&&(c=s[l+r]+3),u<r-1&&s[l+r+1]+4<c&&(c=s[l+r+1]+4),u>0&&s[l+r-1]+4<c&&(c=s[l+r-1]+4)),s[l]=c}return s}static extractSeededCore(t,r,i,n,a,s,o,u){const l=o*u,c=new Uint8Array(l),p=new Int32Array(l);let m=0,g=0;for(let f=n;f<=s;f++)for(let _=i;_<=a;_++){const v=f*o+_;t[v]>=r&&!c[v]&&(c[v]=1,p[g++]=v)}if(g===0)return null;for(;m<g;){const f=p[m++],_=f%o,v=f/o|0;_>0&&t[f-1]>=r&&!c[f-1]&&(c[f-1]=1,p[g++]=f-1),_<o-1&&t[f+1]>=r&&!c[f+1]&&(c[f+1]=1,p[g++]=f+1),v>0&&t[f-o]>=r&&!c[f-o]&&(c[f-o]=1,p[g++]=f-o),v<u-1&&t[f+o]>=r&&!c[f+o]&&(c[f+o]=1,p[g++]=f+o)}return c}}class u1{static recoverMissedLines(t,r){const{data:i,width:n,height:a}=t;if(r.length===0||n<24||a<24)return[];const s=new Uint8Array(n*a);for(let l=0;l<n*a;l++){const c=l*4;s[l]=i[c]*77+i[c+1]*150+i[c+2]*29>>8}const o=this.clusterVerticalStacks(r),u=[];for(const l of o){const c=Math.max(0,Math.min(...l.map(A=>A.x))),p=Math.max(0,Math.min(...l.map(A=>A.y))),m=Math.min(n-1,Math.max(...l.map(A=>A.x+A.width-1))),g=Math.min(a-1,Math.max(...l.map(A=>A.y+A.height-1)));if(m-c<14||g-p<10)continue;const f=l.reduce((A,W)=>A+W.height,0)/Math.max(1,l.length);if(f>65)continue;const _=[];for(let A=p;A<=g;A+=2)for(let W=c;W<=m;W+=2)_.push(s[A*n+W]);if(_.length<12)continue;_.sort((A,W)=>A-W);const v=_[Math.floor(_.length*.7)],$=_[Math.floor(_.length*.3)];let b;if(v>=215)b=v;else if($<=45)b=$;else continue;const k=Math.max(0,c-34),I=Math.min(n-1,m+34),S=Math.max(0,Math.round(p-Math.min(90,Math.max(46,f*3.5)))),E=Math.min(a-1,Math.round(g+Math.min(125,Math.max(65,f*4.8)))),C=I-k+1,x=E-S+1;if(C<16||x<24)continue;const O=new Uint8Array(C*x),N=new Int32Array(C*x);let R=0,P=0;const G=A=>Math.abs(A-b)<=28;for(let A=p;A<=g;A++)for(let W=c;W<=m;W++){if(!G(s[A*n+W]))continue;const q=(A-S)*C+(W-k);O[q]||(O[q]=1,N[P++]=q)}if(P<20)continue;let M=0;for(;R<P;){const A=N[R++],W=A%C,q=A/C|0;(W===0||W===C-1)&&M++;const j=k+W,ue=S+q;W>0&&!O[A-1]&&G(s[ue*n+j-1])&&(O[A-1]=1,N[P++]=A-1),W<C-1&&!O[A+1]&&G(s[ue*n+j+1])&&(O[A+1]=1,N[P++]=A+1),q>0&&!O[A-C]&&G(s[(ue-1)*n+j])&&(O[A-C]=1,N[P++]=A-C),q<x-1&&!O[A+C]&&G(s[(ue+1)*n+j])&&(O[A+C]=1,N[P++]=A+C)}if(M>x*.45)continue;const V=new Int16Array(x).fill(C),K=new Int16Array(x).fill(-1);for(let A=0;A<x;A++){const W=A*C;for(let q=0;q<C;q++)O[W+q]&&(q<V[A]&&(V[A]=q),q>K[A]&&(K[A]=q))}const L=new Int16Array(x),ee=new Int16Array(x),J=A=>r.some(W=>A>=W.y-2&&A<=W.y+W.height+2&&W.x<I&&W.x+W.width>k);for(let A=0;A<x;A++){const W=S+A;if(J(W))continue;let q=C,j=-1;for(let ie=-5;ie<=5;ie++){const ce=A+ie;ce>=0&&ce<x&&K[ce]>=V[ce]&&(V[ce]<q&&(q=V[ce]),K[ce]>j&&(j=K[ce]))}const ue=q+2,ge=j-2;if(ge-ue<8)continue;ee[A]=ge-ue+1;let Y=0;for(let ie=ue;ie<=ge;ie++)Math.abs(s[W*n+(k+ie)]-b)>55&&Y++;L[A]=Y}let Z=-1;for(let A=0;A<=x;A++){const W=A<x?ee[A]:0,q=A<x?L[A]:0,j=W>=8&&q>=Math.max(2,Math.round(W*.04))&&q<=W*.9;if(j&&Z<0)Z=A;else if(!j&&Z>=0){const ue=A-Z;if(ue>=8&&ue<=Math.max(30,f*1.85)){const ge=this.buildBandBox(s,n,a,k,S,Z,A-1,V,K,x,C,b);ge&&!r.some(Y=>this.overlapRatio(Y,ge)>.2)&&!u.some(Y=>this.overlapRatio(Y,ge)>.2)&&u.push(ge)}Z=-1}}}return u}static buildBandBox(t,r,i,n,a,s,o,u,l,c,p,m){let g=p,f=-1;for(let x=Math.max(0,s-5);x<=Math.min(c-1,o+5);x++)l[x]>=u[x]&&(u[x]<g&&(g=u[x]),l[x]>f&&(f=l[x]));const _=g+2,v=f-2;if(v-_<10)return null;let $=p,b=-1,k=0;for(let x=s;x<=o;x++){const O=a+x;for(let N=_;N<=v;N++)Math.abs(t[O*r+(n+N)]-m)>60&&(N<$&&($=N),N>b&&(b=N),k++)}if(b-$<6||k<8)return null;const I=Math.max(0,n+$-4),S=Math.max(0,a+s-1),E=Math.min(r,n+b+5),C=Math.min(i,a+o+2);return{x:I,y:S,width:E-I,height:C-S,confidence:.75,kind:"dialogue"}}static clusterVerticalStacks(t){const r=t.filter(a=>a.kind!=="sfx").sort((a,s)=>a.y-s.y),i=new Set,n=[];for(let a=0;a<r.length;a++){if(i.has(a))continue;const s=[r[a]];i.add(a);let o=!0;for(;o;){o=!1;const u=s[s.length-1],l=u.x+u.width*.5;for(let c=0;c<r.length;c++){if(i.has(c))continue;const p=r[c],m=p.y-(u.y+u.height),g=Math.max(u.height,p.height);if(m<-u.height*.5||m>g*2.8)continue;const f=Math.max(0,Math.min(u.x+u.width,p.x+p.width)-Math.max(u.x,p.x)),_=Math.max(1,Math.min(u.width,p.width)),v=Math.max(1,Math.max(u.width,p.width)),$=p.x+p.width*.5;if(f/_>=.25||Math.abs(l-$)/v<=.45){s.push(p),i.add(c),o=!0;break}}}n.push(s)}return n}static overlapRatio(t,r){const i=Math.max(0,Math.min(t.x+t.width,r.x+r.width)-Math.max(t.x,r.x)),n=Math.max(0,Math.min(t.y+t.height,r.y+r.height)-Math.max(t.y,r.y)),a=i*n;return a<=0?0:a/Math.max(1,Math.min(t.width*t.height,r.width*r.height))}}const l1=self.location.href.substring(0,self.location.href.lastIndexOf("/")+1);Ce.wasm.wasmPaths=l1;Ce.wasm.numThreads=self.crossOriginIsolated?Math.min(4,Math.max(1,(self.navigator?.hardwareConcurrency??2)-1)):1;Ce.wasm.simd=!0;Ce.webgpu={...Ce.webgpu||{},powerPreference:"high-performance"};Ce.logLevel="error";let ir=null,nr=null,Cr=null,Cc=null,Ec="wasm",zc=Promise.resolve();async function Jn(e,t,r){try{const i=await ur.create(e,{...t,executionProviders:["webgpu"]});if(r&&i.inputNames.length>0){const n=i.inputNames[0],a=r.reduce((u,l)=>u*l,1),s=new Fe("float32",new Float32Array(a),r);let o=null;try{o=await i.run({[n]:s})}catch(u){throw await i.release?.().catch(()=>{}),u}finally{if(s.dispose?.(),o)for(const u of Object.values(o))u.dispose?.()}}return i}catch(i){return console.warn("[OCR Worker] WebGPU session creation/kernel validation failed, falling back to WASM:",i?.message),null}}self.onmessage=e=>{const t=e.data,r=t._reqId,i=n=>self.postMessage({...n,_reqId:r});zc=zc.then(async()=>{try{switch(t.type){case"PING":{i({type:"PONG",success:!0});break}case"INIT_MODEL":{if(!t.detBuffer||!t.recBuffer||!t.keysText)throw new Error("Thiếu dữ liệu buffer hoặc keys để khởi tạo model.");await ir?.release?.().catch(()=>{}),await nr?.release?.().catch(()=>{}),await Cr?.release?.().catch(()=>{}),ir=null,nr=null,Cr=null;const n={graphOptimizationLevel:"all",logSeverityLevel:3};let a=null,s=null,o=!1,u=!1;const l=!!(t.modelId&&t.modelId.includes("comic")),c={...n,executionProviders:["wasm"]};if(t.useWebGpu!==!1&&!l&&(a=await Jn(t.detBuffer,n,[1,3,48,48]),a&&(o=!0)),a||(a=await ur.create(t.detBuffer,c)),t.useWebGpu!==!1&&(s=await Jn(t.recBuffer,n,[1,3,48,64]),s&&(u=!0)),s||(s=await ur.create(t.recBuffer,c)),Ec=o||u?"webgpu":"wasm",ir=a.inputNames.includes("orig_target_sizes")||a.inputNames.includes("images")||!!(t.modelId&&t.modelId.includes("comic"))?new Sc(a):new Ic(a),nr=null,t.det2Buffer)try{const m=(t.useWebGpu!==!1?await Jn(t.det2Buffer,n,[1,3,64,64]):null)??await ur.create(t.det2Buffer,c);nr=new Ic(m,{thresh:.3,boxThresh:.35,unclipRatio:1.3})}catch(m){console.warn("[OCR Worker] Supplementary det session failed:",m)}Cr=new Br(s,t.keysText,{isCjkModel:/japan|korean|chinese|cjk|multilingual|v6/i.test(t.modelId??"")}),Cc=t.modelId||"loaded",i({type:"INIT_RESULT",success:!0,modelId:Cc,backend:Ec});break}case"PROCESS_IMAGE":{if(!ir||!Cr)throw new Error("Model PaddleOCR chưa được nạp. Hãy khởi tạo trước khi nhận diện.");if(!t.imageBitmap)throw new Error("Thiếu ImageBitmap cần nhận diện.");const n=t.imageBitmap;try{const a=n.width,s=n.height,o=new OffscreenCanvas(a,s),u=o.getContext("2d");if(!u)throw new Error("Không thể tạo 2D context trong Worker");u.drawImage(n,0,0);const l=performance.now(),c=ir instanceof Sc,p=new Float32Array(a*s),m=await Xn.detectWithSlicing(o,a,s,ir,{aspectCap:c?s<=2200?.85:1.8:void 0,invertedPass:c,textMapOut:p});if(nr){const S=await Xn.detectWithSlicing(o,a,s,nr,{textMapOut:p});for(const E of S)if(!m.some(x=>Xn.calculateIoU(x,E)>.5))if(E.height>=34&&E.width>=28){const x=ma.segmentLines(u,E,a,s);for(const O of x)m.push({...O,kind:"free"})}else m.push({...E,kind:"free"});m.sort((E,C)=>E.y-C.y)}const g=[];for(const S of m)if(S.kind!=="free"&&S.height>=42&&S.height<=S.width*2.2){const E=ma.segmentLines(u,S,a,s);for(const C of E)g.push({...C,kind:S.kind})}else g.push(S);m.length=0,m.push(...g);const f=u.getImageData(0,0,a,s),_=u1.recoverMissedLines(f,m);_.length>0&&m.push(..._),m.sort((S,E)=>S.y-E.y);const v=performance.now()-l,$=performance.now(),k=(await Cr.recognizeBoxes(o,m)).filter(S=>_.some(C=>Math.abs(C.x-S.box.x)<=2&&Math.abs(C.y-S.box.y)<=2)?(S.originalText.match(/\p{L}/gu)||[]).length>=2:!0),I=performance.now()-$;d1(o,k,p),i({type:"PROCESS_RESULT",success:!0,elementId:t.elementId,dialogues:k,timings:{detMs:Math.round(v),recMs:Math.round(I),boxCount:m.length}})}finally{n.close()}break}default:throw new Error(`Thông điệp worker không hỗ trợ: ${t.type}`)}}catch(n){console.error("[OCR Worker] Processing error:",n),i({type:"ERROR",success:!1,elementId:t.elementId,error:`${n?.message||"Lỗi không xác định trong Web Worker"}${n?.stack?`
`+n.stack:""}`})}}).catch(n=>{console.error("[OCR Worker] Fatal queue error:",n),i({type:"ERROR",success:!1,error:`Fatal queue error: ${n?.message||n}`})})};function d1(e,t,r){const i=e.getContext("2d");if(!i)return;const n=16;for(const a of t){const s=Math.max(0,a.box.x-n),o=Math.max(0,a.box.y-n),u=Math.min(e.width-s,a.box.width+(a.box.x-s)+n),l=Math.min(e.height-o,a.box.height+(a.box.y-o)+n);if(!(u<4||l<4))try{const c=i.getImageData(s,o,u,l),p=a.box.quad?.map(([_,v])=>[_-s,v-o]),m=Math.min(8,Math.max(5,Math.round(a.box.height*.35))),g={x0:Math.max(2,a.box.x-s-m),y0:Math.max(2,a.box.y-o-2),x1:Math.min(u-2,a.box.x-s+a.box.width+m),y1:Math.min(l-2,a.box.y-o+a.box.height+2)},f=xt.buildPatch(c,s,o,a.bgColor,r,e.width,p,g);f&&(a.erasePatch=f)}catch{}}try{const a=A0.aggregateDialogues(t,e.width,e.height),s=new Map(t.map(o=>[o.box,o]));for(const o of a){const u=Math.max(24,Math.min(180,Math.round(Math.max(o.box.width*1.6,o.box.height*.85)))),l=Math.max(16,Math.min(120,Math.round(o.box.height*.45))),c=Math.max(0,o.box.x-u),p=Math.max(0,o.box.y-l),m=Math.min(e.width-c,o.box.width+u*2),g=Math.min(e.height-p,o.box.height+l*2);if(o.kind==="dialogue"&&m>=20&&g>=20){const I=i.getImageData(c,p,m,g),S=or.extractChamber(I,c,p,o.box);if(S)for(const E of o.lineBoxes||[]){const C=s.get(E);C&&(C.chamberBox=S.chamberBox,C.isOvalChamber=S.isOval)}}const f=Math.max(0,o.box.x-16),_=Math.max(0,o.box.y-16),v=Math.min(e.width-f,o.box.width+32),$=Math.min(e.height-_,o.box.height+32);if(v<12||$<12)continue;const b=i.getImageData(f,_,v,$),k=s1.buildBubblePatch(b,f,_,o.lineBoxes);if(k)for(const I of o.lineBoxes||[]){const S=s.get(I);S&&(S.bubblePatch=k)}}}catch{}}self.addEventListener("error",e=>{console.error("[OCR Worker] Global error:",e),self.postMessage({type:"ERROR",success:!1,error:`Worker GlobalError: ${e.message||String(e)}`})});self.addEventListener("unhandledrejection",e=>{console.error("[OCR Worker] Unhandled rejection:",e),self.postMessage({type:"ERROR",success:!1,error:`Worker UnhandledRejection: ${e.reason?.message||String(e.reason)}`})});
