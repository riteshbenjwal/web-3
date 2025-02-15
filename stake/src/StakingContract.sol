// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

contract StakingProxy {
    uint256 public totalStaked;
    mapping(address => uint256) public stakedBalances;
    
    address public implementation;

    constructor(address _implementation) {
        implementation = _implementation;
    }

    receive() external payable {}

    fallback() external payable {
        // Forward the call to the implementation contract
        (bool success, ) = implementation.delegatecall(msg.data);
        require(success, "Delegatecall failed");
    }
}

contract StakingContract { 
    uint256 public totalStaked;
    mapping(address => uint256) public stakedBalances;

    function stake() public payable {
        require(msg.value > 0, "Amount must be greater than 0");
        totalStaked += msg.value;
        stakedBalances[msg.sender] += msg.value;
    }

    function unstake(uint256 amount) public {
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= stakedBalances[msg.sender], "Not enough balance");
        
        totalStaked -= amount;
        stakedBalances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }
}