/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only.  Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import AddCommentMutation from '../mutations/AddCommentMutation';
import RemoveCommentMutation from '../mutations/RemoveCommentMutation';
import LikeCommentMutation from '../mutations/LikeCommentMutation';

import React from 'react';
import Relay from 'react-relay';
import { Layout, Content, Grid, Cell, Card, CardTitle, CardText, FABButton, Icon, IconButton, Textfield  } from 'react-mdl';
import { Link } from 'react-router';

class PostPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: ''
    }
  }

  onCommentChange = (event) => {
    this.setState({comment: event.target.value});
  }

  commitComment = (event) => {
    event.preventDefault();
    const { posts } = this.props.viewer;
    const post = posts.edges[0].node;
    const { comment } = this.state;
    this.setState({comment: ''});
    this.props.relay.commitUpdate(
      new AddCommentMutation({text: comment, post})
    );
  }

  deleteComment = (event, id) => {
    event.preventDefault();
    const { posts } = this.props.viewer;
    const post = posts.edges[0].node;
    console.log({id, postId: post.id});
    this.props.relay.commitUpdate(
      new RemoveCommentMutation({id, postId: post.id})
    );
  }

  likeComment = (event, node) => {
    event.preventDefault();
    this.props.relay.commitUpdate(
      new LikeCommentMutation({comment: node})
    );
  }

  getCommentComponent = (node, i = 0) => {
    const { text, id, like } = node
    console.log(this.props.viewer);
    return (<div key={i}>
      <header className="comment__header">
        <img src="images/co1.jpg" className="comment__avatar" />
        <div className="comment__author">
          <strong>James Splayd</strong>
          <span>2 days ago</span>
        </div>
      </header>
      <div className="comment__text">
        {text}
      </div>
      <nav className="comment__actions">
        {like}<IconButton name="thumb_up" onClick={(event) => this.likeComment(event, node)}/>
        <IconButton name="thumb_down" />
        <IconButton name="share" />
        <IconButton name="edit" />
        <IconButton name="delete" onClick={(event) => this.deleteComment(event, id)}/>
      </nav>
    </div>);
  }

  render() {
    const { posts } = this.props.viewer;
    const post = posts.edges[0].node;
    const { newer, older, comments, title, className } = post;
    const { comment } = this.state;

    return (
      <div className="demo-blog--blogpost">
        <div className="demo-back">
          <IconButton name="arrow_back" href="#/" title="go back"/>
        </div>
        <Grid className="demo-blog__posts">
          <Card className={className} style={{width: '100%'}}>
            <CardTitle className={`mdl-card__${className==='amazing'?'title':'media'} mdl-color-text--grey-50`}>
              <h3 className={className==='amazing'?'quote':''}>{title}</h3>
            </CardTitle>
            <div className="mdl-color-text--grey-700 mdl-card__supporting-text meta">
              <div className="minilogo"></div>
              <div>
                <strong>The Newist</strong>
                <span>2 days ago</span>
              </div>
              <div className="section-spacer"></div>
              <div className="meta__favorites">
                425 <i className="material-icons" role="presentation">favorite</i>
                <span className="visuallyhidden">favorites</span>
              </div>
              <div>
                <i className="material-icons" role="presentation">bookmark</i>
                <span className="visuallyhidden">bookmark</span>
              </div>
              <div>
                <i className="material-icons" role="presentation">share</i>
                <span className="visuallyhidden">share</span>
              </div>
            </div>
            <div className="mdl-color-text--grey-700 mdl-card__supporting-text">
              <p>
                test
              </p>
            </div>
            <div className="mdl-color-text--primary-contrast mdl-card__supporting-text comments">
              <form>
                <Textfield
                    value={comment}
                    onChange={this.onCommentChange}
                    label="Join the discussion"
                    floatingLabel
                    rows={1}
                />
              <IconButton name="check" onClick={this.commitComment}/>
              </form>
              <div className="comment mdl-color-text--grey-700">
                <div className="comment__answers">
                  <div className="comment">
                    { comments.edges.length?comments.edges.map((cmt, i) => {
                      // const { text } = cmt.node;
                      return this.getCommentComponent(cmt.node, i);
                    }):'NO COMMENT'}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <nav className="demo-nav mdl-color-text--grey-50 mdl-cell mdl-cell--12-col">
            { newer && <a href={`#/post/${newer}`} className="demo-nav__button">
              <IconButton name="arrow_back" title="Newer"/>
              Newer
            </a>}

            <div className="section-spacer"></div>
              { older && <a href={`#/post/${older}`} className="demo-nav__button">
              Older
              <IconButton name="arrow_forward" title="Older"/>
              </a>}
          </nav>
        </Grid>
     </div>)
  }
}

export default Relay.createContainer(PostPage, {
  initialVariables: {
    id: null,
  },

  prepareVariables({id}) {
    return {
      id,
    };
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        posts(
          id: $id,
          first: 1
        ) {
          edges {
            node {
              id,
              className,
              title,
              text,
              newer,
              older,
              comments(
                postId: $id
                first: 100
              ) {
                edges {
                  node {
                    id,
                    text,
                    like
                  }
                }
              },
            }
          }
        }
      }
    `,
  },
});
