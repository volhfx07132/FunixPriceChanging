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
    
    //Check function createNewItem: add articles to project
    describe("Admin create new items and add to array", function() {
        it("Should Add items only admin", function() {
            return instanceSession.createNewItem("Iphone5" , "Hash image of Iphone5", "Description of Iphone5", 300, {from: accounts[0]}).then(function(result) {
                expect(result).to.not.be.an("Error");
                return instanceSession.createNewItem("Iphone6" , "Hash image of Iphone6", "Description of Iphone6", 340, {from: accounts[0]})
            }).then(function(result) {
                expect(result).to.not.be.an("Error");
                return instanceSession.createNewItem("Iphone10" , "Hash image of Iphone10", "Description of Iphone6", 530, {from: accounts[0]})
            }).then(function(result) {
                expect(result).to.not.be.an("Error");
                return instanceSession.createNewItem("Iphone12" , "Hash image of Iphone12", "Description of Iphone6", 910, {from: accounts[0]})
            }).then(function(result) {
                expect(result).to.not.be.an("Error");
                return instanceSession.addData();
            }).then(function(result) {
                expect(result).to.not.be.an("Error");
            })
        })
        it("Check new items in product", function() {
            return instanceSession.itemsList(1).then(function(items) {
                assert.equal(items[0], 1, "Id of iphone5");
                assert.equal(items[1], "Iphone5", "Ntems name must be: Iphone5");
                assert.equal(items[2], "Hash image of Iphone5", "Items hash image must be: Hash image of Iphone5");
                assert.equal(items[3], 300, "price must be 300");
                assert.equal(items[5], 0, "Count paticipant join sesstion must be 0");
                assert.equal(items[6], 0, "Value change pricing sesstion must be 0");
                assert.equal(items[7], 0, "Status sesstion sesstion must be 0");
                assert.equal(items[8], 0, "Time sesstion each other product must be 0");
                assert.equal(items[9], 600, "Time finish session each other product must be 600");
                return instanceSession.itemsList(2);
            }).then(function(items){
                assert.equal(items[0], 2, "Id of iphone6");
                assert.equal(items[1], "Iphone6", "Ntems name must be: Iphone6");
                assert.equal(items[2], "Hash image of Iphone6", "Items hash image must be: Hash image of Iphone6");
                assert.equal(items[3], 340, "price must be 340");
                assert.equal(items[5], 0, "Count paticipant join sesstion must be 0");
                assert.equal(items[6], 0, "Value change pricing sesstion must be 0");
                assert.equal(items[7], 0, "Status sesstion sesstion must be 0");
                assert.equal(items[8], 0, "Time sesstion each other product must be 0");
                assert.equal(items[9], 600, "Time finish session each other product must be 600");
                return instanceSession.itemsList(3);
            }).then(function(items) {
                assert.equal(items[0], 3, "Id of iphone10");
                assert.equal(items[1], "Iphone10", "Ntems name must be: Iphone10");
                assert.equal(items[2], "Hash image of Iphone10", "Items hash image must be: Hash image of Iphone10");
                assert.equal(items[3], 530, "price must be 530");
                assert.equal(items[5], 0, "Count paticipant join sesstion must be 0");
                assert.equal(items[6], 0, "Value change pricing sesstion must be 0");
                assert.equal(items[7], 0, "Status sesstion sesstion must be 0");
                assert.equal(items[8], 0, "Time sesstion each other product must be 0");
                assert.equal(items[9], 600, "Time finish session each other product must be 600");
                return instanceSession.itemsList(4);
            }).then(function(items) {
                assert.equal(items[0], 4, "Id of iphone12");
                assert.equal(items[1], "Iphone12", "Ntems name must be: Iphone12");
                assert.equal(items[2], "Hash image of Iphone12", "Items hash image must be: Hash image of Iphone12");
                assert.equal(items[3], 910, "price must be 910");
                assert.equal(items[5], 0, "Count paticipant join sesstion must be 0");
                assert.equal(items[6], 0, "Value change pricing sesstion must be 0");
                assert.equal(items[7], 0, "Status sesstion sesstion must be 0");
                assert.equal(items[8], 0, "Time sesstion each other product must be 0");
                assert.equal(items[9], 600, "Time finish session each other product must be 600");
                return instanceSession.convertStateToString(1);
            }).then(function(result){
               assert.equal(result, "Not Start", "Satus of items 1 is: Not Start ");
               return instanceSession.convertStateToString(2);
            }).then(function(result){
                assert.equal(result, "Not Start", "Satus of items 2 is: Not Start ");
                return instanceSession.convertStateToString(3);
             }).then(function(result){
                assert.equal(result, "Not Start", "Satus of items 3 is: Not Start ");
                return instanceSession.convertStateToString(4);
             }).then(function(result){
                assert.equal(result, "Not Start", "Satus of items 4 is: Not Start ");
             })
        });
    })
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

        it("Should check data in eath other account", function () {
            return instanceSession.paticipants(accounts[1]).then(function (data) {
                assert.equal(data[0], accounts[1], "Account must be account 1");
                assert.equal(data[1], "Le Hong Vo", "FullName must be Le Hong Vo");
                assert.equal(data[2], "vo@gmail.com", "Email must be vo@gmail.com");
                assert.equal(data[3], "vo123123", "Password account must be vo123123");
                assert.equal(data[4], 0, "Count priced sesstion must be 0");
                return instanceSession.paticipants(accounts[2]);
            }).then(function(data) {
                assert.equal(data[0], accounts[2], "Account must be account 2");
                assert.equal(data[1], "Tran Duc Thang", "FullName must be Tran Duc Thang");
                assert.equal(data[2], "thang@gmail.com", "Email must be thang@gmail.com");
                assert.equal(data[3], "thang123123", "Password account must be thang123123");
                assert.equal(data[4], 0, "Count priced sesstion must be 0");
                return instanceSession.paticipants(accounts[4]);
            }).then(function(data){
                assert.equal(data[0], accounts[4], "Account must be account 4");
                assert.equal(data[1], "Nguyen Thi Thu", "FullName must be Nguyen Thi Thu");
                assert.equal(data[2], "thu@gmail.com", "Email must be thu@gmail.com");
                assert.equal(data[3], "thu123123", "Password account must be thu123123");
                assert.equal(data[4], 0, "Count priced sesstion must be 0");
                return instanceSession.paticipants(accounts[5]);
            }).then(function(data){
                assert.equal(data[0], accounts[5], "Account must be account 5");
                assert.equal(data[1], "Cao Nhu Phu", "FullName must be Cao Nhu Phu");
                assert.equal(data[2], "phu@gmail.com", "Email must be phu@gmail.com");
                assert.equal(data[3], "phu123123", "Password account must be phu123123");
                assert.equal(data[4], 0, "Count priced sesstion must be 0");
                return instanceSession.paticipants(accounts[3]);
            }).then(function(data){
                assert.equal(data[0], accounts[3], "Account must be account 2");
                assert.equal(data[1], "Tran Thi Thoa", "FullName must be Tran Thi Thoa");
                assert.equal(data[2], "thoa@gmail.com", "Email must be thoa@gmail.com");
                assert.equal(data[3], "thoa123123", "Password account must be thoa123123");
                assert.equal(data[4], 0, "Count priced sesstion must be 0");
            })
        })
    })

    describe("Start the session", function () {
        it("Should check start session default", function () {
            return instanceSession.startSesstion(0, {from: accounts[0]}).then(function (receipt) {
                assert.equal(receipt.logs.length, 1, "one event should have been triggered");
                assert.equal(receipt.logs[0].event, "LogStartSession", "event should be LogStartSession");
                assert.equal(receipt.logs[0].args._nameItem, "Samsung Galaxy Note20", "event name item must be Samsung Galaxy Note20"); 
                assert.equal(receipt.logs[0].args._firstPrice, 930, "event first price must be " + 930); 
            });
        });
        it("Should check start session 1", function () {
            return instanceSession.startSesstion(1, {from: accounts[0]}).then(function (receipt) {
                assert.equal(receipt.logs.length, 1, "one event should have been triggered");
                assert.equal(receipt.logs[0].event, "LogStartSession", "event should be LogStartSession");
                assert.equal(receipt.logs[0].args._nameItem, "Iphone5", "event name item must be Iphone5"); 
                assert.equal(receipt.logs[0].args._firstPrice, 300, "event first price must be " + 300); 
            });
        });
        it("Should check start session 2", function () {
            return instanceSession.startSesstion(2, {from: accounts[0]}).then(function (receipt) {
                assert.equal(receipt.logs.length, 1, "one event should have been triggered");
                assert.equal(receipt.logs[0].event, "LogStartSession", "event should be LogStartSession");
                assert.equal(receipt.logs[0].args._nameItem, "Iphone6", "event name item must be Iphone6"); 
                assert.equal(receipt.logs[0].args._firstPrice, 340, "event first price must be " + 340); 
            });
        });
    })

    describe("Change Price ", function () {
        it("Should only participant join change price only one product with multiple times", function () {
            return instanceSession.accumulatedDeviation(900 ,0, {from: accounts[1]}).then(function (receipt) {
                assert.equal(receipt.logs.length, 1, "one event should have been triggered");
                assert.equal(receipt.logs[0].event, "LogChainPriceOfSession", "event should be LogChainPriceOfSession");
                assert.equal(receipt.logs[0].args._nameItem, "Samsung Galaxy Note20", "event name item must be Samsung Galaxy Note20"); 
                assert.equal(receipt.logs[0].args._fullName, "Le Hong Vo", "event full name must be Le Hong Vo"); 
                assert.equal(receipt.logs[0].args._valueChangePricing, 900, "Value change pricing must be " + 900); 
                return instanceSession.accumulatedDeviation(1000 ,0, {from: accounts[1]})
            }).then(function(receipt) {
                assert.equal(receipt.logs.length, 1, "one event should have been triggered");
                assert.equal(receipt.logs[0].event, "LogChainPriceOfSession", "event should be LogChainPriceOfSession");
                assert.equal(receipt.logs[0].args._nameItem, "Samsung Galaxy Note20", "event name item must be Samsung Galaxy Note20"); 
                assert.equal(receipt.logs[0].args._fullName, "Le Hong Vo", "event full name must be Le Hong Vo"); 
                assert.equal(receipt.logs[0].args._valueChangePricing, 1000, "Value change pricing must be " + 1000);
                return instanceSession.accumulatedDeviation(1100 ,0, {from: accounts[1]})
            }).then(function(receipt) {
                assert.equal(receipt.logs.length, 1, "one event should have been triggered");
                assert.equal(receipt.logs[0].event, "LogChainPriceOfSession", "event should be LogChainPriceOfSession");
                assert.equal(receipt.logs[0].args._nameItem, "Samsung Galaxy Note20", "event name item must be Samsung Galaxy Note20"); 
                assert.equal(receipt.logs[0].args._fullName, "Le Hong Vo", "event full name must be Le Hong Vo"); 
                assert.equal(receipt.logs[0].args._valueChangePricing, 1100, "Value change pricing must be " + 1100);
                return instanceSession.stopSesstion(0, {from: accounts[0]});
            }).then(function(result){
                expect(result).to.not.be.an("Error");
                return instanceSession.getProposedPrice(0);
            }).then(function(result){
                expect(result).to.not.be.an("Error");
                return instanceSession.setFinalPriceOfItem(0, 1150);
            }).then(function(result){
                expect(result).to.not.be.an("Error");
                return instanceSession.paticipants(accounts[1]);
            }).then(function(data){
                assert.equal(data[0], accounts[1], "Account must be account 1");
                assert.equal(data[1], "Le Hong Vo", "FullName must be Le Hong Vo");
                assert.equal(data[2], "vo@gmail.com", "Email must be vo@gmail.com");
                assert.equal(data[3], "vo123123", "Password account must be vo123123");
                assert.equal(data[4], 3, "Count priced sesstion must be 0");
                return instanceSession.showDataPrice(0, accounts[1]);
            }).then(function(data){
                assert.equal(data[1], 900, "Price must be 900");
                assert.equal(data[2], 1000, "Price must be 900");
                assert.equal(data[3], 1100, "Price must be 900");
                return instanceSession.showDataDeviation(0, accounts[1]);
            }).then(function(data) {
                assert.equal(data[1], 3, "Deviation must be 3");
                assert.equal(data[2], 5, "Deviation must be 5");
                assert.equal(data[3], 9, "Deviation must be 9");
                return instanceSession.itemsList(0);
            }).then(function(items) {
                assert.equal(items[0], 0, "First Id");
                assert.equal(items[1], "Samsung Galaxy Note20", "Default items name must be: Samsung Galaxy Note20");
                assert.equal(items[2], "QmNqVYtH4mXG69LnAYE4xy1hgff1ZkYBtvVcCDyA4RPi6i", "Default items hash image must be: QmNqVYtH4mXG69LnAYE4xy1hgff1ZkYBtvVcCDyA4RPi6i");
                assert.equal(items[3], 1150, "Default value must be 930");
                assert.equal(items[5], 3, "Count paticipant join sesstion must be 0");
                assert.equal(items[6], 1100, "Value change pricing sesstion must be 0");
                assert.equal(items[7], 3, "Status sesstion sesstion must be 0");
                assert.equal(items[9], 600, "Time finish session each other product must be 600");
            })
        })
        it("Should multiple participant join change price only one product with multiple times", function () {
            return instanceSession.accumulatedDeviation(350 ,1, {from: accounts[1]}).then(function (receipt) {
                assert.equal(receipt.logs.length, 1, "one event should have been triggered");
                assert.equal(receipt.logs[0].event, "LogChainPriceOfSession", "event should be LogChainPriceOfSession");
                assert.equal(receipt.logs[0].args._nameItem, "Iphone5", "event name item must be Iphone5"); 
                assert.equal(receipt.logs[0].args._fullName, "Le Hong Vo", "event full name must be Le Hong Vo"); 
                assert.equal(receipt.logs[0].args._valueChangePricing, 350, "Value change pricing must be " + 350); 
                return instanceSession.accumulatedDeviation(400 ,1, {from: accounts[2]})
            }).then(function(receipt){
                assert.equal(receipt.logs.length, 1, "one event should have been triggered");
                assert.equal(receipt.logs[0].event, "LogChainPriceOfSession", "event should be LogChainPriceOfSession");
                assert.equal(receipt.logs[0].args._nameItem, "Iphone5", "event name item must be Iphone5"); 
                assert.equal(receipt.logs[0].args._fullName, "Tran Duc Thang", "event full name must be Tran Duc Thang"); 
                assert.equal(receipt.logs[0].args._valueChangePricing, 400, "Value change pricing must be " + 400); 
                return instanceSession.stopSesstion(1, {from: accounts[0]});
            }).then(function(result){
                expect(result).to.not.be.an("Error");
                return instanceSession.getProposedPrice(1);
            }).then(function(result){
                expect(result).to.not.be.an("Error");
                return instanceSession.setFinalPriceOfItem(1, 380);
            }).then(function(result){
                expect(result).to.not.be.an("Error");
                return instanceSession.paticipants(accounts[1]);
            }).then(function(data){
                assert.equal(data[0], accounts[1], "Account must be account 1");
                assert.equal(data[1], "Le Hong Vo", "FullName must be Le Hong Vo");
                assert.equal(data[2], "vo@gmail.com", "Email must be vo@gmail.com");
                assert.equal(data[3], "vo123123", "Password account must be vo123123");
                assert.equal(data[4], 4, "Count priced sesstion must be 0");
                return instanceSession.paticipants(accounts[2]);
            }).then(function(data){
                assert.equal(data[0], accounts[2], "Account must be account 2");
                assert.equal(data[1], "Tran Duc Thang", "FullName must be Tran Duc Thang");
                assert.equal(data[2], "thang@gmail.com", "Email must be thang@gmail.com");
                assert.equal(data[3], "thang123123", "Password account must be thang123123");
                assert.equal(data[4], 1, "Count priced sesstion must be 0");
                return instanceSession.showDataPrice(1, accounts[1]);
            }).then(function(data){
                assert.equal(data[1], 350, "Price must be 350");
                return instanceSession.showDataDeviation(1, accounts[1]);
            }).then(function(data){
                assert.equal(data[1], 16, "Deviation must be 16");
                return instanceSession.showDataPrice(1, accounts[2]);
            }).then(function(data){
                assert.equal(data[1], 400, "Price must be 350");
                return instanceSession.showDataDeviation(1, accounts[2]);
            }).then(function(data){
                assert.equal(data[1], 33, "Deviation must be 33");
                return instanceSession.itemsList(1);
            }).then(function(items) {
                assert.equal(items[0], 1, "Id of iphone5");
                assert.equal(items[1], "Iphone5", "Ntems name must be: Iphone5");
                assert.equal(items[2], "Hash image of Iphone5", "Items hash image must be: Hash image of Iphone5");
                assert.equal(items[3], 380, "price must be 300");
                assert.equal(items[5], 2, "Count paticipant join sesstion must be 2");
                assert.equal(items[6], 372, "Value change pricing sesstion must be 372");
                assert.equal(items[7], 3, "Status sesstion sesstion must be 3");
                assert.equal(items[9], 600, "Time finish session each other product must be 600");
            })
        })
    })
});