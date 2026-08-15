import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";
import Loader from "../components/Loader";
import client from "../api/client";

export default function Blog() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    client.get("/blog").then((res) => setPosts(res.data)).catch(() => setPosts([]));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <SectionHeading index="06" label="Notes" title="Blog" sub="Build notes and write-ups from real projects." />

      {!posts ? (
        <Loader label="Loading posts" />
      ) : posts.length === 0 ? (
        <p className="readout">No posts yet — run the backend seed script, or POST to /api/blog.</p>
      ) : (
        <div className="divide-y divide-line border-t border-line">
          {posts.map((p) => (
            <Link key={p.slug} to={`/blog/${p.slug}`} className="block py-6 group">
              <p className="readout">{new Date(p.publishedAt).toLocaleDateString()}</p>
              <h3 className="mt-1 font-display text-xl font-semibold text-ink group-hover:text-signal">
                {p.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{p.excerpt}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
