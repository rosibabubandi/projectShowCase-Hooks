import {useState, useEffect} from 'react'
import Loader from 'react-loader-spinner'

import Projects from '../Projects'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const ProjectShowCase = () => {
  const [projectsApiStatus, setProjectsApiStatus] = useState(
    apiStatusConstants.initial,
  )
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [projectsData, setProjectsData] = useState([])

  const getProjectsData = async () => {
    setProjectsApiStatus(apiStatusConstants.inProgress)

    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeCategory}`
    const options = {
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    const responseData = await response.json()

    if (response.ok) {
      const fetchedProjectsData = responseData.projects.map(eachProject => ({
        id: eachProject.id,
        name: eachProject.name,
        imageUrl: eachProject.image_url,
      }))
      setProjectsData(fetchedProjectsData)
      setProjectsApiStatus(apiStatusConstants.success)
    } else {
      setProjectsApiStatus(apiStatusConstants.failure)
    }
  }
  useEffect(() => {
    getProjectsData()
  }, [activeCategory])

  const onClickRetryData = () => {
    getProjectsData()
  }

  const getProjectsLoadingView = () => (
    <div className="loading-container" data-testid="loader">
      <Loader type="TailSpin" color="#00BFFF" height={50} width={50} />
    </div>
  )

  const getProjectsSuccessView = () => (
    <ul className="projects-container">
      {projectsData.map(eachProject => (
        <Projects key={eachProject.id} projectDetails={eachProject} />
      ))}
    </ul>
  )

  const getProjectsFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        className="failure-image"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-button" onClick={onClickRetryData}>
        Retry
      </button>
    </div>
  )

  const getAllProjectViews = () => {
    switch (projectsApiStatus) {
      case apiStatusConstants.inProgress:
        return getProjectsLoadingView()
      case apiStatusConstants.success:
        return getProjectsSuccessView()
      case apiStatusConstants.failure:
        return getProjectsFailureView()
      default:
        return null
    }
  }
  return (
    <>
      <div className="header-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
          className="website-logo"
          alt="website logo"
        />
      </div>
      <div className="main-container">
        <select
          value={activeCategory}
          onChange={event => setActiveCategory(event.target.value)}
          className="select-element"
        >
          {categoriesList.map(eachCategory => (
            <option
              key={eachCategory.id}
              className="option-element"
              value={eachCategory.id}
            >
              {eachCategory.displayText}
            </option>
          ))}
        </select>
        {getAllProjectViews()}
      </div>
    </>
  )
}

export default ProjectShowCase
