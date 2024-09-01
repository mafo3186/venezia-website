/* eslint-disable @next/next/no-img-element */
/// Reference: https://www.apache.org/icons/
export default function ListProjectsPage() {
  const projects = [
    {
      name: "ASDF",
      lastModified: "yesterday",
      size: "2kb",
      description: "N/A",
    },
    {
      name: "DFGH",
      lastModified: "2023-04-01 20:13",
      size: "10kb",
      description: "N/A",
    },
  ];

  return (
    <>
      <h1>Index of /~venice/projects</h1>

      <table>
        <thead>
          <tr>
            <th></th> {/* Icon */}
            <th>Name</th>
            <th>Last modified</th>
            <th>Size</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td valign="top">
              <img src="https://www.apache.org/icons/back.png" />
            </td>
            <td>
              <a href="/">Parent Directory</a>
            </td>
          </tr>
          {projects.map((project) => {
            return (
              <tr key={project.name}>
                <td valign="top">
                  <img src="https://www.apache.org/icons/image2.gif" />
                </td>
                <td>{project.name}</td>
                <td align="right">{project.lastModified}</td>
                <td align="right">{project.size}</td>
                <td>{project.description}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
