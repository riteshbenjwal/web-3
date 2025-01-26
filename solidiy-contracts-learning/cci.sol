// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

interface IStorageContract {
    function getNum() external view returns (uint);
    function add() external; 
}

contract Contract2 {
   constructor (){

   }

   function proxyAdd() public {
     IStorageContract(0x358AA13c52544ECCEF6B0ADD0f801012ADAD5eE3).add();
   }   

   function proxyGet() public view returns (uint){
    uint value = IStorageContract(0x358AA13c52544ECCEF6B0ADD0f801012ADAD5eE3).getNum();
    return value;
   }
}