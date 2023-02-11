import Head from "next/head";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>404</title>
        <meta property="og:title" content="404" />
        <meta name="description" content="Nothing to see here" />
        <meta property="og:description" content="Nothing to see here" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:type" content="website" />
        <link rel="shortcut icon" href="/q.ico" />
        <meta property="og:image" content="/fUudAEr.png" />
        <meta property="og:url" content="https://iq-island.vercel.app/" />
      </Head>

      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-center text-5xl font-bold">
          404
          <br />
          <span className="text-3xl font-normal">Nothing to see here</span>
        </h1>
      </div>
    </>
  );
}
