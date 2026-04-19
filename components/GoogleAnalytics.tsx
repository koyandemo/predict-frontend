"use client";

const isBrowser = typeof document !== "undefined";

type Props = {
  id: string;
};

export function GoogleAnalysis({ id }: Props) {
  if (!isBrowser) return null;

  return (
    <>
      {/* Load script */}
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${id}`} />

      {/* Init  */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${id}');
          `,
        }}
      />
    </>
  );
}
