// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ChatPayment is Ownable {
    uint256 public constant MESSAGE_COST = 0.001 ether;
    
    event MessagePaid(address indexed user, uint256 amount, uint256 timestamp);
    event PaymentRefunded(address indexed user, uint256 amount);

    constructor() Ownable(msg.sender) {}

    function payForMessage() external payable {
        require(msg.value == MESSAGE_COST, "Payment must be exactly 0.001 ETH");
        
        emit MessagePaid(msg.sender, msg.value, block.timestamp);
    }

    function withdrawFunds() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    function refundPayment() external payable {
        require(msg.value == MESSAGE_COST, "Invalid refund amount");
        
        (bool success, ) = msg.sender.call{value: msg.value}("");
        require(success, "Refund failed");
        
        emit PaymentRefunded(msg.sender, msg.value);
    }

    receive() external payable {
        revert("Use payForMessage() to make payments");
    }

    fallback() external payable {
        revert("Use payForMessage() to make payments");
    }
}
