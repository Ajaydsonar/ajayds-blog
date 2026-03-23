import { createFileRoute } from "@tanstack/react-router";
import { HeroBanner } from "#/components/sections/HeroBanner";

export const Route = createFileRoute("/services/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Services</div>;
}
