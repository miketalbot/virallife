import React from 'react'
import {register} from 'game'
import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'
import CardHeader from '@material-ui/core/CardHeader'
import landing from '../landing_screen.jpg'
import CardMedia from '@material-ui/core/CardMedia'
import {makeStyles} from '@material-ui/core/styles'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import {playHome} from '../sounds'
import {Navigation} from '../../standard-nav'
import {getState, getStructures, saveStructures, setState} from '../data'
import games from '../games/index.json'
import {generate} from 'shortid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import {useHistory} from 'react-router-dom'
import {handle} from 'common/events'
import Button from '@material-ui/core/Button'
import {downloadObject, UploadButton} from '../lib'
import {useRefresh} from 'common/useRefresh'

register('start', {Page})

const useStyles = makeStyles(() => {
    return {
        header: {
            backgroundPosition: '0 0',
            backgroundSize: 'cover',
        },
    }
})
let playing = false

function configure() {
    if (!localStorage.getItem('initx')) {
        localStorage.setItem('initx', Date.now())
        for (let game of games) {
            game.id = generate()
        }
        saveStructures(games)
    }
}

handle('game-over-complete', (score, stars, structure) => {
    const state = getState()
    const gameState = (state[structure.id] = state[structure.id] || {})
    if (score > (gameState.score || 0) || stars > gameState.stars) {
        gameState.score = Math.max(score, gameState.score || 0)
        gameState.stars = Math.max(stars, gameState.stars || 0)
        gameState.description = `${stars} Star${stars !== 1 ? 's' : ''} | High score ${score}`
    }
    setState(state)
})

function Page() {
    configure()
    if (!playing) {
        playHome()
        playing = true
    }
    const refresh = useRefresh()
    const history = useHistory()
    const games = getStructures()
    const state = getState()
    const classes = useStyles()
    return (
        <Container>
            <Navigation/>
            <Box w={1}>
                <Card elevation={10}>
                    <Box height={500} maxHeight={'50vw'} clone>
                        <CardMedia className={classes.header} image={landing}/>
                    </Box>
                    <CardHeader
                        title={'LIFE:anti-viral'}
                        subheader={
                            'For Ludum Dare 46 JAM (designed, drawn, coded and composed from scratch in 60 hours)'
                        }
                    />
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Box>
                                    <Typography color={'primary'}>Code by Mike Talbot</Typography>
                                    <Typography>Everything else by Bethany Collinge</Typography>
                                    <Typography variant={'caption'}>(c) 2020 Mr EdEd Productions</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography gutterBottom>
                                    Inspired by "Life" the classic "Zero Player" game by John Conway, LIFE:anti-viral
                                    puts you in charge of designing immune responses and testing them with virulent
                                    viruses!
                                </Typography>
                                <Typography variant={'overline'} gutterBottom>
                                    Can you "Keep it alive"?
                                </Typography>
                                <Typography gutterBottom>
                                    Try out the sample levels, or make some of your own!
                                </Typography>
                                <Typography variant={'caption'}>
                                    Sadly John Conway the brilliant mathematician recently passed away of Coronavirus.
                                    Our best wishes to his family - he truly was an inspirational thinker.
                                </Typography>
                            </Grid>
                            <Grid item md={6}>
                                <Card variant={'outlined'}>
                                    <CardHeader
                                        title={'Games'}
                                        action={
                                            <Button onClick={() => history.push('/design')} color={'secondary'}>
                                                Design Your Own!
                                            </Button>
                                        }
                                    />
                                    <CardContent>
                                        <List>
                                            {games.map((game) => {
                                                const info = state[game.id] || {}
                                                return (
                                                    <ListItem divider button key={game.id} onClick={playGame(game.id)}>
                                                        <ListItemText
                                                            primary={game.name}
                                                            secondary={info.description}
                                                        />
                                                    </ListItem>
                                                )
                                            })}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item md={6}>
                                <Card variant={'outlined'}>
                                    <CardHeader title={'Remote Games'}/>
                                    <CardContent>
                                        <Typography gutterBottom>
                                            The plan is to have a network of games so people can make and play against
                                            each other, but sadly not enough time to finish during JAM.
                                        </Typography>
                                        <Typography gutterBottom>
                                            For now, use the buttons below and send the files by email.
                                        </Typography>
                                        <Box mt={2}>
                                            <Button onClick={download} color={'primary'}>
                                                Share Your Games via file
                                            </Button>
                                            <UploadButton color={'secondary'} onFile={merge}>
                                                Merge someone else's games
                                            </UploadButton>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    )

    function download() {
        downloadObject(getStructures())
    }

    function merge(structure) {
        for (let game of structure) {
            game.id = generate()
        }
        saveStructures([...getStructures(), ...structure])
        refresh()
    }

    function playGame(id) {
        return function () {
            history.push(`/play/${id}`)
        }
    }
}
