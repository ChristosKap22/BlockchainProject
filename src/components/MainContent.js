import React, { Component } from 'react';
import Car from '../car.jpg'
import Phone from "../phone.jpg"
import Computer from "../desktop.jpg"


class MainContent extends Component {
  render() {
    return (
        <div className="container-fluid">
            <table className="table table-borderless text-white p-3 m-3">
                <thead>
                    <tr className="text-left">
                        <th><h1>Car</h1></th>
                        <th><h1>Phone</h1></th>
                        <th><h1>Computer</h1></th>
                    </tr>
                </thead>
                <tbody >
                    <tr>
                        <td><img src={Car} className=" Car-img" alt='Could not load'></img></td>
                        <td><img src={Phone} className=" Phone-img" alt='Could not load '></img></td>
                        <td><img src={Computer} className=" Computer-img" alt='Could not load '></img></td>
                    </tr>
                    <tr>
                        <td>
                            <button type="button" className='btn float-left btn-light ' 
                                onClick={(event)=>this.props.bid(0)}>Bid</button>
                                <div className='float-right'>{this.props.revealCounts ? this.props.carBidCount : null}</div>
                        </td>
                        <td>
                            <button type="button" className='btn float-left btn-light ' 
                                onClick={(event)=>this.props.bid(1)}>Bid</button>
                                <div className='float-right'>{this.props.revealCounts ? this.props.phoneBidCount : null}</div>
                        </td>
                        <td>
                            <button type="button" className='btn float-left btn-light ' 
                                onClick={(event)=>this.props.bid(2)}>Bid</button>
                                <div className='float-right'>{this.props.revealCounts ? this.props.computerBidCount : null}</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
  }
}

export default MainContent;


