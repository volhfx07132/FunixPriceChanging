pragma solidity >=0.4.0 <0.9.0;
contract Main{
    struct DataChange{
        uint IdItem;
        uint[] priceDeviation;
        uint[] valueChangePricingOtherPaticipant;
        uint numberChangePricingOtherPaticipant;
    }

    struct Paticipant{
        address addressAccount;
        string fullName;
        string email;
        string passwordAccount;
        uint countPricedSesstion; 
        DataChange[] listDataChange;
    }
    address public admin;
    bool status = false;
    enum StatusSesstion {START, PRICING, ENDING ,DONE}
   
    constructor(){
        admin = msg.sender;
    }

    modifier onlyAdmin(){
        require(msg.sender == admin,"Only admin can solve");
        _;
    }

    modifier notOnlyAdmin(){
        require(msg.sender != admin,"Not only admin");
        _;
    }
}