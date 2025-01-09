import { correlation } from "@/server/functions/job/query";

import JobCorrelationList from "./job-correlation-list";

export default async function JobCorrelationServerList({
  id,
  fullTags,
}: {
  id: string;
  fullTags: string[];
}) {
  const correlationList = await correlation(fullTags, [id]);

  if (correlationList.length === 0) {
    return null;
  }

  return <JobCorrelationList list={correlationList} />;
}
