import React, { Component } from "react";
import NewsItem from "./NewsItem";
import PropTypes from 'prop-types'
//<iframe src="https://giphy.com/embed/xTk9ZvMnbIiIew7IpW" width="480" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/loop-loading-loader-xTk9ZvMnbIiIew7IpW">via GIPHY</a></p>

export class News extends Component {

     static defaultProps = {
          country: "in",
          pageSize: "9",
          category:"general"
     }
     static propTypes = {
          country: PropTypes.string,
          pageSize: PropTypes.string,
          category:PropTypes.string
     }
     
     constructor() {
          super();
          this.state = {
               articles: [],
               loading: true,
               page: 1,

          };
          this.handlePrevClick = this.handlePrevClick.bind(this);
          this.handleNextClick = this.handleNextClick.bind(this);
     }

     async gettingData(pageNo) {
          console.log("ok")
          let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&sortBy=popularity&category=${this.props.category}&apiKey=86a2c3d7283f445a9312dded5ba3abd4&page=${pageNo}&pageSize=${this.props.pageSize}`;
          let data = await fetch(url);
          let parseData = await data.json();
          this.setState({ articles: parseData.articles, loading: false, totalResults: parseData.totalResults});
     }

     async componentDidMount() {
          this.gettingData(this.state.page);
     }

     async handlePrevClick() {
          this.setState({
              loading:true
         })
          this.gettingData(this.state.page - 1);
           this.setState((state) => ({
                page: state.page - 1,
           }));
     }

     async handleNextClick() {
           this.setState({
                loading: true,
           });
          if (this.state.page + 1 <= Math.ceil(this.state.totalResults / this.props.pageSize)) {
               this.gettingData(this.state.page + 1);
               this.setState((state) => ({
                    page: state.page + 1,
               }));
          }
     }

     render() {
          if (!this.state.loading) {
               return (
                    <div className="container my-3">
                         <h2>Top Headlines</h2>
                         <div className="row">
                              {this.state.articles.map((element) => {
                                   return (
                                        <div
                                             className="col-md-4"
                                             key={
                                                  element.url
                                             } /* it is better to set key for eveery element in map to DOM  */
                                        >
                                             <NewsItem
                                                  title={
                                                       element.title
                                                            ? element.title.slice(
                                                                   0,
                                                                   45,
                                                              )
                                                            : ""
                                                  }
                                                  description={
                                                       element.description
                                                            ? element.description.slice(
                                                                   0,
                                                                   88,
                                                              )
                                                            : ""
                                                  }
                                                  imageUrl={element.urlToImage}
                                                  newsUrl={element.url}
                                             />
                                        </div>
                                   );
                              })}
                         </div>
                         <div className="container d-flex justify-content-between">
                              <button
                                   type="button"
                                   className="btn btn-dark"
                                   onClick={this.handlePrevClick}
                                   disabled={this.state.page <= 1}
                              >
                                   &larr; Previous Page
                              </button>
                              <button
                                   type="button"
                                   className="btn btn-dark"
                                   onClick={this.handleNextClick}
                                   disabled={
                                        this.state.page + 1 >
                                        Math.ceil(this.state.totalResults / this.props.pageSize)
                                   }
                              >
                                   Next Page &rarr;
                              </button>
                         </div>
                    </div>
               );
          } else {
               return (
                    <div className="container d-flex justify-content-center align-item-center text-center">
                         <img
                              src="https://media.tenor.com/DPEfCqnChk0AAAAi/loading-slow-net.gif"
                              alt="loading..."
                         />
                    </div>
               );
          }
     }
}

export default News;
