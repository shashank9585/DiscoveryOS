'use client';

import { Plus, MoreVertical, Calendar, FileText } from 'lucide-react';
import { useState } from 'react';

export default function ProjectsPage() {
  const [projects] = useState([
    {
      id: '1',
      name: 'Product A - Q1 2024',
      description: 'Customer feedback analysis for Q1 roadmap planning',
      createdAt: '2 weeks ago',
      filesCount: 12,
      insightsCount: 34,
      health: 68,
    },
    {
      id: '2',
      name: 'Mobile Redesign Project',
      description: 'User research for mobile app redesign initiative',
      createdAt: '1 month ago',
      filesCount: 8,
      insightsCount: 22,
      health: 72,
    },
    {
      id: '3',
      name: 'Enterprise Features',
      description: 'Feedback from enterprise beta customers',
      createdAt: '2 months ago',
      filesCount: 15,
      insightsCount: 45,
      health: 65,
    },
  ]);

  return (
    <main className="flex-1 overflow-auto bg-background">
      <div className="p-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Projects</h1>
            <p className="text-muted-foreground">Organize and manage your research projects</p>
          </div>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-card border rounded-lg p-6 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg flex-1">{project.name}</h3>
                <button className="p-1 hover:bg-muted rounded">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-4">{project.description}</p>

              <div className="space-y-3 mb-6 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    Created {project.createdAt}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    {project.filesCount} files
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mb-4 pb-4 border-b">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Insights</p>
                  <p className="text-lg font-bold">{project.insightsCount}</p>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Health Score</p>
                  <p className="text-lg font-bold">{project.health}</p>
                </div>
              </div>

              <button className="w-full px-4 py-2 border rounded-lg hover:bg-muted transition">
                Open Project
              </button>
            </div>
          ))}

          {/* New Project Card */}
          <div className="bg-card border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted transition cursor-pointer">
            <Plus className="w-8 h-8 mb-2 text-muted-foreground" />
            <p className="font-semibold">Create New Project</p>
            <p className="text-sm text-muted-foreground mt-1">Start analyzing customer feedback</p>
          </div>
        </div>
      </div>
    </main>
  );
}


