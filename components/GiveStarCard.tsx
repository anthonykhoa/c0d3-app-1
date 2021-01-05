import React, { useState } from 'react'
import { User, useSetStarMutation } from '../graphql/index'
import withQueryLoader, { QueryDataProps } from '../containers/withQueryLoader'
import { Button } from '../components/theme/Button'
import GET_LESSON_MENTORS from '../graphql/queries/getLessonMentors'
import '../scss/giveStarCard.scss'
import { ModalCard, ModalCardProps } from './ModalCard'
import { Thanks } from './Thanks'

interface Mentor {
  username: string
  mentorId: number
}

type MentorCardProps = {
  setMentor: React.Dispatch<React.SetStateAction<Partial<Mentor>>>
  name: string
} & Mentor

const MentorCard: React.FC<MentorCardProps> = ({
  username,
  name,
  mentorId,
  setMentor
}) => (
  <div
    className="mb-3 rounded-lg d-flex justify-content-center align-items-center flex-column mentor position-relative"
    onClick={() => setMentor({ username, mentorId })}
  >
    <div className="text-white position-absolute mentor sendStar align-items-center justify-content-center">
      <h5 className="mt-0 mb-0">Send Star</h5>
    </div>
    <h6 className="mb-0 mt-0 font-weight-light">{name}</h6>
    <span className="text-muted font-weight-light mt-0 mb-0">@{username}</span>
  </div>
)

type SearchMentorProps = {
  setMentor: React.Dispatch<React.SetStateAction<Partial<Mentor>>>
  mentors: User[]
}

const SearchMentor: React.FC<SearchMentorProps> = ({ setMentor, mentors }) => {
  const [search, setSearch] = useState<string>('')

  const searchTerm = search.toLowerCase()
  const includes = (str: string) => str.toLowerCase().includes(searchTerm)
  const filteredList = mentors.filter(({ username, name }) => {
    return includes(username as string) || includes(name as string)
  })

  const mentorsList = filteredList.map(({ username, name, id }, key) => (
    <MentorCard
      key={key}
      username={username as string}
      name={name as string}
      mentorId={parseInt(id as string)}
      setMentor={setMentor}
    />
  ))

  return (
    <>
      <div className="d-flex flex-column pt-2 pt-4 pl-5 pr-5 pb-4">
        <h4 className="font-weight-bold mt-2 mb-4 pt-2 pb-1">
          Who helped you the most?
        </h4>
        <input
          data-testid="giveStarInput"
          onChange={e => setSearch(e.target.value)}
          className="form-control-lg form-control font-weight-light h6"
        />
      </div>
      <div className="pt-4 mentorsList pb-3 mb-1">
        <div className="row mr-5 ml-5 mt-1 d-flex flex-wrap justify-content-between">
          {mentorsList}
        </div>
      </div>
    </>
  )
}

type GiveStarProps = {
  lessonId: number
  setMentor: React.Dispatch<React.SetStateAction<Partial<Mentor>>>
  setDone: React.Dispatch<React.SetStateAction<string>>
} & Mentor

const GiveStar: React.FC<GiveStarProps> = ({
  username,
  mentorId,
  lessonId,
  setMentor,
  setDone
}) => {
  const [comment, setComment] = useState('')
  const [setStar, { error }] = useSetStarMutation()

  const giveStar = async () => {
    try {
      await setStar({ variables: { mentorId, lessonId, comment } })
      setDone(username)
    } catch {}
  }

  if (error) {
    return (
      <div className="mb-0 mt-0 p-4 text-center">
        <h4 className="mt-0 mb-0">Error sending star, please try again</h4>
      </div>
    )
  }

  return (
    <>
      <div className="position-absolute left-0">
        <img
          data-testid="backButton"
          className=".img-fluid btn"
          src="/curriculumAssets/icons/left-arrow.svg"
          onClick={() => setMentor({})}
        />
      </div>
      <div className="d-flex justify-content-center align-items-center flex-column modal-height-med">
        <h3 className="mb-3 text-break mt-5 pt-3 text-center">
          You are giving a Star to
          <span className="font-italic"> {username}!</span>
        </h3>
        <textarea
          placeholder="Give a comment along with your Star!"
          className=" mb-4 border-bottom form-control h-100 w-75"
          onChange={e => setComment(e.target.value)}
        />
        <div className="mb-5">
          <Button type="primary" color="white" onClick={giveStar}>
            Give Star!
          </Button>
        </div>
      </div>
    </>
  )
}

type LessonMentorsData = { getLessonMentors: User[] }
type StarCardProps = {
  handleClose: Function
  lessonId: number
  done: string
  setDone: React.Dispatch<React.SetStateAction<string>>
} & QueryDataProps<LessonMentorsData>

const StarCard: React.FC<StarCardProps> = ({
  handleClose,
  lessonId,
  done,
  setDone,
  queryData: { getLessonMentors: mentors }
}) => {
  const [{ mentorId, username }, setMentor] = useState<Partial<Mentor>>({})

  if (done) {
    return <Thanks close={handleClose} />
  }

  if (mentorId && username) {
    return (
      <GiveStar
        lessonId={lessonId}
        mentorId={mentorId}
        username={username}
        setMentor={setMentor}
        setDone={setDone}
      />
    )
  }

  return <SearchMentor setMentor={setMentor} mentors={mentors} />
}

type GiveStarCardProps = {
  lessonId: string
  givenStar: string
  setGivenStar: Function
} & ModalCardProps

export const GiveStarCard: React.FC<GiveStarCardProps> = ({
  lessonId,
  show,
  close,
  givenStar,
  setGivenStar
}) => {
  if (!show) return <></>
  const [done, setDone] = useState<string>('')

  const handleClose = () => {
    close()
    done && setGivenStar(done)
  }

  const displayChoice = givenStar ? (
    <div className="mb-0 mt-0 p-4 text-center">
      <h4 className="mt-0 mb-0">
        You have already given a star to
        <span className="font-italic"> {givenStar}!</span>
      </h4>
    </div>
  ) : (
    withQueryLoader<LessonMentorsData>(
      {
        query: GET_LESSON_MENTORS,
        getParams: () => ({ variables: { lessonId } })
      },
      props => <StarCard {...(props as StarCardProps)} />
    )({ lessonId: parseInt(lessonId), handleClose, done, setDone })
  )

  return (
    <ModalCard show={show} close={handleClose}>
      {displayChoice}
    </ModalCard>
  )
}
