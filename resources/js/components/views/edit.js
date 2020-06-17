import React, { useState } from 'react'
import axios from 'axios'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'


function Edit(props) {

    const [show, setShow] = useState(false)

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const [title, setTitle] = useState(props.title)
    const [body, setBody] = useState(props.body)

    function handleSubmit() {

        axios.put(`/api/posts/${props.id}`, {
            title: title,
            body: body
        }).then(response => {
            if (response.status === 200)
                setShow(false)
        }); 
        
    }

    return (
        <>
        <Button className="float-right" onClick={handleShow} variant="secondary">Edit</Button>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Post</Modal.Title>
            </Modal.Header>
                <Modal.Body>
                        {/* Title */}
                        <div className="form-group">
                            <input
                                name="title"
                                onChange={e => setTitle(e.target.value)}
                                value={title}
                                type="text" 
                                className="form-control" 
                                required
                            />
                        </div>
                        {/* Body */}
                        <div className="form-group">
                            <textarea
                                name="body"
                                onChange={e => setBody(e.target.value)}
                                value={body}
                                className="form-control" 
                                rows="5" 
                                maxLength="200"
                                required
                            />
                        </div>
                </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleSubmit}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}

export default Edit