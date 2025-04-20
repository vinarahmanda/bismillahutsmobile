// app/projects/page.js
import Link from 'next/link';
import { projects } from '../../data/projects';  // Mengimpor data proyek

const ProjectsList = () => {
  // Pastikan ada data proyek yang valid
  if (!projects || projects.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-semibold mb-4">Projects</h1>
        <p>No projects available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project.slug} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{project.title}</h2>
            <p>{project.description}</p>
            {/* Pastikan bahwa slug yang digunakan di link valid */}
            <Link
              href={`/projects/${project.slug}`}
              className="text-blue-500 underline mt-2 inline-block"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsList;
