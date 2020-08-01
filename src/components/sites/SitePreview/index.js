import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Carousel, { Modal, ModalGateway } from 'react-images'

import './index.css'


function SitePreview(props) {
  const { imageUrl } = props
  const [open, setOpen] = useState(false)

  const handleOpen = ev => {
    ev.preventDefault()
    ev.stopPropagation()
    imageUrl && setOpen(true)
  }

  const toggleModal = () => setOpen(value => !value)

  const previewBgProps = (
    imageUrl ?
    {
      style: {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: `cover`,
        backgroundPosition: `center`,
        cursor: 'pointer',
      }
    } :
    {}
  )

  return <div
    className="w-100 h-100"
    onClick={ev => ev.preventDefault() || ev.stopPropagation()}
  >
    <div
      className="w-100 h-100"
      onClick={handleOpen}
      {...previewBgProps}
    />
    <ModalGateway>
      {
        open && <Modal
          allowFullscreen={false}
          onClose={toggleModal}
        >
          <Carousel
            components={{
              FooterCount: () => <span />
            }}
            views={[
              { src: imageUrl },
            ]}
          />
        </Modal>
      }
    </ModalGateway>
  </div>
}

SitePreview.propTypes = {
  imageUrl: PropTypes.string,
}

export default SitePreview
