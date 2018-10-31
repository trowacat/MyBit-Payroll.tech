/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import H1 from 'components/H1';
import P from 'components/P';
import Button from 'components/Button';
import Constants from 'components/Constants';
import ReposList from 'components/ReposList';
import AtPrefix from './AtPrefix';
import CenteredSection from './CenteredSection';
import Form from './Form';
import Input from './Input';
import Section from './Section';
import messages from './messages';

const StyledNote = styled.div`
  margin-top: 40px;
`;

const StyledHowTo = styled.span`
  span{
    margin: 0px 0px;
    display: block;
  }
`;

const StyledMetamaskLink = styled.a`
  color: #ffffff;
  text-decoration: underline;

  &:hover{
    color: #ffffff;
    text-decoration: underline;
  }
`;

const StyledParagraphGroupText = styled.div`
  margin-top: 30px;
`;

const StyledCreateNewButton = styled.div`
  margin-top: 50px;
`;

const StyledMakeDappAwesome = styled.div`
  margin-top: 80px;
`;

const StyledCenterButton = styled.div`
  margin: 0 auto;
  width: max-content;
`;

const StyledDivider = styled.div
  flex: 1;
;

const StyledPage = styled.article`
  text-align: center;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
`;

export class HomePage extends React.PureComponent {
  render() {
    return (
      <StyledPage>
        <Helmet>
          <title>MyBit Payroll</title>
          <meta
            name="MyBit Payroll"
            content="Create a Payrolls on the MyBit Payroll dApp"
          />
        </Helmet>
        <H1>
          Automate payments to your employees with a click.
        </H1>
        <StyledParagraphGroupText>
          <P
            fontSize={Constants.paragraphs.homePage.fontSize}
            textAlign={Constants.paragraphs.homePage.textAlign}
            text="A Payroll is a company's list of its employees, but the term is commonly used to refer to: the total amount of money that a company pays to its employees. A company's record of its employees' salaries and wages, bonuses, and withheld taxes. The company's department that calculates funds and pays these."
          />
        </StyledParagraphGroupText>
        <StyledCenterButton>
          <StyledCreateNewButton>
            <Button
              styling={Constants.buttons.primary.green}
              linkTo="/create-new"
              size="large"
            >
              Create new
             </Button>
           </StyledCreateNewButton>
         </StyledCenterButton>
         <StyledMakeDappAwesome>
           <P
              fontSize={Constants.paragraphs.homePage.fontSize}
              textAlign={Constants.paragraphs.homePage.textAlign}
              text="Make this dApp more awesome:"
            />
          </StyledMakeDappAwesome>
          <StyledCenterButton>
            <Button
              styling={Constants.buttons.secondary.default}
              href="https://ddf.mybit.io"
            >
              Contribute
             </Button>
          </StyledCenterButton>
      </StyledPage>
    );
  }
}

HomePage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  repos: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  onSubmitForm: PropTypes.func,
  username: PropTypes.string,
  onChangeUsername: PropTypes.func,
};

export default HomePage;
