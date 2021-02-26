pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

/**
 * @title  A toolbox to filter a set of candidates based on a set of filtering criteria. 
 */
library ElectToolbox {

    struct Date { 
      uint day;
      uint month;
      uint year;
   }

    enum TestOutput{NO,YES}


    /// @notice checks whether a person is available for a given day
    /// @param _person The person availability date
    /// @param _availability The availability date required 
    /// @return 1 if person is available, 0 otherwise.
    function oneDayAvailability(uint[] memory _person, uint[] memory _availability) public pure returns(uint){
        
        
        Date memory ASDate = Date(_person[1],_person[2],_person[3]);  // available start
        Date memory AEDate = Date(_person[4],_person[5],_person[6]); //available end

        Date memory RSDate = Date(_availability[0],_availability[1],_availability[2]); // required start

        TestOutput output;
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

    /// @notice checks whether a person is available for a set of days
    /// @param _person The person availability dates
    /// @param _availability The availability date required 
    /// @return 1 if person is available, 0 otherwise.
    function severalDaysAvailability(uint[] memory _person, uint[] memory _availability) public pure returns(uint){
        
        Date memory ASDate = Date(_person[1],_person[2],_person[3]);  // available start
        Date memory AEDate = Date(_person[4],_person[5],_person[6]); //available end

        Date memory RSDate = Date(_availability[0],_availability[1],_availability[2]); // required start
        Date memory REDate = Date(_availability[3],_availability[4],_availability[5]); // required end

        TestOutput output;
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

    /// @notice converts a uint into a str
    /// @param _i The uint to convert
    /// @return the string conversion.
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

    /// @notice converts a list into a str
    /// @param list The list to convert
    /// @return the string conversion.
    function list2string(uint[] memory list) public pure returns(string memory) {
             
                string memory str_list = "[";
                for(uint j=0;j<list.length-1;j++){    
                    str_list = string(abi.encodePacked(str_list, uint2str(list[j]), ","));
                }
                str_list = string(abi.encodePacked(str_list,uint2str(list[list.length-1]), "]"));
                return str_list;
    }

    /// @notice converts a chunk of an array into a str (used to extract the QoS criteria of the candidates matrix)
    /// @param array The array to convert
    /// @param num_param The number of columns to extract
    /// @return the string conversion.
    function uintarrays2string(uint[][] memory array, uint num_param) public pure returns(string memory) {
                string memory str_matrix = "[";
                uint ind_param = array[0].length - num_param;
                
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
                            
                return str_matrix;

    }    

}