import { Segment, useDefault } from "segmentit";

const segmentit = useDefault(new Segment());

export default function segmentWord(val: string) {
  if (!val?.length) {
    return [];
  }
  return segmentit.doSegment(val, {
    simple: true,
    stripPunctuation: true,
    stripStopword: true,
  });
}
