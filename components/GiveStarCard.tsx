import React, { useState } from 'react'
import { User } from '../graphql/index'
import withQueryLoader, { QueryDataProps } from '../containers/withQueryLoader'
import { Button } from '../components/theme/Button'
import GET_LESSON_MENTORS from '../graphql/queries/getLessonMentors'
import '../scss/giveStarCard.scss'
import SET_STAR from '../graphql/queries/setStar'
import { useMutation } from '@apollo/react-hooks'
import { ModalCard, ModalCardProps } from './ModalCard'
import { Thanks } from './Thanks'

type GiveStarType = {
  mentorId?: number
  username?: string
  done?: boolean
}

interface Select {
  username: string
  mentorId: number
  setGiveStar: React.Dispatch<React.SetStateAction<GiveStarType>>
}

const GiveStar: React.FC<{ lessonId: number } & Select> = ({
  username,
  mentorId,
  lessonId,
  setGiveStar
}) => {
  const [comment, setComment] = useState('')
  //replace with useSetStarMutation
  const [setStar, { data }] = useMutation(SET_STAR)

  console.log(data)
  const giveStar = async () => {
    try {
      await setStar({ variables: { mentorId, lessonId, comment } })
      setGiveStar({ done: true })
    } catch (err) {
      throw new Error(err)
    }
  }
  // const giveStar = () => {
  //   setGiveStar({ done: true })
  // }
  // if (0) {
  //   console.log(mentorId, lessonId, comment)
  // }

  return (
    <>
      <div className="position-absolute left-0">
        <img
          className=".img-fluid btn"
          src="/curriculumAssets/icons/left-arrow.svg"
          onClick={() => setGiveStar({})}
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

const Mentor: React.FC<{ name: string } & Select> = ({
  username,
  name,
  mentorId,
  setGiveStar
}) => (
  <div
    className="mb-3 rounded-lg d-flex justify-content-center align-items-center flex-column mentor position-relative"
    onClick={() => setGiveStar({ username, mentorId })}
  >
    <div className="text-white position-absolute mentor sendStar align-items-center justify-content-center">
      <h5>Send Star</h5>
    </div>
    <h6 className="mb-0 font-weight-light">{name}</h6>
    <span className="text-muted font-weight-light">@{username}</span>
  </div>
)

type SearchMentorProps = {
  setGiveStar: React.Dispatch<React.SetStateAction<GiveStarType>>
  mentors: User[]
}

const SearchMentor: React.FC<SearchMentorProps> = ({
  setGiveStar,
  mentors
}) => {
  const [search, setSearch] = useState<string>('')

  const searchTerm = search.toLowerCase()
  const includes = (str: string) => str.toLowerCase().includes(searchTerm)
  const filteredList = mentors.filter(({ username, name }) => {
    return includes(username as string) || includes(name as string)
  })

  const mentorsList = filteredList.map(({ username, name, id }, key) => (
    <Mentor
      key={key}
      username={username as string}
      name={name as string}
      mentorId={parseInt(id as string)}
      setGiveStar={setGiveStar}
    />
  ))

  return (
    <>
      <div className="d-flex flex-column pt-2 pt-4 pl-5 pr-5 pb-4">
        <h4 className="font-weight-bold mt-2 mb-4 pt-2 pb-1">
          Who helped you the most?
        </h4>
        <input
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

type LessonMentorsData = { getLessonMentors: User[] }
type StarCardProps = { close: Function; lessonId: string } & QueryDataProps<
  LessonMentorsData
>

const StarCard: React.FC<StarCardProps> = ({
  close,
  lessonId,
  queryData: { getLessonMentors }
}) => {
  const [{ mentorId, username, done }, setGiveStar] = useState<GiveStarType>({})

  if (done) {
    return <Thanks close={close} />
  }

  if (mentorId) {
    return (
      <GiveStar
        lessonId={parseInt(lessonId)}
        mentorId={mentorId}
        username={username as string}
        setGiveStar={setGiveStar}
      />
    )
  }

  return <SearchMentor setGiveStar={setGiveStar} mentors={getLessonMentors} />
}

type GiveStarCardProps = {
  lessonId: string
  givenStar: string
} & ModalCardProps

export const GiveStarCard: React.FC<GiveStarCardProps> = ({
  lessonId,
  show,
  close,
  givenStar
}) => (
  <ModalCard show={show} close={close}>
    {givenStar ? (
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
      )({ lessonId, close })
    )}
  </ModalCard>
)
