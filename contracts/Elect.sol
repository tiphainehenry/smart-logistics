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
    
    //uint[][] candidates = [ [0, 12,5,21, 13,5,21, 1,1,1],[1, 12,5,21, 13,5,21, 1,1,1], [2, 12,5,21, 15,5,21, 1,1,1], [3, 12,5,21, 16,5,21, 1,1,1], [4, 10,5,21, 14,5,21, 1,1,1], [5, 11,5,21, 14,5,21, 1,1,1] ]
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
    uint[][] candidates;

    bool hasCandidates = false;


    uint[] normalized;
    uint[][] normalizedArray;
    uint[] QoSList;
    uint[] sortedQoSList;



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


    function getSortedQoS() public view returns(uint[] memory){
        return sortedQoSList;   
    }

    function getNormalized() public view returns(uint[] memory){       
        return normalized;
    }

    function getNormalizedArray() public view returns(uint[][] memory){
        return normalizedArray;
    }


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
    

    //////// Sorting 


     function normalize(uint[] memory input, uint mulfactor) public payable returns(uint[] memory){
        normalized.length=0; 
                
        //get largest
        uint256 largest = 0; 
        for(uint i = 0; i < input.length; i++){
            if(input[i] > largest) {
                largest = input[i]; 
            } 
        }
                
                
        //get smallest
        uint256 smallest = 0; 
        for(uint i = 0; i < input.length; i++){
            if(input[i] < smallest) {
                smallest = input[i]; 
            } 
        }
                
        // normalize                
        for (uint j=0; j<input.length;j++){
            normalized.push(SafeMath.div(SafeMath.mul(mulfactor,SafeMath.sub(input[j],smallest)),SafeMath.sub(largest,smallest)));
        }
                
        return normalized;
     }


    function sortOnQoS(uint[][] memory input, uint[] memory alphas) public payable{
        uint mulfactor = 100;

        // normalize array
        uint numParams = input[0].length;

        for (uint j=0; j<numParams; j++){
            
            normalized.length=0;
            
            for (uint i=0; i<input.length; i++){
                normalized.push(input[i][j]);
            }
            
            uint[] memory tmp = normalize(normalized, mulfactor);
            
            for (uint i=0; i<input.length; i++){
                input[i][j]=tmp[i];
            }
        }
        
        normalizedArray = input;
        
        QoSList.length=0;
        for (uint i=0; i<input.length; i++){
            uint QoS = 0;
            for (uint j=0;j<numParams;j++){
                QoS = QoS + SafeMath.mul(alphas[j], input[i][j]);
            }
            
            QoSList.push(SafeMath.div(QoS,numParams));
        }


        sortedQoSList = Sort.sort(QoSList);


        // emit event
    }

    //////// main

    function elect(uint[] memory filteringAttributes, uint[] memory alphas, uint[] memory availability, uint[] memory distances, uint[] memory durations) public payable{
        

        // proceed to filtering
        uint[] memory _filteredCandidates = new uint[](candidates.length);
        // reinitialize list of candidates
        for(uint i=0; i<candidates.length;i++){
            _filteredCandidates[i]=0;
        }

        for(uint ind=0; ind<candidates.length; ind++){ // test all candidates
            candidate.length = 0;

            candidate = candidates[ind];
            candidate.push(distances[ind]);
            candidate.push(durations[ind]);
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
                
                //_filteredCandidates[ind]=1;
                //hasCandidates=true;

                //update list of candidates
                if(testOutput){
                    _filteredCandidates[ind]=1;
                    hasCandidates=true;

                    // emit event(?)
                }
            }
            
        }

       filteredCandidates = _filteredCandidates;

       // proceed to sorting
       uint[][] memory toSort;

       for (uint i=0; i<candidates.length; i++){
           if(filteredCandidates[i]!=0){
               toSort[i]=candidates[i]; // !!!! copy only sorting params !  for.... in range params: copy ! --> these will be the computed elems. 
           }
       }

       sortOnQoS(toSort, alphas); 
        
    }
    

    
    
    // function instanciate contract 
    
    

}