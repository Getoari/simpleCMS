import React, {Component} from "react"
import axios from "axios"

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            title: '',
            body: '',
            posts: []
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleTitleChange = this.handleTitleChange.bind(this)
        this.handleBodyChange = this.handleBodyChange.bind(this)
        this.renderPosts = this.renderPosts.bind(this)

        this.getPosts()
    }

    getPosts() {
        axios.get('/posts').then((
            response 
        ) =>
            this.setState({
                posts: [...response.data.posts]
            })
        );
    }

    componentDidMount() {
        Echo.private('new-post').listen('PostCreated', e => {
            console.log('from pusher', e.post);
            this.setState({ posts: [e.post, ...this.state.posts] });
        });
    }

    handleSubmit(e) {
        e.preventDefault()
        
        axios.post('/posts', {
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

    handleTitleChange(e) {
        this.setState({
            title: e.target.value
        })
    }

    handleBodyChange(e) {
        this.setState({
            body: e.target.value
        })
    }

    renderPosts() {
        return this.state.posts.map(post => (
            <div key={post.id} className="media">
                <div className="media-body">
                    <h4>{post.title}</h4>
                    <small><i>Posted by: {post.user.username}</i></small><br/>
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
                                            onChange={this.handleTitleChange}
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
                                            onChange={this.handleBodyChange}
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