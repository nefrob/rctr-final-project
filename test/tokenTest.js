const assert = require("assert");
const truffleAssert = require("truffle-assertions");

const SampleToken1 = artifacts.require("./SampleToken1.sol");

contract("SampleToken1", (accounts) => {
    let sampleToken1;

    beforeEach("Setup contract for each test", async () => {
        sampleToken1 = await SampleToken1.new("SampleToken1", "TOK1", 100);
    });

    it("Correct name and symbol", async () => {
        const name = await sampleToken1.name();
        assert.equal(name, "SampleToken1");

        const symbol = await sampleToken1.symbol();
        assert.equal(symbol, "TOK1");
    });

    it("Correct total supply", async () => {
        assert.equal(await sampleToken1.totalSupply(), 100);
        assert.equal(await sampleToken1.balanceOf(accounts[0]), 100);
        assert.equal(await sampleToken1.balanceOf(accounts[1]), 0);
    });

    it("Transfer the correct amount", async () => {
        await sampleToken1.transfer(accounts[1], 50);
        const balance = await sampleToken1.balanceOf(accounts[1]);
        assert.equal(balance, 50);
    });

    it("Error trying to transfer more than balance", async () => {
        await truffleAssert.reverts(sampleToken1.transfer(accounts[1], 101));
    });
});
