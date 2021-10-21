const assert = require("assert");
const truffleAssert = require("truffle-assertions");

// Utils

const ethToWei = (eth) => web3.utils.toWei(eth.toString());

const weiToEth = (wei) => web3.utils.fromWei(wei);

const getEthBalance = async (address) =>
    weiToEth(await web3.eth.getBalance(address));

const getTokBalance = async (token, address) =>
    weiToEth(await token.balanceOf(address));

// Tests

const Exchange = artifacts.require("./Exchange.sol");
const Factory = artifacts.require("./Factory.sol");
const SampleToken1 = artifacts.require("./SampleToken1.sol");
const SampleToken2 = artifacts.require("./SampleToken2.sol");

contract("Exchange", (accounts) => {
    let factory;
    let sampleToken1;
    let exchange;

    beforeEach("Setup contract for each test", async () => {
        factory = await Factory.new();
        sampleToken1 = await SampleToken1.new(
            "SampleToken1",
            "TOK1",
            ethToWei(1000)
        );
        await factory.createExchange(sampleToken1.address);
        exchange = await Exchange.at(
            await factory.getExchange(sampleToken1.address)
        );
    });

    it("Correct construction", async () => {
        const name = await exchange.name();
        assert.equal(name, "Sandman Swap");

        const symbol = await exchange.symbol();
        assert.equal(symbol, "DREAM");

        const supply = await exchange.totalSupply();
        assert.equal(supply, 0);

        assert.equal(await exchange.factory(), factory.address);
    });

    describe("Empty liquidity pool handle errors", async () => {
        it("Error add no liquidity", async () => {
            await truffleAssert.reverts(
                exchange.addLiquidity(0, { value: 0 }),
                "addLiquidity: deposit amount too small"
            );
        });

        it("Error remove liquidity", async () => {
            await truffleAssert.reverts(
                exchange.removeLiquidity(10),
                "removeLiquidity: not enough liquidity"
            );
        });
    });

    describe("Add liquidity", async () => {
        beforeEach("Add liquidity setup", async () => {
            // tok = 20, eth = 10, lp = ethReserve = 10
            truffleAssert.passes(
                await sampleToken1.approve(exchange.address, ethToWei(20))
            );
            await exchange.addLiquidity(ethToWei(20), { value: ethToWei(10) });
        });

        it("Add liquidity empty pool", async () => {
            const lpAmount = await getTokBalance(exchange, accounts[0]);
            assert.equal(weiToEth(await exchange.totalSupply()), lpAmount);
            assert.equal(lpAmount, 10);

            const tokenReserves = await getTokBalance(
                sampleToken1,
                exchange.address
            );
            assert.equal(tokenReserves, 20);

            const ethReserves = await getEthBalance(exchange.address);
            assert.equal(ethReserves, 10);
        });

        it("Add liquidity non-empty pool", async () => {
            // tok = 20, eth = 10, lpSupply = 10
            // lpMint = ethDeposited / ethPool * lpSupply = 5 / 10 * 10 = 5

            truffleAssert.passes(
                await sampleToken1.approve(exchange.address, ethToWei(10))
            );

            await exchange.addLiquidity(ethToWei(10), {
                value: ethToWei(5),
            });

            const lpAmount = await getTokBalance(exchange, accounts[0]);
            assert.equal(weiToEth(await exchange.totalSupply()), lpAmount);
            assert.equal(lpAmount, 15);

            const tokenReserves = await getTokBalance(
                sampleToken1,
                exchange.address
            );
            assert.equal(tokenReserves, 30);

            const ethReserves = await getEthBalance(exchange.address);
            assert.equal(ethReserves, 15);
        });
    });

    describe("Remove liquidity non-empty pool", async () => {
        beforeEach("Remove liquidity setup", async () => {
            // tok = 20, eth = 10, lp = ethReserve = 10
            truffleAssert.passes(
                await sampleToken1.approve(exchange.address, ethToWei(20))
            );
            await exchange.addLiquidity(ethToWei(20), {
                value: ethToWei(10),
            });
        });

        it("Remove liquidity", async () => {
            await exchange.removeLiquidity(ethToWei(5));

            const lpAmount = await getTokBalance(exchange, accounts[0]);
            assert.equal(weiToEth(await exchange.totalSupply()), lpAmount);
            assert.equal(lpAmount, 5);

            const tokenReserves = await getTokBalance(
                sampleToken1,
                exchange.address
            );
            assert.equal(tokenReserves, 10);

            const ethReserves = await getEthBalance(exchange.address);
            assert.equal(ethReserves, 5);
        });

        it("Remove all liquidity non-empty pool", async () => {
            const ret = await exchange.removeLiquidity.call(ethToWei(10));
            assert.equal(weiToEth(ret["0"]), 10);
            assert.equal(weiToEth(ret["1"]), 20);

            await exchange.removeLiquidity(ethToWei(10));

            const lpAmount = await getTokBalance(exchange, accounts[0]);
            assert.equal(weiToEth(await exchange.totalSupply()), lpAmount);
            assert.equal(lpAmount, 0);

            const tokenReserves = await getTokBalance(
                sampleToken1,
                exchange.address
            );
            assert.equal(tokenReserves, 0);

            const ethReserves = await getEthBalance(exchange.address);
            assert.equal(ethReserves, 0);
        });

        it("Error remove no liquidity", async () => {
            await truffleAssert.reverts(
                exchange.removeLiquidity(0),
                "removeLiquidity: lpAmount too small"
            );
        });

        it("Error remove more than liquidity", async () => {
            await truffleAssert.reverts(
                exchange.removeLiquidity(ethToWei(15)),
                "removeLiquidity: not enough liquidity"
            );
        });
    });

    describe("ETH to Token Swap", async () => {
        describe("Empty liquidity pool", async () => {
            it("Error try to swap", async () => {
                await truffleAssert.reverts(
                    exchange.ethToTokenExchange(ethToWei(500), {
                        value: ethToWei(10),
                    }),
                    "getExchangePrice: invalid reserve amounts"
                );
            });
        });

        describe("Non-empty liquidity pool", async () => {
            beforeEach("Setup", async () => {
                truffleAssert.passes(
                    await sampleToken1.approve(exchange.address, ethToWei(500))
                );
                await exchange.addLiquidity(ethToWei(500), {
                    value: ethToWei(10),
                });
            });

            it("Error invalid Token amount", async () => {
                await truffleAssert.reverts(
                    exchange.ethToTokenExchange(0),
                    "ethToTokenTransfer: desiredTokenAmount too small"
                );
            });

            it("Error not enough ETH for desired Token amount", async () => {
                await truffleAssert.reverts(
                    exchange.ethToTokenExchange(ethToWei(500), {
                        value: ethToWei(1),
                    }),
                    "ethToTokenExchange: not enough tokens"
                );
            });

            it("Swap correct Token amount", async () => {
                const userTokBefore = await getTokBalance(
                    sampleToken1,
                    accounts[0]
                );

                await exchange.ethToTokenExchange(ethToWei(45), {
                    value: ethToWei(1),
                });

                const userTokAfter = await getTokBalance(
                    sampleToken1,
                    accounts[0]
                );

                assert.equal(
                    await getTokBalance(sampleToken1, exchange.address),
                    500 - (userTokAfter - userTokBefore)
                );

                assert.equal(await getEthBalance(exchange.address), 11);
            });
        });
    });

    describe("Token to ETH Swap", async () => {
        describe("Empty liquidity pool", async () => {
            it("Error try to swap", async () => {
                await truffleAssert.reverts(
                    exchange.tokenToEthExchange(ethToWei(10), ethToWei(10)),
                    "getExchangePrice: invalid reserve amounts"
                );
            });
        });

        describe("Non-empty liquidity pool", async () => {
            beforeEach("Setup", async () => {
                truffleAssert.passes(
                    await sampleToken1.approve(exchange.address, ethToWei(500))
                );
                await exchange.addLiquidity(ethToWei(500), {
                    value: ethToWei(10),
                });
            });

            it("Error invalid Token/ETH amount", async () => {
                await truffleAssert.reverts(
                    exchange.tokenToEthExchange(0, 0),
                    "tokenToEthExchange: exchange amount too small"
                );
            });

            it("Error not enough Token for desired ETH amount", async () => {
                sampleToken1.approve(exchange.address, ethToWei(1));

                await truffleAssert.reverts(
                    exchange.tokenToEthExchange(ethToWei(1), ethToWei(1)),
                    "tokenToEthExchange: not enough eth"
                );
            });

            it("Swap correct ETH amount", async () => {
                await sampleToken1.approve(
                    exchange.address,
                    ethToWei("55.722723726735762845")
                );
                await exchange.tokenToEthExchange(
                    ethToWei("55.722723726735762845"),
                    ethToWei(1)
                );

                assert.equal(
                    await getTokBalance(sampleToken1, exchange.address),
                    "555.722723726735762845"
                );

                assert.equal(await getEthBalance(exchange.address), 9);
            });
        });
    });

    describe("Token to Token Swap", async () => {
        let exchange2;
        let sampleToken2;

        beforeEach("Setup", async () => {
            sampleToken2 = await SampleToken2.new(
                "SampleToken2",
                "TOK2",
                ethToWei(1000)
            );
        });

        describe("Parameter setup checks", async () => {
            it("Error invalid token amounts", async () => {
                await truffleAssert.reverts(
                    exchange.tokenToTokenExchange(0, 0, sampleToken2.address),
                    "tokenToTokenExchange: token amounts too small"
                );
            });

            it("Error invalid Token2 address", async () => {
                await truffleAssert.fails(
                    exchange.tokenToTokenExchange(1, 1, 0x0)
                );
                await truffleAssert.reverts(
                    exchange.tokenToTokenExchange(1, 1, sampleToken1.address),
                    "tokenToTokenExchange: invalid otherTokenAddress"
                );
            });

            it("Error non-existant Token2 exchange address", async () => {
                await truffleAssert.reverts(
                    exchange.tokenToTokenExchange(1, 1, sampleToken2.address),
                    "tokenToTokenExchange: otherTokenAddress does not have not an exchange"
                );
            });
        });

        describe("Swap checks", async () => {
            beforeEach("Setup", async () => {
                await factory.createExchange(sampleToken2.address);
                exchange2 = await Exchange.at(
                    await factory.getExchange(sampleToken2.address)
                );
            });

            describe("Empty liquidity pool", async () => {
                it("Error try to swap", async () => {
                    await truffleAssert.reverts(
                        exchange.tokenToTokenExchange(
                            ethToWei(10),
                            ethToWei(10),
                            sampleToken2.address
                        ),
                        "getExchangePrice: invalid reserve amounts"
                    );
                });
            });

            describe("Non-empty liquidity pool", async () => {
                beforeEach("Setup", async () => {
                    await sampleToken1.approve(exchange.address, ethToWei(500));
                    await exchange.addLiquidity(ethToWei(500), {
                        value: ethToWei(10),
                    });

                    await sampleToken2.approve(
                        exchange2.address,
                        ethToWei(1000)
                    );
                    await exchange2.addLiquidity(ethToWei(1000), {
                        value: ethToWei(10),
                    });
                });

                it("Error not enough Token1 for desired Token2 amount", async () => {
                    await sampleToken1.approve(exchange.address, ethToWei(1));

                    await truffleAssert.reverts(
                        exchange.tokenToTokenExchange(
                            ethToWei(1),
                            ethToWei(100),
                            sampleToken2.address
                        ),
                        "ethToTokenExchange: not enough tokens"
                    );
                });

                it("Swap correct Token2 amount", async () => {
                    await sampleToken1.approve(
                        exchange.address,
                        ethToWei("55.722723726735762845")
                    );
                    await exchange.tokenToTokenExchange(
                        ethToWei("55.722723726735762845"),
                        ethToWei(1),
                        sampleToken2.address
                    );

                    const userTok2After = await getTokBalance(
                        sampleToken2,
                        accounts[0]
                    );

                    assert.equal(userTok2After, "90.661089388014913158");
                });
            });
        });
    });

    describe("Exchange rates", async () => {
        beforeEach("Setup", async () => {
            truffleAssert.passes(
                await sampleToken1.approve(exchange.address, ethToWei(500))
            );
            await exchange.addLiquidity(ethToWei(500), {
                value: ethToWei(10),
            });
        });

        it("ETH to Token", async () => {
            const ethPrice = await exchange.getTokenToEthExchangeRate(
                ethToWei(100)
            );

            assert.equal(ethPrice, ethToWei("1.662497915624478906"));
        });

        it("Token to ETH", async () => {
            const tokenPrice = await exchange.getEthToTokenExchangeRate(
                ethToWei(1)
            );

            assert.equal(tokenPrice, ethToWei("45.330544694007456579"));
        });
    });
});
