App = {
    web3Provider: null,
    contracts: {},
    account: "0x0",

    init: () => {
        return App.initWeb3();
    },

    initWeb3: () => {
        if (typeof web3 !== "undefined") {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            App.web3Provider = new Web3.providers.HttpProvider("http://localhost:7545");
            web3 = new Web3(App.web3Provider);
        }
        return App.initContract();
    },

    initContract: () => {
        $.getJSON("Election.json", (election) => {
            /* Instantiate a new truffle contract from the artifact */
            App.contracts.Election = TruffleContract(election);
            /* Connect provider to interact with contract */
            App.contracts.Election.setProvider(App.web3Provider);
            App.listenForAccount();
            App.listenForEvent();
            return App.render();
        });
    },

    listenForAccount: () => {
        if (typeof ethereum !== "undefined") {
            ethereum.on("accountsChanged", (accounts) => {
                App.account = accounts[0];
                App.render();
            });
        }
    },

    listenForEvent: () => {
        App.contracts.Election.deployed().then((instance) => {
            instance.votedEvent({}, {
                fromBlock: 0,
                toBlock: "latest"
            }).watch((error, event) => {
                console.log("Event triggered", event);
                App.render();
            });
        });
    },

    render: () => {
        let electionInstance;
        let loader = $("#loader");
        let content = $("#content");

        loader.show();
        content.hide();

        /* Load account data */
        web3.eth.getCoinbase((error, account) => {
            if (error === null) {
                App.account = account;
                $("#accountAddress").text(`Your Account: ${account}`);
            }
        });

        /* Load contract data */
        App.contracts.Election.deployed().then((instance) => {
            electionInstance = instance;
            return electionInstance.candidatesCount();
        }).then((candidatesCount) => {
            let candidatesResults = $("#candidatesResults");
            candidatesResults.empty();
            let candidatesSelect = $("#candidatesSelect");
            candidatesSelect.empty();
            for (let i = 1; i <= candidatesCount; i++) {
                electionInstance.candidates(i).then((candidate) => {
                    let id = candidate[0];
                    let name = candidate[1];
                    let voteCount = candidate[2];
                    let candidateTemplate = `<tr><th>${id}</th><td>${name}</td><td>${voteCount}</td></tr>`
                    candidatesResults.append(candidateTemplate);
                    let candidateOption = `<option value="${id}">${name}</option>`
                    candidatesSelect.append(candidateOption);
                });
            }
            return electionInstance.voters(App.account);
        }).then((hasVoted) => {
            if (hasVoted) {
                $("form").hide();
            }
        }).catch((error) => {
            console.warn(error);
        }).finally(() => {
            loader.hide();
            content.show();
        });
    },

    castVote: () => {
        let candidateId = $("#candidatesSelect").val();
        App.contracts.Election.deployed().then((instance) => {
            return instance.vote(candidateId, {
                from: App.account
            });
        }).then((result) => {
            $("#content").hide();
            $("#loader").show();
        }).catch((error) => {
            console.error(error);
        });
    }
};

$(() => {
    $(window).load(() => {
        App.init();
    });
});