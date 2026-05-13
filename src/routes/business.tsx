import { createFileRoute } from "@tanstack/react-router";
import html from "../pages-html/business.html?raw";
import { PageHtml } from "../components/PageHtml";

export const Route = createFileRoute("/business")({
  head: () => ({ meta: [{ title: "Business — The Liberian Business Hour" }] }),
  component: () => <PageHtml html={html} />,
});
