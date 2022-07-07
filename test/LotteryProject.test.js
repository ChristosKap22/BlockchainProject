const { assert } = require("chai")
const { default: Web3 } = require("web3")

const LotteryProject = artifacts.require("./LotteryProject")

contract("LotteryProject",([owner, bidder1,bidder2]) => {
    let lottery 

    before(async()=>{
        lottery = await LotteryProject.deployed()
    })

    describe('Deployment', async() =>{
        it('deployed successfully', async()=>{
            const address = await lottery.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })
        it('Valid co-owner', async () => {
            const co_owner = await lottery.coOwner()
            assert.equal(co_owner, 0x153dfef4355E823dCB0FCc76Efe942BefCa86477)
        })
        it('Valid prize 1', async () => {
            const prize1 = await lottery.arrayOfPrizes(0)
            assert.equal(prize1.name, "Car")
            assert.equal(prize1.winnerDeclared, false)
            assert.equal(prize1.numberOfBids, 0)
        })
        it('Valid prize 2', async () => {
            const prize1 = await lottery.arrayOfPrizes(1)
            assert.equal(prize1.name, "Phone")
            assert.equal(prize1.winnerDeclared, false)
            assert.equal(prize1.numberOfBids, 0)
        })
        it('Valid prize 3', async () => {
            const prize1 = await lottery.arrayOfPrizes(2)
            assert.equal(prize1.name, "Computer")
            assert.equal(prize1.winnerDeclared, false)
            assert.equal(prize1.numberOfBids, 0)
        })
    })
    describe('Bidding', async() =>{
        let result, numberOfBids, arrayOfPrizes, arrayOfOdds, result2
        
        before(async() =>{
            result = await lottery.bid(0, {from: bidder1, value: web3.utils.toWei('0.2', 'Ether')})
            arrayOfPrizes = await lottery.arrayOfPrizes(0)
            numberOfBids = arrayOfPrizes.numberOfBids
        })

        it('Bids successfully', async()=>{
            assert.equal(numberOfBids, 1)
            const event = result.logs[0].args
            assert.equal(event._sender, bidder1)
            assert.equal(event._receiver, owner)
            assert.equal(event.amount, web3.utils.toWei('0.1', 'Ether')) 
        })
    })

    describe('Revealing', async() =>{
        let result
        
        before(async() =>{
            await lottery.bid(0, {from: bidder1, value: web3.utils.toWei('0.1', 'Ether')})
            await lottery.bid(0, {from: bidder1, value: web3.utils.toWei('0.1', 'Ether')})
            await lottery.bid(1, {from: bidder2, value: web3.utils.toWei('0.1', 'Ether')})
            await lottery.bid(2, {from: bidder2, value: web3.utils.toWei('0.1', 'Ether')})
        })

        it('Reveals successfully', async()=>{
            result = await lottery.reveal()
            assert.equal(result.bidCount1.words[0], 3)
            assert.equal(result.bidCount2.words[0], 1)
            assert.equal(result.bidCount3.words[0], 1)
        })
    })

    describe('WinnerDeclaration', async() =>{
        let result
        
        before(async() =>{
            await lottery.bid(0, {from: bidder1, value: web3.utils.toWei('0.1', 'Ether')})
            await lottery.bid(2, {from: bidder1, value: web3.utils.toWei('0.1', 'Ether')})
            await lottery.bid(1, {from: bidder2, value: web3.utils.toWei('0.1', 'Ether')})
        })

        it('Declares successfully', async()=>{
            result = await lottery.declareWinner({from: owner})
            const event = result.logs[0].args
            console.log(event)
        })
    })
    
})