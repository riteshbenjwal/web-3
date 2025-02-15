// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WTest is ERC20, Ownable {
    constructor() ERC20("WTest", "WTS") Ownable(msg.sender){}

    function mint(address _to, uint256 amount) public onlyOwner {
        _mint(_to, amount);
    }

    function burn(address _from, uint256 amount) public onlyOwner {
        _burn(_from, amount);
    }
}
