import React, { useState } from 'react';
import { Button, Form, Modal, Divider } from 'rsuite';
import PlusIcon from '@rsuite/icons/legacy/Plus';
import CameraRetroIcon from '@rsuite/icons/legacy/CameraRetro';
import { useModalState } from '../misc/custom-hooks';
import FormGroup from 'rsuite/esm/FormGroup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  

const AddNewTweet = () => {
 
  const { isOpen, open, close } = useModalState();  
  const [previewOpen, setPreviewOpen] = useState(false);  
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);

  // Handle text change in tweeter
  const handleTextChange = (e) => {
    const value = e.target.value;
    if (value.length <= 280) {
      setText(value);
    }
  };

  // Handle file change (to sekect only one img)
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Open the preview modal 
  const handleOpenPreview = () => {
    if (text.trim() === '' && !file) {
      toast.error('Cannot post an empty tweet!');
      return;
    }
    setPreviewOpen(true);  // Show the preview modal opene it if
  };

  // Close the preview modal
  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  // Post the tweet  
  const handlePostTweet = () => {
    toast.success('Post is tweeted successfully!');
    setPreviewOpen(false); 
    close(); 
    setText('');  
    setFile(null); 
  };

  return (
    <div className="mt-1">
      <Button block style={{ backgroundColor: 'green', color: 'white' }} onClick={open}>
        <PlusIcon style={{ marginRight: '8px' }} /> Add New Tweet
      </Button>
      <ToastContainer /> 

      {/* Tweet Creation Modal front-end */}
      <Modal open={isOpen} onClose={close}>
        <Modal.Header>
          <Modal.Title>Add new tweet post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid>
            <FormGroup>
              <Form.ControlLabel>Write anything in mind?</Form.ControlLabel>
              <textarea
                id="comment"
                rows="4"
                className="form-control"
                value={text}
                onChange={handleTextChange}
                style={{ width: '92%', padding: '5px' }}
                placeholder="Enter your thoughts!"
              />
              <div style={{ textAlign: 'right' }}>
                <small>{text.length}/280</small>
              </div>
            </FormGroup>

            <FormGroup>
              <Form.ControlLabel>Upload Image or GIF</Form.ControlLabel>
              <Button appearance="subtle" onClick={() => document.getElementById('file-upload').click()}>
                <CameraRetroIcon style={{ marginRight: '8px' }} /> Upload Image/GIF
              </Button>
              <input
                type="file"
                id="file-upload"
                accept="image/*,image/gif"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              {file && <p>Selected file: {file.name}</p>}
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button block appearance="primary" onClick={handleOpenPreview}>
            Post Tweet
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Preview Modal front */}
      <Modal open={previewOpen} onClose={handleClosePreview}>
        <Modal.Header>
          <Modal.Title>Preview Tweet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{text}</p>
          {file && (
            <div>
              <Divider />
              <img
                src={URL.createObjectURL(file)}
                alt="Tweet preview"
                style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
              />
              <Divider />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button appearance="primary" onClick={handlePostTweet}>
            Post Tweet
          </Button>
          <Button appearance="subtle" onClick={handleClosePreview}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddNewTweet;
