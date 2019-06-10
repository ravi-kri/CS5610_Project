import React, { Component } from 'react'

export default class Recipe extends Component {
    render() {
        const {
            image_url,
            title,
            publisher,
            recipe_id
        }  = this.props.recipe
    const { handleDetails } = this.props;
        return (
           <React.Fragment>
            <div className="col-10 mx-auto col-md-6 col-lg-4 my-3">
                <div className="card">
                    <img src={image_url}
                           className="img-card-top"
                           style={{height:"14rem"}}
                           alt="recipe" />
                    <div className="card-body">
                        <h6>{title}</h6>
                        <h6 className="text-warning text-styling">Provided By {publisher}</h6>
                    </div>
                    <div className="card-footer">
                        <button type="button"
                        className="btn btn-info"
                        onClick = {() => handleDetails(0,recipe_id)}
                        >View Recipe </button>
                    </div>
                </div>
            </div>
           </React.Fragment>
        )
    }
}
