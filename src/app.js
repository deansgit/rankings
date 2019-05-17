import { useRedirect, useRoutes } from 'hookrouter'

import Button from './components/generic/Button'
import CreateForm from './components/CreateForm'
import ImportForm from './components/ImportForm'
import { Provider } from 'react-redux'
import React from 'react'
import Tiermaker from './components/Tiermaker/Tiermaker'
import store from './redux/store'

const routes = {
  '/': () => <Home />,
  '/t/:encoded': ({ encoded }) => <Tiermaker encoded={encoded} />,
  '/maker': () => <Tiermaker />,
  '/create': () => <CreateForm />,
  '/import': () => <ImportForm />
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
  <Provider store={store}>
    <div className="app">
      <div className="nav">
        <Button href="/import" className="btn">
          Import
        </Button>
        <Button href="/create" className="btn">
          Create
        </Button>
      </div>
      <Router />
    </div>
  </Provider>
)

export default App
