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
    <header className="container pt-20">
      <div className="mb-12 text-6xl font-semibold">X-Hiring</div>
      <ul className="min-h-24 w-4/6 space-y-1 rounded-xl bg-orange-500 p-4 text-white">
        <li>
          🥳 本网站数据来源于
          <HeaderLink link="https://www.v2ex.com/go/jobs">V2EX</HeaderLink>和
          <HeaderLink link="https://eleduck.com">电鸭社区</HeaderLink>，
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
          🥸 网站代码已开源
          <HeaderLink link="https://github.com/hehehai/x-hiring">
            Github
          </HeaderLink>
          。
        </li>
      </ul>
    </header>
  );
};
