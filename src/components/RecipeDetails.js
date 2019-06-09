import React, { Component } from 'react'
import {recipe} from "../tempDetails"

export default class RecipeDetails extends Component {
    constructor(props){
        super(props)
        this.state={
            recipe:recipe,
            url:`https://www.food2fork.com/api/get?key=23454f794798f76a98ea86aaac2d2b72&rId=${this.props.id}`
        }
    } 

async componentDidMount(){
    try{
        const data = await fetch(this.state.url)
        const jsonData = await data.json()
        this.setState({
            recipe : jsonData.recipe
        })
    }
    catch(error){
console.log(error);
    }
}

    render() {
        const{image_url,publisher,publisher_url,source_url,title,ingredients} = this.state.recipe;
        const {handleIndex} = this.props
        return (
            <React.Fragment>
                <div className="container">
                    <div className="row">
                    <div className="col-10 mx-auto col-md-6 my-3">
                    <button type="button" className="btn btn-warning mb-5"
                    onClick = {() => handleIndex(1)}
                    >
                        Back to the List
                    </button>
                    <img src={image_url} className="d-block w-100" alt="recipe"/>
                    {/* details */} 
                    </div>
                    <div className="col-10 mx-auto col-md-6 my-3">
                    <h6>{title}</h6>
                    <h6 className="text-warning text-styling">{publisher}</h6>
                    <a href={publisher_url}
                    target="_blank"
                    className="btn btn-primary mt-2">Link to the Publisher</a>
                    <a href={source_url}
                    target="_blank"
                    className="btn btn-success mt-2 mx-3">View Source</a>
                    <ul className="list-group mt-4">
                        <h2 className="mt-3 mb-4">Ingredients</h2>
                        {
                            ingredients.map((item,index) => {
                                return (
                                    <li key={index} className="list-group-item text-styling">{item}</li>
                                )
                            })
                        }
                    </ul>
                    </div>
                    </div>
                    </div>
                        
                        
        </React.Fragment>
        )
    }
}
