const assert = require("assert");
const truffleAssert = require("truffle-assertions");

const Factory = artifacts.require("./Factory.sol");
const SampleToken1 = artifacts.require("./SampleToken1.sol");

contract("Factory", (accounts) => {
    let factory;
    let sampleToken1;

    beforeEach("Setup contract for each test", async () => {
        factory = await Factory.new();
        sampleToken1 = await SampleToken1.new("SampleToken1", "TOK1", 100);
    });

    it("Error on zero token address", async () => {
        await truffleAssert.fails(factory.createExchange(0x0));
    });

    it("Create a new exchange and retrieve address", async () => {
        const tx = await factory.createExchange(sampleToken1.address);
        const exchange = await factory.getExchange(sampleToken1.address);

        truffleAssert.eventEmitted(tx, "LogCreateExchange", (ev) => {
            return (
                ev.token === sampleToken1.address && ev.exchange === exchange
            );
        });

        assert.notEqual(exchange, 0x0);
    });

    it("Error making duplicate exchange", async () => {
        await factory.createExchange(sampleToken1.address);

        await truffleAssert.reverts(
            factory.createExchange(sampleToken1.address),
            "createExchange: tokenAddress already has an exchange"
        );
    });

    it("Error on get invalid exchange", async () => {
        await truffleAssert.fails(
            factory.getExchange(0x1111111111111111111111111111111111111111)
        );
    });
});
