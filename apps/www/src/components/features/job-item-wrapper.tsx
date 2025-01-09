"use client";

import { useAtom } from "jotai";

import { activeAtom } from "@/app/_store/job-view.store";
import { trackEvent } from "@/lib/openpanel";

interface JobItemWrapperProps extends React.ComponentPropsWithoutRef<"div"> {
	id: string;
}

export const JobItemWrapper = ({
	id,
	children,
	...props
}: JobItemWrapperProps) => {
	const [active, setActive] = useAtom(activeAtom);

	return (
		<div
			{...props}
			onClick={() => {
				if (active !== id) {
					setActive(id);
					trackEvent("job_click", { id });
				}
			}}
		>
			{children}
		</div>
	);
};
