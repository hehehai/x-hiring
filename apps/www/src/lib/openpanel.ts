import {
	type PostEventPayload,
	trackEvent as openpanelTrackEvent,
} from "@openpanel/nextjs";

export const trackEvent = (
	name: string,
	data?: PostEventPayload["properties"],
) => {
	if (window === undefined) return;
	if (typeof window.op === "undefined") return;
	return openpanelTrackEvent(name, data);
};
