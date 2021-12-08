pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

import "./SafeMath.sol";
import "./ElectToolbox.sol";
import "./ProvableAPI_0.5.sol";
//import "github.com/provable-things/ethereum-api/provableAPI_0.5.sol";


/**
 * @title  A smart contract to elect a profile based on a set of objective criteria, and a QoS. 
 */
contract Elect is usingProvable {
    
    uint[] filter;
    
    string filteredIds;
    
    
    enum AvailabiltyState{ONEDAY, SEVERALDAYS}
    AvailabiltyState avState;

    uint[] candidate;

    // list of persons with attribute values: [[id, startDay, startMonth, startYear, endDay, endMonth, endYear, equipment1, equipment2, equipment3 //pickup, distance]]
    uint[][] candidates = [
                            [0, 12,1,21, 13,1,21,  1,1, 10,3,3],
                            [1, 12,1,21, 13,1,21,  0,1, 7,3,7],
                            [2, 1,1,21,  13,1,21,  1,0, 10,3,3],
                            [3, 12,1,21, 13,1,21,  0,0, 6,4,3],
                            [4, 12,1,21, 13,1,21,  1,1, 10,3,3],
                            [5, 12,1,21, 13,1,21,  1,1, 5,3,5],
                            [6, 12,1,21, 13,1,21,  1,0, 2,7,3],
                            [7, 1,1,21,  13,1,21,  1,0, 10,3,3],
                            [8, 12,1,21, 13,1,21,  0,1, 9,3,3],
                            [9, 12,1,21, 13,1,21,  0,1, 10,3,9]
                        ];

    bool matchExists = false;
    string bestProfiles;
 
    constructor() public payable {
    // ...
    }

    /// Answers to a service request by providing the oracle output. 
    /// @param ExistCandidates Note to the user: whether a matching candidate has been retrieved.
    /// @param profiles If success, this variables holds the profile details of the best candidates.
    event BestCandidates(string ExistCandidates, string profiles);

    //string public qosList_string;
    event LogConstructorInitiated(string nextStep);
    event LogQoSCompute(string qosList);
    event LogNewProvableQuery(string description);

    function getfilter() public view returns (uint256[] memory) {
        return filter;
    }

    function getCandidates() public view returns (uint256[][] memory) {
        return candidates;
    }

    function getBestProfiles() public view returns (string memory) {
        return bestProfiles;
    }


    /// @notice Scans each profile of the candidates matrix to find matching resources.
    /// @param attributes The binary array of required attributes (set of filtering criteria)
    /// @param availability The availability date required (also a filtering criteria)
    /// @return binary array of matching candidates
    function filterScan(
        uint256[] memory attributes,
        uint256[] memory availability
    ) public payable returns (uint256[] memory) {
        // SET CLEAN FILTERING VARIABLES
        uint256[] memory _filter = new uint256[](candidates.length);
        for (uint256 i = 0; i < candidates.length; i++) {
            _filter[i] = 0;
        }
        matchExists = false;

        // FILTER - TEST ALL CANDIDATES
        for (uint256 ind = 0; ind < candidates.length; ind++) {
            candidate.length = 0;
            candidate = candidates[ind];

            // CHECK ATTRIBUTES
            bool matchOnAttributes = true;
            uint256 index = 0;
            uint256 filterMaxInd = 7 + attributes.length;

            for (uint256 id_att = 7; id_att < filterMaxInd; id_att++) {
                if ((attributes[index] == 1) && (candidate[id_att] != 1)) {
                    matchOnAttributes = false;
                }
                index++;
            }

            // CHECK AVAILABILITY
            if (matchOnAttributes) {
                if (
                    (availability.length == 3) ||
                    ((availability[0] == availability[3]) &&
                        (availability[1] == availability[4]) &&
                        (availability[2] == availability[5]))
                ) {
                    // ask for a day booking
                    avState = AvailabiltyState.ONEDAY;
                    _filter[ind] = ElectToolbox.oneDayAvailability(
                        candidate,
                        availability
                    );
                } else {
                    //availability.length==6, ask for a several-days booking
                    avState = AvailabiltyState.SEVERALDAYS;
                    _filter[ind] = ElectToolbox.severalDaysAvailability(
                        candidate,
                        availability
                    );
                }

                if (_filter[ind] == 1) {
                    matchExists = true;
                }
            }
        }

        filter = _filter;

        return filter;
    }

    /// @notice Callback function. Emits to the user the best profiles retrieved based on the QoS computation.
    /// @dev This function is triggered by the oracle.
    /// @param myid The binary array of required attributes (set of filtering criteria)
    /// @param result best profiles retrieved by the oracle.
    function __callback(bytes32 myid, string memory result) public {
        if (msg.sender != provable_cbAddress()) revert();

        bestProfiles = result;

        emit BestCandidates("Matching", bestProfiles);
    }

    /// @notice Main function: Scans each profile of the candidates matrix to find matching resources. If a match exists, ask the oracle for a QoS sorting. 
    /// @param attributes The binary array of required attributes (set of filtering criteria)
    /// @param availability The availability date required (also a filtering criteria)
    /// @param alphas The weighing optimization values (string concatenation to reduce compuation costs (format required for the API call))
    /// @param num_alphas The number of weighing optimization factors (not computed in the SC to limit computation costs).
    /// @return binary array of matching candidates
    function sort(
        uint256[] memory attributes,
        uint256[] memory availability,
        string memory alphas,
        uint256 num_alphas
    ) public payable {
        filter = filterScan(attributes, availability);

        if (matchExists) {
            /// compute qos via oracle
            if (provable_getPrice("URL") > address(this).balance) {
                emit LogNewProvableQuery(
                    "Provable query was NOT sent, please add some ETH to cover for the query fee"
                );
            } else {
                emit LogNewProvableQuery(
                    "Provable query was sent, standing by for the answer.."
                );
                string memory str_matrix =
                    ElectToolbox.uintarrays2string(candidates, num_alphas);
                string memory str_filter = ElectToolbox.list2string(filter);
                string memory url =
                    string(
                        abi.encodePacked(
                            "https://qosapi.herokuapp.com/api/qos?matrix=",
                            str_matrix,
                            "&alpha=[",
                            alphas,
                            "]",
                            "&filter=",
                            str_filter
                        )
                    );
                provable_query("URL", url);
            }
        } else {
            emit BestCandidates("No matching found", "");
        }
    }
}
