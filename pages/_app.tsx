import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'
import ChatWidget from '../components/ChatWidget'
import { SUPPORT } from '../lib/support.config'

export default function App({ Component, pageProps }: AppProps) {
  return       <><Head>
        <meta property="og:type" content="website" />
        <meta property="og:title" content="ColdMail AI" />
        <meta property="og:description" content="AI-generated, research-backed cold emails for founders and freelancers reaching out to prospects on LinkedIn, X, or email." />
        <meta property="og:url" content="https://coldmail-ai.lxsaihub.com/" />
        <meta property="og:image" content="https://coldmail-ai.lxsaihub.com/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ColdMail AI" />
        <meta name="twitter:description" content="AI-generated, research-backed cold emails for founders and freelancers reaching out to prospects on LinkedIn, X, or email." />
        <meta name="twitter:image" content="https://coldmail-ai.lxsaihub.com/og.png" />
                                        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: '{"@context":"https://schema.org","@type":"SoftwareApplication","name":"ColdMail AI","url":"https://coldmail-ai.lxsaihub.com/","description":"AI-generated, research-backed cold emails for founders and freelancers reaching out to prospects on LinkedIn, X, or email.","applicationCategory":"BusinessApplication","operatingSystem":"Web","offers":{"@type":"Offer","priceCurrency":"USD","price":"0","availability":"https://schema.org/OnlineOnly"}}' }} />
      </Head>
      <Component {...pageProps} />
      <ChatWidget productName={SUPPORT.productName} brandColor={SUPPORT.brandColor} sessionKeyPrefix={SUPPORT.productSlug} /></>
}
