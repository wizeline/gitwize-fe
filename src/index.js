import React from 'react'
import ReactDOM from 'react-dom'

import App from './components/App'

import 'semantic-ui-css/semantic.min.css'

const title = 'React with Webpack and Babel'

ReactDOM.render(<App title={title} />, document.getElementById('root'))
module.hot.accept()
