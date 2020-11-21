const Hiring = artifacts.require("Hiring");
const Elect = artifacts.require("Elect");


module.exports = function(deployer) {
  deployer.deploy(Hiring);
  deployer.deploy(Elect);

};
