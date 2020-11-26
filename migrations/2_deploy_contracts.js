var DeliveryContract = artifacts.require("./DeliveryContract.sol");
var Hiring= artifacts.require("./Hiring.sol");

module.exports = function(deployer) {
  deployer.deploy(DeliveryContract);
  deployer.deploy(Hiring);
};
