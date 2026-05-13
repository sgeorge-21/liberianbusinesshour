import { createFileRoute } from "@tanstack/react-router";
import html from "../pages-html/podcast.html?raw";
import { PageHtml } from "../components/PageHtml";

export const Route = createFileRoute("/podcast")({
  head: () => ({ meta: [{ title: "Podcast — The Liberian Business Hour" }] }),
  component: () => <PageHtml html={html} />,
});
