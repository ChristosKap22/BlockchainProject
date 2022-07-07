import React, { Component } from 'react';
import Web3 from 'web3';
import LotteryProject from '../abis/LotteryProject.json'
import './App.css';
import MainContent from './MainContent';
import AccountsViewer from './AccountsViewer';

class App extends Component {

  async componentDidMount() {
    const web3 = await this.loadWeb3()
    await this.loadBlockchainData(web3)
  }

  async loadWeb3() {
    return new Promise(async (resolve, reject) => {
      const web3 = new Web3(window.ethereum)
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        resolve(web3)
      } catch (error) {
        reject(error)
      }
    })
  }

  async loadBlockchainData(web3) {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = LotteryProject.networks[networkId]

    if (networkData) {
      const lottery = web3.eth.Contract(LotteryProject.abi, networkData.address)
      const Owner = await lottery.methods.owner.call()
      const CoOwner = await lottery.methods.coOwner.call()

      this.setState({coOwner: CoOwner})
      this.setState({owner: Owner})
      this.setState({lottery})
      this.setState({loading: false})

      if(this.state.account.toLowerCase() !== this.state.owner.toLowerCase() && this.state.account.toLowerCase() !== this.state.coOwner.toLowerCase())
        this.setState({hideButtons: true})
      else
        this.setState({hideButtons: false})

    } else {
      window.alert("Contract not deployed to detected network")
    }
  }

  bid = async (id) => {
    await this.state.lottery.methods.bid(id).send({
      from: this.state.account,
      gas: 1608223 ,
      value: 200000000000000000
    })
    window.alert("Bidding in action ...")
  }

  reveal = async ()=>{
    this.setState({loading: true})
    const result = await this.state.lottery.methods.reveal().call()
    this.setState({
      carBidCount: result[0].toNumber(),
      phoneBidCount: result[1].toNumber(),
      computerBidCount: result[2].toNumber(),
      revealCounts: true,
      loading: false,
    })
  }

  revealWinners = async () =>{
    if(this.state.account === this.state.owner || this.state.account === this.state.coOwner)
      window.alert("This action can only be done by bidders!")
    else{
      this.setState({loading: true})
      const results = await this.state.lottery.methods.revealWinner().call({
        from: this.state.account
      }
    )
      this.setState({
        loading: false,
        carWinner: results[0].toString(),
        phoneWinner: results[1].toString(),
        computerWinner: results[2].toString(),
        showWinners: true
      })
    }
  }

  declareWinner = async () =>{
    await this.state.lottery.methods.declareWinner().send({
      from: this.state.account,
      gas: 1608223
    })
  }

  withdraw = async () =>{
    await this.state.lottery.methods.withdraw().send({
      from: this.state.account,
      gas: 1608223
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      owner: '',
      coOwner: '',
      account: '',
      carBidCount: 0,
      phoneBidCount: 0,
      computerBidCount: 0,
      carWinner: '',
      phoneWinner: '',
      computerWinner: '',
      showWinners: false,
      hideButtons: false,
      revealCounts: false,
      loading: true
    };

    this.bid = this.bid.bind(this)
    this.revealWinners = this.revealWinners.bind(this)
    this.reveal = this.reveal.bind(this)
    this.declareWinner = this.declareWinner.bind(this)
    this.withdraw = this.withdraw.bind(this)
    
  }

  render() {
    return (
      <div className='container-fluid text-white'>
          <h1 className='text-left p-4 ml-1'>Lottery</h1>
          <main role="main" className="col-lg-12 d-flex">
            {this.state.loading ? 
              <div id='loader' className='="text-center'>
                <h1 className='text-center'>Loading..</h1>
              </div>: <MainContent 
              bid = {this.bid}
              carBidCount = {this.state.carBidCount}
              phoneBidCount = {this.state.phoneBidCount}
              computerBidCount = {this.state.computerBidCount}
              revealCounts = {this.state.revealCounts}
              />}
          </main>
          <div >
            <AccountsViewer 
            currentAccount={this.state.account} 
            ownerAccount={this.state.owner}/>
          </div>
          <div className="container-fluid">
            <div className="row">
                <div className="col p-3 ml-3">
                    <button 
                        type="button" 
                        className="btn float-left btn-primary"
                        onClick={this.reveal}>Reveal</button>
                </div>
                {this.state.hideButtons ? null :
                <div className="col p-3 mr-3">
                    <button 
                      type="button" 
                      className="btn float-right btn-danger"
                      onClick={this.withdraw}>Withdraw</button>
                </div>}
            </div>
            <div className="row">
                <div className="col p-3 ml-3">
                    <button 
                      type="button" 
                      className="btn float-left btn-primary"
                      onClick={this.revealWinners}>Am I a Winner
                      </button>
                </div>
                {this.state.hideButtons ? null :
                <div className="col p-3 mr-3">
                    <button 
                      type="button" 
                      className="btn float-right btn-danger"
                      onClick= {this.declareWinner}>Declare Winner</button>
                </div>}
            </div>
            <div className="row">
                <div className="col p-3 ml-3">
                      <div>
                        {this.state.showWinners ? 
                        "Car winner is: " + this.state.carWinner +  
                        " Phone winner is: " + this.state.phoneWinner +  
                        " Computer winner is: " + this.state.computerWinner
                        : null}
                      </div>
                </div>
            </div>
          </div>
      </div>
    );
  }
}

export default App;
