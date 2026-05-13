import { createFileRoute } from "@tanstack/react-router";
import html from "../pages-html/admin.html?raw";
import { PageHtml } from "../components/PageHtml";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — The Liberian Business Hour" }] }),
  component: () => <PageHtml html={html} />,
});
