// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import { MyToken } from "../src/token.sol";

contract CounterTest is Test {
    MyToken public token;
    
    event Transfer(address indexed from, address indexed to, uint256 amount);

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

function test_ExpectEmit() public {
        token.mint(address(this), 100);
        // Check that topic 1, topic 2, and data are the same as the following emitted event.
        // Checking topic 3 here doesn't matter, because `Transfer` only has 2 indexed topics.
        vm.expectEmit(true, true, false, true);
        // The event we expect
        emit Transfer(address(this), 0x075c299cf3b9FCF7C9fD5272cd2ed21A4688bEeD, 100);
        // The event we get
        token.transfer(0x075c299cf3b9FCF7C9fD5272cd2ed21A4688bEeD, 100);
    }
    
    // function test_ExpectEmitApprove() public {
    //     token.mint(address(this), 100);
        
    //     vm.expectEmit(true, true, false, true);
    //     emit Approval(address(this), 0x075c299cf3b9FCF7C9fD5272cd2ed21A4688bEeD, 100);

    //     token.approve(0x075c299cf3b9FCF7C9fD5272cd2ed21A4688bEeD, 100);
    //     vm.prank(0x075c299cf3b9FCF7C9fD5272cd2ed21A4688bEeD);
    //     token.transferFrom(address(this), 0x075c299cf3b9FCF7C9fD5272cd2ed21A4688bEeD, 100);
    // }
}
