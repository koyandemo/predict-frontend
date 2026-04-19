import Script from "next/script";

type Props = {
  id:string;
}

const GoogleAnalytics = ({id}:Props) => {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga-script" strategy="afterInteractive">
        {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', '${id}');
  `}
      </Script>
    </>
  );
};

export default GoogleAnalytics;
