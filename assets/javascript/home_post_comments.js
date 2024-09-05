// Let's implement this via classes

// this class would be initialized for every post on the page
// 1. When the page loads
// 2. Creation of every post dynamically via AJAX
class PostComments {
    // constructor is used to initialize the instance of the class whenever a new instance is created
    constructor(postId) {
        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.newCommentForm = $(`#post-${postId}-comment-form`);

        this.createComment(postId);

        let self = this;
        // call for all the existing comments
        $(' .delete-comment-button', this.postContainer).each(function () {
            self.deleteComment($(this));
        });
    }


    createComment(postId) {
        let pSelf = this;
        this.newCommentForm.submit(function (e) {
            e.preventDefault();
            let self = this;

            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: $(self).serialize(),
                success: function (data) {
                    let newComment = pSelf.newCommentDom(data.data.comment);
                    $(`#post-comments-${postId}`).prepend(newComment);
                    pSelf.deleteComment($(' .delete-comment-button', newComment));

                    // CHANGE :: enable the functionality of the toggle like button on the new comment
                    new ToggleLike($(' .toggle-like-button', newComment));
                    new Noty({
                        theme: 'relax',
                        text: "Comment published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500

                    }).show();

                }, error: function (error) {
                    console.log(error.responseText);
                }
            });


        });
    }


    newCommentDom(comment) {
        // I've added a class 'delete-comment-button' to the delete comment link and also id to the comment's li
        return $(`<li id="comment-${comment._id}">
        <div class="comment-content">
     
          <a class="delete-comment-button" href="/comments/destroy/${comment._id}">
            <i class="fa-solid fa-trash-can fa-lg"></i>
          </a>
          <div class="post-img-vau"> 
                 <a href="/users/profile/${comment.user._id}">
                 ${comment.user.avatar ? `<img src="${comment.user.avatar}" alt="${comment.user.name}">` : ` <img
            class="rounded-circle"
            id="user-dp"
            src="https://images.assetsdelivery.com/compings_v2/tanyastock/tanyastock1608/tanyastock160801788.jpg"
            alt="${ comment.user.name }"
            />`}
                 </a>
          </div>
                <a href="/users/profile/${comment.user._id}">
          <small class="comment-name"> ${comment.user.name} </small>

                 </a>
          <div class="main-comment-content">${comment.content}</div>
          <br />

          <small>
            <a
              class="toggle-like-button"
              data-likes="${comment.likes.length}"
              href="/likes/toggle/?id=${comment._id}&type=Comment"
            >
              <i class="fa-regular white fa-heart fa-lg">  ${comment.likes.length} </i>
            </a>
       
          </small>
        </div>
      </li>
      `);
    }


    deleteComment(deleteLink) {
        $(deleteLink).click(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function (data) {
                    $(`#comment-${data.data.comment_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Comment Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500

                    }).show();
                }, error: function (error) {
                    console.log(error.responseText);
                }
            });

        });
    }
}