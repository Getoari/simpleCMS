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

        //bind
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleTitleChange = this.handleTitleChange.bind(this)
        this.handleBodyChange = this.handleBodyChange.bind(this)
    }

    handleSubmit(e) {
        e.preventDefault()
        
        axios.post('/posts', {
            title: this.state.title,
            body: this.state.body
        })
        .then(response => {
            this.setState({
                posts: [...this.state.posts, response.data]
            })
        })

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
                                {this.state.posts.map(post => (
                                    <div key={post.id.toString()} className="media">
                                        <div className="media-object">
                                            <p>Title: {post.title}</p>
                                            <small>Posted by: {post.user.username}</small>
                                            <p>{post.body}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        );
    }
}

export default App;