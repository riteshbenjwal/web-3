// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "src/OrcaCoin.sol";

contract StakingContractv2 {
    mapping(address => uint) balances;
    mapping(address => uint) unclaimedRewards;
    mapping(address => uint) lastUpdateTime;
    OrcaCoin public orcaToken;

  constructor(address _orcaToken) {
        orcaToken = OrcaCoin(_orcaToken);
    }

    function stake() public payable {
        require(msg.value > 0, "Stake amount must be greater than zero");    
        if (lastUpdateTime[msg.sender] == 0) {
            lastUpdateTime[msg.sender] = block.timestamp;
        } else {
            unclaimedRewards[msg.sender] += (block.timestamp - lastUpdateTime[msg.sender]) * balances[msg.sender];
            lastUpdateTime[msg.sender] = block.timestamp;
        }
        balances[msg.sender] += msg.value;
    }

    function unstake(uint _amount) public {
        require(_amount > 0, "Unstake amount must be greater than zero");
        require(_amount <= balances[msg.sender], "Insufficient balance to unstake");
        
        unclaimedRewards[msg.sender] += (block.timestamp - lastUpdateTime[msg.sender]) * balances[msg.sender];
        lastUpdateTime[msg.sender] = block.timestamp;
        
        balances[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
    }

    function getRewards(address _address) public view returns (uint) {
        uint currentReward = unclaimedRewards[_address];
        uint updateTime = lastUpdateTime[_address];
        uint newReward = (block.timestamp - updateTime) * balances[_address];
        return currentReward + newReward;
    } 

    function claimRewards() public {
        uint currentReward = unclaimedRewards[msg.sender];
        uint updateTime = lastUpdateTime[msg.sender];
        uint newReward = (block.timestamp - updateTime) * balances[msg.sender];
        uint totalReward = currentReward + newReward;
        
        if (totalReward > 0) {
            orcaToken.mint(msg.sender, totalReward);
            unclaimedRewards[msg.sender] = 0;
            lastUpdateTime[msg.sender] = block.timestamp;
        }
    }
    
    function balanceOf(address _address) public view returns (uint) {
        return balances[_address];
    }
}
