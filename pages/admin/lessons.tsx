import React, { useState } from 'react'
import { AdminLessonInfo } from '../../components/AdminLessonInfo'
import { AdminLessonsSideBar } from '../../components/AdminLessonsSideBar'
import LoadingSpinner from '../../components/LoadingSpinner'
import Layout from '../../components/Layout'
import { withGetApp, GetAppProps } from '../../graphql'
import { Lesson } from '../../@types/adminLesson'
type AdminLessonsProps = {
  lessons: any
  setLessons: React.Dispatch<React.SetStateAction<Lesson[] | null>>
}

const AdminLessons: React.FC<AdminLessonsProps> = ({ lessons, setLessons }) => {
  const [selectedLesson, setSelectedLesson] = useState(0)

  return (
    <div className="row mt-4">
      <AdminLessonsSideBar
        setLessons={setLessons}
        lessons={lessons}
        setSelectedLesson={setSelectedLesson}
      />
      <AdminLessonInfo
        setLessons={setLessons}
        lessons={lessons}
        selectedLesson={selectedLesson}
      />
    </div>
  )
}

const Lessons: React.FC<GetAppProps> = ({ data }) => {
  const { loading, error, lessons, session } = data
  const [lessonsList, setLessons] = useState<null | Lesson[]>(null)
  return (
    <Layout>
      {loading && <LoadingSpinner />}
      {error && <h1>Error</h1>}
      {session && session.user && session.user.isAdmin === 'true' && (
        <AdminLessons
          lessons={lessonsList || lessons}
          setLessons={setLessons}
        />
      )}
    </Layout>
  )
}

export default withGetApp()(Lessons)
