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
  var import_webextension_polyfill5 = __toESM(require_browser_polyfill(), 1);

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
    google_free: {
      name: "Google Translate (Free 0-Key)",
      baseUrl: "https://translate.googleapis.com",
      defaultModel: "gtx-free",
      suggestedModels: ["gtx-free"],
      requiresApiKey: false,
      defaultDelayMs: 300
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
  var PPU_ONNX_BASE = "https://media.githubusercontent.com/media/PT-Perkasa-Pilar-Utama/ppu-paddle-ocr-models/main";
  var PPU_DICT_BASE = "https://raw.githubusercontent.com/PT-Perkasa-Pilar-Utama/ppu-paddle-ocr-models/main";
  var OCR_MODEL_PRESETS = [
    {
      id: "comic-manga-manhwa",
      name: "Comic & Manga AI Detector (~20MB - Chuy\xEAn Manga/Manhwa)",
      description: "RT-DETR-v2 chuy\xEAn Manga/Manhwa k\u1EBFt h\u1EE3p DBNet v5 qu\xE9t b\xF9 ch\u1EEF d\u1EABn truy\u1EC7n ngo\xE0i khung tho\u1EA1i.",
      totalSizeMb: 20.4,
      files: {
        detUrl: "https://huggingface.co/ogkalu/comic-text-and-bubble-detector/resolve/main/detector-v4-s_int8.onnx",
        det2Url: `${PPU_ONNX_BASE}/detection/PP-OCRv5_mobile_det_infer.onnx`,
        recUrl: "https://huggingface.co/deepghs/paddleocr/resolve/main/rec/en_PP-OCRv4_rec/model.onnx",
        keysUrl: "https://huggingface.co/deepghs/paddleocr/resolve/main/rec/en_PP-OCRv4_rec/dict.txt"
      }
    },
    {
      id: "comic-manga-cjk",
      name: "Comic & Manga CJK Raw (~31MB - Nh\u1EADt/H\xE0n/Trung)",
      description: "RT-DETR-v2 chuy\xEAn Manga k\u1EBFt h\u1EE3p DBNet v5 qu\xE9t b\xF9 & b\u1ED9 nh\u1EADn di\u1EC7n CJK 6.600+ k\xFD t\u1EF1 cho b\u1EA3n RAW g\u1ED1c.",
      totalSizeMb: 31.1,
      files: {
        detUrl: "https://huggingface.co/ogkalu/comic-text-and-bubble-detector/resolve/main/detector-v4-s_int8.onnx",
        det2Url: `${PPU_ONNX_BASE}/detection/PP-OCRv5_mobile_det_infer.onnx`,
        recUrl: "https://huggingface.co/deepghs/paddleocr/resolve/main/rec/ch_PP-OCRv4_rec/model.onnx",
        keysUrl: "https://huggingface.co/deepghs/paddleocr/resolve/main/rec/ch_PP-OCRv4_rec/dict.txt"
      }
    },
    {
      id: "ppocr-v6-multilingual",
      name: "PaddleOCR v6 Small WebGPU (~30MB - \u0110a ng\xF4n ng\u1EEF CJK + Latin)",
      description: "Th\u1EBF h\u1EC7 PP-OCRv6 m\u1EDBi nh\u1EA5t ch\u1EA1y 100% tr\xEAn WebGPU (Det + Rec), h\u1ED7 tr\u1EE3 xoay ph\u1EB3ng ch\u1EEF nghi\xEAng v\xE0 \u0111a ng\xF4n ng\u1EEF Nh\u1EADt/H\xE0n/Trung/Anh.",
      totalSizeMb: 29.7,
      files: {
        detUrl: `${PPU_ONNX_BASE}/detection/PP-OCRv6_small_det.onnx`,
        recUrl: `${PPU_ONNX_BASE}/recognition/PP-OCRv6_small_rec.onnx`,
        keysUrl: `${PPU_DICT_BASE}/recognition/ppocrv6_dict.txt`
      }
    },
    {
      id: "ppocr-v5-english-fast",
      name: "PaddleOCR v5 English WebGPU (~12MB - Si\xEAu t\u1ED1c Comic/Manhwa Anh)",
      description: "B\u1ED9 PP-OCRv5 Mobile si\xEAu nh\u1EB9 t\u1ED1i \u01B0u ri\xEAng cho truy\u1EC7n ti\u1EBFng Anh/Latin, ch\u1EA1y full WebGPU t\u1ED1c \u0111\u1ED9 cao.",
      totalSizeMb: 12,
      files: {
        detUrl: `${PPU_ONNX_BASE}/detection/PP-OCRv5_mobile_det_infer.onnx`,
        recUrl: `${PPU_ONNX_BASE}/recognition/multi/en/v5/en_PP-OCRv5_mobile_rec_infer.onnx`,
        keysUrl: `${PPU_DICT_BASE}/recognition/multi/en/v5/ppocrv5_en_dict.txt`
      }
    }
  ];
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
      google_free: {
        type: "google_free",
        name: API_PRESETS.google_free.name,
        baseUrl: API_PRESETS.google_free.baseUrl,
        apiKey: "",
        model: API_PRESETS.google_free.defaultModel
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
    activeOcrModelId: "comic-manga-manhwa",
    rateLimitDelayMs: 1200,
    useWebGpu: true,
    rotateProviders: true,
    enableFreeFallback: true,
    glossary: "",
    translateSfx: false
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
        const merged = {
          ...DEFAULT_SETTINGS,
          ...saved,
          providers: {
            ...DEFAULT_SETTINGS.providers,
            ...saved.providers || {}
          }
        };
        if (!OCR_MODEL_PRESETS.some((p) => p.id === merged.activeOcrModelId)) {
          merged.activeOcrModelId = DEFAULT_SETTINGS.activeOcrModelId;
        }
        return merged;
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
    static dots(size = 15, color = "#FFFFFF") {
      return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/>
        <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/>
        <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/>
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

  // src/content/hud/hud-menu.ts
  var import_webextension_polyfill2 = __toESM(require_browser_polyfill(), 1);
  var HudMenu = class {
    constructor(callbacks) {
      this.callbacks = callbacks;
    }
    panel = null;
    escHandler = null;
    get isOpen() {
      return this.panel !== null;
    }
    toggle(anchor) {
      if (this.isOpen) this.close();
      else this.open(anchor);
    }
    open(anchor) {
      this.close();
      const rect = anchor.getBoundingClientRect();
      const panel = document.createElement("div");
      panel.id = "speedyslate-floating-menu";
      Object.assign(panel.style, {
        position: "fixed",
        right: `${Math.max(8, window.innerWidth - rect.right)}px`,
        bottom: `${window.innerHeight - rect.top + 8}px`,
        zIndex: "2147483647",
        background: "#0D0D11",
        border: "1px solid #26262E",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.7), 0 0 14px rgba(229, 46, 61, 0.15)",
        width: "400px",
        maxWidth: "calc(100vw - 16px)",
        height: `${Math.max(200, Math.min(640, rect.top - 16))}px`,
        display: "flex",
        flexDirection: "column",
        userSelect: "none"
      });
      panel.appendChild(this.buildQuickActions());
      panel.appendChild(this.buildPopupFrame());
      this.panel = panel;
      document.body.appendChild(panel);
      this.escHandler = (e) => {
        if (e.key === "Escape") this.close();
      };
      document.addEventListener("keydown", this.escHandler, true);
    }
    buildQuickActions() {
      const wrap = document.createElement("div");
      Object.assign(wrap.style, { flexShrink: "0" });
      const itemVis = this.menuItem(
        ChubbyIcons.eye(15, "#E52E3D"),
        this.callbacks.isVisible() ? "\u1EA8n b\u1EA3n d\u1ECBch (Xem g\u1ED1c)" : "Hi\u1EC7n l\u1EA1i b\u1EA3n d\u1ECBch",
        false
      );
      itemVis.onclick = (e) => {
        e.stopPropagation();
        this.callbacks.onToggleVisibility();
        this.close();
      };
      const itemClear = this.menuItem(
        ChubbyIcons.broom(15, "#E52E3D"),
        "X\xF3a cache ch\u01B0\u01A1ng n\xE0y",
        true
      );
      itemClear.onclick = (e) => {
        e.stopPropagation();
        this.close();
        this.callbacks.onClearChapterCache();
      };
      const itemClearAll = this.menuItem(
        ChubbyIcons.trash(15, "#FF3B47"),
        "D\u1ECDn s\u1EA1ch to\xE0n b\u1ED9 cache",
        true
      );
      itemClearAll.onclick = (e) => {
        e.stopPropagation();
        this.close();
        this.callbacks.onClearAllCache?.();
      };
      wrap.appendChild(itemVis);
      if (this.callbacks.onStartScreenCrop) {
        const itemCrop = this.menuItem(
          ChubbyIcons.bolt(15, "#E52E3D"),
          "Khoanh v\xF9ng d\u1ECBch m\xE0n h\xECnh (Alt+Shift+X)",
          true
        );
        itemCrop.onclick = (e) => {
          e.stopPropagation();
          this.close();
          this.callbacks.onStartScreenCrop?.();
        };
        wrap.appendChild(itemCrop);
      }
      wrap.appendChild(itemClear);
      wrap.appendChild(itemClearAll);
      return wrap;
    }
    menuItem(icon, label, topBorder) {
      const item = document.createElement("div");
      item.className = "speedyslate-menu-item";
      if (topBorder) item.style.borderTop = "1px solid #26262E";
      item.innerHTML = `${icon}<span>${label}</span>`;
      return item;
    }
    buildPopupFrame() {
      const holder = document.createElement("div");
      Object.assign(holder.style, {
        flex: "1",
        minHeight: "0",
        borderTop: "1px solid #26262E",
        background: "#FFFFFF",
        overflow: "hidden"
      });
      const iframe = document.createElement("iframe");
      iframe.src = import_webextension_polyfill2.default.runtime.getURL("src/popup/popup.html");
      iframe.title = "SpeedySlate Settings";
      Object.assign(iframe.style, {
        width: "100%",
        height: "100%",
        border: "none",
        display: "block"
      });
      holder.appendChild(iframe);
      return holder;
    }
    contains(target) {
      return this.panel?.contains(target) ?? false;
    }
    close() {
      if (this.escHandler) {
        document.removeEventListener("keydown", this.escHandler, true);
        this.escHandler = null;
      }
      if (this.panel) {
        this.panel.remove();
        this.panel = null;
      }
    }
  };

  // src/content/hud/hud.ts
  var FloatingHud = class {
    container;
    btn;
    menuBtn;
    hudMenu;
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
      this.container = document.createElement("div");
      this.container.id = "speedyslate-hud";
      this.btn = document.createElement("button");
      this.btn.id = "speedyslate-floating-btn";
      this.btn.setAttribute("type", "button");
      this.menuBtn = document.createElement("button");
      this.menuBtn.id = "speedyslate-hud-menu-btn";
      this.menuBtn.setAttribute("type", "button");
      this.menuBtn.title = "M\u1EDF menu SpeedySlate";
      this.menuBtn.innerHTML = ChubbyIcons.dots(15, "#FFFFFF");
      this.container.appendChild(this.btn);
      this.container.appendChild(this.menuBtn);
      this.hudMenu = new HudMenu({
        isVisible: () => this.isVisible,
        onToggleVisibility: () => {
          this.isVisible = !this.isVisible;
          this.callbacks.onToggleVisibility(this.isVisible);
          this.render();
        },
        onClearChapterCache: () => {
          this.callbacks.onClearChapterCache();
          this.setState("idle");
        },
        onClearAllCache: () => {
          this.callbacks.onClearAllCache?.();
          this.setState("idle");
        },
        onStartScreenCrop: () => this.callbacks.onStartScreenCrop?.()
      });
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
      #speedyslate-hud {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 2147483647;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        user-select: none;
      }
      #speedyslate-floating-btn,
      #speedyslate-hud-menu-btn {
        background: #0D0D11;
        color: #FFFFFF;
        border: 1px solid #26262E;
        border-radius: 8px;
        height: 38px;
        font-family: 'Space Grotesk', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 11px;
        font-weight: 800;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        cursor: pointer;
        user-select: none;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.05);
        transition: border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
        outline: none;
        white-space: nowrap;
        padding: 0 10px;
      }
      #speedyslate-hud-menu-btn {
        width: 38px;
        padding: 0;
      }
      #speedyslate-floating-btn:hover,
      #speedyslate-hud-menu-btn:hover {
        border-color: #E52E3D;
        transform: translateY(-1px);
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.8), 0 0 16px rgba(229, 46, 61, 0.4);
      }
      #speedyslate-floating-btn:active,
      #speedyslate-hud-menu-btn:active {
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
    mountToBody() {
      const tryMount = () => {
        const root = document.body || document.documentElement;
        if (root && !document.getElementById("speedyslate-hud")) {
          root.appendChild(this.container);
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
      const onDragStart = (e) => {
        if (e.button !== 0) return;
        this.hasMoved = false;
        this.startX = e.clientX;
        this.startY = e.clientY;
        const rect = this.container.getBoundingClientRect();
        this.initialLeft = rect.left;
        this.initialTop = rect.top;
        const onMouseMove = (moveEvent) => {
          const dx = moveEvent.clientX - this.startX;
          const dy = moveEvent.clientY - this.startY;
          if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
            this.hasMoved = true;
            this.hudMenu.close();
          }
          if (this.hasMoved) {
            this.container.style.bottom = "auto";
            this.container.style.right = "auto";
            this.container.style.left = `${this.initialLeft + dx}px`;
            this.container.style.top = `${this.initialTop + dy}px`;
          }
        };
        const onMouseUp = () => {
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
        };
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      };
      this.btn.addEventListener("mousedown", onDragStart);
      this.menuBtn.addEventListener("mousedown", onDragStart);
      this.btn.addEventListener("click", (e) => {
        if (this.hasMoved) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        this.hudMenu.close();
        this.handlePrimaryClick();
      });
      this.menuBtn.addEventListener("click", (e) => {
        if (this.hasMoved) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        e.stopPropagation();
        this.hudMenu.toggle(this.menuBtn);
      });
      this.btn.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.hudMenu.toggle(this.menuBtn);
      });
      this.menuBtn.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.hudMenu.toggle(this.menuBtn);
      });
      document.addEventListener("click", (e) => {
        if (this.hudMenu.isOpen && !this.hudMenu.contains(e.target) && e.target !== this.menuBtn && e.target !== this.btn && !this.menuBtn.contains(e.target) && !this.btn.contains(e.target)) {
          this.hudMenu.close();
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
      const rect = this.container.getBoundingClientRect();
      this.toast = document.createElement("div");
      Object.assign(this.toast.style, {
        position: "fixed",
        right: `${window.innerWidth - rect.right}px`,
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
    badge(text, opts = {}) {
      const border = opts.alert ? "#E52E3D" : "#4D1217";
      const bg = opts.alert ? "#1C0A0B" : "#140A0B";
      return `<span style="background: ${bg}; border: 1px solid ${border}; color: #FFA5AC; border-radius: 4px; padding: 1px 6px; font-size: 10px; font-weight: 700;">${text}</span>`;
    }
    render() {
      const count = `${this.translatedCount}/${this.totalCount}`;
      switch (this.state) {
        case "idle": {
          const badge = this.totalCount > 0 ? this.badge(`${this.totalCount}`) : "";
          this.btn.innerHTML = `${ChubbyIcons.bolt(15, "#E52E3D")}${badge}`;
          this.btn.style.background = "#0D0D11";
          this.btn.style.borderColor = "#26262E";
          this.btn.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.7)";
          this.btn.title = "B\u1EA5m \u0111\u1EC3 b\u1EAFt \u0111\u1EA7u d\u1ECBch truy\u1EC7n";
          break;
        }
        case "error": {
          const badge = this.totalCount > 0 ? this.badge(count, { alert: true }) : "";
          this.btn.innerHTML = `${ChubbyIcons.alert(15, "#FF3B47")}${badge}`;
          this.btn.style.background = "#180D0E";
          this.btn.style.borderColor = "#FF3B47";
          this.btn.style.boxShadow = "0 6px 24px rgba(0, 0, 0, 0.8), 0 0 18px rgba(255, 59, 71, 0.35)";
          this.btn.title = "C\xF3 l\u1ED7i x\u1EA3y ra khi d\u1ECBch \u2022 B\u1EA5m \u0111\u1EC3 th\u1EED l\u1EA1i";
          break;
        }
        case "translating": {
          const badge = this.totalCount > 0 ? this.badge(count, { alert: true }) : '<span style="color: #E52E3D; font-size: 10px;">...</span>';
          this.btn.innerHTML = `${ChubbyIcons.spinner(15, "#E52E3D")}${badge}`;
          this.btn.style.background = "#0D0D11";
          this.btn.style.borderColor = "#E52E3D";
          this.btn.style.boxShadow = "0 6px 24px rgba(0, 0, 0, 0.8), 0 0 18px rgba(229, 46, 61, 0.45)";
          this.btn.title = "\u0110ang d\u1ECBch truy\u1EC7n... B\u1EA5m \u0111\u1EC3 t\u1EA1m d\u1EEBng";
          break;
        }
        case "paused": {
          const badge = this.totalCount > 0 ? `<span style="background: #181820; border: 1px solid #33333E; color: #FFFFFF; border-radius: 4px; padding: 1px 6px; font-size: 10px; font-weight: 700;">${count}</span>` : "";
          this.btn.innerHTML = `${ChubbyIcons.play(14, "#FFFFFF")}${badge}`;
          this.btn.style.background = "#0D0D11";
          this.btn.style.borderColor = "#26262E";
          this.btn.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.7)";
          this.btn.title = "\u0110ang t\u1EA1m d\u1EEBng \u2022 B\u1EA5m \u0111\u1EC3 ti\u1EBFp t\u1EE5c d\u1ECBch";
          break;
        }
        case "completed": {
          this.btn.style.background = "#0D0D11";
          this.btn.style.borderColor = "#26262E";
          this.btn.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.7)";
          if (this.isVisible) {
            const badge = this.totalCount > 0 ? this.badge(`${this.totalCount}`) : "";
            this.btn.innerHTML = `${ChubbyIcons.checkCircle(15, "#E52E3D")}${badge}`;
            this.btn.title = "\u0110\xE3 d\u1ECBch xong \u2022 B\u1EA5m \u0111\u1EC3 \u1EA9n b\u1EA3n d\u1ECBch (xem tranh g\u1ED1c)";
          } else {
            this.btn.innerHTML = `${ChubbyIcons.eye(15, "#FFFFFF")}`;
            this.btn.title = "\u0110ang xem \u1EA3nh g\u1ED1c \u2022 B\u1EA5m \u0111\u1EC3 hi\u1EC7n l\u1EA1i b\u1EA3n d\u1ECBch";
          }
          break;
        }
      }
    }
    destroy() {
      this.hudMenu.close();
      this.container?.remove();
      this.toast?.remove();
      const styleEl = document.getElementById("speedyslate-hud-styles");
      if (styleEl) styleEl.remove();
    }
  };

  // src/content/overlay/text-auto-fitter.ts
  var COMIC_FONT_STACK = "'SpeedySlateComic', 'Segoe UI', system-ui, -apple-system, Roboto, sans-serif";
  var TextAutoFitter = class {
    static measureCtx;
    static getDefaultMeasurer() {
      if (this.measureCtx === void 0) {
        try {
          if (typeof document !== "undefined") {
            const c = document.createElement("canvas");
            this.measureCtx = c.getContext("2d");
          } else {
            this.measureCtx = null;
          }
        } catch {
          this.measureCtx = null;
        }
      }
      const ctx = this.measureCtx;
      if (ctx) {
        return (text, fontPx) => {
          ctx.font = `600 ${fontPx}px ${COMIC_FONT_STACK}`;
          return ctx.measureText(text).width * 1.08;
        };
      }
      return (text, fontPx) => {
        let units = 0;
        for (const ch of text) {
          if (ch === " ") units += 0.32;
          else if (/[\u3000-\u9FFF\uAC00-\uD7AF]/.test(ch)) units += 1.02;
          else if (/\p{Lu}/u.test(ch)) units += 0.66;
          else units += 0.56;
        }
        return units * fontPx;
      };
    }
    static getLongestWordLength(text) {
      if (!text) return 0;
      const words = text.split(/\s+/);
      let maxLen = 0;
      for (const w of words) {
        const clean = w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
        if (clean.length > maxLen) maxLen = clean.length;
      }
      return maxLen;
    }
    static computeOptimalFontSize(boxWidthPx, boxHeightPx, text) {
      return this.fitDialogue(boxWidthPx, boxHeightPx, text).fontSize;
    }
    /**
     * Computes CSS font-size scaled to the actual rendered DOM width of the comic
     * image (`renderedWidth / naturalWidth`), deducting elliptical safe padding.
     */
    static computeScaledFontSize(naturalBoxWidthPx, naturalBoxHeightPx, text, opts) {
      const natW = opts?.naturalWidth && opts.naturalWidth > 0 ? opts.naturalWidth : 0;
      const renW = opts?.renderedWidth && opts.renderedWidth > 0 ? opts.renderedWidth : 0;
      const scale = natW > 0 && renW > 0 ? renW / natW : 1;
      const cssW = naturalBoxWidthPx * scale;
      const cssH = naturalBoxHeightPx * scale;
      const elliptical = Boolean(opts?.elliptical);
      const innerW = elliptical ? cssW * 0.8 : cssW - 12;
      const innerH = elliptical ? cssH * 0.88 : cssH - 6;
      return this.fitDialogue(innerW, innerH, text, {
        elliptical,
        measureWidth: opts?.measureWidth,
        minFontPx: 7.5,
        maxFontPx: 22
      }).fontSize;
    }
    static fitDialogue(boxWidthPx, boxHeightPx, text, opts) {
      const trimmed = text.replace(/\s+/g, " ").trim();
      if (!trimmed) return { fontSize: 12, lines: [] };
      const measure = opts?.measureWidth ?? this.getDefaultMeasurer();
      const elliptical = Boolean(opts?.elliptical);
      const words = trimmed.split(" ").filter((w) => w.length > 0);
      const availW = Math.max(16, boxWidthPx - 4);
      const availH = Math.max(14, boxHeightPx - 4);
      const lineHeightRatio = 1.26;
      const minFs = opts?.minFontPx ?? 9;
      const capFs = opts?.maxFontPx ?? 26;
      const maxFs = Math.min(capFs, Math.max(minFs, Math.floor(availH / 1.75)));
      for (let fs = maxFs; fs >= minFs; fs -= 0.5) {
        const lineH = fs * lineHeightRatio;
        const maxLines = Math.max(1, Math.floor((availH + 1) / lineH));
        if (!elliptical) {
          const lines = this.wrapGreedy(words, fs, () => availW, measure);
          if (lines && lines.length <= maxLines && lines.length * lineH <= availH + 1) {
            return { fontSize: Number(fs.toFixed(1)), lines };
          }
          continue;
        }
        for (let targetN = 1; targetN <= maxLines; targetN++) {
          const blockH = targetN * lineH;
          if (blockH > availH + 1) break;
          const startY = (availH - blockH) * 0.5;
          const chordAt = (lineIdx) => {
            if (lineIdx >= targetN) return 0;
            const cy = startY + (lineIdx + 0.5) * lineH;
            const normY = 2 * cy / availH - 1;
            const factor = Math.sqrt(Math.max(0.22, 1 - normY * normY * 0.75));
            return availW * Math.max(0.55, factor);
          };
          const lines = this.wrapGreedy(words, fs, chordAt, measure);
          if (lines && lines.length <= targetN) {
            return { fontSize: Number(fs.toFixed(1)), lines };
          }
        }
      }
      const fallbackLines = this.wrapGreedy(words, minFs, () => availW, measure, true) || [trimmed];
      return { fontSize: minFs, lines: fallbackLines };
    }
    static wrapGreedy(words, fs, maxWidthForLine, measure, allowOverflowWord = false) {
      const lines = [];
      let cur = "";
      for (const w of words) {
        const limit = maxWidthForLine(lines.length);
        if (limit <= 0) return null;
        if (!cur) {
          if (!allowOverflowWord && measure(w, fs) > limit) return null;
          cur = w;
          continue;
        }
        const candidate = `${cur} ${w}`;
        if (measure(candidate, fs) <= limit) {
          cur = candidate;
        } else {
          lines.push(cur);
          const nextLimit = maxWidthForLine(lines.length);
          if (nextLimit <= 0 || !allowOverflowWord && measure(w, fs) > nextLimit) {
            return null;
          }
          cur = w;
        }
      }
      if (cur) lines.push(cur);
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
      const rawAspect = item.box.height / Math.max(1, item.box.width);
      const needsChamberExpansion = Boolean(item.chamberBox) && (item.isVertical === true || rawAspect >= 1.4 || item.box.width < 65);
      if (item.normBox) {
        topPct = item.normBox.ymin / 10;
        leftPct = item.normBox.xmin / 10;
        widthPct = Math.max(1, (item.normBox.xmax - item.normBox.xmin) / 10);
        heightPct = Math.max(1, (item.normBox.ymax - item.normBox.ymin) / 10);
      } else if (needsChamberExpansion && item.chamberBox) {
        const insetX = item.chamberBox.width * 0.06;
        const insetY = item.chamberBox.height * 0.05;
        const safeX = item.chamberBox.x + insetX;
        const safeY = item.chamberBox.y + insetY;
        const safeW = Math.max(16, item.chamberBox.width - insetX * 2);
        const safeH = Math.max(16, item.chamberBox.height - insetY * 2);
        topPct = safeY / Math.max(1, naturalHeight) * 100;
        leftPct = safeX / Math.max(1, naturalWidth) * 100;
        widthPct = safeW / Math.max(1, naturalWidth) * 100;
        heightPct = Math.min(28, safeH / Math.max(1, naturalHeight) * 100);
        return {
          topPct: Math.max(0.5, topPct),
          leftPct: Math.max(0.5, leftPct),
          widthPct: Math.min(99 - leftPct, widthPct),
          heightPct,
          pixelWidth: widthPct / 100 * naturalWidth,
          pixelHeight: heightPct / 100 * naturalHeight,
          aspectRatio: safeH / Math.max(1, safeW)
        };
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
      const ellipseBoost = item.kind === "free" || item.kind === "sfx" ? 1 : 1.6;
      const padPixelX = (item.normBox ? 3 : 5) * ellipseBoost;
      const padPixelY = (item.normBox ? 3 : 4) * ellipseBoost;
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
  var OverlayStyler = class _OverlayStyler {
    /**
     * Resolves the erase/background colour for an item under the given theme.
     * 'auto' prefers the real sampled bgColor; falls back to the dark/light binary.
     */
    static resolveBackground(theme, isDark, bgColor) {
      if (theme === "light") return "#ffffff";
      if (theme === "dark") return "#111111";
      if (bgColor && /^#[0-9a-fA-F]{6}$/.test(bgColor)) return bgColor;
      return isDark ? "#111111" : "#ffffff";
    }
    /** Picks readable text colour for a given background hex. */
    static textColorFor(bgHex) {
      return _OverlayStyler.hexToLuma(bgHex) < 140 ? "#ffffff" : "#000000";
    }
    static hexToLuma(hex) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return 0.299 * r + 0.587 * g + 0.114 * b;
    }
    /**
     * Applies complete overlay styles anchored to the comic speech bubble dimensions.
     * `transparentBg` leaves erasure to per-line patches (art between lines stays visible).
     */
    static applyStyles(bubble, coords, fontSize, isDark, bgColor, transparentBg, kind) {
      const bg = transparentBg ? "transparent" : bgColor ?? (isDark ? "#111111" : "#ffffff");
      const textColor = _OverlayStyler.textColorFor(
        bgColor ?? (isDark ? "#111111" : "#ffffff")
      );
      const needsStrokeHalo = Boolean(transparentBg && (kind === "free" || kind === "sfx"));
      const haloColor = textColor === "#ffffff" ? "#111111" : "#ffffff";
      const isEllipse = kind !== "free" && kind !== "sfx";
      let borderRadius;
      if (kind === "free") {
        borderRadius = "8px";
      } else if (kind === "sfx") {
        borderRadius = "10px";
      } else {
        borderRadius = "50%";
      }
      Object.assign(bubble.style, {
        position: "absolute",
        top: `${coords.topPct}%`,
        left: `${coords.leftPct}%`,
        transform: "none",
        width: `${coords.widthPct}%`,
        maxWidth: `${coords.widthPct}%`,
        height: `${coords.heightPct}%`,
        maxHeight: `${coords.heightPct}%`,
        backgroundColor: bg,
        color: textColor,
        border: "none",
        outline: "none",
        boxShadow: "none",
        filter: "none",
        textShadow: needsStrokeHalo ? `0 1px 2px rgba(0,0,0,0.38)` : "none",
        webkitTextStroke: needsStrokeHalo ? `3px ${haloColor}` : "0px transparent",
        paintOrder: needsStrokeHalo ? "stroke fill" : "normal",
        borderRadius,
        boxSizing: "border-box",
        padding: isEllipse ? "5% 10%" : "3px 6px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontFamily: "'SpeedySlateComic', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
        fontWeight: "600",
        lineHeight: "1.24",
        letterSpacing: "-0.01em",
        fontSize: `${fontSize}px`,
        zIndex: "50",
        cursor: "default",
        transition: "opacity 0.15s ease-in-out",
        userSelect: "text",
        whiteSpace: "normal",
        wordBreak: "normal",
        overflowWrap: "break-word",
        hyphens: "none",
        overflow: "visible"
      });
      bubble.style.setProperty("text-wrap", "balance");
      bubble.style.setProperty("-webkit-text-wrap", "balance");
    }
  };

  // src/shared/erase-codec.ts
  var RLE_PREFIX = "rle1:";
  function b64ToU8(s) {
    const bin = atob(s);
    const u8 = new Uint8ClampedArray(bin.length);
    for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    return u8;
  }
  function decodePixelsRle(encoded) {
    const bytes = b64ToU8(encoded.slice(RLE_PREFIX.length));
    if (bytes.length < 4) return new Uint8ClampedArray(0);
    const pixelCount = (bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24) >>> 0;
    const out = new Uint8ClampedArray(pixelCount * 4);
    let pos = 4;
    let dst = 0;
    while (pos < bytes.length && dst < out.length) {
      const header = bytes[pos++];
      if (header >= 128) {
        const count = header - 128 + 2;
        const r = bytes[pos++] ?? 0;
        const g = bytes[pos++] ?? 0;
        const b = bytes[pos++] ?? 0;
        const a = bytes[pos++] ?? 0;
        for (let k = 0; k < count && dst < out.length; k++) {
          out[dst++] = r;
          out[dst++] = g;
          out[dst++] = b;
          out[dst++] = a;
        }
      } else {
        const count = header + 1;
        const byteLen = count * 4;
        const end = Math.min(bytes.length, pos + byteLen);
        while (pos < end && dst < out.length) {
          out[dst++] = bytes[pos++];
        }
      }
    }
    return out;
  }
  function decodePixels(pixels) {
    if (pixels instanceof Uint8ClampedArray) return pixels;
    if (typeof pixels === "string") {
      return pixels.startsWith(RLE_PREFIX) ? decodePixelsRle(pixels) : b64ToU8(pixels);
    }
    if (Array.isArray(pixels)) {
      return new Uint8ClampedArray(pixels);
    }
    if (pixels && typeof pixels === "object") {
      const vals = Object.values(pixels);
      if (vals.length && typeof vals[0] === "number") {
        return new Uint8ClampedArray(vals);
      }
    }
    return new Uint8ClampedArray(0);
  }

  // src/content/overlay/erase-patcher.ts
  var ErasePatcher = class {
    /**
     * Renders all dialogue erase patches on a single full-image canvas placed
     * under the translated text layer (zIndex 48).
     */
    static renderCleanCanvas(wrapper, dialogues, naturalWidth, naturalHeight) {
      const patches = [];
      for (const d of dialogues) {
        if (d.erasePatches && d.translatedText?.trim()) patches.push(...d.erasePatches);
      }
      if (patches.length === 0) return null;
      const canvas = document.createElement("canvas");
      canvas.className = "speedyslate-clean-canvas";
      canvas.width = naturalWidth;
      canvas.height = naturalHeight;
      Object.assign(canvas.style, {
        position: "absolute",
        left: "0",
        top: "0",
        width: "100%",
        height: "100%",
        zIndex: "48",
        pointerEvents: "none",
        transition: "opacity 0.15s ease-in-out"
      });
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      for (const p of patches) {
        const u8 = decodePixels(p.pixels);
        if (!p.width || !p.height || u8.length !== p.width * p.height * 4) continue;
        const tmp = document.createElement("canvas");
        tmp.width = p.width;
        tmp.height = p.height;
        const tctx = tmp.getContext("2d");
        if (!tctx) continue;
        tctx.putImageData(new ImageData(u8, p.width, p.height), 0, 0);
        ctx.drawImage(tmp, p.x, p.y);
      }
      wrapper.appendChild(canvas);
      return canvas;
    }
    /**
     * Legacy fallback for cached dialogues that carry lineBoxes but no pixel
     * patches: rounded-rect divs per line, below the text layer (zIndex 49).
     */
    static renderPatches(wrapper, lines, naturalWidth, naturalHeight, bgHex, forId) {
      const padPxX = 4;
      const padPxY = 4;
      const w = Math.max(1, naturalWidth);
      const h = Math.max(1, naturalHeight);
      for (const line of lines) {
        const left = (line.x - padPxX) / w * 100;
        const top = (line.y - padPxY) / h * 100;
        const width = (line.width + padPxX * 2) / w * 100;
        const height = (line.height + padPxY * 2) / h * 100;
        const patch = document.createElement("div");
        patch.className = "speedyslate-erase-patch";
        patch.dataset.for = forId;
        Object.assign(patch.style, {
          position: "absolute",
          left: `${Math.max(0, left)}%`,
          top: `${Math.max(0, top)}%`,
          width: `${width}%`,
          height: `${height}%`,
          backgroundColor: bgHex,
          borderRadius: "6px",
          zIndex: "49",
          pointerEvents: "none",
          transition: "opacity 0.15s ease-in-out"
        });
        wrapper.appendChild(patch);
      }
    }
  };

  // src/content/overlay/comic-font-loader.ts
  var STYLE_ID = "speedyslate-comic-font-face";
  var ComicFontLoader = class {
    static resolveAssetUrl(path, g = globalThis) {
      const getUrl = g?.browser?.runtime?.getURL ?? g?.chrome?.runtime?.getURL;
      if (typeof getUrl === "function") {
        try {
          return getUrl(path);
        } catch {
          return null;
        }
      }
      if (g?.location?.pathname?.includes("/test-harness/")) {
        return `/public/${path}`;
      }
      return null;
    }
    static ensureLoaded() {
      if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
      try {
        const viUrl = this.resolveAssetUrl("fonts/PatrickHand-vi.woff2");
        const extUrl = this.resolveAssetUrl("fonts/PatrickHand-latin-ext.woff2");
        const latUrl = this.resolveAssetUrl("fonts/PatrickHand-latin.woff2");
        if (!viUrl || !extUrl || !latUrl) return;
        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = `
        @font-face {
          font-family: 'SpeedySlateComic';
          font-style: normal;
          font-weight: 400 700;
          font-display: swap;
          src: url('${viUrl}') format('woff2');
          unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
        }
        @font-face {
          font-family: 'SpeedySlateComic';
          font-style: normal;
          font-weight: 400 700;
          font-display: swap;
          src: url('${extUrl}') format('woff2');
          unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;
        }
        @font-face {
          font-family: 'SpeedySlateComic';
          font-style: normal;
          font-weight: 400 700;
          font-display: swap;
          src: url('${latUrl}') format('woff2');
          unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
        }
      `;
        (document.head || document.documentElement)?.appendChild(style);
      } catch {
      }
    }
  };

  // src/content/overlay/overlay-renderer.ts
  var resizeObservers = /* @__PURE__ */ new WeakMap();
  var OverlayRenderer = class _OverlayRenderer {
    static renderDialogues(wrapper, dialogues, naturalWidth, naturalHeight, theme = "auto") {
      ComicFontLoader.ensureLoaded();
      const existing = wrapper.querySelectorAll(
        ".speedyslate-bubble, .speedyslate-erase-patch, .speedyslate-clean-canvas"
      );
      existing.forEach((el) => el.remove());
      const cleanCanvas = ErasePatcher.renderCleanCanvas(
        wrapper,
        dialogues,
        naturalWidth,
        naturalHeight
      );
      const renderedW = _OverlayRenderer.measureRenderedWidth(wrapper, naturalWidth);
      for (const item of dialogues) {
        const cleanTranslated = (item.translatedText || "").replace(/\s+/g, " ").trim();
        if (!cleanTranslated) continue;
        const coords = BubbleGeometry.computeCoordinates(item, naturalWidth, naturalHeight);
        const useEllipse = item.isOvalChamber ?? (item.kind === void 0 || item.kind === "dialogue");
        const fontSize = TextAutoFitter.computeScaledFontSize(
          coords.pixelWidth,
          coords.pixelHeight,
          cleanTranslated,
          {
            naturalWidth,
            renderedWidth: renderedW,
            elliptical: useEllipse
          }
        );
        const isDark = theme === "dark" || theme === "auto" && item.isDarkBackground;
        const sampledBg = theme === "auto" && item.bgColor && /^#[0-9a-fA-F]{6}$/.test(item.bgColor) ? item.bgColor : void 0;
        const eraseBg = OverlayStyler.resolveBackground(theme, !!isDark, item.bgColor);
        const hasPixelPatch = (item.erasePatches?.length ?? 0) > 0;
        const useLineErase = !hasPixelPatch && item.kind !== void 0 && !item.normBox && item.lineBoxes !== void 0 && item.lineBoxes.length > 0;
        if (useLineErase) {
          ErasePatcher.renderPatches(
            wrapper,
            item.lineBoxes,
            naturalWidth,
            naturalHeight,
            eraseBg,
            item.id
          );
        }
        const bubble = document.createElement("div");
        bubble.className = "speedyslate-bubble";
        bubble.id = item.id;
        bubble.dataset.natBoxW = String(coords.pixelWidth);
        bubble.dataset.natBoxH = String(coords.pixelHeight);
        bubble.dataset.natImgW = String(naturalWidth);
        bubble.dataset.ellipse = useEllipse ? "1" : "0";
        if (item.originalText) {
          bubble.title = item.originalText;
        }
        const transparentBg = hasPixelPatch || useLineErase;
        OverlayStyler.applyStyles(
          bubble,
          coords,
          fontSize,
          !!isDark,
          sampledBg,
          transparentBg,
          item.kind
        );
        bubble.textContent = cleanTranslated;
        bubble.addEventListener("mouseenter", (e) => {
          if (e.altKey) {
            bubble.style.opacity = "0.12";
            if (cleanCanvas) cleanCanvas.style.opacity = "0.12";
            wrapper.querySelectorAll(`.speedyslate-erase-patch[data-for="${item.id}"]`).forEach((p) => p.style.opacity = "0.12");
          }
        });
        bubble.addEventListener("mouseleave", () => {
          bubble.style.opacity = "1";
          if (cleanCanvas) cleanCanvas.style.opacity = "1";
          wrapper.querySelectorAll(`.speedyslate-erase-patch[data-for="${item.id}"]`).forEach((p) => p.style.opacity = "1");
        });
        wrapper.appendChild(bubble);
      }
      _OverlayRenderer.clampMountedBubbles(wrapper);
      if (typeof document !== "undefined" && document.fonts?.ready) {
        document.fonts.ready.then(() => _OverlayRenderer.refitWrapperBubbles(wrapper)).catch(() => {
        });
      }
      _OverlayRenderer.attachResizeRefitter(wrapper);
    }
    static measureRenderedWidth(wrapper, fallbackW) {
      if (!wrapper) return fallbackW;
      const cw = wrapper.clientWidth || wrapper.getBoundingClientRect?.()?.width || 0;
      if (cw > 20) return cw;
      const img = wrapper.querySelector?.("img");
      const iw = img?.clientWidth || img?.getBoundingClientRect?.()?.width || 0;
      return iw > 20 ? iw : fallbackW;
    }
    static refitWrapperBubbles(wrapper) {
      const bubbles = wrapper.querySelectorAll(".speedyslate-bubble");
      if (bubbles.length === 0) return;
      const firstImgW = Number(bubbles[0].dataset.natImgW) || 800;
      const renderedW = _OverlayRenderer.measureRenderedWidth(wrapper, firstImgW);
      bubbles.forEach((bubble) => {
        const natBoxW = Number(bubble.dataset.natBoxW) || 100;
        const natBoxH = Number(bubble.dataset.natBoxH) || 60;
        const natImgW = Number(bubble.dataset.natImgW) || firstImgW;
        const elliptical = bubble.dataset.ellipse === "1";
        const fs = TextAutoFitter.computeScaledFontSize(natBoxW, natBoxH, bubble.textContent || "", {
          naturalWidth: natImgW,
          renderedWidth: renderedW,
          elliptical
        });
        bubble.style.fontSize = `${fs}px`;
      });
      _OverlayRenderer.clampMountedBubbles(wrapper);
    }
    /**
     * Shrinks any mounted bubble whose rendered scrollHeight or scrollWidth
     * exceeds its bounded speech-bubble client box down to a 6.5px floor.
     */
    static clampMountedBubbles(wrapper) {
      const bubbles = wrapper.querySelectorAll(".speedyslate-bubble");
      bubbles.forEach((b) => {
        if (b.clientHeight < 8 || b.clientWidth < 8) return;
        let fs = parseFloat(b.style.fontSize) || 12;
        let guard = 0;
        while (guard < 24 && fs > 6.5 && (b.scrollHeight > b.clientHeight + 2 || b.scrollWidth > b.clientWidth + 2)) {
          fs = Math.max(6.5, Number((fs - 0.5).toFixed(1)));
          b.style.fontSize = `${fs}px`;
          guard++;
        }
      });
    }
    static attachResizeRefitter(wrapper) {
      if (typeof ResizeObserver === "undefined" || resizeObservers.has(wrapper)) return;
      let lastW = Math.round(wrapper.clientWidth || 0);
      const ro = new ResizeObserver(() => {
        const nextW = Math.round(wrapper.clientWidth || 0);
        if (nextW > 20 && Math.abs(nextW - lastW) >= 4) {
          lastW = nextW;
          _OverlayRenderer.refitWrapperBubbles(wrapper);
        }
      });
      ro.observe(wrapper);
      resizeObservers.set(wrapper, ro);
    }
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

  // src/content/media-target.ts
  var LAZY_ATTRS = [
    "data-src",
    "data-original",
    "data-lazy-src",
    "data-actual-src",
    "data-url",
    "data-origin",
    "data-full-image",
    "data-real-src"
  ];
  var MediaTargetResolver = class {
    static parseBestSrcsetUrl(srcset) {
      if (!srcset || !srcset.trim()) return null;
      let bestUrl = null;
      let bestScore = -1;
      for (const part of srcset.split(",")) {
        const tokens = part.trim().split(/\s+/).filter(Boolean);
        if (tokens.length === 0) continue;
        const url = tokens[0];
        if (!url || url.startsWith("data:image/svg")) continue;
        let score = 1;
        const desc = tokens[1] || "";
        const wMatch = desc.match(/^(\d+(?:\.\d+)?)w$/i);
        const xMatch = desc.match(/^(\d+(?:\.\d+)?)x$/i);
        if (wMatch) score = Number(wMatch[1]);
        else if (xMatch) score = Number(xMatch[1]) * 1e3;
        if (score >= bestScore) {
          bestScore = score;
          bestUrl = url;
        }
      }
      return bestUrl;
    }
    static parseCssBackgroundUrl(bgValue) {
      if (!bgValue || bgValue === "none") return null;
      const m = bgValue.match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/i);
      if (!m?.[1] || m[1].startsWith("data:image/svg")) return null;
      return m[1].trim();
    }
    static extractBestImageUrl(el) {
      if (el.tagName === "IMG") {
        const img = el;
        for (const attr of LAZY_ATTRS) {
          const val = img.getAttribute(attr);
          if (val && !val.startsWith("data:image/svg")) return val.trim();
        }
        const picSource = img.parentElement?.tagName === "PICTURE" ? img.parentElement.querySelector("source[srcset]") : null;
        if (picSource) {
          const fromPic = this.parseBestSrcsetUrl(picSource.getAttribute("srcset") || "");
          if (fromPic) return fromPic;
        }
        const fromSrcset = this.parseBestSrcsetUrl(img.getAttribute("srcset") || img.srcset || "");
        if (fromSrcset) return fromSrcset;
        const direct = img.currentSrc || img.src || "";
        return direct && !direct.startsWith("data:image/svg") ? direct : null;
      }
      const inlineBg = this.parseCssBackgroundUrl(el.style?.backgroundImage || "");
      if (inlineBg) return inlineBg;
      if (typeof window !== "undefined" && window.getComputedStyle) {
        return this.parseCssBackgroundUrl(window.getComputedStyle(el).backgroundImage || "");
      }
      return null;
    }
    static promoteLazyAndSrcset(img) {
      const best = this.extractBestImageUrl(img);
      if (best && !best.startsWith("data:") && img.src !== best) {
        img.src = best;
      }
      img.loading = "eager";
      img.decoding = "async";
      for (const attr of LAZY_ATTRS) {
        img.removeAttribute(attr);
      }
      img.classList.remove("lazy", "lazyload", "loading");
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
      const bestUrl = MediaTargetResolver.extractBestImageUrl(img) || "";
      const src = bestUrl.toLowerCase();
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
      return Boolean(bestUrl);
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
      MediaTargetResolver.promoteLazyAndSrcset(img);
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
  var import_webextension_polyfill3 = __toESM(require_browser_polyfill(), 1);
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
        const data = await import_webextension_polyfill3.default.storage.local.get(STORAGE_KEY);
        const stored = Array.isArray(data[STORAGE_KEY]) ? data[STORAGE_KEY] : [];
        const updated = [...stored, entry];
        if (updated.length > MAX_LOGS) {
          updated.splice(0, updated.length - MAX_LOGS);
        }
        await import_webextension_polyfill3.default.storage.local.set({ [STORAGE_KEY]: updated });
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
        const res = await import_webextension_polyfill3.default.storage.local.get(STORAGE_KEY);
        return res[STORAGE_KEY] || this.memoryLogs;
      } catch {
        return this.memoryLogs;
      }
    }
    static async clearLogs() {
      this.memoryLogs = [];
      try {
        await import_webextension_polyfill3.default.storage.local.remove(STORAGE_KEY);
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
  var import_webextension_polyfill4 = __toESM(require_browser_polyfill(), 1);
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
          const resp = await import_webextension_polyfill4.default.runtime.sendMessage(message);
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
              await import_webextension_polyfill4.default.runtime.sendMessage({ action: "PING" });
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
  function resolveOverlayDimensions(ocrWidth, ocrHeight, fallbackWidth, fallbackHeight) {
    return {
      width: ocrWidth && ocrWidth > 0 ? ocrWidth : fallbackWidth || 800,
      height: ocrHeight && ocrHeight > 0 ? ocrHeight : fallbackHeight || 1200
    };
  }
  var ImageCompressor = class {
    /**
     * Captures lossless PNG pixels for local Hybrid OCR without JPEG 8x8 ringing.
     * Only scales down proportionally when naturalWidth exceeds maxWidth (default 2200px).
     */
    static captureForOcr(img, maxWidth = 2200) {
      const naturalWidth = img.naturalWidth || img.width || 800;
      const naturalHeight = img.naturalHeight || img.height || 1200;
      let targetWidth = naturalWidth;
      let targetHeight = naturalHeight;
      if (naturalWidth > maxWidth) {
        const scale = maxWidth / naturalWidth;
        targetWidth = maxWidth;
        targetHeight = Math.round(naturalHeight * scale);
      }
      try {
        if (typeof document !== "undefined") {
          const canvas = document.createElement("canvas");
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
            return {
              dataUrl: canvas.toDataURL("image/png"),
              naturalWidth,
              naturalHeight,
              compressedWidth: targetWidth,
              compressedHeight: targetHeight
            };
          }
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
        if (isVision) {
          this.ctx.hud.log(
            `Trang #${task.index + 1}${totalKeys > 1 ? ` (Key #${estimatedKey}/${totalKeys})` : ""}: Vision AI \u0111ang nh\u1EADn di\u1EC7n v\xE0 d\u1ECBch...`
          );
        }
        const captured = isVision ? ImageCompressor.compressForVision(img, 1280, 0.78) : ImageCompressor.captureForOcr(img, 2200);
        const resp = await SafeMessenger.send({
          action: "OCR_IMAGE",
          imageUrl,
          chapterUrl: window.location.href,
          dataUrl: captured.dataUrl,
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
              const { width: renderW, height: renderH } = resolveOverlayDimensions(
                resp.naturalWidth,
                resp.naturalHeight,
                img.naturalWidth || captured.compressedWidth,
                img.naturalHeight || captured.compressedHeight
              );
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
              this.ctx.hud.log(
                resp.cached ? `Trang #${task.index + 1}: N\u1EA1p t\u1EEB Cache (0ms)` : `Trang #${task.index + 1}${finalTotal > 1 ? ` (Key #${finalKey}/${finalTotal})` : ""}: Vision AI \u0111\xE3 d\u1ECBch ${resp.dialogues.length} c\xE2u tho\u1EA1i`
              );
            } else {
              img.dataset.slateStatus = "no_text";
              this.ctx.hud.log(`Trang #${task.index + 1}: Kh\xF4ng c\xF3 ch\u1EEF tho\u1EA1i`);
            }
            this.ctx.markImageCompleted(img);
          } else if (!resp.dialogues || resp.dialogues.length === 0) {
            img.dataset.slateStatus = "no_text";
            this.ctx.markImageCompleted(img);
            this.ctx.hud.log(`Trang #${task.index + 1}: Kh\xF4ng c\xF3 ch\u1EEF`);
          } else {
            img.dataset.slateStatus = "ocr_done";
            this.ctx.hud.log(`Trang #${task.index + 1}: \u0110\xE3 qu\xE9t ${resp.dialogues.length} c\xE2u tho\u1EA1i, \u0111ang ch\u1EDD d\u1ECBch...`);
            this.ctx.translationQueue.enqueue({
              index: task.index,
              img: task.img,
              dialogues: resp.dialogues,
              naturalWidth: resp.naturalWidth || captured.compressedWidth,
              naturalHeight: resp.naturalHeight || captured.compressedHeight
            });
          }
        } else {
          img.dataset.slateStatus = "error";
          const errMsg = resp?.error || "L\u1ED7i nh\u1EADn di\u1EC7n OCR";
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
          const { width: renderW, height: renderH } = resolveOverlayDimensions(
            task.naturalWidth,
            task.naturalHeight,
            img.naturalWidth,
            img.naturalHeight
          );
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
          this.ctx.markImageCompleted(img);
          this.ctx.hud.log(
            `Trang #${task.index + 1}${finalTotal > 1 ? ` (Key #${finalKey}/${finalTotal})` : ""}: Ho\xE0n t\u1EA5t ${resp.dialogues.length} c\xE2u tho\u1EA1i`
          );
        } else {
          img.dataset.slateStatus = "error";
          const errMsg = resp?.error || "L\u1ED7i API d\u1ECBch";
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
              const { width: renderW, height: renderH } = resolveOverlayDimensions(
                cached.naturalWidth,
                cached.naturalHeight,
                img.naturalWidth || 800,
                img.naturalHeight || 1200
              );
              OverlayRenderer.renderDialogues(
                wrapper,
                cached.dialogues,
                renderW,
                renderH,
                bubbleTheme
              );
              img.dataset.slateStatus = "translated";
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

  // src/content/spa-shield.ts
  var SpaOverlayShield = class {
    constructor(onRecycledImage) {
      this.onRecycledImage = onRecycledImage;
    }
    observers = /* @__PURE__ */ new WeakMap();
    trackedUrls = /* @__PURE__ */ new WeakMap();
    watch(img) {
      if (this.observers.has(img)) return;
      const initial = MediaTargetResolver.extractBestImageUrl(img) || img.src || "";
      this.trackedUrls.set(img, initial);
      const observer = new MutationObserver(() => {
        const nextUrl = MediaTargetResolver.extractBestImageUrl(img) || img.src || "";
        if (!nextUrl || nextUrl.startsWith("data:image/svg")) return;
        const prevUrl = this.trackedUrls.get(img) || "";
        if (prevUrl && nextUrl !== prevUrl) {
          this.trackedUrls.set(img, nextUrl);
          const wrapper = img.parentElement;
          if (wrapper?.classList.contains("speedyslate-wrapper")) {
            wrapper.querySelectorAll(".speedyslate-bubble, .speedyslate-erase-patch, .speedyslate-clean-canvas").forEach((el) => el.remove());
          }
          delete img.dataset.slateStatus;
          this.onRecycledImage(img);
        } else if (!prevUrl) {
          this.trackedUrls.set(img, nextUrl);
        }
      });
      observer.observe(img, {
        attributes: true,
        attributeFilter: ["src", "srcset", "data-src", "data-original", "data-lazy-src"]
      });
      this.observers.set(img, observer);
    }
  };

  // src/content/chapter-scanner.ts
  var ChapterScanner = class {
    constructor(hooks) {
      this.hooks = hooks;
      this.spaShield = new SpaOverlayShield((img) => {
        this.hooks.completedImages.delete(img);
        const idx = this.hooks.images.indexOf(img);
        if (idx !== -1) {
          this.hooks.onImageRecycled?.(idx, img);
        }
      });
    }
    mutationObserver = null;
    intersectionObserver = null;
    observeInterval = null;
    spaShield;
    isDetecting = false;
    start() {
      this.detectImages();
      this.setupMutationObserver();
      this.setupIntersectionObserver();
    }
    stop() {
      if (this.mutationObserver) {
        this.mutationObserver.disconnect();
        this.mutationObserver = null;
      }
      if (this.intersectionObserver) {
        this.intersectionObserver.disconnect();
        this.intersectionObserver = null;
      }
      if (this.observeInterval) {
        clearInterval(this.observeInterval);
        this.observeInterval = null;
      }
    }
    detectImages() {
      if (this.isDetecting) return;
      this.isDetecting = true;
      try {
        const rawImages = ToonheyAdapter.getChapterImages();
        let newFound = 0;
        for (const img of rawImages) {
          if (!this.hooks.images.includes(img)) {
            ToonheyAdapter.wrapImage(img);
            this.spaShield.watch(img);
            this.hooks.images.push(img);
            newFound++;
          }
        }
        if (newFound > 0) {
          this.hooks.images.sort(
            (a, b) => a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
          );
          this.hooks.onNewImagesDetected(this.hooks.images.length);
        }
      } finally {
        this.isDetecting = false;
      }
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
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const img = entry.target;
            const index = this.hooks.images.indexOf(img);
            if (index !== -1 && !this.hooks.completedImages.has(img) && !img.dataset.slateStatus && this.hooks.isTranslating()) {
              this.hooks.onImageVisible(index, img);
            }
          }
        },
        { root: null, rootMargin: "0px 0px 800px 0px", threshold: 0.01 }
      );
      this.observeInterval = setInterval(() => {
        this.hooks.images.forEach((img) => this.intersectionObserver?.observe(img));
      }, 2e3);
    }
  };

  // src/content/screen-crop.ts
  function isScreenCropShortcut(e) {
    const tgt = e.target;
    const tag = (tgt?.tagName || "").toUpperCase();
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || tgt?.isContentEditable) {
      return false;
    }
    return e.shiftKey && (e.altKey || e.ctrlKey) && e.code === "KeyX";
  }
  function scaleViewportCropToBitmap(rect, dpr, maxW, maxH) {
    const scale = dpr > 0 ? dpr : 1;
    const sx = Math.max(0, Math.min(maxW - 1, Math.round(rect.x * scale)));
    const sy = Math.max(0, Math.min(maxH - 1, Math.round(rect.y * scale)));
    const sw = Math.max(1, Math.min(maxW - sx, Math.round(rect.width * scale)));
    const sh = Math.max(1, Math.min(maxH - sy, Math.round(rect.height * scale)));
    return { sx, sy, sw, sh };
  }
  var ScreenCropOverlay = class {
    constructor(getTheme, onLog) {
      this.getTheme = getTheme;
      this.onLog = onLog;
    }
    activeMask = null;
    startSelection() {
      if (this.activeMask || typeof document === "undefined") return;
      const mask = document.createElement("div");
      Object.assign(mask.style, {
        position: "fixed",
        inset: "0",
        zIndex: "2147483646",
        cursor: "crosshair",
        background: "rgba(0, 0, 0, 0.25)",
        userSelect: "none"
      });
      const box = document.createElement("div");
      Object.assign(box.style, {
        position: "fixed",
        border: "2px dashed #E52E3D",
        background: "rgba(229, 46, 61, 0.12)",
        display: "none",
        pointerEvents: "none"
      });
      mask.appendChild(box);
      document.body.appendChild(mask);
      this.activeMask = mask;
      let startX = 0;
      let startY = 0;
      let dragging = false;
      const cleanup = () => {
        window.removeEventListener("keydown", onKey, true);
        mask.remove();
        this.activeMask = null;
      };
      const onKey = (ke) => {
        if (ke.key === "Escape") cleanup();
      };
      window.addEventListener("keydown", onKey, true);
      mask.addEventListener("mousedown", (e) => {
        dragging = true;
        startX = e.clientX;
        startY = e.clientY;
        Object.assign(box.style, {
          display: "block",
          left: `${startX}px`,
          top: `${startY}px`,
          width: "0px",
          height: "0px"
        });
      });
      mask.addEventListener("mousemove", (e) => {
        if (!dragging) return;
        const x = Math.min(startX, e.clientX);
        const y = Math.min(startY, e.clientY);
        const w = Math.abs(e.clientX - startX);
        const h = Math.abs(e.clientY - startY);
        Object.assign(box.style, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px` });
      });
      mask.addEventListener("mouseup", async (e) => {
        if (!dragging) return;
        dragging = false;
        const rect = {
          x: Math.min(startX, e.clientX),
          y: Math.min(startY, e.clientY),
          width: Math.abs(e.clientX - startX),
          height: Math.abs(e.clientY - startY)
        };
        cleanup();
        if (rect.width < 24 || rect.height < 24) return;
        await this.captureAndTranslate(rect);
      });
    }
    async captureAndTranslate(rect) {
      this.onLog?.("\u0110ang ch\u1EE5p v\xF9ng ch\u1ECDn v\xE0 nh\u1EADn di\u1EC7n tho\u1EA1i...");
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      const cap = await SafeMessenger.send({ action: "CAPTURE_VISIBLE_TAB" });
      if (!cap?.success || !cap.dataUrl) {
        this.onLog?.(cap?.error || "Kh\xF4ng th\u1EC3 ch\u1EE5p v\xF9ng m\xE0n h\xECnh", true);
        return;
      }
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Kh\xF4ng th\u1EC3 \u0111\u1ECDc \u1EA3nh ch\u1EE5p m\xE0n h\xECnh"));
        img.src = cap.dataUrl;
      });
      const { sx, sy, sw, sh } = scaleViewportCropToBitmap(
        rect,
        window.devicePixelRatio || 1,
        img.naturalWidth,
        img.naturalHeight
      );
      const canvas = document.createElement("canvas");
      canvas.width = sw;
      canvas.height = sh;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      const cropDataUrl = canvas.toDataURL("image/png");
      const resp = await SafeMessenger.send({
        action: "TRANSLATE_IMAGE",
        dataUrl: cropDataUrl,
        chapterUrl: window.location.href
      });
      if (!resp?.success || !Array.isArray(resp.dialogues) || resp.dialogues.length === 0) {
        this.onLog?.(resp?.error || "Kh\xF4ng t\xECm th\u1EA5y ch\u1EEF tho\u1EA1i trong v\xF9ng \u0111\xE3 ch\u1ECDn", !resp?.success);
        return;
      }
      const holder = document.createElement("div");
      holder.className = "speedyslate-crop-result";
      Object.assign(holder.style, {
        position: "absolute",
        left: `${window.scrollX + rect.x}px`,
        top: `${window.scrollY + rect.y}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        zIndex: "2147483640",
        outline: "1px solid rgba(229, 46, 61, 0.55)",
        borderRadius: "4px"
      });
      const closeBtn = document.createElement("button");
      closeBtn.textContent = "\xD7";
      closeBtn.title = "\u0110\xF3ng v\xF9ng d\u1ECBch";
      Object.assign(closeBtn.style, {
        position: "absolute",
        top: "-12px",
        right: "-12px",
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        border: "none",
        background: "#111111",
        color: "#FFFFFF",
        cursor: "pointer",
        zIndex: "60",
        fontWeight: "bold",
        lineHeight: "24px"
      });
      closeBtn.onclick = () => holder.remove();
      document.body.appendChild(holder);
      OverlayRenderer.renderDialogues(
        holder,
        resp.dialogues,
        resp.naturalWidth || sw,
        resp.naturalHeight || sh,
        this.getTheme()
      );
      holder.appendChild(closeBtn);
      this.onLog?.(`\u0110\xE3 d\u1ECBch ${resp.dialogues.length} c\xE2u tho\u1EA1i trong v\xF9ng ch\u1ECDn`);
    }
  };

  // src/content/index.ts
  var SpeedySlateContentApp = class {
    settings;
    hud = null;
    ocrQueue;
    translationQueue;
    taskProcessor;
    scanner;
    screenCrop;
    cropKeyListener = null;
    images = [];
    completedImages = /* @__PURE__ */ new Set();
    isModelReady = false;
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
      import_webextension_polyfill5.default.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
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
        },
        onStartScreenCrop: () => this.screenCrop?.startSelection()
      });
    }
    async start() {
      if (this.isStarted) return;
      this.isStarted = true;
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
      this.scanner = new ChapterScanner({
        images: this.images,
        completedImages: this.completedImages,
        isTranslating: () => this.hud?.getState() === "translating",
        onNewImagesDetected: (totalCount) => {
          this.hud?.updateStatus(this.completedImages.size, totalCount);
          this.hud?.log(`Da phat hien ${totalCount} trang truyen`);
          if (this.hud?.getState() === "translating") {
            this.enqueueAllImages();
          } else {
            this.restoreCachedTranslations();
          }
        },
        onImageVisible: (index, img) => this.ocrQueue.enqueue({ index, img }),
        onImageRecycled: (index, img) => {
          this.hud?.updateStatus(this.completedImages.size, this.images.length);
          if (this.hud?.getState() === "translating") {
            this.ocrQueue.enqueue({ index, img });
          } else {
            this.restoreCachedTranslations();
          }
        }
      });
      this.scanner.start();
      this.screenCrop = new ScreenCropOverlay(
        () => this.settings?.bubbleTheme || "auto",
        (msg, isErr) => this.hud?.log(msg, isErr)
      );
      this.cropKeyListener = (e) => {
        if (isScreenCropShortcut(e)) {
          e.preventDefault();
          this.screenCrop.startSelection();
        }
      };
      window.addEventListener("keydown", this.cropKeyListener, true);
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
    }
    resetPageTranslations() {
      document.querySelectorAll(
        ".speedyslate-bubble, .speedyslate-erase-patch, .speedyslate-clean-canvas, .speedyslate-page-badge"
      ).forEach((el) => el.remove());
      this.images.forEach((img) => {
        delete img.dataset.slateStatus;
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
            ModelMissingBanner.show();
          }
        }
      } catch (err) {
        this.hud?.log(`Loi kiem tra model: ${err.message}`, true);
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
      this.scanner?.stop();
      if (this.cropKeyListener) {
        window.removeEventListener("keydown", this.cropKeyListener, true);
        this.cropKeyListener = null;
      }
      this.resetPageTranslations();
      this.hud?.destroy();
      this.hud = null;
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
