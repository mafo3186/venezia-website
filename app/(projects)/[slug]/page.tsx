import ProjectPage, { Props } from "@/components/projectPage/projectPage";
import Link from "next/link";
export {
  generateMetadata,
  generateStaticParams,
} from "@/components/projectPage/projectPage";

export default async function ProjectPage3D({ params }: Props) {
  return (
      <ProjectPage params={params} />
  )
}
