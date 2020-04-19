import React from 'react'
import Sugar from 'sugar'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'

import * as serviceWorker from './serviceWorker'
import {BrowserRouter} from 'react-router-dom'

import {createMuiTheme} from '@material-ui/core/styles'
import primary from '@material-ui/core/colors/deepOrange'
import secondary from '@material-ui/core/colors/green'
import {ThemeProvider} from '@material-ui/styles'
import {CssBaseline} from '@material-ui/core'

Sugar.extend()

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary,
        secondary,
    },
    status: {
        danger: 'orange',
    },
})
ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <div>
                    <CssBaseline />
                    <App />
                </div>
            </BrowserRouter>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
