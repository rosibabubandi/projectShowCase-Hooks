import './index.css'

const Projects = props => {
  const {projectDetails} = props
  const {name, imageUrl} = projectDetails

  return (
    <li className="each-project-container">
      <img src={imageUrl} className="project-image" alt={name} />
      <p className="project-name">{name}</p>
    </li>
  )
}

export default Projects
