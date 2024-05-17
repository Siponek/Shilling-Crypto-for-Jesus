// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
pragma abicoder v2;

contract ChristmasLottery {
        // -----GOTTA GO FAST
    struct Range{
        uint start;
        uint end;
    }
    uint private constant RANGE_ENTRIES= 2;
    uint private constant DRAFT_LIMIT = 255;

    struct Participant_fast {
        string firstName;
        string lastName;
    }
    struct ParticipantsAndTheirRanges {
        string studentId;
        Range[] ranges;
    }
    uint private number_of_participants = 0;
    uint private SEED = 2137;
    // For keepking track of existing participants
    mapping(string => bool) private exisiting_participants;
    // For keeping track of ranges of numbers
    // student_id to array of ranges(start,end)
    mapping (string =>  Range[]) private participants_ranges;
    // For keeping track of participants data
    mapping (string => Participant_fast) private participants_credentials;
    string[] private participants_list;
        // -----GOTTA GO FAST

    // Arbirtary limit per purchase
    uint8 public constant MAX_TICKETS_PER_PURCHASE = 64;

    event Response(bool success, bytes data);
    event LotteryReset();

    uint public totalTicketsInGame;
    uint[] public arrayWinningTicketsId;
    mapping(uint => bool) private alreadyDrafted;

    address public owner;
    mapping(address => bool) public authorized;

    constructor() {
        owner = msg.sender;
        authorized[owner] = true;
    }

    // ----------------
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized: owner required");
        _;
    }

    modifier onlyAuthorized() {
        require(authorized[msg.sender], "Not authorized");
        _;
    }

    modifier personExists(string memory firstName, string memory lastName, string memory studentId) {
        require(bytes(firstName).length > 0 && bytes(lastName).length > 0 && bytes(studentId).length > 0, "Specify user credentials as strings");
        _;
    }

    // For proper gas estimation
    modifier validLength(string memory str, uint maxLength) {
        require(bytes(str).length <= maxLength, "String exceeds maximum length");
        _;
    }
    // ----------------

    function authorizeAddress(address _addr) external onlyOwner {
        authorized[_addr] = true;
    }

    function deauthorizeAddress(address _addr) external onlyOwner {
        authorized[_addr] = false;
    }

    function buyTicketsOffchainMode(uint numberOfTickets, string memory firstName, string memory lastName, string memory studentId)
        external
        // payable
        // Owner can authorize addresses to buy tickets as his dealers
        onlyOwner
        personExists(firstName,
        lastName,
        studentId)
        validLength(firstName,13)
        validLength(lastName,13)
        validLength(studentId,13)
    {
        require(numberOfTickets > 0 && numberOfTickets <= MAX_TICKETS_PER_PURCHASE, "Ticket purchase exceeds limit");
        addParticipant(firstName,lastName, studentId);
        addRange(totalTicketsInGame, totalTicketsInGame + numberOfTickets, studentId);
        totalTicketsInGame += numberOfTickets;
    }

    // Call this function to draw winners
    function drawWinnersOffChainMode(uint numberOfWinners) external onlyOwner returns (uint[] memory) {
        require(numberOfWinners <= totalTicketsInGame, "More winners than tickets available");
        
        uint[] memory winners = new uint[](numberOfWinners);
        uint draftedCount = 0;
        uint attempts = 0;  // Track attempts to avoid infinite loops
        for (uint i = 0; i < totalTicketsInGame; i++) {
            alreadyDrafted[i] = false;
        }
        do {
            if (attempts > DRAFT_LIMIT + totalTicketsInGame) {
                revert("Too many drafts, not enough unique tickets");
            }

            uint winnerIndex = uint(random() % totalTicketsInGame);
            winners[draftedCount++] = winnerIndex;
            if (!alreadyDrafted[winnerIndex]) {
                winners[draftedCount++] = winnerIndex;
                alreadyDrafted[winnerIndex] = true;
            }
            attempts++;
        } while (draftedCount < numberOfWinners);
        arrayWinningTicketsId = winners;  // Update the global winners array if needed
        return winners;
    }
    
    
    // Call this function to retrieve the
    function getAllParticipantsRanges() external view onlyOwner returns (ParticipantsAndTheirRanges[] memory) {
        ParticipantsAndTheirRanges[] memory allParticipants = new ParticipantsAndTheirRanges[](participants_list.length);
        for (uint8 i = 0; i < participants_list.length; i++) {
            allParticipants[i].ranges = participants_ranges[participants_list[i]];
            allParticipants[i].studentId = participants_list[i];
        }
        return allParticipants;
    }

    function random() private returns (uint) {
        bytes32 hashValue = keccak256(abi.encodePacked(block.prevrandao,
                                        block.timestamp, SEED++));
        return uint(hashValue);
    }

    function withdrawFunds() external onlyOwner {
        (bool success, bytes memory data) = address(this).call{value: address(this).balance}("");
        require(success, "Failed to send Ether");
        emit Response(success, data);
    }

    function addParticipant(string memory _firstName, string memory _lastName, string memory _studentID)
    // The return is unnecessary
        private returns (Participant_fast memory) {
        // if the participant is not already in the list of participants
        if (!exisiting_participants[_studentID]) {
            // add the participant to the mapping of participants with the studentID as key
            number_of_participants++;
            exisiting_participants[_studentID] = true;
            // Adding participant credentials to the list
            participants_credentials[_studentID] = Participant_fast(_firstName, _lastName);
            // Adding participant ID to the list for lookup ranges later
            participants_list.push(_studentID);
            return Participant_fast(_firstName, _lastName);
        } else {
            return participants_credentials[_studentID];
        }
    }

    function addRange(uint _start, uint _end, string memory _student_id) private {
        require(_start <= _end, "Invalid range: start must be less than or equal to end");
        // mapping (string => mapping (uint8 => Range)) private participants_ranges;
        Range[] memory current_participant_ranges = participants_ranges[_student_id];
        if (current_participant_ranges.length > 0) {
            Range memory lastRange = current_participant_ranges[current_participant_ranges.length - 1];
            require(_start + totalTicketsInGame > lastRange.end, "Ranges must be non-overlapping and in order");
        }

        participants_ranges[_student_id].push(Range(_start, _end));
    }

    function getCurrentWinningID() onlyAuthorized public view returns (uint[] memory) {
        return arrayWinningTicketsId;
    }
    function getParticipantCredentials(string memory _studentId) view  onlyAuthorized public returns (Participant_fast memory) {
        return participants_credentials[_studentId];
    }
    function findParticipantByTicket(uint ticketNumber) onlyAuthorized public view returns (Participant_fast memory) {
        for (uint8 i = 0; i < participants_list.length; i++) {
            string memory studentId = participants_list[i];
            Range[] memory ranges = participants_ranges[studentId];
            for (uint8 j = 0; j < ranges.length; j++) {
                if (ticketNumber >= ranges[j].start && ticketNumber <= ranges[j].end) {
                    return participants_credentials[studentId];
                }
            }
        }
        revert("Ticket number not found");
    }


}
