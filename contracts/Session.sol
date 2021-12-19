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
    
    mapping(address => Paticipant) private paticipants;
    Items[] public itemsList;
    uint public index = 0;
    address[] public totalAccounts;
    uint indexPaticipant = 0;
    
    modifier checkStatus(StatusSesstion _statusSesstion, uint _IdItem){
        require(itemsList[_IdItem].statusSesstion == _statusSesstion, "Wrong status of sesstion");
        _;
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
                itemsList.push(Items(i, listNameOfItems[i], listHashImage[i], listPrice[i], listInformationOfImage[i],  0, emptyArray, emptyArray, 0, amptyAddressArray, StatusSesstion.START, 0, 100));
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
                return "Finish";
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
    
    function startSesstion(uint _IdItem) public onlyAdmin {
        itemsList[_IdItem].statusSesstion = StatusSesstion.PRICING;
        itemsList[_IdItem].timeSesstionEachOtherproduct = block.timestamp;
    }

    function stopSesstion(uint _IdItem) public onlyAdmin{
        itemsList[_IdItem].statusSesstion = StatusSesstion.DONE;
    }

    function register(address _address, string memory _fullName, string memory _email) public onlyAdmin(){
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
                paticipants[_address].IDPaticipant = indexPaticipant;  
                paticipants[_address].addressAccount = _address;
                paticipants[_address].fullName = _fullName;
                paticipants[_address].email = _email;
                paticipants[_address].countPricedSesstion = 0;
                for(uint i = 0 ; i < index ; i++){
                    DataChange memory dataChange = DataChange({IdItem: i, priceDeviation: 0, valueChangePricingOtherPaticipant: 0 , numberChangePricingOtherPaticipant: 0});
                    paticipants[_address].listDataChange.push(dataChange);
                }
                indexPaticipant++;
            }else{
                revert("This address Really existed");
            }
        }   
    }
    
    function getProposedPrice(uint _IdItem) public onlyAdmin {
        timeOutOfSesstion(_IdItem);
        if(itemsList[_IdItem].statusSesstion != StatusSesstion.DONE){
            revert("Wrong status of sesstion");
        }
        uint totalPriceOfPaticipantAbove;
        uint numberPaticipantJoneSestion = itemsList[_IdItem].checkAccount.length;
        for(uint i = 0 ; i < numberPaticipantJoneSestion ; i++){
              totalPriceOfPaticipantAbove += (paticipants[itemsList[_IdItem].checkAccount[i]].listDataChange[_IdItem].priceDeviation) * (100 - (paticipants[itemsList[_IdItem].checkAccount[i]].listDataChange[_IdItem].valueChangePricingOtherPaticipant));        
        }
        uint totalPriceOfPaticipantUnderLeft = 100 * numberPaticipantJoneSestion;
        uint totalPriceOfPaticipantUnderRight;
        for(uint i = 0 ; i < numberPaticipantJoneSestion ; i++){
              totalPriceOfPaticipantUnderRight += paticipants[ itemsList[_IdItem].checkAccount[i]].listDataChange[_IdItem].valueChangePricingOtherPaticipant;
        }
        uint result = totalPriceOfPaticipantAbove / (totalPriceOfPaticipantUnderLeft - totalPriceOfPaticipantUnderRight);
        itemsList[_IdItem].valueChangePricing = result;
        //emit LogFinishPriceItems(_IdItem,  itemsList[_IdItem].nameItem, itemsList[_IdItem].firstPrice, itemsList[_IdItem].itemDescription, itemsList[_IdItem].statusSesstion, itemsList[_IdItem].valueChangePricing);
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
        uint numberPaticipant = paticipants[msg.sender].listDataChange[_IdItem].numberChangePricingOtherPaticipant;
        uint currentPriceDeviation = paticipants[msg.sender].listDataChange[_IdItem].valueChangePricingOtherPaticipant;
        uint value = (currentPriceDeviation * numberPaticipant + calNewPriceOfParticipant) / (numberPaticipant + 1);
        paticipants[msg.sender].listDataChange[_IdItem].valueChangePricingOtherPaticipant = value;
        paticipants[msg.sender].listDataChange[_IdItem].priceDeviation = _newPriceOfParticipan;
        paticipants[msg.sender].listDataChange[_IdItem].numberChangePricingOtherPaticipant++;
        itemsList[_IdItem].countPaticipantJoinSesstion++;
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

    function timeOutOfSesstion(uint _IdItem) internal checkStatus(StatusSesstion.PRICING, _IdItem){
        if(block.timestamp > itemsList[_IdItem].timeSesstionEachOtherproduct + itemsList[_IdItem].timeFinishSesstionEachOtherproduct){
             itemsList[_IdItem].statusSesstion = StatusSesstion.DONE;
        }
    }

    function getDataItems(uint _IdItem) public view returns(uint) {
       return itemsList[_IdItem].valueChangePricing;
    }

    function getStatusSesstion(uint _IdItem) public view returns(StatusSesstion){
        return itemsList[_IdItem].statusSesstion;
    }

    function setPriceOfItem(uint _IdItem, uint _price) public checkStatus(StatusSesstion.DONE, _IdItem){
         itemsList[_IdItem].valueChangePricing = _price;
    }
}