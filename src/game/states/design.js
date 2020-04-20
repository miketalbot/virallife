import React, {useRef, useState} from 'react'
import {register} from 'game'
import MUIContainer from '@material-ui/core/Container'
import {Box} from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import {getStructures, saveStructures} from '../data'
import {useRefresh} from 'common/useRefresh'
import {StructureContext} from '../lib'
import {Structures} from './components/structures'
import {Design} from './components/editor'
import {Preview} from './components/preview'
import {Navigation} from '../../standard-nav'

register('design', { Page })

function Page() {
    const [current, setCurrent] = useState(null)
    const structures = useRef(getStructures())
    const refresh = useRefresh(save)
    return (
        <StructureContext.Provider value={{ setCurrent, current, refresh, save, structures: structures.current }}>
            <MUIContainer>
                <Navigation/>
                <Grid container spacing={2} alignItems={'stretch'}>
                    <Grid item xs={12}>
                        <Box height={1} clone>
                            <Structures/>
                        </Box>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Design current={current}/>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Preview current={current} />
                    </Grid>
                </Grid>
            </MUIContainer>
        </StructureContext.Provider>
    )

    function save() {
        if (current) {
            current.modified = Date.now()
        }
        saveStructures(structures.current)
    }
}
