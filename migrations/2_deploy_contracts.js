const ECMR = artifacts.require("ECMR");
const Elect = artifacts.require("Elect");
const SafeMath = artifacts.require("SafeMath");
const Sort = artifacts.require("Sort");
const usingProvable = artifacts.require("usingProvable");
const Hire = artifacts.require("Hire");
const ElectToolbox = artifacts.require("ElectToolbox");

const ElectOptim = artifacts.require("ElectOptim");

const TenderManager = artifacts.require("TenderManager");


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

  deployer.deploy(Elect,{from:accounts[9],value:500000000000000000});
  deployer.deploy(ElectOptim);
  deployer.deploy(Hire);

  deployer.link(usingProvable,TenderManager);
  deployer.link(ElectToolbox,TenderManager);
  deployer.deploy(TenderManager,{from:accounts[9],value:500000000000000000});

};
