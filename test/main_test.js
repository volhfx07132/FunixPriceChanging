const Main = artifacts.require("Main");
var chaiAsPromised = require("chai-as-promised");
var chai = require("chai");
const { assert } = require("chai");
chai.use(chaiAsPromised);
var expect = chai.expect;
var instance;
contract("Main", accounts => {
    describe("Start initialize smart contract", function() {
        it("Contract deployment", async() => {
            instance = await Main.deployed();
            assert(instance != undefined, "Smart contract should be defined");
        });
        it("Check account 0 is account of admin", function() {
            return instance.admin().then(function(result) {
                assert(result == accounts[0], "Should set account for admin");
            });
        });
    });
    describe("Admin add items", function() {
        it("Should Add items only admin", function() {
            return instance.addItems("Book", 50, 50, { from: accounts[0] }).then(function(result) {
                expect(result).to.not.be.an("Error");
                return instance.addItems("Computer", 1000, 100, { from: accounts[0] });
            }).then(function(result) {
                expect(result).to.not.be.an("Error");
                return instance.addItems("Light", 2000, 60000, { from: accounts[0] });
            }).then(function(result) {
                expect(result).to.not.be.an("Error");
                return instance.addItems("Macbook pro", 1000, 600, { from: accounts[0] });
            }).then(function(result) {
                expect(result).to.not.be.an("Error");
                return instance.addItems("Car Toy", 50, 100, { from: accounts[0] });
            }).then(function(result) {
                expect(result).to.not.be.an("Error");
                return instance.addItems("Rule", 50, 100, { from: accounts[0] });
            }).then(function(result) {
                expect(result).to.not.be.an("Error");
            })
        });
        it("Check data of each other items added", function() {
            return instance.itemsList(0).then(function(result) {
                assert(result != undefined, "Item not exitst");
                return instance.itemsList(1);
            }).then(function(result) {
                assert(result != undefined, "Item not exitst");
                return instance.itemsList(2);
            }).then(function(result) {
                assert(result != undefined, "Item not exitst");
                return instance.itemsList(3);
            }).then(function(result) {
                assert(result != undefined, "Item not exitst");
            });
        });

        it("Should NOT Add items only admin", function() {
            return expect(instance.addItems("Clock", 100, 100, { from: accounts[1] })).to.be.rejectedWith(Error).eventually.with.property("name", "Error");
        });
        it("Check data of each other items NOT exits", function() {
            return expect(instance.itemsList(8)).to.be.rejectedWith(Error).eventually.with.property("name", "Error");
        });

    });
    describe("Admin Register", function() {
        it("Should register with only admin", function() {
            return instance.register(accounts[1], { from: accounts[0] }).then(function(result) {
                expect(result).to.not.be.an("Error");
                return instance.register(accounts[2], { from: accounts[0] });
            }).then(function(result) {
                expect(result).to.not.be.an("Error");
                return instance.register(accounts[3], { from: accounts[0] });
            }).then(function(result) {
                expect(result).to.not.be.an("Error");
                return instance.register(accounts[4], { from: accounts[0] });
            }).then(function(result) {
                expect(result).to.not.be.an("Error");
                return instance.register(accounts[5], { from: accounts[0] });
            });
        });
        it("Check number account register", function() {
            return instance.totalAccounts(0).then(function(result) {
                assert(result != undefined, "Item not exitst");
                return instance.totalAccounts(1);
            }).then(function(result) {
                assert(result != undefined, "Item not exitst");
                return instance.totalAccounts(2);
            }).then(function(result) {
                assert(result != undefined, "Item not exitst");
                return instance.totalAccounts(3);
            }).then(function(result) {
                assert(result != undefined, "Item not exitst");
            });
        });
        it("Should register not only admin", function() {
            return expect(instance.register(accounts[7], { from: accounts[1] })).to.be.rejectedWith(Error).eventually.with.property("name", "Error");
        });
        it("Should resgiter account existed", function() {
            return expect(instance.register(accounts[1], { from: accounts[0] })).to.be.rejectedWith(Error).eventually.with.property("name", "Error");
        });
        it("Should check account don't existed", function() {
            return expect(instance.totalAccounts(8)).to.be.rejectedWith(Error).eventually.with.property("name", "Error");
        });
        it("Should register account of admin", function() {
            return expect(instance.register(accounts[0], { from: accounts[0] })).to.be.rejectedWith(Error).eventually.with.property("name", "Error");
        });
    });
    describe("Calculating proposal price", function() {
        describe("Only one participant join sesstion: One Time ", function() {
            it("Check status session of item 0 not yet started", function() {
                return instance.getStatusSesstion(0).then(function(result) {
                    assert.equal(result, 0, "Wrong value");
                });
            });

            it("Admin start sesstion of item 0", function() {
                return instance.startSesstion(0, { from: accounts[0] }).then(function(result) {
                    expect(result).to.not.be.an("Error");
                });
            });

            it("Check status session of item 0 stating", function() {
                return instance.getStatusSesstion(0).then(function(result) {
                    assert.equal(result, 1, "Wrong value");
                });
            });

            it("Account NOT admin start sesstion of item 0", function() {
                return expect(instance.startSesstion(0, { from: accounts[1] })).to.be.rejectedWith(Error).eventually.with.property("name", "Error");
            });

            it("Price changing: 20 , Item number 0, from: account 1", function() {
                return instance.accumulatedDeviation(20, 0, { from: accounts[1] }).then(function(result) {
                    expect(result).to.not.be.an("Error");
                });
            });

            it("Admin set final price when session not yet done", function() {
                return expect(instance.setPriceOfItem(0, 33)).to.be.rejectedWith(Error).eventually.with.property("name", "Error");
            });

            it("Admin Stop sesstion of item 0", function() {
                return instance.stopSesstion(0, { from: accounts[0] }).then(function(result) {
                    expect(result).to.not.be.an("Error");
                });
            });

            it("Check status session of item 0 Done", function() {
                return instance.getStatusSesstion(0).then(function(result) {
                    assert.equal(result, 2, "Wrong value");
                });
            });

            it("Account NOT admin Stop of item 0", function() {
                return expect(instance.stopSesstion(0, { from: accounts[1] })).to.be.rejectedWith(Error).eventually.with.property("name", "Error");
            });

            it("Check result of item 1 ofter price changing: 20", function() {
                return instance.getProposedPrice(0).then(function(result) {
                    expect(result).to.not.be.an("Error");
                    return instance.getDataItems(0);
                }).then(function(result) {
                    assert.equal(result, 20, "Wrong value, You check your algorithm")
                });
            });

            it("Admin set final price when session was done", function() {
                return instance.setPriceOfItem(0, 33).then(function(result) {
                    expect(result).to.not.be.an("Error");
                    return instance.getDataItems(0);
                }).then(function(result) {
                    assert.equal(result, 33, "Wrong value, You check your algorithm")
                })
            });
        });

        describe("Only one participant join sesstion: Mutible Time ", function() {
            it("Admin start sesstion of item 1", function() {
                return instance.startSesstion(1, { from: accounts[0] }).then(function(result) {
                    expect(result).to.not.be.an("Error");
                });
            });
            it("Price changing: 20 , Item number 1, from: account 1", function() {
                return instance.accumulatedDeviation(800, 1, { from: accounts[1] }).then(function(result) {
                    expect(result).to.not.be.an("Error");
                });
            });
            it("Continue price changing: 60 , Item number 1, from: account 1", function() {
                return instance.accumulatedDeviation(600, 1, { from: accounts[1] }).then(function(result) {
                    expect(result).to.not.be.an("Error");
                });
            });
            it("Admin Stop sesstion of item 1", function() {
                return instance.stopSesstion(1, { from: accounts[0] }).then(function(result) {
                    expect(result).to.not.be.an("Error");
                });
            });
            it("Check result of item 1 ofter price changing", function() {
                return instance.getProposedPrice(1).then(function(result) {
                    expect(result).to.not.be.an("Error");
                    return instance.getDataItems(1);
                }).then(function(result) {
                    assert.equal(result, 600, "Wrong value, You check your algorithm")
                });
            });
        });

        describe("Mutiable participant join only one sesstion", function() {
            it("Admin start sesstion of item 2", function() {
                return instance.startSesstion(2, { from: accounts[0] }).then(function(result) {
                    expect(result).to.not.be.an("Error");
                });
            });
            it("Price changing: 1000 , Item number 2, from: account 1", function() {
                return instance.accumulatedDeviation(1000, 2, { from: accounts[1] }).then(function(result) {
                    expect(result).to.not.be.an("Error");
                });
            });
            it("Price changing: 1500 , Item number 2, from: account 2", function() {
                return instance.accumulatedDeviation(1500, 2, { from: accounts[2] }).then(function(result) {
                    expect(result).to.not.be.an("Error");
                });
            });
            it("Price changing: 2300 , Item number 2, from: account 3", function() {
                return instance.accumulatedDeviation(2300, 2, { from: accounts[3] }).then(function(result) {
                    expect(result).to.not.be.an("Error");
                });
            });
            it("Admin Stop sesstion of item 2", function() {
                return instance.stopSesstion(2, { from: accounts[0] }).then(function(result) {
                    expect(result).to.not.be.an("Error");
                });
            });
            it("Check result of item 1 ofter price changing", function() {
                return instance.getProposedPrice(2).then(function(result) {
                    expect(result).to.not.be.an("Error");
                    return instance.getDataItems(2);
                }).then(function(result) {
                    assert.equal(result, 1704, "Wrong value, You check your algorithm: " + result);
                });
            });
        });

        describe("Mutiable participant join mutiable sesstion", function() {
            it("Admin start sesstion of item 3", function() {
                return instance.startSesstion(3, { from: accounts[0] }).then(function(result) {
                    expect(result).to.not.be.an("Error");
                });
            });
            it("Admin start sesstion of item 4", function() {
                return instance.startSesstion(4, { from: accounts[0] }).then(function(result) {
                    expect(result).to.not.be.an("Error");
                });
            });
            ////
            it("Price changing: 800 , Item number 3, from: account 1", function() {
                return instance.accumulatedDeviation(800, 3, { from: accounts[1] }).then(function(result) {
                    expect(result).to.not.be.an("Error");
                });
            });
            it("Price changing: 900 , Item number 3, from: account 2", function() {
                return instance.accumulatedDeviation(900, 3, { from: accounts[2] }).then(function(result) {
                    expect(result).to.not.be.an("Error");
                });
            });
            it("Price changing: 950 , Item number 3, from: account 3", function() {
                return instance.accumulatedDeviation(950, 3, { from: accounts[3] }).then(function(result) {
                    expect(result).to.not.be.an("Error");
                });
            });
            it("Price changing: 20 , Item number 4, from: account 1", function() {
                return instance.accumulatedDeviation(20, 4, { from: accounts[1] }).then(function(result) {
                    expect(result).to.not.be.an("Error");
                });
            });
            it("Price changing: 60 , Item number 4, from: account 2", function() {
                return instance.accumulatedDeviation(60, 4, { from: accounts[2] }).then(function(result) {
                    expect(result).to.not.be.an("Error");
                });
            });
            it("Admin Stop sesstion of item 3", function() {
                return instance.stopSesstion(3, { from: accounts[0] }).then(function(result) {
                    expect(result).to.not.be.an("Error");
                });
            });
            it("Admin Stop sesstion of item 4", function() {
                return instance.stopSesstion(4, { from: accounts[0] }).then(function(result) {
                    expect(result).to.not.be.an("Error");
                });
            });

            it("Check result of item 3 ofter price changing", function() {
                return instance.getProposedPrice(3).then(function(result) {
                    expect(result).to.not.be.an("Error");
                    return instance.getDataItems(3);
                }).then(function(result) {
                    assert.equal(result, 887, "Wrong value, You check your algorithm: " + result);
                });
            });

            it("Check result of item 4 ofter price changing", function() {
                return instance.getProposedPrice(4).then(function(result) {
                    expect(result).to.not.be.an("Error");
                    return instance.getDataItems(4);
                }).then(function(result) {
                    assert.equal(result, 46, "Wrong value, You check your algorithm: " + result);
                });
            });
        });
    });
    describe("Get price proposal, Set final price WRONG state", function() {
        it("Get result price proposal", function() {
            return expect(instance.getProposedPrice(5)).to.be.rejectedWith(Error).eventually.with.property("name", "Error");
        });
        it("Set final price of item", function() {
            return expect(instance.setPriceOfItem(5, 400)).to.be.rejectedWith(Error).eventually.with.property("name", "Error");
        });
    });
});