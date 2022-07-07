// SPDX-License-Identifier: MIT

pragma solidity ^0.5.0;

contract LotteryProject{

    // Declare prizes as a struct, to contain information in a more solid and abstract way
    struct prize {
        uint id;
        string name;
        uint numberOfBids;
        // Toggle for winning condition declaration
        bool winnerDeclared;
    }

    // Implemantation based of lab 7
    address[] public oddStackingForCarBidders;
    uint8 public carCounter;
    address[] public oddStackingForPhoneBidders;
    uint8 public phoneCounter;
    address[] public oddStackingForComputerBidders;
    uint8 public computerCounter;

    // Store all prizes in array
    prize[3] public arrayOfPrizes;
    address payable public owner;
    address payable public coOwner;

    // Winners will be set here
    address[3] public winners;

    event LogDeposit(
        uint _id,
        address payable _sender,
        address payable _receiver,
        uint amount
    );

    event LogWinner(
        uint _id,
        address _winningAddress
    );

    constructor() public {

        // Initialize prize values
        arrayOfPrizes[0].id = 0;
        arrayOfPrizes[0].name = "Car";
        arrayOfPrizes[0].numberOfBids = 0;
        arrayOfPrizes[0].winnerDeclared = false;

        arrayOfPrizes[1].id = 1;
        arrayOfPrizes[1].name = "Phone";
        arrayOfPrizes[1].numberOfBids = 0;
        arrayOfPrizes[1].winnerDeclared = false;

        arrayOfPrizes[2].id = 2;
        arrayOfPrizes[2].name = "Computer";
        arrayOfPrizes[2].numberOfBids = 0;
        arrayOfPrizes[2].winnerDeclared = false;  

        owner =  msg.sender;
        coOwner = 0x153dfef4355E823dCB0FCc76Efe942BefCa86477;
    }

    modifier onlyOwnerAndCoowner(){
        require(msg.sender == owner || msg.sender == coOwner);
        _;
    }

    modifier onlyBidders(){
        require(msg.sender != owner && msg.sender != coOwner);
        _;
    }

    function bid(uint _id) public payable onlyBidders {
        require(msg.value > .01 ether);
        require(arrayOfPrizes[_id].winnerDeclared == false);

        if(_id == 0){
            oddStackingForCarBidders.push(msg.sender) ;
            carCounter ++;
        }
        else if(_id == 1){
            oddStackingForPhoneBidders.push(msg.sender) ;
            phoneCounter ++;
        }
        else{
            oddStackingForComputerBidders.push(msg.sender) ;
            computerCounter ++;
        }

        arrayOfPrizes[_id].numberOfBids ++;
        if(owner != coOwner)
            emit LogDeposit(_id, msg.sender, owner, 0.1 ether);
        else
            emit LogDeposit(_id, msg.sender, coOwner, 0.1 ether);
    }

    function reveal() public view returns(uint bidCount1, uint bidCount2, uint bidCount3) {
        bidCount1 = arrayOfPrizes[0].numberOfBids;
        bidCount2 = arrayOfPrizes[1].numberOfBids; 
        bidCount3 = arrayOfPrizes[2].numberOfBids; 
    }

    function random(address[] memory _arrayToUse) private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, now, _arrayToUse)));
    }

    function revealWinner() public view onlyBidders returns(address[3] memory ){
        require(arrayOfPrizes[0].winnerDeclared == true && arrayOfPrizes[1].winnerDeclared == true && arrayOfPrizes[2].winnerDeclared == true);
        return winners;
    }

    function declareWinner() public onlyOwnerAndCoowner{
        uint _index;
        for(uint _i = 0; _i < 3; _i++){
            arrayOfPrizes[_i].winnerDeclared = true;
            
            if(_i == 0){
                _index = random(oddStackingForCarBidders) % oddStackingForCarBidders.length;
                winners[_i] = oddStackingForCarBidders[_index];
                emit LogWinner(_index, winners[_i]);
            }
            else if(_i == 1){
                _index = random(oddStackingForPhoneBidders) % oddStackingForPhoneBidders.length;
                winners[_i] = oddStackingForPhoneBidders[_index];
                emit LogWinner(_index, winners[_i]);
            }
            else{
                _index = random(oddStackingForComputerBidders) % oddStackingForComputerBidders.length;
                winners[_i] = oddStackingForComputerBidders[_index];
                emit LogWinner(_index, winners[_i]);
            }
            
        }
    }

    function withdraw() public payable onlyOwnerAndCoowner{
        if(owner != coOwner)
            owner.transfer(address(this).balance);
        else
            coOwner.transfer(address(this).balance);
    }

}