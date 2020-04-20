import React from 'react'
import './App.css'
import {Route, Switch} from 'react-router-dom'
import {Game} from 'game'

function App() {
    return (
        <Switch>
            <Route path={'/:state/:id'}>
                <Game/>
            </Route>
            <Route path={'/:state'}>
                <Game/>
            </Route>
            <Route path={'/'}>
                <Game state={'start'}/>
            </Route>
        </Switch>
    )
}

export default App
