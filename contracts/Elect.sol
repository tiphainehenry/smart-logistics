pragma experimental ABIEncoderV2;
//pragma solidity >=0.4.22 <0.7.0;

/**
 * @title Elect
 * @dev Store & retrieve value in a variable
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
                        
                            [1, 120121, 150121, 1,0,1],
                            [2, 120121, 150121, 1,1,0],
                            [3, 120121, 150121, 1,0,1],
                            [4, 100121, 140121, 1,0,1],
                            [5, 110121, 140121, 1,1,1]
                            ];     
    
    uint256[] attributes;    // list of attributes with ponderation
    
    uint[5] filteredCandidates;
    

    // function filter
    //    function filter(int[][] memory _candidates, uint[2] memory availability, int[] memory _sortingAttributes) public payable returns (uint[5] memory) {
    function filter(uint[] memory _sortingAttributes, uint[2] memory availability) public payable returns (uint[5] memory) {
        
        for(uint ind=0; ind<candidates.length; ind++){
            
            uint[] memory person=candidates[ind];
            bool testOutput = true;

            // filter on  attributes
            uint index=0;
            for(uint id_att=3; id_att<person.length; id_att++){
                if(_sortingAttributes[index]==1){
                    if(person[id_att]!=1){
                        testOutput=false;
                    }
                }
                index++;
            }

            // filter on availability
            
            // same month, same year
            // different month, same year
            // different years



            
            if(testOutput){
                    filteredCandidates[ind]=1;
                }
        }
    }
    
    function getFitleredIds() public view returns(uint[5] memory){
        return filteredCandidates;
    }
    
    // function sort 
    // function sort()
    
    
    // function instanciate contract 
    
    // calculate ponderated mean
    

}
