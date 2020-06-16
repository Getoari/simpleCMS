import React, {Component} from "react"
import axios from "axios"
import Button from 'react-bootstrap/Button';

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            title: '',
            body: '',
            loggedUser: '',
            postToDelete: '',
            posts: []
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.renderPosts = this.renderPosts.bind(this)
    }

    getPosts() {
        axios.get('/api/posts').then((
            response 
        ) =>
            this.setState({
                posts: [...response.data.posts],
                loggedUser: response.data.user.username
            })
        );
    }

    componentDidMount() {

        this.getPosts()

        Echo.private('new-post').listen('PostCreated', e => {
            // console.log('from pusher', e.post);
            this.setState({ posts: [e.post, ...this.state.posts] });
        });
    }

    handleSubmit(e) {
        e.preventDefault()
        
        axios.post('/api/posts', {
            title: this.state.title,
            body: this.state.body
        }).then(response => {
            this.setState({
                posts: [response.data, ...this.state.posts],
                title: '',
                body: ''
            });
        });

        this.setState({
            title: '',
            body: ''
        })
    }    

    handleChange(e) {
        const {name, value} = event.target
        this.setState({
            [name]: value
        })
    }

    handleDelete(e) {

        const id = e.target.id

        axios.delete(`/api/posts/${id}`)
        .then(res => {
            if (res.status === 200) {
                this.getPosts()
                // let remainingPosts = this.state.posts.filter((post) => {
                //     return post.id !== id
                // });
            
                // this.setState({ posts: remainingPosts })
            }
        })
    }    

    renderPosts() {
        return this.state.posts.map(post => (
            <div key={post.id} className="media">
                <div className="media-body">
                    <h4>{post.title} {this.state.loggedUser === post.user.username && <Button id={post.id} className="float-right" onClick={this.handleDelete} variant="danger">Delete</Button>}</h4>
                    <small><i>Posted by: <strong>{post.user.username}</strong></i></small><br/>
                    <p>{post.body}</p>
                    <hr/>
                </div>
            </div>
        ))
    }

    render() {
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">Post Something</div>
    
                            <div className="card-body">
                                <form onSubmit={this.handleSubmit}>
                                    {/* Title */}
                                    <div className="form-group">
                                        <input
                                            name="title"
                                            onChange={this.handleChange}
                                            value={this.state.title}
                                            type="text" 
                                            placeholder="Enter your post title here!" 
                                            className="form-control" 
                                            required
                                        />
                                    </div>
                                    {/* Body */}
                                    <div className="form-group">
                                        <textarea
                                            name="body"
                                            onChange={this.handleChange}
                                            value={this.state.body}
                                            className="form-control" 
                                            rows="5" 
                                            maxLength="200" 
                                            placeholder="Enter you post text here!" 
                                            required
                                        />
                                    </div>
                                    <input type="submit" value="POST" className="form-control" />
                                </form>
                            </div>
                        </div>
                    </div>
    
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">Recent Posts</div>
                            <div className="card-body">
                                {this.renderPosts()}
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        );
    }
}

export default App;