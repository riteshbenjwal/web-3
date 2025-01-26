// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract InheritanceContract {
    struct Account {
        uint256 balance;
        uint256 lastActiveTime;
        address[] heirs;
    }

    // Mapping to store user data
    mapping(address => Account) private accounts;

    // Time allowed for inactivity before heirs can claim (e.g., 90 days)
    uint256 public constant INACTIVITY_THRESHOLD = 90 days;

    // Event declarations
    event Deposited(address indexed user, uint256 amount);
    event KeepAlive(address indexed user, uint256 timestamp);
    event HeirsRegistered(address indexed user, address[] heirs);
    event Claimed(address indexed heir, address indexed user, uint256 amount);

    // Deposit funds into the contract and optionally register heirs
    function deposit(address[] calldata _heirs) external payable {
        require(msg.value > 0, "Deposit must be greater than 0");

        // Add balance and update activity timestamp
        accounts[msg.sender].balance += msg.value;
        accounts[msg.sender].lastActiveTime = block.timestamp;

        // Register heirs if provided
        if (_heirs.length > 0) {
            accounts[msg.sender].heirs = _heirs;
            emit HeirsRegistered(msg.sender, _heirs);
        }

        emit Deposited(msg.sender, msg.value);
    }

    // Allow the user to signal they're alive and active
    function keepAlive() external {
        require(accounts[msg.sender].balance > 0, "No balance to keep alive");
        accounts[msg.sender].lastActiveTime = block.timestamp;
        emit KeepAlive(msg.sender, block.timestamp);
    }

    // Heirs can claim the funds if the user is inactive
    function claim(address _user) external {
        Account storage userAccount = accounts[_user];
        require(
            block.timestamp > userAccount.lastActiveTime + INACTIVITY_THRESHOLD,
            "User is still active"
        );

        // Check if the caller is a registered heir
        bool isHeir = false;
        for (uint256 i = 0; i < userAccount.heirs.length; i++) {
            if (userAccount.heirs[i] == msg.sender) {
                isHeir = true;
                break;
            }
        }
        require(isHeir, "Caller is not a registered heir");

        // Transfer funds to the heir
        uint256 amount = userAccount.balance;
        userAccount.balance = 0;
        payable(msg.sender).transfer(amount);

        emit Claimed(msg.sender, _user, amount);
    }

    // View function to check user account details
    function getAccountDetails(address _user)
        external
        view
        returns (uint256 balance, uint256 lastActiveTime, address[] memory heirs)
    {
        Account storage userAccount = accounts[_user];
        return (
            userAccount.balance,
            userAccount.lastActiveTime,
            userAccount.heirs
        );
    }
}
