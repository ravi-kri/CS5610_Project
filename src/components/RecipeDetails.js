import React, { Component } from 'react'
import {recipe} from "../tempDetails"

export default class RecipeDetails extends Component {
    constructor(props){
        super(props)
        this.state={
            recipe:{},
            url:`https://www.food2fork.com/api/get?key=75943523db8df7dd675a2977b1590713&rId=${this.props.id}`
        }
    }
    render() {
        return (
            <React.Fragment>
                These are details
            </React.Fragment>
        )
    }
}
