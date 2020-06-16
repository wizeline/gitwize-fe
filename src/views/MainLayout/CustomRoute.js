import React from 'react';
import {Route} from 'react-router-dom';
import Container from '@material-ui/core/Container';

export const CustomRoute = ({
    navBar: NavBar,
    component: Component,
    ...rest
}) => (
    <React.Fragment>
      <NavBar />
        <Container>
        <Route {...rest} component={(props) => {return <Component {...props} />}}/>
      </Container>
    </React.Fragment>
)