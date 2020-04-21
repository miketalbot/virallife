import React from 'react'
import './App.css'
import {Route, Switch} from 'react-router-dom'
import {Game} from 'game'

function App() {
    return (
        <Switch>
            <Route path={'/ld46/:state/:id'}>
                <Game/>
            </Route>
            <Route path={'/ld46/:state'}>
                <Game/>
            </Route>
            <Route path={'/ld46/'}>
                <Game state={'start'}/>
            </Route>
        </Switch>
    )
}

export default App
