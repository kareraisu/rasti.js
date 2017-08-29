/* Zepto v1.2.0 - zepto event ajax form ie - zeptojs.com/license */
!function(t,e){"function"==typeof define&&define.amd?define(function(){return e(t)}):e(t)}(this,function(t){var e=function(){function $(t){return null==t?String(t):S[C.call(t)]||"object"}function F(t){return"function"==$(t)}function k(t){return null!=t&&t==t.window}function M(t){return null!=t&&t.nodeType==t.DOCUMENT_NODE}function R(t){return"object"==$(t)}function Z(t){return R(t)&&!k(t)&&Object.getPrototypeOf(t)==Object.prototype}function z(t){var e=!!t&&"length"in t&&t.length,n=r.type(t);return"function"!=n&&!k(t)&&("array"==n||0===e||"number"==typeof e&&e>0&&e-1 in t)}function q(t){return a.call(t,function(t){return null!=t})}function H(t){return t.length>0?r.fn.concat.apply([],t):t}function I(t){return t.replace(/::/g,"/").replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").replace(/_/g,"-").toLowerCase()}function V(t){return t in l?l[t]:l[t]=new RegExp("(^|\\s)"+t+"(\\s|$)")}function _(t,e){return"number"!=typeof e||h[I(t)]?e:e+"px"}function B(t){var e,n;return c[t]||(e=f.createElement(t),f.body.appendChild(e),n=getComputedStyle(e,"").getPropertyValue("display"),e.parentNode.removeChild(e),"none"==n&&(n="block"),c[t]=n),c[t]}function U(t){return"children"in t?u.call(t.children):r.map(t.childNodes,function(t){return 1==t.nodeType?t:void 0})}function X(t,e){var n,r=t?t.length:0;for(n=0;r>n;n++)this[n]=t[n];this.length=r,this.selector=e||""}function J(t,r,i){for(n in r)i&&(Z(r[n])||L(r[n]))?(Z(r[n])&&!Z(t[n])&&(t[n]={}),L(r[n])&&!L(t[n])&&(t[n]=[]),J(t[n],r[n],i)):r[n]!==e&&(t[n]=r[n])}function W(t,e){return null==e?r(t):r(t).filter(e)}function Y(t,e,n,r){return F(e)?e.call(t,n,r):e}function G(t,e,n){null==n?t.removeAttribute(e):t.setAttribute(e,n)}function K(t,n){var r=t.className||"",i=r&&r.baseVal!==e;return n===e?i?r.baseVal:r:void(i?r.baseVal=n:t.className=n)}function Q(t){try{return t?"true"==t||("false"==t?!1:"null"==t?null:+t+""==t?+t:/^[\[\{]/.test(t)?r.parseJSON(t):t):t}catch(e){return t}}function tt(t,e){e(t);for(var n=0,r=t.childNodes.length;r>n;n++)tt(t.childNodes[n],e)}var e,n,r,i,O,P,o=[],s=o.concat,a=o.filter,u=o.slice,f=t.document,c={},l={},h={"column-count":1,columns:1,"font-weight":1,"line-height":1,opacity:1,"z-index":1,zoom:1},p=/^\s*<(\w+|!)[^>]*>/,d=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,m=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,g=/^(?:body|html)$/i,v=/([A-Z])/g,y=["val","css","html","text","data","width","height","offset"],x=["after","prepend","before","append"],b=f.createElement("table"),E=f.createElement("tr"),j={tr:f.createElement("tbody"),tbody:b,thead:b,tfoot:b,td:E,th:E,"*":f.createElement("div")},w=/complete|loaded|interactive/,T=/^[\w-]*$/,S={},C=S.toString,N={},A=f.createElement("div"),D={tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},L=Array.isArray||function(t){return t instanceof Array};return N.matches=function(t,e){if(!e||!t||1!==t.nodeType)return!1;var n=t.matches||t.webkitMatchesSelector||t.mozMatchesSelector||t.oMatchesSelector||t.matchesSelector;if(n)return n.call(t,e);var r,i=t.parentNode,o=!i;return o&&(i=A).appendChild(t),r=~N.qsa(i,e).indexOf(t),o&&A.removeChild(t),r},O=function(t){return t.replace(/-+(.)?/g,function(t,e){return e?e.toUpperCase():""})},P=function(t){return a.call(t,function(e,n){return t.indexOf(e)==n})},N.fragment=function(t,n,i){var o,s,a;return d.test(t)&&(o=r(f.createElement(RegExp.$1))),o||(t.replace&&(t=t.replace(m,"<$1></$2>")),n===e&&(n=p.test(t)&&RegExp.$1),n in j||(n="*"),a=j[n],a.innerHTML=""+t,o=r.each(u.call(a.childNodes),function(){a.removeChild(this)})),Z(i)&&(s=r(o),r.each(i,function(t,e){y.indexOf(t)>-1?s[t](e):s.attr(t,e)})),o},N.Z=function(t,e){return new X(t,e)},N.isZ=function(t){return t instanceof N.Z},N.init=function(t,n){var i;if(!t)return N.Z();if("string"==typeof t)if(t=t.trim(),"<"==t[0]&&p.test(t))i=N.fragment(t,RegExp.$1,n),t=null;else{if(n!==e)return r(n).find(t);i=N.qsa(f,t)}else{if(F(t))return r(f).ready(t);if(N.isZ(t))return t;if(L(t))i=q(t);else if(R(t))i=[t],t=null;else if(p.test(t))i=N.fragment(t.trim(),RegExp.$1,n),t=null;else{if(n!==e)return r(n).find(t);i=N.qsa(f,t)}}return N.Z(i,t)},r=function(t,e){return N.init(t,e)},r.extend=function(t){var e,n=u.call(arguments,1);return"boolean"==typeof t&&(e=t,t=n.shift()),n.forEach(function(n){J(t,n,e)}),t},N.qsa=function(t,e){var n,r="#"==e[0],i=!r&&"."==e[0],o=r||i?e.slice(1):e,s=T.test(o);return t.getElementById&&s&&r?(n=t.getElementById(o))?[n]:[]:1!==t.nodeType&&9!==t.nodeType&&11!==t.nodeType?[]:u.call(s&&!r&&t.getElementsByClassName?i?t.getElementsByClassName(o):t.getElementsByTagName(e):t.querySelectorAll(e))},r.contains=f.documentElement.contains?function(t,e){return t!==e&&t.contains(e)}:function(t,e){for(;e&&(e=e.parentNode);)if(e===t)return!0;return!1},r.type=$,r.isFunction=F,r.isWindow=k,r.isArray=L,r.isPlainObject=Z,r.isEmptyObject=function(t){var e;for(e in t)return!1;return!0},r.isNumeric=function(t){var e=Number(t),n=typeof t;return null!=t&&"boolean"!=n&&("string"!=n||t.length)&&!isNaN(e)&&isFinite(e)||!1},r.inArray=function(t,e,n){return o.indexOf.call(e,t,n)},r.camelCase=O,r.trim=function(t){return null==t?"":String.prototype.trim.call(t)},r.uuid=0,r.support={},r.expr={},r.noop=function(){},r.map=function(t,e){var n,i,o,r=[];if(z(t))for(i=0;i<t.length;i++)n=e(t[i],i),null!=n&&r.push(n);else for(o in t)n=e(t[o],o),null!=n&&r.push(n);return H(r)},r.each=function(t,e){var n,r;if(z(t)){for(n=0;n<t.length;n++)if(e.call(t[n],n,t[n])===!1)return t}else for(r in t)if(e.call(t[r],r,t[r])===!1)return t;return t},r.grep=function(t,e){return a.call(t,e)},t.JSON&&(r.parseJSON=JSON.parse),r.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(t,e){S["[object "+e+"]"]=e.toLowerCase()}),r.fn={constructor:N.Z,length:0,forEach:o.forEach,reduce:o.reduce,push:o.push,sort:o.sort,splice:o.splice,indexOf:o.indexOf,concat:function(){var t,e,n=[];for(t=0;t<arguments.length;t++)e=arguments[t],n[t]=N.isZ(e)?e.toArray():e;return s.apply(N.isZ(this)?this.toArray():this,n)},map:function(t){return r(r.map(this,function(e,n){return t.call(e,n,e)}))},slice:function(){return r(u.apply(this,arguments))},ready:function(t){return w.test(f.readyState)&&f.body?t(r):f.addEventListener("DOMContentLoaded",function(){t(r)},!1),this},get:function(t){return t===e?u.call(this):this[t>=0?t:t+this.length]},toArray:function(){return this.get()},size:function(){return this.length},remove:function(){return this.each(function(){null!=this.parentNode&&this.parentNode.removeChild(this)})},each:function(t){return o.every.call(this,function(e,n){return t.call(e,n,e)!==!1}),this},filter:function(t){return F(t)?this.not(this.not(t)):r(a.call(this,function(e){return N.matches(e,t)}))},add:function(t,e){return r(P(this.concat(r(t,e))))},is:function(t){return this.length>0&&N.matches(this[0],t)},not:function(t){var n=[];if(F(t)&&t.call!==e)this.each(function(e){t.call(this,e)||n.push(this)});else{var i="string"==typeof t?this.filter(t):z(t)&&F(t.item)?u.call(t):r(t);this.forEach(function(t){i.indexOf(t)<0&&n.push(t)})}return r(n)},has:function(t){return this.filter(function(){return R(t)?r.contains(this,t):r(this).find(t).size()})},eq:function(t){return-1===t?this.slice(t):this.slice(t,+t+1)},first:function(){var t=this[0];return t&&!R(t)?t:r(t)},last:function(){var t=this[this.length-1];return t&&!R(t)?t:r(t)},find:function(t){var e,n=this;return e=t?"object"==typeof t?r(t).filter(function(){var t=this;return o.some.call(n,function(e){return r.contains(e,t)})}):1==this.length?r(N.qsa(this[0],t)):this.map(function(){return N.qsa(this,t)}):r()},closest:function(t,e){var n=[],i="object"==typeof t&&r(t);return this.each(function(r,o){for(;o&&!(i?i.indexOf(o)>=0:N.matches(o,t));)o=o!==e&&!M(o)&&o.parentNode;o&&n.indexOf(o)<0&&n.push(o)}),r(n)},parents:function(t){for(var e=[],n=this;n.length>0;)n=r.map(n,function(t){return(t=t.parentNode)&&!M(t)&&e.indexOf(t)<0?(e.push(t),t):void 0});return W(e,t)},parent:function(t){return W(P(this.pluck("parentNode")),t)},children:function(t){return W(this.map(function(){return U(this)}),t)},contents:function(){return this.map(function(){return this.contentDocument||u.call(this.childNodes)})},siblings:function(t){return W(this.map(function(t,e){return a.call(U(e.parentNode),function(t){return t!==e})}),t)},empty:function(){return this.each(function(){this.innerHTML=""})},pluck:function(t){return r.map(this,function(e){return e[t]})},show:function(){return this.each(function(){"none"==this.style.display&&(this.style.display=""),"none"==getComputedStyle(this,"").getPropertyValue("display")&&(this.style.display=B(this.nodeName))})},replaceWith:function(t){return this.before(t).remove()},wrap:function(t){var e=F(t);if(this[0]&&!e)var n=r(t).get(0),i=n.parentNode||this.length>1;return this.each(function(o){r(this).wrapAll(e?t.call(this,o):i?n.cloneNode(!0):n)})},wrapAll:function(t){if(this[0]){r(this[0]).before(t=r(t));for(var e;(e=t.children()).length;)t=e.first();r(t).append(this)}return this},wrapInner:function(t){var e=F(t);return this.each(function(n){var i=r(this),o=i.contents(),s=e?t.call(this,n):t;o.length?o.wrapAll(s):i.append(s)})},unwrap:function(){return this.parent().each(function(){r(this).replaceWith(r(this).children())}),this},clone:function(){return this.map(function(){return this.cloneNode(!0)})},hide:function(){return this.css("display","none")},toggle:function(t){return this.each(function(){var n=r(this);(t===e?"none"==n.css("display"):t)?n.show():n.hide()})},prev:function(t){return r(this.pluck("previousElementSibling")).filter(t||"*")},next:function(t){return r(this.pluck("nextElementSibling")).filter(t||"*")},html:function(t){return 0 in arguments?this.each(function(e){var n=this.innerHTML;r(this).empty().append(Y(this,t,e,n))}):0 in this?this[0].innerHTML:null},text:function(t){return 0 in arguments?this.each(function(e){var n=Y(this,t,e,this.textContent);this.textContent=null==n?"":""+n}):0 in this?this.pluck("textContent").join(""):null},attr:function(t,r){var i;return"string"!=typeof t||1 in arguments?this.each(function(e){if(1===this.nodeType)if(R(t))for(n in t)G(this,n,t[n]);else G(this,t,Y(this,r,e,this.getAttribute(t)))}):0 in this&&1==this[0].nodeType&&null!=(i=this[0].getAttribute(t))?i:e},removeAttr:function(t){return this.each(function(){1===this.nodeType&&t.split(" ").forEach(function(t){G(this,t)},this)})},prop:function(t,e){return t=D[t]||t,1 in arguments?this.each(function(n){this[t]=Y(this,e,n,this[t])}):this[0]&&this[0][t]},removeProp:function(t){return t=D[t]||t,this.each(function(){delete this[t]})},data:function(t,n){var r="data-"+t.replace(v,"-$1").toLowerCase(),i=1 in arguments?this.attr(r,n):this.attr(r);return null!==i?Q(i):e},val:function(t){return 0 in arguments?(null==t&&(t=""),this.each(function(e){this.value=Y(this,t,e,this.value)})):this[0]&&(this[0].multiple?r(this[0]).find("option").filter(function(){return this.selected}).pluck("value"):this[0].value)},offset:function(e){if(e)return this.each(function(t){var n=r(this),i=Y(this,e,t,n.offset()),o=n.offsetParent().offset(),s={top:i.top-o.top,left:i.left-o.left};"static"==n.css("position")&&(s.position="relative"),n.css(s)});if(!this.length)return null;if(f.documentElement!==this[0]&&!r.contains(f.documentElement,this[0]))return{top:0,left:0};var n=this[0].getBoundingClientRect();return{left:n.left+t.pageXOffset,top:n.top+t.pageYOffset,width:Math.round(n.width),height:Math.round(n.height)}},css:function(t,e){if(arguments.length<2){var i=this[0];if("string"==typeof t){if(!i)return;return i.style[O(t)]||getComputedStyle(i,"").getPropertyValue(t)}if(L(t)){if(!i)return;var o={},s=getComputedStyle(i,"");return r.each(t,function(t,e){o[e]=i.style[O(e)]||s.getPropertyValue(e)}),o}}var a="";if("string"==$(t))e||0===e?a=I(t)+":"+_(t,e):this.each(function(){this.style.removeProperty(I(t))});else for(n in t)t[n]||0===t[n]?a+=I(n)+":"+_(n,t[n])+";":this.each(function(){this.style.removeProperty(I(n))});return this.each(function(){this.style.cssText+=";"+a})},index:function(t){return t?this.indexOf(r(t)[0]):this.parent().children().indexOf(this[0])},hasClass:function(t){return t?o.some.call(this,function(t){return this.test(K(t))},V(t)):!1},addClass:function(t){return t?this.each(function(e){if("className"in this){i=[];var n=K(this),o=Y(this,t,e,n);o.split(/\s+/g).forEach(function(t){r(this).hasClass(t)||i.push(t)},this),i.length&&K(this,n+(n?" ":"")+i.join(" "))}}):this},removeClass:function(t){return this.each(function(n){if("className"in this){if(t===e)return K(this,"");i=K(this),Y(this,t,n,i).split(/\s+/g).forEach(function(t){i=i.replace(V(t)," ")}),K(this,i.trim())}})},toggleClass:function(t,n){return t?this.each(function(i){var o=r(this),s=Y(this,t,i,K(this));s.split(/\s+/g).forEach(function(t){(n===e?!o.hasClass(t):n)?o.addClass(t):o.removeClass(t)})}):this},scrollTop:function(t){if(this.length){var n="scrollTop"in this[0];return t===e?n?this[0].scrollTop:this[0].pageYOffset:this.each(n?function(){this.scrollTop=t}:function(){this.scrollTo(this.scrollX,t)})}},scrollLeft:function(t){if(this.length){var n="scrollLeft"in this[0];return t===e?n?this[0].scrollLeft:this[0].pageXOffset:this.each(n?function(){this.scrollLeft=t}:function(){this.scrollTo(t,this.scrollY)})}},position:function(){if(this.length){var t=this[0],e=this.offsetParent(),n=this.offset(),i=g.test(e[0].nodeName)?{top:0,left:0}:e.offset();return n.top-=parseFloat(r(t).css("margin-top"))||0,n.left-=parseFloat(r(t).css("margin-left"))||0,i.top+=parseFloat(r(e[0]).css("border-top-width"))||0,i.left+=parseFloat(r(e[0]).css("border-left-width"))||0,{top:n.top-i.top,left:n.left-i.left}}},offsetParent:function(){return this.map(function(){for(var t=this.offsetParent||f.body;t&&!g.test(t.nodeName)&&"static"==r(t).css("position");)t=t.offsetParent;return t})}},r.fn.detach=r.fn.remove,["width","height"].forEach(function(t){var n=t.replace(/./,function(t){return t[0].toUpperCase()});r.fn[t]=function(i){var o,s=this[0];return i===e?k(s)?s["inner"+n]:M(s)?s.documentElement["scroll"+n]:(o=this.offset())&&o[t]:this.each(function(e){s=r(this),s.css(t,Y(this,i,e,s[t]()))})}}),x.forEach(function(n,i){var o=i%2;r.fn[n]=function(){var n,a,s=r.map(arguments,function(t){var i=[];return n=$(t),"array"==n?(t.forEach(function(t){return t.nodeType!==e?i.push(t):r.zepto.isZ(t)?i=i.concat(t.get()):void(i=i.concat(N.fragment(t)))}),i):"object"==n||null==t?t:N.fragment(t)}),u=this.length>1;return s.length<1?this:this.each(function(e,n){a=o?n:n.parentNode,n=0==i?n.nextSibling:1==i?n.firstChild:2==i?n:null;var c=r.contains(f.documentElement,a);s.forEach(function(e){if(u)e=e.cloneNode(!0);else if(!a)return r(e).remove();a.insertBefore(e,n),c&&tt(e,function(e){if(!(null==e.nodeName||"SCRIPT"!==e.nodeName.toUpperCase()||e.type&&"text/javascript"!==e.type||e.src)){var n=e.ownerDocument?e.ownerDocument.defaultView:t;n.eval.call(n,e.innerHTML)}})})})},r.fn[o?n+"To":"insert"+(i?"Before":"After")]=function(t){return r(t)[n](this),this}}),N.Z.prototype=X.prototype=r.fn,N.uniq=P,N.deserializeValue=Q,r.zepto=N,r}();return t.Zepto=e,void 0===t.$&&(t.$=e),function(e){function h(t){return t._zid||(t._zid=n++)}function p(t,e,n,r){if(e=d(e),e.ns)var i=m(e.ns);return(a[h(t)]||[]).filter(function(t){return t&&(!e.e||t.e==e.e)&&(!e.ns||i.test(t.ns))&&(!n||h(t.fn)===h(n))&&(!r||t.sel==r)})}function d(t){var e=(""+t).split(".");return{e:e[0],ns:e.slice(1).sort().join(" ")}}function m(t){return new RegExp("(?:^| )"+t.replace(" "," .* ?")+"(?: |$)")}function g(t,e){return t.del&&!f&&t.e in c||!!e}function v(t){return l[t]||f&&c[t]||t}function y(t,n,i,o,s,u,f){var c=h(t),p=a[c]||(a[c]=[]);n.split(/\s/).forEach(function(n){if("ready"==n)return e(document).ready(i);var a=d(n);a.fn=i,a.sel=s,a.e in l&&(i=function(t){var n=t.relatedTarget;return!n||n!==this&&!e.contains(this,n)?a.fn.apply(this,arguments):void 0}),a.del=u;var c=u||i;a.proxy=function(e){if(e=T(e),!e.isImmediatePropagationStopped()){e.data=o;var n=c.apply(t,e._args==r?[e]:[e].concat(e._args));return n===!1&&(e.preventDefault(),e.stopPropagation()),n}},a.i=p.length,p.push(a),"addEventListener"in t&&t.addEventListener(v(a.e),a.proxy,g(a,f))})}function x(t,e,n,r,i){var o=h(t);(e||"").split(/\s/).forEach(function(e){p(t,e,n,r).forEach(function(e){delete a[o][e.i],"removeEventListener"in t&&t.removeEventListener(v(e.e),e.proxy,g(e,i))})})}function T(t,n){return(n||!t.isDefaultPrevented)&&(n||(n=t),e.each(w,function(e,r){var i=n[e];t[e]=function(){return this[r]=b,i&&i.apply(n,arguments)},t[r]=E}),t.timeStamp||(t.timeStamp=Date.now()),(n.defaultPrevented!==r?n.defaultPrevented:"returnValue"in n?n.returnValue===!1:n.getPreventDefault&&n.getPreventDefault())&&(t.isDefaultPrevented=b)),t}function S(t){var e,n={originalEvent:t};for(e in t)j.test(e)||t[e]===r||(n[e]=t[e]);return T(n,t)}var r,n=1,i=Array.prototype.slice,o=e.isFunction,s=function(t){return"string"==typeof t},a={},u={},f="onfocusin"in t,c={focus:"focusin",blur:"focusout"},l={mouseenter:"mouseover",mouseleave:"mouseout"};u.click=u.mousedown=u.mouseup=u.mousemove="MouseEvents",e.event={add:y,remove:x},e.proxy=function(t,n){var r=2 in arguments&&i.call(arguments,2);if(o(t)){var a=function(){return t.apply(n,r?r.concat(i.call(arguments)):arguments)};return a._zid=h(t),a}if(s(n))return r?(r.unshift(t[n],t),e.proxy.apply(null,r)):e.proxy(t[n],t);throw new TypeError("expected function")},e.fn.bind=function(t,e,n){return this.on(t,e,n)},e.fn.unbind=function(t,e){return this.off(t,e)},e.fn.one=function(t,e,n,r){return this.on(t,e,n,r,1)};var b=function(){return!0},E=function(){return!1},j=/^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/,w={preventDefault:"isDefaultPrevented",stopImmediatePropagation:"isImmediatePropagationStopped",stopPropagation:"isPropagationStopped"};e.fn.delegate=function(t,e,n){return this.on(e,t,n)},e.fn.undelegate=function(t,e,n){return this.off(e,t,n)},e.fn.live=function(t,n){return e(document.body).delegate(this.selector,t,n),this},e.fn.die=function(t,n){return e(document.body).undelegate(this.selector,t,n),this},e.fn.on=function(t,n,a,u,f){var c,l,h=this;return t&&!s(t)?(e.each(t,function(t,e){h.on(t,n,a,e,f)}),h):(s(n)||o(u)||u===!1||(u=a,a=n,n=r),(u===r||a===!1)&&(u=a,a=r),u===!1&&(u=E),h.each(function(r,o){f&&(c=function(t){return x(o,t.type,u),u.apply(this,arguments)}),n&&(l=function(t){var r,s=e(t.target).closest(n,o).get(0);return s&&s!==o?(r=e.extend(S(t),{currentTarget:s,liveFired:o}),(c||u).apply(s,[r].concat(i.call(arguments,1)))):void 0}),y(o,t,u,a,n,l||c)}))},e.fn.off=function(t,n,i){var a=this;return t&&!s(t)?(e.each(t,function(t,e){a.off(t,n,e)}),a):(s(n)||o(i)||i===!1||(i=n,n=r),i===!1&&(i=E),a.each(function(){x(this,t,i,n)}))},e.fn.trigger=function(t,n){return t=s(t)||e.isPlainObject(t)?e.Event(t):T(t),t._args=n,this.each(function(){t.type in c&&"function"==typeof this[t.type]?this[t.type]():"dispatchEvent"in this?this.dispatchEvent(t):e(this).triggerHandler(t,n)})},e.fn.triggerHandler=function(t,n){var r,i;return this.each(function(o,a){r=S(s(t)?e.Event(t):t),r._args=n,r.target=a,e.each(p(a,t.type||t),function(t,e){return i=e.proxy(r),r.isImmediatePropagationStopped()?!1:void 0})}),i},"focusin focusout focus blur load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function(t){e.fn[t]=function(e){return 0 in arguments?this.bind(t,e):this.trigger(t)}}),e.Event=function(t,e){s(t)||(e=t,t=e.type);var n=document.createEvent(u[t]||"Events"),r=!0;if(e)for(var i in e)"bubbles"==i?r=!!e[i]:n[i]=e[i];return n.initEvent(t,r,!0),T(n)}}(e),function(e){function p(t,n,r){var i=e.Event(n);return e(t).trigger(i,r),!i.isDefaultPrevented()}function d(t,e,n,i){return t.global?p(e||r,n,i):void 0}function m(t){t.global&&0===e.active++&&d(t,null,"ajaxStart")}function g(t){t.global&&!--e.active&&d(t,null,"ajaxStop")}function v(t,e){var n=e.context;return e.beforeSend.call(n,t,e)===!1||d(e,n,"ajaxBeforeSend",[t,e])===!1?!1:void d(e,n,"ajaxSend",[t,e])}function y(t,e,n,r){var i=n.context,o="success";n.success.call(i,t,o,e),r&&r.resolveWith(i,[t,o,e]),d(n,i,"ajaxSuccess",[e,n,t]),b(o,e,n)}function x(t,e,n,r,i){var o=r.context;r.error.call(o,n,e,t),i&&i.rejectWith(o,[n,e,t]),d(r,o,"ajaxError",[n,r,t||e]),b(e,n,r)}function b(t,e,n){var r=n.context;n.complete.call(r,e,t),d(n,r,"ajaxComplete",[e,n]),g(n)}function E(t,e,n){if(n.dataFilter==j)return t;var r=n.context;return n.dataFilter.call(r,t,e)}function j(){}function w(t){return t&&(t=t.split(";",2)[0]),t&&(t==c?"html":t==f?"json":a.test(t)?"script":u.test(t)&&"xml")||"text"}function T(t,e){return""==e?t:(t+"&"+e).replace(/[&?]{1,2}/,"?")}function S(t){t.processData&&t.data&&"string"!=e.type(t.data)&&(t.data=e.param(t.data,t.traditional)),!t.data||t.type&&"GET"!=t.type.toUpperCase()&&"jsonp"!=t.dataType||(t.url=T(t.url,t.data),t.data=void 0)}function C(t,n,r,i){return e.isFunction(n)&&(i=r,r=n,n=void 0),e.isFunction(r)||(i=r,r=void 0),{url:t,data:n,success:r,dataType:i}}function O(t,n,r,i){var o,s=e.isArray(n),a=e.isPlainObject(n);e.each(n,function(n,u){o=e.type(u),i&&(n=r?i:i+"["+(a||"object"==o||"array"==o?n:"")+"]"),!i&&s?t.add(u.name,u.value):"array"==o||!r&&"object"==o?O(t,u,r,n):t.add(n,u)})}var i,o,n=+new Date,r=t.document,s=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,a=/^(?:text|application)\/javascript/i,u=/^(?:text|application)\/xml/i,f="application/json",c="text/html",l=/^\s*$/,h=r.createElement("a");h.href=t.location.href,e.active=0,e.ajaxJSONP=function(i,o){if(!("type"in i))return e.ajax(i);var c,p,s=i.jsonpCallback,a=(e.isFunction(s)?s():s)||"Zepto"+n++,u=r.createElement("script"),f=t[a],l=function(t){e(u).triggerHandler("error",t||"abort")},h={abort:l};return o&&o.promise(h),e(u).on("load error",function(n,r){clearTimeout(p),e(u).off().remove(),"error"!=n.type&&c?y(c[0],h,i,o):x(null,r||"error",h,i,o),t[a]=f,c&&e.isFunction(f)&&f(c[0]),f=c=void 0}),v(h,i)===!1?(l("abort"),h):(t[a]=function(){c=arguments},u.src=i.url.replace(/\?(.+)=\?/,"?$1="+a),r.head.appendChild(u),i.timeout>0&&(p=setTimeout(function(){l("timeout")},i.timeout)),h)},e.ajaxSettings={type:"GET",beforeSend:j,success:j,error:j,complete:j,context:null,global:!0,xhr:function(){return new t.XMLHttpRequest},accepts:{script:"text/javascript, application/javascript, application/x-javascript",json:f,xml:"application/xml, text/xml",html:c,text:"text/plain"},crossDomain:!1,timeout:0,processData:!0,cache:!0,dataFilter:j},e.ajax=function(n){var u,f,s=e.extend({},n||{}),a=e.Deferred&&e.Deferred();for(i in e.ajaxSettings)void 0===s[i]&&(s[i]=e.ajaxSettings[i]);m(s),s.crossDomain||(u=r.createElement("a"),u.href=s.url,u.href=u.href,s.crossDomain=h.protocol+"//"+h.host!=u.protocol+"//"+u.host),s.url||(s.url=t.location.toString()),(f=s.url.indexOf("#"))>-1&&(s.url=s.url.slice(0,f)),S(s);var c=s.dataType,p=/\?.+=\?/.test(s.url);if(p&&(c="jsonp"),s.cache!==!1&&(n&&n.cache===!0||"script"!=c&&"jsonp"!=c)||(s.url=T(s.url,"_="+Date.now())),"jsonp"==c)return p||(s.url=T(s.url,s.jsonp?s.jsonp+"=?":s.jsonp===!1?"":"callback=?")),e.ajaxJSONP(s,a);var P,d=s.accepts[c],g={},b=function(t,e){g[t.toLowerCase()]=[t,e]},C=/^([\w-]+:)\/\//.test(s.url)?RegExp.$1:t.location.protocol,N=s.xhr(),O=N.setRequestHeader;if(a&&a.promise(N),s.crossDomain||b("X-Requested-With","XMLHttpRequest"),b("Accept",d||"*/*"),(d=s.mimeType||d)&&(d.indexOf(",")>-1&&(d=d.split(",",2)[0]),N.overrideMimeType&&N.overrideMimeType(d)),(s.contentType||s.contentType!==!1&&s.data&&"GET"!=s.type.toUpperCase())&&b("Content-Type",s.contentType||"application/x-www-form-urlencoded"),s.headers)for(o in s.headers)b(o,s.headers[o]);if(N.setRequestHeader=b,N.onreadystatechange=function(){if(4==N.readyState){N.onreadystatechange=j,clearTimeout(P);var t,n=!1;if(N.status>=200&&N.status<300||304==N.status||0==N.status&&"file:"==C){if(c=c||w(s.mimeType||N.getResponseHeader("content-type")),"arraybuffer"==N.responseType||"blob"==N.responseType)t=N.response;else{t=N.responseText;try{t=E(t,c,s),"script"==c?(1,eval)(t):"xml"==c?t=N.responseXML:"json"==c&&(t=l.test(t)?null:e.parseJSON(t))}catch(r){n=r}if(n)return x(n,"parsererror",N,s,a)}y(t,N,s,a)}else x(N.statusText||null,N.status?"error":"abort",N,s,a)}},v(N,s)===!1)return N.abort(),x(null,"abort",N,s,a),N;var A="async"in s?s.async:!0;if(N.open(s.type,s.url,A,s.username,s.password),s.xhrFields)for(o in s.xhrFields)N[o]=s.xhrFields[o];for(o in g)O.apply(N,g[o]);return s.timeout>0&&(P=setTimeout(function(){N.onreadystatechange=j,N.abort(),x(null,"timeout",N,s,a)},s.timeout)),N.send(s.data?s.data:null),N},e.get=function(){return e.ajax(C.apply(null,arguments))},e.post=function(){var t=C.apply(null,arguments);return t.type="POST",e.ajax(t)},e.getJSON=function(){var t=C.apply(null,arguments);return t.dataType="json",e.ajax(t)},e.fn.load=function(t,n,r){if(!this.length)return this;var a,i=this,o=t.split(/\s/),u=C(t,n,r),f=u.success;return o.length>1&&(u.url=o[0],a=o[1]),u.success=function(t){i.html(a?e("<div>").html(t.replace(s,"")).find(a):t),f&&f.apply(i,arguments)},e.ajax(u),this};var N=encodeURIComponent;e.param=function(t,n){var r=[];return r.add=function(t,n){e.isFunction(n)&&(n=n()),null==n&&(n=""),this.push(N(t)+"="+N(n))},O(r,t,n),r.join("&").replace(/%20/g,"+")}}(e),function(t){t.fn.serializeArray=function(){var e,n,r=[],i=function(t){return t.forEach?t.forEach(i):void r.push({name:e,value:t})};return this[0]&&t.each(this[0].elements,function(r,o){n=o.type,e=o.name,e&&"fieldset"!=o.nodeName.toLowerCase()&&!o.disabled&&"submit"!=n&&"reset"!=n&&"button"!=n&&"file"!=n&&("radio"!=n&&"checkbox"!=n||o.checked)&&i(t(o).val())}),r},t.fn.serialize=function(){var t=[];return this.serializeArray().forEach(function(e){t.push(encodeURIComponent(e.name)+"="+encodeURIComponent(e.value))}),t.join("&")},t.fn.submit=function(e){if(0 in arguments)this.bind("submit",e);else if(this.length){var n=t.Event("submit");this.eq(0).trigger(n),n.isDefaultPrevented()||this.get(0).submit()}return this}}(e),function(){try{getComputedStyle(void 0)}catch(e){var n=getComputedStyle;t.getComputedStyle=function(t,e){try{return n(t,e)}catch(r){return null}}}}(),e});
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.rasti = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
    list    : require('./list'),
	buttons : require('./buttons'),
	checks  : require('./checks'),
	radios  : require('./radios'),
	multi   : require('./multi'),
	select  : require('./select'),
}
},{"./buttons":2,"./checks":3,"./list":4,"./multi":5,"./radios":6,"./select":7}],2:[function(require,module,exports){
const utils = require('../utils')

module.exports = {

template : function(data, $el) {
    return data
        .map( d => utils.checkData(d) )
        .map( d => `<div value="${d.value}">${d.label}</div>` )
        .join('')
},

init : function($el) {
    $el.on('click', 'div', function(e) {
        $el.val($(e.target).attr('value'))
            .trigger('change')
    })
    $el.on('change', function(e) {
        $el.children().removeClass('active')
        $el.find('[value="'+ $el.val() +'"]').addClass('active')
    })
},

style : `
    [block=buttons] > div {
        display: inline-block;
        margin: 5px !important;
        padding: 5px 10px;
        border-radius: 6px;
        border: 2px outset rgba(255, 255, 255, 0.5);
        background-clip: padding-box;
        cursor: pointer;
    }
    [block=buttons] > div.active {
        filter: contrast(1.5);
        border-style: inset;
        padding: 4px 11px 6px 9px;
        transform: translateY(-1px);
    }
`

}

},{"../utils":12}],3:[function(require,module,exports){
const utils = require('../utils')

module.exports = {

template : function(data, $el) {
    var uid = utils.random()
    return data
        .map( d => utils.checkData(d) )
        .map( d => `<input type="checkbox" name="${uid}[]" value="${d.value}"><label>${d.label}</label>` )
        .join('')
},

init : function($el) {
    var values = $el[0].value = []
    $el.on('click', 'label', function(e) {
        // forward clicks to hidden input
        $(e.currentTarget).prev().click()
    })
    $el.on('change', 'input', function(e) {
        // update component value
        var $input = $(e.currentTarget),
            val = $input.attr('value')
        $input.prop('checked')
            ? values.push(val)
            : values.remove(val)
    })
    $el.on('change', function(e) {
        // update component ui
        var $input, checked
        $el.find('input').each(function(i, input){
            $input = $(input)
            checked = values.includes( $input.attr('value') )
            $input.prop('checked', checked)
        })
    })
},

style : ``

}
},{"../utils":12}],4:[function(require,module,exports){
const utils = require('../utils')

module.exports = {

template : function(data, $el) {
    return data
        .map( d => `<li>${d}</li>` )
        .join('')
},

init : function($el) {},

style : ''

}
},{"../utils":12}],5:[function(require,module,exports){
const utils = require('../utils')

module.exports = {

template : function(data, $el) {
    $el[0].total = data.length // WARNING : SIDE EFFECTS

    var ret = $el[0].hasAttribute('filter')
        ? `<input field type="text" placeholder="${ $el.attr('filter') }"/>`
        : ''

    return ret + data
        .map( d => utils.checkData(d) )
        .map( d => `<option value="${d.value}" alias="${d.alias}">${d.label}</option>` )
        .join('')
},

init : function($el) {
    var el = $el[0]
    var field = $el.attr('field')

    if (!field) return rasti.error('Missing field name in [field] attribute of element:', el)
    
    el.value = []
    el.max = parseInt($el.attr('max'))

    if (el.initialized) {
        // empty selected options (and remove full class in case it was full)
        $el.find('[selected]').empty()
        $el.removeClass('full')
        // then exit (skip structure and bindings)
        return
    }

    // structure

    $el.html('<div selected/><div add/>')
    $el.closest('[page]').children('.page-options')
        .append('<div field block=multi options='+ field +'>')
    var $selected = $el.find('[selected]')
    var $options = $el.closest('[page]').find('[options='+ field +']')

    // bindings

    $el.on('click', function(e) {
        $options.siblings('[options]').hide() // hide other options
        if ( utils.onMobile() ) $options.parent().addClass('backdrop')
        $options.css('left', this.getBoundingClientRect().right).show()
        $options.find('input').focus()
    })

    $el.closest('[page]').on('click', '*:not(option)', function(e) {
        if ( $(e.target).attr('field') === field
          || $(e.target).parent().attr('field') === field ) return
        if ( utils.onMobile() ) $options.parent().removeClass('backdrop')
        $options.hide()
    })

    var toggleOption = function(e) {
        e.stopPropagation()
        $options.find('input').focus()
        var $opt = $(e.target),
            val = $opt.attr('value'),
            values = $el[0].value

        if ($opt.parent().attr('options')) {
            // select option
            $el.find('[selected]').append($opt)
            values.push(val)
        }
        else {
            // unselect option
            $options.append($opt)
            values.remove(val)
        }
        checkFull()
        $el.trigger('change', {ui: true}) 
    }

    $el.on('click', 'option', toggleOption)

    $options.on('click', 'option', toggleOption)

    $options.on('click', function(e) { $options.find('input').focus() })

    $options.on('input', 'input', function(e) {
        this.value
            ? $options.find('option').hide().filter('[alias*='+ this.value +']').show()
            : $options.find('option').show()
    })

    $el.on('change', function(e, params){
        if (params && params.ui) return // triggered from ui, do nothing
        $selected.children().each(function(i, el) {
            $options.append(el)
        })
        for (var val of el.value) {
            $selected.append($options.find('[value='+ val +']'))
            if ( checkFull() ) break
        }
    })

    function checkFull() {
        var qty = $selected.children().length,
            dif = el.value.length - qty,
            isFull = qty >= (el.max || el.total)

        if (isFull) {
            if (dif > 0) {
                el.value = el.value.slice(0, qty)
                rasti.warn('Dropped %s overflowed values in el:', dif, el)
            }
            $el.addClass('full')
            if ( utils.onMobile() ) $options.parent().removeClass('backdrop')
            $options.hide()
        }
        else {
            $el.removeClass('full')
        }

        return isFull
    }

    el.initialized = true
},

style : `
    [block=multi] {
        display: flex;
        min-height: 35px;
        padding-right: 0;
        text-shadow: 0 0 0 #000;
        cursor: pointer;
    }
    [block=multi] [add] {
        display: flex;
        align-items: center;
        width: 20px;
        border-left: 1px solid rgba(0,0,0,0.2);
    }
    [block=multi] [add]:before {
        content: '〉';
        padding-left: 6px;
    }
    [block=multi].open [add] {
        box-shadow: inset 0 0 2px #000;
    }
    [block=multi].full {
        padding-right: 5px;
    }
    [block=multi].full [add] {
        display: none;
    }
    [block=multi] option {
        padding: 2px 0;
    }
    [block=multi] option:before {
        content: '✕';
        display: inline-block;
        box-sizing: border-box;
        height: 20px;
        width: 20px;
        margin-right: 5px;
        border-radius: 50%;
        text-align: center;
        line-height: 1.5;
    }
    [block=multi] [selected] {
        flex-basis: 100%;
        max-height: 100px;
        overflow-y: auto;
    }
    [block=multi] [selected] > option:hover:before {
        color: #d90000;
        background-color: rgba(255, 0, 0, 0.5);
    }
    [block=multi][options] {
        display: none;
        position: absolute;
        top: 0;
        width: 250px;
        height: 100%;
        padding: 5px 10px;
        border: 1px solid;
        z-index: 10;
        overflow-y: auto;
    }
    [block=multi][options] > option:before {
        transform: rotate(45deg);
    }
    [block=multi][options] > option:hover:before {
        color: #008000;
        background-color: rgba(0, 128, 0, 0.5);
    }
    [block=multi][options] input {
        border: 1px solid #000;
        margin: 10px 0;
    }

`

}
},{"../utils":12}],6:[function(require,module,exports){
const utils = require('../utils')

module.exports = {

template : function(data, $el) {
    var uid = utils.random()
    return data
        .map( d => utils.checkData(d) )
        .map( d => `<input type="radio" name="${uid}" value="${d.value}"/><label>${d.label}</label>` )
        .join('')
},

init : function($el) {
    $el.on('click', 'label', function(e) {
        // forward clicks to hidden input
        $(e.currentTarget).prev().click()
    })
    $el.on('change', 'input', function(e) {
        // update component value
        $el.val( $(e.currentTarget).attr('value') )
    })
    $el.on('change', function(e) {
        // update component ui
        $el.find('[value="'+ $el.val() +'"]').prop('checked', true)
    })
},

style : ``

}
},{"../utils":12}],7:[function(require,module,exports){
const utils = require('../utils')

module.exports = {

template : function(data, $el) {
    var ret = ''
    for (var d of data) {
        d = utils.checkData(d)
        ret += `<option value="${d.value}">${d.label}</option>`
    }
    return ret
},

init : function($el) {
    var imgpath = $el.attr('img')
    if (!imgpath) return

    var $selected = $el.find('[selected]'),
        $wrapper = $('<div select>'),
        $options = $('<div options>')

    // clone original select
    $.each($el[0].attributes, function() {
        $wrapper.attr(this.name, this.value);
    });

    // wrap with clone
    $el.wrap($wrapper)
    // regain wrapper ref (it is lost when wrapping)
    $wrapper = $el.parent()
    // add caret
    $wrapper.append('<div caret>&#9660</div>')

    if (!$el.attr('data')) {
        // clone original options
        $el.find('option').each(function(opt, i) {
            $options.append(`<div value="${opt.value}">${opt.innerHTML}</div>`)
        })
    }
    // add options
    $wrapper.append($options)
    // replace ref with divs
    $options = $options.children()

    // recreate selected option, if none select first one
    var i = $selected.length ? $selected.index() : 0
    $options[i].classList.add('selected')
    // recreate select value
    $wrapper.val($el.val() || $options[i].getAttribute('value'))

    // add images
    setImg($wrapper, imgpath)
    $options.each(function(i, el) {
        setImg($(el), imgpath)
    })

    // bind clicks
    $options.click(function(e) {
        var $opt = $(this)
        $opt.siblings().removeClass('selected')
        $opt.addClass('selected')
        var $wrapper = $opt.closest('[select]')
        $wrapper.val($opt.attr('value'))
        var imgpath = $wrapper.attr('img')
        if (imgpath) setImg($wrapper, imgpath)
    })

    // remove original select
    $el.remove()

},

style : `
    [select] select {
        display: none;
    }
    [select] {
        cursor: pointer;
        border-radius: 4px;
    }
    [select]:hover [options] {
        display: block;
    }
    [select] [options] {
        display: none;
        position: absolute;
        margin-top: 42px;
        margin-left: -4px;
        border: 4px solid #b9b9b9;
        border-radius: 4px;
    }
    [select] [options] div:hover {
        border: 4px solid #fff;
    }
    [select] [options] div.selected {
        border: 2px solid #0f97bd;
    }
    [select] [caret] {
        float: right;
        margin-top: 15px;
        margin-right: 5px;
        font-size: small;
    }
    [select][img] {
        padding: 0;
    }
`

}

},{"../utils":12}],8:[function(require,module,exports){
const { is } = require('./utils')

class History {

    constructor() {
        this.i = 0
        this.content = []
    }
    
    back() {
        if (this.i > 0) navTo(this.content[--(this.i)])
    }
    forth() {
        if (this.i < this.content.length) navTo(this.content[++(this.i)])
    }
    push(page) {
        this.content.splice(this.i, null, page)
        this.i++
    }
}


class Pager {

    constructor(id, results, page_size) {
        this.id = id
        if ( !is.string(id) ) return rasti.error('Pager id must be a string')
        this.logid = `Pager for template [${ this.id }]:`
        if ( !is.array(results) ) return rasti.error('%s Results must be an array', this.logid)
        if ( !is.number(page_size) ) return rasti.error('%s Page size must be a number', this.logid)
        this.results = results
        this.sizes = [5, 10, 20]
        this.page_size = page_size
        this.page = 0
        this.total = Math.ceil(this.results.length / this.page_size)

    }

    next() {
        if (this.hasNext()) this.page++
        else rasti.warn('%s No next page', this.logid)
        return this.getPageResults(this.page)
    }

    prev() {
        if (this.hasPrev()) this.page--
        else rasti.warn('%s No previous page', this.logid)
        return this.getPageResults(this.page)
    }

    hasNext() {
        return this.results.length > this.page * this.page_size
    }

    hasPrev() {
        return this.page > 1
    }

    setPageSize(size) {
        size = parseInt(size)
        if ( !is.number(size) ) return rasti.error('%s Must specify a number as the page size', this.logid)
        this.page_size = size
        this.page = 0
        this.total = Math.ceil(this.results.length / this.page_size)
    }

    getPageResults(page) {
        if ( !is.number(page) ) {
            rasti.error('%s Must specify a page number to get results from', this.logid)
            return []
        }
        try {
            var i = (page -1) * this.page_size
            return this.results.slice(i, i + this.page_size)
        }
        catch(err) {
            rasti.error('%s Could not get results of page %s, error:', this.logid, page, err)
            return []
        }
    }

}

module.exports = {
    History,
    Pager,
}

},{"./utils":12}],9:[function(require,module,exports){
// prototype extensions
Array.prototype.remove = function(el) {
    var i = this.indexOf(el);
    if (i >= 0) this.splice(i, 1);
}

String.prototype.capitalize = function() {
    return this.length && this[0].toUpperCase() + this.slice(1).toLowerCase()
}


// $ extensions
$.fn.move = function(options) {
    var options = Object.assign({
            handle: this,
            container: this.parent()
        }, options),
        object = this,
        newX, newY,
        nadir = object.css('z-index'),
        apex = 100000,
        hold = 'mousedown touchstart',
        move = 'mousemove touchmove',
        release = 'mouseup touchend'

    if (!object[0].hasAttribute('move')) object.attr('move', '')

    options.handle.on(hold, function(e) {
        if (e.type == 'mousedown' && e.which != 1) return
        object.css('z-index', apex)
        var marginX = options.container.width() - object.width(),
            marginY = options.container.height() - object.height(),
            oldX = object.position().left,
            oldY = object.position().top,
            touch = e.touches,
            startX = touch ? touch[0].pageX : e.pageX,
            startY = touch ? touch[0].pageY : e.pageY

        $(window)
            .on(move, function(e) {
                var touch = e.touches,
                    endX = touch ? touch[0].pageX : e.pageX,
                    endY = touch ? touch[0].pageY : e.pageY
                newX = Math.max(0, Math.min(oldX + endX - startX, marginX))
                newY = Math.max(0, Math.min(oldY + endY - startY, marginY))

                window.requestAnimationFrame
                    ? requestAnimationFrame(setElement)
                    : setElement()
            })
            .one(release, function(e) {
                e.preventDefault()
                object.css('z-index', nadir)
                $(this).off(move).off(release)
            })

        e.preventDefault()
    })

    return this

    function setElement() {
        object.css({top: newY, left: newX});
    }
}

},{}],10:[function(require,module,exports){
(function (global){
require('./extensions')
const { History, Pager, createState } = require('./components')
const utils = require('./utils')
const { is, type, sameType } = utils
const themes = require('./themes')

const options = {
    persist : false,
    history : false,
    root    : '',
    theme   : 'base',
    lang    : '',
    stats   : '%n results in %t seconds',
    noData  : 'No data available',
    imgPath : 'img/',
    imgExt  : '.png',
}

const breakpoints = {
    phone : 500,
    tablet : 800,
}
const media = {}
for (var device in breakpoints) {
    media[device] = window.matchMedia(`(max-width: ${ breakpoints[device] }px)`).matches
}

const log = (...params) => {
    if (rasti.options.log.search(/debug/i) != -1) console.log.call(this, ...params)
}
const warn = (...params) => {
    if (rasti.options.log.search(/(warn)|(debug)/i) != -1) console.warn.call(this, ...params)
}
const error = (...params) => {
    console.error.call(this, ...params)
}


function rasti(name, container) {

    const errPrefix = 'Cannot create rasti app: '

    if ( !is.string(name) ) return error(errPrefix + 'app must have a name!')

    this.name = name.replace(' ', '')

    if ( !container ) {
        container = $('body')
    }
    else if ( !(container.selector) ) {
        if ( is.string(container) || (container.tagName && 'BODY DIV'.search(container.tagName) != -1) ) container = $(container)
        else return error(errPrefix + 'app container is invalid. Please provide a selector string, a jQuery object ref or a DOM element ref')
    }
    container.attr('rasti', this.name)
    
    const self = this

    let invalidData = 0


    // private properties  

    this.active = {
        page  : null,
        theme : '',
        lang  : '',
    }

    this.pagers = new Map()


    // public properties

    this.options = Object.assign({}, options)
    this.defaults = {
        stats : self.options.stats,
        noData : self.options.noData,
    }
    this.state = createState()

    this.pages = {}
    this.data = {}
    this.ajax = {}
    this.utils = {}
    this.templates = {}
    this.langs = {}

    this.themes = themes.themes
    this.themeMaps = themes.themeMaps

    // methods

    function extend(props) {
        if (!props || !is.object(props)) return error('Cannot extend app: no properties found')
        for (var key in self) {
            if ($.type(self[key]) === 'object' && $.type(props[key]) === 'object')
                Object.assign(self[key], props[key])
        }
    }


    function init(options) {
        var initStart = window.performance.now()
        log('Initializing app [%s]...', self.name)

        container.addClass('big loading backdrop')

        // cache options
        if (options) {
            if ( !is.object(options) ) warn('Init options must be an object!')
            else Object.keys(self.options).forEach( key => {
                if (options[key]) {
                    if ( !sameType(self.options[key], options[key])  ) warn('Init option [%s] is invalid', key)
                    else self.options[key] = options[key]
                }
            })
        }


        // apply defaults
        Object.keys(self.defaults).forEach( key => {
            if (!self.options[key]) self.options[key] = self.defaults[key]
        })
        

        // define lang (if not already defined)
        if (!self.options.lang) {
            keys = Object.keys(self.langs)
            if (keys.length) self.options.lang = keys[0]
        }


        // append theme style container
        container.append('<style theme>')


        // append page-options containers
        container.find('[page]').each( (i, el) => {
            $(el).append('<div class="page-options">')
        })


        // init rasti blocks
        container.find('[block]').each( (i, el) => {
            initBlock($(el))
        })


        // create items for selects and lists with data source
        container.find('select[data]')
            .add('ol[data]', container)
            .add('ul[data]', container)
            .each( (i, el) => {
                updateBlock($(el))
            })


        // create tabs
        container.find('.tabs').each( (i, el) => {
            createTabs($(el))
        })
        if (media.tablet || media.phone) container.find('.tabs-tablet').each( (i, el) => {
            createTabs($(el))
        })
        if (media.phone) container.find('.tabs-phone').each( (i, el) => {
            createTabs($(el))
        })


        // add close btn to modals
        container.find('[modal]').each( (i, el) => {
            $('<div icon=close class="top right" />')
            .on('click', e => {
                $(e.target).parent().hide()
                self.active.page.find('.backdrop').removeClass('backdrop')
            })
            .appendTo(el)
        })


        // init field validations
        container.find('[validate]').each( (i, btn) => {
            btn.disabled = true
            var $container = $(btn).parent()
            var fields = $container.find('[field][required]')
            fields.each( (i, field) => {
                var invalid = field.validity && !field.validity.valid
                field.classList.toggle('error', invalid)
                $(field).change( e => {
                    invalid = field.validity && !field.validity.valid
                    field.classList.toggle('error', invalid)
                    btn.disabled = $container.find('[field].error').length
                })
            })
        })


        // init nav
        container.find('[nav]').click( e => {
            var $el = $(e.target),
                page = $el.attr('nav'),
                params = {}

            if (!page) return error('Missing page name in [nav] attribute of element:', el)

            if (e.target.hasAttribute('params')) {
                var $page = self.active.page,
                    paramkeys = $el.attr('params'),
                    $paramEl
                if (paramkeys) {
                    // get specified params
                    paramkeys = paramkeys.split(' ')
                    paramkeys.forEach( key => {
                        $paramEl = $page.find('[navparam='+ key +']')
                        if ($paramEl.length) params[key] = $paramEl.val()
                        else warn('Could not find navparam element [%s]', key)
                    })
                }
                else {
                    // get all params
                    $page.find('[navparam]').each( (i, el) => {
                        $el = $(el)
                        key = resolveAttr($el, 'navparam')
                        if (key) params[key] = $el.val()
                    })
                }
            }
            navTo(page, params)
        })


        // init submit
        container.find('[submit]').click( e => {
            var $el = $(e.target),
                method = $el.attr('submit'),
                callback = $el.attr('then'),
                template = $el.attr('render'),
                isValidCB = callback && is.function(self.utils[callback]),
                start = window.performance.now(), end

            if (!method) return error('Missing ajax method in [submit] attribute of el:', this)

            if (callback && !isValidCB) error('Undefined utility method [%s] declared in [then] attribute of el:', callback, this)
            
            $el.addClass('loading').attr('disabled', true)

            submitAjax(method, resdata => { 
                var time = Math.floor(window.performance.now() - start) / 1000
                log('Ajax method [%s] took %s seconds', method, time)

                if (isValidCB) self.utils[callback](resdata)
                if (template) render(template, resdata, time)

                $el.removeClass('loading').removeAttr('disabled')
            })
        })


        // init render
        container.find('[render]').not('[submit]').click( e => {
            var $el = $(e.target),
                template = $el.attr('render')
            if (!template) return error('Missing template name in [render] attribute of element:', el)
            render(template)
        })


        // init deps
        container.find('[deps]').each( (i, el) => {
            var $el = $(el)
            var deps = $el.attr('deps')
            if (deps) deps.split(' ').forEach( field => {
                $el.closest('[page]').find('[field='+ field +']')
                    .change( e => { updateBlock($el) })
            })
        })


        // init actions
        for (var action of 'click change hover load'.split(' ')) {
            container.find('[on-'+ action +']').each( (i, el) => {
                var $el = $(el),
                    methodName = $el.attr('on-' + action)
                if ( !methodName ) return error('Missing utility method in [%s] attribute of element:', action, el)
                var method = self.utils[methodName]
                if ( !method ) return error('Undefined utility method "%s" declared in [on-%s] attribute of element:', methodName, action, el)
                $el.on(action, method)
                   .removeAttr('on-' + action)
            })
        }
        for (var action of 'show hide toggle'.split(' ')) {
            container.find('['+ action +']').each( (i, el) => {
                var $el = $(el),
                    $page = $el.closest('[page]'),
                    targetSelector = $el.attr(action)
                if ( !targetSelector ) return error('Missing target selector in [%s] attribute of element:', action, el)
                var $target = $page.find('['+targetSelector+']')
                if ( !$target.length ) $target = container.find('['+targetSelector+']')
                if ( !$target.length ) return error('Could not find target [%s] declared in [%s] attribute of element:', targetSelector, action, el)
                $el.on('click', e => {
                        if ($target[0].hasAttribute('modal')) $page.find('.page-options').addClass('backdrop')
                        $target[action]()
                    })
                    .removeAttr(action)
            })
        }


        // init move
        container.find('.move').each( (i, el) => {
            $(el).move()
        })


        // init collapse
        container.find('.collapse').on('click', e => {
            this.classList.toggle('folded')
        })


        // init pages
        var page, $page
        for (var name in self.pages) {
            page = self.pages[name]
            if ( !is.object(page) ) return error('pages.%s must be an object!', name)
            $page = container.find('[page='+ name +']')
            if ( !$page.length ) return error('No container found for page "%s". Please bind one via [page] attribute', name)
            if (page.init) {
                if ( !is.function(page.init) ) return error('pages.%s.init must be a function!', name)
                else {
                    log('Initializing page [%s]', name)
                    self.active.page = $page // to allow app.get() etc in page.init
                    page.init()
                }
            }
        }
        self.active.page = null // must clear it in case it was assigned


        // resolve empty attributes
        'header label text placeholder'.split(' ').forEach( attr => {
            var $el
            container.find('['+attr+'=""]').each( (i, el) => {
                $el = $(el)
                $el.attr( attr, resolveAttr($el, attr) )
            })
        })


        // resolve bg imgs
        container.find('[img]').each( (i, el) => {
            var path = el.getAttribute('img') || resolveAttr($(el), 'img')
            if (path.indexOf('/')==-1) path = self.options.imgPath + path
            if (path.charAt(path.length-4)!='.') path += self.options.imgExt
            el.style['background-image'] = `url(${path})`
        })


        // fix labels
        'input select textarea'.split(' ').forEach( tag => {
            container.find(tag + '[label]').each( (i, el) => {
                fixLabel($(el))
            })
        })


        // fix icons
        container.find('input[icon]').each( (i, el) => {
            fixIcon($(el))
        })


        // bind nav handler to popstate event
        window.onpopstate = e => {
            var page = e.state || location.hash.substring(1)
            page
                ? e.state ? navTo(page, null, true) : navTo(page)
                : navTo(self.options.root)
        }


        // init history (if applicable)
        if (self.options.history) initHistory()


        // restore and persist state (if applicable)
        var restored
        if (self.options.persist) {
            restored = self.state.restore()
            $(window).on('beforeunload', e => { self.state.save() })
        }

        if ( !self.options.persist || !restored ) {

            // set lang (if applicable and not already set)
            if ( self.options.lang && !self.active.lang ) setLang(self.options.lang)
            // if no lang, generate texts
            if ( !self.options.lang ) {
                container.find('[text]').each( (i, el) => {
                    $(el).text( $(el).attr('text') )
                })
            }

            // set theme (if not already set)
            if ( !self.active.theme ) setTheme(self.options.theme)

            // nav to page in hash or to root or to first page container
            var page = location.hash.substring(1) || self.options.root
            navTo(page && self.pages[page] ? page : container.find('[page]').first().attr('page'))
        }


        // init statefull elements
        container.find('[state]').each( (i, el) => {
            var $el = $(el)
            var prop = resolveAttr($el, 'state')

            if (!prop) return

            if (el.value !== undefined) {
                // it's an element
                bindElement($el, prop)
            }
            else {
                // it's a container
                $el.find('[field]').each( (i, el) => {
                    var $el = $(el)
                    var subprop = $el.attr('field')
                    if (subprop) bindElement($el, prop, subprop)
                })
            }

            function bindElement($el, prop, subprop){
                var root = self.state
                if (subprop) {
                    // go down one level
                    root[prop] = root[prop] || {}
                    root = root[prop]
                    prop = subprop
                }
                if ( root[prop] ) {
                    // update ui from restored state
                    $el.val( root[prop] )
                    if ( $el.attr('block') ) $el.trigger('change')
                }
                else root[prop] = ''
                $el.on('change', e => {
                    // update state on ui change
                    root[prop] = $el.val()
                })
            }
        })


        container
            .on('click', '.backdrop', e => {
                $(e.target).removeClass('backdrop')
                self.active.page.find('[modal]').hide()
            })
            .removeClass('big loading backdrop')

        var initTime = Math.floor(window.performance.now() - initStart) / 1000
        log('App [%s] initialized in %ss', self.name, initTime)

    }


    function get(selector) {
        var $els = self.active.page && self.active.page.find('['+ selector +']')
        if (!$els || !$els.length) $els = container.find('['+ selector +']')
        if (!$els.length) warn('No elements found for selector [%s]', selector)
        return $els
    }

    function set(selector, value) {        
        var $els = get(selector)
        $els.each( (i, el) => {
            el.value = value
            $(el).change()
        })
        return $els
    }

    function add(selector, ...values) {
        var $els = get(selector)
        $els.each( (i, el) => {
            values.forEach( val => {
                if (is.array(val)) el.value = el.value.concat(val)
                else el.value.push(val)
            })
            $(el).change()
        })
        return $els
    }


    function navTo(pagename, params, skipPushState) {

        if (!pagename) return error('Cannot navigate, page undefined')

        var $prevPage = self.active.page,
            prevPagename = $prevPage && $prevPage.attr('page'),
            prevPage = prevPagename && self.pages[prevPagename]
        
        if (pagename == prevPagename) return

        var page = self.pages[pagename],
            $page = container.find('[page='+ pagename +']')

        if (!$page.length) return error('Cannot navigate to page [%s]: page container not found', pagename)

        if ($prevPage) $prevPage.removeClass('active')

        if (prevPage && prevPage.out) {
            !is.function(prevPage.out)
                ? warn('Page [%s] {out} property must be a function!', prevPagename)
                : prevPage.out(params)
        }

        self.active.page = $page

        if ( params && !is.object(params) ) warn('Page [%s] nav params must be an object!', pagename)
        if (page && page.in) {
            !is.function(page.in)
                ? warn('Page [%s] {in} property must be a function!', pagename)
                : page.in(params)
        }

        $page.addClass('active')

        container
            .find('nav [nav]').removeClass('active')
            .filter('[nav='+ pagename +']').addClass('active')

        container.trigger('rasti-nav')

        if (skipPushState) return
        if (page && page.url) {
            !is.string(page.url)
                ? warn('Page [%s] {url} property must be a string!', pagename)
                : window.history.pushState(pagename, null, '#'+page.url)
        }
        else {
            window.history.pushState(pagename, null)
        }
    }


    function render(name, data, time) {
        var template = self.templates[name], html,
            errPrefix = 'Cannot render template [%s]: '
        if (!template) return error(errPrefix + 'template is not defined', name)

        if (is.string(template)) {
            html = template
            template = (data, lang) => data.map( obj => html ).join()
        }

        if (!is.function(template)) return error(errPrefix + 'template must be a string or a function', name)

        var $el = container.find('[template='+ name +']')
        if (!$el.length) return error(errPrefix + 'no element bound to template. Please bind one via [template] attribute.', name)
        var el = $el[0]

        if (!data) {
            var datakey = $el.attr('data')
            if (!datakey) return error(errPrefix + 'no data found for template. Please provide in ajax response or via [data] attribute in element:', name, el)
            data = self.data[datakey]
            if (!data) return error(errPrefix + 'undefined data source "%s" in [data] attribute of element:', name, datakey, el)
        }

        if ( is.string(data) ) data = data.split(', ')
        if ( !is.array(data) ) return error(errPrefix + 'invalid data provided, must be a string or an array', name)

        if (!data.length) return $el.html(`<div msg center textc>${ self.options.noData }</div>`)

        var paging = $el.attr('paging')
        var lang = self.langs && self.langs[self.active.lang]
        paging
            ? initPager($el, template, data, lang)
            : $el.html( template(data, lang) )
        if (el.hasAttribute('stats')) {
            var stats = $('<div section class="stats">')
            stats.html( self.options.stats.replace('%n', data.length).replace('%t', time) )
            $el.prepend(stats)
        }

        var fxkey = $el.attr('fx')
        if (fxkey) {
            var fx = rasti.fx[fxkey]
            if (!fx) return warn('Undefined fx "%s" in [fx] attribute of element', fxkey, el)
            paging ? fx($el.find('.results')) : fx($el)
        }

    }


    function setTheme(themeString) {
        var themeName = themeString.split(' ')[0],
            theme = self.themes[themeName],
            baseTheme = self.themes.base,
            baseMap = self.themeMaps.dark

        if (!theme) return error('Cannot set theme [%s]: theme not found', themeName)

        var mapName = themeString.split(' ')[1] || ( is.object(theme.maps) && Object.keys(theme.maps)[0] ) || 'dark',
            themeMap = ( is.object(theme.maps) && theme.maps[mapName] ) || self.themeMaps[mapName]

        if (!themeMap) {
            warn('Theme map [%s] not found, using default theme map [dark]', mapName)
            themeMap = baseMap
            mapName = 'dark'
        }

        log('Setting theme [%s:%s]', themeName, mapName)
        self.active.theme = themeName
        
        var values = {
            font : theme.font || baseTheme.font,
        }, colorNames, colors, c1, c2, defaultColorName

        // clone themeMap
        themeMap = Object.assign({}, themeMap)

        // map palette colors to attributes
        for (var attr of Object.keys(baseMap)) {
            colorNames = themeMap[attr] || baseMap[attr]
            colorNames = [c1, c2] = colorNames.split(' ')
            colors = [theme.palette[ c1 ], theme.palette[ c2 ]]

            for (var i in colors) {
                defaultColorName = baseMap[attr].split(' ')[i]
                if (defaultColorName && !colors[i]) {
                    colors[i] = baseTheme.palette[ colorNames[i] ]
                    if (!colors[i]) {
                        warn('Mapping error in theme [%s] for attribute [%s]. Color [%s] not found. Falling back to default color [%s].', themeName, attr, colorNames[i], defaultColorName)
                        colors[i] = baseTheme.palette[ defaultColorName ]
                    }
                }
            }

            values[attr] = colors
            if (themeMap[attr]) delete themeMap[attr]
        }

        var invalidKeys = Object.keys(themeMap)
        if (invalidKeys.length) warn('Ignored %s invalid theme map keys:', invalidKeys.length, invalidKeys)

        // generate theme style and apply it
        container.find('style[theme]').html( getThemeStyle(values) )

        // apply bg colors
        var colorName, color
        container.find('[bg]').each( (i, el) => {
            colorName = el.getAttribute('bg')
            color = theme.palette[colorName] || baseTheme.palette[colorName]
            if (color) el.style['background-color'] = color
            else warn('Invalid color [%s] declared in el:', colorName, el)
        })
    }


    function setLang(langName) {
        var lang = self.langs[ langName ],
            errPrefix = 'Cannot set lang [%s]: '

        if (!lang) return error(errPrefix + 'lang not found', langName)
        if ( !is.object(lang) ) return error(errPrefix + 'lang must be an object!', langName)

        log('Setting lang [%s]', langName)
        self.active.lang = langName

        var $elems = $(), $el, keys, string
        var attributes = 'label header text placeholder'.split(' ')

        attributes.forEach( attr => {
            $elems = $elems.add('['+attr+']')
        })

        $elems.each( (i, el) => {
            if (el.hasAttribute('fixed')) el = el.children[0]
            $el = $(el)   
            keys = el.langkeys

            if (!keys) {
                keys = {}
                attributes.forEach( attr => {
                    if ($el.attr(attr)) keys[attr] = $el.attr(attr)
                })
                el.langkeys = keys
            }

            for (var attr in keys) {
                string = getString(langName, keys[attr])
                attr === 'text'
                    ? $el.text(string || keys[attr])
                    : string ? $el.attr(attr, string) : null
            }
        })

        Object.keys(self.defaults).forEach( key => {
            self.options[key] = lang['rasti_'+key] || self.defaults[key]
        })
    }


    function updateBlock($el, data) {
        var types = {
            SELECT : 'select',
            OL : 'list',
            UL : 'list',
        }
        var el = $el[0]
        var type = types[el.nodeName] || $el.attr('block')
        if (!type) return error('Missing block type in [block] attribute of element:', el)
        
        var block = rasti.blocks[type]
        if (!block) return error('Undefined block type "%s" resolved for element:', type, el)
        
        if (!data) {
            var datakey = resolveAttr($el, 'data')
            if (!datakey) return

            data = self.data[datakey]
            if (!data) return error('Undefined data source "%s" resolved for element:', datakey, el)
        }

        // TODO: this should be in multi block, not here
        var $options = type === 'multi'
            ? $el.closest('[page]').find('[options='+ $el.attr('field') +']')
            : $el

        var deps = $el.attr('deps')
        var depValues = {}
        if (deps) deps.split(' ').forEach( field => {
            depValues[field] = get('field='+field).val()
        })

        is.function(data)
            ? data(render, depValues)
            : render(data)
        
        function render(data) {
            if ( is.string(data) ) data = data.split(', ')
            $options.html( block.template(data, $el) )

            if (invalidData) {
                var field = $el.attr('field'),
                    page = $el.closest('[page]').attr('page')
                warn('Detected %s invalid data entries for field [%s] in page [%s]', invalidData, field, page)
                invalidData = 0
            }
        }


    }


    function toggleFullScreen(e) {
        var prefixes = 'moz webkit'.split(' ')
        prefixes.forEach( p => {
            if ( ! (p + 'FullscreenElement' in document) ) return
            if ( !document[ p + 'FullscreenElement' ]) {
                document.documentElement[ p + 'RequestFullScreen' ]();
            }
            else if (document[ p + 'CancelFullScreen' ]) {
                document[ p + 'CancelFullScreen' ]();
            }
        })
    }


    // internal utils

    function createState() {
        return Object.defineProperties({}, {
            page  : { get : () => self.active.page.attr('page'), enumerable : true },
            theme : { get : () => self.active.theme, enumerable : true },
            lang  : { get : () => self.active.lang, enumerable : true },
            save : { value : () => {
                localStorage.setItem('rasti.' + self.name, JSON.stringify(self.state))
                log('State saved')
            } },
            get : { value : () => {
                var state
                try {
                    state = JSON.parse( localStorage.getItem('rasti.' + self.name) )
                    if ( !state ) log('No saved state found for app [%s]', self.name)
                    else if ( !is.object(state) ) invalid()
                    else return state
                }
                catch(err) {
                    invalid()
                }

                function invalid() {
                    error('Saved state for app [%s] is invalid', self.name)
                }
            } },
            restore : { value : () => {
                var state = self.state.get()
                if (state) {
                    log('Restoring state...')
                    for (let prop in state) {
                        self.state[prop] = state[prop]
                    }
                    if (state.theme) setTheme(state.theme)
                    if (state.lang) setLang(state.lang)
                    navTo(state.page)
                    log('State restored')
                }
                return state
            } },
            clear : { value : () => {
                localStorage.removeItem('rasti.' + self.name)
            } },
        })
    }


    function createTabs($el) {
        var el = $el[0],
            $tabs = el.hasAttribute('page')
                ? $el.children('[panel]:not([modal])')
                : el.hasAttribute('panel')
                    ? $el.children('[section]:not([modal])')
                    : undefined
        if (!$tabs) return error('[tabs] attribute can only be used in pages or panels, was found in element:', el)

        var $labels = $('<div class="tab-labels">'),
            $bar = $('<div class="bar">'),
            $tab, label, position

        $tabs.each( (i, tab) => {
            $tab = $(tab)
            $tab.attr('tab', i)
            label = resolveAttr($tab, 'tab-label') || 'TAB ' + (i+1)

            $labels.append($(`<div tab-label=${i} text="${ label }">`))
        })

        $labels.append($bar).prependTo($el)
        var $flow = $tabs.wrapAll('<div h-flow>').parent()

        $labels.on('click', e => {
            var $label = $(e.target),
                tabnr = $label.attr('tab-label'),
                $tab = $tabs.filter(`[tab="${ tabnr }"]`)

            $tabs.removeClass('active')
            $tab.addClass('active')[0].scrollIntoView()

            $labels.children().removeClass('active')
            $label.addClass('active')
            
        })

        $flow.on('scroll', e => {
            position = this.scrollLeft / this.scrollWidth
            $bar.css({ left : position * this.offsetWidth })
        })

        container.on('rasti-nav', e => {
            if (!isInActivePage($el)) return
            $bar.css({ width : $flow[0].offsetWidth / $tabs.length })
            if (!$labels.children('.active').length) $labels.children().first().click()
        })

        $(window).on('resize', e => {
            if (!isInActivePage($el)) return
            $labels.find('.active').click()
            $bar.css({ width : $flow[0].offsetWidth / $tabs.length })
        })

        function isInActivePage($el) {
            return self.active.page.find($el).length
                || self.active.page.attr('page') === $el.attr('page')
        }

    }
    

    function initBlock($el) {
        var el = $el[0]
        var type = el.nodeName == 'SELECT' ? 'select' : $el.attr('block')
        if (!type) return error('Missing block type in [block] attribute of element:', el)
        
        var block = rasti.blocks[type]
        if (!block) return error('Undefined block type "%s" declared in [block] attribute of element:', type, el)

        block.init($el)

        // if applicable, create options from data source
        if (el.hasAttribute('data')) updateBlock($el)
    }


    function initHistory() {
        self._history = new History()

        Object.defineProperty(self, 'history', { get: () => self._history.content })
        Object.defineProperties(self.history, {
            back : { value : self._history.back },
            forth : { value : self._history.forth },
        })
    }


    function initPager($el, template, data, lang) {
        var name = $el.attr('template'),
            fx = $el.attr('fx') && rasti.fx[$el.attr('fx')],
            page_size = parseInt($el.attr('paging')),
            pager = newPager(name, data, page_size),
            paging, columns, sizes, col=1, size=0

        if ($el[0].hasAttribute('columns')) columns = `<button btn icon=columns />`

        if (pager.total > 1) paging = `<div class="paging ib ib_">
                <button btn icon=prev />
                <span class="page" />
                <button btn icon=next />
            </div>`

        sizes = `<button btn icon=rows />`

        $el.html(`
            <div class="results scrolly"></div>
            <div class="controls floatcx bottom ib_">
                ${ columns || '' }
                ${ paging || '' }
                ${ sizes }
            </div>
        `)

        $controls = $el.children('.controls')
        $results = $el.children('.results')

        $controls.on('click', '[icon=next]', e => {
            update( pager.next() )
        })

        $controls.on('click', '[icon=prev]', e => {
            update( pager.prev() )
        })

        $controls.on('click', '[icon=rows]', e => {
            size += 1
            var newSize = pager.sizes[size % pager.sizes.length]
            pager.setPageSize(newSize)
            $(e.target).html(newSize)
            update( pager.next() )
            pager.total > 1
                ? $controls.find('.paging').show()
                : $controls.find('.paging').hide()
        })

        $controls.on('click', '[icon=columns]', e => {
            col = col+1 > 3 ? 1 : col+1
            $(e.target).html(col)
            $results.removeClass('columns-1 columns-2 columns-3')
                .addClass('columns-' + col)
        })

        $results.html( template(pager.next(), lang) )
        $controls.find('.page').html(pager.page + '/' + pager.total)

        function update(data){
            $results.html( template(data, lang) )
            $controls.find('.page').html(pager.page + '/' + pager.total)
            if ( is.function(fx) ) fx($results)
        }
    }

    function getPager(id) {
        let pager = self.pagers.get(id)
        if (!pager) error('No pager found for template [%s]', id)
        return pager
    }
    function newPager(id, results, page_size) {
        let pager = new Pager(id, results, page_size)
        self.pagers.set(id, pager)
        return pager
    }
    function deletePager(pager) {
        if (!pager || !pager.id) return
        self.pagers.delete(pager.id)
    }


    function submitAjax(method, callback) {
        var ajax = self.ajax[ method ]
        if ( !is.function(ajax) ) return error('Ajax method ['+ method +'] is not defined')

        var $form = container.find('[ajax='+ method +']')
        if (!$form.length) return error('No container element bound to ajax method [%s]. Please bind one via [ajax] attribute', method)

        var reqdata = {}, field
        $form.find('[field]').each( (i, el) => {
            $el = $(el)
            field = $el.attr('field')
            if (field) {
                reqdata[field] = $el.val() || $el.attr('value')
            }
        })

        ajax(reqdata, callback)
    }


    function getThemeStyle(values) {
        var ns = `[rasti=${ self.name }]`
        return `
            ${ns} {
                font: ${ values.font };
                color: ${ values.text[0] };
                background-color: ${ values.page[0] };
            }
            ${ns} [page]    { background-color: ${ values.page[0] }; }
            ${ns} [panel]   { background-color: ${ values.panel[0] }; }
            ${ns} [section] { background-color: ${ values.section[0] }; }

            ${ns} [page][header]:before,
            ${ns} [page][footer]:after     { background-color: ${ values.page[1] }; }
            ${ns} [panel][header]:before   { background-color: ${ values.panel[1] }; }
            ${ns} [section][header]:before { background-color: ${ values.section[1] }; }

            ${ns} .tab-labels        { background-color: ${ values.panel[0] }; }
            ${ns} .tab-labels > .bar { background-color: ${ values.btn[0] }; }

            ${ns} [field] {
                background-color: ${ values.field[0] };
                color: ${ values.field[1] };
            }

            ${ns} [btn],
            ${ns} .btn,
            ${ns} [block=buttons] > div,
            ${ns} nav > div.active {
                background-color: ${ values.btn[0] };
                color: ${ values.btn[1] }; 
            }

            ${ns} [header]:before { color: ${ values.header[0] }; }
            ${ns} [label]:not([header]):before  { color: ${ values.label[0] }; }
        `
    }


    function getString(lang, key) {
        if ( !is.object(self.langs[lang]) ) {
            error('Lang [%s] is not defined', lang)
            return
        }
        var string = self.langs[lang][key]
        if ( !is.string(string) ) warn('Lang [%s] does not contain key [%s]', lang, key)
        else return string
    }


    function resolveAttr($el, name) {
        var value = $el.attr(name) || $el.attr('field') || $el.attr('nav') ||  $el.attr('section') || $el.attr('panel') || $el.attr('page')
        if (!value) warn('Could not resolve value of [%s] attribute in el:', name, $el[0])
        return value
    }


    function fixLabel($el) {
        var $div = $(`<div fixed label="${ $el.attr('label') }" >`)
        $el.wrap($div)
        $el[0].removeAttribute('label')
    }


    function fixIcon($el) {
        var $div = $(`<div icon=${ $el.attr('icon') } class=floating >`)
        $el.wrap($div)
        $el[0].removeAttribute('icon')
    }


    function setImg($el, basepath) {
        $el.css('background-image', 'url('+ basepath + ($el.val() || $el.attr('value')) +'.png)')
    }


    // api

    return Object.freeze({
        // objects
        options : this.options,
        history : this.history,
        state : this.state,
        pages : this.pages,
        data : this.data,
        ajax : this.ajax,
        utils : this.utils,
        langs : this.langs,
        themes : this.themes,
        themeMaps : this.themeMaps,
        templates : this.templates,

        // methods
        extend,
        init,
        get,
        set,
        add,
        navTo,
        render,
        setLang,
        setTheme,
        updateBlock,
        toggleFullScreen,
    })

}


// static properties and methods
rasti.log = log
rasti.warn = warn
rasti.error = error
rasti.utils = utils
rasti.blocks = require('./blocks/all')
rasti.fx = {

    stack : $el => {
        $el.children().each( (i, el) => {
            setTimeout( () => {
                el.style.opacity = 1
                el.style.marginTop = '15px'
            }, i * 50);
        })
    },

}
rasti.options = {log : 'debug'}

module.exports = Object.freeze(rasti)



// bootstrap any apps defined via rasti attribute
function bootstrap() {
    var appContainers = $(document).find('[rasti]'),
        appName, app, extendProps

    if (appContainers.length) appContainers.forEach( el => {
        appName = el.getAttribute('rasti')
        if (!appName) error('Missing app name in [rasti] attribute of app container:', el)
        else if (global[appName]) error('Name [%s] already taken, please choose another name for app in container:', appName, el)
        else {
            global[appName] = app = new rasti(appName, el)
            Object.keys(app.options).forEach( key => {
                if (el.hasAttribute(key)) {
                    app.options[key] = el.getAttribute(key)
                    // non-value boolean attributes are true
                    if (is.boolean(options[key]) && !app.options[key]) app.options[key] = true
                }
            })
            log('Created rasti app [%s]', appName)
        }
    })
}


function genBlockStyles() {
    var styles = '<style blocks>'
    for (var key in rasti.blocks) {
        styles += rasti.blocks[key].style
    }
    styles += '</style>'
    $('head').prepend(styles)
}


$('head').prepend(`<style>body {
    margin: 0;
}
*, *:before, *:after {
    box-sizing: border-box;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    transition: background-color 0.2s;
}
h1 { font-size: 4em; }
h2 { font-size: 3em; }
h3 { font-size: 2em; }
h4 { font-size: 1.5em; }
p.big { font-size: 1.5em; }

[page], [panel], [section] {
    position: relative;
    overflow: hidden;    
}

[page] {
    min-height: 100vh;
    width: 100vw !important;
    padding-bottom: 15px;
    margin-bottom: -5px;
    overflow-y: auto;
}
[page]:not(.active) {
	display: none !important;
}
nav ~ [page] {
    min-height: calc(100vh - 50px);
    max-height: calc(100vh - 50px);
}

[panel] {
    padding: 25px;
    border-radius: 4px;
}


[section] {
    margin-bottom: 15px;
    padding: 20px;
    border-radius: 4px;
}
[section] [label]:before {
    text-shadow: 0 0 0 #000;
}
[section]>*:first-child:not([label]) {
    margin-top: 0px;
}


[header][panel] {
    padding-top: 75px;
}
[header][section] {
    padding-top: 65px;
}
[header][page]:before,
[header][panel]:before,
[header][section]:before,
[footer][page]:after {
    content: attr(header);
    display: block;
    height: 70px;
    width: 100%;
    padding: 20px;
    line-height: 30px;
    font-size: 2.5em;
    text-align: center;
    text-transform: uppercase;
}
[header][page]:before {
    margin-bottom: 15px;
}
[header][panel]:before,
[header][section]:before {
    position: absolute;
    top: 0; left: 0;
}
[header][panel]:before {
    height: 50px;
    padding: 10px 20px;
    line-height: 30px;
    font-size: 2em;
}
[header][section]:before {
    height: 40px;
    padding: 10px;
    line-height: 20px;
    font-size: 1.5em;
}
[header].collapse:before {
    cursor: pointer;
}

[footer][page]:after {
    content: attr(footer);
}

[page][header][fix-header]:before {
    position: fixed;
    top: 0;
}
[page][footer][fix-footer]:after {
    position: fixed;
    bottom: 0;
}


[field] {
    min-height: 35px;
    width: 100%;
    padding: 5px 10px;
    border: 0;
    font-size: inherit;
}
[field], [btn] {
    border-radius: 2px;
    outline: none;
    font-family: inherit !important;
}
[btn] {
    display: inline-block;
    height: 50px;
    width: auto;
    min-width: 50px;
    padding: 10px 20px;
    border: 1px solid rgba(0,0,0,0.1);
    font-size: 1.2em;
    text-align: center;
    text-decoration: none;
    text-transform: uppercase;
}
[btn], [nav] {
	cursor: pointer;
}
[btn]:not(:disabled):hover {
    filter: contrast(1.5);
}
[btn]:disabled {
    filter: contrast(0.5);
    cursor: auto;
}
[panel] [field], [panel] [btn], [panel] [label],
[section] [field], [section] [btn], [section] [label] {
    margin-bottom: 15px;
}


.big[field], .big[btn],
.big [field], .big [btn] {
    min-height: 70px;
    margin-bottom: 25px;
    font-size: 1.5em;
}

.small[field], .small[btn],
.small [field], .small [btn] {
    height: 25px;
    margin-bottom: 15px;
    font-size: 1em;
}

.big [label]{
    margin-top: 25px;
    font-size: 1.2em;
}
.big [label]:before {
    margin-top: -27px;
}
.big [label][field]:before {
    margin-top: -25px;
}


[img] {
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    background-origin: content-box;
}


[template] > .results {
    max-height: calc(100% - 40px);
    margin: 0 -15px;
    padding: 0 15px;
}
[template][stats] > .results {
    max-height: calc(100% - 95px);
}
[template] > .controls {
    height: 60px;
    padding: 5px;
    color: #fff;
    text-align: center;
}
[template] > .controls * {
    vertical-align: middle;
}
[template] > .stats {
    height: 40px;
    padding: 10px;
    font-size: 1.1em;
}


[h-flow] {
    display: inline-block !important;
    white-space: nowrap;
    height: 100%;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
}
[h-flow] > * {
    display: inline-block;
    white-space: normal;
    height: 100%;
    min-width: 100%;
    border-radius: 0;
    margin-top: 0;
    margin-bottom: 0;
    margin-left: auto !important;
    margin-right: auto;
    vertical-align: top;
}
.tab-labels + [h-flow] {
    height: calc(100vh - 50px);
}
nav ~ [page] > .tab-labels + [h-flow] {
    height: calc(100vh - 100px);
}

nav, .tab-labels {
    display: flex;
    position: relative;
    white-space: nowrap;
    min-width: 100vw;
    height: 50px;
    padding: 0;
    border-bottom: 1px solid rgba(0,0,0,0.2);
    border-radius: 0;
    text-transform: uppercase;
}
.tab-labels {
    justify-content: space-around;
}
.tab-labels > .bar {
    position: absolute;
    bottom: 0; left: 0;
    height: 4px;
    transition: left 0.2s, width 0.2s;
}
nav > div, [tab-label] {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1 1 auto;
    height: 100%;
    min-width: 50px;
    padding: 5px;
    font-size: 1.4em;
    text-shadow: 0 0 0 #000;
    cursor: pointer;
}
nav > div {
    max-width: 200px;
    border-right: 1px solid rgba(0,0,0,0.2);
}
[tab-label].active {
    filter: contrast(1.5);
}


[modal], .modal {
    display: none;
    position: fixed;
    left: 0; right: 0; top: 0; bottom: 0;
    margin: auto !important;
    height: 100%;
    width: 100%;
    max-height: 500px;
    max-width: 500px;
    overflow-y: auto;
    animation: zoomIn .4s, fadeIn .4s;
    z-index: 11;
}
[modal] > [icon=close],
.modal > [icon=close] {
    cursor: pointer;
}


.backdrop:before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background: rgba(0,0,0,.7);
    animation: fadeIn .4s;
    z-index: 10;
}


[label] {
    position: relative;
    margin-top: 25px;
    vertical-align: bottom;
}
[label][fixed]>* {
    margin-bottom: 0;
}
[label]>input,
[label]>select,
[label]>textarea {
    margin-top: 0 !important;
}
[label]:not([panel]):not([section]):before {
    content: attr(label);
    position: absolute;
    height: 35px;
       line-height: 35px;
    font-size: 1.2em;
    text-transform: capitalize;
}
[label]:before {
    margin-top: -35px;
    margin-left: -8px;
}
[label][fixed]:before {
    margin-top: -30px;
    margin-left: 4px;
}
[label][field].big:before {
    margin-left: 0;
}
.inline[label],
.inline_ > [label] {
    width: auto;
    margin-top: 0;
    margin-left: calc(40% + 10px);
}
.inline[label]:before,
.inline_ > [label]:before {
    width: 80%;
    left: -80%;
    margin-top: -5px;
    text-align: right;
}
.inline[label][fixed]:before,
.inline_ > [label][fixed]:before {
    margin-top: 0;
    margin-left: -8px;
}
.below[label]:before,
.below_ > [label]:before {
    bottom: -40px;
    left: 0;
    right: 0;
    margin-top: 0;
    margin-left: 0;
}


select[field] {
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
}

textarea[field] {
    height: 70px;
    resize: none;
}

input[field] {
    width: 100%;
    margin: 0;
    font-size: 1rem;
    vertical-align: text-bottom;
}
input[field]:focus:invalid {
    box-shadow: 0 0 0 2px red;
}
input[field]:focus:valid {
    box-shadow: 0 0 0 2px green;
}

input[type=radio],
input[type=checkbox] {
    display: none;
}
input[type=radio] + label,
input[type=checkbox] + label {
    display: block;
    height: 40px;
    max-width: 90%;
    padding: 12px 0;
    margin-left: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
}
input[type=radio] + label:before,
input[type=checkbox] + label:before {
    content: '\\2713';
    position: absolute;
    height: 32px;
    width: 32px;
    margin-top: -8px;
    margin-left: -36px;
    border: 1px solid #999;
    color: transparent;
    background-color: #fff;
    font-size: 2.3em;
    line-height: 1;
    text-align: center;
}
input[type=radio] + label:before {
    content: '\\25cf';
    border-radius: 50%;
    line-height: 0.8;
}
input[type=radio]:checked + label:before,
input[type=checkbox]:checked + label:before {
    color: #222;
    animation: stamp 0.4s ease-out;
}
input[type=radio] + label:hover,
input[type=checkbox] + label:hover {
    font-weight: 600;
}
@keyframes stamp {
    50% { transform: scale(1.2); }
}


.row {
    display: flex;
    flex-flow: row wrap;
    align-content: flex-start;
    width: 100%;
}
.column {
    display: flex;
    flex-flow: column nowrap;
    min-height: min-content !important;
    align-content: flex-start;
    align-items: center;
}
.row > .col-1  { flex-basis: calc(08.33% - 15px); }
.row > .col-2  { flex-basis: calc(16.66% - 15px); }
.row > .col-3  { flex-basis: calc(25.00% - 15px); }
.row > .col-4  { flex-basis: calc(33.33% - 15px); }
.row > .col-5  { flex-basis: calc(41.66% - 15px); }
.row > .col-6  { flex-basis: calc(50.00% - 15px); }
.row > .col-7  { flex-basis: calc(58.33% - 15px); }
.row > .col-8  { flex-basis: calc(66.66% - 15px); }
.row > .col-9  { flex-basis: calc(75.00% - 15px); }
.row > .col-10 { flex-basis: calc(83.33% - 15px); }
.row > .col-11 { flex-basis: calc(91.66% - 15px); }
.row [class*=col-]:not(:first-child) { margin-left: 15px; }


.page-options {
    flex-basis: initial !important;
}

/* icons */

[icon] {
    flex-grow: 0;
    height: 50px;
    width: auto;
    min-width: 50px;
    font-size: 1.5rem;
    line-height: 2;
    text-align: center;
}
[icon]:before {
    filter: grayscale();
}
[icon].small {
    height: 30px;
    width: 30px;
    font-size: 1em;
}
[icon].big {
    height: 70px;
    width: 70px;
    font-size: 2.2em;
}
[icon].floating:before {
    position: absolute;
    margin-left: 10px;
    margin-top: -5px;
}
[icon].floating > input {
    padding-left: 45px;
}
[icon=options]:before { content: '⋯'; }
[icon=voptions]:before { content: '⋮'; }
[icon=menu]:before { content: '☰'; }
[icon=user]:before { content: '👤'; }
[icon=pass]:before,
[icon=lock]:before { content: '🔒'; }
[icon=file]:before { content: '📄'; }
[icon=folder]:before { content: '📂'; }
[icon=attach]:before,
[icon=clip]:before { content: '📎'; }
[icon=link]:before { content: '🔗'; }
[icon=edit]:before,
[icon=pen]:before { content: '✎'; }
[icon=warning]:before { content: '⚠'; }
[icon=error]:before { content: '⨂'; }/*𐌈*/
[icon=rows]:before { content: '𝌆'; }
[icon=columns]:before { content: '▥'; }
[icon=grid]:before { content: '▦'; }
[icon=spacedgrid]:before { content: '𝍖'; }
[icon=roundgrid]:before { content: '𐄡'; }
[icon=close]:before { content: '✕'; }
[icon=eject]:before { content: '⏏'; }
[icon=play]:before,
[icon=next]:before { content: '▶'; }
[icon=prev]:before { content: '◀'; }
[icon=pause]:before { content: 'Ⅱ'; }
[icon=stop]:before { content: '■'; }
[icon=rec]:before { content: '●'; }
[icon=timer]:before { content: '⏱'; }
[icon=clock]:before { content: '⏰'; }
[icon=cog]:before { content: '⚙'; }
[icon=flag]:before { content: '⚑'; }
[icon=clef]:before { content: '𝄞'; }
[icon=note]:before { content: '♪'; }
[icon=star]:before { content: '★'; }
[icon=goldstar]:before { content: '⭐'; }
[icon=snow]:before { content: '❄'; }
[icon=command]:before { content: '⌘'; }
[icon=pentagon]:before { content: '⬟'; }
[icon=hexagon]:before { content: '⬢'; }
[icon=cycle]:before { content: '⟳'; }
[icon=recycle]:before { content: '♻'; }


/* utils */

.move {
    user-select: none;
    cursor: move;
}

.resize {
    resize: both;
    overflow: hidden;
}

.collapse {
    animation: foldOut 0.5s;
}
[section].collapse.folded {
    animation: foldIn 0.5s;
    height: 0;
    padding-bottom: 0;
    padding-top: 40px;
}

.loading {
    color: transparent !important;
    position: relative;
}
.loading:after {
    content: '';
    position: absolute;
    top: 0; bottom: 0; left: 0; right: 0;
    width: 25px; height: 25px;
    margin: auto;
    border-radius: 50%;
    border: 0.25rem solid rgba(255, 255, 255, 0.2);
    border-top-color: white;
    animation: spin 1s infinite linear;
}
.big.loading:after {
    position: fixed;
    width: 100px; height: 100px;
    z-index: 1;
}

.loading2 {
    perspective: 120px;
}
.loading2:after {
    content: "";
    position: absolute;
    left: 25px; top: 25px;
    width: 50px; height: 50px;
    background-color: #3498db;
    animation: flip 1s infinite linear;
}


@keyframes spin {
    0%   { transform: rotate(0); }
    100% { transform: rotate(360deg); }
}
@keyframes flip {
    0%   { transform: rotate(0); }
    50%  { transform: rotateY(180deg); }
    100% { transform: rotateY(180deg) rotateX(180deg); }
}
@keyframes zoomIn {
    0%   { transform: scale(0); }
    100% { transform: scale(1); }
}
@keyframes zoomOut {
    0%   { transform: scale(1); }
    100% { transform: scale(0); }
}
@keyframes fadeIn {
    0%   { opacity: 0; }
    100% { opacity: 1; }
}
@keyframes fadeOut {
    0%   { opacity: 1; }
    100% { opacity: 0; }
}
@keyframes foldIn {
    0% { 
        height: auto;
        padding-top: 55px;
        padding-bottom: 10px;
    }
    100% { 
        height: 0;
        padding-top: 40px;
        padding-bottom: 0;
    }
}
@keyframes foldOut {
    0% { 
        height: 0;
        padding-top: 40px;
        padding-bottom: 0;
    }
    100% { 
        height: auto;
        padding-top: 55px;
        padding-bottom: 10px;
    }
}


[hidden], .hidden {
    display: none !important;
}

.ib, .ib_>* {
    display: inline-block;
    width: auto;
    margin-top: 0;
    margin-bottom: 0;
}

.floatl, .floatl_>* {
    float: left;
}
.floatr, .floatr_>* {
    float: right;
}

.textc, .textc_>* {
    text-align: center;
}
.textr, .textr_>* {
    text-align: right;
}
.textl, .textl_>* {
    text-align: left;
}

.autom, .autom_>* {
    margin: auto !important;
}

.floatcx, .floatcx_>* {
    position: absolute;
    left: 0; right: 0;
    margin: auto !important;
}
.floatcy, .floatcy_>* {
    position: absolute;
    top: 0; bottom: 0;
    margin: auto !important;
}
.floatc, .floatc_>* {
    position: absolute;
    left: 0; right: 0; top: 0; bottom: 0;
    margin: auto !important;
}

.centerx {
    display: flex;
    justify-content: center;
}
.centery {
    display: flex;
    align-items: center;
}
.center {
    display: flex;
    justify-content: center;
    align-items: center;
}

.left, .left_>* {
    position: absolute;
    left: 0;
}
.right, .right_>* {
    position: absolute;
    right: 0;
}
.top, .top_>* {
    position: absolute;
    top: 0;
}
.bottom, .bottom_>* {
    position: absolute;
    bottom: 0;
}

.fix {
    position: fixed;
}

.fullw, .fullw_>* {
    width: 100%;
}
.fullh, .fullh_>* {
    height: 100%;
}

.autow, .autow_>* {
    width: auto;
}
.autoh, .autoh_>* {
    height: auto;
}

.scrollx, .scrollx_>* {
    overflow-x: auto;
    overflow-y: hidden;
}
.scrolly, .scrolly_>* {
    overflow-x: hidden;
    overflow-y: auto;
}
.scroll, .scroll_>* {
    overflow: auto;
}

.columns-2 {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
}
.columns-2 > * {
    width: 49%;
    margin-right: 2%;
}
.columns-2 > *:nth-child(2n){
    margin-right: 0;
}

.columns-3 {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
}
.columns-3 > * {
    width: 32%;
    margin-right: 2%;
}
.columns-3 > *:nth-child(3n) {
    margin-right: 0;
}

.pad-s, .pad-s_>* {
    padding-left: 5%;
    padding-right: 5%;
}
.pad, .pad_>* {
    padding-left: 10%;
    padding-right: 10%;
}
.pad-l, .pad-l_>* {
    padding-left: 15%;
    padding-right: 15%;
}

.msg {
    height: 60%;
    width: 60%;
    padding: 10% 5%;
    font-size: large;
}

.round, .round_>* {
    border-radius: 50%;
}

.fab[btn] {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 50px;
    margin: 20px;
    border-radius: 50%;
    z-index: 5;
}

.scale, .scale_>* {
    transition: all .2s ease-in-out;
}
.scale:hover, .scale_>*:hover {
    transform: scale(1.1);
}


/* fx */

[fx=stack]:not([paging]) > *,
[fx=stack][paging] > .results > * {
    opacity: 0;
    margin-top: 100px;
    transition: opacity 0.5s ease,
                margin-top 0.5s ease;
}

.flip-container {
    perspective: 1000px;
    position: relative;
}
.flipper {
    transition: 0.6s;
    transform-style: preserve-3d;
    position: absolute;
}
.flipper.flip  {
    transform: rotateY(180deg);
}
.flipper .front, .flipper .back {
    backface-visibility: hidden;
    top: 0;
    left: 0;
}
.flipper .front {
    z-index: 2;
    transform: rotateY(0deg);
}
.flipper .back {
    transform: rotateY(180deg);
}


/* scrollbar */

/* webkit */
::-webkit-scrollbar {
    width: 16px;
    background: transparent;
}
::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    background-clip: content-box;
    border-right: solid transparent 8px;
    border-radius: 10px 23px 23px 10px;
}
::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.4);
}

/* mozilla (NOT WORKING) */
@-moz-document url-prefix(http://), url-prefix(https://) {
    scrollbar {
        -moz-appearance: none !important;
        background: rgb(0,255,0) !important;
    }
    thumb, scrollbarbutton {
        -moz-appearance: none !important;
        background-color: rgb(0,0,255) !important;
    }
    thumb:hover, scrollbarbutton:hover {
        -moz-appearance: none !important;
        background-color: rgb(255,0,0) !important;
    }
    scrollbarbutton {
        display: none !important;
    }
    scrollbar[orient="vertical"] {
        min-width: 15px !important;
    }
}


/*** MEDIA QUERIES ***/


/* desktop only */
@media only screen and (min-width: 800px) {
    .pad-s-desktop {
        padding-left: 5%;
        padding-right: 5%;
    }
    .pad-desktop {
        padding-left: 10%;
        padding-right: 10%;
    }
    .pad-l-desktop {
        padding-left: 15%;
        padding-right: 15%;
    }
}


/* tablet only */
@media only screen and (min-width: 500px) and (max-width: 800px) {

    .hide-tablet {
        display: none;
    }
    .show-tablet {
        display: block;
    }

    [header].hh-tablet:before {
        display: none;
    }
    [header].hh-tablet[page] {
        padding-top: 0;
    }
    [header].hh-tablet[panel] {
        padding-top: 20px;
    }
    [header].hh-tablet[section] {
        padding-top: 15px;
    }
    
    .pad-s-tablet {
        padding-left: 5%;
        padding-right: 5%;
    }
    .pad-tablet {
        padding-left: 10%;
        padding-right: 10%;
    }
    .pad-l-tablet {
        padding-left: 15%;
        padding-right: 15%;
    }

}


/* tablet and phone */
@media only screen and (max-width: 800px) {

    [page][header]:before {
        padding: 10px;
        line-height: 0.8;
    }

}


/* phone only */
@media only screen and (max-width: 500px) {

    [page] {
        padding-bottom: 0;
        overflow-y: auto;
    }

    [template] > .controls > .columns,
    [template] > .controls > .sizes {
        display: none;
    }

    [options] {
        bottom: 0;
        left: 0 !important;
        right: 0;
        height: 80% !important;
        margin: auto;
    }

    .hide-phone {
        display: none;
    }
    .show-phone {
        display: block;
    }

    [header].hh-phone:before {
        display: none;
    }
    [header].hh-phone[page] {
        padding-top: 0;
    }
    [header].hh-phone[panel] {
        padding-top: 20px;
    }
    [header].hh-phone[section] {
        padding-top: 15px;
    }

    .pad-s-phone {
        padding-left: 5%;
        padding-right: 5%;
    }
    .pad-phone {
        padding-left: 10%;
        padding-right: 10%;
    }
    .pad-l-phone {
        padding-left: 15%;
        padding-right: 15%;
    }
    


}

</style>`)

genBlockStyles()

bootstrap()

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./blocks/all":1,"./components":8,"./extensions":9,"./themes":11,"./utils":12}],11:[function(require,module,exports){
exports.themes = {

    base : {
        font : 'normal 14px sans-serif',
        palette : {
            white   : '#fff',
            lighter : '#ddd',
            light   : '#bbb',
            mid     : '#888',
            dark    : '#444',
            darker  : '#222',
            black   : '#000',
            detail  : 'darkcyan',
            lighten : 'rgba(255,255,255,0.2)',
            darken  : 'rgba(0,0,0,0.2)',
        },
    },

}


exports.themeMaps = {

    dark : {
        page    : 'darker lighten', // bg, header bg
        panel   : 'dark lighten',   // bg, header bg
        section : 'mid lighten',    // bg, header bg
        field   : 'light darker',   // bg, text
        btn     : 'detail darker',  // bg, text
        header  : 'darker',         // text
        label   : 'darker',         // text
        text    : 'darker',         // text
    },

    light : {
        page    : 'lighter darken',
        panel   : 'mid lighten',
        section : 'light darken',
        field   : 'lighter dark',
        btn     : 'detail light',
        header  : 'dark',
        label   : 'mid',
        text    : 'darker',
    },
    
}
},{}],12:[function(require,module,exports){
const is = {}
'object function array string number regex boolean'.split(' ').forEach(function(t){
    is[t] = function(exp){ return type(exp) === t }
})
function type(exp) {
        var clazz = Object.prototype.toString.call(exp)
        return clazz.substring(8, clazz.length-1).toLowerCase()
}
function sameType(exp1, exp2) {
    return type(exp1) === type(exp2)
}


function checkData(data) {
    switch (typeof data) {
    case 'string':
        data = {value: data, label: data, alias: data.toLowerCase()}
        break
    case 'object':
        if ( !is.string(data.value) || !is.string(data.label) ) {
            error('Invalid data object (must have string properties "value" and "label"):', data)
            invalidData++
            data = {value: '', label: 'INVALID DATA', alias: ''}
        }
        else if ( !is.string(data.alias) ) {
            if (data.alias) {
                error('Invalid data property "alias" (must be a string):', data)
                invalidData++
            }
            data.alias = data.value.toLowerCase()
        }
        else data.alias = data.alias.toLowerCase() +' '+ data.value.toLowerCase()
        break
    default:
        error('Invalid data (must be a string or an object):', data)
        invalidData++
        data = {value: '', label: 'INVALID DATA', alias: ''}
    }
    return data
}


function rastiError(msg, ...args){
    this.msg = msg
    this.el = args.pop()
    this.args = args
}


function random() {
    return (Math.random() * 6 | 0) + 1
}


function onMobile() {
    return window.innerWidth < 500
}


module.exports = {
	is,
	type,
	sameType,
	checkData,
	random,
	onMobile,
    rastiError,
}
},{}]},{},[10])(10)
});
//# sourceMappingURL=rasti.map
