import React from 'react'
import { Col, Grid, Row} from 'rsuite'
import Sidebar from '../components/Sidebar'
import TimelinePage from './TimelinePage'

const Home = () => {
  return <Grid fluid className='h-100'>
     <Row>
        <Col xs={24} md={8}>
           <Sidebar/>
        </Col>

        <Col xs={24} md={8}>
           <TimelinePage/>
        </Col>
     </Row>
  </Grid>
}

export default Home