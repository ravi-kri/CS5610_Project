import React, { Component } from 'react'

export default class RecipeSearch extends Component {
    render() {
        const {handleSubmit,handleChange,value} = this.props;
        return (
         
           <React.Fragment>
              <div className="container">
                  <div className="row">
                      <div className="col-10 mx-auto col-md-8 mt-5 text-center">
                         <h1>Search Recipes</h1>
                         <form
                            className="mt-4"
                            onSubmit = {handleSubmit}
                            >
                                <div className="input-group">
                                <input type="text" name="search" 
                                className="form-control" 
                                placeholder="Enter your keyword here"
                                value = {value}
                                onChange = {handleChange}
                                />
                                <div className="input-group-append">
            <button
              
                className="btn btn-primary">
                Search
            </button>
            </div>
                                </div>
                            </form>
                      </div>
                  </div>
              </div>
           </React.Fragment>
        )
    }
}
