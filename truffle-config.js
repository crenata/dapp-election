module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // for more about customizing your Truffle configuration!
    networks: {
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