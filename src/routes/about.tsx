import { createFileRoute } from "@tanstack/react-router";
import html from "../pages-html/about.html?raw";
import { PageHtml } from "../components/PageHtml";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — The Liberian Business Hour" }] }),
  component: () => <PageHtml html={html} />,
});
