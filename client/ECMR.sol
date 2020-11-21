pragma solidity ^0.5.16;


contract Delivery {

    // initialization of the ECMR 
    Struct Coordinates{
        int private latitute;
        int private longitude;
    }

    Struct Shipper {
        address private shipperID;
        Coordinates shipperCoordinates;
    }

    Struct Carrier {
        address private carrierID;
        Coordinates carrierCoordinates;
        string private comments;
    }

    Carrier[] Carriers;

    Struct Consignee {
        address private consigneeID;
        Coordinates consigneeCoordinates;
    }

    Struct Issuance {
        date issuanceDdate;
        Coordinates issuanceCoordinates;
    }

    // during delivery
    Struct PickupInfo {
        Coordinates pickupCoordinates;


    }

    Struct TakeoverInfo {

    }



    uint private issuanceDate;
    uint private takeoverDate;
    string private nature;
    uint private quantity;
    uint private grossWeight;
    uint private grossVolume;
    string private deliveryAddress;

    function getDelivery() public view returns (uint,
                                                uint,
                                                address,
                                                address,
                                                string,
                                                uint,
                                                uint,
                                                uint,
                                                string,
                                                string) {
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

    function setDelivery(uint _issuanceDate,
                         uint _takeoverDate,
                         address _carrierAddress,
                         address _shipperAddress,
                         string _nature,
                         uint _quantity,
                         uint _grossWeight,
                         uint _grossVolume,
                         string _takeoverAddress,
                         string _deliveryAddress) public {
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