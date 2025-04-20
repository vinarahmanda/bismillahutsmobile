// app/projects/[slug]/page.js
"use client"; // Menambahkan deklarasi ini agar menjadi Client Component

import { useRouter } from 'next/router';  // Kembali menggunakan 'next/router'
import { projects } from '../../../data/projects';  // Mengimpor data proyek

const ProjectDetail = () => {
  const router = useRouter();
  const { slug } = router.query;  // Ambil slug dari query parameter

  const project = projects.find((project) => project.slug === slug);

  if (!project) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-semibold mb-4">Project Tidak Ditemukan</h1>
        <p>Proyek yang Anda cari tidak ada.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4">{project.title}</h1>
      <p>{project.longDesc}</p>
      <p><strong>Teknologi:</strong> {project.technologies.join(", ")}</p>
      <a href={project.liveUrl} className="text-blue-500 underline mt-2 inline-block">
        Lihat Proyek Secara Langsung
      </a>
    </div>
  );
};

export default ProjectDetail;
