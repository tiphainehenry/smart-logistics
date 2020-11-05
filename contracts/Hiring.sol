pragma solidity ^0.5.0;

contract Hiring {
    address[16] public employers;

    // Hiring a resource
    function hire(uint resourceId) public returns (uint) {
        require(resourceId >= 0 && resourceId <= 15);

        employers[resourceId] = msg.sender;

        return resourceId;
    }

    // Retrieving the employers
    function getEmployers() public view returns (address[16] memory) {
        return employers;
    }

}