const ECMR = artifacts.require("ECMR");
const Elect = artifacts.require("Elect");


module.exports = function(deployer) {
  deployer.deploy(ECMR);
  deployer.deploy(Elect);

};
