import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import '../node_modules/semantic-ui-css/semantic.min.css'

const title = 'React with Webpack and Babel'

ReactDOM.render(<App title={title} />, document.getElementById('root'))
module.hot.accept()
