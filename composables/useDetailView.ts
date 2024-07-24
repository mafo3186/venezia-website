export const useDetailView = () => {
  const detailView = useState("detailView", () => false);
  const currentProject = useState("currentDetail", (): any => undefined);
  const currentDotIndex = useState("currentDotIndex", (): number => 0);

  async function fetchProjectByID(id: string) {
    // currentProject.value = await $fetch("/api/project/" + id);
    // console.log(currentProject.value);
  }

  function setCurrentProject(project: any) {
    currentProject.value = project;
  }

  return {
    detailView,
    currentProject,
    currentDotIndex,
    fetchProjectByID,
    setCurrentProject,
  };
};
