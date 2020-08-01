import React, { useEffect, useState } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { withRouter, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {
  Container, Row, Col,
  Button, Form, FormGroup, Input, Label,
} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCheck, faAngleLeft } from '@fortawesome/free-solid-svg-icons'

import { isPending, hasSucceeded } from 'utils/state'
import { useDataLoadEffect, usePreviousValue } from 'utils/hooks'
import { parseDate } from 'utils/format'
import { selectUserTitle } from 'store/modules/user'
import {
  selectAnalyticsProviderList,
  selectAnalyticsProfileList,
  loadAnalyticsProviderList,
  loadAnalyticsProfileList,
} from 'store/modules/analytics'
import {
  selectUpdateSiteDetailState,
  updateSiteDetail,
  updateSiteDetailReset,
} from 'store/modules/sites'
import Spinner from 'components/common/Spinner'


export function ChooseProfileForSite(props) {
  const {
    history, match, userTitle,
    providerList, loadAnalyticsProviderList,
    profileList, loadAnalyticsProfileList,
    updateSiteDetailState, updateSiteDetail, updateSiteDetailReset,
  } = props
  const [selectedProfile, setSelectedProfile] = useState(null)
  const server = match.params.server

  const handleApplyProfile = () => {
    if (!selectedProfile) {
      return
    }

    updateSiteDetail({
      server,
      data: {
        analytics: selectedProfile,
      },
    })
  }

  useDataLoadEffect(providerList, loadAnalyticsProviderList)

  useDataLoadEffect(profileList, loadAnalyticsProfileList)

  useEffect(() => {
    updateSiteDetailReset()
  }, [])

  usePreviousValue(updateSiteDetailState, prev => {
    if (isPending(prev) && hasSucceeded(updateSiteDetailState)) {
      history.push(`/sites/${server}/analytics`)
    }
  })

  const loaded = hasSucceeded(providerList.state) && hasSucceeded(profileList.state)

  return <>
    <Button
      outline
      color="primary"
      className="border-0 mt-3 ml-3 BackButton text-f-md"
      tag={Link}
      to="/account/analytics"
    >
      <FontAwesomeIcon icon={faAngleLeft} className="mr-2" />
      Back to Analytics
    </Button>

    <Container fluid className="p-0 pb-5 ChooseProfile">
      {
        !loaded && <Spinner />
      }

      {
        loaded && <section className="p-5">
          <Row>
            <Col className="text-center mx-auto" style={{ maxWidth: '45rem' }}>
              <h1 className="h4 mb-5">Choose analytics profile for Tom’s Website</h1>
              <Form className="d-flex flex-column text-left">
                {
                  profileList.data.map(profile => {
                    const provider = providerList.data.find(provider => provider.name === profile.provider)
                    const updatedAt = parseDate(profile.updated).toDate()
                    const isNew = ((new Date()) - updatedAt) <= 86400 * 1000

                    return <FormGroup key={profile.name} check className="d-flex align-items-center mb-3">
                      <Input
                        className="mt-0 ml-n4"
                        type="radio"
                        name="chooseProfile"
                        id={profile.name}
                        value={profile.name}
                        onClick={() => setSelectedProfile(profile.name)}
                      />
                      <Label
                        check
                        className="position-relative d-flex flex-fill flex-wrap align-items-center rounded-lg py-3 px-4 text-f-sm text-f-gray8 bg-f-gray15"
                        htmlFor={profile.name}
                      >
                        {
                          isNew && <div
                            className="position-absolute rounded-pill px-2 text-white text-uppercase font-weight-bold bg-f-color2"
                            style={{ top: 5, left: 5, fontSize: '.5rem' }}
                          >
                            New
                          </div>
                        }
                        <div className="my-2">
                          <h2 className="my-1 text-f-md">{profile.name}</h2>
                          {provider && provider.display} | Tracking ID # {profile.token}
                        </div>
                        <div className="ml-auto d-flex rounded-circle bg-white Profile-owner">
                          <span className="m-auto">{userTitle}</span>
                        </div>
                      </Label>
                    </FormGroup>
                  })
                }
              </Form>
            </Col>
          </Row>
        </section>
      }

      <section className="p-5" />

      <section>
      	<div className="p-2 fixed-bottom text-center bg-f-color2">
          <Button
            outline
            color="light"
            tag={Link}
            to="/analytics/create"
            className="m-2"
            disabled={isPending(updateSiteDetailState)}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            New Profile
          </Button>
          <Button
            color="light"
            className="m-2 text-f-color2"
            onClick={handleApplyProfile}
            disabled={!selectedProfile || isPending(updateSiteDetailState)}
          >
            <FontAwesomeIcon icon={faCheck} className="mr-2" />
            Apply Profile
          </Button>
        </div>
      </section>
    </Container>
  </>
}

ChooseProfileForSite.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  userTitle: PropTypes.string.isRequired,
  providerList: ImmutablePropTypes.record.isRequired,
  profileList: ImmutablePropTypes.record.isRequired,
  updateSiteDetailState: PropTypes.string.isRequired,
  loadAnalyticsProviderList: PropTypes.func.isRequired,
  loadAnalyticsProfileList: PropTypes.func.isRequired,
  updateSiteDetail: PropTypes.func.isRequired,
  updateSiteDetailReset: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  userTitle: selectUserTitle,
  providerList: selectAnalyticsProviderList,
  profileList: selectAnalyticsProfileList,
  updateSiteDetailState: selectUpdateSiteDetailState,
})

const actions = {
  loadAnalyticsProviderList,
  loadAnalyticsProfileList,
  updateSiteDetail,
  updateSiteDetailReset,
}

export default compose(
  withRouter,
  connect(selector, actions),
)(ChooseProfileForSite)
