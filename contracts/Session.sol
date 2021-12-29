pragma solidity >=0.4.0 <0.9.0;
import "./Main.sol";
contract Session is Main{
    struct Items{
        uint IdItem;
        string nameItem;
        string imageHash;
        uint firstPrice;
        string itemDescription;
        uint countPaticipantJoinSesstion;
        uint[] listPriceOfPaticipant;
        uint[] listPriceDeviation;
        uint valueChangePricing;
        address[] checkAccount;
        StatusSesstion statusSesstion;
        uint timeSesstionEachOtherproduct;
        uint timeFinishSesstionEachOtherproduct;
    }
    
    mapping(address => Paticipant) public paticipants;
    Items[] public itemsList;
    uint public index = 0;
    address[] public totalAccounts;
    string[] public listNameOfItems = ["Samsung Galaxy Note20"];
    string[] public listHashImage = ["QmNqVYtH4mXG69LnAYE4xy1hgff1ZkYBtvVcCDyA4RPi6i"];
    string[] public listInformationOfImage = ["Luxury high-class - Unique and attractive colors.<br/>Take professional photos - Set of 3 cameras that support Zoom as far as 30X.<br/>Take notes quickly and accurately with the new generation S-Pen.<br/>Ultimate gaming - Powerful 7nm Exynos 990, outstanding processing performance.<br/>Samsung Note 20 Ultra 5G phone - Luxury, outstanding performance.<br/>Monolithic aluminum frame design, luxurious tempered glass back."];
    uint[] public listPrice = [930];
    uint[] public emptyArray1 = [0];
    uint[] public emptyArray2 = [0];
    
    modifier checkStatus(StatusSesstion _statusSesstion, uint _IdItem){
        require(itemsList[_IdItem].statusSesstion == _statusSesstion, "Wrong status of sesstion");
        _;
    }

    event LogStartSession(uint indexed _IdItems, string _nameItem, uint _firstPrice);
    event LogStopSession(uint indexed _IdItems, string _nameItem, uint _firstPrice);
    event LogChainPriceOfSession(uint indexed _IdItems, string _nameItem, string _fullName, uint _valueChangePricing);

    constructor(){
        addData();
    }

    function createNewItem(string memory _nameItem, string memory _imageHash, string memory _itemDescription, uint _firstPrice) public onlyAdmin {
        listNameOfItems.push(_nameItem);
        listHashImage.push(_imageHash);
        listInformationOfImage.push(_itemDescription);
        listPrice.push(_firstPrice);
    }

    function addData() public{
        
        for(uint i = 0 ; i < listHashImage.length ; i++){
            bool statusAdd;
            for(uint j = 0 ; j < itemsList.length ; j++){
               statusAdd = stringsEquals(itemsList[j].imageHash, listHashImage[i]);
               if(statusAdd){
                   break;
               }
            }
            if(!statusAdd){
                uint[] memory emptyArray;
                address[] memory amptyAddressArray;
                itemsList.push(Items(i, listNameOfItems[i], listHashImage[i], listPrice[i], listInformationOfImage[i],  0, emptyArray, emptyArray, 0, amptyAddressArray, StatusSesstion.START, 0, 600));
                index++;
            }  
        }
    }

    function convertStateToString(uint _IdItem) public view returns(string memory){
        if(itemsList[_IdItem].statusSesstion == StatusSesstion.START){
            return "Not Start";
        }else{
            if(itemsList[_IdItem].statusSesstion == StatusSesstion.PRICING){
                return "Started";
            }else{
               if(itemsList[_IdItem].statusSesstion == StatusSesstion.ENDING){
                  return "Ending";
               }else{
                    return "Done";
               }
            }
        }
    }

    function stringsEquals(string memory s1, string memory s2) private pure returns (bool) {
        bytes memory b1 = bytes(s1);
        bytes memory b2 = bytes(s2);
        uint256 l1 = b1.length;
        if (l1 != b2.length) return false;
        for (uint256 i=0; i<l1; i++) {
            if (b1[i] != b2[i]) return false;
        }
        return true;
    }

    function getLengthItems() public view returns(uint) {
        return itemsList.length;
    }

    function stopSesstion(uint _IdItem) public onlyAdmin {
        itemsList[_IdItem].statusSesstion = StatusSesstion.ENDING;
        emit LogStopSession(_IdItem,  itemsList[_IdItem].nameItem,  itemsList[_IdItem].firstPrice);
    }
    
    function startSesstion(uint _IdItem) public onlyAdmin {
        itemsList[_IdItem].statusSesstion = StatusSesstion.PRICING;
        itemsList[_IdItem].timeSesstionEachOtherproduct = block.timestamp;
        emit LogStartSession(_IdItem,  itemsList[_IdItem].nameItem,  itemsList[_IdItem].firstPrice);
    }

    function setFinalPriceOfItem(uint _IdItem, uint _price) public onlyAdmin {
         itemsList[_IdItem].firstPrice = _price;
         itemsList[_IdItem].statusSesstion = StatusSesstion.DONE;
    }

    function showDataPrice(uint _IdItem, address _address) public view returns(uint[] memory){
        return paticipants[_address].listDataChange[_IdItem].priceDeviation;
    }

    function showDataDeviation(uint _IdItem, address _address) public view returns(uint[] memory){
        return paticipants[_address].listDataChange[_IdItem].valueChangePricingOtherPaticipant;
    }

    function getAddressChangedPriceOfItems(uint _IdItem) public view returns(address[] memory){
         return itemsList[_IdItem].checkAccount;
    }

    function getAddressUserRegister() public view returns(address[] memory){
        return totalAccounts;
    }

    function registerAccount(address _address, string memory _fullName, string memory _email, string memory _passwordAccount) public{
        bool checkStatusAddress = false;
        if(_address == admin){
            revert("Account of admin can't register");
        }
        if(totalAccounts.length > 10){
            revert("The number of participants is less than ten.");
        }else{
            for(uint i = 0; i < totalAccounts.length; i++){
                if(_address == totalAccounts[i]){
                    checkStatusAddress = true;
                    break;
                }
            }
            if(!checkStatusAddress){
                totalAccounts.push(_address); 
                paticipants[_address].addressAccount = _address;
                paticipants[_address].fullName = _fullName;
                paticipants[_address].email = _email;
                paticipants[_address].passwordAccount = _passwordAccount;
                paticipants[_address].countPricedSesstion = 0;
                
                for(uint i = 0 ; i < index ; i++){
                    DataChange memory dataChange = DataChange({IdItem: i, priceDeviation: emptyArray1, valueChangePricingOtherPaticipant: emptyArray2 , numberChangePricingOtherPaticipant: 0});
                    paticipants[_address].listDataChange.push(dataChange);
                }
            }else{
                revert("This address Really existed");
            }
        }   
    }  
    function getProposedPrice(uint _IdItem) public{
        if(itemsList[_IdItem].statusSesstion != StatusSesstion.ENDING){
            revert("Wrong status of sesstion");
        }
        uint totalPriceOfPaticipantAbove;
        uint numberPaticipantJoneSestion = itemsList[_IdItem].checkAccount.length;
        for(uint i = 0 ; i < numberPaticipantJoneSestion ; i++){
              uint lengthPriceDeviation = paticipants[itemsList[_IdItem].checkAccount[i]].listDataChange[_IdItem].numberChangePricingOtherPaticipant;
              totalPriceOfPaticipantAbove += (paticipants[itemsList[_IdItem].checkAccount[i]].listDataChange[_IdItem].priceDeviation[lengthPriceDeviation]) * (100 - (paticipants[itemsList[_IdItem].checkAccount[i]].listDataChange[_IdItem].valueChangePricingOtherPaticipant[lengthPriceDeviation]));        
        }
        uint totalPriceOfPaticipantUnderLeft = 100 * numberPaticipantJoneSestion;
        uint totalPriceOfPaticipantUnderRight;
        for(uint i = 0 ; i < numberPaticipantJoneSestion ; i++){
              uint lengthPriceDeviation = paticipants[itemsList[_IdItem].checkAccount[i]].listDataChange[_IdItem].numberChangePricingOtherPaticipant;
              totalPriceOfPaticipantUnderRight += paticipants[ itemsList[_IdItem].checkAccount[i]].listDataChange[_IdItem].valueChangePricingOtherPaticipant[lengthPriceDeviation];
        }
        uint result = totalPriceOfPaticipantAbove / (totalPriceOfPaticipantUnderLeft - totalPriceOfPaticipantUnderRight);
        itemsList[_IdItem].valueChangePricing = result;
    }

    function accumulatedDeviation(uint _newPriceOfParticipan, uint _IdItem) public notOnlyAdmin checkStatus(StatusSesstion.PRICING, _IdItem){
        if(itemsList[_IdItem].checkAccount.length == 0){
            itemsList[_IdItem].checkAccount.push(msg.sender);
        }else{
            for(uint i = 0 ; i < itemsList[_IdItem].checkAccount.length; i++){
                if(itemsList[_IdItem].checkAccount[i] == msg.sender){
                    status = true;
                    break;
                }
            }
            if(status == false){
                itemsList[_IdItem].checkAccount.push(msg.sender);
            }else{
                status = false;
            }
        }
        uint calNewPriceOfParticipant = calculatingDeviation(_newPriceOfParticipan, _IdItem);
        uint lengthPriceDeviation = paticipants[msg.sender].listDataChange[_IdItem].numberChangePricingOtherPaticipant;
        uint numberPaticipant = paticipants[msg.sender].listDataChange[_IdItem].numberChangePricingOtherPaticipant;
        uint currentPriceDeviation = paticipants[msg.sender].listDataChange[_IdItem].valueChangePricingOtherPaticipant[lengthPriceDeviation];
        uint value = (currentPriceDeviation * numberPaticipant + calNewPriceOfParticipant) / (numberPaticipant + 1);
        paticipants[msg.sender].listDataChange[_IdItem].valueChangePricingOtherPaticipant.push(value);
        paticipants[msg.sender].listDataChange[_IdItem].priceDeviation.push(_newPriceOfParticipan);
        paticipants[msg.sender].listDataChange[_IdItem].numberChangePricingOtherPaticipant++;
        paticipants[msg.sender].countPricedSesstion++;
        itemsList[_IdItem].countPaticipantJoinSesstion++;
        emit LogChainPriceOfSession(_IdItem, itemsList[_IdItem].nameItem,  paticipants[msg.sender].fullName, _newPriceOfParticipan);
    }

    function calculatingDeviation(uint _priceOfParticipan, uint _IdItem) internal view returns (uint){
        uint newPriceDeviation = 0;
        if(itemsList[_IdItem].firstPrice > _priceOfParticipan){
            newPriceDeviation = (itemsList[_IdItem].firstPrice  - _priceOfParticipan) * 100 / itemsList[_IdItem].firstPrice;
        }else{
            newPriceDeviation = (_priceOfParticipan - itemsList[_IdItem].firstPrice) * 100 / itemsList[_IdItem].firstPrice;
        }
        return uint(newPriceDeviation);
    }

    function timeOutOfSesstion(uint _IdItem) public{
        if(itemsList[_IdItem].timeSesstionEachOtherproduct == 0){
             itemsList[_IdItem].statusSesstion = StatusSesstion.START;
        }else{
            if(block.timestamp > itemsList[_IdItem].timeSesstionEachOtherproduct && block.timestamp < itemsList[_IdItem].timeSesstionEachOtherproduct +itemsList[_IdItem].timeFinishSesstionEachOtherproduct){
                itemsList[_IdItem].statusSesstion = StatusSesstion.PRICING;
            }else{
                if(block.timestamp > itemsList[_IdItem].timeSesstionEachOtherproduct + itemsList[_IdItem].timeFinishSesstionEachOtherproduct){
                    itemsList[_IdItem].statusSesstion = StatusSesstion.ENDING;
                }
            }
        }
        
    }
}