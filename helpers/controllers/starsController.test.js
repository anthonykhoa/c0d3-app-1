jest.mock('../../helpers/dbload')
jest.mock('../../helpers/validateLessonId')
import { setStar, starsGiven } from './starsController'
import { validateLessonId } from '../validateLessonId'
import db from '../dbload'

const { Star } = db
const ctx = {
  req: {
    error: jest.fn(),
    user: { id: 1337 }
  }
}
describe('setStar resolver', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    validateLessonId.mockReturnValue(true)
    Star.findAll = jest.fn().mockReturnValue([])
    Star.create = jest.fn().mockReturnValue({ success: true })
  })

  test('should return success object if no errors are thrown, and Star.create is called', async () => {
    const res = await setStar(null, { lessonId: 52226, mentorId: 815 }, ctx)
    expect(Star.create).toHaveBeenCalledTimes(1)
    expect(res).toEqual({ success: true })
  })

  test('should jump to catch block and call req.error when calling Star.create creates an error', async () => {
    Star.create = jest.fn().mockImplementation(() => {
      throw new Error()
    })
    await expect(
      setStar(null, { lessonId: 5, mentorId: 815 }, ctx)
    ).rejects.toThrowError()
    expect(Star.create).toHaveBeenCalledTimes(1)
    expect(ctx.req.error).toHaveBeenCalledTimes(1)
  })

  test('should call Star.destroy when relationship between studentId and lessonId \
   has already been made inside the Stars table of the database', async () => {
    Star.findAll = jest.fn().mockReturnValue(['Potatus Maximus'])
    await setStar(null, { lessonId: 5, mentorId: 5 }, ctx)
    expect(Star.destroy).toHaveBeenCalledTimes(1)
    expect(Star.create).toHaveBeenCalledTimes(1)
  })

  test('should throw error if lessonId does not exist', async () => {
    validateLessonId.mockImplementation(() => {
      throw new Error()
    })
    await expect(
      setStar(null, { lessonId: 5, mentorId: 815 }, ctx)
    ).rejects.toThrowError()
    expect(Star.create).toHaveBeenCalledTimes(0)
  })

  test('should throw error if user is not logged in', async () => {
    ctx.req.user = null
    await expect(
      setStar(null, { lessonId: 5, mentorId: 815 }, ctx)
    ).rejects.toThrowError()
    expect(Star.create).toHaveBeenCalledTimes(0)
  })
})

describe('starsGiven resolver', () => {
  test('should return list of stars a student has given for a lesson module', async () => {
    ctx.req.user = { id: 1337 }
    Star.findAll = jest.fn().mockReturnValue(['Potatus Maximus'])
    const res = await starsGiven(null, { lessonId: 4 }, ctx)
    expect(res).toEqual(['Potatus Maximus'])
  })

  test('should throw error if lessonId does not exist', async () => {
    validateLessonId.mockImplementation(() => {
      throw new Error()
    })
    await expect(starsGiven(null, { lessonId: 5 }, ctx)).rejects.toThrowError()
    expect(Star.create).toHaveBeenCalledTimes(0)
  })

  test('should throw error if user is not logged in', async () => {
    ctx.req.user = null
    await expect(starsGiven(null, { lessonId: 5 }, ctx)).rejects.toThrowError()
    expect(Star.create).toHaveBeenCalledTimes(0)
  })
})