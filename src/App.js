import React, { Component } from 'react'
import './App.css';
import {recipes} from './tempList'
import RecipeList from './components/RecipeList'
import RecipeDetails from './components/RecipeDetails';


export default class App extends Component {
  state = {
    recipes: recipes,
    url: "https://www.food2fork.com/api/search?key=75943523db8df7dd675a2977b1590713",
    details_id : 35382
}

// async getRecipes(){
//     try{
//         const data = await fetch("https://www.food2fork.com/api/search?key=75943523db8df7dd675a2977b1590713")
//         const jsonData = await data.json()
//         this.setState({
//             recipes : jsonData.recipes
//         })
//     }
//     catch(error){
// console.log(error);
//     }
// }

// componentDidMount(){
//     this.getRecipes()
// }
  render() {
    console.log(this.state.recipes)
    return (
     
      <React.Fragment>
    {/* <RecipeList recipes={this.state.recipes}/> */}
    <RecipeDetails id={this.state.details_id} />
      </React.Fragment>
    )
  }
}
