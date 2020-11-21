pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;
contract ECMR {

    // initialization of the ECMR 
    address  consigneeID;
    int  consigneeLat;
    int  consigneeLng;
    
    address  consignorID;
    int  consignorLat;
    int  consignorLng;

    address  carrierID;
    int  carrierLat;
    int  carrierLng;

    int  shipFromLat;
    int  shipFromLng;

    int  shipToLat;
    int  shipToLng;

    string  nature;
    uint  quantity;
    uint  grossWeight;
    uint  grossVolume;

    uint  issuanceDate;
    uint  takeoverDate;

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
    
    
    function getTenants() public view returns (address, int, int, address, int, int, address, int, int){
        return (consigneeID, consigneeLat, consigneeLng, 
                consignorID, consignorLat, consignorLng,
                carrierID, carrierLat, carrierLng);
    }
    
    function getCommand() public view returns (int, int, int, int, string memory, uint, uint, uint, string[] memory, uint, uint){
        return (shipFromLat, shipFromLng, shipToLat, shipToLng, 
                nature, quantity, grossWeight, grossVolume,
                comments, issuanceDate, takeoverDate);
    }


    function initializeTenants(address _consigneeID, int _consigneeLat, int _consigneeLng,
                                address _consignorID, int _consignorLat, int _consignorLng,
                                address _carrierID, int _carrierLat, int _carrierLng) public payable {
                                    
        consigneeID = _consigneeID;
        consigneeLat = _consigneeLat;
        consigneeLng = _consigneeLng;
        
        consignorID = _consignorID;
        consignorLat = _consignorLat;
        consigneeLng = _consignorLng;
        
        carrierID = _carrierID;
        carrierLat = _carrierLat;
        carrierLng = _carrierLng;
        
                                    
        status.push(append(uint2str(now), 'initializedTenants', '', '', ''));
    }
    
    function initializeCommand( int _shipFromLat, int _shipFromLng, int _shipToLat, int _shipToLng,
                                string memory _nature, uint _quantity, uint _grossWeight, uint _grossVolume,
                                string memory _newComment, uint _takeoverDate
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
        
        comments.push('[INFO] Initialization.');
        
        if(bytes(_newComment).length != bytes('').length) {
            comments.push(_newComment);
        } 

        issuanceDate = now;

        status.push(append(uint2str(issuanceDate), 'initializedCommand', '', '', ''));

    }
    

    function addComment(string memory _newComment) public payable {
        comments.push(_newComment);
    }
    
    function getStatus() public view returns (string[] memory) {
     return status;   
    }


}