pragma solidity >=0.4.0 <0.9.0;
contract Main{
    //Set Data for DataChange object
    struct DataChange{
        uint IdItem;
        uint[] priceDeviation;A: B
        uint[] valueChangePricingOtherPaticipant;10; 30
        uint numberChangePricingOtherPaticipant;
    }
    //Set Data for Paticipant object
    struct Paticipant{
        address addressAccount;
        string fullName;
        string email;
        string passwordAccount;
        uint countPricedSesstion; 
        DataChange[] listDataChange;
    }
    //Admin of session
    address public admin;
    //Status to check account exits from adddres array
    bool status = false;
    //The status of the session
    enum StatusSesstion {START, PRICING, ENDING ,DONE}
    //constructor initializes address for admin
    constructor(){
        admin = msg.sender;
    } 
    //modifier check address of session
    modifier onlyAdmin(){
        require(msg.sender == admin,"Only admin can solve");
        _;
    }
    //modifier check address of session
    modifier notOnlyAdmin(){
        require(msg.sender != admin,"Not only admin");
        _;
    }
}