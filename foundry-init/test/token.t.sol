// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import { MyToken } from "../src/token.sol";

contract CounterTest is Test {
    MyToken public token;

    function setUp() public {
        token = new MyToken();
    }

    function test_Increment() public {
        token.mint(address(this), 100);
        assertEq(token.balanceOf(address(this)), 100);
        token.mint(0x075c299cf3b9FCF7C9fD5272cd2ed21A4688bEeD, 100);
        assertEq(token.balanceOf(0x075c299cf3b9FCF7C9fD5272cd2ed21A4688bEeD), 100);
    }
      
    function test_Transfer() public {
        token.mint(address(this), 100);
        token.transfer(0x075c299cf3b9FCF7C9fD5272cd2ed21A4688bEeD, 100);
        assertEq(token.balanceOf(0x075c299cf3b9FCF7C9fD5272cd2ed21A4688bEeD), 100);
        assertEq(token.balanceOf(address(this)), 0);
    }

    function test_Approve() public {
        token.mint(address(this), 100); 
        token.approve(0x075c299cf3b9FCF7C9fD5272cd2ed21A4688bEeD, 100);
        uint amount = token.allowance(address(this), 0x075c299cf3b9FCF7C9fD5272cd2ed21A4688bEeD);
        assertEq(amount, 100);
        vm.prank(0x075c299cf3b9FCF7C9fD5272cd2ed21A4688bEeD);
        token.transferFrom(address(this), 0x075c299cf3b9FCF7C9fD5272cd2ed21A4688bEeD, 100);
        assertEq(token.balanceOf(address(this)), 0);
        assertEq(token.balanceOf(0x075c299cf3b9FCF7C9fD5272cd2ed21A4688bEeD), 100);
    }


    function testFail_Mint() public {
    assertEq(token.balanceOf(address(this)), 200);
    token.mint(0x075c299cf3b9FCF7C9fD5272cd2ed21A4688bEeD, 100);
    assertEq(token.balanceOf(0x075c299cf3b9FCF7C9fD5272cd2ed21A4688bEeD), 200);
}

function testFail_Transfer() public {
    token.transfer(0x075c299cf3b9FCF7C9fD5272cd2ed21A4688bEeD, 100);
}

function testFail_Allowance() public {
    token.mint(address(this), 100);
    vm.prank(0x075c299cf3b9FCF7C9fD5272cd2ed21A4688bEeD);
    token.transferFrom(address(this), 0x075c299cf3b9FCF7C9fD5272cd2ed21A4688bEeD, 100);
    assertEq(token.balanceOf(address(this)), 0);
    assertEq(token.balanceOf(0x075c299cf3b9FCF7C9fD5272cd2ed21A4688bEeD), 100);
}
}
