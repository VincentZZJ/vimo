"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function getPresentDismissIns(e){return{_i:null,present:function(i){var t=this;return new _promise2.default(function(n){t._i&&t._i.isActive?t._i.dismiss().then(function(){t._i=e(i),t._i.present().then(function(){n()})}):(t._i=e(i),t._i.present().then(function(){n()}))})},dismiss:function(){var e=this;return new _promise2.default(function(i){e._i&&e._i.isActive?e._i.dismiss().then(function(){i()}):i()})}}}Object.defineProperty(exports,"__esModule",{value:!0});var _promise=require("babel-runtime/core-js/promise"),_promise2=_interopRequireDefault(_promise);exports.getPresentDismissIns=getPresentDismissIns;