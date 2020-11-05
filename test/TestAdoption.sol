pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoption {
    // The address of the adoption contract to be tested
    Adoption adoption = Adoption(DeployedAddresses.Adoption());

    // The id of the resource that will be used for testing
    uint expectedresourceId = 8;

    //The expected owner of adopted resource is this contract
    address expectedAdopter = address(this);



    // Testing the adopt() function
    function testUserCanAdoptresource() public {
    uint returnedId = adoption.adopt(expectedresourceId);

    Assert.equal(returnedId, expectedresourceId, "Adoption of the expected resource should match what is returned.");
    }


    // Testing retrieval of a single resource's owner
    function testGetAdopterAddressByresourceId() public {
    address adopter = adoption.adopters(expectedresourceId);

    Assert.equal(adopter, expectedAdopter, "Owner of the expected resource should be this contract");
    }

    // Testing retrieval of all resource owners
    function testGetAdopterAddressByresourceIdInArray() public {
    // Store adopters in memory rather than contract's storage
    address[16] memory adopters = adoption.getAdopters();

    Assert.equal(adopters[expectedresourceId], expectedAdopter, "Owner of the expected resource should be this contract");
    }
}