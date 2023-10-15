import React from 'react';
import { Button, Form, Card, Input, TextArea, Image } from 'semantic-ui-react';
import { auth } from "./src/firebase.js";
import { storage } from "./src/firebase.js";
import { firestore } from "./src/firebase.js";
import CustomHeaderMenu from './src/components/CustomHeaderMenu';


export default class AdminPost extends React.Component {
  constructor() {
    super()
    var today = new Date(),
      month = today.getMonth() + 1,
      date = + today.getFullYear() + '-' + month + '-' + today.getDate()
    const timeStamp = () => {
      let options = {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      };
      let now = new Date().toLocaleString('en-US', options);
      return now;
    };
    this.state = {
      isAllowingPost: false,
      Title: "",
      FirstParagraph: "",
      Article: "",
      AuthorName: "",
      Date: date,
      FileName: "",
      DownloadURL: "",
      time: timeStamp(),
      selectedFile: null,
      imgSrc: null,
    }
    this.fileUploadRef = React.createRef();
  }

  componentDidMount() {
    let currentComponent = this;
    if (auth.currentUser !== null) {
      const uid = auth.currentUser.uid;
      const userRef = firestore.doc(`users/${uid}`);
      userRef.get().then(function (doc) {
        if (doc.exists) {
          const userType = doc.data().userType;
          console.log("document data: ", doc.data().userType);
          if (userType === "ADMIN") {
            currentComponent.setState({
              isAllowingPost: true

            });
          }
          console.log("UserType: ", userType);
          console.log("isAllowingPost", currentComponent.state.isAllowingPost);
        }
        else {
          console.log("no such document");
        }

      }).catch(function (error) {
        console.log("Error getting document:", error);
      });
    }
  }

  onChangeTitle(event) {
    this.setState({
      Title: event.target.value
    });
    //console.log(this.state.Title);
  }

  onChangeFirstParagraph(event) {
    this.setState({
      FirstParagraph: event.target.value
    });
    //console.log(this.state.FirstParagraph);
  }

  onChangeArticle(event) {
    this.setState({
      Article: event.target.value
    });
    //console.log(this.state.Article);
  }
  onChangeAuthor(event) {
    this.setState({
      AuthorName: event.target.value
    });
  }

  postingArticle(event) {
    event.preventDefault();
    const { selectedFile } = this.state;
    let currentComponent1 = this;
    if (this.state.isAllowingPost === true) {
      const ref = storage.ref();
      const file = selectedFile;
      const name = new Date() + "";
      const metadata = {
        contentType: file.type
      };
      const task = ref.child(name).put(file, metadata);
      this.setState({
        FileName: file.name
      })

      task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
          console.log(url)
          currentComponent1.setState({
            DownloadURL: url
          })
          const image = document.querySelector('#image')
          image.src = url
          console.log("Testing: ", currentComponent1.state.DownloadURL);
          firestore.collection("news").doc(name).set({
            title: currentComponent1.state.Title,
            firstParagraph: currentComponent1.state.FirstParagraph,
            article: currentComponent1.state.Article,
            author: currentComponent1.state.AuthorName,
            date: currentComponent1.state.Date,
            imageDownloadURL: currentComponent1.state.DownloadURL,
            comments: [{
              email: 'Example@gmail.com',
              comment: 'this is an automated comment',
              time: currentComponent1.state.time
            }]
          })
        });
    }
    else {
      alert("You are not allowed to post an article!")
    }


  }

  handleSelectFile(event) {
    const selectedFile = event && event.target && event.target.files && event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = () => {
      this.setState({ imgSrc: reader && reader.result, selectedFile });
    };
  }

  render() {
    const { selectedFile, imgSrc } = this.state;
    return (
      <CustomHeaderMenu
        activeSearchBar={false}
        activeBreadcumb
        childrenRender={(
          <Card className="card-post-article">
            <h1>ARTICLE POSTING</h1>
            <Form>
              <Form.Field>
                <label htmlFor="">Title</label>
                <Input
                  name="Title"
                  id="Title"
                  onChange={this.onChangeTitle.bind(this)}
                />
              </Form.Field>
              <Form.Field>
                <label htmlFor="">Author Name</label>
                <Input
                  name="Author"
                  id="Author"
                  onChange={this.onChangeAuthor.bind(this)}
                />
              </Form.Field>


              <Form.Field>
                <label htmlFor="">First Paragraph</label>
                <TextArea
                  rows={10}
                  name="FirstParagraph"
                  id="FirstParagraph"
                  onChange={this.onChangeFirstParagraph.bind(this)}
                />
              </Form.Field>
              <Form.Field>
                <Button name="uploadFile" className="btn-upload-file" onClick={() => {
                   if (this.fileUploadRef && this.fileUploadRef.current) {
                    this.fileUploadRef.current.inputRef.current.click();
                  }
                }}>Select File</Button>
                <Input ref={this.fileUploadRef} type="file" id="photo" style={{ display: 'none' }} onChange={this.handleSelectFile.bind(this)} />
                {selectedFile && <Image src={imgSrc} style={{  }} />}
                {/* <img id="image" width="1150" height="750" /> */}
              </Form.Field>


              <Form.Field>
                <label htmlFor="">The Rest Of The Article</label>
                <TextArea
                  rows={10}
                  name="Article"
                  id="Article"
                  onChange={this.onChangeArticle.bind(this)}
                />
              </Form.Field>
              <Button
                class="btn btn-success"
                type="submit"
                onClick={this.postingArticle.bind(this)}
              >
                Post Article
                </Button>

            </Form>
          </Card>
        )}
      />

    )
  }
}