import React, {Component} from 'react'
import Button from 'react-bootstrap/Button'
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom'

import Posts from './views/Posts'
import SinglePost from './views/SinglePost'
import NewPost from './views/NewPost'

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
        }
    }

    render() {

        return (
            <BrowserRouter>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-4 px-0">
                        <div className="card">
                            <div className="card-header p-2"><span className="float-left my-2 mx-2">Recent Posts</span> 
                                <Link to="/new-post">
                                    <Button className="float-right mx-2" variant="primary">New Post</Button>
                                </Link>
                            </div>
                            <div className="card-body overflow-auto p-0">
                                <Route path="/" component={Posts}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8 px-0">
                        <div className="card" style={{borderLeft: 0}} >
                            <div className="card-body overflow-auto">
                                <Switch>
                                    <Route path="/new-post" exact component={NewPost} />
                                    <Route path="/:id" component={SinglePost} />
                                </Switch>
                                {/* <Route render={() => <h1>Not Found</h1>} /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </BrowserRouter>
        )
    }
}

export default App
