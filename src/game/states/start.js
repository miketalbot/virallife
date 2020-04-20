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

function Page() {
    if (!playing) {
        playHome()
        playing = true
    }
    const classes = useStyles()
    return (
        <Container>
            <Box mt={2} w={1}>
                <Card elevation={10}>
                    <Box height={500} maxHeight={'80vh'} clone>
                        <CardMedia className={classes.header} image={landing}/>
                    </Box>
                    <CardHeader title={'LIFE:anti-viral'} subheader={'For Ludum Dare 46 JAM (coded in 60 hours)'}/>
                    <CardContent>
                        <Grid container spacing={1}>
                            <Grid item xs={4}>
                                <Box>
                                    <Typography color={'primary'}>Code by Mike Talbot</Typography>
                                    <Typography>Everything else by Bethany Collinge</Typography>
                                    <Typography variant={'caption'}>(c) 2020 Mr EdEd Productions</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography gutterBottom>
                                    Inspired by Life the classic "Zero Player" game by John Conway, LIFE:anti-viral puts
                                    you in charge of designing immune responses and testing them with virulent viruses!
                                </Typography>
                                <Typography gutterBottom>Try out the sample levels, or make some of your
                                    own!</Typography>
                                <Typography variant={'caption'}>
                                    Sadly John Conway the brilliant mathematician recently passed away of Coronavirus.
                                    Our best wishes to his family - he truly was an inspirational thinker.
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    )
}
