import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import client from "../api/client";
import Loader from "../components/Loader";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setPost(null);
    setError(false);
    client.get(`/blog/${slug}`).then((res) => setPost(res.data)).catch(() => setError(true));
  }, [slug]);

  if (error)
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-2xl text-ink">Post not found</h1>
        <Link to="/blog" className="mt-6 inline-block font-mono text-sm text-signal hover:underline">
          ← Back to blog
        </Link>
      </div>
    );

  if (!post) return <div className="mx-auto max-w-3xl px-6 py-24"><Loader label="Loading post" /></div>;

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <Link to="/blog" className="font-mono text-xs uppercase tracking-wider text-muted hover:text-signal">
        ← All posts
      </Link>
      <p className="eyebrow mt-6">{new Date(post.publishedAt).toLocaleDateString()}</p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-ink">{post.title}</h1>
      <div className="mt-8 whitespace-pre-line leading-relaxed text-ink/90">{post.content}</div>
    </article>
  );
}
