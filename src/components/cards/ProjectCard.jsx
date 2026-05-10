import { Link } from 'react-router-dom'
import Badge from '../common/Badge'
import Button from '../common/Button'
import { formatDate } from '../../utils/formatDate'

function ProjectCard({ project, isAdmin, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <Link
          to={`/projects/${project.id}`}
          className="text-base font-semibold text-gray-800 hover:text-blue-600 leading-snug"
        >
          {project.title}
        </Link>
        <div className="flex gap-1.5 flex-shrink-0">
          <Badge label={project.status} />
          <Badge label={project.priority} />
        </div>
      </div>

      {project.description && (
        <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
        {project.owner?.name && <span>Owner: {project.owner.name}</span>}
        {project.members?.length > 0 && (
          <span>
            {project.members.length} member{project.members.length !== 1 ? 's' : ''}
          </span>
        )}
        {project._count?.tasks !== undefined && (
          <span>
            {project._count.tasks} task{project._count.tasks !== 1 ? 's' : ''}
          </span>
        )}
        {project.dueDate && <span>Due {formatDate(project.dueDate)}</span>}
      </div>

      <div className="flex gap-2 pt-1">
        <Link to={`/projects/${project.id}`}>
          <Button variant="secondary" className="text-xs px-3 py-1.5">
            View
          </Button>
        </Link>
        {isAdmin && (
          <>
            <Link to={`/projects/${project.id}/edit`}>
              <Button variant="secondary" className="text-xs px-3 py-1.5">
                Edit
              </Button>
            </Link>
            <Button
              variant="danger"
              className="text-xs px-3 py-1.5 ml-auto"
              onClick={() => onDelete(project)}
            >
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export default ProjectCard
