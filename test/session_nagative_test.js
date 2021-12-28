const Session = artifacts.require("Session");
var chaiAsPromised = require("chai-as-promised");
var chai = require("chai");
const { assert } = require("chai");
chai.use(chaiAsPromised);
var expect = chai.expect;
var instanceSession;
contract("Session", accounts => {
  
    describe("Start initialize smart contract", function() {
        it("Contract deployment", async() => {
            instanceSession = await Session.deployed();
            assert(instanceSession != undefined, "Smart contract should be defined");
        });
        it("Should check account 0 is account of admin", function() {
            return instanceSession.admin().then(function(result) {
                assert(result == accounts[0], "Should set account for admin");
            });
        });
        it("Should check default item in project", function() {
           return instanceSession.listNameOfItems(0).then(function(result) {
               assert.equal(result, "Samsung Galaxy Note20", "Default items name must be: Samsung Galaxy Note20");
               return instanceSession.listHashImage(0);
           }).then(function(result) {
               assert.equal(result, "QmNqVYtH4mXG69LnAYE4xy1hgff1ZkYBtvVcCDyA4RPi6i", "Default items hash image must be: QmNqVYtH4mXG69LnAYE4xy1hgff1ZkYBtvVcCDyA4RPi6i");
               return instanceSession.listPrice(0);
           }).then(function(result) {
              assert.equal(result, 930, "Default value must be 930");
              return instanceSession.addData();
           }).then(function(result) {
              expect(result).to.not.be.an("Error");
              return instanceSession.itemsList(0);
           }).then(function(items) {
               assert.equal(items[0], 0, "First Id");
               assert.equal(items[1], "Samsung Galaxy Note20", "Default items name must be: Samsung Galaxy Note20");
               assert.equal(items[2], "QmNqVYtH4mXG69LnAYE4xy1hgff1ZkYBtvVcCDyA4RPi6i", "Default items hash image must be: QmNqVYtH4mXG69LnAYE4xy1hgff1ZkYBtvVcCDyA4RPi6i");
               assert.equal(items[3], 930, "Default value must be 930");
               assert.equal(items[5], 0, "Count paticipant join sesstion must be 0");
               assert.equal(items[6], 0, "Value change pricing sesstion must be 0");
               assert.equal(items[7], 0, "Status sesstion sesstion must be 0");
               assert.equal(items[8], 0, "Time sesstion each other product must be 0");
               assert.equal(items[9], 600, "Time finish session each other product must be 600");
               return instanceSession.convertStateToString(0);
           }).then(function(result){
            assert.equal(result, "Not Start", "Satus of items 0 is: Not Start ");
           })
        })
    });

    describe("Customer register a new account", function(){
        it("Should register a new account", function(){
            return instanceSession.registerAccount(accounts[1], "Le Hong Vo", "vo@gmail.com", "vo123123").then(function(result){
                expect(result).to.not.be.an("Error");
                return instanceSession.registerAccount(accounts[2], "Tran Duc Thang", "thang@gmail.com", "thang123123");
            }).then(function(result){
                expect(result).to.not.be.an("Error");
                return instanceSession.registerAccount(accounts[3], "Tran Thi Thoa", "thoa@gmail.com", "thoa123123");
            }).then(function(result){
                expect(result).to.not.be.an("Error");
                return instanceSession.registerAccount(accounts[4], "Nguyen Thi Thu", "thu@gmail.com", "thu123123");
            }).then(function(result) {
                expect(result).to.not.be.an("Error");
                return instanceSession.registerAccount(accounts[5], "Cao Nhu Phu", "phu@gmail.com", "phu123123");
            })
        })
    })    

    describe("The nagative test ", function() {
        it("Shouls NOT allow admin to create the product", function() {
            return expect(instanceSession.createNewItem("Iphone5" , "Hash image of Iphone5", "Description of Iphone5", 300, {from: accounts[1]}))
            .to.be.rejectedWith(Error).eventually.with.property("name", "Error");
        })
        it("Shouls NOT allow admin start change price the product", function() {
            return expect(instanceSession.startSesstion(0, {from: accounts[1]}))
            .to.be.rejectedWith(Error).eventually.with.property("name", "Error");
        })

        it("Shouls NOT allow start change price the account not exited", function() {
            return expect(instanceSession.startSesstion(0, {from: accounts[6]}))
            .to.be.rejectedWith(Error).eventually.with.property("name", "Error");
        })

        it("Shouls NOT allow change price the acount not exited", function() {
            return expect(instanceSession.accumulatedDeviation(400, 0, {from: accounts[7]}))
            .to.be.rejectedWith(Error).eventually.with.property("name", "Error");
        })

        it("Shouls NOT allow change price the with not yet start the product", function() {
            return expect(instanceSession.accumulatedDeviation(400, 0, {from: accounts[1]}))
            .to.be.rejectedWith(Error).eventually.with.property("name", "Error");
        })

        it("Shouls NOT allow change price the with admin account", function() {
            return expect(instanceSession.accumulatedDeviation(400, 0, {from: accounts[0]}))
            .to.be.rejectedWith(Error).eventually.with.property("name", "Error");
        })
        //getProposedPrice
        it("Shouls NOT allow change getProposedPrice not exited", function() {
            return expect(instanceSession.getProposedPrice(0))
            .to.be.rejectedWith(Error).eventually.with.property("name", "Error");
        })

        it("Shouls NOT allow admin stop change price the product", function() {
            return expect(instanceSession.stopSesstion(0, {from: accounts[3]}))
            .to.be.rejectedWith(Error).eventually.with.property("name", "Error");
        })

        it("Shouls NOT allow to stop change price the product not exit", function() {
            return expect(instanceSession.stopSesstion(10, {from: accounts[0]}))
            .to.be.rejectedWith(Error).eventually.with.property("name", "Error");
        })

        it("Shouls NOT allow admin set final price of the product", function() {
            return expect(instanceSession.setFinalPriceOfItem(0, 400, {from: accounts[0]}))
            .to.be.rejectedWith(Error).eventually.with.property("name", "Error");
        })

        it("Shouls NOT allow set final price of the product not exited", function() {
            return expect(instanceSession.setFinalPriceOfItem(6, 400, {from: accounts[0]}))
            .to.be.rejectedWith(Error).eventually.with.property("name", "Error");
        })
    })
    
})      