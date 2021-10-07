var HelloContract = artifacts.require("./HelloContract.sol");
var Factory = artifacts.require("./Factory.sol");
// var Exchange = artifacts.require("./Exchange.sol");
var SampleToken1 = artifacts.require("./SampleToken1.sol");
var SampleToken2 = artifacts.require("./SampleToken2.sol");

module.exports = async function (deployer, network, accounts) {
    deployer.deploy(HelloContract);

    await deployer.deploy(Factory);
    const factoryInstance = await Factory.deployed();

    await deployer.deploy(
        SampleToken1,
        "SampleToken1",
        "TOK1",
        web3.utils.toWei("10000")
    );
    const token1Instance = await SampleToken1.deployed();

    await deployer.deploy(
        SampleToken2,
        "SampleToken2",
        "TOK2",
        web3.utils.toWei("10000")
    );
    const token2Instance = await SampleToken2.deployed();

    await factoryInstance.createExchange(token1Instance.address, {
        from: accounts[0],
    });
    await factoryInstance.createExchange(token2Instance.address, {
        from: accounts[0],
    });
};
