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
    string[] public listNameOfItems;
    string[] public listHashImage;
    string[] public listInformationOfImage;
    uint[] public listPrice;
   
    constructor(){
        admin = msg.sender;
        listNameOfItems.push("Samsung Galaxy Note20 ");
        listNameOfItems.push("Samsung ZFlip3");
        listNameOfItems.push("Asus Rog Phone");
        listNameOfItems.push("Galaxy ZFold3");
        listNameOfItems.push("Iphone 12 Pro Max");
        listNameOfItems.push("Iphone 13 Pro Max");
        listHashImage.push("QmNqVYtH4mXG69LnAYE4xy1hgff1ZkYBtvVcCDyA4RPi6i");
        listHashImage.push("Qmd63ELkZg7FzKBM3Qc67wPvnJ2Q8kgRiYm9cBgFPWRmMk");
        listHashImage.push("QmTp68sD8eAXSPFaoZpqS6bvbxHFpG8AAELX1J7Tf8Ceri");
        listHashImage.push("QmaGjnpC3sXekQon8V62nZFz5oKuB1gpyJaMuJtCC4N7f8");
        listHashImage.push("QmXeY57QfXDnytL7PUAAynrtTVfuBHEYaXWxX4jFFAyLyd");
        listHashImage.push("QmcrrFf78e1emiSgCe3U9QEC4Qs7JqBT4LJtyvM53c58mJ");
        listInformationOfImage.push("Luxury, high-class - Unique and attractive colors.<br/>Take professional photos - Set of 3 cameras that support Zoom as far as 30X.<br/>Take notes quickly and accurately with the new generation S-Pen.<br/>Ultimate gaming - Powerful 7nm Exynos 990, outstanding processing performance.<br/>Samsung Note 20 Ultra 5G phone - Luxury, outstanding performance.<br/>Monolithic aluminum frame design, luxurious tempered glass back.");
        listInformationOfImage.push("Unique folding screen, seamless display - Dynamic AMOLED 2X, 120Hz refresh rate, HDR support, Dolby Vision. </br>Unique folding screen, seamless display - Dynamic AMOLED 2X, 120Hz refresh rate, HDR support, Dolby Vision.</br>Super impressive camera system - Set of 3 12MP camera lenses, sharp selfie camera.</br>Impressive performance, master the speed - Snapdragon 888 combined with 8GB RAM, 5G support.</br>Samsung Galaxy Z Flip 3 (5G) Unique folding screen phone.<br>Characteristic design, pioneering flexible screen</br>");
        listInformationOfImage.push("Break all the limits of performance - high-end Snapdragon 865+, 5G connectivity, 12GB RAM.<br/>Standard gaming screen - AMOLED panel, high refresh rate 144Hz, HDR10+.<br/>Play games without interruption - 6000mAh battery, custom battery mode</br>Gamer features - AirTrigger 5 multi-touch, quality dual speakers. </br>Review Asus ROG Phone 5(16GB/256GB) - Unrivaled performance.</br>.Bold design, sharp 6.78-inch FHD+ screen<br>");
        listInformationOfImage.push("Impressive dual screen - 7.9 main screen and sub screen: 6.23, 120Hz smooth motion <br/>Super impressive camera system - Set of 3 12MP camera lenses, selfie camera hidden under the screen</br>Impressive performance, master the speed - Snapdragon 888 combined with 12GB RAM, 5G support.</br>Super photography - Night Mode , Deep Fusion algorithm, Smart HDR 3, LiDar camera.<br>Durable. outstanding - IP68 waterproof, dustproof, Ceramic Shield back</br> Massive memory for unlimited storage space.");
        listInformationOfImage.push("Powerful, super-fast with A14 chip, 6GB RAM, high-speed 5G network <br/>Brilliant, sharp, high brightness - Premium OLED display <br/>Super Retina XDR with HDR10 support, Dolby Vision</br>Outstanding durability - IP68 water and dust resistance, Ceramic Shield back.</br>iPhone 12 Pro Max: Raise the level of use.</br> 6.7 inch Super Retina XDR screen");
        listInformationOfImage.push("Vibrant display space 6.1 Super Retina XDR display with high brightness and sharpnessThe ultimate cinematic experience <br/> 12MP dual cameras with optical image stabilization</br>Outstanding performance - Powerful Apple A15 Bionic chip, support for high-speed 5G networks.</br>Vivid display space - 6.7 Super Retina XDR screen with high brightness and sharpness.</br>Experience Ultimate cinematic experience - Cluster of 3 dual 12MP cameras, supporting optical image stabilization.</br>Power optimization - 20 W fast charging, 50% battery full in about 30 minutes");
        listPrice.push(930);
        listPrice.push(1740);
        listPrice.push(790);
        listPrice.push(1290);
        listPrice.push(986);
        listPrice.push(748);
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