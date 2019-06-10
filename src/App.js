import React, { Component } from 'react'
import './App.css';
import {recipes} from './tempList'
import RecipeList from './components/RecipeList'
import RecipeDetails from './components/RecipeDetails';


export default class App extends Component {
  state = {
    recipes: [],
    url: "https://www.food2fork.com/api/search?key=9f7021171e95181c6daa2f6147d81c72",
    base_url: "https://www.food2fork.com/api/search?key=9f7021171e95181c6daa2f6147d81c72", 
    details_id : 35389,
    pageIndex: 1,
    search : '',
    query: '&q='    
}

async getRecipes(){
    try{
        const data = await fetch(this.state.url)
        const jsonData = await data.json()
        this.setState({
            recipes : jsonData.recipes
        })
    }
    catch(error){
console.log(error);
    }
}

componentDidMount(){
    this.getRecipes()
}

displayPage = (index) => {
switch(index){
  default:
  case 1:
    return (
    <RecipeList 
      recipes={this.state.recipes} 
      handleDetails={this.handleDetails}
      value={this.state.search}
      handleChange={this.handleChange}
      handleSubmit = {this.handleSubmit}
      />
      );
  case 0:
    return (<RecipeDetails 
      id={this.state.details_id} 
      handleIndex={this.handleIndex}/>)
}
}

handleIndex = index => {
  this.setState({
    pageIndex:index
  });
}

handleDetails = (index,id) => {
  this.setState({
    pageIndex: index,
    details_id: id
  })
}

handleChange = (e) => {
  console.log("change")
  this.setState({
    search:e.target.value
  })
}

handleSubmit = (e) => {
  e.preventDefault();
  const { base_url, query, search } = this.state;
  this.setState(
    {
      url: `${base_url}${query}${search}`,
      search: ""
    },
    () => {
      this.getRecipes();
      console.log(this.state);
    }
  );    
}

render() {
    console.log(this.state.recipes)
    return (
      <React.Fragment>
         {this.displayPage(this.state.pageIndex)}
      </React.Fragment>
    )
  }
}
