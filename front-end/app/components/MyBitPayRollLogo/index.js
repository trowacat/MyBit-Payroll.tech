import React from 'react';
import styled from 'styled-components'
import { Link } from 'react-router-dom';
import Logo from './logo.svg';
import Img from '../Img';

const StyledLogo = styled(Link)`
  position: absolute;
  top: 21px;
  left: 21px;
`

const MyBitPayRollLogo = (
    <StyledLogo to="/">
      <Img
        src={Logo}
        alt="MyBit Payroll Dapp"
      />
    </StyledLogo>
);

export default MyBitPayRollLogo;
