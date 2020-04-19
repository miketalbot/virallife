import {types} from '../../cells/types'
import {Box} from '@material-ui/core'
import Card from '@material-ui/core/Card'
import clsx from 'clsx'
import CardMedia from '@material-ui/core/CardMedia'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => {
    return {
        contain: {
            backgroundSize: 'contain',
        },
        selected: {
            backgroundColor: theme.palette.action.selected,
        },
        selectable: {
            cursor: 'pointer',
        },
        item: {
            zoom: (props) => (window.innerWidth < 1024 || window.innerHeight < 800 ? 0.6 : 1),
        },
    }
})

export function CellSelector({ value, onChange, good }) {
    const classes = useStyles()
    let show = Object.entries(types)
        .filter(([, v]) => v.good === good)
        .map(([key, v]) => Object.assign(v, { key }))
    if (!value) {
        setTimeout(() => onChange(show.filter((f) => f.cost)[0]))
    }
    return (
        <Box display={'flex'} flexWrap={'wrap'} alignItems={'stretch'} justifyContent={'center'}>
            {show.map((type) => {
                return (
                    <Box className={classes.item} key={type.key} mr={1} mb={1} width={1 / 4} minWidth={150}>
                        <Box height={1} clone>
                            <Card
                                onClick={select(type)}
                                className={clsx({
                                    [classes.selectable]: !!type.cost,
                                    [classes.selected]: value === type,
                                })}
                                variant={'outlined'}
                            >
                                <Box height={64} clone>
                                    <CardMedia className={classes.contain} image={type.sprite} />
                                </Box>
                                <CardHeader
                                    title={type.name}
                                    subheader={
                                        type.cost && (
                                            <Typography color={'primary'} variant={'caption'}>
                                                {type.cost} credits
                                            </Typography>
                                        )
                                    }
                                />
                                <CardContent>
                                    <Box>
                                        <Typography variant={'body2'}>{type.description}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>
                )
            })}
        </Box>
    )

    function select(type) {
        return function() {
            if (type.cost) {
                setTimeout(() => onChange(type))
            }
        }
    }
}
