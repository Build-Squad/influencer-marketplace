// SPDX-License-Identifier: MIT
// @author: Mudit Mahajan
// @date: 17/11/2023

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// @notice: Escrow contract for the marketplace to hold the funds until the buyer confirms the delivery of the service
// @dev: The contract inherits the Ownable contract from OpenZeppelin to make updates to the platform fee and platform address
// @dev: The contract stores the transaction details and the token in it until confirmed by the buyer

contract Escrow is Ownable, Pausable, ReentrancyGuard {
    uint public constant INITIAL_PLATFORM_FEE = 1; // 1%
    uint public platformFee = INITIAL_PLATFORM_FEE;
    address public platformAddress;

    // @dev: The State enum lists all the possible states of the transaction
    enum State {
        AWAITING_PAYMENT,
        AWAITING_DELIVERY,
        COMPLETE,
        REFUNDED,
        REJECTED
    }

    struct Transaction {
        address buyer;
        address seller;
        uint256 amount;
        State status;
    }

    // @dev: The mapping stores the transaction details for each transactionId and the transactionCount variable stores the total number of transactions
    mapping(uint256 => Transaction) public transactions;
    uint256 public transactionCount;

    modifier onlyBuyer(uint256 _transactionId) {
        require(
            transactions[_transactionId].buyer == msg.sender,
            "You are not the buyer"
        );
        _;
    }

    modifier onlySeller(uint256 _transactionId) {
        require(
            transactions[_transactionId].seller == msg.sender,
            "You are not the seller"
        );
        _;
    }

    modifier inStatus(uint256 _transactionId, State _status) {
        require(
            transactions[_transactionId].status == _status,
            "Invalid transaction status"
        );
        _;
    }

    event TransactionInitiated(
        uint256 indexed transactionId,
        address buyer,
        address seller,
        uint256 amount
    );
    event TransactionCompleted(
        uint256 indexed transactionId,
        address buyer,
        address seller,
        uint256 amount
    );
    event TransactionRefunded(
        uint256 indexed transactionId,
        address buyer,
        address seller,
        uint256 amount
    );
    event TransactionRejected(
        uint256 indexed transactionId,
        address buyer,
        address seller,
        uint256 amount
    );

    event PlatformFeeUpdated(uint256 platformFee);
    event PlatformAddressUpdated(address platformAddress);

    constructor(address _platformAddress) Ownable(_platformAddress) {
        platformAddress = _platformAddress;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    // @dev: The initiateTransaction function is called by the buyer to initiate the transaction
    function initiateTransaction(
        address _seller,
        uint256 _amount
    ) public payable whenNotPaused {
        require(msg.value >= _amount, "Amount sent does not match item price");
        transactions[transactionCount] = Transaction({
            buyer: msg.sender,
            seller: _seller,
            amount: _amount,
            status: State.AWAITING_DELIVERY
        });
        transactionCount++;
        emit TransactionInitiated(
            transactionCount,
            msg.sender,
            _seller,
            _amount
        );
    }

    function confirmDelivery(
        uint256 _transactionId
    )
        public
        onlyBuyer(_transactionId)
        inStatus(_transactionId, State.AWAITING_DELIVERY)
        nonReentrant
        whenNotPaused
    {
        Transaction storage transaction = transactions[_transactionId];
        uint256 fee = (transaction.amount * platformFee) / 100;
        uint256 sellerAmount = transaction.amount - fee;

        // Check
        require(
            address(this).balance >= sellerAmount + fee,
            "Insufficient contract balance"
        );

        // Effects
        transaction.status = State.COMPLETE;

        // Interaction
        payable(transaction.seller).transfer(sellerAmount);
        payable(platformAddress).transfer(fee);

        emit TransactionCompleted(
            _transactionId,
            transaction.buyer,
            transaction.seller,
            transaction.amount
        );
    }

    function refundTransaction(
        uint256 _transactionId
    )
        public
        onlySeller(_transactionId)
        inStatus(_transactionId, State.AWAITING_DELIVERY)
        nonReentrant
        whenNotPaused
    {
        Transaction storage transaction = transactions[_transactionId];

        // Check
        require(
            address(this).balance >= transaction.amount,
            "Insufficient contract balance"
        );

        // Effects
        transaction.status = State.REFUNDED;

        // Interaction
        payable(transaction.buyer).transfer(transaction.amount);

        emit TransactionRefunded(
            _transactionId,
            transaction.buyer,
            transaction.seller,
            transaction.amount
        );
    }

    function rejectTransaction(
        uint256 _transactionId
    )
        public
        onlySeller(_transactionId)
        inStatus(_transactionId, State.AWAITING_DELIVERY)
        nonReentrant
        whenNotPaused
    {
        Transaction storage transaction = transactions[_transactionId];

        // Check
        require(
            address(this).balance >= transaction.amount,
            "Insufficient contract balance"
        );

        // Effects
        transaction.status = State.REJECTED;

        // Interaction
        payable(transaction.buyer).transfer(transaction.amount);

        emit TransactionRejected(
            _transactionId,
            transaction.buyer,
            transaction.seller,
            transaction.amount
        );
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function setPlatformFee(uint _platformFee) public onlyOwner {
        platformFee = _platformFee;
        emit PlatformFeeUpdated(platformFee);
    }

    function setPlatformAddress(address _platformAddress) public onlyOwner {
        platformAddress = _platformAddress;
        emit PlatformAddressUpdated(platformAddress);
    }

    function getTransaction(
        uint256 _transactionId
    ) public view returns (Transaction memory) {
        return transactions[_transactionId];
    }

    function isPaused() public view returns (bool) {
        return paused();
    }
}
