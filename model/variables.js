// file1.js
let purchasecommitmentcount = 0;

function incrementPurchaseCommitmentCount() {
    console.log('here')
    purchasecommitmentcount = purchasecommitmentcount+1;
    return purchasecommitmentcount;
}

function decrementPurchaseCommitmentCount() {
    purchasecommitmentcount--;
}

module.exports = {
    purchasecommitmentcount,
    incrementPurchaseCommitmentCount,
    decrementPurchaseCommitmentCount
};
