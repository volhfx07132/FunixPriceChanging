pragma solidity >=0.4.0 <0.9.0;
import "./Main.sol";
contract Session is Main{
    struct Items{
        uint IdItem;
        string nameItem;
        uint firstPrice;
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
    uint index = 0;
    address[] public totalAccounts;
    uint indexPaticipant = 0;
    
    modifier checkStatus(StatusSesstion _statusSesstion, uint _IdItem){
        require(itemsList[_IdItem].statusSesstion == _statusSesstion, "Wrong status of sesstion");
        _;
    }
    
    function addItems(string memory _nameItem, uint _firstPrice, uint _timeFinishSesstionEachOtherproduct) public onlyAdmin{
        uint[] memory emptyArray;
        address[] memory amptyAddressArray;
        itemsList.push(Items(index, _nameItem, _firstPrice, 0, emptyArray, emptyArray, 0, amptyAddressArray, StatusSesstion.START, 0, _timeFinishSesstionEachOtherproduct));
        index++;
    }

    function startSesstion(uint _IdItem) public onlyAdmin {
        itemsList[_IdItem].statusSesstion = StatusSesstion.PRICING;
        itemsList[_IdItem].timeSesstionEachOtherproduct = block.timestamp;
    }

    function stopSesstion(uint _IdItem) public onlyAdmin{
        itemsList[_IdItem].statusSesstion = StatusSesstion.DONE;
    }

    function register(address _address) public onlyAdmin(){
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