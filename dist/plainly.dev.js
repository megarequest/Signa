(() => {
  // node_modules/@preact/signals-core/dist/signals-core.module.js
  var i = Symbol.for("preact-signals");
  function t() {
    if (!(s > 1)) {
      var i2, t2 = false;
      while (void 0 !== h) {
        var r2 = h;
        h = void 0;
        f++;
        while (void 0 !== r2) {
          var o2 = r2.o;
          r2.o = void 0;
          r2.f &= -3;
          if (!(8 & r2.f) && c(r2)) try {
            r2.c();
          } catch (r3) {
            if (!t2) {
              i2 = r3;
              t2 = true;
            }
          }
          r2 = o2;
        }
      }
      f = 0;
      s--;
      if (t2) throw i2;
    } else s--;
  }
  function r(i2) {
    if (s > 0) return i2();
    s++;
    try {
      return i2();
    } finally {
      t();
    }
  }
  var o = void 0;
  function n(i2) {
    var t2 = o;
    o = void 0;
    try {
      return i2();
    } finally {
      o = t2;
    }
  }
  var h = void 0;
  var s = 0;
  var f = 0;
  var v = 0;
  function e(i2) {
    if (void 0 !== o) {
      var t2 = i2.n;
      if (void 0 === t2 || t2.t !== o) {
        t2 = { i: 0, S: i2, p: o.s, n: void 0, t: o, e: void 0, x: void 0, r: t2 };
        if (void 0 !== o.s) o.s.n = t2;
        o.s = t2;
        i2.n = t2;
        if (32 & o.f) i2.S(t2);
        return t2;
      } else if (-1 === t2.i) {
        t2.i = 0;
        if (void 0 !== t2.n) {
          t2.n.p = t2.p;
          if (void 0 !== t2.p) t2.p.n = t2.n;
          t2.p = o.s;
          t2.n = void 0;
          o.s.n = t2;
          o.s = t2;
        }
        return t2;
      }
    }
  }
  function u(i2, t2) {
    this.v = i2;
    this.i = 0;
    this.n = void 0;
    this.t = void 0;
    this.W = null == t2 ? void 0 : t2.watched;
    this.Z = null == t2 ? void 0 : t2.unwatched;
    this.name = null == t2 ? void 0 : t2.name;
  }
  u.prototype.brand = i;
  u.prototype.h = function() {
    return true;
  };
  u.prototype.S = function(i2) {
    var t2 = this, r2 = this.t;
    if (r2 !== i2 && void 0 === i2.e) {
      i2.x = r2;
      this.t = i2;
      if (void 0 !== r2) r2.e = i2;
      else n(function() {
        var i3;
        null == (i3 = t2.W) || i3.call(t2);
      });
    }
  };
  u.prototype.U = function(i2) {
    var t2 = this;
    if (void 0 !== this.t) {
      var r2 = i2.e, o2 = i2.x;
      if (void 0 !== r2) {
        r2.x = o2;
        i2.e = void 0;
      }
      if (void 0 !== o2) {
        o2.e = r2;
        i2.x = void 0;
      }
      if (i2 === this.t) {
        this.t = o2;
        if (void 0 === o2) n(function() {
          var i3;
          null == (i3 = t2.Z) || i3.call(t2);
        });
      }
    }
  };
  u.prototype.subscribe = function(i2) {
    var t2 = this;
    return E(function() {
      var r2 = t2.value, n2 = o;
      o = void 0;
      try {
        i2(r2);
      } finally {
        o = n2;
      }
    }, { name: "sub" });
  };
  u.prototype.valueOf = function() {
    return this.value;
  };
  u.prototype.toString = function() {
    return this.value + "";
  };
  u.prototype.toJSON = function() {
    return this.value;
  };
  u.prototype.peek = function() {
    var i2 = o;
    o = void 0;
    try {
      return this.value;
    } finally {
      o = i2;
    }
  };
  Object.defineProperty(u.prototype, "value", { get: function() {
    var i2 = e(this);
    if (void 0 !== i2) i2.i = this.i;
    return this.v;
  }, set: function(i2) {
    if (i2 !== this.v) {
      if (f > 100) throw new Error("Cycle detected");
      this.v = i2;
      this.i++;
      v++;
      s++;
      try {
        for (var r2 = this.t; void 0 !== r2; r2 = r2.x) r2.t.N();
      } finally {
        t();
      }
    }
  } });
  function d(i2, t2) {
    return new u(i2, t2);
  }
  function c(i2) {
    for (var t2 = i2.s; void 0 !== t2; t2 = t2.n) if (t2.S.i !== t2.i || !t2.S.h() || t2.S.i !== t2.i) return true;
    return false;
  }
  function a(i2) {
    for (var t2 = i2.s; void 0 !== t2; t2 = t2.n) {
      var r2 = t2.S.n;
      if (void 0 !== r2) t2.r = r2;
      t2.S.n = t2;
      t2.i = -1;
      if (void 0 === t2.n) {
        i2.s = t2;
        break;
      }
    }
  }
  function l(i2) {
    var t2 = i2.s, r2 = void 0;
    while (void 0 !== t2) {
      var o2 = t2.p;
      if (-1 === t2.i) {
        t2.S.U(t2);
        if (void 0 !== o2) o2.n = t2.n;
        if (void 0 !== t2.n) t2.n.p = o2;
      } else r2 = t2;
      t2.S.n = t2.r;
      if (void 0 !== t2.r) t2.r = void 0;
      t2 = o2;
    }
    i2.s = r2;
  }
  function y(i2, t2) {
    u.call(this, void 0);
    this.x = i2;
    this.s = void 0;
    this.g = v - 1;
    this.f = 4;
    this.W = null == t2 ? void 0 : t2.watched;
    this.Z = null == t2 ? void 0 : t2.unwatched;
    this.name = null == t2 ? void 0 : t2.name;
  }
  y.prototype = new u();
  y.prototype.h = function() {
    this.f &= -3;
    if (1 & this.f) return false;
    if (32 == (36 & this.f)) return true;
    this.f &= -5;
    if (this.g === v) return true;
    this.g = v;
    this.f |= 1;
    if (this.i > 0 && !c(this)) {
      this.f &= -2;
      return true;
    }
    var i2 = o;
    try {
      a(this);
      o = this;
      var t2 = this.x();
      if (16 & this.f || this.v !== t2 || 0 === this.i) {
        this.v = t2;
        this.f &= -17;
        this.i++;
      }
    } catch (i3) {
      this.v = i3;
      this.f |= 16;
      this.i++;
    }
    o = i2;
    l(this);
    this.f &= -2;
    return true;
  };
  y.prototype.S = function(i2) {
    if (void 0 === this.t) {
      this.f |= 36;
      for (var t2 = this.s; void 0 !== t2; t2 = t2.n) t2.S.S(t2);
    }
    u.prototype.S.call(this, i2);
  };
  y.prototype.U = function(i2) {
    if (void 0 !== this.t) {
      u.prototype.U.call(this, i2);
      if (void 0 === this.t) {
        this.f &= -33;
        for (var t2 = this.s; void 0 !== t2; t2 = t2.n) t2.S.U(t2);
      }
    }
  };
  y.prototype.N = function() {
    if (!(2 & this.f)) {
      this.f |= 6;
      for (var i2 = this.t; void 0 !== i2; i2 = i2.x) i2.t.N();
    }
  };
  Object.defineProperty(y.prototype, "value", { get: function() {
    if (1 & this.f) throw new Error("Cycle detected");
    var i2 = e(this);
    this.h();
    if (void 0 !== i2) i2.i = this.i;
    if (16 & this.f) throw this.v;
    return this.v;
  } });
  function w(i2, t2) {
    return new y(i2, t2);
  }
  function _(i2) {
    var r2 = i2.u;
    i2.u = void 0;
    if ("function" == typeof r2) {
      s++;
      var n2 = o;
      o = void 0;
      try {
        r2();
      } catch (t2) {
        i2.f &= -2;
        i2.f |= 8;
        b(i2);
        throw t2;
      } finally {
        o = n2;
        t();
      }
    }
  }
  function b(i2) {
    for (var t2 = i2.s; void 0 !== t2; t2 = t2.n) t2.S.U(t2);
    i2.x = void 0;
    i2.s = void 0;
    _(i2);
  }
  function g(i2) {
    if (o !== this) throw new Error("Out-of-order effect");
    l(this);
    o = i2;
    this.f &= -2;
    if (8 & this.f) b(this);
    t();
  }
  function p(i2, t2) {
    this.x = i2;
    this.u = void 0;
    this.s = void 0;
    this.o = void 0;
    this.f = 32;
    this.name = null == t2 ? void 0 : t2.name;
  }
  p.prototype.c = function() {
    var i2 = this.S();
    try {
      if (8 & this.f) return;
      if (void 0 === this.x) return;
      var t2 = this.x();
      if ("function" == typeof t2) this.u = t2;
    } finally {
      i2();
    }
  };
  p.prototype.S = function() {
    if (1 & this.f) throw new Error("Cycle detected");
    this.f |= 1;
    this.f &= -9;
    _(this);
    a(this);
    s++;
    var i2 = o;
    o = this;
    return g.bind(this, i2);
  };
  p.prototype.N = function() {
    if (!(2 & this.f)) {
      this.f |= 2;
      this.o = h;
      h = this;
    }
  };
  p.prototype.d = function() {
    this.f |= 8;
    if (!(1 & this.f)) b(this);
  };
  p.prototype.dispose = function() {
    this.d();
  };
  function E(i2, t2) {
    var r2 = new p(i2, t2);
    try {
      r2.c();
    } catch (i3) {
      r2.d();
      throw i3;
    }
    var o2 = r2.d.bind(r2);
    o2[Symbol.dispose] = o2;
    return o2;
  }

  // node_modules/udomdiff/esm/index.js
  var esm_default = (parentNode, a2, b2, get, before) => {
    const bLength = b2.length;
    let aEnd = a2.length;
    let bEnd = bLength;
    let aStart = 0;
    let bStart = 0;
    let map = null;
    while (aStart < aEnd || bStart < bEnd) {
      if (aEnd === aStart) {
        const node = bEnd < bLength ? bStart ? get(b2[bStart - 1], -0).nextSibling : get(b2[bEnd], 0) : before;
        while (bStart < bEnd)
          parentNode.insertBefore(get(b2[bStart++], 1), node);
      } else if (bEnd === bStart) {
        while (aStart < aEnd) {
          if (!map || !map.has(a2[aStart]))
            parentNode.removeChild(get(a2[aStart], -1));
          aStart++;
        }
      } else if (a2[aStart] === b2[bStart]) {
        aStart++;
        bStart++;
      } else if (a2[aEnd - 1] === b2[bEnd - 1]) {
        aEnd--;
        bEnd--;
      } else if (a2[aStart] === b2[bEnd - 1] && b2[bStart] === a2[aEnd - 1]) {
        const node = get(a2[--aEnd], -0).nextSibling;
        parentNode.insertBefore(
          get(b2[bStart++], 1),
          get(a2[aStart++], -0).nextSibling
        );
        parentNode.insertBefore(get(b2[--bEnd], 1), node);
        a2[aEnd] = b2[bEnd];
      } else {
        if (!map) {
          map = /* @__PURE__ */ new Map();
          let i2 = bStart;
          while (i2 < bEnd)
            map.set(b2[i2], i2++);
        }
        if (map.has(a2[aStart])) {
          const index = map.get(a2[aStart]);
          if (bStart < index && index < bEnd) {
            let i2 = aStart;
            let sequence = 1;
            while (++i2 < aEnd && i2 < bEnd && map.get(a2[i2]) === index + sequence)
              sequence++;
            if (sequence > index - bStart) {
              const node = get(a2[aStart], 0);
              while (bStart < index)
                parentNode.insertBefore(get(b2[bStart++], 1), node);
            } else {
              parentNode.replaceChild(
                get(b2[bStart++], 1),
                get(a2[aStart++], -1)
              );
            }
          } else
            aStart++;
        } else
          parentNode.removeChild(get(a2[aStart++], -1));
      }
    }
    return b2;
  };

  // node_modules/uhtml/esm/utils.js
  var { isArray } = Array;
  var { getPrototypeOf, getOwnPropertyDescriptor } = Object;
  var SVG_NAMESPACE = "http://www.w3.org/2000/svg";
  var empty = [];
  var newRange = () => document.createRange();
  var set = (map, key, value) => {
    map.set(key, value);
    return value;
  };
  var gPD = (ref2, prop) => {
    let desc;
    do {
      desc = getOwnPropertyDescriptor(ref2, prop);
    } while (!desc && (ref2 = getPrototypeOf(ref2)));
    return desc;
  };
  var find = (content, path) => path.reduceRight(childNodesIndex, content);
  var childNodesIndex = (node, i2) => node.childNodes[i2];

  // node_modules/domconstants/esm/constants.js
  var ELEMENT_NODE = 1;
  var COMMENT_NODE = 8;
  var DOCUMENT_FRAGMENT_NODE = 11;

  // node_modules/custom-function/esm/factory.js
  var { setPrototypeOf } = Object;
  var factory_default = (Class) => {
    function Custom(target) {
      return setPrototypeOf(target, new.target.prototype);
    }
    Custom.prototype = Class.prototype;
    return Custom;
  };

  // node_modules/uhtml/esm/range.js
  var range;
  var range_default = (firstChild, lastChild, preserve) => {
    if (!range) range = newRange();
    if (preserve)
      range.setStartAfter(firstChild);
    else
      range.setStartBefore(firstChild);
    range.setEndAfter(lastChild);
    range.deleteContents();
    return firstChild;
  };

  // node_modules/uhtml/esm/persistent-fragment.js
  var remove = ({ firstChild, lastChild }, preserve) => range_default(firstChild, lastChild, preserve);
  var checkType = false;
  var diffFragment = (node, operation) => checkType && node.nodeType === DOCUMENT_FRAGMENT_NODE ? 1 / operation < 0 ? operation ? remove(node, true) : node.lastChild : operation ? node.valueOf() : node.firstChild : node;
  var comment = (value) => document.createComment(value);
  var PersistentFragment = class extends factory_default(DocumentFragment) {
    #firstChild = comment("<>");
    #lastChild = comment("</>");
    #nodes = empty;
    constructor(fragment) {
      super(fragment);
      this.replaceChildren(...[
        this.#firstChild,
        ...fragment.childNodes,
        this.#lastChild
      ]);
      checkType = true;
    }
    get firstChild() {
      return this.#firstChild;
    }
    get lastChild() {
      return this.#lastChild;
    }
    get parentNode() {
      return this.#firstChild.parentNode;
    }
    remove() {
      remove(this, false);
    }
    replaceWith(node) {
      remove(this, true).replaceWith(node);
    }
    valueOf() {
      const { parentNode } = this;
      if (parentNode === this) {
        if (this.#nodes === empty)
          this.#nodes = [...this.childNodes];
      } else {
        if (parentNode) {
          let { firstChild, lastChild } = this;
          this.#nodes = [firstChild];
          while (firstChild !== lastChild)
            this.#nodes.push(firstChild = firstChild.nextSibling);
        }
        this.replaceChildren(...this.#nodes);
      }
      return this;
    }
  };

  // node_modules/uhtml/esm/handler.js
  var setAttribute = (element, name, value) => element.setAttribute(name, value);
  var removeAttribute = (element, name) => element.removeAttribute(name);
  var aria = (element, value) => {
    for (const key in value) {
      const $ = value[key];
      const name = key === "role" ? key : `aria-${key}`;
      if ($ == null) removeAttribute(element, name);
      else setAttribute(element, name, $);
    }
    return value;
  };
  var listeners;
  var at = (element, value, name) => {
    name = name.slice(1);
    if (!listeners) listeners = /* @__PURE__ */ new WeakMap();
    const known2 = listeners.get(element) || set(listeners, element, {});
    let current2 = known2[name];
    if (current2 && current2[0]) element.removeEventListener(name, ...current2);
    current2 = isArray(value) ? value : [value, false];
    known2[name] = current2;
    if (current2[0]) element.addEventListener(name, ...current2);
    return value;
  };
  var hole = (detail2, value) => {
    const { t: node, n: hole2 } = detail2;
    let nullish = false;
    switch (typeof value) {
      case "object":
        if (value !== null) {
          (hole2 || node).replaceWith(detail2.n = value.valueOf());
          break;
        }
      case "undefined":
        nullish = true;
      default:
        node.data = nullish ? "" : value;
        if (hole2) {
          detail2.n = null;
          hole2.replaceWith(node);
        }
        break;
    }
    return value;
  };
  var className = (element, value) => maybeDirect(
    element,
    value,
    value == null ? "class" : "className"
  );
  var data = (element, value) => {
    const { dataset } = element;
    for (const key in value) {
      if (value[key] == null) delete dataset[key];
      else dataset[key] = value[key];
    }
    return value;
  };
  var direct = (ref2, value, name) => ref2[name] = value;
  var dot = (element, value, name) => direct(element, value, name.slice(1));
  var maybeDirect = (element, value, name) => value == null ? (removeAttribute(element, name), value) : direct(element, value, name);
  var ref = (element, value) => (typeof value === "function" ? value(element) : value.current = element, value);
  var regular = (element, value, name) => (value == null ? removeAttribute(element, name) : setAttribute(element, name, value), value);
  var style = (element, value) => value == null ? maybeDirect(element, value, "style") : direct(element.style, value, "cssText");
  var toggle = (element, value, name) => (element.toggleAttribute(name.slice(1), value), value);
  var array = (node, value, prev) => {
    const { length } = value;
    node.data = `[${length}]`;
    if (length)
      return esm_default(node.parentNode, prev, value, diffFragment, node);
    switch (prev.length) {
      case 1:
        prev[0].remove();
      case 0:
        break;
      default:
        range_default(
          diffFragment(prev[0], 0),
          diffFragment(prev.at(-1), -0),
          false
        );
        break;
    }
    return empty;
  };
  var attr = /* @__PURE__ */ new Map([
    ["aria", aria],
    ["class", className],
    ["data", data],
    ["ref", ref],
    ["style", style]
  ]);
  var attribute = (element, name, svg3) => {
    switch (name[0]) {
      case ".":
        return dot;
      case "?":
        return toggle;
      case "@":
        return at;
      default:
        return svg3 || "ownerSVGElement" in element ? name === "ref" ? ref : regular : attr.get(name) || (name in element ? name.startsWith("on") ? direct : gPD(element, name)?.set ? maybeDirect : regular : regular);
    }
  };
  var text = (element, value) => (element.textContent = value == null ? "" : value, value);

  // node_modules/uhtml/esm/literals.js
  var abc = (a2, b2, c2) => ({ a: a2, b: b2, c: c2 });
  var bc = (b2, c2) => ({ b: b2, c: c2 });
  var detail = (u2, t2, n2, c2) => ({ v: empty, u: u2, t: t2, n: n2, c: c2 });
  var cache = () => abc(null, null, empty);

  // node_modules/uhtml/esm/creator.js
  var creator_default = (parse) => (
    /**
     * @param {TemplateStringsArray} template
     * @param {any[]} values
     * @returns {import("./literals.js").Cache}
     */
    (template2, values) => {
      const { a: fragment, b: entries, c: direct2 } = parse(template2, values);
      const root = document.importNode(fragment, true);
      let details = empty;
      if (entries !== empty) {
        details = [];
        for (let current2, prev, i2 = 0; i2 < entries.length; i2++) {
          const { a: path, b: update2, c: name } = entries[i2];
          const node = path === prev ? current2 : current2 = find(root, prev = path);
          details[i2] = detail(
            update2,
            node,
            name,
            update2 === array ? [] : update2 === hole ? cache() : null
          );
        }
      }
      return bc(
        direct2 ? root.firstChild : new PersistentFragment(root),
        details
      );
    }
  );

  // node_modules/domconstants/esm/re.js
  var TEXT_ELEMENTS = /^(?:plaintext|script|style|textarea|title|xmp)$/i;
  var VOID_ELEMENTS = /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;

  // node_modules/@webreflection/uparser/esm/index.js
  var elements = /<([a-zA-Z0-9]+[a-zA-Z0-9:._-]*)([^>]*?)(\/?)>/g;
  var attributes = /([^\s\\>"'=]+)\s*=\s*(['"]?)\x01/g;
  var holes = /[\x01\x02]/g;
  var esm_default2 = (template2, prefix2, xml) => {
    let i2 = 0;
    return template2.join("").trim().replace(
      elements,
      (_2, name, attrs, selfClosing) => `<${name}${attrs.replace(attributes, "=$2$1").trimEnd()}${selfClosing ? xml || VOID_ELEMENTS.test(name) ? " /" : `></${name}` : ""}>`
    ).replace(
      holes,
      (hole2) => hole2 === "" ? `<!--${prefix2 + i2++}-->` : prefix2 + i2++
    );
  };

  // node_modules/uhtml/esm/create-content.js
  var template = document.createElement("template");
  var svg;
  var range2;
  var create_content_default = (text2, xml) => {
    if (xml) {
      if (!svg) {
        svg = document.createElementNS(SVG_NAMESPACE, "svg");
        range2 = newRange();
        range2.selectNodeContents(svg);
      }
      return range2.createContextualFragment(text2);
    }
    template.innerHTML = text2;
    const { content } = template;
    template = template.cloneNode(false);
    return content;
  };

  // node_modules/uhtml/esm/parser.js
  var createPath = (node) => {
    const path = [];
    let parentNode;
    while (parentNode = node.parentNode) {
      path.push(path.indexOf.call(parentNode.childNodes, node));
      node = parentNode;
    }
    return path;
  };
  var textNode = () => document.createTextNode("");
  var resolve = (template2, values, xml) => {
    const content = create_content_default(esm_default2(template2, prefix, xml), xml);
    const { length } = template2;
    let entries = empty;
    if (length > 1) {
      const replace = [];
      const tw = document.createTreeWalker(content, 1 | 128);
      let i2 = 0, search = `${prefix}${i2++}`;
      entries = [];
      while (i2 < length) {
        const node = tw.nextNode();
        if (node.nodeType === COMMENT_NODE) {
          if (node.data === search) {
            const update2 = isArray(values[i2 - 1]) ? array : hole;
            if (update2 === hole) replace.push(node);
            entries.push(abc(createPath(node), update2, null));
            search = `${prefix}${i2++}`;
          }
        } else {
          let path;
          while (node.hasAttribute(search)) {
            if (!path) path = createPath(node);
            const name = node.getAttribute(search);
            entries.push(abc(path, attribute(node, name, xml), name));
            removeAttribute(node, search);
            search = `${prefix}${i2++}`;
          }
          if (!xml && TEXT_ELEMENTS.test(node.localName) && node.textContent.trim() === `<!--${search}-->`) {
            entries.push(abc(path || createPath(node), text, null));
            search = `${prefix}${i2++}`;
          }
        }
      }
      for (i2 = 0; i2 < replace.length; i2++)
        replace[i2].replaceWith(textNode());
    }
    const { childNodes } = content;
    let { length: len } = childNodes;
    if (len < 1) {
      len = 1;
      content.appendChild(textNode());
    } else if (len === 1 && // ignore html`static` or svg`static` because
    // these nodes can be passed directly as never mutated
    length !== 1 && childNodes[0].nodeType !== ELEMENT_NODE) {
      len = 0;
    }
    return set(cache2, template2, abc(content, entries, len === 1));
  };
  var cache2 = /* @__PURE__ */ new WeakMap();
  var prefix = "is\xB5";
  var parser_default = (xml) => (template2, values) => cache2.get(template2) || resolve(template2, values, xml);

  // node_modules/uhtml/esm/rabbit.js
  var createHTML = creator_default(parser_default(false));
  var createSVG = creator_default(parser_default(true));
  var unroll = (info, { s: s2, t: t2, v: v2 }) => {
    if (info.a !== t2) {
      const { b: b2, c: c2 } = (s2 ? createSVG : createHTML)(t2, v2);
      info.a = t2;
      info.b = b2;
      info.c = c2;
    }
    for (let { c: c2 } = info, i2 = 0; i2 < c2.length; i2++) {
      const value = v2[i2];
      const detail2 = c2[i2];
      switch (detail2.u) {
        case array:
          detail2.v = array(
            detail2.t,
            unrollValues(detail2.c, value),
            detail2.v
          );
          break;
        case hole:
          const current2 = value instanceof Hole ? unroll(detail2.c || (detail2.c = cache()), value) : (detail2.c = null, value);
          if (current2 !== detail2.v)
            detail2.v = hole(detail2, current2);
          break;
        default:
          if (value !== detail2.v)
            detail2.v = detail2.u(detail2.t, value, detail2.n, detail2.v);
          break;
      }
    }
    return info.b;
  };
  var unrollValues = (stack, values) => {
    let i2 = 0, { length } = values;
    if (length < stack.length) stack.splice(length);
    for (; i2 < length; i2++) {
      const value = values[i2];
      if (value instanceof Hole)
        values[i2] = unroll(stack[i2] || (stack[i2] = cache()), value);
      else stack[i2] = null;
    }
    return values;
  };
  var Hole = class {
    constructor(svg3, template2, values) {
      this.s = svg3;
      this.t = template2;
      this.v = values;
    }
    toDOM(info = cache()) {
      return unroll(info, this);
    }
  };

  // node_modules/uhtml/esm/render/hole.js
  var known = /* @__PURE__ */ new WeakMap();
  var hole_default = (where, what) => {
    const info = known.get(where) || set(known, where, cache());
    const { b: b2 } = info;
    if (b2 !== (typeof what === "function" ? what() : what).toDOM(info))
      where.replaceChildren(info.b.valueOf());
    return where;
  };

  // node_modules/uhtml/esm/index.js
  var tag = (svg3) => (template2, ...values) => new Hole(svg3, template2, values);
  var html = tag(false);
  var svg2 = tag(true);

  // src/scope.js
  var currentScope = null;
  function createScope() {
    return {
      _cleanups: /* @__PURE__ */ new Set(),
      _disposed: false
    };
  }
  function withScope(scope, fn) {
    const previousScope = currentScope;
    currentScope = scope;
    try {
      return fn();
    } finally {
      currentScope = previousScope;
    }
  }
  function effect(fn) {
    const stop = E(fn);
    if (currentScope && !currentScope._disposed) {
      currentScope._cleanups.add(stop);
    }
    return stop;
  }
  function disposeScope(scope) {
    if (!scope || scope._disposed) {
      return;
    }
    scope._disposed = true;
    const cleanups = [...scope._cleanups].reverse();
    scope._cleanups.clear();
    for (const cleanup of cleanups) {
      try {
        cleanup();
      } catch (e2) {
        console.error("[Plainly] cleanup error:", e2);
      }
    }
  }

  // src/ext.js
  var ext = {};

  // src/store.js
  var registry = /* @__PURE__ */ new Map();
  function isSignal(obj) {
    return obj && typeof obj === "object" && typeof obj.peek === "function" && "value" in obj;
  }
  function defineStore(name, factory) {
    if (registry.has(name)) {
      throw new Error(
        true ? `[Plainly] store "${name}" is already defined` : name
      );
    }
    registry.set(name, {
      _factory: factory,
      _ready: false,
      _resolving: false
    });
    return () => store(name);
  }
  function store(name) {
    const entry = registry.get(name);
    if (!entry) {
      throw new Error(
        true ? `[Plainly] store "${name}" is not defined` : name
      );
    }
    if (entry._ready) {
      return entry._instance;
    }
    if (entry._resolving) {
      throw new Error(
        true ? `[Plainly] circular dependency: "${name}"` : name
      );
    }
    entry._resolving = true;
    const scope = createScope();
    try {
      entry._instance = withScope(
        scope,
        () => entry._factory(
          {
            ...ext,
            signal: d,
            computed: w,
            effect,
            html,
            store
          },
          storeAccess()
        )
      );
      entry._ready = true;
    } catch (e2) {
      disposeScope(scope);
      throw e2;
    } finally {
      entry._resolving = false;
    }
    return entry._instance;
  }
  function storeAccess() {
    return new Proxy(
      {},
      {
        get(_2, name) {
          if (typeof name !== "string") {
            return void 0;
          }
          return store(name);
        },
        has(_2, name) {
          return typeof name === "string" && registry.has(name);
        }
      }
    );
  }

  // src/component.js
  function toKebab(str) {
    return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  }
  function toCamel(str) {
    return str.replace(/-([a-z])/g, (_2, char) => char.toUpperCase());
  }
  var DEFAULTS = /* @__PURE__ */ new Map([
    [String, () => ""],
    [Number, () => 0],
    [Boolean, () => false],
    [Object, () => ({})],
    [Array, () => []]
  ]);
  function defaultFor(type) {
    return DEFAULTS.get(type)?.() ?? null;
  }
  function parseAttr(value, type) {
    if (type === Number) {
      const n2 = Number(value);
      if (!Number.isNaN(n2)) {
        return n2;
      }
      if (true) {
        console.warn(`[Plainly] cannot parse "${value}" as Number`);
      }
      return 0;
    }
    if (type === Boolean) {
      return value !== "false";
    }
    if (type === Object || type === Array) {
      try {
        return JSON.parse(value);
      } catch {
        return defaultFor(type);
      }
    }
    return value;
  }
  function detectType(raw, attrVal, defaultValue) {
    if (raw != null) {
      return raw.constructor;
    }
    if (attrVal === null) {
      return defaultValue != null ? defaultValue.constructor : String;
    }
    const trimmed = attrVal.trim();
    if (trimmed !== "" && !isNaN(Number(trimmed))) return Number;
    if (trimmed === "true" || trimmed === "false") return Boolean;
    if (trimmed[0] === "{") return Object;
    if (trimmed[0] === "[") return Array;
    return String;
  }
  var ReadonlyProp = class {
    constructor(s2, key) {
      this._s = s2;
      this._key = key;
    }
    get value() {
      return this._s.value;
    }
    set value(_2) {
      if (true) {
        console.warn(`[Plainly] prop "${this._key}" is read-only`);
      }
    }
    peek() {
      return this._s.peek();
    }
  };
  function defineComponent(tagName, setup) {
    if (customElements.get(tagName)) {
      throw new Error(
        true ? `[Plainly] <${tagName}> is already defined` : tagName
      );
    }
    class Component extends HTMLElement {
      // name -> ReadonlyProp или внешний сигнал/функция
      #props = /* @__PURE__ */ new Map();
      // name -> { s, type, def }: только сигналы, которыми владеет компонент.
      // Внешние сигналы сюда НЕ попадают, атрибуты их не перезаписывают.
      #owned = /* @__PURE__ */ new Map();
      // имя атрибута (в нижнем регистре) -> имя пропса
      #attrToProp = /* @__PURE__ */ new Map();
      #slots = null;
      // scope живёт, пока компонент смонтирован; null — не смонтирован
      #scope = null;
      #observer = null;
      #resolveProp(name, type, defaultValue) {
        const key = toCamel(name);
        if (this.#props.has(key)) {
          return this.#props.get(key);
        }
        const raw = Object.prototype.hasOwnProperty.call(this, key) ? this[key] : void 0;
        if (isSignal(raw) || typeof raw === "function") {
          this.#props.set(key, raw);
          return raw;
        }
        const kebab = toKebab(key);
        const attrVal = this.getAttribute(`data-${kebab}`) ?? this.getAttribute(`data-${key.toLowerCase()}`);
        const finalType = type ?? detectType(raw, attrVal, defaultValue);
        const initial = raw !== void 0 ? raw : attrVal !== null ? parseAttr(attrVal, finalType) : defaultValue !== void 0 ? defaultValue : defaultFor(finalType);
        const s2 = d(initial);
        this.#owned.set(key, { s: s2, type: finalType, def: defaultValue });
        this.#attrToProp.set(`data-${kebab}`, key);
        this.#attrToProp.set(`data-${key.toLowerCase()}`, key);
        const prop = new ReadonlyProp(s2, key);
        this.#props.set(key, prop);
        return prop;
      }
      #collectSlots() {
        if (this.#slots) {
          return this.#slots;
        }
        const slots = {
          default: []
        };
        for (const node of [...this.childNodes]) {
          const name = node instanceof Element && node.getAttribute("data-slot");
          if (name) {
            (slots[name] ??= []).push(...node.childNodes);
          } else {
            slots.default.push(node);
          }
        }
        return this.#slots = slots;
      }
      #ctx() {
        const slots = this.#collectSlots();
        return {
          ...ext,
          $this: this,
          signal: d,
          computed: w,
          effect,
          html,
          prop: (name, type, def) => this.#resolveProp(name, type, def),
          slot: Object.assign(
            (name) => slots[name] ?? [],
            { default: slots.default }
          )
        };
      }
      #onAttributes(mutations) {
        for (const { attributeName } of mutations) {
          const entry = this.#owned.get(this.#attrToProp.get(attributeName));
          if (!entry) {
            continue;
          }
          const value = this.getAttribute(attributeName);
          entry.s.value = value === null ? entry.def ?? defaultFor(entry.type) : parseAttr(value, entry.type);
        }
      }
      #mount(scope) {
        if (this.#scope !== scope) {
          return;
        }
        try {
          withScope(scope, () => {
            const renderFn = setup(
              this.#ctx(),
              storeAccess()
            );
            if (typeof renderFn === "function") {
              effect(() => {
                hole_default(this, renderFn());
              });
            }
          });
        } catch (e2) {
          console.error(
            `[Plainly] error mounting <${tagName}>:`,
            e2
          );
          this.#teardown();
        }
      }
      connectedCallback() {
        if (this.#scope) {
          return;
        }
        const scope = this.#scope = createScope();
        this.#observer = new MutationObserver(
          (mutations) => this.#onAttributes(mutations)
        );
        this.#observer.observe(this, {
          attributes: true
        });
        if (document.readyState === "loading") {
          document.addEventListener(
            "DOMContentLoaded",
            () => this.#mount(scope),
            { once: true }
          );
        } else {
          queueMicrotask(() => this.#mount(scope));
        }
      }
      disconnectedCallback() {
        queueMicrotask(() => {
          if (!this.isConnected) {
            this.#teardown();
          }
        });
      }
      #teardown() {
        this.#observer?.disconnect();
        this.#observer = null;
        disposeScope(this.#scope);
        this.#scope = null;
        this.#props.clear();
        this.#owned.clear();
        this.#attrToProp.clear();
      }
    }
    customElements.define(tagName, Component);
  }

  // src/bus.js
  var listeners2 = /* @__PURE__ */ new Map();
  var cache3 = /* @__PURE__ */ new Map();
  var bus = {
    emit(type, payload) {
      cache3.set(type, payload);
      listeners2.get(type)?.forEach((fn) => fn(payload));
    },
    on(type, handler) {
      if (!listeners2.has(type)) listeners2.set(type, /* @__PURE__ */ new Set());
      const set2 = listeners2.get(type);
      set2.add(handler);
      if (cache3.has(type)) n(() => handler(cache3.get(type)));
      return () => set2.delete(handler);
    }
  };

  // src/index.js
  ext.bus = bus;
  var Plainly = {
    defineComponent,
    defineStore,
    store,
    signal: d,
    computed: w,
    effect,
    batch: r,
    html,
    svg: svg2,
    bus,
    // поля, которые аддоны добавляют в контекст компонентов и сторов
    ctx: ext
  };
  window.Plainly = Plainly;

  // src/location.js
  function parseQuery(search = window.location.search) {
    const result = {};
    const params = new URLSearchParams(search);
    for (const [rawKey, value] of params) {
      const isArray2 = rawKey.endsWith("[]");
      const key = isArray2 ? rawKey.slice(0, -2) : rawKey;
      if (isArray2) {
        (result[key] ??= []).push(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  }
  function stringifyQuery(query2) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query2)) {
      if (value == null) continue;
      if (Array.isArray(value)) {
        for (const item of value) {
          if (item != null) {
            params.append(`${key}[]`, item);
          }
        }
      } else {
        params.set(key, value);
      }
    }
    return params.toString();
  }
  function getPath() {
    return window.location.pathname || "/";
  }
  function getHash() {
    return window.location.hash;
  }
  function getUrl() {
    return getPath() + window.location.search + getHash();
  }
  function snapshot() {
    return {
      url: getUrl(),
      path: getPath(),
      hash: getHash(),
      query: parseQuery()
    };
  }
  var current = d(snapshot());
  var query = w(() => current.value.query);
  function sync() {
    if (getUrl() === current.peek().url) {
      return;
    }
    current.value = snapshot();
  }
  function update(url, replace = true) {
    history[replace ? "replaceState" : "pushState"](
      null,
      "",
      url
    );
    return url;
  }
  function withQuery(path, next) {
    const search = stringifyQuery(next);
    return path + (search ? `?${search}` : "");
  }
  var location = {
    current,
    query,
    url(value) {
      if (value === void 0) {
        return getUrl();
      }
      return update(value);
    },
    path(value) {
      if (value === void 0) {
        return getPath();
      }
      return update(withQuery(value, current.value.query));
    },
    get(key) {
      return current.value.query[key];
    },
    getAll() {
      return current.value.query;
    },
    set(values, value) {
      const next = {
        ...current.value.query
      };
      if (typeof values === "string") {
        values = {
          [values]: value
        };
      }
      for (const [key, val] of Object.entries(values)) {
        if (val == null) {
          delete next[key];
        } else {
          next[key] = val;
        }
      }
      return update(withQuery(getPath(), next) + getHash());
    },
    go(value) {
      window.location.href = value ?? getUrl();
    },
    // меняет URL без записи в историю
    replace(value) {
      return update(value ?? getUrl(), true);
    },
    // меняет URL с новой записью в истории (работает кнопка «назад»)
    push(value) {
      return update(value ?? getUrl(), false);
    },
    back() {
      window.history.back();
    },
    forward() {
      window.history.forward();
    }
  };
  window.addEventListener("popstate", sync);
  window.addEventListener("hashchange", sync);
  for (const method of ["pushState", "replaceState"]) {
    const original = history[method];
    history[method] = function(...args) {
      const result = original.apply(this, args);
      sync();
      return result;
    };
  }

  // src/router.js
  function createRouter(routes, { mode = "hash" } = {}) {
    const hashMode = mode === "hash";
    const routeMap = {};
    const compiledRoutes = [];
    let notFound = {
      render: () => "404"
    };
    for (const r2 of routes) {
      if (r2.path === "*") {
        notFound = routeMap[r2.name || "*"] = {
          ...r2,
          keys: []
        };
        continue;
      }
      const keys = [];
      const regex = new RegExp(
        "^" + r2.path.replace(
          /:([^/]+)/g,
          (_2, k) => {
            keys.push(k);
            return "([^/]+)";
          }
        ) + "$"
      );
      const entry = {
        ...r2,
        keys,
        regex
      };
      compiledRoutes.push(entry);
      if (r2.name) {
        routeMap[r2.name] = entry;
      }
    }
    function parse(path2) {
      for (const route2 of compiledRoutes) {
        const match = path2.match(route2.regex);
        if (!match) continue;
        const params = {};
        route2.keys.forEach((key, index) => {
          params[key] = decodeURIComponent(
            match[index + 1]
          );
        });
        return {
          path: path2,
          route: route2,
          params
        };
      }
      return {
        path: path2,
        route: notFound,
        params: {}
      };
    }
    const path = w(() => {
      const { path: path2, hash } = location.current.value;
      return (hashMode ? hash.slice(1) : path2) || "/";
    });
    const current2 = w(() => parse(path.value));
    function route(name, params = {}) {
      const r2 = routeMap[name];
      if (!r2) {
        throw new Error(
          true ? `[Plainly] route "${name}" not found` : name
        );
      }
      let path2 = r2.path;
      for (const key of r2.keys) {
        if (!(key in params)) {
          throw new Error(
            true ? `[Plainly] missing param "${key}" for route "${name}"` : key
          );
        }
        path2 = path2.replace(
          ":" + key,
          encodeURIComponent(params[key])
        );
      }
      return hashMode ? "#" + path2 : path2;
    }
    function go(nameOrPath, params) {
      const href = routeMap[nameOrPath] ? route(nameOrPath, params) : hashMode ? "#" + nameOrPath.replace(/^#/, "") : nameOrPath;
      location.push(href);
      return href;
    }
    function view() {
      const { route: route2, params } = current2.value;
      return route2.render(params);
    }
    return {
      current: current2,
      go,
      view,
      route
    };
  }

  // src/addon.js
  var Plainly2 = window.Plainly;
  Plainly2.location = Plainly2.ctx.location = location;
  Plainly2.router = createRouter;
})();
//# sourceMappingURL=plainly.dev.js.map
