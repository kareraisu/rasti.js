/* Zepto v1.2.0 - zepto event ajax form ie - zeptojs.com/license */
!function(t,e){"function"==typeof define&&define.amd?define(function(){return e(t)}):e(t)}(this,function(t){var e=function(){function $(t){return null==t?String(t):S[C.call(t)]||"object"}function F(t){return"function"==$(t)}function k(t){return null!=t&&t==t.window}function M(t){return null!=t&&t.nodeType==t.DOCUMENT_NODE}function R(t){return"object"==$(t)}function Z(t){return R(t)&&!k(t)&&Object.getPrototypeOf(t)==Object.prototype}function z(t){var e=!!t&&"length"in t&&t.length,n=r.type(t);return"function"!=n&&!k(t)&&("array"==n||0===e||"number"==typeof e&&e>0&&e-1 in t)}function q(t){return a.call(t,function(t){return null!=t})}function H(t){return t.length>0?r.fn.concat.apply([],t):t}function I(t){return t.replace(/::/g,"/").replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").replace(/_/g,"-").toLowerCase()}function V(t){return t in l?l[t]:l[t]=new RegExp("(^|\\s)"+t+"(\\s|$)")}function _(t,e){return"number"!=typeof e||h[I(t)]?e:e+"px"}function B(t){var e,n;return c[t]||(e=f.createElement(t),f.body.appendChild(e),n=getComputedStyle(e,"").getPropertyValue("display"),e.parentNode.removeChild(e),"none"==n&&(n="block"),c[t]=n),c[t]}function U(t){return"children"in t?u.call(t.children):r.map(t.childNodes,function(t){return 1==t.nodeType?t:void 0})}function X(t,e){var n,r=t?t.length:0;for(n=0;r>n;n++)this[n]=t[n];this.length=r,this.selector=e||""}function J(t,r,i){for(n in r)i&&(Z(r[n])||L(r[n]))?(Z(r[n])&&!Z(t[n])&&(t[n]={}),L(r[n])&&!L(t[n])&&(t[n]=[]),J(t[n],r[n],i)):r[n]!==e&&(t[n]=r[n])}function W(t,e){return null==e?r(t):r(t).filter(e)}function Y(t,e,n,r){return F(e)?e.call(t,n,r):e}function G(t,e,n){null==n?t.removeAttribute(e):t.setAttribute(e,n)}function K(t,n){var r=t.className||"",i=r&&r.baseVal!==e;return n===e?i?r.baseVal:r:void(i?r.baseVal=n:t.className=n)}function Q(t){try{return t?"true"==t||("false"==t?!1:"null"==t?null:+t+""==t?+t:/^[\[\{]/.test(t)?r.parseJSON(t):t):t}catch(e){return t}}function tt(t,e){e(t);for(var n=0,r=t.childNodes.length;r>n;n++)tt(t.childNodes[n],e)}var e,n,r,i,O,P,o=[],s=o.concat,a=o.filter,u=o.slice,f=t.document,c={},l={},h={"column-count":1,columns:1,"font-weight":1,"line-height":1,opacity:1,"z-index":1,zoom:1},p=/^\s*<(\w+|!)[^>]*>/,d=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,m=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,g=/^(?:body|html)$/i,v=/([A-Z])/g,y=["val","css","html","text","data","width","height","offset"],x=["after","prepend","before","append"],b=f.createElement("table"),E=f.createElement("tr"),j={tr:f.createElement("tbody"),tbody:b,thead:b,tfoot:b,td:E,th:E,"*":f.createElement("div")},w=/complete|loaded|interactive/,T=/^[\w-]*$/,S={},C=S.toString,N={},A=f.createElement("div"),D={tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},L=Array.isArray||function(t){return t instanceof Array};return N.matches=function(t,e){if(!e||!t||1!==t.nodeType)return!1;var n=t.matches||t.webkitMatchesSelector||t.mozMatchesSelector||t.oMatchesSelector||t.matchesSelector;if(n)return n.call(t,e);var r,i=t.parentNode,o=!i;return o&&(i=A).appendChild(t),r=~N.qsa(i,e).indexOf(t),o&&A.removeChild(t),r},O=function(t){return t.replace(/-+(.)?/g,function(t,e){return e?e.toUpperCase():""})},P=function(t){return a.call(t,function(e,n){return t.indexOf(e)==n})},N.fragment=function(t,n,i){var o,s,a;return d.test(t)&&(o=r(f.createElement(RegExp.$1))),o||(t.replace&&(t=t.replace(m,"<$1></$2>")),n===e&&(n=p.test(t)&&RegExp.$1),n in j||(n="*"),a=j[n],a.innerHTML=""+t,o=r.each(u.call(a.childNodes),function(){a.removeChild(this)})),Z(i)&&(s=r(o),r.each(i,function(t,e){y.indexOf(t)>-1?s[t](e):s.attr(t,e)})),o},N.Z=function(t,e){return new X(t,e)},N.isZ=function(t){return t instanceof N.Z},N.init=function(t,n){var i;if(!t)return N.Z();if("string"==typeof t)if(t=t.trim(),"<"==t[0]&&p.test(t))i=N.fragment(t,RegExp.$1,n),t=null;else{if(n!==e)return r(n).find(t);i=N.qsa(f,t)}else{if(F(t))return r(f).ready(t);if(N.isZ(t))return t;if(L(t))i=q(t);else if(R(t))i=[t],t=null;else if(p.test(t))i=N.fragment(t.trim(),RegExp.$1,n),t=null;else{if(n!==e)return r(n).find(t);i=N.qsa(f,t)}}return N.Z(i,t)},r=function(t,e){return N.init(t,e)},r.extend=function(t){var e,n=u.call(arguments,1);return"boolean"==typeof t&&(e=t,t=n.shift()),n.forEach(function(n){J(t,n,e)}),t},N.qsa=function(t,e){var n,r="#"==e[0],i=!r&&"."==e[0],o=r||i?e.slice(1):e,s=T.test(o);return t.getElementById&&s&&r?(n=t.getElementById(o))?[n]:[]:1!==t.nodeType&&9!==t.nodeType&&11!==t.nodeType?[]:u.call(s&&!r&&t.getElementsByClassName?i?t.getElementsByClassName(o):t.getElementsByTagName(e):t.querySelectorAll(e))},r.contains=f.documentElement.contains?function(t,e){return t!==e&&t.contains(e)}:function(t,e){for(;e&&(e=e.parentNode);)if(e===t)return!0;return!1},r.type=$,r.isFunction=F,r.isWindow=k,r.isArray=L,r.isPlainObject=Z,r.isEmptyObject=function(t){var e;for(e in t)return!1;return!0},r.isNumeric=function(t){var e=Number(t),n=typeof t;return null!=t&&"boolean"!=n&&("string"!=n||t.length)&&!isNaN(e)&&isFinite(e)||!1},r.inArray=function(t,e,n){return o.indexOf.call(e,t,n)},r.camelCase=O,r.trim=function(t){return null==t?"":String.prototype.trim.call(t)},r.uuid=0,r.support={},r.expr={},r.noop=function(){},r.map=function(t,e){var n,i,o,r=[];if(z(t))for(i=0;i<t.length;i++)n=e(t[i],i),null!=n&&r.push(n);else for(o in t)n=e(t[o],o),null!=n&&r.push(n);return H(r)},r.each=function(t,e){var n,r;if(z(t)){for(n=0;n<t.length;n++)if(e.call(t[n],n,t[n])===!1)return t}else for(r in t)if(e.call(t[r],r,t[r])===!1)return t;return t},r.grep=function(t,e){return a.call(t,e)},t.JSON&&(r.parseJSON=JSON.parse),r.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(t,e){S["[object "+e+"]"]=e.toLowerCase()}),r.fn={constructor:N.Z,length:0,forEach:o.forEach,reduce:o.reduce,push:o.push,sort:o.sort,splice:o.splice,indexOf:o.indexOf,concat:function(){var t,e,n=[];for(t=0;t<arguments.length;t++)e=arguments[t],n[t]=N.isZ(e)?e.toArray():e;return s.apply(N.isZ(this)?this.toArray():this,n)},map:function(t){return r(r.map(this,function(e,n){return t.call(e,n,e)}))},slice:function(){return r(u.apply(this,arguments))},ready:function(t){return w.test(f.readyState)&&f.body?t(r):f.addEventListener("DOMContentLoaded",function(){t(r)},!1),this},get:function(t){return t===e?u.call(this):this[t>=0?t:t+this.length]},toArray:function(){return this.get()},size:function(){return this.length},remove:function(){return this.each(function(){null!=this.parentNode&&this.parentNode.removeChild(this)})},each:function(t){return o.every.call(this,function(e,n){return t.call(e,n,e)!==!1}),this},filter:function(t){return F(t)?this.not(this.not(t)):r(a.call(this,function(e){return N.matches(e,t)}))},add:function(t,e){return r(P(this.concat(r(t,e))))},is:function(t){return this.length>0&&N.matches(this[0],t)},not:function(t){var n=[];if(F(t)&&t.call!==e)this.each(function(e){t.call(this,e)||n.push(this)});else{var i="string"==typeof t?this.filter(t):z(t)&&F(t.item)?u.call(t):r(t);this.forEach(function(t){i.indexOf(t)<0&&n.push(t)})}return r(n)},has:function(t){return this.filter(function(){return R(t)?r.contains(this,t):r(this).find(t).size()})},eq:function(t){return-1===t?this.slice(t):this.slice(t,+t+1)},first:function(){var t=this[0];return t&&!R(t)?t:r(t)},last:function(){var t=this[this.length-1];return t&&!R(t)?t:r(t)},find:function(t){var e,n=this;return e=t?"object"==typeof t?r(t).filter(function(){var t=this;return o.some.call(n,function(e){return r.contains(e,t)})}):1==this.length?r(N.qsa(this[0],t)):this.map(function(){return N.qsa(this,t)}):r()},closest:function(t,e){var n=[],i="object"==typeof t&&r(t);return this.each(function(r,o){for(;o&&!(i?i.indexOf(o)>=0:N.matches(o,t));)o=o!==e&&!M(o)&&o.parentNode;o&&n.indexOf(o)<0&&n.push(o)}),r(n)},parents:function(t){for(var e=[],n=this;n.length>0;)n=r.map(n,function(t){return(t=t.parentNode)&&!M(t)&&e.indexOf(t)<0?(e.push(t),t):void 0});return W(e,t)},parent:function(t){return W(P(this.pluck("parentNode")),t)},children:function(t){return W(this.map(function(){return U(this)}),t)},contents:function(){return this.map(function(){return this.contentDocument||u.call(this.childNodes)})},siblings:function(t){return W(this.map(function(t,e){return a.call(U(e.parentNode),function(t){return t!==e})}),t)},empty:function(){return this.each(function(){this.innerHTML=""})},pluck:function(t){return r.map(this,function(e){return e[t]})},show:function(){return this.each(function(){"none"==this.style.display&&(this.style.display=""),"none"==getComputedStyle(this,"").getPropertyValue("display")&&(this.style.display=B(this.nodeName))})},replaceWith:function(t){return this.before(t).remove()},wrap:function(t){var e=F(t);if(this[0]&&!e)var n=r(t).get(0),i=n.parentNode||this.length>1;return this.each(function(o){r(this).wrapAll(e?t.call(this,o):i?n.cloneNode(!0):n)})},wrapAll:function(t){if(this[0]){r(this[0]).before(t=r(t));for(var e;(e=t.children()).length;)t=e.first();r(t).append(this)}return this},wrapInner:function(t){var e=F(t);return this.each(function(n){var i=r(this),o=i.contents(),s=e?t.call(this,n):t;o.length?o.wrapAll(s):i.append(s)})},unwrap:function(){return this.parent().each(function(){r(this).replaceWith(r(this).children())}),this},clone:function(){return this.map(function(){return this.cloneNode(!0)})},hide:function(){return this.css("display","none")},toggle:function(t){return this.each(function(){var n=r(this);(t===e?"none"==n.css("display"):t)?n.show():n.hide()})},prev:function(t){return r(this.pluck("previousElementSibling")).filter(t||"*")},next:function(t){return r(this.pluck("nextElementSibling")).filter(t||"*")},html:function(t){return 0 in arguments?this.each(function(e){var n=this.innerHTML;r(this).empty().append(Y(this,t,e,n))}):0 in this?this[0].innerHTML:null},text:function(t){return 0 in arguments?this.each(function(e){var n=Y(this,t,e,this.textContent);this.textContent=null==n?"":""+n}):0 in this?this.pluck("textContent").join(""):null},attr:function(t,r){var i;return"string"!=typeof t||1 in arguments?this.each(function(e){if(1===this.nodeType)if(R(t))for(n in t)G(this,n,t[n]);else G(this,t,Y(this,r,e,this.getAttribute(t)))}):0 in this&&1==this[0].nodeType&&null!=(i=this[0].getAttribute(t))?i:e},removeAttr:function(t){return this.each(function(){1===this.nodeType&&t.split(" ").forEach(function(t){G(this,t)},this)})},prop:function(t,e){return t=D[t]||t,1 in arguments?this.each(function(n){this[t]=Y(this,e,n,this[t])}):this[0]&&this[0][t]},removeProp:function(t){return t=D[t]||t,this.each(function(){delete this[t]})},data:function(t,n){var r="data-"+t.replace(v,"-$1").toLowerCase(),i=1 in arguments?this.attr(r,n):this.attr(r);return null!==i?Q(i):e},val:function(t){return 0 in arguments?(null==t&&(t=""),this.each(function(e){this.value=Y(this,t,e,this.value)})):this[0]&&(this[0].multiple?r(this[0]).find("option").filter(function(){return this.selected}).pluck("value"):this[0].value)},offset:function(e){if(e)return this.each(function(t){var n=r(this),i=Y(this,e,t,n.offset()),o=n.offsetParent().offset(),s={top:i.top-o.top,left:i.left-o.left};"static"==n.css("position")&&(s.position="relative"),n.css(s)});if(!this.length)return null;if(f.documentElement!==this[0]&&!r.contains(f.documentElement,this[0]))return{top:0,left:0};var n=this[0].getBoundingClientRect();return{left:n.left+t.pageXOffset,top:n.top+t.pageYOffset,width:Math.round(n.width),height:Math.round(n.height)}},css:function(t,e){if(arguments.length<2){var i=this[0];if("string"==typeof t){if(!i)return;return i.style[O(t)]||getComputedStyle(i,"").getPropertyValue(t)}if(L(t)){if(!i)return;var o={},s=getComputedStyle(i,"");return r.each(t,function(t,e){o[e]=i.style[O(e)]||s.getPropertyValue(e)}),o}}var a="";if("string"==$(t))e||0===e?a=I(t)+":"+_(t,e):this.each(function(){this.style.removeProperty(I(t))});else for(n in t)t[n]||0===t[n]?a+=I(n)+":"+_(n,t[n])+";":this.each(function(){this.style.removeProperty(I(n))});return this.each(function(){this.style.cssText+=";"+a})},index:function(t){return t?this.indexOf(r(t)[0]):this.parent().children().indexOf(this[0])},hasClass:function(t){return t?o.some.call(this,function(t){return this.test(K(t))},V(t)):!1},addClass:function(t){return t?this.each(function(e){if("className"in this){i=[];var n=K(this),o=Y(this,t,e,n);o.split(/\s+/g).forEach(function(t){r(this).hasClass(t)||i.push(t)},this),i.length&&K(this,n+(n?" ":"")+i.join(" "))}}):this},removeClass:function(t){return this.each(function(n){if("className"in this){if(t===e)return K(this,"");i=K(this),Y(this,t,n,i).split(/\s+/g).forEach(function(t){i=i.replace(V(t)," ")}),K(this,i.trim())}})},toggleClass:function(t,n){return t?this.each(function(i){var o=r(this),s=Y(this,t,i,K(this));s.split(/\s+/g).forEach(function(t){(n===e?!o.hasClass(t):n)?o.addClass(t):o.removeClass(t)})}):this},scrollTop:function(t){if(this.length){var n="scrollTop"in this[0];return t===e?n?this[0].scrollTop:this[0].pageYOffset:this.each(n?function(){this.scrollTop=t}:function(){this.scrollTo(this.scrollX,t)})}},scrollLeft:function(t){if(this.length){var n="scrollLeft"in this[0];return t===e?n?this[0].scrollLeft:this[0].pageXOffset:this.each(n?function(){this.scrollLeft=t}:function(){this.scrollTo(t,this.scrollY)})}},position:function(){if(this.length){var t=this[0],e=this.offsetParent(),n=this.offset(),i=g.test(e[0].nodeName)?{top:0,left:0}:e.offset();return n.top-=parseFloat(r(t).css("margin-top"))||0,n.left-=parseFloat(r(t).css("margin-left"))||0,i.top+=parseFloat(r(e[0]).css("border-top-width"))||0,i.left+=parseFloat(r(e[0]).css("border-left-width"))||0,{top:n.top-i.top,left:n.left-i.left}}},offsetParent:function(){return this.map(function(){for(var t=this.offsetParent||f.body;t&&!g.test(t.nodeName)&&"static"==r(t).css("position");)t=t.offsetParent;return t})}},r.fn.detach=r.fn.remove,["width","height"].forEach(function(t){var n=t.replace(/./,function(t){return t[0].toUpperCase()});r.fn[t]=function(i){var o,s=this[0];return i===e?k(s)?s["inner"+n]:M(s)?s.documentElement["scroll"+n]:(o=this.offset())&&o[t]:this.each(function(e){s=r(this),s.css(t,Y(this,i,e,s[t]()))})}}),x.forEach(function(n,i){var o=i%2;r.fn[n]=function(){var n,a,s=r.map(arguments,function(t){var i=[];return n=$(t),"array"==n?(t.forEach(function(t){return t.nodeType!==e?i.push(t):r.zepto.isZ(t)?i=i.concat(t.get()):void(i=i.concat(N.fragment(t)))}),i):"object"==n||null==t?t:N.fragment(t)}),u=this.length>1;return s.length<1?this:this.each(function(e,n){a=o?n:n.parentNode,n=0==i?n.nextSibling:1==i?n.firstChild:2==i?n:null;var c=r.contains(f.documentElement,a);s.forEach(function(e){if(u)e=e.cloneNode(!0);else if(!a)return r(e).remove();a.insertBefore(e,n),c&&tt(e,function(e){if(!(null==e.nodeName||"SCRIPT"!==e.nodeName.toUpperCase()||e.type&&"text/javascript"!==e.type||e.src)){var n=e.ownerDocument?e.ownerDocument.defaultView:t;n.eval.call(n,e.innerHTML)}})})})},r.fn[o?n+"To":"insert"+(i?"Before":"After")]=function(t){return r(t)[n](this),this}}),N.Z.prototype=X.prototype=r.fn,N.uniq=P,N.deserializeValue=Q,r.zepto=N,r}();return t.Zepto=e,void 0===t.$&&(t.$=e),function(e){function h(t){return t._zid||(t._zid=n++)}function p(t,e,n,r){if(e=d(e),e.ns)var i=m(e.ns);return(a[h(t)]||[]).filter(function(t){return t&&(!e.e||t.e==e.e)&&(!e.ns||i.test(t.ns))&&(!n||h(t.fn)===h(n))&&(!r||t.sel==r)})}function d(t){var e=(""+t).split(".");return{e:e[0],ns:e.slice(1).sort().join(" ")}}function m(t){return new RegExp("(?:^| )"+t.replace(" "," .* ?")+"(?: |$)")}function g(t,e){return t.del&&!f&&t.e in c||!!e}function v(t){return l[t]||f&&c[t]||t}function y(t,n,i,o,s,u,f){var c=h(t),p=a[c]||(a[c]=[]);n.split(/\s/).forEach(function(n){if("ready"==n)return e(document).ready(i);var a=d(n);a.fn=i,a.sel=s,a.e in l&&(i=function(t){var n=t.relatedTarget;return!n||n!==this&&!e.contains(this,n)?a.fn.apply(this,arguments):void 0}),a.del=u;var c=u||i;a.proxy=function(e){if(e=T(e),!e.isImmediatePropagationStopped()){e.data=o;var n=c.apply(t,e._args==r?[e]:[e].concat(e._args));return n===!1&&(e.preventDefault(),e.stopPropagation()),n}},a.i=p.length,p.push(a),"addEventListener"in t&&t.addEventListener(v(a.e),a.proxy,g(a,f))})}function x(t,e,n,r,i){var o=h(t);(e||"").split(/\s/).forEach(function(e){p(t,e,n,r).forEach(function(e){delete a[o][e.i],"removeEventListener"in t&&t.removeEventListener(v(e.e),e.proxy,g(e,i))})})}function T(t,n){return(n||!t.isDefaultPrevented)&&(n||(n=t),e.each(w,function(e,r){var i=n[e];t[e]=function(){return this[r]=b,i&&i.apply(n,arguments)},t[r]=E}),t.timeStamp||(t.timeStamp=Date.now()),(n.defaultPrevented!==r?n.defaultPrevented:"returnValue"in n?n.returnValue===!1:n.getPreventDefault&&n.getPreventDefault())&&(t.isDefaultPrevented=b)),t}function S(t){var e,n={originalEvent:t};for(e in t)j.test(e)||t[e]===r||(n[e]=t[e]);return T(n,t)}var r,n=1,i=Array.prototype.slice,o=e.isFunction,s=function(t){return"string"==typeof t},a={},u={},f="onfocusin"in t,c={focus:"focusin",blur:"focusout"},l={mouseenter:"mouseover",mouseleave:"mouseout"};u.click=u.mousedown=u.mouseup=u.mousemove="MouseEvents",e.event={add:y,remove:x},e.proxy=function(t,n){var r=2 in arguments&&i.call(arguments,2);if(o(t)){var a=function(){return t.apply(n,r?r.concat(i.call(arguments)):arguments)};return a._zid=h(t),a}if(s(n))return r?(r.unshift(t[n],t),e.proxy.apply(null,r)):e.proxy(t[n],t);throw new TypeError("expected function")},e.fn.bind=function(t,e,n){return this.on(t,e,n)},e.fn.unbind=function(t,e){return this.off(t,e)},e.fn.one=function(t,e,n,r){return this.on(t,e,n,r,1)};var b=function(){return!0},E=function(){return!1},j=/^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/,w={preventDefault:"isDefaultPrevented",stopImmediatePropagation:"isImmediatePropagationStopped",stopPropagation:"isPropagationStopped"};e.fn.delegate=function(t,e,n){return this.on(e,t,n)},e.fn.undelegate=function(t,e,n){return this.off(e,t,n)},e.fn.live=function(t,n){return e(document.body).delegate(this.selector,t,n),this},e.fn.die=function(t,n){return e(document.body).undelegate(this.selector,t,n),this},e.fn.on=function(t,n,a,u,f){var c,l,h=this;return t&&!s(t)?(e.each(t,function(t,e){h.on(t,n,a,e,f)}),h):(s(n)||o(u)||u===!1||(u=a,a=n,n=r),(u===r||a===!1)&&(u=a,a=r),u===!1&&(u=E),h.each(function(r,o){f&&(c=function(t){return x(o,t.type,u),u.apply(this,arguments)}),n&&(l=function(t){var r,s=e(t.target).closest(n,o).get(0);return s&&s!==o?(r=e.extend(S(t),{currentTarget:s,liveFired:o}),(c||u).apply(s,[r].concat(i.call(arguments,1)))):void 0}),y(o,t,u,a,n,l||c)}))},e.fn.off=function(t,n,i){var a=this;return t&&!s(t)?(e.each(t,function(t,e){a.off(t,n,e)}),a):(s(n)||o(i)||i===!1||(i=n,n=r),i===!1&&(i=E),a.each(function(){x(this,t,i,n)}))},e.fn.trigger=function(t,n){return t=s(t)||e.isPlainObject(t)?e.Event(t):T(t),t._args=n,this.each(function(){t.type in c&&"function"==typeof this[t.type]?this[t.type]():"dispatchEvent"in this?this.dispatchEvent(t):e(this).triggerHandler(t,n)})},e.fn.triggerHandler=function(t,n){var r,i;return this.each(function(o,a){r=S(s(t)?e.Event(t):t),r._args=n,r.target=a,e.each(p(a,t.type||t),function(t,e){return i=e.proxy(r),r.isImmediatePropagationStopped()?!1:void 0})}),i},"focusin focusout focus blur load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function(t){e.fn[t]=function(e){return 0 in arguments?this.bind(t,e):this.trigger(t)}}),e.Event=function(t,e){s(t)||(e=t,t=e.type);var n=document.createEvent(u[t]||"Events"),r=!0;if(e)for(var i in e)"bubbles"==i?r=!!e[i]:n[i]=e[i];return n.initEvent(t,r,!0),T(n)}}(e),function(e){function p(t,n,r){var i=e.Event(n);return e(t).trigger(i,r),!i.isDefaultPrevented()}function d(t,e,n,i){return t.global?p(e||r,n,i):void 0}function m(t){t.global&&0===e.active++&&d(t,null,"ajaxStart")}function g(t){t.global&&!--e.active&&d(t,null,"ajaxStop")}function v(t,e){var n=e.context;return e.beforeSend.call(n,t,e)===!1||d(e,n,"ajaxBeforeSend",[t,e])===!1?!1:void d(e,n,"ajaxSend",[t,e])}function y(t,e,n,r){var i=n.context,o="success";n.success.call(i,t,o,e),r&&r.resolveWith(i,[t,o,e]),d(n,i,"ajaxSuccess",[e,n,t]),b(o,e,n)}function x(t,e,n,r,i){var o=r.context;r.error.call(o,n,e,t),i&&i.rejectWith(o,[n,e,t]),d(r,o,"ajaxError",[n,r,t||e]),b(e,n,r)}function b(t,e,n){var r=n.context;n.complete.call(r,e,t),d(n,r,"ajaxComplete",[e,n]),g(n)}function E(t,e,n){if(n.dataFilter==j)return t;var r=n.context;return n.dataFilter.call(r,t,e)}function j(){}function w(t){return t&&(t=t.split(";",2)[0]),t&&(t==c?"html":t==f?"json":a.test(t)?"script":u.test(t)&&"xml")||"text"}function T(t,e){return""==e?t:(t+"&"+e).replace(/[&?]{1,2}/,"?")}function S(t){t.processData&&t.data&&"string"!=e.type(t.data)&&(t.data=e.param(t.data,t.traditional)),!t.data||t.type&&"GET"!=t.type.toUpperCase()&&"jsonp"!=t.dataType||(t.url=T(t.url,t.data),t.data=void 0)}function C(t,n,r,i){return e.isFunction(n)&&(i=r,r=n,n=void 0),e.isFunction(r)||(i=r,r=void 0),{url:t,data:n,success:r,dataType:i}}function O(t,n,r,i){var o,s=e.isArray(n),a=e.isPlainObject(n);e.each(n,function(n,u){o=e.type(u),i&&(n=r?i:i+"["+(a||"object"==o||"array"==o?n:"")+"]"),!i&&s?t.add(u.name,u.value):"array"==o||!r&&"object"==o?O(t,u,r,n):t.add(n,u)})}var i,o,n=+new Date,r=t.document,s=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,a=/^(?:text|application)\/javascript/i,u=/^(?:text|application)\/xml/i,f="application/json",c="text/html",l=/^\s*$/,h=r.createElement("a");h.href=t.location.href,e.active=0,e.ajaxJSONP=function(i,o){if(!("type"in i))return e.ajax(i);var c,p,s=i.jsonpCallback,a=(e.isFunction(s)?s():s)||"Zepto"+n++,u=r.createElement("script"),f=t[a],l=function(t){e(u).triggerHandler("error",t||"abort")},h={abort:l};return o&&o.promise(h),e(u).on("load error",function(n,r){clearTimeout(p),e(u).off().remove(),"error"!=n.type&&c?y(c[0],h,i,o):x(null,r||"error",h,i,o),t[a]=f,c&&e.isFunction(f)&&f(c[0]),f=c=void 0}),v(h,i)===!1?(l("abort"),h):(t[a]=function(){c=arguments},u.src=i.url.replace(/\?(.+)=\?/,"?$1="+a),r.head.appendChild(u),i.timeout>0&&(p=setTimeout(function(){l("timeout")},i.timeout)),h)},e.ajaxSettings={type:"GET",beforeSend:j,success:j,error:j,complete:j,context:null,global:!0,xhr:function(){return new t.XMLHttpRequest},accepts:{script:"text/javascript, application/javascript, application/x-javascript",json:f,xml:"application/xml, text/xml",html:c,text:"text/plain"},crossDomain:!1,timeout:0,processData:!0,cache:!0,dataFilter:j},e.ajax=function(n){var u,f,s=e.extend({},n||{}),a=e.Deferred&&e.Deferred();for(i in e.ajaxSettings)void 0===s[i]&&(s[i]=e.ajaxSettings[i]);m(s),s.crossDomain||(u=r.createElement("a"),u.href=s.url,u.href=u.href,s.crossDomain=h.protocol+"//"+h.host!=u.protocol+"//"+u.host),s.url||(s.url=t.location.toString()),(f=s.url.indexOf("#"))>-1&&(s.url=s.url.slice(0,f)),S(s);var c=s.dataType,p=/\?.+=\?/.test(s.url);if(p&&(c="jsonp"),s.cache!==!1&&(n&&n.cache===!0||"script"!=c&&"jsonp"!=c)||(s.url=T(s.url,"_="+Date.now())),"jsonp"==c)return p||(s.url=T(s.url,s.jsonp?s.jsonp+"=?":s.jsonp===!1?"":"callback=?")),e.ajaxJSONP(s,a);var P,d=s.accepts[c],g={},b=function(t,e){g[t.toLowerCase()]=[t,e]},C=/^([\w-]+:)\/\//.test(s.url)?RegExp.$1:t.location.protocol,N=s.xhr(),O=N.setRequestHeader;if(a&&a.promise(N),s.crossDomain||b("X-Requested-With","XMLHttpRequest"),b("Accept",d||"*/*"),(d=s.mimeType||d)&&(d.indexOf(",")>-1&&(d=d.split(",",2)[0]),N.overrideMimeType&&N.overrideMimeType(d)),(s.contentType||s.contentType!==!1&&s.data&&"GET"!=s.type.toUpperCase())&&b("Content-Type",s.contentType||"application/x-www-form-urlencoded"),s.headers)for(o in s.headers)b(o,s.headers[o]);if(N.setRequestHeader=b,N.onreadystatechange=function(){if(4==N.readyState){N.onreadystatechange=j,clearTimeout(P);var t,n=!1;if(N.status>=200&&N.status<300||304==N.status||0==N.status&&"file:"==C){if(c=c||w(s.mimeType||N.getResponseHeader("content-type")),"arraybuffer"==N.responseType||"blob"==N.responseType)t=N.response;else{t=N.responseText;try{t=E(t,c,s),"script"==c?(1,eval)(t):"xml"==c?t=N.responseXML:"json"==c&&(t=l.test(t)?null:e.parseJSON(t))}catch(r){n=r}if(n)return x(n,"parsererror",N,s,a)}y(t,N,s,a)}else x(N.statusText||null,N.status?"error":"abort",N,s,a)}},v(N,s)===!1)return N.abort(),x(null,"abort",N,s,a),N;var A="async"in s?s.async:!0;if(N.open(s.type,s.url,A,s.username,s.password),s.xhrFields)for(o in s.xhrFields)N[o]=s.xhrFields[o];for(o in g)O.apply(N,g[o]);return s.timeout>0&&(P=setTimeout(function(){N.onreadystatechange=j,N.abort(),x(null,"timeout",N,s,a)},s.timeout)),N.send(s.data?s.data:null),N},e.get=function(){return e.ajax(C.apply(null,arguments))},e.post=function(){var t=C.apply(null,arguments);return t.type="POST",e.ajax(t)},e.getJSON=function(){var t=C.apply(null,arguments);return t.dataType="json",e.ajax(t)},e.fn.load=function(t,n,r){if(!this.length)return this;var a,i=this,o=t.split(/\s/),u=C(t,n,r),f=u.success;return o.length>1&&(u.url=o[0],a=o[1]),u.success=function(t){i.html(a?e("<div>").html(t.replace(s,"")).find(a):t),f&&f.apply(i,arguments)},e.ajax(u),this};var N=encodeURIComponent;e.param=function(t,n){var r=[];return r.add=function(t,n){e.isFunction(n)&&(n=n()),null==n&&(n=""),this.push(N(t)+"="+N(n))},O(r,t,n),r.join("&").replace(/%20/g,"+")}}(e),function(t){t.fn.serializeArray=function(){var e,n,r=[],i=function(t){return t.forEach?t.forEach(i):void r.push({name:e,value:t})};return this[0]&&t.each(this[0].elements,function(r,o){n=o.type,e=o.name,e&&"fieldset"!=o.nodeName.toLowerCase()&&!o.disabled&&"submit"!=n&&"reset"!=n&&"button"!=n&&"file"!=n&&("radio"!=n&&"checkbox"!=n||o.checked)&&i(t(o).val())}),r},t.fn.serialize=function(){var t=[];return this.serializeArray().forEach(function(e){t.push(encodeURIComponent(e.name)+"="+encodeURIComponent(e.value))}),t.join("&")},t.fn.submit=function(e){if(0 in arguments)this.bind("submit",e);else if(this.length){var n=t.Event("submit");this.eq(0).trigger(n),n.isDefaultPrevented()||this.get(0).submit()}return this}}(e),function(){try{getComputedStyle(void 0)}catch(e){var n=getComputedStyle;t.getComputedStyle=function(t,e){try{return n(t,e)}catch(r){return null}}}}(),e});
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.rasti = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = {
	list    : require('./list'),
	table   : require('./table'),
	input   : require('./input'),
	checks  : require('./checks'),
	radios  : require('./radios'),
	buttons : require('./buttons'),
	multi   : require('./multi'),
	select  : require('./select'),
}
},{"./buttons":2,"./checks":3,"./input":4,"./list":5,"./multi":6,"./radios":7,"./select":8,"./table":9}],2:[function(require,module,exports){
const { prepTemplate } = require('../utils')

module.exports = {

render(data, $el) {
    const template = prepTemplate(d => `<div value="${d.value}">${d.label}</div>`)
    $el.html( template(data) )
},

init($el) {
    $el[0].value = ''
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
        border-radius: 4px;
        background-clip: padding-box;
        text-transform: uppercase;
        cursor: pointer;
    }
`

}

},{"../utils":16}],3:[function(require,module,exports){
const { random, prepTemplate } = require('../utils')

module.exports = {

render(data, $el) {
    const uid = random()
    const template = prepTemplate(d => `<input type="checkbox" name="${uid}[]" value="${d.value}"/><label>${d.label}</label>`)
    $el.html( template(data) )
},

init($el) {
    const values = $el[0].value = []

    $el.on('change', 'input', function(e) {
        // update component value
        const $input = $(e.currentTarget),
            val = $input.attr('value')
        $input.prop('checked')
            ? values.push(val)
            : values.remove(val)
    })
    
    $el.on('change', function(e) {
        // update component ui
        let $input, checked
        $el.find('input').each(function(i, input){
            $input = $(input)
            checked = values.includes( $input.attr('value') )
            $input.prop('checked', checked)
        })
    })
},

}
},{"../utils":16}],4:[function(require,module,exports){
const { is, random } = require('../utils')

module.exports = {

render(data, $el) {
    if ( is.string(data) ) {
        const separator = $el.attr('separator') || ','
        data = data.split(separator)
    }
    if ( !is.array(data) ) throw 'invalid data, must be string or array'
    const html = data
        .map( d => `<option value="${d.trim()}"></option>` )
        .join('')
    $el.next('datalist').html(html)
},

init($el) {
    const id = random()
    $el.attr('list', id)
    $el.after(`<datalist id=${id}>`)

    $el.click(e => $el.val(''))
},

}
},{"../utils":16}],5:[function(require,module,exports){
const { is } = require('../utils')

module.exports = {

render(data, $el) {
    if ( is.string(data) ) {
        const separator = $el.attr('separator') || ','
        data = data.split(separator)
    }
    if ( !is.array(data) ) throw 'invalid data, must be string or array'
    const html = data
        .map( d => `<li>${d.trim()}</li>` )
        .join('')
    $el.html(html)
},

}
},{"../utils":16}],6:[function(require,module,exports){
const { is, onMobile, prepTemplate } = require('../utils')

module.exports = {

render(data, $el) {
    var el = $el[0]
    var name = $el.attr('prop') || $el.attr('name')

    if (!name) return rasti.error('Could not resolve name of element:', el)

    if ( is.string(data) ) data = data.split(', ')
    if ( !is.array(data) ) throw 'invalid data, must be string or array'

    $el[0].total = data.length // WARNING : SIDE EFFECTS

    const filter = $el.hasAttr('filter')
        ? `<input field type="text" placeholder="${ $el.attr('filter') }"/>`
        : ''

    const template = prepTemplate(d => `<option value="${d.value}" alias="${d.alias}">${d.label}</option>`)

    $el.closest('[page]').find('[options='+ name +']')
        .html( filter + template(data) )
},

init($el) {
    var el = $el[0]
    var name = $el.attr('prop') || $el.attr('name')

    if (!name) return rasti.error('Could not resolve name of element:', el)
    
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

    $el.addClass('field')
    $el.html('<div selected/><div add/>')
    $el.closest('[page]').children('.page-options')
        .append('<div block=multi section options='+ name +'>')
    var $selected = $el.find('[selected]')
    var $options = $el.closest('[page]').find('[options='+ name +']')

    // bindings

    $el.on('click', function(e) {
        e.stopPropagation()
        $options.siblings('[options]').hide() // hide other options
        if ( onMobile() ) $options.parent().addClass('backdrop')
        $options.css('left', this.getBoundingClientRect().right).show()
        $options.find('input').focus()
    })

    $el.closest('[page]').on('click', '*:not(option)', function(e) {
        if ( $(e.target).attr('name') === name
          || $(e.target).parent().attr('name') === name ) return
        if ( onMobile() ) $options.parent().removeClass('backdrop')
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
            $selected.append($opt)
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

    if ( !onMobile() )
        $options.on('click', function(e) { $options.find('input').focus() })

    $options.on('input', 'input', function(e) {
        this.value
            ? $options.find('option').hide().filter('[alias*='+ this.value +']').show()
            : $options.find('option').show()
    })

    $el.on('change', function(e, params){
        if (params && params.ui) return // change triggered from ui, do nothing
        $selected.children().each(function(i, el) {
            $options.append(el)
        })
        for (var val of el.value) {
            $selected.append($options.find('[value="'+ val +'"]'))
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
            if ( onMobile() ) $options.parent().removeClass('backdrop')
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
    [block=multi]:not([options]) {
        display: flex;
        min-height: 35px;
        padding-right: 0;
        text-shadow: 0 0 0 #000;
        cursor: pointer;
    }
    [block=multi] [add] {
        display: flex;
        align-items: center;
        width: 30px;
        border-left: 1px solid rgba(0,0,0,0.2);
    }
    [block=multi] [add]:before {
        content: '〉';
        padding-left: 10px;
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
        padding: 6px 0;
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
},{"../utils":16}],7:[function(require,module,exports){
const { random, prepTemplate } = require('../utils')

module.exports = {

render(data, $el) {
    const uid = random()
    const template = prepTemplate(d => `<div><input type="radio" name="${uid}" value="${d.value}"/><label>${d.label}</label></div>`)
    $el.html( template(data) )
},

init($el) {
    $el[0].value = ''
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

}
},{"../utils":16}],8:[function(require,module,exports){
const { prepTemplate } = require('../utils')

module.exports = {

render(data, $el) {
    const template = prepTemplate(d => `<option value="${d.value}">${d.label}</option>`)
    $el.html( template(data) )
},

init($el) {
    var imgpath = $el.attr('img')
    if (!imgpath) return

    var $selected = $el.find('[selected]'),
        $wrapper = $('<div select>'),
        $options = $('<div options>')

    // clone original select
    for (var attr of $el[0].attributes) {
        $wrapper.attr(attr.name, attr.value);
    }
    // wrap with clone
    $el.wrap($wrapper)
    // regain wrapper ref (it is lost when wrapping)
    $wrapper = $el.parent()
    // add caret
    $wrapper.append('<div caret>&#9660</div>')

    if (!$el.attr('data')) {
        // clone original options
        $el.find('option').each(function(i, opt) {
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
        $wrapper.val($opt.attr('value'))
        setImg($wrapper, imgpath)
    })

    // remove original select
    $el.remove()

    function setImg($el, basepath) {
        $el.css('background-image', 'url('+ basepath + ($el.val() || $el.attr('value')) +'.png)')
    }

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

},{"../utils":16}],9:[function(require,module,exports){
const { is } = require('../utils')

module.exports = {

render(data, $el) {
    let head, body
    try {
        if (is.array(data)) {
            headers = Object.keys(data[0])
            head = headers.map( h =>`<th>${h}</th>` ).join('')
            body = data.map( obj => '<tr>'
                + headers.map( key => `<td>${obj[key]}</td>` ).join('') 
                + '</tr>' )
        }
        else if (is.string(data)) {
            const separator = $el.attr('separator') || ','
            data = data.split(/[\n]/)
                .map(row => row.split(separator))
            head = data.shift().map( h =>`<th>${h.trim()}</th>` ).join('')
            body = data.map( row => '<tr>'
                + row.map( v => `<td>${v.trim()}</td>` ).join('') 
                + '</tr>' ).join('')
        }
        else throw 'invalid data, must be array or string'
        $el.html(
            '<thead><tr>'
            + head
            + '</tr></thead><tbody>'
            + body
            + '</tbody>'
        )
    } catch(err) {
        throw 'Parsing error: ' + err
    }
        
},

}
},{"../utils":16}],10:[function(require,module,exports){
const { is, resolveAttr } = require('./utils')

class History {

    constructor(app) {
        this.app = app
        this.clear()
        app.history = {}
        Object.defineProperties(app.history, {
            back : { value : this.back.bind(this) },
            forward : { value : this.forward.bind(this) },
            clear : { value : this.clear.bind(this) },
        })
    }

    push(page) {
        this.i += 1
        this.content.splice(this.i, null, page)
    }

    back() {
        if (this.i > 0) {
            this.i -= 1
            this.app.navTo(this.content[this.i], {}, true)
        }
    }

    forward() {
        if (this.i < this.content.length -1) {
            this.i += 1
            this.app.navTo(this.content[this.i], {}, true)
        }
    }

    clear() {
        this.i = -1
        this.content = []
    }
}


class Pager {

    constructor(id, results, sizes) {
        this.id = id
        if ( !is.string(id) ) return rasti.error('Pager id must be a string')
        this.logid = `Pager for template [${ this.id }]:`
        if ( !is.array(results) ) return rasti.error('%s Results must be an array', this.logid)
        this.results = results
        if ( !is.array(sizes) || !is.number(sizes[0]) ) return rasti.error('%s Page sizes must be an array of numbers', this.logid)
        this.sizes = sizes
        this.setPageSize(this.sizes[0])
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
            const i = (page -1) * this.page_size
            return this.results.slice(i, i + this.page_size)
        }
        catch(err) {
            rasti.error('%s Could not get results of page %s, error:', this.logid, page, err)
            return []
        }
    }

}


function state(app, app_id) {
    function invalid() {
        rasti.error('Saved state for app [%s] is invalid', app_id)
    }

    return Object.defineProperties({}, {
        page  : { get : _ => app.active.page.attr('page'), enumerable : true },
        theme : { get : _ => app.active.theme, enumerable : true },
        lang  : { get : _ => app.active.lang, enumerable : true },
        save : { value : _ => {
            app.state.props = Object.filter(app.props, ([k, v]) => !(v && v.__trans))
            localStorage.setItem('rasti.' + app_id, JSON.stringify(app.state))
            rasti.log('State saved')
        } },
        get : { value : _ => {
            let state
            try {
                state = JSON.parse( localStorage.getItem('rasti.' + app_id) )
                if ( !state ) rasti.log('No saved state found for app [%s]', app_id)
                else if ( !is.object(state) ) invalid()
                else return state
            }
            catch(err) {
                invalid()
            }
        } },
        restore : { value : _ => {
            const state = app.state.get()
            if (state) {
                rasti.log('Restoring state...')
                app.props = state.props
                if (state.theme) app.setTheme(state.theme)
                if (state.lang) app.setLang(state.lang)
                rasti.log('State restored')
            }
            return state
        } },
        clear : { value : _ => {
            window.localStorage.removeItem('rasti.' + app_id)
        } },
    })
}


function crud(app) {
    function checkDataSource(fn) {
        return (metadata, ...args) => {
            const data = app.data[metadata.datakey]
            if (!data) {
                rasti.error('Undefined data source "%s"', metadata.datakey)
                return false
            }
            metadata.data = data
            return fn(metadata, ...args)
        }
    }

    function checkCrudMethod(methodname, fn) {
        return (metadata, ...args) => {
            // FIXME: app ns is not available here
            const crudns = app.crud[metadata.crudns]
            const method = crudns && crudns[methodname]
            if (method && !is.function(method)) {
                rasti.error('Illegal crud method "%s", must be a function!', name)
                return false
            }
            if (!method) method = Promise.resolve
            return method(...args)
                    .then(
                        ok => fn(metadata, ...args),
                        err => rasti.error('Could not %s element in %s', methodname, metadata.datakey)
                    )
        }
    }

    function exists(el, arr) {
        return is.object(el)
            ? arr.find(d => d.id === el.id)
            : arr.indexOf(el) > -1
    }

    return {
        create : checkDataSource(
            checkCrudMethod('create',
            (data, datakey, newel) => {
                const exists = exists(newel, data)
                if (exists) {
                    rasti.warn('Element [%s] already exists in data source [%s]', newel.id || newel, datakey)
                }
                else {
                    if (is.object(newel)) newel.id = newel.id || datakey + '-' + Date.now()
                    data.push(newel)
                }
                return !exists
            }
        )),

        delete : checkDataSource(
            checkCrudMethod('delete',
            (data, datakey, id) => {
                const el = data.length && (is.object(data[0]) ? data.find(el => el.id === id) : id)
                !el
                    ? rasti.warn('Element [%s] not found in data source [%s]', id, datakey)
                    : data.remove(el)
                return el
            }
        )),

        update : checkDataSource(
            checkCrudMethod('update',
            (data, datakey, el, newel) => {
                const exists_el = exists(el, data)
                const exists_newel = exists(newel, data)
                if (!exists_el) rasti.warn('El [%s] not found in data source [%s]', el, datakey)
                if (exists_newel) rasti.warn('El [%s] already exists in data source [%s]', newel, datakey)
                const valid = exists_el && !exists_newel
                if (valid) data.update(el, newel)
                return valid
            }
        )),

        genInputEl : $el => {
            const template = app.templates[ resolveAttr($el, 'template') ]

            if (!template.props) {
                // extract props from the template's html
                // and generate a props object with placeholder values
                const regexp = /data\.([a-z]*)/g
                let props = {}
                let prop
                while (prop = regexp.exec(template.html)) {
                  props[ prop[1] ] = prop[1]
                }
                // if no props are found, assume data are strings
                // hence, replace the empty props object with the newEl string
                if (!Object.keys(props).length) props = app.options.newEl
                // cache the props in the template
                template.props = props
                rasti.log('Props:', props)
            }
            // create a dummy element using the (self-)extracted props
            const inputEl = $('<div class=rasti-crud-input contenteditable>' + template( [template.props] ) +'</div>')

            // TODO: identify prop elements within the inputEl element and apply [contenteditable] only to them

            $el.append(inputEl)
        },

        genDataEl : $el => {
            const template = app.templates[ resolveAttr($el, 'template') ]
            const values = $el.find('.rasti-crud-input')
            let dataEl
            if ( is.object(template.props) ) {
                dataEl = {}
                Object.keys(template.props).forEach( (key, i) => {
                    dataEl[key] = values[i].innerHTML
                })
            }
            else dataEl = values[0].innerHTML
            return dataEl
        },

        showInputEl : $el => {
            $el.find('.rasti-crud-input').show()
        },

        hideInputEl : $el => {
            $el.find('.rasti-crud-input').hide()
        },

        persistNewEl : $el => {
            $el.find('.rasti-crud-input').removeClass('.rasti-crud-input')
                .find('[contenteditable]').removeAttr('[contenteditable]')
            app.crud.genInputEl($el)
        },
    }
}


module.exports = {
    History,
    Pager,
    state,
    crud,
}

},{"./utils":16}],11:[function(require,module,exports){
const { is } = require('./utils')

// prototype extensions
Object.defineProperties(Array.prototype, {
    get : { value : function(i) {
       return i < 0 ? this[this.length + i] : this[i]
    }},
    new : { value : function(el, i) {
        i = i || this.length
        var isNew = this.indexOf(el) < 0
        if (isNew) this.splice(i, 0, el)
        return isNew
    }},
    remove : { value : function(el) {
        this.update(el)
    }},
    update : { value : function(el, newel) {
        var i = this.indexOf(el)
        var found = i > -1
        if (found) this.splice(i, 1, newel)
        return found
    }},
    capitalize : { value : function() {
       return typeof this == 'string' && this.length && this[0].toUpperCase() + this.slice(1).toLowerCase()
    }},
})

Object.filter = (obj, predicate) => {
    const traverse = (obj, predicate) => Object.fromEntries(
        Object.entries(obj)
            .filter(predicate)
            .map(([k, v]) => 
                is.object(v) ? [k, traverse(v, predicate)] : [k, v]
            )
    )
    return traverse(obj, predicate)
}

// $ extensions
$.fn.hasAttr = function(name) {
    return this[0] && this[0].hasAttribute(name)
}

;['show', 'hide'].forEach(method => {
    var origFn = $.fn[method]
    $.fn[method] = function() {
        const isSpecial = this.hasAttr('menu') || this.hasAttr('modal') || this.hasAttr('sidemenu')
        if (isSpecial) {
            document.body.style.setProperty("--elem-h", this[0].orig_h)
            const backdrop = this.closest('[rasti]').find('.rs-backdrop')
            if (method == 'show') {
                this.addClass('open')
                backdrop.addClass('backdrop')
                this[0].visible = true
                origFn.call(this)
            }
            if (method == 'hide') {
                this.removeClass('open')
                this.addClass('close')
                backdrop.removeClass('backdrop')
                this[0].visible = false
                setTimeout( () => {
                    this.removeClass('close')
                    origFn.call(this)
                }, 500)
            }
        }
        else origFn.call(this)
        return this
    }
})

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

    if (!object.hasAttr('move')) object.attr('move', '')

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

},{"./utils":16}],12:[function(require,module,exports){
module.exports = {

stack : $el => {
    $el.addClass('fx-stack-container')
    const $children = $el.children()
    $children.each( (i, el) => {
        el.classList.add('fx-stack-el')
        setTimeout( _ => {
            el.classList.remove('fx-stack-el')
        }, i * 50)
    })
    setTimeout( _ => {
        $el.removeClass('fx-stack-container')
    }, $children.length * 50 + 500)
},

stamp : $el => {
    $el.addClass('fx-stamp-container')
    const $children = $el.children()
    $children.each( (i, el) => {
        el.classList.add('fx-stamp-el')
        setTimeout( _ => {
            el.classList.remove('fx-stamp-el')
        }, i * 60)
    })
    setTimeout( _ => {
        $el.removeClass('fx-stamp-container')
    }, $children.length * 60 + 500)
},

toast : $el => {
    $el.addClass('active')
    setTimeout( _ => {
        $el.removeClass('active')
    }, 4000)
},


}
},{}],13:[function(require,module,exports){
module.exports = {

app : {
    user : '👤',
    users : '👥',
    gear : '⚙️',
    lock : '🔒',
    'open-lock' : '🔓',
    key : '🔑',
    home : '🏠',
    exit : '🚪',
    call : '📞',
    search : '🔍',
    add : '✚',
    remove : '🗕',
    undo : '↶',
    redo : '↷',
    reload : '⟳',
    sync : '🗘',
    minimize : '🗕',
    restore : '🗗',
    maximize : '🗖',
    close : '⨯',
    copy : '🗇',
    accept : '✔️',
    cancel : '✖️',
    play : '▲',
    stop : '■',
    rec : '●',
    select : '⛶',
    select2 : '⬚',
    contrast : '◐',
    contrast2 : '◧',
    contrast3 : '◩',
    bars : '☰',
    'h-dots' : '⋯',
    'v-dots' : '⋮',
    rows : '▤',
    columns : '▥',
    grid : '▦',
    grid2 : '𝍖',
    warning : '⚠',
    error : '⨂',
    ban : '🛇',
    network : '🖧',
    alarm : '🔔',
    'volume-min' : '🔈',
    'volume-mid' : '🔉',
    'volume-max' : '🔊',
    'dim' : '🔅',
    'bright' : '🔆',
    mute : '🔇',
    'alarm-off' : '🔕',
},

office : {
    file : '📄',
    'img-file' : '🖻',
    chart : '📈',
    chart2 : '📊',
    folder : '📂',
    pen : '🖋️',
    pencil : '✏️',
    ballpen : '🖊️',
    crayon : '🖍',
    paintbrush : '🖌️',
    scissors : '✂️',
    clipboard : '📋',
    clip : '📎',
    link : '🔗',
    ruler : '📏',
    ruler2: '📐',
    pin : '📌',
    'safety-pin' : '🧷',
    card : '💳',
    label : '🏷️',
    memo : '📝',
    scroll : '📜',
    book : '📕',
    books : '📚',
    bookmark : '🔖',
    'open-book' : '📖',
    notebook : '📓',
    notepad : '🗒️',
    calendar : '📅',
    calendar2 : '📆',
    envelope : '✉️',
    email : '📧',
    mailbox : '📫',
    package : '📦',
    briefcase : '💼',
    newspaper : '📰',
    cabinet : '🗄️',
    'trash-can' : '🗑️',
},

electronics : {
    laptop : '💻',
    desktop : '🖥️',
    keyboard : '⌨️',
    'pc-mouse' : '🖱️',
    printer : '🖨️',
    smartphone : '📱',
    telephone : '☎️',
    microphone : '🎤',
    'studio-mic' : '🎙️',
    headphones : '🎧',
    camera : '📷',
    'video-camera' : '📹',
    'movie-camera' : '🎥',
    projector : '📽️',
    tv : '📺',
    radio : '📻',
    stereo : '📾',
    loudspeaker : '📢',
    gamepad : '🎮',
    joystick : '🕹️',
    'sd-card' : '⛘',
    cd : '💿',
    minidisc : '💽',
    floppy : '💾',
    tape : '📼',
    battery : '🔋',
    'power-plug' : '🔌',
    level : '🎚',
    knobs : '🎛',
},

tools : {
    bricks : '🧱',
    wrench : '🔧',
    hammer : '🔨',
    pick : '⛏️',
    axe : '🪓',
    tools : '🛠️',
    tools2 : '⚒️',
    toolbox : '🧰',
    clamp : '🗜️',
    bolt : '🔩',
    anchor : '⚓',
    scales : '⚖️',
    'old-key' : '🗝️',
    map : '🗺️',
    compass : '🧭',
    magnet : '🧲',
    abacus : '🧮',
    candle : '🕯',
    bulb : '💡',
    flashlight : '🔦',
    microscope : '🔬',
    telescope : '🔭',
    antenna : '📡',
    satellite : '🛰️',
    stethoscope : '🩺',
    syringe : '💉',
    'test-tube': '🧪',
    alembic : '⚗️',
    'petri-dish' : '🧫',
    watch : '⌚',
    stopwatch : '⏱️',
    clock : '⏰',
    hourglass : '⌛',
    razor : '🪒',
    dagger : '🗡️',
    swords : '⚔️',
    shield : '🛡️',
    bow : '🏹',
    gun : '🔫',
    bomb : '💣',
},

vehicles : {
    skateboard : '🛹',
    scooter : '🛴',
    bicycle : '🚲',
    motorscooter : '🛵',
    motorcycle : '🏍️',
    car : '🚗',
    'race-car' : '🏎️',
    rv : '🚙',
    bus : '🚌',
    minibus : '🚐',
    truck : '🚚',
    ambulance : '🚑',
    'fire-engine' : '🚒',
    metro : '🚇',
    train : '🚄',
    locomotive : '🚂',
    canoe : '🛶',
    sailboat : '⛵',
    speedboat : '🚤',
    motorboat : '🛥️',
    ferry : '⛴️',
    ship : '🚢',
    plane : '✈️',
    'small-plane': '🛩️',
    helicopter : '🚁',
    rocket : '🚀',
    ufo : '🛸',
},

buildings : {
    ecastle : '🏯',
    wcastle : '🏰',
    etemple : '⛩',
    wtemple : '🏛', 
    factory : '🏭',
    building : '🏢',
    mall : '🏬',
    school : '🏫',
    hospital : '🏥',
    mail : '🏣',
    store : '🏪',
    hotel : '🏨',
    'love-hotel' : '🏩',
    bank : '🏦',
    atm : '🏧',
},

characters : {
    teacherm : '👨‍🏫',
    teacherw : '👩‍🏫',
    scientistm : '👨‍🔬',
    scientistw : '👩‍🔬',
    hackerm : '👨‍💻',
    hackerw : '👩‍💻',
    artistm : '👨‍🎨',
    artistw : '👩‍🎨',
    doctorm : '👨‍⚕️',
    doctorw : '👩‍⚕️',
    astronautm : '👨‍🚀',
    astronautw : '👩‍🚀',
    elfm : '🧝‍♂️',
    elfw : '🧝‍♀️',
    fairym : '🧚‍♂️',
    fairyw : '🧚',
    merman : '🧜‍♂️',
    mermaid : '🧜‍♀️',
    magem : '🧙‍♂️',
    magew : '🧙‍♀️',
    geniem : '🧞‍♂️',
    geniew : '🧞‍♀️',
    superherom : '🦸‍♂️',
    superherow : '🦸‍♀️',
    supervillainm : '🦹‍♂️',
    supervillainw : '🦹‍♀️',
    vampirem : '🧛‍♂️',
    vampirew : '🧛‍♀️',
    zombiem : '🧟‍♂️',
    zombiew : '🧟‍♀️',
    jack : '⛄️',
    jack2 : '☃️',
    teddy : '🧸',
},

faces : {
    man : '👨',
    woman : '👩',
    robot : '🤖',
    skull : '💀',
    imp : '👿',
    monster : '👾',
    alien : '👽',
    ghost : '👻',
    goblin : '👺',
    ogre : '👹',
},

animals : {
    hippo : '🦛',
    elefant : '🐘',
    rhino : '🦏',
    monkey : '🐒',
    gorilla : '🦍',
    orangutan : '🦧',
    kangaroo : '🦘',
    sloth : '🦥',
    otter : '🦦',
    sheep : '🐑',
    ram : '🐏',
    goat : '🐐',
    deer : '🦌',
    camel : '🐪',
    horse : '🐎',
    llama : '🦙',
    pig : '🐖',
    cow : '🐄',
    turtle : '🐢',
    rabbit : '🐇',
    squirrel : '🐿️',
    hedgehog : '🦔',
    raccoon : '🦝',
    badger : '🦡',
    skank : '🦨',
    mouse : '🐁',
    rat : '🐀',
    cat : '🐈',
    dog : '🐕',
    leopard : '🐆',
    tiger : '🐅',
    snake : '🐍',
    gecko : '🦎',
    crocodile : '🐊',
    dragon : '🐉',
    dinosaur : '🦕',
    't-rex' : '🦖',
    dolphin : '🐬',
    shark : '🦈',
    whale : '🐋',
    whale2 : '🐳',
    fugu : '🐡',
    nemo : '🐟',
    dori : '🐠',
    crab : '🦀',
    lobster : '🦞',
    squid : '🦑',
    octopus : '🐙',
    penguin : '🐧',
    bird : '🐦',
    dove : '🕊️',
    eagle : '🦅',
    parrot : '🦜',
    peacock : '🦚',
    duck : '🦆',
    swan : '🦢',
    flamingo : '🦩',
    owl : '🦉',
    bat : '🦇',
    turkey : '🦃',
    rooster : '🐓',
    chick : '🐥',
    chick2 : '🐤',
    chick3: '🐣',
    snail : '🐌',
    butterfly : '🦋',
    mosquito : '🦟',
    bee : '🐝',
    ant : '🐜',
    cricket : '🦗',
    bug : '🐛',
    ladybug : '🐞',
    spider : '🕷️',
    scorpion : '🦂',
    microbe : '🦠',
},

plants : {
    leaf : '🍂',
    herb : '🌿',
    maple : '🍁',
    shamrock : '☘️',
    luck : '🍀',
    wheat : '🌾',
    bamboo : '🎋',
    flower : '🌼',
    sunflower : '🌻',
    rose : '🌹',
    hibiscus : '🌺',
    sakura : '🌸',
    tulip : '🌷',
    tree : '🌳',
    pine : '🌲',
    'palm-tree' : '🌴',
    cactus : '🌵',
    sprout : '🌱',
    nut : '🌰',
},

nature : {
    sun : '☀️',
    moon : '🌕',
    'new-moon' : '🌑',
    'crescent-moon' : '🌙',
    fire : '🔥',
    water : '💧',
    wave : '🌊',
    ice : '🧊',
    snowflake : '❄️',
    wind : '💨',
    cloud : '☁️',
    mountain : '⛰️',
    volcano : '🌋',
    rainbow : '🌈',
    globe : '🌏',
    globe2 : '🌎',
    globe3 : '🌍',
    comet : '☄️',
    planet : '🪐',
    galaxy : '🌌',
    dna : '🧬',
    cloudy : '⛅️',
    cloudy2 : '🌥',
    rainwsun : '🌦',
    rain : '🌧',
    storm : '⛈',
    thunder : '🌩',
    snow : '🌨',
    tornado : '🌪',
},

'food & drink' : {
    sandwich : '🥪',
    kebab : '🥙',
    taco : '🌮',
    burrito : '🌯',
    salad : '🥗',
    paella : '🥘',
    burger : '🍔',
    pizza : '🍕',
    'hot-dog' : '🌭',
    fries : '🍟',
    spaghetti : '🍝',
    falafel : '🧆',
    bread : '🍞',
    bread2 : '🥖',
    croissant : '🥐',
    bagel : '🥯',
    pretzel : '🥨',
    butter : '🧈',
    cheese : '🧀',
    egg : '🥚',
    'fried-egg' : '🍳',
    meat : '🥩',
    meat2 : '🍖',
    'chicken-leg' : '🍗',
    bacon : '🥓',
    onigiri : '🍙',
    gohan : '🍚',
    kare : '🍛',
    ramen : '🍜',
    dango : '🍡',
    sashimi : '🍣',
    shrimp : '🍤',
    oyster : '🦪',
    lobster : '🦞',
    soup : '🍲',
    bento : '🍱',
    takeout :'🥡',
    candy : '🍬',
    lollipop : '🍭',
    chocolate : '🍫',
    popcorn : '🍿',
    cookie : '🍪',
    donut : '🍩',
    waffle : '🧇',
    pancakes : '🥞',
    icecream : '🍨',
    icecream2 : '🍦',
    frosty : '🍧',
    pie : '🥧',
    cake : '🍰',
    cupcake : '🧁',
    'moon-cake': '🥮',
    custard : '🍮',
    banana : '🍌',
    strawberry : '🍓',
    cherry : '🍒',
    plum : '🍑',
    pear : '🍐',
    apple : '🍎',
    apple2 : '🍏',
    pineapple : '🍍',
    lemon : '🍋',
    orange : '🍊',
    melon : '🍈',
    watermelon : '🍉',
    mango : '🥭',
    coconut : '🥥',
    kiwi : '🥝',
    grapes : '🍇',
    tomato : '🍅',
    eggplant : '🍆',
    avocado : '🥑',
    broccoli : '🥦',
    cucumber : '🥒',
    greeny : '🥬',
    chili : '🌶',
    corn : '🌽',
    carrot : '🥕',
    potato : '🥔',
    'sweet-potato' : '🍠',
    garlic : '🧄',
    onion : '🧅',
    mushroom : '🍄',
    peanut : '🥜',
    honey : '🍯',
    juice : '🧃',
    tea : '🍵',
    coffee : '☕️',
    milk : '🥛',
    beer : '🍺',
    beers : '🍻',
    cheers : '🥂',
    daikiri : '🍹',
    martini : '🍸',
    whiskey : '🥃',
    wine : '🍷',
    sake : '🍶',
    mate : '🧉',
    forknife : '🍴',
    chopsticks : '🥢',
},

'sports & fun' : {
    running : '🏃',
    biking : '🚴‍♂️',
    climbing : '🧗‍♂️',
    swimming : '🏊',
    surfing : '🏄',
    rowing : '🚣‍♂️',
    diving : '🤿',
    skating : '⛸',
    skiing : '⛷',
    snowboard : '🏂',
    horseride : '🏇',
    yoga : '🧘‍♂️',
    rolling : '🤸‍♂️',
    juggling : '🤹‍♂️',
    basketball : '🏀',
    soccer : '⚽',
    football : '🏈',
    rugby : '🏉',
    volleyball : '🏐',
    beisball : '⚾',
    tennis : '🎾',
    badminton : '🏸',
    'ping-pong' : '🏓',
    hockey: '🏑',
    'ice-hockey': '🏒',
    lacrosse : '🥍',
    'cricket-game' : '🏏',
    golf : '⛳️',
    fishing : '🎣',
    box : '🥊',
    martial : '🥋', 
    frisbee : '🥏',
    bowling : '🎳',
    pool : '🎱',
    die : '🎲',
    puzzle : '🧩',
    slot : '🎰',
    darts : '🎯',
    theatre : '🎭',
    palette : '🎨',
    movie : '🎬',
    party : '🎉',
    party2 : '🎊',
    baloon : '🎈',
    yoyo : '🪀',
    kite : '🪁',
    fireworks : '🎇',
    fireworks2 : '🎆',
    santa : '🎅',
    xmas : '🎄',
    haloween : '🎃',
    birthday : '🎂',
    gift : '🎁',
},

music : {
    note : '🎵',
    notes : '🎶',
    sharp : '♯',
    flat : '♭',
    cleff : '🎼',
    'cleff-g' : '𝄞',
    'cleff-f' : '𝄢',
    'cleff-c' : '𝄡',
    guitar : '🎸',
    banjo : '🪕',
    piano : '🎹',
    violin : '🎻',
    saxophone : '🎷',
    trumpet : '🎺',
    drum : '🥁',
},

clothing : {
    shirt : '👕',
    't-shirt' : '👔',
    shorts : '🩳',
    pants : '👖',
    blouse : '👚',
    dress : '👗',
    sari : '🥻',
    'swim-suit' : '🩱',
    bikini : '👙',
    yukata : '👘',
    vest : '🦺',
    coat : '🧥',
    'lab-coat' : '🥼',
    heels : '👠',
    sandal : '👡',
    ballet : '🩰',
    texan : '👢',
    shoe : '👞',
    snicker : '👟',
    boot : '🥾',
    flats : '🥿',
    socks : '🧦',
    briefs : '🩲',
    gloves : '🧤',
    scarf : '🧣',
    hat : '👒',
    'top-hat' : '🎩',
    cap : '🧢',
    'grad-cap' : '🎓',
    helmet : '⛑',
    crown : '👑',
    pouch : '👝',
    purse : '👛',
    handbag : '👜',
    suitcase : '💼',
    backpack : '🎒',
    glasses : '👓',
    sunglasses : '🕶️',
    goggles : '🥽',
    ribbon : '🎀',
},

other : {
    hand: '✋',
    'thumbs-up' : '👍',
    'thumbs-down' : '👎',
    cool : '🤙',
    metal : '🤘',
    spock : '🖖',
    pinch : '🤏',
    arm : '💪',
    'bionic-arm' : '🦾',
    leg : '🦵',
    'bionic-leg' : '🦿',
    foot : '🦶',
    eye : '👁️',
    ear : '👂',
    'bionic-ear' : '🦻',
    tooth : '🦷',
    bone : '🦴',
    brain : '🧠',
    blood : '🩸',
    'band-aid' : '🩹',
    poo : '💩',
    heart : '❤️',
    hearts : '💕',
    'broken-heart' : '💔',
    star : '⭐',
    trophy : '🏆',
    diamond : '💎',
    jar : '⚱️',
    jar2 : '🏺',
    broom : '🧹',
    cart : '🛒',
    chair : '🪑',
    pill : '💊',
    globe : '🌐',
    flag : '⚑',
    film : '🎞️',
    newbie : '🔰',
    trident : '🔱',
    japan : '🗾',
    fuji : '🗻',
    'tokyo-tower' : '🗼',
    liberty : '🗽',
    picture : '🖼️',
    'crystal-ball' : '🔮',
    recycle : '♻',
    access : '♿',
    hot : '♨️',
    poison : '☠️',
    tension : '⚡',
    radioactive : '☢️',
    biohazard : '☣️',
    bisexual : '⚥',
    trans : '⚧',
    bitcoin : '₿',
},

culture : {
    pommee : '🕂',
    maltese : '✠',
    latin : '✝',
    latin2 : '🕇',
    celtic : '🕈',
    jew : '✡',
    ankh : '☥',
    peace : '☮',
    ohm : '🕉',
    'ying-yang' : '☯',
    atom : '⚛️',
    communism : '☭',
    'moon-star' : '☪',
    health : '⛨',
    darpa : '☸',
    diamonds : '❖',
},

astrology : {
    aries : '♈',
    tauro : '♉',
    gemini : '♊',
    piscis : '♋',
    leo : '♌',
    virgo : '♍',
    libra : '♎',
    scorpio : '♏',
    sagitarius : '♐',
    capricorn : '♑',
    aquarius : '♒',
    cancer : '♓',
    mercury : '☿️',
    venus : '♀',
    earth : '♁',
    mars : '♂',
    jupiter : '♃',
    saturn : '♄',
    uranus : '♅',
    neptune : '♆',
    pluto : '♇',
    ceres : '⚳',
    pallas : '⚴',
    juno : '⚵',
    vesta : '⚶',
    chiron : '⚷',
},

chess : {
    wqueen : '♔',
    wking : '♕',
    wtower : '♖',
    wbishop : '♗',
    whorse : '♘',
    wpawn : '♙',
    bqueen : '♚',
    bking : '♛',
    btower : '♜',
    bbishop : '♝',
    bhorse : '♞',
    bpawn : '♟',
},

arrows : {
    up: '↑',
    down: '↓',
    left: '←',
    right: '→',
    up2: '⇧',
    down2: '⇩',
    left2: '⇦',
    right2: '⇨',
    up3: '△',
    down3: '▽',
    left3: '◁',
    right3: '▷',
},

'keys & shapes' : {
    command : '⌘',
    option : '⌥',
    shift : '⇧',
    'caps-lock' : '⇪',
    backspace : '⌫',
    return : '⏎',
    enter : '⎆',
    escape : '⎋',
    tab : '↹',
    power : '⏻',
    sleep : '⏾',
    triangle : '▲',
    square : '■',
    pentagon : '⬟',
    hexagon : '⬢',
    circle : '●',
    'curved-triangle' : '🛆',
    'curved-square' : '▢',
    'square-quadrant' : '◰',
    'round-quadrant' : '◴',
},

hieroglyphs : {
    'hg-eye' : '𓁹',
    'hg-tear-eye' : '𓂀',
    'hg-ear' : '𓂈',
    'hg-writing-arm' : '𓃈',
    'hg-leg' : '𓂾',
    'hg-watering-leg' : '𓃂',
    'hg-hand' : '𓂧',
    'hg-hand-2' : '𓂩',
    'hg-finger' : '𓂭',
    'hg-open-wound' : '𓂍',
    'hg-arms-hat-spear' : '𓂙',
    'hg-staff' : '𓋈',
    'hg-fan' : '𓇬',
    'hg-jar' : '𓄣',
    'hg-beetle' : '𓆣',
    'hg-wasp' : '𓆤',
    'hg-fairy' : '𓋏',
    'hg-sitting-man' : '𓀀',
    'hg-happy-sitting-man' : '𓁏',
    'hg-sitting-woman' : '𓁑',
    'hg-sitting-bird-man' : '𓁟',
    'hg-sitting-wolf-man' : '𓁢',
    'hg-dancing-man' : '𓀤',
    'hg-broken-arms-man' : '𓀣',
    'hg-upside-down-man' : '𓀡',
    'hg-dead-guy' : '𓀿',
    'hg-three-legged-guy' : '𓁲',
},

/*

animal faces
🐼🐻🐺🐮🐷🐭🐹🐰🐱🐶🐵🐴🐯🐲🐨🐸🦄

*/

}

},{}],14:[function(require,module,exports){
(function (global){
require('./extensions')
const { History, Pager, state, crud } = require('./components')
const utils = require('./utils')
const { is, sameType, exists, resolveAttr, html } = utils
const { themes, themeMaps } = require('./themes')

const options = {
    history : true,
    persist : true,
    root    : '',
    theme   : 'base',
    lang    : '',
    separator : ';',
    stats   : '%n results in %t seconds',
    noData  : 'No data available',
    newEl   : 'New element',
    imgPath : 'img/',
    imgExt  : '.png',
    page_sizes : [5, 10, 20, 50],
}

const breakpoints = {
    phone : 500,
    tablet : 800,
}
const media = {on:{}}
for (let device in breakpoints) {
    const query = window.matchMedia(`(max-width: ${ breakpoints[device] }px)`)
    media[device] = query.matches
    media.on[device] = handler => query.addListener(handler)
}

const TEXT_ATTRS = 'label header text placeholder'.split(' ')
const EVENT_ATTRS = 'click change hover input keydown submit load'.split(' ')
const ACTION_ATTRS = 'show hide toggle'.split(' ')
const NOCHILD_TAGS = 'input select textarea img'.split(' ')

const log = (...params) => {
    if (rasti.options.log.search(/debug/i) > -1) console.log.call(this, ...params)
}
const warn = (...params) => {
    if (rasti.options.log.search(/(warn)|(debug)/i) > -1) console.warn.call(this, ...params)
}
const error = (...params) => {
    console.error.call(this, ...params)
}


function rasti(name, container) {

    const self = this
    const errPrefix = 'Cannot create rasti app: '
    if ( !is.string(name) ) return error(errPrefix + 'app must have a name!')
    name = name.replace(' ', '')

    if ( !container ) container = $('body')
    else if ( !(container.selector) ) {
        if ( is.string(container) || (container.tagName && 'BODY DIV'.search(container.tagName) > -1) ) container = $(container)
        else return error(errPrefix + 'app container is invalid. Please provide a selector string, a jQuery object ref or a DOM element ref')
    }
    container.attr('rasti', name)


    // private properties

    const __name = name
    const __pagers = new Map()
    const __crud = crud(this)
    const __state = {}
    let __history
    let __invalid_data_count = 0


    // public properties

    this.options = Object.assign({}, options)
    this.defaults = {
        stats : this.options.stats,
        noData : this.options.noData,
    }
    this.active = {
        page  : null,
        theme : '',
        lang  : '',
    }
    this.state = state(this, __name)
    this.props = {}
    this.methods = {}
    this.pages = {}
    this.templates = {}
    this.data = {}
    this.langs = {}
    this.themes = themes
    this.themeMaps = themeMaps
    this.sidemenu = null


    // public methods

    this.config = config
    this.init = init
    this.navTo = navTo
    this.render = render
    this.setLang = setLang
    this.setTheme = setTheme
    this.updateBlock = updateBlock
    this.toggleFullScreen = toggleFullScreen


    function config(props) {
        if (!props || !is.object(props)) return error('Cannot configure app [%s]: no properties found', __name)
        for (let key in props) {
            const known = is.object(self[key])
            const valid = is.object(props[key])
            if (!known) {
                warn('Unknown config prop [%s]', key)
                continue
            }
            if (!valid) {
                warn('Invalid config prop [%s], must be an object', key)
                continue
            }
            if ('data methods'.includes(key)) {
                for (let name in props[key]) {
                    const value = props[key][name]
                    if (key == 'methods' && !is.function(value))
                        warn('Invalid method [%s], must be a function', name)
                    else
                        self[key][name] = is.function(value) ? value.bind(self) : value
                }
            }
            else Object.assign(self[key], props[key])
        }
        return self
    }


    function init(options) {
        const initStart = window.performance.now()
        log('Initializing app [%s]...', __name)

        container
            .addClass('big loading backdrop')
            .removeAttr('hidden')

        // cache options
        if (options) {
            if ( !is.object(options) ) warn('Init options must be an object!')
            else Object.keys(self.options).forEach( key => {
                if ( exists(options[key]) ) {
                    if ( !sameType(self.options[key], options[key])  ) warn('Init option [%s] is invalid', key)
                    else self.options[key] = options[key]
                }
            })
        }


        // apply defaults
        Object.keys(self.defaults).forEach( key => {
            //if (!self.options[key]) self.options[key] = self.defaults[key]
        })


        // define lang (if applicable)
        if (!self.options.lang) {
            const keys = Object.keys(self.langs)
            if (keys.length) self.options.lang = keys[0]
        }


        // append theme style container
        container.append('<style class=rs-theme>')

        // append backdrop container
        container.append('<div class=rs-backdrop>')

        // append page-options containers
        container.find('[page]').each( (i, el) => {
            $(el).append('<div class="page-options">')
        })


        // fix labels
        NOCHILD_TAGS.forEach( tag => {
            container.find(tag + '[label]').each( (i, el) => {
                fixLabel($(el))
            })
        })


        // fix input icons
        container.find('input[icon]').each( (i, el) => {
            fixIcon($(el))
        })


        // init blocks
        container.find('[data]:not([template])').each( (i, el) => {
            updateBlock($(el))
        })


        initSideMenu()


        initModals()
        
        
        // init tabs
        function initTabs(selector) {
            container.find(selector).each( (i, el) => { createTabs(el) })
        }
        initTabs('.tabs')
        if (media.tablet || media.phone) initTabs('.tabs-tablet')
        if (media.phone) initTabs('.tabs-phone')


        // init [nav] bindings
        initNav()


        // init [submit] bindings
        initSubmit()


        // init [render] bindings
        container.on('click change', '[render]:not([submit])', e => {
            const el = e.currentTarget
            const template = el.getAttribute('render')
            if (!template) return error('Missing template name in [render] attribute of element:', el)
            render(template)
        })


        // init element dependencies
        container.find('[bind]').each( (i, el) => {
            const $el = $(el)
            const deps = $el.attr('bind')
            if (deps) deps.split(' ').forEach( dep => {
                $el.closest('[page]').find('[prop='+ dep +']')
                    .change( e => { updateBlock($el) })
            })
        })


        initPages()


        // resolve empty attributes
        TEXT_ATTRS.forEach( attr => {
            let $el
            container.find('['+attr+'=""]').each( (i, el) => {
                $el = $(el)
                $el.attr( attr, resolveAttr($el, attr) )
            })
        })


        // resolve bg images
        container.find('[img]').each( (i, el) => {
            let path = resolveAttr($(el), 'img')
            if (path.indexOf('/')==-1) path = self.options.imgPath + path
            if (path.charAt(path.length-4)!='.') path += self.options.imgExt
            el.style['background-image'] = `url(${path})`
        })


        // init internal history (if applicable)
        if (self.options.history) {
            __history = new History(self)
            // bind nav handler to popstate event
            window.onpopstate = e => {
                var page = e.state || location.hash.substring(1)
                page
                    ? e.state ? navTo(page, null, true) : navTo(page)
                    : navTo(self.options.root)
            }
        }

        
        bindProps(container, self.props)

        
        initState()


        // render data templates
        container.find('[data][template]').each( (i, el) => {
            render(el)
        })


        // init prop-bound templates
        container.find('[prop][template]').each( (i, el) => {
            const $el = $(el)
            const prop = $el.attr('prop')
            bindElement($el, {prop}, self.props)
        })


        // init crud templates
        initCrud()

        
        initEvents()


        initActions()


        initFieldValidations()


        // init movable elements
        container.find('[movable]').each( (i, el) => {
            $(el).move()
        })


        // cache height of foldable elements
        container.find('[foldable]').add('[menu]').each( (i, el) => {
            el.orig_h = el.clientHeight + 'px'
        })


        container
            .on('click', '[foldable]', e => {
                const el = e.target
                if (!el.hasAttribute('foldable')) return
                const isOpen = el.clientHeight > 30
                document.body.style.setProperty("--elem-h", el.orig_h)
                if (isOpen) {
                    el.classList.remove('open')
                    el.classList.add('folded')
                }
                else {
                    el.classList.remove('folded')
                    el.classList.add('open')
                }
            })
            .on('click', '.backdrop', e => {
                container.find('[menu].open').hide()
                container.find('[modal].open').hide()
                if (self.sidemenu && self.sidemenu.visible) self.sidemenu.hide()
            })
            .removeClass('big loading backdrop')

        const initTime = Math.floor(window.performance.now() - initStart) / 1000
        log('App [%s] initialized in %ss', __name, initTime)

        return self
    }


    function navTo(pagename, params = {}, skipPushState) {

        if (!pagename) return error('Cannot navigate, page undefined')

        var $prevPage = self.active.page,
            prevPagename = $prevPage && $prevPage.attr('page'),
            prevPage = prevPagename && self.pages[prevPagename]

        if (pagename == prevPagename) return

        var page = self.pages[pagename],
            $page = container.find('[page='+ pagename +']')

        if (!$page.length) return error('Cannot navigate to page [%s]: page container not found', pagename)

        container.find('[menu]').hide()
        container.find('.rs-backdrop').removeClass('backdrop')

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

        $page.hasClass('hide-nav')
            ? container.find('nav').hide()
            : container.find('nav').show()

        $page.addClass('active')

        container
            .find('nav [nav]').removeClass('active')
            .filter('[nav='+ pagename +']').addClass('active')

        container.trigger('rasti-nav')

        if (skipPushState) return

        if (self.options.history)
            __history.push(pagename)
        
        let hash
        if (page && page.url)
            is.string(page.url)
                ? hash = '#' + page.url
                : warn('Page [%s] {url} property must be a string!', pagename)
        
        window.history.pushState(pagename, null, hash)

        return self
    }


    function render(el, data, time) {
        let $el, name
        let errPrefix = 'Cannot render template'
        if ( is.string(el) ) {
            name = el
            errPrefix += ' ['+ name +']: '
            $el = container.find('[template='+ name +']')
            if (!$el.length) return error(errPrefix + 'no element bound to template. Please bind one via [template] attribute.')
        }
        else {
            $el = el.nodeName ? $(el) : el
            name = $el.attr('template')
            if (!name) {
                // assign hashed name
                name = ($el.attr('data') || $el.attr('prop')) + '-' + Date.now()
                $el.attr('template', name)
            }
        }
        
        if ( !data && $el.hasAttr('data') ) {
            const datakey = resolveAttr($el, 'data')
            data = self.data[datakey]
            if (!data) return error(errPrefix + 'undefined data source "%s" resolved for element:', datakey, el)
        }
        if ( is.string(data) ) data = data.split( $el.attr('separator') || self.options.separator )
        if ( !is.array(data) ) data = [data]

        let template = self.templates[name]
        let html
        if ( !template || is.string(template) ) try {
            html = template || $el.html()
            html = html.trim()
            template = genTemplate(html)
            template.html = html
            self.templates[name] = template
        }
        catch(err) {
            return error(errPrefix + 'parsing error: ' + err)
        }
        if ( !is.function(template) ) return error(errPrefix + 'template must be a string or a function')

        if ( data && !data.length ) return $el.html(`<div class="nodata">${ self.options.noData }</div>`).addClass('rendered')

        const isCrud = $el.hasAttr('crud')
        if (isCrud) {
            if (is.object(data[0]) && !data[0].id) data.forEach((el, i) => el.id = i)
            //log('crud data:', data)
            const el_controls =
                '<div class="rasti-crud right centery small_ round_ inline_" data-id=${ rasti.utils.is.object(data) ? data.id : data }>\
                    <div class="rasti-crud-update" icon=edit></div>\
                    <div class="rasti-crud-delete" icon=trash-can></div>\
                </div>'
            html = append(template.html, el_controls)
            template = genTemplate(html)
            template.html = html
        }

        const isPaged = $el.hasAttr('paged')
        isPaged
            ? initPager($el, template, data, getActiveLang())
            : $el.html( template(data) )[0].scrollTo(0,0)

        if ( $el.hasAttr('stats') ) {
            const stats = '<div section class="stats">'
                + self.options.stats.replace('%n', data.length).replace('%t', time)
                + '</div>'
            $el.prepend(stats)
        }

        if (isCrud) {
            const container_controls = `
                <div class="rasti-crud right small_ round_ ">
                    <div class="rasti-crud-create" icon=star></div>
                    <div class="rasti-crud-accept" icon=accept></div>
                    <div class="rasti-crud-cancel" icon=cancel></div>
                </div>`
            $el.prepend(container_controls)
            __crud.genInputEl($el)
        }

        $el.addClass('rendered')
        if (!isPaged) applyFX($el)

        return self
    }


    function setLang(langName) {
        var lang = self.langs[ langName ],
            errPrefix = 'Cannot set lang [%s]: '

        if (!lang) return error(errPrefix + 'lang not found', langName)
        if ( !is.object(lang) ) return error(errPrefix + 'lang must be an object!', langName)

        log('Setting lang [%s]', langName)
        self.active.lang = langName

        var $elems = $(), $el, keys, string

        TEXT_ATTRS.forEach( attr => {
            $elems = $elems.add('['+attr+']')
        })

        $elems.each( (i, el) => {
            if (el.hasAttribute('fixed')) el = el.children[0]
            $el = $(el)
            keys = el.langkeys

            if (!keys) {
                keys = {}
                TEXT_ATTRS.forEach( attr => {
                    if ($el.attr(attr)) keys[attr] = $el.attr(attr)
                })
                el.langkeys = keys
            }

            for (let attr in keys) {
                string = getString(langName, keys[attr])
                attr === 'text'
                    ? $el.text(string || keys[attr])
                    : string ? $el.attr(attr, string) : null
            }
        })

        Object.keys(self.defaults).forEach( key => {
            self.options[key] = lang['rasti_'+key] || self.defaults[key]
        })

        return self
    }


    function setTheme(themeString) {
        if (!themeString) return warn('Call to setTheme() with no argument')

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

        // clone themeMap
        themeMap = {...themeMap}

        var values = { font : theme.font || baseTheme.font, },
            colorNames, colors, c1, c2, defaultColorName

        // map palette colors to attributes
        for (let attr of Object.keys(baseMap)) {
            colorNames = themeMap[attr] || baseMap[attr]
            colorNames = [c1, c2] = colorNames.split(' ')
            colors = [theme.palette[ c1 ], theme.palette[ c2 ]]

            for (let i in colors) {
                defaultColorName = baseMap[attr].split(' ')[i]
                if (defaultColorName && !colors[i]) {
                    // look for color in base palette
                    colors[i] = baseTheme.palette[ colorNames[i] ]
                    if (!colors[i]) {
                        warn('Color [%s] not found in theme nor base palette, using it as is', colorNames[i])
                        colors[i] = colorNames[i]
                        /*
                        warn('Mapping error in theme [%s] for attribute [%s]. Color [%s] not found. Falling back to default color [%s].', themeName, attr, colorNames[i], defaultColorName)
                        colors[i] = baseTheme.palette[ defaultColorName ]
                        */
                    }
                }
            }

            values[attr] = colors
            if (themeMap[attr]) delete themeMap[attr]
        }

        var invalidKeys = Object.keys(themeMap)
        if (invalidKeys.length) warn('Ignored %s invalid theme map keys:', invalidKeys.length, invalidKeys)

        // generate theme style and apply it
        container.find('.rs-theme').html( getThemeStyle(values) )

        // apply bg colors
        var colorName, color
        container.find('[bg]').each( (i, el) => {
            colorName = el.getAttribute('bg')
            color = theme.palette[colorName] || baseTheme.palette[colorName]
            if (!color) warn('Color [%s] not found in theme palette, using it as is', colorName, el)
            el.style['background-color'] = color || colorName
        })

        return self
    }


    function updateBlock($el, data) {
        const el = $el[0]
        let type = $el.attr('block') || el.nodeName.toLowerCase()
        if ('ol ul'.includes(type)) type = 'list'
        if (!type) return error('Missing block type in [block] attribute of element:', el)

        const block = rasti.blocks[type]
        if (!block) return error('Undefined block type "%s" declared in [block] attribute of element:', type, el)

        if (!el.initialized) {
            if (exists(block.init) && !is.function(block.init))
                return error('Invalid "init" prop defined in block type "%s", must be a function', type)
            if (is.function(block.init))
                block.init($el)
            el.initialized = true
        }

        if (!data) {
            const datakey = resolveAttr($el, 'data')
            if (!datakey) return

            data = self.data[datakey]
            if (!exists(data)) return warn('Detected non-existant data ref in data source "%s" declared in [data] attribute of element:', datakey, el)
            if (is.empty(data)) return
        }

        const deps = $el.attr('bind')
        const depValues = {}
        if (deps) deps.split(' ').forEach( prop => {
            depValues[prop] = $('[prop='+ prop +']').val()
        })

        is.function(data)
            ? data(render, depValues)
            : render(data)

        function render(data) {
            if (!exists(data)) warn('Detected non-existant data ref when trying to render element', el)
            if (is.empty(data)) return
            else try {
                block.render(data, $el)
            } catch(err) {
                error('Cannot render block: ' + err, el)
            }
            // TODO : handle invalid data count side-effect
            /*
            if (invalidData) {
                var prop = $el.attr('prop'),
                    page = $el.closest('[page]').attr('page')
                warn('Detected %s invalid data entries for prop [%s] in page [%s]', invalidData, prop, page)
                invalidData = 0
            }
            */
        }

        return self
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
        return self
    }


    // internal utils

    function genTemplate(tmp_string) {
        return tmp_data => evalTemplate(
            tmp_string,
            tmp_data,
            self.data,
            self.props,
            self.methods,
            getActiveLang(),
        )
    }

    function evalTemplate(tmp_string, tmp_data, data, props, methods, lang) {
        try {
            return tmp_data
                ? tmp_data.map(el => eval('html`'+tmp_string+'`'))
                : eval('html`'+tmp_string+'`')
        } catch (err) {
            error('Error evaluating template string\n%s:', tmp_string, err.message)
        }
    }

    function append(html, appendix) {
        return html.substring(0, html.length-6).concat(appendix + '</div>')
    }

    function applyFX($el, selector) {
        const el = $el[0]
        const fxkey = $el.attr('fx')
        if (!fxkey) return
        const fx = rasti.fx[fxkey]
        if (!fx) return warn('Undefined fx "%s" declared in [fx] attribute of element', fxkey, el)
        if ( !is.function(fx) ) return error('fx.%s must be a function!', fxkey)
        if ( selector && !is.string(selector) ) return error('Cannot apply fx, invalid selector provided for el', el)
        const $target = selector ? $el.find(selector) : $el
        if (!$target.length) return warn('Cannot apply fx, cannot find target "%s" in el', target, el)
        fx($target)
    }

    function getActiveLang() {
        return self.langs && self.langs[self.active.lang]
    }

    
    function bindProps($container, state) {
        $container.children().each( (i, el) => {
            const $el = $(el)
            const prop = $el.attr('prop')
            let trans

            if (prop && !$el.hasAttr('template')) {
                if ( $el.hasAttr('transient') ) trans = true
                
                if ( exists(el.value) ) {
                    // it's an element, so bind it
                    bindElement($el, {prop, trans}, state)
                }
                else {
                    // it's a container prop
                    const defobjval = {}
                    if (trans) defobjval.__trans = true
                    // go down one level in the state tree
                    state[prop] = state[prop] || defobjval
                    const newroot = state[prop]
                    // and keep looking
                    bindProps($el, newroot)
                }
            }
            // else keep looking
            else if (el.children.length) bindProps($el, state)
        })
    }

    function bindElement($el, {prop, trans}, state){
        if ( state[prop] ) {
            // then update dom with it
            updateElement($el, state[prop])
        }
        else {
            // create empty state
            const defstrval = new String('')
            if (trans) defstrval.__trans = true
            state[prop] = defstrval
        }

        // update state on dom change
        // (unless triggered from state _setter)
        $el.on('change', (e, params) => {
            if ( !(params && params._setter) )
                state[prop] = $el.is('[type=checkbox]') ? $el[0].checked : $el.val()
        })

        // update dom on state change
        Object.defineProperty(state, prop, {
            get : function() { return __state[prop] },
            set : function(value) {
                if (trans) {
                    const val = is.string(value) ? new String(value) : value
                    val.__trans = true
                    __state[prop] = val
                }
                else __state[prop] = value
                updateElement($el, value, true)
            }
        })

    }

    function updateElement($el, value, _setter) {
        if ( $el.is('[template]') )
            render($el, value)
        else {
            $el.is('textarea')
                ? $el.text( value )
            : $el.is('[type=checkbox]')
                ? $el[0].checked = !!value
            : $el.val( value )

            $el.trigger('change', {_setter})
        }
    }


    function initPages() {
        let page, $page
        for (let name in self.pages) {
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
    }


    function initState() {
        // persist state (if applicable)
        let prev_state
        if (self.options.persist) {
            $(window).on('beforeunload', e => { self.state.save() })
            prev_state = self.state.restore()
        }
        // set theme (if not already set)
        if (!self.active.theme)
            setTheme(self.options.theme)
        // set lang (if applicable and not already set)
        if (self.options.lang && !self.active.lang)
            setLang(self.options.lang)
        // if no lang, generate texts
        if (!self.options.lang) {
            container.find('[text]').each((i, el) => {
                $(el).text($(el).attr('text'))
            })
        }
        if (prev_state)
            navTo(prev_state.page)
        else {
            // nav to page in hash or to root or to first page container
            const page = location.hash.substring(1) || self.options.root
            navTo(page && self.pages[page]
                ? page
                : container.find('[page]').first().attr('page'))
        }
    }


    function initNav() {
        container.on('click', '[nav]', e => {
            const el = e.currentTarget
            const $el = $(el)
            const page = $el.attr('nav')
            let params = {}
            if (!page)
                return error('Missing page name in [nav] attribute of element:', el)
            if ($el.hasAttr('params')) {
                const $page = self.active.page
                let navparams = $el.attr('params')
                let $paramEl
                if (navparams) {
                    // check to see if params is an object
                    if (navparams[0] == '{') {
                        try {
                            params = JSON.parse(navparams)
                        }
                        catch (err) {
                            error('Invalid JSON in [params] attribute of element:', el)
                            error('Tip: be sure to use double quotes ("") for both keys and values')
                            return
                        }
                    }
                    else {
                        // get values of specified navparams
                        navparams = params.split(' ')
                        navparams.forEach(key => {
                            $paramEl = $page.find('[navparam=' + key + ']')
                            if ($paramEl.length)
                                params[key] = $paramEl.val()
                            else
                                warn('Could not find navparam element [%s]', key)
                        })
                    }
                }
                else {
                    // get values of all navparams in page
                    $page.find('[navparam]').each((i, el) => {
                        const $el = $(el)
                        const key = resolveAttr($el, 'navparam')
                        if (key)
                            params[key] = $el.val()
                    })
                }
            }
            navTo(page, params)
        })
    }


    function initSubmit() {
        container.on('click', '[submit]', e => {
            const $el = $(e.target)
            const method = $el.attr('submit')
            const callback = $el.attr('then')
            const template = $el.attr('render')
            const isValidCB = callback && is.function(self.methods[callback])
            const start = window.performance.now()
            if (!method)
                return error('Missing method in [submit] attribute of el:', this)
            if (callback && !isValidCB)
                error('Undefined method [%s] declared in [then] attribute of el:', callback, this)
            $el.addClass('loading').attr('disabled', true)
            submitAjax(method, resdata => {
                const time = Math.floor(window.performance.now() - start) / 1000
                log('Ajax method [%s] took %s seconds', method, time)
                if (isValidCB)
                    self.methods[callback](resdata)
                if (template)
                    render(template, resdata, time)
                $el.removeClass('loading').removeAttr('disabled')
            })
        })
    }


    function initEvents() {
        for (let action of EVENT_ATTRS) {
            container.find('[on-'+ action +']').each( (i, el) => {
                const $el = $(el)
                const methodName = $el.attr('on-' + action)
                if ( !methodName ) return error('Missing method in [on-%s] attribute of element:', action, el)
                const method = self.methods[methodName]
                if ( !method ) return error('Undefined method "%s" declared in [on-%s] attribute of element:', methodName, action, el)
                const $template = $el.closest('[template]')
                $template.length && !$el.hasAttr('template')
                    ? $template.on(action, `[on-${action}=${methodName}]`, method)
                    : $el.on(action, method)
                if (action == 'click') $el.addClass('clickable')
            })
        }
    }


    function initActions() {
        for (let action of ACTION_ATTRS) {
            container.find('['+ action +']').each( (i, el) => {
                const $el = $(el)
                const $page = $el.closest('[page]')
                const targetSelector = $el.attr(action)

                if ( !targetSelector ) return error('Missing target selector in [%s] attribute of element:', action, el)
                let $target = $page.find('['+targetSelector+']')
                if ( !$target.length ) $target = container.find('['+targetSelector+']')
                if ( !$target.length ) return error('Could not find target [%s] declared in [%s] attribute of element:', targetSelector, action, el)

                const target = $target[0]

                $el.on('click', e => {
                    e.stopPropagation()
                    $target.addClass('target')
                    container.find('[menu]:not(.target)').hide()
                    $target.removeClass('target')
                    is.function(target[action]) ? target[action]() : $target[action]()
                    const isVisible = target.style.display != 'none'
                    isVisible ? $target.focus() : $target.blur()
                })
            })
        }
    }


    function initFieldValidations() {
        container.find('button[validate]').each( (i, btn) => {
            const $fields = $(btn).parent().find('input[required]')
            btn.disabled = isAnyFieldInvalid($fields)
            $fields.each( (i, field) => {
                $(field).on('keydown', e => {
                    btn.disabled = isAnyFieldInvalid($fields)
                    if (e.key == 'Enter' && !btn.disabled) btn.click()
                })
            })
        })

        function isAnyFieldInvalid($fields) {
            let valid = true
            $fields.each( (i, field) => {
                valid = valid && field.validity.valid
                return valid
            })
            return !valid
        }
    }
   

    function initModals() {
        container.find('[modal]').each((i, el) => {
            // add close btn
            $('<div icon=close class="top right clickable" />')
                .on('click', e => {
                    $(el).hide()
                })
                .appendTo(el)
        })
    }


    function initSideMenu() {
        self.sidemenu = (function (el) {
            
            if (!el) return

            el.enabled = false
            el.visible = false

            el.show = () => {
                if (!el.enabled) return
                $(el).show()
                el.visible = true
            }
            el.hide = () => {
                if (!el.enabled) return
                $(el).hide()
                el.visible = false
            }
            el.toggle = () => {
                if (!el.enabled) return
                el.visible ? el.hide() : el.show()
            }

            el.enable = () => {
                el.classList.add('enabled')
                el.enabled = true
            }
            el.disable = () => {
                el.classList.remove('enabled')
                el.enabled = false
            }
            el.switch = () => {
                el.enabled ? el.disable() : el.enable()
            }

            return el

        })( container.find('[sidemenu]')[0] )

        if (self.sidemenu) {
            if (media.phone) self.sidemenu.enable()
            media.on.phone(() => { self.sidemenu.switch() })
        }
    }


    function createTabs(el) {
        var $el = $(el),
            $tabs = $el.hasAttr('page')
                ? $el.children('[panel]:not([modal])')
                : $el.hasAttr('panel')
                    ? $el.children('[section]:not([modal])')
                    : undefined
        if (!$tabs) return error('Cannot create tabs: container must be a [page] or a [panel]', el)

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
            position = e.target.scrollLeft / e.target.scrollWidth
            $bar.css({ left : position * e.target.offsetWidth })
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


    function initCrud() {
        container.find('[crud][template]').each((i, el) => {
            const $el = $(el)
            const template = resolveAttr($el, 'template')
            const datakey = resolveAttr($el, 'data')
            const crudkey = resolveAttr($el, 'crud')
            render(el)
            $el.on('click', '.rasti-crud-delete', e => {
                const $controls = $(e.currentTarget).closest('[data-id]')
                const id = $controls.attr('data-id')
                try {
                    __crud.delete({ datakey, crudkey }, id)
                        .then(ok => {
                            $controls.parent().detach()
                            log('Removed element [%s] from template [%s]', id, template)
                        }, err => {
                            __crud.hideInputEl($el)
                            $el.removeClass('active')
                        })
                }
                catch (err) {
                    rasti.error(err)
                }
            })
            $el.on('click', '.rasti-crud-update', e => {
                // TODO: add update logic
            })
            $el.on('click', '.rasti-crud-create', e => {
                __crud.showInputEl($el)
                $el.addClass('active')
            })
            $el.on('click', '.rasti-crud-accept', e => {
                // TODO: finish this
                let newel
                try {
                    newel = __crud.genDataEl($el)
                    __crud.create({ datakey, crudkey }, newel)
                        .then(ok => {
                            __crud.persistNewEl($el)
                            $el.removeClass('active')
                        }, err => {
                            __crud.hideInputEl($el)
                            $el.removeClass('active')
                        })
                }
                catch (err) {
                    rasti.error(err)
                }
            })
            $el.on('click', '.rasti-crud-cancel', e => {
                __crud.hideInputEl($el)
                $el.removeClass('active')
            })
        })
    }


    function initPager($el, template, data, lang) {
        const name = $el.attr('template'),
            pager = newPager(name, data, self.options.page_sizes)
        let paging, sizes, columns, size=0, col=1

        if (pager.total > 1) {
            paging = `<div class="paging fcenter small_ inline_">
                <button icon=left3 />
                <span class=page />
                <button icon=right3 />
            </div>`

            sizes = `<button icon=rows>${ self.options.page_sizes[0] }</button>`
        }

        if ( $el.hasAttr('columns') )
            columns = `<button icon=columns>1</button>`

        $el.html(`
            <div class="results scrolly rigid"></div>
            <div class="controls fcenter small_ inline_">
                ${ columns || '' }
                ${ paging || '' }
                ${ sizes || '' }
            </div>
        `)

        const $results = $el.find('.results'),
            $controls = $el.find('.controls'),
            $page = $controls.find('.page'),
            $prev = $controls.find('[icon=left3]'),
            $next = $controls.find('[icon=right3]')

        $controls
            .on('click', '[icon=right3]', e => {
                update( pager.next() )
            })
            .on('click', '[icon=left3]', e => {
                update( pager.prev() )
            })
            .on('click', '[icon=rows]', e => {
                size += 1
                var newSize = pager.sizes[size % pager.sizes.length]
                pager.setPageSize(newSize)
                $(e.target).html(newSize)
                update( pager.next() )
                pager.total > 1
                    ? $controls.find('.paging').show()
                    : $controls.find('.paging').hide()
            })
            .on('click', '[icon=columns]', e => {
                col = col+1 > 3 ? 1 : col+1
                $(e.target).html(col)
                $results.removeClass('columns-1 columns-2 columns-3')
                    .addClass('columns-' + col)
            })

        update( pager.next() )

        function update(data){
            $results.html( template(data).join('') )
                [0].scrollTo(0,0)
            $page.html(pager.page + '/' + pager.total)
            $prev[0].disabled = !pager.hasPrev()
            $next[0].disabled = !pager.hasNext()
            applyFX($el, '.results')
        }
    }

    function getPager(id) {
        let pager = __pagers.get(id)
        if (!pager) error('No pager found for template [%s]', id)
        return pager
    }
    function newPager(id, results, page_size) {
        let pager = new Pager(id, results, page_size)
        __pagers.set(id, pager)
        return pager
    }
    function deletePager(pager) {
        if (!pager || !pager.id) return
        __pagers.delete(pager.id)
    }


    function submitAjax(method, callback) {
        var ajax = self.methods[ method ]
        if ( !is.function(ajax) ) return error('Ajax method ['+ method +'] is not defined')

        var $form = container.find('[ajax='+ method +']')
        if (!$form.length) return error('No container element bound to ajax method [%s]. Please bind one via [ajax] attribute', method)

        var reqdata = {}, prop
        $form.find('[prop]:not([private])').each( (i, el) => {
            $el = $(el)
            prop = $el.attr('prop')
            if (prop) {
                reqdata[prop] = $el.val() || $el.attr('value')
            }
        })

        ajax(reqdata, callback)
    }


    function getThemeStyle(values) {
        var ns = `[rasti=${ __name }]`
        return `
            ${ns} {
                font: ${ values.font };
                color: ${ values.text[0] };
                background-color: ${ values.page[0] };
            }
            ${ns} nav       { background-color: ${ values.page[1] }; }
            ${ns} [page]    { background-color: ${ values.page[0] }; }
            ${ns} [panel]   { background-color: ${ values.panel[0] }; }
            ${ns} [section] { background-color: ${ values.section[0] }; }

            ${ns} [page][header]:before,
            ${ns} [page][footer]:after     { background-color: ${ values.page[1] }; }
            ${ns} [panel][header]:before   { background-color: ${ values.panel[1] }; }
            ${ns} [section][header]:before { background-color: ${ values.section[1] }; }

            ${ns} .tab-labels        { background-color: ${ values.panel[0] }; }
            ${ns} .tab-labels > .bar { background-color: ${ values.btn[0] }; }

            ${ns} input:not([type]),
            ${ns} input[type=text],
            ${ns} input[type=password],
            ${ns} input[type=email],
            ${ns} input[type=tel],
            ${ns} select,
            ${ns} textarea,
            ${ns} .field {
                background-color: ${ values.field[0] };
                color: ${ values.field[1] };
            }
            ${ns} input[type=radio],
            ${ns} input[type=checkbox] {
                border: 1px solid ${ values.field[1] };
            }
            ${ns} input[type=radio]:checked,
            ${ns} input[type=checkbox]:checked {
                background-color: ${ values.btn[0] };
            }

            ${ns} button,
            ${ns} [block=buttons] > div.active,
            ${ns} nav > div.active,
            ${ns} nav > a.active,
            ${ns} .list > div.active {
                background-color: ${ values.btn[0] };
                color: ${ values.btn[1] };
            }
            ${ns} [block=buttons] > div {
                border: 1px solid ${ values.field[1] };
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


    function fixLabel($el) {
        const label = resolveAttr($el, 'label')
        $el.wrap( $(`<div fixed label="${ label }" >`) )
        $el[0].removeAttribute('label')
    }


    function fixIcon($el) {
        const $parent = $el.parent()
        if ($parent.hasAttr('fixed')) {
            $parent.attr(icon, $el.attr('icon')).addClass('floating')
        }
        else {
            $el.wrap( $(`<div fixed icon=${ $el.attr('icon') } class=floating >`) )
        }
        $el[0].removeAttribute('icon')
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


    return this

}


// static properties and methods

rasti.log = log
rasti.warn = warn
rasti.error = error
rasti.utils = utils
rasti.blocks = require('./blocks/all')
rasti.icons = require('./icons')
rasti.fx = require('./fx')
rasti.options = {log : 'debug'}

module.exports = global.rasti = Object.freeze(rasti)



/*
 * instantiates any apps declared via [rasti] attribute
 */
function bootstrap() {
    const appContainers = $(document).find('[rasti]')
    let appName, app

    appContainers.forEach( container => {
        appName = container.getAttribute('rasti')
        if (!appName) error('Missing app name in [rasti] attribute of app container:', container)
        else if (global[appName]) error('Name [%s] already taken, please choose another name for app in container:', appName, container)
        else {
            global[appName] = app = new rasti(appName, container)
            Object.keys(app.options).forEach( key => {
                if (container.hasAttribute(key)) {
                    app.options[key] = container.getAttribute(key)
                    // non-value boolean attributes are true
                    if (is.boolean(options[key]) && !app.options[key]) app.options[key] = true
                }
            })
            // load any declared sources
            var sources = container.getAttribute('src')
            if (sources) {
                log('Loading sources for app [%s]...', appName)
                utils.inject(sources)
            }
        }
    })
}


function genBlockStyles() {
    let styles = ['<style blocks>'], style
    for (let key in rasti.blocks) {
        style = rasti.blocks[key].style
        if (style) styles.push(style)
    }
    styles.push('</style>')
    return styles.join('')
}


function genIconStyles() {
    let styles = ['<style icons>'], glyph
    for (let category in rasti.icons) {
        category = rasti.icons[category]
        for (let name in category) {
            glyph = category[name]
            style = `[icon=${name}]:before{content:'${glyph}';}`
            styles.push(style)
        }
    }
    styles = styles.concat( genIconFixesStyles() )
    styles.push('</style>')
    return styles.join('')
}


function genIconFixesStyles() {
    const fixes = [
        [`=error =sync =reload =remove =restore =stereo =img-file
            =latin2 =celtic =ankh =comunism =health ^=hg-`,
            { base: '2', small: '1.5', big: '3', huge: '4.4' } ],
        [`=close =network =pommee =diamonds`,
            { base: '2.5', small: '1.8', big: '3.3', huge: '4.9' } ],
    ]
    
    const result = []
    let temp, mod
    fixes.forEach(([selectors, sizes]) => {
        Object.entries(sizes).forEach(([modifier, size]) => {
            mod = modifier == 'base' ? null : modifier
            temp = selectors.split(/[\s\n]+/)
                .map(sel =>
                    mod ? `.${mod}[icon${sel}]:before,
                        .${mod}_>[icon${sel}]:before`
                    : `[icon${sel}]:before`
                ).join(',')
            temp += `{ font-size: ${size}rem; }`
            result.push(temp)
        })
    })
    return result
}


$('head').prepend( genBlockStyles() + `<style>:root{--pad:20px}body{margin:0;overflow-x:hidden;text-shadow:0 0 0}*,:after,:before{box-sizing:border-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:background-color .2s}a{text-decoration:none;font-weight:600}h1{font-size:3em}h2{font-size:2em}h3{font-size:1.5em}h1,h2,h3{margin-top:0}p.big{font-size:1.5em}ol,ul{padding:5px 10px 5px 30px;border-radius:2px}li:not(:last-child){margin-bottom:5px}caption,table,tbody,td,tfoot,th,thead,tr{margin:0;padding:0;border:0;font-size:100%;font:inherit;vertical-align:baseline}table{border:1px solid #0003;width:100%;text-align:center;border-collapse:collapse}table td,table th{border:1px solid #0003;padding:4px 5px}table thead{background:#ddd;border-bottom:3px solid #0003}table thead th{font-weight:700;text-align:center}table tfoot{font-weight:700;border-top:3px solid #0003}.field,button,input,select,textarea{min-height:35px;width:100%;padding:5px 10px;margin:0 0 15px 0;border:0;border-radius:2px;outline:0;font-family:inherit!important;font-size:inherit;vertical-align:text-bottom}input[type=email]:focus:invalid,input[type=password]:focus:invalid,input[type=tel]:focus:invalid,input[type=text]:focus:invalid{border-top-left-radius:0;border-bottom-left-radius:0;box-shadow:-4px 0 0 0 red}input[type=email]:focus:valid,input[type=password]:focus:valid,input[type=tel]:focus:valid,input[type=text]:focus:valid{border-top-left-radius:0;border-bottom-left-radius:0;box-shadow:-4px 0 0 0 green}button,input[type=range],select{cursor:pointer}button{display:inline-block;height:50px;width:auto;min-width:50px;padding:10px 20px;border:1px solid rgba(0,0,0,.1);font-size:1.2em;text-align:center;text-decoration:none;text-transform:uppercase}button:not(:disabled):hover{filter:contrast(1.5)}button:disabled{filter:contrast(.5);cursor:auto}button[icon]{display:flex;align-items:center;justify-content:center;padding:0}select{appearance:none;-moz-appearance:none;-webkit-appearance:none}option{cursor:pointer}textarea{height:70px;resize:none}.big_>button,.big_>input,button.big,input.big{min-height:70px;margin-bottom:25px;font-size:1.5em}.small_>button,.small_>input,button.small,input.small{min-height:25px;max-height:25px;font-size:1em}input[type=checkbox],input[type=radio]{-webkit-appearance:none;appearance:none;min-height:25px;width:25px;margin:5px;font-size:2em;line-height:.6;text-align:center;vertical-align:middle;cursor:pointer}input[type=radio]{border-radius:50%}input[type=checkbox]+label,input[type=radio]+label{height:40px;max-width:90%;overflow:hidden;text-overflow:ellipsis;vertical-align:middle;cursor:pointer}input[type=checkbox]:checked::before{content:'⨯';display:inline-block;position:absolute;color:#222}input[type=radio]:checked::after{display:inline-block;position:absolute;height:16px;width:16px;margin-left:-33px;background-color:#000;border-radius:50%}input[type=checkbox]:checked,input[type=checkbox]:focus,input[type=checkbox]:hover,input[type=radio]:checked,input[type=radio]:focus,input[type=radio]:hover{box-shadow:inset 0 0 4px #000}input[type=checkbox]+label:hover,input[type=checkbox]:focus+label,input[type=checkbox]:hover+label,input[type=radio]+label:hover,input[type=radio]:focus+label,input[type=radio]:hover+label{font-weight:600}input[type=checkbox].toggle{position:relative;height:26px;width:44px;border-radius:12px;transition:background-color .4s}input[type=checkbox].toggle::before{content:'';position:absolute;top:2px;left:2px;width:20px;height:20px;border-radius:50%;background-color:#000;transition:left .4s}input[type=checkbox].toggle:checked::before{left:20px}meter,progress{width:100%;margin:0;border-radius:2px}meter{height:8px;border:1px solid #ccc}meter::-webkit-meter-bar{background:#fff}meter::-webkit-meter-optimum-value{background:linear-gradient(to bottom,#62c462,#51a351)}meter::-webkit-meter-suboptimum-value{background:linear-gradient(to bottom,#fbb450,#f89406)}meter::-webkit-meter-even-less-good-value{background:linear-gradient(to bottom,#ee5f5b,#bd362f)}hr{display:flex;align-items:center;height:30px;border:none}hr::before{content:'';display:block;height:2px;width:100%;background-color:rgba(0,0,0,.5)}[page],[panel],[section]{position:relative;overflow:hidden}[page]{min-height:100vh;width:100vw!important;padding-bottom:10px;margin-bottom:-5px;overflow-y:auto}[page]:not(.active){display:none!important}nav:not([hidden])~[page]:not(.hide-nav){min-height:calc(100vh - 50px)}.fullh[page]{height:100vh}[panel]{padding:25px;border-radius:2px}[section]{padding:20px;border-radius:2px}[section] [label]:before{text-shadow:0 0 0 #000}[section]>:first-child:not([label]){margin-top:0}[section]:not(:last-child){margin-bottom:15px}[foldable],[header]{position:relative}[foldable]{padding-top:30px}[header]:not([page]){padding-top:45px}[foldable][panel],[header][panel]{padding-top:65px}[foldable]:before,[footer][page]:after,[header][page]:before,[header][panel]:before,[header][section]:before{content:attr(header);display:flex;align-items:center;justify-content:center;width:100%;text-transform:uppercase}[header][page]:before{height:50px;margin-bottom:15px;font-size:1.8em;line-height:30px}[foldable]:not([page]):before,[header]:not([page]):before{position:absolute;top:0;left:0}[header][panel]:before{height:40px;padding:10px;font-size:1.5em;line-height:20px}[foldable]:before,[header]:before{height:30px;padding:10px;font-size:1.2em;line-height:20px}[footer][page]:after{content:attr(footer)}[page][header][fix-header]:before{position:fixed;top:0}[page][footer][fix-footer]:after{position:fixed;bottom:0}[img]{background-repeat:no-repeat;background-position:center;background-size:contain;background-origin:content-box}[template]{position:relative;visibility:hidden}[template].rendered{visibility:visible}[template]>.results{max-height:calc(100% - 60px);margin:0 -15px;padding:0 15px}[template][stats]>.results{max-height:calc(100% - 95px)}[template]>.controls{height:60px;padding:10px;color:#fff}[template]>.controls *{margin:0 2px}[template]>.stats{height:40px;padding:10px;font-size:1.1em}[paged]{padding-bottom:0!important}[crud]>*{position:relative}.rasti-crud-create{display:block!important}.rasti-crud,.rasti-crud-accept,.rasti-crud-cancel,.rasti-crud-input,[crud].active .rasti-crud-create{display:none!important}[crud].active .rasti-crud-accept,[crud].active .rasti-crud-cancel,[crud].active .rasti-crud-input{display:inline-block!important}[crud]>.rasti-crud{bottom:-40px;z-index:1}[crud]:hover>.rasti-crud,[crud]>:hover>.rasti-crud{display:block!important}[h-flow]{display:inline-block!important;white-space:nowrap;height:100%;width:100%;overflow-x:auto;overflow-y:hidden}[h-flow]>*{display:inline-block;white-space:normal;height:100%;min-width:100%;border-radius:0;margin-top:0;margin-bottom:0;margin-left:auto!important;margin-right:auto;vertical-align:top}.tab-labels+[h-flow]{height:calc(100vh - 50px)}nav~[page]>.tab-labels+[h-flow]{height:calc(100vh - 100px)}.tab-labels,nav{display:flex;align-items:center;position:relative;white-space:nowrap;min-width:100vw;height:50px;padding:0;border-bottom:1px solid rgba(0,0,0,.2);border-radius:0;text-transform:uppercase}nav{z-index:8}.tab-labels{justify-content:space-around;z-index:2}.tab-labels>.bar{position:absolute;bottom:0;left:0;height:4px;transition:left .2s,width .2s}[tab-label],nav>a,nav>div{display:flex;justify-content:center;align-items:center;flex:1 1 auto;height:100%;min-width:50px;padding:5px;font-size:1.4em;text-shadow:0 0 0 #000;text-decoration:none;border-right:1px solid #0003;color:inherit;cursor:pointer}nav>a,nav>div{transition:all .2s}[tab-label].active{filter:contrast(1.5)}[sidemenu].enabled{position:fixed!important;top:0;left:-80vw;height:100%;min-width:80vw!important;max-width:80vw;z-index:10}[sidemenu].enabled.open{left:0;animation:slide-in .2s}[sidemenu].enabled.close{animation:slide-out .2s}.modal,[modal]{visibility:hidden;position:fixed;left:0;right:0;top:0;bottom:0;margin:auto!important;height:auto;width:auto;max-height:600px;max-width:400px;overflow-y:auto;z-index:10}.modal.big,[modal].big{max-height:800px;max-width:600px}.modal.small,[modal].small{max-height:400px;max-width:200px}[modal].open{visibility:visible;animation:zoom-in .2s,fade-in .2s}[modal].close{animation:zoom-out .2s,fade-out .2s}[menu]{visibility:hidden;position:fixed;background-color:inherit;box-shadow:0 0 4px 4px rgba(0,0,0,.2);z-index:10;cursor:pointer}[menu]>div{padding:10px;margin-bottom:0;text-transform:capitalize}[menu]>div:not(:last-child){border-bottom:1px solid #0003}[menu].open{visibility:visible;animation:fold .2s reverse}[menu].close{animation:fold .2s}[label]{position:relative;margin-top:35px;margin-bottom:15px;vertical-align:bottom}[label][fixed]>*{margin-bottom:0}[label]>input,[label]>select,[label]>textarea{margin-top:0!important}[label]:not([panel]):not([section]):before{content:attr(label);position:absolute;height:35px;line-height:35px;font-size:1.2em;text-transform:capitalize}[label]:before{top:0;left:0;margin-top:-35px}[label].big:before{margin-left:0}[label][fixed]:before{margin-top:-30px;margin-left:0}.inline-label[label],.inline-label_>[label]{width:auto;margin-top:0;padding-left:calc(40% + 10px)}.inline-label[label]:before,.inline-label_>[label]:before{top:auto;width:80%;left:-40%;margin-top:0;text-align:right}.inline-label[label][fixed]:before,.inline-label_>[label][fixed]:before{margin-top:0;margin-left:-8px}.below-label[label]:before,.below-label_>[label]:before{bottom:-40px;left:0;right:0;margin-top:0;margin-left:0}.big [label]{margin-top:25px;font-size:1.2em}.big [label]:before{margin-top:-27px}.clickable,[hide],[onclick],[show],[toggle]{cursor:pointer}[movable]{user-select:none;cursor:move}[resizable]{resize:both;overflow:hidden}[foldable].open{animation:fold-out .2s}[foldable].folded{animation:fold-in .2s;height:30px!important;overflow:hidden;padding-bottom:0}[foldable]:before{content:attr(foldable) '  △';cursor:pointer}[foldable].folded:before{content:attr(foldable) '  ▽'}.row{width:100%;display:flex;flex-flow:row wrap;align-content:flex-start;padding-left:1%}.col{display:flex;flex-flow:column nowrap;align-content:flex-start;align-items:center}.col>.row-1,.row>.col-1{flex-basis:7.33%}.col>.row-2,.row>.col-2{flex-basis:15.66%}.col>.row-3,.row>.col-3{flex-basis:24%}.col>.row-4,.row>.col-4{flex-basis:32.33%}.col>.row-5,.row>.col-5{flex-basis:40.66%}.col>.row-6,.row>.col-6{flex-basis:49%}.col>.row-7,.row>.col-7{flex-basis:57.33%}.col>.row-8,.row>.col-8{flex-basis:65.66%}.col>.row-9,.row>.col-9{flex-basis:74%}.col>.row-10,.row>.col-10{flex-basis:82.33%}.col>.row-11,.row>.col-11{flex-basis:90.66%}.row [class*=col-]{margin-left:0!important}.row [class*=col-]:not(:last-child){margin-right:1%!important}.col [class*=row-]{margin-top:0!important;margin-bottom:1vh!important}.page-options{flex-basis:initial!important}[icon]{min-height:50px}[icon]:empty{padding:0}[icon]:before{display:inline-block;flex-grow:0;height:50px;width:50px;font-size:1.5rem;line-height:2;text-align:center;text-decoration:none}.small[icon],.small_>[icon]{min-height:35px}.small[icon]:before,.small_>[icon]:before{height:35px;width:35px;font-size:1.2rem;line-height:1.7}.big[icon]:before,.big_>[icon]:before{height:70px;width:70px;font-size:2.2rem;line-height:1.9}.huge[icon]:before,.huge_>[icon]:before{height:100px;width:100px;font-size:3.2rem;line-height:1.9}.round[icon]:before,.round_>[icon]:before{border-radius:50%}.floating[icon]{position:relative;padding-left:0}.floating[icon]:before{position:absolute;top:0;left:4px;height:35px;width:35px;font-size:1.1rem}.floating[icon]>input{padding-left:45px}[icon=remove]:before{line-height:.6!important;font-weight:600}[icon=close]:before,[icon=network]:before{line-height:1!important}[icon=diamonds]:before{line-height:1.1!important}[icon=pommee]:before,[icon=restore]:before{line-height:1.2!important}[icon=ankh]:before,[icon=celtic]:before,[icon=comunism]:before,[icon=img-file]:before,[icon=latin2]:before,[icon=reload]:before,[icon=stereo]:before,[icon^=hg-]:before{line-height:1.3!important}[icon=sync]:before{line-height:1.3!important;transform:rotate(90deg)}[icon=error]:before{line-height:1.35!important;font-weight:600}[icon=copy]:before{line-height:1.5!important;font-weight:600;font-size:1.7rem}[icon=health]:before{line-height:1.5!important}[icon=warning]:before{line-height:1.6!important}[icon=maximize]:before,[icon=minimize]:before{line-height:1.7!important}[icon=play]:before,[icon=undo]:before{line-height:1.7!important;transform:rotate(90deg)}[icon=redo]:before{line-height:1.7!important;transform:rotate(-90deg)}[icon=caps-lock]:before,[icon=return]:before,[icon=shift]:before{font-family:auto;font-weight:600}[icon=candle]:before,[icon=desktop]:before,[icon=printer]:before,[icon=stopwatch]:before,[icon=studio-mic]:before{font-weight:600}[icon=tab]:before{font-family:auto}[icon=pinch]:before{transform:rotate(90deg)}[icon=crescent-moon]:before,[icon=moon]:before{filter:grayscale(1)}.list{border:1px solid rgba(0,0,0,.2)}.list[header]{padding-top:40px}.list>div{height:7vh;padding:2vh;transition:all .2s}.list>div{border-bottom:1px solid rgba(0,0,0,.2)}.list>div:first-child{border-top:1px solid rgba(0,0,0,.2)}.list>div.active{border-left:7px solid #222}.list>div:hover{text-shadow:0 0 1px #000}.nodata{padding:10% 5%;margin:auto;font-size:1.5rem;text-align:center}button.fab{position:fixed;bottom:0;right:0;width:50px;margin:20px;border-radius:50%;z-index:5}.backdrop:before{content:'';position:fixed;top:0;left:0;height:100vh;width:100vw;background:rgba(0,0,0,.7);animation:fade-in .2s;z-index:9}.loading{color:transparent!important;position:relative}.loading>*{visibility:hidden}.loading:after{content:'';position:absolute;top:0;bottom:0;left:0;right:0;width:25px;height:25px;margin:auto;border-radius:50%;border:.25rem solid rgba(255,255,255,.2);border-top-color:#fff;animation:spin 1s infinite linear;visibility:visible}.big.loading:after{position:fixed;width:100px;height:100px;z-index:10}.loading2{perspective:120px}.loading2:after{content:"";position:absolute;left:25px;top:25px;width:50px;height:50px;background-color:#3498db;animation:flip 1s infinite linear}@keyframes stamp{50%{transform:scale(1.2)}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes flip{0%{transform:rotate(0)}50%{transform:rotateY(180deg)}100%{transform:rotateY(180deg) rotateX(180deg)}}@keyframes zoom-in{0%{transform:scale(0)}100%{transform:scale(1)}}@keyframes zoom-out{0%{transform:scale(1)}100%{transform:scale(0)}}@keyframes fade-in{0%{opacity:0}100%{opacity:1}}@keyframes fade-out{0%{opacity:1}100%{opacity:0}}@keyframes slide-in{0%{left:-100vw}100%{left:0}}@keyframes slide-out{0%{left:0}100%{left:-100vw}}@keyframes fold-in{0%{height:var(--elem-h);overflow:hidden}100%{height:0;overflow:hidden}}@keyframes fold-out{0%{height:0;overflow:hidden}100%{height:var(--elem-h);overflow:hidden}}.hidden{position:absolute;visibility:hidden}.rel,.rel_>*{position:relative}.fix,.fix_>*{position:fixed}.inline,.inline_>*{display:inline-block;margin-top:0;margin-bottom:0}.floatl,.floatl_>*{float:left}.floatr,.floatr_>*{float:right}.left,.left_>*{position:absolute;left:0}.right,.right_>*{position:absolute;right:0}.top,.top_>*{position:absolute;top:0}.bottom,.bottom_>*{position:absolute;bottom:0}.centerx,.centerx_>*{position:absolute;left:0;right:0;margin:auto!important}.centery,.centery_>*{position:absolute;top:0;bottom:0;margin:auto!important}.center,.center_>*{position:absolute;left:0;right:0;top:0;bottom:0;margin:auto!important}.fcenterx,.fcenterx_>*{display:flex;justify-content:center}.fcentery,.fcentery_>*{display:flex;align-items:center}.fcenter,.fcenter_>*{display:flex;justify-content:center;align-items:center}.scrollx,.scrollx_>*{width:100%;overflow-x:auto;overflow-y:hidden}.scrolly,.scrolly_>*{height:100%;overflow-x:hidden;overflow-y:auto}.scroll,.scroll_>*{overflow:auto}.textl,.textl_>*{text-align:left}.textr,.textr_>*{text-align:right}.textc,.textc_>*{text-align:center}.fullw,.fullw_>*{width:100%}.fullh,.fullh_>*{height:100%}.halfw,.halfw_>*{width:50%}.halfh,.halfh_>*{height:50%}.autow,.autow_>*{width:auto}.autoh,.autoh_>*{height:auto}.autom,.autom_>*{margin:auto!important}.m0{margin:0!important}.pad-s,.pad-s_>*{padding:calc(var(--pad) * .5)}.pad,.pad_>*{padding:var(--pad)}.pad-l,.pad-l_>*{padding:calc(var(--pad) * 1.5)}.p0{padding:0!important}.round,.round_>*{border-radius:50%}.columns-2,.columns-3{display:flex;flex-wrap:wrap;align-content:flex-start}.columns-2>*{width:49%;margin-right:2%}.columns-3>*{width:32%;margin-right:2%}.columns-2>:nth-child(2n),.columns-3>:nth-child(3n){margin-right:0}.wrap{flex-wrap:wrap}.nowrap{flex-wrap:nowrap}.scale-up,.scale-up_>*{transition:all .2s ease-in-out}.scale-up:hover,.scale-up_>:hover{transform:scale(1.1)}[fx=toast]{position:fixed;display:flex;left:0;right:0;bottom:-100px;width:100vw;max-width:600px;min-height:90px;max-height:90px;padding:20px;margin:auto;overflow:hidden;text-overflow:ellipsis;z-index:10;transition:bottom ease-out .25s}[fx=toast].active{bottom:0}[fx=toast] [icon]::before{border-radius:50%;font-size:2rem;line-height:1.6;box-shadow:0 0 0 1px}[fx=toast] [icon=warning]::before{background:#ff0;line-height:1.4}[fx=toast] [icon=error]::before{background:red;line-height:1.4}[fx=toast] [icon=accept]::before{background:green}.fx-stack-container>*{transition:margin-top 2s ease;margin-top:0}.fx-stack-el{margin-top:100px}.fx-stamp-container>*{transition:opacity .3s;animation:stamp .3s}.fx-stamp-el{opacity:0;animation:none}.flip-container{perspective:1000px;position:relative}.flipper{transition:.6s;transform-style:preserve-3d;position:absolute}.flipper.flip{transform:rotateY(180deg)}.flipper .back,.flipper .front{backface-visibility:hidden;top:0;left:0}.flipper .front{z-index:2;transform:rotateY(0)}.flipper .back{transform:rotateY(180deg)}::-webkit-scrollbar{width:10px;background:0 0}::-webkit-scrollbar-thumb{background-color:rgba(0,0,0,.3);background-clip:content-box;border-left:solid transparent 2px;border-right:solid transparent 2px;border-radius:4px}::-webkit-scrollbar-thumb:hover{background-color:rgba(0,0,0,.4)}@-moz-document url-prefix(http://),url-prefix(https://){scrollbar{-moz-appearance:none!important;background:#0f0!important}scrollbarbutton,thumb{-moz-appearance:none!important;background-color:#00f!important}scrollbarbutton:hover,thumb:hover{-moz-appearance:none!important;background-color:red!important}scrollbarbutton{display:none!important}scrollbar[orient=vertical]{min-width:15px!important}}input[type=range]{-webkit-appearance:none;background:0 0}input[type=range]:focus{outline:0}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;height:20px;width:20px;background-color:red;border-radius:50%;border:1px solid #000;margin-top:-5px;cursor:pointer}input[type=range]::-webkit-slider-runnable-track{width:100%;height:10px;background:green;border:1px solid #222;border-radius:5px;cursor:pointer}input[type=range]::-ms-track{width:100%;cursor:pointer;background:0 0;border-color:transparent;color:transparent}@media only screen and (min-width:800px){.show-phone,.show-tablet{position:absolute;visibility:hidden}.pad-s-desktop,.pad-s-desktop_>*{padding:calc(var(--pad) * .5)}.pad-desktop,.pad-desktop_>*{padding:var(--pad)}.pad-l-desktop,.pad-l-desktop_>*{padding:calc(var(--pad) * 1.5)}.p0-desktop{padding:0}}@media only screen and (min-width:500px) and (max-width:800px){.pad-s-tablet,.pad-s-tablet_>*{padding:calc(var(--pad) * .5)}.pad-tablet,.pad-tablet_>*{padding:var(--pad)}.pad-l-tablet,.pad-l-tablet_>*{padding:calc(var(--pad) * 1.5)}.p0-tablet{padding:0}}@media only screen and (max-width:800px){[page][header]:before{line-height:.8}.hide-tablet{display:none}.show-tablet{position:relative;visibility:visible}[header].hh-tablet:before{display:none}[header].hh-tablet[page]{padding-top:0}[header].hh-tablet[panel]{padding-top:20px}[header].hh-tablet[section]{padding-top:15px}}@media only screen and (max-width:500px){[page]{padding-bottom:0;overflow-y:auto}[panel]{padding:15px;border-radius:0}[template]>.controls>.columns,[template]>.controls>.sizes{display:none}[options]{bottom:0;left:0!important;right:0;height:80%!important;margin:auto}.row{padding-left:0}.row:not(.rigid)>[class*=col-],[class*=columns-]:not(.rigid)>*{min-width:100%}.hide-phone{display:none}.show-phone{position:relative;visibility:visible}[header].hh-phone:before{display:none}[header].hh-phone[page]{padding-top:0}[header].hh-phone[panel],[header].hh-phone[section]{padding-top:15px}.pad-s-phone{padding-left:5%;padding-right:5%}.pad-phone{padding-left:10%;padding-right:10%}.pad-l-phone{padding-left:15%;padding-right:15%}.p0-phone{padding:0}}</style>` + genIconStyles() )

bootstrap()

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./blocks/all":1,"./components":10,"./extensions":11,"./fx":12,"./icons":13,"./themes":15,"./utils":16}],15:[function(require,module,exports){
exports.themes = {

    base : {
        font : 'normal 14px Apple Color Emoji, Segoe UI Emoji, NotoColorEmoji, Segoe UI Symbol, Android Emoji, EmojiSymbols, EmojiOne Mozilla',
        palette : {
            white   : '#eee',
            lighter : '#ddd',
            light   : '#bbb',
            mid     : '#999',
            dark    : '#444',
            darker  : '#222',
            black   : '#111',
            detail  : 'darkcyan',
            lighten : 'rgba(255,255,255,0.2)',
            darken  : 'rgba(0,0,0,0.2)',
        },
    },

}


exports.themeMaps = {

    dark : {
        page    : 'black lighten', // bg, header bg
        panel   : 'darker lighten',   // bg, header bg
        section : 'dark lighten',    // bg, header bg
        field   : 'light darker',   // bg, text
        btn     : 'detail darker',  // bg, text
        header  : 'light',          // text
        label   : 'light',          // text
        text    : 'light',          // text
    },

    light : {
        page    : 'light darken',
        panel   : 'mid lighten',
        section : 'lighten darken',
        field   : 'lighter dark',
        btn     : 'detail dark',
        header  : 'darker',
        label   : 'darker',
        text    : 'darker',
    },
    
}
},{}],16:[function(require,module,exports){
function type(exp) {
    const clazz = Object.prototype.toString.call(exp)
    return clazz.substring(8, clazz.length-1).toLowerCase()
}

const is = {}
'object function array string number regex boolean'.split(' ')
    .forEach(t => {
        is[t] = exp => type(exp) === t
    })
is.empty = exp =>
    (is.array(exp) || is.string(exp)) ? exp.length === 0
    : is.object(exp) ? Object.keys(exp).length === 0
    : false

const sameType = (exp1, exp2) => type(exp1) === type(exp2)

const exists = ref => ref !== undefined && ref !== null


const compose = (...funcs) => funcs.reduce((prev, curr) => (...args) => curr(prev(...args)))


const prepTemplate = tmpl_func => data => data.map( compose( checkData, tmpl_func )).join('')


function inject(sources) {
    if (is.string(sources)) sources = sources.split(',')
    if (!is.array(sources)) return rasti.error('Invalid sources, must be an array or a string')
    const body = $('body')
    function do_inject(sources) {
        const src = sources.shift().trim()
        const script = $('<script>').attr('src', src)
        script[0].onload = () => {
            rasti.log('> Loaded %s', src)
            sources.length
                ? do_inject(sources)
                : rasti.log('All sources loaded')
        }
        rasti.log('> Loading %s ...', src)
        body.append(script)
    }
    do_inject(sources)
}


function checkData(data) {
    switch (typeof data) {
    case 'string':
        data = {value: data, label: data, alias: data.toLowerCase()}
        break
    case 'object':
        if ( !is.string(data.value) || !is.string(data.label) ) {
            rasti.error('Invalid data object (must have string properties "value" and "label"):', data)
            //invalid_count++
            data = {value: '', label: 'INVALID DATA', alias: ''}
        }
        else if ( !is.string(data.alias) ) {
            if (data.alias) {
                rasti.error('Invalid data property "alias" (must be a string):', data)
                //invalid_count++
            }
            data.alias = data.value.toLowerCase()
        }
        else data.alias = data.alias.toLowerCase() +' '+ data.value.toLowerCase()
        break
    default:
        rasti.error('Invalid data (must be a string or an object):', data)
        //invalid_count++
        data = {value: '', label: 'INVALID DATA', alias: ''}
    }
    return data
}


function html(templateObject, ...substs) {
    // Use raw template strings (don’t want backslashes to be interpreted)
    const raw = templateObject.raw
    let result = ''

    substs.forEach((subst, i) => {
        let lit = raw[i]
        // Turn array into string
        if ( is.array(subst) ) subst = subst.join('')
        // If subst is preceded by an !, escape it
        if ( lit.endsWith('!') ) {
            subst = htmlEscape(subst)
            lit = lit.slice(0, -1)
        }
        result += lit
        result += subst
    })
    // Take care of last template string
    result += raw[raw.length - 1]

    return result
}


function htmlEscape(str) {
    return str.replace(/&/g, '&amp;') // first!
        .replace(/>/g, '&gt;')
        .replace(/</g, '&lt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/`/g, '&#96;')
}


function resolveAttr($el, name) {
    var value = $el.attr(name) || $el.attr('name') || $el.attr('prop') || $el.attr('nav') || $el.attr('section') || $el.attr('panel') || $el.attr('page') || $el.attr('template')
    if (!value) rasti.warn('Could not resolve value of [%s] attribute in el:', name, $el[0])
    return value
}


const random = () => (Math.random() * 6 | 0) + 1


const onMobile = () => window.innerWidth < 500


module.exports = {
    is,
    type,
    sameType,
    exists,
    compose,
    prepTemplate,
    inject,
    checkData,
    html,
    resolveAttr,
    random,
    onMobile,
}

},{}]},{},[14])(14)
});
//# sourceMappingURL=rasti.map
