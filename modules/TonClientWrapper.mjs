/*
  _____ ___  _   ___        __    _ _      _
 |_   _/ _ \| \ | \ \      / /_ _| | | ___| |_
   | || | | |  \| |\ \ /\ / / _` | | |/ _ \ __|
   | || |_| | |\  | \ V  V / (_| | | |  __/ |_
   |_| \___/|_| \_|  \_/\_/ \__,_|_|_|\___|\__|

 */
import MESSAGES from "./const/Messages.mjs";

/**
 * @name FreeTON browser wallet and injector
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */


class TonClientWrapper extends EventEmitter3 {

    /**
     * Possible events
     * @type {{NETWORK_CHANGED: string}}
     */
    EVENTS = {
        NETWORK_CHANGED: 'networkChanged'
    }


    constructor(disableMocks = false) {
        super();
        this._rawTon = null;
        this._externalRequests = {};
        this.disableMocks = disableMocks;

        this._setupAccounts();
        this._setupNetwork();
    }

    /**
     * Create Wrapped TONClient instance
     * @param options
     * @returns {Promise<TonClientWrapper>}
     */
    async create(options = {}) {
        this._rawTon = await TONClient.create(options);

        //Cloning internal methods and objects
        for (let key of Object.keys(this._rawTon)) {
            this[key] = this._rawTon[key];
        }

        if(!this.disableMocks) {
            this._configureMockedMethods();

            //Configure RPC

            window.addEventListener("message", async (event) => {
                // We only accept messages from ourselves
                if(event.source != window) {
                    return;
                }

                //is RPC call
                if(event.data.requestId && event.data.result !== undefined) {
                    if(this._externalRequests[event.data.requestId]) {
                        this._externalRequests[event.data.requestId](event.data);
                        delete this._externalRequests[event.data.requestId];
                    }
                }

                //Other messages
                if(event.data.broadcastMessage) {
                    switch (event.data.broadcastMessage) {

                        //Network changed. Sets new params
                        case MESSAGES.NETWORK_CHANGED:
                            let network = await this.network.get();
                            await this.setServers(network.network.url);
                            break;
                        default:
                            //nop
                            break;
                    }
                }
            });

        }

        return this;
    }

    /**
     * Change network
     * @param servers
     * @returns {Promise<void>}
     */
    async setServers(servers = []) {
        if(!Array.isArray(servers)) {
            servers = [servers];
        }

        //Re-setup TONCLient
        this._rawTon.queries.graphqlClient = null

        this._rawTon.config.data.servers = servers;

        this.emit(this.EVENTS.NETWORK_CHANGED, servers);
    }

    /**
     * Setup mocks
     * @private
     */
    _configureMockedMethods() {
        let that = this;

        /*
        TODO for mock:
        contracts:
            ✓run
            createDeployMessage
            deploy
            ✓runLocal
            ✓createRunMessage
            ?getDeployData
            ?calcRunFees
            ?calcDeployFees

         */

        //Mock contracts run
        this._mockTonMethod('contracts', 'run', async function (mockedMethod, callParams) {
            if(callParams[0]) {
                //If keypair defined
                if(callParams[0].keyPair) {
                    //And no private key provided, but public provided
                    if(!callParams[0].keyPair.secret) {
                        let publicKey = callParams[0].keyPair.public ? callParams[0].keyPair.public : null;
                        if(await that.accounts.isKeyInKeyring(publicKey)) {
                            //Run external sign
                            return await that._extensionRPCCall('main_run', [publicKey, ...callParams]);
                        }
                    }
                }
            }
            return await mockedMethod.apply(this, callParams);
        });

        //createRunMessage
        this._mockTonMethod('contracts', 'createRunMessage', async function (mockedMethod, callParams) {
            if(callParams[0]) {
                //If keypair defined
                if(callParams[0].keyPair) {
                    //And no private key provided, but public provided
                    if(!callParams[0].keyPair.secret) {
                        let publicKey = callParams[0].keyPair.public ? callParams[0].keyPair.public : null;
                        if(await that.accounts.isKeyInKeyring(publicKey)) {
                            //Run external sign
                            return await that._extensionRPCCall('main_createRunMessage', [publicKey, ...callParams]);
                        }
                    }
                }
            }
            return await mockedMethod.apply(this, callParams);
        });

        //Mock contracts runLocal
        this._mockTonMethod('contracts', 'runLocal', async function (mockedMethod, callParams) {
            if(callParams[0]) {
                //If keypair defined
                if(callParams[0].keyPair) {
                    //And no private key provided, but public provided
                    if(!callParams[0].keyPair.secret) {
                        let publicKey = callParams[0].keyPair.public ? callParams[0].keyPair.public : null;
                        if(await that.accounts.isKeyInKeyring(publicKey)) {
                            //Run external sign
                            return await that._extensionRPCCall('main_runLocal', [publicKey, ...callParams]);
                        }
                    }
                }
            }
            return await mockedMethod.apply(this, callParams);
        });

    }


    /**
     * Mock TON module methods
     * @param {string} module
     * @param {string} method
     * @param {function} mockFunction
     * @private
     */
    _mockTonMethod(module, method, mockFunction) {

        //Save original method
        let mockedMethod = this[module][method];

        //Mock method
        this[module][method] = function () {

            //Run mocker
            return mockFunction.apply(this, [mockedMethod, arguments]);
        }

    }

    /**
     * Call extension method
     * @async
     * @param {string} method
     * @param {Array} params
     * @param {string} target
     * @returns {Promise<*>}
     * @private
     */
    _extensionRPCCall(method, params = [], target = '*') {
        return new Promise((resolve, reject) => {
            let requestId = Math.random();
            this._externalRequests[requestId] = (data) => {
                if(data.exception) {
                    return reject(data.result);
                }
                return resolve(data.result);
            }
            window.postMessage({method: method, rpc: true, fromPage: true, requestId, params, target}, "*");
        })
    }

    /**
     * Create accounts subobject
     * @private
     */
    _setupAccounts() {

        let that = this;
        this.accounts = {
            getPublicKeys: async () => {
                return await that._extensionRPCCall('main_getPublicKeys');
            },
            isKeyInKeyring: async (publicKey) => {
                return await that._extensionRPCCall('main_isKeyInKeyring', [publicKey]);
            },
        }
    }

    /**
     * Create networks subobject
     * @private
     */
    _setupNetwork() {

        let that = this;
        this.network = {
            get: async (name = undefined) => {
                return await that._extensionRPCCall('main_getNetwork', [name]);
            },
            getNetworks: async () => {
                return await that._extensionRPCCall('main_getNetworks');
            },
        }
    }
}

//await browser.tabs.sendMessage(543,'test')

export default TonClientWrapper;