"use strict";function setScheduler(e){customSchedulerFn=e}function setAsap(e){exports.asap=asap=e}function useNextTick(){return function(){return process.nextTick(flush)}}function useVertxTimer(){return void 0!==vertxNext?function(){vertxNext(flush)}:useSetTimeout()}function useMutationObserver(){var e=0,t=new BrowserMutationObserver(flush),r=document.createTextNode("");return t.observe(r,{characterData:!0}),function(){r.data=e=++e%2}}function useMessageChannel(){var e=new MessageChannel;return e.port1.onmessage=flush,function(){return e.port2.postMessage(0)}}function useSetTimeout(){var e=setTimeout;return function(){return e(flush,1)}}function flush(){for(var e=0;e<len;e+=2)(0,queue[e])(queue[e+1]),queue[e]=void 0,queue[e+1]=void 0;len=0}function attemptVertx(){try{var e=require,t=e("vertx");return vertxNext=t.runOnLoop||t.runOnContext,useVertxTimer()}catch(e){return useSetTimeout()}}Object.defineProperty(exports,"__esModule",{value:!0}),exports.setScheduler=setScheduler,exports.setAsap=setAsap;var len=0,vertxNext=void 0,customSchedulerFn=void 0,asap=exports.asap=function(e,t){queue[len]=e,queue[len+1]=t,2===(len+=2)&&(customSchedulerFn?customSchedulerFn(flush):scheduleFlush())},browserWindow="undefined"!=typeof window?window:void 0,browserGlobal=browserWindow||{},BrowserMutationObserver=browserGlobal.MutationObserver||browserGlobal.WebKitMutationObserver,isNode="undefined"==typeof self&&"undefined"!=typeof process&&"[object process]"==={}.toString.call(process),isWorker="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel,queue=new Array(1e3),scheduleFlush=void 0;scheduleFlush=isNode?useNextTick():BrowserMutationObserver?useMutationObserver():isWorker?useMessageChannel():void 0===browserWindow&&"function"==typeof require?attemptVertx():useSetTimeout();