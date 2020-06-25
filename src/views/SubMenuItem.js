import React, {useEffect, useState} from 'react'
import { ListItemText, Button } from '@material-ui/core'
import useToggle from '../hooks/useToggle';
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ListItem from '@material-ui/core/ListItem'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Collapse from '@material-ui/core/Collapse';
import {NavLink} from 'react-router-dom'
import List from '@material-ui/core/List'

const useStyles = makeStyles(() => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		width: '100%'
	},
	notPaddingTopBottom: {
		paddingTop: 0,
		paddingBottom: 0
	},
	notPaddingLeftRight: {
		paddingRight: 0
	},
	button: {
		padding: 0,
		minWidth: 0,
	},
	chosenButton: {
		fontWeight: 'bold',
		color: '#3D3D3D !important'
	},
	buttonText: {
		width: '100%',
		fontStyle: 'normal',
		fontWeight: 500,
		fontSize: '14px',
		lineHeight: '21px',
		color: '#C5C5C5',
	},
	buttonSubMenutext: {
		fontStyle: 'normal',
		fontSize: '15px',
		lineHeight: '21px',
		color: '#C5C5C5'
	},
	textTruncated: {
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		fontWeight: 600,
		textAlign: 'start'
	},
	chosenParent: {
		color: '#EC5D5C',
	}
}))

export function SubMenuItemNode (props) {
	const {renderNav, children, name, baseURI} = props
	const [isDisplay, toggleDisplay] = useToggle(true)
	const [isParentChosen, setParentChosen] = useState(false)
	const classes = useStyles()
	const handleToggleDisplay = () => {
		toggleDisplay()
	}

	const currentURI = window.location.href

	useEffect(()=> {
		const parentURI = []
		let parentChosenValue = false
		children.forEach(item => parentURI.push(baseURI+item.uri))
		
		parentURI.forEach(item => {
			if(currentURI.includes(item)) {
				parentChosenValue = true
			}
		})
		setParentChosen(parentChosenValue)
	}, [children, baseURI, currentURI])

	return (<List>
						<ListItem className={clsx(classes.root, classes.notPaddingTopBottom, classes.notPaddingLeftRight)}>
							<Button className={clsx(classes.buttonText, (isParentChosen) && classes.chosenParent)} style={{paddingLeft: 0}} onClick={() => handleToggleDisplay()}>
								<ListItemText classes={{primary: classes.textTruncated}} primary={name}/>
								{isDisplay ? <ExpandLess /> : <ExpandMore />}
							</Button>
							<Collapse style={{width: '100%'}} in={isDisplay}>
								{renderNav(children, baseURI)}
							</Collapse>
						</ListItem>
					</List>)
}

export function SubMenuItemLeaf(props) {
	const classes = useStyles()
	const {repoId, uri, name, handleLink, baseURI} = props
	let parentURI = ''

	if(baseURI) {
		parentURI = baseURI
	}

	return (<List>
						<ListItem className={clsx(classes.notPaddingTopBottom, classes.notPaddingLeftRight,)} button key={name}>
							<NavLink className={classes.buttonSubMenutext} activeClassName={classes.chosenButton} key={name} to={`/repository/${repoId}${parentURI}${uri}`} style={{ width: '100%' }} onClick={handleLink}>
								{name}
							</NavLink>
						</ListItem>
					</List>)
}