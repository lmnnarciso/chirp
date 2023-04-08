import { api } from "~/utils/api";

function Post() {
  const { data: posts, refetch } = api.post.getPost.useQuery();
  const createPostTransaction = api.post.createPostTransaction.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const deletePost = api.post.deletePost.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formInput = e.target as HTMLFormElement;
    const form = new FormData(formInput);

    await createPostTransaction.mutateAsync({
      content: form.get("content") as string,
    });

    formInput.reset();
  };

  const handleDelete = async (id: string) => {
    await deletePost.mutateAsync({
      id: id,
    });
  };

  console.log({ deletePost });

  return (
    <div>
      <h1>CRUD - NO update</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="content">Content: </label>
          <input name="content" type="text" />
        </form>
      </div>
      <ul>
        {posts?.map((post) => (
          <li key={post.id}>
            {post.content}{" "}
            <button
              className="text-red-700"
              onClick={() => {
                handleDelete(post.id);
              }}
            >
              delete{" "}
            </button>
            {deletePost?.variables?.id === post.id &&
              deletePost.isLoading &&
              "Loading ..."}
          </li>
        ))}
        {createPostTransaction.isLoading && "Loading ..."}
      </ul>
    </div>
  );
}

export default Post;
