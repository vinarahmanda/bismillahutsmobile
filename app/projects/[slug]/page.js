// app/projects/[slug]/page.js
import { useRouter } from 'next/router';
import { projects } from '../../../data/projects';  // Mengimpor data proyek

const ProjectDetail = () => {
  const router = useRouter();
  const { slug } = router.query;  // Mengambil slug dari URL

  // Mencari proyek berdasarkan slug
  const project = projects.find(proj => proj.slug === slug);

  if (!project) {
    return <div>Project not found!</div>; // Jika proyek tidak ditemukan
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold">{project.title}</h1>
      <p className="text-gray-500">{project.year}</p>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Description</h2>
        <p>{project.longDesc}</p>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Technologies Used</h2>
        <ul className="list-disc pl-5">
          {project.technologies.map((tech, index) => (
            <li key={index}>{tech}</li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <a href={project.liveUrl} className="text-blue-500 underline">
          View Live Project
        </a>
      </div>
    </div>
  );
};

export default ProjectDetail;
