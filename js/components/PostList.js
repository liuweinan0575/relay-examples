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

import React from 'react';
import Relay from 'react-relay';
import { Layout, Content, Grid, Cell, Card, CardTitle, CardText, FABButton, Icon } from 'react-mdl';
import { Link } from 'react-router';

class PostList extends React.Component {

  getHeader() {
    const { posts } = this.props.viewer;
    return [<Cell col={8} key={0}>
      <Card className="coffee-pic" style={{width: '100%'}}>
        <div className="mdl-card__media mdl-color-text--grey-50" >
          <h3><a href="entry.html">Coffee Pic</a></h3>
        </div>
        <div className="mdl-card__supporting-text meta mdl-color-text--grey-600">
          <div className="minilogo"></div>
          <div>
            <strong>The Newist</strong>
            <span>2 days ago</span>
          </div>
        </div>
      </Card>
    </Cell>,
    <Cell col={4} key={1}>
      <Card className="something-else" style={{width: '100%'}}>
        <FABButton colored ripple>
          <Icon name="add" />
        </FABButton>

          <div className="mdl-card__media mdl-color--white mdl-color-text--grey-600">
            <img src="images/logo.png" />
            +1,337
          </div>
          <div className="mdl-card__supporting-text meta meta--fill mdl-color-text--grey-600">
            <div>
              <strong>The Newist</strong>
            </div>
            <ul className="mdl-menu mdl-js-menu mdl-menu--bottom-right mdl-js-ripple-effect" htmlFor="menubtn">
              <li className="mdl-menu__item">About</li>
              <li className="mdl-menu__item">Message</li>
              <li className="mdl-menu__item">Favorite</li>
              <li className="mdl-menu__item">Search</li>
            </ul>
            <button id="menubtn" className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon">
              <i className="material-icons" role="presentation">more_vert</i>
              <span className="visuallyhidden">show menu</span>
            </button>
          </div>
      </Card>
    </Cell>]
  }

  renderPosts() {
    return this.props.viewer.posts.edges.map((post, i) =>
      {
        const { className, title, text, id } = post.node;
        console.log(id);
        return <Cell col={12} key={i}>
          <Card className={className} style={{width: '100%'}}>
            <CardTitle className={`mdl-card__${className==='amazing'?'title':'media'} mdl-color-text--grey-50`}>
              <h3 className={className==='amazing'?'quote':''}><Link to={`post/${id}`}>{title}</Link></h3>
            </CardTitle>
            <CardText>
                {text}
            </CardText>
            <div className="mdl-card__supporting-text meta mdl-color-text--grey-600">
              <div className="minilogo"></div>
              <div>
                <strong>The Newist</strong>
                <span>2 days ago</span>
              </div>
            </div>
          </Card>
          </Cell>
      }
    );
  }

  render() {

    return (
      <Grid className="demo-blog__posts">
        {this.getHeader()}
        {this.renderPosts()}
     </Grid>)
  }
}

export default Relay.createContainer(PostList, {

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        posts(
          id: "",
          first: 2147483647  # max GraphQLInt
        ) {
          edges {
            node {
              id,
              className,
              title,
              text,
            }
          }
        }
      },

    `,
  },
});
