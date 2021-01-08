pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;


//import "./Sort.sol";

import "./SafeMath.sol";


import "./ProvableAPI_0.5.sol";

//import "github.com/provable-things/ethereum-api/provableAPI_0.5.sol";


/**
 * @title Elect
 * 
 * 
 * Smart contract to elect a profile based on a set of objective criteria, and a QoS. 
 */


contract Elect is usingProvable {
    // list of persons with attribute values:   
    // [[id, startDay, startMonth, startYear, endDay, endMonth, endYear, equipment1, equipment2, equipment3 //pickup, distance]]
    // pickup and delivery: *10E7, add a 'neg element' to string? (neg1 / neg2 --> and adapt calculus accordingly)
    
    //uint[][] candidates =[
    //                        [1, 12,5,21, 13,5,21, 1,1,1],
    //                        [2, 12,5,21, 15,5,21, 1,1,1],
    //                        [3, 12,5,21, 16,5,21, 1,1,1],
    //                        [4, 10,5,21, 14,5,21, 1,1,1],
    //                        [5, 11,5,21, 14,5,21, 1,1,1]
    //                    ];     
    //uint[] filteringAttributes = [1,1,1];    // list of filtering attributes     
    //uint[] availability = [12,1,21];
    

    uint[] filter;
    
    string filteredIds;
    
    enum AvailabiltyState{ONEDAY, SEVERALDAYS}
    AvailabiltyState avState;

    uint[] candidate;


    uint[][] candidates = [
                            [0, 12,1,21, 13,1,21, 1,1,1,10,3],
                            [1, 12,1,21, 13,1,21, 1,0,1,0,10],
                            [2, 1,1,21,  13,1,21, 1,1,1,5,10],
                            [3, 12,1,21, 13,1,21, 0,1,0,10,5],
                            [4, 12,1,21, 13,1,21, 1,0,1,10,3],
                            [5, 12,1,21, 13,1,21, 0,0,0,10,3],
                            [6, 12,1,21, 13,1,21, 0,0,0,10,3],
                            [7, 12,1,21, 13,1,21, 1,1,0,10,3],
                            [8, 12,1,21, 13,1,21, 0,1,1,10,3]
                        ];


    //uint[][] candidates;

    bool hasCandidates = false;


    uint[] normalized;
    uint[][] normalizedArray;
    uint[][] tmpNormalizedArray;
    uint[] QoSList;
    uint[] sortedQoSList;

    uint QoS;
    uint n;

    //uint K=3; num params
    string bestProfiles;

    string alphas; 

    event BestCandidates(
        string ExistCandidates,
        string profiles  
    );
    
    enum TestOutput{NO,YES}
    TestOutput output;

    struct Date { 
      uint day;
      uint month;
      uint year;
   }

   string public qosList_string;
   event LogConstructorInitiated(string nextStep);
   event LogQoSCompute(string qosList);
   event LogNewProvableQuery(string description);

    function () external payable {}

    ///// Delegated services        
    function getfilter() public view returns(uint[] memory){
        return filter;
    }

    function existsCandidates() public view returns(bool){
        return hasCandidates;
    }

    function setCandidates(uint[][] memory _candidates) public payable {
        candidates = _candidates;
    }

    function getCandidates() public view returns(uint[][] memory){
        return candidates;
    }

    function getAvailabiltyState() public view returns(AvailabiltyState){
        return avState;
    }

    function getQoSList() public view returns(uint[] memory){
        return QoSList;   
    }

    function getSortedQoS() public view returns(uint[] memory){
        return sortedQoSList;   
    }

    function getNormalized() public view returns(uint[] memory){       
        return normalized;
    }

    function getNormalizedArray() public view returns(uint[][] memory){
        return normalizedArray;
    }

    function getQoS() public view returns (uint){
        return QoS;
    }

    function getN() public view returns (uint){
        // number of services realized
        return n;
    }

    function getBestProfiles() public view returns (string memory){
        return bestProfiles;
    }



    function oneDayAvailability(uint[] memory _person, uint[] memory _availability) public payable returns(uint){
        
        
        Date memory ASDate = Date(_person[1],_person[2],_person[3]);  // available start
        Date memory AEDate = Date(_person[4],_person[5],_person[6]); //available end

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


    function severalDaysAvailability(uint[] memory _person, uint[] memory _availability) public payable returns(uint){
        
        Date memory ASDate = Date(_person[1],_person[2],_person[3]);  // available start
        Date memory AEDate = Date(_person[4],_person[5],_person[6]); //available end

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
    
    ///// Provable test

    function ProvableContract() public payable {
        OAR = OracleAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
        emit LogConstructorInitiated("Constructor was initiated. Call 'QoSOracle()' to send the Provable Query.");
    }

    function __callback(bytes32 myid, string memory result) public {
        if (msg.sender != provable_cbAddress()) revert();
        
        bestProfiles=result;

        //emit LogQoSCompute(result);

        //// get best profiles        
        //bestProfileIndexes.length=0;

        //QoSList.length=0;
        //for (uint i=0;i<input.length;i++){
        //    uint _QoS = SafeMath.mul(filter[i], input[i]);            
        //    QoSList.push(_QoS);
        //}

        // get n best ones
        //uint[] memory tmpList = new uint[](QoSList.length);
        //for (uint i=0;i<QoSList.length;i++){
        //    tmpList[i] = QoSList[i];
        //}

        //for(uint j=0;j<K;j++){
        //    uint _QoS = tmpList[0];        
        //    uint _index = 0;

        //    for (uint i=0;i<QoSList.length;i++){
        //        if(tmpList[i]>_QoS){
        //            _QoS=tmpList[i];
        //            _index = i;
        //        }
        //    }
        //    bestProfileIndexes.push([_index,_QoS]);
        //    tmpList[_index]=0;
        //}

        // emit event
        emit BestCandidates(
            'Matching',
            bestProfiles
        );


    }

    //event ToString(string result);


    function list2string(uint[] memory list) public payable returns(string memory) {
             
                string memory str_list = "[";
                for(uint j=0;j<list.length-1;j++){    
                    str_list = string(abi.encodePacked(str_list, uint2str(list[j]), ","));
                }
                str_list = string(abi.encodePacked(str_list,uint2str(list[list.length-1]), "]"));
                //emit ToString(str_list);
                return str_list;
    }


    function uintarrays2string(uint[][] memory array, uint num_param) public payable returns(string memory) {
                string memory str_matrix = "[";

                uint ind_param = array.length - num_param;

                for(uint i=0;i<array.length-1;i++){ // for each candidate, compute str 

                    uint[] memory cdd = array[i];
                    string memory str_cdd = "[";

                    for(uint j=ind_param;j<array[0].length-1;j++){    
                        str_cdd = string(abi.encodePacked(str_cdd, uint2str(cdd[j]), ","));
                    }
                    str_matrix = string(abi.encodePacked(str_matrix, str_cdd, uint2str(cdd[array[0].length-1]), "],"));

                }

                uint[] memory cdd = array[array.length-1];
                string memory str_cdd = "[";
                for(uint j=ind_param;j<array[0].length-1;j++){    
                    str_cdd = string(abi.encodePacked(str_cdd, uint2str(cdd[j]), ","));
                }
                str_matrix = string(abi.encodePacked(str_matrix, str_cdd, uint2str(cdd[array[0].length-1]), "]]"));
            
                //emit ToString(str_matrix);
                
                return str_matrix;

    }

    //////// main

    function elect(uint[] memory filteringAttributes, uint[] memory availability, string memory _alphas, uint num_alphas) public payable{
        hasCandidates=false; // reset

        alphas =_alphas;

        // proceed to filtering
        uint[] memory _filter = new uint[](candidates.length);
        // reinitialize list of candidates
        for(uint i=0; i<candidates.length;i++){
            _filter[i]=0;
        }

        for(uint ind=0; ind<candidates.length; ind++){ // test all candidates
            candidate.length = 0;

            candidate = candidates[ind];
            
            bool testOutput = true;

            // filter on  attributes
            uint index=0;

            uint filterMaxInd = 7 + filteringAttributes.length;

            for(uint id_att=7; id_att<filterMaxInd; id_att++){
                if((filteringAttributes[index]==1) && (candidate[id_att]!=1)){
                        testOutput=false;
                }
                index++;
            }

            //filter on availability

            if(testOutput){
                if((availability.length==3)||
                    ((availability[0]==availability[3])&&(availability[1]==availability[4])&&(availability[2]==availability[5]))){ // ask for a day booking
                    avState = AvailabiltyState.ONEDAY;
                    _filter[ind]=oneDayAvailability(candidate, availability);
                }
                else{ 
                    //availability.length==6, ask for a several-days booking 
                    avState = AvailabiltyState.SEVERALDAYS;
                    _filter[ind]=severalDaysAvailability(candidate, availability);
                }

                if(_filter[ind] == 1){
                    hasCandidates=true;
                }
            }
        }
        
        filter = _filter;
        
        if(hasCandidates){
            /// compute qos via oracle
            if (provable_getPrice("URL") > address(this).balance) {
                emit LogNewProvableQuery("Provable query was NOT sent, please add some ETH to cover for the query fee");
            } else {
                emit LogNewProvableQuery("Provable query was sent, standing by for the answer..");
                string memory str_matrix = uintarrays2string(candidates,num_alphas);
                string memory str_filter = list2string(filter);
                string memory url= string(abi.encodePacked("https://qosapi.herokuapp.com/api/qos?matrix=", str_matrix, "&alpha=[", alphas,"]", "&filter=", str_filter));
                provable_query("URL",url);
            }
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
    //////// QoS calculation


    // function normalize(uint[] memory input, uint mulfactor) public payable returns(uint[] memory){
    //    normalized.length=0; 
                
        //get largest
    //    uint256 largest = 0; 
    //    for(uint i = 0; i < input.length; i++){
    //        if(input[i] > largest) {
    //            largest = input[i]; 
    //        } 
    //    }
                
                
        //get smallest            uint  = 0;
            
    //        if(filter[i]==1){
    //            for (uint j=0; j<input[0].length; j++){
    //                    _QoS = _QoS + SafeMath.mul(alphas[i], input[i][j]);
    //                }
    //            _QoS = SafeMath.div(_QoS,numParams);
    //        }

    //    uint256 smallest = 0; 
    //    for(uint i = 0; i < input.length; i++){
    //        if(input[i] < smallest) {
    //            smallest = input[i]; 
    //        } 
    //    }
                
        // normalize                
    //    for (uint j=0; j<input.length;j++){
            
    //        normalized.push(SafeMath.div(SafeMath.mul(mulfactor,SafeMath.sub(input[j],smallest)),SafeMath.sub(largest,smallest)));
    //    }
                
    //    return normalized;
    // }

    
    
}