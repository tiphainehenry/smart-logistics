pragma experimental ABIEncoderV2;

pragma solidity ^0.7.4;
/**
 * @title Elect
 */


contract Elect {

    uint256 number;

    // list of persons with attribute values:   
    // [[id, start, end, pickup, delivery, equipment1, equipment2, equipment3 //, history]]
    // pickup and delivery: *10E7
    
    uint[][] candidates =[   //[int(1), int(120121), int(140121), int(457578137), int(48320114), int(0),int(1),int(0)],
                            //[int(2), int(100121), int(140121), int(488627250), int(22875920), int(1),int(1),int(0)],
                            //[int(3), int(120121), int(150121), int(481113387), int(-16800198), int(0),int(1),int(1)],
                            //[int(4), int(100121), int(140121), int(472186371), int(-15541362), int(0),int(1),int(0)],
                            //[int(5), int(110121), int(140121), int(473215806), int(50414701), int(1),int(1),int(0)]
                        
                            [1, 12,5,21, 15,5,21, 1,1,1],
                            [2, 12,5,21, 15,5,21, 1,1,1],
                            [3, 12,5,21, 15,5,21, 1,1,1],
                            [4, 10,5,21, 14,5,21, 1,1,1],
                            [5, 11,5,21, 14,5,21, 1,1,1]
                        ];     
    
    uint[] attributes;    // list of attributes with ponderation
    uint[] sortingAttributes = [1,1,1];    // list of attributes with ponderation
    //uint[] availability = [12,1,21];
    
    uint[5] filteredCandidates;
    
    string testState;
    
    // function filter
    // function filter(int[][] memory _candidates, uint[6] memory availability, int[] memory _sortingAttributes) public payable returns (uint[5] memory) {
        
    function filter(uint[] memory availability) public payable returns(uint[5] memory){
        //function filter(uint[] memory _sortingAttributes) public payable {
        testState = "launchingProcessing";

        for(uint ind=0; ind<candidates.length; ind++){
            uint[] memory person=candidates[ind];
            bool testOutput = true;

            // filter on  attributes
            uint index=0;
            for(uint id_att=7; id_att<person.length; id_att++){
                if((sortingAttributes[index]==1) && (person[id_att]!=1)){
                        testOutput=false;
                }
                index++;
            }

            if(testOutput){
            
                testState = "stepProcessing1OK";
                
                // filter on availability
                if(availability.length==3){ // same day
                    uint reqDay=availability[0];
                    uint reqMonth=availability[1];
                    uint reqYear=availability[2];
                    
                    uint avStartDay = person[1];
                    uint avStartMonth = person[2];
                    uint avStartYear = person[3];

                    uint avEndDay = person[4];
                    uint avEndMonth = person[5];
                    uint avEndYear = person[6];
                    
                    if((reqMonth==avStartMonth) && (reqYear==avStartYear)){ // same month, same year
                        if(avStartDay > reqDay){ // person is booked
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
                }
            }
            
            testState = "stepProcessingOK";
            if(testOutput){
                filteredCandidates[ind]=1;
            }

        }
        testState = "passedProcessing";
    
        return filteredCandidates;
    }
    
    function getFitleredIds() public view returns(uint[5] memory){
        return filteredCandidates;
    }

    function getTestProcessing() public view returns(string memory){
        return testState;
    }

    
    // function sort 
    // function sort()
    
    
    // function instanciate contract 
    
    // calculate ponderated mean
    

}
