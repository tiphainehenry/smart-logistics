pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;
contract ECMR {

    // initialization of the ECMR 
    address  consigneeID;
    string  consigneeLat;
    string  consigneeLng;
    
    address  consignorID;
    string  consignorLat;
    string  consignorLng;

    address  carrierID;
    string  carrierLat;
    string  carrierLng;

    string  shipFromLat;
    string  shipFromLng;

    string  shipToLat;
    string  shipToLng;

    string  nature;
    uint  quantity;
    uint  grossWeight;
    uint  grossVolume;

    string  issuanceDate;
    string  takeoverDate;

    string[] comments;

    string[] status;
    
    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        while (_i != 0) {
            bstr[k--] = byte(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }
    
    function append(string memory a, string memory b, string memory c, string memory d, string memory e) internal pure returns (string memory) {
        return string(abi.encodePacked(a, b, c, d, e));
    }
    
    
    function getTenants() public view returns (address, string memory, string memory, address, string memory, string memory, address, string memory, string memory){
        return (consigneeID, consigneeLat, consigneeLng, 
                consignorID, consignorLat, consignorLng,
                carrierID, carrierLat, carrierLng);
    }
    
    function getCommand() public view returns (string memory, string memory, string memory, string memory, string memory, uint, uint, uint, string[] memory, string memory, string memory){
        return (shipFromLat, shipFromLng, shipToLat, shipToLng, 
                nature, quantity, grossWeight, grossVolume,
                comments, issuanceDate, takeoverDate);
    }


    function initializeTenants(address _consigneeID, string memory _consigneeLat, string memory _consigneeLng,
                                address _consignorID, string memory _consignorLat, string memory _consignorLng,
                                address _carrierID, string memory _carrierLat, string memory _carrierLng, string memory _issuanceDate) public payable {
                                    
        consigneeID = _consigneeID;
        consigneeLat = _consigneeLat;
        consigneeLng = _consigneeLng;
        
        consignorID = _consignorID;
        consignorLat = _consignorLat;
        consignorLng = _consignorLng;
        
        carrierID = _carrierID;
        carrierLat = _carrierLat;
        carrierLng = _carrierLng;
        
                                    
        status.push(append(_issuanceDate, ': initializedTenants', '', '', ''));
    }
    
    function initializeCommand( string memory _shipFromLat, string memory _shipFromLng, string memory _shipToLat, string memory _shipToLng,
                                string memory _nature, uint _quantity, uint _grossWeight, uint _grossVolume,
                                string memory _newComment, string memory _takeoverDate, string memory _issuanceDate
                                ) public payable {
                                    
        shipFromLat = _shipFromLat;
        shipFromLng = _shipFromLng;
        shipToLat = _shipToLat;
        shipToLng = _shipToLng;
        
        nature =_nature;
        quantity = _quantity;
        grossWeight =_grossWeight;
        grossVolume = _grossVolume;

        takeoverDate = _takeoverDate;
        issuanceDate = _issuanceDate;
        
        if(bytes(_newComment).length != bytes('').length) {
            comments.push(_newComment);
        } 

        issuanceDate = _issuanceDate;

        status.push(append(_issuanceDate, ': initializedCommand', '', '', ''));

    }
    

    function addComment(string memory _newComment) public payable {
        comments.push(_newComment);
    }
    
    function getStatus() public view returns (string[] memory) {
     return status;   
    }


}