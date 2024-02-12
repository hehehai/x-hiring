import { type Job, type JobTag } from "@prisma/client";

export interface JobTagsRelations {
  jobTagId: string;
  jobId: string;
  assignedAt: Date;
  jobTag: JobTag;
}

export type JobItemHasTags = Job & { tags: JobTagsRelations[] };
