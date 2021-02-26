pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;


//import "./Sort.sol";
//import "./ProvableAPI_0.5.sol";

//import "github.com/provable-things/ethereum-api/provableAPI_0.5.sol";


/**
 * @title Elect
 * 
 * 
 * Smart contract to elect a profile based on a set of objective criteria, and a QoS. 
 */


contract ElectOptim {
    
    uint[] filter;
    
    string filteredIds;
    
    enum AvailabiltyState{ONEDAY, SEVERALDAYS}
    AvailabiltyState avState;

    struct Date { 
      uint day;
      uint month;
      uint year;
   }

    
    struct Candidate{
        address delegate;
        Date startAvailability;
        Date endAvailability;
        uint[] filterAttributes;
        uint[] optimAttributes;
    }
        bool matchExists = false;
    string bestProfiles;

    //string alphas; 
    event BestCandidates(
        string ExistCandidates,
        string profiles  
    );
    
    enum TestOutput{NO,YES}
    TestOutput output;


   //string public qosList_string;
   event LogConstructorInitiated(string nextStep);
   event LogQoSCompute(string qosList);
   event LogNewProvableQuery(string description);
   

    
    //// resource database initialisation
    Date av1 = Date(12,6,21);
    Date av2 = Date(13,6,21);
    Date av3 = Date(12,8,21);
    
    uint[] f1 = [0,0,0];
    uint[] f2 = [0,0,1];
    uint[] f3 = [0,1,1];
    uint[] f4 = [1,1,1];
    uint[] f5 = [1,0,0];
    uint[] f6 = [1,1,0];

    uint[] o1 = [10,5];
    uint[] o2 = [2,8];
    uint[] o3 = [0,1];
    uint[] o4 = [10,9];
    uint[] o5 = [8,9];
    uint[] o6 = [6,4];


    Candidate cd1 = Candidate(0x1ED034135e576A6c1bf3ee8E05aaDEEF24D4A819, av1, av1, f1, o1);
    Candidate cd2 = Candidate(0x5AfBDd0e5DE3315a96504C06ac49bF34B5ECACB5, av1, av3, f2, o2);
    Candidate cd3 = Candidate(0xC9f167B5056B03eB29963aB8e6F78bB12Cf5BA17, av1, av2, f3, o3);
    Candidate cd4 = Candidate(0x2a706c6006e33610D92ea2a440Cc99d5b58353E1, av1, av1, f4, o4);
    Candidate cd5 = Candidate(0xbb4599DfEe75aD4aEA70048B8b1023543b5293f0, av2, av2, f5, o5);
    Candidate cd6 = Candidate(0xc8F9bFA65B300F7FE952d1F690C1A77900103Ccf, av1, av2, f6, o6);
    Candidate cd7 = Candidate(0x7eb6C31971392503F3e6CdB21DEaB903216A408c, av3, av3, f5, o5);
    Candidate cd8 = Candidate(0x414Ad21d20CaC5940c6A59F422a237247a0E095f, av1, av2, f4, o4);
    Candidate cd9 = Candidate(0x06730390c9f64b01e92e4653617671ec060EcA24, av1, av2, f3, o3);
    Candidate cd10 = Candidate(0x81C4ddfC31001AEfAe5cc1Ea396fa5138CbAA42b, av1, av3, f2, o2);
    
    
    Candidate[] candidates;

    function test() public {
        candidates.length++;
        Candidate storage p = candidates[candidates.length - 1];

        //p.push(cd1);
    }



    // = [cd1,cd2,cd3,cd4,cd5,cd6,cd7,cd8,cd9,cd10]; 
    
    function getfilter() public view returns(uint[] memory){
        return filter;
    }

    //function getCandidates() public view returns(uint[][] memory){
    //    return candidates;
    //}
    
    
    ///// FILTER /////

    function oneDayAvailability(Date memory ASDate, Date memory AEDate, uint[] memory _availability) public payable returns(uint){
        Date memory RSDate = Date(_availability[0],_availability[1],_availability[2]); // required start

        output = TestOutput.YES;


        if((RSDate.month==ASDate.month) && (RSDate.year==ASDate.year)){ // same month, same year
            if((ASDate.day > RSDate.day)||(AEDate.day<RSDate.day)){ // person is booked
                output = TestOutput.NO;
                }
            }
        else if((RSDate.month!=ASDate.month) && (RSDate.year==ASDate.year)){ //same year, different month
            if(!((ASDate.month < RSDate.month) && (ASDate.day < RSDate.day)) || (AEDate.month<RSDate.month)){ // person is booked
                output = TestOutput.NO;
            }
        }
        else{ //different year
            if(!(RSDate.year>ASDate.year)||(AEDate.year<RSDate.year)){ // person is booked
                output = TestOutput.NO;
            }
        }
        return uint(output);
    }


    function severalDaysAvailability(Date memory ASDate, Date memory AEDate, uint[] memory _availability) public payable returns(uint){
        
        Date memory RSDate = Date(_availability[0],_availability[1],_availability[2]); // required start
        Date memory REDate = Date(_availability[3],_availability[4],_availability[5]); // required end

        output = TestOutput.YES;
        
        require(REDate.day>RSDate.day);

        if((RSDate.month==ASDate.month) && (RSDate.year==ASDate.year) && (REDate.year==AEDate.year)){ // same start month, same year
            if((ASDate.day > RSDate.day)||(AEDate.day<REDate.day)){ // person is booked
                output = TestOutput.NO;
                }
        }
        else if((RSDate.month!=ASDate.month) && (RSDate.year==ASDate.year) &&  (REDate.year==AEDate.year)){ //same year, different month
            if(!((ASDate.month < RSDate.month) && (ASDate.day < RSDate.day)) || (AEDate.month<RSDate.month) || (AEDate.month<REDate.month)){ // person is booked
                output = TestOutput.NO;                }
            }
        else{ //different year
            if(!(RSDate.year>ASDate.year)||(AEDate.year<RSDate.year)||(AEDate.year<REDate.year)){ // person is booked
                output = TestOutput.NO;            }
        }
        
        return uint(output);
    }
    
    
        function filterScan(uint[] memory attributes, uint[] memory availability) public payable returns (uint[] memory){
        // SET CLEAN FILTERING VARIABLES
        uint[] memory _filter = new uint[](candidates.length);
        for(uint i=0; i<candidates.length;i++){
            _filter[i]=0;
        }
        matchExists=false;

        // FILTER - TEST ALL CANDIDATES
        for(uint ind=0; ind<candidates.length; ind++){
            Candidate storage candidate = candidates[ind];
    
            // CHECK ATTRIBUTES
            bool matchOnAttributes = true;
            uint index=0;
            uint filterMaxInd = attributes.length;

            for(uint id_att=0; id_att<filterMaxInd; id_att++){
                if((attributes[index]==1) && (candidate.filterAttributes[id_att]!=1)){
                        matchOnAttributes=false;
                }
                index++;
            }

            // CHECK AVAILABILITY
            if(matchOnAttributes){
                if((availability.length==3)||
                    ((availability[0]==availability[3])&&(availability[1]==availability[4])&&(availability[2]==availability[5]))){ // ask for a day booking
                    avState = AvailabiltyState.ONEDAY;
                    _filter[ind]=oneDayAvailability(candidate.startAvailability,candidate.endAvailability, availability);
                }
                else{ 
                    //availability.length==6, ask for a several-days booking 
                    avState = AvailabiltyState.SEVERALDAYS;
                    _filter[ind]=severalDaysAvailability(candidate.startAvailability,candidate.endAvailability, availability);
                }

                if(_filter[ind] == 1){
                    matchExists=true;
                }
            }
        }
        
        filter = _filter;

        return filter;
    }


    ///// Provable test
    
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

    function list2string(uint[] memory list) public payable returns(string memory) {
             
                string memory str_list = "[";
                for(uint j=0;j<list.length-1;j++){    
                    str_list = string(abi.encodePacked(str_list, uint2str(list[j]), ","));
                }
                str_list = string(abi.encodePacked(str_list,uint2str(list[list.length-1]), "]"));
                return str_list;
    }


    function computeOptim2Str(uint num_param) public payable returns(string memory) {
                string memory str_matrix = "[";
                uint ind_param = candidates[0].optimAttributes.length;
                
                for(uint i=0;i<candidates.length-1;i++){ // for each candidate, compute str 
                    str_matrix = string(abi.encodePacked(str_matrix, list2string(candidates[i].optimAttributes), ","));
                }

                str_matrix = string(abi.encodePacked(str_matrix, list2string(candidates[candidates.length-1].optimAttributes), "]"));
                            
                return str_matrix;

    }


    //    function ProvableContract() public payable {
    //        OAR = OracleAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
    //        emit LogConstructorInitiated("Constructor was initiated. Call 'QoSOracle()' to send the Provable Query.");
    //    }
    

    function __callback(bytes32 myid, string memory result) public {
    //    if (msg.sender != provable_cbAddress()) revert();
        
        bestProfiles=result;

        // emit event
        emit BestCandidates(
            'Matching',
            bestProfiles
        );

    }


    function sort(uint[] memory attributes, uint[] memory availability, string memory alphas, uint num_alphas) public payable{

        filter = filterScan(attributes, availability);
        
        if(matchExists){
            /// compute qos via oracle
           // if (provable_getPrice("URL") > address(this).balance) {
            //    emit LogNewProvableQuery("Provable query was NOT sent, please add some ETH to cover for the query fee");
            //} else {
                emit LogNewProvableQuery("Provable query was sent, standing by for the answer..");
                string memory str_optim = computeOptim2Str(num_alphas);
                string memory str_filter = list2string(filter);
                string memory url= string(abi.encodePacked("https://qosapi.herokuapp.com/api/qos?matrix=", str_optim, "&alpha=[", alphas,"]", "&filter=", str_filter));
                //provable_query("URL",url);
            //}
        }

        else{
            emit BestCandidates('No matching found', '');
        }
    }
    
    
    // delivery update
    //function updateQoS(uint input) public payable returns (uint){
    //    n = n+1;
    //    uint mulFact = 100; // avoid floating points

    //    if(n==1){
    //        QoS = input;
    //    }
    //    else{
    //    uint K = div(mul(2,mulFact),n); 
    //    uint newQoS = mul(K, input) + mul(mulFact,QoS) - mul(K, QoS);
        
    //    QoS = div(newQoS, 100);
    //    }
        
    //    return QoS;
    //}
    
}