require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // for more about customizing your Truffle configuration!
    networks: {
        ropsten: {
            provider: () => new HDWalletProvider({
                mnemonic: process.env.MNEMONIC,
                providerOrUrl: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`
            }),
            network_id: 3
        },
        ganache_gui: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*" // Match any network id
        },
        ganache_cli: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*"
        }
    }
};