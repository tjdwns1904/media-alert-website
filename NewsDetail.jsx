import React from 'react'
import { firestore } from "./src/firebase.js";
import { auth } from "./src/firebase.js";
import { last, get } from 'lodash';
import useReactRouter from 'use-react-router'
import { Image, Button, Table, Input, Card, Label, TextArea } from 'semantic-ui-react';
import CustomHeaderMenu from './src/components/CustomHeaderMenu';
import { withRouter } from 'react-router-dom'

class NewsDetail extends React.Component {
  constructor() {
    super();
    const { pathname } = window && window.location;
    const newsURL = last(pathname.split('/'));
    const newsTitle = newsURL.replace(/-/g, ' ');
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
      title: newsTitle,
      newsID: '',
      article: '',
      imageDownloadURL: '',
      firstParagraph: '',
      date: '',
      author: '',
      comments: [],
      currentComment: '',
      currentUserEmail: '',
      timeForComment: timeStamp(),

    }
  }
  componentDidMount() {
    let currentComponent = this;
    firestore.collection('news').where("title", "==", this.state.title)
      .get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {

          currentComponent.setState({
            author: doc.data().author,
            date: doc.data().date,
            firstParagraph: doc.data().firstParagraph,
            article: doc.data().article,
            imageDownloadURL: doc.data().imageDownloadURL,
            comments: doc.data().comments,
            newsID: doc.id

          })
          currentComponent.setState({
            comments: currentComponent.state.comments.sort(function (a, b) {
              var dateA = new Date(a.time), dateB = new Date(b.time);
              return dateB - dateA;
            })

          })

          console.log(currentComponent.state.comments);
          console.log(currentComponent.state.newsID);

        })
      }).catch(function (error) {
        console.log("Error getting document:", error);

      });
    if (auth.currentUser != null) {
      currentComponent.setState({
        currentUserEmail: auth.currentUser.email
      })
    }

  }
  postingComment(event) {
    event.preventDefault();
    let currentComponent1 = this;
    currentComponent1.state.comments.push({
      email: currentComponent1.state.currentUserEmail,
      comment: currentComponent1.state.currentComment,
      time: currentComponent1.state.timeForComment
    })
    firestore.collection('news').doc(currentComponent1.state.newsID)
      .set({
        title: currentComponent1.state.title,
        firstParagraph: currentComponent1.state.firstParagraph,
        article: currentComponent1.state.article,
        author: currentComponent1.state.author,
        date: currentComponent1.state.date,
        imageDownloadURL: currentComponent1.state.imageDownloadURL,
        comments: currentComponent1.state.comments
      })
    alert("Comment is posted successfully!");

  }

  onChangeComment(event) {
    this.setState({
      currentComment: event.target.value
    })
  }
  render() {

    if (this.state.currentUserEmail !== '') {
      return (
        <CustomHeaderMenu
          activeSearchBar={false}
          activeBreadcumb
          childrenRender={(
            <Card
              className="card-news-detail"
              color="green"
            >
              <Card.Content>
                <h1>{this.state.title || ''}</h1>
                <h2>{this.state.author || ''} | {this.state.date || ''}</h2>
                <h3>{this.state.firstParagraph}</h3>

                <Image src={this.state.imageDownloadURL} />

                <h4 style={{ justifyContent: 'left', textAlign: 'left' }}>{this.state.article}</h4>


                <h3 class="header" style={{ color: '#71B9B5', textAlign: 'left', display: 'block', width: '100%', marginTop: 20 }}>Comments</h3>

                {this.state.comments.map((comment) => {
                  return (
                    <Card
                      color="green"
                      style={{ width: '100%', float: 'left', textAlign: 'left' }}
                    >
                      <Card.Content>
                        <h4>
                          {comment.email} says
                          <span style={{ display: 'block', width: '10%', float: 'right' }}>
                            {comment.time}
                          </span>
                        </h4>
                        <p>
                          {comment.comment}
                        </p>
                      </Card.Content>
                    </Card>
                  )
                })}
                <div class="comment-form" style={{ textAlign: 'center' }}>
                  <form>
                    <TextArea
                      id="comment"
                      rows={10}
                      style={{ width: '100%', padding: 10, borderRadius: 5, borderColor: '#71B9B5' }}
                      placeholder="Comment"
                      onChange={this.onChangeComment.bind(this)}
                    />
                    <Button style={{ backgroundColor: '#71B9B5', color: 'whitesmoke' }} type="submit" onClick={this.postingComment.bind(this)} >COMMENT</Button>
                  </form>
                </div>
              </Card.Content>
              <Button
                color='black'
                content='Back'
                icon='angle left'
                onClick={() => this.props.history.goBack()}
              />
            </Card>
          )} />
      )
    } else {
      return (
        <CustomHeaderMenu
          activeSearchBar={false}
          activeBreadcumb
          childrenRender={(
            <div>
              <div className="container">
                <h1>{this.state.title}</h1>
                <h2>{this.state.author} | {this.state.date}</h2>

                <h3>{this.state.firstParagraph}</h3>

                <Image src={this.state.imageDownloadURL} width="1150" height="750" />

                <h3>{this.state.article}</h3>
                <div>
                  {this.state.comments.map((comment) => {
                    return (
                      <div>
                        <h4>
                          {comment.email} says
                                            <span>
                            {comment.time}
                          </span>
                        </h4>
                        <p>
                          {comment.comment}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
              <Button
                color='black'
                content='Back'
                icon='angle left'
                onClick={() => this.props.history.goBack()}
              /></div>
          )} />
      )
    }

  }
}
export default withRouter(NewsDetail);