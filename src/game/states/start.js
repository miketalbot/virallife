import React from 'react'
import { register } from 'game'
import Container from '@material-ui/core/Container'

register('start', { Page })

function Page() {
    return <Container>Start</Container>
}
