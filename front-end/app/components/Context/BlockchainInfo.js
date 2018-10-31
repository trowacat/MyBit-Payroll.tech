import React from 'react';
import PropTypes from 'prop-types';
import BlockchainInfoContext from './BlockchainInfoContext';
import * as Core from '../../utils/core';
import Web3 from '../../utils/core';

class BlockchainInfo extends React.Component {
  constructor(props) {
    super(props);

    this.loadMetamaskUserDetails = this.loadMetamaskUserDetails.bind(this);
    this.createTrust = this.createTrust.bind(this);
    this.getCurrentBlockNumber = this.getCurrentBlockNumber.bind(this);
    this.getPayrolls = this.getPayrolls.bind(this);
    this.withdraw = this.withdraw.bind(this);
    this.requestApproval = this.requestApproval.bind(this);
    this.checkAddressAllowed = this.checkAddressAllowed.bind(this);
    this.getNetwork = this.getNetwork.bind(this);

    this.state = {
      loading: {
        user: true,
        PayrollHistory: true,
        network: true,
      },
      sentPayrolls: [],
      receivedPayrolls: [],
      user: {
        myBitBalance: 0,
        etherBalance: 0,
        userName: ""
      },
      createTrust: this.createTrust,
      currentBlock: 0,
      getPayrolls: this.getPayrolls,
      withdraw: this.withdraw,
      requestApproval: this.requestApproval,
      checkAddressAllowed: this.checkAddressAllowed,
      //can be ropsten or main - else unknown
      network: ""
    };
  }

  async componentWillMount() {
    this.getPayrollsInterval = setInterval(this.getPayrolls, 10000);
    this.getUserDetailsInterval = setInterval(this.loadMetamaskUserDetails, 5000);

    try {
      //we need this to pull the user details
      await this.getNetwork();

      // we need the prices and the user details before doing anything
      await Promise.all([this.loadMetamaskUserDetails(this.state.network), this.getCurrentBlockNumber()]);
      do{
        await this.checkAddressAllowed();
      }while(!this.state.user.userName)
      await this.getPayrolls();
    } catch (err) {
      console.log(err);
    }
  }

  async getNetwork(){
    try{
      new Promise(async (resolve, reject) => {
        let network = await Web3.eth.net.getNetworkType();

        this.setState({network, loading: {
          ...this.state.loading,
          network: false,
        }}, () => resolve())
      });
    }catch(err){
      setTimeout(this.getNetwork, 1000);
    }
  }

  async componentWillUnmount(){
    clearInterval(this.getPayrollsInterval);
    clearInterval(this.getUserDetailsInterval);
  }

  async requestApproval(){
    return Core.requestApproval(this.state.user.userName, this.state.network);
  }

  async checkAddressAllowed(){
    try{
      const allowed = await Core.getAllowanceOfAddress(this.state.user.userName, this.state.network);
      this.setState({userAllowed: allowed});
    }catch(err){
      console.log(err);
    }
  }

  async getCurrentBlockNumber(){
    try{
      const currentBlock = await Web3.eth.getBlockNumber();
      this.setState({currentBlock})
    }catch(err){
      setTimeout(this.getCurrentBlockNumber, 1000);
    }
  }

  createTrust(to, amount, revokable, deadline) {
    return Core.createTrust(this.state.user.userName, to, amount, revokable, deadline, this.state.network);
  }

  withdraw(contractAddress) {
    return Core.withdraw(contractAddress, this.state.user.userName, this.state.network);
  }

  async getPayrolls(){
    await Core.getTrustLog(this.state.network)
      .then( async (response) => {
        const userAddress = this.state.user.userName;
        const receivedPayrollsTmp = [];
        const sentPayrolls = [];

    try{
      response.forEach(Payroll => {
        if(Payroll.returnValues._beneficiary === userAddress){
          receivedPayrollsTmp.push({
            contractAddress: Payroll.returnValues._trustAddress,
            trustor: Payroll.returnValues._trustor,
            amount: Web3.utils.fromWei(Payroll.returnValues._amount.toString(), 'ether'),
            PayrollHash: Payroll.PayrollHash,
          })
        }
        else if(Payroll.returnValues._trustor === userAddress){
          sentPayrolls.push({
            beneficiary: Payroll.returnValues._beneficiary,
            amount: Web3.utils.fromWei(Payroll.returnValues._amount.toString(), 'ether'),
            PayrollHash: Payroll.PayrollHash
          })
        }
      })
     }catch(err){
      console.log(err)
     }

      let receivedPayrolls = [];
      if(receivedPayrollsTmp.length !== 0){
        const withdrawableByTime =  await Promise.all(receivedPayrollsTmp.map(async Payroll =>
        Core.isWithdrawable(Payroll.contractAddress, this.state.network)));

        receivedPayrolls = await Promise.all(receivedPayrollsTmp.map( async (Payroll, index) => {
            const withdrawals = await Core.getWithdrawlsLog(Payroll.contractAddress, this.state.network);
            const deposits = await Core.getDepositsLog(Payroll.contractAddress, this.state.network);
            let canWithdraw = true;

            //block number of last withdrawal event is higher than block number of last deposit event
            //means there is nothing to withdraw
           if(withdrawals.length > 0 && withdrawals[withdrawals.length-1].blockNumber > deposits[deposits.length - 1].blockNumber){
              canWithdraw = false;
            }

            return{
              ...Payroll,
              withdrawable: canWithdraw,
              pastDate: withdrawableByTime[index],
            }
          }))
      }

      this.setState({
        sentPayrolls,
        receivedPayrolls,
        loading: {
          ...this.state.loading,
          PayrollHistory: false,
        }
      })

      })
      .catch((err) => {
        console.log(err);
      });
  }

  async loadMetamaskUserDetails() {
    await Core.loadMetamaskUserDetails(this.state.network)
      .then((response) => {
        this.setState({
          user: response,
          loading: { ...this.state.loading, user: false },
        });
      })
      .catch((err) => {
        setTimeout(this.loadMetamaskUserDetails, 1000);
      });
  }

  render() {
    return (
      <BlockchainInfoContext.Provider value={this.state}>
        {this.props.children}
      </BlockchainInfoContext.Provider>
    );
  }
}

export default BlockchainInfo;

BlockchainInfo.propTypes = {
  children: PropTypes.node.isRequired,
};
