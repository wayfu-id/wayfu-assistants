import MyArray from "./../models/MyArray";

type elemenOptions = ElementCreationOptions & {
    tag: keyof HTMLElementTagNameMap,
    text: string,
    html: string,
    classid?: string | string[],
    append?: String | HTMLElement,
    prepend?: String | HTMLElement,
    before?: String | HTMLElement,
    after?: String | HTMLElement,
    replace?: String | HTMLElement,
    event?: DocumentEventMap[],
    callback?: (node:HTMLElement) => any,
}

type listElemenOptions = elemenOptions & {
    title: string,
    content: string | MyArray<string>,
}

type svgElementOptions = elemenOptions & {
    d: string | string[],
    dPath: string | string[],
    size?: string,
    fill?: string,
    viewBox?: string
}

type svgElementDetails = {
    type: keyof SVGElementTagNameMap,
    data: SVGElement
};

type eventDetails = {[k: string]: EventListener};

type elementStyles = elemenOptions & CSSStyleDeclaration;

type inputElement = elemenOptions & HTMLInputElement;

class HtmlModifier {
    /** Get HTML element from query selector. */
    getElement(selector: HTMLElement): HTMLElement;
    /** Get HTML element from query selector. */
    getElement(selector: String): HTMLElement;

    /** Get HTML element based from query selector and it's parent */
    getElement(selector: String, parent: String): HTMLElement;
    /** Get HTML element based from query selector and it's parent */
    getElement(selector: String, parent: HTMLElement): HTMLElement;
    /** Get HTML element based from query selector and it's parent */
    getElement(selector: HTMLElement, parent: String): HTMLElement;
    /** Get HTML element based from query selector and it's parent */
    getElement(selector: HTMLElement, parent: HTMLElement): HTMLElement;

    /** Get Nodelist from query selector. */
    getElement(selector: String, getAll: true): NodeList;
    /** Get Nodelist from query selector. */
    getElement(selector: HTMLElement, getAll: true): NodeList;
    
    /** Get Nodelist based from query selector and it's parent */
    getElement(selector: String, parent: String, getAll: true): NodeList;
    /** Get Nodelist based from query selector and it's parent */
    getElement(selector: String, parent: HTMLElement, getAll: true): NodeList;
    /** Get Nodelist based from query selector and it's parent */
    getElement(selector: HTMLElement, parent: String, getAll: true): NodeList;
    /** Get Nodelist based from query selector and it's parent */
    getElement(selector: HTMLElement, parent: HTMLElement, getAll: true): NodeList;

    /** Get HTML Parent element(s) from query selector. */
    getParents(element: String, selector: String): HTMLElement[];
    getParents(element: HTMLElement, selector: String): HTMLElement[];
    
    /** Create an Elements */
    createElement(props: elemenOptions): HTMLElement;

    /** Create multiple elements inside parents element, with spesific parent */
    createElements(options: Array.<elemenOptions>, parent: elemenOptions): HTMLElement;
    /** Create multiple elements inside parents element, with spesific parent */
    createElements(options: Array.<elemenOptions>, parent: String): HTMLElement;
    /** Create multiple elements inside parents element, with spesific parent */
    createElements(options: Array.<elemenOptions>, parent: HTMLElement): HTMLElement;
    /** Create multiple elements */
    createElements(options: Array.<elemenOptions>): HtmlModifier;

    /** Create list element */
    createListElement(items: Array.<listElemenOptions | String>, type?: "ol" | "ul", props?: elemenOptions ): HTMLElement;
    createListElement(items: Array.<listElemenOptions | String>, type?: "ol" | "ul" ): HTMLElement;
    createListElement(items: Array.<listElemenOptions | String>): HTMLElement;

    /** Create Select Element */
    createSelectElement(props: elemenOptions, items: String[], event?: eventDetails): HTMLSelectElement;

    /** Create Checkbox Element */
    createCheckElement(props: elemenOptions, event: eventDetails): HTMLElement;

    /** Create Label element */
    createLabelElement(props: elemenOptions): HTMLElement;

    /** Create SVG element */
    createSVGElement(shape: svgElementDetails | Array.<svgElementDetails>, attr: SVGSVGElement): SVGSVGElement;
    // createSVGElement(props: svgElementOptions): HTMLElement;

    /** Set/Edit single or multiple element style */
    setElementStyle(selector: String, props: elementStyles): HtmlModifier;
    setElementStyle(selector: HTMLElement, props: elementStyles): HtmlModifier;

    /** Set/Edit multiple element style */
    setElementsStyle(selector: String, props: elementStyles): HtmlModifier;
    setElementsStyle(selector: { elm: String; props: elementStyles }[]): HtmlModifier;

    /** Set/Edit single or multiple element tag */
    setElement(selector: String, props: inputElement): HtmlModifier;
    setElement(selector: HTMLElement, props: inputElement): HtmlModifier;

    /** Set/Edit multiple element tag */
    setElements(options?: { elm: String; props: inputElement }[]): HtmlModifier;

    /** Check html element is exist or not */
    hasElement(selector: String, timeout?: number): Promise<HTMLElement | false>;
    hasElement(selector: HTMLElement, timeout?: number): Promise<HTMLElement | false>;

    /** Insert an element to target element */
    insertElement(selector: String, parent: String): HtmlModifier;
    insertElement(selector: String, parent: HTMLElement): HtmlModifier;
    insertElement(selector: HTMLElement, parent: String): HtmlModifier;
    insertElement(selector: HTMLElement, parent: HTMLElement): HtmlModifier;

    /** Remove a spesific element */
    removeElement(selector: String): HtmlModifier;
    /** Remove a spesific element */
    removeElement(selector: HTMLElement): HtmlModifier;
    /** Remove a spesific element from spesific parent, return it's parent element */
    removeElement(selector: String, parent: String): HTMLElement;
    /** Remove a spesific element from spesific parent, return it's parent element */
    removeElement(selector: String, parent: HTMLElement): HTMLElement;
    /** Remove a spesific element from spesific parent, return it's parent element */
    removeElement(selector: HTMLElement, parent: String): HTMLElement;
    /** Remove a spesific element from spesific parent, return it's parent element */
    removeElement(selector: HTMLElement, parent: HTMLElement): HTMLElement;

    /** Add event listener to an element */
    onEvent(selector: String, type: String, listener: EventListener, bubbles?: boolean): HtmlModifier;
    onEvent(selector: HTMLElement, type: String, listener: EventListener, bubbles?: boolean): HtmlModifier;

    /** Force doing some event on an elemenet */
    eventFire(selector: String, type: String, message: String, opt?: EventInit ): HtmlModifier;
    eventFire(selector: HTMLElement, type: String, message: String, opt?: EventInit ): HtmlModifier;

    /** Add <style> element at the head */
    addStyle(css: String, props?: elemenOptions): HtmlModifier;
}

export const DOM: HtmlModifier;