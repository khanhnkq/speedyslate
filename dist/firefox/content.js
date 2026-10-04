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
    translationMode: "hybrid_ocr",
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
    bubbleTheme: "auto",
    autoScrollSpeed: 3,
    autoPrefetch: true,
    activeOcrModelId: "pp-ocrv4-server-heavy",
    rateLimitDelayMs: 1200,
    useWebGpu: true
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
    static spinner(size = 14, color = "#A855F7") {
      return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle; animation: speedyslateSpin 0.9s linear infinite;">
        <circle cx="12" cy="12" r="9" stroke="${color}" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="36 18" />
      </svg>
    `.trim();
    }
    static pulseDot(color = "#10b981") {
      return `
      <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background-color:${color}; box-shadow:0 0 8px ${color}; margin-right:6px; flex-shrink:0;"></span>
    `.trim();
    }
    static trash(size = 14, color = "currentColor") {
      return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <path d="M3 6H21M19 6V20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20V6M8 6V4C8 2.9 8.9 2 10 2H14C15.1 2 16 2.9 16 4V6" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `.trim();
    }
    static alert(size = 15, color = "#ef4444") {
      return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <path d="M12 9V14M12 17.5V18M12 3L2 21H22L12 3Z" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `.trim();
    }
  };

  // src/content/hud/hud.ts
  var FloatingHud = class {
    btn;
    menu = null;
    toast = null;
    toastTimer = null;
    state = "idle";
    isVisible = true;
    translatedCount = 0;
    totalCount = 0;
    callbacks;
    // Drag tracking
    startX = 0;
    startY = 0;
    initialLeft = 0;
    initialTop = 0;
    hasMoved = false;
    constructor(callbacks) {
      this.callbacks = callbacks;
      this.injectStyles();
      this.btn = document.createElement("button");
      this.btn.id = "speedyslate-floating-btn";
      this.initButton();
      this.setupEvents();
      this.mountToBody();
      this.render();
    }
    injectStyles() {
      if (document.getElementById("speedyslate-hud-styles")) return;
      const style = document.createElement("style");
      style.id = "speedyslate-hud-styles";
      style.textContent = `
      @keyframes speedyslateSpin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      #speedyslate-floating-btn {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 2147483647;
        background: #111111;
        color: #F5F5F4;
        border: 1px solid rgba(255, 255, 255, 0.16);
        border-radius: 9999px;
        padding: 8px 16px;
        height: 38px;
        font-family: 'DM Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: -0.01em;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        user-select: none;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.15);
        transition: border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
        outline: none;
        white-space: nowrap;
      }
      #speedyslate-floating-btn:hover {
        border-color: #A855F7;
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4), 0 0 10px rgba(168, 85, 247, 0.25);
      }
      #speedyslate-floating-btn:active {
        transform: translateY(0px) scale(0.98);
      }
      .speedyslate-menu-item {
        padding: 8px 12px;
        font-size: 11px;
        font-weight: 500;
        color: #F5F5F4;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: background 0.12s ease;
      }
      .speedyslate-menu-item:hover {
        background: rgba(168, 85, 247, 0.18);
        color: #ffffff;
      }
    `;
      (document.head || document.documentElement).appendChild(style);
    }
    initButton() {
      this.btn.setAttribute("type", "button");
      this.btn.title = "SpeedySlate \u2022 B\u1EA5m \u0111\u1EC3 d\u1ECBch \u2022 Chu\u1ED9t ph\u1EA3i m\u1EDF t\xF9y ch\u1ECDn";
    }
    mountToBody() {
      const tryMount = () => {
        const root = document.body || document.documentElement;
        if (root && !document.getElementById("speedyslate-floating-btn")) {
          root.appendChild(this.btn);
        } else if (!root) {
          setTimeout(tryMount, 50);
        }
      };
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", tryMount);
      } else {
        tryMount();
      }
    }
    setupEvents() {
      this.btn.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return;
        this.hasMoved = false;
        this.startX = e.clientX;
        this.startY = e.clientY;
        const rect = this.btn.getBoundingClientRect();
        this.initialLeft = rect.left;
        this.initialTop = rect.top;
        const onMouseMove = (moveEvent) => {
          const dx = moveEvent.clientX - this.startX;
          const dy = moveEvent.clientY - this.startY;
          if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
            this.hasMoved = true;
            this.closeMenu();
          }
          if (this.hasMoved) {
            this.btn.style.bottom = "auto";
            this.btn.style.right = "auto";
            this.btn.style.left = `${this.initialLeft + dx}px`;
            this.btn.style.top = `${this.initialTop + dy}px`;
          }
        };
        const onMouseUp = () => {
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
        };
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      });
      this.btn.addEventListener("click", (e) => {
        if (this.hasMoved) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        this.closeMenu();
        this.handlePrimaryClick();
      });
      this.btn.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleMenu();
      });
      document.addEventListener("click", (e) => {
        if (this.menu && !this.menu.contains(e.target) && e.target !== this.btn) {
          this.closeMenu();
        }
      });
    }
    handlePrimaryClick() {
      if (this.state === "idle" || this.state === "error") {
        this.setState("translating");
        this.callbacks.onToggleTranslate();
      } else if (this.state === "translating") {
        this.setState("paused");
        this.callbacks.onToggleTranslate();
      } else if (this.state === "paused") {
        this.setState("translating");
        this.callbacks.onToggleTranslate();
      } else if (this.state === "completed") {
        this.isVisible = !this.isVisible;
        this.callbacks.onToggleVisibility(this.isVisible);
        this.render();
      }
    }
    toggleMenu() {
      if (this.menu) {
        this.closeMenu();
      } else {
        this.openMenu();
      }
    }
    openMenu() {
      this.closeMenu();
      const rect = this.btn.getBoundingClientRect();
      this.menu = document.createElement("div");
      this.menu.id = "speedyslate-floating-menu";
      Object.assign(this.menu.style, {
        position: "fixed",
        left: `${Math.max(12, rect.left)}px`,
        bottom: `${window.innerHeight - rect.top + 8}px`,
        zIndex: "2147483647",
        background: "#111111",
        border: "1px solid rgba(255, 255, 255, 0.16)",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.45)",
        minWidth: "160px",
        userSelect: "none"
      });
      const itemVis = document.createElement("div");
      itemVis.className = "speedyslate-menu-item";
      itemVis.innerHTML = `
      ${ChubbyIcons.eye(14, "#A855F7")}
      <span>${this.isVisible ? "\u1EA8n b\u1EA3n d\u1ECBch (Xem g\u1ED1c)" : "Hi\u1EC7n l\u1EA1i b\u1EA3n d\u1ECBch"}</span>
    `;
      itemVis.onclick = (e) => {
        e.stopPropagation();
        this.isVisible = !this.isVisible;
        this.callbacks.onToggleVisibility(this.isVisible);
        this.closeMenu();
        this.render();
      };
      const itemClear = document.createElement("div");
      itemClear.className = "speedyslate-menu-item";
      itemClear.style.borderTop = "1px solid rgba(255, 255, 255, 0.08)";
      itemClear.innerHTML = `
      ${ChubbyIcons.broom(14, "#A855F7")}
      <span>X\xF3a cache ch\u01B0\u01A1ng n\xE0y</span>
    `;
      itemClear.onclick = (e) => {
        e.stopPropagation();
        this.closeMenu();
        this.callbacks.onClearChapterCache();
        this.setState("idle");
      };
      const itemClearAll = document.createElement("div");
      itemClearAll.className = "speedyslate-menu-item";
      itemClearAll.style.borderTop = "1px solid rgba(255, 255, 255, 0.08)";
      itemClearAll.innerHTML = `
      ${ChubbyIcons.trash(14, "#ef4444")}
      <span>D\u1ECDn s\u1EA1ch to\xE0n b\u1ED9 cache</span>
    `;
      itemClearAll.onclick = (e) => {
        e.stopPropagation();
        this.closeMenu();
        this.callbacks.onClearAllCache?.();
        this.setState("idle");
      };
      this.menu.appendChild(itemVis);
      this.menu.appendChild(itemClear);
      this.menu.appendChild(itemClearAll);
      document.body.appendChild(this.menu);
    }
    closeMenu() {
      if (this.menu) {
        this.menu.remove();
        this.menu = null;
      }
    }
    updateStatus(translatedCount, totalCount) {
      this.translatedCount = translatedCount;
      this.totalCount = totalCount;
      if (totalCount > 0 && translatedCount >= totalCount && this.state === "translating") {
        this.setState("completed");
      } else {
        this.render();
      }
    }
    getState() {
      return this.state;
    }
    setState(state) {
      this.state = state;
      this.render();
    }
    log(message, isError = false) {
      this.btn.title = `SpeedySlate: ${message}`;
      if (isError) {
        this.showToast(message);
      }
    }
    showToast(message) {
      if (this.toast) {
        this.toast.remove();
        if (this.toastTimer) clearTimeout(this.toastTimer);
      }
      const rect = this.btn.getBoundingClientRect();
      this.toast = document.createElement("div");
      Object.assign(this.toast.style, {
        position: "fixed",
        left: `${Math.max(12, rect.left)}px`,
        bottom: `${window.innerHeight - rect.top + 8}px`,
        zIndex: "2147483647",
        background: "#1c1010",
        color: "#fee2e2",
        border: "1px solid rgba(239, 68, 68, 0.7)",
        borderRadius: "8px",
        padding: "8px 14px",
        fontSize: "11px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.6)",
        pointerEvents: "none",
        transition: "opacity 0.2s ease",
        maxWidth: "340px",
        lineHeight: "1.4"
      });
      this.toast.textContent = message;
      document.body.appendChild(this.toast);
      this.toastTimer = setTimeout(() => {
        if (this.toast) {
          this.toast.style.opacity = "0";
          setTimeout(() => {
            this.toast?.remove();
            this.toast = null;
          }, 200);
        }
      }, 6e3);
    }
    render() {
      switch (this.state) {
        case "idle": {
          const countTxt = this.totalCount > 0 ? ` (${this.totalCount})` : "";
          this.btn.innerHTML = `
          ${ChubbyIcons.bolt(14, "#A855F7")}
          <span>D\u1ECBch truy\u1EC7n${countTxt}</span>
        `;
          this.btn.title = "B\u1EA5m \u0111\u1EC3 b\u1EAFt \u0111\u1EA7u d\u1ECBch truy\u1EC7n \u2022 Chu\u1ED9t ph\u1EA3i m\u1EDF menu";
          break;
        }
        case "error": {
          const prog = this.totalCount > 0 ? ` (${this.translatedCount}/${this.totalCount})` : "";
          this.btn.innerHTML = `
          ${ChubbyIcons.alert(14, "#ef4444")}
          <span style="color: #fca5a5;">L\u1ED7i d\u1ECBch${prog}</span>
        `;
          this.btn.title = "C\xF3 l\u1ED7i x\u1EA3y ra khi d\u1ECBch \u2022 B\u1EA5m \u0111\u1EC3 th\u1EED l\u1EA1i \u2022 Chu\u1ED9t ph\u1EA3i m\u1EDF menu";
          break;
        }
        case "translating": {
          const prog = this.totalCount > 0 ? ` ${this.translatedCount}/${this.totalCount}` : "...";
          this.btn.innerHTML = `
          ${ChubbyIcons.spinner(14, "#A855F7")}
          <span>\u0110ang d\u1ECBch${prog}</span>
        `;
          this.btn.title = "\u0110ang d\u1ECBch truy\u1EC7n... B\u1EA5m \u0111\u1EC3 t\u1EA1m d\u1EEBng";
          break;
        }
        case "paused": {
          const prog = this.totalCount > 0 ? ` (${this.translatedCount}/${this.totalCount})` : "";
          this.btn.innerHTML = `
          ${ChubbyIcons.play(13, "#F5F5F4")}
          <span>Ti\u1EBFp t\u1EE5c${prog}</span>
        `;
          this.btn.title = "B\u1EA5m \u0111\u1EC3 ti\u1EBFp t\u1EE5c d\u1ECBch";
          break;
        }
        case "completed": {
          if (this.isVisible) {
            const prog = this.totalCount > 0 ? ` (${this.totalCount})` : "";
            this.btn.innerHTML = `
            ${ChubbyIcons.checkCircle(14, "#A855F7")}
            <span>\u0110\xE3 d\u1ECBch${prog}</span>
          `;
            this.btn.title = "B\u1EA5m \u0111\u1EC3 \u1EA9n b\u1EA3n d\u1ECBch (Xem tranh g\u1ED1c) \u2022 Chu\u1ED9t ph\u1EA3i m\u1EDF menu";
          } else {
            this.btn.innerHTML = `
            ${ChubbyIcons.eye(14, "#F5F5F4")}
            <span>Xem tranh g\u1ED1c</span>
          `;
            this.btn.title = "B\u1EA5m \u0111\u1EC3 hi\u1EC7n l\u1EA1i b\u1EA3n d\u1ECBch \u2022 Chu\u1ED9t ph\u1EA3i m\u1EDF menu";
          }
          break;
        }
      }
    }
  };

  // src/content/overlay/overlay-renderer.ts
  var OverlayRenderer = class {
    /**
     * Renders translated speech bubbles over the wrapped image
     */
    static renderDialogues(wrapper, dialogues, naturalWidth, naturalHeight, theme = "auto") {
      const existing = wrapper.querySelectorAll(".speedyslate-bubble");
      existing.forEach((el) => el.remove());
      for (const item of dialogues) {
        if (!item.translatedText || !item.translatedText.trim()) continue;
        const box = item.box;
        const expandX = Math.min(box.width * 0.08, 12);
        const expandY = Math.min(box.height * 0.06, 8);
        const adjX = Math.max(0, box.x - expandX / 2);
        const adjY = Math.max(0, box.y - expandY / 2);
        const adjW = Math.min(naturalWidth - adjX, box.width + expandX);
        const adjH = Math.min(naturalHeight - adjY, box.height + expandY);
        const topPct = adjY / naturalHeight * 100;
        const leftPct = adjX / naturalWidth * 100;
        const widthPct = adjW / naturalWidth * 100;
        const minHeightPct = adjH / naturalHeight * 100;
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
          maxWidth: `${Math.min(85, Math.max(25, widthPct + 4))}%`,
          height: "auto",
          minHeight: `${minHeightPct}%`,
          backgroundColor: bg,
          color: textColor,
          border: "none",
          outline: "none",
          borderRadius: "4px",
          boxSizing: "border-box",
          padding: "2px 4px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          fontFamily: "'Comic Sans MS', 'Bangers', 'Segoe UI', system-ui, sans-serif",
          fontWeight: "bold",
          lineHeight: "1.22",
          zIndex: "50",
          cursor: "pointer",
          transition: "opacity 0.15s ease-in-out",
          userSelect: "text",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          overflowWrap: "anywhere",
          hyphens: "auto",
          boxShadow: "none"
        });
        const fontSize = this.calculateFontSize(adjW, adjH, item.translatedText.length);
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
      let base = Math.sqrt(area / Math.max(1, textLength)) * 0.92;
      base = Math.max(11, Math.min(20, Math.round(base)));
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
      "#image-container",
      // nHentai reader
      ".image-container",
      "#reader-area",
      // WordPress Manga / Toonhey
      "#readerarea",
      ".reading-content",
      // Toonily & Madara WordPress theme
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
      ".related-container",
      // nHentai related galleries
      "#related-container",
      "#caption",
      // nHentai page caption
      "#pagination",
      ".pagination",
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
          if (validComicPanels.length >= 1) {
            return validComicPanels;
          }
        }
      }
      const allImgs = Array.from(document.querySelectorAll("img"));
      const candidatePanels = allImgs.filter((img) => this.isGenuineComicPanel(img));
      if (candidatePanels.length === 0) return [];
      const containerCounts = /* @__PURE__ */ new Map();
      for (const img of candidatePanels) {
        const parentContainer = img.closest("div, section, article");
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
      if (bestGroup.length >= 2) return bestGroup;
      if (candidatePanels.length >= 2) return candidatePanels;
      if (candidatePanels.length === 1) {
        const single = candidatePanels[0];
        const w = single.naturalWidth || single.width || 0;
        const h = single.naturalHeight || single.height || 0;
        if (w >= 300 || h >= 300) {
          return candidatePanels;
        }
      }
      return [];
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
        const currentPath = window.location.pathname.toLowerCase().replace(/\/+$/, "");
        const pathSegments = currentPath.split("/").filter(Boolean);
        const seriesPrefix = pathSegments.length > 1 ? "/" + pathSegments.slice(0, pathSegments.length - 1).join("/") : currentPath;
        const isNextPageOrSameSeries = anchorHref.includes(currentPath) || seriesPrefix.length > 3 && anchorHref.includes(seriesPrefix);
        if (!isNextPageOrSameSeries) {
          if (anchorHref.includes("/manga/") || anchorHref.includes("/webtoon/") || anchorHref.includes("/series/") || anchorHref.includes("/comic/") || anchorHref.includes("/g/") || anchorHref.includes("/en/")) {
            return false;
          }
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
        background: "#111111",
        border: "1px solid rgba(255, 255, 255, 0.16)",
        borderRadius: "9999px",
        padding: "3px 10px",
        color: "#F5F5F4",
        fontFamily: "'DM Sans', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        fontWeight: "600",
        fontSize: "11px",
        letterSpacing: "-0.01em",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.35)",
        pointerEvents: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        transition: "all 0.2s ease",
        userSelect: "none"
      });
      this.renderBadgeContent(badge, pageIndex, "idle");
      wrapper.appendChild(badge);
      return badge;
    }
    /**
     * Updates badge status and message
     */
    static updateBadge(wrapper, pageIndex, status, count, keyInfo) {
      const badge = this.ensureBadge(wrapper, pageIndex);
      this.renderBadgeContent(badge, pageIndex, status, count, keyInfo);
    }
    static renderBadgeContent(badge, pageIndex, status, count, keyInfo) {
      let dotColor = "#555555";
      let statusText = "";
      let isPulsing = false;
      switch (status) {
        case "idle":
          dotColor = "#555555";
          statusText = "";
          break;
        case "ocr_running":
          dotColor = "#A855F7";
          statusText = "Qu\xE9t OCR...";
          isPulsing = true;
          break;
        case "ocr_done":
          dotColor = "#A855F7";
          statusText = count !== void 0 ? `${count} c\xE2u` : "\u0110\xE3 qu\xE9t";
          break;
        case "translating":
          dotColor = "#A855F7";
          statusText = "\u0110ang d\u1ECBch...";
          isPulsing = true;
          break;
        case "translated":
          dotColor = "#A855F7";
          statusText = count !== void 0 ? `${count} c\xE2u` : "\u0110\xE3 d\u1ECBch";
          break;
        case "no_text":
          dotColor = "#444444";
          statusText = "Kh\xF4ng ch\u1EEF";
          break;
        case "error": {
          dotColor = "#ef4444";
          const rawErr = (keyInfo?.errorMessage || "").toLowerCase();
          if (rawErr.includes("timeout") || rawErr.includes("qu\xE1 th\u1EDDi gian")) {
            statusText = "Timeout 27s";
          } else if (rawErr.includes("429")) {
            statusText = "Limit (429)";
          } else if (rawErr.includes("403")) {
            statusText = "T\u1EEB ch\u1ED1i (403)";
          } else if (rawErr.includes("401")) {
            statusText = "Key sai (401)";
          } else if (rawErr.includes("safety")) {
            statusText = "Ch\u1EB7n 18+";
          } else {
            statusText = keyInfo?.errorMessage ? keyInfo.errorMessage.slice(0, 18) : "L\u1ED7i";
          }
          break;
        }
      }
      const pulseAnim = isPulsing ? "animation: speedyslatePulse 1.2s infinite ease-in-out;" : "";
      const keyBadge = keyInfo?.keyIndex !== void 0 ? `<span style="background: rgba(168, 85, 247, 0.22); border: 1px solid rgba(168, 85, 247, 0.5); color: #e9d5ff; border-radius: 4px; padding: 1px 5px; font-size: 10px; font-weight: 700; letter-spacing: 0.02em;">Key #${keyInfo.keyIndex}${keyInfo.totalKeys && keyInfo.totalKeys > 1 ? `/${keyInfo.totalKeys}` : ""}</span>` : "";
      const statusSpan = statusText ? status === "error" ? `<span style="color: #f87171; font-weight: 700; font-size: 10px; background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.45); border-radius: 4px; padding: 1px 5px;">${statusText}</span>` : `<span style="color: #999999; font-weight: 500; font-size: 10px;">${statusText}</span>` : "";
      badge.innerHTML = `
      <style>
        @keyframes speedyslatePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(0.85); }
        }
      </style>
      <span style="width: 6px; height: 6px; border-radius: 50%; background: ${dotColor}; box-shadow: 0 0 5px ${dotColor}; display: inline-block; ${pulseAnim}"></span>
      <span style="color: #F5F5F4; font-weight: 700;">#${pageIndex + 1}</span>
      ${keyBadge}
      ${statusSpan}
    `;
      if (status === "error") {
        badge.style.border = "1px solid rgba(239, 68, 68, 0.5)";
        badge.title = keyInfo?.errorMessage ? `Trang #${pageIndex + 1}: ${keyInfo.errorMessage}` : "\u0110\xE3 x\u1EA3y ra l\u1ED7i";
        badge.style.pointerEvents = "auto";
        badge.style.cursor = "help";
      } else if (status === "translated" || status === "translating" || status === "ocr_running") {
        badge.style.border = "1px solid rgba(168, 85, 247, 0.4)";
        badge.title = "";
        badge.style.pointerEvents = "none";
        badge.style.cursor = "default";
      } else {
        badge.style.border = "1px solid rgba(255, 255, 255, 0.12)";
        badge.title = "";
        badge.style.pointerEvents = "none";
        badge.style.cursor = "default";
      }
    }
  };

  // src/content/missing-banner.ts
  var ModelMissingBanner = class {
    static show() {
      if (document.getElementById("speedyslate-missing-banner")) return;
      const banner = document.createElement("div");
      banner.id = "speedyslate-missing-banner";
      banner.style.cssText = `
      position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
      background: #111111; color: #F5F5F4; padding: 10px 18px;
      border-radius: 9999px; z-index: 2147483647; box-shadow: 0 8px 24px rgba(0,0,0,0.45);
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif; font-size: 12px; display: flex; align-items: center; gap: 12px;
      border: 1px solid rgba(168, 85, 247, 0.4); user-select: none;
    `;
      banner.innerHTML = `
      <span><b style="color: #A855F7;">SpeedySlate</b>: Ch\u01B0a t\u1EA3i model OCR (~10MB). M\u1EDF popup c\xE0i \u0111\u1EB7t \u0111\u1EC3 t\u1EA3i model.</span>
      <button style="background: #A855F7; border: none; color: #ffffff; padding: 4px 12px; border-radius: 9999px; cursor: pointer; font-weight: 600; font-size: 11px;">\u0110\xF3ng</button>
    `;
      banner.querySelector("button")?.addEventListener("click", () => banner.remove());
      document.body?.appendChild(banner);
    }
  };

  // src/shared/debug-logger.ts
  var import_webextension_polyfill2 = __toESM(require_browser_polyfill(), 1);
  var STORAGE_KEY = "speedyslate_debug_logs";
  var MAX_LOGS = 120;
  var DebugLogger = class {
    static memoryLogs = [];
    static formatTime() {
      const d = /* @__PURE__ */ new Date();
      return d.toTimeString().split(" ")[0] + "." + String(d.getMilliseconds()).padStart(3, "0");
    }
    static extractErrorInfo(error) {
      if (!error) return {};
      if (error instanceof Error) {
        return { message: error.message, stack: error.stack };
      }
      if (typeof error === "string") {
        return { message: error };
      }
      if (typeof error === "object") {
        try {
          const msg = error.message || error.reason || error.error || JSON.stringify(error);
          const stack = error.stack || error.reason && error.reason.stack;
          return { message: String(msg), stack: stack ? String(stack) : void 0 };
        } catch {
          return { message: String(error) };
        }
      }
      return { message: String(error) };
    }
    static async log(level, tag, message, error) {
      const errInfo = this.extractErrorInfo(error);
      const fullMsg = errInfo.message && errInfo.message !== message ? `${message} (${errInfo.message})` : String(message);
      const entry = {
        time: this.formatTime(),
        level,
        tag,
        message: fullMsg,
        stack: errInfo.stack
      };
      this.memoryLogs.push(entry);
      if (this.memoryLogs.length > MAX_LOGS) {
        this.memoryLogs.shift();
      }
      const prefix = `[${entry.time}] [${tag}]`;
      if (level === "error") {
        console.error(prefix, message, error || "");
      } else if (level === "warn") {
        console.warn(prefix, message);
      } else {
        console.log(prefix, message);
      }
      try {
        const data = await import_webextension_polyfill2.default.storage.local.get(STORAGE_KEY);
        const stored = Array.isArray(data[STORAGE_KEY]) ? data[STORAGE_KEY] : [];
        const updated = [...stored, entry];
        if (updated.length > MAX_LOGS) {
          updated.splice(0, updated.length - MAX_LOGS);
        }
        await import_webextension_polyfill2.default.storage.local.set({ [STORAGE_KEY]: updated });
      } catch {
      }
    }
    static async error(tag, message, error) {
      return this.log("error", tag, message, error);
    }
    static async warn(tag, message) {
      return this.log("warn", tag, message);
    }
    static async info(tag, message) {
      return this.log("info", tag, message);
    }
    static async getLogs() {
      try {
        const res = await import_webextension_polyfill2.default.storage.local.get(STORAGE_KEY);
        return res[STORAGE_KEY] || this.memoryLogs;
      } catch {
        return this.memoryLogs;
      }
    }
    static async clearLogs() {
      this.memoryLogs = [];
      try {
        await import_webextension_polyfill2.default.storage.local.remove(STORAGE_KEY);
      } catch {
      }
    }
    static formatForClipboard(logs, extraContext) {
      const timeStr = (/* @__PURE__ */ new Date()).toISOString();
      let header = `=== SpeedySlate Debug Logs (${timeStr}) ===
`;
      header += `UserAgent: ${typeof navigator !== "undefined" ? navigator.userAgent : "N/A"}
`;
      header += `Platform: ${typeof navigator !== "undefined" ? navigator.platform : "N/A"}
`;
      if (extraContext) {
        header += `Context: ${JSON.stringify(extraContext, null, 2)}
`;
      }
      header += `--------------------------------------------------------

`;
      if (!logs || logs.length === 0) {
        return header + "Ch\u01B0a c\xF3 nh\u1EADt k\xFD n\xE0o \u0111\u01B0\u1EE3c ghi nh\u1EADn.";
      }
      const body = logs.map((l) => {
        let str = `[${l.time}] [${l.level.toUpperCase()}] [${l.tag}]: ${l.message}`;
        if (l.stack) {
          str += `
  Stack trace:
  ${l.stack.split("\n").join("\n  ")}`;
        }
        return str;
      }).join("\n\n");
      return header + body;
    }
    static async copyToClipboard(text) {
      try {
        if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
          return true;
        }
      } catch {
      }
      if (typeof document !== "undefined") {
        try {
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.style.position = "fixed";
          textarea.style.left = "-9999px";
          textarea.style.top = "-9999px";
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          const success = document.execCommand("copy");
          document.body.removeChild(textarea);
          return success;
        } catch {
          return false;
        }
      }
      return false;
    }
  };

  // src/content/safe-messenger.ts
  var import_webextension_polyfill3 = __toESM(require_browser_polyfill(), 1);
  var SafeMessenger = class {
    static isPortClosedError(errMsg) {
      const lower = errMsg.toLowerCase();
      return lower.includes("message channel closed") || lower.includes("receiving end does not exist") || lower.includes("could not establish connection") || lower.includes("port closed") || lower.includes("asynchronous response by returning true");
    }
    /**
     * Send message with automatic Service Worker wake-up and retry on port closure
     */
    static async send(message, options = {}) {
      const maxRetries = options.maxRetries ?? 2;
      const retryDelayMs = options.retryDelayMs ?? 400;
      let lastError = null;
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const resp = await import_webextension_polyfill3.default.runtime.sendMessage(message);
          if (resp !== void 0) {
            return resp;
          }
        } catch (err) {
          lastError = err;
          const errMsg = err?.message || String(err);
          if (errMsg.toLowerCase().includes("extension context invalidated")) {
            return {
              success: false,
              isContextInvalidated: true,
              error: "Ti\u1EC7n \xEDch \u0111\xE3 \u0111\u01B0\u1EE3c t\u1EA3i l\u1EA1i ho\u1EB7c c\u1EADp nh\u1EADt. Vui l\xF2ng t\u1EA3i l\u1EA1i trang (F5 / Cmd+R)."
            };
          }
          if (this.isPortClosedError(errMsg) && attempt < maxRetries) {
            const delay = retryDelayMs * (attempt + 1);
            console.warn(
              `[SpeedySlate] Service worker channel closed (attempt ${attempt + 1}/${maxRetries + 1}). Waking up worker and retrying in ${delay}ms...`
            );
            DebugLogger.warn(
              "SafeMessenger",
              `Message channel closed for ${message?.action || "unknown"}. Waking worker (attempt ${attempt + 1})...`
            );
            await new Promise((r) => setTimeout(r, delay));
            try {
              await import_webextension_polyfill3.default.runtime.sendMessage({ action: "PING" });
            } catch {
            }
            continue;
          }
          break;
        }
      }
      const finalErrMsg = lastError?.message || "Kh\xF4ng nh\u1EADn \u0111\u01B0\u1EE3c ph\u1EA3n h\u1ED3i t\u1EEB ti\u1EC7n \xEDch (k\xEAnh li\xEAn l\u1EA1c \u0111\xE3 b\u1ECB \u0111\xF3ng)";
      return {
        success: false,
        error: finalErrMsg
      };
    }
  };

  // src/content/image-compressor.ts
  var ImageCompressor = class {
    /**
     * Captures and downsizes an image for Vision AI transmission.
     */
    static compressForVision(img, maxDim = 1280, quality = 0.85) {
      const naturalWidth = img.naturalWidth || img.width || 800;
      const naturalHeight = img.naturalHeight || img.height || 1200;
      let targetWidth = naturalWidth;
      let targetHeight = naturalHeight;
      if (Math.max(naturalWidth, naturalHeight) > maxDim) {
        if (naturalWidth > naturalHeight) {
          targetWidth = maxDim;
          targetHeight = Math.round(naturalHeight / naturalWidth * maxDim);
        } else {
          targetHeight = maxDim;
          targetWidth = Math.round(naturalWidth / naturalHeight * maxDim);
        }
      }
      try {
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          const dataUrl = canvas.toDataURL("image/jpeg", quality);
          return {
            dataUrl,
            naturalWidth,
            naturalHeight,
            compressedWidth: targetWidth,
            compressedHeight: targetHeight
          };
        }
      } catch {
      }
      return {
        naturalWidth,
        naturalHeight,
        compressedWidth: targetWidth,
        compressedHeight: targetHeight
      };
    }
  };

  // src/content/task-processor.ts
  var TaskProcessor = class {
    constructor(ctx) {
      this.ctx = ctx;
    }
    getKeyCount() {
      const settings = this.ctx.getSettings();
      const raw = settings?.providers?.[settings?.activeProvider]?.apiKey || "";
      if (!raw) return 0;
      return raw.split(/[\n,;]+/).map((k) => k.trim()).filter((k) => k.length > 0).length;
    }
    async processOcrTask(task) {
      if (this.ctx.completedImages.has(task.img)) return;
      const img = task.img;
      const imageUrl = img.src;
      const wrapper = img.parentElement;
      if (!wrapper) return;
      const settings = this.ctx.getSettings();
      const isVision = settings?.translationMode === "vision_ai";
      const totalKeys = this.getKeyCount();
      const estimatedKey = totalKeys > 0 ? task.index % totalKeys + 1 : void 0;
      try {
        if (!img.complete || img.naturalWidth === 0) {
          ToonheyAdapter.forceTriggerImage(img);
          await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
            setTimeout(resolve, 3e3);
          });
        }
        img.dataset.slateStatus = "ocr_running";
        PageBadgeManager.updateBadge(
          wrapper,
          task.index,
          "ocr_running",
          void 0,
          isVision && totalKeys > 0 ? { keyIndex: estimatedKey, totalKeys } : void 0
        );
        const compressed = ImageCompressor.compressForVision(img, 1280, 0.85);
        const resp = await SafeMessenger.send({
          action: "OCR_IMAGE",
          imageUrl,
          chapterUrl: window.location.href,
          dataUrl: compressed.dataUrl,
          naturalWidth: compressed.naturalWidth,
          naturalHeight: compressed.naturalHeight
        });
        if (resp?.isContextInvalidated) {
          this.ctx.onContextInvalidated();
          return;
        }
        if (resp?.success) {
          if (resp.cached || resp.isDirectTranslation) {
            if (resp.dialogues && resp.dialogues.length > 0) {
              OverlayRenderer.renderDialogues(
                wrapper,
                resp.dialogues,
                resp.naturalWidth || compressed.naturalWidth,
                resp.naturalHeight || compressed.naturalHeight,
                settings?.bubbleTheme || "auto"
              );
              img.dataset.slateStatus = "translated";
              const finalKey = resp.keyIndex || estimatedKey;
              const finalTotal = resp.totalKeys || totalKeys;
              PageBadgeManager.updateBadge(
                wrapper,
                task.index,
                "translated",
                resp.dialogues.length,
                !resp.cached && finalKey ? { keyIndex: finalKey, totalKeys: finalTotal } : void 0
              );
              this.ctx.hud.log(
                resp.cached ? `Trang #${task.index + 1}: N\u1EA1p t\u1EEB Cache (0ms)` : `Trang #${task.index + 1}${finalTotal > 1 ? ` (Key #${finalKey}/${finalTotal})` : ""}: Vision AI \u0111\xE3 d\u1ECBch ${resp.dialogues.length} c\xE2u tho\u1EA1i`
              );
            } else {
              img.dataset.slateStatus = "no_text";
              PageBadgeManager.updateBadge(wrapper, task.index, "no_text");
              this.ctx.hud.log(`Trang #${task.index + 1}: Kh\xF4ng c\xF3 ch\u1EEF tho\u1EA1i`);
            }
            this.ctx.markImageCompleted(img);
          } else if (!resp.dialogues || resp.dialogues.length === 0) {
            img.dataset.slateStatus = "no_text";
            PageBadgeManager.updateBadge(wrapper, task.index, "no_text");
            this.ctx.markImageCompleted(img);
            this.ctx.hud.log(`Trang #${task.index + 1}: Kh\xF4ng c\xF3 ch\u1EEF`);
          } else {
            img.dataset.slateStatus = "ocr_done";
            PageBadgeManager.updateBadge(wrapper, task.index, "ocr_done", resp.dialogues.length);
            this.ctx.hud.log(`Trang #${task.index + 1}: \u0110\xE3 qu\xE9t ${resp.dialogues.length} c\xE2u tho\u1EA1i, \u0111ang ch\u1EDD d\u1ECBch...`);
            this.ctx.translationQueue.enqueue({
              index: task.index,
              img: task.img,
              dialogues: resp.dialogues,
              naturalWidth: resp.naturalWidth || compressed.naturalWidth,
              naturalHeight: resp.naturalHeight || compressed.naturalHeight
            });
          }
        } else {
          img.dataset.slateStatus = "error";
          const errMsg = resp?.error || "L\u1ED7i nh\u1EADn di\u1EC7n OCR";
          PageBadgeManager.updateBadge(
            wrapper,
            task.index,
            "error",
            void 0,
            isVision && totalKeys > 0 ? { keyIndex: estimatedKey, totalKeys, errorMessage: errMsg } : { errorMessage: errMsg }
          );
          this.ctx.hud.log(`L\u1ED7i OCR trang #${task.index + 1}: ${errMsg}`, true);
          DebugLogger.error("Content:OCR", `Trang #${task.index + 1}: ${errMsg}`);
          if (this.ctx.ocrQueue.size() <= 1 && this.ctx.translationQueue.size() === 0) {
            this.ctx.hud.setState("error");
          }
        }
      } catch (err) {
        const errMsg = err?.message || String(err);
        if (errMsg.includes("Extension context invalidated")) {
          this.ctx.onContextInvalidated();
          return;
        }
        img.dataset.slateStatus = "error";
        PageBadgeManager.updateBadge(
          wrapper,
          task.index,
          "error",
          void 0,
          isVision && totalKeys > 0 ? { keyIndex: estimatedKey, totalKeys, errorMessage: errMsg } : { errorMessage: errMsg }
        );
        this.ctx.hud.log(`L\u1ED7i OCR trang #${task.index + 1}: ${errMsg}`, true);
        DebugLogger.error("Content:OCR", `Trang #${task.index + 1}: ${errMsg}`, err);
        if (this.ctx.ocrQueue.size() <= 1 && this.ctx.translationQueue.size() === 0) {
          this.ctx.hud.setState("error");
        }
      }
    }
    async processTranslationTask(task) {
      if (this.ctx.completedImages.has(task.img)) return;
      const img = task.img;
      const wrapper = img.parentElement;
      if (!wrapper) return;
      const settings = this.ctx.getSettings();
      const totalKeys = this.getKeyCount();
      const estimatedKey = totalKeys > 0 ? task.index % totalKeys + 1 : void 0;
      try {
        img.dataset.slateStatus = "translating";
        PageBadgeManager.updateBadge(
          wrapper,
          task.index,
          "translating",
          task.dialogues.length,
          totalKeys > 0 ? { keyIndex: estimatedKey, totalKeys } : void 0
        );
        this.ctx.hud.log(
          `Trang #${task.index + 1}${totalKeys > 1 ? ` (Key #${estimatedKey}/${totalKeys})` : ""}: \u0110ang d\u1ECBch ${task.dialogues.length} c\xE2u tho\u1EA1i...`
        );
        const resp = await SafeMessenger.send({
          action: "TRANSLATE_DIALOGUES",
          imageUrl: img.src,
          chapterUrl: window.location.href,
          dialogues: task.dialogues,
          naturalWidth: task.naturalWidth,
          naturalHeight: task.naturalHeight
        });
        if (resp?.isContextInvalidated) {
          this.ctx.onContextInvalidated();
          return;
        }
        if (resp?.success && Array.isArray(resp.dialogues)) {
          OverlayRenderer.renderDialogues(
            wrapper,
            resp.dialogues,
            task.naturalWidth,
            task.naturalHeight,
            settings?.bubbleTheme || "auto"
          );
          img.dataset.slateStatus = "translated";
          const finalKey = resp.keyIndex || estimatedKey;
          const finalTotal = resp.totalKeys || totalKeys;
          PageBadgeManager.updateBadge(
            wrapper,
            task.index,
            "translated",
            resp.dialogues.length,
            finalKey ? { keyIndex: finalKey, totalKeys: finalTotal } : void 0
          );
          this.ctx.markImageCompleted(img);
          this.ctx.hud.log(
            `Trang #${task.index + 1}${finalTotal > 1 ? ` (Key #${finalKey}/${finalTotal})` : ""}: Ho\xE0n t\u1EA5t ${resp.dialogues.length} c\xE2u tho\u1EA1i`
          );
        } else {
          img.dataset.slateStatus = "error";
          const errMsg = resp?.error || "L\u1ED7i API d\u1ECBch";
          PageBadgeManager.updateBadge(
            wrapper,
            task.index,
            "error",
            void 0,
            totalKeys > 0 ? { keyIndex: estimatedKey, totalKeys, errorMessage: errMsg } : { errorMessage: errMsg }
          );
          this.ctx.hud.log(`L\u1ED7i d\u1ECBch trang #${task.index + 1}: ${errMsg}`, true);
          DebugLogger.error("Content:Translate", `Trang #${task.index + 1}: ${errMsg}`);
          if (this.ctx.translationQueue.size() <= 1 && this.ctx.ocrQueue.size() === 0) {
            this.ctx.hud.setState("error");
          }
        }
      } catch (err) {
        const errMsg = err?.message || String(err);
        if (errMsg.includes("Extension context invalidated")) {
          this.ctx.onContextInvalidated();
          return;
        }
        img.dataset.slateStatus = "error";
        PageBadgeManager.updateBadge(
          wrapper,
          task.index,
          "error",
          void 0,
          totalKeys > 0 ? { keyIndex: estimatedKey, totalKeys, errorMessage: errMsg } : { errorMessage: errMsg }
        );
        this.ctx.hud.log(`L\u1ED7i d\u1ECBch trang #${task.index + 1}: ${errMsg}`, true);
        DebugLogger.error("Content:Translate", `Trang #${task.index + 1}: ${errMsg}`, err);
        if (this.ctx.translationQueue.size() <= 1 && this.ctx.ocrQueue.size() === 0) {
          this.ctx.hud.setState("error");
        }
      }
    }
  };

  // src/content/index.ts
  var SpeedySlateContentApp = class {
    settings;
    hud;
    ocrQueue;
    translationQueue;
    taskProcessor;
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
            try {
              sessionStorage.setItem("speedyslate_translating", "false");
            } catch {
            }
            this.ocrQueue?.pause();
            this.translationQueue?.pause();
            this.hud.log("Da tam dung tien trinh dich truyen");
          }
        },
        onToggleVisibility: (visible) => OverlayRenderer.setAllVisibility(visible),
        onClearChapterCache: async () => {
          const resp = await SafeMessenger.send({
            action: "CLEAR_CHAPTER_CACHE",
            chapterUrl: window.location.href
          });
          this.resetPageTranslations();
          this.hud.log(`Da xoa ${resp?.deleted || 0} ban dich cache cua chuong nay`);
        },
        onClearAllCache: async () => {
          await SafeMessenger.send({ action: "CLEAR_ALL_CACHE" });
          this.resetPageTranslations();
          this.hud.log("Da don sach toan bo cache");
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
        async (task) => this.taskProcessor.processOcrTask(task),
        1,
        (t) => t.img
      );
      this.ocrQueue.pause();
      this.translationQueue = new OrderedTaskQueue(
        async (task) => this.taskProcessor.processTranslationTask(task),
        1,
        (t) => t.img
      );
      this.translationQueue.pause();
      this.taskProcessor = new TaskProcessor({
        getSettings: () => this.settings,
        hud: this.hud,
        completedImages: this.completedImages,
        ocrQueue: this.ocrQueue,
        translationQueue: this.translationQueue,
        markImageCompleted: (img) => this.markImageCompleted(img),
        onContextInvalidated: () => this.handleContextInvalidated()
      });
      this.detectImages();
      this.setupMutationObserver();
      this.setupIntersectionObserver();
      await this.restoreCachedTranslations();
      await this.checkModelStatusFromBackground(false);
      if (this.completedImages.size < this.images.length) {
        this.hud.log(`San sang dich. Tim thay ${this.images.length} trang truyen`);
        try {
          if (sessionStorage.getItem("speedyslate_translating") === "true") {
            this.hud.setState("translating");
            await this.handleStartTranslating();
          }
        } catch {
        }
      }
    }
    resetPageTranslations() {
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
      try {
        sessionStorage.setItem("speedyslate_translating", "false");
      } catch {
      }
      this.hud.updateStatus(0, this.images.length);
      this.hud.setState("idle");
    }
    handleContextInvalidated() {
      this.ocrQueue?.clear();
      this.translationQueue?.clear();
      this.hud?.setState("idle");
      this.hud?.log("Ti\u1EC7n \xEDch v\u1EEBa \u0111\u01B0\u1EE3c t\u1EA3i l\u1EA1i. Vui l\xF2ng nh\u1EA5n F5 (Cmd+R) \u0111\u1EC3 ti\u1EBFp t\u1EE5c d\u1ECBch.", true);
    }
    async handleStartTranslating() {
      try {
        this.settings = await StorageService.getSettings();
      } catch {
      }
      if (!this.isModelReady) {
        await this.checkModelStatusFromBackground(true);
        if (!this.isModelReady) {
          this.hud.setState("idle");
          return;
        }
      }
      for (const img of this.images) {
        if (img.dataset.slateStatus === "error") {
          delete img.dataset.slateStatus;
          this.completedImages.delete(img);
        }
      }
      try {
        sessionStorage.setItem("speedyslate_translating", "true");
      } catch {
      }
      this.hud.log(`Bat dau dich chuong (${this.images.length} trang)...`);
      ToonheyAdapter.forceLoadAll(this.images);
      this.enqueueAllImages();
      this.ocrQueue.resume();
      this.translationQueue.resume();
    }
    async checkModelStatusFromBackground(showBannerIfMissing) {
      try {
        const resp = await SafeMessenger.send({ action: "CHECK_MODEL_STATUS" });
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
        const resp = await SafeMessenger.send({
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
            if (cached && Array.isArray(cached.dialogues) && cached.dialogues.length > 0) {
              const wrapper = img.parentElement;
              if (wrapper) {
                OverlayRenderer.renderDialogues(
                  wrapper,
                  cached.dialogues,
                  cached.naturalWidth || img.naturalWidth || 800,
                  cached.naturalHeight || img.naturalHeight || 1200,
                  this.settings?.bubbleTheme || "auto"
                );
                img.dataset.slateStatus = "translated";
                PageBadgeManager.updateBadge(wrapper, i, "translated", cached.dialogues.length);
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
    markImageCompleted(img, checkAllDone = true) {
      this.completedImages.add(img);
      this.hud.updateStatus(this.completedImages.size, this.images.length);
      if (checkAllDone && this.completedImages.size >= this.images.length && this.hud.getState() === "translating") {
        this.hud.setState("completed");
        this.hud.log(`Da hoan tat dich toan bo chuong (${this.images.length} trang)`);
      }
    }
    showModelMissingBanner() {
      ModelMissingBanner.show();
    }
  };
  window.addEventListener("error", (e) => {
    if (e.message?.includes("Extension context invalidated")) return;
    if (e.message?.includes("SpeedySlate") || e.message?.includes("OCR") || e.filename?.includes("content")) {
      DebugLogger.error("Content:GlobalError", e.message, e.error);
    }
  });
  window.addEventListener("unhandledrejection", (e) => {
    const reason = e.reason?.message || String(e.reason);
    if (reason.includes("Extension context invalidated")) return;
    if (reason.includes("SpeedySlate") || reason.includes("OCR")) {
      DebugLogger.error("Content:UnhandledRejection", reason, e.reason);
    }
  });
  var app = new SpeedySlateContentApp();
  app.start().catch((err) => {
    console.error("[SpeedySlate] Loi khoi dong:", err);
    DebugLogger.error("Content:Init", err.message, err);
  });
})();
