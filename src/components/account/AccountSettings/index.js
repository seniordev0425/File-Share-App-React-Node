import React from 'react'
import { Route, Switch, Link, Redirect } from 'react-router-dom'
import { withRouter } from 'react-router'
import { PropTypes } from 'prop-types'
import {
  Container, Row, Col, Button,
  Nav, NavItem, NavLink,
} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser, faReceipt, faCode, faChartArea,
  faBoxes, faGlobe, faChartBar, faAngleLeft, faBell,
} from '@fortawesome/free-solid-svg-icons'

import NotFound from 'components/common/NotFound'
import AccountUserSettings from 'components/account/AccountUserSettings'
import AccountBilling from 'components/account/AccountBilling'
import AccountAPIAccess from 'components/account/AccountAPIAccess'
import AccountUsage from 'components/account/AccountUsage'
import AccountAnalytics from 'components/account/AccountAnalytics'
import AccountStorage from 'components/account/AccountStorage'
import AccountDomains from 'components/account/AccountDomains'
import AccountEvents from 'components/account/AccountEvents'


export function AccountSettings(props) {
  const { location } = props

  const isPath = (path) => location.pathname.substr(0, path.length) === path

  return <div>
    <Button outline color="primary" className="border-0 mt-3 ml-3 BackButton text-f-md" tag={Link} to="/">
      <FontAwesomeIcon icon={faAngleLeft} className="mr-2" />
      Back to Home
    </Button>

    <Container fluid className="p-0 pt-3">
      <section className="px-sm-5 px-4 py-4">
        <h1 className="h4 m-0">Account Settings</h1>
      </section>

      <section className="px-sm-5 px-4 py-4">
        <Row>
          <Col lg="12">
            <Nav pills className="Tabs text-f-md">
              <NavItem>
                <NavLink className="px-4" tag={Link} to="/account/user" active={isPath('/account/user')}>
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Account
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="px-4" tag={Link} to="/account/billing" active={isPath('/account/billing')}>
                  <FontAwesomeIcon icon={faReceipt} className="mr-2" />
                  Billing
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="px-4" tag={Link} to="/account/apiaccess" active={isPath('/account/apiaccess')}>
                  <FontAwesomeIcon icon={faCode} className="mr-2" />
                  API Access
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="px-4" tag={Link} to="/account/analytics" active={isPath('/account/analytics')}>
                  <FontAwesomeIcon icon={faChartArea} className="mr-2" />
                  Analytics
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="px-4" tag={Link} to="/account/storage" active={isPath('/account/storage')}>
                  <FontAwesomeIcon icon={faBoxes} className="mr-2" />
                  Storage Providers
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="px-4" tag={Link} to="/account/domains" active={isPath('/account/domain')}>
                  <FontAwesomeIcon icon={faGlobe} className="mr-2" />
                  Domains
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="px-4" tag={Link} to="/account/usage" active={isPath('/account/usage')}>
                  <FontAwesomeIcon icon={faChartBar} className="mr-2" />
                  Usage
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="px-4" tag={Link} to="/account/events" active={isPath('/account/events')}>
                  <FontAwesomeIcon icon={faBell} className="mr-2" />
                  Events
                </NavLink>
              </NavItem>
            </Nav>
          </Col>
        </Row>
      </section>

      <Switch>
        <Redirect exact from="/account" to="/account/user" />
        <Route exact path="/account/user" component={AccountUserSettings} />
        <Route exact path="/account/billing" component={AccountBilling} />
        <Route exact path="/account/apiaccess" component={AccountAPIAccess} />
        <Route exact path="/account/usage" component={AccountUsage} />
        <Route exact path="/account/analytics" component={AccountAnalytics} />
        <Route exact path="/account/storage" component={AccountStorage} />
        <Route exact path="/account/domains" component={AccountDomains} />
        <Route exact path="/account/events" component={AccountEvents} />

        {/* Show Not Found page when url does not match */}
        <Route component={NotFound} />
      </Switch>
    </Container>
  </div>
}

AccountSettings.propTypes = {
  location: PropTypes.object.isRequired,
}

export default withRouter(AccountSettings)
