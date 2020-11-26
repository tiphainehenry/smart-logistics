pragma solidity ^0.5.0;

contract DeliveryContract {
    uint private issuanceDate;
    uint private takeoverDate;
    address private carrierAddress;
    address private shipperAddress;
    string private nature;
    uint private quantity;
    uint private grossWeight;
    uint private grossVolume;
    string private takeoverAddress;
    string private deliveryAddress;

    function getDeliveryContract() public view returns (uint,
                                                        uint,
                                                        address,
                                                        address,
                                                        string memory,
                                                        uint,
                                                        uint,
                                                        uint,
                                                        string memory,
                                                        string memory) {
        return (issuanceDate,
                takeoverDate,
                carrierAddress,
                shipperAddress,
                nature,
                quantity,
                grossWeight,
                grossVolume,
                takeoverAddress,
                deliveryAddress);
    }

    function setDeliveryContract(uint _issuanceDate,
                                 uint _takeoverDate,
                                 address _carrierAddress,
                                 address _shipperAddress,
                                 string memory _nature,
                                 uint _quantity,
                                 uint _grossWeight,
                                 uint _grossVolume,
                                 string memory _takeoverAddress,
                                 string memory _deliveryAddress) public {
        issuanceDate = _issuanceDate;
        takeoverDate = _takeoverDate;
        carrierAddress = _carrierAddress;
        shipperAddress = _shipperAddress;
        nature = _nature;
        quantity = _quantity;
        grossWeight = _grossWeight;
        grossVolume = _grossVolume;
        takeoverAddress = _takeoverAddress;
        deliveryAddress = _deliveryAddress;
    }
}
