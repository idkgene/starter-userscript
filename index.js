// ==UserScript==
// @name         UserScript Name
// @namespace    http://tampermonkey.net/
// @version      0.0
// @description  Sample UserScript
// @author       idkgene (https://github.com/idkgene)
// @license      MIT
// @homepageURL  https://github.com/idkgene/starter-userscript
// @supportURL   https://github.com/idkgene/starter-userscript
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        unsafeWindow
// @run-at       document-idle
// @tag          utilities
// @tag          starter
// @downloadURL link to greasyfork possibly
// @updateURL link to greasyfork possibly
// ==/UserScript==

// @ts-check
/* eslint-disable no-console */

(function () {
    'use strict';

    // Script Configuration
    const CONFIG = {
        DEBUG: true,
        STORAGE_PREFIX: 'UNIVERSAL_SCRIPT_',
    };

    // Utility for logging
    const Logger = {
        log: (message) => CONFIG.DEBUG && console.log(`[UserScript] ${message}`),
        error: (message) => console.error(`[UserScript Error] ${message}`)
    };

    // Utility for working with Local Storage
    const Storage = {
        set: (key, value) => {
            try {
                GM_setValue(`${CONFIG.STORAGE_PREFIX}${key}`, value);
                Logger.log(`Saved ${key}: ${value}`);
            } catch (error) {
                Logger.error(`Failed to save ${key}: ${error}`);
            }
        },
        get: (key, defaultValue = null) => {
            return GM_getValue(`${CONFIG.STORAGE_PREFIX}${key}`, defaultValue);
        },
        delete: (key) => {
            GM_deleteValue(`${CONFIG.STORAGE_PREFIX}${key}`);
        }
    };

    // HTTP-requests
    const HttpClient = {
        get: (url, onSuccess, onError) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: (response) => {
                    if (response.status === 200) {
                        onSuccess(response.responseText);
                    } else {
                        onError(response.statusText);
                    }
                },
                onerror: onError
            });
        }
    };

    // UI Helpers
    const UI = {
        addStyle: (css) => {
            GM_addStyle(css);
        },
        notify: (text, title = 'Notification', timeout = 3000) => {
            GM_notification({
                text: text,
                title: title,
                timeout: timeout
            });
        }
    };

    function main() {
        Logger.log('Script started');

        // Working with Local Storage
        Storage.set('LAST_RUN', Date.now());

        // HTTP request
        HttpClient.get(
            'https://api.example.com/data',
            (data) => {
                Logger.log('Received data: ' + data);
            },
            (error) => {
                Logger.error('Request failed: ' + error);
            }
        );

        // Styles
        UI.addStyle(`
            .userscript-highlight {
                background-color: yellow;
                font-weight: bold;
            }
        `);

        // Notification
        UI.notify('Userscript loaded successfully!');
    }

    // Initialization
    function init() {
        try {
            main();
        } catch (error) {
            Logger.error('Initialization failed: ' + error);
        }
    }

    // Entry Point
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();
