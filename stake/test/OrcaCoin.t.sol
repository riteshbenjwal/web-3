// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

import "src/OrcaCoin.sol";

contract OrcaCoinTest is Test {
    OrcaCoin c;

    function setUp() public {
        c = new OrcaCoin(address(this));
    }

    function testInitialSupply() public view{
        assert(c.totalSupply() == 0);
    }

    function testFailMint() public {
        vm.startPrank(0xF32ef66ED91C693bfc0A2c9874660D3C282A175f);
        c.mint(0xF32ef66ED91C693bfc0A2c9874660D3C282A175f, 10);
    }

    function testMint() public {
        c.mint(0xF32ef66ED91C693bfc0A2c9874660D3C282A175f, 10);
        assert(c.balanceOf(0xF32ef66ED91C693bfc0A2c9874660D3C282A175f)== 10);
    }

    function testChangeStakingContract() public {
        c.updateStakingContract(0xF32ef66ED91C693bfc0A2c9874660D3C282A175f);
        vm.startPrank(0xF32ef66ED91C693bfc0A2c9874660D3C282A175f);
        c.mint(0xF32ef66ED91C693bfc0A2c9874660D3C282A175f, 10);
        assert(c.balanceOf(0xF32ef66ED91C693bfc0A2c9874660D3C282A175f)== 10);
    }

}
