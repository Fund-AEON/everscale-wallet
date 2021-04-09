/*
  _____ ___  _   ___        __    _ _      _
 |_   _/ _ \| \ | \ \      / /_ _| | | ___| |_
   | || | | |  \| |\ \ /\ / / _` | | |/ _ \ __|
   | || |_| | |\  | \ V  V / (_| | | |  __/ |_
   |_| \___/|_| \_|  \_/\_/ \__,_|_|_|\___|\__|

 */
/**
 * @name FreeTON browser wallet and injector
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */



const uiUtils = {
    /**
     * Open extension popup
     * @returns {Promise<*>}
     */
    openPopup: async () => {
        return browser.windows.create({
            url: 'popup.html',
            type: 'popup',
            width: 350,
            height: 536,
            // left: position.x,
            //  top: position.y,
        });
    },

    /**
     * Show popup selector
     * @param items
     * @param caption
     * @returns {Promise<unknown>}
     */
    popupSelector: (items = [], caption = 'Select item') => {
        return new Promise((resolve, reject) => {
            let buttons = [
                {
                    text: caption,
                    label: true
                },
            ];

            for (let item of items) {
                buttons.push({
                    text: item,
                    onClick: async function () {
                        resolve(item);
                    }
                });
            }

            buttons.push({
                text: 'Cancel',
                color: 'red',
                onClick: async function () {
                    resolve();
                }
            });
            const actions = app.actions.create({
                buttons

            });

            actions.open();
            //actions.$el.addClass('selectNetworkActions')
        })
    },
    /**
     * Copy text to clipboard
     * @param text
     * @returns {Promise<void>}
     */
    copyToClipboard: async (text) => {
        await navigator.clipboard.writeText(text);
        app.toast.create({closeTimeout: 3000, destroyOnClose: true, text: 'Copied!'}).open();

    },

    /**
     * Create callback for self copy element
     * @param dataAttribName
     * @returns {function(): Promise<void>}
     */
    selfCopyElement: function (dataAttribName = 'clipboard') {
        return async function () {
            const $ = Dom7;
            let data = $(this).data(dataAttribName);
            await uiUtils.copyToClipboard(data);
        }
    }

}
export default uiUtils;