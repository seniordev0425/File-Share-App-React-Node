import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import Spinner from 'components/common/Spinner'
import { hasSucceeded } from 'utils/state'
import { useDataLoadEffect } from 'utils/hooks'
import { selectSiteDetail } from 'store/modules/sites'
import {
  selectAnalyticsProfileList,
  loadAnalyticsProfileList,
  selectAnalyticsProfile,
  loadAnalyticsProfile,
} from 'store/modules/analytics'
import EmptyProfileList from './emptyProfileList'
import ChooseProfile from './chooseProfile'
import AnalyticsProfile from './profile'


export function SiteAnalytics(props) {
  const {
    siteDetail,
    analyticsProfileList, loadAnalyticsProfileList,
    analyticsProfile, loadAnalyticsProfile,
  } = props

  useDataLoadEffect(analyticsProfileList, loadAnalyticsProfileList)

  useDataLoadEffect(
    analyticsProfile,
    loadAnalyticsProfile,
    () => ({
      name: siteDetail.data.analytics,
    }),
    needsLoading => siteDetail.data.analytics && needsLoading,
  )

  return <>
    {
      (
        !hasSucceeded(analyticsProfileList.state) ||
        (siteDetail.data.analytics && !hasSucceeded(analyticsProfile.state))
      ) && <Spinner />
    }

    {
      (
        hasSucceeded(analyticsProfileList.state) &&
        (!siteDetail.data.analytics || hasSucceeded(analyticsProfile.state))
      ) && <>
        {
          !analyticsProfileList.data.size && <EmptyProfileList />
        }

        {
          (
            analyticsProfileList.data.size &&
            !siteDetail.data.analytics
          ) && <ChooseProfile
            server={siteDetail.data.server}
          />
        }

        {
          (
            siteDetail.data.analytics &&
            hasSucceeded(analyticsProfile.state)
          ) && <AnalyticsProfile
            profile={analyticsProfile.data}
            server={siteDetail.data.server}
          />
        }
      </>
    }
  </>
}

SiteAnalytics.propTypes = {
  siteDetail: ImmutablePropTypes.record.isRequired,
  analyticsProfile: ImmutablePropTypes.record.isRequired,
  analyticsProfileList: ImmutablePropTypes.record.isRequired,
  loadAnalyticsProfile: PropTypes.func.isRequired,
  loadAnalyticsProfileList: PropTypes.func.isRequired,
}

const selector = createStructuredSelector({
  siteDetail: selectSiteDetail,
  analyticsProfile: selectAnalyticsProfile,
  analyticsProfileList: selectAnalyticsProfileList,
})

const actions = {
  loadAnalyticsProfile,
  loadAnalyticsProfileList,
}

export default compose(
  connect(selector, actions),
)(SiteAnalytics)
