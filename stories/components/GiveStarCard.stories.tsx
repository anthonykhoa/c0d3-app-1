import { MockedProvider } from '@apollo/react-testing'
import React, { useState } from 'react'
// import { action } from '@storybook/addon-actions'
import { GiveStarCard } from '../../components/GiveStarCard'
import { Button } from '../../components/theme/Button'
import GET_LESSON_MENTORS from '../../graphql/queries/getLessonMentors'
import SET_STAR from '../../graphql/queries/setStar'
export default {
  component: GiveStarCard,
  title: 'Components/GiveStarCard'
}

const mocks = [
  {
    request: { query: GET_LESSON_MENTORS, variables: { lessonId: '4' } },
    result: {
      data: {
        getLessonMentors: [
          { username: 'bob', name: 'bob bafet', id: '4' },
          { username: 'bleamie', name: 'boba boba', id: '4' },
          { username: 'fork', name: 'bo bo', id: '4' },
          { username: 'forkUnicorn', name: 'kang bo', id: '4' },
          // {
          //   username:
          //     'POTATOMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
          //   name:
          //     'POTATOMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM'
          // },
          { username: 'enlightenedBanana', name: 'never wanna', id: '4' },
          { username: 'seriousToiletPaper', name: 'give you', id: '4' },
          { username: 'pencilSaver', name: 'let you', id: '4' },
          { username: 'importantBagel', name: 'up down', id: '4' },
          { username: 'bagelOfAngels', name: 'wax on', id: '4' },
          { username: 'l0lCakes', name: 'wax off', id: '4' },
          { username: 'pencilSaver', name: 'let you', id: '4' },
          { username: 'importantBagel', name: 'up down', id: '4' },
          { username: 'bagelOfAngels', name: 'wax on', id: '4' }
        ]
      }
    }
  },
  {
    request: {
      query: SET_STAR,
      variables: { mentorId: 803, lessonId: 433 }
      // context: {
      //   req: {
      //     user: {
      //       id: 444
      //     }
      //   }
      // }
    },
    result: {
      data: {
        setStar: {
          success: true
        }
      }
    }
  }
]

// const add = (num1: number, num2: number): number => {
//   return num1 + num2
// }

const MockBasic: React.FC = () => {
  const [show, setShow] = useState(true)

  const close = () => setShow(false)
  return (
    <>
      <Button onClick={() => setShow(!show)}>Launch demo modal</Button>
      <MockedProvider mocks={mocks} addTypename={false}>
        <GiveStarCard givenStar="" lessonId={'4'} show={show} close={close} />
      </MockedProvider>
    </>
  )
}

const MockAlreadyGaveStar: React.FC = () => {
  const [show, setShow] = useState(true)
  const close = () => setShow(false)
  return (
    <>
      <Button onClick={() => setShow(!show)}>Launch demo modal</Button>
      <MockedProvider mocks={mocks} addTypename={false}>
        <GiveStarCard
          givenStar="omega shenron"
          lessonId={'4'}
          show={show}
          close={close}
        />
      </MockedProvider>
    </>
  )
}

export const Basic: React.FC = () => {
  return <MockBasic />
}

export const AlreadyGaveStar: React.FC = () => {
  return <MockAlreadyGaveStar />
}
