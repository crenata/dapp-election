const Election = artifacts.require("Election");
contract("Election", (accounts) => {
    beforeEach(async () => {
        this.election = await Election.deployed();
    });

    describe("Init", () => {
        it("Initializes with two candidates", async () => {
            assert.equal(await this.election.candidatesCount(), 2);
        });
        it("It initializes the candidates with the correct values", async () => {
            let candidate1 = await this.election.candidates(1);
            assert.equal(candidate1[0], 1);
            assert.equal(candidate1[1], "Candidate 1");
            assert.equal(candidate1[2], 0);

            let candidate2 = await this.election.candidates(2);
            assert.equal(candidate2[0], 2);
            assert.equal(candidate2[1], "Candidate 2");
            assert.equal(candidate2[2], 0);
        });
        it("Allows a voter to cast a vote", async () => {
            let candidateId = 1;
            let voting = await this.election.vote(candidateId, {
                from: accounts[0]
            });
            assert.equal(voting.logs.length, 1);
            assert.equal(voting.logs[0].event, "votedEvent");
            assert.equal(voting.logs[0].args._candidateId.toNumber(), candidateId);

            let voted = await this.election.voters(accounts[0]);
            assert(voted);

            let candidate = await this.election.candidates(candidateId);
            let voteCount = candidate[2];
            assert.equal(voteCount, 1);
        });
        it("Throws an exception for invalid candidates", async () => {
            let candidateId = 99;
            try {
                await this.election.vote(candidateId, {
                    from: accounts[1]
                });
            } catch (error) {
                assert(error.message.indexOf("revert") > 0);
            }

            let candidate1 = await this.election.candidates(1);
            assert.equal(candidate1[2], 1);
            let candidate2 = await this.election.candidates(2);
            assert.equal(candidate2[2], 0);
        });
        it("Throws an exception for double voting", async () => {
            let candidateId = 2;
            await this.election.vote(candidateId, {
                from: accounts[1]
            });
            let candidate = await this.election.candidates(candidateId);
            let voteCount = candidate[2];
            assert.equal(voteCount, 1);
            
            try {
                await this.election.vote(candidateId, {
                    from: accounts[1]
                });
            } catch (error) {
                assert(error.message.indexOf("revert") > 0);
            }

            let candidate1 = await this.election.candidates(1);
            assert.equal(candidate1[2], 1);
            let candidate2 = await this.election.candidates(2);
            assert.equal(candidate2[2], 1);
        });
    });
});