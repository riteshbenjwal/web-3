// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract Money{
    uint public totalMoney;

    constructor() {}

    function deposit() public payable  {
        totalMoney += msg.value;
    }

    function drain(address payable ad) public {
        payable(ad).transfer(totalMoney);
        totalMoney = 0;
    }

    function getTotalMoney() public view returns (uint){
        return totalMoney;
    }

}