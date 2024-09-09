import PortableText from "./portable-text";
import * as demo from "@/sanity/lib/demo";

function Intro(props: { title: string | null | undefined; description: any }) {
  const title = props.title || demo.title;
  const description = props.description?.length
    ? props.description
    : demo.description;
  return (
    <section>
      <h1>
        {title || demo.title}
      </h1>
      <h2>
        <PortableText
          value={description?.length ? description : demo.description}
        />
      </h2>
    </section>
  );
}

export default async function Page() {
  return <></>;
}
