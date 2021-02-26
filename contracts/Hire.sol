pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

/**
 * @title  A smart contract to generate and record a set of binding agreements
 */
contract Hire {
    event NewAggreement(string message);
    event Request(address sender, address consignee, address consignor);

    struct Tenants {
        address consignee;
        address consignor;
    }

    struct Service {
        string shipFrom;
        string shipTo;
        string takeoverDate;
    }

    struct Merchandise {
        string nature;
        uint256 quantity;
        uint256 grossWeight;
        uint256 grossVolume;
    }

    string issuanceDate;
    string[] comments;
    string[] status;

    /// Aggreement struct containing the issuance date, tenant information, service agreement, and merchandise details.
    /// Additional comments and process status can also be added.
    struct Aggreement {
        string issuance;
        Tenants ppl;
        Service srv;
        Merchandise mrch;
        string[] cmmts;
        string status;
    }

    Tenants tenants;
    Service service;
    Merchandise merchandise;
    Aggreement[] aggreements;

    /// Adds a new agreement to the list and emit a success event. 
    /// @param _ppl the contractor and resource BC address
    /// @param _issuanceDate date of issuance of the contract
    /// @param _shipInfo shipment information
    /// @param _nature nature of the items to deliver
    /// @param _details merchandise details (quantity,gross weight and volume)
    function addAggreement(
        address[2] memory _ppl,
        string memory _issuanceDate,
        string[3] memory _shipInfo,
        string memory _nature,
        uint256[3] memory _details
    ) public payable {
        tenants.consignee = _ppl[0];
        tenants.consignor = _ppl[1];

        issuanceDate = _issuanceDate;

        service.shipFrom = _shipInfo[0];
        service.shipTo = _shipInfo[1];
        service.takeoverDate = _shipInfo[2];

        merchandise.nature = _nature;
        merchandise.quantity = _details[0];
        merchandise.grossWeight = _details[1];
        merchandise.grossVolume = _details[2];

        status.push("setCommand");

        Aggreement memory newAggreement =
            Aggreement(
                issuanceDate,
                tenants,
                service,
                merchandise,
                comments,
                "Aggreement set"
            );
        aggreements.push(newAggreement);

        emit NewAggreement("new aggreement published");
    }

    /// Returns then number of aggreement stored in the SC  
    /// @return the number of agreements stored in the SC
    function totalAggreements() public view returns (uint256) {
        return aggreements.length;
    }

    function getSender() public view returns (address) {
        return msg.sender;
    }


    /// Checks for the identity of the requester, and display the requested aggreement 
    /// if the identity matches with the contractor or service provider.  
    /// @param i index of the contract stored
    /// @param sender BC address of the requester
    /// @return the agreement details if the identity of the requester is correct, a fake agreement otherwise.
    function seeAggreement(uint256 i, address sender)
        public
        view
        returns (
            address[2] memory _ppl,
            string memory _issuanceDate,
            string[3] memory _shipInfo,
            string memory _nature,
            uint256[3] memory _details,
            string memory _status
        )
    {
        //emit Request(msg.sender, aggreements[i].ppl.consignee, aggreements[i].ppl.consignor);

        if (aggreements[i].ppl.consignee == sender) {
            //    contractState =  "consignee";
            return (
                [aggreements[i].ppl.consignee, aggreements[i].ppl.consignor],
                aggreements[i].issuance,
                [
                    aggreements[i].srv.shipFrom,
                    aggreements[i].srv.shipTo,
                    aggreements[i].srv.takeoverDate
                ],
                aggreements[i].mrch.nature,
                [
                    aggreements[i].mrch.quantity,
                    aggreements[i].mrch.grossWeight,
                    aggreements[i].mrch.grossVolume
                ],
                aggreements[i].status
            );
        } else if (aggreements[i].ppl.consignor == sender) {
            //    contractState = "consignor";

            (
                [aggreements[i].ppl.consignee, aggreements[i].ppl.consignor],
                aggreements[i].issuance,
                [
                    aggreements[i].srv.shipFrom,
                    aggreements[i].srv.shipTo,
                    aggreements[i].srv.takeoverDate
                ],
                aggreements[i].mrch.nature,
                [
                    aggreements[i].mrch.quantity,
                    aggreements[i].mrch.grossWeight,
                    aggreements[i].mrch.grossVolume
                ],
                aggreements[i].status
            );
        } else {
            Tenants memory fakeTenants = Tenants(address(0), address(0));
            Service memory fakeService = Service("", "", "");
            Merchandise memory fakeMerchandise = Merchandise("", 0, 0, 0);
            string[] memory fakeComment;

            Aggreement memory fakeAggreement =
                Aggreement(
                    "",
                    fakeTenants,
                    fakeService,
                    fakeMerchandise,
                    fakeComment,
                    ""
                );
            //    contractState = "wrong address";

            return (
                [fakeAggreement.ppl.consignee, fakeAggreement.ppl.consignor],
                fakeAggreement.issuance,
                [
                    fakeAggreement.srv.shipFrom,
                    fakeAggreement.srv.shipTo,
                    fakeAggreement.srv.takeoverDate
                ],
                fakeAggreement.mrch.nature,
                [
                    fakeAggreement.mrch.quantity,
                    fakeAggreement.mrch.grossWeight,
                    fakeAggreement.mrch.grossVolume
                ],
                fakeAggreement.status
            );
        }
    }
}
