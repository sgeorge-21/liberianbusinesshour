import { createFileRoute } from "@tanstack/react-router";
import html from "../pages-html/stories.html?raw";
import { PageHtml } from "../components/PageHtml";

export const Route = createFileRoute("/stories")({
  head: () => ({ meta: [{ title: "Stories — The Liberian Business Hour" }] }),
  component: () => <PageHtml html={html} />,
});
