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
import ExternalUrlIcon from './external-url-icon.png';
import Img from 'components/Img';
import ConnectionStatus from 'components/ConnectionStatus';

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

export default class PayrollsPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      currentPage: 0,
    }
    this.itemsPerPage = 5;
  }

  buildData(){
    const columns = [{
      title: 'To:',
      dataIndex: 'to',
      key: 'to',
    }, {
      title: 'Amount:',
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
    }, {
      title: 'Status:',
      dataIndex: 'status',
      key: 'status',
      align: 'right'
    }, {
    }];

    const { currentPage } = this.state;
    const sentPayrolls = this.props.sentPayrolls.slice();
    const startIndex = currentPage * this.itemsPerPage;
    let endIndex = (currentPage + 1) * this.itemsPerPage;
    const rows = sentPayrolls.reverse().slice(startIndex, endIndex).map(Payroll => {
      return{
        key: Payroll.PayrollHash,
        to:
        <div>
          {/* solution to render the table on mobile */}
          <span className="Payrolls__address-big">
            {Constants.functions.shortenAddress(Payroll.beneficiary)}
          </span>
          <span className="Payrolls__address-medium">
            {Constants.functions.shortenAddress(Payroll.beneficiary, 10, 4)}
          </span>
          <span className="Payrolls__address-small">
            {Constants.functions.shortenAddress(Payroll.beneficiary, 5, 3)}
          </span>
        </div>,
        amount:
          <span>
            {Payroll.amount}{' '}
            <StyledSymbol>
              ETH
            </StyledSymbol>
          </span>,
        status:
          <a
            href={`https://ropsten.etherscan.io/tx/${Payroll.PayrollHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
          <Img
            className="Payrolls__external-icon"
            src={ExternalUrlIcon}
            alt="See Payroll on etherscan"
          />
            <span
              className="Payrolls__external-text"
            >
              View on etherscan
            </span>
          </a>
      }
    });

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
          <title>Payrolls - MyBit Payroll</title>
          <meta
            name="Payrolls"
            content="See your Payrolls on the MyBit Payroll dApp"
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
              total={this.props.sentPayrolls.length}
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

PayrollsPage.propTypes = {
  sentPayrolls: PropTypes.arrayOf(PropTypes.shape({
     beneficiary: PropTypes.string.isRequired,
     PayrollHash: PropTypes.string.isRequired,
     amount: PropTypes.string.isRequired,
   })).isRequired,
  loading: PropTypes.bool.isRequired,
  network: PropTypes.string.isRequired,
  loadingNetwork: PropTypes.bool.isRequired,
};

