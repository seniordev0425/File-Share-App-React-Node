import React from 'react'
import { mount } from 'enzyme'
import { Button } from 'reactstrap'

import { ListData } from 'store/common/models'
import { AccountBillingDomains } from './index'
import DetailBlock from 'components/common/DetailBlock'


const props = {
  domainList: ListData(),
  loadDomainList: e => e,
}

describe('AccountBillingDomains', () => {
  it('renders hard-coded values in DetailBlock', () => {
    const wrapper = mount(<AccountBillingDomains {...props} />)
  
    expect(wrapper.find(DetailBlock).prop('header')).toEqual('Domains')
  })
})
