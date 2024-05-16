// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ChristmasLottery {
    // Example limit
    uint8 public constant MAX_TICKETS_PER_PURCHASE = 10;

    event Response(bool success, bytes data);
    event LotteryReset();

    address public owner;
    mapping(address => bool) public authorized;
    mapping(uint8 => bool) private isWinningTicket;
    uint8 public totalTicketsInGame;
    // actual tickets that yet to be arrayWinningTicketsId
    uint8[] private tickets;
    
    struct Participant {
        string firstName;
        string lastName;
        string studentId;
        
    }
    struct TicketRange {
        uint8 startTicket;
        uint8 count;
    }

    mapping(address => TicketRange[]) private ticketsByOwnerRange;
    mapping(uint8 => Participant) public ticketOwner;
    uint8[] private arrayWinningTicketsId;

    constructor() {
        owner = msg.sender;
        // This can be adjusted to reflect the euro equivalent if needed
        authorized[owner] = true;
    }

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

    function authorizeAddress(address _addr) external onlyOwner {
        authorized[_addr] = true;
    }

    function deauthorizeAddress(address _addr) external onlyOwner {
        authorized[_addr] = false;
    }

    function buyTickets(uint8 numberOfTickets, string memory firstName, string memory lastName, string memory studentId)
    external
    // payable
    // Owner could authorize addresses to buy tickets as his dealers
    // onlyAuthorized
    onlyOwner
    personExists(firstName,
    lastName,
    studentId)
    validLength(firstName,13)
    validLength(lastName,13)
    validLength(studentId,13)
    {
        require(numberOfTickets > 0 && numberOfTickets <= MAX_TICKETS_PER_PURCHASE, "Ticket purchase exceeds limit");

        // Create a new participant struct
        Participant memory participant = Participant(firstName, lastName, studentId);
        
        // Calculate the start ticket and the end ticket
        uint8 startTicket = totalTicketsInGame;
        totalTicketsInGame += numberOfTickets; // Increment the total tickets in the game

        // Record the range of tickets bought
        TicketRange memory range = TicketRange(startTicket, numberOfTickets);
        ticketsByOwnerRange[msg.sender].push(range);

        // Assign all tickets within the range to the buyer
        for (uint8 i = 0; i < numberOfTickets; i++) {
            // You might want to rethink if this mapping is still necessary
            ticketOwner[startTicket + i] = participant;
        }
    }

    function drawWinners2(uint8 numberOfWinners) external onlyOwner returns (uint8[] memory) {
        require(numberOfWinners <= tickets.length, "More winners than tickets available");
        uint8[] memory winners = new uint8[](numberOfWinners);
        for (uint8 i = 0; i < numberOfWinners; i++) {
            uint8 winnerIndex;
            bool isUnique;
            do {
                winnerIndex = uint8(random() % tickets.length);
                isUnique = !isWinningTicket[tickets[winnerIndex]];
            } while (!isUnique);

            uint8 winnerTicket = tickets[winnerIndex];
            winners[i] = winnerTicket;
            isWinningTicket[winnerTicket] = true; // Mark as winner
            arrayWinningTicketsId.push(winnerTicket);
        }
        return arrayWinningTicketsId;
    }


    // function drawWinners(uint8 numberOfWinners) external onlyOwner returns (uint8[] memory){
    //     require(numberOfWinners <= tickets.length, "More winners than tickets available");

    //     for (uint8 i = 0; i < numberOfWinners; i++) {
    //         uint8 winnerIndex = uint8(uint(random() % tickets.length));
    //         uint8 winnerTicket = tickets[winnerIndex];
    //         arrayWinningTicketsId.push(winnerTicket);
    //         isWinningTicket[winnerTicket] = true; // Mark as winner
    //         // Remove the selected ticket from the pool to avoid duplicates
    //         // Assign the last ticket in place for the winning one
    //         // Then pop it
    //         tickets[winnerIndex] = tickets[tickets.length - 1];
    //         tickets.pop();
    //     }
    //     return arrayWinningTicketsId;
    // }

    function getWinnerDetails(uint8 ticket) external view onlyAuthorized returns (string memory, string memory, string memory) {
        Participant memory winner = ticketOwner[ticket];
        return (winner.firstName, winner.lastName, winner.studentId);
    }

    function getAllCurrentlyWinningTickets() public view returns (uint8[] memory) {
        return arrayWinningTicketsId;
    }

    function resetLottery() external onlyOwner {
        // Reset total tickets in game
        totalTicketsInGame = 0;

        // Clear the array of tickets
        delete tickets;

        // Reset each participant's list of tickets and the ticket ownership mapping
        for (uint8 i = 0; i < totalTicketsInGame; i++) {
            uint8 ticketId = tickets[i];
            delete ticketOwner[ticketId];
        }

        // Reset the isWinningTicket mapping for all ticket IDs
        for (uint8 j = 0; j < arrayWinningTicketsId.length; j++) {
            delete isWinningTicket[arrayWinningTicketsId[j]];
        }

        // Clear the array of winners
        delete arrayWinningTicketsId;
        delete totalTicketsInGame;
        emit LotteryReset();
    }

    function random() private view returns (uint8) {
        bytes32 hashValue = keccak256(abi.encodePacked(block.prevrandao, block.timestamp, tickets));
        uint8 smallInt = uint8(uint(hashValue));
        return smallInt;
    }

    function withdrawFunds() external onlyOwner {
        // payable(owner).transfer(address(this).balance);
        (bool success, bytes memory data) = address(this).call{value: address(this).balance}("");
        require(success, "Failed to send Ether");
        emit Response(success, data);

    }

    function isWinner(uint8 ticketNumber) private view returns (bool) {
        return isWinningTicket[ticketNumber];
    }
}
