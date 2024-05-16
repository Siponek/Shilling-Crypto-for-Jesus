// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ChristmasLottery {
    // Example limit
    uint8 public constant MAX_TICKETS_PER_PURCHASE = 10;

    event Response(bool success, bytes data);
    event LotteryReset();
    address public owner;
    mapping(address => bool) public authorized;
    mapping(address => uint8[]) private ticketsByOwner;
    mapping(uint8 => bool) private isWinningTicket;
    uint8 public totalTicketsInGame;
    // actual tickets that yet to be arrayWinningTicketsId
    uint8[] private tickets;
    
    struct Participant {
        string firstName;
        string lastName;
        string studentId;
        address walletAddress;
    }
    
    mapping(uint8 => Participant) public ticketOwner;
    uint8[] public arrayWinningTicketsId;

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

    // Modified to accept participant details
    function buyTickets(uint8 numberOfTickets, string memory firstName, string memory lastName, string memory studentId)
    external
    // payable
    // Allowing everyone to buy tickets does not make sense without paying
    // So owner can authorize addresses to buy tickets as his dealers
    onlyAuthorized
    personExists(firstName,
    lastName,
    studentId)
    validLength(firstName,13)
    validLength(lastName,13)
    validLength(studentId,13)
    {
        require(numberOfTickets > 0 && numberOfTickets <= MAX_TICKETS_PER_PURCHASE, "Ticket purchase exceeds limit");

        for (uint8 i = 0; i < numberOfTickets; i++) {
            Participant memory participant = Participant(firstName, lastName, studentId, msg.sender);
            uint8 ticketId = totalTicketsInGame++;
            tickets.push(ticketId);
            ticketOwner[ticketId] = participant;
            ticketsByOwner[msg.sender].push(ticketId);
        }
    }

    function drawWinners(uint8 numberOfWinners) external onlyAuthorized {
        require(numberOfWinners <= tickets.length, "More winners than tickets available");

        for (uint8 i = 0; i < numberOfWinners; i++) {
            uint8 winnerIndex = uint8(uint(random() % tickets.length));
            uint8 winnerTicket = tickets[winnerIndex];
            arrayWinningTicketsId.push(winnerTicket);
            isWinningTicket[winnerTicket] = true; // Mark as winner
            // Remove the selected ticket from the pool to avoid duplicates
            // Assign the last ticket in place for the winning one
            // Then pop it
            tickets[winnerIndex] = tickets[tickets.length - 1];
            tickets.pop();
        }
    }

    // Updated to return participant details
    function getWinnerDetails(uint8 ticket) external view onlyAuthorized returns (string memory, string memory, string memory) {
        Participant memory winner = ticketOwner[ticket];
        return (winner.firstName, winner.lastName, winner.studentId);
    }

    function checkThisAccWinningTickets() public view returns (uint8[] memory) {
        uint8[] memory myTickets = ticketsByOwner[msg.sender];
        uint8[] memory myWinners = new uint8[](myTickets.length);
        uint8 winnerCount = 0;
        for (uint8 i = 0; i < myTickets.length; i++) {
            if (isWinner(myTickets[i])) {
                myWinners[winnerCount++] = myTickets[i];
            }
        }
        // Resize the array to only include found arrayWinningTicketsId
        uint8[] memory finalWinners = new uint8[](winnerCount);
        for (uint8 j = 0; j < winnerCount; j++) {
            finalWinners[j] = myWinners[j];
        }
        return finalWinners;
    }

    function resetLottery() external onlyOwner {
        // Reset total tickets in game
        totalTicketsInGame = 0;

        // Clear the array of tickets
        delete tickets;

        // Reset each participant's list of tickets and the ticket ownership mapping
        for (uint8 i = 0; i < totalTicketsInGame; i++) {
            uint8 ticketId = tickets[i];
            delete ticketsByOwner[ticketOwner[ticketId].walletAddress];
            delete ticketOwner[ticketId];
        }

        // Clear the array of winners
        delete arrayWinningTicketsId;

        // Reset the isWinningTicket mapping for all ticket IDs
        for (uint8 j = 0; j < arrayWinningTicketsId.length; j++) {
            delete isWinningTicket[arrayWinningTicketsId[j]];
        }
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

    function isWinner(uint8 ticketNumber) public view returns (bool) {
        return isWinningTicket[ticketNumber];
    }
}
