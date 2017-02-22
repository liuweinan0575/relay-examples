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

import Relay from 'react-relay';

export default class LikeCommentMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation{likeComment}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on LikeCommentPayload @relay(pattern: true) {
        comment {
          id,
          text,
          like,
        },
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        comment: this.props.comment.id,
      },
    }];
  }
  getVariables() {
    return {
      id: this.props.comment.id,
    };
  }
  getOptimisticResponse() {
    const { id, text, like } = this.props.comment;
    return {
      comment: {
        id,
        text,
        like: like+1,
      }
    };
  }
}
