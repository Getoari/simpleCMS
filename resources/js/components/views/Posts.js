import React, {Component} from 'react'
import axios from 'axios'
import Fade from 'react-bootstrap/Fade'
import Pagination from 'react-js-pagination'
import { NavLink } from 'react-router-dom'
import Spinner from 'react-bootstrap/Spinner'


class Posts extends Component {
    
    constructor() {
        super()
        this.state = {
            loggedUser: '',
            currentPage: 1,
            perPage: '', 
            total: '',
            loading: false,
            postSelected: '',
            posts: []
        }
    }

    componentDidMount() {

        if (parseInt(this.props.location.search.replace( '?page=', '')) > 1)
            this.getPosts(this.props.location.search.replace( '?page=', ''))
        else
            this.getPosts(this.state.currentPage)

        try {
            Echo.private('new-post').listen('PostCreated', e => {
                this.getPosts(this.state.currentPage)
            })
            Echo.private('update-post').listen('PostModified', e => {
                this.getPosts(this.state.currentPage)
            })
        } catch(error) {
            console.log(error)
        }
    }

    getPosts(pageNumber) {
        this.setState({loading: true})
        axios.get(`/api/posts?page=${pageNumber}`).then((
            response 
        ) => {
            this.setState({
                currentPage: response.data.posts.current_page, 
                perPage: response.data.posts.per_page, 
                total: response.data.posts.total,
                posts: [...response.data.posts.data],
                loggedUser: response.data.user.username
            })
            this.setState({loading: false})
        }).catch(function (error) {
            this.getPosts(currentPage)
        })
      
    }

    render() {
        return (
            this.state.loading ? <div className="loading-spinner"><Spinner animation="border" /></div> :
            <React.Fragment>
            {this.state.posts.map(post => (
                <NavLink className="media mini-post" to={{
                    pathname: '/' + post.id,
                    search: '?page=' +  this.state.currentPage}} key={post.id}>
                    <Fade in appear >
                        <div className="media-body" >
                            <h4>{post.title}</h4>
                            <small><i>Posted by: <strong>{post.user.username}</strong></i></small><br/>
                            <p>{post.body}</p>
                        </div>
                    </Fade>
                </NavLink>
            ))}
            { this.state.total && 
                <div className="text-center p-3"> 
                <Pagination
                    activePage={this.state.currentPage}
                    itemsCountPerPage={this.state.perPage}
                    totalItemsCount={this.state.total}
                    pageRangeDisplayed={5}
                    onChange={(pageNumber) => this.getPosts(pageNumber)}
                    itemClass="page-item"
                    linkClass="page-link"
                    firstPageText="First"
                    lastPageText="Last"
                />
                </div>
            }
            </React.Fragment>
        )
    }
}

export default Posts