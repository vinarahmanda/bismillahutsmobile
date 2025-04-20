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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.slug} className="border p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
            <p className="text-gray-600 mb-4">{project.description}</p>
            {/* Pastikan bahwa slug yang digunakan di link valid */}
            <Link
              href={`/projects/${project.slug}`}
              className="text-blue-500 underline hover:text-blue-700"
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