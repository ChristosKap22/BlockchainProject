const Lottery = artifacts.require("LotteryProject");

module.exports = function(deployer) {
  deployer.deploy(Lottery);
};
