const ECMR = artifacts.require("ECMR");
const Elect = artifacts.require("Elect");
const SafeMath = artifacts.require("SafeMath");
const Sort = artifacts.require("Sort");
const usingProvable = artifacts.require("usingProvable");


module.exports = function(deployer,network,accounts) {
  deployer.deploy(ECMR);
  deployer.deploy(SafeMath);
  deployer.deploy(Sort);
  deployer.deploy(usingProvable, { from: accounts[0]});

  deployer.link(Sort,Elect);
  deployer.link(SafeMath,Elect);
  deployer.link(usingProvable,Elect);

  deployer.deploy(Elect);

};
