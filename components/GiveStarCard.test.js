import React from 'react'
import { render, fireEvent, wait, act, getByRole } from '@testing-library/react'
import { GiveStarCard } from './GiveStarCard'
import { MockedProvider } from '@apollo/react-testing'
import SET_STAR from '../graphql/queries/setStar'
import GET_LESSON_MENTORS from '../graphql/queries/getLessonMentors'
import lessonMentorsData from '../__dummy__/getLessonMentorsData'
const mockSetStarMutatation = {
  request: {
    query: SET_STAR,
    variables: { mentorId: 4, lessonId: 4, comment: '1' }
  },
  result: {
    data: { setStar: { success: true } }
  }
}
const mockGetLessonMentors = {
  request: { query: GET_LESSON_MENTORS, variables: { lessonId: '4' } },
  result: {
    data: { getLessonMentors: lessonMentorsData }
  }
}

const clickOnMentor = getByRole => {
  const mentor = getByRole('heading', { name: 'bob bafet' })
  fireEvent.mouseOver(mentor)
  fireEvent.click(mentor)
}
const giveStar = async getByRole => {
  await act(async () => {
    await wait(() => fireEvent.click(getByRole('button')))
  })
}

describe('GiveStarCard Component', () => {
  let mockProps
  beforeEach(() => {
    mockProps = {
      show: true,
      close: jest.fn(),
      setGivenStar: jest.fn(),
      lessonId: '4',
      givenStar: 'flimmy flam jam'
    }
  })
  test('should display nothing when show prop value is false', () => {
    mockProps.show = false
    const { container } = render(<GiveStarCard {...mockProps} />)
    expect(container).toMatchSnapshot()
  })

  test('should display `already given star to` display when givenStar prop does not equal empty string', () => {
    const { container, getByText } = render(<GiveStarCard {...mockProps} />)
    const alreadyDisplay = getByText('You have already given a star to')
    expect(alreadyDisplay).toBeTruthy()
    expect(container).toMatchSnapshot()
  })

  test('should display SearchMentor component if givenStar prop equals empty string', async () => {
    mockProps.givenStar = ''
    const mocks = [mockSetStarMutatation, mockGetLessonMentors]
    const { container, getByRole, getByTestId } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <GiveStarCard {...mockProps} />
      </MockedProvider>
    )
    await wait(() => expect(container).toMatchSnapshot())

    // test if searchbar works
    const searchMentorInput = getByTestId('giveStarInput')
    fireEvent.change(searchMentorInput, {
      target: { value: 'bob bafet' }
    })
    expect(searchMentorInput.value).toContain('bob bafet')
    expect(container).toMatchSnapshot()

    // test click on mentor
    clickOnMentor(getByRole)
    expect(container).toMatchSnapshot()

    // click on back button after getting to `giving a star to` display
    const backButton = getByTestId('backButton')
    fireEvent.click(backButton)
    expect(container).toMatchSnapshot()

    // clicking mentor again
    clickOnMentor(getByRole)

    // test if textbox works in `giving a star to` display
    const commentBox = getByRole('textbox')
    fireEvent.change(commentBox, { target: { value: '1' } })

    // test giving a star and `thanks` display
    await giveStar(getByRole)

    await wait(() => expect(container).toMatchSnapshot())
    // check if thanks display shows up
    const thanks = getByRole('heading', {
      name: 'Thanks for letting us know!'
    })
    expect(thanks).toBeTruthy()

    // check if setGivenStar function is called
    const exitBtn = getByRole('button')
    fireEvent.click(exitBtn)
    expect(mockProps.setGivenStar).toBeCalledWith('bob')
  })

  test('should display error message when giving a star fails', async () => {
    mockProps.givenStar = ''
    const setStarError = { ...mockSetStarMutatation }
    delete setStarError.result
    setStarError.error = new Error()
    const mocks = [mockGetLessonMentors, setStarError]
    const { container, getByRole } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <GiveStarCard {...mockProps} />
      </MockedProvider>
    )
    await wait(() => expect(container).toMatchSnapshot())

    clickOnMentor(getByRole)

    await giveStar(getByRole)
    const error = getByRole('heading', {
      name: 'Error sending star, please try again'
    })
    expect(error).toBeTruthy()
    expect(container).toMatchSnapshot()
  })
})
