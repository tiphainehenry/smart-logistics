pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;


contract Hire {

    // initialization of the ECMR 

    struct Tenants {
        address consignee;
        address consignor;
    }

    struct Service {
        string shipFrom;
        string shipTo;
        
        string  takeoverDate;
    }
    
    struct Merchandise {
        string nature;
        uint  quantity;
        uint  grossWeight;
        uint  grossVolume;
    }

    string  issuanceDate;
    string[] comments;
    string[] status;
    
    Tenants tenants;
    Service service;
    Merchandise merchandise;

    struct Aggreement {
        string issuance;
        Tenants ppl;
        Service srv;
        Merchandise mrch;
        string[] cmmts;
        string status;
    }

    Aggreement[] public aggreements;
    
    
    event NewAggreement(string message);


    //////// DB Manager

    function addAggreement (address[2] memory _ppl, string memory _issuanceDate, string[3] memory _shipInfo, string memory _nature, uint[3] memory _details) public payable{
        tenants.consignee = _ppl[0];
        tenants.consignor = _ppl[1];
        
        issuanceDate = _issuanceDate;

        service.shipFrom = _shipInfo[0];
        service.shipTo = _shipInfo[1]; 
        service.takeoverDate = _shipInfo[2];
        
        merchandise.nature =_nature;
        merchandise.quantity = _details[0];
        merchandise.grossWeight =_details[1];
        merchandise.grossVolume = _details[2];

        status.push('setCommand');


        Aggreement memory newAggreement = Aggreement(issuanceDate, tenants, service, merchandise, comments, 'Aggreement set');
        aggreements.push(newAggreement);
        

        emit NewAggreement('new aggreement published');
        
    }
     
    function totalAggreements() public view returns (uint)  {
        return aggreements.length;
    }
     
    function seeAggreement(uint i) public view returns (Aggreement memory)  {
        return aggreements[i];
    }

    
    
    ///// Misc
    
    /////function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
    /////    if (_i == 0) {
    /////        return "0";
    /////    }
    /////    uint j = _i;
    /////    uint len;
    /////    while (j != 0) {
    /////        len++;
    /////        j /= 10;
    /////    }
    /////    bytes memory bstr = new bytes(len);
    /////    uint k = len - 1;
    /////    while (_i != 0) {
    /////        bstr[k--] = byte(uint8(48 + _i % 10));
    /////        _i /= 10;
    /////    }
    /////    return string(bstr);
    /////}
    
    /////function append(string memory a, string memory b, string memory c, string memory d, string memory e) internal pure returns (string memory) {
    /////    return string(abi.encodePacked(a, b, c, d, e));
    /////}


    
    ///// getters
    
    /////function getTenants() public view returns (Tenants memory){
    /////    return tenants;
    /////}
    
    /////function getMerchandise() public view returns (Merchandise memory){
    /////    return merchandise;
    /////}

    /////function getService() public view returns (Service memory){
    /////    return service;
    /////}


    ///// setters

    /////function setTenants(address[3] memory _ppl, string memory _issuanceDate) public payable {
        
    /////    tenants.consignee = _ppl[0];
    /////    tenants.consignor = _ppl[1];
    /////    tenants.carrier = _ppl[2];
        
    /////    issuanceDate = _issuanceDate;
                                    
    /////    status.push('setTenants');
        
    /////}

    /////function setService(string[3] memory _shipInfo) public payable {
                                    
    /////    service.shipFrom = _shipInfo[0];
    /////    service.shipTo = _shipInfo[1]; 
    /////    service.takeoverDate = _shipInfo[2];
        
    /////    status.push('setService');

    /////}
    
    /////function setMerchandise( string memory _nature, uint[3] memory _details) public payable {
                                    
    /////    merchandise.nature =_nature;
    /////    merchandise.quantity = _details[0];
    /////    merchandise.grossWeight =_details[1];
    /////    merchandise.grossVolume = _details[2];

    /////    status.push('setCommand');

    /////}
    

    /////function addComment(string memory _newComment) public payable {
    /////    comments.push(_newComment);
    /////}
    
    /////function getStatus() public view returns (string[] memory) {
    /////    return status;   
    /////}


}