import ProjectPage, { Props } from "@/components/projectPage/projectPage";
export {
  generateMetadata,
  generateStaticParams,
} from "@/components/projectPage/projectPage";

export default async function ListPage({ params }: Props) {
  return <ProjectPage params={params} />;
}
