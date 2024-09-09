import PortableText from "./portable-text";
import type { ProjectsQueryResult, SettingsQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";

function Intro(props: { title: string | null | undefined; description: any }) {
  const title = props.title!;
  const description = props.description!;
  return (
    <section>
      <h1>
        {title!}
      </h1>
      <h2>
        <PortableText
          value={description}
        />
      </h2>
    </section>
  );
}

export default async function Page() {
  return <></>;
}
