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

    Aggreement[] aggreements;
    
    //string public contractState;
    
    event NewAggreement(string message);
    event Request(address sender, address consignee, address consignor);
    

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
     
    function getSender() public view returns(address){
        return msg.sender;
    }
     
    function seeAggreement(uint i, address sender) public view returns (address[2] memory _ppl, string memory _issuanceDate, string[3] memory _shipInfo, string memory _nature, uint[3] memory _details, string memory _status) {

        //emit Request(msg.sender, aggreements[i].ppl.consignee, aggreements[i].ppl.consignor);

        if(aggreements[i].ppl.consignee == sender){
        //    contractState =  "consignee";
            return ([aggreements[i].ppl.consignee, aggreements[i].ppl.consignor], aggreements[i].issuance, 
                    [aggreements[i].srv.shipFrom, aggreements[i].srv.shipTo, aggreements[i].srv.takeoverDate],
                    aggreements[i].mrch.nature,  [aggreements[i].mrch.quantity, aggreements[i].mrch.grossWeight,aggreements[i].mrch.grossVolume],
                    aggreements[i].status
            );
        } 
        else if(aggreements[i].ppl.consignor == sender){
        //    contractState = "consignor";
        
        ([aggreements[i].ppl.consignee, aggreements[i].ppl.consignor], aggreements[i].issuance, 
                    [aggreements[i].srv.shipFrom, aggreements[i].srv.shipTo, aggreements[i].srv.takeoverDate],
                    aggreements[i].mrch.nature,  [aggreements[i].mrch.quantity, aggreements[i].mrch.grossWeight,aggreements[i].mrch.grossVolume],
                    aggreements[i].status
            );
        }
        else{
            Tenants memory fakeTenants = Tenants(address(0),address(0));
            Service memory fakeService = Service('','','');
            Merchandise memory fakeMerchandise = Merchandise('',0,0,0);
            string[] memory fakeComment;

            Aggreement memory fakeAggreement = Aggreement('', fakeTenants, fakeService, fakeMerchandise, fakeComment, '');
        //    contractState = "wrong address";
        
            return ([fakeAggreement.ppl.consignee, fakeAggreement.ppl.consignor], fakeAggreement.issuance, 
                    [fakeAggreement.srv.shipFrom, fakeAggreement.srv.shipTo, fakeAggreement.srv.takeoverDate],
                    fakeAggreement.mrch.nature, [fakeAggreement.mrch.quantity, fakeAggreement.mrch.grossWeight, fakeAggreement.mrch.grossVolume],
                    fakeAggreement.status
            );
            

        }
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