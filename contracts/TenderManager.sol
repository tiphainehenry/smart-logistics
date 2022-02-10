pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

import "./ElectToolbox.sol";
import "./ProvableAPI_0.5.sol";


contract TenderManager is usingProvable {
    enum State {CLOSED, OPEN, PENDING, FINISHED}

    string OracleRSAPubKey;

    struct OfferList {
        string c_key; //RSA_of_AESkey
        string c_offer; //AES_of_FHE_of_Offer
        address respondent;
    }
    
    struct Tender {
        string RSAPubKey; //From Oracle
        string offers;
        address[] addresses;
 
        //OfferList[] offerList;
        State state;
        bool isExisting;
    }

    string bestAlloc;
    mapping(string => Tender) public Tenders;
    string[] tenderList;

    
    event LogBestAlloc(string result);
    event LogNewProvableQuery(string description);

    constructor() public payable {
        // ...
    }


    function getTenders() public view returns (string[] memory){
        return tenderList;
    }

    function getRSApk() public view returns (string memory){
        return OracleRSAPubKey;
    }

    function getURLTest(string memory tenderName) public view returns (string memory){
        string memory tmp_offers = getOffers(tenderName);
        string memory url = append("https://qosapi.herokuapp.com/api/FHEcomp?offers=",
                            tmp_offers,"","","");

        return url;
    }


    function setRSApk(string memory _RSApk) public payable returns (string memory) {
        OracleRSAPubKey=_RSApk;
        return OracleRSAPubKey;
    }

    
    function append(string memory a, string memory b, string memory c, string memory d, string memory e) internal pure returns (string memory) {
        return string(abi.encodePacked(a, b, c, d, e));
    }

    function isExisting(string memory tenderName) public view returns(bool doesIndeed) {
        return Tenders[tenderName].isExisting;
    }
    
    function newTender(string memory tenderName) public payable returns (string memory rowNumber) {
        if (isExisting(tenderName)) revert();
        address[] memory tmpList = new address[](0);
        Tender memory tempStruct = Tender(OracleRSAPubKey, '', tmpList, State.OPEN, true);
        Tenders[tenderName] = tempStruct;
        tenderList.push(tenderName);
    }
    
    function newOffer(string memory tenderName, string memory c_key, string memory c_offer) public payable {
        if (!isExisting(tenderName)) revert();

        //require(msg.sender==tenderName);
        //OfferList memory tempStructBis = OfferList(c_key, c_offer, tenderName); 
        Tenders[tenderName].addresses.push(msg.sender);

        string memory tempStruct = append("{c_key:",c_key,",c_offer:",c_offer,"},");
        Tenders[tenderName].offers= append(Tenders[tenderName].offers,tempStruct,"","","");
        //Tenders[tenderName].offerList.push(tempStructBis);

    }

    /// @notice Callback function. Emits to the user the best profiles retrieved based on the QoS computation.
    /// @dev This function is triggered by the oracle.
    /// @param myid The binary array of required attributes (set of filtering criteria)
    /// @param result best profiles retrieved by the oracle.
    function __callback(bytes32 myid, string memory result) public {
        if (msg.sender != provable_cbAddress()) revert();

        bestAlloc = result;

        emit LogBestAlloc(bestAlloc);
    }

    function getOffers(string memory _tenderName) public view returns (string memory offers){
        return Tenders[_tenderName].offers;
    }

    function askOracleComparison(string memory tenderName) public payable returns (string memory result){
        // send oracle request for comparison

            /// compute qos via oracle
            //if (provable_getPrice("URL") > address(this).balance) {
            //    emit LogNewProvableQuery(
            //        "Provable query was NOT sent, please add some ETH to cover for the query fee"
            //    );
            //} else {
                emit LogNewProvableQuery(
                    "Provable query was sent, standing by for the answer.."
                );

                string memory tmp_offers = getOffers(tenderName);
                //string memory str_offers = ElectToolbox.list2string(tmp_offers);

                //string memory str_offers = ElectToolbox.list2string(Tenders[tenderName].offers);
                string memory url = append("https://qosapi.herokuapp.com/api/FHEcomp?offers=",
                            tmp_offers,"","","");
                provable_query("URL", url);
            //}


        return "200";
    }


}