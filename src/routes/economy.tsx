import { createFileRoute } from "@tanstack/react-router";
import html from "../pages-html/economy.html?raw";
import { PageHtml } from "../components/PageHtml";

export const Route = createFileRoute("/economy")({
  head: () => ({ meta: [{ title: "Economy — The Liberian Business Hour" }] }),
  component: () => <PageHtml html={html} />,
});
