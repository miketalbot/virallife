import {prevent, useLocalRefresh, useStructure, useTimeout} from '../../lib'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'
import {MdDelete} from 'react-icons/all'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import {generate} from 'shortid'
import React from 'react'
import {createName} from '../../names'
import {useRefresh} from 'common/useRefresh'
import Box from '@material-ui/core/Box'

export function Structures() {
    const refresh = useLocalRefresh()
    const { structures, setCurrent, current } = useStructure()
    return (
        <Card>
            <CardHeader title={'Levels'} />
            <CardContent>
                <Box maxHeight={252} clone overflow={'auto'}>
                    <List>
                        {structures.map((structure) => {
                            return <Entry structure={structure} key={structure.id} />
                        })}
                    </List>
                </Box>
            </CardContent>
            <CardActions>
                <Button color={'primary'} onClick={add}>
                    + Add
                </Button>
            </CardActions>
        </Card>
    )

    function select(structure) {
        return function() {
            setCurrent(structure)
        }
    }

    function remove(structure) {
        return function() {
            if (structure === current) {
                setCurrent(null)
            }
            structures.splice(structures.findIndex(structure), 1)
            refresh()
        }
    }

    function add() {
        let newStructure = {
            id: generate(),
            name: createName(),
            parts: [{ fixed: true, x: 0, y: 0, type: 'nucleus' }],
            created: new Date(),
            modified: new Date(),
        }
        structures.push(newStructure)
        setCurrent(newStructure)
        refresh()
    }
    function Entry({ structure }) {
        const refresh = useRefresh()
        useTimeout(refresh, Date.now() - structure.modified > 60000 ? 60000 : 500)
        return (
            <ListItem selected={current === structure} key={structure.id} button onClick={select(structure)}>
                <ListItemText
                    primary={structure.name}
                    secondary={`${new Date(structure.created).short()} (saved ${new Date(
                        structure.modified
                    ).relative()})`}
                />
                <IconButton color={'secondary'} onClick={prevent(remove(structure))}>
                    <MdDelete />
                </IconButton>
            </ListItem>
        )
    }
}
