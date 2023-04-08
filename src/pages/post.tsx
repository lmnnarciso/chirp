import { api } from "~/utils/api";

function Post() {
  const { data: posts, refetch } = api.post.getPost.useQuery();
  const createPost = api.post.createPost.useMutation({
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

    await createPost.mutateAsync({ content: form.get("content") as string });

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
        {createPost.isLoading && "Loading ..."}
      </ul>
    </div>
  );
}

export default Post;
