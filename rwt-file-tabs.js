/* Copyright (c) 2021 Read Write Tools. Legal use subject to the File Tabs DOM Component Software License Agreement. */
const Static = {
    componentName: 'rwt-file-tabs',
    elementInstance: 1,
    htmlURL: '/node_modules/rwt-file-tabs/rwt-file-tabs.html',
    cssURL: '/node_modules/rwt-file-tabs/rwt-file-tabs.css',
    htmlText: null,
    cssText: null
};

Object.seal(Static);

export default class RwtFileTabs extends HTMLElement {
    constructor() {
        super(), this.instance = Static.elementInstance++, this.isComponentLoaded = !1, 
        this.repeatingScroll = null, this.scrollableOverflow = 0, this.currentTabId = null, 
        this.currentTabValue = null, this.shell = null, this.tabBox = null, this.scrollBox = null, 
        this.navBox = null, this.navLeft = null, this.navRight = null, this.resizeObserver = null, 
        Object.seal(this);
    }
    async connectedCallback() {
        if (this.isConnected) try {
            var t = await this.getHtmlFragment(), e = await this.getCssStyleElement();
            this.attachShadow({
                mode: 'open'
            }), this.shadowRoot.appendChild(t), this.shadowRoot.appendChild(e), this.identifyChildren(), 
            this.registerEventListeners(), this.configureSlottedTabs(), this.onResize(), this.sendComponentLoaded(), 
            this.validate();
        } catch (t) {
            console.log(t.message);
        }
    }
    getHtmlFragment() {
        return new Promise((async (t, e) => {
            var s = `${Static.componentName}-html-template-ready`;
            if (document.addEventListener(s, (() => {
                var e = document.createElement('template');
                e.innerHTML = Static.htmlText, t(e.content);
            })), 1 == this.instance) {
                var o = await fetch(Static.htmlURL, {
                    cache: 'no-cache',
                    referrerPolicy: 'no-referrer'
                });
                if (200 != o.status && 304 != o.status) return void e(new Error(`Request for ${Static.htmlURL} returned with ${o.status}`));
                Static.htmlText = await o.text(), document.dispatchEvent(new Event(s));
            } else null != Static.htmlText && document.dispatchEvent(new Event(s));
        }));
    }
    getCssStyleElement() {
        return new Promise((async (t, e) => {
            var s = `${Static.componentName}-css-text-ready`;
            if (document.addEventListener(s, (() => {
                var e = document.createElement('style');
                e.innerHTML = Static.cssText, t(e);
            })), 1 == this.instance) {
                var o = await fetch(Static.cssURL, {
                    cache: 'no-cache',
                    referrerPolicy: 'no-referrer'
                });
                if (200 != o.status && 304 != o.status) return void e(new Error(`Request for ${Static.cssURL} returned with ${o.status}`));
                Static.cssText = await o.text(), document.dispatchEvent(new Event(s));
            } else null != Static.cssText && document.dispatchEvent(new Event(s));
        }));
    }
    identifyChildren() {
        this.shell = this.shadowRoot.getElementById('shell'), this.tabBox = this.shadowRoot.getElementById('tab-box'), 
        this.scrollBox = this.shadowRoot.getElementById('scroll-box'), this.navBox = this.shadowRoot.getElementById('nav-box'), 
        this.navLeft = this.shadowRoot.getElementById('nav-left'), this.navRight = this.shadowRoot.getElementById('nav-right');
    }
    registerEventListeners() {
        this.resizeObserver = new ResizeObserver(this.onResize.bind(this)), this.resizeObserver.observe(this.shell), 
        this.resizeObserver.observe(this.tabBox), this.resizeObserver.observe(this.scrollBox), 
        this.navLeft.addEventListener('mousedown', this.onMousedownNavLeft.bind(this)), 
        this.navRight.addEventListener('mousedown', this.onMousedownNavRight.bind(this)), 
        document.addEventListener('mouseup', this.onMouseup.bind(this)), this.tabBox.addEventListener('wheel', this.onWheelTabBox.bind(this), {
            passive: !1
        });
    }
    configureSlottedTabs() {
        var t = this.querySelectorAll('button');
        for (let s = 0; s < t.length; s++) {
            var e = t[s];
            e.classList.add('tab-button'), e.addEventListener('click', this.onClickTab.bind(this));
        }
    }
    sendComponentLoaded() {
        this.isComponentLoaded = !0, this.dispatchEvent(new Event('component-loaded', {
            bubbles: !0
        }));
    }
    waitOnLoading() {
        return new Promise((t => {
            1 == this.isComponentLoaded ? t() : this.addEventListener('component-loaded', t);
        }));
    }
    getCurrentTab() {
        return {
            currentTabId: this.currentTabId,
            currentTabValue: this.currentTabValue
        };
    }
    getTabValue(t) {
        if ('HTMLButtonElement' != t.constructor.name) return '';
        var e = '';
        for (let s = 0; s < t.childNodes.length; s++) '#text' == t.childNodes[s].nodeName && (e += t.childNodes[s].nodeValue);
        return e;
    }
    setCurrentTab(t) {
        if (null == t) return this.currentTabId = null, this.currentTabValue = null, void this.sendTabActiviated();
        if (null != this.shadowRoot.getElementById(t) || null != document.getElementById(t)) {
            var e = this.shadowRoot.querySelectorAll('#scroll-box button');
            for (let o = 0; o < e.length; o++) {
                (s = e[o]).id == t ? (s.classList.add('current-tab'), this.currentTabId = t, this.currentTabValue = this.getTabValue(s)) : s.classList.remove('current-tab');
            }
            e = this.querySelectorAll('button');
            for (let o = 0; o < e.length; o++) {
                var s;
                (s = e[o]).id == t ? (s.classList.add('current-tab'), this.currentTabId = t, this.currentTabValue = this.getTabValue(s)) : s.classList.remove('current-tab');
            }
            this.sendTabActiviated();
        }
    }
    removeAllTabs() {
        var t = this.shadowRoot.querySelectorAll('#scroll-box button');
        for (let e = 0; e < t.length; e++) t[e].remove();
        t = this.querySelectorAll('button');
        for (let e = 0; e < t.length; e++) t[e].remove();
    }
    removeTab(t) {
        if (null != this.shadowRoot.getElementById(t) || null != document.getElementById(t)) {
            var e = null, s = this.shadowRoot.querySelectorAll('#scroll-box button');
            for (let l = 0; l < s.length; l++) {
                (o = s[l]).id == t ? o.remove() : e = o.id;
            }
            s = this.querySelectorAll('button');
            for (let l = 0; l < s.length; l++) {
                var o;
                (o = s[l]).id == t ? o.remove() : e = o.id;
            }
            this.currentTabId == t && this.setCurrentTab(e);
        }
    }
    insertTab(t, e, s) {
        var o = document.createElement('button');
        o.id = t, o.innerHTML = e, o.className = 'tab-button', null != s && o.setAttribute('title', s), 
        this.scrollBox.prepend(o), o.addEventListener('click', this.onClickTab.bind(this)), 
        this.addCloseButtonToTab(o);
    }
    getScrollableOverflow() {
        return this.scrollableOverflow;
    }
    setScrollPosition(t) {
        var e = 0 - t;
        (e < 0 || this.scrollableOverflow + e >= 0) && (this.scrollBox.style.left = `${e}px`);
    }
    scrollMaxRight() {
        var t = 0 - this.scrollableOverflow;
        this.scrollBox.style.left = `${t}px`;
    }
    addCloseButtonToTab(t) {
        if (this.hasAttribute('closable')) {
            var e = document.createElement('button');
            e.innerHTML = '×', e.className = 'x-button', t.prepend(e), e.addEventListener('click', this.onClickClose.bind(this));
        }
    }
    sendTabActiviated() {
        var t = {
            detail: {
                currentTabId: this.currentTabId,
                currentTabValue: this.currentTabValue
            }
        }, e = new CustomEvent('tab-activated', t);
        this.dispatchEvent(e);
    }
    sendTabClosing(t) {
        var e = {
            cancelable: !0,
            detail: {
                currentTabId: t.id,
                currentTabValue: this.getTabValue(t)
            }
        }, s = new CustomEvent('tab-closing', e);
        return this.dispatchEvent(s);
    }
    onResize(t) {
        var e = this.hasAttribute('anchor-side') ? this.getAttribute('anchor-side') : 'right', s = 0;
        if (this.scrollBox.offsetWidth <= this.shell.offsetWidth) {
            this.navBox.style.display = 'none', this.scrollBox.style.left = '0px';
            var o = this.scrollBox.offsetWidth;
            this.tabBox.style.width = `${o}px`, 'right' == e && (s = this.shell.offsetWidth - o);
        } else {
            this.navBox.style.display = 'block';
            o = this.shell.offsetWidth - this.navBox.offsetWidth;
            if (this.tabBox.style.width = `${o}px`, this.scrollBox.offsetLeft < 0) {
                var l = this.tabBox.offsetWidth - this.scrollBox.offsetWidth;
                l < 0 && (this.scrollBox.style.left = `${l}px`);
            }
        }
        this.scrollableOverflow = this.scrollBox.offsetWidth - o, this.scrollableOverflow < 0 && (this.scrollableOverflow = 0), 
        this.changeScrollSide(s);
    }
    changeScrollSide(t) {
        if ('left' == (this.hasAttribute('scroll-side') ? this.getAttribute('scroll-side') : 'right')) {
            var e = `${t}px`;
            this.navBox.style.left = e;
            var s = t + this.navBox.offsetWidth;
            this.tabBox.style.left = `${s}px`;
        } else {
            e = `${t}px`;
            this.tabBox.style.left = e;
            s = t + this.tabBox.offsetWidth;
            this.navBox.style.left = `${s}px`;
        }
    }
    onMousedownNavLeft(t) {
        t.preventDefault();
        var e = this.scrollLeft.bind(this);
        this.repeatingScroll = setInterval(e, 10);
    }
    scrollLeft() {
        var t = Math.floor(this.scrollableOverflow / 50);
        t = Math.min(t, 5), t = Math.max(t, 1);
        var e = this.minMaxScroll(this.scrollBox.offsetLeft + t);
        e != this.scrollBox.offsetLeft ? this.scrollBox.style.left = `${e}px` : (clearInterval(this.repeatingScroll), 
        this.repeatingScroll = null);
    }
    onMousedownNavRight(t) {
        t.preventDefault();
        var e = this.scrollRight.bind(this);
        this.repeatingScroll = setInterval(e, 10);
    }
    scrollRight() {
        var t = Math.floor(this.scrollableOverflow / 50);
        t = Math.min(t, 5), t = Math.max(t, 1);
        var e = this.minMaxScroll(this.scrollBox.offsetLeft - t);
        e != this.scrollBox.offsetLeft ? this.scrollBox.style.left = `${e}px` : (clearInterval(this.repeatingScroll), 
        this.repeatingScroll = null);
    }
    onMouseup(t) {
        null != this.repeatingScroll && (clearInterval(this.repeatingScroll), this.repeatingScroll = null);
    }
    onClickTab(t) {
        this.setCurrentTab(t.currentTarget.id);
    }
    onClickClose(t) {
        t.stopPropagation();
        var e = t.target.parentElement;
        1 == this.sendTabClosing(e) && this.removeTab(e.id);
    }
    onWheelTabBox(t) {
        var e = Math.floor(this.scrollableOverflow / 10);
        if (e = Math.max(e, 1), t.deltaY < 0) {
            var s = this.minMaxScroll(this.scrollBox.offsetLeft - e);
            this.scrollBox.style.left = `${s}px`;
        } else {
            s = this.minMaxScroll(this.scrollBox.offsetLeft + e);
            this.scrollBox.style.left = `${s}px`;
        }
    }
    minMaxScroll(t) {
        return t > 0 && (t = 0), t < -this.scrollableOverflow && (t = -this.scrollableOverflow), 
        t;
    }
    async validate() {
        if (1 == this.instance) {
            var t = (i = window.location.hostname).split('.'), e = 25;
            if (t.length >= 2) {
                var s = t[t.length - 2].charAt(0);
                (s < 'a' || s > 'z') && (s = 'q'), e = s.charCodeAt(s) - 97, e = Math.max(e, 0), 
                e = Math.min(e, 25);
            }
            var o = new Date;
            o.setUTCMonth(0, 1);
            var l = (Math.floor((Date.now() - o) / 864e5) + 1) % 26, i = window.location.hostname, n = `Unregistered ${Static.componentName} component.`;
            try {
                var r = (await import('../../rwt-registration-keys.js')).default;
                for (let t = 0; t < r.length; t++) {
                    var a = r[t];
                    if (a.hasOwnProperty('product-key') && a['product-key'] == Static.componentName) return i != a.registration && console.warn(`${n} See https://readwritetools.com/licensing.blue to learn more.`), 
                    void (l == e && window.setTimeout(this.authenticate.bind(this, a), 1e3));
                }
                console.warn(`${n} rwt-registration-key.js file missing "product-key": "${Static.componentName}"`);
            } catch (t) {
                console.warn(`${n} rwt-registration-key.js missing from website's root directory.`);
            }
        }
    }
    async authenticate(t) {
        var e = encodeURIComponent(window.location.hostname), s = encodeURIComponent(window.location.href), o = encodeURIComponent(t.registration), l = encodeURIComponent(t['customer-number']), i = encodeURIComponent(t['access-key']), n = {
            method: 'POST',
            mode: 'cors',
            credentials: 'omit',
            cache: 'no-cache',
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            body: `product-name=${Static.componentName}&hostname=${e}&href=${s}&registration=${o}&customer-number=${l}&access-key=${i}`
        };
        try {
            var r = await fetch('https://validation.readwritetools.com/v1/genuine/component', n);
            if (200 == r.status) await r.json();
        } catch (t) {
            console.info(t.message);
        }
    }
}

window.customElements.define(Static.componentName, RwtFileTabs);