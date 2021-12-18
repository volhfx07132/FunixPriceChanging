pragma solidity >=0.4.0 <0.9.0;
contract Main{
    struct DataChange{
        uint IdItem;
        uint priceDeviation;
        uint valueChangePricingOtherPaticipant;
        uint numberChangePricingOtherPaticipant;
    }

    struct Paticipant{
        uint IDPaticipant;
        address addressAccount;
        string fullName;
        string email;
        uint countPricedSesstion; 
        DataChange[] listDataChange;
    }
    address public admin;
    bool status = false;
    enum StatusSesstion {START, PRICING, DONE}
    string[] public listNameOfItems = new string[](10);
    string[] public listHashImage = new string[](10);
    string[] public listInformationOfImage = new string[](10);
    uint[] public listPrice = new uint[](10);

    constructor(){
        admin = msg.sender;
        listNameOfItems.push("Samsung Galaxy Note20 ");
        listNameOfItems.push("Samsung ZFlip3");
        listNameOfItems.push("Asus Rog Phone");
        listNameOfItems.push("Galaxy ZFold3");
        listNameOfItems.push("Iphone 12 Pro Max");
        // listNameOfItems.push("Iphone 15 Pro");
        // listNameOfItems.push("Oneplus-8T");
        // listNameOfItems.push("Red Magic");
        // listNameOfItems.push("Xiaomi Mi-11");
        // listNameOfItems.push("Zte Nubia Red Magic");
        listHashImage.push("QmNqVYtH4mXG69LnAYE4xy1hgff1ZkYBtvVcCDyA4RPi6i");
        listHashImage.push("Qmd63ELkZg7FzKBM3Qc67wPvnJ2Q8kgRiYm9cBgFPWRmMk");
        listHashImage.push("QmTp68sD8eAXSPFaoZpqS6bvbxHFpG8AAELX1J7Tf8Ceri");
        listHashImage.push("QmaGjnpC3sXekQon8V62nZFz5oKuB1gpyJaMuJtCC4N7f8");
        listHashImage.push("QmXeY57QfXDnytL7PUAAynrtTVfuBHEYaXWxX4jFFAyLyd");
        // listHashImage.push("QmcrrFf78e1emiSgCe3U9QEC4Qs7JqBT4LJtyvM53c58mJ");
        // listHashImage.push("QmdMz1RrsPh1B15HMFRVHXmaq8vMbKZrKt5eeEz3ypg9g2");
        // listHashImage.push("Qmako3qesiYwjfQAuKKJ356cRP1bjsKAx3RjTVWeidgEZd");
        // listHashImage.push("Qmc5NiYcSnTqpcMs7Vi5YrnWX8dk2vs9RYWwQ6DG4X7ak5");
        // listHashImage.push("QmUZWp9kb9bP7YQGAuyaLRnJfoPPEM74nwWmmwjog25Vcz");
        listInformationOfImage.push("Luxury, high-class - Unique and attractive colors <br/>Take professional photos - Set of 3 cameras that support Zoom up to 30X <br/>Take quick, accurate notes with the new generation S-Pen");
        listInformationOfImage.push("Unique folding screen, seamless display - Dynamic AMOLED 2X, 120Hz refresh rate, HDR support, Dolby Vision. <br/>Unique folding screen, seamless display - Dynamic AMOLED 2X, 120Hz refresh rate, HDR support, Dolby Vision.");
        listInformationOfImage.push("Break all the limits of performance - high-end Snapdragon 865+, 5G connectivity, 12GB RAM <br/>Standard gaming screen - AMOLED panel, high refresh rate 144Hz, HDR10+<br/>Play games without interruption - 6000mAh battery, custom battery mode");
        listInformationOfImage.push("Impressive dual screen - 7.9 main screen and sub screen: 6.23, 120Hz smooth motion <br/>Super impressive camera system - Set of 3 12MP camera lenses, selfie camera hidden under the screen");
        listInformationOfImage.push("Powerful, super-fast with A14 chip, 6GB RAM, high-speed 5G network <br/>Brilliant, sharp, high brightness - Premium OLED display <br/>Super Retina XDR with HDR10 support, Dolby Vision");
        // listInformationOfImage.push("Vibrant display space <br/>6.1 Super Retina XDR display with high brightness and sharpness <br/>The ultimate cinematic experience <br/> 12MP dual cameras with optical image stabilization");
        // listInformationOfImage.push("Outstanding performance <br/>Powerful Apple A15 Bionic chip<br/>supports high-speed 5G network");
        // listInformationOfImage.push("Experience the perfect, smooth edge-to-edge screen - 6.67 inches, 144Hz AMOLED display<br/>Capturing every moment fully - 64MP + 8MP + 5MP + 2MP quality rear camera cluster");
        // listInformationOfImage.push("Strong and stable performance - Snapdragon 780G chip on 5nm, 128GB of memory and 8GB of RAM<br/>Impressive photography camera - Cluster of 3 64MP rear cameras, clear night photography");
        // listInformationOfImage.push("Fight games without worrying about running out of battery <br/>5050 mAh battery<br/>30W fast charging, up to 65W charging support");
        listPrice.push(930);
        listPrice.push(1740);
        listPrice.push(790);
        listPrice.push(1290);
        listPrice.push(986);
        // listPrice.push(748);
        // listPrice.push(1490);
        // listPrice.push(620);
        // listPrice.push(348);
        // listPrice.push(728);
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