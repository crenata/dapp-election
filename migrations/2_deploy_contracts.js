const Election = artifacts.require("Election");

module.exports = (deployer) => {
    deployer.deploy(Election);
};