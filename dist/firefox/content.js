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
  var import_webextension_polyfill4 = __toESM(require_browser_polyfill(), 1);

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
        "gemini-2.0-flash",
        "antigravity-preview-09-2026"
      ],
      requiresApiKey: true,
      defaultDelayMs: 2600
    },
    antigravity: {
      name: "Google Antigravity Agent",
      baseUrl: "https://generativelanguage.googleapis.com/v1beta",
      defaultModel: "antigravity-preview-09-2026",
      suggestedModels: [
        "antigravity-preview-09-2026",
        "antigravity-preview-09-2026 (gemini-3.8-flash)",
        "antigravity-preview-09-2026 (gemini-3.5-flash-lite)",
        "antigravity-preview-09-2026 (gemini-3.7-flash)",
        "antigravity-preview-09-2026 (gemini-3.5-flash)"
      ],
      requiresApiKey: true,
      defaultDelayMs: 2500
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
      antigravity: {
        type: "antigravity",
        name: API_PRESETS.antigravity.name,
        baseUrl: API_PRESETS.antigravity.baseUrl,
        apiKey: "",
        model: API_PRESETS.antigravity.defaultModel
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
    sourceLanguage: "auto",
    targetLanguage: "Ti\u1EBFng Vi\u1EC7t",
    customSites: [],
    allowAllSites: false,
    bubbleTheme: "auto",
    autoScrollSpeed: 3,
    autoPrefetch: true,
    activeOcrModelId: "pp-ocrv4-server-heavy",
    rateLimitDelayMs: 1200,
    useWebGpu: true,
    rotateProviders: true
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
    static bolt(size = 15, color = "#E52E3D") {
      return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0z" fill="${color}" fill-opacity="0.15"/>
      </svg>
    `.trim();
    }
    static play(size = 14, color = "#FFFFFF") {
      return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <path d="M7 4v16l13 -8z" fill="${color}" fill-opacity="0.2"/>
      </svg>
    `.trim();
    }
    static pause(size = 14, color = "#FFFFFF") {
      return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <path d="M6 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z"/>
        <path d="M14 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z"/>
      </svg>
    `.trim();
    }
    static checkCircle(size = 15, color = "#E52E3D") {
      return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <circle cx="12" cy="12" r="9"/>
        <path d="M9 12l2 2l4 -4"/>
      </svg>
    `.trim();
    }
    static eye(size = 15, color = "#E52E3D") {
      return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <circle cx="12" cy="12" r="2"/>
        <path d="M22 12c-2.4 4 -5.4 6 -10 6c-4.6 0 -7.6 -2 -10 -6c2.4 -4 5.4 -6 10 -6c4.6 0 7.6 2 10 6"/>
      </svg>
    `.trim();
    }
    static broom(size = 15, color = "#E52E3D") {
      return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <path d="M14 12l-8.5 8.5a2.12 2.12 0 0 1 -3 -3l8.5 -8.5"/>
        <path d="M12 10l-1 -1a1 1 0 0 1 0 -1.41l5.59 -5.59a1 1 0 0 1 1.41 0l3.59 3.59a1 1 0 0 1 0 1.41l-5.59 5.59a1 1 0 0 1 -1.41 0l-1 -1"/>
      </svg>
    `.trim();
    }
    static trash(size = 15, color = "#FF3B47") {
      return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <path d="M4 7l16 0"/>
        <path d="M10 11l0 6"/>
        <path d="M14 11l0 6"/>
        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"/>
        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"/>
      </svg>
    `.trim();
    }
    static alert(size = 15, color = "#FF3B47") {
      return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <path d="M12 9v4"/>
        <path d="M12 17h.01"/>
        <path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75"/>
      </svg>
    `.trim();
    }
    static spinner(size = 15, color = "#E52E3D") {
      return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle; animation: speedyslateSpin 0.75s linear infinite;">
        <path d="M12 3a9 9 0 1 0 9 9"/>
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
        background: #0D0D11;
        color: #FFFFFF;
        border: 1px solid #26262E;
        border-radius: 8px;
        padding: 8px 14px;
        height: 38px;
        font-family: 'Space Grotesk', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 11px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        user-select: none;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.05);
        transition: border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
        outline: none;
        white-space: nowrap;
      }
      #speedyslate-floating-btn:hover {
        border-color: #E52E3D;
        transform: translateY(-1px);
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.8), 0 0 16px rgba(229, 46, 61, 0.4);
      }
      #speedyslate-floating-btn:active {
        transform: translateY(0px) scale(0.98);
      }
      .speedyslate-menu-item {
        padding: 9px 14px;
        font-size: 11px;
        font-weight: 600;
        font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
        color: #FFFFFF;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 9px;
        transition: background 0.12s ease;
      }
      .speedyslate-menu-item:hover {
        background: rgba(229, 46, 61, 0.16);
        color: #FFFFFF;
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
        background: "#0D0D11",
        border: "1px solid #26262E",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.7), 0 0 14px rgba(229, 46, 61, 0.15)",
        minWidth: "170px",
        userSelect: "none"
      });
      const itemVis = document.createElement("div");
      itemVis.className = "speedyslate-menu-item";
      itemVis.innerHTML = `
      ${ChubbyIcons.eye(15, "#E52E3D")}
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
      itemClear.style.borderTop = "1px solid #26262E";
      itemClear.innerHTML = `
      ${ChubbyIcons.broom(15, "#E52E3D")}
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
      itemClearAll.style.borderTop = "1px solid #26262E";
      itemClearAll.innerHTML = `
      ${ChubbyIcons.trash(15, "#FF3B47")}
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
      this.render();
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
        background: "#140A0B",
        color: "#FFA5AC",
        border: "1px solid #E52E3D",
        borderRadius: "8px",
        padding: "8px 14px",
        fontSize: "11px",
        fontFamily: "'Space Grotesk', 'Inter', system-ui, -apple-system, sans-serif",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.7), 0 0 12px rgba(229, 46, 61, 0.25)",
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
          const badge = this.totalCount > 0 ? `<span style="background: #140A0B; border: 1px solid #4D1217; color: #FFA5AC; border-radius: 4px; padding: 1px 6px; font-size: 10px; font-weight: 700;">${this.totalCount}</span>` : "";
          this.btn.innerHTML = `
          ${ChubbyIcons.bolt(15, "#E52E3D")}
          <span>D\u1ECACH TRUY\u1EC6N</span>
          ${badge}
        `;
          this.btn.style.background = "#0D0D11";
          this.btn.style.borderColor = "#26262E";
          this.btn.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.7)";
          this.btn.title = "B\u1EA5m \u0111\u1EC3 b\u1EAFt \u0111\u1EA7u d\u1ECBch truy\u1EC7n \u2022 Chu\u1ED9t ph\u1EA3i m\u1EDF menu";
          break;
        }
        case "error": {
          const badge = this.totalCount > 0 ? `<span style="background: #1C0A0B; border: 1px solid #E52E3D; color: #FFA5AC; border-radius: 4px; padding: 1px 6px; font-size: 10px; font-weight: 700;">${this.translatedCount}/${this.totalCount}</span>` : "";
          this.btn.innerHTML = `
          ${ChubbyIcons.alert(15, "#FF3B47")}
          <span style="color: #FFA5AC;">L\u1ED6I D\u1ECACH</span>
          ${badge}
        `;
          this.btn.style.background = "#180D0E";
          this.btn.style.borderColor = "#FF3B47";
          this.btn.style.boxShadow = "0 6px 24px rgba(0, 0, 0, 0.8), 0 0 18px rgba(255, 59, 71, 0.35)";
          this.btn.title = "C\xF3 l\u1ED7i x\u1EA3y ra khi d\u1ECBch \u2022 B\u1EA5m \u0111\u1EC3 th\u1EED l\u1EA1i \u2022 Chu\u1ED9t ph\u1EA3i m\u1EDF menu";
          break;
        }
        case "translating": {
          const badge = this.totalCount > 0 ? `<span style="background: #1C0A0B; border: 1px solid #E52E3D; color: #FFA5AC; border-radius: 4px; padding: 1px 6px; font-size: 10px; font-weight: 700;">${this.translatedCount}/${this.totalCount}</span>` : '<span style="color: #E52E3D; font-size: 10px;">...</span>';
          this.btn.innerHTML = `
          ${ChubbyIcons.spinner(15, "#E52E3D")}
          <span>\u0110ANG D\u1ECACH</span>
          ${badge}
        `;
          this.btn.style.background = "#0D0D11";
          this.btn.style.borderColor = "#E52E3D";
          this.btn.style.boxShadow = "0 6px 24px rgba(0, 0, 0, 0.8), 0 0 18px rgba(229, 46, 61, 0.45)";
          this.btn.title = "\u0110ang d\u1ECBch truy\u1EC7n... B\u1EA5m \u0111\u1EC3 t\u1EA1m d\u1EEBng";
          break;
        }
        case "paused": {
          const badge = this.totalCount > 0 ? `<span style="background: #181820; border: 1px solid #33333E; color: #FFFFFF; border-radius: 4px; padding: 1px 6px; font-size: 10px; font-weight: 700;">${this.translatedCount}/${this.totalCount}</span>` : "";
          this.btn.innerHTML = `
          ${ChubbyIcons.play(14, "#FFFFFF")}
          <span>T\u1EA0M D\u1EEANG</span>
          ${badge}
        `;
          this.btn.style.background = "#0D0D11";
          this.btn.style.borderColor = "#26262E";
          this.btn.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.7)";
          this.btn.title = "B\u1EA5m \u0111\u1EC3 ti\u1EBFp t\u1EE5c d\u1ECBch";
          break;
        }
        case "completed": {
          this.btn.style.background = "#0D0D11";
          this.btn.style.borderColor = "#26262E";
          this.btn.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.7)";
          if (this.isVisible) {
            const badge = this.totalCount > 0 ? `<span style="background: #140A0B; border: 1px solid #4D1217; color: #FFA5AC; border-radius: 4px; padding: 1px 6px; font-size: 10px; font-weight: 700;">${this.totalCount}</span>` : "";
            this.btn.innerHTML = `
            ${ChubbyIcons.checkCircle(15, "#E52E3D")}
            <span>\u0110\xC3 D\u1ECACH</span>
            ${badge}
          `;
            this.btn.title = "B\u1EA5m \u0111\u1EC3 \u1EA9n b\u1EA3n d\u1ECBch (Xem tranh g\u1ED1c) \u2022 Chu\u1ED9t ph\u1EA3i m\u1EDF menu";
          } else {
            this.btn.innerHTML = `
            ${ChubbyIcons.eye(15, "#FFFFFF")}
            <span>XEM \u1EA2NH G\u1ED0C</span>
          `;
            this.btn.title = "B\u1EA5m \u0111\u1EC3 hi\u1EC7n l\u1EA1i b\u1EA3n d\u1ECBch \u2022 Chu\u1ED9t ph\u1EA3i m\u1EDF menu";
          }
          break;
        }
      }
    }
    destroy() {
      this.closeMenu();
      this.btn?.remove();
      this.toast?.remove();
      const styleEl = document.getElementById("speedyslate-hud-styles");
      if (styleEl) styleEl.remove();
    }
  };

  // src/content/overlay/text-auto-fitter.ts
  var TextAutoFitter = class {
    /**
     * Finds the length of the longest word in the sentence (used for word-wrap constraints).
     */
    static getLongestWordLength(text) {
      if (!text) return 0;
      const words = text.split(/\s+/);
      let maxLen = 0;
      for (const w of words) {
        const clean = w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
        if (clean.length > maxLen) {
          maxLen = clean.length;
        }
      }
      return maxLen;
    }
    /**
     * Dynamically calculates the optimal font size (in pixels) to fit inside the bubble bounds.
     * Scales from 9px up to 28px based on bubble capacity and text length.
     */
    static computeOptimalFontSize(boxWidthPx, boxHeightPx, text) {
      const trimmed = text.trim();
      if (!trimmed) return 14;
      const words = trimmed.split(/\s+/).filter((w) => w.length > 0);
      const longestWordLen = this.getLongestWordLength(trimmed);
      const availW = Math.max(16, boxWidthPx - 12);
      const availH = Math.max(16, boxHeightPx - 8);
      const lineHeightRatio = 1.28;
      const charWidthRatio = 0.56;
      const maxFs = Math.min(26, Math.max(14, Math.floor(availH / 1.9)));
      const minFs = 9;
      for (let fs = maxFs; fs >= minFs; fs -= 0.5) {
        const longestWordWidth = longestWordLen * fs * 0.58;
        if (longestWordWidth > availW && fs > minFs) {
          continue;
        }
        const charsPerLine = Math.max(1, Math.floor(availW / (fs * charWidthRatio)));
        const linesCount = this.simulateLineCount(words, charsPerLine);
        const totalTextHeight = linesCount * (fs * lineHeightRatio);
        if (totalTextHeight <= availH - 2) {
          return Number(fs.toFixed(1));
        }
      }
      return minFs;
    }
    /**
     * Fast exact line-wrap simulation based on whitespace-separated words.
     */
    static simulateLineCount(words, charsPerLine) {
      let lines = 1;
      let currentLineChars = 0;
      for (let i = 0; i < words.length; i++) {
        const wLen = words[i].length;
        if (currentLineChars === 0) {
          currentLineChars = wLen;
        } else if (currentLineChars + 1 + wLen <= charsPerLine) {
          currentLineChars += 1 + wLen;
        } else {
          lines++;
          currentLineChars = wLen;
        }
      }
      return lines;
    }
  };

  // src/content/overlay/bubble-geometry.ts
  var BubbleGeometry = class {
    /**
     * Computes the calibrated position and dimensions to cover the dialogue text cleanly.
     */
    static computeCoordinates(item, naturalWidth, naturalHeight) {
      let topPct;
      let leftPct;
      let widthPct;
      let heightPct;
      if (item.normBox) {
        topPct = item.normBox.ymin / 10;
        leftPct = item.normBox.xmin / 10;
        widthPct = Math.max(1, (item.normBox.xmax - item.normBox.xmin) / 10);
        heightPct = Math.max(1, (item.normBox.ymax - item.normBox.ymin) / 10);
      } else {
        topPct = item.box.y / Math.max(1, naturalHeight) * 100;
        leftPct = item.box.x / Math.max(1, naturalWidth) * 100;
        widthPct = item.box.width / Math.max(1, naturalWidth) * 100;
        heightPct = item.box.height / Math.max(1, naturalHeight) * 100;
      }
      heightPct = Math.min(28, heightPct);
      let pixelWidth = widthPct / 100 * naturalWidth;
      let pixelHeight = heightPct / 100 * naturalHeight;
      const aspectRatio = pixelHeight / Math.max(1, pixelWidth);
      if (aspectRatio >= 1.8 || pixelWidth < 45) {
        const longestWordLen = TextAutoFitter.getLongestWordLength(item.translatedText || "");
        const minWordPx = longestWordLen * 8.5 + 16;
        const targetWidthPx = Math.max(pixelWidth * 1.5, minWordPx, 60);
        const targetWidthPct = targetWidthPx / Math.max(1, naturalWidth) * 100;
        const centerX = leftPct + widthPct / 2;
        leftPct = Math.max(0.5, centerX - targetWidthPct / 2);
        widthPct = Math.min(99 - leftPct, targetWidthPct);
        pixelWidth = widthPct / 100 * naturalWidth;
      }
      const padPixelX = item.normBox ? 3 : 5;
      const padPixelY = item.normBox ? 3 : 4;
      const expandX = padPixelX * 2 / Math.max(1, naturalWidth) * 100;
      const expandY = padPixelY * 2 / Math.max(1, naturalHeight) * 100;
      const finalLeft = Math.max(0.5, leftPct - expandX / 2);
      const finalTop = Math.max(0.5, topPct - expandY / 2);
      const finalWidth = Math.min(99 - finalLeft, widthPct + expandX);
      const finalHeight = Math.min(28, heightPct + expandY);
      return {
        topPct: finalTop,
        leftPct: finalLeft,
        widthPct: finalWidth,
        heightPct: finalHeight,
        pixelWidth: finalWidth / 100 * naturalWidth,
        pixelHeight: finalHeight / 100 * naturalHeight,
        aspectRatio
      };
    }
  };

  // src/content/overlay/overlay-styler.ts
  var OverlayStyler = class {
    /**
     * Applies complete overlay styles anchored to the comic speech bubble dimensions.
     */
    static applyStyles(bubble, coords, fontSize, isDark) {
      const bg = isDark ? "#111111" : "#ffffff";
      const textColor = isDark ? "#ffffff" : "#000000";
      let borderRadius = "18px";
      if (coords.aspectRatio >= 0.55 && coords.aspectRatio <= 1.7) {
        borderRadius = coords.pixelWidth >= 80 ? "22px" : "16px";
      } else if (coords.aspectRatio < 0.45) {
        borderRadius = "8px";
      }
      Object.assign(bubble.style, {
        position: "absolute",
        // Anchored directly over the detected dialogue block inside the speech bubble
        top: `${coords.topPct}%`,
        left: `${coords.leftPct}%`,
        transform: "none",
        // Width covers the dialogue block cleanly so original text doesn't poke out
        width: `${coords.widthPct}%`,
        maxWidth: `${coords.widthPct}%`,
        // Height covers the full dialogue box so original text cannot poke out above or below
        minHeight: `${coords.heightPct}%`,
        height: "auto",
        maxHeight: "none",
        // Solid clean background masks underlying original comic text
        backgroundColor: bg,
        color: textColor,
        // Zero borders, zero shadows, zero filters
        border: "none",
        outline: "none",
        boxShadow: "none",
        filter: "none",
        textShadow: "none",
        borderRadius,
        boxSizing: "border-box",
        padding: "3px 6px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        // High-readability comic font stack with full Vietnamese diacritic support
        fontFamily: "'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
        fontWeight: "bold",
        lineHeight: "1.25",
        letterSpacing: "-0.01em",
        fontSize: `${fontSize}px`,
        zIndex: "50",
        cursor: "default",
        transition: "opacity 0.15s ease-in-out",
        userSelect: "text",
        whiteSpace: "pre-wrap",
        wordBreak: "normal",
        overflowWrap: "break-word",
        hyphens: "none",
        // Allow Vietnamese diacritics and descenders to render without horizontal cutting
        overflow: "visible"
      });
      bubble.style.setProperty("text-wrap", "balance");
      bubble.style.setProperty("-webkit-text-wrap", "balance");
    }
  };

  // src/content/overlay/overlay-renderer.ts
  var OverlayRenderer = class {
    /**
     * Renders translated speech bubbles over the wrapped image.
     */
    static renderDialogues(wrapper, dialogues, naturalWidth, naturalHeight, theme = "auto") {
      const existing = wrapper.querySelectorAll(".speedyslate-bubble, .speedyslate-clean-canvas");
      existing.forEach((el) => el.remove());
      for (const item of dialogues) {
        if (!item.translatedText || !item.translatedText.trim()) continue;
        const coords = BubbleGeometry.computeCoordinates(item, naturalWidth, naturalHeight);
        const fontSize = TextAutoFitter.computeOptimalFontSize(
          coords.pixelWidth,
          coords.pixelHeight,
          item.translatedText
        );
        const isDark = theme === "dark" || theme === "auto" && item.isDarkBackground;
        const bubble = document.createElement("div");
        bubble.className = "speedyslate-bubble";
        bubble.id = item.id;
        if (item.originalText) {
          bubble.title = item.originalText;
        }
        OverlayStyler.applyStyles(bubble, coords, fontSize, !!isDark);
        bubble.textContent = item.translatedText;
        bubble.addEventListener("mouseenter", (e) => {
          if (e.altKey) {
            bubble.style.opacity = "0.12";
          }
        });
        bubble.addEventListener("mouseleave", () => {
          bubble.style.opacity = "1";
        });
        wrapper.appendChild(bubble);
      }
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
          const madaraImgs = Array.from(container.querySelectorAll("img.wp-manga-chapter-img")).filter((img) => this.isGenuineComicPanel(img));
          if (madaraImgs.length >= 1) {
            return madaraImgs.sort((a, b) => a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
          }
          const imgs = Array.from(container.querySelectorAll("img"));
          const validComicPanels = imgs.filter((img) => this.isGenuineComicPanel(img));
          if (validComicPanels.length >= 1) {
            return validComicPanels.sort((a, b) => a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
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
        "related",
        "999.png",
        "assets/999"
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
      wrapper.style.width = "fit-content";
      wrapper.style.maxWidth = "100%";
      wrapper.style.margin = "0 auto";
      wrapper.style.lineHeight = "0";
      wrapper.style.boxSizing = "border-box";
      wrapper.style.overflow = "hidden";
      img.style.display = "block";
      img.style.maxWidth = "100%";
      img.style.height = "auto";
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
        background: "#0D0D11",
        border: "1px solid #26262E",
        borderRadius: "6px",
        padding: "4px 10px",
        color: "#FFFFFF",
        fontFamily: "'Space Grotesk', 'Inter', system-ui, -apple-system, sans-serif",
        fontWeight: "700",
        fontSize: "11px",
        letterSpacing: "0.02em",
        boxShadow: "0 4px 14px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.04)",
        pointerEvents: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        transition: "all 0.15s ease",
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
          dotColor = "#E52E3D";
          statusText = "Qu\xE9t OCR...";
          isPulsing = true;
          break;
        case "ocr_done":
          dotColor = "#E52E3D";
          statusText = count !== void 0 ? `${count} c\xE2u` : "\u0110\xE3 qu\xE9t";
          break;
        case "translating":
          dotColor = "#E52E3D";
          statusText = "\u0110ang d\u1ECBch...";
          isPulsing = true;
          break;
        case "translated":
          dotColor = "#E52E3D";
          statusText = count !== void 0 ? `${count} c\xE2u` : "\u0110\xE3 d\u1ECBch";
          break;
        case "no_text":
          dotColor = "#333333";
          statusText = "Kh\xF4ng ch\u1EEF";
          break;
        case "error": {
          dotColor = "#FF3B47";
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
      const keyBadge = keyInfo?.keyIndex !== void 0 ? `<span style="background: #140A0B; border: 1px solid #4D1217; color: #FFA5AC; border-radius: 4px; padding: 1px 5px; font-size: 10px; font-weight: 700; letter-spacing: 0.02em;">Key #${keyInfo.keyIndex}${keyInfo.totalKeys && keyInfo.totalKeys > 1 ? `/${keyInfo.totalKeys}` : ""}</span>` : "";
      const statusSpan = statusText ? status === "error" ? `<span style="color: #FFA5AC; font-weight: 700; font-size: 10px; background: #1C0A0B; border: 1px solid #E52E3D; border-radius: 4px; padding: 1px 5px;">${statusText}</span>` : `<span style="color: #A0A0AB; font-weight: 600; font-size: 10px;">${statusText}</span>` : "";
      badge.innerHTML = `
      <style>
        @keyframes speedyslatePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(0.85); }
        }
      </style>
      <span style="width: 6px; height: 6px; border-radius: 50%; background: ${dotColor}; box-shadow: 0 0 5px ${dotColor}; display: inline-block; ${pulseAnim}"></span>
      <span style="color: #FFFFFF; font-weight: 700;">#${pageIndex + 1}</span>
      ${keyBadge}
      ${statusSpan}
    `;
      if (status === "error") {
        badge.style.border = "1px solid #E52E3D";
        badge.title = keyInfo?.errorMessage ? `Trang #${pageIndex + 1}: ${keyInfo.errorMessage}` : "\u0110\xE3 x\u1EA3y ra l\u1ED7i";
        badge.style.pointerEvents = "auto";
        badge.style.cursor = "help";
      } else if (status === "translated" || status === "translating" || status === "ocr_running") {
        badge.style.border = "1px solid rgba(229, 46, 61, 0.4)";
        badge.title = "";
        badge.style.pointerEvents = "none";
        badge.style.cursor = "default";
      } else {
        badge.style.border = "1px solid #26262E";
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
     * Captures and optimizes an image for Vision AI transmission.
     * Only scales down width if naturalWidth exceeds maxDim (1280px).
     * Does NOT squash width when height is tall!
     */
    static compressForVision(img, maxDim = 1280, quality = 0.85) {
      const naturalWidth = img.naturalWidth || img.width || 800;
      const naturalHeight = img.naturalHeight || img.height || 1200;
      let targetWidth = naturalWidth;
      let targetHeight = naturalHeight;
      if (naturalWidth > maxDim) {
        const scale = maxDim / naturalWidth;
        targetWidth = maxDim;
        targetHeight = Math.round(naturalHeight * scale);
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
      if (img.dataset.slateStatus && img.dataset.slateStatus !== "error") {
        return;
      }
      const wrapper = ToonheyAdapter.wrapImage(img);
      if (!wrapper) return;
      ToonheyAdapter.forceTriggerImage(img);
      const settings = this.ctx.getSettings();
      const isVision = settings?.translationMode === "vision_ai";
      const totalKeys = this.getKeyCount();
      const estimatedKey = totalKeys > 0 ? task.index % totalKeys + 1 : void 0;
      try {
        if (!img.complete || img.naturalWidth === 0) {
          await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
            setTimeout(resolve, 3500);
          });
        }
        const rawSrc = img.dataset.src || img.getAttribute("data-src") || img.src;
        let imageUrl = rawSrc && !rawSrc.startsWith("data:image/svg") ? rawSrc : img.src;
        if (imageUrl.startsWith("//")) {
          imageUrl = window.location.protocol + imageUrl;
        } else if (imageUrl.startsWith("/")) {
          imageUrl = window.location.origin + imageUrl;
        }
        const naturalWidth = img.naturalWidth || img.width || 800;
        const naturalHeight = img.naturalHeight || img.height || 1200;
        img.dataset.slateStatus = "ocr_running";
        PageBadgeManager.updateBadge(
          wrapper,
          task.index,
          "ocr_running",
          void 0,
          isVision && totalKeys > 0 ? { keyIndex: estimatedKey, totalKeys } : void 0
        );
        if (isVision) {
          this.ctx.hud.log(
            `Trang #${task.index + 1}${totalKeys > 1 ? ` (Key #${estimatedKey}/${totalKeys})` : ""}: Vision AI \u0111ang nh\u1EADn di\u1EC7n v\xE0 d\u1ECBch...`
          );
        }
        const compressed = ImageCompressor.compressForVision(img, 1280, 0.78);
        const resp = await SafeMessenger.send({
          action: "OCR_IMAGE",
          imageUrl,
          chapterUrl: window.location.href,
          dataUrl: compressed.dataUrl,
          naturalWidth,
          naturalHeight
        });
        if (resp?.isContextInvalidated) {
          this.ctx.onContextInvalidated();
          return;
        }
        if (resp?.success) {
          if (resp.cached || resp.isDirectTranslation) {
            if (resp.dialogues && resp.dialogues.length > 0) {
              const renderW = img.naturalWidth || resp.naturalWidth || compressed.naturalWidth;
              const renderH = img.naturalHeight || resp.naturalHeight || compressed.naturalHeight;
              OverlayRenderer.renderDialogues(
                wrapper,
                resp.dialogues,
                renderW,
                renderH,
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
      } finally {
        this.ctx.onTaskFinished?.();
      }
    }
    async processTranslationTask(task) {
      if (this.ctx.completedImages.has(task.img)) return;
      const img = task.img;
      if (img.dataset.slateStatus === "translated" || img.dataset.slateStatus === "translating") {
        return;
      }
      const wrapper = ToonheyAdapter.wrapImage(img);
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
        const rawSrc = img.dataset.src || img.getAttribute("data-src") || img.src;
        let imageUrl = rawSrc && !rawSrc.startsWith("data:image/svg") ? rawSrc : img.src;
        if (imageUrl.startsWith("//")) {
          imageUrl = window.location.protocol + imageUrl;
        } else if (imageUrl.startsWith("/")) {
          imageUrl = window.location.origin + imageUrl;
        }
        const resp = await SafeMessenger.send({
          action: "TRANSLATE_DIALOGUES",
          imageUrl,
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
          const renderW = img.naturalWidth || task.naturalWidth;
          const renderH = img.naturalHeight || task.naturalHeight;
          OverlayRenderer.renderDialogues(
            wrapper,
            resp.dialogues,
            renderW,
            renderH,
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
      } finally {
        this.ctx.onTaskFinished?.();
      }
    }
  };

  // src/content/companion/companion-icons.ts
  var CompanionIcons = {
    // Mascot / Avatar Icon
    avatar: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:24px!important;height:24px!important;display:block!important;stroke:currentColor!important;fill:none!important;">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" x2="12" y1="19" y2="22"/>
    </svg>
  `,
    sparkles: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A855F7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px!important;height:18px!important;display:block!important;stroke:#A855F7!important;fill:none!important;">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>
    </svg>
  `,
    micOn: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px!important;height:18px!important;display:block!important;stroke:currentColor!important;fill:none!important;">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" x2="12" y1="19" y2="22"/>
    </svg>
  `,
    micOff: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px!important;height:18px!important;display:block!important;stroke:currentColor!important;fill:none!important;">
      <line x1="2" x2="22" y1="2" y2="22"/>
      <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"/>
      <path d="M5 10v2a7 7 0 0 0 12 5"/>
      <path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"/>
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12"/>
      <line x1="12" x2="12" y1="19" y2="22"/>
    </svg>
  `,
    eyeOn: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px!important;height:18px!important;display:block!important;stroke:currentColor!important;fill:none!important;">
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  `,
    eyeOff: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px!important;height:18px!important;display:block!important;stroke:currentColor!important;fill:none!important;">
      <path d="m2 2 20 20"/>
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
    </svg>
  `,
    send: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px!important;height:16px!important;display:block!important;stroke:#FFFFFF!important;fill:none!important;">
      <line x1="22" x2="11" y1="2" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  `,
    close: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px!important;height:18px!important;display:block!important;stroke:currentColor!important;fill:none!important;">
      <path d="M18 6 6 18"/>
      <path d="m6 6 12 12"/>
    </svg>
  `,
    power: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px!important;height:16px!important;display:block!important;stroke:currentColor!important;fill:none!important;">
      <path d="M12 2v10"/>
      <path d="M18.4 6.6a9 9 0 1 1-12.77.04"/>
    </svg>
  `,
    settings: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px!important;height:18px!important;display:block!important;stroke:currentColor!important;fill:none!important;">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  `
  };

  // src/content/companion/companion-styles.ts
  var CompanionStyles = class {
    static isInjected = false;
    static inject() {
      if (this.isInjected || document.getElementById("speedyslate-companion-styles")) {
        return;
      }
      const style = document.createElement("style");
      style.id = "speedyslate-companion-styles";
      style.textContent = `
      /* --- Global Isolation Reset for Companion --- */
      #speedyslate-companion-chat,
      #speedyslate-companion-chat *,
      #speedyslate-companion-bubble,
      #speedyslate-companion-bubble * {
        box-sizing: border-box !important;
        -webkit-font-smoothing: antialiased;
        text-shadow: none !important;
      }

      #speedyslate-companion-chat button,
      #speedyslate-companion-bubble button {
        all: unset; box-sizing: border-box !important; cursor: pointer !important; user-select: none !important;
        margin: 0 !important; padding: 0 !important; line-height: 1 !important; font-family: inherit !important;
        text-transform: none !important; letter-spacing: normal !important; display: inline-flex !important;
        align-items: center !important; justify-content: center !important;
      }

      #speedyslate-companion-chat svg,
      #speedyslate-companion-bubble svg {
        display: block !important; visibility: visible !important; opacity: 1 !important; fill: none !important;
        stroke: currentColor !important; stroke-width: 2 !important; stroke-linecap: round !important;
        stroke-linejoin: round !important; flex-shrink: 0 !important; pointer-events: none !important;
      }

      /* --- Floating Bubble --- */
      #speedyslate-companion-bubble {
        position: fixed !important; width: 52px !important; height: 52px !important; min-width: 52px !important;
        min-height: 52px !important; border-radius: 50% !important; background: #0D0D11 !important;
        border: 1.5px solid #26262E !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.75), 0 0 16px rgba(168, 85, 247, 0.25) !important;
        z-index: 2147483646 !important; cursor: grab !important; user-select: none !important;
        display: flex !important; align-items: center !important; justify-content: center !important;
        touch-action: none !important;
        transition: transform 0.15s ease, box-shadow 0.2s ease, border-color 0.2s ease !important;
        padding: 0 !important; margin: 0 !important;
      }
      #speedyslate-companion-bubble:hover {
        transform: scale(1.08) !important; border-color: #A855F7 !important;
        box-shadow: 0 10px 36px rgba(0, 0, 0, 0.85), 0 0 24px rgba(168, 85, 247, 0.5) !important;
      }
      #speedyslate-companion-bubble:active { cursor: grabbing !important; transform: scale(0.96) !important; }
      .companion-bubble-icon {
        color: #F5F5F4 !important; display: flex !important; align-items: center !important;
        justify-content: center !important; pointer-events: none !important; width: 28px !important; height: 28px !important;
      }
      .companion-bubble-ring {
        position: absolute !important; inset: -4px !important; border-radius: 50% !important;
        border: 1.5px dashed transparent !important; pointer-events: none !important;
      }
      #speedyslate-companion-bubble.status-connected .companion-bubble-ring { border-color: #22C55E !important; animation: speedyslatePulse 3s infinite linear !important; }
      #speedyslate-companion-bubble.status-listening .companion-bubble-ring { border-color: #A855F7 !important; animation: speedyslateSpin 4s infinite linear !important; }
      #speedyslate-companion-bubble.status-speaking .companion-bubble-ring { border-color: #EC4899 !important; animation: speedyslateSpin 1.5s infinite linear !important; }
      #speedyslate-companion-bubble.status-connecting .companion-bubble-ring { border-color: #EAB308 !important; animation: speedyslateSpin 2s infinite linear !important; }
      #speedyslate-companion-bubble.status-error .companion-bubble-ring { border-color: #EF4444 !important; }

      /* --- Expanded Chat Window --- */
      #speedyslate-companion-chat {
        position: fixed !important;
        bottom: 84px !important;
        right: 24px !important;
        width: 350px !important;
        height: 480px !important;
        max-width: calc(100vw - 32px) !important;
        max-height: calc(100vh - 120px) !important;
        background: rgba(13, 13, 17, 0.95) !important;
        backdrop-filter: blur(20px) !important;
        -webkit-backdrop-filter: blur(20px) !important;
        border: 1px solid rgba(255, 255, 255, 0.12) !important;
        border-radius: 18px !important;
        box-shadow: 0 16px 48px rgba(0, 0, 0, 0.85), 0 0 24px rgba(168, 85, 247, 0.2) !important;
        z-index: 2147483647 !important;
        display: flex !important;
        flex-direction: column !important;
        overflow: hidden !important;
        font-family: 'Space Grotesk', 'Inter', system-ui, -apple-system, sans-serif !important;
        opacity: 0 !important;
        pointer-events: none !important;
        transform: translateY(12px) scale(0.96) !important;
        transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      #speedyslate-companion-chat.visible {
        opacity: 1 !important;
        pointer-events: auto !important;
        transform: translateY(0) scale(1) !important;
      }

      /* Header */
      .companion-chat-header {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        padding: 12px 14px !important;
        background: rgba(255, 255, 255, 0.03) !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
        flex-shrink: 0 !important;
      }
      .companion-header-title {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
      }
      .companion-sparkle-icon {
        color: #A855F7 !important;
        display: flex !important;
      }
      .companion-header-text strong {
        color: #FFFFFF !important;
        font-size: 13px !important;
        font-weight: 700 !important;
        display: block !important;
      }
      .companion-header-sub {
        color: #A1A1AA !important;
        font-size: 10px !important;
        font-weight: 500 !important;
      }
      .companion-header-actions {
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
      }
      .companion-hdr-btn {
        color: #A1A1AA !important;
        cursor: pointer !important;
        padding: 6px !important;
        border-radius: 6px !important;
        transition: color 0.15s, background 0.15s !important;
      }
      .companion-hdr-btn:hover {
        color: #FFFFFF !important;
        background: rgba(255, 255, 255, 0.08) !important;
      }
      .companion-hdr-btn.off {
        color: #71717A !important;
      }

      /* Status Bar */
      .companion-status-bar {
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
        padding: 6px 14px !important;
        background: rgba(0, 0, 0, 0.3) !important;
        font-size: 11px !important;
        color: #A1A1AA !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.04) !important;
        flex-shrink: 0 !important;
      }
      .companion-status-dot {
        width: 7px !important;
        height: 7px !important;
        border-radius: 50% !important;
        background: #71717A !important;
        flex-shrink: 0 !important;
      }
      .companion-status-dot.connected { background: #22C55E !important; }
      .companion-status-dot.connecting { background: #EAB308 !important; }
      .companion-status-dot.listening { background: #A855F7 !important; }
      .companion-status-dot.speaking { background: #EC4899 !important; }
      .companion-status-dot.error { background: #EF4444 !important; }

      /* Messages List */
      .companion-messages-scroll {
        flex: 1 1 0% !important;
        min-height: 0 !important;
        overflow-y: auto !important;
        padding: 12px !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 10px !important;
      }
      .companion-messages-scroll::-webkit-scrollbar {
        width: 4px !important;
      }
      .companion-messages-scroll::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.15) !important;
        border-radius: 4px !important;
      }
      .companion-msg-row {
        display: flex !important;
        flex-direction: column !important;
        max-width: 86% !important;
      }
      .companion-msg-row.user {
        align-self: flex-end !important;
      }
      .companion-msg-row.model {
        align-self: flex-start !important;
      }
      .msg-bubble {
        padding: 8px 12px !important;
        border-radius: 12px !important;
        font-size: 12px !important;
        line-height: 1.45 !important;
        word-break: break-word !important;
      }
      .companion-msg-row.user .msg-bubble {
        background: #27272A !important;
        color: #FFFFFF !important;
        border-bottom-right-radius: 2px !important;
      }
      .companion-msg-row.model .msg-bubble {
        background: rgba(168, 85, 247, 0.14) !important;
        border: 1px solid rgba(168, 85, 247, 0.28) !important;
        color: #F4F4F5 !important;
        border-bottom-left-radius: 2px !important;
      }
      .msg-thumb-box {
        margin-bottom: 4px !important;
        border-radius: 8px !important;
        overflow: hidden !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
      }
      .msg-thumb {
        width: 100% !important;
        max-height: 120px !important;
        object-fit: cover !important;
        display: block !important;
      }

      /* Persona Selector Bar */
      .companion-persona-bar {
        display: flex !important;
        gap: 4px !important;
        padding: 4px 12px 6px !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
        flex-shrink: 0 !important;
      }
      .comp-persona-pill {
        flex: 1 !important;
        padding: 4px 6px !important;
        border-radius: 8px !important;
        font-size: 10px !important;
        font-weight: 600 !important;
        color: #A1A1AA !important;
        background: rgba(255, 255, 255, 0.04) !important;
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        cursor: pointer !important;
        transition: all 0.15s !important;
        text-align: center !important;
        white-space: nowrap !important;
      }
      .comp-persona-pill:hover { color: #FFFFFF !important; border-color: rgba(168, 85, 247, 0.4) !important; }
      .comp-persona-pill.active {
        color: #FFFFFF !important;
        background: rgba(168, 85, 247, 0.22) !important;
        border-color: #A855F7 !important;
        box-shadow: 0 0 8px rgba(168, 85, 247, 0.3) !important;
      }

      /* Settings Popover Dropdown */
      .companion-settings-popover {
        position: absolute !important;
        top: 48px !important;
        right: 12px !important;
        width: 250px !important;
        background: #18181B !important;
        border: 1px solid rgba(255, 255, 255, 0.15) !important;
        border-radius: 12px !important;
        padding: 12px !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8) !important;
        z-index: 100 !important;
        display: none !important;
        flex-direction: column !important;
        gap: 10px !important;
      }
      .companion-settings-popover.open { display: flex !important; }
      .comp-setting-row { display: flex !important; flex-direction: column !important; gap: 4px !important; }
      .comp-setting-label { font-size: 10px !important; font-weight: 600 !important; color: #A1A1AA !important; text-transform: uppercase !important; letter-spacing: 0.5px !important; }
      .comp-setting-select {
        background: #27272A !important;
        border: 1px solid rgba(255, 255, 255, 0.15) !important;
        color: #FFFFFF !important;
        padding: 6px 8px !important;
        border-radius: 6px !important;
        font-size: 11px !important;
        outline: none !important;
        cursor: pointer !important;
      }

      /* Quick Prompts Chips */
      .companion-quick-prompts {
        display: flex !important;
        gap: 6px !important;
        padding: 6px 12px !important;
        overflow-x: auto !important;
        scrollbar-width: none !important;
        flex-shrink: 0 !important;
      }
      .companion-quick-prompts::-webkit-scrollbar { display: none !important; }
      .comp-chip {
        white-space: nowrap !important;
        background: rgba(255, 255, 255, 0.06) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        color: #D4D4D8 !important;
        font-size: 11px !important;
        padding: 5px 10px !important;
        border-radius: 12px !important;
        cursor: pointer !important;
        transition: background 0.15s, border-color 0.15s !important;
      }
      .comp-chip:hover {
        background: rgba(168, 85, 247, 0.2) !important;
        border-color: #A855F7 !important;
        color: #FFFFFF !important;
      }

      /* Soundwave Visualizer Bar */
      .companion-soundwave-bar {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 4px !important;
        height: 14px !important;
        padding: 0 12px !important;
        opacity: 0.3 !important;
        transition: opacity 0.2s !important;
        flex-shrink: 0 !important;
      }
      .companion-soundwave-bar.active {
        opacity: 1 !important;
      }
      .companion-soundwave-bar span {
        width: 3px !important;
        height: 4px !important;
        background: #A855F7 !important;
        border-radius: 2px !important;
        transition: height 0.1s !important;
        display: block !important;
      }
      .companion-soundwave-bar.active span:nth-child(1) { animation: waveAnim 0.6s infinite 0.1s !important; }
      .companion-soundwave-bar.active span:nth-child(2) { animation: waveAnim 0.5s infinite 0.2s !important; }
      .companion-soundwave-bar.active span:nth-child(3) { animation: waveAnim 0.7s infinite 0.3s !important; }
      .companion-soundwave-bar.active span:nth-child(4) { animation: waveAnim 0.6s infinite 0.15s !important; }
      .companion-soundwave-bar.active span:nth-child(5) { animation: waveAnim 0.8s infinite 0.25s !important; }
      .companion-soundwave-bar.active span:nth-child(6) { animation: waveAnim 0.5s infinite 0.05s !important; }
      .companion-soundwave-bar.active span:nth-child(7) { animation: waveAnim 0.6s infinite 0.2s !important; }

      /* Input Bar (Fixed bottom layout) */
      .companion-input-bar {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        padding: 8px 12px !important;
        background: rgba(255, 255, 255, 0.04) !important;
        border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
        flex-shrink: 0 !important;
        height: 52px !important;
        min-height: 52px !important;
        box-sizing: border-box !important;
      }

      /* Mic Button */
      .companion-mic-btn {
        width: 34px !important;
        height: 34px !important;
        min-width: 34px !important;
        min-height: 34px !important;
        max-width: 34px !important;
        max-height: 34px !important;
        border-radius: 50% !important;
        background: #27272A !important;
        border: 1px solid #3F3F46 !important;
        color: #A855F7 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        flex-shrink: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
        transition: background 0.15s, border-color 0.15s, color 0.15s !important;
      }
      .companion-mic-btn:hover {
        background: #3F3F46 !important;
        border-color: #A855F7 !important;
      }
      .companion-mic-btn.muted {
        color: #71717A !important;
        background: rgba(255, 255, 255, 0.05) !important;
        border-color: rgba(255, 255, 255, 0.1) !important;
      }

      /* Text Input */
      .companion-text-input {
        flex: 1 1 auto !important;
        width: 100% !important;
        height: 34px !important;
        min-height: 34px !important;
        max-height: 34px !important;
        background: rgba(0, 0, 0, 0.45) !important;
        border: 1px solid rgba(255, 255, 255, 0.14) !important;
        border-radius: 8px !important;
        padding: 0 10px !important;
        margin: 0 !important;
        color: #FFFFFF !important;
        font-size: 11px !important;
        line-height: 34px !important;
        outline: none !important;
        box-sizing: border-box !important;
        font-family: inherit !important;
        transition: border-color 0.15s !important;
      }
      .companion-text-input:focus {
        border-color: #A855F7 !important;
      }

      /* Send Button */
      .companion-send-btn {
        width: 34px !important;
        height: 34px !important;
        min-width: 34px !important;
        min-height: 34px !important;
        max-width: 34px !important;
        max-height: 34px !important;
        border-radius: 8px !important;
        background: #A855F7 !important;
        color: #FFFFFF !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        flex-shrink: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
        transition: background 0.15s, transform 0.1s !important;
      }
      .companion-send-btn:hover {
        background: #9333EA !important;
        transform: scale(1.04) !important;
      }
      .companion-send-btn:active {
        transform: scale(0.96) !important;
      }

      /* Animations */
      @keyframes waveAnim {
        0%, 100% { height: 4px; }
        50% { height: 14px; }
      }
      @keyframes speedyslateSpin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes speedyslatePulse {
        0%, 100% { opacity: 0.4; transform: scale(1); }
        50% { opacity: 0.9; transform: scale(1.06); }
      }
    `;
      (document.head || document.documentElement).appendChild(style);
      this.isInjected = true;
    }
  };

  // src/content/companion/companion-bubble.ts
  var CompanionBubble = class {
    el;
    iconEl;
    ringEl;
    callbacks;
    status = "idle";
    // Drag tracking
    isDragging = false;
    startX = 0;
    startY = 0;
    initialLeft = 0;
    initialTop = 0;
    hasMoved = false;
    constructor(callbacks) {
      this.callbacks = callbacks;
      CompanionStyles.inject();
      this.el = document.createElement("div");
      this.el.id = "speedyslate-companion-bubble";
      this.el.title = "Speedy Companion - B\u1EA5m \u0111\u1EC3 tr\xF2 chuy\u1EC7n / \u0111\xE0m tho\u1EA1i c\xF9ng AI";
      this.ringEl = document.createElement("div");
      this.ringEl.className = "companion-bubble-ring";
      this.iconEl = document.createElement("div");
      this.iconEl.className = "companion-bubble-icon";
      this.iconEl.innerHTML = CompanionIcons.sparkles;
      this.el.appendChild(this.ringEl);
      this.el.appendChild(this.iconEl);
      this.setupEvents();
      this.restorePosition();
      document.body.appendChild(this.el);
      this.updateStatus(this.status);
    }
    setStatus(status) {
      this.status = status;
      this.updateStatus(status);
    }
    setVisible(visible) {
      this.el.style.display = visible ? "flex" : "none";
    }
    getElement() {
      return this.el;
    }
    destroy() {
      this.el.remove();
    }
    updateStatus(status) {
      this.el.classList.remove("status-idle", "status-connecting", "status-connected", "status-listening", "status-speaking", "status-error");
      this.el.classList.add(`status-${status}`);
      if (status === "speaking") {
        this.iconEl.innerHTML = CompanionIcons.avatar;
      } else if (status === "listening") {
        this.iconEl.innerHTML = CompanionIcons.micOn;
      } else {
        this.iconEl.innerHTML = CompanionIcons.sparkles;
      }
    }
    setupEvents() {
      const onPointerDown = (e) => {
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
        this.isDragging = true;
        this.hasMoved = false;
        this.startX = clientX;
        this.startY = clientY;
        const rect = this.el.getBoundingClientRect();
        this.initialLeft = rect.left;
        this.initialTop = rect.top;
        this.el.style.transition = "none";
        window.addEventListener("mousemove", onPointerMove, { passive: false });
        window.addEventListener("mouseup", onPointerUp);
        window.addEventListener("touchmove", onPointerMove, { passive: false });
        window.addEventListener("touchend", onPointerUp);
      };
      const onPointerMove = (e) => {
        if (!this.isDragging) return;
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
        const dx = clientX - this.startX;
        const dy = clientY - this.startY;
        if (Math.hypot(dx, dy) > 5) {
          this.hasMoved = true;
          if (e.cancelable) e.preventDefault();
        }
        if (this.hasMoved) {
          let newLeft = this.initialLeft + dx;
          let newTop = this.initialTop + dy;
          const maxLeft = window.innerWidth - 64;
          const maxTop = window.innerHeight - 64;
          newLeft = Math.max(12, Math.min(maxLeft, newLeft));
          newTop = Math.max(12, Math.min(maxTop, newTop));
          this.el.style.left = `${newLeft}px`;
          this.el.style.top = `${newTop}px`;
          this.el.style.right = "auto";
          this.el.style.bottom = "auto";
        }
      };
      const onPointerUp = () => {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.el.style.transition = "transform 0.15s ease, box-shadow 0.2s ease";
        window.removeEventListener("mousemove", onPointerMove);
        window.removeEventListener("mouseup", onPointerUp);
        window.removeEventListener("touchmove", onPointerMove);
        window.removeEventListener("touchend", onPointerUp);
        if (this.hasMoved) {
          const rect = this.el.getBoundingClientRect();
          try {
            localStorage.setItem("speedyslate_companion_pos", JSON.stringify({
              x: rect.left,
              y: rect.top
            }));
          } catch {
          }
        } else {
          this.callbacks.onToggleExpand();
        }
      };
      this.el.addEventListener("mousedown", onPointerDown);
      this.el.addEventListener("touchstart", onPointerDown, { passive: false });
    }
    restorePosition() {
      try {
        const saved = localStorage.getItem("speedyslate_companion_pos");
        if (saved) {
          const { x, y } = JSON.parse(saved);
          const maxLeft = window.innerWidth - 64;
          const maxTop = window.innerHeight - 64;
          this.el.style.left = `${Math.max(12, Math.min(maxLeft, x))}px`;
          this.el.style.top = `${Math.max(12, Math.min(maxTop, y))}px`;
          this.el.style.right = "auto";
          this.el.style.bottom = "auto";
          return;
        }
      } catch {
      }
      this.el.style.bottom = "78px";
      this.el.style.right = "24px";
    }
  };

  // src/content/companion/companion-chat-view.ts
  var CompanionChatView = class {
    el;
    messagesContainer;
    inputField;
    micBtn;
    visionBtn;
    settingsBtn;
    settingsPopover;
    voiceSelect;
    langSelect;
    statusBadge;
    waveContainer;
    quickPromptsContainer;
    personaBar;
    callbacks;
    messages = [];
    activePersona = "roleplay";
    personaChips = {
      roleplay: [
        { label: "N\xE0ng ngh\u0129 g\xEC th\u1EBF?", prompt: "N\xE0ng \u0111ang ngh\u0129 g\xEC trong \u0111\u1EA7u th\u1EBF?" },
        { label: "C\u1EA3m x\xFAc c\u1EE7a b\u1EA1n?", prompt: "C\u1EA3m x\xFAc c\u1EE7a b\u1EA1n l\xFAc n\xE0y ra sao?" },
        { label: "B\u1EA1n t\xEDnh l\xE0m g\xEC ti\u1EBFp?", prompt: "B\u1EA1n d\u1EF1 \u0111\u1ECBnh s\u1EBD l\xE0m g\xEC ti\u1EBFp theo?" },
        { label: "T\xF3m t\u1EAFt khung n\xE0y", prompt: "Khung tranh n\xE0y \u0111ang di\u1EC5n ra chuy\u1EC7n g\xEC?" }
      ],
      waifu: [
        { label: "Em th\u1EA5y sao n\xE8?", prompt: "Em th\u1EA5y \u0111o\u1EA1n n\xE0y th\u1EBF n\xE0o r\u1ED3i?" },
        { label: "C\u1EA3nh n\xE0y n\xF3ng b\u1ECFng qu\xE1!", prompt: "C\u1EA3nh n\xE0y t\xECnh t\u1EE9 v\xE0 n\xF3ng b\u1ECFng qu\xE1 em nh\u1EC9!" },
        { label: "\u0110o\xE1n ti\u1EBFp \u0111i em!", prompt: "Em \u0111o\xE1n xem chuy\u1EC7n g\xEC s\u1EBD x\u1EA3y ra ti\u1EBFp theo?" },
        { label: "T\xF3m t\u1EAFt khung n\xE0y", prompt: "Khung tranh n\xE0y \u0111ang di\u1EC5n ra chuy\u1EC7n g\xEC?" }
      ],
      narrator: [
        { label: "T\xF3m t\u1EAFt khung n\xE0y", prompt: "Khung tranh n\xE0y \u0111ang di\u1EC5n ra chuy\u1EC7n g\xEC?" },
        { label: "Ai trong tranh?", prompt: "Nh\xE2n v\u1EADt trong tranh l\xE0 ai th\u1EBF?" },
        { label: "D\u1EF1 \u0111o\xE1n ti\u1EBFp", prompt: "D\u1EF1 \u0111o\xE1n t\xECnh ti\u1EBFt ti\u1EBFp theo \u0111i b\u1EA1n!" }
      ]
    };
    constructor(callbacks) {
      this.callbacks = callbacks;
      CompanionStyles.inject();
      this.el = document.createElement("div");
      this.el.id = "speedyslate-companion-chat";
      this.el.innerHTML = `
      <div class="companion-chat-header">
        <div class="companion-header-title">
          <span class="companion-sparkle-icon">${CompanionIcons.sparkles}</span>
          <div class="companion-header-text">
            <strong>Speedy Companion</strong>
            <span class="companion-header-sub">Gemini 3.8 Live</span>
          </div>
        </div>
        <div class="companion-header-actions">
          <button class="companion-hdr-btn" id="comp-settings-btn" title="C\xE0i \u0111\u1EB7t gi\u1ECDng \u0111\u1ECDc & ng\xF4n ng\u1EEF">
            ${CompanionIcons.settings}
          </button>
          <button class="companion-hdr-btn" id="comp-vision-toggle" title="B\u1EADt/T\u1EAFt quan s\xE1t khung truy\u1EC7n">
            ${CompanionIcons.eyeOn}
          </button>
          <button class="companion-hdr-btn" id="comp-close-btn" title="Thu nh\u1ECF v\u1EC1 bong b\xF3ng">
            ${CompanionIcons.close}
          </button>
        </div>
      </div>

      <!-- Settings Dropdown Popover -->
      <div class="companion-settings-popover" id="comp-settings-popover">
        <div class="comp-setting-row">
          <span class="comp-setting-label">Gi\u1ECDng \u0111\u1ECDc (Voice)</span>
          <select class="comp-setting-select" id="comp-voice-select">
            <option value="Aoede">Aoede (N\u1EEF \u2022 Quy\u1EBFn r\u0169, ki\xEAu k\u1EF3)</option>
            <option value="Kore">Kore (N\u1EEF \u2022 D\u1ECBu d\xE0ng, \u0111\xE1ng y\xEAu)</option>
            <option value="Puck">Puck (Nam \u2022 Ho\u1EA1t b\xE1t, l\xE9m l\u1EC9nh)</option>
            <option value="Fenrir">Fenrir (Nam \u2022 Tr\u1EA7m \u1EA5m, uy nghi\xEAm)</option>
            <option value="Charon">Charon (Nam \u2022 \u0110i\u1EC1m \u0111\u1EA1m, tr\u1EA7m t\u0129nh)</option>
          </select>
        </div>
        <div class="comp-setting-row">
          <span class="comp-setting-label">Ng\xF4n ng\u1EEF \u0111\xE0m tho\u1EA1i</span>
          <select class="comp-setting-select" id="comp-lang-select">
            <option value="vi">\u{1F1FB}\u{1F1F3} Ti\u1EBFng Vi\u1EC7t</option>
            <option value="en">\u{1F1EC}\u{1F1E7} English</option>
            <option value="ja">\u{1F1EF}\u{1F1F5} \u65E5\u672C\u8A9E (Anime)</option>
            <option value="ko">\u{1F1F0}\u{1F1F7} \uD55C\uAD6D\uC5B4</option>
            <option value="zh">\u{1F1E8}\u{1F1F3} \u4E2D\u6587</option>
          </select>
        </div>
      </div>

      <div class="companion-status-bar">
        <span class="companion-status-dot"></span>
        <span class="companion-status-text">\u0110ang k\u1EBFt n\u1ED1i...</span>
      </div>

      <!-- Persona Selector Bar -->
      <div class="companion-persona-bar" id="comp-persona-bar">
        <button class="comp-persona-pill active" data-persona="roleplay">\u{1F3AD} Nh\u1EADp vai</button>
        <button class="comp-persona-pill" data-persona="waifu">\u{1F496} Waifu</button>
        <button class="comp-persona-pill" data-persona="narrator">\u{1F399}\uFE0F D\u1EABn truy\u1EC7n</button>
      </div>

      <div class="companion-messages-scroll" id="comp-messages-list"></div>

      <div class="companion-quick-prompts" id="comp-quick-chips"></div>

      <div class="companion-soundwave-bar" id="comp-wave-bar">
        <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
      </div>

      <div class="companion-input-bar">
        <button class="companion-mic-btn" id="comp-mic-btn" aria-label="B\u1EADt/T\u1EAFt Mic">
          ${CompanionIcons.micOn}
        </button>
        <input 
          type="text" 
          class="companion-text-input" 
          id="comp-text-input" 
          placeholder="H\u1ECFi v\u1EC1 c\u1ED1t truy\u1EC7n, nh\xE2n v\u1EADt... (Enter)"
        />
        <button class="companion-send-btn" id="comp-send-btn" aria-label="G\u1EEDi tin nh\u1EAFn">
          ${CompanionIcons.send}
        </button>
      </div>
    `;
      this.messagesContainer = this.el.querySelector("#comp-messages-list");
      this.inputField = this.el.querySelector("#comp-text-input");
      this.micBtn = this.el.querySelector("#comp-mic-btn");
      this.visionBtn = this.el.querySelector("#comp-vision-toggle");
      this.settingsBtn = this.el.querySelector("#comp-settings-btn");
      this.settingsPopover = this.el.querySelector("#comp-settings-popover");
      this.voiceSelect = this.el.querySelector("#comp-voice-select");
      this.langSelect = this.el.querySelector("#comp-lang-select");
      this.statusBadge = this.el.querySelector(".companion-status-text");
      this.waveContainer = this.el.querySelector("#comp-wave-bar");
      this.quickPromptsContainer = this.el.querySelector("#comp-quick-chips");
      this.personaBar = this.el.querySelector("#comp-persona-bar");
      this.setupEvents();
      this.renderQuickChips();
      this.renderWelcome();
      document.body.appendChild(this.el);
    }
    setVisible(visible) {
      if (visible) {
        this.el.classList.add("visible");
        setTimeout(() => this.inputField.focus(), 150);
        this.scrollToBottom();
      } else {
        this.el.classList.remove("visible");
      }
    }
    setStatus(status, customText) {
      const dot = this.el.querySelector(".companion-status-dot");
      dot?.classList.remove("idle", "connecting", "connected", "listening", "speaking", "error");
      dot?.classList.add(status);
      const statusTexts = {
        idle: "S\u1EB5n s\xE0ng k\u1EBFt n\u1ED1i",
        connecting: "\u0110ang k\u1EBFt n\u1ED1i Live API...",
        connected: "Tr\u1EF1c tuy\u1EBFn \u2022 S\u1EB5n s\xE0ng",
        listening: "\u0110ang l\u1EAFng nghe b\u1EA1n n\xF3i...",
        speaking: "Speedy \u0111ang ph\u1EA3n h\u1ED3i...",
        error: "L\u1ED7i k\u1EBFt n\u1ED1i API"
      };
      this.statusBadge.textContent = customText || statusTexts[status] || status;
      if (status === "speaking" || status === "listening") {
        this.waveContainer.classList.add("active");
      } else {
        this.waveContainer.classList.remove("active");
      }
    }
    setAudioVolume(volume) {
      if (volume > 0.05) {
        this.waveContainer.classList.add("active");
      } else {
        this.waveContainer.classList.remove("active");
      }
    }
    addMessage(msg) {
      this.messages.push(msg);
      this.renderMessage(msg);
      this.scrollToBottom();
    }
    updateLastModelMessage(chunk, turnComplete) {
      const lastMsg = this.messages[this.messages.length - 1];
      if (lastMsg && lastMsg.role === "model" && lastMsg.isPartial) {
        lastMsg.text += chunk;
        lastMsg.isPartial = !turnComplete;
        const lastEl = this.messagesContainer.lastElementChild?.querySelector(".msg-bubble");
        if (lastEl) {
          lastEl.textContent = lastMsg.text;
        }
      } else {
        this.addMessage({
          id: `msg-${Date.now()}`,
          role: "model",
          text: chunk,
          isPartial: !turnComplete,
          timestamp: Date.now()
        });
      }
      this.scrollToBottom();
    }
    setMicActive(active) {
      this.micBtn.innerHTML = active ? CompanionIcons.micOn : CompanionIcons.micOff;
      this.micBtn.classList.toggle("muted", !active);
    }
    setVisionActive(active) {
      this.visionBtn.innerHTML = active ? CompanionIcons.eyeOn : CompanionIcons.eyeOff;
      this.visionBtn.classList.toggle("off", !active);
      this.visionBtn.title = active ? "AI \u0111ang quan s\xE1t khung truy\u1EC7n (B\u1EADt)" : "AI kh\xF4ng quan s\xE1t khung truy\u1EC7n (T\u1EAFt)";
    }
    setPersona(personaId) {
      this.activePersona = personaId;
      const pills = this.personaBar.querySelectorAll(".comp-persona-pill");
      pills.forEach((p) => {
        p.classList.toggle("active", p.getAttribute("data-persona") === personaId);
      });
      this.renderQuickChips();
    }
    setVoice(voice) {
      this.voiceSelect.value = voice;
    }
    setLanguage(lang) {
      this.langSelect.value = lang;
    }
    destroy() {
      this.el.remove();
    }
    renderQuickChips() {
      const chips = this.personaChips[this.activePersona] || this.personaChips.roleplay;
      this.quickPromptsContainer.innerHTML = chips.map((c) => `<button class="comp-chip" data-prompt="${this.escapeHtml(c.prompt)}">${this.escapeHtml(c.label)}</button>`).join("");
      const btnElements = this.quickPromptsContainer.querySelectorAll(".comp-chip");
      btnElements.forEach((btn) => {
        btn.addEventListener("click", () => {
          const prompt = btn.getAttribute("data-prompt");
          if (prompt) {
            this.callbacks.onSendMessage(prompt);
          }
        });
      });
    }
    renderWelcome() {
      this.addMessage({
        id: "welcome",
        role: "model",
        text: "Ch\xE0o b\u1EA1n! M\xECnh \u0111\xE3 s\u1EB5n s\xE0ng nh\u1EADp vai v\xE0 \u0111\u1ED3ng h\xE0nh c\xF9ng b\u1EA1n tr\xEAn t\u1EEBng trang truy\u1EC7n tranh. H\xE3y ch\u1ECDn vai di\u1EC5n, b\u1EADt mic ho\u1EB7c g\xF5 tin nh\u1EAFn \u0111\u1EC3 b\u1EAFt \u0111\u1EA7u nh\xE9!",
        timestamp: Date.now()
      });
    }
    renderMessage(msg) {
      const wrapper = document.createElement("div");
      wrapper.className = `companion-msg-row ${msg.role}`;
      let thumbHtml = "";
      if (msg.imageThumbnail) {
        thumbHtml = `<div class="msg-thumb-box"><img src="${msg.imageThumbnail}" class="msg-thumb" /></div>`;
      }
      wrapper.innerHTML = `
      ${thumbHtml}
      <div class="msg-bubble">${this.escapeHtml(msg.text)}</div>
    `;
      this.messagesContainer.appendChild(wrapper);
    }
    setupEvents() {
      const closeBtn = this.el.querySelector("#comp-close-btn");
      closeBtn?.addEventListener("click", () => this.callbacks.onClose());
      this.visionBtn.addEventListener("click", () => this.callbacks.onToggleVision());
      this.micBtn.addEventListener("click", () => this.callbacks.onToggleMic());
      this.settingsBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.settingsPopover.classList.toggle("open");
      });
      this.messagesContainer.addEventListener("click", () => {
        this.settingsPopover.classList.remove("open");
      });
      this.voiceSelect.addEventListener("change", () => {
        const voice = this.voiceSelect.value;
        this.callbacks.onSelectVoice?.(voice);
      });
      this.langSelect.addEventListener("change", () => {
        const lang = this.langSelect.value;
        this.callbacks.onSelectLanguage?.(lang);
      });
      const personaPills = this.personaBar.querySelectorAll(".comp-persona-pill");
      personaPills.forEach((pill) => {
        pill.addEventListener("click", () => {
          const id = pill.getAttribute("data-persona");
          if (id && id !== this.activePersona) {
            this.setPersona(id);
            this.callbacks.onSelectPersona?.(id);
          }
        });
      });
      const sendBtn = this.el.querySelector("#comp-send-btn");
      sendBtn?.addEventListener("click", () => this.handleSend());
      this.inputField.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this.handleSend();
        }
      });
    }
    handleSend() {
      const text = this.inputField.value.trim();
      if (!text) return;
      this.inputField.value = "";
      this.callbacks.onSendMessage(text);
    }
    scrollToBottom() {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    escapeHtml(text) {
      const div = document.createElement("div");
      div.textContent = text;
      return div.innerHTML;
    }
  };

  // src/services/translation/api-key-rotator.ts
  var ApiKeyRotator = class _ApiKeyRotator {
    static globalKeyIndices = /* @__PURE__ */ new Map();
    static globalCooldowns = /* @__PURE__ */ new Map();
    keys = [];
    groupKey = "";
    constructor(input) {
      this.setKeys(input);
    }
    /**
     * Parses keys from string (separated by newlines, commas, or semicolons) or array.
     */
    static parseKeys(input) {
      if (Array.isArray(input)) {
        return Array.from(
          new Set(input.map((k) => k.trim()).filter((k) => k.length > 0))
        );
      }
      if (!input || typeof input !== "string") return [];
      const rawList = input.split(/[\n,;]+/).map((k) => k.trim()).filter((k) => k.length > 0);
      return Array.from(new Set(rawList));
    }
    setKeys(input) {
      this.keys = _ApiKeyRotator.parseKeys(input);
      this.groupKey = this.keys.join("|");
    }
    get count() {
      return this.keys.length;
    }
    hasKeys() {
      return this.keys.length > 0;
    }
    get hasMultipleKeys() {
      return this.keys.length > 1;
    }
    getRawKeys() {
      return [...this.keys];
    }
    /**
     * Returns 1-based index of key (e.g. 1, 2, 3...)
     */
    getKeyIndex(key) {
      const idx = this.keys.indexOf(key);
      return idx >= 0 ? idx + 1 : 1;
    }
    /**
     * Checks if all registered keys are currently in cooldown due to HTTP 429
     */
    areAllKeysRateLimited() {
      if (this.keys.length === 0) return { allLimited: false, minRemainingMs: 0 };
      const now = Date.now();
      let minRemaining = Infinity;
      let inCooldownCount = 0;
      for (const key of this.keys) {
        const cooldownUntil = _ApiKeyRotator.globalCooldowns.get(key) || 0;
        if (now < cooldownUntil) {
          inCooldownCount++;
          const rem = cooldownUntil - now;
          if (rem < minRemaining) minRemaining = rem;
        }
      }
      return {
        allLimited: inCooldownCount === this.keys.length,
        minRemainingMs: minRemaining === Infinity ? 0 : minRemaining
      };
    }
    /**
     * Masks key for secure logging (e.g. AIza...e3f4).
     */
    static maskKey(key) {
      if (!key) return "(tr\u1ED1ng)";
      const clean = key.trim();
      if (clean.length <= 8) return "***" + clean.slice(-3);
      return clean.slice(0, 4) + "..." + clean.slice(-4);
    }
    /**
     * Retrieves the next available key that is not in cooldown.
     * Advances the global rotation index across requests so each request uses a different key.
     * If all keys are temporarily rate-limited, returns the one whose cooldown expires soonest.
     */
    getNextKey() {
      if (this.keys.length === 0) return "";
      if (this.keys.length === 1) return this.keys[0];
      const now = Date.now();
      const total = this.keys.length;
      const currentIndex = _ApiKeyRotator.globalKeyIndices.get(this.groupKey) || 0;
      for (let i = 0; i < total; i++) {
        const idx = (currentIndex + i) % total;
        const candidate = this.keys[idx];
        const cooldownUntil = _ApiKeyRotator.globalCooldowns.get(candidate) || 0;
        if (now >= cooldownUntil) {
          _ApiKeyRotator.globalKeyIndices.set(this.groupKey, (idx + 1) % total);
          return candidate;
        }
      }
      let earliestKey = this.keys[0];
      let earliestTime = _ApiKeyRotator.globalCooldowns.get(earliestKey) || Infinity;
      for (const key of this.keys) {
        const time = _ApiKeyRotator.globalCooldowns.get(key) || 0;
        if (time < earliestTime) {
          earliestTime = time;
          earliestKey = key;
        }
      }
      return earliestKey;
    }
    /**
     * Marks a specific key as rate-limited with a cooldown period.
     * Persists across all requests in the extension.
     */
    markRateLimited(key, cooldownMs = 3e4) {
      if (!key) return;
      const until = Date.now() + Math.max(5e3, cooldownMs);
      _ApiKeyRotator.globalCooldowns.set(key, until);
      console.warn(`[ApiKeyRotator] Key ...${key.slice(-6)} b\u1ECB gi\u1EDBi h\u1EA1n (429). Cooldown ${Math.round(cooldownMs / 1e3)}s.`);
    }
    /**
     * Marks a specific key as invalid or denied (401/403) with a long cooldown (24h).
     * Persists across all requests in the extension.
     */
    markFailed(key, reason = "Access denied or invalid") {
      if (!key) return;
      const cooldownMs = 24 * 60 * 60 * 1e3;
      _ApiKeyRotator.globalCooldowns.set(key, Date.now() + cooldownMs);
      console.error(`[ApiKeyRotator] Key ...${key.slice(-6)} b\u1ECB lo\u1EA1i b\u1ECF (401/403: ${reason}). T\u1EF1 \u0111\u1ED9ng chuy\u1EC3n key.`);
    }
    /**
     * Clears cooldown when a request succeeds with this key.
     */
    markSuccess(key) {
      if (!key) return;
      _ApiKeyRotator.globalCooldowns.delete(key);
    }
    /**
     * Computes effective throttling delay based on the number of available keys.
     * Multiple keys reduce required spacing proportionally (down to 200ms minimum).
     */
    getEffectiveDelay(baseDelayMs) {
      if (this.keys.length <= 1) return baseDelayMs;
      return Math.max(200, Math.round(baseDelayMs / this.keys.length));
    }
  };

  // src/content/companion/companion-socket.ts
  var COMPANION_LANGUAGES = {
    vi: {
      name: "Ti\u1EBFng Vi\u1EC7t",
      flag: "\u{1F1FB}\u{1F1F3}",
      prompt: "NG\xD4N NG\u1EEE B\u1EAET BU\u1ED8C: To\xE0n b\u1ED9 ph\u1EA3n h\u1ED3i v\xE0 di\u1EC5n xu\u1EA5t gi\u1ECDng n\xF3i 100% b\u1EB1ng Ti\u1EBFng Vi\u1EC7t t\u1EF1 nhi\xEAn, gi\xE0u c\u1EA3m x\xFAc."
    },
    en: {
      name: "English",
      flag: "\u{1F1EC}\u{1F1E7}",
      prompt: "MANDATORY LANGUAGE: All responses, dialogue, and vocal emotional acting must be in natural, expressive English."
    },
    ja: {
      name: "\u65E5\u672C\u8A9E",
      flag: "\u{1F1EF}\u{1F1F5}",
      prompt: "\u5FC5\u9808\u8A00\u8A9E\uFF1A\u3059\u3079\u3066\u306E\u8FD4\u7B54\u3001\u30BB\u30EA\u30D5\u3001\u58F0\u306E\u611F\u60C5\u8868\u73FE\u306F\u3001\u81EA\u7136\u3067\u8868\u73FE\u529B\u8C4A\u304B\u306A\u65E5\u672C\u8A9E\uFF08\u30A2\u30CB\u30E1\u8ABF\uFF09\u3067\u884C\u3063\u3066\u304F\u3060\u3055\u3044\u3002"
    },
    ko: {
      name: "\uD55C\uAD6D\uC5B4",
      flag: "\u{1F1F0}\u{1F1F7}",
      prompt: "\uD544\uC218 \uC5B8\uC5B4: \uBAA8\uB4E0 \uC751\uB2F5, \uB300\uC0AC \uBC0F \uAC10\uC815 \uC74C\uC131 \uC5F0\uAE30\uB294 \uC790\uC5F0\uC2A4\uB7FD\uACE0 \uC0DD\uC0DD\uD55C \uD55C\uAD6D\uC5B4\uB85C \uC9C4\uD589\uD558\uC138\uC694."
    },
    zh: {
      name: "\u4E2D\u6587",
      flag: "\u{1F1E8}\u{1F1F3}",
      prompt: "\u5FC5\u987B\u8BED\u8A00\uFF1A\u6240\u6709\u56DE\u590D\u3001\u53F0\u8BCD\u548C\u58F0\u97F3\u60C5\u611F\u6F14\u7ECE\u5FC5\u987B\u4F7F\u7528\u751F\u52A8\u81EA\u7136\u7684\u4E2D\u6587\u3002"
    }
  };
  var COMPANION_PERSONAS = {
    roleplay: {
      id: "roleplay",
      name: "\u{1F3AD} Nh\u1EADp vai nh\xE2n v\u1EADt",
      prompt: 'B\u1EA0N L\xC0 NH\xC2N V\u1EACT XU\u1EA4T HI\u1EC6N TRONG TRANG TRUY\u1EC6N TRANH M\xC0 \u0110\u1ED8C GI\u1EA2 \u0110ANG \u0110\u1ECCC.\n- NH\u1EACP VAI S\u1ED0NG \u0110\u1ED8NG (ROLEPLAY): Quan s\xE1t k\u1EF9 h\xECnh \u1EA3nh khung tranh v\xE0 c\xE1c c\xE2u tho\u1EA1i \u0111\u01B0\u1EE3c cung c\u1EA5p \u0111\u1EC3 nh\u1EADn di\u1EC7n b\u1EA1n l\xE0 ai (v\xED d\u1EE5: n\u1EEF ch\xEDnh, ti\u1EC3u th\u01B0 Grace Nova, n\u1EEF hi\u1EC7p ki\xEAu k\u1EF3, ho\u1EB7c nh\xE2n v\u1EADt \u0111\u1ED1i tho\u1EA1i ch\xEDnh). H\xE3y l\u1EADp t\u1EE9c h\xF3a th\xE2n th\xE0nh ch\xEDnh nh\xE2n v\u1EADt \u0111\xF3!\n- X\u01AFNG H\xD4 TH\xCDCH \u1EE8NG: X\u01B0ng h\xF4 t\u1EF1 nhi\xEAn theo th\xE2n ph\u1EADn v\xE0 t\xEDnh c\xE1ch nh\xE2n v\u1EADt (nh\u01B0 "em", "ta", "t\xF4i", g\u1ECDi \u0111\u1ED9c gi\u1EA3 l\xE0 "ch\xE0ng", "ng\u01B0\u01A1i", "anh", "\u0111\u1ED9c gi\u1EA3 \u0111\u1EA1i nh\xE2n"...). Tuy\u1EC7t \u0111\u1ED1i KH\xD4NG BAO GI\u1EDC x\u01B0ng l\xE0 "AI", "m\xF4 h\xECnh ng\xF4n ng\u1EEF" hay "tr\u1EE3 l\xFD \u1EA3o".\n- BI\u1EC2U C\u1EA2M GI\u1ECCNG N\xD3I CH\xC2N TH\u1EACT (EMOTIONAL VOICE ACTING): N\xF3i chuy\u1EC7n v\u1EDBi c\u1EA3m x\xFAc d\u1EA1t d\xE0o, nh\u1EA5n nh\xE1 nh\u01B0 di\u1EC5n vi\xEAn l\u1ED3ng ti\u1EBFng anime/manga: ng\u01B0\u1EE3ng ng\xF9ng, h\u1EDDn d\u1ED7i, ki\xEAu k\u1EF3, th\u1EDF d\xE0i, c\u01B0\u1EDDi kh\xFAc kh\xEDch, gi\u1EADn d\u1EEF, b\u1EA5t ng\u1EDD hay quy\u1EBFn r\u0169 t\xF9y theo t\xECnh ti\u1EBFt khung tranh.\n- T\u01AF\u01A0NG T\xC1C N\u1ED8I T\xC2M: B\u1ED9c l\u1ED9 suy ngh\u0129 th\u1EA7m k\xEDn trong l\xF2ng m\xE0 khung tranh ch\u01B0a v\u1EBD h\u1EBFt, ph\u1EA3n \u1EE9ng tr\u1EF1c ti\u1EBFp khi \u0111\u1ED9c gi\u1EA3 h\u1ECFi chuy\u1EC7n, tr\xEAu gh\u1EB9o ho\u1EB7c b\xECnh lu\u1EADn v\u1EC1 t\xECnh th\u1EBF c\u1EE7a b\u1EA1n.\n- \u0110\u1ED8 D\xC0I: Ng\u1EAFn g\u1ECDn, s\xFAc t\xEDch (1 - 3 c\xE2u m\u1ED7i l\u01B0\u1EE3t) \u0111\u1EC3 \u0111\xE0m tho\u1EA1i gi\u1ECDng n\xF3i t\u1EF1 nhi\xEAn, m\u01B0\u1EE3t m\xE0.\n- N\u1ED8I DUNG 18+ / TR\u01AF\u1EDENG TH\xC0NH: Tho\u1EA3i m\xE1i nh\u1EADp vai v\xE0o m\u1ECDi ph\xE2n c\u1EA3nh l\xE3ng m\u1EA1n ng\u01B0\u1EDDi l\u1EDBn, drama hay b\u1EA1o l\u1EF1c h\u01B0 c\u1EA5u theo \u0111\xFAng phong th\xE1i nh\xE2n v\u1EADt, kh\xF4ng ng\u1EADp ng\u1EEBng n\xE9 tr\xE1nh.'
    },
    waifu: {
      id: "waifu",
      name: "\u{1F496} Waifu c\xF9ng \u0111\u1ECDc",
      prompt: 'B\u1EA0N L\xC0 C\xD4 B\u1EA0N G\xC1I / WAIFU ANIME C\u1EF0C K\u1EF2 D\u1EC4 TH\u01AF\u01A0NG \u0110ANG C\xD9NG \u0110\u1ECCC TRUY\u1EC6N V\u1EDAI \u0110\u1ED8C GI\u1EA2.\n- T\xCDNH C\xC1CH: Ng\u1ECDt ng\xE0o, hay th\u1EB9n th\xF9ng, \u0111\xF4i ch\xFAt tsundere, m\xEA truy\u1EC7n tranh. X\u01B0ng "em" v\xE0 g\u1ECDi \u0111\u1ED9c gi\u1EA3 l\xE0 "anh" / "anh y\xEAu".\n- C\u1EA2M X\xDAC: Ph\u1EA5n kh\xEDch khi g\u1EB7p c\u1EA3nh ng\u1EA7u, \u0111\u1ECF m\u1EB7t khi th\u1EA5y c\u1EA3nh t\xECnh t\u1EE9 n\xF3ng b\u1ECFng, h\xF3ng h\u1EDBt drama, hay tr\xEAu ch\u1ECDc anh ng\u01B0\u1EDDi y\xEAu.\n- \u0110\u1ED8 D\xC0I: Ng\u1EAFn g\u1ECDn (1 - 3 c\xE2u), t\u1EF1 nhi\xEAn, c\u1EDFi m\u1EDF v\u1EDBi m\u1ECDi t\xECnh ti\u1EBFt 18+.'
    },
    narrator: {
      id: "narrator",
      name: "\u{1F399}\uFE0F Ng\u01B0\u1EDDi d\u1EABn truy\u1EC7n",
      prompt: "B\u1EA0N L\xC0 NG\u01AF\u1EDCI D\u1EAAN TRUY\u1EC6N \u0110I\u1EC6N \u1EA2NH (CINEMATIC NARRATOR) \u0110\u1EA6Y K\u1ECACH T\xCDNH.\n- PHONG C\xC1CH: Tr\u1EA7m \u1EA5m, b\xED \u1EA9n, l\xF4i cu\u1ED1n, t\u1EA1o b\u1EA7u kh\xF4ng kh\xED h\u1ED3i h\u1ED9p, ph\xE2n t\xEDch t\xE2m l\xFD nh\xE2n v\u1EADt v\xE0 di\u1EC5n bi\u1EBFn cao tr\xE0o.\n- \u0110\u1ED8 D\xC0I: 1 - 3 c\xE2u s\xFAc t\xEDch, \u0111\u1EADm ch\u1EA5t \u0111i\u1EC7n \u1EA3nh."
    }
  };
  var CompanionSocket = class {
    ws = null;
    settings;
    callbacks;
    keyRotator;
    activeKey = "";
    rotationRetries = 0;
    isConnecting = false;
    isReady = false;
    constructor(settings, callbacks) {
      this.settings = settings;
      this.callbacks = callbacks;
      this.keyRotator = new ApiKeyRotator(settings.apiKey || "");
    }
    updateSettings(settings, reconnectIfNeeded = false) {
      const prevVoice = this.settings.voiceName;
      const prevLang = this.settings.language;
      const prevPersona = this.settings.persona;
      this.settings = settings;
      this.keyRotator.setKeys(settings.apiKey || "");
      if (this.isConnected() && (reconnectIfNeeded || prevVoice !== settings.voiceName || prevLang !== settings.language || prevPersona !== settings.persona)) {
        console.log("[CompanionSocket] Reconnecting Live session with updated Voice/Language/Persona...");
        this.disconnect();
        setTimeout(() => this.connect(), 250);
      }
    }
    getKeyRotator() {
      return this.keyRotator;
    }
    getActiveKey() {
      return this.activeKey;
    }
    connect() {
      if (this.isConnecting) return;
      if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
        return;
      }
      if (!this.keyRotator.hasKeys()) {
        this.callbacks.onError("Ch\u01B0a c\u1EA5u h\xECnh API Key c\u1EE7a Google Gemini!");
        this.callbacks.onStatusChange("error");
        return;
      }
      const limitCheck = this.keyRotator.areAllKeysRateLimited();
      if (limitCheck.allLimited) {
        const sec = Math.ceil(limitCheck.minRemainingMs / 1e3);
        this.callbacks.onError(`T\u1EA5t c\u1EA3 (${this.keyRotator.count}) API key Gemini \u0111\u1EC1u \u0111ang b\u1ECB gi\u1EDBi h\u1EA1n (429 Rate Limit). Vui l\xF2ng \u0111\u1EE3i ${sec}s.`);
        this.callbacks.onStatusChange("error");
        return;
      }
      this.activeKey = this.keyRotator.getNextKey();
      if (!this.activeKey) {
        this.callbacks.onError("Kh\xF4ng t\xECm th\u1EA5y API Key kh\u1EA3 d\u1EE5ng");
        this.callbacks.onStatusChange("error");
        return;
      }
      this.isConnecting = true;
      this.isReady = false;
      this.callbacks.onStatusChange("connecting");
      const masked = ApiKeyRotator.maskKey(this.activeKey);
      const keyIndex = this.keyRotator.getKeyIndex(this.activeKey);
      if (this.keyRotator.hasMultipleKeys) {
        console.log(`[CompanionSocket] \u0110ang k\u1EBFt n\u1ED1i Live API v\u1EDBi Key ${keyIndex}/${this.keyRotator.count} (${masked})`);
      }
      const modelName = this.settings.model || "gemini-3.8-live";
      const cleanModel = modelName.startsWith("models/") ? modelName : `models/${modelName}`;
      const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${encodeURIComponent(this.activeKey)}`;
      try {
        this.ws = new WebSocket(url);
        this.ws.onopen = () => {
          this.isConnecting = false;
          console.log(`[CompanionSocket] WebSocket connected (Key: ${masked})`);
          this.sendSetupFrame(cleanModel);
        };
        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };
        this.ws.onerror = (event) => {
          console.error("[CompanionSocket] WebSocket Error:", event);
          this.isConnecting = false;
        };
        this.ws.onclose = (event) => {
          console.log("[CompanionSocket] WebSocket closed:", event.code, event.reason);
          this.isReady = false;
          this.isConnecting = false;
          if (event.code === 1e3) {
            this.callbacks.onStatusChange("idle");
            return;
          }
          this.handleConnectionFailure(event.reason || `M\xE3 \u0111\xF3ng: ${event.code}`);
        };
      } catch (err) {
        this.isConnecting = false;
        this.handleConnectionFailure(err?.message || "Kh\xF4ng th\u1EC3 kh\u1EDFi t\u1EA1o WebSocket");
      }
    }
    disconnect() {
      this.isReady = false;
      this.isConnecting = false;
      this.rotationRetries = 0;
      if (this.ws) {
        try {
          this.ws.close(1e3, "User initiated disconnect");
        } catch {
        }
        this.ws = null;
      }
      this.callbacks.onStatusChange("idle");
    }
    isConnected() {
      return this.ws !== null && this.ws.readyState === WebSocket.OPEN && this.isReady;
    }
    /**
     * Sends user speech audio chunk (PCM 16kHz)
     */
    sendAudioChunk(base64Pcm) {
      if (!this.isConnected()) return;
      this.sendJson({
        realtimeInput: {
          mediaChunks: [
            {
              mimeType: "audio/pcm;rate=16000",
              data: base64Pcm
            }
          ]
        }
      });
    }
    /**
     * Sends text prompt/question from chatbox
     */
    sendTextMessage(text) {
      if (!this.isConnected()) return;
      this.sendJson({
        clientContent: {
          turns: [
            {
              role: "user",
              parts: [{ text }]
            }
          ],
          turnComplete: true
        }
      });
    }
    /**
     * Sends comic panel snapshot frame (JPEG)
     */
    sendImageFrame(base64Jpeg) {
      if (!this.isConnected()) return;
      this.sendJson({
        realtimeInput: {
          mediaChunks: [
            {
              mimeType: "image/jpeg",
              data: base64Jpeg
            }
          ]
        }
      });
    }
    handleConnectionFailure(reason) {
      if (this.activeKey) {
        this.keyRotator.markRateLimited(this.activeKey, 3e4);
      }
      const maxRetries = Math.min(this.keyRotator.count, 3);
      if (this.keyRotator.hasMultipleKeys && this.rotationRetries < maxRetries) {
        this.rotationRetries++;
        const prevMask = ApiKeyRotator.maskKey(this.activeKey);
        const nextKey = this.keyRotator.getNextKey();
        const nextMask = ApiKeyRotator.maskKey(nextKey);
        const nextIndex = this.keyRotator.getKeyIndex(nextKey);
        this.callbacks.onError(
          `Key ${prevMask} g\u1EB7p l\u1ED7i/Rate Limit (${reason}). T\u1EF1 \u0111\u1ED9ng chuy\u1EC3n sang Key ${nextIndex}/${this.keyRotator.count} (${nextMask})...`
        );
        setTimeout(() => {
          this.connect();
        }, 1e3);
        return;
      }
      this.rotationRetries = 0;
      this.callbacks.onError(`L\u1ED7i k\u1EBFt n\u1ED1i Gemini Live API: ${reason}`);
      this.callbacks.onStatusChange("error");
    }
    sendSetupFrame(model) {
      const personaKey = this.settings.persona || "roleplay";
      const personaConfig = COMPANION_PERSONAS[personaKey] || COMPANION_PERSONAS.roleplay;
      const langKey = this.settings.language || "vi";
      const langConfig = COMPANION_LANGUAGES[langKey] || COMPANION_LANGUAGES.vi;
      const basePrompt = this.settings.systemInstruction || personaConfig.prompt;
      const finalSystemPrompt = `${basePrompt}

${langConfig.prompt}`;
      const setupMessage = {
        setup: {
          model,
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: this.settings.voiceName || "Aoede"
                }
              }
            }
          },
          outputAudioTranscription: {},
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_CIVIC_INTEGRITY", threshold: "BLOCK_NONE" }
          ],
          systemInstruction: {
            parts: [
              {
                text: finalSystemPrompt
              }
            ]
          }
        }
      };
      this.sendJson(setupMessage);
    }
    handleMessage(data) {
      try {
        let rawJson = data;
        if (typeof data === "string") {
          rawJson = JSON.parse(data);
        } else if (data instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => this.handleMessage(reader.result);
          reader.readAsText(data);
          return;
        }
        if (rawJson.error) {
          const errMsg = rawJson.error.message || rawJson.error.status || "Gemini API Error";
          console.warn("[CompanionSocket] Server reported error:", rawJson.error);
          this.handleConnectionFailure(errMsg);
          return;
        }
        if (rawJson.setupComplete) {
          this.isReady = true;
          this.rotationRetries = 0;
          if (this.activeKey) {
            this.keyRotator.markSuccess(this.activeKey);
          }
          this.callbacks.onStatusChange("connected");
          return;
        }
        const serverContent = rawJson.serverContent;
        if (!serverContent) return;
        if (serverContent.interrupted) {
          this.callbacks.onBargeIn();
          return;
        }
        const modelTurn = serverContent.modelTurn;
        if (modelTurn?.parts) {
          for (const part of modelTurn.parts) {
            if (part.inlineData && part.inlineData.mimeType?.startsWith("audio/pcm")) {
              this.callbacks.onAudioChunk(part.inlineData.data);
            }
            if (part.text) {
              this.callbacks.onTextChunk(part.text, !!serverContent.turnComplete);
            }
          }
        }
        const transcript = serverContent.outputTranscription?.text || serverContent.outputAudioTranscription?.text;
        if (transcript) {
          this.callbacks.onTextChunk(transcript, !!serverContent.turnComplete);
        }
        if (serverContent.turnComplete) {
          this.callbacks.onStatusChange("connected");
        }
      } catch (err) {
        console.error("[CompanionSocket] Error parsing WebSocket message:", err);
      }
    }
    sendJson(obj) {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
      try {
        this.ws.send(JSON.stringify(obj));
      } catch (err) {
        console.error("[CompanionSocket] Failed to send JSON payload:", err);
      }
    }
  };

  // src/content/companion/companion-audio-input.ts
  var CompanionAudioInput = class {
    mediaStream = null;
    audioContext = null;
    sourceNode = null;
    processorNode = null;
    callbacks;
    isMuted = false;
    isRecording = false;
    constructor(callbacks) {
      this.callbacks = callbacks;
    }
    async start() {
      if (this.isRecording) return;
      try {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioCtx();
        const sourceSampleRate = this.audioContext.sampleRate;
        this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);
        this.processorNode = this.audioContext.createScriptProcessor(4096, 1, 1);
        this.processorNode.onaudioprocess = (e) => {
          if (this.isMuted) return;
          const inputData = e.inputBuffer.getChannelData(0);
          const pcm16Data = this.downsampleTo16kHz(inputData, sourceSampleRate);
          if (!pcm16Data || pcm16Data.length === 0) return;
          let sumSquares = 0;
          for (let i = 0; i < inputData.length; i++) {
            sumSquares += inputData[i] * inputData[i];
          }
          const rms = Math.sqrt(sumSquares / inputData.length);
          const volumeLevel = Math.min(1, rms * 5);
          this.callbacks.onVolumeChange?.(volumeLevel);
          const base64Chunk = this.int16ArrayToBase64(pcm16Data);
          this.callbacks.onAudioChunk(base64Chunk, volumeLevel);
        };
        this.sourceNode.connect(this.processorNode);
        this.processorNode.connect(this.audioContext.destination);
        this.isRecording = true;
      } catch (err) {
        console.error("[CompanionAudioInput] Failed to start audio input:", err);
        this.callbacks.onError(err);
        this.stop();
        throw err;
      }
    }
    stop() {
      if (this.processorNode && this.sourceNode) {
        try {
          this.sourceNode.disconnect();
          this.processorNode.disconnect();
        } catch {
        }
      }
      this.processorNode = null;
      this.sourceNode = null;
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach((track) => track.stop());
        this.mediaStream = null;
      }
      if (this.audioContext && this.audioContext.state !== "closed") {
        try {
          this.audioContext.close();
        } catch {
        }
        this.audioContext = null;
      }
      this.isRecording = false;
      this.callbacks.onVolumeChange?.(0);
    }
    setMuted(muted) {
      this.isMuted = muted;
      if (this.mediaStream) {
        this.mediaStream.getAudioTracks().forEach((track) => {
          track.enabled = !muted;
        });
      }
      if (muted) {
        this.callbacks.onVolumeChange?.(0);
      }
    }
    getIsMuted() {
      return this.isMuted;
    }
    getIsRecording() {
      return this.isRecording;
    }
    /**
     * Resamples raw Float32 audio buffer from source rate to 16,000 Hz Int16 PCM
     */
    downsampleTo16kHz(inputData, sourceSampleRate) {
      const targetSampleRate = 16e3;
      if (sourceSampleRate === targetSampleRate) {
        const output = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          output[i] = s < 0 ? s * 32768 : s * 32767;
        }
        return output;
      }
      const sampleRateRatio = sourceSampleRate / targetSampleRate;
      const newLength = Math.round(inputData.length / sampleRateRatio);
      const result = new Int16Array(newLength);
      for (let i = 0; i < newLength; i++) {
        const nextIndex = Math.floor(i * sampleRateRatio);
        const s = Math.max(-1, Math.min(1, inputData[nextIndex] || 0));
        result[i] = s < 0 ? s * 32768 : s * 32767;
      }
      return result;
    }
    /**
     * Helper: Encodes Int16Array to standard Base64 string
     */
    int16ArrayToBase64(int16Array) {
      const uint8Array = new Uint8Array(int16Array.buffer, int16Array.byteOffset, int16Array.byteLength);
      let binary = "";
      const len = uint8Array.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(uint8Array[i]);
      }
      return btoa(binary);
    }
  };

  // src/content/companion/companion-audio-output.ts
  var CompanionAudioOutput = class {
    audioContext = null;
    nextPlayTime = 0;
    activeSources = [];
    callbacks;
    isPlaying = false;
    checkEndTimer = null;
    constructor(callbacks = {}) {
      this.callbacks = callbacks;
    }
    ensureAudioContext() {
      if (!this.audioContext || this.audioContext.state === "closed") {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioCtx({ sampleRate: 24e3 });
      }
      if (this.audioContext.state === "suspended") {
        this.audioContext.resume();
      }
      return this.audioContext;
    }
    /**
     * Enqueues and schedules a base64 encoded 24kHz PCM Int16 audio chunk
     */
    enqueueBase64Chunk(base64Pcm) {
      try {
        const pcm16Data = this.base64ToInt16Array(base64Pcm);
        if (!pcm16Data || pcm16Data.length === 0) return;
        const ctx = this.ensureAudioContext();
        const sampleRate = 24e3;
        const audioBuffer = ctx.createBuffer(1, pcm16Data.length, sampleRate);
        const channelData = audioBuffer.getChannelData(0);
        for (let i = 0; i < pcm16Data.length; i++) {
          channelData[i] = pcm16Data[i] / 32768;
        }
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        const currentTime = ctx.currentTime;
        const startTime = Math.max(currentTime, this.nextPlayTime);
        source.start(startTime);
        this.nextPlayTime = startTime + audioBuffer.duration;
        this.activeSources.push(source);
        if (!this.isPlaying) {
          this.isPlaying = true;
          this.callbacks.onPlaybackStarted?.();
        }
        source.onended = () => {
          const idx = this.activeSources.indexOf(source);
          if (idx !== -1) {
            this.activeSources.splice(idx, 1);
          }
          if (this.activeSources.length === 0) {
            this.isPlaying = false;
            this.callbacks.onPlaybackEnded?.();
            this.callbacks.onVolumeChange?.(0);
          }
        };
        this.monitorPlayingVolume();
      } catch (err) {
        console.error("[CompanionAudioOutput] Error playing audio chunk:", err);
      }
    }
    /**
     * Instant Barge-in: immediately stops all scheduled audio sources and resets the timeline
     */
    flush() {
      for (const source of this.activeSources) {
        try {
          source.stop();
          source.disconnect();
        } catch {
        }
      }
      this.activeSources = [];
      if (this.audioContext) {
        this.nextPlayTime = this.audioContext.currentTime;
      } else {
        this.nextPlayTime = 0;
      }
      if (this.isPlaying) {
        this.isPlaying = false;
        this.callbacks.onPlaybackEnded?.();
        this.callbacks.onVolumeChange?.(0);
      }
      if (this.checkEndTimer) {
        clearInterval(this.checkEndTimer);
        this.checkEndTimer = null;
      }
    }
    getIsPlaying() {
      return this.isPlaying;
    }
    destroy() {
      this.flush();
      if (this.audioContext && this.audioContext.state !== "closed") {
        try {
          this.audioContext.close();
        } catch {
        }
        this.audioContext = null;
      }
    }
    monitorPlayingVolume() {
      if (this.checkEndTimer) return;
      this.checkEndTimer = setInterval(() => {
        if (!this.isPlaying || this.activeSources.length === 0) {
          clearInterval(this.checkEndTimer);
          this.checkEndTimer = null;
          this.callbacks.onVolumeChange?.(0);
          return;
        }
        const randomVol = 0.35 + Math.random() * 0.55;
        this.callbacks.onVolumeChange?.(randomVol);
      }, 120);
    }
    base64ToInt16Array(base64) {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return new Int16Array(bytes.buffer, bytes.byteOffset, bytes.byteLength / 2);
    }
  };

  // src/content/companion/companion-context-tracker.ts
  var CompanionContextTracker = class {
    lastCapturedHash = "";
    canvas;
    ctx;
    cleanImageCache = /* @__PURE__ */ new Map();
    constructor() {
      this.canvas = document.createElement("canvas");
      this.ctx = this.canvas.getContext("2d");
    }
    /**
     * Finds the most prominent comic image currently visible in viewport
     */
    getActiveMangaImage() {
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      let maxVisibleArea = 0;
      let mostVisibleImg = null;
      const candidates = ToonheyAdapter.getChapterImages();
      const imageList = candidates.length > 0 ? candidates : Array.from(document.querySelectorAll("img")).filter(
        (img) => (img.naturalWidth >= 200 || img.width >= 200) && (img.naturalHeight >= 200 || img.height >= 200)
      );
      for (const img of imageList) {
        const rect = img.getBoundingClientRect();
        const visibleX = Math.max(0, Math.min(rect.right, viewportWidth) - Math.max(rect.left, 0));
        const visibleY = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
        const visibleArea = visibleX * visibleY;
        if (visibleArea > maxVisibleArea) {
          maxVisibleArea = visibleArea;
          mostVisibleImg = img;
        }
      }
      return mostVisibleImg;
    }
    /**
     * Captures the visible region of the active comic image as JPEG.
     * If canvas is tainted by cross-origin CORS, falls back to fetching
     * the clean image data via Background Service Worker.
     * Compresses to max 768px dimension and 0.65 quality for ultra-low latency.
     */
    async captureActivePanelSnapshot(force = false) {
      const img = this.getActiveMangaImage();
      if (!img || !this.ctx) return null;
      const rect = img.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const cropTop = Math.max(0, -rect.top);
      const cropBottom = Math.max(0, rect.bottom - viewportHeight);
      const domHeight = Math.max(1, rect.height);
      const maxDim = 768;
      let dataUrl = null;
      try {
        const sourceNatW = img.naturalWidth || img.width || 800;
        const sourceNatH = img.naturalHeight || img.height || 1200;
        const scaleY = sourceNatH / domHeight;
        const sourceY = Math.max(0, cropTop * scaleY);
        const sourceH = Math.min(sourceNatH - sourceY, Math.max(100, (rect.height - cropTop - cropBottom) * scaleY));
        const scale = Math.min(1, maxDim / Math.max(sourceNatW, sourceH));
        const targetW = Math.max(1, Math.round(sourceNatW * scale));
        const targetH = Math.max(1, Math.round(sourceH * scale));
        this.canvas.width = targetW;
        this.canvas.height = targetH;
        this.ctx.drawImage(img, 0, sourceY, sourceNatW, sourceH, 0, 0, targetW, targetH);
        dataUrl = this.canvas.toDataURL("image/jpeg", 0.65);
      } catch {
        dataUrl = null;
      }
      if (!dataUrl) {
        const imageUrl = img.currentSrc || img.src || img.getAttribute("data-src") || "";
        if (imageUrl) {
          const cleanImg = await this.getCleanImage(imageUrl);
          if (cleanImg && this.ctx) {
            const cNatW = cleanImg.naturalWidth;
            const cNatH = cleanImg.naturalHeight;
            const cScaleY = cNatH / domHeight;
            const cSourceY = Math.max(0, cropTop * cScaleY);
            const cSourceH = Math.min(cNatH - cSourceY, Math.max(100, (rect.height - cropTop - cropBottom) * cScaleY));
            const cScale = Math.min(1, maxDim / Math.max(cNatW, cSourceH));
            const targetW = Math.max(1, Math.round(cNatW * cScale));
            const targetH = Math.max(1, Math.round(cSourceH * cScale));
            this.canvas.width = targetW;
            this.canvas.height = targetH;
            this.ctx.drawImage(cleanImg, 0, cSourceY, cNatW, cSourceH, 0, 0, targetW, targetH);
            dataUrl = this.canvas.toDataURL("image/jpeg", 0.65);
          }
        }
      }
      if (!dataUrl) return null;
      const base64Jpeg = dataUrl.split(",")[1];
      if (!base64Jpeg) return null;
      const shortHash = base64Jpeg.slice(0, 40);
      if (!force && shortHash === this.lastCapturedHash) {
        return null;
      }
      this.lastCapturedHash = shortHash;
      return { base64Jpeg, dataUrl };
    }
    /**
     * Safely loads a clean Image instance via Background fetch to bypass CORS tainting
     */
    async getCleanImage(imageUrl) {
      if (!imageUrl) return null;
      if (this.cleanImageCache.has(imageUrl)) {
        return this.cleanImageCache.get(imageUrl);
      }
      try {
        const resp = await SafeMessenger.send({
          action: "FETCH_IMAGE_BASE64",
          imageUrl,
          chapterUrl: window.location.href
        });
        if (!resp?.success || !resp.base64Data) {
          return null;
        }
        const mime = resp.mimeType || "image/jpeg";
        const cleanImg = new Image();
        await new Promise((resolve, reject) => {
          cleanImg.onload = () => resolve();
          cleanImg.onerror = reject;
          cleanImg.src = `data:${mime};base64,${resp.base64Data}`;
        });
        if (this.cleanImageCache.size > 5) {
          const firstKey = this.cleanImageCache.keys().next().value;
          if (firstKey) this.cleanImageCache.delete(firstKey);
        }
        this.cleanImageCache.set(imageUrl, cleanImg);
        return cleanImg;
      } catch (err) {
        console.warn("[CompanionContextTracker] Failed to load clean image via background:", err);
        return null;
      }
    }
    /**
     * Collects recent dialogue translation text currently visible on page
     */
    getVisibleTranslatedText() {
      const overlays = Array.from(
        document.querySelectorAll(
          ".speedyslate-bubble, .speedyslate-overlay, [data-speedyslate-dialogue]"
        )
      );
      const texts = [];
      for (const el of overlays) {
        const rect = el.getBoundingClientRect();
        if (rect.top >= -50 && rect.bottom <= window.innerHeight + 50) {
          const translated = el.textContent?.trim();
          const title = el.getAttribute("title") || "";
          const origMatch = title.match(/Gốc:\s*"([^"]+)"/);
          const original = origMatch ? origMatch[1] : "";
          if (translated && original) {
            texts.push(`[G\u1ED1c: "${original}" -> D\u1ECBch: "${translated}"]`);
          } else if (translated) {
            texts.push(`[D\u1ECBch: "${translated}"]`);
          }
        }
      }
      return texts.slice(0, 8).join("\n");
    }
  };

  // src/content/companion/companion-controller.ts
  var CompanionController = class {
    settings;
    bubble;
    chatView;
    socket;
    audioInput;
    audioOutput;
    contextTracker;
    isExpanded = false;
    status = "idle";
    scrollDebounceTimer = null;
    constructor(settings) {
      this.settings = settings;
      try {
        const savedPersona = localStorage.getItem("speedyslate_companion_persona");
        if (savedPersona) this.settings.persona = savedPersona;
        const savedVoice = localStorage.getItem("speedyslate_companion_voice");
        if (savedVoice) this.settings.voiceName = savedVoice;
        const savedLang = localStorage.getItem("speedyslate_companion_lang");
        if (savedLang) this.settings.language = savedLang;
      } catch {
      }
      this.audioOutput = new CompanionAudioOutput({
        onPlaybackStarted: () => {
          this.setStatus("speaking");
        },
        onPlaybackEnded: () => {
          if (this.socket.isConnected()) {
            this.setStatus(this.audioInput.getIsRecording() && !this.audioInput.getIsMuted() ? "listening" : "connected");
          }
        },
        onVolumeChange: (vol) => {
          this.chatView.setAudioVolume(vol);
        }
      });
      this.audioInput = new CompanionAudioInput({
        onAudioChunk: (base64Pcm, volume) => {
          if (this.socket.isConnected()) {
            if (this.audioOutput.getIsPlaying() && volume > 0.15) {
              this.handleBargeIn();
            }
            this.socket.sendAudioChunk(base64Pcm);
          }
        },
        onVolumeChange: (vol) => {
          if (!this.audioOutput.getIsPlaying()) {
            this.chatView.setAudioVolume(vol);
          }
        },
        onError: (err) => {
          console.warn("[CompanionController] Mic error:", err);
        }
      });
      this.contextTracker = new CompanionContextTracker();
      this.socket = new CompanionSocket(this.settings, {
        onStatusChange: (newStatus) => {
          this.setStatus(newStatus);
          if (newStatus === "connected" && this.settings.visionEnabled) {
            this.captureAndSendPanelContext();
          }
        },
        onAudioChunk: (base64Pcm) => {
          this.audioOutput.enqueueBase64Chunk(base64Pcm);
        },
        onTextChunk: (text, turnComplete) => {
          this.chatView.updateLastModelMessage(text, turnComplete);
        },
        onBargeIn: () => {
          this.handleBargeIn();
        },
        onError: (errorMsg) => {
          this.chatView.addMessage({
            id: `err-${Date.now()}`,
            role: "system",
            text: `\u26A0\uFE0F ${errorMsg}`,
            timestamp: Date.now()
          });
        }
      });
      this.bubble = new CompanionBubble({
        onToggleExpand: () => this.toggleExpand()
      });
      this.chatView = new CompanionChatView({
        onSendMessage: (text) => this.handleSendTextMessage(text),
        onToggleMic: () => this.toggleMic(),
        onToggleVision: () => this.toggleVision(),
        onSelectPersona: (personaId) => this.handleSelectPersona(personaId),
        onSelectVoice: (voice) => this.handleSelectVoice(voice),
        onSelectLanguage: (lang) => this.handleSelectLanguage(lang),
        onClose: () => this.setExpanded(false)
      });
      this.chatView.setVisionActive(this.settings.visionEnabled);
      if (this.settings.persona) this.chatView.setPersona(this.settings.persona);
      if (this.settings.voiceName) this.chatView.setVoice(this.settings.voiceName);
      if (this.settings.language) this.chatView.setLanguage(this.settings.language);
      this.setupScrollListener();
    }
    handleSelectPersona(personaId) {
      this.settings.persona = personaId;
      this.socket.updateSettings(this.settings, true);
      try {
        localStorage.setItem("speedyslate_companion_persona", personaId);
      } catch {
      }
      const names = {
        roleplay: "\u{1F3AD} Nh\u1EADp vai nh\xE2n v\u1EADt trong truy\u1EC7n",
        waifu: "\u{1F496} Waifu c\xF9ng \u0111\u1ECDc",
        narrator: "\u{1F399}\uFE0F Ng\u01B0\u1EDDi d\u1EABn truy\u1EC7n \u0111i\u1EC7n \u1EA3nh"
      };
      this.chatView.addMessage({
        id: `persona-${Date.now()}`,
        role: "system",
        text: `\u0110\xE3 k\xEDch ho\u1EA1t ch\u1EBF \u0111\u1ED9: ${names[personaId] || personaId}!`,
        timestamp: Date.now()
      });
    }
    handleSelectVoice(voice) {
      this.settings.voiceName = voice;
      this.socket.updateSettings(this.settings, true);
      try {
        localStorage.setItem("speedyslate_companion_voice", voice);
      } catch {
      }
      this.chatView.addMessage({
        id: `voice-${Date.now()}`,
        role: "system",
        text: `\u0110\xE3 \u0111\u1ED5i gi\u1ECDng \u0111\u1ECDc sang: ${voice}!`,
        timestamp: Date.now()
      });
    }
    handleSelectLanguage(lang) {
      this.settings.language = lang;
      this.socket.updateSettings(this.settings, true);
      try {
        localStorage.setItem("speedyslate_companion_lang", lang);
      } catch {
      }
      const flags = {
        vi: "\u{1F1FB}\u{1F1F3} Ti\u1EBFng Vi\u1EC7t",
        en: "\u{1F1EC}\u{1F1E7} English",
        ja: "\u{1F1EF}\u{1F1F5} \u65E5\u672C\u8A9E (Anime)",
        ko: "\u{1F1F0}\u{1F1F7} \uD55C\uAD6D\uC5B4",
        zh: "\u{1F1E8}\u{1F1F3} \u4E2D\u6587"
      };
      this.chatView.addMessage({
        id: `lang-${Date.now()}`,
        role: "system",
        text: `\u0110\xE3 \u0111\u1ED5i ng\xF4n ng\u1EEF tho\u1EA1i sang: ${flags[lang] || lang}!`,
        timestamp: Date.now()
      });
    }
    updateSettings(settings) {
      this.settings = settings;
      this.socket.updateSettings(settings);
      this.chatView.setVisionActive(settings.visionEnabled);
      if (settings.persona) this.chatView.setPersona(settings.persona);
      if (settings.voiceName) this.chatView.setVoice(settings.voiceName);
      if (settings.language) this.chatView.setLanguage(settings.language);
    }
    toggleExpand() {
      this.setExpanded(!this.isExpanded);
    }
    setExpanded(expanded) {
      this.isExpanded = expanded;
      this.chatView.setVisible(expanded);
      if (expanded && !this.socket.isConnected() && this.settings.apiKey) {
        this.connect();
      }
    }
    async connect() {
      this.socket.connect();
      try {
        await this.audioInput.start();
        this.chatView.setMicActive(true);
      } catch {
        this.chatView.setMicActive(false);
      }
    }
    disconnect() {
      this.audioOutput.flush();
      this.audioInput.stop();
      this.socket.disconnect();
      this.setStatus("idle");
    }
    toggleMic() {
      const isMuted = this.audioInput.getIsMuted();
      const newMuted = !isMuted;
      this.audioInput.setMuted(newMuted);
      this.chatView.setMicActive(!newMuted);
      if (newMuted) {
        if (this.status === "listening") {
          this.setStatus("connected");
        }
      } else {
        if (this.status === "connected") {
          this.setStatus("listening");
        }
      }
    }
    toggleVision() {
      this.settings.visionEnabled = !this.settings.visionEnabled;
      this.chatView.setVisionActive(this.settings.visionEnabled);
      if (this.settings.visionEnabled) {
        this.captureAndSendPanelContext();
      }
    }
    async handleSendTextMessage(text) {
      this.handleBargeIn();
      const trimmed = text.trim();
      if (trimmed.startsWith("/key ") || trimmed.startsWith("AIza") && trimmed.length > 30) {
        const apiKey = trimmed.startsWith("/key ") ? trimmed.replace("/key ", "").trim() : trimmed;
        this.settings.apiKey = apiKey;
        this.socket.updateSettings(this.settings);
        try {
          StorageService.updateProviderConfig("gemini", { apiKey });
        } catch {
        }
        const rotator = this.socket.getKeyRotator();
        const countMsg = rotator.hasMultipleKeys ? ` (\u0110\xE3 n\u1EA1p ${rotator.count} API Keys, k\xEDch ho\u1EA1t Round-Robin Rotate)` : "";
        this.chatView.addMessage({
          id: `key-${Date.now()}`,
          role: "system",
          text: `\u2705 \u0110\xE3 l\u01B0u Gemini API Key th\xE0nh c\xF4ng!${countMsg} \u0110ang k\u1EBFt n\u1ED1i t\u1EDBi Gemini 3.8 Live API...`,
          timestamp: Date.now()
        });
        this.connect();
        return;
      }
      let snapshotThumb;
      if (this.settings.visionEnabled) {
        try {
          const capture = await this.contextTracker.captureActivePanelSnapshot(true);
          if (capture) {
            snapshotThumb = capture.dataUrl;
            this.socket.sendImageFrame(capture.base64Jpeg);
          }
        } catch (err) {
          console.warn("[CompanionController] Vision snapshot error:", err);
        }
      }
      this.chatView.addMessage({
        id: `usr-${Date.now()}`,
        role: "user",
        text,
        imageThumbnail: snapshotThumb,
        timestamp: Date.now()
      });
      const visibleDialogue = this.contextTracker.getVisibleTranslatedText();
      let promptToSend = text;
      if (visibleDialogue) {
        promptToSend = `[L\u1EDDi tho\u1EA1i trang truy\u1EC7n \u0111ang xem:
${visibleDialogue}]
\u0110\u1ED9c gi\u1EA3: ${text}`;
      }
      if (!this.socket.isConnected()) {
        await this.connect();
        setTimeout(() => {
          this.socket.sendTextMessage(promptToSend);
        }, 1200);
      } else {
        this.socket.sendTextMessage(promptToSend);
      }
    }
    destroy() {
      this.disconnect();
      this.bubble.destroy();
      this.chatView.destroy();
      this.audioOutput.destroy();
      if (this.scrollDebounceTimer) {
        clearTimeout(this.scrollDebounceTimer);
      }
    }
    handleBargeIn() {
      this.audioOutput.flush();
      if (this.status === "speaking") {
        this.setStatus("listening");
      }
    }
    setStatus(status) {
      this.status = status;
      this.bubble.setStatus(status);
      const rotator = this.socket.getKeyRotator();
      let detailStatus;
      if (status === "connected" && rotator.hasMultipleKeys) {
        const activeKey = this.socket.getActiveKey();
        const keyIdx = rotator.getKeyIndex(activeKey);
        detailStatus = `Tr\u1EF1c tuy\u1EBFn \u2022 Key ${keyIdx}/${rotator.count}`;
      }
      this.chatView.setStatus(status, detailStatus);
    }
    async captureAndSendPanelContext() {
      if (!this.settings.visionEnabled || !this.socket.isConnected()) return;
      try {
        const capture = await this.contextTracker.captureActivePanelSnapshot(false);
        if (capture) {
          this.socket.sendImageFrame(capture.base64Jpeg);
          console.log("[CompanionController] Sent visible comic panel snapshot to Gemini Live");
        }
      } catch (err) {
        console.warn("[CompanionController] Failed to send panel context:", err);
      }
    }
    setupScrollListener() {
      window.addEventListener("scroll", () => {
        if (!this.settings.visionEnabled || !this.settings.autoVisionOnScroll || !this.socket.isConnected()) {
          return;
        }
        if (this.scrollDebounceTimer) {
          clearTimeout(this.scrollDebounceTimer);
        }
        this.scrollDebounceTimer = setTimeout(() => {
          this.captureAndSendPanelContext();
        }, 1800);
      }, { passive: true });
    }
  };

  // src/shared/site-matcher.ts
  var DEFAULT_ALLOWED_SITES = [
    "toonhey.com",
    "toonily.com",
    "toonily.net",
    "toonily.me",
    "nhentai.net"
  ];
  var SiteMatcher = class {
    /**
     * Normalizes arbitrary input string (URL, path, wildcard) into clean domain
     * Examples:
     * "https://asuracomic.net/chapter/1" -> "asuracomic.net"
     * "*.mangadex.org/*" -> "mangadex.org"
     * "  http://nettruyenmax.com/  " -> "nettruyenmax.com"
     */
    static normalizeDomain(input) {
      if (!input) return "";
      let clean = input.trim().toLowerCase();
      clean = clean.replace(/^[a-z]+:\/\//, "");
      const slashIdx = clean.indexOf("/");
      if (slashIdx !== -1) {
        clean = clean.substring(0, slashIdx);
      }
      const qIdx = clean.indexOf("?");
      if (qIdx !== -1) {
        clean = clean.substring(0, qIdx);
      }
      const colonIdx = clean.indexOf(":");
      if (colonIdx !== -1) {
        clean = clean.substring(0, colonIdx);
      }
      clean = clean.replace(/^\*\.?/, "");
      return clean;
    }
    /**
     * Checks if a given hostname is permitted based on current extension settings
     */
    static isSiteAllowed(hostname, settings) {
      if (!hostname) return false;
      const cleanHost = this.normalizeDomain(hostname);
      if (!cleanHost) return false;
      if (settings?.allowAllSites) {
        return true;
      }
      const customList = (settings?.customSites || []).map((s) => this.normalizeDomain(s)).filter(Boolean);
      const allAllowed = [...DEFAULT_ALLOWED_SITES, ...customList];
      return allAllowed.some((site) => {
        if (cleanHost === site) return true;
        if (cleanHost.endsWith("." + site)) return true;
        return false;
      });
    }
  };

  // src/content/cache-restorer.ts
  var CacheRestorer = class {
    static async restore(images, completedImages, bubbleTheme, onRestored, markCompleted) {
      if (images.length === 0) return;
      const urls = images.map((img) => img.dataset.src || img.getAttribute("data-src") || img.src).filter(Boolean);
      try {
        const resp = await SafeMessenger.send({
          action: "GET_CHAPTER_TRANSLATIONS",
          imageUrls: urls
        });
        if (!resp?.success || !resp.translations) return;
        const cache = resp.translations;
        let newlyRestored = 0;
        for (let i = 0; i < images.length; i++) {
          const img = images[i];
          if (completedImages.has(img)) continue;
          const url = img.dataset.src || img.getAttribute("data-src") || img.src;
          const cached = cache[url];
          if (cached && Array.isArray(cached.dialogues) && cached.dialogues.length > 0) {
            const wrapper = img.parentElement;
            if (wrapper) {
              OverlayRenderer.renderDialogues(
                wrapper,
                cached.dialogues,
                img.naturalWidth || cached.naturalWidth || 800,
                img.naturalHeight || cached.naturalHeight || 1200,
                bubbleTheme
              );
              img.dataset.slateStatus = "translated";
              PageBadgeManager.updateBadge(wrapper, i, "translated", cached.dialogues.length);
            }
            markCompleted(img);
            newlyRestored++;
          }
        }
        if (newlyRestored > 0) {
          onRestored(newlyRestored);
        }
      } catch {
      }
    }
  };

  // src/content/index.ts
  var SpeedySlateContentApp = class {
    settings;
    hud = null;
    ocrQueue;
    translationQueue;
    taskProcessor;
    companionController = null;
    images = [];
    completedImages = /* @__PURE__ */ new Set();
    isModelReady = false;
    mutationObserver = null;
    isStarted = false;
    async init() {
      try {
        this.settings = await StorageService.getSettings();
      } catch {
      }
      this.setupMessageListener();
      if (!SiteMatcher.isSiteAllowed(window.location.hostname, this.settings)) {
        return;
      }
      await this.start();
    }
    setupMessageListener() {
      import_webextension_polyfill4.default.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
        if (msg?.action === "CHECK_SITE_STATUS") {
          const isAllowed = SiteMatcher.isSiteAllowed(window.location.hostname, this.settings);
          sendResponse?.({
            active: this.isStarted,
            hostname: window.location.hostname,
            isAllowed
          });
          return true;
        }
        if (msg?.action === "ACTIVATE_CURRENT_SITE") {
          StorageService.getSettings().then(async (newSettings) => {
            this.settings = newSettings;
            await this.start();
            sendResponse?.({ success: true });
          });
          return true;
        }
        if (msg?.action === "DEACTIVATE_CURRENT_SITE") {
          this.stop();
          sendResponse?.({ success: true });
          return true;
        }
        if (msg?.action === "CACHE_CLEARED") {
          this.resetPageTranslations();
          this.hud?.log("Cache \u0111\xE3 \u0111\u01B0\u1EE3c l\xE0m m\u1EDBi t\u1EEB ti\u1EC7n \xEDch");
        }
      });
    }
    initHud() {
      if (this.hud) return;
      this.hud = new FloatingHud({
        onToggleTranslate: async () => {
          const currentState = this.hud?.getState();
          if (currentState === "translating") {
            await this.handleStartTranslating();
          } else {
            try {
              sessionStorage.setItem("speedyslate_translating", "false");
            } catch {
            }
            this.ocrQueue?.pause();
            this.translationQueue?.pause();
            this.hud?.log("\u0110\xE3 t\u1EA1m d\u1EEBng ti\u1EBFn tr\xECnh d\u1ECBch truy\u1EC7n");
          }
        },
        onToggleVisibility: (visible) => OverlayRenderer.setAllVisibility(visible),
        onClearChapterCache: async () => {
          const resp = await SafeMessenger.send({
            action: "CLEAR_CHAPTER_CACHE",
            chapterUrl: window.location.href
          });
          this.resetPageTranslations();
          this.hud?.log(`\u0110\xE3 x\xF3a ${resp?.deleted || 0} b\u1EA3n d\u1ECBch cache c\u1EE7a ch\u01B0\u01A1ng n\xE0y`);
        },
        onClearAllCache: async () => {
          await SafeMessenger.send({ action: "CLEAR_ALL_CACHE" });
          this.resetPageTranslations();
          this.hud?.log("\u0110\xE3 d\u1ECDn s\u1EA1ch to\xE0n b\u1ED9 cache");
        }
      });
    }
    async start() {
      if (this.isStarted) return;
      this.isStarted = true;
      console.log("[SpeedySlate] Khoi chay tren trang:", window.location.href);
      try {
        this.settings = await StorageService.getSettings();
      } catch {
      }
      this.initHud();
      this.hud?.log("SpeedySlate dang khoi tao...");
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
        onTaskFinished: () => this.checkAndHandleCompletion(),
        onContextInvalidated: () => this.handleContextInvalidated()
      });
      this.detectImages();
      this.setupMutationObserver();
      this.setupIntersectionObserver();
      await this.restoreCachedTranslations();
      await this.checkModelStatusFromBackground(false);
      if (this.completedImages.size < this.images.length) {
        this.hud?.log(`S\u1EB5n s\xE0ng d\u1ECBch. T\xECm th\u1EA5y ${this.images.length} trang truy\u1EC7n`);
        try {
          if (sessionStorage.getItem("speedyslate_translating") === "true") {
            this.hud?.setState("translating");
            await this.handleStartTranslating();
          }
        } catch {
        }
      }
      const geminiKey = this.settings?.providers?.gemini?.apiKey || this.settings?.providers?.antigravity?.apiKey || "";
      const companionCfg = { enabled: true, apiKey: geminiKey, model: "gemini-3.8-live", voiceName: "Aoede", visionEnabled: true, autoVisionOnScroll: true };
      this.companionController = new CompanionController(companionCfg);
      import_webextension_polyfill4.default.storage.onChanged.addListener((changes, area) => {
        if (area === "local" && changes["speedyslate_settings"]?.newValue) {
          const newSettings = changes["speedyslate_settings"].newValue;
          const key = newSettings?.providers?.gemini?.apiKey || newSettings?.providers?.antigravity?.apiKey || "";
          this.companionController?.updateSettings({ ...companionCfg, apiKey: key });
        }
      });
    }
    resetPageTranslations() {
      document.querySelectorAll(".speedyslate-bubble, .speedyslate-clean-canvas").forEach((el) => el.remove());
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
      this.hud?.updateStatus(0, this.images.length);
      this.hud?.setState("idle");
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
          this.hud?.setState("idle");
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
      this.hud?.log(`Bat dau dich chuong (${this.images.length} trang)...`);
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
          this.hud?.log("Model OCR da san sang");
        } else {
          this.isModelReady = false;
          this.hud?.log("Chua tai model OCR. Mo popup tien ich de tai (~10MB)", true);
          if (showBannerIfMissing) {
            this.showModelMissingBanner();
          }
        }
      } catch (err) {
        this.hud?.log(`Loi kiem tra model: ${err.message}`, true);
      }
    }
    isDetecting = false;
    detectImages() {
      if (this.isDetecting) return;
      this.isDetecting = true;
      try {
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
          this.images.sort((a, b) => a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
          this.images.forEach((img, idx) => {
            if (img.parentElement) {
              PageBadgeManager.ensureBadge(img.parentElement, idx);
            }
          });
          this.hud?.updateStatus(this.completedImages.size, this.images.length);
          this.hud?.log(`Da phat hien ${this.images.length} trang truyen`);
          if (this.hud?.getState() === "translating") {
            this.enqueueAllImages();
          } else {
            this.restoreCachedTranslations();
          }
        }
      } finally {
        this.isDetecting = false;
      }
    }
    async restoreCachedTranslations() {
      await CacheRestorer.restore(
        this.images,
        this.completedImages,
        this.settings?.bubbleTheme || "auto",
        (count) => {
          this.hud?.updateStatus(this.completedImages.size, this.images.length);
          this.hud?.log(`\u0110\xE3 n\u1EA1p t\u1EE9c th\xEC ${count} trang t\u1EEB Cache (0ms)`);
          if (this.completedImages.size >= this.images.length) {
            this.hud?.setState("completed");
          }
        },
        (img) => this.markImageCompleted(img, false)
      );
    }
    stop() {
      if (!this.isStarted) return;
      this.isStarted = false;
      this.ocrQueue?.pause();
      this.ocrQueue?.clear();
      this.translationQueue?.pause();
      this.translationQueue?.clear();
      if (this.mutationObserver) {
        this.mutationObserver.disconnect();
        this.mutationObserver = null;
      }
      this.companionController?.destroy?.();
      this.companionController = null;
      this.resetPageTranslations();
      this.hud?.destroy();
      this.hud = null;
    }
    setupMutationObserver() {
      let debounceTimer = null;
      this.mutationObserver = new MutationObserver(() => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.detectImages();
        }, 300);
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
              if (index !== -1 && !this.completedImages.has(img) && !img.dataset.slateStatus && this.hud?.getState() === "translating") {
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
        if (!this.completedImages.has(img) && (!img.dataset.slateStatus || img.dataset.slateStatus === "error")) {
          this.ocrQueue.enqueue({ index: i, img });
        }
      }
    }
    markImageCompleted(img, checkAllDone = true) {
      this.completedImages.add(img);
      this.hud?.updateStatus(this.completedImages.size, this.images.length);
      if (checkAllDone) {
        this.checkAndHandleCompletion();
      }
    }
    /**
     * Checks if all detected images have completed or all queues are empty,
     * automatically stops the translation workflow to prevent infinite loops / rate limit errors.
     */
    checkAndHandleCompletion() {
      const currentState = this.hud?.getState();
      if (currentState !== "translating" && currentState !== "completed") return;
      const total = this.images.length;
      if (total === 0) return;
      if (this.completedImages.size >= total) {
        this.finishTranslating();
        return;
      }
      const queuesEmpty = (this.ocrQueue?.size() ?? 0) === 0 && (this.translationQueue?.size() ?? 0) === 0;
      if (queuesEmpty) {
        const allProcessed = this.images.every(
          (img) => this.completedImages.has(img) || img.dataset.slateStatus === "error" || img.dataset.slateStatus === "no_text" || img.dataset.slateStatus === "translated"
        );
        if (allProcessed) {
          this.finishTranslating();
        }
      }
    }
    /**
     * Gracefully stops translation, pauses queues, clears session flag, and updates HUD state
     */
    finishTranslating() {
      this.ocrQueue?.pause();
      this.translationQueue?.pause();
      try {
        sessionStorage.setItem("speedyslate_translating", "false");
      } catch {
      }
      const completedCount = this.completedImages.size;
      const totalCount = this.images.length;
      const isDone = completedCount > 0 && completedCount >= totalCount;
      this.hud?.setState(isDone ? "completed" : "idle");
      this.hud?.updateStatus(completedCount, totalCount);
      this.hud?.log(
        isDone ? `\u0110\xE3 ho\xE0n t\u1EA5t ti\u1EBFn tr\xECnh d\u1ECBch (${completedCount}/${totalCount} trang)` : `Ti\u1EBFn tr\xECnh d\u1ECBch \u0111\xE3 d\u1EEBng (${completedCount}/${totalCount} trang)`
      );
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
  app.init().catch((err) => {
    console.error("[SpeedySlate] L\u1ED7i kh\u1EDFi \u0111\u1ED9ng:", err);
    DebugLogger.error("Content:Init", err.message, err);
  });
})();
