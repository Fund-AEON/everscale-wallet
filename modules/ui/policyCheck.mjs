/**
 * @name Everscale Wallet browser wallet
 * @copyright Fund AEON
 * @license Apache-2.0
 * @version 1.0
 */

 const $ = Dom7;


/**
 * validate password fields
 * @returns {Boolean}
 */
function checkPolicyCheckbox() {

    let policyCheckbox = $("#policyCheckbox");
    let submit = $("#submit");


    if (policyCheckbox.val == true){

        console.log(true);

    } else console.log(false);

}


