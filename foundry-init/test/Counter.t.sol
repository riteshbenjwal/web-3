// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

import "src/Counter.sol";

contract TestCounter is Test {
    Counter c;

    function setUp() public {
        c = new Counter(0);
    }

    function testValue() public {
        assertEq(c.getCount(), uint(0), "ok");
    }

    function testFailDecrement() public {
        c.decrement();
    }
}