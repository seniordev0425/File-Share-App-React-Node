import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter as Router, Link } from 'react-router-dom'
import { ListGroupItem } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { folderRecord, fileRecord } from 'test/fixtures/siteContent'
import { prepareRenderContainer } from 'utils/testTools'
import FileItem from './index'


const props = {
  storageName: 'googledrive',
  pathGenerator: path => `/sites/mysite/browse${path}`,
  onSyncWithStorage: e => e,
  onPushToCDN: e => e,
}

it('renders folder item', () => {
  const wrapper = mount(<Router>
    <FileItem
      record={folderRecord}
      {...props}
    />
  </Router>)

  expect(wrapper.find(Link).length).toEqual(1)
  expect(wrapper.find(Link).at(0).prop('to')).toEqual(props.pathGenerator(folderRecord.path))
  // Icon should be blue
  expect(wrapper.find(FontAwesomeIcon).at(0).hasClass('text-f-color1')).toEqual(true)
})

it('renders file item', () => {
  const wrapper = mount(<Router>
    <FileItem
      record={fileRecord}
      {...props}
    />
  </Router>)

  expect(wrapper.find('a').length).not.toEqual(0)
  const fileNameLink = wrapper.find('a').at(0)
  expect(fileNameLink.prop('href')).toEqual(fileRecord.url)
  expect(fileNameLink.prop('target')).toEqual('_blank')
  // Icon should be dark gray
  expect(wrapper.find(FontAwesomeIcon).at(0).hasClass('text-f-gray6')).toEqual(true)
})

it('renders file item with excluded flag', () => {
  const wrapper = mount(<Router>
    <FileItem
      record={fileRecord.set('filtered', true)}
      {...props}
    />
  </Router>, {
    attachTo: prepareRenderContainer(),
  })

  expect(wrapper.find(ListGroupItem).hasClass('file-filter-excluded')).toEqual(true)
  // Icon color should be inherited
  expect(wrapper.find(FontAwesomeIcon).at(0).hasClass('text-f-gray6')).toEqual(false)
})

it('renders file item with too large flag', () => {
  const wrapper = mount(<Router>
    <FileItem
      record={fileRecord.set('toobig', true)}
      {...props}
    />
  </Router>, {
    attachTo: prepareRenderContainer(),
  })

  expect(wrapper.find(ListGroupItem).hasClass('file-filter-too-large')).toEqual(true)
  // Icon color should be inherited
  expect(wrapper.find(FontAwesomeIcon).at(0).hasClass('text-f-gray6')).toEqual(false)
})

it('renders file item with not executable warning', () => {
  const wrapper = mount(<Router>
    <FileItem
      record={fileRecord.set('name', 'testfile.py')}
      {...props}
    />
  </Router>, {
    attachTo: prepareRenderContainer(),
  })

  expect(wrapper.find(ListGroupItem).hasClass('file-type-warning')).toEqual(true)
  // Icon color should be inherited
  expect(wrapper.find(FontAwesomeIcon).at(0).hasClass('text-f-gray6')).toEqual(false)
})
