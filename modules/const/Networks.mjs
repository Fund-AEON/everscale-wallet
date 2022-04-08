/**
 * @name Everscale Wallet browser wallet
 * @copyright Fund AEON
 * @license Apache-2.0
 * @version 1.0
 */

const NETWORKS = {
    main: {
        url: 'main3.ton.dev',
        explorer: 'ever.live',
        description: 'Everscale main net',
        site: 'https://everscale.network/',
        faucet: {
            type: 'url',
            address: 'https://everscale.network/ecosystem',
        },
        tokenIcon: '<img src="pictures/ever.png" class="walletIconImage" style="width: 15px; height: 15px; display: inline">'
        //tokenIcon: '💎'
        //tokenIcon: '<tgs-player autoplay loop renderer="canvas"  mode="normal" src="pictures/tgs/crystal.tgs" style="width: 15px; height: 15px; display: inline"></tgs-player>'
    },
    main2: {
        url: 'main2.ton.dev',
        explorer: 'ever.live',
        description: 'Everscale main net',
        site: 'https://everscale.network/',
        faucet: {
            type: 'url',
            address: 'https://everscale.network/ecosystem',
        },
        tokenIcon: '<img src="pictures/ever.png" class="walletIconImage" style="width: 15px; height: 15px; display: inline">'
        //tokenIcon: '💎'
        //tokenIcon: '<tgs-player autoplay loop renderer="canvas"  mode="normal" src="pictures/tgs/crystal.tgs" style="width: 15px; height: 15px; display: inline"></tgs-player>'
    },
    svoidev: {
        url: 'alwaysonlineevermainnode.svoi.dev',
        explorer: 'ever.live',
        description: 'Everscale main net',
        site: 'https://everscale.network/',
        faucet: {
            type: 'url',
            address: 'https://everscale.network/ecosystem',
        },
        tokenIcon: '<img src="pictures/ever.png" class="walletIconImage" style="width: 15px; height: 15px; display: inline">'
        //tokenIcon: '💎'
        //tokenIcon: '<tgs-player autoplay loop renderer="canvas"  mode="normal" src="pictures/tgs/crystal.tgs" style="width: 15px; height: 15px; display: inline"></tgs-player>'
    },
    devnet: {
        url: 'net1.ton.dev',
        explorer: 'net.ton.live',
        description: 'FreeTON test network',
        site: 'https://everscale.network/',
        tokenIcon: '<span style="color: red">♦️</span>',
        faucet: {
            type: 'url',
            address: 'https://faucet.extraton.io/',
        },
    },
    devnet2: {
        url: 'net2.ton.dev',
        explorer: 'net.ton.live',
        description: 'FreeTON test network',
        site: 'https://everscale.network/',
        tokenIcon: '<span style="color: red">♦️</span>',
        faucet: {
            type: 'url',
            address: 'https://faucet.extraton.io/',
        },
    }
}

export default NETWORKS;