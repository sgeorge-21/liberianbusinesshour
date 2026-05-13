import { createFileRoute } from "@tanstack/react-router";
import html from "../pages-html/home.html?raw";
import { PageHtml } from "../components/PageHtml";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "The Liberian Business Hour" }] }),
  component: () => <PageHtml html={html} />,
});
