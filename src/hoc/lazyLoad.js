import React, { Suspense, lazy } from 'react'

import Spinner from 'components/common/Spinner'


export default lazyLoadingFunc => {
  const LazyLoadedComponent = lazy(lazyLoadingFunc)
  return props => (
    <Suspense fallback={<Spinner />}>
      <LazyLoadedComponent {...props} />
    </Suspense>
  )
}
