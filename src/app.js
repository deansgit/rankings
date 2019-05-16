import { useRedirect, useRoutes } from 'hookrouter'

import Button from './components/generic/Button'
import CreateForm from './components/CreateForm/CreateForm.jsx'
import React from 'react'
import Tiermaker from './components/Tiermaker/Tiermaker.jsx'

const routes = {
  '/': () => <Home />,
  '/t/:encoded': ({ encoded }) => <Tiermaker encoded={encoded} />,
  '/maker': () => <Tiermaker />,
  '/create': () => <CreateForm />
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
      <Button href="/" className="btn">
        Home
      </Button>
      <Button href="/create" className="btn">
        Create
      </Button>
    </div>
    <Router />
  </div>
)

export default App
