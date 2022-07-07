import React, { Component } from 'react';

class AccountsViewer extends Component {
  render() {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col pl-3 ml-3">
                    <p className='text-left'>Current Account: </p>
                </div>
                <div className="col pr-3 mr-3">
                    <p className='text-right'>Owner Account:</p>
                </div>
            </div>
            <div className="row">
                <div className="col pl-3 ml-3">
                    <p className='text-left'>{this.props.currentAccount} </p>
                </div>
                <div className="col pr-3 mr-3">
                    <p className='text-right'>{this.props.ownerAccount}</p>
                </div>
            </div>
        </div>
    );
  }
}

export default AccountsViewer;