const ECMR = artifacts.require("ECMR");
const Elect = artifacts.require("Elect");
const SafeMath = artifacts.require("SafeMath");
const Sort = artifacts.require("Sort");


module.exports = function(deployer) {
  deployer.deploy(ECMR);
  deployer.deploy(SafeMath);
  deployer.deploy(Sort);

  deployer.link(Sort,Elect);
  deployer.link(SafeMath,Elect);

  deployer.deploy(Elect);



};
