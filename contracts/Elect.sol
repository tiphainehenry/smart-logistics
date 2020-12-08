pragma experimental ABIEncoderV2;

pragma solidity ^0.5.16;

import "./Sort.sol";

import "./SafeMath.sol";


/**
 * @title Elect
 */


contract Elect {
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
    
    uint[] filteredCandidates;
    
    string filteredIds;
    
    string testState;

    uint[] candidate;
    //uint[][] candidates = [[6,12,1,21,13,1,21,1,0,0,10,3],[6,12,1,21,13,1,21,1,0,0,10,3],[6,12,1,21,13,1,21,0,0,0,10,3]];

    uint[][] candidates;

    bool hasCandidates = false;


    uint[] normalized;
    uint[][] normalizedArray;
    uint[][] tmpNormalizedArray;
    uint[] QoSList;
    uint[] sortedQoSList;

    uint QoS;
    uint n;

    uint K=3;
    uint[][] bestProfileIndexes;
    uint[][] NoProfileIndexes;

    event BestCandidates(
        string ExistCandidates,
        uint[][] profiles  
    );

    ///// Delegated services        
    function getFilteredCandidates() public view returns(uint[] memory){
        return filteredCandidates;
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

    function getTestState() public view returns(string memory){
        return testState;
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

    function getBestProfiles() public view returns (uint[][] memory){
        return bestProfileIndexes;
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


    function oneDayAvailability(uint[] memory _person, uint[] memory _availability) public payable returns(bool){
        uint avStartDay = _person[1];
        uint avStartMonth = _person[2];
        uint avStartYear = _person[3];

        uint avEndDay = _person[4];
        uint avEndMonth = _person[5];
        uint avEndYear = _person[6];

        uint reqDay= _availability[0];
        uint reqMonth= _availability[1];
        uint reqYear= _availability[2];
                    
        bool testOutput=true;
        
        if((reqMonth==avStartMonth) && (reqYear==avStartYear)){ // same month, same year
            if((avStartDay > reqDay)||(avEndDay<reqDay)){ // person is booked
                testOutput=false;
                }
            }
        else if((reqMonth!=avStartMonth) && (reqYear==avStartYear)){ //same year, different month
            if(!((avStartMonth < reqMonth) && (avStartDay < reqDay)) || (avEndMonth<reqMonth)){ // person is booked
                testOutput=false;
            }
        }
        else{ //different year
            if(!(reqYear>avStartYear)||(avEndYear<reqYear)){ // person is booked
                testOutput=false;
            }
        }
        return testOutput;
    }


    function severalDaysAvailability(uint[] memory _person, uint[] memory _availability) public payable returns(bool){
        bool testOutput=true;
        
        uint avStartDay = _person[1];
        uint avStartMonth = _person[2];
        uint avStartYear = _person[3];

        uint avEndDay = _person[4];
        uint avEndMonth = _person[5];
        uint avEndYear = _person[6];

        uint reqSDay=_availability[0];
        uint reqSMonth=_availability[1];
        uint reqSYear=_availability[2];
                    
        uint reqEDay=_availability[3];
        uint reqEMonth=_availability[4];
        uint reqEYear=_availability[5];
                    

        require(reqEDay>reqSDay);

        if((reqSMonth==avStartMonth) && (reqSYear==avStartYear) && (reqEYear==avEndYear)){ // same start month, same year
            if((avStartDay > reqSDay)||(avEndDay<reqEDay)){ // person is booked
                testOutput=false;
                }
        }
        else if((reqSMonth!=avStartMonth) && (reqSYear==avStartYear) &&  (reqEYear==avEndYear)){ //same year, different month
            if(!((avStartMonth < reqSMonth) && (avStartDay < reqSDay)) || (avEndMonth<reqSMonth) || (avEndMonth<reqEMonth)){ // person is booked
                testOutput=false;
                }
            }
        else{ //different year
            if(!(reqSYear>avStartYear)||(avEndYear<reqSYear)||(avEndYear<reqEYear)){ // person is booked
                testOutput=false;
            }
        }
        return testOutput;
    }
    

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


    

    function computeQoS(uint[] memory filter, uint[] memory input) public payable{
        
        //uint numParams = input[0].length;

        //uint mulfactor = 100;
        // normalize array by column
        //for (uint j=startingOptimIndex; j<numParams; j++){
        //    normalized.length=0;
        //    for (uint i=0; i<input.length; i++){
        //        normalized.push(input[i][j]);
        //    }
            
        //    normalizedArray.push(normalize(normalized, mulfactor));
        //}
        
        require(filter.length==input.length,  "issue with size");

        
        bestProfileIndexes.length=0;

        QoSList.length=0;
        for (uint i=0;i<input.length;i++){
            uint _QoS = SafeMath.mul(filter[i], input[i]);            
            QoSList.push(_QoS);
        }

        // get n best ones
        uint[] memory tmpList = new uint[](QoSList.length);
        for (uint i=0;i<QoSList.length;i++){
            tmpList[i] = QoSList[i];
        }


        for(uint j=0;j<K;j++){
            uint _QoS = tmpList[0];        
            uint _index = 0;

            for (uint i=0;i<QoSList.length;i++){
                if(tmpList[i]>_QoS){
                    _QoS=tmpList[i];
                    _index = i;
                }
            }
            bestProfileIndexes.push([_index,_QoS]);
            tmpList[_index]=0;
        }

        // emit event
        emit BestCandidates(
            'Matching',
            bestProfileIndexes  
        );

    }

    //////// main

    function elect(uint[] memory qosList, uint[] memory filteringAttributes, uint[] memory availability) public payable{
        hasCandidates=false; // reset

        // proceed to filtering
        uint[] memory _filteredCandidates = new uint[](candidates.length);
        // reinitialize list of candidates
        for(uint i=0; i<candidates.length;i++){
            _filteredCandidates[i]=0;
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
                    testState="oneday";
                    testOutput=oneDayAvailability(candidate, availability);
                }
                else{ 
                    //availability.length==6, ask for a several-days booking 
                    testState="severaldays";
                    testOutput=severalDaysAvailability(candidate, availability);
                }

                //update list of candidates
                if(testOutput){
                    _filteredCandidates[ind]=1;
                    hasCandidates=true;

                }
            }
            
        }
        
        filteredCandidates = _filteredCandidates;
        
        if(hasCandidates){
            computeQoS(filteredCandidates, qosList);
        }

        else{
            emit BestCandidates('No matching found', NoProfileIndexes);
        }

       
    
    }
    
}