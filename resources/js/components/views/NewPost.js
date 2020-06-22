import React, {Component} from 'react'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import Spinner from 'react-bootstrap/Spinner'
import Fade from 'react-bootstrap/Fade'

class Post extends Component {

    constructor(props) {
        super(props)

        this.state = {
            title: '',
            body: '',
            loading: '',
            redirectId: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(e) {
        const {name, value} = event.target
        this.setState({
            [name]: value
        })
    }

    handleSubmit(e) {
        e.preventDefault()
        
        this.setState({loading: true})

        axios.post('/api/posts', {
            title: this.state.title,
            body: this.state.body
        }).then(response => {
            this.setState({
                redirectId: response.data.id,
                loading: false
            })
        });

        this.setState({
            title: '',
            body: ''
        })
    }  

    render() {
        return (
            this.state.loading ? <div className="loading-spinner"><Spinner animation="border" /></div> :
                <Fade in appear>
                <form onSubmit={this.handleSubmit}>
                    <h1>New Post</h1>
                    <div className="form-group">
                        <input
                            name="title"
                            onChange={this.handleChange}
                            value={this.state.title}
                            type="text" 
                            placeholder="Title" 
                            className="form-control" 
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <textarea
                            name="body"
                            onChange={this.handleChange}
                            value={this.state.body}
                            className="form-control" 
                            rows="14" 
                            maxLength="2000" 
                            placeholder="Enter your post content here..." 
                            required
                        />
                    </div>
                    <input type="submit" value="POST" className="btn btn-primary form-control" />
                    { this.state.redirectId && <Redirect to={`/${this.state.redirectId}?page=1`} />}
                </form>
            </Fade>
        )
    }
}

export default Post