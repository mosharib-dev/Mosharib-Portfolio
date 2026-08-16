import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    stack: [{ type: String }],
    highlights: [{ type: String }],
    caseStudy: {
      problem: String,
      approach: String,
      tradeoffs: String,
      result: String,
    },
    liveUrl: String,
    githubUrl: String,
    repoName: String, // exact GitHub repo name, for matching against the live API when it differs from slug
    image: String, // optional explicit screenshot URL/path — overrides auto-generated preview
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ["live", "in-progress", "archived"], default: "live" },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);