"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/webextension-polyfill/dist/browser-polyfill.js
  var require_browser_polyfill = __commonJS({
    "node_modules/webextension-polyfill/dist/browser-polyfill.js"(exports, module) {
      (function(global, factory) {
        if (typeof define === "function" && define.amd) {
          define("webextension-polyfill", ["module"], factory);
        } else if (typeof exports !== "undefined") {
          factory(module);
        } else {
          var mod = {
            exports: {}
          };
          factory(mod);
          global.browser = mod.exports;
        }
      })(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : exports, function(module2) {
        "use strict";
        if (!(globalThis.chrome && globalThis.chrome.runtime && globalThis.chrome.runtime.id)) {
          throw new Error("This script should only be loaded in a browser extension.");
        }
        if (!(globalThis.browser && globalThis.browser.runtime && globalThis.browser.runtime.id)) {
          const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";
          const wrapAPIs = (extensionAPIs) => {
            const apiMetadata = {
              "alarms": {
                "clear": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "clearAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "get": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "bookmarks": {
                "create": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getChildren": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getRecent": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getSubTree": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getTree": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "move": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeTree": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "search": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              },
              "browserAction": {
                "disable": {
                  "minArgs": 0,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "enable": {
                  "minArgs": 0,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "getBadgeBackgroundColor": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getBadgeText": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getPopup": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getTitle": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "openPopup": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "setBadgeBackgroundColor": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setBadgeText": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setIcon": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "setPopup": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setTitle": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                }
              },
              "browsingData": {
                "remove": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "removeCache": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeCookies": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeDownloads": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeFormData": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeHistory": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeLocalStorage": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removePasswords": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removePluginData": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "settings": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "commands": {
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "contextMenus": {
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              },
              "cookies": {
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAllCookieStores": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "set": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "devtools": {
                "inspectedWindow": {
                  "eval": {
                    "minArgs": 1,
                    "maxArgs": 2,
                    "singleCallbackArg": false
                  }
                },
                "panels": {
                  "create": {
                    "minArgs": 3,
                    "maxArgs": 3,
                    "singleCallbackArg": true
                  },
                  "elements": {
                    "createSidebarPane": {
                      "minArgs": 1,
                      "maxArgs": 1
                    }
                  }
                }
              },
              "downloads": {
                "cancel": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "download": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "erase": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getFileIcon": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "open": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "pause": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeFile": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "resume": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "search": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "show": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                }
              },
              "extension": {
                "isAllowedFileSchemeAccess": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "isAllowedIncognitoAccess": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "history": {
                "addUrl": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "deleteAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "deleteRange": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "deleteUrl": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getVisits": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "search": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "i18n": {
                "detectLanguage": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAcceptLanguages": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "identity": {
                "launchWebAuthFlow": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "idle": {
                "queryState": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "management": {
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getSelf": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "setEnabled": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "uninstallSelf": {
                  "minArgs": 0,
                  "maxArgs": 1
                }
              },
              "notifications": {
                "clear": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "create": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getPermissionLevel": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              },
              "pageAction": {
                "getPopup": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getTitle": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "hide": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setIcon": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "setPopup": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setTitle": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "show": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                }
              },
              "permissions": {
                "contains": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "request": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "runtime": {
                "getBackgroundPage": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getPlatformInfo": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "openOptionsPage": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "requestUpdateCheck": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "sendMessage": {
                  "minArgs": 1,
                  "maxArgs": 3
                },
                "sendNativeMessage": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "setUninstallURL": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "sessions": {
                "getDevices": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getRecentlyClosed": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "restore": {
                  "minArgs": 0,
                  "maxArgs": 1
                }
              },
              "storage": {
                "local": {
                  "clear": {
                    "minArgs": 0,
                    "maxArgs": 0
                  },
                  "get": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "getBytesInUse": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "remove": {
                    "minArgs": 1,
                    "maxArgs": 1
                  },
                  "set": {
                    "minArgs": 1,
                    "maxArgs": 1
                  }
                },
                "managed": {
                  "get": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "getBytesInUse": {
                    "minArgs": 0,
                    "maxArgs": 1
                  }
                },
                "sync": {
                  "clear": {
                    "minArgs": 0,
                    "maxArgs": 0
                  },
                  "get": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "getBytesInUse": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "remove": {
                    "minArgs": 1,
                    "maxArgs": 1
                  },
                  "set": {
                    "minArgs": 1,
                    "maxArgs": 1
                  }
                }
              },
              "tabs": {
                "captureVisibleTab": {
                  "minArgs": 0,
                  "maxArgs": 2
                },
                "create": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "detectLanguage": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "discard": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "duplicate": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "executeScript": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getCurrent": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getZoom": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getZoomSettings": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "goBack": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "goForward": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "highlight": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "insertCSS": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "move": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "query": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "reload": {
                  "minArgs": 0,
                  "maxArgs": 2
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeCSS": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "sendMessage": {
                  "minArgs": 2,
                  "maxArgs": 3
                },
                "setZoom": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "setZoomSettings": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "update": {
                  "minArgs": 1,
                  "maxArgs": 2
                }
              },
              "topSites": {
                "get": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "webNavigation": {
                "getAllFrames": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getFrame": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "webRequest": {
                "handlerBehaviorChanged": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "windows": {
                "create": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "get": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getCurrent": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getLastFocused": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              }
            };
            if (Object.keys(apiMetadata).length === 0) {
              throw new Error("api-metadata.json has not been included in browser-polyfill");
            }
            class DefaultWeakMap extends WeakMap {
              constructor(createItem, items = void 0) {
                super(items);
                this.createItem = createItem;
              }
              get(key) {
                if (!this.has(key)) {
                  this.set(key, this.createItem(key));
                }
                return super.get(key);
              }
            }
            const isThenable = (value) => {
              return value && typeof value === "object" && typeof value.then === "function";
            };
            const makeCallback = (promise, metadata) => {
              return (...callbackArgs) => {
                if (extensionAPIs.runtime.lastError) {
                  promise.reject(new Error(extensionAPIs.runtime.lastError.message));
                } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
                  promise.resolve(callbackArgs[0]);
                } else {
                  promise.resolve(callbackArgs);
                }
              };
            };
            const pluralizeArguments = (numArgs) => numArgs == 1 ? "argument" : "arguments";
            const wrapAsyncFunction = (name, metadata) => {
              return function asyncFunctionWrapper(target, ...args) {
                if (args.length < metadata.minArgs) {
                  throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
                }
                if (args.length > metadata.maxArgs) {
                  throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
                }
                return new Promise((resolve, reject) => {
                  if (metadata.fallbackToNoCallback) {
                    try {
                      target[name](...args, makeCallback({
                        resolve,
                        reject
                      }, metadata));
                    } catch (cbError) {
                      console.warn(`${name} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `, cbError);
                      target[name](...args);
                      metadata.fallbackToNoCallback = false;
                      metadata.noCallback = true;
                      resolve();
                    }
                  } else if (metadata.noCallback) {
                    target[name](...args);
                    resolve();
                  } else {
                    target[name](...args, makeCallback({
                      resolve,
                      reject
                    }, metadata));
                  }
                });
              };
            };
            const wrapMethod = (target, method, wrapper) => {
              return new Proxy(method, {
                apply(targetMethod, thisObj, args) {
                  return wrapper.call(thisObj, target, ...args);
                }
              });
            };
            let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
            const wrapObject = (target, wrappers = {}, metadata = {}) => {
              let cache = /* @__PURE__ */ Object.create(null);
              let handlers = {
                has(proxyTarget2, prop) {
                  return prop in target || prop in cache;
                },
                get(proxyTarget2, prop, receiver) {
                  if (prop in cache) {
                    return cache[prop];
                  }
                  if (!(prop in target)) {
                    return void 0;
                  }
                  let value = target[prop];
                  if (typeof value === "function") {
                    if (typeof wrappers[prop] === "function") {
                      value = wrapMethod(target, target[prop], wrappers[prop]);
                    } else if (hasOwnProperty(metadata, prop)) {
                      let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                      value = wrapMethod(target, target[prop], wrapper);
                    } else {
                      value = value.bind(target);
                    }
                  } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
                    value = wrapObject(value, wrappers[prop], metadata[prop]);
                  } else if (hasOwnProperty(metadata, "*")) {
                    value = wrapObject(value, wrappers[prop], metadata["*"]);
                  } else {
                    Object.defineProperty(cache, prop, {
                      configurable: true,
                      enumerable: true,
                      get() {
                        return target[prop];
                      },
                      set(value2) {
                        target[prop] = value2;
                      }
                    });
                    return value;
                  }
                  cache[prop] = value;
                  return value;
                },
                set(proxyTarget2, prop, value, receiver) {
                  if (prop in cache) {
                    cache[prop] = value;
                  } else {
                    target[prop] = value;
                  }
                  return true;
                },
                defineProperty(proxyTarget2, prop, desc) {
                  return Reflect.defineProperty(cache, prop, desc);
                },
                deleteProperty(proxyTarget2, prop) {
                  return Reflect.deleteProperty(cache, prop);
                }
              };
              let proxyTarget = Object.create(target);
              return new Proxy(proxyTarget, handlers);
            };
            const wrapEvent = (wrapperMap) => ({
              addListener(target, listener, ...args) {
                target.addListener(wrapperMap.get(listener), ...args);
              },
              hasListener(target, listener) {
                return target.hasListener(wrapperMap.get(listener));
              },
              removeListener(target, listener) {
                target.removeListener(wrapperMap.get(listener));
              }
            });
            const onRequestFinishedWrappers = new DefaultWeakMap((listener) => {
              if (typeof listener !== "function") {
                return listener;
              }
              return function onRequestFinished(req) {
                const wrappedReq = wrapObject(req, {}, {
                  getContent: {
                    minArgs: 0,
                    maxArgs: 0
                  }
                });
                listener(wrappedReq);
              };
            });
            const onMessageWrappers = new DefaultWeakMap((listener) => {
              if (typeof listener !== "function") {
                return listener;
              }
              return function onMessage(message, sender, sendResponse) {
                let didCallSendResponse = false;
                let wrappedSendResponse;
                let sendResponsePromise = new Promise((resolve) => {
                  wrappedSendResponse = function(response) {
                    didCallSendResponse = true;
                    resolve(response);
                  };
                });
                let result;
                try {
                  result = listener(message, sender, wrappedSendResponse);
                } catch (err) {
                  result = Promise.reject(err);
                }
                const isResultThenable = result !== true && isThenable(result);
                if (result !== true && !isResultThenable && !didCallSendResponse) {
                  return false;
                }
                const sendPromisedResult = (promise) => {
                  promise.then((msg) => {
                    sendResponse(msg);
                  }, (error) => {
                    let message2;
                    if (error && (error instanceof Error || typeof error.message === "string")) {
                      message2 = error.message;
                    } else {
                      message2 = "An unexpected error occurred";
                    }
                    sendResponse({
                      __mozWebExtensionPolyfillReject__: true,
                      message: message2
                    });
                  }).catch((err) => {
                    console.error("Failed to send onMessage rejected reply", err);
                  });
                };
                if (isResultThenable) {
                  sendPromisedResult(result);
                } else {
                  sendPromisedResult(sendResponsePromise);
                }
                return true;
              };
            });
            const wrappedSendMessageCallback = ({
              reject,
              resolve
            }, reply) => {
              if (extensionAPIs.runtime.lastError) {
                if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
                  resolve();
                } else {
                  reject(new Error(extensionAPIs.runtime.lastError.message));
                }
              } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
                reject(new Error(reply.message));
              } else {
                resolve(reply);
              }
            };
            const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
              if (args.length < metadata.minArgs) {
                throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
              }
              if (args.length > metadata.maxArgs) {
                throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
              }
              return new Promise((resolve, reject) => {
                const wrappedCb = wrappedSendMessageCallback.bind(null, {
                  resolve,
                  reject
                });
                args.push(wrappedCb);
                apiNamespaceObj.sendMessage(...args);
              });
            };
            const staticWrappers = {
              devtools: {
                network: {
                  onRequestFinished: wrapEvent(onRequestFinishedWrappers)
                }
              },
              runtime: {
                onMessage: wrapEvent(onMessageWrappers),
                onMessageExternal: wrapEvent(onMessageWrappers),
                sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                  minArgs: 1,
                  maxArgs: 3
                })
              },
              tabs: {
                sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                  minArgs: 2,
                  maxArgs: 3
                })
              }
            };
            const settingMetadata = {
              clear: {
                minArgs: 1,
                maxArgs: 1
              },
              get: {
                minArgs: 1,
                maxArgs: 1
              },
              set: {
                minArgs: 1,
                maxArgs: 1
              }
            };
            apiMetadata.privacy = {
              network: {
                "*": settingMetadata
              },
              services: {
                "*": settingMetadata
              },
              websites: {
                "*": settingMetadata
              }
            };
            return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
          };
          module2.exports = wrapAPIs(chrome);
        } else {
          module2.exports = globalThis.browser;
        }
      });
    }
  });

  // src/content/index.ts
  var import_webextension_polyfill2 = __toESM(require_browser_polyfill(), 1);

  // src/shared/storage.ts
  var import_webextension_polyfill = __toESM(require_browser_polyfill(), 1);

  // src/shared/presets.ts
  var API_PRESETS = {
    gemini: {
      name: "Google Gemini",
      baseUrl: "https://generativelanguage.googleapis.com/v1beta",
      defaultModel: "gemini-3.5-flash-lite",
      suggestedModels: [
        "gemini-3.5-flash-lite",
        "gemini-3.8-flash",
        "gemini-2.5-flash",
        "gemini-2.0-flash"
      ],
      requiresApiKey: true,
      defaultDelayMs: 2600
    },
    groq: {
      name: "Groq (Ultra-Fast LPU)",
      baseUrl: "https://api.groq.com/openai/v1",
      defaultModel: "openai/gpt-oss-20b",
      suggestedModels: [
        "openai/gpt-oss-20b",
        "openai/gpt-oss-120b",
        "qwen/qwen3.8-27b",
        "llama-3.3-70b-versatile"
      ],
      requiresApiKey: true,
      defaultDelayMs: 1200
    },
    deepseek: {
      name: "DeepSeek",
      baseUrl: "https://api.deepseek.com/v1",
      defaultModel: "deepseek-chat",
      suggestedModels: [
        "deepseek-chat",
        "deepseek-reasoner"
      ],
      requiresApiKey: true,
      defaultDelayMs: 1e3
    },
    openrouter: {
      name: "OpenRouter",
      baseUrl: "https://openrouter.ai/api/v1",
      defaultModel: "google/gemini-2.0-flash-001",
      suggestedModels: [
        "google/gemini-2.0-flash-001",
        "openai/gpt-oss-120b",
        "meta-llama/llama-3.3-70b-instruct",
        "deepseek/deepseek-chat"
      ],
      requiresApiKey: true,
      defaultDelayMs: 1200
    },
    openai: {
      name: "OpenAI Official",
      baseUrl: "https://api.openai.com/v1",
      defaultModel: "gpt-4o-mini",
      suggestedModels: [
        "gpt-4o-mini",
        "gpt-4o"
      ],
      requiresApiKey: true,
      defaultDelayMs: 1e3
    },
    ollama: {
      name: "Local Ollama (Offline)",
      baseUrl: "http://localhost:11434/v1",
      defaultModel: "openai/gpt-oss-20b",
      suggestedModels: [
        "openai/gpt-oss-20b",
        "qwen2.5:7b",
        "llama3.2:3b"
      ],
      requiresApiKey: false,
      defaultDelayMs: 0
    },
    custom: {
      name: "T\xF9y ch\u1EC9nh (Custom Endpoint)",
      baseUrl: "http://localhost:8000/v1",
      defaultModel: "custom-model",
      suggestedModels: ["custom-model"],
      requiresApiKey: false,
      defaultDelayMs: 1e3
    }
  };
  var DEFAULT_SETTINGS = {
    activeProvider: "gemini",
    providers: {
      gemini: {
        type: "gemini",
        name: API_PRESETS.gemini.name,
        baseUrl: API_PRESETS.gemini.baseUrl,
        apiKey: "",
        model: API_PRESETS.gemini.defaultModel
      },
      groq: {
        type: "groq",
        name: API_PRESETS.groq.name,
        baseUrl: API_PRESETS.groq.baseUrl,
        apiKey: "",
        model: API_PRESETS.groq.defaultModel
      },
      deepseek: {
        type: "deepseek",
        name: API_PRESETS.deepseek.name,
        baseUrl: API_PRESETS.deepseek.baseUrl,
        apiKey: "",
        model: API_PRESETS.deepseek.defaultModel
      },
      openrouter: {
        type: "openrouter",
        name: API_PRESETS.openrouter.name,
        baseUrl: API_PRESETS.openrouter.baseUrl,
        apiKey: "",
        model: API_PRESETS.openrouter.defaultModel
      },
      openai: {
        type: "openai",
        name: API_PRESETS.openai.name,
        baseUrl: API_PRESETS.openai.baseUrl,
        apiKey: "",
        model: API_PRESETS.openai.defaultModel
      },
      ollama: {
        type: "ollama",
        name: API_PRESETS.ollama.name,
        baseUrl: API_PRESETS.ollama.baseUrl,
        apiKey: "",
        model: API_PRESETS.ollama.defaultModel
      },
      custom: {
        type: "custom",
        name: API_PRESETS.custom.name,
        baseUrl: API_PRESETS.custom.baseUrl,
        apiKey: "",
        model: API_PRESETS.custom.defaultModel
      }
    },
    targetLanguage: "Ti\u1EBFng Vi\u1EC7t",
    bubbleTheme: "light",
    autoScrollSpeed: 3,
    autoPrefetch: true,
    activeOcrModelId: "paddle-en-slim",
    rateLimitDelayMs: 1200
  };

  // src/shared/storage.ts
  var SETTINGS_KEY = "speedyslate_settings";
  var StorageService = class {
    /**
     * Retrieves user settings, merging with default settings if missing
     */
    static async getSettings() {
      try {
        const data = await import_webextension_polyfill.default.storage.local.get(SETTINGS_KEY);
        if (!data || !data[SETTINGS_KEY]) {
          return DEFAULT_SETTINGS;
        }
        const saved = data[SETTINGS_KEY];
        return {
          ...DEFAULT_SETTINGS,
          ...saved,
          providers: {
            ...DEFAULT_SETTINGS.providers,
            ...saved.providers || {}
          }
        };
      } catch (err) {
        console.error("[SpeedySlate] Failed to read settings, fallback to defaults:", err);
        return DEFAULT_SETTINGS;
      }
    }
    /**
     * Persists entire settings object
     */
    static async saveSettings(settings) {
      await import_webextension_polyfill.default.storage.local.set({ [SETTINGS_KEY]: settings });
    }
    /**
     * Updates configuration for a specific provider
     */
    static async updateProviderConfig(providerType, config) {
      const current = await this.getSettings();
      current.providers[providerType] = {
        ...current.providers[providerType],
        ...config
      };
      await this.saveSettings(current);
      return current;
    }
    /**
     * Sets active provider
     */
    static async setActiveProvider(providerType) {
      const current = await this.getSettings();
      current.activeProvider = providerType;
      await this.saveSettings(current);
    }
  };

  // src/content/hud/chubby-icons.ts
  var ChubbyIcons = class {
    static bolt(size = 18, color = "currentColor") {
      return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <path d="M13 2.5L5 13H12L11 21.5L19 11H12L13 2.5Z" 
          fill="${color}" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `.trim();
    }
    static play(size = 16, color = "currentColor") {
      return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <path d="M7 5.5C7 4.5 8.1 3.9 8.9 4.4L18.4 10.4C19.2 10.9 19.2 12.1 18.4 12.6L8.9 18.6C8.1 19.1 7 18.5 7 17.5V5.5Z" 
          fill="${color}" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `.trim();
    }
    static pause(size = 16, color = "currentColor") {
      return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <rect x="6" y="5" width="4" height="14" rx="2" fill="${color}"/>
        <rect x="14" y="5" width="4" height="14" rx="2" fill="${color}"/>
      </svg>
    `.trim();
    }
    static checkCircle(size = 16, color = "currentColor") {
      return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <circle cx="12" cy="12" r="9" stroke="${color}" stroke-width="2.5"/>
        <path d="M8.5 12.5L10.8 14.8L15.5 9.5" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `.trim();
    }
    static eye(size = 16, color = "currentColor") {
      return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <path d="M2.5 12C4.5 7.5 8 5 12 5C16 5 19.5 7.5 21.5 12C19.5 16.5 16 19 12 19C8 19 4.5 16.5 2.5 12Z" 
          stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="12" cy="12" r="3.2" fill="${color}"/>
      </svg>
    `.trim();
    }
    static broom(size = 16, color = "currentColor") {
      return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <path d="M18 3L21 6L13.5 13.5L10.5 10.5L18 3Z" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10.5 10.5L4 17C3.5 17.5 3.5 18.5 4 19L5 20C5.5 20.5 6.5 20.5 7 20L13.5 13.5" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M3 21L7 21" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    `.trim();
    }
    static document(size = 16, color = "currentColor") {
      return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <rect x="5" y="3.5" width="14" height="17" rx="3.5" stroke="${color}" stroke-width="2.5"/>
        <path d="M9 8.5H15M9 12H15M9 15.5H12.5" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    `.trim();
    }
    static book(size = 15, color = "currentColor") {
      return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <path d="M4 19.5C5.5 18.5 7.5 18 10 18C12 18 13.5 18.5 14.5 19.5V5.5C13.5 4.5 12 4 10 4C7.5 4 5.5 4.5 4 5.5V19.5Z" 
          stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M20 19.5C18.5 18.5 16.5 18 14 18C12 18 10.5 18.5 9.5 19.5V5.5C10.5 4.5 12 4 14 4C16.5 4 18.5 4.5 20 5.5V19.5Z" 
          stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `.trim();
    }
    static close(size = 13, color = "currentColor") {
      return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <path d="M6 6L18 18M18 6L6 18" stroke="${color}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `.trim();
    }
    static sparkles(size = 16, color = "currentColor") {
      return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <path d="M12 3C12 7.5 14.5 10 19 10C14.5 10 12 12.5 12 17C12 12.5 9.5 10 5 10C9.5 10 12 7.5 12 3Z" 
          fill="${color}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="19" cy="18" r="1.5" fill="${color}"/>
        <circle cx="5" cy="4" r="1.5" fill="${color}"/>
      </svg>
    `.trim();
    }
    static pulseDot(color = "#10b981") {
      return `
      <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background-color:${color}; box-shadow:0 0 8px ${color}; margin-right:6px; flex-shrink:0;"></span>
    `.trim();
    }
  };

  // src/content/hud/hud.ts
  var FloatingHud = class {
    container;
    miniBadge;
    translateBtn;
    progressLabel;
    eyeBtn;
    clearBtn;
    logDot;
    logTicker;
    logListContainer;
    isVisible = true;
    state = "idle";
    showLogHistory = false;
    logs = [];
    callbacks;
    constructor(callbacks) {
      this.callbacks = callbacks;
      this.miniBadge = document.createElement("div");
      this.miniBadge.id = "speedyslate-mini-badge";
      this.initMiniBadge();
      this.container = document.createElement("div");
      this.container.id = "speedyslate-hud-root";
      this.render();
      this.makeDraggable(this.container);
      this.mountToBody();
    }
    mountToBody() {
      const tryMount = () => {
        const root = document.body || document.documentElement;
        if (root) {
          if (!document.getElementById("speedyslate-mini-badge")) {
            root.appendChild(this.miniBadge);
          }
          if (!document.getElementById("speedyslate-hud-root")) {
            root.appendChild(this.container);
          }
        } else {
          setTimeout(tryMount, 50);
        }
      };
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", tryMount);
      } else {
        tryMount();
      }
    }
    log(message, isError = false) {
      const time = (/* @__PURE__ */ new Date()).toLocaleTimeString("vi-VN", { hour12: false });
      const formatted = `[${time}] ${message}`;
      this.logs.unshift(formatted);
      if (this.logs.length > 30) this.logs.pop();
      if (this.logTicker) {
        this.logTicker.textContent = message;
        this.logTicker.style.color = isError ? "#f87171" : "#cbd5e1";
      }
      if (this.logDot) {
        const dotColor = isError ? "#ef4444" : this.state === "translating" ? "#ec4899" : "#10b981";
        this.logDot.innerHTML = ChubbyIcons.pulseDot(dotColor);
      }
      if (this.logListContainer) {
        this.logListContainer.innerHTML = this.logs.map((l) => `<div style="padding: 3px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">${l}</div>`).join("");
      }
    }
    updateStatus(translatedCount, totalCount) {
      if (this.progressLabel) {
        this.progressLabel.textContent = `${translatedCount} / ${totalCount} trang`;
      }
      if (totalCount > 0 && translatedCount >= totalCount && this.state === "translating") {
        this.setState("completed");
      }
    }
    getState() {
      return this.state;
    }
    setState(state) {
      this.state = state;
      if (!this.translateBtn) return;
      switch (state) {
        case "idle":
          this.translateBtn.innerHTML = `
          <div style="display:flex; align-items:center; justify-content:center; gap:8px;">
            ${ChubbyIcons.play(16, "#ffffff")}
            <span>B\u1EAFt \u0111\u1EA7u d\u1ECBch truy\u1EC7n</span>
          </div>
        `;
          this.translateBtn.style.background = "linear-gradient(135deg, #6366f1, #8b5cf6)";
          this.translateBtn.style.boxShadow = "0 4px 16px rgba(99, 102, 241, 0.4)";
          break;
        case "translating":
          this.translateBtn.innerHTML = `
          <div style="display:flex; align-items:center; justify-content:center; gap:8px;">
            ${ChubbyIcons.pause(16, "#ffffff")}
            <span>\u0110ang d\u1ECBch... (B\u1EA5m t\u1EA1m d\u1EEBng)</span>
          </div>
        `;
          this.translateBtn.style.background = "linear-gradient(135deg, #ec4899, #f43f5e)";
          this.translateBtn.style.boxShadow = "0 4px 16px rgba(236, 72, 153, 0.45)";
          break;
        case "paused":
          this.translateBtn.innerHTML = `
          <div style="display:flex; align-items:center; justify-content:center; gap:8px;">
            ${ChubbyIcons.play(16, "#ffffff")}
            <span>Ti\u1EBFp t\u1EE5c d\u1ECBch truy\u1EC7n</span>
          </div>
        `;
          this.translateBtn.style.background = "linear-gradient(135deg, #f59e0b, #d97706)";
          this.translateBtn.style.boxShadow = "0 4px 16px rgba(245, 158, 11, 0.4)";
          break;
        case "completed":
          this.translateBtn.innerHTML = `
          <div style="display:flex; align-items:center; justify-content:center; gap:8px;">
            ${ChubbyIcons.checkCircle(16, "#ffffff")}
            <span>\u0110\xE3 d\u1ECBch xong to\xE0n b\u1ED9</span>
          </div>
        `;
          this.translateBtn.style.background = "linear-gradient(135deg, #10b981, #059669)";
          this.translateBtn.style.boxShadow = "0 4px 16px rgba(16, 185, 129, 0.4)";
          break;
      }
    }
    initMiniBadge() {
      Object.assign(this.miniBadge.style, {
        position: "fixed",
        bottom: "90px",
        right: "20px",
        zIndex: "2147483647",
        background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
        color: "#ffffff",
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        boxShadow: "0 8px 25px rgba(236, 72, 153, 0.5), 0 0 12px rgba(139, 92, 246, 0.5)",
        display: "none",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        userSelect: "none",
        border: "2px solid rgba(255, 255, 255, 0.8)",
        transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)"
      });
      this.miniBadge.innerHTML = ChubbyIcons.bolt(22, "#ffffff");
      this.miniBadge.title = "M\u1EDF b\u1EA3ng \u0111i\u1EC1u khi\u1EC3n SpeedySlate";
      this.miniBadge.onmouseenter = () => this.miniBadge.style.transform = "scale(1.12)";
      this.miniBadge.onmouseleave = () => this.miniBadge.style.transform = "scale(1)";
      this.miniBadge.onclick = () => this.toggleExpand(true);
    }
    toggleExpand(expand) {
      this.container.style.display = expand ? "flex" : "none";
      this.miniBadge.style.display = expand ? "none" : "flex";
    }
    render() {
      Object.assign(this.container.style, {
        position: "fixed",
        bottom: "90px",
        right: "20px",
        zIndex: "2147483647",
        background: "rgba(16, 16, 26, 0.92)",
        backdropFilter: "blur(20px) saturate(180%)",
        color: "#ffffff",
        padding: "14px 16px",
        borderRadius: "18px",
        boxShadow: "0 16px 45px rgba(0, 0, 0, 0.7), 0 0 20px rgba(139, 92, 246, 0.25)",
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: "13px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        border: "1px solid rgba(168, 85, 247, 0.35)",
        userSelect: "none",
        width: "320px",
        maxWidth: "90vw"
      });
      const headerRow = document.createElement("div");
      headerRow.style.cssText = `
      display: flex; align-items: center; justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 8px; cursor: move;
    `;
      const titleBox = document.createElement("div");
      titleBox.style.cssText = "display: flex; align-items: center; gap: 7px;";
      titleBox.innerHTML = `
      ${ChubbyIcons.bolt(18, "#ec4899")}
      <span style="background: linear-gradient(90deg, #f472b6, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800; font-size: 14px; letter-spacing: -0.3px;">SpeedySlate</span>
      <span style="font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 8px; background: rgba(168,85,247,0.22); color: #c084fc; border: 1px solid rgba(168,85,247,0.35);">AI</span>
    `;
      const minBtn = document.createElement("button");
      minBtn.innerHTML = ChubbyIcons.close(12, "#94a3b8");
      minBtn.title = "Thu nh\u1ECF c\u1EEDa s\u1ED5";
      minBtn.style.cssText = `
      background: rgba(255, 255, 255, 0.08); color: #94a3b8; border: none; border-radius: 8px;
      padding: 4px 6px; cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
    `;
      minBtn.onmouseenter = () => {
        minBtn.style.background = "rgba(239, 68, 68, 0.3)";
        minBtn.innerHTML = ChubbyIcons.close(12, "#ffffff");
      };
      minBtn.onmouseleave = () => {
        minBtn.style.background = "rgba(255, 255, 255, 0.08)";
        minBtn.innerHTML = ChubbyIcons.close(12, "#94a3b8");
      };
      minBtn.onclick = () => this.toggleExpand(false);
      headerRow.appendChild(titleBox);
      headerRow.appendChild(minBtn);
      this.translateBtn = document.createElement("button");
      this.translateBtn.style.cssText = `
      background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff;
      border: none; border-radius: 12px; padding: 10px 14px; font-weight: 700;
      cursor: pointer; font-size: 13px; width: 100%; transition: all 0.2s;
      box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4); text-align: center;
    `;
      this.translateBtn.onmousedown = () => this.translateBtn.style.transform = "scale(0.97)";
      this.translateBtn.onmouseup = () => this.translateBtn.style.transform = "scale(1)";
      this.translateBtn.onmouseenter = () => this.translateBtn.style.filter = "brightness(1.1)";
      this.translateBtn.onmouseleave = () => {
        this.translateBtn.style.transform = "scale(1)";
        this.translateBtn.style.filter = "brightness(1)";
      };
      this.translateBtn.onclick = () => {
        if (this.state === "idle" || this.state === "paused" || this.state === "completed") {
          this.setState("translating");
        } else {
          this.setState("paused");
        }
        this.callbacks.onToggleTranslate();
      };
      this.setState("idle");
      const row2 = document.createElement("div");
      row2.style.cssText = "display: flex; align-items: center; justify-content: space-between; gap: 8px;";
      const progressWrapper = document.createElement("div");
      progressWrapper.style.cssText = `
      display: flex; align-items: center; gap: 6px; background: rgba(255, 255, 255, 0.06);
      padding: 5px 10px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.08);
    `;
      const bookIconSpan = document.createElement("span");
      bookIconSpan.innerHTML = ChubbyIcons.book(15, "#38bdf8");
      this.progressLabel = document.createElement("span");
      this.progressLabel.textContent = "0 / 0 trang";
      this.progressLabel.style.cssText = "font-weight: 700; color: #f1f5f9; font-size: 12px;";
      progressWrapper.appendChild(bookIconSpan);
      progressWrapper.appendChild(this.progressLabel);
      const toolsWrapper = document.createElement("div");
      toolsWrapper.style.cssText = "display: flex; gap: 6px;";
      this.eyeBtn = document.createElement("button");
      this.eyeBtn.title = "\u1EA8n / Hi\u1EC7n ch\u1EEF d\u1ECBch (Xem tranh g\u1ED1c)";
      this.eyeBtn.innerHTML = ChubbyIcons.eye(15, "#e2e8f0");
      this.eyeBtn.style.cssText = `
      background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 9px; color: #fff; padding: 6px 9px; cursor: pointer; display: flex; align-items: center;
      transition: background 0.2s;
    `;
      this.eyeBtn.onclick = () => {
        this.isVisible = !this.isVisible;
        this.eyeBtn.style.opacity = this.isVisible ? "1" : "0.4";
        this.callbacks.onToggleVisibility(this.isVisible);
      };
      this.clearBtn = document.createElement("button");
      this.clearBtn.title = "D\u1ECDn s\u1EA1ch cache b\u1EA3n d\u1ECBch c\u1EE7a ch\u01B0\u01A1ng n\xE0y \u0111\u1EC3 d\u1ECBch l\u1EA1i";
      this.clearBtn.innerHTML = ChubbyIcons.broom(15, "#e2e8f0");
      this.clearBtn.style.cssText = `
      background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 9px; color: #fff; padding: 6px 9px; cursor: pointer; display: flex; align-items: center;
      transition: background 0.2s;
    `;
      this.clearBtn.onclick = () => this.callbacks.onClearChapterCache();
      const logToggleBtn = document.createElement("button");
      logToggleBtn.title = "B\u1EADt / T\u1EAFt xem nh\u1EADt k\xFD ho\u1EA1t \u0111\u1ED9ng";
      logToggleBtn.innerHTML = ChubbyIcons.document(15, "#e2e8f0");
      logToggleBtn.style.cssText = `
      background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 9px; color: #fff; padding: 6px 9px; cursor: pointer; display: flex; align-items: center;
      transition: background 0.2s;
    `;
      logToggleBtn.onclick = () => {
        this.showLogHistory = !this.showLogHistory;
        this.logListContainer.style.display = this.showLogHistory ? "block" : "none";
      };
      toolsWrapper.appendChild(this.eyeBtn);
      toolsWrapper.appendChild(this.clearBtn);
      toolsWrapper.appendChild(logToggleBtn);
      row2.appendChild(progressWrapper);
      row2.appendChild(toolsWrapper);
      const logRow = document.createElement("div");
      logRow.style.cssText = `
      background: rgba(0, 0, 0, 0.45); border-radius: 10px; padding: 7px 10px;
      font-size: 11px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      display: flex; align-items: center; gap: 4px; overflow: hidden; text-overflow: ellipsis;
      white-space: nowrap; border: 1px solid rgba(255, 255, 255, 0.06);
    `;
      this.logDot = document.createElement("span");
      this.logDot.innerHTML = ChubbyIcons.pulseDot("#10b981");
      this.logTicker = document.createElement("span");
      this.logTicker.textContent = "SpeedySlate s\u1EB5n s\xE0ng";
      this.logTicker.style.color = "#cbd5e1";
      this.logTicker.style.overflow = "hidden";
      this.logTicker.style.textOverflow = "ellipsis";
      logRow.appendChild(this.logDot);
      logRow.appendChild(this.logTicker);
      this.logListContainer = document.createElement("div");
      this.logListContainer.style.cssText = `
      max-height: 130px; overflow-y: auto; background: rgba(0, 0, 0, 0.6); border-radius: 10px;
      padding: 6px 10px; font-size: 10px; font-family: ui-monospace, SFMono-Regular, monospace;
      color: #94a3b8; display: none; border: 1px solid rgba(255, 255, 255, 0.08);
    `;
      this.container.appendChild(headerRow);
      this.container.appendChild(this.translateBtn);
      this.container.appendChild(row2);
      this.container.appendChild(logRow);
      this.container.appendChild(this.logListContainer);
    }
    makeDraggable(el) {
      let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      const header = el.firstElementChild;
      if (header) {
        header.onmousedown = (e) => {
          if (e.target.tagName === "BUTTON" || e.target.closest("button")) return;
          e.preventDefault();
          pos3 = e.clientX;
          pos4 = e.clientY;
          document.onmouseup = () => {
            document.onmouseup = null;
            document.onmousemove = null;
          };
          document.onmousemove = (me) => {
            me.preventDefault();
            pos1 = pos3 - me.clientX;
            pos2 = pos4 - me.clientY;
            pos3 = me.clientX;
            pos4 = me.clientY;
            el.style.bottom = "auto";
            el.style.right = "auto";
            el.style.top = `${el.offsetTop - pos2}px`;
            el.style.left = `${el.offsetLeft - pos1}px`;
          };
        };
      }
    }
  };

  // src/content/overlay/overlay-renderer.ts
  var OverlayRenderer = class {
    /**
     * Renders translated speech bubbles over the wrapped image
     */
    static renderDialogues(wrapper, dialogues, naturalWidth, naturalHeight, theme = "light") {
      const existing = wrapper.querySelectorAll(".speedyslate-bubble");
      existing.forEach((el) => el.remove());
      for (const item of dialogues) {
        if (!item.translatedText) continue;
        const box = item.box;
        const topPct = box.y / naturalHeight * 100;
        const leftPct = box.x / naturalWidth * 100;
        const widthPct = box.width / naturalWidth * 100;
        const heightPct = box.height / naturalHeight * 100;
        const bubble = document.createElement("div");
        bubble.className = "speedyslate-bubble";
        bubble.id = item.id;
        bubble.title = `G\u1ED1c: "${item.originalText}" (R\xEA chu\u1ED9t \u0111\u1EC3 soi ch\u1EEF g\u1ED1c)`;
        const isDark = theme === "dark" || theme === "auto" && item.isDarkBackground;
        const bg = isDark ? "#111111" : "#ffffff";
        const textColor = isDark ? "#ffffff" : "#000000";
        Object.assign(bubble.style, {
          position: "absolute",
          top: `${topPct}%`,
          left: `${leftPct}%`,
          width: `${widthPct}%`,
          minHeight: `${heightPct}%`,
          backgroundColor: bg,
          color: textColor,
          border: "none",
          borderRadius: "2px",
          boxSizing: "border-box",
          padding: "1px 2px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          fontFamily: "'Comic Sans MS', 'Bangers', 'Segoe UI', system-ui, sans-serif",
          fontWeight: "bold",
          lineHeight: "1.2",
          zIndex: "50",
          cursor: "pointer",
          transition: "opacity 0.15s ease-in-out",
          userSelect: "text",
          wordBreak: "break-word",
          boxShadow: "none"
        });
        const fontSize = this.calculateFontSize(box.width, box.height, item.translatedText.length);
        bubble.style.fontSize = `${fontSize}px`;
        bubble.textContent = item.translatedText;
        bubble.addEventListener("mouseenter", () => {
          bubble.style.opacity = "0.08";
        });
        bubble.addEventListener("mouseleave", () => {
          bubble.style.opacity = "1";
        });
        wrapper.appendChild(bubble);
      }
    }
    /**
     * Adaptive font sizing heuristic to fit Vietnamese text inside comic bounding box
     */
    static calculateFontSize(boxW, boxH, textLength) {
      const area = boxW * boxH;
      let base = Math.sqrt(area / Math.max(1, textLength)) * 0.9;
      base = Math.max(11, Math.min(22, Math.round(base)));
      return base;
    }
    /**
     * Toggles visibility of all translated overlays on the page
     */
    static setAllVisibility(visible) {
      const bubbles = document.querySelectorAll(".speedyslate-bubble");
      bubbles.forEach((b) => {
        b.style.display = visible ? "flex" : "none";
      });
    }
  };

  // src/content/priority-queue.ts
  var OrderedTaskQueue = class {
    queue = [];
    activeCount = 0;
    maxConcurrency = 1;
    processor;
    isPaused = false;
    pendingKeys = /* @__PURE__ */ new Set();
    keySelector;
    constructor(processor, maxConcurrency = 1, keySelector) {
      this.processor = processor;
      this.maxConcurrency = maxConcurrency;
      this.keySelector = keySelector;
    }
    enqueue(task) {
      const key = this.keySelector ? this.keySelector(task) : task.index;
      if (this.pendingKeys.has(key)) return;
      this.pendingKeys.add(key);
      this.queue.push(task);
      this.queue.sort((a, b) => a.index - b.index);
      this.dispatch();
    }
    pause() {
      this.isPaused = true;
    }
    resume() {
      if (!this.isPaused) return;
      this.isPaused = false;
      this.dispatch();
    }
    getIsPaused() {
      return this.isPaused;
    }
    clear() {
      this.queue = [];
      this.pendingKeys.clear();
    }
    size() {
      return this.queue.length + this.activeCount;
    }
    async dispatch() {
      if (this.isPaused) return;
      while (this.activeCount < this.maxConcurrency && this.queue.length > 0) {
        const task = this.queue.shift();
        if (!task) break;
        this.activeCount++;
        this.runTask(task);
      }
    }
    async runTask(task) {
      const key = this.keySelector ? this.keySelector(task) : task.index;
      try {
        await this.processor(task);
      } catch (err) {
        console.error(`[SpeedySlate Queue] Loi xu ly task index ${task.index}:`, err);
      } finally {
        this.pendingKeys.delete(key);
        this.activeCount--;
        this.dispatch();
      }
    }
  };

  // src/content/toonhey-adapter.ts
  var ToonheyAdapter = class {
    static CONTAINER_SELECTORS = [
      "#reader-area",
      "#readerarea",
      ".reading-content",
      "#reader-container",
      ".reader-container",
      ".chapter-images",
      ".episode-images",
      "#chapter-images",
      "#episode-images",
      ".chapter-body",
      ".episode-body",
      ".entry-content",
      'div[id*="episode"]',
      'div[class*="episode"]',
      'div[id*="chapter"]',
      'div[class*="chapter"]',
      'div[class*="reading"]'
    ];
    static EXCLUDED_CONTAINER_SELECTORS = [
      "header",
      "footer",
      "nav",
      "aside",
      "#sidebar",
      ".sidebar",
      "#comments",
      ".comments",
      ".comment",
      "#recommendations",
      ".recommendations",
      ".recommended",
      "#related",
      ".related",
      ".related-manga",
      ".related-posts",
      "#trending",
      ".trending",
      ".popular",
      ".latest",
      ".manga-list",
      ".comics-grid",
      ".grid-manga",
      ".carousel",
      ".slider",
      ".swiper",
      "#speedyslate-hud-root",
      "#speedyslate-mini-badge",
      "#speedyslate-missing-banner"
    ];
    /**
     * Finds all comic strip images in the reader for the current episode
     */
    static getChapterImages() {
      for (const selector of this.CONTAINER_SELECTORS) {
        const container = document.querySelector(selector);
        if (container && !this.isInsideExcludedZone(container)) {
          const imgs = Array.from(container.querySelectorAll("img"));
          const validComicPanels = imgs.filter((img) => this.isGenuineComicPanel(img));
          if (validComicPanels.length >= 2) {
            return validComicPanels;
          }
        }
      }
      const allImgs = Array.from(document.querySelectorAll("img"));
      const candidatePanels = allImgs.filter((img) => this.isGenuineComicPanel(img));
      if (candidatePanels.length === 0) return [];
      const containerCounts = /* @__PURE__ */ new Map();
      for (const img of candidatePanels) {
        const parentContainer = img.closest("div, section");
        if (parentContainer && !this.isInsideExcludedZone(parentContainer)) {
          const list = containerCounts.get(parentContainer) || [];
          list.push(img);
          containerCounts.set(parentContainer, list);
        }
      }
      let bestGroup = [];
      for (const group of containerCounts.values()) {
        if (group.length > bestGroup.length) {
          bestGroup = group;
        }
      }
      return bestGroup.length >= 2 ? bestGroup : candidatePanels;
    }
    /**
     * Strictly determines if an <img> element is a comic panel of the current episode
     */
    static isGenuineComicPanel(img) {
      if (this.isInsideExcludedZone(img)) {
        return false;
      }
      if (img.classList.contains("speedyslate-ignore") || img.style.display === "none") {
        return false;
      }
      const anchor = img.closest("a");
      if (anchor && anchor.href) {
        const anchorHref = anchor.href.toLowerCase();
        const currentPath = window.location.pathname.toLowerCase();
        if (!anchorHref.includes(currentPath) && (anchorHref.includes("/manga/") || anchorHref.includes("/en/"))) {
          return false;
        }
      }
      const src = (img.currentSrc || img.src || img.dataset.src || img.getAttribute("data-src") || "").toLowerCase();
      const className = (img.className || "").toLowerCase();
      const id = (img.id || "").toLowerCase();
      const ignoredKeywords = [
        "logo",
        "avatar",
        "icon",
        "emoji",
        "badge",
        "button",
        "social",
        "banner",
        "advertisement",
        "facebook",
        "twitter",
        "discord",
        "tracker",
        "gravatar",
        "loading",
        "spinner",
        "placeholder",
        "thumb",
        "cover",
        "recommend",
        "related"
      ];
      for (const kw of ignoredKeywords) {
        if (src.includes(kw) || className.includes(kw) || id.includes(kw)) {
          return false;
        }
      }
      if (src.endsWith(".svg") || src.includes(".svg?")) {
        return false;
      }
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        if (img.naturalWidth < 150 || img.naturalHeight < 150) {
          return false;
        }
      }
      const hasSource = Boolean(
        img.src || img.dataset.src || img.getAttribute("data-src") || img.getAttribute("data-original") || img.getAttribute("data-lazy-src") || img.getAttribute("data-actual-src")
      );
      return hasSource;
    }
    /**
     * Checks if an element is inside an excluded zone (sidebar, footer, recommendations, etc.)
     */
    static isInsideExcludedZone(el) {
      const selector = this.EXCLUDED_CONTAINER_SELECTORS.join(", ");
      return Boolean(el.closest(selector));
    }
    /**
     * Force-loads a single image by swapping lazy data-src attributes to active src
     */
    static forceTriggerImage(img) {
      const realSrc = img.dataset.src || img.getAttribute("data-src") || img.getAttribute("data-original") || img.getAttribute("data-lazy-src") || img.getAttribute("data-actual-src");
      if (realSrc && img.src !== realSrc) {
        img.src = realSrc;
      }
      img.loading = "eager";
      img.decoding = "async";
      img.removeAttribute("data-src");
      img.removeAttribute("data-lazy-src");
      img.classList.remove("lazy", "lazyload", "loading");
    }
    /**
     * Force-loads ALL images in the chapter simultaneously without requiring manual scrolling
     */
    static forceLoadAll(images) {
      for (const img of images) {
        this.forceTriggerImage(img);
      }
    }
    /**
     * Wraps an image inside a relative container to allow absolute percentage overlays
     */
    static wrapImage(img) {
      if (img.parentElement?.classList.contains("speedyslate-wrapper")) {
        return img.parentElement;
      }
      const wrapper = document.createElement("div");
      wrapper.className = "speedyslate-wrapper";
      wrapper.style.position = "relative";
      wrapper.style.display = "block";
      wrapper.style.width = "100%";
      wrapper.style.margin = "0 auto";
      wrapper.style.lineHeight = "0";
      img.parentElement?.insertBefore(wrapper, img);
      wrapper.appendChild(img);
      return wrapper;
    }
  };

  // src/content/page-badge.ts
  var PageBadgeManager = class {
    static BADGE_CLASS = "speedyslate-page-badge";
    /**
     * Mounts or retrieves existing page badge on the comic image wrapper
     */
    static ensureBadge(wrapper, pageIndex) {
      let badge = wrapper.querySelector(`.${this.BADGE_CLASS}`);
      if (badge) return badge;
      badge = document.createElement("div");
      badge.className = this.BADGE_CLASS;
      badge.dataset.pageIndex = String(pageIndex);
      Object.assign(badge.style, {
        position: "absolute",
        top: "12px",
        left: "12px",
        zIndex: "60",
        background: "rgba(15, 15, 26, 0.85)",
        backdropFilter: "blur(10px) saturate(180%)",
        border: "1px solid rgba(168, 85, 247, 0.35)",
        borderRadius: "20px",
        padding: "4px 10px",
        color: "#ffffff",
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        fontWeight: "700",
        fontSize: "11px",
        letterSpacing: "0.2px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.6)",
        pointerEvents: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        transition: "all 0.25s ease-in-out",
        userSelect: "none"
      });
      this.renderBadgeContent(badge, pageIndex, "idle");
      wrapper.appendChild(badge);
      return badge;
    }
    /**
     * Updates badge status and message
     */
    static updateBadge(wrapper, pageIndex, status, count) {
      const badge = this.ensureBadge(wrapper, pageIndex);
      this.renderBadgeContent(badge, pageIndex, status, count);
    }
    static renderBadgeContent(badge, pageIndex, status, count) {
      let dotColor = "#64748b";
      let statusText = "";
      let isPulsing = false;
      switch (status) {
        case "idle":
          dotColor = "#64748b";
          statusText = "";
          break;
        case "ocr_running":
          dotColor = "#a855f7";
          statusText = "Qu\xE9t OCR...";
          isPulsing = true;
          break;
        case "ocr_done":
          dotColor = "#3b82f6";
          statusText = count !== void 0 ? `${count} c\xE2u` : "\u0110\xE3 qu\xE9t";
          break;
        case "translating":
          dotColor = "#ec4899";
          statusText = "\u0110ang d\u1ECBch...";
          isPulsing = true;
          break;
        case "translated":
          dotColor = "#10b981";
          statusText = count !== void 0 ? `${count} c\xE2u` : "\u0110\xE3 d\u1ECBch";
          break;
        case "no_text":
          dotColor = "#475569";
          statusText = "Kh\xF4ng ch\u1EEF";
          break;
        case "error":
          dotColor = "#ef4444";
          statusText = "L\u1ED7i";
          break;
      }
      const pulseAnim = isPulsing ? "animation: speedyslatePulse 1.2s infinite ease-in-out;" : "";
      badge.innerHTML = `
      <style>
        @keyframes speedyslatePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
      </style>
      <span style="width: 7px; height: 7px; border-radius: 50%; background: ${dotColor}; box-shadow: 0 0 6px ${dotColor}; display: inline-block; ${pulseAnim}"></span>
      <span style="color: #f1f5f9; font-weight: 800;">#${pageIndex + 1}</span>
      ${statusText ? `<span style="color: #cbd5e1; font-weight: 500; font-size: 10px;">${statusText}</span>` : ""}
    `;
      if (status === "translated") {
        badge.style.border = "1px solid rgba(16, 185, 129, 0.4)";
      } else if (status === "translating") {
        badge.style.border = "1px solid rgba(236, 72, 153, 0.4)";
      } else if (status === "ocr_running") {
        badge.style.border = "1px solid rgba(168, 85, 247, 0.4)";
      } else {
        badge.style.border = "1px solid rgba(255, 255, 255, 0.12)";
      }
    }
  };

  // src/content/index.ts
  var SpeedySlateContentApp = class {
    settings;
    hud;
    ocrQueue;
    translationQueue;
    images = [];
    completedImages = /* @__PURE__ */ new Set();
    isModelReady = false;
    mutationObserver = null;
    constructor() {
      this.hud = new FloatingHud({
        onToggleTranslate: async () => {
          const currentState = this.hud.getState();
          if (currentState === "translating") {
            await this.handleStartTranslating();
          } else {
            this.ocrQueue?.pause();
            this.translationQueue?.pause();
            this.hud.log("Da tam dung tien trinh dich truyen");
          }
        },
        onToggleVisibility: (visible) => OverlayRenderer.setAllVisibility(visible),
        onClearChapterCache: async () => {
          const resp = await import_webextension_polyfill2.default.runtime.sendMessage({
            action: "CLEAR_CHAPTER_CACHE",
            chapterUrl: window.location.href
          });
          document.querySelectorAll(".speedyslate-bubble").forEach((el) => el.remove());
          this.images.forEach((img, idx) => {
            delete img.dataset.slateStatus;
            if (img.parentElement) {
              PageBadgeManager.updateBadge(img.parentElement, idx, "idle");
            }
          });
          this.completedImages.clear();
          this.ocrQueue?.clear();
          this.translationQueue?.clear();
          this.hud.updateStatus(0, this.images.length);
          this.hud.setState("idle");
          this.hud.log(`Da xoa ${resp?.deleted || 0} ban dich cache cua chuong nay`);
        }
      });
      this.hud.log("SpeedySlate dang khoi tao...");
    }
    async start() {
      console.log("[SpeedySlate] Khoi chay tren trang:", window.location.href);
      try {
        this.settings = await StorageService.getSettings();
      } catch {
        this.hud.log("Dang dung cau hinh mac dinh");
      }
      this.ocrQueue = new OrderedTaskQueue(
        async (task) => this.processOcrTask(task),
        2,
        (t) => t.img
      );
      this.ocrQueue.pause();
      this.translationQueue = new OrderedTaskQueue(
        async (task) => this.processTranslationTask(task),
        1,
        (t) => t.img
      );
      this.translationQueue.pause();
      this.detectImages();
      this.setupMutationObserver();
      this.setupIntersectionObserver();
      await this.restoreCachedTranslations();
      await this.checkModelStatusFromBackground(false);
      if (this.completedImages.size < this.images.length) {
        this.hud.log(`San sang dich. Tim thay ${this.images.length} trang truyen`);
      }
    }
    async handleStartTranslating() {
      if (!this.isModelReady) {
        await this.checkModelStatusFromBackground(true);
        if (!this.isModelReady) {
          this.hud.setState("idle");
          return;
        }
      }
      this.hud.log(`Bat dau dich chuong (${this.images.length} trang)...`);
      ToonheyAdapter.forceLoadAll(this.images);
      this.enqueueAllImages();
      this.ocrQueue.resume();
      this.translationQueue.resume();
    }
    async checkModelStatusFromBackground(showBannerIfMissing) {
      try {
        const resp = await import_webextension_polyfill2.default.runtime.sendMessage({ action: "CHECK_MODEL_STATUS" });
        if (resp?.success && resp.status?.status === "ready") {
          this.isModelReady = true;
          this.hud.log("Model OCR da san sang");
        } else {
          this.isModelReady = false;
          this.hud.log("Chua tai model OCR. Mo popup tien ich de tai (~10MB)", true);
          if (showBannerIfMissing) {
            this.showModelMissingBanner();
          }
        }
      } catch (err) {
        this.hud.log(`Loi kiem tra model: ${err.message}`, true);
      }
    }
    detectImages() {
      const rawImages = ToonheyAdapter.getChapterImages();
      let newFound = 0;
      for (const img of rawImages) {
        if (!this.images.includes(img)) {
          ToonheyAdapter.wrapImage(img);
          this.images.push(img);
          const index = this.images.length - 1;
          if (img.parentElement) {
            PageBadgeManager.ensureBadge(img.parentElement, index);
          }
          newFound++;
        }
      }
      if (newFound > 0) {
        this.hud.updateStatus(this.completedImages.size, this.images.length);
        this.hud.log(`Da phat hien ${this.images.length} trang truyen`);
        if (this.hud.getState() === "translating") {
          this.enqueueAllImages();
        } else {
          this.restoreCachedTranslations();
        }
      }
    }
    async restoreCachedTranslations() {
      if (this.images.length === 0) return;
      const urls = this.images.map((img) => img.dataset.src || img.getAttribute("data-src") || img.src).filter(Boolean);
      try {
        const resp = await import_webextension_polyfill2.default.runtime.sendMessage({
          action: "GET_CHAPTER_TRANSLATIONS",
          imageUrls: urls
        });
        if (resp?.success && resp.translations) {
          const cache = resp.translations;
          let newlyRestored = 0;
          for (let i = 0; i < this.images.length; i++) {
            const img = this.images[i];
            if (this.completedImages.has(img)) continue;
            const url = img.dataset.src || img.getAttribute("data-src") || img.src;
            const cached = cache[url];
            if (cached) {
              const wrapper = img.parentElement;
              if (Array.isArray(cached.dialogues) && cached.dialogues.length > 0) {
                if (wrapper) {
                  OverlayRenderer.renderDialogues(
                    wrapper,
                    cached.dialogues,
                    cached.naturalWidth || img.naturalWidth || 800,
                    cached.naturalHeight || img.naturalHeight || 1200,
                    this.settings?.bubbleTheme || "light"
                  );
                  img.dataset.slateStatus = "translated";
                  PageBadgeManager.updateBadge(wrapper, i, "translated", cached.dialogues.length);
                }
              } else {
                img.dataset.slateStatus = "no_text";
                if (wrapper) {
                  PageBadgeManager.updateBadge(wrapper, i, "no_text");
                }
              }
              this.markImageCompleted(img, false);
              newlyRestored++;
            }
          }
          if (newlyRestored > 0) {
            this.hud.updateStatus(this.completedImages.size, this.images.length);
            this.hud.log(`Da nap tuc thi ${newlyRestored} trang tu Cache (0ms)`);
            if (this.completedImages.size >= this.images.length) {
              this.hud.setState("completed");
            }
          }
        }
      } catch {
      }
    }
    setupMutationObserver() {
      this.mutationObserver = new MutationObserver(() => {
        this.detectImages();
      });
      this.mutationObserver.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true
      });
    }
    setupIntersectionObserver() {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              const index = this.images.indexOf(img);
              if (index !== -1 && !this.completedImages.has(img) && this.hud.getState() === "translating") {
                this.ocrQueue.enqueue({ index, img });
              }
            }
          });
        },
        { root: null, rootMargin: "0px 0px 800px 0px", threshold: 0.01 }
      );
      setInterval(() => {
        this.images.forEach((img) => observer.observe(img));
      }, 2e3);
    }
    enqueueAllImages() {
      for (let i = 0; i < this.images.length; i++) {
        const img = this.images[i];
        if (!this.completedImages.has(img)) {
          this.ocrQueue.enqueue({ index: i, img });
        }
      }
    }
    /**
     * Stage 1: Fast local WebAssembly OCR Pipeline (runs at 100% CPU speed, 0ms artificial delay)
     */
    async processOcrTask(task) {
      if (this.completedImages.has(task.img)) return;
      const img = task.img;
      const imageUrl = img.src;
      const wrapper = img.parentElement;
      if (!wrapper) return;
      if (!img.complete || img.naturalWidth === 0) {
        ToonheyAdapter.forceTriggerImage(img);
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
          setTimeout(resolve, 3e3);
        });
      }
      img.dataset.slateStatus = "ocr_running";
      PageBadgeManager.updateBadge(wrapper, task.index, "ocr_running");
      let dataUrl;
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width || 800;
        canvas.height = img.naturalHeight || img.height || 1200;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        }
      } catch {
      }
      const resp = await import_webextension_polyfill2.default.runtime.sendMessage({
        action: "OCR_IMAGE",
        imageUrl,
        chapterUrl: window.location.href,
        dataUrl
      });
      if (resp?.success) {
        if (resp.cached) {
          if (resp.dialogues && resp.dialogues.length > 0) {
            OverlayRenderer.renderDialogues(
              wrapper,
              resp.dialogues,
              resp.naturalWidth || img.naturalWidth || 800,
              resp.naturalHeight || img.naturalHeight || 1200,
              this.settings?.bubbleTheme || "light"
            );
            img.dataset.slateStatus = "translated";
            PageBadgeManager.updateBadge(wrapper, task.index, "translated", resp.dialogues.length);
          } else {
            img.dataset.slateStatus = "no_text";
            PageBadgeManager.updateBadge(wrapper, task.index, "no_text");
          }
          this.markImageCompleted(img);
          this.hud.log(`Trang #${task.index + 1}: Nap tu Cache (0ms)`);
        } else if (!resp.dialogues || resp.dialogues.length === 0) {
          img.dataset.slateStatus = "no_text";
          PageBadgeManager.updateBadge(wrapper, task.index, "no_text");
          this.markImageCompleted(img);
          this.hud.log(`Trang #${task.index + 1}: Khong co chu`);
        } else {
          img.dataset.slateStatus = "ocr_done";
          PageBadgeManager.updateBadge(wrapper, task.index, "ocr_done", resp.dialogues.length);
          this.hud.log(`Trang #${task.index + 1}: Da quet ${resp.dialogues.length} cau thoai, dang cho dich...`);
          this.translationQueue.enqueue({
            index: task.index,
            img: task.img,
            dialogues: resp.dialogues,
            naturalWidth: resp.naturalWidth || img.naturalWidth || 800,
            naturalHeight: resp.naturalHeight || img.naturalHeight || 1200
          });
        }
      } else {
        img.dataset.slateStatus = "error";
        PageBadgeManager.updateBadge(wrapper, task.index, "error");
        this.hud.log(`Loi OCR trang #${task.index + 1}: ${resp?.error || "Loi khong xac dinh"}`, true);
      }
    }
    /**
     * Stage 2: Rate-limited API Translation Consumer (Gemini/Groq spacing & backoff)
     */
    async processTranslationTask(task) {
      if (this.completedImages.has(task.img)) return;
      const img = task.img;
      const wrapper = img.parentElement;
      if (!wrapper) return;
      img.dataset.slateStatus = "translating";
      PageBadgeManager.updateBadge(wrapper, task.index, "translating", task.dialogues.length);
      this.hud.log(`Trang #${task.index + 1}: Dang dich ${task.dialogues.length} cau thoai...`);
      const resp = await import_webextension_polyfill2.default.runtime.sendMessage({
        action: "TRANSLATE_DIALOGUES",
        imageUrl: img.src,
        chapterUrl: window.location.href,
        dialogues: task.dialogues,
        naturalWidth: task.naturalWidth,
        naturalHeight: task.naturalHeight
      });
      if (resp?.success && Array.isArray(resp.dialogues)) {
        OverlayRenderer.renderDialogues(
          wrapper,
          resp.dialogues,
          task.naturalWidth,
          task.naturalHeight,
          this.settings?.bubbleTheme || "light"
        );
        img.dataset.slateStatus = "translated";
        PageBadgeManager.updateBadge(wrapper, task.index, "translated", resp.dialogues.length);
        this.markImageCompleted(img);
        this.hud.log(`Trang #${task.index + 1}: Hoan tat ${resp.dialogues.length} cau thoai`);
      } else {
        img.dataset.slateStatus = "error";
        PageBadgeManager.updateBadge(wrapper, task.index, "error");
        this.hud.log(`Loi dich trang #${task.index + 1}: ${resp?.error || "Loi API"}`, true);
      }
    }
    markImageCompleted(img, checkAllDone = true) {
      this.completedImages.add(img);
      this.hud.updateStatus(this.completedImages.size, this.images.length);
      if (checkAllDone && this.completedImages.size >= this.images.length && this.hud.getState() === "translating") {
        this.hud.setState("completed");
        this.hud.log(`Da hoan tat dich toan bo chuong (${this.images.length} trang)`);
      }
    }
    showModelMissingBanner() {
      if (document.getElementById("speedyslate-missing-banner")) return;
      const banner = document.createElement("div");
      banner.id = "speedyslate-missing-banner";
      banner.style.cssText = `
      position: fixed; top: 16px; left: 50%; transform: translateX(-50%);
      background: rgba(18, 18, 28, 0.95); backdrop-filter: blur(16px); color: #ffffff; padding: 12px 20px;
      border-radius: 14px; z-index: 2147483647; box-shadow: 0 12px 35px rgba(0,0,0,0.6);
      font-family: system-ui, -apple-system, sans-serif; font-size: 13px; display: flex; align-items: center; gap: 14px;
      border: 1px solid rgba(168, 85, 247, 0.4);
    `;
      banner.innerHTML = `
      <span><b>SpeedySlate</b>: Ban chua tai model OCR (~10MB). Mo popup cai dat tien ich de tai model.</span>
      <button style="background: linear-gradient(135deg, #6366f1, #8b5cf6); border: none; color: #fff; padding: 6px 14px; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 12px;">Dong</button>
    `;
      banner.querySelector("button")?.addEventListener("click", () => banner.remove());
      document.body?.appendChild(banner);
    }
  };
  var app = new SpeedySlateContentApp();
  app.start().catch((err) => console.error("[SpeedySlate] Loi khoi dong:", err));
})();
