import { createFileRoute } from "@tanstack/react-router";
import html from "../pages-html/finance.html?raw";
import { PageHtml } from "../components/PageHtml";

export const Route = createFileRoute("/finance")({
  head: () => ({ meta: [{ title: "Finance — The Liberian Business Hour" }] }),
  component: () => <PageHtml html={html} />,
});
