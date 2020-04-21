import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import {MdHome} from 'react-icons/all'
import Box from '@material-ui/core/Box'
import {useHistory} from 'react-router-dom'
import {prevent} from 'game/lib'

export function Navigation() {
    const history = useHistory()
    return <AppBar position="static" onClick={home}>
        <Toolbar>
            <IconButton onClick={home} edge="start" color="inherit" aria-label="menu">
                <MdHome/>
            </IconButton>
            <Typography variant="h6">
                LIFE:anti-viral
            </Typography>
            <Box flexGrow={1}/>
            <Button onClick={prevent(design)} color="inherit">Design</Button>
        </Toolbar>
    </AppBar>

    function home() {
        history.push('/ld46/')
    }

    function design() {
        history.push('/ld46/design')
    }

}
