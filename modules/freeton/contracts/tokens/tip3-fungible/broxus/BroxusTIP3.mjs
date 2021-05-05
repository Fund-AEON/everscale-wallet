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

import Utils from "../../../../../utils.mjs";

class BroxusTIP3 {

    static CLASS_NAME = 'BroxusTIP3';
    static ROOT_CODE_HASH = '2ff4aaaab0f31d5a7b276b78a490277aa043d445bb71ac7c3dac8ae9e39b4d23';
    static WALLET_CODE_HASH = '2f062cde9cc0e2999f6bded5b4f160578b81530aaa3ae7d7077df60cd40f6056';
    static TOKEN_TYPE = 'TIP3';
    static TOKEN_FUNGUBLE = true;

    constructor(ton, rootAddress) {
        this.ton = ton;
        this.rootAddress = rootAddress;
    }

    async init() {
        this.RootABI = await Utils.fetchJSON('/modules/freeton/contracts/tokens/tip3-fungible/broxus/RootTokenContract.abi.json');//1d0bafcaa5a39a39f7567bcd5ddaa556eaa12a4eecc87ea142bd0a991e9cf749
        this.WalletABI = await Utils.fetchJSON('/modules/freeton/contracts/tokens/tip3-fungible/broxus/TONTokenWallet.abi.json');
        return this;
    }

    /**
     * Get token info
     * @returns {Promise<{symbol, totalSupply: number, decimals: number, name, icon: null}>}
     */
    async getTokenInfo() {
        const runResult = await this.ton.contracts.runLocal({
            abi: this.RootABI,
            functionName: 'getDetails',
            input: {},
            address: this.rootAddress
        });

        // console.log(runResult);

        const out = runResult.output.value0;

        return {
            decimals: Number(out.decimals),
            name: Utils.hex2String(out.name),
            symbol: Utils.hex2String(out.symbol),
            totalSupply: Number(out.total_supply),
            icon: null

        };
    }

    /**
     * Get wallet token balance
     * @param {string} walletAddress
     * @returns {Promise<number>}
     */
    async getBalance(walletAddress) {
        const runResult = await this.ton.contracts.runLocal({
            abi: this.WalletABI,
            functionName: 'balance',
            input: {},
            address: walletAddress
        });


        return Number(runResult.output.balance);
    }

    /**
     * Get wallet address from publicKey
     * @param {string} publicKey
     * @returns {Promise<string>}
     */
    async getWalletAddress(publicKey) {
        const runResult = await this.ton.contracts.runLocal({
            abi: this.RootABI,
            functionName: 'getWalletAddress',
            input: {
                wallet_public_key_: `0x${publicKey}`,
                owner_address_: '0:0000000000000000000000000000000000000000000000000000000000000000'
            },
            address: this.rootAddress
        });

        return runResult.output.value0;
    }


    /**
     * Transfer tokens
     * @param dest
     * @param amount
     * @param keyPair
     * @returns {Promise<*>}
     */
    async transfer(dest, amount, keyPair) {

        //console.log('TIP# pretransfer', dest, amount, keyPair)

        let walletAddress = await this.getWalletAddress(keyPair.public);

        //console.log('TIP# pretransfer2', walletAddress)

        try {
            let params = {
                address: walletAddress,
                abi: this.WalletABI,
                functionName: 'transfer',
                input: {
                    to: dest,
                    tokens: amount,
                    grams: 2e8
                },
                keyPair
            };

            //console.log('BROXUS TIP3 RUN PARAMS', params)

            let message = await this.ton.contracts.createRunMessage(params);

            //console.log('BROXUS TIP3 RUN MSG', message)

            let transaction = await this.ton.contracts.sendMessage(message.message);
            //console.log('BROXUS TIP3 TX', transaction)

            let result = await this.ton.contracts.waitForRunTransaction(message, transaction);

            //console.log('BROXUS TIP3 TX RESULT',result);

            result.tx = transaction;

            return result;
        } catch (e) {
            console.log('DEPLOY ERROR', e);
            throw e;
        }
    }

    async deployWallet(address) {

    }
}

export default BroxusTIP3;