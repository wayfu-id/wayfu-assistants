import MyArray from "../models/MyArray";

/**
 * @typedef {{
 *  (selector: String | HTMLElement): HTMLElement | null;
 *  (selector: String | HTMLElement, parent:String | HTMLElement): HTMLElement  | null;
 *  (selector: String | HTMLElement, getAll: true): NodeList;
 *  (selector: String | HTMLElement, parent: String | HTMLElement, getAll: true): NodeList;
 *  }} gotElements
 *
 * @typedef { ElementCreationOptions & {
 *     tag: keyof HTMLElementTagNameMap,
 *     text?: string,
 *     html?: string,
 *     classid?: string | string[],
 *     append?: String | HTMLElement,
 *     prepend?: String | HTMLElement,
 *     before?: String | HTMLElement,
 *     after?: String | HTMLElement,
 *     replace?: String | HTMLElement,
 *     event?: DocumentEventMap[],
 *     callback?: (node:HTMLElement) => any,
 * }} elemenOptions
 *
 * @typedef { elemenOptions & {
 *     title: String,
 *     content: String | MyArray<String>
 * }} listElementOptions
 *
 * @typedef { elemenOptions & {
 *     size: string,
 *     d: string | string[],
 *     dPath: string | string[],
 *     fill?: string,
 *     viewBox?: string
 * }} svgElemenOptions
 *
 * @typedef {{
 *     type: keyof SVGElementTagNameMap,
 *     data: SVGElement
 * }} svgElementDetails
 *
 * @typedef { elemenOptions & CSSStyleDeclaration } elementStyles
 *
 * @typedef { elemenOptions & HTMLInputElement } inputElement
 *
 * @typedef { {[k: string]: EventListener} } eventDetails
 */

/**
 * DOM / HTML Modifier Libraries.
 * Simplify built-in DOM function
 */
class HtmlModifier {
    constructor() {}

    /**
     * Get HTML element(s) from query selector.
     * @type {gotElements}
     */
    getElement(selector, parent, getAll) {
        let [node, all] = ((c, a) => {
            if (typeof c === "boolean") {
                return [null, c];
            } else if (c) {
                return [this.getElement(c), a ?? false];
            }
            return [null, false];
        })(parent, getAll);

        if (typeof selector === "string") {
            selector = selector.trim();
            node = node && node instanceof HTMLElement ? node : document;
            if (!all) {
                return node.querySelector(selector);
            } else {
                return node.querySelectorAll(selector);
            }
        } else if (selector instanceof HTMLElement || selector instanceof NodeList) {
            return selector;
        }
    }

    /**
     * Get parent element from an element
     * @param {string | HTMLElement} element current element
     * @param {string} selector HTML selector for parent element
     * @returns
     */
    getParents(element, selector) {
        if (!Element.prototype.matches) {
            Element.prototype.matches =
                Element.prototype.matchesSelector ||
                Element.prototype.mozMatchesSelector ||
                Element.prototype.msMatchesSelector ||
                Element.prototype.oMatchesSelector ||
                function (s) {
                    var matches = (this.document || this.ownerDocument).querySelectorAll(
                            s
                        ),
                        i = matches.length;
                    while (--i >= 0 && matches.item(i) !== this) {}
                    return i > -1;
                };
        }
        let parents = [];
        /** @type {HTMLElement} */
        let elem = this.getElement(element);
        for (; elem && elem !== document; elem = elem.parentNode) {
            if (selector) {
                if (elem.matches(selector)) {
                    parents.push(elem);
                }
                continue;
            }
            parents.push(elem);
        }
        return parents;
    }

    /**
     * Create an HTML Element
     * @param {elemenOptions} props html tag and attributes
     * @returns {HTMLElement}
     */
    createElement(props) {
        let elem, node, text;
        for (const name in props) {
            if (props.hasOwnProperty(name)) {
                switch (name) {
                    case "tag":
                        node = document.createElement(props[name]);
                        break;
                    case "text":
                        text = "innerText" in document ? "innerText" : "textContent";
                        node[text] = props[name];
                        break;
                    case "html":
                        node.innerHTML = props[name];
                        break;
                    case "classid":
                        if (typeof props[name] === "array") {
                            for (let cls of props[name]) {
                                node.classList.add(cls);
                            }
                        } else if (typeof props[name] === "string") {
                            node.className = props[name];
                        }
                        break;
                    case "append":
                        elem = this.getElement(props[name]);
                        elem.appendChild(node);
                        break;
                    case "prepend":
                        elem = this.getElement(props[name]);
                        if (elem.childNodes.length) {
                            elem.insertBefore(node, elem.childNodes[0]);
                        }
                        elem.appendChild(node);
                        break;
                    case "before":
                        elem = this.getElement(props[name]);
                        elem.parentNode.insertBefore(node, elem);
                        break;
                    case "after":
                        elem = this.getElement(props[name]);
                        elem.parentNode.insertBefore(node, elem.nextSibling);
                        break;
                    case "replace":
                        elem = this.getElement(props[name]);
                        elem.parentNode.replaceChild(node, elem);
                        break;
                    case "event":
                        for (const evName in props.event) {
                            if (props.event.hasOwnProperty(evName)) {
                                this.onEvent(node, evName, props.event[evName]);
                            }
                        }
                        break;
                    case "callback":
                        props[name](node);
                        break;
                    default:
                        node.setAttribute(name, props[name]);
                }
            }
        }
        return node;
    }

    /**
     * Create some HTML elements, can be inserted to parent element if setted
     * @param {elemenOptions[]} options elements properties
     * @param {(elemenOptions | HTMLElement | String)} [parent?] parent element
     * @returns
     */
    createElements(options, parent) {
        /** @type {HTMLElement} */
        let parentElm = parent
            ? parent instanceof window.HTMLElement
                ? parent
                : typeof parent === "object" && parent.tag != null
                ? this.createElement(parent)
                : null
            : typeof parent === "string"
            ? this.getElement(parent)
            : null;
        if (Array.isArray(options)) {
            for (let props of options) {
                if (typeof props !== "object" && !props.tag) continue;
                if (parentElm) props.append = parentElm;
                this.createElement(props);
            }
        }
        return parentElm ? parentElm : this;
    }

    /**
     * Create A List item elements `Support Nasted items`
     * @param {MyArray<listElementOptions|String>} items list items
     * @param {"ol"|"ul"} type list type
     * @param {elemenOptions} props other html properties for list
     * @returns
     */
    createListElement(items, type = "ol", props = {}) {
        let lists = this.createElement(Object.assign({ tag: type }, props));
        if (Array.isArray(items)) {
            items.forEach((e) => {
                if (typeof e === "object") {
                    let item = this.createElement({
                        tag: "li",
                        html: e.title,
                        append: lists,
                    });
                    if (Array.isArray(e.content)) {
                        this.createListElement(e.content, type || "ol", { append: item });
                    }
                } else if (typeof e === "string") {
                    this.createElement({ tag: "li", html: e, append: lists });
                }
            });
        }
        return lists;
    }

    /**
     * Create Select Element
     * @param {elemenOptions} props
     * @param {String[]} items
     * @param {eventDetails?} event
     * @return {HTMLSelectElement}
     */
    createSelectElement(props, items, event) {
        const { id, classid } = props;
        const parent = this.createElement({ tag: "select", id: id, classid });
        /** @type {(items: string[]) => HTMLElement[]} */
        const createOption = (items) => {
            return items.map((val) =>
                this.createElement({ tag: "option", value: val, text: val })
            );
        };

        parent.append(...createOption(items));
        if (event) for (let evt in event) this.onEvent(parent, evt, event[evt]);

        return parent;
    }

    /**
     * Create Check box element
     * @param {elemenOptions} props
     * @param {string?} title
     * @param {eventDetails?} event
     * @return {HTMLElement}
     */
    createCheckElement(props, event) {
        const { id, classid } = props;
        const input = this.createElement({
            tag: "input",
            type: "checkbox",
            id: id,
            name: id,
            classid,
        });

        if (event) for (let evt in event) this.onEvent(input, evt, event[evt]);
        return input;
    }

    /**
     * Create Label element
     * @param {elemenOptions} props
     * @return {HTMLElement}
     */
    createLabelElement(props) {
        const { id, classid, text } = props;
        return this.createElement({ tag: "label", for: id, classid, text });
    }

    /**
     * Create an svg element
     * @param {svgElementDetails | Array.<svgElementDetails>} shape SVG Shape(s), can be object or array of object
     * @param {SVGSVGElement} attr main SVG attributes if any
     * @return {SVGElement}
     */
    createSVGElement(shape, attr = {}) {
        /**
         * @template {keyof SVGElementTagNameMap} T
         * @type { (type: T, data: SVGElement) => SVGElementTagNameMap[T] }
         */
        const getNode = (type, data) => {
            let node = document.createElementNS("http://www.w3.org/2000/svg", type),
                keyReplacer = (m) => `-${m.toLocaleLowerCase()}`;

            for (let key in data) {
                let attrName =
                    key === "viewBox" ? key : key.replace(/[A-Z]/g, keyReplacer);
                node.setAttributeNS(null, attrName, data[key]);
            }

            return node;
        };
        const svgContainer = getNode("svg", attr),
            shapes = Array.isArray(shape) ? shape : [shape];

        shapes.forEach((shape) => {
            const { type, data } = shape;
            svgContainer.appendChild(getNode(type, data));
        });

        return svgContainer;
    }

    /**
     * Set/Edit single or multiple element style
     * @param {string | HTMLElement} selector target element
     * @param {elementStyles} props element style properties
     * @returns
     */
    setElementStyle(selector, props) {
        /** @type {HTMLElement[]} */
        const elms =
            selector instanceof window.HTMLElement
                ? [selector]
                : this.getElement(selector, true);
        if (elms && elms.length !== 0 && !!elms[0]) {
            for (const node of elms) {
                for (const key in props) {
                    if (props.hasOwnProperty(key)) {
                        switch (key) {
                            case "zIndex":
                                node.style.zIndex = props[key];
                                break;
                            case "margin":
                                node.style.margin = props[key];
                                break;
                            case "padding":
                                node.style.padding = props[key];
                                break;
                            case "display":
                                node.style.display = props[key];
                                break;
                            default:
                                node.style[key] = props[key];
                        }
                    }
                }
            }
        }
        return this;
    }

    /**
     * Set/Edit multiple element style
     * @param {string | {elm: string | HTMLElement, props: elementStyles}[]} selector elements target or array of object contains {elm, props}
     * @param {elementStyles} props element style properties
     * @returns
     */
    setElementsStyle(selector, props) {
        if (Array.isArray(selector)) {
            selector.forEach((e) => {
                this.setElementStyle(e.elm, e.props);
            });
        } else if (typeof selector === "string") {
            this.getElement(selector, true).forEach((e) => {
                this.setElementStyle(e, props);
            });
        }
        return this;
    }

    /**
     * Set/Edit single or multiple element tag
     * @param {string | HTMLElement} selector target element(s)
     * @param {inputElement} props contains HTMLELement tag
     * @returns
     */
    setElement(selector, props) {
        /** @type {HTMLInputElement[]} */
        const elms =
            selector instanceof window.HTMLElement
                ? [selector]
                : this.getElement(selector, true);
        let text;
        if (elms && elms.length !== 0 && !!elms[0]) {
            for (const node of elms) {
                for (const name in props) {
                    if (props.hasOwnProperty(name)) {
                        switch (name) {
                            case "text":
                                text =
                                    "innerText" in document ? "innerText" : "textContent";
                                node[text] = props[name];
                                break;
                            case "html":
                                node.innerHTML = props[name];
                                break;
                            case "class":
                                node.className = props[name];
                                break;
                            case "addClass":
                                node.classList.add(props[name]);
                                break;
                            case "removeClass":
                                node.classList.remove(props[name]);
                                break;
                            case "toggleClass":
                                node.classList.toggle(props[name]);
                                break;
                            case "disabled":
                                node.disabled = props[name];
                                break;
                            case "value":
                                node.value = props[name];
                                break;
                            case "dispatch":
                                node.dispatchEvent(props[name]);
                                break;
                            case "readonly":
                            case "readOnly":
                                node.readOnly = props[name];
                                break;
                            default:
                                node.setAttribute(name, props[name]);
                        }
                    }
                }
            }
        }
        return this;
    }

    /**
     * Set/Edit multiple element tag
     * @param {{elm:string, props:inputElement}[]} options array of object contains {elm, props}
     * @returns
     */
    setElements(options = []) {
        if (Array.isArray(options)) {
            options.forEach((e) => {
                this.setElement(e.elm, e.props);
            });
        }
        return this;
    }

    /**
     * Check html element is exist or not
     * @param {string | HTMLElement} selector target element
     * @param {number} timeout uint miliseconds
     * @returns {Promise<HTMLElement | false>}
     */
    hasElement(selector, timeout = 10) {
        return new Promise((done) => {
            let loop = setInterval(() => {
                /** @type {HTMLElement | null} */
                let elm = this.getElement(selector);
                if (elm) {
                    done(elm);
                    clearInterval(loop);
                }
                if ((timeout -= 1 == 0)) {
                    done(false);
                    clearInterval(loop);
                }
            }, 1e3);
        });
    }

    /**
     * Insert an element to target element
     * @param {string | HTMLElement} selector element
     * @param {string | HTMLElement} parent target element as parent
     * @returns
     */
    insertElement(selector, parent) {
        this.getElement(parent || "body").appendChild(this.getElement(selector));
        return this;
    }

    /**
     * Remove an element to target element
     * @param {string | HTMLElement} selector element
     * @param {string | HTMLElement} parent target element as parent
     * @returns {HTMLElement | this}
     */
    removeElement(selector, parent) {
        this.getElement(parent || "body").removeChild(this.getElement(selector));
        return parent || this;
    }

    /**
     * Add event listener to an element
     * @param {string | HTMLElement} selector element
     * @param {string} type type of event
     * @param {EventListener} listener event listener
     * @param {boolean} bubbles bubbling
     * @returns
     */
    onEvent(selector, type, listener, bubbles = false) {
        /** @type {HTMLElement | null} */
        let element = this.getElement(selector);
        // console.log(element, type, listener);
        if (window.addEventListener) {
            (element || window).addEventListener(type, listener, bubbles);
        }
        return this;
    }

    /**
     * Force doing some event on an elemenet
     * @param {string | HTMLElement} selector element
     * @param {string} type event type
     * @param {string} message event message
     * @param {EventInit=} opt
     * @param {boolean} [opt.bubbles = true]
     * @param {boolean} [opt.composed = true]
     * @returns
     */
    eventFire(selector, type, message, opt = { bubbles: true, composed: true }) {
        this.setElement(selector, {
            text: message || "",
            dispatch: type ? new InputEvent(type, opt) : new MouseEvent("mousedown", opt),
        });
        return this;
    }

    /**
     * Add <style> element at the head
     * @param {string} css stylesheet
     * @param {elemenOptions} props other html attributes
     * @returns
     */
    addStyle(css, props = {}) {
        const opt = { tag: "style", html: css, append: "head" };
        this.createElement(Object.assign({}, opt, props));
        return this;
    }
}

const DOM = new HtmlModifier();
export { DOM };
