const ECMR = artifacts.require("ECMR");
const Elect = artifacts.require("Elect");
const SafeMath = artifacts.require("SafeMath");
const Sort = artifacts.require("Sort");
const usingProvable = artifacts.require("usingProvable");
const Hire = artifacts.require("Hire");
const ElectToolbox = artifacts.require("ElectToolbox");

const ElectOptim = artifacts.require("ElectOptim");

module.exports = function(deployer,network,accounts) {
  deployer.deploy(ECMR);
  deployer.deploy(SafeMath);
  deployer.deploy(Sort);
  deployer.deploy(ElectToolbox);
  deployer.deploy(usingProvable, { from: accounts[0]});

  deployer.link(Sort,Elect);
  deployer.link(SafeMath,Elect);
  deployer.link(usingProvable,Elect);
  deployer.link(ElectToolbox,Elect);

  deployer.link(usingProvable,ElectOptim);
  deployer.link(ElectToolbox,ElectOptim);

  deployer.deploy(Elect);
  deployer.deploy(ElectOptim);
  deployer.deploy(Hire);

};
