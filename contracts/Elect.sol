pragma experimental ABIEncoderV2;

pragma solidity ^0.5.0;
/**
 * @title Elect
 */


contract Elect {
    // list of persons with attribute values:   
    // [[id, startDay, startMonth, startYear,  endDay, endMonth, endYear, equipment1, equipment2, equipment3 //pickup, delivery, history]]
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

    ///// Delegated services        
    function getFitleredCandidates() public view returns(uint[] memory){
        return filteredCandidates;
    }

    function getTestState() public view returns(string memory){
        return testState;
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
    

    //////// Filtering
    // function filter(int[][] memory _candidates, uint[6] memory availability, int[] memory _filteringAttributes) public payable returns (uint[5] memory) {

    function filter(uint[][] memory candidates, uint[] memory filteringAttributes, uint[] memory availability) public payable{
        //function filter(uint[] memory _filteringAttributes) public payable {
        require((availability.length==3)||(availability.length==6)); // date
        
        uint[] memory _filteredCandidates = new uint[](candidates.length);
        // reinitialize list of candidates
        for(uint i=0; i<candidates.length;i++){
            _filteredCandidates[i]=0;
        }

        
        for(uint ind=0; ind<candidates.length; ind++){
            uint[] memory person=candidates[ind];
            bool testOutput = true;

            // filter on  attributes
            uint index=0;
            for(uint id_att=7; id_att<person.length; id_att++){
                if((filteringAttributes[index]==1) && (person[id_att]!=1)){
                        testOutput=false;
                }
                index++;
            }

            if(testOutput){
                //filter on availability
                if((availability.length==3)||
                    ((availability[0]==availability[3])&&(availability[1]==availability[4])&&(availability[2]==availability[5]))){ // ask for a day booking
                    testState="oneday";
                    testOutput=oneDayAvailability(person, availability);
                }
                else{ 
                    //availability.length==6, ask for a several-days booking 
                    testState="severaldays";
                    testOutput=severalDaysAvailability(person, availability);
                }
                
                //update list of candidates
                if(testOutput){
                    _filteredCandidates[ind]=1;
                }
            }
            
            filteredCandidates = _filteredCandidates;
        }
        
        
        
    }
    
    // function sort 
    // function sort() - calculate ponderated mean

    
    
    // function instanciate contract 
    
    

}
