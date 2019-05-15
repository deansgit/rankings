import { A, useRedirect, useRoutes } from 'hookrouter'

import React from 'react'
import Tiermaker from './components/Tiermaker/Tiermaker.jsx'

const routes = {
  '/': () => <Home />,
  '/t/:hash': ({ hash }) => <Tiermaker data={hash} />,
  '/maker': () => <Tiermaker />,
  '/create': () => <div>create</div>
}

function Home() {
  useRedirect('/', '/maker')
  return null
}

function Router() {
  const routeResult = useRoutes(routes)
  return routeResult || <div>Page not found</div>
}

const App = () => (
  <div className="app">
    <div className="nav">
      {/* <A href="/" className="btn btn--blue">
        Home
      </A> */}
      <A href="/create" className="btn btn--blue">
        Create
      </A>
    </div>
    <Router />
  </div>
)

export default App
