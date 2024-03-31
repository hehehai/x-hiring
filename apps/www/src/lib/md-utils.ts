import showdown from "showdown";

const converter = new showdown.Converter();

export function mdToHtml(content: string) {
  return converter.makeHtml(content);
}
