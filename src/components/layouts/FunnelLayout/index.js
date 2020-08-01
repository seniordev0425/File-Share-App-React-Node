import React from 'react'
import { Link } from 'react-router-dom'
import { Container } from 'reactstrap'

import { useCssClass } from 'utils/hooks'


export default function FunnelLayout(props) {
  const { children } = props

  useCssClass(document.documentElement, ['h-100'])
  useCssClass(document.body, ['pt-0', 'px-3', 'h-100', 'SignUp', 'bg-f-gray15'])
  useCssClass(document.getElementById('root'), ['d-flex', 'flex-column', 'h-100'])

  return <div className="d-flex flex-column h-100 position-relative">
    <div className="text-center py-md-5 py-3">
      <Link
        className="d-inline-block position-relative Brand"
        to="/"
        aria-label="Fast logo, click to return to home page"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="184"
          height="78"
          viewBox="0 0 184 78"
        >
          <path
            d="M59.857 35.308H48.39l1.319-4.923h14.4L66.088 23H24.6c-1.628 0-2.288 2.461-.66 2.461H46c1.628 0 .968 2.462-.659 2.462h-8.663c-1.628 0-2.287 2.461-.659 2.461h3.2c1.628 0 .969 2.461-.66 2.461h-8.104c-1.628 0-2.287 2.462-.659 2.462H37.9c1.628 0 .968 2.461-.66 2.461h-2.705c-1.628 0-2.287 2.462-.659 2.462h4.508c1.629 0 .969 2.461-.659 2.461h-1.8c-1.534 5.728-2 7.463-3.3 12.307h10.489l3.276-12.224h11.466l2-7.466zm-29.523 2.461c1.628 0 .968 2.462-.659 2.462h-2.324c-1.627 0-.968-2.462.66-2.462zm1.881-9.845c1.628 0 .968 2.461-.66 2.461h-6.267c-1.627 0-.968-2.461.66-2.461zM121.336 47.5h-1.464c-2.574 0-2.683-.754-2.112-2.884l1.9-7.1h4.44l1.427-5.326h-4.437l1.938-7.234h-9.1l-1.938 7.234h-3.418l-.4 1.5c-1.388-2.858-5.466-3.5-9.226-3.5-4.837 0-11.47 1.73-13.064 7.678-2.416 9.017 12.626 6.05 11.629 9.771-.438 1.635-2.066 2.079-3.486 2.079a2.991 2.991 0 0 1-2.076-.7 2.092 2.092 0 0 1-.4-2.138H82.87l1.887-7.042c1.49-5.562 1.919-9.645-9.088-9.645-9.187 0-13.466 2.884-14.786 7.811h8.876a3.688 3.688 0 0 1 3.847-2.264c.976 0 2.958.222 2.5 1.916-1.167 4.357-16.433-.451-19.266 10.119-1.294 4.83 2.029 7.005 6.423 7.005a14.694 14.694 0 0 0 9.587-3.151l-.222 2.485h9.542l.119-.443c-.938-.969-.8-1.635-.448-2.967l.785-2.928c-.523 5.52 4.622 7 9.684 7 8.521 0 13.4-3.284 14.69-8.114 2.331-8.7-12.944-6.517-12.074-9.764.311-1.162 1.462-1.65 3.06-1.65a2.327 2.327 0 0 1 1.71.577 1.874 1.874 0 0 1 .435 1.687h10.3l-2.247 8.388c-2.153 8.033-.914 8.876 11.38 8.21l1.772-6.613zm-52.494 2.039c-1.82 0-2.717-.791-2.408-1.945.807-3.011 4.611-2.3 8.021-3.765-.632 3.188-2.373 5.71-5.613 5.71zm91.625-6.091c2.072-7.737-2.175-11.283-7.938-11.283s-11.911 3.546-13.985 11.283 2.176 11.284 7.938 11.284 11.911-3.547 13.985-11.284zm-5.8 0c-.733 2.741-2.555 6.529-6.907 6.529s-4.143-3.788-3.409-6.529 2.556-6.528 6.908-6.528 4.143 3.788 3.408 6.528zM134.6 32.729l-5.744 21.438h5.641l5.745-21.438zm7.726-7.777h-5.642l-1.4 5.238h5.642l1.4-5.238zm-15.174 29.215h-5.642l1.4-5.238h5.641l-1.4 5.238z"
            fillRule="evenodd"
          />
        </svg>
        <span
          className="position-absolute text-uppercase font-weight-bold border rounded border-f-gray10 text-f-gray8"
          style={{
            fontSize: '.5rem',
            padding: '.05rem .25rem',
            left: '100%',
            top: 25,
            marginLeft: -17,
          }}
        >
          Beta
        </span>
      </Link>
    </div>

    <Container fluid className="p-0">
      {children}
    </Container>

    <span className="mt-auto text-center py-5 text-f-sm">&copy;{new Date().getFullYear()} Fast.io</span>
  </div>
}
