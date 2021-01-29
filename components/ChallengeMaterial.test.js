import React from 'react'
import dayjs from 'dayjs'
import { render, fireEvent, waitFor, act } from '@testing-library/react'
import ChallengeMaterial from './ChallengeMaterial'
import SET_STAR from '../graphql/queries/setStar'
import GET_LESSON_MENTORS from '../graphql/queries/getLessonMentors'
import lessonMentorsData from '../__dummy__/getLessonMentorsData'
import { MockedProvider } from '@apollo/react-testing'

const mocks = [
  {
    request: {
      query: SET_STAR,
      variables: { mentorId: 4, lessonId: 5, comment: '1' }
    },
    result: {
      data: { setStar: { success: true } }
    }
  },
  {
    request: { query: GET_LESSON_MENTORS, variables: { lessonId: '5' } },
    result: {
      data: { getLessonMentors: lessonMentorsData }
    }
  }
]
const lessonStatusNoPass = {
  isEnrolled: '213423534',
  isTeaching: null,
  starGiven: ''
}
const challenges = [
  {
    id: '105',
    description:
      'Write a function that takes in a number and returns true if that number is greater than 5. Otherwise, return false.',
    title: 'Greater than 5',
    order: 0,
    __typename: 'Challenge'
  },
  {
    id: '107',
    description:
      'Write a function that takes in 2 numbers and returns their sum.',
    title: 'Sum of 2 Numbers',
    order: 1,
    __typename: 'Challenge'
  }
]
describe('Curriculum challenge page', () => {
  let props
  beforeEach(() => {
    props = {
      challenges,
      lessonStatus: lessonStatusNoPass,
      userSubmissions: [],
      chatUrl: 'https://chat.c0d3.com/c0d3/channels/js0-foundations',
      lessonId: '5'
    }
  })
  test('Should render appropriately when no challenges are passed to component', async () => {
    const { container } = render(
      <ChallengeMaterial
        challenges={[]}
        userSubmissions={[]}
        lessonStatus={lessonStatusNoPass}
        chatUrl="https://chat.c0d3.com/c0d3/channels/js0-foundations"
        lessonId="5"
      />
    )
    await waitFor(() => {
      expect(container).toMatchSnapshot()
    })
  })
  test('Should render first challenge by default when user has no submissions', async () => {
    const { container } = render(
      <ChallengeMaterial
        challenges={[]}
        userSubmissions={[]}
        lessonStatus={lessonStatusNoPass}
        chatUrl="https://chat.c0d3.com/c0d3/channels/js0-foundations"
        lessonId="5"
      />
    )
    expect(container).toMatchSnapshot()
  })
  test('Should render clicked challenge within challenge question', async () => {
    const { getAllByTestId, container } = render(
      <ChallengeMaterial {...props} />
    )
    const challengeTitleCard = getAllByTestId('challenge-title')[1]
    fireEvent.click(challengeTitleCard)
    await waitFor(() => expect(container).toMatchSnapshot())
  })
  test('Should render first challenge that is not passed when user has submissions', async () => {
    props.userSubmissions = [
      {
        id: '3500',
        status: 'open',
        mrUrl: 'github.com/testmrurl',
        diff:
          'diff --git a/curriculum/js0/2.js b/curriculum/js0/2.js\nindex 647ca32..ac44196 100644\n--- a/curriculum/js0/2.js\n+++ b/curriculum/js0/2.js\n@@ -7,7 +7,7 @@\n  */\n \n const solution = (a, b, c) => {\n-  return 0;\n+  return a + b + c;\n };\n \n module.exports = {\n',
        viewCount: 0,
        comment: null,
        challengeId: '105',
        reviewer: null,
        createdAt: '1586907809223',
        updatedAt: dayjs().subtract(16, 'day').valueOf()
      },
      {
        id: '3501',
        status: 'needMoreWork',
        mrUrl: 'github.com/testmrurl2',
        diff:
          'diff --git a/curriculum/js0/2.js b/curriculum/js0/2.js\nindex 647ca32..ac44196 100644\n--- a/curriculum/js0/2.js\n+++ b/curriculum/js0/2.js\n@@ -7,7 +7,7 @@\n  */\n \n const solution = (a, b, c) => {\n-  return 0;\n+  return a + b + c;\n };\n \n module.exports = {\n',
        viewCount: 0,
        comment: 'test comment',
        challengeId: '107',
        reviewer: {
          id: '1',
          username: 'dan'
        },
        createdAt: '1586907809223',
        updatedAt: dayjs().subtract(16, 'day').valueOf()
      }
    ]
    const { container } = render(
      <ChallengeMaterial
        challenges={[]}
        userSubmissions={[]}
        lessonStatus={lessonStatusNoPass}
        chatUrl="https://chat.c0d3.com/c0d3/channels/js0-foundations"
        lessonId="5"
      />
    )
    expect(container).toMatchSnapshot()
  })

  test('Should render challenge material page differently when user has passed all their challenges', async () => {
    props.lessonStatus = {
      isEnrolled: '213423534',
      isPassed: '123456789',
      isTeaching: null,
      starGiven: ''
    }
    props.userSubmissions = [
      {
        id: '3500',
        status: 'passed',
        mrUrl: 'github.com/testmrurl',
        diff:
          'diff --git a/curriculum/js0/2.js b/curriculum/js0/2.js\nindex 647ca32..ac44196 100644\n--- a/curriculum/js0/2.js\n+++ b/curriculum/js0/2.js\n@@ -7,7 +7,7 @@\n  */\n \n const solution = (a, b, c) => {\n-  return 0;\n+  return a + b + c;\n };\n \n module.exports = {\n',
        viewCount: 0,
        comment: null,
        challengeId: '105',
        reviewer: null,
        createdAt: '1586907809223',
        updatedAt: '1586907825090'
      },
      {
        id: '3501',
        status: 'passed',
        mrUrl: 'github.com/testmrurl2',
        diff:
          'diff --git a/curriculum/js0/2.js b/curriculum/js0/2.js\nindex 647ca32..ac44196 100644\n--- a/curriculum/js0/2.js\n+++ b/curriculum/js0/2.js\n@@ -7,7 +7,7 @@\n  */\n \n const solution = (a, b, c) => {\n-  return 0;\n+  return a + b + c;\n };\n \n module.exports = {\n',
        viewCount: 0,
        comment: 'test comment',
        challengeId: '107',
        reviewer: {
          id: '1',
          username: 'dan'
        },
        createdAt: '1586907809223',
        updatedAt: '1586907825090'
      }
    ]
    const { container, getByRole, queryByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ChallengeMaterial {...props} />
      </MockedProvider>
    )
    await waitFor(() => expect(container).toMatchSnapshot())
    fireEvent.click(getByRole('button', { name: 'Give Star' }))
    await waitFor(() => queryByText('Who helped you the most?'))
    await waitFor(() => expect(document.body).toMatchSnapshot())

    // click exit button of GiveStarCard
    fireEvent.click(getByRole('img'))
    await waitFor(() => expect(document.body).toMatchSnapshot())
  })
})
