import React, {Component} from 'react'
import axios from 'axios'
import Button from 'react-bootstrap/Button'
import Fade from 'react-bootstrap/Fade'
import Spinner from 'react-bootstrap/Spinner'

import Edit from './Edit'

class SinglePost extends Component {

    constructor(props) {
        super(props)

        this.state = {
            currentPostId: '',
            loggedUser: '',
            loading: true,
            post: []
        }

        this.handleDelete = this.handleDelete.bind(this)
    }

    componentDidMount() {
        this.loadPost()

        Echo.private('update-post').listen('PostModified', e => {
            this.setState({currentPostId: -1})
        })
    }

    componentDidUpdate() {
        if (!this.state.loading && (this.props.match.params.id != this.state.currentPostId)) {
            this.setState({loading: true})
            this.loadPost()
        }
    }

    handleDelete(e) {
        const id = e.target.id

        this.setState({loading: true})

        axios.delete(`/api/posts/${id}`)
        .then(res => {
            if (res.status === 200) {
                this.setState({
                    loading: false,
                    currentPostId: ''
                })
            }
        })
    }  

    loadPost() {
        const id = this.props.match.params.id
        
        if(id && (id != this.state.currentPostId)) {
            axios.get(`/api/posts/${id}`).then((
                response 
            ) => {
                this.setState({
                    currentPostId: id,
                    loading: false,
                    loggedUser: response.data.user.username,
                    post: [...response.data.post],
                })
            });
        }
    }

    render() {
        return (
            this.state.loading ? <div className="loading-spinner"><Spinner animation="border" /></div> :
            this.state.post.map(post => (
                <Fade in appear key={post.id}>
                <div id="post-container">
                    <h1>
                        {post.title}
                        {this.state.loggedUser === post.user.username && <span className="px-2">
                        <Button id={post.id} className="float-right mx-2" onClick={this.handleDelete} variant="danger">Delete</Button>
                        <Edit id={post.id} title={post.title} body={post.body} />
                        </span>}
                    </h1>
                    <i>Posted by: {post.user.username}</i>
                    <hr/>
                    <p className="text-justify">{post.body}</p>
                </div>
                </Fade>
            ))
        )
    }
}

export default SinglePost