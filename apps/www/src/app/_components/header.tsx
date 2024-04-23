import { Logo } from "@/components/shared/logo";

const HeaderLink = ({
  link,
  children,
}: {
  link: string;
  children: React.ReactNode;
}) => {
  return (
    <a
      className="hover:underline-offset-6 mx-1 inline-flex items-center underline underline-offset-4 transition-all"
      href={link}
      target="_blank"
    >
      {children}
    </a>
  );
};

export const Header = () => {
  return (
    <header className="px-4 pt-6 md:px-8 md:pt-10">
      <div className="mb-3 text-3xl font-semibold md:mb-6 md:text-5xl">
        <Logo />
      </div>
      <ul className="min-h-24 space-y-1 rounded-xl bg-orange-500 p-4 text-white md:w-5/6">
        <li>
          🥳 本网站数据来源于
          <HeaderLink link="https://www.v2ex.com/go/jobs">V2EX</HeaderLink>和
          <HeaderLink link="https://eleduck.com">电鸭社区</HeaderLink>以及
          <HeaderLink link="https://github.com/ruanyf/weekly/issues?q=%E8%B0%81%E5%9C%A8%E6%8B%9B%E4%BA%BA">谁在招人</HeaderLink>，
          对招聘信息使用
          <HeaderLink link="https://makersuite.google.com/?hl=zh-cn">
            Google Gemini
          </HeaderLink>
          做摘要处理。
        </li>
        <li>
          🚨 如有不实信息，请
          <HeaderLink link="mailto:riverhohai@gmail.com">联系我</HeaderLink>。
        </li>
        <li>
          🤗 网站代码已开源
          <HeaderLink link="https://github.com/hehehai/x-hiring">
            Github
          </HeaderLink>
          。
        </li>
      </ul>
    </header>
  );
};
