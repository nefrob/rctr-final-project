const path = require("path");

module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    contracts_build_directory: path.join(__dirname, "client/src/contracts"),
    networks: {
        development: {
            network_id: "*",
            host: "localhost",
            port: 8545,
            websockets: true,
        },
    },
    compilers: {
        solc: {
            version: "0.8.7",
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
};
