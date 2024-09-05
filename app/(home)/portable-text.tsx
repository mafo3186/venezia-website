/**
 * This component uses Portable Text to render a post body.
 *
 * You can learn more about Portable Text on:
 * https://www.sanity.io/docs/block-content
 * https://github.com/portabletext/react-portabletext
 * https://portabletext.org/
 *
 */

import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from "next-sanity";
import Image from "next/image";
import { urlFor } from '@/sanity/lib/image'



export default function CustomPortableText({
  className,
  value,
}: {
  className?: string;
  value: PortableTextBlock[];
}) {
  const components: PortableTextComponents = {
    block: {
      h5: ({ children }) => (
        <h5 className="mb-2 text-sm font-semibold">{children}</h5>
      ),
      h6: ({ children }) => (
        <h6 className="mb-1 text-xs font-semibold">{children}</h6>
      ),
    },
    marks: {
      link: ({ children, value }) => {
        return (
          <a href={value?.href} rel="noreferrer noopener">
            {children}
          </a>
        );
      },
    },
    types: {
      // https://www.sanity.io/docs/presenting-images
      // eslint-disable-next-line @next/next/no-img-element
      image: ({ value }) => <img src={urlFor(value).width(500).url()} alt="" />,
      // file: ({ value }) => <a href={value.asset.url}>{value.asset.originalFilename}</a>,
    }
  };

  return (
    <div className={["prose", className].filter(Boolean).join(" ")}>
      <PortableText components={components} value={value} />
    </div>
  );
}
