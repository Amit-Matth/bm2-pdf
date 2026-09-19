import type { ReactNode } from "react";
import RevealBlock from "./reveal-block";
import SiteHeader from "./site-header";
import SiteFooter from "./site-footer";

type ContentPageProps = {
  title: string;
  intro: string;
  children: ReactNode;
  sidebar?: ReactNode;
  pageClassName?: string;
};

export default function ContentPage({ title, intro, children, sidebar, pageClassName = "" }: ContentPageProps) {
  return (
    <div className={`site-shell ${pageClassName}`}>
      <SiteHeader />
      <main className="inner-page">
        <RevealBlock direction="bottom">
          <div className="inner-page-heading">
            <p className="eyebrow">pdfDuniya / information</p>
            <h1>{title}</h1>
            <p>{intro}</p>
            {sidebar && (
              <div style={{ marginTop: '40px' }}>
                {sidebar}
              </div>
            )}
          </div>
        </RevealBlock>
        <RevealBlock direction="bottom" delay={120}>
          <article className="legal-copy">{children}</article>
        </RevealBlock>
      </main>
      <SiteFooter />
    </div>
  );
}
