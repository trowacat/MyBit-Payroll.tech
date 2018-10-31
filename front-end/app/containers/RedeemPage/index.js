/*
 * PayrollsPage
 *
 * List all the features
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import Table from 'antd/lib/table';
import Pagination from 'antd/lib/pagination';
import 'antd/lib/table/style/css';
import 'antd/lib/pagination/style/css';
import Constants from 'components/Constants';
import QuestionMark from 'components/Input/questionMark.svg';
import Img from 'components/Img';
import Button from 'components/Button';
import Tooltip from 'components/Tooltip';
import ConnectionStatus from 'components/ConnectionStatus';

const StyledButton = styled.div`
  float: right;
`;

const StyledQuestionMark = styled.span`
  margin-left: 10px;
`;

const StyledTable = styled.div`

  .Payrolls__external-icon{
    width: 20px;
    display: none;
    float: right;

    @media (max-width: 540px) {
     display: block;
    }
  }

  .Payrolls__external-text{
    @media (max-width: 540px) {
     display: none;
    }
  }

  .Payrolls__address-small{
    display: none;
    @media (max-width: 390px) {
     display: block;
    }
  }

  .Payrolls__address-medium{
    display: none;
    @media (max-width: 720px) {
     display: block;
    }

    @media (max-width: 390px) {
     display: none;
    }
  }

  .Payrolls__address-big{
    display: block;

    @media (max-width: 720px) {
     display: none;
    }

  }

  .ant-table-placeholder{
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  .ant-table-content{
    background-color: white;
    border-radius: 4px;
  }

  .ant-table-body{
    width: 650px;

    @media (max-width: 720px) {
     width: 500px;
    }

    @media (max-width: 540px) {
     width: 400px;
    }

    @media (max-width: 430px) {
     width: 340px;
    }

    @media (max-width: 390px) {
     width: 280px;
    }

    tr:last-child td{
      border: none;
    }

     th:last-child{
       display: none;
     }

     tr td:last-child{
       display: none;
     }

     th:nth-child(3){
        border-top-right-radius: 4px;
     }
  }
`;

const StyledSymbol = styled.span`
  font-weight: 500;
`;

const StyledPagination = styled.div`
  float: right;
  margin-top: 10px;
`;

export default class RedeemPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      currentPage: 0,
      PayrollsProcessing: [],
    }
    this.itemsPerPage = 5;
    this.removePayrollFromProcess = this.removePayrollFromProcess.bind(this);
  }

  async removePayrollFromProcess(contractAddress){
    await this.props.getPayrolls();
    let newPayrollsProcessing = Object.assign([], this.state.PayrollsProcessing);
    const indexOfContract = newPayrollsProcessing.indexOf(contractAddress);
    if(indexOfContract > -1){
      newPayrollsProcessing.splice(indexOfContract, 1);
      this.setState({PayrollsProcessing: newPayrollsProcessing})
    }
  }

  async handleReceive(contractAddress){
    let newPayrollsProcessing = Object.assign([], this.state.PayrollsProcessing);
    newPayrollsProcessing.push(contractAddress);
    this.setState({PayrollsProcessing: newPayrollsProcessing})
    try{
       await this.props.withdraw(contractAddress);
    }catch(err){
      this.removePayrollFromProcess(contractAddress);
    }
    setTimeout( async () => {
      this.removePayrollFromProcess(contractAddress);
    }, 4000);

  }

  buildData(){
    const statusHeader = (
      <div>
        Status:
        <Tooltip
          title="Here you can withdraw payments you've received."
          arrowPointAtCenter={true}
          placement="topRight"
        >
          <StyledQuestionMark>
            <Img
              src={QuestionMark}
              alt="Hover for information"
            />
          </StyledQuestionMark>
        </Tooltip>

      </div>
    )

    const columns = [{
      title: 'From:',
      dataIndex: 'from',
      key: 'from',
    }, {
      title: 'Amount:',
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
    }, {
      title: statusHeader,
      dataIndex: 'status',
      key: 'status',
      align: 'right'
    }, {
    }];

    const { currentPage } = this.state;
    const receivedPayrolls = this.props.receivedPayrolls.slice();
    const startIndex = currentPage * this.itemsPerPage;
    let endIndex = (currentPage + 1) * this.itemsPerPage;
    const rows = receivedPayrolls.reverse().slice(startIndex, endIndex).map(Payroll => {

      let status = "Received";
        if(!Payroll.pastDate){
          status = "Pending";
        }
        else if(this.state.PayrollsProcessing.includes(Payroll.contractAddress)){
         status = "Confirming..."
        }
        else if(Payroll.withdrawable){
          status = (
            <StyledButton>
              <Button
                styling={Constants.buttons.primary.blue}
                handleRoute={this.handleReceive.bind(this, Payroll.contractAddress)}
              >
                Withdraw
              </Button>
            </StyledButton>
          )
        }

      return{
        key: Payroll.contractAddress,
        from:
        <div>
          {/* solution to render the table on mobile */}
          <span className="Payrolls__address-big">
            {Constants.functions.shortenAddress(Payroll.trustor)}
          </span>
          <span className="Payrolls__address-medium">
            {Constants.functions.shortenAddress(Payroll.trustor, 7, 4)}
          </span>
          <span className="Payrolls__address-small">
            {Constants.functions.shortenAddress(Payroll.trustor, 5, 3)}
          </span>
        </div>,
        amount:
          <span>
            {Payroll.amount}{' '}
            <StyledSymbol>
              ETH
            </StyledSymbol>
          </span>,
        status: status
        }
      }
    );

    return {
      columns,
      rows
    }
  }

  render() {
    const {columns, rows} = this.buildData();
    const config = {
      bordered: false,
      loading: this.props.loading,
      size: 'default',
    }
    const shouldRenderPagination = !this.props.loading && rows.length > 0;
    return (
      <div>
        <Helmet>
          <title>Redeem - MyBit Payroll</title>
          <meta
            name="Redeem"
            content="Redeem your funds on the MyBit Payroll dApp"
          />
        </Helmet>
        <ConnectionStatus
          network={this.props.network}
          constants={Constants}
          loading={this.props.loadingNetwork}
        />
        <StyledTable>
          <Table {...config} columns={columns} dataSource={rows} pagination={false} />
        </StyledTable>
        {shouldRenderPagination &&
          <StyledPagination>
            <Pagination
              onChange={(currentPage) => this.setState({currentPage: currentPage - 1})}
              total={this.props.receivedPayrolls.length}
              current={this.state.page + 1}
              pageSize={5}
              defaultCurrent={1}
            />
          </StyledPagination>
        }
      </div>
    );
  }
}

RedeemPage.propTypes = {
  getPayrolls: PropTypes.func.isRequired,
  withdraw: PropTypes.func.isRequired,
  receivedPayrolls: PropTypes.arrayOf(PropTypes.shape({
     trustor: PropTypes.string.isRequired,
     contractAddress: PropTypes.string.isRequired,
     pastDate: PropTypes.bool.isRequired,
     amount: PropTypes.string.isRequired,
   })).isRequired,
  loading: PropTypes.bool.isRequired,
  network: PropTypes.string.isRequired,
  loadingNetwork: PropTypes.bool.isRequired,
};
