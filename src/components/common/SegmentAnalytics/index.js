import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { SEGMENT_WRITE_KEY } from 'constants/env'
import { hasSucceeded } from 'utils/state'
import {
  selectUser,
} from 'store/modules/user'


function SegmentAnalytics(props) {
  const { location, user } = props

  const loadSegmentAnalytics = () => {
    !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="4.0.0";  // eslint-disable-line no-unused-expressions
    }}();
    window.analytics.load(SEGMENT_WRITE_KEY);
    window.analytics.page();
  }

  // Load segment analytics.js and identify user on analytics ready event
  useEffect(() => {
    loadSegmentAnalytics()

    if (window.analytics) {
      window.analytics.ready(() => {
        if (hasSucceeded(user.state)) {
          window.analytics.identify(user.data.id, {
            name: `${user.data.first_name} ${user.data.last_name}`,
            email: user.data.email_address,
          });
        }
      })
    }
  }, [])

  // Identify user on user load (duplicate logic ensures that we're always identifying user)
  useEffect(() => {
    if (hasSucceeded(user.state) && window.analytics) {
      window.analytics.identify(user.data.id, {
        name: `${user.data.first_name} ${user.data.last_name}`,
        email: user.data.email_address,
      });
    }
  }, [user])

  // Record page view
  useEffect(() => {
    const locationParts = location.pathname.split('/')
      .map(part => part.trim())
      .filter(part => !!part)
    const pageName = !locationParts.length ?
      'Home' :
      locationParts[0].slice(0, 1).toUpperCase() + locationParts[0].slice(1)
    if (window.analytics) {
      window.analytics.page(pageName)
    }
  }, [location, user])

  return <span data-name="segment-analytics" />
}

SegmentAnalytics.propTypes = {
  location: PropTypes.object.isRequired,
  user: ImmutablePropTypes.record.isRequired,
}

const selector = createStructuredSelector({
  user: selectUser,
})

export default compose(
  withRouter,
  connect(selector),
)(SegmentAnalytics)
