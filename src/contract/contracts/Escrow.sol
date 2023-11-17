// SPDX-License-Identifier: MIT
// @author: Mudit Mahajan
// @date: 17/11/2023

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";

// @notice: Escrow contract for the marketplace to hold the funds until the buyer confirms the delivery of the service
// @dev: The contract inherits the Ownable contract from OpenZeppelin to make updates to the platform fee and platform address
// @dev: The contract stores the transaction details and the token in it until confirmed by the buyer

contract Escrow is Ownable {
    uint public platformFee = 1; // 1%
    address public platformAddress = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;

    // @dev: The State enum lists all the possible states of the transaction
    enum State {
        AWAITING_PAYMENT,
        AWAITING_DELIVERY,
        COMPLETE,
        REFUNDED,
        REJECTED
    }

    // @dev: The currState variable stores the current state of the transaction
    State public currState;

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

    constructor() Ownable(platformAddress) {
        currState = State.AWAITING_PAYMENT;
    }

    // @dev: The initiateTransaction function is called by the buyer to initiate the transaction
    function initiateTransaction(
        address _seller,
        uint256 _amount
    ) public payable {
        require(msg.value >= _amount, "Amount sent does not match item price");
        require(currState == State.AWAITING_PAYMENT, "Invalid state");
        transactions[transactionCount] = Transaction({
            buyer: msg.sender,
            seller: _seller,
            amount: _amount,
            status: State.AWAITING_DELIVERY
        });
        emit TransactionInitiated(
            transactionCount,
            msg.sender,
            _seller,
            _amount
        );
        transactionCount++;
    }

    function confirmDelivery(
        uint256 _transactionId
    )
        public
        onlyBuyer(_transactionId)
        inStatus(_transactionId, State.AWAITING_DELIVERY)
    {
        Transaction storage transaction = transactions[_transactionId];
        transaction.status = State.COMPLETE;
        payable(transaction.seller).transfer(
            transaction.amount - ((transaction.amount * platformFee) / 100)
        );
        payable(platformAddress).transfer(
            (transaction.amount * platformFee) / 100
        );
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
    {
        Transaction storage transaction = transactions[_transactionId];
        transaction.status = State.REFUNDED;
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
    {
        Transaction storage transaction = transactions[_transactionId];
        transaction.status = State.REJECTED;
        payable(transaction.buyer).transfer(transaction.amount);
        emit TransactionRejected(
            _transactionId,
            transaction.buyer,
            transaction.seller,
            transaction.amount
        );
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function setPlatformFee(uint _platformFee) public onlyOwner {
        platformFee = _platformFee;
    }

    function getPlatformFee() public view returns (uint) {
        return platformFee;
    }

    function setPlatformAddress(address _platformAddress) public onlyOwner {
        platformAddress = _platformAddress;
    }

    function getPlatformAddress() public view returns (address) {
        return platformAddress;
    }

		function getTransaction (uint256 _transactionId) public view returns (Transaction memory) {
			return transactions[_transactionId];
		}
}
