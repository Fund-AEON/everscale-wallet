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

import Utils from "../utils.mjs";
import EXCEPTIONS from "../const/Exceptions.mjs";

const $ = Dom7;

class Popups {

    /**
     * Open accept transaction popup
     * @param publicKey
     * @param type
     * @param callingDetails
     * @returns {Promise<unknown>}
     */
    acceptTransaction(publicKey, type = 'run', callingDetails) {
        return new Promise((resolve, reject) => {
            window.app.views.main.router.navigate("/accept");

            app.once('pageInit', () => {
                console.log('PAGE');

                $('#acceptPublicKey').text(publicKey);
                $('#acceptTxType').text(type);

                if(callingDetails.functionName) {
                    $('#acceptFunctionName').text(callingDetails.functionName);
                } else {
                    $('#acceptFunctionNameHolder').hide();
                }

                if(callingDetails.additionalMessage && callingDetails.additionalMessage !== '') {
                    $('#acceptMessageFromCaller').text(callingDetails.additionalMessage);
                } else {
                    $('#acceptMessageFromCallerHolder').hide();
                }

                if(callingDetails.address) {
                    $('#acceptRunAddress').text(callingDetails.address);
                } else {
                    $('#acceptRunAddress').text('Error');
                }


                $('#txCancelButton').once('click', () => {
                    Utils.appBack();
                    reject(EXCEPTIONS.rejectedByUser);
                });

                $('#txAcceptButton').once('click', () => {
                    Utils.appBack();
                    resolve(true);
                });

                // resolve();
            });

        })

    }

    initPage() {
        let self = this;

        return new Promise((resolve, reject) => {
            window.app.views.main.router.navigate("/initPage");

            app.once('pageInit', () => {            
                
                $("#importSeed").on( "click", () => {
                    self.importSeed();
                });

                $("#createNewSeed").on( "click", () => {
                    self.getSeed();
                });

                $('#returnButton3').once('click', () => {
                    Utils.appBack();
                });
        
            });

        });
    }

    importSeed() {
        return new Promise((resolve, reject) => {
            let self = this;

            console.log("click");

            window.app.views.main.router.navigate("/importSeed");

            app.once('pageInit', () => {         
                
                $("#policy1").on( "click", () => {
                    self.goToPolicy();
                });
                
                $("#submit").on( "click", () => {
                validatePassword()
                });
        
                $('#returnButton').once('click', () => {
                    Utils.appBack();
                });



            });

        });
    }

    getSeed() {
        return new Promise((resolve, reject) => {
            let self = this;

            console.log("click");

            window.app.views.main.router.navigate("/getSeed");

            app.once('pageInit', () => {   
                
                $("#policy").on( "click", () => {
                    self.goToPolicy();
                });
                
                $("#submit").on( "click", () => {
                validatePassword()
                });
        
                $('#returnButton').once('click', () => {
                    Utils.appBack();
                });

            });

        });
    }

    goToPolicy() {
        return new Promise((resolve, reject) => {
            window.app.views.main.router.navigate("/policy");

            app.once('pageInit', () => {            
        
                $('#returnButton2').once('click', () => {
                    Utils.appBack();
                });

            });

        });
    }

}

export default new Popups();